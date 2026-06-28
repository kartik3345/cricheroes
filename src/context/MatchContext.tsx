import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { MatchAction, MatchState } from '../types/cricket';
import { matchReducer } from './matchReducer';
import { supabase } from '../lib/supabase';
import { useSessionStorage } from '../hooks/useSessionStorage';

interface MatchContextType {
  state: MatchState | null;
  dispatch: React.Dispatch<MatchAction>;
  isAdmin: boolean;
  matchId: string | null;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [savedState, setSavedState] = useSessionStorage<MatchState | null>('active_match', null);
  const [isAdminAuth, setIsAdminAuth] = useSessionStorage<boolean>('is_match_admin', false);
  const [matchIdSession, setMatchIdSession] = useSessionStorage<string | null>('current_match_id', null);

  const [isAdmin, setIsAdmin] = useState(isAdminAuth);
  const [matchId, setMatchId] = useState<string | null>(matchIdSession);

  const [state, dispatch] = useReducer((s: MatchState | null, a: MatchAction) => {
    if (a.type === 'CLEAR_MATCH') return null;
    if (!s && a.type !== 'INIT_MATCH' && a.type !== 'LOAD_MATCH' && a.type !== 'LOAD_REMOTE_MATCH') return s;
    return matchReducer(s as MatchState, a);
  }, savedState);

  // Parse URL on mount to check for matchId and admin flag
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMatchId = params.get('matchId');
    const urlAdmin = params.get('admin') === 'true';

    if (urlMatchId) {
      setMatchId(urlMatchId);
      setMatchIdSession(urlMatchId);
      
      if (urlAdmin) {
        setIsAdmin(true);
        setIsAdminAuth(true);
        // Clean URL to hide secret admin flag
        window.history.replaceState({}, '', `/app?matchId=${urlMatchId}`);
      }
    }
  }, []);

  // Fetch initial state and subscribe to Supabase
  useEffect(() => {
    if (!matchId) return;

    // Fetch initial state
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('state')
        .eq('id', matchId)
        .single();
        
      if (data && data.state) {
        dispatch({ type: 'LOAD_REMOTE_MATCH', payload: data.state as MatchState });
      } else if (error) {
        console.error('Failed to fetch match:', error);
      }
    };

    fetchMatch();

    // Subscribe to real-time changes
    const channel = supabase.channel(`match-${matchId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'matches',
        filter: `id=eq.${matchId}`
      }, (payload) => {
        // Only update if we are NOT the admin (admin state is local source of truth)
        if (!isAdmin && payload.new.state) {
          dispatch({ type: 'LOAD_REMOTE_MATCH', payload: payload.new.state as MatchState });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, isAdmin]);

  // Sync to local storage and Supabase whenever state changes (if Admin)
  useEffect(() => {
    setSavedState(state);
    
    if (isAdmin && matchId && state) {
      // Debounce slightly to prevent spamming the database
      const timeout = setTimeout(async () => {
        const { error } = await supabase
          .from('matches')
          .update({ state })
          .eq('id', matchId);
          
        if (error) console.error('Failed to sync state:', error);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [state, isAdmin, matchId, setSavedState]);

  return (
    <MatchContext.Provider value={{ state, dispatch, isAdmin, matchId }}>
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
