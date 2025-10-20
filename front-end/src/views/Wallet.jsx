import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useWallet } from '../contexts/WalletContext'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

const WalletView = () => {
  const [, setLocation] = useLocation()
  const { balance, walletType, isConnected, connectWallet, disconnectWallet } = useWallet()
  
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('ETH')
  const [balanceHistory, setBalanceHistory] = useState([])

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls
      await Promise.all([
        loadTransactions(),
        loadBalanceHistory()
      ])
    } catch (error) {
      toast.error('Failed to load wallet data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTransactions = async () => {
    // Mock data - replace with actual API call
    setTransactions([
      {
        id: 1,
        type: 'deposit',
        currency: 'ETH',
        amount: 0.5,
        usdValue: 1250.00,
        status: 'completed',
        timestamp: '2024-01-15T10:30:00Z',
        txHash: '0x1234567890abcdef...',
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      },
      {
        id: 2,
        type: 'withdrawal',
        currency: 'USDC',
        amount: 500,
        usdValue: 500.00,
        status: 'pending',
        timestamp: '2024-01-14T15:45:00Z',
        txHash: '0xabcdef1234567890...',
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0x9876543210fedcba...'
      },
      {
        id: 3,
        type: 'deposit',
        currency: 'SOL',
        amount: 2.5,
        usdValue: 187.50,
        status: 'completed',
        timestamp: '2024-01-13T09:15:00Z',
        txHash: '0xfedcba0987654321...',
        from: '0x1234567890abcdef...',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      }
    ])
  }

  const loadBalanceHistory = async () => {
    // Mock data - replace with actual API call
    const history = [
      { date: 'Jan 1', balance: 1000 },
      { date: 'Jan 2', balance: 1200 },
      { date: 'Jan 3', balance: 1100 },
      { date: 'Jan 4', balance: 1350 },
      { date: 'Jan 5', balance: 1250 },
      { date: 'Jan 6', balance: 1400 },
      { date: 'Jan 7', balance: 1937.50 }
    ]
    setBalanceHistory(history)
  }

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      // Simulate deposit - replace with actual API call
      toast.success(`Deposited ${depositAmount} ${selectedCurrency}`)
      setShowDepositModal(false)
      setDepositAmount('')
      await loadWalletData() // Refresh data
    } catch (error) {
      toast.error('Deposit failed. Please try again.')
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!withdrawAddress) {
      toast.error('Please enter a valid address')
      return
    }

    try {
      // Simulate withdrawal - replace with actual API call
      toast.success(`Withdrawal initiated for ${withdrawAmount} ${selectedCurrency}`)
      setShowWithdrawModal(false)
      setWithdrawAmount('')
      setWithdrawAddress('')
      await loadWalletData() // Refresh data
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10'
      case 'pending': return 'text-yellow-500 bg-yellow-500/10'
      case 'failed': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const currencies = [
    { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
    { symbol: 'SOL', name: 'Solana', color: '#9945ff' },
    { symbol: 'USDC', name: 'USD Coin', color: '#2775ca' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading wallet...</p>
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
            <Wallet className="w-10 h-10 text-blue-400" />
            Wallet
          </h1>
          <p className="text-gray-300">
            Manage your cryptocurrency balances and transactions
          </p>
        </motion.div>

        {/* Wallet Connection Status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Wallet Not Connected</h3>
                  <p className="text-gray-300">Connect your wallet to view balances and make transactions</p>
                </div>
              </div>
              <button
                onClick={() => connectWallet('MetaMask')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </motion.div>
        )}

        {/* Balance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Balance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Balance</h3>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">$1,937.50</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+12.5%</span>
              <span className="text-gray-400">this week</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                onClick={() => setShowDepositModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Deposit
              </motion.button>
              <motion.button
                onClick={() => setShowWithdrawModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Minus className="w-5 h-5" />
                Withdraw
              </motion.button>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Wallet Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-medium">{walletType || 'Not Connected'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {isConnected && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Address:</span>
                  <button
                    onClick={() => copyToClipboard('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    {shortenAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4">Balance History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory}>
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
                    dataKey="balance" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{tx.type}</p>
                        <p className="text-gray-400 text-sm">{formatDate(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                      </p>
                      <p className="text-gray-400 text-sm">${tx.usdValue.toFixed(2)}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Deposit Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency.symbol} value={currency.symbol} className="bg-gray-800">
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeposit}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Withdraw Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency.symbol} value={currency.symbol} className="bg-gray-800">
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destination Address</label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Enter wallet address"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletView 