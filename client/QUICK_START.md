# Quick Start Guide

## Start Development Server

```bash
cd /home/user/es_games/client
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Status

✅ **Complete** - All core infrastructure created and configured
- Vite + React + TypeScript initialized
- All dependencies installed
- TailwindCSS configured with science theme
- 13 game routes created
- Shared components ready
- Context providers implemented
- Custom hooks created
- Socket.io configured
- API client ready

## Directory Overview

```
client/
├── src/
│   ├── App.tsx              # Routes for all games
│   ├── main.tsx             # Entry point
│   ├── components/          # Navbar, GameCard, Leaderboard, etc.
│   ├── pages/              # Dashboard + 13 game pages
│   ├── contexts/           # Auth & Game contexts
│   ├── hooks/              # useSocket, useAuth, useGame
│   ├── utils/              # API, helpers, constants
│   └── styles/             # Global CSS with Tailwind
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

1. **Dashboard** - Browse all 13 science games with search and filters
2. **Responsive Design** - Mobile-friendly with Tailwind CSS
3. **Animations** - Smooth transitions with Framer Motion
4. **Real-time** - Socket.io integration ready
5. **Type-safe** - Full TypeScript support
6. **Modular** - Reusable components and hooks

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## All Games Available

1. AI Training Arena
2. Chemical Compound Crafting
3. Ecosystem Simulator
4. Escape Room: Lab Disaster
5. Gene Splicer Simulator
6. Mind Reader's Duel
7. Neuro Network
8. Particle Collider Challenge
9. Physics Puzzle Relay
10. Quantum Chess
11. Science Codenames
12. Science Quiz Showdown
13. Time Loop Strategist

## Success!

Frontend infrastructure is complete and ready to use! 🎉
