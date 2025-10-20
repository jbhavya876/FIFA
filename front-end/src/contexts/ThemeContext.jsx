import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [isSystem, setIsSystem] = useState(true)

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const savedSystem = localStorage.getItem('isSystem')
    
    if (savedTheme && savedSystem === 'false') {
      setTheme(savedTheme)
      setIsSystem(false)
    } else {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
      setIsSystem(true)
    }
  }, [])

  useEffect(() => {
    // Update document class when theme changes
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
    localStorage.setItem('isSystem', isSystem.toString())
  }, [theme, isSystem])

  // Listen for system theme changes
  useEffect(() => {
    if (!isSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isSystem])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    setIsSystem(false)
  }

  const setSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(systemTheme)
    setIsSystem(true)
  }

  const value = {
    theme,
    isSystem,
    toggleTheme,
    setSystemTheme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
      setIsSystem(false)
    }
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
} 