/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as Marzipano from '../../dist/marzipano.es.js';

// Create a stage and register the default renderers.
const stage = new Marzipano.WebGlStage();
Marzipano.registerDefaultRenderers(stage);

// Set up view.
const initialViewParams = { yaw: Math.PI/16, pitch: 0, fov: Math.PI/2 };
const view = new Marzipano.RectilinearView(initialViewParams);

// Set up the bottom layer.
const levelsBelow = [512].map(function(size) {
  return {size: size, tileSize: 512};
});
const geometryBelow = new Marzipano.CubeGeometry(levelsBelow);
const sourceBelow = new Marzipano.ImageUrlSource(function(tile) {
  return { url: "//www.marzipano.net/media/pixels/red.png" };
});
const textureStoreBelow = new Marzipano.TextureStore(sourceBelow, stage);
const layerBelow = new Marzipano.Layer(
    sourceBelow, geometryBelow, view, textureStoreBelow, { effects: { opacity: 1 } });

// Set up the top layer.
const levelsAbove = [512, 1024, 2048, 4096].map(function(size) {
  return {size: size, tileSize: 512};
});
const geometryAbove = new Marzipano.CubeGeometry(levelsAbove);
const sourceAbove = new Marzipano.ImageUrlSource(function(tile) {
  return { url: "//www.marzipano.net/media/generated-tiles/" +
    tile.z + '_' + tile.face + '_' + tile.x + '_' + tile.y + '.png' };
});
const textureStoreAbove = new Marzipano.TextureStore(sourceAbove, stage);
const layerAbove = new Marzipano.Layer(
    sourceAbove, geometryAbove, view, textureStoreAbove, { effects: { opacity: 0.6 } });

// Add layers to stage.
stage.addLayer(layerBelow);
stage.addLayer(layerAbove);

// Add stage into DOM and update its size.
const container = document.getElementById('rendered');
container.appendChild(stage.domElement());
stage.setSize({ width: container.clientWidth, height: container.clientHeight });

// Pin level 0 so it serves as the last-resort fallback.
layerBelow.pinLevel(0);
layerAbove.pinLevel(0);

// Force level 2 to be rendered, causing levels 1 and 3 to be used as parent
// and children fallbacks, respectively.
layerAbove.setFixedLevel(2);

// List of tiles to be preloaded.
const preloadTiles = [
  // Level 1 tile on top right of front face (parent fallback).
  new Marzipano.CubeGeometry.Tile('f', 1, 0, 1, geometryAbove),
  // Level 2 tile on bottom right of front face (intended display level).
  new Marzipano.CubeGeometry.Tile('f', 3, 2, 2, geometryAbove),
  // Level 3 tiles on bottom right of front face (children fallback).
  new Marzipano.CubeGeometry.Tile('f', 6, 6, 3, geometryAbove),
  new Marzipano.CubeGeometry.Tile('f', 6, 7, 3, geometryAbove),
  new Marzipano.CubeGeometry.Tile('f', 7, 6, 3, geometryAbove),
  new Marzipano.CubeGeometry.Tile('f', 7, 7, 3, geometryAbove),
  // Level 3 tiles on bottom right of front face (incomplete children fallback).
  new Marzipano.CubeGeometry.Tile('f', 4, 4, 3, geometryAbove),
  new Marzipano.CubeGeometry.Tile('f', 4, 5, 3, geometryAbove)
];

// Pin tiles to force them to load.
for (let i = 0; i < preloadTiles.length; i++) {
  layerAbove.textureStore().pin(preloadTiles[i]);
}

// Check whether all tiles have loaded.
function ready() {
  for (let i = 0; i < preloadTiles.length; i++) {
    const state = layerAbove.textureStore().query(preloadTiles[i]);
    if (!state.hasTexture) {
      return false;
    }
  }
  return true;
}

// Wait for tiles to load, then render.
const checkInterval = 200;
setTimeout(function check() {
  if (ready()) {
    stage.render();
  } else {
    setTimeout(check, checkInterval);
  }
}, checkInterval);
