"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { TeacherGreeting } from "@/components/teacher/greeting-section"
import { ManagedCoursesSection } from "@/components/teacher/managed-courses-section"
import { UpcomingDeadlinesSection } from "@/components/teacher/upcoming-deadlines-section"
import { CreateCourseFAB } from "@/components/teacher/create-course-fab"

export default function TeacherDashboard() {
  return (
    <MainLayout userRole="teacher">
      <div className="space-y-8 p-6 md:p-8">
        {/* Greeting */}
        <TeacherGreeting />

        {/* Managed Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Courses Taught</h2>
          <ManagedCoursesSection />
        </section>

        {/* Upcoming Deadlines & Events */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming Deadlines & Events</h2>
          <UpcomingDeadlinesSection />
        </section>
      </div>

      {/* Floating Action Button */}
      <CreateCourseFAB />
    </MainLayout>
  )
}
