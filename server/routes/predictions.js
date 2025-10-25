const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Load game data for predictions
let gamesData = null;
let predictionsData = null;

// Initialize data
async function loadData() {
  try {
    const gamesPath = path.join(__dirname, '../data/world-cup-games.json');
    const gamesContent = await fs.readFile(gamesPath, 'utf8');
    gamesData = JSON.parse(gamesContent);
    
    // Generate predictions if they don't exist
    if (!predictionsData) {
      predictionsData = await generatePredictions(gamesData.games);
    }
  } catch (error) {
    console.error('Error loading data for predictions:', error);
    gamesData = { games: [] };
    predictionsData = [];
  }
}

// Generate AI predictions using OpenAI GPT-4o
async function generatePredictions(games) {
  const predictions = [];
  
  for (const game of games) {
    try {
      const prediction = await generateAIPrediction(game);
      predictions.push(prediction);
    } catch (error) {
      console.error(`Error generating prediction for game ${game.gameId}:`, error);
      // Fallback prediction
      predictions.push(createFallbackPrediction(game));
    }
  }
  
  return predictions;
}

// Generate AI prediction using OpenAI
async function generateAIPrediction(game) {
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
    console.log('OpenAI API key not configured, using fallback predictions');
    return createFallbackPrediction(game);
  }

  try {
    // This would be the actual OpenAI API call
    // For now, we'll simulate it
    const prediction = await simulateOpenAIPrediction(game);
    return prediction;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return createFallbackPrediction(game);
  }
}

// Simulate OpenAI prediction (replace with actual API call)
async function simulateOpenAIPrediction(game) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const betTypes = ['moneyline', 'spread', 'total'];
  const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
  
  let recommendation = '';
  let reasoning = '';
  
  if (betType === 'moneyline') {
    const team = Math.random() > 0.5 ? game.teams[0] : game.teams[1];
    recommendation = `${team} ML`;
    reasoning = `AI analysis suggests ${team} has a strong advantage based on recent form and head-to-head records. The moneyline bet offers good value.`;
  } else if (betType === 'spread') {
    const team = game.teams[0];
    const spread = game.spread[team];
    recommendation = `${team} ${spread}`;
    reasoning = `The spread analysis indicates ${team} should cover the ${spread} point spread based on defensive and offensive metrics.`;
  } else {
    const overUnder = Math.random() > 0.5 ? 'Over' : 'Under';
    const total = game.total.over;
    recommendation = `${overUnder} ${total}`;
    reasoning = `Goal-scoring patterns and team statistics suggest this game will go ${overUnder.toLowerCase()} the ${total} goal total.`;
  }
  
  return {
    gameId: game.gameId,
    recommendation,
    betType,
    confidence: Math.floor(Math.random() * 5) + 6, // 6-10
    edge: (Math.random() * 3 + 1).toFixed(1), // 1.0-4.0
    reasoning,
    timestamp: new Date().toISOString(),
    aiModel: 'gpt-4o',
    riskLevel: getRiskLevel(betType),
    expectedValue: (Math.random() * 0.15 + 0.05).toFixed(3) // 5-20% EV
  };
}

// Create fallback prediction
function createFallbackPrediction(game) {
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
    reasoning: 'Analysis based on team performance and historical data',
    timestamp: new Date().toISOString(),
    aiModel: 'fallback',
    riskLevel: getRiskLevel(betType),
    expectedValue: (Math.random() * 0.15 + 0.05).toFixed(3)
  };
}

// Get risk level based on bet type
function getRiskLevel(betType) {
  const riskLevels = {
    'moneyline': 'medium',
    'spread': 'medium',
    'total': 'low'
  };
  return riskLevels[betType] || 'medium';
}

// Load data asynchronously on startup
(async () => {
  await loadData();
  console.log('Predictions service initialized');
  console.log('Predictions data loaded:', predictionsData?.length || 0);
})();

// GET /api/predictions/stats - Get prediction statistics
router.get('/stats', async (req, res) => {
  try {
    if (!predictionsData) {
      await loadData();
    }
    
    const stats = {
      totalPredictions: predictionsData.length,
      averageConfidence: (predictionsData.reduce((sum, p) => sum + p.confidence, 0) / predictionsData.length).toFixed(1),
      averageEdge: (predictionsData.reduce((sum, p) => sum + parseFloat(p.edge), 0) / predictionsData.length).toFixed(1),
      betTypeDistribution: predictionsData.reduce((acc, p) => {
        acc[p.betType] = (acc[p.betType] || 0) + 1;
        return acc;
      }, {}),
      riskLevelDistribution: predictionsData.reduce((acc, p) => {
        acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
        return acc;
      }, {}),
      confidenceDistribution: predictionsData.reduce((acc, p) => {
        acc[p.confidence] = (acc[p.confidence] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching prediction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction stats',
      error: error.message
    });
  }
});

// GET /api/predictions/top - Get top predictions by confidence
router.get('/top', async (req, res) => {
  try {
    if (!predictionsData) {
      await loadData();
    }
    
    const { limit = 5, minConfidence = 8 } = req.query;
    
    const topPredictions = predictionsData
      .filter(p => p.confidence >= parseInt(minConfidence))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, parseInt(limit))
      .map(prediction => {
        const game = gamesData.games.find(g => g.gameId === prediction.gameId);
        return {
          ...prediction,
          game
        };
      });
    
    res.json({
      success: true,
      data: topPredictions,
      count: topPredictions.length
    });
  } catch (error) {
    console.error('Error fetching top predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top predictions',
      error: error.message
    });
  }
});

// GET /api/predictions - Get all AI predictions
router.get('/', async (req, res) => {
  try {
    if (!predictionsData) {
      await loadData();
    }
    
    const { confidence, betType, riskLevel, limit } = req.query;
    let filteredPredictions = [...predictionsData];
    
    // Filter by confidence level
    if (confidence) {
      const minConfidence = parseInt(confidence);
      filteredPredictions = filteredPredictions.filter(p => p.confidence >= minConfidence);
    }
    
    // Filter by bet type
    if (betType) {
      filteredPredictions = filteredPredictions.filter(p => p.betType === betType);
    }
    
    // Filter by risk level
    if (riskLevel) {
      filteredPredictions = filteredPredictions.filter(p => p.riskLevel === riskLevel);
    }
    
    // Add game details to predictions
    const predictionsWithGames = filteredPredictions.map(prediction => {
      const game = gamesData.games.find(g => g.gameId === prediction.gameId);
      return {
        ...prediction,
        game
      };
    });
    
    // Sort by confidence (highest first)
    predictionsWithGames.sort((a, b) => b.confidence - a.confidence);
    
    // Apply limit
    if (limit) {
      predictionsWithGames.splice(parseInt(limit));
    }
    
    res.json({
      success: true,
      data: predictionsWithGames,
      count: predictionsWithGames.length,
      summary: {
        averageConfidence: (predictionsWithGames.reduce((sum, p) => sum + p.confidence, 0) / predictionsWithGames.length).toFixed(1),
        averageEdge: (predictionsWithGames.reduce((sum, p) => sum + parseFloat(p.edge), 0) / predictionsWithGames.length).toFixed(1),
        betTypeDistribution: predictionsWithGames.reduce((acc, p) => {
          acc[p.betType] = (acc[p.betType] || 0) + 1;
          return acc;
        }, {})
      }
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

// GET /api/predictions/:gameId - Get prediction for specific game
router.get('/:gameId', async (req, res) => {
  try {
    if (!predictionsData) {
      await loadData();
    }
    
    const { gameId } = req.params;
    const prediction = predictionsData.find(p => p.gameId === gameId);
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }
    
    // Add game details
    const game = gamesData.games.find(g => g.gameId === gameId);
    const predictionWithGame = {
      ...prediction,
      game
    };
    
    res.json({
      success: true,
      data: predictionWithGame
    });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
});

// POST /api/predictions/regenerate - Regenerate all predictions
router.post('/regenerate', async (req, res) => {
  try {
    if (!gamesData) {
      await loadData();
    }
    
    // Clear existing predictions
    predictionsData = [];
    
    // Generate new predictions
    predictionsData = await generatePredictions(gamesData.games);
    
    res.json({
      success: true,
      message: 'Predictions regenerated successfully',
      count: predictionsData.length
    });
  } catch (error) {
    console.error('Error regenerating predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate predictions',
      error: error.message
    });
  }
});

module.exports = router; 