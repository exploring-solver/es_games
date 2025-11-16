export type GameMode = 'puzzle' | 'speed' | 'multiplayer';

export type NeurotransmitterType =
  | 'glutamate'      // Excitatory - increases signal
  | 'gaba'           // Inhibitory - decreases signal
  | 'dopamine'       // Reward pathway - bonus points
  | 'serotonin'      // Stabilizer - prevents signal decay
  | 'acetylcholine'  // Learning - creates new pathways
  | 'norepinephrine'; // Speed - faster transmission

export interface Neurotransmitter {
  type: NeurotransmitterType;
  name: string;
  effect: string;
  color: string;
}

export interface NeuronDisorder {
  id: string;
  name: string;
  description: string;
  effect: string;
  visual: string;
}

export interface Neuron {
  id: string;
  x: number;
  y: number;
  type: 'input' | 'output' | 'hidden';
  threshold: number;
  refractory?: number; // Refractory period in ms
  disorder?: string;
}

export interface Synapse {
  id: string;
  from: string;
  to: string;
  weight: number;
  neurotransmitter?: NeurotransmitterType;
}

export interface LevelConstraints {
  maxSynapses?: number;
  requiredNeurotransmitters?: NeurotransmitterType[];
  forbiddenConnections?: string[][]; // [fromId, toId] pairs
  minPathLength?: number;
  maxPathLength?: number;
  timeLimit?: number; // For speed mode
  requiredActivations?: number; // How many times output must fire
}

export interface Level {
  id: number;
  name: string;
  brainRegion: string;
  gameMode: GameMode;
  description: string;
  concept: string;
  neurons: Neuron[];
  existingSynapses: Synapse[];
  constraints: LevelConstraints;
  disorders: NeuronDisorder[];
  availableNeurotransmitters: NeurotransmitterType[];
  targetScore: number;
  educationalTooltip: string;
}

export const neurotransmitters: Record<NeurotransmitterType, Neurotransmitter> = {
  glutamate: {
    type: 'glutamate',
    name: 'Glutamate',
    effect: 'Increases synaptic strength by 50%',
    color: '#F59E0B'
  },
  gaba: {
    type: 'gaba',
    name: 'GABA',
    effect: 'Inhibits signal transmission',
    color: '#6366F1'
  },
  dopamine: {
    type: 'dopamine',
    name: 'Dopamine',
    effect: '2x points for signals through this synapse',
    color: '#EC4899'
  },
  serotonin: {
    type: 'serotonin',
    name: 'Serotonin',
    effect: 'Prevents signal decay over distance',
    color: '#8B5CF6'
  },
  acetylcholine: {
    type: 'acetylcholine',
    name: 'Acetylcholine',
    effect: 'Enables synaptic plasticity',
    color: '#10B981'
  },
  norepinephrine: {
    type: 'norepinephrine',
    name: 'Norepinephrine',
    effect: 'Increases transmission speed by 100%',
    color: '#EF4444'
  }
};

export const neuronDisorders: Record<string, NeuronDisorder> = {
  hyperexcitable: {
    id: 'hyperexcitable',
    name: 'Hyperexcitable',
    description: 'Fires at 50% threshold',
    effect: 'Lower firing threshold',
    visual: 'pulse-fast'
  },
  hypoactive: {
    id: 'hypoactive',
    name: 'Hypoactive',
    description: 'Requires 150% threshold to fire',
    effect: 'Higher firing threshold',
    visual: 'dim'
  },
  leaky: {
    id: 'leaky',
    name: 'Leaky Membrane',
    description: 'Loses 25% signal strength',
    effect: 'Signal degradation',
    visual: 'flicker'
  },
  prolongedRefractory: {
    id: 'prolongedRefractory',
    name: 'Prolonged Refractory',
    description: 'Cannot fire again for 2 seconds',
    effect: 'Extended refractory period',
    visual: 'slow-pulse'
  },
  spontaneous: {
    id: 'spontaneous',
    name: 'Spontaneous Firing',
    description: 'Randomly fires without input',
    effect: 'Random activation',
    visual: 'sparkle'
  }
};

export const levels: Level[] = [
  // Cortex levels (1-5) - Introduction
  {
    id: 1,
    name: 'First Spark',
    brainRegion: 'cortex',
    gameMode: 'puzzle',
    description: 'Connect a single input neuron to an output neuron',
    concept: 'Basic neural connection and action potential',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 1
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate'],
    targetScore: 100,
    educationalTooltip: 'Action potentials are electrical signals that travel along neurons. They fire when the neuron reaches its threshold.'
  },
  {
    id: 2,
    name: 'Synaptic Gateway',
    brainRegion: 'cortex',
    gameMode: 'puzzle',
    description: 'Use an intermediate neuron to relay the signal',
    concept: 'Multi-neuron pathways and synaptic transmission',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 400, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 2,
      minPathLength: 2
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate'],
    targetScore: 200,
    educationalTooltip: 'Synapses are the junctions between neurons where neurotransmitters carry signals from one neuron to another.'
  },
  {
    id: 3,
    name: 'Threshold Challenge',
    brainRegion: 'cortex',
    gameMode: 'puzzle',
    description: 'Combine signals from two inputs to reach the threshold',
    concept: 'Summation and threshold potentials',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 400, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 3
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate'],
    targetScore: 300,
    educationalTooltip: 'Neurons sum inputs from multiple synapses. They only fire when the total input exceeds their threshold.'
  },
  {
    id: 4,
    name: 'Inhibition Introduction',
    brainRegion: 'cortex',
    gameMode: 'puzzle',
    description: 'Use GABA to prevent unwanted activation',
    concept: 'Excitatory vs inhibitory neurotransmission',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 400, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 400, y: 400, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 5,
      requiredNeurotransmitters: ['gaba']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'gaba'],
    targetScore: 400,
    educationalTooltip: 'GABA is the main inhibitory neurotransmitter. It reduces neuronal excitability, preventing unwanted signals.'
  },
  {
    id: 5,
    name: 'Speed Run',
    brainRegion: 'cortex',
    gameMode: 'speed',
    description: 'Complete the pathway in under 5 seconds',
    concept: 'Neural transmission speed',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 250, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 400, y: 300, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 550, y: 200, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 4,
      timeLimit: 5000
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'norepinephrine'],
    targetScore: 500,
    educationalTooltip: 'Norepinephrine increases alertness and signal transmission speed in the nervous system.'
  },

  // Hippocampus levels (6-10) - Memory and Plasticity
  {
    id: 6,
    name: 'Memory Formation',
    brainRegion: 'hippocampus',
    gameMode: 'puzzle',
    description: 'Create a pathway that strengthens with use',
    concept: 'Synaptic plasticity and long-term potentiation',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 4,
      requiredActivations: 3,
      requiredNeurotransmitters: ['acetylcholine']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'acetylcholine'],
    targetScore: 600,
    educationalTooltip: 'Acetylcholine is crucial for learning and memory. It enables synaptic plasticity - the strengthening of connections through repeated use.'
  },
  {
    id: 7,
    name: 'Pattern Recognition',
    brainRegion: 'hippocampus',
    gameMode: 'puzzle',
    description: 'Multiple inputs must converge to recognize the pattern',
    concept: 'Pattern completion and convergence',
    neurons: [
      { id: 'input1', x: 100, y: 150, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'input3', x: 100, y: 450, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 400, y: 300, type: 'hidden', threshold: 3 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 5
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'acetylcholine'],
    targetScore: 700,
    educationalTooltip: 'The hippocampus excels at pattern completion - reconstructing full memories from partial cues through convergent neural pathways.'
  },
  {
    id: 8,
    name: 'Leaky Memory',
    brainRegion: 'hippocampus',
    gameMode: 'puzzle',
    description: 'Work around a leaky neuron to preserve signal strength',
    concept: 'Signal degradation and compensation',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 300, type: 'hidden', threshold: 1, disorder: 'leaky' },
      { id: 'hidden2', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 5
    },
    disorders: [neuronDisorders.leaky],
    availableNeurotransmitters: ['glutamate', 'serotonin'],
    targetScore: 800,
    educationalTooltip: 'Serotonin helps stabilize neural signals and can compensate for signal degradation in damaged neurons.'
  },
  {
    id: 9,
    name: 'Spatial Navigation',
    brainRegion: 'hippocampus',
    gameMode: 'puzzle',
    description: 'Create a complex pathway representing a spatial map',
    concept: 'Place cells and spatial encoding',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 150, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 300, type: 'hidden', threshold: 2 },
      { id: 'hidden3', x: 300, y: 450, type: 'hidden', threshold: 1 },
      { id: 'hidden4', x: 500, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 8
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'acetylcholine'],
    targetScore: 900,
    educationalTooltip: 'Place cells in the hippocampus create cognitive maps of space. Different cells activate for different locations.'
  },
  {
    id: 10,
    name: 'Memory Consolidation',
    brainRegion: 'hippocampus',
    gameMode: 'speed',
    description: 'Rapidly form and strengthen memory pathways',
    concept: 'Memory consolidation timing',
    neurons: [
      { id: 'input1', x: 100, y: 250, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 350, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 6,
      timeLimit: 8000,
      requiredActivations: 2
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'acetylcholine', 'norepinephrine'],
    targetScore: 1000,
    educationalTooltip: 'Memory consolidation is the process of stabilizing memories after initial encoding. It requires repeated activation of neural pathways.'
  },

  // Cerebellum levels (11-15) - Motor Control and Timing
  {
    id: 11,
    name: 'Motor Precision',
    brainRegion: 'cerebellum',
    gameMode: 'puzzle',
    description: 'Balance excitatory and inhibitory signals for precise control',
    concept: 'Motor refinement through balanced neurotransmission',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 7,
      requiredNeurotransmitters: ['gaba', 'glutamate']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'gaba'],
    targetScore: 1100,
    educationalTooltip: 'The cerebellum uses precise excitatory and inhibitory balance to fine-tune motor movements.'
  },
  {
    id: 12,
    name: 'Timing Circuit',
    brainRegion: 'cerebellum',
    gameMode: 'puzzle',
    description: 'Create pathways with different signal delays',
    concept: 'Temporal processing and signal timing',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 250, y: 200, type: 'hidden', threshold: 1, refractory: 1000 },
      { id: 'hidden2', x: 250, y: 400, type: 'hidden', threshold: 1, refractory: 500 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 5
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate'],
    targetScore: 1200,
    educationalTooltip: 'The cerebellum processes timing with millisecond precision using neurons with different refractory periods.'
  },
  {
    id: 13,
    name: 'Hyperexcitable Challenge',
    brainRegion: 'cerebellum',
    gameMode: 'puzzle',
    description: 'Control a hyperexcitable neuron to prevent unwanted activation',
    concept: 'Managing neuronal excitability',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 1, disorder: 'hyperexcitable' },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 6
    },
    disorders: [neuronDisorders.hyperexcitable],
    availableNeurotransmitters: ['glutamate', 'gaba'],
    targetScore: 1300,
    educationalTooltip: 'Hyperexcitable neurons fire too easily. GABA can help regulate their activity and prevent unwanted signals.'
  },
  {
    id: 14,
    name: 'Parallel Processing',
    brainRegion: 'cerebellum',
    gameMode: 'puzzle',
    description: 'Use parallel pathways to process multiple signals simultaneously',
    concept: 'Parallel fiber organization',
    neurons: [
      { id: 'input1', x: 100, y: 150, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'input3', x: 100, y: 450, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 400, y: 150, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 400, y: 300, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 400, y: 450, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 3 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 6
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate'],
    targetScore: 1400,
    educationalTooltip: 'The cerebellum contains parallel fibers that process multiple motor signals simultaneously for coordinated movement.'
  },
  {
    id: 15,
    name: 'Motor Learning',
    brainRegion: 'cerebellum',
    gameMode: 'speed',
    description: 'Rapidly adapt and strengthen motor pathways',
    concept: 'Cerebellar learning and adaptation',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 6,
      timeLimit: 10000,
      requiredNeurotransmitters: ['acetylcholine']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'acetylcholine', 'norepinephrine'],
    targetScore: 1500,
    educationalTooltip: 'Motor learning in the cerebellum involves rapid synaptic plasticity to refine movements through practice.'
  },

  // Amygdala levels (16-20) - Emotion and Complex Processing
  {
    id: 16,
    name: 'Fear Response',
    brainRegion: 'amygdala',
    gameMode: 'puzzle',
    description: 'Rapid signal transmission for emergency response',
    concept: 'Fast emotional processing',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 400, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 200, type: 'output', threshold: 1 },
      { id: 'output2', x: 700, y: 400, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 3,
      requiredNeurotransmitters: ['norepinephrine']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'norepinephrine'],
    targetScore: 1600,
    educationalTooltip: 'The amygdala processes fear rapidly, triggering multiple response systems simultaneously through norepinephrine release.'
  },
  {
    id: 17,
    name: 'Emotional Memory',
    brainRegion: 'amygdala',
    gameMode: 'puzzle',
    description: 'Link emotional response with memory formation',
    concept: 'Emotional memory consolidation',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 300, type: 'hidden', threshold: 2 },
      { id: 'hidden2', x: 500, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 500, y: 400, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 2 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 7,
      requiredNeurotransmitters: ['dopamine']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'dopamine', 'acetylcholine'],
    targetScore: 1700,
    educationalTooltip: 'Dopamine released during emotional events strengthens memory formation, making emotional memories particularly vivid.'
  },
  {
    id: 18,
    name: 'Reward Pathway',
    brainRegion: 'amygdala',
    gameMode: 'puzzle',
    description: 'Maximize points through dopamine pathways',
    concept: 'Reward circuit activation',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 250, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 250, y: 400, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 400, y: 300, type: 'hidden', threshold: 2 },
      { id: 'hidden4', x: 550, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 7
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'dopamine'],
    targetScore: 1800,
    educationalTooltip: 'Dopamine pathways create reward signals that reinforce behaviors and learning.'
  },
  {
    id: 19,
    name: 'Spontaneous Activity',
    brainRegion: 'amygdala',
    gameMode: 'puzzle',
    description: 'Work around spontaneously firing neurons',
    concept: 'Managing spontaneous neural activity',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1, disorder: 'spontaneous' },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 6
    },
    disorders: [neuronDisorders.spontaneous],
    availableNeurotransmitters: ['glutamate', 'gaba', 'serotonin'],
    targetScore: 1900,
    educationalTooltip: 'Some neurons fire spontaneously. The brain uses inhibitory signals and stabilizers to prevent unwanted activation.'
  },
  {
    id: 20,
    name: 'Stress Response',
    brainRegion: 'amygdala',
    gameMode: 'speed',
    description: 'Rapidly activate multiple stress response pathways',
    concept: 'Multi-system stress activation',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 150, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 300, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 300, y: 450, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 150, type: 'output', threshold: 1 },
      { id: 'output2', x: 700, y: 300, type: 'output', threshold: 1 },
      { id: 'output3', x: 700, y: 450, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 6,
      timeLimit: 7000
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'norepinephrine'],
    targetScore: 2000,
    educationalTooltip: 'During stress, the amygdala rapidly activates multiple systems: hormonal, autonomic, and behavioral responses.'
  },

  // Prefrontal Cortex levels (21-25) - Advanced Challenges
  {
    id: 21,
    name: 'Executive Control',
    brainRegion: 'prefrontal',
    gameMode: 'puzzle',
    description: 'Inhibit some pathways while activating others',
    concept: 'Executive inhibition and selective attention',
    neurons: [
      { id: 'input1', x: 100, y: 200, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 400, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 150, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 300, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 300, y: 450, type: 'hidden', threshold: 1 },
      { id: 'hidden4', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 200, type: 'output', threshold: 1 },
      { id: 'output2', x: 700, y: 400, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 10,
      forbiddenConnections: [['input2', 'output2']]
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'gaba', 'dopamine'],
    targetScore: 2100,
    educationalTooltip: 'The prefrontal cortex excels at executive control - inhibiting unwanted responses while promoting goal-directed behavior.'
  },
  {
    id: 22,
    name: 'Working Memory',
    brainRegion: 'prefrontal',
    gameMode: 'puzzle',
    description: 'Maintain sustained activation across multiple neurons',
    concept: 'Working memory maintenance',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 1 },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 1 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 8,
      requiredActivations: 4,
      requiredNeurotransmitters: ['dopamine', 'serotonin']
    },
    disorders: [],
    availableNeurotransmitters: ['glutamate', 'dopamine', 'serotonin'],
    targetScore: 2200,
    educationalTooltip: 'Working memory depends on sustained neural activity in the prefrontal cortex, modulated by dopamine and serotonin.'
  },
  {
    id: 23,
    name: 'Decision Making',
    brainRegion: 'prefrontal',
    gameMode: 'puzzle',
    description: 'Balance multiple inputs to make the optimal choice',
    concept: 'Decision-making and value computation',
    neurons: [
      { id: 'input1', x: 100, y: 150, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'input3', x: 100, y: 450, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 300, y: 200, type: 'hidden', threshold: 2 },
      { id: 'hidden2', x: 300, y: 400, type: 'hidden', threshold: 2 },
      { id: 'hidden3', x: 500, y: 300, type: 'hidden', threshold: 1 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 10
    },
    disorders: [neuronDisorders.hypoactive],
    availableNeurotransmitters: ['glutamate', 'gaba', 'dopamine'],
    targetScore: 2300,
    educationalTooltip: 'Decision-making involves integrating multiple inputs and weighing their values to select the best action.'
  },
  {
    id: 24,
    name: 'Impulse Control',
    brainRegion: 'prefrontal',
    gameMode: 'puzzle',
    description: 'Delay activation using refractory periods and inhibition',
    concept: 'Impulse control mechanisms',
    neurons: [
      { id: 'input1', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 250, y: 200, type: 'hidden', threshold: 1, refractory: 2000 },
      { id: 'hidden2', x: 250, y: 400, type: 'hidden', threshold: 1, disorder: 'prolongedRefractory' },
      { id: 'hidden3', x: 400, y: 300, type: 'hidden', threshold: 1 },
      { id: 'hidden4', x: 550, y: 300, type: 'hidden', threshold: 2 },
      { id: 'output1', x: 700, y: 300, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 8
    },
    disorders: [neuronDisorders.prolongedRefractory],
    availableNeurotransmitters: ['glutamate', 'gaba', 'serotonin'],
    targetScore: 2400,
    educationalTooltip: 'Impulse control relies on the prefrontal cortex\'s ability to delay responses through inhibition and extended refractory periods.'
  },
  {
    id: 25,
    name: 'Master Network',
    brainRegion: 'prefrontal',
    gameMode: 'puzzle',
    description: 'Final challenge: Complex network with all concepts',
    concept: 'Integration of all neural network principles',
    neurons: [
      { id: 'input1', x: 100, y: 150, type: 'input', threshold: 1 },
      { id: 'input2', x: 100, y: 300, type: 'input', threshold: 1 },
      { id: 'input3', x: 100, y: 450, type: 'input', threshold: 1 },
      { id: 'hidden1', x: 250, y: 100, type: 'hidden', threshold: 1, disorder: 'hyperexcitable' },
      { id: 'hidden2', x: 250, y: 250, type: 'hidden', threshold: 2 },
      { id: 'hidden3', x: 250, y: 400, type: 'hidden', threshold: 1, disorder: 'leaky' },
      { id: 'hidden4', x: 250, y: 550, type: 'hidden', threshold: 1 },
      { id: 'hidden5', x: 400, y: 200, type: 'hidden', threshold: 2 },
      { id: 'hidden6', x: 400, y: 400, type: 'hidden', threshold: 2 },
      { id: 'hidden7', x: 550, y: 300, type: 'hidden', threshold: 3 },
      { id: 'output1', x: 700, y: 200, type: 'output', threshold: 1 },
      { id: 'output2', x: 700, y: 400, type: 'output', threshold: 1 }
    ],
    existingSynapses: [],
    constraints: {
      maxSynapses: 15,
      requiredNeurotransmitters: ['glutamate', 'gaba', 'dopamine', 'acetylcholine'],
      minPathLength: 4
    },
    disorders: [neuronDisorders.hyperexcitable, neuronDisorders.leaky],
    availableNeurotransmitters: ['glutamate', 'gaba', 'dopamine', 'serotonin', 'acetylcholine', 'norepinephrine'],
    targetScore: 2500,
    educationalTooltip: 'Neural networks in the brain combine all these principles: thresholds, inhibition, plasticity, timing, and complex pathways to create cognition.'
  }
];

export const getLevelById = (id: number): Level | undefined => {
  return levels.find(level => level.id === id);
};

export const getLevelsByBrainRegion = (brainRegion: string): Level[] => {
  return levels.filter(level => level.brainRegion === brainRegion);
};

export const getLevelsByGameMode = (gameMode: GameMode): Level[] => {
  return levels.filter(level => level.gameMode === gameMode);
};
