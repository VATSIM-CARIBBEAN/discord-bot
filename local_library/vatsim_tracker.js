// local_library/vatsim_tracker.js
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const VATSIM_DATA_URL = 'https://data.vatsim.net/v3/vatsim-data.json';
const CHANNEL_ID = '1423619321267093504';
const POLL_INTERVAL = 2000; // 2 seconds

// Position name mapping
const POSITION_NAMES = {
  'MKJK_CTR': 'Kingston Radar',
  'SJU_CTR': 'San Juan Center',
  'MWCR_TWR': 'Owen Roberts Tower'
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