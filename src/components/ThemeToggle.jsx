import { useState, useEffect } from 'react'

const getStoredTheme = () => localStorage.getItem('theme') || 'auto'

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'auto') return 'light'
      if (prev === 'light') return 'dark'
      return 'auto'
    })
  }

  const icon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌗'
  const label = theme === 'dark' ? 'Dunkel' : theme === 'light' ? 'Hell' : 'Auto'

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle"
      title={`Theme: ${label}`}
    >
      {icon}
    </button>
  )
}

export default ThemeToggle
