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

// UI elements
const exposureInput = document.getElementById('exposure');
const gammaInput = document.getElementById('gamma');
const exposureDisplay = document.getElementById('exposure-display');
const gammaDisplay = document.getElementById('gamma-display');
const resetBtn = document.getElementById('reset-btn');

// Update tone mapping
function updateToneMapping() {
  const exposure = parseFloat(exposureInput.value);
  const gamma = parseFloat(gammaInput.value);

  if (viewer.setToneMapping) {
    viewer.setToneMapping({
      exposure: exposure,
      gamma: gamma
    });
  } else {
    // Fallback: use HDR utility if available
    if (Marzipano.util.HDR) {
      // Apply tone mapping via effects or other means
      console.log('Tone mapping:', { exposure, gamma });
    }
  }

  exposureDisplay.textContent = exposure.toFixed(1);
  gammaDisplay.textContent = gamma.toFixed(1);
}

// Event listeners
exposureInput.addEventListener('input', updateToneMapping);
gammaInput.addEventListener('input', updateToneMapping);

// Reset to default
resetBtn.addEventListener('click', () => {
  exposureInput.value = 0;
  gammaInput.value = 1.0;
  updateToneMapping();
});

// Initialize
updateToneMapping();

console.log('HDR/Tone Mapping demo initialized');

