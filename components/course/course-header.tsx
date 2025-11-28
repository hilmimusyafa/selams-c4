"use client"

import { ChevronDown, Link2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CourseHeaderProps {
  courseData: any
}

export function CourseHeader({ courseData }: CourseHeaderProps) {
  // Default resources (can be extended from database in the future)
  const resources = [
    { name: "Course Syllabus (PDF)", url: "#" },
    { name: "Zoom Class Link", url: "#" },
    { name: "WhatsApp Group", url: "#" },
  ]

  return (
    <Card className="rounded-none border-b border-l-0 border-r-0 border-t-0 p-6 bg-card">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{courseData.title}</h1>
          {courseData.description && (
            <p className="text-muted-foreground mt-2">{courseData.description}</p>
          )}
        </div>

        {/* Instructor Info */}
        {courseData.teacher && (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={courseData.teacher.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${courseData.teacher.id}`} 
                alt={courseData.teacher.display_name} 
              />
              <AvatarFallback>{courseData.teacher.display_name?.charAt(0) || 'T'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">Instructor</p>
              <p className="text-sm text-muted-foreground">{courseData.teacher.display_name}</p>
            </div>
          </div>
        )}

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
            {resources.map((resource, idx) => (
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
