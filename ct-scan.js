/* OrthoChronicles Calorie Tracker — camera scanner (barcode + AI food photo), built for reliability */
const SC={stream:null,track:null,mode:'barcode',timer:0,det:null,zx:null,zxReady:false,busy:false,last:'',lastT:0,hits:0,torch:false,zoomIdx:0,on:false,result:null};
const SC_FORMATS=['ean_13','ean_8','upc_a','upc_e','code_128','code_39','itf','qr_code'];

function setScanStatus(type,msg){
  const d=$('scDot'),t=$('scMsg');if(!d||!t)return;
  d.className='d '+({scanning:'go',loading:'ld',error:'err'}[type]||'');t.textContent=msg;
}
function validEAN(c){
  if(!/^\d+$/.test(c))return true;               // non-numeric (QR/Code128): accept
  if(![8,12,13].includes(c.length))return c.length>=6;
  let s=0;const a=c.split('').map(Number),chk=a.pop();
  a.reverse().forEach((n,i)=>{s+=n*(i%2===0?3:1);});
  return (10-(s%10))%10===chk;
}
function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector('script[src="'+src+'"]')){res();return;}
    const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('load '+src));document.head.appendChild(s);
  });
}

/* ── open / close ── */
async function openScanner(mode,onPickMeal){
  SC.on=true;SC.result=null;SC.hits=0;SC.last='';
  $('scan').classList.add('on');document.body.style.overflow='hidden';
  setScanMode(mode||'barcode',true);
  await startCamera();
}
function closeScanner(){
  SC.on=false;clearTimeout(SC.timer);stopCamera();
  $('scan').classList.remove('on');document.body.style.overflow='';
  $('scRes').innerHTML='';
}
function stopCamera(){
  try{if(SC.stream)SC.stream.getTracks().forEach(t=>t.stop());}catch(e){}
  SC.stream=null;SC.track=null;SC.torch=false;
  const v=$('scVideo');if(v)v.srcObject=null;
}
async function startCamera(){
  stopCamera();$('scErr').classList.add('hide');$('scVideo').classList.remove('hide');$('scFrame').style.display='';$('scHint').style.display='';
  setScanStatus('loading','Starting camera…');
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){camFail('unsupported');return;}
  const tries=[{video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false},{video:{facingMode:'environment'},audio:false},{video:true,audio:false}];
  let stream=null,err=null;
  for(const c of tries){try{stream=await navigator.mediaDevices.getUserMedia(c);break;}catch(e){err=e;if(e&&(e.name==='NotAllowedError'||e.name==='SecurityError'))break;}}
  if(!stream){camFail(err&&err.name);return;}
  SC.stream=stream;SC.track=stream.getVideoTracks()[0];
  const v=$('scVideo');v.setAttribute('playsinline','');v.muted=true;v.srcObject=stream;
  try{await v.play();}catch(e){}
  // continuous focus + capability-driven tools
  try{
    const caps=SC.track.getCapabilities?SC.track.getCapabilities():{};
    if(caps.focusMode&&caps.focusMode.includes('continuous'))await SC.track.applyConstraints({advanced:[{focusMode:'continuous'}]});
    $('scTorch').classList.toggle('hide',!caps.torch);
    $('scZoom').classList.toggle('hide',!caps.zoom);SC.zoomCaps=caps.zoom||null;SC.zoomIdx=0;
  }catch(e){}
  if(SC.mode==='barcode')startBarcodeLoop();else setScanStatus('scanning','Point at your food and tap the shutter');
}
function camFail(name){
  const m={NotAllowedError:['🔒','Camera permission needed','Allow camera access in your phone settings (Settings → Apps → Calorie Tracker → Permissions), then tap Retry.'],
    NotFoundError:['📷','No camera found','This device has no usable camera. You can still scan from a photo or type the barcode.'],
    NotReadableError:['📷','Camera is busy','Close other apps using the camera and tap Retry.'],
    unsupported:['⚠️','Camera not supported','Use "Scan from photo" below or type the barcode number.']}[name]||['⚠️','Camera unavailable','Tap Retry, or use "Scan from photo" / type the barcode below.'];
  $('scVideo').classList.add('hide');$('scFrame').style.display='none';$('scHint').style.display='none';
  const e=$('scErr');e.classList.remove('hide');
  e.innerHTML='<div style="font-size:3rem">'+m[0]+'</div><h3 style="margin:8px 0 4px">'+m[1]+'</h3><p style="font-size:.82rem;opacity:.85;margin-bottom:14px">'+m[2]+'</p><button class="btn sm" data-act="scRetry">🔄 Retry camera</button>';
  setScanStatus('error',m[1]);
}
function setScanMode(mode,silent){
  SC.mode=mode;clearTimeout(SC.timer);SC.result=null;$('scRes').innerHTML='';
  document.querySelectorAll('#scan [data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));
  $('scFrame').classList.toggle('sq',mode==='photo');
  $('scShut').classList.toggle('hide',mode!=='photo');
  $('scSnap').style.display='none';$('scVideo').style.display='';
  $('scHint').textContent=mode==='barcode'?'Fit the barcode inside the frame · hold steady':'Frame your plate or food item, then tap the shutter';
  $('scManual').classList.toggle('hide',mode!=='barcode');
  if(!silent&&SC.stream){mode==='barcode'?startBarcodeLoop():setScanStatus('scanning','Point at your food and tap the shutter');}
}

/* ── barcode engine: native BarcodeDetector first, ZXing fallback ── */
async function initBarcodeEngine(){
  if(SC.det||SC.zxReady)return;
  if('BarcodeDetector' in window){
    try{const f=await BarcodeDetector.getSupportedFormats();const w=SC_FORMATS.filter(x=>f.includes(x));if(w.length){SC.det=new BarcodeDetector({formats:w});return;}}catch(e){}
  }
  try{
    if(!window.ZXing)await loadScript('https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js');
    const Z=window.ZXing,hints=new Map();
    hints.set(Z.DecodeHintType.POSSIBLE_FORMATS,[Z.BarcodeFormat.EAN_13,Z.BarcodeFormat.EAN_8,Z.BarcodeFormat.UPC_A,Z.BarcodeFormat.UPC_E,Z.BarcodeFormat.CODE_128,Z.BarcodeFormat.CODE_39,Z.BarcodeFormat.ITF,Z.BarcodeFormat.QR_CODE]);
    hints.set(Z.DecodeHintType.TRY_HARDER,true);
    SC.zx=new Z.MultiFormatReader();SC.zx.setHints(hints);SC.zxReady=true;
  }catch(e){}
}
async function startBarcodeLoop(){
  setScanStatus('loading','Preparing scanner…');
  await initBarcodeEngine();
  if(!SC.det&&!SC.zxReady){setScanStatus('error','Scanner engine unavailable — use "Scan from photo" or type the number');return;}
  setScanStatus('scanning','Scanning… align the barcode in the frame');
  const cv=document.createElement('canvas'),ctx=cv.getContext('2d',{willReadFrequently:true});
  clearTimeout(SC.timer);
  const tick=async()=>{
    if(!SC.on||SC.mode!=='barcode'||SC.result)return;
    const v=$('scVideo');
    if(v.readyState>=2&&v.videoWidth&&!SC.busy){
      SC.busy=true;
      try{
        // centre region of interest (barcode frame) → better accuracy + speed
        const vw=v.videoWidth,vh=v.videoHeight,rw=vw*.86,rh=Math.min(vh*.5,rw*.62),rx=(vw-rw)/2,ry=(vh-rh)/2-vh*.04;
        const sc=Math.min(1,900/rw);cv.width=Math.round(rw*sc);cv.height=Math.round(rh*sc);
        ctx.drawImage(v,rx,ry,rw,rh,0,0,cv.width,cv.height);
        let code=null;
        if(SC.det){const r=await SC.det.detect(cv);if(r&&r.length)code=r[0].rawValue;}
        if(!code&&SC.zxReady){
          try{const Z=window.ZXing,lum=new Z.HTMLCanvasElementLuminanceSource(cv),bmp=new Z.BinaryBitmap(new Z.HybridBinarizer(lum));code=SC.zx.decode(bmp).getText();}catch(e){}
          if(!code){ // second chance on the whole frame
            try{const Z=window.ZXing,c2=document.createElement('canvas');const s2=Math.min(1,900/vw);c2.width=vw*s2;c2.height=vh*s2;c2.getContext('2d').drawImage(v,0,0,c2.width,c2.height);
              const lum=new Z.HTMLCanvasElementLuminanceSource(c2),bmp=new Z.BinaryBitmap(new Z.HybridBinarizer(lum));code=SC.zx.decode(bmp).getText();}catch(e){}
          }
        }
        if(code)onBarcode(code);
      }catch(e){}
      SC.busy=false;
    }
    SC.timer=setTimeout(tick,SC.det?110:200);
  };
  tick();
}
function onBarcode(code){
  code=String(code).trim();if(!code)return;
  const now=Date.now();
  if(code===SC.last&&now-SC.lastT<1800)SC.hits++;else SC.hits=1;
  SC.last=code;SC.lastT=now;
  if(!validEAN(code)&&SC.hits<2)return;                  // guard against mis-reads: require a valid checksum or two reads
  SC.result=code;clearTimeout(SC.timer);buzz(30);
  lookupBarcode(code);
}

/* ── product lookup (Open Food Facts) with cache, timeout and retry ── */
async function fetchOFF(code){
  const url='https://world.openfoodfacts.org/api/v2/product/'+encodeURIComponent(code)+'.json?fields=product_name,product_name_en,brands,nutriments,serving_size,serving_quantity,quantity';
  for(let a=0;a<2;a++){
    const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),9000);
    try{const r=await fetch(url,{signal:ctrl.signal});clearTimeout(tid);if(r.status===404)return null;if(!r.ok)throw new Error(r.status);return await r.json();}
    catch(e){clearTimeout(tid);if(a===1)throw e;await new Promise(r=>setTimeout(r,600));}
  }
}
async function lookupBarcode(code){
  setScanStatus('loading','Looking up '+code+'…');$('scRes').innerHTML='';
  try{
    let food=null;const cached=lsGet('ct_bc_'+code);
    if(cached){try{food=JSON.parse(cached);}catch(e){}}
    if(!food){
      const d=await fetchOFF(code);
      if(d&&d.status===1&&d.product){
        const p=d.product,n=p.nutriments||{};
        let cal=n['energy-kcal_100g'];if(cal==null&&n['energy-kcal']!=null)cal=n['energy-kcal'];if(cal==null&&n.energy_100g!=null)cal=n.energy_100g/4.184;
        food={id:'bc'+code,name:((p.product_name_en||p.product_name||'').trim()||'Scanned product'),brand:(p.brands||'').split(',')[0].trim(),cat:'custom',
          cal:Math.round(cal||0),prot:r1(n.proteins_100g||0),carb:r1(n.carbohydrates_100g||0),fat:r1(n.fat_100g||0),fiber:r1(n.fiber_100g||0),water:0,
          serv:parseFloat(p.serving_quantity)||0,sugar:r1(n.sugars_100g||0),code:code};
        lsSet('ct_bc_'+code,JSON.stringify(food));
      }
    }
    if(!food){showNotFound(code);return;}
    showBarcodeResult(food);
  }catch(e){
    setScanStatus('error','Network problem — check your connection');
    $('scRes').innerHTML='<div class="res"><b>Couldn\'t reach the food database.</b><div class="sub" style="margin:4px 0 10px">Check your internet connection and try again.</div><button class="btn sm" data-act="scAgain">🔄 Scan again</button> <button class="btn ghost sm" data-act="scManualAdd" data-code="'+esc(code)+'">✍️ Enter manually</button></div>';
  }
}
function mealChips(sel){return '<div class="cats" style="margin:8px 0 0">'+MEALS.map(m=>'<button class="cat'+(m.id===sel?' on':'')+'" data-act="scMeal" data-m="'+m.id+'">'+m.e+' '+m.n+'</button>').join('')+'</div>';}
function showBarcodeResult(food){
  SC.food=food;SC.meal=autoMeal();setScanStatus('scanning','✅ Product found');
  $('scRes').innerHTML='<div class="res"><div style="display:flex;gap:10px;align-items:flex-start"><div style="flex:1"><h4>'+esc(food.name)+'</h4><div class="sub">'+(food.brand?esc(food.brand)+' · ':'')+'Barcode '+esc(food.code||'')+'</div></div><div class="num" style="text-align:right"><b style="font-size:1.5rem;color:#FF7A1A">'+food.cal+'</b><div class="sub">kcal/100g</div></div></div>'+
    '<div class="nutr" style="margin:10px 0"><div><b>'+food.prot+'g</b><span>PROTEIN</span></div><div><b>'+food.carb+'g</b><span>CARBS</span></div><div><b>'+food.fat+'g</b><span>FAT</span></div><div><b>'+food.fiber+'g</b><span>FIBRE</span></div></div>'+
    (food.cal?'':'<div class="sub" style="color:#B45309;margin-bottom:6px">⚠️ This product has no calorie data — you can edit it before saving.</div>')+
    '<div class="sub" style="font-weight:700">Add to</div>'+mealChips(SC.meal)+
    '<div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="flex:1" data-act="scAdd">Add to diary</button><button class="btn ghost sm" data-act="scAgain">Scan again</button></div></div>';
}
function showNotFound(code){
  setScanStatus('error','Product not found');
  $('scRes').innerHTML='<div class="res"><b>🤔 We don\'t have this product yet</b><div class="sub" style="margin:4px 0 10px">Barcode '+esc(code)+' isn\'t in the public database. Add it once and it will be saved in <b>My foods</b>.</div><div style="display:flex;gap:8px"><button class="btn sm" data-act="scManualAdd" data-code="'+esc(code)+'">✍️ Add manually</button><button class="btn ghost sm" data-act="scSearch">🔍 Search foods</button><button class="btn ghost sm" data-act="scAgain">Again</button></div></div>';
}
function scanAgain(){SC.result=null;SC.last='';SC.hits=0;$('scRes').innerHTML='';$('scSnap').style.display='none';$('scVideo').style.display='';if(SC.mode==='barcode')startBarcodeLoop();else setScanStatus('scanning','Point at your food and tap the shutter');}

/* ── scan from a photo / gallery (reliable fallback) ── */
async function decodeImageFile(file){
  setScanStatus('loading','Reading barcode from photo…');
  try{
    const bmp=await createImageBitmap(file);
    await initBarcodeEngine();
    const cv=document.createElement('canvas'),sc=Math.min(1,1400/Math.max(bmp.width,bmp.height));cv.width=bmp.width*sc;cv.height=bmp.height*sc;cv.getContext('2d').drawImage(bmp,0,0,cv.width,cv.height);
    let code=null;
    if(SC.det){const r=await SC.det.detect(cv);if(r.length)code=r[0].rawValue;}
    if(!code&&SC.zxReady){try{const Z=window.ZXing,lum=new Z.HTMLCanvasElementLuminanceSource(cv),b=new Z.BinaryBitmap(new Z.HybridBinarizer(lum));code=SC.zx.decode(b).getText();}catch(e){}}
    if(code){SC.result=code;buzz(30);lookupBarcode(code);}
    else{setScanStatus('error','No barcode found in that photo');toast('Couldn\'t read a barcode — try a closer, sharper photo');}
  }catch(e){setScanStatus('error','Couldn\'t read the photo');}
}

/* ── AI food photo ── */
function snapPhoto(){
  const v=$('scVideo');if(!v.videoWidth){toast('Camera not ready yet');return;}
  const c=$('scSnap');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);
  c.style.display='block';v.style.display='none';
  runAI(c);
}
async function runAI(canvas){
  setScanStatus('loading','Analysing colours…');$('scRes').innerHTML='<div class="res"><div class="sub">🔬 Running colour + AI analysis…</div></div>';
  let colorHits=[],tfHits=[];
  try{colorHits=analyseColour(canvas);}catch(e){}
  try{
    setScanStatus('loading','Running AI model (first use downloads ~8 MB)…');
    const model=await getModel();
    const small=document.createElement('canvas');small.width=224;small.height=224;small.getContext('2d').drawImage(canvas,0,0,224,224);
    const preds=await model.classify(small,10);tfHits=mapPredictions(preds);
  }catch(e){}
  const hits=mergeResults(colorHits,tfHits);
  showAIResults(hits);
}
function showAIResults(hits){
  const list=hits.map(h=>{const f=allFoods().find(x=>x.id===h.id);return f?{f:f,s:h.score}:null;}).filter(Boolean).slice(0,4);
  setScanStatus(list.length?'scanning':'error',list.length?'Pick the best match':'Not sure what this is');
  let h='<div class="res"><b>'+(list.length?'🍽️ Looks like…':'🤔 Couldn\'t identify this food')+'</b>';
  list.forEach(x=>{h+='<div class="fitem" data-act="scPickFood" data-id="'+x.f.id+'"><div class="fe">'+foodEmoji(x.f)+'</div><div><b>'+esc(x.f.name)+'</b><span>'+Math.round(x.s*100)+'% match · P '+x.f.prot+' C '+x.f.carb+' F '+x.f.fat+'</span></div><div class="fa num">'+x.f.cal+'<br><span style="color:var(--mut);font-weight:500">kcal/100g</span></div></div>';});
  const quick=['gr03','gr01','dl01','pr01','pr02','da03','vg03','sn04','fr01','da02'];
  h+='<div class="sub" style="margin-top:10px;font-weight:700">⚡ Quick add common foods</div><div class="cats" style="flex-wrap:wrap;overflow:visible;margin-top:6px">'+quick.map(id=>{const f=allFoods().find(x=>x.id===id);return f?'<button class="cat" data-act="scPickFood" data-id="'+f.id+'">'+esc(f.name.replace(/\s*\(.*?\)/g,''))+'</button>':'';}).join('')+'</div>'+
    '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-act="scSearch">🔍 Search all foods</button><button class="btn ghost sm" data-act="scAgain">📷 Retake</button></div><div class="sub" style="margin-top:8px">AI estimates from appearance — always confirm the portion.</div></div>';
  $('scRes').innerHTML=h;
}
function scAddFood(food,meal){
  openQty(food,(grams)=>{
    const before=totals(selDate).cal;addFoodToLog(foodItem(food,grams),meal||SC.meal||autoMeal(),selDate);
    closeAllSheets();closeScanner();afterFoodLogged(before,selDate);
  });
}
async function scToggleTorch(){
  if(!SC.track)return;SC.torch=!SC.torch;
  try{await SC.track.applyConstraints({advanced:[{torch:SC.torch}]});$('scTorch').classList.toggle('on',SC.torch);}catch(e){SC.torch=false;toast('Torch not available');}
}
async function scCycleZoom(){
  if(!SC.track||!SC.zoomCaps)return;
  const z=SC.zoomCaps,steps=[z.min,Math.min(z.max,z.min+(z.max-z.min)*.4),Math.min(z.max,z.min+(z.max-z.min)*.7)];
  SC.zoomIdx=(SC.zoomIdx+1)%steps.length;
  try{await SC.track.applyConstraints({advanced:[{zoom:steps[SC.zoomIdx]}]});toast('Zoom '+(Math.round(steps[SC.zoomIdx]/z.min*10)/10)+'×');}catch(e){}
}
