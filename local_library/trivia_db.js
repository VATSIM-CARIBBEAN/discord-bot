// local_library/trivia_db.js
const fs = require('fs');
const path = require('path');

const TRIVIA_DB_FILE = path.join(__dirname, '../data/trivia_scores.json');

/**
 * Load trivia data from file
 */
function loadTriviaData() {
  try {
    if (fs.existsSync(TRIVIA_DB_FILE)) {
      const data = fs.readFileSync(TRIVIA_DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not load trivia data:', err.message);
  }
  return { scores: [] };
}

/**
 * Save trivia data to file
 */
function saveTriviaData(data) {
  try {
    const dir = path.dirname(TRIVIA_DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TRIVIA_DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Could not save trivia data:', err.message);
  }
}

/**
 * Record a trivia answer
 */
function recordAnswer(userId, displayName, isCorrect, points) {
  try {
    const data = loadTriviaData();
    
    data.scores.push({
      discord_user_id: String(userId),
      display_name: displayName,
      correct: isCorrect,
      points: points,
      answered_at: new Date().toISOString()
    });

    saveTriviaData(data);
    return { ok: true };
  } catch (err) {
    console.error('Error recording trivia answer:', err);
    return { ok: false, error: err };
  }
}

/**
 * Get leaderboard for a time period
 */
function getLeaderboard(period = 'all', limit = 10) {
  try {
    const data = loadTriviaData();
    let scores = data.scores;

    // Filter by time period
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      scores = scores.filter(s => new Date(s.answered_at) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      scores = scores.filter(s => new Date(s.answered_at) >= monthAgo);
    }

    // Aggregate by user
    const userStats = {};
    
    for (const score of scores) {
      const userId = score.discord_user_id;
      
      if (!userStats[userId]) {
        userStats[userId] = {
          discord_user_id: userId,
          display_name: score.display_name,
          total_points: 0,
          correct_answers: 0,
          total_answered: 0
        };
      }

      userStats[userId].total_points += score.points;
      userStats[userId].total_answered += 1;
      if (score.correct) {
        userStats[userId].correct_answers += 1;
      }
    }

    // Convert to array and sort
    const leaderboard = Object.values(userStats);
    leaderboard.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points;
      }
      return b.correct_answers - a.correct_answers;
    });

    return leaderboard.slice(0, limit);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return [];
  }
}

/**
 * Clear leaderboard for a period
 */
function clearLeaderboard(period) {
  try {
    const data = loadTriviaData();
    
    if (period === 'all') {
      // Clear everything
      data.scores = [];
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      data.scores = data.scores.filter(s => new Date(s.answered_at) < weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      data.scores = data.scores.filter(s => new Date(s.answered_at) < monthAgo);
    }

    saveTriviaData(data);
    return { ok: true };
  } catch (err) {
    console.error('Error clearing leaderboard:', err);
    return { ok: false, error: err };
  }
}

/**
 * Get user stats
 */
function getUserStats(userId) {
  try {
    const data = loadTriviaData();
    const userScores = data.scores.filter(s => s.discord_user_id === String(userId));

    const stats = {
      total_points: 0,
      correct_answers: 0,
      total_answered: 0
    };

    for (const score of userScores) {
      stats.total_points += score.points;
      stats.total_answered += 1;
      if (score.correct) {
        stats.correct_answers += 1;
      }
    }

    return stats;
  } catch (err) {
    console.error('Error fetching user stats:', err);
    return { total_points: 0, correct_answers: 0, total_answered: 0 };
  }
}

module.exports = {
  recordAnswer,
  getLeaderboard,
  clearLeaderboard,
  getUserStats
};