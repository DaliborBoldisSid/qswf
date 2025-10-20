import { useState, useEffect } from 'react'
import { Cigarette, Wind, Clock, CheckCircle, Trophy, TrendingDown, Calendar, Bell } from 'lucide-react'
import { getCurrentWeekPlan, canSmokeNow, getTimeUntilNext } from '../utils/quittingLogic'
import { getDailyQuote } from '../utils/quotes'
import { requestNotificationPermission, showNotification, getNotificationPermission } from '../utils/notifications'

const Dashboard = ({ userData, quitPlan, logs, onLogSmoke, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [selectedType, setSelectedType] = useState(null)
  const [notificationPermission, setNotificationPermission] = useState(getNotificationPermission())
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentWeekPlan = getCurrentWeekPlan(quitPlan)
  
  const lastCigLog = [...logs].filter(l => l.type === 'cigarette').sort((a, b) => b.timestamp - a.timestamp)[0]
  const lastVapeLog = [...logs].filter(l => l.type === 'vape').sort((a, b) => b.timestamp - a.timestamp)[0]
  
  const canSmokeCig = canSmokeNow('cigarette', lastCigLog, currentWeekPlan)
  const canSmokeVape = canSmokeNow('vape', lastVapeLog, currentWeekPlan)
  
  const timeUntilCig = getTimeUntilNext('cigarette', lastCigLog, currentWeekPlan)
  const timeUntilVape = getTimeUntilNext('vape', lastVapeLog, currentWeekPlan)

  const formatTime = (ms) => {
    if (ms === Infinity) return 'No more this week'
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}h${minutes}m${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m${seconds}s`
    }
    return `${seconds}s`
  }

  const handleLog = (type) => {
    setSelectedType(type)
  }

  const confirmLog = () => {
    if (selectedType) {
      onLogSmoke(selectedType)
      setSelectedType(null)
    }
  }

  const todaysLogsCount = logs.filter(log => {
    const logDate = new Date(log.timestamp)
    const today = new Date()
    return logDate.toDateString() === today.toDateString()
  }).length

  const weekStartDate = new Date(currentWeekPlan?.weekStart)
  const weekNumber = currentWeekPlan?.weekNumber || 0

  const handleTestNotification = async () => {
    console.log('Button tapped, current permission:', getNotificationPermission())
    
    // Check current permission state
    const currentPerm = getNotificationPermission()
    
    if (currentPerm === 'denied') {
      setShowInstructions(true)
      return
    }
    
    if (currentPerm === 'default') {
      // Need to request permission
      try {
        console.log('Requesting notification permission...')
        const result = await requestNotificationPermission()
        console.log('Permission result:', result)
        
        setNotificationPermission(getNotificationPermission())
        
        if (result.success) {
          showNotification('🎉 Notifications Enabled!', {
            body: 'You will now receive alerts when you can smoke/vape.',
            tag: 'test-notification',
            vibrate: [200, 100, 200]
          })
        } else if (result.reason === 'blocked') {
          setShowInstructions(true)
        } else if (result.reason === 'denied') {
          alert('❌ Permission denied. Tap the button again to try once more.')
        }
      } catch (error) {
        console.error('Error requesting permission:', error)
        alert('Error requesting permission. Please try again.')
      }
    } else if (currentPerm === 'granted') {
      // Already granted, just test
      showNotification('✅ Test Notification', {
        body: 'Notifications are working! You will be notified when you can smoke.',
        tag: 'test-notification',
        vibrate: [200, 100, 200],
        requireInteraction: false
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-blue-500 to-purple-600 pb-20">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Week {weekNumber + 1}</h1>
              <p className="text-sm text-white/80">
                {weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => onNavigate('achievements')}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <Trophy className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Daily Quote */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-white">
          <p className="text-center italic">{getDailyQuote()}</p>
        </div>

        {/* Notification Test Button */}
        {notificationPermission === 'denied' && (
          <button
            onClick={() => setShowInstructions(true)}
            className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 hover:shadow-2xl transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800">⚠️ Notifications Blocked</h3>
                <p className="text-sm text-gray-600">Tap for instructions to enable</p>
              </div>
            </div>
          </button>
        )}

        {notificationPermission === 'default' && (
          <button
            onClick={handleTestNotification}
            className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 hover:shadow-2xl transition-all active:scale-95 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800 text-lg">🔔 TAP HERE to Enable Notifications</h3>
                <p className="text-sm text-gray-600 font-semibold">Required for smoke/vape reminders</p>
              </div>
            </div>
          </button>
        )}

        {notificationPermission === 'granted' && (
          <button
            onClick={handleTestNotification}
            className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 hover:shadow-2xl transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800">✅ Test Notification</h3>
                <p className="text-sm text-gray-600">Tap to send a test notification</p>
              </div>
            </div>
          </button>
        )}

        {/* Today's Progress */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Today's Activity</h3>
              <p className="text-sm text-gray-600">Logged {todaysLogsCount} times today</p>
            </div>
          </div>
        </div>

        {/* Cigarette Card */}
        {currentWeekPlan && currentWeekPlan.cigarettesAllowed > 0 && (
          <div className={`card border-2 ${canSmokeCig ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Cigarette className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Cigarette</h3>
                  <p className="text-sm text-gray-600">
                    {currentWeekPlan.cigarettesAllowed} allowed this week
                  </p>
                </div>
              </div>
              {canSmokeCig && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {!canSmokeCig && (
              <div className="bg-orange-50 p-3 rounded-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-800">Next available in:</p>
                  <p className="text-lg font-bold text-orange-600">{formatTime(timeUntilCig)}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => handleLog('cigarette')}
              disabled={!canSmokeCig}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                canSmokeCig
                  ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canSmokeCig ? 'Log Cigarette' : 'Not Available Yet'}
            </button>
          </div>
        )}

        {/* Vape Card */}
        {currentWeekPlan && currentWeekPlan.vapesAllowed > 0 && (
          <div className={`card border-2 ${canSmokeVape ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wind className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Vape Session</h3>
                  <p className="text-sm text-gray-600">
                    {currentWeekPlan.vapesAllowed} allowed this week
                  </p>
                </div>
              </div>
              {canSmokeVape && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {!canSmokeVape && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-800">Next available in:</p>
                  <p className="text-lg font-bold text-blue-600">{formatTime(timeUntilVape)}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => handleLog('vape')}
              disabled={!canSmokeVape}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                canSmokeVape
                  ? 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canSmokeVape ? 'Log Vape Session' : 'Not Available Yet'}
            </button>
          </div>
        )}

        {/* Week Summary */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">This Week's Plan</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <Cigarette className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-orange-900">{currentWeekPlan?.cigarettesAllowed || 0}</p>
              <p className="text-sm text-orange-700">Cigarettes</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <Wind className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-900">{currentWeekPlan?.vapesAllowed || 0}</p>
              <p className="text-sm text-blue-700">Vapes</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span>Reducing gradually each week</span>
          </div>
        </div>

        {/* Quick Stats */}
        <button
          onClick={() => onNavigate('stats')}
          className="card hover:shadow-2xl transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">View Detailed Stats</h3>
              <p className="text-sm text-gray-600">Charts, achievements & more</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </button>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Enable Notifications
              </h3>
            </div>
            
            <div className="space-y-4 text-left">
              <p className="text-gray-700">
                Notifications are currently <strong>blocked</strong> in Chrome. Follow these steps:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-800">Tap the lock icon</p>
                    <p className="text-sm text-gray-600">In the address bar at the top</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-800">Find "Notifications"</p>
                    <p className="text-sm text-gray-600">In the permissions list</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-800">Change to "Allow"</p>
                    <p className="text-sm text-gray-600">Tap and select "Allow"</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <div>
                    <p className="font-semibold text-gray-800">Reload the page</p>
                    <p className="text-sm text-gray-600">Refresh to apply changes</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can also enable notifications in Chrome Settings → Site Settings → Notifications
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInstructions(false)}
                className="btn-secondary flex-1"
              >
                Got it
              </button>
              <button
                onClick={() => {
                  setShowInstructions(false)
                  window.location.reload()
                }}
                className="btn-primary flex-1"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto ${selectedType === 'cigarette' ? 'bg-orange-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mb-4`}>
                {selectedType === 'cigarette' ? (
                  <Cigarette className="w-8 h-8 text-orange-600" />
                ) : (
                  <Wind className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm {selectedType === 'cigarette' ? 'Cigarette' : 'Vape Session'}
              </h3>
              <p className="text-gray-600">
                Are you sure you want to log this {selectedType === 'cigarette' ? 'cigarette' : 'vape session'}?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedType(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmLog}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                  selectedType === 'cigarette' 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
