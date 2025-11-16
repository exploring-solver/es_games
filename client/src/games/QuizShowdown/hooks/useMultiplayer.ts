import { useState, useEffect, useCallback, useRef } from 'react';
import { Question } from '../data/questionBank';
import { generateQuestionSet } from '../utils/questionGenerator';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  correctAnswers: number;
  isReady: boolean;
  hasAnswered: boolean;
  answer: number | null;
  responseTime: number;
  isConnected: boolean;
  powerUpsUsed: number;
}

export interface MultiplayerState {
  gameId: string;
  players: Player[];
  currentQuestionIndex: number;
  questions: Question[];
  timeRemaining: number;
  gameStatus: 'waiting' | 'ready' | 'playing' | 'question_end' | 'game_end';
  round: number;
  maxRounds: number;
  hostId: string;
}

export interface TournamentBracket {
  round: number;
  matches: Match[];
}

export interface Match {
  id: string;
  player1: Player | null;
  player2: Player | null;
  winner: Player | null;
  status: 'pending' | 'in_progress' | 'completed';
}

export const useMultiplayer = (
  playerCount: number = 4,
  gameMode: 'quick' | 'tournament' | 'daily' = 'quick'
) => {
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>(() => {
    const questionSet = generateQuestionSet({
      count: 15,
      balanceDifficulty: true
    });

    return {
      gameId: generateGameId(),
      players: initializePlayers(playerCount),
      currentQuestionIndex: 0,
      questions: questionSet.questions,
      timeRemaining: questionSet.questions[0]?.timeLimit || 15,
      gameStatus: 'waiting',
      round: 1,
      maxRounds: gameMode === 'tournament' ? 5 : 1,
      hostId: 'player1'
    };
  });

  const [tournamentBracket, setTournamentBracket] = useState<TournamentBracket[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Generate unique game ID
  function generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize players
  function initializePlayers(count: number): Player[] {
    const avatars = ['🧑‍🔬', '👨‍🔬', '👩‍🔬', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍💻'];
    const names = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

    return Array.from({ length: count }, (_, i) => ({
      id: `player${i + 1}`,
      name: names[i] || `Player ${i + 1}`,
      avatar: avatars[i] || '🧑‍🔬',
      score: 0,
      streak: 0,
      correctAnswers: 0,
      isReady: i === 0, // Host is ready by default
      hasAnswered: false,
      answer: null,
      responseTime: 0,
      isConnected: true,
      powerUpsUsed: 0
    }));
  }

  // Start timer for question
  const startQuestionTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    questionStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setMultiplayerState(prev => {
        if (prev.gameStatus !== 'playing') return prev;

        const newTime = prev.timeRemaining - 0.1;

        if (newTime <= 0) {
          // Time's up - mark unanswered players as wrong
          return {
            ...prev,
            timeRemaining: 0,
            gameStatus: 'question_end',
            players: prev.players.map(p => ({
              ...p,
              hasAnswered: true,
              streak: p.hasAnswered ? p.streak : 0
            }))
          };
        }

        // Check if all players have answered
        const allAnswered = prev.players.every(p => p.hasAnswered || !p.isConnected);
        if (allAnswered) {
          return {
            ...prev,
            gameStatus: 'question_end'
          };
        }

        return {
          ...prev,
          timeRemaining: Math.max(0, newTime)
        };
      });
    }, 100);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Player submits answer
  const submitPlayerAnswer = useCallback((playerId: string, answerIndex: number) => {
    setMultiplayerState(prev => {
      const player = prev.players.find(p => p.id === playerId);
      if (!player || player.hasAnswered) return prev;

      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      const responseTime = Date.now() - questionStartTimeRef.current;
      const isCorrect = answerIndex === currentQuestion.correctAnswer;

      // Calculate points with time bonus
      const timeTaken = (responseTime / 1000);
      const timeBonus = Math.max(0, (currentQuestion.timeLimit - timeTaken) / currentQuestion.timeLimit);
      const basePoints = currentQuestion.points;
      const points = isCorrect ? Math.floor(basePoints * (1 + timeBonus * 0.5)) : 0;

      // Calculate streak bonus
      const newStreak = isCorrect ? player.streak + 1 : 0;
      const streakBonus = Math.floor(newStreak / 3) * 50;

      return {
        ...prev,
        players: prev.players.map(p =>
          p.id === playerId
            ? {
                ...p,
                hasAnswered: true,
                answer: answerIndex,
                responseTime: responseTime / 1000,
                score: p.score + points + streakBonus,
                streak: newStreak,
                correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0)
              }
            : p
        )
      };
    });
  }, []);

  // Next question
  const nextQuestion = useCallback(() => {
    setMultiplayerState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex >= prev.questions.length) {
        return {
          ...prev,
          gameStatus: 'game_end'
        };
      }

      const nextQuestion = prev.questions[nextIndex];

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        timeRemaining: nextQuestion.timeLimit,
        gameStatus: 'playing',
        players: prev.players.map(p => ({
          ...p,
          hasAnswered: false,
          answer: null,
          responseTime: 0
        }))
      };
    });
  }, []);

  // Player ready toggle
  const togglePlayerReady = useCallback((playerId: string) => {
    setMultiplayerState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === playerId ? { ...p, isReady: !p.isReady } : p
      )
    }));
  }, []);

  // Start game
  const startGame = useCallback(() => {
    const allReady = multiplayerState.players.every(p => p.isReady);

    if (!allReady) {
      console.warn('Not all players are ready');
      return;
    }

    setMultiplayerState(prev => ({
      ...prev,
      gameStatus: 'playing'
    }));
  }, [multiplayerState.players]);

  // Initialize tournament bracket
  const initializeTournament = useCallback((players: Player[]) => {
    if (players.length < 2) return;

    // Create first round matches
    const matches: Match[] = [];
    for (let i = 0; i < players.length; i += 2) {
      matches.push({
        id: `match_r1_${i / 2}`,
        player1: players[i] || null,
        player2: players[i + 1] || null,
        winner: null,
        status: 'pending'
      });
    }

    const bracket: TournamentBracket = {
      round: 1,
      matches
    };

    setTournamentBracket([bracket]);
  }, []);

  // Advance tournament round
  const advanceTournamentRound = useCallback(() => {
    if (tournamentBracket.length === 0) return;

    const currentRound = tournamentBracket[tournamentBracket.length - 1];
    const winners = currentRound.matches
      .map(m => m.winner)
      .filter((w): w is Player => w !== null);

    if (winners.length < 2) {
      // Tournament complete
      setMultiplayerState(prev => ({
        ...prev,
        gameStatus: 'game_end'
      }));
      return;
    }

    // Create next round matches
    const nextMatches: Match[] = [];
    for (let i = 0; i < winners.length; i += 2) {
      nextMatches.push({
        id: `match_r${currentRound.round + 1}_${i / 2}`,
        player1: winners[i],
        player2: winners[i + 1] || null,
        winner: null,
        status: 'pending'
      });
    }

    const nextBracket: TournamentBracket = {
      round: currentRound.round + 1,
      matches: nextMatches
    };

    setTournamentBracket(prev => [...prev, nextBracket]);
  }, [tournamentBracket]);

  // Get leaderboard (sorted by score)
  const getLeaderboard = useCallback(() => {
    return [...multiplayerState.players]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
        return a.responseTime - b.responseTime;
      })
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }));
  }, [multiplayerState.players]);

  // Get player by ID
  const getPlayer = useCallback((playerId: string) => {
    return multiplayerState.players.find(p => p.id === playerId);
  }, [multiplayerState.players]);

  // Simulate AI player answer
  const simulateAIAnswer = useCallback((playerId: string) => {
    setTimeout(() => {
      const currentQuestion = multiplayerState.questions[multiplayerState.currentQuestionIndex];
      const difficulty = currentQuestion.difficulty;

      // AI accuracy based on difficulty
      const accuracy = {
        easy: 0.9,
        medium: 0.7,
        hard: 0.5,
        expert: 0.3
      }[difficulty];

      const isCorrect = Math.random() < accuracy;
      const answer = isCorrect
        ? currentQuestion.correctAnswer
        : Math.floor(Math.random() * currentQuestion.options.length);

      submitPlayerAnswer(playerId, answer);
    }, Math.random() * 5000 + 2000); // Random delay 2-7 seconds
  }, [multiplayerState, submitPlayerAnswer]);

  // Reset game
  const resetGame = useCallback(() => {
    const questionSet = generateQuestionSet({
      count: 15,
      balanceDifficulty: true
    });

    setMultiplayerState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      questions: questionSet.questions,
      timeRemaining: questionSet.questions[0]?.timeLimit || 15,
      gameStatus: 'waiting',
      round: 1,
      players: prev.players.map(p => ({
        ...p,
        score: 0,
        streak: 0,
        correctAnswers: 0,
        isReady: p.id === prev.hostId,
        hasAnswered: false,
        answer: null,
        responseTime: 0,
        powerUpsUsed: 0
      }))
    }));

    setTournamentBracket([]);
  }, []);

  // Auto-start timer when game is playing
  useEffect(() => {
    if (multiplayerState.gameStatus === 'playing') {
      startQuestionTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [multiplayerState.gameStatus, startQuestionTimer, stopTimer]);

  // Auto-advance after question end
  useEffect(() => {
    if (multiplayerState.gameStatus === 'question_end') {
      const timeout = setTimeout(() => {
        nextQuestion();
      }, 3000); // Show results for 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [multiplayerState.gameStatus, nextQuestion]);

  return {
    multiplayerState,
    tournamentBracket,
    currentQuestion: multiplayerState.questions[multiplayerState.currentQuestionIndex],
    submitPlayerAnswer,
    nextQuestion,
    togglePlayerReady,
    startGame,
    initializeTournament,
    advanceTournamentRound,
    getLeaderboard,
    getPlayer,
    simulateAIAnswer,
    resetGame,
    progress: ((multiplayerState.currentQuestionIndex + 1) / multiplayerState.questions.length) * 100
  };
};
