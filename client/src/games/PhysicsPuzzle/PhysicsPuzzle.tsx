import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PuzzleCanvas } from './components/PuzzleCanvas';
import { ForceVisualizer, ForceLegend } from './components/ForceVisualizer';
import { RelayProgress, RelayStats } from './components/RelayProgress';
import { ObjectPalette } from './components/PhysicsObject';
import { usePhysicsEngine } from './hooks/usePhysicsEngine';
import { useRelayLogic } from './hooks/useRelayLogic';
import { puzzleLevels, PhysicsObject, getConceptForLevel } from './data/puzzles';
import { PuzzleGenerator } from './utils/puzzleGenerator';

type GameMode = 'relay' | 'solo' | 'time-attack' | 'rube-goldberg';
type GameState = 'menu' | 'playing' | 'paused' | 'victory' | 'defeat';

export const PhysicsPuzzle: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('relay');
  const [playerCount, setPlayerCount] = useState(2);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);

  // Puzzle state
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzleLevels[0]);
  const [placedObjects, setPlacedObjects] = useState<PhysicsObject[]>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<PhysicsObject['type'] | null>(null);
  const [usedCounts, setUsedCounts] = useState<Record<string, number>>({});
  const [showForces, setShowForces] = useState(true);
  const [showVelocity, setShowVelocity] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  // Physics and relay hooks
  const physics = usePhysicsEngine();
  const puzzleGenerator = useMemo(() => new PuzzleGenerator(), []);

  const puzzleSequence = useMemo(() => {
    if (gameMode === 'relay') {
      return puzzleGenerator.generateRelaySequence(playerCount, difficulty);
    }
    return [currentPuzzle];
  }, [gameMode, playerCount, difficulty, currentPuzzle, puzzleGenerator]);

  const relay = useRelayLogic(playerCount, puzzleSequence);

  // Initialize puzzle
  const initializePuzzle = useCallback(() => {
    const puzzle = gameMode === 'relay' ? relay.getCurrentPuzzle() : currentPuzzle;
    if (!puzzle) return;

    setCurrentPuzzle(puzzle);
    setPlacedObjects([]);
    setUsedCounts({});
    setSelectedObjectType(null);

    physics.initialize(puzzle);

    if (gameMode === 'relay') {
      relay.startTurn();
    }
  }, [gameMode, currentPuzzle, physics, relay]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    initializePuzzle();
  }, [initializePuzzle]);

  // Handle canvas click to place objects
  const handleCanvasClick = useCallback(
    (x: number, y: number) => {
      if (!selectedObjectType) return;

      const available = currentPuzzle.availableObjects.find((a) => a.type === selectedObjectType);
      if (!available) return;

      const used = usedCounts[selectedObjectType] || 0;
      if (used >= available.count) return;

      // Create new object
      const newObject: PhysicsObject = {
        id: `placed-${selectedObjectType}-${Date.now()}`,
        type: selectedObjectType,
        x,
        y,
        color: (available.properties.color as string) || '#ffffff',
        mass: available.properties.mass || 1,
        friction: available.properties.friction || 0.5,
        restitution: available.properties.restitution || 0.5,
        isStatic: available.properties.isStatic || false,
        width: available.properties.width,
        height: available.properties.height,
        radius: available.properties.radius,
        angle: available.properties.angle || 0,
      };

      // Add to physics world
      if (selectedObjectType === 'pendulum') {
        physics.addObject(newObject, true, 100);
      } else {
        physics.addObject(newObject, false);
      }

      setPlacedObjects((prev) => [...prev, newObject]);
      setUsedCounts((prev) => ({
        ...prev,
        [selectedObjectType]: (prev[selectedObjectType] || 0) + 1,
      }));
    },
    [selectedObjectType, currentPuzzle, usedCounts, physics]
  );

  // Start simulation
  const runSimulation = useCallback(() => {
    physics.start();
  }, [physics]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    physics.stop();
  }, [physics]);

  // Reset puzzle
  const resetPuzzle = useCallback(() => {
    physics.reset();
    initializePuzzle();

    if (gameMode === 'relay') {
      relay.retryPuzzle();
    }
  }, [physics, initializePuzzle, gameMode, relay]);

  // Check objectives
  useEffect(() => {
    if (gameState !== 'playing' || !physics.state.isRunning) return;

    const checkObjectives = () => {
      let allCompleted = true;

      for (const objective of currentPuzzle.objectives) {
        switch (objective.type) {
          case 'reach': {
            const targetId = objective.targetId;
            if (!targetId) break;

            let reached = false;
            currentPuzzle.initialObjects
              .filter((obj) => !obj.isStatic && !obj.isSensor)
              .forEach((obj) => {
                if (physics.isTouching(obj.id, targetId)) {
                  reached = true;
                }
              });

            placedObjects.forEach((obj) => {
              if (physics.isTouching(obj.id, targetId)) {
                reached = true;
              }
            });

            if (!reached) allCompleted = false;
            break;
          }

          case 'collect':
          case 'activate':
          case 'chain':
            // These would need more complex tracking
            break;
        }
      }

      if (allCompleted) {
        handlePuzzleComplete(true);
      }
    };

    const interval = setInterval(checkObjectives, 100);
    return () => clearInterval(interval);
  }, [gameState, physics.state.isRunning, currentPuzzle, placedObjects, physics]);

  // Handle puzzle completion
  const handlePuzzleComplete = useCallback(
    (success: boolean) => {
      physics.stop();

      if (gameMode === 'relay') {
        const objectsUsed = placedObjects.length;
        relay.completePuzzle(objectsUsed, success);

        if (relay.relayState.isComplete) {
          setGameState('victory');
        } else {
          // Move to next player
          setTimeout(() => {
            initializePuzzle();
          }, 1500);
        }
      } else {
        setGameState(success ? 'victory' : 'defeat');
      }
    },
    [physics, gameMode, placedObjects, relay, initializePuzzle]
  );

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGameState('menu');
    physics.reset();
    relay.reset();
    setPlacedObjects([]);
    setUsedCounts({});
  }, [physics, relay]);

  // Render menu
  if (gameState === 'menu') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0a0a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'monospace',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            marginBottom: '10px',
            background: 'linear-gradient(90deg, #4ade80, #60a5fa, #f472b6, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Physics Puzzle Relay
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '40px', textAlign: 'center' }}>
          Team relay race through physics puzzles
        </p>

        {/* Game Mode Selection */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '100%',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#64b5f6' }}>Game Mode</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {(['relay', 'solo', 'time-attack', 'rube-goldberg'] as GameMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setGameMode(mode)}
                style={{
                  padding: '12px',
                  background: gameMode === mode ? 'rgba(100, 200, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  border: gameMode === mode ? '2px solid #64b5f6' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                {mode.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '100%',
            marginBottom: '30px',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#64b5f6' }}>Settings</h3>

          {gameMode === 'relay' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Players: {playerCount}
              </label>
              <input
                type="range"
                min="2"
                max="4"
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Difficulty: {difficulty}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              style={{ width: '100%' }}
            />
          </div>

          {gameMode === 'solo' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Level: {selectedLevel}
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  const level = Number(e.target.value);
                  setSelectedLevel(level);
                  setCurrentPuzzle(puzzleLevels[level - 1]);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  border: '1px solid rgba(100, 200, 255, 0.3)',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {puzzleLevels.slice(0, 10).map((level) => (
                  <option key={level.id} value={level.id}>
                    Level {level.id}: {level.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={startGame}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Start Game
        </button>

        {/* Info */}
        <div
          style={{
            marginTop: '40px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>How to Play:</div>
          <div>1. Select objects from the palette</div>
          <div>2. Click on the canvas to place them</div>
          <div>3. Press START to run the simulation</div>
          <div>4. Complete objectives to win!</div>
        </div>
      </div>
    );
  }

  // Render victory/defeat
  if (gameState === 'victory' || gameState === 'defeat') {
    const stats = relay.getStats();

    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background:
            gameState === 'victory'
              ? 'linear-gradient(135deg, #0a2e0a 0%, #1a4e1a 100%)'
              : 'linear-gradient(135deg, #2e0a0a 0%, #4e1a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'monospace',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>
          {gameState === 'victory' ? 'Victory!' : 'Try Again'}
        </h1>

        {gameMode === 'relay' && (
          <div style={{ marginBottom: '30px', width: '500px' }}>
            <RelayStats
              players={relay.relayState.players}
              averageTime={stats.averageTime}
              bestTime={stats.bestTime}
              worstTime={stats.worstTime}
              totalAttempts={stats.totalAttempts}
              efficiency={stats.efficiency}
            />
          </div>
        )}

        <div style={{ fontSize: '24px', marginBottom: '40px' }}>
          {gameMode === 'relay' ? (
            <>
              Team Score: {relay.relayState.totalScore.toLocaleString()} | Time: {relay.relayState.totalTime.toFixed(1)}s
            </>
          ) : (
            <>Objects Used: {placedObjects.length} / Par: {currentPuzzle.par}</>
          )}
        </div>

        <button
          onClick={returnToMenu}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          Return to Menu
        </button>
      </div>
    );
  }

  // Get current concepts
  const concepts = getConceptForLevel(currentPuzzle.id);

  // Render game
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: 'monospace',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderBottom: '2px solid rgba(100, 200, 255, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>{currentPuzzle.name}</h2>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
            {currentPuzzle.description}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '13px' }}>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Objects:</span>{' '}
            <span style={{ color: '#f472b6', fontWeight: 'bold' }}>{placedObjects.length}</span> / {currentPuzzle.par}
          </div>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Time:</span>{' '}
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{physics.state.time.toFixed(1)}s</span>
          </div>
          {gameMode === 'relay' && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Score:</span>{' '}
              <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{relay.relayState.totalScore.toLocaleString()}</span>
            </div>
          )}
        </div>

        <button
          onClick={returnToMenu}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 100, 100, 0.2)',
            color: '#fff',
            border: '1px solid rgba(255, 100, 100, 0.5)',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Exit
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <div
          style={{
            width: '280px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          {gameMode === 'relay' && (
            <RelayProgress
              players={relay.relayState.players}
              currentPlayerIndex={relay.relayState.currentPlayerIndex}
              totalScore={relay.relayState.totalScore}
              totalTime={relay.relayState.totalTime}
              effects={relay.relayState.effects}
            />
          )}

          {/* Objectives */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '15px',
              borderRadius: '10px',
              border: '1px solid rgba(100, 200, 255, 0.3)',
            }}
          >
            <h4 style={{ marginTop: 0, color: '#64b5f6', fontSize: '14px' }}>Objectives</h4>
            {currentPuzzle.objectives.map((obj, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: '12px',
                  marginBottom: '6px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                ○ {obj.description}
              </div>
            ))}
          </div>

          {/* Hints */}
          {currentPuzzle.hints && currentPuzzle.hints.length > 0 && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <h4 style={{ marginTop: 0, color: '#fbbf24', fontSize: '14px' }}>Hints</h4>
              {currentPuzzle.hints.map((hint, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '11px',
                    marginBottom: '4px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  💡 {hint}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {concepts && concepts.length > 0 && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              <h4
                style={{ marginTop: 0, color: '#a855f7', fontSize: '14px', cursor: 'pointer' }}
                onClick={() => setShowEducation(!showEducation)}
              >
                Physics Concepts {showEducation ? '▼' : '▶'}
              </h4>
              {showEducation &&
                concepts
                  .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined)
                  .map((concept, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '11px',
                        marginBottom: '8px',
                        paddingBottom: '8px',
                        borderBottom: idx < concepts.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>
                        {concept.name}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                        {concept.educationalContent.concept}
                      </div>
                      {concept.educationalContent.formula && (
                        <div
                          style={{
                            color: '#64b5f6',
                            fontStyle: 'italic',
                            marginBottom: '4px',
                            fontFamily: 'serif',
                          }}
                        >
                          {concept.educationalContent.formula}
                        </div>
                      )}
                      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '10px' }}>
                        💡 {concept.educationalContent.funFact}
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Center - Game Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px', position: 'relative' }}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <PuzzleCanvas
              width={800}
              height={600}
              bodies={physics.getAllBodies()}
              selectedObject={
                selectedObjectType
                  ? {
                      id: 'preview',
                      type: selectedObjectType,
                      x: 0,
                      y: 0,
                      color:
                        (currentPuzzle.availableObjects.find((a) => a.type === selectedObjectType)?.properties
                          .color as string) || '#ffffff',
                      mass: 1,
                      friction: 0.5,
                      restitution: 0.5,
                      isStatic: false,
                      width: currentPuzzle.availableObjects.find((a) => a.type === selectedObjectType)?.properties
                        .width,
                      height: currentPuzzle.availableObjects.find((a) => a.type === selectedObjectType)?.properties
                        .height,
                      radius: currentPuzzle.availableObjects.find((a) => a.type === selectedObjectType)?.properties
                        .radius,
                    }
                  : null
              }
              onCanvasClick={handleCanvasClick}
              showGrid={true}
              showVelocity={showVelocity}
            />

            {/* Force vectors overlay */}
            {showForces && <ForceVisualizer forces={physics.forceVectors} width={800} height={600} showLabels={true} />}
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '8px',
              border: '1px solid rgba(100, 200, 255, 0.3)',
            }}
          >
            <button
              onClick={runSimulation}
              disabled={physics.state.isRunning}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                background: physics.state.isRunning ? 'rgba(100, 100, 100, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                color: '#fff',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                borderRadius: '6px',
                cursor: physics.state.isRunning ? 'not-allowed' : 'pointer',
              }}
            >
              ▶ START
            </button>

            <button
              onClick={stopSimulation}
              disabled={!physics.state.isRunning}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                background: !physics.state.isRunning ? 'rgba(100, 100, 100, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                color: '#fff',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '6px',
                cursor: !physics.state.isRunning ? 'not-allowed' : 'pointer',
              }}
            >
              ■ STOP
            </button>

            <button
              onClick={resetPuzzle}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                background: 'rgba(251, 191, 36, 0.3)',
                color: '#fff',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ↻ RESET
            </button>

            <div style={{ flex: 1 }} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showForces} onChange={(e) => setShowForces(e.target.checked)} />
              Forces
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showVelocity} onChange={(e) => setShowVelocity(e.target.checked)} />
              Velocity
            </label>
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            width: '280px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          <ObjectPalette
            availableObjects={currentPuzzle.availableObjects}
            selectedType={selectedObjectType}
            onSelectType={setSelectedObjectType}
            usedCounts={usedCounts}
          />

          {showForces && <ForceLegend compact={false} />}
        </div>
      </div>
    </div>
  );
};

export default PhysicsPuzzle;
