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

// UI elements
const gpuMemoryInput = document.getElementById('gpu-memory');
const prefetchAheadInput = document.getElementById('prefetch-ahead');
const evictionStrategySelect = document.getElementById('eviction-strategy');
const applyBtn = document.getElementById('apply-btn');
const resetBtn = document.getElementById('reset-btn');
const gpuMemoryDisplay = document.getElementById('gpu-memory-display');
const prefetchDisplay = document.getElementById('prefetch-display');
const fpsDisplay = document.getElementById('fps');
const gpuUsedDisplay = document.getElementById('gpu-used');
const tilesResidentDisplay = document.getElementById('tiles-resident');
const currentLevelDisplay = document.getElementById('current-level');

// Update displays when inputs change
gpuMemoryInput.addEventListener('input', () => {
  gpuMemoryDisplay.textContent = gpuMemoryInput.value + ' MB';
});

prefetchAheadInput.addEventListener('input', () => {
  prefetchDisplay.textContent = prefetchAheadInput.value + ' levels';
});

// Apply LOD policy
applyBtn.addEventListener('click', () => {
  const maxGpuMB = parseInt(gpuMemoryInput.value);
  const prefetchAhead = parseInt(prefetchAheadInput.value);
  const evictionStrategy = evictionStrategySelect.value;

  const lodPolicy = new Marzipano.util.LODPolicy({
    maxGpuMB: maxGpuMB,
    prefetchAhead: prefetchAhead,
    evictionStrategy: evictionStrategy
  });

  viewer.setLODPolicy(lodPolicy);
  
  console.log('LOD Policy applied:', {
    maxGpuMB,
    prefetchAhead,
    evictionStrategy
  });
});

// Reset to default
resetBtn.addEventListener('click', () => {
  gpuMemoryInput.value = 256;
  prefetchAheadInput.value = 2;
  evictionStrategySelect.value = 'hybrid';
  gpuMemoryDisplay.textContent = '256 MB';
  prefetchDisplay.textContent = '2 levels';
  
  const defaultPolicy = new Marzipano.util.LODPolicy({
    maxGpuMB: 256,
    prefetchAhead: 2,
    evictionStrategy: 'hybrid'
  });
  
  viewer.setLODPolicy(defaultPolicy);
});

// Performance monitoring
if (viewer.on) {
  viewer.on('perf', (sample) => {
    if (sample.fps !== undefined) {
      fpsDisplay.textContent = sample.fps.toFixed(1);
    }
    if (sample.gpuMB !== undefined) {
      gpuUsedDisplay.textContent = sample.gpuMB.toFixed(2);
    }
    if (sample.tilesResident !== undefined) {
      tilesResidentDisplay.textContent = sample.tilesResident;
    }
  });
}

// Update current level
view.addEventListener('change', () => {
  const level = view.selectLevel(geometry.levelList);
  if (level) {
    currentLevelDisplay.textContent = level.index();
  }
});

// Initialize with default policy
const defaultPolicy = new Marzipano.util.LODPolicy({
  maxGpuMB: 256,
  prefetchAhead: 2,
  evictionStrategy: 'hybrid'
});
viewer.setLODPolicy(defaultPolicy);

console.log('LOD Policy demo initialized');

