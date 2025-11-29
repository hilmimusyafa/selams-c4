# AI Course Creation Feature 🤖✨

## Overview
Fitur untuk membuat course secara otomatis menggunakan AI dengan mengupload referensi dan kata kunci. AI akan memproses referensi dan menghasilkan struktur course lengkap dengan bab, sub-bab, materi teks, dan quiz.

---

## Alur Pembuatan Course

### Step 1: Informasi Course
**Dashboard Guru → Klik tombol + (FAB)**

Guru mengisi:
- ✅ **Judul Course** (required)
- ✅ **Deskripsi Course** (required)

**File**: `/app/teacher/course/create/page.tsx` (Step 1)

---

### Step 2: Upload Referensi & Kata Kunci
Guru melakukan:
- ✅ **Upload file referensi** (PDF, DOCX, TXT)
  - Multiple file upload supported
  - Files stored in Supabase Storage bucket: `course-references`
- ✅ **Masukkan kata kunci** (minimum 1, recommended 3-5)
  - Kata kunci digunakan untuk menentukan topik utama setiap bab
  - Example: "sorting", "array", "binary search", "complexity"

**File**: `/app/teacher/course/create/page.tsx` (Step 2)

---

### Step 3: AI Processing
**AI memproses referensi dan generate struktur course**

Proses AI:
1. ✅ Upload file referensi ke Supabase Storage
2. ✅ Kirim data ke API `/api/ai/generate-course`
3. ✅ AI menganalisis:
   - Judul dan deskripsi course
   - Kata kunci yang diberikan
   - Konten dari file referensi (future enhancement)
4. ✅ AI menghasilkan:
   - **Struktur Bab (Modules)** berdasarkan kata kunci
   - **Sub-bab (Materials)** untuk setiap bab:
     - Materi teks pengenalan
     - Materi teks konsep dasar
     - Materi teks implementasi
     - Quiz untuk setiap bab
5. ✅ Generate konten teks untuk setiap materi
6. ✅ Generate soal quiz (5 pertanyaan multiple choice per bab)

**Files**: 
- `/app/api/ai/generate-course/route.ts` - API endpoint
- `/app/teacher/course/create/page.tsx` (Step 3)

---

### Step 4: Preview Struktur
Guru mereview struktur yang dihasilkan AI:
- ✅ Lihat semua bab yang dibuat
- ✅ Lihat semua sub-bab/materi per bab
- ✅ Lihat tipe material (text/quiz)
- ✅ Opsi untuk generate ulang jika tidak puas

**File**: `/app/teacher/course/create/page.tsx` (Step 4)

---

### Step 5: Simpan Course
**Menyimpan course ke database**

Proses penyimpanan:
1. ✅ Insert ke table `courses`
   - teacher_id, title, description
   - is_published = false (draft mode)
2. ✅ Insert ke table `modules`
   - Untuk setiap bab yang di-generate AI
   - Dengan order_index berurutan
3. ✅ Insert ke table `materials`
   - Untuk setiap sub-bab/materi
   - Content sudah terisi dari AI
   - Dengan order_index berurutan
4. ✅ Insert ke table `tasks`
   - Untuk setiap quiz material
   - max_score = 100

**File**: `/app/teacher/course/create/page.tsx` (saveCourse function)

---

### Step 6: Selesai
- ✅ Tampilkan success message
- ✅ Opsi: Kembali ke Dashboard atau Edit Course

---

## File Structure

\`\`\`
app/
├── teacher/
│   └── course/
│       └── create/
│           └── page.tsx          # Main course creation page (5 steps)
├── api/
│   └── ai/
│       └── generate-course/
│           └── route.ts          # AI course generator API

components/
└── teacher/
    └── create-course-fab.tsx     # Updated FAB button

scripts/
├── setup.sql                     # Updated with video_url field
└── storage-setup.sql             # NEW: Storage bucket & policies
\`\`\`

---

## Database Schema Updates

### 1. Materials Table
Added `video_url` field untuk support video materials di masa depan:

\`\`\`sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  type material_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,  -- NEW FIELD
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
\`\`\`

### 2. Course References Table (NEW)
Track reference files uploaded untuk setiap course:

\`\`\`sql
CREATE TABLE course_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
\`\`\`

### 3. Supabase Storage Bucket
Bucket `course-references` untuk menyimpan file referensi:

\`\`\`sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-references', 'course-references', true);
\`\`\`

**Policies**:
- Teachers can upload files to own folder (by user ID)
- Public can view files
- Teachers can delete own files

---

## AI Integration Points

### Current Implementation (Mock)
**File**: `/app/api/ai/generate-course/route.ts`

Saat ini menggunakan **mock generator** yang:
- Membuat 3-5 bab berdasarkan jumlah keywords
- Setiap bab dapat 4 materials:
  - Pengenalan (text)
  - Konsep Dasar (text)
  - Implementasi (text)
  - Quiz (quiz dengan 5 soal)
- Generate content template untuk setiap material

### How to Integrate Real AI

Replace mock dengan AI API (OpenAI, Anthropic, Gemini):

\`\`\`typescript
// Example with OpenAI
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: `You are a course curriculum designer. Generate a structured course outline with modules and materials in JSON format:
      {
        "modules": [
          {
            "title": "Module title",
            "description": "Module description",
            "materials": [
              {
                "title": "Material title",
                "type": "text|quiz",
                "content": "Material content or quiz JSON"
              }
            ]
          }
        ]
      }`
    },
    {
      role: "user",
      content: `Create a detailed course structure for: ${title}
      
      Description: ${description}
      Keywords: ${keywords.join(', ')}
      Reference files: ${referenceUrls.length} files uploaded`
    }
  ],
  temperature: 0.7,
  response_format: { type: "json_object" }
})

const structure = JSON.parse(completion.choices[0].message.content)
\`\`\`

### Advanced: Process Reference Files
Untuk membaca konten dari uploaded PDF/DOCX:

\`\`\`typescript
// Install: pdf-parse, mammoth
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

// Extract text from PDF
async function extractPdfText(url: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const data = await pdf(Buffer.from(buffer))
  return data.text
}

// Extract text from DOCX
async function extractDocxText(url: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
  return result.value
}
\`\`\`

---

## Component Features

### Multi-Step Form
**5 langkah dengan progress indicator:**

\`\`\`
[1] → [2] → [3] → [4] → [5]
Info   Ref   AI    Review  Done
\`\`\`

### Step 1: Info Course
- Input field untuk title (required)
- Textarea untuk description (required)
- Validation sebelum next

### Step 2: Upload & Keywords
- File upload area (drag & drop style)
- Multiple files support
- File list dengan opsi hapus
- Keyword input dengan Enter to add
- Keyword tags dengan delete button

### Step 3: AI Generation
- Summary card menampilkan info course
- Upload progress bar untuk references
- AI generation button dengan loading state
- Sparkles icon untuk AI branding

### Step 4: Preview
- Expandable cards untuk setiap module
- Material list dengan type indicators
- Color-coded dots (blue=text, green=quiz)
- Opsi generate ulang atau save

### Step 5: Success
- Success checkmark animation
- Course summary
- Action buttons: Dashboard atau Edit

---

## UI/UX Highlights

### Visual Elements
- ✨ **Sparkles icon** untuk AI features
- 🎨 **Gradient buttons** untuk AI generation
- 📊 **Progress indicator** di top
- 🎯 **Step-by-step wizard** interface
- 📤 **Upload area** dengan drag-drop style
- 🏷️ **Keyword tags** dengan remove button
- ✅ **Success animations**

### Loading States
- Upload progress bar (0-100%)
- AI generation spinner
- Save course spinner
- Disabled buttons saat processing

### Error Handling
- Field validation
- Upload error handling
- API error alerts
- Empty state messages

---

## Testing Guide

### Prerequisites
1. ✅ Login sebagai teacher account
2. ✅ Supabase storage bucket `course-references` sudah dibuat
3. ✅ Run `storage-setup.sql` di Supabase SQL Editor

### Test Steps

#### 1. Access Course Creation
\`\`\`
Dashboard Guru → Klik tombol + (FAB di bottom-right)
Expected: Navigate to /teacher/course/create
\`\`\`

#### 2. Fill Course Info (Step 1)
\`\`\`
Input:
- Title: "Pengantar Algoritma dan Pemrograman"
- Description: "Course ini membahas dasar-dasar algoritma..."

Expected: Next button enabled
Click Next → Move to Step 2
\`\`\`

#### 3. Upload References & Keywords (Step 2)
\`\`\`
Actions:
- Upload 1-3 PDF/DOCX files
- Add keywords: "sorting", "searching", "complexity"

Expected:
- Files listed dengan nama dan delete button
- Keywords shown as tags
- Next button enabled
\`\`\`

#### 4. Generate with AI (Step 3)
\`\`\`
Click "Generate dengan AI"

Expected:
- Upload progress bar shows 0-100%
- Button shows spinner dan "AI Sedang Memproses..."
- After 3 seconds → Navigate to Step 4
\`\`\`

#### 5. Review Structure (Step 4)
\`\`\`
Expected:
- Shows 3 modules (based on 3 keywords)
- Each module has 4 materials:
  * Pengenalan (text)
  * Konsep Dasar (text)
  * Implementasi (text)
  * Quiz (quiz)
- Save button enabled
\`\`\`

#### 6. Save Course (Step 5)
\`\`\`
Click "Simpan Course"

Expected:
- Button shows spinner
- Data saved to database
- Navigate to success screen
- Shows course title dan jumlah bab
\`\`\`

#### 7. Verify in Database
\`\`\`sql
-- Check course created
SELECT * FROM courses WHERE teacher_id = 'YOUR_USER_ID' ORDER BY created_at DESC LIMIT 1;

-- Check modules created
SELECT * FROM modules WHERE course_id = 'COURSE_ID_FROM_ABOVE';

-- Check materials created
SELECT m.*, mat.title, mat.type 
FROM modules m
JOIN materials mat ON mat.module_id = m.id
WHERE m.course_id = 'COURSE_ID';

-- Check tasks created
SELECT t.* FROM tasks t
JOIN materials mat ON mat.id = t.material_id
JOIN modules m ON m.id = mat.module_id
WHERE m.course_id = 'COURSE_ID';
\`\`\`

#### 8. Check Teacher Dashboard
\`\`\`
Navigate to /teacher/dashboard

Expected:
- New course appears in ManagedCoursesSection
- Shows module count (3 modules)
- Shows student count (0 initially)
\`\`\`

---

## API Endpoints

### POST /api/ai/generate-course

**Request Body:**
\`\`\`json
{
  "title": "Course Title",
  "description": "Course description...",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "referenceUrls": ["url1", "url2"]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "structure": {
    "modules": [
      {
        "title": "Bab 1: Keyword1",
        "description": "Module description",
        "materials": [
          {
            "title": "Pengenalan keyword1",
            "type": "text",
            "content": "# Pengenalan keyword1\n\n..."
          },
          {
            "title": "Quiz: keyword1",
            "type": "quiz",
            "content": "{\"questions\": [...]}"
          }
        ]
      }
    ]
  }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": "Missing required fields"
}
\`\`\`

---

## Environment Variables Required

### For Real AI Integration:
\`\`\`bash
# .env.local
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=...
# or
GOOGLE_AI_API_KEY=...
\`\`\`

---

## Future Enhancements

### 1. Actual AI Integration
- [ ] Connect to OpenAI/Anthropic API
- [ ] Process uploaded reference files (PDF/DOCX)
- [ ] Use RAG (Retrieval Augmented Generation)
- [ ] Better content quality dan relevance

### 2. Course Customization
- [ ] Edit generated structure before save
- [ ] Add/remove modules manually
- [ ] Reorder materials
- [ ] Regenerate specific modules

### 3. Advanced Features
- [ ] Video material generation (from YouTube links)
- [ ] Assignment generation
- [ ] Diagram/image generation
- [ ] Code snippet generation
- [ ] Multiple language support

### 4. Analytics & Tracking
- [ ] Track AI generation success rate
- [ ] Monitor course quality
- [ ] Student engagement metrics
- [ ] Content improvement suggestions

### 5. Collaboration
- [ ] Share course templates
- [ ] Community-contributed references
- [ ] Peer review generated content
- [ ] Version control for courses

---

## Cost Estimation

### Mock Version (Current)
**Cost**: FREE ✅
- No external API calls
- Only Supabase storage costs (very minimal)

### With Real AI Integration

#### OpenAI (GPT-4)
- Input: ~1,000 tokens (title, description, keywords)
- Output: ~3,000 tokens (3 modules × 4 materials)
- Cost per course: ~$0.15 - $0.30

#### Anthropic (Claude)
- Similar pricing structure
- Slightly cheaper for large context

#### Recommendations:
- Start with GPT-3.5 Turbo (cheaper: $0.05/course)
- Upgrade to GPT-4 for better quality
- Implement caching for similar requests
- Set monthly budget limits

---

## Security Considerations

### File Upload Security
✅ **Implemented:**
- File type validation (PDF, DOCX, TXT only)
- File size limit (50MB)
- User-specific folders (by auth.uid())
- RLS policies on storage

🔒 **Recommended:**
- Virus scanning for uploaded files
- Content validation before processing
- Rate limiting on API endpoints
- Monitor storage usage per user

### AI API Security
🔒 **Required:**
- Keep API keys in environment variables
- Never expose keys to client
- Implement rate limiting
- Log all AI requests for audit
- Set token limits per request

---

## Troubleshooting

### Issue: "Course-references bucket not found"
**Solution**: Run `storage-setup.sql` in Supabase SQL Editor

### Issue: "Failed to upload file"
**Solution**: 
- Check RLS policies on storage.objects
- Verify file type is allowed
- Check file size < 50MB

### Issue: "AI generation takes too long"
**Solution**:
- Current mock has 3s delay (normal)
- With real AI: 10-30s normal
- Add timeout (60s recommended)

### Issue: "Course saved but materials empty"
**Solution**:
- Check AI response format matches expected structure
- Verify materials array has content field
- Check database insertion errors in console

---

## Performance Tips

1. **Batch Database Inserts**
   - Use Supabase batch insert when possible
   - Reduces API calls

2. **Optimize AI Requests**
   - Cache similar requests
   - Use streaming for real-time updates
   - Implement retry logic

3. **File Processing**
   - Process files async
   - Show upload progress
   - Compress large files

4. **User Experience**
   - Show progress at each step
   - Allow save as draft
   - Enable background processing

---

## Success Metrics

### Technical Metrics
- ✅ Course creation success rate > 95%
- ✅ Average generation time < 30s
- ✅ File upload success rate > 98%
- ✅ Database consistency 100%

### User Metrics
- 📊 Teachers create X courses per week
- 📊 Average modules per course: 3-5
- 📊 Average materials per module: 4-6
- 📊 Student satisfaction with AI-generated content

---

## Documentation Files

- ✅ `AI_COURSE_CREATION_GUIDE.md` (this file)
- ✅ `/app/teacher/course/create/page.tsx` - Main implementation
- ✅ `/app/api/ai/generate-course/route.ts` - API endpoint
- ✅ `/scripts/storage-setup.sql` - Storage setup
- ✅ Updated `/scripts/setup.sql` - Schema update

**Status**: ✅ **FEATURE COMPLETE** (Mock Version)

Ready for testing dan real AI integration! 🚀
