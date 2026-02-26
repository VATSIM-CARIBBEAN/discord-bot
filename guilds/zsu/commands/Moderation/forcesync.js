const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { performRosterUpdate } = require('../../functions/scheduleRosterUpdate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forcesync')
    .setDescription('Force a roster sync for all server members.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      await interaction.editReply('Starting roster sync for all members. This may take a while due to API rate limits...');

      await performRosterUpdate(interaction.guild);

      await interaction.followUp({ content: 'Roster sync complete. Check console logs for the summary.', ephemeral: true });
    } catch (error) {
      console.error('[zsu] Error in force sync:', error);
      await interaction.followUp({ content: `Roster sync failed: ${error.message}`, ephemeral: true });
    }
  },
};
