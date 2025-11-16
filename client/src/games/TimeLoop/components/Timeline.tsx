import React, { useRef, useEffect } from 'react';
import { RecordedLoop, PlayerAction } from '../utils/timeEngine';
import { TimeEvent } from '../data/timeEvents';

interface TimelineProps {
  currentTime: number;
  maxTime: number;
  recordedLoops: RecordedLoop[];
  activeEvents: TimeEvent[];
  onSeek?: (time: number) => void;
  currentLoop: number;
  width?: number;
  height?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  maxTime,
  recordedLoops,
  activeEvents,
  onSeek,
  currentLoop,
  width = 800,
  height = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#1a0a2e');
    gradient.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw time axis
    const timelineY = height - 40;
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, timelineY);
    ctx.lineTo(width - 20, timelineY);
    ctx.stroke();

    // Draw time markers
    ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
    ctx.font = '10px monospace';
    for (let i = 0; i <= 10; i++) {
      const x = 20 + ((width - 40) / 10) * i;
      const time = Math.round((maxTime / 10) * i);

      ctx.beginPath();
      ctx.moveTo(x, timelineY - 5);
      ctx.lineTo(x, timelineY + 5);
      ctx.stroke();

      ctx.fillText(`${time}s`, x - 10, timelineY + 20);
    }

    // Draw recorded loops as layers
    recordedLoops.forEach((loop, index) => {
      const y = 20 + index * 15;
      const opacity = 1 - (currentLoop - loop.loopNumber) * 0.2;

      if (opacity > 0) {
        // Draw loop timeline
        ctx.strokeStyle = `rgba(100, 255, 200, ${Math.max(0.2, opacity)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, y);
        const endX = 20 + ((width - 40) * loop.endTime) / maxTime;
        ctx.lineTo(endX, y);
        ctx.stroke();

        // Draw action markers
        loop.actions.forEach(action => {
          const actionX = 20 + ((width - 40) * action.timestamp) / maxTime;
          const actionColor = getActionColor(action.type);

          ctx.fillStyle = actionColor;
          ctx.beginPath();
          ctx.arc(actionX, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Loop label
        ctx.fillStyle = `rgba(200, 200, 255, ${Math.max(0.3, opacity)})`;
        ctx.font = '9px monospace';
        ctx.fillText(`Loop ${loop.loopNumber}`, width - 70, y + 3);
      }
    });

    // Draw events
    activeEvents.forEach(event => {
      const eventX = 20 + ((width - 40) * event.timestamp) / maxTime;
      const eventEndX = 20 + ((width - 40) * (event.timestamp + event.duration)) / maxTime;

      // Event region
      const eventGradient = ctx.createLinearGradient(eventX, 0, eventEndX, 0);
      eventGradient.addColorStop(0, `${event.visualEffect.color}20`);
      eventGradient.addColorStop(0.5, `${event.visualEffect.color}40`);
      eventGradient.addColorStop(1, `${event.visualEffect.color}20`);

      ctx.fillStyle = eventGradient;
      ctx.fillRect(eventX, 0, eventEndX - eventX, timelineY - 10);

      // Event marker
      ctx.strokeStyle = event.visualEffect.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(eventX, 0);
      ctx.lineTo(eventX, timelineY - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // Event name
      ctx.fillStyle = event.visualEffect.color;
      ctx.font = '8px monospace';
      ctx.save();
      ctx.translate(eventX + 5, 15);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(event.name, 0, 0);
      ctx.restore();
    });

    // Draw current time indicator
    const currentX = 20 + ((width - 40) * currentTime) / maxTime;

    // Glow effect
    const glowGradient = ctx.createRadialGradient(currentX, timelineY, 0, currentX, timelineY, 30);
    glowGradient.addColorStop(0, 'rgba(255, 100, 100, 0.5)');
    glowGradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(currentX - 30, 0, 60, height);

    // Current time line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, timelineY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current time marker
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(currentX, timelineY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Current time text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`${currentTime.toFixed(1)}s`, currentX - 20, timelineY - 15);

    // Draw progress bar
    ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.fillRect(20, timelineY - 5, ((width - 40) * currentTime) / maxTime, 10);

  }, [currentTime, maxTime, recordedLoops, activeEvents, currentLoop, width, height]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const clickTime = ((x - 20) / (width - 40)) * maxTime;
    onSeek(Math.max(0, Math.min(maxTime, clickTime)));
  };

  return (
    <div style={{ padding: '10px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        style={{
          cursor: onSeek ? 'pointer' : 'default',
          border: '1px solid rgba(100, 200, 255, 0.3)',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

const getActionColor = (type: string): string => {
  const colors: Record<string, string> = {
    move: 'rgba(100, 200, 255, 0.8)',
    collect: 'rgba(255, 215, 0, 0.8)',
    interact: 'rgba(255, 100, 255, 0.8)',
    create: 'rgba(100, 255, 100, 0.8)',
    destroy: 'rgba(255, 100, 100, 0.8)',
  };

  return colors[type] || 'rgba(200, 200, 200, 0.8)';
};
