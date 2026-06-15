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
  const p=new pptxgen(); p.layout="LAYOUT_16x9"; p.title="Paediatric Orthopaedics";

  // 1 Title
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:.18,h:5.625,fill:{color:G}});
  s.addText("PAEDIATRIC\nORTHOPAEDICS",{x:.5,y:.6,w:9,h:1.5,fontSize:38,bold:true,color:W,fontFace:"Calibri"});
  s.addText("Growth Plates · DDH · SCFE · Perthes · Clubfoot · Fractures · Infections",{x:.5,y:2.15,w:9,h:.65,fontSize:14,color:GL,fontFace:"Calibri",italic:true});
  s.addShape(p.shapes.RECTANGLE,{x:.5,y:2.95,w:5,h:.04,fill:{color:G},line:{color:G}});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar  |  2026",{x:.5,y:3.1,w:9,h:.4,fontSize:12,color:GL,fontFace:"Calibri",bold:true});}

  // 2 Key differences children vs adults
  {const s=cs(p,"Paediatric vs Adult Orthopaedics — Key Differences");
  mkTable(p,s,[
    ["Feature","Children","Adults","Clinical Implication"],
    ["Growth plate (physis)","Present — weaker than ligament","Absent","Physis injury common; sprains rare in children"],
    ["Remodelling potential","High — up to 10° per year remaining growth","Minimal","Accept more angulation; less aggressive surgery"],
    ["Periosteum","Thick, strong, usually intact on tension side","Thinner","Greenstick / torus fractures; periosteum aids healing"],
    ["Fracture healing","2–3× faster per age group","Standard (weeks/months)","Earlier mobilisation; quicker cast removal"],
    ["Bone composition","Higher water content, lower mineral","More mineralised","Less brittle; plastic deformation possible"],
    ["AVN risk","High with displaced hip fractures","Variable by condition","Urgent fixation for SCFE, hip fracture, septic hip"],
    ["Neurovascular recovery","More neuroplasticity","Limited","Better prognosis for nerve traction injuries"],
    ["Diagnostic","USS useful (non-ossified epiphysis)","CT/MRI standard","Graf classification DDH; Barlow/Ortolani on USS"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 3 Salter-Harris
  {const s=cs(p,"Salter-Harris Classification — Growth Plate Injuries");
  mkTable(p,s,[
    ["Type","Description","Fracture Line","Incidence","Treatment","Prognosis"],
    ["I","Transphyseal — through growth plate only","Through physis","6%","Closed reduction + cast","Excellent (disruption minimal)"],
    ["II","Physis + metaphyseal fragment (Thurston-Holland sign)","Physis + meta","75%","Closed reduction + cast","Good — blood supply intact"],
    ["III","Physis + epiphysis (intra-articular)","Physis + epi","8%","Anatomic reduction (surgical if > 2mm)","Fair — intra-articular step"],
    ["IV","Through meta + physis + epiphysis (intra-articular)","All 3 regions","10%","ORIF mandatory — anatomic","Fair — bar risk with malunion"],
    ["V","Crush injury to physis","Compression","1%","Often missed; immobilise","Poor — growth arrest common"],
    ["VI (Rang)","Periosteal ring injury — peripheral physis damage","Peripheral","Rare","Resect periosteal bridge","Variable — angular deformity risk"],
  ],{x:.3,y:.95,w:9.4,h:3.5});
  s.addText(bl(["Peterson Type VI: periosteal bridge injuries can cause progressive angular deformity — monitor with annual X-rays","Physeal bar formation: partial → angular deformity; complete → LLD. Bar resection if < 50% area, > 2yr growth remaining"]),
    {x:.3,y:4.55,w:9.4,h:.85,valign:"top"});}

  // 4 DDH USS & X-ray
  {const s=cs(p,"DDH — Diagnosis by Age & Imaging");
  twoCol(s,p,
    [{t:"Barlow & Ortolani Tests (0–3 months):",b:true,g:true},"Ortolani: Abduct + lift → clunk = relocation","Barlow: Adduct + push → clunk = dislocation","Sensitivity drops after 3 months (soft tissue tightens)",{t:"Graf Ultrasound Classification:",b:true,g:true},"Type Ia: Normal (α > 60°, β < 55°)","Type Ib: Normal, not fully ossified","Type IIa: Immature (4–12 wks) (α 50–59°)","Type IIb: Delayed ossification (> 12 wks) — treat","Type III: Subluxed (α < 43°, β > 77°) — treat","Type IV: Dislocated — urgent treatment"],
    [{t:"X-ray Assessment (> 4–6 months):",b:true,g:true},"Hilgenreiner's line: horizontal through triradiate cartilage","Perkin's line: vertical through superolateral acetabular edge","Shenton's arc: smooth curve femoral neck to obturator foramen","Acetabular index: normal < 30° (< 1yr), < 25° (2yr), < 22° (3+yr)","CE angle (Centre-Edge of Wiberg): < 20° = dysplastic",{t:"MRI Indications:",b:true,g:true},"Post-reduction assessment (closed or open)","Assess labrum, cartilage (limbus), reduction quality","3D MRI for complex cases, pre-surgical planning","CT: post-ORIF implant check (brief study, radiation minimised)"],
    "< 6 Months","> 6 Months X-ray & MRI");}

  // 5 DDH treatment algorithm
  {const s=p.addSlide(); s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});
  s.addText("DDH Treatment Algorithm",{x:.3,y:0,w:9.4,h:.82,fontSize:21,bold:true,color:W,fontFace:"Calibri",valign:"middle"});
  const bx=[
    {x:.3,y:1.0,w:2.0,h:3.9,t:"0–6 MONTHS\n\nPavlik Harness\n6–12 weeks\n\nGraf IIb:\nPavlik 6wk\n\nGraf III/IV:\nPavlik or\nClosed Reduc.",bg:LN,tc:IC,fs:11},
    {x:2.4,y:1.0,w:2.0,h:3.9,t:"6–18 MONTHS\n\nClosed reduction\nunder GA\n\nHip spica cast\n12–14 weeks\n\nMRI to confirm\nreduction",bg:LN,tc:IC,fs:11},
    {x:4.5,y:1.0,w:2.0,h:3.9,t:"18 MONTHS –\n3 YEARS\n\nOpen reduction\n(medial or\nanterolateral)\n\n+/- Pelvic\nosteotomy\n(Salter or\nPemberton)",bg:"1A5A68",tc:W,fs:11},
    {x:6.6,y:1.0,w:1.7,h:3.9,t:"> 3 YEARS\n\nOpen reduction\n+ Pelvic\nosteotomy\n+ Femoral\nvarus\nderotation\nosteotomy",bg:"8B3A1A",tc:W,fs:11},
    {x:8.4,y:1.0,w:1.3,h:3.9,t:"> 8 YEARS\n\nSalvage\nprocedures:\n\nChiari\nosteotomy\n\nShelf\naugment",bg:"4A2A4A",tc:W,fs:11},
  ];
  bx.forEach(b=>{
    s.addShape(p.shapes.RECTANGLE,{x:b.x,y:b.y,w:b.w,h:b.h,fill:{color:b.bg},shadow:shadow()});
    s.addText(b.t,{x:b.x,y:b.y,w:b.w,h:b.h,fontSize:b.fs,color:b.tc||W,fontFace:"Calibri",align:"center",valign:"middle",bold:true});
  });
  s.addText("Goal: Concentric reduction maintained → normal acetabular development. Earlier intervention = simpler surgery + better outcome.",
    {x:.3,y:5.0,w:9.4,h:.5,fontSize:12,color:GR,fontFace:"Calibri",italic:true,align:"center"});}

  // 6 SCFE detailed
  {const s=cs(p,"SCFE — Classification, Imaging & Management");
  twoCol(s,p,
    [{t:"Pathoanatomy:",b:true,g:true},"Failure through hypertrophic zone of physis","Femoral neck displaces anterosuperior; epiphysis remains in acetabulum","'Ice cream falling off a cone' — posterior and inferior slip",{t:"Classification:",b:true,g:true},"Loder Classification:","- Stable: able to bear weight with/without crutches (AVN risk < 1%)","- Unstable: cannot bear weight (AVN risk 20–50%)",{t:"Radiological Assessment:",b:true,g:true},"Klein's line (AP): line along superior femoral neck should intersect epiphysis","Slippage angle (Southwick): lateral view — severity","Grade I < 30°; Grade II 30–60°; Grade III > 60°"],
    [{t:"Treatment Principles:",b:true,g:true},"All SCFE: non-weight-bearing IMMEDIATELY","Stable SCFE: in-situ fixation with single cannulated screw (centre-centre)","Unstable SCFE: emergency surgery (6–24h)","NEVER attempt forceful reduction — increases AVN risk",{t:"Technique:",b:true,g:true},"Supine on fracture table","Fluoroscopy: AP + frog-leg","Single screw: 6.5 mm or 7.5 mm cannulated","Screw perpendicular to physis, tip in central epiphysis","Both hips? Prophylactic pinning contralateral if < 10 years / high-risk (obesity, endocrinopathy)","Monitor for avascular necrosis: MRI at 3 months if unstable"],
    "Pathology & Classification","Treatment");}

  // 7 Perthes detailed
  {const s=cs(p,"Perthes Disease — Classification & Management");
  twoCol(s,p,
    [{t:"Pathophysiology:",b:true,g:true},"Idiopathic avascular necrosis of femoral head","Vascular event → bone death → revascularisation → repair","Children 4–8 years; Boys > Girls (4:1)","Bilateral: 10–12% (not synchronous)",{t:"Staging (Waldenstrom / Catterall):",b:true,g:true},"Stage I: Synovitis, density change on MRI","Stage II: Fragmentation — extent of head involvement","Stage III: Re-ossification","Stage IV: Healed — residual deformity",{t:"Catterall Classification:",b:true,g:true},"I: Anterior head involved only","II: Anterior 50% + lateral pillar spared","III: 75% involvement, partial lateral pillar","IV: Entire head involved"],
    [{t:"Herring Lateral Pillar Classification:",b:true,g:true},"Group A: Lateral pillar fully maintained","Group B: > 50% height preserved","Group B/C: Borderline — between B and C","Group C: < 50% lateral pillar height",{t:"Treatment by Age + Herring:",b:true,g:true},"< 6 years: All groups → observation","6–8 years: A/B: observe; B/C or C: osteotomy","8–12 years: A: observe; B/C/C: containment surgery",{t:"Containment Goal:",b:true,g:true},"Keep femoral head within acetabulum during healing phase","Femoral varus derotation osteotomy (FVDO)","Salter pelvic osteotomy — 'shelf' osteotomy","Abduction brace (Petrie cast): limited compliance",{t:"Prognostic Factor:",b:true,g:true},"Younger age + Group A: excellent outcome","Older + Group C: residual deformity, early OA"],
    "Pathology & Catterall","Herring & Treatment");}

  // 8 Supracondylar humerus fracture
  {const s=cs(p,"Supracondylar Humerus Fracture — Paediatric Emergency");
  mkTable(p,s,[
    ["Gartland Type","Description","Treatment","Key Nerve at Risk","Notes"],
    ["Type I","Undisplaced / minimal posterior angulation < 20°","Above-elbow cast in 70–90° flexion","None — nerve intact","Monitor for vascular compromise; admit 24h"],
    ["Type II","Displaced, posterior cortex intact","Closed reduction + 2 K-wires if unstable","Anterior interosseous nerve (AIN)","Pin medial-lateral or crossed; check radial pulse"],
    ["Type III","Completely displaced — no cortical contact","Closed reduction + K-wire fixation","AIN, radial nerve","Urgent surgery < 6h if vascular compromise"],
    ["Type IV (Leventhal)","Multidirectional instability","ORIF with K-wires or plate","All 3 nerves at risk","Highest complication rate"],
  ],{x:.3,y:.95,w:9.4,h:2.5});
  s.addText(bl([{t:"Vascular Compromise Assessment — 5 Ps:",b:true,g:true},"Pallor, Pulselessness, Pain on passive stretch, Paraesthesia, Paralysis","Pulseless + pink hand: proceed to urgent reduction → check pulse → if no return → vascular exploration","Pulseless + pale hand: immediate surgical vascular exploration + fracture fixation",{t:"Anterior Interosseous Nerve (AIN) Injury:",b:true,g:true},"Weakness of thumb IP flexion (FPL) + index DIP flexion (FDP)","No sensory loss (pure motor branch of median nerve)","95% recover spontaneously by 3 months — observe; EMG at 3 months if no recovery"]),
    {x:.3,y:3.55,w:9.4,h:1.9,valign:"top"});}

  // 9 Paediatric common fractures
  {const s=cs(p,"Common Paediatric Fractures — Summary Table");
  mkTable(p,s,[
    ["Fracture","Age Group","Mechanism","Key Feature","Treatment","Expected Healing"],
    ["Clavicle (shaft)","All ages","Birth trauma / fall on outstretched hand","Figure-of-8 vs sling — equivalent","Figure-of-8 or arm sling 3–4 wks","Excellent remodelling; bump may persist"],
    ["Toddler's fracture (tibia)","1–4 years","Torsional force, often trivial","Spiral undisplaced tibial fracture; may be occult","AK cast 3–4 wks","Heals fully; exclude NAI"],
    ["Torus / Buckle fracture (distal radius)","5–12 years","FOOSH","Impacted metaphyseal cortex — stable","Wrist splint / rigid wrist brace 3–4 wks (RCT: equivalent to cast)","Excellent; no reduction needed"],
    ["Greenstick fracture","3–10 years","FOOSH / indirect force","One cortex broken, one bent","Closed reduction + cast if > 15° angulation","Good; complete remodelling in younger"],
    ["Pulled elbow / Nursemaid","1–5 years","Sudden traction on extended arm","Radial head subluxation; refuses to move arm","Supination + flex elbow → click — instant success","Complete resolution; re-educate parents"],
    ["Distal radius complete","All ages","FOOSH","Displaced — may need reduction","Closed reduction + plaster cast 4–6 wks","Good; 1–2 mm physeal remodelling ok"],
    ["Femur shaft","All ages","High energy (child ≥ 6yrs): RTA","< 5yrs: Pavlic / spica cast; > 5yrs: elastic nail (TENS)","TENS nail 5–12 yrs; retrograde IM nail > 12 yrs","4–8 weeks union; expect 1 cm overgrowth"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 10 NAI slide
  {const s=cs(p,"Non-Accidental Injury (NAI) — Recognition & Action");
  twoCol(s,p,
    [{t:"Red Flag Fracture Patterns:",b:true,g:true},"Classic metaphyseal lesions (CML / 'corner fractures') — highly specific for NAI","Posterior rib fractures (CPR excluded) — pathognomonic","Bilateral or multiple fractures at different stages of healing","Long bone fractures in pre-ambulatory children","Periosteal reaction without trauma history",{t:"Red Flag History Features:",b:true,g:true},"Inconsistent or changing history","Delay in presentation","Injury inconsistent with developmental stage","History of previous unexplained injuries"],
    [{t:"Investigation Protocol (if NAI suspected):",b:true,g:true},"Skeletal survey: full radiographic survey (not bone scan)","Lateral skull X-ray + intracranial CT","Ophthalmology: retinal haemorrhages (Shaken Baby Syndrome)","Hepatic enzymes (occult abdominal injury)","Coagulation screen, FBC (exclude haematological cause)",{t:"Action if NAI Suspected:",b:true,g:true},"Do NOT confront parents","Document thoroughly and objectively","Senior paediatric consultation","Multi-agency safeguarding team (MAST) referral","Police referral if immediate risk","Child must not be discharged until safeguarding plan in place"],
    "Fracture Patterns & History","Investigations & Safeguarding");}

  // 11 Clubfoot ponseti
  {const s=cs(p,"Clubfoot (CTEV) — Ponseti Method Detail");
  twoCol(s,p,
    [{t:"CAVE Deformity Components:",b:true,g:true},"Cavus (high arch — medial column)","Adductus (forefoot medial displacement)","Varus (hindfoot inversion)","Equinus (plantarflexion of ankle)",{t:"Ponseti Method Steps:",b:true,g:true},"1. Cavus — correct first: supinate forefoot","2. Adductus + Varus — abduct foot against stable lateral head of talus","3. Equinus — correct LAST (once abducted to 70°)","Casts: changed weekly × 5–8 casts","Cast material: fibreglass or plaster above-knee in knee flex","Foot held in corrected position at each stage"],
    [{t:"Achilles Tenotomy:",b:true,g:true},"90% require percutaneous tenotomy after casting","Local or GA; 70° abduction, 20° dorsiflexion achievable after","Post-tenotomy: 3 weeks final cast","Bracing: Foot Abduction Brace (Denis-Browne)","First 3 months: 23 hr/day; then nights + naps till age 4–5 years",{t:"Failure Modes & Relapse:",b:true,g:true},"Relapse: most common in first 2 years; 30% need re-casting","Treat relapse with re-casting +/- tibialis anterior transfer (age 2–3 yrs)","Avoid posteromedial release (PMR) — high recurrence, stiff scarred foot","Pirani score: monitors correction (0 = fully corrected)","French Functional Method: alternative physio-based approach"],
    "Deformity & Casting","Tenotomy & Bracing");}

  // 12 Kocher / Septic arthritis
  {const s=cs(p,"Septic Arthritis — Kocher Criteria & Management");
  mkTable(p,s,[
    ["Kocher Criterion","Threshold","Positive Finding"],
    ["Fever","> 38.5°C","Elevated core temperature"],
    ["Weight-bearing status","Non-weight-bearing","Unable to bear any weight on limb"],
    ["ESR (Erythrocyte Sedimentation Rate)","> 40 mm/hr","Elevated inflammatory marker"],
    ["Serum WBC (White Blood Cell Count)","> 12,000 cells/μL","Systemic leucocytosis"],
    ["CRP (Cahill modification)","> 20 mg/L","Added to increase sensitivity"],
  ],{x:.3,y:.95,w:9.4,h:2.5});
  s.addText(bl([{t:"Kocher Score Interpretation:",b:true,g:true},"0 criteria: < 2% probability of septic arthritis","1 criterion: 9.5%","2 criteria: 35%","3 criteria: 72.8%","4 criteria: 93–99.6% — emergency surgical washout",{t:"Hip: URGENT Surgical Washout (All 4 Kocher):",b:true,g:true},"Capsular pressure → AVN if not decompressed within hours","Anterior approach (Smith-Petersen) or posterior (Gibson)","Send synovial fluid: Gram stain, C&S, cell count","IV antibiotics: Flucloxacillin (Staph) + Gentamicin (Gram neg) — adjust on culture","Continue IV until CRP normalising; total course 3–6 weeks"]),
    {x:.3,y:3.55,w:9.4,h:1.95,valign:"top"});}

  // 13 Osteomyelitis
  {const s=cs(p,"Acute Haematogenous Osteomyelitis — Diagnosis & Treatment");
  twoCol(s,p,
    [{t:"Pathophysiology:",b:true,g:true},"Metaphysis: terminal capillary loops — sluggish blood flow","Bacteria arrested → microabscess → subperiosteal extension","Most common site: distal femur > proximal tibia > proximal humerus",{t:"Organisms by Age:",b:true,g:true},"Neonates (< 1 month): GBS, Staph aureus, Gram-negative","Infants (1–18 months): Staph aureus; also Kingella kingae","Children (> 18 months): Staph aureus (most common)","Sickle cell: Salmonella spp.","MRSA: community-acquired increasing (PVL toxin)"],
    [{t:"Investigations:",b:true,g:true},"WBC + CRP + ESR (daily CRP monitors response)","Blood cultures: positive in 50–60% (before antibiotics)","X-ray: normal first 7–10 days; periosteal reaction later","MRI: MOST SENSITIVE — early bone oedema (day 1–2)","Bone scan (Tc-99m): useful if multifocal / MRI unavailable",{t:"Treatment:",b:true,g:true},"IV antibiotics: Flucloxacillin (MSSA) or Vancomycin (MRSA)","Switch to oral: when CRP < 20, apyrexial, clinically improving","Total antibiotic duration: 3 weeks (uncomplicated)","Surgical drainage: if subperiosteal abscess, no response 48h","Chronic OM: Garre sclerosing, Brodie abscess — sequestrectomy + saucerisation"],
    "Pathology & Organisms","Investigation & Treatment");}

  // 14 Paediatric bone tumours
  {const s=cs(p,"Paediatric Bone Tumours — Recognition & Referral");
  mkTable(p,s,[
    ["Tumour","Age","Location","X-ray Features","Key Facts","Management"],
    ["Osteosarcoma","10–20 yrs","Distal femur, proximal tibia","Codman triangle, sunburst pattern","Most common malignant bone tumour in children","Neo-adjuvant chemo → wide resection + reconstruction"],
    ["Ewing's sarcoma","5–20 yrs","Diaphysis — femur, pelvis, tibia","Onion-skin periosteal reaction, permeative","CDKN2A/EWSR1 gene fusion","Chemo + radiotherapy + surgery"],
    ["Osteochondroma","10–25 yrs","Metaphysis (knee, shoulder)","Pedunculated exostosis — cartilage cap","Most common benign bone tumour","Excise if symptomatic or cap > 2 cm"],
    ["Unicameral bone cyst (UBC)","5–15 yrs","Proximal humerus, proximal femur","Central lucency, endosteal scalloping","Fallen leaf sign if fractured","Steroid injection × 3 or curettage + bone graft"],
    ["Aneurysmal bone cyst (ABC)","10–30 yrs","Posterior vertebra, metaphysis","Eccentric, expansile, soap-bubble","Blood-filled spaces on MRI","Curettage + bone graft or embolisation"],
    ["Langerhans Cell Histiocytosis","1–15 yrs","Skull, spine, pelvis","'Punched-out' lytic lesion, vertebra plana","Eosinophilic granuloma — solitary vs multisystem","Observation / steroids / chemo if multisystem"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 15 Developmental milestones / gait
  {const s=cs(p,"Normal Development — Gait & Lower Limb Alignment");
  twoCol(s,p,
    [{t:"Normal Gait Development:",b:true,g:true},"Walking: 9–15 months (normal up to 18 months)","Mature gait pattern: 7 years","Toe-walking < 3 years: usually physiological","Persistent toe-walking: rule out CP, muscular dystrophy, Achilles contracture",{t:"Lower Limb Rotational Profile:",b:true,g:true},"In-toeing causes by level:","Femur: femoral anteversion (age 3–7, resolves by 10 years)","Tibia: internal tibial torsion (birth – 2 years; resolves)","Foot: metatarsus adductus (see also neonatal foot)","Out-toeing: usually femoral retroversion; normal variant up to age 8"],
    [{t:"Genu Varum (Bow legs):",b:true,g:true},"Physiological: < 2 years; resolves by 18 months","Pathological: Blount disease (infantile vs adolescent)","Blount: Langenskiöld classification I–VI","Treatment: tibial osteotomy if severe; guided growth (8-plate) in adolescent",{t:"Genu Valgum (Knock knees):",b:true,g:true},"Physiological: 3–7 years; resolves by 7–8 years","Intercondylar distance > 8 cm at 7+ years: refer","Causes: rickets, renal osteodystrophy, Morquio syndrome","Treatment: 8-plate (guided growth, reversible) or osteotomy","LLD > 2 cm: epiphysiodesis contralateral limb"],
    "Gait & Rotation","Varus, Valgus & Guided Growth");}

  // 16 CTEV outcomes
  {const s=cs(p,"Ponseti Method Outcomes — Evidence Base");
  barChart(p,s,["Initial correction","Long-term (5yr)","Without tenotomy","Relapse rate (overall)","Need for re-casting","Surgery (posteromedial release)"],[95,78,60,30,25,5],"% Patients (%)",{x:.4,y:1.05,w:9.2,h:3.8});
  s.addText("Data: Laaveg & Ponseti (1980), Dobbs et al. (2004), Goksan et al. systematic review (2006). Relapse highest with non-compliance with foot abduction brace.",
    {x:.3,y:5.2,w:9.4,h:.3,fontSize:10,color:GR,fontFace:"Calibri",italic:true});}

  // 17 Cerebral palsy orthopaedics
  {const s=cs(p,"Cerebral Palsy — Orthopaedic Considerations");
  twoCol(s,p,
    [{t:"Classification:",b:true,g:true},"GMFCS (Gross Motor Function Classification System) I–V","MACS for upper limb","Topographic: hemiplegia, diplegia, quadriplegia",{t:"Common Orthopaedic Problems:",b:true,g:true},"Spastic hip dislocation (Reimers migration index)","Hip surveillance programme: 6-monthly X-rays GMFCS III–V","Spastic equinus foot (equinus varus / valgus)","Scoliosis (C-shaped, long curve, respiratory compromise in GMFCS IV–V)","Crouch gait: hamstring contracture + hip flexion deformity"],
    [{t:"Interventions:",b:true,g:true},"Botulinum toxin: temporary, grade evidence B, reduce spasticity","Serial casting: for equinus","Orthotics: AFO, KAFO, TLSO for scoliosis","SDR (Selective Dorsal Rhizotomy): diplegia, GMFCS II–III","SEMLS (Single Event Multi-Level Surgery): correct gait deviations all at once; not piecemeal",{t:"Hip Dislocation Prevention:",b:true,g:true},"Reimers Index > 30%: consider surgery","Adductor tenotomy / iliopsoas recession","Varus derotation femoral osteotomy","Acetabular reconstruction if needed","Goal: maintain seated stability and pain-free range"],
    "Classification & Problems","Interventions");}

  // 18 Case study 1
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 1 — Unstable SCFE (Emergency)",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b=[["PRESENTATION","13M, obese (BMI 31), RTA\nRight hip pain, unable to bear weight\nHip: ER, shortened, fixed flexion 20°"],
    ["IMAGING","AP X-ray: Klein's line misses epiphysis right\nFrog-leg: severe slippage (Grade III > 60°)\nLeft hip: borderline Klein's line"],
    ["MANAGEMENT","Non-weight-bearing immediately\nEmergency surgery (4 hours from presentation)\nGentle positioning, NO forceful reduction\nIn-situ fixation: single 7.5mm cannulated screw"],
    ["OUTCOME","Post-op AVN monitoring: MRI at 3 months — clear\nProphylactic fixation left hip (age < 14, obese, high risk)\nEndocrine referral: hypothyroidism excluded\nMobility regained at 6 weeks"]];
  b.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 19 Case study 2 NAI
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 2 — NAI / Safeguarding Alert",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b2=[["PRESENTATION","7-month-old male, brought by mother\n'Fell from sofa' — arm not moving\nNot yet crawling (pre-ambulatory)"],
    ["IMAGING","Spiral humeral shaft fracture (transverse)\nChest X-ray: posterior rib fractures (bilateral)\nX-ray right leg: corner metaphyseal lesion distal femur"],
    ["RED FLAGS","3 different injuries at different healing stages\nMechanism inconsistent with development stage\nDelay in seeking treatment (48 hours)"],
    ["SAFEGUARDING ACTION","Senior paediatric consult immediately\nSkeletal survey: further occult fractures found\nChild protection team + police referral\nChild admitted, safeguarding plan activated"]];
  b2.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 20 Key tables summary
  {const s=cs(p,"Paediatric Orthopaedics — Quick Reference Summary");
  mkTable(p,s,[
    ["Condition","Age","Key Test","Definitive Treatment","Watch For"],
    ["DDH","0–3 years","Barlow/Ortolani + USS","Pavlik → closed/open reduction","Late diagnosis = complex surgery"],
    ["SCFE","10–15 yrs (obese)","Klein's line on X-ray","In-situ screw fixation","AVN if unstable — emergency"],
    ["Perthes","4–8 years","Herring lateral pillar on X-ray","Containment (observe or osteotomy)","Younger onset = better prognosis"],
    ["CTEV","Birth","Clinical + Pirani score","Ponseti casting + tenotomy + FAB","Relapse with brace non-compliance"],
    ["Septic arthritis (hip)","Any","Kocher criteria","Emergency surgical washout","AVN from capsular pressure"],
    ["Osteomyelitis","Any","MRI (earliest)","IV Flucloxacillin → oral switch","Chronic OM if missed/undertreated"],
    ["Supracondylar Hx","3–10 years","X-ray + pulse check","Closed reduction + K-wires (Gartland II/III)","AIN injury; vascular compromise"],
    ["NAI","< 5 years","Skeletal survey","Safeguarding referral","Corner fractures, posterior ribs"],
    ["Bone tumour","5–25 years","X-ray + MRI + biopsy","Specialist oncology centre","Codman triangle, sunburst = urgent"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 21 Conclusions
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:.1,fill:{color:G}});
  s.addText("CONCLUSIONS",{x:.5,y:.2,w:9,h:.6,fontSize:26,bold:true,color:GL,fontFace:"Calibri",align:"center"});
  const pts=["Children are NOT small adults — growth plate injuries, remodelling, and developmental timing change management at every level","Salter-Harris III & IV are intra-articular — anatomic reduction is mandatory to prevent OA and physeal arrest","DDH: earlier diagnosis = simpler treatment; Pavlik harness is first-line for < 6 months","SCFE: non-weight-bearing + in-situ fixation immediately — never forceful reduction (AVN risk)","Kocher 4 criteria = emergency hip washout — delay risks avascular necrosis of femoral head","Ponseti method is gold standard for CTEV — 95% correction, avoids posteromedial release surgery","Always consider NAI in pre-ambulatory children with long-bone fractures or inconsistent history","Paediatric bone tumours: Codman triangle / sunburst on X-ray = urgent malignancy referral"];
  s.addText(pts.map((pt,i)=>({text:pt,options:{bullet:true,color:i===0||i===2||i===4||i===6?GL:W,fontSize:13,fontFace:"Calibri",paraSpaceAfter:5,breakLine:i<pts.length-1}})),
    {x:.5,y:1.0,w:9,h:4.3,valign:"top"});}

  await p.writeFile({fileName:"slides/pediatric-orthopedics.pptx"});
  console.log("✅  pediatric-orthopedics.pptx  (21 slides)");
}
build().catch(console.error);
