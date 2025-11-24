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
import transitionFunctions from './transitionFunctions.js';

// Create viewer.
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create a geometry to be shared by the two scenes.
const geometry = new Marzipano.CubeGeometry([
    { tileSize: 256, size: 256, fallbackOnly: true },
    { size: 512, tileSize: 512 },
    { size: 1024, tileSize: 512 },
    { size: 2048, tileSize: 512 }
]);

// Create a view limiter to be shared by the two scenes.
const limiter = Marzipano.RectilinearView.limit.traditional(2048, 120*Math.PI/180);

const urlPrefix = "//www.marzipano.net/media";

// Set up the first scene.
const view1 = new Marzipano.RectilinearView(null, limiter);
const source1 = Marzipano.ImageUrlSource.fromString(
  urlPrefix + "/electricity-museum/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: urlPrefix + "/electricity-museum/preview.jpg" });
const scene1 = viewer.createScene({
  source: source1,
  geometry: geometry,
  view: view1,
  pinFirstLevel: true
});

// Set up the second scene.
const view2 = new Marzipano.RectilinearView(null, limiter);
const source2 = Marzipano.ImageUrlSource.fromString(
  urlPrefix + "/jeronimos/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: urlPrefix + "/jeronimos/preview.jpg" });
const scene2 = viewer.createScene({
  source: source2,
  geometry: geometry,
  view: view2,
  pinFirstLevel: true
});

// Store the currently displayed scene.
let currentScene;

// Display the initial scene.
nextScene().switchTo({ transitionDuration: 0 });

// Return the next scene to be displayed.
function nextScene() {
  switch (currentScene) {
    case scene1: return (currentScene = scene2);
    case scene2: return (currentScene = scene1);
    default: return (currentScene = scene1);
  }
}

// Change to the next scene.
function changeScene(transitionDuration, transitionUpdate) {
  nextScene().switchTo({
    transitionDuration: transitionDuration,
    transitionUpdate: transitionUpdate
  });
}

// Get elements from DOM.
const menuItems = document.querySelectorAll("[data-easing]");
const easingSelect = document.getElementById("easing");
const funSelect = document.getElementById("fun");
const timeInput = document.getElementById("time");

// Set up the predefined transitions menu.
for (let i = 0; i < menuItems.length; i++) {
  (function(i) {
    const item = menuItems[i];
    const fun = transitionFunctions[item.getAttribute('data-fun')];
    const time = parseInt(item.getAttribute('data-time'));
    const ease = easing[item.getAttribute('data-easing')];
    item.onclick = function() {
      changeScene(time, fun(ease));
    }
  })(i);
}

// Populate custom animation easings.
for (const key in easing) {
  const el = document.createElement('option');
  el.value = key;
  el.innerHTML = key;
  easingSelect.appendChild(el);
}

// Populate custom animation functions.
for (const key in transitionFunctions) {
  const el = document.createElement('option');
  el.value = key;
  el.innerHTML = key;
  funSelect.appendChild(el);
}

// Kick off custom transition on form submission.
document.getElementById('customForm').onsubmit = function(e) {
  const time = timeInput.value;
  const fun = transitionFunctions[funSelect.value];
  const ease = easing[easingSelect.value];
  changeScene(time, fun(ease));
  e.preventDefault();
}
