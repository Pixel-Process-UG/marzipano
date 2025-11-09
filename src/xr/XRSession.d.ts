/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { EventEmitter } from '../types';

export default class XRSessionHandle implements EventEmitter {
  constructor(xrSession: XRSession, renderLoop: any, view: any);
  
  init(referenceSpaceType?: XRReferenceSpaceType): Promise<XRSessionHandle>;
  
  getSession(): XRSession;
  isActive(): boolean;
  getReferenceSpace(): XRReferenceSpace | null;
  
  end(): Promise<void>;
  
  // EventEmitter methods
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  
  on(event: 'select', callback: (e: XRInputSourceEvent) => void): void;
  on(event: 'squeeze', callback: (e: XRInputSourceEvent) => void): void;
  on(event: 'end', callback: () => void): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

