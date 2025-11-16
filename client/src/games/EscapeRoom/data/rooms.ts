export type DisasterScenario = 'radiation_leak' | 'virus_outbreak' | 'reactor_meltdown';

export interface RoomData {
  id: string;
  name: string;
  theme: 'chemistry' | 'physics' | 'biology' | 'mixed';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredPuzzleSolves: number;
  availablePuzzles: string[]; // puzzle IDs
  interactiveObjects: InteractiveObject[];
  connectedRooms: string[];
  requiredItems?: string[];
  disasterCompatible: DisasterScenario[];
  backgroundImage?: string;
  ambientSound?: string;
}

export interface InteractiveObject {
  id: string;
  name: string;
  description: string;
  x: number; // position in room (percentage)
  y: number;
  interactionType: 'puzzle' | 'item' | 'door' | 'clue' | 'combination';
  requiredAction?: string;
  reward?: string;
}

export const labRooms: RoomData[] = [
  // STARTING AREA
  {
    id: 'room_01',
    name: 'Main Entrance Hall',
    theme: 'mixed',
    description: 'The entrance to the research facility. Emergency lights flicker overhead. You must find a way deeper into the lab.',
    difficulty: 'easy',
    requiredPuzzleSolves: 1,
    availablePuzzles: ['logic_001', 'math_001'],
    interactiveObjects: [
      { id: 'entrance_door', name: 'Locked Security Door', description: 'Requires a code', x: 50, y: 80, interactionType: 'puzzle' },
      { id: 'reception_desk', name: 'Reception Desk', description: 'Contains various items', x: 30, y: 40, interactionType: 'item', reward: 'keycard_01' },
      { id: 'emergency_panel', name: 'Emergency Panel', description: 'Displays facility map', x: 70, y: 30, interactionType: 'clue' }
    ],
    connectedRooms: ['room_02', 'room_03'],
    disasterCompatible: ['radiation_leak', 'virus_outbreak', 'reactor_meltdown']
  },

  // CHEMISTRY WING
  {
    id: 'room_02',
    name: 'Chemistry Laboratory Alpha',
    theme: 'chemistry',
    description: 'A well-equipped chemistry lab. Beakers and flasks line the benches. Chemical formulas cover the whiteboard.',
    difficulty: 'easy',
    requiredPuzzleSolves: 2,
    availablePuzzles: ['chem_001', 'chem_002'],
    interactiveObjects: [
      { id: 'fume_hood', name: 'Fume Hood', description: 'Contains reactive chemicals', x: 40, y: 50, interactionType: 'puzzle' },
      { id: 'periodic_table', name: 'Interactive Periodic Table', description: 'Touch screen display', x: 20, y: 30, interactionType: 'clue' },
      { id: 'chemical_storage', name: 'Chemical Storage Cabinet', description: 'Locked cabinet', x: 70, y: 60, interactionType: 'item', reward: 'spectrometer' },
      { id: 'sink_station', name: 'Lab Sink', description: 'Water and drainage', x: 60, y: 40, interactionType: 'item', reward: 'beaker' }
    ],
    connectedRooms: ['room_01', 'room_04'],
    disasterCompatible: ['radiation_leak', 'virus_outbreak', 'reactor_meltdown']
  },

  {
    id: 'room_03',
    name: 'Organic Chemistry Lab',
    theme: 'chemistry',
    description: 'Specialized for organic synthesis. The smell of solvents lingers. Complex molecular models are displayed.',
    difficulty: 'medium',
    requiredPuzzleSolves: 2,
    availablePuzzles: ['chem_002', 'chem_003'],
    interactiveObjects: [
      { id: 'distillation_setup', name: 'Distillation Apparatus', description: 'For separating compounds', x: 45, y: 55, interactionType: 'puzzle' },
      { id: 'nmr_machine', name: 'NMR Spectrometer', description: 'Determines molecular structure', x: 70, y: 45, interactionType: 'puzzle' },
      { id: 'reagent_shelf', name: 'Reagent Shelf', description: 'Various chemical reagents', x: 25, y: 35, interactionType: 'item', reward: 'silver_nitrate' }
    ],
    connectedRooms: ['room_01', 'room_05'],
    requiredItems: ['keycard_01'],
    disasterCompatible: ['virus_outbreak', 'reactor_meltdown']
  },

  {
    id: 'room_04',
    name: 'Hazardous Materials Storage',
    theme: 'chemistry',
    description: 'Temperature-controlled storage for dangerous chemicals. Warning signs are everywhere. Proper handling is critical.',
    difficulty: 'hard',
    requiredPuzzleSolves: 3,
    availablePuzzles: ['chem_003', 'logic_003'],
    interactiveObjects: [
      { id: 'cryo_chamber', name: 'Cryogenic Chamber', description: 'Ultra-cold storage', x: 50, y: 60, interactionType: 'puzzle' },
      { id: 'hazmat_suit', name: 'Hazmat Suit Station', description: 'Protective equipment', x: 30, y: 40, interactionType: 'item', reward: 'hazmat_suit' },
      { id: 'chemical_safe', name: 'Reinforced Safe', description: 'Contains critical materials', x: 70, y: 50, interactionType: 'combination' }
    ],
    connectedRooms: ['room_02', 'room_06'],
    requiredItems: ['hazmat_clearance'],
    disasterCompatible: ['radiation_leak', 'reactor_meltdown']
  },

  // PHYSICS WING
  {
    id: 'room_05',
    name: 'Quantum Mechanics Lab',
    theme: 'physics',
    description: 'Advanced physics equipment fills the room. Laser beams crisscross through the darkness. Quantum computers hum.',
    difficulty: 'medium',
    requiredPuzzleSolves: 2,
    availablePuzzles: ['phys_001', 'phys_002'],
    interactiveObjects: [
      { id: 'laser_array', name: 'Laser Array', description: 'Precision laser system', x: 50, y: 50, interactionType: 'puzzle' },
      { id: 'quantum_computer', name: 'Quantum Computer', description: 'Performs complex calculations', x: 30, y: 60, interactionType: 'puzzle' },
      { id: 'optics_bench', name: 'Optics Bench', description: 'Mirrors and lenses', x: 70, y: 40, interactionType: 'item', reward: 'mirrors' }
    ],
    connectedRooms: ['room_03', 'room_07'],
    disasterCompatible: ['radiation_leak', 'virus_outbreak', 'reactor_meltdown']
  },

  {
    id: 'room_06',
    name: 'Particle Accelerator Chamber',
    theme: 'physics',
    description: 'The heart of the facility. A massive particle accelerator dominates the room. Radiation warnings flash.',
    difficulty: 'hard',
    requiredPuzzleSolves: 3,
    availablePuzzles: ['phys_002', 'phys_003', 'math_003'],
    interactiveObjects: [
      { id: 'accelerator_controls', name: 'Accelerator Controls', description: 'Main control panel', x: 50, y: 70, interactionType: 'puzzle' },
      { id: 'radiation_detector', name: 'Radiation Detector', description: 'Monitors radiation levels', x: 40, y: 40, interactionType: 'item', reward: 'geiger_counter' },
      { id: 'coolant_system', name: 'Coolant System', description: 'Prevents overheating', x: 60, y: 55, interactionType: 'puzzle' }
    ],
    connectedRooms: ['room_04', 'room_08'],
    requiredItems: ['radiation_clearance'],
    disasterCompatible: ['radiation_leak', 'reactor_meltdown']
  },

  {
    id: 'room_07',
    name: 'Electromagnetic Research Lab',
    theme: 'physics',
    description: 'Powerful electromagnets and Tesla coils. Electrical equipment buzzes with energy. Circuit diagrams cover the walls.',
    difficulty: 'medium',
    requiredPuzzleSolves: 2,
    availablePuzzles: ['phys_001', 'math_002'],
    interactiveObjects: [
      { id: 'tesla_coil', name: 'Tesla Coil', description: 'High-voltage transformer', x: 45, y: 50, interactionType: 'puzzle' },
      { id: 'circuit_board', name: 'Circuit Testing Station', description: 'Test electrical circuits', x: 65, y: 45, interactionType: 'puzzle' },
      { id: 'tool_cabinet', name: 'Electrician Tools', description: 'Multimeters and tools', x: 30, y: 35, interactionType: 'item', reward: 'multimeter' }
    ],
    connectedRooms: ['room_05', 'room_09'],
    disasterCompatible: ['radiation_leak', 'virus_outbreak', 'reactor_meltdown']
  },

  // BIOLOGY WING
  {
    id: 'room_08',
    name: 'Virology Containment Lab',
    theme: 'biology',
    description: 'Level 4 biosafety lab. Sealed chambers contain dangerous pathogens. Air filtration systems are running.',
    difficulty: 'hard',
    requiredPuzzleSolves: 3,
    availablePuzzles: ['bio_002', 'bio_003'],
    interactiveObjects: [
      { id: 'containment_unit', name: 'Virus Containment Unit', description: 'Sealed biohazard container', x: 50, y: 60, interactionType: 'puzzle' },
      { id: 'biosafety_cabinet', name: 'Biosafety Cabinet', description: 'Sterile work environment', x: 35, y: 45, interactionType: 'puzzle' },
      { id: 'vaccine_fridge', name: 'Vaccine Storage', description: 'Temperature-controlled storage', x: 70, y: 50, interactionType: 'item', reward: 'antibody_sample' }
    ],
    connectedRooms: ['room_06', 'room_10'],
    requiredItems: ['bio_clearance'],
    disasterCompatible: ['virus_outbreak']
  },

  {
    id: 'room_09',
    name: 'Genetics Laboratory',
    theme: 'biology',
    description: 'DNA sequencing equipment and gene editing tools. Microscopes line the benches. Petri dishes show growing cultures.',
    difficulty: 'medium',
    requiredPuzzleSolves: 2,
    availablePuzzles: ['bio_001', 'bio_002'],
    interactiveObjects: [
      { id: 'pcr_machine', name: 'PCR Machine', description: 'Amplifies DNA sequences', x: 45, y: 50, interactionType: 'puzzle' },
      { id: 'gel_electrophoresis', name: 'Gel Electrophoresis', description: 'Separates DNA fragments', x: 60, y: 55, interactionType: 'puzzle' },
      { id: 'microscope_station', name: 'Research Microscopes', description: 'High-powered microscopes', x: 30, y: 40, interactionType: 'item', reward: 'dna_sample' },
      { id: 'incubator', name: 'Cell Incubator', description: 'Maintains cell cultures', x: 70, y: 45, interactionType: 'item', reward: 'petri_dish' }
    ],
    connectedRooms: ['room_07', 'room_11'],
    disasterCompatible: ['virus_outbreak', 'radiation_leak']
  },

  {
    id: 'room_10',
    name: 'Stem Cell Research Lab',
    theme: 'biology',
    description: 'Cutting-edge regenerative medicine research. Specialized equipment for cell cultivation and differentiation.',
    difficulty: 'hard',
    requiredPuzzleSolves: 3,
    availablePuzzles: ['bio_002', 'bio_003', 'chem_002'],
    interactiveObjects: [
      { id: 'cell_sorter', name: 'Flow Cytometer', description: 'Sorts cells by properties', x: 50, y: 55, interactionType: 'puzzle' },
      { id: 'culture_room', name: 'Cell Culture Chamber', description: 'Sterile growth environment', x: 40, y: 45, interactionType: 'puzzle' },
      { id: 'liquid_nitrogen', name: 'Cryogenic Storage', description: 'Stores cells at -196°C', x: 65, y: 60, interactionType: 'item', reward: 'culture_medium' }
    ],
    connectedRooms: ['room_08', 'room_12'],
    requiredItems: ['stem_cell_clearance'],
    disasterCompatible: ['virus_outbreak', 'radiation_leak']
  },

  // MIXED/ADVANCED LABS
  {
    id: 'room_11',
    name: 'Biochemistry Integration Lab',
    theme: 'mixed',
    description: 'Where chemistry meets biology. Equipment for protein analysis, enzyme kinetics, and metabolic studies.',
    difficulty: 'hard',
    requiredPuzzleSolves: 3,
    availablePuzzles: ['bio_003', 'chem_003', 'math_002'],
    interactiveObjects: [
      { id: 'protein_purifier', name: 'Protein Purification System', description: 'Isolates specific proteins', x: 45, y: 50, interactionType: 'puzzle' },
      { id: 'mass_spec', name: 'Mass Spectrometer', description: 'Identifies molecules by mass', x: 60, y: 55, interactionType: 'puzzle' },
      { id: 'enzyme_assay', name: 'Enzyme Assay Station', description: 'Measures enzyme activity', x: 35, y: 45, interactionType: 'puzzle' }
    ],
    connectedRooms: ['room_09', 'room_13'],
    disasterCompatible: ['virus_outbreak', 'radiation_leak', 'reactor_meltdown']
  },

  {
    id: 'room_12',
    name: 'Nanotechnology Lab',
    theme: 'mixed',
    description: 'Cleanroom environment for nanoscale research. Electron microscopes and atomic force microscopes.',
    difficulty: 'hard',
    requiredPuzzleSolves: 3,
    availablePuzzles: ['phys_003', 'chem_003', 'logic_003'],
    interactiveObjects: [
      { id: 'electron_microscope', name: 'Electron Microscope', description: 'See atoms', x: 50, y: 60, interactionType: 'puzzle' },
      { id: 'nanofab_station', name: 'Nanofabrication Station', description: 'Build at atomic scale', x: 40, y: 50, interactionType: 'puzzle' },
      { id: 'cleanroom_suit', name: 'Cleanroom Suits', description: 'Dust-free protective gear', x: 70, y: 40, interactionType: 'item', reward: 'cleanroom_pass' }
    ],
    connectedRooms: ['room_10', 'room_14'],
    requiredItems: ['nano_clearance'],
    disasterCompatible: ['radiation_leak', 'reactor_meltdown']
  },

  {
    id: 'room_13',
    name: 'Main Control Center',
    theme: 'mixed',
    description: 'The facility\'s nerve center. Monitors display all systems. This is where you can stop the disaster.',
    difficulty: 'hard',
    requiredPuzzleSolves: 4,
    availablePuzzles: ['phys_003', 'math_003', 'logic_003'],
    interactiveObjects: [
      { id: 'main_console', name: 'Master Control Console', description: 'Controls all systems', x: 50, y: 50, interactionType: 'puzzle' },
      { id: 'security_terminal', name: 'Security Terminal', description: 'Access control system', x: 35, y: 60, interactionType: 'puzzle' },
      { id: 'emergency_override', name: 'Emergency Override Panel', description: 'Last resort controls', x: 65, y: 55, interactionType: 'combination' },
      { id: 'communication', name: 'Communication Array', description: 'Contact outside world', x: 50, y: 70, interactionType: 'clue' }
    ],
    connectedRooms: ['room_11', 'room_14', 'room_15'],
    requiredItems: ['master_key'],
    disasterCompatible: ['radiation_leak', 'virus_outbreak', 'reactor_meltdown']
  },

  {
    id: 'room_14',
    name: 'Reactor Core Chamber',
    theme: 'physics',
    description: 'The experimental fusion reactor. Massive and humming with power. The source of the meltdown threat.',
    difficulty: 'hard',
    requiredPuzzleSolves: 4,
    availablePuzzles: ['phys_003', 'math_003', 'chem_003'],
    interactiveObjects: [
      { id: 'reactor_core', name: 'Reactor Core', description: 'Fusion reaction chamber', x: 50, y: 60, interactionType: 'puzzle' },
      { id: 'cooling_controls', name: 'Cooling System Controls', description: 'Prevent meltdown', x: 40, y: 50, interactionType: 'puzzle' },
      { id: 'radiation_shield', name: 'Radiation Shielding', description: 'Lead-lined barrier', x: 60, y: 55, interactionType: 'puzzle' },
      { id: 'emergency_shutdown', name: 'Emergency Shutdown', description: 'SCRAM button', x: 70, y: 40, interactionType: 'combination' }
    ],
    connectedRooms: ['room_12', 'room_13'],
    requiredItems: ['reactor_key', 'radiation_shield'],
    disasterCompatible: ['reactor_meltdown', 'radiation_leak']
  },

  {
    id: 'room_15',
    name: 'Emergency Exit & Decontamination',
    theme: 'mixed',
    description: 'The final escape route. Decontamination showers and the exit to safety. You\'re almost free!',
    difficulty: 'medium',
    requiredPuzzleSolves: 2,
    availablePuzzles: ['logic_002', 'math_001'],
    interactiveObjects: [
      { id: 'decon_shower', name: 'Decontamination Shower', description: 'Remove hazardous materials', x: 40, y: 50, interactionType: 'puzzle' },
      { id: 'exit_door', name: 'Emergency Exit Door', description: 'Final door to freedom', x: 60, y: 70, interactionType: 'door' },
      { id: 'achievement_terminal', name: 'Achievement Terminal', description: 'Records your success', x: 50, y: 40, interactionType: 'clue' }
    ],
    connectedRooms: ['room_13'],
    requiredItems: ['all_objectives_complete'],
    disasterCompatible: ['radiation_leak', 'virus_outbreak', 'reactor_meltdown']
  }
];

// Disaster Scenarios
export interface DisasterData {
  id: DisasterScenario;
  name: string;
  description: string;
  storyIntro: string;
  winCondition: string;
  timeLimit: number; // in seconds
  objectiveRooms: string[]; // rooms that must be completed
  specialMechanics: string;
  difficulty: 'normal' | 'hard' | 'extreme';
}

export const disasters: DisasterData[] = [
  {
    id: 'radiation_leak',
    name: 'Radiation Leak',
    description: 'The particle accelerator has been damaged, releasing dangerous radiation throughout the facility.',
    storyIntro: 'ALERT: Radiation levels critical. Containment breach in Sector 4. All personnel must reach the particle accelerator chamber and activate emergency shielding. Time until lethal exposure: 60 minutes.',
    winCondition: 'Seal the radiation leak by solving puzzles in the Particle Accelerator Chamber and activating the emergency containment protocol.',
    timeLimit: 3600, // 60 minutes
    objectiveRooms: ['room_06', 'room_04', 'room_13'],
    specialMechanics: 'Radiation levels increase over time. Players need radiation shielding items to access certain rooms.',
    difficulty: 'hard'
  },
  {
    id: 'virus_outbreak',
    name: 'Viral Outbreak',
    description: 'A deadly pathogen has escaped from the virology lab. The facility is in lockdown.',
    storyIntro: 'BIOHAZARD ALERT: Level 4 pathogen containment failure. Airborne transmission detected. Create and deploy the antiviral countermeasure before the infection spreads beyond the facility. Time until containment failure: 45 minutes.',
    winCondition: 'Synthesize the antiviral cure in the Virology Lab and deploy it through the ventilation system.',
    timeLimit: 2700, // 45 minutes
    objectiveRooms: ['room_08', 'room_09', 'room_10', 'room_11', 'room_13'],
    specialMechanics: 'Players must collect antibody samples and combine biological materials. Time pressure increases as infection spreads.',
    difficulty: 'extreme'
  },
  {
    id: 'reactor_meltdown',
    name: 'Reactor Meltdown',
    description: 'The experimental fusion reactor is overheating. A meltdown will destroy the entire facility.',
    storyIntro: 'CRITICAL: Reactor core temperature exceeding safe limits. Cooling system failure detected. Manual intervention required to prevent catastrophic meltdown. Time to critical mass: 50 minutes.',
    winCondition: 'Restore the cooling system and perform an emergency shutdown of the reactor core.',
    timeLimit: 3000, // 50 minutes
    objectiveRooms: ['room_06', 'room_14', 'room_13'],
    specialMechanics: 'Temperature increases over time. Players must balance cooling the reactor while solving puzzles. Requires coordination between multiple rooms.',
    difficulty: 'hard'
  }
];

// Helper function to get rooms by theme
export const getRoomsByTheme = (theme: RoomData['theme']): RoomData[] => {
  return labRooms.filter(room => room.theme === theme);
};

// Helper function to get rooms by difficulty
export const getRoomsByDifficulty = (difficulty: RoomData['difficulty']): RoomData[] => {
  return labRooms.filter(room => room.difficulty === difficulty);
};

// Helper function to get available rooms for a disaster
export const getRoomsForDisaster = (disasterType: DisasterScenario): RoomData[] => {
  return labRooms.filter(room => room.disasterCompatible.includes(disasterType));
};

export default labRooms;
