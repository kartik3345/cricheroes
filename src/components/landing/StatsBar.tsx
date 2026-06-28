import React, { useEffect, useRef, useState } from 'react';
import { IconCricketBat, IconUsers, IconBolt, IconStar } from '../icons/SvgIcons';
import styles from './StatsBar.module.css';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

function AnimatedNumber({ value, suffix, isVisible }: { value: number, suffix: string, isVisible: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number;
    const duration = 2000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out quad
      const easeProgress = progress * (2 - progress);
      
      setDisplayValue(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, isVisible]);

  // Handle float values for ratings (like 4.9)
  const formattedValue = value % 1 !== 0 ? (displayValue / 10).toFixed(1) : displayValue;

  return (
    <div className={styles.statValue}>
      {formattedValue}{suffix}
    </div>
  );
}

export default function StatsBar() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: <IconCricketBat size={24} />, value: 50, suffix: 'K+', label: 'Matches Scored' },
    { icon: <IconUsers size={24} />, value: 200, suffix: 'K+', label: 'Users Trust Us' },
    { icon: <IconBolt size={24} />, value: 99.9, suffix: '%', label: 'Uptime Reliability' },
    { icon: <IconStar size={24} />, value: 49, suffix: '', label: 'Star Rating' } // We divide by 10 in render
  ];

  return (
    <section ref={sectionRef} className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.iconWrapper}>{stat.icon}</div>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
