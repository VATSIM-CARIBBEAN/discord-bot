// commands/workflow/board.js
// Open Workflows board refresher that validates each row against Discord
// so closed-then-deleted threads drop off correctly after restarts.

const { getOpenWorkflows, codeToName } = require('../../local_library/workflow');

/**
 * Build the board content using only workflows whose threads still exist.
 * We *do not* mutate the DB here — we just avoid rendering missing threads.
 */
async function buildBoardContent(client) {
  const guildId = process.env.GUILD_ID;
  const rows = await getOpenWorkflows(); // status 0..3

  if (!rows || rows.length === 0) {
    return [
      '## Open Workflows',
      '',
      'No open workflows at the moment.',
    ].join('\n');
  }

  // Validate that each workflow’s thread still exists
  const validated = [];
  const missing = [];

  for (const r of rows) {
    const threadId = String(r.discord_forumid || '').trim();
    if (!threadId) continue;

    try {
      // If the thread was deleted, this will throw (Unknown Channel).
      const ch = await client.channels.fetch(threadId, { cache: true });
      // We don’t care if it’s archived/locked — if it exists, we render it.
      if (ch) validated.push(r);
    } catch (err) {
      // 10003 = Unknown Channel (deleted), 50001 = Missing Access
      const code = err?.code ?? err?.rawError?.code;
      if (code === 10003 || code === 50001) {
        missing.push(r);
      } else {
        console.warn('⚠️ Failed to fetch thread', threadId, err?.message || err);
        // Be defensive and exclude unknown failures as well
        missing.push(r);
      }
    }
  }

  if (missing.length) {
    const ids = missing.map(m => m.discord_forumid).join(', ');
    console.log(`ℹ️ Pruned ${missing.length} missing threads from board render: [${ids}]`);
  }

  if (validated.length === 0) {
    return [
      '## Open Workflows',
      '',
      'No open workflows at the moment.',
    ].join('\n');
  }

  const lines = validated.map(r => {
    const status = codeToName(r.status) || 'UNKNOWN';
    const url = `https://discord.com/channels/${guildId}/${r.discord_forumid}`;
    return `- [${r.title}](${url}) — **${status}**`;
  });

  return [
    '## Open Workflows',
    '',
    ...lines,
  ].join('\n');
}

/**
 * Refresh the fixed “Open Workflows” board message in the board thread.
 * Requires two env vars:
 *   WORKFLOW_BOARD_THREAD_ID  — the thread that *contains* the board message
 *   WORKFLOW_BOARD_MESSAGE_ID — the specific message inside that thread
 */
async function refreshBoard(client) {
  const threadId  = process.env.WORKFLOW_BOARD_THREAD_ID;
  const messageId = process.env.WORKFLOW_BOARD_MESSAGE_ID;

  if (!threadId || !messageId) {
    console.error('❌ Missing WORKFLOW_BOARD_THREAD_ID or WORKFLOW_BOARD_MESSAGE_ID env vars.');
    return;
  }

  try {
    const thread = await client.channels.fetch(threadId, { cache: true });
    if (!thread || !thread.isThread()) {
      console.error('❌ Board thread is missing or not a thread:', threadId);
      return;
    }

    // We don’t create if missing — this file only updates the fixed message.
    const msg = await thread.messages.fetch(messageId);

    const content = await buildBoardContent(client);
    await msg.edit({ content }).catch(err => {
      console.error('❌ Failed to edit board message:', err.message || err);
    });

    // Keep the board thread locked
    try { await thread.setLocked(true); } catch {}

  } catch (err) {
    console.error('❌ Error during board refresh:', err.message || err);
  }
}

module.exports = { refreshBoard };
