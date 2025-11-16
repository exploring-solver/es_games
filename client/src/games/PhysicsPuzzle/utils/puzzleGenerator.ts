import { PuzzleLevel, PhysicsObject } from '../data/puzzles';
import { physicsConcepts } from '../data/physicsScenarios';

export interface PuzzleVariation {
  level: PuzzleLevel;
  seed: number;
  variations: {
    objectPositions: boolean;
    objectProperties: boolean;
    targetLocation: boolean;
    availableObjects: boolean;
  };
}

export class PuzzleGenerator {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed || Date.now();
  }

  // Seeded random number generator
  private random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  private randomRange(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.randomRange(min, max + 1));
  }

  // Generate a variation of a puzzle
  generateVariation(baseLevel: PuzzleLevel, difficulty: number = 1): PuzzleLevel {
    const varied: PuzzleLevel = JSON.parse(JSON.stringify(baseLevel));

    // Vary object positions slightly
    if (difficulty >= 1) {
      varied.initialObjects = varied.initialObjects.map((obj) => {
        if (obj.isStatic || obj.isSensor) return obj;

        return {
          ...obj,
          x: obj.x + this.randomRange(-20, 20),
          y: obj.y + this.randomRange(-10, 10),
        };
      });
    }

    // Vary object properties
    if (difficulty >= 2) {
      varied.initialObjects = varied.initialObjects.map((obj) => {
        if (obj.isStatic || obj.isSensor) return obj;

        return {
          ...obj,
          mass: obj.mass * this.randomRange(0.8, 1.2),
          friction: Math.max(0, Math.min(1, obj.friction * this.randomRange(0.8, 1.2))),
          restitution: Math.max(0, Math.min(1, obj.restitution * this.randomRange(0.8, 1.2))),
        };
      });
    }

    // Vary target location
    if (difficulty >= 3) {
      varied.initialObjects = varied.initialObjects.map((obj) => {
        if (obj.isSensor) {
          return {
            ...obj,
            x: obj.x + this.randomRange(-50, 50),
            y: obj.y + this.randomRange(-30, 30),
          };
        }
        return obj;
      });
    }

    // Vary available objects
    if (difficulty >= 4) {
      varied.availableObjects = varied.availableObjects.map((avail) => ({
        ...avail,
        count: Math.max(1, avail.count + this.randomInt(-1, 1)),
      }));
    }

    return varied;
  }

  // Generate a completely random puzzle based on a concept
  generateFromConcept(conceptId: string, difficulty: 1 | 2 | 3 | 4 | 5): PuzzleLevel {
    const concept = physicsConcepts.find((c) => c.id === conceptId);
    if (!concept) {
      throw new Error(`Concept ${conceptId} not found`);
    }

    const level: PuzzleLevel = {
      id: this.randomInt(1000, 9999),
      name: `${concept.name} - Random ${this.randomInt(1, 999)}`,
      difficulty,
      conceptIds: [conceptId],
      description: `Random puzzle featuring ${concept.name}`,
      objectives: [
        {
          type: 'reach',
          description: 'Reach the target zone',
          targetId: 'target-random',
        },
      ],
      initialObjects: this.generateRandomObjects(concept.category, difficulty),
      availableObjects: this.generateAvailableObjects(concept.category, difficulty),
      hints: [concept.educationalContent.concept],
      par: 3 + difficulty,
    };

    return level;
  }

  private generateRandomObjects(
    category: string,
    difficulty: number
  ): PhysicsObject[] {
    const objects: PhysicsObject[] = [];

    // Always add ground
    objects.push({
      id: 'ground',
      type: 'platform',
      x: 400,
      y: 550,
      width: 800,
      height: 20,
      angle: 0,
      color: '#64748b',
      mass: 0,
      friction: 0.5,
      restitution: 0,
      isStatic: true,
    });

    // Add starting object
    const startX = this.randomRange(50, 150);
    const startY = this.randomRange(100, 300);

    if (category === 'gravity' || category === 'momentum') {
      objects.push({
        id: 'ball-start',
        type: 'ball',
        x: startX,
        y: startY,
        radius: 15,
        color: '#4ade80',
        mass: 1,
        friction: 0.3,
        restitution: 0.6,
        isStatic: false,
      });
    } else {
      objects.push({
        id: 'box-start',
        type: 'box',
        x: startX,
        y: startY,
        width: 30,
        height: 30,
        angle: 0,
        color: '#8b5cf6',
        mass: 1,
        friction: 0.5,
        restitution: 0.3,
        isStatic: false,
      });
    }

    // Add target
    const targetX = this.randomRange(600, 750);
    const targetY = this.randomRange(200, 500);

    objects.push({
      id: 'target-random',
      type: 'platform',
      x: targetX,
      y: targetY,
      width: 60,
      height: 10,
      angle: 0,
      color: '#fbbf24',
      mass: 0,
      friction: 0.5,
      restitution: 0,
      isStatic: true,
      isSensor: true,
    });

    // Add obstacles based on difficulty
    const obstacleCount = difficulty;
    for (let i = 0; i < obstacleCount; i++) {
      if (this.random() > 0.5) {
        // Add platform obstacle
        objects.push({
          id: `obstacle-${i}`,
          type: 'platform',
          x: this.randomRange(200, 600),
          y: this.randomRange(300, 500),
          width: this.randomRange(80, 150),
          height: 15,
          angle: 0,
          color: '#ef4444',
          mass: 0,
          friction: 0.5,
          restitution: 0,
          isStatic: true,
        });
      } else {
        // Add box obstacle
        objects.push({
          id: `obstacle-${i}`,
          type: 'box',
          x: this.randomRange(200, 600),
          y: this.randomRange(350, 500),
          width: this.randomRange(30, 60),
          height: this.randomRange(30, 60),
          angle: 0,
          color: '#ef4444',
          mass: this.randomRange(1, 3),
          friction: 0.6,
          restitution: 0.2,
          isStatic: false,
        });
      }
    }

    return objects;
  }

  private generateAvailableObjects(
    category: string,
    difficulty: number
  ): PuzzleLevel['availableObjects'] {
    const available: PuzzleLevel['availableObjects'] = [];

    // Basic objects always available
    available.push({
      type: 'ramp',
      count: 2 + Math.floor(difficulty / 2),
      properties: {
        width: 120,
        height: 10,
        friction: 0.1,
        restitution: 0,
        color: '#94a3b8',
      },
    });

    available.push({
      type: 'platform',
      count: 1 + Math.floor(difficulty / 2),
      properties: {
        width: 100,
        height: 15,
        friction: 0.5,
        restitution: 0,
        color: '#475569',
      },
    });

    // Category-specific objects
    if (category === 'momentum') {
      available.push({
        type: 'ball',
        count: 1 + Math.floor(difficulty / 3),
        properties: {
          radius: 15,
          mass: 1.5,
          friction: 0.2,
          restitution: 0.8,
          color: '#60a5fa',
        },
      });
    }

    if (category === 'energy') {
      available.push({
        type: 'pendulum',
        count: 1,
        properties: {
          radius: 15,
          mass: 1,
          friction: 0.1,
          restitution: 0.7,
          color: '#06b6d4',
        },
      });
    }

    if (category === 'forces') {
      available.push({
        type: 'lever',
        count: 1,
        properties: {
          width: 200,
          height: 10,
          mass: 0.5,
          friction: 0.5,
          restitution: 0.1,
          color: '#78716c',
        },
      });
    }

    return available;
  }

  // Generate relay sequence
  generateRelaySequence(playerCount: number, baseDifficulty: number): PuzzleLevel[] {
    const sequence: PuzzleLevel[] = [];
    const concepts = [...physicsConcepts];

    for (let i = 0; i < playerCount; i++) {
      const conceptIndex = i % concepts.length;
      const concept = concepts[conceptIndex];
      const difficulty = Math.min(5, baseDifficulty + Math.floor(i / 2)) as 1 | 2 | 3 | 4 | 5;

      const puzzle = this.generateFromConcept(concept.id, difficulty);
      puzzle.name = `Player ${i + 1}: ${concept.name}`;

      // Add relay effect
      if (i > 0) {
        const effects = [
          { type: 'gravity' as const, description: 'Gravity increased', modifier: 1.3 },
          { type: 'gravity' as const, description: 'Gravity decreased', modifier: 0.7 },
          { type: 'friction' as const, description: 'Friction increased', modifier: 1.4 },
          { type: 'friction' as const, description: 'Friction decreased', modifier: 0.6 },
          { type: 'wind' as const, description: 'Wind blowing right', modifier: 0.5 },
          { type: 'mass' as const, description: 'Objects heavier', modifier: 1.5 },
        ];

        puzzle.relayEffect = effects[i % effects.length];
      }

      sequence.push(puzzle);
    }

    return sequence;
  }

  // Check if puzzle is solvable (basic heuristic)
  isSolvable(level: PuzzleLevel): boolean {
    // Simple checks
    if (level.availableObjects.length === 0) return false;
    if (level.objectives.length === 0) return false;

    // Check if target is reachable (very simplified)
    const target = level.initialObjects.find((obj) => obj.isSensor);
    if (!target) return false;

    const start = level.initialObjects.find((obj) => !obj.isStatic && !obj.isSensor);
    if (!start) return false;

    // If start and target are too far vertically without enough ramps, probably unsolvable
    const verticalDistance = Math.abs(target.y - start.y);
    const rampCount = level.availableObjects.find((a) => a.type === 'ramp')?.count || 0;

    if (verticalDistance > 200 && rampCount < 2) return false;

    return true;
  }

  // Calculate puzzle difficulty score
  calculateDifficulty(level: PuzzleLevel): number {
    let score = 0;

    // More objects = harder
    score += level.availableObjects.reduce((sum, obj) => sum + obj.count, 0);

    // Fewer available types = harder
    score += (5 - level.availableObjects.length) * 2;

    // More objectives = harder
    score += level.objectives.length * 3;

    // Obstacles = harder
    const obstacles = level.initialObjects.filter((obj) => obj.isStatic && !obj.isSensor);
    score += obstacles.length * 2;

    // Relay effects = harder
    if (level.relayEffect) score += 5;

    return Math.min(10, Math.max(1, Math.round(score / 5)));
  }
}
