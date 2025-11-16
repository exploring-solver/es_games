import React, { useState } from 'react';
import { Neuron as NeuronType } from '../data/levels';
import { NeuronState } from '../utils/neuralEngine';

interface NeuronProps {
  neuron: NeuronType;
  state?: NeuronState;
  pulseIntensity?: number;
  onMouseDown?: (neuronId: string, x: number, y: number) => void;
  onMouseUp?: (neuronId: string) => void;
  onMouseEnter?: (neuronId: string) => void;
  onClick?: (neuronId: string) => void;
  brainRegionColor?: string;
  showTooltip?: boolean;
}

export const Neuron: React.FC<NeuronProps> = ({
  neuron,
  state,
  pulseIntensity = 0,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onClick,
  brainRegionColor = '#8B5CF6',
  showTooltip = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeColor = () => {
    switch (neuron.type) {
      case 'input':
        return '#10B981';
      case 'output':
        return '#EF4444';
      case 'hidden':
        return brainRegionColor;
      default:
        return '#6B7280';
    }
  };

  const getDisorderEffect = () => {
    if (!neuron.disorder) return {};

    switch (neuron.disorder) {
      case 'hyperexcitable':
        return {
          animation: 'pulse 0.5s infinite',
          filter: 'brightness(1.3)'
        };
      case 'hypoactive':
        return {
          opacity: 0.6,
          filter: 'grayscale(0.3)'
        };
      case 'leaky':
        return {
          animation: 'flicker 1s infinite',
          filter: 'brightness(0.8)'
        };
      case 'prolongedRefractory':
        return {
          animation: 'pulse 2s infinite',
          filter: 'hue-rotate(45deg)'
        };
      case 'spontaneous':
        return {
          animation: 'sparkle 1.5s infinite',
          filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
        };
      default:
        return {};
    }
  };

  const getActivationLevel = () => {
    if (!state) return 0;
    return Math.min(state.activationLevel / neuron.threshold, 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onMouseDown) {
      onMouseDown(neuron.id, neuron.x, neuron.y);
    }
  };

  const handleMouseUp = () => {
    if (onMouseUp) {
      onMouseUp(neuron.id);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) {
      onMouseEnter(neuron.id);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(neuron.id);
    }
  };

  const color = getTypeColor();
  const activationLevel = getActivationLevel();
  const disorderEffect = getDisorderEffect();
  const size = neuron.type === 'input' || neuron.type === 'output' ? 20 : 16;
  const pulseSize = size + pulseIntensity * 10;

  return (
    <g
      transform={`translate(${neuron.x}, ${neuron.y})`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Pulse effect */}
      {pulseIntensity > 0 && (
        <circle
          r={pulseSize}
          fill={color}
          opacity={pulseIntensity * 0.3}
          style={{
            transition: 'all 0.3s ease-out'
          }}
        />
      )}

      {/* Activation level indicator */}
      {activationLevel > 0 && (
        <circle
          r={size + 5}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={activationLevel * 0.6}
        />
      )}

      {/* Main neuron body */}
      <circle
        r={size}
        fill={color}
        stroke={isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'}
        strokeWidth={isHovered ? 3 : 2}
        style={{
          filter: `drop-shadow(0 0 ${pulseIntensity * 10}px ${color})`,
          transition: 'all 0.2s',
          ...disorderEffect
        }}
      />

      {/* Refractory indicator */}
      {state?.isRefractory && (
        <circle
          r={size - 4}
          fill="rgba(0, 0, 0, 0.5)"
          pointerEvents="none"
        />
      )}

      {/* Type indicator */}
      <text
        textAnchor="middle"
        dy="0.3em"
        fontSize="10"
        fill="white"
        fontWeight="bold"
        pointerEvents="none"
      >
        {neuron.type === 'input' ? 'I' : neuron.type === 'output' ? 'O' : ''}
      </text>

      {/* Threshold indicator (below neuron) */}
      {neuron.threshold > 1 && (
        <text
          textAnchor="middle"
          dy={size + 15}
          fontSize="10"
          fill="rgba(255, 255, 255, 0.7)"
          pointerEvents="none"
        >
          θ={neuron.threshold}
        </text>
      )}

      {/* Hover tooltip */}
      {(isHovered || showTooltip) && (
        <g transform={`translate(0, ${-size - 20})`}>
          <rect
            x={-60}
            y={-25}
            width={120}
            height={50}
            rx={5}
            fill="rgba(0, 0, 0, 0.9)"
            stroke={color}
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dy={-10}
            fontSize="11"
            fill="white"
            fontWeight="bold"
          >
            {neuron.type.toUpperCase()}
          </text>
          <text
            textAnchor="middle"
            dy={5}
            fontSize="9"
            fill="rgba(255, 255, 255, 0.8)"
          >
            Threshold: {neuron.threshold}
          </text>
          {neuron.disorder && (
            <text
              textAnchor="middle"
              dy={18}
              fontSize="9"
              fill="#F59E0B"
            >
              {neuron.disorder}
            </text>
          )}
        </g>
      )}

      {/* Activation count (for debugging) */}
      {state && state.timesActivated > 0 && (
        <text
          textAnchor="middle"
          dy={size + 28}
          fontSize="9"
          fill="rgba(255, 255, 255, 0.5)"
          pointerEvents="none"
        >
          {state.timesActivated}x
        </text>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes sparkle {
            0%, 100% { filter: brightness(1); }
            25% { filter: brightness(1.5); }
            50% { filter: brightness(1); }
            75% { filter: brightness(1.5); }
          }
        `}
      </style>
    </g>
  );
};
