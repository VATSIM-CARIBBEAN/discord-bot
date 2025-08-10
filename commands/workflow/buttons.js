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

/** Remove buttons from the message that was clicked */
async function removeButtonsFromClickedMessage(interaction) {
  try {
    if (!interaction?.message?.editable) return;
    await interaction.message.edit({ components: [] });
  } catch (_) {}
}

async function handleContinue(interaction, thread, row, currentCode) {
  const changeRequestedView = currentCode === 0 && (await needsRestartAfterStep1Change(interaction, thread));
  const requesterDiscordId = thread.ownerId; // always use the live Discord ID for mentions

  // Permission gate
  const allowed = await ensureAuthorized(interaction, currentCode, row.requester, changeRequestedView);
  if (!allowed) {
    return interaction.reply({ content: 'You do not have permission to run commands at this step.', ephemeral: true });
  }
  if (isFinalStatus(currentCode)) {
    return interaction.reply({ content: 'This workflow is already complete.', ephemeral: true });
  }

  // Restart Step 1 (no advance) when in "change requested" sub-state
  if (changeRequestedView) {
    await thread.send({
      content: buildStep1(interaction.user.id, requesterDiscordId),
      components: [decisionRowForStep(0)],
    });
    await removeButtonsFromClickedMessage(interaction);
    return interaction.deferUpdate().catch(() => {});
  }

  const actorCid = await getActorCidOrEphemeral(interaction);
  if (!actorCid) return; // ephemeral error already sent

  const nxt = nextStatus(currentCode);
  const res = await setStatusByThread(thread.id, nxt, actorCid);
  if (!res.ok) {
    return interaction.reply({ content: 'Could not update database.', ephemeral: true });
  }

  if (currentCode === 0 && nxt === 1) {
    await thread.send({
      content: buildStep2(interaction.user.id, requesterDiscordId),
      components: [decisionRowForStep(1)],
    });
  } else if (currentCode === 1 && nxt === 2) {
    await thread.send({
      content: buildStep3(interaction.user.id, requesterDiscordId),
      components: [decisionRowForStep(2)],
    });
  } else if (currentCode === 2 && nxt === 3) {
    await thread.send({
      content: buildStep4(interaction.user.id, requesterDiscordId),
      components: [decisionRowForStep(3)],
    });
  } else if (currentCode === 3 && nxt === 4) {
    await tryRename(thread, 'COMPLETE');
    await thread.send({
      content: buildPublished(interaction.user.id),
    });
    try { await thread.setLocked(true); await thread.setArchived(true); } catch (_) {}
  }

  await removeButtonsFromClickedMessage(interaction);
  return interaction.deferUpdate().catch(() => {});
}

async function handleChange(interaction, thread, row, currentCode) {
  const changeRequestedView = currentCode === 0 && (await needsRestartAfterStep1Change(interaction, thread));
  const requesterDiscordId = thread.ownerId; // always use live Discord ID

  // Permission gate
  const allowed = await ensureAuthorized(interaction, currentCode, row.requester, changeRequestedView);
  if (!allowed) {
    return interaction.reply({ content: 'You do not have permission to run commands at this step.', ephemeral: true });
  }

  if (currentCode === 2) {
    // Technical Review → back to Step 1 using the MODIFIED Step 1 (Change Requested)
    const actorCid = await getActorCidOrEphemeral(interaction);
    if (!actorCid) return;
    const res = await setStatusByThread(thread.id, 0, actorCid);
    if (!res.ok) return interaction.reply({ content: 'Could not update database.', ephemeral: true });

    await thread.send({
      content: buildChangeRequested(interaction.user.id, requesterDiscordId),
      components: [continueOnlyRow()], // ONLY Continue here
    });
    await removeButtonsFromClickedMessage(interaction);
    return interaction.deferUpdate().catch(() => {});
  }

  if (currentCode === 0) {
    // Step 1: mark change requested (stay in Step 1) with MODIFIED message and ONLY Continue
    await thread.send({
      content: buildChangeRequested(interaction.user.id, requesterDiscordId),
      components: [continueOnlyRow()], // ONLY Continue here
    });
    await removeButtonsFromClickedMessage(interaction);
    return interaction.deferUpdate().catch(() => {});
  }

  return interaction.reply({ content: 'No change action for this step.', ephemeral: true });
}

async function handleVeto(interaction, thread, row) {
  // Leadership-only (use step 3 rule)
  const allowed = await ensureAuthorized(interaction, 3, row.requester, false);
  if (!allowed) {
    return interaction.reply({ content: 'You do not have permission to run commands at this step.', ephemeral: true });
  }

  const actorCid = await getActorCidOrEphemeral(interaction);
  if (!actorCid) return;

  const res = await setStatusByThread(thread.id, nameToCode('VETOED'), actorCid);
  if (!res.ok) return interaction.reply({ content: 'Could not update database.', ephemeral: true });

  await tryRename(thread, 'VETOED');
  await thread.send({ content: buildVetoed(interaction.user.id) });
  try { await thread.setLocked(true); await thread.setArchived(true); } catch (_) {}

  await removeButtonsFromClickedMessage(interaction);
  return interaction.deferUpdate().catch(() => {});
}

// (Not currently shown; kept for potential future use)
async function handlePublish(interaction, thread, row) {
  const allowed = await ensureAuthorized(interaction, 3, row.requester, false);
  if (!allowed) {
    return interaction.reply({ content: 'You do not have permission to run commands at this step.', ephemeral: true });
  }

  const actorCid = await getActorCidOrEphemeral(interaction);
  if (!actorCid) return;

  const res = await setStatusByThread(thread.id, nameToCode('APPROVED'), actorCid);
  if (!res.ok) return interaction.reply({ content: 'Could not update database.', ephemeral: true });

  await tryRename(thread, 'COMPLETE');
  await thread.send({ content: buildPublished(interaction.user.id) });
  try { await thread.setLocked(true); await thread.setArchived(true); } catch (_) {}

  await removeButtonsFromClickedMessage(interaction);
  return interaction.deferUpdate().catch(() => {});
}

module.exports = async function handleWorkflowButton(interaction) {
  const thread = interaction.channel;
  if (!thread?.isThread?.()) {
    return interaction.reply({ content: 'Use these buttons inside a workflow thread.', ephemeral: true });
  }

  await ensureWorkflowForThread({ thread, initialRequesterId: thread.ownerId });
  const row = await getWorkflowRowByThread(thread.id);
  if (!row) return interaction.reply({ content: 'No workflow row found.', ephemeral: true });

  const currentCode = await getStatusCodeByThread(thread.id);

  const id = interaction.customId;
  if (id === 'wf_continue') return handleContinue(interaction, thread, row, currentCode);
  if (id === 'wf_change')   return handleChange(interaction, thread, row, currentCode);
  if (id === 'wf_veto')     return handleVeto(interaction, thread, row);
  if (id === 'wf_publish')  return handlePublish(interaction, thread, row); // not used right now

  return interaction.reply({ content: 'Unknown action.', ephemeral: true });
};
