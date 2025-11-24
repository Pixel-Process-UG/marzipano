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
import wait from '../../wait.js';

import chain from '../../../src/util/chain.js';
import cancelize from '../../../src/util/cancelize.js';

var error = new Error('err');

var noop = function () {};

function twiceSync(x, done) {
  done(null, 2 * x);
}

function twiceAsync(x, done) {
  setTimeout(function () {
    done(null, 2 * x);
  }, 0);
  return noop;
}

function squareSync(x, done) {
  done(null, x * x);
  return noop;
}

function squareAsync(x, done) {
  setTimeout(function () {
    done(null, x * x);
  }, 0);
  return noop;
}

function succeed(done) {
  setTimeout(function () {
    done(null, 42);
  }, 0);
  return noop;
}

function fail(x, done) {
  setTimeout(function () {
    done(error);
  }, 0);
  return noop;
}

describe('chain', function () {
  it('zero', async function () {
    var fn = chain();
    var spy = sinon.spy();
    fn(1, 2, 3, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 1, 2, 3));
  });

  it('one async', async function () {
    var fn = chain(twiceAsync);
    var spy = sinon.spy();
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 4));
  });

  it('two async', async function () {
    var fn = chain(twiceAsync, squareAsync);
    var spy = sinon.spy();
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 16));
  });

  it('one sync', async function () {
    var fn = chain(twiceSync);
    var spy = sinon.spy();
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 4));
  });

  it('two sync', async function () {
    var fn = chain(twiceSync, squareSync);
    var spy = sinon.spy();
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 16));
  });

  it('one sync, one async', async function () {
    var fn = chain(twiceSync, squareAsync);
    var spy = sinon.spy();
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 16));
  });

  it('one async, one sync', async function () {
    var fn = chain(twiceAsync, squareSync);
    var spy = sinon.spy();
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(spy.calledWithExactly(null, 16));
  });

  it('error aborts chain', async function () {
    var spy = sinon.spy();
    var neverCalledSpy = sinon.spy(succeed);
    var fn = chain(fail, neverCalledSpy);
    fn(2, spy);
    await wait.untilSpyCalled(spy);
    assert.isTrue(neverCalledSpy.notCalled);
    assert.isTrue(spy.calledWithExactly(error));
  });

  it('cancel aborts chain', async function () {
    var spy = sinon.spy();
    var neverCalledSpy = sinon.spy(succeed);
    var fn = chain(cancelize(twiceAsync), neverCalledSpy);
    var cancel = fn(2, spy);
    cancel(error);
    await wait.untilSpyCalled(spy);
    assert.isTrue(neverCalledSpy.notCalled);
    assert.isTrue(spy.calledWithExactly(error));
  });
});
