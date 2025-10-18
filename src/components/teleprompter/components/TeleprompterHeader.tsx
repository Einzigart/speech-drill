import { cn } from "@/lib/utils"
import { Speech } from "@/lib/types"
import { AnimatePresence } from "framer-motion"
import type { TeleprompterThemeColors } from "../types"
import { TeleprompterPlayingIndicator } from "./TeleprompterPlayingIndicator"

interface TeleprompterHeaderProps {
  speech: Speech
  themeColors: TeleprompterThemeColors
  fullscreen?: boolean
  isPlaying?: boolean
}

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function TeleprompterHeader({
  speech,
  themeColors,
  fullscreen = false,
  isPlaying = false
}: TeleprompterHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 backdrop-blur-sm border-b px-6 py-4",
        `${themeColors.background}/95`,
        themeColors.border,
        fullscreen && "px-8"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className={cn("text-lg font-semibold", themeColors.text)}>{speech.title}</h2>
          {speech.author && (
            <p className={cn("text-sm", themeColors.muted)}>by {speech.author}</p>
          )}
        </div>
        <div className="flex items-start justify-end gap-3">
          <AnimatePresence initial={false} mode="wait">
            {isPlaying && (
              <TeleprompterPlayingIndicator key="teleprompter-playing" floating={false} />
            )}
          </AnimatePresence>
          <div className={cn("text-right text-sm", themeColors.muted)}>
            <p>{speech.wordCount} words</p>
            <p>{formatDuration(speech.estimatedDuration)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
