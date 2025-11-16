// Genetic code and trait definitions
// Based on real biology but simplified for gameplay

export type Nucleotide = 'A' | 'T' | 'G' | 'C';
export type Codon = string; // 3 nucleotides
export type AminoAcid = string;

// Standard genetic code - codon to amino acid mapping
export const GENETIC_CODE: Record<Codon, AminoAcid> = {
  // Phenylalanine
  'UUU': 'Phe', 'UUC': 'Phe',
  // Leucine
  'UUA': 'Leu', 'UUG': 'Leu', 'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
  // Isoleucine
  'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile',
  // Methionine (Start codon)
  'AUG': 'Met',
  // Valine
  'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
  // Serine
  'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser', 'AGU': 'Ser', 'AGC': 'Ser',
  // Proline
  'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
  // Threonine
  'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
  // Alanine
  'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
  // Tyrosine
  'UAU': 'Tyr', 'UAC': 'Tyr',
  // Stop codons
  'UAA': 'STOP', 'UAG': 'STOP', 'UGA': 'STOP',
  // Histidine
  'CAU': 'His', 'CAC': 'His',
  // Glutamine
  'CAA': 'Gln', 'CAG': 'Gln',
  // Asparagine
  'AAU': 'Asn', 'AAC': 'Asn',
  // Lysine
  'AAA': 'Lys', 'AAG': 'Lys',
  // Aspartic acid
  'GAU': 'Asp', 'GAC': 'Asp',
  // Glutamic acid
  'GAA': 'Glu', 'GAG': 'Glu',
  // Cysteine
  'UGU': 'Cys', 'UGC': 'Cys',
  // Tryptophan
  'UGG': 'Trp',
  // Arginine
  'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg', 'AGA': 'Arg', 'AGG': 'Arg',
  // Glycine
  'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
};

// Trait definitions - proteins control traits
export interface Trait {
  id: string;
  name: string;
  description: string;
  proteinSequence: AminoAcid[]; // Required amino acid sequence
  category: 'physical' | 'metabolic' | 'behavioral' | 'defensive';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  visual: {
    color?: string;
    pattern?: string;
    size?: number;
    glow?: boolean;
  };
}

export const TRAITS: Trait[] = [
  // Physical traits
  {
    id: 'blue_pigment',
    name: 'Blue Pigmentation',
    description: 'Produces blue color pigment',
    proteinSequence: ['Met', 'Ala', 'Gly', 'Ile', 'Cys'],
    category: 'physical',
    rarity: 'common',
    visual: { color: '#3b82f6' },
  },
  {
    id: 'red_pigment',
    name: 'Red Pigmentation',
    description: 'Produces red color pigment',
    proteinSequence: ['Met', 'Val', 'Arg', 'Phe', 'Tyr'],
    category: 'physical',
    rarity: 'common',
    visual: { color: '#ef4444' },
  },
  {
    id: 'green_pigment',
    name: 'Green Pigmentation',
    description: 'Produces chlorophyll-like pigment',
    proteinSequence: ['Met', 'Gly', 'Leu', 'Ser', 'Ala'],
    category: 'physical',
    rarity: 'common',
    visual: { color: '#22c55e' },
  },
  {
    id: 'large_size',
    name: 'Gigantism',
    description: 'Increases organism size',
    proteinSequence: ['Met', 'Leu', 'Leu', 'Val', 'Ile', 'Pro'],
    category: 'physical',
    rarity: 'uncommon',
    visual: { size: 1.5 },
  },
  {
    id: 'small_size',
    name: 'Miniaturization',
    description: 'Decreases organism size',
    proteinSequence: ['Met', 'Ala', 'Ala', 'Ser', 'Thr'],
    category: 'physical',
    rarity: 'uncommon',
    visual: { size: 0.6 },
  },
  {
    id: 'bioluminescence',
    name: 'Bioluminescence',
    description: 'Produces light through biochemical reactions',
    proteinSequence: ['Met', 'Lys', 'Phe', 'Tyr', 'Trp', 'Cys'],
    category: 'physical',
    rarity: 'rare',
    visual: { glow: true },
  },
  {
    id: 'stripes',
    name: 'Striped Pattern',
    description: 'Creates alternating stripe pattern',
    proteinSequence: ['Met', 'Pro', 'His', 'Gln', 'Asn'],
    category: 'physical',
    rarity: 'uncommon',
    visual: { pattern: 'stripes' },
  },
  {
    id: 'spots',
    name: 'Spotted Pattern',
    description: 'Creates spotted pattern',
    proteinSequence: ['Met', 'Asp', 'Glu', 'Lys', 'Arg'],
    category: 'physical',
    rarity: 'uncommon',
    visual: { pattern: 'spots' },
  },

  // Metabolic traits
  {
    id: 'fast_metabolism',
    name: 'Rapid Metabolism',
    description: 'Processes energy quickly',
    proteinSequence: ['Met', 'Glu', 'Asp', 'Lys', 'Thr', 'Ser'],
    category: 'metabolic',
    rarity: 'uncommon',
    visual: {},
  },
  {
    id: 'efficient_metabolism',
    name: 'Efficient Metabolism',
    description: 'Uses energy efficiently',
    proteinSequence: ['Met', 'Thr', 'Ser', 'Ala', 'Gly', 'Val'],
    category: 'metabolic',
    rarity: 'rare',
    visual: {},
  },
  {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    description: 'Converts light into energy',
    proteinSequence: ['Met', 'Gly', 'Gly', 'Leu', 'Cys', 'Tyr', 'Phe'],
    category: 'metabolic',
    rarity: 'rare',
    visual: { color: '#10b981' },
  },

  // Defensive traits
  {
    id: 'toxin_production',
    name: 'Toxin Production',
    description: 'Produces defensive toxins',
    proteinSequence: ['Met', 'Cys', 'Cys', 'Trp', 'Tyr', 'His'],
    category: 'defensive',
    rarity: 'rare',
    visual: { color: '#8b5cf6' },
  },
  {
    id: 'thick_membrane',
    name: 'Reinforced Membrane',
    description: 'Provides physical protection',
    proteinSequence: ['Met', 'Pro', 'Pro', 'Val', 'Ile', 'Leu'],
    category: 'defensive',
    rarity: 'uncommon',
    visual: {},
  },
  {
    id: 'camouflage',
    name: 'Adaptive Camouflage',
    description: 'Blends with environment',
    proteinSequence: ['Met', 'Ala', 'Ser', 'Thr', 'Gly', 'Phe', 'Tyr'],
    category: 'defensive',
    rarity: 'legendary',
    visual: { pattern: 'gradient' },
  },

  // Behavioral traits
  {
    id: 'rapid_reproduction',
    name: 'Rapid Reproduction',
    description: 'Reproduces quickly',
    proteinSequence: ['Met', 'Arg', 'Lys', 'His', 'Gln'],
    category: 'behavioral',
    rarity: 'uncommon',
    visual: {},
  },
  {
    id: 'social_behavior',
    name: 'Social Clustering',
    description: 'Forms groups with others',
    proteinSequence: ['Met', 'Asn', 'Gln', 'Ser', 'Thr', 'Ala'],
    category: 'behavioral',
    rarity: 'rare',
    visual: {},
  },
];

// Gene structure
export interface Gene {
  id: string;
  name: string;
  dnaSequence: Nucleotide[]; // DNA sequence (A, T, G, C)
  location: number; // Position on chromosome
  length: number;
  regulatoryRegion?: {
    promoter: Nucleotide[];
    enhancers: Nucleotide[][];
  };
}

// Mutation types
export interface Mutation {
  type: 'substitution' | 'insertion' | 'deletion' | 'duplication' | 'inversion';
  position: number;
  nucleotides?: Nucleotide[];
  length?: number;
}

// CRISPR operation
export interface CRISPROperation {
  targetSequence: Nucleotide[];
  newSequence: Nucleotide[];
  position: number;
  guideRNA: Nucleotide[];
}

// Start codons for gene identification
export const START_CODON = 'ATG'; // In DNA (AUG in RNA)
export const STOP_CODONS = ['TAA', 'TAG', 'TGA']; // In DNA

// Helper functions
export function generateRandomDNA(length: number): Nucleotide[] {
  const nucleotides: Nucleotide[] = ['A', 'T', 'G', 'C'];
  const dna: Nucleotide[] = [];
  for (let i = 0; i < length; i++) {
    dna.push(nucleotides[Math.floor(Math.random() * 4)]);
  }
  return dna;
}

export function complementaryStrand(strand: Nucleotide[]): Nucleotide[] {
  const complement: Record<Nucleotide, Nucleotide> = {
    'A': 'T',
    'T': 'A',
    'G': 'C',
    'C': 'G',
  };
  return strand.map(n => complement[n]);
}

export function dnaToRNA(dna: Nucleotide[]): string[] {
  // Transcription: DNA -> RNA (T becomes U)
  return dna.map(n => n === 'T' ? 'U' : n);
}

export function getCodonAt(rna: string[], position: number): string {
  if (position + 2 >= rna.length) return '';
  return rna[position] + rna[position + 1] + rna[position + 2];
}
