-- ============================================================================
-- Fix Infinite Recursion in Course Policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop ALL existing course policies to start fresh
DROP POLICY IF EXISTS "Published courses visible to all" ON courses;
DROP POLICY IF EXISTS "Courses visible to enrolled users and public" ON courses;
DROP POLICY IF EXISTS "Teachers can create courses" ON courses;
DROP POLICY IF EXISTS "Teachers can update own courses" ON courses;
DROP POLICY IF EXISTS "Teachers can delete own courses" ON courses;

-- SIMPLE policies without recursion

-- 1. SELECT: Anyone can view published courses, teachers can view their own, enrolled students can view their courses
CREATE POLICY "course_select_policy" ON courses
  FOR SELECT
  USING (
    is_published = true 
    OR teacher_id = auth.uid()
    OR id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
  );

-- 2. INSERT: Only authenticated teachers can create courses
CREATE POLICY "course_insert_policy" ON courses
  FOR INSERT
  WITH CHECK (
    auth.uid() = teacher_id
  );

-- 3. UPDATE: Teachers can update their own courses
CREATE POLICY "course_update_policy" ON courses
  FOR UPDATE
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- 4. DELETE: Teachers can delete their own courses
CREATE POLICY "course_delete_policy" ON courses
  FOR DELETE
  USING (teacher_id = auth.uid());
