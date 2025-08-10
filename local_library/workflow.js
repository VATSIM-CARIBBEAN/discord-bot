// local_library/workflow.js
// DB helpers + workflow state machine for the VATCAR Discord bot

const { pool } = require('./db');

/* =========================
 * Status map / state machine
 * ========================= */
const STATUS = {
  'INITIAL LEADERSHIP REVIEW': 0,
  'STAFF REVIEW': 1,
  'TECHNICAL TEAM REVIEW': 2,
  'FINAL COMPREHENSIVE REVIEW': 3,
  'APPROVED': 4,
  'VETOED': 5,
  'TABLED': 6,
};

const CODE_TO_NAME = Object.fromEntries(
  Object.entries(STATUS).map(([k, v]) => [v, k])
);

function codeToName(code) {
  return CODE_TO_NAME[Number(code)] ?? null;
}
function nameToCode(name) {
  if (!name) return null;
  const key = String(name).trim().toUpperCase();
  return STATUS[key] ?? null;
}
function isFinalStatus(code) {
  const c = Number(code);
  return c >= 4; // 4=APPROVED, 5=VETOED, 6=TABLED
}
function nextStatus(code) {
  const c = Number(code);
  if (c < 0) return 0;
  if (c >= 3) return 4; // from FINAL COMPREHENSIVE REVIEW -> APPROVED
  return c + 1;
}

/* ======================
 * Basic workflow storage
 * ====================== */

/**
 * Ensure a change_workflow row exists for discord thread.
 * requester is stored as the Discord ownerId (string).
 */
async function ensureWorkflowForThread({ thread, initialRequesterId }) {
  const discordId = String(thread.id);
  const [rows] = await pool.query(
    'SELECT id FROM change_workflow WHERE discord_forumid = ? LIMIT 1',
    [discordId]
  );
  if (rows.length) return rows[0].id;

  const title = thread.name ?? '(untitled)';
  const requester = String(initialRequesterId ?? thread.ownerId ?? '');

  const [res] = await pool.query(
    `INSERT INTO change_workflow
       (discord_forumid, requester, title, description, status, staff_member, created_at, updated_at)
     VALUES (?, ?, ?, '', ?, NULL, NOW(), NOW())`,
    [discordId, requester, title, 0]
  );
  return res.insertId;
}

async function getWorkflowRowByThread(threadId) {
  const [rows] = await pool.query(
    'SELECT * FROM change_workflow WHERE discord_forumid = ? LIMIT 1',
    [String(threadId)]
  );
  return rows[0] ?? null;
}

async function getStatusCodeByThread(threadId) {
  const [rows] = await pool.query(
    'SELECT status FROM change_workflow WHERE discord_forumid = ? LIMIT 1',
    [String(threadId)]
  );
  return rows[0]?.status ?? null;
}

/**
 * Set status and record acting staff_member as a VATCAR CID (user_cid).
 */
async function setStatusByThread(threadId, newStatus, actorCid) {
  try {
    const [res] = await pool.query(
      `UPDATE change_workflow
          SET status = ?, staff_member = ?, updated_at = NOW()
        WHERE discord_forumid = ?`,
      [Number(newStatus), actorCid ?? null, String(threadId)]
    );
    return { ok: res.affectedRows > 0 };
  } catch (e) {
    console.error('setStatusByThread error:', e);
    return { ok: false, error: e };
  }
}

/**
 * Permanently delete the workflow row for a given Discord thread id.
 */
async function deleteWorkflowByThread(threadId) {
  try {
    const [res] = await pool.query(
      'DELETE FROM change_workflow WHERE discord_forumid = ?',
      [String(threadId)]
    );
    return { ok: res.affectedRows > 0 };
  } catch (e) {
    console.error('deleteWorkflowByThread error:', e);
    return { ok: false, error: e };
  }
}

/**
 * Map a Discord user id -> VATCAR user_cid using the integrations table.
 * Assumes: integrations(type=1 for Discord), value = discord user id.
 */
async function resolveUserCidByDiscord(discordUserId) {
  const [rows] = await pool.query(
    `SELECT user_cid
       FROM integrations
      WHERE type = 1 AND value = ?
      ORDER BY id DESC
      LIMIT 1`,
    [String(discordUserId)]
  );
  return rows[0]?.user_cid ?? null;
}

/**
 * Fetch open workflows (status 0..3).
 */
async function getOpenWorkflows(limit = 50) {
  const [rows] = await pool.query(
    `SELECT id, discord_forumid, title, status, updated_at
       FROM change_workflow
      WHERE status IN (0,1,2,3)
      ORDER BY updated_at DESC
      LIMIT ?`,
    [limit]
  );
  return rows || [];
}

module.exports = {
  // state machine
  codeToName,
  nameToCode,
  isFinalStatus,
  nextStatus,

  // storage
  ensureWorkflowForThread,
  getWorkflowRowByThread,
  getStatusCodeByThread,
  setStatusByThread,
  deleteWorkflowByThread,

  // lookups
  resolveUserCidByDiscord,
  getOpenWorkflows,
};
