"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentEditorProps {
  courseId: string
  selectedMaterialId: string
  editMode: boolean
  onChangeContent: () => void
}

export function ContentEditor({ courseId, selectedMaterialId, editMode, onChangeContent }: ContentEditorProps) {
  const materialTitle = "Apa itu Algoritma?"
  const materialContent = `# Pengantar Algoritma\n\nAlgoritma adalah urutan langkah-langkah logis...`

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 md:p-8 space-y-6">
        {editMode ? (
          <div className="space-y-6">
            {/* Title Editor */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Title</label>
              <Input
                defaultValue={materialTitle}
                onChange={() => onChangeContent()}
                className="mt-2 text-2xl font-bold"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Content (Markdown)</label>
              <textarea
                defaultValue={materialContent}
                onChange={() => onChangeContent()}
                className="mt-2 w-full p-4 rounded-lg border border-border bg-background text-foreground font-mono text-sm min-h-96"
              />
            </div>

            {/* Insert Buttons */}
            <Card className="p-4 bg-muted/50 border-dashed">
              <p className="text-xs font-semibold text-muted-foreground mb-3">INSERT CONTENT:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onChangeContent()} className="gap-2">
                  <Plus className="w-4 h-4" />+ Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => onChangeContent()} className="gap-2">
                  <Plus className="w-4 h-4" />+ Video
                </Button>
                <Button variant="outline" size="sm" onClick={() => onChangeContent()} className="gap-2">
                  <Plus className="w-4 h-4" />+ Quiz
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Enable Edit Mode to modify course content</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
