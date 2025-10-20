import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp, 
  Users,
  ArrowRight,
  Filter,
  Search,
  Trophy,
  Target,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

const Games = () => {
  const [, setLocation] = useLocation()
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    loadGames()
  }, [])

  useEffect(() => {
    filterGames()
  }, [games, searchTerm, selectedGroup, sortBy])

  const loadGames = async () => {
    setIsLoading(true)
    
    // Simulate API call - replace with actual API
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      setGames(data.games || [])
    } catch (error) {
      console.error('Failed to load games from API:', error)
      // Fallback to mock data
      setGames([
        {
          id: 1,
          homeTeam: 'Brazil',
          awayTeam: 'Argentina',
          date: '2024-06-15T20:00:00Z',
          venue: 'Maracanã Stadium',
          group: 'A',
          status: 'upcoming',
          bettingLines: {
            homeWin: 2.15,
            draw: 3.20,
            awayWin: 3.50,
            over25: 1.85,
            under25: 1.95,
            btts: 1.65,
            noBtts: 2.20
          },
          homeTeamStats: {
            fifaRank: 1,
            form: 'WWWDL',
            goalsScored: 12,
            goalsConceded: 3
          },
          awayTeamStats: {
            fifaRank: 3,
            form: 'WWLWW',
            goalsScored: 10,
            goalsConceded: 4
          }
        },
        {
          id: 2,
          homeTeam: 'France',
          awayTeam: 'Germany',
          date: '2024-06-16T18:00:00Z',
          venue: 'Stade de France',
          group: 'B',
          status: 'upcoming',
          bettingLines: {
            homeWin: 2.40,
            draw: 3.10,
            awayWin: 3.00,
            over25: 1.90,
            under25: 1.80,
            btts: 1.70,
            noBtts: 2.10
          },
          homeTeamStats: {
            fifaRank: 2,
            form: 'WWWWW',
            goalsScored: 15,
            goalsConceded: 2
          },
          awayTeamStats: {
            fifaRank: 4,
            form: 'WLWWW',
            goalsScored: 11,
            goalsConceded: 5
          }
        }
      ])
    }
    
    setIsLoading(false)
  }

  const filterGames = () => {
    let filtered = [...games]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.venue.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Group filter
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(game => game.group === selectedGroup)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date)
        case 'fifaRank':
          return a.homeTeamStats.fifaRank - b.homeTeamStats.fifaRank
        case 'odds':
          return a.bettingLines.homeWin - b.bettingLines.homeWin
        default:
          return 0
      }
    })

    setFilteredGames(filtered)
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

  const getFormColor = (form) => {
    const lastResult = form.charAt(form.length - 1)
    switch (lastResult) {
      case 'W': return 'text-green-500'
      case 'D': return 'text-yellow-500'
      case 'L': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const handlePlaceBet = (gameId) => {
    setLocation(`/place-bet/${gameId}`)
  }

  const groups = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading games...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">
            World Cup 2026 Games
          </h1>
          <p className="text-gray-300">
            Browse upcoming matches and place your bets
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {groups.map(group => (
                <option key={group} value={group} className="bg-gray-800">
                  {group === 'all' ? 'All Groups' : `Group ${group}`}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date" className="bg-gray-800">Sort by Date</option>
              <option value="fifaRank" className="bg-gray-800">Sort by FIFA Rank</option>
              <option value="odds" className="bg-gray-800">Sort by Odds</option>
            </select>

            {/* Stats */}
            <div className="flex items-center justify-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <Trophy className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-white text-sm">
                {filteredGames.length} Games
              </span>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={() => handlePlaceBet(game.id)}
            >
              {/* Game Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {game.homeTeam} vs {game.awayTeam}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(game.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-blue-500/20 px-2 py-1 rounded text-xs text-blue-300">
                    Group {game.group}
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-center text-gray-300 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {game.venue}
              </div>

              {/* Betting Lines */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-500/20 rounded">
                  <div className="text-xs text-gray-300">Home</div>
                  <div className="text-white font-semibold">{game.bettingLines.homeWin}</div>
                </div>
                <div className="text-center p-2 bg-yellow-500/20 rounded">
                  <div className="text-xs text-gray-300">Draw</div>
                  <div className="text-white font-semibold">{game.bettingLines.draw}</div>
                </div>
                <div className="text-center p-2 bg-red-500/20 rounded">
                  <div className="text-xs text-gray-300">Away</div>
                  <div className="text-white font-semibold">{game.bettingLines.awayWin}</div>
                </div>
              </div>

              {/* Team Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{game.homeTeam}</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-white">#{game.homeTeamStats.fifaRank}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{game.awayTeam}</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-white">#{game.awayTeamStats.fifaRank}</span>
                  </div>
                </div>
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
        {filteredGames.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Games 