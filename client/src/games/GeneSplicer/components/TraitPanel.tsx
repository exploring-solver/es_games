// Panel displaying active traits and level objectives
import React from 'react';
import { TraitMatch } from '../utils/traitCalculator';
import { LevelObjective } from '../data/organisms';
import { getTraitById } from '../utils/traitCalculator';

interface TraitPanelProps {
  activeTraits: TraitMatch[];
  currentLevel?: LevelObjective;
  showObjectives?: boolean;
}

const RARITY_COLORS = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  legendary: 'text-purple-400',
};

const RARITY_BG = {
  common: 'bg-gray-700',
  uncommon: 'bg-green-900',
  rare: 'bg-blue-900',
  legendary: 'bg-purple-900',
};

const CATEGORY_ICONS = {
  physical: '🎨',
  metabolic: '⚡',
  behavioral: '🧠',
  defensive: '🛡️',
};

export const TraitPanel: React.FC<TraitPanelProps> = ({
  activeTraits,
  currentLevel,
  showObjectives = true,
}) => {
  const requiredTraits = currentLevel?.targetTraits || [];
  const optionalTraits = currentLevel?.optionalTraits || [];
  const activeTraitIds = activeTraits.map(t => t.trait.id);

  const matchedRequired = requiredTraits.filter(id => activeTraitIds.includes(id));
  const missingRequired = requiredTraits.filter(id => !activeTraitIds.includes(id));
  const matchedOptional = optionalTraits.filter(id => activeTraitIds.includes(id));

  const isLevelComplete = missingRequired.length === 0 && requiredTraits.length > 0;

  return (
    <div className="trait-panel bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Traits & Objectives</h3>

      {/* Level objectives */}
      {showObjectives && currentLevel && (
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-white">
                Level {currentLevel.level}: {currentLevel.name}
              </h4>
              <p className="text-sm text-gray-400 mt-1">{currentLevel.description}</p>
            </div>
            <div className={`px-3 py-1 rounded text-xs font-bold ${
              currentLevel.difficulty === 'easy' ? 'bg-green-600' :
              currentLevel.difficulty === 'medium' ? 'bg-yellow-600' :
              currentLevel.difficulty === 'hard' ? 'bg-orange-600' :
              'bg-red-600'
            }`}>
              {currentLevel.difficulty.toUpperCase()}
            </div>
          </div>

          {/* Required traits checklist */}
          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">
              Required Traits ({matchedRequired.length}/{requiredTraits.length}):
            </div>
            <div className="space-y-2">
              {requiredTraits.map(traitId => {
                const trait = getTraitById(traitId);
                const isMatched = activeTraitIds.includes(traitId);
                if (!trait) return null;

                return (
                  <div
                    key={traitId}
                    className={`flex items-center gap-2 p-2 rounded ${
                      isMatched ? 'bg-green-900 border border-green-600' : 'bg-slate-800 border border-gray-600'
                    }`}
                  >
                    <div className="text-xl">
                      {isMatched ? '✅' : '⭕'}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${isMatched ? 'text-green-300' : 'text-gray-400'}`}>
                        {trait.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {trait.proteinSequence.join('-')}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${RARITY_BG[trait.rarity]}`}>
                      {trait.rarity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional traits */}
          {optionalTraits.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-yellow-400 mb-2">
                Bonus Traits ({matchedOptional.length}/{optionalTraits.length}):
              </div>
              <div className="space-y-2">
                {optionalTraits.map(traitId => {
                  const trait = getTraitById(traitId);
                  const isMatched = activeTraitIds.includes(traitId);
                  if (!trait) return null;

                  return (
                    <div
                      key={traitId}
                      className={`flex items-center gap-2 p-2 rounded ${
                        isMatched ? 'bg-yellow-900 border border-yellow-600' : 'bg-slate-800 border border-gray-600'
                      }`}
                    >
                      <div className="text-xl">
                        {isMatched ? '⭐' : '☆'}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${isMatched ? 'text-yellow-300' : 'text-gray-400'}`}>
                          {trait.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completion status */}
          {isLevelComplete && (
            <div className="mt-4 p-3 bg-green-600 rounded-lg text-center">
              <div className="text-lg font-bold text-white">🎉 Level Complete!</div>
              <div className="text-sm text-green-100 mt-1">
                Stars: {'⭐'.repeat(matchedOptional.length > 0 ? 3 : matchedRequired.length === requiredTraits.length ? 2 : 1)}
              </div>
            </div>
          )}

          {/* Restrictions */}
          {currentLevel.restrictions && (
            <div className="mt-3 p-2 bg-slate-800 rounded text-xs text-gray-400">
              {currentLevel.restrictions.maxMutations && (
                <div>Max Mutations: {currentLevel.restrictions.maxMutations}</div>
              )}
              {currentLevel.restrictions.maxGenerations && (
                <div>Max Generations: {currentLevel.restrictions.maxGenerations}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active traits display */}
      <div>
        <div className="text-sm font-semibold text-gray-300 mb-3">
          Active Traits ({activeTraits.length}):
        </div>

        {activeTraits.length === 0 ? (
          <div className="p-4 bg-slate-700 rounded text-center text-gray-400 text-sm">
            No traits expressed yet. Edit DNA to create proteins!
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activeTraits
              .sort((a, b) => b.confidence - a.confidence)
              .map((match, index) => {
                const { trait, confidence } = match;
                const isRequired = requiredTraits.includes(trait.id);
                const isBonus = optionalTraits.includes(trait.id);

                return (
                  <div
                    key={`${trait.id}-${index}`}
                    className={`p-3 rounded-lg ${RARITY_BG[trait.rarity]} border ${
                      isRequired ? 'border-green-500' :
                      isBonus ? 'border-yellow-500' :
                      'border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CATEGORY_ICONS[trait.category]}</span>
                        <div>
                          <div className={`font-semibold ${RARITY_COLORS[trait.rarity]}`}>
                            {trait.name}
                            {isRequired && <span className="ml-2 text-green-400 text-xs">✓ Required</span>}
                            {isBonus && <span className="ml-2 text-yellow-400 text-xs">★ Bonus</span>}
                          </div>
                          <div className="text-xs text-gray-400">{trait.description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex-1">
                        <div className="text-gray-500 mb-1">Expression: {confidence.toFixed(0)}%</div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              confidence >= 95 ? 'bg-green-500' :
                              confidence >= 85 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded ${RARITY_BG[trait.rarity]} ${RARITY_COLORS[trait.rarity]} font-semibold`}>
                        {trait.rarity}
                      </div>
                    </div>

                    <div className="mt-2 text-xs font-mono text-gray-500">
                      Protein: {trait.proteinSequence.join('-')}
                    </div>

                    {/* Visual properties */}
                    {(trait.visual.color || trait.visual.pattern || trait.visual.size || trait.visual.glow) && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {trait.visual.color && (
                          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: trait.visual.color }}
                            />
                            <span className="text-gray-400">Color</span>
                          </div>
                        )}
                        {trait.visual.pattern && (
                          <div className="bg-slate-800 px-2 py-1 rounded text-gray-400">
                            Pattern: {trait.visual.pattern}
                          </div>
                        )}
                        {trait.visual.size && trait.visual.size !== 1 && (
                          <div className="bg-slate-800 px-2 py-1 rounded text-gray-400">
                            Size: {trait.visual.size}x
                          </div>
                        )}
                        {trait.visual.glow && (
                          <div className="bg-yellow-900 px-2 py-1 rounded text-yellow-300">
                            ✨ Glow
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Hints */}
      {currentLevel && currentLevel.hints && currentLevel.hints.length > 0 && !isLevelComplete && (
        <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded">
          <div className="text-sm font-semibold text-blue-300 mb-2">💡 Hints:</div>
          <ul className="text-xs text-blue-200 space-y-1">
            {currentLevel.hints.map((hint, i) => (
              <li key={i}>• {hint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TraitPanel;
