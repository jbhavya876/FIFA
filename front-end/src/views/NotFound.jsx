import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { 
  Home, 
  ArrowLeft, 
  Search,
  AlertTriangle
} from 'lucide-react'

const NotFound = () => {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-300 text-lg mb-6">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <button
            onClick={() => setLocation('/')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white/10 backdrop-blur-lg text-white font-semibold py-4 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-400 text-sm mb-4">Or try these popular pages:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocation('/games')}
              className="p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
            >
              Games
            </button>
            <button
              onClick={() => setLocation('/predictions')}
              className="p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
            >
              Predictions
            </button>
            <button
              onClick={() => setLocation('/analytics')}
              className="p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
            >
              Analytics
            </button>
            <button
              onClick={() => setLocation('/wallet')}
              className="p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
            >
              Wallet
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound 