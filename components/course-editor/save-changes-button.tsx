"use client"

import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SaveChangesButtonProps {
  onSave: () => void
}

export function SaveChangesButton({ onSave }: SaveChangesButtonProps) {
  const handleSave = () => {
    // Simulate save to database
    alert("Changes saved successfully!")
    onSave()
  }

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        onClick={handleSave}
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2 bg-success hover:bg-success/90 text-white"
      >
        <Save className="w-5 h-5" />
        Save Changes
      </Button>
    </div>
  )
}
