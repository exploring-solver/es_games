import { useState, useEffect, useCallback, useRef } from 'react';

export interface Player {
  id: string;
  name: string;
  color: string;
  currentRoom: string;
  position: { x: number; y: number };
  inventory: string[];
  isReady: boolean;
  isConnected: boolean;
  voiceEnabled: boolean;
  lastActivity: number;
}

export interface GameSyncState {
  players: { [playerId: string]: Player };
  sharedInventory: string[];
  globalPuzzlesSolved: string[];
  roomStates: { [roomId: string]: any };
  gameStarted: boolean;
  gameEnded: boolean;
  winConditionMet: boolean;
}

export interface CoopMessage {
  type: 'player_move' | 'puzzle_solved' | 'item_collected' | 'hint_requested' | 'chat' | 'ready' | 'voice_toggle';
  playerId: string;
  data: any;
  timestamp: number;
}

export interface UseCoopSyncProps {
  gameId: string;
  playerId: string;
  playerName: string;
  onMessage?: (message: CoopMessage) => void;
  onPlayerJoin?: (player: Player) => void;
  onPlayerLeave?: (playerId: string) => void;
}

/**
 * Custom hook for cooperative multiplayer synchronization
 * Handles player state, shared inventory, and real-time communication
 */
export const useCoopSync = ({
  gameId,
  playerId,
  playerName,
  onMessage,
  onPlayerJoin,
  onPlayerLeave
}: UseCoopSyncProps) => {
  const [syncState, setSyncState] = useState<GameSyncState>({
    players: {},
    sharedInventory: [],
    globalPuzzlesSolved: [],
    roomStates: {},
    gameStarted: false,
    gameEnded: false,
    winConditionMet: false
  });

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messageQueueRef = useRef<CoopMessage[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Initialize WebSocket connection
   */
  const connect = useCallback(() => {
    try {
      // In production, this would connect to your WebSocket server
      // For now, we'll simulate with local state management
      const ws = new WebSocket(`ws://localhost:3001/game/${gameId}`);

      ws.onopen = () => {
        console.log('Connected to game server');
        setIsConnected(true);
        setConnectionError(null);

        // Send join message
        const joinMessage: CoopMessage = {
          type: 'ready',
          playerId,
          data: {
            name: playerName,
            color: generatePlayerColor(playerId)
          },
          timestamp: Date.now()
        };
        ws.send(JSON.stringify(joinMessage));

        // Send queued messages
        messageQueueRef.current.forEach(msg => {
          ws.send(JSON.stringify(msg));
        });
        messageQueueRef.current = [];
      };

      ws.onmessage = (event) => {
        try {
          const message: CoopMessage = JSON.parse(event.data);
          handleIncomingMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error occurred');
      };

      ws.onclose = () => {
        console.log('Disconnected from game server');
        setIsConnected(false);

        // Attempt reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      socketRef.current = ws;
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionError('Failed to connect to game server');
      setIsConnected(false);
    }
  }, [gameId, playerId, playerName, onMessage]);

  /**
   * Handle incoming messages from other players
   */
  const handleIncomingMessage = useCallback((message: CoopMessage) => {
    switch (message.type) {
      case 'player_move':
        updatePlayerPosition(message.playerId, message.data.position, message.data.roomId);
        break;

      case 'puzzle_solved':
        addGlobalPuzzleSolved(message.data.puzzleId, message.playerId);
        break;

      case 'item_collected':
        addToSharedInventory(message.data.itemId, message.playerId);
        break;

      case 'ready':
        addPlayer({
          id: message.playerId,
          name: message.data.name,
          color: message.data.color,
          currentRoom: 'room_01',
          position: { x: 50, y: 50 },
          inventory: [],
          isReady: true,
          isConnected: true,
          voiceEnabled: false,
          lastActivity: Date.now()
        });
        break;

      case 'voice_toggle':
        updatePlayerVoice(message.playerId, message.data.enabled);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  /**
   * Send message to all players
   */
  const sendMessage = useCallback((type: CoopMessage['type'], data: any) => {
    const message: CoopMessage = {
      type,
      playerId,
      data,
      timestamp: Date.now()
    };

    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(message);
    }
  }, [playerId, isConnected]);

  /**
   * Update player position
   */
  const updatePlayerPosition = useCallback((
    targetPlayerId: string,
    position: { x: number; y: number },
    roomId: string
  ) => {
    setSyncState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [targetPlayerId]: prev.players[targetPlayerId] ? {
          ...prev.players[targetPlayerId],
          position,
          currentRoom: roomId,
          lastActivity: Date.now()
        } : prev.players[targetPlayerId]
      }
    }));
  }, []);

  /**
   * Broadcast own position
   */
  const broadcastPosition = useCallback((position: { x: number; y: number }, roomId: string) => {
    sendMessage('player_move', { position, roomId });
    updatePlayerPosition(playerId, position, roomId);
  }, [sendMessage, playerId, updatePlayerPosition]);

  /**
   * Add puzzle to global solved list
   */
  const addGlobalPuzzleSolved = useCallback((puzzleId: string, solvedBy: string) => {
    setSyncState(prev => ({
      ...prev,
      globalPuzzlesSolved: prev.globalPuzzlesSolved.includes(puzzleId)
        ? prev.globalPuzzlesSolved
        : [...prev.globalPuzzlesSolved, puzzleId]
    }));
  }, []);

  /**
   * Broadcast puzzle solved
   */
  const broadcastPuzzleSolved = useCallback((puzzleId: string, score: number) => {
    sendMessage('puzzle_solved', { puzzleId, score });
    addGlobalPuzzleSolved(puzzleId, playerId);
  }, [sendMessage, playerId, addGlobalPuzzleSolved]);

  /**
   * Add item to shared inventory
   */
  const addToSharedInventory = useCallback((itemId: string, collectedBy: string) => {
    setSyncState(prev => {
      const newState = { ...prev };

      // Add to shared inventory if not already there
      if (!newState.sharedInventory.includes(itemId)) {
        newState.sharedInventory = [...newState.sharedInventory, itemId];
      }

      // Add to player's personal inventory
      if (newState.players[collectedBy]) {
        const player = newState.players[collectedBy];
        if (!player.inventory.includes(itemId)) {
          newState.players[collectedBy] = {
            ...player,
            inventory: [...player.inventory, itemId]
          };
        }
      }

      return newState;
    });
  }, []);

  /**
   * Broadcast item collected
   */
  const broadcastItemCollected = useCallback((itemId: string) => {
    sendMessage('item_collected', { itemId });
    addToSharedInventory(itemId, playerId);
  }, [sendMessage, playerId, addToSharedInventory]);

  /**
   * Add player to game
   */
  const addPlayer = useCallback((player: Player) => {
    setSyncState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [player.id]: player
      }
    }));
    onPlayerJoin?.(player);
  }, [onPlayerJoin]);

  /**
   * Remove player from game
   */
  const removePlayer = useCallback((targetPlayerId: string) => {
    setSyncState(prev => {
      const newPlayers = { ...prev.players };
      delete newPlayers[targetPlayerId];
      return {
        ...prev,
        players: newPlayers
      };
    });
    onPlayerLeave?.(targetPlayerId);
  }, [onPlayerLeave]);

  /**
   * Toggle voice chat for current player
   */
  const toggleVoice = useCallback((enabled: boolean) => {
    sendMessage('voice_toggle', { enabled });
    updatePlayerVoice(playerId, enabled);
  }, [sendMessage, playerId]);

  /**
   * Update player voice status
   */
  const updatePlayerVoice = useCallback((targetPlayerId: string, enabled: boolean) => {
    setSyncState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [targetPlayerId]: prev.players[targetPlayerId] ? {
          ...prev.players[targetPlayerId],
          voiceEnabled: enabled
        } : prev.players[targetPlayerId]
      }
    }));
  }, []);

  /**
   * Get players in current room
   */
  const getPlayersInRoom = useCallback((roomId: string): Player[] => {
    return Object.values(syncState.players).filter(
      player => player.currentRoom === roomId && player.isConnected
    );
  }, [syncState.players]);

  /**
   * Get active players count
   */
  const getActivePlayerCount = useCallback((): number => {
    return Object.values(syncState.players).filter(p => p.isConnected).length;
  }, [syncState.players]);

  /**
   * Check if all players are ready
   */
  const areAllPlayersReady = useCallback((): boolean => {
    const activePlayers = Object.values(syncState.players).filter(p => p.isConnected);
    return activePlayers.length >= 2 && activePlayers.every(p => p.isReady);
  }, [syncState.players]);

  /**
   * Request hint (broadcasts to team)
   */
  const requestHint = useCallback((puzzleId: string) => {
    sendMessage('hint_requested', { puzzleId });
  }, [sendMessage]);

  /**
   * Start game (host only)
   */
  const startGame = useCallback(() => {
    setSyncState(prev => ({ ...prev, gameStarted: true }));
    sendMessage('ready', { gameStarted: true });
  }, [sendMessage]);

  /**
   * End game
   */
  const endGame = useCallback((won: boolean) => {
    setSyncState(prev => ({
      ...prev,
      gameEnded: true,
      winConditionMet: won
    }));
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // Heartbeat to detect inactive players
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const inactivePlayers = Object.values(syncState.players).filter(
        player => now - player.lastActivity > 30000 // 30 seconds
      );

      inactivePlayers.forEach(player => {
        console.warn(`Player ${player.name} appears inactive`);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [syncState.players]);

  return {
    // State
    players: syncState.players,
    sharedInventory: syncState.sharedInventory,
    globalPuzzlesSolved: syncState.globalPuzzlesSolved,
    gameStarted: syncState.gameStarted,
    gameEnded: syncState.gameEnded,
    winConditionMet: syncState.winConditionMet,
    isConnected,
    connectionError,

    // Actions
    broadcastPosition,
    broadcastPuzzleSolved,
    broadcastItemCollected,
    toggleVoice,
    getPlayersInRoom,
    getActivePlayerCount,
    areAllPlayersReady,
    requestHint,
    startGame,
    endGame,
    sendMessage
  };
};

/**
 * Generate a consistent color for a player based on their ID
 */
const generatePlayerColor = (playerId: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];

  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export default useCoopSync;
