/**
 * Mind Readers' Duel - Main Game Component
 * A competitive telepathy game with psychological patterns and meta-gaming
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThoughtDisplay, ThoughtCategory, ThoughtOption, generateThoughtOptions } from './components/ThoughtDisplay';
import { PredictionPanel } from './components/PredictionPanel';
import { PatternAnalysis } from './components/PatternAnalysis';
import { ScoreBoard, PlayerScore } from './components/ScoreBoard';
import { usePatternDetection } from './hooks/usePatternDetection';
import { usePsychologyAI, GameResult } from './hooks/usePsychologyAI';
import { PatternHistory } from './utils/probabilityEngine';
import { AIPersonality } from './utils/aiPrediction';

type GameMode = 'pvp' | 'ai';
type GamePhase = 'menu' | 'category-select' | 'playing' | 'round-result' | 'game-over' | 'replay';

interface RoundData {
  roundNumber: number;
  playerChoice: string;
  playerPrediction: string;
  aiChoice: string;
  aiPrediction: string;
  playerPredictionCorrect: boolean;
  aiPredictionCorrect: boolean;
  playerScore: number;
  aiScore: number;
  timestamp: number;
}

export const MindReaders: React.FC = () => {
  // Game State
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(15);

  // Category & Options
  const [selectedCategory, setSelectedCategory] = useState<ThoughtCategory>('numbers');
  const [thoughtOptions, setThoughtOptions] = useState<ThoughtOption[]>([]);

  // Player Choices
  const [playerChoice, setPlayerChoice] = useState<string>('');
  const [playerPrediction, setPlayerPrediction] = useState<string>('');
  const [aiChoice, setAIChoice] = useState<string>('');
  const [aiPrediction, setAIPrediction] = useState<string>('');

  // History
  const [playerHistory, setPlayerHistory] = useState<PatternHistory>({
    choices: [],
    timestamps: [],
    context: [],
    roundNumber: []
  });

  const [aiHistory, setAIHistory] = useState<PatternHistory>({
    choices: [],
    timestamps: [],
    context: [],
    roundNumber: []
  });

  // Scores
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);

  // Round History
  const [roundHistory, setRoundHistory] = useState<RoundData[]>([]);

  // ELO Ratings
  const [playerElo, setPlayerElo] = useState(1200);
  const [aiElo, setAIElo] = useState(1200);

  // Streaks
  const [playerStreak, setPlayerStreak] = useState(0);
  const [aiStreak, setAIStreak] = useState(0);
  const [playerLongestStreak, setPlayerLongestStreak] = useState(0);
  const [aiLongestStreak, setAILongestStreak] = useState(0);

  // AI Difficulty
  const [aiDifficulty, setAIDifficulty] = useState<AIPersonality>('intermediate');

  // Round Timer
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Hooks
  const patternDetection = usePatternDetection();
  const psychologyAI = usePsychologyAI(aiDifficulty);

  // UI State
  const [showAIReasoning, setShowAIReasoning] = useState(false);
  const [revealingResults, setRevealingResults] = useState(false);
  const [showReplayPanel, setShowReplayPanel] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && timerActive) {
      // Time's up - auto-submit
      handleSubmitRound();
    }
  }, [timerActive, timeRemaining]);

  // Start New Game
  const startNewGame = useCallback((mode: GameMode, difficulty?: AIPersonality) => {
    setGameMode(mode);
    setGamePhase('category-select');
    setCurrentRound(1);
    setPlayerScore(0);
    setAIScore(0);
    setPlayerStreak(0);
    setAIStreak(0);
    setPlayerHistory({ choices: [], timestamps: [], context: [], roundNumber: [] });
    setAIHistory({ choices: [], timestamps: [], context: [], roundNumber: [] });
    setRoundHistory([]);

    if (difficulty) {
      setAIDifficulty(difficulty);
      psychologyAI.resetAI(difficulty);
    }
  }, [psychologyAI]);

  // Select Category and Start Playing
  const selectCategory = useCallback((category: ThoughtCategory) => {
    setSelectedCategory(category);
    setThoughtOptions(generateThoughtOptions(category));
    setGamePhase('playing');
    setTimerActive(true);
    setTimeRemaining(30);
  }, []);

  // Handle Round Submission
  const handleSubmitRound = useCallback(() => {
    if (!playerChoice || !playerPrediction) return;

    setTimerActive(false);
    setRevealingResults(true);

    // Get AI decision
    const possibleChoices = thoughtOptions.map(opt => opt.value);
    const aiDecision = psychologyAI.makeMove(
      playerHistory,
      aiHistory,
      possibleChoices,
      currentRound
    );

    setAIChoice(aiDecision.choice);
    setAIPrediction(aiDecision.prediction);

    // Calculate results after a brief delay for suspense
    setTimeout(() => {
      const playerCorrect = playerPrediction === aiDecision.choice;
      const aiCorrect = aiDecision.prediction === playerChoice;

      // Update scores
      let newPlayerScore = playerScore;
      let newAIScore = aiScore;

      if (playerCorrect) newPlayerScore += 1;
      if (aiCorrect) newAIScore += 1;

      setPlayerScore(newPlayerScore);
      setAIScore(newAIScore);

      // Update streaks
      if (playerCorrect) {
        const newStreak = playerStreak + 1;
        setPlayerStreak(newStreak);
        setPlayerLongestStreak(Math.max(playerLongestStreak, newStreak));
      } else {
        setPlayerStreak(0);
      }

      if (aiCorrect) {
        const newStreak = aiStreak + 1;
        setAIStreak(newStreak);
        setAILongestStreak(Math.max(aiLongestStreak, newStreak));
      } else {
        setAIStreak(0);
      }

      // Update histories
      const timestamp = Date.now();
      setPlayerHistory(prev => ({
        choices: [...prev.choices, playerChoice],
        timestamps: [...prev.timestamps, timestamp],
        context: [...prev.context, selectedCategory],
        roundNumber: [...prev.roundNumber, currentRound]
      }));

      setAIHistory(prev => ({
        choices: [...prev.choices, aiDecision.choice],
        timestamps: [...prev.timestamps, timestamp],
        context: [...prev.context, selectedCategory],
        roundNumber: [...prev.roundNumber, currentRound]
      }));

      // Process AI result
      const gameResult: GameResult = {
        playerChoice,
        playerPrediction,
        aiChoice: aiDecision.choice,
        aiPrediction: aiDecision.prediction,
        playerPredictionCorrect: playerCorrect,
        aiPredictionCorrect: aiCorrect,
        roundNumber: currentRound
      };

      psychologyAI.processResult(gameResult);

      // Save round data
      const roundData: RoundData = {
        roundNumber: currentRound,
        playerChoice,
        playerPrediction,
        aiChoice: aiDecision.choice,
        aiPrediction: aiDecision.prediction,
        playerPredictionCorrect: playerCorrect,
        aiPredictionCorrect: aiCorrect,
        playerScore: newPlayerScore,
        aiScore: newAIScore,
        timestamp
      };

      setRoundHistory(prev => [...prev, roundData]);

      // Update ELO ratings
      const expectedPlayer = 1 / (1 + Math.pow(10, (aiElo - playerElo) / 400));
      const actualPlayer = playerCorrect ? 1 : 0;
      const newPlayerElo = Math.round(playerElo + 32 * (actualPlayer - expectedPlayer));

      const expectedAI = 1 / (1 + Math.pow(10, (playerElo - aiElo) / 400));
      const actualAI = aiCorrect ? 1 : 0;
      const newAIElo = Math.round(aiElo + 32 * (actualAI - expectedAI));

      setPlayerElo(newPlayerElo);
      setAIElo(newAIElo);

      setGamePhase('round-result');
      setRevealingResults(false);
    }, 2000);
  }, [
    playerChoice,
    playerPrediction,
    thoughtOptions,
    psychologyAI,
    playerHistory,
    aiHistory,
    currentRound,
    playerScore,
    aiScore,
    playerStreak,
    aiStreak,
    playerLongestStreak,
    aiLongestStreak,
    selectedCategory,
    playerElo,
    aiElo
  ]);

  // Next Round
  const nextRound = useCallback(() => {
    if (currentRound >= totalRounds) {
      setGamePhase('game-over');
    } else {
      setCurrentRound(currentRound + 1);
      setPlayerChoice('');
      setPlayerPrediction('');
      setAIChoice('');
      setAIPrediction('');
      setGamePhase('playing');
      setTimerActive(true);
      setTimeRemaining(30);
    }
  }, [currentRound, totalRounds]);

  // Render functions for different game phases
  const renderMenu = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          textShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
        }}>
          🧠 Mind Readers' Duel
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#aaa',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Predict your opponent's thoughts using psychological patterns, Bayesian probability, and meta-gaming strategies
        </p>
      </div>

      {/* AI Difficulty Selection */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '20px',
        padding: '40px',
        border: '2px solid rgba(99, 102, 241, 0.3)',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#e0e0e0',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Select AI Difficulty
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        }}>
          {(['novice', 'intermediate', 'expert', 'master'] as AIPersonality[]).map(difficulty => (
            <button
              key={difficulty}
              onClick={() => startNewGame('ai', difficulty)}
              style={{
                background: aiDifficulty === difficulty
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'rgba(42, 42, 62, 0.5)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '16px',
                padding: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '12px'
              }}>
                {difficulty === 'novice' && '🌱'}
                {difficulty === 'intermediate' && '🎯'}
                {difficulty === 'expert' && '🧠'}
                {difficulty === 'master' && '👑'}
              </div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#e0e0e0',
                textTransform: 'capitalize',
                marginBottom: '8px'
              }}>
                {difficulty}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: '#888'
              }}>
                {difficulty === 'novice' && 'Basic patterns, predictable behavior'}
                {difficulty === 'intermediate' && 'Adaptive learning, some bluffing'}
                {difficulty === 'expert' && 'Advanced psychology, counter-strategies'}
                {difficulty === 'master' && 'Meta-gaming, psychological warfare'}
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div style={{
          marginTop: '40px',
          padding: '24px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            color: '#e0e0e0',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Game Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            fontSize: '0.9rem',
            color: '#aaa'
          }}>
            <div>✓ Bayesian probability engine</div>
            <div>✓ Pattern recognition</div>
            <div>✓ Meta-gaming strategies</div>
            <div>✓ ELO ranking system</div>
            <div>✓ Psychological tells</div>
            <div>✓ Adaptive AI learning</div>
            <div>✓ Replay analysis</div>
            <div>✓ Multiple thought categories</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategorySelect = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        color: '#e0e0e0',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Choose a Thought Category
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '800px'
      }}>
        {(['numbers', 'colors', 'symbols', 'words'] as ThoughtCategory[]).map(category => (
          <button
            key={category}
            onClick={() => selectCategory(category)}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              padding: '40px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {category === 'numbers' && '🔢'}
              {category === 'colors' && '🎨'}
              {category === 'symbols' && '✨'}
              {category === 'words' && '💭'}
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#e0e0e0',
              textTransform: 'capitalize',
              textAlign: 'center'
            }}>
              {category}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlaying = () => {
    const playerAnalysis = patternDetection.analyzePatterns(
      aiHistory,
      thoughtOptions.map(opt => opt.value)
    );

    const suggestion = patternDetection.getRealtimeSuggestion(
      playerHistory,
      aiHistory,
      thoughtOptions.map(opt => opt.value)
    );

    const metaStats = patternDetection.analyzeMetaGame(playerHistory, aiHistory);

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '30px'
      }}>
        {/* Scoreboard */}
        <ScoreBoard
          player1={{
            name: 'You',
            score: playerScore,
            correctPredictions: playerHistory.choices.filter((_, i) =>
              roundHistory[i]?.playerPredictionCorrect
            ).length,
            totalPredictions: currentRound - 1,
            accuracy: currentRound > 1
              ? playerHistory.choices.filter((_, i) => roundHistory[i]?.playerPredictionCorrect).length / (currentRound - 1)
              : 0,
            currentStreak: playerStreak,
            longestStreak: playerLongestStreak,
            elo: playerElo
          }}
          player2={{
            name: `AI (${aiDifficulty})`,
            score: aiScore,
            correctPredictions: psychologyAI.aiStats.correctPredictions,
            totalPredictions: psychologyAI.aiStats.totalPredictions,
            accuracy: psychologyAI.aiStats.accuracy,
            currentStreak: aiStreak,
            longestStreak: aiLongestStreak,
            elo: aiElo
          }}
          currentRound={currentRound}
          totalRounds={totalRounds}
          timeRemaining={timeRemaining}
        />

        {/* Real-time Suggestion */}
        <div style={{
          margin: '20px 0',
          padding: '16px 24px',
          background: 'rgba(99, 102, 241, 0.1)',
          borderLeft: '4px solid #6366f1',
          borderRadius: '8px',
          fontSize: '1rem',
          color: '#e0e0e0'
        }}>
          {suggestion}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginTop: '24px'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Your Choice */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                color: '#e0e0e0',
                marginBottom: '12px'
              }}>
                1. Select Your Choice
              </h3>
              <ThoughtDisplay
                category={selectedCategory}
                options={thoughtOptions}
                selectedValue={playerChoice}
                onSelect={setPlayerChoice}
              />
            </div>

            {/* Pattern Analysis */}
            <PatternAnalysis
              patterns={playerAnalysis.patterns}
              entropy={playerAnalysis.entropy}
              metaStats={metaStats}
              recommendation={playerAnalysis.recommendation}
              playerName="AI"
            />
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Your Prediction */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                color: '#e0e0e0',
                marginBottom: '12px'
              }}>
                2. Predict AI's Choice
              </h3>
              <PredictionPanel
                predictions={playerAnalysis.predictions}
                selectedPrediction={playerPrediction}
                onSelectPrediction={setPlayerPrediction}
                showReasoning={true}
                playerName="AI"
              />
            </div>

            {/* Submit Button */}
            {playerChoice && playerPrediction && (
              <button
                onClick={handleSubmitRound}
                disabled={revealingResults}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '20px',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  cursor: revealingResults ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
                  transition: 'all 0.3s ease',
                  opacity: revealingResults ? 0.6 : 1
                }}
              >
                {revealingResults ? '🧠 Reading Minds...' : '✨ Submit Round'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRoundResult = () => {
    const playerCorrect = playerPrediction === aiChoice;
    const aiCorrect = aiPrediction === playerChoice;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '40px'
      }}>
        {/* Results Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            color: '#e0e0e0',
            marginBottom: '16px'
          }}>
            Round {currentRound} Results
          </h2>
          <div style={{
            fontSize: '1.3rem',
            color: playerCorrect && !aiCorrect ? '#4CAF50' : !playerCorrect && aiCorrect ? '#ef4444' : '#f59e0b'
          }}>
            {playerCorrect && !aiCorrect && '🎉 You Win This Round!'}
            {!playerCorrect && aiCorrect && '💔 AI Wins This Round!'}
            {playerCorrect && aiCorrect && '🤝 Both Predicted Correctly!'}
            {!playerCorrect && !aiCorrect && '🤷 No One Guessed Right!'}
          </div>
        </div>

        {/* Result Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Player Results */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '30px',
            border: playerCorrect ? '3px solid #4CAF50' : '2px solid rgba(99, 102, 241, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#e0e0e0',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Your Results
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>
                Your Choice:
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#6366f1',
                textAlign: 'center',
                padding: '16px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px'
              }}>
                {playerChoice}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>
                Your Prediction:
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: playerCorrect ? '#4CAF50' : '#ef4444',
                textAlign: 'center',
                padding: '16px',
                background: playerCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px'
              }}>
                {playerPrediction} {playerCorrect ? '✓' : '✗'}
              </div>
            </div>

            {playerCorrect && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.2)',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: '1.1rem',
                color: '#4CAF50',
                fontWeight: 'bold'
              }}>
                +1 Point! 🎯
              </div>
            )}
          </div>

          {/* AI Results */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '30px',
            border: aiCorrect ? '3px solid #4CAF50' : '2px solid rgba(99, 102, 241, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#e0e0e0',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              AI Results
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>
                AI Choice:
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#8b5cf6',
                textAlign: 'center',
                padding: '16px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px'
              }}>
                {aiChoice}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>
                AI Prediction:
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: aiCorrect ? '#4CAF50' : '#ef4444',
                textAlign: 'center',
                padding: '16px',
                background: aiCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px'
              }}>
                {aiPrediction} {aiCorrect ? '✓' : '✗'}
              </div>
            </div>

            {aiCorrect && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.2)',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: '1.1rem',
                color: '#4CAF50',
                fontWeight: 'bold'
              }}>
                +1 Point! 🎯
              </div>
            )}
          </div>
        </div>

        {/* Next Round Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={nextRound}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '20px 60px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {currentRound >= totalRounds ? '🏆 View Final Results' : '➡️ Next Round'}
          </button>
        </div>
      </div>
    );
  };

  const renderGameOver = () => {
    const winner = playerScore > aiScore ? 'player1' : playerScore < aiScore ? 'player2' : 'tie';

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '40px'
      }}>
        {/* Final Scoreboard */}
        <ScoreBoard
          player1={{
            name: 'You',
            score: playerScore,
            correctPredictions: roundHistory.filter(r => r.playerPredictionCorrect).length,
            totalPredictions: totalRounds,
            accuracy: roundHistory.filter(r => r.playerPredictionCorrect).length / totalRounds,
            currentStreak: playerStreak,
            longestStreak: playerLongestStreak,
            elo: playerElo
          }}
          player2={{
            name: `AI (${aiDifficulty})`,
            score: aiScore,
            correctPredictions: psychologyAI.aiStats.correctPredictions,
            totalPredictions: psychologyAI.aiStats.totalPredictions,
            accuracy: psychologyAI.aiStats.accuracy,
            currentStreak: aiStreak,
            longestStreak: aiLongestStreak,
            elo: aiElo
          }}
          currentRound={totalRounds}
          totalRounds={totalRounds}
          isGameOver={true}
          winner={winner}
        />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '40px'
        }}>
          <button
            onClick={() => setShowReplayPanel(!showReplayPanel)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📊 View Replay Analysis
          </button>

          <button
            onClick={() => startNewGame('ai', aiDifficulty)}
            style={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🔄 Play Again
          </button>

          <button
            onClick={() => setGamePhase('menu')}
            style={{
              background: 'rgba(42, 42, 62, 0.5)',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🏠 Main Menu
          </button>
        </div>

        {/* Replay Analysis */}
        {showReplayPanel && (
          <div style={{
            marginTop: '40px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid rgba(99, 102, 241, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              color: '#e0e0e0',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              📊 Game Replay & Analysis
            </h3>

            <div style={{
              display: 'grid',
              gap: '16px',
              maxHeight: '600px',
              overflowY: 'auto',
              padding: '10px'
            }}>
              {roundHistory.map((round, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(42, 42, 62, 0.5)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#e0e0e0'
                    }}>
                      Round {round.roundNumber}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#888'
                    }}>
                      Score: {round.playerScore} - {round.aiScore}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <div style={{ color: '#888', marginBottom: '4px' }}>Your Choice: <span style={{ color: '#6366f1', fontWeight: 'bold' }}>{round.playerChoice}</span></div>
                      <div style={{ color: '#888' }}>Your Prediction: <span style={{ color: round.playerPredictionCorrect ? '#4CAF50' : '#ef4444', fontWeight: 'bold' }}>{round.playerPrediction} {round.playerPredictionCorrect ? '✓' : '✗'}</span></div>
                    </div>
                    <div>
                      <div style={{ color: '#888', marginBottom: '4px' }}>AI Choice: <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{round.aiChoice}</span></div>
                      <div style={{ color: '#888' }}>AI Prediction: <span style={{ color: round.aiPredictionCorrect ? '#4CAF50' : '#ef4444', fontWeight: 'bold' }}>{round.aiPrediction} {round.aiPredictionCorrect ? '✓' : '✗'}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main Render
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {gamePhase === 'menu' && renderMenu()}
      {gamePhase === 'category-select' && renderCategorySelect()}
      {gamePhase === 'playing' && renderPlaying()}
      {gamePhase === 'round-result' && renderRoundResult()}
      {gamePhase === 'game-over' && renderGameOver()}
    </div>
  );
};

export default MindReaders;
