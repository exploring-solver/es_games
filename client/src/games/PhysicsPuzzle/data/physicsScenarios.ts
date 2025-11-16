export interface PhysicsConcept {
  id: string;
  name: string;
  description: string;
  category: 'gravity' | 'momentum' | 'friction' | 'waves' | 'energy' | 'forces';
  difficulty: number; // 1-5
  educationalContent: {
    concept: string;
    formula?: string;
    realWorldExample: string;
    funFact: string;
  };
}

export const physicsConcepts: PhysicsConcept[] = [
  {
    id: 'gravity-basic',
    name: 'Gravity Basics',
    description: 'Understanding gravitational force and acceleration',
    category: 'gravity',
    difficulty: 1,
    educationalContent: {
      concept: 'All objects fall at the same rate in a vacuum, regardless of mass',
      formula: 'F = mg (where g = 9.8 m/s²)',
      realWorldExample: 'Drop a feather and a hammer on the Moon - they land at the same time!',
      funFact: 'Astronaut David Scott performed this experiment on the Moon during Apollo 15',
    },
  },
  {
    id: 'gravity-projectile',
    name: 'Projectile Motion',
    description: 'Parabolic trajectories and launch angles',
    category: 'gravity',
    difficulty: 2,
    educationalContent: {
      concept: 'Objects follow a parabolic path when launched at an angle',
      formula: 'Range = (v² × sin(2θ)) / g',
      realWorldExample: 'Basketball shots, cannonballs, and water fountains all follow projectile motion',
      funFact: '45 degrees gives you the maximum range for a projectile in a vacuum',
    },
  },
  {
    id: 'momentum-conservation',
    name: 'Conservation of Momentum',
    description: 'Momentum is conserved in collisions',
    category: 'momentum',
    difficulty: 2,
    educationalContent: {
      concept: 'Total momentum before collision equals total momentum after',
      formula: 'm₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'',
      realWorldExample: 'Newton\'s Cradle, billiard balls, and car crashes',
      funFact: 'Rockets work by ejecting mass in one direction to gain momentum in the other',
    },
  },
  {
    id: 'momentum-elastic',
    name: 'Elastic Collisions',
    description: 'Collisions where kinetic energy is conserved',
    category: 'momentum',
    difficulty: 3,
    educationalContent: {
      concept: 'In elastic collisions, both momentum and kinetic energy are conserved',
      formula: 'KE before = KE after',
      realWorldExample: 'Perfectly bouncing balls and atomic particle collisions',
      funFact: 'No real-world collision is perfectly elastic, but some come very close!',
    },
  },
  {
    id: 'friction-static',
    name: 'Static Friction',
    description: 'Force that prevents objects from starting to move',
    category: 'friction',
    difficulty: 2,
    educationalContent: {
      concept: 'Static friction must be overcome before an object starts moving',
      formula: 'f_s ≤ μ_s × N',
      realWorldExample: 'Pushing a heavy box - it\'s hardest to get it moving',
      funFact: 'Static friction is usually stronger than kinetic friction',
    },
  },
  {
    id: 'friction-kinetic',
    name: 'Kinetic Friction',
    description: 'Friction force on moving objects',
    category: 'friction',
    difficulty: 2,
    educationalContent: {
      concept: 'Moving objects experience friction opposing their motion',
      formula: 'f_k = μ_k × N',
      realWorldExample: 'Sliding on ice, car brakes, and sandpaper',
      funFact: 'Ice is slippery because pressure melts a thin layer of water',
    },
  },
  {
    id: 'waves-interference',
    name: 'Wave Interference',
    description: 'Waves add together constructively or destructively',
    category: 'waves',
    difficulty: 3,
    educationalContent: {
      concept: 'When waves meet, their amplitudes add together',
      formula: 'A_total = A₁ + A₂',
      realWorldExample: 'Noise-canceling headphones use destructive interference',
      funFact: 'The iridescent colors on soap bubbles are caused by wave interference',
    },
  },
  {
    id: 'waves-resonance',
    name: 'Resonance',
    description: 'Systems vibrate with maximum amplitude at their natural frequency',
    category: 'waves',
    difficulty: 4,
    educationalContent: {
      concept: 'Objects naturally vibrate at specific frequencies',
      formula: 'f = 1/(2π√(m/k))',
      realWorldExample: 'Pushing a swing at the right time makes it go higher',
      funFact: 'The Tacoma Narrows Bridge collapsed in 1940 due to resonance from wind',
    },
  },
  {
    id: 'energy-potential',
    name: 'Potential Energy',
    description: 'Stored energy due to position',
    category: 'energy',
    difficulty: 2,
    educationalContent: {
      concept: 'Height gives objects gravitational potential energy',
      formula: 'PE = mgh',
      realWorldExample: 'Water towers, roller coasters, and hydroelectric dams',
      funFact: 'A 1kg book 2 meters high has enough energy to light an LED for hours',
    },
  },
  {
    id: 'energy-kinetic',
    name: 'Kinetic Energy',
    description: 'Energy of motion',
    category: 'energy',
    difficulty: 2,
    educationalContent: {
      concept: 'Moving objects have energy proportional to the square of their velocity',
      formula: 'KE = ½mv²',
      realWorldExample: 'Why cars need 4x the stopping distance at 2x speed',
      funFact: 'Doubling speed quadruples kinetic energy!',
    },
  },
  {
    id: 'energy-conservation',
    name: 'Conservation of Energy',
    description: 'Energy transforms but total remains constant',
    category: 'energy',
    difficulty: 3,
    educationalContent: {
      concept: 'Energy cannot be created or destroyed, only transformed',
      formula: 'E_total = PE + KE + Heat + ...',
      realWorldExample: 'Pendulums trade potential for kinetic energy',
      funFact: 'Even "lost" energy to friction becomes heat - it never disappears!',
    },
  },
  {
    id: 'forces-tension',
    name: 'Tension Forces',
    description: 'Forces transmitted through ropes and cables',
    category: 'forces',
    difficulty: 3,
    educationalContent: {
      concept: 'Tension pulls equally in both directions along a rope',
      formula: 'T = mg (for hanging mass)',
      realWorldExample: 'Elevator cables, suspension bridges, and tug-of-war',
      funFact: 'The cables on the Golden Gate Bridge handle 200 million pounds of tension',
    },
  },
  {
    id: 'forces-normal',
    name: 'Normal Force',
    description: 'Support force perpendicular to surfaces',
    category: 'forces',
    difficulty: 2,
    educationalContent: {
      concept: 'Surfaces push back with a normal force',
      formula: 'N = mg cos(θ)',
      realWorldExample: 'Why you feel lighter at the top of a hill while driving',
      funFact: 'You\'re weightless in orbit because there\'s no normal force!',
    },
  },
  {
    id: 'forces-centripetal',
    name: 'Centripetal Force',
    description: 'Force keeping objects in circular motion',
    category: 'forces',
    difficulty: 4,
    educationalContent: {
      concept: 'Circular motion requires a center-pointing force',
      formula: 'F_c = mv²/r',
      realWorldExample: 'Satellites orbiting Earth, cars turning corners',
      funFact: 'Astronauts feel weightless because they\'re in constant freefall around Earth',
    },
  },
  {
    id: 'momentum-impulse',
    name: 'Impulse and Momentum',
    description: 'Force over time changes momentum',
    category: 'momentum',
    difficulty: 3,
    educationalContent: {
      concept: 'Impulse equals the change in momentum',
      formula: 'J = FΔt = Δp',
      realWorldExample: 'Why airbags work - they extend collision time, reducing force',
      funFact: 'Karate experts break boards by delivering a large impulse in a short time',
    },
  },
];

export interface PuzzleObjective {
  type: 'reach' | 'collect' | 'activate' | 'avoid' | 'time' | 'chain';
  description: string;
  target?: string;
  value?: number;
  condition?: (state: any) => boolean;
}

export interface PuzzleHint {
  trigger: 'time' | 'failure' | 'manual';
  delay?: number;
  failureCount?: number;
  text: string;
}

export const puzzleTemplates = [
  {
    id: 'basic-ramp',
    name: 'The First Slope',
    concepts: ['gravity-basic', 'friction-kinetic'],
    difficulty: 1,
    description: 'Learn to use ramps to reach the goal',
    hint: 'Place a ramp to roll the ball to the target',
  },
  {
    id: 'projectile-target',
    name: 'Launch Zone',
    concepts: ['gravity-projectile', 'momentum-conservation'],
    difficulty: 2,
    description: 'Launch objects to hit targets',
    hint: 'Angle matters! Try 45 degrees for maximum distance',
  },
  {
    id: 'momentum-chain',
    name: 'Chain Reaction',
    concepts: ['momentum-conservation', 'momentum-elastic'],
    difficulty: 2,
    description: 'Create a chain of collisions',
    hint: 'Use momentum transfer to move all objects',
  },
  {
    id: 'pendulum-swing',
    name: 'Pendulum Master',
    concepts: ['energy-potential', 'energy-kinetic', 'energy-conservation'],
    difficulty: 3,
    description: 'Use pendulums to transport objects',
    hint: 'Energy converts between potential and kinetic',
  },
  {
    id: 'friction-slide',
    name: 'Ice and Sandpaper',
    concepts: ['friction-static', 'friction-kinetic'],
    difficulty: 2,
    description: 'Navigate different friction surfaces',
    hint: 'Smooth ice has less friction than rough surfaces',
  },
  {
    id: 'lever-system',
    name: 'Leverage',
    concepts: ['forces-normal', 'forces-tension'],
    difficulty: 3,
    description: 'Use levers to lift heavy objects',
    hint: 'Longer lever arm gives more mechanical advantage',
  },
  {
    id: 'circular-motion',
    name: 'Loop-de-Loop',
    concepts: ['forces-centripetal', 'energy-conservation'],
    difficulty: 4,
    description: 'Complete a circular track without falling',
    hint: 'Need enough speed at the bottom to make it around the top',
  },
  {
    id: 'wave-bridge',
    name: 'Resonance Bridge',
    concepts: ['waves-resonance', 'waves-interference'],
    difficulty: 4,
    description: 'Time vibrations to create a path',
    hint: 'Match the natural frequency of the bridge',
  },
];
