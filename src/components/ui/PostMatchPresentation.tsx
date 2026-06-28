import React from 'react';
import { MatchState } from '../../types/cricket';
import { calculateMatchAwards } from '../../utils/cricketLogic';
import { IconCrown, IconCricketBat, IconBaseball } from '../icons/SvgIcons';
import styles from './PostMatchPresentation.module.css';

interface Props {
  state: MatchState;
}

function Avatar({ photo, name }: { photo: string, name: string }) {
  if (photo) return <img src={photo} alt={name} className={styles.avatar} />;
  return <div className={styles.textAvatar}>{name.substring(0, 2)}</div>;
}

export default function PostMatchPresentation({ state }: Props) {
  const awards = calculateMatchAwards(
    state.innings1BattingStats,
    state.innings1BowlingStats,
    state.battingStats,
    state.bowlingStats
  );

  return (
    <div className={styles.presentation}>
      <h2 className={styles.title}>Match Awards</h2>
      
      <div className={styles.awardsGrid}>
        {/* Player of the Match */}
        {awards.potmPlayer && (
          <div className={`${styles.awardCard} ${styles.potmCard}`}>
            <div className={styles.awardHeader}>
              <IconCrown size={24} className={styles.iconGold} />
              <span>Player of the Match</span>
            </div>
            <div className={styles.playerInfo}>
              <Avatar photo={awards.potmPlayer.photo || ''} name={awards.potmPlayer.name} />
              <div className={styles.playerName}>{awards.potmPlayer.name}</div>
              <div className={styles.playerScore}>{awards.potmPlayer.score.toFixed(1)} pts</div>
            </div>
            <div className={styles.statsRow}>
              <div>Runs: <strong>{awards.potmPlayer.runs}</strong></div>
              <div>Wickets: <strong>{awards.potmPlayer.wickets}</strong></div>
            </div>
          </div>
        )}

        {/* Best Batsman */}
        {awards.bestBatsman && (
          <div className={styles.awardCard}>
            <div className={styles.awardHeader}>
              <IconCricketBat size={20} className={styles.iconCyan} />
              <span>Best Batsman</span>
            </div>
            <div className={styles.playerInfo}>
              <Avatar photo={awards.bestBatsman.photo || ''} name={awards.bestBatsman.name} />
              <div className={styles.playerName}>{awards.bestBatsman.name}</div>
            </div>
            <div className={styles.statsRow}>
              <div>{awards.bestBatsman.runs} ({awards.bestBatsman.balls})</div>
              <div>SR: {((awards.bestBatsman.runs / (awards.bestBatsman.balls || 1)) * 100).toFixed(0)}</div>
            </div>
          </div>
        )}

        {/* Best Bowler */}
        {awards.bestBowler && (
          <div className={styles.awardCard}>
            <div className={styles.awardHeader}>
              <IconBaseball size={20} className={styles.iconGreen} />
              <span>Best Bowler</span>
            </div>
            <div className={styles.playerInfo}>
              <Avatar photo={awards.bestBowler.photo || ''} name={awards.bestBowler.name} />
              <div className={styles.playerName}>{awards.bestBowler.name}</div>
            </div>
            <div className={styles.statsRow}>
              <div>{awards.bestBowler.wickets}/{awards.bestBowler.runs}</div>
              <div>Econ: {(awards.bestBowler.runs / (awards.bestBowler.overs + (awards.bestBowler.balls % 6) / 10 || 1)).toFixed(1)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
