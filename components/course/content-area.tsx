"use client"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentAreaProps {
  courseData: any
  selectedMaterialId: string
  isCompleted: boolean
  onMarkAsDone: (materialId: string) => void
}

export function ContentArea({ courseData, selectedMaterialId, isCompleted, onMarkAsDone }: ContentAreaProps) {
  // Find the selected material from courseData
  let selectedMaterial: any = null
  
  for (const module of courseData.modules || []) {
    const found = module.materials?.find((m: any) => m.id === selectedMaterialId)
    if (found) {
      selectedMaterial = found
      break
    }
  }

  if (!selectedMaterial) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a material to view</p>
      </div>
    )
  }

  const renderContent = () => {
    if (selectedMaterial.type === "text") {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-foreground">{selectedMaterial.content || "No content available"}</div>
        </div>
      )
    }

    if (selectedMaterial.type === "video") {
      const videoUrl = selectedMaterial.video_url
      if (!videoUrl) {
        return <p className="text-muted-foreground">No video URL provided</p>
      }

      // Convert YouTube watch URLs to embed URLs if needed
      let embedUrl = videoUrl
      if (videoUrl.includes('youtube.com/watch')) {
        const videoId = new URL(videoUrl).searchParams.get('v')
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }

      return (
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={selectedMaterial.title}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )
    }

    if (selectedMaterial.type === "quiz" || selectedMaterial.type === "assignment") {
      return (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-foreground">
                {selectedMaterial.content || "Quiz/Assignment content will be displayed here"}
              </div>
            </div>
            {selectedMaterial.type === "assignment" && (
              <div className="pt-4 border-t">
                <Button className="bg-primary hover:bg-primary/90">
                  Submit Assignment
                </Button>
              </div>
            )}
            {selectedMaterial.type === "quiz" && (
              <div className="pt-4 border-t">
                <Button className="bg-primary hover:bg-primary/90">
                  Start Quiz
                </Button>
              </div>
            )}
          </div>
        </Card>
      )
    }

    return <p className="text-muted-foreground">Unknown material type</p>
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{selectedMaterial.title}</h2>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg p-6">{renderContent()}</div>

        {/* Mark as Done Button */}
        <div className="flex gap-3">
          <Button
            onClick={() => onMarkAsDone(selectedMaterialId)}
            disabled={isCompleted}
            className={`gap-2 ${isCompleted ? "bg-success hover:bg-success" : "bg-primary hover:bg-primary/90"}`}
          >
            <Check className="w-4 h-4" />
            {isCompleted ? "Completed" : "Mark as Done"}
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}
