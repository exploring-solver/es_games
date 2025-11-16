export type TrophicLevel = 'producer' | 'primary_consumer' | 'secondary_consumer' | 'tertiary_consumer' | 'decomposer';

export type SpeciesType = 'plant' | 'herbivore' | 'carnivore' | 'omnivore' | 'decomposer';

export interface Species {
  id: string;
  name: string;
  type: SpeciesType;
  trophicLevel: TrophicLevel;
  diet: string[]; // IDs of species they eat
  habitat: string[]; // Biome IDs where they thrive
  basePopulation: number;
  growthRate: number; // Per season
  carryingCapacity: number; // Max population per biome
  energyRequirement: number; // Energy needed per individual
  energyProvided: number; // Energy provided when eaten
  resilience: number; // 0-1, resistance to environmental events
  temperatureRange: [number, number]; // Min/max temperature tolerance
  waterRequirement: number; // 0-1, water needs
  invasive: boolean;
  endangered: boolean;
  evolutionPotential: number; // 0-1, how quickly they adapt
  biodiversityValue: number; // Points for having this species
  description: string;
  icon: string;
}

export const SPECIES_DATA: Species[] = [
  // PRODUCERS (Plants)
  {
    id: 'grass',
    name: 'Prairie Grass',
    type: 'plant',
    trophicLevel: 'producer',
    diet: [],
    habitat: ['grassland', 'savanna', 'temperate_forest', 'prairie'],
    basePopulation: 10000,
    growthRate: 0.3,
    carryingCapacity: 50000,
    energyRequirement: 0.1,
    energyProvided: 100,
    resilience: 0.7,
    temperatureRange: [5, 35],
    waterRequirement: 0.4,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.3,
    biodiversityValue: 10,
    description: 'Foundation of many ecosystems, provides food and shelter.',
    icon: '🌾'
  },
  {
    id: 'oak_tree',
    name: 'Oak Tree',
    type: 'plant',
    trophicLevel: 'producer',
    diet: [],
    habitat: ['temperate_forest', 'deciduous_forest', 'woodland'],
    basePopulation: 500,
    growthRate: 0.05,
    carryingCapacity: 2000,
    energyRequirement: 0.3,
    energyProvided: 500,
    resilience: 0.8,
    temperatureRange: [0, 30],
    waterRequirement: 0.6,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.1,
    biodiversityValue: 50,
    description: 'Keystone species providing acorns, shelter, and oxygen.',
    icon: '🌳'
  },
  {
    id: 'kelp',
    name: 'Giant Kelp',
    type: 'plant',
    trophicLevel: 'producer',
    diet: [],
    habitat: ['coastal_ocean', 'kelp_forest'],
    basePopulation: 5000,
    growthRate: 0.4,
    carryingCapacity: 20000,
    energyRequirement: 0.2,
    energyProvided: 150,
    resilience: 0.5,
    temperatureRange: [5, 20],
    waterRequirement: 1.0,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.2,
    biodiversityValue: 40,
    description: 'Underwater forest that supports diverse marine life.',
    icon: '🌿'
  },
  {
    id: 'cactus',
    name: 'Saguaro Cactus',
    type: 'plant',
    trophicLevel: 'producer',
    diet: [],
    habitat: ['desert', 'arid_desert', 'semi_arid'],
    basePopulation: 300,
    growthRate: 0.02,
    carryingCapacity: 1000,
    energyRequirement: 0.05,
    energyProvided: 200,
    resilience: 0.9,
    temperatureRange: [0, 50],
    waterRequirement: 0.1,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.05,
    biodiversityValue: 35,
    description: 'Desert giant adapted to extreme heat and drought.',
    icon: '🌵'
  },
  {
    id: 'phytoplankton',
    name: 'Phytoplankton',
    type: 'plant',
    trophicLevel: 'producer',
    diet: [],
    habitat: ['ocean', 'coastal_ocean', 'lake', 'wetland'],
    basePopulation: 100000,
    growthRate: 0.5,
    carryingCapacity: 500000,
    energyRequirement: 0.01,
    energyProvided: 10,
    resilience: 0.4,
    temperatureRange: [-2, 30],
    waterRequirement: 1.0,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.6,
    biodiversityValue: 20,
    description: 'Microscopic organisms producing 50% of Earth\'s oxygen.',
    icon: '🦠'
  },

  // PRIMARY CONSUMERS (Herbivores)
  {
    id: 'rabbit',
    name: 'Cottontail Rabbit',
    type: 'herbivore',
    trophicLevel: 'primary_consumer',
    diet: ['grass', 'shrub', 'clover'],
    habitat: ['grassland', 'prairie', 'temperate_forest', 'woodland'],
    basePopulation: 200,
    growthRate: 0.4,
    carryingCapacity: 1500,
    energyRequirement: 5,
    energyProvided: 300,
    resilience: 0.6,
    temperatureRange: [-10, 35],
    waterRequirement: 0.5,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.5,
    biodiversityValue: 25,
    description: 'Fast-breeding herbivore, key prey species.',
    icon: '🐰'
  },
  {
    id: 'deer',
    name: 'White-tailed Deer',
    type: 'herbivore',
    trophicLevel: 'primary_consumer',
    diet: ['grass', 'oak_tree', 'shrub'],
    habitat: ['temperate_forest', 'deciduous_forest', 'woodland', 'grassland'],
    basePopulation: 100,
    growthRate: 0.15,
    carryingCapacity: 500,
    energyRequirement: 15,
    energyProvided: 800,
    resilience: 0.7,
    temperatureRange: [-15, 35],
    waterRequirement: 0.6,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.3,
    biodiversityValue: 40,
    description: 'Graceful herbivore that shapes forest undergrowth.',
    icon: '🦌'
  },
  {
    id: 'bison',
    name: 'American Bison',
    type: 'herbivore',
    trophicLevel: 'primary_consumer',
    diet: ['grass', 'prairie_flower'],
    habitat: ['prairie', 'grassland', 'savanna'],
    basePopulation: 50,
    growthRate: 0.1,
    carryingCapacity: 300,
    energyRequirement: 25,
    energyProvided: 1500,
    resilience: 0.8,
    temperatureRange: [-20, 40],
    waterRequirement: 0.7,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.2,
    biodiversityValue: 80,
    description: 'Keystone grazer that maintained the Great Plains.',
    icon: '🦬'
  },
  {
    id: 'zooplankton',
    name: 'Zooplankton',
    type: 'herbivore',
    trophicLevel: 'primary_consumer',
    diet: ['phytoplankton'],
    habitat: ['ocean', 'coastal_ocean', 'lake'],
    basePopulation: 50000,
    growthRate: 0.4,
    carryingCapacity: 200000,
    energyRequirement: 1,
    energyProvided: 20,
    resilience: 0.5,
    temperatureRange: [-2, 30],
    waterRequirement: 1.0,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.6,
    biodiversityValue: 15,
    description: 'Tiny drifters forming the base of aquatic food webs.',
    icon: '🦐'
  },
  {
    id: 'bee',
    name: 'Honeybee',
    type: 'herbivore',
    trophicLevel: 'primary_consumer',
    diet: ['wildflower', 'prairie_flower', 'fruit_tree'],
    habitat: ['grassland', 'temperate_forest', 'prairie', 'orchard'],
    basePopulation: 5000,
    growthRate: 0.3,
    carryingCapacity: 30000,
    energyRequirement: 2,
    energyProvided: 50,
    resilience: 0.4,
    temperatureRange: [10, 40],
    waterRequirement: 0.3,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.4,
    biodiversityValue: 100,
    description: 'Essential pollinator supporting 75% of crops.',
    icon: '🐝'
  },

  // SECONDARY CONSUMERS (Small Carnivores)
  {
    id: 'fox',
    name: 'Red Fox',
    type: 'carnivore',
    trophicLevel: 'secondary_consumer',
    diet: ['rabbit', 'mouse', 'bird'],
    habitat: ['grassland', 'temperate_forest', 'woodland', 'prairie'],
    basePopulation: 30,
    growthRate: 0.2,
    carryingCapacity: 150,
    energyRequirement: 30,
    energyProvided: 400,
    resilience: 0.7,
    temperatureRange: [-20, 35],
    waterRequirement: 0.5,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.4,
    biodiversityValue: 45,
    description: 'Cunning predator that controls rodent populations.',
    icon: '🦊'
  },
  {
    id: 'hawk',
    name: 'Red-tailed Hawk',
    type: 'carnivore',
    trophicLevel: 'secondary_consumer',
    diet: ['rabbit', 'mouse', 'snake'],
    habitat: ['grassland', 'prairie', 'desert', 'woodland'],
    basePopulation: 20,
    growthRate: 0.15,
    carryingCapacity: 100,
    energyRequirement: 25,
    energyProvided: 350,
    resilience: 0.6,
    temperatureRange: [-15, 45],
    waterRequirement: 0.4,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.3,
    biodiversityValue: 50,
    description: 'Apex aerial predator with incredible vision.',
    icon: '🦅'
  },
  {
    id: 'salmon',
    name: 'Pacific Salmon',
    type: 'carnivore',
    trophicLevel: 'secondary_consumer',
    diet: ['zooplankton', 'small_fish'],
    habitat: ['river', 'coastal_ocean', 'stream'],
    basePopulation: 1000,
    growthRate: 0.25,
    carryingCapacity: 5000,
    energyRequirement: 10,
    energyProvided: 500,
    resilience: 0.5,
    temperatureRange: [0, 20],
    waterRequirement: 1.0,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.3,
    biodiversityValue: 70,
    description: 'Anadromous fish crucial to river ecosystems.',
    icon: '🐟'
  },
  {
    id: 'otter',
    name: 'Sea Otter',
    type: 'carnivore',
    trophicLevel: 'secondary_consumer',
    diet: ['sea_urchin', 'crab', 'clam'],
    habitat: ['coastal_ocean', 'kelp_forest'],
    basePopulation: 50,
    growthRate: 0.1,
    carryingCapacity: 200,
    energyRequirement: 20,
    energyProvided: 600,
    resilience: 0.5,
    temperatureRange: [5, 20],
    waterRequirement: 1.0,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.2,
    biodiversityValue: 85,
    description: 'Keystone species protecting kelp forests from urchins.',
    icon: '🦦'
  },

  // TERTIARY CONSUMERS (Top Predators)
  {
    id: 'wolf',
    name: 'Gray Wolf',
    type: 'carnivore',
    trophicLevel: 'tertiary_consumer',
    diet: ['deer', 'bison', 'rabbit'],
    habitat: ['temperate_forest', 'taiga', 'tundra', 'prairie'],
    basePopulation: 15,
    growthRate: 0.1,
    carryingCapacity: 60,
    energyRequirement: 50,
    energyProvided: 800,
    resilience: 0.7,
    temperatureRange: [-30, 30],
    waterRequirement: 0.6,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.3,
    biodiversityValue: 150,
    description: 'Apex predator critical for ecosystem balance.',
    icon: '🐺'
  },
  {
    id: 'bear',
    name: 'Grizzly Bear',
    type: 'omnivore',
    trophicLevel: 'tertiary_consumer',
    diet: ['deer', 'salmon', 'berry_bush', 'bee'],
    habitat: ['temperate_forest', 'taiga', 'mountain'],
    basePopulation: 10,
    growthRate: 0.08,
    carryingCapacity: 40,
    energyRequirement: 60,
    energyProvided: 1200,
    resilience: 0.8,
    temperatureRange: [-25, 35],
    waterRequirement: 0.7,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.2,
    biodiversityValue: 120,
    description: 'Powerful omnivore shaping entire ecosystems.',
    icon: '🐻'
  },
  {
    id: 'orca',
    name: 'Orca (Killer Whale)',
    type: 'carnivore',
    trophicLevel: 'tertiary_consumer',
    diet: ['salmon', 'seal', 'shark'],
    habitat: ['ocean', 'coastal_ocean'],
    basePopulation: 8,
    growthRate: 0.05,
    carryingCapacity: 30,
    energyRequirement: 100,
    energyProvided: 2000,
    resilience: 0.6,
    temperatureRange: [-2, 25],
    waterRequirement: 1.0,
    invasive: false,
    endangered: true,
    evolutionPotential: 0.1,
    biodiversityValue: 180,
    description: 'Ocean apex predator with complex social structures.',
    icon: '🐋'
  },
  {
    id: 'eagle',
    name: 'Bald Eagle',
    type: 'carnivore',
    trophicLevel: 'tertiary_consumer',
    diet: ['salmon', 'rabbit', 'fox'],
    habitat: ['coastal_ocean', 'river', 'lake', 'temperate_forest'],
    basePopulation: 12,
    growthRate: 0.08,
    carryingCapacity: 50,
    energyRequirement: 40,
    energyProvided: 600,
    resilience: 0.6,
    temperatureRange: [-20, 40],
    waterRequirement: 0.5,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.2,
    biodiversityValue: 110,
    description: 'Majestic raptor, symbol of conservation success.',
    icon: '🦅'
  },

  // DECOMPOSERS
  {
    id: 'mushroom',
    name: 'Decomposer Fungi',
    type: 'decomposer',
    trophicLevel: 'decomposer',
    diet: [], // Feeds on dead organic matter
    habitat: ['temperate_forest', 'deciduous_forest', 'rainforest', 'woodland'],
    basePopulation: 10000,
    growthRate: 0.3,
    carryingCapacity: 50000,
    energyRequirement: 0.5,
    energyProvided: 50,
    resilience: 0.8,
    temperatureRange: [5, 35],
    waterRequirement: 0.7,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.5,
    biodiversityValue: 60,
    description: 'Recyclers that return nutrients to the soil.',
    icon: '🍄'
  },
  {
    id: 'bacteria',
    name: 'Decomposer Bacteria',
    type: 'decomposer',
    trophicLevel: 'decomposer',
    diet: [],
    habitat: ['all'], // Present everywhere
    basePopulation: 1000000,
    growthRate: 0.6,
    carryingCapacity: 5000000,
    energyRequirement: 0.01,
    energyProvided: 5,
    resilience: 0.95,
    temperatureRange: [-5, 60],
    waterRequirement: 0.3,
    invasive: false,
    endangered: false,
    evolutionPotential: 0.9,
    biodiversityValue: 30,
    description: 'Microscopic heroes breaking down all organic matter.',
    icon: '🦠'
  },

  // INVASIVE SPECIES
  {
    id: 'kudzu',
    name: 'Kudzu Vine',
    type: 'plant',
    trophicLevel: 'producer',
    diet: [],
    habitat: ['temperate_forest', 'grassland', 'woodland'],
    basePopulation: 100,
    growthRate: 0.8,
    carryingCapacity: 30000,
    energyRequirement: 0.1,
    energyProvided: 80,
    resilience: 0.95,
    temperatureRange: [-5, 40],
    waterRequirement: 0.5,
    invasive: true,
    endangered: false,
    evolutionPotential: 0.7,
    biodiversityValue: -50, // Negative value
    description: 'Aggressive invasive vine that smothers native plants.',
    icon: '🌿'
  },
  {
    id: 'carp',
    name: 'Asian Carp',
    type: 'herbivore',
    trophicLevel: 'primary_consumer',
    diet: ['phytoplankton', 'zooplankton'],
    habitat: ['river', 'lake', 'wetland'],
    basePopulation: 200,
    growthRate: 0.6,
    carryingCapacity: 5000,
    energyRequirement: 8,
    energyProvided: 300,
    resilience: 0.9,
    temperatureRange: [0, 35],
    waterRequirement: 1.0,
    invasive: true,
    endangered: false,
    evolutionPotential: 0.6,
    biodiversityValue: -40,
    description: 'Invasive fish outcompeting native species.',
    icon: '🐟'
  },
  {
    id: 'wild_boar',
    name: 'Feral Hog',
    type: 'omnivore',
    trophicLevel: 'secondary_consumer',
    diet: ['grass', 'oak_tree', 'rabbit', 'bird_eggs'],
    habitat: ['temperate_forest', 'grassland', 'wetland', 'prairie'],
    basePopulation: 100,
    growthRate: 0.5,
    carryingCapacity: 1000,
    energyRequirement: 20,
    energyProvided: 700,
    resilience: 0.9,
    temperatureRange: [-10, 45],
    waterRequirement: 0.6,
    invasive: true,
    endangered: false,
    evolutionPotential: 0.5,
    biodiversityValue: -60,
    description: 'Destructive invasive causing massive ecosystem damage.',
    icon: '🐗'
  }
];

export const getSpeciesByTrophicLevel = (level: TrophicLevel): Species[] => {
  return SPECIES_DATA.filter(species => species.trophicLevel === level);
};

export const getSpeciesByHabitat = (habitatId: string): Species[] => {
  return SPECIES_DATA.filter(species =>
    species.habitat.includes(habitatId) || species.habitat.includes('all')
  );
};

export const getPreyForPredator = (predatorId: string): Species[] => {
  const predator = SPECIES_DATA.find(s => s.id === predatorId);
  if (!predator) return [];

  return SPECIES_DATA.filter(species =>
    predator.diet.includes(species.id)
  );
};

export const getPredatorsForPrey = (preyId: string): Species[] => {
  return SPECIES_DATA.filter(predator =>
    predator.diet.includes(preyId)
  );
};

export const getInvasiveSpecies = (): Species[] => {
  return SPECIES_DATA.filter(species => species.invasive);
};

export const getEndangeredSpecies = (): Species[] => {
  return SPECIES_DATA.filter(species => species.endangered);
};
