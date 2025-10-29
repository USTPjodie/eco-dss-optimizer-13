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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      scenario_simulations: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          results: Json | null
          technology: string | null
          updated_at: string
          waste_input: number | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          results?: Json | null
          technology?: string | null
          updated_at?: string
          waste_input?: number | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          results?: Json | null
          technology?: string | null
          updated_at?: string
          waste_input?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scenario_simulations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technology_comparison: {
        Row: {
          capacity_range: string | null
          capital_cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          efficiency: number | null
          environmental_impact: string | null
          id: string
          name: string
          operating_cost: number | null
          type: string
          updated_at: string
        }
        Insert: {
          capacity_range?: string | null
          capital_cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          efficiency?: number | null
          environmental_impact?: string | null
          id?: string
          name: string
          operating_cost?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          capacity_range?: string | null
          capital_cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          efficiency?: number | null
          environmental_impact?: string | null
          id?: string
          name?: string
          operating_cost?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technology_comparison_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_data: {
        Row: {
          collection_date: string
          created_at: string
          created_by: string | null
          id: string
          municipality: string
          quantity: number
          unit: string
          updated_at: string
          waste_type: string
        }
        Insert: {
          collection_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          municipality: string
          quantity: number
          unit: string
          updated_at?: string
          waste_type: string
        }
        Update: {
          collection_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          municipality?: string
          quantity?: number
          unit?: string
          updated_at?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "waste_data_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wte_monitoring_data: {
        Row: {
          co_level: number | null
          co2_level: number | null
          created_at: string
          efficiency: number | null
          furnace_pressure: number | null
          id: string
          nox_level: number | null
          oxygen_level: number | null
          power_output: number | null
          primary_airflow: number | null
          secondary_airflow: number | null
          site_id: string | null
          so2_level: number | null
          steam_flow: number | null
          steam_pressure: number | null
          steam_temperature: number | null
          timestamp: string
        }
        Insert: {
          co_level?: number | null
          co2_level?: number | null
          created_at?: string
          efficiency?: number | null
          furnace_pressure?: number | null
          id?: string
          nox_level?: number | null
          oxygen_level?: number | null
          power_output?: number | null
          primary_airflow?: number | null
          secondary_airflow?: number | null
          site_id?: string | null
          so2_level?: number | null
          steam_flow?: number | null
          steam_pressure?: number | null
          steam_temperature?: number | null
          timestamp?: string
        }
        Update: {
          co_level?: number | null
          co2_level?: number | null
          created_at?: string
          efficiency?: number | null
          furnace_pressure?: number | null
          id?: string
          nox_level?: number | null
          oxygen_level?: number | null
          power_output?: number | null
          primary_airflow?: number | null
          secondary_airflow?: number | null
          site_id?: string | null
          so2_level?: number | null
          steam_flow?: number | null
          steam_pressure?: number | null
          steam_temperature?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "wte_monitoring_data_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "wte_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      wte_sites: {
        Row: {
          capacity: number
          created_at: string
          created_by: string | null
          economic_score: number | null
          environmental_score: number | null
          id: string
          latitude: number
          location_name: string
          longitude: number
          name: string
          status: string
          technology: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          created_by?: string | null
          economic_score?: number | null
          environmental_score?: number | null
          id?: string
          latitude: number
          location_name: string
          longitude: number
          name: string
          status: string
          technology: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          created_by?: string | null
          economic_score?: number | null
          environmental_score?: number | null
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          name?: string
          status?: string
          technology?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wte_sites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      app_role:
        | "super_admin"
        | "municipal_analyst"
        | "environmental_specialist"
        | "gis_planner"
        | "technologist"
        | "policy_maker"
        | "viewer"
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
      app_role: [
        "super_admin",
        "municipal_analyst",
        "environmental_specialist",
        "gis_planner",
        "technologist",
        "policy_maker",
        "viewer",
      ],
    },
  },
} as const
