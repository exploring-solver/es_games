import { Atom, Bond, Compound } from '../data/compounds';
import { ELEMENTS, Element } from '../data/elements';
import { calculateElectronConfig, validateMoleculeStructure } from './chemistryEngine';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface MoleculeMatch {
  matches: boolean;
  similarity: number;
  differences: string[];
}

/**
 * Comprehensive molecule validation
 */
export function validateMolecule(atoms: Atom[], bonds: Bond[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 1. Basic structure validation
  const structureValidation = validateMoleculeStructure(atoms, bonds);
  if (!structureValidation.valid) {
    errors.push(...structureValidation.errors);
    return { isValid: false, errors, warnings, score: 0 };
  }

  // 2. Check for disconnected atoms
  const connectedAtoms = new Set<number>();
  bonds.forEach(bond => {
    connectedAtoms.add(bond.atom1);
    connectedAtoms.add(bond.atom2);
  });

  atoms.forEach((atom, index) => {
    if (!connectedAtoms.has(index)) {
      const element = ELEMENTS[atom.element];
      // Only allow disconnected noble gases or single atoms
      if (element && element.category !== 'noble-gas' && atoms.length > 1) {
        warnings.push(`Atom ${atom.element} at index ${index} is not bonded`);
        score -= 5;
      }
    }
  });

  // 3. Check formal charges
  atoms.forEach((atom, index) => {
    const element = ELEMENTS[atom.element];
    if (!element) return;

    const config = calculateElectronConfig(atom.element, bonds, index);

    // Warn if octet rule is not satisfied (unless it's a valid exception)
    if (!config.octetSatisfied) {
      const isException = ['H', 'He', 'B', 'Be'].includes(atom.element);
      if (!isException) {
        warnings.push(`${atom.element} at index ${index} does not satisfy octet rule`);
        score -= 10;
      }
    }
  });

  // 4. Check for duplicate bonds
  const bondSet = new Set<string>();
  bonds.forEach((bond, index) => {
    const key1 = `${bond.atom1}-${bond.atom2}-${bond.type}`;
    const key2 = `${bond.atom2}-${bond.atom1}-${bond.type}`;

    if (bondSet.has(key1) || bondSet.has(key2)) {
      errors.push(`Duplicate bond at index ${index}`);
      score = 0;
    }

    bondSet.add(key1);
  });

  // 5. Check for realistic bond angles (simplified)
  if (bonds.length >= 2) {
    // Group bonds by atom
    const atomBonds: Map<number, number[]> = new Map();
    bonds.forEach((bond, bondIndex) => {
      if (!atomBonds.has(bond.atom1)) atomBonds.set(bond.atom1, []);
      if (!atomBonds.has(bond.atom2)) atomBonds.set(bond.atom2, []);
      atomBonds.get(bond.atom1)!.push(bondIndex);
      atomBonds.get(bond.atom2)!.push(bondIndex);
    });

    // Check for atoms with too many bonds in close proximity
    atomBonds.forEach((bondIndices, atomIndex) => {
      if (bondIndices.length > 4) {
        warnings.push(`Atom ${atoms[atomIndex].element} at index ${atomIndex} has unusual number of bonds: ${bondIndices.length}`);
        score -= 15;
      }
    });
  }

  // 6. Check for valid bond types
  bonds.forEach(bond => {
    const atom1 = atoms[bond.atom1];
    const atom2 = atoms[bond.atom2];
    const element1 = ELEMENTS[atom1.element];
    const element2 = ELEMENTS[atom2.element];

    if (!element1 || !element2) return;

    // Check if bond type is realistic
    if (bond.type === 'triple') {
      const validTriple = ['C', 'N'].includes(element1.symbol) && ['C', 'N', 'O'].includes(element2.symbol);
      if (!validTriple) {
        errors.push(`Invalid triple bond between ${element1.symbol} and ${element2.symbol}`);
        score = 0;
      }
    }

    if (bond.type === 'double') {
      const validDouble = ['C', 'N', 'O', 'S'].includes(element1.symbol) &&
                         ['C', 'N', 'O', 'S'].includes(element2.symbol);
      if (!validDouble) {
        warnings.push(`Unusual double bond between ${element1.symbol} and ${element2.symbol}`);
        score -= 5;
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Compare two molecules for similarity
 */
export function compareMolecules(
  molecule1: { atoms: Atom[]; bonds: Bond[] },
  molecule2: { atoms: Atom[]; bonds: Bond[] }
): MoleculeMatch {
  const differences: string[] = [];
  let similarity = 100;

  // Check atom count
  if (molecule1.atoms.length !== molecule2.atoms.length) {
    differences.push(`Different atom counts: ${molecule1.atoms.length} vs ${molecule2.atoms.length}`);
    similarity -= 30;
  }

  // Check bond count
  if (molecule1.bonds.length !== molecule2.bonds.length) {
    differences.push(`Different bond counts: ${molecule1.bonds.length} vs ${molecule2.bonds.length}`);
    similarity -= 30;
  }

  // Count elements in each molecule
  const elements1: Record<string, number> = {};
  const elements2: Record<string, number> = {};

  molecule1.atoms.forEach(atom => {
    elements1[atom.element] = (elements1[atom.element] || 0) + 1;
  });

  molecule2.atoms.forEach(atom => {
    elements2[atom.element] = (elements2[atom.element] || 0) + 1;
  });

  // Compare element composition
  const allElements = new Set([...Object.keys(elements1), ...Object.keys(elements2)]);
  allElements.forEach(element => {
    const count1 = elements1[element] || 0;
    const count2 = elements2[element] || 0;

    if (count1 !== count2) {
      differences.push(`Different ${element} count: ${count1} vs ${count2}`);
      similarity -= 10;
    }
  });

  // Compare bond types
  const bondTypes1: Record<string, number> = { single: 0, double: 0, triple: 0 };
  const bondTypes2: Record<string, number> = { single: 0, double: 0, triple: 0 };

  molecule1.bonds.forEach(bond => bondTypes1[bond.type]++);
  molecule2.bonds.forEach(bond => bondTypes2[bond.type]++);

  ['single', 'double', 'triple'].forEach(type => {
    const key = type as 'single' | 'double' | 'triple';
    if (bondTypes1[key] !== bondTypes2[key]) {
      differences.push(`Different ${type} bond count: ${bondTypes1[key]} vs ${bondTypes2[key]}`);
      similarity -= 15;
    }
  });

  similarity = Math.max(0, similarity);

  return {
    matches: similarity === 100 && differences.length === 0,
    similarity,
    differences,
  };
}

/**
 * Check if a molecule matches a target compound
 */
export function matchesTarget(
  builtMolecule: { atoms: Atom[]; bonds: Bond[] },
  targetCompound: Compound
): MoleculeMatch {
  return compareMolecules(builtMolecule, {
    atoms: targetCompound.atoms,
    bonds: targetCompound.bonds,
  });
}

/**
 * Calculate molecular formula from atoms
 */
export function calculateMolecularFormula(atoms: Atom[]): string {
  const elementCount: Record<string, number> = {};

  atoms.forEach(atom => {
    elementCount[atom.element] = (elementCount[atom.element] || 0) + 1;
  });

  // Sort elements: C, H, then alphabetically
  const sortedElements = Object.keys(elementCount).sort((a, b) => {
    if (a === 'C') return -1;
    if (b === 'C') return 1;
    if (a === 'H') return -1;
    if (b === 'H') return 1;
    return a.localeCompare(b);
  });

  let formula = '';
  sortedElements.forEach(element => {
    const count = elementCount[element];
    formula += element;
    if (count > 1) {
      // Convert to subscript numbers
      formula += count.toString().split('').map(d => String.fromCharCode(8320 + parseInt(d))).join('');
    }
  });

  return formula;
}

/**
 * Calculate molar mass from atoms
 */
export function calculateMolarMass(atoms: Atom[]): number {
  let totalMass = 0;

  atoms.forEach(atom => {
    const element = ELEMENTS[atom.element];
    if (element) {
      totalMass += element.atomicMass;
    }
  });

  return Math.round(totalMass * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Check if molecule is stable
 */
export function isStable(atoms: Atom[], bonds: Bond[]): boolean {
  // A molecule is stable if:
  // 1. All atoms satisfy octet rule (or duet for H/He)
  // 2. No formal charges exceed ±2
  // 3. Structure is connected

  const validation = validateMolecule(atoms, bonds);

  if (!validation.isValid) return false;

  // Check connectivity
  if (atoms.length > 1 && bonds.length === 0) return false;

  // All atoms should satisfy electron requirements
  for (let i = 0; i < atoms.length; i++) {
    const config = calculateElectronConfig(atoms[i].element, bonds, i);
    const element = ELEMENTS[atoms[i].element];

    if (!element) return false;

    // Noble gases should be alone
    if (element.category === 'noble-gas' && config.bondedElectrons > 0) {
      return false;
    }

    // Check if octet/duet is satisfied (with exceptions)
    if (!config.octetSatisfied) {
      const exceptions = ['H', 'He', 'B', 'Be'];
      if (!exceptions.includes(atoms[i].element)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get hints for building a molecule
 */
export function getHints(targetCompound: Compound): string[] {
  const hints: string[] = [];

  // Hint about number of atoms
  const elementCount: Record<string, number> = {};
  targetCompound.atoms.forEach(atom => {
    elementCount[atom.element] = (elementCount[atom.element] || 0) + 1;
  });

  Object.entries(elementCount).forEach(([element, count]) => {
    hints.push(`Use ${count} ${element} atom${count > 1 ? 's' : ''}`);
  });

  // Hint about bond types
  const bondTypes: Record<string, number> = { single: 0, double: 0, triple: 0 };
  targetCompound.bonds.forEach(bond => bondTypes[bond.type]++);

  if (bondTypes.double > 0) {
    hints.push(`Contains ${bondTypes.double} double bond${bondTypes.double > 1 ? 's' : ''}`);
  }
  if (bondTypes.triple > 0) {
    hints.push(`Contains ${bondTypes.triple} triple bond${bondTypes.triple > 1 ? 's' : ''}`);
  }

  // Hint about geometry
  hints.push(`Molecular geometry: ${targetCompound.geometry}`);

  // Hint about polarity
  hints.push(`Polarity: ${targetCompound.polarity}`);

  return hints;
}

/**
 * Check if a partial molecule can lead to the target
 */
export function canReachTarget(
  currentMolecule: { atoms: Atom[]; bonds: Bond[] },
  targetCompound: Compound,
  availableElements: Element[]
): {
  possible: boolean;
  suggestions: string[];
} {
  const suggestions: string[] = [];

  // Count current elements
  const currentElements: Record<string, number> = {};
  currentMolecule.atoms.forEach(atom => {
    currentElements[atom.element] = (currentElements[atom.element] || 0) + 1;
  });

  // Count target elements
  const targetElements: Record<string, number> = {};
  targetCompound.atoms.forEach(atom => {
    targetElements[atom.element] = (targetElements[atom.element] || 0) + 1;
  });

  // Check if we have too many of any element
  let possible = true;
  Object.entries(currentElements).forEach(([element, count]) => {
    const targetCount = targetElements[element] || 0;
    if (count > targetCount) {
      possible = false;
      suggestions.push(`Too many ${element} atoms (${count} vs ${targetCount})`);
    }
  });

  // Suggest next elements to add
  if (possible) {
    Object.entries(targetElements).forEach(([element, targetCount]) => {
      const currentCount = currentElements[element] || 0;
      if (currentCount < targetCount) {
        const needed = targetCount - currentCount;
        suggestions.push(`Add ${needed} more ${element} atom${needed > 1 ? 's' : ''}`);
      }
    });
  }

  return { possible, suggestions };
}

/**
 * Detect common functional groups
 */
export function detectFunctionalGroups(atoms: Atom[], bonds: Bond[]): string[] {
  const groups: string[] = [];

  // Check for hydroxyl (-OH)
  atoms.forEach((atom, index) => {
    if (atom.element === 'O') {
      const oBonds = bonds.filter(b => b.atom1 === index || b.atom2 === index);
      const hasH = oBonds.some(b => {
        const otherIndex = b.atom1 === index ? b.atom2 : b.atom1;
        return atoms[otherIndex].element === 'H';
      });
      if (hasH && oBonds.length === 2) {
        groups.push('Hydroxyl (-OH)');
      }
    }
  });

  // Check for carbonyl (C=O)
  bonds.forEach(bond => {
    if (bond.type === 'double') {
      const atom1 = atoms[bond.atom1];
      const atom2 = atoms[bond.atom2];
      if ((atom1.element === 'C' && atom2.element === 'O') ||
          (atom1.element === 'O' && atom2.element === 'C')) {
        groups.push('Carbonyl (C=O)');
      }
    }
  });

  // Check for carboxyl (-COOH)
  const hasCarboxyl = groups.includes('Carbonyl (C=O)') && groups.includes('Hydroxyl (-OH)');
  if (hasCarboxyl) {
    groups.push('Carboxyl (-COOH)');
  }

  return [...new Set(groups)]; // Remove duplicates
}
