import React from 'react';
import { useMatch } from '../../context/MatchContext';
import { useSimulation } from '../../hooks/useSimulation';
import { IconPlay, IconPause, IconZap, IconReset } from '../icons/SvgIcons';
import styles from './SimulationControls.module.css';

export default function SimulationControls() {
  const { state, dispatch } = useMatch();
  const { isPlaying, speed, play, pause, cycleSpeed } = useSimulation(dispatch, state);

  return (
    <div className={`glass-card ${styles.controls}`}>
      <div className={styles.status}>
        <div className={styles.statusIndicator}>
          <div className={`${styles.dot} ${isPlaying ? styles.dotActive : ''}`}></div>
          <span className={styles.statusText}>{isPlaying ? 'Simulation Running' : 'Simulation Paused'}</span>
        </div>
      </div>
      
      <div className={styles.btnRow}>
        {!isPlaying ? (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={play}>
            <IconPlay size={24} /> Play
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.btnWarning}`} onClick={pause}>
            <IconPause size={24} /> Pause
          </button>
        )}
        
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={cycleSpeed}>
          <IconZap size={20} /> {speed}x Speed
        </button>
      </div>
      
      <div className={styles.actionRow}>
        <button 
          className={styles.resetBtn}
          onClick={() => {
            if (window.confirm('Are you sure you want to reset this match?')) {
              pause();
              dispatch({ type: 'RESET_MATCH' });
            }
          }}
        >
          <IconReset size={16} /> Reset Match
        </button>
      </div>
    </div>
  );
}
