/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export interface LODPolicyOptions {
  maxGpuMB: number;
  prefetchAhead?: number;
  evictionStrategy?: 'lru' | 'distance' | 'hybrid';
}

export default class LODPolicy {
  constructor(opts: LODPolicyOptions);
  
  maxGpuBytes(): number;
  maxGpuMB(): number;
  setMaxGpuMB(mb: number): void;
  
  prefetchAhead(): number;
  setPrefetchAhead(count: number): void;
  
  evictionStrategy(): 'lru' | 'distance' | 'hybrid';
  setEvictionStrategy(strategy: 'lru' | 'distance' | 'hybrid'): void;
  
  calculateEvictionScore(tile: any, lastAccessTime: number, distanceFromCamera: number, currentTime: number): number;
  shouldPrefetchLevel(currentLevel: number, targetLevel: number): boolean;
}

