import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login')
    }
  }, [isAuthenticated, isLoading, setLocation])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
          <p className="text-white/80">Please wait while we verify your authentication.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return children
}

export default ProtectedRoute 