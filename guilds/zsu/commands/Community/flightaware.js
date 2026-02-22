const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flightaware')
    .setDescription('Check a route or flight')
    .addStringOption(options =>
      options.setName('departure-icao').setDescription('Departure Airport').setRequired(true))
    .addStringOption(options =>
      options.setName('arrival-icao').setDescription('Arrival Airport').setRequired(true)),

  async execute(interaction) {
    const dep = interaction.options.getString('departure-icao');
    const arr = interaction.options.getString('arrival-icao');
    const button = new ButtonBuilder()
      .setLabel('Check Flights/Routes')
      .setURL(`https://www.flightaware.com/live/findflight?origin=${dep}&destination=${arr}`)
      .setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: 'Click below to go to the **Flight Aware Previous Flights Page** page.',
      components: [row],
      ephemeral: true,
    });
  },
};
