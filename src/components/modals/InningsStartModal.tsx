import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { SquadPlayer } from '../../types/cricket';
import { IconCricketBat, IconBaseball } from '../icons/SvgIcons';
import styles from './InningsStartModal.module.css';

function PlayerChip({ player, isSelected, onClick }: { player: SquadPlayer, isSelected: boolean, onClick: () => void }) {
  return (
    <div className={`${styles.chip} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
      {player.photo ? (
        <img src={player.photo} alt={player.name} className={styles.avatar} />
      ) : (
        <div className={styles.textAvatar}>{player.name.substring(0, 1)}</div>
      )}
      <span className={styles.name}>{player.name}</span>
    </div>
  );
}

export default function InningsStartModal() {
  const { state, dispatch, isAdmin } = useMatch();
  
  const [striker, setStriker] = useState<string>('');
  const [nonStriker, setNonStriker] = useState<string>('');
  const [bowler, setBowler] = useState<string>('');

  if (!state || state.phase !== 'setup' || !isAdmin) return null;

  const battingSquad = state.innings === 1 ? state.squadBattingFirst : state.squadBowlingFirst;
  const bowlingSquad = state.innings === 1 ? state.squadBowlingFirst : state.squadBattingFirst;

  const handleStart = () => {
    if (!striker || !nonStriker || !bowler) return;
    
    dispatch({ type: 'SET_OPENERS', payload: { striker, nonStriker } });
    dispatch({ type: 'SET_BOWLER', payload: { bowler } });
    dispatch({ type: 'SET_PHASE', payload: 'playing' });
  };

  const isReady = striker && nonStriker && bowler;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Innings {state.innings} Setup</h2>
        
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconCricketBat size={18} className={styles.iconCyan} />
            Select Striker
          </div>
          <div className={styles.playerList}>
            {battingSquad.map(p => (
              <PlayerChip 
                key={`s-${p.name}`}
                player={p} 
                isSelected={striker === p.name} 
                onClick={() => {
                  if (nonStriker === p.name) setNonStriker('');
                  setStriker(p.name);
                }} 
              />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconCricketBat size={18} className={styles.iconCyan} />
            Select Non-Striker
          </div>
          <div className={styles.playerList}>
            {battingSquad.map(p => (
              <PlayerChip 
                key={`ns-${p.name}`}
                player={p} 
                isSelected={nonStriker === p.name} 
                onClick={() => {
                  if (striker !== p.name) setNonStriker(p.name);
                }} 
              />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconBaseball size={18} className={styles.iconGreen} />
            Select Opening Bowler
          </div>
          <div className={styles.playerList}>
            {bowlingSquad.map(p => (
              <PlayerChip 
                key={`b-${p.name}`}
                player={p} 
                isSelected={bowler === p.name} 
                onClick={() => setBowler(p.name)} 
              />
            ))}
          </div>
        </div>

        <button 
          className={`${styles.startBtn} ${isReady ? styles.ready : ''}`} 
          disabled={!isReady} 
          onClick={handleStart}
        >
          Start Innings
        </button>
      </div>
    </div>
  );
}
