const pptxgen = require("pptxgenjs");
const N="0F1D3A",G="B8963E",GL="D4AF5A",W="FFFFFF",BG="F4F6FA",GR="64748B",LN="1A2F52",IC="CADCFC";
const shadow=()=>({type:"outer",blur:6,offset:3,angle:135,color:"000000",opacity:.15});
function sHdr(s,p,t){s.background={color:BG};s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});s.addText(t,{x:.3,y:0,w:9.4,h:.82,fontSize:21,bold:true,color:W,fontFace:"Calibri",valign:"middle",margin:0});}
function cs(p,t){const s=p.addSlide();sHdr(s,p,t);return s;}
function bl(items){return items.map((b,i)=>({text:typeof b==="string"?b:b.t,options:{bullet:b&&b.nb?false:true,color:typeof b==="string"?"1E293B":(b.g?G:"1E293B"),fontSize:b&&b.s?12:14,bold:b&&b.b||false,italic:b&&b.i||false,fontFace:"Calibri",paraSpaceAfter:b&&b.s?3:5,indentLevel:b&&b.sub?1:0,breakLine:i<items.length-1}}));}
function twoCol(s,p,L,R,lh,rh){
  s.addShape(p.shapes.RECTANGLE,{x:4.9,y:1.05,w:.04,h:4.4,fill:{color:G}});
  if(lh)s.addText(lh,{x:.3,y:1.0,w:4.3,h:.38,fontSize:13,bold:true,color:G,fontFace:"Calibri"});
  s.addText(bl(L),{x:.3,y:1.4,w:4.3,h:3.9,valign:"top"});
  if(rh)s.addText(rh,{x:5.2,y:1.0,w:4.5,h:.38,fontSize:13,bold:true,color:G,fontFace:"Calibri"});
  s.addText(bl(R),{x:5.2,y:1.4,w:4.5,h:3.9,valign:"top"});
}
function mkTable(p,slide,rows,opts={}){
  const hdr={fill:{color:N},color:W,bold:true,fontSize:11,fontFace:"Calibri",align:"center",valign:"middle"};
  const cel={fontSize:11,fontFace:"Calibri",valign:"middle",border:{pt:.5,color:"C8D0DC"}};
  const data=rows.map((row,ri)=>row.map((cell,ci)=>{if(ri===0)return{text:String(cell),options:{...hdr}};const b={text:String(cell),options:{...cel,fill:{color:ri%2===0?"FFFFFF":"EBF0F7"}}};if(ci===0)b.options.bold=true;return b;}));
  slide.addTable(data,{x:opts.x||.3,y:opts.y||1.05,w:opts.w||9.4,h:opts.h||4.35,border:{pt:.5,color:"C8D0DC"},autoPage:false,...opts});
}
function barChart(p,slide,labels,values,name,opts={}){slide.addChart(p.charts.BAR,[{name,labels,values}],{x:opts.x||.4,y:opts.y||1.05,w:opts.w||9.2,h:opts.h||4.2,barDir:"col",chartColors:[G,...Array(10).fill(LN)],showValue:true,dataLabelColor:"1E293B",dataLabelFontSize:10,catAxisLabelColor:GR,valAxisLabelColor:GR,valGridLine:{color:"E2E8F0",size:.5},catGridLine:{style:"none"},chartArea:{fill:{color:"FFFFFF"},roundedCorners:false},showLegend:false,...opts});}

async function build(){
  const p=new pptxgen(); p.layout="LAYOUT_16x9"; p.title="Hand & Wrist Injuries";

  // 1 Title
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:.18,h:5.625,fill:{color:G}});
  s.addText("HAND & WRIST\nINJURIES",{x:.5,y:.6,w:9,h:1.5,fontSize:38,bold:true,color:W,fontFace:"Calibri"});
  s.addText("Fractures · Tendon Injuries · Nerve Compression · Replantation",{x:.5,y:2.15,w:9,h:.65,fontSize:15,color:GL,fontFace:"Calibri",italic:true});
  s.addShape(p.shapes.RECTANGLE,{x:.5,y:3.0,w:5,h:.04,fill:{color:G},line:{color:G}});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar  |  2026",{x:.5,y:3.15,w:9,h:.4,fontSize:12,color:GL,fontFace:"Calibri",bold:true});}

  // 2 Hand anatomy overview
  {const s=cs(p,"Functional Anatomy of the Hand & Wrist");
  twoCol(s,p,
    [{t:"Carpal Bones (proximal to distal):",b:true,g:true},"Proximal row: Scaphoid, Lunate, Triquetrum, Pisiform","Distal row: Trapezium, Trapezoid, Capitate, Hamate","Mnemonic: 'Some Lovers Try Positions That They Can't Handle'",{t:"Carpal Kinematics:",b:true,g:true},"DISI (Dorsal Intercalated Segment Instability): SL dissociation → lunate tilts dorsal","VISI (Volar Intercalated Segment Instability): LT dissociation → lunate tilts volar",{t:"Key Wrist Ligaments:",b:true,g:true},"Volar intrinsic: RSC, LRL, ULL (most important)","Scapholunate ligament (SL): dorsal component most important","Lunotriquetral ligament (LT)","TFCC: stabilises DRUJ; torn in distal radius fractures"],
    [{t:"Flexor Tendon Zones:",b:true,g:true},"Zone I: Distal to FDS insertion (FDP only)","Zone II (No Man's Land): A1 pulley to FDS insertion — most complex","Zone III: Carpal tunnel to palm","Zone IV: Within carpal tunnel","Zone V: Proximal to carpal tunnel",{t:"Extensor Tendon Zones:",b:true,g:true},"Zone I: Over DIP (Mallet finger)","Zone II: Over middle phalanx","Zone III: Over PIP (central slip) — Boutonnière","Zone IV: Over proximal phalanx","Zone V: Over MCP (Sagittal band rupture)","Zone VI: Over dorsum of hand","Zone VII: Under extensor retinaculum"],
    "Carpal Bones & Kinematics","Tendon Zones");}

  // 3 Distal radius fractures
  {const s=cs(p,"Distal Radius Fractures — Classification & Assessment");
  mkTable(p,s,[
    ["Classification","Type","Description","Treatment","Notes"],
    ["Colles' Fracture","Extra-articular","Dorsally displaced, impacted; dorsal tilt, radial shortening","Cast if < 3 mm shortening, < 5° dorsal tilt, < 2 mm step","Most common adult fracture; FOOSH in elderly"],
    ["Smith's Fracture","Extra-articular","Volar displacement ('reverse Colles')","Volar locking plate (unstable)","Garden spade deformity; fall on flexed wrist"],
    ["Barton's Fracture","Intra-articular","Rim fracture: dorsal or volar","ORIF (volar locking plate / buttress)","Subluxation of carpus with fragment"],
    ["Chauffeur's Fracture","Intra-articular","Radial styloid fracture","Lag screw or plate if displaced","Avulsion by RSC ligament; AO B1.1"],
    ["Die-punch Fracture","Intra-articular","Lunate facet depression","ORIF — subchondral bone support","CT mandatory to assess articular step"],
    ["Frykman Classification","Extra + Intra","Grade I–VIII based on intra-articular + DRUJ","Guides implant selection","DRUJ involvement = higher grade"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 4 DRF surgical technique
  {const s=cs(p,"Volar Locking Plate — Surgical Technique (Henry's Approach)");
  twoCol(s,p,
    [{t:"Indications for Surgery (AO/British):",b:true,g:true},"Radial shortening > 3 mm","Dorsal tilt > 5° (or neutral)","Intra-articular step > 2 mm","Unstable fracture pattern (comminution)","Young active patient — lower threshold",{t:"Henry's Volar Approach:",b:true,g:true},"Incision: FCR radial border → wrist crease → Henry","Identify and protect: radial artery, FPL, radial nerve (SBR)","Pronator quadratus elevated off radial border","Expose volar surface of distal radius","Reduction: traction + fluoroscopy; use reduction tools"],
    [{t:"Plate Application:",b:true,g:true},"Plate: 2.4/2.7 mm volar locking plate (Synthes, Trimed, Acumed)","Position plate distal to watershed line","Distal locking screws: subchondral position (2 mm from joint)","Proximal: cortical or locking screws","Check: Gilula arcs restored on post-reduction X-ray","Check DRUJ stability under fluoroscopy",{t:"Post-operative Protocol:",b:true,g:true},"Dorsal backslab 1–2 weeks","Active ROM: wrist, digits from day 1","Hand therapy referral: day 2–5 post-op","Strengthening: 8–10 weeks","Full recovery: 3–6 months","Complications: tendon rupture (EPL), CRPS (5%)"],
    "Indications & Approach","Plate & Post-op");}

  // 5 Scaphoid fractures
  {const s=cs(p,"Scaphoid Fractures — Diagnosis & Management");
  twoCol(s,p,
    [{t:"Anatomy & Blood Supply:",b:true,g:true},"80% of blood supply enters distally (dorsal ridge)","Proximal pole: retrograde supply only — AVN risk","Waist fractures (70%): intermediate AVN risk","Proximal pole (5%): high AVN risk (30%)","Distal pole (15%): good blood supply, heals well",{t:"Clinical Features:",b:true,g:true},"Anatomical snuffbox tenderness (SENSITIVITY 90%)","Scaphoid tubercle tenderness","Dorsoradial wrist swelling","Axial compression (scaphoid compression test)","X-ray: may be normal in 10–20% acute fractures"],
    [{t:"Investigations:",b:true,g:true},"X-ray (AP, Lateral, Scaphoid views): first line","CT scan: gold standard for bony detail — union assessment","MRI: best for occult fractures (sensitivity 98%); bone oedema day 1","USS: limited; used in some centres for acute diagnosis",{t:"Treatment:",b:true,g:true},"Undisplaced waist (B1): cast 6–10 weeks","Displaced > 1 mm / proximal pole: ORIF","Headless compression screw (Herbert, Acutrak, WA)","Screw position: central-central on AP + lateral fluoroscopy","Delayed union: bone graft (iliac crest / medial femoral condyle vascularised graft)","AVN proximal pole: vascularised bone graft (Zaidemberg / MFC)"],
    "Anatomy & Clinical","Investigations & Treatment");}

  // 6 Scaphoid non-union
  {const s=cs(p,"Scaphoid Non-union — SNAC Wrist");
  mkTable(p,s,[
    ["Stage","SNAC Deformity","Affected Joint","Surgical Options","Notes"],
    ["Pre-collapse / DISI","SL angle > 60° without OA","SL joint only","Headless screw + bone graft","Vascularised graft if AVN"],
    ["SNAC Stage I","Radial styloid OA","Scaphoid-styloid only","Screw + graft + radial styloidectomy","Distal fragment viable"],
    ["SNAC Stage II","Scaphocapitate OA","Radioscaphoid (whole)","Scaphoid excision + 4-bone fusion","RSL fusion if fovea involved"],
    ["SNAC Stage III","Capitolunate OA","Midcarpal","Four-corner fusion (LTC + C) or PRC","PRC: lunate facet must be intact"],
    ["SNAC Stage IV","Radiocarpal OA","Pan-carpal","Total wrist arthrodesis","Functional wrist arthrodesis: 10–20° extension"],
  ],{x:.3,y:.95,w:9.4,h:2.8});
  s.addText(bl([{t:"Key Points for SNAC:",b:true,g:true},"Average non-union delay: 18 months","Humpback deformity on lateral X-ray: volar angulation of scaphoid","DISI deformity: lunate extended → ↑ SL angle on lateral","Vascularised bone graft (Zaidemberg or MFC pedicled): best for AVN proximal pole — union rates 70–90%"]),
    {x:.3,y:3.85,w:9.4,h:1.55,valign:"top"});}

  // 7 Flexor tendon repair
  {const s=cs(p,"Flexor Tendon Repair — Zone II (No Man's Land)");
  twoCol(s,p,
    [{t:"Anatomy of Zone II:",b:true,g:true},"FDP and FDS run within tight fibrous sheath","Pulley system: A1–A5 annular pulleys","A2 (proximal phalanx) + A4 (middle phalanx): CRITICAL — preserve","Injury in Zone II most technically demanding",{t:"Repair Principles:",b:true,g:true},"Repair within 24–48h (primary) or up to 2 weeks (delayed primary)","Core suture: 4-strand or 6-strand (strength proportional to strand count)","4-strand repair (MGH / Modified Kessler): 40–80 N","6-strand repair: 60–120 N — allows early active motion","Epitendinous suture: increases strength 10–50%, reduces gapping"],
    [{t:"Suture Technique:",b:true,g:true},"Loupe magnification mandatory (× 3.5 minimum)","Modified Kessler or Adelaide 4-strand core suture","Material: 3-0 or 4-0 Prolene or braided polyester","Running circumferential epitendinous: 6-0 Prolene","Prevent pulley disruption: venting A2 max 1 cm if needed",{t:"Post-operative Rehabilitation:",b:true,g:true},"Belfast protocol (active): immediate controlled active motion","Indiana protocol (active): immediate active","Traditional: Kleinert passive flexion-active extension (wrist flex)","Hand therapist: from day 2–5 mandatory","Rupture rate: 3–5% with active protocols vs 10–25% passive"],
    "Zone II Anatomy & Principles","Technique & Rehab");}

  // 8 Extensor tendons
  {const s=cs(p,"Extensor Tendon Injuries — Zone-Specific Management");
  mkTable(p,s,[
    ["Zone","Injury","Classic Deformity","Treatment","Notes"],
    ["Zone I (DIP)","Terminal tendon disruption","Mallet finger (loss of DIP extension)","Extension splint DIP × 8 weeks (full time); 4 weeks at night","Chronic: surgical reconstruction if > 3 months"],
    ["Zone II (mid phalanx)","Tendon laceration","DIP lag","Primary repair if laceration; splint if avulsion","Less common zone"],
    ["Zone III (PIP joint)","Central slip disruption","Boutonnière deformity (PIP flex + DIP ext)","Acute: extension splint PIP 6 wks; Chronic: Fowler's tenotomy","Do NOT miss central slip injury at PIP level"],
    ["Zone IV (prox phalanx)","Laceration","Extensor lag at MCP/PIP","Primary repair + splint in extension","Lateral bands usually intact"],
    ["Zone V (MCP)","Sagittal band rupture (boxer's knuckle)","Extensor tendon subluxation","Acute: splint; Chronic: sagittal band repair","Boxing / punch injury over MCP; tendon subluxes ulnarly"],
    ["Zone VI (dorsum)","Laceration (EHL, EDC)","Extensor lag digit/thumb","Primary repair; running epitendinous","May lose single digit extension temporarily — EI can compensate"],
    ["Zone VII (retinaculum)","Rupture (RA, stenosing tenosynovitis)","Multiple digit drop / EPL rupture","Tendon transfer (EI to EPL) or synovectomy","EPL most common RA rupture — Caput ulnae syndrome"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 9 Nerve compression CTS
  {const s=cs(p,"Carpal Tunnel Syndrome — Diagnosis & Management");
  twoCol(s,p,
    [{t:"Anatomy:",b:true,g:true},"Carpal tunnel: 9 flexor tendons + median nerve","Roof: flexor retinaculum (transverse carpal ligament)","Contents: FPL, 4× FDS, 4× FDP, median nerve","Median nerve: most superficial (vulnerable to compression)",{t:"Symptoms & Signs:",b:true,g:true},"Nocturnal paraesthesia (thumb, index, middle, radial ring)","Positive Phalen's (wrist flex 60s): 75% sensitivity","Tinel's test (percussion at wrist): 60% sensitivity","Durkan's carpal compression test: 87% sensitivity","Thenar wasting: late feature — intrinsic hand muscle weakness","Flick sign: patient shakes hand to relieve symptoms"],
    [{t:"Electrodiagnostic Studies:",b:true,g:true},"Nerve conduction study (NCS): gold standard","Prolonged distal motor latency: > 4.2 ms (APB)","Prolonged sensory latency: > 3.5 ms","Absent sensory response: severe CTS","EMG: denervation in APB/FPL — axonotmesis",{t:"Management:",b:true,g:true},"Mild: night splinting in neutral position","Corticosteroid injection: 70% short-term relief; recurrence 50% at 1 year","Carpal tunnel release (CTR): gold standard for moderate-severe","Open vs endoscopic: equivalent at 6 months; endoscopic faster return to work (1–2 wks)","CTR under wide-awake LA: WALANT technique — patient can test immediately"],
    "Anatomy & Clinical","Investigations & Treatment");}

  // 10 Cubital tunnel
  {const s=cs(p,"Cubital Tunnel Syndrome & Ulnar Nerve Entrapment");
  twoCol(s,p,
    [{t:"Anatomy at Elbow:",b:true,g:true},"Ulnar nerve: medial epicondyle → cubital tunnel","Osborne's ligament (FCU aponeurosis): roof of tunnel","Tunnel: MCL + medial epicondyle + FCU","Subluxation of nerve over epicondyle: 16% population",{t:"Symptoms:",b:true,g:true},"Paraesthesia / numbness: ring + little finger","Intrinsic weakness: hypothenar, interossei, adductor pollicis","Claw hand (Wartenberg) in ring/little: late feature","Elbow flexion test (positive > 60s): 75% sensitivity","McGowan classification: Grade I (sensory only) → III (wasting)"],
    [{t:"Electrodiagnostic:",b:true,g:true},"NCS: slowing across elbow > 10 m/s difference","Segment: from below to above medial epicondyle","EMG: FDI, hypothenar, adductor pollicis",{t:"Treatment Options:",b:true,g:true},"Grade I: activity modification, elbow pad, night extension splint (6 months)","Grade II–III: surgical decompression","Simple decompression (Osborne release): equivalent to transposition at 5 years","Anterior transposition: subcutaneous, intramuscular, or submuscular","Medial epicondylectomy: avoids implant, similar outcomes","Endoscopic decompression: shorter recovery, good for Grade I–II"],
    "Anatomy & Symptoms","Investigations & Surgery");}

  // 11 Hand infections
  {const s=cs(p,"Hand Infections — Classification & Management");
  mkTable(p,s,[
    ["Infection","Location","Organism","Clinical Features","Treatment"],
    ["Paronychia","Nail fold","Staph aureus, Streptococcus","Erythema, swelling, pus at nail fold","Drainage (nail fold elevation); oral ABx"],
    ["Felon","Pulp of finger (fibrous septa)","Staph aureus","Tense, throbbing pulp; 'pressure cooker'","Incision + drainage (longitudinal); fish-mouth incision"],
    ["Herpetic whitlow","Distal phalanx","HSV-1 or HSV-2","Vesicles, burning, recurrent","Acyclovir; NO surgical drainage — spreads virus"],
    ["Flexor tenosynovitis","Flexor sheath","Staph aureus, polymicrobial","Kanavel 4 signs (flexed digit, sheath tenderness, pain on passive ext, fusiform swelling)","Urgent irrigation of sheath; ABx; Brunner incision"],
    ["Web space infection","Web space","Staph aureus + anaerobes","'Collar-stud abscess' — subcutaneous + deep","Incision both sides; full antibiotics"],
    ["Palmar space infection","Mid-palmar / thenar space","Mixed flora","Loss of palmar concavity; febrile","Incision + drainage; 10–14d ABx"],
    ["Septic arthritis (finger)","PIP / MCP joint","Staph / gonoccocus","Hot, swollen, restricted joint","Washout + ABx; GONOCOCCAL: ceftriaxone"],
    ["Bite wounds","Any","Pasteurella multocida (cat), Eikenella (human)","Puncture → deep tracking; minimal external wound","Debridement; amoxicillin-clavulanate; tetanus"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 12 Replantation
  {const s=cs(p,"Replantation — Principles, Indications & Technique");
  twoCol(s,p,
    [{t:"BEFAVS Criteria (Indications):",b:true,g:true},"B — Body: thumb (priority replantation)","E — Elbow: above-elbow injuries","F — Fingers multiple (individual rarely replanted)","A — Amputation in child (all attempts at replantation)","V — Viable: sharp cut preferred over crush/avulsion","S — Skin: degloving type suitable",{t:"Contraindications to Replantation:",b:true,g:true},"Single-digit injury in adult (esp. distal ring avulsion)","Heavily contaminated / crushed","Major associated injuries / haemodynamic instability","Prolonged warm ischaemia: > 12h fingers, > 6h major limb"],
    [{t:"Sequence of Replantation:",b:true,g:true},"Bone shortening + fixation (K-wires / mini-plate)","Extensor tendon repair","Flexor tendon repair","Arterial repair (operating microscope, 9-0 nylon)","Venous repair (≥ 2 veins per artery)","Nerve repair (primary or secondary)","Skin closure (loose — no tension)","Monitoring: hourly for 72h; colour, turgor, cap refill",{t:"Ischaemia Tolerance (Cold):",b:true,g:true},"Digits: 24–30 hours if cold-preserved","Major limb (above wrist): < 6h warm, < 12h cold","Wrap in moist gauze, place in sealed bag on ice (NOT direct ice)"],
    "BEFAVS Indications","Technique & Ischaemia");}

  // 13 Vasospasm/monitoring
  {const s=cs(p,"Post-replantation Monitoring & Salvage");
  mkTable(p,s,[
    ["Sign","Arterial Compromise","Venous Congestion","Action"],
    ["Colour","Pale / white","Blue-purple (congested)","Warm if arterial; pin prick if venous"],
    ["Turgor","Flat / sunken (no perfusion)","Tense, swollen","Release tight dressings"],
    ["Temperature","Cool (< 30°C vs 32–35°C normal)","Normal or slightly cool","Warming light; heparin"],
    ["Pin prick bleeding","No blood","Rapid dark blood","Venous congestion: leech therapy"],
    ["Cap refill","> 2–3 seconds","< 1 second (brisk)","Urgent return to theatre if persistent"],
    ["Management","Heparinise, warm, IV Dextran","Leech therapy (Hirudo medicinalis × 6–8h)","Re-explore if no improvement 30–60 min"],
    ["Leech therapy","—","FIRST LINE for venous congestion","Aeromonas hydrophila prophylaxis: ciprofloxacin"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 14 Metacarpal fractures
  {const s=cs(p,"Metacarpal & Phalangeal Fractures — Management");
  mkTable(p,s,[
    ["Fracture","Acceptable Angulation","Treatment","Notes"],
    ["Index/middle metacarpal neck","< 15°","Closed reduction + neighbour strap","Little displacement acceptable"],
    ["Ring metacarpal neck","< 30°","Closed reduction + neighbour strap","Acceptable angulation higher; IF > 30°: CRPP"],
    ["Little (5th) metacarpal neck (Boxer's)","< 40–70°","Neighbour strap if < 40°; CRPP / plate if > 70°","Most common metacarpal fracture; accept moderate angulation"],
    ["Metacarpal shaft","< 10° any","Buddy strap + SAM splint; plate if > 10° or rotation","Rotation: 5° = 1.5 cm digital overlap at fingertip — unacceptable"],
    ["Bennett's fracture (1st CMC)","N/A (intra-articular)","CRPP or ORIF (lag screw)","APL pulls MC shaft radial; volar fragment stable"],
    ["Rolando's (comminuted Bennett)","N/A","Plate or external fixator if severe comminution","Worse prognosis than Bennett"],
    ["Proximal phalanx","< 15°","Immobilise 3–4 wks; ORIF if unstable","Intrinsic + EDC forces cause volar angulation"],
    ["Middle phalanx — dorsal base avulsion","< 30% articular, no subluxation","Extension block splint × 4 wks; ORIF > 30% or sublux","'Volar plate fracture' — watch for PIP subluxation"],
    ["Mallet finger (bony)","< 2 mm gap, no subluxation","Extension splint DIP × 8 wks","ORIF if > 30% articular + subluxation"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 15 DRUJ injuries
  {const s=cs(p,"Distal Radioulnar Joint (DRUJ) & TFCC Injuries");
  twoCol(s,p,
    [{t:"TFCC Anatomy:",b:true,g:true},"Triangular Fibrocartilage Complex: articular disc + meniscal homologue + foveal ligaments","Central disc: poor vascularity, limited healing","Peripheral: better vascularity (3 mm marginal zone)","Palmer Classification:","- Class 1: Traumatic (1A–1D by location)","- Class 2: Degenerative (2A–2E, Ulnar impaction syndrome)",{t:"DRUJ Instability:",b:true,g:true},"Normal DRUJ: radius rotates around fixed ulna","Tear of foveal attachment → DRUJ unstable","Test: Piano-key sign (dorsal pressure on ulnar head)","Stabilising structures: volar + dorsal radioulnar ligaments (deep fibers)"],
    [{t:"TFCC Investigation:",b:true,g:true},"Arthrogram: 75% sensitivity for central tears","MRI wrist (3T): 80–90% sensitivity for peripheral tears","Wrist arthroscopy: GOLD STANDARD — diagnostic + therapeutic",{t:"Management:",b:true,g:true},"Class 1A (Central): Arthroscopic debridement if symptomatic","Class 1B (Peripheral = foveal): Arthroscopic repair (outside-in or all-inside)","Class 1D (Avulsion): Ligament repair at sigmoidnotch",{t:"DRUJ Instability:",b:true,g:true},"Acute: supination cast (6 wks for volar instability) or pronation","Surgical: TFCC foveal reattachment (open / arthroscopic)","Chronic: ECU-based ligament reconstruction","Ulnar shortening osteotomy: for Palmer Class 2 (impaction)"],
    "TFCC Anatomy","Management");}

  // 16 Outcomes data
  {const s=cs(p,"Outcomes — Hand Surgery Recovery Data");
  barChart(p,s,["DRF ORIF\n(TAM > 75%)","Zone II Tendon\n(good/excellent)","CTS Release\n(symptom relief)","Scaphoid waist\n(union rate cast)","Scaphoid waist\n(union rate screw)","Replantation digit\n(survival rate)","Replantation major\n(survival rate)"],[88,74,90,80,95,85,68],"% Satisfactory Outcome",{x:.4,y:1.05,w:9.2,h:3.9});
  s.addText("Sources: IFSSH evidence review 2020; Tang et al. (zone II tendon); BSSH scaphoid guidelines 2022; Soucacos meta-analysis (replantation)",
    {x:.3,y:5.2,w:9.4,h:.3,fontSize:10,color:GR,fontFace:"Calibri",italic:true});}

  // 17 Case study 1
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 1 — Volar Locking Plate for DRF",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b=[["PRESENTATION","52F, FOOSH, fall down stairs\nLeft wrist pain + deformity\nSilverFork deformity clinically\nAD on the injured side"],
    ["IMAGING","X-ray: Colles'-type distal radius fracture\nDorsal tilt 22°, radial shortening 6mm\nIntra-articular step 2.5 mm (die-punch)\nCT: volar cortex comminution"],
    ["MANAGEMENT","WALANT anaesthesia + tourniquet\nHenry's volar approach\n2.4 mm variable angle LCP plate (Synthes)\nFluoroscopy confirmed: articular step 0 mm"],
    ["OUTCOME","Hand therapy from day 3\nFull ROM at 3 months (TAM 94%)\nGrip strength 88% at 6 months\nNo EPL rupture; CRPS excluded early"]];
  b.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 18 Case study 2
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 2 — Flexor Tenosynovitis (Emergency)",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b2=[["PRESENTATION","34M, mechanic, small cut right ring finger 3 days ago\nIncreasing redness, swelling, unable to work\nAll 4 Kanavel signs present"],
    ["INVESTIGATIONS","Bloods: WBC 14,000, CRP 78\nX-ray: soft tissue swelling only\nNo retained foreign body\nDiagnosis: Flexor tenosynovitis Zone II"],
    ["MANAGEMENT","Emergency theatre (4 hours)\nBrunner incision, A2 and A4 preserved\nCatheter sheath irrigation (Synergistic irrigation)","IV Flucloxacillin 1g 6-hourly + Metronidazole\nCultures: MSSA sensitive"],
    ["OUTCOME","Hand therapy Day 2: controlled active motion\nSwitched oral Day 3 (CRP falling)\nTotal ABx 14 days\nFull ROM at 8 weeks — excellent outcome"]];
  b2.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 19 Key references
  {const s=cs(p,"Key References & Evidence Summary");
  mkTable(p,s,[
    ["Reference","Year","Key Finding","Implication"],
    ["Arora et al. (JBJS Br) — DRF ORIF vs Cast","2011","Elderly DRF: functional outcomes equivalent at 1yr","Non-operative still valid in low-demand elderly"],
    ["BSSH/BAPRAS Scaphoid Guidelines","2022","CT for undisplaced; MRI for occult; screw waist fractures","Early ORIF prevents non-union"],
    ["Tang / Amadio (JHS) — Zone II tendon","2016","6-strand core repair + early active motion: 5% rupture","Belfast/ICAM protocol outperforms passive"],
    ["Atroshi et al. RCT — Open vs endoscopic CTR","2021","Equivalent at 12 months; endoscopic: faster return work","Either is evidence-based; surgeon experience key"],
    ["Soucacos meta-analysis — Replantation","2001","Overall survival: 86% thumb, 79% finger","BEFAVS criteria essential for case selection"],
    ["Palmer classification — TFCC","1989","Class 1A–D + 2A–E systematic framework","Guides surgical planning; 1B = repairable"],
    ["Ring et al. — Metacarpal neck fractures","2018","Buddy strapping equivalent to cast for Boxer's < 70°","Non-operative preferred, early mobilisation"],
    ["NICE guidelines — CTS","2020","Splint first; injection if failed; refer if thenar wasting","Electrodiagnostics recommended before surgery"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 20 Quick reference summary
  {const s=cs(p,"Hand & Wrist — Quick Reference Summary");
  mkTable(p,s,[
    ["Injury","Key Imaging","Definitive Treatment","Do NOT Miss"],
    ["DRF Colles'","X-ray + CT if intra-articular","Cast if stable; VLP if unstable","Die-punch (CT); DRUJ disruption"],
    ["Scaphoid fracture","X-ray → MRI if normal","Cast 6–10w (undisplaced); ORIF (displaced)","Proximal pole fracture → AVN"],
    ["Bennett's fracture","X-ray AP + lateral","CRPP or ORIF","CMC subluxation if missed"],
    ["Zone II tendon injury","Clinical diagnosis","6-strand repair + early active motion","FDS spaghetti (both tendons)"],
    ["Mallet finger","X-ray DIP","Extension splint DIP 8 wks (full-time)","DIP subluxation — needs ORIF"],
    ["Boutonnière (central slip)","Clinical; MRI if doubt","Extension splint PIP 6 wks","Late presentation → fixed deformity"],
    ["Carpal tunnel syndrome","NCS + EMG","CTR open or endoscopic","Thenar wasting = nerve damage"],
    ["Flexor tenosynovitis","Clinical (Kanavel 4)","Emergency surgical irrigation","Delay → tendon necrosis, sepsis"],
    ["Replantation","Plain X-ray of part","BEFAVS criteria → microsurgery","Warm ischaemia > 6h major limb"],
    ["CTS vs cubital tunnel","NCS: median vs ulnar","Splint / CTR vs ulnar nerve decompression","Ring+little = ulnar; Thumb+index = median"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 21 Conclusions
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:.1,fill:{color:G}});
  s.addText("CONCLUSIONS",{x:.5,y:.2,w:9,h:.6,fontSize:26,bold:true,color:GL,fontFace:"Calibri",align:"center"});
  const pts=["Distal radius fractures: volar locking plate is gold standard for displaced/intra-articular; WALANT enables functional testing intraoperatively","Scaphoid: MRI is most sensitive — never dismiss wrist pain post-FOOSH with a normal X-ray; screw fixation for displacement or proximal pole","Zone II flexor tendon: 6-strand repair + early active motion (Belfast/ICAM) — hand therapy is non-negotiable","All 4 Kanavel signs = emergency flexor tenosynovitis decompression within hours — delay risks permanent stiffness","CTS: nightsplint then injection before surgery; endoscopic CTR allows faster return to work (Level I)","Replantation: BEFAVS criteria guide patient selection; thumb replantation always attempted; warm ischaemia time limits decision","Bennett's fracture: CMC subluxation is missed on X-ray — always check thumb CMC joint position on stress view","Hand and wrist surgery is highly specialised — early referral preserves function that cannot be recovered once lost"];
  s.addText(pts.map((pt,i)=>({text:pt,options:{bullet:true,color:i===0||i===2||i===4||i===6?GL:W,fontSize:13,fontFace:"Calibri",paraSpaceAfter:5,breakLine:i<pts.length-1}})),
    {x:.5,y:1.0,w:9,h:4.3,valign:"top"});}

  await p.writeFile({fileName:"slides/hand-wrist-injuries.pptx"});
  console.log("✅  hand-wrist-injuries.pptx  (21 slides)");
}
build().catch(console.error);
