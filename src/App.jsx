import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import './App.css'

function App() {
  const [routines, setRoutines] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [simulatedTime, setSimulatedTime] = useState(null)

  // Check for time simulation URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const timeParam = params.get('time')

    if (timeParam) {
      // Parse time parameter (format: HH:MM)
      const [hours, minutes] = timeParam.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const simTime = new Date()
        simTime.setHours(hours, minutes, 0, 0)
        setSimulatedTime(simTime)
      }
    }
  }, [])

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
      if (simulatedTime) {
        // Increment simulated time
        const newTime = new Date(simulatedTime)
        newTime.setSeconds(newTime.getSeconds() + 1)
        setSimulatedTime(newTime)
      } else {
        // Use real time
        setCurrentTime(new Date())
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [simulatedTime])

  if (!routines) {
    return <div>Lade Routinen...</div>
  }

  const displayTime = simulatedTime || currentTime

  return (
    <div className="app">
      {simulatedTime && (
        <div className="test-mode-banner">
          🧪 Test-Modus: Zeit simuliert
        </div>
      )}
      <Clock routines={routines} currentTime={displayTime} />
    </div>
  )
}

export default App
