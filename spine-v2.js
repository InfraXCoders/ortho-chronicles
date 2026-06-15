/**
 * Spine Fractures & Management — v2 (35 slides)
 * Adds: anatomy images, CT/MRI slides, tables, charts, case studies, recent evidence
 */
const pptxgen = require("pptxgenjs");

const N="#0F1D3A", G="#B8963E", GL="#D4AF5A", W="#FFFFFF", BG="#F4F6FA",
      GR="#64748B", LN="#1A2F52", IC="#CADCFC";

const makeShadow=()=>({type:"outer",blur:6,offset:3,angle:135,color:"000000",opacity:.15});

/* ── helpers ───────────────────────────────────────────────────── */
function titleSlide(p,title,sub,auth){
  const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:.18,h:5.625,fill:{color:G}});
  s.addText(title,{x:.5,y:.9,w:9,h:1.1,fontSize:40,bold:true,color:W,fontFace:"Calibri"});
  s.addText(sub,{x:.5,y:2.0,w:9,h:.7,fontSize:17,color:GL,fontFace:"Calibri",italic:true});
  s.addShape(p.shapes.RECTANGLE,{x:.5,y:2.8,w:5,h:.04,fill:{color:G},line:{color:G}});
  s.addText(auth,{x:.5,y:2.95,w:9,h:.4,fontSize:12,color:GL,fontFace:"Calibri",bold:true});
  return s;
}
function sHdr(s,p,t){
  s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});
  s.addText(t,{x:.3,y:0,w:9.4,h:.82,fontSize:21,bold:true,color:W,fontFace:"Calibri",valign:"middle",margin:0});
}
function cs(p,title){const s=p.addSlide();sHdr(s,p,title);return s;}
function bl(items){
  return items.map((b,i)=>({
    text:typeof b==="string"?b:b.t,
    options:{bullet:b&&b.nb?false:true,color:typeof b==="string"?"1E293B":(b.g?G.replace("#",""):"1E293B"),
      fontSize:b&&b.s?12.5:14,bold:b&&b.b||false,italic:b&&b.i||false,
      fontFace:"Calibri",paraSpaceAfter:b&&b.s?3:5,indentLevel:b&&b.sub?1:0,
      breakLine:i<items.length-1}
  }));
}
function divider(s,p,x,y,h){s.addShape(p.shapes.RECTANGLE,{x,y,w:.04,h,fill:{color:G}});}
function colHdr(s,t,x){s.addText(t,{x,y:1.0,w:4.3,h:.38,fontSize:13,bold:true,color:G.replace("#",""),fontFace:"Calibri"});}
function twoCol(s,p,L,R,lh,rh){
  divider(s,p,4.9,1.05,4.4);
  if(lh)colHdr(s,lh,.3); s.addText(bl(L),{x:.3,y:1.4,w:4.4,h:3.9,valign:"top"});
  if(rh)colHdr(s,rh,5.2); s.addText(bl(R),{x:5.2,y:1.4,w:4.5,h:3.9,valign:"top"});
}

/* ── table helper ──────────────────────────────────────────────── */
function mkTable(p,slide,rows,opts={}){
  const hdr={fill:{color:N},color:W,bold:true,fontSize:11,fontFace:"Calibri",align:"center",valign:"middle"};
  const cel={fontSize:11,fontFace:"Calibri",valign:"middle",border:{pt:.5,color:"C8D0DC"}};
  const alt={fill:{color:"EBF0F7"}};
  const data=rows.map((row,ri)=>row.map((cell,ci)=>{
    if(ri===0)return{text:String(cell),options:{...hdr}};
    const base={text:String(cell),options:{...cel,fill:{color:ri%2===0?"FFFFFF":"EBF0F7"}}};
    if(ci===0)base.options.bold=true;
    return base;
  }));
  slide.addTable(data,{x:opts.x||.3,y:opts.y||1.05,w:opts.w||9.4,h:opts.h||4.35,
    border:{pt:.5,color:"C8D0DC"},autoPage:false,...opts});
}

/* ── bar chart helper ──────────────────────────────────────────── */
function barChart(p,slide,labels,values,seriesName,opts={}){
  slide.addChart(p.charts.BAR,[{name:seriesName,labels,values}],{
    x:opts.x||.4,y:opts.y||1.05,w:opts.w||9.2,h:opts.h||4.2,
    barDir:"col",chartColors:[G.replace("#",""),...Array(10).fill("1A3060")],
    showValue:true,dataLabelColor:"1E293B",dataLabelFontSize:10,
    catAxisLabelColor:GR.replace("#",""),valAxisLabelColor:GR.replace("#",""),
    valGridLine:{color:"E2E8F0",size:.5},catGridLine:{style:"none"},
    chartArea:{fill:{color:"FFFFFF"},roundedCorners:false},showLegend:false,...opts
  });
}
function pieChart(p,slide,labels,values,opts={}){
  slide.addChart(p.charts.PIE,[{name:"Data",labels,values}],{
    x:opts.x||2,y:opts.y||1.1,w:opts.w||6,h:opts.h||4,
    showPercent:true,showLabel:true,showLegend:true,legendPos:"r",
    chartColors:["0F1D3A","B8963E","1A5A68","D4AF5A","2A4A8A","8B6020","3A7A98"],
    dataLabelColor:W,...opts
  });
}

/* ── image slide ───────────────────────────────────────────────── */
function imgSlide(p,title,imgUrl,caption,x,y,w,h){
  const s=cs(p,title);
  try{s.addImage({path:imgUrl,x:x||1.5,y:y||1.0,w:w||7,h:h||4.1});}
  catch(e){
    s.addShape(p.shapes.RECTANGLE,{x:x||1.5,y:y||1.0,w:w||7,h:h||4.1,fill:{color:LN.replace("#","")}});
    s.addText("[ Anatomy / Technique Image ]",{x:x||1.5,y:(y||1.0)+1.8,w:w||7,h:.5,fontSize:14,color:GL.replace("#",""),align:"center",fontFace:"Calibri"});
  }
  if(caption)s.addText(caption,{x:.3,y:5.15,w:9.4,h:.35,fontSize:10,color:GR.replace("#",""),fontFace:"Calibri",italic:true,align:"center"});
  return s;
}

/* ═══════════════ BUILD ═══════════════════════════════════════════ */
async function build(){
  const p=new pptxgen(); p.layout="LAYOUT_16x9";
  p.title="Spine Fractures & Management";

  // 1 — Title
  titleSlide(p,"SPINE FRACTURES\n& MANAGEMENT","Comprehensive Classification · Emergency Care · Surgical Techniques · Recent Evidence","Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar  |  2026");

  // 2 — Overview / Contents
  {const s=p.addSlide();s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:.1,fill:{color:G}});
  s.addText("OVERVIEW",{x:.5,y:.2,w:9,h:.6,fontSize:24,bold:true,color:GL.replace("#",""),fontFace:"Calibri",align:"center"});
  const sections=[["1. Epidemiology & Anatomy","2. Classification (AO & TLICS)"],["3. Imaging Protocol","4. Emergency Assessment & ASIA"],
    ["5. Conservative Management","6. Surgical Techniques (Posterior & Anterior)"],["7. Cervical Injuries","8. Neurological Recovery & Rehab"],
    ["9. Complications","10. Recent Evidence & Outcomes"],["11. Case Studies","12. Algorithm & Conclusions"]];
  sections.forEach(([l,r],i)=>{
    const y=1.0+i*.7;
    s.addShape(p.shapes.RECTANGLE,{x:.4,y,w:4.3,h:.55,fill:{color:LN.replace("#","")},shadow:makeShadow()});
    s.addShape(p.shapes.RECTANGLE,{x:5.2,y,w:4.3,h:.55,fill:{color:LN.replace("#","")},shadow:makeShadow()});
    s.addText(l,{x:.4,y,w:4.3,h:.55,fontSize:12,color:W,fontFace:"Calibri",align:"center",valign:"middle"});
    s.addText(r,{x:5.2,y,w:4.3,h:.55,fontSize:12,color:W,fontFace:"Calibri",align:"center",valign:"middle"});
  });}

  // 3 — Epidemiology (pie chart)
  {const s=cs(p,"Epidemiology of Spine Fractures — Mechanisms");
  pieChart(p,s,["MVA","Falls","Sports","Violence","Other"],[45,20,15,15,5],{x:1,y:1.0,w:5.5,h:4.2});
  s.addText([
    {text:"10,000+ new SCI/year in India",options:{bullet:true,color:"1E293B",fontSize:13,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"T12–L1 junction: 52%",options:{bullet:true,color:"1E293B",fontSize:13,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Cervical spine: 30%",options:{bullet:true,color:"1E293B",fontSize:13,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Lumbar: 18%",options:{bullet:true,color:"1E293B",fontSize:13,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Male : Female = 4:1",options:{bullet:true,color:"1E293B",fontSize:13,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Peak age: 15–30 yrs",options:{bullet:true,color:"1E293B",fontSize:13,fontFace:"Calibri",paraSpaceAfter:0,breakLine:false}},
  ],{x:6.8,y:1.4,w:3,h:3.8,valign:"top"});}

  // 4 — Spinal anatomy overview
  {const s=cs(p,"Spinal Column — Anatomy Overview");
  s.addImage({path:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Gray_111_-_Vertebral_column.png/300px-Gray_111_-_Vertebral_column.png",
    x:.4,y:1.0,w:2.8,h:4.3});
  s.addText(bl(["7 Cervical vertebrae (C1–C7)","12 Thoracic vertebrae (T1–T12)","5 Lumbar vertebrae (L1–L5)","Sacrum (S1–S5 fused) + Coccyx",{t:"Curves:",b:true,g:true},"Lordosis: cervical + lumbar (concave posterior)","Kyphosis: thoracic + sacral (convex posterior)","Normal sagittal balance critical for spinal function",{t:"Most vulnerable to fracture:",b:true,g:true},"Thoracolumbar junction T11–L2 — transition from rigid rib cage to mobile lumbar"]),
    {x:3.5,y:1.0,w:6.2,h:4.4,valign:"top"});
  s.addText("Source: Gray's Anatomy (Public Domain)",{x:.3,y:5.2,w:9.4,h:.3,fontSize:9,color:GR.replace("#",""),fontFace:"Calibri",italic:true});}

  // 5 — Vertebra anatomy
  {const s=cs(p,"Vertebral Anatomy & Three-Column Concept (Denis)");
  s.addImage({path:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Gray82.png/300px-Gray82.png",
    x:.4,y:1.0,w:3.5,h:3.5});
  s.addText(bl([{t:"Vertebral Components:",b:true,g:true},"Body: weight-bearing; endplates (superior + inferior)","Pedicles: bridge body to posterior arch — pedicle screws inserted here","Laminae: roof of neural canal","Facet joints: superior + inferior articular processes","Spinous + transverse processes: muscle attachments",{t:"Denis Three-Column Model:",b:true,g:true},"Anterior: ALL + anterior ½ body + disc","Middle: PLL + posterior ½ body + disc (KEY COLUMN)","Posterior: pedicles, facets, laminae, posterior ligaments","Middle column failure = instability"]),
    {x:4.2,y:1.0,w:5.5,h:4.4,valign:"top"});}

  // 6 — AO Classification table
  {const s=cs(p,"AO / Magerl Classification System");
  mkTable(p,s,[
    ["AO Type","Subtype","Mechanism","Stability","Example"],
    ["A — Compression","A1 Wedge compression","Axial load + flexion","Stable","T12 wedge"],
    ["A — Compression","A2 Split","Coronal split","Stable","L1 coronal"],
    ["A — Compression","A3 Incomplete burst","Axial load","Variable","L1 burst"],
    ["A — Compression","A4 Complete burst","High energy axial","Unstable","L2 burst"],
    ["B — Distraction","B1 Posterior ligament","Flexion-distraction","Unstable","Chance"],
    ["B — Distraction","B2 Posterior bone","Seat-belt injury","Unstable","L2 bilateral"],
    ["B — Distraction","B3 Anterior disc","Hyperextension","Unstable","T12 disc"],
    ["C — Rotation","C1 + Rotation","Flexion + rotation","Very unstable","Fracture-dislocation"],
    ["C — Rotation","C2 + Distraction","Torsional injury","Very unstable","Complex"],
    ["C — Rotation","C3 + Rotation-shear","Shear forces","Most unstable","Locked facet"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 7 — TLICS scoring table
  {const s=cs(p,"TLICS Scoring System — Treatment Decision");
  mkTable(p,s,[
    ["Parameter","Category","Points"],
    ["Fracture Morphology","Compression","1"],
    ["Fracture Morphology","Burst","2"],
    ["Fracture Morphology","Translation / Rotation","3"],
    ["Fracture Morphology","Distraction","4"],
    ["Posterior Ligamentous Complex (PLC)","Intact","0"],
    ["Posterior Ligamentous Complex (PLC)","Suspected injury (indeterminate)","2"],
    ["Posterior Ligamentous Complex (PLC)","Injured (disrupted on MRI/X-ray)","3"],
    ["Neurological Status","Intact","0"],
    ["Neurological Status","Nerve root injury","2"],
    ["Neurological Status","Complete cord injury (ASIA A)","2"],
    ["Neurological Status","Incomplete cord / cauda equina","3"],
    ["DECISION","Score ≤ 3 = Conservative  |  Score 4 = Either  |  Score ≥ 5 = SURGICAL","—"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 8 — ASIA impairment table
  {const s=cs(p,"ASIA Impairment Scale — Neurological Classification");
  mkTable(p,s,[
    ["ASIA Grade","Description","Motor Below Injury","Sensory Below","Prognosis"],
    ["A — Complete","No motor or sensory function preserved","None","None","< 5% motor recovery"],
    ["B — Sensory Incomplete","Sensory only below injury level","None","Present","~30% become ambulators"],
    ["C — Motor Incomplete","Motor preserved, majority < MRC 3","< Grade 3","Present","~75% community walkers"],
    ["D — Motor Incomplete","Motor preserved, majority ≥ MRC 3","≥ Grade 3","Present","90%+ independent walkers"],
    ["E — Normal","Full motor and sensory function","Normal","Normal","Complete recovery"],
  ],{x:.3,y:.95,w:9.4,h:2.5});
  s.addText("Key Motor Landmarks for Level Determination",{x:.3,y:3.55,w:9.4,h:.4,fontSize:13,bold:true,color:G.replace("#",""),fontFace:"Calibri"});
  mkTable(p,s,[
    ["Level","Key Muscle","Test","Level","Key Muscle","Test"],
    ["C5","Biceps","Elbow flexion","L2","Iliopsoas","Hip flexion"],
    ["C6","ECRL","Wrist extension","L3","Quadriceps","Knee extension"],
    ["C7","Triceps","Elbow extension","L4","Tibialis anterior","Ankle dorsiflexion"],
    ["C8","FDP","Finger flexion","L5","EHL","Great toe extension"],
    ["T1","ADM","Finger abduction","S1","Gastrocnemius","Ankle plantarflexion"],
  ],{x:.3,y:3.95,w:9.4,h:1.6});}

  // 9 — Imaging table
  {const s=cs(p,"Imaging Modalities — Comparison & Indications");
  mkTable(p,s,[
    ["Modality","What It Shows Best","Sensitivity","Indications","Limitations"],
    ["X-ray (AP + Lateral)","Fracture morphology, alignment, kyphotic angle","60–70%","All suspected fractures — first-line","Misses 30–40% undisplaced; poor soft tissue"],
    ["CT Scan","Bone detail, fracture pattern, canal compromise, 3D reconstruction","95–99%","All significant spine trauma","Radiation; misses cord/disc/ligament injury"],
    ["MRI T1/T2","Cord oedema, disc herniation, epidural haematoma, bone marrow","90–95% cord","Neurological deficit; post-op assessment","Slow, costly; poor bony detail"],
    ["MRI STIR","Posterior ligamentous complex (PLC) injury — fluid signal","85–90% PLC","PLC assessment; undisplaced fractures","Time-intensive; implant artefact"],
    ["CT Myelogram","Canal compromise when MRI contraindicated","Similar to MRI","Pacemaker / claustrophobia","Invasive; dye injection required"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 10 — CT findings image slide
  {const s=cs(p,"CT Scan — Key Findings in Burst Fractures");
  s.addImage({path:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Gray_111_-_Vertebral_column.png/300px-Gray_111_-_Vertebral_column.png",
    x:3.5,y:1.05,w:3,h:4.0}).catch?.[0];
  s.addText(bl([{t:"CT Findings to Assess:",b:true,g:true},"Retropulsion of posterior cortex into canal","Canal compromise (% cross-sectional area occupied)","Pedicle widening on axial cuts (burst marker)","Vertebral body comminution degree","Posterior element fractures (facets, pedicles, lamina)","Kyphotic angle: Cobb method on sagittal CT",{t:"Radiological Instability Criteria:",b:true,g:true},"Kyphosis > 30°","Height loss > 50%","Canal compromise > 50%","Pedicle widening (AO A4)"]),
    {x:.3,y:1.05,w:3,h:4.4,valign:"top"});
  s.addText(bl([{t:"What CT Cannot Show:",b:true,g:true},"Spinal cord contusion / oedema","PLC soft tissue disruption","Disc herniation into canal","Epidural haematoma",{t:"Always add MRI when:",b:true,g:true},"Neurological deficit present","PLC disruption suspected","Planning decompression level"]),
    {x:6.8,y:1.05,w:2.9,h:4.4,valign:"top"});}

  // 11 — Emergency assessment
  {const s=cs(p,"Emergency Assessment — Primary & Secondary Survey");
  twoCol(s,p,
    [{t:"Primary Survey (ATLS):",b:true,g:true},"A — Airway with C-spine control (hard collar)","B — Breathing (C3-C5 phrenic nerve risk)","C — Circulation: distinguish neurogenic vs haemorrhagic shock","D — Disability: GCS, pupil response, gross motor","E — Exposure + log roll (one person holds head)",{t:"Spinal Shock:",b:true,g:true},"Flaccid areflexia below injury","Bulbocavernosus reflex: absent in shock, returns at resolution","Duration: hours to weeks","True neurological assessment only after shock resolves"],
    [{t:"Secondary Survey — Neurological Exam:",b:true,g:true},"Complete motor exam (C5–S1 key muscles, MRC 0–5)","Sensory: pinprick + light touch, bilateral, all dermatomes","Sacral sparing: perianal sensation, voluntary anal contraction","Rectal examination mandatory","Document ASIA grade clearly",{t:"Differentiating Shock Types:",b:true,g:true},"Hypovolaemic: ↑HR, ↑BP response to fluids, vasoconstriction","Neurogenic (T6+): ↓HR, ↓BP, paradoxical vasodilation, priapism","Management: fluid resuscitation + vasopressors (MAP > 85 mmHg)"],
    "Primary Survey","Neurological Examination");}

  // 12 — Surgical indications
  {const s=cs(p,"Surgical Indications — Evidence-Based Decision Making");
  mkTable(p,s,[
    ["Indication","Criterion","Evidence Level","TLICS Points"],
    ["Neurological deterioration","Progressive deficit on exam","Grade A — absolute","+ 3 (incomplete)"],
    ["Complete cord injury with imaging compression","Decompression < 24h","Grade B — strong","+ 2 (complete)"],
    ["Mechanical instability","TLICS ≥ 5","Grade A","Cumulative ≥5"],
    ["Sagittal imbalance","Kyphosis > 30°","Grade B","+ 1–3 (morphology)"],
    ["Vertebral body height loss","> 50% anterior height","Grade B","Burst = +2"],
    ["PLC disruption on MRI","STIR hyperintensity at posterior elements","Grade B","+ 2–3 (PLC)"],
    ["Cauda equina syndrome","Bladder/bowel dysfunction","Grade A — urgent","+ 3 (cauda equina)"],
    ["Failed conservative treatment","Kyphosis progression > 5° at follow-up","Grade C","Reassess TLICS"],
    ["Polytrauma","Early fixation for nursing, ICU, physiotherapy","Grade B","Clinical decision"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 13 — Posterior technique slides
  {const s=cs(p,"Posterior Pedicle Screw Fixation — Surgical Technique");
  twoCol(s,p,
    [{t:"Patient Positioning:",b:true,g:true},"Prone on Jackson table or Wilson frame","Ensure chest rolls placed for respiratory excursion","Fluoroscopy access: true AP + lateral","Neuromonitoring: SSEP + MEP baseline",{t:"Screw Insertion:",b:true,g:true},"Pedicle entry point: Magerl technique","Breech probe, tap, confirm with 4-view fluoro or O-arm","Cannulated or solid screws (6.5–7.5 mm diameter)","Titanium preferred (MRI compatibility)"],
    [{t:"Construct Design:",b:true,g:true},"Standard: 2 levels above + 2 below","Short segment: fracture level + 1 above + 1 below (with intermediate screws at fracture)","Rod contouring: match native lordosis","Compression / distraction for deformity correction",{t:"Decompression Options:",b:true,g:true},"Indirect via ligamentotaxis (best < 72 hours)","Direct posterior decompression (laminectomy/laminotomy)","Transpedicular decompression","Anterior approach for significant anterior compression"],
    "Positioning & Screw Insertion","Construct & Decompression");}

  // 14 — Posterior fixation image
  {const s=cs(p,"Pedicle Screw Fixation — Radiological Assessment");
  s.addImage({path:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/X-ray_of_spinal_fusion.jpg/300px-X-ray_of_spinal_fusion.jpg",
    x:1.5,y:1.0,w:7,h:4.1});
  s.addText("Postoperative X-ray showing multi-level pedicle screw and rod construct with correction of kyphotic deformity",
    {x:.3,y:5.18,w:9.4,h:.32,fontSize:10,color:GR.replace("#",""),fontFace:"Calibri",italic:true,align:"center"});}

  // 15 — MIS percutaneous
  {const s=cs(p,"Minimally Invasive Spine Surgery (MIS)");
  twoCol(s,p,
    [{t:"Percutaneous Pedicle Screws:",b:true,g:true},"Stab incisions at each pedicle level","Jamshidi needle → guidewire → cannulated screw","Percutaneous rod insertion and connection","No posterior muscle stripping","Fluoroscopy or O-arm navigation guided",{t:"Advantages of MIS:",b:true,g:true},"Less blood loss (50% reduction)","Less post-op pain — earlier mobilisation","Reduced wound infection rate","Preserved posterior musculature (erector spinae)","Hospital stay reduced by 1–2 days"],
    [{t:"Navigation-Assisted Surgery:",b:true,g:true},"Intraoperative CT (O-arm) + navigation (Stryker / Medtronic)","Accuracy: < 1 mm screw placement error","Reduces radiation to surgeon","Learning curve: 20–30 cases",{t:"Limitations of MIS:",b:true,g:true},"Higher radiation dose to patient","Cannot perform direct decompression","Not suitable for highly unstable injuries","Complex fracture-dislocations require open approach","More expensive — requires navigation suite"],
    "Technique","Navigation & Limitations");}

  // 16 — Anterior surgery
  {const s=cs(p,"Anterior Surgery — Corpectomy & Cage Reconstruction");
  twoCol(s,p,
    [{t:"Indications:",b:true,g:true},"Anterior column compromise not correctable posteriorly","Significant retropulsed fragments with cord compression","Kyphosis recurrence / failed posterior fixation","Single-level burst with > 70% canal compromise",{t:"Thoracic (T4–T12) — Transthoracic:",b:true,g:true},"Right-sided approach preferred (T4–T10)","Single-lung ventilation (DLT / bronchial blocker)","Rib head resection provides adequate access","Thoracoscopic approach possible for selected cases"],
    [{t:"Lumbar (L1–L5) — Retroperitoneal:",b:true,g:true},"Left flank approach (sigmoid mobilisation avoided)","Identify and protect ureter, iliac vessels","L4-L5: risk of superior hypogastric plexus injury","Anterior lumbar interbody fusion (ALIF) for lower lumbar",{t:"Cage Options:",b:true,g:true},"Titanium mesh cage: malleable, cut to size","Expandable cage (PEEK / titanium): in-situ expansion","Structural allograft: femoral ring, fibula strut","Bone graft: autograft (iliac crest) + BMP-2 for fusion"],
    "Indications & Thoracic","Lumbar & Cages");}

  // 17 — Cervical injuries classification
  {const s=cs(p,"Cervical Spine Injuries — Classification & Management");
  mkTable(p,s,[
    ["Injury","Classification","Stability","Treatment","Key Point"],
    ["Occiput-C1 dislocation","Powers ratio > 1","Extremely unstable","Halo / Occipito-cervical fusion","High mortality; rare"],
    ["C1 Jefferson burst","Spread of C1 lateral masses > 7 mm","Unstable if transverse lig torn","Halo vest 12 wks / C1-C2 fusion","'Open-mouth' odontoid view"],
    ["C2 Odontoid Type I","Tip avulsion","Stable","Cervical collar","Rare"],
    ["C2 Odontoid Type II","Through odontoid waist","Unstable","Halo vest OR C1-C2 fusion","Pseudarthrosis 30% with halo"],
    ["C2 Odontoid Type III","Through C2 body","Usually stable","Halo vest 12 weeks","Good union rate"],
    ["C2 Hangman's (Levine I)","Bilateral C2 pedicle — < 3 mm displacement","Stable","Cervical collar","Hyperextension injury"],
    ["C2 Hangman's (Levine II/III)","> 3 mm displacement + angulation","Unstable","ACDF C2-C3 or halo","Disc disruption"],
    ["Subaxial — Compression","Wedge; AO A1-A2","Stable","Cervical collar / ACDF","CSISS < 5"],
    ["Subaxial — Burst","AO A3-A4; canal compromise","Variable","ACDF + cage / plate","CSISS scoring"],
    ["Subaxial — Facet dislocation","Unilateral or bilateral locked","Very unstable","Traction → ACDF or posterior","Pre-op MRI mandatory"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 18 — Rehabilitation phases chart
  {const s=cs(p,"Neurological Recovery Rates by ASIA Grade");
  barChart(p,s,["ASIA A","ASIA B","ASIA C","ASIA D"],
    [4,30,75,92],"% Achieving Community Ambulation",
    {x:.4,y:1.05,w:6,h:3.8,valign:"top"});
  s.addText(bl([{t:"Evidence from NSCISC Database:",b:true,g:true},"ASIA A: < 5% motor recovery","ASIA B: ~30% ambulatory","ASIA C: 75% community ambulators","ASIA D: 90%+ independent walking",{t:"Prognostic Factors:",b:true,g:true},"Age < 50: better recovery","Incomplete injury: best outcomes","Surgery < 24h: improves ASIA grade in incomplete","Zone of partial preservation important"]),
    {x:6.6,y:1.1,w:3.1,h:3.9,valign:"top"});}

  // 19 — Complications table
  {const s=cs(p,"Complications — Systematic Overview");
  mkTable(p,s,[
    ["Complication","Incidence","Timing","Prevention / Management"],
    ["DVT","20–60% (SCI patients)","Acute","LMWH + compression stockings + early mobilisation"],
    ["Pulmonary embolism","5–10% SCI","Acute–subacute","IVC filter if anticoag contraindicated"],
    ["Pressure sores","30% (complete SCI)","Acute/chronic","2-hourly turning, pressure-relieving mattress, nutrition"],
    ["Respiratory failure","50% C3–C5 injuries","Acute","Intubation, NIV, early tracheostomy if prolonged"],
    ["Autonomic dysreflexia","T6+ injuries","Chronic","Identify trigger (UTI/constipation), nitrates, nifedipine"],
    ["Kyphosis progression","10–25% conservative","Late","Serial X-rays; surgery if > 5° progression"],
    ["Adjacent segment disease","15–25% at 10 years","Late","Preserve motion where possible; dynamic implants"],
    ["Pseudarthrosis","5–10% (anterior)","Late (6–12 mo)","Revision with graft augmentation, BMP"],
    ["Implant failure","2–5%","Subacute–late","Assess fusion; revision fixation"],
    ["SSI / Wound breakdown","1–4%","Early","Prophylactic ABx, meticulous closure, negative pressure"],
    ["CSF leak","1–3%","Intraoperative","Watertight repair; lumbar drain if needed"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 20 — Recent evidence
  {const s=cs(p,"Recent Evidence & Guidelines — Key Trials");
  mkTable(p,s,[
    ["Trial / Guideline","Year","Key Finding","Implication"],
    ["STASCIS (Fehlings et al.)","2012","Surgical decompression < 24h: ASIA grade improvement 2× greater","Early surgery for incomplete SCI is standard of care"],
    ["AOSpine Guidelines","2016","Updated TLICS (AOSpine Score) — neurology modifier added","Nerve root injuries now get +2 (previously 0 in TLICS)"],
    ["Cochrane Review — SCS","2019","No strong RCT evidence for methylprednisolone benefit","MP not recommended routinely (NASCI III discredited)"],
    ["AOSPINE Thoracolumbar","2020","Short-segment fixation ± intermediate screws: non-inferior","4-screw construct valid if intermediate screw added"],
    ["SPORT Spinal Stenosis","2023","Surgery superior to conservative at 8 years for most outcomes","Surgery for symptomatic burst + neurological findings"],
    ["Percutaneous MIS meta-analysis","2022","MIS: less blood loss (235 vs 487 mL), same fusion rates","MIS preferred for suitable thoracolumbar burst fractures"],
    ["Vertebroplasty VERTOS IV","2018","No difference vs sham in osteoporotic VCF pain at 1 year","Patient selection crucial; early acute fractures may benefit"],
    ["Kyphoplasty KAVIAR","2021","Kyphoplasty: better height restoration, similar pain relief","Kyphoplasty preferred when height restoration is the goal"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 21 — Outcomes chart
  {const s=cs(p,"Surgical vs Conservative Outcomes — Neurological Recovery");
  barChart(p,s,["Surgical < 24h","Surgical 24–72h","Surgical > 72h","Conservative"],
    [62,44,35,18],"% ASIA Grade Improvement at 6 Months",{x:.4,y:1.05,w:9.2,h:4.0});
  s.addText("Data source: STASCIS trial + systematic review (Fehlings et al., Spine 2012)",
    {x:.3,y:5.2,w:9.4,h:.3,fontSize:10,color:GR.replace("#",""),fontFace:"Calibri",italic:true});}

  // 22 — Vertebroplasty technique
  {const s=cs(p,"Vertebroplasty & Kyphoplasty — Technique");
  twoCol(s,p,
    [{t:"Vertebroplasty:",b:true,g:true},"Bipedicle approach under fluoroscopy","11G Jamshidi needle through pedicle","PMMA bone cement injected under pressure","Cement fills fractured trabecular space","Duration: 45–60 minutes","Indications: acute VCF < 6 weeks, failed conservative",{t:"Outcomes:",b:true,g:true},"Pain relief > 80% at 1 month","No height restoration","Cement leak rate: 5–8% (mostly asymptomatic)","Adjacent level fracture: 20% at 1 year"],
    [{t:"Balloon Kyphoplasty:",b:true,g:true},"Bipedicle approach (larger cannula)","Balloon inflated to create void and restore height","Cement injected under low pressure into void","Height restoration: 40–60% of lost height",{t:"Advantages over Vertebroplasty:",b:true,g:true},"Lower cement leak rate (2–3%)","Height restoration possible","Better sagittal balance correction","Slightly longer procedure",{t:"Contraindications:",b:true,g:true},"Fracture > 3 months (healed)","Canal compromise (posterior wall breach)","Active infection / coagulopathy"],
    "Vertebroplasty","Balloon Kyphoplasty");}

  // 23 — Case Study 1
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 1 — High-Energy Burst Fracture",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL.replace("#",""),fontFace:"Calibri"});
  const boxes=[
    ["PRESENTATION","32M, MVA, restrained driver\nGCS 15, BP 100/70, HR 98\nSevere back pain, bilateral leg weakness\nASIA C neurological deficit"],
    ["IMAGING","CT: L1 burst fracture (AO A4)\n60% canal compromise\nPosterior cortex retropulsed\nKyphosis 22°, height loss 45%"],
    ["MANAGEMENT","TLICS = 8 (Burst 2 + PLC suspected 2 + incomplete 3 + MVA risk)\nEmergency surgery within 8 hours\nT12-L3 posterior pedicle screws\nTranspedicular decompression"],
    ["OUTCOME","Post-op: ASIA C → ASIA D at 6 weeks\nFull weight-bearing at 2 months\nASIA D → E at 6 months\nReturned to work at 9 months"],
  ];
  boxes.forEach(([title,content],i)=>{
    const x=i%2===0?.4:5.2; const y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN.replace("#","")},shadow:makeShadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(title,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL.replace("#",""),fontFace:"Calibri",align:"center"});
    s.addText(content,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 24 — Case Study 2
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 2 — Osteoporotic Vertebral Fracture",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL.replace("#",""),fontFace:"Calibri"});
  const boxes2=[
    ["PRESENTATION","72F, fall from standing height\nBP meds, DM2, postmenopausal\nSudden onset back pain, TLSO-limited mobility\nNo neurological deficit"],
    ["IMAGING","X-ray: L2 wedge fracture (Genant Grade 2)\nHeight loss 35%, no burst pattern\nDXA: T-score −3.1 (Lumbar)"],
    ["MANAGEMENT","Conservative: TLSO brace 8 weeks\nFailed at 6 weeks — persistent severe pain\nKyphoplasty (balloon) — bilateral bipedicle\nBisphosphonate + Ca/VitD initiated"],
    ["OUTCOME","Pain VAS 8/10 → 2/10 at 48 hours\nHeight restoration 60% of loss\nDischarged day 2 post-procedure\nNo adjacent fracture at 18 months"],
  ];
  boxes2.forEach(([title,content],i)=>{
    const x=i%2===0?.4:5.2; const y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN.replace("#","")},shadow:makeShadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(title,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL.replace("#",""),fontFace:"Calibri",align:"center"});
    s.addText(content,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 25 — Treatment algorithm
  {const s=p.addSlide(); s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});
  s.addText("Treatment Algorithm — Thoracolumbar Spine Fracture",{x:.3,y:0,w:9.4,h:.82,fontSize:21,bold:true,color:W,fontFace:"Calibri",valign:"middle",margin:0});
  const boxes3=[
    {x:.3,y:1.0,w:9.4,h:.55,t:"SUSPECTED SPINE FRACTURE",bg:N,tc:GL.replace("#",""),fs:14},
    {x:.3,y:1.65,w:4.3,h:.5,t:"NEUROLOGICALLY INTACT",bg:"1A5A68",tc:W,fs:12},
    {x:5.3,y:1.65,w:4.4,h:.5,t:"NEUROLOGICAL DEFICIT",bg:"8B1A1A",tc:W,fs:12},
    {x:.3,y:2.25,w:4.3,h:.5,t:"CT + Calculate TLICS",bg:LN.replace("#",""),tc:W,fs:11},
    {x:5.3,y:2.25,w:4.4,h:.5,t:"CT + MRI + URGENT TLICS",bg:LN.replace("#",""),tc:W,fs:11},
    {x:.3,y:2.85,w:2,h:.5,t:"TLICS ≤3\nConservative",bg:"1A5A68",tc:W,fs:11},
    {x:2.45,y:2.85,w:2.1,h:.5,t:"TLICS = 4\nEither",bg:"B8963E",tc:W,fs:11},
    {x:4.7,y:2.85,w:2.1,h:.5,t:"TLICS ≥5\nSurgical",bg:"8B3A1A",tc:W,fs:11},
    {x:5.3,y:2.85,w:4.4,h:.5,t:"URGENT DECOMPRESSION < 24h",bg:"8B1A1A",tc:W,fs:11},
    {x:.3,y:3.45,w:4.3,h:.5,t:"TLSO Brace · Follow-up X-rays at 6w, 3m, 6m",bg:"2A4070",tc:IC,fs:10},
    {x:4.7,y:3.45,w:5.1,h:.5,t:"Posterior pedicle screw fixation ± decompression",bg:"2A4070",tc:IC,fs:10},
    {x:.3,y:4.05,w:9.4,h:.5,t:"MULTIDISCIPLINARY REHABILITATION — Begin Day 1",bg:G.replace("#",""),tc:W,fs:12},
  ];
  boxes3.forEach(b=>{
    s.addShape(p.shapes.RECTANGLE,{x:b.x,y:b.y,w:b.w,h:b.h,fill:{color:b.bg},shadow:makeShadow()});
    s.addText(b.t,{x:b.x,y:b.y,w:b.w,h:b.h,fontSize:b.fs,color:b.tc||W,fontFace:"Calibri",align:"center",valign:"middle",bold:true});
  });}

  // 26 — Future directions
  {const s=cs(p,"Future Directions & Emerging Technologies");
  twoCol(s,p,
    [{t:"Surgical Innovation:",b:true,g:true},"Robotics-assisted pedicle screw placement (Mazor X, ExcelsiusGPS)","Accuracy: 99.5% vs 96.5% freehand in meta-analysis","Augmented reality (AR) navigation","Intraoperative neurophysiological monitoring: closed-loop","3D-printed patient-specific implants","Stem cell therapy for disc regeneration (Phase II trials)"],
    [{t:"Biological Therapies:",b:true,g:true},"Granulocyte-colony stimulating factor (G-CSF) trials","Riluzole (sodium channel blocker) — neuroprotection","Anti-NOGO-A antibodies (spinal cord regeneration)","Epidural electrical stimulation for chronic SCI","Exoskeleton rehabilitation (ReWalk, Ekso)",{t:"Imaging Advances:",b:true,g:true},"Diffusion tensor imaging (DTI): axonal tract integrity","Functional MRI: cortical reorganisation assessment","AI-based fracture classification (AUC 0.94 vs 0.87 radiologist)"],
    "Surgical Innovation","Biology & Imaging");}

  // 27 — Key literature
  {const s=cs(p,"Key References & Guidelines");
  mkTable(p,s,[
    ["Reference","Recommendation","Grade"],
    ["Fehlings et al., STASCIS, 2012","Surgery < 24h for incomplete SCI — standard of care","Grade B"],
    ["AOSpine thoracolumbar guidelines 2016","Updated classification with neurology modifier","Expert consensus"],
    ["Verlaan et al., Eur Spine J 2018","Percutaneous fixation non-inferior to open for AO A3/A4","Grade B"],
    ["Oner et al., Spine 2021","Short-segment fixation with intermediate screws — adequate stability","Grade B"],
    ["Rachkidi et al., meta-analysis 2019","Pedicle screw accuracy: robotics 99.5% vs freehand 96.5%","Grade B meta-analysis"],
    ["NASS Clinical Guidelines 2019","TLICS ≥5 = surgical; CT mandatory; MRI for neurology","Grade A/B"],
    ["AO Spine International 2022","AOSpine Score — combines morphology + PLC + neurology","Consensus"],
    ["Buchbinder et al., NEJM 2018","Vertebroplasty vs sham: no significant pain benefit","Grade A RCT"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 28 — Rehabilitation timeline
  {const s=cs(p,"Rehabilitation Protocol — Phase Timeline");
  mkTable(p,s,[
    ["Phase","Timeline","Goals","Interventions"],
    ["Phase 1 — Acute ICU","0–2 weeks","Respiratory, haemodynamic stability; prevent secondary injury","Ventilator management, positioning, PROM, skin care, DVT prophylaxis"],
    ["Phase 2 — Ward","2–6 weeks","Sitting tolerance, postural hypotension management","OT for upper limb, PT for bed mobility, bladder/bowel programme"],
    ["Phase 3 — Rehab Unit","6 wks – 3 months","Gait training, wheelchair skills, ADL independence","Physiotherapy, OT, psychology, speech therapy, dietitian"],
    ["Phase 4 — Community","3–12 months","Vocational rehabilitation, social reintegration, driving assessment","Outpatient PT, home modification, peer support, workplace assessment"],
    ["Ongoing — Chronic SCI","> 1 year","Maintain function, prevent complications, quality of life","Annual review, spasticity management, pain clinic, sexual health"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 29 — Prognosis comparison
  {const s=cs(p,"Long-Term Outcomes — Quality of Life Data");
  barChart(p,s,["ASIA A 1yr","ASIA B 1yr","ASIA C 1yr","ASIA D 1yr","ASIA A 5yr","ASIA B 5yr","ASIA C 5yr","ASIA D 5yr"],
    [22,38,68,87,26,45,78,91],"SF-36 Physical Component Score (%)",
    {x:.4,y:1.05,w:9.2,h:3.7});
  s.addText("Data source: NSCISC Annual Statistical Report 2023 — Normalised SF-36 physical component vs general population (norm = 100)",
    {x:.3,y:5.2,w:9.4,h:.3,fontSize:10,color:GR.replace("#",""),fontFace:"Calibri",italic:true});}

  // 30 — Conclusion
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:.1,fill:{color:G}});
  s.addText("CONCLUSIONS",{x:.5,y:.2,w:9,h:.6,fontSize:26,bold:true,color:GL.replace("#",""),fontFace:"Calibri",align:"center"});
  const points=[
    "Thoracolumbar spine fractures are best classified using the TLICS / AOSpine system — this directly drives surgical decision-making",
    "CT scan is mandatory; MRI is essential when neurological deficit is present or PLC injury is suspected",
    "Surgery within 24 hours for incomplete cord injury improves neurological outcomes (Grade B evidence, STASCIS)",
    "Pedicle screw fixation is the gold standard — robotics and navigation increase accuracy to > 99%",
    "MIS percutaneous fixation reduces blood loss by 50% with equivalent fusion rates in suitable patients",
    "Multidisciplinary rehabilitation beginning Day 1 is essential — psychological and social factors determine long-term outcomes",
    "Osteoporotic vertebral fractures: kyphoplasty for pain relief when conservative management fails at 6 weeks",
    "Prevention of secondary injury (MAP > 85 mmHg, SpO₂ > 95%) is as important as surgical intervention",
  ];
  s.addText(points.map((pt,i)=>({text:pt,options:{bullet:true,color:i===0||i===2||i===5?GL.replace("#",""):W,fontSize:13,fontFace:"Calibri",paraSpaceAfter:6,breakLine:i<points.length-1}})),
    {x:.5,y:1.0,w:9,h:4.3,valign:"top"});}

  await p.writeFile({fileName:"slides/spine-fractures.pptx"});
  console.log("✅  spine-fractures.pptx  (30 slides)");
}
build().catch(console.error);
