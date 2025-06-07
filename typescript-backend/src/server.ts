import app from './app';
import prisma from './prisma/prisma.service';
const seedDatabase = require('../scripts/seed');

const PORT: number = parseInt(process.env.PORT || '8080');

async function waitForDbConnection(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Database URL:', process.env.POSTGRES_DATABASE_URL);
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection established');
      return;
    } catch (err) {
      console.log(`DB connection failed (attempt ${i + 1}/${retries}). Retrying...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Database not reachable after multiple retries');
}

waitForDbConnection()
  .then(async () => {
    console.log('trying to seed database');
    await seedDatabase();
    console.log('seeded')
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup aborted:', err);
    process.exit(1);
  });