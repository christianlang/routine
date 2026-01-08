import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import './App.css'

function App() {
  const [routines, setRoutines] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Load routines configuration
  useEffect(() => {
    fetch('/routine/routines.json')
      .then(res => res.json())
      .then(data => setRoutines(data))
      .catch(err => console.error('Error loading routines:', err))
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!routines) {
    return <div>Lade Routinen...</div>
  }

  return (
    <div className="app">
      <Clock routines={routines} currentTime={currentTime} />
    </div>
  )
}

export default App
