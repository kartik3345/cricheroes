import React from 'react';
import styles from './TabBar.module.css';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showFullScorecard: boolean;
}

export default function TabBar({ activeTab, onTabChange, showFullScorecard }: Props) {
  const allTabs = [
    { id: 'batting', label: 'Batting' },
    { id: 'bowling', label: 'Bowling' },
    { id: 'fullScorecard', label: 'Scorecard' },
    { id: 'commentary', label: 'Commentary' },
    { id: 'partnerships', label: 'Partnerships' },
    { id: 'graphs', label: 'Graphs' }
  ];

  let visibleTabs = allTabs;
  
  if (showFullScorecard) {
    visibleTabs = allTabs.filter(t => t.id !== 'batting' && t.id !== 'bowling' && t.id !== 'partnerships');
  } else {
    visibleTabs = allTabs.filter(t => t.id !== 'fullScorecard');
  }

  return (
    <div className={styles.tabBar}>
      {visibleTabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
