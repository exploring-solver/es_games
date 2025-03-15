#!/bin/bash

# Create main project directory
mkdir -p science_multiplayer_games
cd science_multiplayer_games

# Create common directories for shared resources
mkdir -p common/{css,js,assets,utils}

# Create the base structure for each game
declare -a games=(
  "quantum_chess"
  "escape_room_lab_disaster"
  "gene_splicer_simulator"
  "mind_readers_duel"
  "neuro_network"
  "time_loop_strategist"
  "chemical_compound_crafting"
  "ecosystem_simulator"
  "science_quiz_showdown"
  "ai_training_arena"
  "particle_collider_challenge"
  "science_codenames"
  "physics_puzzle_relay"
)

# Create folder structure for each game
for game in "${games[@]}"; do
  mkdir -p "$game"/{css,js,assets,components}
  touch "$game/index.html"
  touch "$game/js/game.js"
  touch "$game/js/socket-handler.js"
  touch "$game/css/style.css"
  touch "$game/README.md"
  
  # Create empty files for main game components
  touch "$game/js/game-logic.js"
  touch "$game/js/ui-controller.js"
  touch "$game/js/host-controls.js"
  touch "$game/js/reconnect-handler.js"
done

# Create a server directory
mkdir -p server/{routes,controllers,models,utils,middleware}
touch server/server.js
touch server/package.json

# Create a basic package.json for the server
cat > server/package.json << EOF
{
  "name": "science-games-server",
  "version": "1.0.0",
  "description": "Server for science-based multiplayer browser games",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

# Create a basic server.js file
cat > server/server.js << EOF
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle game-specific events
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
EOF

# Create a main README.md file
cat > README.md << EOF
# Science Multiplayer Games

A collection of browser-based multiplayer games focused on science, strategy, and education.

## Games Included
- Quantum Chess
- Escape Room: Lab Disaster
- Gene Splicer Simulator
- Mind Readers' Duel
- NeuroNetwork
- Time Loop Strategist
- Chemical Compound Crafting
- EcoSystem Simulator
- Science Quiz Showdown
- AI Training Arena
- Particle Collider Challenge
- Science Codenames
- Physics Puzzle Relay

## Features
- Real-time multiplayer using Socket.io
- Host controls and lobby management
- Reconnection support
- Educational science content

## Setup
1. Install server dependencies: \`cd server && npm install\`
2. Start the server: \`cd server && npm start\`
3. Open any game's index.html in a browser

## Development
Each game has its own directory with HTML, CSS, and JavaScript files.
Common utilities are shared in the common directory.
EOF

echo "Project structure created successfully!"

# Print next steps
echo ""
echo "Next steps:"
echo "1. cd science_multiplayer_games"
echo "2. cd server && npm install"
echo "3. npm start"
echo ""
echo "Then implement each game's logic in their respective directories."z