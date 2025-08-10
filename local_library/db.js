// local_library/db.js
const mysql = require('mysql2/promise');

const {
  DB_HOST,
  DB_PORT = '3306',
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_DATABASE) {
  console.error('❌ Missing DB env vars. Required: DB_HOST, DB_USER, DB_DATABASE (plus DB_PASSWORD if needed).');
}

let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT || 3306),
      user: DB_USER,
      password: DB_PASSWORD || '',
      database: DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      namedPlaceholders: true,
      charset: 'utf8mb4',
    });
  }
  return pool;
}

async function query(sql, params) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

module.exports = { query, getPool };
