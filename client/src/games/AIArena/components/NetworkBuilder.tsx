import React from 'react';
import { NetworkArchitecture, LayerConfig, ActivationFunction, activationFunctions } from '../data/architectures';

interface NetworkBuilderProps {
  architecture: NetworkArchitecture | null;
  onArchitectureChange: (arch: NetworkArchitecture) => void;
  readonly?: boolean;
}

export const NetworkBuilder: React.FC<NetworkBuilderProps> = ({
  architecture,
  onArchitectureChange,
  readonly = false
}) => {
  if (!architecture) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        No architecture selected
      </div>
    );
  }

  const handleAddLayer = () => {
    if (readonly) return;

    const newLayer: LayerConfig = {
      id: `hidden${architecture.layers.length - 1}`,
      type: 'hidden',
      neurons: 8,
      activation: 'relu'
    };

    const layers = [...architecture.layers];
    layers.splice(layers.length - 1, 0, newLayer);

    onArchitectureChange({ ...architecture, layers });
  };

  const handleRemoveLayer = (index: number) => {
    if (readonly || architecture.layers.length <= 3) return;

    const layers = architecture.layers.filter((_, i) => i !== index);
    onArchitectureChange({ ...architecture, layers });
  };

  const handleUpdateLayer = (index: number, updates: Partial<LayerConfig>) => {
    if (readonly) return;

    const layers = architecture.layers.map((layer, i) =>
      i === index ? { ...layer, ...updates } : layer
    );

    onArchitectureChange({ ...architecture, layers });
  };

  const handleLearningRateChange = (rate: number) => {
    if (readonly) return;
    onArchitectureChange({ ...architecture, learningRate: rate });
  };

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      border: `1px solid ${architecture.color}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: architecture.color }}>
          {architecture.name}
        </h3>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'right'
        }}>
          <div>Complexity: {architecture.complexity}</div>
          <div>Best for: {architecture.bestFor.join(', ')}</div>
        </div>
      </div>

      {/* Learning Rate Control */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          marginBottom: '5px',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          Learning Rate: {architecture.learningRate.toFixed(4)}
        </label>
        <input
          type="range"
          min="0.0001"
          max="0.1"
          step="0.0001"
          value={architecture.learningRate}
          onChange={(e) => handleLearningRateChange(parseFloat(e.target.value))}
          disabled={readonly}
          style={{
            width: '100%',
            accentColor: architecture.color
          }}
        />
      </div>

      {/* Layers */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px' }}>
          Layers ({architecture.layers.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {architecture.layers.map((layer, index) => (
            <div
              key={layer.id}
              style={{
                padding: '12px',
                background: layer.type === 'input' ? 'rgba(59, 130, 246, 0.1)' :
                           layer.type === 'output' ? 'rgba(239, 68, 68, 0.1)' :
                           'rgba(139, 92, 246, 0.1)',
                borderRadius: '5px',
                border: `1px solid ${
                  layer.type === 'input' ? '#3B82F6' :
                  layer.type === 'output' ? '#EF4444' :
                  '#8B5CF6'
                }`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {layer.type} Layer
                </div>
                {layer.type === 'hidden' && !readonly && (
                  <button
                    onClick={() => handleRemoveLayer(index)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.5)',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', display: 'block', marginBottom: '3px' }}>
                    Neurons: {layer.neurons}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="64"
                    value={layer.neurons}
                    onChange={(e) => handleUpdateLayer(index, { neurons: parseInt(e.target.value) })}
                    disabled={readonly || layer.type !== 'hidden'}
                    style={{
                      width: '100%',
                      accentColor: architecture.color
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', display: 'block', marginBottom: '3px' }}>
                    Activation
                  </label>
                  <select
                    value={layer.activation}
                    onChange={(e) => handleUpdateLayer(index, { activation: e.target.value as ActivationFunction })}
                    disabled={readonly || layer.type === 'input'}
                    style={{
                      width: '100%',
                      padding: '4px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '3px',
                      color: 'white',
                      fontSize: '10px'
                    }}
                  >
                    {Object.entries(activationFunctions).map(([key, data]) => (
                      <option key={key} value={key}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '5px'
              }}>
                {activationFunctions[layer.activation].formula}
              </div>
            </div>
          ))}
        </div>

        {!readonly && (
          <button
            onClick={handleAddLayer}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '10px',
              background: 'rgba(139, 92, 246, 0.3)',
              border: '1px dashed #8B5CF6',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            + Add Hidden Layer
          </button>
        )}
      </div>

      {/* Architecture Stats */}
      <div style={{
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '5px',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Total Layers:</span>
          <span style={{ color: architecture.color }}>{architecture.layers.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Hidden Layers:</span>
          <span style={{ color: architecture.color }}>
            {architecture.layers.filter(l => l.type === 'hidden').length}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Neurons:</span>
          <span style={{ color: architecture.color }}>
            {architecture.layers.reduce((sum, l) => sum + l.neurons, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
