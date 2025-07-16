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

            CREATE TABLE "User" (
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

            CREATE TABLE IF NOT EXISTS "Reviews" (
                id SERIAL PRIMARY KEY,
                rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
                drinkRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
                foodRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
                atmosphereRating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
                notes VARCHAR(200),
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

        const friends = require('../mock_data/friends.json');
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