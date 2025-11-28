// Database types based on setup.sql schema
export type UserRole = 'teacher' | 'student';
export type MaterialType = 'text' | 'video' | 'quiz' | 'assignment';
export type TaskStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'late';
export type SubmissionStatus = 'submitted' | 'graded' | 'late';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          display_name: string;
          avatar_url: string | null;
          telegram_chat_id: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          display_name: string;
          avatar_url?: string | null;
          telegram_chat_id?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          display_name?: string;
          avatar_url?: string | null;
          telegram_chat_id?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          module_id: string;
          type: MaterialType;
          title: string;
          content: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          type: MaterialType;
          title: string;
          content?: string | null;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          type?: MaterialType;
          title?: string;
          content?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          material_id: string;
          due_date: string | null;
          max_score: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          material_id: string;
          due_date?: string | null;
          max_score?: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          material_id?: string;
          due_date?: string | null;
          max_score?: number;
          description?: string | null;
          created_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          enrolled_at?: string;
        };
      };
      course_progress: {
        Row: {
          id: string;
          enrollment_id: string;
          material_id: string;
          is_completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          material_id: string;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          material_id?: string;
          is_completed?: boolean;
          completed_at?: string | null;
        };
      };
      submissions: {
        Row: {
          id: string;
          task_id: string;
          student_id: string;
          file_url: string | null;
          answer_text: string | null;
          status: SubmissionStatus;
          grade: number | null;
          feedback: string | null;
          submitted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          student_id: string;
          file_url?: string | null;
          answer_text?: string | null;
          status?: SubmissionStatus;
          grade?: number | null;
          feedback?: string | null;
          submitted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          student_id?: string;
          file_url?: string | null;
          answer_text?: string | null;
          status?: SubmissionStatus;
          grade?: number | null;
          feedback?: string | null;
          submitted_at?: string;
          created_at?: string;
        };
      };
      chat_context: {
        Row: {
          id: string;
          course_id: string;
          material_id: string;
          context_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          material_id: string;
          context_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          material_id?: string;
          context_text?: string;
          created_at?: string;
        };
      };
    };
  };
}
