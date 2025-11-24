# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marzipano is a 360° media viewer for the modern web. It's a JavaScript library that uses WebGL to render panoramic images with support for multiple geometries (Cube, Equirect, Flat) and projection types.

**Key Technologies:**
- ES6 modules (ESM) with native import/export
- Vite for development and building
- Vitest for testing (Mocha-compatible API)
- WebGL for rendering
- JSDoc for documentation
- Hammer.js for touch gestures
- gl-matrix for 3D math

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
npm update                     # Update dependencies
```

### Development
```bash
npm run dev                    # Start Vite dev server with HMR (Hot Module Replacement)
npm run test:watch             # Run test suite in watch mode with Vitest
npm run test:ui                # Run tests with Vitest UI
```

### Testing
```bash
npm test                       # Run all tests with Vitest
npm run test:watch             # Run tests in watch mode
npm run test:ui                # Run tests with Vitest UI
npm run coverage               # Generate test coverage report
```

**Running Specific Tests:**
```bash
# Run a specific test file
npm test -- test/suite/TextureStore.js

# Run tests matching a pattern
npm test -- --grep "RenderLoop"

# Run tests in watch mode for specific file
npm run test:watch -- test/suite/Viewer.js
```

**Test Architecture:**
- Test files in `test/suite/` mirror source structure
- Tests use Vitest (Mocha-compatible API) + Chai + Sinon
- Tests run in jsdom environment by default
- Tests use ES6 modules (import/export)
- `test/wait.js` provides async test helpers
- **Important**: Prefer promises over `done()` callbacks in async tests

**Test Patterns:**
```javascript
// Preferred: Promise-based async tests
it('loads texture', async () => {
  await store.loadTexture(tile);
  assert.isTrue(store.query(tile).hasTexture);
});

// Avoid: done() callbacks (deprecated in Vitest)
it('loads texture', (done) => {
  store.on('textureLoad', () => done());
});
```

### Code Quality
```bash
npm run lint                   # Check code with ESLint
npm run lint:fix               # Auto-fix ESLint issues
npm run format                 # Format code with Prettier
npm run format:check           # Check formatting without changes
```

### Building & Release
```bash
npm run build                  # Build production bundle with Vite
npm run preview                # Preview production build
npm publish                    # Publish to npm registry
```

**Build Process:**
- Vite builds ES modules for modern browsers (ES + UMD formats)
- Production builds are optimized and minified
- TypeScript definitions generated from `.d.ts` files
- Output: `dist/marzipano.es.js` (ESM), `dist/marzipano.umd.js` (UMD)

## Core Architecture

### Conceptual Hierarchy

```
Viewer (top-level API)
  └─ Stage (WebGL rendering context)
  └─ Controls (user input handling)
  └─ RenderLoop (frame rendering cycle)
  └─ Scene (single panorama)
      └─ View (camera/projection, e.g., RectilinearView, FlatView)
      └─ Layer (visual layer)
          └─ Source (image loading, e.g., ImageUrlSource)
          └─ Geometry (3D shape, e.g., CubeGeometry, EquirectGeometry, FlatGeometry)
          └─ TextureStore (tile/texture management)
          └─ Effects (color/visual effects)
      └─ HotspotContainer (interactive elements)
```

### Key Components

**Viewer (`src/Viewer.js`)**
- High-level API entry point
- Manages scenes, stage, controls, and render loop
- Handles scene transitions and view changes
- Emits `sceneChange` and `viewChange` events

**Scene (`src/Scene.js`)**
- Stack of layers sharing same view and hotspot container
- Belongs to viewer
- Emits `viewChange` and `layerChange` events

**Layer (`src/Layer.js`)**
- Combination of Source + Geometry + View + TextureStore
- Rendered by Stage with Effects
- Emits `renderComplete` event with stability status

**TextureStore (`src/TextureStore.js`)**
- Manages texture/tile loading, caching, and eviction
- LRU cache strategy for memory management
- State machine: IDLE → START → MARK → END
- Coordinated by Stage during frame rendering

**Stage (`src/stages/Stage.js`, `src/stages/WebGl.js`)**
- WebGL rendering context management
- RendererRegistry for geometry-specific renderers
- Coordinates with TextureStore via `startFrame`/`markTile`/`endFrame`

**View (`src/views/Rectilinear.js`, `src/views/Flat.js`)**
- Camera projection and field-of-view
- View parameters (yaw, pitch, roll, fov)
- View frustum and tile visibility determination

**Geometry (`src/geometries/`)**
- Defines 3D shape (Cube, Equirect, Flat)
- Level-of-detail tile structure
- Tile coordinates and visibility testing

**Source (`src/sources/`)**
- Image loading strategy (ImageUrl, SingleAsset)
- Provides textures to TextureStore

**Controls (`src/controls/`)**
- User input handlers (Drag, Key, Scroll, Pinch, etc.)
- Controls class coordinates multiple control methods
- Dynamics for smooth parameter interpolation

**XR Support (`src/xr/`)**
- WebXR integration for immersive VR/AR experiences
- XRSession handles WebXR session lifecycle
- XRControls provides XR-specific input handling
- Dynamic import in Viewer for optional XR features

**Audio (`src/audio/`)**
- Spatial audio support with AudioAnchor
- AudioManager for centralized audio control
- Position-based audio for immersive experiences

**Transitions (`src/transitions/`)**
- Scene transition effects (crossfade, zoom morph)
- Smooth camera movements between scenes
- Customizable transition timing and easing

### Rendering Pipeline

The rendering pipeline coordinates TextureStore, Stage, and Renderers through a frame-based protocol:

1. **RenderLoop** triggers frame via `requestAnimationFrame`
2. **Stage.render()** called for each Layer in the Scene
3. Stage calls **TextureStore.startFrame()** → transitions to START state
4. Stage determines visible tiles using **View.selectLevel()** and **Geometry** visibility testing
5. Stage calls **TextureStore.markTile()** for each visible tile → transitions to MARK state
6. Stage calls **TextureStore.endFrame()** → transitions to END state → triggers async texture loading
7. TextureStore loads missing textures asynchronously via **Source**
8. **Renderer** (WebGlCube/Equirect/Flat) draws tiles with available textures using WebGL
9. **Effects** applied during rendering (brightness, contrast, color correction)
10. Layer emits **renderComplete** event with `{stable: true|false}` based on texture availability

**Critical Coordination:**
- TextureStore state machine ensures proper frame boundaries: IDLE → START → MARK → END → IDLE
- Stage must match `startFrame()` and `endFrame()` calls (tracking via `_frameCounter`)
- Visible tiles marked during MARK state are prioritized for loading
- LRU cache evicts non-visible textures when memory budget exceeded
- **GPU Memory Management**: Enforces memory budgets to prevent GPU OOM (default: 256MB)

### Module System

- Entry point: `src/index.js` exports public API via ES6 modules
- All source files use ES6 `import`/`export` syntax
- Package.json has `"type": "module"` for native ESM support
- **Dual Format Support**: ESM (`import`) and CommonJS (`require`)
- All dependencies exposed via `dependencies` export for client use

**Module Categories:**
- **Utilities** (`src/util/`): async, geometry math, DOM helpers, LODPolicy, PrefetchStrategy, Telemetry, RayPicker, Accessibility, HDR
- **Collections** (`src/collections/`): Map, Set, LruSet, LruMap, WorkQueue, WorkPool
- **Renderers** (`src/renderers/`): WebGlBase, WebGlCube, WebGlEquirect, WebGlFlat, WebGpuBase
- **Geometries** (`src/geometries/`): Cube, Equirect, Flat (with shared Level system)
- **Views** (`src/views/`): Rectilinear (perspective), Flat (orthographic)
- **Sources** (`src/sources/`): ImageUrl, SingleAsset, VideoSource, TileSourceAdapter (IIIF, DeepZoom, GoogleMaps)
- **Assets** (`src/assets/`): Static, Dynamic, VideoAsset
- **Controls** (`src/controls/`): Key, Drag, Qtvr, ScrollZoom, PinchZoom, Velocity, ElementPress, Controls (coordinator), Dynamics
- **Stages** (`src/stages/`): WebGl (production), WebGpu (experimental), RendererRegistry
- **XR** (`src/xr/`): XRSession, XRControls (WebXR integration)
- **Audio** (`src/audio/`): AudioAnchor, AudioManager
- **Transitions** (`src/transitions/`): crossfade, zoomMorph, orbitToTarget

## Code Patterns

### Event Emitters
Most core classes use `minimal-event-emitter` for events:
```javascript
import eventEmitter from 'minimal-event-emitter';
eventEmitter(Constructor);
// Then: instance.addEventListener(), instance.emit()
```

### Tile Coordinate System
Tiles identified by face (cube), level, x, y coordinates. Each geometry implements tile iteration and visibility testing.

### Memory Management
- TextureStore uses LRU eviction
- `clearOwnProperties()` utility for cleanup
- Explicit `destroy()` methods on major objects

### WebGL Context
- Single shared WebGL context per Stage
- Texture units managed by Stage
- Shaders in `src/shaders/` compiled at runtime

## Important Notes

- **Browser Support**: Modern browsers with WebGL support
- **Coordinate System**: Right-handed with Y-up
- **Async Operations**: Texture loading is async; `renderComplete` event signals stability
- **No CSS Framework**: Pure JavaScript, minimal DOM manipulation
- **Math Library**: Uses gl-matrix for matrix/vector operations
- **Touch Support**: Hammer.js for multi-touch gestures
- **WebXR Support**: Optional WebXR integration for VR/AR (dynamically imported)
- **WebGPU**: Experimental WebGPU stage available (incomplete implementation, not production-ready)
- **ES6 Modules**: Native ESM with dual CommonJS/ESM exports

## Key Architecture Insights

### TextureStore State Machine
The TextureStore enforces a strict state machine for frame-based rendering:
- **IDLE**: No active frame
- **START**: Between `startFrame()` and first `markTile()`
- **MARK**: Between first `markTile()` and first `endFrame()`
- **END**: Between first and last `endFrame()` (multiple layers)

**Critical Rule**: Stage must call `startFrame()` and `endFrame()` equal number of times. Violating this causes the state machine to break and rendering to fail.

### View and Geometry Interaction
Views (Rectilinear, Flat) determine:
- Camera projection (perspective vs orthographic)
- Visible frustum for tile culling
- Level-of-detail selection based on viewport

Geometries (Cube, Equirect, Flat) provide:
- Tile structure and coordinates
- Visibility testing for frustum culling
- Vertex/texture coordinate generation

The combination determines which tiles to load and render.

### Memory Management Strategy
- **LRU Cache**: Least-recently-used eviction for texture cache
- **GPU Budget**: Configurable memory limit (default 256MB) prevents GPU OOM
- **Visibility Priority**: Visible tiles marked during frame rendering are prioritized
- **Deferred Loading**: Non-critical tiles loaded in idle time
- **Prefetch Strategy**: Optional prefetching of neighboring tiles for smooth navigation

## Testing Notes

- Test files mirror source structure in `test/suite/`
- Use `describe()` and `it()` (Vitest/Mocha-compatible API)
- Tests use ES6 modules (`import`/`export`)
- Assertions with Chai's `assert` or `expect()`
- Stubs/spies with Sinon when needed
- Tests run in jsdom environment by default
- `test/wait.js` provides async test helpers
- Vitest configuration in `vitest.config.js`
- **Important**: 16 tests use deprecated `done()` callbacks - prefer promises for new tests
