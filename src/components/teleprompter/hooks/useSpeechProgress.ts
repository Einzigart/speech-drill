import * as React from "react"
import { Speech } from "@/lib/types"
import { buildTeleprompterStructure, TeleprompterParagraphMeta, TeleprompterWordMeta } from "@/lib/teleprompter-structure"

const EMPTY_PARAGRAPHS: TeleprompterParagraphMeta[] = []
const EMPTY_WORDS: TeleprompterWordMeta[] = []

export type TeleprompterParagraph = TeleprompterParagraphMeta
export type TeleprompterWord = TeleprompterWordMeta

interface UseSpeechProgressOptions {
  speech: Speech | null
  currentPosition: number
}

export function useSpeechProgress({
  speech,
  currentPosition
}: UseSpeechProgressOptions) {
  const structure = React.useMemo(() => buildTeleprompterStructure(speech), [speech])

  const paragraphs = structure ? structure.paragraphs : EMPTY_PARAGRAPHS
  const words = structure ? structure.words : EMPTY_WORDS
  const totalWords = structure?.totalWords ?? 0
  const totalCharacters = structure?.totalCharacters ?? 0

  const normalizedPosition = React.useMemo(() => {
    if (typeof currentPosition !== "number" || !Number.isFinite(currentPosition)) {
      return 0
    }
    return currentPosition
  }, [currentPosition])

  const clampedPosition = React.useMemo(() => {
    if (totalCharacters === 0) {
      return 0
    }
    return Math.min(Math.max(normalizedPosition, 0), totalCharacters)
  }, [normalizedPosition, totalCharacters])

  const activeWordIndex = React.useMemo(() => {
    if (totalCharacters === 0) {
      return -1
    }

    if (clampedPosition >= totalCharacters) {
      return -1
    }

    for (let index = 0; index < words.length; index += 1) {
      const word = words[index]
      if (clampedPosition < word.startChar + word.length) {
        return index
      }
    }

    return -1
  }, [clampedPosition, words, totalCharacters])

  const activeWord = activeWordIndex === -1 ? null : words[activeWordIndex]

  const activeWordProgress = React.useMemo(() => {
    if (!activeWord) {
      return 1
    }

    if (activeWord.length === 0) {
      return 1
    }

    const rawProgress = (clampedPosition - activeWord.startChar) / activeWord.length
    return Math.min(Math.max(rawProgress, 0), 1)
  }, [activeWord, clampedPosition])

  const progress = React.useMemo(() => {
    if (totalCharacters === 0) {
      return 0
    }

    return Math.min(clampedPosition / totalCharacters, 1)
  }, [clampedPosition, totalCharacters])

  return {
    paragraphs,
    words,
    totalWords,
    totalCharacters,
    activeWordIndex,
    activeWordProgress,
    progress
  }
}
