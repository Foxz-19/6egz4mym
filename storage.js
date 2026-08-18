/** @typedef {import('./types.d.ts').ShowerThought} ShowerThought */
const KEY = 'mist-shower-thoughts-v1';
/** @param {ShowerThought[]} thoughts @returns {{ok:boolean,error?:string}} */
export function saveThoughts(thoughts) {
  try { localStorage.setItem(KEY, JSON.stringify({ version: 1, thoughts })); return { ok: true }; }
  catch { return { ok: false, error: 'Your browser could not save this change. Your thought is still on screen.' }; }
}
/** @returns {{thoughts:ShowerThought[],error?:string,warning?:string}} */
export function loadThoughts() {
  try {
    const raw = localStorage.getItem(KEY); if (!raw) return { thoughts: [] };
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !Array.isArray(data.thoughts)) throw new Error('Invalid archive');
    const thoughts = data.thoughts.filter(validThought);
    return thoughts.length === data.thoughts.length ? { thoughts } : { thoughts, warning: 'Some invalid saved thoughts were safely removed from your archive.' };
  } catch { return { thoughts: [], error: 'Your saved archive could not be read, so Mist started a fresh one.' }; }
}
/** @param {unknown} value @returns {value is ShowerThought} */
function validThought(value) {
  return !!value && typeof value === 'object' && typeof value.id === 'string' && typeof value.text === 'string' && value.text.length <= 400 && value.text.trim() !== '' && typeof value.createdAt === 'string' && !Number.isNaN(Date.parse(value.createdAt)) && typeof value.elapsedSeconds === 'number' && Number.isFinite(value.elapsedSeconds) && value.elapsedSeconds >= 0;
}
