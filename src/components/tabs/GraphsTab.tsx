import React, { useRef, useEffect, useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { drawWormChart, drawManhattanChart } from '../../utils/canvasCharts';
import styles from './GraphsTab.module.css';

export default function GraphsTab() {
  const { state } = useMatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeChart, setActiveChart] = useState<'worm' | 'manhattan'>('worm');

  useEffect(() => {
    if (!state || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (activeChart === 'worm') {
      const isLight = document.body.classList.contains('light-theme');
      
      const getActiveCumulative = (history: number[], currentScore: number) => {
        const full = [...history];
        if (full.length === 0 || full[full.length - 1] !== currentScore) {
          full.push(currentScore);
        }
        return full;
      };
      
      const inn1Cumul = state.innings === 1 
        ? getActiveCumulative(state.cumulativeHistory, state.score)
        : state.innings1Cumulative;
        
      const inn2Cumul = state.innings === 2 
        ? getActiveCumulative(state.cumulativeHistory, state.score)
        : [];

      drawWormChart(ctx, canvas, {
        innings1Cumulative: inn1Cumul,
        innings2Cumulative: inn2Cumul,
        innings1Fow: state.innings === 1 ? state.fow : state.innings1Fow,
        innings2Fow: state.innings === 2 ? state.fow : [],
        maxOvers: state.overs,
        teamAName: state.teamBattingFirst,
        teamBName: state.teamBowlingFirst,
        isLight
      });
    } else {
      const isLight = document.body.classList.contains('light-theme');
      
      const getActiveHistory = (history: any[], currentScore: number, currentWickets: number, currentBalls: number) => {
        const fullHistory = [...history];
        if (currentBalls % 6 !== 0) {
          const historyRuns = history.reduce((sum, o) => sum + o.runs, 0);
          const historyWickets = history.reduce((sum, o) => sum + o.wickets, 0);
          fullHistory.push({
            overNum: history.length + 1,
            runs: currentScore - historyRuns,
            wickets: currentWickets - historyWickets
          });
        }
        return fullHistory;
      };

      const inn1Overs = state.innings === 1 
        ? getActiveHistory(state.oversHistory, state.score, state.wickets, state.balls) 
        : state.innings1OversHistory;
        
      const inn2Overs = state.innings === 2 
        ? getActiveHistory(state.oversHistory, state.score, state.wickets, state.balls) 
        : [];

      drawManhattanChart(ctx, canvas, {
        innings1OversHistory: inn1Overs,
        innings2OversHistory: inn2Overs,
        maxOvers: state.overs,
        teamAName: state.teamBattingFirst,
        teamBName: state.teamBowlingFirst,
        isLight
      });
    }
    
  }, [state, activeChart]);

  return (
    <div className={styles.container}>
      <div className={styles.toggleGroup}>
        <button 
          className={`${styles.toggleBtn} ${activeChart === 'worm' ? styles.active : ''}`}
          onClick={() => setActiveChart('worm')}
        >
          Worm Chart
        </button>
        <button 
          className={`${styles.toggleBtn} ${activeChart === 'manhattan' ? styles.active : ''}`}
          onClick={() => setActiveChart('manhattan')}
        >
          Manhattan
        </button>
      </div>
      
      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} width={800} height={400} className={styles.canvas}></canvas>
      </div>
    </div>
  );
}
