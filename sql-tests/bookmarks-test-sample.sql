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


CREATE TABLE IF NOT EXISTS "Bookmark" (
              id SERIAL PRIMARY KEY
              uid INT NOT NULL REFERENCES User(id), 
              cid INT NOT NULL REFERENCES Cafe(id)
              UNIQUE(cid, uid)
);




INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Tranquil Java', '777 RIM Park Dr, Waterloo, ON I8P 6Z4', 'mon-sat', 4.0);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Cozy Java', '973 RIM Park Dr, Cambridge, ON A3A 0V8', 'sun-thu', 3.6);
INSERT INTO "User" (username, firebase_uid) VALUES ('trinity6', 'aB3xYz9KlmNOqP456rstUVWX7yza');
INSERT INTO "User" (username, firebase_uid) VALUES ('safiya2', 'JkL8MnOpQrSTuvW0xyZa1Bc2DeFg');

-- Insert bookmark
INSERT INTO "Bookmark" (uid, cid) VALUES (1, 2);