import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { PhysicsObject } from '../data/puzzles';

interface PuzzleCanvasProps {
  width: number;
  height: number;
  bodies: Matter.Body[];
  selectedObject?: PhysicsObject | null;
  onCanvasClick?: (x: number, y: number) => void;
  showGrid?: boolean;
  showVelocity?: boolean;
}

export const PuzzleCanvas: React.FC<PuzzleCanvasProps> = ({
  width,
  height,
  bodies,
  selectedObject,
  onCanvasClick,
  showGrid = true,
  showVelocity = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Handle mouse move
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleClick = (e: MouseEvent) => {
      if (onCanvasClick) {
        const rect = canvas.getBoundingClientRect();
        onCanvasClick(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [onCanvasClick]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
      bgGradient.addColorStop(0, '#1a1a2e');
      bgGradient.addColorStop(1, '#0f0f1a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Render bodies
      bodies.forEach((body) => {
        const color = (body as any).renderColor || '#ffffff';
        const objectType = (body as any).objectType;
        const isSensor = body.isSensor;

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        // Draw based on shape
        if (body.circleRadius) {
          // Circle
          const radius = body.circleRadius;

          // Glow for sensors
          if (isSensor) {
            const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.5);
            glow.addColorStop(0, `${color}40`);
            glow.addColorStop(1, `${color}00`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Main circle
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();

          // Outline
          ctx.strokeStyle = isSensor ? `${color}80` : '#ffffff40';
          ctx.lineWidth = isSensor ? 2 : 1;
          ctx.stroke();

          // Direction indicator
          if (!body.isStatic && showVelocity) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius, 0);
            ctx.stroke();
          }
        } else {
          // Rectangle
          const bounds = body.bounds;
          const w = bounds.max.x - bounds.min.x;
          const h = bounds.max.y - bounds.min.y;

          // Glow for sensors
          if (isSensor) {
            ctx.fillStyle = `${color}20`;
            ctx.fillRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);
          }

          // Main rectangle
          ctx.fillStyle = color;
          ctx.fillRect(-w / 2, -h / 2, w, h);

          // Outline
          ctx.strokeStyle = isSensor ? `${color}80` : '#ffffff40';
          ctx.lineWidth = isSensor ? 2 : 1;
          ctx.strokeRect(-w / 2, -h / 2, w, h);

          // Texture for different types
          if (objectType === 'ramp') {
            ctx.strokeStyle = '#ffffff20';
            ctx.lineWidth = 1;
            for (let i = -w / 2; i < w / 2; i += 10) {
              ctx.beginPath();
              ctx.moveTo(i, -h / 2);
              ctx.lineTo(i + h, h / 2);
              ctx.stroke();
            }
          }
        }

        ctx.restore();

        // Velocity vector
        if (showVelocity && !body.isStatic) {
          const vel = body.velocity;
          const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
          if (speed > 0.1) {
            const scale = 5;
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(body.position.x, body.position.y);
            ctx.lineTo(body.position.x + vel.x * scale, body.position.y + vel.y * scale);
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(vel.y, vel.x);
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.moveTo(
              body.position.x + vel.x * scale,
              body.position.y + vel.y * scale
            );
            ctx.lineTo(
              body.position.x + vel.x * scale - 8 * Math.cos(angle - Math.PI / 6),
              body.position.y + vel.y * scale - 8 * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              body.position.x + vel.x * scale - 8 * Math.cos(angle + Math.PI / 6),
              body.position.y + vel.y * scale - 8 * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
          }
        }
      });

      // Draw selected object preview
      if (selectedObject && mousePos.current) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.translate(mousePos.current.x, mousePos.current.y);

        if (selectedObject.type === 'ball') {
          const radius = selectedObject.radius || 15;
          ctx.fillStyle = selectedObject.color;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          const w = selectedObject.width || 100;
          const h = selectedObject.height || 15;
          ctx.fillStyle = selectedObject.color;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
        }

        ctx.restore();
      }
    };

    const animationId = requestAnimationFrame(function animate() {
      render();
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [width, height, bodies, selectedObject, showGrid, showVelocity]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '2px solid rgba(100, 200, 255, 0.5)',
        borderRadius: '10px',
        cursor: selectedObject ? 'crosshair' : 'default',
      }}
    />
  );
};
