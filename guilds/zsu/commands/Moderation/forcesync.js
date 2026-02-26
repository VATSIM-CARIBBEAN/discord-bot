const { SlashCommandBuilder } = require('discord.js');
const { performRosterUpdate } = require('../../functions/scheduleRosterUpdate');

const ALLOWED_ROLE_ID = '985574770785525802';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forcesync')
    .setDescription('Force a roster sync for all server members.'),

  async execute(interaction) {
    const hasRole = interaction.member.roles.cache.has(ALLOWED_ROLE_ID);
    const isAdmin = interaction.member.permissions.has('Administrator');

    if (!hasRole && !isAdmin) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

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
