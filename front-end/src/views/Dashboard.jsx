import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trophy, 
  Target, 
  Activity,
  ArrowRight,
  Plus,
  Eye,
  Calendar,
  Clock,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Wallet,
  Settings
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [, setLocation] = useLocation()
  const { user } = useAuth()
  const { balance, walletType } = useWallet()
  
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    totalWagered: 0,
    totalWon: 0,
    winRate: 0,
    roi: 0
  })
  
  const [recentBets, setRecentBets] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [bettingPatterns, setBettingPatterns] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls
      await Promise.all([
        loadStats(),
        loadRecentBets(),
        loadPerformanceData(),
        loadBettingPatterns()
      ])
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // Fetch real data from analytics API
      const response = await fetch('/api/analytics/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const result = await response.json();

      if (result.success && result.data.overview) {
        const overview = result.data.overview;
        
        // Update state with REAL data from backend
        setStats({
          totalBets: overview.totalBets || 0,
          wins: Math.floor((overview.totalBets || 0) * (overview.winRate || 0) / 100),
          losses: (overview.totalBets || 0) - Math.floor((overview.totalBets || 0) * (overview.winRate || 0) / 100),
          totalWagered: overview.totalWagered || 0,
          totalWon: overview.totalWon || 0,
          winRate: overview.winRate || 0,
          roi: overview.roi || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
      
      // Fallback to zero values if API fails
      setStats({
        totalBets: 0,
        wins: 0,
        losses: 0,
        totalWagered: 0,
        totalWon: 0,
        winRate: 0,
        roi: 0
      });
    }
  }

  const loadRecentBets = async () => {
    // Mock data - replace with actual API call
    setRecentBets([
      {
        id: 1,
        game: 'Brazil vs Argentina',
        bet: 'Brazil to win',
        amount: 50,
        odds: 2.15,
        status: 'won',
        potentialWin: 107.50,
        date: '2024-01-15'
      },
      {
        id: 2,
        game: 'France vs Germany',
        bet: 'Over 2.5 goals',
        amount: 30,
        odds: 1.85,
        status: 'pending',
        potentialWin: 55.50,
        date: '2024-01-20'
      },
      {
        id: 3,
        game: 'Spain vs Italy',
        bet: 'Spain to win',
        amount: 25,
        odds: 2.40,
        status: 'lost',
        potentialWin: 60.00,
        date: '2024-01-10'
      }
    ])
  }

  const loadPerformanceData = async () => {
    // Mock data - replace with actual API call
    const data = [
      { date: 'Jan 1', profit: 45 },
      { date: 'Jan 2', profit: -12 },
      { date: 'Jan 3', profit: 78 },
      { date: 'Jan 4', profit: 23 },
      { date: 'Jan 5', profit: -8 },
      { date: 'Jan 6', profit: 56 },
      { date: 'Jan 7', profit: 34 }
    ]
    setPerformanceData(data)
  }

  const loadBettingPatterns = async () => {
    // Mock data - replace with actual API call
    const patterns = [
      { name: 'Match Winner', value: 45, color: '#3B82F6' },
      { name: 'Over/Under', value: 30, color: '#10B981' },
      { name: 'Both Teams Score', value: 15, color: '#F59E0B' },
      { name: 'Correct Score', value: 10, color: '#EF4444' }
    ]
    setBettingPatterns(patterns)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return 'text-green-500 bg-green-500/10'
      case 'lost': return 'text-red-500 bg-red-500/10'
      case 'pending': return 'text-yellow-500 bg-yellow-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won': return '🏆'
      case 'lost': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const quickActions = [
    {
      title: 'Place New Bet',
      icon: Plus,
      color: 'from-blue-500 to-purple-500',
      action: () => setLocation('/games')
    },
    {
      title: 'View Predictions',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      action: () => setLocation('/predictions')
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      color: 'from-green-500 to-teal-500',
      action: () => setLocation('/analytics')
    },
    {
      title: 'Wallet',
      icon: Wallet,
      color: 'from-purple-500 to-pink-500',
      action: () => setLocation('/wallet')
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username || 'Champion'}! 👋
          </h1>
          <p className="text-gray-300">
            Ready to make some winning predictions for the World Cup?
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bets</p>
                <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Wagered</p>
                <p className="text-2xl font-bold text-white">${stats.totalWagered.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ROI</p>
                <p className="text-2xl font-bold text-white">{stats.roi}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={action.action}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium text-sm">{action.title}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Betting Patterns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Betting Patterns
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={bettingPatterns}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bettingPatterns.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {bettingPatterns.map((pattern, index) => (
                <div key={pattern.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pattern.color }}
                  ></div>
                  <span className="text-sm text-gray-300">{pattern.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Bets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Recent Bets</h2>
            <button
              onClick={() => setLocation('/bets')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            {recentBets.map((bet, index) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(bet.status)}</span>
                      <div>
                        <h4 className="text-white font-medium">{bet.game}</h4>
                        <p className="text-gray-400 text-sm">{bet.bet}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>${bet.amount}</span>
                      <span>@{bet.odds}</span>
                      <span className={getStatusColor(bet.status)}>
                        {bet.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${bet.potentialWin.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">{bet.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard 