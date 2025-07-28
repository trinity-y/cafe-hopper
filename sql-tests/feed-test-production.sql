-- create the view of reviews for user 247
CREATE OR REPLACE VIEW "reviewsAndLikesForUser247" AS
SELECT "rid", "overallRating", "foodRating", "drinkRating", "atmosphereRating", "notes", "timestamp", "author", "cid", COALESCE("likes", 0) AS likes
FROM
(SELECT 
    "Reviews"."id" AS "rid",
    "Reviews"."rating" AS "overallRating",
    "Reviews"."drinkrating" AS "drinkRating",
    "Reviews"."foodrating" AS "foodRating",
    "Reviews"."atmosphererating" AS "atmosphereRating",
    "Reviews"."notes" AS "notes",
    "Reviews"."timestamp" AS "timestamp",
    "Reviews"."uid" AS "author",
    "Reviews"."cid" AS "cid",
    "Friend"."user_id" AS "uid"
FROM "Reviews" INNER JOIN "Friend" ON "Reviews"."uid" = "Friend"."following_id"
WHERE "Friend"."user_id" = 247
LIMIT 50 ) AS "friendReviews" LEFT JOIN
( SELECT COUNT(*) AS likes, rid AS likerid
FROM "Reaction" WHERE "reaction" = 'like'
GROUP BY "rid" ) AS "likeCounts"
ON "friendReviews"."rid" = "likeCounts"."likerid";

-- get info needed for frontend
SELECT "User"."username", "User"."id" AS uid, "Cafe"."name", "rid", "overallRating", "drinkRating", "foodRating", "atmosphereRating", "notes", "timestamp", "likes"
FROM "reviewsAndLikesForUser247", "User", "Cafe"
WHERE "reviewsAndLikesForUser247"."author" = "User"."id" AND
    "reviewsAndLikesForUser247"."cid" = "Cafe"."id"
ORDER BY "timestamp" DESC;