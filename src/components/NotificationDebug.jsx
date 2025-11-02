import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

const NotificationDebug = () => {
  const [status, setStatus] = useState({
    notificationSupport: false,
    serviceWorkerSupport: false,
    pushManagerSupport: false,
    permission: 'unknown',
    swRegistered: false,
    error: null,
    userAgent: '',
    isSecureContext: false,
    protocol: ''
  })

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const newStatus = {
      notificationSupport: 'Notification' in window,
      serviceWorkerSupport: 'serviceWorker' in navigator,
      pushManagerSupport: 'PushManager' in window,
      permission: 'Notification' in window ? Notification.permission : 'not-supported',
      swRegistered: false,
      error: null,
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol
    }

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        newStatus.swRegistered = !!registration
      } catch (e) {
        newStatus.error = e.message
      }
    }

    setStatus(newStatus)
  }

  const requestPermissionDirect = async () => {
    if (!('Notification' in window)) {
      alert('❌ Notifications not supported on this browser')
      return
    }

    try {
      console.log('Current permission:', Notification.permission)
      console.log('User agent:', navigator.userAgent)
      console.log('Secure context:', window.isSecureContext)
      console.log('Protocol:', window.location.protocol)
      
      // Force a fresh permission request regardless of current state
      console.log('Requesting permission...')
      const permission = await Notification.requestPermission()
      console.log('Permission result:', permission)
      
      await checkStatus()
      
      if (permission === 'granted') {
        // Always use simple Notification API (no service worker needed!)
        console.log('Showing notification without service worker...')
        const notification = new Notification('✅ Success!', {
          body: 'Notifications are now enabled!',
          icon: '/icon-192.png',
          requireInteraction: false
        })
        
        notification.onclick = () => {
          console.log('Notification clicked!')
          notification.close()
        }
        
        alert('✅ Notification sent! Check your notification panel.')
      } else if (permission === 'denied') {
        alert('❌ Permission was DENIED.\n\n1. Tap the lock icon in address bar\n2. Find "Notifications"\n3. Change to "Allow"\n4. Reload the page')
      } else {
        alert('⚠️ Permission: ' + permission)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
      setStatus(prev => ({ ...prev, error: error.message }))
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="card bg-blue-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🔧 Notification Debug</h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Notification API:</span>
            <span className={status.notificationSupport ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {status.notificationSupport ? '✅ Supported' : '❌ Not Supported'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Service Worker:</span>
            <span className={status.serviceWorkerSupport ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {status.serviceWorkerSupport ? '✅ Supported' : '❌ Not Supported'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Push Manager:</span>
            <span className={status.pushManagerSupport ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {status.pushManagerSupport ? '✅ Supported' : '❌ Not Supported'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">SW Registered:</span>
            <span className={status.swRegistered ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
              {status.swRegistered ? '✅ Yes' : '⚠️ No'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Permission:</span>
            <span className={`font-bold ${
              status.permission === 'granted' ? 'text-green-600' :
              status.permission === 'denied' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {status.permission === 'granted' ? '✅ Granted' :
               status.permission === 'denied' ? '❌ Denied' :
               status.permission === 'default' ? '⚠️ Not Asked' :
               '❓ Unknown'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Secure Context:</span>
            <span className={status.isSecureContext ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {status.isSecureContext ? '✅ Yes' : '❌ No'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Protocol:</span>
            <span className="text-gray-800 font-mono text-xs">
              {status.protocol}
            </span>
          </div>

          {!status.serviceWorkerSupport && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-orange-800 text-xs"><strong>⚠️ Service Workers not available!</strong> This might be because you're in incognito mode or the site is not secure.</p>
            </div>
          )}

          {status.error && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-red-800 text-xs"><strong>Error:</strong> {status.error}</p>
            </div>
          )}

          {status.userAgent && (
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600">View User Agent</summary>
              <p className="mt-2 text-gray-500 break-all">{status.userAgent}</p>
            </details>
          )}
        </div>
      </div>

      <button
        onClick={requestPermissionDirect}
        className="w-full card bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:shadow-2xl transition-all active:scale-95 border-4 border-yellow-600"
      >
        <div className="flex items-center justify-center gap-3 py-2">
          <Bell className="w-8 h-8 animate-bounce" />
          <div className="text-left">
            <h3 className="font-bold text-xl">TAP TO REQUEST PERMISSION</h3>
            <p className="text-sm opacity-90">Direct permission request</p>
          </div>
        </div>
      </button>

      <button
        onClick={checkStatus}
        className="w-full btn-secondary"
      >
        🔄 Refresh Status
      </button>

      <div className="bg-yellow-50 p-4 rounded-lg text-sm">
        <p className="text-yellow-900">
          <strong>📱 Android Chrome Tips:</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-800">
          <li><strong>NOT in incognito/private mode</strong> (Service Workers disabled there)</li>
          <li>Clear site data: Settings → Site Settings → {window.location.hostname} → Clear & Reset</li>
          <li>Manually enable: Lock icon → Notifications → Allow</li>
          <li>Then reload the page</li>
        </ul>
      </div>

      {status.permission === 'denied' && (
        <div className="bg-red-50 p-4 rounded-lg text-sm">
          <p className="text-red-900 font-bold mb-2">
            🚫 Notifications are BLOCKED
          </p>
          <ol className="list-decimal list-inside space-y-1 text-red-800">
            <li>Tap the <strong>lock icon 🔒</strong> in the address bar</li>
            <li>Find <strong>"Notifications"</strong></li>
            <li>Change from "Block" to <strong>"Allow"</strong></li>
            <li><strong>Reload this page</strong></li>
            <li>Try the button again</li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default NotificationDebug
