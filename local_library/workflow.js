// local_library/workflow.js
// Utilities for reading/updating workflow rows and resolving VATCAR user CIDs
// from a Discord account integration.

const { query } = require('./db');

/** ------------------------ Status map ------------------------ */
const STATUS_MAP = {
  0: 'INITIAL LEADERSHIP REVIEW',
  1: 'STAFF REVIEW',
  2: 'TECHNICAL TEAM REVIEW',
  3: 'FINAL COMPREHENSIVE REVIEW',
  4: 'APPROVED',
  5: 'VETOED',
  6: 'TABLED',
};

const NAME_TO_CODE = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, Number(k)])
);

function normName(s) {
  return String(s || '').trim().toUpperCase().replace(/\s+/g, ' ');
}

function codeToName(code) {
  return STATUS_MAP[Number(code)] ?? 'UNKNOWN';
}

function nameToCode(name) {
  return NAME_TO_CODE[normName(name)] ?? null;
}

function isFinalStatus(x) {
  const c = typeof x === 'number' ? x : nameToCode(x);
  return c >= 4; // Approved, Vetoed, Tabled
}

function nextStatus(x) {
  const c = typeof x === 'number' ? x : (nameToCode(x) ?? 0);
  if (c >= 4) return null;
  return c + 1;
}

/** -------------------- Integrations lookup ------------------- */
/**
 * Resolve a VATCAR user CID from a Discord user id using the `integrations` table.
 * We assume:
 *   - `type = 1` represents Discord integrations
 *   - `value` holds the Discord user id as a string
 * Returns a number (user_cid) or null.
 */
async function resolveUserCidByDiscord(discordUserId) {
  const rows = await query(
    `SELECT user_cid
       FROM integrations
      WHERE type = 1 AND value = :v
      ORDER BY id DESC
      LIMIT 1`,
    { v: String(discordUserId) }
  );
  if (!rows || rows.length === 0) return null;
  const cid = Number(rows[0].user_cid);
  return Number.isFinite(cid) ? cid : null;
}

/** -------------------- Workflow row helpers ------------------ */
/**
 * Ensure a workflow row exists for the given Discord thread.
 * If it already exists, returns its id. Otherwise inserts a new row in
 * `change_workflow` with status=0 (INITIAL LEADERSHIP REVIEW).
 */
async function ensureWorkflowForThread({ thread, initialRequesterId }) {
  const threadId = String(thread.id);

  const existing = await query(
    `SELECT id FROM change_workflow WHERE discord_forumid = :t LIMIT 1`,
    { t: threadId }
  );
  if (existing.length) return existing[0].id;

  const res = await query(
    `INSERT INTO change_workflow
       (requester, title, status, staff_member, created_at, updated_at, discord_forumid)
     VALUES
       (:req, :title, 0, NULL, NOW(), NOW(), :t)`,
    {
      req: Number(initialRequesterId) || 0,
      title: String(thread.name || ''),
      t: threadId,
    }
  );
  return res.insertId;
}

/** Fetch the full workflow row for a thread id (discord_forumid). */
async function getWorkflowRowByThread(threadId) {
  const rows = await query(
    `SELECT * FROM change_workflow WHERE discord_forumid = :t LIMIT 1`,
    { t: String(threadId) }
  );
  return rows.length ? rows[0] : null;
}

/** Get just the numeric status code for a thread. */
async function getStatusCodeByThread(threadId) {
  const row = await getWorkflowRowByThread(threadId);
  return row ? Number(row.status) : null;
}

/**
 * Update the status for a given thread and record the acting staff member (VATCAR user_cid).
 * @param {string} threadId - Discord thread/channel id
 * @param {number|string} status - numeric code or status name
 * @param {number|null} actorCid - VATCAR user_cid to log (nullable)
 * @returns { ok:boolean, code:number, affected:number }
 */
async function setStatusByThread(threadId, status, actorCid) {
  const code = typeof status === 'number' ? status : (nameToCode(status) ?? 0);

  const res = await query(
    `UPDATE change_workflow
        SET status = :s,
            staff_member = :actor,
            updated_at = NOW()
      WHERE discord_forumid = :t`,
    {
      s: code,
      actor: actorCid ?? null,
      t: String(threadId),
    }
  );

  const affected = res.affectedRows ?? 0;
  return { ok: affected > 0, code, affected };
}

module.exports = {
  STATUS_MAP,
  codeToName,
  nameToCode,
  isFinalStatus,
  nextStatus,
  ensureWorkflowForThread,
  getWorkflowRowByThread,
  getStatusCodeByThread,
  setStatusByThread,
  resolveUserCidByDiscord,
};
