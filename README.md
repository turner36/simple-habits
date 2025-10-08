# Simple Habits (CS430 – Final Project)

**Simple Habits** is an Ionic 8 + Angular 20 mobile application created for the University of Arkansas Grantham **CS430 – Mobile Application Development** course.  
This final milestone expands on earlier weeks to deliver a fully functional **habit tracking app** featuring:

- **Firebase integration** using the modern Web SDK for data storage and retrieval  
- **Anonymous authentication** to securely separate user data  
- **Real-time updates** with Firestore snapshot streams  
- **Native vibration feedback** via `@awesome-cordova-plugins/vibration`  
- A clean three-tab layout built with **Ionic UI components**

---

## App Overview

| Tab | Description |
|-----|--------------|
| **Dashboard** | Add new habits, choose frequency (daily/weekly), and log completions.  Displays live timestamp and sends vibration feedback when habits are logged. |
| **Progress** | Displays all habits and dynamically calculates **Total Streak** using live Firestore updates. |
| **Settings** | Shows the current Firebase **anonymous UID**, confirming active authentication. |

All data is stored in Firestore under each user’s document path: users/{uid}/habits/{habitId}


```json
{
  "name": "Running",
  "frequency": "daily",
  "streak": 5,
  "lastCompleted": "2025-10-07"
}
```
## Setup and Instructions

# 1. Install dependencies
npm install

# 2. Build the web bundle
ionic build

# 3. Sync the native Android project
npx cap sync

# 4. Run on a connected Android device or emulator
npx cap run android --device

# Optional: run in browser for quick testing
ionic serve




