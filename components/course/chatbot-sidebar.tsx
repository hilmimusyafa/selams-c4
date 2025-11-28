"use client"

import { useState } from "react"
import { Send, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProgressBar } from "@/components/ui/progress-bar"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatbotSidebarProps {
  courseId: string
  totalMaterials: number
  completedMaterials: number
}

export function ChatbotSidebar({ courseId, totalMaterials, completedMaterials }: ChatbotSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Halo! Saya adalah AI Tutor Anda. Tanyakan apa pun tentang materi kursus ini. Saya siap membantu! 🤖",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const progressPercent = Math.round((completedMaterials / totalMaterials) * 100)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Terima kasih atas pertanyaannya: "${input}"\n\nBerdasarkan materi kursus, jawaban singkatnya adalah bahwa konsep ini adalah fondasi penting dalam pemrograman dan algoritma. Untuk penjelasan lebih detail, silakan kembali ke materi teks atau tonton video pembelajaran kami.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">AI Tutor</h3>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-semibold text-foreground">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} />
          <p className="text-xs text-muted-foreground">
            {completedMaterials} of {totalMaterials} completed
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-3 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask AI Tutor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
