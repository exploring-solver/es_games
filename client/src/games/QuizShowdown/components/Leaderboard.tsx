import React from 'react';
import { Player } from '../hooks/useMultiplayer';
import { PlayerBuzzer } from './PlayerBuzzer';

interface LeaderboardProps {
  players: (Player & { rank: number })[];
  title?: string;
  showFullStats?: boolean;
  highlightPlayerId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  title = 'Leaderboard',
  showFullStats = true,
  highlightPlayerId
}) => {
  const getPodiumPosition = (rank: number) => {
    switch (rank) {
      case 1: return { height: '180px', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' };
      case 2: return { height: '140px', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.3)' };
      case 3: return { height: '100px', color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.3)' };
      default: return { height: '80px', color: '#6b7280', glow: 'rgba(107, 114, 128, 0.3)' };
    }
  };

  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">{title}</h2>

      {/* Podium for top 3 */}
      {topThree.length > 0 && (
        <div className="podium-container">
          {/* Rearrange for podium display: 2nd, 1st, 3rd */}
          {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((player, index) => {
            if (!player) return null;
            const position = getPodiumPosition(player.rank);
            const displayOrder = [2, 1, 3];
            const actualRank = displayOrder[index];

            return (
              <div key={player.id} className="podium-position">
                {/* Player Card */}
                <div className="podium-player-card">
                  <div className="podium-rank-badge" style={{ backgroundColor: position.color }}>
                    {actualRank === 1 ? '👑' : actualRank === 2 ? '🥈' : '🥉'}
                  </div>
                  <div className="podium-avatar">{player.avatar}</div>
                  <div className="podium-name">{player.name}</div>
                  <div className="podium-score">{player.score.toLocaleString()}</div>
                  <div className="podium-stats">
                    <span>✓ {player.correctAnswers}</span>
                    {player.streak > 0 && <span>🔥 {player.streak}</span>}
                  </div>
                </div>

                {/* Podium Stand */}
                <div
                  className="podium-stand"
                  style={{
                    height: position.height,
                    background: `linear-gradient(135deg, ${position.color} 0%, ${position.color}aa 100%)`,
                    boxShadow: `0 10px 40px ${position.glow}`
                  }}
                >
                  <div className="podium-rank-number">{actualRank}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Remaining players list */}
      {rest.length > 0 && (
        <div className="players-list">
          {rest.map(player => (
            <div key={player.id} className="player-list-item">
              <PlayerBuzzer
                player={player}
                rank={player.rank}
                isCurrentPlayer={player.id === highlightPlayerId}
                showStats={showFullStats}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {players.length === 0 && (
        <div className="empty-leaderboard">
          <span className="empty-icon">📊</span>
          <p>No players yet</p>
        </div>
      )}

      <style>{`
        .leaderboard-container {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          border-radius: 20px;
          padding: 25px;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .leaderboard-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0 0 30px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .podium-container {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 40px;
          padding: 0 20px;
        }

        .podium-position {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          flex: 1;
          max-width: 200px;
        }

        .podium-player-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          width: 100%;
          position: relative;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: floatIn 0.6s ease-out;
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .podium-rank-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
          border: 3px solid white;
        }

        .podium-avatar {
          font-size: 3rem;
          margin-bottom: 10px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .podium-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .podium-score {
          font-weight: 700;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .podium-stats {
          display: flex;
          justify-content: center;
          gap: 12px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .podium-stand {
          width: 100%;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15px;
          transition: all 0.3s ease;
          animation: riseUp 0.8s ease-out;
        }

        @keyframes riseUp {
          from {
            height: 0;
          }
          to {
            height: var(--final-height);
          }
        }

        .podium-stand:hover {
          transform: scale(1.05);
        }

        .podium-rank-number {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
        }

        .players-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .player-list-item {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .empty-leaderboard {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 15px;
          opacity: 0.5;
        }

        .empty-leaderboard p {
          font-size: 1.2rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .leaderboard-container {
            padding: 20px;
          }

          .leaderboard-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }

          .podium-container {
            gap: 10px;
            padding: 0 10px;
          }

          .podium-position {
            max-width: 150px;
          }

          .podium-player-card {
            padding: 15px 10px;
          }

          .podium-avatar {
            font-size: 2rem;
          }

          .podium-name {
            font-size: 0.9rem;
          }

          .podium-score {
            font-size: 1.2rem;
          }

          .podium-stats {
            font-size: 0.8rem;
            gap: 8px;
          }

          .podium-rank-number {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .podium-container {
            flex-direction: column;
            align-items: center;
          }

          .podium-position {
            width: 100%;
            max-width: 250px;
            flex-direction: row;
            gap: 10px;
          }

          .podium-stand {
            width: 60px;
            height: 60px !important;
            border-radius: 10px;
          }

          .podium-rank-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
