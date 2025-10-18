import { cn } from "@/lib/utils"
import type { TeleprompterThemeColors } from "../types"

interface TeleprompterProgressBarProps {
  progress: number
  themeColors: TeleprompterThemeColors
}

export function TeleprompterProgressBar({
  progress,
  themeColors
}: TeleprompterProgressBarProps) {
  const clampedProgress = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0

  return (
    <div className={cn("absolute bottom-0 left-0 right-0 h-1", themeColors.muted)}>
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${clampedProgress * 100}%` }}
      />
    </div>
  )
}
