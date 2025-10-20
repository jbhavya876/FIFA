import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Target, DollarSign, ArrowLeft, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const PlaceBet = () => {
  const [, setLocation] = useLocation()
  const [game, setGame] = useState(null)
  const [selectedBet, setSelectedBet] = useState(null)
  const [betAmount, setBetAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock game data
    setGame({
      id: 1,
      homeTeam: 'Brazil',
      awayTeam: 'Argentina',
      date: '2024-06-15T20:00:00Z',
      venue: 'Maracanã Stadium',
      bettingLines: {
        homeWin: 2.15,
        draw: 3.20,
        awayWin: 3.50
      }
    })
    setIsLoading(false)
  }, [])

  const handleBetSelection = (selection, odds) => {
    setSelectedBet({ selection, odds })
  }

  const handlePlaceBet = () => {
    if (!selectedBet || !betAmount) {
      toast.error('Please select a bet and enter amount')
      return
    }
    toast.success('Bet placed successfully! 🎉')
    setLocation('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => setLocation('/games')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-10 h-10 text-blue-400" />
            Place Your Bet
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Game Details</h2>
            <div className="text-center mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <h3 className="text-xl font-bold text-white">{game.homeTeam}</h3>
                </div>
                <div className="mx-4 text-2xl font-bold text-white">VS</div>
                <div className="text-center flex-1">
                  <h3 className="text-xl font-bold text-white">{game.awayTeam}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Betting Options</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleBetSelection(`${game.homeTeam} to win`, game.bettingLines.homeWin)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedBet?.selection === `${game.homeTeam} to win`
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{game.homeTeam}</div>
                  <div className="text-2xl font-bold">@{game.bettingLines.homeWin}</div>
                </button>
                <button
                  onClick={() => handleBetSelection('Draw', game.bettingLines.draw)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedBet?.selection === 'Draw'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">Draw</div>
                  <div className="text-2xl font-bold">@{game.bettingLines.draw}</div>
                </button>
                <button
                  onClick={() => handleBetSelection(`${game.awayTeam} to win`, game.bettingLines.awayWin)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedBet?.selection === `${game.awayTeam} to win`
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{game.awayTeam}</div>
                  <div className="text-2xl font-bold">@{game.bettingLines.awayWin}</div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Betting Slip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Betting Slip</h2>
            
            {selectedBet ? (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white font-medium mb-2">{selectedBet.selection}</p>
                  <p className="text-2xl font-bold text-blue-400">@{selectedBet.odds}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bet Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Potential Win</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${betAmount && selectedBet ? (parseFloat(betAmount) * selectedBet.odds).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={handlePlaceBet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Place Bet
                </motion.button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select a bet to get started</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PlaceBet 