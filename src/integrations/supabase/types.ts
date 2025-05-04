export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_services: {
        Row: {
          billing_cycle: string
          client_id: string
          contract_end: string
          contract_start: string
          created_at: string
          description: string
          id: string
          location_id: string | null
          status: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at: string
          value: number
        }
        Insert: {
          billing_cycle?: string
          client_id: string
          contract_end: string
          contract_start: string
          created_at?: string
          description: string
          id?: string
          location_id?: string | null
          status?: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at?: string
          value: number
        }
        Update: {
          billing_cycle?: string
          client_id?: string
          contract_end?: string
          contract_start?: string
          created_at?: string
          description?: string
          id?: string
          location_id?: string | null
          status?: string
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          assigned_to: string | null
          billing_emails: string[] | null
          company: string | null
          contract_end: string | null
          contract_start: string | null
          contract_term: number | null
          contract_value: number | null
          converted_from_lead_id: string | null
          created_at: string
          due_day: number | null
          email: string
          id: string
          is_active: boolean
          last_readjust_date: string | null
          name: string
          notes: string | null
          phone: string | null
          plan: Database["public"]["Enums"]["service_type"] | null
          private_room: string | null
          readjust_index: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          billing_emails?: string[] | null
          company?: string | null
          contract_end?: string | null
          contract_start?: string | null
          contract_term?: number | null
          contract_value?: number | null
          converted_from_lead_id?: string | null
          created_at?: string
          due_day?: number | null
          email: string
          id?: string
          is_active?: boolean
          last_readjust_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["service_type"] | null
          private_room?: string | null
          readjust_index?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          billing_emails?: string[] | null
          company?: string | null
          contract_end?: string | null
          contract_start?: string | null
          contract_term?: number | null
          contract_value?: number | null
          converted_from_lead_id?: string | null
          created_at?: string
          due_day?: number | null
          email?: string
          id?: string
          is_active?: boolean
          last_readjust_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["service_type"] | null
          private_room?: string | null
          readjust_index?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_converted_from_lead_id_fkey"
            columns: ["converted_from_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          last_contact: string | null
          meeting_scheduled: string | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          source: Database["public"]["Enums"]["lead_source"]
          source_detail: string | null
          stage_id: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          last_contact?: string | null
          meeting_scheduled?: string | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          source_detail?: string | null
          stage_id?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contact?: string | null
          meeting_scheduled?: string | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          source_detail?: string | null
          stage_id?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          order_number: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          order_number: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          order_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      proposal_items: {
        Row: {
          created_at: string
          id: string
          name: string
          proposal_id: string
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          proposal_id: string
          quantity?: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          proposal_id?: string
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          lead_id: string
          notes: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          title: string
          value: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          lead_id: string
          notes?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          title: string
          value: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          title?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      space_allocations: {
        Row: {
          client_id: string
          contract_id: string | null
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          space_id: string
          start_date: string
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          contract_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          space_id: string
          start_date: string
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          contract_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          space_id?: string
          start_date?: string
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_allocations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_allocations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "client_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_allocations_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          area: number | null
          capacity: number | null
          created_at: string
          description: string | null
          floor: number | null
          id: string
          is_active: boolean
          name: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          area?: number | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          floor?: number | null
          id?: string
          is_active?: boolean
          name: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          area?: number | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          floor?: number | null
          id?: string
          is_active?: boolean
          name?: string
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
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
      lead_source:
        | "site_organic"
        | "google_ads"
        | "meta_ads"
        | "instagram"
        | "referral"
        | "in_person_visit"
        | "events"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
        | "converted"
      proposal_status:
        | "draft"
        | "sent"
        | "viewed"
        | "accepted"
        | "rejected"
        | "expired"
        | "negotiating"
      service_type:
        | "fiscal_address"
        | "flex_desk"
        | "fixed_desk"
        | "private_office"
        | "meeting_room"
        | "auditorium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lead_source: [
        "site_organic",
        "google_ads",
        "meta_ads",
        "instagram",
        "referral",
        "in_person_visit",
        "events",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost",
        "converted",
      ],
      proposal_status: [
        "draft",
        "sent",
        "viewed",
        "accepted",
        "rejected",
        "expired",
        "negotiating",
      ],
      service_type: [
        "fiscal_address",
        "flex_desk",
        "fixed_desk",
        "private_office",
        "meeting_room",
        "auditorium",
      ],
    },
  },
} as const
