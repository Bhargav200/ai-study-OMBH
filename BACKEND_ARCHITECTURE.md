# StudyMind — Backend Architecture & Migration Guide

> **Purpose**: Complete reference for migrating from Lovable Cloud (Supabase) to a custom backend (e.g., FastAPI + PostgreSQL + AWS S3).

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Database Schema](#database-schema)
4. [Authentication System](#authentication-system)
5. [Edge Functions (API Endpoints)](#edge-functions-api-endpoints)
6. [File Storage](#file-storage)
7. [Client-Side Data Access Patterns](#client-side-data-access-patterns)
8. [Environment Variables & Secrets](#environment-variables--secrets)
9. [Migration Checklist](#migration-checklist)

---

## 1. Overview

| Layer | Current Tech | Migration Target (Example) |
|-------|-------------|---------------------------|
| Auth | Supabase Auth (JWT + email/password) | Custom JWT auth / Auth0 / Firebase |
| Database | Supabase PostgreSQL | PostgreSQL / MySQL |
| API | Supabase Edge Functions (Deno) | FastAPI / Express / Django |
| Storage | Supabase Storage (S3-compatible) | AWS S3 / Cloudflare R2 |
| AI Gateway | Lovable AI Gateway (`ai.gateway.lovable.dev`) | Direct OpenAI / Google AI API calls |
| Realtime | Supabase Realtime (not currently used) | WebSockets / SSE |
| Frontend | React + Vite + TanStack Query | No change needed |

---

## 2. Folder Structure

```
supabase/
├── config.toml                    # Function config (JWT verification settings)
├── functions/
│   ├── solve-doubt/
│   │   └── index.ts               # POST /solve-doubt — AI doubt solver (streaming)
│   ├── generate-quiz/
│   │   └── index.ts               # POST /generate-quiz — AI quiz generator
│   ├── process-material/
│   │   └── index.ts               # POST /process-material — Document text extraction
│   └── query-material/
│       └── index.ts               # POST /query-material — AI tutor Q&A (streaming)

src/
├── integrations/supabase/
│   ├── client.ts                  # Supabase SDK client (auto-generated)
│   └── types.ts                   # TypeScript types from DB schema (auto-generated)
├── contexts/
│   └── AuthContext.tsx             # Auth state management (signUp, signIn, signOut)
├── components/
│   ├── ProtectedRoute.tsx          # Route guard + onboarding redirect
│   └── DashboardTimer.tsx          # Study session tracking + XP + streaks
├── hooks/
│   └── useDashboardData.ts         # Dashboard data aggregation
└── pages/
    ├── auth/Login.tsx              # Email/password login
    ├── auth/Signup.tsx             # Email/password registration
    ├── onboarding/ProfileSetup.tsx  # Profile + subject selection
    ├── onboarding/LearningGoals.tsx # Goals + difficulty selection
    ├── materials/MaterialUpload.tsx  # File upload + processing trigger
    ├── materials/AILearning.tsx      # AI tutor chat per document
    ├── materials/AITutor.tsx         # Material selector for AI tutor
    ├── doubts/DoubtInput.tsx         # Doubt submission form
    ├── doubts/AISolution.tsx         # Streaming AI solution display
    ├── quiz/QuizPage.tsx             # AI-generated quiz interface
    └── quiz/QuizResults.tsx          # Results + XP + progress saving
```

---

## 3. Database Schema

### 3.1 Tables

#### `profiles` — User profile (auto-created on signup via trigger)
```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,              -- references auth.users.id
  full_name TEXT,
  grade_level TEXT,                           -- "Grade 6" through "College"
  primary_goal TEXT,                          -- "homework", "exams", "habits", "compete"
  study_preference TEXT,                      -- "Beginner", "Intermediate", "Advanced"
  onboarding_completed BOOLEAN DEFAULT false, -- gates dashboard access
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own profile only
```

#### `user_preferences` — Onboarding selections
```sql
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  subjects TEXT[] DEFAULT '{}',              -- ["Mathematics", "Physics", ...]
  goals TEXT[] DEFAULT '{}',                 -- ["homework", "exams", ...]
  learner_type TEXT,                         -- "Individual Learner" or "School / Institution"
  difficulty_level TEXT,                     -- "Beginner", "Intermediate", "Advanced"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own preferences only
```

#### `subjects` — Predefined subject catalog (read-only for users)
```sql
CREATE TABLE public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,                                 -- icon name for frontend
  color TEXT,                                -- hex/hsl color
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: SELECT only (public read)
```

#### `topics` — Topics within subjects (read-only for users)
```sql
CREATE TABLE public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER DEFAULT 1,
  lesson_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: SELECT only (public read)
```

#### `lessons` — Lesson content within topics (read-only for users)
```sql
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES topics(id),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',                   -- markdown content
  content_type VARCHAR DEFAULT 'text',
  estimated_duration_minutes INTEGER DEFAULT 10,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: SELECT only (public read)
```

#### `user_lesson_progress` — Lesson completion tracking
```sql
CREATE TABLE public.user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own progress only
```

#### `topic_progress` — Aggregated topic mastery
```sql
CREATE TABLE public.topic_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES topics(id),
  lessons_completed INTEGER DEFAULT 0,
  quiz_count INTEGER DEFAULT 0,
  avg_quiz_score NUMERIC DEFAULT 0,
  mastery_score NUMERIC DEFAULT 0,           -- 0-100, weighted: 70% quiz + 30% lessons
  last_updated TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own progress only
```

#### `materials` — User-uploaded documents
```sql
CREATE TABLE public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name VARCHAR NOT NULL,
  storage_path VARCHAR NOT NULL,             -- path in storage bucket
  content_type VARCHAR,                      -- MIME type
  file_size INTEGER DEFAULT 0,
  extracted_text TEXT,                        -- full extracted text (up to 50k chars)
  processing_status VARCHAR DEFAULT 'pending', -- pending → processing → ready | error
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE, DELETE own materials only
```

#### `material_chunks` — Chunked text for RAG context
```sql
CREATE TABLE public.material_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES materials(id),
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT own chunks only (via material ownership check)
```

#### `quizzes` — Quiz instances
```sql
CREATE TABLE public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id),
  generated_by_ai BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: SELECT only (public read)
```

#### `quiz_questions` — Questions within a quiz
```sql
CREATE TABLE public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id),
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]',                -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer VARCHAR NOT NULL,           -- index as string: "0", "1", "2", "3"
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: SELECT only (public read)
```

#### `quiz_attempts` — User quiz results
```sql
CREATE TABLE public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID REFERENCES quizzes(id),
  topic_id UUID REFERENCES topics(id),
  topic_title TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT own attempts only
```

#### `doubt_sessions` — Doubt conversation sessions
```sql
CREATE TABLE public.doubt_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID REFERENCES topics(id),
  question_preview TEXT NOT NULL,            -- first 200 chars of question
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT own sessions only
```

#### `doubt_messages` — Messages within doubt sessions
```sql
CREATE TABLE public.doubt_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doubt_session_id UUID NOT NULL REFERENCES doubt_sessions(id),
  role VARCHAR NOT NULL,                     -- "user" or "assistant"
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT own messages only (via session ownership)
```

#### `study_sessions` — Timed study sessions
```sql
CREATE TABLE public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own sessions only
```

#### `xp_logs` — XP transaction log
```sql
CREATE TABLE public.xp_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_type TEXT NOT NULL,                 -- "quiz", "study_session", "lesson", "achievement"
  xp_amount INTEGER DEFAULT 0,
  reference_id UUID,                         -- optional FK to source record
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT own XP logs only
```

#### `user_streaks` — Daily study streak tracking
```sql
CREATE TABLE public.user_streaks (
  user_id UUID NOT NULL PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own streak only
-- Auto-created via trigger on auth.users INSERT
```

#### `achievements` — Achievement definitions (admin-managed)
```sql
CREATE TABLE public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,                          -- unique identifier e.g. "first_quiz"
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'trophy',
  category TEXT DEFAULT 'general',
  threshold INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: SELECT only (public read)
```

#### `user_achievements` — Earned achievements
```sql
CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT own achievements only
```

#### `friends` — Friend connections
```sql
CREATE TABLE public.friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  addressee_id UUID NOT NULL,
  status TEXT DEFAULT 'pending',             -- "pending", "accepted", "rejected"
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can manage their own friend records
```

#### `user_recommendations` — AI-generated recommendations
```sql
CREATE TABLE public.user_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reference_id UUID,
  priority_score INTEGER DEFAULT 0,
  dismissed BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT, UPDATE own recommendations only
```

#### `ai_usage_logs` — AI API usage tracking
```sql
CREATE TABLE public.ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_type VARCHAR NOT NULL,             -- "quiz", "doubt", "material"
  model_name VARCHAR,                        -- "google/gemini-3-flash-preview"
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost NUMERIC DEFAULT 0,
  request_status VARCHAR DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: users can SELECT, INSERT own usage logs only
```

### 3.2 Database Functions & Triggers

```sql
-- Auto-create profile on user signup
CREATE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;
-- TRIGGER: AFTER INSERT ON auth.users → handle_new_user()

-- Auto-create streak record on user signup
CREATE FUNCTION public.handle_new_user_streak() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
-- TRIGGER: AFTER INSERT ON auth.users → handle_new_user_streak()

-- Auto-update updated_at timestamp
CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
-- Applied to: profiles, user_preferences (BEFORE UPDATE triggers)
```

---

## 4. Authentication System

### Current Implementation (Supabase Auth)

**Sign Up** (`AuthContext.tsx → signUp`):
```typescript
// Email + password + full_name in metadata
supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: fullName },
    emailRedirectTo: window.location.origin,
  },
});
// Trigger auto-creates profile + streak records
// Email confirmation required (auto-confirm is OFF)
```

**Sign In** (`AuthContext.tsx → signIn`):
```typescript
supabase.auth.signInWithPassword({ email, password });
```

**Session Management**:
- JWT stored in `localStorage`
- Auto-refresh enabled
- `onAuthStateChange` listener keeps state in sync
- Session token sent as `Authorization: Bearer <token>` to edge functions

**Route Protection** (`ProtectedRoute.tsx`):
1. Check if user is authenticated → redirect to `/login` if not
2. Check `profiles.onboarding_completed` → redirect to `/onboarding/profile` if false
3. Allow access to dashboard if both pass

### Migration Notes
- Replace `supabase.auth.*` calls with your auth provider's SDK
- Replicate the trigger behavior: on user creation, create `profiles` + `user_streaks` rows
- JWT tokens must be validated in each API endpoint
- The `auth.uid()` function in RLS policies maps to the authenticated user's ID

---

## 5. Edge Functions (API Endpoints)

All functions are Deno-based, deployed as Supabase Edge Functions. Each needs to be converted to your backend framework's equivalent endpoint.

### 5.1 `POST /solve-doubt` — AI Doubt Solver

**Purpose**: Takes a student's question and returns a step-by-step AI explanation via streaming SSE.

**Request**:
```json
{
  "question": "How do I find the derivative of sin(x)?",
  "sessionId": "optional-existing-session-uuid"
}
```

**Headers**: `Authorization: Bearer <jwt_token>`

**Response**: `text/event-stream` (SSE) — OpenAI-compatible streaming format

**Logic**:
1. Validate question is a non-empty string
2. Extract user ID from JWT token
3. If no `sessionId`: create new `doubt_sessions` row, save user message to `doubt_messages`
4. Call AI API with system prompt (tutor persona) + user question, stream=true
5. Tee the response stream: one for client, one to collect full response
6. Background: save assistant's full response to `doubt_messages`, log to `ai_usage_logs`
7. Return SSE stream with `X-Doubt-Session-Id` header

**System Prompt**:
```
You are an expert academic tutor. Provide:
1. Step-by-step solution (numbered)
2. Worked example
3. Key concept highlight
Use markdown formatting.
```

**AI Model**: `google/gemini-3-flash-preview` via `https://ai.gateway.lovable.dev/v1/chat/completions`

---

### 5.2 `POST /generate-quiz` — AI Quiz Generator

**Purpose**: Generates multiple-choice quiz questions using AI function calling.

**Request**:
```json
{
  "topic": "Quadratic Equations",
  "subject": "Mathematics",
  "count": 5,
  "topicId": "optional-topic-uuid"
}
```

**Response**:
```json
{
  "questions": [
    {
      "question": "What is the quadratic formula?",
      "options": ["...", "...", "...", "..."],
      "correct": 0,
      "explanation": "The quadratic formula is..."
    }
  ],
  "quizId": "generated-quiz-uuid"
}
```

**Logic**:
1. Validate topic is provided
2. Call AI with `tools` parameter (function calling) to enforce structured output
3. Parse the tool call response → extract questions array
4. Create `quizzes` row, insert `quiz_questions` rows
5. Log to `ai_usage_logs`
6. Return questions + quizId

**Tool Schema** (for function calling):
```json
{
  "name": "generate_quiz",
  "parameters": {
    "type": "object",
    "properties": {
      "questions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "question": { "type": "string" },
            "options": { "type": "array", "items": { "type": "string" }, "minItems": 4, "maxItems": 4 },
            "correct": { "type": "integer", "description": "Index 0-3" },
            "explanation": { "type": "string" }
          },
          "required": ["question", "options", "correct", "explanation"]
        }
      }
    },
    "required": ["questions"]
  }
}
```

---

### 5.3 `POST /process-material` — Document Text Extraction

**Purpose**: Downloads an uploaded file from storage, extracts text, chunks it, and saves to DB.

**Request**:
```json
{
  "materialId": "uuid-of-material-record"
}
```

**Logic**:
1. Fetch `materials` row by ID
2. Download file from storage bucket `materials` at `storage_path`
3. **Text files** (`.txt`, `.md`): read as plain text
4. **Binary files** (PDF, DOCX): send to AI as base64 with multimodal prompt:
   - Model: `google/gemini-2.5-flash`
   - Prompt: "Extract all text content from this document. Preserve structure. Output as clean markdown."
   - File sent as `image_url` with `data:{mime};base64,{content}`
5. Chunk extracted text at ~1000 char boundaries (split at paragraph breaks `\n\n`)
6. Update `materials` row: `extracted_text` (up to 50k chars), `processing_status` = "ready"
7. Insert `material_chunks` rows (chunk_text + chunk_index)

**Error handling**: On failure, set `processing_status` = "error"

---

### 5.4 `POST /query-material` — AI Tutor Q&A (Document-based)

**Purpose**: Answers questions about an uploaded document using RAG with streaming.

**Request**:
```json
{
  "materialId": "uuid",
  "question": "Summarize chapter 3"
}
```

**Response**: `text/event-stream` (SSE)

**Logic**:
1. Fetch material's `extracted_text` and `file_name`
2. Fetch up to 10 `material_chunks` ordered by `chunk_index` for context
3. Build context: chunks joined by `\n\n`, or first 8000 chars of extracted_text
4. Call AI with system prompt that includes document context + YouTube recommendation instructions
5. Stream response back to client
6. Log to `ai_usage_logs`

**System Prompt** (includes document content):
```
You are an AI tutor. The student has uploaded "${file_name}".
Use the document content to answer accurately. If not in document, say so.
Proactively recommend YouTube playlists (Khan Academy, 3Blue1Brown, etc.).

Document content:
${context}
```

---

### Common Patterns Across All Edge Functions

**CORS Headers** (required for all):
```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ...",
};
// Handle OPTIONS preflight
if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
```

**Auth Token Extraction**:
```javascript
const authHeader = req.headers.get("authorization");
const token = authHeader.replace("Bearer ", "");
const { data: { user } } = await supabase.auth.getUser(token);
```

**AI Gateway Call Pattern**:
```javascript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-3-flash-preview",
    messages: [...],
    stream: true,  // or false for generate-quiz
  }),
});
```

**Rate Limit Handling**: 429 → "Rate limit exceeded", 402 → "AI credits exhausted"

---

## 6. File Storage

**Bucket**: `materials` (private)

**Upload Flow** (client-side in `MaterialUpload.tsx`):
```typescript
// 1. Upload file to storage
const path = `${userId}/${Date.now()}_${file.name}`;
await supabase.storage.from("materials").upload(path, file);

// 2. Create materials record
await supabase.from("materials").insert({
  user_id: userId,
  file_name: file.name,
  storage_path: path,
  content_type: file.type,
  file_size: file.size,
  processing_status: "processing",
});

// 3. Trigger processing edge function
fetch(`${SUPABASE_URL}/functions/v1/process-material`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ materialId: material.id }),
});
```

**Download** (server-side in edge function):
```typescript
const { data: fileData } = await supabase.storage
  .from("materials")
  .download(material.storage_path);
```

**Delete** (client-side):
```typescript
await supabase.storage.from("materials").remove([storagePath]);
await supabase.from("materials").delete().eq("id", id);
```

### Migration Notes
- Replace with S3 SDK: `PutObject`, `GetObject`, `DeleteObject`
- Storage path convention: `{user_id}/{timestamp}_{filename}`
- Max file size: 10MB (enforced client-side)
- Accepted types: `.pdf`, `.docx`, `.txt`, `.md`

---

## 7. Client-Side Data Access Patterns

All DB queries use the Supabase JS client with TanStack Query for caching.

### Dashboard Data (`useDashboardData.ts`)
| Query | Table | Purpose |
|-------|-------|---------|
| Profile | `profiles` | User name, onboarding status |
| Streak | `user_streaks` | Current/longest streak |
| Total XP | `xp_logs` | Sum of all `xp_amount` |
| Study Time | `study_sessions` | Sum of `duration_seconds` |
| Avg Score | `quiz_attempts` | Average `score/total_questions` |
| Continue Learning | `user_lesson_progress` + `topics` + `lessons` | In-progress topics |
| Weak Topics | `topic_progress` | Topics with `mastery_score < 60` |

### Study Timer (`DashboardTimer.tsx`)
- Auto-starts on dashboard load
- Awards **5 XP per minute** of study
- On stop: inserts `study_sessions` + `xp_logs` + updates `user_streaks`
- Streak logic: if last_study_date = today → keep streak; yesterday → increment; else → reset to 1

### Quiz Results (`QuizResults.tsx`)
- Saves `quiz_attempts` row
- Awards XP: `score × 10 + (20 bonus if ≥80%)`
- Updates `topic_progress`: recalculates `avg_quiz_score`, `mastery_score` (70% quiz + 30% lessons)

### Onboarding Flow
1. `ProfileSetup.tsx`: Updates `profiles` (name, grade) + upserts `user_preferences` (subjects, learner_type)
2. `LearningGoals.tsx`: Updates `user_preferences` (goals, difficulty) + sets `profiles.onboarding_completed = true`

---

## 8. Environment Variables & Secrets

### Client-Side (`.env`)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co       # Base URL for API calls
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...             # Anon/public API key
VITE_SUPABASE_PROJECT_ID=xxx                     # Project identifier
```

### Server-Side (Edge Function Secrets)
| Secret | Purpose | Migration Equivalent |
|--------|---------|---------------------|
| `SUPABASE_URL` | DB/auth API base URL | `DATABASE_URL` or API base URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB access (bypasses RLS) | DB connection with admin role |
| `SUPABASE_ANON_KEY` | Public API key | N/A (use auth middleware) |
| `LOVABLE_API_KEY` | AI Gateway authentication | `OPENAI_API_KEY` or `GOOGLE_AI_API_KEY` |

---

## 9. Migration Checklist

### Phase 1: Database
- [ ] Export schema and create all tables in target PostgreSQL
- [ ] Implement RLS equivalent as middleware/authorization logic
- [ ] Create user signup triggers (profile + streak auto-creation)
- [ ] Migrate any existing data

### Phase 2: Authentication
- [ ] Set up JWT-based auth (issue + verify tokens)
- [ ] Implement `/auth/signup` endpoint (email + password + name)
- [ ] Implement `/auth/login` endpoint
- [ ] Implement `/auth/logout` endpoint
- [ ] Add email verification flow
- [ ] Replace `supabase.auth.*` calls in frontend with custom API calls

### Phase 3: API Endpoints
- [ ] `POST /api/solve-doubt` — SSE streaming, doubt session persistence
- [ ] `POST /api/generate-quiz` — AI function calling, quiz persistence
- [ ] `POST /api/process-material` — File download, text extraction, chunking
- [ ] `POST /api/query-material` — RAG-based Q&A, SSE streaming
- [ ] Replace AI Gateway URL with direct provider API (OpenAI/Google)
- [ ] Implement rate limiting and error handling

### Phase 4: File Storage
- [ ] Set up S3 bucket with proper IAM policies
- [ ] Implement presigned URL generation for uploads
- [ ] Update upload/download/delete logic in frontend
- [ ] Migrate existing files

### Phase 5: Frontend Updates
- [ ] Replace `supabase` client imports with custom API client (fetch/axios)
- [ ] Update `AuthContext` to use custom auth endpoints
- [ ] Update all `supabase.from(...)` calls to REST API calls
- [ ] Update file upload to use presigned URLs or multipart upload
- [ ] Update edge function URLs to new API base URL

### Phase 6: Testing
- [ ] Auth flow (signup → email verify → login → onboarding → dashboard)
- [ ] Material upload → processing → AI tutor chat
- [ ] Quiz generation → answering → results + XP
- [ ] Doubt submission → streaming solution
- [ ] Study timer → session save → XP + streak
- [ ] Dashboard data aggregation

---

*Generated from StudyMind project — Last updated: 2026-02-20*
