import React from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './BowlingTab.module.css';

export default function BowlingTab() {
  const { state } = useMatch();
  if (!state) return null;

  const bowlingSquad = state.innings === 1 ? state.squadBowlingFirst : state.squadBattingFirst;
  const bowlingTeam = state.innings === 1 ? state.teamBName : state.teamAName;

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">{bowlingTeam} Bowling</h3>
      </div>
      
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
          {bowlingSquad.map(player => {
            const stats = state.bowlingStats[player.name];
            
            if (!stats || (stats.overs === 0 && stats.balls === 0)) {
              return (
                <tr key={player.name} className="">
                  <td className="player-col" style={{ opacity: 0.5 }}>
                    <div className="player-avatar-mini">
                      {player.photo ? <img src={player.photo} alt={player.name} /> : player.name.substring(0,1)}
                    </div>
                    <div className="player-info-mini">
                      <span className="player-name-mini">{player.name}</span>
                    </div>
                  </td>
                  <td style={{ opacity: 0.5 }}>0.0</td>
                  <td style={{ opacity: 0.5 }}>0</td>
                  <td style={{ opacity: 0.5 }}>0</td>
                  <td className="stat-highlight" style={{ opacity: 0.5 }}>0</td>
                  <td style={{ opacity: 0.5 }}>0.0</td>
                </tr>
              );
            }
            
            const isCurrent = state.currentBowler === player.name;
            const oversFormatted = `${stats.overs}.${stats.balls % 6}`;
            const totalBalls = (stats.overs * 6) + (stats.balls % 6);
            const econ = totalBalls > 0 ? ((stats.runs / totalBalls) * 6).toFixed(1) : '0.0';

            return (
              <tr key={player.name} className={isCurrent ? styles.activeRow : ''}>
                <td className="player-col">
                  <div className="player-avatar-mini">
                    {player.photo ? <img src={player.photo} alt={player.name} /> : player.name.substring(0,1)}
                  </div>
                  <div className="player-info-mini">
                    <span className="player-name-mini">
                      {player.name}
                      {isCurrent && <span className={styles.currentBadge}>Current</span>}
                    </span>
                  </div>
                </td>
                <td>{oversFormatted}</td>
                <td>{stats.maidens}</td>
                <td>{stats.runs}</td>
                <td className="stat-highlight">{stats.wickets}</td>
                <td>{econ}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
