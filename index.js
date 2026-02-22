// index.js
require('dotenv').config();
const { startHeartbeat } = require('./local_library/heartbeat');
const { startTracker } = require('./local_library/vatsim_tracker');

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