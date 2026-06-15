const pptxgen = require("pptxgenjs");

const NAVY = "0F1D3A";
const GOLD = "B8963E";
const GOLD_LIGHT = "D4AF5A";
const WHITE = "FFFFFF";
const LIGHT_BG = "F4F6FA";
const GRAY = "64748B";
const LIGHT_NAVY = "1A2F52";

function titleSlide(pres) {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  // Gold accent bar left
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: GOLD } });
  // Large title
  s.addText("SPINE FRACTURES", { x: 0.5, y: 1.1, w: 9, h: 1.1, fontSize: 44, bold: true, color: WHITE, fontFace: "Calibri" });
  s.addText("& MANAGEMENT", { x: 0.5, y: 2.1, w: 9, h: 1.0, fontSize: 38, bold: true, color: GOLD, fontFace: "Calibri" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.2, w: 5.5, h: 0.04, fill: { color: GOLD }, line: { color: GOLD } });
  s.addText("Comprehensive Classification, Emergency Care & Surgical Decision-Making", { x: 0.5, y: 3.35, w: 8.5, h: 0.55, fontSize: 14, color: "CADCFC", fontFace: "Calibri", italic: true });
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar", { x: 0.5, y: 4.3, w: 9, h: 0.4, fontSize: 12, color: GOLD_LIGHT, fontFace: "Calibri", bold: true });
  return s;
}

function sectionHeader(pres, title, subtitle) {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: GOLD } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.5, w: 10, h: 0.12, fill: { color: GOLD } });
  s.addText(title, { x: 0.5, y: 1.8, w: 9, h: 1.2, fontSize: 36, bold: true, color: WHITE, fontFace: "Calibri", align: "center" });
  if (subtitle) s.addText(subtitle, { x: 0.5, y: 3.1, w: 9, h: 0.7, fontSize: 18, color: GOLD_LIGHT, fontFace: "Calibri", align: "center", italic: true });
  return s;
}

function contentSlide(pres, title, bullets, opts = {}) {
  const s = pres.addSlide();
  s.background = { color: LIGHT_BG };
  // Top navy bar with title
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.85, fill: { color: NAVY } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.85, w: 10, h: 0.06, fill: { color: GOLD } });
  s.addText(title, { x: 0.3, y: 0, w: 9.4, h: 0.85, fontSize: 22, bold: true, color: WHITE, fontFace: "Calibri", valign: "middle", margin: 0 });

  const textItems = bullets.map((b, i) => {
    const isLast = i === bullets.length - 1;
    if (typeof b === "string") {
      return { text: b, options: { bullet: true, color: "1E293B", fontSize: 15, fontFace: "Calibri", paraSpaceAfter: 6, breakLine: !isLast } };
    }
    return { text: b.text, options: { bullet: b.sub ? { indent: 30 } : true, indentLevel: b.sub ? 1 : 0, color: b.gold ? GOLD : (b.sub ? GRAY : "1E293B"), fontSize: b.sub ? 13 : 15, bold: b.bold || false, fontFace: "Calibri", paraSpaceAfter: 4, breakLine: !isLast } };
  });

  const contentH = opts.contentH || 4.0;
  const contentY = opts.contentY || 1.1;
  s.addText(textItems, { x: 0.4, y: contentY, w: opts.w || (opts.rightCol ? 5.5 : 9.2), h: contentH, valign: "top" });

  if (opts.rightCol) {
    opts.rightCol(s, pres);
  }
  return s;
}

function twoColSlide(pres, title, leftBullets, rightBullets, leftTitle, rightTitle) {
  const s = pres.addSlide();
  s.background = { color: LIGHT_BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.85, fill: { color: NAVY } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.85, w: 10, h: 0.06, fill: { color: GOLD } });
  s.addText(title, { x: 0.3, y: 0, w: 9.4, h: 0.85, fontSize: 22, bold: true, color: WHITE, fontFace: "Calibri", valign: "middle", margin: 0 });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x: 4.9, y: 1.05, w: 0.04, h: 4.4, fill: { color: GOLD } });

  // Left col header
  if (leftTitle) s.addText(leftTitle, { x: 0.3, y: 1.0, w: 4.3, h: 0.38, fontSize: 13, bold: true, color: GOLD, fontFace: "Calibri" });
  const leftItems = leftBullets.map((b, i) => {
    const isLast = i === leftBullets.length - 1;
    return { text: typeof b === "string" ? b : b.text, options: { bullet: true, color: "1E293B", fontSize: 13, fontFace: "Calibri", paraSpaceAfter: 5, breakLine: !isLast } };
  });
  s.addText(leftItems, { x: 0.3, y: 1.38, w: 4.3, h: 3.9, valign: "top" });

  // Right col header
  if (rightTitle) s.addText(rightTitle, { x: 5.2, y: 1.0, w: 4.5, h: 0.38, fontSize: 13, bold: true, color: GOLD, fontFace: "Calibri" });
  const rightItems = rightBullets.map((b, i) => {
    const isLast = i === rightBullets.length - 1;
    return { text: typeof b === "string" ? b : b.text, options: { bullet: true, color: "1E293B", fontSize: 13, fontFace: "Calibri", paraSpaceAfter: 5, breakLine: !isLast } };
  });
  s.addText(rightItems, { x: 5.2, y: 1.38, w: 4.5, h: 3.9, valign: "top" });
  return s;
}

function statSlide(pres, title, stats) {
  const s = pres.addSlide();
  s.background = { color: LIGHT_BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.85, fill: { color: NAVY } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.85, w: 10, h: 0.06, fill: { color: GOLD } });
  s.addText(title, { x: 0.3, y: 0, w: 9.4, h: 0.85, fontSize: 22, bold: true, color: WHITE, fontFace: "Calibri", valign: "middle", margin: 0 });

  const cols = stats.length <= 4 ? 2 : 3;
  const cardW = cols === 2 ? 4.2 : 2.9;
  const cardH = 1.6;
  const startX = cols === 2 ? 0.6 : 0.3;
  const gapX = cols === 2 ? 0.6 : 0.25;
  const rows = Math.ceil(stats.length / cols);

  stats.forEach((st, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cardW + gapX);
    const y = 1.15 + row * (cardH + 0.2);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: NAVY }, shadow: { type: "outer", blur: 6, offset: 3, angle: 135, color: "000000", opacity: 0.15 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: 0.08, fill: { color: GOLD } });
    s.addText(st.value, { x, y: y + 0.12, w: cardW, h: 0.85, fontSize: 32, bold: true, color: GOLD_LIGHT, fontFace: "Calibri", align: "center", valign: "middle" });
    s.addText(st.label, { x, y: y + 0.95, w: cardW, h: 0.55, fontSize: 12, color: "CADCFC", fontFace: "Calibri", align: "center", valign: "top" });
  });
  return s;
}

async function build() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Dr. Maninder Singh";
  pres.title = "Spine Fractures & Management";

  // Slide 1 - Title
  titleSlide(pres);

  // Slide 2 - Epidemiology stats
  statSlide(pres, "Epidemiology of Spine Fractures", [
    { value: "45%", label: "Motor Vehicle Accidents" },
    { value: "20%", label: "Falls from Height" },
    { value: "15%", label: "Sports Injuries" },
    { value: "15%", label: "Violence / Assault" },
    { value: "10,000+", label: "New SCI Cases / Year in India" },
    { value: "T12–L1", label: "Most Common Level (52%)" },
  ]);

  // Slide 3 - Anatomy
  twoColSlide(pres,
    "Spinal Anatomy & Three-Column Concept (Denis)",
    [
      "Vertebral body: weight-bearing unit",
      "Pedicles: bridge body to posterior arch",
      "Lamina, facets, spinous process: posterior elements",
      "Spinal canal: houses neural elements",
      "Intervertebral disc: shock absorber",
      "Ligamentous complex: PLL, ALL, LF, SSL",
    ],
    [
      "Anterior Column: ALL + anterior ½ vertebral body + disc",
      "Middle Column: PLL + posterior ½ vertebral body + disc",
      "Posterior Column: facets, lamina, pedicles, ligaments",
      "Key rule: Middle column disruption = INSTABILITY",
      "2-column failure = mechanically unstable",
      "3-column failure = most unstable — surgical mandatory",
    ],
    "Anatomy",
    "Denis Three-Column Model"
  );

  // Slide 4 - Classification
  twoColSlide(pres,
    "Classification Systems",
    [
      "AO Classification (Magerl):",
      "Type A: Compression (A1–A4)",
      "Type B: Distraction / flexion",
      "Type C: Rotation / translation",
      "TLICS Scoring System:",
      "Morphology: 1–4 pts",
      "PLC integrity: 0–3 pts",
      "Neurological status: 0–4 pts",
      "Score ≤3 = conservative",
      "Score ≥5 = surgical",
    ],
    [
      "Fracture Morphology Score:",
      "Compression: 1 pt",
      "Burst: 2 pts",
      "Translational/rotational: 3 pts",
      "Distraction: 4 pts",
      "PLC Status:",
      "Intact: 0 pt",
      "Suspected injury: 2 pts",
      "Disrupted: 3 pts",
      "Neurological Status:",
      "Intact: 0 pt  |  Complete: 2 pts",
      "Incomplete / cauda equina: 3 pts",
    ],
    "AO & TLICS Classification",
    "TLICS Scoring Details"
  );

  // Slide 5 - Burst fractures
  contentSlide(pres, "Burst Fractures — Stable vs Unstable", [
    { text: "AO Type A3 (Incomplete Burst) — posterior wall disrupted, single endplate", bold: true },
    { text: "AO Type A4 (Complete Burst) — both endplates involved, more canal compromise" },
    { text: "" },
    { text: "Radiological Criteria for Instability:", bold: true, gold: true },
    { text: "Kyphotic angle > 30°" },
    { text: "Anterior vertebral height loss > 50%" },
    { text: "Posterior wall retropulsion > 50% canal occlusion" },
    { text: "Interpedicular distance widening on AP X-ray" },
    { text: "" },
    { text: "CT is mandatory to assess retropulsed fragments", bold: true },
    { text: "MRI assesses posterior ligamentous complex (PLC) integrity" },
  ]);

  // Slide 6 - Emergency Assessment
  contentSlide(pres, "Emergency Neurological Assessment", [
    { text: "Primary Survey: ABCDE — Airway, Breathing, Circulation, Disability, Exposure", bold: true },
    { text: "Spinal Precautions: Log-roll, hard collar if cervical injury suspected" },
    { text: "" },
    { text: "Neurological Examination Checklist:", bold: true, gold: true },
    { text: "Motor level: key muscle groups C5–S1 (MRC grading 0–5)" },
    { text: "Sensory level: pinprick + light touch, bilateral" },
    { text: "Sacral sparing: perianal sensation, voluntary anal contraction" },
    { text: "Rectal exam mandatory for complete injury assessment" },
    { text: "" },
    { text: "Spinal Shock: Flaccid areflexia — resolves when bulbocavernosus reflex returns", bold: true },
    { text: "Neurogenic Shock: Hypotension + bradycardia (T6 and above) — treat with fluids + vasopressors" },
  ]);

  // Slide 7 - ASIA Scale
  contentSlide(pres, "ASIA Impairment Scale", [
    { text: "ASIA A — Complete: No motor or sensory below injury level", bold: true },
    { text: "ASIA B — Sensory Incomplete: Sensation preserved, no motor", bold: true },
    { text: "ASIA C — Motor Incomplete: Motor preserved, most key muscles < grade 3", bold: true },
    { text: "ASIA D — Motor Incomplete: Motor preserved, most key muscles ≥ grade 3", bold: true },
    { text: "ASIA E — Normal: Full motor and sensory function", bold: true },
    { text: "" },
    { text: "Key Motor Landmarks:", gold: true, bold: true },
    { text: "C5 = Elbow flexion  |  C6 = Wrist extension  |  C7 = Elbow extension", sub: true },
    { text: "C8 = Finger flexion  |  T1 = Finger abduction  |  L2 = Hip flexion", sub: true },
    { text: "L3 = Knee extension  |  L4 = Ankle dorsiflexion  |  L5 = Great toe extension", sub: true },
    { text: "S1 = Ankle plantarflexion", sub: true },
  ]);

  // Slide 8 - Imaging
  twoColSlide(pres,
    "Imaging Protocol for Spine Fractures",
    [
      "X-ray (Mandatory — AP + Lateral):",
      "Fracture morphology screening",
      "Kyphotic angle measurement (Cobb)",
      "Vertebral height assessment",
      "Interpedicular distance (burst marker)",
      "Pedicle alignment (rotation fractures)",
      "",
      "MRI Indications:",
      "Neurological deficit present",
      "PLC integrity assessment (STIR sequence)",
      "Disc herniation / epidural haematoma",
      "Cord contusion vs compression",
    ],
    [
      "CT Scan (Gold Standard):",
      "Best for bony detail and fracture pattern",
      "Axial + sagittal + coronal reconstruction",
      "Canal compromise measurement",
      "Retropulsed fragment quantification",
      "Pedicle integrity for screw planning",
      "3D reconstruction for complex injuries",
      "",
      "MRI Sequences:",
      "T1: anatomy, marrow signal",
      "T2: cord oedema, disc pathology",
      "STIR: PLC injury (high sensitivity)",
      "DWI: acute cord ischaemia",
    ],
    "Plain Radiography & MRI",
    "CT Scan"
  );

  // Slide 9 - Conservative Management
  contentSlide(pres, "Conservative Management", [
    { text: "Indications for Non-operative Treatment:", bold: true, gold: true },
    { text: "Neurologically intact patient" },
    { text: "Mechanically stable fracture (TLICS ≤ 3)" },
    { text: "Kyphosis < 25–30°, height loss < 40–50%, no PLC disruption" },
    { text: "" },
    { text: "Orthosis Options:", bold: true, gold: true },
    { text: "Thoracolumbar: TLSO (thoracolumbar sacral orthosis) — 6–12 weeks" },
    { text: "Cervical: Philadelphia collar (soft) or Miami J (semi-rigid) or Halo vest" },
    { text: "Lumbosacral: LSO for lower lumbar fractures" },
    { text: "" },
    { text: "Follow-up Protocol:", bold: true, gold: true },
    { text: "Serial X-rays at 6 weeks, 3 months, 6 months, 1 year" },
    { text: "Watch for kyphosis progression > 5° — reassess for surgery" },
  ]);

  // Slide 10 - Surgical Indications
  contentSlide(pres, "Surgical Indications", [
    { text: "TLICS ≥ 5 — Surgical treatment recommended", bold: true, gold: true },
    { text: "" },
    { text: "Absolute Indications:", bold: true },
    { text: "Progressive neurological deficit" },
    { text: "Open fracture / penetrating injury" },
    { text: "Irreducible locked facets (cervical)" },
    { text: "" },
    { text: "Relative Indications:", bold: true },
    { text: "Kyphotic deformity > 30°" },
    { text: "Vertebral body height loss > 50%" },
    { text: "Canal compromise > 50% with neurological symptoms" },
    { text: "PLC disruption on MRI (STIR hyperintensity)" },
    { text: "Polytrauma patient (early fixation = earlier mobilisation)" },
    { text: "Failure of conservative management" },
  ]);

  // Slide 11 - Posterior fixation
  twoColSlide(pres,
    "Posterior Pedicle Screw Instrumentation",
    [
      "Gold standard for thoracolumbar fractures",
      "Pedicle screws: strongest fixation point",
      "Construct: 2 levels above + 2 below injury",
      "Short-segment fixation (±intermediate screws)",
      "Titanium or stainless steel rod systems",
      "Cortical bone trajectory (CBT): greater cortical purchase",
      "Percutaneous MIS approach: less blood loss",
    ],
    [
      "Advantages:",
      "Three-column control",
      "Deformity correction and restoration of sagittal balance",
      "Early mobilisation",
      "Allows indirect decompression via distraction",
      "",
      "Decompression Options:",
      "Indirect: ligamentotaxis via instrumentation",
      "Direct: laminectomy / laminotomy for retropulsed fragments",
      "Transpedicular decompression (through pedicle approach)",
    ],
    "Technique",
    "Advantages & Decompression"
  );

  // Slide 12 - Anterior surgery
  contentSlide(pres, "Anterior Surgical Approaches", [
    { text: "Indications:", bold: true, gold: true },
    { text: "Anterior column compromise requiring reconstruction" },
    { text: "Significant retropulsed bone fragments causing cord compression" },
    { text: "Failed posterior decompression / kyphosis recurrence" },
    { text: "" },
    { text: "Thoracic Access (Transthoracic):", bold: true },
    { text: "Single-lung ventilation; rib resection for access" },
    { text: "Corpectomy + expandable cage + plate fixation" },
    { text: "" },
    { text: "Lumbar Access (Retroperitoneal):", bold: true },
    { text: "Flank incision, retroperitoneal dissection" },
    { text: "ALIF (anterior lumbar interbody fusion) for lower lumbar" },
    { text: "" },
    { text: "Cage Options: Titanium mesh cage, expandable cage, structural allograft + autograft", bold: true },
  ]);

  // Slide 13 - Cervical injuries
  twoColSlide(pres,
    "Cervical Spine Injuries",
    [
      "Upper Cervical (C1–C2):",
      "Jefferson burst fracture (C1) — axial load",
      "Odontoid Type I: stable, collar",
      "Odontoid Type II: unstable — surgical (halo vs C1-C2 fusion)",
      "Odontoid Type III: stable, halo vest",
      "Hangman's fracture (C2 bilateral pedicle) — usually stable",
      "",
      "Subaxial (C3–C7):",
      "CSISS (Cervical Spine Injury Severity Score)",
      "Facet dislocation — traction then ACDF or posterior fusion",
      "Burst — anterior corpectomy + cage + plate",
    ],
    [
      "ACDF (Anterior Cervical Discectomy & Fusion):",
      "Smith-Robinson approach (right side)",
      "Discectomy / corpectomy",
      "Cage + plate fixation",
      "1–3 levels most common",
      "",
      "Posterior Surgery:",
      "Laminectomy + lateral mass screws",
      "Laminoplasty (open-door / French-door)",
      "Indications: multi-level myelopathy, OPLL",
      "",
      "Halo-Vest Orthosis:",
      "Accepts 6–12 kg traction",
      "70–90% odontoid Type II success rate",
    ],
    "Upper & Subaxial Injuries",
    "Surgical Techniques"
  );

  // Slide 14 - Neurological recovery
  statSlide(pres, "Neurological Recovery — Prognosis by ASIA Grade", [
    { value: "ASIA A", label: "Complete: < 5% chance of motor recovery" },
    { value: "ASIA B", label: "~30% convert to community ambulators" },
    { value: "ASIA C", label: "75% achieve community ambulation" },
    { value: "ASIA D", label: "90%+ independent ambulators" },
    { value: "48–72h", label: "Critical window for surgical decompression" },
    { value: "NO", label: "Methylprednisolone — NOT routinely recommended (NASCIS)" },
  ]);

  // Slide 15 - Complications
  twoColSlide(pres,
    "Complications of Spinal Injuries",
    [
      "Respiratory: C3–C5 = phrenic nerve risk, ventilator dependency",
      "DVT / PE: prophylaxis mandatory (LMWH + compression stockings)",
      "Pressure sores: 2-hourly turning protocol",
      "Urinary tract infections: early catheter care",
      "Autonomic dysreflexia: T6 and above — HTN crisis",
      "Neurogenic bowel & bladder management",
    ],
    [
      "Kyphosis progression: common in conservative management",
      "Adjacent segment disease: degeneration above/below fusion",
      "Implant failure: screw pull-out, rod breakage",
      "Pseudarthrosis: failed fusion — revision surgery",
      "Chronic pain: neuropathic + mechanical",
      "Infection: deep surgical site infection (1–2%)",
      "CSF leak: durotomy — repair intraoperatively",
    ],
    "Early Complications",
    "Late Complications"
  );

  // Slide 16 - Rehabilitation
  contentSlide(pres, "Rehabilitation Phases", [
    { text: "Phase 1 — ICU / Acute (0–2 weeks):", bold: true, gold: true },
    { text: "Respiratory physiotherapy, mechanical ventilation weaning" },
    { text: "Turning protocol, skin care, early PROM" },
    { text: "" },
    { text: "Phase 2 — Ward (2–6 weeks):", bold: true, gold: true },
    { text: "Sitting tolerance, postural hypotension management" },
    { text: "Upper limb strengthening, wheelchair skills" },
    { text: "" },
    { text: "Phase 3 — Rehabilitation Unit (6 weeks – 3 months):", bold: true, gold: true },
    { text: "Gait training with aids, ADL independence, bladder/bowel program" },
    { text: "" },
    { text: "Phase 4 — Community Reintegration:", bold: true, gold: true },
    { text: "Vocational rehabilitation, home modification, psychological support, driving assessment" },
  ]);

  // Slide 17 - Osteoporotic fractures
  twoColSlide(pres,
    "Osteoporotic Vertebral Compression Fractures",
    [
      "Most common in postmenopausal women",
      "L1 most common site",
      "Acute pain + progressive kyphosis (Dowager's hump)",
      "Conservative: 6 weeks bracing + analgesia",
      "Vertebroplasty: cement injection, no height restoration",
      "Kyphoplasty: balloon inflation then cement — restores height",
      "Both: pain relief > 80%, same functional outcomes",
    ],
    [
      "Prevention & Long-term Management:",
      "Bisphosphonates: alendronate, zoledronic acid",
      "Calcium + Vitamin D supplementation",
      "Denosumab: for bisphosphonate intolerance",
      "Teriparatide: anabolic — builds new bone",
      "Fall prevention: physiotherapy, home assessment",
      "",
      "Adjacent vertebra fracture risk post-kyphoplasty: 20%",
      "Cement leak: 5–7% (usually asymptomatic)",
    ],
    "Presentation & Procedures",
    "Osteoporosis Management"
  );

  // Slide 18 - Key Takeaways
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: GOLD } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.5, w: 10, h: 0.1, fill: { color: GOLD } });
  s.addText("KEY TAKEAWAYS", { x: 0.5, y: 0.2, w: 9, h: 0.7, fontSize: 26, bold: true, color: GOLD_LIGHT, fontFace: "Calibri", align: "center" });

  const points = [
    "Thorough ASIA grading is mandatory — defines prognosis and guides management",
    "CT scan is gold standard — always obtain in suspected spine fracture",
    "TLICS ≥ 5 = surgical intervention required",
    "Pedicle screw fixation is the workhorse of spinal stabilisation",
    "MRI is essential to assess PLC integrity and cord status",
    "Early decompression (< 24–48h) improves neurological outcomes in incomplete injury",
    "Prevent secondary injury: avoid hypoxia (SpO2 > 95%) and hypotension (MAP > 85 mmHg)",
    "Multidisciplinary rehabilitation begins on Day 1",
  ];

  const takeawayItems = points.map((p, i) => {
    const isLast = i === points.length - 1;
    return { text: p, options: { bullet: true, color: WHITE, fontSize: 13.5, fontFace: "Calibri", paraSpaceAfter: 7, breakLine: !isLast } };
  });
  s.addText(takeawayItems, { x: 0.5, y: 1.0, w: 9, h: 4.3, valign: "top" });

  await pres.writeFile({ fileName: "slides/spine-fractures.pptx" });
  console.log("✅  slides/spine-fractures.pptx created");
}

build().catch(console.error);
