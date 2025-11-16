import React, { useState, useEffect } from 'react';

interface ClueInputProps {
  currentTeam: 'red' | 'blue';
  onSubmitClue: (clue: { word: string; number: number }) => void;
  timeLimit: number;
}

export const ClueInput: React.FC<ClueInputProps> = ({
  currentTeam,
  onSubmitClue,
  timeLimit,
}) => {
  const [clueWord, setClueWord] = useState('');
  const [clueNumber, setClueNumber] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isSpymaster, setIsSpymaster] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [currentTeam, timeLimit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clueWord.trim() && isSpymaster) {
      onSubmitClue({ word: clueWord.toUpperCase(), number: clueNumber });
      setClueWord('');
    }
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className={`clue-input-container ${currentTeam}`}>
      <div className="turn-indicator">
        <span className={`team-badge ${currentTeam}`}>
          {currentTeam === 'red' ? '🔴' : '🔵'} {currentTeam.toUpperCase()} TEAM's Turn
        </span>
        <span className="timer">
          ⏱️ {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="role-toggle">
        <label>
          <input
            type="checkbox"
            checked={isSpymaster}
            onChange={(e) => setIsSpymaster(e.target.checked)}
          />
          I am the Spymaster
        </label>
      </div>

      {isSpymaster && (
        <form onSubmit={handleSubmit} className="clue-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter one-word clue..."
              value={clueWord}
              onChange={(e) => setClueWord(e.target.value)}
              className="clue-input"
              maxLength={20}
            />
            <input
              type="number"
              min="1"
              max="9"
              value={clueNumber}
              onChange={(e) => setClueNumber(parseInt(e.target.value))}
              className="number-input"
            />
            <button type="submit" className="btn-submit">
              Give Clue
            </button>
          </div>
          <p className="hint-text">
            Give a one-word clue and number of related words
          </p>
        </form>
      )}
    </div>
  );
};
