"use client"

import * as React from "react"
import type { TeleprompterStructure } from "@/lib/teleprompter-structure"

interface UseTeleprompterPlaybackOptions {
  structure: TeleprompterStructure | null
  scrollSpeed: number
  onComplete?: () => void
}

interface UseTeleprompterPlaybackResult {
  isPlaying: boolean
  currentPosition: number
  toggle: () => void
  reset: () => void
  seek: (position: number) => void
  totalCharacters: number
  totalWords: number
  averageCharsPerWord: number
}

export function useTeleprompterPlayback({
  structure,
  scrollSpeed,
  onComplete
}: UseTeleprompterPlaybackOptions): UseTeleprompterPlaybackResult {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentPosition, setCurrentPosition] = React.useState(0)

  const animationFrameRef = React.useRef<number | null>(null)
  const lastTimestampRef = React.useRef<number | null>(null)

  const totalCharacters = structure?.totalCharacters ?? 0
  const totalWords = structure?.totalWords ?? 0
  const averageCharsPerWord = structure?.averageCharsPerWord ?? 0

  const stopAnimation = React.useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    lastTimestampRef.current = null
  }, [])

  const reset = React.useCallback(() => {
    stopAnimation()
    setIsPlaying(false)
    setCurrentPosition(0)
  }, [stopAnimation])

  const seek = React.useCallback(
    (position: number) => {
      const target = Number.isFinite(position) ? position : 0
      const clamped = Math.max(0, Math.min(totalCharacters, target))
      stopAnimation()
      setCurrentPosition(clamped)
      setIsPlaying(false)
    },
    [stopAnimation, totalCharacters]
  )

  const toggle = React.useCallback(() => {
    if (!structure || totalCharacters === 0) {
      return
    }

    setIsPlaying((previous) => {
      if (!previous && currentPosition >= totalCharacters) {
        setCurrentPosition(0)
      }
      return !previous
    })
  }, [structure, totalCharacters, currentPosition])

  React.useEffect(() => {
    if (
      !isPlaying ||
      !structure ||
      totalCharacters === 0 ||
      scrollSpeed <= 0 ||
      totalWords === 0 ||
      averageCharsPerWord <= 0
    ) {
      stopAnimation()
      return
    }

    const charsPerMinute = scrollSpeed * averageCharsPerWord
    const charsPerMillisecond = charsPerMinute / 60000

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
        animationFrameRef.current = requestAnimationFrame(step)
        return
      }

      const delta = timestamp - lastTimestampRef.current
      lastTimestampRef.current = timestamp

      let reachedEnd = false
      setCurrentPosition((previous) => {
        if (previous >= totalCharacters) {
          reachedEnd = true
          return totalCharacters
        }

        const nextPosition = previous + delta * charsPerMillisecond
        if (nextPosition >= totalCharacters) {
          reachedEnd = true
          return totalCharacters
        }

        return nextPosition
      })

      if (reachedEnd) {
        stopAnimation()
        setIsPlaying(false)
        onComplete?.()
        return
      }

      animationFrameRef.current = requestAnimationFrame(step)
    }

    animationFrameRef.current = requestAnimationFrame(step)

    return () => {
      stopAnimation()
    }
  }, [
    isPlaying,
    structure,
    averageCharsPerWord,
    totalCharacters,
    totalWords,
    scrollSpeed,
    stopAnimation,
    onComplete
  ])

  React.useEffect(() => {
    // If structure becomes null (e.g. speech deselected), ensure playback stops
    if (!structure) {
      reset()
    }
    // Intentionally omitting reset from deps to avoid resetting when only scrollSpeed changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure])

  return {
    isPlaying,
    currentPosition,
    toggle,
    reset,
    seek,
    totalCharacters,
    totalWords,
    averageCharsPerWord
  }
}
