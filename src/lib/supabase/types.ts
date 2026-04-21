export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Enums: {
      app_role: "member" | "admin";
      asset_type: "poster" | "caption" | "video";
      mission_status: "locked" | "available" | "in_progress" | "submitted" | "completed";
      mission_type: "profile" | "content" | "social" | "learning" | "ai" | "campaign";
      notification_type: "mission" | "campaign" | "news" | "reward" | "system";
      record_status: "active" | "inactive" | "archived";
      submission_status: "pending" | "approved" | "needs_revision";
    };
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: Database["public"]["Enums"]["app_role"];
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      member_profiles: {
        Row: {
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          display_name: string | null;
          mobile_number: string | null;
          preferred_locale: string | null;
          bio: string | null;
          photo_path: string | null;
          favorite_category: string | null;
          preferred_tone: string | null;
          profile_completion: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          display_name?: string | null;
          mobile_number?: string | null;
          preferred_locale?: string | null;
          bio?: string | null;
          photo_path?: string | null;
          favorite_category?: string | null;
          preferred_tone?: string | null;
          profile_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          display_name?: string | null;
          mobile_number?: string | null;
          preferred_locale?: string | null;
          bio?: string | null;
          photo_path?: string | null;
          favorite_category?: string | null;
          preferred_tone?: string | null;
          profile_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          type: Database["public"]["Enums"]["mission_type"];
          sequence: number;
          reward_points: number;
          reward_item: string | null;
          unlock_condition: string;
          proof_requirement: string;
          validation_rule: string;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      member_missions: {
        Row: {
          id: string;
          user_id: string;
          mission_id: string;
          status: Database["public"]["Enums"]["mission_status"];
          progress_percentage: number;
          proof_submission_id: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      rewards: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          badge_name: string | null;
          points_required: number;
          reward_type: string;
          is_redeemable: boolean;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      member_rewards: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          source_member_mission_id: string | null;
          points_awarded: number;
          awarded_at: string;
          notes: string | null;
        };
      };
      content_templates: {
        Row: {
          id: string;
          slug: string;
          title: string;
          asset_type: Database["public"]["Enums"]["asset_type"];
          audience: string | null;
          metadata: Json;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      generated_assets: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          asset_type: Database["public"]["Enums"]["asset_type"];
          title: string;
          storage_path: string | null;
          request_payload: Json;
          output_payload: Json;
          generation_status: string;
          created_at: string;
          deleted_at: string | null;
          generation_completed_at: string | null;
          updated_at: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          slug: string;
          title: string;
          theme: string;
          summary: string;
          cta: string | null;
          starts_at: string | null;
          ends_at: string | null;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      news_items: {
        Row: {
          id: string;
          slug: string;
          category: string;
          title: string;
          summary: string;
          body: string | null;
          published_at: string;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string;
          story: string;
          price_range: string | null;
          spotlight: string | null;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      learning_modules: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          summary: string;
          duration_minutes: number;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          learning_module_id: string;
          slug: string;
          title: string;
          passing_score: number;
          question_payload: Json;
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          answers_payload: Json;
          completed_at: string;
        };
      };
      ai_chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          chat_type: string;
          title: string | null;
          created_at: string;
          deleted_at: string | null;
          updated_at: string;
        };
      };
      ai_messages: {
        Row: {
          id: string;
          session_id: string;
          sender: string;
          content: string;
          metadata: Json;
          created_at: string;
        };
      };
      ai_knowledge_sources: {
        Row: {
          id: string;
          slug: string;
          title: string;
          language: string;
          page_count: number;
          scope: string;
          summary: string | null;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          language: string;
          page_count?: number;
          scope: string;
          summary?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          language?: string;
          page_count?: number;
          scope?: string;
          summary?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      ai_knowledge_entries: {
        Row: {
          id: string;
          slug: string;
          source_id: string | null;
          tag: string;
          title: string;
          detail: string;
          sequence: number;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          source_id?: string | null;
          tag: string;
          title: string;
          detail: string;
          sequence?: number;
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          source_id?: string | null;
          tag?: string;
          title?: string;
          detail?: string;
          sequence?: number;
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      ai_objection_scripts: {
        Row: {
          id: string;
          slug: string;
          objection: string;
          short_answer: string;
          talk_track: string;
          next_move: string;
          sequence: number;
          status: Database["public"]["Enums"]["record_status"];
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          objection: string;
          short_answer: string;
          talk_track: string;
          next_move: string;
          sequence?: number;
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          objection?: string;
          short_answer?: string;
          talk_track?: string;
          next_move?: string;
          sequence?: number;
          status?: Database["public"]["Enums"]["record_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      proof_submissions: {
        Row: {
          id: string;
          user_id: string;
          mission_id: string;
          platform: string;
          social_url: string;
          screenshot_path: string | null;
          status: Database["public"]["Enums"]["submission_status"];
          review_notes: string | null;
          reviewed_at: string | null;
          submitted_at: string;
          updated_at: string;
        };
      };
      admin_reviews: {
        Row: {
          id: string;
          proof_submission_id: string;
          reviewer_id: string;
          outcome: Database["public"]["Enums"]["submission_status"];
          notes: string | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: Database["public"]["Enums"]["notification_type"];
          title: string;
          body: string;
          is_read: boolean;
          created_at: string;
          deleted_at: string | null;
          read_at: string | null;
        };
      };
      user_activity_logs: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          detail: string | null;
          metadata: Json;
          created_at: string;
        };
      };
    };
  };
}
