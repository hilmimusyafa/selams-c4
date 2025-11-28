"use client"

import { FileText, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

interface DeadlineItem {
  id: string
  type: "assignment" | "event"
  title: string
  courseName: string
  dueDate: Date
  daysLeft: number
  waitingForGrading?: number
  icon: any
}

export function UpcomingDeadlinesSection() {
  const { user } = useAuth()
  const [items, setItems] = useState<DeadlineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDeadlines() {
      if (!user) return

      const supabase = createClient()
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

      try {
        // Fetch tasks with due_date < 7 days, joining through materials -> modules -> courses
        const { data: tasks } = await supabase
          .from('tasks')
          .select(`
            id,
            due_date,
            material:materials!inner(
              id,
              title,
              module:modules!inner(
                id,
                course:courses!inner(id, title, teacher_id)
              )
            )
          `)
          .not('due_date', 'is', null)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', sevenDaysFromNow.toISOString())
          .order('due_date', { ascending: true })

        // Filter tasks where the course belongs to this teacher
        const teacherTasks = (tasks || []).filter((task: any) => 
          task.material?.module?.course?.teacher_id === user.id
        )

        // For each task, count submissions waiting for grading
        const taskItems: DeadlineItem[] = await Promise.all(
          teacherTasks.map(async (task: any) => {
            const { count } = await supabase
              .from('submissions')
              .select('*', { count: 'exact', head: true })
              .eq('task_id', task.id)
              .is('grade', null)

            const deadline = new Date(task.due_date)
            const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

            return {
              id: task.id,
              type: 'assignment' as const,
              title: task.material.title,
              courseName: task.material.module.course.title,
              dueDate: deadline,
              daysLeft,
              waitingForGrading: count || 0,
              icon: FileText,
            }
          })
        )

        // Sort by date
        const allItems = [...taskItems].sort(
          (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
        )

        setItems(allItems)
      } catch (error) {
        console.error('Error fetching deadlines:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeadlines()
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
      <Card className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-muted-foreground">Loading deadlines...</p>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No upcoming deadlines. Great!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = item.icon
        const isUrgent = item.daysLeft <= 2

        return (
          <Card
            key={item.id}
            className={`p-4 border-l-4 transition-all duration-200 hover:shadow-md ${
              isUrgent ? "border-l-destructive bg-destructive/5" : "border-l-secondary"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isUrgent ? "text-destructive" : "text-secondary"}`} />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  {isUrgent && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      URGENT
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{item.courseName}</p>

                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className={isUrgent ? "text-destructive font-semibold" : "text-muted-foreground"}>
                    {formatDate(item.dueDate)}
                  </span>
                  <span className="text-muted-foreground">
                    ({item.daysLeft} {item.daysLeft === 1 ? "day" : "days"} left)
                  </span>

                  {/* Waiting for Grading Badge */}
                  {item.waitingForGrading && item.waitingForGrading > 0 && (
                    <Badge className="bg-warning/20 text-warning border-0">
                      {item.waitingForGrading} waiting for grading
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {item.type === "assignment" && item.waitingForGrading && item.waitingForGrading > 0 && (
                <Button size="sm" className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                  Grade Now
                </Button>
              )}
              {item.type === "event" && (
                <Button size="sm" variant="outline" className="whitespace-nowrap bg-transparent">
                  View Details
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
