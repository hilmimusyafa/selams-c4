"use client"

import { Card } from "@/components/ui/card"

export function GreetingSection() {
  // Mock current user data
  const userName = "Budi Santoso"
  const currentHour = new Date().getHours()

  const getGreeting = () => {
    if (currentHour < 12) return "Pagi"
    if (currentHour < 17) return "Siang"
    return "Malam"
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Halo, {userName}! 👋</h1>
        <p className="text-lg text-muted-foreground">Siap belajar apa hari ini?</p>
      </div>
    </Card>
  )
}
