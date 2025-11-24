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

// Animation state
let currentAnimation = null;

// Easing functions
const easingFunctions = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

// UI elements
const animateYawBtn = document.getElementById('animate-yaw-btn');
const animatePitchBtn = document.getElementById('animate-pitch-btn');
const animateFovBtn = document.getElementById('animate-fov-btn');
const animateOrbitBtn = document.getElementById('animate-orbit-btn');
const stopBtn = document.getElementById('stop-btn');
const durationInput = document.getElementById('duration');
const easingSelect = document.getElementById('easing');

// Stop current animation
function stopAnimation() {
  if (currentAnimation) {
    viewer.stopMovement();
    currentAnimation = null;
    updateButtons();
  }
}

// Update button states
function updateButtons() {
  const hasAnimation = currentAnimation !== null;
  [animateYawBtn, animatePitchBtn, animateFovBtn, animateOrbitBtn].forEach(btn => {
    btn.disabled = hasAnimation;
  });
  stopBtn.disabled = !hasAnimation;
}

// Animate parameter
function animateParameter(paramName, startValue, endValue) {
  stopAnimation();

  const duration = parseInt(durationInput.value);
  const easingName = easingSelect.value;
  const easing = easingFunctions[easingName];

  const startTime = Date.now();
  currentAnimation = true;
  updateButtons();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = startValue + (endValue - startValue) * easedProgress;

    if (paramName === 'yaw') {
      view.setYaw(currentValue);
    } else if (paramName === 'pitch') {
      view.setPitch(currentValue);
    } else if (paramName === 'fov') {
      view.setFov(currentValue);
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentAnimation = null;
      updateButtons();
    }
  };

  animate();
}

// Animate yaw rotation
animateYawBtn.addEventListener('click', () => {
  const currentYaw = view.yaw();
  animateParameter('yaw', currentYaw, currentYaw + Math.PI);
});

// Animate pitch
animatePitchBtn.addEventListener('click', () => {
  const currentPitch = view.pitch();
  animateParameter('pitch', currentPitch, Math.max(-Math.PI/2, Math.min(Math.PI/2, currentPitch + 0.5)));
});

// Animate FOV (zoom)
animateFovBtn.addEventListener('click', () => {
  const currentFov = view.fov();
  const targetFov = currentFov < Math.PI/3 ? Math.PI/2 : Math.PI/4;
  animateParameter('fov', currentFov, targetFov);
});

// Orbit animation using viewer's lookTo
animateOrbitBtn.addEventListener('click', () => {
  stopAnimation();
  currentAnimation = true;
  updateButtons();

  const duration = parseInt(durationInput.value);
  const currentYaw = view.yaw();
  const currentPitch = view.pitch();

  viewer.lookTo({
    yaw: currentYaw + Math.PI * 2,
    pitch: currentPitch
  }, {
    transitionDuration: duration
  }, () => {
    currentAnimation = null;
    updateButtons();
  });
});

// Stop button
stopBtn.addEventListener('click', stopAnimation);

// Initialize
updateButtons();

console.log('Animation Utilities demo initialized');

