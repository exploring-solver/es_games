import React from 'react';
import { Question } from '../data/questionBank';
import { getCategoryById } from '../data/categories';

interface QuestionCardProps {
  question: Question;
  timeRemaining: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onSelectAnswer: (index: number) => void;
  eliminatedOptions?: number[];
  showExplanation?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  timeRemaining,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
  eliminatedOptions = [],
  showExplanation = false
}) => {
  const category = getCategoryById(question.category);

  const getOptionClassName = (index: number) => {
    const baseClass = 'quiz-option';
    const classes = [baseClass];

    if (eliminatedOptions.includes(index)) {
      classes.push('eliminated');
      return classes.join(' ');
    }

    if (isAnswered) {
      if (index === question.correctAnswer) {
        classes.push('correct');
      } else if (index === selectedAnswer) {
        classes.push('incorrect');
      }
    } else if (selectedAnswer === index) {
      classes.push('selected');
    }

    return classes.join(' ');
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      case 'expert': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / question.timeLimit) * 100;
    if (percentage > 50) return '#10b981';
    if (percentage > 25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="question-card">
      {/* Header */}
      <div className="question-header">
        <div className="question-meta">
          <span className="category-badge" style={{ backgroundColor: category?.color }}>
            {category?.icon} {category?.name}
          </span>
          <span
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor() }}
          >
            {question.difficulty.toUpperCase()}
          </span>
          <span className="points-badge">
            {question.points} pts
          </span>
        </div>

        {/* Timer */}
        {!isAnswered && (
          <div className="timer-container">
            <div
              className="timer-bar"
              style={{
                width: `${(timeRemaining / question.timeLimit) * 100}%`,
                backgroundColor: getTimerColor()
              }}
            />
            <span className="timer-text">{timeRemaining.toFixed(1)}s</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="question-text">
        <h2>{question.question}</h2>
      </div>

      {/* Options */}
      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(index)}
            onClick={() => !isAnswered && !eliminatedOptions.includes(index) && onSelectAnswer(index)}
            disabled={isAnswered || eliminatedOptions.includes(index)}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="option-text">{option}</span>
            {isAnswered && index === question.correctAnswer && (
              <span className="check-icon">✓</span>
            )}
            {isAnswered && index === selectedAnswer && index !== question.correctAnswer && (
              <span className="cross-icon">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {isAnswered && showExplanation && (
        <div className="explanation-box">
          <h3>Explanation</h3>
          <p>{question.explanation}</p>
        </div>
      )}

      <style>{`
        .question-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 30px;
          color: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .question-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .category-badge,
        .difficulty-badge,
        .points-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .timer-container {
          position: relative;
          width: 150px;
          height: 30px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          overflow: hidden;
        }

        .timer-bar {
          height: 100%;
          transition: width 0.1s linear, background-color 0.3s;
          border-radius: 15px;
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 700;
          font-size: 0.9rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .question-text {
          margin-bottom: 30px;
        }

        .question-text h2 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.6;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .options-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .quiz-option {
          background: rgba(255, 255, 255, 0.15);
          border: 3px solid transparent;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          font-size: 1rem;
          text-align: left;
          color: white;
        }

        .quiz-option:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .quiz-option:active:not(:disabled) {
          transform: translateY(0);
        }

        .quiz-option.selected {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .quiz-option.correct {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-color: #10b981;
          animation: correctPulse 0.6s ease-out;
        }

        .quiz-option.incorrect {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-color: #ef4444;
          animation: incorrectShake 0.5s ease-out;
        }

        .quiz-option.eliminated {
          opacity: 0.3;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.3);
        }

        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes incorrectShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .option-letter {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .option-text {
          flex: 1;
          font-weight: 500;
        }

        .check-icon,
        .cross-icon {
          font-size: 1.5rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .explanation-box {
          background: rgba(255, 255, 255, 0.15);
          border-left: 4px solid #10b981;
          border-radius: 10px;
          padding: 20px;
          animation: fadeIn 0.5s ease-out;
          backdrop-filter: blur(10px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .explanation-box h3 {
          margin: 0 0 10px 0;
          font-size: 1.1rem;
          color: #10b981;
        }

        .explanation-box p {
          margin: 0;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .question-card {
            padding: 20px;
          }

          .question-text h2 {
            font-size: 1.2rem;
          }

          .quiz-option {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};
