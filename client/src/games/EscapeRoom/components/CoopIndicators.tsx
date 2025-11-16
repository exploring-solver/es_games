import React, { useState } from 'react';
import { Player } from '../hooks/useCoopSync';

interface CoopIndicatorsProps {
  players: { [playerId: string]: Player };
  currentPlayerId: string;
  currentRoom: string;
  onVoiceToggle: (enabled: boolean) => void;
  isConnected: boolean;
  connectionError?: string | null;
}

export const CoopIndicators: React.FC<CoopIndicatorsProps> = ({
  players,
  currentPlayerId,
  currentRoom,
  onVoiceToggle,
  isConnected,
  connectionError
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const playerList = Object.values(players);
  const activePlayers = playerList.filter(p => p.isConnected);
  const playersInRoom = activePlayers.filter(p => p.currentRoom === currentRoom);
  const playersElsewhere = activePlayers.filter(p => p.currentRoom !== currentRoom);

  // Handle voice toggle
  const handleVoiceToggle = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    onVoiceToggle(newState);
  };

  // Get player status icon
  const getStatusIcon = (player: Player): string => {
    if (!player.isConnected) return '🔴';
    if (player.currentRoom === currentRoom) return '🟢';
    return '🟡';
  };

  // Get connection quality indicator
  const getConnectionQuality = (): { icon: string; text: string; color: string } => {
    if (connectionError) {
      return { icon: '❌', text: 'Disconnected', color: '#f44336' };
    }
    if (!isConnected) {
      return { icon: '⏳', text: 'Connecting...', color: '#FFC107' };
    }
    return { icon: '✓', text: 'Connected', color: '#4CAF50' };
  };

  const connectionQuality = getConnectionQuality();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 100,
      minWidth: '280px'
    }}>
      {/* Collapsed View */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            border: '3px solid #7c4dff',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
          }}
        >
          <span>👥</span>
          <span>{activePlayers.length} Players</span>
        </button>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          border: '3px solid #7c4dff',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>👥</span>
              <div>
                <div style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  Team Status
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '11px'
                }}>
                  {activePlayers.length}/{playerList.length} online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              −
            </button>
          </div>

          {/* Connection Status */}
          <div style={{
            padding: '12px 16px',
            background: `${connectionQuality.color}20`,
            borderBottom: `2px solid ${connectionQuality.color}40`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: connectionQuality.color,
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              <span>{connectionQuality.icon}</span>
              <span>{connectionQuality.text}</span>
            </div>

            {/* Voice Toggle */}
            <button
              onClick={handleVoiceToggle}
              disabled={!isConnected}
              style={{
                background: voiceEnabled
                  ? 'linear-gradient(135deg, #4CAF50, #45a049)'
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: isConnected ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                opacity: isConnected ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (isConnected) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span>{voiceEnabled ? '🎤' : '🔇'}</span>
              <span>{voiceEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Players in Current Room */}
          {playersInRoom.length > 0 && (
            <div style={{ padding: '16px' }}>
              <div style={{
                color: '#4CAF50',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🟢</span>
                <span>IN THIS ROOM ({playersInRoom.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {playersInRoom.map(player => (
                  <div
                    key={player.id}
                    style={{
                      background: player.id === currentPlayerId
                        ? 'rgba(124, 77, 255, 0.2)'
                        : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${player.id === currentPlayerId ? '#7c4dff' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '10px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    {/* Player Avatar */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: player.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      position: 'relative'
                    }}>
                      👤
                      {player.voiceEnabled && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          background: '#4CAF50',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          border: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8px'
                        }}>
                          🎤
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '2px'
                      }}>
                        {player.name}
                        {player.id === currentPlayerId && (
                          <span style={{
                            marginLeft: '6px',
                            color: '#7c4dff',
                            fontSize: '11px'
                          }}>
                            (You)
                          </span>
                        )}
                      </div>
                      <div style={{
                        color: '#888',
                        fontSize: '11px'
                      }}>
                        {player.inventory.length} items
                      </div>
                    </div>

                    {/* Ready Status */}
                    {player.isReady && (
                      <div style={{
                        background: '#4CAF50',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        ✓ READY
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players in Other Rooms */}
          {playersElsewhere.length > 0 && (
            <div style={{
              padding: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                color: '#FFC107',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🟡</span>
                <span>OTHER ROOMS ({playersElsewhere.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {playersElsewhere.map(player => (
                  <div
                    key={player.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: player.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      opacity: 0.6
                    }}>
                      👤
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {player.name}
                      </div>
                      <div style={{
                        color: '#666',
                        fontSize: '10px'
                      }}>
                        📍 {player.currentRoom}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '11px',
            color: '#888',
            textAlign: 'center'
          }}>
            💡 Some puzzles require multiple players to solve
          </div>
        </div>
      )}
    </div>
  );
};

export default CoopIndicators;
