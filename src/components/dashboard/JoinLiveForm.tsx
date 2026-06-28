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
      setError('Invalid Match Code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .eq('match_code', matchId.toUpperCase().trim())
        .single();
        
      if (error || !data) {
        throw new Error('Match not found. Check the code.');
      }
      
      // Redirect to the match viewer page
      window.location.href = `/app?matchId=${data.id}`;
      
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
          placeholder="e.g. A7X9WQ" 
          value={matchId}
          onChange={e => setMatchId(e.target.value.toUpperCase())}
          className={styles.input}
          maxLength={6}
          required
        />
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? 'Connecting...' : 'View Match'}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
