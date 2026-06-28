import React, { useEffect, useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './LineupAnimation.module.css';
import { SquadPlayer } from '../../types/cricket';

export default function LineupAnimation() {
  const { state, dispatch, isAdmin } = useMatch();
  
  // Early return if state is null
  if (!state) return null;

  // Run the auto-transition for both admin (syncs to DB) and viewer (local only)
  useEffect(() => {
    
    // Hold the lineup animation for exactly 5 seconds, then move back
    const timer = setTimeout(() => {
      if (state.innings1Balls > 0 || state.innings2Balls > 0 || state.currentBowler) {
        dispatch({ type: 'SET_PHASE', payload: 'playing' });
      } else {
        dispatch({ type: 'SET_PHASE', payload: 'setup' });
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isAdmin, dispatch, state.innings1Balls, state.innings2Balls, state.currentBowler]);

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
      {renderSquad(state.teamAName, state.squadA, styles.teamA)}
      <div className={styles.vsBadge}>VS</div>
      {renderSquad(state.teamBName, state.squadB, styles.teamB)}
    </div>
  );
}
