"use client"

import { FileText, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
  // Mock data: assignments with deadline < 7 days + events with start_date < 7 days
  const items: DeadlineItem[] = [
    {
      id: "1",
      type: "assignment",
      title: "Assignment: Program Array Sederhana",
      courseName: "Algoritma & Struktur Data",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      daysLeft: 2,
      waitingForGrading: 12,
      icon: FileText,
    },
    {
      id: "2",
      type: "event",
      title: "Mid-term Exam",
      courseName: "Algoritma & Struktur Data",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      daysLeft: 4,
      icon: Calendar,
    },
    {
      id: "3",
      type: "assignment",
      title: "Quiz: React Hooks",
      courseName: "Web Development",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      daysLeft: 5,
      waitingForGrading: 8,
      icon: FileText,
    },
    {
      id: "4",
      type: "assignment",
      title: "Final Project Submission",
      courseName: "Database Design",
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      daysLeft: 6,
      waitingForGrading: 5,
      icon: FileText,
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
