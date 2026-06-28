import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import ScoreHeader from './ScoreHeader';
import BallTracker from './BallTracker';
import ManualScoringPad from './ManualScoringPad';
import SimulationControls from './SimulationControls';
import TabBar from '../tabs/TabBar';
import BattingTab from '../tabs/BattingTab';
import BowlingTab from '../tabs/BowlingTab';
import CommentaryTab from '../tabs/CommentaryTab';
import PartnershipsTab from '../tabs/PartnershipsTab';
import GraphsTab from '../tabs/GraphsTab';
import FullScorecardTab from '../tabs/FullScorecardTab';
import PostMatchPresentation from '../ui/PostMatchPresentation';
import ChangeBatsmanModal from '../modals/ChangeBatsmanModal';
import BowlerSelectionModal from '../modals/BowlerSelectionModal';
import styles from './ActiveMatchView.module.css';

export default function ActiveMatchView() {
  const { state, dispatch, isAdmin } = useMatch();
  const [activeTab, setActiveTab] = useState('batting');
  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);

  if (!state) return null;

  // Check if we need to prompt for next batsman (wicket fell, not end of innings)
  // Or end of over
  const needsBatsman = (state.currentBatsmanStrike === '' || state.currentBatsmanNonStrike === '') 
                        && state.phase === 'playing'
                        && !state.isCompleted 
                        && state.wickets < (state.squadBattingFirst.length - 1);
  const needsBowler = state.currentBowler === '' && state.phase === 'playing' && !state.isCompleted;

  const showFullScorecard = state.isCompleted || state.innings > 2;

  // Automatically switch tab if match is complete
  if (showFullScorecard && activeTab !== 'fullScorecard' && activeTab !== 'commentary' && activeTab !== 'graphs') {
    setActiveTab('fullScorecard');
  }

  return (
    <div className={styles.container}>
      <ScoreHeader />
      
      {!state.isCompleted && state.phase !== 'innings_break' && (
        <div className={styles.controlsRow}>
          <div className={styles.ballTrackerCol}>
            <BallTracker />
          </div>
          <div className={styles.actionCol}>
            {isAdmin ? (
              state.mode === 'manual' ? (
                <ManualScoringPad 
                  onChangeBatsman={() => setShowBatsmanModal(true)} 
                  onChangeBowler={() => setShowBowlerModal(true)} 
                />
              ) : (
                <SimulationControls />
              )
            ) : (
              <div className={`glass-card ${styles.viewerIndicator}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-red)', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                  <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>LIVE MATCH</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>You are watching live updates. Scoring controls are hidden.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {state.phase === 'innings_break' && (
        <div className={`glass-card ${styles.inningsBreakCard}`} style={{ textAlign: 'center', padding: '32px', margin: '16px 0' }}>
          <h2 style={{ color: 'var(--accent-gold)' }}>Innings 1 Complete</h2>
          <p style={{ margin: '16px 0', fontSize: '1.2rem' }}>
            Target for {state.teamBattingFirst === state.teamAName ? state.teamBName : state.teamAName}: <strong>{state.score + 1}</strong>
          </p>
          {isAdmin ? (
            <button 
              className={styles.startBtn} 
              onClick={() => dispatch({ type: 'START_INNINGS_2' })}
            >
              Start Innings 2
            </button>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Waiting for admin to start second innings...</p>
          )}
        </div>
      )}

      {state.isCompleted && (
        <PostMatchPresentation state={state} />
      )}

      <div className={styles.tabsSection}>
        <TabBar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          showFullScorecard={showFullScorecard} 
        />
        
        <div className={styles.tabContent}>
          {activeTab === 'batting' && !showFullScorecard && <BattingTab />}
          {activeTab === 'bowling' && !showFullScorecard && <BowlingTab />}
          {activeTab === 'fullScorecard' && showFullScorecard && <FullScorecardTab />}
          {activeTab === 'commentary' && <CommentaryTab />}
          {activeTab === 'partnerships' && <PartnershipsTab />}
          {activeTab === 'graphs' && <GraphsTab />}
        </div>
      </div>

      {/* Prompts for missing players */}
      {needsBatsman && !showBatsmanModal && (
        <div className={styles.promptOverlay}>
          <div className={styles.promptBox}>
            <p>Select next batsman to continue.</p>
            <button onClick={() => setShowBatsmanModal(true)}>Select Batsman</button>
          </div>
        </div>
      )}

      {needsBowler && !showBowlerModal && (
        <div className={styles.promptOverlay}>
          <div className={styles.promptBox}>
            <p>Select next bowler for the new over.</p>
            <button onClick={() => setShowBowlerModal(true)}>Select Bowler</button>
          </div>
        </div>
      )}

      <ChangeBatsmanModal isOpen={showBatsmanModal} onClose={() => setShowBatsmanModal(false)} />
      <BowlerSelectionModal isOpen={showBowlerModal} onClose={() => setShowBowlerModal(false)} />
    </div>
  );
}
