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
import SolidColorSource from './SolidColorSource.js';

// Create viewer.
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create procedurally-generated single-color tile source.
const source = new SolidColorSource(512, 512);

// Create geometry with a very large number of levels.
const levels = [];
for(let i = 0; i < 32; i++) {
  levels.push({ tileSize: 512, size: 512 * Math.pow(2,i) });
}
const geometry = new Marzipano.CubeGeometry(levels);

// Create view.
const view = new Marzipano.RectilinearView();

// Create scene.
const scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();

// Show stats about the current view and cubemap size.

const facePixelsElement = document.getElementById('facePixels');
const faceTilesElement = document.getElementById('faceTiles');
const totalPixelsElement = document.getElementById('totalPixels');
const totalTilesElement = document.getElementById('totalTiles');
const fovElement = document.getElementById('fov');

view.addEventListener('change', function() {
  const level = view.selectLevel(geometry.levelList);

  const faceTiles = level.numHorizontalTiles() * level.numVerticalTiles();
  const totalTiles = faceTiles * 6;
  const faceMegaPixels = (level.width()/1000) * (level.height()/1000);
  const totalMegaPixels = faceMegaPixels * 6;

  const fovDeg = view.fov() * 180/Math.PI;
  const fovFormatted = fovDeg.toFixed(10) + '°';

  const faceTilesFormatted = formatTileNum(faceTiles);
  const totalTilesFormatted = formatTileNum(totalTiles);
  const facePixelsFormatted = formatMegaPixels(faceMegaPixels) + 'pixel';
  const totalPixelsFormatted = formatMegaPixels(totalMegaPixels) + 'pixel';

  faceTilesElement.innerHTML = faceTilesFormatted;
  totalTilesElement.innerHTML = totalTilesFormatted;
  facePixelsElement.innerHTML = facePixelsFormatted;
  totalPixelsElement.innerHTML = totalPixelsFormatted;
  fovElement.innerHTML = fovFormatted;
});

function formatMegaPixels(num) {
  const suffixes = [ 'Mega' , 'Giga', 'Tera', 'Peta', 'Exa', 'Zetta' ];
  let i = 0;
  for (i = 0; i < suffixes.length; i++) {
    const divider = Math.pow(1000, i);
    if (num < divider) {
      break;
    }
  }
  i -= 1;
  const divided = num / Math.pow(1000, i);
  const formatted = divided.toFixed(2) + ' ' + suffixes[i];
  return formatted;
}

function formatTileNum(num) {
  const suffixes = [ '', 'K', 'M' , 'G', 'T', 'P', 'E', 'Z' ];
  if (num < 999999) {
    return num;
  }
  let i = 0;
  for (i = 0; i < suffixes.length; i++) {
    const divider = Math.pow(1000, i);
    if (num < divider) {
      break;
    }
  }
  i -= 1;
  const divided = num / Math.pow(1000, i);
  const formatted = divided.toFixed(2) + suffixes[i];
  return formatted;
}
