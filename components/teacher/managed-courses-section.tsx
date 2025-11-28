"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreVertical, Users, BookMarked, Loader2, Trash2, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface TeacherCourse {
  id: string
  title: string
  description: string
  cover_image_url: string | null
  studentCount: number
  moduleCount: number
}

export function ManagedCoursesSection() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<TeacherCourse | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchTeacherCourses() {
      if (!user) {
        console.log('No user found, skipping fetch')
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()

        console.log('Fetching courses for teacher:', user.id)

        // Get courses created by this teacher
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            cover_image_url
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching courses:', error)
          console.error('Error code:', error.code)
          console.error('Error message:', error.message)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          throw error
        }

        console.log('Courses fetched:', coursesData?.length || 0, coursesData)

        if (!coursesData || coursesData.length === 0) {
          setCourses([])
          setLoading(false)
          return
        }

        // For each course, get student count and module count
        const coursesWithStats = await Promise.all(
          coursesData.map(async (course) => {
            // Get student count from enrollments
            const { count: studentCount, error: enrollError } = await supabase
              .from('enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id)

            if (enrollError) {
              console.error('Error fetching enrollment count:', enrollError)
            }

            // Get module count
            const { count: moduleCount, error: moduleError } = await supabase
              .from('modules')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id)

            if (moduleError) {
              console.error('Error fetching module count:', moduleError)
            }

            return {
              id: course.id,
              title: course.title,
              description: course.description || '',
              cover_image_url: course.cover_image_url,
              studentCount: studentCount || 0,
              moduleCount: moduleCount || 0
            }
          })
        )

        console.log('Courses with stats:', coursesWithStats)
        setCourses(coursesWithStats)
      } catch (error: any) {
        console.error('Error fetching teacher courses:', error)
        
        // Better error logging
        if (error) {
          console.error('Full error object:', JSON.stringify(error, null, 2))
          console.error('Error type:', typeof error)
          console.error('Error keys:', Object.keys(error))
          
          if (error.message) console.error('Message:', error.message)
          if (error.details) console.error('Details:', error.details)
          if (error.hint) console.error('Hint:', error.hint)
          if (error.code) console.error('Code:', error.code)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherCourses()
  }, [user])

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    setDeleting(true)
    try {
      const supabase = createClient()

      // Delete course (cascading delete will handle related records)
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete.id)

      if (error) throw error

      // Remove from local state
      setCourses(courses.filter(c => c.id !== courseToDelete.id))

      toast({
        title: "Course deleted",
        description: `"${courseToDelete.title}" has been deleted successfully.`,
      })

      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

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
        <p className="text-muted-foreground">Belum ada course yang dibuat.</p>
        <p className="text-sm text-muted-foreground mt-2">Klik tombol + untuk membuat course baru!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
          {/* Thumbnail */}
          <Link href={`/course/${course.id}/edit`} className="relative h-40 bg-muted overflow-hidden block group">
            <Image
              src={course.cover_image_url || "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop"}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2 text-sm flex-1">{course.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/course/${course.id}`}>View Course</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/course/${course.id}/edit`}>Edit Course</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/course/${course.id}/students`}>Manage Students</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setCourseToDelete(course)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 py-2 border-t border-border pt-3">
              <div className="flex items-center gap-1 text-xs">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">{course.studentCount}</span>
                <span className="text-muted-foreground">students</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <BookMarked className="w-4 h-4 text-secondary" />
                <span className="font-medium">{course.moduleCount}</span>
                <span className="text-muted-foreground">modules</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto pt-2">
              <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                <Link href={`/course/${course.id}`}>View</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                <Link href={`/course/${course.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Course?
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete <strong>{courseToDelete?.title}</strong>?
              </p>
              <p>This will permanently delete:</p>
              <div className="pl-4 space-y-1 text-sm">
                <p>• All modules and materials</p>
                <p>• All assignments and submissions</p>
                <p>• All student enrollments</p>
                <p>• All course events</p>
              </div>
              <p className="text-destructive font-semibold">
                This action cannot be undone.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setCourseToDelete(null)
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Course
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
