"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Leaf, Mountain, Sprout } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DifficultyLevel } from "@/lib/types"
import { DIFFICULTY_DISPLAY_CONFIG } from "@/lib/teleprompter-config"

interface DifficultySelectorProps {
  selectedDifficulty?: DifficultyLevel
  onDifficultySelect: (difficulty: DifficultyLevel) => void
  className?: string
  showDetails?: boolean
}

type DifficultyInfo = {
  title: string
  description: string
  icon: LucideIcon
  buttonClass: string
  cardClass: string
  titleClass: string
  features: string[]
}

const DIFFICULTY_INFO: Record<DifficultyLevel, DifficultyInfo> = {
  beginner: {
    title: "Beginner",
    description: "Simple vocabulary and short sentences",
    icon: Sprout,
    buttonClass: "border-emerald-500/30 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-900/40",
    cardClass: "border-emerald-500/35 bg-emerald-950/25 hover:border-emerald-400/45",
    titleClass: "text-emerald-200",
    features: [
      "120-180 words",
      "Simple vocabulary",
      "Short sentences",
      "Default 90 WPM · adjustable 50-200"
    ]
  },
  intermediate: {
    title: "Intermediate", 
    description: "Mixed complexity with varied sentence length",
    icon: Leaf,
    buttonClass: "border-lime-500/30 bg-lime-950/30 text-lime-200 hover:bg-lime-900/35",
    cardClass: "border-lime-500/35 bg-lime-950/25 hover:border-lime-400/45",
    titleClass: "text-lime-200",
    features: [
      "150-200 words",
      "Mixed vocabulary",
      "Varied sentences",
      "Default 115 WPM · adjustable 50-200"
    ]
  },
  advanced: {
    title: "Advanced",
    description: "Complex vocabulary and professional topics",
    icon: Mountain,
    buttonClass: "border-amber-500/30 bg-amber-950/30 text-amber-200 hover:bg-amber-900/35", 
    cardClass: "border-amber-500/35 bg-amber-950/25 hover:border-amber-400/45",
    titleClass: "text-amber-200",
    features: [
      "180-250 words",
      "Complex vocabulary",
      "Long sentences",
      "Default 150 WPM · adjustable 50-200"
    ]
  }
}

export function DifficultySelector({
  selectedDifficulty,
  onDifficultySelect,
  className,
  showDetails = true,
  ...props
}: DifficultySelectorProps) {
  const SelectedIcon = selectedDifficulty
    ? DIFFICULTY_INFO[selectedDifficulty].icon
    : null

  if (!showDetails) {
    // Compact button version
    return (
      <div className={cn("flex gap-2", className)} {...props}>
        {(Object.keys(DIFFICULTY_INFO) as DifficultyLevel[]).map((difficulty) => {
          const info = DIFFICULTY_INFO[difficulty]
          const isSelected = selectedDifficulty === difficulty
          const Icon = info.icon

          return (
            <Button
              key={difficulty}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onDifficultySelect(difficulty)}
              className={cn(
                "flex items-center gap-2",
                !isSelected && info.buttonClass
              )}
            >
              <Icon className="size-4" />
              {info.title}
            </Button>
          )
        })}
      </div>
    )
  }

  // Detailed card version
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <h3 className="text-lg font-semibold">Choose Difficulty Level</h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(DIFFICULTY_INFO) as DifficultyLevel[]).map((difficulty) => {
          const info = DIFFICULTY_INFO[difficulty]
          const config = DIFFICULTY_DISPLAY_CONFIG[difficulty]
          const isSelected = selectedDifficulty === difficulty
          const Icon = info.icon

          return (
            <Card
              key={difficulty}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                isSelected ? "ring-2 ring-primary ring-offset-2 border-primary" : info.cardClass
              )}
              onClick={() => onDifficultySelect(difficulty)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary",
                      isSelected && "bg-primary/20"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className={cn("text-lg", isSelected ? "text-primary" : info.titleClass)}>
                      {info.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {info.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {info.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-current rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Default Speed:</span>
                    <span>{config.scrollSpeed.default} WPM</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Speed Range:</span>
                    <span>{config.scrollSpeed.min}-{config.scrollSpeed.max} WPM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {selectedDifficulty && (
        <div className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Selected Difficulty</h4>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              {SelectedIcon && <SelectedIcon className="size-5" />}
            </div>
            <div>
              <p className="font-medium">{DIFFICULTY_INFO[selectedDifficulty].title}</p>
              <p className="text-sm text-muted-foreground">
                {DIFFICULTY_INFO[selectedDifficulty].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
