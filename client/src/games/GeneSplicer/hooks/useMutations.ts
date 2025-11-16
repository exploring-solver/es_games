// React hook for handling mutations and random genetic events
import { useState, useCallback, useEffect, useRef } from 'react';
import { Nucleotide, Mutation } from '../data/genes';
import { randomMutation } from '../utils/geneticsEngine';

export interface MutationEvent {
  id: string;
  type: 'random' | 'cosmic_ray' | 'viral' | 'chemical';
  mutation: Mutation;
  timestamp: number;
  message: string;
}

interface UseMutationsProps {
  enableRandomEvents?: boolean;
  randomEventChance?: number; // 0-1, chance per tick
  eventIntervalMs?: number; // How often to check for events
  onMutationEvent?: (event: MutationEvent) => void;
}

export function useMutations({
  enableRandomEvents = false,
  randomEventChance = 0.02,
  eventIntervalMs = 5000,
  onMutationEvent,
}: UseMutationsProps = {}) {
  const [recentEvents, setRecentEvents] = useState<MutationEvent[]>([]);
  const [isActive, setIsActive] = useState(enableRandomEvents);
  const eventIdCounter = useRef(0);

  /**
   * Generate a random mutation event
   */
  const generateRandomEvent = useCallback((): MutationEvent | null => {
    if (Math.random() > randomEventChance) return null;

    const eventTypes = ['random', 'cosmic_ray', 'viral', 'chemical'] as const;
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const mutationTypes = ['substitution', 'insertion', 'deletion', 'duplication'] as const;
    const mutationType = mutationTypes[Math.floor(Math.random() * mutationTypes.length)];

    const nucleotides: Nucleotide[] = ['A', 'T', 'G', 'C'];

    let mutation: Mutation;
    let message: string;

    switch (mutationType) {
      case 'substitution':
        mutation = {
          type: 'substitution',
          position: Math.floor(Math.random() * 100), // Will be adjusted to actual position
          nucleotides: [nucleotides[Math.floor(Math.random() * 4)]],
        };
        message = `${type === 'cosmic_ray' ? 'Cosmic ray' : type === 'viral' ? 'Viral infection' : type === 'chemical' ? 'Chemical mutagen' : 'Random event'} caused a point mutation!`;
        break;

      case 'insertion':
        const insertCount = Math.floor(Math.random() * 3) + 1;
        mutation = {
          type: 'insertion',
          position: Math.floor(Math.random() * 100),
          nucleotides: Array.from(
            { length: insertCount },
            () => nucleotides[Math.floor(Math.random() * 4)]
          ),
        };
        message = `${type === 'cosmic_ray' ? 'Cosmic radiation' : type === 'viral' ? 'Virus' : type === 'chemical' ? 'Chemical exposure' : 'Random event'} inserted ${insertCount} nucleotide${insertCount > 1 ? 's' : ''}!`;
        break;

      case 'deletion':
        const deleteCount = Math.floor(Math.random() * 3) + 1;
        mutation = {
          type: 'deletion',
          position: Math.floor(Math.random() * 100),
          length: deleteCount,
        };
        message = `${type === 'cosmic_ray' ? 'Cosmic radiation' : type === 'viral' ? 'Viral attack' : type === 'chemical' ? 'Chemical damage' : 'Random event'} deleted ${deleteCount} nucleotide${deleteCount > 1 ? 's' : ''}!`;
        break;

      case 'duplication':
        const dupLength = Math.floor(Math.random() * 6) + 3;
        mutation = {
          type: 'duplication',
          position: Math.floor(Math.random() * 100),
          length: dupLength,
        };
        message = `${type === 'cosmic_ray' ? 'Cosmic event' : type === 'viral' ? 'Viral integration' : type === 'chemical' ? 'Chemical reaction' : 'Random event'} duplicated a gene segment!`;
        break;
    }

    return {
      id: `event_${eventIdCounter.current++}`,
      type,
      mutation,
      timestamp: Date.now(),
      message,
    };
  }, [randomEventChance]);

  /**
   * Apply a random event to DNA
   */
  const applyRandomEvent = useCallback(
    (dna: Nucleotide[]): { dna: Nucleotide[]; event: MutationEvent | null } => {
      const event = generateRandomEvent();
      if (!event) return { dna, event: null };

      // Adjust mutation position to valid range
      const adjustedMutation = {
        ...event.mutation,
        position: Math.min(event.mutation.position, dna.length - 1),
      };

      // Apply mutation using the genetics engine
      const newDNA = randomMutation(dna, 0.05); // 5% chance per nucleotide

      setRecentEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events

      if (onMutationEvent) {
        onMutationEvent(event);
      }

      return { dna: newDNA, event };
    },
    [generateRandomEvent, onMutationEvent]
  );

  /**
   * Create a specific mutation
   */
  const createSubstitution = useCallback(
    (position: number, newNucleotide: Nucleotide): Mutation => {
      return {
        type: 'substitution',
        position,
        nucleotides: [newNucleotide],
      };
    },
    []
  );

  const createInsertion = useCallback((position: number, nucleotides: Nucleotide[]): Mutation => {
    return {
      type: 'insertion',
      position,
      nucleotides,
    };
  }, []);

  const createDeletion = useCallback((position: number, length: number): Mutation => {
    return {
      type: 'deletion',
      position,
      length,
    };
  }, []);

  const createDuplication = useCallback((position: number, length: number): Mutation => {
    return {
      type: 'duplication',
      position,
      length,
    };
  }, []);

  const createInversion = useCallback((position: number, length: number): Mutation => {
    return {
      type: 'inversion',
      position,
      length,
    };
  }, []);

  /**
   * Clear event history
   */
  const clearEvents = useCallback(() => {
    setRecentEvents([]);
  }, []);

  /**
   * Toggle random events
   */
  const toggleRandomEvents = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  /**
   * Set up random event timer
   */
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const event = generateRandomEvent();
      if (event && onMutationEvent) {
        onMutationEvent(event);
        setRecentEvents(prev => [...prev.slice(-9), event]);
      }
    }, eventIntervalMs);

    return () => clearInterval(interval);
  }, [isActive, eventIntervalMs, generateRandomEvent, onMutationEvent]);

  /**
   * Suggest beneficial mutations for target traits
   */
  const suggestMutation = useCallback(
    (
      currentDNA: Nucleotide[],
      targetProtein: string[]
    ): { position: number; mutation: Mutation; reasoning: string } | null => {
      // This is a simplified suggestion system
      // In a full implementation, this would analyze the DNA and suggest optimal mutations

      // Find a good insertion point (after start codon if it exists)
      const dnaStr = currentDNA.join('');
      const startCodonPos = dnaStr.indexOf('ATG');
      const position = startCodonPos !== -1 ? startCodonPos + 3 : 0;

      // Suggest inserting nucleotides that could code for the target protein
      const mutation: Mutation = {
        type: 'insertion',
        position,
        nucleotides: ['A', 'T', 'G'], // Start with ATG (Met)
      };

      return {
        position,
        mutation,
        reasoning: 'Inserting ATG start codon to begin a new gene',
      };
    },
    []
  );

  return {
    // State
    recentEvents,
    isActive,
    eventCount: recentEvents.length,

    // Actions
    applyRandomEvent,
    createSubstitution,
    createInsertion,
    createDeletion,
    createDuplication,
    createInversion,
    clearEvents,
    toggleRandomEvents,
    suggestMutation,
  };
}

export default useMutations;
