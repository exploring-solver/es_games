import { useState, useEffect, useCallback, useMemo } from 'react';
import { Species, SPECIES_DATA } from '../data/species';
import { PopulationData } from '../utils/populationModel';
import { GameState } from '../utils/ecologyEngine';

export interface PopulationTrend {
  speciesId: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  rate: number; // Percentage change per season
  historicalData: { season: number; population: number }[];
}

export interface FoodWebConnection {
  from: string; // Prey species ID
  to: string; // Predator species ID
  strength: number; // 0-1, how dependent predator is on this prey
}

export const usePopulationDynamics = (gameState: GameState) => {
  const [trends, setTrends] = useState<Map<string, PopulationTrend>>(new Map());
  const [foodWeb, setFoodWeb] = useState<FoodWebConnection[]>([]);

  // Calculate population trends
  const calculateTrends = useCallback(() => {
    const newTrends = new Map<string, PopulationTrend>();

    gameState.ecosystem.populations.forEach((popData, speciesId) => {
      // Get historical data for this species
      const historicalData = gameState.history
        .slice(-20) // Last 20 seasons
        .map((snapshot, index) => {
          const pop = snapshot.find(p => p.speciesId === speciesId);
          return {
            season: gameState.seasonCount - 20 + index,
            population: pop?.current || 0
          };
        });

      // Calculate trend
      if (historicalData.length >= 2) {
        const recent = historicalData.slice(-5);
        const older = historicalData.slice(-10, -5);

        const recentAvg = recent.reduce((sum, d) => sum + d.population, 0) / recent.length;
        const olderAvg = older.length > 0
          ? older.reduce((sum, d) => sum + d.population, 0) / older.length
          : recentAvg;

        const rate = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

        let trend: 'increasing' | 'decreasing' | 'stable';
        if (Math.abs(rate) < 5) {
          trend = 'stable';
        } else if (rate > 0) {
          trend = 'increasing';
        } else {
          trend = 'decreasing';
        }

        newTrends.set(speciesId, {
          speciesId,
          trend,
          rate,
          historicalData
        });
      }
    });

    setTrends(newTrends);
  }, [gameState.ecosystem.populations, gameState.history, gameState.seasonCount]);

  // Calculate food web connections
  const calculateFoodWeb = useCallback(() => {
    const connections: FoodWebConnection[] = [];

    gameState.ecosystem.populations.forEach((predatorPop, predatorId) => {
      const predator = SPECIES_DATA.find(s => s.id === predatorId);
      if (!predator || predator.diet.length === 0) return;

      predator.diet.forEach(preyId => {
        if (gameState.ecosystem.populations.has(preyId)) {
          // Calculate dependency strength
          const strength = 1 / predator.diet.length; // Equal dependency by default

          connections.push({
            from: preyId,
            to: predatorId,
            strength
          });
        }
      });
    });

    setFoodWeb(connections);
  }, [gameState.ecosystem.populations]);

  // Get predators for a species
  const getPredators = useCallback((speciesId: string): Species[] => {
    return SPECIES_DATA.filter(predator =>
      predator.diet.includes(speciesId) &&
      gameState.ecosystem.populations.has(predator.id)
    );
  }, [gameState.ecosystem.populations]);

  // Get prey for a species
  const getPrey = useCallback((speciesId: string): Species[] => {
    const predator = SPECIES_DATA.find(s => s.id === speciesId);
    if (!predator) return [];

    return SPECIES_DATA.filter(prey =>
      predator.diet.includes(prey.id) &&
      gameState.ecosystem.populations.has(prey.id)
    );
  }, [gameState.ecosystem.populations]);

  // Get species by trophic level
  const getByTrophicLevel = useCallback((level: string): Array<{ species: Species; population: PopulationData }> => {
    const result: Array<{ species: Species; population: PopulationData }> = [];

    gameState.ecosystem.populations.forEach((popData, speciesId) => {
      const species = SPECIES_DATA.find(s => s.id === speciesId);
      if (species && species.trophicLevel === level) {
        result.push({ species, population: popData });
      }
    });

    return result;
  }, [gameState.ecosystem.populations]);

  // Calculate total biomass by trophic level
  const biomassByTrophicLevel = useMemo(() => {
    const biomass = new Map<string, number>();

    gameState.ecosystem.populations.forEach((popData, speciesId) => {
      const species = SPECIES_DATA.find(s => s.id === speciesId);
      if (!species) return;

      const current = biomass.get(species.trophicLevel) || 0;
      biomass.set(species.trophicLevel, current + popData.current);
    });

    return biomass;
  }, [gameState.ecosystem.populations]);

  // Get population health indicator
  const getPopulationHealth = useCallback((speciesId: string): {
    status: 'thriving' | 'healthy' | 'stable' | 'declining' | 'critical';
    percentage: number;
  } => {
    const popData = gameState.ecosystem.populations.get(speciesId);
    const species = SPECIES_DATA.find(s => s.id === speciesId);

    if (!popData || !species) {
      return { status: 'critical', percentage: 0 };
    }

    const percentage = (popData.current / popData.carrying) * 100;

    if (percentage >= 80) {
      return { status: 'thriving', percentage };
    } else if (percentage >= 60) {
      return { status: 'healthy', percentage };
    } else if (percentage >= 40) {
      return { status: 'stable', percentage };
    } else if (percentage >= 20) {
      return { status: 'declining', percentage };
    } else {
      return { status: 'critical', percentage };
    }
  }, [gameState.ecosystem.populations]);

  // Predict future population
  const predictPopulation = useCallback((speciesId: string, seasonsAhead: number): number => {
    const trend = trends.get(speciesId);
    const popData = gameState.ecosystem.populations.get(speciesId);

    if (!trend || !popData) return 0;

    // Simple linear projection based on current trend
    const currentPop = popData.current;
    const ratePerSeason = trend.rate / 100;
    const predictedPop = currentPop * Math.pow(1 + ratePerSeason, seasonsAhead);

    // Constrain to carrying capacity
    return Math.min(predictedPop, popData.carrying);
  }, [trends, gameState.ecosystem.populations]);

  // Update calculations when ecosystem changes
  useEffect(() => {
    calculateTrends();
    calculateFoodWeb();
  }, [calculateTrends, calculateFoodWeb]);

  return {
    trends,
    foodWeb,
    biomassByTrophicLevel,
    getPredators,
    getPrey,
    getByTrophicLevel,
    getPopulationHealth,
    predictPopulation
  };
};
