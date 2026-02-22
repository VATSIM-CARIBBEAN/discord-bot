const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('DM a user')
    .addUserOption(options =>
      options.setName('user').setDescription('The user to dm').setRequired(true))
    .addStringOption(options =>
      options.setName('content').setDescription('The message to send to the user').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const message = interaction.options.getString('content');

    await interaction.reply({ content: 'Message has been sent!', ephemeral: true });
    await target.send(
      `The following message was sent by the **San Juan CERAP's Administration Department** --- ${message}`,
    );
    console.log(`[zsu] DM sent to ${target.username} by ${interaction.user.username}: ${message}`);
  },
};
