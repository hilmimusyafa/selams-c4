-- ============================================================================
-- SEED DATA - OPTIONAL
-- ============================================================================
-- File ini berisi contoh data untuk testing
-- CARA MENGGUNAKAN:
-- 1. Pastikan setup.sql sudah dijalankan
-- 2. Buat user terlebih dahulu melalui Supabase Auth Dashboard atau signup di aplikasi
-- 3. Ganti UUID di bawah dengan UUID user yang sudah dibuat
-- 4. Jalankan script ini di SQL Editor
-- ============================================================================

-- CATATAN PENTING:
-- Ganti UUID berikut dengan UUID user yang sudah dibuat di Supabase Auth
-- Cara mendapatkan UUID:
-- 1. Buka Supabase Dashboard > Authentication > Users
-- 2. Copy UUID user yang ingin dijadikan teacher/student
-- 3. Ganti nilai di bawah

-- Contoh: Update role user menjadi teacher (ganti dengan UUID user kamu)
-- UPDATE profiles SET role = 'teacher' WHERE id = 'UUID-USER-KAMU-DISINI'::uuid;

-- ============================================================================
-- TEMPLATE: Setelah punya user, bisa insert data seperti ini
-- ============================================================================

-- Contoh insert course (ganti teacher_id dengan UUID user teacher kamu)
-- INSERT INTO courses (teacher_id, title, description, cover_image_url, is_published) 
-- VALUES (
--   'UUID-TEACHER-KAMU'::uuid,
--   'Pengantar Algoritma dan Struktur Data',
--   'Pelajari dasar-dasar algoritma, struktur data, dan teknik pemrograman yang efisien.',
--   'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
--   true
-- );

-- Contoh insert modules (ganti course_id dengan ID course yang sudah dibuat)
-- INSERT INTO modules (course_id, title, description, order_index) 
-- VALUES 
--   ('UUID-COURSE-KAMU'::uuid, 'Bab 1: Pengenalan Algoritma', 'Memahami konsep dasar algoritma', 1),
--   ('UUID-COURSE-KAMU'::uuid, 'Bab 2: Array dan List', 'Struktur data dasar: Array dan Linked List', 2),
--   ('UUID-COURSE-KAMU'::uuid, 'Bab 3: Stack dan Queue', 'Struktur data LIFO dan FIFO', 3);

-- Dan seterusnya...

-- ============================================================================
-- HELPER: View untuk melihat user yang sudah terdaftar
-- ============================================================================

-- Jalankan query ini untuk melihat semua user yang sudah terdaftar
-- SELECT id, email, role, display_name, created_at FROM profiles ORDER BY created_at DESC;

-- Jalankan query ini untuk melihat semua courses yang sudah dibuat
-- SELECT c.id, c.title, c.is_published, p.display_name as teacher_name, c.created_at 
-- FROM courses c 
-- JOIN profiles p ON c.teacher_id = p.id 
-- ORDER BY c.created_at DESC;
