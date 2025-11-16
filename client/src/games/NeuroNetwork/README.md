# NeuroNetwork - Neural Network Puzzle Game

A scientifically-inspired puzzle game where players build neural pathways by connecting neurons and managing neurotransmitters.

## Features

### Core Gameplay
- **25 Progressive Levels** - Teaching neural network concepts from basic to advanced
- **3 Game Modes**:
  - Puzzle Mode: Solve connectivity challenges with constraints
  - Speed Mode: Complete networks under time pressure
  - Multiplayer Mode: Race against others (coming soon)

### Neuroscience Elements
- **Realistic Neural Mechanics**:
  - Action potentials and firing thresholds
  - Synaptic transmission with delays
  - Refractory periods
  - Signal summation
  - Synaptic plasticity

- **6 Neurotransmitters**:
  - Glutamate (Excitatory - increases signal strength)
  - GABA (Inhibitory - blocks signals)
  - Dopamine (Reward - bonus points)
  - Serotonin (Stabilizer - prevents signal decay)
  - Acetylcholine (Learning - enables plasticity)
  - Norepinephrine (Speed - faster transmission)

- **5 Neuron Disorders**:
  - Hyperexcitable (fires at 50% threshold)
  - Hypoactive (requires 150% threshold)
  - Leaky Membrane (25% signal loss)
  - Prolonged Refractory (2s cooldown)
  - Spontaneous Firing (random activation)

### Brain Regions
Levels are themed around different brain regions:
- **Cerebral Cortex** (Levels 1-5): Introduction to neural basics
- **Hippocampus** (Levels 6-10): Memory formation and plasticity
- **Cerebellum** (Levels 11-15): Motor control and timing
- **Amygdala** (Levels 16-20): Emotion and complex processing
- **Prefrontal Cortex** (Levels 21-25): Executive function and advanced challenges

### Visual Effects
- **Beautiful Neural Firing Animations**:
  - Particle trail effects for signal propagation
  - Neuron pulse effects on activation
  - Burst effects when neurons fire
  - Color-coded neurotransmitter signals
  - Brain region themed backgrounds

### Educational Features
- **Educational Tooltips**: Learn real neuroscience facts
- **Brain Region Information**: Detailed explanations of each brain area
- **Concept Introduction**: Each level teaches a specific neural concept
- **Progressive Difficulty**: Builds understanding step by step

## How to Play

### Basic Controls
1. **Create Synapses**: Drag from one neuron to another to create connections
2. **Fire Input Neurons**: Click on input neurons (green) to send signals
3. **Select Neurotransmitters**: Choose from available neurotransmitters before creating synapses
4. **Delete Synapses**: Click on your created synapses to remove them
5. **Run Simulation**: Start the simulation to see signals propagate

### Game Flow
1. Read the level objective and constraints
2. Plan your neural network connections
3. Create synapses between neurons
4. Assign neurotransmitters to optimize signal transmission
5. Start the simulation
6. Watch signals propagate and neurons fire
7. Complete the objective to advance

### Tips
- Pay attention to neuron thresholds - some need multiple inputs to fire
- Use GABA to block unwanted signals
- Glutamate strengthens weak signals
- Dopamine pathways give bonus points
- Watch out for neuron disorders - they change behavior
- Plan your network before using all available synapses

## Level Progression

### Beginner (Cortex)
- Level 1-5: Learn basic connections, thresholds, and neurotransmitters

### Intermediate (Hippocampus & Cerebellum)
- Level 6-15: Master memory formation, plasticity, and timing

### Advanced (Amygdala)
- Level 16-20: Handle complex networks with disorders and emotions

### Expert (Prefrontal Cortex)
- Level 21-25: Solve intricate puzzles requiring all concepts

## Technical Details

### Architecture
```
NeuroNetwork/
├── NeuroNetwork.tsx        # Main game component
├── components/
│   ├── Neuron.tsx          # Neuron visualization
│   ├── Synapse.tsx         # Synapse rendering
│   ├── SignalAnimation.tsx # Signal propagation effects
│   └── BrainRegion.tsx     # Brain region theming
├── hooks/
│   ├── useNeuralLogic.ts   # Game state and logic
│   └── useSignalPropagation.ts # Animation and effects
├── utils/
│   ├── neuralEngine.ts     # Neural network simulation
│   └── pathfinding.ts      # Path finding algorithms
└── data/
    ├── levels.ts           # Level definitions
    └── brainRegions.ts     # Brain region data
```

### Key Systems
- **Neural Engine**: Simulates realistic neural network behavior
- **Signal Propagation**: Calculates signal timing and effects
- **Pathfinding**: A* algorithm for optimal path detection
- **Constraint Validation**: Checks level completion requirements
- **Particle System**: Beautiful visual effects

## Educational Value

Players learn:
- How neurons communicate through electrical and chemical signals
- The role of different neurotransmitters
- How brain regions specialize for different functions
- Network topology and information flow
- The importance of excitatory/inhibitory balance
- Synaptic plasticity and learning
- Neural timing and synchronization
- How disorders affect neural function

## Future Enhancements

Planned features:
- Multiplayer racing mode
- Custom level editor
- Achievement system
- Leaderboards
- More brain regions (Thalamus, Basal Ganglia, etc.)
- Advanced visualizations (3D neurons)
- Save/load progress
- Mobile support

## Credits

Based on real neuroscience principles and research in:
- Neural network theory
- Neurotransmitter function
- Brain anatomy and physiology
- Synaptic plasticity
- Computational neuroscience
