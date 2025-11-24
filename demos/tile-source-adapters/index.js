import * as Marzipano from '../../dist/marzipano.es.js';

// Create viewer
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Default scene (will be replaced when adapter loads)
let currentScene = null;

// UI elements
const tabButtons = document.querySelectorAll('.tab-btn');
const baseUrlInput = document.getElementById('base-url');
const tileSizeInput = document.getElementById('tile-size');
const formatSelect = document.getElementById('format');
const loadBtn = document.getElementById('load-btn');
const urlPatternDisplay = document.getElementById('url-pattern');
const tileSizeItem = document.getElementById('tile-size-item');
const formatItem = document.getElementById('format-item');

// Current adapter type
let currentAdapter = 'iiif';

// Tab switching
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentAdapter = btn.getAttribute('data-adapter');
    updateConfigPanel();
  });
});

// Update config panel based on adapter type
function updateConfigPanel() {
  switch (currentAdapter) {
    case 'iiif':
      baseUrlInput.placeholder = 'https://example.com/iiif/image';
      tileSizeItem.style.display = 'block';
      formatItem.style.display = 'block';
      break;
    case 'deepzoom':
      baseUrlInput.placeholder = 'https://example.com/deepzoom/image';
      tileSizeItem.style.display = 'none';
      formatItem.style.display = 'block';
      break;
    case 'googlemaps':
      baseUrlInput.placeholder = 'https://tiles.example.com';
      tileSizeItem.style.display = 'none';
      formatItem.style.display = 'block';
      break;
  }
}

// Load with adapter
loadBtn.addEventListener('click', () => {
  const baseUrl = baseUrlInput.value.trim();
  if (!baseUrl) {
    alert('Please enter a base URL');
    return;
  }

  let adapter;
  let urlPattern = '';

  switch (currentAdapter) {
    case 'iiif':
      adapter = new Marzipano.IIIFTileSourceAdapter({
        baseUrl: baseUrl,
        tileSize: parseInt(tileSizeInput.value),
        format: formatSelect.value
      });
      // Show example URL pattern
      const exampleUrl = adapter.urlFor(1, 0, 0, 0);
      urlPattern = `IIIF Format:\n${exampleUrl}\n\nPattern: {baseUrl}/{region}/{size}/{rotation}/{quality}.{format}`;
      break;

    case 'deepzoom':
      adapter = new Marzipano.DeepZoomTileSourceAdapter({
        baseUrl: baseUrl,
        format: formatSelect.value
      });
      const dzUrl = adapter.urlFor(2, 0, 1, 2);
      urlPattern = `Deep Zoom Format:\n${dzUrl}\n\nPattern: {baseUrl}/{level}/{x}_{y}.{format}`;
      break;

    case 'googlemaps':
      adapter = new Marzipano.GoogleMapsTileSourceAdapter({
        baseUrl: baseUrl,
        format: formatSelect.value
      });
      const gmUrl = adapter.urlFor(3, 0, 5, 7);
      urlPattern = `Google Maps Format:\n${gmUrl}\n\nPattern: {baseUrl}/{z}/{x}/{y}.{format}`;
      break;
  }

  // Create source from adapter
  const source = Marzipano.ImageUrlSource.fromTiles(adapter);

  // Create geometry
  const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

  // Create view
  const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
  const view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);

  // Destroy previous scene if exists
  if (currentScene) {
    viewer.destroyScene(currentScene);
  }

  // Create new scene
  currentScene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  // Display scene
  currentScene.switchTo();

  // Update URL pattern display
  urlPatternDisplay.textContent = urlPattern;

  console.log('Loaded with', currentAdapter, 'adapter');
});

// Initialize with default config
updateConfigPanel();

// Create a default scene for demonstration
const defaultSource = Marzipano.ImageUrlSource.fromString(
  "//www.marzipano.net/media/equirect/angra.jpg"
);
const defaultGeometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
const defaultLimiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
const defaultView = new Marzipano.RectilinearView({ yaw: Math.PI }, defaultLimiter);
currentScene = viewer.createScene({
  source: defaultSource,
  geometry: defaultGeometry,
  view: defaultView,
  pinFirstLevel: true
});
currentScene.switchTo();

console.log('Tile Source Adapters demo initialized');

