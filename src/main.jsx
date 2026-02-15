import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply saved theme before render to avoid flash
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'auto')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = import.meta.env.BASE_URL + 'sw.js'
    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn('SW registration failed:', err)
    })
  })
}
