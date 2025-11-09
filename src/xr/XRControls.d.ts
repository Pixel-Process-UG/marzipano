/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter } from '../types';

export default class XRControls implements EventEmitter {
  constructor(xrSession: XRSession);
  
  update(xrFrame: XRFrame): void;
  getInputSources(): XRInputSource[];
  getPrimaryInputSource(): XRInputSource | null;
  destroy(): void;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

