/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, Asset } from '../types';

export default class VideoAsset implements Asset, EventEmitter {
  constructor(videoElement: HTMLVideoElement);
  
  setVideo(videoElement: HTMLVideoElement): void;
  getVideo(): HTMLVideoElement;
  
  width(): number;
  height(): number;
  element(): HTMLVideoElement | HTMLCanvasElement;
  isDynamic(): boolean;
  timestamp(): number;
  
  isReady(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  isPlaying(): boolean;
  hasEnded(): boolean;
  
  destroy(): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  
  on(event: 'change', callback: () => void): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

