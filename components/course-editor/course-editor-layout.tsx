"use client"

import { useState } from "react"
import { ModulesEditorSidebar } from "./modules-editor-sidebar"
import { ContentEditor } from "./content-editor"
import { StudentManagementPanel } from "./student-management-panel"

interface CourseEditorLayoutProps {
  courseId: string
  editMode: boolean
  onChangeContent: () => void
}

export function CourseEditorLayout({ courseId, editMode, onChangeContent }: CourseEditorLayoutProps) {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("1")
  const [activeTab, setActiveTab] = useState<"content" | "students">("content")

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Left Sidebar: Modules Editor */}
      <div className="hidden lg:flex w-64 border-r border-border flex-col overflow-hidden bg-muted/30">
        <ModulesEditorSidebar
          courseId={courseId}
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={setSelectedMaterialId}
          editMode={editMode}
          onChangeContent={onChangeContent}
        />
      </div>

      {/* Center/Right: Content Editor or Student Management */}
      {activeTab === "content" ? (
        <ContentEditor
          courseId={courseId}
          selectedMaterialId={selectedMaterialId}
          editMode={editMode}
          onChangeContent={onChangeContent}
        />
      ) : (
        <StudentManagementPanel courseId={courseId} editMode={editMode} />
      )}

      {/* Tab Switcher */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-card border border-border rounded-full p-1 shadow-lg z-20">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "content" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "students" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          }`}
        >
          Students
        </button>
      </div>
    </div>
  )
}
