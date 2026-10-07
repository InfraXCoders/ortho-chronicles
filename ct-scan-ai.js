/* AI food recognition helpers (colour profile + MobileNet v2) — ported from classic tracker */
const COLOR_PROFILES=[
  /* orange-red → dal / curry / sabzi */
  {hMin:10,hMax:38,sMin:45,lMin:25,lMax:72, matches:[['dl01','Dal / Lentil Soup',0.55],['sn12','Chole / Chickpea Curry',0.4],['sn11','Pav Bhaji',0.35]]},
  /* deep red → tomato / rajma */
  {hMin:0,hMax:12,sMin:50,lMin:25,lMax:60,  matches:[['vg02','Tomato',0.6],['dl05','Rajma',0.4]]},
  /* bright yellow → turmeric / dal tadka */
  {hMin:40,hMax:62,sMin:50,lMin:45,lMax:80, matches:[['dl01','Dal Tadka',0.55],['dl07','Chana Dal',0.4],['gr03','Turmeric Rice',0.3]]},
  /* white/cream → rice / roti / dahi / paneer */
  {hMin:0,hMax:360,sMin:0,lMin:80,lMax:100, matches:[['gr03','Steamed Rice',0.55],['gr01','Roti / Chapati',0.45],['da02','Curd / Dahi',0.4],['da03','Paneer',0.35]]},
  /* light tan/brown → roti / paratha / bread */
  {hMin:22,hMax:50,sMin:15,lMin:45,lMax:75, matches:[['gr01','Roti / Chapati',0.6],['gr02','Paratha',0.5],['gr10','Bread',0.35]]},
  /* dark brown → meat / chocolate */
  {hMin:18,hMax:42,sMin:20,lMin:12,lMax:44, matches:[['pr05','Mutton Curry',0.5],['pr01','Chicken Curry',0.5],['sn13','Chocolate',0.3]]},
  /* vivid green → spinach / vegetables */
  {hMin:80,hMax:155,sMin:35,lMin:22,lMax:65, matches:[['vg01','Spinach (Palak)',0.6],['vg05','Broccoli / Cauliflower',0.4],['vg06','Peas (Matar)',0.35]]},
  /* pale yellow-green → moong / salad */
  {hMin:60,hMax:90,sMin:20,lMin:55,lMax:85,  matches:[['dl02','Moong Dal',0.55],['vg01','Salad',0.35]]},
  /* purple/magenta → beetroot / brinjal */
  {hMin:270,hMax:330,sMin:30,lMin:20,lMax:65, matches:[['vg15','Beetroot',0.55],['vg07','Brinjal (Baingan)',0.45]]},
  /* golden → fried / samosa */
  {hMin:35,hMax:55,sMin:40,lMin:55,lMax:80,   matches:[['sn07','Samosa',0.5],['gr02','Paratha',0.45],['vg03','Aloo (Potato)',0.35]]},
];

/* ── MobileNet V2 loader ── */
let _tfModel=null;
function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)){res();return;}
    const s=document.createElement('script');
    s.src=src;s.onload=res;s.onerror=()=>rej(new Error('Script load failed: '+src));
    document.head.appendChild(s);
  });
}
async function getModel(){
  if(_tfModel)return _tfModel;
  setScanStatus('loading','Loading AI model (first use ~8 MB)…');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js');
  /* V2 alpha 1.0 — significantly better accuracy than V1 alpha 0.5 */
  _tfModel=await window.mobilenet.load({version:2,alpha:1.0});
  return _tfModel;
}

/* ── Colour analysis ──
   Samples a grid of pixels from the canvas, converts to HSL,
   finds the dominant hue zone, and returns matched food IDs.
─────────────────────────────────────────────────────────── */
function rgbToHsl(r,g,b){
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}
  else{
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r:h=((g-b)/d+(g<b?6:0))/6;break;
      case g:h=((b-r)/d+2)/6;break;
      default:h=((r-g)/d+4)/6;
    }
  }
  return[h*360,s*100,l*100];
}

function analyseColour(canvas){
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  /* Sample a 12×12 grid from the centre 60% of the image */
  const x0=Math.floor(W*0.2),x1=Math.floor(W*0.8);
  const y0=Math.floor(H*0.2),y1=Math.floor(H*0.8);
  const step=Math.max(1,Math.floor((x1-x0)/12));
  const hBins=new Array(360).fill(0);
  let totalS=0,totalL=0,samples=0;

  for(let y=y0;y<y1;y+=step){
    for(let x=x0;x<x1;x+=step){
      const px=ctx.getImageData(x,y,1,1).data;
      if(px[3]<128)continue; // skip transparent
      const[h,s,l]=rgbToHsl(px[0],px[1],px[2]);
      if(s>8){hBins[Math.floor(h)]++;}
      totalS+=s;totalL+=l;samples++;
    }
  }
  if(!samples)return[];

  const avgS=totalS/samples;
  const avgL=totalL/samples;
  /* Find dominant hue (smooth with ±5° window) */
  let bestH=-1,bestCount=0;
  for(let h=0;h<360;h++){
    let count=0;
    for(let d=-5;d<=5;d++)count+=hBins[(h+d+360)%360];
    if(count>bestCount){bestCount=count;bestH=h;}
  }

  /* Match against colour profiles */
  const results=[];
  for(const p of COLOR_PROFILES){
    const hMatch=bestH>=p.hMin&&bestH<=p.hMax;
    const sMatch=avgS>=p.sMin;
    const lMatch=avgL>=p.lMin&&avgL<=p.lMax;
    if(hMatch&&sMatch&&lMatch){
      for(const[id,label,boost]of p.matches)
        results.push({id,label,score:boost});
      break; // first matching profile wins
    }
  }
  return results;
}

/* ── Normalise MobileNet label ── */
function normLabel(raw){
  return raw.split(',')[0].trim()
    .toLowerCase()
    .replace(/[\s\-\/]+/g,'_')
    .replace(/[^a-z0-9_]/g,'');
}

/* ── Map MobileNet predictions to FOODS DB ── */
function mapPredictions(preds){
  return preds.flatMap(p=>{
    const label=normLabel(p.className||p.label||'');
    const score=p.probability||p.score||0;
    const id=AI_FOOD_MAP[label];
    if(id)return[{id,label:label.replace(/_/g,' '),score}];
    /* Fuzzy: any word in label appears in food name */
    const words=label.split('_').filter(w=>w.length>3);
    const food=FOODS.find(f=>words.some(w=>f.name.toLowerCase().includes(w)));
    if(food)return[{id:food.id,label:label.replace(/_/g,' '),score:score*0.75}];
    return[];
  });
}

/* ── Merge colour + MobileNet results ── */
function mergeResults(colorHits,tfHits){
  const map={};
  for(const h of colorHits){
    map[h.id]={id:h.id,label:h.label,score:h.score,source:'colour'};
  }
  for(const h of tfHits){
    if(map[h.id]){
      map[h.id].score=Math.min(0.99,map[h.id].score+h.score*0.6);
      map[h.id].source='both';
    }else{
      map[h.id]={id:h.id,label:h.label,score:h.score*0.85,source:'mobilenet'};
    }
  }
  return Object.values(map).sort((a,b)=>b.score-a.score).slice(0,5);
}

