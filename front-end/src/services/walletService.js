import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const walletService = {
  // Get wallet balance
  async getBalance() {
    try {
      const response = await api.get('/wallet/balance')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch balance')
    }
  },

  // Deposit funds
  async deposit(amount, currency) {
    try {
      const response = await api.post('/wallet/deposit', { amount, currency })
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Deposit failed')
    }
  },

  // Withdraw funds
  async withdraw(amount, currency, destinationAddress) {
    try {
      const response = await api.post('/wallet/withdraw', {
        amount,
        currency,
        destinationAddress
      })
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Withdrawal failed')
    }
  },

  // Get transaction history
  async getTransactions(limit = 20, offset = 0, type) {
    try {
      const params = { limit, offset }
      if (type) params.type = type
      
      const response = await api.get('/wallet/transactions', { params })
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transactions')
    }
  },

  // Get specific transaction
  async getTransaction(transactionId) {
    try {
      const response = await api.get(`/wallet/transactions/${transactionId}`)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transaction')
    }
  },

  // Get supported currencies
  async getSupportedCurrencies() {
    try {
      const response = await api.get('/wallet/supported-currencies')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch currencies')
    }
  },

  // Get gas fees
  async getGasFees() {
    try {
      const response = await api.get('/wallet/gas-fees')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch gas fees')
    }
  },

  // Verify wallet connection
  async verifyConnection(walletAddress, chain) {
    try {
      const response = await api.post('/wallet/verify-connection', {
        walletAddress,
        chain
      })
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Wallet verification failed')
    }
  },

  // Format currency amount
  formatAmount(amount, currency) {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return '0.00'

    switch (currency) {
      case 'ethereum':
        return numAmount.toFixed(6)
      case 'solana':
        return numAmount.toFixed(4)
      case 'usdc':
        return numAmount.toFixed(2)
      default:
        return numAmount.toFixed(2)
    }
  },

  // Get currency symbol
  getCurrencySymbol(currency) {
    const symbols = {
      ethereum: 'ETH',
      solana: 'SOL',
      usdc: 'USDC'
    }
    return symbols[currency] || currency.toUpperCase()
  },

  // Get currency color
  getCurrencyColor(currency) {
    const colors = {
      ethereum: '#627eea',
      solana: '#9945ff',
      usdc: '#2775ca'
    }
    return colors[currency] || '#6b7280'
  },

  // Validate wallet address
  validateAddress(address, chain) {
    if (!address) return false

    if (chain === 'ethereum') {
      // Ethereum address validation
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    } else if (chain === 'solana') {
      // Solana address validation (basic)
      return address.length >= 32 && address.length <= 44
    }

    return false
  },

  // Shorten wallet address for display
  shortenAddress(address, length = 6) {
    if (!address) return ''
    return `${address.slice(0, length)}...${address.slice(-length)}`
  },

  // Calculate transaction fee
  calculateFee(gasPrice, gasLimit, currency) {
    if (currency === 'ethereum') {
      const fee = (parseFloat(gasPrice) * parseInt(gasLimit)) / 1e18
      return fee.toFixed(6)
    }
    return '0'
  },

  // Get network name
  getNetworkName(chain) {
    const networks = {
      ethereum: 'Ethereum Mainnet',
      solana: 'Solana Mainnet',
      'ethereum-sepolia': 'Sepolia Testnet',
      'solana-devnet': 'Solana Devnet'
    }
    return networks[chain] || chain
  }
} 