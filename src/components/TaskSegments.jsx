const TaskSegments = ({ tasks, center, radius }) => {
  /**
   * Create an SVG path for a segment arc
   */
  const createArcPath = (startAngle, endAngle, innerRadius, outerRadius) => {
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

  return (
    <g className="task-segments">
      {tasks.map((task, index) => {
        const { x, y, rotation } = getTextTransform(task.startAngle, task.endAngle, radius)

        return (
          <g key={index}>
            {/* Segment arc */}
            <path
              d={createArcPath(task.startAngle, task.endAngle, innerRadius, outerRadius)}
              fill={task.color}
              opacity={task.isActive ? 1 : 0.7}
              stroke="white"
              strokeWidth="2"
            />

            {/* Task label (icon + text) */}
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
          </g>
        )
      })}
    </g>
  )
}

export default TaskSegments
