/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export function getRGBMDecodeGLSL(): string;
export function getRGBEDecodeGLSL(): string;
export function getReinhardToneMappingGLSL(): string;
export function getACESToneMappingGLSL(): string;
export function getGammaCorrectionGLSL(): string;
export function getLuminanceGLSL(): string;
export function getToneMappingShaderCode(mode: string, includeRGBM?: boolean, includeRGBE?: boolean): string;

export class ToneMappingSettings {
  mode: 'none' | 'reinhard' | 'aces';
  exposure: number;
  gamma: number;
  
  constructor();
  getModeInt(): number;
  clone(): ToneMappingSettings;
  apply(opts: { mode?: string; exposure?: number; gamma?: number }): void;
}

declare const HDR: {
  getRGBMDecodeGLSL: typeof getRGBMDecodeGLSL;
  getRGBEDecodeGLSL: typeof getRGBEDecodeGLSL;
  getReinhardToneMappingGLSL: typeof getReinhardToneMappingGLSL;
  getACESToneMappingGLSL: typeof getACESToneMappingGLSL;
  getGammaCorrectionGLSL: typeof getGammaCorrectionGLSL;
  getLuminanceGLSL: typeof getLuminanceGLSL;
  getToneMappingShaderCode: typeof getToneMappingShaderCode;
  ToneMappingSettings: typeof ToneMappingSettings;
};

export default HDR;

