import { useState, useCallback } from 'react';
import { canFormBond, calculateBondStrength, getBondPolarity } from '../utils/chemistryEngine';
import { ELEMENTS } from '../data/elements';
import { Bond } from '../data/compounds';

export interface BondingState {
  selectedAtom: number | null;
  hoveredAtom: number | null;
  bondType: 'single' | 'double' | 'triple';
  isCreatingBond: boolean;
  previewBond: {
    atom1: number;
    atom2: number;
    type: 'single' | 'double' | 'triple';
    valid: boolean;
    reason?: string;
  } | null;
}

export interface BondingActions {
  selectAtom: (index: number) => void;
  deselectAtom: () => void;
  hoverAtom: (index: number | null) => void;
  setBondType: (type: 'single' | 'double' | 'triple') => void;
  toggleBondType: () => void;
  attemptBond: () => {
    success: boolean;
    bond?: Bond;
    message: string;
  } | null;
}

export interface BondVisualization {
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'gradient';
  animation?: 'pulse' | 'glow' | 'none';
}

export function useBonding(
  currentAtoms: Array<{ element: string }>,
  currentBonds: Bond[]
): {
  state: BondingState;
  actions: BondingActions;
  getBondVisualization: (bond: Bond) => BondVisualization;
} {
  const [state, setState] = useState<BondingState>({
    selectedAtom: null,
    hoveredAtom: null,
    bondType: 'single',
    isCreatingBond: false,
    previewBond: null,
  });

  const selectAtom = useCallback((index: number) => {
    setState(prev => {
      // If an atom is already selected, try to create a bond
      if (prev.selectedAtom !== null && prev.selectedAtom !== index) {
        const atom1Element = currentAtoms[prev.selectedAtom]?.element;
        const atom2Element = currentAtoms[index]?.element;

        if (!atom1Element || !atom2Element) {
          return { ...prev, selectedAtom: index, isCreatingBond: false };
        }

        const element1 = ELEMENTS[atom1Element];
        const element2 = ELEMENTS[atom2Element];

        if (!element1 || !element2) {
          return { ...prev, selectedAtom: index, isCreatingBond: false };
        }

        // Count existing bonds for each atom
        const bonds1 = currentBonds.filter(b => b.atom1 === prev.selectedAtom || b.atom2 === prev.selectedAtom);
        const bonds2 = currentBonds.filter(b => b.atom1 === index || b.atom2 === index);

        const bondCount1 = bonds1.reduce((sum, b) => {
          return sum + (b.type === 'single' ? 1 : b.type === 'double' ? 2 : 3);
        }, 0);

        const bondCount2 = bonds2.reduce((sum, b) => {
          return sum + (b.type === 'single' ? 1 : b.type === 'double' ? 2 : 3);
        }, 0);

        const bondAttempt = canFormBond(element1, element2, prev.bondType, bondCount1, bondCount2);

        return {
          ...prev,
          selectedAtom: index,
          isCreatingBond: true,
          previewBond: {
            atom1: prev.selectedAtom,
            atom2: index,
            type: prev.bondType,
            valid: bondAttempt.success,
            reason: bondAttempt.reason,
          },
        };
      }

      // First selection
      return {
        ...prev,
        selectedAtom: index,
        isCreatingBond: false,
        previewBond: null,
      };
    });
  }, [currentAtoms, currentBonds]);

  const deselectAtom = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedAtom: null,
      isCreatingBond: false,
      previewBond: null,
    }));
  }, []);

  const hoverAtom = useCallback((index: number | null) => {
    setState(prev => {
      if (index === null) {
        return { ...prev, hoveredAtom: null, previewBond: null };
      }

      if (prev.selectedAtom === null || prev.selectedAtom === index) {
        return { ...prev, hoveredAtom: index };
      }

      // Preview bond
      const atom1Element = currentAtoms[prev.selectedAtom]?.element;
      const atom2Element = currentAtoms[index]?.element;

      if (!atom1Element || !atom2Element) {
        return { ...prev, hoveredAtom: index };
      }

      const element1 = ELEMENTS[atom1Element];
      const element2 = ELEMENTS[atom2Element];

      if (!element1 || !element2) {
        return { ...prev, hoveredAtom: index };
      }

      // Count existing bonds
      const bonds1 = currentBonds.filter(b => b.atom1 === prev.selectedAtom || b.atom2 === prev.selectedAtom);
      const bonds2 = currentBonds.filter(b => b.atom1 === index || b.atom2 === index);

      const bondCount1 = bonds1.reduce((sum, b) => {
        return sum + (b.type === 'single' ? 1 : b.type === 'double' ? 2 : 3);
      }, 0);

      const bondCount2 = bonds2.reduce((sum, b) => {
        return sum + (b.type === 'single' ? 1 : b.type === 'double' ? 2 : 3);
      }, 0);

      const bondAttempt = canFormBond(element1, element2, prev.bondType, bondCount1, bondCount2);

      return {
        ...prev,
        hoveredAtom: index,
        previewBond: {
          atom1: prev.selectedAtom,
          atom2: index,
          type: prev.bondType,
          valid: bondAttempt.success,
          reason: bondAttempt.reason,
        },
      };
    });
  }, [currentAtoms, currentBonds]);

  const setBondType = useCallback((type: 'single' | 'double' | 'triple') => {
    setState(prev => ({ ...prev, bondType: type }));
  }, []);

  const toggleBondType = useCallback(() => {
    setState(prev => {
      const types: Array<'single' | 'double' | 'triple'> = ['single', 'double', 'triple'];
      const currentIndex = types.indexOf(prev.bondType);
      const nextIndex = (currentIndex + 1) % types.length;
      return { ...prev, bondType: types[nextIndex] };
    });
  }, []);

  const attemptBond = useCallback(() => {
    if (!state.previewBond) return null;

    if (!state.previewBond.valid) {
      return {
        success: false,
        message: state.previewBond.reason || 'Cannot form bond',
      };
    }

    const atom1Element = currentAtoms[state.previewBond.atom1]?.element;
    const atom2Element = currentAtoms[state.previewBond.atom2]?.element;

    if (!atom1Element || !atom2Element) {
      return {
        success: false,
        message: 'Invalid atoms',
      };
    }

    const element1 = ELEMENTS[atom1Element];
    const element2 = ELEMENTS[atom2Element];

    if (!element1 || !element2) {
      return {
        success: false,
        message: 'Unknown elements',
      };
    }

    const strength = calculateBondStrength(element1, element2, state.bondType);
    const polarity = getBondPolarity(element1, element2);

    const bond: Bond = {
      atom1: state.previewBond.atom1,
      atom2: state.previewBond.atom2,
      type: state.bondType,
      strength,
    };

    setState(prev => ({
      ...prev,
      selectedAtom: null,
      isCreatingBond: false,
      previewBond: null,
    }));

    return {
      success: true,
      bond,
      message: `Formed ${polarity} ${state.bondType} bond (${strength} kJ/mol)`,
    };
  }, [state.previewBond, state.bondType, currentAtoms]);

  const getBondVisualization = useCallback((bond: Bond): BondVisualization => {
    const atom1Element = currentAtoms[bond.atom1]?.element;
    const atom2Element = currentAtoms[bond.atom2]?.element;

    if (!atom1Element || !atom2Element) {
      return {
        color: '#888888',
        width: 2,
        style: 'solid',
        animation: 'none',
      };
    }

    const element1 = ELEMENTS[atom1Element];
    const element2 = ELEMENTS[atom2Element];

    if (!element1 || !element2) {
      return {
        color: '#888888',
        width: 2,
        style: 'solid',
        animation: 'none',
      };
    }

    const polarity = getBondPolarity(element1, element2);

    // Determine color based on polarity
    let color = '#555555';
    if (polarity === 'ionic') {
      color = '#FF6B6B'; // Red for ionic
    } else if (polarity === 'polar') {
      color = '#4ECDC4'; // Teal for polar
    } else {
      color = '#95E1D3'; // Light green for nonpolar
    }

    // Determine width based on bond type
    const width = bond.type === 'single' ? 3 : bond.type === 'double' ? 5 : 7;

    // Determine style
    const style = polarity === 'ionic' ? 'dashed' : 'solid';

    // Animation based on bond strength
    const animation = bond.strength > 700 ? 'pulse' : bond.strength > 400 ? 'glow' : 'none';

    return {
      color,
      width,
      style,
      animation,
    };
  }, [currentAtoms]);

  return {
    state,
    actions: {
      selectAtom,
      deselectAtom,
      hoverAtom,
      setBondType,
      toggleBondType,
      attemptBond,
    },
    getBondVisualization,
  };
}

/**
 * Hook for managing bond animations
 */
export function useBondAnimation() {
  const [animatingBonds, setAnimatingBonds] = useState<Set<number>>(new Set());

  const startAnimation = useCallback((bondIndex: number, duration: number = 1000) => {
    setAnimatingBonds(prev => new Set(prev).add(bondIndex));

    setTimeout(() => {
      setAnimatingBonds(prev => {
        const next = new Set(prev);
        next.delete(bondIndex);
        return next;
      });
    }, duration);
  }, []);

  const isAnimating = useCallback((bondIndex: number) => {
    return animatingBonds.has(bondIndex);
  }, [animatingBonds]);

  return {
    startAnimation,
    isAnimating,
  };
}
