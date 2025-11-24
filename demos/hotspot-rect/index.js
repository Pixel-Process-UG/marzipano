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

const rects = [
  null,
  { relativeWidth: 0.6, relativeHeight: 0.3, relativeX: 0.6 },
  { relativeWidth: 0.6, relativeHeight: 0.7, relativeX: 0.4, relativeY: 0.3 }
];

// Create viewer.
const viewer = new Marzipano.Viewer(document.querySelector('#pano'));

// Get the stage.
const stage = viewer.stage();

// Create source.
const source = Marzipano.ImageUrlSource.fromString(
  "//www.marzipano.net/media/cubemap/{f}.jpg"
);

// Create geometry.
const geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

// Create view limiter.
const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);

// Create layers with different `rect` parameters and with hotspots.
const marzipanoObjects = rects.map(function(rect) {
  // Create layer.
  const view = new Marzipano.RectilinearView(null);
  const textureStore = new Marzipano.TextureStore(source, stage);
  const layer = new Marzipano.Layer(source, geometry, view, textureStore, { effects: { rect: rect }});

  // Add hotspot.
  const hotspotContainer = new Marzipano.HotspotContainer(viewer.domElement(), stage, view, viewer.renderLoop(), { rect: rect });
  const hotspotElement = document.createElement('div');
  hotspotElement.className = 'hotspot';
  const hotspot = hotspotContainer.createHotspot(hotspotElement, { yaw: 0.1, pitch: -0.3 });

  // Add layer into stage.
  stage.addLayer(layer);

  return { layer: layer, hotspotContainer: hotspotContainer, hotspot: hotspot}
});
