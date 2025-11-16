# Quantum Chess - Usage Guide

## Quick Start

### Import and Use

```tsx
import QuantumChess from './games/QuantumChess';

function App() {
  return <QuantumChess />;
}
```

## Advanced Usage

### Using Individual Components

```tsx
import { Board, Piece, QuantumIndicator } from './games/QuantumChess/components';
import { useGameState } from './games/QuantumChess/hooks/useGameState';

function CustomQuantumGame() {
  const {
    gameState,
    selectedPiece,
    possibleMoves,
    selectPiece,
    movePiece
  } = useGameState();

  return (
    <div>
      <Board
        pieces={gameState.pieces}
        selectedPiece={selectedPiece}
        possibleMoves={possibleMoves}
        onSquareClick={(pos) => console.log('Square clicked:', pos)}
        onPieceClick={selectPiece}
      />
      <QuantumIndicator
        decoherenceLevel={gameState.decoherenceLevel}
        quantumEvents={gameState.quantumEvents}
        moveCount={gameState.moveCount}
      />
    </div>
  );
}
```

### Using Quantum Mechanics Utilities

```tsx
import {
  createSuperposition,
  collapseQuantumState,
  entanglePieces,
  applyTunneling,
  isInCheck
} from './games/QuantumChess/utils/quantumMechanics';

// Create a piece in superposition
const piece = {
  id: 'white-pawn-1',
  type: 'pawn',
  player: 'white',
  quantumStates: [{ position: { row: 6, col: 0 }, probability: 1.0 }],
  isEntangled: false,
  hasMoved: false
};

const positions = [
  { row: 5, col: 0 },
  { row: 4, col: 0 }
];

const superposedPiece = createSuperposition(piece, positions);
// Now the piece exists in two positions with 50% probability each

// Collapse the superposition
const collapsedPiece = collapseQuantumState(superposedPiece);
// Piece is now in one definite position
```

### Using AI Logic

```tsx
import { calculateAIMove, AIDifficulty } from './games/QuantumChess/utils/aiLogic';

const difficulty: AIDifficulty = 'hard';
const pieces = gameState.pieces;
const aiPlayer = 'black';

const aiMove = calculateAIMove(pieces, aiPlayer, difficulty);

if (aiMove) {
  console.log('AI moves piece:', aiMove.piece.id);
  console.log('To position:', aiMove.move.quantumStates[0].position);
}
```

## Custom Game Modes

### Creating a Custom Level

```tsx
import { useGameState } from './games/QuantumChess/hooks/useGameState';

function CustomLevel() {
  const { setLevel, currentLevel, gameState } = useGameState();

  useEffect(() => {
    // Set up custom level conditions
    setLevel(5);

    // Custom win condition
    const checkCustomWin = () => {
      // Your custom logic
      const hasEntangledQueen = gameState.pieces.some(
        p => p.type === 'queen' && p.isEntangled
      );
      return hasEntangledQueen;
    };

    if (checkCustomWin()) {
      console.log('Custom level completed!');
    }
  }, [gameState]);

  return <QuantumChess />;
}
```

### Adding Custom Quantum Events

```tsx
import { QuantumEvent } from './games/QuantumChess/utils/quantumMechanics';

// Create custom quantum event
const customEvent: QuantumEvent = {
  type: 'interference',
  description: 'Massive wave interference detected!',
  affectedPieces: ['white-queen-0', 'black-queen-0'],
  probability: 0.8
};

// Apply to game state
setGameState(prev => ({
  ...prev,
  quantumEvents: [customEvent]
}));
```

## Styling Customization

### Custom Quantum Theme

```css
/* Override default quantum colors */
.quantum-chess {
  --primary-color: #00ff00;  /* Change from cyan */
  --secondary-color: #ff0000; /* Change from magenta */
  --bg-color: #000033;       /* Darker background */
}

/* Custom piece styling */
.chess-piece.white {
  color: #ffff00;  /* Yellow instead of white */
}

/* Custom quantum glow */
.board-square.high-quantum {
  box-shadow: 0 0 30px var(--primary-color);
}
```

### Custom Animations

```css
/* Add your own quantum animation */
@keyframes custom-quantum-effect {
  0% {
    transform: scale(1) rotate(0deg);
    filter: hue-rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    filter: hue-rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

.chess-piece.ghost {
  animation: custom-quantum-effect 3s infinite;
}
```

## Event Handling

### Custom Move Handler

```tsx
function GameWithCustomMoveHandling() {
  const { movePiece, selectedPiece } = useGameState();

  const handleCustomMove = (position: Position) => {
    // Log the move
    console.log('Moving piece to:', position);

    // Create superposition based on custom logic
    const shouldCreateSuperposition = Math.random() > 0.5;

    movePiece(position, shouldCreateSuperposition);

    // Custom post-move action
    playQuantumSound();
  };

  return (
    <Board
      onSquareClick={handleCustomMove}
      // ... other props
    />
  );
}
```

### Custom Measurement Handler

```tsx
import { collapseQuantumState } from './games/QuantumChess/utils/quantumMechanics';

function handleMeasurement(piece: Piece) {
  // Pre-measurement logging
  console.log('Measuring piece with states:', piece.quantumStates);

  const collapsed = collapseQuantumState(piece);

  // Post-measurement logging
  console.log('Collapsed to:', collapsed.quantumStates[0].position);

  // Update game state
  updatePiece(collapsed);

  // Custom visualization
  showMeasurementAnimation(collapsed);
}
```

## Hooks Usage Examples

### useQuantumLogic Hook

```tsx
import { useQuantumLogic } from './games/QuantumChess/hooks/useQuantumLogic';

function QuantumVisualizationDemo() {
  const {
    animations,
    visualizations,
    addAnimation,
    updateVisualizations,
    getQuantumIntensity
  } = useQuantumLogic();

  const handleSuperpositionCreated = (positions: Position[]) => {
    addAnimation('superposition', positions, 1500);
  };

  const handleTunneling = (position: Position) => {
    addAnimation('tunneling', [position], 2000);
  };

  useEffect(() => {
    updateVisualizations(gameState.pieces);
  }, [gameState.pieces]);

  return (
    <div>
      {animations.map(anim => (
        <div key={anim.id} className={`animation-${anim.type}`}>
          Quantum {anim.type} in progress...
        </div>
      ))}
    </div>
  );
}
```

### useGameState Hook Full Example

```tsx
function CompleteGameExample() {
  const {
    gameState,
    gameMode,
    currentLevel,
    selectedPiece,
    possibleMoves,
    achievements,
    gameOver,
    winner,
    aiDifficulty,
    selectPiece,
    movePiece,
    measurePiece,
    setGameMode,
    setLevel,
    setAIDifficulty,
    resetGame,
    undoMove
  } = useGameState();

  return (
    <div>
      <h2>Current Player: {gameState.currentPlayer}</h2>
      <p>Moves: {gameState.moveCount}</p>
      <p>Decoherence: {(gameState.decoherenceLevel * 100).toFixed(1)}%</p>

      <button onClick={() => setGameMode('vs-ai')}>VS AI</button>
      <button onClick={() => setAIDifficulty('quantum-master')}>
        Set Max Difficulty
      </button>
      <button onClick={resetGame}>Reset</button>
      <button onClick={undoMove}>Undo</button>

      <div>
        Achievements Unlocked: {achievements.filter(a => a.unlocked).length}
      </div>

      {gameOver && <h1>{winner} Wins!</h1>}
    </div>
  );
}
```

## Quantum Mechanics Functions Reference

### Core Functions

```tsx
// Superposition
const superposedPiece = createSuperposition(piece, [pos1, pos2, pos3]);

// Collapse
const collapsedPiece = collapseQuantumState(superposedPiece);

// Entanglement
const [piece1Entangled, piece2Entangled] = entanglePieces(piece1, piece2);

// Break entanglement
const freepiece = breakEntanglement(entangledPiece);

// Tunneling
const tunneledPiece = applyTunneling(piece, targetPosition);

// Decoherence
const decoherentPiece = applyDecoherence(piece, 0.1);

// Interference
const interferedPieces = applyInterference(pieces);

// Check validity
const isValid = isValidMove(piece, targetPosition, allPieces);

// Get moves
const moves = getPossibleMoves(piece, allPieces);

// Check game state
const inCheck = isInCheck('white', pieces);
```

### Probability Calculations

```tsx
import { normalizeQuantumStates, calculateAmplitude } from './utils/quantumMechanics';

// Normalize probabilities
const normalizedStates = normalizeQuantumStates([
  { position: pos1, probability: 0.3 },
  { position: pos2, probability: 0.5 },
  { position: pos3, probability: 0.1 }
]);

// Calculate quantum amplitude
const amplitude = calculateAmplitude(0.5); // Returns 0.707...
```

## Performance Tips

### Memoization

```tsx
import { useMemo } from 'react';

function OptimizedBoard({ pieces, ...props }) {
  const visualizations = useMemo(() => {
    return calculateVisualizations(pieces);
  }, [pieces]);

  return <Board visualizations={visualizations} {...props} />;
}
```

### Efficient Updates

```tsx
// Only update when necessary
useEffect(() => {
  if (gameState.pieces.length > 0) {
    updateVisualizations(gameState.pieces);
  }
}, [gameState.pieces.length]); // Not the entire array
```

## Testing Examples

### Unit Testing Quantum Functions

```tsx
import { createSuperposition, collapseQuantumState } from './utils/quantumMechanics';

describe('Quantum Mechanics', () => {
  test('createSuperposition distributes probability evenly', () => {
    const piece = createPiece();
    const positions = [pos1, pos2];
    const result = createSuperposition(piece, positions);

    expect(result.quantumStates).toHaveLength(2);
    expect(result.quantumStates[0].probability).toBeCloseTo(0.5);
    expect(result.quantumStates[1].probability).toBeCloseTo(0.5);
  });

  test('collapseQuantumState returns single state', () => {
    const superposed = createSuperposition(piece, [pos1, pos2]);
    const collapsed = collapseQuantumState(superposed);

    expect(collapsed.quantumStates).toHaveLength(1);
    expect(collapsed.quantumStates[0].probability).toBe(1.0);
  });
});
```

## Integration Examples

### With React Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuantumChess from './games/QuantumChess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quantum-chess" element={<QuantumChess />} />
        <Route path="/quantum-chess/tutorial" element={
          <QuantumChess initialMode="tutorial" />
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

### With State Management (Redux/Context)

```tsx
import { useContext } from 'react';
import { GameContext } from './context/GameContext';

function QuantumChessWithContext() {
  const { saveGame, loadGame } = useContext(GameContext);
  const { gameState } = useGameState();

  const handleSave = () => {
    saveGame({
      type: 'quantum-chess',
      state: gameState
    });
  };

  return (
    <div>
      <QuantumChess />
      <button onClick={handleSave}>Save Game</button>
    </div>
  );
}
```

## Debugging

### Quantum State Visualization

```tsx
function QuantumDebugger({ pieces }) {
  return (
    <div style={{ position: 'fixed', right: 0, top: 0, background: 'black' }}>
      <h3>Quantum States</h3>
      {pieces.map(piece => (
        <div key={piece.id}>
          <strong>{piece.id}</strong>
          {piece.quantumStates.map((state, i) => (
            <div key={i}>
              Position: ({state.position.row}, {state.position.col})
              Probability: {(state.probability * 100).toFixed(1)}%
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Event Logging

```tsx
useEffect(() => {
  console.log('Quantum Events:', gameState.quantumEvents);
  console.log('Decoherence Level:', gameState.decoherenceLevel);
  console.log('Current Player:', gameState.currentPlayer);
}, [gameState]);
```

---

For more information, see the [main README](./README.md).
