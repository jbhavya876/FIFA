import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { 
  Wallet, 
  Chrome, 
  Brain, 
  Shield, 
  BarChart3,
  ArrowRight,
  Trophy,
  Star,
  Users,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

function Login() {
  const { connectMetaMask, connectPhantom, connectCoinbaseWallet, connectGoogle } = useAuth()
  const { getSupportedWallets } = useWallet()
  const [, setLocation] = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)

  const supportedWallets = getSupportedWallets()

  const handleWalletConnect = async (type) => {
    setIsLoading(true)
    setSelectedWallet(type)
    
    try {
      let success = false
      
      switch (type) {
        case 'metamask':
          success = await connectMetaMask()
          break
        case 'phantom':
          success = await connectPhantom()
          break
        case 'coinbase':
          success = await connectCoinbaseWallet()
          break
        case 'google':
          success = await connectGoogle()
          break
        default:
          toast.error('Unsupported wallet type')
          return
      }
      
      if (success) {
        toast.success('Login successful!')
        setLocation('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed: ' + error.message)
    } finally {
      setIsLoading(false)
      setSelectedWallet(null)
    }
  }

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Get intelligent betting recommendations with confidence scores'
    },
    {
      icon: Shield,
      title: 'Secure Crypto Payments',
      description: 'Bet with ETH, SOL, and USDC using blockchain technology'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track your performance with detailed statistics and insights'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/60">Connect your wallet to start betting</p>
          </div>

          {/* Wallet Connection Options */}
          <div className="space-y-4 mb-8">
            {supportedWallets.map((wallet) => (
              <button
                key={wallet.type}
                onClick={() => handleWalletConnect(wallet.type)}
                disabled={!wallet.supported || isLoading}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                  wallet.supported 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white transform hover:scale-105' 
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                } ${isLoading && selectedWallet === wallet.type ? 'opacity-75' : ''}`}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span>{wallet.name}</span>
                {!wallet.supported && <span className="text-xs">(Not Available)</span>}
                {isLoading && selectedWallet === wallet.type && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            ))}
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white/60">or</span>
              </div>
            </div>
            
            <button
              onClick={() => handleWalletConnect('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-lg font-medium transition-all duration-200"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-white/40 text-sm mb-4">
              Don't have an account?{' '}
              <Link href="/register">
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign up</span>
              </Link>
            </p>
            <p className="text-white/30 text-xs">
              By connecting your wallet, you agree to our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 bg-black/20 backdrop-blur-sm">
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-lg">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                World Cup 2026
              </h1>
              <p className="text-xl text-white/60">
                The Ultimate Cryptocurrency Betting Experience
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/60">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">15K+</div>
                <div className="text-white/60 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">2.5M+</div>
                <div className="text-white/60 text-sm">Total Bets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">45%</div>
                <div className="text-white/60 text-sm">Avg ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login