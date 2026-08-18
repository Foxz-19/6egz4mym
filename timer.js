/** @typedef {{totalSeconds:number, remainingSeconds:number, running:boolean}} TimerState */
/** @param {number} minutes @returns {TimerState} */
export function makeTimer(minutes) { return { totalSeconds: minutes * 60, remainingSeconds: minutes * 60, running: false }; }
/** @param {TimerState} state @returns {TimerState} */
export function tick(state) { return { ...state, remainingSeconds: Math.max(0, state.remainingSeconds - 1), running: state.remainingSeconds > 1 }; }
/** @param {number} seconds @returns {string} */
export function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
/** @param {TimerState} state @returns {number} */
export function elapsed(state) { return state.totalSeconds - state.remainingSeconds; }
