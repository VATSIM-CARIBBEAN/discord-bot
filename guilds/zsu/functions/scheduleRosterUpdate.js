// guilds/zsu/functions/scheduleRosterUpdate.js
let isExecuting = false;
let isInitialized = false;

// VATSIM rate limiter (max 6 requests/minute, 4s minimum between requests)
const vatsimRateLimiter = {
  lastRequest: 0,
  requestCount: 0,
  lastMinute: 0,
  async makeRequest(url) {
    const now = Date.now();

    if (now - this.lastMinute >= 60000) {
      this.requestCount = 0;
      this.lastMinute = now;
    }

    if (this.requestCount >= 6) {
      const waitTime = 60000 - (now - this.lastMinute);
      console.log(`[zsu] Waiting ${Math.ceil(waitTime / 1000)}s for VATSIM API rate limit...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastMinute = Date.now();
    }

    if (this.lastRequest) {
      const timeSinceLastRequest = now - this.lastRequest;
      if (timeSinceLastRequest < 4000) {
        await new Promise(resolve => setTimeout(resolve, 4000 - timeSinceLastRequest));
      }
    }

    this.requestCount++;
    this.lastRequest = Date.now();
    const response = await fetch(url);
    return response;
  },
};

async function performRosterUpdate(guild) {
  if (isExecuting) {
    throw new Error('A roster sync is already in progress');
  }
  isExecuting = true;

  try {
    const facility = process.env.ZSU_FACILITY_NAME;

    const ratingRoles = {
      1: process.env.ZSU_OBS_ROLE_ID,
      2: process.env.ZSU_S1_ROLE_ID,
      3: process.env.ZSU_S2_ROLE_ID,
      4: process.env.ZSU_S3_ROLE_ID,
      5: process.env.ZSU_C1_ROLE_ID,
      7: process.env.ZSU_C3_ROLE_ID,
      8: process.env.ZSU_I1_ROLE_ID,
      10: process.env.ZSU_I3_ROLE_ID,
      11: process.env.ZSU_SUP_ROLE_ID,
      12: process.env.ZSU_ADM_ROLE_ID,
    };

    const ratingNames = {
      1: 'OBS', 2: 'S1', 3: 'S2', 4: 'S3', 5: 'C1',
      7: 'C3', 8: 'I1', 10: 'I3', 11: 'SUP', 12: 'ADM',
    };

    const stats = {
      total: 0,
      processed: 0,
      skipped: 0,
      wouldUpdate: 0,
      noChangesNeeded: 0,
    };

    // Fetch VATCAR roster data
    const response = await fetch(
      `https://vatcar.net/api/v2/facility/roster?api_key=${process.env.ZSU_API_KEY}`,
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to fetch VATCAR roster');
    }

    // Create map of Discord IDs to controller data
    const controllerMap = new Map();

    data.data.controllers.forEach(controller => {
      const discordId = controller.integrations.find(i => i.type === 1)?.value;
      if (discordId) {
        controllerMap.set(discordId, {
          cid: controller.cid,
          rating: controller.rating,
          isVisitor: false,
          isVATCAR: true,
        });
      }
    });

    data.data.visitors.forEach(visitor => {
      const discordId = visitor.integrations.find(i => i.type === 1)?.value;
      if (discordId) {
        controllerMap.set(discordId, {
          cid: visitor.cid,
          rating: visitor.rating,
          isVisitor: true,
          isVATCAR: true,
        });
      }
    });

    const members = await guild.members.fetch();
    stats.total = members.size;

    console.log(`[zsu] Starting roster audit for ${members.size} members...`);

    for (const [memberId, member] of members) {
      try {
        const vatsimResponse = await vatsimRateLimiter.makeRequest(
          `https://api.vatsim.net/v2/members/discord/${memberId}`,
        );
        const vatsimData = await vatsimResponse.json();

        if (!vatsimData.user_id) {
          stats.skipped++;
          continue;
        }

        const [vatcarResponse, ratingResponse] = await Promise.all([
          fetch(`https://vatcar.net/api/v2/user/${vatsimData.user_id}?api_key=${process.env.ZSU_API_KEY}`),
          vatsimRateLimiter.makeRequest(`https://api.vatsim.net/v2/members/${vatsimData.user_id}`),
        ]);

        const [vatcarData, ratingData] = await Promise.all([
          vatcarResponse.json(),
          ratingResponse.json(),
        ]);

        if (!vatcarData.success) {
          console.log(`[zsu] Failed to fetch VATCAR data for ${member.user.tag}`);
          continue;
        }

        // Determine required roles
        const requiredRoles = new Set();
        requiredRoles.add(process.env.ZSU_VERIFIED_VATSIM_USER_ROLE_ID);

        const neighboringFacilities = (process.env.ZSU_NEIGHBORING_FACILITIES || '').split(',').map(f => f.trim());

        const isHomeController = vatcarData.data.fir && vatcarData.data.fir.name_short === facility;
        const isVisitingController = vatcarData.data.visiting_facilities.some(
          f => f.fir.name_short === facility,
        );
        const isNeighboringController =
          (vatcarData.data.fir && neighboringFacilities.includes(vatcarData.data.fir.name_short)) ||
          vatcarData.data.visiting_facilities.some(f =>
            neighboringFacilities.includes(f.fir.name_short),
          );

        if (isHomeController) {
          requiredRoles.add(process.env.ZSU_FACILITY_CONTROLLER_ROLE_ID);
        } else if (isVisitingController) {
          requiredRoles.add(process.env.ZSU_VISITING_CONTROLLER_ROLE_ID);
        } else if (isNeighboringController) {
          requiredRoles.add(process.env.ZSU_NEIGHBORING_FACILITY_CONTROLLER_ROLE_ID);
        }

        // Handle rating role
        const userRating = ratingData.rating;
        if (userRating in ratingRoles) {
          requiredRoles.add(ratingRoles[userRating]);
        }

        // Compare current roles with required roles
        const currentRoles = member.roles.cache;
        const rolesToAdd = [...requiredRoles].filter(roleId => !currentRoles.has(roleId));
        const rolesToRemove = [...currentRoles.keys()].filter(
          roleId =>
            [
              process.env.ZSU_VERIFIED_VATSIM_USER_ROLE_ID,
              process.env.ZSU_FACILITY_CONTROLLER_ROLE_ID,
              process.env.ZSU_VISITING_CONTROLLER_ROLE_ID,
              process.env.ZSU_NEIGHBORING_FACILITY_CONTROLLER_ROLE_ID,
              ...Object.values(ratingRoles),
            ].includes(roleId) && !requiredRoles.has(roleId),
        );

        if (rolesToAdd.length > 0 || rolesToRemove.length > 0) {
          if (rolesToAdd.length > 0) {
            await member.roles.add(rolesToAdd);
          }
          if (rolesToRemove.length > 0) {
            await member.roles.remove(rolesToRemove);
          }
          stats.wouldUpdate++;
        } else {
          stats.noChangesNeeded++;
        }

        stats.processed++;
      } catch (error) {
        console.error(`[zsu] Error processing member ${memberId}:`, error.message);
        stats.skipped++;
        continue;
      }
    }

    console.log('[zsu] Roster Audit Summary:');
    console.log(`  Total members: ${stats.total}`);
    console.log(`  Processed: ${stats.processed}`);
    console.log(`  No changes needed: ${stats.noChangesNeeded}`);
    console.log(`  Skipped: ${stats.skipped}`);
    console.log(`  Updated: ${stats.wouldUpdate}`);
  } catch (error) {
    console.error('[zsu] Error in roster update:', error);
    throw error;
  } finally {
    isExecuting = false;
  }
}

function scheduleRosterUpdate(client) {
  if (isInitialized) return null;
  isInitialized = true;

  if (process.env.ZSU_ROSTER_UPDATE_ENABLED !== 'true') {
    console.log('[zsu] Roster updates are disabled in configuration');
    return null;
  }

  const targetHour = parseInt(process.env.ZSU_ROSTER_UPDATE_HOUR);
  const targetMinute = parseInt(process.env.ZSU_ROSTER_UPDATE_MINUTE);

  console.log(`[zsu] Initializing roster update scheduler...`);
  console.log(`[zsu] Next update scheduled for ${targetHour}:${String(targetMinute).padStart(2, '0')} ET`);

  const interval = setInterval(() => {
    const now = new Date();
    const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

    if (
      etTime.getHours() === targetHour &&
      etTime.getMinutes() === targetMinute &&
      !isExecuting
    ) {
      // Find the ZSU guild specifically
      const guild = client.guilds.cache.get(process.env.ZSU_GUILD_ID);
      if (!guild) {
        return;
      }

      console.log(`[zsu] Starting scheduled roster update`);

      performRosterUpdate(guild)
        .catch(error => {
          console.error('[zsu] Error in scheduled roster update:', error);
        });
    }
  }, 60000);

  return interval;
}

module.exports = { scheduleRosterUpdate, performRosterUpdate };
