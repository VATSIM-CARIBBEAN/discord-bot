// local_library/ml_notifier.js
// Sends Discord DM notifications for upcoming predictions

const { createMLPool } = require('./schema');
const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const { format, addHours, parseISO, subDays } = require('date-fns');

let mlPool = null;
let discordClient = null;
let notificationJob = null;

// Configuration
const NOTIFICATION_USER_ID = '945415570281603103'; // Hardcoded Discord user ID

/**
 * Create Discord timestamp for automatic timezone conversion
 * @param {Date} date - The date object
 * @param {number} hour - Hour (0-23)
 * @returns {string} Discord timestamp format
 */
function createDiscordTimestamp(date, hour) {
  const datetime = new Date(date);
  datetime.setUTCHours(hour, 0, 0, 0);
  const unixTimestamp = Math.floor(datetime.getTime() / 1000);
  return `<t:${unixTimestamp}:t>`; // :t = short time format
}

/**
 * Initialize the notifier with Discord client
 */
function initializeNotifier(client) {
  if (!mlPool) {
    mlPool = createMLPool();
  }

  discordClient = client;

  // Schedule daily predictions summary at 7 AM UTC (after predictions are generated at 6 AM)
  notificationJob = schedule.scheduleJob('0 7 * * *', async () => {
    await sendDailyPredictions();
  });

  console.log('[ML] ML Notifier initialized (daily predictions at 7 AM UTC)');
}

/**
 * Send daily predictions summary with previous day results
 */
async function sendDailyPredictions() {
  if (!mlPool || !discordClient) {
    console.warn('[WARNING] ML Notifier not fully initialized');
    return;
  }

  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = subDays(today, 1);

    const tomorrowDate = format(tomorrow, 'yyyy-MM-dd');
    const yesterdayDate = format(yesterday, 'yyyy-MM-dd');

    // Fetch the user
    const user = await discordClient.users.fetch(NOTIFICATION_USER_ID);
    if (!user) {
      console.error(`[ERROR] Could not find user with ID ${NOTIFICATION_USER_ID}`);
      return;
    }

    const embeds = [];

    // ========== PART 1: Previous Day Results ==========
    const [yesterdayResults] = await mlPool.query(
      `SELECT * FROM controller_predictions
       WHERE predicted_date = ?
         AND evaluated_at IS NOT NULL
       ORDER BY predicted_hour ASC`,
      [yesterdayDate]
    );

    if (yesterdayResults.length > 0) {
      const correctCount = yesterdayResults.filter(p => p.actual_opened).length;
      const controllerCorrectCount = yesterdayResults.filter(p => p.predicted_controller_correct === 1).length;
      const accuracy = Math.round((correctCount / yesterdayResults.length) * 100);

      const resultsEmbed = new EmbedBuilder()
        .setColor(accuracy >= 70 ? 0x00FF00 : accuracy >= 50 ? 0xFFA500 : 0xFF0000)
        .setTitle(`[ML] Results for ${format(yesterday, 'EEEE, MMM dd, yyyy')}`)
        .setDescription(
          `**${correctCount}/${yesterdayResults.length}** predictions correct (**${accuracy}%** accuracy)\n` +
          `**${controllerCorrectCount}** had correct controller prediction`
        );

      // Group results by facility
      const byFacility = {};
      for (const pred of yesterdayResults) {
        if (!byFacility[pred.facility]) byFacility[pred.facility] = [];
        byFacility[pred.facility].push(pred);
      }

      for (const [facility, preds] of Object.entries(byFacility)) {
        const resultList = preds.map(p => {
          const timestamp = createDiscordTimestamp(yesterday, p.predicted_hour);
          const correct = p.actual_opened ? '[SUCCESS]' : '[ERROR]';
          const controllerMatch = p.predicted_controller_correct === 1 ? '👤[SUCCESS]' :
                                  p.predicted_controller_correct === 0 ? '👤[ERROR]' : '';
          const controller = p.predicted_controller_name ? ` ${p.predicted_controller_name}` : '';

          return `${timestamp} ${correct}${controllerMatch} (${p.confidence}%)${controller}`;
        }).join('\n');

        resultsEmbed.addFields({
          name: facility,
          value: resultList,
          inline: false
        });
      }

      embeds.push(resultsEmbed);
    }

    // ========== PART 2: Tomorrow's Predictions ==========
    const [predictions] = await mlPool.query(
      `SELECT * FROM controller_predictions
       WHERE predicted_date = ?
         AND notification_sent = FALSE
       ORDER BY predicted_hour ASC, confidence DESC`,
      [tomorrowDate]
    );

    if (predictions.length > 0) {
      const byFacility = {};
      for (const pred of predictions) {
        if (!byFacility[pred.facility]) byFacility[pred.facility] = [];
        byFacility[pred.facility].push(pred);
      }

      const predictionsEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`[ML] Predictions for ${format(tomorrow, 'EEEE, MMM dd, yyyy')}`)
        .setDescription(`**${predictions.length} predictions** across ${Object.keys(byFacility).length} facilities`);

      for (const [facility, preds] of Object.entries(byFacility)) {
        const predList = preds.map(p => {
          const timestamp = createDiscordTimestamp(tomorrow, p.predicted_hour);
          const controller = p.predicted_controller_name ? ` - ${p.predicted_controller_name}` : '';
          return `${timestamp} (${p.confidence}%)${controller}`;
        }).join('\n');

        predictionsEmbed.addFields({
          name: facility,
          value: predList,
          inline: false
        });
      }

      embeds.push(predictionsEmbed);

      // Mark all as notified
      await mlPool.query(
        `UPDATE controller_predictions
         SET notification_sent = TRUE, notification_sent_at = NOW()
         WHERE predicted_date = ?`,
        [tomorrowDate]
      );
    }

    // ========== Send Message ==========
    if (embeds.length > 0) {
      const summaryText = `**Daily ML Report** - ${format(today, 'EEEE, MMM dd, yyyy')}`;
      await user.send({ content: summaryText, embeds });
      console.log(`[SUCCESS] Sent daily report to user ${NOTIFICATION_USER_ID} (${embeds.length} embeds)`);
    } else {
      console.log('[ML] No predictions or results to send');
    }

  } catch (err) {
    console.error('[ERROR] Failed to send daily predictions:', err.message);
  }
}

/**
 * Manually trigger notification send (useful for testing)
 */
async function triggerNotificationCheck() {
  console.log(' Manually triggering daily predictions...');
  await sendDailyPredictions();
}

/**
 * Cleanup - close pool and cancel scheduled jobs
 */
async function closeNotifier() {
  if (notificationJob) {
    notificationJob.cancel();
    notificationJob = null;
  }

  if (mlPool) {
    await mlPool.end();
    mlPool = null;
  }

  discordClient = null;
  console.log('[ML] ML Notifier closed');
}

module.exports = {
  initializeNotifier,
  sendDailyPredictions,
  triggerNotificationCheck,
  closeNotifier,
};
