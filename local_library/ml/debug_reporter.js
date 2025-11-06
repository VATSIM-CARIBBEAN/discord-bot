// local_library/ml_debug_reporter.js
// Sends daily debug reports to developer about ML learning progress

const { EmbedBuilder } = require('discord.js');
const { createMLPool } = require('./schema');
const { format, subDays } = require('date-fns');
const { hasEnoughTrainingData, getPredictionStats } = require('./prediction_engine');

let mlPool = null;

const DEBUG_USER_ID = process.env.ML_DEBUG_USER_ID;

/**
 * Initialize the debug reporter
 */
function initializeReporter() {
  if (!mlPool) {
    mlPool = createMLPool();
    console.log('[ML] ML Debug Reporter initialized');
  }
}

/**
 * Send daily debug report to developer
 */
async function sendDailyReport(client) {
  if (!mlPool || !DEBUG_USER_ID) {
    console.warn('[WARNING] ML Debug Reporter not configured');
    return { success: false };
  }

  try {
    const user = await client.users.fetch(DEBUG_USER_ID);
    if (!user) {
      console.error('Could not find debug user');
      return { success: false };
    }

    console.log('[ML] Generating daily ML report...');

    const yesterday = subDays(new Date(), 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');

    // Get yesterday's session data
    const [sessionStats] = await mlPool.query(
      `SELECT
        COUNT(*) as total_sessions,
        COUNT(DISTINCT controller_cid) as unique_controllers,
        COUNT(DISTINCT facility) as unique_facilities,
        SUM(duration_minutes) as total_minutes,
        AVG(duration_minutes) as avg_duration
       FROM controller_sessions
       WHERE DATE(logon_time) = ?`,
      [yesterdayStr]
    );

    const stats = sessionStats[0] || {
      total_sessions: 0,
      unique_controllers: 0,
      unique_facilities: 0,
      total_minutes: 0,
      avg_duration: 0,
    };

    // Get insights from yesterday
    const [insights] = await mlPool.query(
      `SELECT * FROM ml_daily_learning
       WHERE date = ?
       ORDER BY insight_type`,
      [yesterdayStr]
    );

    // Get top facilities from yesterday
    const [topFacilities] = await mlPool.query(
      `SELECT
        facility,
        COUNT(*) as session_count,
        SUM(duration_minutes) as total_minutes
       FROM controller_sessions
       WHERE DATE(logon_time) = ?
       GROUP BY facility
       ORDER BY session_count DESC
       LIMIT 5`,
      [yesterdayStr]
    );

    // Get top controllers from yesterday
    const [topControllers] = await mlPool.query(
      `SELECT
        controller_name,
        controller_cid,
        COUNT(*) as session_count,
        SUM(duration_minutes) as total_minutes
       FROM controller_sessions
       WHERE DATE(logon_time) = ? AND controller_name IS NOT NULL
       GROUP BY controller_cid, controller_name
       ORDER BY session_count DESC
       LIMIT 5`,
      [yesterdayStr]
    );

    // Get overall training progress
    const [firstSession] = await mlPool.query(
      `SELECT MIN(logon_time) as first_session,
              COUNT(*) as total_all_time,
              COUNT(DISTINCT controller_cid) as total_controllers,
              COUNT(DISTINCT facility) as total_facilities
       FROM controller_sessions`
    );

    const trainingDays = firstSession[0]?.first_session
      ? Math.floor((Date.now() - new Date(firstSession[0].first_session).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const canPredict = await hasEnoughTrainingData();
    const trainingProgress = Math.min((trainingDays / 30) * 100, 100);

    // Get prediction stats if we're making predictions
    let predictionData = null;
    if (canPredict) {
      predictionData = await getPredictionStats();
    }

    // Build the embed
    const embed = new EmbedBuilder()
      .setTitle('ML System Daily Report')
      .setColor(canPredict ? '#29b473' : '#FFA500')
      .setTimestamp();

    // Training Status
    let statusText = `**Training Progress:** ${Math.round(trainingProgress)}% (Day ${trainingDays}/30)\n`;
    statusText += `**Status:** ${canPredict ? '[SUCCESS] Active & Predicting' : ' Collecting Training Data'}\n`;
    statusText += `**Total Sessions Recorded:** ${firstSession[0]?.total_all_time || 0}\n`;
    statusText += `**Unique Controllers:** ${firstSession[0]?.total_controllers || 0}\n`;
    statusText += `**Unique Facilities:** ${firstSession[0]?.total_facilities || 0}`;
    embed.addFields({ name: '[ML] Training Status', value: statusText, inline: false });

    // Yesterday's Activity
    let yesterdayText = `**Sessions:** ${stats.total_sessions}\n`;
    yesterdayText += `**Controllers:** ${stats.unique_controllers}\n`;
    yesterdayText += `**Facilities:** ${stats.unique_facilities}\n`;
    yesterdayText += `**Total Duration:** ${Math.round(stats.total_minutes / 60)}h ${stats.total_minutes % 60}m\n`;
    yesterdayText += `**Avg Session:** ${Math.round(stats.avg_duration)}m`;
    embed.addFields({ name: `[ML] Yesterday's Activity (${yesterdayStr})`, value: yesterdayText, inline: false });

    // Top Facilities
    if (topFacilities.length > 0) {
      let facilityText = topFacilities.map(f =>
        `• ${f.facility}: ${f.session_count} sessions (${Math.round(f.total_minutes / 60)}h)`
      ).join('\n');
      embed.addFields({ name: ' Top Facilities', value: facilityText || 'None', inline: true });
    }

    // Top Controllers
    if (topControllers.length > 0) {
      let controllerText = topControllers.map(c =>
        `• ${c.controller_name}: ${c.session_count} sessions (${Math.round(c.total_minutes / 60)}h)`
      ).join('\n');
      embed.addFields({ name: ' Top Controllers', value: controllerText || 'None', inline: true });
    }

    // Insights
    if (insights.length > 0) {
      const insightTypes = {};
      for (const insight of insights) {
        if (!insightTypes[insight.insight_type]) {
          insightTypes[insight.insight_type] = 0;
        }
        insightTypes[insight.insight_type]++;
      }

      let insightText = Object.entries(insightTypes)
        .map(([type, count]) => `• ${type}: ${count}`)
        .join('\n');

      // Add notable insights
      const longSessions = insights.find(i => i.insight_type === 'long_sessions');
      if (longSessions) {
        const data = JSON.parse(longSessions.insight_data);
        insightText += `\n\n**Long Sessions Detected:** ${data.count}`;
      }

      const newFacilities = insights.find(i => i.insight_type === 'new_facilities');
      if (newFacilities) {
        const data = JSON.parse(newFacilities.insight_data);
        insightText += `\n**New Facilities:** ${data.new_facilities.join(', ')}`;
      }

      embed.addFields({ name: ' Insights Generated', value: insightText, inline: false });
    }

    // Prediction Performance (if active)
    if (canPredict && predictionData) {
      const overall = predictionData.overall;
      const accuracy = overall.evaluated_count > 0
        ? Math.round((overall.correct_predictions / overall.evaluated_count) * 100)
        : 0;

      let predText = `**Total Predictions:** ${overall.total_predictions}\n`;
      predText += `**Evaluated:** ${overall.evaluated_count}\n`;
      predText += `**Correct:** ${overall.correct_predictions}\n`;
      predText += `**Accuracy:** ${accuracy}%\n`;
      predText += `**Avg Confidence:** ${Math.round(overall.avg_confidence)}%`;

      embed.addFields({ name: '[ML] Prediction Performance', value: predText, inline: false });

      // Recent accuracy trend
      if (predictionData.recent && predictionData.recent.length > 0) {
        let trendText = predictionData.recent.slice(0, 3).map(r =>
          `• ${r.date}: ${Math.round(r.accuracy_rate)}% (${r.predictions_evaluated} eval)`
        ).join('\n');
        embed.addFields({ name: ' Recent Accuracy', value: trendText || 'No recent data', inline: false });
      }
    }

    // Data Quality
    let qualityText = `**Data Completeness:** ${stats.total_sessions > 0 ? '[SUCCESS] Good' : '[WARNING] No data yesterday'}\n`;
    qualityText += `**Missing CIDs:** ${stats.total_sessions > 0 ? 'Checking...' : 'N/A'}`;
    embed.addFields({ name: ' Data Quality', value: qualityText, inline: false });

    // Footer with next steps
    if (!canPredict) {
      embed.setFooter({ text: `${30 - trainingDays} days until predictions start` });
    } else {
      embed.setFooter({ text: 'System is actively learning and predicting' });
    }

    // Send DM
    await user.send({ embeds: [embed] });
    console.log('[SUCCESS] Daily report sent to developer');

    return { success: true };

  } catch (err) {
    console.error('[ERROR] Failed to send daily report:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Send a custom notification (e.g., for important insights)
 */
async function sendCustomNotification(client, title, message, color = '#29b473') {
  if (!DEBUG_USER_ID) return { success: false };

  try {
    const user = await client.users.fetch(DEBUG_USER_ID);
    if (!user) return { success: false };

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor(color)
      .setTimestamp();

    await user.send({ embeds: [embed] });
    return { success: true };

  } catch (err) {
    console.error('Failed to send custom notification:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Cleanup - close pool when shutting down
 */
async function closeReporter() {
  if (mlPool) {
    await mlPool.end();
    mlPool = null;
    console.log('[ML] ML Debug Reporter closed');
  }
}

module.exports = {
  initializeReporter,
  sendDailyReport,
  sendCustomNotification,
  closeReporter,
};
