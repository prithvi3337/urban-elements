(()=>{
const track=document.getElementById('portfolio-track');if(!track)return;
const cards=[...track.querySelectorAll('.portfolio-card')];
const categoryButtons=[...document.querySelectorAll('.portfolio-filter')],regionButtons=[...document.querySelectorAll('.region-filter')];
const prev=document.getElementById('portfolio-prev'),next=document.getElementById('portfolio-next');
const glassPrev=document.getElementById('portfolio-glass-prev'),glassNext=document.getElementById('portfolio-glass-next');
const position=document.getElementById('portfolio-position'),empty=document.getElementById('portfolio-empty');
const windowEl=document.querySelector('.portfolio-carousel-window');
let category='all',region='all',current=0;
const visible=()=>cards.filter(card=>(category==='all'||card.dataset.category===category)&&(region==='all'||card.dataset.region===region));
function update(){
 // Counts always reflect the selected LOCATION, independent of the property category.
 categoryButtons.forEach(button=>{
  const kind=button.dataset.filter;
  const count=cards.filter(card=>(region==='all'||card.dataset.region===region)&&(kind==='all'||card.dataset.category===kind)).length;
  const badge=button.querySelector('span');
  if(badge)badge.textContent=String(count).padStart(2,'0');
  button.setAttribute('aria-label',`${button.textContent.replace(/\d+\s*$/, '').trim()}: ${count} properties`);
 });
 const subset=visible(),isEmpty=subset.length===0;
 current=Math.max(0,Math.min(current,Math.max(0,subset.length-1)));
 cards.forEach(card=>{const i=subset.indexOf(card),diff=i-current,shown=i>=0&&Math.abs(diff)<=1;
  card.hidden=!shown;card.classList.toggle('is-current',shown&&diff===0);card.classList.toggle('is-neighbor',shown&&diff!==0);
  card.style.setProperty('--offset',diff);card.setAttribute('aria-hidden',String(!shown||diff!==0));card.tabIndex=shown&&diff===0?0:-1;
 });
 empty.hidden=!isEmpty;windowEl.hidden=isEmpty;
 position.textContent=isEmpty?'00 / 00':`${String(current+1).padStart(2,'0')} / ${String(subset.length).padStart(2,'0')}`;
 [prev,glassPrev].forEach(b=>{b.disabled=isEmpty||current===0});
 [next,glassNext].forEach(b=>{b.disabled=isEmpty||current===subset.length-1});
 track.setAttribute('aria-label',isEmpty?'No properties in selected filters':`Property ${current+1} of ${subset.length}: ${subset[current]?.querySelector('h3')?.textContent||''}`);
}
function move(delta){const count=visible().length;if(!count)return;current=Math.max(0,Math.min(count-1,current+delta));update()}
[prev,glassPrev].forEach(b=>b.addEventListener('click',()=>move(-1)));
[next,glassNext].forEach(b=>b.addEventListener('click',()=>move(1)));
function activate(buttons,selected){buttons.forEach(b=>{const active=b===selected;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))})}
categoryButtons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;current=0;activate(categoryButtons,b);update()}));
regionButtons.forEach(b=>b.addEventListener('click',()=>{region=b.dataset.region;current=0;activate(regionButtons,b);update()}));
track.addEventListener('click',e=>{const neighbor=e.target.closest('.is-neighbor');if(neighbor){e.preventDefault();current=visible().indexOf(neighbor);update()}});
windowEl.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
// Native touch/pointer dragging works on iPhone, Android, iPad and touch-enabled laptops.
let startX=null,startY=null;
windowEl.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;startX=e.clientX;startY=e.clientY},{passive:true});
windowEl.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)move(dx<0?1:-1);startX=startY=null},{passive:true});
windowEl.addEventListener('pointercancel',()=>{startX=startY=null});
// MacBook trackpads commonly emit horizontal wheel deltas rather than touch events.
let wheelSum=0,lastWheel=0,wheelLocked=false;
windowEl.addEventListener('wheel',e=>{if(!visible().length||Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.1||Math.abs(e.deltaX)<2)return;
 const now=performance.now();if(now-lastWheel>280)wheelSum=0;lastWheel=now;
 if(wheelLocked)return;wheelSum+=e.deltaX;if(Math.abs(wheelSum)>45){move(wheelSum>0?1:-1);wheelSum=0;wheelLocked=true;setTimeout(()=>wheelLocked=false,460)}
 if((e.deltaX>0&&!next.disabled)||(e.deltaX<0&&!prev.disabled))e.preventDefault();
},{passive:false});
update();
})();
