<div align="center">

# 🚀 SmartDev Client Portal

### *A Modern, AI-Powered Client Management Platform*

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.7-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google AI](https://img.shields.io/badge/Google_Gemini-AI_Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<br/>

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" width="120" alt="SmartDev Logo"/>

<br/>

**SmartDev** is a cutting-edge client portal featuring AI-powered project consultation, intelligent booking management, and a stunning animated user interface.

[✨ Features](#-features) •
[🛠️ Tech Stack](#️-tech-stack) •
[🚀 Quick Start](#-quick-start) •
[📁 Project Structure](#-project-structure) •
[🤖 AI Integration](#-ai-integration)

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 **Beautiful UI/UX**
- 🌓 Dark/Light mode support
- 🎯 Custom animated cursor with color cycling
- ✨ Smooth Framer Motion animations
- 📱 Fully responsive design
- 🎭 Micro-interactions & hover effects

</td>
<td width="50%">

### 🤖 **AI-Powered**
- 💬 AI Project Consultant (Gemini)
- 🤝 Floating AI Copilot assistant
- 🧠 Context-aware conversations
- 🌍 Multilingual support (EN/FR/NL/DE)

</td>
</tr>
<tr>
<td width="50%">

### � **Client Management**
- 📊 Interactive Dashboard
- 📅 Smart Booking System
- 🎫 **Demo Booking** (No login required)
- 📁 Project Management
- 🔔 Real-time Notifications

</td>
<td width="50%">

### 🔐 **Admin Features**
- 👤 User Management
- ✅ Booking Approvals
- 📈 Analytics Overview
- 🛡️ Role-based Access

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19 • TypeScript • Vite |
| **Styling** | Tailwind CSS • Framer Motion |
| **Backend** | Node.js • Express |
| **AI** | Google Gemini API |
| **Icons** | Lucide React |
| **Charts** | Recharts |

</div>

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js v18+ 
npm or yarn
```

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/OUARAS-khelil-Rafik/SmartDev-ClientPortal.git

# Navigate to project
cd SmartDev-ClientPortal

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### ⚙️ Configuration

Create a `server/.env` file:

```env
# Get your API key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

### 🎯 Running the Application

**Option 1: Run Both Together (Recommended)**
```bash
npm run dev
```
This starts both frontend (port 3000) and backend (port 3001) simultaneously.

**Option 2: Run Separately**

Terminal 1 - Backend:
```bash
cd server
node index.js
```

Terminal 2 - Frontend:
```bash
npm run client
```

### 🌐 Access the App

| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:3000 |
| 🔌 Backend API | http://localhost:3001 |
| ❤️ Health Check | http://localhost:3001/api/health |

---

## 📁 Project Structure

```
SmartDev-ClientPortal/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 🎨 AdminDashboard.tsx    # Admin control panel
│   │   ├── 🤖 AIConsultant.tsx      # AI chat interface
│   │   ├── 🔐 Auth.tsx              # Authentication
│   │   ├── 📅 Booking.tsx           # Booking system (logged-in users)
│   │   ├── 🎫 DemoBooking.tsx       # Demo booking (no login required)
│   │   ├── 📊 Dashboard.tsx         # Client dashboard
│   │   ├── 💬 FloatingCopilot.tsx   # AI assistant widget
│   │   ├── 🏠 Hero.tsx              # Landing hero section
│   │   ├── 📁 MyProjects.tsx        # Project management
│   │   ├── 🧭 Navbar.tsx            # Navigation bar
│   │   ├── 🔔 Notifications.tsx     # Notification system
│   │   ├── 🛠️ Services.tsx          # Services showcase
│   │   └── 🎯 CustomCursor.tsx      # Animated cursor
│   │
│   ├── 📂 i18n/
│   │   ├── 🇬🇧 en.ts                 # English translations
│   │   ├── 🇫🇷 fr.ts                 # French translations
│   │   ├── 🇳🇱 nl.ts                 # Dutch translations
│   │   ├── 🇩🇪 de.ts                 # German translations
│   │   └── 📦 index.tsx             # i18n provider
│   │
│   ├── 📂 services/
│   │   ├── 🤖 geminiService.ts      # AI API client
│   │   └── 📡 mockApi.ts            # Mock data service
│   │
│   ├── 🎨 App.tsx                   # Main application
│   ├── 🎭 index.css                 # Global styles
│   ├── 📦 index.tsx                 # Entry point
│   └── 📝 types.ts                  # TypeScript types
│
├── 📂 server/
│   ├── 🚀 index.js                  # Express server
│   ├── 📦 package.json              # Server dependencies
│   ├── 🔒 .env                      # Environment variables
│   └── 📄 .env.example              # Environment template
│
├── 📄 package.json                  # Project dependencies
├── ⚡ vite.config.ts                # Vite configuration
├── 🎨 tailwind.config.cjs           # Tailwind configuration
└── 📝 tsconfig.json                 # TypeScript configuration
```

---

## 🎫 Demo Booking

SmartDev features a **Demo Booking** system that allows potential clients to schedule a demo without requiring an account:

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🚫 **No Login Required** | Book a demo without creating an account |
| 📝 **Simple Form** | Collect name, email, company, and phone |
| 📅 **Live Availability** | Real-time slot checking to prevent double-booking |
| 📧 **Admin Notifications** | Admins receive instant notifications of new demo requests |
| 🌍 **Fully Translated** | Available in all supported languages (EN/FR/NL/DE) |

### 📋 Booking Flow

1. Click **"Book a Demo"** on the homepage
2. Fill in contact information (name, email, optional company/phone)
3. Describe your project needs
4. Select available date and time slot
5. Submit request - Admin will confirm and send meeting link

---

## 🤖 AI Integration

SmartDev features two AI-powered assistants powered by **Google Gemini**:

### 💬 AI Project Consultant

A full-page AI consultant that helps clients:
- Define project requirements
- Get technology recommendations
- Understand project timelines
- Break down complex projects

### 🤝 Floating Copilot

A compact assistant widget that:
- Helps navigate the website
- Answers questions about services
- Provides quick assistance

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/consultation` | Project consultation AI |
| `POST` | `/api/copilot` | Website copilot AI |
| `GET` | `/api/health` | Health check |

---

## 🔔 Notifications

SmartDev includes a real-time notification system used for booking updates, demo requests, and admin alerts.

- Users receive notifications scoped to their account; admins see all notifications.
- Notifications support marking read/unread, deleting, and bulk actions.
- Translations for notification UI strings live in the `src/i18n` files (see `notifications.*` keys).

The frontend `Notifications` component uses the mock API in `src/services/mockApi.ts` for local development. In production, ensure your backend exposes the same endpoints and event hooks used by the app.

---

## 🎨 Custom Cursor

The portal features a unique animated cursor experience:

| Feature | Description |
|---------|-------------|
| 🎯 **Smooth Following** | Ring follows cursor with smooth animation |
| 🌈 **Color Cycling** | Automatic HSL color rotation |
| 💫 **Click Ripples** | Animated ripples on click |
| 🔍 **Hover Effects** | Ring grows on interactive elements |
| ♿ **Accessibility** | Respects `prefers-reduced-motion` |

> **Note:** The cursor is only active on devices with fine pointers (not touch devices).

---

## 🌍 Internationalization

The app supports multiple languages:

| Language | Code | Status |
|----------|------|--------|
| 🇬🇧 English | `en` | ✅ Complete |
| 🇫🇷 French | `fr` | ✅ Complete |
| 🇳🇱 Dutch | `nl` | ✅ Complete |
| 🇩🇪 German | `de` | ✅ Complete |

Toggle language using the language switcher in the navbar.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend together |
| `npm run client` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🔧 Environment Variables

### Frontend (`.env` in root)

```env
VITE_API_URL=http://localhost:3001
```

### Backend (`server/.env`)

```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ "I'm having trouble connecting to the AI service"</b></summary>

1. Make sure the backend server is running on port 3001
2. Check that your `GEMINI_API_KEY` is valid
3. Verify the API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

</details>

<details>
<summary><b>❌ Port already in use</b></summary>

Kill the process using the port:
```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

</details>

<details>
<summary><b>❌ Custom cursor offset issues</b></summary>

- Set browser zoom to 100%
- Check OS display scaling settings
- Verify `window.devicePixelRatio` in console

</details>

---

## 👨‍💻 Authors

<div align="center">

**OUARAS Khelil Rafik**

[![GitHub](https://img.shields.io/badge/GitHub-OUARAS--khelil--Rafik-181717?style=for-the-badge&logo=github)](https://github.com/OUARAS-khelil-Rafik)

**KEMMOUN Ramzy**

[![GitHub](https://img.shields.io/badge/GitHub-ramzykemmoun-181717?style=for-the-badge&logo=github)](https://github.com/ramzykemmoun)

**SAIDI Achraf**

[![GitHub](https://img.shields.io/badge/GitHub-Achraf--Saidi-181717?style=for-the-badge&logo=github)](https://github.com/Achraf-Saidi)

</div>

</div>

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

Made with ❤️ and ☕

</div>