// index.js
require('dotenv').config();
const { startHeartbeat } = require('./local_library/heartbeat');
const { startTracker } = require('./local_library/vatsim_tracker');

// ML System
const { initializeMLSchema } = require('./local_library/ml/schema');
const { initializeCollector } = require('./local_library/ml/data_collector');
const { initializeLearning, runDailyAnalysis, analyzeControllerPatterns } = require('./local_library/ml/learning_engine');
const { initializePrediction, generatePredictions, evaluatePredictions } = require('./local_library/ml/prediction_engine');
const { initializeReporter, sendDailyReport } = require('./local_library/ml/debug_reporter');
const { initializeNotifier } = require('./local_library/ml/notifier');
const { initializeValidator } = require('./local_library/ml/validator');
const schedule = require('node-schedule');

const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  Collection,
  MessageFlags,
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const DISCORD_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const HB_URL = process.env.BETTERSTACK_HEARTBEAT_URL;
const HB_INTERVAL = Number(process.env.BETTERSTACK_HEARTBEAT_INTERVAL_MS || 60000);

if (!DISCORD_TOKEN || !GUILD_ID) {
  console.error('Missing one of BOT_TOKEN, GUILD_ID in .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel, Partials.Message],
});

// Load slash commands
client.commands = new Collection();
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js') && !file.startsWith('_')) {
      try {
        const command = require(filePath);
        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
        }
      } catch (err) {
        console.warn(`[WARNING]  Could not load command ${filePath}:`, err.message);
      }
    }
  }
}
loadCommands(path.join(__dirname, 'commands'));

let hbHandle = null;
let trackerHandle = null;

client.once(Events.ClientReady, async (bot) => {
  console.log(`[BOT] Logged in as ${bot.user.tag}`);
  console.log(` Guild: ${GUILD_ID}`);

  hbHandle = startHeartbeat(HB_URL, HB_INTERVAL);
  console.log('Better Stack heartbeat started.');

  trackerHandle = startTracker(client);

  // Initialize ML system if enabled
  if (process.env.ML_ENABLED === 'true') {
    console.log('[ML] Initializing ML system...');

    try {
      // Initialize database schema (critical - must succeed)
      await initializeMLSchema();
      console.log('[ML] Database schema initialized');

      // Initialize ML modules (wrap each to continue on partial failure)
      try {
        initializeCollector();
        console.log('[ML] Data collector initialized');
      } catch (err) {
        console.error('[ERROR] Data collector initialization failed:', err.message);
      }

      try {
        initializeLearning();
        console.log('[ML] Learning engine initialized');
      } catch (err) {
        console.error('[ERROR] Learning engine initialization failed:', err.message);
      }

      try {
        initializePrediction();
        console.log('[ML] Prediction engine initialized');
      } catch (err) {
        console.error('[ERROR] Prediction engine initialization failed:', err.message);
      }

      try {
        initializeReporter();
        console.log('[ML] Debug reporter initialized');
      } catch (err) {
        console.error('[ERROR] Debug reporter initialization failed:', err.message);
      }

      try {
        initializeNotifier(client);
        console.log('[ML] Notifier initialized');
      } catch (err) {
        console.error('[ERROR] Notifier initialization failed:', err.message);
      }

      try {
        initializeValidator();
        console.log('[ML] Validator initialized');
      } catch (err) {
        console.error('[ERROR] Validator initialization failed:', err.message);
      }

      // Schedule daily learning analysis at midnight UTC
      schedule.scheduleJob('0 0 * * *', async () => {
        console.log('[ML] Running scheduled daily analysis...');
        await runDailyAnalysis();
        await analyzeControllerPatterns();
      });

      // Schedule prediction generation at 6 AM UTC
      schedule.scheduleJob('0 6 * * *', async () => {
        console.log('[ML] Generating daily predictions...');
        await generatePredictions();
      });

      // Schedule prediction evaluation at 7 AM UTC
      schedule.scheduleJob('0 7 * * *', async () => {
        console.log('[ML] Evaluating predictions...');
        await evaluatePredictions();
      });

      // Schedule daily debug report at 8 AM UTC
      schedule.scheduleJob('0 8 * * *', async () => {
        console.log('[ML] Sending daily debug report...');
        await sendDailyReport(client);
      });

      // Schedule weekly VATSIM event fetch (Sunday at midnight UTC)
      schedule.scheduleJob('0 0 * * 0', async () => {
        console.log(' Fetching VATSIM events...');
        const { fetchEvents, storeEvents, cleanupOldEvents } = require('./scripts/fetch_vatsim_events');
        const { createMLPool } = require('./local_library/ml/schema');

        const mlPool = createMLPool();
        try {
          const events = await fetchEvents();
          const { insertedCount, updatedCount } = await storeEvents(events, mlPool);
          await cleanupOldEvents(mlPool);
          console.log(`[SUCCESS] Event sync complete: ${insertedCount} new, ${updatedCount} updated`);
        } catch (err) {
          console.error('[ERROR] Event fetch failed:', err.message);
        } finally {
          await mlPool.end();
        }
      });

      console.log('[SUCCESS] ML system initialized and scheduled');

      // Send startup notification (optional - don't fail if this errors)
      try {
        const { sendCustomNotification } = require('./local_library/ml/debug_reporter');
        await sendCustomNotification(
          client,
          'ML System Started',
          `The ML prediction system has been initialized and is now collecting data.\n\nScheduled jobs:\n• Daily analysis: Midnight UTC\n• Predictions: 6 AM UTC\n• Evaluation: 7 AM UTC\n• Debug report: 8 AM UTC\n• Event sync: Weekly (Sunday midnight UTC)\n• Hourly notifications: Every hour\n• Validation checks: Every 15 minutes`,
          '#29b473'
        );
      } catch (notifyErr) {
        console.warn('[WARNING] Could not send ML startup notification:', notifyErr.message);
      }

    } catch (err) {
      console.error('[ERROR] ML system initialization failed:', err);
      console.error('[INFO] Bot will continue running without ML features');
      // Bot continues to work - ML is optional
    }
  } else {
    console.log('[INFO] ML system is disabled (ML_ENABLED=false)');
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  // Handle slash commands
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({
      content: 'Unknown command.',
      flags: MessageFlags.Ephemeral,
    });
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('Command execution error:', err);
    const reply = {
      content: 'There was an error executing this command.',
      flags: MessageFlags.Ephemeral,
    };
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
});

function shutdown() {
  console.log('Shutting down…');
  if (trackerHandle) trackerHandle.stop();
  client.destroy();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('beforeExit', () => {
  if (hbHandle) hbHandle.stop();
  if (trackerHandle) trackerHandle.stop();
});

client.login(DISCORD_TOKEN);