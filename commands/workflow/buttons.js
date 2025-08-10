// commands/workflow/buttons.js
const {
  nameToCode,
  ensureWorkflowForThread,
  getWorkflowRowByThread,
  getStatusCodeByThread,
  setStatusByThread,
  nextStatus,
  isFinalStatus,

  tryRename,
  decisionRowForStep,
  continueOnlyRow,
  needsRestartAfterStep1Change,
  ensureAuthorized,
  getActorCidOrEphemeral,

  buildStep1,
  buildChangeRequested,
  buildStep2,
  buildStep3,
  buildStep4,
  buildPublished,
  buildVetoed,
} = require('./_shared');

const { refreshBoard } = require('./board');
const { EmbedBuilder } = require('discord.js');
const { codeToName } = require('../../local_library/workflow');

function buildWorkflowEmbed(description, currentCode) {
  const prevPhase =
    currentCode > 0 && currentCode <= 3 ? codeToName(currentCode - 1) : 'N/A';
  const currPhase = codeToName(currentCode) || 'N/A';
  const nextPhase = !isFinalStatus(currentCode)
    ? codeToName(nextStatus(currentCode))
    : 'N/A';

  return new EmbedBuilder()
    .setDescription(description)
    .setColor('#29b473')
    .setFooter({
      text: `Previous: ${prevPhase} | Current: ${currPhase} | Next: ${nextPhase}`,
    });
}

/**
 * Extract mentions from text, return { cleanText, mentions }
 */
function extractMentions(text) {
  const mentionRegex = /<@&?\d+>/g;
  const mentions = text.match(mentionRegex) || [];
  const cleanText = text.replace(mentionRegex, '').trim();
  return { cleanText, mentions };
}

/** Remove buttons from the message that was clicked */
async function removeButtonsFromClickedMessage(interaction) {
  try {
    if (!interaction?.message?.editable) return;
    await interaction.message.edit({ components: [] });
  } catch (_) {}
}

async function sendWorkflowStep(thread, stepText, currentCode, components) {
  const { cleanText, mentions } = extractMentions(stepText);
  await thread.send({
    content: mentions.join(' '), // tag only relevant members/roles outside embed
    embeds: [buildWorkflowEmbed(cleanText, currentCode)],
    components: components || [],
  });
}

async function handleContinue(interaction, thread, row, currentCode) {
  const changeRequestedView =
    currentCode === 0 && (await needsRestartAfterStep1Change(interaction, thread));

  const allowed = await ensureAuthorized(
    interaction,
    currentCode,
    row.requester,
    changeRequestedView
  );
  if (!allowed) {
    return interaction.reply({
      content: 'You do not have permission to run commands at this step.',
      ephemeral: true,
    });
  }
  if (isFinalStatus(currentCode)) {
    return interaction.reply({
      content: 'This workflow is already complete.',
      ephemeral: true,
    });
  }

  if (changeRequestedView) {
    await sendWorkflowStep(
      thread,
      buildStep1(interaction.user.id, thread.ownerId),
      0,
      [decisionRowForStep(0)]
    );
    await removeButtonsFromClickedMessage(interaction);
    try { await refreshBoard(interaction.client); } catch {}
    return interaction.deferUpdate().catch(() => {});
  }

  const actorCid = await getActorCidOrEphemeral(interaction);
  if (!actorCid) return;

  const nxt = nextStatus(currentCode);
  const res = await setStatusByThread(thread.id, nxt, actorCid);
  if (!res.ok) {
    return interaction.reply({
      content: 'Could not update database.',
      ephemeral: true,
    });
  }

  if (currentCode === 0 && nxt === 1) {
    await sendWorkflowStep(
      thread,
      buildStep2(interaction.user.id, thread.ownerId),
      1,
      [decisionRowForStep(1)]
    );
  } else if (currentCode === 1 && nxt === 2) {
    await sendWorkflowStep(
      thread,
      buildStep3(interaction.user.id, thread.ownerId),
      2,
      [decisionRowForStep(2)]
    );
  } else if (currentCode === 2 && nxt === 3) {
    await sendWorkflowStep(
      thread,
      buildStep4(interaction.user.id, thread.ownerId),
      3,
      [decisionRowForStep(3)]
    );
  } else if (currentCode === 3 && nxt === 4) {
    await tryRename(thread, 'COMPLETE');
    await sendWorkflowStep(
      thread,
      buildPublished(interaction.user.id),
      4
    );
    try { await thread.setLocked(true); await thread.setArchived(true); } catch (_) {}
  }

  await removeButtonsFromClickedMessage(interaction);
  try { await refreshBoard(interaction.client); } catch {}
  return interaction.deferUpdate().catch(() => {});
}

async function handleChange(interaction, thread, row, currentCode) {
  const changeRequestedView =
    currentCode === 0 && (await needsRestartAfterStep1Change(interaction, thread));

  const allowed = await ensureAuthorized(
    interaction,
    currentCode,
    row.requester,
    changeRequestedView
  );
  if (!allowed) {
    return interaction.reply({
      content: 'You do not have permission to run commands at this step.',
      ephemeral: true,
    });
  }

  if (currentCode === 2) {
    const actorCid = await getActorCidOrEphemeral(interaction);
    if (!actorCid) return;

    const res = await setStatusByThread(thread.id, 0, actorCid);
    if (!res.ok) {
      return interaction.reply({
        content: 'Could not update database.',
        ephemeral: true,
      });
    }

    await sendWorkflowStep(
      thread,
      buildChangeRequested(interaction.user.id, thread.ownerId),
      0,
      [continueOnlyRow()]
    );
    await removeButtonsFromClickedMessage(interaction);
    try { await refreshBoard(interaction.client); } catch {}
    return interaction.deferUpdate().catch(() => {});
  }

  if (currentCode === 0) {
    await sendWorkflowStep(
      thread,
      buildChangeRequested(interaction.user.id, thread.ownerId),
      0,
      [continueOnlyRow()]
    );
    await removeButtonsFromClickedMessage(interaction);
    try { await refreshBoard(interaction.client); } catch {}
    return interaction.deferUpdate().catch(() => {});
  }

  return interaction.reply({
    content: 'No change action for this step.',
    ephemeral: true,
  });
}

async function handleVeto(interaction, thread, row) {
  const allowed = await ensureAuthorized(interaction, 3, row.requester, false);
  if (!allowed) {
    return interaction.reply({
      content: 'You do not have permission to run commands at this step.',
      ephemeral: true,
    });
  }

  const actorCid = await getActorCidOrEphemeral(interaction);
  if (!actorCid) return;

  const res = await setStatusByThread(thread.id, nameToCode('VETOED'), actorCid);
  if (!res.ok) {
    return interaction.reply({
      content: 'Could not update database.',
      ephemeral: true,
    });
  }

  await tryRename(thread, 'VETOED');
  await sendWorkflowStep(
    thread,
    buildVetoed(interaction.user.id),
    5
  );
  try { await thread.setLocked(true); await thread.setArchived(true); } catch (_) {}

  await removeButtonsFromClickedMessage(interaction);
  try { await refreshBoard(interaction.client); } catch {}
  return interaction.deferUpdate().catch(() => {});
}

async function handlePublish(interaction, thread, row) {
  const allowed = await ensureAuthorized(interaction, 3, row.requester, false);
  if (!allowed) {
    return interaction.reply({
      content: 'You do not have permission to run commands at this step.',
      ephemeral: true,
    });
  }

  const actorCid = await getActorCidOrEphemeral(interaction);
  if (!actorCid) return;

  const res = await setStatusByThread(thread.id, nameToCode('APPROVED'), actorCid);
  if (!res.ok) {
    return interaction.reply({
      content: 'Could not update database.',
      ephemeral: true,
    });
  }

  await tryRename(thread, 'COMPLETE');
  await sendWorkflowStep(
    thread,
    buildPublished(interaction.user.id),
    4
  );
  try { await thread.setLocked(true); await thread.setArchived(true); } catch (_) {}

  await removeButtonsFromClickedMessage(interaction);
  try { await refreshBoard(interaction.client); } catch {}
  return interaction.deferUpdate().catch(() => {});
}

module.exports = async function handleWorkflowButton(interaction) {
  const thread = interaction.channel;
  if (!thread?.isThread?.()) {
    return interaction.reply({
      content: 'Use these buttons inside a workflow thread.',
      ephemeral: true,
    });
  }

  await ensureWorkflowForThread({ thread, initialRequesterId: thread.ownerId });
  const row = await getWorkflowRowByThread(thread.id);
  if (!row) {
    return interaction.reply({
      content: 'No workflow row found.',
      ephemeral: true,
    });
  }

  const currentCode = await getStatusCodeByThread(thread.id);

  const id = interaction.customId;
  if (id === 'wf_continue') return handleContinue(interaction, thread, row, currentCode);
  if (id === 'wf_change')   return handleChange(interaction, thread, row, currentCode);
  if (id === 'wf_veto')     return handleVeto(interaction, thread, row);
  if (id === 'wf_publish')  return handlePublish(interaction, thread, row);

  return interaction.reply({ content: 'Unknown action.', ephemeral: true });
};
