import React, { useEffect, useState } from 'react';
import { Compound } from '../data/compounds';

interface ReactionDisplayProps {
  targetCompound: Compound | null;
  currentFormula: string;
  currentMolarMass: number;
  isCorrect: boolean | null;
  onSubmit: () => void;
  hints: string[];
  onUseHint: () => void;
  canUseHint: boolean;
}

export const ReactionDisplay: React.FC<ReactionDisplayProps> = ({
  targetCompound,
  currentFormula,
  currentMolarMass,
  isCorrect,
  onSubmit,
  hints,
  onUseHint,
  canUseHint,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'exothermic' | 'endothermic' | null>(null);

  useEffect(() => {
    if (isCorrect !== null) {
      setShowAnimation(true);
      if (targetCompound?.reactionType) {
        setAnimationType(targetCompound.reactionType === 'exothermic' ? 'exothermic' : 'endothermic');
      }

      const timer = setTimeout(() => {
        setShowAnimation(false);
        setAnimationType(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isCorrect, targetCompound]);

  if (!targetCompound) {
    return (
      <div style={{
        padding: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        color: '#999',
        textAlign: 'center',
      }}>
        No target compound set
      </div>
    );
  }

  return (
    <div style={{
      padding: 20,
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      color: '#fff',
    }}>
      {/* Target compound info */}
      <div style={{
        padding: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 15,
        border: '2px solid #4ECDC4',
      }}>
        <h3 style={{ margin: 0, marginBottom: 10, color: '#4ECDC4' }}>
          Target Compound
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          fontSize: 14,
        }}>
          <div>
            <strong>Name:</strong> {targetCompound.name}
          </div>
          <div>
            <strong>Formula:</strong> <span style={{ color: '#FFD700', fontSize: 16 }}>{targetCompound.formula}</span>
          </div>
          <div>
            <strong>Molar Mass:</strong> {targetCompound.molarMass.toFixed(3)} g/mol
          </div>
          <div>
            <strong>Geometry:</strong> {targetCompound.geometry}
          </div>
          <div>
            <strong>Polarity:</strong> {targetCompound.polarity}
          </div>
          <div>
            <strong>State:</strong> {targetCompound.state}
          </div>
          {targetCompound.commonName && (
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Common Name:</strong> {targetCompound.commonName}
            </div>
          )}
          {targetCompound.uses && (
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Uses:</strong> {targetCompound.uses}
            </div>
          )}
        </div>

        {targetCompound.hazards && targetCompound.hazards.length > 0 && (
          <div style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: '#FF6B6B',
            borderRadius: 4,
            fontSize: 12,
          }}>
            <strong>Hazards:</strong> {targetCompound.hazards.join(', ')}
          </div>
        )}
      </div>

      {/* Current molecule info */}
      <div style={{
        padding: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 15,
      }}>
        <h3 style={{ margin: 0, marginBottom: 10, color: '#FFD700' }}>
          Your Molecule
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          fontSize: 14,
        }}>
          <div>
            <strong>Formula:</strong>{' '}
            <span style={{ color: '#FFD700', fontSize: 16 }}>
              {currentFormula || 'None'}
            </span>
          </div>
          <div>
            <strong>Molar Mass:</strong> {currentMolarMass.toFixed(3)} g/mol
          </div>
        </div>

        {/* Comparison */}
        {currentFormula && (
          <div style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: currentFormula === targetCompound.formula ? '#4ECDC4' : '#FF6B6B',
            borderRadius: 4,
            fontSize: 12,
            textAlign: 'center',
            color: '#000',
            fontWeight: 'bold',
          }}>
            {currentFormula === targetCompound.formula ? 'Formula matches!' : 'Formula does not match'}
          </div>
        )}
      </div>

      {/* Reaction animation */}
      {showAnimation && animationType && (
        <div style={{
          padding: 20,
          backgroundColor: animationType === 'exothermic' ? '#FF6B6B' : '#4ECDC4',
          borderRadius: 8,
          marginBottom: 15,
          textAlign: 'center',
          animation: 'pulse 1s ease-in-out infinite',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <h3 style={{ margin: 0, marginBottom: 10, color: '#000' }}>
            {animationType === 'exothermic' ? 'Exothermic Reaction!' : 'Endothermic Reaction!'}
          </h3>
          <div style={{ fontSize: 14, color: '#000' }}>
            {animationType === 'exothermic' ? 'Energy Released' : 'Energy Absorbed'}
          </div>
          {targetCompound.energyChange && (
            <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#000' }}>
              ΔH = {targetCompound.energyChange} kJ/mol
            </div>
          )}

          {/* Animation particles */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  backgroundColor: animationType === 'exothermic' ? '#FFA500' : '#00BFFF',
                  borderRadius: '50%',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${1 + Math.random() * 2}s ease-in-out infinite`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result message */}
      {isCorrect !== null && (
        <div style={{
          padding: 20,
          backgroundColor: isCorrect ? '#4ECDC4' : '#FF6B6B',
          borderRadius: 8,
          marginBottom: 15,
          textAlign: 'center',
          color: '#000',
          fontWeight: 'bold',
          fontSize: 18,
        }}>
          {isCorrect ? 'Correct! Molecule created successfully!' : 'Incorrect. Try again!'}
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && (
        <div style={{
          padding: 15,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
          marginBottom: 15,
        }}>
          <h4 style={{ margin: 0, marginBottom: 10, color: '#FFD700' }}>
            Hints
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
            {hints.map((hint, i) => (
              <li key={i} style={{ marginBottom: 5 }}>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: 10,
      }}>
        <button
          onClick={onSubmit}
          style={{
            flex: 1,
            padding: '15px 30px',
            backgroundColor: '#4ECDC4',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3DB8A8';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4ECDC4';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Submit Molecule
        </button>

        <button
          onClick={onUseHint}
          disabled={!canUseHint}
          style={{
            padding: '15px 30px',
            backgroundColor: canUseHint ? '#FFD700' : '#666',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: canUseHint ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: canUseHint ? 1 : 0.5,
          }}
          onMouseEnter={(e) => {
            if (canUseHint) {
              e.currentTarget.style.backgroundColor = '#E6C200';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (canUseHint) {
              e.currentTarget.style.backgroundColor = '#FFD700';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          Get Hint
        </button>
      </div>

      {/* pH indicator if applicable */}
      {targetCompound.pH !== undefined && (
        <div style={{
          marginTop: 15,
          padding: 15,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
        }}>
          <h4 style={{ margin: 0, marginBottom: 10, color: '#4ECDC4' }}>
            pH Information
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              flex: 1,
              height: 30,
              background: 'linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #0000FF, #FF00FF)',
              borderRadius: 4,
              position: 'relative',
            }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${(targetCompound.pH / 14) * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 4,
                  height: 40,
                  backgroundColor: '#fff',
                  border: '2px solid #000',
                }}
              />
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold', minWidth: 40 }}>
              pH {targetCompound.pH}
            </div>
          </div>
          <div style={{
            marginTop: 5,
            fontSize: 12,
            textAlign: 'center',
            color: '#999',
          }}>
            {targetCompound.pH < 7 ? 'Acidic' : targetCompound.pH > 7 ? 'Basic' : 'Neutral'}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
        `}
      </style>
    </div>
  );
};
