const pptxgen = require("pptxgenjs");
const NAVY="0F1D3A",GOLD="B8963E",GOLD_L="D4AF5A",WHITE="FFFFFF",BG="F4F6FA";

function hdr(s,pres,t){
  s.background={color:BG};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.85,fill:{color:NAVY}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0.85,w:10,h:0.06,fill:{color:GOLD}});
  s.addText(t,{x:0.3,y:0,w:9.4,h:0.85,fontSize:22,bold:true,color:WHITE,fontFace:"Calibri",valign:"middle",margin:0});
}
function bl(items){return items.map((b,i)=>({text:typeof b==="string"?b:b.t,options:{bullet:true,color:typeof b==="string"?"1E293B":(b.g?GOLD:"1E293B"),fontSize:typeof b==="string"?14:(b.s?12:14),bold:b&&b.b||false,italic:b&&b.i||false,fontFace:"Calibri",paraSpaceAfter:5,breakLine:i<items.length-1}}));}

async function build(){
  const pres=new pptxgen();
  pres.layout="LAYOUT_16x9";
  pres.title="Osteoporosis & Bone Health";

  // Title
  let s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:GOLD}});
  s.addText("OSTEOPOROSIS",{x:0.5,y:0.9,w:9,h:1.0,fontSize:42,bold:true,color:WHITE,fontFace:"Calibri"});
  s.addText("& BONE HEALTH",{x:0.5,y:1.85,w:9,h:0.9,fontSize:36,bold:true,color:GOLD_L,fontFace:"Calibri"});
  s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:2.85,w:5,h:0.04,fill:{color:GOLD},line:{color:GOLD}});
  s.addText("Diagnosis, Prevention & Pharmacological Management",{x:0.5,y:3.0,w:8.5,h:0.55,fontSize:15,color:"CADCFC",fontFace:"Calibri",italic:true});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar",{x:0.5,y:4.1,w:9,h:0.4,fontSize:12,color:GOLD_L,fontFace:"Calibri",bold:true});

  // Slide 2 - Epidemiology & Definition
  s=pres.addSlide(); hdr(s,pres,"Definition & Epidemiology");
  s.addText(bl([{t:"WHO Definition:",b:true,g:true},"BMD T-score ≤ −2.5 SD below young adult mean (DXA scan)","T-score −1.0 to −2.5 = Osteopenia (low bone mass)",{t:"Global Burden:",b:true,g:true},"200 million women affected worldwide","1 in 3 women and 1 in 5 men over 50 sustain osteoporotic fracture","India: 50 million osteoporotic patients; rising with aging population","Hip fracture mortality: 20–30% within 1 year","Estimated cost: ₹10,000 crore/year in India",{t:"Peak Bone Mass:",b:true,g:true},"Achieved by age 25–30; 90% by age 18","Genetic factors account for 60–80% of peak bone mass","Calcium + Vitamin D + exercise critical in adolescence"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 3 - Pathophysiology
  s=pres.addSlide(); hdr(s,pres,"Pathophysiology of Osteoporosis");
  s.addShape(pres.shapes.RECTANGLE,{x:4.9,y:1.05,w:0.04,h:4.4,fill:{color:GOLD}});
  s.addText("Bone Remodelling Cycle",{x:0.3,y:1.0,w:4.3,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bl(["Osteoclasts: bone resorption (RANKL-mediated)","Osteoblasts: bone formation (Wnt-pathway)","Normal: resorption = formation (coupled)","Osteoporosis: uncoupling — resorption > formation","Post-menopause: oestrogen loss → RANKL upregulation","Net bone loss: 1–2% per year post-menopause","Trabecular bone lost faster than cortical"]),{x:0.3,y:1.38,w:4.3,h:4.0,valign:"top"});
  s.addText("Types of Osteoporosis",{x:5.2,y:1.0,w:4.5,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bl(["Type I (Postmenopausal): oestrogen deficiency","Type II (Senile): age-related, both sexes > 70 yrs","Secondary Causes:","Glucocorticoid use (most common drug cause)","Hyperparathyroidism, hyperthyroidism","Malabsorption (coeliac, IBD)","Hypogonadism (male — testosterone deficiency)","Anticonvulsants, PPIs, heparin","Immobilisation, anorexia nervosa"]),{x:5.2,y:1.38,w:4.5,h:4.0,valign:"top"});

  // Slide 4 - Risk Factors & FRAX
  s=pres.addSlide(); hdr(s,pres,"Risk Factors & FRAX Score");
  s.addText(bl([{t:"Major Clinical Risk Factors (FRAX inputs):",b:true,g:true},"Age > 65 years","Previous fragility fracture (strongest predictor)","Parental history of hip fracture","BMI < 19 kg/m²","Current smoking","Alcohol > 3 units/day","Glucocorticoid use (≥ 5 mg prednisolone ≥ 3 months)","Secondary osteoporosis (RA, diabetes, COPD)",{t:"FRAX Tool:",b:true,g:true},"Calculates 10-year probability of major osteoporotic fracture","Intervention threshold: FRAX hip fracture > 3% or major fracture > 20%","Available at: frax.shef.ac.uk — country-specific calculations"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 5 - Diagnosis DXA
  s=pres.addSlide(); hdr(s,pres,"Diagnosis — DXA & Laboratory Workup");
  s.addText(bl([{t:"DXA (Dual Energy X-ray Absorptiometry):",b:true,g:true},"Sites measured: Lumbar spine (L1–L4), hip (femoral neck + total hip)","T-score: compared to young adult reference population","Z-score: compared to age-matched controls (< −2.0 = secondary cause)",{t:"When to Scan:",b:true,g:true},"All women ≥ 65 years, men ≥ 70 years","Younger with risk factors (glucocorticoids, fragility fracture, etc.)","Repeat every 1–2 years if on treatment",{t:"Laboratory Tests:",b:true,g:true},"Calcium, Phosphate, ALP, 25-OH Vitamin D","PTH, TSH, testosterone (males), cortisol","Serum protein electrophoresis (myeloma)","Bone turnover markers: CTX (resorption), P1NP (formation)"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 6 - Non-pharmacological
  s=pres.addSlide(); hdr(s,pres,"Non-pharmacological Management");
  s.addText(bl([{t:"Calcium & Vitamin D:",b:true,g:true},"Calcium: 1000–1200 mg/day (dietary preferred; supplement if deficient)","Vitamin D: 800–1000 IU/day (higher doses in deficiency)","Target 25-OH Vitamin D: > 50 nmol/L",{t:"Exercise:",b:true,g:true},"Weight-bearing aerobic: walking, jogging, dancing (30 min × 5/week)","Resistance training: builds muscle + stimulates osteogenesis","Balance training: Tai Chi reduces falls by 30–50%",{t:"Lifestyle Modifications:",b:true,g:true},"Stop smoking: 10–15% BMD improvement over 10 years","Limit alcohol: < 2 units/day","Fall prevention: home assessment, remove trip hazards, good footwear","Hip protectors: in nursing home patients, reduce hip fracture by 25%"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 7 - Pharmacological
  s=pres.addSlide(); hdr(s,pres,"Pharmacological Treatment");
  s.addShape(pres.shapes.RECTANGLE,{x:4.9,y:1.05,w:0.04,h:4.4,fill:{color:GOLD}});
  s.addText("Antiresorptive Agents",{x:0.3,y:1.0,w:4.3,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bl(["Alendronate: 70 mg weekly PO — first-line","Risedronate: 35 mg weekly — GI-friendly","Zoledronic acid: 5 mg IV yearly — best adherence","Denosumab: 60 mg SC 6-monthly — RANK-L inhibitor","Raloxifene (SERM): post-menopausal women only","HRT: vertebral fracture reduction; cardiovascular risks","Drug holiday: bisphosphonates after 5 years (vertebral)","Atypical femur fracture: rare (1:1000) — stop if thigh pain"]),{x:0.3,y:1.38,w:4.3,h:4.0,valign:"top"});
  s.addText("Anabolic Agents",{x:5.2,y:1.0,w:4.5,h:0.38,fontSize:13,bold:true,color:GOLD,fontFace:"Calibri"});
  s.addText(bl(["Teriparatide (PTH 1-34): 20 mcg SC daily × 2 years","Builds new bone — unlike antiresorptives","Reduces vertebral fractures by 65%, non-vertebral by 53%","Indications: severe osteoporosis, multiple fractures, failure of antiresorptive","Abaloparatide: PTHrP analogue — similar efficacy","Romosozumab: anti-sclerostin antibody; anabolic + antiresorptive","12 months then switch to antiresorptive","Monitoring: P1NP (response marker at 3 months)"]),{x:5.2,y:1.38,w:4.5,h:4.0,valign:"top"});

  // Slide 8 - Fragility fractures
  s=pres.addSlide(); hdr(s,pres,"Fragility Fractures — Orthopaedic Management");
  s.addText(bl([{t:"Definition:",b:true,g:true},"Fracture from low-energy mechanism (fall from standing height or less)",{t:"Common Sites:",b:true,g:true},"Vertebral (most common — 50% asymptomatic), Distal radius (Colles'), Hip (most morbid), Proximal humerus",{t:"Hip Fracture Management:",b:true,g:true},"Surgery within 48 hours (best outcomes — orthogeriatric care model)","Intracapsular (NOF): hemiarthroplasty vs THR","Extracapsular (intertrochanteric): DHS or cephalomedullary nail","Orthogeriatric co-management reduces mortality by 30–40%",{t:"Secondary Fracture Prevention:",b:true,g:true},"Fracture Liaison Service (FLS) — identify + treat all fragility fractures","Start antiresorptive therapy within 2 weeks of hip fracture","NICE guideline: treat all women > 75 with hip fracture — no DXA needed"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 9 - Takeaways
  s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.1,fill:{color:GOLD}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:0.1,fill:{color:GOLD}});
  s.addText("KEY TAKEAWAYS",{x:0.5,y:0.2,w:9,h:0.6,fontSize:24,bold:true,color:GOLD_L,fontFace:"Calibri",align:"center"});
  s.addText([
    {text:"T-score ≤ −2.5 = Osteoporosis; T-score −1.0 to −2.5 = Osteopenia",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Previous fragility fracture is the single strongest predictor of future fracture",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"FRAX tool guides treatment decisions; threshold: hip fracture risk > 3%",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Bisphosphonates are first-line; consider drug holiday after 5 years",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Teriparatide for severe osteoporosis; greatest anabolic effect",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Hip fracture: surgery within 48 hours under orthogeriatric co-management",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Fracture Liaison Service prevents 20–25% of secondary fractures",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:0,breakLine:false}},
  ],{x:0.5,y:1.0,w:9,h:4.3,valign:"top"});

  await pres.writeFile({fileName:"slides/osteoporosis-bone-health.pptx"});
  console.log("✅  slides/osteoporosis-bone-health.pptx created");
}
build().catch(console.error);
