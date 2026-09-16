
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const path=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('nav a[data-page]').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===path));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{if(innerWidth>850&&glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{if(innerWidth>850){const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`}}));
document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
 const f=btn.dataset.filter;
 document.querySelectorAll('.project').forEach(p=>p.classList.toggle('hidden',!(f==='all'||p.dataset.category.split(' ').includes(f))));
}));
const form=document.querySelector('#contactForm');
form?.addEventListener('submit',async e=>{
 e.preventDefault();
 const status=document.querySelector('.form-status'); status.textContent='Sending...';
 try{
  const r=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
  const data=await r.json(); if(!r.ok) throw new Error(data.error||'Could not submit');
  status.textContent='✓ Enquiry received. Harsh will get back to you soon.'; form.reset();
 }catch(err){status.textContent='Could not send right now. Please WhatsApp +91 89302 81471.'}
});
