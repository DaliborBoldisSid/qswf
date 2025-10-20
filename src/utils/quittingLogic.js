// Quitting plan logic and calculations

export const PLAN_SPEEDS = {
  SLOW: 'slow',
  MEDIUM: 'medium',
  QUICK: 'quick'
}

// Reduction percentages per week based on speed
const REDUCTION_RATES = {
  [PLAN_SPEEDS.SLOW]: 0.05,    // 5% reduction per week
  [PLAN_SPEEDS.MEDIUM]: 0.10,  // 10% reduction per week
  [PLAN_SPEEDS.QUICK]: 0.15    // 15% reduction per week
}

// Calculate initial wait time between smokes (in minutes)
export const calculateInitialWaitTime = (weeklyAmount) => {
  // Total minutes in a week = 10080
  // Assuming average waking hours = 16 hours/day = 112 hours/week = 6720 minutes
  const wakingMinutesPerWeek = 6720
  return Math.floor(wakingMinutesPerWeek / weeklyAmount)
}

// Generate a complete quitting plan
export const generateQuitPlan = (userData) => {
  const { 
    cigarettesPerWeek = 0, 
    vapesPerWeek = 0, 
    planSpeed,
    startDate = Date.now()
  } = userData

  const totalPerWeek = cigarettesPerWeek + vapesPerWeek
  const cigPercentage = cigarettesPerWeek / totalPerWeek
  const vapePercentage = vapesPerWeek / totalPerWeek
  
  const reductionRate = REDUCTION_RATES[planSpeed] || REDUCTION_RATES[PLAN_SPEEDS.MEDIUM]
  
  const plan = {
    startDate,
    planSpeed,
    originalCigarettesPerWeek: cigarettesPerWeek,
    originalVapesPerWeek: vapesPerWeek,
    cigPercentage,
    vapePercentage,
    reductionRate,
    weeks: []
  }

  let currentTotal = totalPerWeek
  let weekNumber = 0
  
  while (currentTotal > 0.5) {
    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + (weekNumber * 7))
    
    const cigarettesThisWeek = Math.round(currentTotal * cigPercentage)
    const vapesThisWeek = Math.round(currentTotal * vapePercentage)
    
    const waitTimeCigs = cigarettesThisWeek > 0 ? calculateInitialWaitTime(cigarettesThisWeek) : 0
    const waitTimeVapes = vapesThisWeek > 0 ? calculateInitialWaitTime(vapesThisWeek) : 0
    
    plan.weeks.push({
      weekNumber,
      weekStart: weekStart.toISOString(),
      totalAllowed: Math.round(currentTotal),
      cigarettesAllowed: cigarettesThisWeek,
      vapesAllowed: vapesThisWeek,
      waitTimeCigs, // minutes
      waitTimeVapes // minutes
    })
    
    currentTotal = currentTotal * (1 - reductionRate)
    weekNumber++
    
    // Safety limit to prevent infinite loops
    if (weekNumber > 100) break
  }
  
  // Add final week with 0
  const finalWeekStart = new Date(startDate)
  finalWeekStart.setDate(finalWeekStart.getDate() + (weekNumber * 7))
  
  plan.weeks.push({
    weekNumber,
    weekStart: finalWeekStart.toISOString(),
    totalAllowed: 0,
    cigarettesAllowed: 0,
    vapesAllowed: 0,
    waitTimeCigs: 0,
    waitTimeVapes: 0
  })
  
  plan.estimatedQuitDate = finalWeekStart.toISOString()
  plan.totalWeeks = weekNumber + 1
  
  return plan
}

// Get current week's plan based on current date
export const getCurrentWeekPlan = (quitPlan) => {
  if (!quitPlan || !quitPlan.weeks) return null
  
  const now = Date.now()
  const startDate = new Date(quitPlan.startDate).getTime()
  
  const weeksPassed = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000))
  
  // Find the appropriate week
  const currentWeek = quitPlan.weeks.find(week => week.weekNumber === weeksPassed)
  
  return currentWeek || quitPlan.weeks[quitPlan.weeks.length - 1]
}

// Check if user can smoke/vape now
export const canSmokeNow = (type, lastLog, currentWeekPlan) => {
  if (!currentWeekPlan) return false
  
  const waitTime = type === 'cigarette' 
    ? currentWeekPlan.waitTimeCigs 
    : currentWeekPlan.waitTimeVapes
  
  if (waitTime === 0) return false // No more allowed this week
  
  if (!lastLog) return true // First one
  
  const timeSinceLastLog = Date.now() - lastLog.timestamp
  const waitTimeMs = waitTime * 60 * 1000
  
  return timeSinceLastLog >= waitTimeMs
}

// Get time until next allowed smoke
export const getTimeUntilNext = (type, lastLog, currentWeekPlan) => {
  if (!currentWeekPlan || !lastLog) return 0
  
  const waitTime = type === 'cigarette' 
    ? currentWeekPlan.waitTimeCigs 
    : currentWeekPlan.waitTimeVapes
  
  if (waitTime === 0) return Infinity
  
  const timeSinceLastLog = Date.now() - lastLog.timestamp
  const waitTimeMs = waitTime * 60 * 1000
  
  return Math.max(0, waitTimeMs - timeSinceLastLog)
}
