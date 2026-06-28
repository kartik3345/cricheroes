import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconCricketBall, IconSun, IconMoon, IconX } from '../icons/SvgIcons';
import { useMatch } from '../../context/MatchContext';
import styles from './Header.module.css';

export default function Header() {
  const { state, dispatch } = useMatch();
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const toggleTheme = () => setIsLight(!isLight);
  
  const exitMatch = () => {
    if (window.confirm("Are you sure you want to exit the match?")) {
      dispatch({ type: 'CLEAR_MATCH' });
    }
  };

  const isMatchActive = state && !state.isCompleted;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <IconCricketBall className={styles.logoIcon} />
          <span className={styles.logoText}>CricHeroes</span>
        </Link>
        
        <div className={styles.controls}>
          {isMatchActive && (
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              LIVE
            </div>
          )}
          
          <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme">
            {isLight ? <IconMoon size={20} /> : <IconSun size={20} />}
          </button>
          
          {state && (
            <button className={styles.exitButton} onClick={exitMatch} aria-label="Exit match">
              <IconX size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
