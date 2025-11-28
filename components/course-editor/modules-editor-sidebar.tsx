"use client"

import { Plus, ChevronDown, Trash2, Edit2, FileText, Play, HelpCircle, BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Material {
  id: string
  type: "text" | "video" | "quiz" | "assignment"
  title: string
}

interface Module {
  id: string
  title: string
  materials: Material[]
}

interface ModulesEditorSidebarProps {
  courseId: string
  selectedMaterialId: string
  onSelectMaterial: (id: string) => void
  editMode: boolean
  onChangeContent: () => void
}

export function ModulesEditorSidebar({
  courseId,
  selectedMaterialId,
  onSelectMaterial,
  editMode,
  onChangeContent,
}: ModulesEditorSidebarProps) {
  const modules: Module[] = [
    {
      id: "1",
      title: "Bab 1: Pengenalan Algoritma",
      materials: [
        { id: "1", type: "text", title: "Apa itu Algoritma?" },
        { id: "2", type: "video", title: "Video: Algoritma Sederhana" },
        { id: "3", type: "quiz", title: "Quiz: Konsep Algoritma" },
      ],
    },
    {
      id: "2",
      title: "Bab 2: Array dan List",
      materials: [
        { id: "4", type: "text", title: "Array dalam Pemrograman" },
        { id: "5", type: "video", title: "Video: Array Operations" },
      ],
    },
  ]

  const getMaterialIcon = (type: Material["type"]) => {
    switch (type) {
      case "text":
        return FileText
      case "video":
        return Play
      case "quiz":
        return HelpCircle
      case "assignment":
        return BookMarked
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Modules</h3>
      </div>

      {/* Modules List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {modules.map((module) => (
            <Collapsible key={module.id} defaultOpen>
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-1 justify-start p-0 h-auto py-2">
                    <ChevronDown className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{module.title}</span>
                  </Button>
                </CollapsibleTrigger>
                {editMode && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                )}
              </div>

              <CollapsibleContent className="space-y-1 mt-2 ml-2">
                {module.materials.map((material) => {
                  const Icon = getMaterialIcon(material.type)
                  const isSelected = selectedMaterialId === material.id

                  return (
                    <div key={material.id} className="flex items-center gap-2 group">
                      <button
                        onClick={() => onSelectMaterial(material.id)}
                        className={cn(
                          "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-background text-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{material.title}</span>
                      </button>
                      {editMode && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}

                {editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-2 bg-transparent"
                    onClick={() => onChangeContent()}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Content
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      {/* Add Module Button (Edit Mode) */}
      {editMode && (
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full text-sm gap-2 bg-transparent" onClick={() => onChangeContent()}>
            <Plus className="w-4 h-4" />
            Add Chapter
          </Button>
        </div>
      )}
    </div>
  )
}
