"use client"

import * as React from "react"
import type { Speech, DifficultyLevel } from "@/lib/types"
import {
  DIFFICULTY_DISPLAY_CONFIG,
  READING_THEMES
} from "@/lib/teleprompter-config"
import { buildTeleprompterStructure, type TeleprompterStructure } from "@/lib/teleprompter-structure"
import { getRandomSpeechByDifficulty } from "@/lib/speeches"
import { useTeleprompterPlayback } from "./useTeleprompterPlayback"

export type TeleprompterTheme = keyof typeof READING_THEMES

export interface TeleprompterMetrics {
  completedWords: number
  wordsRemaining: number
  charactersRemaining: number
  estimatedSecondsRemaining: number
  displayMinutesRemaining: number
  displaySecondsRemaining: string
}

export interface TeleprompterController {
  selectedSpeech: Speech | null
  selectedDifficulty: DifficultyLevel
  showSpeechSelector: boolean
  toggleSpeechSelector: () => void
  speechStructure: TeleprompterStructure | null
  isPlaying: boolean
  currentPosition: number
  fontSize: number
  adjustFontSize: (delta: number) => void
  scrollSpeed: number
  updateScrollSpeed: (value: number) => void
  difficultyScrollConfig: {
    min: number
    max: number
    default: number
  }
  teleprompterTheme: TeleprompterTheme
  toggleTeleprompterTheme: () => void
  selectSpeech: (speech: Speech) => void
  selectRandomSpeech: () => void
  togglePlayback: () => void
  resetPlayback: () => void
  seekToPercent: (percent: number) => void
  progressPercent: number
  metrics: TeleprompterMetrics
  totalWords: number
  totalCharacters: number
  averageCharsPerWord: number
}

export function useTeleprompterController(
  initialDifficulty: DifficultyLevel = "beginner"
): TeleprompterController {
  const [selectedSpeech, setSelectedSpeech] = React.useState<Speech | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<DifficultyLevel>(initialDifficulty)
  const [showSpeechSelector, setShowSpeechSelector] = React.useState(true)
  const [fontSize, setFontSize] = React.useState<number>(22)
  const [scrollSpeedState, setScrollSpeedState] = React.useState<number>(
    () => DIFFICULTY_DISPLAY_CONFIG[initialDifficulty].scrollSpeed.default
  )
  const [teleprompterTheme, setTeleprompterTheme] = React.useState<TeleprompterTheme>("dark")

  const difficultyScrollConfig = React.useMemo(
    () => DIFFICULTY_DISPLAY_CONFIG[selectedDifficulty].scrollSpeed,
    [selectedDifficulty]
  )

  const speechStructure = React.useMemo(
    () => buildTeleprompterStructure(selectedSpeech),
    [selectedSpeech]
  )

  const {
    isPlaying,
    currentPosition,
    toggle,
    reset,
    seek,
    totalCharacters,
    totalWords,
    averageCharsPerWord
  } = useTeleprompterPlayback({
    structure: speechStructure,
    scrollSpeed: scrollSpeedState
  })

  React.useEffect(() => {
    setScrollSpeedState(difficultyScrollConfig.default)
  }, [difficultyScrollConfig])

  React.useEffect(() => {
    if (!selectedSpeech || selectedSpeech.difficulty !== selectedDifficulty) {
      const randomSpeech = getRandomSpeechByDifficulty(selectedDifficulty)
      if (randomSpeech) {
        setSelectedSpeech(randomSpeech)
        reset()
      }
    }
  }, [selectedDifficulty, selectedSpeech, reset])

  const toggleSpeechSelector = React.useCallback(() => {
    setShowSpeechSelector((previous) => !previous)
  }, [])

  const adjustFontSize = React.useCallback((delta: number) => {
    setFontSize((previous) => {
      const next = previous + delta
      return Math.max(14, Math.min(36, next))
    })
  }, [])

  const updateScrollSpeed = React.useCallback(
    (value: number) => {
      const { min, max } = difficultyScrollConfig
      if (!Number.isFinite(value)) {
        return
      }
      setScrollSpeedState(Math.min(Math.max(value, min), max))
    },
    [difficultyScrollConfig]
  )

  const toggleTeleprompterTheme = React.useCallback(() => {
    setTeleprompterTheme((previous) => (previous === "dark" ? "light" : "dark"))
  }, [])

  const selectSpeech = React.useCallback(
    (speech: Speech) => {
      setSelectedSpeech(speech)
      setSelectedDifficulty(speech.difficulty)
      reset()
      setShowSpeechSelector(false)
    },
    [reset]
  )

  const selectRandomSpeech = React.useCallback(() => {
    const randomSpeech = getRandomSpeechByDifficulty(selectedDifficulty)
    if (randomSpeech) {
      setSelectedSpeech(randomSpeech)
      reset()
    }
  }, [selectedDifficulty, reset])

  const togglePlayback = React.useCallback(() => {
    if (!speechStructure || totalCharacters === 0) {
      return
    }
    toggle()
  }, [speechStructure, totalCharacters, toggle])

  const resetPlayback = React.useCallback(() => {
    reset()
  }, [reset])

  const seekToPercent = React.useCallback(
    (percent: number) => {
      if (!Number.isFinite(percent) || totalCharacters === 0) {
        return
      }
      const normalized = Math.max(0, Math.min(percent, 100))
      const newPosition = (normalized / 100) * totalCharacters
      seek(newPosition)
    },
    [seek, totalCharacters]
  )

  const completedWords = React.useMemo(() => {
    if (!speechStructure || totalWords === 0) {
      return 0
    }

    if (currentPosition <= 0) {
      return 0
    }

    if (currentPosition >= totalCharacters) {
      return totalWords
    }

    const words = speechStructure.words
    let completedCount = 0
    for (let index = 0; index < words.length; index += 1) {
      const word = words[index]
      if (currentPosition >= word.startChar + word.length) {
        completedCount = index + 1
      } else {
        break
      }
    }
    return completedCount
  }, [speechStructure, currentPosition, totalCharacters, totalWords])

  const progressPercent = React.useMemo(() => {
    if (totalCharacters === 0) {
      return 0
    }
    const clamped = Math.min(currentPosition, totalCharacters)
    return Math.min(100, Math.round((clamped / totalCharacters) * 100))
  }, [currentPosition, totalCharacters])

  const wordsRemaining = React.useMemo(() => {
    if (totalWords === 0) {
      return 0
    }
    return Math.max(0, totalWords - completedWords)
  }, [totalWords, completedWords])

  const charactersRemaining = React.useMemo(() => {
    if (totalCharacters === 0) {
      return 0
    }
    return Math.max(0, totalCharacters - currentPosition)
  }, [totalCharacters, currentPosition])

  const charsPerSecond = React.useMemo(() => {
    if (scrollSpeedState <= 0 || averageCharsPerWord <= 0) {
      return 0
    }
    return (scrollSpeedState * averageCharsPerWord) / 60
  }, [scrollSpeedState, averageCharsPerWord])

  const estimatedSecondsRemaining = React.useMemo(() => {
    if (charsPerSecond <= 0) {
      return 0
    }
    return Math.ceil(charactersRemaining / charsPerSecond)
  }, [charactersRemaining, charsPerSecond])

  const displayMinutesRemaining = Math.floor(estimatedSecondsRemaining / 60)
  const displaySecondsRemaining = String(estimatedSecondsRemaining % 60).padStart(2, "0")

  return {
    selectedSpeech,
    selectedDifficulty,
    showSpeechSelector,
    toggleSpeechSelector,
    speechStructure,
    isPlaying,
    currentPosition,
    fontSize,
    adjustFontSize,
    scrollSpeed: scrollSpeedState,
    updateScrollSpeed,
    difficultyScrollConfig,
    teleprompterTheme,
    toggleTeleprompterTheme,
    selectSpeech,
    selectRandomSpeech,
    togglePlayback,
    resetPlayback,
    seekToPercent,
    progressPercent,
    metrics: {
      completedWords,
      wordsRemaining,
      charactersRemaining,
      estimatedSecondsRemaining,
      displayMinutesRemaining,
      displaySecondsRemaining
    },
    totalWords,
    totalCharacters,
    averageCharsPerWord
  }
}
