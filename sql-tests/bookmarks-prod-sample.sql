-- Selecting bookmarks for a certain user 
SELECT * FROM "Bookmark" 	
WHERE uID = 149;

SELECT * FROM "Bookmark" 	
WHERE uID = 394;

SELECT * FROM "Bookmark" 	
WHERE uID = 32;

-- getting bookmarked cafes for a certain user
SELECT "Bookmark".id, "Cafe".id AS cafe_id, "Cafe".name, "Cafe"."googleRating"
FROM "Bookmark"
JOIN "Cafe" ON "Bookmark".cid = "Cafe".id
WHERE "Bookmark".uid = 149;