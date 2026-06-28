import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { TossStep, TossChoice, TossElection } from '../../types/cricket';
import { IconCoin } from '../icons/SvgIcons';
import styles from './TossModal.module.css';

export default function TossModal() {
  const { state, dispatch, isAdmin } = useMatch();
  const [step, setStep] = useState<TossStep>('caller');
  const [caller, setCaller] = useState<string>('');
  const [callerChoice, setCallerChoice] = useState<TossChoice>('heads');
  const [result, setResult] = useState<TossChoice>('heads');
  const [winner, setWinner] = useState<string>('');

  if (!state || state.phase !== 'toss' || !isAdmin) return null;

  const handleSelectCaller = (team: string) => {
    setCaller(team);
    setStep('choice');
  };

  const handleSelectChoice = (choice: TossChoice) => {
    setCallerChoice(choice);
    
    // Determine result
    const isHeads = Math.random() > 0.5;
    const finalResult = isHeads ? 'heads' : 'tails';
    setResult(finalResult); // set immediately for the spin class
    setStep('spinning');
    
    setTimeout(() => {
      const won = choice === finalResult;
      setWinner(won ? caller : (caller === state.teamAName ? state.teamBName : state.teamAName));
      setStep('result');
    }, 2000);
  };

  const handleElection = (election: TossElection) => {
    const loser = winner === state.teamAName ? state.teamBName : state.teamAName;
    const teamBattingFirst = election === 'bat' ? winner : loser;
    
    dispatch({
      type: 'SET_TOSS',
      payload: { step: 'electionResult', caller, callerChoice, result, winner, loser, election }
    });
    // Transition to the new lineup phase
    dispatch({ type: 'SET_PHASE', payload: 'lineup' });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Match Toss</h2>
        
        {step === 'caller' && (
          <div className={styles.step}>
            <p>Who is calling the toss?</p>
            <div className={styles.buttonGroup}>
              <button className={styles.btn} onClick={() => handleSelectCaller(state.teamAName)}>{state.teamAName}</button>
              <button className={styles.btn} onClick={() => handleSelectCaller(state.teamBName)}>{state.teamBName}</button>
            </div>
          </div>
        )}

        {step === 'choice' && (
          <div className={styles.step}>
            <p><strong>{caller}</strong>, what is your call?</p>
            <div className={styles.buttonGroup}>
              <button className={styles.btn} onClick={() => handleSelectChoice('heads')}>Heads</button>
              <button className={styles.btn} onClick={() => handleSelectChoice('tails')}>Tails</button>
            </div>
          </div>
        )}

        {step === 'spinning' && (
          <div className={styles.step}>
            <div className={styles.coinWrapper}>
              <div className={`${styles.coin} ${result === 'heads' ? styles.spinningHeads : styles.spinningTails}`}>
                <div className={styles.coinFace}><IconCoin size={48} /><span>H</span></div>
                <div className={`${styles.coinFace} ${styles.coinBack}`}><IconCoin size={48} /><span>T</span></div>
              </div>
            </div>
            <p>Flipping coin...</p>
          </div>
        )}

        {step === 'result' && (
          <div className={styles.step}>
            <div className={styles.coinWrapper}>
              <div className={`${styles.coin} ${result === 'tails' ? styles.showTails : ''}`}>
                <div className={styles.coinFace}><IconCoin size={48} /><span>H</span></div>
                <div className={`${styles.coinFace} ${styles.coinBack}`}><IconCoin size={48} /><span>T</span></div>
              </div>
            </div>
            <p className={styles.resultText}>It's <strong>{result}</strong>!</p>
            <p className={styles.winnerText}><strong>{winner}</strong> won the toss.</p>
            <p>What do you choose to do?</p>
            <div className={styles.buttonGroup}>
              <button className={styles.btn} onClick={() => handleElection('bat')}>Bat First</button>
              <button className={styles.btn} onClick={() => handleElection('bowl')}>Bowl First</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
