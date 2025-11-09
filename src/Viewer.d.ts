/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, Size, LODPolicy, PerfSample, XROptions, XRSessionHandle, ToneMapOptions, Backend, BackendOptions } from './types';
import Scene from './Scene';
import Stage from './stages/Stage';
import RenderLoop from './RenderLoop';
import Controls from './controls/Controls';

export interface ViewerOptions {
  controls?: any;
  stage?: any;
  cursors?: {
    drag?: any;
  };
}

export default class Viewer implements EventEmitter {
  constructor(domElement: HTMLElement, opts?: ViewerOptions);
  
  // Core methods
  destroy(): void;
  updateSize(): void;
  stage(): Stage;
  renderLoop(): RenderLoop;
  controls(): Controls;
  domElement(): HTMLElement;
  
  // Scene management
  createScene(opts: {
    view: any;
    source: any;
    geometry: any;
    pinFirstLevel?: boolean;
    textureStoreOpts?: any;
    layerOpts?: any;
  }): Scene;
  
  createEmptyScene(opts: { view: any }): Scene;
  destroyScene(scene: Scene): void;
  destroyAllScenes(): void;
  hasScene(scene: Scene): boolean;
  listScenes(): Scene[];
  scene(): Scene | null;
  view(): any | null;
  
  // Scene transitions
  switchScene(scene: Scene, opts?: any, done?: () => void): void;
  
  // Camera control
  lookTo(params: any, opts?: any, done?: () => void): void;
  startMovement(fn: (...args: any[]) => any, done?: () => void): void;
  stopMovement(): void;
  movement(): ((...args: any[]) => any) | null;
  
  // Idle movement
  setIdleMovement(timeout: number, movement: ((...args: any[]) => any) | null): void;
  breakIdleMovement(): void;
  
  // NEW: Milestone 1 - LOD/Prefetch
  setLODPolicy(policy: LODPolicy): void;
  
  // NEW: Milestone 2 - Hotspot picking
  pick(screenX: number, screenY: number): { yaw: number; pitch: number } | null;
  
  // NEW: Milestone 3 - WebXR
  enterXR(opts?: XROptions): Promise<XRSessionHandle>;
  isXREnabled(): boolean;
  
  // NEW: Milestone 4 - Rendering backends
  getBackend(): Backend;
  setBackend(backend: Backend, opts?: BackendOptions): Promise<void>;
  
  // NEW: Milestone 4 - HDR & Tone Mapping
  setToneMapping(opts: ToneMapOptions): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  
  // Event listeners
  on(event: 'sceneChange', callback: () => void): void;
  on(event: 'viewChange', callback: () => void): void;
  on(event: 'perf', callback: (sample: PerfSample) => void): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

