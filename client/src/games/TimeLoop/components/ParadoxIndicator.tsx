import React from 'react';
import { Paradox, ParadoxType } from '../utils/paradoxResolver';

interface ParadoxIndicatorProps {
  paradoxes: Paradox[];
  unresolvedParadoxes: Paradox[];
  totalSeverity: number;
  maxTolerance: number;
  isStable: boolean;
  onResolveParadox?: (paradoxId: string) => void;
}

export const ParadoxIndicator: React.FC<ParadoxIndicatorProps> = ({
  paradoxes,
  unresolvedParadoxes,
  totalSeverity,
  maxTolerance,
  isStable,
  onResolveParadox,
}) => {
  const severityPercent = Math.min(100, (totalSeverity / maxTolerance) * 100);

  const getParadoxIcon = (type: ParadoxType): string => {
    const icons: Record<ParadoxType, string> = {
      grandfather: '👴',
      bootstrap: '🔄',
      predestination: '♾️',
      ontological: '❓',
      causal_loop: '🌀',
      temporal_collision: '💥',
      information_duplicate: '📋',
      causality_violation: '⚠️',
    };

    return icons[type] || '⚡';
  };

  const getSeverityColor = (severity: number): string => {
    if (severity < 3) return '#4ade80';
    if (severity < 6) return '#fbbf24';
    if (severity < 8) return '#fb923c';
    return '#ef4444';
  };

  return (
    <div
      style={{
        padding: '15px',
        background: isStable
          ? 'linear-gradient(135deg, #0a1628 0%, #1a2940 100%)'
          : 'linear-gradient(135deg, #2d0a0a 0%, #4a1515 100%)',
        borderRadius: '10px',
        border: `2px solid ${isStable ? 'rgba(100, 200, 255, 0.5)' : 'rgba(255, 100, 100, 0.8)'}`,
        boxShadow: isStable
          ? '0 0 20px rgba(100, 200, 255, 0.3)'
          : '0 0 30px rgba(255, 100, 100, 0.5), 0 0 10px rgba(255, 100, 100, 0.8) inset',
        minWidth: '300px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '15px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: isStable ? '#64b5f6' : '#ff6b6b',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Paradox Status
          </h3>
          <span
            style={{
              fontSize: '20px',
              animation: isStable ? 'none' : 'pulse 1s infinite',
            }}
          >
            {isStable ? '✓' : '⚠️'}
          </span>
        </div>

        {/* Severity Bar */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              height: '20px',
              background: `linear-gradient(90deg, #4ade80 0%, #fbbf24 50%, #ef4444 100%)`,
              width: `${severityPercent}%`,
              borderRadius: '7px',
              transition: 'width 0.3s ease, box-shadow 0.3s ease',
              boxShadow:
                severityPercent > 80
                  ? '0 0 15px rgba(239, 68, 68, 0.8)'
                  : '0 0 10px rgba(74, 222, 128, 0.5)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
            >
              {totalSeverity} / {maxTolerance}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '5px',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'right',
          }}
        >
          Timeline Stability: {isStable ? 'STABLE' : 'CRITICAL'}
        </div>
      </div>

      {/* Active Paradoxes */}
      {unresolvedParadoxes.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Active Paradoxes ({unresolvedParadoxes.length})
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {unresolvedParadoxes.map(paradox => (
              <div
                key={paradox.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  border: `1px solid ${getSeverityColor(paradox.severity)}40`,
                  borderLeft: `4px solid ${getSeverityColor(paradox.severity)}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{getParadoxIcon(paradox.type)}</span>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                      {paradox.type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <span
                    style={{
                      background: getSeverityColor(paradox.severity),
                      color: '#000',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                  >
                    {paradox.severity}/10
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '5px',
                  }}
                >
                  {paradox.description}
                </div>

                <div
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Time: {paradox.timestamp.toFixed(1)}s | Actions: {paradox.involvedActions.length}
                </div>

                {onResolveParadox && (
                  <button
                    onClick={() => onResolveParadox(paradox.id)}
                    style={{
                      marginTop: '8px',
                      background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                      color: '#000',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          fontSize: '11px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total</div>
          <div style={{ color: '#64b5f6', fontSize: '16px', fontWeight: 'bold' }}>
            {paradoxes.length}
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Resolved</div>
          <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 'bold' }}>
            {paradoxes.length - unresolvedParadoxes.length}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};
