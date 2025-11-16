import { Neuron, Synapse, NeurotransmitterType, neuronDisorders } from '../data/levels';

export interface Signal {
  id: string;
  fromNeuronId: string;
  toNeuronId: string;
  synapseId: string;
  strength: number;
  startTime: number;
  duration: number;
  neurotransmitter?: NeurotransmitterType;
  position: number; // 0 to 1, progress along synapse
}

export interface NeuronState {
  id: string;
  activationLevel: number;
  lastFiredTime: number;
  isRefractory: boolean;
  timesActivated: number;
}

export interface GameState {
  neurons: Map<string, NeuronState>;
  signals: Signal[];
  score: number;
  time: number;
  completed: boolean;
}

export class NeuralEngine {
  private neurons: Map<string, Neuron>;
  private synapses: Map<string, Synapse>;
  private neuronStates: Map<string, NeuronState>;
  private signals: Signal[];
  private score: number;
  private startTime: number;
  private signalIdCounter: number;

  constructor(neurons: Neuron[], synapses: Synapse[]) {
    this.neurons = new Map(neurons.map(n => [n.id, n]));
    this.synapses = new Map(synapses.map(s => [s.id, s]));
    this.neuronStates = new Map();
    this.signals = [];
    this.score = 0;
    this.startTime = Date.now();
    this.signalIdCounter = 0;

    // Initialize neuron states
    neurons.forEach(neuron => {
      this.neuronStates.set(neuron.id, {
        id: neuron.id,
        activationLevel: 0,
        lastFiredTime: -Infinity,
        isRefractory: false,
        timesActivated: 0
      });
    });
  }

  // Add a synapse to the network
  addSynapse(synapse: Synapse): void {
    this.synapses.set(synapse.id, synapse);
  }

  // Remove a synapse from the network
  removeSynapse(synapseId: string): void {
    this.synapses.delete(synapseId);
  }

  // Trigger an input neuron to fire
  activateInputNeuron(neuronId: string): void {
    const neuron = this.neurons.get(neuronId);
    if (!neuron || neuron.type !== 'input') return;

    this.fireNeuron(neuronId);
  }

  // Main update loop
  update(deltaTime: number): GameState {
    const currentTime = Date.now() - this.startTime;

    // Update all signals
    this.updateSignals(deltaTime, currentTime);

    // Check for neuron activation
    this.checkNeuronActivation(currentTime);

    // Update refractory periods
    this.updateRefractoryPeriods(currentTime);

    // Check for spontaneous firing
    this.checkSpontaneousFiring(currentTime);

    return this.getState();
  }

  private updateSignals(deltaTime: number, currentTime: number): void {
    const activeSignals: Signal[] = [];

    this.signals.forEach(signal => {
      const elapsed = currentTime - signal.startTime;
      const progress = Math.min(elapsed / signal.duration, 1);
      signal.position = progress;

      if (progress >= 1) {
        // Signal reached destination
        this.deliverSignal(signal);
      } else {
        activeSignals.push(signal);
      }
    });

    this.signals = activeSignals;
  }

  private deliverSignal(signal: Signal): void {
    const neuronState = this.neuronStates.get(signal.toNeuronId);
    if (!neuronState) return;

    // Add signal strength to neuron activation level
    neuronState.activationLevel += signal.strength;
  }

  private checkNeuronActivation(currentTime: number): void {
    this.neuronStates.forEach((state, neuronId) => {
      const neuron = this.neurons.get(neuronId);
      if (!neuron || state.isRefractory) return;

      const threshold = this.getEffectiveThreshold(neuron);

      if (state.activationLevel >= threshold) {
        this.fireNeuron(neuronId);
        state.activationLevel = 0; // Reset after firing
      } else {
        // Decay activation over time
        state.activationLevel *= 0.95;
      }
    });
  }

  private fireNeuron(neuronId: string): void {
    const neuron = this.neurons.get(neuronId);
    const state = this.neuronStates.get(neuronId);
    if (!neuron || !state) return;

    const currentTime = Date.now() - this.startTime;

    // Update state
    state.lastFiredTime = currentTime;
    state.isRefractory = true;
    state.timesActivated += 1;

    // Add score for activation
    this.addScore(neuron, 10);

    // Create signals for all outgoing synapses
    const outgoingSynapses = Array.from(this.synapses.values())
      .filter(s => s.from === neuronId);

    outgoingSynapses.forEach(synapse => {
      this.createSignal(synapse, currentTime);
    });
  }

  private createSignal(synapse: Synapse, currentTime: number): void {
    const fromNeuron = this.neurons.get(synapse.from);
    const toNeuron = this.neurons.get(synapse.to);
    if (!fromNeuron || !toNeuron) return;

    // Calculate signal strength based on synapse weight and neurotransmitter
    let strength = synapse.weight;
    let duration = this.calculateSignalDuration(fromNeuron, toNeuron);

    if (synapse.neurotransmitter) {
      const effect = this.applyNeurotransmitterEffect(
        synapse.neurotransmitter,
        strength,
        duration
      );
      strength = effect.strength;
      duration = effect.duration;
    }

    // Apply disorder effects
    if (fromNeuron.disorder === 'leaky') {
      strength *= 0.75;
    }

    const signal: Signal = {
      id: `signal_${this.signalIdCounter++}`,
      fromNeuronId: synapse.from,
      toNeuronId: synapse.to,
      synapseId: synapse.id,
      strength,
      startTime: currentTime,
      duration,
      neurotransmitter: synapse.neurotransmitter,
      position: 0
    };

    this.signals.push(signal);

    // Add score for dopamine pathways
    if (synapse.neurotransmitter === 'dopamine') {
      this.addScore(fromNeuron, 20);
    }
  }

  private calculateSignalDuration(from: Neuron, to: Neuron): number {
    // Calculate distance
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Base speed: 1 pixel per millisecond
    return distance;
  }

  private applyNeurotransmitterEffect(
    type: NeurotransmitterType,
    strength: number,
    duration: number
  ): { strength: number; duration: number } {
    switch (type) {
      case 'glutamate':
        return { strength: strength * 1.5, duration };
      case 'gaba':
        return { strength: -strength, duration }; // Inhibitory
      case 'dopamine':
        return { strength, duration }; // Bonus handled in scoring
      case 'serotonin':
        return { strength, duration: duration * 0.8 }; // Prevents decay
      case 'acetylcholine':
        return { strength: strength * 1.2, duration }; // Enables plasticity
      case 'norepinephrine':
        return { strength, duration: duration * 0.5 }; // Faster transmission
      default:
        return { strength, duration };
    }
  }

  private getEffectiveThreshold(neuron: Neuron): number {
    let threshold = neuron.threshold;

    if (neuron.disorder === 'hyperexcitable') {
      threshold *= 0.5;
    } else if (neuron.disorder === 'hypoactive') {
      threshold *= 1.5;
    }

    return threshold;
  }

  private updateRefractoryPeriods(currentTime: number): void {
    this.neuronStates.forEach((state, neuronId) => {
      if (!state.isRefractory) return;

      const neuron = this.neurons.get(neuronId);
      if (!neuron) return;

      let refractoryPeriod = neuron.refractory || 100; // Default 100ms

      if (neuron.disorder === 'prolongedRefractory') {
        refractoryPeriod = 2000;
      }

      if (currentTime - state.lastFiredTime >= refractoryPeriod) {
        state.isRefractory = false;
      }
    });
  }

  private checkSpontaneousFiring(currentTime: number): void {
    this.neurons.forEach((neuron, neuronId) => {
      if (neuron.disorder !== 'spontaneous') return;

      const state = this.neuronStates.get(neuronId);
      if (!state || state.isRefractory) return;

      // 1% chance per frame to fire spontaneously
      if (Math.random() < 0.01) {
        this.fireNeuron(neuronId);
      }
    });
  }

  private addScore(neuron: Neuron, baseScore: number): void {
    let scoreToAdd = baseScore;

    // Bonus for output neuron activation
    if (neuron.type === 'output') {
      scoreToAdd *= 5;
    }

    this.score += scoreToAdd;
  }

  // Get current game state
  getState(): GameState {
    return {
      neurons: new Map(this.neuronStates),
      signals: [...this.signals],
      score: this.score,
      time: Date.now() - this.startTime,
      completed: this.checkCompletion()
    };
  }

  private checkCompletion(): boolean {
    // Check if at least one output neuron has been activated
    let outputActivated = false;

    this.neurons.forEach(neuron => {
      if (neuron.type === 'output') {
        const state = this.neuronStates.get(neuron.id);
        if (state && state.timesActivated > 0) {
          outputActivated = true;
        }
      }
    });

    return outputActivated;
  }

  // Check if level constraints are met
  checkConstraints(
    constraints: any,
    playerSynapses: Synapse[]
  ): { met: boolean; violations: string[] } {
    const violations: string[] = [];

    // Check max synapses
    if (constraints.maxSynapses && playerSynapses.length > constraints.maxSynapses) {
      violations.push(`Too many synapses: ${playerSynapses.length}/${constraints.maxSynapses}`);
    }

    // Check required neurotransmitters
    if (constraints.requiredNeurotransmitters) {
      const usedNeurotransmitters = new Set(
        playerSynapses
          .map(s => s.neurotransmitter)
          .filter(n => n !== undefined)
      );

      constraints.requiredNeurotransmitters.forEach((required: string) => {
        if (!usedNeurotransmitters.has(required as NeurotransmitterType)) {
          violations.push(`Must use ${required}`);
        }
      });
    }

    // Check forbidden connections
    if (constraints.forbiddenConnections) {
      playerSynapses.forEach(synapse => {
        constraints.forbiddenConnections.forEach((forbidden: [string, string]) => {
          if (synapse.from === forbidden[0] && synapse.to === forbidden[1]) {
            violations.push(`Cannot connect ${forbidden[0]} to ${forbidden[1]}`);
          }
        });
      });
    }

    // Check required activations
    if (constraints.requiredActivations) {
      let outputActivations = 0;
      this.neurons.forEach(neuron => {
        if (neuron.type === 'output') {
          const state = this.neuronStates.get(neuron.id);
          if (state) {
            outputActivations += state.timesActivated;
          }
        }
      });

      if (outputActivations < constraints.requiredActivations) {
        violations.push(
          `Need ${constraints.requiredActivations} activations, got ${outputActivations}`
        );
      }
    }

    return {
      met: violations.length === 0,
      violations
    };
  }

  // Get neuron activation count
  getNeuronActivationCount(neuronId: string): number {
    const state = this.neuronStates.get(neuronId);
    return state ? state.timesActivated : 0;
  }

  // Get all signals
  getSignals(): Signal[] {
    return [...this.signals];
  }

  // Get score
  getScore(): number {
    return this.score;
  }

  // Reset the engine
  reset(): void {
    this.signals = [];
    this.score = 0;
    this.startTime = Date.now();
    this.signalIdCounter = 0;

    // Reset neuron states
    this.neuronStates.forEach(state => {
      state.activationLevel = 0;
      state.lastFiredTime = -Infinity;
      state.isRefractory = false;
      state.timesActivated = 0;
    });
  }
}
