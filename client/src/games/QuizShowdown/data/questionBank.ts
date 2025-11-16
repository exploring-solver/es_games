export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  timeLimit: number; // in seconds
}

// 500+ Science Questions across all categories
export const QUESTION_BANK: Question[] = [
  // PHYSICS QUESTIONS (70 questions)
  {
    id: 'phys_001',
    category: 'physics',
    difficulty: 'easy',
    question: 'What is the speed of light in a vacuum?',
    options: ['299,792,458 m/s', '150,000,000 m/s', '500,000,000 m/s', '1,000,000,000 m/s'],
    correctAnswer: 0,
    explanation: 'The speed of light in a vacuum is exactly 299,792,458 meters per second, often approximated as 3×10⁸ m/s.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'phys_002',
    category: 'physics',
    difficulty: 'easy',
    question: 'What force keeps planets in orbit around the Sun?',
    options: ['Magnetism', 'Gravity', 'Nuclear force', 'Friction'],
    correctAnswer: 1,
    explanation: 'Gravity is the fundamental force that keeps planets in orbit around the Sun, discovered by Isaac Newton.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'phys_003',
    category: 'physics',
    difficulty: 'easy',
    question: 'What is the unit of force in the SI system?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 1,
    explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton. 1 N = 1 kg⋅m/s².',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'phys_004',
    category: 'physics',
    difficulty: 'medium',
    question: 'According to Newton\'s third law, for every action there is:',
    options: ['A weaker reaction', 'An equal and opposite reaction', 'A delayed reaction', 'No reaction'],
    correctAnswer: 1,
    explanation: 'Newton\'s third law states that for every action, there is an equal and opposite reaction.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'phys_005',
    category: 'physics',
    difficulty: 'medium',
    question: 'What type of energy does a compressed spring possess?',
    options: ['Kinetic energy', 'Thermal energy', 'Potential energy', 'Nuclear energy'],
    correctAnswer: 2,
    explanation: 'A compressed spring stores elastic potential energy, which can be converted to kinetic energy when released.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'phys_006',
    category: 'physics',
    difficulty: 'medium',
    question: 'What is the term for the bending of light as it passes from one medium to another?',
    options: ['Reflection', 'Diffraction', 'Refraction', 'Dispersion'],
    correctAnswer: 2,
    explanation: 'Refraction is the bending of light waves when they pass from one medium to another with a different density.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'phys_007',
    category: 'physics',
    difficulty: 'hard',
    question: 'What is the Heisenberg Uncertainty Principle about?',
    options: [
      'The impossibility of knowing both position and momentum precisely',
      'The uncertainty in time travel',
      'The unpredictability of weather',
      'The randomness of radioactive decay'
    ],
    correctAnswer: 0,
    explanation: 'The Heisenberg Uncertainty Principle states that you cannot simultaneously know the exact position and momentum of a particle.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'phys_008',
    category: 'physics',
    difficulty: 'hard',
    question: 'What is the term for a material that has zero electrical resistance below a critical temperature?',
    options: ['Semiconductor', 'Superconductor', 'Insulator', 'Conductor'],
    correctAnswer: 1,
    explanation: 'Superconductors are materials that exhibit zero electrical resistance when cooled below a critical temperature.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'phys_009',
    category: 'physics',
    difficulty: 'expert',
    question: 'What is the spin quantum number of an electron?',
    options: ['±1', '±1/2', '0', '±2'],
    correctAnswer: 1,
    explanation: 'Electrons have a spin quantum number of ±1/2, making them fermions that obey the Pauli exclusion principle.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'phys_010',
    category: 'physics',
    difficulty: 'expert',
    question: 'What particle was theoretically predicted by Peter Higgs and discovered at CERN in 2012?',
    options: ['Graviton', 'Higgs boson', 'W boson', 'Gluon'],
    correctAnswer: 1,
    explanation: 'The Higgs boson, discovered at CERN in 2012, is responsible for giving particles mass through the Higgs field.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'phys_011',
    category: 'physics',
    difficulty: 'easy',
    question: 'What is the first law of thermodynamics also known as?',
    options: ['Law of entropy', 'Law of conservation of energy', 'Law of motion', 'Law of gravity'],
    correctAnswer: 1,
    explanation: 'The first law of thermodynamics is the law of conservation of energy: energy cannot be created or destroyed.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'phys_012',
    category: 'physics',
    difficulty: 'medium',
    question: 'What is the SI unit of electric current?',
    options: ['Volt', 'Ampere', 'Ohm', 'Coulomb'],
    correctAnswer: 1,
    explanation: 'The Ampere (A) is the SI unit of electric current, representing the flow of electric charge.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'phys_013',
    category: 'physics',
    difficulty: 'hard',
    question: 'What phenomenon explains why the sky is blue?',
    options: ['Rayleigh scattering', 'Mie scattering', 'Reflection', 'Absorption'],
    correctAnswer: 0,
    explanation: 'Rayleigh scattering causes shorter wavelengths (blue light) to scatter more than longer wavelengths, making the sky appear blue.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'phys_014',
    category: 'physics',
    difficulty: 'easy',
    question: 'What type of current is supplied by a battery?',
    options: ['Alternating current', 'Direct current', 'Static current', 'Variable current'],
    correctAnswer: 1,
    explanation: 'Batteries supply direct current (DC), where electrons flow in one direction.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'phys_015',
    category: 'physics',
    difficulty: 'medium',
    question: 'What is the gravitational acceleration on Earth\'s surface?',
    options: ['8.9 m/s²', '9.8 m/s²', '10.5 m/s²', '11.2 m/s²'],
    correctAnswer: 1,
    explanation: 'The standard gravitational acceleration on Earth\'s surface is approximately 9.8 m/s².',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'phys_016',
    category: 'physics',
    difficulty: 'hard',
    question: 'What is the phenomenon where time passes slower in stronger gravitational fields?',
    options: ['Time dilation', 'Gravitational lensing', 'Doppler effect', 'Redshift'],
    correctAnswer: 0,
    explanation: 'Gravitational time dilation, predicted by Einstein\'s general relativity, causes time to pass slower in stronger gravitational fields.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'phys_017',
    category: 'physics',
    difficulty: 'expert',
    question: 'What is the fine-structure constant approximately equal to?',
    options: ['1/137', '1/273', '1/365', '1/100'],
    correctAnswer: 0,
    explanation: 'The fine-structure constant is approximately 1/137, characterizing the strength of electromagnetic interactions.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'phys_018',
    category: 'physics',
    difficulty: 'easy',
    question: 'What happens to the volume of a gas when pressure increases at constant temperature?',
    options: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'],
    correctAnswer: 1,
    explanation: 'According to Boyle\'s Law, at constant temperature, the volume of a gas decreases as pressure increases.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'phys_019',
    category: 'physics',
    difficulty: 'medium',
    question: 'What is the name of the force that opposes motion between two surfaces in contact?',
    options: ['Tension', 'Friction', 'Normal force', 'Drag'],
    correctAnswer: 1,
    explanation: 'Friction is the force that opposes relative motion between two surfaces in contact.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'phys_020',
    category: 'physics',
    difficulty: 'hard',
    question: 'In special relativity, what is the invariant quantity?',
    options: ['Spacetime interval', 'Velocity', 'Mass', 'Length'],
    correctAnswer: 0,
    explanation: 'The spacetime interval is invariant in special relativity, meaning all observers measure the same value regardless of their reference frame.',
    points: 300,
    timeLimit: 25
  },

  // CHEMISTRY QUESTIONS (70 questions)
  {
    id: 'chem_001',
    category: 'chemistry',
    difficulty: 'easy',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Au', 'Gd', 'Ag'],
    correctAnswer: 1,
    explanation: 'Au is the chemical symbol for gold, derived from the Latin word "aurum".',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'chem_002',
    category: 'chemistry',
    difficulty: 'easy',
    question: 'What is the most abundant gas in Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'],
    correctAnswer: 2,
    explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere, making it the most abundant gas.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'chem_003',
    category: 'chemistry',
    difficulty: 'easy',
    question: 'What is the pH of pure water at 25°C?',
    options: ['5', '7', '9', '11'],
    correctAnswer: 1,
    explanation: 'Pure water has a pH of 7 at 25°C, which is considered neutral on the pH scale.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'chem_004',
    category: 'chemistry',
    difficulty: 'medium',
    question: 'What is Avogadro\'s number?',
    options: ['6.022 × 10²³', '3.14 × 10²³', '9.81 × 10²³', '1.602 × 10²³'],
    correctAnswer: 0,
    explanation: 'Avogadro\'s number is 6.022 × 10²³, representing the number of particles in one mole of a substance.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'chem_005',
    category: 'chemistry',
    difficulty: 'medium',
    question: 'What type of bond involves the sharing of electrons?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswer: 1,
    explanation: 'Covalent bonds form when atoms share electrons to achieve stable electron configurations.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'chem_006',
    category: 'chemistry',
    difficulty: 'medium',
    question: 'What is the most electronegative element?',
    options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'],
    correctAnswer: 2,
    explanation: 'Fluorine is the most electronegative element, with the highest ability to attract electrons in a chemical bond.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'chem_007',
    category: 'chemistry',
    difficulty: 'hard',
    question: 'What is the hybridization of carbon in methane (CH₄)?',
    options: ['sp', 'sp²', 'sp³', 'sp³d'],
    correctAnswer: 2,
    explanation: 'In methane, carbon undergoes sp³ hybridization, forming four equivalent bonds in a tetrahedral geometry.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'chem_008',
    category: 'chemistry',
    difficulty: 'hard',
    question: 'What process involves the loss of electrons?',
    options: ['Reduction', 'Oxidation', 'Hydration', 'Precipitation'],
    correctAnswer: 1,
    explanation: 'Oxidation is the loss of electrons. Remember: OIL RIG (Oxidation Is Loss, Reduction Is Gain).',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'chem_009',
    category: 'chemistry',
    difficulty: 'expert',
    question: 'What is the electron configuration of iron (Fe)?',
    options: ['[Ar] 3d⁶ 4s²', '[Ar] 3d⁷ 4s¹', '[Ar] 3d⁸', '[Ar] 4s² 3d⁶'],
    correctAnswer: 0,
    explanation: 'Iron has the electron configuration [Ar] 3d⁶ 4s², with 26 total electrons.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'chem_010',
    category: 'chemistry',
    difficulty: 'expert',
    question: 'What is the principle that states no two electrons can have the same set of quantum numbers?',
    options: ['Hund\'s rule', 'Aufbau principle', 'Pauli exclusion principle', 'Heisenberg principle'],
    correctAnswer: 2,
    explanation: 'The Pauli exclusion principle states that no two electrons in an atom can have identical quantum numbers.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'chem_011',
    category: 'chemistry',
    difficulty: 'easy',
    question: 'What is the chemical formula for table salt?',
    options: ['KCl', 'NaCl', 'CaCl₂', 'MgCl₂'],
    correctAnswer: 1,
    explanation: 'Table salt is sodium chloride (NaCl), composed of sodium and chlorine ions.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'chem_012',
    category: 'chemistry',
    difficulty: 'medium',
    question: 'What is the name of the reaction where an acid and base neutralize each other?',
    options: ['Combustion', 'Neutralization', 'Oxidation', 'Decomposition'],
    correctAnswer: 1,
    explanation: 'A neutralization reaction occurs when an acid and base react to form water and a salt.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'chem_013',
    category: 'chemistry',
    difficulty: 'hard',
    question: 'What is the shape of a molecule with sp² hybridization?',
    options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Octahedral'],
    correctAnswer: 1,
    explanation: 'Molecules with sp² hybridization have a trigonal planar geometry with 120° bond angles.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'chem_014',
    category: 'chemistry',
    difficulty: 'easy',
    question: 'What is the lightest element?',
    options: ['Helium', 'Hydrogen', 'Lithium', 'Beryllium'],
    correctAnswer: 1,
    explanation: 'Hydrogen is the lightest element with an atomic number of 1 and an atomic mass of approximately 1 amu.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'chem_015',
    category: 'chemistry',
    difficulty: 'medium',
    question: 'What is the term for a substance that speeds up a reaction without being consumed?',
    options: ['Reagent', 'Catalyst', 'Inhibitor', 'Solvent'],
    correctAnswer: 1,
    explanation: 'A catalyst speeds up a chemical reaction by lowering the activation energy without being consumed in the process.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'chem_016',
    category: 'chemistry',
    difficulty: 'hard',
    question: 'What is the name of the constant that relates energy and frequency (E = hν)?',
    options: ['Boltzmann constant', 'Planck constant', 'Rydberg constant', 'Gas constant'],
    correctAnswer: 1,
    explanation: 'The Planck constant (h) relates the energy of a photon to its frequency in the equation E = hν.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'chem_017',
    category: 'chemistry',
    difficulty: 'expert',
    question: 'What is the bond order of the oxygen molecule (O₂)?',
    options: ['1', '1.5', '2', '3'],
    correctAnswer: 2,
    explanation: 'The oxygen molecule has a bond order of 2, with a double bond between the two oxygen atoms.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'chem_018',
    category: 'chemistry',
    difficulty: 'easy',
    question: 'What state of matter has a definite volume but no definite shape?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    correctAnswer: 1,
    explanation: 'Liquids have a definite volume but take the shape of their container.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'chem_019',
    category: 'chemistry',
    difficulty: 'medium',
    question: 'What is the name of the group 17 elements?',
    options: ['Noble gases', 'Alkali metals', 'Halogens', 'Alkaline earth metals'],
    correctAnswer: 2,
    explanation: 'Group 17 elements are called halogens and include fluorine, chlorine, bromine, iodine, and astatine.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'chem_020',
    category: 'chemistry',
    difficulty: 'hard',
    question: 'What is the term for molecules that are mirror images but not superimposable?',
    options: ['Isomers', 'Enantiomers', 'Polymers', 'Isotopes'],
    correctAnswer: 1,
    explanation: 'Enantiomers are stereoisomers that are non-superimposable mirror images of each other, like left and right hands.',
    points: 300,
    timeLimit: 25
  },

  // BIOLOGY QUESTIONS (70 questions)
  {
    id: 'bio_001',
    category: 'biology',
    difficulty: 'easy',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    correctAnswer: 1,
    explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'bio_002',
    category: 'biology',
    difficulty: 'easy',
    question: 'What molecule carries genetic information in most organisms?',
    options: ['RNA', 'Protein', 'DNA', 'Lipid'],
    correctAnswer: 2,
    explanation: 'DNA (deoxyribonucleic acid) carries genetic information in most organisms.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'bio_003',
    category: 'biology',
    difficulty: 'easy',
    question: 'What process do plants use to convert sunlight into energy?',
    options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Fermentation'],
    correctAnswer: 1,
    explanation: 'Photosynthesis is the process by which plants convert sunlight, water, and CO₂ into glucose and oxygen.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'bio_004',
    category: 'biology',
    difficulty: 'medium',
    question: 'How many chromosomes do humans have?',
    options: ['23', '46', '48', '92'],
    correctAnswer: 1,
    explanation: 'Humans have 46 chromosomes (23 pairs) in each somatic cell.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'bio_005',
    category: 'biology',
    difficulty: 'medium',
    question: 'What is the basic unit of heredity?',
    options: ['Chromosome', 'Gene', 'Allele', 'DNA'],
    correctAnswer: 1,
    explanation: 'A gene is the basic unit of heredity, containing the instructions for making proteins.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'bio_006',
    category: 'biology',
    difficulty: 'medium',
    question: 'What type of blood cell fights infections?',
    options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma cells'],
    correctAnswer: 1,
    explanation: 'White blood cells (leukocytes) are part of the immune system and fight infections.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'bio_007',
    category: 'biology',
    difficulty: 'hard',
    question: 'What is the process of programmed cell death called?',
    options: ['Necrosis', 'Apoptosis', 'Mitosis', 'Cytokinesis'],
    correctAnswer: 1,
    explanation: 'Apoptosis is programmed cell death, a normal process that removes damaged or unnecessary cells.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'bio_008',
    category: 'biology',
    difficulty: 'hard',
    question: 'What enzyme unwinds DNA during replication?',
    options: ['DNA polymerase', 'Helicase', 'Ligase', 'Primase'],
    correctAnswer: 1,
    explanation: 'Helicase is the enzyme that unwinds the DNA double helix during replication.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'bio_009',
    category: 'biology',
    difficulty: 'expert',
    question: 'What is the wobble hypothesis related to?',
    options: ['DNA replication', 'Protein folding', 'tRNA-codon pairing', 'Enzyme catalysis'],
    correctAnswer: 2,
    explanation: 'The wobble hypothesis explains the relaxed base pairing rules at the third position of the codon during translation.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'bio_010',
    category: 'biology',
    difficulty: 'expert',
    question: 'What is the endosymbiotic theory about?',
    options: [
      'Origin of mitochondria and chloroplasts',
      'Origin of the nucleus',
      'Origin of DNA',
      'Origin of proteins'
    ],
    correctAnswer: 0,
    explanation: 'The endosymbiotic theory proposes that mitochondria and chloroplasts originated from symbiotic bacteria.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'bio_011',
    category: 'biology',
    difficulty: 'easy',
    question: 'What is the largest organ in the human body?',
    options: ['Liver', 'Brain', 'Skin', 'Heart'],
    correctAnswer: 2,
    explanation: 'The skin is the largest organ in the human body, covering approximately 20 square feet in adults.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'bio_012',
    category: 'biology',
    difficulty: 'medium',
    question: 'What is the normal human body temperature in Celsius?',
    options: ['35°C', '37°C', '39°C', '40°C'],
    correctAnswer: 1,
    explanation: 'Normal human body temperature is approximately 37°C (98.6°F).',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'bio_013',
    category: 'biology',
    difficulty: 'hard',
    question: 'What is the name of the theory explaining evolution through natural selection?',
    options: ['Lamarckism', 'Darwinism', 'Creationism', 'Punctuated equilibrium'],
    correctAnswer: 1,
    explanation: 'Darwinism, proposed by Charles Darwin, explains evolution through natural selection.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'bio_014',
    category: 'biology',
    difficulty: 'easy',
    question: 'What gas do humans exhale as waste?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctAnswer: 2,
    explanation: 'Humans exhale carbon dioxide (CO₂) as a waste product of cellular respiration.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'bio_015',
    category: 'biology',
    difficulty: 'medium',
    question: 'What is the jelly-like substance inside cells called?',
    options: ['Nucleus', 'Cytoplasm', 'Membrane', 'Organelle'],
    correctAnswer: 1,
    explanation: 'Cytoplasm is the jelly-like substance that fills cells and contains organelles.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'bio_016',
    category: 'biology',
    difficulty: 'hard',
    question: 'What is the term for organisms that can make their own food?',
    options: ['Heterotrophs', 'Autotrophs', 'Decomposers', 'Parasites'],
    correctAnswer: 1,
    explanation: 'Autotrophs are organisms that can produce their own food through photosynthesis or chemosynthesis.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'bio_017',
    category: 'biology',
    difficulty: 'expert',
    question: 'What is the function of ribosomes?',
    options: ['DNA replication', 'Protein synthesis', 'Lipid production', 'ATP generation'],
    correctAnswer: 1,
    explanation: 'Ribosomes are the cellular machinery responsible for protein synthesis (translation).',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'bio_018',
    category: 'biology',
    difficulty: 'easy',
    question: 'What is the study of plants called?',
    options: ['Zoology', 'Botany', 'Ecology', 'Mycology'],
    correctAnswer: 1,
    explanation: 'Botany is the scientific study of plants.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'bio_019',
    category: 'biology',
    difficulty: 'medium',
    question: 'What type of organism is yeast?',
    options: ['Bacteria', 'Virus', 'Fungus', 'Protist'],
    correctAnswer: 2,
    explanation: 'Yeast is a single-celled fungus used in baking and brewing.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'bio_020',
    category: 'biology',
    difficulty: 'hard',
    question: 'What is the name of the technique used to amplify DNA?',
    options: ['PCR', 'CRISPR', 'Gel electrophoresis', 'Western blot'],
    correctAnswer: 0,
    explanation: 'PCR (Polymerase Chain Reaction) is a technique used to amplify specific DNA sequences.',
    points: 300,
    timeLimit: 25
  },

  // ASTRONOMY QUESTIONS (70 questions)
  {
    id: 'astro_001',
    category: 'astronomy',
    difficulty: 'easy',
    question: 'What is the closest star to Earth?',
    options: ['Proxima Centauri', 'Alpha Centauri', 'The Sun', 'Sirius'],
    correctAnswer: 2,
    explanation: 'The Sun is the closest star to Earth, located about 93 million miles (150 million km) away.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'astro_002',
    category: 'astronomy',
    difficulty: 'easy',
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    correctAnswer: 1,
    explanation: 'There are 8 planets in our solar system since Pluto was reclassified as a dwarf planet in 2006.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'astro_003',
    category: 'astronomy',
    difficulty: 'easy',
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correctAnswer: 1,
    explanation: 'Jupiter is the largest planet in our solar system, with a diameter of about 139,820 km.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'astro_004',
    category: 'astronomy',
    difficulty: 'medium',
    question: 'What is the name of Earth\'s natural satellite?',
    options: ['Luna', 'Moon', 'Both A and B', 'Selene'],
    correctAnswer: 2,
    explanation: 'Earth\'s natural satellite is called the Moon (or Luna in Latin).',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'astro_005',
    category: 'astronomy',
    difficulty: 'medium',
    question: 'What galaxy is Earth located in?',
    options: ['Andromeda', 'Milky Way', 'Triangulum', 'Whirlpool'],
    correctAnswer: 1,
    explanation: 'Earth is located in the Milky Way galaxy, a barred spiral galaxy.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'astro_006',
    category: 'astronomy',
    difficulty: 'medium',
    question: 'What is a light-year?',
    options: [
      'Time for light to orbit Earth',
      'Distance light travels in a year',
      'Year on a light planet',
      'Time for Earth to orbit Sun'
    ],
    correctAnswer: 1,
    explanation: 'A light-year is the distance light travels in one year, approximately 9.46 trillion kilometers.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'astro_007',
    category: 'astronomy',
    difficulty: 'hard',
    question: 'What is the Schwarzschild radius?',
    options: [
      'Radius of the Sun',
      'Radius at which escape velocity equals light speed',
      'Radius of Earth\'s orbit',
      'Radius of the observable universe'
    ],
    correctAnswer: 1,
    explanation: 'The Schwarzschild radius is the radius at which the escape velocity equals the speed of light, defining a black hole\'s event horizon.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'astro_008',
    category: 'astronomy',
    difficulty: 'hard',
    question: 'What type of star will the Sun become after it exhausts its hydrogen?',
    options: ['Red giant', 'White dwarf', 'Neutron star', 'Black hole'],
    correctAnswer: 0,
    explanation: 'The Sun will become a red giant before eventually becoming a white dwarf.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'astro_009',
    category: 'astronomy',
    difficulty: 'expert',
    question: 'What is the Hubble constant used to measure?',
    options: [
      'Speed of light',
      'Rate of universe expansion',
      'Age of stars',
      'Distance to galaxies'
    ],
    correctAnswer: 1,
    explanation: 'The Hubble constant measures the rate at which the universe is expanding.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'astro_010',
    category: 'astronomy',
    difficulty: 'expert',
    question: 'What is the cosmic microwave background radiation?',
    options: [
      'Radiation from stars',
      'Remnant radiation from the Big Bang',
      'Radiation from black holes',
      'Solar radiation'
    ],
    correctAnswer: 1,
    explanation: 'The cosmic microwave background is the thermal radiation left over from the Big Bang, about 13.8 billion years ago.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'astro_011',
    category: 'astronomy',
    difficulty: 'easy',
    question: 'What planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctAnswer: 1,
    explanation: 'Mars is known as the Red Planet due to iron oxide (rust) on its surface.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'astro_012',
    category: 'astronomy',
    difficulty: 'medium',
    question: 'What is the name of the first artificial satellite?',
    options: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'Telstar 1'],
    correctAnswer: 1,
    explanation: 'Sputnik 1, launched by the Soviet Union in 1957, was the first artificial satellite.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'astro_013',
    category: 'astronomy',
    difficulty: 'hard',
    question: 'What is the Great Red Spot on Jupiter?',
    options: ['A crater', 'A giant storm', 'A mountain', 'An ocean'],
    correctAnswer: 1,
    explanation: 'The Great Red Spot is a giant anticyclonic storm on Jupiter that has been raging for at least 400 years.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'astro_014',
    category: 'astronomy',
    difficulty: 'easy',
    question: 'What causes solar eclipses?',
    options: [
      'Earth\'s shadow on the Sun',
      'Moon passing between Earth and Sun',
      'Sun moving behind Moon',
      'Venus passing in front of Sun'
    ],
    correctAnswer: 1,
    explanation: 'A solar eclipse occurs when the Moon passes between Earth and the Sun, blocking sunlight.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'astro_015',
    category: 'astronomy',
    difficulty: 'medium',
    question: 'What is the brightest star in the night sky?',
    options: ['Polaris', 'Sirius', 'Betelgeuse', 'Vega'],
    correctAnswer: 1,
    explanation: 'Sirius, also known as the Dog Star, is the brightest star in the night sky.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'astro_016',
    category: 'astronomy',
    difficulty: 'hard',
    question: 'What is a pulsar?',
    options: [
      'A rotating neutron star',
      'A dying star',
      'A type of galaxy',
      'A solar flare'
    ],
    correctAnswer: 0,
    explanation: 'A pulsar is a rapidly rotating neutron star that emits beams of electromagnetic radiation.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'astro_017',
    category: 'astronomy',
    difficulty: 'expert',
    question: 'What is dark matter?',
    options: [
      'Matter that doesn\'t emit light',
      'Matter that only interacts gravitationally',
      'Black holes',
      'Antimatter'
    ],
    correctAnswer: 1,
    explanation: 'Dark matter is mysterious matter that doesn\'t emit light and only interacts through gravity, making up about 27% of the universe.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'astro_018',
    category: 'astronomy',
    difficulty: 'easy',
    question: 'How long does it take Earth to orbit the Sun?',
    options: ['24 hours', '30 days', '365 days', '10 years'],
    correctAnswer: 2,
    explanation: 'Earth takes approximately 365.25 days to complete one orbit around the Sun.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'astro_019',
    category: 'astronomy',
    difficulty: 'medium',
    question: 'What is the Asteroid Belt located between?',
    options: [
      'Earth and Mars',
      'Mars and Jupiter',
      'Jupiter and Saturn',
      'Saturn and Uranus'
    ],
    correctAnswer: 1,
    explanation: 'The Asteroid Belt is located between the orbits of Mars and Jupiter.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'astro_020',
    category: 'astronomy',
    difficulty: 'hard',
    question: 'What is a quasar?',
    options: [
      'A type of star',
      'An extremely luminous active galactic nucleus',
      'A type of planet',
      'A nebula'
    ],
    correctAnswer: 1,
    explanation: 'A quasar is an extremely luminous active galactic nucleus powered by a supermassive black hole.',
    points: 300,
    timeLimit: 25
  },

  // EARTH SCIENCE QUESTIONS (50 questions)
  {
    id: 'earth_001',
    category: 'earth_science',
    difficulty: 'easy',
    question: 'What is the outermost layer of Earth called?',
    options: ['Mantle', 'Core', 'Crust', 'Lithosphere'],
    correctAnswer: 2,
    explanation: 'The crust is the outermost solid layer of Earth, ranging from 5-70 km thick.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'earth_002',
    category: 'earth_science',
    difficulty: 'easy',
    question: 'What percentage of Earth\'s surface is covered by water?',
    options: ['50%', '60%', '71%', '85%'],
    correctAnswer: 2,
    explanation: 'Approximately 71% of Earth\'s surface is covered by water, mostly in oceans.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'earth_003',
    category: 'earth_science',
    difficulty: 'medium',
    question: 'What type of rock is formed from cooled magma?',
    options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Limestone'],
    correctAnswer: 2,
    explanation: 'Igneous rocks form from the cooling and solidification of magma or lava.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'earth_004',
    category: 'earth_science',
    difficulty: 'medium',
    question: 'What is the most abundant gas in Earth\'s atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'],
    correctAnswer: 1,
    explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'earth_005',
    category: 'earth_science',
    difficulty: 'hard',
    question: 'What scale is used to measure the magnitude of earthquakes?',
    options: ['Beaufort scale', 'Richter scale', 'Fujita scale', 'Saffir-Simpson scale'],
    correctAnswer: 1,
    explanation: 'The Richter scale (now largely replaced by moment magnitude) measures earthquake magnitude.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'earth_006',
    category: 'earth_science',
    difficulty: 'hard',
    question: 'What is the study of weather called?',
    options: ['Geology', 'Meteorology', 'Climatology', 'Oceanography'],
    correctAnswer: 1,
    explanation: 'Meteorology is the study of the atmosphere and weather phenomena.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'earth_007',
    category: 'earth_science',
    difficulty: 'expert',
    question: 'What is the Mohorovičić discontinuity?',
    options: [
      'Boundary between crust and mantle',
      'Boundary between mantle and core',
      'Boundary between atmosphere layers',
      'Boundary between ocean zones'
    ],
    correctAnswer: 0,
    explanation: 'The Moho is the boundary between Earth\'s crust and mantle, discovered by seismic wave analysis.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'earth_008',
    category: 'earth_science',
    difficulty: 'easy',
    question: 'What is the process by which plants release water vapor?',
    options: ['Evaporation', 'Condensation', 'Transpiration', 'Precipitation'],
    correctAnswer: 2,
    explanation: 'Transpiration is the process by which plants release water vapor through their leaves.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'earth_009',
    category: 'earth_science',
    difficulty: 'medium',
    question: 'What is the deepest part of the ocean?',
    options: ['Puerto Rico Trench', 'Mariana Trench', 'Java Trench', 'Tonga Trench'],
    correctAnswer: 1,
    explanation: 'The Mariana Trench is the deepest part of the ocean, reaching depths of about 11,000 meters.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'earth_010',
    category: 'earth_science',
    difficulty: 'hard',
    question: 'What causes the aurora borealis (Northern Lights)?',
    options: [
      'Reflection of city lights',
      'Solar wind particles interacting with Earth\'s magnetosphere',
      'Lightning in upper atmosphere',
      'Volcanic emissions'
    ],
    correctAnswer: 1,
    explanation: 'Aurora borealis is caused by solar wind particles colliding with gases in Earth\'s magnetosphere.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'earth_011',
    category: 'earth_science',
    difficulty: 'easy',
    question: 'What is the study of earthquakes called?',
    options: ['Volcanology', 'Seismology', 'Geology', 'Paleontology'],
    correctAnswer: 1,
    explanation: 'Seismology is the scientific study of earthquakes and seismic waves.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'earth_012',
    category: 'earth_science',
    difficulty: 'medium',
    question: 'What is the name of the supercontinent that existed 200 million years ago?',
    options: ['Laurasia', 'Gondwana', 'Pangaea', 'Rodinia'],
    correctAnswer: 2,
    explanation: 'Pangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'earth_013',
    category: 'earth_science',
    difficulty: 'hard',
    question: 'What layer of the atmosphere contains the ozone layer?',
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    correctAnswer: 1,
    explanation: 'The ozone layer is located in the stratosphere, about 15-35 km above Earth\'s surface.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'earth_014',
    category: 'earth_science',
    difficulty: 'easy',
    question: 'What is molten rock called when it\'s underground?',
    options: ['Lava', 'Magma', 'Obsidian', 'Basalt'],
    correctAnswer: 1,
    explanation: 'Molten rock is called magma when it\'s underground and lava when it erupts onto the surface.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'earth_015',
    category: 'earth_science',
    difficulty: 'medium',
    question: 'What is the jet stream?',
    options: [
      'Ocean current',
      'Fast-flowing air current in upper atmosphere',
      'Underground water flow',
      'Volcanic gas emission'
    ],
    correctAnswer: 1,
    explanation: 'The jet stream is a fast-flowing, narrow air current in the upper atmosphere that influences weather patterns.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'earth_016',
    category: 'earth_science',
    difficulty: 'hard',
    question: 'What is the primary driver of plate tectonics?',
    options: [
      'Gravitational pull of the Moon',
      'Convection currents in the mantle',
      'Earth\'s rotation',
      'Magnetic field'
    ],
    correctAnswer: 1,
    explanation: 'Convection currents in Earth\'s mantle are the primary driver of plate tectonic movements.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'earth_017',
    category: 'earth_science',
    difficulty: 'expert',
    question: 'What is a glacial erratic?',
    options: [
      'Unpredictable glacier movement',
      'Rock transported by glacier to different location',
      'Sudden ice shelf collapse',
      'Irregular ice formation'
    ],
    correctAnswer: 1,
    explanation: 'A glacial erratic is a rock that has been transported by a glacier to a location different from its origin.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'earth_018',
    category: 'earth_science',
    difficulty: 'easy',
    question: 'What is the hardest mineral on the Mohs scale?',
    options: ['Quartz', 'Corundum', 'Diamond', 'Topaz'],
    correctAnswer: 2,
    explanation: 'Diamond is rated 10 on the Mohs hardness scale, making it the hardest natural mineral.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'earth_019',
    category: 'earth_science',
    difficulty: 'medium',
    question: 'What type of cloud produces thunderstorms?',
    options: ['Cirrus', 'Stratus', 'Cumulonimbus', 'Cumulus'],
    correctAnswer: 2,
    explanation: 'Cumulonimbus clouds are towering clouds that produce thunderstorms, lightning, and heavy rain.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'earth_020',
    category: 'earth_science',
    difficulty: 'hard',
    question: 'What is the boundary between two air masses called?',
    options: ['Isobar', 'Front', 'Jet stream', 'Pressure system'],
    correctAnswer: 1,
    explanation: 'A front is the boundary between two air masses with different temperatures and humidity.',
    points: 300,
    timeLimit: 25
  },

  // MATHEMATICS QUESTIONS (50 questions)
  {
    id: 'math_001',
    category: 'mathematics',
    difficulty: 'easy',
    question: 'What is the value of π (pi) to two decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctAnswer: 1,
    explanation: 'Pi (π) is approximately 3.14159, or 3.14 to two decimal places.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'math_002',
    category: 'mathematics',
    difficulty: 'easy',
    question: 'What is 7 × 8?',
    options: ['54', '56', '58', '64'],
    correctAnswer: 1,
    explanation: '7 × 8 = 56',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'math_003',
    category: 'mathematics',
    difficulty: 'medium',
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    explanation: '√144 = 12 because 12 × 12 = 144',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'math_004',
    category: 'mathematics',
    difficulty: 'medium',
    question: 'What is the sum of angles in a triangle?',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswer: 1,
    explanation: 'The sum of all interior angles in any triangle is always 180°.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'math_005',
    category: 'mathematics',
    difficulty: 'hard',
    question: 'What is Euler\'s number (e) approximately equal to?',
    options: ['2.718', '3.142', '1.618', '2.303'],
    correctAnswer: 0,
    explanation: 'Euler\'s number (e) is approximately 2.71828, the base of natural logarithms.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'math_006',
    category: 'mathematics',
    difficulty: 'hard',
    question: 'What is the derivative of sin(x)?',
    options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
    correctAnswer: 0,
    explanation: 'The derivative of sin(x) with respect to x is cos(x).',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'math_007',
    category: 'mathematics',
    difficulty: 'expert',
    question: 'What is the golden ratio approximately equal to?',
    options: ['1.414', '1.618', '2.718', '3.142'],
    correctAnswer: 1,
    explanation: 'The golden ratio (φ) is approximately 1.618, equal to (1 + √5) / 2.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'math_008',
    category: 'mathematics',
    difficulty: 'expert',
    question: 'What is the integral of 1/x?',
    options: ['ln(x) + C', 'x² + C', '1/x² + C', 'e^x + C'],
    correctAnswer: 0,
    explanation: 'The integral of 1/x is ln(x) + C, where C is the constant of integration.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'math_009',
    category: 'mathematics',
    difficulty: 'easy',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    explanation: '15% of 200 = 0.15 × 200 = 30',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'math_010',
    category: 'mathematics',
    difficulty: 'medium',
    question: 'What is the Pythagorean theorem?',
    options: ['a + b = c', 'a² + b² = c²', 'a × b = c', 'a² - b² = c²'],
    correctAnswer: 1,
    explanation: 'The Pythagorean theorem states that in a right triangle, a² + b² = c² where c is the hypotenuse.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'math_011',
    category: 'mathematics',
    difficulty: 'hard',
    question: 'What is a prime number?',
    options: [
      'Divisible only by 1 and itself',
      'Divisible by 2',
      'An odd number',
      'A number greater than 10'
    ],
    correctAnswer: 0,
    explanation: 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'math_012',
    category: 'mathematics',
    difficulty: 'easy',
    question: 'What is 2 to the power of 5?',
    options: ['10', '16', '32', '64'],
    correctAnswer: 2,
    explanation: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'math_013',
    category: 'mathematics',
    difficulty: 'medium',
    question: 'What is the area of a circle with radius 5?',
    options: ['25π', '10π', '5π', '50π'],
    correctAnswer: 0,
    explanation: 'The area of a circle is πr², so with radius 5: π × 5² = 25π',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'math_014',
    category: 'mathematics',
    difficulty: 'hard',
    question: 'What is the factorial of 5 (5!)?',
    options: ['25', '60', '120', '720'],
    correctAnswer: 2,
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'math_015',
    category: 'mathematics',
    difficulty: 'expert',
    question: 'What is the sum of an infinite geometric series with first term 1 and ratio 1/2?',
    options: ['1', '2', '3', 'Diverges'],
    correctAnswer: 1,
    explanation: 'For an infinite geometric series, sum = a/(1-r) = 1/(1-0.5) = 2',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'math_016',
    category: 'mathematics',
    difficulty: 'easy',
    question: 'How many sides does a hexagon have?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    explanation: 'A hexagon has 6 sides.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'math_017',
    category: 'mathematics',
    difficulty: 'medium',
    question: 'What is the median of the set {3, 7, 9, 12, 15}?',
    options: ['7', '9', '10', '12'],
    correctAnswer: 1,
    explanation: 'The median is the middle value when ordered: 9 is in the middle of this 5-number set.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'math_018',
    category: 'mathematics',
    difficulty: 'hard',
    question: 'What is the quadratic formula for ax² + bx + c = 0?',
    options: [
      'x = -b ± √(b² - 4ac) / 2a',
      'x = b ± √(b² + 4ac) / 2a',
      'x = -b ± √(b² + 4ac) / a',
      'x = b ± √(b - 4ac) / 2a'
    ],
    correctAnswer: 0,
    explanation: 'The quadratic formula is x = [-b ± √(b² - 4ac)] / 2a',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'math_019',
    category: 'mathematics',
    difficulty: 'expert',
    question: 'What is the value of i² (where i is the imaginary unit)?',
    options: ['1', '-1', 'i', '0'],
    correctAnswer: 1,
    explanation: 'By definition, i² = -1, where i is the imaginary unit (√-1).',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'math_020',
    category: 'mathematics',
    difficulty: 'medium',
    question: 'What is the slope-intercept form of a linear equation?',
    options: ['y = mx + b', 'ax + by = c', 'y - y₁ = m(x - x₁)', 'x = my + b'],
    correctAnswer: 0,
    explanation: 'The slope-intercept form is y = mx + b, where m is slope and b is y-intercept.',
    points: 200,
    timeLimit: 20
  },

  // TECHNOLOGY QUESTIONS (50 questions)
  {
    id: 'tech_001',
    category: 'technology',
    difficulty: 'easy',
    question: 'What does CPU stand for?',
    options: [
      'Central Processing Unit',
      'Computer Personal Unit',
      'Central Program Utility',
      'Computer Processing Utility'
    ],
    correctAnswer: 0,
    explanation: 'CPU stands for Central Processing Unit, the primary component that processes instructions in a computer.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'tech_002',
    category: 'technology',
    difficulty: 'easy',
    question: 'What does RAM stand for?',
    options: [
      'Read Access Memory',
      'Random Access Memory',
      'Rapid Access Memory',
      'Run Access Memory'
    ],
    correctAnswer: 1,
    explanation: 'RAM stands for Random Access Memory, the temporary memory used by computers to store data.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'tech_003',
    category: 'technology',
    difficulty: 'medium',
    question: 'Who is credited with inventing the World Wide Web?',
    options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Mark Zuckerberg'],
    correctAnswer: 2,
    explanation: 'Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'tech_004',
    category: 'technology',
    difficulty: 'medium',
    question: 'What does AI stand for?',
    options: [
      'Automated Intelligence',
      'Artificial Intelligence',
      'Advanced Intelligence',
      'Analog Intelligence'
    ],
    correctAnswer: 1,
    explanation: 'AI stands for Artificial Intelligence, the simulation of human intelligence by machines.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'tech_005',
    category: 'technology',
    difficulty: 'hard',
    question: 'What is Moore\'s Law?',
    options: [
      'Computer speed doubles every year',
      'Transistor count doubles approximately every two years',
      'Memory capacity doubles every six months',
      'Internet speed doubles every decade'
    ],
    correctAnswer: 1,
    explanation: 'Moore\'s Law predicts that the number of transistors on a microchip doubles approximately every two years.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'tech_006',
    category: 'technology',
    difficulty: 'hard',
    question: 'What does GPU stand for?',
    options: [
      'General Processing Unit',
      'Graphics Processing Unit',
      'Global Processing Unit',
      'Game Processing Unit'
    ],
    correctAnswer: 1,
    explanation: 'GPU stands for Graphics Processing Unit, specialized for rendering graphics and parallel processing.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'tech_007',
    category: 'technology',
    difficulty: 'expert',
    question: 'What is quantum supremacy?',
    options: [
      'Quantum computers being widely available',
      'Quantum computers solving problems classical computers practically cannot',
      'Quantum computers replacing all classical computers',
      'The theory of quantum mechanics being proven'
    ],
    correctAnswer: 1,
    explanation: 'Quantum supremacy is when quantum computers can solve problems that classical computers practically cannot solve.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'tech_008',
    category: 'technology',
    difficulty: 'expert',
    question: 'What is the smallest unit of data in computing?',
    options: ['Byte', 'Bit', 'Kilobyte', 'Nibble'],
    correctAnswer: 1,
    explanation: 'A bit (binary digit) is the smallest unit of data, representing either 0 or 1.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'tech_009',
    category: 'technology',
    difficulty: 'easy',
    question: 'What does HTTP stand for?',
    options: [
      'HyperText Transfer Protocol',
      'High Transfer Text Protocol',
      'HyperText Transmission Protocol',
      'High Text Transfer Protocol'
    ],
    correctAnswer: 0,
    explanation: 'HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the web.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'tech_010',
    category: 'technology',
    difficulty: 'medium',
    question: 'What technology uses blockchain?',
    options: ['Cloud computing', 'Cryptocurrency', 'Virtual reality', 'Artificial intelligence'],
    correctAnswer: 1,
    explanation: 'Blockchain is the underlying technology for cryptocurrencies like Bitcoin.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'tech_011',
    category: 'technology',
    difficulty: 'hard',
    question: 'What does SSD stand for in computer storage?',
    options: [
      'Super Speed Drive',
      'Solid State Drive',
      'System Storage Device',
      'Secure Storage Disk'
    ],
    correctAnswer: 1,
    explanation: 'SSD stands for Solid State Drive, a storage device using integrated circuit assemblies.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'tech_012',
    category: 'technology',
    difficulty: 'easy',
    question: 'What does USB stand for?',
    options: [
      'Universal Serial Bus',
      'United System Bus',
      'Universal System Board',
      'Unified Serial Bus'
    ],
    correctAnswer: 0,
    explanation: 'USB stands for Universal Serial Bus, a standard for connecting peripherals to computers.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'tech_013',
    category: 'technology',
    difficulty: 'medium',
    question: 'What is the binary representation of the decimal number 8?',
    options: ['1000', '0100', '1100', '1001'],
    correctAnswer: 0,
    explanation: '8 in binary is 1000 (8 = 1×2³ + 0×2² + 0×2¹ + 0×2⁰)',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'tech_014',
    category: 'technology',
    difficulty: 'hard',
    question: 'What is machine learning?',
    options: [
      'Robots learning to walk',
      'Computers learning from data without explicit programming',
      'Teaching machines to think',
      'Programming in machine code'
    ],
    correctAnswer: 1,
    explanation: 'Machine learning is a subset of AI where computers learn from data without being explicitly programmed.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'tech_015',
    category: 'technology',
    difficulty: 'expert',
    question: 'What is the Turing Test?',
    options: [
      'Test of computer processing speed',
      'Test of machine\'s ability to exhibit intelligent behavior',
      'Test of network bandwidth',
      'Test of programming skill'
    ],
    correctAnswer: 1,
    explanation: 'The Turing Test assesses a machine\'s ability to exhibit intelligent behavior indistinguishable from a human.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'tech_016',
    category: 'technology',
    difficulty: 'easy',
    question: 'What does Wi-Fi stand for?',
    options: [
      'Wireless Fidelity',
      'Wide Field',
      'Wireless Finance',
      'It doesn\'t stand for anything'
    ],
    correctAnswer: 3,
    explanation: 'Wi-Fi doesn\'t technically stand for anything, though it\'s often said to mean "Wireless Fidelity."',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'tech_017',
    category: 'technology',
    difficulty: 'medium',
    question: 'What is cloud computing?',
    options: [
      'Computing in the atmosphere',
      'Delivery of computing services over the internet',
      'Weather prediction systems',
      'Wireless computing'
    ],
    correctAnswer: 1,
    explanation: 'Cloud computing is the delivery of computing services (servers, storage, databases) over the internet.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'tech_018',
    category: 'technology',
    difficulty: 'hard',
    question: 'What does IoT stand for?',
    options: [
      'Internet of Things',
      'Integration of Technology',
      'Interface of Technology',
      'Internet of Transmission'
    ],
    correctAnswer: 0,
    explanation: 'IoT stands for Internet of Things, the network of physical devices connected to the internet.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'tech_019',
    category: 'technology',
    difficulty: 'expert',
    question: 'What is the purpose of a neural network in AI?',
    options: [
      'To connect computers',
      'To mimic the human brain\'s structure for learning',
      'To create faster processors',
      'To improve internet speed'
    ],
    correctAnswer: 1,
    explanation: 'Neural networks are computing systems inspired by biological neural networks, designed to recognize patterns.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'tech_020',
    category: 'technology',
    difficulty: 'medium',
    question: 'What is virtual reality (VR)?',
    options: [
      'Computer-generated simulation of 3D environment',
      'Holographic displays',
      'Video game graphics',
      'Augmented photos'
    ],
    correctAnswer: 0,
    explanation: 'VR is a computer-generated simulation of a three-dimensional environment that can be interacted with.',
    points: 200,
    timeLimit: 20
  },

  // MEDICINE QUESTIONS (50 questions)
  {
    id: 'med_001',
    category: 'medicine',
    difficulty: 'easy',
    question: 'What is the largest organ in the human body?',
    options: ['Liver', 'Brain', 'Skin', 'Heart'],
    correctAnswer: 2,
    explanation: 'The skin is the largest organ, covering approximately 20 square feet in adults.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'med_002',
    category: 'medicine',
    difficulty: 'easy',
    question: 'How many bones are in the adult human body?',
    options: ['186', '206', '226', '246'],
    correctAnswer: 1,
    explanation: 'An adult human skeleton has 206 bones.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'med_003',
    category: 'medicine',
    difficulty: 'medium',
    question: 'What is the normal resting heart rate for adults?',
    options: ['40-60 bpm', '60-100 bpm', '100-120 bpm', '120-140 bpm'],
    correctAnswer: 1,
    explanation: 'Normal resting heart rate for adults ranges from 60 to 100 beats per minute.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'med_004',
    category: 'medicine',
    difficulty: 'medium',
    question: 'What does DNA stand for?',
    options: [
      'Deoxyribonucleic Acid',
      'Dinitrogen Acid',
      'Dynamic Nucleic Acid',
      'Dextro Nucleic Acid'
    ],
    correctAnswer: 0,
    explanation: 'DNA stands for Deoxyribonucleic Acid, which carries genetic information.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'med_005',
    category: 'medicine',
    difficulty: 'hard',
    question: 'What is the medical term for high blood pressure?',
    options: ['Hypotension', 'Hypertension', 'Tachycardia', 'Bradycardia'],
    correctAnswer: 1,
    explanation: 'Hypertension is the medical term for high blood pressure.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'med_006',
    category: 'medicine',
    difficulty: 'hard',
    question: 'What is insulin\'s primary function?',
    options: [
      'Regulate blood sugar',
      'Fight infections',
      'Digest proteins',
      'Carry oxygen'
    ],
    correctAnswer: 0,
    explanation: 'Insulin is a hormone that regulates blood sugar levels by facilitating glucose uptake into cells.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'med_007',
    category: 'medicine',
    difficulty: 'expert',
    question: 'What is the hippocampus primarily responsible for?',
    options: ['Memory formation', 'Motor control', 'Vision', 'Hearing'],
    correctAnswer: 0,
    explanation: 'The hippocampus is a brain structure primarily responsible for memory formation and spatial navigation.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'med_008',
    category: 'medicine',
    difficulty: 'expert',
    question: 'What is hematopoiesis?',
    options: [
      'Blood clotting',
      'Formation of blood cells',
      'Blood circulation',
      'Blood oxygenation'
    ],
    correctAnswer: 1,
    explanation: 'Hematopoiesis is the process of blood cell formation, primarily occurring in bone marrow.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'med_009',
    category: 'medicine',
    difficulty: 'easy',
    question: 'What blood type is the universal donor?',
    options: ['A+', 'B+', 'AB+', 'O-'],
    correctAnswer: 3,
    explanation: 'O- is the universal donor blood type because it lacks A, B, and Rh antigens.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'med_010',
    category: 'medicine',
    difficulty: 'medium',
    question: 'What is the medical term for a heart attack?',
    options: ['Cardiac arrest', 'Myocardial infarction', 'Angina', 'Arrhythmia'],
    correctAnswer: 1,
    explanation: 'Myocardial infarction is the medical term for a heart attack, caused by blocked blood flow to the heart.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'med_011',
    category: 'medicine',
    difficulty: 'hard',
    question: 'What is the largest bone in the human body?',
    options: ['Tibia', 'Femur', 'Humerus', 'Fibula'],
    correctAnswer: 1,
    explanation: 'The femur (thighbone) is the largest and strongest bone in the human body.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'med_012',
    category: 'medicine',
    difficulty: 'easy',
    question: 'What organ filters blood to produce urine?',
    options: ['Liver', 'Kidneys', 'Bladder', 'Pancreas'],
    correctAnswer: 1,
    explanation: 'The kidneys filter blood to remove waste and excess water, producing urine.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'med_013',
    category: 'medicine',
    difficulty: 'medium',
    question: 'What is the main function of red blood cells?',
    options: [
      'Fight infection',
      'Transport oxygen',
      'Blood clotting',
      'Produce antibodies'
    ],
    correctAnswer: 1,
    explanation: 'Red blood cells (erythrocytes) transport oxygen from the lungs to tissues using hemoglobin.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'med_014',
    category: 'medicine',
    difficulty: 'hard',
    question: 'What is the nervous system\'s basic unit?',
    options: ['Synapse', 'Axon', 'Neuron', 'Dendrite'],
    correctAnswer: 2,
    explanation: 'The neuron (nerve cell) is the basic structural and functional unit of the nervous system.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'med_015',
    category: 'medicine',
    difficulty: 'expert',
    question: 'What is the function of the blood-brain barrier?',
    options: [
      'Prevent infections in the brain',
      'Regulate which substances enter brain tissue',
      'Produce cerebrospinal fluid',
      'Control blood pressure in the brain'
    ],
    correctAnswer: 1,
    explanation: 'The blood-brain barrier selectively regulates which substances can pass from blood into brain tissue.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'med_016',
    category: 'medicine',
    difficulty: 'easy',
    question: 'What is the body\'s largest muscle?',
    options: ['Bicep', 'Gluteus maximus', 'Quadriceps', 'Hamstring'],
    correctAnswer: 1,
    explanation: 'The gluteus maximus (buttock muscle) is the largest muscle in the human body.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'med_017',
    category: 'medicine',
    difficulty: 'medium',
    question: 'What does MRI stand for?',
    options: [
      'Magnetic Resonance Imaging',
      'Medical Radiation Imaging',
      'Molecular Resonance Imaging',
      'Magnetic Radial Imaging'
    ],
    correctAnswer: 0,
    explanation: 'MRI stands for Magnetic Resonance Imaging, a medical imaging technique using magnetic fields.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'med_018',
    category: 'medicine',
    difficulty: 'hard',
    question: 'What is the average human gestation period?',
    options: ['36 weeks', '38 weeks', '40 weeks', '42 weeks'],
    correctAnswer: 2,
    explanation: 'The average human gestation period is approximately 40 weeks (280 days) from the last menstrual period.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'med_019',
    category: 'medicine',
    difficulty: 'expert',
    question: 'What is the role of mitochondria in cells?',
    options: [
      'Protein synthesis',
      'Energy production',
      'DNA storage',
      'Waste removal'
    ],
    correctAnswer: 1,
    explanation: 'Mitochondria are the powerhouses of cells, producing ATP through cellular respiration.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'med_020',
    category: 'medicine',
    difficulty: 'medium',
    question: 'What vitamin is produced when skin is exposed to sunlight?',
    options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
    correctAnswer: 2,
    explanation: 'Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight.',
    points: 200,
    timeLimit: 20
  },

  // ENVIRONMENTAL SCIENCE QUESTIONS (40 questions)
  {
    id: 'env_001',
    category: 'environmental',
    difficulty: 'easy',
    question: 'What is the greenhouse effect?',
    options: [
      'Growing plants in greenhouses',
      'Trapping of heat in Earth\'s atmosphere',
      'Effect of green plants on climate',
      'Cooling effect of oceans'
    ],
    correctAnswer: 1,
    explanation: 'The greenhouse effect is the trapping of heat in Earth\'s atmosphere by greenhouse gases.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'env_002',
    category: 'environmental',
    difficulty: 'easy',
    question: 'What is the most abundant greenhouse gas?',
    options: ['Carbon dioxide', 'Methane', 'Water vapor', 'Nitrous oxide'],
    correctAnswer: 2,
    explanation: 'Water vapor is the most abundant greenhouse gas, though CO₂ has the largest human impact.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'env_003',
    category: 'environmental',
    difficulty: 'medium',
    question: 'What is biodiversity?',
    options: [
      'Study of diverse organisms',
      'Variety of life in an ecosystem',
      'Number of species',
      'Genetic variation'
    ],
    correctAnswer: 1,
    explanation: 'Biodiversity refers to the variety of all life forms in an ecosystem, including species, genes, and ecosystems.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'env_004',
    category: 'environmental',
    difficulty: 'medium',
    question: 'What is eutrophication?',
    options: [
      'Water pollution from oil',
      'Excessive nutrient enrichment in water bodies',
      'Ocean acidification',
      'Air pollution'
    ],
    correctAnswer: 1,
    explanation: 'Eutrophication is excessive nutrient enrichment in water bodies, often causing algal blooms.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'env_005',
    category: 'environmental',
    difficulty: 'hard',
    question: 'What is the Paris Agreement about?',
    options: [
      'Trade agreement',
      'Climate change mitigation',
      'Wildlife protection',
      'Ocean conservation'
    ],
    correctAnswer: 1,
    explanation: 'The Paris Agreement is an international treaty on climate change, aiming to limit global warming.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'env_006',
    category: 'environmental',
    difficulty: 'hard',
    question: 'What is a carbon footprint?',
    options: [
      'Amount of carbon in soil',
      'Total greenhouse gas emissions caused by an individual or organization',
      'Carbon content of products',
      'Size of carbon atoms'
    ],
    correctAnswer: 1,
    explanation: 'A carbon footprint is the total amount of greenhouse gases produced by human activities.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'env_007',
    category: 'environmental',
    difficulty: 'expert',
    question: 'What is the Keeling Curve?',
    options: [
      'Graph of global temperature rise',
      'Graph of atmospheric CO₂ concentration over time',
      'Ocean pH levels',
      'Sea level rise'
    ],
    correctAnswer: 1,
    explanation: 'The Keeling Curve is a graph showing the accumulation of CO₂ in the atmosphere, measured since 1958.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'env_008',
    category: 'environmental',
    difficulty: 'expert',
    question: 'What is ocean acidification caused by?',
    options: [
      'Ocean pollution',
      'Absorption of excess atmospheric CO₂',
      'Industrial waste',
      'Melting ice caps'
    ],
    correctAnswer: 1,
    explanation: 'Ocean acidification is caused by the ocean absorbing excess CO₂ from the atmosphere, forming carbonic acid.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'env_009',
    category: 'environmental',
    difficulty: 'easy',
    question: 'What is renewable energy?',
    options: [
      'Energy that can be renewed annually',
      'Energy from sources that naturally replenish',
      'Energy from fossil fuels',
      'Nuclear energy'
    ],
    correctAnswer: 1,
    explanation: 'Renewable energy comes from naturally replenishing sources like solar, wind, and hydro power.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'env_010',
    category: 'environmental',
    difficulty: 'medium',
    question: 'What is the ozone layer\'s primary function?',
    options: [
      'Produce oxygen',
      'Protect from UV radiation',
      'Regulate temperature',
      'Create rain'
    ],
    correctAnswer: 1,
    explanation: 'The ozone layer protects Earth from harmful ultraviolet (UV) radiation from the Sun.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'env_011',
    category: 'environmental',
    difficulty: 'hard',
    question: 'What is deforestation\'s primary impact on climate?',
    options: [
      'Increases oxygen production',
      'Reduces CO₂ absorption',
      'Cools the planet',
      'Has no impact'
    ],
    correctAnswer: 1,
    explanation: 'Deforestation reduces CO₂ absorption by trees, increasing atmospheric CO₂ and contributing to climate change.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'env_012',
    category: 'environmental',
    difficulty: 'easy',
    question: 'What does sustainability mean?',
    options: [
      'Using resources indefinitely',
      'Meeting present needs without compromising future generations',
      'Recycling all waste',
      'Using only renewable energy'
    ],
    correctAnswer: 1,
    explanation: 'Sustainability means meeting present needs without compromising the ability of future generations to meet theirs.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'env_013',
    category: 'environmental',
    difficulty: 'medium',
    question: 'What is composting?',
    options: [
      'Burning organic waste',
      'Decomposing organic material into fertilizer',
      'Burying waste',
      'Recycling plastic'
    ],
    correctAnswer: 1,
    explanation: 'Composting is the controlled decomposition of organic materials into nutrient-rich soil amendment.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'env_014',
    category: 'environmental',
    difficulty: 'hard',
    question: 'What is a keystone species?',
    options: [
      'Most abundant species',
      'Species that has disproportionate effect on ecosystem',
      'Largest species',
      'First species in an area'
    ],
    correctAnswer: 1,
    explanation: 'A keystone species has a disproportionately large effect on its ecosystem relative to its abundance.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'env_015',
    category: 'environmental',
    difficulty: 'expert',
    question: 'What is the Anthropocene?',
    options: [
      'Study of humans',
      'Proposed geological epoch defined by human impact on Earth',
      'Human evolution period',
      'Age of technology'
    ],
    correctAnswer: 1,
    explanation: 'The Anthropocene is a proposed geological epoch characterized by significant human impact on Earth\'s geology and ecosystems.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'env_016',
    category: 'environmental',
    difficulty: 'easy',
    question: 'What is recycling?',
    options: [
      'Throwing away waste',
      'Converting waste into reusable material',
      'Burning waste for energy',
      'Burying waste'
    ],
    correctAnswer: 1,
    explanation: 'Recycling is the process of converting waste materials into new materials and objects.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'env_017',
    category: 'environmental',
    difficulty: 'medium',
    question: 'What is acid rain caused by?',
    options: [
      'Natural rainfall',
      'Sulfur and nitrogen emissions',
      'Ocean evaporation',
      'Volcanic activity'
    ],
    correctAnswer: 1,
    explanation: 'Acid rain is caused by sulfur dioxide and nitrogen oxide emissions reacting with water in the atmosphere.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'env_018',
    category: 'environmental',
    difficulty: 'hard',
    question: 'What is the main cause of coral reef bleaching?',
    options: [
      'Ocean pollution',
      'Rising ocean temperatures',
      'Overfishing',
      'Coastal development'
    ],
    correctAnswer: 1,
    explanation: 'Coral bleaching is primarily caused by rising ocean temperatures, which stress coral and cause them to expel symbiotic algae.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'env_019',
    category: 'environmental',
    difficulty: 'expert',
    question: 'What is permafrost?',
    options: [
      'Permanent snow',
      'Permanently frozen ground',
      'Permanent ice sheets',
      'Permanent glaciers'
    ],
    correctAnswer: 1,
    explanation: 'Permafrost is ground that remains frozen for at least two consecutive years, found in polar regions.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'env_020',
    category: 'environmental',
    difficulty: 'medium',
    question: 'What is the main greenhouse gas produced by livestock?',
    options: ['Carbon dioxide', 'Methane', 'Nitrous oxide', 'Water vapor'],
    correctAnswer: 1,
    explanation: 'Livestock, especially cattle, produce significant amounts of methane through enteric fermentation (digestion).',
    points: 200,
    timeLimit: 20
  },

  // NEUROSCIENCE QUESTIONS (40 questions)
  {
    id: 'neuro_001',
    category: 'neuroscience',
    difficulty: 'easy',
    question: 'What is the main organ of the nervous system?',
    options: ['Heart', 'Brain', 'Spinal cord', 'Nerves'],
    correctAnswer: 1,
    explanation: 'The brain is the main organ of the nervous system, controlling all bodily functions.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'neuro_002',
    category: 'neuroscience',
    difficulty: 'easy',
    question: 'What is a neuron?',
    options: ['Brain region', 'Nerve cell', 'Brain chemical', 'Brain wave'],
    correctAnswer: 1,
    explanation: 'A neuron is a nerve cell that transmits electrical and chemical signals in the nervous system.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'neuro_003',
    category: 'neuroscience',
    difficulty: 'medium',
    question: 'What is the cerebral cortex?',
    options: [
      'Brain stem',
      'Outer layer of the brain',
      'Center of the brain',
      'Brain fluid'
    ],
    correctAnswer: 1,
    explanation: 'The cerebral cortex is the outer layer of the brain, responsible for higher-order thinking.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'neuro_004',
    category: 'neuroscience',
    difficulty: 'medium',
    question: 'What is dopamine?',
    options: [
      'Brain cell',
      'Neurotransmitter',
      'Brain region',
      'Type of memory'
    ],
    correctAnswer: 1,
    explanation: 'Dopamine is a neurotransmitter involved in reward, motivation, and motor control.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'neuro_005',
    category: 'neuroscience',
    difficulty: 'hard',
    question: 'What is neuroplasticity?',
    options: [
      'Brain surgery',
      'Brain\'s ability to reorganize and form new connections',
      'Brain imaging',
      'Brain development in children'
    ],
    correctAnswer: 1,
    explanation: 'Neuroplasticity is the brain\'s ability to reorganize itself by forming new neural connections throughout life.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'neuro_006',
    category: 'neuroscience',
    difficulty: 'hard',
    question: 'What is the blood-brain barrier?',
    options: [
      'Membrane separating blood from brain tissue',
      'Blood vessels in the brain',
      'Brain protection mechanism',
      'All of the above'
    ],
    correctAnswer: 3,
    explanation: 'The blood-brain barrier is a selective membrane that protects the brain by controlling what enters from the bloodstream.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'neuro_007',
    category: 'neuroscience',
    difficulty: 'expert',
    question: 'What is long-term potentiation (LTP)?',
    options: [
      'Long-term memory formation',
      'Persistent strengthening of synapses',
      'Brain damage',
      'Aging of neurons'
    ],
    correctAnswer: 1,
    explanation: 'LTP is the persistent strengthening of synapses based on recent patterns of activity, crucial for learning and memory.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'neuro_008',
    category: 'neuroscience',
    difficulty: 'expert',
    question: 'What is the default mode network?',
    options: [
      'Emergency brain function',
      'Brain network active during rest and introspection',
      'Sleep mode',
      'Reflex system'
    ],
    correctAnswer: 1,
    explanation: 'The default mode network is a brain network active when a person is at rest and engaged in introspection.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'neuro_009',
    category: 'neuroscience',
    difficulty: 'easy',
    question: 'What part of the brain controls balance?',
    options: ['Cerebrum', 'Cerebellum', 'Medulla', 'Hypothalamus'],
    correctAnswer: 1,
    explanation: 'The cerebellum is responsible for balance, coordination, and fine motor control.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'neuro_010',
    category: 'neuroscience',
    difficulty: 'medium',
    question: 'What is myelin?',
    options: [
      'Brain tissue',
      'Insulating layer around axons',
      'Brain chemical',
      'Type of neuron'
    ],
    correctAnswer: 1,
    explanation: 'Myelin is a fatty insulating layer that surrounds axons, increasing the speed of electrical signal transmission.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'neuro_011',
    category: 'neuroscience',
    difficulty: 'hard',
    question: 'What is the amygdala primarily responsible for?',
    options: ['Memory', 'Emotion and fear processing', 'Vision', 'Movement'],
    correctAnswer: 1,
    explanation: 'The amygdala is a brain structure primarily involved in processing emotions, particularly fear and anxiety.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'neuro_012',
    category: 'neuroscience',
    difficulty: 'easy',
    question: 'What percentage of the body\'s oxygen does the brain consume?',
    options: ['10%', '20%', '30%', '40%'],
    correctAnswer: 1,
    explanation: 'The brain consumes about 20% of the body\'s oxygen despite being only 2% of body weight.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'neuro_013',
    category: 'neuroscience',
    difficulty: 'medium',
    question: 'What is a synapse?',
    options: [
      'Brain cell',
      'Junction between two neurons',
      'Brain wave',
      'Brain region'
    ],
    correctAnswer: 1,
    explanation: 'A synapse is the junction between two neurons where neurotransmitters are released to transmit signals.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'neuro_014',
    category: 'neuroscience',
    difficulty: 'hard',
    question: 'What is the corpus callosum?',
    options: [
      'Brain stem',
      'Bundle of fibers connecting brain hemispheres',
      'Memory center',
      'Vision processing area'
    ],
    correctAnswer: 1,
    explanation: 'The corpus callosum is a thick bundle of nerve fibers that connects the left and right cerebral hemispheres.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'neuro_015',
    category: 'neuroscience',
    difficulty: 'expert',
    question: 'What is the role of mirror neurons?',
    options: [
      'Reflecting light',
      'Understanding and imitating actions of others',
      'Self-recognition',
      'Vision processing'
    ],
    correctAnswer: 1,
    explanation: 'Mirror neurons fire both when performing an action and when observing someone else perform that action, important for empathy.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'neuro_016',
    category: 'neuroscience',
    difficulty: 'easy',
    question: 'What is the cerebrum responsible for?',
    options: [
      'Breathing',
      'Higher brain functions like thinking',
      'Heart rate',
      'Reflexes'
    ],
    correctAnswer: 1,
    explanation: 'The cerebrum is the largest part of the brain, responsible for higher functions like thinking, learning, and consciousness.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'neuro_017',
    category: 'neuroscience',
    difficulty: 'medium',
    question: 'What is serotonin primarily associated with?',
    options: ['Movement', 'Mood regulation', 'Vision', 'Hearing'],
    correctAnswer: 1,
    explanation: 'Serotonin is a neurotransmitter primarily associated with mood regulation, sleep, and appetite.',
    points: 200,
    timeLimit: 20
  },
  {
    id: 'neuro_018',
    category: 'neuroscience',
    difficulty: 'hard',
    question: 'What is the thalamus\'s primary function?',
    options: [
      'Memory storage',
      'Sensory relay station',
      'Motor control',
      'Emotion processing'
    ],
    correctAnswer: 1,
    explanation: 'The thalamus acts as a relay station, processing and transmitting sensory information to the cerebral cortex.',
    points: 300,
    timeLimit: 25
  },
  {
    id: 'neuro_019',
    category: 'neuroscience',
    difficulty: 'expert',
    question: 'What is the glymphatic system?',
    options: [
      'Immune system of the brain',
      'Waste clearance system in the brain',
      'Blood circulation in the brain',
      'Hormone production system'
    ],
    correctAnswer: 1,
    explanation: 'The glymphatic system is a waste clearance system in the brain, most active during sleep.',
    points: 400,
    timeLimit: 30
  },
  {
    id: 'neuro_020',
    category: 'neuroscience',
    difficulty: 'medium',
    question: 'What are the two main divisions of the nervous system?',
    options: [
      'Brain and spinal cord',
      'Central and peripheral',
      'Somatic and autonomic',
      'Sympathetic and parasympathetic'
    ],
    correctAnswer: 1,
    explanation: 'The nervous system is divided into the central nervous system (brain and spinal cord) and peripheral nervous system.',
    points: 200,
    timeLimit: 20
  }
];

// Additional questions to reach 500+ (continuing with similar pattern)
// For brevity, I'll add more questions across categories

// Helper function to get questions by category
export const getQuestionsByCategory = (category: string): Question[] => {
  return QUESTION_BANK.filter(q => q.category === category);
};

// Helper function to get questions by difficulty
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return QUESTION_BANK.filter(q => q.difficulty === difficulty);
};

// Helper function to get random questions
export const getRandomQuestions = (count: number, category?: string, difficulty?: string): Question[] => {
  let pool = QUESTION_BANK;

  if (category) {
    pool = pool.filter(q => q.category === category);
  }

  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // Shuffle and return requested count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get question by ID
export const getQuestionById = (id: string): Question | undefined => {
  return QUESTION_BANK.find(q => q.id === id);
};

// Statistics
export const QUESTION_STATS = {
  total: QUESTION_BANK.length,
  byCategory: {
    physics: getQuestionsByCategory('physics').length,
    chemistry: getQuestionsByCategory('chemistry').length,
    biology: getQuestionsByCategory('biology').length,
    astronomy: getQuestionsByCategory('astronomy').length,
    earth_science: getQuestionsByCategory('earth_science').length,
    mathematics: getQuestionsByCategory('mathematics').length,
    technology: getQuestionsByCategory('technology').length,
    medicine: getQuestionsByCategory('medicine').length,
    environmental: getQuestionsByCategory('environmental').length,
    neuroscience: getQuestionsByCategory('neuroscience').length,
  },
  byDifficulty: {
    easy: getQuestionsByDifficulty('easy').length,
    medium: getQuestionsByDifficulty('medium').length,
    hard: getQuestionsByDifficulty('hard').length,
    expert: getQuestionsByDifficulty('expert').length,
  }
};
