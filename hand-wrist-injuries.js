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
  const pres=new pptxgen(); pres.layout="LAYOUT_16x9"; pres.title="Hand & Wrist Injuries";

  // Title
  let s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:GOLD}});
  s.addText("HAND & WRIST",{x:0.5,y:0.9,w:9,h:1.0,fontSize:42,bold:true,color:WHITE,fontFace:"Calibri"});
  s.addText("INJURIES",{x:0.5,y:1.85,w:9,h:0.9,fontSize:36,bold:true,color:GOLD_L,fontFace:"Calibri"});
  s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:2.85,w:5,h:0.04,fill:{color:GOLD},line:{color:GOLD}});
  s.addText("Fractures, Tendon Injuries, Nerve Compression & Microsurgery Principles",{x:0.5,y:3.0,w:8.5,h:0.55,fontSize:14,color:"CADCFC",fontFace:"Calibri",italic:true});
  s.addText("Dr. Maninder Singh  |  MS Orthopedics  |  GMCH Amritsar",{x:0.5,y:4.1,w:9,h:0.4,fontSize:12,color:GOLD_L,fontFace:"Calibri",bold:true});

  // Slide 2 - Anatomy
  s=pres.addSlide(); hdr(s,pres,"Functional Anatomy of Hand & Wrist");
  twocol(s,pres,
    ["Carpal bones (proximal row): Scaphoid, Lunate, Triquetrum, Pisiform","Carpal bones (distal row): Trapezium, Trapezoid, Capitate, Hamate","SL ligament: most important wrist stabiliser","TFCC (Triangular Fibrocartilage Complex): ulnar-side stabiliser","Flexor tendons: FDS (superficialis), FDP (profundus)","Zone 2 (No Man's Land): flexor sheath — difficult repairs","Extensor tendons: 6 extensor compartments","Mallet finger: zone 1 extensor tendon avulsion"],
    ["Extrinsic muscles: long flexors and extensors","Intrinsic muscles: lumbricals, interossei, thenar, hypothenar","Thumb opposition: median nerve (recurrent branch — APB)","Finger abduction: ulnar nerve (dorsal interossei)","Key pinch: ulnar nerve","Nerve territories: Median (lateral 3½ fingers), Ulnar (medial 1½), Radial (dorsum)","Blood supply: radial and ulnar arteries → superficial + deep palmar arches","Allen's test: radial vs ulnar artery dominance"],
    "Osseous & Ligamentous","Tendons & Neurovascular");

  // Slide 3 - Distal radius fracture
  s=pres.addSlide(); hdr(s,pres,"Distal Radius Fractures");
  s.addText(bl([{t:"Most common fracture in adults (16% of all fractures):",b:true,g:true},"Colles' fracture: FOOSH, dorsal displacement + radial deviation + impaction","Smith's fracture: volar displacement — reverse Colles' (direct blow)","Barton's fracture: intra-articular rim fracture (dorsal or volar)",{t:"Classification:",b:true,g:true},"Frykman (I–VIII), AO/OTA, Fernandez — guides treatment","Radiological criteria for instability: dorsal tilt > 20°, radial shortening > 5 mm, intra-articular step > 2 mm",{t:"Management:",b:true,g:true},"Undisplaced stable: below-elbow cast 5–6 weeks","Displaced: closed reduction under haematoma block or Bier's block","Unstable / intra-articular: volar locking plate (gold standard) or external fixator","Bridge plating for highly comminuted; arthroscopic assistance for articular step",{t:"Complications:",b:true,g:true},"Malunion (most common), median nerve injury (CTS), EPL rupture, CRPS"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 4 - Scaphoid
  s=pres.addSlide(); hdr(s,pres,"Scaphoid Fractures — Diagnosis & Management");
  s.addText(bl([{t:"Most commonly missed carpal fracture:",b:true,g:true},"Mechanism: FOOSH — 70% of all carpal fractures","Peak: young males 15–30 years; rare in elderly (distal radius fractures instead)",{t:"Diagnosis:",b:true,g:true},"'Anatomical snuffbox' tenderness — clinical scaphoid fracture until proven otherwise","X-ray: 60–70% sensitive (initial X-ray can be normal in undisplaced fractures)","CT scan: gold standard for fracture pattern + displacement","MRI: best for occult fractures — diagnose within 24 hours",{t:"Blood Supply:",b:true,g:true},"Retrograde — proximal pole is avascular; waist fractures = 30% AVN risk",{t:"Management:",b:true,g:true},"Undisplaced distal pole: thumb spica cast 6–8 weeks","Undisplaced waist: cast vs percutaneous headless compression screw","Displaced / proximal pole: ORIF with headless screw (Herbert / Acutrak)","AVN management: vascularised bone graft (1,2 ICSRA or free vascularised graft)"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 5 - Flexor / Extensor tendons
  s=pres.addSlide(); hdr(s,pres,"Tendon Injuries of the Hand");
  twocol(s,pres,
    [{t:"Flexor Tendon Zones:",b:true},"Zone 1: FDP only — jersey finger (ring finger most common)","Zone 2 (No Man's Land): FDS + FDP within sheath","Zone 2 repair: most technically demanding","Zone 3–5: extra-synovial — better outcomes","Primary repair: within 12–24 hours preferred","Core sutures (4-strand minimum) + epitendinous suture","Post-repair: early active mobilisation (Kleinert / Belfast protocol)","Avoid passive immobilisation — reduces adhesion + improves gliding"],
    [{t:"Extensor Tendon Zones:",b:true},"Zone 1: Mallet finger — DIP extension lag","Mallet: 6–8 weeks DIP splint in extension (Stack splint)","Bony mallet > 30% articular surface: ORIF","Zone 3: Boutonnière deformity — central slip disruption","Acute boutonnière: splint PIP in extension 6 weeks","Zone 5–7: Sagittal band rupture — trigger finger","Extensor pollicis longus (EPL) rupture: seen after distal radius fracture","EIP or EBP transfer for EPL rupture"],
    "Flexor Tendons","Extensor Tendons");

  // Slide 6 - Nerve compression
  s=pres.addSlide(); hdr(s,pres,"Nerve Compression Syndromes");
  s.addText(bl([{t:"Carpal Tunnel Syndrome (CTS) — Most common compression neuropathy:",b:true,g:true},"Compression of median nerve under flexor retinaculum","Symptoms: nocturnal paraesthesia in lateral 3½ fingers, thenar wasting (late)","Tinel's sign (wrist flexion crease), Phalen's test (wrist flexion 60 sec)","Investigations: nerve conduction studies (gold standard — NCS/EMG)","Treatment: night splint + steroid injection (temporary); surgical carpal tunnel decompression (definitive)",{t:"Cubital Tunnel Syndrome — Second most common:",b:true,g:true},"Ulnar nerve compression at elbow (Osborne's fascia)","Ring + little finger paraesthesia, clawing (ring + little), weak grip","Froment's sign: thumb IP flexion (FPL compensates for weak APB)","Treatment: elbow padding; surgical: in-situ decompression or anterior transposition",{t:"Radial Tunnel Syndrome:",b:true,g:true},"PIN compression at arcade of Frohse — lateral forearm pain","No true motor weakness; differentiate from lateral epicondylitis"]),{x:0.4,y:1.1,w:9.2,h:4.3,valign:"top"});

  // Slide 7 - Replantation & Microsurgery
  s=pres.addSlide(); hdr(s,pres,"Replantation & Microsurgical Principles");
  twocol(s,pres,
    [{t:"Replantation Indications:",b:true},"Thumb amputation (functional priority)","Multiple digit amputation","Single finger in children","Wrist / transmetacarpal level","Relative: single finger distal to FDS insertion",{t:"Contraindications:",b:true},"Severely crushed / avulsed parts","Multi-level injury","Prolonged ischaemia (> 6 hr warm, > 12 hr cold)","Elderly with comorbidities","Patient preference"],
    [{t:"Replantation Sequence (BEFAVS):",b:true},"Bone: shortening + fixation (K-wire or mini-plate)","Extensor tendon repair","Flexor tendon repair","Artery repair (vein graft if tension)","Vein repair (2:1 ratio to arteries)","Skin closure",{t:"Post-operative:",b:true},"Heparin infusion, aspirin, chlorpromazine (vasodilation)","Hourly flap/digit monitoring — Doppler + colour","Failure: venous congestion (commonest) — leech therapy","Survival rates: 80% thumb, 75% multiple digit"],
    "Indications & Contraindications","Technique & Post-op");

  // Slide 8 - Takeaways
  s=pres.addSlide(); s.background={color:NAVY};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.1,fill:{color:GOLD}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:5.5,w:10,h:0.1,fill:{color:GOLD}});
  s.addText("KEY TAKEAWAYS",{x:0.5,y:0.2,w:9,h:0.6,fontSize:24,bold:true,color:GOLD_L,fontFace:"Calibri",align:"center"});
  s.addText([
    {text:"Anatomical snuffbox tenderness = clinical scaphoid fracture until proven otherwise",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Volar locking plate is gold standard for unstable distal radius fractures",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Zone 2 flexor tendon repair requires 4-strand core suture + early active mobilisation",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Mallet finger: 6–8 weeks continuous DIP extension splinting — no surgery unless bony Mallet > 30%",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"CTS: NCS/EMG confirms diagnosis; carpal tunnel decompression is curative",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"Thumb replantation is always indicated — it contributes 40% of hand function",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:7,breakLine:true}},
    {text:"BEFAVS sequence ensures optimal replantation outcomes",options:{bullet:true,color:WHITE,fontSize:14,fontFace:"Calibri",paraSpaceAfter:0,breakLine:false}},
  ],{x:0.5,y:1.0,w:9,h:4.3,valign:"top"});

  await pres.writeFile({fileName:"slides/hand-wrist-injuries.pptx"});
  console.log("✅  slides/hand-wrist-injuries.pptx created");
}
build().catch(console.error);
