"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress-bar"

interface Course {
  id: string
  title: string
  thumbnail: string
  progress: number
}

export function ActiveCoursesGrid() {
  // Mock course data with progress
  const courses: Course[] = [
    {
      id: "1",
      title: "Pengantar Algoritma dan Struktur Data",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
      progress: 65,
    },
    {
      id: "2",
      title: "Web Development dengan Next.js",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
      progress: 42,
    },
    {
      id: "3",
      title: "Database Design & SQL",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      progress: 88,
    },
    {
      id: "4",
      title: "Machine Learning Fundamentals",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop",
      progress: 15,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
          {/* Thumbnail */}
          <div className="relative h-40 bg-muted overflow-hidden">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3">
            <h3 className="font-semibold line-clamp-2 text-sm">{course.title}</h3>

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
