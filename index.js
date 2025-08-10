// index.js
require('dotenv').config();
const { startHeartbeat } = require('./local_library/heartbeat');

const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ChannelType,
} = require('discord.js');

const {
  ensureWorkflowForThread,
  deleteWorkflowByThread,
} = require('./local_library/workflow');

const { handleButtons } = require('./commands/workflow/buttons');
const { refreshBoard } = require('./commands/workflow/board');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessageTyping,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.GuildMember, Partials.User],
});

// ————————————————————————————————
// Lifecycle
// ————————————————————————————————
let hbHandle = null;

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // heartbeat pinger (optional)
  hbHandle = startHeartbeat({
    url: process.env.HEARTBEAT_URL,            // e.g. your health check endpoint
    intervalMs: 60_000,
    payload: { service: 'discord-bot', ts: Date.now() },
  });

  // On startup: make the “Open Workflows” board accurate even if threads were closed then deleted.
  await refreshBoard(client).catch(err => console.error('refreshBoard on ready failed:', err));

  // Also refresh every 5 minutes – this handles mid-run deletes or permission changes.
  const REFRESH_INTERVAL_MS = Number(process.env.WORKFLOW_BOARD_REFRESH_MS || 5 * 60 * 1000);
  setInterval(() => {
    refreshBoard(client).catch(err => console.error('refreshBoard interval failed:', err));
  }, REFRESH_INTERVAL_MS);
});

// ————————————————————————————————
// Message & Interaction handlers
// ————————————————————————————————
client.on(Events.ThreadCreate, async (thread) => {
  // Only consider threads created inside forums, skip system threads
  try {
    if (thread?.parent?.type !== ChannelType.GuildForum) return;
    await ensureWorkflowForThread(thread);
  } catch (err) {
    console.error('ensureWorkflowForThread failed:', err);
  }
});

client.on(Events.ThreadDelete, async (thread) => {
  try {
    // Clean up when a workflow thread is deleted
    await deleteWorkflowByThread(thread.id);
    // Keep the board tidy shortly after a deletion
    await refreshBoard(client).catch(() => {});
  } catch (err) {
    console.error('deleteWorkflowByThread failed:', err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    await handleButtons(interaction, client);
    // Updates that change status should reflect on the board
    await refreshBoard(client).catch(() => {});
  } catch (err) {
    console.error('handleButtons failed:', err);
  }
});

// ————————————————————————————————
// Shutdown
// ————————————————————————————————
async function shutdown() {
  try { if (hbHandle) hbHandle.stop?.(); } catch {}
  try { await client.destroy(); } catch {}
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('beforeExit', () => { if (hbHandle) hbHandle.stop?.(); });

client.login(DISCORD_TOKEN);
