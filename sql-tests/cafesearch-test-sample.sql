-- creating the cafe table
CREATE TABLE IF NOT EXISTS "Cafe"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    "OpeningDays" VARCHAR(200) NOT NULL,
    "googleRating" DECIMAL(2,1) CHECK("googleRating" >= 0 AND "googleRating" <= 5)    
);

-- add new cafe
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Tranquil Java', '777 RIM Park Dr, Waterloo, ON I8P 6Z4', 'mon-sat', 4.0);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Cozy Java', '973 RIM Park Dr, Cambridge, ON A3A 0V8', 'sun-thu', 3.6);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Urban Java', '419 King St N, Toronto, ON X5O 3L4', 'mon-sat', 3.6);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Brewed Java', '411 Ottawa St, Kitchener, ON R4L 7X6', 'sat-sun', 4.2);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Copper Java', '910 King St N, Waterloo, ON V1V 6A5', 'mon-fri', 3.7);
INSERT INTO "Cafe" (name, address, "OpeningDays", "googleRating") VALUES ('Midnight Parlor"', '358 Homer Watson Blvd, Toronto, ON Z7M 3Z3', 'mon-sat', 4.9);

-- search for cafes by name
SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%MIDNIGHT%') ORDER BY name LIMIT 10;
SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%JavA%') ORDER BY name LIMIT 10;

