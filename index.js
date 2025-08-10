// index.js
require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ChannelType,
} = require('discord.js');

const { ensureWorkflowForThread } = require('./local_library/workflow');
const { decisionRowForStep, buildStep1Intro } = require('./commands/workflow/_shared');
const handleWorkflowButton = require('./commands/workflow/buttons');

/** ===== Config ===== */
const GUILD_ID = process.env.GUILD_ID || '431572698678951937';
const FORUM_CHANNEL_ID = process.env.FORUM_CHANNEL_ID || '1403932322260058212';
/** ================== */

const DISCORD_TOKEN = process.env.BOT_TOKEN;
if (!DISCORD_TOKEN) {
  console.error('❌ Missing BOT_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         // required for threads + interactions
    GatewayIntentBits.GuildMessages,  // to post messages in threads
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once('ready', (bot) => {
  console.log(`🤖 Logged in as ${bot.user.tag}`);
  console.log(`🏠 Guild ID: ${GUILD_ID}`);
  console.log(`🧵 Forum Channel ID: ${FORUM_CHANNEL_ID}`);
});

/* --- New forum thread → create DB row + post intro with buttons (short delay) --- */
client.on(Events.ThreadCreate, async (thread) => {
  try {
    if (thread.parent?.type !== ChannelType.GuildForum) return;
    if (thread.guildId !== GUILD_ID) return;
    if (thread.parentId !== FORUM_CHANNEL_ID) return;

    await ensureWorkflowForThread({ thread, initialRequesterId: thread.ownerId });

    const intro = buildStep1Intro(thread.ownerId);

    // small delay so the thread starter message exists (avoids 40058)
    setTimeout(async () => {
      try {
        await thread.send({ content: intro, components: [decisionRowForStep(0)] });
      } catch (err) {
        console.error(`Intro send failed in ${thread.id}:`, err?.code || err);
      }
    }, 2500);
  } catch (err) {
    console.error('Error handling ThreadCreate:', err);
  }
});

/* -------- Button interactions router -------- */
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.guildId !== GUILD_ID) return;

    await handleWorkflowButton(interaction);
  } catch (err) {
    console.error('Button handler error:', err);
    if (interaction.deferred || interaction.replied) {
      try { await interaction.followUp({ content: 'Something went wrong.', ephemeral: true }); } catch {}
    } else {
      try { await interaction.reply({ content: 'Something went wrong.', ephemeral: true }); } catch {}
    }
  }
});

/* -------- Shutdown -------- */
process.on('SIGINT', () => { console.log('Shutting down…'); client.destroy(); process.exit(0); });
process.on('SIGTERM', () => { console.log('Shutting down…'); client.destroy(); process.exit(0); });

client.login(DISCORD_TOKEN);
