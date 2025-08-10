// index.js
require('dotenv').config();
const { startHeartbeat } = require('./local_library/heartbeat');

const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ChannelType,
  EmbedBuilder,
} = require('discord.js');

const {
  ensureWorkflowForThread,
  deleteWorkflowByThread,
} = require('./local_library/workflow');

const {
  decisionRowForStep,
  buildStep1Intro,
} = require('./commands/workflow/_shared');
const handleWorkflowButton = require('./commands/workflow/buttons');
const { refreshBoard } = require('./commands/workflow/board');

const DISCORD_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const FORUM_CHANNEL_ID = process.env.FORUM_CHANNEL_ID;
const HB_URL = process.env.BETTERSTACK_HEARTBEAT_URL;
const HB_INTERVAL = Number(process.env.BETTERSTACK_HEARTBEAT_INTERVAL_MS || 60000);

if (!DISCORD_TOKEN || !GUILD_ID || !FORUM_CHANNEL_ID) {
  console.error('Missing one of BOT_TOKEN, GUILD_ID, FORUM_CHANNEL_ID in .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel, Partials.Message],
});

let hbHandle = null;

/**
 * Extract mentions from embed text so we can ping them outside of embed too
 */
function extractMentions(text) {
  const mentionRegex = /<@&?\d+>/g;
  const mentions = text.match(mentionRegex) || [];
  return [...new Set(mentions)];
}

client.once('ready', async (bot) => {
  console.log(`🤖 Logged in as ${bot.user.tag}`);
  console.log(`🏠 Guild: ${GUILD_ID}`);
  console.log(`🧵 Forum channel: ${FORUM_CHANNEL_ID}`);

  hbHandle = startHeartbeat(HB_URL, HB_INTERVAL);
  console.log('Better Stack heartbeat started.');

  try {
    await refreshBoard(client);
    console.log('🗂 Workflow board refreshed and stale entries removed.');
  } catch (e) {
    console.warn('Board refresh on ready failed:', e.message);
  }
});

client.on(Events.ThreadCreate, async (thread) => {
  try {
    if (thread.parent?.type !== ChannelType.GuildForum) return;
    if (thread.guildId !== GUILD_ID) return;
    if (thread.parentId !== FORUM_CHANNEL_ID) return;

    // Create workflow row for this thread
    await ensureWorkflowForThread({ thread, initialRequesterId: thread.ownerId });

    // Build Step 1 embed
    const introText = buildStep1Intro(thread.ownerId);
    const mentions = extractMentions(introText);

    const embed = new EmbedBuilder()
      .setDescription(introText)
      .setColor('#29b473')
      .setFooter({
        text: 'Previous: N/A | Current: INITIAL LEADERSHIP REVIEW | Next: STAFF REVIEW',
      });

    // Send after small delay so thread is ready
    setTimeout(async () => {
      try {
        await thread.send({
          content: mentions.join(' '),
          embeds: [embed],
          components: [decisionRowForStep(0)],
        });
      } catch (err) {
        console.error(`Intro send failed in ${thread.id}:`, err?.code || err);
      }
      try {
        await refreshBoard(client);
      } catch {}
    }, 2500);
  } catch (err) {
    console.error('Error handling ThreadCreate:', err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.guildId !== GUILD_ID) return;

    await handleWorkflowButton(interaction);
    try {
      await refreshBoard(interaction.client);
    } catch {}
  } catch (err) {
    console.error('Button handler error:', err);
    if (interaction.deferred || interaction.replied) {
      try {
        await interaction.followUp({
          content: 'Something went wrong.',
          ephemeral: true,
        });
      } catch {}
    } else {
      try {
        await interaction.reply({
          content: 'Something went wrong.',
          ephemeral: true,
        });
      } catch {}
    }
  }
});

client.on(Events.ThreadDelete, async (thread) => {
  try {
    if (thread?.guildId !== GUILD_ID) return;
    await deleteWorkflowByThread(thread.id).catch(() => {});
    await refreshBoard(client).catch(() => {});
    console.log(`🗑️ Thread ${thread.id} deleted → row removed from DB`);
  } catch (err) {
    console.error('Error handling ThreadDelete:', err);
  }
});

client.on(Events.ChannelDelete, async (channel) => {
  try {
    if (typeof channel?.isThread === 'function' && channel.isThread()) {
      if (channel.guildId !== GUILD_ID) return;
      await deleteWorkflowByThread(channel.id).catch(() => {});
      await refreshBoard(client).catch(() => {});
      console.log(
        `🗑️ (ChannelDelete) Thread ${channel.id} deleted → row removed from DB`
      );
    }
  } catch (err) {
    console.error('Error handling ChannelDelete:', err);
  }
});

function shutdown() {
  console.log('Shutting down…');
  client.destroy();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('beforeExit', () => {
  if (hbHandle) hbHandle.stop();
});

client.login(DISCORD_TOKEN);
