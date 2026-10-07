/* OrthoChronicles Calorie Tracker — progress & charts (pure SVG, works offline) */
let progRange=7;
const PR=[[1,'Day'],[7,'Week'],[30,'Month'],[90,'3 Months']];

function rangeDates(n){const t=today(),a=[];for(let i=n-1;i>=0;i--)a.push(addDays(t,-i));return a;}
function shortLbl(d,n){const dt=parseD(d);return n<=7?['Su','Mo','Tu','We','Th','Fr','Sa'][dt.getDay()]:dt.getDate()+'/'+(dt.getMonth()+1);}

/* ── SVG primitives ── */
function barChart(items,goal,unit,fmt){
  const W=320,H=170,pl=30,pb=24,pt=14,n=items.length;
  const mx=Math.max(goal||0,...items.map(i=>i.v),1)*1.15,bw=(W-pl-4)/n,gap=Math.min(6,bw*.25);
  const y=v=>pt+(H-pt-pb)*(1-v/mx);
  let s='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="#10B981"/></linearGradient><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FB923C"/><stop offset="1" stop-color="#F43F5E"/></linearGradient></defs>';
  [0,.5,1].forEach(f=>{const v=mx/1.15*f;s+='<line x1="'+pl+'" x2="'+W+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="#E6EFED" stroke-width="1"/><text x="'+(pl-5)+'" y="'+(y(v)+3)+'" text-anchor="end">'+(fmt?fmt(v):Math.round(v))+'</text>';});
  items.forEach((it,i)=>{
    const x=pl+i*bw+gap/2,h=Math.max(it.v>0?3:0,(H-pt-pb)*(it.v/mx)),over=goal&&it.v>goal*1.08;
    s+='<rect x="'+x.toFixed(1)+'" y="'+(H-pb-h).toFixed(1)+'" width="'+(bw-gap).toFixed(1)+'" height="'+h.toFixed(1)+'" rx="'+Math.min(5,(bw-gap)/2)+'" fill="'+(it.v?(over?'url(#bg2)':'url(#bg1)'):'#E6EFED')+'"><animate attributeName="height" from="0" to="'+h.toFixed(1)+'" dur=".6s" fill="freeze"/><animate attributeName="y" from="'+(H-pb)+'" to="'+(H-pb-h).toFixed(1)+'" dur=".6s" fill="freeze"/></rect>';
    const every=n>14?Math.ceil(n/7):1;if(i%every===0||i===n-1)s+='<text x="'+(x+(bw-gap)/2).toFixed(1)+'" y="'+(H-7)+'" text-anchor="middle">'+it.l+'</text>';
  });
  if(goal)s+='<line x1="'+pl+'" x2="'+W+'" y1="'+y(goal)+'" y2="'+y(goal)+'" stroke="#6366F1" stroke-width="1.8" stroke-dasharray="5 4"/><text x="'+W+'" y="'+(y(goal)-4)+'" text-anchor="end" style="fill:#6366F1">goal '+(fmt?fmt(goal):goal)+(unit||'')+'</text>';
  return s+'</svg>';
}
function lineChart(pts,color,unit){
  if(pts.length<2)return '<div class="empty"><i>📈</i>Log your weight on at least two days to see a trend.</div>';
  const W=320,H=160,pl=34,pb=24,pt=14;
  const ws=pts.map(p=>p.v),mn=Math.min(...ws)-1,mx=Math.max(...ws)+1;
  const t0=parseD(pts[0].d).getTime(),t1=parseD(pts[pts.length-1].d).getTime()||t0+1;
  const X=d=>pl+(W-pl-8)*((parseD(d).getTime()-t0)/Math.max(1,(t1-t0))),Y=v=>pt+(H-pt-pb)*(1-(v-mn)/(mx-mn));
  let s='<svg class="chart" viewBox="0 0 '+W+' '+H+'"><defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+color+'" stop-opacity=".35"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>';
  [mn+1,(mn+mx)/2,mx-1].forEach(v=>{s+='<line x1="'+pl+'" x2="'+W+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#E6EFED"/><text x="'+(pl-5)+'" y="'+(Y(v)+3)+'" text-anchor="end">'+r1(v)+'</text>';});
  const path=pts.map((p,i)=>(i?'L':'M')+X(p.d).toFixed(1)+','+Y(p.v).toFixed(1)).join(' ');
  s+='<path d="'+path+' L'+X(pts[pts.length-1].d).toFixed(1)+','+(H-pb)+' L'+X(pts[0].d).toFixed(1)+','+(H-pb)+' Z" fill="url(#lg1)"/><path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" from="1" to="0" dur=".9s" fill="freeze"/></path>';
  pts.forEach((p,i)=>{s+='<circle cx="'+X(p.d).toFixed(1)+'" cy="'+Y(p.v).toFixed(1)+'" r="4" fill="#fff" stroke="'+color+'" stroke-width="2.5"/>';if(i===0||i===pts.length-1)s+='<text x="'+X(p.d).toFixed(1)+'" y="'+(Y(p.v)-9)+'" text-anchor="'+(i?'end':'start')+'" style="fill:'+color+';font-size:11px">'+r1(p.v)+unit+'</text>';});
  s+='<text x="'+pl+'" y="'+(H-7)+'">'+parseD(pts[0].d).toLocaleDateString(undefined,{day:'numeric',month:'short'})+'</text><text x="'+W+'" y="'+(H-7)+'" text-anchor="end">'+parseD(pts[pts.length-1].d).toLocaleDateString(undefined,{day:'numeric',month:'short'})+'</text>';
  return s+'</svg>';
}
function donut(parts,center,sub){
  const tot=parts.reduce((a,p)=>a+p.v,0)||1,R=54,C=2*Math.PI*R;let off=0,s='<svg viewBox="0 0 140 140" width="140" height="140" style="flex-shrink:0"><g transform="rotate(-90 70 70)"><circle cx="70" cy="70" r="'+R+'" fill="none" stroke="#EDF3F2" stroke-width="20"/>';
  parts.forEach(p=>{const len=C*p.v/tot;s+='<circle cx="70" cy="70" r="'+R+'" fill="none" stroke="'+p.c+'" stroke-width="20" stroke-dasharray="'+len.toFixed(1)+' '+(C-len).toFixed(1)+'" stroke-dashoffset="'+(-off).toFixed(1)+'"/>';off+=len;});
  return s+'</g><text x="70" y="68" text-anchor="middle" style="font-size:20px;font-weight:800;fill:#0F2A2E">'+center+'</text><text x="70" y="84" text-anchor="middle" style="font-size:10px;fill:#7A918F">'+sub+'</text></svg>';
}
function heatmap(days){
  const t=today(),g=targets();let s='<div style="display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,1fr);gap:4px;">';
  const first=parseD(days[0]);const pad=(first.getDay()+6)%7;for(let i=0;i<pad;i++)s+='<div></div>';
  days.forEach(d=>{
    const c=totals(d).cal,f=g.cal?c/g.cal:0;
    const col=!c?'#EDF3F2':f<.5?'#BBF7D0':f<.85?'#6EE7B7':f<=1.1?'#10B981':'#FB923C';
    s+='<div title="'+d+': '+Math.round(c)+' kcal" style="aspect-ratio:1;border-radius:5px;background:'+col+(d===t?';outline:2px solid #0D9488':'')+'"></div>';
  });
  return s+'</div><div class="legend"><span><i style="background:#EDF3F2"></i>None</span><span><i style="background:#6EE7B7"></i>Under</span><span><i style="background:#10B981"></i>On target</span><span><i style="background:#FB923C"></i>Over</span></div>';
}

/* ── render ── */
function renderProgress(){
  const g=targets(),days=rangeDates(progRange===1?1:progRange);
  let h='<div class="hdr" style="padding-bottom:50px"><div class="hdr-top"><div class="hello"><small>Your journey</small><b>Progress & Insights</b></div><button class="avatar" data-act="more" aria-label="Menu">'+avatarHTML()+'</button></div></div>'+
    '<div class="rng" style="margin-top:-24px">'+PR.map(r=>'<button class="'+(progRange===r[0]?'on':'')+'" data-act="progRange" data-v="'+r[0]+'">'+r[1]+'</button>').join('')+'</div><div class="pad">';
  h+=progRange===1?dayProgress(g):multiProgress(g,days);
  $('v-progress').innerHTML=h+'</div>';
}
function dayProgress(g){
  const d=selDate,t=totals(d),l=dayLog(d)||{meals:{}};
  const mealParts=MEALS.map((m,i)=>({n:m.n,v:((l.meals||{})[m.id]||[]).reduce((a,x)=>a+(x.cal||0),0),c:['#F59E0B','#10B981','#8B5CF6','#3B82F6'][i]}));
  const kc=t.prot*4+t.carb*4+t.fat*9||1;
  let h='<div class="kpis"><div class="kpi"><small>🔥 Calories</small><b class="num">'+Math.round(t.cal)+'</b><em style="color:'+(t.cal>g.cal?'#EF4444':'#10B981')+'">'+Math.round(t.cal/g.cal*100)+'% of goal</em></div><div class="kpi"><small>💧 Water</small><b class="num">'+t.ml+'<span style="font-size:.8rem"> ml</span></b><em style="color:#0EA5E9">'+Math.round(t.ml/g.water*100)+'% of goal</em></div>'+
     '<div class="kpi"><small>🥩 Protein</small><b class="num">'+Math.round(t.prot)+'g</b><em style="color:#6366F1">goal '+g.prot+'g</em></div><div class="kpi"><small>🌿 Fibre</small><b class="num">'+r1(t.fiber)+'g</b><em style="color:#84CC16">goal 25–30g</em></div></div>';
  h+='<div class="card"><h3>🍽️ Calories by meal</h3>'+(t.cal?'<div class="donutw">'+donut(mealParts,Math.round(t.cal),'kcal')+'<div class="dl" style="flex:1">'+mealParts.map(p=>'<div><i style="background:'+p.c+'"></i>'+p.n+'<b class="num">'+Math.round(p.v)+'</b></div>').join('')+'</div></div>':'<div class="empty"><i>🍽️</i>Nothing logged for this day yet.</div>')+'</div>';
  h+='<div class="card"><h3>⚖️ Macro balance</h3><div class="donutw">'+donut([{v:t.prot*4,c:'#6366F1'},{v:t.carb*4,c:'#F59E0B'},{v:t.fat*9,c:'#F43F5E'}],t.cal?Math.round(t.prot*4/kc*100)+'%':'—','protein')+'<div class="dl" style="flex:1"><div><i style="background:#6366F1"></i>Protein<b>'+Math.round(t.prot)+'g</b></div><div><i style="background:#F59E0B"></i>Carbs<b>'+Math.round(t.carb)+'g</b></div><div><i style="background:#F43F5E"></i>Fat<b>'+Math.round(t.fat)+'g</b></div></div></div></div>';
  // hourly water
  const hrs=new Array(12).fill(0);(l.wev||[]).forEach(e=>{if(!e.skip){const hr=new Date(e.ts).getHours();hrs[Math.min(11,Math.floor(hr/2))]+=e.ml;}});
  h+='<div class="card"><h3>💧 Water through the day</h3>'+barChart(hrs.map((v,i)=>({l:(i*2)+'h',v:v})),0,' ml')+'</div>';
  h+=adherenceCard([d]);
  return h;
}
function multiProgress(g,days){
  const rows=days.map(d=>{const t=totals(d);return{d:d,cal:t.cal,prot:t.prot,carb:t.carb,fat:t.fat,ml:t.ml,has:t.items>0};});
  const logged=rows.filter(r=>r.has),n=logged.length||1;
  const avg=k=>Math.round(logged.reduce((a,r)=>a+r[k],0)/n);
  const wts=state.weights.filter(w=>w.date>=days[0]).map(w=>({d:w.date,v:w.w}));
  const allW=state.weights.slice(-1)[0];
  const dW=wts.length>1?r1(wts[wts.length-1].v-wts[0].v):null;
  let h='<div class="kpis"><div class="kpi"><small>🔥 Avg calories</small><b class="num">'+(logged.length?avg('cal'):'—')+'</b><em style="color:var(--mut)">goal '+g.cal+'</em></div>'+
    '<div class="kpi"><small>📅 Days logged</small><b class="num">'+logged.length+'<span style="font-size:.8rem">/'+days.length+'</span></b><em style="color:#10B981">'+Math.round(logged.length/days.length*100)+'% consistency</em></div>'+
    '<div class="kpi"><small>🥩 Avg protein</small><b class="num">'+(logged.length?avg('prot'):'—')+'g</b><em style="color:#6366F1">goal '+g.prot+'g</em></div>'+
    '<div class="kpi"><small>⚖️ Weight</small><b class="num">'+(allW?r1(allW.w)+'<span style="font-size:.8rem"> kg</span>':'—')+'</b><em style="color:'+(dW==null?'var(--mut)':dW<=0?'#10B981':'#F59E0B')+'">'+(dW==null?'log to track':(dW>0?'+':'')+dW+' kg')+'</em></div></div>';
  // calories chart (weekly buckets for 3 months)
  let items;
  if(days.length>40){items=[];for(let i=0;i<days.length;i+=7){const ch=rows.slice(i,i+7).filter(r=>r.has);items.push({l:parseD(days[i]).getDate()+'/'+(parseD(days[i]).getMonth()+1),v:ch.length?Math.round(ch.reduce((a,r)=>a+r.cal,0)/ch.length):0});}}
  else items=rows.map(r=>({l:shortLbl(r.d,days.length),v:Math.round(r.cal)}));
  h+='<div class="card"><h3>🔥 Calories '+(days.length>40?'<span class="more" style="color:var(--mut)">weekly average</span>':'')+'</h3>'+barChart(items,g.cal,'',x=>Math.round(x))+'</div>';
  // macro donut
  const tp=logged.reduce((a,r)=>a+r.prot,0),tc=logged.reduce((a,r)=>a+r.carb,0),tf=logged.reduce((a,r)=>a+r.fat,0),kc=tp*4+tc*4+tf*9||1;
  h+='<div class="card"><h3>⚖️ Macro split <span class="more" style="color:var(--mut)">share of calories</span></h3>'+(logged.length?'<div class="donutw">'+donut([{v:tp*4,c:'#6366F1'},{v:tc*4,c:'#F59E0B'},{v:tf*9,c:'#F43F5E'}],Math.round(avg('cal')),'avg kcal')+'<div class="dl" style="flex:1"><div><i style="background:#6366F1"></i>Protein<b>'+Math.round(tp*4/kc*100)+'%</b></div><div><i style="background:#F59E0B"></i>Carbs<b>'+Math.round(tc*4/kc*100)+'%</b></div><div><i style="background:#F43F5E"></i>Fat<b>'+Math.round(tf*9/kc*100)+'%</b></div></div></div>':'<div class="empty"><i>🍽️</i>Log meals to see your macro split.</div>')+'</div>';
  // weight
  h+='<div class="card"><h3>⚖️ Weight trend <span class="more" data-act="weight">＋ Log</span></h3>'+lineChart(wts,'#8B5CF6',' kg')+'</div>';
  // water
  const wItems=days.length>40?(()=>{const a=[];for(let i=0;i<days.length;i+=7){const ch=rows.slice(i,i+7);a.push({l:parseD(days[i]).getDate()+'/'+(parseD(days[i]).getMonth()+1),v:Math.round(ch.reduce((x,r)=>x+r.ml,0)/ch.length)});}return a;})():rows.map(r=>({l:shortLbl(r.d,days.length),v:r.ml}));
  h+='<div class="card"><h3>💧 Water intake</h3>'+barChart(wItems,g.water,'',x=>Math.round(x))+'</div>';
  h+=adherenceCard(days);
  h+='<div class="card"><h3>🔥 Consistency heatmap</h3>'+heatmap(days.length<28?rangeDates(28):days)+'</div>';
  return h;
}
function adherenceCard(days){
  let ate=0,later=0,skip=0,total=0,pend=0;const t=today();
  days.forEach(d=>{if(d>t)return;slotsFor(d).filter(s=>s.on).forEach(s=>{total++;const st=slotStatus(d,s.id);if(st==='ate')ate++;else if(st==='later')later++;else if(st==='skip')skip++;else pend++;});});
  let wd=0,ws=0;days.forEach(d=>{const l=dayLog(d);if(l)(l.wev||[]).forEach(e=>{if(e.skip)ws++;else wd++;});});
  if(!total&&!wd&&!ws)return '<div class="card"><h3>✅ Plan adherence</h3><div class="empty"><i>🗓️</i>Set up a meal schedule with reminders to track how well you follow it.<br><button class="btn sm" style="margin-top:10px" data-act="tab" data-tab="plan">Open planner</button></div></div>';
  const pct=total?Math.round(ate/total*100):0;
  return '<div class="card"><h3>✅ Plan adherence</h3><div class="donutw">'+donut([{v:ate,c:'#10B981'},{v:later,c:'#FBBF24'},{v:skip,c:'#94A3B8'},{v:pend,c:'#E2E8F0'}],pct+'%','followed')+
    '<div class="dl" style="flex:1"><div><i style="background:#10B981"></i>Ate<b>'+ate+'</b></div><div><i style="background:#FBBF24"></i>Will eat<b>'+later+'</b></div><div><i style="background:#94A3B8"></i>Skipped<b>'+skip+'</b></div><div><i style="background:#E2E8F0"></i>No reply<b>'+pend+'</b></div></div></div>'+
    '<div class="sub" style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)">💧 Water reminders: <b>'+wd+'</b> replied with a drink · <b>'+ws+'</b> skipped</div></div>';
}
