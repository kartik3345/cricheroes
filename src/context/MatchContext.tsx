import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { MatchAction, MatchState } from '../types/cricket';
import { matchReducer } from './matchReducer';
import { useSessionStorage } from '../hooks/useSessionStorage';

interface MatchContextType {
  state: MatchState | null;
  dispatch: React.Dispatch<MatchAction>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [savedState, setSavedState] = useSessionStorage<MatchState | null>('active_match', null);
  const [state, dispatch] = useReducer((s: MatchState | null, a: MatchAction) => {
    if (a.type === 'CLEAR_MATCH') return null;
    if (!s && a.type !== 'INIT_MATCH' && a.type !== 'LOAD_MATCH' && a.type !== 'LOAD_REMOTE_MATCH') return s;
    return matchReducer(s as MatchState, a);
  }, savedState);

  // Sync to local storage whenever state changes
  useEffect(() => {
    setSavedState(state);
    
    // Cloud sync simulation
    if (state?.syncId && !state.isSpectator) {
      fetch(`https://kvdb.io/cricHeroesLive1/${state.syncId}`, {
        method: 'POST',
        body: JSON.stringify(state)
      }).catch(err => console.error('Sync failed', err));
    }
  }, [state, setSavedState]);

  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
}
