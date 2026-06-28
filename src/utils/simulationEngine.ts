// ==========================================
// Simulation Engine — Ball Outcome Generator
// ==========================================
import type { BallType, WicketType } from '../types/cricket';

export interface SimulatedBall {
  ballType: BallType;
  runs: number;
  wicketType?: WicketType;
}

/**
 * Generate a random ball outcome using probability distribution:
 * Dot ball (35%), 1 run (35%), 2 runs (10%), 4 runs (10%),
 * 6 runs (4%), Wicket (3%), Extra (3%)
 */
export function generateRandomBall(): SimulatedBall {
  const rand = Math.random() * 100;

  if (rand < 35) {
    return { ballType: 'run', runs: 0 };
  } else if (rand < 70) {
    return { ballType: 'run', runs: 1 };
  } else if (rand < 80) {
    return { ballType: 'run', runs: 2 };
  } else if (rand < 90) {
    return { ballType: 'run', runs: 4 };
  } else if (rand < 94) {
    return { ballType: 'run', runs: 6 };
  } else if (rand < 97) {
    const wicketTypes: WicketType[] = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped'];
    const wicketType = wicketTypes[Math.floor(Math.random() * wicketTypes.length)];
    return { ballType: 'w', runs: 0, wicketType };
  } else {
    // Extras: Wide (70%) or No Ball (30%)
    if (Math.random() < 0.7) {
      return { ballType: 'wd', runs: 1 };
    } else {
      return { ballType: 'nb', runs: 1 };
    }
  }
}
