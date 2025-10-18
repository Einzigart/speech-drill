import { Speech } from "./types"

export type TeleprompterWordMeta = {
  text: string
  displayText: string
  startChar: number
  length: number
  paragraphIndex: number
  wordIndex: number
}

export type TeleprompterParagraphMeta = {
  paragraphIndex: number
  words: TeleprompterWordMeta[]
}

export type TeleprompterStructure = {
  paragraphs: TeleprompterParagraphMeta[]
  words: TeleprompterWordMeta[]
  totalWords: number
  totalCharacters: number
  averageCharsPerWord: number
}

export function buildTeleprompterStructure(speech: Speech | null): TeleprompterStructure | null {
  if (!speech) {
    return null
  }

  const normalizedContent = speech.content.replace(/\r\n/g, "\n")
  const rawParagraphs = normalizedContent.split(/\n{2,}/)
  const paragraphSources = rawParagraphs
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)

  let runningCharIndex = 0
  let globalWordIndex = 0
  const paragraphs: TeleprompterParagraphMeta[] = []

  paragraphSources.forEach((paragraphText, paragraphIndex) => {
    const tokens = paragraphText.split(/\s+/).filter(Boolean)
    if (tokens.length === 0) {
      return
    }

    const isLastParagraph = paragraphIndex === paragraphSources.length - 1
    const words: TeleprompterWordMeta[] = tokens.map((token, tokenIndex) => {
      const isLastWordInParagraph = tokenIndex === tokens.length - 1
      const isLastWordOverall = isLastParagraph && isLastWordInParagraph
      const displayText = isLastWordOverall ? token : `${token} `
      const wordMeta: TeleprompterWordMeta = {
        text: token,
        displayText,
        startChar: runningCharIndex,
        length: displayText.length,
        paragraphIndex,
        wordIndex: globalWordIndex
      }
      runningCharIndex += wordMeta.length
      globalWordIndex += 1
      return wordMeta
    })

    paragraphs.push({
      paragraphIndex,
      words
    })
  })

  const words = paragraphs.flatMap((paragraph) => paragraph.words)
  const totalWords = words.length
  const totalCharacters = runningCharIndex
  const averageCharsPerWord = totalWords === 0 ? 0 : totalCharacters / totalWords

  return {
    paragraphs,
    words,
    totalWords,
    totalCharacters,
    averageCharsPerWord
  }
}
