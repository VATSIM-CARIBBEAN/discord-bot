// local_library/ml_validator.js
// Validates predictions against actual controller activity and learns from results

const { createMLPool } = require('./schema');
const schedule = require('node-schedule');
const { format, addMinutes, subMinutes, parseISO } = require('date-fns');

let mlPool = null;
let validationJob = null;

// Configuration
const VALIDATION_WINDOW_MINUTES = 30; // ±30 minutes tolerance
const VALIDATION_CHECK_INTERVAL = '*/15 * * * *'; // Every 15 minutes

/**
 * Initialize the validator
 */
function initializeValidator() {
  if (!mlPool) {
    mlPool = createMLPool();
  }

  // Schedule validation checks every 15 minutes
  validationJob = schedule.scheduleJob(VALIDATION_CHECK_INTERVAL, async () => {
    await validatePredictions();
  });

  console.log('[ML] Validator initialized (checking every 15 minutes)');
}

/**
 * Main validation function - checks predictions that need validation
 */
async function validatePredictions() {
  if (!mlPool) {
    console.warn('[WARNING] ML Validator not initialized');
    return { success: false };
  }

  try {
    const now = new Date();

    // Find predictions that:
    // 1. Are in the past (at least 90 minutes ago to allow for grace period)
    // 2. Haven't been validated yet (actual_logon_time IS NULL)
    const [predictions] = await mlPool.query(
      `SELECT * FROM controller_predictions
       WHERE TIMESTAMP(CONCAT(predicted_date, ' ', LPAD(predicted_hour, 2, '0'), ':00:00')) < DATE_SUB(NOW(), INTERVAL 90 MINUTE)
         AND actual_logon_time IS NULL
       ORDER BY predicted_date ASC, predicted_hour ASC
       LIMIT 50`,
      []
    );

    if (predictions.length === 0) {
      return { success: true, validated: 0 };
    }

    console.log(`[ML] Validating ${predictions.length} prediction(s)...`);

    let validatedCount = 0;
    let correctCount = 0;
    let windowHitCount = 0;

    for (const prediction of predictions) {
      const result = await validateSinglePrediction(prediction);
      if (result.success) {
        validatedCount++;
        if (result.correct) correctCount++;
        if (result.windowHit) windowHitCount++;
      }
    }

    console.log(`[ML] Validated ${validatedCount} predictions: ${windowHitCount} within window, ${correctCount} exact matches`);

    // Update model metadata
    await updateModelAccuracy();

    return { success: true, validated: validatedCount, windowHits: windowHitCount, correct: correctCount };

  } catch (err) {
    console.error('[ERROR] Validation failed:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Validate a single prediction against actual sessions
 */
async function validateSinglePrediction(prediction) {
  try {
    // Calculate the validation window
    // Format the date properly - prediction.predicted_date is a Date object from MySQL
    const dateStr = format(new Date(prediction.predicted_date), 'yyyy-MM-dd');
    const predictedDateTime = parseISO(`${dateStr}T${String(prediction.predicted_hour).padStart(2, '0')}:00:00Z`);
    const windowStart = subMinutes(predictedDateTime, VALIDATION_WINDOW_MINUTES);
    const windowEnd = addMinutes(predictedDateTime, VALIDATION_WINDOW_MINUTES + 60); // Full hour + 30 min after

    // Query for any sessions in this facility during the window
    const [sessions] = await mlPool.query(
      `SELECT
        controller_cid,
        controller_name,
        MIN(logon_time) as first_logon,
        COUNT(*) as session_count
      FROM controller_sessions
      WHERE facility = ?
        AND logon_time >= ?
        AND logon_time <= ?
      GROUP BY controller_cid
      ORDER BY first_logon ASC`,
      [
        prediction.facility,
        format(windowStart, 'yyyy-MM-dd HH:mm:ss'),
        format(windowEnd, 'yyyy-MM-dd HH:mm:ss')
      ]
    );

    // Determine validation results
    const hasActivity = sessions.length > 0;
    const firstSession = sessions[0] || null;

    let validationWindowHit = false;
    let actualControllerCid = null;
    let actualLogonTime = null;

    if (hasActivity) {
      validationWindowHit = true;
      actualControllerCid = firstSession.controller_cid;
      actualLogonTime = firstSession.first_logon;

      // Debug logging
      console.log(`   Found ${sessions.length} session(s) in window`);
      console.log(`   First session: ${firstSession.controller_name} (CID: ${firstSession.controller_cid}) at ${firstSession.first_logon}`);
    }

    // Check if predicted controller matched (exact match)
    let predictedControllerCorrect = null;
    if (prediction.predicted_controller_cid) {
      // We made a controller prediction, so evaluate it
      if (hasActivity) {
        // Check if any session in the window matches the predicted controller
        predictedControllerCorrect = sessions.some(s => s.controller_cid === prediction.predicted_controller_cid);
      } else {
        // No activity at all, so controller prediction was wrong
        predictedControllerCorrect = false;
      }
    }
    // If no controller was predicted, leave as null (not applicable)

    // Calculate actual duration
    const [durationRows] = await mlPool.query(
      `SELECT SUM(duration_minutes) as total_duration
       FROM controller_sessions
       WHERE facility = ?
         AND DATE(logon_time) = ?
         AND hour_of_day = ?`,
      [prediction.facility, dateStr, prediction.predicted_hour]
    );

    const actualDuration = durationRows[0]?.total_duration || 0;

    // Update prediction record
    await mlPool.query(
      `UPDATE controller_predictions
       SET
         actual_opened = ?,
         actual_logon_time = ?,
         actual_controller_cid = ?,
         actual_duration = ?,
         validation_window_hit = ?,
         predicted_controller_correct = ?,
         evaluated_at = NOW()
       WHERE id = ?`,
      [
        hasActivity,
        actualLogonTime,
        actualControllerCid,
        actualDuration > 0 ? actualDuration : null,
        validationWindowHit,
        predictedControllerCorrect,
        prediction.id
      ]
    );

    // Log result
    const statusIcon = validationWindowHit ? '[OK]' : '[MISS]';
    let controllerMatchText = '';
    if (predictedControllerCorrect === true) {
      controllerMatchText = 'Controller matched!';
    } else if (predictedControllerCorrect === false) {
      controllerMatchText = 'Wrong controller';
    }
    console.log(`${statusIcon} ${prediction.facility} ${prediction.predicted_hour}:00 - ${validationWindowHit ? 'Active' : 'Inactive'} ${controllerMatchText}`);

    return {
      success: true,
      windowHit: validationWindowHit,
      correct: predictedControllerCorrect === true,
    };

  } catch (err) {
    console.error(`[ERROR] Failed to validate prediction ${prediction.id}:`, err.message);
    console.error(`   Prediction data: date=${prediction.predicted_date}, hour=${prediction.predicted_hour}, facility=${prediction.facility}`);
    return { success: false, error: err };
  }
}

/**
 * Update model metadata with latest accuracy metrics
 */
async function updateModelAccuracy() {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');

    // Calculate overall accuracy (window hit rate and controller accuracy)
    const [accuracyRows] = await mlPool.query(
      `SELECT
        COUNT(*) as total_evaluated,
        SUM(CASE WHEN validation_window_hit = TRUE THEN 1 ELSE 0 END) as correct_predictions,
        SUM(CASE WHEN predicted_controller_correct = TRUE THEN 1 ELSE 0 END) as correct_controller_predictions,
        SUM(CASE WHEN predicted_controller_cid IS NOT NULL THEN 1 ELSE 0 END) as total_controller_predictions,
        AVG(confidence) as avg_confidence
      FROM controller_predictions
      WHERE evaluated_at IS NOT NULL
        AND predicted_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      []
    );

    if (accuracyRows[0]?.total_evaluated > 0) {
      const totalEvaluated = accuracyRows[0].total_evaluated;
      const correctPredictions = accuracyRows[0].correct_predictions || 0;
      const accuracyRate = (correctPredictions / totalEvaluated) * 100;
      const avgConfidence = accuracyRows[0].avg_confidence || 0;

      // Calculate controller prediction accuracy
      const totalControllerPreds = accuracyRows[0].total_controller_predictions || 0;
      const correctControllerPreds = accuracyRows[0].correct_controller_predictions || 0;
      const controllerAccuracyRate = totalControllerPreds > 0
        ? (correctControllerPreds / totalControllerPreds) * 100
        : 0;

      // Update today's metadata
      await mlPool.query(
        `INSERT INTO ml_model_metadata
          (date, predictions_evaluated, correct_predictions, accuracy_rate, avg_confidence)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          predictions_evaluated = VALUES(predictions_evaluated),
          correct_predictions = VALUES(correct_predictions),
          accuracy_rate = VALUES(accuracy_rate),
          avg_confidence = VALUES(avg_confidence)`,
        [today, totalEvaluated, correctPredictions, Math.round(accuracyRate * 100) / 100, Math.round(avgConfidence * 100) / 100]
      );

      console.log(`[ML] Model accuracy: ${Math.round(accuracyRate)}% (${correctPredictions}/${totalEvaluated} in last 30 days)`);
      if (totalControllerPreds > 0) {
        console.log(`[ML] Controller accuracy: ${Math.round(controllerAccuracyRate)}% (${correctControllerPreds}/${totalControllerPreds})`);
      }

      // === NEW: Calculate per-facility metrics for dynamic thresholds ===
      const [facilityMetrics] = await mlPool.query(`
        SELECT
          facility,
          COUNT(*) as total,
          SUM(CASE WHEN validation_window_hit = TRUE THEN 1 ELSE 0 END) as correct,
          AVG(confidence) as avg_conf
        FROM controller_predictions
        WHERE evaluated_at IS NOT NULL
          AND predicted_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY facility
        HAVING total >= 10
      `);

      for (const fm of facilityMetrics) {
        const facilityAccuracy = Math.round((fm.correct / fm.total) * 100 * 100) / 100;

        // Dynamic threshold: high accuracy = lower bar, low accuracy = higher bar
        let threshold = 60;
        if (facilityAccuracy >= 75) threshold = 50;
        else if (facilityAccuracy >= 65) threshold = 55;
        else if (facilityAccuracy < 55) threshold = 70;

        await mlPool.query(`
          INSERT INTO facility_accuracy_metrics
            (facility, total_predictions, correct_predictions, accuracy_rate, confidence_threshold)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            total_predictions = VALUES(total_predictions),
            correct_predictions = VALUES(correct_predictions),
            accuracy_rate = VALUES(accuracy_rate),
            confidence_threshold = VALUES(confidence_threshold)
        `, [fm.facility, fm.total, fm.correct, facilityAccuracy, threshold]);

        console.log(`   [ML] ${fm.facility}: ${facilityAccuracy}% accuracy, threshold: ${threshold}%`);
      }
    }

  } catch (err) {
    console.error('[ERROR] Failed to update model accuracy:', err.message);
  }
}

/**
 * Get validation statistics for a facility
 */
async function getFacilityAccuracy(facility, daysBack = 30) {
  if (!mlPool) return null;

  try {
    const [rows] = await mlPool.query(
      `SELECT
        COUNT(*) as total_predictions,
        SUM(CASE WHEN validation_window_hit = TRUE THEN 1 ELSE 0 END) as correct_predictions,
        AVG(confidence) as avg_confidence
      FROM controller_predictions
      WHERE facility = ?
        AND evaluated_at IS NOT NULL
        AND predicted_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`,
      [facility, daysBack]
    );

    if (rows[0]?.total_predictions > 0) {
      const total = rows[0].total_predictions;
      const correct = rows[0].correct_predictions || 0;
      return {
        facility,
        total_predictions: total,
        correct_predictions: correct,
        accuracy_rate: (correct / total) * 100,
        avg_confidence: rows[0].avg_confidence || 0,
      };
    }

    return null;
  } catch (err) {
    console.error('Error getting facility accuracy:', err.message);
    return null;
  }
}

/**
 * Get recent validation results (for debugging)
 */
async function getRecentValidations(limit = 20) {
  if (!mlPool) return [];

  try {
    const [validations] = await mlPool.query(
      `SELECT
        facility,
        predicted_date,
        predicted_hour,
        confidence,
        predicted_controller_name,
        actual_controller_cid,
        validation_window_hit,
        actual_logon_time,
        evaluated_at
      FROM controller_predictions
      WHERE evaluated_at IS NOT NULL
      ORDER BY evaluated_at DESC
      LIMIT ?`,
      [limit]
    );

    return validations;
  } catch (err) {
    console.error('Error getting recent validations:', err.message);
    return [];
  }
}

/**
 * Manually trigger validation (useful for testing)
 */
async function triggerValidation() {
  console.log('[ML] Manually triggering validation...');
  return await validatePredictions();
}

/**
 * Cleanup - close pool and cancel scheduled jobs
 */
async function closeValidator() {
  if (validationJob) {
    validationJob.cancel();
    validationJob = null;
  }

  if (mlPool) {
    await mlPool.end();
    mlPool = null;
  }

  console.log('[ML] Validator closed');
}

module.exports = {
  initializeValidator,
  validatePredictions,
  getFacilityAccuracy,
  getRecentValidations,
  triggerValidation,
  closeValidator,
};
