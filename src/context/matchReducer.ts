import { MatchAction, MatchConfig, MatchPhase, MatchState } from '../types/cricket';

export function createInitialMatchState(config: MatchConfig & { teamBattingFirst: string }): MatchState {
  const teamBowlingFirst = config.teamBattingFirst === config.teamAName ? config.teamBName : config.teamAName;
  const squadBattingFirst = config.teamBattingFirst === config.teamAName ? config.squadA : config.squadB;
  const squadBowlingFirst = config.teamBattingFirst === config.teamAName ? config.squadB : config.squadA;

  return {
    ...config,
    matchType: config.matchType || 'team-wise',
    syncId: '',
    teamAName: config.teamAName,
    teamBName: config.teamBName,
    overs: config.overs,
    mode: config.mode,
    venue: config.venue,
    powerplayOvers: config.powerplayOvers,
    squadA: config.squadA,
    squadB: config.squadB,
    squadBattingFirst,
    squadBowlingFirst,
    teamBattingFirst: config.teamBattingFirst,
    teamBowlingFirst,
    innings: 1,
    score: 0,
    wickets: 0,
    balls: 0,
    currentBatsmanStrike: '',
    currentBatsmanNonStrike: '',
    currentBowler: '',
    battingStats: {},
    bowlingStats: {},
    extras: { b: 0, lb: 0, wd: 0, nb: 0, total: 0 },
    fow: [],
    commentary: [],
    oversHistory: [],
    cumulativeHistory: [0],
    innings1Score: 0,
    innings1Wickets: 0,
    innings1Balls: 0,
    innings1BattingStats: {},
    innings1BowlingStats: {},
    innings1Extras: { b: 0, lb: 0, wd: 0, nb: 0, total: 0 },
    innings1Fow: [],
    innings1Commentary: [],
    innings1OversHistory: [],
    innings1Cumulative: [],
    isCompleted: false,
    isSpectator: false,
    statusText: 'Innings 1 in progress',
    activeGraph: 'worm',
    phase: 'setup',
    toss: null,
  };
}

export function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'INIT_MATCH':
      return createInitialMatchState(action.payload);

    case 'LOAD_MATCH':
    case 'LOAD_REMOTE_MATCH':
      return { ...action.payload };

    case 'RESET_MATCH':
      if (!state) return state;
      return createInitialMatchState({
        teamAName: state.teamAName,
        teamBName: state.teamBName,
        overs: state.overs,
        mode: state.mode,
        venue: state.venue,
        powerplayOvers: state.powerplayOvers,
        squadA: state.squadA,
        squadB: state.squadB,
        teamBattingFirst: state.teamBattingFirst
      });

    case 'SYNC_TOSS_STATE':
      return { ...state, tossState: action.payload };

    case 'SET_TOSS':
      return { ...state, toss: action.payload };

    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'SET_GRAPH':
      return { ...state, activeGraph: action.payload };

    case 'SET_OPENERS': {
      const { striker, nonStriker } = action.payload;
      return {
        ...state,
        currentBatsmanStrike: striker,
        currentBatsmanNonStrike: nonStriker,
        battingStats: {
          ...state.battingStats,
          [striker]: { name: striker, photo: '', runs: 0, balls: 0, fours: 0, sixes: 0, status: 'not out', onStrike: true },
          [nonStriker]: { name: nonStriker, photo: '', runs: 0, balls: 0, fours: 0, sixes: 0, status: 'not out', onStrike: false }
        }
      };
    }

    case 'SET_BOWLER': {
      const { bowler } = action.payload;
      if (!state.bowlingStats[bowler]) {
        return {
          ...state,
          currentBowler: bowler,
          bowlingStats: {
            ...state.bowlingStats,
            [bowler]: { name: bowler, photo: '', overs: 0, balls: 0, maidens: 0, runs: 0, wickets: 0, dotBalls: 0, currentOverRuns: 0, overBallsLog: [] }
          }
        };
      }
      return { ...state, currentBowler: bowler };
    }

    case 'SELECT_NEW_BATSMAN': {
      const { name, role } = action.payload;
      const isStrike = role === 'strike';
      return {
        ...state,
        currentBatsmanStrike: isStrike ? name : state.currentBatsmanStrike,
        currentBatsmanNonStrike: isStrike ? state.currentBatsmanNonStrike : name,
        battingStats: {
          ...state.battingStats,
          [name]: { name, photo: '', runs: 0, balls: 0, fours: 0, sixes: 0, status: 'not out', onStrike: isStrike }
        }
      };
    }

    case 'REPLACE_BATSMAN': {
      const { oldRole, newBatsman } = action.payload;
      const isStrike = oldRole === 'strike';
      const oldBatsman = isStrike ? state.currentBatsmanStrike : state.currentBatsmanNonStrike;
      
      const newBattingStats = { ...state.battingStats };
      if (oldBatsman) {
        newBattingStats[oldBatsman] = { ...newBattingStats[oldBatsman], status: 'retired' };
      }
      newBattingStats[newBatsman] = { name: newBatsman, photo: '', runs: 0, balls: 0, fours: 0, sixes: 0, status: 'not out', onStrike: isStrike };

      return {
        ...state,
        currentBatsmanStrike: isStrike ? newBatsman : state.currentBatsmanStrike,
        currentBatsmanNonStrike: isStrike ? state.currentBatsmanNonStrike : newBatsman,
        battingStats: newBattingStats
      };
    }

    case 'START_INNINGS_2': {
      if (state.innings !== 1) return state;
      return {
        ...state,
        innings: 2,
        innings1Score: state.score,
        innings1Wickets: state.wickets,
        innings1Balls: state.balls,
        innings1BattingStats: state.battingStats,
        innings1BowlingStats: state.bowlingStats,
        innings1Extras: state.extras,
        innings1Fow: state.fow,
        innings1Commentary: state.commentary,
        innings1OversHistory: state.oversHistory,
        innings1Cumulative: state.cumulativeHistory,
        
        score: 0,
        wickets: 0,
        balls: 0,
        currentBatsmanStrike: '',
        currentBatsmanNonStrike: '',
        currentBowler: '',
        lastBowler: '',
        battingStats: {},
        bowlingStats: {},
        extras: { b: 0, lb: 0, wd: 0, nb: 0, total: 0 },
        fow: [],
        commentary: [],
        oversHistory: [],
        cumulativeHistory: [0],
        statusText: `Target: ${state.score + 1}`,
        phase: 'setup' // Set phase to setup for second innings
      };
    }

    case 'RECORD_BALL': {
      const { ballType, runs, wicketType, dismissedBatsmanType } = action.payload;
      
      const isWide = ballType === 'wd';
      const isNoBall = ballType === 'nb';
      const isExtra = isWide || isNoBall;
      const isWicket = ballType === 'w';
      const isLegal = !isExtra;

      const striker = state.currentBatsmanStrike;
      const nonStriker = state.currentBatsmanNonStrike;
      const bowler = state.currentBowler;

      const newScore = state.score + runs + (isExtra ? 1 : 0);
      const newBalls = state.balls + (isLegal ? 1 : 0);
      const newWickets = state.wickets + (isWicket ? 1 : 0);

      // --- Batting Stats ---
      const strikerStats = { ...state.battingStats[striker] };
      if (isLegal || isNoBall) {
        strikerStats.balls += 1;
        strikerStats.runs += runs;
        if (runs === 4) strikerStats.fours += 1;
        if (runs === 6) strikerStats.sixes += 1;
      }

      // --- Bowling Stats ---
      const bowlerStats = { ...state.bowlingStats[bowler] };
      // Fallback for older matches
      if (!bowlerStats.overBallsLog) bowlerStats.overBallsLog = [];
      if (bowlerStats.dotBalls === undefined) bowlerStats.dotBalls = 0;
      if (bowlerStats.currentOverRuns === undefined) bowlerStats.currentOverRuns = 0;

      bowlerStats.runs += runs + (isExtra ? 1 : 0);
      if (isLegal) {
        bowlerStats.balls += 1;
        if (runs === 0 && !isWicket) bowlerStats.dotBalls += 1;
      }
      bowlerStats.currentOverRuns += runs + (isExtra ? 1 : 0);
      if (isWicket && !['Run Out', 'Retired Hurt'].includes(wicketType || '')) {
         bowlerStats.wickets += 1;
      }
      
      let ballClass = 'ball-dot';
      let ballText = '0';
      if (isWide) { ballClass = 'ball-wide'; ballText = 'Wd'; }
      else if (isNoBall) { ballClass = 'ball-noball'; ballText = 'Nb'; }
      else if (isWicket) { ballClass = 'ball-wicket'; ballText = 'W'; }
      else if (runs > 0) {
        ballClass = runs === 4 ? 'ball-four' : runs === 6 ? 'ball-six' : 'ball-run';
        ballText = runs.toString();
      }

      bowlerStats.overBallsLog = [...bowlerStats.overBallsLog, { text: ballText, className: ballClass }];

      // --- Extras ---
      const newExtras = { ...state.extras };
      if (isExtra) {
        newExtras.total += 1;
        if (isWide) newExtras.wd += 1;
        if (isNoBall) newExtras.nb += 1;
      }

      // --- FOW ---
      let newFow = [...state.fow];
      if (isWicket) {
        newFow.push({
          wicketNum: newWickets,
          score: newScore,
          batsman: striker,
          overs: `${Math.floor(state.balls/6)}.${state.balls%6}`
        });
        strikerStats.status = `${wicketType} b ${bowler}`;
      }

      // --- Commentary ---
      const newCommentary = [...state.commentary];
      newCommentary.unshift({
        ball: isLegal ? `${Math.floor(newBalls/6)}.${newBalls%6}` : `${Math.floor(state.balls/6)}.${state.balls%6}`,
        text: isWicket ? `OUT! ${striker} ${strikerStats.status}` : `${bowler} to ${striker}, ${runs} run(s) ${isExtra ? (isWide ? '(Wide)' : '(No Ball)') : ''}`,
        runs: runs,
        isWicket: isWicket,
        isExtra: isExtra,
        isDivider: false
      });

      // --- Overs & History ---
      let newOversHistory = [...state.oversHistory];
      if (isLegal && newBalls % 6 === 0) {
        newOversHistory.push({
          overNum: newBalls / 6,
          runs: bowlerStats.currentOverRuns,
          wickets: newWickets - (state.oversHistory.length > 0 ? state.oversHistory.reduce((acc, o) => acc + o.wickets, 0) : 0) // Approximation
        });
        if (bowlerStats.currentOverRuns === 0) bowlerStats.maidens += 1;
        bowlerStats.overs += 1;
        bowlerStats.currentOverRuns = 0;
        bowlerStats.overBallsLog = [];
        newCommentary.unshift({ ball: '', text: `End of over ${newBalls/6}`, runs: 0, isWicket: false, isExtra: false, isDivider: true });
      }

      let newCumulative = [...state.cumulativeHistory];
      if (isLegal) {
        newCumulative.push(newScore);
      }

      // --- Strike Rotation ---
      let newStriker = striker;
      let newNonStriker = nonStriker;
      let rotateStrike = false;
      if (runs % 2 !== 0 && !isWicket) rotateStrike = true;
      if (isLegal && newBalls % 6 === 0) rotateStrike = !rotateStrike; // Switch back if odd run on last ball

      if (rotateStrike && !isWicket) {
        newStriker = nonStriker;
        newNonStriker = striker;
        strikerStats.onStrike = false;
        state.battingStats[nonStriker].onStrike = true;
      }
      
      // Clear dismissed batsman
      if (isWicket) {
        if (dismissedBatsmanType === 'nonstrike') {
          newNonStriker = '';
        } else {
          newStriker = '';
        }
      }

      // --- Match Completion Check ---
      const maxBalls = state.overs * 6;
      let isCompleted = false;
      let statusText = state.statusText;
      
      const currentSquadSize = state.innings === 1 ? state.squadBattingFirst.length : state.squadBowlingFirst.length;
      const allOutLimit = state.matchType === 'one-to-one' ? currentSquadSize : Math.max(1, currentSquadSize - 1);
      const allOut = newWickets >= allOutLimit || newWickets >= 10;
      const inningsFinished = allOut || newBalls >= maxBalls;

      if (state.innings === 2) {
        const target = state.innings1Score + 1;
        if (newScore >= target) {
          isCompleted = true;
          const totalWickets = state.squadBowlingFirst.length - 1;
          const wicketsRemaining = totalWickets - newWickets;
          statusText = `${state.teamBowlingFirst} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
        } else if (inningsFinished) {
          isCompleted = true;
          if (newScore === target - 1) statusText = "Match Tied";
          else statusText = `${state.teamBattingFirst} won by ${target - 1 - newScore} runs`;
        }
      }
      let nextPhase = isCompleted ? 'completed' : state.phase;
      if (state.innings === 1 && inningsFinished) {
        nextPhase = 'innings_break';
        statusText = `Innings Break. Target: ${newScore + 1}`;
      }

      let nextBowler = bowler;
      let lastBowler = state.lastBowler;
      if (isLegal && newBalls > 0 && newBalls % 6 === 0) {
        lastBowler = bowler;
        nextBowler = '';
      }

      return {
        ...state,
        score: newScore,
        balls: newBalls,
        wickets: newWickets,
        battingStats: { ...state.battingStats, [striker]: strikerStats },
        bowlingStats: { ...state.bowlingStats, [bowler]: bowlerStats },
        extras: newExtras,
        fow: newFow,
        commentary: newCommentary,
        oversHistory: newOversHistory,
        cumulativeHistory: newCumulative,
        currentBatsmanStrike: newStriker,
        currentBatsmanNonStrike: newNonStriker,
        currentBowler: nextBowler,
        lastBowler,
        isCompleted,
        statusText,
        phase: nextPhase

      };
    }
    default:
      return state;
  }
}
