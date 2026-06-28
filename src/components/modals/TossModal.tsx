import React, { useState } from 'react';
import { useMatch } from '../../context/MatchContext';
import { TossStep, TossChoice, TossElection } from '../../types/cricket';
import { IconCoin } from '../icons/SvgIcons';
import styles from './TossModal.module.css';

export default function TossModal() {
  const { state, dispatch, isAdmin } = useMatch();

  // Allow viewers to see the modal when phase is 'toss'
  if (!state || state.phase !== 'toss') return null;

  // Use the synchronized global state instead of local useState
  const tossState = state.tossState || {
    step: 'caller' as TossStep,
    caller: '',
    callerChoice: 'heads' as TossChoice,
    result: 'heads' as TossChoice,
    winner: ''
  };
  
  const { step, caller, callerChoice, result, winner } = tossState;

  const handleSelectCaller = (team: string) => {
    if (!isAdmin) return;
    dispatch({
      type: 'SYNC_TOSS_STATE',
      payload: { ...tossState, caller: team, step: 'choice' }
    });
  };

  const handleSelectChoice = (choice: TossChoice) => {
    if (!isAdmin) return;
    
    // Determine result instantly
    const isHeads = Math.random() > 0.5;
    const finalResult = isHeads ? 'heads' : 'tails';
    
    // Sync spinning state to everyone
    dispatch({
      type: 'SYNC_TOSS_STATE',
      payload: { ...tossState, callerChoice: choice, result: finalResult, step: 'spinning' }
    });
    
    // After 2 seconds of spinning, sync the winner result
    setTimeout(() => {
      const won = choice === finalResult;
      const finalWinner = won ? tossState.caller : (tossState.caller === state.teamAName ? state.teamBName : state.teamAName);
      
      dispatch({
        type: 'SYNC_TOSS_STATE',
        payload: { ...tossState, callerChoice: choice, result: finalResult, winner: finalWinner, step: 'result' }
      });
    }, 2000);
  };

  const handleElection = (election: TossElection) => {
    if (!isAdmin) return;
    const loser = winner === state.teamAName ? state.teamBName : state.teamAName;
    const teamBattingFirst = election === 'bat' ? winner : loser;
    
    // Finalize toss in core match state
    dispatch({
      type: 'SET_TOSS',
      payload: { winner, decision: election, teamBattingFirst }
    });
    // Transition to the animated lineup phase
    dispatch({ type: 'SET_PHASE', payload: 'lineup' });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Match Toss</h2>
        
        {step === 'caller' && (
          <div className={styles.step}>
            <p>Who is calling the toss?</p>
            {isAdmin ? (
              <div className={styles.buttonGroup}>
                <button className={styles.btn} onClick={() => handleSelectCaller(state.teamAName)}>{state.teamAName}</button>
                <button className={styles.btn} onClick={() => handleSelectCaller(state.teamBName)}>{state.teamBName}</button>
              </div>
            ) : (
              <p className={styles.resultText}>Waiting for Admin to start toss...</p>
            )}
          </div>
        )}

        {step === 'choice' && (
          <div className={styles.step}>
            <p><strong>{caller}</strong> is making their call...</p>
            {isAdmin ? (
              <div className={styles.buttonGroup}>
                <button className={styles.btn} onClick={() => handleSelectChoice('heads')}>Heads</button>
                <button className={styles.btn} onClick={() => handleSelectChoice('tails')}>Tails</button>
              </div>
            ) : (
              <p className={styles.resultText}>Waiting for <strong>{caller}</strong> to choose...</p>
            )}
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
            
            {isAdmin ? (
              <>
                <p>What do you choose to do?</p>
                <div className={styles.buttonGroup}>
                  <button className={styles.btn} onClick={() => handleElection('bat')}>Bat First</button>
                  <button className={styles.btn} onClick={() => handleElection('bowl')}>Bowl First</button>
                </div>
              </>
            ) : (
              <p className={styles.resultText}>Waiting for <strong>{winner}</strong> to decide...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
