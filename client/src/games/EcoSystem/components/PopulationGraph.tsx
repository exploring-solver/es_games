import React, { useMemo, useState } from 'react';
import { GameState } from '../utils/ecologyEngine';
import { SPECIES_DATA, Species } from '../data/species';

interface PopulationGraphProps {
  gameState: GameState;
}

export const PopulationGraph: React.FC<PopulationGraphProps> = ({ gameState }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'population' | 'trophic'>('population');

  // Process historical data for graphing
  const graphData = useMemo(() => {
    if (gameState.history.length === 0) return [];

    const maxSeasons = 50; // Show last 50 seasons
    const recentHistory = gameState.history.slice(-maxSeasons);

    return recentHistory.map((snapshot, index) => {
      const seasonData: any = {
        season: gameState.seasonCount - recentHistory.length + index + 1
      };

      if (viewMode === 'population') {
        // Individual species populations
        snapshot.forEach(pop => {
          seasonData[pop.speciesId] = pop.current;
        });
      } else {
        // Trophic level totals
        const trophicTotals = {
          producer: 0,
          primary_consumer: 0,
          secondary_consumer: 0,
          tertiary_consumer: 0,
          decomposer: 0
        };

        snapshot.forEach(pop => {
          const species = SPECIES_DATA.find(s => s.id === pop.speciesId);
          if (species) {
            trophicTotals[species.trophicLevel] += pop.current;
          }
        });

        Object.assign(seasonData, trophicTotals);
      }

      return seasonData;
    });
  }, [gameState.history, gameState.seasonCount, viewMode]);

  // Get current species for legend
  const currentSpecies = useMemo(() => {
    const species: Species[] = [];
    gameState.ecosystem.populations.forEach((_, speciesId) => {
      const sp = SPECIES_DATA.find(s => s.id === speciesId);
      if (sp) species.push(sp);
    });
    return species;
  }, [gameState.ecosystem.populations]);

  // Toggle species selection
  const toggleSpecies = (speciesId: string) => {
    const newSelected = new Set(selectedSpecies);
    if (newSelected.has(speciesId)) {
      newSelected.delete(speciesId);
    } else {
      newSelected.add(speciesId);
    }
    setSelectedSpecies(newSelected);
  };

  // Select all / none
  const selectAll = () => {
    if (selectedSpecies.size === currentSpecies.length) {
      setSelectedSpecies(new Set());
    } else {
      setSelectedSpecies(new Set(currentSpecies.map(s => s.id)));
    }
  };

  // Calculate scales
  const maxPopulation = useMemo(() => {
    let max = 0;
    graphData.forEach(data => {
      Object.keys(data).forEach(key => {
        if (key !== 'season' && data[key] > max) {
          max = data[key];
        }
      });
    });
    return max;
  }, [graphData]);

  const graphHeight = 300;
  const graphWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  // Generate SVG path for a species
  const generatePath = (speciesId: string): string => {
    if (graphData.length < 2) return '';

    const points = graphData.map((data, index) => {
      const x = padding.left + (index / (graphData.length - 1)) * (graphWidth - padding.left - padding.right);
      const y = graphHeight - padding.bottom - ((data[speciesId] || 0) / maxPopulation) * (graphHeight - padding.top - padding.bottom);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Color schemes
  const speciesColors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
  ];

  const trophicColors = {
    producer: '#27ae60',
    primary_consumer: '#3498db',
    secondary_consumer: '#9b59b6',
    tertiary_consumer: '#e74c3c',
    decomposer: '#95a5a6'
  };

  return (
    <div className="population-graph">
      <style>{`
        .population-graph {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .graph-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .view-toggle {
          display: flex;
          gap: 8px;
        }

        .toggle-btn {
          padding: 8px 16px;
          border: none;
          background: #ecf0f1;
          color: #7f8c8d;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: #3498db;
          color: white;
        }

        .toggle-btn:hover:not(.active) {
          background: #bdc3c7;
        }

        .graph-container {
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .graph-svg {
          display: block;
          margin: 0 auto;
        }

        .axis-line {
          stroke: #bdc3c7;
          stroke-width: 2;
        }

        .axis-text {
          fill: #7f8c8d;
          font-size: 12px;
        }

        .grid-line {
          stroke: #ecf0f1;
          stroke-width: 1;
          stroke-dasharray: 5,5;
        }

        .species-line {
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: opacity 0.2s;
        }

        .species-line:hover {
          stroke-width: 4;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .legend-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .legend-item.selected {
          border-color: #3498db;
        }

        .legend-item.inactive {
          opacity: 0.4;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }

        .legend-label {
          font-size: 0.85rem;
          color: #2c3e50;
          font-weight: 500;
        }

        .legend-controls {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }

        .select-all-btn {
          padding: 6px 12px;
          border: none;
          background: #3498db;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        .select-all-btn:hover {
          background: #2980b9;
        }

        .no-data {
          text-align: center;
          padding: 60px 20px;
          color: #95a5a6;
        }

        .no-data-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .no-data-text {
          font-size: 1.1rem;
        }
      `}</style>

      <div className="graph-header">
        <h2 className="graph-title">Population Dynamics</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'population' ? 'active' : ''}`}
            onClick={() => setViewMode('population')}
          >
            By Species
          </button>
          <button
            className={`toggle-btn ${viewMode === 'trophic' ? 'active' : ''}`}
            onClick={() => setViewMode('trophic')}
          >
            By Trophic Level
          </button>
        </div>
      </div>

      {graphData.length < 2 ? (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <div className="no-data-text">
            Not enough data yet. Wait a few seasons to see population trends.
          </div>
        </div>
      ) : (
        <>
          <div className="graph-container">
            <svg className="graph-svg" width={graphWidth} height={graphHeight}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = graphHeight - padding.bottom - ratio * (graphHeight - padding.top - padding.bottom);
                return (
                  <g key={i}>
                    <line
                      className="grid-line"
                      x1={padding.left}
                      y1={y}
                      x2={graphWidth - padding.right}
                      y2={y}
                    />
                    <text
                      className="axis-text"
                      x={padding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                    >
                      {Math.round(maxPopulation * ratio).toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* X axis */}
              <line
                className="axis-line"
                x1={padding.left}
                y1={graphHeight - padding.bottom}
                x2={graphWidth - padding.right}
                y2={graphHeight - padding.bottom}
              />

              {/* Y axis */}
              <line
                className="axis-line"
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={graphHeight - padding.bottom}
              />

              {/* Season labels */}
              {graphData.filter((_, i) => i % 10 === 0).map((data, i) => {
                const actualIndex = i * 10;
                const x = padding.left + (actualIndex / (graphData.length - 1)) * (graphWidth - padding.left - padding.right);
                return (
                  <text
                    key={i}
                    className="axis-text"
                    x={x}
                    y={graphHeight - padding.bottom + 20}
                    textAnchor="middle"
                  >
                    S{data.season}
                  </text>
                );
              })}

              {/* Plot lines */}
              {viewMode === 'population' ? (
                currentSpecies.map((species, index) => {
                  const isSelected = selectedSpecies.size === 0 || selectedSpecies.has(species.id);
                  return (
                    <path
                      key={species.id}
                      className="species-line"
                      d={generatePath(species.id)}
                      stroke={speciesColors[index % speciesColors.length]}
                      opacity={isSelected ? 1 : 0.1}
                    />
                  );
                })
              ) : (
                Object.keys(trophicColors).map(level => (
                  <path
                    key={level}
                    className="species-line"
                    d={generatePath(level)}
                    stroke={trophicColors[level as keyof typeof trophicColors]}
                    opacity={1}
                  />
                ))
              )}

              {/* Axis labels */}
              <text
                className="axis-text"
                x={graphWidth / 2}
                y={graphHeight - 5}
                textAnchor="middle"
                style={{ fontWeight: 'bold' }}
              >
                Season
              </text>
              <text
                className="axis-text"
                x={15}
                y={graphHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, 15, ${graphHeight / 2})`}
                style={{ fontWeight: 'bold' }}
              >
                Population
              </text>
            </svg>
          </div>

          <div className="legend">
            {viewMode === 'population' && (
              <>
                <div className="legend-controls">
                  <button className="select-all-btn" onClick={selectAll}>
                    {selectedSpecies.size === currentSpecies.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                {currentSpecies.map((species, index) => {
                  const isSelected = selectedSpecies.size === 0 || selectedSpecies.has(species.id);
                  return (
                    <div
                      key={species.id}
                      className={`legend-item ${isSelected ? 'selected' : 'inactive'}`}
                      onClick={() => toggleSpecies(species.id)}
                    >
                      <div
                        className="legend-color"
                        style={{ background: speciesColors[index % speciesColors.length] }}
                      />
                      <span className="legend-label">
                        {species.icon} {species.name}
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {viewMode === 'trophic' && (
              Object.entries(trophicColors).map(([level, color]) => (
                <div key={level} className="legend-item selected">
                  <div className="legend-color" style={{ background: color }} />
                  <span className="legend-label">
                    {level.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
