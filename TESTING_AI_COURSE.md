# 🧪 Testing AI Course Creation

## ⚡ Quick Test (5 menit)

### 1. Setup Storage (Sekali Saja)
\`\`\`bash
# Buka Supabase Dashboard > SQL Editor
# Copy paste semua isi file: scripts/SETUP_STORAGE.sql
# Klik RUN
\`\`\`

### 2. Start Server
\`\`\`bash
cd /workspaces/Development/SeaLaMS/selams-c4
pnpm dev
\`\`\`

### 3. Login sebagai Teacher
\`\`\`
http://localhost:3000/login
\`\`\`
- Login dengan akun teacher atau
- Register baru dengan role "Guru"

### 4. Test Create Course
\`\`\`
Dashboard → Klik tombol + (bottom-right)
\`\`\`

**Step 1: Info Course**
- Judul: `Algoritma dan Pemrograman`
- Deskripsi: `Belajar dasar algoritma`
- Klik: `Selanjutnya`

**Step 2: Upload & Keywords**
- Upload (optional): PDF/DOCX file
- Keywords: `sorting`, `array`, `searching`
- Klik: `Selanjutnya`

**Step 3: Generate AI**
- Review summary
- Klik: `Generate dengan AI`
- Tunggu 3 detik

**Step 4: Preview**
- Lihat 3 modules yang di-generate
- Setiap module punya 4 materials
- Klik: `Simpan Course`

**Step 5: Success!**
- Klik: `Kembali ke Dashboard`
- Course muncul di dashboard ✅

---

## ✅ Expected Results

### Di Dashboard:
- Course baru muncul
- Shows "3 modules"
- Shows "0 students"

### Di Database:
\`\`\`sql
-- Check di Supabase > Table Editor
SELECT * FROM courses ORDER BY created_at DESC LIMIT 1;
-- Should see new course

SELECT * FROM modules WHERE course_id = 'YOUR_COURSE_ID';
-- Should see 3 modules

SELECT * FROM materials LIMIT 10;
-- Should see materials (text + quiz)
\`\`\`

---

## 🎯 What Gets Created

### For Keywords: ["sorting", "array", "searching"]

\`\`\`
Course: Algoritma dan Pemrograman
├── Bab 1: Sorting (4 materials)
│   ├── Pengenalan Sorting (text)
│   ├── Konsep Dasar Sorting (text)
│   ├── Implementasi Sorting (text)
│   └── Quiz: Sorting (quiz - 5 soal)
│
├── Bab 2: Array (4 materials)
│   ├── Pengenalan Array (text)
│   ├── Konsep Dasar Array (text)
│   ├── Implementasi Array (text)
│   └── Quiz: Array (quiz - 5 soal)
│
└── Bab 3: Searching (4 materials)
    ├── Pengenalan Searching (text)
    ├── Konsep Dasar Searching (text)
    ├── Implementasi Searching (text)
    └── Quiz: Searching (quiz - 5 soal)

Total: 3 modules, 12 materials
\`\`\`

---

## 🐛 Troubleshooting

### ❌ FAB button tidak muncul
**Fix**: Refresh page, pastikan login sebagai teacher (role: guru)

### ❌ Upload error: "Bucket not found"
**Fix**: Run `SETUP_STORAGE.sql` di Supabase SQL Editor

### ❌ AI generation stuck
**Fix**: 
- Check browser console for errors
- Verify API route exists: `/api/ai/generate-course`
- Should take 3 seconds (mock delay)

### ❌ Save error
**Fix**: 
- Check Supabase connection
- Verify tables exist (courses, modules, materials, tasks)
- Check RLS policies

---

## 📊 Verify Success

### Check Dashboard:
- [ ] New course visible
- [ ] Correct title
- [ ] Module count = 3
- [ ] Student count = 0

### Check Database:
- [ ] 1 new row in `courses`
- [ ] 3 new rows in `modules`
- [ ] 12 new rows in `materials`
- [ ] 3 new rows in `tasks`

### Test Course View:
- [ ] Click course → Can view
- [ ] Modules sidebar shows 3 modules
- [ ] Each module has 4 materials
- [ ] Can select and view materials
- [ ] Text content displays properly

---

## 🚀 Next Steps After Testing

### If Everything Works:
1. ✅ Feature ready to use!
2. 🔜 Optional: Integrate real AI (OpenAI/Anthropic)
3. 🔜 Optional: Enable file content extraction

### If Issues Found:
1. Check console errors
2. Verify Supabase setup
3. Check `AI_COURSE_CREATION_GUIDE.md` for details
4. Check network tab for API errors

---

## 📚 Full Documentation

- `AI_COURSE_CREATION_GUIDE.md` - Complete guide
- `QUICK_START_AI_COURSE.md` - Detailed setup
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `scripts/SETUP_STORAGE.sql` - Storage setup SQL

---

**Happy Testing!** 🎉
