"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { CourseHeader } from "@/components/course/course-header"
import { CourseLayout } from "@/components/course/course-layout"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { use } from "react"

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default function CoursePage({ params }: CoursePageProps) {
  const { user, profile } = useAuth()
  const resolvedParams = use(params)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<any>(null)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourseData() {
      if (!user) return

      try {
        const supabase = createClient()

        // First check if user is enrolled (for students)
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', resolvedParams.id)
          .eq('student_id', user.id)
          .maybeSingle()

        if (enrollment) {
          setEnrollmentId(enrollment.id)
        }

        // Fetch course with modules and materials
        const { data: course, error: courseError } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            cover_image_url,
            teacher_id,
            teacher:profiles!courses_teacher_id_fkey (
              id,
              display_name,
              avatar_url
            ),
            modules (
              id,
              title,
              description,
              order_index,
              materials (
                id,
                title,
                type,
                content,
                video_url,
                order_index
              )
            )
          `)
          .eq('id', resolvedParams.id)
          .single()

        if (courseError) {
          console.error('Error fetching course:', courseError)
          throw courseError
        }

        // Check access: must be teacher OR enrolled student OR published course
        const isTeacher = course.teacher_id === user.id
        const isEnrolled = !!enrollment
        
        if (!isTeacher && !isEnrolled) {
          console.error('Access denied: User is not enrolled in this course')
          throw new Error('You do not have access to this course')
        }

        // Sort modules and materials by order_index
        if (course.modules) {
          course.modules.sort((a: any, b: any) => a.order_index - b.order_index)
          course.modules.forEach((module: any) => {
            if (module.materials) {
              module.materials.sort((a: any, b: any) => a.order_index - b.order_index)
            }
          })
        }

        setCourseData(course)

        // Set first material as selected by default
        if (course.modules?.[0]?.materials?.[0]) {
          setSelectedMaterialId(course.modules[0].materials[0].id)
        }
      } catch (error: any) {
        console.error('Error fetching course:', error)
        console.error('Error details:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [resolvedParams.id, user])

  if (loading) {
    return (
      <MainLayout userRole={profile?.role || 'student'}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  if (!courseData) {
    return (
      <MainLayout userRole={profile?.role || 'student'}>
        <div className="flex justify-center items-center h-screen">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole={profile?.role || 'student'}>
      <div className="flex flex-col h-full">
        {/* Course Header */}
        <CourseHeader courseData={courseData} />

        {/* 3-Column Layout */}
        <CourseLayout
          courseData={courseData}
          enrollmentId={enrollmentId}
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={setSelectedMaterialId}
        />
      </div>
    </MainLayout>
  )
}
