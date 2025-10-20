// Notification utilities

export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator
}

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.log('This browser does not support notifications')
    return { success: false, reason: 'unsupported' }
  }
  
  if (Notification.permission === 'granted') {
    return { success: true, reason: 'already-granted' }
  }
  
  if (Notification.permission === 'denied') {
    return { success: false, reason: 'blocked' }
  }
  
  try {
    const permission = await Notification.requestPermission()
    return { 
      success: permission === 'granted', 
      reason: permission === 'granted' ? 'granted' : 'denied'
    }
  } catch (error) {
    console.error('Error requesting permission:', error)
    return { success: false, reason: 'error' }
  }
}

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    // Check if service worker is available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          ...options
        })
      })
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: '/icon-192.png',
        ...options
      })
    }
  }
}

export const scheduleNotification = (type, waitTimeMs) => {
  // Schedule a notification to fire when user can smoke again
  setTimeout(() => {
    const typeText = type === 'cigarette' ? 'cigarette' : 'vape'
    showNotification(`Ready for your ${typeText}`, {
      body: `You can now have a ${typeText}. Tap to log it.`,
      tag: `ready-${type}`,
      requireInteraction: true,
      actions: [
        {
          action: 'log',
          title: 'Log Now'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    })
  }, waitTimeMs)
}

export const cancelScheduledNotifications = () => {
  // Note: This is a placeholder. Actual implementation would require
  // storing timeout IDs and clearing them
  console.log('Cancelling scheduled notifications')
}
