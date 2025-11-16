/**
 * Quantum Chess - Main Game Component
 * A chess game with quantum mechanics: superposition, entanglement, and measurement
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { QuantumIndicator } from './components/QuantumIndicator';
import { TutorialModal } from './components/TutorialModal';
import { useGameState } from './hooks/useGameState';
import { useQuantumLogic } from './hooks/useQuantumLogic';
import { Position, positionsEqual } from './utils/quantumMechanics';
import './styles/quantumChess.css';

const QuantumChess: React.FC = () => {
  const {
    gameState,
    gameMode,
    currentLevel,
    selectedPiece,
    possibleMoves,
    achievements,
    gameOver,
    winner,
    aiDifficulty,
    selectPiece,
    movePiece,
    measurePiece,
    setGameMode,
    setLevel,
    setAIDifficulty,
    resetGame,
    undoMove
  } = useGameState();

  const {
    animations,
    visualizations,
    addAnimation,
    updateVisualizations,
    getQuantumIntensity
  } = useQuantumLogic();

  const [showTutorial, setShowTutorial] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  /**
   * Update visualizations when pieces change
   */
  useEffect(() => {
    updateVisualizations(gameState.pieces);
  }, [gameState.pieces, updateVisualizations]);

  /**
   * Handle keyboard events
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
      if (e.key === 'Escape') {
        selectPiece(null as any);
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        undoMove();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectPiece, undoMove]);

  /**
   * Handle square click
   */
  const handleSquareClick = useCallback((position: Position) => {
    if (!selectedPiece) return;

    const isValidMove = possibleMoves.some(move => positionsEqual(move, position));
    if (isValidMove) {
      // Create superposition if shift is pressed
      movePiece(position, isShiftPressed);

      // Add animation
      if (isShiftPressed) {
        addAnimation('superposition', [
          selectedPiece.quantumStates[0].position,
          position
        ], 1000);
      }
    }
  }, [selectedPiece, possibleMoves, movePiece, isShiftPressed, addAnimation]);

  /**
   * Handle piece click
   */
  const handlePieceClick = useCallback((piece: any) => {
    if (piece.player === gameState.currentPlayer) {
      selectPiece(piece);
    }
  }, [gameState.currentPlayer, selectPiece]);

  /**
   * Handle piece right-click (measurement)
   */
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Context menu handled by piece component
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  /**
   * Start new game with mode
   */
  const startGame = (mode: typeof gameMode) => {
    setGameMode(mode);
    setShowMenu(false);
    resetGame();

    if (mode === 'tutorial') {
      setShowTutorial(true);
    }
  };

  /**
   * Render main menu
   */
  const renderMenu = () => (
    <div className="game-menu">
      <div className="menu-content">
        <h1 className="game-title">
          <span className="title-icon">⚛️</span>
          Quantum Chess
        </h1>
        <p className="game-subtitle">
          Where pieces exist in superposition until observed
        </p>

        <div className="menu-buttons">
          <button
            className="menu-button tutorial"
            onClick={() => startGame('tutorial')}
          >
            <span className="button-icon">📚</span>
            <span className="button-text">Tutorial</span>
            <span className="button-desc">Learn quantum mechanics</span>
          </button>

          <button
            className="menu-button levels"
            onClick={() => startGame('levels')}
          >
            <span className="button-icon">🎯</span>
            <span className="button-text">Levels</span>
            <span className="button-desc">10 progressive challenges</span>
          </button>

          <button
            className="menu-button vs-ai"
            onClick={() => startGame('vs-ai')}
          >
            <span className="button-icon">🤖</span>
            <span className="button-text">VS AI</span>
            <span className="button-desc">Battle quantum AI</span>
          </button>

          <button
            className="menu-button multiplayer"
            onClick={() => startGame('multiplayer')}
          >
            <span className="button-icon">👥</span>
            <span className="button-text">Multiplayer</span>
            <span className="button-desc">Challenge a friend</span>
          </button>
        </div>

        <div className="menu-footer">
          <button
            className="btn-link"
            onClick={() => setShowTutorial(true)}
          >
            How to Play
          </button>
          <button
            className="btn-link"
            onClick={() => setShowAchievements(true)}
          >
            Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </button>
        </div>

        <div className="quantum-background">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="quantum-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Render game UI
   */
  const renderGame = () => (
    <div className="quantum-chess-game">
      <div className="game-header">
        <div className="header-left">
          <h2>
            {gameMode === 'tutorial' && '📚 Tutorial'}
            {gameMode === 'levels' && `🎯 Level ${currentLevel}`}
            {gameMode === 'vs-ai' && `🤖 VS AI (${aiDifficulty})`}
            {gameMode === 'multiplayer' && '👥 Multiplayer'}
          </h2>
          <div className="current-player">
            Turn: <span className={gameState.currentPlayer}>{gameState.currentPlayer}</span>
          </div>
        </div>

        <div className="header-right">
          <button className="btn-icon" onClick={() => setShowTutorial(true)} title="Help">
            ❓
          </button>
          <button className="btn-icon" onClick={undoMove} title="Undo (Ctrl+Z)">
            ↶
          </button>
          <button className="btn-icon" onClick={resetGame} title="Reset">
            🔄
          </button>
          <button className="btn-icon" onClick={() => setShowMenu(true)} title="Menu">
            ☰
          </button>
        </div>
      </div>

      <div className="game-container">
        <div className="game-main">
          <Board
            pieces={gameState.pieces}
            selectedPiece={selectedPiece}
            possibleMoves={possibleMoves}
            visualizations={visualizations}
            onSquareClick={handleSquareClick}
            onPieceClick={handlePieceClick}
            quantumIntensity={getQuantumIntensity}
          />

          {isShiftPressed && (
            <div className="superposition-hint">
              🌊 Superposition Mode Active
            </div>
          )}
        </div>

        <div className="game-sidebar">
          <QuantumIndicator
            decoherenceLevel={gameState.decoherenceLevel}
            quantumEvents={gameState.quantumEvents}
            moveCount={gameState.moveCount}
          />

          {gameMode === 'vs-ai' && (
            <div className="ai-settings">
              <h3>AI Difficulty</h3>
              <select
                value={aiDifficulty}
                onChange={(e) => setAIDifficulty(e.target.value as any)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="quantum-master">Quantum Master</option>
              </select>
            </div>
          )}

          {gameMode === 'levels' && (
            <div className="level-selector">
              <h3>Select Level</h3>
              <div className="level-grid">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    className={`level-button ${currentLevel === i + 1 ? 'active' : ''}`}
                    onClick={() => setLevel(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>{winner === 'white' ? '🏆' : '👑'} {winner?.toUpperCase()} WINS!</h2>
            <div className="achievements-earned">
              {achievements.filter(a => a.unlocked).slice(-3).map(ach => (
                <div key={ach.id} className="achievement-badge">
                  {ach.icon} {ach.name}
                </div>
              ))}
            </div>
            <div className="game-over-buttons">
              <button className="btn-primary" onClick={resetGame}>
                Play Again
              </button>
              <button className="btn-secondary" onClick={() => setShowMenu(true)}>
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render achievements modal
   */
  const renderAchievements = () => (
    <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
      <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏆 Achievements</h2>
          <button className="close-button" onClick={() => setShowAchievements(false)}>
            ✕
          </button>
        </div>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-description">{achievement.description}</div>
            </div>
          ))}
        </div>
        <div className="achievements-progress">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
        </div>
      </div>
    </div>
  );

  return (
    <div className="quantum-chess">
      {showMenu ? renderMenu() : renderGame()}

      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        currentLevel={gameMode === 'levels' ? currentLevel : undefined}
      />

      {showAchievements && renderAchievements()}

      <div className="quantum-effects">
        {animations.map(anim => (
          <div key={anim.id} className={`quantum-animation ${anim.type}`} />
        ))}
      </div>
    </div>
  );
};

export default QuantumChess;
