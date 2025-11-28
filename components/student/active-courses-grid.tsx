"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress-bar"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface Course {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  teacher: {
    display_name: string
  } | null
  progress: number
}

export function ActiveCoursesGrid() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEnrolledCourses() {
      if (!user) return

      try {
        const supabase = createClient()

        // Get enrolled courses with progress
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select(`
            id,
            course:courses (
              id,
              title,
              description,
              cover_image_url,
              teacher:profiles!courses_teacher_id_fkey (
                display_name
              )
            )
          `)
          .eq('student_id', user.id)

        if (enrollError) throw enrollError

        // Calculate progress for each course
        const coursesWithProgress = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const course = enrollment.course

            // Get all materials in this course
            const { data: modules } = await supabase
              .from('modules')
              .select(`
                id,
                materials (id)
              `)
              .eq('course_id', course.id)

            const totalMaterials = modules?.reduce((acc, m: any) => acc + (m.materials?.length || 0), 0) || 0

            // Get completed materials
            const { data: progress } = await supabase
              .from('course_progress')
              .select('id')
              .eq('enrollment_id', enrollment.id)
              .eq('is_completed', true)

            const completedMaterials = progress?.length || 0
            const progressPercentage = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0

            return {
              id: course.id,
              title: course.title,
              description: course.description,
              cover_image_url: course.cover_image_url,
              teacher: course.teacher,
              progress: progressPercentage
            }
          })
        )

        setCourses(coursesWithProgress)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Belum ada course yang diikuti.</p>
        <p className="text-sm text-muted-foreground mt-2">Cari dan enroll course untuk memulai belajar!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
          {/* Thumbnail */}
          <div className="relative h-40 bg-muted overflow-hidden">
            <Image
              src={course.cover_image_url || "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop"}
              alt={course.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3">
            <div>
              <h3 className="font-semibold line-clamp-2 text-sm mb-1">{course.title}</h3>
              {course.teacher && (
                <p className="text-xs text-muted-foreground">{course.teacher.display_name}</p>
              )}
            </div>

            {/* Progress Bar with Color Logic */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-semibold text-foreground">{course.progress}%</span>
              </div>
              <ProgressBar value={course.progress} />
            </div>

            {/* Action Button */}
            <Button asChild size="sm" className="w-full mt-auto bg-primary hover:bg-primary/90">
              <Link href={`/course/${course.id}`} className="flex items-center justify-center gap-2">
                Lanjutkan
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
