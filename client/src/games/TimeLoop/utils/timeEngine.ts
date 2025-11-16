import { TimeEvent } from '../data/timeEvents';

export interface TimelineState {
  id: string;
  currentTime: number;
  maxTime: number;
  isPaused: boolean;
  playbackSpeed: number;
  branchPoint?: number;
  parentTimelineId?: string;
  stability: number; // 0-100
}

export interface PlayerAction {
  id: string;
  timelineId: string;
  timestamp: number;
  type: 'move' | 'collect' | 'interact' | 'create' | 'destroy';
  position: { x: number; y: number };
  data: any;
  playerId: number;
}

export interface RecordedLoop {
  loopNumber: number;
  timelineId: string;
  actions: PlayerAction[];
  startTime: number;
  endTime: number;
  resources: {
    energy: number;
    matter: number;
    information: number;
  };
  paradoxCount: number;
}

export interface GameResources {
  energy: number;
  matter: number;
  information: number;
}

export class TimeEngine {
  private timelines: Map<string, TimelineState>;
  private recordedLoops: RecordedLoop[];
  private currentLoopActions: PlayerAction[];
  private events: Map<string, TimeEvent[]>;
  private activeTimelineId: string;

  constructor() {
    this.timelines = new Map();
    this.recordedLoops = [];
    this.currentLoopActions = [];
    this.events = new Map();
    this.activeTimelineId = 'main';

    // Initialize main timeline
    this.createTimeline('main', 0, 100, undefined);
  }

  createTimeline(
    id: string,
    currentTime: number,
    maxTime: number,
    parentId?: string,
    branchPoint?: number
  ): void {
    this.timelines.set(id, {
      id,
      currentTime,
      maxTime,
      isPaused: false,
      playbackSpeed: 1.0,
      branchPoint,
      parentTimelineId: parentId,
      stability: 100,
    });

    if (parentId && this.events.has(parentId)) {
      // Copy events from parent timeline
      this.events.set(id, [...(this.events.get(parentId) || [])]);
    } else {
      this.events.set(id, []);
    }
  }

  getTimeline(id: string): TimelineState | undefined {
    return this.timelines.get(id);
  }

  getAllTimelines(): TimelineState[] {
    return Array.from(this.timelines.values());
  }

  setActiveTimeline(id: string): void {
    if (this.timelines.has(id)) {
      this.activeTimelineId = id;
    }
  }

  getActiveTimeline(): TimelineState | undefined {
    return this.timelines.get(this.activeTimelineId);
  }

  updateTimeline(id: string, deltaTime: number): void {
    const timeline = this.timelines.get(id);
    if (!timeline || timeline.isPaused) return;

    const newTime = Math.min(
      timeline.currentTime + deltaTime * timeline.playbackSpeed,
      timeline.maxTime
    );

    this.timelines.set(id, {
      ...timeline,
      currentTime: newTime,
    });
  }

  recordAction(action: PlayerAction): void {
    this.currentLoopActions.push(action);
  }

  completeLoop(
    loopNumber: number,
    resources: GameResources,
    paradoxCount: number
  ): RecordedLoop {
    const timeline = this.getActiveTimeline();
    if (!timeline) {
      throw new Error('No active timeline');
    }

    const loop: RecordedLoop = {
      loopNumber,
      timelineId: timeline.id,
      actions: [...this.currentLoopActions],
      startTime: 0,
      endTime: timeline.currentTime,
      resources,
      paradoxCount,
    };

    this.recordedLoops.push(loop);
    this.currentLoopActions = [];

    return loop;
  }

  getRecordedLoops(): RecordedLoop[] {
    return this.recordedLoops;
  }

  getActionsAtTime(timelineId: string, timestamp: number, tolerance = 0.5): PlayerAction[] {
    const actions: PlayerAction[] = [];

    // Get actions from all recorded loops for this timeline
    this.recordedLoops
      .filter(loop => loop.timelineId === timelineId)
      .forEach(loop => {
        loop.actions.forEach(action => {
          if (Math.abs(action.timestamp - timestamp) <= tolerance) {
            actions.push(action);
          }
        });
      });

    return actions;
  }

  rewindTimeline(id: string, targetTime: number): void {
    const timeline = this.timelines.get(id);
    if (!timeline) return;

    this.timelines.set(id, {
      ...timeline,
      currentTime: Math.max(0, Math.min(targetTime, timeline.maxTime)),
    });
  }

  pauseTimeline(id: string): void {
    const timeline = this.timelines.get(id);
    if (!timeline) return;

    this.timelines.set(id, {
      ...timeline,
      isPaused: true,
    });
  }

  resumeTimeline(id: string): void {
    const timeline = this.timelines.get(id);
    if (!timeline) return;

    this.timelines.set(id, {
      ...timeline,
      isPaused: false,
    });
  }

  setPlaybackSpeed(id: string, speed: number): void {
    const timeline = this.timelines.get(id);
    if (!timeline) return;

    this.timelines.set(id, {
      ...timeline,
      playbackSpeed: Math.max(0.1, Math.min(speed, 5.0)),
    });
  }

  branchTimeline(parentId: string, branchPoint: number): string {
    const parent = this.timelines.get(parentId);
    if (!parent) {
      throw new Error('Parent timeline not found');
    }

    const branchId = `${parentId}-branch-${Date.now()}`;
    this.createTimeline(branchId, branchPoint, parent.maxTime, parentId, branchPoint);

    // Copy actions from parent up to branch point
    const branchActions = this.currentLoopActions.filter(
      action => action.timestamp <= branchPoint
    );

    // Store branch actions
    this.currentLoopActions = branchActions;

    return branchId;
  }

  mergeTimelines(sourceId: string, targetId: string): boolean {
    const source = this.timelines.get(sourceId);
    const target = this.timelines.get(targetId);

    if (!source || !target) return false;

    // Calculate merge stability
    const stabilityDelta = Math.abs(source.stability - target.stability);
    const mergeSuccess = stabilityDelta < 30;

    if (mergeSuccess) {
      // Average the stabilities
      const newStability = (source.stability + target.stability) / 2;
      this.timelines.set(targetId, {
        ...target,
        stability: newStability,
      });

      // Remove source timeline
      this.timelines.delete(sourceId);
      this.events.delete(sourceId);
    }

    return mergeSuccess;
  }

  adjustTimelineStability(id: string, delta: number): void {
    const timeline = this.timelines.get(id);
    if (!timeline) return;

    this.timelines.set(id, {
      ...timeline,
      stability: Math.max(0, Math.min(100, timeline.stability + delta)),
    });
  }

  addEvent(timelineId: string, event: TimeEvent): void {
    const events = this.events.get(timelineId) || [];
    events.push(event);
    this.events.set(timelineId, events);
  }

  getEvents(timelineId: string): TimeEvent[] {
    return this.events.get(timelineId) || [];
  }

  getActiveEvents(timelineId: string, currentTime: number): TimeEvent[] {
    const events = this.events.get(timelineId) || [];
    return events.filter(
      e => currentTime >= e.timestamp && currentTime < e.timestamp + e.duration
    );
  }

  calculateTimeDilation(position: { x: number; y: number }): number {
    // Simulate gravitational time dilation based on distance from center
    const centerX = 400;
    const centerY = 300;
    const distance = Math.sqrt(
      Math.pow(position.x - centerX, 2) + Math.pow(position.y - centerY, 2)
    );

    // Closer to center = stronger gravity = slower time
    const maxDistance = 500;
    const dilation = 1.0 - (distance / maxDistance) * 0.5;

    return Math.max(0.5, Math.min(1.5, dilation));
  }

  detectCollisions(
    currentActions: PlayerAction[],
    historicalActions: PlayerAction[]
  ): { collision: boolean; position: { x: number; y: number } | null } {
    for (const current of currentActions) {
      for (const historical of historicalActions) {
        const distance = Math.sqrt(
          Math.pow(current.position.x - historical.position.x, 2) +
            Math.pow(current.position.y - historical.position.y, 2)
        );

        if (distance < 20) {
          // Collision threshold
          return {
            collision: true,
            position: current.position,
          };
        }
      }
    }

    return { collision: false, position: null };
  }

  reset(): void {
    this.timelines.clear();
    this.recordedLoops = [];
    this.currentLoopActions = [];
    this.events.clear();
    this.activeTimelineId = 'main';
    this.createTimeline('main', 0, 100, undefined);
  }
}

export const createTimeEngine = (): TimeEngine => {
  return new TimeEngine();
};
