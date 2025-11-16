// Calculate organism traits from genetic expression
import { AminoAcid, Trait, TRAITS } from '../data/genes';
import { Nucleotide } from '../data/genes';
import { expressGenes } from './geneticsEngine';

export interface TraitMatch {
  trait: Trait;
  confidence: number; // 0-100, how well the protein matches
  proteinIndex: number;
}

export interface OrganismTraits {
  activeTraits: TraitMatch[];
  visualProperties: {
    color: string;
    pattern?: string;
    size: number;
    glow: boolean;
    opacity: number;
  };
  stats: {
    metabolism: number;
    defense: number;
    reproduction: number;
    social: number;
  };
}

/**
 * Calculate how well a protein sequence matches a trait's required sequence
 */
function calculateProteinMatch(protein: AminoAcid[], traitProtein: AminoAcid[]): number {
  if (protein.length === 0 || traitProtein.length === 0) return 0;

  // Check for exact match
  if (protein.length === traitProtein.length) {
    let exactMatches = 0;
    for (let i = 0; i < protein.length; i++) {
      if (protein[i] === traitProtein[i]) exactMatches++;
    }
    const exactScore = (exactMatches / traitProtein.length) * 100;
    if (exactScore === 100) return 100; // Perfect match!
    if (exactScore >= 80) return exactScore; // Very close
  }

  // Check if trait protein is a subsequence of the organism's protein
  let traitIndex = 0;
  for (let i = 0; i < protein.length && traitIndex < traitProtein.length; i++) {
    if (protein[i] === traitProtein[traitIndex]) {
      traitIndex++;
    }
  }

  const subsequenceScore = (traitIndex / traitProtein.length) * 100;

  // Check for partial continuous match (sliding window)
  let bestContinuousMatch = 0;
  for (let start = 0; start <= protein.length - traitProtein.length; start++) {
    let matches = 0;
    for (let i = 0; i < traitProtein.length; i++) {
      if (protein[start + i] === traitProtein[i]) matches++;
    }
    const matchScore = (matches / traitProtein.length) * 100;
    bestContinuousMatch = Math.max(bestContinuousMatch, matchScore);
  }

  // Return the best score from different matching strategies
  return Math.max(subsequenceScore, bestContinuousMatch);
}

/**
 * Determine which traits are expressed from the organism's DNA
 */
export function calculateTraits(dna: Nucleotide[]): OrganismTraits {
  const expression = expressGenes(dna);
  const activeTraits: TraitMatch[] = [];

  // Check each protein against all possible traits
  expression.proteins.forEach((protein, proteinIndex) => {
    TRAITS.forEach(trait => {
      const confidence = calculateProteinMatch(protein, trait.proteinSequence);

      // Trait is active if confidence is high enough
      const thresholds = {
        common: 85,
        uncommon: 90,
        rare: 95,
        legendary: 98,
      };

      if (confidence >= thresholds[trait.rarity]) {
        activeTraits.push({
          trait,
          confidence,
          proteinIndex,
        });
      }
    });
  });

  // Calculate visual properties from active traits
  const visualProperties = calculateVisualProperties(activeTraits);

  // Calculate stats from active traits
  const stats = calculateStats(activeTraits);

  return {
    activeTraits,
    visualProperties,
    stats,
  };
}

/**
 * Calculate visual appearance from traits
 */
function calculateVisualProperties(traits: TraitMatch[]): OrganismTraits['visualProperties'] {
  let color = '#9ca3af'; // Default gray
  let pattern: string | undefined = undefined;
  let size = 1.0;
  let glow = false;
  let opacity = 1.0;

  // Process traits in order of confidence
  const sortedTraits = [...traits].sort((a, b) => b.confidence - a.confidence);

  for (const match of sortedTraits) {
    const visual = match.trait.visual;

    // Color - mix if multiple
    if (visual.color) {
      if (color === '#9ca3af') {
        color = visual.color;
      } else {
        // Mix colors (simple average for demo)
        color = blendColors(color, visual.color);
      }
    }

    // Pattern - last one wins (could be enhanced)
    if (visual.pattern) {
      pattern = visual.pattern;
    }

    // Size - multiply effects
    if (visual.size) {
      size *= visual.size;
    }

    // Glow - any glow trait activates it
    if (visual.glow) {
      glow = true;
    }
  }

  // Ensure size is in reasonable range
  size = Math.max(0.3, Math.min(2.5, size));

  return { color, pattern, size, glow, opacity };
}

/**
 * Calculate organism stats from traits
 */
function calculateStats(traits: TraitMatch[]): OrganismTraits['stats'] {
  let metabolism = 50;
  let defense = 50;
  let reproduction = 50;
  let social = 50;

  for (const match of traits) {
    const trait = match.trait;
    const bonus = (match.confidence / 100) * 20; // Up to +20 per trait

    switch (trait.category) {
      case 'metabolic':
        metabolism += bonus;
        if (trait.id === 'fast_metabolism') metabolism += 10;
        if (trait.id === 'efficient_metabolism') metabolism += 15;
        if (trait.id === 'photosynthesis') metabolism += 20;
        break;

      case 'defensive':
        defense += bonus;
        if (trait.id === 'toxin_production') defense += 15;
        if (trait.id === 'thick_membrane') defense += 10;
        if (trait.id === 'camouflage') defense += 25;
        break;

      case 'behavioral':
        if (trait.id === 'rapid_reproduction') reproduction += bonus + 15;
        if (trait.id === 'social_behavior') social += bonus + 20;
        break;

      case 'physical':
        // Physical traits provide minor bonuses
        metabolism += bonus * 0.3;
        defense += bonus * 0.3;
        break;
    }
  }

  // Normalize to 0-100 range
  return {
    metabolism: Math.max(0, Math.min(100, metabolism)),
    defense: Math.max(0, Math.min(100, defense)),
    reproduction: Math.max(0, Math.min(100, reproduction)),
    social: Math.max(0, Math.min(100, social)),
  };
}

/**
 * Blend two hex colors
 */
function blendColors(color1: string, color2: string): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round((r1 + r2) / 2);
  const g = Math.round((g1 + g2) / 2);
  const b = Math.round((b1 + b2) / 2);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Check if organism matches level objectives
 */
export function checkLevelCompletion(
  activeTraits: TraitMatch[],
  targetTraits: string[],
  optionalTraits?: string[]
): {
  complete: boolean;
  matched: string[];
  missing: string[];
  bonus: string[];
  stars: number;
} {
  const traitIds = activeTraits.map(t => t.trait.id);
  const matched = targetTraits.filter(id => traitIds.includes(id));
  const missing = targetTraits.filter(id => !traitIds.includes(id));
  const bonus = optionalTraits?.filter(id => traitIds.includes(id)) || [];

  const complete = missing.length === 0;

  // Calculate stars (1-3)
  let stars = 0;
  if (complete) {
    stars = 1; // Base completion
    if (matched.length === targetTraits.length) stars = 2; // All required
    if (bonus.length > 0) stars = 3; // With bonus traits
  }

  return {
    complete,
    matched,
    missing,
    bonus,
    stars,
  };
}

/**
 * Get trait by ID
 */
export function getTraitById(id: string): Trait | undefined {
  return TRAITS.find(t => t.id === id);
}

/**
 * Get all traits by category
 */
export function getTraitsByCategory(category: Trait['category']): Trait[] {
  return TRAITS.filter(t => t.category === category);
}

/**
 * Get all traits by rarity
 */
export function getTraitsByRarity(rarity: Trait['rarity']): Trait[] {
  return TRAITS.filter(t => t.rarity === rarity);
}

/**
 * Calculate organism score for competitive mode
 */
export function calculateOrganismScore(
  activeTraits: TraitMatch[],
  dna: Nucleotide[],
  timeSeconds: number,
  mutationCount: number
): number {
  let score = 0;

  // Points for each trait (higher rarity = more points)
  const rarityPoints = { common: 100, uncommon: 250, rare: 500, legendary: 1000 };
  for (const match of activeTraits) {
    const basePoints = rarityPoints[match.trait.rarity];
    const confidenceMultiplier = match.confidence / 100;
    score += basePoints * confidenceMultiplier;
  }

  // Time bonus (faster = better)
  const timeBonus = Math.max(0, 1000 - timeSeconds * 2);
  score += timeBonus;

  // Efficiency bonus (fewer mutations = better)
  const efficiencyBonus = Math.max(0, 500 - mutationCount * 10);
  score += efficiencyBonus;

  // DNA quality bonus
  const dnaLengthBonus = Math.max(0, 200 - Math.abs(dna.length - 100));
  score += dnaLengthBonus;

  return Math.round(score);
}

/**
 * Generate trait hint for player
 */
export function generateTraitHint(traitId: string): string {
  const trait = getTraitById(traitId);
  if (!trait) return 'Unknown trait';

  const sequence = trait.proteinSequence.join('-');
  const category = trait.category.charAt(0).toUpperCase() + trait.category.slice(1);

  return `${trait.name} (${category}): Requires protein ${sequence}`;
}

/**
 * Predict trait from partial protein sequence
 */
export function predictTrait(partialProtein: AminoAcid[]): Trait[] {
  const predictions: { trait: Trait; score: number }[] = [];

  for (const trait of TRAITS) {
    const score = calculateProteinMatch(partialProtein, trait.proteinSequence);
    if (score > 50) {
      // At least 50% match to be considered
      predictions.push({ trait, score });
    }
  }

  return predictions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 predictions
    .map(p => p.trait);
}
