import { ParticleType, PARTICLES, ParticleData } from '../data/particles';
import { COLLISION_RULES, CollisionOutcome } from '../data/collisionRules';
import { ParticleState, Vector, centerOfMassEnergy } from './physicsEngine';

// Calculate collision outcome based on quantum mechanics
export function calculateCollisionOutcome(
  particle1: ParticleState,
  particle2: ParticleState
): {
  products: ParticleType[];
  outcome: CollisionOutcome | null;
  success: boolean;
} {
  // Get collision energy
  const energy = centerOfMassEnergy(particle1, particle2);

  // Find collision rules
  const key1 = [particle1.type, particle2.type].sort().join('-');
  const key2 = `${particle1.type}-${particle2.type}`;
  const key3 = `${particle2.type}-${particle1.type}`;

  const rules = COLLISION_RULES[key1] || COLLISION_RULES[key2] || COLLISION_RULES[key3];

  if (!rules || rules.length === 0) {
    return { products: [], outcome: null, success: false };
  }

  // Filter rules by energy requirement
  const possibleOutcomes = rules.filter(rule => energy >= rule.energyRequired);

  if (possibleOutcomes.length === 0) {
    return { products: [], outcome: null, success: false };
  }

  // Calculate total probability
  const totalProbability = possibleOutcomes.reduce((sum, rule) => sum + rule.probability, 0);

  // Random selection weighted by probability
  let random = Math.random() * totalProbability;
  let selectedOutcome: CollisionOutcome | null = null;

  for (const outcome of possibleOutcomes) {
    random -= outcome.probability;
    if (random <= 0) {
      selectedOutcome = outcome;
      break;
    }
  }

  if (!selectedOutcome) {
    selectedOutcome = possibleOutcomes[possibleOutcomes.length - 1];
  }

  return {
    products: selectedOutcome.products,
    outcome: selectedOutcome,
    success: true,
  };
}

// Create particle states from collision products
export function createParticlesFromCollision(
  products: ParticleType[],
  collisionPoint: { x: number; y: number; z: number },
  totalEnergy: number
): ParticleState[] {
  const particles: ParticleState[] = [];

  // Distribute energy among products
  const totalMass = products.reduce((sum, type) => sum + PARTICLES[type].mass, 0);

  products.forEach((type, index) => {
    const particleData = PARTICLES[type];

    // Energy distribution (simplified - should use phase space)
    const energyFraction = particleData.mass / totalMass;
    const energy = Math.max(particleData.mass, totalEnergy * energyFraction);

    // Random emission direction
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    const speed = 0.7 + Math.random() * 0.2; // 70-90% speed of light (simplified)
    const velocity = {
      x: speed * Math.sin(phi) * Math.cos(theta),
      y: speed * Math.sin(phi) * Math.sin(theta),
      z: speed * Math.cos(phi),
    };

    particles.push({
      id: `${type}-${Date.now()}-${index}-${Math.random()}`,
      type,
      position: { ...collisionPoint },
      velocity,
      energy,
      lifetime: particleData.lifetime,
      trailPoints: [],
      color: particleData.color,
      charge: particleData.charge,
      mass: particleData.mass,
      createdAt: Date.now(),
    });
  });

  return particles;
}

// Calculate discovery probability
export function calculateDiscoveryProbability(
  particle: ParticleType,
  detectorEfficiency: number,
  energyAvailable: number
): number {
  const particleData = PARTICLES[particle];

  // Check energy threshold
  if (energyAvailable < particleData.energyThreshold) {
    return 0;
  }

  // Base probability from energy
  const energyRatio = energyAvailable / particleData.energyThreshold;
  const energyProb = 1 - Math.exp(-energyRatio + 1);

  // Rarity factor (rarer particles are harder to detect)
  const rarityFactor = 1 / Math.sqrt(particleData.rarity);

  // Detector efficiency
  const detectionProb = detectorEfficiency * energyProb * rarityFactor;

  return Math.min(1, detectionProb);
}

// Score calculation
export function calculateDiscoveryScore(
  particle: ParticleType,
  collisionEnergy: number,
  detectorQuality: number
): number {
  const particleData = PARTICLES[particle];

  // Base score from rarity
  const baseScore = particleData.rarity * 100;

  // Energy bonus (higher energy = harder to achieve)
  const energyBonus = Math.floor(collisionEnergy / 10) * 10;

  // Detector quality bonus
  const detectorBonus = Math.floor(detectorQuality * 50);

  // Historical significance bonus
  const yearBonus = Math.max(0, (particleData.discoveryYear - 1900) / 10);

  return baseScore + energyBonus + detectorBonus + yearBonus;
}

// Generate particle beam
export function generateBeam(
  particleType: ParticleType,
  energy: number,
  count: number,
  startPosition: { x: number; y: number; z: number },
  direction: { x: number; y: number; z: number }
): ParticleState[] {
  const particles: ParticleState[] = [];
  const particleData = PARTICLES[particleType];

  for (let i = 0; i < count; i++) {
    // Add small random variation to position and velocity
    const posVariation = {
      x: (Math.random() - 0.5) * 0.001,
      y: (Math.random() - 0.5) * 0.001,
      z: (Math.random() - 0.5) * 0.001,
    };

    const velVariation = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
    };

    const velocity = Vector.add(Vector.normalize(direction), velVariation);

    particles.push({
      id: `beam-${particleType}-${i}-${Date.now()}`,
      type: particleType,
      position: Vector.add(startPosition, posVariation),
      velocity: Vector.multiply(velocity, 0.99), // 99% speed of light
      energy,
      lifetime: particleData.lifetime,
      trailPoints: [],
      color: particleData.color,
      charge: particleData.charge,
      mass: particleData.mass,
      createdAt: Date.now(),
    });
  }

  return particles;
}

// Particle filter for detector
export interface DetectorFilter {
  chargeMin?: number;
  chargeMax?: number;
  energyMin?: number;
  energyMax?: number;
  types?: ParticleType[];
  categories?: string[];
}

export function applyDetectorFilter(
  particles: ParticleState[],
  filter: DetectorFilter
): ParticleState[] {
  return particles.filter(particle => {
    const data = PARTICLES[particle.type];

    if (filter.chargeMin !== undefined && data.charge < filter.chargeMin) return false;
    if (filter.chargeMax !== undefined && data.charge > filter.chargeMax) return false;
    if (filter.energyMin !== undefined && particle.energy < filter.energyMin) return false;
    if (filter.energyMax !== undefined && particle.energy > filter.energyMax) return false;
    if (filter.types && !filter.types.includes(particle.type)) return false;
    if (filter.categories && !filter.categories.includes(data.category)) return false;

    return true;
  });
}

// Statistical analysis of discoveries
export interface DiscoveryStatistics {
  totalCollisions: number;
  successfulCollisions: number;
  particlesCounts: Record<ParticleType, number>;
  averageEnergy: number;
  rareDiscoveries: ParticleType[];
  efficiency: number;
}

export function analyzeDiscoveries(
  discoveries: Array<{ particle: ParticleType; energy: number; timestamp: number }>
): DiscoveryStatistics {
  const particleCounts: Record<string, number> = {};
  let totalEnergy = 0;

  discoveries.forEach(discovery => {
    particleCounts[discovery.particle] = (particleCounts[discovery.particle] || 0) + 1;
    totalEnergy += discovery.energy;
  });

  // Find rare discoveries (rarity > 7)
  const rareDiscoveries = Object.keys(particleCounts)
    .filter(type => PARTICLES[type as ParticleType]?.rarity > 7)
    .map(type => type as ParticleType);

  const efficiency =
    discoveries.length > 0
      ? Object.keys(particleCounts).length / Object.keys(PARTICLES).length
      : 0;

  return {
    totalCollisions: discoveries.length,
    successfulCollisions: discoveries.length,
    particlesCounts: particleCounts as Record<ParticleType, number>,
    averageEnergy: discoveries.length > 0 ? totalEnergy / discoveries.length : 0,
    rareDiscoveries,
    efficiency,
  };
}

// Multiplayer scoring
export interface PlayerScore {
  playerId: string;
  playerName: string;
  discoveries: Record<ParticleType, number>;
  totalScore: number;
  uniqueDiscoveries: number;
  rareDiscoveries: number;
}

export function calculateMultiplayerRanking(players: PlayerScore[]): PlayerScore[] {
  return players.sort((a, b) => {
    // First compare by total score
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }

    // Then by rare discoveries
    if (b.rareDiscoveries !== a.rareDiscoveries) {
      return b.rareDiscoveries - a.rareDiscoveries;
    }

    // Finally by unique discoveries
    return b.uniqueDiscoveries - a.uniqueDiscoveries;
  });
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (stats: DiscoveryStatistics) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_discovery',
    name: 'First Steps',
    description: 'Make your first particle discovery',
    icon: '🔬',
    requirement: stats => stats.totalCollisions >= 1,
  },
  {
    id: 'antimatter_master',
    name: 'Antimatter Master',
    description: 'Discover both electron and positron',
    icon: '⚛️',
    requirement: stats =>
      (stats.particlesCounts.electron || 0) > 0 && (stats.particlesCounts.positron || 0) > 0,
  },
  {
    id: 'quark_finder',
    name: 'Quark Finder',
    description: 'Discover all six quarks',
    icon: '🎯',
    requirement: stats => {
      const quarks: ParticleType[] = [
        'upQuark',
        'downQuark',
        'charmQuark',
        'strangeQuark',
        'topQuark',
        'bottomQuark',
      ];
      return quarks.every(q => (stats.particlesCounts[q] || 0) > 0);
    },
  },
  {
    id: 'boson_collector',
    name: 'Boson Collector',
    description: 'Discover all force carriers',
    icon: '⚡',
    requirement: stats => {
      const bosons: ParticleType[] = ['photon', 'gluon', 'wBoson', 'zBoson', 'higgs'];
      return bosons.every(b => (stats.particlesCounts[b] || 0) > 0);
    },
  },
  {
    id: 'god_particle',
    name: 'God Particle',
    description: 'Discover the Higgs boson',
    icon: '✨',
    requirement: stats => (stats.particlesCounts.higgs || 0) > 0,
  },
  {
    id: 'top_hunter',
    name: 'Top Hunter',
    description: 'Discover the top quark',
    icon: '👑',
    requirement: stats => (stats.particlesCounts.topQuark || 0) > 0,
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Perform 100 successful collisions',
    icon: '💯',
    requirement: stats => stats.successfulCollisions >= 100,
  },
  {
    id: 'high_energy',
    name: 'High Energy Physicist',
    description: 'Achieve average collision energy over 500 GeV',
    icon: '⚡',
    requirement: stats => stats.averageEnergy >= 500,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Discover all particles',
    icon: '🏆',
    requirement: stats => stats.efficiency >= 0.99,
  },
  {
    id: 'rare_collector',
    name: 'Rare Collector',
    description: 'Discover 5 or more rare particles (rarity > 7)',
    icon: '💎',
    requirement: stats => stats.rareDiscoveries.length >= 5,
  },
];

// Check which achievements are unlocked
export function checkAchievements(
  stats: DiscoveryStatistics,
  unlockedAchievements: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    achievement =>
      !unlockedAchievements.includes(achievement.id) && achievement.requirement(stats)
  );
}

// Luminosity calculation (collision rate)
export function calculateLuminosity(
  beamEnergy: number,
  beamSize: number,
  particlesPerBunch: number,
  bunchFrequency: number
): number {
  // Simplified luminosity calculation
  // L = f × N² / (4π σ²)
  // where f is frequency, N is particles per bunch, σ is beam size

  const sigma = beamSize * 1e-6; // Convert to meters
  const luminosity =
    (bunchFrequency * particlesPerBunch * particlesPerBunch) / (4 * Math.PI * sigma * sigma);

  return luminosity; // in cm⁻²s⁻¹
}

// Estimate collision time for rare particle
export function estimateCollisionTime(
  targetParticle: ParticleType,
  luminosity: number,
  crossSection: number
): number {
  const particleData = PARTICLES[targetParticle];

  // Event rate = L × σ
  const eventRate = luminosity * crossSection;

  // Account for rarity
  const productionRate = eventRate / Math.pow(particleData.rarity, 2);

  // Expected time to first event (exponential distribution)
  return 1 / productionRate; // in seconds
}
