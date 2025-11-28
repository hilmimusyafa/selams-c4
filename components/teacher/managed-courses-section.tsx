"use client"

import Image from "next/image"
import Link from "next/link"
import { MoreVertical, Users, BookMarked } from "lucide-react"
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

interface TeacherCourse {
  id: string
  title: string
  description: string
  thumbnail: string
  studentCount: number
  moduleCount: number
}

export function ManagedCoursesSection() {
  // Mock teacher's courses
  const courses: TeacherCourse[] = [
    {
      id: "1",
      title: "Pengantar Algoritma dan Struktur Data",
      description: "Pelajari dasar-dasar algoritma, struktur data, dan teknik pemrograman yang efisien.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
      studentCount: 45,
      moduleCount: 12,
    },
    {
      id: "2",
      title: "Web Development dengan Next.js",
      description: "Master modern web development dengan React dan Next.js framework.",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
      studentCount: 32,
      moduleCount: 8,
    },
    {
      id: "3",
      title: "Database Design & SQL",
      description: "Desain database yang optimal dan SQL query yang efisien.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      studentCount: 28,
      moduleCount: 6,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
          {/* Thumbnail */}
          <Link href={`/course/${course.id}/edit`} className="relative h-40 bg-muted overflow-hidden block group">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
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
    </div>
  )
}
