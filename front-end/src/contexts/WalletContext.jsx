import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Connection, PublicKey } from '@solana/web3.js'
import toast from 'react-hot-toast'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [walletType, setWalletType] = useState(null)
  const [balances, setBalances] = useState({
    ETH: '0.0',
    SOL: '0.0',
    USDC: '0.00'
  })
  const [transactions, setTransactions] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Ethereum provider
  const [ethereumProvider, setEthereumProvider] = useState(null)
  
  // Solana connection
  const [solanaConnection, setSolanaConnection] = useState(null)

  useEffect(() => {
    // Initialize providers
    if (typeof window.ethereum !== 'undefined') {
      setEthereumProvider(new ethers.BrowserProvider(window.ethereum))
    }
    
    if (typeof window.solana !== 'undefined') {
      setSolanaConnection(new Connection('https://api.devnet.solana.com'))
    }
  }, [])

  const connectWallet = async (type) => {
    setIsLoading(true)
    try {
      let address = null
      
      switch (type) {
        case 'metamask':
        case 'coinbase':
          if (!ethereumProvider) {
            throw new Error('Ethereum provider not available')
          }
          
          const accounts = await ethereumProvider.send('eth_requestAccounts', [])
          address = accounts[0]
          break
          
        case 'phantom':
          if (typeof window.solana === 'undefined') {
            throw new Error('Phantom wallet not installed')
          }
          
          const response = await window.solana.connect()
          address = response.publicKey.toString()
          break
          
        default:
          throw new Error('Unsupported wallet type')
      }
      
      setWalletAddress(address)
      setWalletType(type)
      setIsConnected(true)
      
      // Load initial balances
      await loadBalances(address, type)
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} wallet connected!`)
      return true
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error(`Failed to connect ${type} wallet: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setWalletType(null)
    setBalances({ ETH: '0.0', SOL: '0.0', USDC: '0.00' })
    setTransactions([])
    setIsConnected(false)
    toast.success('Wallet disconnected!')
  }

  const loadBalances = async (address, type) => {
    try {
      let newBalances = { ...balances }
      
      if (type === 'metamask' || type === 'coinbase') {
        if (ethereumProvider) {
          const balance = await ethereumProvider.getBalance(address)
          newBalances.ETH = ethers.formatEther(balance)
          
          // Simulate USDC balance (in real app, you'd query the USDC contract)
          newBalances.USDC = (Math.random() * 5000).toFixed(2)
        }
      } else if (type === 'phantom') {
        if (solanaConnection) {
          const publicKey = new PublicKey(address)
          const balance = await solanaConnection.getBalance(publicKey)
          newBalances.SOL = (balance / 1e9).toFixed(4)
          
          // Simulate USDC balance
          newBalances.USDC = (Math.random() * 3000).toFixed(2)
        }
      }
      
      setBalances(newBalances)
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const sendTransaction = async (toAddress, amount, currency) => {
    if (!isConnected || !walletAddress) {
      toast.error('Please connect a wallet first')
      return false
    }

    setIsLoading(true)
    try {
      let txHash = null
      
      if (walletType === 'metamask' || walletType === 'coinbase') {
        if (!ethereumProvider) throw new Error('Ethereum provider not available')
        
        const signer = await ethereumProvider.getSigner()
        const tx = await signer.sendTransaction({
          to: toAddress,
          value: ethers.parseEther(amount.toString())
        })
        
        txHash = tx.hash
      } else if (walletType === 'phantom') {
        if (typeof window.solana === 'undefined') {
          throw new Error('Phantom wallet not available')
        }
        
        const publicKey = new PublicKey(toAddress)
        const transaction = await window.solana.transfer({
          to: publicKey,
          amount: amount * 1e9 // Convert to lamports
        })
        
        txHash = transaction.signature
      }
      
      // Add transaction to history
      const newTransaction = {
        id: `tx_${Date.now()}`,
        type: 'outbound',
        from: walletAddress,
        to: toAddress,
        amount: amount.toString(),
        currency,
        txHash,
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      
      // Update balances
      await loadBalances(walletAddress, walletType)
      
      toast.success(`Transaction sent successfully! Hash: ${txHash}`)
      return true
    } catch (error) {
      console.error('Transaction error:', error)
      toast.error(`Transaction failed: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const depositFunds = async (amount, currency) => {
    if (!isConnected || !walletAddress) {
      toast.error('Please connect a wallet first')
      return false
    }

    setIsLoading(true)
    try {
      // Simulate deposit (in real app, this would interact with smart contracts)
      const newBalances = { ...balances }
      const currentBalance = parseFloat(newBalances[currency] || 0)
      newBalances[currency] = (currentBalance + parseFloat(amount)).toFixed(2)
      
      setBalances(newBalances)
      
      // Add transaction to history
      const newTransaction = {
        id: `deposit_${Date.now()}`,
        type: 'deposit',
        from: 'external',
        to: walletAddress,
        amount: amount.toString(),
        currency,
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      
      toast.success(`Deposited ${amount} ${currency} successfully!`)
      return true
    } catch (error) {
      console.error('Deposit error:', error)
      toast.error(`Deposit failed: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const placeBet = async (gameId, betType, amount, odds) => {
    if (!isConnected || !walletAddress) {
      toast.error('Please connect a wallet first')
      return false
    }

    setIsLoading(true)
    try {
      // Check if user has sufficient balance
      const currency = walletType === 'phantom' ? 'SOL' : 'ETH'
      const currentBalance = parseFloat(balances[currency])
      
      if (currentBalance < parseFloat(amount)) {
        toast.error(`Insufficient ${currency} balance`)
        return false
      }

      // Simulate bet placement (in real app, this would interact with smart contracts)
      const newBalances = { ...balances }
      newBalances[currency] = (currentBalance - parseFloat(amount)).toFixed(4)
      setBalances(newBalances)
      
      // Add bet transaction to history
      const newTransaction = {
        id: `bet_${Date.now()}`,
        type: 'bet',
        gameId,
        betType,
        amount: amount.toString(),
        odds,
        currency,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      
      toast.success(`Bet placed successfully! Amount: ${amount} ${currency}`)
      return true
    } catch (error) {
      console.error('Bet placement error:', error)
      toast.error(`Bet placement failed: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getSupportedWallets = () => {
    return [
      {
        name: 'MetaMask',
        type: 'metamask',
        description: 'Ethereum wallet for ETH and ERC-20 tokens',
        icon: '🦊',
        supported: typeof window.ethereum !== 'undefined'
      },
      {
        name: 'Phantom',
        type: 'phantom',
        description: 'Solana wallet for SOL and SPL tokens',
        icon: '👻',
        supported: typeof window.solana !== 'undefined'
      },
      {
        name: 'Coinbase Wallet',
        type: 'coinbase',
        description: 'Multi-chain wallet supporting Ethereum and Solana',
        icon: '🪙',
        supported: typeof window.ethereum !== 'undefined'
      }
    ]
  }

  const value = {
    walletAddress,
    walletType,
    balances,
    transactions,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    depositFunds,
    placeBet,
    getSupportedWallets,
    loadBalances: () => loadBalances(walletAddress, walletType)
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
} 