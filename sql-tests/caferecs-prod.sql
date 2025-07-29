DROP VIEW IF EXISTS "TopCafes";

-- order by top ratings descending
CREATE VIEW "TopCafes" AS
SELECT * FROM "Cafe"
WHERE "googleRating" IS NOT NULL
ORDER BY "googleRating" DESC
LIMIT 20; -- only for the sake of brevity, limit to top 20 cafes

-- select from "TopCafes"
SELECT * FROM "TopCafes";
