import { useState } from 'react'
import { Link } from 'wouter'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useWallet } from '../contexts/WalletContext'
import { 
  Trophy, 
  Zap, 
  Shield, 
  TrendingUp, 
  Wallet, 
  Brain,
  ArrowRight,
  Star,
  Users,
  Award,
  Circle,
  Target,
  BarChart3,
  Bell,
  User,
  LogIn,
  Chrome,
  Moon,
  Sun,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

function Home() {
  const { user, isAuthenticated, connectMetaMask, connectPhantom, connectCoinbaseWallet, connectGoogle } = useAuth()
  const { theme, toggleTheme, isSystem } = useTheme()
  const { isConnected, connectWallet, getSupportedWallets } = useWallet()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWalletConnect = async (type) => {
    setIsLoading(true)
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
          success = await connectWallet(type)
      }
      
      if (success) {
        setShowLoginModal(false)
      }
    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const supportedWallets = getSupportedWallets()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-2xl">
                <Circle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                WORLD CUP 2026
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              The Ultimate Cryptocurrency Betting Experience
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Wallet className="w-5 h-5 inline mr-2" />
                    Connect Wallet
                  </button>
                  <Link href="/register">
                    <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-200">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </button>
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15,000+</div>
                <div className="text-white/60">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">2.5M+</div>
                <div className="text-white/60">Total Bets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">45%</div>
                <div className="text-white/60">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">4.8/5</div>
                <div className="text-white/60">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-white/60">Choose your preferred wallet to start betting</p>
            </div>
            
            <div className="space-y-4">
              {supportedWallets.map((wallet) => (
                <button
                  key={wallet.type}
                  onClick={() => handleWalletConnect(wallet.type)}
                  disabled={!wallet.supported || isLoading}
                  className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                    wallet.supported 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white transform hover:scale-105' 
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <span>{wallet.name}</span>
                  {!wallet.supported && <span className="text-xs">(Not Available)</span>}
                </button>
              ))}
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/10 text-white/60">or</span>
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
            
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-6 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home