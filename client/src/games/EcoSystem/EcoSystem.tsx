import React, { useState } from 'react';
import { BIOMES_DATA, Biome } from './data/biomes';
import { useEcologySimulation } from './hooks/useEcologySimulation';
import { usePopulationDynamics } from './hooks/usePopulationDynamics';
import { BiomeDisplay } from './components/BiomeDisplay';
import { SpeciesPanel } from './components/SpeciesPanel';
import { PopulationGraph } from './components/PopulationGraph';
import { EventLog } from './components/EventLog';

type GameMode = 'competitive' | 'coop' | 'sandbox';

export const EcoSystem: React.FC = () => {
  const [selectedBiome, setSelectedBiome] = useState<Biome | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('sandbox');
  const [showBiomeSelect, setShowBiomeSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  const simulation = selectedBiome
    ? useEcologySimulation(selectedBiome, gameMode)
    : null;

  const dynamics = simulation
    ? usePopulationDynamics(simulation.gameState)
    : null;

  const handleStartGame = (biome: Biome, mode: GameMode) => {
    setSelectedBiome(biome);
    setGameMode(mode);
    setShowBiomeSelect(false);
  };

  const handleBackToMenu = () => {
    if (simulation?.controls) {
      simulation.controls.pause();
    }
    if (confirm('Return to biome selection? Current progress will be lost.')) {
      setShowBiomeSelect(true);
      setSelectedBiome(null);
    }
  };

  // Biome Selection Screen
  if (showBiomeSelect || !selectedBiome) {
    return (
      <div className="ecosystem-menu">
        <style>{`
          .ecosystem-menu {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }

          .menu-container {
            max-width: 1400px;
            margin: 0 auto;
          }

          .menu-header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
          }

          .menu-title {
            font-size: 3.5rem;
            font-weight: bold;
            margin: 0 0 12px 0;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }

          .menu-subtitle {
            font-size: 1.3rem;
            opacity: 0.9;
            margin: 0 0 20px 0;
          }

          .menu-description {
            font-size: 1rem;
            opacity: 0.8;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }

          .mode-selector {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-bottom: 40px;
          }

          .mode-card {
            background: white;
            padding: 20px 30px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            border: 3px solid transparent;
            min-width: 200px;
          }

          .mode-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          }

          .mode-card.selected {
            border-color: #667eea;
            background: #f0f4ff;
          }

          .mode-icon {
            font-size: 2.5rem;
            margin-bottom: 12px;
          }

          .mode-name {
            font-size: 1.3rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
          }

          .mode-desc {
            font-size: 0.9rem;
            color: #7f8c8d;
          }

          .biomes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
          }

          .biome-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .biome-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          }

          .biome-header {
            height: 150px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            position: relative;
          }

          .biome-difficulty {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.9);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: bold;
          }

          .difficulty-1 { color: #27ae60; }
          .difficulty-2 { color: #2ecc71; }
          .difficulty-3 { color: #f39c12; }
          .difficulty-4 { color: #e67e22; }
          .difficulty-5 { color: #e74c3c; }

          .biome-content {
            padding: 20px;
          }

          .biome-name {
            font-size: 1.4rem;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 8px 0;
          }

          .biome-desc {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin: 0 0 16px 0;
            line-height: 1.5;
          }

          .biome-challenge {
            font-size: 0.85rem;
            color: #3498db;
            font-style: italic;
            padding: 12px;
            background: #ebf5fb;
            border-radius: 6px;
            border-left: 3px solid #3498db;
          }

          .biome-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-top: 12px;
          }

          .biome-stat {
            font-size: 0.8rem;
            color: #7f8c8d;
          }

          .biome-stat strong {
            color: #2c3e50;
          }

          .tutorial-btn {
            display: block;
            margin: 0 auto 20px auto;
            padding: 12px 30px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
          }

          .tutorial-btn:hover {
            background: #f0f4ff;
            transform: scale(1.05);
          }

          .biome-locked {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .biome-locked:hover {
            transform: none;
          }

          .lock-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
          }
        `}</style>

        <div className="menu-container">
          <div className="menu-header">
            <h1 className="menu-title">🌍 EcoSystem Simulator</h1>
            <p className="menu-subtitle">Build and Balance Thriving Ecosystems</p>
            <p className="menu-description">
              Manage complex food webs, introduce species strategically, respond to environmental events,
              and witness evolution in action. Learn real ecology while creating stable ecosystems!
            </p>
          </div>

          <button className="tutorial-btn" onClick={() => setShowTutorial(!showTutorial)}>
            {showTutorial ? 'Hide Tutorial' : '📚 Show Tutorial'}
          </button>

          {showTutorial && (
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '40px',
              maxWidth: '900px',
              margin: '0 auto 40px auto'
            }}>
              <h2 style={{ color: '#2c3e50', marginTop: 0 }}>How to Play</h2>
              <ul style={{ color: '#555', lineHeight: 1.8 }}>
                <li><strong>🎯 Goal:</strong> Create a stable, biodiverse ecosystem that can withstand environmental changes.</li>
                <li><strong>🦋 Introduce Species:</strong> Add producers, consumers, and decomposers to build a complete food web.</li>
                <li><strong>⚖️ Balance Populations:</strong> Too many predators? Prey will disappear. Too few? Herbivores overgraze.</li>
                <li><strong>🌡️ Adapt to Climate:</strong> Seasons change temperature and rainfall. Species have different tolerances.</li>
                <li><strong>⚡ Respond to Events:</strong> Droughts, floods, diseases, and human impacts challenge your ecosystem.</li>
                <li><strong>📊 Monitor Trends:</strong> Watch population graphs to predict problems before they cause extinctions.</li>
                <li><strong>🏆 Earn Points:</strong> Biodiversity, stability, and species variety all contribute to your score.</li>
              </ul>
              <h3 style={{ color: '#2c3e50' }}>Trophic Levels</h3>
              <ul style={{ color: '#555', lineHeight: 1.8 }}>
                <li><strong style={{ color: '#27ae60' }}>🌱 Producers:</strong> Plants that convert sunlight to energy (base of food web)</li>
                <li><strong style={{ color: '#3498db' }}>🐰 Primary Consumers:</strong> Herbivores that eat plants</li>
                <li><strong style={{ color: '#9b59b6' }}>🦊 Secondary Consumers:</strong> Small carnivores that eat herbivores</li>
                <li><strong style={{ color: '#e74c3c' }}>🐺 Tertiary Consumers:</strong> Apex predators at top of food chain</li>
                <li><strong style={{ color: '#95a5a6' }}>🍄 Decomposers:</strong> Break down dead matter and recycle nutrients</li>
              </ul>
            </div>
          )}

          <div className="mode-selector">
            <div
              className={`mode-card ${gameMode === 'sandbox' ? 'selected' : ''}`}
              onClick={() => setGameMode('sandbox')}
            >
              <div className="mode-icon">🎨</div>
              <div className="mode-name">Sandbox</div>
              <div className="mode-desc">Unlimited time, experiment freely</div>
            </div>
            <div
              className={`mode-card ${gameMode === 'competitive' ? 'selected' : ''}`}
              onClick={() => setGameMode('competitive')}
            >
              <div className="mode-icon">🏆</div>
              <div className="mode-name">Competitive</div>
              <div className="mode-desc">Race for highest biodiversity</div>
            </div>
            <div
              className={`mode-card ${gameMode === 'coop' ? 'selected' : ''}`}
              onClick={() => setGameMode('coop')}
            >
              <div className="mode-icon">🤝</div>
              <div className="mode-name">Co-op</div>
              <div className="mode-desc">Work together to stabilize</div>
            </div>
          </div>

          <div className="biomes-grid">
            {BIOMES_DATA.map(biome => {
              const isLocked = biome.unlockLevel > 1; // Simple unlock system
              return (
                <div
                  key={biome.id}
                  className={`biome-card ${isLocked ? 'biome-locked' : ''}`}
                  onClick={() => !isLocked && handleStartGame(biome, gameMode)}
                >
                  <div
                    className="biome-header"
                    style={{ background: biome.backgroundGradient }}
                  >
                    {isLocked && <div className="lock-overlay">🔒</div>}
                    {!isLocked && biome.icon}
                    <div className={`biome-difficulty difficulty-${biome.difficulty}`}>
                      {'★'.repeat(biome.difficulty)}
                    </div>
                  </div>
                  <div className="biome-content">
                    <h3 className="biome-name">{biome.name}</h3>
                    <p className="biome-desc">{biome.description}</p>
                    <div className="biome-challenge">
                      <strong>Challenge:</strong> {biome.challengeDescription}
                    </div>
                    <div className="biome-stats">
                      <div className="biome-stat">
                        Target: <strong>{biome.biodiversityTarget} species</strong>
                      </div>
                      <div className="biome-stat">
                        Difficulty: <strong>{biome.difficulty}/5</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  if (!simulation || !dynamics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ecosystem-game">
      <style>{`
        .ecosystem-game {
          min-height: 100vh;
          background: linear-gradient(to bottom, #e0f7fa 0%, #b2ebf2 100%);
          padding: 20px;
        }

        .game-container {
          max-width: 1600px;
          margin: 0 auto;
        }

        .game-header {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .game-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          padding: 10px 20px;
          background: #95a5a6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #7f8c8d;
        }

        .game-title {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .game-score {
          text-align: right;
        }

        .score-value {
          font-size: 2rem;
          font-weight: bold;
          color: #27ae60;
          margin: 0;
        }

        .score-label {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin: 0;
        }

        .controls-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .control-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-btn.primary {
          background: #27ae60;
          color: white;
        }

        .control-btn.primary:hover {
          background: #229954;
        }

        .control-btn.secondary {
          background: #3498db;
          color: white;
        }

        .control-btn.secondary:hover {
          background: #2980b9;
        }

        .control-btn.danger {
          background: #e74c3c;
          color: white;
        }

        .control-btn.danger:hover {
          background: #c0392b;
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .speed-control {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .speed-label {
          font-size: 0.9rem;
          color: #7f8c8d;
          font-weight: 600;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 20px;
          margin-bottom: 20px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .game-over-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .game-over-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          text-align: center;
        }

        .game-over-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0 0 16px 0;
        }

        .game-over-icon {
          font-size: 5rem;
          margin-bottom: 20px;
        }

        .game-over-message {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 24px;
        }

        .game-over-stats {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .game-over-stat {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ecf0f1;
        }

        .game-over-stat:last-child {
          border-bottom: none;
        }

        .game-over-buttons {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="game-container">
        {/* Header */}
        <div className="game-header">
          <div className="game-title-section">
            <button className="back-btn" onClick={handleBackToMenu}>
              ← Back
            </button>
            <h1 className="game-title">
              {selectedBiome.icon} {selectedBiome.name}
            </h1>
          </div>
          <div className="game-score">
            <p className="score-value">{simulation.gameState.score.toLocaleString()}</p>
            <p className="score-label">Score</p>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-panel">
          {!simulation.isRunning ? (
            <button
              className="control-btn primary"
              onClick={simulation.controls.start}
            >
              ▶️ Start
            </button>
          ) : (
            <button
              className="control-btn danger"
              onClick={simulation.controls.pause}
            >
              ⏸️ Pause
            </button>
          )}

          <button
            className="control-btn secondary"
            onClick={simulation.controls.skipSeason}
          >
            ⏭️ Next Season
          </button>

          <button
            className="control-btn secondary"
            onClick={simulation.controls.reset}
          >
            🔄 Reset
          </button>

          <div className="speed-control">
            <span className="speed-label">Speed:</span>
            <button
              className="control-btn secondary"
              onClick={simulation.controls.slowDown}
            >
              -
            </button>
            <span style={{ fontWeight: 'bold', minWidth: '60px', textAlign: 'center' }}>
              {simulation.speed}ms
            </span>
            <button
              className="control-btn secondary"
              onClick={simulation.controls.speedUp}
            >
              +
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-grid">
          <div className="left-column">
            <BiomeDisplay
              biome={selectedBiome}
              ecosystem={simulation.gameState.ecosystem}
              seasonCount={simulation.gameState.seasonCount}
            />
            <PopulationGraph gameState={simulation.gameState} />
            <EventLog
              lastResult={simulation.lastResult}
              seasonCount={simulation.gameState.seasonCount}
            />
          </div>

          <SpeciesPanel
            gameState={simulation.gameState}
            onAddSpecies={simulation.controls.addSpecies}
            onRemoveSpecies={simulation.controls.removeSpeciesById}
            getPopulationHealth={dynamics.getPopulationHealth}
          />
        </div>

        {/* Game Over Overlay */}
        {simulation.gameState.isGameOver && (
          <div className="game-over-overlay">
            <div className="game-over-card">
              <div className="game-over-icon">
                {simulation.gameState.gameOverReason?.includes('Victory') ? '🎉' : '💀'}
              </div>
              <h2 className="game-over-title">
                {simulation.gameState.gameOverReason?.includes('Victory')
                  ? 'Victory!'
                  : 'Game Over'}
              </h2>
              <p className="game-over-message">
                {simulation.gameState.gameOverReason}
              </p>
              <div className="game-over-stats">
                <div className="game-over-stat">
                  <span>Final Score:</span>
                  <strong>{simulation.gameState.score.toLocaleString()}</strong>
                </div>
                <div className="game-over-stat">
                  <span>Seasons Survived:</span>
                  <strong>{simulation.gameState.seasonCount}</strong>
                </div>
                <div className="game-over-stat">
                  <span>Final Biodiversity:</span>
                  <strong>{Math.round(simulation.gameState.ecosystem.totalBiodiversity)}</strong>
                </div>
                <div className="game-over-stat">
                  <span>Species Count:</span>
                  <strong>{simulation.gameState.ecosystem.populations.size}</strong>
                </div>
              </div>
              <div className="game-over-buttons">
                <button
                  className="control-btn primary"
                  style={{ flex: 1 }}
                  onClick={simulation.controls.reset}
                >
                  Play Again
                </button>
                <button
                  className="control-btn secondary"
                  style={{ flex: 1 }}
                  onClick={handleBackToMenu}
                >
                  Change Biome
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoSystem;
