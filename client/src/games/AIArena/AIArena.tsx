import React, { useState, useEffect } from 'react';
import { scenarios, getScenarioById, Scenario } from './data/scenarios';
import { presetArchitectures, getArchitectureById, NetworkArchitecture } from './data/architectures';
import { useMLSimulation } from './hooks/useMLSimulation';
import { useTraining, useHyperparameters, useTournament } from './hooks/useTraining';
import { NetworkBuilder } from './components/NetworkBuilder';
import { TrainingVisualizer } from './components/TrainingVisualizer';
import { AIBattle } from './components/AIBattle';
import { PerformanceGraph } from './components/PerformanceGraph';
import { cloneNetwork, initializeNetwork } from './utils/neuralNetSimulator';

type GameMode = 'training' | 'battle' | 'tournament';

export const AIArena: React.FC = () => {
  // Core state
  const [gameMode, setGameMode] = useState<GameMode>('training');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [selectedArchitecture, setSelectedArchitecture] = useState<NetworkArchitecture>(
    presetArchitectures[1]
  );

  // ML Simulation
  const simulation = useMLSimulation(selectedScenario, selectedArchitecture);

  // Training visualization
  const training = useTraining();

  // Hyperparameters
  const hyperparams = useHyperparameters();

  // Tournament
  const tournament = useTournament();

  // Opponent network (for battles)
  const [opponentNetwork, setOpponentNetwork] = useState<any>(null);

  // UI state
  const [showScenarioInfo, setShowScenarioInfo] = useState(false);
  const [showArchitecturePanel, setShowArchitecturePanel] = useState(true);
  const [showVisualization, setShowVisualization] = useState(true);

  // Initialize simulation when scenario or architecture changes
  useEffect(() => {
    simulation.initializeSimulation();
  }, [selectedScenario.id, selectedArchitecture.id]);

  // Update visualization when network changes
  useEffect(() => {
    const network = simulation.getNetwork();
    if (network) {
      training.updateVisualization(network);
    }
  }, [simulation.currentEpisode]);

  // Trigger forward pass animation periodically during training
  useEffect(() => {
    if (simulation.isRunning && simulation.currentEpisode % 5 === 0) {
      const network = simulation.getNetwork();
      if (network) {
        training.animateForwardPass(network);
      }
    }
  }, [simulation.currentEpisode, simulation.isRunning]);

  // Initialize opponent network
  const initializeOpponent = () => {
    // Create a slightly different network for opponent
    const opponentArch = {
      ...selectedArchitecture,
      learningRate: selectedArchitecture.learningRate * 0.8
    };
    const network = initializeNetwork(opponentArch);
    setOpponentNetwork(network);
  };

  const handleScenarioChange = (scenarioId: number) => {
    const scenario = getScenarioById(scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
    }
  };

  const handleArchitectureChange = (archId: string) => {
    const arch = getArchitectureById(archId);
    if (arch) {
      setSelectedArchitecture(arch);
    }
  };

  const handleCustomArchitectureUpdate = (arch: NetworkArchitecture) => {
    setSelectedArchitecture(arch);
  };

  const handleSaveToTournament = () => {
    const network = simulation.getNetwork();
    if (network) {
      tournament.addParticipant(
        `ai_${Date.now()}`,
        `AI-${selectedArchitecture.name}-${simulation.getCurrentAccuracy().toFixed(2)}`,
        cloneNetwork(network)
      );
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 30px',
        background: 'rgba(0, 0, 0, 0.6)',
        borderBottom: '2px solid #8B5CF6',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              AI Training Arena
            </h1>
            <p style={{
              margin: '5px 0 0 0',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px'
            }}>
              Build, Train, and Battle AI Agents
            </p>
          </div>

          {/* Mode Selector */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['training', 'battle', 'tournament'] as GameMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setGameMode(mode)}
                style={{
                  padding: '10px 20px',
                  background: gameMode === mode
                    ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: gameMode === mode ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: gameMode === mode ? 'bold' : 'normal',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '300px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRight: '1px solid rgba(139, 92, 246, 0.3)',
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Scenario Selection */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#8B5CF6',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Training Scenario
            </h3>

            <select
              value={selectedScenario.id}
              onChange={(e) => handleScenarioChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '5px',
                color: 'white',
                fontSize: '12px',
                marginBottom: '10px'
              }}
            >
              {scenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name} ({scenario.difficulty})
                </option>
              ))}
            </select>

            <div style={{
              padding: '12px',
              background: `${selectedScenario.color}15`,
              border: `1px solid ${selectedScenario.color}`,
              borderRadius: '5px',
              fontSize: '11px'
            }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', color: selectedScenario.color }}>
                {selectedScenario.name}
              </div>
              <div style={{ marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {selectedScenario.description}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5px',
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <div>Type: {selectedScenario.type}</div>
                <div>Target: {(selectedScenario.targetAccuracy * 100).toFixed(0)}%</div>
                <div>Input: {selectedScenario.inputSize}</div>
                <div>Output: {selectedScenario.outputSize}</div>
              </div>
            </div>

            <button
              onClick={() => setShowScenarioInfo(!showScenarioInfo)}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '6px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              {showScenarioInfo ? 'Hide' : 'Show'} Details
            </button>

            {showScenarioInfo && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                fontSize: '10px',
                lineHeight: '1.6'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Objective:</strong> {selectedScenario.objective}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Reward:</strong> {selectedScenario.rewardStructure}
                </div>
                <div style={{
                  padding: '8px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  {selectedScenario.educationalNote}
                </div>
              </div>
            )}
          </div>

          {/* Architecture Selection */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#3B82F6',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Network Architecture
            </h3>

            <select
              value={selectedArchitecture.id}
              onChange={(e) => handleArchitectureChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '5px',
                color: 'white',
                fontSize: '12px',
                marginBottom: '10px'
              }}
            >
              {presetArchitectures.map(arch => (
                <option key={arch.id} value={arch.id}>
                  {arch.name}
                </option>
              ))}
            </select>

            <div style={{
              padding: '10px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '5px',
              fontSize: '10px',
              marginBottom: '10px'
            }}>
              <div style={{ marginBottom: '5px' }}>
                <strong>Complexity:</strong> {selectedArchitecture.complexity}
              </div>
              <div>
                <strong>Best for:</strong> {selectedArchitecture.bestFor.join(', ')}
              </div>
            </div>

            <button
              onClick={() => setShowArchitecturePanel(!showArchitecturePanel)}
              style={{
                width: '100%',
                padding: '6px',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              {showArchitecturePanel ? 'Hide' : 'Show'} Builder
            </button>
          </div>

          {/* Training Controls */}
          {gameMode === 'training' && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#10B981',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Training Controls
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!simulation.isRunning ? (
                  <button
                    onClick={simulation.startTraining}
                    disabled={!simulation.trainingState}
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: simulation.trainingState ? 'pointer' : 'not-allowed',
                      opacity: simulation.trainingState ? 1 : 0.5
                    }}
                  >
                    Start Training
                  </button>
                ) : (
                  <button
                    onClick={simulation.pauseTraining}
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Pause Training
                  </button>
                )}

                <button
                  onClick={simulation.resetTraining}
                  style={{
                    padding: '10px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #EF4444',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Reset Network
                </button>
              </div>

              {/* Training Progress */}
              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '6px',
                fontSize: '11px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Progress:</span>
                    <span style={{ color: '#8B5CF6' }}>
                      {simulation.currentEpisode}/{simulation.maxEpisodes}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${simulation.progress * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>
                      Accuracy
                    </div>
                    <div style={{
                      color: '#10B981',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      {(simulation.getCurrentAccuracy() * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>
                      Loss
                    </div>
                    <div style={{
                      color: '#EF4444',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      {simulation.getCurrentLoss().toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>
                      Convergence
                    </div>
                    <div style={{
                      color: '#F59E0B',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {(simulation.convergenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>
                      Overfitting
                    </div>
                    <div style={{
                      color: simulation.overfittingRisk > 0.6 ? '#EF4444' : '#10B981',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {(simulation.overfittingRisk * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Save to Tournament */}
              <button
                onClick={handleSaveToTournament}
                disabled={!simulation.getNetwork()}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid #FBBF24',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '11px',
                  cursor: simulation.getNetwork() ? 'pointer' : 'not-allowed',
                  opacity: simulation.getNetwork() ? 1 : 0.5
                }}
              >
                Save AI to Tournament
              </button>
            </div>
          )}

          {/* Battle Controls */}
          {gameMode === 'battle' && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#F59E0B',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Battle Setup
              </h3>

              <button
                onClick={initializeOpponent}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(59, 130, 246, 0.3)',
                  border: '1px solid #3B82F6',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                Initialize Opponent AI
              </button>

              <div style={{
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                fontSize: '10px'
              }}>
                <div style={{ marginBottom: '5px' }}>
                  Your AI: {simulation.getNetwork() ? 'Ready' : 'Not trained'}
                </div>
                <div>
                  Opponent: {opponentNetwork ? 'Ready' : 'Not initialized'}
                </div>
              </div>
            </div>
          )}

          {/* Tournament Info */}
          {gameMode === 'tournament' && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#EC4899',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Tournament
              </h3>

              <div style={{
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                fontSize: '11px',
                marginBottom: '10px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  Participants: {tournament.participants.length}
                </div>
                {tournament.participants.length < 2 && (
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>
                    Train and save at least 2 AIs to start a tournament
                  </div>
                )}
              </div>

              {tournament.participants.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    padding: '8px',
                    background: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    borderRadius: '4px',
                    marginBottom: '5px',
                    fontSize: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{p.name}</span>
                  <div>
                    <span style={{ marginRight: '8px', color: '#FBBF24' }}>
                      Score: {p.score}
                    </span>
                    <button
                      onClick={() => tournament.removeParticipant(p.id)}
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(239, 68, 68, 0.5)',
                        border: 'none',
                        borderRadius: '3px',
                        color: 'white',
                        fontSize: '9px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {!tournament.isActive && tournament.participants.length >= 2 && (
                <button
                  onClick={tournament.startTournament}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #EC4899, #BE185D)',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Start Tournament
                </button>
              )}

              {tournament.isActive && (
                <button
                  onClick={tournament.resetTournament}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(239, 68, 68, 0.3)',
                    border: '1px solid #EF4444',
                    borderRadius: '5px',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Reset Tournament
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top Panel - Network Visualization */}
          <div style={{
            flex: showVisualization ? 1 : 0,
            padding: '20px',
            borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
            overflow: 'auto',
            transition: 'flex 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                color: '#8B5CF6'
              }}>
                Neural Network Visualization
              </h3>
              <button
                onClick={() => setShowVisualization(!showVisualization)}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {showVisualization ? 'Hide' : 'Show'}
              </button>
            </div>

            {showVisualization && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TrainingVisualizer
                  visualization={training.visualization}
                  animatedNeurons={training.animatedNeurons}
                  animatedConnections={training.animatedConnections}
                  width={800}
                  height={400}
                  showLabels={true}
                />
              </div>
            )}
          </div>

          {/* Bottom Panel - Mode-specific content */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflow: 'auto',
            display: 'flex',
            gap: '20px'
          }}>
            {gameMode === 'training' && (
              <>
                {/* Performance Graph */}
                <div style={{ flex: 2 }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    fontSize: '16px',
                    color: '#10B981'
                  }}>
                    Training Performance
                  </h3>
                  <PerformanceGraph
                    episodes={simulation.getEpisodes()}
                    targetAccuracy={selectedScenario.targetAccuracy}
                    width={600}
                    height={300}
                    showLegend={true}
                  />

                  {/* Educational Tips */}
                  <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: '#8B5CF6'
                    }}>
                      ML Insights
                    </div>
                    {simulation.overfittingRisk > 0.6 && (
                      <div style={{
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}>
                        High overfitting risk detected! Your model is memorizing training data instead of learning patterns. Try reducing network complexity or adding regularization.
                      </div>
                    )}
                    {simulation.convergenceScore > 0.8 && simulation.getCurrentAccuracy() >= selectedScenario.targetAccuracy && (
                      <div style={{
                        padding: '8px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}>
                        Excellent! Your model has converged and reached the target accuracy. This AI is ready for battle!
                      </div>
                    )}
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontStyle: 'italic'
                    }}>
                      {selectedScenario.educationalNote}
                    </div>
                  </div>
                </div>

                {/* Network Builder */}
                {showArchitecturePanel && (
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 15px 0',
                      fontSize: '16px',
                      color: '#3B82F6'
                    }}>
                      Architecture Builder
                    </h3>
                    <NetworkBuilder
                      architecture={selectedArchitecture}
                      onArchitectureChange={handleCustomArchitectureUpdate}
                      readonly={simulation.isRunning}
                    />
                  </div>
                )}
              </>
            )}

            {gameMode === 'battle' && (
              <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto' }}>
                <AIBattle
                  network1={simulation.getNetwork()}
                  network2={opponentNetwork}
                  scenario={selectedScenario}
                  architecture={selectedArchitecture}
                  onBattleComplete={(winner) => {
                    console.log('Battle complete, winner:', winner);
                  }}
                />
              </div>
            )}

            {gameMode === 'tournament' && (
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  textAlign: 'center',
                  color: '#EC4899'
                }}>
                  Tournament Arena
                </h3>

                {tournament.isActive && tournament.currentMatch ? (
                  <div style={{
                    padding: '30px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    border: '2px solid rgba(236, 72, 153, 0.5)'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '16px',
                      marginBottom: '20px',
                      color: '#FBBF24'
                    }}>
                      Match {tournament.currentMatch.round + 1} / {tournament.bracket.length}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      marginBottom: '30px'
                    }}>
                      <div style={{
                        padding: '20px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '2px solid #10B981',
                        borderRadius: '10px',
                        textAlign: 'center',
                        flex: 1,
                        maxWidth: '200px'
                      }}>
                        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                          {tournament.participants[tournament.currentMatch.participant1]?.name}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                          {tournament.participants[tournament.currentMatch.participant1]?.score || 0}
                        </div>
                      </div>

                      <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 30px' }}>
                        VS
                      </div>

                      <div style={{
                        padding: '20px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '2px solid #3B82F6',
                        borderRadius: '10px',
                        textAlign: 'center',
                        flex: 1,
                        maxWidth: '200px'
                      }}>
                        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                          {tournament.participants[tournament.currentMatch.participant2]?.name}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>
                          {tournament.participants[tournament.currentMatch.participant2]?.score || 0}
                        </div>
                      </div>
                    </div>

                    {/* Simulate match */}
                    <button
                      onClick={() => {
                        const winner = Math.random() > 0.5
                          ? tournament.participants[tournament.currentMatch!.participant1].id
                          : tournament.participants[tournament.currentMatch!.participant2].id;
                        tournament.recordMatchResult(winner);
                      }}
                      style={{
                        width: '100%',
                        padding: '15px',
                        background: 'linear-gradient(135deg, #EC4899, #BE185D)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Simulate Match
                    </button>
                  </div>
                ) : tournament.participants.length >= 2 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    Click "Start Tournament" in the sidebar to begin
                  </div>
                ) : (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    Train and save at least 2 AI agents to start a tournament
                  </div>
                )}

                {/* Leaderboard */}
                {tournament.participants.length > 0 && (
                  <div style={{ marginTop: '30px' }}>
                    <h4 style={{
                      margin: '0 0 15px 0',
                      fontSize: '14px',
                      color: '#FBBF24'
                    }}>
                      Leaderboard
                    </h4>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      {[...tournament.participants]
                        .sort((a, b) => b.score - a.score)
                        .map((p, i) => (
                          <div
                            key={p.id}
                            style={{
                              padding: '12px 15px',
                              background: i === 0 ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                              borderBottom: i < tournament.participants.length - 1
                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                : 'none',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: i === 0 ? '#FBBF24' : 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '11px'
                              }}>
                                {i + 1}
                              </div>
                              <span>{p.name}</span>
                            </div>
                            <div style={{
                              fontWeight: 'bold',
                              color: i === 0 ? '#FBBF24' : 'white'
                            }}>
                              {p.score} pts
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {simulation.isComplete && simulation.targetReached && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
            border: '2px solid #8B5CF6',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '500px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              🎉
            </div>
            <h2 style={{
              margin: '0 0 15px 0',
              fontSize: '28px',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Target Achieved!
            </h2>
            <p style={{
              margin: '0 0 25px 0',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px'
            }}>
              Your AI has successfully learned the task with {(simulation.getCurrentAccuracy() * 100).toFixed(1)}% accuracy!
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  handleSaveToTournament();
                  simulation.resetTraining();
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Save & Start New
              </button>
              <button
                onClick={() => setGameMode('battle')}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(251, 191, 36, 0.3)',
                  border: '1px solid #FBBF24',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Go to Battle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIArena;
