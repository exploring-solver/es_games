export type EventType = 'disaster' | 'disease' | 'climate' | 'human' | 'beneficial';

export interface EnvironmentalEvent {
  id: string;
  name: string;
  type: EventType;
  description: string;
  duration: number; // Seasons
  probability: number; // 0-1
  severity: number; // 1-5
  effects: {
    temperature?: number; // Change in degrees
    precipitation?: number; // Change in mm
    speciesImpact?: {
      speciesId: string;
      populationMultiplier: number; // 0.5 = 50% reduction, 2.0 = double
    }[];
    trophicLevelImpact?: {
      level: string;
      populationMultiplier: number;
    }[];
    biodiversityChange?: number;
  };
  canPrevent: boolean;
  preventionCost?: number; // Biodiversity points
  icon: string;
  educationalInfo: string;
}

export const ENVIRONMENTAL_EVENTS: EnvironmentalEvent[] = [
  // DISASTERS
  {
    id: 'drought',
    name: 'Severe Drought',
    type: 'disaster',
    description: 'Prolonged dry period causing water scarcity.',
    duration: 3,
    probability: 0.15,
    severity: 4,
    effects: {
      precipitation: -400,
      temperature: 5,
      trophicLevelImpact: [
        { level: 'producer', populationMultiplier: 0.4 },
        { level: 'primary_consumer', populationMultiplier: 0.6 }
      ]
    },
    canPrevent: false,
    icon: '☀️',
    educationalInfo: 'Droughts are natural but increasing due to climate change. They cascade through food webs from bottom up.'
  },
  {
    id: 'flood',
    name: 'Major Flooding',
    type: 'disaster',
    description: 'Heavy rainfall causes widespread flooding.',
    duration: 2,
    probability: 0.12,
    severity: 3,
    effects: {
      precipitation: 800,
      temperature: -2,
      speciesImpact: [
        { speciesId: 'rabbit', populationMultiplier: 0.5 },
        { speciesId: 'fox', populationMultiplier: 0.7 },
        { speciesId: 'phytoplankton', populationMultiplier: 1.5 }
      ]
    },
    canPrevent: false,
    icon: '🌊',
    educationalInfo: 'Floods can destroy terrestrial habitats but boost aquatic ecosystems temporarily.'
  },
  {
    id: 'wildfire',
    name: 'Wildfire',
    type: 'disaster',
    description: 'Uncontrolled fire sweeps through the ecosystem.',
    duration: 1,
    probability: 0.08,
    severity: 5,
    effects: {
      temperature: 10,
      precipitation: -100,
      trophicLevelImpact: [
        { level: 'producer', populationMultiplier: 0.2 },
        { level: 'primary_consumer', populationMultiplier: 0.3 },
        { level: 'secondary_consumer', populationMultiplier: 0.4 }
      ],
      biodiversityChange: -100
    },
    canPrevent: true,
    preventionCost: 50,
    icon: '🔥',
    educationalInfo: 'While devastating, some ecosystems depend on periodic fires for regeneration.'
  },
  {
    id: 'hurricane',
    name: 'Hurricane',
    type: 'disaster',
    description: 'Powerful storm with extreme winds and rain.',
    duration: 1,
    probability: 0.06,
    severity: 4,
    effects: {
      precipitation: 500,
      temperature: -3,
      speciesImpact: [
        { speciesId: 'oak_tree', populationMultiplier: 0.6 },
        { speciesId: 'deer', populationMultiplier: 0.7 },
        { speciesId: 'eagle', populationMultiplier: 0.5 }
      ]
    },
    canPrevent: false,
    icon: '🌀',
    educationalInfo: 'Hurricanes are natural disturbances that can actually increase long-term biodiversity.'
  },
  {
    id: 'blizzard',
    name: 'Extreme Blizzard',
    type: 'disaster',
    description: 'Severe winter storm with heavy snow.',
    duration: 2,
    probability: 0.1,
    severity: 3,
    effects: {
      temperature: -15,
      precipitation: 200,
      trophicLevelImpact: [
        { level: 'primary_consumer', populationMultiplier: 0.6 },
        { level: 'secondary_consumer', populationMultiplier: 0.7 }
      ]
    },
    canPrevent: false,
    icon: '❄️',
    educationalInfo: 'Extreme cold tests survival adaptations and can cause population bottlenecks.'
  },
  {
    id: 'heatwave',
    name: 'Heat Wave',
    type: 'disaster',
    description: 'Extended period of abnormally high temperatures.',
    duration: 2,
    probability: 0.13,
    severity: 3,
    effects: {
      temperature: 8,
      precipitation: -200,
      speciesImpact: [
        { speciesId: 'salmon', populationMultiplier: 0.4 },
        { speciesId: 'kelp', populationMultiplier: 0.5 },
        { speciesId: 'phytoplankton', populationMultiplier: 0.7 }
      ]
    },
    canPrevent: false,
    icon: '🌡️',
    educationalInfo: 'Heat waves are becoming more frequent and longer due to climate change.'
  },

  // DISEASE
  {
    id: 'rabbit_disease',
    name: 'Rabbit Hemorrhagic Disease',
    type: 'disease',
    description: 'Viral disease spreading through rabbit populations.',
    duration: 2,
    probability: 0.1,
    severity: 3,
    effects: {
      speciesImpact: [
        { speciesId: 'rabbit', populationMultiplier: 0.3 }
      ]
    },
    canPrevent: true,
    preventionCost: 30,
    icon: '🦠',
    educationalInfo: 'Diseases often spread faster in dense populations, a natural population control.'
  },
  {
    id: 'white_nose_syndrome',
    name: 'White-Nose Syndrome',
    type: 'disease',
    description: 'Fungal disease affecting hibernating mammals.',
    duration: 3,
    probability: 0.08,
    severity: 4,
    effects: {
      speciesImpact: [
        { speciesId: 'bear', populationMultiplier: 0.4 }
      ]
    },
    canPrevent: true,
    preventionCost: 40,
    icon: '🦇',
    educationalInfo: 'This real fungal disease has devastated bat populations across North America.'
  },
  {
    id: 'avian_flu',
    name: 'Avian Influenza',
    type: 'disease',
    description: 'Highly contagious viral disease in birds.',
    duration: 2,
    probability: 0.09,
    severity: 3,
    effects: {
      speciesImpact: [
        { speciesId: 'hawk', populationMultiplier: 0.5 },
        { speciesId: 'eagle', populationMultiplier: 0.5 }
      ]
    },
    canPrevent: true,
    preventionCost: 35,
    icon: '🦅',
    educationalInfo: 'Bird diseases can jump between species and occasionally infect humans.'
  },
  {
    id: 'coral_bleaching',
    name: 'Coral Bleaching Event',
    type: 'disease',
    description: 'Corals expel symbiotic algae due to stress.',
    duration: 3,
    probability: 0.2,
    severity: 5,
    effects: {
      temperature: 3,
      biodiversityChange: -150
    },
    canPrevent: true,
    preventionCost: 80,
    icon: '🪸',
    educationalInfo: 'Caused by warming waters, bleaching threatens entire reef ecosystems.'
  },
  {
    id: 'tree_blight',
    name: 'Tree Blight',
    type: 'disease',
    description: 'Fungal infection killing mature trees.',
    duration: 4,
    probability: 0.07,
    severity: 4,
    effects: {
      speciesImpact: [
        { speciesId: 'oak_tree', populationMultiplier: 0.3 }
      ]
    },
    canPrevent: true,
    preventionCost: 45,
    icon: '🍂',
    educationalInfo: 'Dutch elm disease and chestnut blight have devastated American forests.'
  },

  // CLIMATE CHANGE
  {
    id: 'warming_trend',
    name: 'Climate Warming',
    type: 'climate',
    description: 'Long-term temperature increase affecting ecosystems.',
    duration: 5,
    probability: 0.25,
    severity: 4,
    effects: {
      temperature: 2,
      precipitation: -150,
      speciesImpact: [
        { speciesId: 'polar_bear', populationMultiplier: 0.6 },
        { speciesId: 'kelp', populationMultiplier: 0.7 },
        { speciesId: 'salmon', populationMultiplier: 0.7 }
      ]
    },
    canPrevent: true,
    preventionCost: 100,
    icon: '🌍',
    educationalInfo: 'Global warming is the defining environmental challenge of our era.'
  },
  {
    id: 'ocean_acidification',
    name: 'Ocean Acidification',
    type: 'climate',
    description: 'CO2 absorption making oceans more acidic.',
    duration: 6,
    probability: 0.15,
    severity: 5,
    effects: {
      speciesImpact: [
        { speciesId: 'phytoplankton', populationMultiplier: 0.6 },
        { speciesId: 'zooplankton', populationMultiplier: 0.7 }
      ],
      biodiversityChange: -80
    },
    canPrevent: true,
    preventionCost: 120,
    icon: '🌊',
    educationalInfo: 'Acidification threatens shell-forming organisms at the base of marine food webs.'
  },
  {
    id: 'permafrost_thaw',
    name: 'Permafrost Melting',
    type: 'climate',
    description: 'Frozen ground thawing, releasing stored carbon.',
    duration: 4,
    probability: 0.12,
    severity: 4,
    effects: {
      temperature: 3,
      biodiversityChange: -60
    },
    canPrevent: false,
    icon: '🧊',
    educationalInfo: 'Thawing permafrost creates a feedback loop, accelerating warming.'
  },
  {
    id: 'drought_intensification',
    name: 'Mega-Drought',
    type: 'climate',
    description: 'Multi-year drought unprecedented in modern history.',
    duration: 8,
    probability: 0.1,
    severity: 5,
    effects: {
      precipitation: -600,
      temperature: 4,
      trophicLevelImpact: [
        { level: 'producer', populationMultiplier: 0.3 },
        { level: 'primary_consumer', populationMultiplier: 0.4 }
      ]
    },
    canPrevent: true,
    preventionCost: 150,
    icon: '🏜️',
    educationalInfo: 'Climate change is making droughts more severe and longer-lasting.'
  },

  // HUMAN IMPACT
  {
    id: 'deforestation',
    name: 'Logging Activity',
    type: 'human',
    description: 'Trees cleared for timber or agriculture.',
    duration: 2,
    probability: 0.15,
    severity: 4,
    effects: {
      speciesImpact: [
        { speciesId: 'oak_tree', populationMultiplier: 0.4 }
      ],
      trophicLevelImpact: [
        { level: 'producer', populationMultiplier: 0.6 }
      ],
      biodiversityChange: -70
    },
    canPrevent: true,
    preventionCost: 60,
    icon: '🪓',
    educationalInfo: 'Deforestation destroys habitat and releases stored carbon into atmosphere.'
  },
  {
    id: 'overfishing',
    name: 'Commercial Overfishing',
    type: 'human',
    description: 'Fish harvested faster than they can reproduce.',
    duration: 3,
    probability: 0.18,
    severity: 4,
    effects: {
      speciesImpact: [
        { speciesId: 'salmon', populationMultiplier: 0.3 }
      ],
      biodiversityChange: -50
    },
    canPrevent: true,
    preventionCost: 70,
    icon: '🎣',
    educationalInfo: 'Overfishing has collapsed multiple fisheries and disrupted marine ecosystems.'
  },
  {
    id: 'pollution',
    name: 'Chemical Pollution',
    type: 'human',
    description: 'Toxic substances contaminating the ecosystem.',
    duration: 4,
    probability: 0.14,
    severity: 4,
    effects: {
      trophicLevelImpact: [
        { level: 'producer', populationMultiplier: 0.7 },
        { level: 'decomposer', populationMultiplier: 0.6 }
      ],
      biodiversityChange: -90
    },
    canPrevent: true,
    preventionCost: 80,
    icon: '☢️',
    educationalInfo: 'Pollutants bioaccumulate, affecting top predators most severely.'
  },
  {
    id: 'habitat_fragmentation',
    name: 'Habitat Fragmentation',
    type: 'human',
    description: 'Roads and development split ecosystems apart.',
    duration: 5,
    probability: 0.2,
    severity: 3,
    effects: {
      trophicLevelImpact: [
        { level: 'tertiary_consumer', populationMultiplier: 0.6 },
        { level: 'secondary_consumer', populationMultiplier: 0.7 }
      ],
      biodiversityChange: -60
    },
    canPrevent: true,
    preventionCost: 90,
    icon: '🛣️',
    educationalInfo: 'Fragmentation isolates populations, reducing genetic diversity and migration.'
  },
  {
    id: 'invasive_introduction',
    name: 'Invasive Species Introduction',
    type: 'human',
    description: 'Non-native species accidentally or intentionally introduced.',
    duration: 10,
    probability: 0.12,
    severity: 5,
    effects: {
      biodiversityChange: -120
    },
    canPrevent: true,
    preventionCost: 100,
    icon: '🚢',
    educationalInfo: 'Invasive species are one of the leading causes of extinction worldwide.'
  },

  // BENEFICIAL EVENTS
  {
    id: 'rainfall_blessing',
    name: 'Perfect Rainfall',
    type: 'beneficial',
    description: 'Ideal precipitation promoting growth.',
    duration: 2,
    probability: 0.15,
    severity: 1,
    effects: {
      precipitation: 200,
      trophicLevelImpact: [
        { level: 'producer', populationMultiplier: 1.3 }
      ],
      biodiversityChange: 20
    },
    canPrevent: false,
    icon: '🌧️',
    educationalInfo: 'Optimal conditions can trigger population booms throughout the food web.'
  },
  {
    id: 'migration_arrival',
    name: 'Beneficial Migration',
    type: 'beneficial',
    description: 'Migrating species arrive, boosting populations.',
    duration: 1,
    probability: 0.12,
    severity: 1,
    effects: {
      trophicLevelImpact: [
        { level: 'secondary_consumer', populationMultiplier: 1.2 }
      ],
      biodiversityChange: 30
    },
    canPrevent: false,
    icon: '🦅',
    educationalInfo: 'Migration connects ecosystems and increases genetic diversity.'
  },
  {
    id: 'mast_year',
    name: 'Mast Year (Abundant Seeds)',
    type: 'beneficial',
    description: 'Trees produce exceptional seed crops.',
    duration: 1,
    probability: 0.1,
    severity: 1,
    effects: {
      speciesImpact: [
        { speciesId: 'oak_tree', populationMultiplier: 1.5 }
      ],
      trophicLevelImpact: [
        { level: 'primary_consumer', populationMultiplier: 1.3 }
      ],
      biodiversityChange: 25
    },
    canPrevent: false,
    icon: '🌰',
    educationalInfo: 'Synchronized seed production overwhelms seed predators, ensuring regeneration.'
  },
  {
    id: 'upwelling',
    name: 'Ocean Upwelling',
    type: 'beneficial',
    description: 'Nutrient-rich deep water rises to surface.',
    duration: 2,
    probability: 0.1,
    severity: 1,
    effects: {
      speciesImpact: [
        { speciesId: 'phytoplankton', populationMultiplier: 2.0 },
        { speciesId: 'zooplankton', populationMultiplier: 1.5 }
      ],
      biodiversityChange: 40
    },
    canPrevent: false,
    icon: '🌊',
    educationalInfo: 'Upwelling zones are among the most productive ecosystems on Earth.'
  },
  {
    id: 'conservation_success',
    name: 'Conservation Intervention',
    type: 'beneficial',
    description: 'Successful habitat restoration and protection.',
    duration: 4,
    probability: 0.08,
    severity: 1,
    effects: {
      trophicLevelImpact: [
        { level: 'tertiary_consumer', populationMultiplier: 1.4 }
      ],
      biodiversityChange: 100
    },
    canPrevent: false,
    icon: '🌱',
    educationalInfo: 'Conservation efforts can reverse decline and restore ecosystem health.'
  },
  {
    id: 'predator_reintroduction',
    name: 'Apex Predator Return',
    type: 'beneficial',
    description: 'Top predators return, restoring balance.',
    duration: 3,
    probability: 0.06,
    severity: 1,
    effects: {
      speciesImpact: [
        { speciesId: 'wolf', populationMultiplier: 1.5 }
      ],
      biodiversityChange: 80
    },
    canPrevent: false,
    icon: '🐺',
    educationalInfo: 'Predator reintroduction can trigger trophic cascades, healing entire ecosystems.'
  }
];

export const getEventsByType = (type: EventType): EnvironmentalEvent[] => {
  return ENVIRONMENTAL_EVENTS.filter(event => event.type === type);
};

export const getRandomEvent = (currentSeason: number, biomeId: string): EnvironmentalEvent | null => {
  // Filter events that are appropriate for the current conditions
  const eligibleEvents = ENVIRONMENTAL_EVENTS.filter(event => {
    return Math.random() < event.probability;
  });

  if (eligibleEvents.length === 0) return null;

  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
};

export const getPreventableEvents = (): EnvironmentalEvent[] => {
  return ENVIRONMENTAL_EVENTS.filter(event => event.canPrevent);
};

export const getBeneficialEvents = (): EnvironmentalEvent[] => {
  return ENVIRONMENTAL_EVENTS.filter(event => event.type === 'beneficial');
};
