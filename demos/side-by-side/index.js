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

// Create viewer.
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create left and right layers
const geometry = new Marzipano.CubeGeometry([
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 }
]);

// Create views.
const viewLimiter = Marzipano.RectilinearView.limit.traditional(3100, 100*Math.PI/180);
const viewLeft = new Marzipano.RectilinearView(null, viewLimiter);
const viewRight = new Marzipano.RectilinearView(null, viewLimiter);

// Get the stage.
const stage = viewer.stage();

// Create layers.
const leftLayer = createLayer(stage, viewLeft, geometry, 'left',
  { relativeWidth: 0.5, relativeX: 0 });
const rightLayer = createLayer(stage, viewRight, geometry, 'right',
  { relativeWidth: 0.5, relativeX: 0.5 });

// Add layers to stage.
stage.addLayer(leftLayer);
stage.addLayer(rightLayer);

function createLayer(stage, view, geometry, eye, rect) {
  const urlPrefix = "//www.marzipano.net/media/music-room";
  const source = Marzipano.ImageUrlSource.fromString(
    urlPrefix + "/" + eye + "/{z}/{f}/{y}/{x}.jpg",
    { cubeMapPreviewUrl: urlPrefix + "/" + eye + "/preview.jpg" });

  const textureStore = new Marzipano.TextureStore(source, stage);
  const layer = new Marzipano.Layer(source, geometry, view, textureStore,
                                  { effects: { rect: rect }});

  layer.pinFirstLevel();

  return layer;
}

// Adjust the projection center.
// Note that setProjectionCenterX() and setProjectionCenterY() are
// experimental APIs and may change in the future.

const projectionCenterXElement = document.querySelector("#projection-center-x");
const projectionCenterYElement = document.querySelector("#projection-center-y");

projectionCenterXElement.addEventListener('input', function() {
  const projectionCenterX = projectionCenterXElement.value;
  viewLeft.setProjectionCenterX(parseFloat(projectionCenterX));
  viewRight.setProjectionCenterX(parseFloat(-projectionCenterX));
});

projectionCenterYElement.addEventListener('input', function() {
  const projectionCenterY = projectionCenterYElement.value;
  viewLeft.setProjectionCenterY(parseFloat(projectionCenterY));
  viewRight.setProjectionCenterY(parseFloat(projectionCenterY));
});
