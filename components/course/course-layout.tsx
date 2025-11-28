"use client"

import { useState } from "react"
import { ModulesSidebar } from "./modules-sidebar"
import { ContentArea } from "./content-area"
import { ChatbotSidebar } from "./chatbot-sidebar"

interface CourseLayoutProps {
  courseId: string
  selectedMaterialId: string
  onSelectMaterial: (id: string) => void
}

export function CourseLayout({ courseId, selectedMaterialId, onSelectMaterial }: CourseLayoutProps) {
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set(["1", "2"]))

  const handleMarkAsDone = (materialId: string) => {
    const newCompleted = new Set(completedMaterials)
    newCompleted.add(materialId)
    setCompletedMaterials(newCompleted)
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Left Sidebar: Modules Navigation */}
      <div className="hidden lg:flex w-64 border-r border-border flex-col overflow-hidden bg-muted/30">
        <ModulesSidebar
          courseId={courseId}
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={onSelectMaterial}
          completedMaterials={completedMaterials}
        />
      </div>

      {/* Center: Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ContentArea
          courseId={courseId}
          selectedMaterialId={selectedMaterialId}
          isCompleted={completedMaterials.has(selectedMaterialId)}
          onMarkAsDone={handleMarkAsDone}
        />
      </div>

      {/* Right Sidebar: Chatbot + Progress */}
      <div className="hidden xl:flex w-80 border-l border-border flex-col overflow-hidden bg-muted/30">
        <ChatbotSidebar courseId={courseId} totalMaterials={8} completedMaterials={completedMaterials.size} />
      </div>
    </div>
  )
}
