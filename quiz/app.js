/* OrthoQuiz — limb-wise orthopaedic MCQs, one-liners, matching, labelling and image questions with spaced repetition. */
'use strict';
const REG = [
  { id: 'shoulder', n: 'Shoulder & Arm', e: '🦾', g: 'Upper limb' }, { id: 'elbow', n: 'Elbow & Forearm', e: '💪', g: 'Upper limb' }, { id: 'wrist', n: 'Wrist & Hand', e: '🖐️', g: 'Upper limb' },
  { id: 'spine', n: 'Spine', e: '🧬', g: 'Spine' },
  { id: 'hip', n: 'Pelvis & Hip', e: '🦴', g: 'Lower limb' }, { id: 'knee', n: 'Thigh & Knee', e: '🦵', g: 'Lower limb' }, { id: 'foot', n: 'Leg, Ankle & Foot', e: '🦶', g: 'Lower limb' },
  { id: 'general', n: 'General Orthopaedics', e: '📚', g: 'General' }];
const RN = Object.fromEntries(REG.map(r => [r.id, r.n]));
const TYPES = [['mcq', 'MCQ'], ['one', 'One-liner'], ['match', 'Match'], ['occ', 'Labelling'], ['ident', 'Identify']];
const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const today = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const toast = (m, ms = 1800) => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), ms); };
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const shuffle = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ───────── storage (IndexedDB with localStorage fallback) ───────── */
const DB = {
  db: null, mem: { cards: {}, kv: {} }, ok: false,
  async open() {
    try {
      this.db = await new Promise((res, rej) => { const r = indexedDB.open('orthoquiz', 1); r.onupgradeneeded = () => { r.result.createObjectStore('cards', { keyPath: 'id' }); r.result.createObjectStore('kv'); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
      this.ok = true;
    } catch (e) { this.ok = false; try { this.mem = JSON.parse(localStorage.getItem('oq_mem')) || this.mem; } catch (_) { } }
  },
  tx(store, mode) { return this.db.transaction(store, mode).objectStore(store); },
  async all(store) { if (!this.ok) return Object.values(this.mem[store] || {}); return new Promise(res => { const r = this.tx(store, 'readonly').getAll(); r.onsuccess = () => res(r.result); r.onerror = () => res([]); }); },
  async get(k) { if (!this.ok) return this.mem.kv[k]; return new Promise(res => { const r = this.tx('kv', 'readonly').get(k); r.onsuccess = () => res(r.result); r.onerror = () => res(undefined); }); },
  put(store, v, k) { if (!this.ok) { if (store === 'cards') this.mem.cards[v.id] = v; else this.mem.kv[k] = v; try { localStorage.setItem('oq_mem', JSON.stringify(this.mem)); } catch (e) { } return; } try { store === 'cards' ? this.tx(store, 'readwrite').put(v) : this.tx(store, 'readwrite').put(v, k); } catch (e) { } },
  async clear() { if (!this.ok) { this.mem = { cards: {}, kv: {} }; localStorage.removeItem('oq_mem'); return; } for (const s of ['cards', 'kv']) this.tx(s, 'readwrite').clear(); }
};

/* ───────── spaced repetition (SM-2 style, Anki-like ratings) ───────── */
const DAY = 864e5;
const SRS = {
  card(id) { return S.cards.get(id) || { id, ease: 2.5, ivl: 0, due: 0, reps: 0, lapses: 0, seen: 0, right: 0, wrong: 0, flag: 0, last: 0 }; },
  rate(id, rating) {                                                // 0 again · 1 hard · 2 good · 3 easy
    const c = this.card(id); const now = Date.now(); c.seen++; c.last = now; if (rating === 0) { c.wrong++; c.lapses++; c.reps = 0; c.ivl = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = now + 10 * 60000; }
    else { c.right++; c.reps++; if (rating === 1) { c.ease = Math.max(1.3, c.ease - 0.15); c.ivl = c.ivl ? Math.max(1, c.ivl * 1.2) : 1; } else if (rating === 2) { c.ivl = c.reps === 1 ? 1 : c.reps === 2 ? 3 : Math.round(c.ivl * c.ease); } else { c.ease += 0.15; c.ivl = c.reps === 1 ? 4 : Math.round(Math.max(c.ivl, 3) * c.ease * 1.3); } c.due = now + c.ivl * DAY; }
    S.cards.set(id, c); DB.put('cards', c); return c;
  },
  toggleFlag(id) { const c = this.card(id); c.flag = c.flag ? 0 : 1; S.cards.set(id, c); DB.put('cards', c); return c.flag; }
};

/* ───────── state ───────── */
const S = { cards: new Map(), kv: { size: 10, theme: 'light', daily: 5, types: ['mcq', 'one', 'match', 'occ', 'ident'], tier: 'high', days: {}, dailyDone: {} }, bank: [], byId: new Map(), meta: null, books: {}, view: 'home', sess: null, sel: { regions: [], size: 10, types: null, tier: 'high', books: [], mode: 'mixed' } };
const saveKV = () => { DB.put('kv', S.kv, 'settings'); };

/* ───────── question bank ───────── */
async function loadBank(onProgress) {
  const J = async f => { try { const r = await fetch('data/' + f); return r.ok ? await r.json() : []; } catch (e) { return []; } };
  S.meta = await J('meta.json'); S.books = S.meta.books || {};
  const files = [...REG.map(r => 'facts-' + r.id + '.json'), 'curated-mcq.json', 'practice.json', 'curated-match.json', 'match.json', 'ident.json', 'occ.json']; const out = {};
  for (let i = 0; i < files.length; i++) { out[files[i]] = await J(files[i]); onProgress && onProgress((i + 1) / files.length); }
  const B = [];
  REG.forEach(r => (out['facts-' + r.id + '.json'] || []).forEach(f => B.push({ id: f.i, kind: 'fact', r: f.r, tier: f.t, src: [[f.b, f.p], ...(f.x || [])], f })));
  (out['curated-mcq.json'] || []).forEach(q => B.push({ id: q.i, kind: 'cmcq', r: q.r, tier: 0, src: q.src, f: q }));
  (out['practice.json'] || []).forEach(q => B.push({ id: q.i, kind: 'cmcq', r: q.r, tier: 0, src: q.src, f: q }));
  (out['curated-match.json'] || []).forEach(m => B.push({ id: m.i, kind: 'cmatch', r: m.r, tier: 0, src: m.src, f: m }));
  (out['match.json'] || []).forEach(m => B.push({ id: m.i, kind: 'match', r: m.r, tier: 1, src: m.src, f: m }));
  (out['ident.json'] || []).forEach(x => B.push({ id: x.i, kind: 'ident', r: x.r, tier: 1, src: [[x.b, x.p]], f: x }));
  (out['occ.json'] || []).forEach(x => B.push({ id: x.i, kind: 'occ', r: x.r, tier: 1, src: [[x.b, x.p]], f: x }));
  S.bank = B; S.byId = new Map(B.map(b => [b.id, b]));
}
const fmtsOf = b => b.kind === 'fact' ? (b.f.o ? ['mcq', 'one'] : ['one']) : b.kind === 'cmcq' ? ['mcq'] : b.kind === 'cmatch' || b.kind === 'match' ? ['match'] : b.kind === 'ident' ? ['ident'] : ['occ'];
const typeOf = fmt => fmt;

/* ───────── session building ───────── */
function weightOf(b) { const c = S.cards.get(b.id); if (!c) return 1; const now = Date.now(); if (c.flag) return 5; let w = 0.18; if (c.due <= now) w = 3 + Math.min(5, (now - c.due) / DAY * 0.5); if (c.wrong > c.right) w += 2; return w; }
function pickItems(o, rand = Math.random) {
  const types = o.types || S.kv.types; const tier = o.tier || 'high'; const regs = o.regions && o.regions.length ? o.regions : null; const books = o.books && o.books.length ? o.books : null;
  const pools = {}; types.forEach(t => (pools[t] = []));
  for (const b of S.bank) {
    if (o.only === 'practice' && !(b.f && b.f.sec && (!o.sec || b.f.sec === o.sec))) continue; if (regs && !regs.includes(b.r)) continue; if (tier === 'high' && b.tier > 1) continue; if (books && !b.src.some(s => books.includes(s[0])) && b.kind !== 'cmcq' && b.kind !== 'cmatch') continue;
    const c = S.cards.get(b.id); if (c && c.sus) continue; if (o.mode === 'due' && !(c && c.due <= Date.now())) continue; if (o.mode === 'new' && c) continue; if (o.mode === 'weak' && !(c && c.wrong > c.right)) continue; if (o.mode === 'flagged' && !(c && c.flag)) continue;
    for (const fmt of fmtsOf(b)) if (pools[fmt]) { pools[fmt].push({ b, fmt, k: Math.pow(rand(), 1 / weightOf(b)) }); break; }   // an item appears once, in its first enabled format
  }
  // an item that supports both mcq and one-liner goes to whichever is enabled; if both, pick randomly
  if (types.includes('mcq') && types.includes('one')) { const moved = []; pools.mcq = pools.mcq.filter(x => { if (x.b.kind === 'fact' && rand() < 0.4) { moved.push({ ...x, fmt: 'one' }); return false; } return true; }); pools.one.push(...moved); }
  Object.values(pools).forEach(p => p.sort((a, b) => b.k - a.k));
  const W = { mcq: 0.36, one: 0.24, match: 0.08, occ: 0.17, ident: 0.15 }; const out = []; const used = new Set();
  while (out.length < o.size) {
    const avail = types.filter(t => pools[t] && pools[t].length); if (!avail.length) break; const tot = avail.reduce((s, t) => s + W[t], 0); let r = rand() * tot, ty = avail[0]; for (const t of avail) { r -= W[t]; if (r <= 0) { ty = t; break; } }
    const it = pools[ty].shift(); if (used.has(it.b.id)) continue; used.add(it.b.id); out.push(it);
  }
  return shuffle(out, rand);
}
function startSession(items, meta) { if (!items.length) { toast('No questions match those filters yet'); return; } S.sess = { items: items.map(x => ({ ...x, res: null })), i: 0, score: 0, meta: meta || {}, t0: Date.now(), flash: !!(meta && meta.flash) }; S.view = 'quiz'; render(); }

/* ───────── UI helpers ───────── */
const srcChips = b => '<div class="src">' + b.src.slice(0, 3).map(s => `<span>📖 ${esc(S.books[s[0]] || s[0])} · p.${s[1]}</span>`).join('') + '</div>';
const stemHtml = f => esc(f.q).replace(/____/g, '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
const ctxHtml = f => { let c = esc(f.c || ''); const a = esc(f.a || ''); if (a && c.includes(a)) c = c.replace(a, '<b>' + a + '</b>'); return c; };
const ring = (pct, size = 118, stroke = 11, col = '#fff', bg = 'rgba(255,255,255,.28)') => { const r = (size - stroke) / 2, c = 2 * Math.PI * r; return `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, pct))}"/></svg>`; };
function streak() { const d = S.kv.days; let n = 0; const dt = new Date(); if (!(d[today(dt)] && d[today(dt)].n >= 5)) dt.setDate(dt.getDate() - 1); while (d[today(dt)] && d[today(dt)].n >= 5) { n++; dt.setDate(dt.getDate() - 1); } return n; }
function dueCount() { const now = Date.now(); let n = 0; S.cards.forEach(c => { if (c.due && c.due <= now && S.byId.has(c.id)) n++; }); return n; }
function bump(correct) { const t = today(); const d = S.kv.days[t] || (S.kv.days[t] = { n: 0, c: 0 }); d.n++; if (correct) d.c++; saveKV(); }
function regionStats(rid) { const items = S.bank.filter(b => b.r === rid); let seen = 0, learned = 0, right = 0, wrong = 0; items.forEach(b => { const c = S.cards.get(b.id); if (c) { seen++; right += c.right; wrong += c.wrong; if (c.reps >= 2 && c.ivl >= 3) learned++; } }); return { total: items.length, seen, learned, acc: right + wrong ? right / (right + wrong) : null }; }

/* ───────── views ───────── */
function weekStrip() {
  const names = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; const now = new Date(); now.setHours(0, 0, 0, 0); const start = new Date(now); start.setDate(now.getDate() - now.getDay()); let h = '';
  for (let k = 0; k < 7; k++) { const d = new Date(start); d.setDate(start.getDate() + k); const key = today(d), rec = S.kv.days[key]; const cls = (key === today() ? ' on' : '') + (d > now ? ' fut' : '');
    h += '<div class="wd' + cls + '">' + names[k] + '<b>' + d.getDate() + '</b>' + (rec && rec.n ? '<span class="dot"></span>' : '') + '</div>'; }
  return h;
}
function confetti() {
  const box = document.createElement('div'); box.className = 'confetti'; const cols = ['#7C3AED', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#F97316'];
  for (let i = 0; i < 70; i++) { const e = document.createElement('i'); e.style.left = Math.random() * 100 + 'vw'; e.style.background = cols[i % cols.length]; e.style.animationDuration = 1.8 + Math.random() * 1.8 + 's'; e.style.animationDelay = Math.random() * .5 + 's'; e.style.transform = 'rotate(' + Math.random() * 360 + 'deg)'; box.appendChild(e); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 4200);
}
function render() {
  const el = $('#app'), hd = $('#hdr'); document.documentElement.dataset.theme = S.kv.theme; document.body.classList.toggle('qmode', S.view === 'quiz');
  const nav = (v, label) => { const [e, ...t] = label.split(' '); return '<button class="' + (S.view === v ? 'on' : '') + '" data-act="nav" data-v="' + v + '"><i>' + e + '</i><span>' + t.join(' ') + '</span></button>'; };
  const home = S.view === 'home'; const hr = new Date().getHours(); const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const head = '<div class="hdr' + (home ? ' home' : '') + '"><div class="hdr-in"><div class="top"><div class="brand"><span class="lg">🦴</span>OrthoQuiz</div><div class="sp"></div><span class="chip fire" title="Day streak"><b>🔥</b> ' + streak() + '</span><span class="chip due" title="Cards due for review" data-act="due">⏰ ' + dueCount() + ' due</span><button class="ibtn" data-act="theme" title="Theme">🌓</button></div>' +
    (home ? '<div class="hello"><small>' + greet + ', doctor 👋</small><b>Ready for today’s practice?</b></div><div class="week">' + weekStrip() + '</div>' : '') + '</div></div>';
  if (S.view === 'quiz') { hd.innerHTML = ''; el.innerHTML = quizView(); bindQuiz(); return; }
  hd.innerHTML = head;
  if (S.view === 'result') { el.innerHTML = resultView(); if (S.sess && S.sess.score / S.sess.items.length >= 0.7) confetti(); return; }
  const tabs = '<div class="tabs">' + nav('home', '🏠 Home') + nav('limbs', '🦴 Limbs') + nav('flash', '🃏 Cards') + nav('lib', '🔎 Library') + nav('stats', '📈 Progress') + nav('set', '⚙ Settings') + '</div>';
  const body = { home: homeView, limbs: limbsView, flash: flashView, lib: libView, stats: statsView, set: settingsView }[S.view]();
  el.innerHTML = tabs + body; if (S.view === 'lib') bindLib(); el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
}
function statTiles() {
  const t = today(), d = S.kv.days[t] || { n: 0, c: 0 }; let r = 0, w = 0; S.cards.forEach(c => { r += c.right || 0; w += c.wrong || 0; }); const acc = r + w ? Math.round(r / (r + w) * 100) : 0;
  return '<div class="tiles"><div class="tile t1"><i>🎯</i><b>' + d.n + '</b><span>answered today</span></div><div class="tile t2"><i>✅</i><b>' + acc + '%</b><span>overall accuracy</span></div><div class="tile t3"><i>⏰</i><b>' + dueCount() + '</b><span>cards due</span></div><div class="tile t4"><i>📚</i><b>' + S.bank.length.toLocaleString() + '</b><span>questions</span></div></div>';
}
function homeView() {
  const t = today(), d = S.kv.days[t] || { n: 0 }, goal = S.kv.daily; const done = S.kv.dailyDone[t];
  return `<div class="hero"><div class="ring">${ring(Math.min(1, d.n / goal))}<b>${Math.min(d.n, goal)}/${goal}<small>today</small></b></div><div style="flex:1;min-width:230px"><h1>${done ? 'Daily quiz complete 🎉' : "Today's quiz"}</h1><p>${done ? 'Come back tomorrow, or keep going with a longer session.' : `${goal} questions · focus: <b>${esc(RN[dailyFocus()])}</b>. Mixed MCQs, one-liners, labelling and image questions.`}</p><button class="btn w" data-act="daily">${done ? 'Play again' : '▶ Start daily quiz'}</button> <button class="btn" style="background:rgba(255,255,255,.18);box-shadow:none" data-act="dailyAny">Any limb</button></div></div>
  ${statTiles()}
  <div class="card" style="margin-top:18px"><h2>Quick session</h2><div class="lbl" style="margin-top:0">Number of questions</div><div class="sz" id="sz">${[5, 10, 20, 30, 50].map(n => `<button data-act="size" data-n="${n}" class="${S.sel.size === n ? 'on' : ''}">${n}</button>`).join('')}<button data-act="sizeC" class="${[5, 10, 20, 30, 50].includes(S.sel.size) ? '' : 'on'}">${[5, 10, 20, 30, 50].includes(S.sel.size) ? 'Custom' : S.sel.size}</button></div>
  <div class="lbl">Question types</div><div class="pills">${TYPES.map(([k, n]) => `<button data-act="type" data-k="${k}" class="${(S.sel.types || S.kv.types).includes(k) ? 'on' : ''}">${n}</button>`).join('')}</div>
  <div class="lbl">Limb / region</div><div class="pills"><button data-act="reg" data-k="*" class="${!S.sel.regions.length ? 'on' : ''}">All</button>${REG.map(r => `<button data-act="reg" data-k="${r.id}" class="${S.sel.regions.includes(r.id) ? 'on' : ''}">${r.e} ${r.n}</button>`).join('')}</div>
  <div class="lbl">Selection</div><div class="pills">${[['mixed', 'Smart mix'], ['due', 'Due only'], ['new', 'New only'], ['weak', 'My weak spots'], ['flagged', 'Flagged']].map(([k, n]) => `<button data-act="mode" data-k="${k}" class="${S.sel.mode === k ? 'on' : ''}">${n}</button>`).join('')}</div>
  <div class="lbl">Quality</div><div class="pills"><button data-act="tier" data-k="high" class="${S.sel.tier === 'high' ? 'on' : ''}">★ High-yield (recommended)</button><button data-act="tier" data-k="all" class="${S.sel.tier === 'all' ? 'on' : ''}">All facts</button></div>
  <div class="actions"><button class="btn" data-act="go">▶ Start ${S.sel.size} questions</button><button class="btn g" data-act="goFlash">🃏 As flashcards</button></div></div>
  ${pracCard()}
  <div class="lbl">By limb</div><div class="grid g4">${REG.map(r => { const s = regionStats(r.id); return `<button class="limb" data-act="limb" data-k="${r.id}"><span class="em">${r.e}</span><b>${r.n}</b><small>${s.total.toLocaleString()} questions${s.seen ? ' · ' + Math.round((s.acc || 0) * 100) + '% acc' : ''}</small><div class="bar"><i style="width:${s.total ? Math.round(s.learned / s.total * 100) : 0}%"></i></div></button>`; }).join('')}</div>`;
}
function pracSecs() { const m = new Map(); S.bank.forEach(b => { if (b.f && b.f.sec) m.set(b.f.sec, (m.get(b.f.sec) || 0) + 1); }); return [...m]; }
function pracCard() {
  const secs = pracSecs(); if (!secs.length) return ''; const tot = secs.reduce((a, x) => a + x[1], 0), cur = S.pracSec || '*'; const nice = x => x.charAt(0) + x.slice(1).toLowerCase().replace(/(^| )(ortho|pedia)/g, (m) => m);
  return `<div class="card" style="margin-top:18px"><h2>📘 Fundamentals of Orthopedics — Practice Session</h2><p style="color:var(--mut);margin:4px 0 0;font-size:.9rem">The ${tot} MCQs from the end of the book, with the book's answer key and explanations. Picture-quiz figures included.</p>
  <div class="lbl">Chapter / topic</div><div class="pills"><button data-act="pracSec" data-k="*" class="${cur === '*' ? 'on' : ''}">All (${tot})</button>${secs.map(([n, c]) => `<button data-act="pracSec" data-k="${esc(n)}" class="${cur === n ? 'on' : ''}">${esc(nice(n))} (${c})</button>`).join('')}</div>
  <div class="actions"><button class="btn" data-act="prac" data-n="10">▶ 10 random</button><button class="btn" data-act="prac" data-n="25">▶ 25 random</button><button class="btn g" data-act="prac" data-n="0">📖 All in book order</button></div></div>`;
}
function dailyFocus() { const i = Math.floor(new Date().setHours(0, 0, 0, 0) / DAY) % 7; return ['shoulder', 'elbow', 'wrist', 'spine', 'hip', 'knee', 'foot'][i]; }
function limbsView() {
  const groups = ['Upper limb', 'Spine', 'Lower limb', 'General'];
  return groups.map(g => `<div class="lbl">${g}</div><div class="grid g3">${REG.filter(r => r.g === g).map(r => { const s = regionStats(r.id); const n = k => S.bank.filter(b => b.r === r.id && fmtsOf(b).includes(k)).length; return `<div class="card"><h3>${r.e} ${r.n}</h3><p style="color:var(--mut);margin:6px 0 10px">${s.total.toLocaleString()} questions · ${s.seen} seen · ${s.learned} learned</p><div class="bar"><i style="width:${s.total ? Math.round(s.learned / s.total * 100) : 0}%"></i></div><div class="pills" style="margin:12px 0"><span class="chip">MCQ ${n('mcq')}</span><span class="chip">🏷 ${n('occ')}</span><span class="chip">🖼 ${n('ident')}</span></div><div class="actions"><button class="btn" data-act="limbGo" data-k="${r.id}" data-n="10">10 Qs</button><button class="btn g" data-act="limbGo" data-k="${r.id}" data-n="30">30 Qs</button></div></div>`; }).join('')}</div>`).join('');
}
function flashView() {
  const due = dueCount();
  return `<div class="card"><h2>🃏 Anki-style flashcards</h2><p style="color:var(--mut);line-height:1.6;margin-bottom:14px">See the question, think, reveal the answer, then rate yourself <b>Again · Hard · Good · Easy</b>. Cards you rate low come back sooner; easy ones return after days or weeks (spaced repetition).</p><div class="actions"><button class="btn" data-act="flashDue" ${due ? '' : 'disabled'}>⏰ Review ${due} due card${due === 1 ? '' : 's'}</button><button class="btn g" data-act="flashNew">✨ 20 new cards</button><button class="btn g" data-act="flashImg">🖼 Image & label cards</button></div></div>`;
}
function libView() { return `<input class="srch" id="q" placeholder="Search all ${S.bank.length.toLocaleString()} questions — e.g. scaphoid, Bankart, supracondylar…" autocomplete="off"><div class="pills" id="lreg"><button data-k="*" class="on">All limbs</button>${REG.map(r => `<button data-k="${r.id}">${r.n}</button>`).join('')}</div><div class="card lib" id="lres" style="margin-top:14px"><div class="empty">Type to search the question bank.</div></div>`; }
function bindLib() {
  let reg = '*'; const run = () => { const q = $('#q').value.trim().toLowerCase(); if (q.length < 3) { $('#lres').innerHTML = '<div class="empty">Type at least 3 letters.</div>'; return; } const hits = []; for (const b of S.bank) { if (reg !== '*' && b.r !== reg) continue; const f = b.f; const txt = ((f.q || f.title || f.a || '') + ' ' + (f.c || '') + ' ' + (f.a || '') + ' ' + (f.cap || '')).toLowerCase(); if (txt.includes(q)) { hits.push(b); if (hits.length >= 60) break; } } $('#lres').innerHTML = hits.length ? hits.map(b => { const f = b.f; const c = S.cards.get(b.id); return `<div class="it"><b>${b.kind === 'ident' ? '🖼 ' + esc(f.cap || f.a) : b.kind === 'occ' ? '🏷 Labelling: ' + esc(f.a) : b.kind === 'cmatch' || b.kind === 'match' ? '🔗 ' + esc(f.title || 'Match set') : stemHtml(f).replace(/<u>.*?<\/u>/, '<u>' + esc(f.a || '') + '</u>')}</b><br><small>${esc(RN[b.r])} · ${b.src.slice(0, 1).map(s => esc(S.books[s[0]] || s[0]) + ' p.' + s[1]).join('')} ${c && c.flag ? '· 🚩' : ''}</small></div>`; }).join('') : '<div class="empty">No matches.</div>'; };
  $('#q').oninput = run; $('#lreg').onclick = e => { const b = e.target.closest('button'); if (!b) return; reg = b.dataset.k; $$('#lreg button').forEach(x => x.classList.toggle('on', x === b)); run(); };
}
function statsView() {
  const days = []; for (let i = 59; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const r = S.kv.days[today(d)]; days.push(r ? r.n : 0); }
  const tot = Object.values(S.kv.days).reduce((s, d) => ({ n: s.n + d.n, c: s.c + d.c }), { n: 0, c: 0 }); const lv = n => n >= 20 ? 'l3' : n >= 10 ? 'l2' : n > 0 ? 'l1' : '';
  return `<div class="grid g4"><div class="card stat"><b>${tot.n}</b><span>Questions answered</span></div><div class="card stat"><b>${tot.n ? Math.round(tot.c / tot.n * 100) : 0}%</b><span>Overall accuracy</span></div><div class="card stat"><b>${streak()} 🔥</b><span>Day streak</span></div><div class="card stat"><b>${[...S.cards.values()].filter(c => c.reps >= 2 && c.ivl >= 3).length}</b><span>Cards learned</span></div></div>
  <div class="card" style="margin-top:18px"><h2>Last 60 days</h2><div class="heat">${days.map(n => `<i class="${lv(n)}" title="${n} questions"></i>`).join('')}</div></div>
  <div class="card" style="margin-top:18px"><h2>By limb</h2>${REG.map(r => { const s = regionStats(r.id); return `<div class="row"><span class="nm">${r.e} ${r.n}</span><span style="color:var(--mut);font-size:.85rem">${s.acc == null ? '—' : Math.round(s.acc * 100) + '% accuracy'}</span><div class="bar" style="width:140px"><i style="width:${s.total ? Math.round(s.learned / s.total * 100) : 0}%"></i></div></div>`; }).join('')}</div>`;
}
function settingsView() {
  return `<div class="card"><h2>Settings</h2><div class="lbl" style="margin-top:0">Daily goal (questions)</div><div class="sz">${[5, 10, 15].map(n => `<button data-act="goal" data-n="${n}" class="${S.kv.daily === n ? 'on' : ''}">${n}</button>`).join('')}</div>
  <div class="lbl">Default question types</div><div class="pills">${TYPES.map(([k, n]) => `<button data-act="dtype" data-k="${k}" class="${S.kv.types.includes(k) ? 'on' : ''}">${n}</button>`).join('')}</div>
  <div class="lbl">Backup</div><div class="actions" style="margin-top:0"><button class="btn g" data-act="export">⬇ Export my progress</button><button class="btn g" data-act="import">⬆ Import</button><button class="btn bad" data-act="reset">Reset progress</button></div>
  <p style="color:var(--mut);margin-top:16px;font-size:.85rem;line-height:1.6">Your progress is stored on this computer. ${S.bank.length.toLocaleString()} questions from ${Object.keys(S.books).length} books. Questions are generated automatically from the book text — always confirm important facts in the source book (page shown with every answer).</p></div>`;
}

/* ───────── quiz view ───────── */
function quizView() {
  const s = S.sess, it = s.items[s.i]; const b = it.b, f = b.f; const star = b.tier === 0 ? '<span class="qtype star">★ High-yield</span> ' : '';
  const head = `<div class="qwrap"><div class="qtop"><button class="x" data-act="quit" title="Exit">✕</button><div class="bar"><i style="width:${s.i / s.items.length * 100}%"></i></div><b>${s.i + 1}/${s.items.length}</b><button class="x" data-act="bad" title="This question is wrong or unclear — never show it again">🗑</button><button class="x" data-act="flag" title="Flag (F)">${(S.cards.get(b.id) || {}).flag ? '🚩' : '⚑'}</button></div><div class="card qcard">`;
  const foot = '</div></div>'; const lab = (t) => `<span class="qtype">${t}</span> ${star}<span class="qtype" style="background:var(--bg);color:var(--mut)">${esc(RN[b.r])}</span>`;
  if (s.flash) return head + lab('Flashcard') + flashFront(it) + foot;
  if (it.fmt === 'mcq') { const opts = it.opts || (it.opts = f.fx && f.all ? f.all.slice() : shuffle([f.a, ...f.o])); return head + lab(b.kind === 'cmcq' ? (f.sec ? 'Book MCQ · Practice Session' : 'MCQ') : 'Fill in the blank (MCQ)') + `<div class="qtext">${b.kind === 'cmcq' ? esc(f.q) : stemHtml(f)}</div>${f.img ? `<div style="text-align:center"><div class="figure"><img src="img/${f.img}.jpg" alt=""></div></div>` : ''}<div class="opts">${opts.map((o, i) => `<button class="opt" data-act="opt" data-i="${i}"><span class="k">${i + 1}</span>${esc(o)}</button>`).join('')}</div><div id="fb"></div>` + foot; }
  if (it.fmt === 'one') return head + lab('One-liner') + `<div class="qtext">${stemHtml(f)}</div><div id="fb"><div class="actions"><button class="btn" data-act="reveal">Show answer (Space)</button></div></div>` + foot;
  if (it.fmt === 'ident') { const opts = it.opts || (it.opts = shuffle([f.a, ...f.o])); return head + lab('Identify') + `<div class="qtext">What does this figure show?</div><div style="text-align:center"><div class="figure"><img src="img/${f.img}.jpg" alt=""></div></div><div class="opts">${opts.map((o, i) => `<button class="opt" data-act="opt" data-i="${i}"><span class="k">${i + 1}</span>${esc(o)}</button>`).join('')}</div><div id="fb"></div>` + foot; }
  if (it.fmt === 'occ') { const opts = it.opts || (it.opts = shuffle([f.a, ...f.o])); return head + lab('Labelling') + `<div class="qtext">Which label is hidden under the yellow box?</div><div style="text-align:center"><div class="figure"><img src="img/${f.img}.jpg" alt=""><div class="mask" id="mk" style="left:${f.m[0] * 100}%;top:${f.m[1] * 100}%;width:${(f.m[2] - f.m[0]) * 100}%;height:${(f.m[3] - f.m[1]) * 100}%">?</div></div></div><div class="opts">${opts.map((o, i) => `<button class="opt" data-act="opt" data-i="${i}"><span class="k">${i + 1}</span>${esc(o)}</button>`).join('')}</div><div id="fb"></div>` + foot; }
  if (it.fmt === 'match') { const pairs = f.pairs.map((p, i) => ({ l: p[0], r: p[1], i })); if (!it.right) { it.right = shuffle(pairs.map(p => p.i)); it.mp = {}; it.pick = null; } return head + lab('Match the following') + `<div class="qtext">${esc(f.title || 'Match each item on the left with the correct item on the right.')}</div><div class="match"><div class="mcol">${pairs.map(p => `<button class="mitem ${it.pick === p.i ? 'sel' : ''}${p.i in it.mp ? ' done' : ''}" data-act="ml" data-i="${p.i}" ${p.i in it.mp ? `data-p="${Object.keys(it.mp).indexOf(String(p.i)) + 1}"` : ''}>${'ABCDE'[p.i]}. ${esc(p.l)}${p.i in it.mp ? ' → ' + (it.right.indexOf(it.mp[p.i]) + 1) : ''}</button>`).join('')}</div><div class="mcol">${it.right.map((ri, k) => `<button class="mitem ${Object.values(it.mp).includes(ri) ? 'done' : ''}" data-act="mr" data-i="${ri}">${k + 1}. ${esc(pairs[ri].r)}</button>`).join('')}</div></div><div id="fb">${Object.keys(it.mp).length === pairs.length ? '<div class="actions"><button class="btn" data-act="check">Check answers</button></div>' : '<p style="color:var(--mut);margin-top:12px;font-size:.85rem">Tap an item on the left, then its partner on the right.</p>'}</div>` + foot; }
  return head + 'Unsupported' + foot;
}
function flashFront(it) {
  const f = it.b.f, k = it.b.kind; let front = '';
  if (k === 'ident') front = `<div class="qtext">What does this figure show?</div><div style="text-align:center"><div class="figure"><img src="img/${f.img}.jpg" alt=""></div></div>`;
  else if (k === 'occ') front = `<div class="qtext">What is hidden under the yellow box?</div><div style="text-align:center"><div class="figure"><img src="img/${f.img}.jpg" alt=""><div class="mask" id="mk" style="left:${f.m[0] * 100}%;top:${f.m[1] * 100}%;width:${(f.m[2] - f.m[0]) * 100}%;height:${(f.m[3] - f.m[1]) * 100}%">?</div></div></div>`;
  else if (k === 'cmatch' || k === 'match') front = `<div class="qtext">${esc(f.title || 'Recall these pairs')}</div><ul style="margin:12px 0 0 20px;line-height:1.9">${f.pairs.map(p => `<li>${esc(p[0])}</li>`).join('')}</ul>`;
  else front = `<div class="qtext">${k === 'cmcq' ? esc(f.q) : stemHtml(f)}</div>` + (f.img ? `<div style="text-align:center"><div class="figure"><img src="img/${f.img}.jpg" alt=""></div></div>` : '');
  return front + '<div id="fb"><div class="actions"><button class="btn" data-act="reveal">Show answer (Space)</button></div></div>';
}
function answerHtml(it) {
  const b = it.b, f = b.f, k = b.kind;
  if (k === 'ident') return `<b>${esc(f.a)}</b><br><small>${esc(f.cap || '')}</small>`; if (k === 'occ') return `<b>${esc(f.a)}</b>`;
  if (k === 'cmatch' || k === 'match') return `<ul style="margin:0 0 0 18px;line-height:1.8">${f.pairs.map(p => `<li><b>${esc(p[0])}</b> → ${esc(p[1])}</li>`).join('')}</ul>`;
  if (k === 'cmcq') return `<b>${esc(f.a)}</b><br>${esc(f.e || '')}`;
  return `<b>${esc(f.a)}</b><br><small>${ctxHtml(f)}</small>`;
}
function bindQuiz() { const s = S.sess, it = s.items[s.i]; it.t0 = Date.now(); }
function finishQ(it, correct, rating) {
  if (it.res !== null) return; it.res = correct; const quick = Date.now() - it.t0 < 6000; const r = rating != null ? rating : correct ? (quick ? 3 : 2) : 0; SRS.rate(it.b.id, r); bump(correct); if (correct) S.sess.score++;
}
function showFeedback(it, correct, extra) {
  const fb = $('#fb'); const b = it.b; const s = S.sess; const last = s.i + 1 >= s.items.length;
  fb.innerHTML = `<div class="fb ${correct ? 'ok' : 'no'}"><b>${correct ? '✓ Correct' : '✗ Not quite'}</b>${answerHtml(it)}${extra || ''}${srcChips(b)}</div><div class="actions"><button class="btn" data-act="next">${last ? 'See results' : 'Next →'} (Enter)</button></div>`;
}
function onAct(a, el) {
  const s = S.sess; const it = s && s.items[s.i];
  switch (a) {
    case 'nav': S.view = el.dataset.v; render(); break;
    case 'theme': S.kv.theme = S.kv.theme === 'dark' ? 'light' : 'dark'; saveKV(); render(); break;
    case 'due': S.sel.mode = 'due'; S.view = 'home'; render(); break;
    case 'size': S.sel.size = +el.dataset.n; render(); break;
    case 'sizeC': { const n = parseInt(prompt('How many questions?', String(S.sel.size)), 10); if (n > 0 && n <= 200) { S.sel.size = n; render(); } break; }
    case 'type': { const cur = S.sel.types || S.kv.types.slice(); const k = el.dataset.k; S.sel.types = cur.includes(k) ? (cur.length > 1 ? cur.filter(x => x !== k) : cur) : cur.concat(k); render(); break; }
    case 'reg': { const k = el.dataset.k; if (k === '*') S.sel.regions = []; else S.sel.regions = S.sel.regions.includes(k) ? S.sel.regions.filter(x => x !== k) : S.sel.regions.concat(k); render(); break; }
    case 'mode': S.sel.mode = el.dataset.k; render(); break;
    case 'tier': S.sel.tier = el.dataset.k; render(); break;
    case 'pracSec': S.pracSec = el.dataset.k === '*' ? '' : el.dataset.k; render(); break;
    case 'prac': { const n = +el.dataset.n, sec = S.pracSec || ''; if (n) startSession(pickItems({ size: n, only: 'practice', sec, types: ['mcq'], tier: 'all' }), { label: 'Practice Session' }); else { const order = pracSecs().map(x => x[0]); const its = S.bank.filter(b => b.f && b.f.sec && (!sec || b.f.sec === sec) && !(S.cards.get(b.id) || {}).sus).sort((a, b) => order.indexOf(a.f.sec) - order.indexOf(b.f.sec) || a.f.n - b.f.n).map(b => ({ b, fmt: 'mcq' })); startSession(its, { label: 'Practice Session' }); } break; }
    case 'go': startSession(pickItems({ ...S.sel, types: S.sel.types || S.kv.types }), { label: 'Practice' }); break;
    case 'goFlash': startSession(pickItems({ ...S.sel, types: ['one', 'occ', 'ident', 'mcq'] }), { flash: true }); break;
    case 'daily': case 'dailyAny': { const t = today(); const r = rng(hashStr(t + (a === 'dailyAny' ? 'x' : ''))); startSession(pickItems({ size: S.kv.daily, regions: a === 'daily' ? [dailyFocus()] : [], types: ['mcq', 'one', 'occ', 'ident', 'match'], tier: 'high', mode: 'mixed' }, r), { daily: true, label: 'Daily quiz' }); break; }
    case 'limb': S.sel.regions = [el.dataset.k]; S.view = 'home'; render(); break;
    case 'limbGo': startSession(pickItems({ size: +el.dataset.n, regions: [el.dataset.k], types: S.sel.types || S.kv.types, tier: S.sel.tier }), { label: RN[el.dataset.k] }); break;
    case 'flashDue': startSession(pickItems({ size: 30, types: ['one', 'occ', 'ident', 'mcq', 'match'], tier: 'all', mode: 'due' }), { flash: true }); break;
    case 'flashNew': startSession(pickItems({ size: 20, types: ['one', 'occ', 'ident'], tier: 'high', mode: 'new' }), { flash: true }); break;
    case 'flashImg': startSession(pickItems({ size: 20, types: ['occ', 'ident'], tier: 'high', mode: 'mixed' }), { flash: true }); break;
    case 'goal': S.kv.daily = +el.dataset.n; saveKV(); render(); break;
    case 'dtype': { const k = el.dataset.k; S.kv.types = S.kv.types.includes(k) ? (S.kv.types.length > 1 ? S.kv.types.filter(x => x !== k) : S.kv.types) : S.kv.types.concat(k); saveKV(); render(); break; }
    case 'export': { const blob = new Blob([JSON.stringify({ kv: S.kv, cards: [...S.cards.values()] })], { type: 'application/json' }); const u = URL.createObjectURL(blob); const x = document.createElement('a'); x.href = u; x.download = 'orthoquiz-progress-' + today() + '.json'; x.click(); setTimeout(() => URL.revokeObjectURL(u), 1000); toast('Progress exported'); break; }
    case 'import': { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json'; i.onchange = async () => { try { const j = JSON.parse(await i.files[0].text()); Object.assign(S.kv, j.kv || {}); saveKV(); (j.cards || []).forEach(c => { S.cards.set(c.id, c); DB.put('cards', c); }); toast('Progress imported'); render(); } catch (e) { toast('Not a valid backup'); } }; i.click(); break; }
    case 'reset': if (confirm('Delete all your progress? This cannot be undone.')) { DB.clear().then(() => { S.cards.clear(); S.kv.days = {}; S.kv.dailyDone = {}; saveKV(); render(); toast('Progress reset'); }); } break;
    case 'quit': if (confirm('Leave this session? Your answers so far are saved.')) { S.sess = null; S.view = 'home'; render(); } break;
    case 'flag': { const f = SRS.toggleFlag(it.b.id); el.textContent = f ? '🚩' : '⚑'; toast(f ? 'Flagged for review' : 'Flag removed'); break; }
    case 'opt': { if (!it || it.res !== null) break; const i = +el.dataset.i; const ok = it.opts[i] === it.b.f.a; $$('.opt').forEach((o, k) => { o.disabled = true; if (it.opts[k] === it.b.f.a) o.classList.add('ok'); }); if (!ok) el.classList.add('no'); if (it.fmt === 'occ') { const m = $('#mk'); if (m) { m.classList.add('rev'); m.textContent = it.b.f.a; } } finishQ(it, ok); showFeedback(it, ok, it.b.kind === 'cmcq' ? '' : ''); break; }
    case 'reveal': { if (!it) break; $('#fb').innerHTML = ''; const m = $('#mk'); if (m) { m.classList.add('rev'); m.textContent = it.b.f.a; } const last = s.i + 1 >= s.items.length; it.revealed = true; $('#fb').innerHTML = `<div class="fb ok" style="background:var(--accsoft)"><b>Answer</b>${answerHtml(it)}${srcChips(it.b)}</div><p style="margin-top:14px;color:var(--mut);font-weight:700;font-size:.85rem">How well did you know it?</p><div class="rate"><button class="r0" data-act="rate" data-r="0">Again<small>forgot · 10 min</small></button><button class="r1" data-act="rate" data-r="1">Hard<small>~1 day</small></button><button class="r2" data-act="rate" data-r="2">Good<small>knew it</small></button><button class="r3" data-act="rate" data-r="3">Easy<small>instantly</small></button></div>`; break; }
    case 'rate': { if (!it || it.res !== null) break; const r = +el.dataset.r; finishQ(it, r >= 2, r); next(); break; }
    case 'next': next(); break;
    case 'bad': { if (!it) break; const c = SRS.card(it.b.id); c.sus = 1; S.cards.set(c.id, c); DB.put('cards', c); toast('Removed — it will not appear again'); if (it.res === null) it.res = false; S.sess.items.splice(S.sess.i, 1); if (!S.sess.items.length) { S.sess = null; S.view = 'home'; render(); break; } if (S.sess.i >= S.sess.items.length) { finishSession(); break; } render(); break; }
    case 'ml': { if (it.res !== null || el.dataset.i in it.mp) break; it.pick = +el.dataset.i; rerenderQ(); break; }
    case 'mr': { if (it.res !== null || it.pick == null) break; const ri = +el.dataset.i; if (Object.values(it.mp).includes(ri)) break; it.mp[it.pick] = ri; it.pick = null; rerenderQ(); break; }
    case 'check': { let ok = 0; const n = it.b.f.pairs.length; Object.entries(it.mp).forEach(([l, r]) => { if (+l === r) ok++; }); const good = ok / n >= 0.8; $$('.mitem').forEach(m => m.disabled = true); finishQ(it, good, good ? (ok === n ? 2 : 1) : 0); it.matchScore = ok; showFeedback(it, good, `<p style="margin:8px 0">You matched ${ok} of ${n} correctly.</p>`); break; }
  }
}
function rerenderQ() { const s = S.sess, it = s.items[s.i]; const t0 = it.t0; $('#app').innerHTML = quizView(); it.t0 = t0; }
function next() { const s = S.sess; if (s.i + 1 >= s.items.length) { finishSession(); return; } s.i++; render(); }
function finishSession() {
  const s = S.sess; const t = today(); if (s.meta.daily) S.kv.dailyDone[t] = true; saveKV(); S.view = 'result'; render();
}
function resultView() {
  const s = S.sess; const n = s.items.length, pct = Math.round(s.score / n * 100); const wrong = s.items.filter(x => x.res === false);
  const msg = pct >= 90 ? 'Outstanding! 🎉' : pct >= 70 ? 'Well done 👏' : pct >= 50 ? 'Getting there 💪' : 'Keep practising 📚';
  const brief = x => { const b = x.b, f = b.f; return b.kind === 'ident' ? 'Figure: ' + f.a : b.kind === 'occ' ? 'Label: ' + f.a : b.kind === 'cmatch' || b.kind === 'match' ? (f.title || 'Match set') : (f.q || '').replace('____', '[' + (f.a || '') + ']'); };
  return `<div class="qwrap"><div class="card res"><div class="ring" style="margin:0 auto 10px">${ring(pct / 100, 118, 11, '#3b6cf6', 'var(--line)')}<b style="color:var(--acc)">${pct}%<small style="color:var(--mut)">${s.score}/${n}</small></b></div><h2 style="font-size:1.5rem">${msg}</h2><p style="color:var(--mut)">${s.meta.daily ? 'Daily quiz complete · ' : ''}${Math.round((Date.now() - s.t0) / 1000)} seconds</p><div class="actions" style="justify-content:center"><button class="btn" data-act="again">▶ New session</button>${wrong.length ? '<button class="btn g" data-act="retry">↻ Retry ' + wrong.length + ' missed</button>' : ''}<button class="btn g" data-act="nav" data-v="home">Home</button></div>
  <div class="rl">${s.items.map(x => `<div class="ri ${x.res ? 'ok' : 'no'}"><i>${x.res ? '✓' : '✗'}</i><span>${esc(brief(x)).slice(0, 230)}</span></div>`).join('')}</div></div></div>`;
}

/* ───────── events ───────── */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act;
  if (a === 'again') { S.sess = null; S.view = 'home'; render(); return; }
  if (a === 'retry') { const w = S.sess.items.filter(x => x.res === false).map(x => ({ b: x.b, fmt: x.fmt })); startSession(w, S.sess.meta); return; }
  onAct(a, el);
});
document.addEventListener('keydown', e => {
  if (S.view !== 'quiz' || !S.sess || /INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) return; const it = S.sess.items[S.sess.i];
  if (/^[1-4]$/.test(e.key)) { const rb = $('.rate'); if (rb) { const b = $$('.rate button')[+e.key - 1]; b && b.click(); return; } const o = $$('.opt')[+e.key - 1]; if (o && !o.disabled) o.click(); }
  else if (e.key === 'Enter') { const n = $('[data-act=next]'); if (n) n.click(); else { const c = $('[data-act=check]'); c && c.click(); } }
  else if (e.key === ' ') { e.preventDefault(); const r = $('[data-act=reveal]'); r && r.click(); }
  else if (e.key.toLowerCase() === 'f') { const f = $('[data-act=flag]'); f && f.click(); }
  else if (e.key === 'Escape') { const q = $('[data-act=quit]'); q && q.click(); }
});

/* ───────── boot ───────── */
(async function init() {
  const app = $('#app'); app.innerHTML = '<div class="empty" style="padding-top:120px"><div style="font-size:2.4rem">🦴</div><h2>Loading your question bank…</h2><div class="bar" style="max-width:260px;margin:14px auto"><i id="pb" style="width:5%"></i></div></div>';
  await DB.open(); const kv = await DB.get('settings'); if (kv) Object.assign(S.kv, kv); (await DB.all('cards')).forEach(c => S.cards.set(c.id, c));
  S.sel.size = S.kv.size || 10; S.sel.types = null;
  await loadBank(p => { const b = $('#pb'); if (b) b.style.width = Math.round(p * 100) + '%'; });
  if (!S.bank.length) { app.innerHTML = '<div class="empty" style="padding-top:120px"><h2>No question data found</h2><p>Run the build steps (see README) or open the app from its folder.</p></div>'; return; }
  render();
})();
