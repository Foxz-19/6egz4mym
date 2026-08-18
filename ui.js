/** @typedef {import('./types.d.ts').ShowerThought} ShowerThought */

/** @param {string} value @returns {string} */
function escapeText(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

/** @param {string} value @returns {string} */
function escapeAttribute(value) {
  return escapeText(value).replaceAll('"', '&quot;');
}

/** @param {string} date @returns {string} */
export function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(new Date(date));
}

/** @param {number} seconds @returns {string} */
export function formatCaptureTime(seconds) {
  if (seconds < 60) return 'at the very start';
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes} min${remainder ? ` ${remainder} sec` : ''} in`;
}

/** @param {ShowerThought} thought @returns {HTMLLIElement} */
export function createThoughtRow(thought) {
  const row = document.createElement('li');
  row.innerHTML = `<p>${escapeText(thought.text)}</p><footer><time datetime="${thought.createdAt}">${formatDate(thought.createdAt)}</time><span>Captured ${formatCaptureTime(thought.elapsedSeconds)}</span><button type="button" data-delete="${escapeAttribute(thought.id)}" aria-label="Delete thought: ${escapeAttribute(thought.text)}">Delete</button></footer>`;
  return row;
}
