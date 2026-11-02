/* OrthoChronicles 3D Anatomy — learning layer: guided tours, quiz, contents tree, cross-section / explode / focus tools, and links to related guides.
   Extends the explorer through window.__anatomy (exposed by anatomy.html). Nothing here is required for the explorer to run. */
(function () {
  'use strict';
  const A = window.__anatomy; if (!A) return;
  const { STRUCTURES, layerGroups, LAYERS, renderer, want, focusOn } = A;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const baseId = id => id.replace(/_[lr]$/, '');
  const clean = d => d.name.replace(/^(Left|Right) /, '');
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } } };

  /* ───────── helpers over the explorer ───────── */
  function layerOn(layer) {
    const g = layerGroups[layer]; if (!g) return;
    if (!g.visible) { g.visible = true; const row = $(`#layerList [data-id="${layer}"]`); if (row) row.classList.add('on'); A.loadLayerModels && A.loadLayerModels(layer); }
  }
  function layersOnly(list) { LAYERS.forEach(L => { const on = list.includes(L.id); const g = layerGroups[L.id]; if (on) layerOn(L.id); else if (g.visible) { g.visible = false; const row = $(`#layerList [data-id="${L.id}"]`); if (row) row.classList.remove('on'); } }); }
  const idOfSide = id => STRUCTURES[id] ? id : (STRUCTURES[id + '_r'] ? id + '_r' : (STRUCTURES[id + '_l'] ? id + '_l' : null));

  /* ───────── styles ───────── */
  const css = document.createElement('style'); css.textContent = `
  #lrn{position:absolute;top:14px;left:240px;bottom:14px;width:340px;z-index:30;background:rgba(11,20,36,.94);border:1px solid rgba(255,255,255,.1);border-radius:16px;backdrop-filter:blur(14px);display:none;flex-direction:column;overflow:hidden;box-shadow:0 22px 60px rgba(0,0,0,.55);color:#E8EDF6;font-size:.86rem}
  #lrn.on{display:flex}
  #lrn .lh{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.1)}
  #lrn .lh b{flex:1;font-size:.7rem;letter-spacing:1.4px;text-transform:uppercase;color:#d8b45c}
  #lrn .lx{background:rgba(255,255,255,.08);border:0;color:#E8EDF6;width:28px;height:28px;border-radius:8px;cursor:pointer}
  #lrn .lt{display:flex;gap:2px;padding:6px 10px 0;border-bottom:1px solid rgba(255,255,255,.1)}
  #lrn .lt button{background:0;border:0;color:#93A4C0;font:700 .78rem Inter,sans-serif;padding:8px 12px;cursor:pointer;border-bottom:2px solid transparent}
  #lrn .lt button.on{color:#2DD4BF;border-bottom-color:#2DD4BF}
  #lrn .lb{flex:1;overflow:auto;padding:14px}
  #lrn p{color:#C9D4E8;line-height:1.65;margin:0 0 10px}
  #lrn .card{display:block;width:100%;text-align:left;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:11px 13px;margin-bottom:9px;color:#E8EDF6;cursor:pointer;font:inherit}
  #lrn .card:hover{background:rgba(45,212,191,.1);border-color:rgba(45,212,191,.4)}
  #lrn .card b{display:block;font-size:.92rem;margin-bottom:2px} #lrn .card span{color:#93A4C0;font-size:.78rem}
  #lrn .btn{background:#2DD4BF;color:#04201c;border:0;border-radius:10px;padding:9px 14px;font:800 .82rem Inter,sans-serif;cursor:pointer;margin:4px 6px 4px 0}
  #lrn .btn.g{background:rgba(255,255,255,.1);color:#E8EDF6}
  #lrn .step-n{font-size:.68rem;letter-spacing:1.2px;color:#2DD4BF;font-weight:800;text-transform:uppercase}
  #lrn h3{font-family:'Playfair Display',serif;font-size:1.15rem;margin:2px 0 8px}
  #lrn .bar{height:5px;background:rgba(255,255,255,.1);border-radius:5px;margin:8px 0 12px;overflow:hidden} #lrn .bar i{display:block;height:100%;background:#2DD4BF;transition:width .3s}
  #lrn .opt{display:block;width:100%;text-align:left;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px 12px;margin-bottom:8px;color:#E8EDF6;cursor:pointer;font:inherit}
  #lrn .opt:hover{border-color:#2DD4BF} #lrn .opt.ok{background:rgba(34,197,94,.25);border-color:#22c55e} #lrn .opt.no{background:rgba(239,68,68,.25);border-color:#ef4444}
  #lrn .fb{border-radius:10px;padding:10px 12px;margin:8px 0;font-size:.84rem;line-height:1.55} #lrn .fb.ok{background:rgba(34,197,94,.16)} #lrn .fb.no{background:rgba(239,68,68,.16)}
  #lrn .sel{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px} #lrn .sel button{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);color:#C9D4E8;border-radius:20px;padding:6px 12px;cursor:pointer;font:600 .78rem Inter,sans-serif} #lrn .sel button.on{background:#2DD4BF;color:#04201c;border-color:#2DD4BF}
  #lrn input[type=search]{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:9px 12px;color:#E8EDF6;margin-bottom:10px;font:inherit}
  #lrn .grp{font-size:.66rem;letter-spacing:1.3px;text-transform:uppercase;color:#d8b45c;font-weight:800;margin:12px 0 6px}
  #lrn .row{display:flex;align-items:center;gap:8px;padding:7px 4px;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer} #lrn .row:hover{background:rgba(255,255,255,.05)} #lrn .row .nm{flex:1} #lrn .row .eye{opacity:.6;padding:2px 6px}
  #lrn .row.hid .nm{opacity:.35;text-decoration:line-through}
  #tools{position:absolute;top:14px;left:240px;z-index:31;width:260px;background:rgba(11,20,36,.95);border:1px solid rgba(255,255,255,.1);border-radius:14px;backdrop-filter:blur(12px);display:none;padding:12px 14px;color:#E8EDF6;font-size:.82rem;box-shadow:0 18px 50px rgba(0,0,0,.5)}
  #tools.on{display:block} #tools h5{margin:0 0 8px;font-size:.66rem;letter-spacing:1.3px;text-transform:uppercase;color:#d8b45c} #tools label{display:flex;align-items:center;gap:8px;margin:7px 0;cursor:pointer;color:#C9D4E8} #tools input[type=range]{width:100%;accent-color:#2DD4BF} #tools .ax{display:flex;gap:5px;margin:6px 0} #tools .ax button{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#C9D4E8;border-radius:8px;padding:5px;cursor:pointer;font:600 .74rem Inter,sans-serif} #tools .ax button.on{background:#2DD4BF;color:#04201c} #tools hr{border:0;border-top:1px solid rgba(255,255,255,.1);margin:10px 0}
  .pn-pane .rm a{display:block;background:rgba(45,212,191,.1);border:1px solid rgba(45,212,191,.3);border-radius:10px;padding:9px 12px;margin-bottom:8px;color:#E8EDF6;text-decoration:none;font-weight:600}
  .pn-pane .rm a:hover{background:rgba(45,212,191,.2)} .pn-pane .rm small{display:block;color:#93A4C0;font-weight:400}
  @media(max-width:900px){#lrn{left:0;right:0;top:auto;bottom:0;width:auto;height:58vh;border-radius:18px 18px 0 0}#tools{left:10px;top:auto;bottom:70px;width:auto;right:10px}}
  `; document.head.appendChild(css);

  /* ───────── top-bar buttons ───────── */
  const topLab = $('#btnLabels');
  const mk = (id, ic, label, title) => { const b = document.createElement('button'); b.className = 'tb-btn'; b.id = id; b.title = title; b.innerHTML = `<i class="fas ${ic}"></i><span>${label}</span>`; topLab.parentNode.insertBefore(b, topLab); return b; };
  const bLearn = mk('btnLearn', 'fa-graduation-cap', 'Learn', 'Guided tours, quiz and contents'), bTools = mk('btnTools', 'fa-sliders', 'Tools', 'Cross-section, explode and focus tools');

  /* ───────── learn drawer ───────── */
  const stage = $('#stage');
  const lrn = document.createElement('div'); lrn.id = 'lrn';
  lrn.innerHTML = `<div class="lh"><i class="fas fa-graduation-cap" style="color:#d8b45c"></i><b>Learn</b><button class="lx" aria-label="Close"><i class="fas fa-times"></i></button></div>
    <div class="lt"><button data-t="tours" class="on">Tours</button><button data-t="quiz">Quiz</button><button data-t="contents">Contents</button></div><div class="lb" id="lrnBody"></div>`;
  stage.appendChild(lrn);
  let tab = 'tours'; const body = $('#lrnBody');
  const openLearn = (t) => { lrn.classList.add('on'); tools.classList.remove('on'); if (t) setTab(t); else setTab(tab); };
  const setTab = (t) => { tab = t; $$('.lt button', lrn).forEach(b => b.classList.toggle('on', b.dataset.t === t)); quizStop(); ({ tours: renderTours, quiz: renderQuizHome, contents: renderContents })[t](); };
  bLearn.onclick = () => lrn.classList.contains('on') ? lrn.classList.remove('on') : openLearn();
  $('.lx', lrn).onclick = () => { lrn.classList.remove('on'); quizStop(); };
  $('.lt', lrn).onclick = e => { const b = e.target.closest('button'); if (b) setTab(b.dataset.t); };

  /* ───────── TOURS ───────── */
  const TOURS = [
    { t: 'The shoulder & rotator cuff', d: 'Why the shoulder moves so freely — and why it injures so easily.', layers: ['skeleton', 'muscles', 'nerves'], steps: [
      ['Clavicle & scapula — the girdle', 'clavicle_r', 'The clavicle is the only bony strut tying the arm to the trunk; the scapula glides over the ribcage. Together they position the shallow glenoid socket, which is why shoulder movement is a team effort of two joints.'],
      ['The humerus', 'humerus_r', 'The humeral head is about three times larger than the glenoid. The greater and lesser tubercles are the attachment points of the rotator cuff, and the surgical neck is a classic fracture site.'],
      ['Supraspinatus — the most torn cuff muscle', 'supraspinatus_r', 'It runs under the acromion to the greater tubercle and starts abduction. Pinching in the narrow subacromial space explains impingement and why most cuff tears involve this tendon.'],
      ['Infraspinatus, teres minor & subscapularis', 'infraspinatus_r', 'The rest of the cuff: infraspinatus and teres minor rotate the arm outward, subscapularis rotates it inward. Together the four compress the humeral head into the socket.'],
      ['Deltoid', 'deltoid_r', 'The deltoid is the main power for lifting the arm, but it can only work once the cuff has centred the humeral head. It is supplied by the axillary nerve.'],
      ['Axillary nerve', 'axillary_n_r', 'It winds around the surgical neck of the humerus, so it can be injured by shoulder dislocations or neck fractures, producing deltoid weakness and a patch of numbness over the outer shoulder.'],
      ['Brachial plexus', 'brachplex_r', 'The nerve roots C5–T1 run between the scalene muscles, under the clavicle and into the axilla, branching into the nerves that supply the whole arm.']] },
    { t: 'Wrist, hand & carpal tunnel', d: 'The carpal bones, the tunnel and the nerves that cross them.', layers: ['skeleton', 'tendons', 'nerves'], steps: [
      ['Radius & ulna', 'radius_r', 'The radius carries most of the load at the wrist. The distal radius is the commonest fracture in adults after a fall on the outstretched hand.'],
      ['The carpal bones', 'scaphoid_r', 'Eight small bones in two rows. The scaphoid bridges both rows and its blood supply enters from the far end, so a waist fracture risks non-union and avascular necrosis.'],
      ['Flexor retinaculum', 'flexret_wrist_r', 'This thick band forms the roof of the carpal tunnel. Anything that narrows the tunnel squeezes what runs beneath it.'],
      ['Median nerve', 'median_r', 'Compression in the tunnel causes numbness of the thumb, index, middle and half of the ring finger, night waking, and later wasting of the thumb muscles (carpal tunnel syndrome).'],
      ['Ulnar nerve', 'ulnar_r', 'It passes behind the medial epicondyle (the “funny bone”) and through Guyon’s canal at the wrist, supplying the little finger and most hand intrinsic muscles.'],
      ['Radial artery', 'radial_art_r', 'The radial pulse is felt at the wrist, and the artery supplies the deep palmar arch — which is why surgeons perform the Allen test before using it for procedures.']] },
    { t: 'Hip & pelvis', d: 'The load-bearing ball-and-socket and the muscles that keep you level.', layers: ['skeleton', 'muscles', 'nerves', 'arteries'], steps: [
      ['The pelvis', 'pelvis', 'The ilium, ischium and pubis fuse at the acetabulum. The pelvic ring transmits body weight to the legs, and fractures of the ring are high-energy injuries with the potential for major bleeding.'],
      ['Femur', 'femur_r', 'The femoral head sits deep in the acetabulum. Its blood supply runs along the neck, so displaced femoral neck fractures can lead to avascular necrosis.'],
      ['Gluteus medius', 'gluteusmed_r', 'It holds the pelvis level when you stand on one leg. A weak gluteus medius or a damaged superior gluteal nerve causes a Trendelenburg gait.'],
      ['Iliopsoas', 'psoas_r', 'The strongest hip flexor, running over the front of the hip joint. Tightness and psoas abscesses are classic mimics of hip pathology.'],
      ['Sciatic nerve', 'sciatic_r', 'The largest nerve in the body leaves the pelvis through the greater sciatic foramen, usually beneath piriformis. It is at risk in posterior hip dislocations and posterior hip approaches.'],
      ['Femoral artery', 'femoral_art_r', 'The main blood supply of the lower limb, felt at the groin. Its branches, the profunda femoris and circumflex femoral arteries, supply the femoral head and thigh.']] },
    { t: 'The knee', d: 'From the quadriceps to the nerve at the fibular neck.', layers: ['skeleton', 'muscles', 'tendons', 'nerves'], steps: [
      ['Femur & tibia', 'femur_r', 'The rounded femoral condyles roll and glide on the flatter tibial plateau. The cruciate and collateral ligaments, with the menisci, give the joint its stability.'],
      ['Patella', 'patella_r', 'The largest sesamoid bone sits inside the quadriceps tendon and increases the leverage of the quadriceps. Kneecap pain and patellar dislocation are common in young people.'],
      ['Quadriceps femoris', 'quadriceps_r', 'Four muscles converging into one tendon: they extend the knee. Quadriceps weakness is the main modifiable factor in knee pain and osteoarthritis.'],
      ['Patellar ligament', 'patellar_lig_r', 'The continuation of the quadriceps tendon from the patella to the tibial tubercle, often used as a graft source in ACL reconstruction.'],
      ['Hamstrings', 'hamstrings_r', 'Flex the knee and extend the hip. The hamstrings protect the ACL by pulling the tibia backward.'],
      ['Popliteus', 'popliteus_r', 'Unlocks the extended knee by rotating the femur laterally and helps stabilise the posterolateral corner.'],
      ['Common peroneal nerve', 'peroneal_r', 'It winds around the fibular neck, where it is easily injured by fractures, tight casts or leg crossing, causing foot drop.']] },
    { t: 'Ankle & foot', d: 'The mortise, the heel and the arch.', layers: ['skeleton', 'muscles', 'tendons', 'arteries'], steps: [
      ['Tibia & fibula', 'tibia_r', 'The tibia carries the weight; the fibula forms the lateral side of the ankle mortise. Together with the talus they create a tight joint stabilised by the syndesmosis.'],
      ['Talus', 'talus_r', 'No muscles attach to the talus. It transmits weight from the leg to the foot and its blood supply is retrograde, so talar neck fractures risk avascular necrosis.'],
      ['Calcaneus', 'calcaneus_r', 'The heel bone: the Achilles tendon inserts behind and the plantar fascia attaches beneath. Intra-articular calcaneal fractures cause lasting heel pain and loss of height.'],
      ['Achilles tendon', 'achilles_r', 'The thickest tendon in the body, formed by gastrocnemius and soleus. Ruptures typically occur 2–6 cm above the insertion, in the zone of poor blood supply.'],
      ['Tibialis posterior', 'tibpost_r', 'The main dynamic support of the medial arch. Failure leads to adult flatfoot deformity.'],
      ['Plantar ligaments', 'plantar_lig_r', 'The long plantar ligament and plantar fascia hold the arches, working like a bowstring during walking.'],
      ['Tibial arteries', 'tibial_art_r', 'The anterior and posterior tibial arteries supply the leg and foot; the posterior tibial pulse is felt behind the medial malleolus.']] },
    { t: 'Spine & spinal cord', d: 'Vertebrae, curves, the cord and the muscles of the back.', layers: ['skeleton', 'muscles', 'nerves'], steps: [
      ['Cervical spine', 'cervical', 'Seven vertebrae with the greatest mobility. C1 and C2 are specialised for nodding and rotation; the vertebral arteries run through the transverse foramina.'],
      ['Thoracic spine', 'thoracic', 'Twelve vertebrae that articulate with the ribs, giving a stiff, protective segment with a gentle kyphosis.'],
      ['Lumbar spine', 'lumbar', 'Five large vertebrae carrying most of the body weight. L4–L5 and L5–S1 are the commonest levels of disc prolapse.'],
      ['Sacrum', 'sacrum', 'Five fused vertebrae wedged between the iliac bones at the sacroiliac joints, transferring load from the spine to the pelvis.'],
      ['Spinal cord & cauda equina', 'spinalcord', 'The cord ends at about L1–L2. Below it the nerve roots run as the cauda equina; compression there is a surgical emergency.'],
      ['Erector spinae', 'erectorspinae_r', 'The long extensors of the spine, working with the deep multifidus and the abdominal muscles to stabilise the trunk.']] },
    { t: 'Nerves of the arm & injury patterns', d: 'Which nerve, which finding — the logic of upper limb nerve injuries.', layers: ['skeleton', 'nerves'], steps: [
      ['Brachial plexus', 'brachplex_r', 'Roots C5–C8 and T1 form trunks, divisions, cords and branches. Upper plexus injuries (Erb) give “waiter’s tip”; lower plexus injuries (Klumpke) affect the hand.'],
      ['Musculocutaneous nerve', 'musculocutaneous_r', 'Supplies biceps and brachialis; injury weakens elbow flexion and supination and numbs the lateral forearm.'],
      ['Radial nerve', 'radial_r', 'Runs in the spiral groove of the humerus, so mid-shaft humeral fractures can cause wrist drop (loss of extension) while sparing sensation to most of the hand.'],
      ['Median nerve', 'median_r', 'Injury at the elbow or forearm weakens pronation and the long flexors (the “hand of benediction”); at the wrist it affects the thumb muscles and sensation.'],
      ['Ulnar nerve', 'ulnar_r', 'Compressed at the elbow (cubital tunnel) it causes tingling in the ring and little fingers and later a claw hand with intrinsic wasting.']] },
    { t: 'Blood supply of the limbs', d: 'Arteries, veins and the muscle pump.', layers: ['skeleton', 'arteries', 'veins'], steps: [
      ['Aorta', 'aorta', 'The aorta arches over the heart and descends in front of the spine, giving off branches to the limbs and trunk.'],
      ['Upper limb arteries', 'subclav_art_r', 'The subclavian becomes the axillary and then the brachial artery, which divides at the elbow into the radial and ulnar arteries.'],
      ['Femoral & popliteal arteries', 'femoral_art_r', 'The femoral artery passes through the adductor canal and becomes the popliteal artery behind the knee — vulnerable in knee dislocations.'],
      ['Tibial arteries', 'tibial_art_r', 'The popliteal artery divides into the anterior and posterior tibial arteries; the dorsalis pedis pulse is the continuation of the anterior tibial.'],
      ['Great saphenous vein', 'saphenous_r', 'The longest vein in the body, running along the medial leg and thigh — a common site of varicose veins and a conduit for bypass grafts.'],
      ['Deep calf veins', 'calfpump_r', 'The calf muscle pump drives blood upward against gravity; immobilisation after surgery or injury raises the risk of deep vein thrombosis.']] },
  ];
  const tourOK = TOURS.map(t => ({ ...t, steps: t.steps.filter(s => idOfSide(s[1])) }));
  let tour = null, ti = 0;
  function renderTours() {
    body.innerHTML = `<p>Guided walk-throughs of the regions orthopaedic surgeons see every day. Each step highlights a structure on the 3D model.</p>` + tourOK.map((t, i) => `<button class="card" data-i="${i}"><b>${esc(t.t)}</b><span>${esc(t.d)} · ${t.steps.length} steps</span></button>`).join('');
    $$('.card', body).forEach(c => c.onclick = () => startTour(+c.dataset.i));
  }
  function startTour(i) { tour = tourOK[i]; ti = 0; layersOnly(tour.layers); showStep(); }
  function showStep() {
    const s = tour.steps[ti]; const id = idOfSide(s[1]); const d = STRUCTURES[id]; layerOn(d.layer);
    A.select(id);                                         // opens detail panel + camera focus
    body.innerHTML = `<div class="step-n">${esc(tour.t)} · step ${ti + 1} of ${tour.steps.length}</div><div class="bar"><i style="width:${(ti + 1) / tour.steps.length * 100}%"></i></div><h3>${esc(s[0])}</h3><p>${esc(s[2])}</p>
      <p style="font-size:.78rem;color:#93A4C0">Showing: ${esc(clean(d))}. Tap the model for any other structure, or open the detail panel for attachments and clinical notes.</p>
      <button class="btn g" id="tPrev"${ti === 0 ? ' disabled style="opacity:.4"' : ''}>← Back</button><button class="btn" id="tNext">${ti === tour.steps.length - 1 ? 'Finish' : 'Next →'}</button><button class="btn g" id="tAll">All tours</button>`;
    $('#tPrev').onclick = () => { if (ti > 0) { ti--; showStep(); } }; $('#tNext').onclick = () => { if (ti < tour.steps.length - 1) { ti++; showStep(); } else { A.deselect(); renderTours(); } }; $('#tAll').onclick = () => { A.deselect(); renderTours(); };
  }

  /* ───────── CONTENTS ───────── */
  const hidden = new Set();
  function setHidden(b, on) { ['_l', '_r', ''].forEach(sfx => { const d = STRUCTURES[b + sfx]; if (d && d.object) d.object.visible = !on; }); on ? hidden.add(b) : hidden.delete(b); }
  function renderContents(filter) {
    const f = (filter || '').toLowerCase(); const seen = {};
    const items = LAYERS.map(L => ({ L, list: Object.values(STRUCTURES).filter(d => d.layer === L.id && !/_l$/.test(d.id)).filter(d => !f || clean(d).toLowerCase().includes(f) || (d.latin || '').toLowerCase().includes(f)).sort((a, b) => clean(a).localeCompare(clean(b))) })).filter(g => g.list.length);
    body.innerHTML = `<input type="search" id="cf" placeholder="Filter ${Object.keys(STRUCTURES).length} structures…" value="${esc(filter || '')}">` + items.map(g => `<div class="grp">${esc(g.L.name)} · ${g.list.length}</div>` + g.list.map(d => `<div class="row${hidden.has(baseId(d.id)) ? ' hid' : ''}" data-id="${d.id}"><span class="nm">${esc(clean(d))}</span><span class="eye" data-eye="${baseId(d.id)}" title="Show / hide"><i class="fas fa-eye${hidden.has(baseId(d.id)) ? '-slash' : ''}"></i></span></div>`).join('')).join('') || '<p>No match.</p>';
    const cf = $('#cf'); cf.oninput = () => { renderContents(cf.value); const n = $('#cf'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
    body.onclick = e => { const eye = e.target.closest('.eye'); if (eye) { const b = eye.dataset.eye; setHidden(b, !hidden.has(b)); renderContents($('#cf').value); return; } const row = e.target.closest('.row'); if (row) { layerOn(STRUCTURES[row.dataset.id].layer); A.select(row.dataset.id); } };
  }

  /* ───────── QUIZ ───────── */
  const Q = { on: false, set: ['skeleton'], mode: 'name', list: [], i: 0, score: 0, streak: 0, miss: [], answered: false, cur: null };
  const SETS = { skeleton: 'Bones', muscles: 'Muscles', nerves: 'Nerves', arteries: 'Arteries', tendons: 'Ligaments', veins: 'Veins' };
  function renderQuizHome() {
    const best = ls.get('anatQuizBest');
    body.innerHTML = `<p>Test yourself. <b>Name it</b> highlights a structure and you pick its name; <b>Find it</b> names a structure and you tap it on the model.</p>
      <div class="grp">Topic</div><div class="sel" id="qSet">${Object.entries(SETS).map(([k, v]) => `<button data-k="${k}" class="${Q.set.includes(k) ? 'on' : ''}">${v}</button>`).join('')}</div>
      <div class="grp">Mode</div><div class="sel" id="qMode"><button data-k="name" class="${Q.mode === 'name' ? 'on' : ''}">Name it</button><button data-k="find" class="${Q.mode === 'find' ? 'on' : ''}">Find it</button></div>
      <button class="btn" id="qGo">Start (10 questions)</button>${best ? `<p style="margin-top:12px;color:#93A4C0">Best score: ${esc(best)}</p>` : ''}`;
    $('#qSet').onclick = e => { const b = e.target.closest('button'); if (!b) return; const k = b.dataset.k; Q.set = Q.set.includes(k) ? (Q.set.length > 1 ? Q.set.filter(x => x !== k) : Q.set) : Q.set.concat(k); renderQuizHome(); };
    $('#qMode').onclick = e => { const b = e.target.closest('button'); if (!b) return; Q.mode = b.dataset.k; renderQuizHome(); };
    $('#qGo').onclick = quizStart;
  }
  function pool() { return Object.values(STRUCTURES).filter(d => Q.set.includes(d.layer) && !/_r$/.test(d.id) && STRUCTURES[d.id].object); }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function quizStart() { const p = pool(); if (p.length < 4) return; Q.on = true; Q.list = shuffle(p.slice()).slice(0, 10); Q.i = 0; Q.score = 0; Q.streak = 0; Q.miss = []; layersOnly(Q.set); A.deselect(); window.__anatomyIntercept = quizIntercept; nextQ(); }
  function quizStop() { if (Q.on) { Q.on = false; A.paint && Q.cur && A.paint(Q.cur.id, false); } window.__anatomyIntercept = null; }
  function sideId(d) { return STRUCTURES[baseId(d.id) + '_r'] ? baseId(d.id) + '_r' : d.id; }
  function nextQ() {
    if (Q.i >= Q.list.length) return quizEnd(); Q.answered = false; Q.cur = Q.list[Q.i]; const d = Q.cur; const sid = sideId(d);
    A.paint && A.paint(Q.cur.id, false);
    const head = `<div class="step-n">Question ${Q.i + 1} of ${Q.list.length} · Score ${Q.score}${Q.streak > 1 ? ' · 🔥 ' + Q.streak : ''}</div><div class="bar"><i style="width:${Q.i / Q.list.length * 100}%"></i></div>`;
    if (Q.mode === 'name') {
      focusOn(STRUCTURES[sid].focus, 170); A.paint(sid, true);
      const wrong = shuffle(pool().filter(x => x.id !== d.id && x.layer === d.layer && clean(x) !== clean(d))).slice(0, 3); const opts = shuffle([d].concat(wrong));
      body.innerHTML = head + `<h3>What is the highlighted structure?</h3>` + opts.map(o => `<button class="opt" data-id="${o.id}">${esc(clean(o))}</button>`).join('') + `<div id="qfb"></div>`;
      $$('.opt', body).forEach(b => b.onclick = () => answer(b.dataset.id === d.id, b));
    } else {
      body.innerHTML = head + `<h3>Find: ${esc(clean(d))}</h3><p>Tap it on the model. <span style="color:#93A4C0">${esc(d.latin || '')}</span></p><div id="qfb"></div><button class="btn g" id="qSkip">Skip</button>`;
      $('#qSkip').onclick = () => answer(false, null, true);
    }
  }
  function quizIntercept(id) { if (!Q.on || Q.mode !== 'find') return false; if (Q.answered) return true; answer(baseId(id) === baseId(Q.cur.id), null, false, id); return true; }
  function answer(ok, btn, skipped, clicked) {
    if (Q.answered) return; Q.answered = true; const d = Q.cur; const sid = sideId(d);
    if (ok) { Q.score++; Q.streak++; } else { Q.streak = 0; Q.miss.push(d); }
    if (btn) { $$('.opt', body).forEach(b => { if (b.dataset.id === d.id) b.classList.add('ok'); }); if (!ok) btn.classList.add('no'); }
    A.paint(sid, true); if (Q.mode === 'find' && !ok) focusOn(STRUCTURES[sid].focus, 170);
    const first = (d.overview || '').split('. ')[0] + '.';
    $('#qfb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}"><b>${ok ? 'Correct!' : (skipped ? 'Skipped' : 'Not quite')}</b> ${ok ? '' : (clicked && STRUCTURES[clicked] ? 'You tapped ' + esc(clean(STRUCTURES[clicked])) + '. ' : '')}It is the <b>${esc(clean(d))}</b>. ${esc(first)}</div><button class="btn" id="qNext">${Q.i + 1 >= Q.list.length ? 'See results' : 'Next →'}</button>`;
    $('#qNext').onclick = () => { A.paint(sid, false); Q.i++; nextQ(); };
  }
  function quizEnd() {
    A.paint && Q.cur && A.paint(sideId(Q.cur), false); Q.on = false; window.__anatomyIntercept = null;
    const s = `${Q.score}/${Q.list.length}`; const prev = ls.get('anatQuizBest'); if (!prev || Q.score > parseInt(prev)) ls.set('anatQuizBest', s);
    body.innerHTML = `<h3>${Q.score >= 9 ? 'Outstanding! 🎉' : Q.score >= 6 ? 'Well done 👍' : 'Keep practising 💪'}</h3><p style="font-size:1.4rem;font-weight:800;color:#2DD4BF">${s}</p>` +
      (Q.miss.length ? `<div class="grp">Review these</div>` + Q.miss.map(d => `<div class="row" data-id="${sideId(d)}"><span class="nm">${esc(clean(d))}</span></div>`).join('') : '<p>No misses — perfect run!</p>') + `<button class="btn" id="qAgain">Play again</button><button class="btn g" id="qHome">Change topic</button>`;
    $('#qAgain').onclick = quizStart; $('#qHome').onclick = renderQuizHome;
    body.onclick = e => { const r = e.target.closest('.row'); if (r) { layerOn(STRUCTURES[r.dataset.id].layer); A.select(r.dataset.id); } };
  }

  /* ───────── TOOLS: focus ghost, isolate, cross-section, explode ───────── */
  const tools = document.createElement('div'); tools.id = 'tools';
  tools.innerHTML = `<h5>View tools</h5>
    <label><input type="checkbox" id="tGhost"> Ghost everything except the selected structure</label>
    <label><input type="checkbox" id="tIso"> Isolate selected structure (hide the rest)</label><hr>
    <h5>Cross-section</h5><div class="ax" id="tAx"><button data-a="y" class="on">Axial</button><button data-a="z">Coronal</button><button data-a="x">Sagittal</button></div>
    <label><input type="checkbox" id="tClip"> Enable cut</label><input type="range" id="tClipS" min="0" max="100" value="50"><label><input type="checkbox" id="tFlip"> Flip side</label><hr>
    <h5>Explode</h5><input type="range" id="tExp" min="0" max="100" value="0"><label style="margin-top:10px"><button class="btn g" id="tReset" style="margin:0;background:rgba(255,255,255,.1);color:#E8EDF6;border:0;border-radius:8px;padding:7px 12px;cursor:pointer;font:700 .76rem Inter,sans-serif">Reset tools</button></label>`;
  stage.appendChild(tools);
  bTools.onclick = () => { tools.classList.toggle('on'); if (tools.classList.contains('on')) lrn.classList.remove('on'); };
  const allMeshes = fn => Object.values(STRUCTURES).forEach(d => d.object && d.object.traverse(o => { if (o.isMesh && o.material) fn(o, d); }));
  /* ghost + per-layer transparency share one opacity pass */
  let ghostOn = false; const layerOp = {};
  function applyGhost() {
    const sel = A.getSelected && A.getSelected();
    allMeshes((m, d) => {
      const mat = m.material; if (!mat.userData) mat.userData = {}; if (mat.userData._g === undefined) mat.userData._g = { t: mat.transparent, o: mat.opacity, w: mat.depthWrite };
      const f = (ghostOn && sel && d.id !== sel ? 0.08 : 1) * (layerOp[d.layer] == null ? 1 : layerOp[d.layer]);
      if (f < 0.999) { mat.transparent = true; mat.opacity = mat.userData._g.o * f; mat.depthWrite = f > 0.6 && mat.userData._g.w; } else { mat.transparent = mat.userData._g.t; mat.opacity = mat.userData._g.o; mat.depthWrite = mat.userData._g.w; }
      mat.needsUpdate = true;
    });
  }
  $('#tGhost').onchange = e => { ghostOn = e.target.checked; applyGhost(); };
  /* layer transparency control (added to the Body Systems rail) */
  (function () {
    const rail = $('#rail'); if (!rail) return; const box = document.createElement('div'); box.className = 'rail-sub';
    box.innerHTML = '<label>Layer transparency</label><select id="lyrSel" style="width:100%;background:rgba(255,255,255,.07);color:#E8EDF6;border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:5px;margin-bottom:6px">' + LAYERS.map(L => '<option value="' + L.id + '">' + L.name + '</option>').join('') + '</select><input type="range" id="lyrOp" min="5" max="100" value="100" style="width:100%;accent-color:#2DD4BF">';
    rail.appendChild(box);
    const sel = $('#lyrSel', box), rg = $('#lyrOp', box);
    sel.onchange = () => { rg.value = Math.round((layerOp[sel.value] == null ? 1 : layerOp[sel.value]) * 100); };
    rg.oninput = () => { layerOp[sel.value] = +rg.value / 100; applyGhost(); };
  })();
  /* isolate */
  let isoOn = false;
  function applyIso() { const sel = A.getSelected && A.getSelected(); Object.values(STRUCTURES).forEach(d => { if (d.object) d.object.visible = isoOn && sel ? d.id === sel : !hidden.has(baseId(d.id)); }); }
  $('#tIso').onchange = e => { isoOn = e.target.checked; applyIso(); };
  /* re-apply when the selection changes or the panel closes */
  window.__anatomyOnSelect = (d, id) => { applyGhost(); applyIso(); addReadMore(d, id); };
  new MutationObserver(() => { if (!$('#panel').classList.contains('open')) { applyGhost(); applyIso(); } }).observe($('#panel'), { attributes: true, attributeFilter: ['class'] });
  /* cross-section */
  const RANGE = { y: [0, 185], z: [-30, 30], x: [-70, 70] };
  let axis = 'y', clipOn = false, dbl = false; const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 90);
  function applyClip() {
    const sgn = $('#tFlip').checked ? -1 : 1; const [lo, hi] = RANGE[axis]; const v = lo + (hi - lo) * (+$('#tClipS').value / 100);
    plane.normal.set(axis === 'x' ? -sgn : 0, axis === 'y' ? -sgn : 0, axis === 'z' ? -sgn : 0); plane.constant = sgn * v;
    renderer.clippingPlanes = clipOn ? [plane] : [];
    if (clipOn !== dbl) { allMeshes(m => { if (m.userData.isOutline) return; const mat = m.material; if (mat.userData._side === undefined) mat.userData._side = mat.side; mat.side = clipOn ? THREE.DoubleSide : mat.userData._side; mat.needsUpdate = true; }); dbl = clipOn; }
  }
  $('#tClip').onchange = e => { clipOn = e.target.checked; applyClip(); }; $('#tClipS').oninput = applyClip; $('#tFlip').onchange = applyClip;
  $('#tAx').onclick = e => { const b = e.target.closest('button'); if (!b) return; axis = b.dataset.a; $$('#tAx button').forEach(x => x.classList.toggle('on', x === b)); applyClip(); };
  /* explode */
  const LAYER_K = { skeleton: .55, tendons: .8, muscles: 1.0, arteries: 1.25, veins: 1.35, nerves: 1.5, lymphatics: 1.7 }; let expBase = null;
  function applyExplode() {
    const amt = +$('#tExp').value; const centre = new THREE.Vector3(0, 96, 0);
    if (!expBase) { expBase = new Map(); Object.values(STRUCTURES).forEach(d => { if (!d.object) return; const box = new THREE.Box3().setFromObject(d.object); const c = box.getCenter(new THREE.Vector3()); const dir = c.clone().sub(centre); dir.y *= .5; if (dir.length() < 1) dir.set(0, 1, 0); expBase.set(d.id, { p: d.object.position.clone(), dir: dir.normalize() }); }); }
    Object.values(STRUCTURES).forEach(d => { const b = expBase.get(d.id); if (b) d.object.position.copy(b.p).addScaledVector(b.dir, amt * .45 * (LAYER_K[d.layer] || 1)); });
    if (amt > 0) A.deselect();
  }
  $('#tExp').oninput = applyExplode;
  $('#tReset').onclick = () => { $('#tGhost').checked = $('#tIso').checked = $('#tClip').checked = $('#tFlip').checked = false; $('#tExp').value = 0; $('#tClipS').value = 50; ghostOn = isoOn = clipOn = false; hidden.clear(); applyGhost(); applyIso(); applyClip(); applyExplode(); };

  /* ───────── "Read more" tab in the detail panel ───────── */
  let REGIONS = {}; fetch('anatomy-regions.json').then(r => r.json()).then(j => REGIONS = j).catch(() => { });
  const GUIDES = [
    [/supraspinatus|infraspinatus|subscapularis|teresminor|rotator/i, [['rotator-cuff-tear.html', 'Rotator cuff tear: symptoms, treatment & recovery'], ['frozen-shoulder.html', 'Frozen shoulder']]], [/deltoid|humerus|scapula|clavicle|axillary_n|brachplex/i, [['shoulder-conditions.html', 'Shoulder conditions hub'], ['shoulder-replacement.html', 'Shoulder replacement']]],
    [/median|flexret|scaphoid|lunate|capitate|hamate|carpal|hand_/i, [['carpal-tunnel-syndrome.html', 'Carpal tunnel syndrome'], ['deck-hand-wrist-injuries.html', 'Hand & wrist injuries — illustrated slides']]], [/extensorgroup|brachioradialis|radial_(l|r)$|extret/i, [['tennis-elbow-treatment.html', 'Tennis elbow']]],
    [/lumbar|cervical$|thoracic|spinalcord|erectorspinae|sacrum/i, [['back-pain-guide.html', 'Back pain guide'], ['sciatica-slipped-disc.html', 'Sciatica & slipped disc'], ['cervical-spondylosis-neck-pain.html', 'Neck pain'], ['scoliosis-in-adolescents.html', 'Scoliosis']]], [/sciatic|gluteal/i, [['sciatica-slipped-disc.html', 'Sciatica & slipped disc']]],
    [/pelvis|psoas|gluteus|hiprotators|femoral_art|profunda_femoris/i, [['hip-fracture-elderly.html', 'Hip fracture in older adults'], ['hip-replacement-recovery.html', 'Hip replacement recovery']]], [/^femur/i, [['hip-fracture-elderly.html', 'Hip fracture in older adults'], ['fracture-healing.html', 'How broken bones heal']]],
    [/patella|quadriceps|hamstrings|popliteus|quad_tendon|patellar_lig|femoral_n/i, [['knee-osteoarthritis-non-surgical-treatment.html', 'Knee osteoarthritis'], ['acl-injury-reconstruction-guide.html', 'ACL injury'], ['meniscus-tear-knee.html', 'Meniscus tear'], ['knee-replacement.html', 'Knee replacement']]],
    [/tibia|fibula|talus|calcaneus|achilles|plantar|foot_|tibant|tibpost|peroneal|gastroc/i, [['ankle-sprain-fracture-recovery.html', 'Ankle sprain vs fracture'], ['plantar-fasciitis-heel-pain.html', 'Plantar fasciitis'], ['deck-calcaneum-fractures.html', 'Calcaneum fractures — slides']]], [/vitamin|osteopor/i, [['osteoporosis.html', 'Osteoporosis']]],
  ];
  function addReadMore(d, id) {
    const links = []; const seen = new Set(); const add = l => { if (!seen.has(l[0])) { seen.add(l[0]); links.push(l); } };
    const reg = REGIONS[baseId(id)]; if (reg) add([reg.file + '#' + baseId(id), 'Full anatomy page: ' + reg.title]);
    GUIDES.forEach(g => { if (g[0].test(id) || g[0].test(d.name)) g[1].forEach(add); });
    add(['conditions.html', 'Orthopaedic conditions A–Z']); add(['glossary.html', 'Glossary of terms']);
    const tabs = $('#pnTabs'), pb = $('#pnBody'); if (!tabs || !pb || $('[data-k="more"]', tabs)) return;
    const t = document.createElement('button'); t.className = 'pn-tab'; t.dataset.k = 'more'; t.textContent = 'Read more'; tabs.appendChild(t);
    const p = document.createElement('div'); p.className = 'pn-pane'; p.dataset.k = 'more'; p.innerHTML = `<h4>Related guides on OrthoChronicles</h4><div class="rm">${links.map(l => `<a href="${l[0]}" target="_blank" rel="noopener">${esc(l[1])}<small>orthochronicles.info/${l[0]}</small></a>`).join('')}</div><h4>Test yourself</h4><button class="btn" id="qThis" style="background:#2DD4BF;color:#04201c;border:0;border-radius:10px;padding:9px 14px;font:800 .82rem Inter,sans-serif;cursor:pointer">Quiz me on ${esc(d.layer === 'skeleton' ? 'bones' : d.layer)}</button>`; pb.appendChild(p);
    const q = $('#qThis', p); if (q) q.onclick = () => { Q.set = [d.layer]; Q.mode = 'name'; openLearn('quiz'); };
  }

  /* ───────── deep link  anatomy.html#s=supraspinatus_l ───────── */
  function deepLink() {
    const m = /[#&?]s=([a-z0-9_]+)/i.exec(location.hash + location.search); if (!m) return;
    const id = idOfSide(m[1]) || (STRUCTURES[m[1]] ? m[1] : null); if (!id) return;
    layerOn(STRUCTURES[id].layer); setTimeout(() => A.select(id), 700);
  }
  setTimeout(deepLink, 900);
})();
