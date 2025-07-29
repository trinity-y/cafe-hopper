-- Create sample Cafe table with price fields
CREATE TABLE IF NOT EXISTS "Cafe" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    "openingDays" TEXT,
    "googleRating" DECIMAL(2,1) CHECK ("googleRating" >= 0 AND "googleRating" <= 5),
    "startPrice" INTEGER,
    "endPrice" INTEGER
);

-- Insert sample cafes with different price ranges
INSERT INTO "Cafe" (id, name, address, latitude, longitude, "openingDays", "googleRating", "startPrice", "endPrice") VALUES 
(1, 'Onyx Coffee Lab', '123 Main St', 43.4643, -80.5204, '{"weekdayDescriptions": ["Monday: 8:00 AM – 6:00 PM"]}', 4.5, 8, 15),
(2, 'London Fog Cafe', '456 King St', 43.4721, -80.5448, '{"weekdayDescriptions": ["Monday: 7:00 AM – 8:00 PM"]}', 4.2, 12, 25),  
(3, 'Ontario Brew House', '789 University Ave', 43.4735, -80.5421, '{"weekdayDescriptions": ["Monday: 6:00 AM – 9:00 PM"]}', 4.8, 15, 18),
(4, 'Budget Beans', '321 Weber St', 43.4501, -80.4925, '{"weekdayDescriptions": ["Monday: 9:00 AM – 5:00 PM"]}', 4.0, 5, 12),
(5, 'Premium Espresso', '654 Columbia St', 43.4633, -80.5237, '{"weekdayDescriptions": ["Monday: 8:30 AM – 7:00 PM"]}', 4.3, 20, 35),
(6, 'The Coffee Connection', '987 Richmond St', 43.4612, -80.5140, '{"weekdayDescriptions": ["Monday: 7:30 AM – 6:30 PM"]}', 4.1, 10, 20),
(7, 'Affordable Roasters', '147 Albert St', 43.4590, -80.5200, '{"weekdayDescriptions": ["Monday: 8:00 AM – 5:00 PM"]}', 3.9, 6, 14),
(8, 'Luxury Coffee Lounge', '258 Princess St', 43.4680, -80.5300, '{"weekdayDescriptions": ["Monday: 9:00 AM – 10:00 PM"]}', 4.7, 25, 45);


-- 1. Search for cafes with "on" in name AND price range 10-20
SELECT * FROM "Cafe" 
WHERE LOWER(name) LIKE LOWER('%' || 'On' || '%') AND
("startPrice" >= 10 AND "endPrice" <= 20)
ORDER BY name;

-- 2. Search for cafes with price range 10-20 (no name filter)
SELECT * FROM "Cafe" 
WHERE ("startPrice" >= 10 AND "endPrice" <= 20)
ORDER BY name;

-- 3. Additional test: Search for expensive cafes (>$20)
SELECT * FROM "Cafe" 
WHERE "startPrice" >= 20
ORDER BY name;

-- 4. Additional test: Search for budget cafes (<$15 max)
SELECT * FROM "Cafe" 
WHERE "endPrice" <= 15
ORDER BY name;