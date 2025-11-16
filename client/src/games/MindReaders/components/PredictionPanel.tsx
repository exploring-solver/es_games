/**
 * Prediction Panel Component
 * Shows Bayesian probabilities and prediction interface
 */

import React from 'react';
import { BayesianProbability } from '../utils/probabilityEngine';

export interface PredictionPanelProps {
  predictions: BayesianProbability[];
  selectedPrediction?: string;
  onSelectPrediction?: (value: string) => void;
  disabled?: boolean;
  showConfidence?: boolean;
  showReasoning?: boolean;
  title?: string;
  playerName?: string;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  predictions,
  selectedPrediction,
  onSelectPrediction,
  disabled = false,
  showConfidence = true,
  showReasoning = false,
  title = 'Predictions',
  playerName = 'Opponent'
}) => {
  const [expandedReasoning, setExpandedReasoning] = React.useState<string | null>(null);

  const getConfidenceColor = (confidence: number): string => {
    if (confidence > 0.7) return '#4CAF50';
    if (confidence > 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const getProbabilityColor = (probability: number): string => {
    if (probability > 0.5) return '#6366f1';
    if (probability > 0.3) return '#8b5cf6';
    return '#64748b';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <h3 style={{
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#e0e0e0'
          }}>
            {title}
          </h3>
        </div>

        {showConfidence && predictions.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '6px 12px',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>Confidence:</span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: getConfidenceColor(predictions[0].confidence)
            }}>
              {(predictions[0].confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {predictions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#888',
          fontSize: '0.95rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
          <div>Not enough data for predictions yet.</div>
          <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Make a few moves to start seeing patterns!
          </div>
        </div>
      )}

      {/* Predictions List */}
      {predictions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {predictions.map((pred, index) => {
            const isSelected = selectedPrediction === pred.choice;
            const isExpanded = expandedReasoning === pred.choice;

            return (
              <div
                key={pred.choice}
                onClick={() => !disabled && onSelectPrediction && onSelectPrediction(pred.choice)}
                style={{
                  background: isSelected
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'rgba(42, 42, 62, 0.5)',
                  border: isSelected
                    ? '2px solid #6366f1'
                    : '2px solid rgba(99, 102, 241, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {/* Rank Badge */}
                {index === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '12px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                  }}>
                    TOP PICK
                  </div>
                )}

                <div style={{ position: 'relative', marginTop: index === 0 ? '8px' : '0' }}>
                  {/* Main Content */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    {/* Choice */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: getProbabilityColor(pred.probability),
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}>
                        {pred.choice}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#888',
                          marginBottom: '4px'
                        }}>
                          Predicted Choice #{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Probability */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: getProbabilityColor(pred.probability)
                      }}>
                        {(pred.probability * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        probability
                      </div>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div style={{
                        fontSize: '1.5rem',
                        color: '#6366f1'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Probability Bar */}
                  <div style={{
                    marginTop: '12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: `linear-gradient(90deg, ${getProbabilityColor(pred.probability)} 0%, ${getProbabilityColor(pred.probability)}88 100%)`,
                      height: '100%',
                      width: `${pred.probability * 100}%`,
                      transition: 'width 0.5s ease',
                      boxShadow: `0 0 8px ${getProbabilityColor(pred.probability)}66`
                    }} />
                  </div>

                  {/* Reasoning Toggle */}
                  {showReasoning && pred.reasoning.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedReasoning(isExpanded ? null : pred.choice);
                        }}
                        style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#6366f1',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{isExpanded ? '▼' : '▶'}</span>
                        <span>Show Reasoning</span>
                      </button>

                      {isExpanded && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '8px',
                          borderLeft: '3px solid #6366f1'
                        }}>
                          {pred.reasoning.map((reason, i) => (
                            <div
                              key={i}
                              style={{
                                fontSize: '0.85rem',
                                color: '#aaa',
                                marginBottom: i < pred.reasoning.length - 1 ? '8px' : '0',
                                paddingLeft: '8px'
                              }}
                            >
                              • {reason}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helper Text */}
      {predictions.length > 0 && !disabled && onSelectPrediction && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#888',
          textAlign: 'center'
        }}>
          💡 Click on a prediction to select what you think {playerName} will choose
        </div>
      )}
    </div>
  );
};
