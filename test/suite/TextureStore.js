/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { assert } from 'chai';
import sinon from 'sinon';

import eventEmitter from 'minimal-event-emitter';
import defer from '../../src/util/defer.js';
import cancelize from '../../src/util/cancelize.js';
import wait from '../wait.js';

import TextureStore from '../../src/TextureStore.js';

var nextId = 0;

// Mock tile.
// The id is propagated into the respective asset and texture.
// The dynamicAsset parameter determines whether the asset will be dynamic.
// The assetFailures and textureFailures parameters determine how many times
// in a row loading the respective asset or creating the respective texture
// will fail.
function MockTile(opts) {
  this.id = nextId++;
  this.dynamicAsset = opts && opts.dynamicAsset;
  this.assetFailures = (opts && opts.assetFailures) || 0;
  this.textureFailures = (opts && opts.textureFailures) || 0;
  this.hash = function () {
    return 0;
  };
  this.equals = function (that) {
    return this === that;
  };
}

// Mock asset.
function MockAsset(tile, dynamic) {
  this.id = tile.id;
  this.isDynamic = sinon.stub().returns(dynamic);
  this.destroy = sinon.spy();
}

eventEmitter(MockAsset);

// Mock texture.
function MockTexture(asset) {
  this.id = asset.id;
  this.refresh = sinon.spy();
  this.destroy = sinon.spy();
}

var loadAssetError = new Error('Asset error');
var createTextureError = new Error('Create texture');

// Mock a Source. For these tests we only need the loadAsset() method.
var mockSource = {
  loadAsset: cancelize(function (stage, tile, done) {
    if (tile.assetFailures) {
      // Fail
      tile.assetFailures--;
      defer(function () {
        done(loadAssetError, tile, asset);
      });
    } else {
      // Succeed
      var asset = new MockAsset(tile, tile.dynamicAsset);
      defer(function () {
        done(null, tile, asset);
      });
    }
  }),
};

// Mock a Stage. For these tests we only need the createTexture() method.
var mockStage = {
  createTexture: cancelize(function (tile, asset, done) {
    if (tile.textureFailures) {
      // Fail
      tile.textureFailures--;
      defer(function () {
        done(createTextureError, tile, asset);
      });
    } else {
      // Succeed
      var texture = new MockTexture(asset);
      defer(function () {
        done(null, tile, asset, texture);
      });
    }
  }),
};

function makeTextureStore(opts) {
  return new TextureStore(mockSource, mockStage, opts);
}

describe('TextureStore', function () {
  describe('visibility', function () {
    it('mark tile as visible', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      assert.isFalse(store.query(tile).visible);
      store.startFrame();
      store.markTile(tile);
      store.endFrame();
      assert.isTrue(store.query(tile).visible);
    });

    it('mark tile as not visible', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      assert.isFalse(store.query(tile).visible);
      store.startFrame();
      store.markTile(tile);
      store.endFrame();
      store.startFrame();
      store.endFrame();
      assert.isFalse(store.query(tile).visible);
    });
  });

  describe('state machine', function () {
    it('nested frames', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      assert.isFalse(store.query(tile).visible);
      store.startFrame();
      store.startFrame();
      store.markTile(tile);
      store.endFrame();
      assert.isFalse(store.query(tile).visible);
      store.endFrame();
      assert.isTrue(store.query(tile).visible);
    });

    it('start frame out of order', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      store.startFrame();
      store.markTile(tile);
      assert.throws(function () {
        store.startFrame();
      });
      store.endFrame();
      store.startFrame();
      store.startFrame();
      store.endFrame();
      assert.throws(function () {
        store.startFrame();
      });
    });

    it('mark tile out of order', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      assert.throws(function () {
        store.markTile(tile);
      });
      store.startFrame();
      store.startFrame();
      store.endFrame();
      assert.throws(function () {
        store.markTile(tile);
      });
      store.endFrame();
      assert.throws(function () {
        store.markTile(tile);
      });
    });

    it('end frame out of order', function () {
      var store = makeTextureStore();
      assert.throws(function () {
        store.endFrame();
      });
      store.startFrame();
      store.endFrame();
      assert.throws(function () {
        store.endFrame();
      });
    });
  });

  describe('textures', function () {
    it('load texture for static asset', async function () {
      var store = makeTextureStore();
      var tile = new MockTile();

      const startLoadPromise = wait.waitForEvent(store, 'textureStartLoad');
      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      const [eventTile] = await startLoadPromise;
      assert.strictEqual(eventTile, tile);
      assert.strictEqual(store.texture(tile), null);
      assert.isFalse(store.query(tile).hasAsset);
      assert.isFalse(store.query(tile).hasTexture);

      const [loadedTile] = await loadPromise;
      var texture = store.texture(tile);
      assert.strictEqual(loadedTile, tile);
      assert.isNotNull(texture);
      assert.strictEqual(texture.id, tile.id);
      assert.isFalse(store.query(tile).hasAsset);
      assert.isTrue(store.query(tile).hasTexture);
    });

    it('load texture for dynamic asset', async function () {
      var store = makeTextureStore();
      var tile = new MockTile({ dynamicAsset: true });

      const startLoadPromise = wait.waitForEvent(store, 'textureStartLoad');
      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      const [eventTile] = await startLoadPromise;
      assert.strictEqual(eventTile, tile);
      assert.strictEqual(store.texture(tile), null);
      assert.isFalse(store.query(tile).hasAsset);
      assert.isFalse(store.query(tile).hasTexture);

      const [loadedTile] = await loadPromise;
      var texture = store.texture(tile);
      assert.strictEqual(loadedTile, tile);
      assert.isNotNull(texture);
      assert.strictEqual(texture.id, tile.id);
      assert.isTrue(store.query(tile).hasAsset);
      assert.isTrue(store.query(tile).hasTexture);
    });

    it('retry on loadAsset failure', async function () {
      var store = makeTextureStore();
      var tile = new MockTile({ assetFailures: 1 }); // will succeed when retried

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      const [eventTile] = await loadPromise;
      var texture = store.texture(tile);
      assert.strictEqual(eventTile, tile);
      assert.isNotNull(texture);
      assert.strictEqual(texture.id, tile.id);
      assert.isFalse(store.query(tile).hasAsset);
      assert.isTrue(store.query(tile).hasTexture);
    });

    it('error on createTexture failure', async function () {
      var store = makeTextureStore();
      var tile = new MockTile({ textureFailures: 1 });

      const errorPromise = wait.waitForEvent(store, 'textureError');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      const [eventTile] = await errorPromise;
      assert.strictEqual(eventTile, tile);
      assert.isFalse(store.query(tile).hasAsset);
      assert.isFalse(store.query(tile).hasTexture);
    });

    it('cancel load', function () {
      return new Promise((resolve) => {
        var store = makeTextureStore();
        var tile = new MockTile();
        store.addEventListener('textureCancel', function (eventTile) {
          assert.strictEqual(eventTile, tile);
          assert.isFalse(store.query(tile).hasAsset);
          assert.isFalse(store.query(tile).hasTexture);
          resolve();
        });
        store.startFrame();
        store.markTile(tile);
        store.endFrame();
        store.startFrame();
        store.endFrame();
      });
    });

    it('unload texture', async function () {
      var store = makeTextureStore({
        previouslyVisibleCacheSize: 0,
      });
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      const unloadPromise = wait.waitForEvent(store, 'textureUnload');

      store.startFrame();
      store.endFrame();

      const [eventTile] = await unloadPromise;
      assert.strictEqual(eventTile, tile);
      assert.isFalse(store.query(tile).hasAsset);
      assert.isFalse(store.query(tile).hasTexture);
    });

    it('return asset for a tile', async function () {
      var store = makeTextureStore();
      var tile = new MockTile({ dynamicAsset: true });

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      var asset = store.asset(tile);
      assert.instanceOf(asset, MockAsset);
      assert.strictEqual(asset.id, tile.id);
    });

    it('return texture for a tile', async function () {
      var store = makeTextureStore();
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      var texture = store.texture(tile);
      assert.instanceOf(texture, MockTexture);
      assert.strictEqual(texture.id, tile.id);
    });

    it('refresh texture for dynamic assets', async function () {
      var store = makeTextureStore();
      var tile = new MockTile({ dynamicAsset: true });

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      store.startFrame();
      store.markTile(tile);
      store.endFrame();
      var asset = store.asset(tile);
      var texture = store.texture(tile);
      assert.isTrue(texture.refresh.calledWithExactly(tile, asset));
    });

    it('do not refresh texture for static assets', async function () {
      var store = makeTextureStore();
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      store.startFrame();
      store.markTile(tile);
      store.endFrame();
      var texture = store.texture(tile);
      assert.isTrue(texture.refresh.notCalled);
    });

    it('notify on texture invalidation by dynamic asset', async function () {
      var store = makeTextureStore();
      var tile = new MockTile({ dynamicAsset: true });
      var invalidSpy = sinon.spy();
      store.addEventListener('textureInvalid', invalidSpy);

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      const invalidPromise = wait.waitForEvent(store, 'textureInvalid');

      var asset = store.asset(tile);
      asset.emit('change');

      const [eventTile] = await invalidPromise;
      assert.strictEqual(eventTile, tile);
    });
  });

  describe('LRU', function () {
    it('previously visible tile without a texture is not kept', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      store.startFrame();
      store.markTile(tile);
      store.endFrame();
      store.startFrame();
      store.endFrame();
      assert.isFalse(store.query(tile).previouslyVisible);
    });

    it('previously visible tile with a texture is kept', async function () {
      var store = makeTextureStore({
        previouslyVisibleCacheSize: 1,
      });
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.startFrame();
      store.markTile(tile);
      store.endFrame();

      await loadPromise;

      store.startFrame();
      store.endFrame();
      assert.isTrue(store.query(tile).previouslyVisible);
    });

    it('older tile is displaced by newer tile', async function () {
      var store = makeTextureStore({
        previouslyVisibleCacheSize: 1,
      });
      var tiles = [new MockTile(), new MockTile(), new MockTile()];

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const loadPromise = wait.waitForEvent(store, 'textureLoad');

        store.startFrame();
        store.markTile(tile);
        store.endFrame();

        await loadPromise;
      }

      assert.isFalse(store.query(tiles[0]).previouslyVisible);
      assert.isTrue(store.query(tiles[1]).previouslyVisible);
    });
  });

  describe('pinning', function () {
    it('pinning is reference-counted', function () {
      var store = makeTextureStore();
      var tile = new MockTile();
      var i, state;
      for (i = 1; i <= 3; i++) {
        store.pin(tile);
        state = store.query(tile);
        assert.isTrue(state.pinned);
        assert.strictEqual(state.pinCount, i);
      }
      for (i = 2; i >= 0; i--) {
        store.unpin(tile);
        state = store.query(tile);
        if (i > 0) {
          assert.isTrue(state.pinned);
        } else {
          assert.isFalse(state.pinned);
        }
        assert.strictEqual(state.pinCount, i);
      }
    });

    it('pinning tile causes load', async function () {
      var store = makeTextureStore();
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.pin(tile);

      const [eventTile] = await loadPromise;
      assert.strictEqual(eventTile, tile);
      assert.isTrue(store.query(tile).pinned);
    });

    it('unpinning tile causes unload', async function () {
      var store = makeTextureStore();
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.pin(tile);

      await loadPromise;

      const unloadPromise = wait.waitForEvent(store, 'textureUnload');

      store.unpin(tile);

      const [eventTile] = await unloadPromise;
      assert.strictEqual(eventTile, tile);
      assert.isFalse(store.query(tile).pinned);
    });

    it('pinned tile is not evicted when it becomes invisible', async function () {
      var store = makeTextureStore({
        previouslyVisibleCacheSize: 0,
      });
      var tile = new MockTile();

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.pin(tile);

      await loadPromise;

      store.startFrame();
      store.endFrame();
      assert.isTrue(store.query(tile).hasTexture);
    });

    it('unpinned tile is evicted when it becomes invisible', async function () {
      var store = makeTextureStore({
        previouslyVisibleCacheSize: 0,
      });
      var tile = new MockTile();
      var unloadSpy = sinon.spy();
      store.addEventListener('textureUnload', unloadSpy);

      const loadPromise = wait.waitForEvent(store, 'textureLoad');

      store.pin(tile);

      await loadPromise;

      store.unpin(tile);
      store.startFrame();
      store.endFrame();
      assert.isFalse(store.query(tile).hasTexture);
    });
  });
});
