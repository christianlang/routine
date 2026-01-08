import { useMemo } from 'react'
import ClockHands from './ClockHands'
import TaskSegments from './TaskSegments'
import TaskList from './TaskList'
import { getActiveRoutine, calculateVisibleTasks, getCurrentMinutes } from '../utils/timeUtils'
import './Clock.css'

const Clock = ({ routines, currentTime }) => {
  const size = 600
  const center = size / 2
  const radius = size * 0.4

  // Get active routine
  const activeRoutine = useMemo(() => {
    return getActiveRoutine(routines, currentTime)
  }, [routines, currentTime])

  // Calculate visible tasks
  const visibleTasks = useMemo(() => {
    if (!activeRoutine) return []
    const currentMinutes = getCurrentMinutes(currentTime)
    return calculateVisibleTasks(activeRoutine.data.tasks, currentMinutes)
  }, [activeRoutine, currentTime])

  // Generate minute markers
  const minuteMarkers = []
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180) // Start at 12 o'clock
    const markerRadius = radius * 0.85
    const x = center + markerRadius * Math.cos(angle)
    const y = center + markerRadius * Math.sin(angle)
    const value = i === 0 ? 60 : i * 5

    minuteMarkers.push(
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="minute-marker"
        fontSize="24"
        fontWeight="bold"
        fill="#333"
      >
        {value}
      </text>
    )
  }

  return (
    <div className="clock-wrapper">
      <div className="clock-container">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="clock"
        >
          {/* Clock face background */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="white"
            stroke="#ddd"
            strokeWidth="4"
          />

          {/* Task segments */}
          <TaskSegments
            tasks={visibleTasks}
            center={center}
            radius={radius}
            currentMinute={currentTime.getMinutes()}
            currentSecond={currentTime.getSeconds()}
          />

          {/* Minute markers */}
          {minuteMarkers}

          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r="8"
            fill="#333"
          />

          {/* Clock hands */}
          <ClockHands
            currentTime={currentTime}
            center={center}
            radius={radius}
          />
        </svg>

        {/* Digital time display */}
        <div className="digital-time">
          {currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Task list */}
      {visibleTasks.length > 0 && (
        <TaskList tasks={visibleTasks} />
      )}
    </div>
  )
}

export default Clock
