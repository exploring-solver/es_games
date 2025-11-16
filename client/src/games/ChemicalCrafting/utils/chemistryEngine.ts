import { Element, ELEMENTS } from '../data/elements';
import { Bond, Atom, Compound } from '../data/compounds';

export interface BondingAttempt {
  element1: string;
  element2: string;
  bondType: 'single' | 'double' | 'triple';
  success: boolean;
  reason?: string;
}

export interface ElectronConfiguration {
  element: string;
  valenceElectrons: number;
  availableElectrons: number;
  bondedElectrons: number;
  octetSatisfied: boolean;
}

export interface ReactionResult {
  success: boolean;
  products?: Compound[];
  energyChange: number;
  reactionType: 'synthesis' | 'decomposition' | 'single-replacement' | 'double-replacement' | 'combustion';
  isExothermic: boolean;
  message: string;
}

/**
 * Calculate the number of bonds an atom can form based on valence electrons
 */
export function calculateMaxBonds(element: Element): number {
  const { valenceElectrons, maxBonds } = element;

  // Noble gases don't bond
  if (valenceElectrons === 8 || (element.symbol === 'He' && valenceElectrons === 2)) {
    return 0;
  }

  // For most elements, max bonds is determined by the octet rule
  // Elements want 8 electrons (or 2 for hydrogen/helium)
  const targetElectrons = element.period === 1 ? 2 : 8;
  const electronsNeeded = targetElectrons - valenceElectrons;

  return Math.min(maxBonds, electronsNeeded);
}

/**
 * Check if two elements can form a bond
 */
export function canFormBond(
  element1: Element,
  element2: Element,
  bondType: 'single' | 'double' | 'triple',
  currentBonds1: number = 0,
  currentBonds2: number = 0
): BondingAttempt {
  const maxBonds1 = calculateMaxBonds(element1);
  const maxBonds2 = calculateMaxBonds(element2);

  const bondStrength = bondType === 'single' ? 1 : bondType === 'double' ? 2 : 3;

  // Check if noble gases
  if (element1.category === 'noble-gas' || element2.category === 'noble-gas') {
    return {
      element1: element1.symbol,
      element2: element2.symbol,
      bondType,
      success: false,
      reason: 'Noble gases do not form bonds',
    };
  }

  // Check if atoms have available bonding capacity
  if (currentBonds1 + bondStrength > maxBonds1) {
    return {
      element1: element1.symbol,
      element2: element2.symbol,
      bondType,
      success: false,
      reason: `${element1.symbol} has no available bonding capacity`,
    };
  }

  if (currentBonds2 + bondStrength > maxBonds2) {
    return {
      element1: element1.symbol,
      element2: element2.symbol,
      bondType,
      success: false,
      reason: `${element2.symbol} has no available bonding capacity`,
    };
  }

  // Check for realistic bond types
  // Most elements don't form triple bonds
  if (bondType === 'triple') {
    const canTripleBond = ['C', 'N', 'O'].includes(element1.symbol) &&
                          ['C', 'N', 'O'].includes(element2.symbol);
    if (!canTripleBond) {
      return {
        element1: element1.symbol,
        element2: element2.symbol,
        bondType,
        success: false,
        reason: `${element1.symbol} and ${element2.symbol} cannot form triple bonds`,
      };
    }
  }

  // Check for realistic double bonds
  if (bondType === 'double') {
    const canDoubleBond = ['C', 'N', 'O', 'S', 'P'].includes(element1.symbol) &&
                          ['C', 'N', 'O', 'S', 'P'].includes(element2.symbol);
    if (!canDoubleBond) {
      return {
        element1: element1.symbol,
        element2: element2.symbol,
        bondType,
        success: false,
        reason: `${element1.symbol} and ${element2.symbol} cannot form double bonds`,
      };
    }
  }

  return {
    element1: element1.symbol,
    element2: element2.symbol,
    bondType,
    success: true,
  };
}

/**
 * Calculate bond strength based on elements and bond type
 */
export function calculateBondStrength(
  element1: Element,
  element2: Element,
  bondType: 'single' | 'double' | 'triple'
): number {
  // Base strength on electronegativity difference and bond type
  const electronegDiff = Math.abs(element1.electronegativity - element2.electronegativity);

  let baseStrength = 200; // kJ/mol

  // Adjust for bond type
  if (bondType === 'double') baseStrength *= 1.8;
  if (bondType === 'triple') baseStrength *= 2.5;

  // Ionic character increases strength
  const ionicCharacter = electronegDiff / 4.0; // Normalized to 0-1
  baseStrength += ionicCharacter * 200;

  // Smaller atoms form stronger bonds
  const avgRadius = (element1.atomicRadius + element2.atomicRadius) / 2;
  const radiusFactor = 200 / avgRadius;
  baseStrength *= radiusFactor;

  return Math.round(baseStrength);
}

/**
 * Determine bond polarity
 */
export function getBondPolarity(element1: Element, element2: Element): 'nonpolar' | 'polar' | 'ionic' {
  const electronegDiff = Math.abs(element1.electronegativity - element2.electronegativity);

  if (electronegDiff < 0.5) return 'nonpolar';
  if (electronegDiff < 1.7) return 'polar';
  return 'ionic';
}

/**
 * Calculate electron configuration for an atom in a molecule
 */
export function calculateElectronConfig(
  elementSymbol: string,
  bonds: Bond[],
  atomIndex: number
): ElectronConfiguration {
  const element = ELEMENTS[elementSymbol];
  if (!element) {
    throw new Error(`Unknown element: ${elementSymbol}`);
  }

  // Count bonded electrons
  let bondedElectrons = 0;
  bonds.forEach(bond => {
    if (bond.atom1 === atomIndex || bond.atom2 === atomIndex) {
      bondedElectrons += bond.type === 'single' ? 2 : bond.type === 'double' ? 4 : 6;
    }
  });

  const valenceElectrons = element.valenceElectrons;
  const totalElectrons = valenceElectrons + bondedElectrons / 2; // Shared electrons
  const targetElectrons = element.period === 1 ? 2 : 8;

  return {
    element: elementSymbol,
    valenceElectrons,
    availableElectrons: valenceElectrons - bondedElectrons / 2,
    bondedElectrons,
    octetSatisfied: totalElectrons >= targetElectrons,
  };
}

/**
 * Determine molecular geometry based on VSEPR theory
 */
export function determineMolecularGeometry(
  centralAtom: Atom,
  bondedAtoms: number,
  lonePairs: number
): 'linear' | 'bent' | 'trigonal-planar' | 'tetrahedral' | 'trigonal-bipyramidal' | 'octahedral' {
  const electronPairs = bondedAtoms + lonePairs;

  if (electronPairs === 2) return 'linear';
  if (electronPairs === 3) return lonePairs === 0 ? 'trigonal-planar' : 'bent';
  if (electronPairs === 4) return lonePairs === 0 ? 'tetrahedral' : lonePairs === 1 ? 'trigonal-planar' : 'bent';
  if (electronPairs === 5) return 'trigonal-bipyramidal';
  if (electronPairs === 6) return 'octahedral';

  return 'tetrahedral';
}

/**
 * Calculate the energy change for a reaction
 */
export function calculateReactionEnergy(
  reactants: Compound[],
  products: Compound[]
): number {
  // Calculate total bond energy of reactants
  let reactantEnergy = 0;
  reactants.forEach(compound => {
    compound.bonds.forEach(bond => {
      reactantEnergy += bond.strength;
    });
  });

  // Calculate total bond energy of products
  let productEnergy = 0;
  products.forEach(compound => {
    compound.bonds.forEach(bond => {
      productEnergy += bond.strength;
    });
  });

  // Energy change = products - reactants
  // Negative = exothermic, Positive = endothermic
  return productEnergy - reactantEnergy;
}

/**
 * Calculate pH of a solution
 */
export function calculatePH(compound: Compound, concentration: number = 1.0): number | null {
  if (compound.pH === undefined) return null;

  // Simple pH calculation based on concentration
  // For acids/bases, pH changes with concentration
  const basePH = compound.pH;

  if (basePH < 7) {
    // Acid: pH decreases with concentration
    return Math.max(0, basePH - Math.log10(concentration));
  } else if (basePH > 7) {
    // Base: pH increases with concentration
    return Math.min(14, basePH + Math.log10(concentration));
  }

  return 7; // Neutral
}

/**
 * Determine state of matter at given temperature
 */
export function getStateAtTemperature(compound: Compound, temperature: number): 'solid' | 'liquid' | 'gas' {
  if (temperature < compound.meltingPoint) return 'solid';
  if (temperature < compound.boilingPoint) return 'liquid';
  return 'gas';
}

/**
 * Check if a molecule structure is valid
 */
export function validateMoleculeStructure(atoms: Atom[], bonds: Bond[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check that all atoms exist
  atoms.forEach((atom, index) => {
    const element = ELEMENTS[atom.element];
    if (!element) {
      errors.push(`Unknown element at index ${index}: ${atom.element}`);
    }
  });

  // Check that all bond references are valid
  bonds.forEach((bond, index) => {
    if (bond.atom1 < 0 || bond.atom1 >= atoms.length) {
      errors.push(`Bond ${index} references invalid atom1: ${bond.atom1}`);
    }
    if (bond.atom2 < 0 || bond.atom2 >= atoms.length) {
      errors.push(`Bond ${index} references invalid atom2: ${bond.atom2}`);
    }
    if (bond.atom1 === bond.atom2) {
      errors.push(`Bond ${index} connects atom to itself`);
    }
  });

  // Check octet rule for each atom
  atoms.forEach((atom, index) => {
    const element = ELEMENTS[atom.element];
    if (!element) return;

    const config = calculateElectronConfig(atom.element, bonds, index);

    // Noble gases should not be bonded
    if (element.category === 'noble-gas' && config.bondedElectrons > 0) {
      errors.push(`${atom.element} (noble gas) should not form bonds`);
    }

    // Check if octet is overfilled
    const bondCount = bonds.filter(b => b.atom1 === index || b.atom2 === index).length;
    const maxBonds = calculateMaxBonds(element);

    if (bondCount > maxBonds) {
      errors.push(`${atom.element} at index ${index} has too many bonds (${bondCount} > ${maxBonds})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate dipole moment (simplified)
 */
export function calculateDipoleMoment(compound: Compound): number {
  let totalDipole = 0;

  compound.bonds.forEach(bond => {
    const atom1 = compound.atoms[bond.atom1];
    const atom2 = compound.atoms[bond.atom2];

    const element1 = ELEMENTS[atom1.element];
    const element2 = ELEMENTS[atom2.element];

    if (!element1 || !element2) return;

    const electronegDiff = Math.abs(element1.electronegativity - element2.electronegativity);
    totalDipole += electronegDiff;
  });

  return totalDipole;
}

/**
 * Simulate a chemical reaction
 */
export function simulateReaction(
  reactants: Compound[],
  temperature: number = 298,
  pressure: number = 1
): ReactionResult {
  // This is a simplified simulation
  // In a real implementation, this would use thermodynamics and kinetics

  // Count atoms
  const atomCount: Record<string, number> = {};
  reactants.forEach(compound => {
    compound.atoms.forEach(atom => {
      atomCount[atom.element] = (atomCount[atom.element] || 0) + 1;
    });
  });

  // Determine reaction type based on reactants
  let reactionType: ReactionResult['reactionType'] = 'synthesis';
  let energyChange = 0;

  if (reactants.length === 1) {
    reactionType = 'decomposition';
    energyChange = 100; // Endothermic
  } else if (reactants.length === 2) {
    // Check for combustion (oxygen present)
    if (atomCount['O']) {
      reactionType = 'combustion';
      energyChange = -500; // Exothermic
    } else {
      reactionType = 'synthesis';
      energyChange = -50; // Slightly exothermic
    }
  }

  const isExothermic = energyChange < 0;

  return {
    success: true,
    energyChange,
    reactionType,
    isExothermic,
    message: `${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)} reaction ${
      isExothermic ? 'releases' : 'absorbs'
    } ${Math.abs(energyChange)} kJ/mol`,
  };
}

/**
 * Generate random available elements for a level
 */
export function generateRandomElements(count: number, difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master'): Element[] {
  const allElements = Object.values(ELEMENTS);

  let pool: Element[];

  switch (difficulty) {
    case 'easy':
      // Period 1-2 elements
      pool = allElements.filter(e => e.period <= 2);
      break;
    case 'medium':
      // Period 1-3 elements
      pool = allElements.filter(e => e.period <= 3);
      break;
    case 'hard':
      // All elements
      pool = allElements;
      break;
  }

  // Shuffle and take count elements
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Score a molecule based on complexity and accuracy
 */
export function scoreMolecule(
  builtCompound: { atoms: Atom[]; bonds: Bond[] },
  targetCompound: Compound
): {
  score: number;
  correct: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Check atom count
  if (builtCompound.atoms.length !== targetCompound.atoms.length) {
    feedback.push(`Incorrect number of atoms: ${builtCompound.atoms.length} vs ${targetCompound.atoms.length}`);
    return { score: 0, correct: false, feedback };
  }

  // Check atom types
  const builtElements = builtCompound.atoms.map(a => a.element).sort();
  const targetElements = targetCompound.atoms.map(a => a.element).sort();

  if (JSON.stringify(builtElements) !== JSON.stringify(targetElements)) {
    feedback.push('Incorrect elements used');
    return { score: 0, correct: false, feedback };
  }

  score += 50; // Correct atoms

  // Check bond count
  if (builtCompound.bonds.length !== targetCompound.bonds.length) {
    feedback.push(`Incorrect number of bonds: ${builtCompound.bonds.length} vs ${targetCompound.bonds.length}`);
    return { score, correct: false, feedback };
  }

  score += 30; // Correct bond count

  // Check bond types
  const validation = validateMoleculeStructure(builtCompound.atoms, builtCompound.bonds);
  if (!validation.valid) {
    feedback.push(...validation.errors);
    return { score, correct: false, feedback };
  }

  score += 20; // Valid structure

  feedback.push('Perfect! Molecule created correctly!');
  return { score: 100, correct: true, feedback };
}
