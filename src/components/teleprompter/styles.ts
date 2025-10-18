import { READING_THEMES } from "@/lib/teleprompter-config"

export type TeleprompterThemeName = keyof typeof READING_THEMES

export type TeleprompterThemeVisuals = {
  highlightFill: string
  caretColor: string
  caretShadow: string
}

const THEME_VISUALS: Record<TeleprompterThemeName, TeleprompterThemeVisuals> = {
  dark: {
    highlightFill: "rgba(59, 130, 246, 0.18)",
    caretColor: "rgba(147, 197, 253, 0.95)",
    caretShadow: "0 0 18px rgba(59, 130, 246, 0.55)"
  },
  light: {
    highlightFill: "rgba(17, 24, 39, 0.12)",
    caretColor: "rgba(30, 64, 175, 0.9)",
    caretShadow: "0 0 14px rgba(30, 64, 175, 0.35)"
  }
}

export function getThemeVisuals(theme: TeleprompterThemeName): TeleprompterThemeVisuals {
  return THEME_VISUALS[theme] ?? THEME_VISUALS.dark
}
