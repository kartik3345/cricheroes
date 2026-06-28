import React from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './BattingTab.module.css';

export default function BattingTab() {
  const { state } = useMatch();
  if (!state) return null;

  const battingSquad = state.innings === 1 ? state.squadBattingFirst : state.squadBowlingFirst;
  const battingTeam = state.innings === 1 ? state.teamAName : state.teamBName;

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">{battingTeam} Batting</h3>
      </div>
      
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Batsman</th>
            <th>R</th>
            <th>B</th>
            <th>4s</th>
            <th>6s</th>
            <th>SR</th>
          </tr>
        </thead>
        <tbody>
          {battingSquad.map(player => {
            const stats = state.battingStats[player.name];
            
            // If they haven't batted yet, show empty state
            if (!stats) {
              return (
                <tr key={player.name} className="">
                  <td className="player-col" style={{ opacity: 0.5 }}>
                    <div className="player-avatar-mini">
                      {player.photo ? <img src={player.photo} alt={player.name} /> : player.name.substring(0,1)}
                    </div>
                    <div className="player-info-mini">
                      <span className="player-name-mini">{player.name}</span>
                      <span className="player-status-mini">yet to bat</span>
                    </div>
                  </td>
                  <td className="stat-highlight" style={{ opacity: 0.5 }}>-</td>
                  <td style={{ opacity: 0.5 }}>-</td>
                  <td style={{ opacity: 0.5 }}>-</td>
                  <td style={{ opacity: 0.5 }}>-</td>
                  <td style={{ opacity: 0.5 }}>-</td>
                </tr>
              );
            }
            
            const isStriker = state.currentBatsmanStrike === player.name;
            const isNonStriker = state.currentBatsmanNonStrike === player.name;
            const isActive = isStriker || isNonStriker;
            const isOut = stats.status !== 'not out' && stats.status !== 'yet to bat';
            
            let rowClass = '';
            if (isStriker) rowClass = styles.strikerRow;
            else if (isNonStriker) rowClass = styles.nonStrikerRow;
            else if (isOut) rowClass = styles.outRow;
            
            const sr = stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(1) : '0.0';

            return (
              <tr key={player.name} className={rowClass}>
                <td className="player-col">
                  <div className="player-avatar-mini">
                    {player.photo ? <img src={player.photo} alt={player.name} /> : player.name.substring(0,1)}
                  </div>
                  <div className="player-info-mini">
                    <span className="player-name-mini">
                      {player.name}
                      {isStriker && <span className={styles.strikeIndicator}>*</span>}
                    </span>
                    <span className="player-status-mini">{stats.status}</span>
                  </div>
                </td>
                <td className="stat-highlight">{stats.runs}</td>
                <td>{stats.balls}</td>
                <td>{stats.fours}</td>
                <td>{stats.sixes}</td>
                <td>{sr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className={styles.extrasRow}>
        <span className={styles.extrasLabel}>Extras:</span>
        <span className={styles.extrasTotal}>{state.extras.wd + state.extras.nb}</span>
        <span className={styles.extrasDetail}>
          (WD {state.extras.wd}, NB {state.extras.nb})
        </span>
      </div>
    </div>
  );
}
