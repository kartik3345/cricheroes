// ==========================================
// Cricket Logic — Pure Utility Functions
// ==========================================
import type { BatsmanStats, BowlerStats, MatchAwards, PlayerPerformance } from '../types/cricket';

/**
 * Convert total balls into "overs.balls" string (e.g. 42 balls → "7.0")
 */
export function getOversString(totalBalls: number): string {
  const completedOvers = Math.floor(totalBalls / 6);
  const remainingBalls = totalBalls % 6;
  return `${completedOvers}.${remainingBalls}`;
}

/**
 * Calculate Current Run Rate
 */
export function calculateRunRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return runs / (balls / 6);
}

/**
 * Calculate Required Run Rate for the chasing team
 */
export function calculateRequiredRate(target: number, scored: number, ballsRemaining: number): number {
  if (ballsRemaining <= 0) return 0;
  const runsNeeded = target - scored;
  if (runsNeeded <= 0) return 0;
  return runsNeeded / (ballsRemaining / 6);
}

/**
 * Generate auto-commentary text from ball event details
 */
export function generateCommentary(
  bowler: string,
  batsman: string,
  runs: number,
  isWicket: boolean,
  isWide: boolean,
  isNoBall: boolean,
  wicketType?: string
): string {
  if (isWicket) {
    return `${bowler} to ${batsman}, OUT! ${wicketType || 'Dismissed'}! What a moment!`;
  }
  if (isWide) {
    return `${bowler} to ${batsman}, Wide ball. Extra run conceded.`;
  }
  if (isNoBall) {
    return `${bowler} to ${batsman}, No ball! Free hit coming up.`;
  }

  switch (runs) {
    case 0:
      return `${bowler} to ${batsman}, no run. Good tight delivery.`;
    case 1:
      return `${bowler} to ${batsman}, 1 run. Quick single taken.`;
    case 2:
      return `${bowler} to ${batsman}, 2 runs. Well run between the wickets.`;
    case 3:
      return `${bowler} to ${batsman}, 3 runs. Excellent running.`;
    case 4:
      return `${bowler} to ${batsman}, FOUR! Beautifully struck to the boundary!`;
    case 6:
      return `${bowler} to ${batsman}, SIX! Massive hit out of the ground!`;
    default:
      return `${bowler} to ${batsman}, ${runs} run${runs !== 1 ? 's' : ''}.`;
  }
}

/**
 * Calculate match awards (Best Batsman, Best Bowler, Player of the Match)
 */
export function calculateMatchAwards(
  innings1BattingStats: Record<string, BatsmanStats>,
  innings1BowlingStats: Record<string, BowlerStats>,
  battingStats: Record<string, BatsmanStats>,
  bowlingStats: Record<string, BowlerStats>
): MatchAwards {
  const bat1 = Object.values(innings1BattingStats || {});
  const bat2 = Object.values(battingStats || {});
  const allBatsmen = [...bat1, ...bat2];

  const bowl1 = Object.values(innings1BowlingStats || {});
  const bowl2 = Object.values(bowlingStats || {});
  const allBowlers = [...bowl1, ...bowl2];

  // Best Batsman (most runs, tiebreak: higher strike rate)
  let bestBatsman: BatsmanStats | null = null;
  let maxRuns = -1;
  allBatsmen.forEach((b) => {
    if (b.runs > maxRuns) {
      maxRuns = b.runs;
      bestBatsman = b;
    } else if (b.runs === maxRuns && maxRuns > 0 && bestBatsman) {
      const srCurrent = b.balls > 0 ? b.runs / b.balls : 0;
      const srBest = bestBatsman.balls > 0 ? bestBatsman.runs / bestBatsman.balls : 0;
      if (srCurrent > srBest) {
        bestBatsman = b;
      }
    }
  });

  // Best Bowler (most wickets, tiebreak: fewer runs conceded)
  let bestBowler: BowlerStats | null = null;
  let maxWickets = -1;
  let minRunsConceded = Infinity;
  allBowlers.forEach((b) => {
    if (b.wickets > maxWickets) {
      maxWickets = b.wickets;
      minRunsConceded = b.runs;
      bestBowler = b;
    } else if (b.wickets === maxWickets && maxWickets >= 0 && bestBowler) {
      if (b.runs < minRunsConceded) {
        minRunsConceded = b.runs;
        bestBowler = b;
      }
    }
  });

  // Player of the Match (weighted performance score)
  const playerPerformance: Record<string, PlayerPerformance> = {};

  allBatsmen.forEach((b) => {
    if (!playerPerformance[b.name]) {
      playerPerformance[b.name] = {
        name: b.name,
        photo: b.photo,
        runs: 0,
        balls: 0,
        wickets: 0,
        runsConceded: 0,
        overs: 0,
        score: 0,
        points: 0,
        team: ''
      };
    }
    playerPerformance[b.name].runs = b.runs;
    playerPerformance[b.name].balls = b.balls;
    playerPerformance[b.name].score += b.runs + b.fours * 1 + b.sixes * 2;
  });

  allBowlers.forEach((b) => {
    if (!playerPerformance[b.name]) {
      playerPerformance[b.name] = {
        name: b.name,
        photo: b.photo,
        runs: 0,
        balls: 0,
        wickets: 0,
        runsConceded: 0,
        overs: 0,
        score: 0,
        points: 0,
        team: ''
      };
    }
    playerPerformance[b.name].wickets = b.wickets;
    playerPerformance[b.name].runsConceded = b.runs;
    playerPerformance[b.name].overs = b.overs + (b.balls % 6) / 10;
    playerPerformance[b.name].score += b.wickets * 20 - b.runs * 0.5;
  });

  let potmPlayer: PlayerPerformance | null = null;
  let maxScore = -Infinity;

  Object.values(playerPerformance).forEach((p) => {
    if (p.score > maxScore) {
      maxScore = p.score;
      potmPlayer = p;
    }
  });

  return { bestBatsman, bestBowler, potmPlayer };
}
