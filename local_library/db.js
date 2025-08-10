// local_library/db.js
// Central MySQL pool used by workflow helpers

const mysql = require('mysql2/promise');

// Read env (support both DB_* and legacy MYSQL_* names)
function env(name, fallback) {
  const v = process.env[name];
  return (v === undefined || v === '') ? fallback : v;
}

const DB_HOST     = env('DB_HOST',     env('MYSQL_HOST',     'localhost'));
const DB_PORT     = Number(env('DB_PORT', env('MYSQL_PORT',  '3306')));
const DB_DATABASE = env('DB_DATABASE', env('MYSQL_DATABASE', 'vatcar'));
const DB_USER     = env('DB_USER',     env('MYSQL_USER',     'root'));
const DB_PASSWORD = env('DB_PASSWORD', env('MYSQL_PASSWORD', ''));

// Hard-fail fast if something critical is missing
if (!DB_HOST || !DB_DATABASE || !DB_USER) {
  console.error('❌ Missing DB config. Required: DB_HOST, DB_DATABASE, DB_USER (and DB_PASSWORD if needed).');
  process.exit(1);
}

// Create pool
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Ensure UTC; adjust if you need local time
  timezone: 'Z',
  // Slightly larger packets if you ever store bigger text
  maxPreparedStatements: 500,
});

// Optional: quick self-test on startup (won’t crash the bot if it fails)
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`🔌 MySQL connected: ${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
  } catch (err) {
    console.warn('⚠️  Could not verify MySQL connection on startup:', err.message);
  }
})();

module.exports = { pool };
