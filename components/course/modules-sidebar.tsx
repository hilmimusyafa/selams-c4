"use client"

import { ChevronDown, FileText, Play, HelpCircle, BookMarked, CheckCircle2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ModulesSidebarProps {
  modules: any[]
  selectedMaterialId: string | null
  onSelectMaterial: (id: string) => void
  completedMaterials: Set<string>
}

export function ModulesSidebar({
  modules,
  selectedMaterialId,
  onSelectMaterial,
  completedMaterials,
}: ModulesSidebarProps) {
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "text":
        return FileText
      case "video":
        return Play
      case "quiz":
        return HelpCircle
      case "assignment":
        return Edit
      default:
        return FileText
    }
  }

  if (modules.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">
        No modules available yet
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        {modules.map((module, index) => (
          <Collapsible key={module.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-sm font-semibold px-3 py-2 h-auto">
                <ChevronDown className="w-4 h-4 mr-2" />
                {module.title}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-1 mt-2 ml-2">
              {module.materials && module.materials.length > 0 ? (
                module.materials.map((material: any) => {
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
                })
              ) : (
                <div className="text-xs text-muted-foreground p-2">No materials yet</div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  )
}
