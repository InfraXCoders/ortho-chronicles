const pptxgen = require("pptxgenjs");
const NAVY="0F1D3A",GOLD="B8963E",GOLD_L="D4AF5A",WHITE="FFFFFF",BG="F4F6FA";

function hdr(s,pres,t){
  s.background={color:BG};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.85,fill:{color:NAVY}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0.85,w:10,h:0.06,fill:{color:GOLD}});
  s.addText(t,{x:0.3,y:0,w:9.4,h:0.85,fontSize:22,bold:true,color:WHITE,fontFace:"Calibri",valign:"middle",margin:0});
}
function bl(items){return items.map((b,i)=>({text:typeof b==="string"?b:b.t,options:{bullet:true,color:typeof b==="string"?"1E293B":(b.g?GOLD:"1E293B"),fontSize:14,bold:b&&b.b||false,fontFace:"Calibri",paraSpaceAfter:5,breakLine:i<items.length-1}}));}
function twocol(s,pres,l,r,lt,rt){
  s.addShape(pres.shapes.RECTANGLE,{x:4.9,y:1.05,w:0.04,h:4.4,fill:{color:GOLD}});
  if(lt)s.addText(lt,{x:0.3,y:1.0,w:4.3,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bl(l),{x:0.3,y:1.38,w:4.3,h:4.0,valign:"top"});
  if(rt)s.addText(rt,{x:5.2,y:1.0,w:4.5,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bl(r),{x:5.2,y:1.38,w:4.5,h:4.0,valign:"top"});
}

async function build(){
  const pres=new pptxgen(); pres.layout="LAYOUT_16x9"; pres.title="Paediatric Orthopaedics";

  // Title
  let s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:GOLD}});
  s.addText("PAEDIATRIC",{x:0.5,y:0.8,w:9,h:1.0,fontSize:44,bold:true,color:WHITE,fontFace:"Calibri"});
  s.addText("ORTHOPAEDICS",{x:0.5,y:1.75,w:9,h:0.95,fontSize:38,bold:true,color:GOLD_L,fontFace:"Calibri"});
  s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:2.8,w:5,h:0.04,fill:{color:GOLD},line:{color:GOLD}});
  s.addText("Common Conditions, Growth Plate Injuries & Developmental Disorders",{x:0.5,y:2.95,w:8.5,h:0.55,fontSize:14,color:"CADCFC",fontFace:"Calibri",italic:true});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar",{x:0.5,y:4.1,w:9,h:0.4,fontSize:12,color:GOLD_L,fontFace:"Calibri",bold:true});

  // Slide 2 - Growth plate
  s=pres.addSlide(); hdr(s,pres,"Growth Plate (Physis) — Anatomy & Injury");
  twocol(s,pres,
    ["Physis = most vulnerable structure in the immature skeleton","Located between epiphysis and metaphysis","Growth plate cartilage is weaker than ligaments","Therefore: sprains are rare in children — suspect physis injury",
     "Salter-Harris Classification:","Type I: Transphyseal (Thurston-Holland sign)","Type II: Through physis + metaphyseal fragment (most common 75%)","Type III: Through physis + epiphysis (intra-articular)","Type IV: Through metaphysis + physis + epiphysis","Type V: Crush injury — worst prognosis"],
    ["Management Principles:","Type I & II: usually closed reduction + cast (if < 7–10 days)","Type III & IV: anatomic reduction needed (often surgical)","Type V: often missed — follow-up for growth arrest","Higher type = higher risk of growth disturbance",
     "Growth Arrest Consequences:","Angular deformity (partial arrest)","Limb length discrepancy (complete arrest)","Bar resection for partial physeal bars < 50%","Epiphysiodesis of contralateral limb for LLD"],
    "Physis Biology & Classification","Management");

  // Slide 3 - DDH
  s=pres.addSlide(); hdr(s,pres,"Developmental Dysplasia of Hip (DDH)");
  s.addText(bl([{t:"Incidence:",b:true,g:true},"1–2 per 1000 live births; Female:Male = 6:1","Risk factors: breech, first-born, family history, oligohydramnios",{t:"Spectrum:",b:true,g:true},"Acetabular dysplasia → Subluxation → Complete dislocation",{t:"Diagnosis by Age:",b:true,g:true},"0–6 months: USS (Graf classification) — Barlow & Ortolani tests","6 months – 3 years: X-ray (acetabular index, Hilgenreiner/Perkin lines)","Over 3 years: CT / MRI for surgical planning",{t:"Treatment by Age:",b:true,g:true},"0–6 months: Pavlik harness (80–90% success)","6–18 months: Closed reduction under anaesthesia + spica cast","18 months – 3 years: Open reduction (medial/anterior approach) + pelvic osteotomy","Over 3 years: Pelvic (Salter/Pemberton) + femoral osteotomy"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 4 - SCFE & Perthes
  s=pres.addSlide(); hdr(s,pres,"SCFE & Perthes Disease");
  twocol(s,pres,
    [{t:"SCFE (Slipped Capital Femoral Epiphysis):",b:true},"Peak: obese adolescents (12–15 yrs boys, 10–13 girls)","Bilateral in 20–40% cases","Klein's line on AP X-ray: epiphysis below the line","X-ray: AP + Frog-leg lateral (never force abduction)","Classification: Stable (can bear weight) vs Unstable","Treatment: In-situ fixation with single cannulated screw","Unstable SCFE: emergency fixation — AVN risk 50%","Avoid forceful reduction — increases AVN risk"],
    [{t:"Legg-Calvé-Perthes Disease:",b:true},"Idiopathic AVN of femoral head; age 4–8 years","Boys:Girls = 4:1; bilateral 10–12%","Herring lateral pillar classification (A/B/B-C border/C)","Catterall classification: I–IV (extent of involvement)","Stulberg classification: long-term sphericity",
    "Treatment: Containment principle","< 6 years & Herring A/B: observation","Herring B/C & > 8 years: surgical containment","Femoral varus osteotomy or Salter pelvic osteotomy","Prognosis: younger onset = better outcome"],
    "SCFE","Perthes Disease");

  // Slide 5 - Fractures in children
  s=pres.addSlide(); hdr(s,pres,"Paediatric Fractures — Principles & Common Injuries");
  s.addText(bl([{t:"Key Differences from Adult Fractures:",b:true,g:true},"Remodelling potential: younger age + closer to physis = better remodelling","Periosteum thicker — usually intact on one side (greenstick / torus fractures)","Ligaments stronger than growth plate — avulsion fractures common","Overgrowth: femur fractures in 2–10 yr olds: expect 1–2 cm overgrowth",{t:"Common Injuries:",b:true,g:true},"Clavicle fractures: most common; figure-of-8 or sling; excellent remodelling","Supracondylar humerus fracture: most common elbow fracture (Gartland I–III)","Gartland III: closed reduction + percutaneous K-wires; watch for anterior interosseous nerve","Radial head subluxation (Pulled Elbow / Nursemaid's): supination + flex — audible click","Toddler's fracture: undisplaced spiral tibia — cast 3–4 weeks",{t:"Non-accidental Injury (NAI) — Red Flags:",b:true,g:true},"Multiple fractures at different stages, posterior rib fractures, metaphyseal corner fractures"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 6 - Club foot & flat foot
  s=pres.addSlide(); hdr(s,pres,"Clubfoot (CTEV) & Flatfoot");
  twocol(s,pres,
    [{t:"Congenital Talipes Equinovarus (CTEV):",b:true},"Incidence: 1–2 per 1000 live births; M:F = 2:1","Bilateral in 50% cases","Components (CAVE mnemonic):","Cavus (high arch), Adductus (forefoot), Varus (hindfoot), Equinus (plantarflexion)","Ponseti method: gold standard","Serial casting × 5–8 casts (weekly)","90% require percutaneous Achilles tenotomy","Then foot abduction brace (FAB) — 23hr/day × 3 months, then nights","Re-casting for relapse — avoid posteromedial release (high recurrence)"],
    [{t:"Paediatric Flatfoot:",b:true},"Flexible flat foot: most common, usually physiological","Normal arch development by age 6–7 years","When to treat: pain, shoe wear difficulties, rigid flat foot","Rigid flat foot: tarsal coalition (most common cause)","Coalition: calcaneonavicular (fibrous) or talocalcaneal (cartilaginous/bony)","Diagnosis: CT scan for coalition","Treatment: Coalition excision before secondary OA develops","Physiotherapy, arch supports for flexible flatfoot","Surgical: calcaneal lengthening (Evans) or medialising osteotomy for painful flexible flatfoot"],
    "Clubfoot","Flatfoot");

  // Slide 7 - Bone & joint infections
  s=pres.addSlide(); hdr(s,pres,"Paediatric Bone & Joint Infections");
  s.addText(bl([{t:"Acute Haematogenous Osteomyelitis:",b:true,g:true},"Most common in metaphysis (terminal loops — sluggish flow)","Organism: Staph aureus (most common all ages); Salmonella in sickle cell; GBS in neonates","Clinical: fever, local tenderness, reluctance to move limb","Investigations: WBC, CRP, ESR, blood cultures (50% positive), MRI (most sensitive)","Treatment: IV antibiotics 48h; oral switch when CRP < 20; total 3–6 weeks",{t:"Septic Arthritis:",b:true,g:true},"Kocher criteria: fever > 38.5°C, non-weight-bearing, ESR > 40, WBC > 12,000","4 criteria = 99% probability of septic arthritis","Kocher 4: emergency washout; < 2 criteria: observe","Hip: always surgical washout — risk of AVN from capsular pressure",{t:"Tuberculous Osteomyelitis:",b:true,g:true},"Cold abscess, pathological fracture, gibbus deformity (spinal TB)","Treatment: ATT × 9–12 months; surgical for cord compression"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 8 - Takeaways
  s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.1,fill:{color:GOLD}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:0.1,fill:{color:GOLD}});
  s.addText("KEY TAKEAWAYS",{x:0.5,y:0.2,w:9,h:0.6,fontSize:24,bold:true,color:GOLD_L,fontFace:"Calibri",align:"center"});
  s.addText([
    {text:"Children are not small adults — growth plate injuries need special attention",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Salter-Harris Type III & IV are intra-articular — anatomic reduction mandatory",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"DDH: Pavlik harness is first-line; timing of diagnosis determines treatment complexity",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"SCFE: in-situ fixation immediately — never attempt forceful reduction",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Ponseti method is gold standard for CTEV — serial casting + tenotomy",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Kocher 4 criteria for septic arthritis = emergency surgical washout",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Always consider NAI in unusual fracture patterns in young children",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:0,breakLine:false}},
  ],{x:0.5,y:1.0,w:9,h:4.3,valign:"top"});

  await pres.writeFile({fileName:"slides/pediatric-orthopedics.pptx"});
  console.log("✅  slides/pediatric-orthopedics.pptx created");
}
build().catch(console.error);
