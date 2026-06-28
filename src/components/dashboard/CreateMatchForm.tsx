import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { useMates } from '../../context/MatesContext';
import { ScoringMode, SquadPlayer } from '../../types/cricket';
import SquadSelector from './SquadSelector';
import styles from './CreateMatchForm.module.css';

export default function CreateMatchForm() {
  const { dispatch } = useMatch();
  const { mates } = useMates();

  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [overs, setOvers] = useState<number>(20);
  const [venue, setVenue] = useState('Eden Gardens');
  const [powerplay, setPowerplay] = useState(6);
  const [mode] = useState<ScoringMode>('manual'); // Forced to manual as auto simulation was removed from UI
  const [matchType, setMatchType] = useState<'team-wise' | 'one-to-one'>('team-wise');

  const [squadA, setSquadA] = useState<SquadPlayer[]>([]);
  const [squadB, setSquadB] = useState<SquadPlayer[]>([]);

  const handleToggleSquadA = (player: SquadPlayer) => {
    if (squadA.find(p => p.name === player.name)) {
      setSquadA(squadA.filter(p => p.name !== player.name));
    } else {
      setSquadA([...squadA, player]);
    }
  };

  const handleToggleSquadB = (player: SquadPlayer) => {
    if (squadB.find(p => p.name === player.name)) {
      setSquadB(squadB.filter(p => p.name !== player.name));
    } else {
      setSquadB([...squadB, player]);
    }
  };

  const availableForA = mates.filter(m => !squadB.find(p => p.name === m.name));
  const availableForB = mates.filter(m => !squadA.find(p => p.name === m.name));

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || squadA.length < 2 || squadB.length < 2) {
      alert('Please fill all fields and select at least 2 players per squad.');
      return;
    }

    // 1. Generate initial match state locally
    const { matchReducer } = await import('../../context/matchReducer');
    const initialState = matchReducer(null as any, {
      type: 'INIT_MATCH',
      payload: {
        teamAName: teamA,
        teamBName: teamB,
        overs,
        venue,
        powerplayOvers: powerplay,
        mode,
        matchType,
        squadA,
        squadB,
        teamBattingFirst: teamA 
      }
    });
    const finalState = matchReducer(initialState, { type: 'SET_PHASE', payload: 'toss' });

    // 1.5 Generate 6-digit match code
    const matchCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2. Insert into Supabase
    const { supabase } = await import('../../lib/supabase');
    const { data, error } = await supabase
      .from('matches')
      .insert({ 
        team_a_name: finalState.teamAName,
        team_b_name: finalState.teamBName,
        total_overs: finalState.overs,
        venue: finalState.venue,
        current_phase: finalState.phase,
        current_innings: finalState.innings,
        runs: finalState.score,
        wickets: finalState.wickets,
        match_code: matchCode,
        state: finalState 
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create match in cloud:', error);
      alert('Failed to create live match. Check connection.');
      return;
    }

    // 3. Navigate to live app with Admin privileges
    window.location.href = `/app?matchId=${data.id}&admin=true`;
  };

  return (
    <div className={`glass-card ${styles.formCard}`}>
      <h2 className={styles.cardTitle}>Create New Match</h2>
      
      <form onSubmit={handleStart} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Team A Name</label>
            <input required value={teamA} onChange={e => setTeamA(e.target.value)} placeholder="e.g. Super Kings" />
          </div>
          <div className={styles.vsDivider}>VS</div>
          <div className={styles.formGroup}>
            <label>Team B Name</label>
            <input required value={teamB} onChange={e => setTeamB(e.target.value)} placeholder="e.g. Mumbai Indians" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Total Overs</label>
            <input type="number" required min="1" max="50" value={overs} onChange={e => setOvers(Number(e.target.value))} />
          </div>
          <div className={styles.formGroup}>
            <label>Powerplay Overs</label>
            <input type="number" required min="0" max="20" value={powerplay} onChange={e => setPowerplay(Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Venue</label>
          <input required value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Wankhede Stadium" />
        </div>

        <div className={styles.formGroup}>
          <label>Match Type</label>
          <div className={styles.modeToggle}>
            <button 
              type="button" 
              className={matchType === 'team-wise' ? styles.modeBtnActive : styles.modeBtn}
              onClick={() => setMatchType('team-wise')}
            >
              Team-wise
            </button>
            <button 
              type="button" 
              className={matchType === 'one-to-one' ? styles.modeBtnActive : styles.modeBtn}
              onClick={() => setMatchType('one-to-one')}
            >
              One-to-One
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {matchType === 'team-wise' ? 'Standard rules: All-out when N-1 wickets fall.' : 'Last man standing: All-out when N wickets fall.'}
          </p>
        </div>
        <SquadSelector 
          label={`Select Squad for ${teamA || 'Team A'}`} 
          mates={availableForA} 
          selected={squadA} 
          onToggle={handleToggleSquadA} 
        />
        
        <SquadSelector 
          label={`Select Squad for ${teamB || 'Team B'}`} 
          mates={availableForB} 
          selected={squadB} 
          onToggle={handleToggleSquadB} 
        />

        <button type="submit" className={styles.startBtn}>Proceed to Toss</button>
      </form>
    </div>
  );
}
