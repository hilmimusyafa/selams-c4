"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Settings, Menu, X, GraduationCap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  userRole?: "teacher" | "student"
}

export function Sidebar({ isOpen, onToggle, userRole = "student" }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Dashboard",
      href: userRole === "teacher" ? "/teacher/dashboard" : "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative z-30 w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary">
            <GraduationCap className="w-6 h-6" />
            <span>SeLaMS</span>
          </Link>
          <button onClick={onToggle} className="lg:hidden text-sidebar-foreground hover:text-sidebar-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer - Create Course Button (Teacher Only) */}
        {userRole === "teacher" && (
          <div className="p-4 border-t border-sidebar-border">
            <Button
              asChild
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground gap-2"
            >
              <Link href="/teacher/course/create">
                <Plus className="w-4 h-4" />
                Create Course
              </Link>
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 lg:hidden z-20 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  )
}
