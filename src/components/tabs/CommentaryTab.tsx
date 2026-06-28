import React, { useRef, useEffect } from 'react';
import { useMatch } from '../../context/MatchContext';
import styles from './CommentaryTab.module.css';

export default function CommentaryTab() {
  const { state } = useMatch();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to top when new commentary is added
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [state?.commentary]);

  if (!state) return null;

  return (
    <div className={styles.container} ref={listRef}>
      {state.commentary.length === 0 && (
        <div className={styles.empty}>Match hasn't started yet.</div>
      )}

      {/* Reverse to show latest first */}
      {[...state.commentary].reverse().map((entry, index) => {
        if (entry.isDivider) {
          return (
            <div key={`div-${index}`} className={styles.divider}>
              <span>{entry.text}</span>
            </div>
          );
        }

        let ballClass = '';
        if (entry.runs === 4) ballClass = styles.ballFour;
        else if (entry.runs === 6) ballClass = styles.ballSix;
        else if (entry.isWicket) ballClass = styles.ballWicket;
        else if (entry.isExtra) ballClass = styles.ballExtra;
        
        let runsShort = entry.isWicket ? 'W' : entry.isExtra ? 'E' : entry.runs.toString();

        return (
          <div key={`comm-${index}`} className={styles.entry}>
            <div className={styles.overs}>{entry.ball}</div>
            <div className={`${styles.ballResult} ${ballClass}`}>{runsShort}</div>
            <div className={styles.text}>{entry.text}</div>
          </div>
        );
      })}
    </div>
  );
}
