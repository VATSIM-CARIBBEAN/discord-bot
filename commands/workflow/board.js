// commands/workflow/board.js
const { getOpenWorkflows, codeToName, deleteWorkflowByThread } = require('../../local_library/workflow');
const { EmbedBuilder } = require('discord.js');

// Fixed IDs you gave
const WORKFLOW_BOARD_THREAD_ID  = '1403972536102031403';
const WORKFLOW_BOARD_MESSAGE_ID = '1403972536102031403';

async function removeStaleWorkflows(client) {
  const rows = await getOpenWorkflows();
  if (!rows || !rows.length) return;

  for (const r of rows) {
    try {
      const thread = await client.channels.fetch(r.discord_forumid).catch(() => null);
      if (!thread) {
        console.log(`🗑 Removing stale workflow from DB: ${r.title} (${r.discord_forumid})`);
        await deleteWorkflowByThread(r.discord_forumid);
      }
    } catch (err) {
      console.error('Error checking stale workflow:', err);
    }
  }
}

/**
 * Build the board embed from open workflows.
 */
async function buildBoardEmbed(client) {
  await removeStaleWorkflows(client);
  const guildId = process.env.GUILD_ID;
  const rows = await getOpenWorkflows(); // status 0..3

  const embed = new EmbedBuilder()
    .setTitle('Open Workflows')
    .setColor('#29b473');

  if (!rows || rows.length === 0) {
    embed.setDescription('No open workflows at the moment.');
    return embed;
  }

  const lines = rows.map(r => {
    const link = `https://discord.com/channels/${guildId}/${r.discord_forumid}`;
    const status = codeToName(r.status) || 'UNKNOWN';
    const safeTitle = (r.title || '(no title)').replace(/\r?\n/g, ' ').slice(0, 180);
    return `- [${safeTitle}](${link}) — **${status}**`;
  });

  embed.setDescription(lines.join('\n'));
  return embed;
}

/**
 * Edit the fixed message inside the fixed thread with the current board content.
 */
async function refreshBoard(client) {
  try {
    const thread = await client.channels.fetch(WORKFLOW_BOARD_THREAD_ID);
    if (!thread?.isThread?.()) {
      console.error(`❌ Board thread not found or not a thread: ${WORKFLOW_BOARD_THREAD_ID}`);
      return;
    }

    const msg = await thread.messages.fetch(WORKFLOW_BOARD_MESSAGE_ID).catch(() => null);
    if (!msg) {
      console.error(`❌ Board message not found in thread ${WORKFLOW_BOARD_THREAD_ID}: ${WORKFLOW_BOARD_MESSAGE_ID}`);
      return;
    }

    const embed = await buildBoardEmbed(client);
    await msg.edit({ embeds: [embed], content: '' }).catch(err => {
      console.error('❌ Failed to edit board message:', err.message || err);
    });

    try { await thread.setLocked(true); } catch {}

  } catch (err) {
    console.error('❌ Error during board refresh:', err.message || err);
  }
}

module.exports = { refreshBoard };
