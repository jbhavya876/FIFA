const express = require('express');
const router = express.Router();
const UserBets = require('../models/UserBets');

// In-memory storage for analytics data
const analyticsData = new Map();

// Get user analytics overview
router.get('/overview', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Query actual user bets from database
    const userBets = await UserBets.find({ userId: userId });
    
    // Calculate REAL statistics
    const totalBets = userBets.length;
    
    const totalWagered = userBets.reduce((sum, bet) => {
      return sum + (parseFloat(bet.stake) || parseFloat(bet.amount) || 0);
    }, 0);
    
    const wonBets = userBets.filter(bet => 
      bet.betStatus === 'won' || bet.isWon === true
    );
    const lostBets = userBets.filter(bet => 
      bet.betStatus === 'lost' || (bet.isSettled && !bet.isWon)
    );
    
    const wins = wonBets.length;
    const losses = lostBets.length;
    
    const totalWon = wonBets.reduce((sum, bet) => {
      return sum + (parseFloat(bet.payoutAmount) || parseFloat(bet.payout) || 0);
    }, 0);
    
    const settledBets = wins + losses;
    const winRate = settledBets > 0 ? (wins / settledBets * 100) : 0;
    
    const netProfit = totalWon - totalWagered;
    const roi = totalWagered > 0 ? (netProfit / totalWagered * 100) : 0;

    const overview = {
      totalBets: totalBets,
      totalWagered: parseFloat(totalWagered.toFixed(2)),
      totalWon: parseFloat(totalWon.toFixed(2)),
      netProfit: parseFloat(netProfit.toFixed(2)),
      winRate: parseFloat(winRate.toFixed(1)),
      roi: parseFloat(roi.toFixed(1))
    };

    res.json({
      success: true,
      data: { overview: overview }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
});

// Get performance chart data
router.get('/performance-chart', async (req, res) => {
  try {
    const { timeframe = '30d', currency = 'usdc' } = req.query;

    // Generate mock performance data
    const performanceData = generatePerformanceData(timeframe, currency);

    res.json({
      success: true,
      data: {
        performance: performanceData
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance chart data',
      error: error.message,
    });
  }
});

// Get betting patterns
router.get('/patterns', async (req, res) => {
  try {
    const patterns = {
      betTypes: {
        moneyline: {
          total: 25,
          wins: 18,
          winRate: 72.0,
          avgOdds: 1.85,
          totalWagered: 650.00,
          totalWon: 850.50,
          profit: 200.50
        },
        spread: {
          total: 15,
          wins: 10,
          winRate: 66.7,
          avgOdds: 1.91,
          totalWagered: 400.00,
          totalWon: 520.25,
          profit: 120.25
        },
        total: {
          total: 5,
          wins: 3,
          winRate: 60.0,
          avgOdds: 1.95,
          totalWagered: 200.50,
          totalWon: 504.50,
          profit: 304.00
        }
      },
      teams: {
        'Brazil': {
          total: 8,
          wins: 7,
          winRate: 87.5,
          profit: 320.50
        },
        'Argentina': {
          total: 6,
          wins: 4,
          winRate: 66.7,
          profit: 180.25
        },
        'France': {
          total: 5,
          wins: 3,
          winRate: 60.0,
          profit: 95.00
        }
      },
      timeOfDay: {
        morning: { bets: 12, winRate: 75.0 },
        afternoon: { bets: 18, winRate: 66.7 },
        evening: { bets: 15, winRate: 73.3 }
      },
      dayOfWeek: {
        monday: { bets: 5, winRate: 80.0 },
        tuesday: { bets: 7, winRate: 71.4 },
        wednesday: { bets: 8, winRate: 62.5 },
        thursday: { bets: 6, winRate: 83.3 },
        friday: { bets: 9, winRate: 66.7 },
        saturday: { bets: 6, winRate: 83.3 },
        sunday: { bets: 4, winRate: 75.0 }
      }
    };

    res.json({
      success: true,
      data: {
        patterns: patterns
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching betting patterns',
      error: error.message,
    });
  }
});

// Get ROI analysis
router.get('/roi-analysis', async (req, res) => {
  try {
    const roiAnalysis = {
      overall: {
        roi: 90.0,
        totalWagered: 1250.50,
        totalReturn: 2375.75,
        netProfit: 1125.25
      },
      byBetType: {
        moneyline: {
          roi: 30.8,
          totalWagered: 650.00,
          totalReturn: 850.50,
          netProfit: 200.50
        },
        spread: {
          roi: 30.1,
          totalWagered: 400.00,
          totalReturn: 520.25,
          netProfit: 120.25
        },
        total: {
          roi: 151.6,
          totalWagered: 200.50,
          totalReturn: 504.50,
          netProfit: 304.00
        }
      },
      byOdds: {
        '1.50-1.75': {
          roi: 45.2,
          bets: 15,
          winRate: 80.0
        },
        '1.76-2.00': {
          roi: 68.5,
          bets: 20,
          winRate: 70.0
        },
        '2.01-2.50': {
          roi: 125.3,
          bets: 8,
          winRate: 62.5
        },
        '2.51+': {
          roi: 180.7,
          bets: 2,
          winRate: 50.0
        }
      },
      byCurrency: {
        ethereum: {
          roi: 85.2,
          totalWagered: 2.5,
          totalReturn: 4.63
        },
        solana: {
          roi: 92.1,
          totalWagered: 15.8,
          totalReturn: 30.35
        },
        usdc: {
          roi: 88.7,
          totalWagered: 1232.20,
          totalReturn: 2340.77
        }
      }
    };

    res.json({
      success: true,
      data: {
        roiAnalysis: roiAnalysis
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ROI analysis',
      error: error.message,
    });
  }
});

// Get streak analysis
router.get('/streaks', async (req, res) => {
  try {
    const streaks = {
      current: {
        type: 'win',
        count: 4,
        startDate: '2026-06-10',
        totalProfit: 245.50
      },
      longest: {
        win: {
          count: 7,
          startDate: '2026-05-15',
          endDate: '2026-05-22',
          totalProfit: 420.75
        },
        loss: {
          count: 3,
          startDate: '2026-05-08',
          endDate: '2026-05-10',
          totalLoss: 125.00
        }
      },
      history: [
        { type: 'win', count: 7, date: '2026-05-15' },
        { type: 'loss', count: 3, date: '2026-05-08' },
        { type: 'win', count: 5, date: '2026-05-01' },
        { type: 'loss', count: 2, date: '2026-04-28' },
        { type: 'win', count: 4, date: '2026-04-20' }
      ]
    };

    res.json({
      success: true,
      data: {
        streaks: streaks
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching streak analysis',
      error: error.message,
    });
  }
});

// Get comparative analysis
router.get('/comparative', async (req, res) => {
  try {
    const comparative = {
      vsAverage: {
        winRate: {
          user: 68.9,
          average: 52.3,
          difference: 16.6
        },
        roi: {
          user: 90.0,
          average: 45.2,
          difference: 44.8
        },
        avgBetSize: {
          user: 27.8,
          average: 35.5,
          difference: -7.7
        }
      },
      vsTopPerformers: {
        percentile: 85,
        rank: 1250,
        totalUsers: 15000
      },
      recommendations: [
        {
          type: 'improvement',
          title: 'Increase Bet Size',
          description: 'Your win rate is excellent. Consider increasing bet sizes to maximize profits.',
          impact: 'high'
        },
        {
          type: 'warning',
          title: 'Diversify Bet Types',
          description: 'You\'re heavily focused on moneyline bets. Consider exploring spread betting.',
          impact: 'medium'
        },
        {
          type: 'success',
          title: 'Excellent ROI',
          description: 'Your ROI is in the top 15% of users. Keep up the great work!',
          impact: 'low'
        }
      ]
    };

    res.json({
      success: true,
      data: {
        comparative: comparative
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comparative analysis',
      error: error.message,
    });
  }
});

// Helper function to generate performance data
function generatePerformanceData(timeframe, currency) {
  const data = [];
  const now = new Date();
  let days;

  switch (timeframe) {
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '90d':
      days = 90;
      break;
    default:
      days = 30;
  }

  let cumulativeProfit = 0;
  let cumulativeWagered = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random daily performance
    const dailyBets = Math.floor(Math.random() * 5) + 1;
    const dailyWagered = parseFloat((Math.random() * 50 + 10).toFixed(2));
    const dailyWinRate = Math.random() * 0.4 + 0.5; // 50-90%
    const dailyProfit = parseFloat((dailyWagered * (dailyWinRate - 0.5) * 1.8).toFixed(2));
    
    cumulativeWagered += dailyWagered;
    cumulativeProfit += dailyProfit;

    data.push({
      date: date.toISOString().split('T')[0],
      bets: dailyBets,
      wagered: dailyWagered,
      profit: dailyProfit,
      winRate: parseFloat((dailyWinRate * 100).toFixed(1)),
      cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
      cumulativeWagered: parseFloat(cumulativeWagered.toFixed(2)),
      roi: parseFloat(((cumulativeProfit / cumulativeWagered) * 100).toFixed(1))
    });
  }

  return data;
}

module.exports = router; 