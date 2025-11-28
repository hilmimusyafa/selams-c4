-- ============================================================================
-- Add DELETE policies for courses and related tables
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Allow teachers to delete their own courses
CREATE POLICY "Teachers can delete own courses" ON courses
  FOR DELETE USING (auth.uid() = teacher_id);

-- Allow teachers to delete modules in their courses
CREATE POLICY "Teachers can delete modules in own courses" ON modules
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = modules.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete materials in their courses
CREATE POLICY "Teachers can delete materials in own courses" ON materials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM modules 
      JOIN courses ON courses.id = modules.course_id 
      WHERE modules.id = materials.module_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete tasks in their courses
CREATE POLICY "Teachers can delete tasks in own courses" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM materials 
      JOIN modules ON modules.id = materials.module_id 
      JOIN courses ON courses.id = modules.course_id 
      WHERE materials.id = tasks.material_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete enrollments in their courses
CREATE POLICY "Teachers can delete enrollments in own courses" ON enrollments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete submissions in their courses
CREATE POLICY "Teachers can delete submissions in own courses" ON submissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN materials ON materials.id = tasks.material_id
      JOIN modules ON modules.id = materials.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE tasks.id = submissions.task_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete course progress in their courses
CREATE POLICY "Teachers can delete progress in own courses" ON course_progress
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM enrollments
      JOIN courses ON courses.id = enrollments.course_id
      WHERE enrollments.id = course_progress.enrollment_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete chat context in their courses
CREATE POLICY "Teachers can delete chat context in own courses" ON chat_context
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = chat_context.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );
