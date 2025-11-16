import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ParadoxResolver,
  Paradox,
  CausalLink,
  ButterflyEffect,
  ParadoxType,
} from '../utils/paradoxResolver';
import { PlayerAction, RecordedLoop } from '../utils/timeEngine';

export interface UseParadoxLogicReturn {
  paradoxes: Paradox[];
  unresolvedParadoxes: Paradox[];
  totalSeverity: number;
  causalLinks: CausalLink[];
  butterflyEffects: ButterflyEffect[];
  paradoxTolerance: number;
  isTimelineStable: boolean;

  // Actions
  checkForParadoxes: (
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[],
    currentTime: number
  ) => Paradox[];
  resolveParadox: (paradoxId: string, resolution: string) => boolean;
  createCausalLink: (
    causeActionId: string,
    effectActionId: string,
    timelineId: string,
    strength: number,
    type?: CausalLink['type']
  ) => void;
  calculateButterflyEffect: (originAction: PlayerAction, allActions: PlayerAction[]) => ButterflyEffect;
  getCausalChain: (actionId: string) => CausalLink[];
  reset: () => void;
}

export const useParadoxLogic = (
  maxParadoxTolerance: number = 10,
  onTimelineCollapse?: () => void
): UseParadoxLogicReturn => {
  const resolverRef = useRef<ParadoxResolver>(new ParadoxResolver());
  const [paradoxes, setParadoxes] = useState<Paradox[]>([]);
  const [unresolvedParadoxes, setUnresolvedParadoxes] = useState<Paradox[]>([]);
  const [totalSeverity, setTotalSeverity] = useState(0);
  const [causalLinks, setCausalLinks] = useState<CausalLink[]>([]);
  const [butterflyEffects, setButterflyEffects] = useState<ButterflyEffect[]>([]);
  const [isTimelineStable, setIsTimelineStable] = useState(true);

  // Monitor timeline stability
  useEffect(() => {
    const stable = totalSeverity < maxParadoxTolerance;
    setIsTimelineStable(stable);

    if (!stable && onTimelineCollapse) {
      onTimelineCollapse();
    }
  }, [totalSeverity, maxParadoxTolerance, onTimelineCollapse]);

  const checkForParadoxes = useCallback((
    currentActions: PlayerAction[],
    recordedLoops: RecordedLoop[],
    currentTime: number
  ): Paradox[] => {
    const resolver = resolverRef.current;
    const newParadoxes = resolver.detectParadoxes(currentActions, recordedLoops, currentTime);

    // Update state
    setParadoxes(resolver.getAllParadoxes());
    setUnresolvedParadoxes(resolver.getUnresolvedParadoxes());
    setTotalSeverity(resolver.getTotalParadoxSeverity());

    return newParadoxes;
  }, []);

  const resolveParadox = useCallback((paradoxId: string, resolution: string): boolean => {
    const resolver = resolverRef.current;
    const success = resolver.resolveParadox(paradoxId, resolution);

    if (success) {
      setParadoxes(resolver.getAllParadoxes());
      setUnresolvedParadoxes(resolver.getUnresolvedParadoxes());
      setTotalSeverity(resolver.getTotalParadoxSeverity());
    }

    return success;
  }, []);

  const createCausalLink = useCallback((
    causeActionId: string,
    effectActionId: string,
    timelineId: string,
    strength: number,
    type: CausalLink['type'] = 'direct'
  ) => {
    const resolver = resolverRef.current;
    resolver.createCausalLink(causeActionId, effectActionId, timelineId, strength, type);
    setCausalLinks(resolver.getCausalLinks());
  }, []);

  const calculateButterflyEffect = useCallback((
    originAction: PlayerAction,
    allActions: PlayerAction[]
  ): ButterflyEffect => {
    const resolver = resolverRef.current;
    const effect = resolver.calculateButterflyEffect(originAction, allActions);
    setButterflyEffects(resolver.getButterflyEffects());
    return effect;
  }, []);

  const getCausalChain = useCallback((actionId: string): CausalLink[] => {
    return resolverRef.current.getCausalChain(actionId);
  }, []);

  const reset = useCallback(() => {
    resolverRef.current.reset();
    setParadoxes([]);
    setUnresolvedParadoxes([]);
    setTotalSeverity(0);
    setCausalLinks([]);
    setButterflyEffects([]);
    setIsTimelineStable(true);
  }, []);

  return {
    paradoxes,
    unresolvedParadoxes,
    totalSeverity,
    causalLinks,
    butterflyEffects,
    paradoxTolerance: maxParadoxTolerance,
    isTimelineStable,
    checkForParadoxes,
    resolveParadox,
    createCausalLink,
    calculateButterflyEffect,
    getCausalChain,
    reset,
  };
};
