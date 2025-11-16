// Core genetics engine - handles DNA/RNA/Protein operations
import {
  Nucleotide,
  Codon,
  AminoAcid,
  GENETIC_CODE,
  START_CODON,
  STOP_CODONS,
  Gene,
  Mutation,
  CRISPROperation,
  dnaToRNA,
  getCodonAt,
  complementaryStrand,
} from '../data/genes';

export interface TranscriptionResult {
  rna: string[];
  success: boolean;
}

export interface TranslationResult {
  protein: AminoAcid[];
  startPosition: number;
  endPosition: number;
  success: boolean;
}

export interface GeneExpressionResult {
  genes: Gene[];
  proteins: AminoAcid[][];
  totalGenes: number;
}

/**
 * Transcribe DNA to RNA
 * DNA (template strand) -> mRNA
 */
export function transcribe(dna: Nucleotide[]): TranscriptionResult {
  try {
    const rna = dnaToRNA(dna);
    return {
      rna,
      success: true,
    };
  } catch (error) {
    return {
      rna: [],
      success: false,
    };
  }
}

/**
 * Translate RNA to protein
 * mRNA -> Amino Acid sequence (protein)
 */
export function translate(rna: string[], startPos: number = 0): TranslationResult {
  const protein: AminoAcid[] = [];
  let position = startPos;

  // Find start codon if not at beginning
  if (startPos === 0) {
    let foundStart = false;
    for (let i = 0; i < rna.length - 2; i++) {
      const codon = getCodonAt(rna, i);
      if (codon === 'AUG') {
        position = i;
        foundStart = true;
        break;
      }
    }
    if (!foundStart) {
      return { protein: [], startPosition: -1, endPosition: -1, success: false };
    }
  }

  const startPosition = position;

  // Translate codons until stop codon or end of sequence
  while (position < rna.length - 2) {
    const codon = getCodonAt(rna, position);

    if (!codon || codon.length !== 3) break;

    const aminoAcid = GENETIC_CODE[codon];

    if (!aminoAcid) {
      // Unknown codon
      break;
    }

    if (aminoAcid === 'STOP') {
      // Found stop codon
      return {
        protein,
        startPosition,
        endPosition: position + 2,
        success: true,
      };
    }

    protein.push(aminoAcid);
    position += 3; // Move to next codon
  }

  // Reached end without stop codon
  return {
    protein,
    startPosition,
    endPosition: position,
    success: protein.length > 0,
  };
}

/**
 * Find all genes in a DNA sequence
 */
export function findGenes(dna: Nucleotide[]): Gene[] {
  const genes: Gene[] = [];
  const { rna } = transcribe(dna);

  if (!rna.length) return genes;

  let searchPosition = 0;
  let geneId = 0;

  while (searchPosition < rna.length - 2) {
    // Find next start codon
    let startPos = -1;
    for (let i = searchPosition; i < rna.length - 2; i++) {
      const codon = getCodonAt(rna, i);
      if (codon === 'AUG') {
        startPos = i;
        break;
      }
    }

    if (startPos === -1) break; // No more start codons

    // Try to translate from this start codon
    const translation = translate(rna, startPos);

    if (translation.success && translation.protein.length > 0) {
      // Found a valid gene!
      const geneLength = translation.endPosition - startPos + 1;
      const geneDNA = dna.slice(startPos, translation.endPosition + 1);

      genes.push({
        id: `gene_${geneId++}`,
        name: `Gene at position ${startPos}`,
        dnaSequence: geneDNA,
        location: startPos,
        length: geneLength,
      });

      searchPosition = translation.endPosition + 1;
    } else {
      searchPosition = startPos + 3; // Move past this start codon
    }
  }

  return genes;
}

/**
 * Express all genes in DNA and get protein products
 */
export function expressGenes(dna: Nucleotide[]): GeneExpressionResult {
  const genes = findGenes(dna);
  const proteins: AminoAcid[][] = [];

  for (const gene of genes) {
    const { rna } = transcribe(gene.dnaSequence);
    const translation = translate(rna, 0);
    if (translation.success) {
      proteins.push(translation.protein);
    }
  }

  return {
    genes,
    proteins,
    totalGenes: genes.length,
  };
}

/**
 * Apply a mutation to DNA
 */
export function applyMutation(dna: Nucleotide[], mutation: Mutation): Nucleotide[] {
  const newDNA = [...dna];

  switch (mutation.type) {
    case 'substitution':
      // Replace nucleotide(s) at position
      if (mutation.nucleotides && mutation.position < newDNA.length) {
        for (let i = 0; i < mutation.nucleotides.length && mutation.position + i < newDNA.length; i++) {
          newDNA[mutation.position + i] = mutation.nucleotides[i];
        }
      }
      break;

    case 'insertion':
      // Insert nucleotide(s) at position
      if (mutation.nucleotides) {
        newDNA.splice(mutation.position, 0, ...mutation.nucleotides);
      }
      break;

    case 'deletion':
      // Delete nucleotide(s) at position
      if (mutation.length) {
        newDNA.splice(mutation.position, mutation.length);
      }
      break;

    case 'duplication':
      // Duplicate a sequence
      if (mutation.length) {
        const duplicated = newDNA.slice(mutation.position, mutation.position + mutation.length);
        newDNA.splice(mutation.position + mutation.length, 0, ...duplicated);
      }
      break;

    case 'inversion':
      // Reverse a sequence
      if (mutation.length) {
        const inverted = newDNA
          .slice(mutation.position, mutation.position + mutation.length)
          .reverse();
        newDNA.splice(mutation.position, mutation.length, ...inverted);
      }
      break;
  }

  return newDNA;
}

/**
 * Perform CRISPR-like gene editing
 */
export function performCRISPR(dna: Nucleotide[], operation: CRISPROperation): Nucleotide[] {
  const newDNA = [...dna];

  // Find target sequence
  const targetStr = operation.targetSequence.join('');
  const dnaStr = dna.join('');
  const targetIndex = dnaStr.indexOf(targetStr);

  if (targetIndex === -1) {
    console.warn('Target sequence not found');
    return newDNA;
  }

  // Replace target with new sequence
  const before = newDNA.slice(0, targetIndex);
  const after = newDNA.slice(targetIndex + operation.targetSequence.length);

  return [...before, ...operation.newSequence, ...after];
}

/**
 * Genetic crossover - combine DNA from two parents
 */
export function crossover(parent1DNA: Nucleotide[], parent2DNA: Nucleotide[], crossoverPoint?: number): Nucleotide[] {
  const minLength = Math.min(parent1DNA.length, parent2DNA.length);

  // Random crossover point if not specified
  const point = crossoverPoint ?? Math.floor(Math.random() * minLength);

  // Combine: first part from parent1, second part from parent2
  const offspring = [
    ...parent1DNA.slice(0, point),
    ...parent2DNA.slice(point),
  ];

  return offspring;
}

/**
 * Random mutation with configurable rate
 */
export function randomMutation(dna: Nucleotide[], mutationRate: number = 0.01): Nucleotide[] {
  const newDNA = [...dna];
  const nucleotides: Nucleotide[] = ['A', 'T', 'G', 'C'];

  for (let i = 0; i < newDNA.length; i++) {
    if (Math.random() < mutationRate) {
      // Random mutation type
      const mutationType = Math.random();

      if (mutationType < 0.7) {
        // Substitution (70% chance)
        const currentNuc = newDNA[i];
        const otherNucs = nucleotides.filter(n => n !== currentNuc);
        newDNA[i] = otherNucs[Math.floor(Math.random() * otherNucs.length)];
      } else if (mutationType < 0.85) {
        // Deletion (15% chance)
        newDNA.splice(i, 1);
        i--; // Adjust index
      } else {
        // Insertion (15% chance)
        const randomNuc = nucleotides[Math.floor(Math.random() * 4)];
        newDNA.splice(i, 0, randomNuc);
      }
    }
  }

  return newDNA;
}

/**
 * Calculate fitness score for an organism based on DNA quality
 */
export function calculateFitness(dna: Nucleotide[], targetLength: number = 100): number {
  const expression = expressGenes(dna);

  let fitness = 50; // Base fitness

  // Bonus for having genes
  fitness += Math.min(expression.totalGenes * 10, 30);

  // Bonus for valid proteins
  fitness += Math.min(expression.proteins.length * 5, 20);

  // Penalty for being too long or too short
  const lengthRatio = dna.length / targetLength;
  if (lengthRatio < 0.5 || lengthRatio > 2.0) {
    fitness -= 20;
  }

  // Ensure fitness is in valid range
  return Math.max(0, Math.min(100, fitness));
}

/**
 * Sequence alignment score (for comparing DNA similarity)
 */
export function alignmentScore(seq1: Nucleotide[], seq2: Nucleotide[]): number {
  const minLength = Math.min(seq1.length, seq2.length);
  let matches = 0;

  for (let i = 0; i < minLength; i++) {
    if (seq1[i] === seq2[i]) {
      matches++;
    }
  }

  // Return percentage similarity
  return (matches / minLength) * 100;
}

/**
 * Validate DNA sequence
 */
export function validateDNA(dna: Nucleotide[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (dna.length === 0) {
    errors.push('DNA sequence is empty');
  }

  if (dna.length % 3 !== 0) {
    errors.push('DNA length is not a multiple of 3 (incomplete codons)');
  }

  const validNucleotides: Nucleotide[] = ['A', 'T', 'G', 'C'];
  const invalidNucs = dna.filter(n => !validNucleotides.includes(n));
  if (invalidNucs.length > 0) {
    errors.push(`Invalid nucleotides found: ${invalidNucs.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get DNA statistics
 */
export function getDNAStats(dna: Nucleotide[]): {
  length: number;
  gcContent: number;
  atContent: number;
  geneCount: number;
  proteinCount: number;
} {
  const gcCount = dna.filter(n => n === 'G' || n === 'C').length;
  const atCount = dna.filter(n => n === 'A' || n === 'T').length;
  const expression = expressGenes(dna);

  return {
    length: dna.length,
    gcContent: (gcCount / dna.length) * 100,
    atContent: (atCount / dna.length) * 100,
    geneCount: expression.totalGenes,
    proteinCount: expression.proteins.length,
  };
}
