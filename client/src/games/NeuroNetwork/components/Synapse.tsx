import React, { useState } from 'react';
import { Synapse as SynapseType, Neuron } from '../data/levels';

interface SynapseProps {
  synapse: SynapseType;
  fromNeuron: Neuron;
  toNeuron: Neuron;
  isPlayerCreated?: boolean;
  onClick?: (synapseId: string) => void;
  brainRegionColor?: string;
}

export const Synapse: React.FC<SynapseProps> = ({
  synapse,
  fromNeuron,
  toNeuron,
  isPlayerCreated = false,
  onClick,
  brainRegionColor = '#8B5CF6'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNeurotransmitterColor = () => {
    switch (synapse.neurotransmitter) {
      case 'glutamate':
        return '#F59E0B';
      case 'gaba':
        return '#6366F1';
      case 'dopamine':
        return '#EC4899';
      case 'serotonin':
        return '#8B5CF6';
      case 'acetylcholine':
        return '#10B981';
      case 'norepinephrine':
        return '#EF4444';
      default:
        return brainRegionColor;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(synapse.id);
    }
  };

  const color = getNeurotransmitterColor();
  const strokeWidth = isHovered ? 3 : 2;
  const opacity = isPlayerCreated ? 0.9 : 0.5;

  // Calculate control point for curved line
  const midX = (fromNeuron.x + toNeuron.x) / 2;
  const midY = (fromNeuron.y + toNeuron.y) / 2;

  // Offset for curve
  const dx = toNeuron.x - fromNeuron.x;
  const dy = toNeuron.y - fromNeuron.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.min(dist * 0.2, 50);

  // Perpendicular offset
  const offsetX = -dy / dist * curvature;
  const offsetY = dx / dist * curvature;

  const controlX = midX + offsetX;
  const controlY = midY + offsetY;

  // Arrow head calculation
  const arrowSize = 8;
  const angle = Math.atan2(toNeuron.y - controlY, toNeuron.x - controlX);
  const arrowX = toNeuron.x - 20 * Math.cos(angle);
  const arrowY = toNeuron.y - 20 * Math.sin(angle);

  return (
    <g
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: isPlayerCreated ? 'pointer' : 'default' }}
    >
      {/* Main synapse path */}
      <path
        d={`M ${fromNeuron.x} ${fromNeuron.y} Q ${controlX} ${controlY} ${toNeuron.x} ${toNeuron.y}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeDasharray={synapse.neurotransmitter === 'gaba' ? '5,5' : 'none'}
        style={{
          transition: 'all 0.2s',
          filter: isHovered ? `drop-shadow(0 0 5px ${color})` : 'none'
        }}
      />

      {/* Invisible wider path for easier hovering */}
      <path
        d={`M ${fromNeuron.x} ${fromNeuron.y} Q ${controlX} ${controlY} ${toNeuron.x} ${toNeuron.y}`}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: isPlayerCreated ? 'pointer' : 'default' }}
      />

      {/* Arrow head */}
      <polygon
        points={`
          ${arrowX},${arrowY}
          ${arrowX - arrowSize * Math.cos(angle - Math.PI / 6)},${arrowY - arrowSize * Math.sin(angle - Math.PI / 6)}
          ${arrowX - arrowSize * Math.cos(angle + Math.PI / 6)},${arrowY - arrowSize * Math.sin(angle + Math.PI / 6)}
        `}
        fill={color}
        opacity={opacity}
        style={{
          transition: 'all 0.2s',
          filter: isHovered ? `drop-shadow(0 0 3px ${color})` : 'none'
        }}
      />

      {/* Weight indicator (if not 1) */}
      {synapse.weight !== 1 && (
        <g transform={`translate(${midX}, ${midY})`}>
          <circle r={12} fill="rgba(0, 0, 0, 0.8)" stroke={color} strokeWidth={1} />
          <text
            textAnchor="middle"
            dy="0.3em"
            fontSize="10"
            fill="white"
            fontWeight="bold"
          >
            {synapse.weight.toFixed(1)}
          </text>
        </g>
      )}

      {/* Neurotransmitter label on hover */}
      {isHovered && synapse.neurotransmitter && (
        <g transform={`translate(${controlX}, ${controlY})`}>
          <rect
            x={-40}
            y={-15}
            width={80}
            height={25}
            rx={3}
            fill="rgba(0, 0, 0, 0.9)"
            stroke={color}
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dy="0.3em"
            fontSize="11"
            fill={color}
            fontWeight="bold"
          >
            {synapse.neurotransmitter}
          </text>
        </g>
      )}

      {/* Delete indicator for player synapses on hover */}
      {isPlayerCreated && isHovered && (
        <g transform={`translate(${controlX}, ${controlY - 30})`}>
          <circle r={10} fill="#EF4444" />
          <text
            textAnchor="middle"
            dy="0.3em"
            fontSize="12"
            fill="white"
            fontWeight="bold"
          >
            ×
          </text>
        </g>
      )}

      {/* Flow animation for active synapses */}
      {isHovered && (
        <>
          <defs>
            <linearGradient id={`gradient-${synapse.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${fromNeuron.x} ${fromNeuron.y} Q ${controlX} ${controlY} ${toNeuron.x} ${toNeuron.y}`}
            fill="none"
            stroke={`url(#gradient-${synapse.id})`}
            strokeWidth={strokeWidth + 2}
            opacity={0.6}
            style={{
              animation: 'flow 2s linear infinite'
            }}
          />
        </>
      )}

      <style>
        {`
          @keyframes flow {
            0% { stroke-dashoffset: 0; stroke-dasharray: 20 100; }
            100% { stroke-dashoffset: 120; stroke-dasharray: 20 100; }
          }
        `}
      </style>
    </g>
  );
};

// Component for drawing temporary synapse while dragging
interface TempSynapseProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
}

export const TempSynapse: React.FC<TempSynapseProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  color = '#60A5FA'
}) => {
  return (
    <g>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5,5"
        opacity={0.6}
      />
      <circle
        cx={toX}
        cy={toY}
        r={5}
        fill={color}
        opacity={0.6}
      />
    </g>
  );
};
