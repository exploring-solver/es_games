import React, { useEffect, useRef } from 'react';
import { NetworkVisualization, VisualNeuron, VisualConnection } from '../hooks/useTraining';

interface TrainingVisualizerProps {
  visualization: NetworkVisualization;
  animatedNeurons: Set<string>;
  animatedConnections: Set<string>;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export const TrainingVisualizer: React.FC<TrainingVisualizerProps> = ({
  visualization,
  animatedNeurons,
  animatedConnections,
  width = 800,
  height = 500,
  showLabels = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections first (behind neurons)
    visualization.connections.forEach(conn => {
      const fromNeuron = visualization.neurons.find(n => n.id === conn.fromNeuronId);
      const toNeuron = visualization.neurons.find(n => n.id === conn.toNeuronId);

      if (!fromNeuron || !toNeuron) return;

      const isAnimated = animatedConnections.has(conn.id);
      const weight = conn.weight;
      const opacity = Math.min(Math.abs(weight) * 2, 1);

      ctx.beginPath();
      ctx.moveTo(fromNeuron.x, fromNeuron.y);
      ctx.lineTo(toNeuron.x, toNeuron.y);

      // Color based on weight (positive = green, negative = red)
      const color = weight > 0 ? '16, 185, 129' : '239, 68, 68';
      ctx.strokeStyle = isAnimated
        ? `rgba(${color}, ${opacity})`
        : `rgba(${color}, ${opacity * 0.3})`;

      ctx.lineWidth = isAnimated ? 3 : Math.abs(weight) * 2 + 0.5;
      ctx.stroke();

      // Draw animated signal flow
      if (isAnimated) {
        const dx = toNeuron.x - fromNeuron.x;
        const dy = toNeuron.y - fromNeuron.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const progress = (Date.now() % 1000) / 1000;

        const signalX = fromNeuron.x + (dx * progress);
        const signalY = fromNeuron.y + (dy * progress);

        ctx.beginPath();
        ctx.arc(signalX, signalY, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 1)`;
        ctx.fill();
      }
    });

    // Draw neurons
    visualization.neurons.forEach(neuron => {
      const isAnimated = animatedNeurons.has(neuron.id);
      const activation = neuron.activation;

      // Neuron circle
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);

      // Color based on layer type
      let baseColor = '139, 92, 246'; // Purple for hidden
      if (neuron.layerId === 'input') baseColor = '59, 130, 246'; // Blue
      if (neuron.layerId.includes('output')) baseColor = '239, 68, 68'; // Red

      const intensity = Math.abs(activation);
      ctx.fillStyle = isAnimated
        ? `rgba(${baseColor}, ${Math.min(intensity * 2, 1)})`
        : `rgba(${baseColor}, ${Math.min(intensity, 0.8)})`;

      ctx.fill();

      // Border
      ctx.strokeStyle = isAnimated
        ? `rgba(255, 255, 255, 1)`
        : `rgba(255, 255, 255, 0.5)`;
      ctx.lineWidth = isAnimated ? 3 : 1.5;
      ctx.stroke();

      // Activation value text
      if (showLabels && intensity > 0.1) {
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activation.toFixed(2), neuron.x, neuron.y);
      }

      // Pulse effect for active neurons
      if (isAnimated) {
        const pulseRadius = neuron.radius + 10;
        const pulseOpacity = 0.5 * (1 - ((Date.now() % 500) / 500));

        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${baseColor}, ${pulseOpacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw layer labels
    if (showLabels) {
      visualization.layers.forEach((layer, idx) => {
        if (layer.neurons.length === 0) return;

        const firstNeuron = layer.neurons[0];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          layer.id.toUpperCase(),
          firstNeuron.x,
          20
        );
      });
    }
  }, [visualization, animatedNeurons, animatedConnections, width, height, showLabels]);

  return (
    <div style={{
      position: 'relative',
      width,
      height,
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%'
        }}
      />

      {/* Legend */}
      {showLabels && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '10px'
        }}>
          <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgb(59, 130, 246)'
            }} />
            <span>Input</span>
          </div>
          <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgb(139, 92, 246)'
            }} />
            <span>Hidden</span>
          </div>
          <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgb(239, 68, 68)'
            }} />
            <span>Output</span>
          </div>
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '20px',
                height: '2px',
                background: 'rgb(16, 185, 129)'
              }} />
              <span>+ Weight</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '20px',
                height: '2px',
                background: 'rgb(239, 68, 68)'
              }} />
              <span>- Weight</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
