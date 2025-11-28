"use client"

import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <MainLayout>
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-lg">
          <h1 className="text-4xl font-bold">Welcome to SeLaMS</h1>
          <p className="text-lg text-muted-foreground">Smart Learning Management System with AI</p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/student/dashboard">Student Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/teacher/dashboard">Teacher Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
