import * as Marzipano from '../../dist/marzipano.es.js';

// Create viewer
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create source
const source = Marzipano.ImageUrlSource.fromString(
  "//www.marzipano.net/media/equirect/angra.jpg"
);

// Create geometry
const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

// Create view
const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
const view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);

// Create scene
const scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

// Display scene
scene.switchTo();

// Ray picker state
let pickMode = false;
const pickedPoints = [];
const markers = [];

// Create ray picker
const rayPicker = new Marzipano.util.RayPicker(view, geometry);

// UI elements
const pickModeBtn = document.getElementById('pick-mode-btn');
const clearBtn = document.getElementById('clear-btn');
const pointCount = document.getElementById('point-count');
const pointList = document.getElementById('point-list');

// Toggle pick mode
pickModeBtn.addEventListener('click', () => {
  pickMode = !pickMode;
  pickModeBtn.textContent = pickMode ? '❌ Cancel Pick' : '🎯 Pick Mode';
  pickModeBtn.style.background = pickMode ? '#ff6b6b' : '#667eea';
  updateCursor();
});

// Clear all points
clearBtn.addEventListener('click', () => {
  pickedPoints.length = 0;
  markers.forEach(marker => marker.remove());
  markers.length = 0;
  updatePointList();
});

// Handle clicks
viewer.domElement().addEventListener('click', (e) => {
  if (!pickMode) return;

  const rect = viewer.domElement().getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  // Use viewer's pick method if available, otherwise use ray picker
  let coords;
  if (viewer.pick) {
    coords = viewer.pick(screenX, screenY);
  } else {
    // Fallback: use ray picker directly
    const viewport = {
      width: rect.width,
      height: rect.height
    };
    coords = rayPicker.screenToCoordinates(screenX, screenY, viewport);
  }

  if (coords) {
    addPickedPoint(screenX, screenY, coords);
  }
});

function addPickedPoint(screenX, screenY, coords) {
  const point = {
    id: Date.now(),
    screenX,
    screenY,
    yaw: coords.yaw,
    pitch: coords.pitch
  };

  pickedPoints.push(point);

  // Create visual marker
  const marker = document.createElement('div');
  marker.className = 'pick-marker';
  marker.style.left = screenX + 'px';
  marker.style.top = screenY + 'px';
  document.body.appendChild(marker);
  markers.push(marker);

  // Create hotspot at picked location
  const hotspotElement = document.createElement('div');
  hotspotElement.className = 'hotspot';
  hotspotElement.style.width = '20px';
  hotspotElement.style.height = '20px';
  hotspotElement.style.borderRadius = '50%';
  hotspotElement.style.background = 'rgba(255, 107, 107, 0.6)';
  hotspotElement.style.border = '2px solid #ff6b6b';
  hotspotElement.title = `Yaw: ${(coords.yaw * 180 / Math.PI).toFixed(2)}°, Pitch: ${(coords.pitch * 180 / Math.PI).toFixed(2)}°`;

  scene.hotspotContainer().createHotspot(hotspotElement, {
    yaw: coords.yaw,
    pitch: coords.pitch
  });

  updatePointList();
}

function updatePointList() {
  pointCount.textContent = pickedPoints.length;
  pointList.innerHTML = '';

  pickedPoints.forEach((point, index) => {
    const item = document.createElement('div');
    item.className = 'point-item';
    item.innerHTML = `
      <strong>Point ${index + 1}</strong>
      Yaw: ${(point.yaw * 180 / Math.PI).toFixed(2)}°<br>
      Pitch: ${(point.pitch * 180 / Math.PI).toFixed(2)}°<br>
      Screen: (${point.screenX.toFixed(0)}, ${point.screenY.toFixed(0)})
    `;
    pointList.appendChild(item);
  });
}

function updateCursor() {
  viewer.domElement().style.cursor = pickMode ? 'crosshair' : 'default';
}

console.log('Ray Picker demo initialized');

