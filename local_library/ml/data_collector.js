// local_library/ml_data_collector.js
// Collects controller session data for ML analysis

const { createMLPool } = require('./schema');
const { parseISO, getDay, getHours, differenceInMinutes } = require('date-fns');

let mlPool = null;

/**
 * Initialize the data collector with ML database pool
 */
function initializeCollector() {
  if (!mlPool) {
    mlPool = createMLPool();
    console.log('[ML] ML Data Collector initialized');
  }
}

/**
 * Determine facility group from normalized callsign
 * Maps to facility groups as organized in vatsim_tracker.js POSITION_NAMES
 */
function getFacilityFromCallsign(normalizedCallsign) {
  // Caribbean
  if (normalizedCallsign.startsWith('CARI_')) return 'Caribbean';

  // Curacao (ABC Islands - Aruba, Bonaire, Curacao)
  if (normalizedCallsign.startsWith('ANT_')) return 'Curacao';
  if (normalizedCallsign.startsWith('TNCF_')) return 'Curacao';
  if (normalizedCallsign.startsWith('TNCA_')) return 'Curacao';
  if (normalizedCallsign.startsWith('TNCB_')) return 'Curacao';
  if (normalizedCallsign.startsWith('TNCC_')) return 'Curacao';

  // Havana FIR (All Cuban positions)
  if (normalizedCallsign.startsWith('MUFH_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUHA_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUCU_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUSC_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUCM_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUVR_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUCC_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUCL_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUCF_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUHG_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUBA_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUGT_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUMZ_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUNG_')) return 'Havana';
  if (normalizedCallsign.startsWith('MUPB_')) return 'Havana';

  // Kingston FIR (Jamaica and Cayman Islands)
  if (normalizedCallsign.startsWith('MKJK_')) return 'Kingston';
  if (normalizedCallsign.startsWith('MKJP_')) return 'Kingston';
  if (normalizedCallsign.startsWith('MKJS_')) return 'Kingston';
  if (normalizedCallsign.startsWith('MWCR_')) return 'Kingston';
  if (normalizedCallsign.startsWith('MWCB_')) return 'Kingston';

  // Nassau FIR (Bahamas and Turks & Caicos)
  if (normalizedCallsign.startsWith('ZMO_')) return 'Nassau';
  if (normalizedCallsign.startsWith('MYNN_')) return 'Nassau';
  if (normalizedCallsign.startsWith('MYGF_')) return 'Nassau';
  if (normalizedCallsign.startsWith('MBPV_')) return 'Nassau';
  if (normalizedCallsign.startsWith('MBGT_')) return 'Nassau';

  // Port-au-Prince FIR (Haiti)
  if (normalizedCallsign.startsWith('MTEG_')) return 'Port-au-Prince';
  if (normalizedCallsign.startsWith('MTPP_')) return 'Port-au-Prince';
  if (normalizedCallsign.startsWith('MTCH_')) return 'Port-au-Prince';

  // San Juan FIR (Puerto Rico, USVI, BVI, Leeward Islands north)
  if (normalizedCallsign.startsWith('SJU_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TJSJ_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TJIG_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TJBQ_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TIST_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TISX_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TUPJ_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TNCM_')) return 'San Juan';
  if (normalizedCallsign.startsWith('TQPF_')) return 'San Juan';

  // Santo Domingo FIR (Dominican Republic)
  if (normalizedCallsign.startsWith('MDCS_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDPC_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDSD_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDPP_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDJB_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDBH_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDLR_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDCY_')) return 'Santo Domingo';
  if (normalizedCallsign.startsWith('MDST_')) return 'Santo Domingo';

  // Piarco FIR (Trinidad & Tobago, Windward Islands, Leeward Islands south)
  if (normalizedCallsign.startsWith('TTZO_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TTZP_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TTPP_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TTCP_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TGPY_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TVSA_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TVSC_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TBPB_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TFFR_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TDPD_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TFFF_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TLPL_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TLPC_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TAPA_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TKPK_')) return 'Piarco';
  if (normalizedCallsign.startsWith('TKPN_')) return 'Piarco';

  return 'Unknown';
}

/**
 * Get position type from callsign suffix
 */
function getPositionType(normalizedCallsign) {
  if (normalizedCallsign.endsWith('_CTR') || normalizedCallsign.endsWith('_FSS')) return 'CTR';
  if (normalizedCallsign.endsWith('_APP')) return 'APP';
  if (normalizedCallsign.endsWith('_TWR')) return 'TWR';
  if (normalizedCallsign.endsWith('_GND')) return 'GND';
  if (normalizedCallsign.endsWith('_RMP')) return 'RMP';
  return 'OTHER';
}

/**
 * Normalize ISO datetime to MySQL-compatible format
 * Removes excessive microsecond precision (MySQL DATETIME supports no fractional seconds)
 */
function normalizeDateTime(isoString) {
  if (!isoString) return null;

  // Parse the ISO string - handle both ISO 8601 and already-formatted strings
  let date;
  if (isoString instanceof Date) {
    date = isoString;
  } else if (typeof isoString === 'string') {
    // Remove excessive decimal precision if present (> 6 digits after the decimal)
    // This handles cases like 2025-10-23T20:10:22.6092737Z (7 digits)
    const normalizedISO = isoString.replace(/(\.\d{6})\d+/, '$1');
    date = new Date(normalizedISO);
  } else {
    date = new Date(isoString);
  }

  // Validate the date
  if (isNaN(date.getTime())) {
    console.error(`Invalid date string: ${isoString}`);
    return null;
  }

  // Format as MySQL datetime: YYYY-MM-DD HH:MM:SS
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Record a controller session to the database
 * @param {Object} sessionData - Contains controller info and times
 * @param {string} sessionData.callsign - Actual callsign used
 * @param {string} sessionData.normalizedCallsign - Normalized callsign
 * @param {string} sessionData.controllerName - Controller's name
 * @param {string} sessionData.controllerCid - Controller's VATSIM CID
 * @param {string} sessionData.logonTime - ISO timestamp of logon
 * @param {string} sessionData.logoffTime - ISO timestamp of logoff
 */
async function recordSession(sessionData) {
  if (!mlPool) {
    console.warn('[WARNING] ML Data Collector not initialized, skipping session recording');
    return;
  }

  try {
    const logon = parseISO(sessionData.logonTime);
    const logoff = parseISO(sessionData.logoffTime);
    const duration = differenceInMinutes(logoff, logon);
    const dayOfWeek = getDay(logon); // 0 = Sunday, 6 = Saturday
    const hourOfDay = getHours(logon);
    const facility = getFacilityFromCallsign(sessionData.normalizedCallsign);
    const positionType = getPositionType(sessionData.normalizedCallsign);

    // Normalize datetime strings for MySQL compatibility
    const logonTimeFormatted = normalizeDateTime(sessionData.logonTime);
    const logoffTimeFormatted = normalizeDateTime(sessionData.logoffTime);

    const [result] = await mlPool.query(
      `INSERT INTO controller_sessions
        (callsign, normalized_callsign, controller_name, controller_cid,
         facility, position_type, logon_time, logoff_time,
         duration_minutes, day_of_week, hour_of_day)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionData.callsign,
        sessionData.normalizedCallsign,
        sessionData.controllerName || null,
        sessionData.controllerCid || null,
        facility,
        positionType,
        logonTimeFormatted,
        logoffTimeFormatted,
        duration,
        dayOfWeek,
        hourOfDay,
      ]
    );

    console.log(`[ML] Recorded session: ${sessionData.controllerName} at ${facility} (${duration}m)`);
    return { success: true, id: result.insertId };

  } catch (err) {
    console.error('[ERROR] Failed to record session:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Get session statistics for a date range
 */
async function getSessionStats(startDate, endDate) {
  if (!mlPool) return null;

  try {
    const [rows] = await mlPool.query(
      `SELECT
        COUNT(*) as total_sessions,
        COUNT(DISTINCT controller_cid) as unique_controllers,
        COUNT(DISTINCT facility) as unique_facilities,
        AVG(duration_minutes) as avg_duration,
        SUM(duration_minutes) as total_minutes
      FROM controller_sessions
      WHERE logon_time >= ? AND logon_time < ?`,
      [startDate, endDate]
    );

    return rows[0];
  } catch (err) {
    console.error('Error getting session stats:', err.message);
    return null;
  }
}

/**
 * Cleanup - close pool when shutting down
 */
async function closeCollector() {
  if (mlPool) {
    await mlPool.end();
    mlPool = null;
    console.log('[ML] ML Data Collector closed');
  }
}

module.exports = {
  initializeCollector,
  recordSession,
  getSessionStats,
  getFacilityFromCallsign,
  getPositionType,
  normalizeDateTime,
  closeCollector,
};
