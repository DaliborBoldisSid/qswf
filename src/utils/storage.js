// Local storage utility for persistence
const STORAGE_KEYS = {
  USER_DATA: 'qswf_user_data',
  QUIT_PLAN: 'qswf_quit_plan',
  LOGS: 'qswf_logs',
  ACHIEVEMENTS: 'qswf_achievements',
  ONBOARDING: 'qswf_onboarding_complete'
}

export const storage = {
  saveUserData: (data) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data))
  },
  
  getUserData: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return data ? JSON.parse(data) : null
  },
  
  saveQuitPlan: (plan) => {
    localStorage.setItem(STORAGE_KEYS.QUIT_PLAN, JSON.stringify(plan))
  },
  
  getQuitPlan: () => {
    const plan = localStorage.getItem(STORAGE_KEYS.QUIT_PLAN)
    return plan ? JSON.parse(plan) : null
  },
  
  saveLogs: (logs) => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
  },
  
  getLogs: () => {
    const logs = localStorage.getItem(STORAGE_KEYS.LOGS)
    return logs ? JSON.parse(logs) : []
  },
  
  addLog: (log) => {
    const logs = storage.getLogs()
    logs.push({ ...log, timestamp: Date.now() })
    storage.saveLogs(logs)
  },
  
  saveAchievements: (achievements) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements))
  },
  
  getAchievements: () => {
    const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
    return achievements ? JSON.parse(achievements) : []
  },
  
  setOnboardingComplete: (complete) => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(complete))
  },
  
  isOnboardingComplete: () => {
    const complete = localStorage.getItem(STORAGE_KEYS.ONBOARDING)
    return complete ? JSON.parse(complete) : false
  },
  
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}
