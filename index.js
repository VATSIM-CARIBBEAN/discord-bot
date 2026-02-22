// index.js — Multi-guild orchestrator
require('dotenv').config();
require('dotenv').config({ path: 'guilds/vatcar/.env', override: false });
require('dotenv').config({ path: 'guilds/zsu/.env', override: false });

const {
  Client,
  Events,
  MessageFlags,
} = require('discord.js');
const { startHeartbeat } = require('./shared/heartbeat');
const fs = require('fs');
const path = require('path');

const DISCORD_TOKEN = process.env.BOT_TOKEN;
if (!DISCORD_TOKEN) {
  console.error('Missing BOT_TOKEN in .env');
  process.exit(1);
}

// 1. Discover guild modules
const guildsDir = path.join(__dirname, 'guilds');
const guildModules = [];

for (const folder of fs.readdirSync(guildsDir)) {
  const modPath = path.join(guildsDir, folder, 'index.js');
  if (fs.existsSync(modPath)) {
    try {
      const mod = require(modPath);
      if (mod.guildId) {
        guildModules.push(mod);
      } else {
        console.warn(`[SKIP] Guild module "${folder}" has no guildId configured — check its .env`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to load guild module "${folder}":`, err.message);
    }
  }
}

if (guildModules.length === 0) {
  console.error('No guild modules found. Check guilds/ directory and .env files.');
  process.exit(1);
}

// 2. Merge intents and partials from all guild modules
const allIntents = new Set();
const allPartials = new Set();
for (const mod of guildModules) {
  (mod.intents || []).forEach(i => allIntents.add(i));
  (mod.partials || []).forEach(p => allPartials.add(p));
}

// 3. Create client with merged intents
const client = new Client({
  intents: [...allIntents],
  partials: [...allPartials],
});

// 4. Build guild ID -> module lookup
const guildMap = new Map();
for (const mod of guildModules) {
  guildMap.set(mod.guildId, mod);
}

// 5. On ready: start heartbeat + call each guild's onReady
let hbHandle = null;

client.once(Events.ClientReady, async (bot) => {
  console.log(`[BOT] Logged in as ${bot.user.tag}`);
  console.log(`[BOT] Serving ${guildModules.length} guild(s): ${guildModules.map(m => m.name).join(', ')}`);

  hbHandle = startHeartbeat(
    process.env.BETTERSTACK_HEARTBEAT_URL,
    Number(process.env.BETTERSTACK_HEARTBEAT_INTERVAL_MS || 60000),
  );

  for (const mod of guildModules) {
    try {
      await mod.onReady(client);
      console.log(`[${mod.id}] Ready`);
    } catch (err) {
      console.error(`[${mod.id}] onReady error:`, err);
    }
  }
});

// 6. Route interactions to the correct guild module
client.on(Events.InteractionCreate, async (interaction) => {
  const mod = guildMap.get(interaction.guildId);
  if (!mod) return; // Interaction from unknown guild — ignore

  try {
    await mod.onInteraction(interaction);
  } catch (err) {
    console.error(`[${mod.id}] Interaction error:`, err);
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

// 7. Shutdown
function shutdown() {
  console.log('Shutting down…');
  if (hbHandle) hbHandle.stop();
  for (const mod of guildModules) {
    try {
      mod.onShutdown?.();
    } catch (e) {
      console.error(`[${mod.id}] Shutdown error:`, e);
    }
  }
  client.destroy();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

client.login(DISCORD_TOKEN);
