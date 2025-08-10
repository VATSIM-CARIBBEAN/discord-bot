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

const { decisionRowForStep, buildStep1Intro } = require('./commands/workflow/_shared');
const handleWorkflowButton = require('./commands/workflow/buttons');
const { refreshBoard } = require('./commands/workflow/board');

// ===== Config from .env =====
const DISCORD_TOKEN     = process.env.BOT_TOKEN;
const GUILD_ID          = process.env.GUILD_ID;
const FORUM_CHANNEL_ID  = process.env.FORUM_CHANNEL_ID; // change-request forum
const HB_URL = process.env.BETTERSTACK_HEARTBEAT_URL;
const HB_INTERVAL = Number(process.env.BETTERSTACK_HEARTBEAT_INTERVAL_MS || 60000);

if (!DISCORD_TOKEN || !GUILD_ID || !FORUM_CHANNEL_ID) {
  console.error('Missing one of BOT_TOKEN, GUILD_ID, FORUM_CHANNEL_ID in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

let hbHandle = null;

client.once('ready', async (bot) => {
  console.log(`🤖 Logged in as ${bot.user.tag}`);
  console.log(`🏠 Guild: ${GUILD_ID}`);
  console.log(`🧵 Forum channel: ${FORUM_CHANNEL_ID}`);

  hbHandle = startHeartbeat(HB_URL, HB_INTERVAL);
  console.log('Better Stack heartbeat started.');

  // Refresh the fixed "Open Workflows" board at startup (will also remove stale)
  try { 
    await refreshBoard(client);
    console.log('🗂 Workflow board refreshed and stale entries removed.');
  } catch (e) {
    console.warn('Board refresh on ready failed:', e.message);
  }
});

/**
 * New forum post (thread) → create DB row, send Step 1 intro (embed), refresh board
 */
client.on(Events.ThreadCreate, async (thread) => {
  try {
    if (thread.parent?.type !== ChannelType.GuildForum) return;
    if (thread.guildId !== GUILD_ID) return;
    if (thread.parentId !== FORUM_CHANNEL_ID) return;

    await ensureWorkflowForThread({ thread, initialRequesterId: thread.ownerId });

    const introText = buildStep1Intro(thread.ownerId);
    const embed = new EmbedBuilder()
      .setDescription(introText)
      .setColor('#29b473')
      .setFooter({ text: 'Current: INITIAL LEADERSHIP REVIEW | Next: STAFF REVIEW' });

    setTimeout(async () => {
      try {
        await thread.send({ 
          content: `<@${thread.ownerId}>`, 
          embeds: [embed], 
          components: [decisionRowForStep(0)] 
        });
      } catch (err) {
        console.error(`Intro send failed in ${thread.id}:`, err?.code || err);
      }
      try { await refreshBoard(client); } catch {}
    }, 2500);
  } catch (err) {
    console.error('Error handling ThreadCreate:', err);
  }
});

/**
 * Button interactions (Continue / Change / Veto …)
 */
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.guildId !== GUILD_ID) return;

    await handleWorkflowButton(interaction);

    // After any action, keep the board fresh
    try { await refreshBoard(interaction.client); } catch {}
  } catch (err) {
    console.error('Button handler error:', err);
    if (interaction.deferred || interaction.replied) {
      try { await interaction.followUp({ content: 'Something went wrong.', ephemeral: true }); } catch {}
    } else {
      try { await interaction.reply({ content: 'Something went wrong.', ephemeral: true }); } catch {}
    }
  }
});

/**
 * When a workflow thread is manually deleted:
 * - delete the row from DB
 * - refresh the Open Workflows board
 */
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

/**
 * Safety net: Some gateways deliver thread deletions via ChannelDelete
 */
client.on(Events.ChannelDelete, async (channel) => {
  try {
    if (typeof channel?.isThread === 'function' && channel.isThread()) {
      if (channel.guildId !== GUILD_ID) return;
      await deleteWorkflowByThread(channel.id).catch(() => {});
      await refreshBoard(client).catch(() => {});
      console.log(`🗑️ (ChannelDelete) Thread ${channel.id} deleted → row removed from DB`);
    }
  } catch (err) {
    console.error('Error handling ChannelDelete:', err);
  }
});

/* graceful shutdown */
function shutdown() {
  console.log('Shutting down…');
  client.destroy();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('beforeExit', () => { if (hbHandle) hbHandle.stop(); });

client.login(DISCORD_TOKEN);
