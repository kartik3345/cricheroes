import React, { useEffect } from 'react';
import ParticleCanvas from '../components/landing/ParticleCanvas';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import { IconCricketBall } from '../components/icons/SvgIcons';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'CricHeroes Live | Premium Cricket Scoring';
  }, []);

  return (
    <div className={styles.landingPage}>
      <ParticleCanvas />
      
      <main className={styles.mainContent}>
        <header className={styles.topNav}>
          <div className={styles.logo}>
            <IconCricketBall className={styles.logoIcon} />
            <span className={styles.logoText}>CricHeroes</span>
          </div>
        </header>

        <HeroSection />
        <StatsBar />
        <FeaturesGrid />
        
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            Built with <IconCricketBall size={16} className={styles.footerIcon} /> by CricHeroes Team
          </div>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} CricHeroes Live. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
