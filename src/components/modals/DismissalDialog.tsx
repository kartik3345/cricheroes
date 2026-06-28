import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { WicketType } from '../../types/cricket';
import { IconWicket, IconX } from '../icons/SvgIcons';
import styles from './DismissalDialog.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: (wicketType: WicketType, dismissedRole?: 'strike' | 'nonstrike') => void;
}

const WICKET_TYPES: WicketType[] = [
  'Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Retired Hurt'
];

export default function DismissalDialog({ isOpen, onClose, onDismiss }: Props) {
  if (!isOpen) return null;

  const handleSelectType = (type: WicketType) => {
    // Always assume striker is dismissed by default
    onDismiss(type, 'strike');
    onClose();
  };

  const dialogContent = (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <IconWicket size={24} className={styles.iconRed} />
            <h2 className={styles.title}>Wicket Fall</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IconX size={24} />
          </button>
        </div>

        <p className={styles.prompt}>How was the batsman dismissed?</p>
        <div className={styles.grid}>
          {WICKET_TYPES.map(type => (
            <button 
              key={type} 
              className={styles.typeBtn}
              onClick={() => handleSelectType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
