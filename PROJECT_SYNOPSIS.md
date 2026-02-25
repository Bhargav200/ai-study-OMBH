# Vistar Study Universe — Project Synopsis

---

## 1. Overview

**Vistar Study Universe** is an AI-powered study companion platform built for students. It combines structured learning content, AI tutoring, quiz generation, study tracking, and social gamification into a single cohesive experience.

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui + Radix primitives + Framer Motion |
| Backend | Lovable Cloud (PostgreSQL + Edge Functions) |
| AI Models | Gemini (via Lovable AI Gateway) |
| Auth | Email/Password + Google OAuth + Apple OAuth |
| State Management | TanStack React Query + React Context |
| Routing | React Router v6 |

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────┐
│                   Frontend (React/Vite)           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌───────────┐  │
│  │ Pages  │ │ Hooks  │ │Context │ │Components │  │
│  └───┬────┘ └───┬────┘ └───┬────┘ └─────┬─────┘  │
│      └──────────┴──────────┴─────────────┘        │
│                        │                          │
│              Supabase JS Client                   │
└────────────────────────┬─────────────────────────┘
                         │ HTTPS
┌────────────────────────┴─────────────────────────┐
│               Lovable Cloud Backend               │
│  ┌──────────────┐  ┌───────────────────────────┐  │
│  │  PostgreSQL   │  │     Edge Functions        │  │
│  │  (20 tables)  │  │  ┌─────────────────────┐  │  │
│  │  + RLS        │  │  │ solve-doubt         │  │  │
│  │               │  │  │ generate-quiz       │  │  │
│  │               │  │  │ process-material    │  │  │
│  │               │  │  │ query-material      │  │  │
│  └──────────────┘  │  └─────────────────────┘  │  │
│                     └───────────┬───────────────┘  │
│                                 │                  │
│                    Lovable AI Gateway              │
│                    (Gemini Models)                  │
└────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (20 Tables)

### Core User & Auth
| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (name, grade, goals, social usernames) |
| `user_preferences` | Learning preferences (subjects, goals, difficulty, learner type) |
| `user_streaks` | Daily study streak tracking |

### Learning Content
| Table | Purpose |
|-------|---------|
| `subjects` | Top-level subjects (Math, Science, etc.) with color/icon |
| `topics` | Sub-categories within subjects |
| `lessons` | Individual lesson content units |
| `user_lesson_progress` | Per-user lesson completion tracking |
| `topic_progress` | Per-user topic mastery scores |

### AI Features
| Table | Purpose |
|-------|---------|
| `doubt_sessions` | AI doubt-solving conversation threads |
| `doubt_messages` | Individual messages within doubt sessions |
| `materials` | Uploaded study materials metadata |
| `material_chunks` | Extracted text chunks for AI querying |
| `ai_usage_logs` | Token usage and cost tracking |

### Quiz System
| Table | Purpose |
|-------|---------|
| `quizzes` | Quiz metadata (topic, AI-generated flag) |
| `quiz_questions` | Questions with options, answers, explanations |
| `quiz_attempts` | User quiz scores and XP awarded |

### Gamification & Social
| Table | Purpose |
|-------|---------|
| `xp_logs` | XP earning events (source, amount, reference) |
| `achievements` | Achievement definitions (criteria, badges) |
| `user_achievements` | Unlocked achievements per user |
| `friends` | Friend relationships (requester/addressee/status) |
| `user_recommendations` | AI-generated study recommendations |

### Security
- All tables have **Row Level Security (RLS)** enabled
- Users can only read/write their own data
- Achievement definitions are publicly readable
- Friend records accessible to both parties

---

## 4. Edge Functions (AI-Powered)

| Function | Model | Purpose |
|----------|-------|---------|
| `solve-doubt` | Gemini 2.5 Flash | Answers student questions with step-by-step explanations |
| `generate-quiz` | Gemini 2.5 Flash | Creates topic-specific quiz questions with options/explanations |
| `process-material` | Gemini 2.5 Flash | Extracts and chunks uploaded study material text |
| `query-material` | Gemini 2.5 Flash | Answers questions based on uploaded material context |

All functions use the **Lovable AI Gateway** — no external API keys required.

---

## 5. Frontend Routes (16 Pages)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing page with features, testimonials, CTA |
| `/auth/login` | Login | Email/password + social OAuth login |
| `/auth/signup` | Signup | Account registration |
| `/onboarding/profile` | Profile Setup | Name, grade, avatar selection |
| `/onboarding/goals` | Learning Goals | Subject & goal preferences |
| `/dashboard` | Dashboard | Central hub — streaks, mastery, quick actions |
| `/lessons` | Lesson List | Browse subjects → topics → lessons |
| `/lessons/:id` | Lesson Viewer | Read lesson content, mark complete |
| `/doubts/input` | Doubt Input | Ask AI a question |
| `/doubts/session/:id` | Doubt Session | Chat-style AI conversation |
| `/doubts/history` | Doubt History | Past doubt sessions |
| `/quiz/topics` | Topic Selection | Choose quiz topic |
| `/quiz/play` | Quiz Page | Answer AI-generated questions |
| `/quiz/results` | Quiz Results | Score, XP earned, explanations |
| `/materials/upload` | Material Upload | Upload & manage study files |
| `/materials/ai` | AI Learning | Query uploaded materials |
| `/materials/tutor` | AI Tutor | Free-form AI tutoring |
| `/timer` | Study Timer | Pomodoro-style timer with XP |
| `/timer/summary` | Session Summary | Post-session stats |
| `/progress` | Progress Dashboard | Charts, mastery scores, insights |
| `/social/leaderboard` | Leaderboard | Rankings & achievements |
| `/social/friends` | Friends | Friend management |
| `/social/achievements` | Achievements | Badge collection |
| `/settings` | Settings | Account, preferences, AI tutor config |
| `/profile` | Profile | View/edit profile |

---

## 6. User Flow

```
1. SIGN UP → Email/Google/Apple
       │
2. ONBOARDING → Profile Setup → Learning Goals
       │
3. DASHBOARD (Daily Hub)
       │
       ├── 📚 LEARN
       │    └── Browse Subjects → Topics → Lessons → Mark Complete
       │
       ├── 🤖 AI DOUBT SOLVER
       │    └── Type Question → Get Step-by-Step Answer → Save to History
       │
       ├── 📝 QUIZ
       │    └── Select Topic → AI Generates Questions → Answer → Get Score + XP
       │
       ├── ⏱️ STUDY TIMER
       │    └── Start Timer → Study → End → Get XP + Streak Update
       │
       ├── 📄 MATERIALS
       │    └── Upload PDF/Notes → AI Processes → Query AI About Content
       │
       ├── 📊 PROGRESS
       │    └── View Mastery Scores → Weekly Charts → AI Insights
       │
       └── 🏆 SOCIAL
            └── Leaderboard Rankings → Achievements → Friends
```

### XP Economy
| Action | XP Reward |
|--------|-----------|
| Complete a lesson | 10-25 XP |
| Finish a quiz | 15-50 XP (score-based) |
| Study session (timer) | 5 XP per 25 min |
| Solve a doubt | 5 XP |
| Upload material | 10 XP |

---

## 7. Admin Flow

> **Current State:** No dedicated admin UI exists. Administration is done via direct database access.

### Admin Capabilities (via database)
- **Content Management:** Insert/update `subjects`, `topics`, `lessons`
- **Achievement Definitions:** Manage `achievements` table entries
- **User Management:** View `profiles`, `user_preferences`
- **Analytics:** Query `ai_usage_logs`, `xp_logs`, `study_sessions`
- **Moderation:** View/manage `friends` relationships

### Planned Admin Features
- Admin dashboard with content CRUD
- User analytics and engagement metrics
- AI usage cost monitoring
- Content approval workflows

---

## 8. Design System

### Theme
- **Primary Background:** Deep navy (`#0a1628` / `hsl(220, 60%, 10%)`)
- **Cards/Surfaces:** Slightly lighter navy with subtle borders
- **Accent Colors:** Amber/gold for XP, green for success, blue for primary actions
- **Text:** White primary, muted gray secondary

### Typography
- **Display/Headers:** DM Sans (bold, distinctive)
- **Body:** DM Sans (regular)
- **Code/Data:** JetBrains Mono

### Component Library
- Built on **shadcn/ui** with custom navy theme overrides
- Framer Motion for page transitions and micro-interactions
- Lucide React for iconography
- Recharts for data visualization

---

## 9. Authentication

### Supported Methods
1. **Email/Password** — Standard signup with email verification
2. **Google OAuth** — One-click Google sign-in
3. **Apple OAuth** — Sign in with Apple

### Auth Flow
```
Login/Signup → Lovable Cloud Auth → JWT Token → Protected Routes
                                         │
                                   AuthContext (React)
                                         │
                                   ProtectedRoute wrapper
```

### Development Mode
- `DEV_BYPASS` flag exists in `AuthContext` for development testing
- Should be disabled in production

---

## 10. Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Lovable Cloud over external backend | Zero-config, integrated auth + DB + functions |
| Gemini via AI Gateway | No API keys needed, cost-efficient for students |
| TanStack Query | Caching, deduplication, optimistic updates |
| shadcn/ui | Customizable, accessible, lightweight components |
| RLS on all tables | Security by default, no backend middleware needed |
| Edge Functions for AI | Server-side AI calls, no key exposure to client |

---

## 11. File Structure

```
src/
├── assets/              # Static assets (logo, images)
├── components/
│   ├── landing/         # Landing page sections (13 components)
│   ├── layout/          # App layout wrapper
│   └── ui/              # shadcn/ui components (40+ components)
├── contexts/            # AuthContext
├── hooks/               # Custom hooks (useDashboardData, useMobile, useToast)
├── integrations/        # Supabase client & types (auto-generated)
├── pages/
│   ├── auth/            # Login, Signup
│   ├── doubts/          # AI Doubt Solver pages
│   ├── lessons/         # Lesson browsing & viewing
│   ├── materials/       # Upload, AI Learning, AI Tutor
│   ├── onboarding/      # Profile Setup, Learning Goals
│   ├── progress/        # Progress Dashboard
│   ├── quiz/            # Quiz flow pages
│   ├── social/          # Leaderboard, Friends, Achievements
│   └── timer/           # Study Timer, Session Summary
├── lib/                 # Utilities
└── test/                # Test setup

supabase/
└── functions/
    ├── generate-quiz/   # AI quiz generation
    ├── process-material/# Material text extraction
    ├── query-material/  # Material Q&A
    └── solve-doubt/     # AI doubt solving
```

---

*Last updated: February 25, 2026*
