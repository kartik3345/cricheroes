import React from 'react';
import { Mate, SquadPlayer } from '../../types/cricket';
import styles from './SquadSelector.module.css';

interface Props {
  label: string;
  mates: Mate[];
  selected: SquadPlayer[];
  onToggle: (player: SquadPlayer) => void;
}

export default function SquadSelector({ label, mates, selected, onToggle }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>{selected.length} Selected</span>
      </div>
      
      <div className={styles.grid}>
        {mates.length === 0 && (
          <div className={styles.empty}>No players available in database.</div>
        )}
        {mates.map(mate => {
          const isSelected = selected.some(p => p.name === mate.name);
          return (
            <div 
              key={mate.name} 
              className={`${styles.chip} ${isSelected ? styles.selected : ''}`}
              onClick={() => onToggle({ name: mate.name, role: mate.role, photo: mate.photo })}
            >
              {mate.photo ? (
                <img src={mate.photo} alt={mate.name} className={styles.avatar} />
              ) : (
                <div className={styles.textAvatar}>{mate.name.substring(0,1)}</div>
              )}
              <div className={styles.info}>
                <span className={styles.name}>{mate.name}</span>
                <span className={styles.role}>{mate.role}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
