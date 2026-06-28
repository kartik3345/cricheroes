import React from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './FullScorecardTab.module.css';

export default function FullScorecardTab() {
  const { state } = useMatch();
  if (!state) return null;

  const renderInnings = (
    teamName: string, 
    score: number, 
    wickets: number, 
    oversStr: string,
    battingStats: Record<string, any>,
    bowlingStats: Record<string, any>,
    extras: { wd: number, nb: number },
    fow: any[],
    headerClass: string
  ) => {
    return (
      <div className={styles.inningsSection}>
        <div className={`${styles.header} ${headerClass}`}>
          <h3 className={styles.title}>{teamName} Innings</h3>
          <span className={styles.score}>{score}/{wickets} <span>({oversStr} Ov)</span></span>
        </div>
        
        {/* Batting */}
        <div className="table-container">
          <table className="scorecard-table">
            <thead>
              <tr>
                <th>Batsman</th>
                <th></th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(battingStats).filter(s => s.status !== 'yet to bat' && s.balls > 0 || s.runs > 0).map((stats: any) => (
                <tr key={stats.name}>
                  <td className="player-col">
                    <span className="player-name-mini">{stats.name}</span>
                  </td>
                  <td className={styles.statusCol}>{stats.status}</td>
                  <td className="stat-highlight">{stats.runs}</td>
                  <td>{stats.balls}</td>
                  <td>{stats.fours}</td>
                  <td>{stats.sixes}</td>
                  <td>{stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(1) : '0.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.extrasRow}>
            <span>Extras: <strong>{extras.wd + extras.nb}</strong> (WD {extras.wd}, NB {extras.nb})</span>
          </div>
        </div>

        {/* FOW */}
        {fow.length > 0 && (
          <div className={styles.fowSection}>
            <span className={styles.fowLabel}>Fall of Wickets:</span>
            <div className={styles.fowList}>
              {fow.map((w, i) => (
                <span key={i} className={styles.fowItem}>
                  {w.score}-{i+1} ({w.batsman}, {w.overs})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bowling */}
        <div className="table-container">
          <table className="scorecard-table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>Econ</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(bowlingStats).filter((s: any) => s.overs > 0 || s.balls > 0).map((stats: any) => (
                <tr key={stats.name}>
                  <td className="player-col">
                    <span className="player-name-mini">{stats.name}</span>
                  </td>
                  <td>{stats.overs}.{stats.balls % 6}</td>
                  <td>{stats.maidens}</td>
                  <td>{stats.runs}</td>
                  <td className="stat-highlight">{stats.wickets}</td>
                  <td>{((stats.overs * 6 + (stats.balls % 6)) > 0) ? ((stats.runs / (stats.overs * 6 + (stats.balls % 6))) * 6).toFixed(1) : '0.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Innings 1 */}
      {renderInnings(
        state.teamBattingFirst,
        state.innings1Score,
        state.innings1Wickets,
        `${Math.floor(state.innings1Balls / 6)}.${state.innings1Balls % 6}`,
        state.innings1BattingStats,
        state.innings1BowlingStats,
        state.innings1Extras,
        state.innings1Fow,
        styles.headerGold
      )}

      {/* Innings 2 */}
      {state.innings > 1 && renderInnings(
        state.teamBattingFirst === state.teamAName ? state.teamBName : state.teamAName,
        state.score,
        state.wickets,
        `${Math.floor(state.balls / 6)}.${state.balls % 6}`,
        state.battingStats,
        state.bowlingStats,
        state.extras,
        state.fow,
        styles.headerGreen
      )}
    </div>
  );
}
