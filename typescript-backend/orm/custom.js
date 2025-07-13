const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

class CustomModel {
  #tableSchema = null;
  constructor(tableName) {
    this.tableName = tableName;
  }

  // get a tableSchema object with keys representing column name and the values representing the columns type
  async #getTableSchema() {
    if (this.#tableSchema) {
      return this.#tableSchema; 
    }

    const client = await pool.connect();
    try {
      this.#tableSchema = {};
      const tableDataQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '${this.tableName}';`
      const tableData = (await client.query(tableDataQuery)).rows;

      tableData.forEach(tableDataTuple => { // {column__name:"uid", data_type:"char varying"}
        this.#tableSchema[tableDataTuple.column_name] = tableDataTuple.data_type;
      });
      return this.#tableSchema;
    } finally {
      client.release(); 
    }
  }

  // if you have an object of properties and their values, this will format the properties for SQL queries (adding quotes for the correct types)
  async #quoteProperties(object) {
    const tableSchema = await this.#getTableSchema();
    const keyNames = Object.keys(object);
    const quotedTypes = new Set([
      'character varying',
      'character',
      'text',
      'date',
      'timestamp',
      'timestamp without time zone',
      'timestamp with time zone',
      'time',
      'time without time zone',
      'time with time zone',
      'uuid',
      'interval',
      'json',
    ]);

    const quotedProperties = {}
    keyNames.forEach(key => {
      if (quotedTypes.has(tableSchema[key])) { // if the key's type is in quoted types, surround w/ quotes
        quotedProperties[key] = `'${object[key]}'`;
      } else {
        quotedProperties[key] = object[key];
      }
    })
    return quotedProperties;
  }

  async findMany(where) {
    const client = await pool.connect();
    try {
      if (where === undefined) { // no where clause -- get all rows
        const query = `SELECT * FROM "${this.tableName}"`;
        const result = await client.query(query);
        return result.rows;
      }
      // where clause -- current behaviour is to AND all properties in where
      const quotedProperties = await this.#quoteProperties(where);
      const conditions = [];
      for (let attribute in quotedProperties) {
        conditions.push(`${attribute} = ${quotedProperties[attribute]}`)
      }
      const query = `SELECT * FROM "${this.tableName}" WHERE ${conditions.join(" AND ")};`
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

  async findByColumn(columnName, value) {
    const client = await pool.connect();

    try {
      // validate column name
      if (!/^[a-zA-Z0-9_]+$/.test(columnName)) {
        throw new Error('Invalid column name');
      }

      const query = `SELECT * FROM "${this.tableName}" WHERE "${columnName}" = $1`;
      const result = await client.query(query, [value]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }


  // inserts a single row into the database. returns object created.
  async create(tupleObject) {
    const client = await pool.connect();
    try {
      const keyNames = Object.keys(tupleObject);
      const quotedProperties = await this.#quoteProperties(tupleObject);
      const query = `INSERT INTO "${this.tableName}" (${keyNames.join(', ')}) VALUES (${Object.values(quotedProperties).join(', ')}) RETURNING *`
      const result = await client.query(query);
      return result.rows[0];
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      const query = `DELETE FROM "${this.tableName}" WHERE id = ${id} RETURNING *`
      const result = await client.query(query);
      return result.rows[0];
    } catch (e) {
      console.error(e);
    } finally {
      client.release();
    }
  }

  async rawQuery(query, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = { CustomModel, pool };