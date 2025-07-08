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

            CREATE TABLE "User" (
              id SERIAL PRIMARY KEY,
              "username" VARCHAR(100) NOT NULL UNIQUE,
              "firebase_uid" VARCHAR(100) NOT NULL UNIQUE
            );
            
            CREATE TABLE IF NOT EXISTS "Cafe" (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                address TEXT NOT NULL,
                latitude DOUBLE PRECISION NOT NULL,
                longitude DOUBLE PRECISION NOT NULL,
                "openingDays" TEXT,
                "googleRating" DECIMAL(2,1) CHECK ("googleRating" >= 0 AND "googleRating" <= 5)
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

            CREATE TABLE "Reaction" (
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

        const { getCafeData } = require('./getCafeData');
        const cafes = await getCafeData();
        for (const cafe of cafes) {
            await client.query(
                'INSERT INTO "Cafe" (name, address, latitude, longitude, "openingDays", "googleRating") VALUES ($1, $2, $3, $4, $5, $6)',
                [cafe.name, cafe.address, cafe.latitude, cafe.longitude, cafe.openingDays, cafe.googleRating]
            );
        }

        const reviews = require('../mock_data/reviews.json');

        for (const review of reviews) {
            await client.query(
                'INSERT INTO "Reviews" (rating, drinkRating, foodRating, atmosphereRating, notes, uID, cID) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [review.rating, review.drinkRating, review.foodRating, review.atmosphereRating, review.notes, review.uID, review.cID]
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