// DNA Strand visualization with helix animation
import React, { useState, useMemo } from 'react';
import { Nucleotide } from '../data/genes';
import { complementaryStrand } from '../data/genes';

interface DNAStrandProps {
  dna: Nucleotide[];
  selectedPosition?: number;
  highlightGenes?: boolean;
  onNucleotideClick?: (position: number, nucleotide: Nucleotide) => void;
  showComplement?: boolean;
  animate?: boolean;
  maxDisplay?: number;
}

const NUCLEOTIDE_COLORS: Record<Nucleotide, string> = {
  A: '#22c55e', // Green
  T: '#ef4444', // Red
  G: '#f59e0b', // Orange
  C: '#3b82f6', // Blue
};

export const DNAStrand: React.FC<DNAStrandProps> = ({
  dna,
  selectedPosition = -1,
  highlightGenes = false,
  onNucleotideClick,
  showComplement = true,
  animate = true,
  maxDisplay = 100,
}) => {
  const [hoveredPosition, setHoveredPosition] = useState<number>(-1);

  // Get complementary strand
  const complement = useMemo(() => {
    return showComplement ? complementaryStrand(dna) : [];
  }, [dna, showComplement]);

  // Determine which nucleotides to display
  const displayDNA = useMemo(() => {
    if (dna.length <= maxDisplay) return dna;
    // Show first portion of DNA
    return dna.slice(0, maxDisplay);
  }, [dna, maxDisplay]);

  const displayComplement = useMemo(() => {
    if (complement.length <= maxDisplay) return complement;
    return complement.slice(0, maxDisplay);
  }, [complement, maxDisplay]);

  // Find start codons for highlighting
  const startCodons = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < displayDNA.length - 2; i += 3) {
      const codon = displayDNA.slice(i, i + 3).join('');
      if (codon === 'ATG') {
        positions.push(i);
      }
    }
    return positions;
  }, [displayDNA]);

  // Check if position is in a gene region
  const isInGene = (position: number): boolean => {
    if (!highlightGenes) return false;
    return startCodons.some(start => position >= start && position < start + 12);
  };

  return (
    <div className="dna-strand-container">
      {/* DNA Visualization */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 overflow-hidden">
        {/* Animated background */}
        {animate && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse" />
          </div>
        )}

        {/* DNA Strands */}
        <div className="relative z-10">
          {/* Strand 1 (5' -> 3') */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2 font-mono">5' Strand</div>
            <div className="flex flex-wrap gap-1">
              {displayDNA.map((nucleotide, index) => {
                const isSelected = index === selectedPosition;
                const isHovered = index === hoveredPosition;
                const inGene = isInGene(index);
                const isStartCodon = startCodons.includes(index);

                return (
                  <div
                    key={index}
                    className={`
                      relative w-8 h-8 rounded flex items-center justify-center
                      font-mono font-bold text-sm cursor-pointer
                      transition-all duration-200
                      ${isSelected ? 'ring-2 ring-white scale-110' : ''}
                      ${isHovered ? 'scale-105' : ''}
                      ${inGene ? 'ring-1 ring-yellow-400' : ''}
                      ${isStartCodon ? 'ring-2 ring-green-400 animate-pulse' : ''}
                    `}
                    style={{
                      backgroundColor: NUCLEOTIDE_COLORS[nucleotide],
                      opacity: isSelected || isHovered ? 1 : 0.9,
                    }}
                    onClick={() => onNucleotideClick?.(index, nucleotide)}
                    onMouseEnter={() => setHoveredPosition(index)}
                    onMouseLeave={() => setHoveredPosition(-1)}
                    title={`Position ${index}: ${nucleotide}${isStartCodon ? ' (START CODON)' : ''}`}
                  >
                    {nucleotide}
                    {/* Codon separator */}
                    {index % 3 === 2 && index < displayDNA.length - 1 && (
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-gray-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection lines */}
          {showComplement && (
            <div className="my-2">
              <svg width="100%" height="20" className="opacity-30">
                {displayDNA.map((_, index) => (
                  <line
                    key={index}
                    x1={`${(index * 36) + 16}px`}
                    y1="0"
                    x2={`${(index * 36) + 16}px`}
                    y2="20"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Strand 2 (3' -> 5') - Complementary */}
          {showComplement && (
            <div>
              <div className="text-xs text-gray-400 mb-2 font-mono">3' Strand (Complement)</div>
              <div className="flex flex-wrap gap-1">
                {displayComplement.map((nucleotide, index) => {
                  const isSelected = index === selectedPosition;
                  const isHovered = index === hoveredPosition;

                  return (
                    <div
                      key={index}
                      className={`
                        w-8 h-8 rounded flex items-center justify-center
                        font-mono font-bold text-sm
                        transition-all duration-200
                        ${isSelected ? 'ring-2 ring-white scale-110' : ''}
                        ${isHovered ? 'scale-105' : ''}
                      `}
                      style={{
                        backgroundColor: NUCLEOTIDE_COLORS[nucleotide],
                        opacity: 0.7,
                      }}
                      title={`Complement ${index}: ${nucleotide}`}
                    >
                      {nucleotide}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-gray-400">Length</div>
            <div className="text-white font-bold">{dna.length} bp</div>
          </div>
          <div>
            <div className="text-gray-400">Displayed</div>
            <div className="text-white font-bold">{displayDNA.length} bp</div>
          </div>
          <div>
            <div className="text-gray-400">Start Codons</div>
            <div className="text-green-400 font-bold">{startCodons.length}</div>
          </div>
          <div>
            <div className="text-gray-400">GC Content</div>
            <div className="text-blue-400 font-bold">
              {((dna.filter(n => n === 'G' || n === 'C').length / dna.length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: NUCLEOTIDE_COLORS.A }} />
          <span className="text-gray-300">Adenine (A)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: NUCLEOTIDE_COLORS.T }} />
          <span className="text-gray-300">Thymine (T)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: NUCLEOTIDE_COLORS.G }} />
          <span className="text-gray-300">Guanine (G)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: NUCLEOTIDE_COLORS.C }} />
          <span className="text-gray-300">Cytosine (C)</span>
        </div>
        {highlightGenes && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-green-400 bg-gray-700" />
            <span className="text-gray-300">Start Codon (ATG)</span>
          </div>
        )}
      </div>

      {dna.length > maxDisplay && (
        <div className="mt-2 text-xs text-yellow-400">
          Showing first {maxDisplay} of {dna.length} base pairs
        </div>
      )}
    </div>
  );
};

export default DNAStrand;
