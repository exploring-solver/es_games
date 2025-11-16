import { Species } from '../data/species';

export interface PopulationData {
  speciesId: string;
  current: number;
  carrying: number;
  growth: number; // Current growth rate
  deaths: number; // Deaths this season
  births: number; // Births this season
  predation: number; // Lost to predators
  starvation: number; // Lost to lack of food
}

export interface EcosystemState {
  populations: Map<string, PopulationData>;
  season: number;
  temperature: number;
  precipitation: number;
  totalBiodiversity: number;
  stability: number; // 0-100
}

/**
 * Logistic growth model with carrying capacity
 * dN/dt = rN(1 - N/K)
 */
export const calculateLogisticGrowth = (
  currentPop: number,
  growthRate: number,
  carryingCapacity: number
): number => {
  if (currentPop <= 0) return 0;
  if (currentPop >= carryingCapacity) return 0;

  const growth = growthRate * currentPop * (1 - currentPop / carryingCapacity);
  return Math.max(0, growth);
};

/**
 * Lotka-Volterra predator-prey model
 * Prey: dX/dt = αX - βXY
 * Predator: dY/dt = δβXY - γY
 */
export const calculatePredatorPreyDynamics = (
  preyPop: number,
  predatorPop: number,
  preyGrowth: number,
  predationRate: number,
  predatorEfficiency: number,
  predatorDeath: number
): { preyChange: number; predatorChange: number; predationLoss: number } => {
  // Predation rate depends on both populations
  const predationLoss = predationRate * preyPop * predatorPop * 0.0001;

  // Prey change: growth minus predation
  const preyChange = preyGrowth - predationLoss;

  // Predator change: gain from eating prey minus natural death
  const predatorGain = predatorEfficiency * predationLoss;
  const predatorNaturalDeath = predatorDeath * predatorPop;
  const predatorChange = predatorGain - predatorNaturalDeath;

  return {
    preyChange,
    predatorChange,
    predationLoss
  };
};

/**
 * Calculate energy flow through the food web
 */
export const calculateEnergyFlow = (
  species: Species,
  population: number,
  preyPopulations: Map<string, number>
): { energyAvailable: number; energyNeeded: number; survivalRate: number } => {
  const energyNeeded = species.energyRequirement * population;

  let energyAvailable = 0;

  // Producers get energy from sun
  if (species.trophicLevel === 'producer') {
    energyAvailable = Infinity; // Unlimited solar energy
  }
  // Consumers get energy from prey
  else if (species.diet.length > 0) {
    species.diet.forEach(preyId => {
      const preyPop = preyPopulations.get(preyId) || 0;
      // Can potentially consume up to 10% of prey population
      const availablePreyEnergy = preyPop * 0.1;
      energyAvailable += availablePreyEnergy;
    });
  }
  // Decomposers get energy from dead matter
  else if (species.trophicLevel === 'decomposer') {
    energyAvailable = Infinity; // Always organic matter
  }

  // Survival rate based on energy availability
  const survivalRate = energyNeeded > 0
    ? Math.min(1, energyAvailable / energyNeeded)
    : 1;

  return {
    energyAvailable,
    energyNeeded,
    survivalRate
  };
};

/**
 * Temperature stress on species
 */
export const calculateTemperatureStress = (
  species: Species,
  currentTemp: number
): number => {
  const [minTemp, maxTemp] = species.temperatureRange;
  const optimalTemp = (minTemp + maxTemp) / 2;

  // Outside tolerance range = death
  if (currentTemp < minTemp || currentTemp > maxTemp) {
    return 0.2; // 80% die
  }

  // Calculate stress as distance from optimal
  const tempDiff = Math.abs(currentTemp - optimalTemp);
  const tolerance = (maxTemp - minTemp) / 2;
  const stress = tempDiff / tolerance;

  // Survival rate: 100% at optimal, decreasing with stress
  return Math.max(0.5, 1 - stress * 0.5);
};

/**
 * Water availability stress
 */
export const calculateWaterStress = (
  species: Species,
  currentPrecipitation: number
): number => {
  const waterNeed = species.waterRequirement;

  // High water requirement species suffer in drought
  if (currentPrecipitation < 300 && waterNeed > 0.7) {
    return 0.6; // 40% die
  }

  if (currentPrecipitation < 500 && waterNeed > 0.5) {
    return 0.8;
  }

  return 1.0; // No stress
};

/**
 * Calculate competition within trophic level
 */
export const calculateCompetition = (
  currentPop: number,
  carryingCapacity: number
): number => {
  if (currentPop <= carryingCapacity * 0.5) {
    return 1.0; // No competition
  }

  // Competition intensifies as population approaches carrying capacity
  const ratio = currentPop / carryingCapacity;
  return Math.max(0.5, 1 - (ratio - 0.5));
};

/**
 * Calculate biodiversity score
 */
export const calculateBiodiversity = (
  populations: Map<string, PopulationData>,
  allSpecies: Species[]
): number => {
  let biodiversityScore = 0;

  populations.forEach((pop, speciesId) => {
    const species = allSpecies.find(s => s.id === speciesId);
    if (!species || pop.current <= 0) return;

    // Add base biodiversity value
    biodiversityScore += species.biodiversityValue;

    // Bonus for healthy populations (50-80% of carrying capacity)
    const healthRatio = pop.current / pop.carrying;
    if (healthRatio >= 0.5 && healthRatio <= 0.8) {
      biodiversityScore += species.biodiversityValue * 0.2;
    }

    // Bonus for endangered species survival
    if (species.endangered && pop.current > species.basePopulation) {
      biodiversityScore += 50;
    }

    // Penalty for invasive species
    if (species.invasive) {
      biodiversityScore += species.biodiversityValue; // Already negative
    }
  });

  // Bonus for trophic level diversity (complete food web)
  const trophicLevels = new Set<string>();
  populations.forEach((pop, speciesId) => {
    const species = allSpecies.find(s => s.id === speciesId);
    if (species && pop.current > 0) {
      trophicLevels.add(species.trophicLevel);
    }
  });

  // Bonus for having all trophic levels
  if (trophicLevels.size >= 4) {
    biodiversityScore += 100;
  }

  return Math.max(0, biodiversityScore);
};

/**
 * Calculate ecosystem stability (0-100)
 * Higher stability = less population fluctuations
 */
export const calculateStability = (
  populationHistory: PopulationData[][],
  timeWindow: number = 10
): number => {
  if (populationHistory.length < 2) return 100;

  const recentHistory = populationHistory.slice(-timeWindow);
  let totalVariance = 0;
  let speciesCount = 0;

  // Calculate variance for each species
  const speciesIds = new Set<string>();
  recentHistory.forEach(snapshot => {
    snapshot.forEach(pop => speciesIds.add(pop.speciesId));
  });

  speciesIds.forEach(speciesId => {
    const populations = recentHistory
      .map(snapshot => snapshot.find(p => p.speciesId === speciesId)?.current || 0);

    if (populations.length < 2) return;

    const mean = populations.reduce((sum, val) => sum + val, 0) / populations.length;
    const variance = populations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / populations.length;

    // Coefficient of variation (CV)
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    totalVariance += cv;
    speciesCount++;
  });

  if (speciesCount === 0) return 0;

  const averageCV = totalVariance / speciesCount;

  // Convert CV to stability score (lower CV = higher stability)
  // CV of 0 = 100 stability, CV of 1 = 0 stability
  const stability = Math.max(0, Math.min(100, (1 - averageCV) * 100));

  return stability;
};

/**
 * Simulate evolution/adaptation over time
 */
export const calculateEvolution = (
  species: Species,
  currentPop: number,
  environmentalPressure: number,
  generations: number
): { adaptedGrowthRate: number; adaptedResilience: number } => {
  // Evolution is faster with:
  // 1. Higher evolution potential
  // 2. Stronger environmental pressure
  // 3. More generations (time)

  const evolutionFactor = species.evolutionPotential * environmentalPressure * generations * 0.01;

  const adaptedGrowthRate = species.growthRate * (1 + evolutionFactor * 0.1);
  const adaptedResilience = Math.min(1, species.resilience + evolutionFactor * 0.05);

  return {
    adaptedGrowthRate,
    adaptedResilience
  };
};

/**
 * Check for extinction risk
 */
export const isExtinctionRisk = (
  currentPop: number,
  species: Species
): { risk: 'none' | 'low' | 'medium' | 'high' | 'critical'; threshold: number } => {
  const criticalThreshold = species.basePopulation * 0.1;
  const highThreshold = species.basePopulation * 0.25;
  const mediumThreshold = species.basePopulation * 0.5;
  const lowThreshold = species.basePopulation * 0.75;

  if (currentPop <= 0) {
    return { risk: 'critical', threshold: 0 };
  } else if (currentPop <= criticalThreshold) {
    return { risk: 'critical', threshold: criticalThreshold };
  } else if (currentPop <= highThreshold) {
    return { risk: 'high', threshold: highThreshold };
  } else if (currentPop <= mediumThreshold) {
    return { risk: 'medium', threshold: mediumThreshold };
  } else if (currentPop <= lowThreshold) {
    return { risk: 'low', threshold: lowThreshold };
  }

  return { risk: 'none', threshold: species.carryingCapacity };
};

/**
 * Calculate trophic cascade effect
 * When a keystone species changes, it affects entire food web
 */
export const calculateTrophicCascade = (
  species: Species,
  populationChange: number,
  allSpecies: Species[],
  currentPopulations: Map<string, number>
): Map<string, number> => {
  const cascadeEffects = new Map<string, number>();

  // Predators affected by prey population change
  if (populationChange !== 0) {
    allSpecies.forEach(predator => {
      if (predator.diet.includes(species.id)) {
        // Prey increase -> predators increase (with delay)
        // Prey decrease -> predators decrease
        const effect = populationChange * 0.1;
        cascadeEffects.set(predator.id, effect);
      }
    });

    // Prey affected by predator population change
    if (species.diet.length > 0) {
      species.diet.forEach(preyId => {
        // Predator increase -> prey decrease
        // Predator decrease -> prey increase
        const effect = -populationChange * 0.15;
        cascadeEffects.set(preyId, effect);
      });
    }
  }

  return cascadeEffects;
};
