(() => {
  'use strict';
  const root = document.documentElement;
  const fine = matchMedia('(any-pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'blast-cursor-layer';
  layer.setAttribute('aria-hidden', 'true');
  const cursor = document.createElement('div');
  cursor.className = 'blast-cursor';
  cursor.innerHTML = '<span class="blast-cursor-shape"><span class="blast-cursor-symbol">✳</span></span>';
  layer.append(cursor);
  document.body.append(layer);
  let x = 0, y = 0;
  const interactive = 'a,button,input,select,textarea,summary,[role="button"],[contenteditable="true"]';

  // A modal is in the browser top layer: its cursor must live there too.
  function syncLayer() {
    const host = document.querySelector('dialog[open]') || document.body;
    if (layer.parentElement !== host) host.append(layer);
  }
  function updateHover(element) {
    cursor.classList.toggle('is-hovering', Boolean(element?.closest(interactive)));
  }
  function hide() {
    root.classList.remove('blast-cursor-active');
    cursor.classList.remove('is-hovering', 'is-pressed');
    layer.querySelectorAll('.blast-cursor-burst').forEach(burst => burst.remove());
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !fine.matches) { hide(); return; }
    x = event.clientX; y = event.clientY;
    syncLayer();
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
    updateHover(event.target);
    root.classList.add('blast-cursor-active');
  }, {passive:true});
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') { hide(); return; }
    if (root.classList.contains('blast-cursor-active')) cursor.classList.add('is-pressed');
  });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  document.addEventListener('pointercancel', hide);
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if(document.hidden) hide(); });
  fine.addEventListener('change', hide);
  document.addEventListener('scroll', () => {
    if(root.classList.contains('blast-cursor-active')) updateHover(document.elementFromPoint(x,y));
  }, {capture:true,passive:true});
  document.querySelectorAll('dialog').forEach(modal => {
    new MutationObserver(() => {
      syncLayer();
      updateHover(document.elementFromPoint(x,y));
    }).observe(modal, {attributes:true,attributeFilter:['open']});
  });
  document.addEventListener('click', event => {
    if (!root.classList.contains('blast-cursor-active') || event.detail === 0 || reduced.matches || root.classList.contains('paused')) return;
    syncLayer();
    const burst = document.createElement('span');
    burst.className = 'blast-cursor-burst';
    burst.style.left = event.clientX + 'px';
    burst.style.top = event.clientY + 'px';
    for(let i=0;i<6;i++) {
      const star = document.createElement('i');
      const angle = i*Math.PI/3-Math.PI/2;
      const radius = i%2 ? 54 : 76;
      star.textContent = '✳';
      star.style.setProperty('--star-x', Math.cos(angle)*radius+'px');
      star.style.setProperty('--star-y', Math.sin(angle)*radius+'px');
      star.style.setProperty('--star-turn', (i%2 ? 150 : -150)+'deg');
      burst.append(star);
    }
    layer.append(burst);
    setTimeout(() => burst.remove(), 850);
  });
})();
