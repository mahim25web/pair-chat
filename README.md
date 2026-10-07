# PairChat

**PairChat** is a lightweight, real-time private messaging web application built for seamless, end-to-end 1-on-1 communication. It operates entirely without a traditional custom backend server, leveraging Firebase Realtime Database for instant synchronization and session management.

---

## ⚡ Key Features

- **Strict 2-Person Limit:** Built-in room capacity enforcement that automatically prevents third-party entry once two participants have joined.
- **Real-Time Sync:** Instant messaging and precise timestamps powered by Firebase Realtime Database.
- **Live Presence Indicators:** Dynamic online/offline status tracking for active room participants.
- **Desktop & Audio Alerts:** Native browser notifications and sound pings for incoming messages when the window is unfocused.
- **Zero Authentication Required:** Instant room creation and joining flow using generated user IDs and optional custom display names.
- **Modern Dark UI:** Responsive layout with custom interface components crafted using modern CSS and standard JavaScript ES6 modules.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules)
- **Build Tool:** Vite
- **Database / Sync:** Firebase Realtime Database (`v10.12.2`)
- **Typography:** Plus Jakarta Sans (Google Fonts)

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your environment.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mahim25web/pair-chat.git](https://github.com/mahim25web/pair-chat.git)
   cd pair-chat
