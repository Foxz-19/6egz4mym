/** @typedef {import('./types').Swatch} Swatch */
const KEY='huefold.palette.v1', MAX=8, HEX=/^#[0-9A-F]{6}$/i;
export const maxSwatches=MAX;
/** @returns {Storage|null} */
export function getStorage(){try{return localStorage}catch{return null}}
/** @param {unknown} value @returns {value is Swatch} */
export function isSwatch(value){const swatch=/** @type {any} */(value);return !!swatch&&typeof swatch==='object'&&typeof swatch.id==='string'&&typeof swatch.label==='string'&&typeof swatch.hex==='string'&&HEX.test(swatch.hex)}
/** @param {string} label @param {string} hex @param {number} count @returns {{ok:true,value:Swatch}|{ok:false,error:string}} */
export function validateSwatch(label,hex,count){const clean=label.trim().replace(/\s+/g,' ');if(count>=MAX)return{ok:false,error:'Your palette is full. Remove a piece before adding another.'};if(!clean)return{ok:false,error:'Give this color a piece label.'};if(clean.length>40)return{ok:false,error:'Labels can be up to 40 characters.'};if(!HEX.test(hex))return{ok:false,error:'Choose a valid six-digit color.'};return{ok:true,value:{id:crypto.randomUUID(),label:clean,hex:hex.toUpperCase()}}}
/** @param {Swatch[]} swatches @param {number} index @param {-1|1} direction */
export function reorder(swatches,index,direction){const target=index+direction;if(index<0||target<0||target>=swatches.length)return swatches;const copy=[...swatches];[copy[index],copy[target]]=[copy[target],copy[index]];return copy}
/** @param {Storage|null} storage @returns {import('./types').LoadResult} */
export function load(storage){if(!storage)return{swatches:[],message:'Browser storage is unavailable, so this palette cannot be restored.'};try{const raw=storage.getItem(KEY);if(!raw)return{swatches:[]};const parsed=JSON.parse(raw);if(!Array.isArray(parsed)||!parsed.every(isSwatch))throw Error('invalid');return{swatches:parsed.slice(0,MAX)}}catch{return{swatches:[],message:'Saved palette could not be read, so a fresh palette was started.'}}}
/** @param {Storage|null} storage @param {Swatch[]} swatches @returns {{ok:true}|{ok:false,message:string}} */
export function save(storage,swatches){if(!storage)return{ok:false,message:'Changes are visible for now, but this browser cannot save them.'};try{storage.setItem(KEY,JSON.stringify(swatches));return{ok:true}}catch{return{ok:false,message:'Changes are visible for now, but could not be saved in this browser.'}}}
