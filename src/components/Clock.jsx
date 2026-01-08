import { useMemo } from 'react'
import ClockHands from './ClockHands'
import TaskSegments from './TaskSegments'
import TaskList from './TaskList'
import { getActiveRoutine, calculateVisibleTasks, getCurrentMinutes, parseTimeToMinutes } from '../utils/timeUtils'
import './Clock.css'

const Clock = ({ routines, currentTime }) => {
  const size = 600
  const center = size / 2
  const radius = size * 0.4

  // Get active routine
  const activeRoutine = useMemo(() => {
    return getActiveRoutine(routines, currentTime)
  }, [routines, currentTime])

  // Calculate visible tasks for clock (60-minute window)
  const visibleTasks = useMemo(() => {
    if (!activeRoutine) return []
    const currentMinutes = getCurrentMinutes(currentTime)
    return calculateVisibleTasks(activeRoutine.data.tasks, currentMinutes)
  }, [activeRoutine, currentTime])

  // Calculate all tasks for task list (complete routine)
  const allRoutineTasks = useMemo(() => {
    if (!activeRoutine) return []
    const currentMinutes = getCurrentMinutes(currentTime)

    return activeRoutine.data.tasks.map(task => {
      const taskStart = parseTimeToMinutes(task.startTime)
      const taskEnd = taskStart + task.duration
      const minutesUntilStart = taskStart - currentMinutes
      const minutesUntilEnd = taskEnd - currentMinutes

      return {
        ...task,
        minutesUntilStart,
        minutesUntilEnd,
        isActive: minutesUntilStart < 0 && minutesUntilEnd > 0
      }
    })
  }, [activeRoutine, currentTime])

  // Generate hour numbers
  const hourNumbers = []
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180) // Start at 12 o'clock
    const numberRadius = radius * 0.85
    const x = center + numberRadius * Math.cos(angle)
    const y = center + numberRadius * Math.sin(angle)
    const value = i === 0 ? 12 : i

    hourNumbers.push(
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="hour-number"
        fontSize="32"
        fontWeight="bold"
        fill="#333"
      >
        {value}
      </text>
    )
  }

  // Generate minute tick marks (outside segments)
  const tickMarks = []
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * (Math.PI / 180) // 6 degrees per minute

    // Position ticks outside the segments (segments end at radius * 0.95)
    const outerRadius = radius * 1.0
    const innerRadius = radius * 0.975
    const strokeWidth = 1
    const strokeColor = '#999'

    const x1 = center + innerRadius * Math.cos(angle)
    const y1 = center + innerRadius * Math.sin(angle)
    const x2 = center + outerRadius * Math.cos(angle)
    const y2 = center + outerRadius * Math.sin(angle)

    tickMarks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
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

          {/* Tick marks */}
          {tickMarks}

          {/* Task segments */}
          <TaskSegments
            tasks={visibleTasks}
            center={center}
            radius={radius}
            currentMinute={currentTime.getMinutes()}
            currentSecond={currentTime.getSeconds()}
          />

          {/* Hour numbers */}
          {hourNumbers}

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
      {allRoutineTasks.length > 0 && (
        <TaskList tasks={allRoutineTasks} />
      )}
    </div>
  )
}

export default Clock
