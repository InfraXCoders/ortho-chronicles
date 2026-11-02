/* OrthoChronicles 3D Anatomy — "pro" rendering pass.
   Makes the tissue layers read like a professional atlas: every muscle its own shade with a dark seam outline,
   thick glossy arteries / veins / nerves in clearly different colours, and image-based lighting for wet-specimen highlights.
   Runs on top of the explorer through window.__anatomy and the __anatomyOnSwap hook. Safe to remove. */
(function () {
  'use strict';
  const A = window.__anatomy; if (!A || !window.THREE) return;
  const { STRUCTURES, layerGroups, renderer, scene } = A;

  /* ───────── 1 · image-based lighting (soft studio room) ───────── */
  try {
    const pm = new THREE.PMREMGenerator(renderer); const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshBasicMaterial({ color: 0x1a2030, side: THREE.BackSide })));
    const panel = (w, h, x, y, z, v, cool) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(cool ? v * .72 : v, cool ? v * .85 : v * .95, cool ? v : v * .88), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
    panel(46, 30, 20, 38, 36, 6.0); panel(30, 40, -42, 20, 18, 2.6, true); panel(60, 12, 0, 46, -30, 3.4); panel(24, 24, 36, -8, -30, 1.8); panel(80, 6, 0, -44, 0, 0.7);
    scene.environment = pm.fromScene(env, 0.03).texture; pm.dispose();
  } catch (e) { console.warn('env map skipped', e); }

  /* ───────── helpers ───────── */
  const hash = id => { let h = 2166136261; for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rnd = (id, k) => ((hash(id + k) % 10007) / 10007);
  const meshesOf = d => { const out = []; d.object && d.object.traverse(o => { if (o.isMesh && !o.userData.isOutline) out.push(o); }); return out; };
  const baseId = id => id.replace(/_[lr]$/, '');

  /* ───────── 2 · muscles: individual shades + seam outlines ───────── */
  const DEEP = /subscap|infraspin|teresminor|psoas|tibpost|popliteus|deepflex|deepneck|deeprot|suboccip|pelvicfloor|semispin|hiprot|transv|serratusposterior|plantaris|supraspin|antextensors|levatorscap|scalenes|subclavius|pectminor|rhomboids/;
  const SUP = /trapez|latissim|pectoralis|deltoid|gluteusmax|quadriceps|hamstring|gastroc|rectusabd|biceps|triceps|sartorius|tfl|scm|extoblique|brachioradialis|flexorgroup|extensorgroup|erector|adductors/;
  function muscleColour(id) {
    const b = baseId(id), r1 = rnd(b, 'a'), r2 = rnd(b, 'b'), r3 = rnd(b, 'c');
    const hue = ((0.985 + r1 * 0.05) % 1);                            // crimson → red-orange
    const sat = 0.66 + r2 * 0.20;
    const lig = DEEP.test(b) ? 0.15 + r3 * 0.05 : SUP.test(b) ? 0.24 + r3 * 0.08 : 0.19 + r3 * 0.08;
    return new THREE.Color().setHSL(hue, sat, lig);
  }
  const outlineCache = new Map();
  function outlineMat(d) {
    const m = new THREE.MeshBasicMaterial({ color: 0x1d0505, side: THREE.BackSide });
    m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(normal) * 0.12;'); };
    m.customProgramCacheKey = () => 'ol012'; return m;
  }
  function styleMuscle(d) {
    const m = d._mat; if (!m) return;
    if (!m.userData.pro) { m.userData.pro = true; m.color.copy(muscleColour(d.id)); m.envMapIntensity = 0.22; m.roughness = Math.min(m.roughness, 0.5); m.clearcoat = 0.1; }
    if (d.highDetail) meshesOf(d).forEach(o => {                       // outline only the loaded scan meshes (procedural stand-ins are ribbons)
      if (o.children.some(c => c.userData.isOutline)) return;
      o.geometry.computeBoundingBox(); const s = new THREE.Vector3(); o.geometry.boundingBox.getSize(s);
      if (Math.min(s.x, s.y, s.z) < 0.35) return;                      // skip thin sheets
      const ol = new THREE.Mesh(o.geometry, outlineMat(d)); ol.userData.isOutline = true; ol.raycast = () => { }; ol.renderOrder = -1; o.add(ol);
    });
  }

  /* ───────── 3 · arteries / veins / nerves / lymphatics: thick, saturated, glossy ───────── */
  const VS = { arteries: { c: 0xC30F1E, g: 0.13, t: 0.10 }, veins: { c: 0x1536A0, g: 0.12, t: 0.10 }, nerves: { c: 0xEDBB00, g: 0.20, t: 0.11 }, lymphatics: { c: 0x25B873, g: 0.14, t: 0.07 } };
  function styleTube(mat, layer) {
    const s = VS[layer]; if (!s || !mat || mat.userData.pro) return; mat.userData.pro = true;
    mat.color.setHex(s.c); mat.opacity = 1; mat.transparent = false; mat.depthWrite = true; mat.roughness = 0.3; mat.envMapIntensity = 0.42;
    const prev = mat.onBeforeCompile;
    mat.onBeforeCompile = (sh, r) => { if (prev) prev(sh, r);
      sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(normal) * ' + s.t.toFixed(3) + ';');
      sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * ' + s.g.toFixed(3) + ';'); };
    mat.customProgramCacheKey = () => 'tube' + layer; mat.needsUpdate = true;
  }
  function styleLayerTubes(layer) { const g = layerGroups[layer]; if (!g) return; g.traverse(o => { if (o.isMesh && o.material && !o.userData.isOutline) { const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach(m => styleTube(m, layer)); } }); }

  /* ───────── 4 · tendons / ligaments: pale fibrous cords ───────── */
  function styleTendons() { const g = layerGroups.tendons; if (!g) return; g.traverse(o => { if (o.isMesh && o.material && !o.material.userData.pro) { o.material.userData.pro = true; o.material.color.setHex(0xE6DCC4); o.material.opacity = 1; o.material.transparent = false; o.material.depthWrite = true; o.material.roughness = 0.4; o.material.envMapIntensity = 0.7; } }); }

  function upgrade(d) {
    if (!d) return;
    if (d.layer === 'muscles') styleMuscle(d);
    else if (VS[d.layer]) styleLayerTubes(d.layer);
    else if (d.layer === 'tendons') styleTendons();
    else if (d.layer === 'skeleton' && d._mat && !d._mat.userData.pro) { d._mat.userData.pro = true; d._mat.envMapIntensity = 0.3; }
  }
  function upgradeAll() { Object.values(STRUCTURES).forEach(upgrade); Object.keys(VS).forEach(styleLayerTubes); styleTendons(); }
  window.__anatomyOnSwap = d => { upgrade(d); };
  upgradeAll();
  // decorations and late-loading meshes: re-run when a layer is toggled and for a short while after load
  document.addEventListener('click', e => { if (e.target.closest('#layerList')) { setTimeout(upgradeAll, 300); setTimeout(upgradeAll, 2500); } });
  let n = 0; const iv = setInterval(() => { upgradeAll(); if (++n > 12) clearInterval(iv); }, 2500);
  window.__anatomyPro = { upgradeAll, muscleColour };
})();
