import assert from 'node:assert/strict';
import { elapsed, formatTime, isLastMinute, makeTimer, remainingAt, tick } from './timer.js';
import { loadThoughts, saveThoughts } from './storage.js';

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value)
};

assert.equal(formatTime(65), '01:05');
assert.deepEqual(tick({ totalSeconds: 60, remainingSeconds: 1, running: true }), { totalSeconds: 60, remainingSeconds: 0, running: false });
assert.deepEqual(tick({ totalSeconds: 120, remainingSeconds: 61, running: true }), { totalSeconds: 120, remainingSeconds: 60, running: true });
assert.equal(remainingAt(6000, 5001), 1);
assert.equal(remainingAt(6000, 6000), 0);
assert.equal(isLastMinute(60), true);
assert.equal(isLastMinute(59), true);
assert.equal(isLastMinute(0), false);
assert.equal(elapsed(makeTimer(8)), 0);
memory.set('mist-shower-thoughts-v1', JSON.stringify({ version: 1, thoughts: [{ id: 'valid', text: 'Keep this', createdAt: '2026-01-01T00:00:00.000Z', elapsedSeconds: 1 }, { id: 'x'.repeat(101), text: 'Valid', createdAt: '2026-01-01T00:00:00.000Z', elapsedSeconds: 1 }] }));
assert.equal(loadThoughts().thoughts.length, 1);
assert.match(loadThoughts().warning, /invalid saved thoughts/);
globalThis.localStorage.setItem = () => { throw new Error('blocked'); };
assert.equal(saveThoughts([]).ok, false);
console.log('Timer unit tests passed');
