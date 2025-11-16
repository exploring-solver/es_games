export interface ClimateConditions {
  temperature: number; // Celsius
  precipitation: number; // mm per year
  humidity: number; // 0-1
  seasonality: number; // 0-1, variation throughout year
}

export interface Biome {
  id: string;
  name: string;
  description: string;
  climate: ClimateConditions;
  difficulty: number; // 1-5
  biodiversityTarget: number; // Target number of species
  startingSpecies: string[]; // IDs of species that start here
  challengeDescription: string;
  backgroundGradient: string;
  icon: string;
  unlockLevel: number; // Player level required
}

export const BIOMES_DATA: Biome[] = [
  {
    id: 'grassland',
    name: 'Temperate Grassland',
    description: 'Vast plains with moderate climate, perfect for learning ecosystem basics.',
    climate: {
      temperature: 15,
      precipitation: 600,
      humidity: 0.6,
      seasonality: 0.4
    },
    difficulty: 1,
    biodiversityTarget: 15,
    startingSpecies: ['grass', 'rabbit', 'fox', 'hawk', 'bee', 'mushroom', 'bacteria'],
    challengeDescription: 'Balance herbivore and predator populations in this simple ecosystem.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #90EE90 50%, #228B22 100%)',
    icon: '🌾',
    unlockLevel: 1
  },
  {
    id: 'temperate_forest',
    name: 'Temperate Deciduous Forest',
    description: 'Rich forest with seasonal changes and complex food webs.',
    climate: {
      temperature: 12,
      precipitation: 900,
      humidity: 0.7,
      seasonality: 0.7
    },
    difficulty: 2,
    biodiversityTarget: 20,
    startingSpecies: ['oak_tree', 'deer', 'fox', 'wolf', 'mushroom', 'bacteria', 'bee'],
    challengeDescription: 'Manage seasonal variations and maintain forest health.',
    backgroundGradient: 'linear-gradient(to bottom, #4A90E2 0%, #2E7D32 40%, #1B5E20 100%)',
    icon: '🌳',
    unlockLevel: 1
  },
  {
    id: 'prairie',
    name: 'American Prairie',
    description: 'Iconic grassland once home to millions of bison.',
    climate: {
      temperature: 14,
      precipitation: 500,
      humidity: 0.5,
      seasonality: 0.6
    },
    difficulty: 2,
    biodiversityTarget: 18,
    startingSpecies: ['grass', 'bison', 'rabbit', 'fox', 'hawk', 'bee', 'bacteria'],
    challengeDescription: 'Restore the prairie ecosystem with proper grazing balance.',
    backgroundGradient: 'linear-gradient(to bottom, #FFD700 0%, #DEB887 50%, #8B7355 100%)',
    icon: '🦬',
    unlockLevel: 2
  },
  {
    id: 'desert',
    name: 'Arid Desert',
    description: 'Extreme environment with scarce water and temperature fluctuations.',
    climate: {
      temperature: 28,
      precipitation: 150,
      humidity: 0.2,
      seasonality: 0.3
    },
    difficulty: 3,
    biodiversityTarget: 12,
    startingSpecies: ['cactus', 'hawk', 'bacteria'],
    challengeDescription: 'Survive with limited resources and extreme temperature swings.',
    backgroundGradient: 'linear-gradient(to bottom, #FF6347 0%, #F4A460 50%, #CD853F 100%)',
    icon: '🌵',
    unlockLevel: 3
  },
  {
    id: 'rainforest',
    name: 'Tropical Rainforest',
    description: 'The most biodiverse ecosystem on Earth with year-round warmth.',
    climate: {
      temperature: 26,
      precipitation: 2500,
      humidity: 0.9,
      seasonality: 0.1
    },
    difficulty: 4,
    biodiversityTarget: 35,
    startingSpecies: ['mushroom', 'bacteria'],
    challengeDescription: 'Maintain incredible biodiversity and complex interactions.',
    backgroundGradient: 'linear-gradient(to bottom, #00CED1 0%, #228B22 30%, #006400 100%)',
    icon: '🌴',
    unlockLevel: 5
  },
  {
    id: 'tundra',
    name: 'Arctic Tundra',
    description: 'Frozen landscape with short growing seasons and harsh winters.',
    climate: {
      temperature: -8,
      precipitation: 250,
      humidity: 0.4,
      seasonality: 0.9
    },
    difficulty: 4,
    biodiversityTarget: 10,
    startingSpecies: ['bacteria'],
    challengeDescription: 'Survive extreme cold and adapt to dramatic seasonal changes.',
    backgroundGradient: 'linear-gradient(to bottom, #E0FFFF 0%, #B0E0E6 50%, #4682B4 100%)',
    icon: '❄️',
    unlockLevel: 6
  },
  {
    id: 'savanna',
    name: 'African Savanna',
    description: 'Grassland with scattered trees, famous for large herbivores.',
    climate: {
      temperature: 24,
      precipitation: 700,
      humidity: 0.5,
      seasonality: 0.8
    },
    difficulty: 3,
    biodiversityTarget: 22,
    startingSpecies: ['grass', 'bacteria'],
    challengeDescription: 'Balance large herbivore herds with predator populations.',
    backgroundGradient: 'linear-gradient(to bottom, #FFD700 0%, #F0E68C 50%, #DAA520 100%)',
    icon: '🦁',
    unlockLevel: 4
  },
  {
    id: 'taiga',
    name: 'Boreal Forest (Taiga)',
    description: 'Vast coniferous forest with long, cold winters.',
    climate: {
      temperature: 0,
      precipitation: 500,
      humidity: 0.6,
      seasonality: 0.8
    },
    difficulty: 3,
    biodiversityTarget: 16,
    startingSpecies: ['wolf', 'deer', 'mushroom', 'bacteria'],
    challengeDescription: 'Manage predator-prey dynamics in harsh conditions.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #2F4F4F 40%, #1C3A1C 100%)',
    icon: '🌲',
    unlockLevel: 4
  },
  {
    id: 'coastal_ocean',
    name: 'Coastal Ocean',
    description: 'Productive marine ecosystem where land meets sea.',
    climate: {
      temperature: 15,
      precipitation: 1000,
      humidity: 0.95,
      seasonality: 0.3
    },
    difficulty: 3,
    biodiversityTarget: 18,
    startingSpecies: ['kelp', 'phytoplankton', 'zooplankton', 'otter', 'bacteria'],
    challengeDescription: 'Maintain kelp forests and marine food chains.',
    backgroundGradient: 'linear-gradient(to bottom, #1E90FF 0%, #4682B4 50%, #00008B 100%)',
    icon: '🌊',
    unlockLevel: 5
  },
  {
    id: 'wetland',
    name: 'Freshwater Wetland',
    description: 'Marshy transitional ecosystem between land and water.',
    climate: {
      temperature: 18,
      precipitation: 1200,
      humidity: 0.85,
      seasonality: 0.5
    },
    difficulty: 2,
    biodiversityTarget: 24,
    startingSpecies: ['phytoplankton', 'zooplankton', 'bacteria'],
    challengeDescription: 'Balance aquatic and terrestrial species in this unique habitat.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #3CB371 50%, #2E8B57 100%)',
    icon: '🦆',
    unlockLevel: 3
  },
  {
    id: 'kelp_forest',
    name: 'Giant Kelp Forest',
    description: 'Underwater forest providing habitat for countless species.',
    climate: {
      temperature: 12,
      precipitation: 0,
      humidity: 1.0,
      seasonality: 0.2
    },
    difficulty: 4,
    biodiversityTarget: 20,
    startingSpecies: ['kelp', 'phytoplankton', 'zooplankton', 'otter', 'bacteria'],
    challengeDescription: 'Protect kelp from sea urchins and maintain marine balance.',
    backgroundGradient: 'linear-gradient(to bottom, #20B2AA 0%, #008B8B 50%, #006666 100%)',
    icon: '🌿',
    unlockLevel: 6
  },
  {
    id: 'coral_reef',
    name: 'Coral Reef',
    description: 'Rainforest of the sea with stunning biodiversity.',
    climate: {
      temperature: 26,
      precipitation: 0,
      humidity: 1.0,
      seasonality: 0.1
    },
    difficulty: 5,
    biodiversityTarget: 40,
    startingSpecies: ['phytoplankton', 'zooplankton', 'bacteria'],
    challengeDescription: 'Extremely sensitive to temperature and pH changes.',
    backgroundGradient: 'linear-gradient(to bottom, #00CED1 0%, #FF6347 30%, #FF4500 100%)',
    icon: '🪸',
    unlockLevel: 8
  },
  {
    id: 'mountain',
    name: 'Mountain Ecosystem',
    description: 'Vertical gradient with multiple climate zones.',
    climate: {
      temperature: 8,
      precipitation: 800,
      humidity: 0.6,
      seasonality: 0.7
    },
    difficulty: 4,
    biodiversityTarget: 19,
    startingSpecies: ['bear', 'deer', 'mushroom', 'bacteria'],
    challengeDescription: 'Manage species across different elevation zones.',
    backgroundGradient: 'linear-gradient(to bottom, #F0F8FF 0%, #696969 40%, #2F4F4F 100%)',
    icon: '⛰️',
    unlockLevel: 5
  },
  {
    id: 'deciduous_forest',
    name: 'Eastern Deciduous Forest',
    description: 'Four distinct seasons with dramatic fall colors.',
    climate: {
      temperature: 13,
      precipitation: 1000,
      humidity: 0.7,
      seasonality: 0.8
    },
    difficulty: 3,
    biodiversityTarget: 25,
    startingSpecies: ['oak_tree', 'deer', 'fox', 'eagle', 'mushroom', 'bacteria'],
    challengeDescription: 'Adapt to strong seasonal changes affecting all species.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #FF8C00 40%, #8B4513 100%)',
    icon: '🍂',
    unlockLevel: 3
  },
  {
    id: 'river',
    name: 'River Ecosystem',
    description: 'Flowing freshwater system connecting ecosystems.',
    climate: {
      temperature: 16,
      precipitation: 900,
      humidity: 0.8,
      seasonality: 0.4
    },
    difficulty: 3,
    biodiversityTarget: 17,
    startingSpecies: ['phytoplankton', 'zooplankton', 'salmon', 'eagle', 'bacteria'],
    challengeDescription: 'Maintain water quality and migratory fish populations.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #4682B4 50%, #2F4F4F 100%)',
    icon: '🏞️',
    unlockLevel: 4
  },
  {
    id: 'woodland',
    name: 'Mixed Woodland',
    description: 'Transition zone between grassland and forest.',
    climate: {
      temperature: 14,
      precipitation: 700,
      humidity: 0.65,
      seasonality: 0.5
    },
    difficulty: 2,
    biodiversityTarget: 21,
    startingSpecies: ['oak_tree', 'grass', 'deer', 'rabbit', 'fox', 'hawk', 'mushroom', 'bacteria'],
    challengeDescription: 'Balance forest and grassland species in edge habitat.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #6B8E23 50%, #556B2F 100%)',
    icon: '🌲',
    unlockLevel: 2
  },
  {
    id: 'semi_arid',
    name: 'Semi-Arid Shrubland',
    description: 'Dry ecosystem with scattered vegetation.',
    climate: {
      temperature: 22,
      precipitation: 300,
      humidity: 0.35,
      seasonality: 0.4
    },
    difficulty: 3,
    biodiversityTarget: 14,
    startingSpecies: ['cactus', 'bacteria'],
    challengeDescription: 'Limited water makes every species introduction critical.',
    backgroundGradient: 'linear-gradient(to bottom, #F0E68C 0%, #D2B48C 50%, #A0522D 100%)',
    icon: '🏜️',
    unlockLevel: 4
  },
  {
    id: 'lake',
    name: 'Freshwater Lake',
    description: 'Standing water body with distinct zones.',
    climate: {
      temperature: 17,
      precipitation: 800,
      humidity: 0.75,
      seasonality: 0.5
    },
    difficulty: 2,
    biodiversityTarget: 16,
    startingSpecies: ['phytoplankton', 'zooplankton', 'bacteria'],
    challengeDescription: 'Prevent algae blooms while maintaining fish populations.',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #4682B4 60%, #191970 100%)',
    icon: '🏞️',
    unlockLevel: 2
  },
  {
    id: 'ocean',
    name: 'Open Ocean',
    description: 'Vast pelagic zone far from land.',
    climate: {
      temperature: 20,
      precipitation: 0,
      humidity: 1.0,
      seasonality: 0.2
    },
    difficulty: 4,
    biodiversityTarget: 15,
    startingSpecies: ['phytoplankton', 'zooplankton', 'bacteria'],
    challengeDescription: 'Manage the foundation of marine food webs.',
    backgroundGradient: 'linear-gradient(to bottom, #1E90FF 0%, #0047AB 50%, #000080 100%)',
    icon: '🌊',
    unlockLevel: 7
  },
  {
    id: 'urban_park',
    name: 'Urban Park',
    description: 'Human-modified ecosystem in city setting.',
    climate: {
      temperature: 16,
      precipitation: 700,
      humidity: 0.6,
      seasonality: 0.4
    },
    difficulty: 5,
    biodiversityTarget: 13,
    startingSpecies: ['grass', 'bacteria'],
    challengeDescription: 'Balance nature with human impact and invasive species.',
    backgroundGradient: 'linear-gradient(to bottom, #B0C4DE 0%, #90EE90 40%, #708090 100%)',
    icon: '🏙️',
    unlockLevel: 9
  }
];

export const getBiomeById = (id: string): Biome | undefined => {
  return BIOMES_DATA.find(biome => biome.id === id);
};

export const getBiomesByDifficulty = (difficulty: number): Biome[] => {
  return BIOMES_DATA.filter(biome => biome.difficulty === difficulty);
};

export const getUnlockedBiomes = (playerLevel: number): Biome[] => {
  return BIOMES_DATA.filter(biome => biome.unlockLevel <= playerLevel);
};

export const getBiomesForClimate = (temperature: number, precipitation: number): Biome[] => {
  return BIOMES_DATA.filter(biome => {
    const tempDiff = Math.abs(biome.climate.temperature - temperature);
    const precipDiff = Math.abs(biome.climate.precipitation - precipitation);
    return tempDiff < 10 && precipDiff < 500;
  });
};
