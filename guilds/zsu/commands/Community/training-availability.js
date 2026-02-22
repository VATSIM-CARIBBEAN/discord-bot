const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { DateTime } = require('luxon');

const TIMEZONE_MAP = {
  ET: 'America/New_York',
  CT: 'America/Chicago',
  MT: 'America/Denver',
  PT: 'America/Los_Angeles',
  AKT: 'America/Anchorage',
  HAT: 'Pacific/Honolulu',
  AT: 'America/Halifax',
  UTC: 'UTC',
};

const PAST_GRACE_MINUTES = 5;

function parseHumanTime(input) {
  const original = input;
  input = input.trim().toLowerCase();
  input = input.replace(/\s+/g, '');

  if (/^(\d{3,4})(am|pm)$/.test(input)) {
    input = input.replace(/^(\d{1,2})(\d{2})(am|pm)$/, (_, h, m, ap) => `${h}:${m}${ap}`);
  }

  const re12 = /^(\d{1,2})(?::(\d{2}))?(am|pm)$/;
  const re24 = /^(\d{1,2}):(\d{2})$/;

  let hour, minute;
  const m12 = input.match(re12);
  const m24 = input.match(re24);

  if (m12) {
    hour = parseInt(m12[1], 10);
    minute = m12[2] ? parseInt(m12[2], 10) : 0;
    const period = m12[3];
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
  } else if (m24) {
    hour = parseInt(m24[1], 10);
    minute = parseInt(m24[2], 10);
  } else {
    throw new Error(`Invalid time format: "${original}"`);
  }

  if (hour > 23 || minute > 59) {
    throw new Error(`Invalid time value: "${original}"`);
  }

  return { hour, minute };
}

function buildUtcDateForToday({ hour, minute }, zone) {
  const nowTz = DateTime.now().setZone(zone);
  const dtTz = DateTime.fromObject(
    { year: nowTz.year, month: nowTz.month, day: nowTz.day, hour, minute },
    { zone },
  );
  return dtTz.toUTC().toJSDate();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('training-availability')
    .setDescription('Post your training availability')
    .addStringOption(o =>
      o.setName('start-time').setDescription('When your availability begins').setRequired(true))
    .addStringOption(o =>
      o.setName('end-time').setDescription('When your availability ends').setRequired(true))
    .addStringOption(o =>
      o
        .setName('training-type')
        .setDescription('Type of training you can provide')
        .setRequired(true)
        .addChoices(
          { name: 'Ground Only', value: 'ground' },
          { name: 'Tower or Ground', value: 'tower_ground' },
          { name: 'Approach, Tower, or Ground', value: 'approach_tower_ground' },
          { name: 'Center, Approach, Tower, or Ground', value: 'center_approach_tower_ground' },
        ))
    .addStringOption(o =>
      o
        .setName('timezone')
        .setDescription('Your timezone')
        .setRequired(true)
        .addChoices(
          { name: 'Eastern Time (ET)', value: 'ET' },
          { name: 'Central Time (CT)', value: 'CT' },
          { name: 'Mountain Time (MT)', value: 'MT' },
          { name: 'Pacific Time (PT)', value: 'PT' },
          { name: 'Alaska Time (AKT)', value: 'AKT' },
          { name: 'Hawaii-Aleutian Time (HAT)', value: 'HAT' },
          { name: 'Atlantic Time (AT)', value: 'AT' },
          { name: 'UTC / GMT', value: 'UTC' },
        )),

  async execute(interaction) {
    const startRaw = interaction.options.getString('start-time');
    const endRaw = interaction.options.getString('end-time');
    const type = interaction.options.getString('training-type');
    const tzKey = interaction.options.getString('timezone');

    const zone = TIMEZONE_MAP[tzKey];
    if (!zone) {
      return interaction.reply({ content: 'Unknown timezone.', ephemeral: true });
    }

    let startParts, endParts;
    try {
      startParts = parseHumanTime(startRaw);
      endParts = parseHumanTime(endRaw);
    } catch (err) {
      return interaction.reply({ content: err.message, ephemeral: true });
    }

    let startDate = buildUtcDateForToday(startParts, zone);
    let endDate = buildUtcDateForToday(endParts, zone);

    if (endDate <= startDate) {
      endDate = DateTime.fromJSDate(endDate).plus({ days: 1 }).toJSDate();
    }

    const nowTz = DateTime.now().setZone(zone);
    const minutesDiff = DateTime.fromJSDate(startDate).setZone(zone).diff(nowTz, 'minutes').minutes;
    if (minutesDiff < -PAST_GRACE_MINUTES) {
      return interaction.reply({
        content: `Start time cannot be more than ${PAST_GRACE_MINUTES} minutes in the past.`,
        ephemeral: true,
      });
    }

    const startTs = Math.floor(startDate.getTime() / 1000);
    const endTs = Math.floor(endDate.getTime() / 1000);

    const typePretty = {
      ground: 'Ground Only',
      tower_ground: 'Tower or Ground',
      approach_tower_ground: 'Approach, Tower, or Ground',
      center_approach_tower_ground: 'Center, Approach, Tower, or Ground',
    }[type] || type;

    const embed = new EmbedBuilder()
      .setColor(0x0057b7)
      .setTitle('vZSU Training Availability')
      .setDescription(
        `${interaction.user} has posted an impromptu training session. Click the button below if you can take it!`,
      )
      .addFields(
        {
          name: 'Availability Window',
          value: `From <t:${startTs}:t> (<t:${startTs}:R>)\nTo <t:${endTs}:t> (<t:${endTs}:R>)`,
        },
        { name: 'Training Type', value: typePretty, inline: true },
      )
      .setFooter({ text: 'This post will be automatically removed when the availability period ends.' });

    const button = new ButtonBuilder()
      .setCustomId(`acceptAvailability_${interaction.user.id}`)
      .setLabel('Accept Training Session')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    const trainingRoleId = process.env.ZSU_TRAINING_ROLE_ID;
    const message = await interaction.reply({
      content: trainingRoleId ? `<@&${trainingRoleId}>` : '',
      embeds: [embed],
      components: [row],
      allowedMentions: trainingRoleId ? { roles: [trainingRoleId] } : {},
      fetchReply: true,
    });

    const msUntilDeletion = endDate.getTime() - Date.now();
    if (msUntilDeletion > 0) {
      setTimeout(() => message.delete().catch(() => {}), msUntilDeletion);
    }
  },
};
