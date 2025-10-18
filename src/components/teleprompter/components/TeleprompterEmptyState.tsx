import * as React from "react"
import { cn } from "@/lib/utils"
import type { TeleprompterThemeColors } from "../types"

interface TeleprompterEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  themeColors: TeleprompterThemeColors
  fullscreen?: boolean
}

export function TeleprompterEmptyState({
  themeColors,
  fullscreen = false,
  className,
  style,
  ...props
}: TeleprompterEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-96 rounded-lg border-2 border-dashed",
        themeColors.background,
        themeColors.border,
        "border-opacity-25",
        fullscreen && "h-screen rounded-none",
        className
      )}
      style={style}
      {...props}
    >
      <div className="text-center space-y-2">
        <p className={cn("text-lg font-medium", themeColors.muted)}>No speech selected</p>
        <p className={cn("text-sm", themeColors.muted)}>Choose a speech to begin practicing</p>
      </div>
    </div>
  )
}
