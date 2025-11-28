"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CreateCourseFAB() {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        asChild
        size="lg"
        className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
      >
        <Link href="/teacher/courses/new" className="flex items-center justify-center gap-2">
          <Plus className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  )
}
