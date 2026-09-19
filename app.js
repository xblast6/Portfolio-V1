const projects = {
 cinema:{name:'LightFocusCinema',category:'CINEMA / SVILUPPO WEB',image:'assets/lightfocuscinema-logo.webp',description:'Uno spazio digitale per il cinema indipendente. Il sito presenta produzioni, servizi, eventi e il team di LightFocusCinema, con una direzione visiva cinematografica e contenuti in italiano e inglese.',links:[]},
 ultrarare:{name:'UltraRare',category:'COLLEZIONISMO / CATALOGO DIGITALE',image:'assets/ultrarare.jpeg',description:'Un catalogo dedicato alle carte Pokémon. Ricerca, filtri, carte in evidenza e dettagli della collezione si incontrano in un’esperienza dinamica, costruita intorno alla passione per il collezionismo.',links:[]},
 noto:{name:'Politicamente corretto',category:'MUSICA / RELEASE LANDING',image:'assets/noto.jpeg',description:'Una pagina per l’uscita di Politicamente corretto di Noto Dri. La copertina diventa il centro dell’identità visiva, mentre i collegamenti portano direttamente al brano e ai canali dell’artista.',links:[{label:'Visita la pagina ↗',url:'https://politicamente-corretto.vercel.app/'}]}
};
projects.cinema.links=[{label:'Visita il sito ↗',url:'https://www.lightfocuscinema.com/'}];
projects.ultrarare.links=[{label:'Visita il sito ↗',url:'https://www.ultrarareofficial.com/'}];
const dialog=document.querySelector('#project-dialog');
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
 const p=projects[button.dataset.open];
 document.querySelector('#dialog-title').textContent=p.name;
 document.querySelector('#dialog-category').textContent=p.category;
 document.querySelector('#dialog-description').textContent=p.description;
 const img=document.querySelector('#dialog-img');img.src=p.image;img.alt=p.name;img.parentElement.classList.toggle('is-logo',button.dataset.open==='cinema');
 const links=document.querySelector('#dialog-links');links.replaceChildren();
 p.links.forEach(link=>{const a=document.createElement('a');a.href=link.url;a.textContent=link.label;a.target='_blank';a.rel='noopener noreferrer';links.append(a)});
 if(!p.links.some(l=>l.label.startsWith('Visita'))){const note=document.createElement('p');note.className='link-note';note.textContent='Link al sito in aggiornamento.';links.append(note)}
 dialog.showModal();document.body.style.overflow='hidden';
}));
function closeDialog(){dialog.close()}
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('close',()=>{document.body.style.overflow=''});
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()});
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches;
const motion=document.querySelector('.motion-toggle');
function updateMotion(){document.documentElement.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.innerHTML=paused?'▶ <span>Motion off</span>':'Ⅱ <span>Motion on</span>';motion.title=paused?'Attiva le animazioni':'Metti in pausa le animazioni'}
updateMotion();motion.addEventListener('click',()=>{paused=!paused;updateMotion()});reduce.addEventListener('change',e=>{paused=e.matches;updateMotion()});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('waiting');observer.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.project,.work h2,.approach-content,.end-section h2').forEach(el=>{el.classList.add('reveal','waiting');observer.observe(el)});
let queued=false;
window.addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{const distance=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${distance>0?scrollY/distance*100:0}%`;queued=false})},{passive:true});
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;hero.style.setProperty('--shift-x',`${x*14}px`);hero.style.setProperty('--shift-y',`${y*8}px`)});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--shift-x','0px');hero.style.setProperty('--shift-y','0px')});
