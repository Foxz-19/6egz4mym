import assert from'node:assert/strict';
class Element{constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={setProperty:(key,value)=>this.style[key]=value};this.attributes={};this.className='';this.textContent=''}append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=nodes}setAttribute(key,value){this.attributes[key]=value}}
globalThis.document={createElement:tag=>new Element(tag)};
const{renderList,renderStrip,renderCount}=await import('../js/ui.js');
const target=new Element('div'),swatch={id:'one',label:'Navy Blazer',hex:'#273247'};
renderList(target,[]);assert.equal(target.children[0].className,'empty-state');
renderList(target,[swatch]);assert.equal(target.children[0].children[1].className,'swatch-info');assert.equal(target.children[0].children[1].children[0].textContent,'Navy Blazer');
renderStrip(target,[{...swatch,hex:'#8E8E8E'}]);assert.equal(target.children[0].style['--strip-ink'],'#000');
renderStrip(target,[swatch]);assert.equal(target.children[0].style['--strip-ink'],'#fff');
renderCount(target,1);assert.equal(target.textContent,'1 of 8 piece');console.log('ui tests passed');
