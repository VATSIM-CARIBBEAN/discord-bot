const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Choose what the bot responds to what message')
    .addStringOption(option =>
      option.setName('sentence').setDescription('The sentence that the bot listens to.').setRequired(true))
    .addStringOption(option =>
      option.setName('response').setDescription('The reply.').setRequired(true)),

  async execute(interaction) {
    const word = interaction.options.getString('sentence');
    const response = interaction.options.getString('response');

    const filter = message => {
      const content = message.content.toLowerCase();
      return content.includes(word);
    };
    const collector = interaction.channel.createMessageCollector({ filter, dispose: true });
    collector.on('collect', async message => {
      await message.channel.send(`${response}`);
    });

    const embed = new EmbedBuilder()
      .setTitle('Autoresponder set!')
      .addFields(
        { name: 'Sentence:', value: word },
        { name: 'Response:', value: response },
      )
      .setColor('#ffffff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
