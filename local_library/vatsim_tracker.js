// local_library/vatsim_tracker.js
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const VATSIM_DATA_URL = 'https://data.vatsim.net/v3/vatsim-data.json';
const CHANNEL_ID = '1423619321267093504';
const POLL_INTERVAL = 2000; // 2 seconds

// Position name mapping
const POSITION_NAMES = {
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
  'MUHA_APP': 'Havana Approach',
  'MUCU_APP': 'Santiago Approach',
  'MUVR_APP': 'Varadero Approach',
  'MUHA_TWR': 'Havana Tower',
  'MUHA_GND': 'Havana Ground',
  'MUCU_TWR': 'Santiago Tower',
  'MUCU_GND': 'Santiago Ground',
  'MUVR_TWR': 'Varadero Tower',
  'MUVR_GND': 'Varadero Ground',
  'MUCC_TWR': 'Cayo Coco Tower',
  'MUCC_GND': 'Cayo Coco Ground',
  'MUCL_TWR': 'Cayo Largo Tower',
  'MUCL_GND': 'Cayo Largo Ground',
  'MUCF_TWR': 'Cienfuegos Tower',
  'MUCF_GND': 'Cienfuegos Ground',
  'MUCM_TWR': 'Camaguey Tower',
  'MUCM_GND': 'Camaguey Ground',
  'MUHG_TWR': 'Holguin Tower',
  'MUHG_GND': 'Holguin Ground',
  'MUSC_TWR': 'Santiago Tower',
  'MUSC_GND': 'Santiago Ground',
  
  // Kingston
  'MKJK_CTR': 'Kingston Radar',
  'MKJP_APP': 'Manley Approach',
  'MKJS_APP': 'Sangster Approach',
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
  'MBPV_APP': 'Providenciales Approach',
  'MYNN_TWR': 'Nassau Tower',
  'MYNN_GND': 'Nassau Ground',
  'MYGF_TWR': 'Freeport Tower',
  'MYGF_GND': 'Freeport Ground',
  'MBPV_TWR': 'Providenciales Tower',
  'MBPV_GND': 'Providenciales Ground',
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
  'TGPY_APP': 'Grenada Approach',
  'TVSA_APP': 'St. Vincent Approach',
  'TBPB_APP': 'Barbados Approach',
  'TFFR_APP': 'Guadeloupe Approach',
  'TFFF_APP': 'Martinique Approach',
  'TLPL_APP': 'St. Lucia Approach',
  'TAPA_APP': 'Antigua Approach',
  'TKPK_APP': 'St. Kitts Approach',
  'TTPP_TWR': 'Piarco Tower',
  'TTPP_GND': 'Piarco Ground',
  'TTCP_TWR': 'Tobago Tower',
  'TTCP_GND': 'Tobago Ground',
  'TGPY_TWR': 'Grenada Tower',
  'TGPY_GND': 'Grenada Ground',
  'TVSA_TWR': 'St. Vincent Tower',
  'TVSA_GND': 'St. Vincent Ground',
  'TVSC_TWR': 'Canouan Tower',
  'TVSC_GND': 'Canouan Ground',
  'TBPB_TWR': 'Barbados Tower',
  'TBPB_GND': 'Barbados Ground',
  'TFFR_TWR': 'Guadeloupe Tower',
  'TFFR_GND': 'Guadeloupe Ground',
  'TDPD_TWR': 'Dominica Tower',
  'TDPD_GND': 'Dominica Ground',
  'TFFF_TWR': 'Martinique Tower',
  'TFFF_GND': 'Martinique Ground',
  'TLPL_TWR': 'St. Lucia Tower',
  'TLPL_GND': 'St. Lucia Ground',
  'TLPC_TWR': 'Castries Tower',
  'TLPC_GND': 'Castries Ground',
  'TAPA_TWR': 'Antigua Tower',
  'TAPA_GND': 'Antigua Ground',
  'TKPK_TWR': 'St. Kitts Tower',
  'TKPK_GND': 'St. Kitts Ground',
  'TKPN_TWR': 'Nevis Tower',
  'TKPN_GND': 'Nevis Ground',
};

// In-memory storage for active controllers
const activeControllers = new Map();

/**
 * Normalize callsign by removing _I_ or _2_ etc
 */
function normalizeCallsign(callsign) {
  return callsign.replace(/_[I0-9]_/g, '_');
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
 */
function formatDuration(startTime) {
  const start = new Date(startTime);
  const end = new Date();
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
 * Create logon embed
 */
function createLogonEmbed(controller) {
  const positionName = getPositionName(controller.callsign);
  const userName = controller.name || 'Unknown';
  
  return new EmbedBuilder()
    .setTitle(`${positionName} is now online.`)
    .setDescription(`${userName} started controlling ${positionName}.`)
    .setColor('#29b473')
    .setTimestamp();
}

/**
 * Create logoff embed
 */
function createLogoffEmbed(controller, startTime) {
  const positionName = getPositionName(controller.callsign);
  const userName = controller.name || 'Unknown';
  const duration = formatDuration(startTime);
  
  return new EmbedBuilder()
    .setTitle(`${positionName} is now offline.`)
    .setDescription(`${userName} stopped controlling ${positionName}.\n\n**Session Duration:** ${duration}`)
    .setColor('#e53935')
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
    const currentControllers = new Map();
    
    // Find controllers on tracked positions
    for (const controller of data.controllers) {
      const normalized = normalizeCallsign(controller.callsign);
      
      if (trackedPositions.includes(normalized)) {
        currentControllers.set(normalized, controller);
      }
    }
    
    // Check for new logons
    for (const [callsign, controller] of currentControllers) {
      if (!activeControllers.has(callsign)) {
        // New controller logged on
        const embed = createLogonEmbed(controller);
        const message = await channel.send({ embeds: [embed] });
        
        activeControllers.set(callsign, {
          controller,
          messageId: message.id,
          logonTime: controller.logon_time,
        });
        
        console.log(`✈️ ${controller.name} logged on to ${callsign}`);
      }
    }
    
    // Check for logoffs
    for (const [callsign, data] of activeControllers) {
      if (!currentControllers.has(callsign)) {
        // Controller logged off
        try {
          const message = await channel.messages.fetch(data.messageId);
          const embed = createLogoffEmbed(data.controller, data.logonTime);
          await message.edit({ embeds: [embed] });
          
          console.log(`✈️ ${data.controller.name} logged off from ${callsign}`);
        } catch (err) {
          console.error('Failed to update logoff message:', err.message);
        }
        
        activeControllers.delete(callsign);
      }
    }
    
  } catch (err) {
    console.error('VATSIM tracker error:', err.message);
  }
}

/**
 * Start the tracker
 */
function startTracker(client) {
  console.log('🛫 VATSIM controller tracker started');
  
  // Initial check after 5 seconds
  setTimeout(() => checkControllers(client), 5000);
  
  // Then poll every interval
  const interval = setInterval(() => checkControllers(client), POLL_INTERVAL);
  
  return {
    stop: () => {
      clearInterval(interval);
      console.log('🛬 VATSIM controller tracker stopped');
    }
  };
}

module.exports = { startTracker };