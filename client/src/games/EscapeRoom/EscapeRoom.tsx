import React, { useState, useEffect, useCallback } from 'react';
import { Room } from './components/Room';
import { Puzzle } from './components/Puzzle';
import { Inventory } from './components/Inventory';
import { Timer } from './components/Timer';
import { CoopIndicators } from './components/CoopIndicators';
import { usePuzzleGenerator } from './hooks/usePuzzleGenerator';
import { useCoopSync } from './hooks/useCoopSync';
import { DisasterScenario, disasters, labRooms, InteractiveObject } from './data/rooms';
import { PuzzleData } from './data/puzzles';
import { canCombineItems } from './utils/puzzleLogic';
import {
  getRoomById,
  initializeRoomProgress,
  calculateOverallProgress,
  checkAchievements,
  calculateFinalScore,
  isRoomAccessible
} from './utils/roomGeneration';

type GameState = 'menu' | 'lobby' | 'playing' | 'paused' | 'won' | 'lost';

interface EscapeRoomProps {
  gameId?: string;
  playerId?: string;
  playerName?: string;
}

export const EscapeRoom: React.FC<EscapeRoomProps> = ({
  gameId = `game_${Date.now()}`,
  playerId = `player_${Math.random().toString(36).substr(2, 9)}`,
  playerName = 'Player'
}) => {
  // Game State
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterScenario>('radiation_leak');
  const [currentRoomId, setCurrentRoomId] = useState('room_01');
  const [inventory, setInventory] = useState<string[]>([]);
  const [globalPuzzlesSolved, setGlobalPuzzlesSolved] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [activePuzzle, setActivePuzzle] = useState<PuzzleData | null>(null);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [roomProgress, setRoomProgress] = useState<any>({});

  // Get current disaster and room
  const disaster = disasters.find(d => d.id === selectedDisaster)!;
  const currentRoom = getRoomById(currentRoomId);

  // Hooks
  const puzzleGenerator = usePuzzleGenerator({
    room: currentRoom!,
    seed: Date.now(),
    enableRandomGeneration: true
  });

  const coopSync = useCoopSync({
    gameId,
    playerId,
    playerName,
    onMessage: (message) => {
      console.log('Received message:', message);
    }
  });

  // Initialize room progress when disaster is selected
  useEffect(() => {
    if (gameState === 'playing' && disaster) {
      const progress = initializeRoomProgress(disaster);
      setRoomProgress(progress);
    }
  }, [gameState, disaster]);

  // Start game
  const handleStartGame = useCallback((disasterType: DisasterScenario) => {
    setSelectedDisaster(disasterType);
    setGameState('lobby');
    setStartTime(Date.now());
    setCurrentRoomId('room_01');
    setInventory([]);
    setGlobalPuzzlesSolved([]);
    setScore(0);
    setAchievements([]);
  }, []);

  // Begin gameplay
  const handleBeginGame = useCallback(() => {
    setGameState('playing');
    setStartTime(Date.now());
    coopSync.startGame();
  }, [coopSync]);

  // Handle object interaction
  const handleObjectInteract = useCallback((obj: InteractiveObject) => {
    switch (obj.interactionType) {
      case 'puzzle':
        const availablePuzzle = puzzleGenerator.getRemainingPuzzles()[0];
        if (availablePuzzle) {
          setActivePuzzle(availablePuzzle);
          puzzleGenerator.startPuzzle(availablePuzzle);
        }
        break;

      case 'item':
        if (obj.reward) {
          setInventory(prev => [...prev, obj.reward!]);
          coopSync.broadcastItemCollected(obj.reward!);
        }
        break;

      case 'clue':
        alert(obj.description);
        break;

      case 'combination':
        // Special combination puzzle
        break;
    }
  }, [puzzleGenerator, coopSync]);

  // Handle puzzle submission
  const handlePuzzleSubmit = useCallback((answer: string | string[]) => {
    if (!activePuzzle) return;

    const result = puzzleGenerator.submitSolution(answer, playerId);

    if (result.correct) {
      setGlobalPuzzlesSolved(prev => [...prev, activePuzzle.id]);
      setScore(prev => prev + (result.score || 0));
      coopSync.broadcastPuzzleSolved(activePuzzle.id, result.score || 0);

      // Add reward items to inventory
      if (activePuzzle.rewardItems) {
        activePuzzle.rewardItems.forEach(item => {
          setInventory(prev => [...prev, item]);
        });
      }

      setTimeout(() => {
        setActivePuzzle(null);
        puzzleGenerator.closePuzzle();
      }, 2000);
    }
  }, [activePuzzle, puzzleGenerator, playerId, coopSync]);

  // Handle hint request
  const handleHintRequest = useCallback(() => {
    const hint = puzzleGenerator.requestHint();
    return hint;
  }, [puzzleGenerator]);

  // Handle room change
  const handleRoomChange = useCallback((newRoomId: string) => {
    const newRoom = getRoomById(newRoomId);
    if (!newRoom) return;

    const { accessible, reason } = isRoomAccessible(
      newRoom,
      inventory,
      globalPuzzlesSolved
    );

    if (accessible) {
      setCurrentRoomId(newRoomId);
      coopSync.broadcastPosition({ x: 50, y: 50 }, newRoomId);
    } else {
      alert(reason || 'Cannot access this room');
    }
  }, [inventory, globalPuzzlesSolved, coopSync]);

  // Handle item combination
  const handleItemCombine = useCallback((itemIds: string[]) => {
    const items = itemIds.map(id => ({ id } as any));
    const result = canCombineItems(items, itemIds);

    if (result.canCombine && result.result) {
      // Remove used items
      setInventory(prev => prev.filter(id => !itemIds.includes(id)));
      // Add new item
      setInventory(prev => [...prev, result.result!]);
      alert(result.message);
    } else {
      alert(result.message);
    }
  }, []);

  // Check win condition
  useEffect(() => {
    if (gameState !== 'playing') return;

    const progress = calculateOverallProgress(
      disaster,
      roomProgress,
      globalPuzzlesSolved
    );

    if (progress.percentage === 100) {
      const timeRemaining = disaster.timeLimit - Math.floor((Date.now() - startTime) / 1000);
      const newAchievements = checkAchievements(
        disaster,
        timeRemaining,
        puzzleGenerator.puzzleState?.hintsUsed || 0,
        coopSync.getActivePlayerCount()
      );

      const finalScore = calculateFinalScore(
        [score],
        timeRemaining,
        disaster,
        newAchievements
      );

      setAchievements(newAchievements);
      setScore(finalScore);
      setGameState('won');
      coopSync.endGame(true);
    }
  }, [gameState, disaster, roomProgress, globalPuzzlesSolved, startTime, puzzleGenerator, coopSync, score]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setGameState('lost');
    coopSync.endGame(false);
  }, [coopSync]);

  // Render menu
  const renderMenu = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '64px',
          color: '#fff',
          marginBottom: '16px',
          textShadow: '0 0 30px rgba(255,255,255,0.5)',
          fontWeight: 'bold'
        }}>
          🧪 ESCAPE ROOM
        </h1>
        <h2 style={{
          fontSize: '32px',
          color: '#f44336',
          marginBottom: '48px',
          textShadow: '0 0 20px rgba(244,67,54,0.5)'
        }}>
          Lab Disaster
        </h2>

        <p style={{
          color: '#ccc',
          fontSize: '18px',
          marginBottom: '48px',
          lineHeight: '1.6'
        }}>
          Work together with your team to solve science puzzles and escape before time runs out!
        </p>

        <div style={{
          display: 'grid',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {disasters.map(dis => (
            <button
              key={dis.id}
              onClick={() => handleStartGame(dis.id)}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '3px solid #4a90e2',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(74,144,226,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <span style={{ fontSize: '48px' }}>
                  {dis.id === 'radiation_leak' ? '☢️' : dis.id === 'virus_outbreak' ? '🦠' : '🔥'}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px' }}>{dis.name}</h3>
                  <div style={{
                    display: 'inline-block',
                    background: dis.difficulty === 'extreme' ? '#f44336' : dis.difficulty === 'hard' ? '#FF9800' : '#4CAF50',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginTop: '8px'
                  }}>
                    {dis.difficulty.toUpperCase()}
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                {dis.description}
              </p>
              <div style={{ marginTop: '12px', color: '#4a90e2', fontSize: '14px' }}>
                ⏱️ Time Limit: {Math.floor(dis.timeLimit / 60)} minutes
              </div>
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '20px',
          color: '#ccc',
          fontSize: '14px'
        }}>
          <strong>Features:</strong> 15 themed labs • 2-4 player co-op • Real-time collaboration •
          Random puzzles • Timer challenges • Hint system • Voice chat support
        </div>
      </div>
    </div>
  );

  // Render lobby
  const renderLobby = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '40px',
        border: '3px solid #4a90e2'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
          Waiting for Players...
        </h2>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '12px' }}>
            Players Ready: {coopSync.getActivePlayerCount()}/4
          </div>
          {/* Player list would go here */}
        </div>

        <button
          onClick={handleBeginGame}
          disabled={!coopSync.areAllPlayersReady()}
          style={{
            width: '100%',
            padding: '16px',
            background: coopSync.areAllPlayersReady()
              ? 'linear-gradient(135deg, #4CAF50, #45a049)'
              : '#555',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: coopSync.areAllPlayersReady() ? 'pointer' : 'not-allowed'
          }}
        >
          {coopSync.areAllPlayersReady() ? 'Start Game' : 'Waiting for Players...'}
        </button>

        <button
          onClick={() => setGameState('menu')}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '12px',
            background: 'transparent',
            border: '2px solid #666',
            borderRadius: '12px',
            color: '#999',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );

  // Render game
  const renderGame = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '140px 20px 120px 20px'
    }}>
      {/* Timer */}
      <Timer
        disaster={disaster}
        startTime={startTime}
        isPaused={gameState === 'paused'}
        onTimeUp={handleTimeUp}
      />

      {/* Coop Indicators */}
      <CoopIndicators
        players={coopSync.players}
        currentPlayerId={playerId}
        currentRoom={currentRoomId}
        onVoiceToggle={coopSync.toggleVoice}
        isConnected={coopSync.isConnected}
        connectionError={coopSync.connectionError}
      />

      {/* Room */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {currentRoom && (
          <Room
            room={currentRoom}
            players={Object.values(coopSync.players)}
            currentPlayerId={playerId}
            onObjectInteract={handleObjectInteract}
            onRoomChange={handleRoomChange}
            solvedPuzzles={globalPuzzlesSolved}
            inventory={inventory}
          />
        )}
      </div>

      {/* Inventory */}
      <Inventory
        items={inventory}
        onItemUse={(itemId) => console.log('Use item:', itemId)}
        onItemCombine={handleItemCombine}
      />

      {/* Active Puzzle */}
      {activePuzzle && puzzleGenerator.puzzleState && (
        <Puzzle
          puzzle={activePuzzle}
          puzzleState={puzzleGenerator.puzzleState}
          onSubmit={handlePuzzleSubmit}
          onRequestHint={handleHintRequest}
          onClose={() => {
            setActivePuzzle(null);
            puzzleGenerator.closePuzzle();
          }}
          playerCount={coopSync.getActivePlayerCount()}
        />
      )}

      {/* Pause Menu */}
      {gameState === 'paused' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#1a1a2e',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#fff', marginBottom: '24px' }}>Game Paused</h2>
            <button
              onClick={() => setGameState('playing')}
              style={{
                padding: '12px 32px',
                background: '#4CAF50',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              Resume
            </button>
            <button
              onClick={() => setGameState('menu')}
              style={{
                padding: '12px 32px',
                background: '#f44336',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render end screen
  const renderEndScreen = (won: boolean) => (
    <div style={{
      minHeight: '100vh',
      background: won
        ? 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
        : 'linear-gradient(135deg, #2c1e1e 0%, #4a2424 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>
          {won ? '🎉' : '💀'}
        </div>
        <h1 style={{
          color: won ? '#4CAF50' : '#f44336',
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          {won ? 'SUCCESS!' : 'MISSION FAILED'}
        </h1>
        <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '32px' }}>
          {won
            ? 'You successfully stopped the disaster and escaped the lab!'
            : 'Time ran out. The disaster could not be contained.'}
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ color: '#fff', fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
            {score.toLocaleString()}
          </div>
          <div style={{ color: '#888', fontSize: '14px' }}>TOTAL SCORE</div>

          {achievements.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ color: '#FFC107', fontSize: '14px', marginBottom: '12px' }}>
                🏆 ACHIEVEMENTS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {achievements.map(ach => (
                  <span
                    key={ach}
                    style={{
                      background: 'rgba(255,193,7,0.2)',
                      border: '1px solid #FFC107',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#FFC107'
                    }}
                  >
                    {ach.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setGameState('menu')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #4a90e2, #357abd)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );

  // Main render
  switch (gameState) {
    case 'menu':
      return renderMenu();
    case 'lobby':
      return renderLobby();
    case 'playing':
    case 'paused':
      return renderGame();
    case 'won':
      return renderEndScreen(true);
    case 'lost':
      return renderEndScreen(false);
    default:
      return renderMenu();
  }
};

export default EscapeRoom;
