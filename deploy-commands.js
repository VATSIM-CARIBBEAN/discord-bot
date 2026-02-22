// deploy-commands.js — Multi-guild command deployment
require('dotenv').config();
require('dotenv').config({ path: 'guilds/vatcar/.env', override: false });
require('dotenv').config({ path: 'guilds/zsu/.env', override: false });

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
const guildsDir = path.join(__dirname, 'guilds');

(async () => {
  for (const folder of fs.readdirSync(guildsDir)) {
    const modPath = path.join(guildsDir, folder, 'index.js');
    if (!fs.existsSync(modPath)) continue;

    let mod;
    try {
      mod = require(modPath);
    } catch (err) {
      console.error(`[ERROR] Failed to load guild module "${folder}":`, err.message);
      continue;
    }

    if (!mod.guildId || !mod.getCommands) {
      console.warn(`[SKIP] Guild module "${folder}" missing guildId or getCommands`);
      continue;
    }

    const commands = mod.getCommands().map(c => c.toJSON());
    console.log(`\n[${mod.id}] Deploying ${commands.length} command(s) to guild ${mod.guildId}...`);

    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, mod.guildId),
        { body: commands },
      );
      console.log(`[${mod.id}] Successfully deployed ${data.length} command(s).`);
    } catch (err) {
      console.error(`[${mod.id}] Failed to deploy commands:`, err);
    }
  }
})();
