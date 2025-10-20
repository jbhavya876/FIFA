import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useWallet } from '../contexts/WalletContext'
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Wallet,
  ChevronDown,
  Trophy,
  BarChart3,
  Brain,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme, isSystem } = useTheme()
  const { isConnected, disconnectWallet } = useWallet()
  const [location] = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Trophy },
    { name: 'Games', href: '/games', icon: Target },
    { name: 'Predictions', href: '/predictions', icon: Brain },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
  ]

  const handleLogout = () => {
    logout()
    if (isConnected) {
      disconnectWallet()
    }
    setIsUserMenuOpen(false)
    toast.success('Logged out successfully!')
  }

  const isActive = (path) => location === path

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">WORLDCUPBET</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200"
              title={isSystem ? 'System' : theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {isSystem ? (
                <Settings className="w-5 h-5" />
              ) : theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl">
                    <div className="py-1">
                      <Link href="/profile">
                        <div className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer">
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </div>
                      </Link>
                      <Link href="/wallet">
                        <div className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer">
                          <Wallet className="w-4 h-4 mr-3" />
                          Wallet
                        </div>
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Login
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/5 backdrop-blur-md border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default Header