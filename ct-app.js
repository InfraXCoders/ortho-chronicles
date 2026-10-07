/* OrthoChronicles Calorie Tracker — app glue: boot, onboarding, actions, menu, auth/sync hooks */
const PLAY_URL='https://play.google.com/store/apps/details?id=info.orthochronicles.calorietracker';
const SITE_URL='https://www.orthochronicles.info/calorie-tracker.html';

/* ── onboarding wizard ── */
let wz={i:0,d:{name:'',goal:'lose',gender:'m',age:28,height:170,weight:70,activity:1.55,diet:'veg'}};
const WZ=[
  {k:'name',big:'👋',t:'Welcome! What should we call you?',p:'We\'ll personalise your plan, reminders and greetings.',type:'text',ph:'Your first name'},
  {k:'goal',big:'🎯',t:'What is your main goal?',p:'We\'ll set calories and macros to match.',type:'opt',opts:[['lose','🔥 Lose weight','Gentle 500 kcal deficit'],['maintain','⚖️ Stay healthy','Maintain current weight'],['gain','💪 Build muscle','Lean gain with extra protein']]},
  {k:'gender',big:'🧬',t:'Your gender',p:'Used only for the calorie formula (Mifflin-St Jeor).',type:'opt',opts:[['m','👨 Male',''],['f','👩 Female','']]},
  {k:'age',big:'🎂',t:'How old are you?',p:'Age changes how many calories you burn at rest.',type:'num',min:10,max:100,unit:'years'},
  {k:'height',big:'📏',t:'Your height',p:'In centimetres.',type:'num',min:100,max:230,unit:'cm'},
  {k:'weight',big:'⚖️',t:'Your current weight',p:'In kilograms — you can log changes any time.',type:'num',min:25,max:250,unit:'kg',step:'0.1'},
  {k:'activity',big:'🏃',t:'How active are you?',p:'Be honest — it makes your goal accurate.',type:'opt',opts:[[1.2,'🪑 Sedentary','Desk job, little exercise'],[1.375,'🚶 Lightly active','Exercise 1–3 days/week'],[1.55,'🏋️ Moderately active','Exercise 3–5 days/week'],[1.725,'🏃 Very active','Hard exercise 6–7 days/week']]},
  {k:'diet',big:'🥘',t:'Your food preference',p:'Used for smart meal suggestions.',type:'opt',opts:[['veg','🥦 Vegetarian',''],['nonveg','🍗 Non-vegetarian','']]}
];
function openWizard(){wz.i=0;const p=state.profile||{};if(p.tdee){wz.d=Object.assign(wz.d,{goal:p.goal||'lose',gender:p.gender||'m',age:p.age||28,height:p.height||170,weight:p.weight||70,activity:p.activity||1.55,name:state.name||'',diet:state.diet||'veg'});}
  $('wiz').classList.add('on');renderWizard();}
function renderWizard(){
  const total=WZ.length+1;let h;
  if(wz.i>=WZ.length){
    const p=calcProfile(wz.d);wz.p=p;
    h='<div class="wz-body"><div class="big">🎉</div><h2>'+(wz.d.name?esc(wz.d.name)+', your':'Your')+' plan is ready!</h2><p>Here are your personalised daily targets</p>'+
      '<div style="background:rgba(255,255,255,.18);border-radius:24px;padding:20px;text-align:center"><div style="font-size:3rem;font-weight:800;line-height:1">'+p.tdee+'</div><div style="opacity:.85;font-size:.8rem;margin-bottom:14px">calories per day</div>'+
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px"><div style="background:rgba(255,255,255,.2);border-radius:14px;padding:8px 2px"><b>'+p.prot+'g</b><div style="font-size:.62rem;opacity:.85">PROTEIN</div></div><div style="background:rgba(255,255,255,.2);border-radius:14px;padding:8px 2px"><b>'+p.carb+'g</b><div style="font-size:.62rem;opacity:.85">CARBS</div></div><div style="background:rgba(255,255,255,.2);border-radius:14px;padding:8px 2px"><b>'+p.fat+'g</b><div style="font-size:.62rem;opacity:.85">FAT</div></div><div style="background:rgba(255,255,255,.2);border-radius:14px;padding:8px 2px"><b>'+(p.water/1000).toFixed(1)+'L</b><div style="font-size:.62rem;opacity:.85">WATER</div></div></div></div></div>';
  } else {
    const s=WZ[wz.i],v=wz.d[s.k];
    h='<div class="wz-body"><div class="big">'+s.big+'</div><h2>'+s.t+'</h2><p>'+s.p+'</p>';
    if(s.type==='text')h+='<input class="inp" id="wzin" type="text" maxlength="20" placeholder="'+s.ph+'" value="'+esc(v)+'" style="font-size:1.3rem" autocomplete="given-name">';
    else if(s.type==='num')h+='<input class="inp" id="wzin" type="number" inputmode="decimal" min="'+s.min+'" max="'+s.max+'" step="'+(s.step||1)+'" value="'+v+'"><p style="margin:8px 0 0">'+s.unit+'</p>';
    else s.opts.forEach(o=>{h+='<button class="opt'+(String(v)===String(o[0])?' on':'')+'" data-act="wzOpt" data-v="'+o[0]+'">'+o[1]+(o[2]?'<small>'+o[2]+'</small>':'')+'</button>';});
    h+='</div>';
  }
  $('wiz').innerHTML='<div style="display:flex;align-items:center;gap:10px"><div class="wz-bar" style="flex:1"><i style="width:'+Math.round((wz.i+1)/total*100)+'%"></i></div><button style="color:#fff;opacity:.85;font-size:.82rem;font-weight:600" data-act="wzSkip">'+(state.profile.tdee?'Cancel':'Skip')+'</button></div>'+h+
    '<div class="wz-foot">'+(wz.i>0?'<button class="back" data-act="wzBack">‹</button>':'')+'<button class="btn" data-act="wzNext">'+(wz.i>=WZ.length?'Start tracking 🚀':'Continue')+'</button></div>';
  const inp=$('wzin');if(inp&&WZ[wz.i]&&WZ[wz.i].type==='text')setTimeout(()=>{try{inp.focus();}catch(e){}},350);
}
function wzCollect(){
  if(wz.i>=WZ.length)return true;const s=WZ[wz.i],el=$('wzin');
  if(el){let v=el.value;if(s.type==='num'){v=parseFloat(v);if(!v||v<s.min||v>s.max){toast('Enter a value between '+s.min+' and '+s.max);return false;}}else v=v.trim();wz.d[s.k]=v;}
  return true;
}
function wzFinish(){
  const p=wz.p||calcProfile(wz.d);
  state.profile=p;state.name=wz.d.name||state.name;state.diet=wz.d.diet;
  const t=today();state.weights=state.weights.filter(x=>x.date!==t);state.weights.push({date:t,w:wz.d.weight});state.weights.sort((a,b)=>a.date<b.date?-1:1);
  saveState();$('wiz').classList.remove('on');go('home');confetti(80);toast('Welcome aboard! 🎉');maybeAskNotif();
  setTimeout(()=>{if(!state.plan)openSheet(sheetHead('🗓 Plan your meals?')+'<div class="sb"><p class="sub" style="margin-bottom:14px">Create a meal schedule (1–10 slots) and get friendly reminders with one-tap <b>Ate · Will eat · Skip</b> and water replies.</p><button class="btn" data-act="tab" data-tab="plan" data-close="1">Set up schedule & reminders</button><button class="btn ghost" style="margin-top:10px" data-act="closeSheet">Maybe later</button></div>');},1800);
}

/* ── goal sheet ── */
function goalSheet(){
  const g=targets();
  openSheet(sheetHead('🎯 Your daily goal')+'<div class="sb"><div class="nutr" style="grid-template-columns:repeat(2,1fr)"><div><b class="num" style="font-size:1.5rem;color:#FF7A1A">'+g.cal+'</b><span>CALORIES</span></div><div><b class="num" style="font-size:1.5rem;color:#0EA5E9">'+g.water+'</b><span>WATER ML</span></div><div><b style="color:#6366F1">'+g.prot+'g</b><span>PROTEIN</span></div><div><b style="color:#F59E0B">'+g.carb+'g</b><span>CARBS</span></div></div>'+
    '<div class="sub" style="text-align:center;margin:4px 0 12px">Fat '+g.fat+'g · '+(state.profile.goal==='lose'?'Weight-loss deficit':state.profile.goal==='gain'?'Muscle-gain surplus':'Maintenance')+'</div><button class="btn" data-act="wizard">✏️ Recalculate my goal</button></div>');
}

/* ── More menu ── */
function openExternal(url){try{if(IN_APP&&AndroidApp.openExternal){AndroidApp.openExternal(url);return;}}catch(e){}window.open(url,'_blank','noopener');}
function moreSheet(){
  const u=window.ctUser,g=targets();
  const row=(act,ic,bg,t,s,extra)=>'<button class="mrow" data-act="'+act+'" '+(extra||'')+'><i style="background:'+bg+'">'+ic+'</i><span>'+t+(s?'<small>'+s+'</small>':'')+'</span><b class="ch">›</b></button>';
  let h=sheetHead('Menu')+'<div class="sb">';
  h+='<div class="card flat" style="display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#ECFDF5,#D1FAE5)"><div class="avatar" style="width:54px;height:54px;background:#10B981;border-color:#fff;color:#fff">'+avatarHTML()+'</div><div style="flex:1;min-width:0"><b>'+esc(u?u.displayName||'Signed in':(state.name||'Guest'))+'</b><div class="sub" style="overflow:hidden;text-overflow:ellipsis">'+(u?esc(u.email||''):'Data saved on this device')+'</div><div class="sub" id="syncTxt" style="color:#047857;font-weight:600">'+(u?(window.ctSyncMsg||'☁ Synced to your Google account'):'')+'</div></div></div>';
  if(u)h+=row('signOut','🚪','#FEE2E2','Sign out','Your data stays safe in the cloud');
  else h+='<button class="btn" style="margin-bottom:6px" data-act="signIn">🔐 Sign in with Google to back up & sync</button><div class="sub" style="margin-bottom:8px;text-align:center">Meals, water, weight and reminder replies are saved to your Google account.</div>';
  h+=row('goal','🎯','#DCFCE7','My goal & profile',g.cal+' kcal · '+g.water+' ml water');
  h+=row('remindSet','⏰','#FEF3C7','Reminders','Meals & water alerts');
  h+=row('weight','⚖️','#F3E8FF','Log weight','');
  h+=row('shareApp','📤','#E0F2FE','Share with friends','Help others eat better');
  if(!IN_APP&&/Android/i.test(navigator.userAgent))h+=row('getApp','📲','#DCFCE7','Get the Android app','Best experience + background reminders');
  h+=row('consult','👨‍⚕️','#ECFDF5','Ask a nutrition expert','Email Dr. Maninder Singh');
  h+=row('feedback','💬','#FFEDD5','Send feedback','');
  h+=row('site','🌐','#E0E7FF','OrthoChronicles.info','Free ortho & health tools');
  h+=row('privacy','🔒','#F1F5F9','Privacy policy','');
  h+=row('resetData','🗑️','#FEE2E2','Reset all data','Deletes logs on this device');
  h+='<div class="sub" style="text-align:center;margin-top:14px">Calorie Tracker v3.0 · Made with ❤️ in India</div></div>';
  openSheet(h);
}

/* ── food of the day flash (once per day, slides up from bottom) ── */
function fotdSheet(){
  const f=fotdToday();
  openSheet('<div class="sb" style="padding-top:8px"><div class="card fotd" style="margin:0"><span class="tag">🌟 TODAY\'S HEALTHY PICK</span><div class="fh"><div class="em">'+f.e+'</div><div><h4>'+esc(f.n)+'</h4><div class="sub" style="color:#047857">Per 100 g · '+esc(f.s)+'</div></div></div><div class="fm"><div><b>'+f.c+'</b><span>KCAL</span></div><div><b>'+f.p+'g</b><span>PROTEIN</span></div><div><b>'+f.cb+'g</b><span>CARBS</span></div><div><b>'+f.f+'g</b><span>FAT</span></div></div><p><b>Why it\'s great:</b> '+esc(f.b)+'</p><button class="fb" data-act="addFotd">＋ Add to today\'s log</button><button class="fb" style="background:rgba(6,95,70,.12);color:#065F46;margin-top:8px" data-act="closeSheet">Got it</button></div></div>');
}
function addFotdToLog(){
  const f=fotdToday();
  const food={id:'fotd',name:f.n.replace(/\s*\(.*?\)/g,''),cat:'custom',cal:f.c,prot:f.p,carb:f.cb,fat:f.f,fiber:0,water:0};
  closeAllSheets();
  openQty(food,(grams)=>{const before=totals(selDate).cal;addFoodToLog(foodItem(food,grams),autoMeal(),selDate);closeAllSheets();afterFoodLogged(before,selDate);});
}

/* ── actions (data-act) ── */
const ACT={
  closeSheet(){closeSheet();},
  tab(el){if(el.dataset.close)closeAllSheets();go(el.dataset.tab);},
  selDate(el){selDate=el.dataset.d;renderAll();},
  more(){moreSheet();},
  goal(){goalSheet();},
  wizard(){closeAllSheets();openWizard();},
  scan(){openScanner('barcode');},
  addFood(el){logWithPicker(el.dataset.meal);},
  water(el){addWater(parseInt(el.dataset.ml,10),selDate===today()?today():selDate);},
  waterUndo(){waterUndo();},
  weight(){weightSheet();},
  wdelta(el){const i=$('wv');i.value=r1((parseFloat(i.value)||70)+parseFloat(el.dataset.d));},
  saveWeight(){saveWeight();},
  remindSet(){closeAllSheets();planTab='rem';go('plan');},
  delFood(el){const l=dayLog(selDate);if(!l)return;l.meals[el.dataset.meal].splice(+el.dataset.i,1);saveState();renderAll();toast('Removed');},
  pkcat(el){pk.cat=el.dataset.c;renderPickerCats();renderPickerList();},
  pickFood(el){const f=allFoods().find(x=>x.id===el.dataset.id);if(f&&pk.cb)pk.cb(f);},
  qc(el){qc=Math.max(1,qc+parseInt(el.dataset.d,10));renderQty();},
  qn(el){qn=Math.max(5,qn+parseInt(el.dataset.d,10));renderQty();},
  qset(el){qn=parseInt(el.dataset.v,10);renderQty();},
  qok(){const g=qGrams();if(!g){toast('Enter a quantity');return;}if(qf._cb)qf._cb(g);},
  customFood(){addCustomFoodSheet({name:pk.q?pk.q.replace(/\b\w/g,c=>c.toUpperCase()):''});},
  saveCustom(){const f=saveCustomFood();if(f&&pk.cb&&$('pkl')){}},
  addFotd(){addFotdToLog();},
  /* meal reminders / plan */
  slot(el){markSlot(today(),el.dataset.s,el.dataset.a);if(el.dataset.close)closeAllSheets();},
  slotD(el){markSlot(el.dataset.d,el.dataset.s,el.dataset.a);},
  planTab(el){planTab=el.dataset.v;renderPlan();},
  planRange(el){const p=ensurePlan();p.range=parseInt(el.dataset.v,10);p.start=today();saveState();syncReminders();renderPlan();toast('Plan set for '+RANGES.find(r=>r[0]===p.range)[1]);},
  createPlan(el){let n=parseInt(el.dataset.n,10);if(!n)n=parseInt($('cpn').textContent,10)||4;createPlan(n);},
  createPlanN(el){const b=$('cpn');b.textContent=Math.max(1,Math.min(10,(parseInt(b.textContent,10)||4)+parseInt(el.dataset.d,10)));},
  slotCount(el){setSlotCount(state.plan.slots.length+parseInt(el.dataset.d,10));},
  smart(){openSheet(sheetHead('✨ Smart fill')+'<div class="sb"><p class="sub" style="margin-bottom:12px">Fills every slot with balanced Indian foods for your goal ('+({lose:'weight loss',maintain:'maintenance',gain:'muscle gain'}[(state.profile.goal)||'maintain'])+'). You can edit anything afterwards.</p><button class="btn" data-act="smartGo" data-diet="veg">🥦 Vegetarian</button><button class="btn sec" style="margin-top:10px" data-act="smartGo" data-diet="nonveg">🍗 Non-vegetarian</button></div>');},
  smartGo(el){closeSheet();smartFill(el.dataset.diet);},
  slotToggle(el){const s=state.plan.slots.find(x=>x.id===el.dataset.s);s.on=!s.on;saveState();syncReminders();renderPlan();},
  slotFoodDel(el){const s=state.plan.slots.find(x=>x.id===el.dataset.s);s.foods.splice(+el.dataset.i,1);saveState();syncReminders();renderPlan();},
  slotAdd(el){const s=state.plan.slots.find(x=>x.id===el.dataset.s);openPicker('Add to '+s.name,food=>openQty(food,g=>{s.foods.push(foodItem(food,g));saveState();syncReminders();closeAllSheets();renderPlan();toast('Added to '+s.name);}));},
  planSel(el){planSel=el.dataset.d;renderPlan();},
  customizeDay(){customizeDay();},
  dayFoodDel(el){dayFoods(planSel,el.dataset.s).splice(+el.dataset.i,1);saveState();customizeDay();renderPlan();},
  dayFoodAdd(el){const sid=el.dataset.s,s=state.plan.slots.find(x=>x.id===sid);openPicker('Add to '+s.name+' (this day)',food=>openQty(food,g=>{dayFoods(planSel,sid).push(foodItem(food,g));saveState();closeAllSheets();customizeDay();renderPlan();}));},
  dayReset(){if(state.plan.ov)delete state.plan.ov[planSel];saveState();closeSheet();renderPlan();toast('Day reset to default');},
  clearPlan(){if(confirm('Delete your meal schedule and all reminders?')){state.plan=null;saveState();syncReminders();try{if(window.AndroidApp&&AndroidApp.cancelAll)AndroidApp.cancelAll();}catch(e){}renderPlan();toast('Schedule deleted');}},
  cpGoal(el){window._cpGoal=el.dataset.v;renderPlan();},
  cpDiet(el){window._cpDiet=el.dataset.v;state.diet=el.dataset.v;renderPlan();},
  usePlan(el){usePlanAsSchedule(el.dataset.g,el.dataset.d);},
  enableNotif(){enableNotifications();},
  testRem(){testReminder();},
  alarmSettings(){try{AndroidApp.openAlarmSettings();}catch(e){}},
  remWaterToggle(){state.rem.water.on=!state.rem.water.on;saveState();syncReminders();renderPlan();},
  remMealToggle(){state.rem.meals=!state.rem.meals;saveState();syncReminders();renderPlan();},
  remWater(el){const ml=parseInt(el.dataset.ml,10);closeSheet();if(ml)addWater(ml,today());else{dayLog(today(),true).wev.push({skip:1,ts:Date.now()});saveState();toast('Skipped');renderAll();}},
  progRange(el){progRange=parseInt(el.dataset.v,10);renderProgress();},
  /* scanner */
  scClose(){closeScanner();},
  scMode(el){setScanMode(el.dataset.mode);},
  scRetry(){startCamera();},
  scAgain(){scanAgain();},
  scTorch(){scToggleTorch();},
  scZoom(){scCycleZoom();},
  scShut(){snapPhoto();},
  scFile(){$('scFileIn').click();},
  scManualGo(){const v=$('scCode').value.trim();if(!v){toast('Type the barcode digits');return;}SC.result=v;lookupBarcode(v);},
  scMeal(el){SC.meal=el.dataset.m;document.querySelectorAll('#scRes [data-act=scMeal]').forEach(b=>b.classList.toggle('on',b===el));},
  scAdd(){scAddFood(SC.food,SC.meal);},
  scPickFood(el){const f=allFoods().find(x=>x.id===el.dataset.id);if(f)scAddFood(f,SC.meal||autoMeal());},
  scSearch(){closeScanner();logWithPicker(autoMeal());},
  scManualAdd(el){window._cfAfter=(f)=>scAddFood(f,SC.meal||autoMeal());addCustomFoodSheet({name:''});},
  /* account / misc */
  signIn(){if(window.signInWithGoogle)window.signInWithGoogle();else toast('Sign-in unavailable offline');},
  signOut(){if(window.signOutApp)window.signOutApp();closeAllSheets();},
  shareApp(){shareApp();},
  getApp(){openExternal(PLAY_URL);},
  consult(){openExternal('mailto:gaganrai5523@gmail.com?subject='+encodeURIComponent('Nutrition query — Calorie Tracker'));},
  feedback(){openExternal('mailto:gaganrai5523@gmail.com?subject='+encodeURIComponent('Calorie Tracker feedback'));},
  site(){openExternal('https://www.orthochronicles.info');},
  privacy(){openExternal('https://www.orthochronicles.info/privacy-policy.html');},
  resetData(){if(confirm('Delete ALL logs, plans and settings on this device? Cloud backup (if signed in) is kept.')){const keep=state.profile;localStorage.removeItem('ct_state');loadState();closeAllSheets();syncReminders();try{if(window.AndroidApp&&AndroidApp.cancelAll)AndroidApp.cancelAll();}catch(e){}go('home');openWizard();}},
  /* wizard */
  wzOpt(el){const s=WZ[wz.i];let v=el.dataset.v;if(s.k==='activity')v=parseFloat(v);wz.d[s.k]=v;renderWizard();},
  wzNext(){if(!wzCollect())return;if(wz.i>=WZ.length){wzFinish();return;}wz.i++;renderWizard();},
  wzBack(){wzCollect();if(wz.i>0)wz.i--;renderWizard();},
  wzSkip(){if(!state.profile.tdee){state.profile=calcProfile(wz.d);saveState();}$('wiz').classList.remove('on');go('home');}
};
const CHG={
  slotName(el){const s=state.plan.slots.find(x=>x.id===el.dataset.s);s.name=el.value.trim()||s.name;saveState();syncReminders();},
  slotTime(el){const s=state.plan.slots.find(x=>x.id===el.dataset.s);if(el.value){s.time=el.value;saveState();syncReminders();renderPlan();}},
  remEvery(el){state.rem.water.every=parseInt(el.value,10);saveState();syncReminders();},
  remFrom(el){if(el.value){state.rem.water.from=el.value;saveState();syncReminders();}},
  remTo(el){if(el.value){state.rem.water.to=el.value;saveState();syncReminders();}}
};
document.addEventListener('click',e=>{
  const el=e.target.closest&&e.target.closest('[data-act]');if(!el)return;
  const fn=ACT[el.dataset.act];if(fn){e.preventDefault();try{fn(el,e);}catch(err){console.error(err);}}
});
document.addEventListener('change',e=>{
  if(e.target.id==='scFileIn'){const f=e.target.files&&e.target.files[0];if(f)decodeImageFile(f);e.target.value='';return;}
  const el=e.target.closest&&e.target.closest('[data-chg]');if(el&&CHG[el.dataset.chg])CHG[el.dataset.chg](el,e);
});

/* ── share ── */
async function shareApp(){
  const s=streak();
  const text='🥗 I track my meals & water with this free Indian Calorie Tracker'+(s>1?' — '+s+'-day streak!':'!')+' Barcode scan, meal reminders & diet plans 👇';
  const url=IN_APP?PLAY_URL:SITE_URL;
  try{if(IN_APP&&AndroidApp.share){AndroidApp.share(text+' '+url);return;}}catch(e){}
  try{if(navigator.share){await navigator.share({title:'Calorie Tracker',text:text,url:url});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{await navigator.clipboard.writeText(text+' '+url);toast('Link copied — paste it to friends 📋');return;}catch(e){}
  openExternal('https://wa.me/?text='+encodeURIComponent(text+' '+url));
}

/* ── auth / cloud hooks used by the firebase module ── */
window.ctMerge=function(local,cloud){
  const lt=local._ts||0,ct=cloud._ts||0,out=Object.assign({},ct>lt?local:cloud,ct>lt?cloud:local);
  out.profile=(local.profile&&local.profile.tdee&&lt>=ct)?local.profile:(cloud.profile&&cloud.profile.tdee?cloud.profile:(local.profile||{}));
  const wm={};(local.weights||[]).concat(cloud.weights||[]).forEach(w=>{wm[w.date]=w;});out.weights=Object.values(wm).sort((a,b)=>a.date<b.date?-1:1);
  const act=l=>{let n=0;if(l){Object.values(l.meals||{}).forEach(m=>n+=m.length);n+=(l.wev||[]).length+(l.water||0);}return n;};
  out.log={};const keys=new Set(Object.keys(local.log||{}).concat(Object.keys(cloud.log||{})));
  keys.forEach(k=>{const a=(local.log||{})[k],b=(cloud.log||{})[k];out.log[k]=act(a)>=act(b)?(a||b):b;});
  out.adh={};const ak=new Set(Object.keys(local.adh||{}).concat(Object.keys(cloud.adh||{})));
  ak.forEach(k=>{const a=(local.adh||{})[k]||{},b=(cloud.adh||{})[k]||{},m=Object.assign({},b);Object.keys(a).forEach(s=>{if(!m[s]||(a[s].ts||0)>=(m[s].ts||0))m[s]=a[s];});out.adh[k]=m;});
  const cm={};(cloud.custom||[]).concat(local.custom||[]).forEach(c=>{cm[c.id]=c;});out.custom=Object.values(cm);
  out.plan=lt>=ct?(local.plan||cloud.plan):(cloud.plan||local.plan);out.rem=lt>=ct?(local.rem||cloud.rem):(cloud.rem||local.rem);
  out.name=local.name||cloud.name||'';out.diet=local.diet||cloud.diet;out.recent=local.recent||cloud.recent||[];
  return out;
};
window.ctReload=function(){loadState();renderAll();syncReminders();if($('wiz').classList.contains('on')&&state.profile.tdee){$('wiz').classList.remove('on');}};
window.ctOnUser=function(u){window.ctUser=u||null;if(curTab)renderAll();};
window.ctSync=function(msg){window.ctSyncMsg=msg;const e=$('syncTxt');if(e)e.textContent=msg;};

/* ── food id de-duplication (legacy data had a few repeated ids) ── */
function dedupeFoods(){const seen={};FOODS.forEach(f=>{if(seen[f.id]){f.id=f.id+'x'+seen[f.id];seen[f.id]++;}else seen[f.id]=1;});}

/* ── ask for notification permission once, after the user is set up (Android app) ── */
function maybeAskNotif(){
  if(!IN_APP||lsGet('ct_asked_notif'))return;
  lsSet('ct_asked_notif','1');
  setTimeout(()=>{try{if(!AndroidApp.notifEnabled())AndroidApp.requestNotifPermission();}catch(e){}},3500);
}

/* ── boot ── */
function applyUrlReply(){
  try{
    const q=new URLSearchParams(location.search),r=q.get('resp');
    if(r){const p=r.split(':');if(p[0]==='water')applyResponses([p[1]==='skip'?{t:'water',skip:1,ts:Date.now()}:{t:'water',ml:parseInt(p[1],10),ts:Date.now()}]);else if(p[0]==='meal')applyResponses([{t:'meal',slot:p[1],a:p[2],ts:Date.now()}]);
      history.replaceState(null,'',location.pathname);}
  }catch(e){}
}
function handleRoute(route){
  if(!route)return;
  if(route==='water')showReminder('water');
  else if(route.indexOf('meal:')===0){const id=route.slice(5),s=slotsFor(today()).find(x=>x.id===id);if(s)showReminder('meal',s);}
}
function boot(){
  loadState();dedupeFoods();selDate=today();
  // pick up a profile made in the old native onboarding
  if(!state.profile.tdee&&IN_APP&&AndroidApp.getProfile){try{const raw=AndroidApp.getProfile();if(raw){const p=JSON.parse(raw);if(p&&p.tdee){state.profile=p;saveState();}}}catch(e){}}
  document.querySelectorAll('#nav button[data-tab]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.tab)));
  $('navScan').addEventListener('click',()=>openScanner('barcode'));
  const first=!state.profile.tdee;
  go(lsGet('ct_tab')&&!first?(lsGet('ct_tab')==='plan'||lsGet('ct_tab')==='progress'||lsGet('ct_tab')==='diary'?lsGet('ct_tab'):'home'):'home');
  if(first)openWizard();else maybeAskNotif();
  const hh=(location.hash||"").slice(1);if(!first&&hh){if(["plan","progress","diary","home"].includes(hh))go(hh);else if(hh==="scan")setTimeout(()=>openScanner("barcode"),600);}
  applyUrlReply();drainNative();syncReminders();
  setInterval(webTick,30000);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)return;
    if(selDate<today()&&lsGet('ct_lastopen')!==today()){selDate=today();}
    lsSet('ct_lastopen',today());drainNative();renderAll();
  });
  window.addEventListener('focus',drainNative);
  lsSet('ct_lastopen',today());
  if(!IN_APP&&'serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){navigator.serviceWorker.register('/ct-sw.js',{scope:'/'}).catch(()=>{});
    navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.ctReply){applyResponses([e.data.ctReply]);}});}
  // reveal app, tell native we're ready (hides native splash)
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    $('boot').classList.add('off');
    try{if(IN_APP&&AndroidApp.ready)AndroidApp.ready();}catch(e){}
    try{if(IN_APP&&AndroidApp.getLaunchRoute)handleRoute(AndroidApp.getLaunchRoute());}catch(e){}
  }));
  // Food of the Day flash (once per day, from the bottom)
  if(!first&&once('fotdflash'))setTimeout(()=>{if(!sheets.length&&!$('scan').classList.contains('on'))fotdSheet();},1800);
}
window.ctOpenRoute=handleRoute;
document.addEventListener('DOMContentLoaded',boot);
