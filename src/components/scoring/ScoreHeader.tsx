import React from 'react';
import { useMatch } from '../../context/MatchContext';
import { IconMapPin, IconBolt, IconSignal } from '../icons/SvgIcons';
import styles from './ScoreHeader.module.css';

export default function ScoreHeader() {
  const { state, isAdmin, matchCode } = useMatch();
  
  if (!state) return null;

  const getOversString = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

  const isInnings1 = state.innings === 1;
  const leftTeamName = state.teamBattingFirst;
  const rightTeamName = state.teamBowlingFirst;

  const target = isInnings1 ? null : state.innings1Score + 1;
  const runsNeeded = target ? target - state.score : null;
  const ballsRemaining = (state.overs * 6) - state.balls;

  const crr = state.balls > 0 ? (state.score / (state.balls / 6)).toFixed(2) : '0.00';
  const rrr = target && ballsRemaining > 0 ? (runsNeeded! / (ballsRemaining / 6)).toFixed(2) : '-';

  return (
    <div className={`glass-card ${styles.header}`} style={{ position: 'relative' }}>
      {isAdmin && matchCode && (
        <div style={{ position: 'absolute', top: '8px', right: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Code:</span>
          <strong style={{ color: 'var(--accent-gold)', letterSpacing: '2px', fontSize: '0.9rem' }}>{matchCode}</strong>
        </div>
      )}
      <div className={styles.mainScoreRow}>
        
        <div className={`${styles.team} ${styles.teamLeft}`}>
          <div className={styles.teamName}>{leftTeamName}</div>
          <div className={styles.scoreBlock}>
            {isInnings1 ? (
              <>
                <span className={styles.score}>{state.score}/{state.wickets}</span>
                <span className={styles.overs}>({getOversString(state.balls)})</span>
              </>
            ) : (
              <>
                <span className={styles.scoreInactive}>{state.innings1Score}/{state.innings1Wickets}</span>
                <span className={styles.oversInactive}>({getOversString(state.innings1Balls)})</span>
              </>
            )}
          </div>
        </div>

        <div className={styles.vsBadge}>VS</div>

        <div className={`${styles.team} ${styles.teamRight}`}>
          <div className={styles.teamName}>{rightTeamName}</div>
          <div className={styles.scoreBlock}>
            {!isInnings1 ? (
              <>
                <span className={styles.overs}>({getOversString(state.balls)})</span>
                <span className={styles.score}>{state.score}/{state.wickets}</span>
              </>
            ) : (
              <span className={styles.yetToBat}>Yet to bat</span>
            )}
          </div>
        </div>

      </div>

      <div className={styles.statsRow}>
        <div className={styles.statGroup}>
          <span className={styles.statLabel}>CRR</span>
          <span className={styles.statValue}>{crr}</span>
        </div>
        {!isInnings1 && !state.isCompleted && (
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>REQ</span>
            <span className={styles.statValue}>{rrr}</span>
          </div>
        )}
        {!isInnings1 && target && !state.isCompleted && (
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>TARGET</span>
            <span className={styles.statValue}>{target}</span>
          </div>
        )}
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusGlow}>{state.statusText}</div>
      </div>

      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <IconMapPin size={14} className={styles.metaIcon} />
          {state.venue}
        </div>
        {state.balls < state.powerplayOvers * 6 && (
          <div className={styles.metaItem}>
            <IconBolt size={14} className={styles.metaIconGold} />
            P1 (1-{state.powerplayOvers})
          </div>
        )}
        {state.syncId && (
          <div className={styles.metaItem}>
            <IconSignal size={14} className={styles.metaIconGreen} />
            ID: {state.syncId}
          </div>
        )}
      </div>
    </div>
  );
}
