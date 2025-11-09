/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import Stage from './Stage';

export interface WebGpuStageOptions {
  experimental: boolean;
  progressive?: boolean;
}

export default class WebGpuStage extends Stage {
  constructor(opts: WebGpuStageOptions);
  
  init(): Promise<WebGpuStage>;
  device(): GPUDevice | null;
  gpuContext(): GPUCanvasContext | null;
  isInitialized(): boolean;
}

