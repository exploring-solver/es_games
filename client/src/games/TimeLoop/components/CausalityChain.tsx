import React, { useRef, useEffect, useState } from 'react';
import { CausalLink, ButterflyEffect } from '../utils/paradoxResolver';
import { PlayerAction } from '../utils/timeEngine';

interface CausalityChainProps {
  causalLinks: CausalLink[];
  butterflyEffects: ButterflyEffect[];
  actions: PlayerAction[];
  width?: number;
  height?: number;
}

export const CausalityChain: React.FC<CausalityChainProps> = ({
  causalLinks,
  butterflyEffects,
  actions,
  width = 600,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(
    new Map()
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#050510');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (causalLinks.length === 0 && actions.length === 0) {
      // Draw empty state
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No causal relationships yet', width / 2, height / 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '12px monospace';
      ctx.fillText('Perform actions to see causality chains', width / 2, height / 2 + 25);
      return;
    }

    // Build node graph
    const nodes = new Map<string, { x: number; y: number; action: PlayerAction | null }>();
    const actionMap = new Map(actions.map(a => [a.id, a]));

    // Position nodes in a force-directed layout (simplified)
    const allNodeIds = new Set<string>();
    causalLinks.forEach(link => {
      allNodeIds.add(link.causeActionId);
      allNodeIds.add(link.effectActionId);
    });

    // Simple circular layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    let angle = 0;
    const angleStep = (Math.PI * 2) / Math.max(allNodeIds.size, 1);

    allNodeIds.forEach(nodeId => {
      nodes.set(nodeId, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        action: actionMap.get(nodeId) || null,
      });
      angle += angleStep;
    });

    setNodePositions(nodes);

    // Draw causal links
    causalLinks.forEach(link => {
      const start = nodes.get(link.causeActionId);
      const end = nodes.get(link.effectActionId);

      if (!start || !end) return;

      // Draw link
      const linkColor = getLinkColor(link.type);
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = Math.max(1, link.strength * 4);

      if (link.type === 'retrocausal') {
        // Dotted line for retrocausal
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      // Draw arrow
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / distance;
      const ny = dy / distance;

      // Offset for node radius
      const nodeRadius = 8;
      const startX = start.x + nx * nodeRadius;
      const startY = start.y + ny * nodeRadius;
      const endX = end.x - nx * nodeRadius;
      const endY = end.y - ny * nodeRadius;

      // Bezier curve for visual appeal
      const controlX = (startX + endX) / 2 + (ny * 30);
      const controlY = (startY + endY) / 2 - (nx * 30);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();

      // Arrow head
      const arrowSize = 10;
      const angle = Math.atan2(endY - controlY, endX - controlX);
      ctx.fillStyle = linkColor;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle - Math.PI / 6),
        endY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle + Math.PI / 6),
        endY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Draw strength label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(`${(link.strength * 100).toFixed(0)}%`, controlX, controlY - 5);
    });

    ctx.setLineDash([]);

    // Draw butterfly effect highlights
    butterflyEffects.forEach((effect, idx) => {
      const originNode = nodes.get(effect.originAction);
      if (!originNode) return;

      // Pulse effect
      const pulseRadius = 15 + Math.sin(Date.now() / 200 + idx) * 5;
      const pulseGradient = ctx.createRadialGradient(
        originNode.x,
        originNode.y,
        0,
        originNode.x,
        originNode.y,
        pulseRadius
      );
      pulseGradient.addColorStop(0, 'rgba(255, 100, 255, 0.3)');
      pulseGradient.addColorStop(1, 'rgba(255, 100, 255, 0)');
      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(originNode.x, originNode.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach((node, nodeId) => {
      const isHovered = hoveredNode === nodeId;
      const nodeRadius = isHovered ? 10 : 8;

      // Node glow
      if (isHovered) {
        const glowGradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          nodeRadius * 3
        );
        glowGradient.addColorStop(0, 'rgba(100, 200, 255, 0.5)');
        glowGradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node circle
      const nodeGradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        nodeRadius
      );

      if (node.action) {
        const color = getActionNodeColor(node.action.type);
        nodeGradient.addColorStop(0, color);
        nodeGradient.addColorStop(1, darkenColor(color, 0.3));
      } else {
        nodeGradient.addColorStop(0, '#64b5f6');
        nodeGradient.addColorStop(1, '#1976d2');
      }

      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Node label
      if (isHovered && node.action) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(node.x - 40, node.y - 35, 80, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.action.type, node.x, node.y - 22);
      }
    });
  }, [causalLinks, butterflyEffects, actions, hoveredNode, width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let foundNode: string | null = null;
    nodePositions.forEach((pos, nodeId) => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < 10) {
        foundNode = nodeId;
      }
    });

    setHoveredNode(foundNode);
  };

  return (
    <div
      style={{
        padding: '15px',
        background: 'linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 100%)',
        borderRadius: '10px',
        border: '2px solid rgba(150, 100, 255, 0.3)',
        boxShadow: '0 0 20px rgba(150, 100, 255, 0.2)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '10px' }}>
        <h3
          style={{
            margin: 0,
            color: '#b794f6',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🔗</span>
          Causality Chain
        </h3>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '5px',
          }}
        >
          {causalLinks.length} causal links • {butterflyEffects.length} butterfly effects
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        style={{
          border: '1px solid rgba(150, 100, 255, 0.3)',
          borderRadius: '8px',
          cursor: 'crosshair',
        }}
      />

      {/* Legend */}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          gap: '15px',
          fontSize: '11px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            style={{
              width: '20px',
              height: '3px',
              background: '#4ade80',
            }}
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Direct</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            style={{
              width: '20px',
              height: '3px',
              background: '#fbbf24',
            }}
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Indirect</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            style={{
              width: '20px',
              height: '3px',
              background: '#ff6b6b',
              borderTop: '1px dashed #ff6b6b',
            }}
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Retrocausal</span>
        </div>
      </div>
    </div>
  );
};

const getLinkColor = (type: CausalLink['type']): string => {
  const colors = {
    direct: '#4ade80',
    indirect: '#fbbf24',
    retrocausal: '#ff6b6b',
  };
  return colors[type];
};

const getActionNodeColor = (type: string): string => {
  const colors: Record<string, string> = {
    move: '#64b5f6',
    collect: '#FFD700',
    interact: '#ff6bff',
    create: '#4ade80',
    destroy: '#ef4444',
  };
  return colors[type] || '#9ca3af';
};

const darkenColor = (color: string, factor: number): string => {
  // Simple darkening - multiply RGB values
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.floor(r * (1 - factor));
  const newG = Math.floor(g * (1 - factor));
  const newB = Math.floor(b * (1 - factor));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};
