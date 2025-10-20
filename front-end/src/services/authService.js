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

export const authService = {
  // Traditional login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Wallet-based login
  async loginWithWallet(walletData) {
    try {
      const response = await api.post('/auth/wallet', walletData)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Wallet login failed')
    }
  },

  // Google OAuth login
  async loginWithGoogle() {
    try {
      window.location.href = `${API_BASE_URL}/auth/google`
    } catch (error) {
      throw new Error('Google login failed')
    }
  },

  // Verify token
  async verifyToken(token) {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data.user
    } catch (error) {
      throw new Error('Token verification failed')
    }
  },

  // Get user profile
  async getProfile(token) {
    try {
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data.user
    } catch (error) {
      throw new Error('Failed to fetch profile')
    }
  },

  // Update profile
  async updateProfile(profileData, token) {
    try {
      const response = await api.put('/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed')
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token')
  },

  // Set token
  setToken(token) {
    localStorage.setItem('token', token)
  },

  // Remove token
  removeToken() {
    localStorage.removeItem('token')
  }
} 