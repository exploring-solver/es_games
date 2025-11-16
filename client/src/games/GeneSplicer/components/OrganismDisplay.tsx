// Visual display of the organism with traits
import React, { useMemo } from 'react';
import { OrganismTraits } from '../utils/traitCalculator';
import { Organism } from '../data/organisms';

interface OrganismDisplayProps {
  organism: Organism;
  traits: OrganismTraits;
  showStats?: boolean;
  animate?: boolean;
}

export const OrganismDisplay: React.FC<OrganismDisplayProps> = ({
  organism,
  traits,
  showStats = true,
  animate = true,
}) => {
  const { visualProperties, stats } = traits;

  // Generate organism shape based on traits
  const organismShape = useMemo(() => {
    const { color, pattern, size, glow } = visualProperties;

    const baseSize = 120 * size;
    const cx = 150;
    const cy = 150;

    // SVG elements for the organism
    const elements: JSX.Element[] = [];

    // Base organism (circle/cell)
    elements.push(
      <circle
        key="base"
        cx={cx}
        cy={cy}
        r={baseSize}
        fill={color}
        opacity={visualProperties.opacity}
        className={animate ? 'animate-pulse-slow' : ''}
        filter={glow ? 'url(#glow)' : undefined}
      />
    );

    // Add pattern overlay
    if (pattern === 'stripes') {
      for (let i = 0; i < 5; i++) {
        elements.push(
          <rect
            key={`stripe-${i}`}
            x={cx - baseSize}
            y={cy - baseSize + (i * baseSize * 2) / 5}
            width={baseSize * 2}
            height={baseSize * 2 / 10}
            fill="rgba(0, 0, 0, 0.3)"
          />
        );
      }
    } else if (pattern === 'spots') {
      const spotPositions = [
        { x: 0.3, y: 0.3, r: 0.2 },
        { x: 0.7, y: 0.3, r: 0.15 },
        { x: 0.5, y: 0.6, r: 0.18 },
        { x: 0.2, y: 0.7, r: 0.12 },
        { x: 0.8, y: 0.75, r: 0.14 },
      ];
      spotPositions.forEach((spot, i) => {
        elements.push(
          <circle
            key={`spot-${i}`}
            cx={cx - baseSize + spot.x * baseSize * 2}
            cy={cy - baseSize + spot.y * baseSize * 2}
            r={baseSize * spot.r}
            fill="rgba(0, 0, 0, 0.4)"
          />
        );
      });
    } else if (pattern === 'gradient') {
      elements.push(
        <circle
          key="gradient"
          cx={cx}
          cy={cy}
          r={baseSize}
          fill="url(#camouflageGradient)"
          opacity={0.7}
        />
      );
    }

    // Add nucleus
    elements.push(
      <circle
        key="nucleus"
        cx={cx}
        cy={cy}
        r={baseSize * 0.3}
        fill="rgba(100, 100, 100, 0.4)"
        stroke="rgba(150, 150, 150, 0.6)"
        strokeWidth="2"
      />
    );

    // Add DNA in nucleus
    elements.push(
      <g key="dna-nucleus" opacity="0.6">
        <path
          d={`M ${cx - 20} ${cy - 15} Q ${cx - 10} ${cy - 10}, ${cx} ${cy - 15} T ${cx + 20} ${cy - 15}`}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M ${cx - 20} ${cy} Q ${cx - 10} ${cy + 5}, ${cx} ${cy} T ${cx + 20} ${cy}`}
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M ${cx - 20} ${cy + 15} Q ${cx - 10} ${cy + 20}, ${cx} ${cy + 15} T ${cx + 20} ${cy + 15}`}
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />
      </g>
    );

    return elements;
  }, [visualProperties, animate]);

  return (
    <div className="organism-display bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{organism.name}</h3>
        <p className="text-gray-400 text-sm italic">{organism.species}</p>
        <p className="text-gray-500 text-xs">Generation {organism.generation}</p>
      </div>

      {/* Organism visualization */}
      <div className="bg-slate-950 rounded-lg p-4 mb-4 flex justify-center items-center min-h-[300px]">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <defs>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Camouflage gradient */}
            <radialGradient id="camouflageGradient">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
              <stop offset="50%" stopColor="rgba(74, 222, 128, 0.4)" />
              <stop offset="100%" stopColor="rgba(134, 239, 172, 0.2)" />
            </radialGradient>
          </defs>

          {/* Organism shape */}
          {organismShape}
        </svg>
      </div>

      {/* Organism info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700 rounded p-3">
          <div className="text-xs text-gray-400">Fitness</div>
          <div className="text-lg font-bold text-green-400">{organism.fitness}/100</div>
        </div>
        <div className="bg-slate-700 rounded p-3">
          <div className="text-xs text-gray-400">Traits</div>
          <div className="text-lg font-bold text-blue-400">{organism.traits.length}</div>
        </div>
        <div className="bg-slate-700 rounded p-3">
          <div className="text-xs text-gray-400">Genes</div>
          <div className="text-lg font-bold text-purple-400">{organism.genes.length}</div>
        </div>
        <div className="bg-slate-700 rounded p-3">
          <div className="text-xs text-gray-400">Genome</div>
          <div className="text-lg font-bold text-orange-400">{organism.genome.length} bp</div>
        </div>
      </div>

      {/* Stats bars */}
      {showStats && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-300 mb-2">Organism Stats:</div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Metabolism</span>
              <span>{stats.metabolism.toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.metabolism}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Defense</span>
              <span>{stats.defense.toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.defense}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Reproduction</span>
              <span>{stats.reproduction.toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.reproduction}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Social</span>
              <span>{stats.social.toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.social}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visual properties info */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-semibold">Color:</span>{' '}
            <span className="inline-block w-4 h-4 rounded ml-1 align-middle" style={{ backgroundColor: visualProperties.color }} />
          </div>
          {visualProperties.pattern && (
            <div>
              <span className="font-semibold">Pattern:</span> {visualProperties.pattern}
            </div>
          )}
          <div>
            <span className="font-semibold">Size:</span> {visualProperties.size.toFixed(1)}x
          </div>
          {visualProperties.glow && (
            <div>
              <span className="font-semibold text-yellow-400">Glowing!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganismDisplay;
