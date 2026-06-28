import React, { useEffect, useRef, useState } from 'react';
import { IconZap, IconBarChart, IconUsers, IconGlobe, IconShield, IconTrophy } from '../icons/SvgIcons';
import styles from './FeaturesGrid.module.css';

export default function FeaturesGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <IconZap size={24} />,
      title: 'Real-Time Scoring',
      desc: 'Ball-by-ball live scoring with ultra-low latency updates.',
      color: 'cyan'
    },
    {
      icon: <IconBarChart size={24} />,
      title: 'Advanced Analytics',
      desc: 'Worm charts, Manhattan graphs, and partnership breakdowns.',
      color: 'green'
    },
    {
      icon: <IconUsers size={24} />,
      title: 'Team Management',
      desc: 'Manage squads, track individual player stats across matches.',
      color: 'purple'
    },
    {
      icon: <IconGlobe size={24} />,
      title: 'Live Sharing',
      desc: 'Share live match links with fans to spectate anywhere.',
      color: 'gold'
    },
    {
      icon: <IconShield size={24} />,
      title: 'Smart Simulation',
      desc: 'AI-powered match simulation for practicing strategies.',
      color: 'red'
    },
    {
      icon: <IconTrophy size={24} />,
      title: 'Match Awards',
      desc: 'Automated POTM, best batsman, and bowler calculations.',
      color: 'orange'
    }
  ];

  return (
    <section id="features" ref={sectionRef} className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Pro-Level Features</h2>
          <p className={styles.subtitle}>Everything you need to score local matches like international broadcasts.</p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`${styles.card} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`${styles.iconWrapper} ${styles[feature.color]}`}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
