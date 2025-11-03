// commands/ml-stats.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { createMLPool } = require('../local_library/ml/schema');
const { hasEnoughTrainingData, getPredictionStats } = require('../local_library/ml/prediction_engine');
const { format, subDays } = require('date-fns');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ml-stats')
    .setDescription('View ML prediction system statistics')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // Check if ML system is enabled
    if (process.env.ML_ENABLED !== 'true') {
      return interaction.editReply({
        content: 'ML system is not enabled.',
      });
    }

    // Check if user is authorized (must be the debug user)
    if (process.env.ML_DEBUG_USER_ID && interaction.user.id !== process.env.ML_DEBUG_USER_ID) {
      return interaction.editReply({
        content: 'You do not have permission to use this command.',
      });
    }

    try {
      const mlPool = createMLPool();

      // Get overall statistics
      const [overallStats] = await mlPool.query(
        `SELECT
          COUNT(*) as total_sessions,
          COUNT(DISTINCT controller_cid) as unique_controllers,
          COUNT(DISTINCT facility) as unique_facilities,
          MIN(logon_time) as first_session,
          MAX(logon_time) as last_session,
          SUM(duration_minutes) as total_minutes
         FROM controller_sessions`
      );

      const stats = overallStats[0];

      // Calculate training days
      const trainingDays = stats.first_session
        ? Math.floor((Date.now() - new Date(stats.first_session).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Check if we can predict
      const canPredict = await hasEnoughTrainingData();
      const trainingProgress = Math.min((trainingDays / 30) * 100, 100);

      // Get last 7 days activity
      const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const [recentActivity] = await mlPool.query(
        `SELECT
          DATE(logon_time) as date,
          COUNT(*) as sessions,
          COUNT(DISTINCT controller_cid) as controllers,
          COUNT(DISTINCT facility) as facilities
         FROM controller_sessions
         WHERE logon_time >= ?
         GROUP BY DATE(logon_time)
         ORDER BY date DESC`,
        [sevenDaysAgo]
      );

      // Get top facilities all-time
      const [topFacilities] = await mlPool.query(
        `SELECT
          facility,
          COUNT(*) as session_count,
          SUM(duration_minutes) as total_minutes,
          COUNT(DISTINCT controller_cid) as unique_controllers
         FROM controller_sessions
         GROUP BY facility
         ORDER BY session_count DESC
         LIMIT 5`
      );

      // Get top controllers all-time
      const [topControllers] = await mlPool.query(
        `SELECT
          controller_name,
          COUNT(*) as session_count,
          SUM(duration_minutes) as total_minutes,
          COUNT(DISTINCT facility) as facilities_controlled
         FROM controller_sessions
         WHERE controller_name IS NOT NULL
         GROUP BY controller_cid, controller_name
         ORDER BY session_count DESC
         LIMIT 5`
      );

      // Get prediction stats if available
      let predictionData = null;
      if (canPredict) {
        predictionData = await getPredictionStats();
      }

      // Build embed
      const embed = new EmbedBuilder()
        .setTitle('ML Prediction System Statistics')
        .setColor(canPredict ? '#29b473' : '#FFA500')
        .setTimestamp();

      // Training Status
      let statusText = `**Status:** ${canPredict ? '[SUCCESS] Active & Predicting' : ' Collecting Training Data'}\n`;
      statusText += `**Training Progress:** ${Math.round(trainingProgress)}% (Day ${trainingDays}/30)\n`;
      statusText += `**First Session:** ${stats.first_session ? format(new Date(stats.first_session), 'yyyy-MM-dd') : 'N/A'}\n`;
      statusText += `**Last Session:** ${stats.last_session ? format(new Date(stats.last_session), 'yyyy-MM-dd') : 'N/A'}`;
      embed.addFields({ name: '[ML] Training Status', value: statusText, inline: false });

      // Overall Statistics
      let overallText = `**Total Sessions:** ${stats.total_sessions}\n`;
      overallText += `**Unique Controllers:** ${stats.unique_controllers}\n`;
      overallText += `**Unique Facilities:** ${stats.unique_facilities}\n`;
      overallText += `**Total Hours:** ${Math.round(stats.total_minutes / 60)}h`;
      embed.addFields({ name: '[ML] All-Time Statistics', value: overallText, inline: false });

      // Recent Activity (last 7 days)
      if (recentActivity.length > 0) {
        let recentText = recentActivity.slice(0, 5).map(r =>
          `• ${r.date}: ${r.sessions} sessions, ${r.controllers} controllers`
        ).join('\n');
        embed.addFields({ name: ' Recent Activity (Last 7 Days)', value: recentText || 'No recent activity', inline: false });
      }

      // Top Facilities
      if (topFacilities.length > 0) {
        let facilityText = topFacilities.map(f =>
          `• ${f.facility}: ${f.session_count} sessions (${Math.round(f.total_minutes / 60)}h)`
        ).join('\n');
        embed.addFields({ name: ' Top Facilities', value: facilityText, inline: true });
      }

      // Top Controllers
      if (topControllers.length > 0) {
        let controllerText = topControllers.map(c =>
          `• ${c.controller_name}: ${c.session_count} sessions`
        ).join('\n');
        embed.addFields({ name: ' Top Controllers', value: controllerText, inline: true });
      }

      // Prediction Performance (if available)
      if (canPredict && predictionData && predictionData.overall) {
        const overall = predictionData.overall;
        const accuracy = overall.evaluated_count > 0
          ? Math.round((overall.correct_predictions / overall.evaluated_count) * 100)
          : 0;

        let predText = `**Total Predictions:** ${overall.total_predictions}\n`;
        predText += `**Evaluated:** ${overall.evaluated_count}\n`;
        predText += `**Correct:** ${overall.correct_predictions}\n`;
        predText += `**Accuracy:** ${accuracy}%\n`;
        predText += `**Avg Confidence:** ${Math.round(overall.avg_confidence)}%`;
        embed.addFields({ name: '[ML] Prediction Performance', value: predText, inline: false });
      }

      // Footer
      if (!canPredict) {
        embed.setFooter({ text: `${30 - trainingDays} days remaining until predictions start` });
      } else {
        embed.setFooter({ text: 'System is actively learning and predicting' });
      }

      await mlPool.end();
      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('Error getting ML stats:', err);
      await interaction.editReply({
        content: `Error retrieving ML statistics: ${err.message}`,
      });
    }
  },
};
