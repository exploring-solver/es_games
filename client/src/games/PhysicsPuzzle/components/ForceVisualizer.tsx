import React from 'react';
import { ForceVector } from '../utils/physicsSimulation';

interface ForceVisualizerProps {
  forces: ForceVector[];
  width: number;
  height: number;
  showLabels?: boolean;
}

export const ForceVisualizer: React.FC<ForceVisualizerProps> = ({
  forces,
  width,
  height,
  showLabels = true,
}) => {
  return (
    <svg
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <marker
          id="arrowhead-gravity"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b6b" />
        </marker>
        <marker
          id="arrowhead-normal"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#4ecdc4" />
        </marker>
        <marker
          id="arrowhead-friction"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#f9ca24" />
        </marker>
        <marker
          id="arrowhead-tension"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#95a5a6" />
        </marker>
        <marker
          id="arrowhead-applied"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#9b59b6" />
        </marker>
      </defs>

      {forces.map((force, index) => {
        const scale = Math.min(50, force.magnitude * 20);
        const endX = force.origin.x + force.direction.x * scale;
        const endY = force.origin.y + force.direction.y * scale;

        return (
          <g key={`${force.id}-${index}`}>
            {/* Force vector line */}
            <line
              x1={force.origin.x}
              y1={force.origin.y}
              x2={endX}
              y2={endY}
              stroke={force.color}
              strokeWidth="2"
              markerEnd={`url(#arrowhead-${force.type})`}
              opacity="0.8"
            />

            {/* Force origin point */}
            <circle
              cx={force.origin.x}
              cy={force.origin.y}
              r="3"
              fill={force.color}
              opacity="0.6"
            />

            {/* Label */}
            {showLabels && force.magnitude > 0.5 && (
              <text
                x={endX + 10}
                y={endY}
                fill={force.color}
                fontSize="10"
                fontFamily="monospace"
                opacity="0.9"
              >
                {force.type.charAt(0).toUpperCase()}
                {force.magnitude.toFixed(1)}N
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

interface ForceLegendProps {
  compact?: boolean;
}

export const ForceLegend: React.FC<ForceLegendProps> = ({ compact = false }) => {
  const forces = [
    { type: 'Gravity', color: '#ff6b6b', symbol: 'Fg' },
    { type: 'Normal', color: '#4ecdc4', symbol: 'N' },
    { type: 'Friction', color: '#f9ca24', symbol: 'Ff' },
    { type: 'Tension', color: '#95a5a6', symbol: 'T' },
    { type: 'Applied', color: '#9b59b6', symbol: 'Fa' },
  ];

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '10px',
          fontSize: '11px',
          fontFamily: 'monospace',
        }}
      >
        {forces.map((force) => (
          <div key={force.type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '2px',
                backgroundColor: force.color,
              }}
            />
            <span style={{ color: force.color }}>{force.symbol}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#64b5f6' }}>
        Force Vectors
      </div>
      {forces.map((force) => (
        <div
          key={force.type}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <svg width="30" height="2">
            <line
              x1="0"
              y1="1"
              x2="30"
              y2="1"
              stroke={force.color}
              strokeWidth="2"
            />
            <polygon
              points="30,1 25,0 25,2"
              fill={force.color}
            />
          </svg>
          <span style={{ color: force.color, minWidth: '20px' }}>{force.symbol}</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{force.type}</span>
        </div>
      ))}
    </div>
  );
};
