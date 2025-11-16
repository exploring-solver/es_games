import { PlayerAction, RecordedLoop } from './timeEngine';

export type ParadoxType =
  | 'grandfather'
  | 'bootstrap'
  | 'predestination'
  | 'ontological'
  | 'causal_loop'
  | 'temporal_collision'
  | 'information_duplicate'
  | 'causality_violation';

export interface Paradox {
  id: string;
  type: ParadoxType;
  severity: number; // 0-10
  timestamp: number;
  timelineId: string;
  description: string;
  involvedActions: string[]; // Action IDs
  resolved: boolean;
  resolution?: string;
}

export interface CausalLink {
  id: string;
  causeActionId: string;
  effectActionId: string;
  timelineId: string;
  strength: number; // 0-1
  type: 'direct' | 'indirect' | 'retrocausal';
}

export interface ButterflyEffect {
  id: string;
  originAction: string;
  affectedActions: string[];
  magnitude: number; // How much the timeline changed
  cascadeDepth: number;
}

export class ParadoxResolver {
  private paradoxes: Map<string, Paradox>;
  private causalLinks: CausalLink[];
  private butterflyEffects: ButterflyEffect[];
  private paradoxCounter: number;

  constructor() {
    this.paradoxes = new Map();
    this.causalLinks = [];
    this.butterflyEffects = [];
    this.paradoxCounter = 0;
  }

  detectParadoxes(
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[],
    currentTime: number
  ): Paradox[] {
    const newParadoxes: Paradox[] = [];

    // Check for grandfather paradoxes
    const grandfatherParadoxes = this.detectGrandfatherParadox(
      currentActions,
      recordedLoops,
      currentTime
    );
    newParadoxes.push(...grandfatherParadoxes);

    // Check for bootstrap paradoxes
    const bootstrapParadoxes = this.detectBootstrapParadox(currentActions, recordedLoops);
    newParadoxes.push(...bootstrapParadoxes);

    // Check for temporal collisions
    const collisionParadoxes = this.detectTemporalCollisions(
      currentActions,
      recordedLoops,
      currentTime
    );
    newParadoxes.push(...collisionParadoxes);

    // Check for information duplicates
    const infoParadoxes = this.detectInformationDuplicates(currentActions, recordedLoops);
    newParadoxes.push(...infoParadoxes);

    // Check for causality violations
    const causalityParadoxes = this.detectCausalityViolations(currentActions);
    newParadoxes.push(...causalityParadoxes);

    // Store new paradoxes
    newParadoxes.forEach(p => this.paradoxes.set(p.id, p));

    return newParadoxes;
  }

  private detectGrandfatherParadox(
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[],
    currentTime: number
  ): Paradox[] {
    const paradoxes: Paradox[] = [];

    currentActions.forEach(action => {
      if (action.type === 'destroy') {
        // Check if this destroy action would prevent a past action
        recordedLoops.forEach(loop => {
          loop.actions.forEach(pastAction => {
            if (
              pastAction.timestamp > currentTime &&
              this.areActionsConflicting(action, pastAction)
            ) {
              paradoxes.push({
                id: `paradox-${this.paradoxCounter++}`,
                type: 'grandfather',
                severity: 8,
                timestamp: currentTime,
                timelineId: action.timelineId,
                description: `Action at time ${action.timestamp} prevents a future action that should have already occurred`,
                involvedActions: [action.id, pastAction.id],
                resolved: false,
              });
            }
          });
        });
      }
    });

    return paradoxes;
  }

  private detectBootstrapParadox(
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[]
  ): Paradox[] {
    const paradoxes: Paradox[] = [];

    // Look for information/objects with no clear origin
    const createdItems = new Map<string, PlayerAction[]>();

    currentActions.forEach(action => {
      if (action.type === 'create' && action.data.itemId) {
        const itemId = action.data.itemId;
        if (!createdItems.has(itemId)) {
          createdItems.set(itemId, []);
        }
        createdItems.get(itemId)!.push(action);
      }
    });

    recordedLoops.forEach(loop => {
      loop.actions.forEach(action => {
        if (action.type === 'create' && action.data.itemId) {
          const itemId = action.data.itemId;
          if (!createdItems.has(itemId)) {
            createdItems.set(itemId, []);
          }
          createdItems.get(itemId)!.push(action);
        }
      });
    });

    // Check for items that appear in multiple loops without original creation
    createdItems.forEach((actions, itemId) => {
      if (actions.length > 1) {
        const timestamps = actions.map(a => a.timestamp).sort((a, b) => a - b);
        const isLoop = timestamps[timestamps.length - 1] > timestamps[0];

        if (isLoop) {
          paradoxes.push({
            id: `paradox-${this.paradoxCounter++}`,
            type: 'bootstrap',
            severity: 6,
            timestamp: timestamps[0],
            timelineId: actions[0].timelineId,
            description: `Item "${itemId}" exists in a causal loop with no original creation`,
            involvedActions: actions.map(a => a.id),
            resolved: false,
          });
        }
      }
    });

    return paradoxes;
  }

  private detectTemporalCollisions(
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[],
    currentTime: number
  ): Paradox[] {
    const paradoxes: Paradox[] = [];

    // Check if current player occupies same space-time as past self
    currentActions.forEach(action => {
      recordedLoops.forEach(loop => {
        const pastActions = loop.actions.filter(
          a => Math.abs(a.timestamp - currentTime) < 0.5
        );

        pastActions.forEach(pastAction => {
          const distance = Math.sqrt(
            Math.pow(action.position.x - pastAction.position.x, 2) +
              Math.pow(action.position.y - pastAction.position.y, 2)
          );

          if (distance < 25 && action.playerId === pastAction.playerId) {
            paradoxes.push({
              id: `paradox-${this.paradoxCounter++}`,
              type: 'temporal_collision',
              severity: 7,
              timestamp: currentTime,
              timelineId: action.timelineId,
              description: 'Player collided with their past self',
              involvedActions: [action.id, pastAction.id],
              resolved: false,
            });
          }
        });
      });
    });

    return paradoxes;
  }

  private detectInformationDuplicates(
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[]
  ): Paradox[] {
    const paradoxes: Paradox[] = [];

    // Track information collection
    const collectedInfo = new Map<string, number>();

    recordedLoops.forEach(loop => {
      loop.actions.forEach(action => {
        if (action.type === 'collect' && action.data.resource === 'information') {
          const infoId = action.data.infoId || 'generic';
          collectedInfo.set(infoId, (collectedInfo.get(infoId) || 0) + 1);
        }
      });
    });

    currentActions.forEach(action => {
      if (action.type === 'collect' && action.data.resource === 'information') {
        const infoId = action.data.infoId || 'generic';
        const count = collectedInfo.get(infoId) || 0;

        if (count > 2) {
          // Information duplicated too many times
          paradoxes.push({
            id: `paradox-${this.paradoxCounter++}`,
            type: 'information_duplicate',
            severity: 4,
            timestamp: action.timestamp,
            timelineId: action.timelineId,
            description: `Information "${infoId}" has been duplicated ${count} times across loops`,
            involvedActions: [action.id],
            resolved: false,
          });
        }
      }
    });

    return paradoxes;
  }

  private detectCausalityViolations(currentActions: PlayerAction[]): Paradox[] {
    const paradoxes: Paradox[] = [];

    // Check if effects happen before causes
    for (let i = 0; i < this.causalLinks.length; i++) {
      const link = this.causalLinks[i];
      const causeAction = currentActions.find(a => a.id === link.causeActionId);
      const effectAction = currentActions.find(a => a.id === link.effectActionId);

      if (causeAction && effectAction) {
        if (effectAction.timestamp < causeAction.timestamp && link.type !== 'retrocausal') {
          paradoxes.push({
            id: `paradox-${this.paradoxCounter++}`,
            type: 'causality_violation',
            severity: 9,
            timestamp: effectAction.timestamp,
            timelineId: effectAction.timelineId,
            description: 'Effect occurred before its cause',
            involvedActions: [causeAction.id, effectAction.id],
            resolved: false,
          });
        }
      }
    }

    return paradoxes;
  }

  private areActionsConflicting(action1: PlayerAction, action2: PlayerAction): boolean {
    // Check if actions conflict in space-time
    const spatialProximity = Math.sqrt(
      Math.pow(action1.position.x - action2.position.x, 2) +
        Math.pow(action1.position.y - action2.position.y, 2)
    );

    return spatialProximity < 50;
  }

  resolveParadox(paradoxId: string, resolution: string): boolean {
    const paradox = this.paradoxes.get(paradoxId);
    if (!paradox) return false;

    this.paradoxes.set(paradoxId, {
      ...paradox,
      resolved: true,
      resolution,
    });

    return true;
  }

  createCausalLink(
    causeActionId: string,
    effectActionId: string,
    timelineId: string,
    strength: number,
    type: CausalLink['type'] = 'direct'
  ): void {
    this.causalLinks.push({
      id: `link-${this.causalLinks.length}`,
      causeActionId,
      effectActionId,
      timelineId,
      strength,
      type,
    });
  }

  getCausalChain(actionId: string): CausalLink[] {
    const chain: CausalLink[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const links = this.causalLinks.filter(link => link.causeActionId === id);
      links.forEach(link => {
        chain.push(link);
        traverse(link.effectActionId);
      });
    };

    traverse(actionId);
    return chain;
  }

  calculateButterflyEffect(originAction: PlayerAction, allActions: PlayerAction[]): ButterflyEffect {
    const affected: string[] = [];
    let magnitude = 0;

    // Find all actions causally linked to origin
    const causalChain = this.getCausalChain(originAction.id);

    causalChain.forEach(link => {
      affected.push(link.effectActionId);
      magnitude += link.strength;
    });

    return {
      id: `butterfly-${this.butterflyEffects.length}`,
      originAction: originAction.id,
      affectedActions: affected,
      magnitude,
      cascadeDepth: this.calculateCascadeDepth(originAction.id),
    };
  }

  private calculateCascadeDepth(actionId: string, depth = 0): number {
    const links = this.causalLinks.filter(link => link.causeActionId === actionId);

    if (links.length === 0) return depth;

    let maxDepth = depth;
    links.forEach(link => {
      const linkDepth = this.calculateCascadeDepth(link.effectActionId, depth + 1);
      maxDepth = Math.max(maxDepth, linkDepth);
    });

    return maxDepth;
  }

  getAllParadoxes(): Paradox[] {
    return Array.from(this.paradoxes.values());
  }

  getUnresolvedParadoxes(): Paradox[] {
    return Array.from(this.paradoxes.values()).filter(p => !p.resolved);
  }

  getTotalParadoxSeverity(): number {
    return this.getUnresolvedParadoxes().reduce((sum, p) => sum + p.severity, 0);
  }

  getCausalLinks(): CausalLink[] {
    return this.causalLinks;
  }

  getButterflyEffects(): ButterflyEffect[] {
    return this.butterflyEffects;
  }

  reset(): void {
    this.paradoxes.clear();
    this.causalLinks = [];
    this.butterflyEffects = [];
    this.paradoxCounter = 0;
  }
}

export const createParadoxResolver = (): ParadoxResolver => {
  return new ParadoxResolver();
};
