/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { HotspotOptions } from './types';

export default class Hotspot {
  constructor(domElement: HTMLElement, parentDomElement: HTMLElement, view: any, coords: any, opts?: HotspotOptions);
  
  // Core methods
  destroy(): void;
  domElement(): HTMLElement;
  position(): any;
  setPosition(coords: any): void;
  
  // NEW: Milestone 2 - Hotspot Engine v2
  setZIndex(zIndex: number): void;
  setOcclusion(mode: 'none' | 'hide' | 'dim'): void;
}

