/* OrthoChronicles Calorie Tracker — meal schedule (1–10 slots), curated plans, reminders, notification replies */
let planTab='sched', planSel=today();
const RANGES=[[1,'1 Day'],[7,'1 Week'],[30,'1 Month'],[90,'3 Months']];

/* ── slot model ── */
function planActive(date){
  const p=state.plan; if(!p||!p.slots||!p.slots.length) return false;
  return date>=p.start&&date<addDays(p.start,p.range);
}
function slotsFor(date){
  const p=state.plan; if(!planActive(date)) return [];
  const ov=(p.ov&&p.ov[date])||{};
  return p.slots.slice().sort((a,b)=>tmin(a.time)-tmin(b.time)).map(s=>Object.assign({},s,{foods:ov[s.id]||s.foods||[]}));
}
function planEnd(){return state.plan?addDays(state.plan.start,state.plan.range-1):'';}
function slotKind(time){const m=tmin(time);return m<465?'early':m<630?'breakfast':m<750?'mid':m<900?'lunch':m<1080?'snack':m<1290?'dinner':'late';}
const KIND_NAME={early:'Early morning',breakfast:'Breakfast',mid:'Mid-morning',lunch:'Lunch',snack:'Evening snack',dinner:'Dinner',late:'Late snack'};
const KIND_EMO={early:'🌅',breakfast:'🍳',mid:'🍎',lunch:'🍱',snack:'🥜',dinner:'🌙',late:'🥛'};
function mealForTime(time){const m=tmin(time);return m<630?'breakfast':m<930?'lunch':m<1110?'snacks':'dinner';}
function hhmm(min){min=Math.max(0,Math.min(1439,min));return String(Math.floor(min/60)).padStart(2,'0')+':'+String(min%60).padStart(2,'0');}
function uid(){return 's'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
function defaultSlots(n){
  const presets={1:[['Main meal','13:00']],2:[['Lunch','13:00'],['Dinner','20:00']],
    3:[['Breakfast','08:00'],['Lunch','13:00'],['Dinner','20:00']],
    4:[['Breakfast','08:00'],['Lunch','13:00'],['Evening snack','17:00'],['Dinner','20:00']],
    7:[['Early morning','07:00'],['Breakfast','08:30'],['Mid-morning','11:00'],['Lunch','13:30'],['Evening snack','16:30'],['Dinner','19:30'],['Bedtime','21:30']],
    5:[['Breakfast','08:00'],['Mid-morning','11:00'],['Lunch','13:30'],['Evening snack','17:00'],['Dinner','20:00']],
    6:[['Early morning','07:00'],['Breakfast','08:30'],['Mid-morning','11:00'],['Lunch','13:30'],['Evening snack','16:30'],['Dinner','19:30']]};
  let arr=presets[n];
  if(!arr){
    arr=[];if(n===1)arr=[['Meal 1','13:00']];
    else for(let i=0;i<n;i++){const t=450+Math.round(i*(1290-450)/(n-1)/15)*15;arr.push([KIND_NAME[slotKind(hhmm(t))],hhmm(t)]);}
    const seen={};arr=arr.map(a=>{seen[a[0]]=(seen[a[0]]||0)+1;return[seen[a[0]]>1?a[0]+' '+seen[a[0]]:a[0],a[1]];});
  }
  return arr.map(a=>({id:uid(),name:a[0],time:a[1],on:true,foods:[]}));
}
function ensurePlan(){if(!state.plan)state.plan={range:7,start:today(),slots:[],ov:{}};if(!state.plan.ov)state.plan.ov={};return state.plan;}
function createPlan(n){
  const p=ensurePlan();p.slots=defaultSlots(n);p.start=today();saveState();syncReminders();renderPlan();toast('Schedule created — add foods to each slot');
}
function setSlotCount(n){
  const p=ensurePlan();n=Math.max(1,Math.min(10,n));
  if(n>p.slots.length){
    const sorted=p.slots.slice().sort((a,b)=>tmin(a.time)-tmin(b.time));
    let last=sorted.length?tmin(sorted[sorted.length-1].time):420;
    while(p.slots.length<n){last=Math.min(1380,last+90);p.slots.push({id:uid(),name:'Meal '+(p.slots.length+1),time:hhmm(last),on:true,foods:[]});}
  } else p.slots=p.slots.sort((a,b)=>tmin(a.time)-tmin(b.time)).slice(0,n);
  saveState();syncReminders();renderPlan();
}

/* ── smart fill (curated Indian foods by slot, goal and diet) ── */
const SMART={
  early:{all:[['te04',200],['sn02',15],['sn03',8]]},
  breakfast:{lose_veg:[['gr06',200],['fr03',150],['te04',200]],lose_nonveg:[['pr06',100],['gr10',60],['te04',200]],gain_veg:[['sn17',150],['da02',150],['da01',250]],gain_nonveg:[['pr09',200],['fr01',120],['da01',250]],maintain_veg:[['sn04',120],['sn05',150],['fr01',100]],maintain_nonveg:[['pr08',110],['gr10',60],['fr03',150]]},
  mid:{lose:[['fr05',100]],maintain:[['fr07',130]],gain:[['sn02',30],['fr01',100]]},
  lunch:{lose_veg:[['gr01',80],['dl01',150],['vs01',100],['da08',200]],lose_nonveg:[['gr04',120],['pr10',120],['vs01',100]],gain_veg:[['gr03',200],['gr01',80],['dl05',150],['da02',150]],gain_nonveg:[['gr03',200],['pr10',200],['gr01',40],['da02',100]],maintain_veg:[['gr01',80],['dl04',150],['vg05',100],['da02',100]],maintain_nonveg:[['gr03',150],['pr10',150],['vs01',100]]},
  snack:{lose:[['dl07',60],['te04',200]],maintain:[['sn01',25],['te02',150]],gain:[['sn01',30],['fr01',120],['da07',200]]},
  dinner:{lose_veg:[['gr01',80],['vg01',100],['dl02',150]],lose_nonveg:[['pr01',120],['vs01',100],['gr01',40]],gain_veg:[['gr01',120],['da03',80],['dl04',150],['da01',250]],gain_nonveg:[['gr01',120],['pr01',150],['dl02',100],['da01',200]],maintain_veg:[['gr01',80],['vg12',120],['dl02',150]],maintain_nonveg:[['gr01',80],['pr23',150],['vs01',100]]},
  late:{all:[['da01',200]]}
};
function smartFoodsFor(kind,goal,diet){
  const k=SMART[kind]||SMART.snack;
  const g=goal||'maintain';
  const ids=k[g+'_'+diet]||k[g]||k.all||k[g+'_veg']||k.lose||[];
  return ids.map(x=>{const f=allFoods().find(y=>y.id===x[0]);return f?foodItem(f,x[1]):null;}).filter(Boolean);
}
function smartFill(diet){
  const p=ensurePlan();state.diet=diet;const goal=(state.profile&&state.profile.goal)||'maintain';
  p.slots.forEach(s=>{s.foods=smartFoodsFor(slotKind(s.time),goal,diet);});
  saveState();syncReminders();renderPlan();toast('✨ Smart plan filled — tweak anything you like');
}

/* ── curated text plans → slots ── */
function usePlanAsSchedule(goal,diet){
  const pl=(PLANS[goal]||{})[diet];if(!pl)return;
  const p=ensurePlan();
  p.slots=pl.meals.map(m=>{
    const parts=m.time.split('·');let t=(parts[0]||'').trim(),nm=(parts[1]||'Meal').trim();
    const mt=t.match(/(\d+):(\d+)\s*(AM|PM)/i);let H=mt?parseInt(mt[1],10)%12:8,M=mt?parseInt(mt[2],10):0;if(mt&&/PM/i.test(mt[3]))H+=12;
    const n=m.foods.length||1;
    return{id:uid(),name:nm,time:hhmm(H*60+M),on:true,foods:m.foods.map(f=>({id:null,name:f,qty:null,cal:Math.round(m.cal/n),prot:r1(pl.prot*(m.cal/pl.kcal)/n),carb:r1(pl.carb*(m.cal/pl.kcal)/n),fat:r1(pl.fat*(m.cal/pl.kcal)/n),fiber:1}))};
  }).slice(0,10);
  p.start=today();p.ov={};saveState();syncReminders();planTab='sched';renderPlan();toast('✅ "'+pl.title+'" loaded into your schedule');confetti(60);
}

/* ── slot responses (ate / later / skip) ── */
function markSlot(date,slotId,action,ts,silent){
  const a=(state.adh[date]=state.adh[date]||{}),prev=a[slotId]||{};
  a[slotId]={s:action,ts:ts||Date.now(),logged:!!prev.logged};
  const s=slotsFor(date).find(x=>x.id===slotId);
  if(action==='ate'&&!a[slotId].logged&&s){
    const meal=mealForTime(s.time);(s.foods||[]).forEach(f=>addFoodToLog(Object.assign({},f,{slot:slotId,t:ts||Date.now()}),meal,date));
    a[slotId].logged=true;
  } else if(action!=='ate'&&prev.logged){
    const l=dayLog(date);if(l)Object.keys(l.meals).forEach(m=>{l.meals[m]=l.meals[m].filter(i=>i.slot!==slotId);});
    a[slotId].logged=false;
  }
  saveState();
  if(!silent){
    const nm=s?s.name:'Meal';
    if(action==='ate'){buzz(20);toast('✅ '+nm+' logged'+(s&&slotKcal(s)?' · +'+slotKcal(s)+' kcal':''));if(once('slotconf'))confetti(50);}
    else if(action==='later')toast('⏳ Noted — we\'ll remind you again');
    else toast('⏭ '+nm+' skipped');
    renderAll();
  }
}
function slotStatus(date,id){const a=state.adh[date];return a&&a[id]?a[id].s:'';}

/* ── native / web responses ── */
function applyResponses(list){
  if(!list||!list.length)return false;let ch=false;
  list.forEach(r=>{
    try{
      const d=r.d||ds(new Date(r.ts||Date.now()));
      if(r.t==='water'){
        if(r.skip){dayLog(d,true).wev.push({skip:1,ts:r.ts||Date.now()});}
        else addWater(r.ml,d,true,r.ts);
        ch=true;
      } else if(r.t==='meal'){markSlot(d,r.slot,r.a,r.ts,true);ch=true;}
    }catch(e){}
  });
  if(ch){saveState();renderAll();}
  return ch;
}
function drainNative(){
  if(!window.AndroidApp||!AndroidApp.drainResponses)return;
  try{const raw=AndroidApp.drainResponses();if(raw&&raw!=='[]'){const l=JSON.parse(raw);if(applyResponses(l))toast('✓ Synced '+l.length+' reminder repl'+(l.length>1?'ies':'y'));}}catch(e){}
}

/* ── reminders schedule → native or web ── */
function buildSchedule(){
  const p=state.plan,rem=state.rem;
  const meals=(p&&rem.meals?p.slots.filter(s=>s.on):[]).map(s=>({id:s.id,name:s.name,time:s.time,body:(s.foods||[]).map(f=>f.name).slice(0,4).join(', ')||'Time for your meal',kcal:slotKcal(s)}));
  return{water:{on:!!rem.water.on,every:rem.water.every,from:rem.water.from,to:rem.water.to,amts:rem.water.amts},meals:meals,
    start:p?p.start:today(),end:p?planEnd():addDays(today(),90)};
}
function syncReminders(){
  try{
    if(window.AndroidApp&&AndroidApp.setSchedule){AndroidApp.setSchedule(JSON.stringify(buildSchedule()));}
  }catch(e){}
}
function notifStatus(){
  if(window.AndroidApp&&AndroidApp.notifEnabled){try{return AndroidApp.notifEnabled()?'granted':'denied';}catch(e){}}
  return typeof Notification!=='undefined'?Notification.permission:'unsupported';
}
async function enableNotifications(){
  if(window.AndroidApp&&AndroidApp.requestNotifPermission){AndroidApp.requestNotifPermission();setTimeout(()=>{renderPlan();syncReminders();},1500);return;}
  if(typeof Notification==='undefined'){toast('Notifications are not supported in this browser');return;}
  const r=await Notification.requestPermission();toast(r==='granted'?'🔔 Notifications enabled':'Notifications blocked — enable in browser settings');renderPlan();
}
function testReminder(){
  if(window.AndroidApp&&AndroidApp.testNotification){AndroidApp.testNotification();toast('Test reminder sent — check your notification shade');return;}
  showReminder('water');
}

/* ── web fallback reminder engine (runs while the page is open) ── */
function showReminder(kind,slot,date){
  date=date||today();
  if(kind==='water'){
    const t=totals(date),g=targets();
    openSheet('<div class="sb remind"><div class="re">💧</div><h2 style="margin:6px 0 2px">Time to hydrate!</h2><div class="sub">'+t.ml+' of '+g.water+' ml today</div><div class="wopts">'+
      (state.rem.water.amts||[50,100,200,300]).map(a=>'<button data-act="remWater" data-ml="'+a+'">'+a+' ml</button>').join('')+'<button class="skip" data-act="remWater" data-ml="0">Skip</button></div></div>');
  } else if(slot){
    openSheet('<div class="sb remind"><div class="re">'+(KIND_EMO[slotKind(slot.time)]||'🍽️')+'</div><h2 style="margin:6px 0 2px">'+esc(slot.name)+' · '+fmtTime(slot.time)+'</h2><div class="sub">'+esc((slot.foods||[]).map(f=>f.name).join(', ')||'Time for your meal')+'</div>'+
      '<div class="acts" style="margin-top:16px"><button class="act ate" data-act="slot" data-s="'+slot.id+'" data-a="ate" data-close="1">✅ I ate it</button><button class="act later" data-act="slot" data-s="'+slot.id+'" data-a="later" data-close="1">⏳ Will eat</button><button class="act skip" data-act="slot" data-s="'+slot.id+'" data-a="skip" data-close="1">⏭ Skip</button></div></div>');
  }
  buzz([60,60,60]);
  if(typeof Notification!=='undefined'&&Notification.permission==='granted'&&document.hidden){
    const title=kind==='water'?'💧 Time to drink water':'🍽 '+slot.name+' time';
    const body=kind==='water'?'Tap to log how much you drank':(slot.foods||[]).map(f=>f.name).join(', ');
    navigator.serviceWorker&&navigator.serviceWorker.ready.then(reg=>reg.showNotification(title,{body:body,icon:'/assets/ct-icon-192.png',badge:'/assets/ct-icon-192.png',tag:kind+(slot?slot.id:''),
      actions:kind==='water'?[{action:'w100',title:'100 ml'},{action:'w200',title:'200 ml'},{action:'wskip',title:'Skip'}]:[{action:'ate:'+slot.id,title:'✅ Ate'},{action:'later:'+slot.id,title:'⏳ Later'},{action:'skip:'+slot.id,title:'⏭ Skip'}],
      data:{date:date,slot:slot?slot.id:null}})).catch(()=>{});
  }
}
function webTick(){
  if(IN_APP||!state.rem)return;
  const d=today(),nm=nowMin(),rem=state.rem;
  if(rem.meals){
    slotsFor(d).forEach(s=>{
      if(!s.on)return;const k='ct_fired_'+d+'_'+s.id;
      if(!lsGet(k)&&nm>=tmin(s.time)&&nm<tmin(s.time)+30&&!slotStatus(d,s.id)){lsSet(k,'1');showReminder('meal',s,d);}
    });
  }
  const w=rem.water;
  if(w&&w.on&&nm>=tmin(w.from)&&nm<=tmin(w.to)){
    const last=+lsGet('ct_wlast')||0;
    if(Date.now()-last>=w.every*60000){lsSet('ct_wlast',String(Date.now()));if(last)showReminder('water');}
  }
}

/* ── RENDER: plan tab ── */
function renderPlan(){
  const tabs=[['sched','🗓 Schedule'],['cur','🥗 Curated'],['rem','⏰ Reminders']];
  let h='<div class="hdr" style="padding-bottom:50px"><div class="hdr-top"><div class="hello"><small>Plan your day</small><b>Meals & Reminders</b></div><button class="avatar" data-act="more" aria-label="Menu">'+avatarHTML()+'</button></div></div>'+
    '<div class="rng" style="margin-top:-24px">'+tabs.map(t=>'<button class="'+(planTab===t[0]?'on':'')+'" data-act="planTab" data-v="'+t[0]+'">'+t[1]+'</button>').join('')+'</div><div class="pad">';
  h+=planTab==='sched'?planSchedHTML():planTab==='cur'?planCuratedHTML():planRemindHTML();
  $('v-plan').innerHTML=h+'</div>';
}
function planSchedHTML(){
  const p=state.plan;let h='';
  if(!p||!p.slots.length){
    return '<div class="card" style="text-align:center"><div style="font-size:3rem">🗓️</div><h3 style="justify-content:center">Create your meal schedule</h3><p class="sub" style="margin-bottom:14px">Choose how many meals you eat per day. You\'ll set the timing, add curated foods to each slot and get reminders with one-tap Ate / Later / Skip replies.</p>'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px"><button class="btn sec" data-act="createPlan" data-n="3">3 meals</button><button class="btn sec" data-act="createPlan" data-n="5">5 meals</button><button class="btn sec" data-act="createPlan" data-n="6">6 meals</button></div>'+
      '<div class="sub" style="margin:12px 0 6px">or pick any number 1–10</div><div class="stp" style="justify-content:center"><button data-act="createPlanN" data-d="-1">−</button><b id="cpn">4</b><button data-act="createPlanN" data-d="1">＋</button></div><button class="btn" style="margin-top:14px" data-act="createPlan" data-n="0">Create schedule</button></div>';
  }
  const endTxt=parseD(planEnd()).toLocaleDateString(undefined,{day:'numeric',month:'short'}),left=Math.max(0,Math.round((parseD(planEnd())-parseD(today()))/864e5)+1);
  h+='<div class="card"><h3>⏳ Plan duration</h3><div class="seg">'+RANGES.map(r=>'<button class="'+(p.range===r[0]?'on':'')+'" data-act="planRange" data-v="'+r[0]+'">'+r[1]+'</button>').join('')+'</div>'+
     '<div class="sub" style="margin-top:10px">Runs <b>'+parseD(p.start).toLocaleDateString(undefined,{day:'numeric',month:'short'})+' → '+endTxt+'</b> · '+(planEnd()<today()?'<span style="color:#DC2626;font-weight:700">expired — pick a duration to restart</span>':left+' day'+(left>1?'s':'')+' left')+'</div></div>';
  h+='<div class="card"><h3>🍽️ Meals per day <span class="more" style="color:var(--mut)">1 – 10</span></h3><div style="display:flex;align-items:center;justify-content:space-between"><div class="stp"><button data-act="slotCount" data-d="-1">−</button><b>'+p.slots.length+'</b><button data-act="slotCount" data-d="1">＋</button></div>'+
     '<div style="display:flex;gap:7px"><button class="btn sm" data-act="smart">✨ Smart fill</button></div></div></div>';
  p.slots.slice().sort((a,b)=>tmin(a.time)-tmin(b.time)).forEach((s,ix)=>{
    const kc=slotKcal(s);
    h+='<div class="slot'+(s.on?'':' off')+'"><div class="sr"><div class="sn">'+(ix+1)+'</div><input class="si" value="'+esc(s.name)+'" data-chg="slotName" data-s="'+s.id+'" maxlength="24"><input class="st" type="time" value="'+s.time+'" data-chg="slotTime" data-s="'+s.id+'"><button class="tg'+(s.on?' on':'')+'" data-act="slotToggle" data-s="'+s.id+'" aria-label="Reminder"></button></div>'+
       '<div class="fchips">'+(s.foods||[]).map((f,i)=>'<span class="fc">'+esc(f.name.replace(/\s*\(.*?\)/g,''))+(f.qty?' · '+Math.round(f.qty)+'g':'')+'<u data-act="slotFoodDel" data-s="'+s.id+'" data-i="'+i+'">✕</u></span>').join('')+'<span class="fc add" data-act="slotAdd" data-s="'+s.id+'">＋ Add food</span></div>'+
       '<div class="sub" style="margin-top:8px">'+(kc?'🔥 ~'+kc+' kcal':'No foods yet')+' · 🔔 '+(s.on?'reminder on':'reminder off')+'</div></div>';
  });
  // calendar
  const tot=planTotalKcal();const g=targets();
  h+='<div class="card"><h3>📆 Your '+(p.range===1?'day':p.range===7?'week':p.range===30?'month':'3 months')+' <span class="more num" style="color:var(--ink)">'+tot+' / '+g.cal+' kcal planned</span></h3>'+calendarHTML(p)+
     '<div class="legend"><span><i style="background:#34D399"></i>All done</span><span><i style="background:#FBBF24"></i>Partly</span><span><i style="background:#E7F5F1"></i>Planned</span></div></div>';
  h+='<div class="card"><h3>🕒 '+(planSel===today()?'Today':parseD(planSel).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'}))+' <span class="more" data-act="customizeDay">✏️ Customize day</span></h3>'+timelineHTML(planSel)+'</div>';
  h+='<button class="btn red" style="margin-top:4px" data-act="clearPlan">🗑 Delete schedule & reminders</button>';
  return h;
}
function planTotalKcal(){const p=state.plan;return p?p.slots.reduce((a,s)=>a+slotKcal(s),0):0;}
function timelineHTML(date){
  const sl=slotsFor(date);if(!sl.length)return '<div class="empty"><i>🌙</i>No meals planned for this day.</div>';
  const nm=nowMin(),t=today();
  return '<div class="tl">'+sl.map(s=>{
    const st=slotStatus(date,s.id),past=date<t||(date===t&&tmin(s.time)<=nm);
    const badge=st==='ate'?'<span class="badge ate">✅ Ate</span>':st==='later'?'<span class="badge later">⏳ Will eat</span>':st==='skip'?'<span class="badge skip">⏭ Skipped</span>':past?'<span class="badge later">Pending</span>':'<span class="badge up">Upcoming</span>';
    return '<div class="ti '+st+'"><div class="tt"><span>'+(KIND_EMO[slotKind(s.time)]||'🍽️')+' '+esc(s.name)+' · '+fmtTime(s.time)+'</span>'+badge+'</div><div class="tf">'+esc((s.foods||[]).map(f=>f.name).join(', ')||'No foods added')+(slotKcal(s)?' · ~'+slotKcal(s)+' kcal':'')+'</div>'+
      (date<=t&&s.on?'<div class="acts" style="margin-top:8px"><button class="act ate" style="padding:7px" data-act="slotD" data-d="'+date+'" data-s="'+s.id+'" data-a="ate">✅</button><button class="act later" style="padding:7px" data-act="slotD" data-d="'+date+'" data-s="'+s.id+'" data-a="later">⏳</button><button class="act skip" style="padding:7px" data-act="slotD" data-d="'+date+'" data-s="'+s.id+'" data-a="skip">⏭</button></div>':'')+'</div>';
  }).join('')+'</div>';
}
function dayState(date){
  const sl=slotsFor(date).filter(s=>s.on);if(!sl.length)return{n:0,done:0};
  let done=0;sl.forEach(s=>{if(slotStatus(date,s.id)==='ate')done++;});
  return{n:sl.length,done:done};
}
function calendarHTML(p){
  const t=today();let h='';
  const first=parseD(p.start);let cur=new Date(first.getFullYear(),first.getMonth(),1);const endD=parseD(planEnd());
  const names=['M','T','W','T','F','S','S'];
  while(cur<=endD){
    const y=cur.getFullYear(),m=cur.getMonth(),dim=new Date(y,m+1,0).getDate(),lead=(new Date(y,m,1).getDay()+6)%7;
    h+='<div class="mon">'+cur.toLocaleDateString(undefined,{month:'long',year:'numeric'})+'</div><div class="cal">'+names.map(n=>'<div class="ch">'+n+'</div>').join('');
    for(let i=0;i<lead;i++)h+='<div class="cd out"></div>';
    for(let d=1;d<=dim;d++){
      const key=ds(new Date(y,m,d)),inP=planActive(key);
      if(!inP){h+='<div class="cd out">'+d+'</div>';continue;}
      const s=dayState(key);let cls='cd in';if(s.n&&s.done===s.n)cls+=' full';else if(s.done>0)cls+=' part';if(key===t)cls+=' today';if(key===planSel)cls+=' today';
      h+='<button class="'+cls+'" data-act="planSel" data-d="'+key+'">'+d+(s.n&&(key<=t)?'<span class="pip">'+s.done+'/'+s.n+'</span>':'')+'</button>';
    }
    h+='</div>';cur=new Date(y,m+1,1);
  }
  return h;
}
function planCuratedHTML(){
  const goal=(state.profile&&state.profile.goal)||'lose',diet=state.diet||'veg';
  const g=window._cpGoal||goal,dt=window._cpDiet||diet;
  const pl=(PLANS[g]||{})[dt];
  let h='<div class="card"><h3>🎯 Goal</h3><div class="seg">'+[['lose','Weight loss'],['maintain','Maintain'],['gain','Muscle gain']].map(x=>'<button class="'+(g===x[0]?'on':'')+'" data-act="cpGoal" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'+
    '<h3 style="margin-top:14px">🥘 Diet</h3><div class="seg">'+[['veg','🥦 Veg'],['nonveg','🍗 Non-veg'],['vegan','🌱 Vegan']].map(x=>'<button class="'+(dt===x[0]?'on':'')+'" data-act="cpDiet" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>';
  if(!pl)return h+'<div class="empty"><i>🍽️</i>Plan coming soon for this combination.</div>';
  const grads=['#F59E0B,#F97316','#10B981,#0D9488','#6366F1,#8B5CF6','#0EA5E9,#2563EB','#F43F5E,#F97316','#EC4899,#8B5CF6'];
  h+='<div class="planc"><div class="ph" style="background:linear-gradient(135deg,'+grads[(g==='lose'?0:g==='gain'?2:1)]+')"><span class="pe">'+(g==='lose'?'🥗':g==='gain'?'💪':'⚖️')+'</span><h3 style="color:#fff;margin:0">'+esc(pl.title)+'</h3><div style="opacity:.9;font-size:.82rem">~'+pl.kcal+' kcal / day</div><div class="pm"><div><b>'+pl.prot+'g</b>Protein</div><div><b>'+pl.carb+'g</b>Carbs</div><div><b>'+pl.fat+'g</b>Fat</div></div></div><div class="pb">'+
    pl.meals.map((m,i)=>'<div class="meal" style="margin-bottom:8px"><div class="ic" style="background:linear-gradient(135deg,'+grads[i%grads.length]+');color:#fff">'+(m.pic||'🍽️')+'</div><div class="mi"><b>'+esc(m.time)+'</b><span style="white-space:normal">'+esc(m.foods.join(' · '))+'</span></div><div class="mk num">'+m.cal+'<small>kcal</small></div></div>').join('')+
    '<button class="btn" style="margin-top:8px" data-act="usePlan" data-g="'+g+'" data-d="'+dt+'">✅ Use this plan as my schedule</button></div></div>';
  return h;
}
function planRemindHTML(){
  const w=state.rem.water,st=notifStatus();
  let h='<div class="card" style="'+(st==='granted'?'':'background:#FFF7ED;border:1px solid #FED7AA')+'"><h3>🔔 Notifications</h3><div class="sub" style="margin-bottom:10px">'+
    (st==='granted'?'✅ Enabled'+(IN_APP?' — reminders arrive even when the app is closed, with one-tap reply buttons.':' — keep this page open or install the app for background reminders.'):
     st==='unsupported'?'Notifications aren\'t supported on this browser.':'Allow notifications so reminders can reach you with Ate / Later / Skip and water reply buttons.')+'</div>'+
    (st==='granted'?'<button class="btn sec sm" data-act="testRem">📨 Send test reminder</button>':'<button class="btn" data-act="enableNotif">Enable notifications</button>')+
    (IN_APP&&AndroidApp.openAlarmSettings&&!(AndroidApp.exactAllowed&&AndroidApp.exactAllowed())?'<div style="margin-top:10px"><button class="btn ghost sm" data-act="alarmSettings">⏱ Allow exact alarms (recommended)</button></div>':'')+'</div>';
  h+='<div class="card"><h3>💧 Water reminders <button class="tg'+(w.on?' on':'')+'" style="margin-left:auto" data-act="remWaterToggle" aria-label="Water reminders"></button></h3>'+
    '<div style="'+(w.on?'':'opacity:.45;pointer-events:none')+'"><label class="lbl">Remind me every</label><select class="inp" data-chg="remEvery">'+[30,45,60,90,120,150,180].map(m=>'<option value="'+m+'"'+(w.every===m?' selected':'')+'>'+(m<60?m+' minutes':m%60===0?(m/60)+' hour'+(m>60?'s':''):(Math.floor(m/60))+'h '+(m%60)+'m')+'</option>').join('')+'</select>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div><label class="lbl">From</label><input class="inp" type="time" value="'+w.from+'" data-chg="remFrom"></div><div><label class="lbl">Until</label><input class="inp" type="time" value="'+w.to+'" data-chg="remTo"></div></div>'+
    '<div class="sub" style="margin-top:10px">Each reminder offers quick replies: <b>50 · 100 · 200 · 300 ml</b> or <b>Skip</b>. Everything is saved to your diary'+(window.ctUser?' and synced to '+esc(window.ctUser.email||'your Google account'):' (sign in with Google to sync)')+'.</div></div></div>';
  h+='<div class="card"><h3>🍽️ Meal reminders <button class="tg'+(state.rem.meals?' on':'')+'" style="margin-left:auto" data-act="remMealToggle" aria-label="Meal reminders"></button></h3><div class="sub">'+
    (state.plan&&state.plan.slots.length?state.plan.slots.filter(s=>s.on).length+' reminders scheduled from your plan: '+state.plan.slots.slice().sort((a,b)=>tmin(a.time)-tmin(b.time)).filter(s=>s.on).map(s=>fmtTime(s.time)).join(' · '):'Create a schedule first (Schedule tab). Each reminder shows your planned foods with <b>Ate · Will eat · Skip</b> buttons.')+'</div></div>';
  return h;
}

/* customize a single day */
function customizeDay(){
  const date=planSel,sl=slotsFor(date);if(!sl.length){toast('No meals planned for this day');return;}
  let h=sheetHead('✏️ '+parseD(date).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'}))+'<div class="sb"><div class="sub" style="margin-bottom:8px">Changes apply only to this date. Other days keep your default slot foods.</div>';
  sl.forEach(s=>{h+='<div class="slot"><div class="tt" style="display:flex;justify-content:space-between;font-weight:700">'+esc(s.name)+' <span class="sub">'+fmtTime(s.time)+'</span></div><div class="fchips">'+(s.foods||[]).map((f,i)=>'<span class="fc">'+esc(f.name.replace(/\s*\(.*?\)/g,''))+'<u data-act="dayFoodDel" data-s="'+s.id+'" data-i="'+i+'">✕</u></span>').join('')+'<span class="fc add" data-act="dayFoodAdd" data-s="'+s.id+'">＋ Add</span></div></div>';});
  h+='<button class="btn sec" style="margin-top:6px" data-act="dayReset">↺ Reset this day to default</button></div>';
  closeSheet();openSheet(h,{});
}
function dayFoods(date,slotId){
  const p=state.plan;p.ov=p.ov||{};p.ov[date]=p.ov[date]||{};
  if(!p.ov[date][slotId]){const base=p.slots.find(s=>s.id===slotId);p.ov[date][slotId]=(base.foods||[]).slice();}
  return p.ov[date][slotId];
}
