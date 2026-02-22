// guilds/vatcar/services/vatsim-tracker.js
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const VATSIM_DATA_URL = 'https://data.vatsim.net/v3/vatsim-data.json';
const CHANNEL_ID = process.env.VATCAR_TRACKER_CHANNEL_ID;
const POLL_INTERVAL = 2000; // 2 seconds
const STATE_FILE = path.join(__dirname, '../data/vatsim_state.json');
const OBSERVER_FREQUENCY = '199.998';

// Position name mapping
const POSITION_NAMES = {
  // Caribbean
  'CARI_FSS': 'Caribbean Control',

  // Curacao
  'ANT_CTR': 'Antilles Center',
  'TNCF_CTR': 'Curacao Control',
  'TNCA_APP': 'Aruba Approach',
  'TNCF_APP': 'Curacao Terminal',
  'TNCA_TWR': 'Beatrix Tower',
  'TNCA_GND': 'Beatrix Ground',
  'TNCA_RMP': 'Beatrix Apron',
  'TNCB_TWR': 'Flamingo Tower',
  'TNCB_GND': 'Flamingo Ground',
  'TNCC_TWR': 'Hato Tower',
  'TNCC_GND': 'Hato Ground',
  
  // Havana
  'MUFH_CTR': 'Havana Center',
  'MUHA_APP': 'Havana Terminal',
  'MUCU_APP': 'Santiago Terminal',
  'MUSC_APP': 'Santa Clara Terminal',
  'MUCM_APP': 'Camaguey Terminal',
  'MUVR_APP': 'Varadero Approach',
  'MUCC_APP': 'Jardines Approach',
  'MUHA_TWR': 'Marti Tower',
  'MUHA_GND': 'Marti Ground',
  'MUCU_TWR': 'Maceo Tower',
  'MUVR_TWR': 'Varadero Tower',
  'MUCC_TWR': 'Jardines Tower',
  'MUCL_TWR': 'Cayo Largo Tower',
  'MUCF_TWR': 'Cienfuegos Tower',
  'MUCM_TWR': 'Agramonte Tower',
  'MUHG_TWR': 'Holguin Tower',
  'MUSC_TWR': 'Santa Clara Tower',
  'MUBA_TWR': 'Baracoa Tower',
  'MUGT_TWR': 'Guantanamo Tower',
  'MUMZ_TWR': 'Manzanillo Tower',
  'MUNG_TWR': 'Gerona Tower',
  'MUPB_TWR': 'Playa Baracoa Tower',
  
  // Kingston
  'MKJK_CTR': 'Kingston Radar',
  'MKJP_APP': 'Manley Radar',
  'MKJS_APP': 'Sangster Radar',
  'MWCR_APP': 'Cayman Approach',
  'MKJP_TWR': 'Manley Tower',
  'MKJP_GND': 'Manley Ground',
  'MKJS_TWR': 'Sangster Tower',
  'MKJS_GND': 'Sangster Ground',
  'MWCR_TWR': 'Owen Roberts Tower',
  'MWCR_GND': 'Owen Roberts Ground',
  'MWCB_TWR': 'Brac Tower',
  'MWCB_GND': 'Brac Ground',
  
  // Nassau
  'ZMO_CTR':  'Miami Center',
  'MYNN_APP': 'Nassau Approach',
  'MYGF_APP': 'Freeport Approach',
  'MBPV_APP': 'Provo Approach',
  'MYNN_TWR': 'Nassau Tower',
  'MYNN_GND': 'Nassau Ground',
  'MYGF_TWR': 'Freeport Tower',
  'MYGF_GND': 'Freeport Ground',
  'MBPV_TWR': 'Provo Tower',
  'MBPV_GND': 'Provo Ground',
  'MBPV_DEL': 'Provo Delivery',
  'MBGT_TWR': 'Grand Turk Tower',
  'MBGT_GND': 'Grand Turk Ground',
  
  // Port-au-Prince
  'MTEG_CTR': 'Port-au-Prince Center',
  'MTPP_APP': 'Port-au-Prince Approach',
  'MTPP_TWR': 'Port-au-Prince Tower',
  'MTPP_GND': 'Port-au-Prince Ground',
  'MTCH_TWR': 'Cap-Haitien Tower',
  'MTCH_GND': 'Cap-Haitien Ground',
  
  // San Juan
  'SJU_CTR': 'San Juan Center',
  'SJU_APP': 'San Juan Approach',
  'TNCM_APP': 'Juliana Approach',
  'SJU_TWR': 'San Juan Tower',
  'SJU_GND': 'San Juan Ground',
  'SJU_DEL': 'San Juan Delivery',
  'TJIG_TWR': 'Isla Grande Tower',
  'TJIG_GND': 'Isla Grande Ground',
  'TJBQ_TWR': 'Aguadilla Tower',
  'TJBQ_GND': 'Aguadilla Ground',
  'TIST_TWR': 'St. Thomas Tower',
  'TIST_GND': 'St. Thomas Ground',
  'TISX_TWR': 'St. Croix Tower',
  'TISX_GND': 'St. Croix Ground',
  'TUPJ_TWR': 'Beef Island Tower',
  'TUPJ_GND': 'Beef Island Ground',
  'TNCM_TWR': 'Juliana Tower',
  'TNCM_GND': 'Juliana Ground',
  'TNCM_DEL': 'Juliana Delivery',
  'TQPF_TWR': 'CJ Lloyd Tower',
  'TJSJ_TWR': 'San Juan Tower',
  'TJSJ_GND': 'San Juan Ground',
  
  // Santo Domingo
  'MDCS_CTR': 'Santo Domingo Control',
  'MDPC_APP': 'Punta Cana Approach',
  'MDSD_APP': 'Santo Domingo Approach',
  'MDPP_APP': 'Puerto Plata Approach',
  'MDJB_TWR': 'La Isabela Tower',
  'MDJB_GND': 'La Isabela Ground',
  'MDBH_TWR': 'Barahona Tower',
  'MDBH_GND': 'Barahona Ground',
  'MDPC_TWR': 'Punta Cana Tower',
  'MDPC_GND': 'Punta Cana Ground',
  'MDSD_TWR': 'Santo Domingo Tower',
  'MDSD_GND': 'Santo Domingo Ground',
  'MDLR_TWR': 'La Romana Tower',
  'MDLR_GND': 'La Romana Ground',
  'MDPP_TWR': 'Puerto Plata Tower',
  'MDPP_GND': 'Puerto Plata Ground',
  'MDCY_TWR': 'Samana Tower',
  'MDCY_GND': 'Samana Ground',
  'MDST_TWR': 'Santiago Tower',
  'MDST_GND': 'Santiago Ground',
  
  // Piarco
  'TTZO_FSS': 'Trinidad Flight Service',
  'TTZP_CTR': 'Piarco Center',
  'TTPP_APP': 'Piarco Approach',
  'TGPY_APP': 'Maurice Bishop Approach',
  'TVSA_APP': 'Argyle Approach',
  'TBPB_APP': 'Adams Approach',
  'TFFR_APP': 'Raizet Approach',
  'TFFF_APP': 'Martinique Approach',
  'TLPL_APP': 'St. Lucia Approach',
  'TAPA_APP': 'VC Bird Approach',
  'TKPK_APP': 'Bradshaw Approach',
  'TTPP_TWR': 'Piarco Tower',
  'TTPP_GND': 'Piarco Ground',
  'TTCP_TWR': 'Tobago Tower',
  'TTCP_GND': 'Tobago Ground',
  'TGPY_TWR': 'Maurice Bishop Tower',
  'TGPY_GND': 'Maurice Bishop Ground',
  'TVSA_TWR': 'Argyle Tower',
  'TVSA_GND': 'Argyle Ground',
  'TVSC_TWR': 'Canouan Tower',
  'TVSC_GND': 'Canouan Ground',
  'TBPB_TWR': 'Adams Tower',
  'TBPB_GND': 'Adams Ground',
  'TFFR_TWR': 'Raizet Tower',
  'TFFR_GND': 'Raizet Ground',
  'TDPD_TWR': 'Dominica Tower',
  'TDPD_GND': 'Dominica Ground',
  'TFFF_TWR': 'Martinique Tower',
  'TFFF_GND': 'Martinique Ground',
  'TLPL_TWR': 'St. Lucia Tower',
  'TLPL_GND': 'St. Lucia Ground',
  'TLPC_TWR': 'Castries Tower',
  'TLPC_GND': 'Castries Ground',
  'TAPA_TWR': 'VC Bird Tower',
  'TAPA_GND': 'VC Bird Ground',
  'TKPK_TWR': 'Bradshaw Tower',
  'TKPK_GND': 'Bradshaw Ground',
  'TKPN_TWR': 'Nevis Tower',
  'TKPN_GND': 'Nevis Ground',
  'TTZO_FSS': 'Piarco Oceanic'
};

// Active positions: normalized callsign -> { messageId, controllers: Map(actualCallsign -> {controller, logonTime}) }
const activePositions = new Map();

/**
 * Load state from file
 */
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        // Convert controllers object back to Map
        const controllersMap = new Map(Object.entries(value.controllers || {}));
        activePositions.set(key, {
          messageId: value.messageId,
          controllers: controllersMap,
          positionLogonTime: value.positionLogonTime
        });
      }
      console.log(`📁 Loaded ${activePositions.size} active position(s) from state file`);
    }
  } catch (err) {
    console.warn('Could not load VATSIM state:', err.message);
  }
}

/**
 * Save state to file
 */
function saveState() {
  try {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Convert Map to plain object for JSON
    const data = {};
    for (const [key, value] of activePositions) {
      data[key] = {
        messageId: value.messageId,
        controllers: Object.fromEntries(value.controllers),
        positionLogonTime: value.positionLogonTime
      };
    }
    
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Could not save VATSIM state:', err.message);
  }
}

/**
 * Normalize callsign by removing _I_, _A_, _2_, _62_, etc.
 * Matches patterns like _X_ where X is one or more letters/digits
 */
function normalizeCallsign(callsign) {
  return callsign.replace(/_[A-Z0-9]*_/g, '_');
}

/**
 * Get position name from callsign
 */
function getPositionName(callsign) {
  const normalized = normalizeCallsign(callsign);
  return POSITION_NAMES[normalized] || callsign;
}

/**
 * Format duration in hours and minutes
 * @param {string} startTime - ISO timestamp of start
 * @param {string} endTime - ISO timestamp of end (optional, defaults to now)
 */
function formatDuration(startTime, endTime = null) {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Check if controller is in observer mode
 */
function isObserver(controller) {
  return controller.frequency === OBSERVER_FREQUENCY;
}

/**
 * Create or update embed for a position
 */
function createPositionEmbed(normalizedCallsign, positionData) {
  const positionName = getPositionName(normalizedCallsign);
  const controllers = Array.from(positionData.controllers.values());
  
  // Separate online and offline controllers
  const onlineControllers = controllers.filter(c => !c.logoffTime);
  const offlineControllers = controllers.filter(c => c.logoffTime);
  
  const isOnline = onlineControllers.length > 0;
  const title = `[${normalizedCallsign}] ${positionName} is now ${isOnline ? 'online' : 'offline'}.`;
  const color = isOnline ? '#29b473' : '#e53935';
  
  let description = '';
  
  // Add online controllers
  for (const ctrlData of onlineControllers) {
    const userName = ctrlData.controller.name || 'Unknown';
    const actualCallsign = ctrlData.controller.callsign;
    description += `${userName} started controlling ${positionName} (${actualCallsign}).\n`;
  }
  
  // Add offline controllers
  for (const ctrlData of offlineControllers) {
    const userName = ctrlData.controller.name || 'Unknown';
    const actualCallsign = ctrlData.controller.callsign;
    const duration = formatDuration(ctrlData.logonTime, ctrlData.logoffTime);
    description += `${userName} stopped controlling ${positionName} (${actualCallsign}). Session Duration: ${duration}\n`;
  }
  
  // Only add total session duration if:
  // 1. All controllers are offline AND
  // 2. There were multiple controllers (more than 1)
  if (!isOnline && positionData.positionLogonTime && controllers.length > 1) {
    const totalDuration = formatDuration(positionData.positionLogonTime);
    description += `\n**Total Session Duration:** ${totalDuration}`;
  }
  
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description.trim())
    .setColor(color)
    .setTimestamp();
}

/**
 * Fetch and process VATSIM data
 */
async function checkControllers(client) {
  try {
    const response = await axios.get(VATSIM_DATA_URL, { timeout: 5000 });
    const data = response.data;
    
    if (!data || !data.controllers) {
      console.warn('Invalid VATSIM data structure');
      return;
    }
    
    const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
    if (!channel) {
      console.warn('Controller tracking channel not found');
      return;
    }
    
    // Get tracked positions from our mapping
    const trackedPositions = Object.keys(POSITION_NAMES);
    const currentOnlinePositions = new Map(); // normalized -> [controllers]
    
    // Find controllers on tracked positions (excluding observers)
    for (const controller of data.controllers) {
      if (isObserver(controller)) continue;
      
      const normalized = normalizeCallsign(controller.callsign);
      
      if (trackedPositions.includes(normalized)) {
        if (!currentOnlinePositions.has(normalized)) {
          currentOnlinePositions.set(normalized, []);
        }
        currentOnlinePositions.get(normalized).push(controller);
      }
    }
    
    // Check for new logons or position updates
    for (const [normalizedCallsign, controllers] of currentOnlinePositions) {
      let positionData = activePositions.get(normalizedCallsign);
      let hasNewControllers = false;
      
      if (!positionData) {
        // New position coming online
        positionData = {
          messageId: null,
          controllers: new Map(),
          positionLogonTime: new Date().toISOString()
        };
        activePositions.set(normalizedCallsign, positionData);
        hasNewControllers = true;
      }
      
      // Check each controller on this position
      for (const controller of controllers) {
        const actualCallsign = controller.callsign;
        const existingController = positionData.controllers.get(actualCallsign);

        // Detect if this is a new controller or a different controller on same callsign
        // Use CID for comparison (most reliable), fall back to name if CID unavailable
        const existingId = existingController?.controller.cid || existingController?.controller.name;
        const currentId = controller.cid || controller.name;
        const isDifferentController = existingController &&
                                       !existingController.logoffTime &&
                                       existingId !== currentId;

        if (isDifferentController) {
          // Different controller took over the same position - mark previous as logged off
          existingController.logoffTime = new Date().toISOString();
          hasNewControllers = true;
          console.log(`✈️ ${existingController.controller.name} logged off from ${actualCallsign} (handover to ${controller.name})`);
        }

        if (!existingController || existingController.logoffTime || isDifferentController) {
          // New controller on this position OR controller logging back on after logging off
          positionData.controllers.set(actualCallsign, {
            controller: controller,
            logonTime: controller.logon_time,
            logoffTime: null
          });

          hasNewControllers = true;
          console.log(`✈️ ${controller.name} logged on to ${actualCallsign} (${normalizedCallsign})`);
        }
      }
      
      // Update or create message (always update if there are changes)
      if (hasNewControllers) {
        const embed = createPositionEmbed(normalizedCallsign, positionData);
        
        if (positionData.messageId) {
          // Update existing message
          try {
            const message = await channel.messages.fetch(positionData.messageId);
            await message.edit({ embeds: [embed] });
          } catch (err) {
            // Message was deleted, create new one
            const message = await channel.send({ embeds: [embed] });
            positionData.messageId = message.id;
          }
        } else {
          // Create new message
          const message = await channel.send({ embeds: [embed] });
          positionData.messageId = message.id;
        }
        
        saveState();
      }
    }
    
    // Check for logoffs
    for (const [normalizedCallsign, positionData] of activePositions) {
      const currentControllers = currentOnlinePositions.get(normalizedCallsign) || [];
      // Build a set of current controller CIDs on this position
      const currentControllerCids = new Set(currentControllers.map(c => c.cid));

      let hasChanges = false;

      // Mark controllers as logged off if they're not in current data
      for (const [actualCallsign, ctrlData] of positionData.controllers) {
        // Check if this specific controller (by CID) is still online
        const controllerStillOnline = currentControllerCids.has(ctrlData.controller.cid);

        if (!controllerStillOnline && !ctrlData.logoffTime) {
          ctrlData.logoffTime = new Date().toISOString();
          hasChanges = true;
          console.log(`✈️ ${ctrlData.controller.name} logged off from ${actualCallsign} (${normalizedCallsign})`);
        }
      }
      
      if (hasChanges) {
        // Update the message
        const embed = createPositionEmbed(normalizedCallsign, positionData);
        
        try {
          const message = await channel.messages.fetch(positionData.messageId);
          await message.edit({ embeds: [embed] });
        } catch (err) {
          console.error('Failed to update logoff message:', err.message);
        }
        
        // If all controllers are offline, remove from active positions after updating
        const allOffline = Array.from(positionData.controllers.values()).every(c => c.logoffTime);
        if (allOffline) {
          activePositions.delete(normalizedCallsign);
        }
        
        saveState();
      }
    }
    
  } catch (err) {
    // Silently handle VATSIM API errors (network timeouts, rate limits, etc.)
    // These are expected and don't affect bot functionality
  }
}

/**
 * Start the tracker
 */
function startTracker(client) {
  console.log('🛫 VATSIM controller tracker started');
  
  // Load previous state
  loadState();
  
  // Initial check after 5 seconds
  setTimeout(() => checkControllers(client), 5000);
  
  // Then poll every interval
  const interval = setInterval(() => checkControllers(client), POLL_INTERVAL);
  
  return {
    stop: () => {
      clearInterval(interval);
      saveState();
      console.log('🛬 VATSIM controller tracker stopped');
    }
  };
}

module.exports = { startTracker };