import React, { useEffect, useState } from 'react';
import styles from './PreLoader.module.css';

export default function PreLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.preloader}>
      <div className={styles.spinner}>
        <div className={styles.spinnerInner}></div>
      </div>
      <h2 className={styles.title}>CricLover</h2>
    </div>
  );
}
