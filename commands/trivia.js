// commands/trivia.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getRandomQuestion } = require('../local_library/trivia_questions');
const { recordAnswer, getLeaderboard, clearLeaderboard } = require('../local_library/trivia_db');

// Active trivia games per channel
const activeGames = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Start a Caribbean aviation trivia game')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a new trivia question')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('leaderboard')
        .setDescription('Show the trivia leaderboard')
        .addStringOption(option =>
          option
            .setName('period')
            .setDescription('Time period for leaderboard')
            .setRequired(false)
            .addChoices(
              { name: 'All Time', value: 'all' },
              { name: 'This Month', value: 'month' },
              { name: 'This Week', value: 'week' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reset')
        .setDescription('Reset the trivia leaderboard')
        .addStringOption(option =>
          option
            .setName('period')
            .setDescription('Which leaderboard to reset')
            .setRequired(true)
            .addChoices(
              { name: 'Weekly', value: 'week' },
              { name: 'Monthly', value: 'month' },
              { name: 'All Time', value: 'all' }
            )
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'start') {
      return handleTriviaStart(interaction);
    } else if (subcommand === 'leaderboard') {
      return handleLeaderboard(interaction);
    } else if (subcommand === 'reset') {
      return handleReset(interaction);
    }
  },
};

async function handleTriviaStart(interaction) {
  const channelId = interaction.channel.id;

  // Check if there's already an active game in this channel
  if (activeGames.has(channelId)) {
    return interaction.reply({
      content: '✈️ There is already an active trivia game in this channel. Please wait for it to finish.',
      ephemeral: true,
    });
  }

  // Get a random question
  const question = getRandomQuestion();

  // Create the question embed
  const questionEmbed = new EmbedBuilder()
    .setTitle('✈️ Caribbean Aviation Trivia')
    .setDescription(question.question)
    .setColor('#003466')
    .addFields(
      { name: 'Option A', value: question.options.A, inline: true },
      { name: 'Option B', value: question.options.B, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'Option C', value: question.options.C, inline: true },
      { name: 'Option D', value: question.options.D, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    )
    .setFooter({ text: 'Reply A, B, C, or D in chat to answer! • First correct: +10pts • Others: +5pts' })
    .setTimestamp();

  // Create the responses tracker embed
  const responsesEmbed = new EmbedBuilder()
    .setTitle('📊 Responses')
    .setDescription('*No responses yet...*')
    .setColor('#29b473')
    .addFields({ name: '⏱️ Time Remaining', value: '60 seconds', inline: false });

  await interaction.reply({
    content: 'A new trivia question has been posted!',
    embeds: [questionEmbed, responsesEmbed],
  });

  const message = await interaction.fetchReply();

  // Set up game state
  const gameState = {
    question,
    responses: new Map(), // userId -> { answer, timestamp, displayName }
    messageId: message.id,
    channelId: channelId,
    startTime: Date.now(),
    firstCorrect: null,
  };

  activeGames.set(channelId, gameState);

  // Set up message collector
  const filter = (m) => ['A', 'B', 'C', 'D'].includes(m.content.toUpperCase().trim());
  const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

  collector.on('collect', async (m) => {
    const answer = m.content.toUpperCase().trim();
    const userId = m.author.id;
    const displayName = m.member?.displayName || m.author.username;

    // Delete the user's message
    try {
      await m.delete();
    } catch (err) {
      // Ignore if we can't delete
    }

    // Check if user already answered
    if (gameState.responses.has(userId)) {
      return; // Ignore duplicate answers
    }

    // Record the response
    gameState.responses.set(userId, {
      answer,
      timestamp: Date.now(),
      displayName,
    });

    // Check if this is the first correct answer
    if (!gameState.firstCorrect && answer === question.correctAnswer) {
      gameState.firstCorrect = userId;
    }

    // Update the responses embed
    await updateResponsesEmbed(interaction, gameState);
  });

  // Update timer every 10 seconds
  const timerInterval = setInterval(async () => {
    const elapsed = Date.now() - gameState.startTime;
    const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));

    if (remaining > 0) {
      await updateResponsesEmbed(interaction, gameState, remaining);
    }
  }, 10000);

  collector.on('end', async () => {
    clearInterval(timerInterval);
    await endGame(interaction, gameState);
    activeGames.delete(channelId);
  });
}

async function updateResponsesEmbed(interaction, gameState, timeRemaining = null) {
  try {
    const message = await interaction.channel.messages.fetch(gameState.messageId);
    const embeds = message.embeds;

    if (embeds.length < 2) return;

    // Calculate time remaining
    const elapsed = Date.now() - gameState.startTime;
    const remaining = timeRemaining !== null ? timeRemaining : Math.max(0, 60 - Math.floor(elapsed / 1000));

    // Build responses text
    let responsesText = '';
    const responsesByAnswer = { A: [], B: [], C: [], D: [] };

    for (const [userId, data] of gameState.responses) {
      responsesByAnswer[data.answer].push(data.displayName);
    }

    for (const [answer, names] of Object.entries(responsesByAnswer)) {
      if (names.length > 0) {
        responsesText += `**${answer}:** ${names.join(', ')}\n`;
      }
    }

    if (responsesText === '') {
      responsesText = '*No responses yet...*';
    }

    const responsesEmbed = new EmbedBuilder()
      .setTitle('📊 Responses')
      .setDescription(responsesText)
      .setColor('#29b473')
      .addFields({ name: '⏱️ Time Remaining', value: `${remaining} seconds`, inline: false });

    await message.edit({ embeds: [embeds[0], responsesEmbed] });
  } catch (err) {
    console.error('Error updating responses embed:', err);
  }
}

async function endGame(interaction, gameState) {
  try {
    const message = await interaction.channel.messages.fetch(gameState.messageId);
    const { question, responses, firstCorrect } = gameState;

    // Calculate scores
    const results = [];
    for (const [userId, data] of responses) {
      if (data.answer === question.correctAnswer) {
        const points = userId === firstCorrect ? 10 : 5;
        results.push({
          userId,
          displayName: data.displayName,
          points,
          isFirst: userId === firstCorrect,
        });

        // Record in database
        await recordAnswer(userId, data.displayName, true, points);
      } else {
        await recordAnswer(userId, data.displayName, false, 0);
      }
    }

    // Sort by points (first correct at top)
    results.sort((a, b) => b.points - a.points);

    // Build results text
    let resultsText = `**Correct Answer: ${question.correctAnswer}**\n\n`;
    resultsText += `*${question.explanation}*\n\n`;

    if (results.length > 0) {
      resultsText += '**🏆 Scorers:**\n';
      for (const result of results) {
        const medal = result.isFirst ? '🥇' : '✅';
        resultsText += `${medal} ${result.displayName} — **+${result.points} points**\n`;
      }
    } else {
      resultsText += '*No correct answers this round.*';
    }

    const resultsEmbed = new EmbedBuilder()
      .setTitle('✈️ Trivia Results')
      .setDescription(resultsText)
      .setColor('#29b473')
      .setFooter({ text: 'Thanks for playing! Use /trivia leaderboard to see the standings.' })
      .setTimestamp();

    await message.edit({ embeds: [resultsEmbed] });
  } catch (err) {
    console.error('Error ending game:', err);
  }
}

async function handleLeaderboard(interaction) {
  const period = interaction.options.getString('period') || 'all';
  const leaderboard = await getLeaderboard(period);

  if (!leaderboard || leaderboard.length === 0) {
    return interaction.reply({
      content: '📊 No trivia data yet. Start playing to see the leaderboard!',
      ephemeral: true,
    });
  }

  const periodName = period === 'all' ? 'All Time' : period === 'month' ? 'This Month' : 'This Week';

  let description = '';
  leaderboard.slice(0, 10).forEach((entry, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const accuracy = entry.total_answered > 0 
      ? ((entry.correct_answers / entry.total_answered) * 100).toFixed(1) 
      : '0.0';
    
    description += `${medal} **${entry.display_name}** — ${entry.total_points} pts (${entry.correct_answers}/${entry.total_answered}, ${accuracy}% accuracy)\n`;
  });

  const embed = new EmbedBuilder()
    .setTitle(`✈️ Caribbean Aviation Trivia — ${periodName} Leaderboard`)
    .setDescription(description)
    .setColor('#003466')
    .setFooter({ text: 'Keep playing to climb the rankings!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleReset(interaction) {
  const period = interaction.options.getString('period');
  
  await interaction.deferReply({ ephemeral: true });
  
  const result = await clearLeaderboard(period);
  
  if (result.ok) {
    const periodName = period === 'all' ? 'All Time' : period === 'month' ? 'Monthly' : 'Weekly';
    await interaction.editReply({
      content: `✅ ${periodName} leaderboard has been reset.`,
    });
  } else {
    await interaction.editReply({
      content: '❌ Failed to reset leaderboard.',
    });
  }
}