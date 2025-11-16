/**
 * ScoreBoard Component
 * Displays scores, ELO ratings, streaks, and round information
 */

import React from 'react';

export interface PlayerScore {
  name: string;
  score: number;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  elo?: number;
}

export interface ScoreBoardProps {
  player1: PlayerScore;
  player2: PlayerScore;
  currentRound: number;
  totalRounds: number;
  timeRemaining?: number;
  isGameOver?: boolean;
  winner?: 'player1' | 'player2' | 'tie';
  showElo?: boolean;
  showAccuracy?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  player1,
  player2,
  currentRound,
  totalRounds,
  timeRemaining,
  isGameOver = false,
  winner,
  showElo = true,
  showAccuracy = true
}) => {
  const getWinnerStyle = (playerKey: 'player1' | 'player2'): React.CSSProperties => {
    if (!isGameOver || !winner) return {};

    if (winner === playerKey) {
      return {
        boxShadow: '0 0 30px rgba(76, 175, 80, 0.6)',
        border: '2px solid #4CAF50'
      };
    }

    return { opacity: 0.7 };
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PlayerCard: React.FC<{ player: PlayerScore; playerKey: 'player1' | 'player2' }> = ({
    player,
    playerKey
  }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
        borderRadius: '16px',
        padding: '20px',
        border: '2px solid rgba(99, 102, 241, 0.3)',
        flex: 1,
        position: 'relative',
        transition: 'all 0.3s ease',
        ...getWinnerStyle(playerKey)
      }}
    >
      {/* Winner Crown */}
      {isGameOver && winner === playerKey && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2rem',
          animation: 'bounce 1s infinite'
        }}>
          👑
        </div>
      )}

      {/* Player Name */}
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#e0e0e0',
        marginBottom: '16px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>{player.name}</span>
        {player.currentStreak > 2 && (
          <span style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
            padding: '2px 8px',
            borderRadius: '8px',
            fontSize: '0.7rem',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            🔥 {player.currentStreak}
          </span>
        )}
      </div>

      {/* Score Display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          {player.score}
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: '#888',
          marginTop: '4px'
        }}>
          points
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '16px'
      }}>
        {/* Accuracy */}
        {showAccuracy && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Accuracy</span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: player.accuracy > 0.6 ? '#4CAF50' : player.accuracy > 0.4 ? '#f59e0b' : '#ef4444'
            }}>
              {(player.accuracy * 100).toFixed(0)}%
            </span>
          </div>
        )}

        {/* Correct Predictions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Predictions</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6366f1' }}>
            {player.correctPredictions}/{player.totalPredictions}
          </span>
        </div>

        {/* Longest Streak */}
        {player.longestStreak > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Best Streak</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f59e0b' }}>
              🔥 {player.longestStreak}
            </span>
          </div>
        )}

        {/* ELO Rating */}
        {showElo && player.elo !== undefined && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#6366f1' }}>ELO Rating</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6366f1' }}>
              {player.elo}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      {/* Round & Time Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        {/* Round Counter */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#888',
            marginBottom: '4px',
            textAlign: 'center'
          }}>
            ROUND
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#6366f1',
            textAlign: 'center'
          }}>
            {currentRound} / {totalRounds}
          </div>
        </div>

        {/* Game Status */}
        <div style={{
          textAlign: 'center',
          flex: 1,
          padding: '0 20px'
        }}>
          {isGameOver ? (
            <div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #4CAF50 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px'
              }}>
                GAME OVER
              </div>
              {winner && (
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  {winner === 'tie' ? 'It\'s a Tie!' : `${winner === 'player1' ? player1.name : player2.name} Wins!`}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#e0e0e0'
            }}>
              Mind Reading in Progress...
            </div>
          )}
        </div>

        {/* Timer */}
        {timeRemaining !== undefined && timeRemaining > 0 && !isGameOver && (
          <div style={{
            background: timeRemaining < 10
              ? 'rgba(239, 68, 68, 0.1)'
              : 'rgba(99, 102, 241, 0.1)',
            padding: '10px 16px',
            borderRadius: '10px',
            border: `1px solid ${timeRemaining < 10 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#888',
              marginBottom: '4px',
              textAlign: 'center'
            }}>
              TIME
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: timeRemaining < 10 ? '#ef4444' : '#6366f1',
              textAlign: 'center',
              fontFamily: 'monospace'
            }}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        )}
      </div>

      {/* Player Cards */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        <PlayerCard player={player1} playerKey="player1" />

        {/* VS Divider */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 10px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            VS
          </div>
        </div>

        <PlayerCard player={player2} playerKey="player2" />
      </div>

      {/* Round Progress Bar */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#888',
          marginBottom: '8px'
        }}>
          <span>Game Progress</span>
          <span>{((currentRound / totalRounds) * 100).toFixed(0)}%</span>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          height: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            height: '100%',
            width: `${(currentRound / totalRounds) * 100}%`,
            transition: 'width 0.5s ease',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.6)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'shimmer 2s infinite'
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
