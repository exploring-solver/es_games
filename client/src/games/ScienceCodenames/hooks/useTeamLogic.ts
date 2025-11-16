import { useState } from 'react';

export const useTeamLogic = () => {
  const [currentTeam, setCurrentTeam] = useState<'red' | 'blue'>('red');
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [winner, setWinner] = useState<'red' | 'blue' | null>(null);

  const switchTurn = () => {
    setCurrentTeam((prev) => (prev === 'red' ? 'blue' : 'red'));
  };

  const updateScore = (team: 'red' | 'blue', points: number) => {
    if (team === 'red') {
      const newScore = redScore + points;
      setRedScore(newScore);
      if (newScore >= 9) {
        setWinner('red');
      }
    } else {
      const newScore = blueScore + points;
      setBlueScore(newScore);
      if (newScore >= 8) {
        setWinner('blue');
      }
    }
  };

  const resetGame = () => {
    setCurrentTeam('red');
    setRedScore(0);
    setBlueScore(0);
    setWinner(null);
  };

  return {
    currentTeam,
    redScore,
    blueScore,
    winner,
    switchTurn,
    updateScore,
    resetGame,
  };
};
