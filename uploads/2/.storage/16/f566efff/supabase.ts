import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          department: string;
          section: string;
          uploads_count: number;
          downloads_count: number;
          starred_departments: string[];
          starred_papers: string[];
          starred_notes: string[];
          created_at: string;
          avatar_url?: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          department: string;
          section: string;
          uploads_count?: number;
          downloads_count?: number;
          starred_departments?: string[];
          starred_papers?: string[];
          starred_notes?: string[];
          created_at?: string;
          avatar_url?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          department?: string;
          section?: string;
          uploads_count?: number;
          downloads_count?: number;
          starred_departments?: string[];
          starred_papers?: string[];
          starred_notes?: string[];
          avatar_url?: string;
        };
      };
      papers: {
        Row: {
          id: string;
          title: string;
          description: string;
          department_id: string;
          subject: string;
          type: string;
          file_url: string;
          thumbnail_url?: string;
          upload_date: string;
          uploader_id: string;
          downloads: number;
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          department_id: string;
          subject: string;
          type: string;
          file_url: string;
          thumbnail_url?: string;
          upload_date?: string;
          uploader_id: string;
          downloads?: number;
          tags?: string[];
        };
        Update: {
          title?: string;
          description?: string;
          department_id?: string;
          subject?: string;
          type?: string;
          file_url?: string;
          thumbnail_url?: string;
          downloads?: number;
          tags?: string[];
        };
      };
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          department_id: string;
          subject: string;
          upload_date: string;
          uploader_id: string;
          downloads: number;
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          department_id: string;
          subject: string;
          upload_date?: string;
          uploader_id: string;
          downloads?: number;
          tags?: string[];
        };
        Update: {
          title?: string;
          content?: string;
          department_id?: string;
          subject?: string;
          downloads?: number;
          tags?: string[];
        };
      };
    };
  };
}

export type DbUser = Database['public']['Tables']['users']['Row'];
export type DbPaper = Database['public']['Tables']['papers']['Row'];
export type DbNote = Database['public']['Tables']['notes']['Row'];