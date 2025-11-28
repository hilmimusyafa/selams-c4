# Fix: Course Creation Fails - Infinite Recursion & Storage Error

## Masalah

Ketika save course dari AI wizard, muncul error:
1. ❌ **"infinite recursion detected in policy for relation courses"**
2. ❌ **"Bucket not found"**
3. ❌ Course gagal tersimpan

## Penyebab

### 1. Infinite Recursion di RLS Policy
Policy course yang dibuat sebelumnya (`fix-course-access-policy.sql`) menyebabkan loop:
- Policy mengecek `EXISTS (SELECT ... FROM enrollments WHERE course_id = courses.id)`
- Saat INSERT course baru, belum ada enrollment
- Policy mencoba cek enrollment → cek course → cek enrollment → LOOP!

### 2. Storage Bucket Belum Ada
File upload mencoba akses bucket `course-references` yang belum dibuat di Supabase Storage.

## Solusi

### 1. Fix RLS Policy (WAJIB)
File: `scripts/fix-infinite-recursion.sql`

**Policy baru (tanpa recursion):**
```sql
-- SELECT: Simple check tanpa nested EXISTS
CREATE POLICY "course_select_policy" ON courses
  FOR SELECT USING (
    is_published = true 
    OR teacher_id = auth.uid()
    OR id IN (SELECT course_id FROM enrollments WHERE student_id = auth.uid())
  );

-- INSERT: Teacher bisa create
CREATE POLICY "course_insert_policy" ON courses
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

-- UPDATE/DELETE: Teacher bisa manage own courses
```

### 2. Disable File Upload (Sementara)
File: `app/teacher/course/create/page.tsx`

Karena bucket belum ready, file upload di-skip:
```typescript
// Skip file upload for now
const referenceUrls: string[] = []
```

## Cara Menyelesaikan

### Step 1: Fix RLS Policy (WAJIB!)
```bash
# Jalankan di Supabase SQL Editor
# File: scripts/fix-infinite-recursion.sql
```

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy isi file `scripts/fix-infinite-recursion.sql`
3. Paste dan **Run**
4. Pastikan semua policy berhasil dibuat

### Step 2: Test Create Course
1. Login sebagai **teacher**
2. Klik **Create Course** (FAB atau sidebar)
3. Isi **Step 1**: Title & Description
4. Klik **Next**
5. Isi **Step 2**: Keywords (file upload dilewati)
6. Klik **Generate with AI**
7. Tunggu AI generate (mock 3 detik)
8. **Step 4**: Preview hasil
9. Klik **Save Course**
10. ✅ Course berhasil tersimpan!

### Step 3: Setup Storage (Opsional - untuk file upload)
Jika ingin aktifkan file upload nanti:

```sql
-- Jalankan di Supabase SQL Editor
-- File: scripts/SETUP_STORAGE.sql
```

Atau manual:
1. Supabase Dashboard → **Storage**
2. Create bucket: `course-references`
3. Set Public: **No** (private)
4. Enable RLS policies untuk bucket

## Testing Checklist

- [ ] Policy tidak ada infinite recursion error
- [ ] Teacher bisa create course
- [ ] Course tersimpan ke database
- [ ] Modules tersimpan dengan benar
- [ ] Materials tersimpan dengan benar
- [ ] Tasks (quiz) tersimpan dengan benar
- [ ] Redirect ke success page (Step 5)
- [ ] Course muncul di teacher dashboard

## File yang Diubah

1. ✅ `scripts/fix-infinite-recursion.sql` - Fix RLS policy **WAJIB DIJALANKAN**
2. ✅ `app/teacher/course/create/page.tsx` - Disable file upload sementara
3. ✅ Console logging untuk debugging lebih baik

## Catatan Penting

⚠️ **WAJIB menjalankan `fix-infinite-recursion.sql`**

Tanpa menjalankan SQL ini:
- ❌ Course INSERT akan terus error infinite recursion
- ❌ Tidak bisa create course sama sekali
- ❌ Database akan hang/timeout

Setelah menjalankan SQL:
- ✅ Policy sederhana tanpa recursion
- ✅ Teacher bisa create/update/delete courses
- ✅ Student bisa view enrolled courses
- ✅ Public bisa view published courses

## Next Steps (Opsional)

Jika ingin aktifkan file upload:
1. Run `scripts/SETUP_STORAGE.sql` di Supabase
2. Uncomment kode upload di `generateCourseStructure()`
3. Test upload PDF/DOCX/TXT

Untuk sekarang, course creation akan bekerja tanpa file upload! 🎉
