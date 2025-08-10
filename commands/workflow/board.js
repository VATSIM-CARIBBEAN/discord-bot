// commands/workflow/board.js
const { getOpenWorkflows, codeToName, deleteWorkflowByThread } = require('../../local_library/workflow');
const { EmbedBuilder } = require('discord.js');

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

async function buildBoardEmbed(client) {
  await removeStaleWorkflows(client);
  const guildId = process.env.GUILD_ID;
  const rows = await getOpenWorkflows();

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

async function refreshBoard(client) {
  try {
    const thread = await client.channels.fetch(WORKFLOW_BOARD_THREAD_ID);
    if (!thread?.isThread?.()) {
      console.warn('Workflow board thread not found or invalid.');
      return;
    }
    const message = await thread.messages.fetch(WORKFLOW_BOARD_MESSAGE_ID).catch(() => null);
    const embed = await buildBoardEmbed(client);

    if (message) {
      await message.edit({ embeds: [embed] });
    } else {
      await thread.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error('Error refreshing workflow board:', err);
  }
}

module.exports = { refreshBoard };
