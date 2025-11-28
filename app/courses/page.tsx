"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Loader2, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  title: string
  description: string
  cover_image_url: string | null
  teacher: {
    display_name: string
  }
}

export default function CoursesPage() {
  const { user, profile } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      if (!user || !profile) return

      try {
        const supabase = createClient()

        if (profile.role === 'teacher') {
          // For teacher: show courses they created
          const { data, error } = await supabase
            .from('courses')
            .select(`
              id,
              title,
              description,
              cover_image_url,
              teacher:profiles!courses_teacher_id_fkey(display_name)
            `)
            .eq('teacher_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error
          setCourses(data || [])
        } else {
          // For student: show enrolled courses
          const { data, error } = await supabase
            .from('enrollments')
            .select(`
              course:courses(
                id,
                title,
                description,
                cover_image_url,
                teacher:profiles!courses_teacher_id_fkey(display_name)
              )
            `)
            .eq('student_id', user.id)

          if (error) throw error
          const enrolledCourses = (data || [])
            .map((e: any) => e.course)
            .filter((c: any) => c !== null)
          setCourses(enrolledCourses)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user, profile])

  if (loading) {
    return (
      <MainLayout userRole={profile?.role || 'student'}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole={profile?.role || 'student'}>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {profile?.role === 'teacher' ? 'My Courses' : 'Enrolled Courses'}
          </h1>
          <p className="text-muted-foreground">
            {profile?.role === 'teacher' 
              ? 'Manage and view your teaching courses' 
              : 'View and access your enrolled courses'}
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground mb-6">
              {profile?.role === 'teacher'
                ? "You haven't created any courses yet. Start by creating your first course!"
                : "You're not enrolled in any courses yet. Check with your teacher to get enrolled."}
            </p>
            {profile?.role === 'teacher' && (
              <Button asChild>
                <Link href="/teacher/course/create">Create Your First Course</Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
                <Link href={`/course/${course.id}`} className="relative h-48 bg-muted overflow-hidden block group">
                  <Image
                    src={course.cover_image_url || "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-1 p-5 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                    {course.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      By {course.teacher.display_name}
                    </p>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                      <Link href={`/course/${course.id}`}>
                        Open Course
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
