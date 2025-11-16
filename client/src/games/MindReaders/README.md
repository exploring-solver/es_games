# 🧠 Mind Readers' Duel

A competitive telepathy game that challenges players to predict their opponent's choices using psychological patterns, Bayesian probability, and meta-gaming strategies.

## 🎮 Game Overview

Mind Readers' Duel is a 2-player competitive game where players simultaneously:
1. Choose a thought (number, color, symbol, or word)
2. Predict what their opponent will choose

Points are awarded for correct predictions. The game features advanced pattern recognition, adaptive AI, and deep psychological gameplay with multiple layers of strategy.

## ✨ Features

### Core Gameplay
- **15 Rounds** with increasing psychological complexity
- **4 Thought Categories**: Numbers, Colors, Symbols, Words
- **Dual-Choice Mechanics**: Make your choice + predict opponent's choice
- **Real-time Scoring** with immediate feedback

### Psychological Mechanics
- **Pattern Recognition**: Detects sequential, alternating, repetitive, random, and counter-predictive patterns
- **Bayesian Probability Engine**: Calculates prediction probabilities based on historical data
- **Entropy Analysis**: Measures randomness and predictability
- **Meta-Game Tracking**: Monitors counter-bluffing and strategic depth
- **Psychological Tells**: Random behavioral traits that influence AI decisions

### AI Opponent
- **4 Difficulty Levels**: Novice, Intermediate, Expert, Master
- **Adaptive Learning**: AI updates its opponent model based on your play patterns
- **Dynamic Personalities**: Each AI has unique psychological tells per game
- **Sophisticated Strategies**: Counter-bluffing, pattern breaking, mimicry, and more

### Analytics & Tracking
- **ELO Rating System**: Competitive ranking that adjusts based on performance
- **Accuracy Tracking**: Monitor prediction success rates
- **Streak Counter**: Track consecutive correct predictions
- **Pattern Evolution**: See how patterns develop over time
- **Replay Analysis**: Review every round with detailed statistics

### Visual Features
- **Bayesian Probability Display**: See likelihood percentages for each choice
- **Pattern Strength Visualization**: Color-coded pattern confidence
- **Real-time Suggestions**: AI-powered hints during gameplay
- **Meta-Game Dashboard**: Visualize predictability and counter-bluff levels
- **Animated Results**: Engaging reveal animations

## 🏗️ Architecture

### Directory Structure
```
MindReaders/
├── MindReaders.tsx          # Main game component
├── components/
│   ├── ThoughtDisplay.tsx   # Choice selection interface
│   ├── PredictionPanel.tsx  # Bayesian prediction UI
│   ├── PatternAnalysis.tsx  # Pattern visualization
│   └── ScoreBoard.tsx       # Score & stats display
├── hooks/
│   ├── usePatternDetection.ts  # Pattern analysis logic
│   └── usePsychologyAI.ts      # AI opponent management
├── utils/
│   ├── probabilityEngine.ts    # Bayesian calculations
│   └── aiPrediction.ts         # AI decision making
└── index.ts                 # Exports
```

### Key Components

#### ThoughtDisplay
Renders thought options with visual feedback for selections, predictions, and results.

**Props:**
- `category`: Type of thoughts (numbers/colors/symbols/words)
- `options`: Available choices
- `selectedValue`: Currently selected choice
- `predictedValue`: Predicted opponent choice
- `showPrediction`: Whether to highlight prediction
- `onSelect`: Selection callback

#### PredictionPanel
Displays Bayesian probabilities with reasoning and confidence levels.

**Props:**
- `predictions`: Array of probability calculations
- `selectedPrediction`: Current prediction
- `showReasoning`: Toggle detailed reasoning
- `onSelectPrediction`: Prediction callback

#### PatternAnalysis
Visualizes detected patterns, entropy, and meta-game statistics.

**Props:**
- `patterns`: Detected pattern strengths
- `entropy`: Randomness measure
- `metaStats`: Predictability and counter-bluff metrics
- `recommendation`: Strategic advice

#### ScoreBoard
Shows scores, ELO ratings, accuracy, and streaks for both players.

**Props:**
- `player1/player2`: Player statistics
- `currentRound/totalRounds`: Game progress
- `timeRemaining`: Optional timer
- `isGameOver/winner`: End game state

### Hooks

#### usePatternDetection
Provides real-time pattern analysis and strategic recommendations.

**Returns:**
- `analyzePatterns()`: Detect patterns in player history
- `getRealtimeSuggestion()`: Get strategic advice
- `calculateWinProbability()`: Prediction success likelihood
- `detectBluffAttempt()`: Identify potential bluffs
- `analyzeMetaGame()`: Calculate meta-game metrics

#### usePsychologyAI
Manages AI opponent with adaptive learning.

**Returns:**
- `aiState`: Current AI configuration
- `makeMove()`: Generate AI choice and prediction
- `processResult()`: Update AI based on round outcome
- `getHint()`: Get AI insight
- `resetAI()`: Start fresh AI session
- `aiStats`: Performance statistics

### Utilities

#### probabilityEngine.ts
Implements Bayesian probability calculations and pattern detection.

**Key Functions:**
- `calculateBayesianProbability()`: Compute choice probabilities
- `detectPatterns()`: Identify behavioral patterns
- `calculateEntropy()`: Measure randomness
- `predictCounterBluff()`: Account for meta-strategies

#### aiPrediction.ts
Manages AI decision-making with psychological modeling.

**Key Functions:**
- `initializeAI()`: Create AI with personality
- `makeAIDecision()`: Generate choice and prediction
- `updateOpponentModel()`: Adaptive learning
- `generateRandomTells()`: Create unique AI traits

## 🎯 Psychological Tells

Each game, the AI receives random psychological tells that influence its behavior:

- **favors_high_numbers**: Prefers higher values
- **avoids_repetition**: Avoids recent choices
- **pattern_follower**: Continues established patterns
- **contrarian**: Chooses less common options
- **gambler**: Takes risks with extreme choices
- **conservative**: Prefers safe, middle values
- **mimics_opponent**: Mirrors player behavior
- **anti_mimics**: Actively avoids player choices

## 🧮 Pattern Types

The game detects five pattern types:

1. **Sequential** (A→B→C): Progressive sequences
2. **Alternating** (A→B→A): Back-and-forth patterns
3. **Repetitive** (A→A→A): Consecutive same choices
4. **Random** (High entropy): No clear pattern
5. **Counter-Predictive**: Avoiding recent choices

## 📊 Scoring System

- **1 point** per correct prediction
- **ELO adjustment** based on opponent strength
- **Streak bonuses** (psychological pressure)
- **Tie-breaker**: Higher accuracy wins

## 🎮 How to Play

1. **Select Difficulty**: Choose AI level (Novice to Master)
2. **Pick Category**: Numbers, Colors, Symbols, or Words
3. **Each Round**:
   - Select your choice
   - Predict opponent's choice
   - Submit round
   - View results
4. **Strategy Tips**:
   - Watch for patterns in opponent's choices
   - Use Bayesian probabilities as guidance
   - Consider meta-gaming: "What does my opponent think I'll choose?"
   - Balance predictability with randomness
   - Use counter-bluffing at higher levels

## 🔧 Usage

```tsx
import MindReaders from './games/MindReaders';

function App() {
  return <MindReaders />;
}
```

## 🎨 Customization

### Adding New Thought Categories

Edit `ThoughtDisplay.tsx`:

```tsx
case 'custom':
  return [
    { value: 'option1', display: 'Option 1', category },
    // Add more options...
  ];
```

### Adjusting AI Difficulty

Modify `aiPrediction.ts`:

```tsx
function getBaseConfidence(personality: AIPersonality): number {
  return {
    custom: 0.85, // Add custom difficulty
    // ...
  }[personality];
}
```

## 🧪 Advanced Features

### Meta-Gaming Levels

The game tracks three levels of strategic thinking:

1. **Level 0**: Basic choices without pattern awareness
2. **Level 1**: Pattern recognition and exploitation
3. **Level 2**: Counter-bluffing (predicting opponent's predictions)
4. **Level 3+**: Recursive mind-reading (predicting counter-predictions)

### Adaptive Difficulty

The AI automatically adjusts its sophistication based on:
- Player's pattern awareness
- Prediction accuracy
- Counter-bluff frequency
- Round progression (gets smarter over time)

## 🏆 Tournament Mode (Future Enhancement)

Planned features:
- Daily tournaments with global leaderboards
- Best-of-3/5/7 match formats
- Tournament brackets
- Season rankings
- Achievement system

## 🔮 Future Enhancements

- [ ] Multiplayer (2-player PvP)
- [ ] Custom thought categories
- [ ] Replay sharing
- [ ] Advanced statistics dashboard
- [ ] Machine learning integration
- [ ] Voice/gesture input
- [ ] Accessibility features
- [ ] Mobile optimization

## 📝 Technical Notes

### Performance
- Memoized pattern calculations for efficiency
- Cached analysis results
- Optimized re-renders with React hooks

### Accessibility
- Keyboard navigation support
- Color-blind friendly palette (planned)
- Screen reader compatibility (planned)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for tablets/desktop

## 🤝 Contributing

Ideas for contributions:
- New thought categories
- Additional pattern types
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements
- Tournament features

## 📄 License

Part of the ES Games collection.

---

**Built with**: React, TypeScript, Advanced Psychology, Bayesian Statistics, Game Theory

**Play Responsibly**: This game is designed to be psychologically engaging. Take breaks between sessions!
