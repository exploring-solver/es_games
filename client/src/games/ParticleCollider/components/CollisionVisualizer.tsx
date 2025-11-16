import React, { useRef, useEffect } from 'react';
import { CollisionEvent } from '../hooks/useCollisions';
import { PARTICLES } from '../data/particles';
import { generateFeynmanDiagram } from '../data/collisionRules';

interface CollisionVisualizerProps {
  recentCollisions: CollisionEvent[];
  onSelectCollision?: (collision: CollisionEvent) => void;
}

export const CollisionVisualizer: React.FC<CollisionVisualizerProps> = ({
  recentCollisions,
  onSelectCollision,
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
      <h4 style={{ margin: '0 0 15px 0', color: '#60a5fa', fontSize: '16px' }}>
        Recent Collisions
      </h4>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {recentCollisions.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '13px',
            }}
          >
            No collisions yet. Fire the beams!
          </div>
        ) : (
          recentCollisions.map((collision, index) => (
            <CollisionCard
              key={collision.id}
              collision={collision}
              index={index}
              onClick={() => onSelectCollision?.(collision)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface CollisionCardProps {
  collision: CollisionEvent;
  index: number;
  onClick: () => void;
}

const CollisionCard: React.FC<CollisionCardProps> = ({ collision, index, onClick }) => {
  const p1Data = PARTICLES[collision.particle1];
  const p2Data = PARTICLES[collision.particle2];
  const timeAgo = Math.floor((Date.now() - collision.timestamp) / 1000);

  return (
    <div
      onClick={onClick}
      style={{
        marginBottom: '10px',
        padding: '12px',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',
        border: '1px solid rgba(100, 150, 255, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(100, 150, 255, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(100, 150, 255, 0.5)';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = 'rgba(100, 150, 255, 0.2)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: '#64748b' }}>#{index + 1}</span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>{timeAgo}s ago</span>
      </div>

      <div style={{ fontSize: '13px', marginBottom: '8px', color: '#fff' }}>
        <span style={{ color: p1Data.color, fontWeight: 'bold' }}>{p1Data.symbol}</span>
        {' + '}
        <span style={{ color: p2Data.color, fontWeight: 'bold' }}>{p2Data.symbol}</span>
        {' → '}
        {collision.products.map((product, i) => (
          <span key={i}>
            <span style={{ color: PARTICLES[product].color, fontWeight: 'bold' }}>
              {PARTICLES[product].symbol}
            </span>
            {i < collision.products.length - 1 ? ' + ' : ''}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <span style={{ color: '#fbbf24' }}>⚡ {collision.energy.toFixed(1)} GeV</span>
        <span style={{ color: '#a78bfa' }}>
          {collision.products.length} particle{collision.products.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

// Feynman Diagram Visualizer
interface FeynmanDiagramProps {
  collision: CollisionEvent | null;
  width?: number;
  height?: number;
}

export const FeynmanDiagram: React.FC<FeynmanDiagramProps> = ({
  collision,
  width = 400,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!collision) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0a0a1a');
    bgGradient.addColorStop(1, '#1a0a2a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Generate diagram
    const diagram = generateFeynmanDiagram(
      collision.particle1,
      collision.particle2,
      collision.products
    );

    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 60;

    // Draw time axis
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, height - 20);
    ctx.lineTo(width - padding, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time →', width - padding - 20, height - 5);

    // Incoming particles
    const p1Data = PARTICLES[collision.particle1];
    const p2Data = PARTICLES[collision.particle2];

    // Particle 1 line (from left top)
    ctx.strokeStyle = p1Data.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding, centerY - 40);
    ctx.lineTo(centerX - 20, centerY);
    ctx.stroke();

    // Particle 1 label
    ctx.fillStyle = p1Data.color;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(p1Data.symbol, padding - 10, centerY - 50);

    // Particle 2 line (from left bottom)
    ctx.strokeStyle = p2Data.color;
    ctx.beginPath();
    ctx.moveTo(padding, centerY + 40);
    ctx.lineTo(centerX - 20, centerY);
    ctx.stroke();

    // Particle 2 label
    ctx.fillStyle = p2Data.color;
    ctx.fillText(p2Data.symbol, padding - 10, centerY + 50);

    // Collision vertex
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Outgoing particles
    const angleStep = Math.PI / (collision.products.length + 1);
    const startAngle = -Math.PI / 2 - angleStep * (collision.products.length / 2);

    collision.products.forEach((product, i) => {
      const productData = PARTICLES[product];
      const angle = startAngle + angleStep * (i + 1);
      const endX = width - padding;
      const endY = centerY + Math.tan(angle) * (endX - centerX);

      // Draw particle line
      ctx.strokeStyle = productData.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + 20, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw wavy line for bosons
      if (productData.category === 'boson') {
        ctx.strokeStyle = productData.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const steps = 20;
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          const x = centerX + 20 + (endX - centerX - 20) * t;
          const y = centerY + (endY - centerY) * t;
          const wave = Math.sin(t * Math.PI * 4) * 5;
          const perpX = -(endY - centerY);
          const perpY = endX - centerX;
          const length = Math.sqrt(perpX * perpX + perpY * perpY);
          const waveX = x + (perpX / length) * wave;
          const waveY = y + (perpY / length) * wave;

          if (j === 0) {
            ctx.moveTo(waveX, waveY);
          } else {
            ctx.lineTo(waveX, waveY);
          }
        }
        ctx.stroke();
      }

      // Product label
      ctx.fillStyle = productData.color;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(productData.symbol, endX + 10, endY);
    });

    // Process name
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(diagram.processName, centerX, 25);

    // Energy display
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`√s = ${collision.energy.toFixed(1)} GeV`, centerX, 45);
  }, [collision, width, height]);

  if (!collision) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(20, 20, 40, 0.9)',
          borderRadius: '10px',
          border: '2px solid rgba(100, 150, 255, 0.3)',
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        Select a collision to view Feynman diagram
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ margin: '0 0 10px 0', color: '#60a5fa', fontSize: '16px' }}>
        Feynman Diagram
      </h4>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          borderRadius: '10px',
          border: '2px solid rgba(100, 150, 255, 0.3)',
          background: '#000',
        }}
      />
    </div>
  );
};
