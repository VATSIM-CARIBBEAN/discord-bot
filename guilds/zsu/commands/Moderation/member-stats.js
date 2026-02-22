const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member-stats')
    .setDescription('Fetch stats for a specified Discord user.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Select the Discord user to fetch stats for.')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('user');

    try {
      const vatsimResponse = await fetch(`https://api.vatsim.net/v2/members/discord/${user.id}`);
      const vatsimData = await vatsimResponse.json();

      if (!vatsimData.user_id) {
        await interaction.followUp({ content: 'User not found in VATSIM.', ephemeral: false });
        return;
      }

      const cid = vatsimData.user_id;

      const vatcarResponse = await fetch(
        `https://vatcar.net/api/v2/user/${cid}?api_key=${process.env.ZSU_API_KEY}`,
      );
      const vatcarData = await vatcarResponse.json();

      if (!vatcarData.success) {
        await interaction.followUp({
          content: 'Failed to fetch user data from VATCAR.',
          ephemeral: false,
        });
        return;
      }

      const { first_name, last_name, fir, visiting_facilities } = vatcarData.data;
      const fullName = `${first_name} ${last_name}`;
      const currentFIR = fir.name_long;
      const visitingFacs =
        visiting_facilities.length > 0
          ? visiting_facilities.map(f => f.fir.name_long).join(', ')
          : 'None';

      const statsEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${fullName}'s Stats`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: 'CID', value: vatcarData.data.cid.toString(), inline: true },
          { name: 'Discord ID', value: user.id, inline: true },
          { name: 'Discord Username', value: user.username, inline: true },
          { name: 'Full Name', value: fullName, inline: true },
          { name: 'Current FIR', value: currentFIR, inline: true },
          { name: 'Visiting Facilities', value: visitingFacs, inline: true },
        )
        .setTimestamp();

      await interaction.followUp({ embeds: [statsEmbed], ephemeral: false });
      setTimeout(() => interaction.deleteReply().catch(() => {}), 15000);
    } catch (error) {
      console.error(`[zsu] Error processing member-stats for user ${user.id}:`, error);
      await interaction.followUp({
        content: 'An error occurred while processing your request.',
        ephemeral: false,
      });
    }
  },
};
