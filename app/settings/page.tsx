"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { TelegramIntegration } from "@/components/settings/telegram-integration"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and notification preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <ProfileSettings />
          </Card>

          {/* Telegram Integration */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <TelegramIntegration />
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
