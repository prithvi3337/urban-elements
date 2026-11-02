// Add the WhatsApp Business number here when ready (country code + number, digits only).
const WHATSAPP_NUMBER = '919390876834';

const UE_PROJECTS = [
  {id:'shadnagar',location:'Hyderabad',label:'Plots — Shadnagar',message:'I am interested in your completed HMDA plotted venture at Shadnagar.'},
  {id:'tukkuguda-plots',location:'Hyderabad',label:'Plots — Tukkuguda',message:'I am interested in your plotted venture at Tukkuguda, near Hyderabad Airport.'},
  {id:'shamirpet-plots',location:'Hyderabad',label:'Plots — Shamirpet',message:'I am interested in your plotted venture at Shamirpet, near the ORR.'},
  {id:'tukkuguda-villas',location:'Hyderabad',label:'Customised Villas — Tukkuguda',message:'I am interested in your customised villa offering at Tukkuguda.'},
  {id:'saligao-villas',location:'Goa',label:'Villas — Saligao',message:'I am interested in your villa offering at Saligao, Goa.'},
  {id:'saligao-commercial',location:'Goa',label:'Commercial Spaces — Saligao',message:'I am interested in your commercial space at Saligao, Goa.'},
  {id:'apartments',location:'Other',label:'Apartments — Upcoming',message:'I am interested in your upcoming apartment opportunities.'}
];

(function setupEnquiry() {
  const pageId = location.pathname.split('/').pop().replace(/\.html$/,'');
  const pageProject = UE_PROJECTS.find(p=>p.id===pageId);
  const wrapper = document.createElement('div');
  wrapper.className = 'ue-enquiry-overlay';
  wrapper.hidden = true;
  wrapper.innerHTML = `<div class="ue-enquiry-backdrop" data-close="true"></div><section class="ue-enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="ue-enquiry-title" tabindex="-1"><button class="ue-enquiry-close" type="button" aria-label="Close enquiry form">×</button><div class="ue-enquiry-eyebrow">URBAN ELEMENTS · PRIVATE ENQUIRY</div><h2 id="ue-enquiry-title">Let's find your <em>space.</em></h2><p class="ue-enquiry-intro">Tell us a little about what you're looking for.</p><form id="ue-enquiry-form"><label class="ue-field-label" for="ue-name">What should we call you?</label><input id="ue-name" name="name" autocomplete="name" placeholder="Your name" maxlength="80" required /><div id="ue-property-choices"><label class="ue-field-label" for="ue-location">Where are you looking?</label><div class="ue-location-choices" role="group" aria-label="Choose a location"><button type="button" class="ue-location-choice is-selected" data-location="Hyderabad" aria-pressed="true">Hyderabad</button><button type="button" class="ue-location-choice" data-location="Goa" aria-pressed="false">Goa</button><button type="button" class="ue-location-choice" data-location="Other" aria-pressed="false">Exploring options</button></div><label class="ue-field-label" for="ue-project">Which property interests you?</label><select id="ue-project" name="project" required></select></div><div class="ue-selected-project" hidden></div><button class="ue-submit" type="submit">CONTINUE ON WHATSAPP <span>↗</span></button><p class="ue-enquiry-note">Your message will be prepared in WhatsApp. You choose whether to send it.</p><p class="ue-enquiry-status" role="status" aria-live="polite"></p></form></section>`;
  document.body.appendChild(wrapper);
  const form=wrapper.querySelector('form'), name=wrapper.querySelector('#ue-name'), locationButtons=[...wrapper.querySelectorAll('[data-location]')], select=wrapper.querySelector('#ue-project'), choices=wrapper.querySelector('#ue-property-choices'), selected=wrapper.querySelector('.ue-selected-project'), status=wrapper.querySelector('.ue-enquiry-status');
  let chosenLocation='Hyderabad', activeProject=null, previousFocus=null;
  const fillProjects=()=>{
    const options=chosenLocation==='Other' ? [{id:'exploring',label:'I am exploring options'},...UE_PROJECTS] : UE_PROJECTS.filter(p=>p.location===chosenLocation);
    select.replaceChildren();
    options.forEach(p=>{const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.label;select.appendChild(opt);});
  };
  fillProjects();
  locationButtons.forEach(button=>button.addEventListener('click',()=>{
    chosenLocation=button.dataset.location;
    locationButtons.forEach(b=>{const active=b===button;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active));});
    fillProjects();
  }));
  const close=()=>{wrapper.hidden=true;document.body.classList.remove('ue-enquiry-open');status.textContent='';if(previousFocus)previousFocus.focus();};
  wrapper.querySelector('.ue-enquiry-close').addEventListener('click',close);
  wrapper.querySelector('.ue-enquiry-backdrop').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(wrapper.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const focusable=[...wrapper.querySelectorAll('button:not([disabled]),input,select')].filter(el=>el.offsetParent!==null);const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  function open(project){
    previousFocus=document.activeElement;activeProject=project||null;
    choices.hidden=!!activeProject;selected.hidden=!activeProject;
    if(activeProject)selected.textContent='YOUR INTEREST · '+activeProject.label;
    wrapper.querySelector('#ue-enquiry-title').innerHTML=activeProject?'Interested in this <em>space?</em>':"Let's find your <em>space.</em>";
    wrapper.querySelector('.ue-enquiry-intro').textContent=activeProject?'Introduce yourself and we’ll prepare your project enquiry.':'Tell us a little about what you’re looking for.';
    status.textContent='';wrapper.hidden=false;document.body.classList.add('ue-enquiry-open');name.focus();
  }
  // Delegated handler: also catches floating buttons injected after script.js loads.
  // Every enquiry entry point on a project page opens the selected-project form.
  document.addEventListener('click', e => {
    const link = e.target.closest('a.whatsapp-link');
    if (!link) return;
    e.preventDefault();
    open(pageProject || null);
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const customer=name.value.trim();if(!customer){name.setCustomValidity('Please enter your name.');name.reportValidity();name.setCustomValidity('');return;}
    const project=activeProject||UE_PROJECTS.find(p=>p.id===select.value);
    const interest=project?project.message:'I am exploring your properties and would like guidance on available opportunities.';
    const source=activeProject?`Urban Elements Website — ${activeProject.label} Project Page`:'Urban Elements Website — General Enquiry';
    const message=`Hello Urban Elements!\n\nMy name is ${customer}.\n\n${interest}\n\nPlease share the project details.\n\nEnquiry Source: ${source}`;
    if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){
      status.textContent='Your enquiry is ready. WhatsApp will be available once our business number is activated.';
      return;
    }
    const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const popup=window.open(url,'_blank','noopener,noreferrer');
    if(!popup)window.location.href=url;
    close();
  });
})();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Instagram and Facebook URLs will be added when the profiles are ready.
document.querySelectorAll('.social-placeholder').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    alert(`${link.dataset.social === 'instagram' ? 'Instagram' : 'Facebook'} profile link will be added soon.`);
  });
});

// Deliberate, gently eased navigation to the Projects section.
// Applies to both the header link and the hero CTA, without changing other links.
(() => {
  const target = document.getElementById('projects');
  if (!target) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeAnimation = null;
  document.querySelectorAll('a[href="#projects"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (activeAnimation) cancelAnimationFrame(activeAnimation);
      document.documentElement.classList.add('projects-scroll-active');
      const destination = Math.max(0, window.scrollY + target.getBoundingClientRect().top - 22);
      const start = window.scrollY;
      const distance = destination - start;
      if (reducedMotion.matches) {
        window.scrollTo(0, destination);
        document.documentElement.classList.remove('projects-scroll-active');
        return;
      }
      const duration = 1350;
      const started = performance.now();
      // Smooth ease-in-out: unhurried beginning and gentle arrival.
      const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const animate = now => {
        const progress = Math.min((now - started) / duration, 1);
        window.scrollTo(0, start + distance * ease(progress));
        if (progress < 1) activeAnimation = requestAnimationFrame(animate);
        else { activeAnimation = null; document.documentElement.classList.remove('projects-scroll-active'); }
      };
      activeAnimation = requestAnimationFrame(animate);
    });
  });
})();
