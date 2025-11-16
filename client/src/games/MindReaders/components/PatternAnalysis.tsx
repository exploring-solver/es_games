/**
 * Pattern Analysis Component
 * Visual display of detected patterns and meta-game insights
 */

import React from 'react';
import { PatternStrength } from '../utils/probabilityEngine';

export interface MetaGameStats {
  yourPredictability: number;
  opponentPredictability: number;
  metaLevel: number;
}

export interface PatternAnalysisProps {
  patterns: PatternStrength[];
  entropy: number;
  metaStats?: MetaGameStats;
  recommendation?: string;
  showDetails?: boolean;
  playerName?: string;
}

export const PatternAnalysis: React.FC<PatternAnalysisProps> = ({
  patterns,
  entropy,
  metaStats,
  recommendation,
  showDetails = true,
  playerName = 'Opponent'
}) => {
  const [expandedPattern, setExpandedPattern] = React.useState<string | null>(null);

  const getPatternIcon = (type: PatternStrength['type']): string => {
    switch (type) {
      case 'sequential': return '📊';
      case 'alternating': return '🔄';
      case 'repetitive': return '🔁';
      case 'random': return '🎲';
      case 'counter-predictive': return '🎭';
      default: return '❓';
    }
  };

  const getPatternColor = (strength: number): string => {
    if (strength > 0.7) return '#4CAF50';
    if (strength > 0.5) return '#f59e0b';
    if (strength > 0.3) return '#3b82f6';
    return '#64748b';
  };

  const getEntropyLevel = (ent: number): { label: string; color: string; description: string } => {
    if (ent > 2.5) return {
      label: 'Very High',
      color: '#ef4444',
      description: 'Highly unpredictable - true randomness'
    };
    if (ent > 2.0) return {
      label: 'High',
      color: '#f59e0b',
      description: 'Unpredictable with some patterns'
    };
    if (ent > 1.5) return {
      label: 'Moderate',
      color: '#3b82f6',
      description: 'Balanced mix of patterns and randomness'
    };
    if (ent > 1.0) return {
      label: 'Low',
      color: '#8b5cf6',
      description: 'Some predictable patterns emerging'
    };
    return {
      label: 'Very Low',
      color: '#4CAF50',
      description: 'Highly predictable - strong patterns'
    };
  };

  const entropyLevel = getEntropyLevel(entropy);

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
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🧠</span>
        <h3 style={{
          margin: 0,
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#e0e0e0'
        }}>
          Pattern Analysis
        </h3>
      </div>

      {/* Entropy Indicator */}
      <div style={{
        background: 'rgba(42, 42, 62, 0.5)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        border: `2px solid ${entropyLevel.color}33`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span>
            <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Randomness Level</span>
          </div>
          <div style={{
            background: `${entropyLevel.color}22`,
            color: entropyLevel.color,
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}>
            {entropyLevel.label}
          </div>
        </div>

        {/* Entropy Bar */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          height: '8px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            background: `linear-gradient(90deg, ${entropyLevel.color} 0%, ${entropyLevel.color}88 100%)`,
            height: '100%',
            width: `${Math.min((entropy / 3) * 100, 100)}%`,
            transition: 'width 0.5s ease',
            boxShadow: `0 0 8px ${entropyLevel.color}66`
          }} />
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: '#888',
          fontStyle: 'italic'
        }}>
          {entropyLevel.description}
        </div>
      </div>

      {/* Detected Patterns */}
      {patterns.length > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#aaa',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            Detected Patterns ({patterns.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {patterns.map((pattern, index) => {
              const isExpanded = expandedPattern === pattern.type;

              return (
                <div
                  key={pattern.type}
                  style={{
                    background: 'rgba(42, 42, 62, 0.5)',
                    borderRadius: '10px',
                    padding: '14px',
                    border: `2px solid ${getPatternColor(pattern.strength)}33`,
                    cursor: pattern.examples.length > 0 ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (pattern.examples.length > 0) {
                      setExpandedPattern(isExpanded ? null : pattern.type);
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {/* Pattern Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span style={{ fontSize: '1.3rem' }}>{getPatternIcon(pattern.type)}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#e0e0e0',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          marginBottom: '4px'
                        }}>
                          {pattern.type.replace('-', ' ')}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#888'
                        }}>
                          Strength: {(pattern.strength * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Strength Bar */}
                    <div style={{ width: '100px', marginRight: '12px' }}>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '4px',
                        height: '6px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: getPatternColor(pattern.strength),
                          height: '100%',
                          width: `${pattern.strength * 100}%`,
                          transition: 'width 0.5s ease',
                          boxShadow: `0 0 6px ${getPatternColor(pattern.strength)}66`
                        }} />
                      </div>
                    </div>

                    {/* Expand Arrow */}
                    {pattern.examples.length > 0 && (
                      <div style={{
                        color: '#666',
                        fontSize: '0.8rem',
                        transition: 'transform 0.2s ease',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                      }}>
                        ▶
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  {isExpanded && pattern.examples.length > 0 && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#888',
                        marginBottom: '8px'
                      }}>
                        Examples:
                      </div>
                      {pattern.examples.map((example, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: '0.8rem',
                            color: '#aaa',
                            padding: '6px 10px',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '6px',
                            marginBottom: i < pattern.examples.length - 1 ? '6px' : '0',
                            fontFamily: 'monospace'
                          }}
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
          <div>No significant patterns detected yet.</div>
          <div style={{ fontSize: '0.8rem', marginTop: '6px' }}>
            Keep playing to gather more data!
          </div>
        </div>
      )}

      {/* Meta-Game Stats */}
      {metaStats && (
        <div style={{
          background: 'rgba(42, 42, 62, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '2px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#aaa',
            marginBottom: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🎭</span>
            Meta-Game Analysis
          </div>

          {/* Predictability Comparison */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#888',
              marginBottom: '6px'
            }}>
              <span>Your Predictability</span>
              <span>{(metaStats.yourPredictability * 100).toFixed(0)}%</span>
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                height: '100%',
                width: `${metaStats.yourPredictability * 100}%`,
                transition: 'width 0.5s ease',
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
              }} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#888',
              marginBottom: '6px'
            }}>
              <span>{playerName}'s Predictability</span>
              <span>{(metaStats.opponentPredictability * 100).toFixed(0)}%</span>
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
                height: '100%',
                width: `${metaStats.opponentPredictability * 100}%`,
                transition: 'width 0.5s ease',
                boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)'
              }} />
            </div>
          </div>

          {/* Meta Level */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#888',
              marginBottom: '6px'
            }}>
              <span>Counter-Bluff Level</span>
              <span>{(metaStats.metaLevel * 100).toFixed(0)}%</span>
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                height: '100%',
                width: `${metaStats.metaLevel * 100}%`,
                transition: 'width 0.5s ease',
                boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          borderLeft: '4px solid #6366f1',
          borderRadius: '8px',
          padding: '14px',
          fontSize: '0.9rem',
          color: '#e0e0e0'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#6366f1',
            marginBottom: '6px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Recommendation
          </div>
          {recommendation}
        </div>
      )}
    </div>
  );
};
