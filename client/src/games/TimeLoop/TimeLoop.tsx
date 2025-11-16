import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timeline } from './components/Timeline';
import { ParadoxIndicator } from './components/ParadoxIndicator';
import { LoopRecorder } from './components/LoopRecorder';
import { CausalityChain } from './components/CausalityChain';
import { useTimeTravel } from './hooks/useTimeTravel';
import { useParadoxLogic } from './hooks/useParadoxLogic';
import { scenarios, Scenario } from './data/scenarios';
import { PlayerAction } from './utils/timeEngine';

interface Player {
  id: number;
  x: number;
  y: number;
  color: string;
  isGhost: boolean;
}

interface Resource {
  id: string;
  x: number;
  y: number;
  type: 'energy' | 'matter' | 'information';
  value: number;
  collected: boolean;
}

export const TimeLoop: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'victory' | 'defeat'>(
    'menu'
  );
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [ghostPlayers, setGhostPlayers] = useState<Player[]>([]);
  const [score, setScore] = useState(0);
  const [objectives, setObjectives] = useState<{ completed: boolean; text: string }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // Custom hooks
  const timeTravel = useTimeTravel(
    selectedScenario.timelineLength,
    loop => {
      console.log('Loop completed:', loop);
      setScore(prev => prev + Math.floor(loop.resources.energy / 10));
    },
    () => {
      console.log('Paradox detected!');
    }
  );

  const paradoxLogic = useParadoxLogic(selectedScenario.paradoxTolerance, () => {
    console.log('Timeline collapsed!');
    setGameState('defeat');
  });

  // Initialize game
  useEffect(() => {
    if (gameState === 'playing') {
      initializeGame();
    }
  }, [gameState, selectedScenario, playerCount]);

  const initializeGame = () => {
    // Initialize players
    const newPlayers: Player[] = [];
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#facc15'];

    for (let i = 0; i < playerCount; i++) {
      newPlayers.push({
        id: i,
        x: 100 + i * 100,
        y: 300,
        color: colors[i % colors.length],
        isGhost: false,
      });
    }

    setPlayers(newPlayers);

    // Initialize resources
    const newResources: Resource[] = [];
    const resourceTypes: ('energy' | 'matter' | 'information')[] = ['energy', 'matter', 'information'];

    for (let i = 0; i < 20; i++) {
      newResources.push({
        id: `resource-${i}`,
        x: Math.random() * 750 + 25,
        y: Math.random() * 550 + 25,
        type: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
        value: Math.floor(Math.random() * 30) + 10,
        collected: false,
      });
    }

    setResources(newResources);

    // Initialize objectives
    setObjectives(
      selectedScenario.objectives.map(obj => ({
        completed: false,
        text: obj,
      }))
    );
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      updateGame();
      renderGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, players, resources, ghostPlayers]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      // Special keys
      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      } else if (e.key === 'r') {
        resetLoop();
      } else if (e.key === 'b') {
        branchTimeline();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateGame = () => {
    if (timeTravel.isPaused) return;

    // Update player positions
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(player => {
        if (player.isGhost) return player;

        let dx = 0;
        let dy = 0;
        const speed = 3;

        // Player 1 controls (WASD)
        if (player.id === 0) {
          if (keysPressed.current.has('w')) dy -= speed;
          if (keysPressed.current.has('s')) dy += speed;
          if (keysPressed.current.has('a')) dx -= speed;
          if (keysPressed.current.has('d')) dx += speed;
        }

        // Player 2 controls (Arrow keys)
        if (player.id === 1) {
          if (keysPressed.current.has('arrowup')) dy -= speed;
          if (keysPressed.current.has('arrowdown')) dy += speed;
          if (keysPressed.current.has('arrowleft')) dx -= speed;
          if (keysPressed.current.has('arrowright')) dx += speed;
        }

        const newX = Math.max(15, Math.min(785, player.x + dx));
        const newY = Math.max(15, Math.min(585, player.y + dy));

        // Record action if moved
        if (dx !== 0 || dy !== 0) {
          timeTravel.recordAction({
            type: 'move',
            position: { x: newX, y: newY },
            data: { playerId: player.id },
            playerId: player.id,
          });

          // Create causal link if near another player
          prevPlayers.forEach(otherPlayer => {
            if (otherPlayer.id !== player.id) {
              const distance = Math.sqrt(
                Math.pow(newX - otherPlayer.x, 2) + Math.pow(newY - otherPlayer.y, 2)
              );
              if (distance < 50) {
                // Players are interacting
                paradoxLogic.createCausalLink(
                  `action-${Date.now()}-${player.id}`,
                  `action-${Date.now()}-${otherPlayer.id}`,
                  timeTravel.currentTimelineId,
                  0.7,
                  'direct'
                );
              }
            }
          });
        }

        return { ...player, x: newX, y: newY };
      });

      return newPlayers;
    });

    // Check resource collection
    setResources(prevResources => {
      return prevResources.map(resource => {
        if (resource.collected) return resource;

        for (const player of players) {
          if (player.isGhost) continue;

          const distance = Math.sqrt(
            Math.pow(player.x - resource.x, 2) + Math.pow(player.y - resource.y, 2)
          );

          if (distance < 20) {
            // Collect resource
            timeTravel.updateResources({
              [resource.type]: resource.value,
            });

            timeTravel.recordAction({
              type: 'collect',
              position: { x: resource.x, y: resource.y },
              data: { resource: resource.type, value: resource.value, playerId: player.id },
              playerId: player.id,
            });

            return { ...resource, collected: true };
          }
        }

        return resource;
      });
    });

    // Update ghost players from past loops
    const ghostActions = timeTravel.getGhostActions(timeTravel.currentTime);
    setGhostPlayers(
      ghostActions.map(action => ({
        id: action.playerId + 100,
        x: action.position.x,
        y: action.position.y,
        color: '#888888',
        isGhost: true,
      }))
    );

    // Check for paradoxes
    const currentActions: PlayerAction[] = [];
    paradoxLogic.checkForParadoxes(
      currentActions,
      timeTravel.recordedLoops,
      timeTravel.currentTime
    );

    // Check objectives
    checkObjectives();
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);

    // Background
    const bgGradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 500);
    bgGradient.addColorStop(0, '#1a1a2e');
    bgGradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 600);

    // Grid
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y < 600; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Resources
    resources.forEach(resource => {
      if (resource.collected) return;

      const resourceColors = {
        energy: '#FFD700',
        matter: '#4169E1',
        information: '#00CED1',
      };

      // Glow
      const glowGradient = ctx.createRadialGradient(
        resource.x,
        resource.y,
        0,
        resource.x,
        resource.y,
        15
      );
      glowGradient.addColorStop(0, `${resourceColors[resource.type]}60`);
      glowGradient.addColorStop(1, `${resourceColors[resource.type]}00`);
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(resource.x, resource.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Resource orb
      ctx.fillStyle = resourceColors[resource.type];
      ctx.beginPath();
      ctx.arc(resource.x, resource.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Ghost players (past selves)
    ghostPlayers.forEach(ghost => {
      // Ghost glow
      const ghostGradient = ctx.createRadialGradient(ghost.x, ghost.y, 0, ghost.x, ghost.y, 20);
      ghostGradient.addColorStop(0, 'rgba(136, 136, 136, 0.3)');
      ghostGradient.addColorStop(1, 'rgba(136, 136, 136, 0)');
      ctx.fillStyle = ghostGradient;
      ctx.beginPath();
      ctx.arc(ghost.x, ghost.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Ghost player
      ctx.fillStyle = 'rgba(136, 136, 136, 0.5)';
      ctx.beginPath();
      ctx.arc(ghost.x, ghost.y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Current players
    players.forEach(player => {
      if (player.isGhost) return;

      // Player glow
      const playerGradient = ctx.createRadialGradient(
        player.x,
        player.y,
        0,
        player.x,
        player.y,
        25
      );
      playerGradient.addColorStop(0, `${player.color}80`);
      playerGradient.addColorStop(1, `${player.color}00`);
      ctx.fillStyle = playerGradient;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Player
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Player ID
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`P${player.id + 1}`, player.x, player.y);
    });

    // Time indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 40);
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 40);

    ctx.fillStyle = '#64b5f6';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Time: ${timeTravel.currentTime.toFixed(1)}s`, 20, 30);
  };

  const checkObjectives = () => {
    // Example objective checks
    setObjectives(prev =>
      prev.map((obj, idx) => {
        if (obj.completed) return obj;

        // Check energy objective
        if (obj.text.includes('energy') && timeTravel.resources.energy >= 100) {
          return { ...obj, completed: true };
        }

        // Check matter objective
        if (obj.text.includes('matter') && timeTravel.resources.matter >= 100) {
          return { ...obj, completed: true };
        }

        // Check information objective
        if (obj.text.includes('information') && timeTravel.resources.information >= 100) {
          return { ...obj, completed: true };
        }

        return obj;
      })
    );

    // Check victory
    if (objectives.every(obj => obj.completed)) {
      setGameState('victory');
    }
  };

  const togglePause = () => {
    if (timeTravel.isPaused) {
      timeTravel.resume();
    } else {
      timeTravel.pause();
    }
  };

  const resetLoop = () => {
    timeTravel.startNewLoop();
    initializeGame();
  };

  const branchTimeline = () => {
    const newId = timeTravel.branchTimeline();
    console.log('Created new timeline:', newId);
  };

  const startGame = () => {
    setGameState('playing');
  };

  const returnToMenu = () => {
    setGameState('menu');
    paradoxLogic.reset();
  };

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
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            marginBottom: '10px',
            background: 'linear-gradient(90deg, #4ade80, #60a5fa, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Time Loop Strategist
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '40px' }}>
          Compete against your past self across time
        </p>

        {/* Scenario Selection */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '600px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Select Scenario</h3>
          <select
            value={selectedScenario.id}
            onChange={e => {
              const scenario = scenarios.find(s => s.id === e.target.value);
              if (scenario) setSelectedScenario(scenario);
            }}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              border: '1px solid rgba(100, 200, 255, 0.3)',
              borderRadius: '5px',
              marginBottom: '15px',
            }}
          >
            {scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name} ({scenario.difficulty})
              </option>
            ))}
          </select>

          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          >
            <p style={{ marginTop: 0 }}>{selectedScenario.description}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
              {selectedScenario.historicalContext}
            </p>
            <div style={{ marginTop: '10px' }}>
              <strong>Scientific Concept:</strong> {selectedScenario.scientificConcept}
            </div>
          </div>
        </div>

        {/* Player Count */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ marginRight: '10px' }}>Players:</label>
          <select
            value={playerCount}
            onChange={e => setPlayerCount(Number(e.target.value))}
            style={{
              padding: '8px',
              fontSize: '14px',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              border: '1px solid rgba(100, 200, 255, 0.3)',
              borderRadius: '5px',
            }}
          >
            <option value={1}>1 Player</option>
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
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
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Start Game
        </button>

        {/* Controls */}
        <div
          style={{
            marginTop: '40px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
          }}
        >
          <div>WASD - Player 1 Movement | Arrow Keys - Player 2 Movement</div>
          <div>SPACE - Pause/Resume | R - Reset Loop | B - Branch Timeline</div>
        </div>
      </div>
    );
  }

  // Render victory/defeat
  if (gameState === 'victory' || gameState === 'defeat') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: gameState === 'victory'
            ? 'linear-gradient(135deg, #0a2e0a 0%, #1a4e1a 100%)'
            : 'linear-gradient(135deg, #2e0a0a 0%, #4e1a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>
          {gameState === 'victory' ? 'Victory!' : 'Timeline Collapsed'}
        </h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>Score: {score}</p>
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
          padding: '15px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderBottom: '2px solid rgba(100, 200, 255, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedScenario.name}</h2>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Loop {timeTravel.currentLoop} | Score: {score}
          </div>
        </div>

        {/* Resources */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <span style={{ color: '#FFD700' }}>⚡ Energy:</span> {timeTravel.resources.energy}
          </div>
          <div>
            <span style={{ color: '#4169E1' }}>🔷 Matter:</span> {timeTravel.resources.matter}
          </div>
          <div>
            <span style={{ color: '#00CED1' }}>💾 Info:</span> {timeTravel.resources.information}
          </div>
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
            width: '350px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          <ParadoxIndicator
            paradoxes={paradoxLogic.paradoxes}
            unresolvedParadoxes={paradoxLogic.unresolvedParadoxes}
            totalSeverity={paradoxLogic.totalSeverity}
            maxTolerance={paradoxLogic.paradoxTolerance}
            isStable={paradoxLogic.isTimelineStable}
            onResolveParadox={id => paradoxLogic.resolveParadox(id, 'Player resolved')}
          />

          <LoopRecorder
            recordedLoops={timeTravel.recordedLoops}
            currentLoop={timeTravel.currentLoop}
          />

          {/* Objectives */}
          <div
            style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(100, 200, 255, 0.3)',
            }}
          >
            <h4 style={{ marginTop: 0, color: '#64b5f6' }}>Objectives</h4>
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: '12px',
                  marginBottom: '8px',
                  color: obj.completed ? '#4ade80' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {obj.completed ? '✓' : '○'} {obj.text}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Game Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{
              border: '2px solid rgba(100, 200, 255, 0.5)',
              borderRadius: '10px',
              marginBottom: '15px',
            }}
          />

          <Timeline
            currentTime={timeTravel.currentTime}
            maxTime={timeTravel.maxTime}
            recordedLoops={timeTravel.recordedLoops}
            activeEvents={timeTravel.activeEvents}
            onSeek={timeTravel.rewind}
            currentLoop={timeTravel.currentLoop}
          />
        </div>

        {/* Right Panel */}
        <div
          style={{
            width: '400px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
          }}
        >
          <CausalityChain
            causalLinks={paradoxLogic.causalLinks}
            butterflyEffects={paradoxLogic.butterflyEffects}
            actions={[]}
          />

          {/* Active Effects */}
          <div
            style={{
              marginTop: '15px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(150, 100, 255, 0.3)',
            }}
          >
            <h4 style={{ marginTop: 0, color: '#b794f6' }}>Active Events</h4>
            {timeTravel.activeEvents.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                No active events
              </div>
            ) : (
              timeTravel.activeEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    fontSize: '12px',
                    marginBottom: '8px',
                    padding: '8px',
                    background: `${event.visualEffect.color}20`,
                    borderLeft: `3px solid ${event.visualEffect.color}`,
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: event.visualEffect.color }}>
                    {event.name}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                    {event.description}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLoop;
