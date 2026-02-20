export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          key: string
          name: string
          sort_order: number
          threshold: number
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          key: string
          name: string
          sort_order?: number
          threshold?: number
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          key?: string
          name?: string
          sort_order?: number
          threshold?: number
          xp_reward?: number
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          completion_tokens: number | null
          created_at: string
          estimated_cost: number | null
          feature_type: string
          id: string
          model_name: string | null
          prompt_tokens: number | null
          request_status: string | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          estimated_cost?: number | null
          feature_type: string
          id?: string
          model_name?: string | null
          prompt_tokens?: number | null
          request_status?: string | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          estimated_cost?: number | null
          feature_type?: string
          id?: string
          model_name?: string | null
          prompt_tokens?: number | null
          request_status?: string | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
      doubt_messages: {
        Row: {
          created_at: string
          doubt_session_id: string
          id: string
          message_text: string
          role: string
        }
        Insert: {
          created_at?: string
          doubt_session_id: string
          id?: string
          message_text: string
          role: string
        }
        Update: {
          created_at?: string
          doubt_session_id?: string
          id?: string
          message_text?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubt_messages_doubt_session_id_fkey"
            columns: ["doubt_session_id"]
            isOneToOne: false
            referencedRelation: "doubt_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      doubt_sessions: {
        Row: {
          created_at: string
          id: string
          question_preview: string
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_preview: string
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_preview?: string
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubt_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string
          content_type: string | null
          created_at: string
          estimated_duration_minutes: number | null
          id: string
          sort_order: number
          title: string
          topic_id: string
        }
        Insert: {
          content?: string
          content_type?: string | null
          created_at?: string
          estimated_duration_minutes?: number | null
          id?: string
          sort_order?: number
          title: string
          topic_id: string
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string
          estimated_duration_minutes?: number | null
          id?: string
          sort_order?: number
          title?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      material_chunks: {
        Row: {
          chunk_index: number
          chunk_text: string
          created_at: string
          id: string
          material_id: string
        }
        Insert: {
          chunk_index?: number
          chunk_text: string
          created_at?: string
          id?: string
          material_id: string
        }
        Update: {
          chunk_index?: number
          chunk_text?: string
          created_at?: string
          id?: string
          material_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_chunks_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          content_type: string | null
          extracted_text: string | null
          file_name: string
          file_size: number | null
          id: string
          processing_status: string
          storage_path: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          extracted_text?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          processing_status?: string
          storage_path: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          extracted_text?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          processing_status?: string
          storage_path?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          discord_username: string | null
          facebook_username: string | null
          full_name: string | null
          grade_level: string | null
          id: string
          instagram_username: string | null
          onboarding_completed: boolean
          primary_goal: string | null
          study_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discord_username?: string | null
          facebook_username?: string | null
          full_name?: string | null
          grade_level?: string | null
          id?: string
          instagram_username?: string | null
          onboarding_completed?: boolean
          primary_goal?: string | null
          study_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discord_username?: string | null
          facebook_username?: string | null
          full_name?: string | null
          grade_level?: string | null
          id?: string
          instagram_username?: string | null
          onboarding_completed?: boolean
          primary_goal?: string | null
          study_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          created_at: string
          id: string
          quiz_id: string | null
          score: number
          topic_id: string | null
          topic_title: string
          total_questions: number
          user_id: string
          xp_awarded: number
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_id?: string | null
          score?: number
          topic_id?: string | null
          topic_title: string
          total_questions?: number
          user_id: string
          xp_awarded?: number
        }
        Update: {
          created_at?: string
          id?: string
          quiz_id?: string | null
          score?: number
          topic_id?: string | null
          topic_title?: string
          total_questions?: number
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          options: Json
          question_text: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question_text: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question_text?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          generated_by_ai: boolean
          id: string
          topic_id: string | null
        }
        Insert: {
          created_at?: string
          generated_by_ai?: boolean
          id?: string
          topic_id?: string | null
        }
        Update: {
          created_at?: string
          generated_by_ai?: boolean
          id?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          created_at: string
          duration_seconds: number
          ended_at: string | null
          id: string
          started_at: string
          user_id: string
          xp_awarded: number
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          user_id: string
          xp_awarded?: number
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          user_id?: string
          xp_awarded?: number
        }
        Relationships: []
      }
      subjects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      topic_progress: {
        Row: {
          avg_quiz_score: number
          id: string
          last_updated: string
          lessons_completed: number
          mastery_score: number
          quiz_count: number
          topic_id: string
          user_id: string
        }
        Insert: {
          avg_quiz_score?: number
          id?: string
          last_updated?: string
          lessons_completed?: number
          mastery_score?: number
          quiz_count?: number
          topic_id: string
          user_id: string
        }
        Update: {
          avg_quiz_score?: number
          id?: string
          last_updated?: string
          lessons_completed?: number
          mastery_score?: number
          quiz_count?: number
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: number | null
          id: string
          lesson_count: number
          sort_order: number
          subject_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          id?: string
          lesson_count?: number
          sort_order?: number
          subject_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          id?: string
          lesson_count?: number
          sort_order?: number
          subject_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          difficulty_level: string | null
          goals: string[]
          id: string
          learner_type: string | null
          subjects: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty_level?: string | null
          goals?: string[]
          id?: string
          learner_type?: string | null
          subjects?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty_level?: string | null
          goals?: string[]
          id?: string
          learner_type?: string | null
          subjects?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          description: string | null
          dismissed: boolean
          expires_at: string | null
          generated_at: string
          id: string
          priority_score: number
          recommendation_type: string
          reference_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          description?: string | null
          dismissed?: boolean
          expires_at?: string | null
          generated_at?: string
          id?: string
          priority_score?: number
          recommendation_type: string
          reference_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          description?: string | null
          dismissed?: boolean
          expires_at?: string | null
          generated_at?: string
          id?: string
          priority_score?: number
          recommendation_type?: string
          reference_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number
          last_study_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_study_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_study_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_logs: {
        Row: {
          created_at: string
          id: string
          reference_id: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          reference_id?: string | null
          source_type: string
          user_id: string
          xp_amount?: number
        }
        Update: {
          created_at?: string
          id?: string
          reference_id?: string | null
          source_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
