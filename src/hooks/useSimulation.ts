import { useState, useRef, useCallback, useEffect } from 'react';
import { MatchAction, MatchState } from '../types/cricket';
import { generateRandomBall } from '../utils/simulationEngine';

export function useSimulation(dispatch: React.Dispatch<MatchAction>, state: MatchState | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const intervalRef = useRef<number | null>(null);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (!state || state.isCompleted || state.isSpectator || state.mode === 'manual' || !state.currentBatsmanStrike || !state.currentBowler) {
        return;
    }
    
    setIsPlaying(true);
    
    const intervalTime = speed === 1 ? 1500 : (speed === 2 ? 700 : 150);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      const outcome = generateRandomBall();
      dispatch({ type: 'RECORD_BALL', payload: outcome });
    }, intervalTime);
    
  }, [state, speed, dispatch]);

  const cycleSpeed = useCallback(() => {
    setSpeed(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 5;
      return 1;
    });
  }, []);
  
  // Restart interval if speed changes while playing
  useEffect(() => {
      if(isPlaying){
          play();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // Auto-pause if match ends
  useEffect(() => {
    if (state?.isCompleted && isPlaying) {
      pause();
    }
  }, [state?.isCompleted, isPlaying, pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { isPlaying, speed, play, pause, cycleSpeed };
}
