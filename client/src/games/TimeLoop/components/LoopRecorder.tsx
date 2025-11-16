import React, { useState } from 'react';
import { RecordedLoop } from '../utils/timeEngine';

interface LoopRecorderProps {
  recordedLoops: RecordedLoop[];
  currentLoop: number;
  onPlaybackLoop?: (loopNumber: number) => void;
  onDeleteLoop?: (loopNumber: number) => void;
}

export const LoopRecorder: React.FC<LoopRecorderProps> = ({
  recordedLoops,
  currentLoop,
  onPlaybackLoop,
  onDeleteLoop,
}) => {
  const [expandedLoop, setExpandedLoop] = useState<number | null>(null);

  const toggleExpand = (loopNumber: number) => {
    setExpandedLoop(expandedLoop === loopNumber ? null : loopNumber);
  };

  const getLoopQuality = (loop: RecordedLoop): { label: string; color: string } => {
    if (loop.paradoxCount === 0) {
      return { label: 'Perfect', color: '#4ade80' };
    } else if (loop.paradoxCount <= 2) {
      return { label: 'Good', color: '#fbbf24' };
    } else if (loop.paradoxCount <= 5) {
      return { label: 'Unstable', color: '#fb923c' };
    } else {
      return { label: 'Chaotic', color: '#ef4444' };
    }
  };

  return (
    <div
      style={{
        padding: '15px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '10px',
        border: '2px solid rgba(100, 200, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        minWidth: '350px',
        maxHeight: '500px',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '15px' }}>
        <h3
          style={{
            margin: 0,
            color: '#64b5f6',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🎬</span>
          Loop Recorder
        </h3>
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '5px',
          }}
        >
          Current: Loop {currentLoop} | Recorded: {recordedLoops.length}
        </div>
      </div>

      {/* Loops List */}
      {recordedLoops.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '30px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏺️</div>
          <div>No loops recorded yet</div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            Complete your first timeline to start recording
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recordedLoops.map(loop => {
            const quality = getLoopQuality(loop);
            const isExpanded = expandedLoop === loop.loopNumber;
            const duration = loop.endTime - loop.startTime;

            return (
              <div
                key={loop.loopNumber}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: `1px solid ${quality.color}40`,
                  borderLeft: `4px solid ${quality.color}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Loop Header */}
                <div
                  onClick={() => toggleExpand(loop.loopNumber)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    transition: 'background 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isExpanded
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <div>
                        <div
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          Loop {loop.loopNumber}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {duration.toFixed(1)}s • {loop.actions.length} actions
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: quality.color,
                        color: '#000',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {quality.label}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Stats Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(255, 215, 0, 0.1)',
                          padding: '8px',
                          borderRadius: '6px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Energy
                        </div>
                        <div style={{ color: '#FFD700', fontSize: '14px', fontWeight: 'bold' }}>
                          {loop.resources.energy}
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(100, 200, 255, 0.1)',
                          padding: '8px',
                          borderRadius: '6px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Matter
                        </div>
                        <div style={{ color: '#64b5f6', fontSize: '14px', fontWeight: 'bold' }}>
                          {loop.resources.matter}
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(0, 255, 255, 0.1)',
                          padding: '8px',
                          borderRadius: '6px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Info
                        </div>
                        <div style={{ color: '#00CED1', fontSize: '14px', fontWeight: 'bold' }}>
                          {loop.resources.information}
                        </div>
                      </div>
                    </div>

                    {/* Paradox Count */}
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '8px',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Paradoxes Detected
                      </span>
                      <span
                        style={{
                          color: loop.paradoxCount === 0 ? '#4ade80' : '#ef4444',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {loop.paradoxCount}
                      </span>
                    </div>

                    {/* Action Timeline */}
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '6px',
                        }}
                      >
                        Action Timeline
                      </div>
                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '4px',
                          padding: '8px',
                          maxHeight: '100px',
                          overflowY: 'auto',
                        }}
                      >
                        {loop.actions.slice(0, 10).map((action, idx) => (
                          <div
                            key={action.id}
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '4px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>
                              {action.timestamp.toFixed(1)}s - {action.type}
                            </span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              ({action.position.x.toFixed(0)}, {action.position.y.toFixed(0)})
                            </span>
                          </div>
                        ))}
                        {loop.actions.length > 10 && (
                          <div
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.5)',
                              textAlign: 'center',
                              marginTop: '4px',
                            }}
                          >
                            +{loop.actions.length - 10} more actions
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {onPlaybackLoop && (
                        <button
                          onClick={() => onPlaybackLoop(loop.loopNumber)}
                          style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                            color: '#000',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          ▶ Playback
                        </button>
                      )}

                      {onDeleteLoop && (
                        <button
                          onClick={() => onDeleteLoop(loop.loopNumber)}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
