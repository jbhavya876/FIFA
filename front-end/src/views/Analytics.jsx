import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  Trophy,
  AlertTriangle
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts'
import toast from 'react-hot-toast'

const Analytics = () => {
  const [, setLocation] = useLocation()
  const [analyticsData, setAnalyticsData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API calls
      setAnalyticsData({
        overview: {
          totalBets: 156,
          wins: 98,
          losses: 58,
          winRate: 62.8,
          totalWagered: 8750.50,
          totalWon: 12450.75,
          netProfit: 3700.25,
          roi: 42.3,
          averageBet: 56.09,
          bestWin: 450.00,
          worstLoss: 200.00
        },
        performance: [
          { date: 'Jan 1', profit: 45, bets: 3, winRate: 66.7 },
          { date: 'Jan 2', profit: -12, bets: 2, winRate: 50.0 },
          { date: 'Jan 3', profit: 78, bets: 4, winRate: 75.0 },
          { date: 'Jan 4', profit: 23, bets: 3, winRate: 66.7 },
          { date: 'Jan 5', profit: -8, bets: 2, winRate: 50.0 },
          { date: 'Jan 6', profit: 56, bets: 3, winRate: 66.7 },
          { date: 'Jan 7', profit: 34, bets: 2, winRate: 100.0 }
        ],
        patterns: {
          betTypes: [
            { name: 'Match Winner', value: 45, color: '#3B82F6' },
            { name: 'Over/Under', value: 30, color: '#10B981' },
            { name: 'Both Teams Score', value: 15, color: '#F59E0B' },
            { name: 'Correct Score', value: 10, color: '#EF4444' }
          ]
        },
        roi: {
          byBetType: [
            { type: 'Match Winner', roi: 38.5, bets: 70 },
            { type: 'Over/Under', roi: 45.2, bets: 47 },
            { type: 'Both Teams Score', roi: 52.1, bets: 23 },
            { type: 'Correct Score', roi: 28.7, bets: 16 }
          ]
        },
        streaks: {
          currentWinStreak: 4,
          longestWinStreak: 7,
          currentLossStreak: 0,
          longestLossStreak: 3
        },
        comparative: {
          userWinRate: 62.8,
          averageWinRate: 52.3,
          userROI: 42.3,
          averageROI: 28.7
        }
      })
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ]

  const getMetricColor = (value) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-blue-400" />
            Analytics
          </h1>
          <p className="text-gray-300">
            Comprehensive insights into your betting performance
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value} className="bg-gray-800">
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Total Bets</p>
            <p className="text-2xl font-bold text-white">{analyticsData.overview?.totalBets}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Win Rate</p>
            <p className="text-2xl font-bold text-white">{analyticsData.overview?.winRate}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Net Profit</p>
            <p className={`text-2xl font-bold ${getMetricColor(analyticsData.overview?.netProfit)}`}>
              {formatCurrency(analyticsData.overview?.netProfit)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">ROI</p>
            <p className={`text-2xl font-bold ${getMetricColor(analyticsData.overview?.roi)}`}>
              {analyticsData.overview?.roi}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Avg Bet</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.overview?.averageBet)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Best Win</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(analyticsData.overview?.bestWin)}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4">Performance Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.performance}>
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
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                </AreaChart>
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
            <h3 className="text-xl font-bold text-white mb-4">Betting Patterns</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analyticsData.patterns?.betTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.patterns?.betTypes.map((entry, index) => (
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
              {analyticsData.patterns?.betTypes.map((pattern, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ROI Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4">ROI by Bet Type</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={analyticsData.roi?.byBetType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="roi" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Streaks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Streak Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <p className="text-3xl font-bold text-green-400">{analyticsData.streaks?.currentWinStreak}</p>
                <p className="text-sm text-gray-300">Current Win Streak</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-3xl font-bold text-blue-400">{analyticsData.streaks?.longestWinStreak}</p>
                <p className="text-sm text-gray-300">Longest Win Streak</p>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <p className="text-3xl font-bold text-yellow-400">{analyticsData.streaks?.currentLossStreak}</p>
                <p className="text-sm text-gray-300">Current Loss Streak</p>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <p className="text-3xl font-bold text-red-400">{analyticsData.streaks?.longestLossStreak}</p>
                <p className="text-sm text-gray-300">Longest Loss Streak</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Analytics 