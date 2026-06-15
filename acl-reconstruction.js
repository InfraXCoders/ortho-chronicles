const pptxgen = require("pptxgenjs");
const NAVY="0F1D3A",GOLD="B8963E",GOLD_L="D4AF5A",WHITE="FFFFFF",BG="F4F6FA",GRAY="64748B";

function header(s,pres,title){
  s.background={color:BG};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.85,fill:{color:NAVY}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0.85,w:10,h:0.06,fill:{color:GOLD}});
  s.addText(title,{x:0.3,y:0,w:9.4,h:0.85,fontSize:22,bold:true,color:WHITE,fontFace:"Calibri",valign:"middle",margin:0});
}
function bullets(items){return items.map((b,i)=>({text:typeof b==="string"?b:b.t,options:{bullet:true,color:typeof b==="string"?"1E293B":(b.g?GOLD:"1E293B"),fontSize:typeof b==="string"?14:(b.s?12:14),bold:b&&b.b||false,fontFace:"Calibri",paraSpaceAfter:5,breakLine:i<items.length-1}}));}

async function build(){
  const pres=new pptxgen();
  pres.layout="LAYOUT_16x9";
  pres.title="ACL Reconstruction — Techniques & Outcomes";

  // Title slide
  let s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:GOLD}});
  s.addText("ACL RECONSTRUCTION",{x:0.5,y:1.0,w:9,h:1.1,fontSize:40,bold:true,color:WHITE,fontFace:"Calibri"});
  s.addText("Techniques, Graft Selection & Return to Sport",{x:0.5,y:2.05,w:9,h:0.7,fontSize:20,color:GOLD_L,fontFace:"Calibri",italic:true});
  s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:2.85,w:5,h:0.04,fill:{color:GOLD},line:{color:GOLD}});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar",{x:0.5,y:3.0,w:9,h:0.4,fontSize:12,color:GOLD_L,fontFace:"Calibri",bold:true});

  // Slide 2 - Epidemiology
  s=pres.addSlide(); header(s,pres,"Epidemiology & Anatomy");
  s.addText(bullets(["200,000+ ACL injuries per year globally","Peak incidence: 15–25 year age group","Female athletes 3–5× higher risk than males","50–70% occur via non-contact mechanism","Sports: football, basketball, skiing, volleyball most common","Associated injuries: meniscal tear (50%), MCL tear (30%), bone bruise (80%)","Anatomy: Anteromedial + Posterolateral bundles","Origin: posterolateral femoral condyle; Insertion: tibial plateau (ACL footprint)"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 3 - Clinical assessment
  s=pres.addSlide(); header(s,pres,"Clinical Assessment & Diagnosis");
  s.addText(bullets([{t:"History:",b:true,g:true},"Audible pop + immediate swelling (haemarthrosis within 2–4 hours)","Inability to continue sport, giving-way episodes",{t:"Clinical Tests:",b:true,g:true},"Lachman Test: most sensitive (85–98%) — anterior tibial translation at 30° flexion","Anterior Drawer: less reliable in acute setting — best at 90°","Pivot Shift: most specific for rotational instability — gold standard for sport return",{t:"MRI Findings:",b:true,g:true},"Primary: ACL fibre disruption, oedema","Secondary: bone bruise (posterolateral tibial plateau + lateral femoral condyle)","Segond fracture (lateral capsule avulsion) — pathognomonic of ACL tear"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 4 - Graft selection
  s=pres.addSlide(); header(s,pres,"Graft Selection");
  // Left col
  s.addShape(pres.shapes.RECTANGLE,{x:4.9,y:1.05,w:0.04,h:4.4,fill:{color:GOLD}});
  s.addText("Autograft Options",{x:0.3,y:1.0,w:4.3,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bullets(["BTB (Bone-Tendon-Bone): Gold standard for athletes — bone-to-bone healing, stiffest","Hamstring (ST/G 4-strand): Less donor site morbidity, good for females","Quadriceps tendon: large graft, rising popularity","Peroneus longus: alternative in revision cases"]),{x:0.3,y:1.38,w:4.3,h:4.0,valign:"top"});
  s.addText("Allograft & Synthetic",{x:5.2,y:1.0,w:4.5,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bullets(["Allograft: Older patients, lower demand, revision ACL","Higher re-rupture rate vs autograft in young athletes","LARS ligament: synthetic, early return to sport — long-term data lacking","Ideal graft diameter: ≥ 8 mm (hamstring); reduces re-rupture risk","BTB tunnel: 10 mm standard","Graft diameter < 8 mm: 3× higher failure rate"]),{x:5.2,y:1.38,w:4.5,h:4.0,valign:"top"});

  // Slide 5 - Surgical technique
  s=pres.addSlide(); header(s,pres,"Surgical Technique — Arthroscopic ACL Reconstruction");
  s.addText(bullets([{t:"Timing of Surgery:",b:true,g:true},"Wait for acute swelling to settle (3–6 weeks) — reduces arthrofibrosis risk","Pre-op: full ROM, quadriceps control, no effusion",{t:"Tunnel Drilling:",b:true,g:true},"Femoral tunnel: anatomic positioning via AM portal or outside-in technique","Tibial tunnel: ACL footprint centre, 55–60° angle","Double-bundle reconstruction for rotational stability (AM + PL bundles)",{t:"Fixation Devices:",b:true,g:true},"BTB: interference screws (titanium or bioabsorbable)","Hamstring: endobutton (cortical fixation) + distal screw","Graft tension: 80–90 N at 20° flexion; fix femur first, tibia at 20° flexion"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 6 - Post-op rehab
  s=pres.addSlide(); header(s,pres,"Post-operative Rehabilitation Protocol");
  s.addText(bullets([{t:"Phase 1 (0–2 weeks): Acute",b:true,g:true},"RICE, CPM, full weight-bearing as tolerated in brace","Quad sets, SLR, ankle pumps, effusion control",{t:"Phase 2 (2–6 weeks): Early Strengthening",b:true,g:true},"Closed kinetic chain: mini-squats, leg press (0–60°)","Stationary cycling, proprioception training, brace weaned",{t:"Phase 3 (6–12 weeks): Progressive Loading",b:true,g:true},"OKC hamstring curls, step-ups, elliptical trainer","Pool running, single-leg balance, sport-specific drills",{t:"Phase 4 (3–6 months): Sport-specific",b:true,g:true},"Running programme, agility, plyometrics, return-to-sport criteria","Criteria: Limb symmetry index > 90%, psychological readiness, pivot-shift negative"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 7 - Complications
  s=pres.addSlide(); header(s,pres,"Complications & Re-rupture Risk");
  s.addText(bullets([{t:"Early Complications:",b:true,g:true},"Arthrofibrosis (cyclops lesion) — 4–5%: prevent with delayed surgery","Infection: 0.3–0.5% — septic arthritis requires washout + antibiotics","Graft failure — technical errors: tunnel malposition (most common cause)","DVT: prophylaxis with LMWH + compression stockings",{t:"Re-rupture & Long-term Outcomes:",b:true,g:true},"Re-rupture rate: 5–10% at 5 years (autograft); 15–25% (allograft in young)","Contralateral ACL injury: 15% in adolescents","Osteoarthritis: 50% radiological OA at 10–15 years","Return to sport rate: 82% — only 55% return to pre-injury level","Psychological factors: fear of re-injury major barrier to full return"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 8 - Key takeaways (dark)
  s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.1,fill:{color:GOLD}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:0.1,fill:{color:GOLD}});
  s.addText("KEY TAKEAWAYS",{x:0.5,y:0.2,w:9,h:0.6,fontSize:24,bold:true,color:GOLD_L,fontFace:"Calibri",align:"center"});
  s.addText([
    {text:"Lachman test is most sensitive; pivot-shift most specific for rotational instability",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Wait 3–6 weeks post-injury before surgery to reduce arthrofibrosis risk",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"BTB autograft remains gold standard for young competitive athletes",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Anatomic tunnel placement is the most important technical factor for success",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Graft diameter ≥ 8 mm significantly reduces re-rupture rate",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:8,breakLine:true}},
    {text:"Return-to-sport criteria: LSI > 90%, not just a time threshold",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:8,breakLine:false}},
  ],{x:0.5,y:1.0,w:9,h:4.3,valign:"top"});

  await pres.writeFile({fileName:"slides/acl-reconstruction.pptx"});
  console.log("✅  slides/acl-reconstruction.pptx created");
}
build().catch(console.error);
