// local_library/ml_learning_engine.js
// Analyzes controller patterns and generates insights

const { createMLPool } = require('./schema');
const { subDays, format, startOfDay, endOfDay } = require('date-fns');
const stats = require('simple-statistics');

let mlPool = null;

/**
 * Initialize the learning engine
 */
function initializeLearning() {
  if (!mlPool) {
    mlPool = createMLPool();
    console.log('[ML] ML Learning Engine initialized');
  }
}

/**
 * Analyze sessions from the last 24 hours and generate insights
 */
async function runDailyAnalysis() {
  if (!mlPool) {
    console.warn('[WARNING] ML Learning Engine not initialized');
    return { success: false };
  }

  try {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const dateStr = format(yesterday, 'yyyy-MM-dd');

    console.log(`[ML] Running daily analysis for ${dateStr}...`);

    // Get all sessions from yesterday
    const [sessions] = await mlPool.query(
      `SELECT * FROM controller_sessions
       WHERE logon_time >= ? AND logon_time < ?`,
      [startOfDay(yesterday), endOfDay(yesterday)]
    );

    if (sessions.length === 0) {
      console.log('No sessions to analyze for yesterday');
      return { success: true, insights: [] };
    }

    const insights = [];

    // 1. Overall statistics
    const uniqueControllersSet = new Set(sessions.map(s => s.controller_cid));
    const uniqueFacilitiesSet = new Set(sessions.map(s => s.facility));
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const avgDuration = totalDuration / sessions.length;

    insights.push({
      type: 'daily_summary',
      facility: null,
      controller_cid: null,
      data: {
        date: dateStr,
        total_sessions: sessions.length,
        unique_controllers: uniqueControllersSet.size,
        unique_facilities: uniqueFacilitiesSet.size,
        total_duration_hours: Math.round(totalDuration / 60 * 10) / 10,
        avg_duration_minutes: Math.round(avgDuration),
      },
    });

    // 2. Facility-level analysis
    const facilityGroups = {};
    for (const session of sessions) {
      if (!facilityGroups[session.facility]) {
        facilityGroups[session.facility] = [];
      }
      facilityGroups[session.facility].push(session);
    }

    for (const [facility, facilitySessions] of Object.entries(facilityGroups)) {
      const durations = facilitySessions.map(s => s.duration_minutes);
      const avgFacilityDuration = stats.mean(durations);
      const mostCommonHour = stats.mode(facilitySessions.map(s => s.hour_of_day));

      insights.push({
        type: 'facility_activity',
        facility,
        controller_cid: null,
        data: {
          date: dateStr,
          session_count: facilitySessions.length,
          avg_duration: Math.round(avgFacilityDuration),
          total_duration: Math.round(stats.sum(durations)),
          most_active_hour: mostCommonHour,
          controllers: [...new Set(facilitySessions.map(s => s.controller_name))],
        },
      });
    }

    // 3. Controller-level patterns
    const controllerGroups = {};
    for (const session of sessions) {
      if (session.controller_cid) {
        if (!controllerGroups[session.controller_cid]) {
          controllerGroups[session.controller_cid] = [];
        }
        controllerGroups[session.controller_cid].push(session);
      }
    }

    for (const [cid, controllerSessions] of Object.entries(controllerGroups)) {
      const durations = controllerSessions.map(s => s.duration_minutes);
      const facilities = [...new Set(controllerSessions.map(s => s.facility))];
      const positions = [...new Set(controllerSessions.map(s => s.position_type))];

      insights.push({
        type: 'controller_pattern',
        facility: null,
        controller_cid: cid,
        data: {
          date: dateStr,
          controller_name: controllerSessions[0].controller_name,
          session_count: controllerSessions.length,
          total_duration: Math.round(stats.sum(durations)),
          avg_duration: Math.round(stats.mean(durations)),
          facilities_controlled: facilities,
          position_types: positions,
          preferred_hours: controllerSessions.map(s => s.hour_of_day),
        },
      });
    }

    // 4. Detect anomalies or interesting patterns
    // Check for unusually long sessions
    const longSessions = sessions.filter(s => s.duration_minutes > 240); // > 4 hours
    if (longSessions.length > 0) {
      insights.push({
        type: 'long_sessions',
        facility: null,
        controller_cid: null,
        data: {
          date: dateStr,
          count: longSessions.length,
          sessions: longSessions.map(s => ({
            controller: s.controller_name,
            facility: s.facility,
            duration: s.duration_minutes,
          })),
        },
      });
    }

    // Check for new facilities with activity
    const [historicalFacilities] = await mlPool.query(
      `SELECT DISTINCT facility FROM controller_sessions
       WHERE logon_time < ?`,
      [startOfDay(yesterday)]
    );
    const historicalFacilitySet = new Set(historicalFacilities.map(f => f.facility));
    const newFacilities = Array.from(uniqueFacilitiesSet).filter(f => !historicalFacilitySet.has(f));

    if (newFacilities.length > 0) {
      insights.push({
        type: 'new_facilities',
        facility: null,
        controller_cid: null,
        data: {
          date: dateStr,
          new_facilities: Array.from(newFacilities),
        },
      });
    }

    // Store insights in database
    for (const insight of insights) {
      await mlPool.query(
        `INSERT INTO ml_daily_learning (date, insight_type, facility, controller_cid, insight_data)
         VALUES (?, ?, ?, ?, ?)`,
        [dateStr, insight.type, insight.facility, insight.controller_cid, JSON.stringify(insight.data)]
      );
    }

    // Update model metadata
    await mlPool.query(
      `INSERT INTO ml_model_metadata
        (date, total_sessions, unique_controllers, unique_facilities)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        total_sessions = VALUES(total_sessions),
        unique_controllers = VALUES(unique_controllers),
        unique_facilities = VALUES(unique_facilities)`,
      [dateStr, sessions.length, uniqueControllersSet.size, uniqueFacilitiesSet.size]
    );

    console.log(`[SUCCESS] Daily analysis complete: ${insights.length} insights generated`);
    return { success: true, insights };

  } catch (err) {
    console.error('[ERROR] Daily analysis failed:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Get controller patterns for prediction
 * Returns historical data for a specific controller
 */
async function getControllerPatterns(controllerCid, daysBack = 30) {
  if (!mlPool) return null;

  try {
    const startDate = subDays(new Date(), daysBack);

    const [sessions] = await mlPool.query(
      `SELECT
        facility,
        position_type,
        day_of_week,
        hour_of_day,
        duration_minutes,
        COUNT(*) as frequency
      FROM controller_sessions
      WHERE controller_cid = ? AND logon_time >= ?
      GROUP BY facility, position_type, day_of_week, hour_of_day, duration_minutes
      ORDER BY frequency DESC`,
      [controllerCid, startDate]
    );

    return sessions;
  } catch (err) {
    console.error('Error getting controller patterns:', err.message);
    return null;
  }
}

/**
 * Get facility coverage patterns
 * Returns historical data about when facilities are typically staffed
 */
async function getFacilityPatterns(facility, daysBack = 30) {
  if (!mlPool) return null;

  try {
    const startDate = subDays(new Date(), daysBack);

    const [patterns] = await mlPool.query(
      `SELECT
        day_of_week,
        hour_of_day,
        COUNT(*) as session_count,
        AVG(duration_minutes) as avg_duration,
        COUNT(DISTINCT controller_cid) as unique_controllers
      FROM controller_sessions
      WHERE facility = ? AND logon_time >= ?
      GROUP BY day_of_week, hour_of_day
      ORDER BY session_count DESC`,
      [facility, startDate]
    );

    return patterns;
  } catch (err) {
    console.error('Error getting facility patterns:', err.message);
    return null;
  }
}

/**
 * Calculate consecutive weeks a controller has worked a specific pattern
 */
async function calculateConsecutiveWeeks(controllerCid, facility, dayOfWeek, hourOfDay) {
  if (!mlPool) return 0;

  try {
    const [weeks] = await mlPool.query(
      `SELECT DISTINCT YEARWEEK(logon_time, 1) as week_num
       FROM controller_sessions
       WHERE controller_cid = ?
         AND facility = ?
         AND day_of_week = ?
         AND hour_of_day = ?
         AND logon_time >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
       ORDER BY week_num DESC`,
      [controllerCid, facility, dayOfWeek, hourOfDay]
    );

    if (weeks.length === 0) return 0;

    let streak = 1; // Start with 1 if they worked this week
    for (let i = 0; i < weeks.length - 1; i++) {
      if (weeks[i].week_num - weeks[i + 1].week_num === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  } catch (err) {
    console.error('Error calculating consecutive weeks:', err.message);
    return 0;
  }
}

/**
 * Analyze session continuity patterns for a controller
 */
async function analyzeSessionContinuity(controllerCid, facility, dayOfWeek, hour) {
  if (!mlPool) return { avgDuration: 0, typicalLength: 1 };

  try {
    const [sessions] = await mlPool.query(
      `SELECT duration_minutes
       FROM controller_sessions
       WHERE controller_cid = ?
         AND facility = ?
         AND day_of_week = ?
         AND hour_of_day BETWEEN ? - 2 AND ? + 2
         AND logon_time >= DATE_SUB(NOW(), INTERVAL 60 DAY)
       ORDER BY logon_time DESC
       LIMIT 20`,
      [controllerCid, facility, dayOfWeek, hour, hour]
    );

    if (sessions.length < 2) return { avgDuration: 0, typicalLength: 1 };

    const avgDuration = sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / sessions.length;
    const typicalLength = Math.max(1, Math.round(avgDuration / 60)); // Convert to hours

    return { avgDuration, typicalLength };
  } catch (err) {
    console.error('Error analyzing session continuity:', err.message);
    return { avgDuration: 0, typicalLength: 1 };
  }
}

/**
 * Calculate how many facilities a controller rotates between
 */
async function calculateFacilityCount(controllerCid, daysBack = 60) {
  if (!mlPool) return 1;

  try {
    const startDate = subDays(new Date(), daysBack);
    const [result] = await mlPool.query(
      `SELECT COUNT(DISTINCT facility) as fac_count
       FROM controller_sessions
       WHERE controller_cid = ?
         AND logon_time >= ?`,
      [controllerCid, startDate]
    );

    return result[0]?.fac_count || 1;
  } catch (err) {
    console.error('Error calculating facility count:', err.message);
    return 1;
  }
}

/**
 * Analyze and update controller patterns
 * Identifies which controllers work which positions/times most frequently
 */
async function analyzeControllerPatterns(daysBack = 60) {
  if (!mlPool) {
    console.warn('[WARNING] ML Learning Engine not initialized');
    return { success: false };
  }

  try {
    const startDate = subDays(new Date(), daysBack);
    console.log(`[ML] Analyzing controller patterns from last ${daysBack} days...`);

    // Get controller activity grouped by facility, day of week, and hour
    // Apply exponential time decay weighting to prioritize recent activity
    const [patterns] = await mlPool.query(
      `SELECT
        controller_cid,
        controller_name,
        facility,
        day_of_week,
        hour_of_day,
        SUM(
          CASE
            WHEN DATEDIFF(NOW(), DATE(logon_time)) <= 7 THEN 1.0
            WHEN DATEDIFF(NOW(), DATE(logon_time)) <= 14 THEN 0.8
            WHEN DATEDIFF(NOW(), DATE(logon_time)) <= 30 THEN 0.5
            WHEN DATEDIFF(NOW(), DATE(logon_time)) <= 45 THEN 0.3
            ELSE 0.15
          END
        ) as weighted_session_count,
        COUNT(*) as raw_session_count,
        AVG(duration_minutes) as avg_duration,
        MAX(DATE(logon_time)) as last_seen,
        MAX(YEARWEEK(logon_time)) as last_week
      FROM controller_sessions
      WHERE logon_time >= ? AND controller_cid IS NOT NULL
      GROUP BY controller_cid, facility, day_of_week, hour_of_day
      HAVING weighted_session_count >= 1.5`,
      [startDate]
    );

    if (patterns.length === 0) {
      console.log('No patterns to analyze');
      return { success: true, patternsUpdated: 0 };
    }

    let updatedCount = 0;

    for (const pattern of patterns) {
      // Calculate consistency score (0-100) using weighted session count
      const weeksInPeriod = daysBack / 7;
      const expectedMaxSessions = weeksInPeriod;
      let consistencyScore = Math.min((pattern.weighted_session_count / expectedMaxSessions) * 100, 100);

      // Adjust consistency based on prediction accuracy for this controller
      const [accuracyRows] = await mlPool.query(
        `SELECT
          COUNT(*) as total_predictions,
          SUM(CASE WHEN predicted_controller_correct = TRUE THEN 1 ELSE 0 END) as correct_predictions
        FROM controller_predictions
        WHERE predicted_controller_cid = ?
          AND facility = ?
          AND (DAYOFWEEK(predicted_date) - 1) = ?
          AND predicted_hour = ?
          AND evaluated_at IS NOT NULL`,
        [pattern.controller_cid, pattern.facility, pattern.day_of_week, pattern.hour_of_day]
      );

      if (accuracyRows[0]?.total_predictions >= 3) {
        const accuracy = (accuracyRows[0].correct_predictions / accuracyRows[0].total_predictions) * 100;
        if (accuracy > 70) {
          consistencyScore = Math.min(consistencyScore * 1.2, 100);
        } else if (accuracy < 30) {
          consistencyScore = consistencyScore * 0.8;
        }
      }

      // Calculate enhanced pattern metrics
      const consecutiveWeeks = await calculateConsecutiveWeeks(
        pattern.controller_cid,
        pattern.facility,
        pattern.day_of_week,
        pattern.hour_of_day
      );

      const sessionContinuity = await analyzeSessionContinuity(
        pattern.controller_cid,
        pattern.facility,
        pattern.day_of_week,
        pattern.hour_of_day
      );

      const facilityCount = await calculateFacilityCount(pattern.controller_cid, daysBack);

      // Convert last_week YEARWEEK format to DATE
      const lastWeekActive = pattern.last_seen; // Use last_seen as proxy

      // Upsert pattern to database with all new metrics
      await mlPool.query(
        `INSERT INTO controller_patterns
          (controller_cid, controller_name, facility, day_of_week, hour_of_day,
           session_count, avg_duration_minutes, consistency_score, last_seen,
           consecutive_weeks, avg_session_duration, typical_session_length,
           facility_count, last_week_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          controller_name = VALUES(controller_name),
          session_count = VALUES(session_count),
          avg_duration_minutes = VALUES(avg_duration_minutes),
          consistency_score = VALUES(consistency_score),
          last_seen = VALUES(last_seen),
          consecutive_weeks = VALUES(consecutive_weeks),
          avg_session_duration = VALUES(avg_session_duration),
          typical_session_length = VALUES(typical_session_length),
          facility_count = VALUES(facility_count),
          last_week_active = VALUES(last_week_active),
          updated_at = CURRENT_TIMESTAMP`,
        [
          pattern.controller_cid,
          pattern.controller_name,
          pattern.facility,
          pattern.day_of_week,
          pattern.hour_of_day,
          Math.round(pattern.weighted_session_count * 10) / 10, // Store weighted count
          Math.round(pattern.avg_duration),
          Math.round(consistencyScore * 100) / 100,
          pattern.last_seen,
          consecutiveWeeks,
          Math.round(sessionContinuity.avgDuration * 100) / 100,
          sessionContinuity.typicalLength,
          facilityCount,
          lastWeekActive,
        ]
      );

      updatedCount++;
    }

    console.log(`[SUCCESS] Updated ${updatedCount} controller patterns`);
    return { success: true, patternsUpdated: updatedCount };

  } catch (err) {
    console.error('[ERROR] Failed to analyze controller patterns:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Get the most likely controller for a facility/day/hour
 */
async function getMostLikelyController(facility, dayOfWeek, hourOfDay) {
  if (!mlPool) return null;

  try {
    const [controllers] = await mlPool.query(
      `SELECT
        controller_cid,
        controller_name,
        session_count,
        avg_duration_minutes,
        consistency_score,
        last_seen,
        consecutive_weeks,
        avg_session_duration,
        typical_session_length,
        facility_count,
        last_week_active
      FROM controller_patterns
      WHERE facility = ? AND day_of_week = ? AND hour_of_day = ?
      ORDER BY consistency_score DESC, session_count DESC
      LIMIT 1`,
      [facility, dayOfWeek, hourOfDay]
    );

    return controllers[0] || null;
  } catch (err) {
    console.error('Error getting most likely controller:', err.message);
    return null;
  }
}

/**
 * Get insights from the last N days
 */
async function getRecentInsights(daysBack = 7) {
  if (!mlPool) return [];

  try {
    const startDate = subDays(new Date(), daysBack);
    const dateStr = format(startDate, 'yyyy-MM-dd');

    const [insights] = await mlPool.query(
      `SELECT * FROM ml_daily_learning
       WHERE date >= ?
       ORDER BY date DESC, id DESC`,
      [dateStr]
    );

    return insights;
  } catch (err) {
    console.error('Error getting recent insights:', err.message);
    return [];
  }
}

/**
 * Cleanup - close pool when shutting down
 */
async function closeLearning() {
  if (mlPool) {
    await mlPool.end();
    mlPool = null;
    console.log('[ML] ML Learning Engine closed');
  }
}

module.exports = {
  initializeLearning,
  runDailyAnalysis,
  analyzeControllerPatterns,
  getMostLikelyController,
  getControllerPatterns,
  getFacilityPatterns,
  getRecentInsights,
  closeLearning,
};
