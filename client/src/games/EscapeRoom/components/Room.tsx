import React, { useState, useEffect } from 'react';
import { RoomData, InteractiveObject } from '../data/rooms';
import { Player } from '../hooks/useCoopSync';

interface RoomProps {
  room: RoomData;
  players: Player[];
  currentPlayerId: string;
  onObjectInteract: (object: InteractiveObject) => void;
  onRoomChange: (roomId: string) => void;
  solvedPuzzles: string[];
  inventory: string[];
}

export const Room: React.FC<RoomProps> = ({
  room,
  players,
  currentPlayerId,
  onObjectInteract,
  onRoomChange,
  solvedPuzzles,
  inventory
}) => {
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });

  // Get theme-based styling
  const getThemeStyles = () => {
    const themes = {
      chemistry: {
        background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
        accent: '#4CAF50',
        glow: '#66BB6A'
      },
      physics: {
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        accent: '#2196F3',
        glow: '#42A5F5'
      },
      biology: {
        background: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
        accent: '#9C27B0',
        glow: '#AB47BC'
      },
      mixed: {
        background: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
        accent: '#607D8B',
        glow: '#78909C'
      }
    };
    return themes[room.theme];
  };

  const themeStyles = getThemeStyles();

  // Check if object is interactive
  const isObjectAccessible = (obj: InteractiveObject): boolean => {
    if (obj.interactionType === 'puzzle') {
      const puzzleId = room.availablePuzzles.find(id =>
        !solvedPuzzles.includes(id)
      );
      return !!puzzleId;
    }

    if (obj.interactionType === 'door') {
      return solvedPuzzles.length >= room.requiredPuzzleSolves;
    }

    return true;
  };

  // Get connected rooms that are accessible
  const getAccessibleRooms = () => {
    if (solvedPuzzles.length < room.requiredPuzzleSolves) {
      return [];
    }
    return room.connectedRooms;
  };

  const accessibleRooms = getAccessibleRooms();

  return (
    <div style={{
      width: '100%',
      height: '600px',
      background: themeStyles.background,
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 0 60px ${themeStyles.glow}20`,
      border: `2px solid ${themeStyles.accent}40`
    }}>
      {/* Room Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
        zIndex: 10
      }}>
        <h2 style={{
          margin: 0,
          color: themeStyles.accent,
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: `0 0 10px ${themeStyles.glow}`
        }}>
          {room.name}
        </h2>
        <p style={{
          margin: '8px 0 0 0',
          color: '#ccc',
          fontSize: '14px'
        }}>
          {room.description}
        </p>
        <div style={{
          marginTop: '8px',
          display: 'flex',
          gap: '12px',
          fontSize: '12px'
        }}>
          <span style={{ color: themeStyles.accent }}>
            📋 Puzzles: {solvedPuzzles.filter(id => room.availablePuzzles.includes(id)).length}/{room.requiredPuzzleSolves}
          </span>
          <span style={{ color: '#ffd700' }}>
            Difficulty: {room.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Interactive Objects */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {room.interactiveObjects.map((obj) => {
          const accessible = isObjectAccessible(obj);
          const isHovered = hoveredObject === obj.id;

          return (
            <div
              key={obj.id}
              style={{
                position: 'absolute',
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: accessible ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                zIndex: isHovered ? 5 : 1
              }}
              onMouseEnter={() => setHoveredObject(obj.id)}
              onMouseLeave={() => setHoveredObject(null)}
              onClick={() => accessible && onObjectInteract(obj)}
            >
              {/* Object Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: accessible
                  ? `radial-gradient(circle, ${themeStyles.accent}40, ${themeStyles.accent}20)`
                  : 'radial-gradient(circle, #555, #333)',
                border: `3px solid ${accessible ? themeStyles.accent : '#666'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: accessible && isHovered
                  ? `0 0 30px ${themeStyles.glow}, 0 0 60px ${themeStyles.glow}60`
                  : '0 4px 12px rgba(0,0,0,0.4)',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                animation: accessible ? 'pulse 2s ease-in-out infinite' : 'none'
              }}>
                {getObjectIcon(obj.interactionType)}
              </div>

              {/* Object Label */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: '70px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.95)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${themeStyles.accent}`,
                  whiteSpace: 'nowrap',
                  minWidth: '150px',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
                }}>
                  <div style={{
                    color: themeStyles.accent,
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {obj.name}
                  </div>
                  <div style={{
                    color: '#aaa',
                    fontSize: '12px'
                  }}>
                    {obj.description}
                  </div>
                  {!accessible && (
                    <div style={{
                      color: '#ff6b6b',
                      fontSize: '11px',
                      marginTop: '4px'
                    }}>
                      Not accessible
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Other Players */}
        {players
          .filter(p => p.id !== currentPlayerId && p.currentRoom === room.id)
          .map(player => (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                left: `${player.position.x}%`,
                top: `${player.position.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 3
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: player.color,
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                position: 'relative'
              }}>
                👤
                {player.voiceEnabled && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    🎤
                  </div>
                )}
              </div>
              <div style={{
                position: 'absolute',
                top: '45px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.8)',
                padding: '4px 8px',
                borderRadius: '4px',
                color: 'white',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>
                {player.name}
              </div>
            </div>
          ))}
      </div>

      {/* Exit Doors */}
      {accessibleRooms.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 10
        }}>
          {accessibleRooms.map(roomId => (
            <button
              key={roomId}
              onClick={() => onRoomChange(roomId)}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${themeStyles.accent}, ${themeStyles.glow})`,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: `0 4px 16px ${themeStyles.accent}60`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 24px ${themeStyles.accent}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${themeStyles.accent}60`;
              }}
            >
              🚪 Go to {roomId}
            </button>
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      {solvedPuzzles.length < room.requiredPuzzleSolves && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '12px 16px',
          borderRadius: '8px',
          border: `2px solid ${themeStyles.accent}`,
          color: 'white',
          fontSize: '14px'
        }}>
          ⚠️ Solve {room.requiredPuzzleSolves - solvedPuzzles.length} more puzzle(s) to unlock exits
        </div>
      )}

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 10px ${themeStyles.glow}40;
            }
            50% {
              box-shadow: 0 0 25px ${themeStyles.glow}80;
            }
          }
        `}
      </style>
    </div>
  );
};

// Helper function to get icon for object type
const getObjectIcon = (type: InteractiveObject['interactionType']): string => {
  const icons = {
    puzzle: '🧩',
    item: '📦',
    door: '🚪',
    clue: '📜',
    combination: '🔐'
  };
  return icons[type] || '❓';
};

export default Room;
