// ---------- Enums ----------
export type PlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
export type ScoringMode = 'auto' | 'manual';
export type MatchPhase = 'setup' | 'toss' | 'lineup' | 'playing' | 'innings_break' | 'completed';
export type BallType = 'run' | 'w' | 'wd' | 'nb' | 'lb' | 'b';
export type GraphType = 'worm' | 'manhattan';
export type WicketType = 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket' | 'Retired Hurt';

// ---------- Interfaces ----------
export interface SquadPlayer {
  name: string;
  role: PlayerRole;
  photo: string;
}

export interface Mate {
  name: string;
  role: PlayerRole;
  photo: string;
}

export interface BatsmanStats {
  name: string;
  photo: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  status: string; 
  onStrike: boolean;
}

export interface OverHistoryEntry {
  text: string; 
  className: string;
}

export interface BowlerStats {
  name: string;
  photo: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidenOvers: number;
  dotBalls: number;
  currentOverRuns: number;
  overBallsLog: OverHistoryEntry[];
}

export interface FowEntry {
  wicketNum: number;
  score: number;
  batsman: string;
  overs: string;
}

export interface CommentaryEntry {
  ball: string;
  text: string;
  runs: number;
  isWicket: boolean;
  isExtra: boolean;
  isDivider?: boolean;
}

export interface MatchConfig {
  teamAName: string;
  teamBName: string;
  squadA: SquadPlayer[];
  squadB: SquadPlayer[];
  overs: number;
  powerplayOvers: number;
  venue: string;
  mode: ScoringMode;
  matchType: 'team-wise' | 'one-to-one';
}

export interface MatchState extends MatchConfig {
  syncId: string;
  isSpectator: boolean;
  innings: 1 | 2;
  
  // Toss
  toss: {
    winner: string;
    decision: 'bat' | 'bowl';
  } | null;

  // Teams sorted by batting order
  teamBattingFirst: string;
  squadBattingFirst: SquadPlayer[];
  teamBowlingFirst: string;
  squadBowlingFirst: SquadPlayer[];

  // Active Innings State
  score: number;
  wickets: number;
  balls: number;
  
  currentBatsmanStrike: string;
  currentBatsmanNonStrike: string;
  currentBowler: string;
  lastBowler?: string; 

  // Stats
  battingStats: Record<string, BatsmanStats>;
  bowlingStats: Record<string, BowlerStats>;
  extras: {
    b: number;
    lb: number;
    wd: number;
    nb: number;
    total: number;
  };
  
  fow: FowEntry[];
  commentary: CommentaryEntry[];
  oversHistory: number[]; 
  cumulativeHistory: number[]; 

  // Innings 1 Snapshot
  innings1Score: number;
  innings1Wickets: number;
  innings1Balls: number;
  innings1BattingStats: Record<string, BatsmanStats>;
  innings1BowlingStats: Record<string, BowlerStats>;
  innings1Extras: { b: number; lb: number; wd: number; nb: number; total: number };
  innings1Fow: FowEntry[];
  innings1Commentary: CommentaryEntry[];
  innings1OversHistory: number[];
  innings1Cumulative: number[];

  // Match Status
  isCompleted: boolean;
  statusText: string; 
  phase: MatchPhase;
  activeGraph: GraphType;
}

export type MatchAction =
  | { type: 'INIT_MATCH'; payload: MatchConfig & { teamBattingFirst: string } }
  | { type: 'SET_TOSS'; payload: { winner: string; decision: 'bat' | 'bowl'; teamBattingFirst: string } }
  | { type: 'SET_OPENERS'; payload: { striker: string; nonStriker: string } }
  | { type: 'SET_BOWLER'; payload: { bowler: string } }
  | { type: 'SELECT_NEW_BATSMAN'; payload: { name: string; isStrike: boolean } }
  | { type: 'REPLACE_BATSMAN'; payload: { oldRole: 'strike' | 'nonstrike'; newBatsman: string } }
  | { type: 'RECORD_BALL'; payload: { ballType: BallType; runs: number; wicketType?: WicketType; dismissedBatsmanType?: 'strike' | 'nonstrike' } }
  | { type: 'START_INNINGS_2' }
  | { type: 'SET_PHASE'; payload: MatchPhase }
  | { type: 'SET_GRAPH'; payload: GraphType }
  | { type: 'RESET_MATCH'; payload: MatchConfig }
  | { type: 'LOAD_MATCH'; payload: MatchState }
  | { type: 'LOAD_REMOTE_MATCH'; payload: MatchState }
  | { type: 'CLEAR_MATCH' };

export type MatesAction =
  | { type: 'ADD_MATE'; payload: Mate }
  | { type: 'REMOVE_MATE'; payload: string }
  | { type: 'LOAD_MATES'; payload: Mate[] };
