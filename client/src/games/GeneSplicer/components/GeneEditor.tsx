// CRISPR-like gene editing interface
import React, { useState } from 'react';
import { Nucleotide, Mutation } from '../data/genes';

interface GeneEditorProps {
  dna: Nucleotide[];
  onMutate: (mutation: Mutation) => void;
  unlockedTools?: string[];
  mutationCount: number;
  maxMutations?: number;
}

type EditorMode = 'substitution' | 'insertion' | 'deletion' | 'duplication' | 'inversion';

export const GeneEditor: React.FC<GeneEditorProps> = ({
  dna,
  onMutate,
  unlockedTools = ['substitution_tool'],
  mutationCount,
  maxMutations,
}) => {
  const [mode, setMode] = useState<EditorMode>('substitution');
  const [position, setPosition] = useState<number>(0);
  const [selectedNucleotides, setSelectedNucleotides] = useState<Nucleotide[]>(['A']);
  const [length, setLength] = useState<number>(1);

  const isToolUnlocked = (tool: string): boolean => {
    return unlockedTools.includes(tool);
  };

  const canMutate = (): boolean => {
    if (maxMutations !== undefined && mutationCount >= maxMutations) {
      return false;
    }
    return true;
  };

  const handleMutate = () => {
    if (!canMutate()) {
      alert(`Maximum mutations (${maxMutations}) reached!`);
      return;
    }

    let mutation: Mutation;

    switch (mode) {
      case 'substitution':
        mutation = {
          type: 'substitution',
          position,
          nucleotides: selectedNucleotides,
        };
        break;
      case 'insertion':
        mutation = {
          type: 'insertion',
          position,
          nucleotides: selectedNucleotides,
        };
        break;
      case 'deletion':
        mutation = {
          type: 'deletion',
          position,
          length,
        };
        break;
      case 'duplication':
        mutation = {
          type: 'duplication',
          position,
          length,
        };
        break;
      case 'inversion':
        mutation = {
          type: 'inversion',
          position,
          length,
        };
        break;
    }

    onMutate(mutation);
  };

  const toggleNucleotide = (nuc: Nucleotide) => {
    setSelectedNucleotides(prev => {
      if (mode === 'substitution' && prev.length === 1) {
        return [nuc];
      }
      if (prev.includes(nuc)) {
        return prev.filter(n => n !== nuc);
      }
      return [...prev, nuc];
    });
  };

  const addNucleotide = (nuc: Nucleotide) => {
    setSelectedNucleotides(prev => [...prev, nuc]);
  };

  const removeLastNucleotide = () => {
    setSelectedNucleotides(prev => prev.slice(0, -1));
  };

  const clearNucleotides = () => {
    setSelectedNucleotides([]);
  };

  return (
    <div className="gene-editor bg-slate-800 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">CRISPR Gene Editor</h3>
        <p className="text-gray-400 text-sm">
          Use molecular tools to edit DNA sequences
        </p>
      </div>

      {/* Mutation counter */}
      <div className="mb-4 p-3 bg-slate-700 rounded">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Mutations Used:</span>
          <span className={`font-bold ${maxMutations && mutationCount >= maxMutations ? 'text-red-400' : 'text-green-400'}`}>
            {mutationCount} {maxMutations ? `/ ${maxMutations}` : ''}
          </span>
        </div>
      </div>

      {/* Tool Selection */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-semibold mb-2">
          Select Tool:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            onClick={() => setMode('substitution')}
            disabled={!isToolUnlocked('substitution_tool')}
            className={`
              px-4 py-3 rounded font-semibold text-sm transition-all
              ${mode === 'substitution' ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-slate-700 text-gray-300'}
              ${!isToolUnlocked('substitution_tool') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}
            `}
          >
            Substitution
            {!isToolUnlocked('substitution_tool') && <div className="text-xs">🔒 Locked</div>}
          </button>

          <button
            onClick={() => setMode('insertion')}
            disabled={!isToolUnlocked('insertion_tool')}
            className={`
              px-4 py-3 rounded font-semibold text-sm transition-all
              ${mode === 'insertion' ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-slate-700 text-gray-300'}
              ${!isToolUnlocked('insertion_tool') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'}
            `}
          >
            Insertion
            {!isToolUnlocked('insertion_tool') && <div className="text-xs">🔒 Locked</div>}
          </button>

          <button
            onClick={() => setMode('deletion')}
            disabled={!isToolUnlocked('deletion_tool')}
            className={`
              px-4 py-3 rounded font-semibold text-sm transition-all
              ${mode === 'deletion' ? 'bg-red-600 text-white ring-2 ring-red-400' : 'bg-slate-700 text-gray-300'}
              ${!isToolUnlocked('deletion_tool') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'}
            `}
          >
            Deletion
            {!isToolUnlocked('deletion_tool') && <div className="text-xs">🔒 Locked</div>}
          </button>

          <button
            onClick={() => setMode('duplication')}
            disabled={!isToolUnlocked('duplication_tool')}
            className={`
              px-4 py-3 rounded font-semibold text-sm transition-all
              ${mode === 'duplication' ? 'bg-purple-600 text-white ring-2 ring-purple-400' : 'bg-slate-700 text-gray-300'}
              ${!isToolUnlocked('duplication_tool') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500'}
            `}
          >
            Duplication
            {!isToolUnlocked('duplication_tool') && <div className="text-xs">🔒 Locked</div>}
          </button>

          <button
            onClick={() => setMode('inversion')}
            disabled={!isToolUnlocked('inversion_tool')}
            className={`
              px-4 py-3 rounded font-semibold text-sm transition-all
              ${mode === 'inversion' ? 'bg-yellow-600 text-white ring-2 ring-yellow-400' : 'bg-slate-700 text-gray-300'}
              ${!isToolUnlocked('inversion_tool') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'}
            `}
          >
            Inversion
            {!isToolUnlocked('inversion_tool') && <div className="text-xs">🔒 Locked</div>}
          </button>
        </div>
      </div>

      {/* Position selector */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-semibold mb-2">
          Position: {position}
        </label>
        <input
          type="range"
          min="0"
          max={Math.max(0, dna.length - 1)}
          value={position}
          onChange={(e) => setPosition(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>{dna.length - 1}</span>
        </div>
      </div>

      {/* Mode-specific controls */}
      {(mode === 'substitution' || mode === 'insertion') && (
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            {mode === 'substitution' ? 'Replace with:' : 'Insert nucleotides:'}
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {(['A', 'T', 'G', 'C'] as Nucleotide[]).map(nuc => (
              <button
                key={nuc}
                onClick={() => mode === 'substitution' ? toggleNucleotide(nuc) : addNucleotide(nuc)}
                className={`
                  px-4 py-2 rounded font-bold transition-all
                  ${selectedNucleotides.includes(nuc) && mode === 'substitution' ? 'ring-2 ring-white' : ''}
                  ${nuc === 'A' ? 'bg-green-600 hover:bg-green-500' : ''}
                  ${nuc === 'T' ? 'bg-red-600 hover:bg-red-500' : ''}
                  ${nuc === 'G' ? 'bg-orange-600 hover:bg-orange-500' : ''}
                  ${nuc === 'C' ? 'bg-blue-600 hover:bg-blue-500' : ''}
                `}
              >
                {nuc}
              </button>
            ))}
          </div>
          {mode === 'insertion' && (
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-700 rounded p-2 font-mono text-white">
                {selectedNucleotides.length > 0 ? selectedNucleotides.join('') : 'No nucleotides selected'}
              </div>
              <button
                onClick={removeLastNucleotide}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-white text-sm"
                disabled={selectedNucleotides.length === 0}
              >
                ←
              </button>
              <button
                onClick={clearNucleotides}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm"
              >
                Clear
              </button>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400">
            Selected: {selectedNucleotides.join('-')} ({selectedNucleotides.length} nucleotide{selectedNucleotides.length !== 1 ? 's' : ''})
          </div>
        </div>
      )}

      {(mode === 'deletion' || mode === 'duplication' || mode === 'inversion') && (
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Length: {length}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>20</span>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mb-4 p-3 bg-slate-900 rounded">
        <div className="text-xs text-gray-400 mb-1">Preview:</div>
        <div className="font-mono text-sm text-white">
          {mode === 'substitution' && `Replace ${dna[position] || '?'} at position ${position} with ${selectedNucleotides[0]}`}
          {mode === 'insertion' && `Insert ${selectedNucleotides.join('')} at position ${position}`}
          {mode === 'deletion' && `Delete ${length} nucleotide${length > 1 ? 's' : ''} from position ${position}`}
          {mode === 'duplication' && `Duplicate ${length} nucleotides from position ${position}`}
          {mode === 'inversion' && `Invert ${length} nucleotides from position ${position}`}
        </div>
      </div>

      {/* Apply button */}
      <button
        onClick={handleMutate}
        disabled={!canMutate() || (mode !== 'deletion' && mode !== 'duplication' && mode !== 'inversion' && selectedNucleotides.length === 0)}
        className={`
          w-full py-3 rounded font-bold text-lg transition-all
          ${canMutate() ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white' : 'bg-gray-600 cursor-not-allowed text-gray-400'}
        `}
      >
        {canMutate() ? '🧬 Apply Mutation' : '⚠️ Mutation Limit Reached'}
      </button>

      {/* Tool descriptions */}
      <div className="mt-4 p-3 bg-slate-700 rounded text-xs text-gray-300">
        <div className="font-semibold mb-1">Tool Info:</div>
        {mode === 'substitution' && 'Replace a nucleotide with another. Point mutations can change codons.'}
        {mode === 'insertion' && 'Insert new nucleotides. Can add genes or shift reading frames.'}
        {mode === 'deletion' && 'Remove nucleotides. Can eliminate genes or cause frameshift mutations.'}
        {mode === 'duplication' && 'Copy a DNA segment. Can amplify genes for stronger expression.'}
        {mode === 'inversion' && 'Reverse a DNA segment. Can disrupt or create new gene combinations.'}
      </div>
    </div>
  );
};

export default GeneEditor;
