-- FOR THE SAKE OF BREVITY, SOME TABLES HERE HAVE MISSING ATTRIBUTES THAT ARE NOT RELEVANT TO THE BLEND QUERIES
-- Create tables first
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  "username" VARCHAR(100) NOT NULL UNIQUE,
  "firebase_uid" VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "Friend" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "User"(id), 
    following_id INT NOT NULL REFERENCES "User"(id), 
    UNIQUE(user_id, following_id),
    CHECK (user_id != following_id)
);

CREATE TABLE IF NOT EXISTS "Cafe" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    "openingDays" TEXT,
    "googleRating" DECIMAL(2,1) CHECK ("googleRating" >= 0 AND "googleRating" <= 5)
);

CREATE TABLE IF NOT EXISTS "Reviews" (
  id SERIAL PRIMARY KEY,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  drinkRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  foodRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  atmosphereRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  notes VARCHAR(200),
  timestamp TIMESTAMP NOT NULL,
  cID INT NOT NULL REFERENCES "Cafe"(id),
  uID INT NOT NULL REFERENCES "User"(id),
  UNIQUE(cID, uID)
);

-- Insert sample users
INSERT INTO "User" (id, username, firebase_uid) VALUES 
(751, 'testuser', 'firebase_751'),
(752, 'friend1', 'firebase_752'),
(753, 'friend2', 'firebase_753'),
(754, 'friend3', 'firebase_754'),
(755, 'nonfriend', 'firebase_755');

-- Insert friendships (751 follows 752, 753, 754)
INSERT INTO "Friend" (user_id, following_id) VALUES 
(751, 752),  -- testuser follows friend1
(751, 753),  -- testuser follows friend2
(751, 754);  -- testuser follows friend3

-- Insert sample cafes
INSERT INTO "Cafe" (id, name, address, latitude, longitude, "openingDays", "googleRating") VALUES 
(1, 'Coffee Shop A', '123 Main St', 43.4643, -80.5204, '{"weekdayDescriptions": ["Monday: 8:00 AM – 6:00 PM"]}', 4.5),
(2, 'Cafe B', '456 King St', 43.4721, -80.5448, '{"weekdayDescriptions": ["Monday: 7:00 AM – 8:00 PM"]}', 4.2),
(3, 'Brew House C', '789 University Ave', 43.4735, -80.5421, '{"weekdayDescriptions": ["Monday: 6:00 AM – 9:00 PM"]}', 4.8),
(4, 'Tea Place D', '321 Weber St', 43.4501, -80.4925, '{"weekdayDescriptions": ["Monday: 9:00 AM – 5:00 PM"]}', 4.0),
(5, 'Espresso Bar E', '654 Columbia St', 43.4633, -80.5237, '{"weekdayDescriptions": ["Monday: 8:30 AM – 7:00 PM"]}', 4.3);


-- Insert reviews - testuser (751) has visited cafes 1 and 2
INSERT INTO "Reviews" (id, rating, drinkRating, foodRating, atmosphereRating, notes, timestamp, cID, uID) VALUES 
-- testuser's reviews (these cafes will be excluded from recommendations)
(1, 4.0, 4.0, 3.5, 4.5, 'Great coffee, cozy atmosphere', '2024-01-15 10:30:00', 1, 751),
(2, 3.5, 3.0, 4.0, 3.5, 'Good food, average drinks', '2024-01-20 14:15:00', 2, 751),

-- friend1's reviews
(3, 4.5, 4.5, 4.0, 4.5, 'Amazing espresso!', '2024-01-10 09:00:00', 3, 752),
(4, 4.0, 4.0, 4.0, 4.0, 'Solid choice for work', '2024-01-12 11:30:00', 4, 752),
(5, 3.8, 3.5, 4.0, 4.0, 'Nice tea selection', '2024-01-18 15:45:00', 5, 752),

-- friend2's reviews  
(6, 4.2, 4.0, 4.5, 4.0, 'Love their pastries', '2024-01-08 08:30:00', 3, 753),
(7, 4.8, 5.0, 4.5, 4.5, 'Best coffee in town!', '2024-01-14 16:20:00', 4, 753),

-- friend3's reviews
(8, 4.0, 3.8, 4.2, 4.0, 'Good for studying', '2024-01-11 13:10:00', 4, 754),
(9, 4.3, 4.5, 4.0, 4.5, 'Great atmosphere', '2024-01-16 17:30:00', 5, 754),

-- nonfriend's review (should not appear in recommendations)
(10, 5.0, 5.0, 5.0, 5.0, 'Perfect!', '2024-01-19 12:00:00', 3, 755);

-- Get all my friends
WITH my_friends AS (
    SELECT following_id
    FROM "Friend" as f
    WHERE f.user_id = 751  -- Changed from $1 to actual user ID
),

-- Get all the cafes I have visited
my_visited AS (
    SELECT cid as cafe_id
    FROM "Reviews" as r
    WHERE r.uid = 751  -- Changed from $1 to actual user ID
),

-- Get all the cafes and their avg rating that I haven't visited but my friends have. 
top_k AS (
    SELECT r.cid AS cafe_id, AVG(r.rating) AS avg_rating, COUNT(*) AS friend_count
    FROM "Reviews" AS r
    WHERE r.uid IN (
        SELECT following_id FROM my_friends
    )
    AND 
    r.cid NOT IN (
        SELECT my_visited.cafe_id 
        FROM my_visited
    )
    GROUP BY r.cid
    HAVING COUNT(*) >= 2
),

-- Get all cafes for each one of my friends 
top_cafe_per_friend AS (
    SELECT DISTINCT ON (r.uid)
    r.uid,
    r.cid AS cafe_id,
    r.rating
    FROM "Reviews" AS r
    WHERE r.uid IN (
        SELECT following_id FROM my_friends
    )
    AND r.cid NOT IN (
        SELECT my_visited.cafe_id 
        FROM my_visited
    )
    ORDER BY r.uid, r.rating DESC, r.id DESC
), 

-- Remove the top_cafe_per_friend already in top_k. 
unique_top_k_cafe_per_friend AS (
    SELECT tc.cafe_id, tc.rating
    FROM top_cafe_per_friend AS tc
    WHERE tc.cafe_id NOT IN (
        SELECT top_k.cafe_id
        FROM top_k
    ) 
    ORDER BY tc.rating DESC
    LIMIT 5
),

final_recommendations AS (
    SELECT 
        tk.cafe_id,
        tk.avg_rating as rating
    FROM top_k tk
    
    UNION ALL
    
    SELECT 
        utc.cafe_id,
        utc.rating
    FROM unique_top_k_cafe_per_friend utc
)

SELECT * FROM (
    SELECT DISTINCT ON (fr.cafe_id)
        fr.cafe_id as id,
        c.name,
        c.address,
        c."openingDays",
        c."googleRating",
        fr.rating as "finalRating",
        r.notes as "friendNotes",
        u.username as "friendUsername"
    FROM final_recommendations fr
    JOIN "Cafe" c ON fr.cafe_id = c.id
    JOIN "Reviews" r ON r.cid = fr.cafe_id 
        AND r.uid IN (SELECT following_id FROM my_friends)
    JOIN "User" u ON r.uid = u.id
    ORDER BY fr.cafe_id, r.rating DESC  
) AS final_result
ORDER BY final_result."finalRating" DESC, final_result.id ASC  
LIMIT 10;