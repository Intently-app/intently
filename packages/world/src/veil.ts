/**
 * The arrival veil: the first thing in an app site's <head>, before analytics, so the page's first
 * paint is already the colour the hub's dive ended on, and the fragment is gone from the URL before
 * anything (gtag included) reads it.
 *
 * The script accepts only this site's own app, a known chapter and a known tier. With reduced motion
 * it strips the fragment and does nothing else. It sets html.arriving (the veil: a fixed layer in the
 * app's colour, so nothing shifts), data-arrival="<tier>", window.__intentlyArrival, and remembers the
 * chapter for the site's links back to Intently. The arrival world removes the veil as it takes over
 * (arrival.ts); if nothing does, the CSS parting starts after ARRIVAL_WAIT and a failsafe clears
 * everything FAILSAFE ms after the page becomes visible, prerendered or not.
 */
import { CHAPTER_IDS, TIERS } from './handoff.ts';
import { ARRIVAL_WAIT, FAILSAFE } from './timing.ts';

export const ARRIVAL_CHAPTER_KEY = 'intently:chapter';

export function veilScript(appId: string): string {
	if (!/^[a-z]+$/.test(appId)) throw new Error(`bad app id: ${appId}`);
	return `(function(){try{
var h=location.hash;if(h.length>64)return;
var m=/^#intently=v1\\.([a-z]+)\\.([a-z]+)\\.([a-z]+)$/.exec(h);if(!m)return;
var C=${JSON.stringify(CHAPTER_IDS)},T=${JSON.stringify(TIERS)};
history.replaceState(history.state,'',location.pathname+location.search);
if(m[1]!=='${appId}'||C.indexOf(m[2])<0||T.indexOf(m[3])<0)return;
try{sessionStorage.setItem('${ARRIVAL_CHAPTER_KEY}',m[2]);}catch(e){}
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var d=document.documentElement,w=window;
w.__intentlyArrival={app:m[1],ch:m[2],tier:m[3],taken:false};
d.classList.add('arriving');d.setAttribute('data-arrival',m[3]);
function done(){d.classList.remove('arriving','arrival-parting');d.removeAttribute('data-arrival');
if(!w.__intentlyArrival.done){w.__intentlyArrival.done=true;document.dispatchEvent(new CustomEvent('intently:arrived'));}}
w.__intentlyArrival.done=false;w.__intentlyArrival.finish=done;
function start(){
setTimeout(function(){if(!w.__intentlyArrival.taken){d.classList.add('arrival-parting');setTimeout(done,${450});}},${ARRIVAL_WAIT});
setTimeout(done,${FAILSAFE});}
if(document.prerendering)document.addEventListener('prerenderingchange',start,{once:true});else start();
}catch(e){document.documentElement.classList.remove('arriving');}})();`;
}

/** The veil's CSS, in the app's colour. Content underneath is never hidden or moved: the veil is a fixed layer above it. */
export function veilCss(color: string): string {
	if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error(`bad colour: ${color}`);
	return `@property --arrival-open{syntax:'<percentage>';inherits:false;initial-value:0%}
html.arriving::after{content:"";position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:${color};
-webkit-mask-image:radial-gradient(circle at 50% 45%,transparent var(--arrival-open),#000 calc(var(--arrival-open) + 18%));
mask-image:radial-gradient(circle at 50% 45%,transparent var(--arrival-open),#000 calc(var(--arrival-open) + 18%))}
html.arrival-parting::after{animation:intently-part 450ms cubic-bezier(.2,.7,.2,1) forwards}
@keyframes intently-part{from{--arrival-open:0%;opacity:1}70%{opacity:1}to{--arrival-open:120%;opacity:0}}
@media (prefers-reduced-motion:reduce){html.arriving::after{display:none}}`;
}
