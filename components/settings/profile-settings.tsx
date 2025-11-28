"use client"

import { useState } from "react"
import { Upload, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface ProfileData {
  displayName: string
  email: string
  role: "teacher" | "student"
  avatarUrl: string
  bio: string
  password: string
}

export function ProfileSettings() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: "Budi Santoso",
    email: "budi@example.com",
    role: "student",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
    bio: "Passionate learner and software enthusiast",
    password: "••••••••",
  })

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate save to database
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profileData.avatarUrl || "/placeholder.svg"} alt={profileData.displayName} />
          <AvatarFallback>{profileData.displayName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            Change Avatar
          </Button>
          <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Display Name */}
        <div>
          <label className="text-sm font-semibold text-foreground">Display Name</label>
          <Input
            value={profileData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className="mt-2"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-foreground">Email</label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="mt-2"
            placeholder="Enter your email"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-sm font-semibold text-foreground">Role</label>
          <div className="mt-2 p-3 bg-muted rounded-lg text-sm text-foreground">
            {profileData.role === "teacher" ? "Teacher" : "Student"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Role cannot be changed after account creation</p>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-semibold text-foreground">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="mt-2 w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm min-h-24"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-semibold text-foreground">Password</label>
          <div className="mt-2 flex gap-2">
            <Input
              type={showPassword ? "text" : "password"}
              value={profileData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter new password (optional)"
            />
            <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Leave blank to keep current password</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-primary hover:bg-primary/90">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
