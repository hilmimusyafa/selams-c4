-- ============================================================================
-- Fix Course Access Policy for Enrolled Students
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop existing policy for viewing courses
DROP POLICY IF EXISTS "Published courses visible to all" ON courses;

-- Create new policy: Allow viewing if:
-- 1. Course is published (public), OR
-- 2. User is the teacher, OR  
-- 3. User is enrolled as a student
CREATE POLICY "Courses visible to enrolled users and public" ON courses
  FOR SELECT USING (
    is_published = true 
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = courses.id 
      AND enrollments.student_id = auth.uid()
    )
  );

-- Drop and recreate progress policies
DROP POLICY IF EXISTS "Students can update own progress" ON course_progress;
DROP POLICY IF EXISTS "Students can insert own progress" ON course_progress;

-- Students can insert their own progress
CREATE POLICY "Students can insert own progress" ON course_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = course_progress.enrollment_id 
      AND enrollments.student_id = auth.uid()
    )
  );

-- Students can update their own progress
CREATE POLICY "Students can update own progress" ON course_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = course_progress.enrollment_id 
      AND enrollments.student_id = auth.uid()
    )
  );
