# Physics Puzzle Relay

A team-based physics puzzle game where 2-4 players take turns solving interconnected physics challenges. Each player's actions affect the next player's puzzle through relay effects, creating a unique collaborative experience.

## Features

### Game Modes
- **Relay Mode**: 2-4 players take turns, with each player's performance affecting the next
- **Solo Mode**: Practice individual puzzles
- **Time Attack**: Race against the clock
- **Rube Goldberg**: Build complex chain reaction machines

### Physics Simulation
- Powered by Matter.js for realistic 2D physics
- Real-time force vector visualization
- Accurate modeling of:
  - Gravity and projectile motion
  - Momentum and collisions (elastic and inelastic)
  - Friction (static and kinetic)
  - Tension forces and constraints
  - Energy conservation (kinetic and potential)
  - Centripetal forces

### Educational Content
- 30 levels covering core physics concepts
- Educational explanations for each concept
- Real-world examples and fun facts
- Formula visualization
- Interactive learning through gameplay

### Physics Concepts Covered
1. **Gravity**: Basic gravity, projectile motion
2. **Momentum**: Conservation, elastic collisions, impulse
3. **Friction**: Static and kinetic friction
4. **Waves**: Interference and resonance
5. **Energy**: Potential, kinetic, conservation
6. **Forces**: Tension, normal force, centripetal force

### Relay Effects
Previous players' performance affects the next player:
- **Gravity Modifier**: Increased/decreased gravity
- **Friction Modifier**: More/less surface friction
- **Wind Force**: Environmental forces
- **Mass Modifier**: Heavier/lighter objects
- **Time Pressure**: Time constraints

### Game Objects
- **Ball**: Rolling spheres with customizable properties
- **Box**: Rectangular blocks for obstacles and goals
- **Platform**: Static surfaces and ramps
- **Ramp**: Angled surfaces for launching
- **Pendulum**: Swinging objects for energy transfer
- **Spring**: Elastic launch pads
- **Domino**: Chain reaction triggers
- **Lever**: Mechanical advantage tools
- **Wheel**: Rolling objects

## File Structure

```
PhysicsPuzzle/
├── PhysicsPuzzle.tsx          # Main game component
├── index.ts                    # Exports
├── README.md                   # Documentation
├── components/
│   ├── PuzzleCanvas.tsx       # Canvas renderer with Matter.js visualization
│   ├── PhysicsObject.tsx      # Object palette and info displays
│   ├── ForceVisualizer.tsx    # Force vector visualization
│   └── RelayProgress.tsx      # Relay tracking and stats
├── hooks/
│   ├── usePhysicsEngine.ts    # Physics simulation hook
│   └── useRelayLogic.ts       # Relay game logic hook
├── utils/
│   ├── physicsSimulation.ts   # Matter.js wrapper and physics utilities
│   └── puzzleGenerator.ts     # Procedural puzzle generation
└── data/
    ├── puzzles.ts             # 30 pre-designed puzzle levels
    └── physicsScenarios.ts    # Physics concepts and templates
```

## How to Play

### Basic Gameplay
1. **Select a Game Mode** from the main menu
2. **Choose Settings**: Number of players (relay mode), difficulty, level
3. **Start the Game** to enter the puzzle view

### Building Your Solution
1. **Study the Objective**: Read what needs to be accomplished
2. **Select Objects**: Click on objects from the right panel
3. **Place Objects**: Click on the canvas to place them
4. **Run Simulation**: Press START to see your solution in action
5. **Adjust**: STOP and RESET to try again

### Controls
- **START**: Begin physics simulation
- **STOP**: Pause simulation
- **RESET**: Clear placed objects and restart
- **Click**: Place selected object
- **Checkboxes**: Toggle force vectors and velocity display

### Relay Mode
1. Players take turns solving puzzles
2. Each player places objects and runs the simulation
3. Success/failure affects the next player's puzzle
4. Team wins when all players complete their puzzles
5. Score based on efficiency (objects used) and time

## Scoring

### Points Awarded
- **Base Score**: 1000 points for completion
- **Efficiency Bonus**: 200 points per object under par
- **Time Bonus**: 10 points per second under 60s
- **Perfect Run**: Additional bonus for matching par exactly

### Relay Scoring
- Individual scores combine for team total
- Efficiency rating: Total score / Objects used
- Statistics tracked: Average time, best time, attempts

## Physics Concepts

### Gravity (Levels 1-5)
- Understanding gravitational acceleration (9.8 m/s²)
- Projectile motion and parabolic trajectories
- Optimal launch angles (45° for maximum range)

### Momentum (Levels 6-10)
- Conservation of momentum in collisions
- Elastic vs inelastic collisions
- Impulse and force over time

### Friction (Levels 11-15)
- Static friction threshold
- Kinetic friction in motion
- Surface properties and coefficients

### Energy (Levels 16-20)
- Gravitational potential energy (PE = mgh)
- Kinetic energy (KE = ½mv²)
- Conservation and transformation

### Forces (Levels 21-25)
- Normal force and support
- Tension in cables and ropes
- Centripetal force in circular motion

### Advanced (Levels 26-30)
- Combined concepts
- Complex machinery
- Resonance and wave mechanics

## Tips and Strategies

### General Tips
- Start simple - use fewer objects when possible
- Study the hint system for guidance
- Use the force visualizer to understand interactions
- Practice makes perfect - retry levels to improve

### Relay Strategy
- Communicate with teammates about approaches
- Balance speed and accuracy
- Manage relay effects strategically
- Learn from previous players' solutions

### Rube Goldberg Mode
- Plan the entire chain before placing objects
- Test sections individually
- Use energy conservation to maintain momentum
- Create aesthetic and functional designs

## Educational Value

### Learning Objectives
- Understand fundamental physics principles
- Apply mathematical formulas to real scenarios
- Develop problem-solving skills
- Learn through experimentation and iteration

### Real-World Applications
- Engineering design
- Mechanical systems
- Sports and athletics
- Architecture and construction
- Space exploration

## Technical Details

### Physics Engine
- **Library**: Matter.js 0.19.0
- **Update Rate**: 60 FPS
- **Gravity**: Customizable (default 9.8 m/s²)
- **Collision Detection**: Continuous
- **Constraints**: Ropes, hinges, springs

### Performance
- Optimized rendering with canvas
- Efficient collision detection
- State management with React hooks
- Smooth 60 FPS gameplay

### Accessibility
- Clear visual feedback
- Educational tooltips
- Adjustable difficulty
- Colorblind-friendly palette

## Future Enhancements

### Potential Features
- Level editor for custom puzzles
- Online multiplayer relay mode
- Replay system to watch solutions
- Leaderboards and achievements
- More physics concepts (electromagnetism, fluids)
- VR mode for immersive physics

### Community Features
- Share puzzle solutions
- Challenge friends with custom levels
- Community puzzle library
- Video replay sharing

## Credits

Built with:
- React 18
- TypeScript
- Matter.js (physics engine)
- Canvas API (rendering)

Physics concepts based on:
- Classical mechanics
- Newtonian physics
- Real-world applications

## License

Part of the Educational Science Games Platform
