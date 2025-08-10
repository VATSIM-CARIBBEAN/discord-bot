// commands/workflow/board.js
// Fixed "Open Workflows" board updater (no auto-create)

const { getOpenWorkflows, codeToName } = require('../../local_library/workflow');

// >>> Fixed IDs you gave <<<
const WORKFLOW_BOARD_THREAD_ID  = '1403972536102031403';
const WORKFLOW_BOARD_MESSAGE_ID = '1403972536102031403';

/**
 * Build the board message content from open workflows.
 * Each line: - [Title](link) — STATUS
 */
async function buildBoardContent() {
  const guildId = process.env.GUILD_ID;
  const rows = await getOpenWorkflows(); // status 0..3

  if (!rows || rows.length === 0) {
    return [
      '## Open Workflows',
      '',
      'No open workflows at the moment.',
    ].join('\n');
  }

  const lines = rows.map(r => {
    const link = `https://discord.com/channels/${guildId}/${r.discord_forumid}`;
    const status = codeToName(r.status) || 'UNKNOWN';
    const safeTitle = (r.title || '(no title)').replace(/\r?\n/g, ' ').slice(0, 180);
    return `- [${safeTitle}](${link}) — **${status}**`;
  });

  return ['## Open Workflows', '', ...lines].join('\n');
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

    const content = await buildBoardContent();
    await msg.edit({ content }).catch(err => {
      console.error('❌ Failed to edit board message:', err.message || err);
    });

    // keep it locked (no one can post)
    try { await thread.setLocked(true); } catch {}

  } catch (err) {
    console.error('❌ Error during board refresh:', err.message || err);
  }
}

module.exports = { refreshBoard };
