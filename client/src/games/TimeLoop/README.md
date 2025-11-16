# Time Loop Strategist

A mind-bending strategy game where you compete against your past self across multiple timelines. Navigate paradoxes, manipulate causality, and master the flow of time itself.

## Features

### Core Mechanics
- **Loop Recording**: Every action you take is recorded and replayed in future loops
- **Ghost Playback**: See your past selves moving through the timeline
- **Multiple Timelines**: Branch and merge timelines to create complex strategies
- **Paradox System**: Detect and resolve temporal paradoxes before they collapse the timeline
- **Resource Gathering**: Collect energy, matter, and information across time
- **Causality Chains**: Your actions create cascading effects through time

### Game Modes
- **Single Player**: Master time manipulation solo
- **4-Player Mode**: Compete with friends across parallel timelines
- **20 Unique Scenarios**: Each with different physics concepts and challenges

### Scientific Concepts Explored
1. **Grandfather Paradox** - Can you prevent your own existence?
2. **Bootstrap Paradox** - Information loops with no origin
3. **Butterfly Effect** - Small changes, massive consequences
4. **Novikov Self-Consistency** - The universe prevents paradoxes
5. **Many-Worlds Interpretation** - Every choice creates a new timeline
6. **Predestination Paradox** - You cause what you tried to prevent
7. **Time Dilation** - Moving clocks run slower
8. **Quantum Entanglement** - Spooky action at a temporal distance
9. **Entropy Reversal** - Fighting the arrow of time
10. **Tachyon Communication** - Messages that arrive before they're sent
11. **Causal Diamonds** - Limited by light cones
12. **Wormhole Networks** - Shortcuts through spacetime
13. **Gödel's Rotating Universe** - Natural closed timelike curves
14. **Retrocausality** - The future affects the past
15. **Time Crystals** - Structures that repeat in time
16. **Chronology Protection** - Can time travel be prevented?
17. **Delayed Choice** - Future choices determine past outcomes
18. **Multiverse Merger** - Combining parallel universes
19. **Causality Cascades** - Complex causal networks
20. **Perfect Loops** - Zero-paradox stable time loops

## Controls

### Player 1
- **W/A/S/D**: Move
- **Space**: Pause/Resume
- **R**: Reset current loop
- **B**: Branch timeline

### Player 2
- **Arrow Keys**: Move

## Game Structure

```
TimeLoop/
├── TimeLoop.tsx              # Main game component
├── components/
│   ├── Timeline.tsx          # Visual timeline with events and loops
│   ├── ParadoxIndicator.tsx  # Shows paradox status and severity
│   ├── LoopRecorder.tsx      # Displays recorded loops
│   └── CausalityChain.tsx    # Visualizes cause-effect relationships
├── hooks/
│   ├── useTimeTravel.ts      # Time manipulation logic
│   └── useParadoxLogic.ts    # Paradox detection and resolution
├── utils/
│   ├── timeEngine.ts         # Core time travel mechanics
│   └── paradoxResolver.ts    # Paradox detection algorithms
└── data/
    ├── scenarios.ts          # 20 unique scenarios
    └── timeEvents.ts         # Random time anomalies
```

## Gameplay Loop

1. **Start Timeline**: Choose a scenario and begin your first loop
2. **Explore & Collect**: Move through the game world collecting resources
3. **Record Actions**: Every move is recorded for future loops
4. **Complete Loop**: Finish the timeline to record your actions
5. **New Loop Begins**: Your past self (ghost) replays your actions
6. **Compete/Cooperate**: Work with or against your past selves
7. **Manage Paradoxes**: Avoid creating too many paradoxes or the timeline collapses
8. **Win Condition**: Complete all objectives while maintaining timeline stability

## Advanced Strategies

### Timeline Branching
Create parallel timelines to explore different strategies:
- Press **B** to branch the current timeline
- Each branch maintains its own state
- Merge compatible timelines to consolidate resources

### Paradox Management
Keep paradox severity below the tolerance threshold:
- **Avoid Self-Collision**: Don't occupy the same space-time as your past self
- **Maintain Causality**: Don't destroy resources you already collected
- **Information Consistency**: Don't create bootstrap paradoxes
- **Resolve Paradoxes**: Use the resolution system to fix minor paradoxes

### Resource Optimization
Maximize resource collection across loops:
- **Energy**: Powers time travel and timeline operations
- **Matter**: Required for timeline branching
- **Information**: Helps predict and prevent paradoxes

### Butterfly Effect Exploitation
Small changes can have massive impacts:
- Early-loop actions cascade through time
- Use causality chains to create chain reactions
- Monitor butterfly effects to predict outcomes

## Visualization Features

### Timeline View
- Shows all recorded loops as horizontal bars
- Action markers indicate significant events
- Current time indicator with glow effect
- Event regions show temporal anomalies
- Clickable timeline for seeking

### Paradox Indicator
- Real-time paradox severity meter
- Color-coded warnings (green → yellow → red)
- List of active paradoxes with descriptions
- Resolution options for each paradox
- Timeline stability status

### Loop Recorder
- Expandable loop history
- Quality ratings (Perfect/Good/Unstable/Chaotic)
- Resource snapshots for each loop
- Action timeline visualization
- Playback and delete options

### Causality Chain
- Interactive node graph of cause-effect relationships
- Direct, indirect, and retrocausal links
- Butterfly effect pulse animations
- Hover details for each action
- Visual strength indicators

## Difficulty Levels

- **Easy**: High paradox tolerance, simple objectives
- **Medium**: Moderate tolerance, complex causality
- **Hard**: Low tolerance, multiple timelines required
- **Expert**: Zero tolerance, perfect execution needed

## Tips & Tricks

1. **Start Simple**: Master basic loops before attempting complex strategies
2. **Plan Ahead**: Think several loops in advance
3. **Watch Your Ghosts**: Learn from your past mistakes
4. **Resource Balance**: Don't neglect any resource type
5. **Timeline Management**: Too many branches can be overwhelming
6. **Paradox Prevention**: Prevention is easier than resolution
7. **Event Timing**: Use temporal events to your advantage
8. **Causality Awareness**: Every action has consequences
9. **Speed Control**: Use playback speed to analyze complex situations
10. **Save States**: Use loop recording as checkpoints

## Technical Details

### Time Engine
- 60 FPS timeline updates
- Adjustable playback speed (0.1x - 5.0x)
- Accurate action recording and playback
- Timeline branching and merging
- Stability calculations
- Event system integration

### Paradox Detection
- Grandfather paradox detection
- Bootstrap loop identification
- Temporal collision detection
- Information duplication tracking
- Causality violation analysis
- Real-time severity calculation

### Performance
- Optimized canvas rendering
- Efficient action storage
- Smart ghost culling
- Event pooling
- Timeline compression

## Future Enhancements

Potential additions:
- Campaign mode with story
- Time machine upgrades
- Custom scenario editor
- Online multiplayer
- Leaderboards
- Achievement system
- More physics concepts
- Advanced visualizations

## Credits

Built with:
- React + TypeScript
- Canvas API for rendering
- Custom time travel engine
- Physics-based paradox detection

Inspired by:
- Time travel physics
- Braid
- The Stanley Parable
- Primer (film)
- Scientific time travel theories

## License

Part of the ES Games collection.

---

**Remember**: In time travel, every action matters. Your past, present, and future are all happening simultaneously. Choose wisely.
