# Migration Guide

This guide helps you migrate from older versions of Marzipano to the modernized version (1.0.0+).

## Overview of Changes

Marzipano has been modernized to use:
- **ES6 Modules (ESM)** instead of CommonJS
- **Modern JavaScript syntax** (ES6+ classes, arrow functions, template literals)
- **Updated dependencies** (bowser v2, modern dev tools)

## Breaking Changes

### Module System

**Before (CommonJS):**
```javascript
const Marzipano = require('marzipano');
const Viewer = Marzipano.Viewer;
```

**After (ES Modules):**
```javascript
import { Viewer, Scene, ImageUrlSource } from 'marzipano';
```

### Browser Detection (Bowser v2)

If you were using `Marzipano.dependencies.bowser` directly, note that Bowser v2 has a different API:

**Before (Bowser v1):**
```javascript
const bowser = Marzipano.dependencies.bowser;
if (bowser.chrome) {
  // Chrome-specific code
}
```

**After (Bowser v2):**
```javascript
import { parse } from 'bowser';
const browser = parse(navigator.userAgent);
if (browser.browser.name === 'Chrome') {
  // Chrome-specific code
}
```

### Class Instantiation

All classes now use ES6 class syntax. The API remains the same, but internal implementation has changed:

```javascript
// This still works the same way
const viewer = new Viewer(domElement, { stage: { generateMipmaps: true } });
```

## Migration Steps

### 1. Update Import Statements

If you're using ES modules:
```javascript
// Old
const Marzipano = require('marzipano');

// New
import * as Marzipano from 'marzipano';
// Or import specific classes
import { Viewer, Scene, ImageUrlSource, RectilinearView, CubeGeometry } from 'marzipano';
```

If you're using CommonJS (still supported):
```javascript
// This still works
const { Viewer, Scene } = require('marzipano');
```

### 2. Update Build Configuration

If you're using a bundler:

**Webpack:**
- Ensure Webpack 5+ is configured for ES modules
- No special configuration needed

**Vite:**
- Works out of the box with ES modules
- No configuration needed

**Other Bundlers:**
- Most modern bundlers (Webpack 5+, Rollup, esbuild) support ES modules out of the box
- Ensure your bundler is configured for ES module support

### 3. Update Test Files

If you have custom test files:
- Convert `require()` to `import` statements
- Update `suite()` to `describe()` if using Mocha
- Update `test()` to `it()` if needed

### 4. Check Browser Compatibility

Marzipano now requires:
- Modern browsers with ES6 module support
- WebGL support (unchanged)
- No changes to browser compatibility requirements

## Backward Compatibility

The public API remains unchanged. All existing code should work without modification, except for:
- Import/require statements (if switching to ES modules)
- Direct usage of `Marzipano.dependencies.bowser` (if used)

## Getting Help

If you encounter issues during migration:
1. Check the [issue tracker](https://github.com/google/marzipano/issues)
2. Visit the [discussion forum](https://groups.google.com/forum/#!forum/marzipano)
3. Review the [documentation](http://www.marzipano.net/docs.html)

## Version History

- **1.0.0+**: Modernized with ES6 modules, updated dependencies
- **0.10.1 and earlier**: CommonJS modules, older dependencies

