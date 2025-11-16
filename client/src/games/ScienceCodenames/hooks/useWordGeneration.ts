import { useState, useCallback } from 'react';
import { generateGrid } from '../utils/wordGenerator';
import { CardData } from '../components/WordGrid';

export const useWordGeneration = (category: string, difficulty: string) => {
  const [wordGrid, setWordGrid] = useState<CardData[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>(Array(25).fill(false));
  const [currentClue, setCurrentClue] = useState<{ word: string; number: number } | null>(null);

  const generateNewGrid = useCallback(() => {
    const newGrid = generateGrid(category, difficulty);
    setWordGrid(newGrid);
    setRevealedCards(Array(25).fill(false));
    setCurrentClue(null);
  }, [category, difficulty]);

  const revealCard = (index: number) => {
    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);

    const card = wordGrid[index];
    const gameOver = card.type === 'assassin';

    return {
      type: card.type,
      gameOver,
    };
  };

  const setClue = (clue: { word: string; number: number }) => {
    setCurrentClue(clue);
  };

  return {
    wordGrid,
    revealedCards,
    currentClue,
    generateNewGrid,
    revealCard,
    setClue,
  };
};
