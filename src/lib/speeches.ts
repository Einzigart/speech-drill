/**
 * Speech data management utilities
 */

import { Speech, SpeechDatabase, SpeechFilters, DifficultyLevel, SpeechCategory } from './types';
import speechData from '../data/speeches.json';

// Type assertion to ensure the imported data matches our interface
const database: SpeechDatabase = speechData as SpeechDatabase;

/**
 * Get all speeches from the database
 */
export function getAllSpeeches(): Speech[] {
  return database.speeches;
}

/**
 * Get a speech by its ID
 */
export function getSpeechById(id: string): Speech | undefined {
  return database.speeches.find(speech => speech.id === id);
}

/**
 * Filter speeches based on provided criteria
 */
export function filterSpeeches(filters: SpeechFilters): Speech[] {
  let filteredSpeeches = database.speeches;

  if (filters.difficulty) {
    filteredSpeeches = filteredSpeeches.filter(
      speech => speech.difficulty === filters.difficulty
    );
  }

  if (filters.category) {
    filteredSpeeches = filteredSpeeches.filter(
      speech => speech.category === filters.category
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredSpeeches = filteredSpeeches.filter(speech =>
      filters.tags!.some(tag => speech.tags.includes(tag))
    );
  }

  if (filters.minDuration) {
    filteredSpeeches = filteredSpeeches.filter(
      speech => speech.estimatedDuration >= filters.minDuration!
    );
  }

  if (filters.maxDuration) {
    filteredSpeeches = filteredSpeeches.filter(
      speech => speech.estimatedDuration <= filters.maxDuration!
    );
  }

  if (filters.minWordCount) {
    filteredSpeeches = filteredSpeeches.filter(
      speech => speech.wordCount >= filters.minWordCount!
    );
  }

  if (filters.maxWordCount) {
    filteredSpeeches = filteredSpeeches.filter(
      speech => speech.wordCount <= filters.maxWordCount!
    );
  }

  return filteredSpeeches;
}

/**
 * Get speeches by difficulty level
 */
export function getSpeechesByDifficulty(difficulty: DifficultyLevel): Speech[] {
  return filterSpeeches({ difficulty });
}

/**
 * Get speeches by category
 */
export function getSpeechesByCategory(category: SpeechCategory): Speech[] {
  return filterSpeeches({ category });
}

/**
 * Get a random speech from all speeches
 */
export function getRandomSpeech(): Speech | null {
  const speeches = getAllSpeeches();
  if (speeches.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * speeches.length);
  return speeches[randomIndex];
}

/**
 * Get a random speech by difficulty level
 */
export function getRandomSpeechByDifficulty(difficulty: DifficultyLevel): Speech | null {
  const speeches = getSpeechesByDifficulty(difficulty);
  if (speeches.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * speeches.length);
  return speeches[randomIndex];
}

/**
 * Get a random speech by category
 */
export function getRandomSpeechByCategory(category: SpeechCategory): Speech | null {
  const speeches = getSpeechesByCategory(category);
  if (speeches.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * speeches.length);
  return speeches[randomIndex];
}

/**
 * Search speeches by title or content
 */
export function searchSpeeches(query: string): Speech[] {
  const lowercaseQuery = query.toLowerCase();
  
  return database.speeches.filter(speech =>
    speech.title.toLowerCase().includes(lowercaseQuery) ||
    speech.content.toLowerCase().includes(lowercaseQuery) ||
    speech.topic.toLowerCase().includes(lowercaseQuery) ||
    speech.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get unique categories from all speeches
 */
export function getAvailableCategories(): SpeechCategory[] {
  const categories = new Set<SpeechCategory>();
  database.speeches.forEach(speech => categories.add(speech.category));
  return Array.from(categories);
}

/**
 * Get unique tags from all speeches
 */
export function getAvailableTags(): string[] {
  const tags = new Set<string>();
  database.speeches.forEach(speech => 
    speech.tags.forEach(tag => tags.add(tag))
  );
  return Array.from(tags).sort();
}

/**
 * Get database metadata
 */
export function getDatabaseInfo(): { 
  totalSpeeches: number; 
  lastUpdated: string; 
  version: string;
  speechCountByDifficulty: Record<DifficultyLevel, number>;
  speechCountByCategory: Record<string, number>;
} {
  const speechCountByDifficulty: Record<DifficultyLevel, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  };

  const speechCountByCategory: Record<string, number> = {};

  database.speeches.forEach(speech => {
    speechCountByDifficulty[speech.difficulty]++;
    speechCountByCategory[speech.category] = (speechCountByCategory[speech.category] || 0) + 1;
  });

  return {
    totalSpeeches: database.speeches.length,
    lastUpdated: database.lastUpdated,
    version: database.version,
    speechCountByDifficulty,
    speechCountByCategory
  };
}

/**
 * Calculate estimated reading time based on words per minute
 */
export function calculateReadingTime(wordCount: number, wpm: number): number {
  return Math.ceil((wordCount / wpm) * 60); // returns seconds
}

/**
 * Format duration from seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get speech content as an array of words for teleprompter display
 */
export function getSpeechWords(speechId: string): string[] {
  const speech = getSpeechById(speechId);
  if (!speech) return [];
  
  // Split content into words, preserving punctuation
  return speech.content.split(/\s+/).filter(word => word.length > 0);
}

/**
 * Get speech content as an array of sentences for highlighting
 */
export function getSpeechSentences(speechId: string): string[] {
  const speech = getSpeechById(speechId);
  if (!speech) return [];
  
  // Split content into sentences
  return speech.content
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
}
