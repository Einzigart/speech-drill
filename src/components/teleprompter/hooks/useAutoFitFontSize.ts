import * as React from "react"
import { Speech } from "@/lib/types"
import { calculateOptimalFontSize } from "@/lib/teleprompter-config"

interface UseAutoFitFontSizeOptions {
  autoFit: boolean
  speech: Speech | null
  fontSize?: number
  baseFontSize: number
}

export function useAutoFitFontSize({
  autoFit,
  speech,
  fontSize,
  baseFontSize
}: UseAutoFitFontSizeOptions) {
  const displayRef = React.useRef<HTMLDivElement>(null)
  const [containerDimensions, setContainerDimensions] = React.useState({ width: 0, height: 0 })
  const [dynamicFontSize, setDynamicFontSize] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!autoFit || !speech || !displayRef.current) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      const { width, height } = entry.contentRect
      setContainerDimensions((previous) => {
        if (previous.width === width && previous.height === height) {
          return previous
        }
        return { width, height }
      })
    })

    observer.observe(displayRef.current)
    return () => observer.disconnect()
  }, [autoFit, speech])

  React.useEffect(() => {
    if (!autoFit || !speech || containerDimensions.width === 0) {
      return
    }

    const optimalFontSize = calculateOptimalFontSize(
      speech.content,
      containerDimensions.width,
      containerDimensions.height,
      baseFontSize
    )

    setDynamicFontSize(optimalFontSize)
  }, [autoFit, speech, containerDimensions.width, containerDimensions.height, baseFontSize])

  const responsiveFontSize = React.useMemo(() => {
    if (fontSize) {
      return fontSize
    }

    if (!autoFit || dynamicFontSize === null) {
      return baseFontSize
    }

    return dynamicFontSize
  }, [fontSize, autoFit, dynamicFontSize, baseFontSize])

  return {
    displayRef,
    responsiveFontSize
  }
}
