import React from 'react';
import { SignalVisualization, ParticleEffect } from '../hooks/useSignalPropagation';

interface SignalAnimationProps {
  signal: SignalVisualization;
}

export const SignalAnimation: React.FC<SignalAnimationProps> = ({ signal }) => {
  const getNeurotransmitterColor = () => {
    switch (signal.neurotransmitter) {
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
        return '#60A5FA';
    }
  };

  const color = getNeurotransmitterColor();
  const size = 6 + signal.strength * 2;

  return (
    <g>
      {/* Main signal orb */}
      <circle
        cx={signal.x}
        cy={signal.y}
        r={size}
        fill={color}
        opacity={0.8}
        style={{
          filter: `drop-shadow(0 0 ${size * 2}px ${color})`
        }}
      />

      {/* Inner glow */}
      <circle
        cx={signal.x}
        cy={signal.y}
        r={size * 0.5}
        fill="white"
        opacity={0.6}
      />

      {/* Outer pulse ring */}
      <circle
        cx={signal.x}
        cy={signal.y}
        r={size * 1.5}
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={0.4}
        style={{
          animation: 'pulse-ring 1s infinite'
        }}
      />

      {/* Speed indicator trail */}
      {signal.neurotransmitter === 'norepinephrine' && (
        <>
          <circle
            cx={signal.x - 10}
            cy={signal.y}
            r={size * 0.6}
            fill={color}
            opacity={0.3}
          />
          <circle
            cx={signal.x - 20}
            cy={signal.y}
            r={size * 0.4}
            fill={color}
            opacity={0.1}
          />
        </>
      )}

      {/* Inhibitory indicator */}
      {signal.neurotransmitter === 'gaba' && (
        <g transform={`translate(${signal.x}, ${signal.y})`}>
          <line
            x1={-size}
            y1={0}
            x2={size}
            y2={0}
            stroke="white"
            strokeWidth={2}
            opacity={0.8}
          />
        </g>
      )}

      {/* Dopamine sparkles */}
      {signal.neurotransmitter === 'dopamine' && (
        <g transform={`translate(${signal.x}, ${signal.y})`}>
          <polygon
            points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2"
            fill="white"
            opacity={0.6}
            style={{
              animation: 'sparkle 0.5s infinite'
            }}
          />
        </g>
      )}

      <style>
        {`
          @keyframes pulse-ring {
            0% { r: ${size * 1.5}; opacity: 0.4; }
            100% { r: ${size * 2.5}; opacity: 0; }
          }
          @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
          }
        `}
      </style>
    </g>
  );
};

interface ParticleProps {
  particle: ParticleEffect;
}

export const Particle: React.FC<ParticleProps> = ({ particle }) => {
  const opacity = particle.life / particle.maxLife;

  return (
    <circle
      cx={particle.x}
      cy={particle.y}
      r={particle.size}
      fill={particle.color}
      opacity={opacity * 0.6}
      style={{
        filter: `blur(${(1 - opacity) * 2}px)`
      }}
    />
  );
};

interface ParticleFieldProps {
  particles: ParticleEffect[];
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ particles }) => {
  return (
    <g>
      {particles.map(particle => (
        <Particle key={particle.id} particle={particle} />
      ))}
    </g>
  );
};

// Burst effect when neuron fires
interface NeuronBurstProps {
  x: number;
  y: number;
  color: string;
  startTime: number;
}

export const NeuronBurst: React.FC<NeuronBurstProps> = ({ x, y, color, startTime }) => {
  const elapsed = Date.now() - startTime;
  const progress = Math.min(elapsed / 1000, 1);
  const opacity = 1 - progress;
  const radius = 5 + progress * 30;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Expanding ring */}
      <circle
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={opacity * 0.8}
      />

      {/* Inner flash */}
      <circle
        r={radius * 0.5}
        fill={color}
        opacity={opacity * 0.3}
      />

      {/* Radial particles */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const particleX = Math.cos(rad) * radius * 0.8;
        const particleY = Math.sin(rad) * radius * 0.8;

        return (
          <circle
            key={i}
            cx={particleX}
            cy={particleY}
            r={3}
            fill={color}
            opacity={opacity}
          />
        );
      })}
    </g>
  );
};

// Action potential wave effect
interface ActionPotentialWaveProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  color: string;
}

export const ActionPotentialWave: React.FC<ActionPotentialWaveProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  progress,
  color
}) => {
  const currentX = fromX + (toX - fromX) * progress;
  const currentY = fromY + (toY - fromY) * progress;

  // Create wave segments
  const segments = [];
  const waveLength = 50;
  const amplitude = 10;

  for (let i = 0; i < 5; i++) {
    const offset = (progress - i * 0.1) * waveLength;
    const opacity = Math.max(0, 1 - i * 0.2);

    if (offset > 0 && offset < waveLength) {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const perpX = Math.cos(angle + Math.PI / 2);
      const perpY = Math.sin(angle + Math.PI / 2);
      const wave = Math.sin(offset * Math.PI / 10) * amplitude;

      segments.push(
        <circle
          key={i}
          cx={currentX + perpX * wave}
          cy={currentY + perpY * wave}
          r={4}
          fill={color}
          opacity={opacity * 0.5}
        />
      );
    }
  }

  return <g>{segments}</g>;
};
