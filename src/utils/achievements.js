// Achievement system

export const ACHIEVEMENTS = [
  {
    id: 'first_day',
    title: 'First Day',
    description: 'Complete your first day',
    icon: '🌟',
    condition: (stats) => stats.daysActive >= 1
  },
  {
    id: 'first_week',
    title: 'One Week Strong',
    description: 'Complete your first week',
    icon: '💪',
    condition: (stats) => stats.daysActive >= 7
  },
  {
    id: 'two_weeks',
    title: 'Two Weeks',
    description: 'Complete two weeks on the plan',
    icon: '🔥',
    condition: (stats) => stats.daysActive >= 14
  },
  {
    id: 'one_month',
    title: 'One Month Warrior',
    description: 'A full month of progress',
    icon: '🏆',
    condition: (stats) => stats.daysActive >= 30
  },
  {
    id: 'reducer_10',
    title: 'Reducer',
    description: 'Reduce consumption by 10%',
    icon: '📉',
    condition: (stats) => stats.reductionPercentage >= 10
  },
  {
    id: 'reducer_25',
    title: 'Quarter Master',
    description: 'Reduce consumption by 25%',
    icon: '🎯',
    condition: (stats) => stats.reductionPercentage >= 25
  },
  {
    id: 'reducer_50',
    title: 'Half Way Hero',
    description: 'Reduce consumption by 50%',
    icon: '⭐',
    condition: (stats) => stats.reductionPercentage >= 50
  },
  {
    id: 'reducer_75',
    title: 'Almost There',
    description: 'Reduce consumption by 75%',
    icon: '💎',
    condition: (stats) => stats.reductionPercentage >= 75
  },
  {
    id: 'perfect_day',
    title: 'Perfect Day',
    description: 'Stay within limits for a full day',
    icon: '✨',
    condition: (stats) => stats.perfectDays >= 1
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Stay within limits for 7 days straight',
    icon: '🌈',
    condition: (stats) => stats.perfectDays >= 7
  },
  {
    id: 'money_saver_50',
    title: 'Penny Saver',
    description: 'Save $50 by reducing',
    icon: '💰',
    condition: (stats) => stats.moneySaved >= 50
  },
  {
    id: 'money_saver_100',
    title: 'Money Master',
    description: 'Save $100 by reducing',
    icon: '💵',
    condition: (stats) => stats.moneySaved >= 100
  },
  {
    id: 'money_saver_500',
    title: 'Financial Freedom',
    description: 'Save $500 by reducing',
    icon: '🏦',
    condition: (stats) => stats.moneySaved >= 500
  },
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Log for 3 days in a row',
    icon: '🔄',
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'streak_7',
    title: 'Week Streaker',
    description: 'Log for 7 days in a row',
    icon: '⚡',
    condition: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'streak_30',
    title: 'Unstoppable',
    description: 'Log for 30 days in a row',
    icon: '🚀',
    condition: (stats) => stats.currentStreak >= 30
  }
]

export const checkAchievements = (stats, currentAchievements = []) => {
  const newAchievements = []
  
  ACHIEVEMENTS.forEach(achievement => {
    const alreadyUnlocked = currentAchievements.some(a => a.id === achievement.id)
    
    if (!alreadyUnlocked && achievement.condition(stats)) {
      newAchievements.push({
        ...achievement,
        unlockedAt: Date.now()
      })
    }
  })
  
  return newAchievements
}

export const calculateStats = (logs, quitPlan, userData) => {
  if (!quitPlan || !userData) {
    return {
      daysActive: 0,
      totalLogged: 0,
      reductionPercentage: 0,
      moneySaved: 0,
      currentStreak: 0,
      perfectDays: 0
    }
  }
  
  const startDate = new Date(quitPlan.startDate).getTime()
  const now = Date.now()
  const daysSinceStart = Math.floor((now - startDate) / (24 * 60 * 60 * 1000))
  
  const totalLogged = logs.length
  const cigarettesLogged = logs.filter(l => l.type === 'cigarette').length
  const vapesLogged = logs.filter(l => l.type === 'vape').length
  
  // Calculate average per week based on logs
  const weeksSinceStart = Math.max(1, daysSinceStart / 7)
  const currentCigsPerWeek = (cigarettesLogged / weeksSinceStart)
  const currentVapesPerWeek = (vapesLogged / weeksSinceStart)
  
  const originalTotal = quitPlan.originalCigarettesPerWeek + quitPlan.originalVapesPerWeek
  const currentTotal = currentCigsPerWeek + currentVapesPerWeek
  
  const reductionPercentage = Math.min(100, Math.max(0, 
    ((originalTotal - currentTotal) / originalTotal) * 100
  ))
  
  // Calculate money saved (assuming $8 per pack of 20 cigs, $15 per vape)
  const cigsSaved = Math.max(0, (quitPlan.originalCigarettesPerWeek * weeksSinceStart) - cigarettesLogged)
  const vapesSaved = Math.max(0, (quitPlan.originalVapesPerWeek * weeksSinceStart) - vapesLogged)
  
  const moneySaved = (cigsSaved * 0.4) + (vapesSaved * 15) // $0.4 per cig, $15 per vape pod
  
  // Calculate streak
  let currentStreak = 0
  if (logs.length > 0) {
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp)
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 365; i++) {
      const dayLogs = sortedLogs.filter(log => {
        const logDate = new Date(log.timestamp)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === checkDate.getTime()
      })
      
      if (dayLogs.length > 0) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }
  
  // Calculate perfect days (days within limit)
  let perfectDays = 0
  // This would require more complex logic to track daily limits vs actuals
  
  return {
    daysActive: daysSinceStart,
    totalLogged,
    cigarettesLogged,
    vapesLogged,
    reductionPercentage: Math.round(reductionPercentage),
    moneySaved: Math.round(moneySaved * 100) / 100,
    currentStreak,
    perfectDays,
    weeksSinceStart: Math.floor(weeksSinceStart)
  }
}
