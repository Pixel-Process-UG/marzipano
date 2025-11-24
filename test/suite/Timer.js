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

import Timer from '../../src/Timer.js';
import now from '../../src/util/now.js';
import defer from '../../src/util/defer.js';
import wait from '../wait.js';

describe('Timer', function () {
  it('start', async function () {
    const spy = sinon.spy();
    const timer = new Timer({ duration: 50 });
    timer.addEventListener('timeout', spy);

    const timeBefore = now();
    assert.isFalse(timer.started());
    timer.start();
    assert.isTrue(timer.started());

    await wait.untilSpyCalled(spy);

    const timeAfter = now();
    assert.isFalse(timer.started());
    assert.isAtLeast(timeAfter - timeBefore, 50);
  });

  it('stop', function () {
    return new Promise((resolve) => {
      const spy = sinon.spy();
      const timer = new Timer({ duration: 10 });
      timer.addEventListener('timeout', spy);

      assert.isFalse(timer.started());
      timer.start();
      assert.isTrue(timer.started());
      timer.stop();
      assert.isFalse(timer.started());

      setTimeout(() => {
        assert.isTrue(spy.notCalled);
        resolve();
      }, 50);
    });
  });

  it('reset', async function () {
    const spy = sinon.spy();
    const timer = new Timer({ duration: 100 });
    timer.addEventListener('timeout', spy);

    const timeBefore = now();
    timer.start();

    setTimeout(() => {
      assert.isTrue(spy.notCalled);
      timer.start();
    }, 50);

    await wait.untilSpyCalled(spy);

    const timeAfter = now();
    assert.isFalse(timer.started());
    assert.isAtLeast(timeAfter - timeBefore, 150);
  });

  it('set duration after start with infinity', async function () {
    const spy = sinon.spy();
    const timer = new Timer();
    timer.addEventListener('timeout', spy);

    const timeBefore = now();
    timer.start();

    defer(() => {
      timer.setDuration(50);
    });

    await wait.untilSpyCalled(spy);

    const timeAfter = now();
    assert.isAtLeast(timeAfter - timeBefore, 50);
  });

  it('set duration when stopped', async function () {
    const spy = sinon.spy();
    const timer = new Timer({ duration: 50 });
    timer.addEventListener('timeout', spy);

    assert.strictEqual(timer.duration(), 50);
    timer.setDuration(100);
    assert.strictEqual(timer.duration(), 100);

    const timeBefore = now();
    timer.start();

    await wait.untilSpyCalled(spy);

    const timeAfter = now();
    assert.isAtLeast(timeAfter - timeBefore, 100);
  });

  it('increase duration when started', async function () {
    const spy = sinon.spy();
    const timer = new Timer({ duration: 50 });
    timer.addEventListener('timeout', spy);

    const timeBefore = now();
    timer.start();

    defer(() => {
      timer.setDuration(100);
    });

    await wait.untilSpyCalled(spy);

    const timeAfter = now();
    assert.isAtLeast(timeAfter - timeBefore, 100);
  });

  it('decrease duration when started', function () {
    return new Promise((resolve) => {
      const spy = sinon.spy();
      const timer = new Timer({ duration: 100 });
      timer.addEventListener('timeout', spy);

      timer.start();

      setTimeout(() => {
        assert.isTrue(spy.notCalled);
        timer.setDuration(10);
        assert.isTrue(spy.calledOnce);
        resolve();
      }, 50);
    });
  });
});
