import React, { useState, useEffect } from 'react';
import { PuzzleData } from '../data/puzzles';
import { PuzzleState } from '../utils/puzzleLogic';

interface PuzzleProps {
  puzzle: PuzzleData;
  puzzleState: PuzzleState;
  onSubmit: (answer: string | string[]) => void;
  onRequestHint: () => void;
  onClose: () => void;
  timeRemaining?: number;
  playerCount: number;
}

export const Puzzle: React.FC<PuzzleProps> = ({
  puzzle,
  puzzleState,
  onSubmit,
  onRequestHint,
  onClose,
  timeRemaining,
  playerCount
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [multiAnswer, setMultiAnswer] = useState<string[]>(['']);
  const [showHint, setShowHint] = useState(false);
  const [lastHint, setLastHint] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isMultiAnswer = Array.isArray(puzzle.solution);
  const maxAttempts = 5;
  const attemptsRemaining = maxAttempts - puzzleState.attempts;

  // Get puzzle type color
  const getTypeColor = () => {
    const colors = {
      chemistry: '#4CAF50',
      physics: '#2196F3',
      biology: '#9C27B0',
      math: '#FF9800',
      logic: '#607D8B',
      pattern: '#00BCD4',
      combination: '#FFC107'
    };
    return colors[puzzle.type];
  };

  const typeColor = getTypeColor();

  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitAnswer = isMultiAnswer ? multiAnswer : answer;
    onSubmit(submitAnswer);
  };

  // Request hint
  const handleHintRequest = () => {
    onRequestHint();
    setShowHint(true);
  };

  // Calculate time elapsed
  const getTimeElapsed = () => {
    const elapsed = Math.floor((Date.now() - puzzleState.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if puzzle is time-critical
  const isTimeCritical = puzzle.timeLimit && timeRemaining
    ? timeRemaining < puzzle.timeLimit * 0.25
    : false;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 2px ${typeColor}40`,
        border: `3px solid ${typeColor}`
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${typeColor}, ${typeColor}dd)`,
          padding: '24px',
          borderRadius: '16px 16px 0 0',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>

          <h2 style={{
            margin: '0 0 8px 0',
            color: 'white',
            fontSize: '28px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {puzzle.title}
          </h2>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {puzzle.type.toUpperCase()}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'white'
            }}>
              {puzzle.difficulty.toUpperCase()}
            </span>
            {puzzle.requiredPlayers && (
              <span style={{
                background: playerCount >= puzzle.requiredPlayers
                  ? 'rgba(76, 175, 80, 0.5)'
                  : 'rgba(244, 67, 54, 0.5)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'white'
              }}>
                👥 {playerCount}/{puzzle.requiredPlayers} Players
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Description */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <p style={{
              margin: 0,
              color: '#e0e0e0',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              {puzzle.description}
            </p>
          </div>

          {/* Educational Content */}
          <div style={{
            background: 'rgba(66, 165, 245, 0.1)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid rgba(66, 165, 245, 0.3)'
          }}>
            <div style={{
              color: '#42A5F5',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              💡 EDUCATIONAL INFO
            </div>
            <p style={{
              margin: 0,
              color: '#b3d9ff',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {puzzle.educationalContent}
            </p>
          </div>

          {/* Timer and Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '12px 16px',
              borderRadius: '8px',
              flex: 1,
              minWidth: '150px'
            }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Time Elapsed</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                {getTimeElapsed()}
              </div>
            </div>
            <div style={{
              background: attemptsRemaining <= 1
                ? 'rgba(244, 67, 54, 0.2)'
                : 'rgba(255,255,255,0.05)',
              padding: '12px 16px',
              borderRadius: '8px',
              flex: 1,
              minWidth: '150px'
            }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Attempts Left</div>
              <div style={{
                color: attemptsRemaining <= 1 ? '#f44336' : '#fff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {attemptsRemaining}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '12px 16px',
              borderRadius: '8px',
              flex: 1,
              minWidth: '150px'
            }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Hints Used</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                {puzzleState.hintsUsed}/3
              </div>
            </div>
          </div>

          {/* Time Warning */}
          {isTimeCritical && (
            <div style={{
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #FF9800',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#FFB74D',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              animation: 'pulse-warning 1s ease-in-out infinite'
            }}>
              ⚠️ TIME CRITICAL - Less than 25% time remaining!
            </div>
          )}

          {/* Answer Input */}
          <form onSubmit={handleSubmit}>
            {isMultiAnswer ? (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#e0e0e0',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontWeight: 'bold'
                }}>
                  Enter Answers (Multiple Parts Required):
                </label>
                {(puzzle.solution as string[]).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    value={multiAnswer[index] || ''}
                    onChange={(e) => {
                      const newAnswers = [...multiAnswer];
                      newAnswers[index] = e.target.value;
                      setMultiAnswer(newAnswers);
                    }}
                    placeholder={`Answer ${index + 1}`}
                    style={{
                      width: '100%',
                      padding: '14px',
                      marginBottom: '12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: `2px solid ${typeColor}40`,
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = `2px solid ${typeColor}`;
                      e.target.style.background = 'rgba(255,255,255,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = `2px solid ${typeColor}40`;
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#e0e0e0',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontWeight: 'bold'
                }}>
                  Enter Your Answer:
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255,255,255,0.1)',
                    border: `2px solid ${typeColor}40`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = `2px solid ${typeColor}`;
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = `2px solid ${typeColor}40`;
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }}
                />
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div style={{
                background: feedback.type === 'success'
                  ? 'rgba(76, 175, 80, 0.2)'
                  : 'rgba(244, 67, 54, 0.2)',
                border: `2px solid ${feedback.type === 'success' ? '#4CAF50' : '#f44336'}`,
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                color: feedback.type === 'success' ? '#81C784' : '#EF5350',
                fontSize: '14px'
              }}>
                {feedback.message}
              </div>
            )}

            {/* Hint Display */}
            {showHint && lastHint && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '2px solid #FFC107',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  color: '#FFC107',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  💡 HINT
                </div>
                <div style={{ color: '#FFE082', fontSize: '14px' }}>
                  {lastHint}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={puzzleState.solved || attemptsRemaining === 0}
                style={{
                  flex: 2,
                  padding: '14px',
                  background: puzzleState.solved || attemptsRemaining === 0
                    ? '#555'
                    : `linear-gradient(135deg, ${typeColor}, ${typeColor}dd)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: puzzleState.solved || attemptsRemaining === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!puzzleState.solved && attemptsRemaining > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
              >
                {puzzleState.solved ? '✓ SOLVED' : 'Submit Answer'}
              </button>

              <button
                type="button"
                onClick={handleHintRequest}
                disabled={puzzleState.hintsUsed >= 3}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: puzzleState.hintsUsed >= 3
                    ? '#555'
                    : 'rgba(255, 193, 7, 0.3)',
                  border: `2px solid ${puzzleState.hintsUsed >= 3 ? '#666' : '#FFC107'}`,
                  borderRadius: '8px',
                  color: puzzleState.hintsUsed >= 3 ? '#888' : '#FFC107',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: puzzleState.hintsUsed >= 3 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (puzzleState.hintsUsed < 3) {
                    e.currentTarget.style.background = 'rgba(255, 193, 7, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (puzzleState.hintsUsed < 3) {
                    e.currentTarget.style.background = 'rgba(255, 193, 7, 0.3)';
                  }
                }}
              >
                💡 Hint
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse-warning {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

export default Puzzle;
