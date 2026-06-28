import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { WicketType } from '../../types/cricket';
import { IconWicket, IconX } from '../icons/SvgIcons';
import styles from './DismissalDialog.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: (wicketType: WicketType, dismissedRole?: 'strike' | 'nonstrike', runsCompleted?: number) => void;
}

const WICKET_TYPES: WicketType[] = [
  'Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Retired Hurt'
];

export default function DismissalDialog({ isOpen, onClose, onDismiss }: Props) {
  const [selectedType, setSelectedType] = useState<WicketType | null>(null);
  const [runs, setRuns] = useState<number>(0);
  const [dismissedRole, setDismissedRole] = useState<'strike' | 'nonstrike'>('strike');

  if (!isOpen) return null;

  const handleSelectType = (type: WicketType) => {
    if (type === 'Run Out' || type === 'Retired Hurt') {
      setSelectedType(type);
      setRuns(0);
      setDismissedRole('strike');
    } else {
      // Direct dismiss for others
      onDismiss(type, 'strike', 0);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (selectedType) {
      onDismiss(selectedType, dismissedRole, runs);
      setSelectedType(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
  };

  const dialogContent = (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <IconWicket size={24} className={styles.iconRed} />
            <h2 className={styles.title}>Wicket Fall</h2>
          </div>
          <button className={styles.closeBtn} onClick={() => { handleCancel(); onClose(); }}>
            <IconX size={24} />
          </button>
        </div>

        {!selectedType ? (
          <>
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
          </>
        ) : (
          <div className={styles.detailsForm}>
            <h3 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>{selectedType} Details</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Who was dismissed?
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`${styles.typeBtn} ${dismissedRole === 'strike' ? styles.selectedType : ''}`}
                  onClick={() => setDismissedRole('strike')}
                  style={{ flex: 1, borderColor: dismissedRole === 'strike' ? 'var(--accent-red)' : '' }}
                >
                  Striker
                </button>
                <button 
                  className={`${styles.typeBtn} ${dismissedRole === 'nonstrike' ? styles.selectedType : ''}`}
                  onClick={() => setDismissedRole('nonstrike')}
                  style={{ flex: 1, borderColor: dismissedRole === 'nonstrike' ? 'var(--accent-red)' : '' }}
                >
                  Non-Striker
                </button>
              </div>
            </div>

            {selectedType === 'Run Out' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Runs completed before wicket?
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[0, 1, 2, 3].map(r => (
                    <button 
                      key={r}
                      className={`${styles.typeBtn} ${runs === r ? styles.selectedType : ''}`}
                      onClick={() => setRuns(r)}
                      style={{ flex: 1, borderColor: runs === r ? 'var(--accent-red)' : '' }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={handleCancel}
                style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Back
              </button>
              <button 
                onClick={handleConfirm}
                style={{ flex: 2, padding: '10px', background: 'var(--accent-red)', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
