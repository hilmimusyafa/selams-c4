# Fix: Student Cannot Access Enrolled Courses

## Masalah
Student tidak bisa membuka course yang sudah mereka enroll, mendapat error saat fetch course data.

## Penyebab
1. **RLS Policy terlalu ketat** - Policy course hanya mengizinkan akses jika `is_published = true` ATAU user adalah teacher
2. **Enrolled students tidak bisa akses** - Student yang sudah enrolled tidak bisa lihat course yang belum published
3. **Missing policies** - Banyak policy CRUD (Create, Read, Update, Delete) yang belum ada

## Solusi

### 1. Update Course Access Policy
File: `scripts/fix-course-access-policy.sql`

Policy baru mengizinkan akses course jika:
- ✅ Course is published (public)
- ✅ User adalah teacher (pembuat course)
- ✅ User adalah student yang enrolled

### 2. Complete Missing Policies
File: `scripts/complete-rls-policies.sql`

Menambahkan policy untuk:
- ✅ Teachers: CREATE/UPDATE modules, materials, tasks
- ✅ Students: CREATE/UPDATE submissions
- ✅ Students: VIEW/UPDATE course progress
- ✅ Chat context untuk AI integration

### 3. Fix Frontend Query
File: `app/course/[id]/page.tsx`

Perubahan:
- ✅ Check enrollment FIRST (sebelum fetch course)
- ✅ Tambahkan `teacher_id` ke query untuk cek access
- ✅ Client-side validation: harus teacher ATAU enrolled
- ✅ Better error logging untuk debugging

## Cara Menyelesaikan

### Step 1: Update Course Access Policy
\`\`\`sql
-- Jalankan di Supabase SQL Editor
-- File: scripts/fix-course-access-policy.sql
\`\`\`

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `scripts/fix-course-access-policy.sql`
3. Paste dan **Run**

### Step 2: Add Complete Policies
\`\`\`sql
-- Jalankan di Supabase SQL Editor
-- File: scripts/complete-rls-policies.sql
\`\`\`

1. Di SQL Editor yang sama
2. Copy isi file `scripts/complete-rls-policies.sql`
3. Paste dan **Run**

### Step 3: Test Access
1. Login sebagai **student**
2. Pastikan student sudah enrolled di course (cek tabel `enrollments`)
3. Klik course dari dashboard atau `/courses`
4. Course page harus terbuka tanpa error

## Enroll Student ke Course (Jika Belum)

Jika student belum enrolled, jalankan SQL ini:

\`\`\`sql
-- Ganti UUID dengan ID yang sesuai
INSERT INTO enrollments (student_id, course_id)
VALUES (
  'STUDENT-UUID-HERE'::uuid,
  'COURSE-UUID-HERE'::uuid
);
\`\`\`

Cara mendapatkan UUID:
- Student UUID: Supabase Dashboard → Authentication → Users
- Course UUID: Supabase Dashboard → Table Editor → courses

## Testing Checklist

- [ ] Teacher bisa buka course mereka sendiri
- [ ] Student bisa buka course yang mereka enroll
- [ ] Student TIDAK bisa buka course yang tidak mereka enroll
- [ ] Student bisa lihat modules dan materials
- [ ] Student bisa update progress (mark as complete)
- [ ] Teacher bisa edit course content
- [ ] Teacher bisa create modules/materials/tasks

## File yang Diubah

1. ✅ `app/course/[id]/page.tsx` - Better error handling & access check
2. ✅ `scripts/fix-course-access-policy.sql` - Fix course visibility policy
3. ✅ `scripts/complete-rls-policies.sql` - Add missing CRUD policies

## Catatan Penting

⚠️ **WAJIB menjalankan KEDUA file SQL di Supabase**

Urutan eksekusi:
1. `fix-course-access-policy.sql` - Fix course access
2. `complete-rls-policies.sql` - Add missing policies

Tanpa menjalankan SQL:
- Student tetap tidak bisa akses enrolled courses
- Error "permission denied" atau "row level security" akan muncul
- Course content tidak bisa di-create/update

Setelah menjalankan SQL:
- ✅ Student bisa akses enrolled courses
- ✅ Teacher bisa manage course content
- ✅ Permissions terstruktur dengan baik
