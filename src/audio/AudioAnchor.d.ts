/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, AudioAnchorOptions } from '../types';

export default class AudioAnchor implements EventEmitter {
  constructor(context: AudioContext, position: { yaw: number; pitch: number }, opts?: AudioAnchorOptions);
  
  setPosition(yaw: number, pitch: number): void;
  getPosition(): { yaw: number; pitch: number };
  updateListener(viewParams: { yaw?: number; pitch?: number; roll?: number }): void;
  
  connect(sourceNode: AudioNode): void;
  disconnect(sourceNode: AudioNode): void;
  disconnectAll(): void;
  
  setVolume(volume: number): void;
  getVolume(): number;
  fadeVolume(targetVolume: number, duration: number): void;
  
  getPanner(): PannerNode;
  getGainNode(): GainNode;
  
  destroy(): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

