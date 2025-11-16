/**
 * Quantum Chess - Tutorial Modal Component
 * Educational tutorial explaining quantum mechanics concepts
 */

import React, { useState } from 'react';

interface TutorialStep {
  title: string;
  content: string;
  concept: string;
  example: string;
  icon: string;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel?: number;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Quantum Chess!',
    concept: 'Introduction',
    icon: '⚛️',
    content: 'In Quantum Chess, pieces can exist in multiple positions simultaneously, just like particles in quantum mechanics. This is called superposition.',
    example: 'Instead of moving to just one square, your piece can be in two places at once with different probabilities!'
  },
  {
    title: 'Superposition',
    concept: 'Wave-Particle Duality',
    icon: '🌊',
    content: 'When you move a piece, you can create a superposition by holding SHIFT while clicking the target square. The piece will exist in both its original position and the new position.',
    example: 'Move a pawn and hold SHIFT - it will appear as a solid piece at one location and a "ghost" piece at another, each with a probability of being there when measured.'
  },
  {
    title: 'Measurement & Collapse',
    concept: 'Observer Effect',
    icon: '👁️',
    content: 'Observing a quantum state causes it to collapse! Right-click any piece in superposition to measure it, forcing it to choose one definite position based on probability.',
    example: 'If a piece has 70% probability at square A and 30% at square B, measurement will more likely place it at A, but B is still possible!'
  },
  {
    title: 'Quantum Entanglement',
    concept: 'Spooky Action at a Distance',
    icon: '🔗',
    content: 'Pieces that move near each other can become entangled (marked with ⚛). When one entangled piece is measured, it affects its partner instantly!',
    example: 'Entangled pieces share quantum information. Moving or measuring one can influence the other, even across the board.'
  },
  {
    title: 'Quantum Tunneling',
    concept: 'Barrier Penetration',
    icon: '🌀',
    content: 'Quantum particles can "tunnel" through barriers! Random tunneling events may occur, giving pieces a small probability to appear in unexpected locations.',
    example: 'Your piece might spontaneously gain a quantum state in a nearby square, allowing it to phase through other pieces!'
  },
  {
    title: 'Wave Interference',
    concept: 'Probability Amplitudes',
    icon: '〰️',
    content: 'When multiple pieces overlap in superposition, their quantum waves interfere! This reduces the probability of finding any piece at that location.',
    example: 'Having two pieces with superposition at the same square decreases both their probabilities there - quantum uncertainty at work!'
  },
  {
    title: 'Decoherence',
    concept: 'Quantum to Classical Transition',
    icon: '⚡',
    content: 'Quantum states decay over time through decoherence. The longer a piece stays in superposition, the more likely it is to collapse to its most probable position.',
    example: 'The decoherence meter shows how much quantum information is being lost. High decoherence causes automatic collapse!'
  },
  {
    title: 'Strategy Tips',
    concept: 'Quantum Tactics',
    icon: '🎯',
    content: 'Use superposition to threaten multiple pieces at once! Create entanglement for coordinated attacks. Measure opponent pieces to eliminate their quantum advantage.',
    example: 'A queen in superposition at 3 locations can attack from all of them simultaneously until measured!'
  },
  {
    title: 'Game Modes',
    concept: 'How to Play',
    icon: '🎮',
    content: 'Tutorial: Learn basics | Levels: 10 progressive challenges | VS AI: Battle quantum AI | Multiplayer: Challenge a friend',
    example: 'Each level introduces new quantum concepts. Master them all to become a Quantum Chess Champion!'
  },
  {
    title: 'Controls',
    concept: 'Quick Reference',
    icon: '⌨️',
    content: 'Click to select piece\nClick square to move\nSHIFT+Click to create superposition\nRight-click piece to measure\nESC to deselect',
    example: 'Practice these controls and experiment! Quantum mechanics is all about probability - unexpected things will happen!'
  }
];

const levelConcepts = [
  { level: 1, focus: 'Basic movement and superposition' },
  { level: 2, focus: 'Understanding probability' },
  { level: 3, focus: 'Measurement and collapse' },
  { level: 4, focus: 'Creating strategic superpositions' },
  { level: 5, focus: 'Quantum entanglement' },
  { level: 6, focus: 'Tunneling events' },
  { level: 7, focus: 'Wave interference' },
  { level: 8, focus: 'Managing decoherence' },
  { level: 9, focus: 'Advanced quantum tactics' },
  { level: 10, focus: 'Quantum mastery challenge' }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  currentLevel
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step.icon} {step.title}</h2>
          <button className="close-button" onClick={handleSkip}>✕</button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span className="progress-text">
            {currentStep + 1} / {tutorialSteps.length}
          </span>
        </div>

        <div className="modal-content">
          <div className="concept-badge">{step.concept}</div>

          <div className="content-section">
            <h3>Concept</h3>
            <p>{step.content}</p>
          </div>

          <div className="example-section">
            <h3>Example</h3>
            <p className="example-text">{step.example}</p>
          </div>

          {currentLevel !== undefined && (
            <div className="level-info">
              <h3>Level {currentLevel} Focus</h3>
              <p>{levelConcepts[currentLevel - 1]?.focus}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>

          <button className="btn-skip" onClick={handleSkip}>
            Skip Tutorial
          </button>

          <button className="btn-primary" onClick={handleNext}>
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>

        <div className="quantum-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
