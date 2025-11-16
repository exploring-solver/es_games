/**
 * Quantum Chess - Quantum Indicator Component
 * Displays quantum state information and effects
 */

import React from 'react';
import { QuantumEvent } from '../utils/quantumMechanics';

interface QuantumIndicatorProps {
  decoherenceLevel: number;
  quantumEvents: QuantumEvent[];
  moveCount: number;
  onEventDismiss?: () => void;
}

export const QuantumIndicator: React.FC<QuantumIndicatorProps> = ({
  decoherenceLevel,
  quantumEvents,
  moveCount,
  onEventDismiss
}) => {
  const decoherencePercentage = Math.min(decoherenceLevel * 100, 100);

  const getDecoherenceColor = () => {
    if (decoherencePercentage < 30) return '#00ff88';
    if (decoherencePercentage < 60) return '#ffaa00';
    return '#ff3366';
  };

  return (
    <div className="quantum-indicator">
      <div className="quantum-status">
        <h3>⚛️ Quantum Status</h3>

        <div className="decoherence-meter">
          <div className="meter-label">
            <span>Decoherence</span>
            <span>{decoherencePercentage.toFixed(1)}%</span>
          </div>
          <div className="meter-bar">
            <div
              className="meter-fill"
              style={{
                width: `${decoherencePercentage}%`,
                backgroundColor: getDecoherenceColor()
              }}
            />
          </div>
          <div className="meter-description">
            {decoherencePercentage < 30 && 'Quantum states stable'}
            {decoherencePercentage >= 30 && decoherencePercentage < 60 && 'States beginning to collapse'}
            {decoherencePercentage >= 60 && 'High collapse probability!'}
          </div>
        </div>

        <div className="move-counter">
          <span className="counter-label">Moves:</span>
          <span className="counter-value">{moveCount}</span>
        </div>
      </div>

      {quantumEvents.length > 0 && (
        <div className="quantum-events">
          {quantumEvents.map((event, idx) => (
            <div
              key={idx}
              className={`quantum-event ${event.type}`}
              onClick={onEventDismiss}
            >
              <div className="event-header">
                <span className="event-icon">
                  {event.type === 'tunneling' && '🌀'}
                  {event.type === 'interference' && '〰️'}
                  {event.type === 'decoherence' && '⚡'}
                </span>
                <span className="event-title">{event.type.toUpperCase()}</span>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-probability">
                Probability: {(event.probability * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="quantum-legend">
        <h4>Quantum Effects</h4>
        <div className="legend-item">
          <span className="legend-icon">👻</span>
          <span>Ghost Piece = Superposition</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">⚛</span>
          <span>Atom Symbol = Entangled</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🌊</span>
          <span>Wave = Quantum State</span>
        </div>
      </div>
    </div>
  );
};
