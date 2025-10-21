# Expo WebView + Notifications + HLS Video Player

This Expo Router app embeds a web experience, schedules rich local notifications, and streams HLS video with custom controls. It is built with Expo SDK 54, `react-native-webview`, `expo-av`, and `expo-notifications`.

## Features
- WebView screen renders `https://expo.dev` with a loading overlay and two notification buttons (3s and 5s delays).
- Local notifications request permissions on demand, configure an Android channel, and support foreground banners, sound, and tap handling.
- Tapping the “Reminder” notification deep-links straight into the video screen.
- Video screen streams HLS using `expo-av`, surfaces play/pause, skip, mute, and fullscreen controls, and clamps seeking within the available duration.
- Users can switch between three predefined HLS streams without leaving the page.
- Gradient-driven UI, glassmorphism cards, and typography tuned for production-ready polish.
- Stack navigation via Expo Router (`/`, `/webview`, `/video`) with safe-area support.

## Bonus Highlights
1. WebView triggers a “loaded” notification after the first successful load.
2. Reminder notification opens the video player when tapped, even from the notification tray.
3. Custom playback controls (play/pause, ±10s seek, mute, fullscreen) replace native controls.
4. Stream selector lets you toggle between multiple HLS sources.

## Project Structure
- `app/index.tsx` – Home screen hero card & entry point.
- `app/webview.tsx` – Embedded site + notifications with premium container UI.
- `app/video.tsx` – HLS player with custom controls and stream switcher.
- `app/_layout.tsx` – Navigation stack and notification response handling.
- `src/utils/notifications.ts` – Notification helper + Android channel configuration.

## Getting Started
1. Install dependencies: `npm install`
2. Launch the dev server: `npx expo start`
3. Scan the QR code with Expo Go (or run on iOS/Android simulator). Accept notification permissions when prompted.

## Testing Tips
- Tap each notification button and confirm banners appear after the expected delay.
- Background the app, tap the “Reminder” notification, and verify you land on the video screen.
- Switch between streams and exercise the custom controls (mute, seek, fullscreen) to confirm responsiveness.
