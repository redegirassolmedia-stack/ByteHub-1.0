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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          active: boolean | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          link_url: string | null
          slot: string
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          link_url?: string | null
          slot: string
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          slot?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      article_comments: {
        Row: {
          article_id: string | null
          content: string
          created_at: string | null
          id: string
          status: string | null
          user_avatar: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          article_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          status?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          article_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          status?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      authorized_services_emails: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      breaking_news: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          text: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          text: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          text?: string
        }
        Relationships: []
      }
      digital_editions: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          edition_date: string | null
          id: string
          is_free: boolean | null
          pdf_url: string | null
          price_aoa: number | null
          price_usd: number | null
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          edition_date?: string | null
          id?: string
          is_free?: boolean | null
          pdf_url?: string | null
          price_aoa?: number | null
          price_usd?: number | null
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          edition_date?: string | null
          id?: string
          is_free?: boolean | null
          pdf_url?: string | null
          price_aoa?: number | null
          price_usd?: number | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      digital_purchases: {
        Row: {
          amount: number
          edition_id: string | null
          id: string
          purchase_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          edition_id?: string | null
          id?: string
          purchase_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          edition_id?: string | null
          id?: string
          purchase_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_purchases_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "digital_editions"
            referencedColumns: ["id"]
          },
        ]
      }
      editor_categories: {
        Row: {
          category: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      editor_menu_permissions: {
        Row: {
          created_at: string | null
          id: string
          menu_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_breaking: boolean | null
          is_hero: boolean | null
          published: boolean | null
          scheduled_at: string | null
          summary: string | null
          title: string
          updated_at: string | null
          views: number | null
          seo_keywords: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean | null
          is_hero?: boolean | null
          published?: boolean | null
          scheduled_at?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
          seo_keywords?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean | null
          is_hero?: boolean | null
          published?: boolean | null
          scheduled_at?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
          seo_keywords?: string | null
        }
        Relationships: []
      }
      newsletter_logs: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          error_details: string | null
          id: string
          recipient_count: number
          status: string
          subject: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          recipient_count?: number
          status: string
          subject: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          recipient_count?: number
          status?: string
          subject?: string
        }
        Relationships: []
      }
      opinion_articles: {
        Row: {
          author: string
          avatar_url: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          scheduled_at: string | null
          title: string
          updated_at: string | null
          views: number | null
          seo_keywords: string | null
        }
        Insert: {
          author: string
          avatar_url?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          scheduled_at?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
          seo_keywords?: string | null
        }
        Update: {
          author?: string
          avatar_url?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          scheduled_at?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
          seo_keywords?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_access: string | null
          nome: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          last_access?: string | null
          nome?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_access?: string | null
          nome?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string | null
          device_model: string | null
          device_type: string | null
          id: string
          os: string | null
          page_url: string | null
          user_email: string | null
          visitor_id: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device_model?: string | null
          device_type?: string | null
          id?: string
          os?: string | null
          page_url?: string | null
          user_email?: string | null
          visitor_id?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device_model?: string | null
          device_type?: string | null
          id?: string
          os?: string | null
          page_url?: string | null
          user_email?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      video_news: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
