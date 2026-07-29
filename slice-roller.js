/* ──────────────────────────────────────────────────────────────
   SliceRoller — a touch/mouse "joystick roller" for scrolling image
   slices (DICOM stacks, radiology atlas series).

   Drag or hold the roller up/down: the further you push from the
   centre, the faster it scrolls (a jog-shuttle), so it works the same
   for a 3-slice X-ray or a 300-slice CT. Springs back on release.
   A quick tap on the top/bottom half steps one slice. Pointer Events
   unify mouse + touch, so it behaves identically on web and mobile.

   Usage:
     const r = SliceRoller.create({
       mount:   element,          // container (made position:relative)
       getIndex:()=>currentIndex, // 0-based
       getCount:()=>totalSlices,
       onGo:    (i)=>setIndex(i)  // clamp handled internally
     });
     r.update();     // refresh the readout when the slice changes elsewhere
     r.destroy();
   ────────────────────────────────────────────────────────────── */
(function(){
  if (window.SliceRoller) return;

  var CSS = ''
  + '.jroll{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:48px;height:176px;'
  + 'border-radius:26px;background:rgba(10,18,32,.62);border:1px solid rgba(255,255,255,.16);'
  + 'box-shadow:0 8px 22px rgba(0,0,0,.4);z-index:20;touch-action:none;user-select:none;'
  + '-webkit-user-select:none;cursor:grab;display:flex;align-items:center;justify-content:center;'
  + 'overflow:hidden;-webkit-tap-highlight-color:transparent;}'
  + '.jroll.grab{cursor:grabbing;}'
  + '.jroll .jr-ridge{position:absolute;inset:7px;border-radius:20px;pointer-events:none;'
  + 'background:repeating-linear-gradient(180deg,rgba(255,255,255,.18) 0 2px,transparent 2px 12px);'
  + 'opacity:.5;}'
  + '.jroll .jr-thumb{position:relative;width:42px;height:54px;border-radius:15px;'
  + 'background:linear-gradient(180deg,#2c3d5a,#172236);border:1px solid rgba(255,255,255,.24);'
  + 'box-shadow:0 3px 9px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.14);'
  + 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;'
  + 'transition:transform .2s cubic-bezier(.2,.9,.3,1);}'
  + '.jroll.grab .jr-thumb{transition:none;}'
  + '.jr-thumb .jr-line{width:16px;height:2px;border-radius:2px;background:rgba(160,196,240,.75);}'
  + '.jr-chev{position:absolute;left:0;right:0;text-align:center;color:rgba(255,255,255,.45);'
  + 'font-size:.72rem;pointer-events:none;}'
  + '.jr-chev.up{top:7px;}.jr-chev.dn{bottom:7px;}'
  + '.jr-bubble{position:absolute;right:60px;top:50%;transform:translateY(-50%);'
  + 'background:rgba(10,18,32,.9);color:#dbeafe;font:700 .74rem/1 Inter,system-ui,sans-serif;'
  + 'padding:6px 10px;border-radius:9px;white-space:nowrap;opacity:0;transition:opacity .15s;'
  + 'pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.3);}'
  + '.jroll.grab .jr-bubble,.jroll:hover .jr-bubble{opacity:1;}'
  + '@media(max-width:820px){.jroll{width:56px;height:158px;right:8px;}'
  + '.jr-bubble{right:64px;font-size:.8rem;padding:7px 11px;}}';

  function injectCSS(){
    if (document.getElementById('jroll-css')) return;
    var s = document.createElement('style'); s.id = 'jroll-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function create(opts){
    injectCSS();
    var mount = opts.mount;
    if (getComputedStyle(mount).position === 'static') mount.style.position = 'relative';

    var el = document.createElement('div');
    el.className = 'jroll';
    el.setAttribute('aria-label', 'Slice roller — drag up or down to scroll');
    el.innerHTML =
      '<div class="jr-ridge"></div>'
      + '<span class="jr-chev up"><i class="fas fa-chevron-up"></i></span>'
      + '<div class="jr-thumb"><span class="jr-line"></span><span class="jr-line"></span><span class="jr-line"></span></div>'
      + '<span class="jr-chev dn"><i class="fas fa-chevron-down"></i></span>'
      + '<span class="jr-bubble">—</span>';
    mount.appendChild(el);

    var thumb  = el.querySelector('.jr-thumb');
    var ridge  = el.querySelector('.jr-ridge');
    var bubble = el.querySelector('.jr-bubble');

    var MAXDEF = 54;          // px the thumb can deflect
    var DEAD   = 8;           // deadzone px
    var raf = null, dragging = false, startY = 0, disp = 0, lastT = 0, acc = 0, phase = 0;
    var pressY = 0, moved = 0, pressT = 0;

    function maxRate(){ return Math.max(6, Math.min(60, getCountSafe() * 0.6)); }
    function getCountSafe(){ return Math.max(1, opts.getCount() || 1); }

    function rateFrom(d){
      var s = d < 0 ? -1 : 1;
      var mag = Math.max(0, Math.abs(d) - DEAD);
      var norm = Math.min(1, mag / 92);
      return s * Math.pow(norm, 1.7) * maxRate();   // slices / second
    }

    function step(dir){
      var n = getCountSafe();
      var i = Math.max(0, Math.min(n - 1, opts.getIndex() + dir));
      if (i !== opts.getIndex()) opts.onGo(i);
      update();
    }

    function loop(now){
      var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      var rate = rateFrom(disp);
      acc += rate * dt;
      while (acc >= 1) { step(1);  acc -= 1; }
      while (acc <= -1){ step(-1); acc += 1; }
      phase = (phase + rate * dt * 12) % 12;        // spin the ridges
      ridge.style.backgroundPositionY = phase.toFixed(1) + 'px';
      var def = Math.max(-MAXDEF, Math.min(MAXDEF, disp));
      thumb.style.transform = 'translateY(' + def.toFixed(1) + 'px)';
      raf = requestAnimationFrame(loop);
    }

    function down(e){
      dragging = true; startY = pressY = e.clientY; disp = 0; acc = 0; moved = 0;
      pressT = performance.now(); lastT = pressT;
      el.classList.add('grab');
      try { el.setPointerCapture(e.pointerId); } catch(_) {}
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
      update(); e.preventDefault();
    }
    function move(e){
      if (!dragging) return;
      disp = e.clientY - startY;
      moved = Math.max(moved, Math.abs(e.clientY - pressY));
      e.preventDefault();
    }
    function up(e){
      if (!dragging) return;
      dragging = false; el.classList.remove('grab');
      try { el.releasePointerCapture(e.pointerId); } catch(_) {}
      cancelAnimationFrame(raf); raf = null;
      // quick tap → single step based on which half was pressed
      if (moved < 6 && (performance.now() - pressT) < 260) {
        var r = el.getBoundingClientRect();
        step(pressY < r.top + r.height / 2 ? -1 : 1);
      }
      disp = 0; acc = 0;
      thumb.style.transform = 'translateY(0px)';
      update();
    }

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);

    function update(){
      var n = opts.getCount() || 0;
      if (n < 2) { el.style.display = 'none'; return; }
      el.style.display = '';
      bubble.textContent = (opts.getIndex() + 1) + ' / ' + n;
    }
    update();

    return {
      el: el,
      update: update,
      destroy: function(){
        cancelAnimationFrame(raf);
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        if (el.parentNode) el.parentNode.removeChild(el);
      }
    };
  }

  window.SliceRoller = { create: create };
})();
