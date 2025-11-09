/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export type EasingFunction = (t: number) => number;

export function linear(t: number): number;
export function easeInOutQuad(t: number): number;
export function easeInQuad(t: number): number;
export function easeOutQuad(t: number): number;
export function easeInOutCubic(t: number): number;
export function easeInCubic(t: number): number;
export function easeOutCubic(t: number): number;
export function easeInOutQuart(t: number): number;
export function easeInOutQuint(t: number): number;
export function easeInOutSine(t: number): number;
export function easeInOutExpo(t: number): number;
export function easeInOutCirc(t: number): number;
export function easeOutElastic(t: number): number;
export function easeInOutElastic(t: number): number;
export function easeOutBounce(t: number): number;
export function easeInOutBounce(t: number): number;
export function easeInOutBack(t: number): number;

export function interpolate(from: number, to: number, t: number, easing?: EasingFunction): number;
export function interpolateAngle(from: number, to: number, t: number, easing?: EasingFunction): number;

export interface AnimateOptions {
  duration: number;
  easing?: EasingFunction;
  onUpdate: (progress: number) => void;
  onComplete?: () => void;
}

export function animate(opts: AnimateOptions): () => void;

declare const animation: {
  linear: typeof linear;
  easeInOutQuad: typeof easeInOutQuad;
  easeInQuad: typeof easeInQuad;
  easeOutQuad: typeof easeOutQuad;
  easeInOutCubic: typeof easeInOutCubic;
  easeInCubic: typeof easeInCubic;
  easeOutCubic: typeof easeOutCubic;
  easeInOutQuart: typeof easeInOutQuart;
  easeInOutQuint: typeof easeInOutQuint;
  easeInOutSine: typeof easeInOutSine;
  easeInOutExpo: typeof easeInOutExpo;
  easeInOutCirc: typeof easeInOutCirc;
  easeOutElastic: typeof easeOutElastic;
  easeInOutElastic: typeof easeInOutElastic;
  easeOutBounce: typeof easeOutBounce;
  easeInOutBounce: typeof easeInOutBounce;
  easeInOutBack: typeof easeInOutBack;
  interpolate: typeof interpolate;
  interpolateAngle: typeof interpolateAngle;
  animate: typeof animate;
};

export default animation;

