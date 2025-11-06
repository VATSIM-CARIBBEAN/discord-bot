// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Function to recursively load command files
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
          commands.push(command.data.toJSON());
          console.log(`[SUCCESS] Loaded command: ${command.data.name}`);
        }
      } catch (err) {
        console.warn(`[WARNING]  Skipped ${filePath}:`, err.message);
      }
    }
  }
}

loadCommands(commandsPath);

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`\n🔄 Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log(`[SUCCESS] Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('[ERROR] Error deploying commands:', error);
  }
})();