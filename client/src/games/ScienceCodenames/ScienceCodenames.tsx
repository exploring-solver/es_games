import React, { useState } from 'react';
import { WordGrid } from './components/WordGrid';
import { ClueInput } from './components/ClueInput';
import { TeamDisplay } from './components/TeamDisplay';
import { RoleSelector } from './components/RoleSelector';
import { useTeamLogic } from './hooks/useTeamLogic';
import { useWordGeneration } from './hooks/useWordGeneration';
import './styles.css';

export interface Player {
  id: string;
  name: string;
  team: 'red' | 'blue';
  role: 'spymaster' | 'operative';
}

export interface GameSettings {
  playerCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number;
}

const ScienceCodenames: React.FC = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [settings, setSettings] = useState<GameSettings>({
    playerCount: 4,
    difficulty: 'medium',
    category: 'all',
    timeLimit: 180,
  });

  const {
    currentTeam,
    redScore,
    blueScore,
    winner,
    switchTurn,
    updateScore,
    resetGame,
  } = useTeamLogic();

  const {
    wordGrid,
    revealedCards,
    currentClue,
    generateNewGrid,
    revealCard,
    setClue,
  } = useWordGeneration(settings.category, settings.difficulty);

  const handleStartGame = () => {
    generateNewGrid();
    setGameState('playing');
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return;
    const result = revealCard(index);

    if (result.type === currentTeam) {
      updateScore(currentTeam, 1);
    } else {
      switchTurn();
    }

    if (result.gameOver) {
      setGameState('finished');
    }
  };

  const handleNewGame = () => {
    resetGame();
    generateNewGrid();
    setGameState('setup');
  };

  if (gameState === 'setup') {
    return (
      <div className="codenames-container">
        <h1 className="game-title">🔬 Science Codenames</h1>

        <div className="setup-panel">
          <h2>Game Settings</h2>

          <div className="setting-group">
            <label>Players (4-8):</label>
            <input
              type="number"
              min="4"
              max="8"
              value={settings.playerCount}
              onChange={(e) => setSettings({ ...settings, playerCount: parseInt(e.target.value) })}
            />
          </div>

          <div className="setting-group">
            <label>Difficulty:</label>
            <select
              value={settings.difficulty}
              onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as any })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Category:</label>
            <select
              value={settings.category}
              onChange={(e) => setSettings({ ...settings, category: e.target.value })}
            >
              <option value="all">All Sciences</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="astronomy">Astronomy</option>
              <option value="geology">Geology</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Turn Time (seconds):</label>
            <input
              type="number"
              min="60"
              max="300"
              step="30"
              value={settings.timeLimit}
              onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
            />
          </div>

          <button className="btn-primary" onClick={handleStartGame}>
            Start Game
          </button>
        </div>

        <div className="instructions">
          <h3>How to Play</h3>
          <ol>
            <li>Split into two teams (Red and Blue)</li>
            <li>Each team selects one Spymaster and the rest are Operatives</li>
            <li>Spymasters see which words belong to their team</li>
            <li>Give one-word clues and a number indicating how many words relate</li>
            <li>Operatives guess words based on the clue</li>
            <li>Avoid the assassin word (instant loss!) and neutral words</li>
            <li>First team to reveal all their words wins!</li>
          </ol>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="codenames-container">
        <div className="game-over">
          <h1 className="winner-announcement">
            {winner === 'red' ? '🔴' : '🔵'} {winner?.toUpperCase()} TEAM WINS! 🏆
          </h1>
          <div className="final-scores">
            <div className="team-score red">Red Team: {redScore}/9</div>
            <div className="team-score blue">Blue Team: {blueScore}/8</div>
          </div>
          <button className="btn-primary" onClick={handleNewGame}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="codenames-container">
      <header className="game-header">
        <h1>🔬 Science Codenames</h1>
        <TeamDisplay
          currentTeam={currentTeam}
          redScore={redScore}
          blueScore={blueScore}
          redTotal={9}
          blueTotal={8}
        />
      </header>

      <main className="game-main">
        <RoleSelector />

        <ClueInput
          currentTeam={currentTeam}
          onSubmitClue={setClue}
          timeLimit={settings.timeLimit}
        />

        <WordGrid
          words={wordGrid}
          revealed={revealedCards}
          onCardClick={handleCardClick}
          currentClue={currentClue}
        />
      </main>

      <footer className="game-footer">
        <button className="btn-secondary" onClick={handleNewGame}>
          New Game
        </button>
      </footer>
    </div>
  );
};

export default ScienceCodenames;
