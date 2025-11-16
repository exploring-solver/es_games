import { useState, useCallback, useEffect } from 'react';
import { ParticleType, PARTICLES } from '../data/particles';
import { ParticleState, detectCollision } from '../utils/physicsEngine';
import {
  calculateCollisionOutcome,
  createParticlesFromCollision,
  calculateDiscoveryScore,
  DiscoveryStatistics,
  analyzeDiscoveries,
  checkAchievements,
  Achievement,
} from '../utils/particleCalculator';

export interface CollisionEvent {
  id: string;
  timestamp: number;
  particle1: ParticleType;
  particle2: ParticleType;
  products: ParticleType[];
  energy: number;
  position: { x: number; y: number; z: number };
}

export interface Discovery {
  particle: ParticleType;
  timestamp: number;
  energy: number;
  score: number;
  isFirstDiscovery: boolean;
}

export function useCollisions() {
  const [collisionEvents, setCollisionEvents] = useState<CollisionEvent[]>([]);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [discoveredParticles, setDiscoveredParticles] = useState<Set<ParticleType>>(new Set());
  const [totalScore, setTotalScore] = useState(0);
  const [statistics, setStatistics] = useState<DiscoveryStatistics>({
    totalCollisions: 0,
    successfulCollisions: 0,
    particlesCounts: {} as Record<ParticleType, number>,
    averageEnergy: 0,
    rareDiscoveries: [],
    efficiency: 0,
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Process collision between two particles
  const processCollision = useCallback((
    particle1: ParticleState,
    particle2: ParticleState,
    detectorEfficiency: number = 0.7
  ): ParticleState[] => {
    // Calculate collision outcome
    const outcome = calculateCollisionOutcome(particle1, particle2);

    if (!outcome.success || !outcome.outcome) {
      return [];
    }

    // Calculate collision energy
    const energy = particle1.energy + particle2.energy;

    // Create collision event
    const collisionEvent: CollisionEvent = {
      id: `collision-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      particle1: particle1.type,
      particle2: particle2.type,
      products: outcome.products,
      energy,
      position: {
        x: (particle1.position.x + particle2.position.x) / 2,
        y: (particle1.position.y + particle2.position.y) / 2,
        z: (particle1.position.z + particle2.position.z) / 2,
      },
    };

    setCollisionEvents(prev => [...prev, collisionEvent].slice(-100)); // Keep last 100

    // Create product particles
    const products = createParticlesFromCollision(
      outcome.products,
      collisionEvent.position,
      energy
    );

    // Process discoveries
    outcome.products.forEach(productType => {
      // Check if detected (account for detector efficiency)
      if (Math.random() > detectorEfficiency) return;

      const isFirstDiscovery = !discoveredParticles.has(productType);
      const score = calculateDiscoveryScore(productType, energy, detectorEfficiency);

      const discovery: Discovery = {
        particle: productType,
        timestamp: Date.now(),
        energy,
        score: isFirstDiscovery ? score * 2 : score, // Double score for first discovery
        isFirstDiscovery,
      };

      setDiscoveries(prev => [...prev, discovery]);
      setDiscoveredParticles(prev => new Set(prev).add(productType));
      setTotalScore(prev => prev + discovery.score);
    });

    return products;
  }, [discoveredParticles]);

  // Check for collisions in particle list
  const checkCollisions = useCallback((
    particles: ParticleState[],
    detectorEfficiency: number = 0.7
  ): {
    newParticles: ParticleState[];
    collidedParticleIds: string[];
  } => {
    const newParticles: ParticleState[] = [];
    const collidedParticleIds: string[] = [];

    // Check all pairs for collisions
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        if (detectCollision(p1, p2)) {
          // Process collision
          const products = processCollision(p1, p2, detectorEfficiency);
          newParticles.push(...products);

          // Mark particles as collided
          collidedParticleIds.push(p1.id, p2.id);
        }
      }
    }

    return { newParticles, collidedParticleIds };
  }, [processCollision]);

  // Update statistics when discoveries change
  useEffect(() => {
    const stats = analyzeDiscoveries(
      discoveries.map(d => ({
        particle: d.particle,
        energy: d.energy,
        timestamp: d.timestamp,
      }))
    );
    setStatistics(stats);

    // Check for new achievements
    const newAchs = checkAchievements(stats, unlockedAchievements);
    if (newAchs.length > 0) {
      setNewAchievements(newAchs);
      setUnlockedAchievements(prev => [...prev, ...newAchs.map(a => a.id)]);

      // Clear new achievements notification after 5 seconds
      setTimeout(() => {
        setNewAchievements([]);
      }, 5000);
    }
  }, [discoveries, unlockedAchievements]);

  // Reset all collision data
  const reset = useCallback(() => {
    setCollisionEvents([]);
    setDiscoveries([]);
    setDiscoveredParticles(new Set());
    setTotalScore(0);
    setStatistics({
      totalCollisions: 0,
      successfulCollisions: 0,
      particlesCounts: {} as Record<ParticleType, number>,
      averageEnergy: 0,
      rareDiscoveries: [],
      efficiency: 0,
    });
  }, []);

  // Get particle discovery count
  const getDiscoveryCount = useCallback((particle: ParticleType): number => {
    return statistics.particlesCounts[particle] || 0;
  }, [statistics]);

  // Check if particle has been discovered
  const hasDiscovered = useCallback((particle: ParticleType): boolean => {
    return discoveredParticles.has(particle);
  }, [discoveredParticles]);

  // Get recent collisions
  const getRecentCollisions = useCallback((count: number = 10): CollisionEvent[] => {
    return collisionEvents.slice(-count).reverse();
  }, [collisionEvents]);

  // Get recent discoveries
  const getRecentDiscoveries = useCallback((count: number = 10): Discovery[] => {
    return discoveries.slice(-count).reverse();
  }, [discoveries]);

  return {
    // State
    collisionEvents,
    discoveries,
    discoveredParticles: Array.from(discoveredParticles),
    totalScore,
    statistics,
    unlockedAchievements,
    newAchievements,

    // Actions
    processCollision,
    checkCollisions,
    reset,

    // Getters
    getDiscoveryCount,
    hasDiscovered,
    getRecentCollisions,
    getRecentDiscoveries,
  };
}

// Hook for multiplayer collision tracking
export interface PlayerCollisionData {
  playerId: string;
  playerName: string;
  discoveries: Set<ParticleType>;
  score: number;
  collisionCount: number;
}

export function useMultiplayerCollisions(playerId: string, playerName: string) {
  const [players, setPlayers] = useState<Map<string, PlayerCollisionData>>(new Map());
  const [rankings, setRankings] = useState<PlayerCollisionData[]>([]);

  // Initialize current player
  useEffect(() => {
    setPlayers(prev => {
      const newPlayers = new Map(prev);
      if (!newPlayers.has(playerId)) {
        newPlayers.set(playerId, {
          playerId,
          playerName,
          discoveries: new Set(),
          score: 0,
          collisionCount: 0,
        });
      }
      return newPlayers;
    });
  }, [playerId, playerName]);

  // Add discovery for a player
  const addDiscovery = useCallback((
    targetPlayerId: string,
    particle: ParticleType,
    score: number
  ) => {
    setPlayers(prev => {
      const newPlayers = new Map(prev);
      const player = newPlayers.get(targetPlayerId);

      if (player) {
        player.discoveries.add(particle);
        player.score += score;
        player.collisionCount += 1;
        newPlayers.set(targetPlayerId, { ...player });
      }

      return newPlayers;
    });
  }, []);

  // Update rankings
  useEffect(() => {
    const sorted = Array.from(players.values()).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.discoveries.size !== a.discoveries.size) return b.discoveries.size - a.discoveries.size;
      return b.collisionCount - a.collisionCount;
    });
    setRankings(sorted);
  }, [players]);

  // Get player rank
  const getPlayerRank = useCallback((targetPlayerId: string): number => {
    return rankings.findIndex(p => p.playerId === targetPlayerId) + 1;
  }, [rankings]);

  return {
    players: Array.from(players.values()),
    rankings,
    addDiscovery,
    getPlayerRank,
  };
}

// Hook for daily challenge tracking
export interface DailyChallengeProgress {
  challengeId: string;
  targetParticle: ParticleType;
  targetCount: number;
  currentCount: number;
  timeRemaining: number;
  isCompleted: boolean;
  reward: number;
}

export function useDailyChallenge(
  targetParticle: ParticleType,
  targetCount: number,
  timeLimit: number,
  reward: number
) {
  const [progress, setProgress] = useState<DailyChallengeProgress>({
    challengeId: `daily-${Date.now()}`,
    targetParticle,
    targetCount,
    currentCount: 0,
    timeRemaining: timeLimit,
    isCompleted: false,
    reward,
  });
  const [isActive, setIsActive] = useState(false);

  // Start challenge
  const start = useCallback(() => {
    setIsActive(true);
    setProgress(prev => ({
      ...prev,
      currentCount: 0,
      timeRemaining: timeLimit,
      isCompleted: false,
    }));
  }, [timeLimit]);

  // Update timer
  useEffect(() => {
    if (!isActive || progress.isCompleted) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          isCompleted: prev.currentCount >= prev.targetCount || newTimeRemaining === 0,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, progress.isCompleted]);

  // Record discovery
  const recordDiscovery = useCallback((particle: ParticleType) => {
    if (particle === targetParticle && !progress.isCompleted) {
      setProgress(prev => {
        const newCount = prev.currentCount + 1;
        return {
          ...prev,
          currentCount: newCount,
          isCompleted: newCount >= prev.targetCount,
        };
      });
    }
  }, [targetParticle, progress.isCompleted]);

  return {
    progress,
    isActive,
    start,
    recordDiscovery,
  };
}
