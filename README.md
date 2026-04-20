# StudyNX — Smart Study Tracker

> **Student Productivity Assistant** · Built for the Google Antigravity Hackathon

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://studynx.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-13%20passing-brightgreen?style=flat-square)](/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](/)

StudyNX is an AI-powered study tracker that visualises your consistency, coaches you with Gemini AI, and syncs your sessions to Google Calendar — all in one place.

---

## ✦ Chosen Vertical

**Student Productivity Assistant**

StudyNX was built under the Student Productivity vertical — combining AI coaching, Google Services, and smart habit tracking into a real-world tool students actually want to use.

---

## ✦ Features

| Feature | Description |
|---|---|
| 🔥 **GitHub-style Heatmap** | Colour-coded annual activity grid — spot patterns and protect your streak |
| 🤖 **Gemini AI Coach** | Context-aware coaching powered by Gemini 1.5 Flash using your actual study data |
| 📅 **Google Calendar Sync** | Sessions auto-create Calendar events; "Plan Tomorrow" pushes a full AI schedule |
| 📊 **Subject Analytics** | Track hours, completion %, and targets per subject with circular progress bars |
| 🔐 **Supabase Auth** | Email/password, magic link, and Google OAuth with RLS-enforced data isolation |
| ⚡ **Streak & Nudge System** | Gemini detects when your streak is at risk and sends personalised nudges |

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Auth & Database | Supabase (RLS policies) |
| AI Assistant | Gemini 1.5 Flash |
| Calendar | Google Calendar API |
| Auth Provider | Google OAuth 2.0 |
| Testing | Vitest |

---

## ✦ Architecture

```
┌─────────────────────────────────────────┐
│         User Interface                  │
│         React + TypeScript              │
│         Tailwind CSS                    │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────────────┐
│  AI Layer   │  │   Google Services    │
│             │  │                      │
│  Context    │  │  Google OAuth        │
│  Builder    │  │  Google Calendar API │
│     +       │  │  Gemini API          │
│  Gemini 1.5 │  └──────────────────────┘
│  Flash      │
└─────────────┘
               │
       ┌───────┴────────────────────┐
       ▼                            ▼
┌──────────────┐          ┌─────────────────┐
│ Supabase Auth│          │ user_progress   │
│              │◄────────►│ table (JSON)    │
│              │          │ + RLS Policies  │
└──────────────┘          └─────────────────┘
```

---

## ✦ Approach & Logic

### Gemini AI Assistant

Before every Gemini request, StudyNX compiles a live context object from the user's current data — total hours, today's hours, weekly hours, streaks, weak subjects, strong subjects, and recent activity patterns. This context is injected into every prompt so Gemini gives personalised advice instead of generic study tips.

The assistant can:
- Identify weak subjects that need attention
- Generate motivational nudges when a streak is at risk
- Suggest realistic study blocks for tomorrow
- Answer study questions using the user's actual study history

### Google Calendar Integration

When a user logs a study session, StudyNX creates a matching Google Calendar event using a stable Tracklio key — so sessions can sync without duplicating entries.

The **"Plan Tomorrow"** action asks Gemini for a structured schedule, converts it to Calendar events, and syncs them instantly. Upcoming planned sessions are also surfaced back inside the dashboard.

### Supabase Storage

Supabase handles authentication and persistence. User progress is stored in the `user_progress` table as JSON payloads, so subjects, study logs, reminders, resources, and exam data all reload seamlessly across sessions.

---

## ✦ Local Setup

**Get running in under 5 minutes:**

```bash
# 1. Clone the repo
git clone https://github.com/IamMradul/StudyNX.git
cd StudyNX

# 2. Install dependencies
npm install

# 3. Copy env example and fill in your keys
cp .env.example .env.local

# 4. Run Supabase SQL schema
# → Open supabase/user_progress.sql in the Supabase SQL editor

# 5. Start dev server
npm run dev

# 6. Run tests
npm run test
```

---

## ✦ Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_CALENDAR_ID=primary

# Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_MODEL=gemini-1.5-flash
```

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings |
| `VITE_GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `VITE_GEMINI_API_KEY` | Google AI Studio → Get API Key |

---

## ✦ Tests

```
npm run test
```

```
 RUN  v3.2.4

 ✓ tests/studyLogic.test.ts     (4 tests)
 ✓ tests/geminiPrompt.test.ts   (3 tests)
 ✓ tests/sessionLog.test.ts     (2 tests)
 ✓ src/lib/studyLogic.test.ts   (4 tests)

 Test Files  4 passed (4)
 Tests       13 passed (13)
 Duration    400ms
```

**Coverage:**
- `studyLogic` — progress %, streak counting, edge cases
- `geminiPrompt` — context injection (hours, streak, weak subjects)
- `sessionLog` — session add, duplicate prevention

---

## ✦ Submission Checklist

### Rules
- [x] Public GitHub repository
- [x] Single branch (`main` only)
- [x] Repository size under 1 MB
- [x] README with vertical, approach, and logic
- [x] `.env.example` committed (no real keys)
- [x] Live demo deployed on Vercel

### Evaluation Criteria
- [x] **Code quality** — TypeScript strict mode, clean structure
- [x] **Security** — RLS policies, no exposed API keys
- [x] **Testing** — 13 Vitest unit tests passing
- [x] **Google Services** — Gemini + Calendar API + OAuth working together meaningfully
- [x] **Smart assistant** — context-aware Gemini AI using live user data
- [x] **Accessibility** — `aria-labels`, WCAG AA contrast ratios

---

## ✦ Author

**Mradul Gupta** · [GitHub](https://github.com/IamMradul)

MIT License