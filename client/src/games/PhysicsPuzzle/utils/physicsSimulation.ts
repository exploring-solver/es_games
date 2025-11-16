import Matter from 'matter-js';
import { PhysicsObject } from '../data/puzzles';

export interface Vector2D {
  x: number;
  y: number;
}

export interface ForceVector {
  id: string;
  origin: Vector2D;
  direction: Vector2D;
  magnitude: number;
  color: string;
  type: 'gravity' | 'normal' | 'friction' | 'tension' | 'applied';
}

export class PhysicsSimulation {
  private engine: Matter.Engine;
  private world: Matter.World;
  private runner: Matter.Runner | null = null;
  private bodies: Map<string, Matter.Body> = new Map();
  private constraints: Map<string, Matter.Constraint> = new Map();
  private forceVectors: ForceVector[] = [];
  private gravity: Vector2D = { x: 0, y: 1 };
  private windForce: Vector2D = { x: 0, y: 0 };

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    });
    this.world = this.engine.world;
  }

  start() {
    if (!this.runner) {
      this.runner = Matter.Runner.create();
      Matter.Runner.run(this.runner, this.engine);
    }
  }

  stop() {
    if (this.runner) {
      Matter.Runner.stop(this.runner);
      this.runner = null;
    }
  }

  update() {
    // Manual update if not using runner
    Matter.Engine.update(this.engine, 1000 / 60);
    this.updateForceVectors();
  }

  reset() {
    // Clear all bodies and constraints
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
    this.bodies.clear();
    this.constraints.clear();
    this.forceVectors = [];
  }

  setGravity(x: number, y: number) {
    this.gravity = { x, y };
    this.engine.gravity.x = x;
    this.engine.gravity.y = y;
  }

  setWind(x: number, y: number) {
    this.windForce = { x, y };
  }

  applyWind() {
    this.bodies.forEach((body) => {
      if (!body.isStatic) {
        Matter.Body.applyForce(body, body.position, {
          x: this.windForce.x * 0.0001,
          y: this.windForce.y * 0.0001,
        });
      }
    });
  }

  createBody(obj: PhysicsObject): Matter.Body | null {
    let body: Matter.Body | null = null;

    const options: any = {
      isStatic: obj.isStatic,
      friction: obj.friction,
      restitution: obj.restitution,
      density: obj.mass / ((obj.width || 30) * (obj.height || 30)),
      isSensor: obj.isSensor || false,
      angle: obj.angle || 0,
    };

    switch (obj.type) {
      case 'ball':
        body = Matter.Bodies.circle(obj.x, obj.y, obj.radius || 15, options);
        break;

      case 'box':
        body = Matter.Bodies.rectangle(
          obj.x,
          obj.y,
          obj.width || 30,
          obj.height || 30,
          options
        );
        break;

      case 'platform':
        body = Matter.Bodies.rectangle(
          obj.x,
          obj.y,
          obj.width || 100,
          obj.height || 15,
          options
        );
        break;

      case 'ramp':
        const angle = obj.angle || -0.3;
        body = Matter.Bodies.rectangle(
          obj.x,
          obj.y,
          obj.width || 150,
          obj.height || 10,
          { ...options, angle }
        );
        break;

      case 'domino':
        body = Matter.Bodies.rectangle(
          obj.x,
          obj.y,
          obj.width || 10,
          obj.height || 50,
          options
        );
        break;

      case 'lever':
        body = Matter.Bodies.rectangle(
          obj.x,
          obj.y,
          obj.width || 200,
          obj.height || 10,
          options
        );
        break;

      case 'wheel':
        body = Matter.Bodies.circle(obj.x, obj.y, obj.radius || 20, {
          ...options,
          friction: 1,
        });
        break;

      case 'pendulum':
        // Pendulum bob
        body = Matter.Bodies.circle(obj.x, obj.y, obj.radius || 15, {
          ...options,
          isStatic: false,
        });
        break;

      case 'spring':
        // Spring platform
        body = Matter.Bodies.rectangle(
          obj.x,
          obj.y,
          obj.width || 30,
          obj.height || 60,
          {
            ...options,
            isStatic: true,
            restitution: 1.5,
          }
        );
        break;
    }

    if (body) {
      // Store color as custom property
      (body as any).renderColor = obj.color;
      (body as any).objectId = obj.id;
      (body as any).objectType = obj.type;

      Matter.World.add(this.world, body);
      this.bodies.set(obj.id, body);
    }

    return body;
  }

  createPendulum(id: string, x: number, y: number, length: number, obj: PhysicsObject): void {
    // Create anchor point
    const anchor = Matter.Bodies.circle(x, y, 5, { isStatic: true });
    (anchor as any).renderColor = '#666666';
    Matter.World.add(this.world, anchor);

    // Create pendulum bob
    const bob = this.createBody(obj);
    if (bob) {
      // Position bob at end of pendulum
      Matter.Body.setPosition(bob, { x, y: y + length });

      // Create constraint (rope/rod)
      const constraint = Matter.Constraint.create({
        bodyA: anchor,
        bodyB: bob,
        length: length,
        stiffness: 1,
        damping: 0.01,
      });

      Matter.World.add(this.world, constraint);
      this.constraints.set(`${id}-constraint`, constraint);
      this.bodies.set(`${id}-anchor`, anchor);
    }
  }

  createLever(id: string, leverBody: Matter.Body, fulcrumX: number, fulcrumY: number): void {
    // Create fulcrum
    const fulcrum = Matter.Bodies.circle(fulcrumX, fulcrumY, 8, { isStatic: true });
    (fulcrum as any).renderColor = '#444444';
    Matter.World.add(this.world, fulcrum);

    // Create constraint to allow rotation around fulcrum
    const constraint = Matter.Constraint.create({
      bodyA: fulcrum,
      bodyB: leverBody,
      pointA: { x: 0, y: 0 },
      pointB: { x: leverBody.position.x - fulcrumX, y: 0 },
      length: 0,
      stiffness: 1,
    });

    Matter.World.add(this.world, constraint);
    this.constraints.set(`${id}-fulcrum`, constraint);
    this.bodies.set(`${id}-fulcrum-body`, fulcrum);
  }

  removeBody(id: string) {
    const body = this.bodies.get(id);
    if (body) {
      Matter.World.remove(this.world, body);
      this.bodies.delete(id);
    }

    // Also remove associated constraints
    const constraint = this.constraints.get(`${id}-constraint`);
    if (constraint) {
      Matter.World.remove(this.world, constraint);
      this.constraints.delete(`${id}-constraint`);
    }

    const anchorBody = this.bodies.get(`${id}-anchor`);
    if (anchorBody) {
      Matter.World.remove(this.world, anchorBody);
      this.bodies.delete(`${id}-anchor`);
    }
  }

  getBody(id: string): Matter.Body | undefined {
    return this.bodies.get(id);
  }

  getAllBodies(): Matter.Body[] {
    return Array.from(this.bodies.values());
  }

  applyForce(id: string, force: Vector2D, position?: Vector2D) {
    const body = this.bodies.get(id);
    if (body && !body.isStatic) {
      const appliedPosition = position || body.position;
      Matter.Body.applyForce(body, appliedPosition, force);
    }
  }

  setVelocity(id: string, velocity: Vector2D) {
    const body = this.bodies.get(id);
    if (body && !body.isStatic) {
      Matter.Body.setVelocity(body, velocity);
    }
  }

  setPosition(id: string, position: Vector2D) {
    const body = this.bodies.get(id);
    if (body) {
      Matter.Body.setPosition(body, position);
    }
  }

  setAngle(id: string, angle: number) {
    const body = this.bodies.get(id);
    if (body) {
      Matter.Body.setAngle(body, angle);
    }
  }

  getPosition(id: string): Vector2D | null {
    const body = this.bodies.get(id);
    return body ? { x: body.position.x, y: body.position.y } : null;
  }

  getVelocity(id: string): Vector2D | null {
    const body = this.bodies.get(id);
    return body ? { x: body.velocity.x, y: body.velocity.y } : null;
  }

  getAngle(id: string): number | null {
    const body = this.bodies.get(id);
    return body ? body.angle : null;
  }

  // Check if body is touching a target
  isTouching(bodyId: string, targetId: string): boolean {
    const body = this.bodies.get(bodyId);
    const target = this.bodies.get(targetId);

    if (!body || !target) return false;

    // Simple distance check
    const dx = body.position.x - target.position.x;
    const dy = body.position.y - target.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Rough collision detection
    return distance < 50;
  }

  // Get all collision pairs
  getCollisions(): { bodyA: string; bodyB: string }[] {
    const collisions: { bodyA: string; bodyB: string }[] = [];
    const pairs = this.engine.pairs.list;

    for (const pair of pairs) {
      if (pair.isActive) {
        const bodyA = (pair.bodyA as any).objectId;
        const bodyB = (pair.bodyB as any).objectId;
        if (bodyA && bodyB) {
          collisions.push({ bodyA, bodyB });
        }
      }
    }

    return collisions;
  }

  // Calculate and update force vectors for visualization
  private updateForceVectors() {
    this.forceVectors = [];

    this.bodies.forEach((body, id) => {
      if (body.isStatic) return;

      const pos = body.position;

      // Gravity force
      const gravityForce = {
        x: body.mass * this.gravity.x,
        y: body.mass * this.gravity.y,
      };
      const gravityMag = Math.sqrt(gravityForce.x ** 2 + gravityForce.y ** 2);

      if (gravityMag > 0.01) {
        this.forceVectors.push({
          id: `${id}-gravity`,
          origin: { x: pos.x, y: pos.y },
          direction: {
            x: gravityForce.x / gravityMag,
            y: gravityForce.y / gravityMag,
          },
          magnitude: gravityMag,
          color: '#ff6b6b',
          type: 'gravity',
        });
      }

      // Normal force (simplified - only on ground contact)
      if (pos.y > 500 && Math.abs(body.velocity.y) < 0.1) {
        this.forceVectors.push({
          id: `${id}-normal`,
          origin: { x: pos.x, y: pos.y },
          direction: { x: 0, y: -1 },
          magnitude: gravityMag,
          color: '#4ecdc4',
          type: 'normal',
        });
      }

      // Friction force
      if (Math.abs(body.velocity.x) > 0.1 || Math.abs(body.velocity.y) > 0.1) {
        const velMag = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        const frictionMag = body.friction * gravityMag * 0.5;

        this.forceVectors.push({
          id: `${id}-friction`,
          origin: { x: pos.x, y: pos.y },
          direction: {
            x: -body.velocity.x / velMag,
            y: -body.velocity.y / velMag,
          },
          magnitude: frictionMag,
          color: '#f9ca24',
          type: 'friction',
        });
      }
    });

    // Constraint forces (tension)
    this.constraints.forEach((constraint, id) => {
      if (constraint.bodyA && constraint.bodyB) {
        const posA = constraint.bodyA.position;
        const posB = constraint.bodyB.position;
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0 && constraint.length) {
          const extension = dist - constraint.length;
          if (Math.abs(extension) > 0.1) {
            const tension = extension * (constraint.stiffness || 1) * 10;

            this.forceVectors.push({
              id: `${id}-tension`,
              origin: { x: posB.x, y: posB.y },
              direction: { x: -dx / dist, y: -dy / dist },
              magnitude: Math.abs(tension),
              color: '#95a5a6',
              type: 'tension',
            });
          }
        }
      }
    });
  }

  getForceVectors(): ForceVector[] {
    return this.forceVectors;
  }

  // Calculate kinetic energy
  getKineticEnergy(id: string): number {
    const body = this.bodies.get(id);
    if (!body) return 0;

    const v = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
    return 0.5 * body.mass * v * v;
  }

  // Calculate potential energy
  getPotentialEnergy(id: string, referenceY: number = 550): number {
    const body = this.bodies.get(id);
    if (!body) return 0;

    const height = referenceY - body.position.y;
    const g = Math.sqrt(this.gravity.x ** 2 + this.gravity.y ** 2);
    return body.mass * g * height;
  }

  // Get total momentum
  getMomentum(id: string): Vector2D {
    const body = this.bodies.get(id);
    if (!body) return { x: 0, y: 0 };

    return {
      x: body.mass * body.velocity.x,
      y: body.mass * body.velocity.y,
    };
  }

  // Calculate distance traveled
  getDistanceTraveled(id: string, initialPos: Vector2D): number {
    const body = this.bodies.get(id);
    if (!body) return 0;

    const dx = body.position.x - initialPos.x;
    const dy = body.position.y - initialPos.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Export world state for replay
  exportState(): any {
    const state: any = {
      bodies: [],
      constraints: [],
      gravity: this.gravity,
    };

    this.bodies.forEach((body, id) => {
      state.bodies.push({
        id,
        position: { ...body.position },
        velocity: { ...body.velocity },
        angle: body.angle,
        angularVelocity: body.angularVelocity,
      });
    });

    return state;
  }

  // Import world state for replay
  importState(state: any) {
    state.bodies.forEach((bodyState: any) => {
      const body = this.bodies.get(bodyState.id);
      if (body) {
        Matter.Body.setPosition(body, bodyState.position);
        Matter.Body.setVelocity(body, bodyState.velocity);
        Matter.Body.setAngle(body, bodyState.angle);
        Matter.Body.setAngularVelocity(body, bodyState.angularVelocity);
      }
    });
  }
}
