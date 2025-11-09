/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export default class PrefetchStrategy {
  constructor();
  
  updateViewHistory(viewParams: any, timestamp: number): void;
  getMotionVector(): { yaw: number; pitch: number };
  
  addNavigationTarget(target: { yaw: number; pitch: number }, priority?: number): void;
  clearNavigationTargets(): void;
  
  prioritizeTiles(tiles: any[], currentView: any): Array<{ tile: any; priority: number }>;
  shouldPrefetch(tile: any, currentView: any, threshold?: number): boolean;
}

