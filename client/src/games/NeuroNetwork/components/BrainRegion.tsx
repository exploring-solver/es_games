import React from 'react';
import { BrainRegion as BrainRegionType } from '../data/brainRegions';

interface BrainRegionProps {
  region: BrainRegionType;
  width: number;
  height: number;
  showInfo?: boolean;
}

export const BrainRegion: React.FC<BrainRegionProps> = ({
  region,
  width,
  height,
  showInfo = true
}) => {
  return (
    <g>
      {/* Background */}
      <rect
        width={width}
        height={height}
        fill={region.backgroundColor}
      />

      {/* Neural network pattern in background */}
      <g opacity={0.1}>
        {generateNeuralPattern(width, height, region.neuronColor)}
      </g>

      {/* Region info panel */}
      {showInfo && (
        <g>
          {/* Top info bar */}
          <rect
            width={width}
            height={60}
            fill="rgba(0, 0, 0, 0.8)"
          />

          {/* Region name */}
          <text
            x={20}
            y={25}
            fontSize="20"
            fontWeight="bold"
            fill={region.color}
          >
            {region.name}
          </text>

          {/* Region description */}
          <text
            x={20}
            y={45}
            fontSize="12"
            fill="rgba(255, 255, 255, 0.8)"
          >
            {region.description}
          </text>

          {/* Difficulty indicator */}
          <g transform={`translate(${width - 150}, 20)`}>
            <text
              x={0}
              y={0}
              fontSize="12"
              fill="rgba(255, 255, 255, 0.7)"
            >
              Difficulty:
            </text>
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                cx={70 + i * 15}
                cy={-5}
                r={5}
                fill={i < region.difficulty ? region.color : 'rgba(255, 255, 255, 0.2)'}
              />
            ))}
          </g>
        </g>
      )}

      {/* Decorative elements based on region */}
      {getRegionDecoration(region, width, height)}
    </g>
  );
};

function generateNeuralPattern(width: number, height: number, color: string): JSX.Element[] {
  const elements: JSX.Element[] = [];
  const gridSize = 100;

  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      // Random neurons
      const neuronX = x + Math.random() * gridSize;
      const neuronY = y + Math.random() * gridSize;

      elements.push(
        <circle
          key={`neuron-${x}-${y}`}
          cx={neuronX}
          cy={neuronY}
          r={3}
          fill={color}
        />
      );

      // Connect to nearby neurons
      if (x < width - gridSize && Math.random() > 0.5) {
        const nextNeuronX = x + gridSize + Math.random() * gridSize;
        const nextNeuronY = y + Math.random() * gridSize;

        elements.push(
          <line
            key={`synapse-${x}-${y}`}
            x1={neuronX}
            y1={neuronY}
            x2={nextNeuronX}
            y2={nextNeuronY}
            stroke={color}
            strokeWidth={1}
            opacity={0.3}
          />
        );
      }
    }
  }

  return elements;
}

function getRegionDecoration(region: BrainRegionType, width: number, height: number): JSX.Element | null {
  switch (region.id) {
    case 'cortex':
      return (
        <g opacity={0.15}>
          {/* Layered cortex structure */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line
              key={i}
              x1={0}
              y1={100 + i * 80}
              x2={width}
              y2={100 + i * 80}
              stroke={region.color}
              strokeWidth={2}
              strokeDasharray="10,5"
            />
          ))}
        </g>
      );

    case 'hippocampus':
      return (
        <g opacity={0.15}>
          {/* Curved hippocampus shape */}
          <path
            d={`M 0,${height / 2} Q ${width / 2},${height / 4} ${width},${height / 2}`}
            fill="none"
            stroke={region.color}
            strokeWidth={3}
          />
          <path
            d={`M 0,${height / 2 + 50} Q ${width / 2},${height / 4 + 50} ${width},${height / 2 + 50}`}
            fill="none"
            stroke={region.color}
            strokeWidth={3}
          />
        </g>
      );

    case 'cerebellum':
      return (
        <g opacity={0.15}>
          {/* Parallel fibers */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={100 + i * 25}
              x2={width}
              y2={100 + i * 25}
              stroke={region.color}
              strokeWidth={1}
            />
          ))}
        </g>
      );

    case 'amygdala':
      return (
        <g opacity={0.15}>
          {/* Almond shape */}
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={150}
            ry={200}
            fill="none"
            stroke={region.color}
            strokeWidth={3}
          />
        </g>
      );

    case 'prefrontal':
      return (
        <g opacity={0.15}>
          {/* Grid pattern for executive function */}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i}>
              <line
                x1={i * (width / 10)}
                y1={0}
                x2={i * (width / 10)}
                y2={height}
                stroke={region.color}
                strokeWidth={1}
              />
              <line
                x1={0}
                y1={i * (height / 10)}
                x2={width}
                y2={i * (height / 10)}
                stroke={region.color}
                strokeWidth={1}
              />
            </g>
          ))}
        </g>
      );

    default:
      return null;
  }
}

// Educational info panel component
interface BrainRegionInfoProps {
  region: BrainRegionType;
  onClose: () => void;
}

export const BrainRegionInfo: React.FC<BrainRegionInfoProps> = ({ region, onClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.95)',
        border: `2px solid ${region.color}`,
        borderRadius: '10px',
        padding: '30px',
        maxWidth: '500px',
        color: 'white',
        zIndex: 1000
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer'
        }}
      >
        ×
      </button>

      <h2 style={{ color: region.color, marginBottom: '10px' }}>
        {region.name}
      </h2>

      <p style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
        {region.description}
      </p>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '15px',
          borderRadius: '5px',
          borderLeft: `4px solid ${region.color}`
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          {region.educationalInfo}
        </p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={onClose}
          style={{
            background: region.color,
            border: 'none',
            padding: '10px 30px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
