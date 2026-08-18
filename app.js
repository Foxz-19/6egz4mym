import { elapsed, formatTime, makeTimer, tick } from './timer.js';
import { loadThoughts, saveThoughts } from './storage.js';
import { createThoughtRow } from './ui.js';

/** @typedef {import('./types.d.ts').ShowerThought} ShowerThought */
const $ = (id) => document.getElementById(id);
const els = {
  mins: $('minutes'), secs: $('seconds'), action: $('timerAction'), note: $('timerNote'),
  form: $('thoughtForm'), input: $('thought'), list: $('thoughtList'), empty: $('emptyState'),
  count: $('thoughtCount'), toast: $('toast'), deleteDialog: $('deleteDialog'),
  durationDialog: $('durationDialog'), status: $('captureStatus')
};
let timer = makeTimer(8);
let interval = 0;
let deletingId = '';
let pendingMinutes = 0;
let toastTimer = 0;
const loaded = loadThoughts();
let thoughts = loaded.thoughts;

/** @param {string} message */
function report(message) {
  els.status.textContent = message;
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.hidden = false;
  toastTimer = setTimeout(() => { els.toast.hidden = true; }, 5000);
}

function renderTimer() {
  const [minutes, seconds] = formatTime(timer.remainingSeconds).split(':');
  els.mins.textContent = minutes;
  els.secs.textContent = seconds;
  document.body.classList.toggle('last-minute', timer.running && timer.remainingSeconds <= 60);
  els.action.textContent = timer.running ? 'Pause the water' : timer.remainingSeconds ? 'Start the water →' : 'Start again →';
  els.note.textContent = timer.remainingSeconds === 0 ? 'Time is up. Towel off with your best idea.' : timer.running ? (timer.remainingSeconds <= 60 ? 'Last minute — catch it before it disappears.' : 'The water is running. Keep listening.') : 'Choose a length, then begin.';
}

function renderThoughts() {
  els.list.replaceChildren(...thoughts.map(createThoughtRow));
  els.empty.hidden = thoughts.length > 0;
  els.count.textContent = `${thoughts.length} thought${thoughts.length === 1 ? '' : 's'} kept`;
}

/** @param {ShowerThought[]} nextThoughts @returns {boolean} */
function commitThoughts(nextThoughts) {
  const result = saveThoughts(nextThoughts);
  if (!result.ok) { report(result.error); return false; }
  thoughts = nextThoughts;
  renderThoughts();
  return true;
}

function stopTimer() { clearInterval(interval); interval = 0; timer.running = false; }
function toggleTimer() {
  if (timer.remainingSeconds === 0) timer = makeTimer(timer.totalSeconds / 60);
  if (timer.running) stopTimer();
  else {
    timer.running = true;
    interval = setInterval(() => {
      timer = tick(timer);
      renderTimer();
      if (!timer.running) { stopTimer(); report('Shower complete — did a good one arrive?'); }
    }, 1000);
  }
  renderTimer();
}

/** @returns {string} */
function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `mist-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** @param {number} minutes */
function setDuration(minutes) {
  stopTimer();
  timer = makeTimer(minutes);
  document.querySelectorAll('[data-minutes]').forEach((button) => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.minutes) === minutes));
  });
  renderTimer();
}

function handleDurationClick(event) {
  const minutes = Number(event.currentTarget.dataset.minutes);
  if (!timer.running) { setDuration(minutes); return; }
  pendingMinutes = minutes;
  els.durationDialog.showModal();
}

function handleSubmit(event) {
  event.preventDefault();
  const text = els.input.value.trim();
  if (!text) { report('Write a thought before saving it.'); els.input.focus(); return; }
  /** @type {ShowerThought} */
  const thought = { id: createId(), text, createdAt: new Date().toISOString(), elapsedSeconds: elapsed(timer) };
  if (commitThoughts([thought, ...thoughts])) {
    els.input.value = '';
    report('Thought saved. Nice catch.');
  }
}

function handleDeleteClick(event) {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  deletingId = button.dataset.delete || '';
  els.deleteDialog.showModal();
}

function handleDeleteClose() {
  if (els.deleteDialog.returnValue === 'confirm' && deletingId) {
    if (commitThoughts(thoughts.filter((thought) => thought.id !== deletingId))) report('Thought removed.');
  }
  deletingId = '';
}

document.querySelectorAll('[data-minutes]').forEach((button) => button.addEventListener('click', handleDurationClick));
els.action.addEventListener('click', toggleTimer);
els.form.addEventListener('submit', handleSubmit);
els.list.addEventListener('click', handleDeleteClick);
els.deleteDialog.addEventListener('close', handleDeleteClose);
els.durationDialog.addEventListener('close', () => {
  if (els.durationDialog.returnValue === 'confirm' && pendingMinutes) setDuration(pendingMinutes);
  pendingMinutes = 0;
});
renderTimer();
renderThoughts();
if (loaded.error || loaded.warning) report(loaded.error || loaded.warning);
