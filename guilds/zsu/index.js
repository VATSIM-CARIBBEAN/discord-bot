// guilds/zsu/index.js
const { GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load commands from guilds/zsu/commands/
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
        console.warn(`[zsu] Could not load command ${filePath}:`, err.message);
      }
    }
  }
}
loadCommands(path.join(__dirname, 'commands'));

// Hardcoded ZSU-specific channel/role IDs for event handling
const ZSU_MENTOR_ROLE_ID = '1260981475369554004';
const ZSU_FORUM_CHANNELS = ['1289283910240309321', '1296599166906138654'];
const ZSU_VCFI_ROLE_ID = '1260981475369554004';
const ZSU_PROMOTIONS_CHANNEL_ID = '1264403466457972839';

let rosterInterval = null;

module.exports = {
  id: 'zsu',
  name: 'San Juan (ZSU)',
  guildId: process.env.ZSU_GUILD_ID,

  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],

  getCommands() {
    return [...commands.values()].map(c => c.data);
  },

  async onReady(client) {
    // Start roster update scheduler
    const { scheduleRosterUpdate } = require('./functions/scheduleRosterUpdate');
    rosterInterval = scheduleRosterUpdate(client);

    // Register ZSU-specific event listeners
    this._registerEvents(client);
  },

  async onInteraction(interaction) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
      return;
    }

    // Handle button interactions
    if (interaction.isButton()) {
      await this._handleButton(interaction);
    }
  },

  onShutdown() {
    if (rosterInterval) clearInterval(rosterInterval);
  },

  // --- ZSU-specific event handling ---

  _registerEvents(client) {
    // Forum channel auto-reply
    client.on('threadCreate', async (thread) => {
      if (thread.guildId !== process.env.ZSU_GUILD_ID) return;
      if (!ZSU_FORUM_CHANNELS.includes(thread.parentId)) return;

      setTimeout(async () => {
        try {
          const starterMessage = await thread.fetchStarterMessage();
          if (starterMessage) {
            await starterMessage.reply('Thanks for your request, we will accommodate as soon as possible.');
          }
        } catch (error) {
          console.error('[zsu] Error replying to thread:', error);
        }
      }, 10000);
    });

    // vCFI promotion announcements
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
      if (newMember.guild.id !== process.env.ZSU_GUILD_ID) return;
      if (!oldMember.roles.cache.has(ZSU_VCFI_ROLE_ID) && newMember.roles.cache.has(ZSU_VCFI_ROLE_ID)) {
        try {
          const channel = await newMember.guild.channels.fetch(ZSU_PROMOTIONS_CHANNEL_ID);
          await channel.send(`Let's congratulate ${newMember.user} with their recent promotion to vCFI`);
        } catch (error) {
          console.error('[zsu] Error sending promotion announcement:', error);
        }
      }
    });
  },

  async _handleButton(interaction) {
    const args = interaction.customId.split('_');
    const command = args.shift();

    if (command === 'acceptTraining') {
      if (!interaction.member._roles.includes(ZSU_MENTOR_ROLE_ID)) {
        return interaction.reply({ content: 'This command is for mentors only!', ephemeral: true });
      }

      const user = await interaction.client.users.fetch(args[0]);
      try {
        await user.send(
          'Hello! I am vZSU Bot from San Juan CERAP! A mentor has accepted your training session and is ready to go when you are. Please await a DM from the mentor to coordinate your session details.',
        );
        await interaction.reply({
          content: `Hello ${interaction.user} the Training Session has been accepted successfully! ${user} has been notified via a Direct Message and should contact you soon.`,
          ephemeral: true,
        });
        await interaction.message.delete();
      } catch (error) {
        console.error('[zsu] Error handling acceptTraining button:', error);
      }
    }

    if (command === 'acceptAvailability') {
      if (interaction.member._roles.includes(ZSU_MENTOR_ROLE_ID)) {
        return interaction.reply({
          content: 'Mentors cannot request training sessions from other mentors!',
          ephemeral: true,
        });
      }

      const user = await interaction.client.users.fetch(args[0]);
      try {
        const studentMember = interaction.guild.members.cache.get(interaction.user.id);
        const studentName = studentMember
          ? studentMember.nickname || studentMember.displayName
          : interaction.user.username;

        await user.send(
          `Hey, I am vZSU Bot from San Juan CERAP! **${studentName}** has accepted your training availability. Please DM them to coordinate the session details. **Remember to check if the student has any past training reports. Good luck**!!\n\nStudent: <@${interaction.user.id}>`,
        );
        await interaction.reply({
          content: `Hello ${interaction.user} your training session request has been sent successfully! ${user} has been notified via a Direct Message and should DM you soon to coordinate.`,
          ephemeral: true,
        });
        await interaction.message.delete();
      } catch (error) {
        console.error('[zsu] Error handling acceptAvailability button:', error);
      }
    }
  },
};
