CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    "username" VARCHAR(100) NOT NULL UNIQUE,
    "firebase_uid" VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS "Cafe"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    "OpeningDays" VARCHAR(200) NOT NULL,
    "googleRating" DECIMAL(2,1) CHECK("googleRating" >= 0 AND "googleRating" <= 5)    
);
CREATE TABLE IF NOT EXISTS "Reviews" (
    id SERIAL PRIMARY KEY,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    drinkRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    foodRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    atmosphereRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    notes VARCHAR(200),
    cID INTEGER  NOT NULL REFERENCES "Cafe"(id),
    uID INTEGER NOT NULL REFERENCES "User"(id),
    UNIQUE(cID, uID)
);

INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Tranquil Java', '777 RIM Park Dr, Waterloo, ON I8P 6Z4', 'mon-sat', 4.0);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Cozy Java', '973 RIM Park Dr, Cambridge, ON A3A 0V8', 'sun-thu', 3.6);
INSERT INTO "User" (username, firebase_uid) VALUES ('trinity6', 'aB3xYz9KlmNOqP456rstUVWX7yza');
INSERT INTO "User" (username, firebase_uid) VALUES ('safiya2', 'JkL8MnOpQrSTuvW0xyZa1Bc2DeFg');

-- Insert review
INSERT INTO "Reviews" (rating, drinkRating, notes, cID, uID) VALUES (4, 4, 'nice service!', 1, 1);
INSERT INTO "Reviews" (rating, drinkRating, notes, cID, uID) VALUES (3.5, 4, '', 1, 2);
INSERT INTO "Reviews" (rating, drinkRating, notes, cID, uID) VALUES (4, 4, 'cool', 2, 1);

-- Update Review
UPDATE "Reviews" 	
SET rating = 3 	
WHERE id = 0;

-- Selecting a review from a certain cafe and user 
SELECT * FROM "Reviews" 	
WHERE cID = 1 AND uID = 1;

-- Selecting reviews from a certain cafe with a rating of below 4
SELECT * FROM "Reviews" 	
WHERE cID = 1 AND rating >= 4.0;