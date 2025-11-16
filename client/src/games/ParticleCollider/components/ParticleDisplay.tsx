import React, { useRef, useEffect } from 'react';
import { ParticleState, Vector } from '../utils/physicsEngine';
import { PARTICLES } from '../data/particles';

interface ParticleDisplayProps {
  particles: ParticleState[];
  width: number;
  height: number;
  showTrails?: boolean;
  cameraAngle?: number;
}

export const ParticleDisplay: React.FC<ParticleDisplayProps> = ({
  particles,
  width,
  height,
  showTrails = true,
  cameraAngle = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    bgGradient.addColorStop(0, '#0a0a1a');
    bgGradient.addColorStop(0.5, '#1a0a2a');
    bgGradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Transform 3D to 2D with camera angle
    const project = (pos: { x: number; y: number; z: number }) => {
      const scale = 50; // Scale factor for visualization
      const centerX = width / 2;
      const centerY = height / 2;

      // Rotate around Y axis
      const cosAngle = Math.cos(cameraAngle);
      const sinAngle = Math.sin(cameraAngle);
      const rotatedX = pos.x * cosAngle - pos.z * sinAngle;
      const rotatedZ = pos.x * sinAngle + pos.z * cosAngle;

      // Perspective projection
      const perspective = 1000;
      const scale3D = perspective / (perspective + rotatedZ * scale);

      return {
        x: centerX + rotatedX * scale * scale3D,
        y: centerY + pos.y * scale * scale3D,
        depth: rotatedZ,
      };
    };

    // Sort particles by depth for proper rendering
    const sortedParticles = [...particles].sort((a, b) => {
      const depthA = project(a.position).depth;
      const depthB = project(b.position).depth;
      return depthA - depthB;
    });

    // Render particles
    sortedParticles.forEach(particle => {
      const particleData = PARTICLES[particle.type];
      const projected = project(particle.position);

      // Skip if off-screen
      if (projected.x < -50 || projected.x > width + 50 || projected.y < -50 || projected.y > height + 50) {
        return;
      }

      // Draw trail
      if (showTrails && particle.trailPoints.length > 1) {
        ctx.strokeStyle = `${particleData.color}40`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();

        particle.trailPoints.forEach((point, i) => {
          const trailProjected = project(point);
          if (i === 0) {
            ctx.moveTo(trailProjected.x, trailProjected.y);
          } else {
            ctx.lineTo(trailProjected.x, trailProjected.y);
          }
        });

        ctx.stroke();

        // Gradient trail
        if (particle.trailPoints.length > 0) {
          const gradient = ctx.createLinearGradient(
            project(particle.trailPoints[0]).x,
            project(particle.trailPoints[0]).y,
            projected.x,
            projected.y
          );
          gradient.addColorStop(0, `${particleData.color}00`);
          gradient.addColorStop(1, `${particleData.color}80`);
          ctx.strokeStyle = gradient;
          ctx.stroke();
        }
      }

      // Particle glow
      const glowSize = 20;
      const glowGradient = ctx.createRadialGradient(
        projected.x,
        projected.y,
        0,
        projected.x,
        projected.y,
        glowSize
      );
      glowGradient.addColorStop(0, `${particleData.color}60`);
      glowGradient.addColorStop(0.5, `${particleData.color}30`);
      glowGradient.addColorStop(1, `${particleData.color}00`);
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Particle core
      const particleSize = Math.log(particle.energy + 1) + 3;
      ctx.fillStyle = particleData.color;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, particleSize, 0, Math.PI * 2);
      ctx.fill();

      // Particle outline
      ctx.strokeStyle = '#ffffff80';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Charge indicator
      if (particleData.charge !== 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const chargeSymbol = particleData.charge > 0 ? '+' : '-';
        ctx.fillText(chargeSymbol, projected.x, projected.y);
      }

      // Energy indicator (for high energy particles)
      if (particle.energy > 100) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, particleSize + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Particle count
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 150, 30);
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 150, 30);

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Particles: ${particles.length}`, 20, 25);
  }, [particles, width, height, showTrails, cameraAngle]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '2px solid rgba(100, 150, 255, 0.5)',
        borderRadius: '10px',
        background: '#000',
        boxShadow: '0 0 30px rgba(100, 150, 255, 0.3)',
      }}
    />
  );
};

// Detector ring visualization
interface DetectorRingProps {
  radius: number;
  magneticField: number;
  efficiency: number;
}

export const DetectorRing: React.FC<DetectorRingProps> = ({
  radius,
  magneticField,
  efficiency,
}) => {
  return (
    <div
      style={{
        padding: '15px',
        background: 'rgba(20, 20, 40, 0.9)',
        borderRadius: '10px',
        border: '2px solid rgba(100, 200, 255, 0.3)',
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', color: '#60a5fa', fontSize: '16px' }}>
        Detector Configuration
      </h4>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Detector Radius</span>
          <span style={{ fontSize: '13px', color: '#fff' }}>{radius.toFixed(2)} m</span>
        </div>
        <div
          style={{
            height: '6px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(radius / 10) * 100}%`,
              background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Magnetic Field</span>
          <span style={{ fontSize: '13px', color: '#fff' }}>{magneticField.toFixed(1)} T</span>
        </div>
        <div
          style={{
            height: '6px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(magneticField / 14) * 100}%`,
              background: 'linear-gradient(90deg, #a78bfa, #8b5cf6)',
            }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Detection Efficiency</span>
          <span style={{ fontSize: '13px', color: '#fff' }}>{(efficiency * 100).toFixed(0)}%</span>
        </div>
        <div
          style={{
            height: '6px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${efficiency * 100}%`,
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
