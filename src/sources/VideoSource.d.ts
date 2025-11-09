/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, Source } from '../types';
import VideoAsset from '../assets/VideoAsset';

export type VideoProjection = 'equirect360' | 'equirect180' | 'cubemap';

export interface VideoSourceOptions {
  loop?: boolean;
}

export default class VideoSource implements Source, EventEmitter {
  constructor(videoElement: HTMLVideoElement, projection: VideoProjection, opts?: VideoSourceOptions);
  
  loadAsset(stage: any, tile: any, done: (err: Error | null, tile: any, asset?: VideoAsset) => void): () => void;
  
  projection(): VideoProjection;
  videoElement(): HTMLVideoElement;
  asset(): VideoAsset;
  
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  
  currentTime(): number;
  duration(): number;
  isPlaying(): boolean;
  hasEnded(): boolean;
  
  destroy(): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

