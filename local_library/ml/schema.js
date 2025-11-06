// local_library/ml_schema.js
// Database schema initialization for ML system

const mysql = require('mysql2/promise');

/**
 * Create ML database and tables if they don't exist
 */
async function initializeMLSchema() {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = Number(process.env.DB_PORT || 3306);
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASSWORD = process.env.DB_PASSWORD || '';
  const ML_DATABASE = process.env.ML_DATABASE || 'vatcar_discordbot';

  let connection = null;

  try {
    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${ML_DATABASE}`);
    console.log(`[ML] Database ${ML_DATABASE} ready`);

    // Switch to the ML database
    await connection.query(`USE ${ML_DATABASE}`);

    // Create controller_sessions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS controller_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        callsign VARCHAR(50) NOT NULL,
        normalized_callsign VARCHAR(50) NOT NULL,
        controller_name VARCHAR(255),
        controller_cid VARCHAR(50),
        facility VARCHAR(100) NOT NULL,
        position_type VARCHAR(20),
        logon_time DATETIME NOT NULL,
        logoff_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        day_of_week TINYINT NOT NULL,
        hour_of_day TINYINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_facility (facility),
        INDEX idx_controller_cid (controller_cid),
        INDEX idx_logon_time (logon_time),
        INDEX idx_day_hour (day_of_week, hour_of_day)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table controller_sessions ready');

    // Create controller_predictions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS controller_predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        facility VARCHAR(100) NOT NULL,
        predicted_date DATE NOT NULL,
        predicted_hour TINYINT NOT NULL,
        confidence DECIMAL(5,2) NOT NULL,
        predicted_controller_cid VARCHAR(50),
        predicted_controller_name VARCHAR(255),
        notification_sent BOOLEAN DEFAULT FALSE,
        notification_sent_at TIMESTAMP NULL,
        actual_opened BOOLEAN DEFAULT NULL,
        actual_duration INT DEFAULT NULL,
        actual_logon_time DATETIME NULL,
        actual_controller_cid VARCHAR(50) NULL,
        validation_window_hit BOOLEAN DEFAULT NULL,
        predicted_controller_correct BOOLEAN DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        evaluated_at TIMESTAMP NULL,
        INDEX idx_facility_date (facility, predicted_date),
        INDEX idx_created (created_at),
        INDEX idx_notification (notification_sent, predicted_date, predicted_hour)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table controller_predictions ready');

    // Alter existing controller_predictions table to add new columns if they don't exist
    try {
      await connection.query(`
        ALTER TABLE controller_predictions
        ADD COLUMN IF NOT EXISTS predicted_controller_cid VARCHAR(50),
        ADD COLUMN IF NOT EXISTS predicted_controller_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMP NULL,
        ADD COLUMN IF NOT EXISTS actual_logon_time DATETIME NULL,
        ADD COLUMN IF NOT EXISTS actual_controller_cid VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS validation_window_hit BOOLEAN DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS predicted_controller_correct BOOLEAN DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS confidence_lower DECIMAL(5,2) NULL,
        ADD COLUMN IF NOT EXISTS confidence_upper DECIMAL(5,2) NULL,
        ADD COLUMN IF NOT EXISTS bayesian_confidence DECIMAL(5,2) NULL
      `);
    } catch (alterErr) {
      // Ignore errors if columns already exist
      if (!alterErr.message.includes('Duplicate column')) {
        console.log('[WARNING]  Note: Some columns may already exist in controller_predictions');
      }
    }

    // Create ml_model_metadata table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ml_model_metadata (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        total_sessions INT DEFAULT 0,
        unique_controllers INT DEFAULT 0,
        unique_facilities INT DEFAULT 0,
        predictions_made INT DEFAULT 0,
        predictions_evaluated INT DEFAULT 0,
        correct_predictions INT DEFAULT 0,
        accuracy_rate DECIMAL(5,2) DEFAULT 0,
        avg_confidence DECIMAL(5,2) DEFAULT 0,
        model_version VARCHAR(20) DEFAULT 'v1.0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_date (date),
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table ml_model_metadata ready');

    // Create ml_daily_learning table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ml_daily_learning (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        insight_type VARCHAR(50) NOT NULL,
        facility VARCHAR(100),
        controller_cid VARCHAR(50),
        insight_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_type (insight_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table ml_daily_learning ready');

    // Create controller_patterns table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS controller_patterns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        controller_cid VARCHAR(50) NOT NULL,
        controller_name VARCHAR(255),
        facility VARCHAR(100) NOT NULL,
        day_of_week TINYINT NOT NULL,
        hour_of_day TINYINT NOT NULL,
        session_count INT DEFAULT 0,
        avg_duration_minutes INT DEFAULT 0,
        consistency_score DECIMAL(5,2) DEFAULT 0,
        last_seen DATE,
        consecutive_weeks INT DEFAULT 0,
        avg_session_duration DECIMAL(6,2) DEFAULT 0,
        typical_session_length INT DEFAULT 1,
        facility_count INT DEFAULT 1,
        last_week_active DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_controller (controller_cid),
        INDEX idx_facility_time (facility, day_of_week, hour_of_day),
        INDEX idx_consistency (consistency_score),
        INDEX idx_streaks (consecutive_weeks),
        UNIQUE KEY unique_pattern (controller_cid, facility, day_of_week, hour_of_day)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table controller_patterns ready');

    // Alter existing controller_patterns table to add new columns if they don't exist
    try {
      await connection.query(`
        ALTER TABLE controller_patterns
        ADD COLUMN IF NOT EXISTS consecutive_weeks INT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS avg_session_duration DECIMAL(6,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS typical_session_length INT DEFAULT 1,
        ADD COLUMN IF NOT EXISTS facility_count INT DEFAULT 1,
        ADD COLUMN IF NOT EXISTS last_week_active DATE NULL,
        ADD INDEX IF NOT EXISTS idx_streaks (consecutive_weeks)
      `);
    } catch (alterErr) {
      if (!alterErr.message.includes('Duplicate column')) {
        console.log('[WARNING]  Note: Some columns may already exist in controller_patterns');
      }
    }

    // Create facility_accuracy_metrics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS facility_accuracy_metrics (
        facility VARCHAR(50) PRIMARY KEY,
        total_predictions INT DEFAULT 0,
        correct_predictions INT DEFAULT 0,
        accuracy_rate DECIMAL(5,2) DEFAULT 0,
        confidence_threshold DECIMAL(5,2) DEFAULT 60.00,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_accuracy (accuracy_rate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table facility_accuracy_metrics ready');

    // Create vatsim_events table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vatsim_events (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        affected_facilities JSON,
        affected_airports JSON,
        event_type VARCHAR(50) DEFAULT 'guaranteed_coverage',
        short_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_time (start_time, end_time),
        INDEX idx_type (event_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[SUCCESS] Table vatsim_events ready');

    console.log('[ML] ML database schema initialized successfully');

    return { success: true };

  } catch (err) {
    console.error('[ERROR] ML schema initialization failed:', err.message);
    return { success: false, error: err };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Get a connection pool for the ML database
 */
function createMLPool() {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = Number(process.env.DB_PORT || 3306);
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASSWORD = process.env.DB_PASSWORD || '';
  const ML_DATABASE = process.env.ML_DATABASE || 'vatcar_discordbot';

  return mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: ML_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    timezone: 'Z',
  });
}

module.exports = {
  initializeMLSchema,
  createMLPool,
};
