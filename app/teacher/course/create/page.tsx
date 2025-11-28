// @ts-nocheck
"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Loader2, Upload, Sparkles, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

type Step = 1 | 2 | 3 | 4 | 5

interface CourseData {
  title: string
  description: string
  keywords: string[]
  referenceFiles: File[]
}

interface GeneratedStructure {
  modules: Array<{
    title: string
    description: string
    materials: Array<{
      title: string
      type: string
      content?: string
    }>
  }>
}

export default function CreateCoursePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    keywords: [],
    referenceFiles: []
  })
  
  const [keywordInput, setKeywordInput] = useState("")
  const [generatedStructure, setGeneratedStructure] = useState<GeneratedStructure | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Loading state while checking auth
  if (authLoading) {
    return (
      <MainLayout userRole="teacher">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  // Access control - teachers only
  if (!profile || profile.role !== 'teacher') {
    return (
      <MainLayout userRole="teacher">
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Access denied. Teachers only.</p>
        </div>
      </MainLayout>
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setCourseData({ ...courseData, referenceFiles: [...courseData.referenceFiles, ...files] })
    }
  }

  const removeFile = (index: number) => {
    const newFiles = courseData.referenceFiles.filter((_, i) => i !== index)
    setCourseData({ ...courseData, referenceFiles: newFiles })
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !courseData.keywords.includes(keywordInput.trim())) {
      setCourseData({ ...courseData, keywords: [...courseData.keywords, keywordInput.trim()] })
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setCourseData({ ...courseData, keywords: courseData.keywords.filter(k => k !== keyword) })
  }

  const uploadReferences = async () => {
    if (courseData.referenceFiles.length === 0) return []

    const supabase = createClient()
    const uploadedUrls: string[] = []

    for (let i = 0; i < courseData.referenceFiles.length; i++) {
      const file = courseData.referenceFiles[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('course-references')
        .upload(fileName, file)

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('course-references')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)
      setUploadProgress(Math.round(((i + 1) / courseData.referenceFiles.length) * 100))
    }

    return uploadedUrls
  }

  const generateCourseStructure = async () => {
    setAiGenerating(true)
    try {
      // Skip file upload for now (storage bucket not configured)
      // const referenceUrls = await uploadReferences()
      const referenceUrls: string[] = []

      // Call AI API to generate course structure
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          keywords: courseData.keywords,
          referenceUrls
        })
      })

      if (!response.ok) throw new Error('Failed to generate course')

      const data = await response.json()
      setGeneratedStructure(data.structure)
      setCurrentStep(4)
    } catch (error) {
      console.error('Error generating course:', error)
      alert('Gagal generate course. Pastikan semua field terisi dengan benar.')
    } finally {
      setAiGenerating(false)
      setUploadProgress(0)
    }
  }

  const saveCourse = async () => {
    if (!user || !generatedStructure) return

    setLoading(true)
    try {
      const supabase = createClient()

      console.log('Starting course save...', { userId: user.id, courseData })

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          teacher_id: user.id,
          title: courseData.title,
          description: courseData.description,
          is_published: false
        })
        .select()
        .single()

      if (courseError) {
        console.error('Course creation error:', courseError)
        throw courseError
      }

      console.log('Course created:', course)

      // Create modules and materials
      for (let i = 0; i < generatedStructure.modules.length; i++) {
        const moduleData = generatedStructure.modules[i]
        
        console.log(`Creating module ${i + 1}:`, moduleData.title)
        
        const { data: module, error: moduleError } = await supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: moduleData.title,
            description: moduleData.description || '',
            order_index: i
          })
          .select()
          .single()

        if (moduleError) {
          console.error('Module creation error:', moduleError)
          throw moduleError
        }

        console.log(`Module ${i + 1} created:`, module)

        // Create materials
        for (let j = 0; j < moduleData.materials.length; j++) {
          const material = moduleData.materials[j]
          
          console.log(`Creating material ${j + 1} in module ${i + 1}:`, material.title)
          
          const { data: createdMaterial, error: materialError } = await supabase
            .from('materials')
            .insert({
              module_id: module.id,
              type: material.type,
              title: material.title,
              content: material.content || '',
              order_index: j
            })
            .select()
            .single()

          if (materialError) {
            console.error('Material creation error:', materialError)
            throw materialError
          }

          console.log(`Material ${j + 1} created:`, createdMaterial)

          // If it's a quiz, create task
          if (material.type === 'quiz' && createdMaterial) {
            console.log('Creating task for quiz:', material.title)
            
            const { error: taskError } = await supabase
              .from('tasks')
              .insert({
                material_id: createdMaterial.id,
                max_score: 100,
                description: `Quiz untuk ${moduleData.title}`
              })

            if (taskError) {
              console.error('Task creation error:', taskError)
              // Don't throw, just log - task is optional
            }
          }
        }
      }

      console.log('Course saved successfully!')
      setCurrentStep(5)
    } catch (error: any) {
      console.error('Error saving course:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Gagal menyimpan course: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Informasi Course</h2>
              <p className="text-muted-foreground">Masukkan informasi dasar tentang course yang akan dibuat</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Judul Course *</label>
                <Input
                  placeholder="Contoh: Pengantar Algoritma dan Struktur Data"
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Deskripsi Course *</label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 border border-input rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Jelaskan secara singkat tentang apa yang akan dipelajari dalam course ini..."
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!courseData.title || !courseData.description}
                className="gap-2"
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload Referensi & Kata Kunci</h2>
              <p className="text-muted-foreground">Upload file referensi dan masukkan kata kunci untuk AI</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Upload File Referensi</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload PDF, DOCX, atau TXT sebagai referensi materi
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Pilih File</span>
                    </Button>
                  </label>
                </div>

                {courseData.referenceFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {courseData.referenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-destructive"
                        >
                          Hapus
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Kata Kunci *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan kata kunci (contoh: sorting, algoritma, binary search)"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button onClick={addKeyword} variant="outline">Tambah</Button>
                </div>

                {courseData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {courseData.keywords.map((keyword) => (
                      <div
                        key={keyword}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={courseData.keywords.length === 0}
                className="gap-2"
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Generate Course dengan AI</h2>
              <p className="text-muted-foreground">AI akan memproses referensi dan membuat struktur course</p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">AI akan menghasilkan:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ Struktur Bab dan Sub-bab yang terorganisir</li>
                      <li>✓ Materi teks untuk setiap sub-bab</li>
                      <li>✓ Quiz untuk setiap bab</li>
                      <li>✓ Konten disesuaikan dengan referensi dan kata kunci</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Ringkasan:</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Judul:</span> {courseData.title}</p>
                    <p><span className="text-muted-foreground">Kata Kunci:</span> {courseData.keywords.join(", ")}</p>
                    <p><span className="text-muted-foreground">File Referensi:</span> {courseData.referenceFiles.length} file</p>
                  </div>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Uploading references...</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2" disabled={aiGenerating}>
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
              <Button
                onClick={generateCourseStructure}
                disabled={aiGenerating}
                className="gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Sedang Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate dengan AI
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Preview Struktur Course</h2>
              <p className="text-muted-foreground">Review struktur yang dihasilkan AI sebelum disimpan</p>
            </div>

            {generatedStructure && (
              <div className="space-y-4">
                {generatedStructure.modules.map((module, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Bab {index + 1}: {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    
                    <div className="pl-4 space-y-2">
                      {module.materials.map((material, mIndex) => (
                        <div key={mIndex} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            material.type === 'text' ? 'bg-blue-500' :
                            material.type === 'quiz' ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          <span>{material.title}</span>
                          <span className="text-xs text-muted-foreground">({material.type})</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Generate Ulang
              </Button>
              <Button onClick={saveCourse} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Simpan Course
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 text-center py-12">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Course Berhasil Dibuat!</h2>
              <p className="text-muted-foreground">
                Course "{courseData.title}" telah berhasil dibuat dengan {generatedStructure?.modules.length} bab
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => router.push('/teacher/dashboard')}>
                Kembali ke Dashboard
              </Button>
              <Button onClick={() => router.push(`/course/${courseData.title}/edit`)}>
                Edit Course
              </Button>
            </div>
          </div>
        )
    }
  }

  if (!profile || profile.role !== 'teacher') {
    return (
      <MainLayout userRole="teacher">
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Access denied. Teachers only.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole="teacher">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Info Course</span>
            <span>Referensi</span>
            <span>Generate AI</span>
            <span>Preview</span>
            <span>Selesai</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          {renderStepContent()}
        </Card>
      </div>
    </MainLayout>
  )
}
