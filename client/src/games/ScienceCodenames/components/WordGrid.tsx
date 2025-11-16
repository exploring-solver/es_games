import React from 'react';

export interface CardData {
  word: string;
  type: 'red' | 'blue' | 'neutral' | 'assassin';
}

interface WordGridProps {
  words: CardData[];
  revealed: boolean[];
  onCardClick: (index: number) => void;
  currentClue: { word: string; number: number } | null;
}

export const WordGrid: React.FC<WordGridProps> = ({
  words,
  revealed,
  onCardClick,
  currentClue,
}) => {
  return (
    <div className="word-grid-container">
      {currentClue && (
        <div className="current-clue">
          <span className="clue-word">{currentClue.word}</span>
          <span className="clue-number">{currentClue.number}</span>
        </div>
      )}

      <div className="word-grid">
        {words.map((card, index) => (
          <div
            key={index}
            className={`word-card ${revealed[index] ? `revealed ${card.type}` : 'hidden'} ${
              !revealed[index] ? 'clickable' : ''
            }`}
            onClick={() => !revealed[index] && onCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-word">{card.word}</div>
              {revealed[index] && (
                <div className={`card-indicator ${card.type}`}>
                  {card.type === 'assassin' && '💀'}
                  {card.type === 'red' && '🔴'}
                  {card.type === 'blue' && '🔵'}
                  {card.type === 'neutral' && '⚪'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
