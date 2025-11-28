"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { CourseHeader } from "@/components/course/course-header"
import { CourseLayout } from "@/components/course/course-layout"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("1")

  return (
    <MainLayout userRole="student">
      <div className="flex flex-col h-full">
        {/* Course Header */}
        <CourseHeader courseId={params.id} />

        {/* 3-Column Layout */}
        <CourseLayout
          courseId={params.id}
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={setSelectedMaterialId}
        />
      </div>
    </MainLayout>
  )
}
