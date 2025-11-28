# Fix: Delete Course Feature

## Masalah yang Diperbaiki

1. ✅ **Error JSX di Dialog** - Tidak bisa menggunakan `<ul>` dan `<li>` di DialogDescription
2. ✅ **Course muncul lagi setelah refresh** - Database tidak bisa delete karena RLS policy belum ada

## Yang Sudah Diperbaiki

### 1. Dialog Component (`managed-courses-section.tsx`)
- Mengganti `<ul>` dan `<li>` dengan `<p>` dan bullet points (•)
- Dialog sekarang bisa tampil tanpa error

### 2. Database Query (`upcoming-deadlines-section.tsx`)
- Memperbaiki query untuk menggunakan tabel yang benar:
  - ❌ `task_submissions` → ✅ `submissions`
  - ❌ `events` (tidak ada di schema)
  - ❌ `tasks.deadline` → ✅ `tasks.due_date`
- Query sekarang join melalui: `tasks → materials → modules → courses`

### 3. RLS Policies (Database)
- **PENTING**: Harus jalankan SQL berikut di Supabase SQL Editor

## Cara Menyelesaikan

### Step 1: Jalankan SQL di Supabase
1. Buka Supabase Dashboard
2. Pilih project SeaLaMS
3. Klik **SQL Editor**
4. Buat query baru
5. Copy-paste isi file `scripts/add-delete-policies.sql`
6. Klik **Run**

### Step 2: Test Delete Course
1. Login sebagai teacher
2. Di dashboard, klik **⋮** (More) pada course card
3. Pilih **Delete Course** (merah)
4. Konfirmasi delete
5. Course akan terhapus
6. Refresh halaman → course **TIDAK** muncul lagi

## File yang Diubah

1. ✅ `components/teacher/managed-courses-section.tsx` - Dialog fix
2. ✅ `components/teacher/upcoming-deadlines-section.tsx` - Query fix
3. ✅ `scripts/add-delete-policies.sql` - **RLS policies (HARUS DIJALANKAN!)**

## Catatan Penting

⚠️ **WAJIB menjalankan `add-delete-policies.sql` di Supabase**

Tanpa menjalankan SQL tersebut:
- Delete akan GAGAL di database
- Course akan muncul lagi setelah refresh
- Error "permission denied" di console browser

Setelah menjalankan SQL:
- Delete course akan permanen
- Cascade delete otomatis hapus:
  - Modules
  - Materials
  - Tasks
  - Submissions
  - Enrollments
  - Course Progress
  - Chat Context
