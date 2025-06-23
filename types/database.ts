export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          farm_name: string | null
          farm_size: number | null
          farm_size_unit: string | null
          location: string | null
          primary_crops: string[] | null
          experience_level: string | null
          preferred_language: string | null
          preferred_units: string | null
          notifications_enabled: boolean
          theme_preference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          farm_name?: string | null
          farm_size?: number | null
          farm_size_unit?: string | null
          location?: string | null
          primary_crops?: string[] | null
          experience_level?: string | null
          preferred_language?: string | null
          preferred_units?: string | null
          notifications_enabled?: boolean
          theme_preference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          farm_name?: string | null
          farm_size?: number | null
          farm_size_unit?: string | null
          location?: string | null
          primary_crops?: string[] | null
          experience_level?: string | null
          preferred_language?: string | null
          preferred_units?: string | null
          notifications_enabled?: boolean
          theme_preference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      detections: {
        Row: {
          id: string
          user_id: string
          image_url: string
          image_path: string | null
          detection_type: string
          crop_type: string
          result_data: Json
          confidence_score: number
          severity_level: string
          location_data: Json | null
          weather_data: Json | null
          treatment_applied: boolean
          treatment_data: Json | null
          notes: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          image_path?: string | null
          detection_type: string
          crop_type: string
          result_data: Json
          confidence_score: number
          severity_level: string
          location_data?: Json | null
          weather_data?: Json | null
          treatment_applied?: boolean
          treatment_data?: Json | null
          notes?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          image_path?: string | null
          detection_type?: string
          crop_type?: string
          result_data?: Json
          confidence_score?: number
          severity_level?: string
          location_data?: Json | null
          weather_data?: Json | null
          treatment_applied?: boolean
          treatment_data?: Json | null
          notes?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          name: string
          type: string
          description: string
          active_ingredients: string[] | null
          concentration_range: Json | null
          cost_per_liter: number | null
          effectiveness_rating: number | null
          safety_rating: number | null
          organic_certified: boolean
          preharvest_interval: string | null
          application_method: string[] | null
          target_pests: string[] | null
          target_diseases: string[] | null
          mixing_instructions: string | null
          safety_notes: string | null
          storage_requirements: string | null
          shelf_life: string | null
          supplier_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          description: string
          active_ingredients?: string[] | null
          concentration_range?: Json | null
          cost_per_liter?: number | null
          effectiveness_rating?: number | null
          safety_rating?: number | null
          organic_certified?: boolean
          preharvest_interval?: string | null
          application_method?: string[] | null
          target_pests?: string[] | null
          target_diseases?: string[] | null
          mixing_instructions?: string | null
          safety_notes?: string | null
          storage_requirements?: string | null
          shelf_life?: string | null
          supplier_info?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string
          active_ingredients?: string[] | null
          concentration_range?: Json | null
          cost_per_liter?: number | null
          effectiveness_rating?: number | null
          safety_rating?: number | null
          organic_certified?: boolean
          preharvest_interval?: string | null
          application_method?: string[] | null
          target_pests?: string[] | null
          target_diseases?: string[] | null
          mixing_instructions?: string | null
          safety_notes?: string | null
          storage_requirements?: string | null
          shelf_life?: string | null
          supplier_info?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          rarity: string
          icon: string | null
          requirements: Json
          reward_points: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          rarity: string
          icon?: string | null
          requirements: Json
          reward_points: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          rarity?: string
          icon?: string | null
          requirements?: Json
          reward_points?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          progress: number
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      educational_content: {
        Row: {
          id: string
          title: string
          description: string
          content_type: string
          category: string
          difficulty_level: string
          duration_minutes: number | null
          thumbnail_url: string | null
          content_url: string
          downloadable: boolean
          languages: string[]
          tags: string[] | null
          author: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content_type: string
          category: string
          difficulty_level: string
          duration_minutes?: number | null
          thumbnail_url?: string | null
          content_url: string
          downloadable?: boolean
          languages: string[]
          tags?: string[] | null
          author?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content_type?: string
          category?: string
          difficulty_level?: string
          duration_minutes?: number | null
          thumbnail_url?: string | null
          content_url?: string
          downloadable?: boolean
          languages?: string[]
          tags?: string[] | null
          author?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_content_progress: {
        Row: {
          id: string
          user_id: string
          content_id: string
          progress_percentage: number
          completed: boolean
          last_accessed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          progress_percentage?: number
          completed?: boolean
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          progress_percentage?: number
          completed?: boolean
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
      }
      farm_analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          total_scans: number
          pest_detections: number
          disease_detections: number
          high_severity_count: number
          medium_severity_count: number
          low_severity_count: number
          treatments_applied: number
          cost_spent: number | null
          weather_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          total_scans?: number
          pest_detections?: number
          disease_detections?: number
          high_severity_count?: number
          medium_severity_count?: number
          low_severity_count?: number
          treatments_applied?: number
          cost_spent?: number | null
          weather_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          total_scans?: number
          pest_detections?: number
          disease_detections?: number
          high_severity_count?: number
          medium_severity_count?: number
          low_severity_count?: number
          treatments_applied?: number
          cost_spent?: number | null
          weather_data?: Json | null
          created_at?: string
        }
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