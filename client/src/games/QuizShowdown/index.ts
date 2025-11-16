export { default as QuizShowdown } from './QuizShowdown';
export { QuizShowdown as default } from './QuizShowdown';

// Export types
export type { Question } from './data/questionBank';
export type { Category } from './data/categories';
export type { PlayerSkill } from './utils/difficultyAdapter';
export type { PowerUp, QuizState } from './hooks/useQuizLogic';
export type { Player, MultiplayerState } from './hooks/useMultiplayer';
