import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconLive, IconZap } from '../icons/SvgIcons';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.orbs}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        <div className={`${styles.orb} ${styles.orb3}`}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <IconZap size={14} className={styles.badgeIcon} />
            NEXT-GEN CRICKET SCORING
          </div>

          <h1 className={styles.title}>
            Score Every Moment<br />
            <span className={styles.titleHighlight}>Live</span>
          </h1>

          <p className={styles.description}>
            Experience the most advanced cricket scoring platform. Ball-by-ball updates,
            real-time graphs, and professional analytics right in your browser.
          </p>

          <div className={styles.ctaGroup}>
            <Link to="/app" className={styles.btnPrimary}>
              Launch Scoring App
              <IconArrowRight size={18} />
            </Link>
            <button onClick={scrollToFeatures} className={styles.btnSecondary}>
              Explore Features
            </button>
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div className={styles.liveTag}>
              <IconLive size={12} />
              LIVE
            </div>
            <span className={styles.matchFormat}>T20 Final</span>
          </div>

          <div className={styles.previewTeams}>
            <div className={styles.team}>
              <div className={styles.teamName}>Super Kings</div>
              <div className={styles.teamScore}>184/4 <span className={styles.teamOvers}>(20.0)</span></div>
            </div>
            <div className={styles.vsBadge}>VS</div>
            <div className={styles.team}>
              <div className={styles.teamName}>Mumbai Indians</div>
              <div className={styles.teamScoreActive}>162/3 <span className={styles.teamOvers}>(17.4)</span></div>
            </div>
          </div>

          <div className={styles.previewFooter}>
            <span className={styles.targetText}>Need 23 runs from 14 balls</span>
            <div className={styles.currentRunRate}>CRR: 9.16 | RRR: 9.85</div>
          </div>
        </div>
      </div>
    </section>
  );
}
