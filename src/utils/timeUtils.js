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
 * Calculate which tasks should be visible in the rolling window
 * Returns tasks with their absolute position on the clock face
 */
export function calculateVisibleTasks(tasks, currentMinutes) {
  const visibleTasks = []

  tasks.forEach(task => {
    const taskStart = parseTimeToMinutes(task.startTime)
    const taskEnd = taskStart + task.duration

    // Calculate how many minutes from now until this task starts/ends
    const minutesUntilStart = taskStart - currentMinutes
    const minutesUntilEnd = taskEnd - currentMinutes

    // Only show tasks that:
    // 1. Start within the next 45 minutes (not too far in future)
    // 2. Or are currently running
    // 3. Or ended within the last 15 minutes (grace period after completion)

    const isInFuture = minutesUntilStart >= 0 && minutesUntilStart < 45
    const isRunning = minutesUntilStart < 0 && minutesUntilEnd > 0
    const isRecentlyFinished = minutesUntilEnd <= 0 && minutesUntilEnd > -15

    if (!isInFuture && !isRunning && !isRecentlyFinished) {
      // Task is not in visible window
      return
    }

    // Calculate absolute minute positions on the clock (0-59)
    // The clock face shows minutes 0-59, where position corresponds to the minute value
    const taskStartMinute = taskStart % 60
    const taskEndMinute = taskEnd % 60

    // Convert minute positions to angles (0 degrees = 12 o'clock = minute 0)
    // Each minute = 6 degrees (360 / 60)
    const startAngle = taskStartMinute * 6
    let endAngle = taskEndMinute * 6

    // Handle tasks that wrap around the hour (e.g., 55 minutes to 5 minutes)
    if (taskEndMinute < taskStartMinute) {
      // Task wraps around, so endAngle should be > 360
      endAngle += 360
    }

    // Task is visible in the window
    visibleTasks.push({
      ...task,
      startAngle: startAngle,
      endAngle: endAngle,
      minutesUntilStart: minutesUntilStart,
      minutesUntilEnd: minutesUntilEnd,
      isActive: isRunning
    })
  })

  return visibleTasks
}

/**
 * Check if a routine has any tasks visible in the rolling window
 */
function hasVisibleTasks(routine, currentMinutes) {
  if (!routine || !routine.tasks) return false

  return routine.tasks.some(task => {
    const taskStart = parseTimeToMinutes(task.startTime)
    const taskEnd = taskStart + task.duration
    const minutesUntilStart = taskStart - currentMinutes
    const minutesUntilEnd = taskEnd - currentMinutes

    // Same logic as calculateVisibleTasks
    const isInFuture = minutesUntilStart >= 0 && minutesUntilStart < 45
    const isRunning = minutesUntilStart < 0 && minutesUntilEnd > 0
    const isRecentlyFinished = minutesUntilEnd <= 0 && minutesUntilEnd > -15

    return isInFuture || isRunning || isRecentlyFinished
  })
}

/**
 * Get active routine based on current time and rolling window
 */
export function getActiveRoutine(routines, currentTime) {
  const currentMinutes = getCurrentMinutes(currentTime)

  // Check morning routine - show if it has tasks in the 60-minute window
  if (routines.morning && hasVisibleTasks(routines.morning, currentMinutes)) {
    return { type: 'morning', data: routines.morning }
  }

  // Check evening routine (when implemented)
  if (routines.evening && hasVisibleTasks(routines.evening, currentMinutes)) {
    return { type: 'evening', data: routines.evening }
  }

  return null
}
