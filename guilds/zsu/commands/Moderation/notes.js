const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-notes')
    .setDescription('Check the training notes for a user.')
    .addUserOption(option =>
      option
        .setName('student')
        .setDescription('Select the student to check notes for')
        .setRequired(true)),

  async execute(interaction) {
    const student = interaction.options.getUser('student');
    const discordId = student.id;
    const apiKey = process.env.ZSU_API_KEY;

    const userApiUrl = `https://api.vatsim.net/v2/members/discord/${discordId}`;

    try {
      const userResponse = await fetch(userApiUrl);
      const userData = await userResponse.json();

      if (userData.user_id) {
        const userCid = userData.user_id;
        const apiUrl = `https://vatcar.net/api/v2/user/${userCid}/notes?api_key=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
          const lastNote = data.notes[data.notes.length - 1];

          const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Training Notes')
            .addFields(
              { name: 'Instructor Name', value: lastNote.instructor_name, inline: true },
              { name: 'Instructor CID', value: lastNote.instructor_cid.toString(), inline: true },
              { name: 'Student CID', value: lastNote.user_cid.toString(), inline: true },
              { name: 'Date of Session', value: lastNote.friendly_time, inline: true },
              { name: 'Training Note', value: lastNote.training_note, inline: false },
              { name: 'Created At', value: new Date(lastNote.created_at).toLocaleString(), inline: true },
            );

          if (lastNote.updated_at && lastNote.updated_at !== lastNote.created_at) {
            embed.addFields({
              name: 'Updated At',
              value: new Date(lastNote.updated_at).toLocaleString(),
              inline: true,
            });
          }

          embed.addFields({ name: 'Position Trained', value: lastNote.position_trained, inline: true });

          await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.reply({
            content: 'Failed to retrieve notes. Please check the User CID and try again.',
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({
          content:
            'Failed to retrieve user information. The user Discord account may not be linked with VATSIM yet. Please check notes manually on VATCAR website.',
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error('[zsu] Error fetching notes:', error);
      await interaction.reply({
        content: 'An error occurred while fetching the notes. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
