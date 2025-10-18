/**
 * Teleprompter configuration and styling utilities
 */

import { DifficultyLevel } from './types'

export interface TeleprompterConfig {
  fontSize: {
    mobile: number
    tablet: number
    desktop: number
  }
  lineHeight: number
  letterSpacing: number
  wordSpacing: number
  paragraphSpacing: number
  maxWidth: string
}

export interface DifficultyDisplayConfig {
  fontSize: TeleprompterConfig['fontSize']
  lineHeight: number
  wordHighlightIntensity: number
  scrollSpeed: {
    min: number
    max: number
    default: number
  }
}

// Base teleprompter configuration
export const TELEPROMPTER_CONFIG: TeleprompterConfig = {
  fontSize: {
    mobile: 18,
    tablet: 20,
    desktop: 22
  },
  lineHeight: 1.8,
  letterSpacing: 0.025,
  wordSpacing: 0.1,
  paragraphSpacing: 1.5,
  maxWidth: '65ch' // Optimal reading width
}

// Difficulty-specific display configurations
export const DIFFICULTY_DISPLAY_CONFIG: Record<DifficultyLevel, DifficultyDisplayConfig> = {
  beginner: {
    fontSize: {
      mobile: 20,
      tablet: 22,
      desktop: 24
    },
    lineHeight: 2.0,
    wordHighlightIntensity: 0.3,
    scrollSpeed: {
      min: 50,
      max: 200,
      default: 90
    }
  },
  intermediate: {
    fontSize: {
      mobile: 19,
      tablet: 21,
      desktop: 23
    },
    lineHeight: 1.9,
    wordHighlightIntensity: 0.25,
    scrollSpeed: {
      min: 50,
      max: 200,
      default: 115
    }
  },
  advanced: {
    fontSize: {
      mobile: 18,
      tablet: 20,
      desktop: 22
    },
    lineHeight: 1.8,
    wordHighlightIntensity: 0.2,
    scrollSpeed: {
      min: 50,
      max: 200,
      default: 150
    }
  }
}

// Typography classes for different screen sizes
export const RESPONSIVE_TYPOGRAPHY = {
  mobile: 'text-lg leading-relaxed',
  tablet: 'md:text-xl md:leading-relaxed',
  desktop: 'lg:text-2xl lg:leading-relaxed'
}

// Color schemes for different reading modes
export const READING_THEMES = {
  dark: {
    background: 'bg-zinc-950',
    text: 'text-zinc-50',
    highlight: 'bg-primary/25 text-primary-foreground',
    muted: 'text-zinc-300',
    border: 'border-zinc-800'
  },
  light: {
    background: 'bg-white',
    text: 'text-zinc-900',
    highlight: 'bg-zinc-900/10 text-zinc-900',
    muted: 'text-zinc-500',
    border: 'border-zinc-200'
  }
}

/**
 * Get responsive font size based on difficulty and screen size
 */
export function getResponsiveFontSize(
  difficulty: DifficultyLevel,
  screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): number {
  return DIFFICULTY_DISPLAY_CONFIG[difficulty].fontSize[screenSize]
}

/**
 * Get line height for difficulty level
 */
export function getLineHeight(difficulty: DifficultyLevel): number {
  return DIFFICULTY_DISPLAY_CONFIG[difficulty].lineHeight
}

/**
 * Get word highlight intensity for difficulty level
 */
export function getHighlightIntensity(difficulty: DifficultyLevel): number {
  return DIFFICULTY_DISPLAY_CONFIG[difficulty].wordHighlightIntensity
}

/**
 * Calculate optimal font size based on content and container dimensions
 */
export function calculateOptimalFontSize(
  content: string,
  containerWidth: number,
  containerHeight: number,
  baseFontSize: number
): number {
  // Constants for calculation
  const MIN_FONT_SIZE = 12
  const MAX_FONT_SIZE = 48
  const PADDING = 48 // Account for padding in container
  const LINE_HEIGHT_RATIO = 1.8

  // Calculate available space
  const availableWidth = containerWidth - PADDING
  const availableHeight = containerHeight - PADDING - 120 // Account for header and controls

  if (availableWidth <= 0 || availableHeight <= 0) {
    return baseFontSize
  }

  // Estimate characters per line based on average character width
  const avgCharWidth = 0.55 // More accurate ratio for most fonts
  const wordsCount = content.split(/\s+/).length
  const avgWordLength = content.replace(/\s+/g, '').length / wordsCount
  // Add space for word spacing
  const avgWordsPerLine = Math.floor(availableWidth / (baseFontSize * avgCharWidth * (avgWordLength + 1)))

  if (avgWordsPerLine <= 0) {
    return MIN_FONT_SIZE
  }

  // Calculate required lines
  const requiredLines = Math.ceil(wordsCount / avgWordsPerLine)
  const requiredHeight = requiredLines * baseFontSize * LINE_HEIGHT_RATIO

  // Adjust font size if content doesn't fit
  let optimalFontSize = baseFontSize
  if (requiredHeight > availableHeight) {
    // Scale down font size to fit content
    optimalFontSize = Math.floor((availableHeight / requiredLines) / LINE_HEIGHT_RATIO)
  } else if (requiredHeight < availableHeight * 0.6) {
    // Scale up font size if there's too much empty space
    const scaleFactor = Math.min(1.5, availableHeight / requiredHeight)
    optimalFontSize = Math.floor(baseFontSize * scaleFactor)
  }

  // Ensure font size is within bounds
  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, optimalFontSize))
}

/**
 * Generate CSS custom properties for teleprompter styling
 */
export function getTeleprompterCSSProperties(
  difficulty: DifficultyLevel,
  customFontSize?: number,
  theme: keyof typeof READING_THEMES = 'dark'
) {
  const config = DIFFICULTY_DISPLAY_CONFIG[difficulty]
  const fontSize = customFontSize || config.fontSize.desktop

  return {
    '--teleprompter-font-size': `${fontSize}px`,
    '--teleprompter-line-height': config.lineHeight,
    '--teleprompter-letter-spacing': `${TELEPROMPTER_CONFIG.letterSpacing}em`,
    '--teleprompter-word-spacing': `${TELEPROMPTER_CONFIG.wordSpacing}em`,
    '--teleprompter-paragraph-spacing': `${TELEPROMPTER_CONFIG.paragraphSpacing}em`,
    '--teleprompter-max-width': TELEPROMPTER_CONFIG.maxWidth,
    '--teleprompter-highlight-intensity': config.wordHighlightIntensity,
    '--teleprompter-theme': theme
  } as React.CSSProperties
}
