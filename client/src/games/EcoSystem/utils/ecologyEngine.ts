import { Species, SPECIES_DATA } from '../data/species';
import { Biome } from '../data/biomes';
import { EnvironmentalEvent, getRandomEvent } from '../data/events';
import {
  PopulationData,
  EcosystemState,
  calculateLogisticGrowth,
  calculatePredatorPreyDynamics,
  calculateEnergyFlow,
  calculateTemperatureStress,
  calculateWaterStress,
  calculateCompetition,
  calculateBiodiversity,
  calculateStability,
  calculateEvolution,
  isExtinctionRisk,
  calculateTrophicCascade
} from './populationModel';

export interface GameState {
  biome: Biome;
  ecosystem: EcosystemState;
  activeEvents: ActiveEvent[];
  history: PopulationData[][];
  score: number;
  playerLevel: number;
  availableSpecies: string[]; // Species player can introduce
  removedSpecies: string[]; // Extinct species
  seasonCount: number;
  gameMode: 'competitive' | 'coop' | 'sandbox';
  isGameOver: boolean;
  gameOverReason?: string;
}

export interface ActiveEvent {
  event: EnvironmentalEvent;
  remainingDuration: number;
  startSeason: number;
}

export interface SeasonResult {
  newState: GameState;
  changes: PopulationChange[];
  events: EventOccurrence[];
  extinctions: string[];
  achievements: Achievement[];
}

export interface PopulationChange {
  speciesId: string;
  speciesName: string;
  before: number;
  after: number;
  change: number;
  percentChange: number;
  reason: string;
}

export interface EventOccurrence {
  event: EnvironmentalEvent;
  isNew: boolean;
  message: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

/**
 * Initialize a new game
 */
export const initializeGame = (
  biome: Biome,
  gameMode: 'competitive' | 'coop' | 'sandbox'
): GameState => {
  const populations = new Map<string, PopulationData>();

  // Initialize starting species
  biome.startingSpecies.forEach(speciesId => {
    const species = SPECIES_DATA.find(s => s.id === speciesId);
    if (!species) return;

    populations.set(speciesId, {
      speciesId: species.id,
      current: species.basePopulation,
      carrying: species.carryingCapacity,
      growth: 0,
      deaths: 0,
      births: 0,
      predation: 0,
      starvation: 0
    });
  });

  const ecosystem: EcosystemState = {
    populations,
    season: 1,
    temperature: biome.climate.temperature,
    precipitation: biome.climate.precipitation,
    totalBiodiversity: calculateBiodiversity(populations, SPECIES_DATA),
    stability: 100
  };

  // Available species are those compatible with biome but not yet introduced
  const availableSpecies = SPECIES_DATA
    .filter(s =>
      s.habitat.includes(biome.id) &&
      !biome.startingSpecies.includes(s.id) &&
      !s.invasive
    )
    .map(s => s.id);

  return {
    biome,
    ecosystem,
    activeEvents: [],
    history: [],
    score: 0,
    playerLevel: 1,
    availableSpecies,
    removedSpecies: [],
    seasonCount: 1,
    gameMode,
    isGameOver: false
  };
};

/**
 * Process one season/turn of simulation
 */
export const processSeasonTick = (gameState: GameState): SeasonResult => {
  const changes: PopulationChange[] = [];
  const events: EventOccurrence[] = [];
  const extinctions: string[] = [];
  const achievements: Achievement[] = [];

  // 1. Apply seasonal temperature variation
  const seasonalTemp = applySeasonalVariation(
    gameState.biome.climate.temperature,
    gameState.seasonCount,
    gameState.biome.climate.seasonality
  );

  // 2. Check for new environmental events
  const newEvent = getRandomEvent(gameState.seasonCount, gameState.biome.id);
  if (newEvent) {
    gameState.activeEvents.push({
      event: newEvent,
      remainingDuration: newEvent.duration,
      startSeason: gameState.seasonCount
    });
    events.push({
      event: newEvent,
      isNew: true,
      message: `${newEvent.name}: ${newEvent.description}`
    });
  }

  // 3. Apply active event effects
  let eventTempModifier = 0;
  let eventPrecipModifier = 0;
  const eventSpeciesModifiers = new Map<string, number>();

  gameState.activeEvents = gameState.activeEvents.filter(activeEvent => {
    if (activeEvent.remainingDuration > 0) {
      // Apply effects
      if (activeEvent.event.effects.temperature) {
        eventTempModifier += activeEvent.event.effects.temperature;
      }
      if (activeEvent.event.effects.precipitation) {
        eventPrecipModifier += activeEvent.event.effects.precipitation;
      }
      if (activeEvent.event.effects.speciesImpact) {
        activeEvent.event.effects.speciesImpact.forEach(impact => {
          const current = eventSpeciesModifiers.get(impact.speciesId) || 1;
          eventSpeciesModifiers.set(impact.speciesId, current * impact.populationMultiplier);
        });
      }

      activeEvent.remainingDuration--;
      return true;
    }
    return false; // Remove completed events
  });

  const currentTemp = seasonalTemp + eventTempModifier;
  const currentPrecip = gameState.biome.climate.precipitation + eventPrecipModifier;

  // 4. Update each species population
  const newPopulations = new Map<string, PopulationData>();
  const currentPopMap = new Map<string, number>();

  // First pass: collect current populations
  gameState.ecosystem.populations.forEach((popData, speciesId) => {
    currentPopMap.set(speciesId, popData.current);
  });

  gameState.ecosystem.populations.forEach((popData, speciesId) => {
    const species = SPECIES_DATA.find(s => s.id === speciesId);
    if (!species) return;

    let population = popData.current;
    const before = population;

    // Calculate environmental stress
    const tempStress = calculateTemperatureStress(species, currentTemp);
    const waterStress = calculateWaterStress(species, currentPrecip);
    const environmentalStress = tempStress * waterStress;

    // Apply environmental mortality
    const environmentalDeaths = population * (1 - environmentalStress);
    population -= environmentalDeaths;

    // Calculate energy and starvation
    const { survivalRate } = calculateEnergyFlow(species, population, currentPopMap);
    const starvationDeaths = population * (1 - survivalRate);
    population -= starvationDeaths;

    // Calculate base growth
    const baseGrowth = calculateLogisticGrowth(
      population,
      species.growthRate,
      species.carryingCapacity
    );

    // Apply competition
    const competitionFactor = calculateCompetition(population, species.carryingCapacity);
    const actualGrowth = baseGrowth * competitionFactor;

    // Calculate births
    const births = actualGrowth;
    population += births;

    // Handle predation
    let predationLosses = 0;
    if (species.trophicLevel !== 'tertiary_consumer') {
      // Find predators
      SPECIES_DATA.forEach(predator => {
        if (predator.diet.includes(species.id)) {
          const predatorPop = currentPopMap.get(predator.id) || 0;
          if (predatorPop > 0) {
            const { predationLoss } = calculatePredatorPreyDynamics(
              population,
              predatorPop,
              0, // Already calculated growth
              0.5, // Predation rate
              0.3, // Predator efficiency
              0.1  // Predator death rate
            );
            predationLosses += predationLoss;
          }
        }
      });

      population = Math.max(0, population - predationLosses);
    }

    // Apply event-specific modifiers
    const eventModifier = eventSpeciesModifiers.get(speciesId) || 1;
    population = population * eventModifier;

    // Apply evolution over time
    if (gameState.seasonCount % 10 === 0 && environmentalStress < 0.8) {
      const { adaptedGrowthRate } = calculateEvolution(
        species,
        population,
        1 - environmentalStress,
        10
      );
      // Evolution increases growth slightly
      population += population * (adaptedGrowthRate - species.growthRate);
    }

    // Round and ensure non-negative
    population = Math.max(0, Math.round(population));

    // Check for extinction
    if (population === 0 && before > 0) {
      extinctions.push(species.name);
      gameState.removedSpecies.push(speciesId);
    }

    // Record change
    const change = population - before;
    const percentChange = before > 0 ? ((change / before) * 100) : 0;

    changes.push({
      speciesId,
      speciesName: species.name,
      before,
      after: population,
      change,
      percentChange,
      reason: determineChangeReason(change, environmentalStress, survivalRate, births, predationLosses)
    });

    // Update population data
    newPopulations.set(speciesId, {
      speciesId,
      current: population,
      carrying: species.carryingCapacity,
      growth: actualGrowth,
      deaths: environmentalDeaths + starvationDeaths,
      births,
      predation: predationLosses,
      starvation: starvationDeaths
    });
  });

  // 5. Calculate new metrics
  const newBiodiversity = calculateBiodiversity(newPopulations, SPECIES_DATA);
  const newHistory = [...gameState.history, Array.from(newPopulations.values())];
  const newStability = calculateStability(newHistory);

  // 6. Check achievements
  if (newBiodiversity > 500 && gameState.ecosystem.totalBiodiversity <= 500) {
    achievements.push({
      id: 'biodiversity_500',
      name: 'Biodiversity Champion',
      description: 'Reached 500 biodiversity points',
      icon: '🌿'
    });
  }

  if (newStability > 80 && gameState.seasonCount > 20) {
    achievements.push({
      id: 'stable_ecosystem',
      name: 'Balanced Ecosystem',
      description: 'Maintained 80+ stability for extended period',
      icon: '⚖️'
    });
  }

  // Check if all trophic levels present
  const trophicLevels = new Set<string>();
  newPopulations.forEach((pop, speciesId) => {
    const species = SPECIES_DATA.find(s => s.id === speciesId);
    if (species && pop.current > 0) {
      trophicLevels.add(species.trophicLevel);
    }
  });

  if (trophicLevels.size >= 4 && !gameState.score) {
    achievements.push({
      id: 'complete_food_web',
      name: 'Complete Food Web',
      description: 'Maintained all trophic levels',
      icon: '🕸️'
    });
  }

  // 7. Calculate score
  const scoreDelta = Math.round(
    newBiodiversity * 0.1 +
    newStability * 0.5 +
    newPopulations.size * 10
  );

  // 8. Check game over conditions
  let isGameOver = gameState.isGameOver;
  let gameOverReason = gameState.gameOverReason;

  if (newPopulations.size === 0) {
    isGameOver = true;
    gameOverReason = 'Total ecosystem collapse - all species extinct!';
  }

  if (newBiodiversity < 0) {
    isGameOver = true;
    gameOverReason = 'Biodiversity crisis - ecosystem unsustainable!';
  }

  // Win condition: reach biodiversity target
  if (newBiodiversity >= gameState.biome.biodiversityTarget * 100 && gameState.seasonCount >= 50) {
    isGameOver = true;
    gameOverReason = `Victory! You created a thriving ecosystem with ${newBiodiversity} biodiversity points!`;
  }

  // 9. Build new state
  const newState: GameState = {
    ...gameState,
    ecosystem: {
      populations: newPopulations,
      season: gameState.seasonCount + 1,
      temperature: currentTemp,
      precipitation: currentPrecip,
      totalBiodiversity: newBiodiversity,
      stability: newStability
    },
    history: newHistory,
    score: gameState.score + scoreDelta,
    seasonCount: gameState.seasonCount + 1,
    isGameOver,
    gameOverReason
  };

  return {
    newState,
    changes,
    events,
    extinctions,
    achievements
  };
};

/**
 * Add a species to the ecosystem
 */
export const introduceSpecies = (
  gameState: GameState,
  speciesId: string
): { success: boolean; message: string; newState?: GameState } => {
  const species = SPECIES_DATA.find(s => s.id === speciesId);

  if (!species) {
    return { success: false, message: 'Species not found' };
  }

  if (gameState.ecosystem.populations.has(speciesId)) {
    return { success: false, message: 'Species already present' };
  }

  if (!species.habitat.includes(gameState.biome.id) && !species.habitat.includes('all')) {
    return { success: false, message: 'Species not compatible with this biome' };
  }

  // Add species with base population
  const newPopulations = new Map(gameState.ecosystem.populations);
  newPopulations.set(speciesId, {
    speciesId: species.id,
    current: species.basePopulation,
    carrying: species.carryingCapacity,
    growth: 0,
    deaths: 0,
    births: 0,
    predation: 0,
    starvation: 0
  });

  const newBiodiversity = calculateBiodiversity(newPopulations, SPECIES_DATA);

  const newState: GameState = {
    ...gameState,
    ecosystem: {
      ...gameState.ecosystem,
      populations: newPopulations,
      totalBiodiversity: newBiodiversity
    },
    availableSpecies: gameState.availableSpecies.filter(id => id !== speciesId)
  };

  return {
    success: true,
    message: `${species.name} introduced successfully!`,
    newState
  };
};

/**
 * Remove a species from the ecosystem
 */
export const removeSpecies = (
  gameState: GameState,
  speciesId: string
): { success: boolean; message: string; newState?: GameState } => {
  const species = SPECIES_DATA.find(s => s.id === speciesId);

  if (!species) {
    return { success: false, message: 'Species not found' };
  }

  if (!gameState.ecosystem.populations.has(speciesId)) {
    return { success: false, message: 'Species not present in ecosystem' };
  }

  const newPopulations = new Map(gameState.ecosystem.populations);
  newPopulations.delete(speciesId);

  const newBiodiversity = calculateBiodiversity(newPopulations, SPECIES_DATA);

  const newState: GameState = {
    ...gameState,
    ecosystem: {
      ...gameState.ecosystem,
      populations: newPopulations,
      totalBiodiversity: newBiodiversity
    },
    removedSpecies: [...gameState.removedSpecies, speciesId],
    availableSpecies: [...gameState.availableSpecies, speciesId]
  };

  return {
    success: true,
    message: `${species.name} removed from ecosystem`,
    newState
  };
};

/**
 * Apply seasonal temperature variation
 */
const applySeasonalVariation = (
  baseTemp: number,
  season: number,
  seasonality: number
): number => {
  // Sinusoidal variation throughout the year
  const seasonPhase = (season % 12) / 12 * 2 * Math.PI;
  const variation = Math.sin(seasonPhase) * 10 * seasonality;
  return baseTemp + variation;
};

/**
 * Determine the primary reason for population change
 */
const determineChangeReason = (
  change: number,
  environmentalStress: number,
  survivalRate: number,
  births: number,
  predation: number
): string => {
  if (change === 0) return 'Stable';

  if (change > 0) {
    if (births > Math.abs(change) * 0.8) return 'High birth rate';
    if (environmentalStress > 0.9) return 'Favorable conditions';
    if (predation < 10) return 'Low predation';
    return 'Natural growth';
  } else {
    if (environmentalStress < 0.5) return 'Environmental stress';
    if (survivalRate < 0.6) return 'Starvation';
    if (predation > Math.abs(change) * 0.5) return 'Predation';
    return 'Natural decline';
  }
};

/**
 * Get species at risk
 */
export const getSpeciesAtRisk = (gameState: GameState): Array<{
  species: Species;
  population: number;
  risk: string;
}> => {
  const atRisk: Array<{ species: Species; population: number; risk: string }> = [];

  gameState.ecosystem.populations.forEach((popData, speciesId) => {
    const species = SPECIES_DATA.find(s => s.id === speciesId);
    if (!species) return;

    const { risk } = isExtinctionRisk(popData.current, species);
    if (risk !== 'none') {
      atRisk.push({
        species,
        population: popData.current,
        risk
      });
    }
  });

  return atRisk;
};
