import React from 'react';
import { MatchProvider, useMatch } from '../context/MatchContext';
import { MatesProvider } from '../context/MatesContext';
import Header from '../components/layout/Header';
import DashboardView from '../components/dashboard/DashboardView';
import ActiveMatchView from '../components/scoring/ActiveMatchView';
import TossModal from '../components/modals/TossModal';
import InningsStartModal from '../components/modals/InningsStartModal';
import { ToastContainer } from '../components/ui/ToastContainer';
import styles from './ScorecardApp.module.css';

function ScorecardAppContent() {
  const { state } = useMatch();

  // If no match state or phase is none, show dashboard
  // If phase is toss, setup, or playing, show active match view
  // Overlays (modals) handle their own visibility based on phase

  const showDashboard = !state;

  return (
    <div className={styles.appContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        {showDashboard ? (
          <DashboardView />
        ) : (
          <ActiveMatchView />
        )}
      </main>

      <TossModal />
      <InningsStartModal />
      <ToastContainer />
    </div>
  );
}

export default function ScorecardApp() {
  // Wrap in providers here
  return (
    <MatesProvider>
      <MatchProvider>
        <ScorecardAppContent />
      </MatchProvider>
    </MatesProvider>
  );
}
