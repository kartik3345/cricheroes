import React, { useState } from 'react';
import { SavedMatch } from '../../hooks/useRecentMatches';
import { calculateMatchAwards } from '../../utils/cricketLogic';
import { IconCrown, IconCricketBat, IconBaseball, IconTrophy } from '../icons/SvgIcons';
import styles from './MatchSummaryModal.module.css';

interface Props {
  match: SavedMatch;
  onClose: () => void;
}

function Avatar({ photo, name }: { photo?: string; name: string }) {
  if (photo) return <img src={photo} alt={name} className={styles.avatar} />;
  return <div className={styles.textAvatar}>{name.substring(0, 2).toUpperCase()}</div>;
}

function formatBalls(balls: number): string {
  const overs = Math.floor(balls / 6);
  const rem = balls % 6;
  return `${overs}.${rem}`;
}

export default function MatchSummaryModal({ match, onClose }: Props) {
  const s = match.state;
  const [activeTab, setActiveTab] = useState<'overview' | 'batting' | 'bowling'>('overview');

  const awards = calculateMatchAwards(
    s.innings1BattingStats,
    s.innings1BowlingStats,
    s.innings2BattingStats,
    s.innings2BowlingStats
  );

  const inn1BatStats = Object.values(s.innings1BattingStats).filter(p => p.balls > 0 || p.status !== 'Yet to bat');
  const inn2BatStats = Object.values(s.innings2BattingStats).filter(p => p.balls > 0 || p.status !== 'Yet to bat');
  const inn1BowlStats = Object.values(s.innings1BowlingStats).filter(p => p.balls > 0 || p.overs > 0);
  const inn2BowlStats = Object.values(s.innings2BowlingStats).filter(p => p.balls > 0 || p.overs > 0);

  const matchDate = new Date(match.savedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.matchMeta}>
              <span className={styles.matchDate}>{matchDate}</span>
              {s.venue && <span className={styles.venue}>📍 {s.venue}</span>}
              <span className={styles.format}>{s.overs} Overs</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* Scoreline */}
          <div className={styles.scoreline}>
            <div className={styles.teamBlock}>
              <div className={styles.teamName}>{s.teamBattingFirst || s.teamAName}</div>
              <div className={styles.teamScore}>
                {s.innings1Score}/{s.innings1Wickets}
                <span className={styles.overs}>({formatBalls(s.innings1Balls)})</span>
              </div>
            </div>
            <div className={styles.vsCircle}>VS</div>
            <div className={`${styles.teamBlock} ${styles.teamBlockRight}`}>
              <div className={styles.teamName}>{s.teamBowlingFirst || s.teamBName}</div>
              <div className={styles.teamScore}>
                {s.innings2Score}/{s.innings2Wickets}
                <span className={styles.overs}>({formatBalls(s.innings2Balls)})</span>
              </div>
            </div>
          </div>

          <div className={styles.resultBanner}>
            <IconTrophy size={16} />
            {s.statusText}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(['overview', 'batting', 'bowling'] as const).map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.body}>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <h3 className={styles.sectionTitle}>Match Awards</h3>
              <div className={styles.awardsGrid}>
                {awards.potmPlayer && (
                  <div className={`${styles.awardCard} ${styles.potmCard}`}>
                    <div className={styles.awardLabel}>
                      <IconCrown size={16} className={styles.iconGold} />
                      Player of the Match
                    </div>
                    <div className={styles.awardPlayer}>
                      <Avatar photo={awards.potmPlayer.photo} name={awards.potmPlayer.name} />
                      <div>
                        <div className={styles.playerName}>{awards.potmPlayer.name}</div>
                        <div className={styles.playerTeam}>{awards.potmPlayer.team}</div>
                      </div>
                    </div>
                    <div className={styles.awardStats}>
                      {awards.potmPlayer.runs > 0 && <span>{awards.potmPlayer.runs} runs</span>}
                      {awards.potmPlayer.wickets > 0 && <span>{awards.potmPlayer.wickets} wkts</span>}
                    </div>
                  </div>
                )}
                {awards.bestBatsman && (
                  <div className={styles.awardCard}>
                    <div className={styles.awardLabel}>
                      <IconCricketBat size={16} className={styles.iconCyan} />
                      Best Batsman
                    </div>
                    <div className={styles.awardPlayer}>
                      <Avatar photo={awards.bestBatsman.photo} name={awards.bestBatsman.name} />
                      <div>
                        <div className={styles.playerName}>{awards.bestBatsman.name}</div>
                        <div className={styles.playerTeam}>{awards.bestBatsman.team}</div>
                      </div>
                    </div>
                    <div className={styles.awardStats}>
                      <span>{awards.bestBatsman.runs} ({awards.bestBatsman.balls}b)</span>
                      <span>SR: {((awards.bestBatsman.runs / (awards.bestBatsman.balls || 1)) * 100).toFixed(0)}</span>
                    </div>
                  </div>
                )}
                {awards.bestBowler && (
                  <div className={styles.awardCard}>
                    <div className={styles.awardLabel}>
                      <IconBaseball size={16} className={styles.iconGreen} />
                      Best Bowler
                    </div>
                    <div className={styles.awardPlayer}>
                      <Avatar photo={awards.bestBowler.photo} name={awards.bestBowler.name} />
                      <div>
                        <div className={styles.playerName}>{awards.bestBowler.name}</div>
                        <div className={styles.playerTeam}>{awards.bestBowler.team}</div>
                      </div>
                    </div>
                    <div className={styles.awardStats}>
                      <span>{awards.bestBowler.wickets}/{awards.bestBowler.runs}</span>
                      <span>Econ: {(awards.bestBowler.runs / (Math.floor(awards.bestBowler.balls / 6) + (awards.bestBowler.balls % 6) / 10 || 1)).toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fall of Wickets */}
              {(s.innings1Fow.length > 0 || s.innings2Fow.length > 0) && (
                <div className={styles.fowSection}>
                  <h3 className={styles.sectionTitle}>Fall of Wickets</h3>
                  {s.innings1Fow.length > 0 && (
                    <div className={styles.fowBlock}>
                      <div className={styles.fowTeam}>{s.teamBattingFirst}</div>
                      <div className={styles.fowList}>
                        {s.innings1Fow.map((f, i) => (
                          <span key={i} className={styles.fowEntry}>{f.score}-{f.wicketNum} ({f.batsman}, {f.overs})</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {s.innings2Fow.length > 0 && (
                    <div className={styles.fowBlock}>
                      <div className={styles.fowTeam}>{s.teamBowlingFirst}</div>
                      <div className={styles.fowList}>
                        {s.innings2Fow.map((f, i) => (
                          <span key={i} className={styles.fowEntry}>{f.score}-{f.wicketNum} ({f.batsman}, {f.overs})</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BATTING TAB */}
          {activeTab === 'batting' && (
            <div className={styles.statsTab}>
              {inn1BatStats.length > 0 && (
                <div className={styles.inningBlock}>
                  <div className={styles.inningHeader}>{s.teamBattingFirst} — {s.innings1Score}/{s.innings1Wickets} ({formatBalls(s.innings1Balls)} ov)</div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Batsman</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn1BatStats.sort((a,b) => b.runs - a.runs).map((p, i) => (
                        <tr key={i}>
                          <td className={styles.playerCell}>{p.name}</td>
                          <td className={styles.bold}>{p.runs}</td>
                          <td>{p.balls}</td>
                          <td>{p.fours}</td>
                          <td>{p.sixes}</td>
                          <td>{p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(0) : '-'}</td>
                          <td className={styles.statusCell}>{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {inn2BatStats.length > 0 && (
                <div className={styles.inningBlock}>
                  <div className={styles.inningHeader}>{s.teamBowlingFirst} — {s.innings2Score}/{s.innings2Wickets} ({formatBalls(s.innings2Balls)} ov)</div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Batsman</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn2BatStats.sort((a,b) => b.runs - a.runs).map((p, i) => (
                        <tr key={i}>
                          <td className={styles.playerCell}>{p.name}</td>
                          <td className={styles.bold}>{p.runs}</td>
                          <td>{p.balls}</td>
                          <td>{p.fours}</td>
                          <td>{p.sixes}</td>
                          <td>{p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(0) : '-'}</td>
                          <td className={styles.statusCell}>{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* BOWLING TAB */}
          {activeTab === 'bowling' && (
            <div className={styles.statsTab}>
              {inn1BowlStats.length > 0 && (
                <div className={styles.inningBlock}>
                  <div className={styles.inningHeader}>Bowling vs {s.teamBattingFirst}</div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn1BowlStats.sort((a,b) => b.wickets - a.wickets).map((p, i) => (
                        <tr key={i}>
                          <td className={styles.playerCell}>{p.name}</td>
                          <td>{Math.floor(p.balls / 6)}.{p.balls % 6}</td>
                          <td>{p.maidens}</td>
                          <td>{p.runs}</td>
                          <td className={styles.bold}>{p.wickets}</td>
                          <td>{((p.runs / (Math.floor(p.balls / 6) + (p.balls % 6) / 10)) || 0).toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {inn2BowlStats.length > 0 && (
                <div className={styles.inningBlock}>
                  <div className={styles.inningHeader}>Bowling vs {s.teamBowlingFirst}</div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn2BowlStats.sort((a,b) => b.wickets - a.wickets).map((p, i) => (
                        <tr key={i}>
                          <td className={styles.playerCell}>{p.name}</td>
                          <td>{Math.floor(p.balls / 6)}.{p.balls % 6}</td>
                          <td>{p.maidens}</td>
                          <td>{p.runs}</td>
                          <td className={styles.bold}>{p.wickets}</td>
                          <td>{((p.runs / (Math.floor(p.balls / 6) + (p.balls % 6) / 10)) || 0).toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
