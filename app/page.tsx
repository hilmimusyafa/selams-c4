"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { BookOpen, GraduationCap, Users, Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { profile, loading } = useAuth()

  useEffect(() => {
    // Redirect authenticated users to their respective dashboards
    if (!loading && profile) {
      if (profile.role === 'teacher') {
        router.push('/teacher/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    }
  }, [profile, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground">Welcome to SeLaMS</h1>
          <p className="text-xl text-muted-foreground">
            Smart Learning Management System dengan AI untuk pengalaman belajar yang lebih baik
          </p>
          
          <div className="flex gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Daftar Sekarang</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-xl shadow-lg border">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Untuk Murid</h3>
            <p className="text-muted-foreground">
              Akses materi pembelajaran, kerjakan tugas, dan pantau progress belajar kamu dengan mudah
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-lg border">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Untuk Guru</h3>
            <p className="text-muted-foreground">
              Buat dan kelola kelas, monitoring siswa, dan berikan feedback secara efisien
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
