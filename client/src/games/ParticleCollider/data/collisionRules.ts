import { ParticleType } from './particles';

// Collision outcome
export interface CollisionOutcome {
  products: ParticleType[];
  probability: number; // 0-1
  energyRequired: number; // in GeV
  conservationCheck: {
    charge: number;
    energy: number;
    momentum: number;
  };
}

// Feynman diagram representation
export interface FeynmanDiagram {
  incoming: ParticleType[];
  outgoing: ParticleType[];
  intermediates: ParticleType[];
  vertices: {
    x: number;
    y: number;
    type: 'vertex' | 'propagator';
  }[];
  processName: string;
  order: number; // perturbation order
}

// Define collision rules based on real particle physics
export const COLLISION_RULES: Record<string, CollisionOutcome[]> = {
  // Electron-positron annihilation
  'electron-positron': [
    {
      products: ['photon', 'photon'],
      probability: 0.7,
      energyRequired: 1.022,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['muon', 'muon'],
      probability: 0.2,
      energyRequired: 0.211,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['tau', 'tau'],
      probability: 0.05,
      energyRequired: 3.554,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['upQuark', 'upQuark'],
      probability: 0.03,
      energyRequired: 10,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['zBoson'],
      probability: 0.02,
      energyRequired: 91,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
  ],

  // Proton-proton collisions (like LHC)
  'proton-proton': [
    {
      products: ['proton', 'proton', 'photon'],
      probability: 0.5,
      energyRequired: 0,
      conservationCheck: { charge: 2, energy: 1, momentum: 1 },
    },
    {
      products: ['proton', 'proton', 'gluon'],
      probability: 0.3,
      energyRequired: 10,
      conservationCheck: { charge: 2, energy: 1, momentum: 1 },
    },
    {
      products: ['proton', 'neutron', 'positron', 'neutrino'],
      probability: 0.15,
      energyRequired: 1.293,
      conservationCheck: { charge: 2, energy: 1, momentum: 1 },
    },
    {
      products: ['wBoson', 'wBoson'],
      probability: 0.03,
      energyRequired: 160,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['higgs'],
      probability: 0.01,
      energyRequired: 250,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['topQuark', 'topQuark'],
      probability: 0.008,
      energyRequired: 346,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
  ],

  // Proton-antiproton collisions (like Tevatron)
  'proton-antiproton': [
    {
      products: ['photon', 'photon'],
      probability: 0.4,
      energyRequired: 1876.6,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['wBoson', 'wBoson'],
      probability: 0.25,
      energyRequired: 160,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['zBoson'],
      probability: 0.2,
      energyRequired: 91,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['topQuark', 'topQuark'],
      probability: 0.1,
      energyRequired: 346,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['higgs'],
      probability: 0.05,
      energyRequired: 250,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
  ],

  // Photon-photon collisions
  'photon-photon': [
    {
      products: ['electron', 'positron'],
      probability: 0.9,
      energyRequired: 1.022,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['muon', 'muon'],
      probability: 0.08,
      energyRequired: 0.211,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['tau', 'tau'],
      probability: 0.02,
      energyRequired: 3.554,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
  ],

  // Electron-proton (deep inelastic scattering)
  'electron-proton': [
    {
      products: ['electron', 'proton', 'photon'],
      probability: 0.6,
      energyRequired: 0,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['electron', 'upQuark', 'downQuark', 'downQuark'],
      probability: 0.3,
      energyRequired: 5,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['neutrino', 'neutron'],
      probability: 0.1,
      energyRequired: 1.293,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
  ],

  // Quark interactions
  'upQuark-upQuark': [
    {
      products: ['upQuark', 'upQuark', 'gluon'],
      probability: 0.9,
      energyRequired: 10,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['charmQuark', 'charmQuark'],
      probability: 0.1,
      energyRequired: 30,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
  ],

  'upQuark-downQuark': [
    {
      products: ['upQuark', 'downQuark', 'gluon'],
      probability: 0.8,
      energyRequired: 10,
      conservationCheck: { charge: 1 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['strangeQuark', 'charmQuark'],
      probability: 0.15,
      energyRequired: 30,
      conservationCheck: { charge: 1 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['wBoson'],
      probability: 0.05,
      energyRequired: 80,
      conservationCheck: { charge: 1, energy: 1, momentum: 1 },
    },
  ],

  // Gluon fusion
  'gluon-gluon': [
    {
      products: ['gluon', 'gluon'],
      probability: 0.6,
      energyRequired: 0,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['upQuark', 'upQuark'],
      probability: 0.15,
      energyRequired: 10,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['bottomQuark', 'bottomQuark'],
      probability: 0.1,
      energyRequired: 100,
      conservationCheck: { charge: -2 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['topQuark', 'topQuark'],
      probability: 0.05,
      energyRequired: 346,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
    {
      products: ['higgs'],
      probability: 0.1,
      energyRequired: 125,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
  ],

  // W boson decays
  'wBoson-wBoson': [
    {
      products: ['higgs', 'photon'],
      probability: 0.5,
      energyRequired: 125,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['zBoson', 'photon'],
      probability: 0.3,
      energyRequired: 91,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['electron', 'positron', 'neutrino', 'neutrino'],
      probability: 0.2,
      energyRequired: 1,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
  ],

  // Higgs production
  'topQuark-topQuark': [
    {
      products: ['higgs', 'gluon'],
      probability: 0.4,
      energyRequired: 250,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['wBoson', 'wBoson'],
      probability: 0.3,
      energyRequired: 160,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['zBoson', 'zBoson'],
      probability: 0.2,
      energyRequired: 182,
      conservationCheck: { charge: 0, energy: 1, momentum: 1 },
    },
    {
      products: ['topQuark', 'topQuark', 'gluon'],
      probability: 0.1,
      energyRequired: 350,
      conservationCheck: { charge: 4 / 3, energy: 1, momentum: 1 },
    },
  ],
};

// Generate Feynman diagram for a collision
export function generateFeynmanDiagram(
  particle1: ParticleType,
  particle2: ParticleType,
  products: ParticleType[]
): FeynmanDiagram {
  // Simplified Feynman diagram generation
  const processName = `${particle1} + ${particle2} → ${products.join(' + ')}`;

  // Determine intermediate particles
  const intermediates: ParticleType[] = [];

  // Electron-positron annihilation
  if (
    (particle1 === 'electron' && particle2 === 'positron') ||
    (particle1 === 'positron' && particle2 === 'electron')
  ) {
    if (products.includes('photon')) {
      // Virtual photon intermediate
      intermediates.push('photon');
    } else if (products.includes('zBoson')) {
      intermediates.push('zBoson');
    }
  }

  // Quark interactions
  if (
    particle1.includes('Quark') &&
    particle2.includes('Quark') &&
    products.includes('gluon')
  ) {
    intermediates.push('gluon');
  }

  // Gluon fusion to Higgs
  if (particle1 === 'gluon' && particle2 === 'gluon' && products.includes('higgs')) {
    intermediates.push('topQuark');
  }

  return {
    incoming: [particle1, particle2],
    outgoing: products,
    intermediates,
    vertices: [
      { x: 0.3, y: 0.5, type: 'vertex' },
      { x: 0.7, y: 0.5, type: 'vertex' },
    ],
    processName,
    order: intermediates.length + 1,
  };
}

// Conservation law checker
export interface ConservationLaws {
  chargeConserved: boolean;
  energyConserved: boolean;
  momentumConserved: boolean;
  baryonNumberConserved: boolean;
  leptonNumberConserved: boolean;
}

export function checkConservationLaws(
  incoming: ParticleType[],
  outgoing: ParticleType[],
  particleData: any
): ConservationLaws {
  // Calculate total charge
  const incomingCharge = incoming.reduce((sum, p) => sum + (particleData[p]?.charge || 0), 0);
  const outgoingCharge = outgoing.reduce((sum, p) => sum + (particleData[p]?.charge || 0), 0);

  // Calculate baryon number (quarks = 1/3, baryons = 1, mesons = 0)
  const getBaryonNumber = (p: ParticleType) => {
    if (p === 'proton' || p === 'neutron') return 1;
    if (p === 'antiproton') return -1;
    if (p.includes('Quark')) return 1 / 3;
    return 0;
  };

  const incomingBaryon = incoming.reduce((sum, p) => sum + getBaryonNumber(p), 0);
  const outgoingBaryon = outgoing.reduce((sum, p) => sum + getBaryonNumber(p), 0);

  // Calculate lepton number
  const getLeptonNumber = (p: ParticleType) => {
    if (p === 'electron' || p === 'muon' || p === 'tau' || p === 'neutrino') return 1;
    if (p === 'positron') return -1;
    return 0;
  };

  const incomingLepton = incoming.reduce((sum, p) => sum + getLeptonNumber(p), 0);
  const outgoingLepton = outgoing.reduce((sum, p) => sum + getLeptonNumber(p), 0);

  return {
    chargeConserved: Math.abs(incomingCharge - outgoingCharge) < 0.01,
    energyConserved: true, // Simplified - would need actual energy calculation
    momentumConserved: true, // Simplified - would need vector calculation
    baryonNumberConserved: Math.abs(incomingBaryon - outgoingBaryon) < 0.01,
    leptonNumberConserved: Math.abs(incomingLepton - outgoingLepton) < 0.01,
  };
}

// Calculate cross section (simplified)
export function calculateCrossSection(
  particle1: ParticleType,
  particle2: ParticleType,
  energy: number // in GeV
): number {
  // Simplified cross section calculation
  // Real calculation would use quantum field theory

  const key = [particle1, particle2].sort().join('-');
  const rules = COLLISION_RULES[key];

  if (!rules) return 0;

  // Sum probabilities weighted by energy
  const totalCrossSection = rules.reduce((sum, rule) => {
    if (energy < rule.energyRequired) return sum;

    // Cross section decreases with energy (simplified)
    const energyFactor = rule.energyRequired / (energy + rule.energyRequired);
    return sum + rule.probability * energyFactor;
  }, 0);

  return totalCrossSection;
}

// Daily challenges
export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  target: {
    particle: ParticleType;
    count: number;
    timeLimit: number; // seconds
  };
  reward: number;
}

export function generateDailyChallenge(date: Date): DailyChallenge {
  const challenges: Array<{
    particle: ParticleType;
    title: string;
    description: string;
    count: number;
    time: number;
  }> = [
    {
      particle: 'higgs',
      title: 'Higgs Hunter',
      description: 'Discover the God Particle',
      count: 5,
      time: 300,
    },
    {
      particle: 'topQuark',
      title: 'Top Quark Quest',
      description: 'Find the heaviest quark',
      count: 10,
      time: 240,
    },
    {
      particle: 'wBoson',
      title: 'Weak Force Master',
      description: 'Produce W bosons',
      count: 15,
      time: 180,
    },
    {
      particle: 'gluon',
      title: 'Gluon Gatherer',
      description: 'Collect strong force carriers',
      count: 30,
      time: 200,
    },
    {
      particle: 'muon',
      title: 'Muon Madness',
      description: 'Create unstable muons',
      count: 50,
      time: 150,
    },
  ];

  // Use date to deterministically pick challenge
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const challenge = challenges[dayOfYear % challenges.length];

  return {
    id: `daily-${date.toISOString().split('T')[0]}`,
    date: date.toISOString().split('T')[0],
    title: challenge.title,
    description: challenge.description,
    target: {
      particle: challenge.particle,
      count: challenge.count,
      timeLimit: challenge.time,
    },
    reward: challenge.count * 100,
  };
}
