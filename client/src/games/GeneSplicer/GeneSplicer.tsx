// Gene Splicer Simulator - Main Game Component
import React, { useState, useEffect, useCallback } from 'react';
import { DNAStrand } from './components/DNAStrand';
import { GeneEditor } from './components/GeneEditor';
import { OrganismDisplay } from './components/OrganismDisplay';
import { TraitPanel } from './components/TraitPanel';
import { useGeneticLogic } from './hooks/useGeneticLogic';
import { useMutations } from './hooks/useMutations';
import { LEVELS, getTodaysDailyChallenge, LevelObjective } from './data/organisms';
import { Nucleotide } from './data/genes';
import { GENETIC_CODE } from './data/genes';

type GameMode = 'campaign' | 'sandbox' | 'daily' | 'competitive' | 'evolution';

export const GeneSplicer: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [unlockedTools, setUnlockedTools] = useState<string[]>(['substitution_tool']);
  const [selectedNucleotidePosition, setSelectedNucleotidePosition] = useState<number>(-1);
  const [showGeneticCode, setShowGeneticCode] = useState<boolean>(false);
  const [competitiveTimer, setCompetitiveTimer] = useState<number>(0);
  const [isCompetitiveRunning, setIsCompetitiveRunning] = useState<boolean>(false);

  // Get current level
  const currentLevel: LevelObjective =
    gameMode === 'daily' ? getTodaysDailyChallenge() :
    gameMode === 'campaign' ? LEVELS[currentLevelIndex] :
    LEVELS[0]; // Default for sandbox

  // Initialize genetic logic
  const {
    organism,
    traits,
    mutationHistory,
    dnaStats,
    canUndo,
    canRedo,
    mutateDNA,
    undo,
    redo,
    reset,
    checkCompletion,
  } = useGeneticLogic({
    initialOrganism: currentLevel.starterOrganism,
  });

  // Initialize mutations
  const {
    recentEvents,
    isActive: randomEventsActive,
    createSubstitution,
    createInsertion,
    createDeletion,
    createDuplication,
    createInversion,
    toggleRandomEvents,
    clearEvents,
  } = useMutations({
    enableRandomEvents: gameMode === 'sandbox',
    randomEventChance: 0.01,
  });

  // Check level completion
  const completion = checkCompletion(
    currentLevel.targetTraits,
    currentLevel.optionalTraits
  );

  // Competitive timer
  useEffect(() => {
    if (isCompetitiveRunning) {
      const interval = setInterval(() => {
        setCompetitiveTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCompetitiveRunning]);

  // Start competitive mode
  const startCompetitive = useCallback(() => {
    setCompetitiveTimer(0);
    setIsCompetitiveRunning(true);
    reset();
  }, [reset]);

  // Handle level completion
  useEffect(() => {
    if (completion.complete && gameMode === 'campaign') {
      // Unlock tools from rewards
      const rewards = currentLevel.rewards;
      if (rewards.unlocks) {
        setUnlockedTools(prev => [...new Set([...prev, ...rewards.unlocks!])]);
      }
    }
  }, [completion.complete, currentLevel, gameMode]);

  // Handle next level
  const nextLevel = useCallback(() => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      reset();
    }
  }, [currentLevelIndex, reset]);

  // Handle previous level
  const previousLevel = useCallback(() => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(prev => prev - 1);
      reset();
    }
  }, [currentLevelIndex, reset]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="gene-splicer min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 shadow-2xl">
          <h1 className="text-4xl font-bold mb-2">🧬 Gene Splicer Simulator</h1>
          <p className="text-blue-100">
            Master the art of genetic engineering. Create organisms with specific traits using real genetics!
          </p>
        </div>

        {/* Mode selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => { setGameMode('campaign'); reset(); }}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              gameMode === 'campaign' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            📚 Campaign
          </button>
          <button
            onClick={() => { setGameMode('sandbox'); reset(); }}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              gameMode === 'sandbox' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🔬 Sandbox
          </button>
          <button
            onClick={() => { setGameMode('daily'); reset(); }}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              gameMode === 'daily' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            📅 Daily Challenge
          </button>
          <button
            onClick={() => { setGameMode('competitive'); startCompetitive(); }}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              gameMode === 'competitive' ? 'bg-red-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            ⚔️ Competitive
          </button>
          <button
            onClick={() => setShowGeneticCode(!showGeneticCode)}
            className="px-4 py-2 rounded font-semibold bg-green-700 text-white hover:bg-green-600 transition-all"
          >
            📖 Genetic Code Table
          </button>
        </div>
      </div>

      {/* Genetic Code Reference (Modal) */}
      {showGeneticCode && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setShowGeneticCode(false)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Genetic Code Table</h2>
              <button
                onClick={() => setShowGeneticCode(false)}
                className="text-2xl hover:text-red-400"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-300 mb-4">
              Each codon (3 nucleotides) codes for one amino acid. In DNA, T is used; during transcription, T becomes U in RNA.
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {Object.entries(GENETIC_CODE).map(([codon, aminoAcid]) => (
                <div key={codon} className="bg-slate-700 p-2 rounded">
                  <div className="font-mono font-bold text-blue-400">{codon}</div>
                  <div className={`text-sm ${aminoAcid === 'STOP' ? 'text-red-400' : 'text-green-400'}`}>
                    {aminoAcid}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded text-sm">
              <div className="font-semibold mb-1">💡 Tip:</div>
              DNA uses A, T, G, C. During transcription, T becomes U in RNA (mRNA). The genetic code shows RNA codons (with U).
              To use this table, replace T with U in your DNA sequence.
            </div>
          </div>
        </div>
      )}

      {/* Main game area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - DNA & Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level navigation (campaign mode) */}
          {gameMode === 'campaign' && (
            <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
              <button
                onClick={previousLevel}
                disabled={currentLevelIndex === 0}
                className="px-4 py-2 bg-blue-600 rounded font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <div className="text-center">
                <div className="text-sm text-gray-400">Level Progress</div>
                <div className="font-bold text-lg">
                  {currentLevelIndex + 1} / {LEVELS.length}
                </div>
              </div>
              <button
                onClick={nextLevel}
                disabled={currentLevelIndex === LEVELS.length - 1 || !completion.complete}
                className="px-4 py-2 bg-blue-600 rounded font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Competitive timer */}
          {gameMode === 'competitive' && (
            <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded-lg p-4 flex justify-between items-center">
              <div className="text-xl font-bold">⏱️ Time: {formatTime(competitiveTimer)}</div>
              <div className="text-sm">Mutations: {mutationHistory.length}</div>
              {completion.complete && (
                <div className="text-green-400 font-bold">✓ Complete!</div>
              )}
            </div>
          )}

          {/* DNA Strand */}
          <DNAStrand
            dna={organism.genome}
            selectedPosition={selectedNucleotidePosition}
            onNucleotideClick={(pos) => setSelectedNucleotidePosition(pos)}
            highlightGenes={true}
            showComplement={true}
            animate={true}
          />

          {/* Gene Editor */}
          <GeneEditor
            dna={organism.genome}
            onMutate={mutateDNA}
            unlockedTools={gameMode === 'sandbox' ? ['substitution_tool', 'insertion_tool', 'deletion_tool', 'duplication_tool', 'inversion_tool'] : unlockedTools}
            mutationCount={mutationHistory.length}
            maxMutations={currentLevel.restrictions?.maxMutations}
          />

          {/* Controls */}
          <div className="bg-slate-800 rounded-lg p-4 flex flex-wrap gap-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-4 py-2 bg-yellow-600 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↶ Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-4 py-2 bg-yellow-600 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↷ Redo
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 rounded font-semibold hover:bg-red-500"
            >
              🔄 Reset
            </button>
            {gameMode === 'sandbox' && (
              <button
                onClick={toggleRandomEvents}
                className={`px-4 py-2 rounded font-semibold ${
                  randomEventsActive ? 'bg-purple-600 hover:bg-purple-500' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              >
                {randomEventsActive ? '⚡ Random Events: ON' : '⚡ Random Events: OFF'}
              </button>
            )}
          </div>

          {/* DNA Stats */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="font-bold mb-3">DNA Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-gray-400">Length</div>
                <div className="font-bold text-blue-400">{dnaStats.length} bp</div>
              </div>
              <div>
                <div className="text-gray-400">GC Content</div>
                <div className="font-bold text-green-400">{dnaStats.gcContent.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-400">Genes Found</div>
                <div className="font-bold text-purple-400">{dnaStats.geneCount}</div>
              </div>
              <div>
                <div className="text-gray-400">Proteins</div>
                <div className="font-bold text-orange-400">{dnaStats.proteinCount}</div>
              </div>
            </div>
          </div>

          {/* Recent events (sandbox mode) */}
          {gameMode === 'sandbox' && recentEvents.length > 0 && (
            <div className="bg-purple-900 bg-opacity-30 border border-purple-600 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">⚡ Recent Mutation Events</h3>
                <button
                  onClick={clearEvents}
                  className="text-xs px-2 py-1 bg-slate-700 rounded hover:bg-slate-600"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                {recentEvents.slice(-5).reverse().map(event => (
                  <div key={event.id} className="text-purple-300">
                    • {event.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Organism & Traits */}
        <div className="space-y-6">
          {/* Organism Display */}
          <OrganismDisplay
            organism={organism}
            traits={traits}
            showStats={true}
            animate={true}
          />

          {/* Trait Panel */}
          <TraitPanel
            activeTraits={traits.activeTraits}
            currentLevel={gameMode === 'sandbox' ? undefined : currentLevel}
            showObjectives={gameMode !== 'sandbox'}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>Based on real genetics concepts: DNA → RNA → Protein → Traits</p>
        <p className="mt-1">Learn about codons, amino acids, mutations, and genetic engineering!</p>
      </div>
    </div>
  );
};

export default GeneSplicer;
