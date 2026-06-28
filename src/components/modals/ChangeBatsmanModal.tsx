import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMatch } from '../../context/MatchContext';
import { IconSwap, IconX } from '../icons/SvgIcons';
import styles from './ChangeBatsmanModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeBatsmanModal({ isOpen, onClose }: Props) {
  const { state, dispatch } = useMatch();
  const [manualRole, setManualRole] = useState<'strike' | 'nonstrike' | null>(null);

  if (!isOpen || !state) return null;

  const battingSquad = state.innings === 1 ? state.squadBattingFirst : state.squadBowlingFirst;
  
  const striker = state.currentBatsmanStrike;
  const nonStriker = state.currentBatsmanNonStrike;

  const autoRole = !striker ? 'strike' : !nonStriker ? 'nonstrike' : null;
  const activeRole = manualRole || autoRole;

  const handleReplace = (newBatsman: string) => {
    if (activeRole) {
      dispatch({ type: 'REPLACE_BATSMAN', payload: { oldRole: activeRole, newBatsman } });
      setManualRole(null);
      onClose();
    }
  };

  const getAvailableBatsmen = () => {
    return battingSquad.filter(p => {
      const pStats = state.battingStats[p.name];
      return !pStats || pStats.status === 'yet to bat';
    });
  };

  const available = getAvailableBatsmen();

  const handleClose = () => {
    setManualRole(null);
    onClose();
  };

  const dialogContent = (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <IconSwap size={24} className={styles.iconCyan} />
            <h2 className={styles.title}>Change Batsman</h2>
          </div>
          {/* Only allow closing if it's a manual change, not a forced wicket replacement */}
          {!autoRole && (
            <button className={styles.closeBtn} onClick={handleClose}>
              <IconX size={24} />
            </button>
          )}
        </div>

        {!activeRole ? (
          <>
            <p className={styles.prompt}>Which batsman is retiring / being replaced?</p>
            <div className={styles.currentPlayers}>
              <button className={styles.playerBtn} onClick={() => setManualRole('strike')}>
                <span className={styles.roleLabel}>Striker</span>
                <span className={styles.playerName}>{striker}</span>
              </button>
              <button className={styles.playerBtn} onClick={() => setManualRole('nonstrike')}>
                <span className={styles.roleLabel}>Non-Striker</span>
                <span className={styles.playerName}>{nonStriker}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.prompt}>Select replacement for <strong>{activeRole === 'strike' ? 'Striker' : 'Non-Striker'}</strong>:</p>
            
            {available.length === 0 ? (
              <p className={styles.noPlayers}>No more batsmen available in squad.</p>
            ) : (
              <div className={styles.list}>
                {available.map(p => (
                  <button key={p.name} className={styles.newPlayerBtn} onClick={() => handleReplace(p.name)}>
                    {p.photo ? (
                      <img src={p.photo} alt={p.name} className={styles.avatar} />
                    ) : (
                      <div className={styles.textAvatar}>{p.name.substring(0,1)}</div>
                    )}
                    <span className={styles.name}>{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Only show back button if they manually selected a role to replace */}
            {!autoRole && (
              <button className={styles.backBtn} onClick={() => setManualRole(null)}>Back</button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
