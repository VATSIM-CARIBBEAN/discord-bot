const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sync')
    .setDescription('Sync your Discord account with VATSIM and assign roles.'),

  async execute(interaction) {
    await interaction.deferReply();

    const discordUserId = interaction.user.id;
    const apiKey = process.env.ZSU_API_KEY;
    const facility = process.env.ZSU_FACILITY_NAME;
    const ATM = process.env.ZSU_FACILITY_ATM_DISCORD_ID;

    try {
      // Fetch user_id from VATSIM API
      const vatsimResponse = await fetch(`https://api.vatsim.net/v2/members/discord/${discordUserId}`);
      const vatsimData = await vatsimResponse.json();

      if (!vatsimData.user_id) {
        const reply = await interaction.editReply({
          content: 'Please sync your Discord with the [VATSIM Community Hub](https://community.vatsim.net/settings) Discord Settings. Once you are synced, please try again.',
          ephemeral: true,
        });
        setTimeout(() => reply.delete().catch(() => {}), 30000);

        // Notify Web Master
        const webMasterId = process.env.ZSU_FACILITY_WM_DISCORD_ID;
        const webMasterUser = await interaction.client.users.fetch(webMasterId);
        const vatsimErrorEmbed = new EmbedBuilder()
          .setColor('#ffcc00')
          .setTitle('VATSIM User Not Found')
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields(
            { name: 'Discord ID', value: discordUserId, inline: true },
            { name: 'Username', value: interaction.user.username, inline: true },
            { name: 'Channel', value: interaction.channel.name, inline: true },
            { name: 'Message', value: 'The user was not found in the VATSIM database. Please ensure they have linked their Discord account properly.', inline: true },
          )
          .setTimestamp();
        await webMasterUser.send({ embeds: [vatsimErrorEmbed] });
        return;
      }

      const cid = vatsimData.user_id;

      // Fetch user data from VATCAR API
      const vatcarResponse = await fetch(`https://vatcar.net/api/v2/user/${cid}?api_key=${apiKey}`);
      const vatcarData = await vatcarResponse.json();

      if (!vatcarData.success) {
        const reply = await interaction.editReply({
          content: 'Please log in with your Discord on the [VATCAR website](https://vatcar.net/auth/login) and go to My VATCAR > Integrations then try again. If the issue persists, contact Senior Staff.',
          ephemeral: true,
        });
        setTimeout(() => reply.delete().catch(() => {}), 30000);

        const webMasterId = process.env.ZSU_FACILITY_WM_DISCORD_ID;
        const webMasterUser = await interaction.client.users.fetch(webMasterId);
        const vatcarErrorEmbed = new EmbedBuilder()
          .setColor('#ffcc00')
          .setTitle('VATCAR Data Fetch Failed')
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields(
            { name: 'Discord ID', value: discordUserId, inline: true },
            { name: 'Username', value: interaction.user.username, inline: true },
            { name: 'Channel', value: interaction.channel.name, inline: true },
            { name: 'Message', value: 'The user data could not be retrieved from VATCAR. Please check their account status.', inline: true },
          )
          .setTimestamp();
        await webMasterUser.send({ embeds: [vatcarErrorEmbed] });
        return;
      }

      const { first_name, last_name, fir, visiting_facilities } = vatcarData.data;
      const nickname = `${first_name} ${last_name} - ${cid}`;

      // Role assignment logic
      const rolesToAssign = [];
      const isHomeController = fir && fir.name_short === facility;
      const isVisitingController = visiting_facilities.some(f => f.fir.name_short === facility);

      const neighboringFacilities = (process.env.ZSU_NEIGHBORING_FACILITIES || '').split(',').map(f => f.trim());
      const isNeighboringController =
        (vatcarData.data.fir && neighboringFacilities.includes(vatcarData.data.fir.name_short)) ||
        vatcarData.data.visiting_facilities.some(f => neighboringFacilities.includes(f.fir.name_short));

      // Always add VATSIM User role
      rolesToAssign.push(process.env.ZSU_VERIFIED_VATSIM_USER_ROLE_ID);

      if (isHomeController) {
        rolesToAssign.push(process.env.ZSU_FACILITY_CONTROLLER_ROLE_ID);
      } else if (isVisitingController) {
        rolesToAssign.push(process.env.ZSU_VISITING_CONTROLLER_ROLE_ID);
      } else if (isNeighboringController) {
        rolesToAssign.push(process.env.ZSU_NEIGHBORING_FACILITY_CONTROLLER_ROLE_ID);
      }

      // Assign VATSIM User role first
      await interaction.member.roles.add(rolesToAssign[0]);

      const hasHomeOrVisitingControllerRole = interaction.member.roles.cache.some(
        role =>
          role.id === process.env.ZSU_FACILITY_CONTROLLER_ROLE_ID ||
          role.id === process.env.ZSU_VISITING_CONTROLLER_ROLE_ID,
      );

      if (!hasHomeOrVisitingControllerRole) {
        try {
          await interaction.member.setNickname(nickname);
        } catch (error) {
          console.error(`[zsu] Failed to update nickname for user ${discordUserId}:`, error);
        }
      }

      if (rolesToAssign.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.member.roles.add(rolesToAssign[1]);
      }

      // Fetch user rating from VATSIM API
      const ratingResponse = await fetch(`https://api.vatsim.net/v2/members/${cid}`);
      const ratingData = await ratingResponse.json();

      const ratingRoles = {
        1: process.env.ZSU_OBS_ROLE_ID,
        2: process.env.ZSU_S1_ROLE_ID,
        3: process.env.ZSU_S2_ROLE_ID,
        4: process.env.ZSU_S3_ROLE_ID,
        5: process.env.ZSU_C1_ROLE_ID,
        6: process.env.ZSU_C3_ROLE_ID,
        7: process.env.ZSU_I1_ROLE_ID,
        8: process.env.ZSU_I3_ROLE_ID,
        9: process.env.ZSU_SUP_ROLE_ID,
        10: process.env.ZSU_ADM_ROLE_ID,
      };

      const userRating = ratingData.rating;
      if (userRating in ratingRoles) {
        await interaction.member.roles.add(ratingRoles[userRating]);
      }

      const ratingNames = {
        1: 'OBS', 2: 'S1', 3: 'S2', 4: 'S3', 5: 'C1',
        6: 'C2', 7: 'C3', 8: 'I1', 9: 'I2', 10: 'I3',
        11: 'SUP', 12: 'ADM',
      };

      const roleNames = rolesToAssign
        .map(roleId => {
          const role = interaction.guild.roles.cache.get(roleId);
          return role ? role.name : `Unknown Role (${roleId})`;
        })
        .join(', ');

      // Log the successful sync by DMing the ATM
      const targetUser = await interaction.client.users.fetch(ATM);
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('User Sync Successful')
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: 'Discord ID', value: discordUserId, inline: true },
          { name: 'CID', value: cid.toString(), inline: true },
          { name: 'Name', value: `${first_name} ${last_name}`, inline: true },
          { name: 'Rating', value: ratingNames[userRating] || 'Unknown', inline: true },
          { name: 'Roles Added', value: roleNames || 'None', inline: true },
        )
        .setTimestamp();

      await targetUser.send({ embeds: [embed] });

      const reply = await interaction.editReply({
        content: 'Roles assigned and nickname updated successfully.',
        ephemeral: true,
      });
      setTimeout(() => reply.delete().catch(() => {}), 30000);
    } catch (error) {
      console.error(`[zsu] Error processing sync command for user ${discordUserId}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('User Sync Error')
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: 'Discord ID', value: discordUserId, inline: true },
          { name: 'Username', value: interaction.user.username, inline: true },
          { name: 'Channel', value: interaction.channel.name, inline: true },
          { name: 'Error Message', value: error.message || 'Unknown error', inline: true },
        )
        .setTimestamp();

      const webMasterId = process.env.ZSU_FACILITY_WM_DISCORD_ID;
      const webMasterUser = await interaction.client.users.fetch(webMasterId);
      await webMasterUser.send({ embeds: [errorEmbed] });

      const reply = await interaction.editReply({
        content: 'An error occurred while processing your request.',
        ephemeral: true,
      });
      setTimeout(() => reply.delete().catch(() => {}), 30000);
    }
  },
};
