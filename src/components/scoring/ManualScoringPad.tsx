import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { IconUndo, IconSwap, IconBaseball } from '../icons/SvgIcons';
import DismissalDialog from '../modals/DismissalDialog';
import { WicketType } from '../../types/cricket';
import styles from './ManualScoringPad.module.css';

interface Props {
  onChangeBatsman: () => void;
  onChangeBowler: () => void;
}

export default function ManualScoringPad({ onChangeBatsman, onChangeBowler }: Props) {
  const { dispatch } = useMatch();
  const [showWicketModal, setShowWicketModal] = useState(false);

  const handleRun = (runs: number) => {
    dispatch({ type: 'RECORD_BALL', payload: { ballType: 'run', runs } });
  };

  const handleExtra = (type: 'wd' | 'nb') => {
    dispatch({ type: 'RECORD_BALL', payload: { ballType: type, runs: 0 } });
  };

  const handleWicket = (wicketType: WicketType, dismissedBatsmanType?: 'strike' | 'nonstrike') => {
    dispatch({ type: 'RECORD_BALL', payload: { ballType: 'w', runs: 0, wicketType, dismissedBatsmanType } });
  };

  return (
    <div className={`glass-card ${styles.pad}`}>
      <div className={styles.grid}>
        <button className={`${styles.btn} ${styles.btnMuted}`} onClick={() => handleRun(0)}>0</button>
        <button className={styles.btn} onClick={() => handleRun(1)}>1</button>
        <button className={styles.btn} onClick={() => handleRun(2)}>2</button>
        <button className={styles.btn} onClick={() => handleRun(3)}>3</button>
        <button className={`${styles.btn} ${styles.btnGreen}`} onClick={() => handleRun(4)}>4</button>
        <button className={styles.btn} onClick={() => handleRun(5)}>5</button>
        <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => handleRun(6)}>6</button>
        <button className={`${styles.btn} ${styles.btnPurple}`} onClick={() => handleExtra('wd')}>WD</button>
        <button className={`${styles.btn} ${styles.btnPurple}`} onClick={() => handleExtra('nb')}>NB</button>
        <button className={`${styles.btn} ${styles.btnRed} ${styles.spanAll}`} onClick={() => setShowWicketModal(true)}>
          WICKET
        </button>
      </div>

      <div className={styles.actionRow}>
        {/* UNDO_BALL not implemented in reducer, omit for now */}
        <button className={styles.actionBtn} onClick={() => alert('Undo not supported yet')} title="Undo Last Ball">
          <IconUndo size={18} />
          <span>Undo</span>
        </button>
        <button className={styles.actionBtn} onClick={onChangeBatsman} title="Change Batsman">
          <IconSwap size={18} />
          <span>Batsman</span>
        </button>
        <button className={styles.actionBtn} onClick={onChangeBowler} title="Change Bowler">
          <IconBaseball size={18} />
          <span>Bowler</span>
        </button>
      </div>

      <DismissalDialog 
        isOpen={showWicketModal} 
        onClose={() => setShowWicketModal(false)}
        onDismiss={handleWicket}
      />
    </div>
  );
}
