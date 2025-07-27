UPDATE "Reviews" 	
SET rating = 3 	
WHERE id = 2;

SELECT * FROM "Reviews" 	
WHERE cID = 3 AND rating >= 1.0;

-- This was used for cafe search
SELECT * FROM "Reviews" 	
WHERE rating < 2.0;

DELETE FROM "Reviews" 	
WHERE id = 3;