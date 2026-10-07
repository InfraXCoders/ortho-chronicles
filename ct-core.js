/* OrthoChronicles Calorie Tracker — core: state, dashboard, diary, food picker, water */
const $=(id)=>document.getElementById(id);
const MEALS=[
  {id:'breakfast',n:'Breakfast',e:'🍳',bg:'#FEF3C7'},
  {id:'lunch',n:'Lunch',e:'🍱',bg:'#DCFCE7'},
  {id:'snacks',n:'Snacks',e:'🥪',bg:'#EDE9FE'},
  {id:'dinner',n:'Dinner',e:'🌙',bg:'#DBEAFE'}
];
const CAT_EMOJI={fruit:'🍎',vegetable:'🥦',salad:'🥗',grain:'🌾',legume:'🫘',dairy:'🥛',protein:'🍗',snack:'🍛',italian:'🍕',beverage:'☕',supplement:'💪',softdrink:'🥤',alcohol:'🍺',custom:'⭐'};
const GLASS_ML=300;
const IN_APP=!!window.AndroidApp;
let state={}, selDate='', curTab='home';

/* ── date helpers (LOCAL dates — never UTC) ── */
function ds(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function parseD(s){const a=s.split('-').map(Number);return new Date(a[0],a[1]-1,a[2]);}
function addDays(s,n){const d=parseD(s);d.setDate(d.getDate()+n);return ds(d);}
function today(){return ds();}
function fmtTime(hhmm){const a=hhmm.split(':').map(Number);const h=a[0]%12||12;return h+':'+String(a[1]).padStart(2,'0')+' '+(a[0]<12?'AM':'PM');}
function nowMin(){const d=new Date();return d.getHours()*60+d.getMinutes();}
function tmin(hhmm){const a=hhmm.split(':').map(Number);return a[0]*60+a[1];}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function r1(v){return Math.round(v*10)/10;}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}

/* ── state ── */
function defaultRem(){return{water:{on:true,every:90,from:'07:00',to:'22:00',amts:[50,100,200,300]},meals:true};}
function loadState(){
  try{state=JSON.parse(localStorage.getItem('ct_state'))||{};}catch(e){state={};}
  state.log=state.log||{}; state.profile=state.profile||{}; state.weights=state.weights||[];
  state.plan=state.plan||null; state.adh=state.adh||{}; state.rem=state.rem||defaultRem();
  state.custom=state.custom||[]; state.recent=state.recent||[]; state.name=state.name||'';
  if(!state.rem.water) state.rem.water=defaultRem().water;
}
function saveState(){
  state._ts=Date.now();
  lsSet('ct_state',JSON.stringify(state));
  if(window._saveToFirestore) window._saveToFirestore();
}
function dayLog(date,create){
  let l=state.log[date];
  if(!l){ if(!create) return null; l=state.log[date]={meals:{},water:0,waterMl:0,wev:[]}; }
  if(!l.meals) l.meals={};
  if(l.waterMl==null) l.waterMl=(l.water||0)*GLASS_ML;
  if(!l.wev) l.wev=[];
  return l;
}
function totals(date){
  const t={cal:0,prot:0,carb:0,fat:0,fiber:0,ml:0,items:0};
  const l=state.log[date]; if(!l) return t;
  Object.values(l.meals||{}).forEach(m=>m.forEach(i=>{t.cal+=i.cal||0;t.prot+=i.prot||0;t.carb+=i.carb||0;t.fat+=i.fat||0;t.fiber+=i.fiber||0;t.items++;}));
  t.ml=l.waterMl!=null?l.waterMl:(l.water||0)*GLASS_ML;
  return t;
}
function targets(){
  const p=state.profile||{};
  return{cal:p.tdee||2000,prot:p.prot||Math.round((p.tdee||2000)*.2/4),carb:p.carb||Math.round((p.tdee||2000)*.5/4),fat:p.fat||Math.round((p.tdee||2000)*.3/9),water:p.water||2400,has:!!p.tdee};
}
function streak(){
  let s=0,d=today();
  if(!totals(d).items) d=addDays(d,-1);
  while(totals(d).items){s++;d=addDays(d,-1);}
  return s;
}
function calcProfile(i){
  const bmr=i.gender==='f'?(10*i.weight)+(6.25*i.height)-(5*i.age)-161:(10*i.weight)+(6.25*i.height)-(5*i.age)+5;
  const tdee=Math.round(bmr*i.activity);
  const target=i.goal==='lose'?tdee-500:i.goal==='gain'?tdee+300:tdee;
  const prot=Math.round(i.weight*(i.goal==='gain'?2:1.8));
  const fat=Math.round(target*0.25/9);
  const carb=Math.max(50,Math.round((target-prot*4-fat*9)/4));
  const water=Math.round(i.weight*35/50)*50;
  return{tdee:target,maint:tdee,prot,carb,fat,water,weight:i.weight,goal:i.goal,age:i.age,height:i.height,gender:i.gender,activity:i.activity,bmr:Math.round(bmr)};
}

/* ── UI helpers ── */
let _tt;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('on'),2600);}
function buzz(p){try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}}
let _cp=[],_raf=0;
function confetti(n){
  const c=$('confetti');if(!c||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;c.width=w*dpr;c.height=h*dpr;
  const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);
  const cols=['#10B981','#34D399','#FBBF24','#F472B6','#60A5FA','#FB923C','#A78BFA'];
  for(let i=0;i<(n||90);i++)_cp.push({x:w/2+(Math.random()-.5)*w*.4,y:h*.5,vx:(Math.random()-.5)*12,vy:-7-Math.random()*9,r:3+Math.random()*4,c:cols[i%cols.length],rot:Math.random()*6,vr:(Math.random()-.5)*.4,l:100+Math.random()*50});
  if(_raf)return;
  (function step(){
    x.clearRect(0,0,w,h);_cp=_cp.filter(p=>p.l>0&&p.y<h+20);
    _cp.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.3;p.vx*=.99;p.rot+=p.vr;p.l--;x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.globalAlpha=Math.min(1,p.l/30);x.fillStyle=p.c;x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore();});
    if(_cp.length)_raf=requestAnimationFrame(step);else{_raf=0;x.clearRect(0,0,w,h);}
  })();
}
function once(k){const key='ct_once_'+k+'_'+today();if(lsGet(key))return false;lsSet(key,'1');return true;}

/* ── sheets (stackable) ── */
const sheets=[];
function openSheet(html,opts){
  opts=opts||{};
  const ov=document.createElement('div');ov.className='ov on'+(opts.full?' full':'');
  ov.innerHTML='<div class="sheet"><div class="grab"></div>'+html+'</div>';
  ov.addEventListener('click',e=>{if(e.target===ov&&!opts.lock)closeSheet();});
  $('ovHost').appendChild(ov);sheets.push(ov);
  return ov;
}
function closeSheet(){const ov=sheets.pop();if(ov)ov.remove();}
function closeAllSheets(){while(sheets.length)closeSheet();}
function sheetHead(title){return '<div class="sh"><h2>'+title+'</h2><button class="xclose" data-act="closeSheet">✕</button></div>';}

/* ── navigation ── */
function go(tab){
  curTab=tab;document.body.dataset.tab=tab;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+tab));
  document.querySelectorAll('#nav button[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  renderTab(tab);
  window.scrollTo(0,0);
  lsSet('ct_tab',tab);
}
function renderTab(tab){
  if(tab==='home')renderHome();
  else if(tab==='diary')renderDiary();
  else if(tab==='plan')renderPlan();
  else if(tab==='progress')renderProgress();
}
function renderAll(){renderTab(curTab);}

/* ── header (greeting + week strip) ── */
function greet(){const h=new Date().getHours();return h<5?'Late night':h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Good night';}
function userName(){return (state.name||(window.ctUser&&window.ctUser.displayName)||'').split(' ')[0];}
function avatarHTML(){
  const u=window.ctUser;
  if(u&&u.photoURL) return '<img src="'+esc(u.photoURL)+'" alt="" referrerpolicy="no-referrer">';
  const n=userName();return n?esc(n.charAt(0).toUpperCase()):'😊';
}
function weekStrip(){
  const t=today(), sd=parseD(selDate), dow=(sd.getDay()+6)%7; // Monday first
  const mon=addDays(selDate,-dow); let h='<div class="week">';
  const names=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  for(let i=0;i<7;i++){
    const d=addDays(mon,i), has=totals(d).items>0, fut=d>t;
    h+='<button class="wd'+(d===selDate?' on':'')+(fut?' fut':'')+'" data-act="selDate" data-d="'+d+'">'+names[i]+'<b>'+parseD(d).getDate()+'</b>'+(has?'<span class="dot"></span>':'')+'</button>';
  }
  return h+'</div>';
}
function headerHTML(sub){
  const n=userName();
  const dt=selDate===today()?'Today':parseD(selDate).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'});
  return '<div class="hdr"><div class="hdr-top"><div class="hello"><small>'+greet()+(n?',':'')+'</small><b>'+(n?esc(n)+' 👋':'Welcome 👋')+'</b></div>'+
    '<div style="display:flex;gap:10px;align-items:center"><button class="hbtn" data-act="goal" aria-label="Goal">🎯</button><button class="avatar" data-act="more" aria-label="Menu">'+avatarHTML()+'</button></div></div>'+
    weekStrip()+(sub?'<div style="margin-top:12px;font-weight:600;font-size:.82rem;opacity:.9">'+dt+(sub===true?'':' · '+sub)+'</div>':'')+'</div>';
}

/* ── HOME ── */
function ringSVG(pct,color,r,sw){
  const c=2*Math.PI*r,off=c*(1-Math.min(1,Math.max(0,pct)));
  return '<svg viewBox="0 0 '+(r*2+sw*2)+' '+(r*2+sw*2)+'"><circle class="rt" cx="'+(r+sw)+'" cy="'+(r+sw)+'" r="'+r+'" fill="none" stroke-width="'+sw+'"/><circle class="rf" cx="'+(r+sw)+'" cy="'+(r+sw)+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+sw+'" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>';
}
function macroCard(label,val,tgt,color){
  const pct=tgt?Math.min(100,Math.round(val/tgt*100)):0;
  return '<div class="mc"><div class="t"><span>'+label+'</span><span>'+pct+'%</span></div><div class="v">'+Math.round(val)+'<small> / '+tgt+'g</small></div><div class="bar"><i style="width:'+pct+'%;background:'+color+'"></i></div></div>';
}
function bottleSVG(pct){
  const h=Math.round(98*Math.min(1,pct)), y=118-h;
  return '<svg viewBox="0 0 78 132"><defs><clipPath id="bc"><path d="M27 10h24v10c0 6 14 12 14 30v68c0 7-6 12-13 12H26c-7 0-13-5-13-12V50c0-18 14-24 14-30z"/></clipPath>'+
   '<linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs>'+
   '<path d="M27 10h24v10c0 6 14 12 14 30v68c0 7-6 12-13 12H26c-7 0-13-5-13-12V50c0-18 14-24 14-30z" fill="#F0F9FF" stroke="#7DD3FC" stroke-width="3"/>'+
   '<g clip-path="url(#bc)"><rect x="0" y="'+y+'" width="78" height="'+(h+14)+'" fill="url(#wg)" style="transition:all .8s ease"/>'+
   '<path d="M0 '+y+' q10-6 20 0 t20 0 t20 0 t20 0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5"/></g>'+
   '<rect x="26" y="2" width="26" height="9" rx="4" fill="#0EA5E9"/></svg>';
}
function nextSlotInfo(){
  if(typeof slotsFor!=='function') return null;
  const d=today(), sl=slotsFor(d); if(!sl||!sl.length) return null;
  const nm=nowMin(), adh=(state.adh[d]||{});
  // overdue & unanswered (within last 3h)
  for(const s of sl){ if(!s.on) continue; const st=adh[s.id]; if(!st&&tmin(s.time)<=nm&&nm-tmin(s.time)<=180) return {s,due:true}; if(st&&st.s==='later') return {s,due:true,later:true}; }
  for(const s of sl){ if(!s.on) continue; if(!adh[s.id]&&tmin(s.time)>nm) return {s,due:false}; }
  return null;
}
function slotKcal(s){return (s.foods||[]).reduce((a,f)=>a+(f.cal||0),0);}
function renderHome(){
  const d=selDate, t=totals(d), g=targets(), left=g.cal-t.cal, over=left<0;
  let h=headerHTML();
  h+='<div class="pad lift">';
  // summary card
  h+='<div class="card"><div class="sum"><div class="ringbox">'+ringSVG(g.cal?t.cal/g.cal:0,over?'#EF4444':'#FF7A1A',58,13)+
     '<div class="rc"><b class="num">'+Math.abs(Math.round(left))+'</b><span>kcal '+(over?'over':'left')+'</span></div></div>'+
     '<div class="sumstats">'+
       '<div class="ss"><i style="background:#FFEDD5">🍽️</i><div><b class="num">'+Math.round(t.cal)+'</b><span>Eaten</span></div></div>'+
       '<div class="ss"><i style="background:#DCFCE7">🎯</i><div><b class="num">'+g.cal+'</b><span>Daily goal</span></div></div>'+
       '<div class="ss"><i style="background:#ECFCCB">🌿</i><div><b class="num">'+r1(t.fiber)+'g</b><span>Fibre</span></div></div>'+
     '</div></div>'+
     '<div class="macros">'+macroCard('Protein',t.prot,g.prot,'#6366F1')+macroCard('Carbs',t.carb,g.carb,'#F59E0B')+macroCard('Fat',t.fat,g.fat,'#F43F5E')+'</div>'+
     (g.has?'':'<button class="btn sm" style="margin-top:14px" data-act="goal">🎯 Set my daily goal</button>')+
     '</div>';
  // quick actions
  h+='<div class="qa">'+
     '<button data-act="scan"><i style="background:#DCFCE7">📷</i>Scan</button>'+
     '<button data-act="addFood" data-meal=""><i style="background:#FFEDD5">🍽️</i>Add food</button>'+
     '<button data-act="water" data-ml="200"><i style="background:#E0F2FE">💧</i>+200 ml</button>'+
     '<button data-act="weight"><i style="background:#F3E8FF">⚖️</i>Weight</button></div>';
  // next reminder
  const nx=(d===today())?nextSlotInfo():null;
  if(nx){
    const s=nx.s;
    h+='<div class="card next"><div class="nt"><i>'+(nx.due?'⏰':'🕒')+'</i><div><b>'+(nx.due?(nx.later?'You planned to eat: ':'Time for '):'Up next: ')+esc(s.name)+' · '+fmtTime(s.time)+'</b><span>'+esc((s.foods||[]).map(f=>f.name).join(', ')||'No foods added yet')+(slotKcal(s)?' · ~'+slotKcal(s)+' kcal':'')+'</span></div></div>'+
       (nx.due?'<div class="acts"><button class="act ate" data-act="slot" data-s="'+s.id+'" data-a="ate">✅ I ate it</button><button class="act later" data-act="slot" data-s="'+s.id+'" data-a="later">⏳ Will eat</button><button class="act skip" data-act="slot" data-s="'+s.id+'" data-a="skip">⏭ Skip</button></div>':'')+'</div>';
  } else if(!state.plan||!(state.plan.slots||[]).length){
    h+='<div class="card next"><div class="nt"><i>🗓️</i><div><b>Plan your meals & get reminders</b><span>Create 1–10 meal slots with timings and food alerts.</span></div></div><button class="btn sm" style="margin-top:12px;background:#F97316;box-shadow:none" data-act="tab" data-tab="plan">Set up schedule</button></div>';
  }
  // water
  const wp=g.water?t.ml/g.water:0, wl=dayLog(d)||{wev:[]};
  h+='<div class="card"><h3>💧 Water <span class="more" data-act="remindSet">⏰ Reminders</span></h3><div class="water"><div class="bottle">'+bottleSVG(wp)+'</div><div style="flex:1">'+
     '<div class="wtxt"><b class="num">'+t.ml+'</b> <small>/ '+g.water+' ml</small><div class="sub">'+Math.round(Math.min(1,wp)*100)+'% of today\'s goal'+(wp>=1?' 🎉':'')+'</div></div>'+
     '<div class="wbtns"><button class="wb" data-act="water" data-ml="50">+50</button><button class="wb" data-act="water" data-ml="100">+100</button><button class="wb" data-act="water" data-ml="200">+200</button><button class="wb" data-act="water" data-ml="300">+300</button><button class="wb undo" data-act="waterUndo">↩ Undo</button></div></div></div></div>';
  // meals
  h+='<div class="card"><h3>🍴 Meals <span class="more" data-act="tab" data-tab="diary">Diary ›</span></h3>';
  MEALS.forEach(m=>{
    const items=((dayLog(d)||{}).meals||{})[m.id]||[], kc=items.reduce((a,i)=>a+(i.cal||0),0);
    h+='<div class="meal"><div class="ic" style="background:'+m.bg+'">'+m.e+'</div><div class="mi"><b>'+m.n+'</b><span>'+(items.length?esc(items.map(i=>i.name.replace(/\s*\(.*?\)/g,'')).join(', ')):'Nothing logged yet')+'</span></div>'+
       (items.length?'<div class="mk num">'+Math.round(kc)+'<small>kcal</small></div>':'')+'<button class="addb" data-act="addFood" data-meal="'+m.id+'" aria-label="Add food">＋</button></div>';
  });
  h+='</div>';
  // streak chips
  const st=streak(), logged=Object.keys(state.log).filter(k=>totals(k).items).length;
  h+='<div class="chips"><div class="chip fire"><span style="font-size:1.4rem">🔥</span><div><b>'+st+'</b> day streak</div></div>'+
     '<div class="chip"><span style="font-size:1.3rem">💧</span><div><b>'+Math.round(Math.min(1,wp)*100)+'%</b> hydrated</div></div>'+
     '<div class="chip"><span style="font-size:1.3rem">📅</span><div><b>'+logged+'</b> days logged</div></div>'+
     '<div class="chip"><span style="font-size:1.3rem">🥗</span><div><b>'+t.items+'</b> items today</div></div></div>';
  if(!IN_APP&&/Android/i.test(navigator.userAgent))h+='<div class="card" style="background:linear-gradient(135deg,#ECFDF5,#D1FAE5);display:flex;align-items:center;gap:12px"><div style="font-size:2rem">📲</div><div style="flex:1"><b>Get the Android app</b><div class="sub">Background meal & water reminders with one-tap replies.</div></div><button class="btn sm" data-act="getApp">Install</button></div>';
  // food of the day (bottom)
  const f=fotdToday();
  h+='<div class="card fotd" style="margin-top:12px"><span class="tag">🌟 FOOD OF THE DAY</span><div class="fh"><div class="em">'+f.e+'</div><div><h4>'+esc(f.n)+'</h4><div class="sub" style="color:#047857">Per 100 g · typical serving: '+esc(f.s)+'</div></div></div>'+
     '<div class="fm"><div><b>'+f.c+'</b><span>KCAL</span></div><div><b>'+f.p+'g</b><span>PROTEIN</span></div><div><b>'+f.cb+'g</b><span>CARBS</span></div><div><b>'+f.f+'g</b><span>FAT</span></div></div>'+
     '<p><b>Why it\'s great:</b> '+esc(f.b)+'</p><button class="fb" data-act="addFotd">＋ Add to today\'s log</button></div>';
  h+='</div>';
  $('v-home').innerHTML=h;
}

/* ── DIARY ── */
function renderDiary(){
  const d=selDate, t=totals(d), g=targets(), l=dayLog(d)||{meals:{},wev:[]};
  let h=headerHTML(true)+'<div class="pad lift">';
  h+='<div class="card flat" style="display:flex;justify-content:space-around;text-align:center"><div><b class="num" style="font-size:1.3rem;color:#FF7A1A">'+Math.round(t.cal)+'</b><div class="sub">eaten</div></div><div><b class="num" style="font-size:1.3rem">'+g.cal+'</b><div class="sub">goal</div></div><div><b class="num" style="font-size:1.3rem;color:'+(g.cal-t.cal<0?'#EF4444':'#10B981')+'">'+Math.abs(Math.round(g.cal-t.cal))+'</b><div class="sub">'+(g.cal-t.cal<0?'over':'left')+'</div></div></div>';
  MEALS.forEach(m=>{
    const items=(l.meals||{})[m.id]||[], kc=items.reduce((a,i)=>a+(i.cal||0),0);
    h+='<div class="card"><h3><span style="font-size:1.3rem">'+m.e+'</span>'+m.n+'<span class="more num" style="color:var(--ink)">'+Math.round(kc)+' kcal</span></h3>';
    if(!items.length) h+='<div class="sub" style="padding:2px 0 10px">Nothing logged yet.</div>';
    items.forEach((i,ix)=>{
      h+='<div class="foodrow"><div class="fi"><b>'+esc(i.name)+'</b><span>'+(i.qty?Math.round(i.qty)+' g · ':'')+'P '+r1(i.prot||0)+' · C '+r1(i.carb||0)+' · F '+r1(i.fat||0)+(i.slot?' · from plan':'')+'</span></div><div class="fk num">'+Math.round(i.cal||0)+'</div><button class="xbtn" data-act="delFood" data-meal="'+m.id+'" data-i="'+ix+'" aria-label="Remove">✕</button></div>';
    });
    h+='<button class="btn sec sm" style="margin-top:8px" data-act="addFood" data-meal="'+m.id+'">＋ Add food</button></div>';
  });
  h+='<div class="card"><h3>💧 Water log <span class="more num" style="color:#0369A1">'+t.ml+' ml</span></h3>';
  if(!(l.wev||[]).length) h+='<div class="sub">No water logged for this day.</div>';
  (l.wev||[]).slice().reverse().forEach(e=>{
    h+='<div class="foodrow"><div class="fi"><b>'+(e.skip?'⏭ Skipped reminder':'💧 '+e.ml+' ml')+'</b><span>'+new Date(e.ts).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})+'</span></div></div>';
  });
  h+='</div></div>';
  $('v-diary').innerHTML=h;
}

/* ── water ── */
function addWater(ml,date,silent,ts){
  date=date||today();
  const l=dayLog(date,true), g=targets(), before=l.waterMl;
  l.waterMl+=ml; l.water=Math.floor(l.waterMl/GLASS_ML); l.wev.push({ml:ml,ts:ts||Date.now()});
  saveState();
  if(!silent){
    buzz(15); toast('💧 +'+ml+' ml  ·  '+l.waterMl+' / '+g.water+' ml');
    if(before<g.water&&l.waterMl>=g.water&&once('water')){confetti(100);toast('🎉 Daily water goal reached!');}
    renderAll();
  }
}
function waterUndo(){
  const l=dayLog(selDate); if(!l||!l.wev.length){toast('Nothing to undo');return;}
  const e=l.wev.pop(); if(!e.skip){l.waterMl=Math.max(0,l.waterMl-e.ml);l.water=Math.floor(l.waterMl/GLASS_ML);}
  saveState();renderAll();toast('Removed last entry');
}

/* ── food picker ── */
let pk={cat:'all',q:'',cb:null,title:''};
function allFoods(){return state.custom.concat(FOODS);}
function foodEmoji(f){const u=COUNTABLE_UNITS[f.id];return u?u.icon:(CAT_EMOJI[f.cat]||'🍽️');}
function autoMeal(){const h=new Date().getHours();return h<11?'breakfast':h<16?'lunch':h<19?'snacks':'dinner';}
function openPicker(title,cb){
  pk={cat:'all',q:'',cb:cb,title:title};
  const ov=openSheet(sheetHead(esc(title))+'<div style="padding:0 18px"><div class="srch"><span>🔍</span><input id="pkq" placeholder="Search 300+ foods — dal, roti, banana…" autocomplete="off"></div><div class="cats" id="pkc"></div></div><div class="sb" id="pkl" style="padding-top:0"></div>',{full:true});
  renderPickerCats();renderPickerList();
  const q=$('pkq');q.addEventListener('input',()=>{pk.q=q.value.trim().toLowerCase();renderPickerList();});
  setTimeout(()=>{try{q.focus();}catch(e){}},300);
}
function renderPickerCats(){
  const cats=['all','recent'].concat(CATS.filter(c=>c!=='all'));if(state.custom.length)cats.splice(2,0,'custom');
  const lab=Object.assign({},CAT_LABELS,{recent:'🕘 Recent',custom:'⭐ My foods'});
  $('pkc').innerHTML=cats.map(c=>'<button class="cat'+(pk.cat===c?' on':'')+'" data-act="pkcat" data-c="'+c+'">'+(lab[c]||c)+'</button>').join('');
}
function renderPickerList(){
  let list=allFoods();
  if(pk.cat==='recent') list=state.recent.map(id=>list.find(f=>f.id===id)).filter(Boolean);
  else if(pk.cat==='custom') list=state.custom;
  else if(pk.cat!=='all') list=list.filter(f=>f.cat===pk.cat);
  if(pk.q){
    const w=pk.q.split(/\s+/);list=list.filter(f=>{const n=f.name.toLowerCase();return w.every(x=>n.includes(x));});
    const rank=f=>{const n=f.name.toLowerCase(),i=n.indexOf(pk.q);const wb=new RegExp('(^|[^a-z])'+pk.q.replace(/[^a-z0-9 ]/g,'')).test(n);return (wb?(i<=0?0:3):20)+n.length/100;};
    list=list.slice().sort((a,b)=>rank(a)-rank(b));
  }
  const box=$('pkl');
  if(!list.length){box.innerHTML='<div class="empty"><i>🔎</i>No match. <br><button class="btn sm" style="margin-top:10px" data-act="customFood">＋ Create custom food</button></div>';return;}
  box.innerHTML=list.slice(0,80).map(f=>'<div class="fitem" data-act="pickFood" data-id="'+f.id+'"><div class="fe">'+foodEmoji(f)+'</div><div><b>'+esc(f.name)+'</b><span>P '+f.prot+' · C '+f.carb+' · F '+f.fat+' per 100 g</span></div><div class="fa num">'+f.cal+'<br><span style="color:var(--mut);font-weight:500">kcal/100g</span></div></div>').join('')+
    (list.length>80?'<div class="empty">Showing 80 of '+list.length+' — refine your search</div>':'')+
    '<div style="text-align:center;padding:12px"><button class="btn ghost sm" data-act="customFood">＋ Can\'t find it? Add custom food</button></div>';
}
let qf=null,qn=100,qc=1;
function openQty(food,cb){
  qf=food;const u=COUNTABLE_UNITS[food.id];qc=1;qn=u?u.g:100;
  const ov=openSheet('<div id="qbody"></div>');ov.querySelector('.sheet').style.paddingBottom='18px';
  qf._cb=cb;renderQty();
}
function qGrams(){const u=COUNTABLE_UNITS[qf.id];return u?qc*u.g:qn;}
function renderQty(){
  const u=COUNTABLE_UNITS[qf.id], g=qGrams(), r=g/100;
  const n={c:Math.round(qf.cal*r),p:r1(qf.prot*r),cb:r1(qf.carb*r),f:r1(qf.fat*r)};
  $('qbody').innerHTML='<div class="sh"><h2>'+foodEmoji(qf)+' '+esc(qf.name)+'</h2><button class="xclose" data-act="closeSheet">✕</button></div><div class="sb">'+
    (u?'<div class="sub" style="text-align:center">How many '+esc(u.label)+'?</div><div class="qrow"><button data-act="qc" data-d="-1">−</button><input id="qv" type="number" value="'+qc+'" min="1" inputmode="numeric"><button data-act="qc" data-d="1">＋</button></div><div class="sub" style="text-align:center">≈ '+g+' g total</div>'
      :'<div class="sub" style="text-align:center">Quantity (grams)</div><div class="qrow"><button data-act="qn" data-d="-25">−</button><input id="qv" type="number" value="'+qn+'" min="1" inputmode="decimal"><button data-act="qn" data-d="25">＋</button></div><div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap">'+[50,100,150,200,250].map(x=>'<button class="cat" data-act="qset" data-v="'+x+'">'+x+' g</button>').join('')+'</div>')+
    '<div class="nutr"><div><b class="num">'+n.c+'</b><span>KCAL</span></div><div><b>'+n.p+'g</b><span>PROTEIN</span></div><div><b>'+n.cb+'g</b><span>CARBS</span></div><div><b>'+n.f+'g</b><span>FAT</span></div></div>'+
    '<button class="btn" data-act="qok">Add '+n.c+' kcal</button></div>';
  const qv=$('qv');if(qv)qv.addEventListener('input',()=>{const v=parseFloat(qv.value)||0;if(COUNTABLE_UNITS[qf.id])qc=Math.max(0,Math.round(v));else qn=Math.max(0,v);refreshQtyNums();});
}
function refreshQtyNums(){ // update numbers without re-rendering (keeps keyboard open)
  const g=qGrams(),r=g/100,b=document.querySelectorAll('#qbody .nutr b');
  if(b.length===4){b[0].textContent=Math.round(qf.cal*r);b[1].textContent=r1(qf.prot*r)+'g';b[2].textContent=r1(qf.carb*r)+'g';b[3].textContent=r1(qf.fat*r)+'g';}
  const ok=document.querySelector('#qbody [data-act=qok]');if(ok)ok.textContent='Add '+Math.round(qf.cal*r)+' kcal';
}
function foodItem(food,grams,extra){
  const r=grams/100;
  return Object.assign({id:food.id,name:food.name,qty:grams,cal:Math.round(food.cal*r),prot:r1(food.prot*r),carb:r1(food.carb*r),fat:r1(food.fat*r),fiber:r1((food.fiber||0)*r),t:Date.now()},extra||{});
}
function addFoodToLog(item,meal,date){
  date=date||selDate;const l=dayLog(date,true);
  (l.meals[meal]=l.meals[meal]||[]).push(item);
  if(item.id){state.recent=[item.id].concat(state.recent.filter(x=>x!==item.id)).slice(0,14);}
  saveState();
}
function afterFoodLogged(before,date){
  const t=totals(date),g=targets();
  buzz(18);toast('Logged ✓  '+Math.round(t.cal)+' / '+g.cal+' kcal');
  try{if(IN_APP&&AndroidApp.foodAdded)AndroidApp.foodAdded();}catch(e){}
  if(date===today()&&g.has&&before<g.cal*.9&&t.cal>=g.cal*.9&&t.cal<=g.cal*1.08&&once('goal')){setTimeout(()=>{confetti(120);toast('🎯 Daily calorie goal reached!');},500);}
  const s=streak();if(s>0&&s%7===0&&once('streak')){setTimeout(()=>{confetti(140);toast('🔥 '+s+'-day streak! Keep going');},900);}
  renderAll();
}
function logWithPicker(meal){
  meal=meal||autoMeal();const date=selDate;
  const mn=(MEALS.find(m=>m.id===meal)||{}).n||'Meal';
  openPicker('Add to '+mn,food=>openQty(food,(grams)=>{
    const before=totals(date).cal;addFoodToLog(foodItem(food,grams),meal,date);closeAllSheets();afterFoodLogged(before,date);
  }));
}
function addCustomFoodSheet(prefill){
  prefill=prefill||{};
  openSheet(sheetHead('⭐ Custom food')+'<div class="sb"><div class="sub">Values per 100 g (or per 100 ml).</div>'+
    '<label class="lbl">Name</label><input class="inp" id="cfn" value="'+esc(prefill.name||'')+'" placeholder="e.g. Mom\'s paneer paratha">'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div><label class="lbl">Calories</label><input class="inp" id="cfc" type="number" inputmode="decimal" value="'+(prefill.cal||'')+'"></div><div><label class="lbl">Protein g</label><input class="inp" id="cfp" type="number" inputmode="decimal" value="'+(prefill.prot||'')+'"></div>'+
    '<div><label class="lbl">Carbs g</label><input class="inp" id="cfb" type="number" inputmode="decimal" value="'+(prefill.carb||'')+'"></div><div><label class="lbl">Fat g</label><input class="inp" id="cff" type="number" inputmode="decimal" value="'+(prefill.fat||'')+'"></div></div>'+
    '<button class="btn" style="margin-top:16px" data-act="saveCustom">Save food</button></div>');
}
function saveCustomFood(){
  const name=$('cfn').value.trim(),cal=parseFloat($('cfc').value);
  if(!name||isNaN(cal)){toast('Enter a name and calories');return null;}
  const f={id:'cu'+Date.now(),name:name,cat:'custom',cal:Math.round(cal),prot:r1(parseFloat($('cfp').value)||0),carb:r1(parseFloat($('cfb').value)||0),fat:r1(parseFloat($('cff').value)||0),fiber:0,water:0};
  state.custom.unshift(f);saveState();closeSheet();toast('Saved to My foods ⭐');
  if(window._cfAfter){const cb=window._cfAfter;window._cfAfter=null;cb(f);return f;}
  if(pk.cb&&$('pkl')){renderPickerCats();renderPickerList();}
  return f;
}

/* ── weight ── */
function weightSheet(){
  const last=(state.weights.slice(-1)[0]||{}).w||(state.profile.weight||'');
  openSheet(sheetHead('⚖️ Log weight')+'<div class="sb"><div class="qrow"><button data-act="wdelta" data-d="-0.1">−</button><input id="wv" type="number" step="0.1" inputmode="decimal" value="'+last+'"><button data-act="wdelta" data-d="0.1">＋</button></div><div class="sub" style="text-align:center">kilograms</div><button class="btn" style="margin-top:14px" data-act="saveWeight">Save weight</button></div>');
}
function saveWeight(){
  const w=parseFloat($('wv').value);if(!w||w<20||w>300){toast('Enter a valid weight (20–300 kg)');return;}
  const t=today();state.weights=state.weights.filter(x=>x.date!==t);state.weights.push({date:t,w:w});state.weights.sort((a,b)=>a.date<b.date?-1:1);
  state.profile.weight=w;saveState();closeSheet();toast('Weight saved ⚖️');renderAll();
}
