import React from 'react';
import CreateMatchForm from './CreateMatchForm';
import JoinLiveForm from './JoinLiveForm';
import MatesDatabase from './MatesDatabase';
import styles from './DashboardView.module.css';

export default function DashboardView() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, Scorer.</h1>
        <p className={styles.subtitle}>Start a new match or manage your database.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <CreateMatchForm />
        </div>
        
        <div className={styles.sideColumn}>
          <JoinLiveForm />
          <MatesDatabase />
        </div>
      </div>
    </div>
  );
}
