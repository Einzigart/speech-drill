import * as React from "react"
import { cn } from "@/lib/utils"
import type { TeleprompterParagraph, TeleprompterWord } from "../hooks/useSpeechProgress"
import type { TeleprompterThemeColors } from "../types"
import type { TeleprompterThemeVisuals } from "../styles"

interface TeleprompterContentProps {
  paragraphs: TeleprompterParagraph[]
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  themeColors: TeleprompterThemeColors
  responsiveFontSize: number
  fullscreen?: boolean
  activeWordIndex: number
  activeWordRef: React.MutableRefObject<HTMLSpanElement | null>
  autoFit: boolean
  activeWordProgress: number
  themeVisuals: TeleprompterThemeVisuals
}

export function TeleprompterContent({
  paragraphs,
  scrollContainerRef,
  themeColors,
  responsiveFontSize,
  fullscreen = false,
  activeWordIndex,
  activeWordRef,
  autoFit,
  activeWordProgress,
  themeVisuals
}: TeleprompterContentProps) {
  return (
    <div ref={scrollContainerRef} className="px-6 pt-3 pb-16 h-full overflow-y-auto">
      <div
        className={cn(
          "max-w-none transition-all duration-200 leading-relaxed",
          fullscreen && "px-8 py-4"
        )}
        style={{
          fontSize: `${responsiveFontSize}px`,
          lineHeight: "var(--teleprompter-line-height, 1.8)",
          letterSpacing: "var(--teleprompter-letter-spacing, 0.025em)",
          wordSpacing: "var(--teleprompter-word-spacing, 0.1em)",
          maxWidth: autoFit ? "100%" : "var(--teleprompter-max-width, 65ch)",
          margin: "0 auto",
          wordBreak: "normal",
          overflowWrap: "break-word",
          hyphens: "none",
          textAlign: "left",
          wordWrap: "break-word"
        }}
      >
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.paragraphIndex}
            className={cn("transition-colors duration-200", themeColors.text, "font-medium")}
            style={{
              marginBottom: "var(--teleprompter-paragraph-spacing, 1.5em)"
            }}
          >
            {paragraph.words.map((word: TeleprompterWord) => {
              const isActiveWord = activeWordIndex !== -1 && word.wordIndex === activeWordIndex
              const isCompletedWord = activeWordIndex !== -1 && word.wordIndex < activeWordIndex
              const displayWord = word.displayText
              const baseWordClass = cn(
                "inline transition-colors duration-150",
                isCompletedWord ? themeColors.text : cn(themeColors.muted, "opacity-75")
              )

              if (!isActiveWord) {
                return (
                  <span key={word.wordIndex} className={baseWordClass}>{displayWord}</span>
                )
              }

              const clampedProgress = Math.max(0, Math.min(1, activeWordProgress))
              const caretPercent = Math.min(clampedProgress, 1) * 100

              return (
                <span
                  key={word.wordIndex}
                  className="relative inline-block align-baseline"
                  ref={activeWordRef}
                  style={{ whiteSpace: "pre" }}
                >
                  <span
                    className={cn("transition-colors duration-150", themeColors.muted, "opacity-75")}
                    style={{ whiteSpace: "pre" }}
                  >
                    {displayWord}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    aria-hidden="true"
                    style={{
                      width: `${caretPercent}%`,
                      willChange: "width",
                      transform: "translateZ(0)"
                    }}
                  >
                    <span className={cn("transition-colors duration-150", themeColors.text)} style={{ whiteSpace: "pre" }}>
                      {displayWord}
                    </span>
                  </span>
                  <span
                    className="absolute top-[18%] bottom-[18%] z-30 w-[2px] rounded-full"
                    style={{
                      left: `${caretPercent}%`,
                      transform: "translateX(-50%) translateZ(0)",
                      backgroundColor: themeVisuals.caretColor,
                      boxShadow: themeVisuals.caretShadow,
                      willChange: "left"
                    }}
                    aria-hidden="true"
                  />
                </span>
              )
            })}
          </p>
        ))}
      </div>
    </div>
  )
}
