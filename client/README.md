# Science Games Platform - Frontend

A modern, engaging React + Vite frontend for an interactive science games platform featuring 13 unique multiplayer games.

## Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, TailwindCSS
- **Real-time Communication**: Socket.io integration for multiplayer functionality
- **Beautiful Animations**: Framer Motion for smooth, engaging animations
- **Science-Themed Design**: Custom color scheme and styling optimized for science content
- **Responsive Layout**: Mobile-friendly design that works across all devices
- **13 Unique Games**: Diverse collection of science-based games across multiple categories

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Router**: Client-side routing
- **Socket.io Client**: Real-time bidirectional communication
- **Axios**: HTTP client for API calls

## Project Structure

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── GameCard.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── Layout.tsx
│   │   ├── GameTemplate.tsx
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   └── games/          # Individual game pages
│   │       ├── AITrainingArena.tsx
│   │       ├── ChemicalCompoundCrafting.tsx
│   │       ├── EcosystemSimulator.tsx
│   │       ├── EscapeRoomLabDisaster.tsx
│   │       ├── GeneSplicerSimulator.tsx
│   │       ├── MindReadersDuel.tsx
│   │       ├── NeuroNetwork.tsx
│   │       ├── ParticleColliderChallenge.tsx
│   │       ├── PhysicsPuzzleRelay.tsx
│   │       ├── QuantumChess.tsx
│   │       ├── ScienceCodenames.tsx
│   │       ├── ScienceQuizShowdown.tsx
│   │       └── TimeLoopStrategist.tsx
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── GameContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useSocket.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── api.ts
│   │   ├── socket.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── styles/             # Global styles
│   │   └── globals.css
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite environment types
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS configuration
└── .env.example            # Environment variables example

```

## Available Games

1. **AI Training Arena** - Train and battle AI models in strategic competitions
2. **Chemical Compound Crafting** - Combine elements to create compounds
3. **Ecosystem Simulator** - Build and balance thriving ecosystems
4. **Escape Room: Lab Disaster** - Solve science puzzles to escape
5. **Gene Splicer Simulator** - Manipulate DNA sequences
6. **Mind Reader's Duel** - Predict opponent's moves
7. **Neuro Network** - Connect neurons and build neural pathways
8. **Particle Collider Challenge** - Smash particles to discover elements
9. **Physics Puzzle Relay** - Solve physics-based puzzles
10. **Quantum Chess** - Chess with quantum mechanics
11. **Science Codenames** - Give clues to identify science terms
12. **Science Quiz Showdown** - Fast-paced science trivia
13. **Time Loop Strategist** - Manipulate time loops to solve puzzles

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Key Features

### Custom Hooks

- **useSocket**: Manages Socket.io connection and events
- **useAuth**: Handles authentication state and operations
- **useGame**: Manages game state and data

### Context Providers

- **AuthContext**: Global authentication state
- **GameContext**: Game data and current game state

### Components

- **Navbar**: Navigation bar with user status and connection indicator
- **GameCard**: Animated card displaying game information
- **Leaderboard**: Global and game-specific leaderboard
- **LoadingScreen**: Animated loading screen with particles
- **Layout**: Main layout wrapper with background effects
- **GameTemplate**: Reusable template for game pages

### Styling

- Science-themed color palette with cyan, blue, and purple gradients
- Glass morphism effects for modern UI
- Custom animations and transitions
- Responsive grid layouts
- Custom scrollbar styling

## API Integration

The frontend communicates with the backend through:
- REST API (via Axios) for data fetching
- Socket.io for real-time updates and multiplayer functionality

## Contributing

When adding new features:
1. Follow the existing project structure
2. Use TypeScript for type safety
3. Maintain consistent styling with TailwindCSS
4. Add animations for enhanced UX
5. Ensure responsive design

## License

This project is part of the Science Games Platform.
