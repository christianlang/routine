const TaskSegments = ({ tasks, center, radius, currentMinute, currentSecond }) => {
  /**
   * Create an SVG path for a segment arc
   */
  const createArcPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    // Handle invalid angles
    if (startAngle === endAngle) return ''

    // Convert angles to radians (subtract 90 to start at 12 o'clock)
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    // Calculate coordinates
    const x1 = center + innerRadius * Math.cos(startRad)
    const y1 = center + innerRadius * Math.sin(startRad)
    const x2 = center + outerRadius * Math.cos(startRad)
    const y2 = center + outerRadius * Math.sin(startRad)
    const x3 = center + outerRadius * Math.cos(endRad)
    const y3 = center + outerRadius * Math.sin(endRad)
    const x4 = center + innerRadius * Math.cos(endRad)
    const y4 = center + innerRadius * Math.sin(endRad)

    // Determine if we need to draw the large arc
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    // Create path
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
      Z
    `
  }

  const innerRadius = radius * 0.69
  const outerRadius = radius * 1.0

  // Current minute hand position in degrees (including seconds for smooth transition)
  const currentAngle = currentMinute * 6 + currentSecond * 0.1 // 6 degrees per minute + 0.1 per second

  return (
    <g className="task-segments">
      {tasks.map((task, index) => {
        // Split segment into "past" and "future" parts based on time
        let pastSegment = null
        let futureSegment = null

        const taskStart = task.startAngle
        const taskEnd = task.endAngle

        // Use time-based logic with seconds precision
        // minutesUntilStart can be negative (task started), 0 (same minute as start), or positive (future)
        // Task has started if minutesUntilStart <= 0 (includes the start minute)
        const hasStarted = task.minutesUntilStart <= 0
        const hasFinished = task.minutesUntilEnd <= 0

        if (!hasStarted) {
          // Task hasn't started yet - entire segment is future
          futureSegment = { start: taskStart, end: taskEnd }
        } else if (hasFinished) {
          // Task has finished - entire segment is past
          pastSegment = { start: taskStart, end: taskEnd }
        } else {
          // Task is currently running - split at current angle (with seconds for smooth transition)
          // Calculate how much of the task has elapsed (including seconds)
          // minutesUntilStart is negative when running, so negate it to get elapsed time
          const elapsedMinutes = Math.max(0, -task.minutesUntilStart)
          const elapsedSeconds = currentSecond
          const elapsedTotal = elapsedMinutes + (elapsedSeconds / 60)
          const totalMinutes = task.duration
          const progress = elapsedTotal / totalMinutes

          // Calculate the split angle
          const totalAngle = taskEnd > taskStart ? (taskEnd - taskStart) : (taskEnd + 360 - taskStart)
          const splitAngle = taskStart + (totalAngle * progress)

          if (splitAngle <= 360) {
            // Split doesn't need wrapping
            pastSegment = { start: taskStart, end: splitAngle }
            futureSegment = { start: splitAngle, end: taskEnd }
          } else {
            // Split wraps around
            pastSegment = { start: taskStart, end: splitAngle }
            futureSegment = { start: splitAngle, end: taskEnd }
          }
        }

        return (
          <g key={index}>
            {/* Past segment (dimmed) */}
            {pastSegment && (
              <path
                d={createArcPath(pastSegment.start, pastSegment.end, innerRadius, outerRadius)}
                fill={task.color}
                opacity={0.15}
                stroke="none"
              />
            )}

            {/* Future segment (full color) */}
            {futureSegment && (
              <path
                d={createArcPath(futureSegment.start, futureSegment.end, innerRadius, outerRadius)}
                fill={task.color}
                opacity={1}
                stroke="none"
              />
            )}

            {/* Outer border for entire task segment */}
            <path
              d={createArcPath(taskStart, taskEnd, innerRadius, outerRadius)}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />

          </g>
        )
      })}
    </g>
  )
}

export default TaskSegments
