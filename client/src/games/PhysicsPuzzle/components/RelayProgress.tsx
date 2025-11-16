import React from 'react';
import { RelayPlayer, RelayEffect } from '../hooks/useRelayLogic';

interface RelayProgressProps {
  players: RelayPlayer[];
  currentPlayerIndex: number;
  totalScore: number;
  totalTime: number;
  effects: RelayEffect[];
}

export const RelayProgress: React.FC<RelayProgressProps> = ({
  players,
  currentPlayerIndex,
  totalScore,
  totalTime,
  effects,
}) => {
  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(100, 200, 255, 0.3)',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#64b5f6', fontSize: '16px' }}>
        Relay Progress
      </h3>

      {/* Overall Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '15px',
          fontSize: '13px',
        }}
      >
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Score</div>
          <div style={{ color: '#4ade80', fontSize: '18px', fontWeight: 'bold' }}>
            {totalScore.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Time</div>
          <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold' }}>
            {totalTime.toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Player Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {players.map((player, index) => {
          const isCurrent = index === currentPlayerIndex;
          const isComplete = player.completed;
          const isPast = index < currentPlayerIndex;

          return (
            <div
              key={player.id}
              style={{
                background: isCurrent
                  ? 'rgba(100, 200, 255, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
                padding: '10px',
                borderRadius: '8px',
                border: isCurrent
                  ? `2px solid ${player.color}`
                  : '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Current indicator */}
              {isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: player.color,
                  }}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                {/* Player indicator */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: player.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#000',
                  }}
                >
                  P{player.id + 1}
                </div>

                {/* Player name and status */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {player.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {isCurrent ? 'Currently Playing' : isComplete ? 'Completed' : isPast ? 'Skipped' : 'Waiting'}
                  </div>
                </div>

                {/* Status icon */}
                <div style={{ fontSize: '18px' }}>
                  {isComplete ? '✓' : isCurrent ? '▶' : isPast ? '○' : '⋯'}
                </div>
              </div>

              {/* Stats (if completed or current) */}
              {(isComplete || isCurrent) && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '8px',
                    fontSize: '11px',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Score</div>
                    <div style={{ color: '#4ade80', fontWeight: 'bold' }}>
                      {player.score.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Time</div>
                    <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                      {player.timeSpent.toFixed(1)}s
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Objects</div>
                    <div style={{ color: '#f472b6', fontWeight: 'bold' }}>
                      {player.objectsUsed}
                    </div>
                  </div>
                </div>
              )}

              {/* Active effects for this player */}
              {isCurrent && effects.filter(e => e.playerId === index && e.active).length > 0 && (
                <div
                  style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                    Active Effects:
                  </div>
                  {effects
                    .filter(e => e.playerId === index && e.active)
                    .map((effect, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '11px',
                          color: '#fbbf24',
                          padding: '3px 6px',
                          background: 'rgba(251, 191, 36, 0.1)',
                          borderRadius: '4px',
                          marginBottom: '2px',
                        }}
                      >
                        ⚡ {effect.description}
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface RelayStatsProps {
  players: RelayPlayer[];
  averageTime: number;
  bestTime: number;
  worstTime: number;
  totalAttempts: number;
  efficiency: number;
}

export const RelayStats: React.FC<RelayStatsProps> = ({
  players,
  averageTime,
  bestTime,
  worstTime,
  totalAttempts,
  efficiency,
}) => {
  const completedPlayers = players.filter(p => p.completed);

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(100, 200, 255, 0.3)',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#64b5f6', fontSize: '16px' }}>
        Relay Statistics
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Completion Rate</span>
          <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
            {completedPlayers.length}/{players.length}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Average Time</span>
          <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
            {averageTime.toFixed(1)}s
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Best Time</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
            {bestTime.toFixed(1)}s
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Worst Time</span>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
            {worstTime.toFixed(1)}s
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Attempts</span>
          <span style={{ fontWeight: 'bold' }}>
            {totalAttempts}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Efficiency</span>
          <span style={{ color: '#f472b6', fontWeight: 'bold' }}>
            {efficiency.toFixed(0)} pts/obj
          </span>
        </div>
      </div>

      {/* Top performer */}
      {completedPlayers.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
            Top Performer
          </div>
          {(() => {
            const topPlayer = [...completedPlayers].sort((a, b) => b.score - a.score)[0];
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: topPlayer.color,
                  }}
                />
                <span style={{ flex: 1 }}>{topPlayer.name}</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                  {topPlayer.score.toLocaleString()}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
