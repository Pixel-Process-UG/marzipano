import * as Marzipano from '../../dist/marzipano.es.js';

// Create viewer
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create source
const source = Marzipano.ImageUrlSource.fromString(
  "//www.marzipano.net/media/music-room/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: "//www.marzipano.net/media/music-room/preview.jpg" }
);

// Create geometry
const geometry = new Marzipano.CubeGeometry([
  { tileSize: 256, size: 256, fallbackOnly: true },
  { size: 512, tileSize: 512 },
  { size: 1024, tileSize: 512 },
  { size: 2048, tileSize: 512 }
]);

// Create view
const limiter = Marzipano.RectilinearView.limit.traditional(2048, 100*Math.PI/180);
const view = new Marzipano.RectilinearView(null, limiter);

// Create scene
const scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

// Display scene
scene.switchTo();

// Create prefetch strategy
const prefetchStrategy = new Marzipano.util.PrefetchStrategy();

// Statistics
let stats = {
  tilesPrefetched: 0,
  cacheHits: 0,
  cacheMisses: 0
};

// UI elements
const prefetchEnabled = document.getElementById('prefetch-enabled');
const prefetchRadius = document.getElementById('prefetch-radius');
const radiusDisplay = document.getElementById('radius-display');
const tilesPrefetchedDisplay = document.getElementById('tiles-prefetched');
const cacheHitsDisplay = document.getElementById('cache-hits');
const cacheMissesDisplay = document.getElementById('cache-misses');
const motionVectorDisplay = document.getElementById('motion-vector');
const resetStatsBtn = document.getElementById('reset-stats-btn');

// Update radius display
prefetchRadius.addEventListener('input', () => {
  radiusDisplay.textContent = prefetchRadius.value + '°';
});

// Reset statistics
resetStatsBtn.addEventListener('click', () => {
  stats.tilesPrefetched = 0;
  stats.cacheHits = 0;
  stats.cacheMisses = 0;
  updateStats();
});

// Update statistics display
function updateStats() {
  tilesPrefetchedDisplay.textContent = stats.tilesPrefetched;
  cacheHitsDisplay.textContent = stats.cacheHits;
  cacheMissesDisplay.textContent = stats.cacheMisses;
}

// Track view changes for prefetch strategy
let lastViewParams = null;
let lastTimestamp = Date.now();

view.addEventListener('change', () => {
  if (!prefetchEnabled.checked) return;

  const currentParams = {
    yaw: view.yaw(),
    pitch: view.pitch(),
    fov: view.fov()
  };
  const currentTimestamp = Date.now();

  // Update prefetch strategy with view history
  prefetchStrategy.updateViewHistory(currentParams, currentTimestamp);

  // Get motion vector
  const motionVector = prefetchStrategy.getMotionVector();
  if (motionVector.yaw !== 0 || motionVector.pitch !== 0) {
    motionVectorDisplay.textContent = 
      `Y: ${(motionVector.yaw * 1000).toFixed(2)}, P: ${(motionVector.pitch * 1000).toFixed(2)}`;
  }

  // Simulate prefetching (in a real implementation, this would trigger actual tile loading)
  if (lastViewParams) {
    const yawDiff = Math.abs(currentParams.yaw - lastViewParams.yaw);
    const pitchDiff = Math.abs(currentParams.pitch - lastViewParams.pitch);
    const radiusRad = parseFloat(prefetchRadius.value) * Math.PI / 180;
    
    if (yawDiff < radiusRad || pitchDiff < radiusRad) {
      stats.tilesPrefetched++;
      updateStats();
    }
  }

  lastViewParams = currentParams;
  lastTimestamp = currentTimestamp;
});

// Add navigation targets (hotspots) for prefetching
scene.hotspotContainer().on('hotspotCreate', (hotspot) => {
  const position = hotspot.position();
  if (position) {
    prefetchStrategy.addNavigationTarget({
      yaw: position.yaw,
      pitch: position.pitch
    }, 1);
  }
});

// Track cache hits/misses (simulated)
if (viewer.on) {
  viewer.on('perf', (sample) => {
    if (sample.cacheHits !== undefined) {
      stats.cacheHits = sample.cacheHits;
    }
    if (sample.cacheMisses !== undefined) {
      stats.cacheMisses = sample.cacheMisses;
    }
    updateStats();
  });
}

console.log('Prefetch Strategy demo initialized');

