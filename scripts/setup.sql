-- ============================================================================
-- SeLaMS Database Schema - Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Create Enum Types
CREATE TYPE user_role AS ENUM ('teacher', 'student');
CREATE TYPE material_type AS ENUM ('text', 'video', 'quiz', 'assignment');
CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'submitted', 'graded', 'late');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'late');

-- 2. Profiles Table (User Identity & Role)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  telegram_chat_id TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Modules Table (Chapters/Bab)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Materials Table (Sub-bab/Content: Text, Video, Quiz, Assignment)
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  type material_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- Rich text/Markdown/Embed URL
  video_url TEXT, -- For video materials
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tasks Table (Quiz/Assignment with Deadlines)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  max_score INTEGER DEFAULT 100,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Enrollments Table (Student -> Course Relationship)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- 8. Course Progress Table (Tracks material completion per student)
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(enrollment_id, material_id)
);

-- 9. Submissions Table (Student Submissions for Tasks)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT,
  answer_text TEXT,
  status submission_status NOT NULL DEFAULT 'submitted',
  grade INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. AI Chat Context Table (Stores course material for RAG)
CREATE TABLE chat_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  context_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_context ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can see their own profile and all teacher profiles
CREATE POLICY "Public profiles visible to all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses: Public to view, teachers can manage own courses
CREATE POLICY "Published courses visible to all" ON courses
  FOR SELECT USING (is_published = true OR teacher_id = auth.uid());

CREATE POLICY "Teachers can create courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = teacher_id);

-- Modules: Visible if course is visible
CREATE POLICY "Modules visible with course" ON modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = modules.course_id 
      AND (courses.is_published = true OR courses.teacher_id = auth.uid())
    )
  );

-- Materials: Visible if course is visible
CREATE POLICY "Materials visible with course" ON materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules 
      JOIN courses ON courses.id = modules.course_id 
      WHERE modules.id = materials.module_id 
      AND (courses.is_published = true OR courses.teacher_id = auth.uid())
    )
  );

-- Tasks: Visible if material/course is visible
CREATE POLICY "Tasks visible with material" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM materials 
      JOIN modules ON modules.id = materials.module_id 
      JOIN courses ON courses.id = modules.course_id 
      WHERE materials.id = tasks.material_id 
      AND (courses.is_published = true OR courses.teacher_id = auth.uid())
    )
  );

-- Enrollments: Students see own enrollments, teachers see students in their courses
CREATE POLICY "Students see own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers see students in own courses" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Allow enrollment creation" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Course Progress: Students see own progress, teachers see progress in their courses
CREATE POLICY "Students see own progress" ON course_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = course_progress.enrollment_id 
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers see progress in own courses" ON course_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      JOIN courses ON courses.id = enrollments.course_id 
      WHERE enrollments.id = course_progress.enrollment_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students update own progress" ON course_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = course_progress.enrollment_id 
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Students insert own progress" ON course_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = course_progress.enrollment_id 
      AND enrollments.student_id = auth.uid()
    )
  );

-- Submissions: Students see own submissions, teachers see submissions in their courses
CREATE POLICY "Students see own submissions" ON submissions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers see submissions in own courses" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN materials ON materials.id = tasks.material_id 
      JOIN modules ON modules.id = materials.module_id 
      JOIN courses ON courses.id = modules.course_id 
      WHERE tasks.id = submissions.task_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can grade" ON submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN materials ON materials.id = tasks.material_id 
      JOIN modules ON modules.id = materials.module_id 
      JOIN courses ON courses.id = modules.course_id 
      WHERE tasks.id = submissions.task_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Chat Context: Visible with course
CREATE POLICY "Chat context visible with course" ON chat_context
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = chat_context.course_id 
      AND (courses.is_published = true OR courses.teacher_id = auth.uid())
    )
  );

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_materials_module_id ON materials(module_id);
CREATE INDEX idx_tasks_material_id ON tasks(material_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_course_progress_enrollment_id ON course_progress(enrollment_id);
CREATE INDEX idx_course_progress_material_id ON course_progress(material_id);
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_grade ON submissions(grade);
CREATE INDEX idx_chat_context_course_id ON chat_context(course_id);

-- ============================================================================
-- Auto-create Profile Trigger (Runs when new user signs up)
-- ============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    'student', -- Default role is student
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Helper Function: Update user updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables that have updated_at column
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
