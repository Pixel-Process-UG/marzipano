/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export default class AudioManager {
  getContext(): AudioContext;
  isRunning(): boolean;
  resume(): Promise<AudioContext>;
  suspend(): Promise<void>;
  isUnlocked(): boolean;
  close(): void;
  getCurrentTime(): number;
}

export const audioManager: AudioManager;

