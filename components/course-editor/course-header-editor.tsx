"use client"

import { useState } from "react"
import { ChevronDown, Edit2, Link2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CourseHeaderEditorProps {
  courseId: string
  editMode: boolean
  onToggleEditMode: () => void
  onChange: () => void
}

export function CourseHeaderEditor({ courseId, editMode, onToggleEditMode, onChange }: CourseHeaderEditorProps) {
  const [courseData, setCourseData] = useState({
    title: "Pengantar Algoritma dan Struktur Data",
    description: "Pelajari dasar-dasar algoritma, struktur data, dan teknik pemrograman yang efisien.",
  })

  const course = {
    ...courseData,
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Course Title</label>
                  <Input
                    value={courseData.title}
                    onChange={(e) => {
                      setCourseData({ ...courseData, title: e.target.value })
                      onChange()
                    }}
                    className="mt-1 text-2xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => {
                      setCourseData({ ...courseData, description: e.target.value })
                      onChange()
                    }}
                    className="mt-1 w-full p-2 rounded-lg border border-border bg-background text-foreground min-h-20"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
                <p className="text-muted-foreground mt-2">{course.description}</p>
              </>
            )}
          </div>

          {/* Edit Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button onClick={onToggleEditMode} variant={editMode ? "default" : "outline"} className="gap-2" size="sm">
              <Edit2 className="w-4 h-4" />
              {editMode ? "Exit Edit" : "Edit Mode"}
            </Button>
          </div>
        </div>

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
        <Collapsible defaultOpen={editMode}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent" size="sm">
              <Link2 className="w-4 h-4" />
              Important Links
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {course.resources.map((resource, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input defaultValue={resource.name} disabled={!editMode} className="text-sm" />
                {editMode && (
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                )}
              </div>
            ))}
            {editMode && (
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                + Add Link
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* AI Generator Modal (Edit Mode Only) */}
        {editMode && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-secondary hover:bg-secondary/90 gap-2">
                ✨ Generate Course Structure with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Auto-Generate Course Structure</DialogTitle>
                <DialogDescription>
                  Upload course materials and let AI create chapters, content, and quizzes
                </DialogDescription>
              </DialogHeader>
              <AIGeneratorForm courseId={courseId} onGenerate={() => onChange()} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  )
}

function AIGeneratorForm({ courseId, onGenerate }: { courseId: string; onGenerate: () => void }) {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      alert(
        `Generated course structure for: ${topic}\n\nChapters:\n1. Introduction to ${topic}\n2. Core Concepts\n3. Advanced Topics\n4. Practice & Quiz`,
      )
      setTopic("")
      setIsGenerating(false)
      onGenerate()
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Topic / Subject</label>
        <Input
          placeholder="e.g., Machine Learning, Web Security, Database Design..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Upload Reference Material (PDF/DOCX)</label>
        <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer text-center">
          <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!topic.trim() || isGenerating}
        className="w-full bg-secondary hover:bg-secondary/90"
      >
        {isGenerating ? "Generating..." : "Generate Structure"}
      </Button>
    </div>
  )
}
