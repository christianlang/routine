/**
 * Parse time string "HH:MM" to minutes since midnight
 */
export function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Get current time in minutes since midnight
 */
export function getCurrentMinutes(date) {
  return date.getHours() * 60 + date.getMinutes()
}

/**
 * Check if current time is within a routine's time range
 */
export function isInRoutine(currentMinutes, routineStart, routineEnd) {
  const start = parseTimeToMinutes(routineStart)
  const end = parseTimeToMinutes(routineEnd)
  return currentMinutes >= start && currentMinutes <= end
}

/**
 * Calculate which tasks should be visible in the rolling 60-minute window
 * Returns tasks with their position relative to the current minute hand
 */
export function calculateVisibleTasks(tasks, currentMinutes) {
  const visibleTasks = []

  tasks.forEach(task => {
    const taskStart = parseTimeToMinutes(task.startTime)
    const taskEnd = taskStart + task.duration

    // Calculate how many minutes from now until this task starts
    let minutesUntilStart = taskStart - currentMinutes

    // If task is in the past (within last 60 minutes), adjust
    if (minutesUntilStart < -60) {
      // Task is too far in the past, skip it
      return
    }

    // If task is in the future (more than 60 minutes away)
    if (minutesUntilStart >= 60) {
      // Task is too far in the future, skip it
      return
    }

    // Task is visible in the window
    visibleTasks.push({
      ...task,
      startAngle: (minutesUntilStart / 60) * 360, // Degrees from current position
      endAngle: ((minutesUntilStart + task.duration) / 60) * 360,
      isActive: minutesUntilStart <= 0 && minutesUntilStart + task.duration > 0
    })
  })

  return visibleTasks
}

/**
 * Get active routine based on current time
 */
export function getActiveRoutine(routines, currentTime) {
  const currentMinutes = getCurrentMinutes(currentTime)

  // Check morning routine
  if (routines.morning && isInRoutine(currentMinutes, routines.morning.startTime, routines.morning.endTime)) {
    return { type: 'morning', data: routines.morning }
  }

  // Check evening routine (when implemented)
  if (routines.evening && isInRoutine(currentMinutes, routines.evening.startTime, routines.evening.endTime)) {
    return { type: 'evening', data: routines.evening }
  }

  return null
}
