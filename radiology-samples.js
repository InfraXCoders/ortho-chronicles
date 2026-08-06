/* ============================================================================
   Radiology Practice Studio — sample library
   ----------------------------------------------------------------------------
   These are SCHEMATIC teaching images (clean vector art), not real patient
   scans, so they are copyright-free and safe to ship. They give recognisable
   anatomy for label / measure / highlight practice. Users can upload real
   DICOM or JPEG/PNG for true cases.
   Each entry:  { name, svg }  — svg is a self-contained <svg> string.
   ========================================================================== */
(function(){
const W=512;
// shared wrappers -----------------------------------------------------------
const bg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}">
<rect width="${W}" height="${W}" fill="#000"/>
<defs>
 <radialGradient id="soft" cx="50%" cy="45%" r="65%">
   <stop offset="0%" stop-color="#8a8a8a"/><stop offset="70%" stop-color="#565656"/><stop offset="100%" stop-color="#2b2b2b"/>
 </radialGradient>
 <linearGradient id="gx" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stop-color="#c9c9c9"/><stop offset="1" stop-color="#6f6f6f"/></linearGradient>
</defs>${inner}
<rect x="10" y="10" width="${W-20}" height="${W-20}" fill="none" stroke="#1c1c1c" stroke-width="2"/>
</svg>`;

// ultrasound sector frame
const usSector = inner => bg(`
<path d="M256 40 L70 470 A ${W} ${W} 0 0 0 442 470 Z" fill="#111"/>
<clipPath id="sec"><path d="M256 40 L70 470 A ${W} ${W} 0 0 0 442 470 Z"/></clipPath>
<g clip-path="url(#sec)"><rect x="0" y="0" width="${W}" height="${W}" fill="#141414"/>
<rect x="0" y="0" width="${W}" height="${W}" fill="url(#usnoise)" opacity="0.5"/>${inner}</g>
<path d="M256 40 L70 470 A ${W} ${W} 0 0 0 442 470 Z" fill="none" stroke="#3a3a3a" stroke-width="2"/>
<defs><pattern id="usnoise" width="6" height="6" patternUnits="userSpaceOnUse">
 <rect width="6" height="6" fill="#161616"/><circle cx="1" cy="1" r="0.6" fill="#242424"/><circle cx="4" cy="3" r="0.5" fill="#0e0e0e"/></pattern></defs>`);

const G='#9a9a9a', Gd='#6a6a6a', Gl='#c4c4c4', ln='#d8d8d8';

const SAMPLES=[
/* ============================ CT ============================ */
{name:'CT', icon:'circle-radiation', cases:[
 {name:'Axial Brain', svg:bg(`
  <ellipse cx="256" cy="250" rx="180" ry="205" fill="#e8e8e8"/>
  <ellipse cx="256" cy="250" rx="168" ry="193" fill="#111"/>
  <ellipse cx="256" cy="250" rx="150" ry="176" fill="#565656"/>
  <path d="M256 90 V415" stroke="#2b2b2b" stroke-width="3"/>
  <ellipse cx="205" cy="215" rx="34" ry="60" fill="#1c1c1c"/><ellipse cx="307" cy="215" rx="34" ry="60" fill="#1c1c1c"/>
  <path d="M235 210 q21 -26 42 0 q-21 20 -42 0" fill="#111"/>
  <circle cx="256" cy="300" r="16" fill="#3a3a3a"/>
  <ellipse cx="256" cy="250" rx="120" ry="150" fill="none" stroke="#6f6f6f" stroke-width="1.5" opacity=".5"/>`)},
 {name:'Axial Chest', svg:bg(`
  <ellipse cx="256" cy="260" rx="210" ry="150" fill="#3a3a3a"/>
  <ellipse cx="256" cy="260" rx="200" ry="140" fill="#d0d0d0"/>
  <ellipse cx="180" cy="255" rx="80" ry="110" fill="#0a0a0a"/><ellipse cx="332" cy="255" rx="80" ry="110" fill="#0a0a0a"/>
  <path d="M256 150 v230" stroke="#8a8a8a" stroke-width="6"/>
  <ellipse cx="250" cy="290" rx="46" ry="40" fill="#8f8f8f"/>
  <circle cx="235" cy="285" r="12" fill="#c9c9c9"/>
  <rect x="240" y="170" width="34" height="26" rx="6" fill="#2b2b2b"/>
  <path d="M70 200 A 200 160 0 0 0 70 330" fill="none" stroke="#eee" stroke-width="5"/>
  <path d="M442 200 A 200 160 0 0 1 442 330" fill="none" stroke="#eee" stroke-width="5"/>`)},
 {name:'Axial Abdomen', svg:bg(`
  <ellipse cx="256" cy="260" rx="215" ry="165" fill="#4a4a4a"/>
  <ellipse cx="256" cy="260" rx="205" ry="155" fill="#bdbdbd"/>
  <path d="M120 200 q120 -40 250 20 q-40 90 -140 80 q-110 -10 -110 -100 Z" fill="#8a8a8a"/>
  <ellipse cx="360" cy="235" rx="42" ry="52" fill="#7a7a7a"/>
  <circle cx="205" cy="315" r="26" fill="#6f6f6f"/><circle cx="315" cy="320" r="26" fill="#6f6f6f"/>
  <circle cx="205" cy="315" r="10" fill="#111"/><circle cx="315" cy="320" r="10" fill="#111"/>
  <rect x="243" y="250" width="26" height="70" rx="8" fill="#8f8f8f"/>
  <circle cx="256" cy="240" r="9" fill="#e0e0e0"/>`)},
 {name:'Axial Pelvis', svg:bg(`
  <ellipse cx="256" cy="270" rx="215" ry="150" fill="#4a4a4a"/>
  <ellipse cx="256" cy="270" rx="205" ry="140" fill="#a8a8a8"/>
  <path d="M110 250 q40 -70 90 -30 q20 40 -10 70 q-60 20 -80 -40Z" fill="#efefef"/>
  <path d="M402 250 q-40 -70 -90 -30 q-20 40 10 70 q60 20 80 -40Z" fill="#efefef"/>
  <circle cx="256" cy="235" r="30" fill="#8a8a8a"/>
  <ellipse cx="256" cy="300" rx="60" ry="40" fill="#7a7a7a"/>
  <rect x="236" y="360" width="40" height="30" rx="8" fill="#ededed"/>`)},
]},

/* ============================ MRI ============================ */
{name:'MRI', icon:'brain', cases:[
 {name:'Brain Axial T2', svg:bg(`
  <ellipse cx="256" cy="250" rx="178" ry="200" fill="#cfcfcf"/>
  <ellipse cx="256" cy="250" rx="160" ry="182" fill="#3a3a3a"/>
  <path d="M256 80 V420" stroke="#141414" stroke-width="3"/>
  <ellipse cx="205" cy="220" rx="30" ry="58" fill="#e9e9e9"/><ellipse cx="307" cy="220" rx="30" ry="58" fill="#e9e9e9"/>
  <ellipse cx="256" cy="250" rx="120" ry="150" fill="none" stroke="#6f6f6f" stroke-width="1.4"/>
  <path d="M180 300 q76 40 152 0" stroke="#8a8a8a" fill="none" stroke-width="2"/>
  <circle cx="256" cy="360" r="30" fill="#5a5a5a"/>`)},
 {name:'Knee Sagittal', svg:bg(`
  <rect x="150" y="40" width="70" height="200" rx="20" fill="url(#gx)"/>
  <rect x="150" y="330" width="60" height="150" rx="18" fill="url(#gx)"/>
  <path d="M150 230 q70 20 90 70 q-10 40 -80 40 q-30 -60 -10 -110Z" fill="#dcdcdc"/>
  <rect x="300" y="150" width="34" height="90" rx="14" fill="#e8e8e8"/>
  <path d="M210 250 l70 -60 M210 300 l90 -20" stroke="#9a9a9a" stroke-width="6" fill="none"/>
  <path d="M180 245 q40 10 60 55" stroke="#111" stroke-width="4" fill="none"/>
  <path d="M175 320 q50 -6 70 30" stroke="#111" stroke-width="4" fill="none"/>
  <path d="M300 240 q10 60 -20 120" stroke="#cfcfcf" stroke-width="7" fill="none"/>`)},
 {name:'Lumbar Spine Sagittal', svg:bg(`
  ${[0,1,2,3,4].map(i=>`<rect x="200" y="${80+i*70}" width="90" height="48" rx="8" fill="url(#gx)"/>
   <rect x="200" y="${128+i*70}" width="86" height="20" rx="6" fill="#2b2b2b"/>`).join('')}
  <path d="M245 70 q-40 200 0 400" stroke="#e8e8e8" stroke-width="10" fill="none" opacity=".25"/>
  <rect x="150" y="90" width="30" height="360" rx="14" fill="#5a5a5a"/>
  <path d="M290 100 q40 160 0 330" stroke="#cfcfcf" stroke-width="5" fill="none"/>`)},
]},

/* ============================ Ultrasound ============================ */
{name:'Ultrasound (USG)', icon:'wave-square', cases:[
 {name:'RUQ — Liver & Gallbladder', svg:usSector(`
  <path d="M120 150 q140 -30 250 40 q-20 120 -160 130 q-120 -20 -90 -170Z" fill="#5a5a5a"/>
  <ellipse cx="300" cy="300" rx="46" ry="70" fill="#0a0a0a"/>
  <ellipse cx="300" cy="300" rx="40" ry="63" fill="#050505"/>
  <path d="M150 200 q80 20 150 -10" stroke="#c9c9c9" stroke-width="2" fill="none"/>
  <circle cx="210" cy="250" r="6" fill="#111"/>`)},
 {name:'Thyroid (transverse)', svg:usSector(`
  <path d="M150 240 q40 -60 90 -20 q10 50 -20 80 q-70 20 -70 -60Z" fill="#8a8a8a"/>
  <path d="M362 240 q-40 -60 -90 -20 q-10 50 20 80 q70 20 70 -60Z" fill="#8a8a8a"/>
  <rect x="243" y="235" width="26" height="70" rx="8" fill="#3a3a3a"/>
  <ellipse cx="256" cy="330" rx="16" ry="10" fill="#0a0a0a"/>`)},
 {name:'Renal (long axis)', svg:usSector(`
  <ellipse cx="256" cy="270" rx="110" ry="150" fill="#6f6f6f"/>
  <ellipse cx="256" cy="270" rx="70" ry="105" fill="#c9c9c9"/>
  <ellipse cx="256" cy="270" rx="30" ry="55" fill="#3a3a3a"/>
  <path d="M256 175 v190" stroke="#2b2b2b" stroke-width="2" opacity=".5"/>`)},
]},

/* ============================ Colour Doppler ============================ */
{name:'Colour Doppler', icon:'droplet', cases:[
 {name:'Carotid — Arterial (red)', svg:usSector(`
  <path d="M150 90 q30 200 -10 380" stroke="#7a7a7a" stroke-width="46" fill="none"/>
  <path d="M150 90 q30 200 -10 380" stroke="#e23b2e" stroke-width="30" fill="none" opacity=".85"/>
  <path d="M150 90 q30 200 -10 380" stroke="#ff8a3d" stroke-width="10" fill="none" opacity=".8"/>
  <path d="M300 260 q40 90 20 200" stroke="#7a7a7a" stroke-width="30" fill="none"/>
  <path d="M300 260 q40 90 20 200" stroke="#c62f26" stroke-width="18" fill="none" opacity=".8"/>
  <rect x="30" y="30" width="14" height="120" fill="url(#dop)"/>
  <defs><linearGradient id="dop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff3b2e"/><stop offset=".5" stop-color="#111"/><stop offset="1" stop-color="#2e7bff"/></linearGradient></defs>`)},
 {name:'Lower-limb Vein (blue)', svg:usSector(`
  <path d="M170 80 q10 220 30 400" stroke="#6f6f6f" stroke-width="54" fill="none"/>
  <path d="M170 80 q10 220 30 400" stroke="#2e7bff" stroke-width="38" fill="none" opacity=".85"/>
  <path d="M170 80 q10 220 30 400" stroke="#7fb2ff" stroke-width="12" fill="none" opacity=".7"/>
  <path d="M320 150 q-20 150 -60 300" stroke="#6f6f6f" stroke-width="26" fill="none"/>
  <path d="M320 150 q-20 150 -60 300" stroke="#1c5fd0" stroke-width="15" fill="none" opacity=".8"/>`)},
 {name:'Renal Artery Flow', svg:usSector(`
  <ellipse cx="256" cy="270" rx="105" ry="140" fill="#5a5a5a"/>
  <path d="M256 270 q-70 -10 -120 -40" stroke="#e23b2e" stroke-width="14" fill="none" opacity=".85"/>
  <path d="M256 270 q40 40 30 130" stroke="#2e7bff" stroke-width="12" fill="none" opacity=".8"/>
  <path d="M256 270 q60 -20 90 -70" stroke="#ff8a3d" stroke-width="10" fill="none" opacity=".8"/>`)},
]},

/* ============================ Barium studies ============================ */
{name:'Barium Studies', icon:'flask', cases:[
 {name:'Barium Swallow (oesophagus)', svg:bg(`
  <path d="M256 40 q-16 200 4 420" stroke="#f2f2f2" stroke-width="34" fill="none"/>
  <path d="M256 40 q-16 200 4 420" stroke="#fff" stroke-width="18" fill="none"/>
  <path d="M244 250 q30 8 26 40" stroke="#111" stroke-width="6" fill="none"/>
  <ellipse cx="262" cy="430" rx="46" ry="30" fill="#f2f2f2"/>`)},
 {name:'Barium Meal (stomach)', svg:bg(`
  <path d="M180 90 q10 60 -6 110 q-40 120 90 150 q150 20 120 -110 q-14 -60 -70 -70 q10 -50 -20 -90Z" fill="#f4f4f4"/>
  <path d="M300 250 q70 20 80 90 q4 60 -50 90" stroke="#f4f4f4" stroke-width="26" fill="none"/>
  <path d="M210 180 q60 20 120 6" stroke="#9a9a9a" stroke-width="3" fill="none"/>
  <path d="M210 220 q60 20 120 6" stroke="#9a9a9a" stroke-width="3" fill="none"/>`)},
 {name:'Barium Enema (colon)', svg:bg(`
  <path d="M150 420 V180 q0 -40 40 -40 h130 q40 0 40 40 V300"
        fill="none" stroke="#f2f2f2" stroke-width="30" stroke-linecap="round"/>
  <path d="M150 420 h60" stroke="#f2f2f2" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="M360 300 q40 60 -10 120" stroke="#f2f2f2" stroke-width="26" fill="none" stroke-linecap="round"/>
  <g stroke="#bdbdbd" stroke-width="2" fill="none">
   <path d="M165 200 h120 M165 250 h120 M165 320 h20 M165 370 h20"/></g>`)},
]},

/* ============================ IVU ============================ */
{name:'IVU / Urography', icon:'droplet', cases:[
 {name:'Intravenous Urogram', svg:bg(`
  <path d="M180 120 q30 60 10 120 q-20 40 -60 30" fill="none" stroke="#eee" stroke-width="6"/>
  <path d="M332 120 q-30 60 -10 120 q20 40 60 30" fill="none" stroke="#eee" stroke-width="6"/>
  <path d="M170 130 q40 20 30 90" fill="#dcdcdc"/>
  <path d="M342 130 q-40 20 -30 90" fill="#dcdcdc"/>
  <path d="M200 240 q10 120 40 190" stroke="#e8e8e8" stroke-width="6" fill="none"/>
  <path d="M312 240 q-10 120 -40 190" stroke="#e8e8e8" stroke-width="6" fill="none"/>
  <path d="M210 430 q46 30 92 0 q0 -40 -46 -46 q-46 6 -46 46Z" fill="#f0f0f0"/>`)},
]},

/* ============================ Antenatal USG L1 ============================ */
{name:'Antenatal USG — Level 1', icon:'baby', cases:[
 {name:'Dating / NT scan', svg:usSector(`
  <ellipse cx="256" cy="270" rx="150" ry="180" fill="#0a0a0a"/>
  <path d="M180 200 q40 -70 110 -40 q60 30 40 110 q-30 80 -110 60 q-70 -30 -40 -130Z" fill="#8a8a8a"/>
  <circle cx="230" cy="210" r="34" fill="#c9c9c9"/>
  <circle cx="222" cy="205" r="6" fill="#111"/>
  <path d="M250 250 q60 20 70 90" stroke="#9a9a9a" stroke-width="24" fill="none"/>
  <path d="M232 178 q6 -12 20 -10" stroke="#e0e0e0" stroke-width="2" fill="none"/>`)},
 {name:'Crown–Rump Length', svg:usSector(`
  <ellipse cx="256" cy="270" rx="150" ry="180" fill="#0a0a0a"/>
  <path d="M200 180 q50 -40 100 0 q30 60 -10 130 q-50 60 -100 20 q-40 -80 10 -150Z" fill="#7a7a7a"/>
  <circle cx="232" cy="205" r="30" fill="#bdbdbd"/>
  <g stroke="#54c98a" stroke-width="2"><path d="M215 185 L300 320"/><path d="M210 180 l10 10 M295 315 l10 10"/></g>`)},
]},

/* ============================ Antenatal USG L2 ============================ */
{name:'Antenatal USG — Level 2 (Anomaly)', icon:'baby', cases:[
 {name:'Head — BPD / Ventricles', svg:usSector(`
  <ellipse cx="256" cy="260" rx="140" ry="115" fill="#8a8a8a"/>
  <ellipse cx="256" cy="260" rx="128" ry="103" fill="#3a3a3a"/>
  <path d="M256 160 V360" stroke="#e8e8e8" stroke-width="3"/>
  <ellipse cx="256" cy="235" rx="22" ry="12" fill="#0a0a0a"/>
  <path d="M200 300 q56 30 112 0" stroke="#c9c9c9" stroke-width="3" fill="none"/>
  <g stroke="#54c98a" stroke-width="2"><path d="M128 260 H384"/><path d="M128 250 v20 M384 250 v20"/></g>`)},
 {name:'Four-chamber Heart', svg:usSector(`
  <path d="M256 150 q120 40 90 190 q-40 90 -90 90 q-50 0 -90 -90 q-30 -150 90 -190Z" fill="#5a5a5a"/>
  <path d="M256 175 V420" stroke="#111" stroke-width="4"/>
  <path d="M170 275 H342" stroke="#111" stroke-width="4"/>
  <ellipse cx="215" cy="230" rx="30" ry="34" fill="#0a0a0a"/><ellipse cx="300" cy="230" rx="30" ry="34" fill="#0a0a0a"/>
  <ellipse cx="215" cy="330" rx="30" ry="40" fill="#0a0a0a"/><ellipse cx="300" cy="330" rx="30" ry="40" fill="#0a0a0a"/>`)},
 {name:'Spine (longitudinal)', svg:usSector(`
  <path d="M180 110 q40 180 130 350" stroke="#8a8a8a" stroke-width="10" fill="none"/>
  ${Array.from({length:12}).map((_,i)=>`<circle cx="${185+i*11+ (i*i*0.4)}" cy="${125+i*28}" r="7" fill="#e8e8e8"/>`).join('')}
  <path d="M170 120 q40 180 130 350" stroke="#c9c9c9" stroke-width="3" fill="none" opacity=".5"/>`)},
 {name:'Femur Length', svg:usSector(`
  <rect x="150" y="250" width="220" height="26" rx="13" transform="rotate(18 256 260)" fill="#f0f0f0"/>
  <g stroke="#54c98a" stroke-width="2"><path d="M158 232 L360 300"/><path d="M153 227 l10 10 M355 295 l10 10"/></g>`)},
]},
];

window.RAD_SAMPLES=SAMPLES;
})();
