import React from 'react';
import { ParticleType, PARTICLES } from '../data/particles';
import { Discovery } from '../hooks/useCollisions';

interface DiscoveryLogProps {
  discoveries: Discovery[];
  discoveredParticles: ParticleType[];
  totalScore: number;
}

export const DiscoveryLog: React.FC<DiscoveryLogProps> = ({
  discoveries,
  discoveredParticles,
  totalScore,
}) => {
  const recentDiscoveries = discoveries.slice(-10).reverse();

  return (
    <div
      style={{
        padding: '15px',
        background: 'rgba(20, 20, 40, 0.9)',
        borderRadius: '10px',
        border: '2px solid rgba(100, 200, 255, 0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4 style={{ margin: 0, color: '#60a5fa', fontSize: '16px' }}>
          Discovery Log
        </h4>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>
          {totalScore.toLocaleString()} pts
        </div>
      </div>

      <div
        style={{
          marginBottom: '15px',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
            {discoveredParticles.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Discovered</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>
            {Object.keys(PARTICLES).length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Total</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>
            {Math.round((discoveredParticles.length / Object.keys(PARTICLES).length) * 100)}%
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Complete</div>
        </div>
      </div>

      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8' }}>
          Recent Discoveries
        </h5>

        {recentDiscoveries.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '12px',
            }}
          >
            No discoveries yet
          </div>
        ) : (
          recentDiscoveries.map((discovery, index) => (
            <DiscoveryCard key={`${discovery.particle}-${discovery.timestamp}`} discovery={discovery} />
          ))
        )}
      </div>
    </div>
  );
};

interface DiscoveryCardProps {
  discovery: Discovery;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ discovery }) => {
  const particleData = PARTICLES[discovery.particle];
  const timeAgo = Math.floor((Date.now() - discovery.timestamp) / 1000);

  return (
    <div
      style={{
        marginBottom: '8px',
        padding: '10px',
        background: discovery.isFirstDiscovery
          ? 'rgba(34, 197, 94, 0.1)'
          : 'rgba(0, 0, 0, 0.4)',
        borderRadius: '6px',
        border: discovery.isFirstDiscovery
          ? '2px solid rgba(34, 197, 94, 0.5)'
          : '1px solid rgba(100, 150, 255, 0.2)',
        position: 'relative',
        animation: discovery.isFirstDiscovery ? 'pulse 2s ease-in-out' : 'none',
      }}
    >
      {discovery.isFirstDiscovery && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '8px',
            padding: '2px 8px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          NEW!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: particleData.color, marginBottom: '3px' }}>
            {particleData.name} ({particleData.symbol})
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            {particleData.description}
          </div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fbbf24' }}>
            +{discovery.score}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>
            {timeAgo}s ago
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', fontSize: '10px', flexWrap: 'wrap' }}>
        <span
          style={{
            padding: '2px 6px',
            background: 'rgba(96, 165, 250, 0.2)',
            borderRadius: '4px',
            color: '#60a5fa',
          }}
        >
          {particleData.category}
        </span>
        <span
          style={{
            padding: '2px 6px',
            background: 'rgba(251, 191, 36, 0.2)',
            borderRadius: '4px',
            color: '#fbbf24',
          }}
        >
          {discovery.energy.toFixed(1)} GeV
        </span>
        <span
          style={{
            padding: '2px 6px',
            background: 'rgba(167, 139, 250, 0.2)',
            borderRadius: '4px',
            color: '#a78bfa',
          }}
        >
          Discovered {particleData.discoveryYear}
        </span>
        {particleData.rarity > 7 && (
          <span
            style={{
              padding: '2px 6px',
              background: 'rgba(217, 70, 239, 0.2)',
              borderRadius: '4px',
              color: '#d946ef',
            }}
          >
            RARE
          </span>
        )}
      </div>
    </div>
  );
};

// Particle Collection Grid
interface ParticleGridProps {
  discoveredParticles: ParticleType[];
}

export const ParticleGrid: React.FC<ParticleGridProps> = ({ discoveredParticles }) => {
  const allParticles = Object.keys(PARTICLES) as ParticleType[];
  const discoveredSet = new Set(discoveredParticles);

  return (
    <div
      style={{
        padding: '15px',
        background: 'rgba(20, 20, 40, 0.9)',
        borderRadius: '10px',
        border: '2px solid rgba(100, 200, 255, 0.3)',
      }}
    >
      <h4 style={{ margin: '0 0 15px 0', color: '#60a5fa', fontSize: '16px' }}>
        Particle Collection
      </h4>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {allParticles.map(particleType => {
          const particleData = PARTICLES[particleType];
          const discovered = discoveredSet.has(particleType);

          return (
            <div
              key={particleType}
              style={{
                padding: '10px',
                background: discovered ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.7)',
                borderRadius: '8px',
                border: discovered
                  ? `2px solid ${particleData.color}60`
                  : '2px solid rgba(100, 100, 100, 0.3)',
                opacity: discovered ? 1 : 0.5,
                transition: 'all 0.3s',
                cursor: discovered ? 'pointer' : 'default',
              }}
              onMouseEnter={e => {
                if (discovered) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = particleData.color;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                if (discovered) {
                  e.currentTarget.style.borderColor = `${particleData.color}60`;
                }
              }}
              title={discovered ? particleData.description : '???'}
            >
              <div
                style={{
                  fontSize: '24px',
                  textAlign: 'center',
                  marginBottom: '5px',
                  color: discovered ? particleData.color : '#333',
                }}
              >
                {discovered ? particleData.symbol : '?'}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  textAlign: 'center',
                  color: discovered ? '#fff' : '#555',
                  fontWeight: 'bold',
                }}
              >
                {discovered ? particleData.name : '???'}
              </div>
              {discovered && (
                <div
                  style={{
                    fontSize: '9px',
                    textAlign: 'center',
                    color: '#64748b',
                    marginTop: '3px',
                  }}
                >
                  {particleData.category}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
