"use client"

import { useState, useEffect } from "react"
import { ModulesSidebar } from "./modules-sidebar"
import { ContentArea } from "./content-area"
import { ChatbotSidebar } from "./chatbot-sidebar"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface CourseLayoutProps {
  courseData: any
  enrollmentId: string | null
  selectedMaterialId: string | null
  onSelectMaterial: (id: string) => void
}

export function CourseLayout({ courseData, enrollmentId, selectedMaterialId, onSelectMaterial }: CourseLayoutProps) {
  const { user } = useAuth()
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set())
  const [totalMaterials, setTotalMaterials] = useState(0)

  useEffect(() => {
    async function fetchProgress() {
      if (!enrollmentId || !user) return

      try {
        const supabase = createClient()

        // Get completed materials for this enrollment
        const { data: progress } = await supabase
          .from('course_progress')
          .select('material_id, is_completed')
          .eq('enrollment_id', enrollmentId)
          .eq('is_completed', true)

        if (progress) {
          const completed = new Set(progress.map(p => p.material_id))
          setCompletedMaterials(completed)
        }

        // Calculate total materials
        let total = 0
        courseData.modules?.forEach((module: any) => {
          total += module.materials?.length || 0
        })
        setTotalMaterials(total)
      } catch (error) {
        console.error('Error fetching progress:', error)
      }
    }

    fetchProgress()
  }, [enrollmentId, user, courseData])

  const handleMarkAsDone = async (materialId: string) => {
    if (!enrollmentId || !user) return

    try {
      const supabase = createClient()

      // Check if progress entry exists
      const { data: existing } = await supabase
        .from('course_progress')
        .select('id')
        .eq('enrollment_id', enrollmentId)
        .eq('material_id', materialId)
        .maybeSingle()

      if (existing) {
        // Update existing
        await supabase
          .from('course_progress')
          .update({ is_completed: true })
          .eq('id', existing.id)
      } else {
        // Insert new
        await supabase
          .from('course_progress')
          .insert({
            enrollment_id: enrollmentId,
            material_id: materialId,
            is_completed: true
          })
      }

      // Update local state
      const newCompleted = new Set(completedMaterials)
      newCompleted.add(materialId)
      setCompletedMaterials(newCompleted)
    } catch (error) {
      console.error('Error marking material as done:', error)
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Left Sidebar: Modules Navigation */}
      <div className="hidden lg:flex w-64 border-r border-border flex-col overflow-hidden bg-muted/30">
        <ModulesSidebar
          modules={courseData.modules || []}
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={onSelectMaterial}
          completedMaterials={completedMaterials}
        />
      </div>

      {/* Center: Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedMaterialId && (
          <ContentArea
            courseData={courseData}
            selectedMaterialId={selectedMaterialId}
            isCompleted={completedMaterials.has(selectedMaterialId)}
            onMarkAsDone={handleMarkAsDone}
          />
        )}
      </div>

      {/* Right Sidebar: Chatbot + Progress */}
      <div className="hidden xl:flex w-80 border-l border-border flex-col overflow-hidden bg-muted/30">
        <ChatbotSidebar 
          courseId={courseData.id} 
          totalMaterials={totalMaterials} 
          completedMaterials={completedMaterials.size} 
        />
      </div>
    </div>
  )
}
