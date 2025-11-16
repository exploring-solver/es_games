import { useState, useEffect, useCallback, useRef } from 'react';
import { Question } from '../data/questionBank';
import { generateQuestionSet, calculatePoints, validateAnswer } from '../utils/questionGenerator';
import { PlayerSkill, updatePlayerSkill, initializePlayerSkill } from '../utils/difficultyAdapter';

export interface PowerUp {
  id: string;
  name: string;
  type: 'time_freeze' | 'fifty_fifty' | 'steal_points' | 'double_points' | 'skip';
  usesRemaining: number;
  cost: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  timeRemaining: number;
  isAnswered: boolean;
  selectedAnswer: number | null;
  correctAnswers: number;
  totalQuestions: number;
  powerUps: PowerUp[];
  coins: number;
  isTimeFrozen: boolean;
  eliminatedOptions: number[];
}

export interface UseQuizLogicProps {
  questionCount?: number;
  category?: string;
  difficulty?: string;
  playerId?: string;
}

export const useQuizLogic = ({
  questionCount = 10,
  category,
  difficulty,
  playerId = 'player1'
}: UseQuizLogicProps = {}) => {
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const questionSet = generateQuestionSet({
      count: questionCount,
      categories: category ? [category] : undefined,
      difficulty: difficulty || undefined,
      balanceDifficulty: !difficulty
    });

    return {
      questions: questionSet.questions,
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeRemaining: questionSet.questions[0]?.timeLimit || 15,
      isAnswered: false,
      selectedAnswer: null,
      correctAnswers: 0,
      totalQuestions: questionSet.questions.length,
      powerUps: initializePowerUps(),
      coins: 0,
      isTimeFrozen: false,
      eliminatedOptions: []
    };
  });

  const [playerSkill, setPlayerSkill] = useState<PlayerSkill>(
    initializePlayerSkill(playerId)
  );

  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Initialize power-ups
  function initializePowerUps(): PowerUp[] {
    return [
      { id: 'time_freeze', name: 'Time Freeze', type: 'time_freeze', usesRemaining: 2, cost: 50 },
      { id: 'fifty_fifty', name: '50/50', type: 'fifty_fifty', usesRemaining: 2, cost: 30 },
      { id: 'skip', name: 'Skip Question', type: 'skip', usesRemaining: 1, cost: 40 },
      { id: 'double_points', name: 'Double Points', type: 'double_points', usesRemaining: 1, cost: 60 }
    ];
  }

  // Start/reset timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setQuizState(prev => {
        if (prev.isTimeFrozen || prev.isAnswered) return prev;

        const newTime = prev.timeRemaining - 0.1;

        if (newTime <= 0) {
          // Time's up - auto-submit wrong answer
          return {
            ...prev,
            timeRemaining: 0,
            isAnswered: true,
            streak: 0
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

  // Submit answer
  const submitAnswer = useCallback((answerIndex: number) => {
    setQuizState(prev => {
      if (prev.isAnswered) return prev;

      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      const timeTaken = currentQuestion.timeLimit - prev.timeRemaining;
      const isCorrect = validateAnswer(currentQuestion, answerIndex);

      // Calculate points with power-up multiplier
      const hasDoublePoints = prev.powerUps.find(p => p.type === 'double_points' && p.usesRemaining > 0);
      const multiplier = hasDoublePoints ? 2 : 1;
      const points = calculatePoints(currentQuestion, timeTaken, isCorrect, multiplier);

      // Update player skill
      const updatedSkill = updatePlayerSkill(playerSkill, currentQuestion, isCorrect, timeTaken);
      setPlayerSkill(updatedSkill);

      // Calculate new streak
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const streakBonus = Math.floor(newStreak / 3) * 50; // Bonus every 3 correct

      // Award coins
      const coinReward = isCorrect ? 10 + (newStreak >= 3 ? 5 : 0) : 0;

      return {
        ...prev,
        selectedAnswer: answerIndex,
        isAnswered: true,
        score: prev.score + points + streakBonus,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        coins: prev.coins + coinReward,
        powerUps: hasDoublePoints
          ? prev.powerUps.map(p =>
              p.type === 'double_points' ? { ...p, usesRemaining: p.usesRemaining - 1 } : p
            )
          : prev.powerUps
      };
    });

    stopTimer();
  }, [playerSkill, stopTimer]);

  // Next question
  const nextQuestion = useCallback(() => {
    setQuizState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex >= prev.questions.length) {
        setIsQuizComplete(true);
        return prev;
      }

      const nextQuestion = prev.questions[nextIndex];

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        timeRemaining: nextQuestion.timeLimit,
        isAnswered: false,
        selectedAnswer: null,
        isTimeFrozen: false,
        eliminatedOptions: []
      };
    });
  }, []);

  // Use power-up
  const usePowerUp = useCallback((powerUpType: string) => {
    setQuizState(prev => {
      const powerUp = prev.powerUps.find(p => p.type === powerUpType);

      if (!powerUp || powerUp.usesRemaining <= 0 || prev.coins < powerUp.cost) {
        return prev;
      }

      let updates: Partial<QuizState> = {
        coins: prev.coins - powerUp.cost,
        powerUps: prev.powerUps.map(p =>
          p.type === powerUpType ? { ...p, usesRemaining: p.usesRemaining - 1 } : p
        )
      };

      // Apply power-up effect
      switch (powerUpType) {
        case 'time_freeze':
          updates.isTimeFrozen = true;
          setTimeout(() => {
            setQuizState(s => ({ ...s, isTimeFrozen: false }));
          }, 10000); // 10 seconds freeze
          break;

        case 'fifty_fifty':
          const currentQuestion = prev.questions[prev.currentQuestionIndex];
          const wrongAnswers = currentQuestion.options
            .map((_, idx) => idx)
            .filter(idx => idx !== currentQuestion.correctAnswer);

          // Randomly eliminate 2 wrong answers
          const toEliminate = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
          updates.eliminatedOptions = toEliminate;
          break;

        case 'skip':
          // Skip to next question with no penalty
          setTimeout(() => nextQuestion(), 100);
          break;

        // double_points is handled in submitAnswer
      }

      return { ...prev, ...updates };
    });
  }, [nextQuestion]);

  // Buy power-up
  const buyPowerUp = useCallback((powerUpType: string) => {
    setQuizState(prev => {
      const powerUp = prev.powerUps.find(p => p.type === powerUpType);

      if (!powerUp || prev.coins < powerUp.cost) {
        return prev;
      }

      return {
        ...prev,
        coins: prev.coins - powerUp.cost,
        powerUps: prev.powerUps.map(p =>
          p.type === powerUpType ? { ...p, usesRemaining: p.usesRemaining + 1 } : p
        )
      };
    });
  }, []);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    const questionSet = generateQuestionSet({
      count: questionCount,
      categories: category ? [category] : undefined,
      difficulty: difficulty || undefined,
      balanceDifficulty: !difficulty
    });

    setQuizState({
      questions: questionSet.questions,
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeRemaining: questionSet.questions[0]?.timeLimit || 15,
      isAnswered: false,
      selectedAnswer: null,
      correctAnswers: 0,
      totalQuestions: questionSet.questions.length,
      powerUps: initializePowerUps(),
      coins: 0,
      isTimeFrozen: false,
      eliminatedOptions: []
    });

    setIsQuizComplete(false);
  }, [questionCount, category, difficulty]);

  // Start timer when question changes
  useEffect(() => {
    if (!quizState.isAnswered && !isQuizComplete) {
      startTimer();
    }

    return () => stopTimer();
  }, [quizState.currentQuestionIndex, quizState.isAnswered, isQuizComplete, startTimer, stopTimer]);

  // Get current question
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return {
    quizState,
    currentQuestion,
    playerSkill,
    isQuizComplete,
    submitAnswer,
    nextQuestion,
    usePowerUp,
    buyPowerUp,
    resetQuiz,
    progress: ((quizState.currentQuestionIndex + 1) / quizState.totalQuestions) * 100,
    accuracy: quizState.totalQuestions > 0
      ? (quizState.correctAnswers / (quizState.currentQuestionIndex + 1)) * 100
      : 0
  };
};
