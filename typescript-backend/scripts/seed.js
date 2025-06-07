const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_DATABASE_URL,
});

async function seedDatabase() {
    console.log('DB URL:', process.env.POSTGRES_DATABASE_URL);
    const client = await pool.connect();
    
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS "User" (
              id SERIAL PRIMARY KEY,
              "firstName" VARCHAR(100) NOT NULL,
              "secondName" VARCHAR(100) NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS "Cafe" (
              id SERIAL PRIMARY KEY,
              name VARCHAR(200) NOT NULL,
              rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5)
            );
        `);
        
        await client.query('TRUNCATE "User", "Cafe" RESTART IDENTITY CASCADE');
        
        const users = [
            { firstName: 'Trinity', secondName: 'Yip' },
            { firstName: 'Safiya', secondName: 'Makada' },
            { firstName: 'Celina', secondName: 'He' },
            { firstName: 'Nadeen', secondName: 'Findakly' },
            { firstName: 'Rohan', secondName: 'Nankani' },
        ];
        
        for (const user of users) {
            await client.query(
                'INSERT INTO "User" ("firstName", "secondName") VALUES ($1, $2)',
                [user.firstName, user.secondName]
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

// seedDatabase().catch(err => {
//     console.error('Error seeding database:', err);
// });

module.exports = seedDatabase;