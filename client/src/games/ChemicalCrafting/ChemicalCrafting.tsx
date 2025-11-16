import React, { useState, useEffect } from 'react';
import { useChemistry, GameMode } from './hooks/useChemistry';
import { PeriodicTable } from './components/PeriodicTable';
import { MoleculeBuilder } from './components/MoleculeBuilder';
import { BondingVisualizer } from './components/BondingVisualizer';
import { ReactionDisplay } from './components/ReactionDisplay';

export const ChemicalCrafting: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hints, setHints] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { state, actions, validation, formula, molarMass } = useChemistry('campaign');

  useEffect(() => {
    // Reset correct state when level changes
    setIsCorrect(null);
    setHints([]);
  }, [state.level]);

  const handleSubmit = () => {
    actions.submitMolecule();

    if (state.targetCompound && validation?.isValid) {
      // Check if molecule matches target
      const targetFormula = state.targetCompound.formula;
      const correct = formula === targetFormula;
      setIsCorrect(correct);

      if (correct) {
        setTimeout(() => {
          actions.nextLevel();
          setIsCorrect(null);
          setHints([]);
        }, 3000);
      }
    } else {
      setIsCorrect(false);
    }
  };

  const handleUseHint = () => {
    const newHints = actions.useHint();
    setHints(prev => [...prev, ...newHints]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showInstructions) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: 800,
          backgroundColor: '#1a1a1a',
          borderRadius: 12,
          padding: 40,
          border: '2px solid #4ECDC4',
        }}>
          <h1 style={{
            textAlign: 'center',
            color: '#FFD700',
            marginBottom: 30,
            fontSize: 48,
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}>
            Chemical Compound Crafting
          </h1>

          <div style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 30 }}>
            <h2 style={{ color: '#4ECDC4', marginBottom: 15 }}>Welcome, Chemist!</h2>
            <p>
              Master the art of molecular synthesis by combining atoms to create target compounds.
              Use real chemistry principles including valence electrons, chemical bonds, and molecular geometry.
            </p>

            <h3 style={{ color: '#4ECDC4', marginTop: 25, marginBottom: 15 }}>Features:</h3>
            <ul style={{ paddingLeft: 25 }}>
              <li>30 levels from simple to complex molecules</li>
              <li>Real chemistry: valence electrons, bonds, molecular geometry</li>
              <li>Reaction animations (exothermic, endothermic)</li>
              <li>Periodic table integration</li>
              <li>Time-based competitive mode</li>
              <li>Daily compound challenges</li>
              <li>3D molecular visualization</li>
              <li>pH and states of matter mechanics</li>
            </ul>

            <h3 style={{ color: '#4ECDC4', marginTop: 25, marginBottom: 15 }}>How to Play:</h3>
            <ol style={{ paddingLeft: 25 }}>
              <li>Select an element from the periodic table</li>
              <li>Click in the molecule builder to place atoms</li>
              <li>Click on atoms to create bonds between them</li>
              <li>Use the bond type selector to create single, double, or triple bonds</li>
              <li>Submit your molecule when it matches the target compound</li>
              <li>Progress through 30 increasingly challenging levels</li>
            </ol>

            <h3 style={{ color: '#4ECDC4', marginTop: 25, marginBottom: 15 }}>Controls:</h3>
            <ul style={{ paddingLeft: 25 }}>
              <li><strong>Left-click:</strong> Place atoms or create bonds</li>
              <li><strong>Right-click:</strong> Delete atoms</li>
              <li><strong>Drag:</strong> Rotate molecule view</li>
              <li><strong>Scroll:</strong> Zoom in/out</li>
              <li><strong>Hints:</strong> Get help when stuck (limited per level)</li>
            </ul>
          </div>

          <div style={{
            display: 'flex',
            gap: 15,
            marginTop: 30,
          }}>
            <button
              onClick={() => {
                actions.changeMode('campaign');
                setShowInstructions(false);
              }}
              style={{
                flex: 1,
                padding: '20px 40px',
                backgroundColor: '#4ECDC4',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3DB8A8';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4ECDC4';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start Campaign
            </button>

            <button
              onClick={() => {
                actions.changeMode('sandbox');
                setShowInstructions(false);
              }}
              style={{
                flex: 1,
                padding: '20px 40px',
                backgroundColor: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E6C200';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFD700';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Sandbox Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.isComplete && state.lives <= 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: 600,
          backgroundColor: '#1a1a1a',
          borderRadius: 12,
          padding: 40,
          border: '2px solid #FF6B6B',
          textAlign: 'center',
        }}>
          <h1 style={{
            color: '#FF6B6B',
            marginBottom: 20,
            fontSize: 48,
          }}>
            Game Over
          </h1>
          <p style={{ fontSize: 18, marginBottom: 30 }}>
            You ran out of lives at Level {state.level}
          </p>
          <div style={{ fontSize: 24, color: '#FFD700', marginBottom: 30 }}>
            Final Score: {state.score}
          </div>
          <button
            onClick={() => {
              actions.resetLevel();
              setIsCorrect(null);
              setHints([]);
            }}
            style={{
              padding: '15px 40px',
              backgroundColor: '#4ECDC4',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      padding: 20,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '2px solid #4ECDC4',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            color: '#FFD700',
            fontSize: 32,
            textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          }}>
            Chemical Crafting
          </h1>
          <div style={{ fontSize: 14, color: '#999', marginTop: 5 }}>
            {state.mode === 'campaign' ? `Level ${state.level}` : state.mode.charAt(0).toUpperCase() + state.mode.slice(1)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 30,
          alignItems: 'center',
        }}>
          {state.mode === 'campaign' && (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#999' }}>Score</div>
                <div style={{ fontSize: 24, color: '#FFD700', fontWeight: 'bold' }}>
                  {state.score}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#999' }}>Lives</div>
                <div style={{ fontSize: 24, color: '#FF6B6B', fontWeight: 'bold' }}>
                  {'❤️'.repeat(state.lives)}
                </div>
              </div>
            </>
          )}

          {state.mode === 'time-trial' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>Time</div>
              <div style={{
                fontSize: 24,
                color: state.timeRemaining < 30 ? '#FF6B6B' : '#4ECDC4',
                fontWeight: 'bold',
              }}>
                {formatTime(state.timeRemaining)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowInstructions(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Instructions
            </button>

            <button
              onClick={actions.clearMolecule}
              style={{
                padding: '10px 20px',
                backgroundColor: '#FF6B6B',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: 20,
      }}>
        {/* Left column - Periodic Table */}
        <div>
          <PeriodicTable
            availableElements={state.availableElements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            elementsUsed={state.elementsUsed}
            showAll={state.mode === 'sandbox'}
          />
        </div>

        {/* Center column - Molecule Builder */}
        <div>
          <MoleculeBuilder
            atoms={state.currentMolecule.atoms}
            bonds={state.currentMolecule.bonds}
            onAddAtom={actions.addAtom}
            onRemoveAtom={actions.removeAtom}
            onAddBond={actions.addBond}
            onRemoveBond={actions.removeBond}
            selectedElement={selectedElement}
          />

          {/* Validation feedback */}
          {validation && !validation.isValid && (
            <div style={{
              marginTop: 15,
              padding: 15,
              backgroundColor: '#FF6B6B',
              color: '#fff',
              borderRadius: 8,
            }}>
              <strong>Errors:</strong>
              <ul style={{ margin: '10px 0 0 0', paddingLeft: 20 }}>
                {validation.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validation && validation.warnings.length > 0 && (
            <div style={{
              marginTop: 15,
              padding: 15,
              backgroundColor: '#FFD700',
              color: '#000',
              borderRadius: 8,
            }}>
              <strong>Warnings:</strong>
              <ul style={{ margin: '10px 0 0 0', paddingLeft: 20 }}>
                {validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column - Info panels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <ReactionDisplay
            targetCompound={state.targetCompound}
            currentFormula={formula}
            currentMolarMass={molarMass}
            isCorrect={isCorrect}
            onSubmit={handleSubmit}
            hints={hints}
            onUseHint={handleUseHint}
            canUseHint={state.hintsUsed < 3}
          />

          {state.currentMolecule.atoms.length > 0 && (
            <BondingVisualizer
              atoms={state.currentMolecule.atoms}
              bonds={state.currentMolecule.bonds}
            />
          )}
        </div>
      </div>

      {/* Pause overlay */}
      {state.isPaused && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 40,
            borderRadius: 12,
            border: '2px solid #4ECDC4',
            textAlign: 'center',
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: 20 }}>Paused</h2>
            <button
              onClick={actions.resumeGame}
              style={{
                padding: '15px 40px',
                backgroundColor: '#4ECDC4',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChemicalCrafting;
