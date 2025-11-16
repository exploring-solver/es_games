export type EventType =
  | 'resource_spawn'
  | 'anomaly'
  | 'paradox_warning'
  | 'timeline_branch'
  | 'causality_violation'
  | 'temporal_storm'
  | 'wormhole_appear'
  | 'entropy_surge'
  | 'quantum_fluctuation';

export interface TimeEvent {
  id: string;
  type: EventType;
  name: string;
  description: string;
  timestamp: number;
  duration: number;
  effects: {
    energyDelta?: number;
    matterDelta?: number;
    informationDelta?: number;
    paradoxRisk?: number;
    timelineStability?: number;
  };
  visualEffect: {
    color: string;
    intensity: number;
    particles?: string;
  };
  probability: number; // 0-1
}

export const baseTimeEvents: TimeEvent[] = [
  {
    id: 'energy-surge',
    type: 'resource_spawn',
    name: 'Temporal Energy Surge',
    description: 'A burst of chronoton particles provides free energy',
    timestamp: 0,
    duration: 5,
    effects: {
      energyDelta: 25,
      timelineStability: -2,
    },
    visualEffect: {
      color: '#FFD700',
      intensity: 0.8,
      particles: 'sparkles',
    },
    probability: 0.3,
  },
  {
    id: 'matter-condenser',
    type: 'resource_spawn',
    name: 'Matter Condensation',
    description: 'Exotic matter crystallizes from the quantum foam',
    timestamp: 0,
    duration: 8,
    effects: {
      matterDelta: 30,
      energyDelta: -10,
    },
    visualEffect: {
      color: '#4169E1',
      intensity: 0.6,
      particles: 'crystals',
    },
    probability: 0.25,
  },
  {
    id: 'info-leak',
    type: 'resource_spawn',
    name: 'Information Leak',
    description: 'Data from another timeline bleeds through',
    timestamp: 0,
    duration: 6,
    effects: {
      informationDelta: 40,
      paradoxRisk: 0.1,
    },
    visualEffect: {
      color: '#00CED1',
      intensity: 0.7,
      particles: 'data-stream',
    },
    probability: 0.2,
  },
  {
    id: 'temporal-storm',
    type: 'temporal_storm',
    name: 'Temporal Storm',
    description: 'Chaotic fluctuations in the timestream make everything unpredictable',
    timestamp: 0,
    duration: 15,
    effects: {
      energyDelta: -20,
      matterDelta: -15,
      paradoxRisk: 0.3,
      timelineStability: -10,
    },
    visualEffect: {
      color: '#8B008B',
      intensity: 1.0,
      particles: 'lightning',
    },
    probability: 0.15,
  },
  {
    id: 'quantum-tunnel',
    type: 'wormhole_appear',
    name: 'Quantum Tunnel Opening',
    description: 'A temporary wormhole appears, offering a shortcut through time',
    timestamp: 0,
    duration: 10,
    effects: {
      energyDelta: -30,
      timelineStability: -5,
    },
    visualEffect: {
      color: '#FF1493',
      intensity: 0.9,
      particles: 'vortex',
    },
    probability: 0.18,
  },
  {
    id: 'causality-glitch',
    type: 'causality_violation',
    name: 'Causality Glitch',
    description: 'Effects happen before their causes - reality hiccups',
    timestamp: 0,
    duration: 7,
    effects: {
      paradoxRisk: 0.4,
      informationDelta: 20,
      timelineStability: -8,
    },
    visualEffect: {
      color: '#FF4500',
      intensity: 0.85,
      particles: 'glitch',
    },
    probability: 0.12,
  },
  {
    id: 'timeline-echo',
    type: 'anomaly',
    name: 'Timeline Echo',
    description: 'A ghost of a parallel timeline briefly overlaps with yours',
    timestamp: 0,
    duration: 12,
    effects: {
      informationDelta: 35,
      paradoxRisk: 0.15,
      timelineStability: -3,
    },
    visualEffect: {
      color: '#9370DB',
      intensity: 0.5,
      particles: 'echo-waves',
    },
    probability: 0.22,
  },
  {
    id: 'entropy-well',
    type: 'entropy_surge',
    name: 'Entropy Well',
    description: 'A localized region where entropy increases rapidly',
    timestamp: 0,
    duration: 10,
    effects: {
      energyDelta: -40,
      matterDelta: -25,
      timelineStability: -6,
    },
    visualEffect: {
      color: '#696969',
      intensity: 0.7,
      particles: 'decay',
    },
    probability: 0.1,
  },
  {
    id: 'coherence-boost',
    type: 'anomaly',
    name: 'Quantum Coherence Boost',
    description: 'Timeline stability increases temporarily',
    timestamp: 0,
    duration: 20,
    effects: {
      timelineStability: 15,
      energyDelta: -15,
    },
    visualEffect: {
      color: '#00FF00',
      intensity: 0.6,
      particles: 'harmonics',
    },
    probability: 0.2,
  },
  {
    id: 'paradox-alarm',
    type: 'paradox_warning',
    name: 'Paradox Detection Alert',
    description: 'Your actions are creating dangerous paradoxes',
    timestamp: 0,
    duration: 5,
    effects: {
      paradoxRisk: 0.5,
    },
    visualEffect: {
      color: '#FF0000',
      intensity: 1.0,
      particles: 'warning-pulses',
    },
    probability: 0.08,
  },
  {
    id: 'retrocausal-wave',
    type: 'quantum_fluctuation',
    name: 'Retrocausal Wave',
    description: 'An effect from the future propagates backward in time',
    timestamp: 0,
    duration: 8,
    effects: {
      informationDelta: 50,
      paradoxRisk: 0.25,
      energyDelta: 15,
    },
    visualEffect: {
      color: '#00FFFF',
      intensity: 0.8,
      particles: 'reverse-flow',
    },
    probability: 0.14,
  },
  {
    id: 'tachyon-burst',
    type: 'quantum_fluctuation',
    name: 'Tachyon Burst',
    description: 'Faster-than-light particles shower through the timeline',
    timestamp: 0,
    duration: 4,
    effects: {
      energyDelta: 60,
      informationDelta: 30,
      paradoxRisk: 0.2,
    },
    visualEffect: {
      color: '#FFFF00',
      intensity: 1.0,
      particles: 'streak',
    },
    probability: 0.1,
  },
  {
    id: 'timeline-split',
    type: 'timeline_branch',
    name: 'Timeline Bifurcation',
    description: 'The timeline splits into two parallel branches',
    timestamp: 0,
    duration: 15,
    effects: {
      energyDelta: -50,
      matterDelta: -30,
      paradoxRisk: 0.35,
      timelineStability: -12,
    },
    visualEffect: {
      color: '#FF69B4',
      intensity: 0.9,
      particles: 'branching',
    },
    probability: 0.15,
  },
  {
    id: 'vacuum-fluctuation',
    type: 'quantum_fluctuation',
    name: 'Quantum Vacuum Fluctuation',
    description: 'Virtual particles briefly pop into existence',
    timestamp: 0,
    duration: 3,
    effects: {
      matterDelta: 20,
      energyDelta: -10,
    },
    visualEffect: {
      color: '#E6E6FA',
      intensity: 0.4,
      particles: 'pop',
    },
    probability: 0.35,
  },
  {
    id: 'causal-stabilizer',
    type: 'anomaly',
    name: 'Causal Stabilization Field',
    description: 'A field that reduces paradox risk temporarily',
    timestamp: 0,
    duration: 25,
    effects: {
      paradoxRisk: -0.3,
      timelineStability: 10,
      energyDelta: -20,
    },
    visualEffect: {
      color: '#20B2AA',
      intensity: 0.5,
      particles: 'shield',
    },
    probability: 0.12,
  },
];

export const generateRandomEvents = (
  timelineLength: number,
  eventCount: number
): TimeEvent[] => {
  const events: TimeEvent[] = [];
  const usedTimestamps = new Set<number>();

  for (let i = 0; i < eventCount; i++) {
    // Select random event template
    const template = baseTimeEvents[Math.floor(Math.random() * baseTimeEvents.length)];

    // Generate random timestamp
    let timestamp: number;
    do {
      timestamp = Math.floor(Math.random() * timelineLength);
    } while (usedTimestamps.has(timestamp));
    usedTimestamps.add(timestamp);

    // Check probability
    if (Math.random() > template.probability) {
      continue;
    }

    // Create event with randomized timestamp
    events.push({
      ...template,
      id: `${template.id}-${i}`,
      timestamp,
    });
  }

  return events.sort((a, b) => a.timestamp - b.timestamp);
};

export const getEventsByType = (events: TimeEvent[], type: EventType): TimeEvent[] => {
  return events.filter(e => e.type === type);
};

export const getActiveEvents = (events: TimeEvent[], currentTime: number): TimeEvent[] => {
  return events.filter(
    e => currentTime >= e.timestamp && currentTime < e.timestamp + e.duration
  );
};
