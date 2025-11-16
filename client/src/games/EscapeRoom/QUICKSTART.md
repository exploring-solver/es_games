# Escape Room: Lab Disaster - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Basic Import and Usage

```tsx
import EscapeRoom from './games/EscapeRoom';

function App() {
  return <EscapeRoom />;
}
```

That's it! The game will handle everything else.

### 2. Custom Configuration

```tsx
import EscapeRoom from './games/EscapeRoom';

function App() {
  const gameId = `session_${Date.now()}`;
  const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
  const playerName = 'Alice';

  return (
    <EscapeRoom
      gameId={gameId}
      playerId={playerId}
      playerName={playerName}
    />
  );
}
```

## Game Flow

1. **Menu Screen**: Choose disaster scenario
   - ☢️ Radiation Leak
   - 🦠 Virus Outbreak
   - 🔥 Reactor Meltdown

2. **Lobby**: Wait for players (2-4 required)

3. **Gameplay**:
   - Click objects in rooms to interact
   - Solve puzzles to progress
   - Collect items and combine them
   - Move between rooms
   - Work together with team

4. **End Screen**: Victory or defeat

## Controls

### Room Navigation
- **Click objects** to interact with them
- **Click doors** (when unlocked) to move to other rooms
- **View timer** at top of screen
- **Check team status** in top-right panel

### Puzzle Solving
- **Type answer** in the input field
- **Click Submit** to check solution
- **Click Hint** for help (max 3 hints)
- **Close** to exit puzzle without solving

### Inventory
- **Click backpack icon** (bottom-right) to open inventory
- **Click items** to select them
- **Click Combine** to merge selected items
- **View item details** by hovering

### Multiplayer
- **Toggle voice** using microphone button
- **See teammates** as colored avatars in rooms
- **Track progress** in coop indicators panel

## Puzzle Examples

### Chemistry: pH Balance
```
Question: Mix acids and bases to achieve pH 7
Hint 1: Red litmus = acidic, Blue litmus = basic
Answer: pH7
```

### Physics: Ohm's Law
```
Question: Calculate resistance: V=12V, I=2A
Hint 1: Use V = I × R
Answer: 6
```

### Biology: DNA Complement
```
Question: Complete strand: ATGC-TAGC-????
Hint 1: A pairs with T, G pairs with C
Answer: ATCG
```

## Tips for Success

### Time Management
- Start with easier puzzles in early rooms
- Use hints strategically (they reduce score)
- Keep an eye on the timer
- Coordinate with team to solve simultaneously

### Team Coordination
- Split up to explore different rooms
- Share items through inventory
- Some puzzles need 2+ players
- Communicate puzzle solutions

### Item Management
- Collect all items you find
- Try combining related items
- Some items unlock new rooms
- Check inventory regularly

### Scoring Strategy
- Solve puzzles quickly for time bonus
- Avoid using hints (+50 points per puzzle)
- Minimize wrong attempts (-5 per attempt)
- Complete all objectives for win bonus

## Disaster-Specific Tips

### ☢️ Radiation Leak (60 min, Hard)
- Focus on Physics and Chemistry rooms
- Get radiation shielding items early
- Objective rooms: Particle Accelerator, Hazmat Storage, Control Center
- Radiation increases over time

### 🦠 Virus Outbreak (45 min, Extreme)
- Biology puzzles are critical
- Collect antibody samples
- More rooms to complete than other scenarios
- Time pressure is intense

### 🔥 Reactor Meltdown (50 min, Hard)
- Physics-heavy scenario
- Temperature increases over time
- Focus on cooling system puzzles
- Coordinate cooling and shutdown simultaneously

## Common Issues

### "Cannot access this room"
- Solve more puzzles in current room
- Check if you have required items
- Some rooms need specific keys

### "Puzzle requires X players"
- Wait for teammates to join
- Some puzzles are multi-player only
- Coordinate with team

### "These items cannot be combined"
- Not all items combine
- Try different combinations
- Check item descriptions for clues

## Advanced Features

### Achievement Hunting
- **SPEED_DEMON**: Beat time limit by 50%
- **GENIUS**: No hints used
- **FULL_SQUAD**: 4 players
- See README.md for full list

### Score Optimization
1. Speed: Complete quickly
2. Accuracy: Minimize wrong attempts
3. Efficiency: Don't use hints
4. Teamwork: Multi-player bonuses

### Puzzle Generation
- Each playthrough has different puzzles
- Seed-based randomization
- Difficulty scales with room
- Educational content always included

## Troubleshooting

### Game won't start
- Ensure 2+ players in lobby
- All players must be ready
- Check WebSocket connection

### Disconnection issues
- Game auto-reconnects
- Progress is saved
- Other players can continue

### Performance issues
- Close unused browser tabs
- Reduce number of players
- Check network connection

## Next Steps

1. **Read README.md** for full documentation
2. **Explore code** in `/components`, `/hooks`, `/utils`
3. **Customize puzzles** in `/data/puzzles.ts`
4. **Add rooms** in `/data/rooms.ts`
5. **Extend features** using provided utilities

## API Reference

### Main Component Props
```typescript
interface EscapeRoomProps {
  gameId?: string;      // Unique game session ID
  playerId?: string;    // Unique player ID
  playerName?: string;  // Display name
}
```

### Game States
- `menu`: Main menu
- `lobby`: Waiting for players
- `playing`: Active gameplay
- `paused`: Game paused
- `won`: Victory screen
- `lost`: Defeat screen

### Events
- `onMessage`: Multiplayer message received
- `onPlayerJoin`: Player joined
- `onPlayerLeave`: Player left
- `onTimeUp`: Timer expired

## Support

For more information:
- See **README.md** for full documentation
- Check **source code** comments
- Review **data files** for examples

Happy escaping! 🧪🔬🚪
