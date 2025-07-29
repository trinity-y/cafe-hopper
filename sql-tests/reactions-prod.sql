-- Create reaction table
CREATE TABLE IF NOT EXISTS "Reaction" (
    id SERIAL PRIMARY KEY,
    uID INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, 
    rID INT NOT NULL REFERENCES "Reviews"(id) ON DELETE CASCADE,
    reaction VARCHAR(8) NOT NULL,
    UNIQUE(uID, rID)
);

-- Perform basic operations
SELECT * FROM "Reaction";
SELECT * FROM "Reaction" WHERE uID = 79 AND rID = 122; 
DELETE FROM "Reaction" WHERE uID = 79 AND rID = 122;
SELECT * FROM "Reaction" WHERE uID = 79 AND rID = 122;