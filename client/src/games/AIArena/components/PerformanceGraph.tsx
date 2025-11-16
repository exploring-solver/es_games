import React, { useEffect, useRef } from 'react';
import { EpisodeResult } from '../utils/mlEngine';

interface PerformanceGraphProps {
  episodes: EpisodeResult[];
  targetAccuracy: number;
  width?: number;
  height?: number;
  showLegend?: boolean;
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({
  episodes,
  targetAccuracy,
  width = 600,
  height = 300,
  showLegend = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || episodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (graphHeight * i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        ((1 - i / 5) * 100).toFixed(0) + '%',
        padding - 5,
        y
      );
    }

    // Vertical grid lines
    const maxEpisodes = Math.max(...episodes.map(e => e.episodeNumber));
    const verticalLines = Math.min(10, maxEpisodes);

    for (let i = 0; i <= verticalLines; i++) {
      const x = padding + (graphWidth * i / verticalLines);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // X-axis labels
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(
          Math.floor(maxEpisodes * i / verticalLines).toString(),
          x,
          height - padding + 5
        );
      }
    }

    // Draw target line
    const targetY = padding + graphHeight * (1 - targetAccuracy);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, targetY);
    ctx.lineTo(width - padding, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Target label
    ctx.fillStyle = 'rgba(251, 191, 36, 1)';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Target', width - padding + 5, targetY);

    // Draw accuracy line
    if (episodes.length > 1) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      episodes.forEach((episode, index) => {
        const x = padding + (graphWidth * episode.episodeNumber / maxEpisodes);
        const y = padding + graphHeight * (1 - episode.accuracy);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      episodes.forEach(episode => {
        const x = padding + (graphWidth * episode.episodeNumber / maxEpisodes);
        const y = padding + graphHeight * (1 - episode.accuracy);

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 1)';
        ctx.fill();
      });
    }

    // Draw loss line
    if (episodes.length > 1) {
      const maxLoss = Math.max(...episodes.map(e => e.loss), 1);

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      episodes.forEach((episode, index) => {
        const x = padding + (graphWidth * episode.episodeNumber / maxEpisodes);
        const normalizedLoss = Math.min(episode.loss / maxLoss, 1);
        const y = padding + graphHeight * normalizedLoss;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Arial';

    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Accuracy / Loss', 0, 0);
    ctx.restore();

    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Episode', width / 2, height - 10);

  }, [episodes, targetAccuracy, width, height]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.3)'
        }}
      />

      {showLegend && (
        <div style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '3px',
              background: 'rgb(16, 185, 129)'
            }} />
            <span>Accuracy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '3px',
              background: 'rgb(239, 68, 68)'
            }} />
            <span>Loss</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '3px',
              background: 'rgb(251, 191, 36)',
              borderTop: '2px dashed rgb(251, 191, 36)'
            }} />
            <span>Target</span>
          </div>
        </div>
      )}

      {/* Current Stats */}
      {episodes.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '11px'
        }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Latest Episode:</strong> {episodes[episodes.length - 1].episodeNumber}
          </div>
          <div style={{ marginBottom: '5px', color: '#10B981' }}>
            <strong>Accuracy:</strong> {(episodes[episodes.length - 1].accuracy * 100).toFixed(1)}%
          </div>
          <div style={{ marginBottom: '5px', color: '#EF4444' }}>
            <strong>Loss:</strong> {episodes[episodes.length - 1].loss.toFixed(4)}
          </div>
          <div style={{ color: '#F59E0B' }}>
            <strong>Reward:</strong> {episodes[episodes.length - 1].reward.toFixed(0)}
          </div>
        </div>
      )}
    </div>
  );
};
