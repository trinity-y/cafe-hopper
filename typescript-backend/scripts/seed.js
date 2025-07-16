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