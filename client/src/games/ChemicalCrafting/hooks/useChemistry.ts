import { useState, useCallback, useEffect } from 'react';
import { Atom, Bond, Compound, LEVEL_PROGRESSION, getLevelCompound, getDailyCompound } from '../data/compounds';
import { Element, ELEMENTS } from '../data/elements';
import { generateRandomElements, scoreMolecule } from '../utils/chemistryEngine';
import { validateMolecule, matchesTarget, calculateMolecularFormula, calculateMolarMass } from '../utils/moleculeValidator';

export type GameMode = 'campaign' | 'time-trial' | 'sandbox' | 'daily' | 'multiplayer';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface GameState {
  mode: GameMode;
  level: number;
  score: number;
  lives: number;
  timeRemaining: number;
  targetCompound: Compound | null;
  availableElements: Element[];
  currentMolecule: {
    atoms: Atom[];
    bonds: Bond[];
  };
  elementsUsed: Record<string, number>;
  hintsUsed: number;
  isComplete: boolean;
  isPaused: boolean;
}

export interface ChemistryActions {
  addAtom: (element: string, position: { x: number; y: number; z: number }) => void;
  removeAtom: (index: number) => void;
  addBond: (atom1: number, atom2: number, type: 'single' | 'double' | 'triple') => void;
  removeBond: (index: number) => void;
  clearMolecule: () => void;
  submitMolecule: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  useHint: () => string[];
  pauseGame: () => void;
  resumeGame: () => void;
  changeMode: (mode: GameMode) => void;
  setLevel: (level: number) => void;
}

const INITIAL_LIVES = 3;
const MAX_HINTS = 3;

export function useChemistry(initialMode: GameMode = 'campaign'): {
  state: GameState;
  actions: ChemistryActions;
  validation: ReturnType<typeof validateMolecule> | null;
  formula: string;
  molarMass: number;
} {
  const [state, setState] = useState<GameState>(() => {
    const level = 1;
    const targetCompound = initialMode === 'daily' ? getDailyCompound() : getLevelCompound(level);
    const difficulty = LEVEL_PROGRESSION.find(l => l.level === level)?.difficulty || 'easy';
    const availableElements = generateRandomElements(8, difficulty as Difficulty);

    return {
      mode: initialMode,
      level,
      score: 0,
      lives: INITIAL_LIVES,
      timeRemaining: initialMode === 'time-trial' ? 300 : 0,
      targetCompound,
      availableElements,
      currentMolecule: {
        atoms: [],
        bonds: [],
      },
      elementsUsed: {},
      hintsUsed: 0,
      isComplete: false,
      isPaused: false,
    };
  });

  const [validation, setValidation] = useState<ReturnType<typeof validateMolecule> | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.mode === 'time-trial' && state.timeRemaining > 0 && !state.isPaused && !state.isComplete) {
      const timer = setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            return { ...prev, timeRemaining: 0, isComplete: true };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.mode, state.timeRemaining, state.isPaused, state.isComplete]);

  // Validate molecule whenever it changes
  useEffect(() => {
    if (state.currentMolecule.atoms.length > 0) {
      const result = validateMolecule(state.currentMolecule.atoms, state.currentMolecule.bonds);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [state.currentMolecule]);

  const addAtom = useCallback((element: string, position: { x: number; y: number; z: number }) => {
    setState(prev => {
      const elementData = ELEMENTS[element];
      if (!elementData) return prev;

      // Check if element is available
      const isAvailable = prev.availableElements.some(e => e.symbol === element);
      if (!isAvailable && prev.mode !== 'sandbox') return prev;

      // In campaign mode, check element limits
      if (prev.mode === 'campaign' && prev.targetCompound) {
        const targetCount = prev.targetCompound.atoms.filter(a => a.element === element).length;
        const currentCount = (prev.elementsUsed[element] || 0) + 1;
        if (currentCount > targetCount) {
          return prev; // Can't use more than target
        }
      }

      const newAtom: Atom = { element, position };

      return {
        ...prev,
        currentMolecule: {
          ...prev.currentMolecule,
          atoms: [...prev.currentMolecule.atoms, newAtom],
        },
        elementsUsed: {
          ...prev.elementsUsed,
          [element]: (prev.elementsUsed[element] || 0) + 1,
        },
      };
    });
  }, []);

  const removeAtom = useCallback((index: number) => {
    setState(prev => {
      if (index < 0 || index >= prev.currentMolecule.atoms.length) return prev;

      const removedAtom = prev.currentMolecule.atoms[index];
      const newAtoms = prev.currentMolecule.atoms.filter((_, i) => i !== index);

      // Remove bonds connected to this atom and update indices
      const newBonds = prev.currentMolecule.bonds
        .filter(bond => bond.atom1 !== index && bond.atom2 !== index)
        .map(bond => ({
          ...bond,
          atom1: bond.atom1 > index ? bond.atom1 - 1 : bond.atom1,
          atom2: bond.atom2 > index ? bond.atom2 - 1 : bond.atom2,
        }));

      return {
        ...prev,
        currentMolecule: {
          atoms: newAtoms,
          bonds: newBonds,
        },
        elementsUsed: {
          ...prev.elementsUsed,
          [removedAtom.element]: Math.max(0, (prev.elementsUsed[removedAtom.element] || 0) - 1),
        },
      };
    });
  }, []);

  const addBond = useCallback((atom1: number, atom2: number, type: 'single' | 'double' | 'triple') => {
    setState(prev => {
      if (atom1 < 0 || atom1 >= prev.currentMolecule.atoms.length) return prev;
      if (atom2 < 0 || atom2 >= prev.currentMolecule.atoms.length) return prev;
      if (atom1 === atom2) return prev;

      // Check if bond already exists
      const bondExists = prev.currentMolecule.bonds.some(
        bond => (bond.atom1 === atom1 && bond.atom2 === atom2) ||
                (bond.atom1 === atom2 && bond.atom2 === atom1)
      );

      if (bondExists) return prev;

      const element1 = ELEMENTS[prev.currentMolecule.atoms[atom1].element];
      const element2 = ELEMENTS[prev.currentMolecule.atoms[atom2].element];

      if (!element1 || !element2) return prev;

      // Calculate bond strength (simplified)
      const strength = type === 'single' ? 350 : type === 'double' ? 650 : 950;

      const newBond: Bond = {
        atom1,
        atom2,
        type,
        strength,
      };

      return {
        ...prev,
        currentMolecule: {
          ...prev.currentMolecule,
          bonds: [...prev.currentMolecule.bonds, newBond],
        },
      };
    });
  }, []);

  const removeBond = useCallback((index: number) => {
    setState(prev => {
      if (index < 0 || index >= prev.currentMolecule.bonds.length) return prev;

      return {
        ...prev,
        currentMolecule: {
          ...prev.currentMolecule,
          bonds: prev.currentMolecule.bonds.filter((_, i) => i !== index),
        },
      };
    });
  }, []);

  const clearMolecule = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentMolecule: {
        atoms: [],
        bonds: [],
      },
      elementsUsed: {},
    }));
  }, []);

  const submitMolecule = useCallback(() => {
    setState(prev => {
      if (!prev.targetCompound) return prev;

      const result = scoreMolecule(prev.currentMolecule, prev.targetCompound);

      if (result.correct) {
        // Success!
        const timeBonus = prev.mode === 'time-trial' ? prev.timeRemaining * 10 : 0;
        const hintPenalty = prev.hintsUsed * 50;
        const levelScore = result.score + timeBonus - hintPenalty;

        return {
          ...prev,
          score: prev.score + levelScore,
          isComplete: true,
        };
      } else {
        // Incorrect
        const newLives = prev.lives - 1;

        if (newLives <= 0) {
          // Game over
          return {
            ...prev,
            lives: 0,
            isComplete: true,
          };
        }

        return {
          ...prev,
          lives: newLives,
        };
      }
    });
  }, []);

  const nextLevel = useCallback(() => {
    setState(prev => {
      const nextLevelNum = prev.level + 1;
      const levelData = LEVEL_PROGRESSION.find(l => l.level === nextLevelNum);

      if (!levelData) {
        // No more levels
        return prev;
      }

      const targetCompound = getLevelCompound(nextLevelNum);
      const difficulty = levelData.difficulty as Difficulty;
      const availableElements = generateRandomElements(8 + Math.floor(nextLevelNum / 5), difficulty);

      return {
        ...prev,
        level: nextLevelNum,
        targetCompound,
        availableElements,
        currentMolecule: {
          atoms: [],
          bonds: [],
        },
        elementsUsed: {},
        hintsUsed: 0,
        isComplete: false,
        timeRemaining: prev.mode === 'time-trial' ? levelData.timeLimit : 0,
      };
    });
  }, []);

  const resetLevel = useCallback(() => {
    setState(prev => {
      const levelData = LEVEL_PROGRESSION.find(l => l.level === prev.level);

      return {
        ...prev,
        currentMolecule: {
          atoms: [],
          bonds: [],
        },
        elementsUsed: {},
        lives: INITIAL_LIVES,
        isComplete: false,
        timeRemaining: prev.mode === 'time-trial' && levelData ? levelData.timeLimit : 0,
      };
    });
  }, []);

  const useHint = useCallback((): string[] => {
    let hints: string[] = [];

    setState(prev => {
      if (prev.hintsUsed >= MAX_HINTS || !prev.targetCompound) {
        hints = ['No more hints available'];
        return prev;
      }

      // Provide different hints based on usage
      if (prev.hintsUsed === 0) {
        hints = [`Formula: ${prev.targetCompound.formula}`];
      } else if (prev.hintsUsed === 1) {
        hints = [`Geometry: ${prev.targetCompound.geometry}`, `Polarity: ${prev.targetCompound.polarity}`];
      } else {
        const elementCount: Record<string, number> = {};
        prev.targetCompound.atoms.forEach(atom => {
          elementCount[atom.element] = (elementCount[atom.element] || 0) + 1;
        });
        hints = Object.entries(elementCount).map(([el, count]) => `${el}: ${count} atom${count > 1 ? 's' : ''}`);
      }

      return {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
      };
    });

    return hints;
  }, []);

  const pauseGame = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const changeMode = useCallback((mode: GameMode) => {
    setState(prev => {
      const level = 1;
      const targetCompound = mode === 'daily' ? getDailyCompound() : getLevelCompound(level);
      const difficulty = LEVEL_PROGRESSION.find(l => l.level === level)?.difficulty || 'easy';
      const availableElements = mode === 'sandbox' ? Object.values(ELEMENTS) : generateRandomElements(8, difficulty as Difficulty);

      return {
        mode,
        level,
        score: 0,
        lives: INITIAL_LIVES,
        timeRemaining: mode === 'time-trial' ? 300 : 0,
        targetCompound: mode === 'sandbox' ? null : targetCompound,
        availableElements,
        currentMolecule: {
          atoms: [],
          bonds: [],
        },
        elementsUsed: {},
        hintsUsed: 0,
        isComplete: false,
        isPaused: false,
      };
    });
  }, []);

  const setLevel = useCallback((level: number) => {
    setState(prev => {
      const levelData = LEVEL_PROGRESSION.find(l => l.level === level);
      if (!levelData) return prev;

      const targetCompound = getLevelCompound(level);
      const difficulty = levelData.difficulty as Difficulty;
      const availableElements = generateRandomElements(8 + Math.floor(level / 5), difficulty);

      return {
        ...prev,
        level,
        targetCompound,
        availableElements,
        currentMolecule: {
          atoms: [],
          bonds: [],
        },
        elementsUsed: {},
        hintsUsed: 0,
        isComplete: false,
        timeRemaining: prev.mode === 'time-trial' ? levelData.timeLimit : 0,
      };
    });
  }, []);

  const formula = calculateMolecularFormula(state.currentMolecule.atoms);
  const molarMass = calculateMolarMass(state.currentMolecule.atoms);

  return {
    state,
    actions: {
      addAtom,
      removeAtom,
      addBond,
      removeBond,
      clearMolecule,
      submitMolecule,
      nextLevel,
      resetLevel,
      useHint,
      pauseGame,
      resumeGame,
      changeMode,
      setLevel,
    },
    validation,
    formula,
    molarMass,
  };
}
