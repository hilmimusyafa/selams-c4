# Quick Start: AI Course Creation Feature

## 1️⃣ Setup Database Storage (REQUIRED)

### Run in Supabase SQL Editor:

```bash
# Copy isi file ini dan paste di Supabase SQL Editor
```

```sql
-- scripts/storage-setup.sql
```

**Jalankan sekali saja saat pertama kali setup!**

---

## 2️⃣ Test the Feature

### Step-by-step:

1. **Login sebagai Teacher**
   ```
   http://localhost:3000/login
   Email: teacher@example.com (atau register baru dengan role "guru")
   ```

2. **Klik tombol + (FAB) di bottom-right**
   ```
   Dashboard Guru → Klik tombol + floating
   ```

3. **Isi Info Course**
   ```
   Judul: Pengantar Algoritma
   Deskripsi: Belajar dasar-dasar algoritma dan pemrograman
   Klik: Selanjutnya
   ```

4. **Upload & Keywords**
   ```
   Upload: (optional) PDF/DOCX/TXT files
   Keywords: sorting, array, complexity (minimal 1 keyword)
   Klik: Selanjutnya
   ```

5. **Generate AI**
   ```
   Review ringkasan
   Klik: Generate dengan AI
   Tunggu 3 detik (AI processing)
   ```

6. **Preview & Save**
   ```
   Review struktur course yang di-generate
   Klik: Simpan Course
   ```

7. **Success!**
   ```
   Course berhasil dibuat
   Klik: Kembali ke Dashboard
   Check: Course muncul di dashboard
   ```

---

## 3️⃣ Verify in Database

### Check Supabase Dashboard:

```sql
-- Lihat course yang baru dibuat
SELECT * FROM courses ORDER BY created_at DESC LIMIT 1;

-- Lihat modules
SELECT * FROM modules WHERE course_id = 'YOUR_COURSE_ID';

-- Lihat materials
SELECT * FROM materials WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'YOUR_COURSE_ID'
);
```

---

## 4️⃣ File Structure

```
✅ app/teacher/course/create/page.tsx     - Course creation wizard
✅ app/api/ai/generate-course/route.ts    - AI API endpoint
✅ components/teacher/create-course-fab.tsx - FAB button
✅ scripts/storage-setup.sql              - Storage setup
✅ scripts/setup.sql                      - Updated schema
```

---

## 🚀 Features

- ✅ 5-step wizard interface
- ✅ File upload untuk referensi (PDF/DOCX/TXT)
- ✅ Keyword-based module generation
- ✅ AI generates:
  - Modules (chapters)
  - Materials (text content + quiz)
  - Quiz questions (5 per module)
- ✅ Preview sebelum save
- ✅ Auto-save ke database

---

## 🔧 Customize AI (Optional)

Replace mock AI dengan real AI di `/app/api/ai/generate-course/route.ts`:

```typescript
// Add OpenAI
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Replace generateMockStructure() dengan actual AI call
```

Lihat `AI_COURSE_CREATION_GUIDE.md` untuk detail lengkap!

---

## 📋 Checklist

### Before Testing:
- [ ] Run `pnpm dev` di selams-c4 folder
- [ ] Run `storage-setup.sql` di Supabase
- [ ] Login sebagai teacher

### Testing:
- [ ] FAB button berfungsi
- [ ] Step 1: Form validation works
- [ ] Step 2: File upload works
- [ ] Step 2: Keyword tags works
- [ ] Step 3: AI generation works (3s delay)
- [ ] Step 4: Preview shows modules
- [ ] Step 5: Save to database works
- [ ] Course muncul di dashboard

### Verify:
- [ ] Course di database
- [ ] Modules di database (3+ modules)
- [ ] Materials di database (4 per module)
- [ ] Tasks di database (1 quiz per module)

---

## 🐛 Common Issues

**Issue**: FAB button tidak muncul
**Fix**: Refresh page, pastikan login sebagai teacher

**Issue**: Upload file gagal
**Fix**: Run `storage-setup.sql` di Supabase

**Issue**: AI generation error
**Fix**: Check console, pastikan semua field terisi

**Issue**: Course tidak tersimpan
**Fix**: Check Supabase logs, verify RLS policies

---

## 📚 Documentation

- `AI_COURSE_CREATION_GUIDE.md` - Complete documentation
- `DATABASE_INTEGRATION_COMPLETE.md` - Database integration
- `AUTH_GUIDE.md` - Authentication setup

---

**Status**: ✅ Ready to test!
