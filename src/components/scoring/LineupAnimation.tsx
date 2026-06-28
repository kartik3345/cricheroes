import React, { useEffect, useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './LineupAnimation.module.css';
import { SquadPlayer } from '../../types/cricket';

export default function LineupAnimation() {
  const { state, dispatch, isAdmin } = useMatch();
  
  // Early return if state is null
  if (!state) return null;

  const handleClose = () => {
    if (state.innings1Balls > 0 || state.innings2Balls > 0 || state.currentBowler) {
      dispatch({ type: 'SET_PHASE', payload: 'playing' });
    } else {
      dispatch({ type: 'SET_PHASE', payload: 'setup' });
    }
  };

  const renderSquad = (teamName: string, squad: SquadPlayer[], teamClass: string) => {
    return (
      <div className={`${styles.teamHalf} ${teamClass}`}>
        <h2 className={styles.teamName}>{teamName}</h2>
        <div className={styles.squadList}>
          {squad.map((player, index) => (
            <div 
              key={player.name} 
              className={styles.playerCard}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              {player.photo ? (
                <img src={player.photo} alt={player.name} className={styles.playerPhoto} />
              ) : (
                <div className={styles.textAvatar}>{player.name.substring(0, 1)}</div>
              )}
              <div className={styles.playerInfo}>
                <span className={styles.playerName}>{player.name}</span>
                <span className={styles.playerRole}>{player.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={handleClose} 
        className={styles.closeBtn}
        aria-label="Close Lineup"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      {renderSquad(state.teamAName, state.squadA, styles.teamA)}
      <div className={styles.vsBadge}>VS</div>
      {renderSquad(state.teamBName, state.squadB, styles.teamB)}
    </div>
  );
}
