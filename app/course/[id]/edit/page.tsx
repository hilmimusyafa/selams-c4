"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { CourseHeaderEditor } from "@/components/course-editor/course-header-editor"
import { CourseEditorLayout } from "@/components/course-editor/course-editor-layout"
import { SaveChangesButton } from "@/components/course-editor/save-changes-button"

interface CourseEditPageProps {
  params: {
    id: string
  }
}

export default function CourseEditPage({ params }: CourseEditPageProps) {
  const [editMode, setEditMode] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  return (
    <MainLayout userRole="teacher">
      <div className="flex flex-col h-full">
        {/* Course Header with Edit Toggle */}
        <CourseHeaderEditor
          courseId={params.id}
          editMode={editMode}
          onToggleEditMode={() => setEditMode(!editMode)}
          onChange={() => setHasChanges(true)}
        />

        {/* Editor Layout */}
        <CourseEditorLayout courseId={params.id} editMode={editMode} onChangeContent={() => setHasChanges(true)} />

        {/* Save Changes Button */}
        {editMode && hasChanges && <SaveChangesButton onSave={() => setHasChanges(false)} />}
      </div>
    </MainLayout>
  )
}
