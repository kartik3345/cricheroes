import { useState, useEffect } from 'react';
import { MatchState } from '../types/cricket';

export interface SavedMatch {
  id: string;
  savedAt: string; // ISO date string
  teamA: string;
  teamB: string;
  overs: number;
  venue: string;
  innings1Score: number;
  innings1Wickets: number;
  innings2Score: number;
  innings2Wickets: number;
  statusText: string;
  isCompleted: boolean;
  state: MatchState; // Full state for summary modal
}

const STORAGE_KEY = 'recent_matches_v1';
const MAX_RECENT = 10;

export function saveMatchToRecents(matchState: MatchState): void {
  try {
    const existing: SavedMatch[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const entry: SavedMatch = {
      id: `match_${Date.now()}`,
      savedAt: new Date().toISOString(),
      teamA: matchState.teamAName,
      teamB: matchState.teamBName,
      overs: matchState.overs,
      venue: matchState.venue,
      innings1Score: matchState.innings1Score,
      innings1Wickets: matchState.innings1Wickets,
      innings2Score: matchState.innings2Score,
      innings2Wickets: matchState.innings2Wickets,
      statusText: matchState.statusText,
      isCompleted: matchState.isCompleted,
      state: matchState,
    };

    // Prepend and keep only the latest MAX_RECENT matches
    const updated = [entry, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save match to recents:', e);
  }
}

export function useRecentMatches(): SavedMatch[] {
  const [matches, setMatches] = useState<SavedMatch[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMatches(JSON.parse(raw));
    } catch {
      setMatches([]);
    }
  }, []);

  return matches;
}
