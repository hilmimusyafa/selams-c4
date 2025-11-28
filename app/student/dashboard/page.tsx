"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { GreetingSection } from "@/components/student/greeting-section"
import { ActiveCoursesGrid } from "@/components/student/active-courses-grid"
import { PriorityTasksList } from "@/components/student/priority-tasks-list"

export default function StudentDashboard() {
  return (
    <MainLayout userRole="student">
      <div className="space-y-8 p-6 md:p-8">
        {/* Greeting */}
        <GreetingSection />

        {/* Active Courses Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Active Courses</h2>
          <ActiveCoursesGrid />
        </section>

        {/* Priority Tasks */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Priority Tasks (Due Soon)</h2>
          <PriorityTasksList />
        </section>
      </div>
    </MainLayout>
  )
}
