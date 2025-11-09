/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, Effects } from './types';

export default class Layer implements EventEmitter {
  constructor(source: any, geometry: any, view: any, textureStore: any, opts?: any);
  
  // Core methods
  destroy(): void;
  source(): any;
  geometry(): any;
  view(): any;
  textureStore(): any;
  effects(): Effects;
  mergeEffects(effects: Effects): void;
  setEffects(effects: Effects): void;
  fixedLevel(): any | null;
  setFixedLevel(level: any | null): void;
  
  // Pin management
  pinFirstLevel(): void;
  unpinFirstLevel(): void;
  
  // Tile visibility
  visibleTiles(result: any[]): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  
  // Event listeners
  on(event: 'renderComplete', callback: (stable: boolean) => void): void;
  on(event: 'viewChange', callback: () => void): void;
  on(event: 'effectsChange', callback: () => void): void;
  on(event: 'fixedLevelChange', callback: () => void): void;
  on(event: 'textureStoreChange', callback: () => void): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

