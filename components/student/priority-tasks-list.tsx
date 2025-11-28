"use client"

import { useEffect, useState } from "react"
import { AlertCircle, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface PriorityTask {
  id: string
  title: string
  courseName: string
  courseId: string
  dueDate: Date
  daysLeft: number
  isUrgent: boolean
}

export function PriorityTasksList() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<PriorityTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPriorityTasks() {
      if (!user) return

      try {
        const supabase = createClient()
        const threeDaysFromNow = new Date()
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

        // Get enrolled courses
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('id, course_id, courses(id, title)')
          .eq('student_id', user.id)

        if (!enrollments || enrollments.length === 0) {
          setLoading(false)
          return
        }

        const courseIds = enrollments.map((e: any) => e.course_id)

        // Get tasks from enrolled courses with upcoming deadlines
        const { data: tasksData, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            due_date,
            material:materials!tasks_material_id_fkey (
              id,
              module:modules!materials_module_id_fkey (
                course_id
              )
            )
          `)
          .in('material.module.course_id', courseIds)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', threeDaysFromNow.toISOString())
          .order('due_date', { ascending: true })

        if (error) throw error

        // Filter tasks that are not yet submitted
        const priorityTasks = await Promise.all(
          (tasksData || []).map(async (task: any) => {
            const courseId = task.material?.module?.course_id
            if (!courseId) return null

            // Find enrollment
            const enrollment = enrollments.find((e: any) => e.course_id === courseId)
            if (!enrollment) return null

            // Check if already submitted
            const { data: submission } = await supabase
              .from('submissions')
              .select('id')
              .eq('task_id', task.id)
              .eq('student_id', user.id)
              .maybeSingle()

            if (submission) return null // Already submitted

            const dueDate = new Date(task.due_date)
            const now = new Date()
            const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            const course = enrollment.courses as any

            return {
              id: task.id,
              title: task.title,
              courseName: course?.title || 'Unknown Course',
              courseId: courseId,
              dueDate,
              daysLeft,
              isUrgent: daysLeft <= 1
            }
          })
        )

        const filteredTasks = priorityTasks.filter((t): t is PriorityTask => t !== null)
        setTasks(filteredTasks)
      } catch (error) {
        console.error('Error fetching priority tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPriorityTasks()
  }, [user])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Tidak ada tugas yang mendesak. Selamat!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4 border-l-4 border-l-primary hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">{task.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{task.courseName}</p>
              <div className="flex items-center gap-2 pt-1">
                {task.isUrgent && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Urgent
                  </Badge>
                )}
                <span className={`text-xs font-medium ${task.isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                  {formatDate(task.dueDate)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({task.daysLeft} {task.daysLeft === 1 ? "hari" : "hari"} lagi)
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 whitespace-nowrap">
              <Link href={`/course/${task.courseId}`}>Kerjakan</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
