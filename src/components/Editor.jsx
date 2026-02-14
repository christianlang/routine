import { useState, useEffect } from 'react'
import { createRoutine, saveRoutine, loadRoutine } from '../firebase'
import { suggestDefaults } from '../utils/taskDefaults'
import { t } from '../i18n'
import './Editor.css'

const EXAMPLE_ROUTINE = {
  morning: {
    startTime: '07:00',
    tasks: [
      { name: 'Frühstück', duration: 20, icon: '🥣', color: '#FF9500' },
      { name: 'Zähne putzen', duration: 5, icon: '🪥', color: '#4CAF50' },
      { name: 'Anziehen', duration: 10, icon: '👕', color: '#2196F3' },
    ],
  },
}

function computeStartTimes(startTime, tasks) {
  const [h, m] = startTime.split(':').map(Number)
  let minutes = h * 60 + m
  return tasks.map(task => {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    const st = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    minutes += task.duration
    return { ...task, startTime: st }
  })
}

function computeEndTime(startTime, tasks) {
  const [h, m] = startTime.split(':').map(Number)
  let minutes = h * 60 + m
  for (const task of tasks) minutes += task.duration
  const hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

function routineToMinuteRange(startTime, tasks) {
  const [h, m] = startTime.split(':').map(Number)
  const start = h * 60 + m
  let end = start
  for (const task of tasks) end += task.duration
  return { start, end }
}

function validate(routineData) {
  const errors = []
  const ranges = []

  for (const [key, routine] of Object.entries(routineData)) {
    if (key === 'createdAt' || key === 'lastModified') continue
    if (!routine.tasks || routine.tasks.length === 0) {
      errors.push(t('errorNoTasks'))
    }
    if (routine.tasks) {
      for (const task of routine.tasks) {
        if (!task.name.trim()) {
          errors.push(t('errorNoName'))
          break
        }
      }
      ranges.push(routineToMinuteRange(routine.startTime, routine.tasks))
    }
  }

  if (ranges.length === 2) {
    const [a, b] = ranges
    if (a.start < b.end && b.start < a.end) {
      errors.push(t('errorOverlap'))
    }
  }

  return errors
}

function Editor({ routineId, initialData, loading, onSaved }) {
  const [data, setData] = useState(null)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved
  const [errors, setErrors] = useState([])
  const [currentId, setCurrentId] = useState(routineId)

  // Load data: from props, from Firebase, or use example
  useEffect(() => {
    if (initialData) {
      setData(stripMeta(initialData))
    } else if (routineId && !initialData && !loading) {
      loadRoutine(routineId).then(d => {
        if (d) setData(stripMeta(d))
        else setData(structuredClone(EXAMPLE_ROUTINE))
      })
    } else if (!routineId) {
      setData(structuredClone(EXAMPLE_ROUTINE))
    }
  }, [routineId, initialData, loading])

  function stripMeta(d) {
    const copy = { ...d }
    delete copy.createdAt
    delete copy.lastModified
    return copy
  }

  if (!data) {
    return <div className="editor">{t('loading')}</div>
  }

  const routineKeys = Object.keys(data).filter(k => k !== 'createdAt' && k !== 'lastModified')

  function updateRoutine(key, updates) {
    setData(prev => ({ ...prev, [key]: { ...prev[key], ...updates } }))
    setSaveState('idle')
  }

  function updateTask(routineKey, taskIndex, updates) {
    setData(prev => {
      const routine = prev[routineKey]
      const tasks = routine.tasks.map((task, i) =>
        i === taskIndex ? { ...task, ...updates } : task
      )
      return { ...prev, [routineKey]: { ...routine, tasks } }
    })
    setSaveState('idle')
  }

  function handleNameChange(routineKey, taskIndex, name) {
    const task = data[routineKey].tasks[taskIndex]
    const updates = { name }

    // Auto-suggest icon and color if they haven't been manually changed
    // (i.e., if they still match a previous suggestion or are empty)
    const suggestion = suggestDefaults(name)
    if (suggestion) {
      const prevSuggestion = suggestDefaults(task.name)
      const iconIsDefault = !task.icon || task.icon === '⭐' ||
        (prevSuggestion && task.icon === prevSuggestion.icon)
      const colorIsDefault = !task.color ||
        (prevSuggestion && task.color === prevSuggestion.color)

      if (iconIsDefault) updates.icon = suggestion.icon
      if (colorIsDefault) updates.color = suggestion.color
    }

    updateTask(routineKey, taskIndex, updates)
  }

  function addTask(routineKey) {
    setData(prev => {
      const routine = prev[routineKey]
      const tasks = [...routine.tasks, { name: '', duration: 10, icon: '⭐', color: '#9E9E9E' }]
      return { ...prev, [routineKey]: { ...routine, tasks } }
    })
    setSaveState('idle')
  }

  function moveTask(routineKey, taskIndex, direction) {
    setData(prev => {
      const routine = prev[routineKey]
      const tasks = [...routine.tasks]
      const newIndex = taskIndex + direction
      if (newIndex < 0 || newIndex >= tasks.length) return prev
      ;[tasks[taskIndex], tasks[newIndex]] = [tasks[newIndex], tasks[taskIndex]]
      return { ...prev, [routineKey]: { ...routine, tasks } }
    })
    setSaveState('idle')
  }

  function removeTask(routineKey, taskIndex) {
    setData(prev => {
      const routine = prev[routineKey]
      const tasks = routine.tasks.filter((_, i) => i !== taskIndex)
      return { ...prev, [routineKey]: { ...routine, tasks } }
    })
    setSaveState('idle')
  }

  function addRoutine(key) {
    const startTime = key === 'morning' ? '07:00' : '18:00'
    setData(prev => ({
      ...prev,
      [key]: { startTime, tasks: [{ name: '', duration: 10, icon: '⭐', color: '#9E9E9E' }] },
    }))
    setSaveState('idle')
  }

  function removeRoutine(key) {
    setData(prev => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
    setSaveState('idle')
  }

  async function handleSave() {
    // Build the data with computed startTimes and endTimes
    const toSave = {}
    for (const key of routineKeys) {
      const routine = data[key]
      const tasks = computeStartTimes(routine.startTime, routine.tasks)
      const endTime = computeEndTime(routine.startTime, routine.tasks)
      toSave[key] = { startTime: routine.startTime, endTime, tasks }
    }

    const validationErrors = validate(toSave)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors([])

    setSaveState('saving')
    try {
      if (currentId) {
        await saveRoutine(currentId, toSave)
        onSaved(currentId, toSave)
      } else {
        const newId = await createRoutine(toSave)
        setCurrentId(newId)
        onSaved(newId, toSave)
      }
      setSaveState('saved')
    } catch (err) {
      console.error('Save failed:', err)
      setSaveState('idle')
      setErrors(['Speichern fehlgeschlagen. Bitte versuche es erneut.'])
    }
  }

  function handleCopyLink() {
    if (!currentId) return
    const url = `${window.location.origin}${window.location.pathname}#/${currentId}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <h1>{t('editorTitle')}</h1>
        {currentId && (
          <a href={`#/${currentId}`} className="editor-clock-btn">{t('showClock')}</a>
        )}
      </div>

      {routineKeys.map(key => {
        const routine = data[key]
        const label = key === 'morning' ? t('morning') : t('evening')
        const tasksWithTimes = computeStartTimes(routine.startTime, routine.tasks)
        const endTime = computeEndTime(routine.startTime, routine.tasks)

        return (
          <div key={key} className="routine-card">
            <div className="routine-header">
              <h2>{label}</h2>
              <button
                className="remove-routine-btn"
                onClick={() => removeRoutine(key)}
                title={t('removeRoutine')}
              >
                &times;
              </button>
            </div>

            <div className="routine-time-row">
              <label>
                {t('startTime')}
                <input
                  type="time"
                  value={routine.startTime}
                  onChange={e => updateRoutine(key, { startTime: e.target.value })}
                />
              </label>
              <span className="routine-end-time">bis {endTime}</span>
            </div>

            <div className="task-table">
              <div className="task-table-header">
                <span className="col-icon">{t('icon')}</span>
                <span className="col-name">{t('taskName')}</span>
                <span className="col-duration">{t('duration')}</span>
                <span className="col-time">{t('startTime')}</span>
                <span className="col-color">{t('color')}</span>
                <span className="col-move"></span>
                <span className="col-delete"></span>
              </div>

              {routine.tasks.map((task, i) => (
                <div key={i} className="task-row">
                  <input
                    className="col-icon task-icon-input"
                    value={task.icon}
                    onChange={e => updateTask(key, i, { icon: e.target.value })}
                  />
                  <input
                    className="col-name task-name-input"
                    value={task.name}
                    placeholder={t('taskName')}
                    onChange={e => handleNameChange(key, i, e.target.value)}
                  />
                  <input
                    className="col-duration task-duration-input"
                    type="number"
                    min="1"
                    max="120"
                    value={task.duration}
                    onChange={e => updateTask(key, i, { duration: parseInt(e.target.value) || 1 })}
                  />
                  <span className="col-time task-computed-time">
                    {tasksWithTimes[i]?.startTime}
                  </span>
                  <input
                    className="col-color task-color-input"
                    type="color"
                    value={task.color}
                    onChange={e => updateTask(key, i, { color: e.target.value })}
                  />
                  <div className="col-move task-move-btns">
                    <button
                      className="task-move-btn"
                      onClick={() => moveTask(key, i, -1)}
                      disabled={i === 0}
                    >&#9650;</button>
                    <button
                      className="task-move-btn"
                      onClick={() => moveTask(key, i, 1)}
                      disabled={i === routine.tasks.length - 1}
                    >&#9660;</button>
                  </div>
                  <button
                    className="col-delete task-delete-btn"
                    onClick={() => removeTask(key, i)}
                    title={t('deleteTask')}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <button className="add-task-btn" onClick={() => addTask(key)}>
              + {t('addTask')}
            </button>
          </div>
        )
      })}

      {!routineKeys.includes('morning') && (
        <button className="add-routine-btn" onClick={() => addRoutine('morning')}>
          + {t('addMorningRoutine')}
        </button>
      )}
      {!routineKeys.includes('evening') && (
        <button className="add-routine-btn" onClick={() => addRoutine('evening')}>
          + {t('addEveningRoutine')}
        </button>
      )}

      {errors.length > 0 && (
        <div className="editor-errors">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <div className="editor-actions">
        <button className="save-btn" onClick={handleSave} disabled={saveState === 'saving'}>
          {saveState === 'saving' ? t('saving') : saveState === 'saved' ? t('saved') : t('save')}
        </button>
        {currentId && (
          <button className="copy-link-btn" onClick={handleCopyLink}>
            {t('copyLink')}
          </button>
        )}
      </div>
    </div>
  )
}

export default Editor
