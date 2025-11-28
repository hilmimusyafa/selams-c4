# SeaLaMS - Setup & Development Guide

## 🚀 Setup Awal

### 1. Setup Supabase Project

1. **Buat Supabase Project**
   - Buka [https://app.supabase.com](https://app.supabase.com)
   - Klik "New Project"
   - Isi nama project, database password, dan pilih region terdekat (contoh: Singapore)
   - Tunggu hingga project selesai dibuat (~2 menit)

2. **Jalankan Database Schema**
   - Di Supabase Dashboard, buka menu **SQL Editor**
   - Klik **New Query**
   - Copy seluruh isi file `scripts/setup.sql`
   - Paste ke SQL Editor
   - Klik **Run** atau tekan `Ctrl+Enter`
   - Pastikan tidak ada error (semua tabel, RLS policies, triggers, dan indexes berhasil dibuat)
   
   ✅ **Script ini sudah include:**
   - Auto-create profile saat user signup (trigger)
   - Auto-update timestamp saat update data (trigger)
   - Row Level Security (RLS) policies untuk keamanan data

3. **Dapatkan API Credentials**
   - Di Supabase Dashboard, buka menu **Settings > API**
   - Copy nilai berikut:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: `eyJhbGc...` (key yang panjang)

### 2. Setup Environment Variables

1. **Buka file `.env.local`** di root project
2. **Ganti nilai placeholder** dengan credentials dari Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-actual-anon-key
```

⚠️ **PENTING**: File `.env.local` sudah ada di `.gitignore` jadi tidak akan ter-commit ke Git.

### 3. Install Dependencies

```bash
cd /workspaces/Development/SeaLaMS/selams-c4
pnpm install
```

### 4. Jalankan Development Server

```bash
pnpm dev
```

Web akan berjalan di: **http://localhost:3000**

---

## 📁 Struktur Integrasi Supabase

```
lib/supabase/
├── types.ts          # TypeScript types dari database schema
├── client.ts         # Client untuk Client Components (browser)
├── server.ts         # Client untuk Server Components & Server Actions
├── middleware.ts     # Helper untuk session management
└── queries.ts        # Helper functions untuk database operations
```

---

## 🔧 Cara Menggunakan Supabase di Kode

### Di Client Component

```tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function MyClientComponent() {
  const [courses, setCourses] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true);
      
      setCourses(data || []);
    }
    fetchCourses();
  }, []);

  return <div>{/* render courses */}</div>;
}
```

### Di Server Component

```tsx
import { createClient } from '@/lib/supabase/server';

export default async function MyServerComponent() {
  const supabase = await createClient();
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true);

  return <div>{/* render courses */}</div>;
}
```

### Di Server Action

```tsx
'use server';

import { createClient } from '@/lib/supabase/server';

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: formData.get('title'),
      teacher_id: 'user-id-here',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Menggunakan Helper Functions

```tsx
import { createClient } from '@/lib/supabase/server';
import { getPublishedCourses, getCourseWithContent } from '@/lib/supabase/queries';

export default async function CoursesPage() {
  const supabase = await createClient();
  
  // Gunakan helper function
  const courses = await getPublishedCourses(supabase);
  
  return <div>{/* render courses */}</div>;
}
```

---

## 🎯 Available Helper Functions

File `lib/supabase/queries.ts` menyediakan helper functions siap pakai:

### Profile
- `getProfile(supabase, userId)` - Get user profile
- `updateProfile(supabase, userId, updates)` - Update profile

### Courses
- `getPublishedCourses(supabase)` - Get all published courses
- `getCoursesByTeacher(supabase, teacherId)` - Get teacher's courses
- `getCourseWithContent(supabase, courseId)` - Get course with modules & materials
- `createCourse(supabase, courseData)` - Create new course
- `updateCourse(supabase, courseId, updates)` - Update course
- `deleteCourse(supabase, courseId)` - Delete course

### Enrollments
- `getStudentEnrolledCourses(supabase, studentId)` - Get student's courses
- `getCourseEnrollments(supabase, courseId)` - Get students in a course
- `enrollStudent(supabase, studentId, courseId)` - Enroll student
- `isStudentEnrolled(supabase, studentId, courseId)` - Check enrollment

### Modules & Materials
- `getCourseModules(supabase, courseId)` - Get course modules
- `createModule(supabase, moduleData)` - Create module
- `getModuleMaterials(supabase, moduleId)` - Get materials
- `createMaterial(supabase, materialData)` - Create material

### Progress
- `getStudentCourseProgress(supabase, studentId, courseId)` - Get progress
- `markMaterialCompleted(supabase, enrollmentId, materialId)` - Mark completed

### Tasks & Submissions
- `getStudentUpcomingTasks(supabase, studentId)` - Get upcoming tasks
- `submitTask(supabase, submissionData)` - Submit task
- `getTaskSubmissions(supabase, taskId)` - Get submissions
- `gradeSubmission(supabase, submissionId, grade, feedback)` - Grade submission

---

## 🔐 Authentication (Belum Diimplementasikan)

Untuk menambahkan authentication nanti:

```tsx
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Logout
await supabase.auth.signOut();
```

---

## 📊 Database Schema

Database sudah include:
- ✅ **Profiles** - User data (teacher/student)
- ✅ **Courses** - Course information
- ✅ **Modules** - Course chapters
- ✅ **Materials** - Content (text, video, quiz, assignment)
- ✅ **Tasks** - Assignments with deadlines
- ✅ **Enrollments** - Student-Course relationships
- ✅ **Course Progress** - Track material completion
- ✅ **Submissions** - Student task submissions
- ✅ **Chat Context** - For AI chatbot RAG

Semua tabel sudah dilengkapi dengan **Row Level Security (RLS)** untuk keamanan data.

---

## 🧪 Testing dengan Mock Data

Database schema **TIDAK** include mock data secara otomatis karena memerlukan user dari Supabase Auth.

### Cara Membuat Test Data:

**Opsi 1: Melalui Supabase Dashboard (Paling Mudah)**

1. **Buat User di Authentication**
   - Buka Supabase Dashboard > **Authentication** > **Users**
   - Klik **Add User** > **Create new user**
   - Isi email dan password (contoh: `teacher@test.com` / `password123`)
   - Klik **Create user**
   - Profile akan otomatis dibuat (role default: student)

2. **Update Role Menjadi Teacher** (jika ingin)
   - Buka **SQL Editor** di Supabase
   - Jalankan query:
   ```sql
   UPDATE profiles 
   SET role = 'teacher' 
   WHERE email = 'teacher@test.com';
   ```

3. **Buat Course**
   - Copy UUID user dari Authentication > Users
   - Di SQL Editor, jalankan:
   ```sql
   INSERT INTO courses (teacher_id, title, description, is_published) 
   VALUES (
     'PASTE-UUID-TEACHER-DISINI'::uuid,
     'Pengantar Algoritma',
     'Course description',
     true
   );
   ```

**Opsi 2: Melalui Aplikasi (Setelah Login Diimplementasi)**
- Signup sebagai user baru
- Login dan buat course melalui UI

File `scripts/seed-data.sql` berisi template untuk membuat test data.

---

## 🛠️ Development Scripts

```bash
# Development server (dengan hot reload)
pnpm dev

# Build untuk production
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

---

## 📝 Next Steps

1. ✅ Setup Supabase project
2. ✅ Run database schema
3. ✅ Configure environment variables
4. ✅ Install dependencies
5. ✅ Run development server
6. 🔲 Implement authentication pages (login/signup)
7. 🔲 Connect existing components dengan Supabase queries
8. 🔲 Implement real-time features (optional)
9. 🔲 Add file upload untuk assignments (Supabase Storage)
10. 🔲 Integrate AI chatbot dengan chat_context table

📖 **Lihat `TESTING.md` untuk panduan lengkap membuat test data**
📖 **Lihat `lib/examples/` untuk contoh code penggunaan Supabase**

---

## ❓ Troubleshooting

### Error: "Invalid API key"
- Cek kembali `.env.local`
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Restart development server (`Ctrl+C` lalu `pnpm dev`)

### Error: "relation does not exist"
- Pastikan SQL schema sudah dijalankan di Supabase SQL Editor
- Cek di Supabase Dashboard > Table Editor apakah tabel sudah ada

### Error: "Row Level Security policy violation"
- RLS policies memerlukan authenticated user
- Pastikan user sudah login
- Untuk testing tanpa auth, bisa disable RLS sementara (tidak direkomendasikan):
  ```sql
  ALTER TABLE nama_tabel DISABLE ROW LEVEL SECURITY;
  ```

### Error: "insert or update on table profiles violates foreign key constraint"
- Error ini terjadi jika mencoba insert profile tanpa user di `auth.users`
- ✅ **Sudah diperbaiki**: Script sekarang menggunakan trigger auto-create profile
- User harus dibuat melalui:
  1. Supabase Auth Dashboard > Users > Add User, atau
  2. Signup melalui aplikasi (setelah auth diimplementasi)
- Profile akan otomatis dibuat saat user signup

### Error: "No data returned" atau Empty Array
- Pastikan data sudah diinsert ke database
- Cek RLS policies - mungkin user tidak punya akses
- Lihat panduan di `TESTING.md` untuk membuat test data

---

## 📞 Support

Jika ada kendala, cek:
1. [Supabase Documentation](https://supabase.com/docs)
2. [Next.js Documentation](https://nextjs.org/docs)
3. Project issues/discussions

---

**Happy Coding! 🎉**
