// commands/embed.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create and send a custom embed message')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to send the embed to')
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
        .setDescription('Embed color (hex code like #29b473 or color name)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('footer')
        .setDescription('Footer text')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('thumbnail')
        .setDescription('Thumbnail image URL')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('image')
        .setDescription('Main image URL')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('author')
        .setDescription('Author name')
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
        .setName('timestamp')
        .setDescription('Add current timestamp')
        .setRequired(false)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color');
    const footer = interaction.options.getString('footer');
    const thumbnail = interaction.options.getString('thumbnail');
    const image = interaction.options.getString('image');
    const author = interaction.options.getString('author');
    const url = interaction.options.getString('url');
    const timestamp = interaction.options.getBoolean('timestamp');

    // Validate at least one content field is provided
    if (!title && !description && !author) {
      return interaction.reply({
        content: 'You must provide at least a title, description, or author.',
        ephemeral: true,
      });
    }

    // Validate channel is text-based
    if (!channel.isTextBased()) {
      return interaction.reply({
        content: 'Selected channel must be a text channel.',
        ephemeral: true,
      });
    }

    // Build the embed
    const embed = new EmbedBuilder();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (color) {
      try {
        embed.setColor(color);
      } catch {
        return interaction.reply({
          content: 'Invalid color format. Use hex codes like #29b473 or color names.',
          ephemeral: true,
        });
      }
    } else {
      embed.setColor('#29b473'); // Default color
    }
    if (footer) embed.setFooter({ text: footer });
    if (thumbnail) {
      try {
        embed.setThumbnail(thumbnail);
      } catch {
        return interaction.reply({
          content: 'Invalid thumbnail URL.',
          ephemeral: true,
        });
      }
    }
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
    if (author) embed.setAuthor({ name: author });
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
    if (timestamp) embed.setTimestamp();

    // Send the embed
    try {
      await channel.send({ embeds: [embed] });
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