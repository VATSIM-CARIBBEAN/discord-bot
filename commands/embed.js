// commands/embed.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create and send a custom embed message')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to send the embed to')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Embed title')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Embed description (main content)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('Embed color')
        .setRequired(false)
        .addChoices(
          { name: 'Blue', value: '#003466' },
          { name: 'Green', value: '#29b473' },
          { name: 'Gray', value: '#808080' }
        )
    )
    .addStringOption(option =>
      option
        .setName('image')
        .setDescription('Main image URL')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('url')
        .setDescription('Title URL (makes title clickable)')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('mention_everyone')
        .setDescription('Tag @everyone in the message')
        .setRequired(false)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color') || '#29b473';
    const image = interaction.options.getString('image');
    const url = interaction.options.getString('url');
    const mentionEveryone = interaction.options.getBoolean('mention_everyone') || false;

    // Validate at least one content field is provided
    if (!title && !description) {
      return interaction.reply({
        content: 'You must provide at least a title or description.',
        ephemeral: true,
      });
    }

    // Build the embed
    const embed = new EmbedBuilder();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    embed.setColor(color);
    
    // Fixed footer with timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    embed.setFooter({ text: `VATSIM Caribbean Division - ${timestamp}` });
    
    if (image) {
      try {
        embed.setImage(image);
      } catch {
        return interaction.reply({
          content: 'Invalid image URL.',
          ephemeral: true,
        });
      }
    }
    
    if (url) {
      try {
        embed.setURL(url);
      } catch {
        return interaction.reply({
          content: 'Invalid URL format.',
          ephemeral: true,
        });
      }
    }

    // Send the embed
    try {
      const messagePayload = { embeds: [embed] };
      if (mentionEveryone) {
        messagePayload.content = '@everyone';
      }
      
      await channel.send(messagePayload);
      await interaction.reply({
        content: `✅ Embed sent successfully to ${channel}`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Error sending embed:', err);
      await interaction.reply({
        content: 'Failed to send embed. Check bot permissions in that channel.',
        ephemeral: true,
      });
    }
  },
};