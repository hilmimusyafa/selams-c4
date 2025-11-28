"use client"

import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function TeacherGreeting() {
  const { profile } = useAuth()

  return (
    <Card className="bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary">Welcome back, {profile?.display_name || "Teacher"}! 📚</h1>
        <p className="text-lg text-muted-foreground">Manage your courses and student progress</p>
      </div>
    </Card>
  )
}
