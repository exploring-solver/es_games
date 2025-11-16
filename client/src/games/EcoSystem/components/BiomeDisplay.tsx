import React from 'react';
import { Biome } from '../data/biomes';
import { EcosystemState } from '../utils/populationModel';
import { SPECIES_DATA } from '../data/species';

interface BiomeDisplayProps {
  biome: Biome;
  ecosystem: EcosystemState;
  seasonCount: number;
}

export const BiomeDisplay: React.FC<BiomeDisplayProps> = ({
  biome,
  ecosystem,
  seasonCount
}) => {
  // Calculate season name
  const getSeasonName = (season: number): string => {
    const seasonInYear = season % 4;
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    return seasons[seasonInYear];
  };

  // Get year
  const year = Math.floor(seasonCount / 4) + 1;
  const seasonName = getSeasonName(seasonCount);

  // Render species icons in the biome
  const renderSpecies = () => {
    const speciesElements: JSX.Element[] = [];

    ecosystem.populations.forEach((popData, speciesId) => {
      const species = SPECIES_DATA.find(s => s.id === speciesId);
      if (!species || popData.current === 0) return;

      // Calculate how many icons to show (1-5 based on population health)
      const healthRatio = popData.current / popData.carrying;
      const iconCount = Math.max(1, Math.min(5, Math.ceil(healthRatio * 5)));

      for (let i = 0; i < iconCount; i++) {
        speciesElements.push(
          <div
            key={`${speciesId}-${i}`}
            className="species-icon"
            style={{
              position: 'absolute',
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 60 + 20}%`,
              fontSize: '2rem',
              animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              cursor: 'pointer',
              filter: healthRatio < 0.3 ? 'grayscale(50%)' : 'none',
              opacity: Math.max(0.5, healthRatio)
            }}
            title={`${species.name}: ${popData.current.toLocaleString()}`}
          >
            {species.icon}
          </div>
        );
      }
    });

    return speciesElements;
  };

  return (
    <div className="biome-display">
      <style>{`
        .biome-display {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          margin-bottom: 20px;
        }

        .biome-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${biome.backgroundGradient};
          transition: filter 0.3s ease;
        }

        .biome-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          pointer-events: none;
        }

        .biome-info {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .biome-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .biome-season {
          font-size: 1rem;
          color: #7f8c8d;
          margin: 0;
        }

        .biome-stats {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-around;
          z-index: 10;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #7f8c8d;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .stat-icon {
          margin-right: 4px;
        }

        .species-icon {
          transition: transform 0.2s, filter 0.3s;
          user-select: none;
        }

        .species-icon:hover {
          transform: scale(1.2);
          filter: brightness(1.2);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        .weather-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 5;
        }

        @keyframes rain {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 100%;
          }
        }

        .rain {
          background: linear-gradient(transparent 50%, rgba(174, 214, 241, 0.5) 50%);
          background-size: 2px 20px;
          animation: rain 0.5s linear infinite;
        }
      `}</style>

      <div className="biome-background" />
      <div className="biome-overlay" />

      {/* Weather effects */}
      {ecosystem.precipitation > 1000 && (
        <div className="weather-effect rain" />
      )}

      {/* Biome Info */}
      <div className="biome-info">
        <h2 className="biome-title">
          <span>{biome.icon}</span>
          {biome.name}
        </h2>
        <p className="biome-season">
          Year {year}, {seasonName}
        </p>
      </div>

      {/* Species in biome */}
      {renderSpecies()}

      {/* Climate Stats */}
      <div className="biome-stats">
        <div className="stat-item">
          <div className="stat-label">Temperature</div>
          <div className="stat-value">
            <span className="stat-icon">🌡️</span>
            {Math.round(ecosystem.temperature)}°C
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Precipitation</div>
          <div className="stat-value">
            <span className="stat-icon">💧</span>
            {Math.round(ecosystem.precipitation)}mm
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Species</div>
          <div className="stat-value">
            <span className="stat-icon">🦋</span>
            {ecosystem.populations.size}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Biodiversity</div>
          <div className="stat-value">
            <span className="stat-icon">🌿</span>
            {Math.round(ecosystem.totalBiodiversity)}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Stability</div>
          <div className="stat-value">
            <span className="stat-icon">⚖️</span>
            {Math.round(ecosystem.stability)}%
          </div>
        </div>
      </div>
    </div>
  );
};
