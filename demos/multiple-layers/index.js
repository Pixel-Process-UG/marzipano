import * as Marzipano from '../../dist/marzipano.es.js';

// Create viewer
const viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create view (shared by all layers)
const limiter = Marzipano.RectilinearView.limit.traditional(4096, 100*Math.PI/180);
const view = new Marzipano.RectilinearView(null, limiter);

// Get stage
const stage = viewer.stage();

// Layer management
const layers = [];
let layerCounter = 0;

// Panorama sources for different layers
const layerSources = [
  "//www.marzipano.net/media/equirect/angra.jpg",
  "//www.marzipano.net/media/music-room/{z}/{f}/{y}/{x}.jpg",
  "//www.marzipano.net/media/cubemap/{f}.jpg"
];

const layerGeometries = [
  () => new Marzipano.EquirectGeometry([{ width: 4000 }]),
  () => new Marzipano.CubeGeometry([
    { tileSize: 256, size: 256, fallbackOnly: true },
    { size: 512, tileSize: 512 },
    { size: 1024, tileSize: 512 }
  ]),
  () => new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }])
];

// UI elements
const addLayerBtn = document.getElementById('add-layer-btn');
const removeLayerBtn = document.getElementById('remove-layer-btn');
const layerCountDisplay = document.getElementById('layer-count');
const layerList = document.getElementById('layer-list');

// Add a new layer
function addLayer() {
  const layerIndex = layerCounter % layerSources.length;
  const sourceUrl = layerSources[layerIndex];
  const geometry = layerGeometries[layerIndex]();
  
  let source;
  if (sourceUrl.includes('{f}')) {
    // Cube map
    source = Marzipano.ImageUrlSource.fromString(sourceUrl);
  } else if (sourceUrl.includes('{z}')) {
    // Multi-resolution cube
    source = Marzipano.ImageUrlSource.fromString(
      sourceUrl,
      { cubeMapPreviewUrl: "//www.marzipano.net/media/music-room/preview.jpg" }
    );
  } else {
    // Equirect
    source = Marzipano.ImageUrlSource.fromString(sourceUrl);
  }

  const textureStore = new Marzipano.TextureStore(source, stage);
  const layer = new Marzipano.Layer(
    source,
    geometry,
    view,
    textureStore,
    { effects: { opacity: 0.7 } }
  );

  layer.pinFirstLevel();
  stage.addLayer(layer);

  const layerData = {
    id: layerCounter++,
    layer: layer,
    opacity: 0.7
  };

  layers.push(layerData);
  updateLayerList();
  updateLayerCount();
}

// Remove the last layer
function removeLayer() {
  if (layers.length <= 1) {
    alert('At least one layer must remain');
    return;
  }

  const layerData = layers.pop();
  stage.removeLayer(layerData.layer);
  layerData.layer.destroy();
  updateLayerList();
  updateLayerCount();
}

// Update layer list UI
function updateLayerList() {
  layerList.innerHTML = '';

  layers.forEach((layerData, index) => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0';
    opacitySlider.max = '1';
    opacitySlider.step = '0.01';
    opacitySlider.value = layerData.opacity;
    
    const valueDisplay = document.createElement('div');
    valueDisplay.className = 'value';
    valueDisplay.textContent = `Opacity: ${(layerData.opacity * 100).toFixed(0)}%`;

    opacitySlider.addEventListener('input', () => {
      layerData.opacity = parseFloat(opacitySlider.value);
      layerData.layer.setEffects({ opacity: layerData.opacity });
      valueDisplay.textContent = `Opacity: ${(layerData.opacity * 100).toFixed(0)}%`;
    });

    item.innerHTML = `<h4>Layer ${index + 1}</h4>`;
    item.appendChild(document.createElement('label')).textContent = 'Opacity:';
    item.appendChild(opacitySlider);
    item.appendChild(valueDisplay);
    
    layerList.appendChild(item);
  });
}

// Update layer count display
function updateLayerCount() {
  layerCountDisplay.textContent = layers.length;
}

// Event listeners
addLayerBtn.addEventListener('click', addLayer);
removeLayerBtn.addEventListener('click', removeLayer);

// Initialize with one layer
addLayer();

console.log('Multiple Layers demo initialized');

