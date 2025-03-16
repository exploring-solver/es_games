// client.js - Client-side JavaScript for Multiplayer Pong Game

// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;

// Global Variables
let socket;
let currentUser = null;
let currentRoom = null;
let isHost = false;
let gameActive = false;
let playerPaddles = {}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    initSocket();
    checkAuth();
    
    // Auth tab switching
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('text-blue-600', 'border-blue-600');
        loginTab.classList.remove('text-gray-500');
        registerTab.classList.add('text-gray-500');
        registerTab.classList.remove('text-blue-600', 'border-blue-600');
        
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('text-blue-600', 'border-blue-600');
        registerTab.classList.remove('text-gray-500');
        loginTab.classList.add('text-gray-500');
        loginTab.classList.remove('text-blue-600', 'border-blue-600');
        
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            showError('Please enter username and password');
            return;
        }
        
        login(username, password);
    });
    
    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (!username || !password || !confirmPassword) {
            showError('Please fill all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        register(username, password);
    });
    
    // Logout button
    logoutBtn.addEventListener('click', logout);
    
    // Create game form
    createGameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const gameMode = document.getElementById('game-mode').value;
        const maxRounds = parseInt(document.getElementById('max-rounds').value);
        
        createRoom(gameMode, maxRounds);
    });
    
    // Join game form
    joinGameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomCode = document.getElementById('room-code').value;
        
        if (!roomCode || roomCode.length !== 6) {
            showError('Please enter a valid 6-digit room code');
            return;
        }
        
        joinRoom(roomCode);
    });
    
    // Leave room button
    leaveRoomBtn.addEventListener('click', leaveRoom);
    
    // Update settings button
    updateSettingsBtn.addEventListener('click', () => {
        const gameMode = updateGameMode.value;
        const maxRounds = parseInt(updateMaxRounds.value);
        
        updateSettings(gameMode, maxRounds);
    });
    
    // Start game button
    startGameBtn.addEventListener('click', startGame);
    
    // Play again button
    playAgainBtn.addEventListener('click', () => {
        if (currentRoom) {
            showGameRoom();
        } else {
            showHome();
        }
    });
    
    // Return home button
    returnHomeBtn.addEventListener('click', () => {
        leaveRoom();
        showHome();
    });
});
;
let keyState = { w: false, s: false };
let lastRenderTime = 0;
let playerPositions = {};

// DOM Elements
// Auth elements
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const authError = document.getElementById('auth-error');

// Home elements
const homeContainer = document.getElementById('home-container');
const userName = document.getElementById('user-name');
const userWins = document.getElementById('user-wins');
const logoutBtn = document.getElementById('logout-btn');
const createGameForm = document.getElementById('create-game-form');
const joinGameForm = document.getElementById('join-game-form');

// Game room elements
const gameRoomContainer = document.getElementById('game-room-container');
const roomCodeDisplay = document.getElementById('room-code-display');
const gameModeDisplay = document.getElementById('game-mode-display');
const maxRoundsDisplay = document.getElementById('max-rounds-display');
const hostDisplay = document.getElementById('host-display');
const hostControls = document.getElementById('host-controls');
const updateGameMode = document.getElementById('update-game-mode');
const updateMaxRounds = document.getElementById('update-max-rounds');
const updateSettingsBtn = document.getElementById('update-settings-btn');
const startGameBtn = document.getElementById('start-game-btn');
const leaveRoomBtn = document.getElementById('leave-room-btn');
const team0Players = document.getElementById('team-0-players');
const team1Players = document.getElementById('team-1-players');
const spectatorsList = document.getElementById('spectators-list');

// Game elements
const gameContainer = document.getElementById('game-container');
const currentRound = document.getElementById('current-round');
const totalRounds = document.getElementById('total-rounds');
const team0Score = document.getElementById('team0-score');
const team1Score = document.getElementById('team1-score');
const team0Wins = document.getElementById('team0-wins');
const team1Wins = document.getElementById('team1-wins');
const gameMessage = document.getElementById('game-message');

// Game end elements
const gameEndContainer = document.getElementById('game-end-container');
const winningTeam = document.getElementById('winning-team');
const finalScore = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const returnHomeBtn = document.getElementById('return-home-btn');

// Initialize Socket Connection
function initSocket() {
    socket = io();
    
    // Socket event handlers
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    
    socket.on('error', (data) => {
        showError(data.message);
    });
    
    socket.on('kicked', (data) => {
        showError(data.message);
        leaveRoom();
    });
    
    socket.on('joinedRoom', (data) => {
        currentRoom = data.room;
        updateRoomDisplay();
    });
    
    socket.on('joinedAsSpectator', (data) => {
        currentRoom = data.room;
        updateRoomDisplay();
        showMessage('You joined as a spectator because the game is full.');
    });
    
    socket.on('roomUpdate', (data) => {
        currentRoom = data.room;
        updateRoomDisplay();
    });
    
    socket.on('playerDisconnected', (data) => {
        showMessage(`${data.username} disconnected`);
        currentRoom = data.room;
        updateRoomDisplay();
    });
    
    socket.on('gameStarted', (data) => {
        currentRoom = data.room;
        startGame();
    });
    
    socket.on('gameStateUpdate', (data) => {
        updateGameState(data.gameState);
    });
    
    socket.on('playerMoved', (data) => {
        if (data.socketId === socket.id) return; // Ignore our own movements
        
        // Find the paddle for this player
        if (data.team !== undefined && data.position !== undefined) {
            const paddleKey = `team${data.team}-pos${data.position}`;
            const paddle = playerPaddles[paddleKey];
            
            if (paddle && data.paddleY !== undefined) {
                // Update paddle position directly
                paddle.style.top = `${data.paddleY}px`;
            }
        }
    });
    
    socket.on('roundEnded', (data) => {
        updateRoundDisplay(data);
    });
    
    socket.on('gamePaused', (data) => {
        showGameMessage(data.message, data.countdown);
    });
    
    socket.on('gameResumed', () => {
        hideGameMessage();
    });
    
    socket.on('gameEnded', (data) => {
        endGame(data);
    });
}

// Authentication Functions
function login(username, password) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            currentUser = {
                username,
                token: data.token,
                wins: data.wins,
                gamesPlayed: data.gamesPlayed
            };
            
            localStorage.setItem('user', JSON.stringify(currentUser));
            showHome();
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        showError('Login failed: ' + error.message);
    });
}

function register(username, password) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User created successfully') {
            currentUser = {
                username,
                token: data.token,
                wins: 0,
                gamesPlayed: 0
            };
            
            localStorage.setItem('user', JSON.stringify(currentUser));
            showHome();
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        showError('Registration failed: ' + error.message);
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    showAuth();
}

function checkAuth() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showHome();
    } else {
        showAuth();
    }
}

// Room Functions
function createRoom(gameMode, maxRounds) {
    fetch('/api/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ gameMode, maxRounds })
    })
    .then(response => response.json())
    .then(data => {
        if (data.roomCode) {
            joinRoom(data.roomCode);
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        showError('Failed to create room: ' + error.message);
    });
}

function joinRoom(roomCode) {
    // First, get room details to verify it exists
    fetch(`/api/rooms/${roomCode}`, {
        headers: {
            'Authorization': `Bearer ${currentUser.token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.room) {
            // Join room via socket
            socket.emit('joinRoom', {
                roomCode,
                username: currentUser.username,
                token: currentUser.token
            });
            
            // Show game room UI
            showGameRoom();
        } else {
            showError(data.message || 'Room not found');
        }
    })
    .catch(error => {
        showError('Failed to join room: ' + error.message);
    });
}

function leaveRoom() {
    // Disconnect socket and return to home
    if (socket) {
        socket.disconnect();
    }
    
    // Reinitialize socket
    initSocket();
    
    // Reset room state
    currentRoom = null;
    isHost = false;
    gameActive = false;
    
    // Reset UI
    showHome();
}

function updateSettings(gameMode, maxRounds) {
    if (!isHost) return;
    
    socket.emit('updateGameSettings', {
        roomCode: currentRoom.roomCode,
        gameMode,
        maxRounds,
        token: currentUser.token
    });
}

function kickPlayer(username) {
    if (!isHost) return;
    
    socket.emit('kickPlayer', {
        roomCode: currentRoom.roomCode,
        username,
        token: currentUser.token
    });
}

function startGame() {
    if (isHost) {
        socket.emit('startGame', {
            roomCode: currentRoom.roomCode,
            token: currentUser.token
        });
    }
    
    // Update UI
    showGame();
    
    // Initialize game state
    gameActive = true;
    initGame();
}

// Game Functions
function initGame() {
    // Clear any existing game elements
    const gameBoardContainer = document.querySelector('.game-container');
    const existingPaddles = gameBoardContainer.querySelectorAll('.paddle');
    const existingBall = gameBoardContainer.querySelector('.ball');
    
    existingPaddles.forEach(paddle => paddle.remove());
    if (existingBall) existingBall.remove();
    
    // Reset player paddles
    playerPaddles = {};
    
    // Create game elements based on game mode
    if (currentRoom.gameMode === '1v1') {
        // Create 2 paddles (one for each team)
        createPaddle(0, 0, 'left');
        createPaddle(1, 0, 'right');
    } else if (currentRoom.gameMode === '2v1') {
        // Create 3 paddles (2 for team 0, 1 for team 1)
        createPaddle(0, 0, 'left', 'top');
        createPaddle(0, 1, 'left', 'bottom');
        createPaddle(1, 0, 'right');
    } else { // 2v2
        // Create 4 paddles (2 for each team)
        createPaddle(0, 0, 'left', 'top');
        createPaddle(0, 1, 'left', 'bottom');
        createPaddle(1, 0, 'right', 'top');
        createPaddle(1, 1, 'right', 'bottom');
    }
    
    // Create ball
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.id = 'game-ball';
    gameBoardContainer.appendChild(ball);
    
    // Set ball initial position
    ball.style.left = `${CANVAS_WIDTH / 2}px`;
    ball.style.top = `${CANVAS_HEIGHT / 2}px`;
    
    // Set up keyboard listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

function createPaddle(team, position, side, verticalPosition = 'middle') {
    const gameBoardContainer = document.querySelector('.game-container');
    
    const paddle = document.createElement('div');
    paddle.className = 'paddle';
    
    // Position paddle based on team and position
    if (side === 'left') {
        paddle.style.left = '0';
    } else {
        paddle.style.right = '0';
    }
    
    let yPos;
    if (verticalPosition === 'top') {
        yPos = CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2;
    } else if (verticalPosition === 'bottom') {
        yPos = 3 * CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2;
    } else {
        yPos = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    }
    
    paddle.style.top = `${yPos}px`;
    
    // Store paddle reference
    const paddleKey = `team${team}-pos${position}`;
    playerPaddles[paddleKey] = paddle;
    
    // Add to DOM
    gameBoardContainer.appendChild(paddle);
    
    // Check if this paddle belongs to current player
    const player = currentRoom.players.find(p => 
        p.username === currentUser.username && 
        p.team === team && 
        p.position === position
    );
    
    if (player) {
        paddle.classList.add('my-paddle');
    }
    
    return paddle;
}

function handleKeyDown(e) {
    if (!gameActive) return;
    
    if (e.key.toLowerCase() === 'w') {
        keyState.w = true;
        socket.emit('playerMove', { roomCode: currentRoom.roomCode, direction: 'up' });
    } else if (e.key.toLowerCase() === 's') {
        keyState.s = true;
        socket.emit('playerMove', { roomCode: currentRoom.roomCode, direction: 'down' });
    }
}

function handleKeyUp(e) {
    if (!gameActive) return;
    
    if (e.key.toLowerCase() === 'w') {
        keyState.w = false;
        socket.emit('playerMove', { roomCode: currentRoom.roomCode, direction: 'stop' });
    } else if (e.key.toLowerCase() === 's') {
        keyState.s = false;
        socket.emit('playerMove', { roomCode: currentRoom.roomCode, direction: 'stop' });
    }
}

function gameLoop(timestamp) {
    if (!gameActive) return;
    
    const deltaTime = timestamp - lastRenderTime;
    lastRenderTime = timestamp;
    
    // Move local paddle based on key state
    moveLocalPaddle(deltaTime);
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

function moveLocalPaddle(deltaTime) {
    // Find player's paddle
    const player = currentRoom.players.find(p => p.username === currentUser.username);
    if (!player) return;
    
    const paddleKey = `team${player.team}-pos${player.position}`;
    const paddle = playerPaddles[paddleKey];
    if (!paddle) return;
    
    // Calculate movement
    const PADDLE_SPEED = 0.5; // pixels per millisecond
    let movement = 0;
    
    if (keyState.w) movement -= PADDLE_SPEED * deltaTime;
    if (keyState.s) movement += PADDLE_SPEED * deltaTime;
    
    // Get current position
    const currentTop = parseInt(paddle.style.top) || 0;
    let newTop = currentTop + movement;
    
    // Constrain to game bounds
    newTop = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, newTop));
    
    // Apply movement
    paddle.style.top = `${newTop}px`;
    
    // Send new paddle position to server
    if (movement !== 0) {
        socket.emit('playerMove', { 
            roomCode: currentRoom.roomCode, 
            direction: movement < 0 ? 'up' : 'down',
            paddleY: newTop
        });
    }
}

function updateGameState(gameState) {
    if (!gameActive) return;
    
    // Update ball position
    const ball = document.getElementById('game-ball');
    if (ball && gameState.ballPosition) {
        ball.style.left = `${gameState.ballPosition.x}px`;
        ball.style.top = `${gameState.ballPosition.y}px`;
    }
    
    // Update scores
    team0Score.textContent = gameState.score[0];
    team1Score.textContent = gameState.score[1];
    
    // Update round wins
    team0Wins.textContent = gameState.roundWins[0];
    team1Wins.textContent = gameState.roundWins[1];
    
    // Update current round
    currentRound.textContent = gameState.currentRound;
}

function updateRoundDisplay(data) {
    team0Wins.textContent = data.roundWins[0];
    team1Wins.textContent = data.roundWins[1];
    currentRound.textContent = data.currentRound;
}

function showGameMessage(message, countdown = null) {
    gameMessage.textContent = message;
    gameMessage.classList.remove('hidden');
    
    if (countdown) {
        let count = countdown;
        const countdownInterval = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(countdownInterval);
                hideGameMessage();
            } else {
                gameMessage.textContent = `${message} Starting in ${count}...`;
            }
        }, 1000);
    }
}

function hideGameMessage() {
    gameMessage.classList.add('hidden');
}

function endGame(data) {
    // Stop game loop
    gameActive = false;
    
    // Remove keyboard listeners
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    
    // Update end game screen
    winningTeam.textContent = data.winningTeam + 1; // 0-based to 1-based
    finalScore.textContent = `${data.roundWins[0]} - ${data.roundWins[1]}`;
    
    // Show end game screen
    hideAllScreens();
    gameEndContainer.classList.remove('hidden');
}

// UI Utility Functions
function showAuth() {
    hideAllScreens();
    authContainer.classList.remove('hidden');
}

function showHome() {
    hideAllScreens();
    homeContainer.classList.remove('hidden');
    
    // Update user info
    userName.textContent = currentUser.username;
    userWins.textContent = currentUser.wins;
}

function showGameRoom() {
    hideAllScreens();
    gameRoomContainer.classList.remove('hidden');
}

function showGame() {
    hideAllScreens();
    gameContainer.classList.remove('hidden');
}

function hideAllScreens() {
    authContainer.classList.add('hidden');
    homeContainer.classList.add('hidden');
    gameRoomContainer.classList.add('hidden');
    gameContainer.classList.add('hidden');
    gameEndContainer.classList.add('hidden');
}

function showError(message) {
    authError.textContent = message;
    authError.classList.remove('hidden');
    
    // Hide error after 3 seconds
    setTimeout(() => {
        authError.classList.add('hidden');
    }, 3000);
}

function showMessage(message) {
    // Create a floating message
    const messageElement = document.createElement('div');
    messageElement.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md z-50';
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

function updateRoomDisplay() {
    if (!currentRoom) return;
    
    // Set room code
    roomCodeDisplay.textContent = currentRoom.roomCode;
    
    // Set game settings
    gameModeDisplay.textContent = currentRoom.gameMode;
    maxRoundsDisplay.textContent = currentRoom.maxRounds;
    hostDisplay.textContent = currentRoom.host;
    
    // Check if current user is host
    isHost = currentRoom.host === currentUser.username;
    
    // Show/hide host controls
    if (isHost) {
        hostControls.classList.remove('hidden');
        
        // Set current values in form
        updateGameMode.value = currentRoom.gameMode;
        updateMaxRounds.value = currentRoom.maxRounds;
    } else {
        hostControls.classList.add('hidden');
    }
    
    // Update player lists
    updatePlayerLists();
    
    // Update game settings
    totalRounds.textContent = currentRoom.maxRounds;
}

function updatePlayerLists() {
    if (!currentRoom) return;
    
    // Clear current lists
    team0Players.innerHTML = '';
    team1Players.innerHTML = '';
    spectatorsList.innerHTML = '';
    
    // Filter players by team
    const team0 = currentRoom.players.filter(p => p.team === 0);
    const team1 = currentRoom.players.filter(p => p.team === 1);
    
    // Add team 0 players
    if (team0.length > 0) {
        team0.forEach(player => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.username;
            if (player.username === currentUser.username) {
                nameSpan.className = 'font-bold';
            }
            li.appendChild(nameSpan);
            
            // Add kick button if host
            if (isHost && player.username !== currentUser.username) {
                const kickBtn = document.createElement('button');
                kickBtn.className = 'text-red-600 text-sm';
                kickBtn.textContent = 'Kick';
                kickBtn.addEventListener('click', () => kickPlayer(player.username));
                li.appendChild(kickBtn);
            }
            
            // Add disconnected indicator
            if (!player.socketId) {
                const disconnectedSpan = document.createElement('span');
                disconnectedSpan.className = 'text-red-600 text-sm';
                disconnectedSpan.textContent = '(disconnected)';
                li.appendChild(disconnectedSpan);
            }
            
            team0Players.appendChild(li);
        });
    } else {
        team0Players.innerHTML = '<li class="text-gray-500">Waiting for players...</li>';
    }
    
    // Add team 1 players
    if (team1.length > 0) {
        team1.forEach(player => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.username;
            if (player.username === currentUser.username) {
                nameSpan.className = 'font-bold';
            }
            li.appendChild(nameSpan);
            
            // Add kick button if host
            if (isHost && player.username !== currentUser.username) {
                const kickBtn = document.createElement('button');
                kickBtn.className = 'text-red-600 text-sm';
                kickBtn.textContent = 'Kick';
                kickBtn.addEventListener('click', () => kickPlayer(player.username));
                li.appendChild(kickBtn);
            }
            
            // Add disconnected indicator
            if (!player.socketId) {
                const disconnectedSpan = document.createElement('span');
                disconnectedSpan.className = 'text-red-600 text-sm';
                disconnectedSpan.textContent = '(disconnected)';
                li.appendChild(disconnectedSpan);
            }
            
            team1Players.appendChild(li);
        });
    } else {
        team1Players.innerHTML = '<li class="text-gray-500">Waiting for players...</li>';
    }
    
    // Add spectators
    if (currentRoom.spectators && currentRoom.spectators.length > 0) {
        spectatorsList.innerHTML = currentRoom.spectators.length + ' spectators';
    } else {
        spectatorsList.innerHTML = '<li>No spectators</li>';
    }
}