const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Load game data
let gamesData = null;
let predictionsData = null;

// Initialize data
async function loadGameData() {
  try {
    const gamesPath = path.join(__dirname, '../data/world-cup-games.json');
    const gamesContent = await fs.readFile(gamesPath, 'utf8');
    gamesData = JSON.parse(gamesContent);
    
    // Generate AI predictions if they don't exist
    if (!predictionsData) {
      predictionsData = await generateAIPredictions(gamesData.games);
    }
  } catch (error) {
    console.error('Error loading game data:', error);
    gamesData = { games: [] };
    predictionsData = [];
  }
}

// Generate AI predictions using OpenAI
async function generateAIPredictions(games) {
  const predictions = [];
  
  for (const game of games) {
    try {
      // Simulate AI prediction (replace with actual OpenAI API call)
      const prediction = await generatePrediction(game);
      predictions.push(prediction);
    } catch (error) {
      console.error(`Error generating prediction for game ${game.gameId}:`, error);
      // Fallback prediction
      predictions.push({
        gameId: game.gameId,
        recommendation: `${game.teams[0]} ML`,
        betType: 'moneyline',
        confidence: Math.floor(Math.random() * 5) + 6, // 6-10
        edge: (Math.random() * 3 + 1).toFixed(1), // 1.0-4.0
        reasoning: 'AI analysis based on team performance and historical data',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return predictions;
}

// Simulate AI prediction generation
async function generatePrediction(game) {
  // This would be replaced with actual OpenAI API call
  const betTypes = ['moneyline', 'spread', 'total'];
  const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
  
  let recommendation = '';
  if (betType === 'moneyline') {
    recommendation = `${game.teams[0]} ML`;
  } else if (betType === 'spread') {
    recommendation = `${game.teams[0]} ${game.spread[game.teams[0]]}`;
  } else {
    recommendation = `Over ${game.total.over}`;
  }
  
  return {
    gameId: game.gameId,
    recommendation,
    betType,
    confidence: Math.floor(Math.random() * 5) + 6, // 6-10
    edge: (Math.random() * 3 + 1).toFixed(1), // 1.0-4.0
    reasoning: `AI analysis suggests ${recommendation} based on recent form, head-to-head records, and team statistics.`,
    timestamp: new Date().toISOString()
  };
}

// Load data on startup
loadGameData();

// GET /api/games - Get all games
router.get('/', async (req, res) => {
  try {
    if (!gamesData) {
      await loadGameData();
    }
    
    const { status, group, date } = req.query;
    let filteredGames = gamesData.games;
    
    // Filter by status
    if (status) {
      filteredGames = filteredGames.filter(game => game.status === status);
    }
    
    // Filter by group
    if (group) {
      filteredGames = filteredGames.filter(game => game.group === group);
    }
    
    // Filter by date
    if (date) {
      filteredGames = filteredGames.filter(game => 
        game.date.startsWith(date)
      );
    }
    
    res.json({
      success: true,
      data: filteredGames,
      count: filteredGames.length
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch games',
      error: error.message
    });
  }
});

// GET /api/games/:gameId - Get specific game
router.get('/:gameId', async (req, res) => {
  try {
    if (!gamesData) {
      await loadGameData();
    }
    
    const { gameId } = req.params;
    const game = gamesData.games.find(g => g.gameId === gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Get prediction for this game
    const prediction = predictionsData.find(p => p.gameId === gameId);
    
    res.json({
      success: true,
      data: {
        ...game,
        prediction
      }
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game',
      error: error.message
    });
  }
});

// GET /api/games/predictions - Get AI predictions
router.get('/predictions', async (req, res) => {
  try {
    if (!predictionsData) {
      await loadGameData();
    }
    
    const { confidence, betType } = req.query;
    let filteredPredictions = predictionsData;
    
    // Filter by confidence level
    if (confidence) {
      const minConfidence = parseInt(confidence);
      filteredPredictions = filteredPredictions.filter(p => p.confidence >= minConfidence);
    }
    
    // Filter by bet type
    if (betType) {
      filteredPredictions = filteredPredictions.filter(p => p.betType === betType);
    }
    
    // Add game details to predictions
    const predictionsWithGames = filteredPredictions.map(prediction => {
      const game = gamesData.games.find(g => g.gameId === prediction.gameId);
      return {
        ...prediction,
        game
      };
    });
    
    res.json({
      success: true,
      data: predictionsWithGames,
      count: predictionsWithGames.length
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch predictions',
      error: error.message
    });
  }
});

// GET /api/games/groups - Get all groups
router.get('/groups', async (req, res) => {
  try {
    if (!gamesData) {
      await loadGameData();
    }
    
    const groups = [...new Set(gamesData.games.map(game => game.group))];
    
    res.json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch groups',
      error: error.message
    });
  }
});

// GET /api/games/upcoming - Get upcoming games
router.get('/upcoming', async (req, res) => {
  try {
    if (!gamesData) {
      await loadGameData();
    }
    
    const now = new Date();
    const upcomingGames = gamesData.games
      .filter(game => new Date(game.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10); // Limit to next 10 games
    
    res.json({
      success: true,
      data: upcomingGames,
      count: upcomingGames.length
    });
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming games',
      error: error.message
    });
  }
});

// POST /api/games/:gameId/simulate - Simulate game result (for testing)
router.post('/:gameId/simulate', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = gamesData.games.find(g => g.gameId === gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    // Simulate game result
    const result = simulateGameResult(game);
    
    // Update game status
    game.status = 'completed';
    game.result = result;
    
    res.json({
      success: true,
      data: {
        gameId,
        result,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Error simulating game:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to simulate game',
      error: error.message
    });
  }
});

// Simulate game result
function simulateGameResult(game) {
  const team1Score = Math.floor(Math.random() * 4);
  const team2Score = Math.floor(Math.random() * 4);
  
  return {
    [game.teams[0]]: team1Score,
    [game.teams[1]]: team2Score,
    total: team1Score + team2Score,
    winner: team1Score > team2Score ? game.teams[0] : 
            team2Score > team1Score ? game.teams[1] : 'Draw'
  };
}

// Refresh data endpoint
router.post('/refresh', async (req, res) => {
  try {
    await loadGameData();
    res.json({
      success: true,
      message: 'Game data refreshed successfully',
      gamesCount: gamesData.games.length,
      predictionsCount: predictionsData.length
    });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh data',
      error: error.message
    });
  }
});

module.exports = router; 