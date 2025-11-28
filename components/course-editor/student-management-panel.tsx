"use client"

import { Mail, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Student {
  id: string
  name: string
  email: string
  avatar: string
  enrolledDate: string
  progress: number
}

interface StudentManagementPanelProps {
  courseId: string
  editMode: boolean
}

export function StudentManagementPanel({ courseId, editMode }: StudentManagementPanelProps) {
  const students: Student[] = [
    {
      id: "1",
      name: "Budi Santoso",
      email: "budi@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
      enrolledDate: "2024-01-15",
      progress: 65,
    },
    {
      id: "2",
      name: "Siti Nur Azizah",
      email: "siti@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student2",
      enrolledDate: "2024-01-20",
      progress: 42,
    },
    {
      id: "3",
      name: "Rini Wijaya",
      email: "rini@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student3",
      enrolledDate: "2024-02-01",
      progress: 88,
    },
  ]

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Student Management</h2>
            <p className="text-muted-foreground text-sm mt-1">{students.length} students enrolled</p>
          </div>

          {editMode && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Mail className="w-4 h-4" />
                  Invite Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Student</DialogTitle>
                  <DialogDescription>Send invitation email to student</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input type="email" placeholder="Enter student email..." />
                  <Button className="w-full bg-primary hover:bg-primary/90">Send Invitation</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Students List */}
        <ScrollArea className="flex-1 border border-border rounded-lg">
          <div className="space-y-2 p-4">
            {students.map((student) => (
              <Card key={student.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                    <p className="text-xs text-muted-foreground">Progress: {student.progress}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  {editMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
