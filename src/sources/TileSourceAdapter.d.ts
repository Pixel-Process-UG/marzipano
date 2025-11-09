/*
 * Copyright 2025 Marzipano Contributors. All rights reserved.
 * Licensed under the Apache License, Version 2.0
 */

export interface TileSourceAdapter {
  urlFor(level: number, face: number, x: number, y: number): string;
}

export interface IIIFOptions {
  baseUrl: string;
  tileSize?: number;
  quality?: string;
  format?: string;
}

export class IIIFTileSourceAdapter implements TileSourceAdapter {
  constructor(opts: IIIFOptions);
  urlFor(level: number, face: number, x: number, y: number): string;
}

export interface DeepZoomOptions {
  baseUrl: string;
  format?: string;
}

export class DeepZoomTileSourceAdapter implements TileSourceAdapter {
  constructor(opts: DeepZoomOptions);
  urlFor(level: number, face: number, x: number, y: number): string;
}

export interface GoogleMapsOptions {
  baseUrl: string;
  format?: string;
}

export class GoogleMapsTileSourceAdapter implements TileSourceAdapter {
  constructor(opts: GoogleMapsOptions);
  urlFor(level: number, face: number, x: number, y: number): string;
}

declare const TileSourceAdapters: {
  IIIFTileSourceAdapter: typeof IIIFTileSourceAdapter;
  DeepZoomTileSourceAdapter: typeof DeepZoomTileSourceAdapter;
  GoogleMapsTileSourceAdapter: typeof GoogleMapsTileSourceAdapter;
};

export default TileSourceAdapters;

