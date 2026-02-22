const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const requestingPositionChoices = (process.env.ZSU_REQUESTING_POSITION_OPTIONS || '')
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0)
  .map(o => ({ name: o, value: o }));

const currentPositionChoices = (process.env.ZSU_CURRENT_POSITION_OPTIONS || '')
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0)
  .map(o => ({ name: o, value: o }));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top-down-support')
    .setDescription('Request top-down support.')
    .addStringOption(option => {
      option
        .setName('requesting_position')
        .setDescription('Select the position you are requesting support for')
        .setRequired(true);
      if (requestingPositionChoices.length > 0) option.addChoices(...requestingPositionChoices);
      return option;
    })
    .addStringOption(option => {
      option
        .setName('current_position')
        .setDescription('Select your current position')
        .setRequired(true);
      if (currentPositionChoices.length > 0) option.addChoices(...currentPositionChoices);
      return option;
    }),

  async execute(interaction) {
    const requestingPosition = interaction.options.getString('requesting_position');
    const currentPosition = interaction.options.getString('current_position');
    const user = interaction.user;
    const requestTime = new Date().toLocaleString();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Top-Down Support Request')
      .setDescription(`${user} is looking for top-down support!`)
      .addFields(
        { name: 'Their Current Position:', value: currentPosition, inline: false },
        { name: 'Requesting Support Position:', value: requestingPosition, inline: false },
        { name: 'Request Time:', value: requestTime, inline: false },
      )
      .setThumbnail(user.displayAvatarURL());

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
