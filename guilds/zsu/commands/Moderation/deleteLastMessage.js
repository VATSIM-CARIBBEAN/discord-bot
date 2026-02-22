const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete the last message sent by the bot.'),

  async execute(interaction) {
    const messages = await interaction.channel.messages.fetch({ limit: 10 });
    const botMessage = messages.find(msg => msg.author.id === interaction.client.user.id);

    if (botMessage) {
      await botMessage.delete();
      return interaction.reply({
        content: 'The last message sent by the bot has been deleted.',
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: 'No messages found from the bot to delete.',
        ephemeral: true,
      });
    }
  },
};
