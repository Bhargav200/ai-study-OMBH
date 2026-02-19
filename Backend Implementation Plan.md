# Backend Implementation Plan — MVP Phase 1

## Stack Confirmed

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI |
| Database | PostgreSQL |
| Cache & Jobs | Redis |
| AI | OpenAI API |
| Storage | AWS S3 |
| Deployment | Docker on AWS |
| Auth | JWT + Google OAuth |
| API Style | REST `/api/v1/` |
| Real-time | Refresh-based |

---

## System Architecture Overview

```
Frontend
   ↓
FastAPI Backend
   ↓
PostgreSQL + Redis + S3 + OpenAI
```

### Backend Responsibilities

- Auth
- Learning engine
- AI tutoring
- Quiz engine
- Progress tracking
- Gamification
- Social system

---

## Implementation Strategy

We implement backend in **UI-flow order**.

---

## PHASE 1 — Core Infrastructure Setup

### 1. Project Structure

```
backend/
├── app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── core/
│   ├── workers/
│   └── main.py
├── migrations/
├── tests/
└── docker/
```

### 2. Core Infrastructure Setup

- FastAPI app
- PostgreSQL connection
- SQLAlchemy ORM
- Alembic migrations
- Redis connection
- Docker containerization
- Environment configuration

---

## PHASE 2 — Authentication System

Supports Login, Signup, Dashboard entry.

### APIs

| Method | Endpoint |
|--------|----------|
| POST | `/auth/signup` |
| POST | `/auth/login` |
| POST | `/auth/google` |
| POST | `/auth/refresh` |
| GET | `/auth/me` |

### Features

- Access & refresh tokens
- Password hashing
- Google OAuth integration
- Token validation middleware

---

## PHASE 3 — User Profile & Onboarding

### Database Tables

- `users`
- `user_profiles`
- `user_preferences`

### APIs

| Method | Endpoint |
|--------|----------|
| GET | `/users/me` |
| PUT | `/users/me` |
| POST | `/onboarding` |

### Stores

- Subjects
- Goals
- Study preferences

---

## PHASE 4 — Dashboard Engine

Dashboard aggregates data.

### APIs

| Method | Endpoint |
|--------|----------|
| GET | `/dashboard` |

### Returns

- Study progress
- Recommendations
- XP
- Streak
- Weak topics
- Leaderboard preview

---

## PHASE 5 — Lessons & Learning Content

### Tables

- `subjects`
- `topics`
- `lessons`
- `lesson_progress`

### APIs

| Method | Endpoint |
|--------|----------|
| GET | `/subjects` |
| GET | `/topics/{subject}` |
| GET | `/lessons/{topic}` |
| POST | `/lessons/{id}/complete` |

---

## PHASE 6 — AI Doubt Solver

### Tables

- `doubt_sessions`
- `doubt_messages`

### APIs

| Method | Endpoint |
|--------|----------|
| POST | `/ai/doubt` |
| GET | `/ai/doubt/history` |

### Flow

User question → OpenAI → structured answer stored.

---

## PHASE 7 — Quiz Engine

### Tables

- `quizzes`
- `quiz_attempts`
- `quiz_answers`

### APIs

| Method | Endpoint |
|--------|----------|
| POST | `/quiz/generate` |
| POST | `/quiz/submit` |
| GET | `/quiz/history` |

OpenAI generates questions.

---

## PHASE 8 — Study Timer & Sessions

### Tables

- `study_sessions`

### APIs

| Method | Endpoint |
|--------|----------|
| POST | `/study/start` |
| POST | `/study/end` |
| GET | `/study/history` |

### Tracks

- Duration
- XP rewards
- Streak updates

---

## PHASE 9 — Learning Material Upload

### Tables

- `materials`
- `material_chunks`

### APIs

| Method | Endpoint |
|--------|----------|
| POST | `/materials/upload` |
| GET | `/materials` |
| POST | `/materials/query` |

### Flow

Upload → S3 → text extraction → embeddings → AI Q&A.

Background jobs handle processing.

---

## PHASE 10 — Progress Tracking

### Tables

- `topic_progress`
- `user_stats`

### APIs

| Method | Endpoint |
|--------|----------|
| GET | `/progress` |

Calculates mastery & performance.

---

## PHASE 11 — Recommendation Engine

Initial rule-based system.

### APIs

| Method | Endpoint |
|--------|----------|
| GET | `/recommendations` |

### Uses

- Weak topics
- Quiz results
- Study patterns

---

## PHASE 12 — Gamification Engine

### Tables

- `xp_logs`
- `user_levels`
- `achievements`
- `user_achievements`
- `streaks`

### APIs

| Method | Endpoint |
|--------|----------|
| GET | `/gamification/status` |

### XP Events Triggered By

- Study sessions
- Quizzes
- Lessons
- Doubts solved

---

## PHASE 13 — Friends & Leaderboard

### Tables

- `friends`
- `leaderboard_snapshots`

### APIs

| Method | Endpoint |
|--------|----------|
| POST | `/friends/add` |
| GET | `/friends` |
| GET | `/leaderboard` |

Leaderboard calculated daily via Redis job.

---

## PHASE 14 — Background Workers

Use Redis workers for:

- Quiz generation
- Document processing
- Leaderboard calculation
- Recommendation updates

---

## PHASE 15 — Performance & Caching

### Cache

- Dashboard data
- Leaderboard
- Recommendations
- Progress summaries

Redis TTL: 5–15 min.

---

## PHASE 16 — Security & Monitoring

- Rate limiting
- Logging
- Error tracking
- API request logging
