# PairChat — Private Messenger

A lightweight, real-time, end-to-end web chat application designed strictly for two users per room. PairChat requires no server-side backend setups, running directly via Firebase Realtime Database.

## Features

* **Strict 2-Person Limit:** Rooms automatically block entry once two active participants join.
* **Real-time Messaging:** Instant message delivery and timestamping using Firebase Realtime Database.
* **Presence Tracking:** Live online/offline status indicators for your chat partner.
* **Browser Notifications & Audio Ping:** Audio alert and browser desktop notifications for incoming messages when the window is unfocused.
* **Zero Authentication Required:** Simple room creation and user join flow using custom UIDs and optional display names.
* **Responsive Dark Theme UI:** Styled with a dark aesthetic and custom controls using modern CSS and standard JavaScript modules.

## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules)
* **Backend / Database:** Firebase Realtime Database (v10.12.2)
* **Typography:** Plus Jakarta Sans (Google Fonts)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local `.env` file from `.env.example` and set `VITE_FIREBASE_API_KEY` to your Firebase web API key.
3. Start the development server:
   ```bash
   npm run dev
   ```

Firebase web API keys are included in browser code and are not secrets. Restrict the key in Google Cloud and secure access with Firebase Realtime Database rules; never put service-account credentials or other private server keys in this frontend project.
