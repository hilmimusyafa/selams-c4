"use client"

import { ChevronDown, Link2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CourseHeaderProps {
  courseId: string
}

export function CourseHeader({ courseId }: CourseHeaderProps) {
  // Mock course data
  const course = {
    id: courseId,
    title: "Pengantar Algoritma dan Struktur Data",
    description: "Pelajari dasar-dasar algoritma, struktur data, dan teknik pemrograman yang efisien.",
    instructor: {
      name: "Dr. Ahmad Kurniawan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
    },
    resources: [
      { name: "Course Syllabus (PDF)", url: "#" },
      { name: "Zoom Class Link", url: "#" },
      { name: "WhatsApp Group", url: "#" },
    ],
  }

  return (
    <Card className="rounded-none border-b border-l-0 border-r-0 border-t-0 p-6 bg-card">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.description}</p>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={course.instructor.avatar || "/placeholder.svg"} alt={course.instructor.name} />
            <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">Instructor</p>
            <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
          </div>
        </div>

        {/* Resources Collapsible */}
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent" size="sm">
              <Link2 className="w-4 h-4" />
              Important Links
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {course.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm text-primary hover:underline"
              >
                {resource.name}
              </a>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  )
}
