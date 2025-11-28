"use client"

import { ChevronDown, FileText, Play, HelpCircle, BookMarked, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface ModulesSidebarProps {
  courseId: string
  selectedMaterialId: string
  onSelectMaterial: (id: string) => void
  completedMaterials: Set<string>
}

export function ModulesSidebar({
  courseId,
  selectedMaterialId,
  onSelectMaterial,
  completedMaterials,
}: ModulesSidebarProps) {
  // Mock modules and materials data
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
        { id: "6", type: "quiz", title: "Quiz: Array Concepts" },
      ],
    },
    {
      id: "3",
      title: "Bab 3: Stack dan Queue",
      materials: [
        { id: "7", type: "text", title: "Pengenalan Stack" },
        { id: "8", type: "assignment", title: "Assignment: Implementasi Stack" },
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
      default:
        return FileText
    }
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        {modules.map((module) => (
          <Collapsible key={module.id} defaultOpen>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-sm font-semibold px-3 py-2 h-auto">
                <ChevronDown className="w-4 h-4 mr-2" />
                {module.title}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-1 mt-2 ml-2">
              {module.materials.map((material) => {
                const Icon = getMaterialIcon(material.type)
                const isSelected = selectedMaterialId === material.id
                const isCompleted = completedMaterials.has(material.id)

                return (
                  <button
                    key={material.id}
                    onClick={() => onSelectMaterial(material.id)}
                    className={cn(
                      "w-full flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-background text-foreground",
                    )}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-success" />}
                    {!isCompleted && <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <span className="text-left line-clamp-2 flex-1">{material.title}</span>
                  </button>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  )
}
