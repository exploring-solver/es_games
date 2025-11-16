import { Neuron, Synapse } from '../data/levels';

export interface PathNode {
  neuronId: string;
  from: string | null;
  cost: number;
  heuristic: number;
}

export interface Path {
  neurons: string[];
  synapses: string[];
  totalCost: number;
  isValid: boolean;
}

export class Pathfinder {
  private neurons: Map<string, Neuron>;
  private synapses: Map<string, Synapse>;
  private adjacencyList: Map<string, string[]>;

  constructor(neurons: Neuron[], synapses: Synapse[]) {
    this.neurons = new Map(neurons.map(n => [n.id, n]));
    this.synapses = new Map(synapses.map(s => [s.id, s]));
    this.adjacencyList = new Map();

    this.buildAdjacencyList(synapses);
  }

  private buildAdjacencyList(synapses: Synapse[]): void {
    // Initialize adjacency list
    this.neurons.forEach((_, neuronId) => {
      this.adjacencyList.set(neuronId, []);
    });

    // Build connections
    synapses.forEach(synapse => {
      const neighbors = this.adjacencyList.get(synapse.from);
      if (neighbors) {
        neighbors.push(synapse.to);
      }
    });
  }

  // Update adjacency list when synapses change
  updateSynapses(synapses: Synapse[]): void {
    this.synapses = new Map(synapses.map(s => [s.id, s]));
    this.buildAdjacencyList(synapses);
  }

  // Find shortest path using A* algorithm
  findPath(startId: string, goalId: string): Path {
    const start = this.neurons.get(startId);
    const goal = this.neurons.get(goalId);

    if (!start || !goal) {
      return {
        neurons: [],
        synapses: [],
        totalCost: Infinity,
        isValid: false
      };
    }

    const openSet = new Set<string>([startId]);
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    gScore.set(startId, 0);
    fScore.set(startId, this.heuristic(start, goal));

    while (openSet.size > 0) {
      // Get node with lowest fScore
      let current = this.getLowestFScore(openSet, fScore);

      if (current === goalId) {
        return this.reconstructPath(cameFrom, current, startId);
      }

      openSet.delete(current);
      closedSet.add(current);

      const neighbors = this.adjacencyList.get(current) || [];

      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue;

        const currentNeuron = this.neurons.get(current)!;
        const neighborNeuron = this.neurons.get(neighbor)!;
        const tentativeGScore =
          (gScore.get(current) || Infinity) +
          this.getCost(currentNeuron, neighborNeuron);

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        } else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) {
          continue;
        }

        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(
          neighbor,
          tentativeGScore + this.heuristic(neighborNeuron, goal)
        );
      }
    }

    return {
      neurons: [],
      synapses: [],
      totalCost: Infinity,
      isValid: false
    };
  }

  private getLowestFScore(
    openSet: Set<string>,
    fScore: Map<string, number>
  ): string {
    let lowest: string | null = null;
    let lowestScore = Infinity;

    openSet.forEach(nodeId => {
      const score = fScore.get(nodeId) || Infinity;
      if (score < lowestScore) {
        lowestScore = score;
        lowest = nodeId;
      }
    });

    return lowest!;
  }

  private reconstructPath(
    cameFrom: Map<string, string>,
    current: string,
    start: string
  ): Path {
    const neurons = [current];
    const synapses: string[] = [];

    while (cameFrom.has(current)) {
      const previous = cameFrom.get(current)!;
      neurons.unshift(previous);

      // Find synapse connecting previous to current
      const synapse = Array.from(this.synapses.values()).find(
        s => s.from === previous && s.to === current
      );
      if (synapse) {
        synapses.unshift(synapse.id);
      }

      current = previous;
    }

    // Calculate total cost
    let totalCost = 0;
    for (let i = 0; i < neurons.length - 1; i++) {
      const from = this.neurons.get(neurons[i])!;
      const to = this.neurons.get(neurons[i + 1])!;
      totalCost += this.getCost(from, to);
    }

    return {
      neurons,
      synapses,
      totalCost,
      isValid: true
    };
  }

  private heuristic(from: Neuron, to: Neuron): number {
    // Euclidean distance
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getCost(from: Neuron, to: Neuron): number {
    // Base cost is distance
    let cost = this.heuristic(from, to);

    // Add cost for neuron threshold (harder to activate = higher cost)
    cost += to.threshold * 10;

    // Add cost for disorders
    if (to.disorder === 'hypoactive') {
      cost += 50;
    } else if (to.disorder === 'leaky') {
      cost += 30;
    } else if (to.disorder === 'prolongedRefractory') {
      cost += 40;
    }

    return cost;
  }

  // Find all paths from inputs to outputs
  findAllPaths(maxLength: number = 10): Path[] {
    const paths: Path[] = [];
    const inputs: string[] = [];
    const outputs: string[] = [];

    this.neurons.forEach((neuron, id) => {
      if (neuron.type === 'input') inputs.push(id);
      if (neuron.type === 'output') outputs.push(id);
    });

    inputs.forEach(input => {
      outputs.forEach(output => {
        const path = this.findPath(input, output);
        if (path.isValid && path.neurons.length <= maxLength) {
          paths.push(path);
        }
      });
    });

    return paths;
  }

  // Check if there's any path from inputs to outputs
  hasValidPath(): boolean {
    const inputs: string[] = [];
    const outputs: string[] = [];

    this.neurons.forEach((neuron, id) => {
      if (neuron.type === 'input') inputs.push(id);
      if (neuron.type === 'output') outputs.push(id);
    });

    for (const input of inputs) {
      for (const output of outputs) {
        const path = this.findPath(input, output);
        if (path.isValid) return true;
      }
    }

    return false;
  }

  // Find reachable neurons from a starting neuron
  findReachableNeurons(startId: string): Set<string> {
    const reachable = new Set<string>();
    const queue: string[] = [startId];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      reachable.add(current);

      const neighbors = this.adjacencyList.get(current) || [];
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      });
    }

    return reachable;
  }

  // Check if adding a synapse would create a cycle
  wouldCreateCycle(fromId: string, toId: string): boolean {
    // Temporarily add the synapse
    const neighbors = this.adjacencyList.get(fromId) || [];
    const tempSynapse: Synapse = {
      id: 'temp',
      from: fromId,
      to: toId,
      weight: 1
    };

    neighbors.push(toId);

    // Check if 'from' is reachable from 'to' (which would create a cycle)
    const reachableFromTo = this.findReachableNeurons(toId);
    const hasCycle = reachableFromTo.has(fromId);

    // Remove temporary synapse
    const index = neighbors.indexOf(toId);
    if (index > -1) {
      neighbors.splice(index, 1);
    }

    return hasCycle;
  }

  // Get suggested connections for a neuron
  getSuggestedConnections(neuronId: string, maxSuggestions: number = 3): string[] {
    const neuron = this.neurons.get(neuronId);
    if (!neuron) return [];

    const suggestions: Array<{ id: string; score: number }> = [];

    this.neurons.forEach((targetNeuron, targetId) => {
      // Don't suggest connecting to self
      if (targetId === neuronId) return;

      // Don't suggest if already connected
      const neighbors = this.adjacencyList.get(neuronId) || [];
      if (neighbors.includes(targetId)) return;

      // Don't suggest if would create cycle
      if (this.wouldCreateCycle(neuronId, targetId)) return;

      // Calculate suggestion score based on position and type
      let score = 0;

      // Prefer forward connections (left to right)
      if (targetNeuron.x > neuron.x) {
        score += 100;
      }

      // Prefer closer neurons
      const distance = this.heuristic(neuron, targetNeuron);
      score -= distance * 0.1;

      // Prefer connections that lead toward outputs
      if (targetNeuron.type === 'output') {
        score += 200;
      } else if (targetNeuron.type === 'hidden') {
        score += 50;
      }

      // Prefer neurons that aren't already heavily connected
      const targetConnections = Array.from(this.synapses.values()).filter(
        s => s.to === targetId
      ).length;
      score -= targetConnections * 20;

      suggestions.push({ id: targetId, score });
    });

    // Sort by score and return top suggestions
    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.slice(0, maxSuggestions).map(s => s.id);
  }

  // Calculate network complexity
  getNetworkComplexity(): number {
    const paths = this.findAllPaths();
    const avgPathLength =
      paths.reduce((sum, p) => sum + p.neurons.length, 0) / paths.length || 0;
    const synapseCount = this.synapses.size;
    const neuronCount = this.neurons.size;

    return avgPathLength * synapseCount * 0.1 + neuronCount;
  }
}

// Helper function to validate synapse placement
export function isValidSynapsePlacement(
  synapse: Synapse,
  existingSynapses: Synapse[],
  neurons: Neuron[]
): { valid: boolean; reason?: string } {
  // Check if neurons exist
  const fromNeuron = neurons.find(n => n.id === synapse.from);
  const toNeuron = neurons.find(n => n.id === synapse.to);

  if (!fromNeuron) {
    return { valid: false, reason: 'Source neuron not found' };
  }

  if (!toNeuron) {
    return { valid: false, reason: 'Target neuron not found' };
  }

  // Can't connect to self
  if (synapse.from === synapse.to) {
    return { valid: false, reason: 'Cannot connect neuron to itself' };
  }

  // Can't connect from output neurons
  if (fromNeuron.type === 'output') {
    return { valid: false, reason: 'Cannot create synapses from output neurons' };
  }

  // Can't have duplicate synapses
  const duplicate = existingSynapses.find(
    s => s.from === synapse.from && s.to === synapse.to
  );

  if (duplicate) {
    return { valid: false, reason: 'Synapse already exists' };
  }

  return { valid: true };
}

// Calculate optimal neurotransmitter for a synapse
export function suggestNeurotransmitter(
  synapse: Synapse,
  neurons: Neuron[],
  availableNeurotransmitters: string[]
): string | null {
  const fromNeuron = neurons.find(n => n.id === synapse.from);
  const toNeuron = neurons.find(n => n.id === synapse.to);

  if (!fromNeuron || !toNeuron) return null;

  // If target has high threshold, suggest glutamate
  if (toNeuron.threshold >= 2 && availableNeurotransmitters.includes('glutamate')) {
    return 'glutamate';
  }

  // If target is output, suggest dopamine for bonus points
  if (toNeuron.type === 'output' && availableNeurotransmitters.includes('dopamine')) {
    return 'dopamine';
  }

  // If long distance, suggest norepinephrine
  const dx = toNeuron.x - fromNeuron.x;
  const dy = toNeuron.y - fromNeuron.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 300 && availableNeurotransmitters.includes('norepinephrine')) {
    return 'norepinephrine';
  }

  return null;
}
