"use client"

interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  // Logic: Red <20%, Yellow <50%, Green >80%
  const getColor = () => {
    if (value < 20) return "bg-destructive" // Red
    if (value < 50) return "bg-warning" // Yellow/Orange
    if (value >= 80) return "bg-success" // Green
    return "bg-secondary" // Teal for 50-80%
  }

  return (
    <div className={`w-full h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${getColor()} transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
