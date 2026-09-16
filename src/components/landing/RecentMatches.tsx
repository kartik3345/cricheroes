import React, { useState } from 'react';
import { useRecentMatches, SavedMatch } from '../../hooks/useRecentMatches';
import MatchSummaryModal from './MatchSummaryModal';
import { IconTrophy } from '../icons/SvgIcons';
import styles from './RecentMatches.module.css';

function formatBalls(balls: number): string {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface MatchCardProps {
  match: SavedMatch;
  onClick: () => void;
}

function MatchCard({ match, onClick }: MatchCardProps) {
  const s = match.state;
  const winner = s.statusText;

  return (
    <button className={styles.card} onClick={onClick}>
      <div className={styles.cardTop}>
        <span className={styles.format}>{s.overs} Overs</span>
        {s.venue && <span className={styles.venue}>{s.venue}</span>}
        <span className={styles.time}>{timeAgo(match.savedAt)}</span>
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>
          <div className={styles.teamName}>{match.teamA}</div>
          <div className={styles.score}>
            {match.innings1Score}
            <span className={styles.wkts}>/{match.innings1Wickets}</span>
            <span className={styles.ov}>({formatBalls(s.innings1Balls)})</span>
          </div>
        </div>

        <div className={styles.vsBadge}>VS</div>

        <div className={`${styles.team} ${styles.teamRight}`}>
          <div className={styles.teamName}>{match.teamB}</div>
          <div className={styles.score}>
            {match.innings2Score}
            <span className={styles.wkts}>/{match.innings2Wickets}</span>
            <span className={styles.ov}>({formatBalls(s.innings2Balls)})</span>
          </div>
        </div>
      </div>

      <div className={styles.result}>
        <IconTrophy size={12} />
        <span>{winner}</span>
      </div>

      <div className={styles.viewHint}>Tap for full summary →</div>
    </button>
  );
}

export default function RecentMatches() {
  const matches = useRecentMatches();
  const [selectedMatch, setSelectedMatch] = useState<SavedMatch | null>(null);

  if (matches.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Matches</h2>
        <span className={styles.count}>{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
      </div>

      <div className={styles.grid}>
        {matches.map(m => (
          <MatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />
        ))}
      </div>

      {selectedMatch && (
        <MatchSummaryModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
