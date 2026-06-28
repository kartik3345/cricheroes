import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { IconSignal } from '../icons/SvgIcons';
import styles from './JoinLiveForm.module.css';

export default function JoinLiveForm() {
  const { dispatch } = useMatch();
  const [matchId, setMatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (matchId.length < 5) {
      setError('Invalid Match ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`https://kvdb.io/cricHeroesLive1/${matchId}`);
      if (!res.ok) {
        throw new Error('Match not found');
      }
      const data = await res.json();
      
      dispatch({ type: 'LOAD_REMOTE_MATCH', payload: data });
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        <IconSignal size={20} className={styles.icon} />
        <h3 className={styles.title}>Join Live Match</h3>
      </div>
      
      <form onSubmit={handleJoin} className={styles.form}>
        <input 
          type="text" 
          value={matchId}
          onChange={e => setMatchId(e.target.value.toUpperCase())}
          placeholder="Enter 6-Digit ID" 
          className={styles.input}
          maxLength={6}
        />
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? 'Connecting...' : 'Spectate'}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
