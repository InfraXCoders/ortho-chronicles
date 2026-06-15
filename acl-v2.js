const pptxgen = require("pptxgenjs");
const N="0F1D3A",G="B8963E",GL="D4AF5A",W="FFFFFF",BG="F4F6FA",GR="64748B",LN="1A2F52",IC="CADCFC";
const shadow=()=>({type:"outer",blur:6,offset:3,angle:135,color:"000000",opacity:.15});

function sHdr(s,p,t){
  s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});
  s.addText(t,{x:.3,y:0,w:9.4,h:.82,fontSize:21,bold:true,color:W,fontFace:"Calibri",valign:"middle",margin:0});
}
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
  const data=rows.map((row,ri)=>row.map((cell,ci)=>{
    if(ri===0)return{text:String(cell),options:{...hdr}};
    const b={text:String(cell),options:{...cel,fill:{color:ri%2===0?"FFFFFF":"EBF0F7"}}};
    if(ci===0)b.options.bold=true; return b;
  }));
  slide.addTable(data,{x:opts.x||.3,y:opts.y||1.05,w:opts.w||9.4,h:opts.h||4.35,border:{pt:.5,color:"C8D0DC"},autoPage:false,...opts});
}
function barChart(p,slide,labels,values,name,opts={}){
  slide.addChart(p.charts.BAR,[{name,labels,values}],{
    x:opts.x||.4,y:opts.y||1.05,w:opts.w||9.2,h:opts.h||4.2,barDir:"col",
    chartColors:[G,...Array(10).fill(LN)],showValue:true,dataLabelColor:"1E293B",dataLabelFontSize:10,
    catAxisLabelColor:GR,valAxisLabelColor:GR,valGridLine:{color:"E2E8F0",size:.5},catGridLine:{style:"none"},
    chartArea:{fill:{color:"FFFFFF"},roundedCorners:false},showLegend:false,...opts
  });
}

async function build(){
  const p=new pptxgen(); p.layout="LAYOUT_16x9"; p.title="ACL Reconstruction";

  // 1 Title
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:.18,h:5.625,fill:{color:G}});
  s.addText("ACL RECONSTRUCTION",{x:.5,y:.8,w:9,h:1.0,fontSize:40,bold:true,color:W,fontFace:"Calibri"});
  s.addText("Diagnosis · Graft Selection · Surgical Technique · Return to Sport",{x:.5,y:1.85,w:9,h:.65,fontSize:16,color:GL,fontFace:"Calibri",italic:true});
  s.addShape(p.shapes.RECTANGLE,{x:.5,y:2.65,w:5,h:.04,fill:{color:G},line:{color:G}});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar  |  2026",{x:.5,y:2.8,w:9,h:.4,fontSize:12,color:GL,fontFace:"Calibri",bold:true});}

  // 2 Epidemiology
  {const s=cs(p,"Epidemiology & Burden of ACL Injuries");
  const stats=[["200,000+","ACL tears/year\nglobally"],["3–5×","Higher risk\nin females"],["50–70%","Non-contact\nmechanism"],["82%","Return to sport\nrate (literature)"]];
  stats.forEach(([n,l],i)=>{
    const x=.3+i*2.35;
    s.addShape(p.shapes.RECTANGLE,{x,y:1.05,w:2.1,h:1.6,fill:{color:LN},shadow:shadow()});
    s.addText(n,{x,y:1.15,w:2.1,h:.8,fontSize:28,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(l,{x,y:1.9,w:2.1,h:.65,fontSize:10,color:IC,fontFace:"Calibri",align:"center"});
  });
  s.addText(bl(["Peak incidence: 15–25 year age group; adolescent females most vulnerable","Sports: football (soccer), basketball, skiing, volleyball, rugby","Associated injuries at time of ACL tear:",{t:"Meniscal tear: 50% (medial > lateral)",sub:true},{t:"MCL tear: 30%",sub:true},{t:"Bone bruise posterolateral tibial plateau + lateral femoral condyle: 80%",sub:true},"Annual economic burden: USD 7.6 billion globally (direct + indirect costs)","Re-injury risk: 15–30% in athletes returning to sport before 9 months"]),
    {x:.3,y:2.75,w:9.4,h:2.6,valign:"top"});}

  // 3 Knee anatomy
  {const s=cs(p,"Knee Anatomy — Ligaments & ACL Bundle Structure");
  twoCol(s,p,
    [{t:"Knee Stabilisers:",b:true,g:true},"ACL — primary restraint to anterior tibial translation","PCL — primary restraint to posterior tibial translation","MCL — medial stability, secondary ACL restraint","LCL — lateral stability","Posterolateral corner (PLC): popliteus, popliteofibular ligament",{t:"ACL Origin & Insertion:",b:true,g:true},"Origin: Posterolateral wall of intercondylar notch (femoral)","Insertion: Tibial plateau — anterior to tibial spine (ACL footprint)","Length: 32–38 mm, diameter 10–12 mm",{t:"ACL Function:",b:true,g:true},"Limits anterior tibial translation (primary — 85%)","Limits internal tibial rotation (secondary)","Limits hyperextension"],
    [{t:"Anteromedial (AM) Bundle:",b:true,g:true},"Tight in flexion (90°)","Controls anterior-posterior stability","Primary reconstructed bundle in single-bundle ACL",{t:"Posterolateral (PL) Bundle:",b:true,g:true},"Tight in extension (0°)","Controls rotational stability (pivot shift)","Reconstructed in double-bundle technique",{t:"Why Double-Bundle?:",b:true,g:true},"Single-bundle misses rotational instability","Double-bundle: better pivot shift, no difference in clinical outcomes (KANON trial)","Most centres: anatomic single-bundle is standard","Double-bundle reserved for high-demand athletes with rotational laxity"],
    "Anatomy Overview","ACL Bundle Anatomy");}

  // 4 Clinical assessment
  {const s=cs(p,"Clinical Assessment — History & Examination");
  mkTable(p,s,[
    ["Clinical Test","Sensitivity","Specificity","Notes"],
    ["Lachman test (30° flexion)","85–98%","94%","Gold standard for anterior laxity; grade 0–3"],
    ["Anterior Drawer (90° flexion)","41–68%","77%","Less reliable in acute; hamstring guarding reduces accuracy"],
    ["Pivot Shift test","24–98%","98%","Most specific; tests rotational instability; grade 0–3"],
    ["KT-1000 arthrometer","90%","88%","Objective anterior laxity measurement; > 3 mm side-to-side difference"],
    ["MRI (1.5T)","87–94%","93–97%","Best for AM bundle; PL bundle harder to visualise; assess menisci"],
    ["Thessaly test for meniscus","64–89%","67–96%","Twisting on single-leg stance at 20°; concurrent meniscal tear"],
    ["Valgus stress (MCL)","87%","91%","Combined ACL+MCL injury ('terrible triad' includes lateral meniscus)"],
    ["Dial test (PLC)","41%","98%","External rotation asymmetry > 10° at 30° vs 90° flexion"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 5 MRI findings
  {const s=cs(p,"MRI Findings in ACL Tear");
  twoCol(s,p,
    [{t:"Direct Signs of ACL Tear:",b:true,g:true},"Discontinuity of ACL fibres (complete/partial)","Oedema within Hoffa's fat pad","Haematoma in joint space","Low T1 / High T2 signal within ACL substance","Horizontal orientation of torn fibres (acute)","ACL absent from its normal location",{t:"Segond Fracture:",b:true,g:true},"Avulsion of lateral tibial plateau","Caused by internal rotation + varus stress","Highly specific for ACL tear (99%)"],
    [{t:"Secondary Signs ('Bone Bruise'):",b:true,g:true},"Posterolateral tibial plateau contusion","Lateral femoral condyle (sulcus terminalis) contusion","Seen in 80% of acute ACL tears on STIR","'Kissing contusions' = pivot shift mechanism",{t:"Associated Injuries on MRI:",b:true,g:true},"Medial meniscus posterior horn tear (50%)","Lateral meniscal tear (30%)","MCL partial/complete tear","PCL injury (rare in ACL-only)",{t:"PLC Injury Assessment:",b:true,g:true},"Fibular styloid avulsion on coronal","Arcuate sign: LCL + biceps femoris avulsion","Asymmetric joint space widening"],
    "Direct & Secondary Signs","MRI Associated Injuries");}

  // 6 Graft selection table
  {const s=cs(p,"Graft Selection — Comparison Table");
  mkTable(p,s,[
    ["Graft","Strength","Stiffness","Donor Site","Best For","Failure Rate (5yr)"],
    ["BTB (Bone-Patellar Tendon-Bone)","2400 N","620 N/mm","Anterior knee pain (10%)","Young athletes, contact sports","3–5%"],
    ["Hamstring ST/G 4-strand","2422 N","776 N/mm","Hamstring weakness (10%)","Non-contact sports, females","5–8%"],
    ["Quadriceps tendon","2352 N","463 N/mm","Minimal anterior knee","Revision, large graft needed","4–6%"],
    ["Peroneus longus autograft","3500 N","N/A","Ankle eversion weakness (minimal)","Revision ACL; alternative","5–7%"],
    ["Allograft (BTB/Achilles)","2376 N","485 N/mm","None","Older (> 30 yrs), low demand","15–25% (young athletes)"],
    ["LARS synthetic ligament","2000 N","High","None","Early return to sport (controversial)","8–15% (long-term)"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 7 Graft size matters
  {const s=cs(p,"Why Graft Diameter Matters — Evidence");
  barChart(p,s,["< 7 mm","7–7.9 mm","8–8.9 mm","≥ 9 mm"],[22,14,6,3],"Re-rupture Rate (%)",
    {x:.3,y:1.05,w:6,h:4.0,valDir:"col"});
  s.addText(bl([{t:"Key Evidence:",b:true,g:true},"Snaebjornsson et al. 2017 (AJSM)","< 8 mm graft: 3× higher re-rupture risk","Optimal: ≥ 9 mm hamstring graft",{t:"If Hamstring < 8 mm:",b:true,g:true},"Augment with gracilis (quad-strand)","Consider BTB as primary graft","Add peroneus longus augmentation","Double-bundle technique","Synthethic augment (LARS + tendon)"]),
    {x:6.6,y:1.1,w:3.1,h:3.9,valign:"top"});}

  // 8 Surgical technique
  {const s=cs(p,"Surgical Technique — Arthroscopic ACL Reconstruction");
  twoCol(s,p,
    [{t:"Pre-operative:",b:true,g:true},"Delay surgery 3–6 weeks — swelling resolved, ROM restored, quad control","Pre-op exam under anaesthesia (EUA): confirm ACL +/- other ligament injury","Tourniquet: 250 mmHg; leg holder; scope + camera setup",{t:"Diagnostic Arthroscopy:",b:true,g:true},"Standard anteromedial + anterolateral portals","Systematic assessment: medial compartment, lateral compartment, PCL, notch","Meniscal repair if repairable (inside-out or all-inside)","Notchplasty if needed: 5 mm from cartilage edge"],
    [{t:"Tunnel Preparation:",b:true,g:true},"Tibial tunnel: 55–60° angle, ACL stump centre, transtibial or freehand","Femoral tunnel: AM portal (preferred) or outside-in — anatomic positioning at 10:30 (R) or 1:30 (L) o'clock","Avoid vertical tunnel (isometric but no rotational control)","Minimum tunnel length: ≥ 25 mm femur, ≥ 30 mm tibia",{t:"Graft Passage & Fixation:",b:true,g:true},"Graft tensioned at 80–90 N at 20° flexion","Femoral fixation first (endobutton / interference screw)","Tibial fixation with knee at 20° flexion (interference screw + backup staple)","Knee cycled 15× before final tibial fixation"],
    "Pre-op & Diagnostic","Tunnels & Fixation");}

  // 9 Intraoperative image
  {const s=cs(p,"Arthroscopic Landmarks — Intraoperative Views");
  s.addText(bl([{t:"Arthroscopic Anatomy Checklist:",b:true,g:true},"ACL footprint on tibia: oval, 11 mm × 17 mm","Femoral footprint: posterolateral wall, lateral intercondylar ridge (resident's ridge)","Blumensaat's line: confirm ACL on lateral X-ray","Radial probe: confirm tunnel position",{t:"Common Technical Errors:",b:true,g:true},"Vertical femoral tunnel → poor rotational stability","Tibial tunnel too anterior → graft impinges in extension","Notch impingement: ensure 2 mm clearance at full extension","Over-tensioning graft → stiffness and loss of flexion",{t:"Intraoperative C-arm Check:",b:true,g:true},"Lateral view: femoral tunnel posterior wall 1–2 mm","AP view: tunnel positions confirmed within footprint","Graft length: 7–8 mm in each tunnel for interference screw"]),
    {x:.3,y:1.05,w:9.4,h:4.3,valign:"top"});}

  // 10 Fixation devices
  {const s=cs(p,"Fixation Devices — Comparison");
  mkTable(p,s,[
    ["Device","Type","Graft","Pull-out Strength","Advantages","Disadvantages"],
    ["Interference screw (titanium)","Intratunnel","BTB","680–800 N","Strong, bone-to-bone","Metallic artefact on MRI"],
    ["Interference screw (PEEK/bioresorbable)","Intratunnel","BTB/Hamstring","580–650 N","MRI compatible, absorbable","Stress shielding, inflammatory (PLGA)"],
    ["Endobutton (cortical button)","Extratunnel","Hamstring","1960 N","Strongest construct","Graft-tunnel motion (bungee effect)"],
    ["Cross-pin (TransFix / Rigidfix)","Transfixion","Hamstring","1400 N","No bungee, good fixation","Bone bridge removal risk"],
    ["Staples / Bicortical screw","Extratunnel","Any","850 N","Backup fixation","Bulky, extraarticular"],
    ["Suture anchor","Extratunnel","Small graft","650 N","Used in revision","Limited graft surface"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 11 Rehab protocol
  {const s=cs(p,"Post-operative Rehabilitation — Phase Protocol");
  mkTable(p,s,[
    ["Phase","Timeline","Goals","Key Exercises","Criteria to Progress"],
    ["1 — Acute","0–2 weeks","Reduce swelling, restore extension, quad activation","Quad sets, SLR, ankle pumps, ice/elevation, PROM","Full passive extension, effusion controlled"],
    ["2 — Early Strengthening","2–6 weeks","Closed-chain strengthening, proprioception","Mini-squats, leg press (0–60°), stationary cycling, step-ups","Single-leg stand, no effusion, brace weaned"],
    ["3 — Progressive Loading","6–12 weeks","Increase load, introduce sport-specific movements","OKC hamstring (> 10 wks), pool running, elliptical, agility ladder","Hip-to-ankle alignment, 70% LSI quadriceps"],
    ["4 — Return to Training","3–5 months","Plyometrics, agility, sport-specific drills","Plyometrics, cutting drills, sport-specific practice","LSI > 85%, psychological readiness (ACL-RSI)"],
    ["5 — Return to Sport","6–9 months","Full competition readiness","Match play, contact training","LSI > 90%, pivot-shift negative, ACL-RSI > 65"],
    ["6 — Long-term Prevention","> 9 months","ACL injury prevention, strength maintenance","FIFA 11+ or Sportsmetrics programme, gym-based maintenance","Ongoing — reduce re-injury risk"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 12 Return to sport criteria
  {const s=cs(p,"Return-to-Sport Criteria — Functional Tests");
  mkTable(p,s,[
    ["Test","Metric","Pass Criterion","Tool"],
    ["Quadriceps LSI (Limb Symmetry Index)","Isokinetic dynamometry at 60°/s","≥ 90%","Biodex / Cybex"],
    ["Hamstring LSI","Isokinetic 60°/s","≥ 90%","Biodex / Cybex"],
    ["Single-leg hop for distance","Distance × 100 / contralateral","≥ 90%","Measuring tape"],
    ["Triple hop for distance","3 consecutive hops","≥ 90%","Measuring tape"],
    ["Crossover hop","3 crossover hops, 15 cm line","≥ 90%","Tape on floor"],
    ["6-metre timed hop","Time on 6-metre course","< 10% difference","Stopwatch"],
    ["T-test agility","Cone agility test","< 10% difference","Stopwatch"],
    ["ACL-RSI (psychological)","12-item psychological readiness scale","Score ≥ 65/100","Questionnaire"],
    ["Pivot-shift test","Manual pivot shift under anaesthesia (if revision)","Grade 0–I","Clinical exam"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 13 Complications table
  {const s=cs(p,"Complications & Their Management");
  mkTable(p,s,[
    ["Complication","Incidence","Timing","Prevention","Management"],
    ["Arthrofibrosis","4–5%","Early (1–3 mo)","Delayed surgery, early ROM","MUA, cyclops resection (arthroscopic)"],
    ["Infection (septic arthritis)","0.3–0.5%","Early (2–6 wks)","Prophylactic ABx, aseptic technique","Washout × 2, IV antibiotics, graft retention if possible"],
    ["Graft failure","5–10% at 5yr","Any time","Anatomic tunnels, graft ≥ 8 mm, correct rehab","Revision ACL (staging + CT tunnel assessment)"],
    ["DVT","1–2%","Early","LMWH 2 weeks, compression stockings","LMWH therapeutic dose, DOAC"],
    ["Anterior knee pain","10–15% BTB","Ongoing","Avoid BTB in kneeling athletes","Physio, offloading brace, rarely hardware removal"],
    ["Notch impingement","2–3%","Immediate","Notchplasty, tunnel position","Arthroscopic notchplasty"],
    ["Stiffness / loss of flexion","3–5%","Early","Early ROM, extension splint at night","Aggressive PT, MUA if < 90° at 3 months"],
    ["Contralateral ACL","15% (adolescents)","Late","Prevention programme, correct biomechanics","Neuromuscular training, ACL recon contralateral"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 14 Re-rupture risk factors
  {const s=cs(p,"Re-rupture Risk Factors & Prevention");
  twoCol(s,p,
    [{t:"Patient Risk Factors:",b:true,g:true},"Age < 20 years: 3× higher re-rupture","Return to sport < 9 months: 4× higher risk","Female athletes: increased valgus collapse, narrow notch","High-demand sports (pivoting, cutting)","Graft diameter < 8 mm","Psychological unreadiness (ACL-RSI < 65)",{t:"Technical Risk Factors:",b:true,g:true},"Vertical femoral tunnel (non-anatomic)","Under-tensioning graft","Missed concurrent meniscal tear","Missed collateral ligament injury"],
    [{t:"Prevention Programmes (Level I Evidence):",b:true,g:true},"FIFA 11+ (Soligard et al., BJSM 2008)","Sportsmetrics programme","PEP (Prevent Injury and Enhance Performance)","KNACK programme for female athletes","Reduce re-injury by 50–70% when compliant",{t:"Timing for Return to Sport:",b:true,g:true},"< 6 months: 7× increased re-rupture risk","< 9 months: 4× increased risk","> 9 months + LSI > 90%: 1.7× (baseline elevated)","Recommend: 9–12 months minimum for competitive sport"],
    "Risk Factors","Prevention & Timing");}

  // 15 Revision ACL
  {const s=cs(p,"Revision ACL Reconstruction — Assessment & Planning");
  twoCol(s,p,
    [{t:"Causes of Primary ACL Failure:",b:true,g:true},"Tunnel malposition (40–70%) — most common","Trauma / re-injury (15%)","Graft selection / size error (10%)","Missed concurrent injury (meniscus/MCL) (10%)","Biological failure of graft incorporation (5%)",{t:"Pre-revision Workup:",b:true,g:true},"CT scan: measure tunnel position and widening (> 12 mm = staged)","MRI: assess menisci, chondral status, graft remnant","EUA: document laxity grade","DEXA if bone quality concern"],
    [{t:"Single-stage vs Two-stage:",b:true,g:true},"Single-stage: tunnels < 12 mm, well-positioned","Two-stage: tunnels > 12 mm — bone graft first, ACL at 3–6 months",{t:"Graft Selection for Revision:",b:true,g:true},"If BTB used first → hamstring revision","If hamstring used → BTB or quad tendon","Allograft (BTB/Achilles) acceptable in low-demand","Peroneus longus: increasingly popular (STR 3500 N)","LARS augmentation — not standard",{t:"Augmented Extra-articular Tenodesis (AEAT):",b:true,g:true},"Added to revision for persistent rotational laxity","Iliotibial band or gracilis tenodesis to lateral femur"],
    "Failure Analysis & Workup","Surgical Planning");}

  // 16 Recent evidence
  {const s=cs(p,"Recent Evidence & Key Trials");
  mkTable(p,s,[
    ["Trial / Study","Year","Key Finding","Clinical Implication"],
    ["KANON (Frobell et al., NEJM)","2010","No significant difference: early vs delayed ACL recon","Consider rehab-first in motivated adults; surgery for instability"],
    ["MARS Cohort","2011","Autograft significantly better than allograft in young athletes","Autograft is standard of care for athletes < 30 yrs"],
    ["Snaebjornsson et al. (AJSM)","2017","Graft < 7 mm: 3.2× higher re-rupture; ≥ 9 mm optimal","Graft diameter now key surgical planning criterion"],
    ["Grindem et al. (BJSM)","2016","Return at 9+ months reduces re-injury risk by 51%","Time-based return (6 mo) is insufficient; criteria-based essential"],
    ["Montalvo et al. meta-analysis","2019","Neuromuscular training reduces ACL injury by 50%","Prevention programme mandatory for high-risk sports"],
    ["NACOB + SMARTS2","2020–21","Double-bundle: no clinical difference vs single-bundle","Anatomic single-bundle remains gold standard"],
    ["Rambaud et al. (BJSM)","2018","LSI > 90% + 9 months: still 2× general population risk","Even passing criteria, risk remains elevated"],
    ["AOSSM Guidelines","2022","Anatomic tunnel placement + graft ≥ 8 mm = Level 1","Standardised best-practice for arthroscopic ACL recon"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 17 Outcomes chart
  {const s=cs(p,"Patient-Reported Outcomes — IKDC & ACL-RSI");
  barChart(p,s,["BTB 2yr","BTB 5yr","Hamstring 2yr","Hamstring 5yr","Allograft 2yr","Allograft 5yr"],
    [88,85,86,83,81,72],"Mean IKDC Score (100 = normal)",{x:.4,y:1.05,w:9.2,h:4.0});
  s.addText("Data: Meta-analysis Mohtadi et al. (Cochrane 2020), MARS cohort, systematic review Samuelsen et al. (AJSM 2017)",
    {x:.3,y:5.2,w:9.4,h:.3,fontSize:10,color:GR,fontFace:"Calibri",italic:true});}

  // 18 OA after ACL
  {const s=cs(p,"Long-term: Osteoarthritis After ACL Injury");
  twoCol(s,p,
    [{t:"Risk of Post-traumatic OA:",b:true,g:true},"50% radiological OA at 10–15 years","20–25% symptomatic OA by 10 years","Concurrent meniscectomy doubles OA risk","Chondral injury at time of ACL: major predictor",{t:"Surgery vs Conservative:",b:true,g:true},"No significant difference in OA rates at 10 years","(KANON trial — Frobell et al., NEJM 2016)","Meniscal preservation reduces OA progression","Early chondral defect treatment (microfracture, ACI)"],
    [{t:"Modifiable Risk Factors:",b:true,g:true},"BMI > 25: 2× OA risk","Neuromuscular control: gait retraining reduces load","High-impact sport return: accelerates cartilage wear","Varus alignment + ACL: high tibial osteotomy consideration",{t:"Prevention Strategies:",b:true,g:true},"Meniscal repair > meniscectomy (40% OA risk reduction)","Prompt ACL recon reduces giving-way episodes","Strengthen quadriceps: reduces patellofemoral OA risk","Activity modification: avoid high-impact if radiological OA early"],
    "OA Rates & Evidence","Risk Reduction");}

  // 19 Case study 1
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 1 — Young Footballer ACL + Meniscus",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b=[
    ["PRESENTATION","19M, football midfielder\nNon-contact pivot, immediate haemarthrosis\nClinical: Lachman 2+, pivot-shift 2+\nMCL intact, medial meniscus tender"],
    ["IMAGING","MRI: Complete ACL tear\n80% of AM bundle disrupted\nMedial meniscal posterior horn bucket-handle\nBone bruise: LFC + PL tibia"],
    ["SURGERY","Hamstring autograft 9.5 mm (ST+G quad-strand)\nAnatomic AM portal femoral tunnel\nBucket-handle meniscal repair (all-inside)\nLeft knee, tourniquet 80 min"],
    ["OUTCOME","Meniscal repair: full weight-bearing 4 weeks\nACL rehab protocol: RTS at 10 months\nIKDC at 1 year: 91/100\nPivot-shift: grade 0 at 12 months"],
  ];
  b.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 20 Case study 2
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 2 — Revision ACL in Female Athlete",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b=[
    ["PRESENTATION","24F, competitive basketball player\nACL recon (hamstring 7mm) 2 years ago\nAcute giving-way during match\nClinical: Lachman 2+, pivot-shift 2+"],
    ["WORKUP","MRI: Graft rupture (mid-substance)\nCT: Tibial tunnel 8mm, well-positioned\nFemoral tunnel: slightly vertical (60° vs 45°)\nNo tunnel widening > 12 mm"],
    ["SURGERY","Single-stage revision — BTB autograft\nNew femoral tunnel (AM portal) — anatomic\nPrevious tibial tunnel: reamed to 10mm (BTB)\n+ AEAT (iliotibial band tenodesis) for rotational stability"],
    ["OUTCOME","RTS: 12 months post-revision\nIKDC at 2 years: 88/100\nPivot-shift: grade 0-I\nPrevention: FIFA 11+ prescribed lifelong"],
  ];
  b.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 21 Algorithm
  {const s=p.addSlide(); s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});
  s.addText("ACL Management Algorithm",{x:.3,y:0,w:9.4,h:.82,fontSize:21,bold:true,color:W,fontFace:"Calibri",valign:"middle"});
  const bx=[
    {x:.3,y:1.0,w:9.4,h:.5,t:"SUSPECTED ACL TEAR — Clinical Assessment + MRI",bg:N,tc:GL,fs:14},
    {x:.3,y:1.6,w:4.3,h:.5,t:"ISOLATED ACL\n(Low demand, > 35 yrs)",bg:"1A5A68",tc:W,fs:12},
    {x:5.3,y:1.6,w:4.4,h:.5,t:"ATHLETE / HIGH DEMAND\n(< 35 yrs, pivoting sport)",bg:"8B3A1A",tc:W,fs:12},
    {x:.3,y:2.2,w:4.3,h:.5,t:"Supervised Rehab × 12 wks\n→ Reassess instability",bg:LN,tc:W,fs:11},
    {x:5.3,y:2.2,w:4.4,h:.5,t:"Surgery: Wait 3–6 wks\n→ Autograft ACL Recon",bg:LN,tc:W,fs:11},
    {x:.3,y:2.8,w:4.3,h:.5,t:"Stable → Continue Conservative\nInstability → ACL Recon",bg:"2A4070",tc:IC,fs:11},
    {x:5.3,y:2.8,w:4.4,h:.5,t:"Concurrent injury? → Meniscal repair\nAnatomic tunnels + ≥ 8mm graft",bg:"2A4070",tc:IC,fs:11},
    {x:.3,y:3.4,w:9.4,h:.5,t:"CRITERIA-BASED REHABILITATION — RTS minimum 9 months — LSI > 90%",bg:G,tc:W,fs:12},
    {x:.3,y:4.0,w:9.4,h:.5,t:"PREVENTION PROGRAMME — FIFA 11+ / Sportsmetrics — Lifelong",bg:N,tc:GL,fs:12},
  ];
  bx.forEach(b=>{
    s.addShape(p.shapes.RECTANGLE,{x:b.x,y:b.y,w:b.w,h:b.h,fill:{color:b.bg},shadow:shadow()});
    s.addText(b.t,{x:b.x,y:b.y,w:b.w,h:b.h,fontSize:b.fs,color:b.tc||W,fontFace:"Calibri",align:"center",valign:"middle",bold:true});
  });}

  // 22 Future directions
  {const s=cs(p,"Future Directions — Biological & Technical Advances");
  twoCol(s,p,
    [{t:"Biological Enhancement:",b:true,g:true},"Platelet-rich plasma (PRP): inconclusive — no standard","PDGF / BMP injection at tunnel: Phase II trials","Stem cell seeding of graft: pre-clinical promising","Extracellular matrix scaffold (BEAR graft): Phase II positive","BEAR (Bridge-Enhanced ACL Repair): primary repair with scaffold + PRP — non-inferior to recon at 2 years",{t:"Synthetic Augmentation:",b:true,g:true},"LARS + autograft: faster RTS, unknown long-term","InternalBrace: extracortical augmentation","Ligament Advanced Reinforcement System (LARS): 10-yr failure 12–15%"],
    [{t:"Technical Innovations:",b:true,g:true},"Double-bundle: superior pivot shift (Level I evidence)","Anterolateral ligament (ALL) reconstruction for high-grade rotational instability","Lateral extra-articular tenodesis (LET) — grade IIB/III pivot shift","Dynamic intraligamentary stabilisation (DIS): Ligamys device — primary repair","Robotic-assisted ACL tunnelling: preclinical accuracy",{t:"Prevention Science:",b:true,g:true},"Wearable IMU sensors: biomechanical feedback in real-time","AI movement analysis: ACL injury prediction from video","Genetic screening: collagen gene variants (COL5A1) — risk stratification"],
    "Biological Therapies","Technical & Prevention");}

  // 23 Conclusions
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:.1,fill:{color:G}});
  s.addText("CONCLUSIONS",{x:.5,y:.2,w:9,h:.6,fontSize:26,bold:true,color:GL,fontFace:"Calibri",align:"center"});
  const pts=["Lachman test is the most sensitive clinical test; pivot-shift is most specific for rotational instability","MRI confirms diagnosis and assesses meniscal, chondral, and collateral ligament injury","Autograft remains gold standard; graft diameter ≥ 8 mm significantly reduces re-rupture risk","Anatomic femoral tunnel placement (via AM portal) is the most critical technical factor","Criteria-based return to sport (LSI > 90% + 9 months minimum) reduces re-injury by 51% (Level I)","Concurrent meniscal repair is preferred over meniscectomy — reduces long-term OA risk","ACL prevention programmes (FIFA 11+, Sportsmetrics) reduce injury risk by 50–70%","BEAR scaffold shows promise as biological primary repair — may change paradigm within 5 years"];
  s.addText(pts.map((pt,i)=>({text:pt,options:{bullet:true,color:i===0||i===2||i===4?GL:W,fontSize:13,fontFace:"Calibri",paraSpaceAfter:6,breakLine:i<pts.length-1}})),
    {x:.5,y:1.0,w:9,h:4.3,valign:"top"});}

  await p.writeFile({fileName:"slides/acl-reconstruction.pptx"});
  console.log("✅  acl-reconstruction.pptx  (23 slides)");
}
build().catch(console.error);
