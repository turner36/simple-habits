# Simple Habits (CS430 – Week 6)

Simple Habits is an Ionic 8 + Angular 20 application for the University of Arkansas Grantham CS430 course. 
This Week 6 milestone builds on the Week 5 proposal for a lightweight habit tracker and demonstrates a hybrid 
native capability by integrating the `cordova-plugin-vibration` plugin (used through `@awesome-cordova-plugins/vibration`) within a Capacitor 7 project. 
The first tab shows a live, in-app timestamp and a “Vibrate” button; on device, tapping the button produces a short haptic pulse. 
When the app runs in a plain browser without Cordova, it gracefully falls back to the Web Vibration API when available so development remains smooth.

To run the project, install dependencies, build the web bundle, synchronize the native project, and open Android Studio to deploy to a device. 
After launch, open Tab 1 and tap Vibrate to verify the plugin is active.

```bash
npm install
ionic build
npx cap sync
npx cap open android   # run from Android Studio on a device or emulator
# optional during development:
ionic serve            # http://localhost:8100
