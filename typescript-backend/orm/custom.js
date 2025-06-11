const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

class CustomModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findMany() {
    const client = await pool.connect();

    try {
      const query = `SELECT * FROM "${this.tableName}"`;
      const result = await client.query(query);
      return result.rows; 
    } finally {
      client.release();
    }
  }

  async findUnique(id) {
    const client = await pool.connect();

    try {
      const query = `SELECT * FROM "${this.tableName}" WHERE id = $1`;
      const result = await client.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }
}

module.exports = { CustomModel };