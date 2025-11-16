import React, { useState, useRef, useEffect } from 'react';
import { levels, getLevelById, NeurotransmitterType, neurotransmitters } from './data/levels';
import { getBrainRegionById } from './data/brainRegions';
import { useNeuralLogic } from './hooks/useNeuralLogic';
import { useSignalPropagation, useSynapseDrag, useNeuronFireEffect } from './hooks/useSignalPropagation';
import { Neuron } from './components/Neuron';
import { Synapse, TempSynapse } from './components/Synapse';
import { SignalAnimation, ParticleField, NeuronBurst } from './components/SignalAnimation';
import { BrainRegion, BrainRegionInfo } from './components/BrainRegion';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export const NeuroNetwork: React.FC = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [selectedNeurotransmitter, setSelectedNeurotransmitter] = useState<NeurotransmitterType | undefined>(undefined);
  const [showBrainRegionInfo, setShowBrainRegionInfo] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [hoveredNeuronId, setHoveredNeuronId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentLevel = getLevelById(currentLevelId);
  const brainRegion = currentLevel ? getBrainRegionById(currentLevel.brainRegion) : null;

  const {
    gameState,
    playerSynapses,
    isRunning,
    isComplete,
    constraintsMet,
    violations,
    score,
    addSynapse,
    removeSynapse,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    activateInputNeuron,
    getSuggestedConnections,
    hasValidPath
  } = useNeuralLogic(currentLevel!);

  const { visualSignals, particles, neuronPulses } = useSignalPropagation(
    gameState?.signals || [],
    currentLevel?.neurons || []
  );

  const { dragState, startDrag, updateDrag, endDrag } = useSynapseDrag();
  const { bursts, createBurst } = useNeuronFireEffect();

  // Track previous neuron activation counts to detect new fires
  const prevActivationsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!gameState) return;

    gameState.neurons.forEach((state, neuronId) => {
      const prevCount = prevActivationsRef.current.get(neuronId) || 0;
      if (state.timesActivated > prevCount) {
        // Neuron just fired!
        const neuron = currentLevel?.neurons.find(n => n.id === neuronId);
        if (neuron) {
          createBurst(neuronId, neuron.x, neuron.y);
        }
      }
      prevActivationsRef.current.set(neuronId, state.timesActivated);
    });
  }, [gameState, currentLevel, createBurst]);

  if (!currentLevel || !brainRegion) {
    return <div>Loading...</div>;
  }

  const allSynapses = [...currentLevel.existingSynapses, ...playerSynapses];

  const handleNeuronMouseDown = (neuronId: string, x: number, y: number) => {
    if (isRunning) return;

    const neuron = currentLevel.neurons.find(n => n.id === neuronId);
    if (neuron?.type === 'output') return; // Can't create synapses from output

    startDrag(neuronId, x, y);
  };

  const handleNeuronMouseUp = (neuronId: string) => {
    if (!dragState.isDragging || !dragState.fromNeuronId) return;

    if (dragState.fromNeuronId !== neuronId) {
      // Create synapse
      const success = addSynapse(
        dragState.fromNeuronId,
        neuronId,
        selectedNeurotransmitter
      );

      if (!success) {
        // Show error feedback
        console.log('Cannot create synapse');
      }
    }

    endDrag();
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragState.isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateDrag(x, y);
  };

  const handleSvgMouseUp = () => {
    if (dragState.isDragging) {
      endDrag();
    }
  };

  const handleNeuronClick = (neuronId: string) => {
    if (isRunning) return;

    const neuron = currentLevel.neurons.find(n => n.id === neuronId);
    if (neuron?.type === 'input') {
      // Fire input neuron
      activateInputNeuron(neuronId);
    }
  };

  const handleSynapseClick = (synapseId: string) => {
    if (isRunning) return;

    // Check if it's a player synapse
    if (playerSynapses.some(s => s.id === synapseId)) {
      removeSynapse(synapseId);
    }
  };

  const handleStartSimulation = () => {
    if (!hasValidPath()) {
      alert('No valid path from inputs to outputs! Create connections first.');
      return;
    }
    startSimulation();
  };

  const handleNextLevel = () => {
    if (currentLevelId < levels.length) {
      setCurrentLevelId(currentLevelId + 1);
      resetSimulation();
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelId > 1) {
      setCurrentLevelId(currentLevelId - 1);
      resetSimulation();
    }
  };

  const timeRemaining = currentLevel.constraints.timeLimit
    ? Math.max(0, currentLevel.constraints.timeLimit - (gameState?.time || 0))
    : null;

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#0a0a0a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderBottom: `2px solid ${brainRegion.color}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: brainRegion.color }}>
              NeuroNetwork
            </h1>
            <p style={{ margin: '5px 0', color: 'rgba(255, 255, 255, 0.7)' }}>
              Level {currentLevelId}: {currentLevel.name}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: brainRegion.color }}>
              Score: {score}
            </div>
            {timeRemaining !== null && (
              <div style={{ fontSize: '16px', color: timeRemaining < 3000 ? '#EF4444' : 'white' }}>
                Time: {(timeRemaining / 1000).toFixed(1)}s
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRight: `1px solid ${brainRegion.color}`,
          padding: '20px',
          overflowY: 'auto'
        }}>
          {/* Brain region info */}
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            background: brainRegion.backgroundColor,
            border: `1px solid ${brainRegion.color}`,
            borderRadius: '5px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: brainRegion.color }}>
              {brainRegion.name}
            </h3>
            <button
              onClick={() => setShowBrainRegionInfo(true)}
              style={{
                background: brainRegion.color,
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Learn More
            </button>
          </div>

          {/* Level info */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: brainRegion.color }}>Objective:</h4>
            <p style={{ fontSize: '12px', lineHeight: '1.5' }}>
              {currentLevel.description}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '10px' }}>
              Concept: {currentLevel.concept}
            </p>
          </div>

          {/* Constraints */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: brainRegion.color }}>Constraints:</h4>
            <ul style={{ fontSize: '12px', paddingLeft: '20px', margin: '5px 0' }}>
              {currentLevel.constraints.maxSynapses && (
                <li>Max synapses: {playerSynapses.length}/{currentLevel.constraints.maxSynapses}</li>
              )}
              {currentLevel.constraints.requiredNeurotransmitters && (
                <li>Required: {currentLevel.constraints.requiredNeurotransmitters.join(', ')}</li>
              )}
              {currentLevel.constraints.timeLimit && (
                <li>Time limit: {currentLevel.constraints.timeLimit / 1000}s</li>
              )}
            </ul>
            {!constraintsMet && violations.length > 0 && (
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '3px' }}>
                {violations.map((v, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#EF4444' }}>⚠ {v}</div>
                ))}
              </div>
            )}
          </div>

          {/* Neurotransmitter selection */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: brainRegion.color }}>Neurotransmitters:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {currentLevel.availableNeurotransmitters.map(nt => {
                const ntData = neurotransmitters[nt];
                return (
                  <button
                    key={nt}
                    onClick={() => setSelectedNeurotransmitter(selectedNeurotransmitter === nt ? undefined : nt)}
                    style={{
                      padding: '8px',
                      background: selectedNeurotransmitter === nt ? ntData.color : 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${ntData.color}`,
                      borderRadius: '3px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{ntData.name}</div>
                    <div style={{ fontSize: '9px', opacity: 0.8 }}>{ntData.effect}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: brainRegion.color }}>Controls:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {!isRunning ? (
                <button
                  onClick={handleStartSimulation}
                  disabled={!hasValidPath()}
                  style={{
                    padding: '10px',
                    background: hasValidPath() ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '3px',
                    color: 'white',
                    cursor: hasValidPath() ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold'
                  }}
                >
                  Start Simulation
                </button>
              ) : (
                <button
                  onClick={pauseSimulation}
                  style={{
                    padding: '10px',
                    background: '#F59E0B',
                    border: 'none',
                    borderRadius: '3px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Pause
                </button>
              )}

              <button
                onClick={resetSimulation}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '3px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.4' }}>
            <p>Drag from neuron to neuron to create synapses.</p>
            <p>Click input neurons to fire them.</p>
            <p>Click player synapses to delete them.</p>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg
            ref={svgRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{
              width: '100%',
              height: '100%',
              background: brainRegion.backgroundColor
            }}
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
          >
            {/* Brain region background */}
            <BrainRegion region={brainRegion} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} showInfo={false} />

            {/* Synapses */}
            {allSynapses.map(synapse => {
              const fromNeuron = currentLevel.neurons.find(n => n.id === synapse.from);
              const toNeuron = currentLevel.neurons.find(n => n.id === synapse.to);

              if (!fromNeuron || !toNeuron) return null;

              const isPlayerCreated = playerSynapses.some(s => s.id === synapse.id);

              return (
                <Synapse
                  key={synapse.id}
                  synapse={synapse}
                  fromNeuron={fromNeuron}
                  toNeuron={toNeuron}
                  isPlayerCreated={isPlayerCreated}
                  onClick={handleSynapseClick}
                  brainRegionColor={brainRegion.synapseColor}
                />
              );
            })}

            {/* Temporary synapse while dragging */}
            {dragState.isDragging && dragState.fromNeuronId && (
              <TempSynapse
                fromX={currentLevel.neurons.find(n => n.id === dragState.fromNeuronId)?.x || 0}
                fromY={currentLevel.neurons.find(n => n.id === dragState.fromNeuronId)?.y || 0}
                toX={dragState.currentX}
                toY={dragState.currentY}
                color={selectedNeurotransmitter ? neurotransmitters[selectedNeurotransmitter].color : brainRegion.color}
              />
            )}

            {/* Signals */}
            {visualSignals.map(signal => (
              <SignalAnimation key={signal.id} signal={signal} />
            ))}

            {/* Particles */}
            <ParticleField particles={particles} />

            {/* Neuron fire bursts */}
            {bursts.map(burst => {
              const neuron = currentLevel.neurons.find(n => n.id === burst.neuronId);
              return (
                <NeuronBurst
                  key={burst.id}
                  x={burst.x}
                  y={burst.y}
                  color={brainRegion.neuronColor}
                  startTime={burst.startTime}
                />
              );
            })}

            {/* Neurons */}
            {currentLevel.neurons.map(neuron => {
              const state = gameState?.neurons.get(neuron.id);
              const pulseIntensity = neuronPulses.get(neuron.id) || 0;

              return (
                <Neuron
                  key={neuron.id}
                  neuron={neuron}
                  state={state}
                  pulseIntensity={pulseIntensity}
                  onMouseDown={handleNeuronMouseDown}
                  onMouseUp={handleNeuronMouseUp}
                  onMouseEnter={setHoveredNeuronId}
                  onClick={handleNeuronClick}
                  brainRegionColor={brainRegion.neuronColor}
                  showTooltip={showTooltips}
                />
              );
            })}
          </svg>

          {/* Educational tooltip */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: `1px solid ${brainRegion.color}`,
            borderRadius: '5px',
            padding: '15px',
            fontSize: '12px',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: brainRegion.color }}>💡 Did you know?</strong> {currentLevel.educationalTooltip}
          </div>

          {/* Completion overlay */}
          {isComplete && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.95)',
                border: `3px solid ${brainRegion.color}`,
                borderRadius: '10px',
                padding: '40px',
                textAlign: 'center',
                maxWidth: '400px'
              }}>
                <h2 style={{ color: brainRegion.color, marginBottom: '20px' }}>
                  Level Complete!
                </h2>
                <div style={{ fontSize: '32px', marginBottom: '20px' }}>
                  Score: {score}
                </div>
                <div style={{ marginBottom: '30px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {score >= currentLevel.targetScore ? (
                    <p>Outstanding! You achieved the target score!</p>
                  ) : (
                    <p>Good job! Try to beat the target score of {currentLevel.targetScore}!</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={resetSimulation}
                    style={{
                      padding: '15px 30px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Retry
                  </button>
                  {currentLevelId < levels.length && (
                    <button
                      onClick={handleNextLevel}
                      style={{
                        padding: '15px 30px',
                        background: brainRegion.color,
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Next Level
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Level navigation */}
      <div style={{
        padding: '10px 20px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderTop: `1px solid ${brainRegion.color}`,
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <button
          onClick={handlePrevLevel}
          disabled={currentLevelId === 1}
          style={{
            padding: '8px 20px',
            background: currentLevelId > 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '3px',
            color: 'white',
            cursor: currentLevelId > 1 ? 'pointer' : 'not-allowed'
          }}
        >
          ← Previous
        </button>

        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Level {currentLevelId} / {levels.length}
        </div>

        <button
          onClick={handleNextLevel}
          disabled={currentLevelId === levels.length}
          style={{
            padding: '8px 20px',
            background: currentLevelId < levels.length ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '3px',
            color: 'white',
            cursor: currentLevelId < levels.length ? 'pointer' : 'not-allowed'
          }}
        >
          Next →
        </button>
      </div>

      {/* Brain region info modal */}
      {showBrainRegionInfo && (
        <BrainRegionInfo
          region={brainRegion}
          onClose={() => setShowBrainRegionInfo(false)}
        />
      )}
    </div>
  );
};

export default NeuroNetwork;
