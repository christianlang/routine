const ClockHands = ({ currentTime, center, radius }) => {
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()

  // Calculate angles (0 degrees is at 12 o'clock)
  // Hour hand: 30 degrees per hour + 0.5 degrees per minute
  const hourAngle = ((hours % 12) * 30 + minutes * 0.5 - 90) * (Math.PI / 180)

  // Minute hand: 6 degrees per minute + 0.1 degrees per second
  const minuteAngle = (minutes * 6 + seconds * 0.1 - 90) * (Math.PI / 180)

  // Hour hand dimensions
  const hourHandLength = radius * 0.5
  const hourHandWidth = 8
  const hourHandX = center + hourHandLength * Math.cos(hourAngle)
  const hourHandY = center + hourHandLength * Math.sin(hourAngle)

  // Minute hand dimensions
  const minuteHandLength = radius * 0.75
  const minuteHandWidth = 6
  const minuteHandX = center + minuteHandLength * Math.cos(minuteAngle)
  const minuteHandY = center + minuteHandLength * Math.sin(minuteAngle)

  return (
    <g className="clock-hands">
      {/* Hour hand */}
      <line
        x1={center}
        y1={center}
        x2={hourHandX}
        y2={hourHandY}
        stroke="var(--clock-hand)"
        strokeWidth={hourHandWidth}
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={center}
        y1={center}
        x2={minuteHandX}
        y2={minuteHandY}
        stroke="var(--clock-hand)"
        strokeWidth={minuteHandWidth}
        strokeLinecap="round"
      />
    </g>
  )
}

export default ClockHands
