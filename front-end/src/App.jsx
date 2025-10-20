import { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { WalletProvider } from './contexts/WalletContext'

// Import views
import Home from './views/home'
import Dashboard from './views/Dashboard'
import Games from './views/Games'
import Predictions from './views/Predictions'
import Analytics from './views/Analytics'
import Wallet from './views/Wallet'
import Profile from './views/Profile'
import Login from './views/login'
import Register from './views/register'
import NotFound from './views/NotFound'
import PlaceBet from './views/PlaceBet'

// Import components
import Header from './components/header'
import Footer from './components/footer'
import ProtectedRoute from './components/ProtectedRoute'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
              <Header />
              <main className="flex-1">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/dashboard">
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/games">
                    <ProtectedRoute>
                      <Games />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/predictions">
                    <ProtectedRoute>
                      <Predictions />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/analytics">
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/wallet">
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/profile">
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/place-bet/:gameId">
                    <ProtectedRoute>
                      <PlaceBet />
                    </ProtectedRoute>
                  </Route>
                  <Route component={NotFound} />
                </Switch>
              </main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App 