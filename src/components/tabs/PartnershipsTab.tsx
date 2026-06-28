import React from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './PartnershipsTab.module.css';

export default function PartnershipsTab() {
  const { state } = useMatch();
  if (!state) return null;

  const currentStriker = state.battingStats[state.currentBatsmanStrike];
  const currentNonStriker = state.battingStats[state.currentBatsmanNonStrike];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Current Partnership</h3>
      
      {currentStriker && currentNonStriker ? (
        <div className={styles.activePartnership}>
          <div className={styles.playersRow}>
            <div className={styles.playerLeft}>
              <span className={styles.name}>{currentStriker.name}</span>
              <span className={styles.score}>{currentStriker.runs} <span>({currentStriker.balls})</span></span>
            </div>
            <div className={styles.vsBadge}>&</div>
            <div className={styles.playerRight}>
              <span className={styles.score}>{currentNonStriker.runs} <span>({currentNonStriker.balls})</span></span>
              <span className={styles.name}>{currentNonStriker.name}</span>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <div className={styles.barBackground}>
              {(() => {
                const totalRuns = currentStriker.runs + currentNonStriker.runs;
                if (totalRuns === 0) return <div className={styles.barFill} style={{ width: '50%' }}></div>;
                
                const p1Percent = (currentStriker.runs / totalRuns) * 100;
                return (
                  <>
                    <div className={styles.barP1} style={{ width: `${p1Percent}%` }}></div>
                    <div className={styles.barP2} style={{ width: `${100 - p1Percent}%` }}></div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>Waiting for batsmen...</div>
      )}
    </div>
  );
}
