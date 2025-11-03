// local_library/ml_prediction_engine.js
// Generates predictions for facility openings

const { createMLPool } = require('./schema');
const { getFacilityPatterns, getControllerPatterns, getMostLikelyController } = require('./learning_engine');
const { addDays, format, getDay, getHours, subDays, differenceInDays, startOfDay } = require('date-fns');

let mlPool = null;

const TRAINING_PERIOD_DAYS = Number(process.env.ML_TRAINING_PERIOD_DAYS || 30);
const MIN_CONFIDENCE = Number(process.env.ML_MIN_CONFIDENCE || 60);

// Time decay parameters
const DECAY_HALFLIFE_DAYS = 30;

// Cold start parameters
const COLD_START_MIN_SESSIONS = 2;
const COLD_START_MAX_DAYS = 14;
const COLD_START_BASE_CONFIDENCE = 45;

// Streak parameters
const MIN_STREAK_FOR_BONUS = 3;
const STREAK_BONUS_PER_WEEK = 3;
const MAX_STREAK_BONUS = 15;
const GAP_PENALTY_WEEKS = 2;

// Facility diversity
const SPECIALIST_MAX_FACILITIES = 2;
const GENERALIST_MIN_FACILITIES = 5;

// Session continuity
const MIN_SESSIONS_FOR_CONTINUITY = 3;
const CONTINUITY_BONUS = 8;

/**
 * Initialize the prediction engine
 */
function initializePrediction() {
  if (!mlPool) {
    mlPool = createMLPool();
    console.log('[ML] Prediction Engine initialized');
  }
}

/**
 * Check if we have enough training data to make predictions
 */
async function hasEnoughTrainingData() {
  if (!mlPool) return false;

  try {
    const [rows] = await mlPool.query(
      `SELECT MIN(logon_time) as first_session FROM controller_sessions`
    );

    if (!rows[0] || !rows[0].first_session) {
      return false;
    }

    const firstSession = new Date(rows[0].first_session);
    const daysSinceFirst = differenceInDays(new Date(), firstSession);

    console.log(`[ML] Training data: ${daysSinceFirst} days (need ${TRAINING_PERIOD_DAYS})`);
    return daysSinceFirst >= TRAINING_PERIOD_DAYS;
  } catch (err) {
    console.error('Error checking training data:', err.message);
    return false;
  }
}

/**
 * Detect if a data point is an outlier using IQR method
 * Returns array of booleans indicating which values are outliers
 */
function isOutlier(values) {
  if (values.length < 4) {
    // Not enough data points - return array of falses
    return values.map(() => false);
  }

  const sorted = [...values].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;

  // A value is an outlier if it's more than 1.5 * IQR away from Q1 or Q3
  const lowerBound = q1 - (1.5 * iqr);
  const upperBound = q3 + (1.5 * iqr);

  return values.map(v => v < lowerBound || v > upperBound);
}

/**
 * Filter out sessions that are likely from special events
 * Distinguishes between known VATSIM events and unknown statistical outliers
 */
async function filterEventOutliers(facility, dayOfWeek, hour, daysBack = 60) {
  if (!mlPool) return { sessions: [], isReliable: false };

  try {
    const startDate = subDays(new Date(), daysBack);

    // Get session counts for this facility/day/hour over the training period
    // Group by date to detect abnormal spikes
    const [dailyCounts] = await mlPool.query(
      `SELECT
        DATE(logon_time) as session_date,
        COUNT(*) as session_count,
        SUM(duration_minutes) as total_duration
      FROM controller_sessions
      WHERE facility = ?
        AND day_of_week = ?
        AND hour_of_day = ?
        AND logon_time >= ?
      GROUP BY DATE(logon_time)
      ORDER BY session_date`,
      [facility, dayOfWeek, hour, startDate]
    );

    if (dailyCounts.length < 3) {
      // Not enough data points to determine outliers
      return { sessions: dailyCounts, isReliable: false, eventCount: 0, unknownOutlierCount: 0 };
    }

    // Query for known VATSIM events covering this facility and hour
    const [events] = await mlPool.query(
      `SELECT DISTINCT DATE(start_time) as event_date
       FROM vatsim_events
       WHERE JSON_CONTAINS(affected_facilities, ?)
         AND start_time >= ?
         AND DATE(start_time) <= DATE(NOW())
         AND HOUR(start_time) <= ? AND HOUR(end_time) >= ?`,
      [JSON.stringify(facility), startDate, hour, hour]
    );

    // Create a Set of known event dates for fast lookup
    const eventDates = new Set(
      events.map(e => format(new Date(e.event_date), 'yyyy-MM-dd'))
    );

    // Detect statistical outliers based on session count
    const sessionCounts = dailyCounts.map(d => d.session_count);
    const outlierFlags = isOutlier(sessionCounts);

    // Categorize each session date
    const normalSessions = [];
    const eventSessions = [];
    const unknownOutliers = [];

    dailyCounts.forEach((dayData, idx) => {
      const dateStr = format(new Date(dayData.session_date), 'yyyy-MM-dd');
      const isStatisticalOutlier = outlierFlags[idx];
      const isKnownEvent = eventDates.has(dateStr);

      if (isKnownEvent) {
        // Known VATSIM event - exclude from training but don't penalize
        eventSessions.push(dayData);
      } else if (isStatisticalOutlier) {
        // Unknown outlier - suspicious spike, penalize confidence
        unknownOutliers.push(dayData);
      } else {
        // Normal operational day - use for training
        normalSessions.push(dayData);
      }
    });

    // Pattern is only reliable if we have consistent normal activity
    // (at least 3 occurrences after removing events and outliers)
    const isReliable = normalSessions.length >= 3;

    return {
      sessions: normalSessions,
      isReliable,
      eventCount: eventSessions.length,
      unknownOutlierCount: unknownOutliers.length,
      totalFiltered: eventSessions.length + unknownOutliers.length
    };

  } catch (err) {
    console.error('Error filtering event outliers:', err.message);
    return { sessions: [], isReliable: false, eventCount: 0, unknownOutlierCount: 0 };
  }
}

/**
 * Calculate confidence score for a prediction
 * Based on historical consistency and data availability
 */
function calculateConfidence(historicalData, totalDataPoints, outlierInfo, likelyController, hour) {
  if (!historicalData || historicalData.length === 0) {
    return 0;
  }

  // Factors that increase confidence:
  // 1. Frequency of occurrence (how often this pattern appears)
  // 2. Consistency (how regular the pattern is)
  // 3. Recency (more recent data is weighted higher via time decay)
  // 4. Sample size
  // 5. Absence of UNKNOWN outliers (known events are OK)
  // 6. Consecutive week streaks
  // 7. Facility specialization
  // 8. Session continuity patterns

  const sessionCount = historicalData.reduce((sum, d) => sum + d.session_count, 0);
  const uniqueControllers = historicalData.reduce((sum, d) => sum + (d.unique_controllers || 1), 0);

  // Base confidence on frequency relative to training period
  const sessionsPerWeek = sessionCount / (60 / 7);
  let confidence = Math.min(sessionsPerWeek * 30, 80);

  // Bonus for consistency (multiple occurrences)
  if (sessionCount >= 5) {
    confidence += 10;
  } else if (sessionCount >= 3) {
    confidence += 5;
  }

  // Bonus for multiple controllers (more reliable)
  if (uniqueControllers > 2) {
    confidence += 10;
  }

  // === NEW: Consecutive week streak bonus ===
  if (likelyController?.consecutive_weeks >= MIN_STREAK_FOR_BONUS) {
    const streakBonus = Math.min(likelyController.consecutive_weeks * STREAK_BONUS_PER_WEEK, MAX_STREAK_BONUS);
    confidence += streakBonus;
    console.log(`   [ML] ${likelyController.consecutive_weeks}-week streak: +${streakBonus}%`);
  }

  // === NEW: Gap penalty (inactive for multiple weeks) ===
  if (likelyController?.last_week_active) {
    const weeksSinceActive = differenceInDays(new Date(), new Date(likelyController.last_week_active)) / 7;
    if (weeksSinceActive > GAP_PENALTY_WEEKS) {
      confidence -= 5;
      console.log(`   [ML] ${Math.floor(weeksSinceActive)} week gap: -5%`);
    }
  }

  // === NEW: Multi-facility adjustment ===
  if (likelyController?.facility_count) {
    if (likelyController.facility_count <= SPECIALIST_MAX_FACILITIES) {
      confidence += 5;
      console.log(`   [ML] Facility specialist (${likelyController.facility_count} facilities): +5%`);
    } else if (likelyController.facility_count >= GENERALIST_MIN_FACILITIES) {
      confidence -= 5;
      console.log(`   [ML] Multi-facility rotation (${likelyController.facility_count} facilities): -5%`);
    }
  }

  // === NEW: Session continuity bonus ===
  if (likelyController?.typical_session_length > 1) {
    // Check if this hour is likely in middle of a session block
    const hourMod = parseInt(hour) % likelyController.typical_session_length;
    if (hourMod !== 0 && hourMod <= likelyController.typical_session_length - 1) {
      confidence += CONTINUITY_BONUS;
      console.log(`   [ML] Mid-session hour (${likelyController.typical_session_length}h blocks): +${CONTINUITY_BONUS}%`);
    }
  }

  // Penalty ONLY for unknown outliers (not known VATSIM events)
  if (outlierInfo && outlierInfo.unknownOutlierCount > 0) {
    const outlierPenalty = Math.min(outlierInfo.unknownOutlierCount * 10, 30);
    confidence -= outlierPenalty;
    console.log(`   [WARNING] Applying ${outlierPenalty}% penalty for ${outlierInfo.unknownOutlierCount} unknown outlier(s)`);
  }

  // Log known events (informational, no penalty)
  if (outlierInfo && outlierInfo.eventCount > 0) {
    console.log(`   [INFO] Filtered ${outlierInfo.eventCount} known VATSIM event date(s) (no penalty)`);
  }

  // Require higher consistency for high confidence
  if (outlierInfo && !outlierInfo.isReliable) {
    confidence = Math.min(confidence, 70);
  }

  // Cap at 95% (never be too confident) and floor at 0
  return Math.max(0, Math.min(Math.round(confidence), 95));
}

/**
 * Calculate cold start confidence for new/emerging patterns
 */
function calculateColdStartConfidence(sessionCount, lastSeenDaysAgo, avgDuration) {
  // For 2-3 sessions in short timeframe = emerging pattern
  if (sessionCount >= COLD_START_MIN_SESSIONS && sessionCount < 5) {
    if (lastSeenDaysAgo <= COLD_START_MAX_DAYS) {
      // Same time, 2-3 times in 2 weeks = emerging pattern
      let confidence = COLD_START_BASE_CONFIDENCE + (sessionCount * 5); // 50-60%

      // Longer sessions = more committed controller
      if (avgDuration > 60) {
        confidence += 5;
      }

      return Math.min(confidence, 65);
    }
  }
  return null; // Not a cold start case
}

/**
 * Get facility-specific confidence threshold
 */
async function getFacilityConfidenceThreshold(facility) {
  if (!mlPool) return MIN_CONFIDENCE;

  try {
    const [rows] = await mlPool.query(
      `SELECT confidence_threshold, accuracy_rate, total_predictions
       FROM facility_accuracy_metrics
       WHERE facility = ?`,
      [facility]
    );

    if (rows[0] && rows[0].total_predictions >= 10) {
      return rows[0].confidence_threshold;
    }
    return MIN_CONFIDENCE; // Default
  } catch (err) {
    return MIN_CONFIDENCE;
  }
}

/**
 * Calculate Bayesian confidence with statistical intervals
 */
function calculateBayesianConfidence(heuristicConfidence, sessionCount, controllerAccuracy) {
  // Use Beta distribution for Bayesian inference
  // Prior: assume 50% success rate (neutral)
  let alpha = 50; // Prior successes
  let beta = 50;  // Prior failures

  // Update with controller history
  if (sessionCount >= 3) {
    // Assume 70% hit rate for patterns
    const expectedSuccess = sessionCount * 0.7;
    alpha += expectedSuccess;
    beta += (sessionCount - expectedSuccess);
  }

  // Adjust for controller accuracy if available
  if (controllerAccuracy && controllerAccuracy.total >= 3) {
    const accRate = controllerAccuracy.correct / controllerAccuracy.total;
    alpha += controllerAccuracy.correct;
    beta += (controllerAccuracy.total - controllerAccuracy.correct);
  }

  // Posterior mean (expected value)
  const posteriorMean = alpha / (alpha + beta);

  // Variance for confidence interval
  const variance = (alpha * beta) /
    (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
  const stdDev = Math.sqrt(variance);

  // 95% confidence interval
  const lower = Math.max(0, (posteriorMean - 1.96 * stdDev) * 100);
  const upper = Math.min(100, (posteriorMean + 1.96 * stdDev) * 100);
  const bayesian = posteriorMean * 100;

  // Blend heuristic with Bayesian (70/30 weight)
  const blended = (heuristicConfidence * 0.7) + (bayesian * 0.3);

  return {
    confidence: Math.round(blended),
    lower: Math.round(lower),
    upper: Math.round(upper),
    bayesian: Math.round(bayesian)
  };
}

/**
 * Generate predictions for the next 24-48 hours
 */
async function generatePredictions() {
  if (!mlPool) {
    console.warn('[WARNING] ML Prediction Engine not initialized');
    return { success: false };
  }

  // Check if we have enough training data
  const canPredict = await hasEnoughTrainingData();
  if (!canPredict) {
    console.log(' Not enough training data yet to make predictions');
    return { success: true, predictions: [], status: 'training' };
  }

  try {
    console.log('[ML] Generating predictions for next 24 hours...');

    const predictions = [];
    const tomorrow = addDays(new Date(), 1);
    const tomorrowDayOfWeek = getDay(tomorrow);
    const tomorrowDateStr = format(tomorrow, 'yyyy-MM-dd');

    // Get list of all facilities we've seen
    const [facilities] = await mlPool.query(
      `SELECT DISTINCT facility FROM controller_sessions
       WHERE logon_time >= ?`,
      [subDays(new Date(), 60)]
    );

    for (const { facility } of facilities) {
      // Get historical patterns for this facility
      const patterns = await getFacilityPatterns(facility, 60);

      if (!patterns || patterns.length === 0) continue;

      // Filter to patterns matching tomorrow's day of week
      const relevantPatterns = patterns.filter(p => p.day_of_week === tomorrowDayOfWeek);

      if (relevantPatterns.length === 0) continue;

      // Group by hour and calculate probabilities
      const hourlyData = {};
      for (const pattern of relevantPatterns) {
        const hour = pattern.hour_of_day;
        if (!hourlyData[hour]) {
          hourlyData[hour] = {
            session_count: 0,
            avg_duration: [],
            unique_controllers: 0,
          };
        }
        hourlyData[hour].session_count += pattern.session_count;
        hourlyData[hour].avg_duration.push(pattern.avg_duration);
        hourlyData[hour].unique_controllers += pattern.unique_controllers;
      }

      // Generate predictions for high-probability hours
      for (const [hour, data] of Object.entries(hourlyData)) {
        // Check for outliers (special events) for this specific facility/day/hour
        const outlierInfo = await filterEventOutliers(facility, tomorrowDayOfWeek, parseInt(hour), 60);

        // Skip this prediction if there's insufficient reliable data after removing outliers
        if (!outlierInfo.isReliable) {
          if (outlierInfo.totalFiltered > 0) {
            console.log(`[WARNING] Skipping ${facility} ${hour}:00 - filtered ${outlierInfo.eventCount} event(s) + ${outlierInfo.unknownOutlierCount} unknown outlier(s)`);
          }
          continue;
        }

        const totalSessions = patterns.reduce((sum, p) => sum + p.session_count, 0);

        // Get most likely controller for this facility/day/hour
        const likelyController = await getMostLikelyController(facility, tomorrowDayOfWeek, parseInt(hour));

        // Calculate base confidence with all enhancements
        let baseConfidence = calculateConfidence([data], totalSessions, outlierInfo, likelyController, hour);

        // Boost confidence based on controller consistency
        if (likelyController) {
          if (likelyController.consistency_score > 80) {
            baseConfidence = Math.min(baseConfidence + 15, 95);
          } else if (likelyController.consistency_score > 60) {
            baseConfidence = Math.min(baseConfidence + 10, 95);
          }
        }

        let finalConfidence = Math.round(baseConfidence);

        // === NEW: Cold start handling for emerging patterns ===
        const avgDuration = Math.round(data.avg_duration.reduce((a, b) => a + b, 0) / data.avg_duration.length);

        if (finalConfidence < MIN_CONFIDENCE && likelyController) {
          const lastSeenDaysAgo = differenceInDays(new Date(), new Date(likelyController.last_seen));
          const coldStartConf = calculateColdStartConfidence(data.session_count, lastSeenDaysAgo, avgDuration);

          if (coldStartConf) {
            finalConfidence = coldStartConf;
            console.log(`   [ML] Cold start bonus applied: ${coldStartConf}%`);
          }
        }

        // === NEW: Get facility-specific threshold ===
        const facilityThreshold = await getFacilityConfidenceThreshold(facility);

        // === NEW: Apply Bayesian confidence intervals ===
        const bayesianResult = calculateBayesianConfidence(
          finalConfidence,
          data.session_count,
          likelyController ? {
            total: likelyController.session_count || 0,
            correct: Math.round((likelyController.session_count || 0) * (likelyController.consistency_score || 0) / 100)
          } : null
        );

        if (bayesianResult.confidence >= facilityThreshold) {
          predictions.push({
            facility,
            predicted_date: tomorrowDateStr,
            predicted_hour: parseInt(hour),
            confidence: bayesianResult.confidence,
            confidence_lower: bayesianResult.lower,
            confidence_upper: bayesianResult.upper,
            bayesian_confidence: bayesianResult.bayesian,
            expected_duration: avgDuration,
            based_on_sessions: data.session_count,
            predicted_controller_cid: likelyController?.controller_cid || null,
            predicted_controller_name: likelyController?.controller_name || null,
          });
        }
      }
    }

    // Save predictions to database
    for (const pred of predictions) {
      await mlPool.query(
        `INSERT INTO controller_predictions
          (facility, predicted_date, predicted_hour, confidence,
           confidence_lower, confidence_upper, bayesian_confidence,
           predicted_controller_cid, predicted_controller_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pred.facility,
          pred.predicted_date,
          pred.predicted_hour,
          pred.confidence,
          pred.confidence_lower,
          pred.confidence_upper,
          pred.bayesian_confidence,
          pred.predicted_controller_cid,
          pred.predicted_controller_name
        ]
      );
    }

    // Update model metadata with prediction count
    const today = format(new Date(), 'yyyy-MM-dd');
    await mlPool.query(
      `UPDATE ml_model_metadata
       SET predictions_made = predictions_made + ?
       WHERE date = ?`,
      [predictions.length, today]
    );

    console.log(`[ML] Generated ${predictions.length} predictions (outliers filtered)`);
    return { success: true, predictions, status: 'active' };

  } catch (err) {
    console.error('[ERROR] Prediction generation failed:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Evaluate past predictions against actual outcomes
 */
async function evaluatePredictions() {
  if (!mlPool) return { success: false };

  try {
    // Get unevaluated predictions from yesterday or earlier
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    const [predictions] = await mlPool.query(
      `SELECT * FROM controller_predictions
       WHERE predicted_date <= ? AND evaluated_at IS NULL`,
      [yesterday]
    );

    if (predictions.length === 0) {
      return { success: true, evaluated: 0 };
    }

    let correctPredictions = 0;

    for (const prediction of predictions) {
      // Check if there was actually a session at this facility on this date/hour
      const predDate = new Date(prediction.predicted_date);
      const predHour = prediction.predicted_hour;

      const [actualSessions] = await mlPool.query(
        `SELECT
          SUM(duration_minutes) as total_duration,
          COUNT(*) as session_count
         FROM controller_sessions
         WHERE facility = ?
           AND DATE(logon_time) = ?
           AND hour_of_day = ?`,
        [prediction.facility, format(predDate, 'yyyy-MM-dd'), predHour]
      );

      const actualOpened = actualSessions[0].session_count > 0;
      const actualDuration = actualSessions[0].total_duration || 0;

      if (actualOpened) {
        correctPredictions++;
      }

      // Update prediction with actual outcome
      await mlPool.query(
        `UPDATE controller_predictions
         SET actual_opened = ?,
             actual_duration = ?,
             evaluated_at = NOW()
         WHERE id = ?`,
        [actualOpened, actualDuration, prediction.id]
      );
    }

    // Update model metadata with accuracy
    const accuracy = predictions.length > 0
      ? Math.round((correctPredictions / predictions.length) * 100)
      : 0;

    const today = format(new Date(), 'yyyy-MM-dd');
    await mlPool.query(
      `INSERT INTO ml_model_metadata
        (date, predictions_evaluated, correct_predictions, accuracy_rate)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        predictions_evaluated = predictions_evaluated + VALUES(predictions_evaluated),
        correct_predictions = correct_predictions + VALUES(correct_predictions),
        accuracy_rate = (correct_predictions * 100.0 / predictions_evaluated)`,
      [today, predictions.length, correctPredictions, accuracy]
    );

    console.log(`[ML] Evaluated ${predictions.length} predictions (${correctPredictions} correct, ${accuracy}% accuracy)`);
    return { success: true, evaluated: predictions.length, correct: correctPredictions, accuracy };

  } catch (err) {
    console.error('[ERROR] Prediction evaluation failed:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Get prediction statistics
 */
async function getPredictionStats() {
  if (!mlPool) return null;

  try {
    const [stats] = await mlPool.query(
      `SELECT
        COUNT(*) as total_predictions,
        SUM(CASE WHEN actual_opened = 1 THEN 1 ELSE 0 END) as correct_predictions,
        AVG(confidence) as avg_confidence,
        COUNT(CASE WHEN evaluated_at IS NOT NULL THEN 1 END) as evaluated_count
       FROM controller_predictions`
    );

    const [recentAccuracy] = await mlPool.query(
      `SELECT
        date,
        accuracy_rate,
        predictions_made,
        predictions_evaluated
       FROM ml_model_metadata
       WHERE date >= ?
       ORDER BY date DESC
       LIMIT 7`,
      [format(subDays(new Date(), 7), 'yyyy-MM-dd')]
    );

    return {
      overall: stats[0],
      recent: recentAccuracy,
    };
  } catch (err) {
    console.error('Error getting prediction stats:', err.message);
    return null;
  }
}

/**
 * Cleanup - close pool when shutting down
 */
async function closePrediction() {
  if (mlPool) {
    await mlPool.end();
    mlPool = null;
    console.log('[ML] Prediction Engine closed');
  }
}

module.exports = {
  initializePrediction,
  hasEnoughTrainingData,
  generatePredictions,
  evaluatePredictions,
  getPredictionStats,
  closePrediction,
};
