"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Moon,
  PauseCircle,
  PlayCircle,
  Plus,
  RotateCcw,
  Shuffle,
  SidebarClose,
  SidebarOpen,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TeleprompterDisplay } from "@/components/teleprompter/TeleprompterDisplay";
import { SpeechSelector } from "@/components/speech/SpeechSelector";
import {
  useTeleprompterController,
  type TeleprompterController,
} from "@/components/teleprompter/hooks/useTeleprompterController";
import { cn } from "@/lib/utils";
import type { Speech } from "@/lib/types";

export function TeleprompterWorkspace() {
  const controller = useTeleprompterController();
  const [isSpeechSelectorMounted, setIsSpeechSelectorMounted] =
    React.useState(true);

  React.useEffect(() => {
    if (controller.showSpeechSelector) {
      setIsSpeechSelectorMounted(true);
    }
  }, [controller.showSpeechSelector]);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.setAttribute(
      "data-theme",
      controller.teleprompterTheme,
    );
  }, [controller.teleprompterTheme]);

  const gridColumns =
    controller.showSpeechSelector || isSpeechSelectorMounted
      ? "lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]"
      : "lg:grid-cols-1";

  return (
    <div className="relative min-h-screen transition-theme">
      <WorkspaceHeader
        fontSize={controller.fontSize}
        adjustFontSize={controller.adjustFontSize}
        teleprompterTheme={controller.teleprompterTheme}
        toggleTeleprompterTheme={controller.toggleTeleprompterTheme}
        showSpeechSelector={controller.showSpeechSelector}
        toggleSpeechSelector={controller.toggleSpeechSelector}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <div className={cn("grid gap-4 sm:gap-6", gridColumns)}>
          <motion.section
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  controller.selectedSpeech
                    ? `teleprompter-${controller.selectedSpeech.id}`
                    : "teleprompter-empty"
                }
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <TeleprompterDisplay
                  speech={controller.selectedSpeech}
                  fontSize={controller.fontSize}
                  isPlaying={controller.isPlaying}
                  currentPosition={controller.currentPosition}
                  className="min-h-[420px] sm:min-h-[520px] rounded-xl sm:rounded-2xl border border-border/60 bg-card/90 shadow-xl backdrop-blur-xl transition-theme"
                  theme={controller.teleprompterTheme}
                  autoFit
                />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={
                  controller.selectedSpeech
                    ? `controls-${controller.selectedSpeech.id}`
                    : "controls-empty"
                }
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ControlsCard controller={controller} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!controller.selectedSpeech && (
                <motion.div
                  key="workspace-welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <WelcomeCard />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          <AnimatePresence
            mode="popLayout"
            onExitComplete={() => {
              setIsSpeechSelectorMounted(false);
            }}
          >
            {controller.showSpeechSelector && (
              <motion.aside
                key="teleprompter-sidebar"
                className="space-y-4 sm:space-y-6"
                style={{ transformOrigin: "top right" }}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0, scale: 0.94, y: 20 },
                  animate: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 240,
                      damping: 26,
                    },
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.96,
                    y: 16,
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                <LibraryCard
                  selectedSpeech={controller.selectedSpeech}
                  selectedDifficulty={controller.selectedDifficulty}
                  onSpeechSelect={controller.selectSpeech}
                />

                <SessionNotesCard />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface WorkspaceHeaderProps {
  fontSize: number;
  adjustFontSize: (delta: number) => void;
  teleprompterTheme: TeleprompterController["teleprompterTheme"];
  toggleTeleprompterTheme: () => void;
  showSpeechSelector: boolean;
  toggleSpeechSelector: () => void;
}

function WorkspaceHeader({
  fontSize,
  adjustFontSize,
  teleprompterTheme,
  toggleTeleprompterTheme,
  showSpeechSelector,
  toggleSpeechSelector,
}: WorkspaceHeaderProps) {
  const ThemeToggleIcon = teleprompterTheme === "dark" ? Sun : Moon;
  const themeToggleLabel =
    teleprompterTheme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-secondary/70 backdrop-blur-xl transition-theme">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-primary sm:gap-2 sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.3em]">
              <Sparkles className="size-2.5 sm:size-4" />
              <span className="hidden sm:inline">Practice studio</span>
              <span className="sm:hidden">Studio</span>
            </span>
            <div className="flex items-center gap-1.5 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => adjustFontSize(-2)}
                disabled={fontSize <= 14}
                aria-label="Decrease font size"
              >
                <Minus className="size-3" />
              </Button>
              <span className="min-w-[2.5rem] text-center text-xs font-medium text-muted-foreground">
                {fontSize}px
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => adjustFontSize(2)}
                disabled={fontSize >= 36}
                aria-label="Increase font size"
              >
                <Plus className="size-3" />
              </Button>
              <div className="mx-0.5 h-5 w-px bg-border/60" aria-hidden />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={themeToggleLabel}
                onClick={toggleTeleprompterTheme}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={teleprompterTheme}
                    initial={{ opacity: 0, rotate: -12, scale: 0.88 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 12, scale: 0.88 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    <ThemeToggleIcon className="size-3.5" />
                  </motion.span>
                </AnimatePresence>
              </Button>
              <div className="mx-0.5 h-5 w-px bg-border/60" aria-hidden />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={toggleSpeechSelector}
              >
                {showSpeechSelector ? (
                  <SidebarClose className="size-3" />
                ) : (
                  <SidebarOpen className="size-3" />
                )}
                <span>{showSpeechSelector ? "Hide" : "Show"}</span>
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground whitespace-nowrap sm:text-2xl lg:text-3xl">
              Teleprompter workspace
            </h1>
          </div>
        </div>

        <div className="hidden w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end lg:flex">
          <div className="flex items-center justify-between gap-2 rounded-full border border-border/60 bg-card/80 px-2 py-1.5 shadow-sm sm:justify-end sm:px-3 sm:py-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 sm:size-8"
              onClick={() => adjustFontSize(-2)}
              disabled={fontSize <= 14}
              aria-label="Decrease font size"
            >
              <Minus className="size-3 sm:size-4" />
            </Button>
            <span className="min-w-[3.25rem] text-center text-xs font-medium text-muted-foreground sm:text-sm">
              {fontSize}px
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 sm:size-8"
              onClick={() => adjustFontSize(2)}
              disabled={fontSize >= 36}
              aria-label="Increase font size"
            >
              <Plus className="size-3 sm:size-4" />
            </Button>
            <div className="h-5 w-px bg-border/60 sm:h-6" aria-hidden />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 sm:size-8"
              aria-label={themeToggleLabel}
              onClick={toggleTeleprompterTheme}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={teleprompterTheme}
                  initial={{ opacity: 0, rotate: -12, scale: 0.88 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 12, scale: 0.88 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <ThemeToggleIcon className="size-3 sm:size-4" />
                </motion.span>
              </AnimatePresence>
            </Button>
            <div className="h-5 w-px bg-border/60 sm:h-6" aria-hidden />
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs sm:gap-2 sm:text-sm"
              onClick={toggleSpeechSelector}
            >
              {showSpeechSelector ? (
                <SidebarClose className="size-3 sm:size-4" />
              ) : (
                <SidebarOpen className="size-3 sm:size-4" />
              )}
              <span className="hidden sm:inline">
                {showSpeechSelector ? "Hide library" : "Show library"}
              </span>
              <span className="sm:hidden">
                {showSpeechSelector ? "Hide" : "Show"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

interface ControlsCardProps {
  controller: TeleprompterController;
}

function ControlsCard({ controller }: ControlsCardProps) {
  const hasSpeech = Boolean(controller.selectedSpeech);

  const handleProgressSliderChange = React.useCallback(
    (value: number[]) => {
      const [percent] = value;
      if (typeof percent !== "number") {
        return;
      }
      controller.seekToPercent(percent);
    },
    [controller],
  );

  const handleSpeedChange = React.useCallback(
    (value: number[]) => {
      const [nextSpeed] = value;
      if (typeof nextSpeed !== "number") {
        return;
      }
      controller.updateScrollSpeed(nextSpeed);
    },
    [controller],
  );

  return (
    <Card className="border border-border/60 bg-card/80 backdrop-blur-lg transition-theme">
      <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <motion.div
          className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.div
            className="flex flex-wrap items-center gap-2 sm:gap-3"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Button
                onClick={controller.resetPlayback}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs sm:gap-2 sm:text-sm"
                disabled={!hasSpeech}
              >
                <RotateCcw className="size-3 sm:size-4" />
                Reset
              </Button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Button
                onClick={controller.togglePlayback}
                disabled={!hasSpeech}
                size="lg"
                className="gap-1.5 px-4 text-sm sm:gap-2 sm:px-6 sm:text-base"
              >
                {controller.isPlaying ? (
                  <>
                    <PauseCircle className="size-4 sm:size-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="size-4 sm:size-5" />
                    Play
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Button
                onClick={controller.selectRandomSpeech}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs sm:gap-2 sm:text-sm"
              >
                <Shuffle className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Random script</span>
                <span className="sm:hidden">Random</span>
              </Button>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {controller.selectedSpeech && (
              <motion.div
                key="speech-info"
                className="flex flex-col items-start gap-1 text-xs text-muted-foreground sm:text-sm md:items-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-primary sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.2em]">
                  {controller.selectedSpeech.difficulty}
                </span>
                <p className="text-xs font-medium text-foreground sm:text-sm">
                  {controller.selectedSpeech.title}
                </p>
                <p className="text-xs">
                  {controller.selectedSpeech.wordCount} words ·{" "}
                  {Math.floor(controller.selectedSpeech.estimatedDuration / 60)}
                  :
                  {(controller.selectedSpeech.estimatedDuration % 60)
                    .toString()
                    .padStart(2, "0")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {controller.selectedSpeech && (
            <motion.div
              key="progress"
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
                <span>Session progress</span>
                <span>{controller.progressPercent}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={0.1}
                value={[controller.progressPercent]}
                onValueChange={handleProgressSliderChange}
                aria-label="Session progress"
                className="cursor-pointer"
              />
              <div className="space-y-2 pt-2 sm:pt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
                  <span>Scroll speed</span>
                  <span className="font-medium text-foreground">
                    {Math.round(controller.scrollSpeed)} WPM
                  </span>
                </div>
                <Slider
                  min={controller.difficultyScrollConfig.min}
                  max={controller.difficultyScrollConfig.max}
                  step={1}
                  value={[controller.scrollSpeed]}
                  onValueChange={handleSpeedChange}
                  onValueCommit={handleSpeedChange}
                  aria-label="Scroll speed in words per minute"
                  className="cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {controller.selectedSpeech && (
            <motion.div
              key="stats"
              className="grid gap-3 sm:grid-cols-3 sm:gap-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <StatBlock
                title="Pace"
                primary={`${Math.round(controller.scrollSpeed)} WPM`}
                subtitle={`Range ${controller.difficultyScrollConfig.min}-${controller.difficultyScrollConfig.max} WPM`}
              />
              <StatBlock
                title="Words remaining"
                primary={controller.metrics.wordsRemaining.toString()}
                subtitle={`Estimated ${controller.metrics.displayMinutesRemaining}:${controller.metrics.displaySecondsRemaining} left`}
              />
              <StatBlock
                title="Difficulty preset"
                primary={controller.selectedDifficulty}
                subtitle="Word highlight aligns to this level"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface StatBlockProps {
  title: string;
  primary: string;
  subtitle: string;
}

function StatBlock({ title, primary, subtitle }: StatBlockProps) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      className="rounded-xl border border-border/40 bg-card/80 p-3 shadow-sm sm:rounded-2xl sm:p-4"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">
        {title}
      </p>
      <p className="mt-1.5 text-lg font-semibold text-foreground sm:mt-2 sm:text-xl">
        {primary}
      </p>
      <p className="text-[10px] text-muted-foreground sm:text-xs">{subtitle}</p>
    </motion.div>
  );
}

function WelcomeCard() {
  return (
    <Card className="border border-border/60 bg-card/80 backdrop-blur-lg">
      <CardContent className="space-y-3 p-4 text-center sm:space-y-4 sm:p-6">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          Welcome to SpeechDrill
        </h3>
        <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
          Pick a difficulty, open the library, and select a script to begin.
          Adjust WPM and font size, then rehearse until the bar reaches 100%.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <PlayCircle className="size-3 text-primary sm:size-4" />
            Play or pause the scroll
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <RotateCcw className="size-3 text-primary sm:size-4" />
            Reset when you restart
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Shuffle className="size-3 text-primary sm:size-4" />
            Randomize for variety
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LibraryCardProps {
  selectedSpeech: Speech | null;
  selectedDifficulty: TeleprompterController["selectedDifficulty"];
  onSpeechSelect: (speech: Speech) => void;
}

function LibraryCard({
  selectedSpeech,
  selectedDifficulty,
  onSpeechSelect,
}: LibraryCardProps) {
  return (
    <Card className="border border-border/60 bg-card/80 backdrop-blur-lg py-0">
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
        <CardTitle className="text-lg font-semibold text-foreground sm:text-xl">
          Speech Library
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground sm:text-sm">
          Filter by difficulty or category, preview summaries, and pick the
          script that matches your session.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5">
        <SpeechSelector
          selectedSpeech={selectedSpeech ?? undefined}
          onSpeechSelect={onSpeechSelect}
          difficulty={selectedDifficulty}
        />
      </CardContent>
    </Card>
  );
}

function SessionNotesCard() {
  return (
    <Card className="border border-border/50 bg-secondary/70 backdrop-blur-lg">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
          Session notes
        </h3>
        <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
          <li>Warm up with the first paragraph before you press play.</li>
          <li>Use the random script to challenge pacing and vocabulary.</li>
          <li>Reset between takes to track a clean progress bar.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
