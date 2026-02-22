// guilds/vatcar/index.js
const { GatewayIntentBits, Partials, Collection } = require('discord.js');
const { startTracker } = require('./services/vatsim-tracker');
const fs = require('fs');
const path = require('path');

let trackerHandle = null;

// Load commands from guilds/vatcar/commands/
const commands = new Collection();
function loadCommands(dir) {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js') && !file.startsWith('_')) {
      try {
        const command = require(filePath);
        if (command.data && command.execute) {
          commands.set(command.data.name, command);
        }
      } catch (err) {
        console.warn(`[vatcar] Could not load command ${filePath}:`, err.message);
      }
    }
  }
}
loadCommands(path.join(__dirname, 'commands'));

module.exports = {
  id: 'vatcar',
  name: 'VATCAR Main',
  guildId: process.env.VATCAR_GUILD_ID,

  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel, Partials.Message],

  getCommands() {
    return [...commands.values()].map(c => c.data);
  },

  async onReady(client) {
    trackerHandle = startTracker(client);
  },

  async onInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction);
  },

  onShutdown() {
    if (trackerHandle) trackerHandle.stop();
  },
};
