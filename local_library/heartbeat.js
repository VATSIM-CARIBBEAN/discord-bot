// local_library/heartbeat.js
const https = require('https');
function ping(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      // Drain & ignore body
      res.on('data', () => {});
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(new Error('timeout')); });
  });
}

function startHeartbeat(url, intervalMs = 60000) {
  if (!url) return { stop: () => {} };
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    try { await ping(url); } catch (_) {}
  };
  // First ping soon after boot, then every interval
  const timer = setInterval(tick, intervalMs);
  setTimeout(tick, 3000);

  const stop = () => { stopped = true; clearInterval(timer); };
  // Clean shutdown
  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => { stop(); process.exit(0); });
  }
  return { stop };
}

module.exports = { startHeartbeat };
