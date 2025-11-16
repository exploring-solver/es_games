// Organism templates and level definitions
import { Nucleotide, Trait, Gene } from './genes';

export interface Organism {
  id: string;
  name: string;
  species: string;
  genome: Nucleotide[]; // Full DNA sequence
  genes: Gene[];
  traits: string[]; // Trait IDs
  fitness: number; // 0-100
  generation: number;
  parentIds?: string[];
}

export interface LevelObjective {
  level: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetTraits: string[]; // Required trait IDs
  optionalTraits?: string[]; // Bonus trait IDs
  starterOrganism: Partial<Organism>;
  restrictions?: {
    maxMutations?: number;
    maxGenerations?: number;
    forbiddenOperations?: string[];
  };
  rewards: {
    stars: number;
    unlocks?: string[];
  };
  hints: string[];
}

// Starter organisms for different levels
export const STARTER_ORGANISMS: Record<string, Partial<Organism>> = {
  basic: {
    name: 'Basic Cell',
    species: 'Simplicellus',
    genome: [
      'A', 'T', 'G', 'A', 'T', 'G', 'G', 'C', 'T', 'A', 'G', 'C',
      'A', 'T', 'G', 'C', 'C', 'G', 'T', 'A', 'G', 'G', 'C', 'A',
    ],
    traits: [],
    fitness: 50,
    generation: 0,
  },
  intermediate: {
    name: 'Evolved Cell',
    species: 'Mediocellus',
    genome: [
      'A', 'T', 'G', 'G', 'C', 'T', 'G', 'G', 'C', 'A', 'T', 'G',
      'C', 'C', 'G', 'A', 'T', 'G', 'T', 'A', 'C', 'G', 'G', 'A',
      'A', 'T', 'G', 'C', 'T', 'G', 'A', 'A', 'T', 'A', 'A',
    ],
    traits: [],
    fitness: 60,
    generation: 0,
  },
  advanced: {
    name: 'Complex Cell',
    species: 'Complexcellus',
    genome: [
      'A', 'T', 'G', 'G', 'C', 'T', 'G', 'G', 'C', 'G', 'G', 'T',
      'A', 'T', 'C', 'T', 'G', 'C', 'A', 'T', 'G', 'G', 'T', 'G',
      'C', 'G', 'T', 'T', 'T', 'T', 'A', 'C', 'T', 'A', 'C', 'T',
      'A', 'T', 'G', 'A', 'A', 'A', 'T', 'G', 'C', 'C', 'G', 'A',
    ],
    traits: [],
    fitness: 70,
    generation: 0,
  },
};

// 20 Level Progression
export const LEVELS: LevelObjective[] = [
  // Beginner levels (1-5)
  {
    level: 1,
    name: 'First Mutation',
    description: 'Learn the basics of gene editing. Create a blue organism.',
    difficulty: 'easy',
    targetTraits: ['blue_pigment'],
    starterOrganism: STARTER_ORGANISMS.basic,
    restrictions: {
      maxMutations: 5,
    },
    rewards: {
      stars: 3,
      unlocks: ['substitution_tool'],
    },
    hints: [
      'DNA codes for proteins through codons (3 nucleotides)',
      'Look for the ATG start codon to begin a gene',
      'Blue pigment needs: Met-Ala-Gly-Ile-Cys amino acids',
    ],
  },
  {
    level: 2,
    name: 'Color Theory',
    description: 'Mix genes to create a red organism.',
    difficulty: 'easy',
    targetTraits: ['red_pigment'],
    starterOrganism: STARTER_ORGANISMS.basic,
    restrictions: {
      maxMutations: 8,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Red pigment requires: Met-Val-Arg-Phe-Tyr',
      'Check the genetic code table for codon-amino acid mappings',
      'Remember to include a stop codon at the end',
    ],
  },
  {
    level: 3,
    name: 'Pattern Recognition',
    description: 'Create an organism with stripes.',
    difficulty: 'easy',
    targetTraits: ['stripes'],
    optionalTraits: ['blue_pigment', 'red_pigment'],
    starterOrganism: STARTER_ORGANISMS.basic,
    rewards: {
      stars: 3,
      unlocks: ['insertion_tool'],
    },
    hints: [
      'Stripes need: Met-Pro-His-Gln-Asn',
      'Bonus stars for adding color traits!',
    ],
  },
  {
    level: 4,
    name: 'Size Matters',
    description: 'Engineer a large organism with spots.',
    difficulty: 'medium',
    targetTraits: ['large_size', 'spots'],
    starterOrganism: STARTER_ORGANISMS.intermediate,
    restrictions: {
      maxMutations: 12,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Gigantism: Met-Leu-Leu-Val-Ile-Pro',
      'Spots: Met-Asp-Glu-Lys-Arg',
      'You need TWO complete genes!',
    ],
  },
  {
    level: 5,
    name: 'Living Light',
    description: 'Create a bioluminescent organism.',
    difficulty: 'medium',
    targetTraits: ['bioluminescence'],
    optionalTraits: ['blue_pigment', 'green_pigment'],
    starterOrganism: STARTER_ORGANISMS.intermediate,
    rewards: {
      stars: 3,
      unlocks: ['deletion_tool'],
    },
    hints: [
      'Bioluminescence: Met-Lys-Phe-Tyr-Trp-Cys',
      'This is a longer protein - plan carefully!',
    ],
  },

  // Intermediate levels (6-10)
  {
    level: 6,
    name: 'Photosynthetic Life',
    description: 'Engineer a photosynthetic organism with green pigmentation.',
    difficulty: 'medium',
    targetTraits: ['photosynthesis', 'green_pigment'],
    starterOrganism: STARTER_ORGANISMS.intermediate,
    restrictions: {
      maxMutations: 15,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Photosynthesis: Met-Gly-Gly-Leu-Cys-Tyr-Phe (7 amino acids!)',
      'Green pigment: Met-Gly-Leu-Ser-Ala',
      'Combine genes efficiently',
    ],
  },
  {
    level: 7,
    name: 'Defensive Adaptations',
    description: 'Create an organism with toxin production and thick membrane.',
    difficulty: 'medium',
    targetTraits: ['toxin_production', 'thick_membrane'],
    starterOrganism: STARTER_ORGANISMS.intermediate,
    rewards: {
      stars: 3,
      unlocks: ['duplication_tool'],
    },
    hints: [
      'Toxins: Met-Cys-Cys-Trp-Tyr-His',
      'Thick membrane: Met-Pro-Pro-Val-Ile-Leu',
      'Duplication can help create repeated sequences',
    ],
  },
  {
    level: 8,
    name: 'Metabolic Engineering',
    description: 'Design an organism with rapid and efficient metabolism.',
    difficulty: 'hard',
    targetTraits: ['fast_metabolism', 'efficient_metabolism'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 18,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Fast metabolism: Met-Glu-Asp-Lys-Thr-Ser',
      'Efficient metabolism: Met-Thr-Ser-Ala-Gly-Val',
      'Notice the shared amino acids?',
    ],
  },
  {
    level: 9,
    name: 'Rainbow Creature',
    description: 'Create an organism with red, blue, AND green pigments.',
    difficulty: 'hard',
    targetTraits: ['red_pigment', 'blue_pigment', 'green_pigment'],
    optionalTraits: ['bioluminescence'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    rewards: {
      stars: 3,
    },
    hints: [
      'Three separate genes required!',
      'Optimize your DNA sequence to fit all genes',
      'Consider using CRISPR insertion',
    ],
  },
  {
    level: 10,
    name: 'The Perfect Organism',
    description: 'Combine size, pattern, color, and defense.',
    difficulty: 'hard',
    targetTraits: ['large_size', 'stripes', 'blue_pigment', 'thick_membrane'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 20,
    },
    rewards: {
      stars: 3,
      unlocks: ['inversion_tool', 'crossover_mode'],
    },
    hints: [
      'Four traits = four genes!',
      'Strategic placement is key',
      'Use all tools available',
    ],
  },

  // Advanced levels (11-15)
  {
    level: 11,
    name: 'Miniature Marvels',
    description: 'Create a small bioluminescent organism with rapid reproduction.',
    difficulty: 'hard',
    targetTraits: ['small_size', 'bioluminescence', 'rapid_reproduction'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    rewards: {
      stars: 3,
    },
    hints: [
      'Small size: Met-Ala-Ala-Ser-Thr',
      'Rapid reproduction: Met-Arg-Lys-His-Gln',
      'Bioluminescence is the longest - plan accordingly',
    ],
  },
  {
    level: 12,
    name: 'Social Engineering',
    description: 'Design a social organism with camouflage.',
    difficulty: 'expert',
    targetTraits: ['social_behavior', 'camouflage'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 25,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Social behavior: Met-Asn-Gln-Ser-Thr-Ala',
      'Camouflage (LEGENDARY): Met-Ala-Ser-Thr-Gly-Phe-Tyr',
      'This is extremely challenging!',
    ],
  },
  {
    level: 13,
    name: 'Energy Mastery',
    description: 'Combine photosynthesis with efficient metabolism and green pigment.',
    difficulty: 'expert',
    targetTraits: ['photosynthesis', 'efficient_metabolism', 'green_pigment'],
    optionalTraits: ['bioluminescence'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    rewards: {
      stars: 3,
    },
    hints: [
      'All three traits are metabolic/physical synergies',
      'Look for shared amino acid sequences',
      'Optimize codon usage',
    ],
  },
  {
    level: 14,
    name: 'Spotted Giant',
    description: 'Large organism with spots, red pigment, and rapid reproduction.',
    difficulty: 'expert',
    targetTraits: ['large_size', 'spots', 'red_pigment', 'rapid_reproduction'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 22,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Four complex traits',
      'Use gene duplication wisely',
      'Consider crossover breeding',
    ],
  },
  {
    level: 15,
    name: 'Ultimate Defense',
    description: 'Toxin production, thick membrane, camouflage, and small size.',
    difficulty: 'expert',
    targetTraits: ['toxin_production', 'thick_membrane', 'camouflage', 'small_size'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    rewards: {
      stars: 3,
      unlocks: ['evolution_simulator'],
    },
    hints: [
      'The ultimate defensive organism!',
      'Camouflage is legendary difficulty',
      'Plan every mutation carefully',
    ],
  },

  // Master levels (16-20)
  {
    level: 16,
    name: 'Glowing Rainbow',
    description: 'Bioluminescent organism with all three color pigments.',
    difficulty: 'expert',
    targetTraits: ['bioluminescence', 'red_pigment', 'blue_pigment', 'green_pigment'],
    optionalTraits: ['stripes', 'spots'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    rewards: {
      stars: 3,
    },
    hints: [
      'Four genes, all for visual traits',
      'This will be beautiful!',
      'Pattern traits give bonus points',
    ],
  },
  {
    level: 17,
    name: 'Metabolic Marvel',
    description: 'All three metabolic traits in one organism.',
    difficulty: 'expert',
    targetTraits: ['fast_metabolism', 'efficient_metabolism', 'photosynthesis'],
    optionalTraits: ['green_pigment'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 20,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'The ultimate energy organism',
      'Shared amino acids can help',
      'Very limited mutations!',
    ],
  },
  {
    level: 18,
    name: 'Behavioral Complex',
    description: 'Social behavior, rapid reproduction, large size, and stripes.',
    difficulty: 'expert',
    targetTraits: ['social_behavior', 'rapid_reproduction', 'large_size', 'stripes'],
    starterOrganism: STARTER_ORGANISMS.advanced,
    rewards: {
      stars: 3,
    },
    hints: [
      'A complex social organism',
      'Use crossover breeding',
      'Gene placement matters',
    ],
  },
  {
    level: 19,
    name: 'Five Trait Challenge',
    description: 'Create an organism with five specific traits.',
    difficulty: 'expert',
    targetTraits: [
      'photosynthesis',
      'bioluminescence',
      'green_pigment',
      'social_behavior',
      'efficient_metabolism',
    ],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 30,
    },
    rewards: {
      stars: 3,
    },
    hints: [
      'Five traits is extremely difficult',
      'Use EVERY tool available',
      'Crossover breeding recommended',
      'This may require multiple generations',
    ],
  },
  {
    level: 20,
    name: 'Master Gene Splicer',
    description: 'The ultimate challenge: six traits including legendary camouflage.',
    difficulty: 'expert',
    targetTraits: [
      'camouflage',
      'bioluminescence',
      'toxin_production',
      'photosynthesis',
      'small_size',
      'social_behavior',
    ],
    starterOrganism: STARTER_ORGANISMS.advanced,
    restrictions: {
      maxMutations: 35,
    },
    rewards: {
      stars: 3,
      unlocks: ['sandbox_mode', 'master_certificate'],
    },
    hints: [
      'The ultimate organism',
      'This requires mastery of all mechanics',
      'Use evolution simulation',
      'Multiple generations will be needed',
      'Plan your entire strategy before starting',
    ],
  },
];

// Daily challenge generation
export function generateDailyChallenge(seed: number): LevelObjective {
  // Use seed for reproducible random generation
  const rng = seededRandom(seed);

  const allTraits = [
    'blue_pigment',
    'red_pigment',
    'green_pigment',
    'large_size',
    'small_size',
    'bioluminescence',
    'stripes',
    'spots',
    'fast_metabolism',
    'efficient_metabolism',
    'photosynthesis',
    'toxin_production',
    'thick_membrane',
    'rapid_reproduction',
    'social_behavior',
  ];

  const numTraits = Math.floor(rng() * 3) + 2; // 2-4 traits
  const shuffled = allTraits.sort(() => rng() - 0.5);
  const selectedTraits = shuffled.slice(0, numTraits);

  return {
    level: 99, // Daily challenge marker
    name: 'Daily Challenge',
    description: `Today's challenge: Create an organism with ${numTraits} specific traits!`,
    difficulty: numTraits <= 2 ? 'medium' : numTraits === 3 ? 'hard' : 'expert',
    targetTraits: selectedTraits,
    starterOrganism: STARTER_ORGANISMS.intermediate,
    restrictions: {
      maxMutations: numTraits * 8,
    },
    rewards: {
      stars: numTraits + 1,
    },
    hints: [
      'Daily challenges refresh every 24 hours',
      'Complete quickly for bonus points!',
    ],
  };
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Get today's challenge
export function getTodaysDailyChallenge(): LevelObjective {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return generateDailyChallenge(seed);
}
