import React from 'react';
import { ParticleType } from '../data/particles';

interface AcceleratorProps {
  beam1Energy: number;
  beam2Energy: number;
  beam1Particle: ParticleType;
  beam2Particle: ParticleType;
  maxEnergy: number;
  isActive: boolean;
  onBeam1EnergyChange: (energy: number) => void;
  onBeam2EnergyChange: (energy: number) => void;
  onBeam1ParticleChange: (particle: ParticleType) => void;
  onBeam2ParticleChange: (particle: ParticleType) => void;
  onFire: () => void;
}

export const Accelerator: React.FC<AcceleratorProps> = ({
  beam1Energy,
  beam2Energy,
  beam1Particle,
  beam2Particle,
  maxEnergy,
  isActive,
  onBeam1EnergyChange,
  onBeam2EnergyChange,
  onBeam1ParticleChange,
  onBeam2ParticleChange,
  onFire,
}) => {
  const totalEnergy = beam1Energy + beam2Energy;
  const energyPercentage = (totalEnergy / (maxEnergy * 2)) * 100;

  const particleOptions: ParticleType[] = [
    'electron',
    'positron',
    'proton',
    'antiproton',
  ];

  return (
    <div
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(40, 20, 60, 0.95) 100%)',
        borderRadius: '12px',
        border: '2px solid rgba(100, 150, 255, 0.3)',
        boxShadow: '0 0 20px rgba(100, 150, 255, 0.2)',
      }}
    >
      <h3
        style={{
          margin: '0 0 15px 0',
          fontSize: '20px',
          background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Particle Accelerator
      </h3>

      {/* Beam 1 Controls */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ fontSize: '14px', color: '#60a5fa' }}>Beam 1</label>
          <span style={{ fontSize: '14px', color: '#fff' }}>{beam1Energy} GeV</span>
        </div>
        <select
          value={beam1Particle}
          onChange={e => onBeam1ParticleChange(e.target.value as ParticleType)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            borderRadius: '6px',
            fontSize: '13px',
          }}
        >
          {particleOptions.map(particle => (
            <option key={particle} value={particle}>
              {particle}
            </option>
          ))}
        </select>
        <input
          type="range"
          min={1}
          max={maxEnergy}
          value={beam1Energy}
          onChange={e => onBeam1EnergyChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#60a5fa',
          }}
        />
      </div>

      {/* Beam 2 Controls */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ fontSize: '14px', color: '#f472b6' }}>Beam 2</label>
          <span style={{ fontSize: '14px', color: '#fff' }}>{beam2Energy} GeV</span>
        </div>
        <select
          value={beam2Particle}
          onChange={e => onBeam2ParticleChange(e.target.value as ParticleType)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: '1px solid rgba(244, 114, 182, 0.5)',
            borderRadius: '6px',
            fontSize: '13px',
          }}
        >
          {particleOptions.map(particle => (
            <option key={particle} value={particle}>
              {particle}
            </option>
          ))}
        </select>
        <input
          type="range"
          min={1}
          max={maxEnergy}
          value={beam2Energy}
          onChange={e => onBeam2EnergyChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#f472b6',
          }}
        />
      </div>

      {/* Total Energy Display */}
      <div
        style={{
          marginBottom: '15px',
          padding: '12px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '8px',
          border: '1px solid rgba(100, 200, 255, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Energy</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }}>
            {totalEnergy} GeV
          </span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${energyPercentage}%`,
              background: `linear-gradient(90deg, #fbbf24, #f59e0b)`,
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Fire Button */}
      <button
        onClick={onFire}
        disabled={isActive}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          background: isActive
            ? 'linear-gradient(135deg, #666, #888)'
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: isActive ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s',
          boxShadow: isActive ? 'none' : '0 0 20px rgba(239, 68, 68, 0.5)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          if (!isActive) {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
          }
        }}
      >
        {isActive ? 'Collision in Progress...' : 'Fire Beams!'}
      </button>

      {/* Status Indicators */}
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isActive ? '#22c55e' : '#64748b',
            boxShadow: isActive ? '0 0 10px #22c55e' : 'none',
            transition: 'all 0.3s',
          }}
        />
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isActive ? '#22c55e' : '#64748b',
            boxShadow: isActive ? '0 0 10px #22c55e' : 'none',
            transition: 'all 0.3s',
            animationDelay: '0.1s',
          }}
        />
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isActive ? '#22c55e' : '#64748b',
            boxShadow: isActive ? '0 0 10px #22c55e' : 'none',
            transition: 'all 0.3s',
            animationDelay: '0.2s',
          }}
        />
      </div>
    </div>
  );
};
