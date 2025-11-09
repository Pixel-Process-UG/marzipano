/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

// Core type definitions for Marzipano

// Event emitter types
export interface EventEmitter {
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

// Size and position types
export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Coords {
  yaw: number;
  pitch: number;
}

export interface RectilinearViewCoords extends Coords {
  roll?: number;
  fov?: number;
}

export interface FlatViewCoords {
  x: number;
  y: number;
}

// View parameters
export interface ViewParameters {
  yaw?: number;
  pitch?: number;
  roll?: number;
  fov?: number;
  [key: string]: any;
}

// Layer effects
export interface Effects {
  opacity?: number;
  rect?: Rect;
  colorOffset?: number[];
  colorMatrix?: number[];
}

// Tile coordinates
export interface TileCoord {
  z: number;
  x?: number;
  y?: number;
  face?: string;
}

// Source interface
export interface Source {
  loadAsset(stage: Stage, tile: any, done: (err: Error | null, tile: any, asset?: Asset) => void): () => void;
}

// Asset interface
export interface Asset {
  width(): number;
  height(): number;
  element(): HTMLElement | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;
  isDynamic(): boolean;
  timestamp?(): number;
  destroy(): void;
}

// Geometry interface
export interface Geometry {
  type: string;
  levelList: Level[];
  visibleTiles(view: View, level: Level, result: any[]): void;
}

// Level interface
export interface Level {
  width(): number;
  height(): number;
  tileWidth(): number;
  tileHeight(): number;
}

// View interface
export interface View extends EventEmitter {
  type: string;
  setSize(size: Size): void;
  size(size?: Size): Size;
  parameters(params?: ViewParameters): ViewParameters;
  setParameters(params: ViewParameters): void;
  normalizeToClosest?(params: ViewParameters, result: ViewParameters): void;
  selectLevel?(levelList: Level[]): Level;
  coordinatesToScreen?(coords: Coords, result?: { x: number; y: number }): { x: number; y: number } | null;
  screenToCoordinates?(screen: { x: number; y: number }, result?: Coords): Coords | null;
}

// Stage interface
export interface Stage extends EventEmitter {
  type: string;
  domElement(): HTMLElement;
  width(): number;
  height(): number;
  size(size?: Size): Size;
  setSize(size: Size): void;
  setSizeForType(): void;
  registerRenderer(geometryType: string, viewType: string, renderer: any): void;
  loadImage(url: string, rect: Rect | null, done: (err: Error | null, asset?: Asset) => void): () => void;
  validateLayer(layer: Layer): void;
  addLayer(layer: Layer, index?: number): void;
  moveLayer(layer: Layer, index: number): void;
  removeLayer(layer: Layer): void;
  removeAllLayers(): void;
  listLayers(): Layer[];
  hasLayer(layer: Layer): boolean;
  render(): void;
  createTexture(tile: any, asset: Asset, done: (err: Error | null, tile: any, asset: Asset, texture: any) => void): () => void;
  destroyTexture(texture: any): void;
  startFrame(): void;
  endFrame(): void;
  createRenderer(rendererClass: any): any;
  destroyRenderer(renderer: any): void;
  destroy(): void;
}

// Texture store interface
export interface TextureStore extends EventEmitter {
  stage(): Stage;
  source(): Source;
  startFrame(): void;
  markTile(tile: any): void;
  endFrame(): void;
  pin(tile: any): void;
  unpin(tile: any): void;
  query(tile: any): any;
  texture(tile: any): any | null;
  clear(): void;
  clearNotPinned(): void;
  destroy(): void;
}

// Controls types
export interface ControlMethod {
  instance: any;
  destroy(): void;
}

// Hotspot types
export interface HotspotOptions {
  perspective?: {
    radius?: number;
    extraTransforms?: string;
  };
  kind?: 'dom' | 'embedded';
  zIndex?: number;
  ariaLabel?: string;
  tabbable?: boolean;
  occlusion?: 'none' | 'hide' | 'dim';
}

// NEW: Milestone 1 types

// LOD Policy
export interface LODPolicy {
  maxGpuMB: number;
  prefetchAhead?: number;
  evictionStrategy?: 'lru' | 'distance' | 'hybrid';
}

// Telemetry
export interface PerfSample {
  fps: number;
  droppedFrames: number;
  gpuMB: number;
  tilesResident: number;
  tilesHit: number;
  tilesMiss: number;
}

export interface TileEvent {
  event: 'hit' | 'miss';
  level: number;
}

// Tile Source Adapter
export interface TileSourceAdapter {
  urlFor(level: number, face: number, x: number, y: number): string;
}

// NEW: Milestone 2 types

// Video Source
export type VideoProjection = 'equirect360' | 'equirect180' | 'cubemap';

export interface MediaTimeEvent {
  currentTime: number;
}

// Audio Anchor
export interface AudioAnchorOptions {
  distanceModel?: 'linear' | 'inverse' | 'exponential';
  maxDistance?: number;
  refDistance?: number;
  rolloffFactor?: number;
  coneInnerAngle?: number;
  coneOuterAngle?: number;
  coneOuterGain?: number;
}

// Hotspot Engine v2
export type HotspotKind = 'dom' | 'embedded';

export interface HotspotHandle {
  setPosition(yaw: number, pitch: number): void;
  destroy(): void;
}

// NEW: Milestone 3 types

// WebXR
export interface XROptions {
  requiredFeatures?: ('local-floor' | 'bounded-floor' | 'hand-tracking' | 'hit-test')[];
  optionalFeatures?: string[];
}

export interface XRSessionHandle extends EventEmitter {
  end(): Promise<void>;
  on(event: 'select' | 'squeeze', cb: (e: any) => void): void;
}

// Transitions
export type TransitionKind = 'crossfade' | 'zoomMorph' | 'orbitToTarget';

export interface TransitionOptions {
  duration?: number;
  easing?: (t: number) => number;
  transitionUpdate?: (t: number, newScene: any, oldScene: any) => void;
}

// NEW: Milestone 4 types

// Rendering Backends
export type Backend = 'webgl2' | 'webgl1' | 'webgpu';

export interface BackendOptions {
  experimental?: boolean;
}

// HDR & Tone Mapping
export type ToneMappingMode = 'none' | 'reinhard' | 'aces';

export interface ToneMapOptions {
  mode: ToneMappingMode;
  exposure: number;
  gamma: number;
}

// Animation/Tween utilities
export type EasingFunction = (t: number) => number;

export interface TweenOptions {
  duration: number;
  easing?: EasingFunction;
  onUpdate?: (value: any) => void;
  onComplete?: () => void;
}

export type CancelFunction = () => void;

