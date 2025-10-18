"use client"

import * as React from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Speech, DifficultyLevel, SpeechCategory } from "@/lib/types"
import {
  getAllSpeeches,
  getSpeechesByDifficulty,
  // getSpeechesByCategory, // Currently unused
  getRandomSpeech,
  getRandomSpeechByDifficulty,
  getAvailableCategories
} from "@/lib/speeches"

interface SpeechSelectorProps {
  selectedSpeech?: Speech | null
  onSpeechSelect: (speech: Speech) => void
  className?: string
  difficulty?: DifficultyLevel
  category?: SpeechCategory
}

const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-900/35 text-emerald-200 border-emerald-400/50",
  intermediate: "bg-lime-900/35 text-lime-200 border-lime-400/50",
  advanced: "bg-amber-900/35 text-amber-200 border-amber-400/50"
}

const DIFFICULTY_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
}

const startCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const createExcerpt = (text: string, maxChars = 200) => {
  if (text.length <= maxChars) {
    return text
  }

  const truncated = text.slice(0, maxChars)
  const safeCutIndex = truncated.lastIndexOf(" ")

  if (safeCutIndex === -1) {
    return `${truncated}…`
  }

  return `${truncated.slice(0, safeCutIndex)}…`
}

const listItemVariants: Variants = {
  initial: (index: number) => ({
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: Math.min(index * 0.04, 0.2)
    }
  }),
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      delay: Math.min(index * 0.04, 0.2)
    }
  }),
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

export function SpeechSelector({
  selectedSpeech,
  onSpeechSelect,
  className,
  difficulty,
  category,
  ...props
}: SpeechSelectorProps) {
  const [filteredSpeeches, setFilteredSpeeches] = React.useState<Speech[]>([])
  const [currentDifficulty, setCurrentDifficulty] = React.useState<DifficultyLevel | undefined>(difficulty)
  const [currentCategory, setCurrentCategory] = React.useState<SpeechCategory | undefined>(category)

  // Get available categories
  const availableCategories = React.useMemo(() => getAvailableCategories(), [])

  // Sync with difficulty prop changes from parent
  React.useEffect(() => {
    setCurrentDifficulty(difficulty)
  }, [difficulty])

  // Sync with category prop changes from parent
  React.useEffect(() => {
    setCurrentCategory(category)
  }, [category])

  // Filter speeches based on current filters
  React.useEffect(() => {
    let speeches = getAllSpeeches()

    if (currentDifficulty) {
      speeches = getSpeechesByDifficulty(currentDifficulty)
    }

    if (currentCategory) {
      speeches = speeches.filter(speech => speech.category === currentCategory)
    }

    setFilteredSpeeches(speeches)
  }, [currentDifficulty, currentCategory])

  const handleRandomSpeech = () => {
    let randomSpeech: Speech | null = null

    if (currentDifficulty) {
      randomSpeech = getRandomSpeechByDifficulty(currentDifficulty)
    } else {
      randomSpeech = getRandomSpeech()
    }

    if (randomSpeech) {
      onSpeechSelect(randomSpeech)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Filter Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select a Speech</h3>
          <Button 
            onClick={handleRandomSpeech}
            variant="outline"
            size="sm"
            className="gap-2 text-sm"
          >
            <Shuffle className="size-4" />
            Random
          </Button>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty Level</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentDifficulty === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentDifficulty(undefined)}
            >
              All
            </Button>
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((level) => (
              <Button
                key={level}
                variant={currentDifficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentDifficulty(level)}
                className="text-xs"
              >
                {DIFFICULTY_LABELS[level]}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentCategory(undefined)}
            >
              All
            </Button>
            {availableCategories.map((cat) => (
              <Button
                key={cat}
                variant={currentCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentCategory(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <Separator />
      </div>

      {/* Speech List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredSpeeches.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>No speeches found with the current filters.</p>
              <p className="text-sm mt-1">Try adjusting your filters or selecting &quot;All&quot;.</p>
            </motion.div>
          ) : (
            filteredSpeeches.map((speech, index) => {
              const metadata = [
                `${speech.wordCount.toLocaleString()} words`,
                formatDuration(speech.estimatedDuration),
                startCase(speech.category)
              ]
              const contentExcerpt = createExcerpt(speech.content)

              return (
                <motion.div
                  key={speech.id}
                  layout="position"
                  variants={listItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                >
                  <Card
                    className={cn(
                      "group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card/70 transition-all duration-200 hover:border-primary/50 hover:bg-card/80 hover:shadow-md",
                      selectedSpeech?.id === speech.id && "border-primary ring-2 ring-primary/80"
                    )}
                    onClick={() => onSpeechSelect(speech)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1">
                          <CardTitle className="text-base font-medium leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
                            {speech.title}
                          </CardTitle>
                          {speech.author && (
                            <CardDescription className="text-sm text-muted-foreground/80">
                              by {speech.author}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                              DIFFICULTY_COLORS[speech.difficulty]
                            )}
                          >
                            {DIFFICULTY_LABELS[speech.difficulty]}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/90 mt-2">
                        {metadata.map((item, metadataIndex) => (
                          <React.Fragment key={`${speech.id}-${item}`}>
                            {metadataIndex > 0 && (
                              <span
                                aria-hidden="true"
                                className="hidden h-1 w-1 rounded-full bg-border/60 sm:inline-flex"
                              />
                            )}
                            <span>{item}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {contentExcerpt}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
