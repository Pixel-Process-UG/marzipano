/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, TileEvent, MediaTimeEvent, HotspotKind, HotspotOptions, HotspotHandle } from './types';
import Viewer from './Viewer';
import Layer from './Layer';
import HotspotContainer from './HotspotContainer';

export default class Scene implements EventEmitter {
  constructor(viewer: Viewer, view: any);
  
  // Core methods
  destroy(): void;
  hotspotContainer(): HotspotContainer;
  layer(): Layer | null;
  listLayers(): Layer[];
  view(): any;
  viewer(): Viewer;
  visible(): boolean;
  
  // Layer management
  createLayer(opts: {
    source: any;
    geometry: any;
    pinFirstLevel?: boolean;
    textureStoreOpts?: any;
    layerOpts?: any;
  }): Layer;
  
  destroyLayer(layer: Layer): void;
  destroyAllLayers(): void;
  
  // Scene control
  switchTo(opts?: any, done?: () => void): void;
  lookTo(params: any, opts?: any, done?: () => void): void;
  startMovement(fn: (...args: any[]) => any, done?: () => void): void;
  stopMovement(): void;
  movement(): ((...args: any[]) => any) | null;
  
  // NEW: Milestone 2 - Video support
  bindVideo(source: any): void;
  
  // NEW: Milestone 2 - Spatial audio
  createAudioAnchor(position: { yaw: number; pitch: number }, opts?: any): any;
  
  // NEW: Milestone 2 - Hotspot Engine v2
  addHotspot(element: HTMLElement, position: { yaw: number; pitch: number }, opts?: HotspotOptions): HotspotHandle;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  
  // Event listeners
  on(event: 'viewChange', callback: () => void): void;
  on(event: 'layerChange', callback: () => void): void;
  on(event: 'tile', callback: (e: TileEvent) => void): void;
  on(event: 'mediaTime', callback: (e: MediaTimeEvent) => void): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

