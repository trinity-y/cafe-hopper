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
            CREATE TABLE IF NOT EXISTS "User" (
              id SERIAL PRIMARY KEY,
              "username" VARCHAR(100) NOT NULL UNIQUE,
              "firebase_uid" VARCHAR(100) NOT NULL UNIQUE
            );
            
            CREATE TABLE IF NOT EXISTS "Cafe" (
              id SERIAL PRIMARY KEY,
              name VARCHAR(200) NOT NULL,
              rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5)
            );
        `);
        
        await client.query('TRUNCATE "User", "Cafe" RESTART IDENTITY CASCADE');
        
        const users = [ // warning the firebase uids are all FAKE!!
            { username: 'Trinity', firebase_uid: 'aB3xYz9KlmNOqP456rstUVWX7yza'},
            { username: 'Safiya', firebase_uid: 'JkL8MnOpQrSTuvW0xyZa1Bc2DeFg'},
            { username: 'Celina', firebase_uid: 'hI3jK4LmN5oPqrStUvWxYzAbCdEf'},
            { username: 'Nadeen', firebase_uid: 'mNoPQr5TuVWX6yzA7bCdEfGhIjKl'},
            { username: 'Rohan', firebase_uid: 'ZxCvBnM8aS9dFgHiJkL0QwErTyUp'},
        ];
        
        for (const user of users) {
            await client.query(
                'INSERT INTO "User" ("username", "firebase_uid") VALUES ($1, $2)',
                [user.username, user.firebase_uid]
            );
        }
        
        const cafes = [
            { name: 'Midnight Run Cafe', rating: 4.5 },
            { name: 'Princess Cafe', rating: 4.6 },
            { name: 'Rommana', rating: 5.0 },
        ];
        
        for (const cafe of cafes) {
            await client.query(
                'INSERT INTO "Cafe" (name, rating) VALUES ($1, $2)',
                [cafe.name, cafe.rating]
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