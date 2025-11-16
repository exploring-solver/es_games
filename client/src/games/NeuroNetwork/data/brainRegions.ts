export interface BrainRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  backgroundColor: string;
  neuronColor: string;
  synapseColor: string;
  particleColor: string;
  difficulty: number;
  educationalInfo: string;
}

export const brainRegions: Record<string, BrainRegion> = {
  cortex: {
    id: 'cortex',
    name: 'Cerebral Cortex',
    description: 'The thinking center - responsible for conscious thought, decision making, and higher-order processing',
    color: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    neuronColor: '#A78BFA',
    synapseColor: '#C4B5FD',
    particleColor: '#DDD6FE',
    difficulty: 1,
    educationalInfo: 'The cortex is the outermost layer of the brain, containing billions of neurons organized in layers. It processes sensory information and controls voluntary movements.'
  },
  hippocampus: {
    id: 'hippocampus',
    name: 'Hippocampus',
    description: 'Memory formation center - converts short-term memories to long-term storage',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    neuronColor: '#34D399',
    synapseColor: '#6EE7B7',
    particleColor: '#A7F3D0',
    difficulty: 2,
    educationalInfo: 'The hippocampus is crucial for forming new memories and spatial navigation. Damage to this area can prevent new memory formation while leaving old memories intact.'
  },
  cerebellum: {
    id: 'cerebellum',
    name: 'Cerebellum',
    description: 'Motor control center - coordinates movement, balance, and precision',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    neuronColor: '#FBBF24',
    synapseColor: '#FCD34D',
    particleColor: '#FDE68A',
    difficulty: 2,
    educationalInfo: 'The cerebellum fine-tunes motor movements and maintains balance. It contains more neurons than the rest of the brain combined, packed in a small space.'
  },
  amygdala: {
    id: 'amygdala',
    name: 'Amygdala',
    description: 'Emotion center - processes fear, pleasure, and emotional memories',
    color: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    neuronColor: '#F87171',
    synapseColor: '#FCA5A5',
    particleColor: '#FECACA',
    difficulty: 3,
    educationalInfo: 'The amygdala plays a key role in processing emotions, especially fear responses. It helps form emotional memories and triggers fight-or-flight responses.'
  },
  prefrontal: {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    description: 'Executive function center - planning, decision making, personality',
    color: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    neuronColor: '#60A5FA',
    synapseColor: '#93C5FD',
    particleColor: '#DBEAFE',
    difficulty: 3,
    educationalInfo: 'The prefrontal cortex is responsible for executive functions: planning, reasoning, impulse control, and personality expression. It\'s the last brain region to fully mature.'
  },
  thalamus: {
    id: 'thalamus',
    name: 'Thalamus',
    description: 'Sensory relay station - routes sensory information to appropriate brain regions',
    color: '#EC4899',
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    neuronColor: '#F472B6',
    synapseColor: '#F9A8D4',
    particleColor: '#FCE7F3',
    difficulty: 4,
    educationalInfo: 'The thalamus acts as a relay station for sensory information, directing signals to the appropriate cortical areas for processing. Almost all sensory input passes through the thalamus.'
  },
  basalGanglia: {
    id: 'basalGanglia',
    name: 'Basal Ganglia',
    description: 'Habit formation center - motor control, procedural learning, routine behaviors',
    color: '#14B8A6',
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
    neuronColor: '#2DD4BF',
    synapseColor: '#5EEAD4',
    particleColor: '#99F6E4',
    difficulty: 4,
    educationalInfo: 'The basal ganglia are involved in forming habits, controlling voluntary movements, and procedural learning. They help automate frequently performed actions.'
  },
  brainstem: {
    id: 'brainstem',
    name: 'Brainstem',
    description: 'Life support center - controls breathing, heartbeat, and basic survival functions',
    color: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    neuronColor: '#818CF8',
    synapseColor: '#A5B4FC',
    particleColor: '#C7D2FE',
    difficulty: 5,
    educationalInfo: 'The brainstem controls vital life functions like breathing, heart rate, and sleep-wake cycles. It connects the brain to the spinal cord and operates mostly automatically.'
  }
};

export const getBrainRegionById = (id: string): BrainRegion => {
  return brainRegions[id] || brainRegions.cortex;
};

export const getBrainRegionsByDifficulty = (difficulty: number): BrainRegion[] => {
  return Object.values(brainRegions).filter(region => region.difficulty === difficulty);
};
