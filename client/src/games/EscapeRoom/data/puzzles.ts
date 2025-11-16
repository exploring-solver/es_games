export interface PuzzleData {
  id: string;
  type: 'chemistry' | 'physics' | 'biology' | 'math' | 'logic' | 'pattern' | 'combination';
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  hint1: string;
  hint2: string;
  hint3: string;
  solution: string | string[];
  requiredPlayers?: number;
  timeLimit?: number; // in seconds
  educationalContent: string;
  requiredItems?: string[];
  rewardItems?: string[];
}

export interface PuzzleTemplate {
  type: PuzzleData['type'];
  difficulty: PuzzleData['difficulty'];
  generator: (seed: number) => Partial<PuzzleData>;
}

// Chemistry Puzzles
export const chemistryPuzzles: PuzzleData[] = [
  {
    id: 'chem_001',
    type: 'chemistry',
    difficulty: 'easy',
    title: 'pH Balance',
    description: 'The containment system requires a neutral pH solution. Mix acids and bases to achieve pH 7.',
    hint1: 'Red litmus paper indicates acidic solutions.',
    hint2: 'Blue litmus paper indicates basic solutions.',
    hint3: 'Combine HCl (pH 1) with NaOH (pH 14) in equal parts.',
    solution: 'pH7',
    educationalContent: 'pH is a measure of acidity/alkalinity. pH 7 is neutral, below 7 is acidic, above 7 is basic.',
    requiredItems: ['litmus_paper', 'beaker'],
    rewardItems: ['neutralizer']
  },
  {
    id: 'chem_002',
    type: 'chemistry',
    difficulty: 'medium',
    title: 'Molecular Formula',
    description: 'Identify the compound that neutralizes the toxic gas. Mass: 58g/mol, Contains C, H, O.',
    hint1: 'The molecular weight suggests a small organic molecule.',
    hint2: 'Common organic compounds with oxygen include alcohols and ketones.',
    hint3: 'C3H6O - Acetone or Propanol',
    solution: 'C3H6O',
    educationalContent: 'Molecular formulas show the exact number of atoms of each element in a molecule.',
    requiredItems: ['spectrometer'],
    rewardItems: ['antidote']
  },
  {
    id: 'chem_003',
    type: 'chemistry',
    difficulty: 'hard',
    title: 'Reaction Sequence',
    description: 'Create the antidote by performing reactions in the correct order. You have: NaCl, H2SO4, AgNO3.',
    hint1: 'Silver chloride precipitates when silver nitrate meets chloride ions.',
    hint2: 'First, ensure you have free chloride ions.',
    hint3: 'NaCl + AgNO3 → AgCl↓ + NaNO3',
    solution: ['NaCl', 'AgNO3'],
    requiredPlayers: 2,
    educationalContent: 'Precipitation reactions occur when two solutions combine to form an insoluble solid.',
    requiredItems: ['salt', 'silver_nitrate'],
    rewardItems: ['precipitate_filter']
  }
];

// Physics Puzzles
export const physicsPuzzles: PuzzleData[] = [
  {
    id: 'phys_001',
    type: 'physics',
    difficulty: 'easy',
    title: 'Circuit Breaker',
    description: 'Restore power by calculating the correct resistance. Voltage: 12V, Current needed: 2A.',
    hint1: 'Remember Ohm\'s Law: V = I × R',
    hint2: 'Rearrange to find R: R = V / I',
    hint3: 'R = 12V / 2A = 6Ω',
    solution: '6',
    educationalContent: 'Ohm\'s Law relates voltage, current, and resistance in electrical circuits.',
    requiredItems: ['multimeter'],
    rewardItems: ['power_cell']
  },
  {
    id: 'phys_002',
    type: 'physics',
    difficulty: 'medium',
    title: 'Laser Reflection',
    description: 'Redirect the laser to hit all 4 sensors using mirrors. Each sensor must be activated simultaneously.',
    hint1: 'The angle of incidence equals the angle of reflection.',
    hint2: 'Use beam splitters to create multiple laser paths.',
    hint3: 'Position mirrors at 45° angles to create right-angle reflections.',
    solution: 'MIRROR_CONFIG_A',
    requiredPlayers: 2,
    timeLimit: 180,
    educationalContent: 'Light reflects off surfaces at predictable angles, following the law of reflection.',
    requiredItems: ['mirrors', 'beam_splitter'],
    rewardItems: ['laser_key']
  },
  {
    id: 'phys_003',
    type: 'physics',
    difficulty: 'hard',
    title: 'Pressure Equilibrium',
    description: 'Balance the pressure in three chambers. P1=2atm, P2=?, P3=4atm. Total volume constant at 300L.',
    hint1: 'Use the ideal gas law: PV = nRT',
    hint2: 'At constant temperature, P₁V₁ = P₂V₂',
    hint3: 'If V1=V2=V3=100L, then P2 must equal the average: 3atm',
    solution: '3',
    educationalContent: 'Gas pressure and volume are inversely related at constant temperature (Boyle\'s Law).',
    requiredItems: ['pressure_gauge'],
    rewardItems: ['valve_key']
  }
];

// Biology Puzzles
export const biologyPuzzles: PuzzleData[] = [
  {
    id: 'bio_001',
    type: 'biology',
    difficulty: 'easy',
    title: 'DNA Sequence',
    description: 'Complete the complementary DNA strand: ATGC-TAGC-????',
    hint1: 'DNA base pairing: A pairs with T, G pairs with C.',
    hint2: 'The complement of A-T-G-C is T-A-C-G.',
    hint3: 'For TAGC, the complement is ATCG.',
    solution: 'ATCG',
    educationalContent: 'DNA uses complementary base pairing: Adenine with Thymine, Guanine with Cytosine.',
    requiredItems: ['dna_sample'],
    rewardItems: ['gene_sequence']
  },
  {
    id: 'bio_002',
    type: 'biology',
    difficulty: 'medium',
    title: 'Cell Culture',
    description: 'Grow the antiviral culture. Initial count: 100 cells. Doubling time: 30min. Time passed: 2hrs.',
    hint1: 'Calculate how many doubling periods occurred.',
    hint2: '2 hours = 120 minutes. 120min ÷ 30min = 4 doublings.',
    hint3: '100 × 2⁴ = 100 × 16 = 1,600 cells',
    solution: '1600',
    educationalContent: 'Bacterial and cell growth follows exponential patterns during optimal conditions.',
    requiredItems: ['petri_dish', 'culture_medium'],
    rewardItems: ['antibody_sample']
  },
  {
    id: 'bio_003',
    type: 'biology',
    difficulty: 'hard',
    title: 'Protein Synthesis',
    description: 'Translate the mRNA sequence to amino acids: AUG-GCU-UAC-UGA',
    hint1: 'Use the genetic code. Each codon (3 bases) codes for one amino acid.',
    hint2: 'AUG = Methionine (Start), UGA = Stop codon',
    hint3: 'GCU = Alanine, UAC = Tyrosine. Sequence: Met-Ala-Tyr-Stop',
    solution: 'Met-Ala-Tyr',
    requiredPlayers: 2,
    educationalContent: 'Ribosomes read mRNA in codons (3-base sequences) to synthesize proteins.',
    requiredItems: ['ribosome_model', 'codon_chart'],
    rewardItems: ['protein_key']
  }
];

// Logic and Pattern Puzzles
export const logicPuzzles: PuzzleData[] = [
  {
    id: 'logic_001',
    type: 'logic',
    difficulty: 'easy',
    title: 'Sequence Lock',
    description: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
    hint1: 'Look at the differences between consecutive numbers.',
    hint2: 'Differences: 4, 6, 8, 10... increasing by 2 each time.',
    hint3: 'Next difference should be 12, so 30 + 12 = 42',
    solution: '42',
    educationalContent: 'Number sequences often follow arithmetic or geometric patterns.',
    rewardItems: ['sequence_key']
  },
  {
    id: 'logic_002',
    type: 'pattern',
    difficulty: 'medium',
    title: 'Color Code',
    description: 'The safe displays: RED-3, BLUE-4, GREEN-5, YELLOW-?',
    hint1: 'Count the letters in each color name.',
    hint2: 'RED has 3 letters, BLUE has 4, GREEN has 5...',
    hint3: 'YELLOW has 6 letters.',
    solution: '6',
    timeLimit: 120,
    educationalContent: 'Pattern recognition is crucial in cryptography and code-breaking.',
    rewardItems: ['color_key']
  },
  {
    id: 'logic_003',
    type: 'combination',
    difficulty: 'hard',
    title: 'Element Combination',
    description: 'Combine items to create the master key. Clues: "Metal + Energy + Liquid = Key"',
    hint1: 'Find items that represent each category in the lab.',
    hint2: 'Metal could be iron, energy could be battery, liquid could be water.',
    hint3: 'Combine: Iron Rod + Battery + H2O Sample',
    solution: ['iron_rod', 'battery', 'water_sample'],
    requiredPlayers: 3,
    educationalContent: 'Chemical synthesis often requires multiple reactants in specific combinations.',
    requiredItems: ['iron_rod', 'battery', 'water_sample'],
    rewardItems: ['master_key']
  }
];

// Math Puzzles
export const mathPuzzles: PuzzleData[] = [
  {
    id: 'math_001',
    type: 'math',
    difficulty: 'easy',
    title: 'Safe Combination',
    description: 'Solve for X: 3X + 15 = 48',
    hint1: 'First, subtract 15 from both sides.',
    hint2: '3X = 33',
    hint3: 'X = 11',
    solution: '11',
    educationalContent: 'Linear equations are solved by isolating the variable.',
    rewardItems: ['small_key']
  },
  {
    id: 'math_002',
    type: 'math',
    difficulty: 'medium',
    title: 'Radiation Decay',
    description: 'Half-life of isotope is 8 hours. Starting with 800g, how much remains after 24 hours?',
    hint1: '24 hours ÷ 8 hours = 3 half-lives',
    hint2: 'After each half-life, the amount is halved.',
    hint3: '800 → 400 → 200 → 100 grams',
    solution: '100',
    educationalContent: 'Radioactive decay follows exponential decay patterns based on half-life.',
    requiredItems: ['geiger_counter'],
    rewardItems: ['radiation_shield']
  },
  {
    id: 'math_003',
    type: 'math',
    difficulty: 'hard',
    title: 'Vector Trajectory',
    description: 'Calculate the angle to launch the antidote. Distance: 100m, Initial velocity: 40m/s, g=10m/s²',
    hint1: 'Use the projectile motion formula: R = (v²sin2θ)/g',
    hint2: 'sin2θ = Rg/v² = (100×10)/1600 = 0.625',
    hint3: '2θ = arcsin(0.625) ≈ 38.7°, so θ ≈ 19.4° or use 45° for max range with different v',
    solution: '45',
    requiredPlayers: 2,
    educationalContent: 'Projectile motion combines horizontal and vertical components of velocity.',
    requiredItems: ['launcher', 'calculator'],
    rewardItems: ['antidote_delivered']
  }
];

// Puzzle Templates for Random Generation
export const puzzleTemplates: PuzzleTemplate[] = [
  {
    type: 'chemistry',
    difficulty: 'easy',
    generator: (seed: number) => {
      const elements = ['H', 'O', 'C', 'N', 'S'];
      const el1 = elements[seed % elements.length];
      const el2 = elements[(seed + 1) % elements.length];
      return {
        title: 'Element Identification',
        description: `Identify the element with atomic number ${(seed % 20) + 1}`,
        solution: el1
      };
    }
  },
  {
    type: 'physics',
    difficulty: 'medium',
    generator: (seed: number) => {
      const voltage = (seed % 10) + 5;
      const current = (seed % 5) + 1;
      return {
        title: 'Circuit Calculation',
        description: `Calculate resistance: V=${voltage}V, I=${current}A`,
        solution: String(voltage / current)
      };
    }
  },
  {
    type: 'biology',
    difficulty: 'medium',
    generator: (seed: number) => {
      const bases = ['A', 'T', 'G', 'C'];
      const sequence = Array(4).fill(0).map((_, i) => bases[(seed + i) % 4]).join('');
      const complement = sequence.split('').map(b => {
        if (b === 'A') return 'T';
        if (b === 'T') return 'A';
        if (b === 'G') return 'C';
        return 'G';
      }).join('');
      return {
        title: 'DNA Complement',
        description: `Find complement of: ${sequence}`,
        solution: complement
      };
    }
  }
];

// All puzzles combined
export const allPuzzles: PuzzleData[] = [
  ...chemistryPuzzles,
  ...physicsPuzzles,
  ...biologyPuzzles,
  ...logicPuzzles,
  ...mathPuzzles
];

// Items that can be found/used in the game
export interface ItemData {
  id: string;
  name: string;
  description: string;
  category: 'tool' | 'chemical' | 'equipment' | 'key' | 'sample' | 'consumable';
  canCombine?: boolean;
  combinationResult?: { items: string[], result: string };
}

export const gameItems: ItemData[] = [
  { id: 'litmus_paper', name: 'Litmus Paper', description: 'Tests pH levels', category: 'tool' },
  { id: 'beaker', name: 'Beaker', description: 'Glass container for liquids', category: 'equipment' },
  { id: 'spectrometer', name: 'Spectrometer', description: 'Analyzes molecular composition', category: 'equipment' },
  { id: 'multimeter', name: 'Multimeter', description: 'Measures electrical properties', category: 'tool' },
  { id: 'mirrors', name: 'Mirrors', description: 'Reflects light beams', category: 'equipment' },
  { id: 'beam_splitter', name: 'Beam Splitter', description: 'Divides laser into multiple beams', category: 'equipment' },
  { id: 'pressure_gauge', name: 'Pressure Gauge', description: 'Measures gas pressure', category: 'tool' },
  { id: 'dna_sample', name: 'DNA Sample', description: 'Genetic material for analysis', category: 'sample' },
  { id: 'petri_dish', name: 'Petri Dish', description: 'Container for cell cultures', category: 'equipment' },
  { id: 'culture_medium', name: 'Culture Medium', description: 'Nutrient solution for cells', category: 'consumable' },
  { id: 'ribosome_model', name: 'Ribosome Model', description: 'Educational model of protein synthesis', category: 'equipment' },
  { id: 'codon_chart', name: 'Codon Chart', description: 'Reference for genetic code', category: 'tool' },
  { id: 'geiger_counter', name: 'Geiger Counter', description: 'Detects radiation levels', category: 'equipment' },
  { id: 'calculator', name: 'Scientific Calculator', description: 'Performs complex calculations', category: 'tool' },
  { id: 'launcher', name: 'Projectile Launcher', description: 'Launches objects at angles', category: 'equipment' },
  { id: 'iron_rod', name: 'Iron Rod', description: 'Metal conductor', category: 'chemical', canCombine: true },
  { id: 'battery', name: 'Battery', description: 'Power source', category: 'equipment', canCombine: true },
  { id: 'water_sample', name: 'Water Sample', description: 'H2O in sealed container', category: 'sample', canCombine: true },
  { id: 'salt', name: 'Sodium Chloride', description: 'Common salt (NaCl)', category: 'chemical' },
  { id: 'silver_nitrate', name: 'Silver Nitrate', description: 'AgNO3 solution', category: 'chemical' }
];

export default allPuzzles;
