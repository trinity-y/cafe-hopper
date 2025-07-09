SET client_encoding = 'UTF8'; -- this is required because the google API returns opening hour objects with a character that is only available in UTF8 encoding

-- creating the user table is ommitted here, since production data is already seeded into an existing table (see seed.js).

-- add new cafe (this is an example, again, this is done in the seed.js file using generated seeding data)
INSERT INTO "Cafe" (name, address, latitude, longitude, "openingDays", "googleRating") VALUES
('La La Bakeshop', '130 King St S unit 102, Waterloo, ON N2J 1K9', 43.4745349, -81.5324198,
 '{"openNow":false,"periods":[{"open":{"day":0,"hour":8,"minute":0},"close":{"day":0,"hour":20,"minute":0}},{"open":{"day":1,"hour":8,"minute":0},"close":{"day":1,"hour":20,"minute":0}},{"open":{"day":2,"hour":8,"minute":0},"close":{"day":2,"hour":20,"minute":0}},{"open":{"day":3,"hour":8,"minute":0},"close":{"day":3,"hour":20,"minute":0}},{"open":{"day":4,"hour":8,"minute":0},"close":{"day":4,"hour":20,"minute":0}},{"open":{"day":5,"hour":8,"minute":0},"close":{"day":5,"hour":20,"minute":0}},{"open":{"day":6,"hour":8,"minute":0},"close":{"day":6,"hour":20,"minute":0}}],"weekdayDescriptions":["Monday: 8:00 AM - 8:00 PM","Tuesday: 8:00 AM - 8:00 PM","Wednesday: 8:00 AM - 8:00 PM","Thursday: 8:00 AM - 8:00 PM","Friday: 8:00 AM - 8:00 PM","Saturday: 8:00 AM - 8:00 PM","Sunday: 8:00 AM - 8:00 PM"],"nextOpenTime":"2025-07-08T12:00:00Z"}',
 4.7);

INSERT INTO "Cafe" (name, address, latitude, longitude, "openingDays", "googleRating") VALUES
('Tsujiri Waterloo', '330 Phillip St Unit 3, Waterloo, ON N2L 3W9', 43.4760208, -80.5414085,
 '{"openNow":false,"periods":[{"open":{"day":1,"hour":14,"minute":0},"close":{"day":1,"hour":21,"minute":30}},{"open":{"day":2,"hour":12,"minute":0},"close":{"day":2,"hour":21,"minute":30}},{"open":{"day":3,"hour":12,"minute":0},"close":{"day":3,"hour":21,"minute":30}},{"open":{"day":4,"hour":12,"minute":0},"close":{"day":4,"hour":21,"minute":30}},{"open":{"day":5,"hour":13,"minute":0},"close":{"day":5,"hour":21,"minute":0}},{"open":{"day":6,"hour":13,"minute":0},"close":{"day":6,"hour":21,"minute":0}},{"open":{"day":0,"hour":12,"minute":0},"close":{"day":0,"hour":21,"minute":30}}],"weekdayDescriptions":["Monday: 12:00 PM - 9:30 PM","Tuesday: 2:00 PM - 9:30 PM","Wednesday: 12:00 PM - 9:30 PM","Thursday: 12:00 PM - 9:30 PM","Friday: 12:00 PM - 9:30 PM","Saturday: 1:00 PM - 9:00 PM","Sunday: 1:00 PM - 9:00 PM"],"nextOpenTime":null}',
 4.7);

INSERT INTO "Cafe" (name, address, latitude, longitude, "openingDays", "googleRating") VALUES
('ICHA TEA', '235 Spadina Ave. Unit 4, Toronto, ON M5T 2E2', 43.6514215, -79.3996374,
 '{"openNow":false,"periods":[{"open":{"day":1,"hour":12,"minute":0},"close":{"day":1,"hour":21,"minute":0}},{"open":{"day":2,"hour":12,"minute":0},"close":{"day":2,"hour":21,"minute":0}},{"open":{"day":3,"hour":12,"minute":0},"close":{"day":3,"hour":21,"minute":0}},{"open":{"day":4,"hour":12,"minute":0},"close":{"day":4,"hour":22,"minute":0}},{"open":{"day":5,"hour":12,"minute":0},"close":{"day":5,"hour":22,"minute":0}},{"open":{"day":6,"hour":12,"minute":0},"close":{"day":6,"hour":21,"minute":0}},{"open":{"day":0,"hour":12,"minute":0},"close":{"day":0,"hour":21,"minute":0}}],"weekdayDescriptions":["Monday: 12:00 PM - 9:00 PM","Tuesday: 12:00 PM - 9:00 PM","Wednesday: 12:00 PM - 9:00 PM","Thursday: 12:00 PM - 9:00 PM","Friday: 12:00 PM - 10:00 PM","Saturday: 12:00 PM - 10:00 PM","Sunday: 12:00 PM - 9:00 PM"],"nextOpenTime":null}',
 4.5);

-- search for cafes by name
SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%MIDNIGHT%') ORDER BY name LIMIT 10;
SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%covenant%') ORDER BY name LIMIT 10;
SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%starbu%') ORDER BY name LIMIT 20;
