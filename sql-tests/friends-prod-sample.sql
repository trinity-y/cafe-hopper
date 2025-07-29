-- searching for users
SELECT id, username, firebase_uid
FROM "User" u
WHERE u.username ILIKE '%rac%'
    AND u.id != 100
    AND NOT EXISTS (
        SELECT 1 FROM "Friend" f
        WHERE f.user_id = 100 AND f.following_id = u.id)
LIMIT 10;

-- select friends for a user
SELECT u.id, u.username, u.firebase_uid
FROM "Friend" f
JOIN "User" u ON f.following_id = u.id
WHERE f.user_id = 100;

SELECT u.id, u.username, u.firebase_uid
FROM "Friend" f
JOIN "User" u ON f.following_id = u.id
WHERE f.user_id = 300;

-- select mutuals for a user
SELECT u.id, u.username, u.firebase_uid
FROM "Mutuals" m
JOIN "User" u ON m.friend_id = u.id
WHERE m.user_id = 100;

SELECT u.id, u.username, u.firebase_uid
FROM "Mutuals" m
JOIN "User" u ON m.friend_id = u.id
WHERE m.user_id = 751;

-- select all mutuals
SELECT * FROM "Mutuals";
