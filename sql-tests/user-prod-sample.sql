-- creating the user table is ommitted here, since production data is already seeded into an existing table.
-- you can see the query in the seed.js file.
-- add new user
INSERT INTO "User" (username, firebase_uid) VALUES ('trinity6', 'aB3xYz9KlmNOqP456rstUVWX7yza');
INSERT INTO "User" (username, firebase_uid) VALUES ('safiya2', 'JkL8MnOpQrSTuvW0xyZa1Bc2DeFg');
INSERT INTO "User" (username, firebase_uid) VALUES ('celina3', 'hI3jK4LmN5oPqrStUvWxYzAbCdEf');

--username validation (find users with the same username, that way we can check if the user already exists)
SELECT * FROM "User" WHERE username = 'trinity6'; -- now exists in prod db
SELECT * FROM "User" WHERE username = 'frog7'; -- should not exist in prod db
SELECT * FROM "User" WHERE username = 'deferentialtumbleweed'; -- exists in prod db
