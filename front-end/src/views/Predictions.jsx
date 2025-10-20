import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Star,
  ArrowRight,
  Filter,
  Search,
  Zap,
  BarChart3,
  Lightbulb,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import toast from 'react-hot-toast'

const Predictions = () => {
  const [, setLocation] = useLocation()
  const [predictions, setPredictions] = useState([])
  const [filteredPredictions, setFilteredPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConfidence, setSelectedConfidence] = useState('all')
  const [aiStats, setAiStats] = useState({
    accuracy: 0,
    totalPredictions: 0,
    correctPredictions: 0,
    averageConfidence: 0
  })

  useEffect(() => {
    loadPredictions()
  }, [])

  useEffect(() => {
    filterPredictions()
  }, [predictions, searchTerm, selectedConfidence])

  const loadPredictions = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/predictions')
      const data = await response.json()
      setPredictions(data.data || [])
    } catch (error) {
      console.error('Failed to load predictions from API:', error)
      // Fallback to mock data
      setPredictions([
        {
          id: 1,
          game: 'Brazil vs Argentina',
          date: '2024-06-15T20:00:00Z',
          prediction: 'Brazil to win',
          confidence: 85,
          odds: 2.15,
          reasoning: 'Brazil has been in excellent form, winning their last 5 matches. Their home advantage and superior FIFA ranking (#1) give them a significant edge.',
          factors: [
            'Brazil home form: 5 wins in last 5',
            'FIFA ranking advantage: #1 vs #3',
            'Head-to-head: Brazil won 3 of last 5',
            'Recent form: Brazil WWWWW vs Argentina WLWWW'
          ],
          riskLevel: 'low',
          aiModel: 'GPT-4o',
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          game: 'France vs Germany',
          date: '2024-06-16T18:00:00Z',
          prediction: 'Over 2.5 goals',
          confidence: 72,
          odds: 1.90,
          reasoning: 'Both teams have been scoring freely in recent matches. France averages 3.2 goals per game while Germany averages 2.8.',
          factors: [
            'France scoring rate: 3.2 goals/game',
            'Germany scoring rate: 2.8 goals/game',
            'Both teams in attacking form',
            'Historical matches: 4 of last 5 had 3+ goals'
          ],
          riskLevel: 'medium',
          aiModel: 'GPT-4o',
          lastUpdated: '2024-01-15T11:15:00Z'
        }
      ])
    }
    
    setIsLoading(false)
  }

  const filterPredictions = () => {
    let filtered = [...predictions]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pred => 
        pred.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.prediction.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Confidence filter
    if (selectedConfidence !== 'all') {
      const minConfidence = parseInt(selectedConfidence)
      filtered = filtered.filter(pred => pred.confidence >= minConfidence)
    }

    setFilteredPredictions(filtered)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-500 bg-green-500/10'
    if (confidence >= 70) return 'text-yellow-500 bg-yellow-500/10'
    if (confidence >= 60) return 'text-orange-500 bg-orange-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePlaceBet = (predictionId) => {
    setLocation(`/place-bet?prediction=${predictionId}`)
  }

  const confidenceLevels = [
    { value: 'all', label: 'All Confidence' },
    { value: '80', label: '80%+' },
    { value: '70', label: '70%+' },
    { value: '60', label: '60%+' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading AI predictions...</p>
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
            <Brain className="w-10 h-10 text-blue-400" />
            AI Predictions
          </h1>
          <p className="text-gray-300">
            Powered by GPT-4o for intelligent betting insights
          </p>
        </motion.div>

        {/* AI Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{aiStats.accuracy}%</div>
            <div className="text-sm text-gray-300">Accuracy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{aiStats.totalPredictions}</div>
            <div className="text-sm text-gray-300">Total Predictions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{aiStats.correctPredictions}</div>
            <div className="text-sm text-gray-300">Correct</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{aiStats.averageConfidence}%</div>
            <div className="text-sm text-gray-300">Avg Confidence</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search predictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confidence Filter */}
            <select
              value={selectedConfidence}
              onChange={(e) => setSelectedConfidence(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {confidenceLevels.map(level => (
                <option key={level.value} value={level.value} className="bg-gray-800">
                  {level.label}
                </option>
              ))}
            </select>

            {/* Stats */}
            <div className="flex items-center justify-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <Brain className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-white text-sm">
                {filteredPredictions.length} Predictions
              </span>
            </div>
          </div>
        </motion.div>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={() => handlePlaceBet(prediction.id)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {prediction.game}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(prediction.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{prediction.prediction}</h4>
                  <div className="text-yellow-400 font-bold">@{prediction.odds}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`${getRiskColor(prediction.riskLevel)}`}>
                    {prediction.riskLevel} risk
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400">{prediction.aiModel}</span>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  AI Reasoning
                </h5>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {prediction.reasoning}
                </p>
              </div>

              {/* Key Factors */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Key Factors
                </h5>
                <ul className="space-y-1">
                  {prediction.factors?.slice(0, 3).map((factor, idx) => (
                    <li key={idx} className="text-xs text-gray-400 flex items-center">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group-hover:scale-105">
                <Target className="w-4 h-4 mr-2" />
                Place Bet
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPredictions.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No predictions found</h3>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Predictions 