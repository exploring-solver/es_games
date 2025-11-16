import React from 'react';
import { PowerUp } from '../hooks/useQuizLogic';

interface PowerUpShopProps {
  powerUps: PowerUp[];
  coins: number;
  onUsePowerUp: (powerUpType: string) => void;
  onBuyPowerUp?: (powerUpType: string) => void;
  isAnswered?: boolean;
}

export const PowerUpShop: React.FC<PowerUpShopProps> = ({
  powerUps,
  coins,
  onUsePowerUp,
  onBuyPowerUp,
  isAnswered = false
}) => {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'time_freeze': return '⏸️';
      case 'fifty_fifty': return '✂️';
      case 'steal_points': return '💰';
      case 'double_points': return '✨';
      case 'skip': return '⏭️';
      default: return '🎁';
    }
  };

  const getPowerUpDescription = (type: string) => {
    switch (type) {
      case 'time_freeze': return 'Freeze timer for 10 seconds';
      case 'fifty_fifty': return 'Eliminate 2 wrong answers';
      case 'steal_points': return 'Steal points from opponent';
      case 'double_points': return 'Double points for next answer';
      case 'skip': return 'Skip to next question';
      default: return 'Mystery power-up';
    }
  };

  const canUsePowerUp = (powerUp: PowerUp) => {
    return powerUp.usesRemaining > 0 && !isAnswered;
  };

  const canBuyPowerUp = (powerUp: PowerUp) => {
    return coins >= powerUp.cost && onBuyPowerUp !== undefined;
  };

  return (
    <div className="powerup-shop">
      <div className="shop-header">
        <h3>Power-Ups</h3>
        <div className="coins-display">
          <span className="coin-icon">🪙</span>
          <span className="coin-amount">{coins}</span>
        </div>
      </div>

      <div className="powerups-grid">
        {powerUps.map(powerUp => (
          <div
            key={powerUp.id}
            className={`powerup-card ${!canUsePowerUp(powerUp) ? 'disabled' : ''}`}
          >
            <div className="powerup-icon">{getPowerUpIcon(powerUp.type)}</div>

            <div className="powerup-info">
              <div className="powerup-name">{powerUp.name}</div>
              <div className="powerup-description">
                {getPowerUpDescription(powerUp.type)}
              </div>
            </div>

            <div className="powerup-footer">
              <div className="powerup-uses">
                <span className="uses-icon">🔢</span>
                <span>{powerUp.usesRemaining}</span>
              </div>

              <div className="powerup-actions">
                {/* Use button */}
                <button
                  className="use-button"
                  onClick={() => onUsePowerUp(powerUp.type)}
                  disabled={!canUsePowerUp(powerUp)}
                  title={canUsePowerUp(powerUp) ? 'Use power-up' : 'No uses remaining'}
                >
                  Use
                </button>

                {/* Buy button (if shop is enabled) */}
                {onBuyPowerUp && (
                  <button
                    className="buy-button"
                    onClick={() => onBuyPowerUp(powerUp.type)}
                    disabled={!canBuyPowerUp(powerUp)}
                    title={canBuyPowerUp(powerUp) ? `Buy for ${powerUp.cost} coins` : 'Not enough coins'}
                  >
                    <span className="coin-icon">🪙</span>
                    {powerUp.cost}
                  </button>
                )}
              </div>
            </div>

            {/* Shimmer effect for available power-ups */}
            {canUsePowerUp(powerUp) && (
              <div className="powerup-shimmer" />
            )}
          </div>
        ))}
      </div>

      <style>{`
        .powerup-shop {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(139, 92, 246, 0.3);
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .shop-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .coins-display {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .coin-icon {
          font-size: 1.3rem;
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .coin-amount {
          font-weight: 700;
          font-size: 1.2rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .powerups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .powerup-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 15px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .powerup-card:hover:not(.disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .powerup-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .powerup-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .powerup-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 10px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .powerup-info {
          margin-bottom: 15px;
        }

        .powerup-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          margin-bottom: 5px;
          text-align: center;
        }

        .powerup-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          line-height: 1.4;
        }

        .powerup-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .powerup-uses {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.3);
          padding: 6px 12px;
          border-radius: 15px;
          font-weight: 600;
          color: white;
          font-size: 0.9rem;
        }

        .uses-icon {
          font-size: 1rem;
        }

        .powerup-actions {
          display: flex;
          gap: 8px;
        }

        .use-button,
        .buy-button {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .use-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .use-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .use-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .use-button:disabled {
          background: #6b7280;
          cursor: not-allowed;
          box-shadow: none;
        }

        .buy-button {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .buy-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
        }

        .buy-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .buy-button:disabled {
          background: #6b7280;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .powerup-shop {
            padding: 15px;
          }

          .shop-header h3 {
            font-size: 1.2rem;
          }

          .coins-display {
            padding: 6px 12px;
          }

          .coin-icon {
            font-size: 1.1rem;
          }

          .coin-amount {
            font-size: 1rem;
          }

          .powerups-grid {
            grid-template-columns: 1fr;
          }

          .powerup-card {
            padding: 12px;
          }

          .powerup-icon {
            font-size: 2.5rem;
          }

          .powerup-name {
            font-size: 1rem;
          }

          .powerup-description {
            font-size: 0.8rem;
          }

          .use-button,
          .buy-button {
            padding: 6px 12px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};
