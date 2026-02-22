const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/autoresponders.json');

/**
 * Load autoresponders from disk.
 * Returns an array of { channelId, sentence, response }.
 */
function loadAutoresponders() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('[zsu] Could not load autoresponders:', err.message);
  }
  return [];
}

/**
 * Save autoresponders to disk.
 */
function saveAutoresponders(list) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('[zsu] Could not save autoresponders:', err.message);
  }
}

/**
 * Register a messageCreate listener for all persisted autoresponders.
 * Called once from onReady in the ZSU guild module.
 */
function registerAutoresponderListener(client, guildId) {
  client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.guildId !== guildId) return;

    const entries = loadAutoresponders();
    const content = message.content.toLowerCase();

    for (const entry of entries) {
      if (entry.channelId !== message.channelId) continue;
      if (content.includes(entry.sentence.toLowerCase())) {
        message.channel.send(entry.response).catch(() => {});
      }
    }
  });
}

module.exports = {
  registerAutoresponderListener,

  data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Manage autoresponders for this channel')
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Add an autoresponder to this channel')
        .addStringOption(option =>
          option.setName('sentence').setDescription('The trigger phrase the bot listens for').setRequired(true))
        .addStringOption(option =>
          option.setName('response').setDescription('The reply the bot sends').setRequired(true)))
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('List all autoresponders in this channel'))
    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('Remove an autoresponder by its number from the list')
        .addIntegerOption(option =>
          option.setName('number').setDescription('The autoresponder number (from /autoresponder list)').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const sentence = interaction.options.getString('sentence');
      const response = interaction.options.getString('response');

      const entries = loadAutoresponders();
      entries.push({
        channelId: interaction.channelId,
        sentence,
        response,
      });
      saveAutoresponders(entries);

      const embed = new EmbedBuilder()
        .setTitle('Autoresponder added!')
        .addFields(
          { name: 'Trigger:', value: sentence },
          { name: 'Response:', value: response },
        )
        .setColor('#ffffff')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'list') {
      const entries = loadAutoresponders().filter(e => e.channelId === interaction.channelId);

      if (entries.length === 0) {
        return interaction.reply({ content: 'No autoresponders set for this channel.', ephemeral: true });
      }

      const description = entries
        .map((e, i) => `**${i + 1}.** Trigger: \`${e.sentence}\` → Response: \`${e.response}\``)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Autoresponders in this channel')
        .setDescription(description)
        .setColor('#ffffff')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'remove') {
      const number = interaction.options.getInteger('number');
      const allEntries = loadAutoresponders();
      const channelEntries = allEntries.filter(e => e.channelId === interaction.channelId);

      if (number < 1 || number > channelEntries.length) {
        return interaction.reply({
          content: `Invalid number. Use \`/autoresponder list\` to see available autoresponders (1-${channelEntries.length}).`,
          ephemeral: true,
        });
      }

      const toRemove = channelEntries[number - 1];
      const idx = allEntries.findIndex(
        e => e.channelId === toRemove.channelId && e.sentence === toRemove.sentence && e.response === toRemove.response,
      );
      allEntries.splice(idx, 1);
      saveAutoresponders(allEntries);

      await interaction.reply({
        content: `Removed autoresponder #${number} (trigger: \`${toRemove.sentence}\`).`,
        ephemeral: true,
      });
    }
  },
};
