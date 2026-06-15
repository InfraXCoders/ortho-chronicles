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
function lineChart(p,slide,labels,series,opts={}){slide.addChart(p.charts.LINE,series,{x:opts.x||.4,y:opts.y||1.05,w:opts.w||9.2,h:opts.h||4.2,chartColors:[G,LN,"1A5A68"],showLegend:true,legendPos:"b",catAxisLabelColor:GR,valAxisLabelColor:GR,valGridLine:{color:"E2E8F0",size:.5},chartArea:{fill:{color:"FFFFFF"},roundedCorners:false},...opts});}

async function build(){
  const p=new pptxgen(); p.layout="LAYOUT_16x9"; p.title="Osteoporosis & Bone Health";

  // 1 Title
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:.18,h:5.625,fill:{color:G}});
  s.addText("OSTEOPOROSIS\n& BONE HEALTH",{x:.5,y:.6,w:9,h:1.5,fontSize:38,bold:true,color:W,fontFace:"Calibri"});
  s.addText("Diagnosis · FRAX · Pharmacotherapy · Fracture Management · Fracture Liaison Service",{x:.5,y:2.2,w:9,h:.65,fontSize:14,color:GL,fontFace:"Calibri",italic:true});
  s.addShape(p.shapes.RECTANGLE,{x:.5,y:3.0,w:5,h:.04,fill:{color:G},line:{color:G}});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar  |  2026",{x:.5,y:3.15,w:9,h:.4,fontSize:12,color:GL,fontFace:"Calibri",bold:true});}

  // 2 Burden
  {const s=cs(p,"Global & Indian Burden of Osteoporosis");
  const stats=[["200M","People with\nosteoporosis globally"],["50M+","Indians with\nosteoporosis"],["8.9M","Fragility fractures\nper year globally"],["1 in 3","Women over 50\nwill fracture"]];
  stats.forEach(([n,l],i)=>{
    const x=.3+i*2.35;
    s.addShape(p.shapes.RECTANGLE,{x,y:1.05,w:2.1,h:1.6,fill:{color:LN},shadow:shadow()});
    s.addText(n,{x,y:1.15,w:2.1,h:.8,fontSize:26,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(l,{x,y:1.9,w:2.1,h:.65,fontSize:10,color:IC,fontFace:"Calibri",align:"center"});
  });
  s.addText(bl(["Hip fracture mortality: 20–30% at 1 year (India: up to 40%)","India-specific: vitamin D deficiency in 70–90% of population exacerbates bone loss","Fragility fracture economic burden India: USD 3.5 billion/year","Post-fracture treatment gap: < 20% of eligible patients receive anti-osteoporosis medication","Average age at hip fracture: India — 65 yrs (10 years younger than Western countries)","Vertebral fractures: 50% undiagnosed; each fracture doubles risk of next fracture"]),
    {x:.3,y:2.75,w:9.4,h:2.6,valign:"top"});}

  // 3 Pathophysiology
  {const s=cs(p,"Bone Remodelling & Pathophysiology of Osteoporosis");
  twoCol(s,p,
    [{t:"Normal Bone Remodelling Cycle:",b:true,g:true},"Osteoclasts (resorption) ↔ Osteoblasts (formation)","Balanced in young adults: net zero loss","Rate of remodelling: 10% of skeleton per year","Controlled by: RANK-RANKL-OPG system","PTH, estrogen, calcium, vitamin D — key regulators",{t:"In Osteoporosis:",b:true,g:true},"Osteoclast activity > Osteoblast activity","Net bone loss: trabecular > cortical (initially)","Trabecular loss: thinning, perforation, loss of connectivity","Cortical loss: thinning and increased porosity"],
    [{t:"Types of Osteoporosis:",b:true,g:true},"Type I (Postmenopausal):","- Estrogen deficiency → ↑ RANKL → ↑ osteoclast activity",{t:"- Age 50–65; predominantly trabecular loss (spine, wrist)",sub:true},"Type II (Senile):","- Both sexes > 70 yrs; cortical + trabecular loss",{t:"- ↓ Ca absorption, ↑ PTH, ↓ Vit D",sub:true},{t:"Secondary Osteoporosis:",b:true,g:true},"Glucocorticoid (most common secondary cause)","Hypogonadism, hyperparathyroidism, malabsorption","Anticonvulsants, aromatase inhibitors, PPIs","CKD: renal osteodystrophy (high vs low turnover)"],
    "Normal Remodelling","Osteoporosis Types");}

  // 4 Risk factors & FRAX
  {const s=cs(p,"Risk Factors & FRAX Tool");
  twoCol(s,p,
    [{t:"Clinical Risk Factors for FRAX:",b:true,g:true},"Age","BMI (low BMI = higher risk)","Previous fragility fracture","Parental history of hip fracture","Current glucocorticoid use","Rheumatoid arthritis","Secondary osteoporosis","Smoking (active)","Alcohol ≥ 3 units/day",{t:"Non-FRAX Risk Factors:",b:true,g:true},"Falls history","Low muscle mass (sarcopenia)","Vitamin D deficiency","Immobility / institutionalisation","Visual impairment"],
    [{t:"FRAX (WHO Fracture Risk Assessment Tool):",b:true,g:true},"Calculates 10-year probability of:","- Major osteoporotic fracture (hip + spine + humerus + wrist)",{t:"- Hip fracture alone",sub:true},"Input: age, sex, weight, height + clinical risk factors","DXA femoral neck T-score optional",{t:"Intervention Thresholds (UK NOGG):",b:true,g:true},"Below lower: lifestyle advice only","Between thresholds: DXA recommended","Above upper: treat without DXA","FRAX limitation: underestimates risk with high fall burden","Does not account for recent fracture timing","India: use FRAX with Indian Caucasian / South Asian reference"],
    "Risk Factor Assessment","FRAX Tool Application");}

  // 5 DXA interpretation
  {const s=cs(p,"DXA Scan — Interpretation & WHO Criteria");
  mkTable(p,s,[
    ["DXA Category","T-score","Z-score","Meaning","Action"],
    ["Normal","≥ −1.0","≥ −2.0","Normal bone density for young adult","Lifestyle advice, reassess 3–5 yr"],
    ["Osteopenia / Low BMD","−1.0 to −2.5","N/A","Below young adult mean, not threshold","FRAX score, lifestyle, Ca/VitD"],
    ["Osteoporosis","≤ −2.5","N/A","WHO diagnostic threshold","Pharmacotherapy indicated"],
    ["Severe Osteoporosis","≤ −2.5 + fragility fracture","N/A","High risk, established disease","Urgent treatment, FLS referral"],
    ["Below age-matched mean (premenopausal)","N/A","≤ −2.0","Low for age — secondary cause","Exclude secondary causes"],
  ],{x:.3,y:.95,w:9.4,h:2.3});
  s.addText("DXA Reporting Requirements",{x:.3,y:3.35,w:9.4,h:.4,fontSize:13,bold:true,color:G,fontFace:"Calibri"});
  mkTable(p,s,[
    ["Site","Preferred Measurement","Technical Consideration"],
    ["Lumbar spine (L1–L4)","Posteroanterior","Exclude vertebrae with fracture, metal, severe OA"],
    ["Femoral neck","Standard hip projection","Preferred for treatment monitoring response"],
    ["Total hip","Sum of femoral neck + trochanter + intertrochanteric","Most reproducible — use for monitoring"],
    ["Distal 1/3 radius","Used when hip/spine unsuitable","Mandatory in primary hyperparathyroidism"],
  ],{x:.3,y:3.75,w:9.4,h:1.7});}

  // 6 Drug comparison
  {const s=cs(p,"Pharmacotherapy — Drug Comparison Table");
  mkTable(p,s,[
    ["Drug Class","Example","Mechanism","Fracture Reduction","Key Side Effects","Monitoring"],
    ["Bisphosphonate (oral)","Alendronate 70mg weekly","↓ Osteoclast activity via mevalonate","Spine 50%, Hip 40%","GORD, oesophageal ulcer, ONJ","Renal (CrCl < 35 — avoid), dental review"],
    ["Bisphosphonate (IV)","Zoledronic acid 5mg yearly","Same — IV avoids GI issues","Spine 70%, Hip 41%","Acute phase reaction (38°C, myalgia)","Renal function, dental review"],
    ["RANKL inhibitor","Denosumab 60mg s/c 6-monthly","↓ RANKL → ↓ Osteoclast differentiation","Spine 68%, Hip 40%","ONJ (0.5%), atypical femur fx, hypocalcaemia","Calcium before each dose, do not stop abruptly"],
    ["PTH analogue","Teriparatide 20μg/day s/c","↑ Osteoblast activity (anabolic)","Spine 65%, Hip 53%","N/V, leg cramps, Paget's caution","Max 2 years; follow with antiresorptive"],
    ["Anti-sclerostin","Romosozumab 210mg/month s/c","↑ Formation + ↓ resorption (dual)","Spine 73%, Hip 38%","Cardiovascular events (CV history caution)","12 months max; then antiresorptive"],
    ["SERM","Raloxifene 60mg daily","ER agonist on bone, antagonist on breast","Spine 30–50%, Hip non-significant","DVT (3×), hot flushes","Not for high hip fracture risk"],
    ["Calcium + Vitamin D","Ca 1000mg + Vit D3 800IU daily","Essential cofactor — not primary treatment","Reduces falls risk by 20%","Hypercalcaemia (excess), constipation","25-OH Vit D level target: 50–75 nmol/L"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 7 Bisphosphonate evidence
  {const s=cs(p,"Bisphosphonate Evidence — Key Trials");
  mkTable(p,s,[
    ["Trial","Drug","Fracture Reduction","Notes"],
    ["FIT (Black, NEJM 1996)","Alendronate","47% vertebral, 51% hip","Foundation bisphosphonate trial; postmenopausal OP"],
    ["HORIZON-PFT (Black, NEJM 2007)","Zoledronic acid","77% vertebral, 41% hip","Annual IV; also reduces mortality 28% in hip fracture subgroup"],
    ["FREEDOM (Cummings, NEJM 2009)","Denosumab","68% vertebral, 40% hip","Maintained with long-term use; rebound on discontinuation"],
    ["TPTD (Neer, NEJM 2001)","Teriparatide","65% vertebral, 53% non-vertebral","First anabolic agent; max 2 years"],
    ["ARCH (Saag, NEJM 2017)","Romosozumab → Alendronate","73% vertebral vs alendronate","Superior to alendronate alone; CV caution"],
    ["FRAME (Cosman, NEJM 2016)","Romosozumab → Denosumab","75% vertebral, 38% non-vertebral","Transition to antiresorptive after 12 months"],
    ["VERO (Kendler, Lancet 2016)","Teriparatide vs risedronate","56% vertebral (TPTd superior)","First head-to-head anabolic vs oral bisphosphonate"],
    ["Atypical Femur Fx meta-analysis","Bisphosphonates","0.1–1% AFF risk","Risk increases with duration > 5 years; drug holiday recommended"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 8 Treatment algorithm
  {const s=p.addSlide(); s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.82,fill:{color:N}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:.82,w:10,h:.06,fill:{color:G}});
  s.addText("Treatment Algorithm — Post-menopausal Osteoporosis",{x:.3,y:0,w:9.4,h:.82,fontSize:20,bold:true,color:W,fontFace:"Calibri",valign:"middle"});
  const bx=[
    {x:.3,y:1.0,w:9.4,h:.5,t:"FRAGILITY FRACTURE OR DXA T-SCORE ≤ −2.5",bg:N,tc:GL,fs:14},
    {x:.3,y:1.6,w:4.3,h:.5,t:"FRAX ≥ INTERVENTION THRESHOLD\nor T-score ≤ −2.5",bg:"8B3A1A",tc:W,fs:11},
    {x:5.3,y:1.6,w:4.4,h:.5,t:"OSTEOPENIA + LOW FRAX\n(Below intervention threshold)",bg:"1A5A68",tc:W,fs:11},
    {x:.3,y:2.2,w:4.3,h:.5,t:"Calcium + Vit D → START PHARMACOTHERAPY\nOral bisphosphonate (1st line)",bg:LN,tc:W,fs:11},
    {x:5.3,y:2.2,w:4.4,h:.5,t:"Calcium + Vit D + Lifestyle\nReassess DXA in 3–5 years",bg:LN,tc:W,fs:11},
    {x:.3,y:2.8,w:4.3,h:.5,t:"If GI intolerance: IV Zoledronic acid\nIf very high risk: Teriparatide / Romosozumab",bg:"2A4070",tc:IC,fs:11},
    {x:5.3,y:2.8,w:4.4,h:.5,t:"If fails 5-year reassessment:\nTreat as high risk",bg:"2A4070",tc:IC,fs:11},
    {x:.3,y:3.4,w:9.4,h:.5,t:"MONITOR: DXA at 2 years — if stable/improving: continue; if losing bone: switch or combine",bg:G,tc:W,fs:11},
    {x:.3,y:4.0,w:9.4,h:.5,t:"DRUG HOLIDAY: After 5 yrs oral / 3 yrs IV bisphosphonate — reassess FRAX — resume if re-fractures",bg:N,tc:GL,fs:11},
  ];
  bx.forEach(b=>{
    s.addShape(p.shapes.RECTANGLE,{x:b.x,y:b.y,w:b.w,h:b.h,fill:{color:b.bg},shadow:shadow()});
    s.addText(b.t,{x:b.x,y:b.y,w:b.w,h:b.h,fontSize:b.fs,color:b.tc||W,fontFace:"Calibri",align:"center",valign:"middle",bold:true});
  });}

  // 9 Hip fracture management
  {const s=cs(p,"Hip Fracture — Emergency Management (Fragility)");
  mkTable(p,s,[
    ["Fracture Type","Classification","Implant of Choice","Alternatives","Key Points"],
    ["Intracapsular — Undisplaced","Garden I/II","Cannulated screws (3×)","DHS","Low AVN risk; preserve femoral head"],
    ["Intracapsular — Displaced (fit patient)","Garden III/IV","Hemiarthroplasty (unipolar/bipolar)","Total hip arthroplasty","AVN risk 20–30%; head removal + prosthesis"],
    ["Intracapsular — Displaced (active > 70 yrs)","Garden III/IV","Total hip replacement","Hemiarthroplasty","Better functional outcomes; higher dislocation risk"],
    ["Extracapsular — Stable","AO A1; Evans I","DHS (Dynamic Hip Screw)","PFNA","Lag screw 95% fixation rate; blade vs screw"],
    ["Extracapsular — Unstable","AO A2; Evans II–V","PFNA (Proximal Femoral Nail Antirotation)","Arthroplasty (frail)","IM nail biomechanically superior for unstable"],
    ["Subtrochanteric","AO A3; Seinsheimer V","Long PFNA / Trochanteric nail","95° angled blade plate","High forces; beware medial calcar comminution"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 10 Peri-operative care
  {const s=cs(p,"Perioperative Hip Fracture Care — Best Practice");
  twoCol(s,p,
    [{t:"Pre-operative Targets:",b:true,g:true},"Hb > 8 g/dL (transfuse if Hb < 8 with symptoms)","Correct anticoagulation (warfarin: Vit K; DOAC: 24–48h pause)","Optimise electrolytes, blood glucose (target 6–10 mmol/L)","Cardiac assessment: only if it changes management","Time to surgery: < 48h from admission (NHFD standard)","Spinal anaesthesia preferred over GA (REGAIN trial)",{t:"Pain Management:",b:true,g:true},"Femoral nerve block / FICB on admission","Regular paracetamol","Avoid NSAIDs and opioids if possible in elderly","Regional anaesthesia first-line for surgery"],
    [{t:"Post-operative Best Practice:",b:true,g:true},"Weight-bearing as tolerated — Day 1","VTE prophylaxis: LMWH 28–35 days (hip fracture)","Delirium prevention: early mobilisation, orientation, sleep hygiene","Pressure area care, catheter care bundle","Cognitive assessment (AMTS) pre- and post-op","Nutritional supplement (protein) — reduces complications",{t:"Secondary Prevention:",b:true,g:true},"Anti-osteoporosis medication BEFORE discharge","Falls assessment and intervention","FLS (Fracture Liaison Service) referral","Vitamin D supplementation (800–1000 IU/day)","Target 25-OH VitD > 50 nmol/L","Home modification, walking aids assessment"],
    "Pre-operative","Post-operative & Secondary Prevention");}

  // 11 Vertebral fracture management
  {const s=cs(p,"Osteoporotic Vertebral Compression Fractures (VCF)");
  twoCol(s,p,
    [{t:"Natural History:",b:true,g:true},"50% of VCFs are asymptomatic / incidental finding","Each VCF: 5-fold increase in subsequent VCF risk","50% height reduction predicts poor conservative outcome","Kyphotic progression: up to 10° at 2 years",{t:"Conservative Management (6 weeks):",b:true,g:true},"Bed rest (minimal) + analgesics","TLSO brace: 6–8 weeks","Regular analgesia: paracetamol + weak opioid","Calcitonin nasal spray: acute pain relief (4 weeks)","Reassess at 6 weeks: if VAS > 5/10 → intervention"],
    [{t:"Vertebroplasty vs Kyphoplasty:",b:true,g:true},"Vertebroplasty: cement injection under pressure","Kyphoplasty: balloon creates void → low-pressure cement injection","Pain relief: equivalent (Level I evidence)","Kyphoplasty: better height restoration (40–60% of loss)","Kyphoplasty: lower cement leak rate (2% vs 8%)",{t:"Indications for Augmentation:",b:true,g:true},"Acute fracture (< 6–8 weeks)",{t:"VAS pain ≥ 5/10 despite conservative",sub:true},{t:"No posterior wall breach",sub:true},{t:"No neurological deficit",sub:true},"VERTOS IV: sham vs vertebroplasty — limited pain benefit","Select acute, bone-oedema-positive (STIR +) patients"],
    "Natural History & Conservative","Augmentation Techniques");}

  // 12 Falls prevention
  {const s=cs(p,"Falls Prevention — Integrated Approach");
  mkTable(p,s,[
    ["Intervention","Evidence Level","Risk Reduction","Details"],
    ["Exercise: balance & strength training","Grade A","17–37% fall reduction","Tai Chi, Otago Exercise Programme — minimum 2hr/week"],
    ["Vitamin D supplementation","Grade B","25% fall reduction (serum > 50 nmol/L)","800–1000 IU/day; higher if deficient"],
    ["Home hazard modification","Grade A","19% fall reduction","Grab rails, remove rugs, improved lighting, non-slip bath mat"],
    ["Cataract surgery","Grade B","34% fall reduction","Visual impairment is major modifiable risk factor"],
    ["Medication review","Grade B","25% reduction","Reduce psychotropics, antihypertensives (orthostatic hypotension)"],
    ["Hip protectors","Grade C","Inconclusive — compliance issue","25% hip fracture reduction in care homes when worn consistently"],
    ["Multifactorial assessment","Grade A","24% fall reduction","Comprehensive falls clinic: physio + OT + medication review"],
    ["Calcium + Vitamin D (combined)","Grade B","20% hip fracture reduction","RECORD trial; baseline Vit D deficiency benefits most"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 13 FLS model
  {const s=cs(p,"Fracture Liaison Service (FLS) — Reducing Treatment Gap");
  twoCol(s,p,
    [{t:"The Treatment Gap:",b:true,g:true},"< 20% of fragility fracture patients receive treatment","80% who sustain hip fracture had prior fracture — missed opportunity","Each missed fracture: 5× higher risk of subsequent fracture","FLS = systematic capture of ALL fragility fractures",{t:"FLS Model (3i):",b:true,g:true},"1. IDENTIFY: Flag all fragility fractures in hospital system","2. INVESTIGATE: DXA + blood tests (calcium, Vit D, renal)","3. INITIATE: Start treatment before discharge + FLS follow-up","FLS models A–D based on service intensity (IOF classification)"],
    [{t:"FLS Evidence:",b:true,g:true},"Fracture reduction: 23% over 2 years (McLellan et al.)","Re-fracture rate 50% lower vs standard care","Mortality reduction: 21% (hip fracture in FLS patients)","NHS: FLS is cost-effective — saves £16 per quality-adjusted life year",{t:"Clinical Investigation Protocol:",b:true,g:true},"Bloods: Ca, PO4, ALP, albumin, Cr, 25-OH Vit D, PTH, testosterone (M), TSH","DXA: spine + hip + optionally 1/3 distal radius","Investigate secondary causes if DXA unexpectedly low","DEXA repeat: 2 years after starting pharmacotherapy"],
    "FLS Concept","Evidence & Protocol");}

  // 14 Non-pharmacological
  {const s=cs(p,"Non-Pharmacological Bone Health Strategies");
  mkTable(p,s,[
    ["Strategy","Recommendation","Evidence","Effect on BMD"],
    ["Calcium intake","1000 mg/day (< 50 yrs); 1200 mg/day (> 50 yrs)","Grade A","Prevents loss; not gains alone"],
    ["Vitamin D","800–2000 IU/day; target serum 50–75 nmol/L","Grade A","Essential co-factor for Ca absorption"],
    ["Weight-bearing exercise","150 min/week moderate intensity + resistance 2×/week","Grade A","1–3% BMD gain at spine; reduces falls"],
    ["Smoking cessation","Cessation reduces bone loss by 50%","Grade B","Smokers: 25% higher fracture risk"],
    ["Alcohol reduction","≤ 14 units/week (UK); ≤ 2 drinks/day","Grade B","Heavy use: ↑ osteoclast activity"],
    ["Protein intake","1.0–1.2 g/kg/day","Grade B","Reduces hip fracture risk by 30%"],
    ["Sun exposure","15–30 min midday sun (arms exposed)","Grade C","Promotes endogenous Vit D3 synthesis"],
    ["Avoidance of glucocorticoids","Minimise dose; use inhaled steroids where possible","Grade A","Prednisolone > 5 mg/day: rapid bone loss"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 15 Drug holidays / monitoring
  {const s=cs(p,"Treatment Monitoring & Drug Holidays");
  twoCol(s,p,
    [{t:"Monitoring on Treatment:",b:true,g:true},"DXA: Repeat at 2 years on pharmacotherapy","Biochemical markers: CTX (bone resorption) + P1NP (formation)","CTX: ↓ 50% confirms bisphosphonate effect","P1NP: ↑ 25% confirms teriparatide/romosozumab effect","Annual Ca, renal function, Vit D level","Dental check before bisphosphonate start",{t:"Defining Treatment Response:",b:true,g:true},"Success: stable or ↑ BMD + no new fractures","Failure: > 5% BMD loss or re-fracture on adequate therapy","Switch: if fail oral → IV, or antiresorptive → anabolic"],
    [{t:"Bisphosphonate Drug Holiday:",b:true,g:true},"After 5 years oral (alendronate/risedronate)","After 3 years IV (zoledronic acid)","If: low-risk patient (no fractures, T-score > −2.5 at hip)","Duration: 2–3 years","Continue: if high-risk (prior fracture, T-score < −2.5)",{t:"Denosumab — Do NOT Stop Abruptly:",b:true,g:true},"Rebound: vertebral fracture within 6–18 months of stopping","Multiple vertebral fractures reported (15× baseline risk)","Always transition to bisphosphonate before discontinuing denosumab","Give zoledronic acid 6–12 months after last denosumab dose"],
    "Monitoring","Drug Holidays");}

  // 16 Secondary osteoporosis
  {const s=cs(p,"Secondary Osteoporosis — Causes & Management");
  mkTable(p,s,[
    ["Condition","Mechanism","Bone Effect","Specific Management"],
    ["Glucocorticoid-induced OP","↑ Osteoclast, ↓ Osteoblast, ↓ Ca absorption","Rapid loss in first 3–6 months","GIOP guidelines: bisphosphonate if > 3 months steroid use"],
    ["Primary hyperparathyroidism","PTH → ↑ bone turnover","Cortical > trabecular loss","Parathyroidectomy; cinacalcet if surgical risk"],
    ["Hypogonadism (male)","Testosterone deficiency → ↑ resorption","Low T = low BMD","Testosterone replacement + bisphosphonate if severe"],
    ["CKD-MBD","↓ Vit D activation, ↑ PTH, high or low turnover","Variable; adynamic or hyperparathyroid bone","Cinacalcet, Vit D analogues (calcitriol); renal referral"],
    ["Malabsorption (coeliac, IBD)","↓ Ca and Vit D absorption","Severe bone loss","Treat underlying condition; high-dose Vit D (1000–4000 IU)"],
    ["Aromatase inhibitor therapy","↓ Estrogen in breast cancer treatment","5% BMD loss/year","Oral or IV bisphosphonate; denosumab (ABCSG-18 trial)"],
    ["Anticonvulsants (phenytoin)","↑ Vit D catabolism via CYP450","Progressive bone loss","Vit D supplementation (up to 4000 IU); consider switch"],
    ["Anorexia nervosa","Low energy availability → amenorrhoea → low estrogen","Severe, young patients","Nutritional recovery; consider transdermal estrogen; avoid bisphosphonates"],
  ],{x:.3,y:.95,w:9.4,h:4.5});}

  // 17 BMD gain chart
  {const s=cs(p,"BMD Gains with Pharmacotherapy — Spine vs Hip");
  barChart(p,s,["Alendronate","Zoledronic acid","Denosumab","Teriparatide","Romosozumab"],
    [5.4,6.7,7.2,9.6,13.3],"% BMD Gain at Lumbar Spine (3 years)",{x:.4,y:1.05,w:5.8,h:4.0,valDir:"col"});
  s.addText(bl([{t:"Key Points:",b:true,g:true},"Anabolics > antiresorptives for BMD gain","Romosozumab gains: dual mechanism","Sequential therapy essential","TPTd: must follow with antiresorptive","Romosozumab → Denosumab: additive BMD",{t:"Time to Effect:",b:true,g:true},"Fracture reduction: seen at 6–12 months","BMD increase: measurable at 2 years"]),
    {x:6.6,y:1.1,w:3.1,h:4.0,valign:"top"});}

  // 18 Case study 1
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 1 — Postmenopausal Hip Fracture",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b=[["PRESENTATION","67F, fall from standing height\nHPF (hypertension, on amlodipine + atorvastatin)\nLeft hip pain, shortening, external rotation\nNo previous fractures documented"],
    ["INVESTIGATIONS","X-ray: Garden III intracapsular hip fracture\nDXA: T-score femoral neck −2.8 (osteoporosis)\nVit D: 22 nmol/L (deficient)\nRenal: CrCl 58 mL/min"],
    ["MANAGEMENT","FICB on admission, surgery at 30h (< 48h target)\nSpinal anaesthesia + hemiarthroplasty (Thompson)\nPre-op: Vit D 50,000 IU loading dose\nPost-op: Weight-bearing day 1"],
    ["SECONDARY PREVENTION","Alendronate 70mg weekly + Ca 1000mg + Vit D 800IU\nFLS referral at discharge\nFalls physio + home assessment\nDXA repeat at 2 years: T-score improved to −2.3"]];
  b.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 19 Case study 2
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addText("CASE STUDY 2 — Glucocorticoid-Induced OP",{x:.5,y:.15,w:9,h:.65,fontSize:20,bold:true,color:GL,fontFace:"Calibri"});
  const b2=[["PRESENTATION","48M, rheumatoid arthritis on prednisolone 10mg/day × 3 years\nBack pain x 6 weeks after lifting box\nDXA: T-score spine −2.9, hip −1.8"],
    ["INVESTIGATIONS","MRI: L2 acute vertebral compression fracture (STIR+)\nNo neurological deficit\nVit D: 31 nmol/L, ALP elevated"],
    ["MANAGEMENT","Conservative: TLSO brace + analgesia\nPain not controlled at 6 weeks (VAS 6/10)\nKyphoplasty L2 — pain VAS 8 → 2/10 at 48h\nPost-procedure: mobilised same day"],
    ["SECONDARY PREVENTION","Zoledronic acid 5mg IV (GIOP guidelines)\nCalcitriol 0.5μg daily (secondary due to RA)\nCalcium 1200mg daily + Vit D 2000 IU\nRheumatology: minimise steroid dose"]];
  b2.forEach(([t,c],i)=>{
    const x=i%2===0?.4:5.2,y=i<2?1.0:3.1;
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:1.85,fill:{color:LN},shadow:shadow()});
    s.addShape(p.shapes.RECTANGLE,{x,y,w:4.3,h:.08,fill:{color:G}});
    s.addText(t,{x,y:y+.1,w:4.3,h:.4,fontSize:11,bold:true,color:GL,fontFace:"Calibri",align:"center"});
    s.addText(c,{x:x+.1,y:y+.5,w:4.1,h:1.2,fontSize:11,color:IC,fontFace:"Calibri",valign:"top"});
  });}

  // 20 Future
  {const s=cs(p,"Emerging Therapies & Future Directions");
  twoCol(s,p,
    [{t:"Novel Mechanisms:",b:true,g:true},"Cathepsin K inhibitor (odanacatib) — osteoclast specific, but CV concerns","Wnt pathway activators (beyond romosozumab)","DKK-1 inhibitors: early clinical trials","Abaloparatide (PTH-rP analogue) — approved USA, not yet India","Biomarker-guided therapy: CTX + P1NP to personalise dose",{t:"India-Specific Developments:",b:true,g:true},"Generic zoledronic acid: improving access","ICMR guidelines for Indian FRAX reference database","Urban–rural osteoporosis awareness programmes","Calcium fortification policy initiatives"],
    [{t:"Technology:",b:true,g:true},"High-resolution peripheral QCT (HR-pQCT): microarchitecture assessment","Finite element analysis: fracture risk beyond BMD","AI-based vertebral fracture detection from chest X-rays","Continuous glucose monitor analogy for bone turnover markers",{t:"Research Directions:",b:true,g:true},"Optimal duration of each drug class still debated","Sequential vs combination therapy comparative trials","Fracture prevention in males underrepresented — more data needed","Paediatric and young-adult osteoporosis management guidelines"],
    "Novel Agents","Technology & Research");}

  // 21 Conclusions
  {const s=p.addSlide(); s.background={color:N};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:.1,fill:{color:G}});
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:.1,fill:{color:G}});
  s.addText("CONCLUSIONS",{x:.5,y:.2,w:9,h:.6,fontSize:26,bold:true,color:GL,fontFace:"Calibri",align:"center"});
  const pts=["DXA T-score ≤ −2.5 or fragility fracture = diagnosis of osteoporosis — treatment mandatory","FRAX is a validated, individualised 10-year risk calculator — use it to guide pharmacotherapy decisions","Bisphosphonates are first-line; anabolics (teriparatide, romosozumab) for high-risk / severe disease","Drug holidays after 5 years oral bisphosphonate; NEVER stop denosumab abruptly","Hip fracture surgery within 48 hours reduces mortality — secondary prevention must start before discharge","Fracture Liaison Service (FLS) closes the treatment gap — every hospital should have one","Falls prevention is as important as pharmacotherapy — multifactorial assessment reduces falls 24%","Vitamin D adequacy (> 50 nmol/L) is foundational — correct before starting pharmacotherapy"];
  s.addText(pts.map((pt,i)=>({text:pt,options:{bullet:true,color:i===0||i===2||i===4||i===6?GL:W,fontSize:13,fontFace:"Calibri",paraSpaceAfter:5,breakLine:i<pts.length-1}})),
    {x:.5,y:1.0,w:9,h:4.3,valign:"top"});}

  await p.writeFile({fileName:"slides/osteoporosis-bone-health.pptx"});
  console.log("✅  osteoporosis-bone-health.pptx  (21 slides)");
}
build().catch(console.error);
