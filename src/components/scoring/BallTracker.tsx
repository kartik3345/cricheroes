import React from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './BallTracker.module.css';

export default function BallTracker() {
  const { state } = useMatch();
  
  if (!state || !state.currentBowler) return null;

  const bowlerStats = state.bowlingStats[state.currentBowler];
  if (!bowlerStats) return null;

  const logs = bowlerStats.overBallsLog || [];
  
  // Always render 6 slots, even if empty
  const slots = Array(6).fill(null);
  let runsThisOver = 0;

  return (
    <div className={`glass-card ${styles.tracker}`}>
      <div className={styles.header}>
        <span className={styles.title}>This Over</span>
        <span className={styles.bowlerName}>{state.currentBowler}</span>
      </div>
      
      <div className={styles.ballsRow}>
        {slots.map((_, i) => {
          const log = logs[i];
          if (!log) {
            return <div key={`empty-${i}`} className={styles.emptyBall}></div>;
          }
          
          if (log.className === 'ball-run' || log.className === 'ball-four' || log.className === 'ball-six') {
            runsThisOver += Number(log.text);
          } else if (log.className === 'ball-wide' || log.className === 'ball-noball') {
            runsThisOver += 1;
          }
          
          return (
            <div key={`ball-${i}`} className={`ball-result ${log.className}`}>
              {log.text}
            </div>
          );
        })}
        {/* Render extra balls if an over has more than 6 balls due to extras */}
        {logs.length > 6 && logs.slice(6).map((log, i) => {
           if (log.className === 'ball-run' || log.className === 'ball-four' || log.className === 'ball-six') {
             runsThisOver += Number(log.text);
           } else if (log.className === 'ball-wide' || log.className === 'ball-noball') {
             runsThisOver += 1;
           }
           return (
            <div key={`extra-${i}`} className={`ball-result ${log.className}`}>
              {log.text}
            </div>
           );
        })}
      </div>
      
      <div className={styles.footer}>
        <span className={styles.runs}>{runsThisOver}</span> runs
      </div>
    </div>
  );
}
