import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ParticleState,
  Vector,
  updateParticle,
  electromagneticForce,
  calculateMagneticForce,
  shouldDecay,
  generateDecayProducts,
  Vector3D,
} from '../utils/physicsEngine';
import { ParticleType } from '../data/particles';

interface SimulationConfig {
  magneticFieldStrength: number; // Tesla
  timeStep: number; // seconds
  maxParticles: number;
  detectorRadius: number; // meters
}

export interface SimulationState {
  particles: ParticleState[];
  time: number;
  collisionEvents: number;
  detectedParticles: ParticleType[];
}

export function usePhysicsSimulation(config: SimulationConfig) {
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [time, setTime] = useState(0);
  const [collisionEvents, setCollisionEvents] = useState(0);
  const [detectedParticles, setDetectedParticles] = useState<ParticleType[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const animationFrameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());

  // Add particles to simulation
  const addParticles = useCallback((newParticles: ParticleState[]) => {
    setParticles(prev => {
      const combined = [...prev, ...newParticles];
      // Limit total particles
      return combined.slice(-config.maxParticles);
    });
  }, [config.maxParticles]);

  // Remove particle by id
  const removeParticle = useCallback((id: string) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Clear all particles
  const clearParticles = useCallback(() => {
    setParticles([]);
    setDetectedParticles([]);
  }, []);

  // Detect particle (when it hits detector)
  const detectParticle = useCallback((particle: ParticleState) => {
    setDetectedParticles(prev => [...prev, particle.type]);
    setCollisionEvents(prev => prev + 1);
  }, []);

  // Physics simulation step
  const simulationStep = useCallback(() => {
    const now = Date.now();
    const deltaTimeMs = now - lastUpdateRef.current;
    const deltaTime = Math.min(deltaTimeMs / 1000, 0.016); // Cap at ~60fps
    lastUpdateRef.current = now;

    setTime(prev => prev + deltaTime);

    setParticles(prevParticles => {
      const updatedParticles: ParticleState[] = [];
      const newDecayProducts: ParticleState[] = [];

      prevParticles.forEach(particle => {
        // Check if particle should decay
        if (shouldDecay(particle, deltaTime)) {
          const products = generateDecayProducts(particle);
          newDecayProducts.push(...products);
          return; // Don't add decayed particle
        }

        // Calculate forces
        const forces: Vector3D[] = [];

        // Magnetic force (for charged particles in accelerator)
        const magneticForce = calculateMagneticForce(
          particle,
          config.magneticFieldStrength
        );
        forces.push(magneticForce);

        // Electromagnetic force from other charged particles
        prevParticles.forEach(other => {
          if (other.id !== particle.id) {
            const emForce = electromagneticForce(particle, other);
            forces.push(emForce);
          }
        });

        // Update particle
        const updated = updateParticle(particle, deltaTime, forces);

        // Check if particle reached detector
        const distance = Vector.magnitude(updated.position);
        if (distance > config.detectorRadius) {
          detectParticle(updated);
          return; // Remove detected particle
        }

        // Check if particle lifetime expired
        if (updated.lifetime > 0 && updated.lifetime <= 0) {
          const products = generateDecayProducts(updated);
          newDecayProducts.push(...products);
          return; // Remove expired particle
        }

        updatedParticles.push(updated);
      });

      // Add decay products
      return [...updatedParticles, ...newDecayProducts].slice(-config.maxParticles);
    });
  }, [config.magneticFieldStrength, config.detectorRadius, config.maxParticles, detectParticle]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      simulationStep();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, simulationStep]);

  // Control functions
  const start = useCallback(() => {
    setIsRunning(true);
    lastUpdateRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setParticles([]);
    setTime(0);
    setCollisionEvents(0);
    setDetectedParticles([]);
  }, []);

  return {
    // State
    particles,
    time,
    collisionEvents,
    detectedParticles,
    isRunning,

    // Actions
    addParticles,
    removeParticle,
    clearParticles,
    start,
    pause,
    reset,
  };
}

// Hook for beam control
export function useBeamControl() {
  const [beam1Energy, setBeam1Energy] = useState(100); // GeV
  const [beam2Energy, setBeam2Energy] = useState(100); // GeV
  const [beam1Particle, setBeam1Particle] = useState<ParticleType>('proton');
  const [beam2Particle, setBeam2Particle] = useState<ParticleType>('proton');
  const [isBeamActive, setIsBeamActive] = useState(false);

  const totalEnergy = beam1Energy + beam2Energy;

  const fireBeam = useCallback(() => {
    setIsBeamActive(true);
    setTimeout(() => setIsBeamActive(false), 1000);
  }, []);

  return {
    beam1Energy,
    beam2Energy,
    beam1Particle,
    beam2Particle,
    totalEnergy,
    isBeamActive,
    setBeam1Energy,
    setBeam2Energy,
    setBeam1Particle,
    setBeam2Particle,
    fireBeam,
  };
}

// Hook for detector configuration
export interface DetectorConfig {
  efficiency: number; // 0-1
  energyResolution: number; // percentage
  angularResolution: number; // degrees
  magneticField: number; // Tesla
}

export function useDetectorConfig() {
  const [config, setConfig] = useState<DetectorConfig>({
    efficiency: 0.7,
    energyResolution: 5,
    angularResolution: 1,
    magneticField: 4,
  });

  const upgradeEfficiency = useCallback((amount: number) => {
    setConfig(prev => ({
      ...prev,
      efficiency: Math.min(1, prev.efficiency + amount),
    }));
  }, []);

  const upgradeEnergyResolution = useCallback((amount: number) => {
    setConfig(prev => ({
      ...prev,
      energyResolution: Math.max(0.1, prev.energyResolution - amount),
    }));
  }, []);

  const upgradeMagneticField = useCallback((amount: number) => {
    setConfig(prev => ({
      ...prev,
      magneticField: Math.min(14, prev.magneticField + amount),
    }));
  }, []);

  return {
    config,
    setConfig,
    upgradeEfficiency,
    upgradeEnergyResolution,
    upgradeMagneticField,
  };
}

// Hook for particle trail rendering
export function useParticleTrails(maxTrailLength: number = 50) {
  const [trails, setTrails] = useState<Map<string, Vector3D[]>>(new Map());

  const updateTrail = useCallback((particleId: string, position: Vector3D) => {
    setTrails(prev => {
      const newTrails = new Map(prev);
      const currentTrail = newTrails.get(particleId) || [];
      const updatedTrail = [...currentTrail, position];

      // Limit trail length
      if (updatedTrail.length > maxTrailLength) {
        updatedTrail.shift();
      }

      newTrails.set(particleId, updatedTrail);
      return newTrails;
    });
  }, [maxTrailLength]);

  const clearTrail = useCallback((particleId: string) => {
    setTrails(prev => {
      const newTrails = new Map(prev);
      newTrails.delete(particleId);
      return newTrails;
    });
  }, []);

  const clearAllTrails = useCallback(() => {
    setTrails(new Map());
  }, []);

  return {
    trails,
    updateTrail,
    clearTrail,
    clearAllTrails,
  };
}
