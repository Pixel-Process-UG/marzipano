/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import Scene from '../Scene';

export type TransitionFunction = (t: number, newScene: Scene, oldScene: Scene | null) => void;

export function crossfade(t: number, newScene: Scene, oldScene: Scene | null): void;

export interface ZoomMorphOptions {
  maxZoomOut?: number;
}

export function zoomMorph(t: number, newScene: Scene, oldScene: Scene | null, opts?: ZoomMorphOptions): void;

export interface OrbitToTargetOptions {
  orbitYaw?: number;
  orbitPitch?: number;
}

export function orbitToTarget(t: number, newScene: Scene, oldScene: Scene | null, opts?: OrbitToTargetOptions): void;

export function getTransition(kind: 'crossfade' | 'zoomMorph' | 'orbitToTarget', opts?: any): TransitionFunction;

declare const transitions: {
  crossfade: typeof crossfade;
  zoomMorph: typeof zoomMorph;
  orbitToTarget: typeof orbitToTarget;
  getTransition: typeof getTransition;
};

export default transitions;

