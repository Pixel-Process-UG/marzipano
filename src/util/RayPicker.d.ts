/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

import { View, Size } from '../types';

export default class RayPicker {
  static screenToCoordinates(
    screenX: number,
    screenY: number,
    view: View,
    stageSize: Size
  ): { yaw: number; pitch: number } | null;

  static coordinatesToScreen(
    yaw: number,
    pitch: number,
    view: View,
    stageSize: Size
  ): { x: number; y: number } | null;

  static isVisible(yaw: number, pitch: number, view: View): boolean;

  static angularDistance(
    yaw1: number,
    pitch1: number,
    yaw2: number,
    pitch2: number
  ): number;
}

