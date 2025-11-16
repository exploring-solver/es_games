import React, { useState } from 'react';
import { Species, SPECIES_DATA } from '../data/species';
import { GameState } from '../utils/ecologyEngine';
import { PopulationData } from '../utils/populationModel';

interface SpeciesPanelProps {
  gameState: GameState;
  onAddSpecies: (speciesId: string) => void;
  onRemoveSpecies: (speciesId: string) => void;
  getPopulationHealth: (speciesId: string) => {
    status: 'thriving' | 'healthy' | 'stable' | 'declining' | 'critical';
    percentage: number;
  };
}

export const SpeciesPanel: React.FC<SpeciesPanelProps> = ({
  gameState,
  onAddSpecies,
  onRemoveSpecies,
  getPopulationHealth
}) => {
  const [selectedTab, setSelectedTab] = useState<'current' | 'available'>('current');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const getCurrentSpecies = (): Array<{ species: Species; population: PopulationData }> => {
    const result: Array<{ species: Species; population: PopulationData }> = [];

    gameState.ecosystem.populations.forEach((popData, speciesId) => {
      const species = SPECIES_DATA.find(s => s.id === speciesId);
      if (species) {
        result.push({ species, population: popData });
      }
    });

    return result.sort((a, b) => {
      // Sort by trophic level
      const order = ['producer', 'primary_consumer', 'secondary_consumer', 'tertiary_consumer', 'decomposer'];
      return order.indexOf(a.species.trophicLevel) - order.indexOf(b.species.trophicLevel);
    });
  };

  const getAvailableSpecies = (): Species[] => {
    return SPECIES_DATA.filter(species =>
      gameState.availableSpecies.includes(species.id)
    );
  };

  const getHealthColor = (status: string): string => {
    switch (status) {
      case 'thriving': return '#27ae60';
      case 'healthy': return '#2ecc71';
      case 'stable': return '#f39c12';
      case 'declining': return '#e67e22';
      case 'critical': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getTrophicLevelColor = (level: string): string => {
    switch (level) {
      case 'producer': return '#27ae60';
      case 'primary_consumer': return '#3498db';
      case 'secondary_consumer': return '#9b59b6';
      case 'tertiary_consumer': return '#e74c3c';
      case 'decomposer': return '#95a5a6';
      default: return '#34495e';
    }
  };

  return (
    <div className="species-panel">
      <style>{`
        .species-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          height: 600px;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          margin-bottom: 16px;
        }

        .panel-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 12px 0;
        }

        .tab-buttons {
          display: flex;
          gap: 8px;
        }

        .tab-button {
          flex: 1;
          padding: 10px 16px;
          border: none;
          background: #ecf0f1;
          color: #7f8c8d;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .tab-button.active {
          background: #3498db;
          color: white;
        }

        .tab-button:hover:not(.active) {
          background: #bdc3c7;
        }

        .species-list {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 16px;
        }

        .species-item {
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          border: 2px solid #ecf0f1;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .species-item:hover {
          border-color: #3498db;
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
        }

        .species-item.selected {
          border-color: #3498db;
          background: #ebf5fb;
        }

        .species-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .species-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #2c3e50;
        }

        .species-icon {
          font-size: 1.5rem;
        }

        .species-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
        }

        .species-stats {
          display: flex;
          gap: 12px;
          font-size: 0.85rem;
          color: #7f8c8d;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .health-bar {
          height: 6px;
          background: #ecf0f1;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }

        .health-fill {
          height: 100%;
          transition: width 0.3s, background-color 0.3s;
          border-radius: 3px;
        }

        .species-detail {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }

        .detail-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-content {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.6;
        }

        .detail-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 12px 0;
        }

        .detail-stat {
          background: white;
          padding: 8px;
          border-radius: 6px;
        }

        .detail-stat-label {
          font-size: 0.7rem;
          color: #7f8c8d;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .detail-stat-value {
          font-size: 1rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .action-button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button.add {
          background: #27ae60;
          color: white;
        }

        .action-button.add:hover {
          background: #229954;
        }

        .action-button.remove {
          background: #e74c3c;
          color: white;
        }

        .action-button.remove:hover {
          background: #c0392b;
        }

        .warning-badge {
          background: #e74c3c;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          color: white;
          margin-left: 8px;
        }

        .endangered-badge {
          background: #f39c12;
        }

        .invasive-badge {
          background: #8e44ad;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #bdc3c7;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #95a5a6;
        }
      `}</style>

      <div className="panel-header">
        <h2 className="panel-title">Species Management</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${selectedTab === 'current' ? 'active' : ''}`}
            onClick={() => setSelectedTab('current')}
          >
            Current Species ({gameState.ecosystem.populations.size})
          </button>
          <button
            className={`tab-button ${selectedTab === 'available' ? 'active' : ''}`}
            onClick={() => setSelectedTab('available')}
          >
            Available ({gameState.availableSpecies.length})
          </button>
        </div>
      </div>

      <div className="species-list">
        {selectedTab === 'current' && getCurrentSpecies().map(({ species, population }) => {
          const health = getPopulationHealth(species.id);

          return (
            <div
              key={species.id}
              className={`species-item ${selectedSpecies?.id === species.id ? 'selected' : ''}`}
              onClick={() => setSelectedSpecies(species)}
            >
              <div className="species-header">
                <div className="species-name">
                  <span className="species-icon">{species.icon}</span>
                  <span>{species.name}</span>
                  {species.endangered && <span className="warning-badge endangered-badge">ENDANGERED</span>}
                  {species.invasive && <span className="warning-badge invasive-badge">INVASIVE</span>}
                </div>
                <span
                  className="species-badge"
                  style={{ background: getTrophicLevelColor(species.trophicLevel) }}
                >
                  {species.trophicLevel.replace('_', ' ')}
                </span>
              </div>
              <div className="species-stats">
                <span className="stat">
                  Population: <strong>{population.current.toLocaleString()}</strong>
                </span>
                <span className="stat">
                  Capacity: <strong>{population.carrying.toLocaleString()}</strong>
                </span>
              </div>
              <div className="health-bar">
                <div
                  className="health-fill"
                  style={{
                    width: `${health.percentage}%`,
                    background: getHealthColor(health.status)
                  }}
                />
              </div>
            </div>
          );
        })}

        {selectedTab === 'available' && getAvailableSpecies().map(species => (
          <div
            key={species.id}
            className={`species-item ${selectedSpecies?.id === species.id ? 'selected' : ''}`}
            onClick={() => setSelectedSpecies(species)}
          >
            <div className="species-header">
              <div className="species-name">
                <span className="species-icon">{species.icon}</span>
                <span>{species.name}</span>
              </div>
              <span
                className="species-badge"
                style={{ background: getTrophicLevelColor(species.trophicLevel) }}
              >
                {species.trophicLevel.replace('_', ' ')}
              </span>
            </div>
            <div className="species-stats">
              <span className="stat">
                Biodiversity Value: <strong>+{species.biodiversityValue}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedSpecies && (
        <div className="species-detail">
          <h3 className="detail-title">
            <span>{selectedSpecies.icon}</span>
            {selectedSpecies.name}
          </h3>
          <p className="detail-content">{selectedSpecies.description}</p>

          <div className="detail-stats">
            <div className="detail-stat">
              <div className="detail-stat-label">Growth Rate</div>
              <div className="detail-stat-value">{(selectedSpecies.growthRate * 100).toFixed(0)}%</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Resilience</div>
              <div className="detail-stat-value">{(selectedSpecies.resilience * 100).toFixed(0)}%</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Temp Range</div>
              <div className="detail-stat-value">
                {selectedSpecies.temperatureRange[0]}° - {selectedSpecies.temperatureRange[1]}°C
              </div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Water Need</div>
              <div className="detail-stat-value">{(selectedSpecies.waterRequirement * 100).toFixed(0)}%</div>
            </div>
          </div>

          <div className="action-buttons">
            {selectedTab === 'available' && (
              <button
                className="action-button add"
                onClick={() => onAddSpecies(selectedSpecies.id)}
              >
                Introduce Species
              </button>
            )}
            {selectedTab === 'current' && (
              <button
                className="action-button remove"
                onClick={() => {
                  if (confirm(`Remove ${selectedSpecies.name} from ecosystem?`)) {
                    onRemoveSpecies(selectedSpecies.id);
                    setSelectedSpecies(null);
                  }
                }}
              >
                Remove Species
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
