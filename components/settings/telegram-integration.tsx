"use client"

import { useState } from "react"
import { Send, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type ConnectionStatus = "disconnected" | "testing" | "connected" | "error"

export function TelegramIntegration() {
  const { toast } = useToast()
  const [chatId, setChatId] = useState("123456789")
  const [status, setStatus] = useState<ConnectionStatus>("connected")
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = async () => {
    if (!chatId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Telegram Chat ID",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    setStatus("testing")

    // Simulate API call to test connection
    setTimeout(() => {
      setIsTesting(false)
      setStatus("connected")
      toast({
        title: "Success",
        description: "Test message sent to your Telegram!",
      })
    }, 2000)
  }

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-5 h-5 text-success" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "testing":
        return <div className="w-5 h-5 rounded-full border-2 border-warning border-t-transparent animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success hover:bg-success">Connected</Badge>
      case "testing":
        return <Badge className="bg-warning hover:bg-warning">Testing...</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Disconnected</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg space-y-2">
        <h3 className="font-semibold text-secondary">Telegram Notifications</h3>
        <p className="text-sm text-foreground">
          Connect your Telegram account to receive deadline reminders and course updates directly on Telegram. You'll
          get notified 1 day before assignment deadlines.
        </p>
      </div>

      {/* Setup Instructions */}
      <Card className="p-4 bg-muted/50 border-muted">
        <h4 className="text-sm font-semibold mb-3">How to get your Telegram Chat ID:</h4>
        <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
          <li>
            Open Telegram and search for <code className="bg-background px-2 py-1 rounded">@userinfobot</code>
          </li>
          <li>
            Send the message <code className="bg-background px-2 py-1 rounded">/start</code>
          </li>
          <li>
            Copy the <code className="bg-background px-2 py-1 rounded">id</code> number shown
          </li>
          <li>Paste it in the field below</li>
        </ol>
      </Card>

      {/* Chat ID Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Telegram Chat ID</label>
          {getStatusBadge()}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Enter your Telegram Chat ID (e.g., 123456789)"
            disabled={isTesting}
          />
          <Button
            onClick={handleTestConnection}
            disabled={isTesting || !chatId.trim()}
            variant="outline"
            className="gap-2 bg-transparent"
            size="icon"
          >
            {getStatusIcon()}
          </Button>
        </div>

        {status === "connected" && (
          <p className="text-xs text-success">Successfully connected! You will receive notifications on Telegram.</p>
        )}
        {status === "error" && (
          <p className="text-xs text-destructive">Connection failed. Please check your Chat ID and try again.</p>
        )}
      </div>

      {/* Notification Settings */}
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-semibold">Notification Preferences</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" />
            <span className="text-sm text-foreground">Assignment deadline reminders (1 day before)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" />
            <span className="text-sm text-foreground">New course announcements</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-border" />
            <span className="text-sm text-foreground">Assignment grades posted</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={() => {
          toast({
            title: "Success",
            description: "Notification settings saved",
          })
        }}
        className="w-full bg-primary hover:bg-primary/90 gap-2"
      >
        <Send className="w-4 h-4" />
        Save Notification Settings
      </Button>
    </div>
  )
}
