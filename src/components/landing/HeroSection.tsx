import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconZap } from '../icons/SvgIcons';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.orbs}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={styles.orb} style={{top:'40%',right:'15%',width:'350px',height:'350px',background:'var(--accent-green)',animation:'orbFloat2 25s infinite ease-in-out'}}></div>
        <div className={styles.orb} style={{bottom:'10%',left:'30%',width:'500px',height:'500px',background:'var(--accent-purple)',animation:'orbFloat3 22s infinite ease-in-out'}}></div>
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
              Let's Play Cricket
              <IconArrowRight size={18} />
            </Link>
            <button onClick={scrollToFeatures} className={styles.btnSecondary}>
              Explore Features
            </button>
          </div>
        </div>

        {/* Cricket Field Illustration */}
        <div className={styles.fieldIllustration}>
          <svg viewBox="0 0 400 400" className={styles.fieldSvg} aria-label="Cricket field">
            {/* Outer oval */}
            <ellipse cx="200" cy="200" rx="185" ry="185" fill="none" stroke="rgba(0,245,160,0.15)" strokeWidth="2" />
            <ellipse cx="200" cy="200" rx="185" ry="185" fill="rgba(0,245,160,0.03)" />
            {/* Inner circle */}
            <ellipse cx="200" cy="200" rx="100" ry="100" fill="none" stroke="rgba(0,245,160,0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
            {/* Pitch rectangle */}
            <rect x="182" y="130" width="36" height="140" rx="4" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" />
            {/* Crease lines */}
            <line x1="176" y1="155" x2="224" y2="155" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <line x1="176" y1="245" x2="224" y2="245" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            {/* Stumps top */}
            <line x1="192" y1="145" x2="192" y2="158" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <line x1="200" y1="143" x2="200" y2="158" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <line x1="208" y1="145" x2="208" y2="158" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            {/* Stumps bottom */}
            <line x1="192" y1="242" x2="192" y2="255" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <line x1="200" y1="242" x2="200" y2="257" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <line x1="208" y1="242" x2="208" y2="255" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            {/* Ball trajectory arc */}
            <path d="M 200 245 Q 270 180 310 120" stroke="rgba(0,217,245,0.6)" strokeWidth="2" fill="none" strokeDasharray="5 3" markerEnd="url(#arrowhead)" />
            {/* Ball */}
            <circle cx="310" cy="120" r="9" fill="rgba(239,68,68,0.9)" />
            <circle cx="310" cy="120" r="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <path d="M 305 117 Q 310 115 315 118" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
            {/* Bat */}
            <rect x="188" y="236" width="10" height="26" rx="2" fill="rgba(251,191,36,0.8)" transform="rotate(-25 193 249)" />
            {/* Fielder dots */}
            <circle cx="120" cy="120" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="280" cy="120" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="80" cy="200" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="320" cy="200" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="140" cy="310" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="260" cy="310" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="200" cy="50" r="5" fill="rgba(0,245,160,0.5)" />
            <circle cx="200" cy="350" r="5" fill="rgba(0,245,160,0.5)" />
            {/* Center dot */}
            <circle cx="200" cy="200" r="4" fill="rgba(251,191,36,0.6)" />
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(0,217,245,0.6)" />
              </marker>
            </defs>
          </svg>
          <div className={styles.fieldGlow} />
        </div>
      </div>
    </section>
  );
}
