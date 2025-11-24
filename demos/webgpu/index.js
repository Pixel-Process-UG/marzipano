import * as Marzipano from '../../dist/marzipano.es.js';

// Check WebGPU availability
async function checkWebGPUSupport() {
  if (!navigator.gpu) {
    return false;
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return adapter !== null;
  } catch (e) {
    return false;
  }
}

// Check WebGL availability
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
}

// Create viewer with WebGL (default)
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

// UI elements
const currentBackendDisplay = document.getElementById('current-backend');
const webgpuAvailableDisplay = document.getElementById('webgpu-available');
const webglAvailableDisplay = document.getElementById('webgl-available');
const switchBackendBtn = document.getElementById('switch-backend-btn');
const switchWebglBtn = document.getElementById('switch-webgl-btn');
const fpsDisplay = document.getElementById('fps');
const backendNameDisplay = document.getElementById('backend-name');

let webgpuAvailable = false;
let currentBackend = 'webgl';

// Check support
async function initialize() {
  webgpuAvailable = await checkWebGPUSupport();
  const webglAvailable = checkWebGLSupport();

  webgpuAvailableDisplay.textContent = webgpuAvailable ? 'Yes' : 'No';
  webgpuAvailableDisplay.style.color = webgpuAvailable ? '#10b981' : '#ef4444';
  
  webglAvailableDisplay.textContent = webglAvailable ? 'Yes' : 'No';
  webglAvailableDisplay.style.color = webglAvailable ? '#10b981' : '#ef4444';

  currentBackendDisplay.textContent = currentBackend.toUpperCase();
  backendNameDisplay.textContent = currentBackend.toUpperCase();

  if (webgpuAvailable && viewer.setBackend) {
    switchBackendBtn.disabled = false;
  }
  if (webglAvailable) {
    switchWebglBtn.disabled = false;
  }
}

// Switch to WebGPU
switchBackendBtn.addEventListener('click', async () => {
  if (!viewer.setBackend) {
    alert('WebGPU backend switching not available in this version');
    return;
  }

  try {
    await viewer.setBackend('webgpu');
    currentBackend = 'webgpu';
    currentBackendDisplay.textContent = 'WebGPU';
    backendNameDisplay.textContent = 'WebGPU';
    switchBackendBtn.disabled = true;
    switchWebglBtn.disabled = false;
    console.log('Switched to WebGPU backend');
  } catch (e) {
    console.error('Failed to switch to WebGPU:', e);
    alert('Failed to switch to WebGPU: ' + e.message);
  }
});

// Switch to WebGL
switchWebglBtn.addEventListener('click', async () => {
  if (!viewer.setBackend) {
    return;
  }

  try {
    await viewer.setBackend('webgl');
    currentBackend = 'webgl';
    currentBackendDisplay.textContent = 'WebGL';
    backendNameDisplay.textContent = 'WebGL';
    switchBackendBtn.disabled = false;
    switchWebglBtn.disabled = true;
    console.log('Switched to WebGL backend');
  } catch (e) {
    console.error('Failed to switch to WebGL:', e);
    alert('Failed to switch to WebGL: ' + e.message);
  }
});

// Performance monitoring
if (viewer.on) {
  viewer.on('perf', (sample) => {
    if (sample.fps !== undefined) {
      fpsDisplay.textContent = sample.fps.toFixed(1);
    }
  });
}

// Initialize
initialize();

console.log('WebGPU demo initialized');

