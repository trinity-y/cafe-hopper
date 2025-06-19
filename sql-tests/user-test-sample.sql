-- creating the user table
CREATE TABLE IF NOT EXISTS "User" (
              id SERIAL PRIMARY KEY,
              "username" VARCHAR(100) NOT NULL UNIQUE,
              "firebase_uid" VARCHAR(100) NOT NULL UNIQUE
            );
--add new user
INSERT INTO "User" (username, firebase_uid) VALUES ('trinity6', 'aB3xYz9KlmNOqP456rstUVWX7yza');
INSERT INTO "User" (username, firebase_uid) VALUES ('safiya2', 'JkL8MnOpQrSTuvW0xyZa1Bc2DeFg');
INSERT INTO "User" (username, firebase_uid) VALUES ('celina3', 'hI3jK4LmN5oPqrStUvWxYzAbCdEf');

--username validation (find users with the same username, that way we can check if the user already exists)
SELECT * FROM "User" WHERE username = 'trinity6'; 
SELECT * FROM "User" WHERE username = 'frog7'; 
