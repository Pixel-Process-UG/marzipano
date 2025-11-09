/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export interface PerformanceSample {
  fps: number;
  droppedFrames: number;
  avgFrameTime: number;
  timestamp: number;
  [key: string]: any;
}

export default class Telemetry {
  constructor();
  
  recordFrame(timestamp: number): void;
  getFPS(): number;
  getDroppedFrames(): number;
  resetDroppedFrames(): void;
  getAverageFrameTime(): number;
  getSample(additionalData?: Record<string, any>): PerformanceSample;
  getLastSample(): PerformanceSample | null;
  reset(): void;
}

