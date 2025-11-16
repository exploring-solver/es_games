import { useState, useEffect, useCallback, useRef } from 'react';
import { TimeEngine, PlayerAction, RecordedLoop, GameResources } from '../utils/timeEngine';
import { TimeEvent, generateRandomEvents, getActiveEvents } from '../data/timeEvents';

export interface UseTiMeTravelReturn {
  currentTime: number;
  maxTime: number;
  currentLoop: number;
  isPaused: boolean;
  playbackSpeed: number;
  recordedLoops: RecordedLoop[];
  activeTimelines: string[];
  currentTimelineId: string;
  resources: GameResources;
  activeEvents: TimeEvent[];

  // Actions
  pause: () => void;
  resume: () => void;
  rewind: (time: number) => void;
  setSpeed: (speed: number) => void;
  recordAction: (action: Omit<PlayerAction, 'id' | 'timelineId' | 'timestamp'>) => void;
  completeLoop: () => void;
  startNewLoop: () => void;
  branchTimeline: () => string;
  switchTimeline: (id: string) => void;
  mergeTimelines: (sourceId: string, targetId: string) => boolean;
  updateResources: (delta: Partial<GameResources>) => void;
  getGhostActions: (time: number) => PlayerAction[];
}

export const useTimeTravel = (
  maxTime: number,
  onLoopComplete?: (loop: RecordedLoop) => void,
  onParadox?: () => void
): UseTiMeTravelReturn => {
  const engineRef = useRef<TimeEngine>(new TimeEngine());
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLoop, setCurrentLoop] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [recordedLoops, setRecordedLoops] = useState<RecordedLoop[]>([]);
  const [currentTimelineId, setCurrentTimelineId] = useState('main');
  const [activeTimelines, setActiveTimelines] = useState<string[]>(['main']);
  const [resources, setResources] = useState<GameResources>({
    energy: 100,
    matter: 50,
    information: 50,
  });
  const [allEvents, setAllEvents] = useState<TimeEvent[]>([]);
  const [activeEvents, setActiveEvents] = useState<TimeEvent[]>([]);
  const actionCounter = useRef(0);

  // Initialize timeline
  useEffect(() => {
    const engine = engineRef.current;
    engine.createTimeline('main', 0, maxTime, undefined);

    // Generate random events
    const events = generateRandomEvents(maxTime, 15);
    setAllEvents(events);
    events.forEach(event => {
      engine.addEvent('main', event);
    });
  }, [maxTime]);

  // Update time
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const engine = engineRef.current;
      const timeline = engine.getActiveTimeline();

      if (!timeline) return;

      if (timeline.currentTime >= timeline.maxTime) {
        setIsPaused(true);
        return;
      }

      engine.updateTimeline(currentTimelineId, 0.016 * 60); // 60 FPS
      setCurrentTime(timeline.currentTime);

      // Update active events
      const events = getActiveEvents(allEvents, timeline.currentTime);
      setActiveEvents(events);

      // Apply event effects
      events.forEach(event => {
        if (event.effects) {
          const delta: Partial<GameResources> = {
            energy: event.effects.energyDelta,
            matter: event.effects.matterDelta,
            information: event.effects.informationDelta,
          };

          setResources(prev => ({
            energy: Math.max(0, prev.energy + (delta.energy || 0)),
            matter: Math.max(0, prev.matter + (delta.matter || 0)),
            information: Math.max(0, prev.information + (delta.information || 0)),
          }));

          if (event.effects.timelineStability) {
            engine.adjustTimelineStability(
              currentTimelineId,
              event.effects.timelineStability
            );
          }

          if (event.effects.paradoxRisk && event.effects.paradoxRisk > 0.5) {
            onParadox?.();
          }
        }
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPaused, currentTimelineId, playbackSpeed, allEvents, onParadox]);

  const pause = useCallback(() => {
    engineRef.current.pauseTimeline(currentTimelineId);
    setIsPaused(true);
  }, [currentTimelineId]);

  const resume = useCallback(() => {
    engineRef.current.resumeTimeline(currentTimelineId);
    setIsPaused(false);
  }, [currentTimelineId]);

  const rewind = useCallback((time: number) => {
    engineRef.current.rewindTimeline(currentTimelineId, time);
    setCurrentTime(time);
  }, [currentTimelineId]);

  const setSpeed = useCallback((speed: number) => {
    engineRef.current.setPlaybackSpeed(currentTimelineId, speed);
    setPlaybackSpeed(speed);
  }, [currentTimelineId]);

  const recordAction = useCallback((
    action: Omit<PlayerAction, 'id' | 'timelineId' | 'timestamp'>
  ) => {
    const fullAction: PlayerAction = {
      ...action,
      id: `action-${actionCounter.current++}`,
      timelineId: currentTimelineId,
      timestamp: currentTime,
    };

    engineRef.current.recordAction(fullAction);
  }, [currentTime, currentTimelineId]);

  const completeLoop = useCallback(() => {
    const loop = engineRef.current.completeLoop(currentLoop, resources, 0);
    setRecordedLoops(prev => [...prev, loop]);
    onLoopComplete?.(loop);
  }, [currentLoop, resources, onLoopComplete]);

  const startNewLoop = useCallback(() => {
    completeLoop();
    setCurrentLoop(prev => prev + 1);
    setCurrentTime(0);
    engineRef.current.rewindTimeline(currentTimelineId, 0);
  }, [completeLoop, currentTimelineId]);

  const branchTimeline = useCallback((): string => {
    const newId = engineRef.current.branchTimeline(currentTimelineId, currentTime);
    setActiveTimelines(prev => [...prev, newId]);
    setCurrentTimelineId(newId);

    // Copy events to new timeline
    const events = generateRandomEvents(maxTime, 10);
    events.forEach(event => {
      engineRef.current.addEvent(newId, event);
    });

    return newId;
  }, [currentTimelineId, currentTime, maxTime]);

  const switchTimeline = useCallback((id: string) => {
    if (activeTimelines.includes(id)) {
      engineRef.current.setActiveTimeline(id);
      setCurrentTimelineId(id);

      const timeline = engineRef.current.getTimeline(id);
      if (timeline) {
        setCurrentTime(timeline.currentTime);
        setIsPaused(timeline.isPaused);
        setPlaybackSpeed(timeline.playbackSpeed);
      }
    }
  }, [activeTimelines]);

  const mergeTimelines = useCallback((sourceId: string, targetId: string): boolean => {
    const success = engineRef.current.mergeTimelines(sourceId, targetId);

    if (success) {
      setActiveTimelines(prev => prev.filter(id => id !== sourceId));

      if (currentTimelineId === sourceId) {
        switchTimeline(targetId);
      }
    }

    return success;
  }, [currentTimelineId, switchTimeline]);

  const updateResources = useCallback((delta: Partial<GameResources>) => {
    setResources(prev => ({
      energy: Math.max(0, prev.energy + (delta.energy || 0)),
      matter: Math.max(0, prev.matter + (delta.matter || 0)),
      information: Math.max(0, prev.information + (delta.information || 0)),
    }));
  }, []);

  const getGhostActions = useCallback((time: number): PlayerAction[] => {
    return engineRef.current.getActionsAtTime(currentTimelineId, time, 0.5);
  }, [currentTimelineId]);

  return {
    currentTime,
    maxTime,
    currentLoop,
    isPaused,
    playbackSpeed,
    recordedLoops,
    activeTimelines,
    currentTimelineId,
    resources,
    activeEvents,
    pause,
    resume,
    rewind,
    setSpeed,
    recordAction,
    completeLoop,
    startNewLoop,
    branchTimeline,
    switchTimeline,
    mergeTimelines,
    updateResources,
    getGhostActions,
  };
};
