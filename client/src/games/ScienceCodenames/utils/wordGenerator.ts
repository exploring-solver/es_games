import { scienceTerms } from '../data/scienceTerms';
import { CardData } from '../components/WordGrid';

export const generateGrid = (category: string, difficulty: string): CardData[] => {
  // Get word pool based on category
  let wordPool: string[] = [];

  if (category === 'all') {
    wordPool = Object.values(scienceTerms).flat();
  } else {
    wordPool = scienceTerms[category as keyof typeof scienceTerms] || [];
  }

  // Shuffle and select 25 words
  const shuffled = wordPool.sort(() => Math.random() - 0.5);
  const selectedWords = shuffled.slice(0, 25);

  // Assign card types: 9 red, 8 blue, 7 neutral, 1 assassin
  const types: Array<'red' | 'blue' | 'neutral' | 'assassin'> = [
    ...Array(9).fill('red'),
    ...Array(8).fill('blue'),
    ...Array(7).fill('neutral'),
    'assassin',
  ];

  // Shuffle types
  const shuffledTypes = types.sort(() => Math.random() - 0.5);

  // Create grid
  const grid: CardData[] = selectedWords.map((word, index) => ({
    word,
    type: shuffledTypes[index],
  }));

  return grid;
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
