import React, { useState, useEffect } from 'react';
import { DisasterData } from '../data/rooms';

interface TimerProps {
  disaster: DisasterData;
  startTime: number;
  isPaused?: boolean;
  onTimeUp?: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  disaster,
  startTime,
  isPaused = false,
  onTimeUp
}) => {
  const [timeRemaining, setTimeRemaining] = useState(disaster.timeLimit);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(disaster.timeLimit - elapsed, 0);

      setTimeRemaining(remaining);
      setLastUpdate(now);

      if (remaining === 0 && onTimeUp) {
        onTimeUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [disaster.timeLimit, startTime, isPaused, onTimeUp]);

  // Calculate percentage remaining
  const percentageRemaining = (timeRemaining / disaster.timeLimit) * 100;

  // Determine urgency level
  const getUrgencyLevel = (): 'safe' | 'warning' | 'critical' | 'danger' => {
    if (percentageRemaining > 50) return 'safe';
    if (percentageRemaining > 25) return 'warning';
    if (percentageRemaining > 10) return 'critical';
    return 'danger';
  };

  const urgency = getUrgencyLevel();

  // Get color based on urgency
  const getUrgencyColor = () => {
    const colors = {
      safe: '#4CAF50',
      warning: '#FFC107',
      critical: '#FF9800',
      danger: '#f44336'
    };
    return colors[urgency];
  };

  const urgencyColor = getUrgencyColor();

  // Format time
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get disaster icon
  const getDisasterIcon = () => {
    const icons = {
      radiation_leak: '☢️',
      virus_outbreak: '🦠',
      reactor_meltdown: '🔥'
    };
    return icons[disaster.id];
  };

  // Get warning message
  const getWarningMessage = () => {
    if (urgency === 'safe') return null;
    if (urgency === 'warning') return 'Time is running short!';
    if (urgency === 'critical') return 'CRITICAL: Less than 25% time remaining!';
    return 'DANGER: Less than 10% time remaining!';
  };

  const warningMessage = getWarningMessage();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      width: '90%',
      maxWidth: '600px'
    }}>
      {/* Main Timer Display */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 3px ${urgencyColor}40`,
        border: `3px solid ${urgencyColor}`,
        animation: urgency === 'danger' ? 'pulse-danger 1s ease-in-out infinite' : 'none'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{getDisasterIcon()}</span>
            <div>
              <div style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {disaster.name}
              </div>
              <div style={{
                color: '#888',
                fontSize: '12px',
                marginTop: '2px'
              }}>
                {disaster.difficulty.toUpperCase()} MODE
              </div>
            </div>
          </div>

          {/* Time Display */}
          <div style={{
            textAlign: 'right'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: urgencyColor,
              fontFamily: 'monospace',
              textShadow: `0 0 20px ${urgencyColor}80`,
              lineHeight: 1
            }}>
              {formatTime(timeRemaining)}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#888',
              marginTop: '4px'
            }}>
              TIME REMAINING
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          height: '20px',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            background: `linear-gradient(90deg, ${urgencyColor}, ${urgencyColor}dd)`,
            height: '100%',
            width: `${percentageRemaining}%`,
            transition: 'width 0.3s ease, background 0.5s ease',
            borderRadius: '12px',
            boxShadow: `0 0 10px ${urgencyColor}80`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated shine effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shine 2s ease-in-out infinite'
            }} />
          </div>

          {/* Percentage Text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            zIndex: 1
          }}>
            {Math.round(percentageRemaining)}%
          </div>
        </div>

        {/* Warning Message */}
        {warningMessage && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: `${urgencyColor}20`,
            border: `2px solid ${urgencyColor}`,
            borderRadius: '8px',
            color: urgencyColor,
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            animation: urgency === 'danger' ? 'flash 0.5s ease-in-out infinite' : 'none'
          }}>
            ⚠️ {warningMessage}
          </div>
        )}

        {/* Mission Objective */}
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            color: '#42A5F5',
            fontSize: '11px',
            fontWeight: 'bold',
            marginBottom: '6px'
          }}>
            🎯 MISSION OBJECTIVE
          </div>
          <div style={{
            color: '#ccc',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            {disaster.winCondition}
          </div>
        </div>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <div style={{
          marginTop: '12px',
          background: 'rgba(255, 193, 7, 0.2)',
          border: '2px solid #FFC107',
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'center',
          color: '#FFC107',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          ⏸️ GAME PAUSED
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse-danger {
            0%, 100% {
              box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 3px ${urgencyColor}40;
            }
            50% {
              box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 3px ${urgencyColor}80, 0 0 30px ${urgencyColor}60;
            }
          }

          @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default Timer;
