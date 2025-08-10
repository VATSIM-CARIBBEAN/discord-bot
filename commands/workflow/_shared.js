// commands/workflow/_shared.js
const {
  codeToName,
  nameToCode,
  isFinalStatus,
  nextStatus,
  ensureWorkflowForThread,
  getWorkflowRowByThread,
  getStatusCodeByThread,
  setStatusByThread,
  resolveUserCidByDiscord,
} = require('../../local_library/workflow');

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

/* ===== Title helpers ===== */
const MAX_TITLE = 100;
function stripLeadingTag(name) { return String(name || '').replace(/^\s*\[[^\]]+\]\s*/i, '').trim(); }
function buildTaggedTitle(tag, currentName) {
  const base = stripLeadingTag(currentName);
  const prefix = `[${tag}] `;
  const maxBaseLen = Math.max(0, MAX_TITLE - prefix.length);
  if (base.length <= maxBaseLen) return `${prefix}${base}`;
  const sliceLen = Math.max(0, maxBaseLen - 3);
  return `${prefix}${base.slice(0, sliceLen)}...`;
}
async function tryRename(thread, tag) {
  try {
    const desired = buildTaggedTitle(tag, thread.name);
    if (desired !== thread.name) await thread.setName(desired);
  } catch (_) {}
}

/* ===== Action header (mentions actor) ===== */
function actionHeader(userId, label) {
  return `__<@${userId}> issued the command **${label}**.__\n`;
}

/* ===== Decision buttons (step-aware) =====
   stepCode: 0 Initial Leadership Review → Continue, Change, Veto
             1 Staff Review              → Continue
             2 Technical Review          → Continue, Change
             3 Final Comprehensive       → Continue, Veto
             >=4 terminal                → none
*/
function decisionRowForStep(stepCode) {
  if (stepCode >= 4) return undefined;

  const btnContinue = new ButtonBuilder().setCustomId('wf_continue').setLabel('Continue').setStyle(ButtonStyle.Success);
  const btnChange   = new ButtonBuilder().setCustomId('wf_change').setLabel('Change').setStyle(ButtonStyle.Secondary);
  const btnVeto     = new ButtonBuilder().setCustomId('wf_veto').setLabel('Veto').setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder();
  if (stepCode === 0)       row.addComponents(btnContinue, btnChange, btnVeto);
  else if (stepCode === 1)  row.addComponents(btnContinue);
  else if (stepCode === 2)  row.addComponents(btnContinue, btnChange);
  else if (stepCode === 3)  row.addComponents(btnContinue, btnVeto);

  return row;
}

/* Continue-only (used for the Change Requested variant in Step 1) */
function continueOnlyRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('wf_continue').setLabel('Continue').setStyle(ButtonStyle.Success),
  );
}

/* ===== Message builders (clean format, dynamic mentions) ===== */
const EXECUTIVE_ROLE_ID = '777561969074896904';

function buildStep1Intro(requesterId) {
  return [
    '## **Phase 1 — Initial Leadership Review**',
    'Change workflow process has started. The next step is for the appropriate leadership to review and make a decision.',
    '',
    '**Staff Member Response Needed**',
    `- Executive Team (<@&${EXECUTIVE_ROLE_ID}>)`,
    '',
    '**Action Items**',
    '1. Is the change justified?',
    '2. Does the change violate any VATSIM policies?',
    '3. Does the change violate any VATCAR policies?',
    '',
    '**Decision Actions**',
    '- **Continue** – All review action items are complete and no change is required.',
    '- **Change Requested** – A review action item is incomplete. Please review the feedback and amend your changes.',
    '- **Veto** – The change has been rejected and will no longer be considered.',
  ].join('\n');
}

function buildStep1(actorId, requesterId) {
  return [
    '## **Phase 1 — Initial Leadership Review**',
    `> *<@${actorId}> issued the command **Continue***`,
    'The leadership team should review the proposed change for justification and compliance.',
    '',
    '**Staff Member Response Needed**',
    `- Executive Team (<@&${EXECUTIVE_ROLE_ID}>)`,
    '',
    '**Action Items**',
    '1. Is the change justified?',
    '2. Does the change violate any VATSIM policies?',
    '3. Does the change violate any VATCAR policies?',
    '',
    '**Decision Actions**',
    '- **Continue** – All review action items are complete and no change is required.',
    '- **Change Requested** – A review action item is incomplete. Please review the feedback and amend your changes.',
    '- **Veto** – The change has been rejected and will no longer be considered.',
  ].join('\n');
}

function buildChangeRequested(actorId, requesterId) {
  return [
    '## **Phase 1 — Change Requested**',
    `> *<@${actorId}> issued the command **Change Requested***`,
    'The leadership team has requested modifications to the original change request. Please review their request and provide updated information.',
    '',
    '**Staff Member Response Needed**',
    `- Requester (<@${requesterId}>)`,
    '',
    '**Action Items**',
    '1. Update the change request to address the feedback.',
    '',
    '**Decision Actions**',
    '- **Continue** – Updated request is ready to be reviewed again.',
  ].join('\n');
}

function buildStep2(actorId, requesterId) {
  return [
    '## **Phase 2 — Staff Review**',
    `> *<@${actorId}> issued the command **Continue***`,
    'Leadership has approved the request. The requestor should begin working with all relevant parties to complete the process.',
    '',
    '**Staff Member Response Needed**',
    `- Requester (<@${requesterId}>)`,
    '',
    '**Action Items**',
    '1. Notify affected staff (Neighboring FIRs, Training Team, etc.).',
    '2. Notify divisional teams needed for the change (technical, marketing, events, etc.).',
    '3. Complete all items required to publish change from the facility',
    '',
    '**Decision Actions**',
    '- **Continue** – All action items are complete and ready to move forward.',
  ].join('\n');
}

function buildStep3(actorId, requesterId) {
  return [
    '## **Phase 3 — Technical/Divisional Review**',
    `> *<@${actorId}> issued the command **Continue***`,
    'Awaiting responses from divisional teams or other staff for technical/operational readiness.',
    '',
    '**Staff Member Response Needed**',
    `- Division Team (if applicable) (<@&${EXECUTIVE_ROLE_ID}>)`,
    '- Any other staff member involved in the change process',
    '',
    '**Action Items**',
    '1. Await responses from affected staff members.',
    '2. Await divisional actions and any associated requests.',
    '3. Once all teams have responded with a confirmation, continue.',
    '',
    '**Decision Actions**',
    '- **Continue** – All action items are complete.',
    '- **Change Requested** – Restart from leadership review if modifications are requested.',
  ].join('\n');
}

function buildStep4(actorId, requesterId) {
  return [
    '## **Phase 4 — Final Comprehensive Review**',
    `> *<@${actorId}> issued the command **Continue***`,
    'Final review before the change goes live. This is the responsibility of the requestor. All action items are complete and the changes should be published.',
    '',
    '**Staff Member Response Needed**',
    `- Requester (<@${requesterId}>)`,
    '',
    '**Action Items**',
    '1. If ready, announce the change to all members.',
    '2. If not yet published, alert technical staff to publish it.',
    '',
    '**Decision Actions**',
    '- **Continue** – All action items are complete and the change is now in effect.',
    '- **Veto** – The change is no longer being considered.',
  ].join('\n');
}

function buildPublished(actorId) {
  return [
    '## **Change Published**',
    `> *<@${actorId}> issued the command **Continue***`,
    '# Change published and released. No further action is needed. To amend, please open a new change workflow request.',
  ].join('\n');
}

function buildVetoed(actorId) {
  return [
    '## **Change Vetoed**',
    `> *<@${actorId}> issued the command **Veto***`,
    '# The change was vetoed by the leadership team and will no longer be considered. For a new change, please open a new thread and start the workflow process.',
  ].join('\n');
}

/* ===== Permissions per step ===== */
const LEADERSHIP_ROLE_IDS = new Set(['777561969074896904', '777551676181708840']); // keep both leadership roles

function hasLeadership(interaction) {
  const m = interaction.member;
  if (!m) return false;
  const roles = m.roles?.cache ? [...m.roles.cache.keys()] : (m.roles || []);
  return roles.some((id) => LEADERSHIP_ROLE_IDS.has(String(id)));
}

async function ensureAuthorized(interaction, stepCode, requesterId, isChangeRequestedView) {
  const isLead = hasLeadership(interaction);
  const isReq = requesterId && String(requesterId) === String(interaction.user.id);

  if (stepCode === 0) return isChangeRequestedView ? (isLead || isReq) : isLead;
  if (stepCode === 1) return isLead || isReq;
  if (stepCode === 2) return isLead || isReq;
  if (stepCode === 3) return isLead;
  return isLead;
}

/* ===== Step-1 restart marker detection ===== */
async function needsRestartAfterStep1Change(interaction, thread) {
  try {
    const botId = interaction.client.user.id;
    const msgs = await thread.messages.fetch({ limit: 25 });
    const ordered = [...msgs.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    let lastChangeIdx = -1, lastIntroIdx = -1;
    for (let i = 0; i < ordered.length; i++) {
      const m = ordered[i];
      if (m.author?.id !== botId) continue;
      const content = (m.content || '').toUpperCase();
      if (content.includes('PHASE 1 — CHANGE REQUESTED')) lastChangeIdx = i;
      if (content.includes('PHASE 1 — INITIAL LEADERSHIP REVIEW')) lastIntroIdx = i;
    }
    return lastChangeIdx !== -1 && lastIntroIdx < lastChangeIdx;
  } catch {
    return false;
  }
}

/* ===== CID helper ===== */
async function getActorCidOrEphemeral(interaction) {
  const cid = await resolveUserCidByDiscord(interaction.user.id);
  if (!cid) {
    await interaction.reply({
      content: 'You must connect your Discord account on **https://vatcar.net/public/my/integrations** to proceed for logging reasons.',
      ephemeral: true,
    }).catch(() => {});
  }
  return cid;
}

module.exports = {
  // workflow accessors
  codeToName, nameToCode, isFinalStatus, nextStatus,
  ensureWorkflowForThread, getWorkflowRowByThread, getStatusCodeByThread, setStatusByThread,

  // helpers
  tryRename,
  actionHeader,
  decisionRowForStep,
  continueOnlyRow,
  needsRestartAfterStep1Change,
  ensureAuthorized, getActorCidOrEphemeral,

  // message builders
  buildStep1Intro,
  buildStep1,
  buildChangeRequested,
  buildStep2,
  buildStep3,
  buildStep4,
  buildPublished,
  buildVetoed,
};
