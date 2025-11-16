import { ParticleType, PARTICLES } from '../data/particles';

// 3D Vector for physics calculations
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Particle state in simulation
export interface ParticleState {
  id: string;
  type: ParticleType;
  position: Vector3D;
  velocity: Vector3D;
  energy: number; // in GeV
  lifetime: number; // remaining lifetime in seconds
  trailPoints: Vector3D[];
  color: string;
  charge: number;
  mass: number;
  createdAt: number;
}

// Physics constants (in SI units, converted where needed)
export const CONSTANTS = {
  C: 299792458, // speed of light in m/s
  HBAR: 1.054571817e-34, // reduced Planck constant in J·s
  E_CHARGE: 1.602176634e-19, // elementary charge in C
  EPSILON_0: 8.8541878128e-12, // vacuum permittivity
  ALPHA: 1 / 137.035999084, // fine structure constant
  GEV_TO_JOULE: 1.602176634e-10, // conversion factor
};

// Vector operations
export const Vector = {
  create(x: number, y: number, z: number): Vector3D {
    return { x, y, z };
  },

  add(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  },

  subtract(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },

  multiply(v: Vector3D, scalar: number): Vector3D {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
  },

  dot(a: Vector3D, b: Vector3D): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },

  magnitude(v: Vector3D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  },

  normalize(v: Vector3D): Vector3D {
    const mag = Vector.magnitude(v);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },

  cross(a: Vector3D, b: Vector3D): Vector3D {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  },

  distance(a: Vector3D, b: Vector3D): number {
    return Vector.magnitude(Vector.subtract(a, b));
  },
};

// Lorentz factor for relativistic calculations
export function lorentzFactor(velocity: number): number {
  const beta = velocity / CONSTANTS.C;
  return 1 / Math.sqrt(1 - beta * beta);
}

// Calculate relativistic energy
export function relativisticEnergy(mass: number, velocity: number): number {
  // E = γmc² (in GeV)
  const gamma = lorentzFactor(velocity);
  return gamma * mass; // mass already in GeV/c²
}

// Calculate momentum
export function relativisticMomentum(mass: number, velocity: Vector3D): Vector3D {
  const speed = Vector.magnitude(velocity);
  const gamma = lorentzFactor(speed);
  return Vector.multiply(velocity, gamma * mass / speed);
}

// Simulate particle decay
export function shouldDecay(particle: ParticleState, deltaTime: number): boolean {
  const particleData = PARTICLES[particle.type];
  if (particleData.lifetime === 0) return false; // stable particle

  // Quantum decay probability (exponential decay law)
  const decayConstant = 1 / particleData.lifetime;
  const survivalProbability = Math.exp(-decayConstant * deltaTime);

  return Math.random() > survivalProbability;
}

// Generate decay products
export function generateDecayProducts(particle: ParticleState): ParticleState[] {
  const decayChannels: Record<ParticleType, ParticleType[][]> = {
  neutrino: [],
    neutron: [['proton', 'electron', 'neutrino']],
    muon: [['electron', 'neutrino', 'neutrino']],
    tau: [
      ['electron', 'neutrino', 'neutrino'],
      ['muon', 'neutrino', 'neutrino'],
    ],
    topQuark: [['wBoson', 'bottomQuark']],
    wBoson: [
      ['electron', 'neutrino'],
      ['muon', 'neutrino'],
      ['upQuark', 'downQuark'],
    ],
    zBoson: [
      ['electron', 'positron'],
      ['muon', 'muon'],
      ['neutrino', 'neutrino'],
    ],
    higgs: [
      ['bottomQuark', 'bottomQuark'],
      ['wBoson', 'wBoson'],
      ['photon', 'photon'],
      ['zBoson', 'zBoson'],
      ['tau', 'tau'],
    ],
    electron: [],
    positron: [],
    proton: [],
    antiproton: [],
    photon: [],
    upQuark: [],
    downQuark: [],
    charmQuark: [],
    strangeQuark: [],
    bottomQuark: [],
    gluon: [],
  };

  const channels = decayChannels[particle.type];
  if (!channels || channels.length === 0) return [];

  // Pick random decay channel
  const channel = channels[Math.floor(Math.random() * channels.length)];

  // Create decay products
  const products: ParticleState[] = [];
  const totalEnergy = particle.energy;
  const totalMomentum = relativisticMomentum(particle.mass, particle.velocity);

  // Simplified: distribute energy and momentum equally (in reality, use phase space)
  const energyPerProduct = totalEnergy / channel.length;

  channel.forEach((productType, index) => {
    const productData = PARTICLES[productType];
    const angle = (index * 2 * Math.PI) / channel.length + Math.random() * 0.5;
    const speed = 0.8 * CONSTANTS.C; // Simplified

    const velocity: Vector3D = {
      x: speed * Math.cos(angle),
      y: speed * Math.sin(angle),
      z: (Math.random() - 0.5) * speed * 0.5,
    };

    products.push({
      id: `${productType}-${Date.now()}-${Math.random()}`,
      type: productType,
      position: { ...particle.position },
      velocity,
      energy: energyPerProduct,
      lifetime: productData.lifetime,
      trailPoints: [],
      color: productData.color,
      charge: productData.charge,
      mass: productData.mass,
      createdAt: Date.now(),
    });
  });

  return products;
}

// Electromagnetic force between charged particles
export function electromagneticForce(p1: ParticleState, p2: ParticleState): Vector3D {
  if (p1.charge === 0 || p2.charge === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  const r = Vector.subtract(p2.position, p1.position);
  const distance = Vector.magnitude(r);

  if (distance < 1e-15) return { x: 0, y: 0, z: 0 }; // Avoid singularity

  // Coulomb's law: F = k * q1 * q2 / r²
  const k = 1 / (4 * Math.PI * CONSTANTS.EPSILON_0);
  const forceMagnitude =
    (k * p1.charge * p2.charge * CONSTANTS.E_CHARGE * CONSTANTS.E_CHARGE) / (distance * distance);

  const forceDirection = Vector.normalize(r);
  return Vector.multiply(forceDirection, forceMagnitude);
}

// Magnetic field in accelerator (simplified)
export function calculateMagneticForce(particle: ParticleState, fieldStrength: number): Vector3D {
  if (particle.charge === 0) return { x: 0, y: 0, z: 0 };

  // Lorentz force: F = q(v × B)
  // Assume B field in z-direction
  const B: Vector3D = { x: 0, y: 0, z: fieldStrength };
  const crossProduct = Vector.cross(particle.velocity, B);
  return Vector.multiply(crossProduct, particle.charge * CONSTANTS.E_CHARGE);
}

// Update particle position and velocity
export function updateParticle(
  particle: ParticleState,
  deltaTime: number,
  forces: Vector3D[]
): ParticleState {
  // Calculate total force
  const totalForce = forces.reduce((sum, f) => Vector.add(sum, f), { x: 0, y: 0, z: 0 });

  // F = ma, so a = F/m
  const mass_kg = particle.mass * 1.783e-27; // Convert GeV/c² to kg
  const acceleration = Vector.multiply(totalForce, 1 / mass_kg);

  // Update velocity: v = v0 + at
  const newVelocity = Vector.add(particle.velocity, Vector.multiply(acceleration, deltaTime));

  // Limit to speed of light
  const speed = Vector.magnitude(newVelocity);
  const limitedVelocity =
    speed > CONSTANTS.C * 0.99
      ? Vector.multiply(Vector.normalize(newVelocity), CONSTANTS.C * 0.99)
      : newVelocity;

  // Update position: x = x0 + vt
  const newPosition = Vector.add(
    particle.position,
    Vector.multiply(limitedVelocity, deltaTime)
  );

  // Add to trail
  const newTrailPoints = [...particle.trailPoints, particle.position];
  if (newTrailPoints.length > 50) {
    newTrailPoints.shift(); // Keep trail length limited
  }

  return {
    ...particle,
    position: newPosition,
    velocity: limitedVelocity,
    trailPoints: newTrailPoints,
    lifetime: particle.lifetime - deltaTime,
  };
}

// Detect collision between particles
export function detectCollision(p1: ParticleState, p2: ParticleState): boolean {
  const distance = Vector.distance(p1.position, p2.position);

  // Collision radius based on particle size (simplified)
  const getCollisionRadius = (type: ParticleType) => {
    if (type === 'proton' || type === 'neutron' || type === 'antiproton') return 1e-15; // 1 fm
    if (type.includes('Quark')) return 0.5e-15;
    return 2.8e-15; // classical electron radius
  };

  const r1 = getCollisionRadius(p1.type);
  const r2 = getCollisionRadius(p2.type);

  return distance < r1 + r2;
}

// Calculate center of mass energy
export function centerOfMassEnergy(p1: ParticleState, p2: ParticleState): number {
  // √s = √[(E1 + E2)² - (p1 + p2)²c²]
  const totalEnergy = p1.energy + p2.energy;
  const momentum1 = relativisticMomentum(p1.mass, p1.velocity);
  const momentum2 = relativisticMomentum(p2.mass, p2.velocity);
  const totalMomentum = Vector.add(momentum1, momentum2);
  const momentumMagnitude = Vector.magnitude(totalMomentum);

  // Simplified calculation
  const s = totalEnergy * totalEnergy - momentumMagnitude * momentumMagnitude;
  return Math.sqrt(Math.max(0, s));
}

// Beam simulation
export interface BeamParameters {
  energy: number; // GeV
  luminosity: number; // cm⁻²s⁻¹
  focusSize: number; // meters
  particlesPerBunch: number;
}

export function simulateBeamCollision(
  beam1: BeamParameters,
  beam2: BeamParameters
): {
  collisionRate: number;
  averageEnergy: number;
} {
  // Luminosity determines collision rate
  // Collision rate = σ × L (cross section × luminosity)

  const averageEnergy = beam1.energy + beam2.energy;

  // Simplified collision rate (events per second)
  const crossSection = 1e-33; // typical value in cm²
  const collisionRate = crossSection * beam1.luminosity;

  return {
    collisionRate,
    averageEnergy,
  };
}

// Quantum tunneling probability
export function tunnelingProbability(
  particle: ParticleState,
  barrierHeight: number,
  barrierWidth: number
): number {
  // WKB approximation
  const k = Math.sqrt(2 * particle.mass * (barrierHeight - particle.energy)) / CONSTANTS.HBAR;
  return Math.exp(-2 * k * barrierWidth);
}

// Uncertainty principle check
export function heisenbergUncertainty(
  positionUncertainty: number,
  momentumUncertainty: number
): boolean {
  // Δx × Δp ≥ ℏ/2
  return positionUncertainty * momentumUncertainty >= CONSTANTS.HBAR / 2;
}

// Coordinate transformations for detector
export interface DetectorCoordinates {
  r: number; // radial distance
  phi: number; // azimuthal angle
  theta: number; // polar angle
  eta: number; // pseudorapidity
}

export function cartesianToDetector(position: Vector3D): DetectorCoordinates {
  const r = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
  const phi = Math.atan2(position.y, position.x);
  const theta = Math.acos(position.z / r);
  const eta = -Math.log(Math.tan(theta / 2)); // pseudorapidity

  return { r, phi, theta, eta };
}

// Energy deposit in calorimeter (simplified)
export function calculateEnergyDeposit(
  particle: ParticleState,
  materialDepth: number // in radiation lengths
): number {
  const particleData = PARTICLES[particle.type];

  if (particleData.charge !== 0) {
    // Charged particles: Bethe-Bloch formula (simplified)
    const meanEnergyLoss = 2.0; // MeV per radiation length
    return Math.min(particle.energy * 1000, meanEnergyLoss * materialDepth);
  } else if (particle.type === 'photon') {
    // Photons: electromagnetic shower
    const showerMax = 6.0; // radiation lengths
    if (materialDepth < showerMax) {
      return particle.energy * 1000 * (materialDepth / showerMax);
    } else {
      return particle.energy * 1000 * Math.exp(-(materialDepth - showerMax) / 2);
    }
  }

  return 0;
}
