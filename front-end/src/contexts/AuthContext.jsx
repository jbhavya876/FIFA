import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [walletType, setWalletType] = useState(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    const savedWalletType = localStorage.getItem('walletType')
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setWalletType(savedWalletType)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('walletType')
      }
    }
    
    setIsLoading(false)
  }, [])

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask is not installed! Please install MetaMask to continue.')
        return false
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length === 0) {
        toast.error('No accounts found! Please connect your MetaMask wallet.')
        return false
      }

      const account = accounts[0]
      
      // Sign message for authentication
      const message = `Sign this message to authenticate with World Cup Betting App. Nonce: ${Date.now()}`
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      })

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature)
      
      if (recoveredAddress.toLowerCase() !== account.toLowerCase()) {
        toast.error('Signature verification failed!')
        return false
      }

      const userData = {
        address: account,
        type: 'metamask',
        name: `Wallet ${account.slice(0, 6)}...${account.slice(-4)}`,
        avatar: null
      }

      setUser(userData)
      setWalletType('metamask')
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('walletType', 'metamask')
      
      toast.success('MetaMask connected successfully!')
      return true
    } catch (error) {
      console.error('MetaMask connection error:', error)
      toast.error('Failed to connect MetaMask: ' + error.message)
      return false
    }
  }

  const connectPhantom = async () => {
    try {
      if (typeof window.solana === 'undefined') {
        toast.error('Phantom is not installed! Please install Phantom to continue.')
        return false
      }

      // Connect to Phantom
      const response = await window.solana.connect()
      const publicKey = response.publicKey.toString()

      // Sign message for authentication
      const message = `Sign this message to authenticate with World Cup Betting App. Nonce: ${Date.now()}`
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8')

      const userData = {
        address: publicKey,
        type: 'phantom',
        name: `Wallet ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        avatar: null
      }

      setUser(userData)
      setWalletType('phantom')
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('walletType', 'phantom')
      
      toast.success('Phantom connected successfully!')
      return true
    } catch (error) {
      console.error('Phantom connection error:', error)
      toast.error('Failed to connect Phantom: ' + error.message)
      return false
    }
  }

  const connectCoinbaseWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isCoinbaseWallet) {
        toast.error('Coinbase Wallet is not installed! Please install Coinbase Wallet to continue.')
        return false
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length === 0) {
        toast.error('No accounts found! Please connect your Coinbase Wallet.')
        return false
      }

      const account = accounts[0]
      
      // Sign message for authentication
      const message = `Sign this message to authenticate with World Cup Betting App. Nonce: ${Date.now()}`
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      })

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature)
      
      if (recoveredAddress.toLowerCase() !== account.toLowerCase()) {
        toast.error('Signature verification failed!')
        return false
      }

      const userData = {
        address: account,
        type: 'coinbase',
        name: `Wallet ${account.slice(0, 6)}...${account.slice(-4)}`,
        avatar: null
      }

      setUser(userData)
      setWalletType('coinbase')
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('walletType', 'coinbase')
      
      toast.success('Coinbase Wallet connected successfully!')
      return true
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error)
      toast.error('Failed to connect Coinbase Wallet: ' + error.message)
      return false
    }
  }

  const connectGoogle = async () => {
    try {
      // Simulate Google OAuth (replace with actual Google OAuth implementation)
      const userData = {
        name: 'Demo User',
        email: 'demo@example.com',
        type: 'google',
        avatar: 'https://via.placeholder.com/40',
        address: null
      }

      setUser(userData)
      setWalletType('google')
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('walletType', 'google')
      
      toast.success('Google login successful!')
      return true
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Failed to login with Google: ' + error.message)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setWalletType(null)
    localStorage.removeItem('user')
    localStorage.removeItem('walletType')
    toast.success('Logged out successfully!')
  }

  const value = {
    user,
    isLoading,
    walletType,
    connectMetaMask,
    connectPhantom,
    connectCoinbaseWallet,
    connectGoogle,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 