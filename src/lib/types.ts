/**
 * Core types for SpeechDrill application
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type SpeechCategory = 'historical' | 'business' | 'motivational' | 'casual' | 'informative';

export interface Speech {
  id: string;
  title: string;
  author?: string;
  content: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // seconds
  wordCount: number;
  topic: string;
  category: SpeechCategory;
  tags: string[];
}

export interface SpeechDatabase {
  speeches: Speech[];
  lastUpdated: string;
  version: string;
}

export interface SpeechFilters {
  difficulty?: DifficultyLevel;
  category?: SpeechCategory;
  tags?: string[];
  minDuration?: number;
  maxDuration?: number;
  minWordCount?: number;
  maxWordCount?: number;
}

export interface TeleprompterSettings {
  speed: number; // words per minute
  fontSize: number; // pixels
  isPlaying: boolean;
  isFullscreen: boolean;
  currentPosition: number; // current word index
}

export interface SpeechSession {
  speechId: string;
  startTime: Date;
  endTime?: Date;
  settings: TeleprompterSettings;
  completed: boolean;
}

// Difficulty-specific configurations
export interface DifficultyConfig {
  defaultSpeed: {
    min: number;
    max: number;
    default: number;
  };
  wordCountRange: {
    min: number;
    max: number;
  };
  estimatedDurationRange: {
    min: number; // seconds
    max: number; // seconds
  };
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: {
    defaultSpeed: { min: 60, max: 120, default: 90 },
    wordCountRange: { min: 120, max: 180 },
    estimatedDurationRange: { min: 60, max: 120 }
  },
  intermediate: {
    defaultSpeed: { min: 80, max: 150, default: 115 },
    wordCountRange: { min: 150, max: 200 },
    estimatedDurationRange: { min: 60, max: 120 }
  },
  advanced: {
    defaultSpeed: { min: 100, max: 200, default: 150 },
    wordCountRange: { min: 180, max: 250 },
    estimatedDurationRange: { min: 60, max: 120 }
  }
};
