import React, { useState } from 'react';
import { useQuizLogic } from './hooks/useQuizLogic';
import { useMultiplayer } from './hooks/useMultiplayer';
import { QuestionCard } from './components/QuestionCard';
import { PlayerBuzzer } from './components/PlayerBuzzer';
import { Leaderboard } from './components/Leaderboard';
import { PowerUpShop } from './components/PowerUpShop';
import { CATEGORIES } from './data/categories';
import { getSkillTier, generateSkillReport } from './utils/difficultyAdapter';

type GameMode = 'menu' | 'single' | 'multiplayer' | 'daily' | 'tournament';
type QuizMode = 'setup' | 'playing' | 'results';

export const QuizShowdown: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [quizMode, setQuizMode] = useState<QuizMode>('setup');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(10);

  // Single player mode
  const singlePlayer = useQuizLogic({
    questionCount,
    category: selectedCategories[0],
    difficulty: selectedDifficulty,
    playerId: 'player1'
  });

  // Multiplayer mode
  const multiplayer = useMultiplayer(4, gameMode === 'tournament' ? 'tournament' : 'quick');

  const handleStartQuiz = () => {
    setQuizMode('playing');

    if (gameMode === 'multiplayer' || gameMode === 'tournament') {
      multiplayer.startGame();
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNextQuestion = () => {
    if (gameMode === 'single') {
      singlePlayer.nextQuestion();
    } else {
      multiplayer.nextQuestion();
    }
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setQuizMode('setup');
    setSelectedCategories([]);
    setSelectedDifficulty('');

    if (gameMode === 'single') {
      singlePlayer.resetQuiz();
    } else {
      multiplayer.resetGame();
    }
  };

  const handlePlayAgain = () => {
    setQuizMode('setup');

    if (gameMode === 'single') {
      singlePlayer.resetQuiz();
    } else {
      multiplayer.resetGame();
    }
  };

  // Render main menu
  const renderMenu = () => (
    <div className="game-menu">
      <div className="menu-header">
        <h1 className="game-title">
          <span className="title-icon">🧪</span>
          Science Quiz Showdown
          <span className="title-icon">⚛️</span>
        </h1>
        <p className="game-subtitle">Test your knowledge across all science fields!</p>
      </div>

      <div className="menu-modes">
        <button
          className="mode-button single"
          onClick={() => setGameMode('single')}
        >
          <span className="mode-icon">👤</span>
          <span className="mode-name">Single Player</span>
          <span className="mode-desc">Practice and improve your skills</span>
        </button>

        <button
          className="mode-button multiplayer"
          onClick={() => setGameMode('multiplayer')}
        >
          <span className="mode-icon">👥</span>
          <span className="mode-name">Multiplayer</span>
          <span className="mode-desc">Compete with up to 4 players</span>
        </button>

        <button
          className="mode-button daily"
          onClick={() => {
            setGameMode('daily');
            setQuizMode('playing');
          }}
        >
          <span className="mode-icon">📅</span>
          <span className="mode-name">Daily Challenge</span>
          <span className="mode-desc">New questions every day</span>
        </button>

        <button
          className="mode-button tournament"
          onClick={() => setGameMode('tournament')}
        >
          <span className="mode-icon">🏆</span>
          <span className="mode-name">Tournament</span>
          <span className="mode-desc">Bracket-style competition</span>
        </button>
      </div>

      <div className="menu-footer">
        <div className="stats-preview">
          <div className="stat">
            <span className="stat-label">Questions</span>
            <span className="stat-value">500+</span>
          </div>
          <div className="stat">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{CATEGORIES.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Power-Ups</span>
            <span className="stat-value">4</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render setup screen
  const renderSetup = () => (
    <div className="quiz-setup">
      <h2 className="setup-title">Quiz Setup</h2>

      {/* Category Selection */}
      <div className="setup-section">
        <h3>Select Categories</h3>
        <div className="categories-grid">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
              onClick={() => handleCategoryToggle(category.id)}
              style={{
                borderColor: selectedCategories.includes(category.id) ? category.color : 'transparent'
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
        <button
          className="select-all-button"
          onClick={() => setSelectedCategories(selectedCategories.length === CATEGORIES.length ? [] : CATEGORIES.map(c => c.id))}
        >
          {selectedCategories.length === CATEGORIES.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Difficulty Selection */}
      <div className="setup-section">
        <h3>Select Difficulty</h3>
        <div className="difficulty-buttons">
          {['', 'easy', 'medium', 'hard', 'expert'].map(diff => (
            <button
              key={diff || 'mixed'}
              className={`difficulty-button ${selectedDifficulty === diff ? 'selected' : ''}`}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff || 'Mixed'}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      {gameMode === 'single' && (
        <div className="setup-section">
          <h3>Number of Questions: {questionCount}</h3>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="question-slider"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="setup-actions">
        <button className="back-button" onClick={handleBackToMenu}>
          Back
        </button>
        <button className="start-button" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    </div>
  );

  // Render single player quiz
  const renderSinglePlayer = () => {
    if (singlePlayer.isQuizComplete) {
      return renderResults();
    }

    return (
      <div className="quiz-game">
        {/* Header */}
        <div className="game-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${singlePlayer.progress}%` }} />
            <span className="progress-text">
              Question {singlePlayer.quizState.currentQuestionIndex + 1} / {singlePlayer.quizState.totalQuestions}
            </span>
          </div>

          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{singlePlayer.quizState.score.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak</span>
              <span className="stat-value">🔥 {singlePlayer.quizState.streak}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{singlePlayer.accuracy.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={singlePlayer.currentQuestion}
          timeRemaining={singlePlayer.quizState.timeRemaining}
          selectedAnswer={singlePlayer.quizState.selectedAnswer}
          isAnswered={singlePlayer.quizState.isAnswered}
          onSelectAnswer={singlePlayer.submitAnswer}
          eliminatedOptions={singlePlayer.quizState.eliminatedOptions}
          showExplanation={singlePlayer.quizState.isAnswered}
        />

        {/* Power-Up Shop */}
        <PowerUpShop
          powerUps={singlePlayer.quizState.powerUps}
          coins={singlePlayer.quizState.coins}
          onUsePowerUp={singlePlayer.usePowerUp}
          onBuyPowerUp={singlePlayer.buyPowerUp}
          isAnswered={singlePlayer.quizState.isAnswered}
        />

        {/* Next Button */}
        {singlePlayer.quizState.isAnswered && (
          <div className="next-button-container">
            <button className="next-button" onClick={handleNextQuestion}>
              Next Question →
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render multiplayer quiz
  const renderMultiplayer = () => {
    if (multiplayer.multiplayerState.gameStatus === 'game_end') {
      return renderResults();
    }

    const leaderboard = multiplayer.getLeaderboard();

    return (
      <div className="quiz-game multiplayer">
        {/* Players Panel */}
        <div className="players-panel">
          <h3>Players</h3>
          <div className="players-list">
            {multiplayer.multiplayerState.players.map(player => (
              <PlayerBuzzer key={player.id} player={player} showStats={true} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="main-content">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${multiplayer.progress}%` }} />
            <span className="progress-text">
              Question {multiplayer.multiplayerState.currentQuestionIndex + 1} / {multiplayer.multiplayerState.questions.length}
            </span>
          </div>

          <QuestionCard
            question={multiplayer.currentQuestion}
            timeRemaining={multiplayer.multiplayerState.timeRemaining}
            selectedAnswer={multiplayer.getPlayer('player1')?.answer ?? null}
            isAnswered={multiplayer.getPlayer('player1')?.hasAnswered ?? false}
            onSelectAnswer={(index) => multiplayer.submitPlayerAnswer('player1', index)}
            showExplanation={multiplayer.multiplayerState.gameStatus === 'question_end'}
          />
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    const isMultiplayer = gameMode === 'multiplayer' || gameMode === 'tournament';

    if (isMultiplayer) {
      const leaderboard = multiplayer.getLeaderboard();

      return (
        <div className="results-screen">
          <h2 className="results-title">Game Over!</h2>

          <Leaderboard
            players={leaderboard}
            title="Final Standings"
            showFullStats={true}
            highlightPlayerId="player1"
          />

          <div className="results-actions">
            <button className="secondary-button" onClick={handleBackToMenu}>
              Main Menu
            </button>
            <button className="primary-button" onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        </div>
      );
    }

    // Single player results
    const skillReport = generateSkillReport(singlePlayer.playerSkill);
    const tier = getSkillTier(singlePlayer.playerSkill.skillLevel);

    return (
      <div className="results-screen">
        <h2 className="results-title">Quiz Complete!</h2>

        <div className="results-card">
          <div className="final-score">
            <span className="score-label">Final Score</span>
            <span className="score-value">{singlePlayer.quizState.score.toLocaleString()}</span>
          </div>

          <div className="results-stats">
            <div className="result-stat">
              <span className="result-icon">✓</span>
              <span className="result-label">Correct Answers</span>
              <span className="result-value">{singlePlayer.quizState.correctAnswers} / {singlePlayer.quizState.totalQuestions}</span>
            </div>

            <div className="result-stat">
              <span className="result-icon">🎯</span>
              <span className="result-label">Accuracy</span>
              <span className="result-value">{singlePlayer.accuracy.toFixed(1)}%</span>
            </div>

            <div className="result-stat">
              <span className="result-icon">🔥</span>
              <span className="result-label">Max Streak</span>
              <span className="result-value">{singlePlayer.quizState.maxStreak}</span>
            </div>

            <div className="result-stat">
              <span className="result-icon">⭐</span>
              <span className="result-label">Skill Tier</span>
              <span className="result-value">{tier}</span>
            </div>
          </div>

          {/* Skill Report */}
          <div className="skill-report">
            <h3>Performance Analysis</h3>
            <div className="skill-details">
              <p>Skill Level: <strong>{skillReport.skillLevel}/100</strong></p>
              {skillReport.strongCategories.length > 0 && (
                <p>Strong in: <strong>{skillReport.strongCategories.join(', ')}</strong></p>
              )}
              {skillReport.weakCategories.length > 0 && (
                <p>Needs work: <strong>{skillReport.weakCategories.join(', ')}</strong></p>
              )}
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button className="secondary-button" onClick={handleBackToMenu}>
            Main Menu
          </button>
          <button className="primary-button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="quiz-showdown">
      {gameMode === 'menu' && renderMenu()}
      {gameMode !== 'menu' && quizMode === 'setup' && renderSetup()}
      {gameMode !== 'menu' && quizMode === 'playing' && (
        <>
          {gameMode === 'single' || gameMode === 'daily' ? renderSinglePlayer() : renderMultiplayer()}
        </>
      )}

      <style>{`
        .quiz-showdown {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #581c87 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Main Menu Styles */
        .game-menu {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .menu-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .game-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin: 0 0 15px 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          animation: titleFloat 3s ease-in-out infinite;
        }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .title-icon {
          font-size: 3rem;
          animation: rotate 4s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .game-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .menu-modes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 50px;
        }

        .mode-button {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .mode-button:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .mode-icon {
          font-size: 4rem;
        }

        .mode-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .mode-desc {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
        }

        .menu-footer {
          margin-top: 50px;
        }

        .stats-preview {
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .stat-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Setup Styles */
        .quiz-setup {
          max-width: 900px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          border-radius: 25px;
          padding: 40px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .setup-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 40px 0;
        }

        .setup-section {
          margin-bottom: 35px;
        }

        .setup-section h3 {
          font-size: 1.3rem;
          color: white;
          margin: 0 0 20px 0;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .category-button {
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid transparent;
          border-radius: 15px;
          padding: 20px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .category-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .category-button.selected {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 20px currentColor;
        }

        .category-icon {
          font-size: 2.5rem;
        }

        .category-name {
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
        }

        .select-all-button {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .select-all-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .difficulty-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .difficulty-button {
          flex: 1;
          min-width: 100px;
          padding: 15px 25px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
        }

        .difficulty-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .difficulty-button.selected {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-color: #10b981;
        }

        .question-slider {
          width: 100%;
          height: 8px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }

        .question-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .setup-actions {
          display: flex;
          gap: 20px;
          margin-top: 40px;
        }

        .back-button,
        .start-button,
        .primary-button,
        .secondary-button {
          flex: 1;
          padding: 15px 30px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button,
        .secondary-button {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .back-button:hover,
        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .start-button,
        .primary-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
        }

        .start-button:hover,
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
        }

        /* Game Styles */
        .quiz-game {
          max-width: 1200px;
          margin: 0 auto;
        }

        .game-header {
          margin-bottom: 30px;
        }

        .progress-bar {
          position: relative;
          height: 40px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          transition: width 0.5s ease;
          border-radius: 20px;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .game-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.15);
          padding: 15px 25px;
          border-radius: 15px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .next-button-container {
          margin-top: 30px;
          text-align: center;
        }

        .next-button {
          padding: 15px 50px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
          transition: all 0.3s ease;
        }

        .next-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
        }

        /* Multiplayer Styles */
        .quiz-game.multiplayer {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
        }

        .players-panel {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .players-panel h3 {
          margin: 0 0 20px 0;
          color: white;
          font-size: 1.3rem;
        }

        .players-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .main-content {
          flex: 1;
        }

        /* Results Styles */
        .results-screen {
          max-width: 800px;
          margin: 0 auto;
        }

        .results-title {
          text-align: center;
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin: 0 0 40px 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .results-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
          border-radius: 25px;
          padding: 40px;
          backdrop-filter: blur(10px);
          margin-bottom: 30px;
        }

        .final-score {
          text-align: center;
          margin-bottom: 40px;
        }

        .score-label {
          display: block;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 10px;
        }

        .score-value {
          display: block;
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .results-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .result-stat {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 15px;
          text-align: center;
        }

        .result-icon {
          display: block;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .result-label {
          display: block;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .result-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .skill-report {
          background: rgba(16, 185, 129, 0.15);
          border-left: 4px solid #10b981;
          border-radius: 10px;
          padding: 25px;
        }

        .skill-report h3 {
          margin: 0 0 15px 0;
          color: #10b981;
          font-size: 1.3rem;
        }

        .skill-details {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
        }

        .skill-details p {
          margin: 8px 0;
        }

        .skill-details strong {
          color: white;
          font-weight: 700;
        }

        .results-actions {
          display: flex;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .quiz-showdown {
            padding: 15px;
          }

          .game-title {
            font-size: 2rem;
          }

          .title-icon {
            font-size: 2rem;
          }

          .menu-modes {
            grid-template-columns: 1fr;
          }

          .quiz-game.multiplayer {
            grid-template-columns: 1fr;
          }

          .players-panel {
            order: 2;
          }

          .results-card {
            padding: 25px;
          }

          .score-value {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizShowdown;
