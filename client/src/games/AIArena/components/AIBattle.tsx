import React, { useState, useEffect } from 'react';
import { NetworkState } from '../utils/neuralNetSimulator';
import { Scenario } from '../data/scenarios';
import { NetworkArchitecture } from '../data/architectures';
import { simulateAIBattle } from '../utils/mlEngine';

interface AIBattleProps {
  network1: NetworkState | null;
  network2: NetworkState | null;
  scenario: Scenario | null;
  architecture: NetworkArchitecture | null;
  onBattleComplete?: (winner: 1 | 2 | 'tie') => void;
}

export const AIBattle: React.FC<AIBattleProps> = ({
  network1,
  network2,
  scenario,
  architecture,
  onBattleComplete
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    winner: 1 | 2 | 'tie';
    scores: [number, number];
    details: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(10);

  const startBattle = () => {
    if (!network1 || !network2 || !scenario || !architecture) {
      return;
    }

    setIsRunning(true);
    setResult(null);
    setProgress(0);
    setCurrentRound(0);

    // Simulate battle with progress updates
    let round = 0;
    const interval = setInterval(() => {
      round++;
      setCurrentRound(round);
      setProgress((round / totalRounds) * 100);

      if (round >= totalRounds) {
        clearInterval(interval);

        const battleResult = simulateAIBattle(
          network1,
          network2,
          architecture,
          scenario,
          totalRounds
        );

        setResult(battleResult);
        setIsRunning(false);

        if (onBattleComplete) {
          onBattleComplete(battleResult.winner);
        }
      }
    }, 300);
  };

  const getWinnerColor = (winner: 1 | 2 | 'tie'): string => {
    if (winner === 1) return '#10B981';
    if (winner === 2) return '#3B82F6';
    return '#F59E0B';
  };

  const canStartBattle = network1 && network2 && scenario && architecture;

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '16px',
        textAlign: 'center',
        color: '#F59E0B'
      }}>
        AI Battle Arena
      </h3>

      {/* Battle Setup */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
        gap: '20px'
      }}>
        {/* AI 1 */}
        <div style={{
          flex: 1,
          padding: '15px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10B981',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#10B981'
          }}>
            AI 1 (Your Network)
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {network1 ? 'Ready' : 'Not trained'}
          </div>
          {result && (
            <div style={{
              marginTop: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#10B981'
            }}>
              {result.scores[0]}
            </div>
          )}
        </div>

        {/* VS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          VS
        </div>

        {/* AI 2 */}
        <div style={{
          flex: 1,
          padding: '15px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '2px solid #3B82F6',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#3B82F6'
          }}>
            AI 2 (Opponent)
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {network2 ? 'Ready' : 'Not available'}
          </div>
          {result && (
            <div style={{
              marginTop: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#3B82F6'
            }}>
              {result.scores[1]}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '11px',
            marginBottom: '5px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            Round {currentRound} / {totalRounds}
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981, #3B82F6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Battle Result */}
      {result && !isRunning && (
        <div style={{
          padding: '20px',
          background: `rgba(${
            result.winner === 1 ? '16, 185, 129' :
            result.winner === 2 ? '59, 130, 246' :
            '251, 191, 36'
          }, 0.2)`,
          border: `2px solid ${getWinnerColor(result.winner)}`,
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: getWinnerColor(result.winner)
          }}>
            {result.winner === 'tie' ? 'It\'s a Tie!' : `AI ${result.winner} Wins!`}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {result.details}
          </div>
        </div>
      )}

      {/* Battle Info */}
      {scenario && (
        <div style={{
          padding: '12px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '5px',
          marginBottom: '15px',
          fontSize: '11px'
        }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Scenario:</strong> {scenario.name}
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>Type:</strong> {scenario.type}
          </div>
          <div>
            <strong>Rounds:</strong> {totalRounds}
          </div>
        </div>
      )}

      {/* Controls */}
      <button
        onClick={startBattle}
        disabled={!canStartBattle || isRunning}
        style={{
          width: '100%',
          padding: '15px',
          background: canStartBattle && !isRunning
            ? 'linear-gradient(135deg, #10B981, #3B82F6)'
            : 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: canStartBattle && !isRunning ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease'
        }}
      >
        {isRunning ? 'Battle in Progress...' : 'Start Battle'}
      </button>

      {!canStartBattle && (
        <div style={{
          marginTop: '10px',
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center'
        }}>
          Train both networks before starting a battle
        </div>
      )}
    </div>
  );
};
