# Full Database Design (MVP)

---

## 1. Core User & Authentication Tables

### Table: `users`

**Purpose:** Stores authentication-level user identity and account state.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| email | varchar | unique, indexed |
| password_hash | varchar | nullable for OAuth users |
| auth_provider | varchar | "email", "google" |
| google_id | varchar | nullable |
| is_active | boolean | default true |
| is_verified | boolean | |
| role | varchar | default "student" |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**

- One-to-one with `user_profiles`
- One-to-many with `study_sessions`
- One-to-many with `quiz_attempts`
- One-to-many with `doubt_sessions`
- One-to-many with `materials`
- One-to-many with `xp_logs`
- One-to-many with `ai_usage_logs`
- One-to-many with `subscriptions`
- One-to-many with `payments`

---

### Table: `user_profiles`

**Purpose:** Stores learning-related metadata for personalization.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id, unique |
| full_name | varchar | |
| grade_level | varchar | |
| primary_goal | varchar | |
| study_preference | varchar | |
| onboarding_completed | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationship:** Belongs to `users`

---

## 2. Learning Content Structure

### Table: `subjects`

**Purpose:** Top-level subject grouping (e.g., Math, Science).

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | varchar | |
| description | text | |
| created_at | timestamp | |

---

### Table: `topics`

**Purpose:** Subcategories within subjects.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| subject_id | UUID | FK → subjects.id |
| name | varchar | |
| description | text | |
| difficulty_level | integer | |
| created_at | timestamp | |

**Relationship:** Many topics belong to one subject

---

### Table: `lessons`

**Purpose:** Learning content units.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| topic_id | UUID | FK → topics.id |
| title | varchar | |
| content | text or markdown | |
| content_type | varchar | text, video, pdf |
| estimated_duration_minutes | integer | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationship:** Many lessons belong to one topic

---

### Table: `lesson_progress`

**Purpose:** Tracks user lesson completion.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| lesson_id | UUID | FK → lessons.id |
| completed | boolean | |
| completed_at | timestamp | |

**Unique constraint:** `user_id` + `lesson_id`

---

## 3. Study Productivity

### Table: `study_sessions`

**Purpose:** Tracks timer-based study sessions.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| started_at | timestamp | |
| ended_at | timestamp | |
| duration_seconds | integer | |
| xp_awarded | integer | |
| created_at | timestamp | |

---

### Table: `user_streaks`

**Purpose:** Tracks daily study streaks.

| Field | Type | Notes |
|-------|------|-------|
| user_id | UUID | PK, FK → users.id |
| current_streak | integer | |
| longest_streak | integer | |
| last_study_date | date | |
| updated_at | timestamp | |

---

## 4. AI Tutoring & Usage Control

### Table: `doubt_sessions`

**Purpose:** Stores AI doubt solving threads.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| topic_id | UUID | FK → topics.id, nullable |
| created_at | timestamp | |

---

### Table: `doubt_messages`

**Purpose:** Stores individual messages in doubt session.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| doubt_session_id | UUID | FK → doubt_sessions.id |
| role | varchar | user, assistant |
| message_text | text | |
| created_at | timestamp | |

---

### Table: `ai_usage_logs`

**Purpose:** Logs AI usage for cost control and billing insights.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| feature_type | varchar | doubt, quiz, material |
| model_name | varchar | |
| prompt_tokens | integer | |
| completion_tokens | integer | |
| total_tokens | integer | |
| estimated_cost | numeric | |
| request_status | varchar | |
| created_at | timestamp | |

**Indexed on:** `user_id`, `created_at`

---

## 5. Quiz & Practice System

### Table: `quizzes`

**Purpose:** Generated quiz metadata.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| topic_id | UUID | FK → topics.id |
| generated_by_ai | boolean | |
| created_at | timestamp | |

---

### Table: `quiz_questions`

**Purpose:** Stores quiz questions.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| quiz_id | UUID | FK → quizzes.id |
| question_text | text | |
| options | JSONB | |
| correct_answer | varchar | |
| explanation | text | |

---

### Table: `quiz_attempts`

**Purpose:** Tracks user quiz attempts.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| quiz_id | UUID | FK → quizzes.id |
| score_percentage | numeric | |
| xp_awarded | integer | |
| completed_at | timestamp | |

---

## 6. Learning Material Upload

### Table: `materials`

**Purpose:** Stores uploaded files metadata.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| file_name | varchar | |
| s3_url | varchar | |
| content_type | varchar | |
| processing_status | varchar | |
| uploaded_at | timestamp | |

---

### Table: `material_chunks`

**Purpose:** Stores extracted text chunks for AI queries.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| material_id | UUID | FK → materials.id |
| chunk_text | text | |
| embedding_vector | vector or JSONB | |
| created_at | timestamp | |

---

## 7. Progress & Mastery

### Table: `topic_progress`

**Purpose:** Tracks user mastery per topic.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| topic_id | UUID | FK → topics.id |
| mastery_score | numeric | |
| last_updated | timestamp | |

**Unique constraint:** `user_id` + `topic_id`

---

## 8. Gamification

### Table: `xp_logs`

**Purpose:** Tracks XP events.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| source_type | varchar | quiz, lesson, doubt, study |
| reference_id | UUID | |
| xp_amount | integer | |
| created_at | timestamp | |

---

### Table: `achievements`

**Purpose:** Stores achievement definitions.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| title | varchar | |
| description | text | |
| badge_icon | varchar | |
| criteria_type | varchar | |
| criteria_value | integer | |

---

### Table: `user_achievements`

**Purpose:** Maps achievements to users.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| achievement_id | UUID | FK → achievements.id |
| unlocked_at | timestamp | |

---

## 9. Social System

### Table: `friends`

**Purpose:** Stores friend relationships.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| requester_id | UUID | FK → users.id |
| addressee_id | UUID | FK → users.id |
| status | varchar | pending, accepted |
| created_at | timestamp | |

---

### Table: `leaderboard_cache`

**Purpose:** Stores precomputed leaderboard rankings.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| period_type | varchar | weekly, monthly |
| ranking_data | JSONB | |
| generated_at | timestamp | |

---

## 10. Recommendations

### Table: `user_recommendations`

**Purpose:** Stores rule-based recommendation outputs.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| recommendation_type | varchar | |
| reference_id | UUID | |
| priority_score | integer | |
| generated_at | timestamp | |
| expires_at | timestamp | |
