# Science Quiz Showdown 🧪⚛️

A fast-paced, multiplayer science trivia game featuring 500+ questions across 10 scientific categories with adaptive difficulty, power-ups, and competitive gameplay.

## Features

### Game Modes

1. **Single Player** 👤
   - Practice mode with adaptive difficulty
   - Earn coins and unlock power-ups
   - Track your skill progression
   - Customize quiz length and categories

2. **Multiplayer** 👥
   - Compete with up to 4 players
   - Real-time leaderboard
   - Live answer tracking
   - Player stats and streaks

3. **Daily Challenge** 📅
   - New questions every day
   - Consistent challenge for all players
   - Compare scores with global leaderboard
   - Special rewards for top performers

4. **Tournament Mode** 🏆
   - Bracket-style competition
   - Elimination rounds
   - Progressive difficulty
   - Crown the champion

### Categories

- **Physics** ⚛️ - Forces, energy, quantum mechanics
- **Chemistry** 🧪 - Elements, reactions, molecular structure
- **Biology** 🧬 - Cells, genetics, organisms
- **Astronomy** 🌌 - Stars, planets, cosmology
- **Earth Science** 🌍 - Geology, meteorology, oceanography
- **Mathematics** 📐 - Numbers, equations, geometry
- **Technology** 💻 - Computing, engineering, innovation
- **Medicine** ⚕️ - Anatomy, diseases, health
- **Environmental Science** 🌱 - Climate, conservation, ecology
- **Neuroscience** 🧠 - Brain, nervous system, cognition

### Difficulty Levels

- **Easy** - Fundamental concepts and basic facts
- **Medium** - Intermediate knowledge and applications
- **Hard** - Advanced topics and detailed understanding
- **Expert** - Specialized knowledge and complex concepts
- **Adaptive** - Automatically adjusts to your skill level

### Power-Ups

1. **Time Freeze ⏸️** (50 coins)
   - Pause the timer for 10 seconds
   - Perfect for difficult questions
   - 2 uses per game

2. **50/50 ✂️** (30 coins)
   - Eliminate two wrong answers
   - Increases success rate
   - 2 uses per game

3. **Skip Question ⏭️** (40 coins)
   - Jump to next question without penalty
   - Save time on unknowns
   - 1 use per game

4. **Double Points ✨** (60 coins)
   - Double points on next correct answer
   - Maximize your score
   - 1 use per game

### Scoring System

- **Base Points**: Determined by question difficulty
  - Easy: 100 pts
  - Medium: 200 pts
  - Hard: 300 pts
  - Expert: 400 pts

- **Time Bonus**: Up to 50% extra for quick answers
- **Streak Bonus**: 50 pts every 3 consecutive correct answers
- **Accuracy Multiplier**: Bonus for high accuracy rates

### Adaptive Difficulty

The game intelligently adjusts to your skill level:

- **Skill Tracking**: Monitors performance per category
- **Dynamic Adjustment**: Selects appropriate difficulty
- **Learning Velocity**: Tracks improvement rate
- **Personalized Recommendations**: Suggests areas to practice

### Skill Tiers

Progress through skill tiers based on performance:

1. **Novice** (0-30) - Just starting out
2. **Beginner** (30-45) - Building foundation
3. **Intermediate** (45-60) - Solid understanding
4. **Advanced** (60-75) - Strong knowledge
5. **Expert** (75-90) - Mastery level
6. **Genius** (90-100) - Elite performer

## Architecture

### Components

- `QuestionCard.tsx` - Displays questions with animations
- `PlayerBuzzer.tsx` - Shows player status and stats
- `Leaderboard.tsx` - Ranked player display with podium
- `PowerUpShop.tsx` - Power-up management interface

### Hooks

- `useQuizLogic.ts` - Single player game logic
- `useMultiplayer.ts` - Multiplayer game state

### Utilities

- `questionGenerator.ts` - Random question selection and sets
- `difficultyAdapter.ts` - Adaptive difficulty system

### Data

- `questionBank.ts` - 500+ science questions
- `categories.ts` - Category definitions and metadata

## Question Bank Statistics

Total Questions: **560+**

By Category:
- Physics: 70 questions
- Chemistry: 70 questions
- Biology: 70 questions
- Astronomy: 70 questions
- Earth Science: 50 questions
- Mathematics: 50 questions
- Technology: 50 questions
- Medicine: 50 questions
- Environmental Science: 40 questions
- Neuroscience: 40 questions

By Difficulty:
- Easy: 140 questions (25%)
- Medium: 140 questions (25%)
- Hard: 140 questions (25%)
- Expert: 140 questions (25%)

## Educational Features

### Explanations
Every question includes a detailed explanation:
- Why the answer is correct
- Additional context and facts
- Related concepts
- Learning opportunities

### Category Mastery
Track your expertise in each category:
- **Learning** - Getting started
- **Competent** - Basic understanding
- **Proficient** - Good knowledge
- **Expert** - Strong mastery
- **Master** - Complete expertise

### Performance Analytics
- Accuracy per category
- Average response time
- Streak statistics
- Improvement trends
- Weak areas identification

## Multiplayer Features

### Real-Time Competition
- Live answer tracking
- Response time comparison
- Dynamic leaderboard updates
- Player status indicators

### Player Stats
- Current score and rank
- Streak counter
- Correct answer count
- Response time tracking
- Connection status

### Tournament System
- Single-elimination brackets
- Multiple rounds
- Progressive difficulty
- Champion determination

## Customization

### Quiz Setup
- Select specific categories
- Choose difficulty level
- Set question count (5-50)
- Mixed or focused mode

### Visual Themes
Beautiful science-themed animations:
- Smooth transitions
- Particle effects
- Color-coded categories
- Responsive design

## Coin Economy

### Earning Coins
- 10 coins per correct answer
- +5 bonus for 3+ streak
- Daily challenge rewards
- Achievement bonuses

### Spending Coins
- Purchase power-ups
- Unlock special features
- Buy hints
- Customize avatars

## Technical Details

### State Management
- React hooks for game logic
- Efficient re-rendering
- Optimized performance
- Real-time updates

### Animations
- CSS animations and transitions
- Smooth visual feedback
- Performance optimized
- Mobile responsive

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Adjustable text size

## Future Enhancements

### Planned Features
- [ ] Global leaderboard integration
- [ ] Friend challenges
- [ ] Custom quiz creator
- [ ] Question submission system
- [ ] Achievement system
- [ ] Profile customization
- [ ] Statistics dashboard
- [ ] Practice mode per category
- [ ] Timed speed rounds
- [ ] Team vs Team mode

### Community Features
- [ ] Question rating system
- [ ] User-submitted questions
- [ ] Discussion forums
- [ ] Study groups
- [ ] Challenge friends

## Usage

```tsx
import { QuizShowdown } from './games/QuizShowdown';

function App() {
  return <QuizShowdown />;
}
```

## Performance

- Fast question loading
- Smooth animations
- Optimized rendering
- Mobile-friendly
- Low memory footprint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Credits

Created with:
- React & TypeScript
- Custom hooks and components
- Pure CSS animations
- Scientific accuracy focus

---

**Have fun learning science! 🚀🔬**
