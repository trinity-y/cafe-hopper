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
  tableSchema;
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

  async create(tupleObject) {
    const client = await pool.connect();
    try {
      // fetch and store (for reuse later) the table's attributes + their types
      // https://stackoverflow.com/questions/20194806/how-to-get-a-list-column-names-and-datatypes-of-a-table-in-postgresql#32369441
      if (!tableSchema) {
        this.tableSchema = {};
        const tableDataQuery = `
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'your_table_name';`
        const tableData = await client.query(tableDataQuery);
        tableData.forEach(tableDataTuple => { // {column__name:"uid", data_type:"char varying"}
            this.tableSchema[tableDataTuple.column_name] = tableDataTuple.data_type;
        });
      }
      
      const keyNames = Object.keys(tupleObject);
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

      // surround with quotes if required
      const formattedValues = keyNames.map(key => {
        if (quotedTypes.has(this.tableSchema[key])) { // if the key's type is in quoted types, surrounded
          return `"${tupleObject.key}"`;
        }
        return tupleObject.key;
      })
      const query = `INSERT INTO "${this.tableName}" (${keyNames.join(', ')} VALUES (${formattedValues.join(', ')})) RETURNING *`
      console.log(query);
      const result = await client.query(query);
      return result; // idkthe format of this
    } catch (e) {
    } finally {
      client.release();
    }
  }
}

module.exports = { CustomModel };