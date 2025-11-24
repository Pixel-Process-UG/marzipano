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

// Create source.
const source = Marzipano.ImageUrlSource.fromString(
  "//www.marzipano.net/media/cubemap/{f}.jpg"
);

// Create geometry.
const geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

// Create view.
const limiter = Marzipano.RectilinearView.limit.traditional(4096, 100*Math.PI/180);
const view = new Marzipano.RectilinearView(null, limiter);

// Create scene.
const scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();
