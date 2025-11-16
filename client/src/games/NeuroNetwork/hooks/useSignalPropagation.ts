import { useState, useEffect, useCallback } from 'react';
import { Signal } from '../utils/neuralEngine';
import { Neuron } from '../data/levels';

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface SignalVisualization extends Signal {
  x: number;
  y: number;
  particles: ParticleEffect[];
}

export interface UseSignalPropagationReturn {
  visualSignals: SignalVisualization[];
  particles: ParticleEffect[];
  neuronPulses: Map<string, number>;
}

export function useSignalPropagation(
  signals: Signal[],
  neurons: Neuron[]
): UseSignalPropagationReturn {
  const [visualSignals, setVisualSignals] = useState<SignalVisualization[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [neuronPulses, setNeuronPulses] = useState<Map<string, number>>(new Map());

  const neuronMap = new Map(neurons.map(n => [n.id, n]));

  // Update signal positions and create particle effects
  useEffect(() => {
    const newVisualSignals: SignalVisualization[] = [];
    const newParticles: ParticleEffect[] = [...particles];
    let particleId = particles.length;

    signals.forEach(signal => {
      const fromNeuron = neuronMap.get(signal.fromNeuronId);
      const toNeuron = neuronMap.get(signal.toNeuronId);

      if (!fromNeuron || !toNeuron) return;

      // Calculate position along synapse
      const x = fromNeuron.x + (toNeuron.x - fromNeuron.x) * signal.position;
      const y = fromNeuron.y + (toNeuron.y - fromNeuron.y) * signal.position;

      // Create particle trail
      if (Math.random() < 0.3) {
        const color = getNeurotransmitterColor(signal.neurotransmitter);
        const particle: ParticleEffect = {
          id: `particle_${particleId++}`,
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 30,
          maxLife: 30,
          color,
          size: 3 + Math.random() * 2
        };
        newParticles.push(particle);
      }

      newVisualSignals.push({
        ...signal,
        x,
        y,
        particles: []
      });
    });

    setVisualSignals(newVisualSignals);
    setParticles(newParticles);
  }, [signals]);

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        return prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.95,
            vy: particle.vy * 0.95
          }))
          .filter(particle => particle.life > 0);
      });
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, []);

  // Track neuron activation pulses
  useEffect(() => {
    const newPulses = new Map(neuronPulses);
    let updated = false;

    // Decay existing pulses
    neuronPulses.forEach((intensity, neuronId) => {
      const newIntensity = intensity * 0.95;
      if (newIntensity < 0.01) {
        newPulses.delete(neuronId);
        updated = true;
      } else {
        newPulses.set(neuronId, newIntensity);
        updated = true;
      }
    });

    // Add pulses for neurons that just fired
    signals.forEach(signal => {
      if (signal.position < 0.1) {
        // Signal just started
        newPulses.set(signal.fromNeuronId, 1.0);
        updated = true;
      }
      if (signal.position > 0.9) {
        // Signal about to arrive
        const current = newPulses.get(signal.toNeuronId) || 0;
        newPulses.set(signal.toNeuronId, Math.min(current + 0.5, 1.0));
        updated = true;
      }
    });

    if (updated) {
      setNeuronPulses(newPulses);
    }
  }, [signals]);

  return {
    visualSignals,
    particles,
    neuronPulses
  };
}

function getNeurotransmitterColor(neurotransmitter?: string): string {
  switch (neurotransmitter) {
    case 'glutamate':
      return '#F59E0B';
    case 'gaba':
      return '#6366F1';
    case 'dopamine':
      return '#EC4899';
    case 'serotonin':
      return '#8B5CF6';
    case 'acetylcholine':
      return '#10B981';
    case 'norepinephrine':
      return '#EF4444';
    default:
      return '#60A5FA';
  }
}

// Hook for creating burst effects when neuron fires
export function useNeuronFireEffect() {
  const [bursts, setBursts] = useState<Array<{
    id: string;
    neuronId: string;
    x: number;
    y: number;
    startTime: number;
  }>>([]);

  const createBurst = useCallback((neuronId: string, x: number, y: number) => {
    const burst = {
      id: `burst_${Date.now()}_${Math.random()}`,
      neuronId,
      x,
      y,
      startTime: Date.now()
    };
    setBursts(prev => [...prev, burst]);

    // Remove burst after animation
    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== burst.id));
    }, 1000);
  }, []);

  return {
    bursts,
    createBurst
  };
}

// Hook for managing drag-and-drop synapse creation
export interface DragState {
  isDragging: boolean;
  fromNeuronId: string | null;
  currentX: number;
  currentY: number;
}

export function useSynapseDrag() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    fromNeuronId: null,
    currentX: 0,
    currentY: 0
  });

  const startDrag = useCallback((neuronId: string, x: number, y: number) => {
    setDragState({
      isDragging: true,
      fromNeuronId: neuronId,
      currentX: x,
      currentY: y
    });
  }, []);

  const updateDrag = useCallback((x: number, y: number) => {
    setDragState(prev => ({
      ...prev,
      currentX: x,
      currentY: y
    }));
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      fromNeuronId: null,
      currentX: 0,
      currentY: 0
    });
  }, []);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag
  };
}
