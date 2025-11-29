# Authentication System - SeLaMS

## 🔐 Fitur Authentication

Sistem authentication sudah lengkap dengan:
- ✅ Login page dengan redirect otomatis berdasarkan role
- ✅ Register page dengan pilihan role (Teacher/Student)
- ✅ Protected routes dengan middleware
- ✅ Role-based access control (RBAC)
- ✅ User profile management
- ✅ Logout functionality

---

## 📁 File Structure

\`\`\`
app/
  login/
    page.tsx          # Login page
  register/
    page.tsx          # Register page
  
lib/supabase/
  auth.ts             # Auth helper functions
  middleware.ts       # Session & route protection
  
hooks/
  use-auth.ts         # Custom hook untuk auth state
  
components/layout/
  top-bar.tsx         # Updated dengan user menu & logout
\`\`\`

---

## 🚀 Cara Menggunakan

### 1. Register Akun Baru

1. Buka `/register`
2. Pilih role: **Murid** atau **Guru**
3. Isi form:
   - Nama Lengkap
   - Email
   - Password (minimal 6 karakter)
   - Konfirmasi Password
4. Klik **Daftar**
5. Otomatis redirect ke dashboard sesuai role

### 2. Login

1. Buka `/login`
2. Masukkan email & password
3. Klik **Login**
4. Redirect otomatis:
   - **Guru** → `/teacher/dashboard`
   - **Murid** → `/student/dashboard`

### 3. Logout

Klik avatar di top-right → **Sign Out**

---

## 🛡️ Route Protection

### Protected Routes

Semua route kecuali `/login` dan `/register` memerlukan authentication:

\`\`\`
✅ Public:
- /
- /login
- /register

🔒 Protected (requires auth):
- /student/*
- /teacher/*
- /course/*
- /settings
\`\`\`

### Role-Based Access

- **Teacher** hanya bisa akses `/teacher/*`
- **Student** hanya bisa akses `/student/*`
- Jika mencoba akses route yang tidak sesuai role → redirect otomatis

---

## 💻 Penggunaan di Kode

### Client Component

\`\`\`tsx
'use client';

import { useAuth } from '@/hooks/use-auth';

export default function MyComponent() {
  const { user, profile, loading, isTeacher, isStudent } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {profile?.display_name}</h1>
      <p>Role: {isTeacher ? 'Teacher' : 'Student'}</p>
    </div>
  );
}
\`\`\`

### Server Component

\`\`\`tsx
import { getCurrentProfileServer } from '@/lib/supabase/auth-server';
import { redirect } from 'next/navigation';

export default async function MyServerComponent() {
  const profile = await getCurrentProfileServer();

  if (!profile) {
    // User not authenticated
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {profile.display_name}</h1>
    </div>
  );
}
\`\`\`

### Server Action

\`\`\`tsx
'use server';

import { getCurrentProfileServer } from '@/lib/supabase/auth-server';

export async function myAction() {
  const profile = await getCurrentProfileServer();
  
  if (!profile) {
    throw new Error('Not authenticated');
  }

  if (profile.role !== 'teacher') {
    throw new Error('Only teachers can do this');
  }

  // Do something...
}
\`\`\`

---

## 🔑 Auth Helper Functions

### Client-Side (Browser)

File: `lib/supabase/auth.ts` - **Hanya untuk Client Components**

\`\`\`tsx
import { signIn, signUp, signOut, getCurrentProfile } from '@/lib/supabase/auth';

// Login
await signIn(email, password);

// Signup
await signUp(email, password, displayName, role);

// Logout
await signOut();

// Get current profile
const profile = await getCurrentProfile();
\`\`\`

### Server-Side

File: `lib/supabase/auth-server.ts` - **Hanya untuk Server Components/Actions**

\`\`\`tsx
import { getCurrentUserServer, getCurrentProfileServer, isAuthenticated } from '@/lib/supabase/auth-server';

// Get current user
const user = await getCurrentUserServer();

// Get current profile
const profile = await getCurrentProfileServer();

// Check if authenticated
const authenticated = await isAuthenticated();
\`\`\`

**⚠️ PENTING**: 
- Jangan import `auth-server.ts` di Client Components
- Jangan import `server.ts` di Client Components
- Gunakan `auth.ts` untuk client-side operations

---

## 🎨 UI Components

### Login Page Features
- Email & password fields
- Error handling & display
- Loading state
- Link to register
- Demo accounts info

### Register Page Features
- Role selection (visual cards)
- Form validation
- Password confirmation
- Error handling
- Link to login

### Top Bar Features
- User avatar (with fallback initials)
- User name & email display
- Role badge (Guru/Murid)
- Settings link
- Logout button

---

## 🧪 Testing

### Test Accounts (After Creating Users)

\`\`\`
Teacher:
Email: teacher@test.com
Password: password123

Student:
Email: student@test.com
Password: password123
\`\`\`

### Test Flow

1. **Register Flow**
   \`\`\`
   /register → Select role → Fill form → Submit
   → Auto redirect to dashboard
   \`\`\`

2. **Login Flow**
   \`\`\`
   /login → Enter credentials → Submit
   → Redirect based on role
   \`\`\`

3. **Protected Route**
   \`\`\`
   Try access /student/dashboard without login
   → Redirect to /login
   \`\`\`

4. **Role-Based Access**
   \`\`\`
   Login as Student → Try access /teacher/dashboard
   → Redirect to /student/dashboard
   \`\`\`

5. **Logout Flow**
   \`\`\`
   Click avatar → Sign Out
   → Redirect to /login
   \`\`\`

---

## ⚙️ Configuration

### Middleware Configuration

File: `middleware.ts`

\`\`\`typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
\`\`\`

### Public Routes

Defined in `lib/supabase/middleware.ts`:

\`\`\`typescript
const publicRoutes = ['/login', '/register'];
\`\`\`

---

## 🔧 Customization

### Add More Fields to Profile

1. Update database schema in `scripts/setup.sql`
2. Update types in `lib/supabase/types.ts`
3. Update signup form in `app/register/page.tsx`

### Change Redirect Logic

Edit `lib/supabase/middleware.ts`:

\`\`\`typescript
// Custom redirect logic
if (profile?.role === 'teacher') {
  url.pathname = '/your-custom-teacher-route';
} else {
  url.pathname = '/your-custom-student-route';
}
\`\`\`

### Add OAuth Providers (Google, GitHub, etc.)

\`\`\`tsx
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
\`\`\`

---

## 📝 Next Steps

1. ✅ ~~Setup authentication system~~
2. 🔲 Add email verification
3. 🔲 Add password reset
4. 🔲 Add OAuth providers (Google, GitHub)
5. 🔲 Add profile editing
6. 🔲 Add avatar upload

---

## 🐛 Troubleshooting

### "Invalid login credentials"
- Check email & password
- Verify user exists in Supabase Auth

### Redirect loop
- Clear cookies
- Check middleware logic
- Verify role in database

### Profile not found
- Ensure trigger `handle_new_user()` is created
- Check if profile was created in database

### Can't access protected routes
- Check if logged in
- Verify role matches route requirement
- Check browser console for errors

---

## 📚 References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [useAuth Hook](../hooks/use-auth.ts)
