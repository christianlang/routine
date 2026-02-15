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

      // Consider a task active if:
      // - It started in a previous minute (minutesUntilStart < 0), OR
      // - We're in the start minute (minutesUntilStart === 0)
      // AND it hasn't finished yet (minutesUntilEnd > 0)
      const isActive = minutesUntilStart <= 0 && minutesUntilEnd > 0

      return {
        ...task,
        minutesUntilStart,
        minutesUntilEnd,
        isActive
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

  // Generate minute tick marks and numbers (outside segments)
  const tickMarks = []
  const minuteNumbers = []
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * (Math.PI / 180) // 6 degrees per minute

    // Make every 5th minute tick thicker
    const isFiveMinuteMark = i % 5 === 0
    const outerRadius = radius * 0.995
    const innerRadius = isFiveMinuteMark ? radius * 0.955 : radius * 0.97
    const strokeWidth = isFiveMinuteMark ? 2 : 1
    const strokeColor = isFiveMinuteMark ? '#666' : '#999'

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

    // Add minute numbers for every 5th minute
    if (isFiveMinuteMark) {
      const numberRadius = radius * 1.07
      const x = center + numberRadius * Math.cos(angle)
      const y = center + numberRadius * Math.sin(angle)

      minuteNumbers.push(
        <text
          key={`min-${i}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#888"
        >
          {i}
        </text>
      )
    }
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
            r={radius * 1.14}
            fill="none"
            stroke="#555"
            strokeWidth="1"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="white"
            stroke="#ccc"
            strokeWidth="1.5"
          />

          {/* Tick marks */}
          {tickMarks}

          {/* Minute numbers */}
          {minuteNumbers}

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
      </div>

      {/* Task list */}
      {allRoutineTasks.length > 0 && (
        <TaskList tasks={allRoutineTasks} />
      )}
    </div>
  )
}

export default Clock
