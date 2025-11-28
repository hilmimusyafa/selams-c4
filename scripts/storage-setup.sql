-- ============================================================================
-- Storage Bucket for Course Reference Files
-- Run this in Supabase SQL Editor after running setup.sql
-- ============================================================================

-- Create storage bucket for course references
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-references',
  'course-references',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/msword']
);

-- Storage policies for course-references bucket
CREATE POLICY "Teachers can upload reference files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-references' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public can view reference files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-references');

CREATE POLICY "Teachers can delete own reference files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-references'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- Table for tracking AI-generated courses and their references
-- ============================================================================

CREATE TABLE course_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_course_references_course_id ON course_references(course_id);

-- RLS for course_references
ALTER TABLE course_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers see references for own courses"
ON course_references FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_references.course_id
    AND courses.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can add references to own courses"
ON course_references FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_references.course_id
    AND courses.teacher_id = auth.uid()
  )
);
