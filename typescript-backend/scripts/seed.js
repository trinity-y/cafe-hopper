const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

async function seedDatabase() {
    const client = await pool.connect();

    try {
        await client.query(`
            DROP TABLE IF EXISTS "Cafe" CASCADE;
            DROP TABLE IF EXISTS "User" CASCADE;
            DROP TABLE IF EXISTS "Reviews" CASCADE;
            DROP TABLE IF EXISTS "Reaction" CASCADE;
            DROP TABLE IF EXISTS "Friend" CASCADE;
            DROP TABLE IF EXISTS "Bookmark" CASCADE;

            CREATE TABLE IF NOT EXISTS "User" (
              id SERIAL PRIMARY KEY,
              "username" VARCHAR(100) NOT NULL UNIQUE,
              "firebase_uid" VARCHAR(100) NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS "Friend" (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES "User"(id), 
                following_id INT NOT NULL REFERENCES "User"(id), 
                UNIQUE(user_id, following_id),
                CHECK (user_id != following_id)
            );

            DROP VIEW IF EXISTS "Mutuals";

            CREATE VIEW "Mutuals" AS
            SELECT f1.user_id AS user_id,
                   u1.username AS user_username,
                   f1.following_id AS friend_id,
                   u2.username AS friend_username
            FROM "Friend" f1 JOIN "Friend" f2 ON f1.user_id = f2.following_id AND f1.following_id = f2.user_id
                             JOIN "User" u1 ON f1.user_id = u1.id
                             JOIN "User" u2 ON f1.following_id = u2.id;
            
            CREATE TABLE IF NOT EXISTS "Cafe" (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                address TEXT NOT NULL,
                latitude DOUBLE PRECISION NOT NULL,
                longitude DOUBLE PRECISION NOT NULL,
                "openingDays" TEXT,
                "googleRating" DECIMAL(2,1) CHECK ("googleRating" >= 0 AND "googleRating" <= 5),
                startPrice INTEGER,
                endPrice INTEGER
            );

            CREATE TABLE IF NOT EXISTS "Bookmark" (
              id SERIAL PRIMARY KEY,
              uid INT NOT NULL REFERENCES "User"(id), 
              cid INT NOT NULL REFERENCES "Cafe"(id), 
              UNIQUE(uid, cid)
            );

            CREATE TABLE IF NOT EXISTS "Reviews" (
              id SERIAL PRIMARY KEY,
              rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
              drinkRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
              foodRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
              atmosphereRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
              notes VARCHAR(200),
              timestamp TIMESTAMP NOT NULL,
              cID INT NOT NULL REFERENCES "Cafe"(id),
              uID INT NOT NULL REFERENCES "User"(id),
              UNIQUE(cID, uID)
            );

            CREATE TABLE IF NOT EXISTS "Reaction" (
                id SERIAL PRIMARY KEY,
                uID INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, 
                rID INT NOT NULL REFERENCES "Reviews"(id) ON DELETE CASCADE,
                reaction VARCHAR(8) NOT NULL,
                UNIQUE(uID, rID)
            );
        `);

        // warning the firebase uids as part of this data are all FAKE!!
        const { getUserData } = require('./getUserData');
        const users = await getUserData();
        for (const user of users) {
            await client.query(
                'INSERT INTO "User" ("username", "firebase_uid") VALUES ($1, $2)',
                [user.username, user.firebase_uid]
            );
        }

        const friends = require('../prod_data/friends.json');
        for (const friend of friends) {
            await client.query(
                'INSERT INTO "Friend" ("user_id", "following_id") VALUES ($1, $2)',
                [friend.user_id, friend.following_id]
            );
        }

        const { getCafeData } = require('./getCafeData');
        const cafes = await getCafeData();
        for (const cafe of cafes) {
            await client.query(
                'INSERT INTO "Cafe" (name, address, latitude, longitude, "openingDays", "googleRating", startPrice, endPrice) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [cafe.name, cafe.address, cafe.latitude, cafe.longitude, cafe.openingDays, cafe.googleRating, cafe.startPrice, cafe.endPrice]
            );
        }
        const reviews = require('../mock_data/reviews.json');

        for (const review of reviews) {
            await client.query(
                'INSERT INTO "Reviews" (rating, drinkRating, foodRating, atmosphereRating, notes, timestamp, uID, cID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [review.rating, review.drinkRating, review.foodRating, review.atmosphereRating, review.notes, review.timestamp, review.uID, review.cID]
            );
        }

        const reactions = require('../mock_data/reactions.json');

        for (const reaction of reactions) {
            await client.query(
                'INSERT INTO "Reaction" (uID, rID, reaction) VALUES ($1, $2, $3)',
                [reaction.uID, reaction.rID, reaction.reaction]
            );
        }
        const bookmarks = require('../mock_data/bookmarks.json');
        for (const bookmark of bookmarks) {
            await client.query(
                'INSERT INTO "Bookmark" (uid, cid) VALUES ($1, $2)',
                [bookmark.uid, bookmark.cid]
            );
        }


        const reviews = require('../mock_data/reviews.json');

        for (const review of reviews) {
            await client.query(
                'INSERT INTO "Reviews" (rating, drinkRating, foodRating, atmosphereRating, notes, uID, cID) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [review.rating, review.drinkRating, review.foodRating, review.atmosphereRating, review.notes, review.uID, review.cID]
            );
        }

        console.log('Database seeded successfully with User and Cafe tables!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase().catch(err => {
    console.error('Error seeding database:', err);
});