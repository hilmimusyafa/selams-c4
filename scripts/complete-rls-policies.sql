-- ============================================================================
-- Complete Missing RLS Policies for Course Management
-- Run this in Supabase SQL Editor AFTER setup.sql
-- ============================================================================

-- ============================================
-- TEACHERS: Course Management Policies
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Teachers can create modules in own courses" ON modules;
DROP POLICY IF EXISTS "Teachers can update modules in own courses" ON modules;
DROP POLICY IF EXISTS "Teachers can create materials in own courses" ON materials;
DROP POLICY IF EXISTS "Teachers can update materials in own courses" ON materials;
DROP POLICY IF EXISTS "Teachers can create tasks in own courses" ON tasks;
DROP POLICY IF EXISTS "Teachers can update tasks in own courses" ON tasks;

-- Teachers can insert modules in their own courses
CREATE POLICY "Teachers can create modules in own courses" ON modules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = modules.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Teachers can update modules in their own courses
CREATE POLICY "Teachers can update modules in own courses" ON modules
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = modules.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Teachers can insert materials in their own courses
CREATE POLICY "Teachers can create materials in own courses" ON materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM modules 
      JOIN courses ON courses.id = modules.course_id 
      WHERE modules.id = materials.module_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Teachers can update materials in their own courses
CREATE POLICY "Teachers can update materials in own courses" ON materials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM modules 
      JOIN courses ON courses.id = modules.course_id 
      WHERE modules.id = materials.module_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Teachers can create tasks in their own courses
CREATE POLICY "Teachers can create tasks in own courses" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM materials 
      JOIN modules ON modules.id = materials.module_id 
      JOIN courses ON courses.id = modules.course_id 
      WHERE materials.id = tasks.material_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Teachers can update tasks in their own courses
CREATE POLICY "Teachers can update tasks in own courses" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM materials 
      JOIN modules ON modules.id = materials.module_id 
      JOIN courses ON courses.id = modules.course_id 
      WHERE materials.id = tasks.material_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- ============================================
-- STUDENTS: Submission Policies
-- ============================================

-- Drop existing submission policies
DROP POLICY IF EXISTS "Students can view own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can create submissions" ON submissions;
DROP POLICY IF EXISTS "Students can update own submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can view submissions in own courses" ON submissions;
DROP POLICY IF EXISTS "Teachers can grade submissions in own courses" ON submissions;

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = student_id);

-- Students can create submissions
CREATE POLICY "Students can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own submissions (before graded)
CREATE POLICY "Students can update own submissions" ON submissions
  FOR UPDATE USING (auth.uid() = student_id AND grade IS NULL);

-- Teachers can view submissions in their courses
CREATE POLICY "Teachers can view submissions in own courses" ON submissions
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

-- Teachers can update submissions (for grading)
CREATE POLICY "Teachers can grade submissions in own courses" ON submissions
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

-- ============================================
-- CHAT CONTEXT: AI Integration Policies
-- ============================================

-- Drop existing chat context policies
DROP POLICY IF EXISTS "Teachers can create chat context in own courses" ON chat_context;
DROP POLICY IF EXISTS "Teachers can update chat context in own courses" ON chat_context;
DROP POLICY IF EXISTS "Students can view chat context in enrolled courses" ON chat_context;

-- Teachers can create chat context for their courses
CREATE POLICY "Teachers can create chat context in own courses" ON chat_context
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = chat_context.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Teachers can update chat context in their courses
CREATE POLICY "Teachers can update chat context in own courses" ON chat_context
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = chat_context.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Students can view chat context for enrolled courses
CREATE POLICY "Students can view chat context in enrolled courses" ON chat_context
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      JOIN enrollments ON enrollments.course_id = courses.id
      WHERE courses.id = chat_context.course_id 
      AND enrollments.student_id = auth.uid()
    )
  );
