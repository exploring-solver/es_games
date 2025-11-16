import React from 'react';
import { Player } from '../hooks/useMultiplayer';

interface PlayerBuzzerProps {
  player: Player;
  rank?: number;
  isCurrentPlayer?: boolean;
  showStats?: boolean;
}

export const PlayerBuzzer: React.FC<PlayerBuzzerProps> = ({
  player,
  rank,
  isCurrentPlayer = false,
  showStats = true
}) => {
  const getStreakColor = () => {
    if (player.streak >= 5) return '#8b5cf6';
    if (player.streak >= 3) return '#f59e0b';
    return '#6b7280';
  };

  const getRankMedal = () => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
    }
  };

  return (
    <div className={`player-buzzer ${isCurrentPlayer ? 'current-player' : ''} ${!player.isConnected ? 'disconnected' : ''}`}>
      {/* Rank Badge */}
      {rank && (
        <div className="rank-badge">
          {getRankMedal()}
        </div>
      )}

      {/* Player Avatar */}
      <div className="player-avatar-container">
        <div className="player-avatar">
          <span>{player.avatar}</span>
        </div>
        {player.hasAnswered && (
          <div className="answered-indicator">✓</div>
        )}
        {!player.isConnected && (
          <div className="disconnected-indicator">⚠</div>
        )}
      </div>

      {/* Player Info */}
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="player-score">{player.score.toLocaleString()} pts</div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="player-stats">
          {/* Streak */}
          {player.streak > 0 && (
            <div className="stat-item streak" style={{ backgroundColor: getStreakColor() }}>
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{player.streak}</span>
            </div>
          )}

          {/* Correct Answers */}
          <div className="stat-item correct">
            <span className="stat-icon">✓</span>
            <span className="stat-value">{player.correctAnswers}</span>
          </div>

          {/* Response Time (if answered) */}
          {player.hasAnswered && player.responseTime > 0 && (
            <div className="stat-item time">
              <span className="stat-icon">⏱</span>
              <span className="stat-value">{player.responseTime.toFixed(1)}s</span>
            </div>
          )}
        </div>
      )}

      {/* Ready Status */}
      {!player.isReady && (
        <div className="not-ready-badge">Not Ready</div>
      )}

      <style>{`
        .player-buzzer {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .player-buzzer:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .player-buzzer.current-player {
          border-color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
        }

        .player-buzzer.disconnected {
          opacity: 0.5;
          filter: grayscale(100%);
        }

        .rank-badge {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }

        .player-avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .player-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .answered-indicator {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 25px;
          height: 25px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          border: 2px solid white;
          animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes popIn {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }

        .disconnected-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 25px;
          height: 25px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          border: 2px solid white;
        }

        .player-info {
          flex: 1;
          min-width: 0;
        }

        .player-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-score {
          font-weight: 700;
          font-size: 1.3rem;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .player-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
        }

        .stat-item.streak {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .stat-item.correct {
          background: #10b981;
        }

        .stat-item.time {
          background: #3b82f6;
        }

        .stat-icon {
          font-size: 1rem;
        }

        .stat-value {
          font-weight: 700;
        }

        .not-ready-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ef4444;
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .player-buzzer {
            padding: 12px;
            gap: 12px;
          }

          .player-avatar {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .player-name {
            font-size: 1rem;
          }

          .player-score {
            font-size: 1.1rem;
          }

          .player-stats {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};
