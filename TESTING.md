# Testing Guide - SeaLaMS

## 🧪 Cara Membuat Test Data

### Step 1: Jalankan Database Schema

Di Supabase SQL Editor, jalankan file `scripts/setup.sql` (hanya sekali)

### Step 2: Buat Test Users

#### Melalui Supabase Dashboard:

1. Buka **Authentication** > **Users** > **Add User**
2. Buat beberapa user:
   - Teacher: `teacher@test.com` / `password123`
   - Student 1: `student1@test.com` / `password123`
   - Student 2: `student2@test.com` / `password123`

#### Melalui SQL (Alternative):

```sql
-- Tidak bisa insert langsung ke auth.users
-- Harus melalui Supabase Dashboard atau signup API
```

### Step 3: Set Role Teacher

```sql
-- Di SQL Editor, jalankan:
UPDATE profiles 
SET role = 'teacher', 
    display_name = 'Dr. Ahmad Kurniawan',
    bio = 'Pengajar berpengalaman di bidang Computer Science'
WHERE email = 'teacher@test.com';

-- Update student names
UPDATE profiles 
SET display_name = 'Budi Santoso'
WHERE email = 'student1@test.com';

UPDATE profiles 
SET display_name = 'Siti Nur Azizah'
WHERE email = 'student2@test.com';
```

### Step 4: Buat Sample Course

```sql
-- Dapatkan teacher_id terlebih dahulu
SELECT id, email, display_name FROM profiles WHERE role = 'teacher';

-- Insert course (ganti dengan UUID teacher yang sebenarnya)
INSERT INTO courses (teacher_id, title, description, cover_image_url, is_published) 
VALUES (
  'PASTE-TEACHER-UUID-DISINI'::uuid,
  'Pengantar Algoritma dan Struktur Data',
  'Pelajari dasar-dasar algoritma, struktur data, dan teknik pemrograman yang efisien.',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  true
);

-- Dapatkan course_id yang baru dibuat
SELECT id, title FROM courses ORDER BY created_at DESC LIMIT 1;
```

### Step 5: Buat Modules

```sql
-- Ganti dengan course_id yang sebenarnya
INSERT INTO modules (course_id, title, description, order_index) 
VALUES 
  ('PASTE-COURSE-UUID'::uuid, 'Bab 1: Pengenalan Algoritma', 'Memahami konsep dasar algoritma', 1),
  ('PASTE-COURSE-UUID'::uuid, 'Bab 2: Array dan List', 'Struktur data dasar: Array dan Linked List', 2),
  ('PASTE-COURSE-UUID'::uuid, 'Bab 3: Stack dan Queue', 'Struktur data LIFO dan FIFO', 3);

-- Dapatkan module_ids
SELECT id, title FROM modules WHERE course_id = 'PASTE-COURSE-UUID'::uuid ORDER BY order_index;
```

### Step 6: Buat Materials

```sql
-- Ganti dengan module_id yang sebenarnya (module pertama)
INSERT INTO materials (module_id, type, title, content, order_index) 
VALUES 
  ('PASTE-MODULE-1-UUID'::uuid, 'text', 'Apa itu Algoritma?', 
   '# Pengantar Algoritma\n\nAlgoritma adalah urutan langkah-langkah logis untuk menyelesaikan masalah...', 1),
  ('PASTE-MODULE-1-UUID'::uuid, 'video', 'Video: Algoritma Sederhana', 
   'https://www.youtube.com/embed/rL8X2mlNHPM', 2),
  ('PASTE-MODULE-1-UUID'::uuid, 'quiz', 'Quiz: Konsep Algoritma', 
   '[{"question":"Apa itu algoritma?","options":["Langkah logis","Bahasa pemrograman"],"correct":0}]', 3);
```

### Step 7: Enroll Students

```sql
-- Dapatkan student IDs
SELECT id, email, display_name FROM profiles WHERE role = 'student';

-- Enroll students (ganti dengan student_id dan course_id sebenarnya)
INSERT INTO enrollments (student_id, course_id) 
VALUES 
  ('PASTE-STUDENT-1-UUID'::uuid, 'PASTE-COURSE-UUID'::uuid),
  ('PASTE-STUDENT-2-UUID'::uuid, 'PASTE-COURSE-UUID'::uuid);
```

---

## 🚀 Quick Test Data Script (All-in-One)

Jalankan script berikut **SETELAH** membuat users di Supabase Auth Dashboard:

```sql
-- 1. Update roles
UPDATE profiles SET role = 'teacher', display_name = 'Dr. Ahmad Kurniawan' 
WHERE email = 'teacher@test.com';

UPDATE profiles SET display_name = 'Budi Santoso' WHERE email = 'student1@test.com';
UPDATE profiles SET display_name = 'Siti Nur Azizah' WHERE email = 'student2@test.com';

-- 2. Get teacher ID
DO $$
DECLARE
  v_teacher_id UUID;
  v_course_id UUID;
  v_module_id UUID;
  v_student1_id UUID;
  v_student2_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO v_teacher_id FROM profiles WHERE email = 'teacher@test.com';
  SELECT id INTO v_student1_id FROM profiles WHERE email = 'student1@test.com';
  SELECT id INTO v_student2_id FROM profiles WHERE email = 'student2@test.com';
  
  -- Create course
  INSERT INTO courses (teacher_id, title, description, cover_image_url, is_published)
  VALUES (
    v_teacher_id,
    'Pengantar Algoritma dan Struktur Data',
    'Pelajari dasar-dasar algoritma, struktur data, dan teknik pemrograman yang efisien.',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    true
  ) RETURNING id INTO v_course_id;
  
  -- Create modules
  INSERT INTO modules (course_id, title, description, order_index)
  VALUES 
    (v_course_id, 'Bab 1: Pengenalan Algoritma', 'Memahami konsep dasar algoritma', 1),
    (v_course_id, 'Bab 2: Array dan List', 'Struktur data dasar', 2),
    (v_course_id, 'Bab 3: Stack dan Queue', 'Struktur data LIFO dan FIFO', 3);
  
  -- Get first module ID
  SELECT id INTO v_module_id FROM modules WHERE course_id = v_course_id ORDER BY order_index LIMIT 1;
  
  -- Create materials for first module
  INSERT INTO materials (module_id, type, title, content, order_index)
  VALUES 
    (v_module_id, 'text', 'Apa itu Algoritma?', 
     E'# Pengantar Algoritma\n\nAlgoritma adalah urutan langkah-langkah logis untuk menyelesaikan masalah...', 1),
    (v_module_id, 'video', 'Video: Algoritma Sederhana', 
     'https://www.youtube.com/embed/rL8X2mlNHPM', 2),
    (v_module_id, 'quiz', 'Quiz: Konsep Algoritma', 
     '[{"question":"Apa itu algoritma?","options":["Langkah logis","Bahasa pemrograman"],"correct":0}]', 3);
  
  -- Enroll students
  INSERT INTO enrollments (student_id, course_id)
  VALUES 
    (v_student1_id, v_course_id),
    (v_student2_id, v_course_id);
  
  RAISE NOTICE 'Test data created successfully!';
  RAISE NOTICE 'Course ID: %', v_course_id;
END $$;
```

---

## ✅ Verify Data

```sql
-- Check profiles
SELECT id, email, role, display_name FROM profiles;

-- Check courses
SELECT c.id, c.title, p.display_name as teacher 
FROM courses c 
JOIN profiles p ON c.teacher_id = p.id;

-- Check modules
SELECT m.id, m.title, c.title as course_name 
FROM modules m 
JOIN courses c ON m.course_id = c.id 
ORDER BY m.order_index;

-- Check enrollments
SELECT e.id, p.display_name as student, c.title as course 
FROM enrollments e 
JOIN profiles p ON e.student_id = p.id 
JOIN courses c ON e.course_id = c.id;
```

---

## 🔐 Testing Authentication

Gunakan credentials berikut untuk login:
- **Teacher**: `teacher@test.com` / `password123`
- **Student 1**: `student1@test.com` / `password123`
- **Student 2**: `student2@test.com` / `password123`

---

## 📝 Testing Checklist

- [ ] Setup database schema (`scripts/setup.sql`)
- [ ] Buat test users di Supabase Auth
- [ ] Update roles (teacher/student)
- [ ] Buat sample course
- [ ] Buat modules
- [ ] Buat materials
- [ ] Enroll students
- [ ] Test login dengan credentials
- [ ] Test melihat courses
- [ ] Test student dashboard
- [ ] Test teacher dashboard
