-- ============================================================================
-- STEP 1: Create Storage Bucket
-- Copy paste ke Supabase Dashboard > Storage > Create Bucket
-- ============================================================================

-- Bucket Name: course-references
-- Public: YES (checked)
-- File size limit: 50 MB
-- Allowed MIME types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain

-- OR run this SQL in SQL Editor:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-references',
  'course-references',
  true,
  52428800,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Create Storage Policies
-- ============================================================================

-- Policy 1: Teachers can upload files to their own folder
CREATE POLICY "Teachers can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-references' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Public can view files
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-references');

-- Policy 3: Teachers can delete own files
CREATE POLICY "Teachers can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-references'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- STEP 3: Create course_references table (Optional - for tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS course_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_references_course_id ON course_references(course_id);

-- Enable RLS
ALTER TABLE course_references ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers see references for own courses
CREATE POLICY "Teachers see own course references"
ON course_references FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_references.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- Policy: Teachers can add references
CREATE POLICY "Teachers add course references"
ON course_references FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_references.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- ============================================================================
-- ✅ DONE! Storage setup complete
-- ============================================================================

-- Verify bucket created:
SELECT * FROM storage.buckets WHERE id = 'course-references';

-- Verify policies created:
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
