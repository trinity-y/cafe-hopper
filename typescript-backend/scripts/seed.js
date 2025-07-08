const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

const dataLocation = 'prod_data'; // prod_data || mock_data
async function seedDatabase() {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS "User" (
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

            CREATE TABLE IF NOT EXISTS "Bookmark" (
              id SERIAL PRIMARY KEY,
              uid INT NOT NULL REFERENCES "User"(id), 
              cid INT NOT NULL REFERENCES "Cafe"(id), 
              UNIQUE(uid, cid)
            );
        `);

        await client.query('TRUNCATE "User", "Cafe" RESTART IDENTITY CASCADE');

        // warning the firebase uids as part of this data are all FAKE!!
        const users = require('../mock_data/users.json');

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

        const bookmarks = require('../mock_data/bookmarks.json');

        for (const bookmark of bookmarks) {
            await client.query(
                'INSERT INTO "Bookmark" (uid, cid) VALUES ($1, $2)',
                [bookmark.uid, bookmark.cid]
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