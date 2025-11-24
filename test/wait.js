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
// This file provides utility functions for waiting until certain conditions
// are true by polling repeatedly. In a test, this is faster and more robust
// than waiting with setTimeout, as it avoids the need for a large timeout to
// prevent slower browsers from flaking out.

// until(fn) repeatedly calls cond until it returns a truthy value,
// and returns a promise that resolves when the condition is met.
function until(cond) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (cond()) {
        clearInterval(timer);
        resolve();
      }
    }, 10);
  });
}

// untilSpyCalled(spy1, ..., spyN) repeatedly polls the spies until every
// one has been called at least once, and returns a promise that resolves.
function untilSpyCalled(...spies) {
  function cond() {
    for (let i = 0; i < spies.length; i++) {
      if (!spies[i].called) {
        return false;
      }
    }
    return true;
  }
  return until(cond);
}

// waitForEvent(emitter, eventName) returns a promise that resolves with
// the event arguments when the specified event is emitted.
function waitForEvent(emitter, eventName) {
  return new Promise((resolve) => {
    emitter.addEventListener(eventName, function handler(...args) {
      resolve(args);
    });
  });
}

export default {
  until,
  untilSpyCalled,
  waitForEvent,
};
