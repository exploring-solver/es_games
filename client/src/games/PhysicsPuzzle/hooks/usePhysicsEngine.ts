import { useEffect, useRef, useState, useCallback } from 'react';
import { PhysicsSimulation, Vector2D, ForceVector } from '../utils/physicsSimulation';
import { PhysicsObject, PuzzleLevel } from '../data/puzzles';

export interface PhysicsState {
  isPaused: boolean;
  isRunning: boolean;
  time: number;
  collisions: { bodyA: string; bodyB: string }[];
}

export const usePhysicsEngine = () => {
  const simulationRef = useRef<PhysicsSimulation>(new PhysicsSimulation());
  const [state, setState] = useState<PhysicsState>({
    isPaused: false,
    isRunning: false,
    time: 0,
    collisions: [],
  });
  const [forceVectors, setForceVectors] = useState<ForceVector[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Initialize physics world
  const initialize = useCallback((level: PuzzleLevel) => {
    const sim = simulationRef.current;
    sim.reset();

    // Create all initial objects
    level.initialObjects.forEach((obj) => {
      if (obj.type === 'pendulum') {
        sim.createPendulum(obj.id, obj.x, obj.y - 100, 100, obj);
      } else {
        sim.createBody(obj);
      }
    });

    // Apply relay effects
    if (level.relayEffect) {
      switch (level.relayEffect.type) {
        case 'gravity':
          sim.setGravity(0, 1 * level.relayEffect.modifier);
          break;
        case 'wind':
          sim.setWind(level.relayEffect.modifier, 0);
          break;
        // friction and mass are applied per-object
      }
    }

    setState((prev) => ({ ...prev, time: 0, collisions: [] }));
    startTimeRef.current = Date.now();
  }, []);

  // Start simulation
  const start = useCallback(() => {
    if (!state.isRunning) {
      simulationRef.current.start();
      setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
      startTimeRef.current = Date.now();
    }
  }, [state.isRunning]);

  // Stop simulation
  const stop = useCallback(() => {
    if (state.isRunning) {
      simulationRef.current.stop();
      setState((prev) => ({ ...prev, isRunning: false }));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [state.isRunning]);

  // Pause/Resume
  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  // Reset simulation
  const reset = useCallback(() => {
    simulationRef.current.reset();
    setState({
      isPaused: false,
      isRunning: false,
      time: 0,
      collisions: [],
    });
    setForceVectors([]);
    startTimeRef.current = 0;
  }, []);

  // Add object to world
  const addObject = useCallback((obj: PhysicsObject, isPendulum: boolean = false, pendulumLength: number = 100) => {
    if (isPendulum) {
      simulationRef.current.createPendulum(obj.id, obj.x, obj.y - pendulumLength, pendulumLength, obj);
    } else {
      simulationRef.current.createBody(obj);
    }
  }, []);

  // Remove object
  const removeObject = useCallback((id: string) => {
    simulationRef.current.removeBody(id);
  }, []);

  // Apply force to object
  const applyForce = useCallback((id: string, force: Vector2D, position?: Vector2D) => {
    simulationRef.current.applyForce(id, force, position);
  }, []);

  // Set velocity
  const setVelocity = useCallback((id: string, velocity: Vector2D) => {
    simulationRef.current.setVelocity(id, velocity);
  }, []);

  // Set position
  const setPosition = useCallback((id: string, position: Vector2D) => {
    simulationRef.current.setPosition(id, position);
  }, []);

  // Set angle
  const setAngle = useCallback((id: string, angle: number) => {
    simulationRef.current.setAngle(id, angle);
  }, []);

  // Get object position
  const getPosition = useCallback((id: string): Vector2D | null => {
    return simulationRef.current.getPosition(id);
  }, []);

  // Get object velocity
  const getVelocity = useCallback((id: string): Vector2D | null => {
    return simulationRef.current.getVelocity(id);
  }, []);

  // Get object angle
  const getAngle = useCallback((id: string): number | null => {
    return simulationRef.current.getAngle(id);
  }, []);

  // Check if touching
  const isTouching = useCallback((bodyId: string, targetId: string): boolean => {
    return simulationRef.current.isTouching(bodyId, targetId);
  }, []);

  // Get all bodies
  const getAllBodies = useCallback(() => {
    return simulationRef.current.getAllBodies();
  }, []);

  // Get body
  const getBody = useCallback((id: string) => {
    return simulationRef.current.getBody(id);
  }, []);

  // Get kinetic energy
  const getKineticEnergy = useCallback((id: string): number => {
    return simulationRef.current.getKineticEnergy(id);
  }, []);

  // Get potential energy
  const getPotentialEnergy = useCallback((id: string): number => {
    return simulationRef.current.getPotentialEnergy(id);
  }, []);

  // Get momentum
  const getMomentum = useCallback((id: string): Vector2D => {
    return simulationRef.current.getMomentum(id);
  }, []);

  // Update loop
  useEffect(() => {
    if (!state.isRunning || state.isPaused) return;

    const updateLoop = () => {
      simulationRef.current.update();
      simulationRef.current.applyWind();

      // Update state
      const collisions = simulationRef.current.getCollisions();
      const vectors = simulationRef.current.getForceVectors();
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      setState((prev) => ({
        ...prev,
        time: elapsed,
        collisions,
      }));

      setForceVectors(vectors);

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, state.isPaused]);

  // Cleanup
  useEffect(() => {
    return () => {
      stop();
      reset();
    };
  }, []);

  return {
    state,
    forceVectors,
    initialize,
    start,
    stop,
    pause,
    resume,
    reset,
    addObject,
    removeObject,
    applyForce,
    setVelocity,
    setPosition,
    setAngle,
    getPosition,
    getVelocity,
    getAngle,
    isTouching,
    getAllBodies,
    getBody,
    getKineticEnergy,
    getPotentialEnergy,
    getMomentum,
    simulation: simulationRef.current,
  };
};
