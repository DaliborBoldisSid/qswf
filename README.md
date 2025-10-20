# Quit Smoking & Vaping App 🚭

A Progressive Web App (PWA) that helps users gradually quit smoking and vaping through personalized reduction plans, smart notifications, and achievement tracking.

## Features ✨

- **Personalized Quitting Plans**: Choose from slow, medium, or quick reduction paces
- **Smart Notifications**: Get notified when you're allowed to smoke/vape
- **Dual Tracking**: Track both cigarettes and vapes separately
- **Achievement System**: Unlock achievements as you progress
- **Comprehensive Stats**: View detailed charts and progress metrics
- **Offline Support**: Works even without internet connection
- **Mobile-First Design**: Beautiful, modern UI optimized for mobile devices
- **Persistent Data**: All data saved locally, survives page reloads

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- (Optional) Android Studio for APK signing

### Quick Start

1. **Build the app and create APK:**
   ```powershell
   .\build-apk.ps1
   ```

   This script will:
   - Install all dependencies
   - Create app icons
   - Build the production version
   - Start a preview server at http://localhost:3000

2. **For development:**
   ```bash
   npm install
   npm run dev
   ```

## Creating an APK 📱

### Method 1: PWA Builder (Recommended - Easy)

1. Run the build script: `.\build-apk.ps1`
2. Once the server starts, go to https://www.pwabuilder.com/
3. Enter `http://localhost:3000` (or your deployed URL)
4. Click "Build My PWA"
5. Select "Android" and download the package
6. Follow PWA Builder's instructions to sign and install

### Method 2: Bubblewrap CLI (Advanced)

1. Run the build script: `.\build-apk.ps1`
2. Initialize Bubblewrap:
   ```bash
   bubblewrap init --manifest http://localhost:3000/manifest.webmanifest
   ```
3. Configure your app details (package name, etc.)
4. Build the APK:
   ```bash
   bubblewrap build
   ```
5. The APK will be in the `app-release-signed.apk` file

### Method 3: Deploy and Use PWA Builder Online

1. Build the app: `npm run build`
2. Deploy the `dist` folder to a hosting service (Netlify, Vercel, GitHub Pages, etc.)
3. Go to https://www.pwabuilder.com/
4. Enter your deployed URL
5. Download the Android package

## Using the App 📱

### First Time Setup

1. Open the app
2. Answer the onboarding questions:
   - How many cigarettes per week?
   - How many vapes per week?
   - Choose your reduction pace (slow/medium/quick)
3. Grant notification permissions when prompted
4. Your personalized plan is ready!

### Daily Use

1. **Dashboard**: See when you can next smoke/vape
2. **Log**: Tap the button when you smoke/vape (only available when allowed)
3. **Stats**: View your progress, charts, and savings
4. **Achievements**: Track unlocked achievements and milestones

### Notifications

The app will notify you when:
- You're allowed to have a cigarette/vape
- You unlock a new achievement
- You log a smoke/vape session

## How It Works 🔧

### Reduction Algorithm

The app gradually reduces your consumption based on your chosen pace:
- **Slow**: 5% reduction per week
- **Medium**: 10% reduction per week
- **Quick**: 15% reduction per week

The algorithm calculates wait times between smokes to distribute them evenly throughout your waking hours.

### Achievement System

Earn achievements by:
- Completing days and weeks
- Reducing consumption percentages
- Saving money
- Maintaining streaks
- Following your plan

### Data Persistence

All data is stored locally in your browser using LocalStorage:
- User preferences
- Quitting plan
- Log history
- Achievements
- Progress stats

## Technology Stack 💻

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin with Workbox
- **Date Handling**: date-fns

## Browser Support 🌐

- Chrome/Edge: Full support (recommended for Android)
- Firefox: Full support
- Safari: Full support (iOS PWAs have limited notification support)

## Project Structure 📁

```
qswf/
├── public/
│   ├── sw.js              # Service worker for notifications
│   ├── icon-192.png       # App icon (192x192)
│   └── icon-512.png       # App icon (512x512)
├── src/
│   ├── components/
│   │   ├── Onboarding.jsx    # Initial setup flow
│   │   ├── Dashboard.jsx     # Main app screen
│   │   ├── Stats.jsx         # Statistics and charts
│   │   └── Achievements.jsx  # Achievement tracking
│   ├── utils/
│   │   ├── storage.js        # LocalStorage utilities
│   │   ├── quittingLogic.js  # Reduction algorithm
│   │   ├── notifications.js  # Notification system
│   │   ├── achievements.js   # Achievement logic
│   │   └── quotes.js         # Motivational quotes
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── build-apk.ps1          # Build and APK creation script
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

## Troubleshooting 🔧

### Notifications not working on Android Chrome

1. Ensure you granted notification permissions
2. Check that the app is installed as PWA (Add to Home Screen)
3. Check Chrome settings → Site Settings → Notifications

### App not updating after changes

1. Unregister the service worker in DevTools
2. Clear cache and reload
3. Reinstall the PWA

### Build fails

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Make sure Node.js version is 16+

## Privacy 🔒

- All data is stored locally on your device
- No data is sent to any server
- No analytics or tracking
- No account required

## Contributing 🤝

Feel free to fork this project and customize it for your needs!

## License 📄

MIT License - feel free to use this app for personal or commercial purposes.

## Support 💬

If you find this app helpful in your quitting journey, please share it with others who might benefit!

---

**Remember**: Quitting is a journey, not a destination. Be patient with yourself and celebrate every small victory! 🎉
