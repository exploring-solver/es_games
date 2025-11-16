/**
 * Thought Display Component
 * Shows current thought/choice with psychological visualization
 */

import React from 'react';

export type ThoughtCategory = 'numbers' | 'colors' | 'symbols' | 'words';

export interface ThoughtOption {
  value: string;
  display: string | React.ReactNode;
  category: ThoughtCategory;
}

export interface ThoughtDisplayProps {
  category: ThoughtCategory;
  options: ThoughtOption[];
  selectedValue?: string;
  predictedValue?: string;
  showPrediction?: boolean;
  isRevealing?: boolean;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  highlightCorrect?: boolean;
  correctValue?: string;
}

export const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({
  category,
  options,
  selectedValue,
  predictedValue,
  showPrediction = false,
  isRevealing = false,
  onSelect,
  disabled = false,
  highlightCorrect = false,
  correctValue
}) => {
  const getCategoryIcon = (cat: ThoughtCategory): string => {
    switch (cat) {
      case 'numbers': return '🔢';
      case 'colors': return '🎨';
      case 'symbols': return '✨';
      case 'words': return '💭';
      default: return '🧠';
    }
  };

  const getOptionStyle = (option: ThoughtOption): React.CSSProperties => {
    const isSelected = selectedValue === option.value;
    const isPredicted = predictedValue === option.value && showPrediction;
    const isCorrect = highlightCorrect && correctValue === option.value;

    let background = '#2a2a3e';
    let border = '2px solid #3a3a4e';
    let transform = 'scale(1)';
    let boxShadow = 'none';

    if (isCorrect) {
      background = '#2d5016';
      border = '2px solid #4CAF50';
      boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
    } else if (isSelected) {
      background = '#3a3a5e';
      border = '2px solid #6366f1';
      transform = 'scale(1.05)';
      boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
    } else if (isPredicted) {
      background = '#4a2a3e';
      border = '2px solid #f59e0b';
      boxShadow = '0 0 15px rgba(245, 158, 11, 0.3)';
    }

    return {
      background,
      border,
      transform,
      boxShadow,
      transition: 'all 0.3s ease',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    };
  };

  const renderOption = (option: ThoughtOption) => {
    if (category === 'colors') {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          background: option.value,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          {option.display}
        </div>
      );
    }

    if (category === 'symbols') {
      return (
        <div style={{ fontSize: '2rem' }}>
          {option.display}
        </div>
      );
    }

    return <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{option.display}</div>;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      position: 'relative'
    }}>
      {/* Category Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(category)}</span>
        <h3 style={{
          margin: 0,
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#e0e0e0',
          textTransform: 'capitalize'
        }}>
          {category}
        </h3>
        {isRevealing && (
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: '#6366f1',
            fontWeight: '600',
            animation: 'pulse 2s infinite'
          }}>
            Revealing...
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(options.length, 5)}, 1fr)`,
        gap: '12px',
        marginTop: '16px'
      }}>
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => !disabled && onSelect && onSelect(option.value)}
            style={{
              ...getOptionStyle(option),
              padding: '20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80px',
              position: 'relative'
            }}
          >
            {renderOption(option)}

            {/* Prediction Badge */}
            {predictedValue === option.value && showPrediction && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#f59e0b',
                color: '#000',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
              }}>
                PREDICTED
              </div>
            )}

            {/* Selection Checkmark */}
            {selectedValue === option.value && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                color: '#6366f1',
                fontSize: '1.2rem'
              }}>
                ✓
              </div>
            )}

            {/* Correct Badge */}
            {highlightCorrect && correctValue === option.value && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#4CAF50',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                whiteSpace: 'nowrap'
              }}>
                ✓ CORRECT
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hint Text */}
      {!disabled && onSelect && (
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#888',
          fontStyle: 'italic'
        }}>
          Click to select your {showPrediction ? 'choice' : 'prediction'}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

/**
 * Generate thought options for different categories
 */
export function generateThoughtOptions(category: ThoughtCategory): ThoughtOption[] {
  switch (category) {
    case 'numbers':
      return Array.from({ length: 10 }, (_, i) => ({
        value: String(i),
        display: String(i),
        category
      }));

    case 'colors':
      return [
        { value: '#ef4444', display: 'Red', category },
        { value: '#f59e0b', display: 'Orange', category },
        { value: '#eab308', display: 'Yellow', category },
        { value: '#22c55e', display: 'Green', category },
        { value: '#3b82f6', display: 'Blue', category },
        { value: '#8b5cf6', display: 'Purple', category },
        { value: '#ec4899', display: 'Pink', category },
        { value: '#6366f1', display: 'Indigo', category }
      ];

    case 'symbols':
      return [
        { value: 'star', display: '⭐', category },
        { value: 'heart', display: '❤️', category },
        { value: 'moon', display: '🌙', category },
        { value: 'sun', display: '☀️', category },
        { value: 'lightning', display: '⚡', category },
        { value: 'diamond', display: '💎', category },
        { value: 'fire', display: '🔥', category },
        { value: 'water', display: '💧', category }
      ];

    case 'words':
      return [
        { value: 'power', display: 'POWER', category },
        { value: 'wisdom', display: 'WISDOM', category },
        { value: 'courage', display: 'COURAGE', category },
        { value: 'peace', display: 'PEACE', category },
        { value: 'chaos', display: 'CHAOS', category },
        { value: 'harmony', display: 'HARMONY', category },
        { value: 'freedom', display: 'FREEDOM', category },
        { value: 'destiny', display: 'DESTINY', category }
      ];

    default:
      return [];
  }
}
