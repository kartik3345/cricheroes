import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Mate, MatesAction } from '../types/cricket';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MatesContextType {
  mates: Mate[];
  matesDispatch: React.Dispatch<MatesAction>;
}

const MatesContext = createContext<MatesContextType | undefined>(undefined);

const defaultMates: Mate[] = [];

function matesReducer(state: Mate[], action: MatesAction): Mate[] {
  switch (action.type) {
    case 'LOAD_MATES':
      return action.payload;
    case 'ADD_MATE':
      return [...state, action.payload];
    case 'DELETE_MATE':
      return state.filter(m => m.name !== action.payload);
    case 'UPDATE_MATE':
      return state.map(m => m.name === action.payload.name ? action.payload : m);
    default:
      return state;
  }
}

export function MatesProvider({ children }: { children: React.ReactNode }) {
  const [savedMates, setSavedMates] = useLocalStorage<Mate[]>('mates_database', defaultMates);
  const [mates, matesDispatch] = useReducer(matesReducer, savedMates);

  // Sync back to local storage
  useEffect(() => {
    if (mates !== savedMates) {
       setSavedMates(mates);
    }
  }, [mates, savedMates, setSavedMates]);

  // Initial load
  useEffect(() => {
      if(savedMates && savedMates.length > 0 && mates.length === 0){
          matesDispatch({type: 'LOAD_MATES', payload: savedMates})
      }
  }, [savedMates, mates.length])

  return (
    <MatesContext.Provider value={{ mates, matesDispatch }}>
      {children}
    </MatesContext.Provider>
  );
}

export function useMates() {
  const context = useContext(MatesContext);
  if (context === undefined) {
    throw new Error('useMates must be used within a MatesProvider');
  }
  return context;
}
