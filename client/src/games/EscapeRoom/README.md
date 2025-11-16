# Escape Room: Lab Disaster

A multiplayer cooperative escape room game featuring science-based puzzles and real-time collaboration.

## Overview

Work together with 2-4 players to solve challenging science puzzles across 15 themed laboratory rooms before time runs out. Choose from three disaster scenarios, each with unique objectives and challenges.

## Features

### Core Gameplay
- **15 Themed Lab Rooms**: Chemistry, Physics, Biology, and Mixed science labs
- **2-4 Player Co-op**: Real-time multiplayer with voice chat support
- **3 Disaster Scenarios**:
  - ☢️ Radiation Leak (Hard, 60 minutes)
  - 🦠 Virus Outbreak (Extreme, 45 minutes)
  - 🔥 Reactor Meltdown (Hard, 50 minutes)

### Puzzle System
- **Multiple Puzzle Types**: Chemistry, Physics, Biology, Math, Logic, Pattern Recognition
- **Random Generation**: Each playthrough generates unique puzzles for replayability
- **Educational Content**: Learn real science while solving puzzles
- **Difficulty Scaling**: Easy, Medium, and Hard puzzles
- **Hint System**: 3 hints per puzzle (with score penalty)
- **Multi-Player Puzzles**: Some puzzles require 2+ players to solve

### Progression
- **Item Collection**: Find and combine items to unlock new areas
- **Room Unlocking**: Solve required puzzles to access connected rooms
- **Progress Tracking**: Visual indicators for room completion
- **Achievement System**: Unlock achievements for speed runs, no-hint completions, etc.
- **Score System**: Earn points based on speed, accuracy, and teamwork

### Multiplayer Features
- **Real-time Synchronization**: See other players moving between rooms
- **Shared Inventory**: Collected items are accessible to all team members
- **Voice Chat Indicators**: See who's talking with microphone indicators
- **Team Coordination**: Some puzzles require simultaneous actions
- **Player Status**: Track team members' locations and readiness

## File Structure

```
EscapeRoom/
├── EscapeRoom.tsx              # Main game component
├── components/
│   ├── Room.tsx                # 3D room view with interactive objects
│   ├── Puzzle.tsx              # Puzzle interface with timer and hints
│   ├── Inventory.tsx           # Item management and combination
│   ├── Timer.tsx               # Countdown timer with disaster warnings
│   └── CoopIndicators.tsx      # Multiplayer player status display
├── hooks/
│   ├── usePuzzleGenerator.ts   # Puzzle generation and solving logic
│   └── useCoopSync.ts          # Multiplayer synchronization
├── utils/
│   ├── puzzleLogic.ts          # Puzzle validation and scoring
│   └── roomGeneration.ts       # Room progression and path generation
├── data/
│   ├── puzzles.ts              # Puzzle definitions and templates
│   └── rooms.ts                # Room layouts and disaster scenarios
└── README.md                   # This file
```

## Game Components

### 1. Main Menu
- Select from 3 disaster scenarios
- View difficulty and time limits
- See game features

### 2. Lobby
- Wait for 2-4 players to join
- Check player readiness
- Start game when all players are ready

### 3. Gameplay
- **Timer**: Shows time remaining and disaster info
- **Room View**: Interactive 3D room with objects and other players
- **Inventory**: Manage collected items and combinations
- **Coop Panel**: See team status and voice chat indicators
- **Puzzle Interface**: Solve active puzzles with hints

### 4. End Screen
- Victory or defeat based on objective completion
- Final score calculation
- Achievement unlocks
- Return to menu

## Puzzle Types

### Chemistry Puzzles
- pH balancing
- Molecular formulas
- Chemical reactions
- Compound identification
- **Example**: Mix acids and bases to achieve pH 7

### Physics Puzzles
- Circuit calculations (Ohm's Law)
- Laser reflection and optics
- Pressure equilibrium
- Projectile motion
- **Example**: Calculate resistance using V=IR

### Biology Puzzles
- DNA sequence completion
- Cell culture calculations
- Protein synthesis
- Genetic code translation
- **Example**: Find complementary DNA strand

### Logic & Math Puzzles
- Number sequences
- Pattern recognition
- Algebraic equations
- Exponential decay
- **Example**: Solve radioactive half-life problems

## Room Themes

1. **Main Entrance Hall** (Mixed) - Starting point
2. **Chemistry Lab Alpha** (Chemistry) - Basic chemistry
3. **Organic Chemistry Lab** (Chemistry) - Advanced synthesis
4. **Hazardous Materials Storage** (Chemistry) - Dangerous chemicals
5. **Quantum Mechanics Lab** (Physics) - Lasers and quantum computers
6. **Particle Accelerator Chamber** (Physics) - Radiation and particles
7. **Electromagnetic Research Lab** (Physics) - Circuits and electricity
8. **Virology Containment Lab** (Biology) - Virus research
9. **Genetics Laboratory** (Biology) - DNA and gene editing
10. **Stem Cell Research Lab** (Biology) - Cell cultivation
11. **Biochemistry Integration Lab** (Mixed) - Chemistry meets biology
12. **Nanotechnology Lab** (Mixed) - Atomic-scale research
13. **Main Control Center** (Mixed) - Facility management
14. **Reactor Core Chamber** (Physics) - Fusion reactor
15. **Emergency Exit & Decontamination** (Mixed) - Final escape

## Disaster Scenarios

### Radiation Leak
- **Time**: 60 minutes
- **Difficulty**: Hard
- **Objective**: Seal radiation leak in Particle Accelerator
- **Special**: Radiation levels increase over time
- **Required Rooms**: Particle Accelerator, Hazmat Storage, Control Center

### Virus Outbreak
- **Time**: 45 minutes
- **Difficulty**: Extreme
- **Objective**: Synthesize antiviral cure
- **Special**: Infection spreads throughout facility
- **Required Rooms**: Virology Lab, Genetics Lab, Stem Cell Lab, Biochemistry, Control Center

### Reactor Meltdown
- **Time**: 50 minutes
- **Difficulty**: Hard
- **Objective**: Restore cooling and shutdown reactor
- **Special**: Temperature increases over time
- **Required Rooms**: Reactor Core, Particle Accelerator, Control Center

## Achievements

- **SPEED_DEMON**: Complete in under 50% of time limit
- **LIGHTNING_FAST**: Complete in under 33% of time limit
- **GENIUS**: Complete without using any hints
- **TEAM_PLAYER**: Complete with 3+ players
- **FULL_SQUAD**: Complete with 4 players
- **[DISASTER]_SURVIVOR**: Complete specific disaster scenario

## Scoring System

### Base Score
- Easy puzzle: 100 points × difficulty multiplier (1.0)
- Medium puzzle: 100 points × difficulty multiplier (1.5)
- Hard puzzle: 100 points × difficulty multiplier (2.0)

### Bonuses
- Time bonus: Up to 500 points based on time remaining
- No hints: +50 points per puzzle
- Speed solve: +50 points if solved quickly
- Cooperative bonus: +25 points per required player

### Penalties
- Hint used: -10 points per hint
- Wrong attempt: -5 points per attempt

### Final Score Multiplier
- Normal difficulty: 1.0x
- Hard difficulty: 1.5x
- Extreme difficulty: 2.0x

## Usage Example

```tsx
import { EscapeRoom } from './games/EscapeRoom/EscapeRoom';

function App() {
  return (
    <EscapeRoom
      gameId="my-game-session"
      playerId="player-123"
      playerName="Alice"
    />
  );
}
```

## Technical Details

### State Management
- React hooks for local state
- Custom hooks for puzzle generation and multiplayer sync
- WebSocket for real-time communication

### Puzzle Generation
- Template-based random puzzle generation
- Seeded randomization for consistency
- Difficulty-based puzzle selection
- Type filtering by room theme

### Room Progression
- Graph-based room connectivity
- Requirement checking (items, puzzles solved)
- Progress tracking per room
- Dynamic unlocking system

### Multiplayer
- WebSocket-based real-time sync
- Player position broadcasting
- Shared inventory system
- Puzzle solve notifications
- Voice chat indicators
- Reconnection support

## Educational Value

Each puzzle includes educational content explaining the science:
- **Chemistry**: pH levels, molecular formulas, reactions
- **Physics**: Ohm's Law, light reflection, gas laws
- **Biology**: DNA structure, cell growth, protein synthesis
- **Math**: Exponential decay, algebra, sequences

## Performance Considerations

- Efficient puzzle validation
- Optimized room rendering
- Debounced position updates
- Lazy loading of puzzle content
- Connection pooling for multiplayer

## Future Enhancements

- [ ] Additional disaster scenarios
- [ ] More puzzle types (geology, astronomy, etc.)
- [ ] Custom room creator
- [ ] Leaderboards
- [ ] Replay system
- [ ] Puzzle difficulty adjustment based on player skill
- [ ] Tutorial mode
- [ ] Mobile support

## Credits

- Puzzle designs inspired by real scientific principles
- Educational content sourced from standard science curricula
- Multiplayer architecture based on WebSocket best practices

---

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**License**: MIT
