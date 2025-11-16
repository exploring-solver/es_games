// React hook for managing genetic operations
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Nucleotide, Mutation, CRISPROperation } from '../data/genes';
import { Organism } from '../data/organisms';
import {
  expressGenes,
  applyMutation,
  performCRISPR,
  crossover,
  getDNAStats,
  validateDNA,
  calculateFitness,
} from '../utils/geneticsEngine';
import { calculateTraits, checkLevelCompletion, OrganismTraits } from '../utils/traitCalculator';

export interface GeneticState {
  organism: Organism;
  traits: OrganismTraits;
  mutationHistory: Mutation[];
  generation: number;
  dnaStats: ReturnType<typeof getDNAStats>;
}

interface UseGeneticLogicProps {
  initialOrganism: Partial<Organism>;
  onOrganismChange?: (organism: Organism) => void;
}

export function useGeneticLogic({ initialOrganism, onOrganismChange }: UseGeneticLogicProps) {
  // Initialize organism
  const [organism, setOrganism] = useState<Organism>(() => {
    const genome = initialOrganism.genome || [];
    return {
      id: initialOrganism.id || `org_${Date.now()}`,
      name: initialOrganism.name || 'Organism',
      species: initialOrganism.species || 'Unknown',
      genome,
      genes: [],
      traits: [],
      fitness: initialOrganism.fitness || 50,
      generation: initialOrganism.generation || 0,
      parentIds: initialOrganism.parentIds,
    };
  });

  const [mutationHistory, setMutationHistory] = useState<Mutation[]>([]);
  const [undoStack, setUndoStack] = useState<Nucleotide[][]>([]);
  const [redoStack, setRedoStack] = useState<Nucleotide[][]>([]);

  // Calculate traits whenever genome changes
  const traits = useMemo(() => {
    return calculateTraits(organism.genome);
  }, [organism.genome]);

  // Calculate DNA stats
  const dnaStats = useMemo(() => {
    return getDNAStats(organism.genome);
  }, [organism.genome]);

  // Update organism's genes and traits
  useEffect(() => {
    const expression = expressGenes(organism.genome);
    const traitIds = traits.activeTraits.map(t => t.trait.id);
    const fitness = calculateFitness(organism.genome);

    setOrganism(prev => ({
      ...prev,
      genes: expression.genes,
      traits: traitIds,
      fitness,
    }));
  }, [organism.genome, traits]);

  // Notify parent of organism changes
  useEffect(() => {
    if (onOrganismChange) {
      onOrganismChange(organism);
    }
  }, [organism, onOrganismChange]);

  /**
   * Apply a mutation to the organism
   */
  const mutateDNA = useCallback((mutation: Mutation) => {
    setOrganism(prev => {
      // Save current state for undo
      setUndoStack(stack => [...stack, prev.genome]);
      setRedoStack([]); // Clear redo stack

      const newGenome = applyMutation(prev.genome, mutation);

      // Validate the new DNA
      const validation = validateDNA(newGenome);
      if (!validation.valid) {
        console.warn('Mutation resulted in invalid DNA:', validation.errors);
      }

      return {
        ...prev,
        genome: newGenome,
      };
    });

    setMutationHistory(prev => [...prev, mutation]);
  }, []);

  /**
   * Perform CRISPR gene editing
   */
  const editWithCRISPR = useCallback((operation: CRISPROperation) => {
    setOrganism(prev => {
      setUndoStack(stack => [...stack, prev.genome]);
      setRedoStack([]);

      const newGenome = performCRISPR(prev.genome, operation);

      return {
        ...prev,
        genome: newGenome,
      };
    });
  }, []);

  /**
   * Crossover with another organism
   */
  const performCrossover = useCallback((otherOrganism: Organism, crossoverPoint?: number) => {
    setOrganism(prev => {
      setUndoStack(stack => [...stack, prev.genome]);
      setRedoStack([]);

      const newGenome = crossover(prev.genome, otherOrganism.genome, crossoverPoint);

      return {
        ...prev,
        genome: newGenome,
        generation: prev.generation + 1,
        parentIds: [prev.id, otherOrganism.id],
      };
    });
  }, []);

  /**
   * Set DNA directly
   */
  const setDNA = useCallback((newDNA: Nucleotide[]) => {
    setOrganism(prev => {
      setUndoStack(stack => [...stack, prev.genome]);
      setRedoStack([]);

      return {
        ...prev,
        genome: newDNA,
      };
    });
  }, []);

  /**
   * Undo last change
   */
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousGenome = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack(stack => [...stack, organism.genome]);
    setUndoStack(newUndoStack);

    setOrganism(prev => ({
      ...prev,
      genome: previousGenome,
    }));

    // Remove last mutation from history
    if (mutationHistory.length > 0) {
      setMutationHistory(prev => prev.slice(0, -1));
    }
  }, [undoStack, organism.genome, mutationHistory]);

  /**
   * Redo last undone change
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextGenome = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack(stack => [...stack, organism.genome]);
    setRedoStack(newRedoStack);

    setOrganism(prev => ({
      ...prev,
      genome: nextGenome,
    }));
  }, [redoStack, organism.genome]);

  /**
   * Reset to initial organism
   */
  const reset = useCallback(() => {
    const genome = initialOrganism.genome || [];
    setOrganism({
      id: `org_${Date.now()}`,
      name: initialOrganism.name || 'Organism',
      species: initialOrganism.species || 'Unknown',
      genome,
      genes: [],
      traits: [],
      fitness: initialOrganism.fitness || 50,
      generation: 0,
    });
    setMutationHistory([]);
    setUndoStack([]);
    setRedoStack([]);
  }, [initialOrganism]);

  /**
   * Clone organism
   */
  const cloneOrganism = useCallback((): Organism => {
    return {
      ...organism,
      id: `org_${Date.now()}_clone`,
      name: `${organism.name} Clone`,
      generation: organism.generation + 1,
      parentIds: [organism.id],
    };
  }, [organism]);

  /**
   * Check level completion
   */
  const checkCompletion = useCallback(
    (targetTraits: string[], optionalTraits?: string[]) => {
      return checkLevelCompletion(traits.activeTraits, targetTraits, optionalTraits);
    },
    [traits]
  );

  /**
   * Get genome as string
   */
  const getGenomeString = useCallback(() => {
    return organism.genome.join('');
  }, [organism.genome]);

  /**
   * Parse genome from string
   */
  const parseGenomeString = useCallback((genomeStr: string) => {
    const nucleotides = genomeStr.split('').filter(n => ['A', 'T', 'G', 'C'].includes(n)) as Nucleotide[];
    setDNA(nucleotides);
  }, [setDNA]);

  return {
    // State
    organism,
    traits,
    mutationHistory,
    dnaStats,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,

    // Actions
    mutateDNA,
    editWithCRISPR,
    performCrossover,
    setDNA,
    undo,
    redo,
    reset,
    cloneOrganism,
    checkCompletion,
    getGenomeString,
    parseGenomeString,
  };
}

export default useGeneticLogic;
