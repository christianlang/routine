import { useState, useEffect, useCallback } from 'react'
import Clock from './components/Clock'
import Editor from './components/Editor'
import LandingPage from './components/LandingPage'
import { loadRoutine } from './firebase'
import { t } from './i18n'
import './App.css'

function parseHash() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (!hash) return { view: 'landing' }
  if (hash === 'new') return { view: 'editor', id: null }

  const parts = hash.split('/')
  if (parts.length === 2 && parts[1] === 'edit') {
    return { view: 'editor', id: parts[0] }
  }
  return { view: 'clock', id: parts[0] }
}

function App() {
  const [route, setRoute] = useState(parseHash)
  const [routines, setRoutines] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [simulatedTime, setSimulatedTime] = useState(null)

  // Listen to hash changes
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Check for time simulation URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const timeParam = params.get('time')

    if (timeParam) {
      const [hours, minutes] = timeParam.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const simTime = new Date()
        simTime.setHours(hours, minutes, 0, 0)
        setSimulatedTime(simTime)
      }
    }
  }, [])

  // Load routines from Firebase when route has an ID
  useEffect(() => {
    if (!route.id) {
      setRoutines(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    loadRoutine(route.id)
      .then(data => {
        if (data) {
          setRoutines(data)
        } else {
          setError('notFound')
        }
      })
      .catch(() => setError('notFound'))
      .finally(() => setLoading(false))
  }, [route.id])

  // Update time every second (only needed for clock view)
  useEffect(() => {
    if (route.view !== 'clock') return

    const timer = setInterval(() => {
      if (simulatedTime) {
        const newTime = new Date(simulatedTime)
        newTime.setSeconds(newTime.getSeconds() + 1)
        setSimulatedTime(newTime)
      } else {
        setCurrentTime(new Date())
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [route.view, simulatedTime])

  const handleRoutineSaved = useCallback((id, data) => {
    setRoutines(data)
    window.location.hash = `#/${id}/edit`
  }, [])

  // Landing page
  if (route.view === 'landing') {
    return <LandingPage />
  }

  // Editor
  if (route.view === 'editor') {
    return (
      <Editor
        routineId={route.id}
        initialData={route.id ? routines : null}
        loading={loading}
        onSaved={handleRoutineSaved}
      />
    )
  }

  // Clock view
  if (loading) {
    return <div className="app status-message">{t('loading')}</div>
  }

  if (error || !routines) {
    return (
      <div className="app status-message">
        <p>{t('notFound')}</p>
        <a href="#/new">{t('createNew')}</a>
      </div>
    )
  }

  const displayTime = simulatedTime || currentTime

  return (
    <div className="app">
      {simulatedTime && (
        <div className="test-mode-banner">
          Test-Modus: Zeit simuliert
        </div>
      )}
      <Clock routines={routines} currentTime={displayTime} />
      <a href={`#/${route.id}/edit`} className="edit-link">{t('editRoutine')}</a>
    </div>
  )
}

export default App
