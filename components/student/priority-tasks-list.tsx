"use client"

import { AlertCircle, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PriorityTask {
  id: string
  title: string
  courseName: string
  dueDate: Date
  daysLeft: number
  isUrgent: boolean
}

export function PriorityTasksList() {
  // Mock priority tasks - filtered by status='not_started' AND deadline < 3 days
  const tasks: PriorityTask[] = [
    {
      id: "1",
      title: "Quiz: Konsep Algoritma",
      courseName: "Pengantar Algoritma",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      daysLeft: 1,
      isUrgent: true,
    },
    {
      id: "2",
      title: "Assignment: Program Array Sederhana",
      courseName: "Algoritma & Struktur Data",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      daysLeft: 2,
      isUrgent: true,
    },
    {
      id: "3",
      title: "Quiz: React Hooks",
      courseName: "Web Development",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
      daysLeft: 3,
      isUrgent: false,
    },
  ]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
              <Link href={`/course/${task.id}`}>Kerjakan</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
