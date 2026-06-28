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
  const [venue, setVenue] = useState('');
  const [powerplay, setPowerplay] = useState<number>(6);
  const mode: ScoringMode = 'manual';

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

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || squadA.length < 2 || squadB.length < 2) {
      alert('Please fill all fields and select at least 2 players per squad.');
      return;
    }
    dispatch({
      type: 'INIT_MATCH',
      payload: {
        teamAName: teamA,
        teamBName: teamB,
        overs,
        venue,
        powerplayOvers: powerplay,
        mode,
        squadA,
        squadB,
        teamBattingFirst: teamA // temporary, toss handles real assignment
      }
    });
    dispatch({ type: 'SET_PHASE', payload: 'toss' });
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

        {/* Scoring Mode removed, forced to Manual */}

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
