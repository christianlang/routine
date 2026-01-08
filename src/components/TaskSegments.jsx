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

  /**
   * Calculate text position and rotation for a segment
   */
  const getTextTransform = (startAngle, endAngle, radius) => {
    const middleAngle = (startAngle + endAngle) / 2
    const textRadius = radius * 0.7
    const angle = ((middleAngle - 90) * Math.PI) / 180
    const x = center + textRadius * Math.cos(angle)
    const y = center + textRadius * Math.sin(angle)

    return { x, y, rotation: middleAngle }
  }

  const innerRadius = radius * 0.6
  const outerRadius = radius * 0.95

  // Current minute hand position in degrees (including seconds for smooth transition)
  const currentAngle = currentMinute * 6 + currentSecond * 0.1 // 6 degrees per minute + 0.1 per second

  return (
    <g className="task-segments">
      {tasks.map((task, index) => {
        const { x, y, rotation } = getTextTransform(task.startAngle, task.endAngle, radius)

        // Split segment into "past" and "future" parts based on time
        let pastSegment = null
        let futureSegment = null

        const taskStart = task.startAngle
        const taskEnd = task.endAngle

        // Use time-based logic instead of angle-based
        if (task.minutesUntilStart >= 0) {
          // Task hasn't started yet - entire segment is future
          futureSegment = { start: taskStart, end: taskEnd }
        } else if (task.minutesUntilEnd <= 0) {
          // Task has finished - entire segment is past
          pastSegment = { start: taskStart, end: taskEnd }
        } else {
          // Task is currently running - split at current angle (with seconds for smooth transition)
          // Calculate how much of the task has elapsed (including seconds)
          const elapsedMinutes = -task.minutesUntilStart
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
                opacity={0.3}
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
              stroke="white"
              strokeWidth="2"
            />

            {/* Task label (icon + text) - only show if task has some future part */}
            {futureSegment && (
              <g transform={`translate(${x}, ${y})`}>
                {/* Icon */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="32"
                  dy="-12"
                >
                  {task.icon}
                </text>

                {/* Task name */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="white"
                  dy="12"
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                >
                  {task.name}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </g>
  )
}

export default TaskSegments
