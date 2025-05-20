const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

async function seedDatabase() {
    const client = await pool.connect();
    
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              first_name VARCHAR(100) NOT NULL,
              last_name VARCHAR(100) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS cafes (
              id SERIAL PRIMARY KEY,
              name VARCHAR(200) NOT NULL,
              rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        await client.query('TRUNCATE users, cafes RESTART IDENTITY CASCADE');
        
        const users = [
            { firstName: 'Trinity', lastName: 'Yip' },
            { firstName: 'Safiya', lastName: 'Makada' },
            { firstName: 'Celina', lastName: 'He' },
            { firstName: 'Nadeen', lastName: 'Findakly' },
            { firstName: 'Rohan', lastName: 'Nankani' },
        ];
        
        for (const user of users) {
            await client.query(
                'INSERT INTO users (first_name, last_name) VALUES ($1, $2)',
                [user.firstName, user.lastName]
            );
        }
        
        const cafes = [
            { name: 'Midnight Run Cafe', rating: 4.5 },
            { name: 'Princess Cafe', rating: 4.6 },
            { name: 'Rommana', rating: 5.0 },
        ];
        
        for (const cafe of cafes) {
            await client.query(
                'INSERT INTO cafes (name, rating) VALUES ($1, $2)',
                [cafe.name, cafe.rating]
            );
        }

        console.log('Database seeded successfully!');
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