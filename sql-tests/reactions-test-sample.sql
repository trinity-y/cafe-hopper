-- Create reaction table
CREATE TABLE IF NOT EXISTS "Reaction" (
    id SERIAL PRIMARY KEY,
    uID INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, 
    rID INT NOT NULL REFERENCES "Reviews"(id) ON DELETE CASCADE,
    reaction VARCHAR(8) NOT NULL,
    UNIQUE(uID, rID)
);

-- Populate reaction table
INSERT INTO "Reaction" (uID, rID, reaction) VALUES (1, 5, 'like');
INSERT INTO "Reaction" (uID, rID, reaction) VALUES (2, 5, 'dislike');
INSERT INTO "Reaction" (uID, rID, reaction) VALUES (1, 7, 'dislike');

-- Perform basic operations
SELECT * FROM "Reaction";
SELECT * FROM "Reaction" WHERE uID = 1 AND rID = 5; 
DELETE FROM "Reaction" WHERE uID = 1 AND rID = 7;
SELECT * FROM "Reaction" WHERE uID = 1 AND rID = 7;
