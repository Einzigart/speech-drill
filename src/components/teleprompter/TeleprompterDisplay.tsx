"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Speech } from "@/lib/types"
import {
  getTeleprompterCSSProperties,
  getResponsiveFontSize,
  READING_THEMES
} from "@/lib/teleprompter-config"
import { useAutoFitFontSize } from "./hooks/useAutoFitFontSize"
import { useSpeechProgress } from "./hooks/useSpeechProgress"
import { TeleprompterHeader } from "./components/TeleprompterHeader"
import { TeleprompterContent } from "./components/TeleprompterContent"
import { TeleprompterProgressBar } from "./components/TeleprompterProgressBar"
import { TeleprompterEmptyState } from "./components/TeleprompterEmptyState"
import { getThemeVisuals } from "./styles"

interface TeleprompterDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  speech: Speech | null
  className?: string
  fontSize?: number
  isPlaying?: boolean
  currentPosition?: number
  theme?: keyof typeof READING_THEMES
  fullscreen?: boolean
  autoFit?: boolean
}

export function TeleprompterDisplay({
  speech,
  className,
  fontSize,
  isPlaying = false,
  currentPosition = 0,
  theme = "dark",
  fullscreen = false,
  autoFit = true,
  ...props
}: TeleprompterDisplayProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const activeWordRef = React.useRef<HTMLSpanElement | null>(null)

  const themeColors = READING_THEMES[theme]

  const baseFontSize = React.useMemo(() => {
    if (fontSize) {
      return fontSize
    }

    if (!speech) {
      return 22
    }

    return getResponsiveFontSize(speech.difficulty, "desktop")
  }, [fontSize, speech])

  const { displayRef, responsiveFontSize } = useAutoFitFontSize({
    autoFit,
    speech,
    fontSize,
    baseFontSize
  })

  const {
    paragraphs,
    activeWordIndex,
    progress,
    activeWordProgress
  } = useSpeechProgress({
    speech,
    currentPosition
  })

  const themeVisuals = React.useMemo(() => getThemeVisuals(theme), [theme])

  const cssProperties = React.useMemo(() => {
    if (!speech) {
      return {}
    }

    return getTeleprompterCSSProperties(speech.difficulty, responsiveFontSize, theme)
  }, [speech, responsiveFontSize, theme])

  React.useEffect(() => {
    const container = scrollContainerRef.current
    const activeWord = activeWordRef.current

    if (!container || activeWordIndex === -1 || !activeWord) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    const activeRect = activeWord.getBoundingClientRect()
    const offsetWithinContainer = activeRect.top - containerRect.top + container.scrollTop

    const desiredOffset = offsetWithinContainer - container.clientHeight * 0.35
    const maxScroll = container.scrollHeight - container.clientHeight
    const targetScrollTop = Math.max(0, Math.min(desiredOffset, maxScroll))

    if (Math.abs(container.scrollTop - targetScrollTop) > 1) {
      container.scrollTo({
        top: targetScrollTop,
        behavior: isPlaying ? "smooth" : "auto"
      })
    }
  }, [activeWordIndex, isPlaying])

  if (!speech) {
    return (
      <TeleprompterEmptyState
        themeColors={themeColors}
        fullscreen={fullscreen}
        className={className}
        style={cssProperties}
        {...props}
      />
    )
  }

  return (
    <div
      ref={displayRef}
      className={cn(
        "relative w-full h-96 overflow-hidden border rounded-2xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        themeColors.background,
        themeColors.border,
        fullscreen && "h-screen rounded-none fixed inset-0 z-50",
        className
      )}
      style={cssProperties}
      tabIndex={0}
      {...props}
    >
      <TeleprompterHeader
        speech={speech}
        themeColors={themeColors}
        fullscreen={fullscreen}
        isPlaying={isPlaying}
      />

      <TeleprompterContent
        paragraphs={paragraphs}
        scrollContainerRef={scrollContainerRef}
        themeColors={themeColors}
        responsiveFontSize={responsiveFontSize}
        fullscreen={fullscreen}
        activeWordIndex={activeWordIndex}
        activeWordRef={activeWordRef}
        autoFit={autoFit}
        activeWordProgress={activeWordProgress}
        themeVisuals={themeVisuals}
      />

      <TeleprompterProgressBar progress={progress} themeColors={themeColors} />
    </div>
  )
}
