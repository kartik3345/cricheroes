import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { IconX, IconBaseball } from '../icons/SvgIcons';
import styles from './BowlerSelectionModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BowlerSelectionModal({ isOpen, onClose }: Props) {
  const { state, dispatch } = useMatch();
  
  if (!isOpen || !state) return null;

  const bowlingSquad = state.innings === 1 ? state.squadBowlingFirst : state.squadBattingFirst;

  const handleSelect = (bowler: string) => {
    dispatch({ type: 'SET_BOWLER', payload: { bowler } });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <IconBaseball size={20} className={styles.icon} />
            <h2 className={styles.title}>Select Next Bowler</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IconX size={24} />
          </button>
        </div>

        <div className={styles.list}>
          {bowlingSquad.map(player => {
            const stats = state.bowlingStats[player.name] || { overs: 0, runs: 0, wickets: 0 };
            const isCurrent = state.currentBowler === player.name;
            const isLast = state.lastBowler === player.name;
            const canBowl = !isCurrent && !isLast; // Can't bowl two overs in a row
            
            return (
              <button 
                key={player.name}
                className={`${styles.playerCard} ${!canBowl ? styles.disabled : ''}`}
                onClick={() => canBowl && handleSelect(player.name)}
                disabled={!canBowl}
              >
                <div className={styles.playerInfo}>
                  {player.photo ? (
                    <img src={player.photo} alt={player.name} className={styles.avatar} />
                  ) : (
                    <div className={styles.textAvatar}>{player.name.substring(0, 1)}</div>
                  )}
                  <span className={styles.name}>{player.name}</span>
                  {isCurrent && <span className={styles.currentBadge}>Current</span>}
                  {isLast && !isCurrent && <span className={styles.currentBadge} style={{ background: '#f59e0b', color: '#000' }}>Just Bowled</span>}
                </div>
                <div className={styles.stats}>
                  <span>{stats.overs} O</span>
                  <span>{stats.wickets} W</span>
                  <span>{stats.runs} R</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
