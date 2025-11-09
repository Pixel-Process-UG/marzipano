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

import RectilinearView from '../../../src/views/Rectilinear.js';
import CubeGeometry from '../../../src/geometries/Cube.js';
import { mat4 } from 'gl-matrix';
import convertFov from '../../../src/util/convertFov.js';
const htov = convertFov.htov;
import pixelRatio from '../../../src/util/pixelRatio.js';

describe('RectilinearView', function () {
  describe('constructor', function () {
    it('sets default parameters', function () {
      var view = new RectilinearView();
      assert.strictEqual(view.yaw(), 0.0);
      assert.strictEqual(view.pitch(), 0.0);
      assert.strictEqual(view.fov(), Math.PI / 4);
    });
  });

  describe('getters/setters', function () {
    it('yaw', function () {
      var view = new RectilinearView();
      view.setYaw(1.234);
      assert.strictEqual(view.yaw(), 1.234);
    });

    it('pitch', function () {
      var view = new RectilinearView();
      view.setPitch(1.234);
      assert.strictEqual(view.pitch(), 1.234);
    });

    it('fov', function () {
      var view = new RectilinearView();
      view.setFov(1.234);
      assert.strictEqual(view.fov(), 1.234);
    });

    it('size', function () {
      var view = new RectilinearView();
      view.setSize({ width: 123, height: 456 });
      var obj = {};
      var retObj = view.size(obj);
      assert.strictEqual(obj.width, 123);
      assert.strictEqual(obj.height, 456);
      assert.isNotNull(retObj);
      assert.strictEqual(retObj.width, 123);
      assert.strictEqual(retObj.height, 456);
    });
  });

  describe('parameter normalization', function () {
    it('yaw', function () {
      var view = new RectilinearView();
      view.setYaw(Math.PI + 0.01);
      assert.strictEqual(view.yaw(), -Math.PI + 0.01);
      view.setYaw(-Math.PI - 0.01);
      assert.strictEqual(view.yaw(), Math.PI - 0.01);
    });

    it('pitch', function () {
      var view = new RectilinearView();
      view.setPitch(Math.PI + 0.01);
      assert.strictEqual(view.pitch(), -Math.PI + 0.01);
      view.setPitch(-Math.PI - 0.01);
      assert.strictEqual(view.pitch(), Math.PI - 0.01);
    });
  });

  describe('view limiting', function () {
    it('yaw', function () {
      var view = new RectilinearView(
        { width: 100, height: 100 },
        RectilinearView.limit.yaw(-Math.PI / 2, Math.PI / 2)
      );
      view.setYaw(-Math.PI / 2 - 0.1);
      assert.closeTo(view.yaw(), -Math.PI / 2, 0.000001);
      view.setYaw(Math.PI / 2 + 0.1);
      assert.closeTo(view.yaw(), Math.PI / 2, 0.000001);
    });

    it('pitch', function () {
      var view = new RectilinearView(
        { width: 100, height: 100 },
        RectilinearView.limit.pitch(-Math.PI / 2, Math.PI / 2)
      );
      view.setPitch(-Math.PI / 2 - 0.1);
      assert.strictEqual(view.pitch(), -Math.PI / 2);
      view.setPitch(Math.PI / 2 + 0.1);
      assert.strictEqual(view.pitch(), Math.PI / 2);
    });

    it('hfov', function () {
      var hmin = Math.PI / 16,
        hmax = Math.PI / 4;
      var vmin = htov(hmin, 200, 100),
        vmax = htov(hmax, 200, 100);
      var view = new RectilinearView(
        { width: 200, height: 100 },
        RectilinearView.limit.hfov(hmin, hmax)
      );
      view.setFov(vmin - 0.1);
      assert.strictEqual(view.fov(), vmin);
      view.setFov(vmax + 0.1);
      assert.strictEqual(view.fov(), vmax);
    });

    it('vfov', function () {
      var vmin = Math.PI / 16,
        vmax = Math.PI / 4;
      var view = new RectilinearView(
        { width: 100, height: 100 },
        RectilinearView.limit.vfov(vmin, vmax)
      );
      view.setFov(vmin - 0.1);
      assert.strictEqual(view.fov(), vmin);
      view.setFov(vmax + 0.1);
      assert.strictEqual(view.fov(), vmax);
    });

    it('resolution', function () {
      var view = new RectilinearView(
        { width: 512, height: 512 },
        RectilinearView.limit.resolution(2048)
      );
      var minFov = 2 * Math.atan((pixelRatio() * 512) / 2048);
      view.setFov(minFov - 0.1);
      assert.strictEqual(view.fov(), minFov);
    });

    it('enforced on initial parameters', function () {
      var view = new RectilinearView(
        { width: 100, height: 100, yaw: 0, pitch: 0, fov: Math.PI / 16 },
        RectilinearView.limit.vfov(Math.PI / 8, Math.PI / 4)
      );
      assert.strictEqual(view.fov(), Math.PI / 8);
    });

    it('replace existing limiter', function () {
      var view = new RectilinearView(
        { width: 100, height: 100, yaw: 0, pitch: 0, fov: Math.PI / 16 },
        RectilinearView.limit.vfov(Math.PI / 8, Math.PI / 4)
      );
      view.setLimiter(RectilinearView.limit.vfov(Math.PI / 6, Math.PI / 4));
      assert.strictEqual(view.fov(), Math.PI / 6);
    });
  });

  describe('projection', function () {
    var newProj,
      oldProj = mat4.create();

    var view = new RectilinearView({ width: 100, height: 100 });

    it('compute initial', function () {
      newProj = view.projection();
      assert.notDeepEqual(newProj, oldProj);
      mat4.copy(oldProj, newProj);
    });

    it('update on yaw change', function () {
      view.setYaw(Math.PI / 3);
      newProj = view.projection();
      assert.notDeepEqual(newProj, oldProj);
      mat4.copy(oldProj, newProj);
    });

    it('update on pitch change', function () {
      view.setPitch(Math.PI / 3);
      newProj = view.projection();
      assert.notDeepEqual(newProj, oldProj);
      mat4.copy(oldProj, newProj);
    });

    it('update on fov change', function () {
      view.setFov(Math.PI / 3);
      newProj = view.projection();
      assert.notDeepEqual(newProj, oldProj);
      mat4.copy(oldProj, newProj);
    });

    it('update on viewport change', function () {
      view.setSize({ width: 100, height: 150 });
      newProj = view.projection();
      assert.notDeepEqual(newProj, oldProj);
      mat4.copy(oldProj, newProj);
    });
  });

  describe('selectLevel', function () {
    it('returns level', function () {
      var geometry = new CubeGeometry(
        [512, 1024, 2048].map(function (size) {
          return { size: size, tileSize: 512 };
        })
      );
      var view = new RectilinearView({ width: 512, height: 512 });
      var lvl = view.selectLevel(geometry.levelList);
      assert.include(geometry.levelList, lvl);
    });
  });

  describe('intersects', function () {
    describe('square viewport', function () {
      var view = new RectilinearView({
        width: 100,
        height: 100,
        yaw: 0,
        pitch: 0,
        fov: Math.PI / 8,
      });

      it('fully visible', function () {
        var rect = [
          [-0.5, 0.5, -0.5],
          [0.5, 0.5, -0.5],
          [0.5, -0.5, -0.5],
          [-0.5, -0.5, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to top right', function () {
        var rect = [
          [0, 0, -0.5],
          [0, 2, -0.5],
          [2, 2, -0.5],
          [2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to bottom right', function () {
        var rect = [
          [0, 0, -0.5],
          [0, -2, -0.5],
          [2, -2, -0.5],
          [2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to bottom left', function () {
        var rect = [
          [0, 0, -0.5],
          [0, -2, -0.5],
          [-2, -2, -0.5],
          [-2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to top left', function () {
        var rect = [
          [0, 0, -0.5],
          [0, 2, -0.5],
          [-2, 2, -0.5],
          [-2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible and larger than viewport', function () {
        var rect = [
          [-2, 2, -0.5],
          [2, 2, -0.5],
          [2, -2, -0.5],
          [-2, -2, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('invisible above viewport', function () {
        var rect = [
          [-0.5, 1.5, -0.5],
          [0.5, 1.5, -0.5],
          [0.5, 1, -0.5],
          [-0.5, 1, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible below viewport', function () {
        var rect = [
          [-0.5, -1.5, -0.5],
          [0.5, -1.5, -0.5],
          [0.5, -1, -0.5],
          [-0.5, -1, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible to the left of viewport', function () {
        var rect = [
          [-1.5, 0.5, -0.5],
          [-1, 0.5, -0.5],
          [-1, -0.5, -0.5],
          [-1.5, -0.5, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible to the right of viewport', function () {
        var rect = [
          [1.5, 0.5, -0.5],
          [1, 0.5, -0.5],
          [1, -0.5, -0.5],
          [1.5, -0.5, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('behind camera', function () {
        var rect = [
          [-0.5, 0.5, 0.5],
          [0.5, 0.5, 0.5],
          [0.5, -0.5, 0.5],
          [-0.5, -0.5, 0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('partially behind camera', function () {
        var rect = [
          [0, -0.5, 0.5],
          [0, 0.5, 0.5],
          [0, -0.5, -0.5],
          [0, 0.5, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });
    });

    describe('wide viewport', function () {
      var view = new RectilinearView({
        width: 200,
        height: 100,
        yaw: 0,
        pitch: 0,
        fov: Math.PI / 4,
      });

      it('fully visible', function () {
        var rect = [
          [-0.5, 0.5, -0.5],
          [0.5, 0.5, -0.5],
          [0.5, -0.5, -0.5],
          [-0.5, -0.5, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to top right', function () {
        var rect = [
          [0, 0, -0.5],
          [0, 2, -0.5],
          [2, 2, -0.5],
          [2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to bottom right', function () {
        var rect = [
          [0, 0, -0.5],
          [0, -2, -0.5],
          [2, -2, -0.5],
          [2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to bottom left', function () {
        var rect = [
          [0, 0, -0.5],
          [0, -2, -0.5],
          [-2, -2, -0.5],
          [-2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to top left', function () {
        var rect = [
          [0, 0, -0.5],
          [0, 2, -0.5],
          [-2, 2, -0.5],
          [-2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible and larger than viewport', function () {
        var rect = [
          [-2, 2, -0.5],
          [2, 2, -0.5],
          [2, -2, -0.5],
          [-2, -2, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('invisible above viewport', function () {
        var rect = [
          [-0.5, 1.5, -0.5],
          [0.5, 1.5, -0.5],
          [0.5, 1, -0.5],
          [-0.5, 1, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible below viewport', function () {
        var rect = [
          [-0.5, -1.5, -0.5],
          [0.5, -1.5, -0.5],
          [0.5, -1, -0.5],
          [-0.5, -1, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible to the left of viewport', function () {
        var rect = [
          [-1.5, 0.5, -0.5],
          [-1, 0.5, -0.5],
          [-1, -0.5, -0.5],
          [-1.5, -0.5, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible to the right of viewport', function () {
        var rect = [
          [1.5, 0.5, -0.5],
          [1, 0.5, -0.5],
          [1, -0.5, -0.5],
          [1.5, -0.5, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('behind camera', function () {
        var rect = [
          [-0.5, 0.5, 0.5],
          [0.5, 0.5, 0.5],
          [0.5, -0.5, 0.5],
          [-0.5, -0.5, 0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('partially behind camera', function () {
        var rect = [
          [0, -0.5, 0.5],
          [0, 0.5, 0.5],
          [0, -0.5, -0.5],
          [0, 0.5, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });
    });

    describe('narrow viewport', function () {
      var view = new RectilinearView({
        width: 100,
        height: 200,
        yaw: 0,
        pitch: 0,
        fov: Math.PI / 8,
      });

      it('fully visible', function () {
        var rect = [
          [-0.5, 0.5, -0.5],
          [0.5, 0.5, -0.5],
          [0.5, -0.5, -0.5],
          [-0.5, -0.5, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to top right', function () {
        var rect = [
          [0, 0, -0.5],
          [0, 2, -0.5],
          [2, 2, -0.5],
          [2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to bottom right', function () {
        var rect = [
          [0, 0, -0.5],
          [0, -2, -0.5],
          [2, -2, -0.5],
          [2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to bottom left', function () {
        var rect = [
          [0, 0, -0.5],
          [0, -2, -0.5],
          [-2, -2, -0.5],
          [-2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible extending to top left', function () {
        var rect = [
          [0, 0, -0.5],
          [0, 2, -0.5],
          [-2, 2, -0.5],
          [-2, 0, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('partially visible and larger than viewport', function () {
        var rect = [
          [-2, 2, -0.5],
          [2, 2, -0.5],
          [2, -2, -0.5],
          [-2, -2, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });

      it('invisible above viewport', function () {
        var rect = [
          [-0.5, 1.5, -0.5],
          [0.5, 1.5, -0.5],
          [0.5, 1, -0.5],
          [-0.5, 1, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible below viewport', function () {
        var rect = [
          [-0.5, -1.5, -0.5],
          [0.5, -1.5, -0.5],
          [0.5, -1, -0.5],
          [-0.5, -1, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible to the left of viewport', function () {
        var rect = [
          [-1.5, 0.5, -0.5],
          [-1, 0.5, -0.5],
          [-1, -0.5, -0.5],
          [-1.5, -0.5, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('invisible to the right of viewport', function () {
        var rect = [
          [1.5, 0.5, -0.5],
          [1, 0.5, -0.5],
          [1, -0.5, -0.5],
          [1.5, -0.5, -0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('behind camera', function () {
        var rect = [
          [-0.5, 0.5, 0.5],
          [0.5, 0.5, 0.5],
          [0.5, -0.5, 0.5],
          [-0.5, -0.5, 0.5],
        ];
        assert.isFalse(view.intersects(rect));
      });

      it('partially behind camera', function () {
        var rect = [
          [0, -0.5, 0.5],
          [0, 0.5, 0.5],
          [0, -0.5, -0.5],
          [0, 0.5, -0.5],
        ];
        assert.isTrue(view.intersects(rect));
      });
    });
  });

  describe('coordinatesToScreen', function () {
    describe('in general', function () {
      it('writes to result argument', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var result = {};
        var ret = view.coordinatesToScreen({ yaw: 0, pitch: 0 }, result);
        assert.strictEqual(ret, result);
      });
    });

    describe('view looking ahead', function () {
      it('center', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: 0, pitch: 0 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 50, 0.001);
        assert.closeTo(coords.y, 50, 0.001);
      });

      it('top left', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: -Math.PI / 16, pitch: -Math.PI / 16 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 0, 1.0);
        assert.closeTo(coords.y, 0, 1.0);
      });

      it('bottom right', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: Math.PI / 16, pitch: Math.PI / 16 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 100, 1.0);
        assert.closeTo(coords.y, 100, 1.0);
      });

      it('offscreen', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: Math.PI / 16 + 0.05, pitch: 0 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 113.2, 0.5);
        assert.closeTo(coords.y, 50, 0.5);
      });

      it('behind camera', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = {};
        var ret = view.coordinatesToScreen({ yaw: Math.PI, pitch: 0 }, coords);
        assert.isNull(ret);
        assert.isNull(coords.x);
        assert.isNull(coords.y);
      });
    });

    describe('view looking behind', function () {
      it('center', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: Math.PI, pitch: 0 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 50, 0.001);
        assert.closeTo(coords.y, 50, 0.001);
      });

      it('top left', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: (15 * Math.PI) / 16, pitch: -Math.PI / 16 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 0, 1.0);
        assert.closeTo(coords.y, 0, 1.0);
      });

      it('bottom right', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: (-15 * Math.PI) / 16, pitch: Math.PI / 16 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 100, 1.0);
        assert.closeTo(coords.y, 100, 1.0);
      });

      it('offscreen', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.coordinatesToScreen({ yaw: (-15 * Math.PI) / 16 + 0.05, pitch: 0 });
        assert.isNotNull(coords);
        assert.closeTo(coords.x, 113.2, 0.01);
        assert.closeTo(coords.y, 50, 0.01);
      });

      it('behind camera', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = {};
        var ret = view.coordinatesToScreen({ yaw: 0, pitch: 0 }, coords);
        assert.isNull(ret);
        assert.isNull(coords.x);
        assert.isNull(coords.y);
      });
    });
  });

  describe('screenToCoordinates', function () {
    describe('in general', function () {
      it('writes to result argument', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var result = {};
        var ret = view.screenToCoordinates({ x: 50, y: 50 }, result);
        assert.strictEqual(ret, result);
      });
    });

    describe('view looking ahead', function () {
      it('center', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 50, y: 50 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, 0, 0.001);
        assert.closeTo(coords.pitch, 0, 0.001);
      });

      it('top left', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 0, y: 0 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, -Math.PI / 16, 0.001);
        assert.closeTo(coords.pitch, -Math.PI / 16, 0.1);
      });

      it('bottom right', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 100, y: 100 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, Math.PI / 16, 0.001);
        assert.closeTo(coords.pitch, Math.PI / 16, 0.1);
      });

      it('offscreen', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: 0,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 200, y: 200 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, 0.538, 0.01);
        assert.closeTo(coords.pitch, 0.473, 0.01);
      });
    });

    describe('view looking behind', function () {
      it('center', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 50, y: 50 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, Math.PI, 0.001);
        assert.closeTo(coords.pitch, 0, 0.001);
      });

      it('top left', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 0, y: 0 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, (15 * Math.PI) / 16, 0.001);
        assert.closeTo(coords.pitch, -Math.PI / 16, 0.1);
      });

      it('bottom right', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 100, y: 100 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, (-15 * Math.PI) / 16, 0.001);
        assert.closeTo(coords.pitch, Math.PI / 16, 0.1);
      });

      it('offscreen', function () {
        var view = new RectilinearView({
          width: 100,
          height: 100,
          yaw: Math.PI,
          pitch: 0,
          fov: Math.PI / 8,
        });
        var coords = view.screenToCoordinates({ x: 200, y: 200 });
        assert.isNotNull(coords);
        assert.closeTo(coords.yaw, -2.603, 0.001);
        assert.closeTo(coords.pitch, 0.473, 0.001);
      });
    });
  });
});
