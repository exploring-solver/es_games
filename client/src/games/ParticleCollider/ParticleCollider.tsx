import React, { useState, useEffect, useCallback } from 'react';
import { Accelerator } from './components/Accelerator';
import { ParticleDisplay, DetectorRing } from './components/ParticleDisplay';
import { CollisionVisualizer, FeynmanDiagram } from './components/CollisionVisualizer';
import { DiscoveryLog, ParticleGrid } from './components/DiscoveryLog';
import { usePhysicsSimulation, useBeamControl, useDetectorConfig } from './hooks/usePhysicsSimulation';
import { useCollisions, CollisionEvent, useDailyChallenge } from './hooks/useCollisions';
import { ParticleType, LEVELS, PARTICLES, ACCELERATOR_UPGRADES } from './data/particles';
import { generateBeam } from './utils/particleCalculator';
import { generateDailyChallenge } from './data/collisionRules';
import { ACHIEVEMENTS } from './utils/particleCalculator';

type GameState = 'menu' | 'playing' | 'levelComplete' | 'achievements';

export const ParticleCollider: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerName, setPlayerName] = useState('Physicist');
  const [coins, setCoins] = useState(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
  const [selectedCollision, setSelectedCollision] = useState<CollisionEvent | null>(null);
  const [showParticleGrid, setShowParticleGrid] = useState(false);
  const [cameraAngle, setCameraAngle] = useState(0);

  // Current level data
  const levelData = LEVELS[currentLevel];

  // Physics simulation
  const simulation = usePhysicsSimulation({
    magneticFieldStrength: 4,
    timeStep: 0.016,
    maxParticles: 200,
    detectorRadius: 5,
  });

  // Beam control
  const beamControl = useBeamControl();

  // Detector config
  const detectorConfig = useDetectorConfig();

  // Collisions
  const collisions = useCollisions();

  // Daily challenge
  const dailyChallenge = generateDailyChallenge(new Date());
  const challenge = useDailyChallenge(
    dailyChallenge.target.particle,
    dailyChallenge.target.count,
    dailyChallenge.target.timeLimit,
    dailyChallenge.reward
  );

  // Camera rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCameraAngle(prev => prev + 0.01);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Check collisions in simulation
  useEffect(() => {
    if (!simulation.isRunning) return;

    const { newParticles, collidedParticleIds } = collisions.checkCollisions(
      simulation.particles,
      detectorConfig.config.efficiency
    );

    // Remove collided particles
    collidedParticleIds.forEach(id => {
      simulation.removeParticle(id);
    });

    // Add new particles from collisions
    if (newParticles.length > 0) {
      simulation.addParticles(newParticles);
    }
  }, [simulation.particles]);

  // Check level completion
  useEffect(() => {
    if (gameState !== 'playing') return;

    const allTargetsDiscovered = levelData.targetDiscoveries.every(particle =>
      collisions.discoveredParticles.includes(particle)
    );

    if (allTargetsDiscovered) {
      setTimeout(() => {
        setGameState('levelComplete');
        simulation.pause();

        // Award coins
        const levelBonus = (currentLevel + 1) * 100;
        const scoreBonus = Math.floor(collisions.totalScore / 10);
        setCoins(prev => prev + levelBonus + scoreBonus);
      }, 1000);
    }
  }, [collisions.discoveredParticles, gameState, currentLevel, levelData]);

  // Fire beams
  const fireBeams = useCallback(() => {
    beamControl.fireBeam();

    // Generate particle beams
    const beam1Particles = generateBeam(
      beamControl.beam1Particle,
      beamControl.beam1Energy,
      5,
      { x: -3, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 }
    );

    const beam2Particles = generateBeam(
      beamControl.beam2Particle,
      beamControl.beam2Energy,
      5,
      { x: 3, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 }
    );

    simulation.addParticles([...beam1Particles, ...beam2Particles]);

    if (!simulation.isRunning) {
      simulation.start();
    }
  }, [beamControl, simulation]);

  // Start game
  const startGame = useCallback((level: number = 0) => {
    setCurrentLevel(level);
    setGameState('playing');
    simulation.reset();
    collisions.reset();
    beamControl.setBeam1Energy(LEVELS[level].maxEnergy / 2);
    beamControl.setBeam2Energy(LEVELS[level].maxEnergy / 2);
  }, [simulation, collisions, beamControl]);

  // Next level
  const nextLevel = useCallback(() => {
    if (currentLevel < LEVELS.length - 1) {
      startGame(currentLevel + 1);
    } else {
      setGameState('menu');
    }
  }, [currentLevel, startGame]);

  // Purchase upgrade
  const purchaseUpgrade = useCallback((upgradeId: string) => {
    const upgrade = ACCELERATOR_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade || coins < upgrade.cost || purchasedUpgrades.includes(upgradeId)) {
      return;
    }

    setCoins(prev => prev - upgrade.cost);
    setPurchasedUpgrades(prev => [...prev, upgradeId]);

    // Apply upgrade effect
    if (upgrade.effect.type === 'detectionRate') {
      detectorConfig.upgradeEfficiency((upgrade.effect.value - 1) * 0.1);
    } else if (upgrade.effect.type === 'maxEnergy') {
      // Applied through level maxEnergy multiplier
    }
  }, [coins, purchasedUpgrades, detectorConfig]);

  // Render menu
  if (gameState === 'menu') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'monospace',
          overflow: 'auto',
        }}
      >
        <h1
          style={{
            fontSize: '56px',
            marginBottom: '10px',
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Particle Collider Challenge
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '40px' }}>
          Discover the building blocks of the universe
        </p>

        {/* Player name */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              border: '2px solid rgba(100, 200, 255, 0.5)',
              borderRadius: '8px',
              textAlign: 'center',
              width: '300px',
            }}
          />
        </div>

        {/* Level selection */}
        <div
          style={{
            maxWidth: '800px',
            maxHeight: '400px',
            overflowY: 'auto',
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Select Level</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '15px',
            }}
          >
            {LEVELS.map((level, index) => (
              <div
                key={level.level}
                onClick={() => startGame(index)}
                style={{
                  padding: '15px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                  border: '2px solid rgba(100, 150, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(100, 150, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(100, 150, 255, 0.6)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(100, 150, 255, 0.3)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '14px', color: '#fbbf24', marginBottom: '5px' }}>
                  Level {level.level}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {level.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  {level.description}
                </div>
                <div style={{ fontSize: '11px', color: '#60a5fa' }}>
                  Max Energy: {level.maxEnergy} GeV
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={() => setGameState('achievements')}
            style={{
              padding: '15px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            Achievements
          </button>
          <button
            onClick={() => challenge.start()}
            style={{
              padding: '15px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            Daily Challenge
          </button>
        </div>

        <div style={{ marginTop: '20px', fontSize: '18px', color: '#fbbf24' }}>
          Coins: {coins.toLocaleString()}
        </div>
      </div>
    );
  }

  // Render achievements
  if (gameState === 'achievements') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%)',
          color: '#fff',
          fontFamily: 'monospace',
          padding: '40px',
          overflow: 'auto',
        }}
      >
        <button
          onClick={() => setGameState('menu')}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            background: 'rgba(100, 100, 100, 0.5)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Back to Menu
        </button>

        <h1
          style={{
            fontSize: '48px',
            marginBottom: '40px',
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Achievements
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = collisions.unlockedAchievements.includes(achievement.id);

            return (
              <div
                key={achievement.id}
                style={{
                  padding: '20px',
                  background: unlocked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '12px',
                  border: unlocked
                    ? '2px solid rgba(34, 197, 94, 0.5)'
                    : '2px solid rgba(100, 100, 100, 0.3)',
                  opacity: unlocked ? 1 : 0.6,
                }}
              >
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>
                  {achievement.icon}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
                  {achievement.name}
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
                  {achievement.description}
                </div>
                {unlocked && (
                  <div
                    style={{
                      marginTop: '10px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#22c55e',
                      fontWeight: 'bold',
                    }}
                  >
                    UNLOCKED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render level complete
  if (gameState === 'levelComplete') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a2e0a 0%, #1a4e1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        <h1 style={{ fontSize: '64px', marginBottom: '20px', color: '#22c55e' }}>
          Level Complete!
        </h1>
        <p style={{ fontSize: '24px', marginBottom: '20px' }}>
          Score: {collisions.totalScore.toLocaleString()}
        </p>
        <p style={{ fontSize: '18px', marginBottom: '40px', color: '#94a3b8' }}>
          Particles Discovered: {collisions.discoveredParticles.length}
        </p>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={nextLevel}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            {currentLevel < LEVELS.length - 1 ? 'Next Level' : 'Complete!'}
          </button>
          <button
            onClick={() => setGameState('menu')}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'rgba(100, 100, 100, 0.5)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            Main Menu
          </button>
        </div>
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
          padding: '15px 20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderBottom: '2px solid rgba(100, 200, 255, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            {levelData.name} - Level {levelData.level}
          </h2>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            {levelData.scientificContext}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#fbbf24' }}>Score:</span> {collisions.totalScore.toLocaleString()}
          </div>
          <div>
            <span style={{ color: '#60a5fa' }}>Coins:</span> {coins.toLocaleString()}
          </div>
          <div>
            <span style={{ color: '#22c55e' }}>Discovered:</span> {collisions.discoveredParticles.length} / {levelData.targetDiscoveries.length}
          </div>
        </div>

        <button
          onClick={() => setGameState('menu')}
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
          <Accelerator
            beam1Energy={beamControl.beam1Energy}
            beam2Energy={beamControl.beam2Energy}
            beam1Particle={beamControl.beam1Particle}
            beam2Particle={beamControl.beam2Particle}
            maxEnergy={levelData.maxEnergy}
            isActive={beamControl.isBeamActive}
            onBeam1EnergyChange={beamControl.setBeam1Energy}
            onBeam2EnergyChange={beamControl.setBeam2Energy}
            onBeam1ParticleChange={beamControl.setBeam1Particle}
            onBeam2ParticleChange={beamControl.setBeam2Particle}
            onFire={fireBeams}
          />

          <DetectorRing
            radius={5}
            magneticField={detectorConfig.config.magneticField}
            efficiency={detectorConfig.config.efficiency}
          />

          <button
            onClick={() => setShowParticleGrid(!showParticleGrid)}
            style={{
              padding: '10px',
              background: 'rgba(100, 150, 255, 0.2)',
              color: '#fff',
              border: '1px solid rgba(100, 150, 255, 0.5)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {showParticleGrid ? 'Hide' : 'Show'} Particle Collection
          </button>
        </div>

        {/* Center - Simulation Display */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px', gap: '15px' }}>
          <ParticleDisplay
            particles={simulation.particles}
            width={900}
            height={600}
            showTrails={true}
            cameraAngle={cameraAngle}
          />

          {selectedCollision && (
            <FeynmanDiagram collision={selectedCollision} width={900} height={250} />
          )}
        </div>

        {/* Right Panel */}
        <div
          style={{
            width: '400px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          {showParticleGrid ? (
            <ParticleGrid discoveredParticles={collisions.discoveredParticles} />
          ) : (
            <>
              <DiscoveryLog
                discoveries={collisions.discoveries}
                discoveredParticles={collisions.discoveredParticles}
                totalScore={collisions.totalScore}
              />

              <CollisionVisualizer
                recentCollisions={collisions.getRecentCollisions(10)}
                onSelectCollision={setSelectedCollision}
              />
            </>
          )}
        </div>
      </div>

      {/* Achievement notifications */}
      {collisions.newAchievements.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          {collisions.newAchievements.map(achievement => (
            <div
              key={achievement.id}
              style={{
                padding: '15px 20px',
                marginBottom: '10px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '10px',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
                animation: 'slideIn 0.5s ease-out',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>{achievement.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{achievement.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{achievement.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticleCollider;
