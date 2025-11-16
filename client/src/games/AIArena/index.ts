export { default } from './AIArena';
export { default as AIArena } from './AIArena';
export { scenarios, getScenarioById, getScenariosByDifficulty, getScenariosByType } from './data/scenarios';
export { presetArchitectures, getArchitectureById, createCustomArchitecture } from './data/architectures';
export type { Scenario, ScenarioType } from './data/scenarios';
export type { NetworkArchitecture, LayerConfig, ActivationFunction } from './data/architectures';
