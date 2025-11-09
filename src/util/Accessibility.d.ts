/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export default class Accessibility {
  static prefersReducedMotion(): boolean;
  static adjustTransitionDuration(duration: number, disable?: boolean): number;
  static setAriaAttributes(element: HTMLElement, attrs: Record<string, any>): void;
  static setFocusOrder(elements: HTMLElement[]): void;
  static focusFirst(container: HTMLElement): boolean;
  static getTabbableElements(container: HTMLElement): HTMLElement[];
  static focusNext(container: HTMLElement, currentElement: HTMLElement): boolean;
  static focusPrevious(container: HTMLElement, currentElement: HTMLElement): boolean;
  static announce(message: string, priority?: 'polite' | 'assertive'): void;
}

