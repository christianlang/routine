import { useState, useEffect } from 'react'
import { t } from '../i18n'

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
  const label =
    theme === 'dark' ? t('themeDark') :
    theme === 'light' ? t('themeLight') :
    t('themeAuto')

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle"
      title={`${t('themeTitle')}: ${label}`}
    >
      {icon}
    </button>
  )
}

export default ThemeToggle
