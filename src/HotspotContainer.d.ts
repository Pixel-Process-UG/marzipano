/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter, Rect } from './types';
import Hotspot from './Hotspot';

export default class HotspotContainer implements EventEmitter {
  constructor(parentDomElement: HTMLElement, stage: any, view: any, renderLoop: any, opts?: { rect?: Rect });
  
  // Core methods
  destroy(): void;
  domElement(): HTMLElement;
  setRect(rect: Rect | null): void;
  rect(): Rect | null;
  
  // Hotspot management
  createHotspot(domElement: HTMLElement, coords: any, opts?: any): Hotspot;
  hasHotspot(hotspot: Hotspot): boolean;
  listHotspots(): Hotspot[];
  destroyHotspot(hotspot: Hotspot): void;
  
  // Visibility
  hide(): void;
  show(): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  
  // Event listeners
  on(event: 'hotspotsChange', callback: () => void): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

