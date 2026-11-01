/* OrthoChronicles Calorie Tracker — curated meals with photos (dashboard) + in-app update / what's new prompts */
const CURATED=[
 /* [catalog name, photo, meals (b l s d), tag] */
 ['Idli (1 pc ~40g)','idli','b','Light & fermented'],
 ['Upma (1 bowl 200g)','upma','b','Quick fibre-rich start'],
 ['Masala Dosa (1 large)','masala-dosa','bl','South Indian classic'],
 ['Aloo Paratha','paratha','b','Hearty & filling'],
 ['Egg (whole, 1 large ~50g)','boiled-egg','bs','High protein'],
 ['Omelette (plain)','omelette','b','Protein-packed'],
 ['Avocado Toast','avocado-toast','b','Healthy fats'],
 ['Spinach Green Smoothie (300ml)','smoothie','bs','Green & fresh'],
 ['Banana','banana','bs','Quick natural energy'],
 ['Orange (Santra)','orange','bs','Vitamin C boost'],
 ['Mango (Aam)','mango','s','Seasonal sweet'],
 ['Pomegranate (Anar)','pomegranate','s','Antioxidant rich'],
 ['Almonds (Badam)','almonds','bs','Healthy fats'],
 ['Walnuts (Akhrot)','walnuts','s','Brain-friendly omega-3'],
 ['Coconut Water (200ml)','coconut-water','s','Natural electrolytes'],
 ['Dhokla (2 pcs ~120g)','dhokla','bs','Steamed & light'],
 ['Moong Sprouts (raw)','sprouts','bs','Fibre + plant protein'],
 ['Sweet Potato (Shakarkandi)','sweet-potato','sd','Slow-release carbs'],
 ['Hummus','hummus','s','Chickpea dip'],
 ['Chicken Tikka (6 pcs ~150g)','chicken-tikka','sd','Lean protein'],
 ['Paneer (cottage cheese)','paneer','ld','Veg protein'],
 ['Palak Paneer','palak-paneer','ld','Iron + protein'],
 ['Rajma Masala','rajma','ld','Plant protein'],
 ['Chole (chana masala)','chana-masala','ld','Fibre-rich'],
 ['Khichdi (1 bowl 200g)','khichdi','ld','Balanced comfort food'],
 ['Chapati / Roti (plain)','roti','ld','Whole-wheat staple'],
 ['Aloo Gobi','aloo-gobi','ld','Home-style sabzi'],
 ['Baingan Bharta','baingan-bharta','ld','Smoky & low-cal'],
 ['Tandoori Chicken (half, ~200g)','tandoori-chicken','ld','Grilled, not fried'],
 ['Biryani (veg, 1 bowl 300g)','biryani','l','Treat — enjoy mindfully'],
];
const CURATED_CREDITS={"idli":{"title":"Idli","artist":"Soumya dey at English Wikipedia","lic":"CC BY-SA 3.0"},"upma":{"title":"Upma","artist":"Thamizhpparithi Maari","lic":"CC BY-SA 4.0"},"masala-dosa":{"title":"Masala dosa","artist":"Yakshitha","lic":"CC BY-SA 4.0"},"paratha":{"title":"Paratha","artist":"Nithyasrm","lic":"CC BY-SA 4.0"},"boiled-egg":{"title":"Boiled egg","artist":"Amin","lic":"CC BY-SA 4.0"},"banana":{"title":"Banana","artist":"TimothyPilgrim","lic":"CC BY-SA 3.0"},"pomegranate":{"title":"Pomegranate","artist":"Augustus Binu : flickr","lic":"CC BY-SA 3.0"},"almonds":{"title":"Almond","artist":"Ivar Leidus","lic":"CC BY-SA 4.0"},"walnuts":{"title":"Walnut","artist":"Ivar Leidus","lic":"CC BY-SA 4.0"},"paneer":{"title":"Paneer","artist":"Sonja Pauen - Stanhopea","lic":"CC BY 2.0 de"},"palak-paneer":{"title":"Palak paneer","artist":"Lopanayak","lic":"CC BY-SA 4.0"},"chana-masala":{"title":"Chana masala","artist":"Simon Law (sfllaw) from Montréal, QC, Canada","lic":"CC BY-SA 2.0"},"rajma":{"title":"Rajma","artist":"Gaurav Nemade","lic":"CC BY-SA 2.0"},"khichdi":{"title":"Khichdi","artist":"Rpande","lic":"CC BY-SA 4.0"},"roti":{"title":"Roti","artist":"Famartin","lic":"CC BY-SA 4.0"},"sprouts":{"title":"Sprouting","artist":"","lic":"CC BY-SA 3.0"},"chicken-tikka":{"title":"Chicken tikka","artist":"kspoddar","lic":"CC BY-SA 2.0"},"dhokla":{"title":"Dhokla","artist":"Samirluhar99","lic":"CC BY-SA 4.0"},"lassi":{"title":"Lassi","artist":"Raksanand","lic":"CC BY-SA 4.0"},"coconut-water":{"title":"Coconut water","artist":"Shameelnurani313","lic":"CC BY-SA 4.0"},"sweet-potato":{"title":"Sweet potato","artist":"Llez","lic":"CC BY-SA 3.0"},"smoothie":{"title":"Smoothie","artist":"rawpixel.com","lic":"CC0"},"orange":{"title":"Orange (fruit)","artist":"Ivar Leidus","lic":"CC BY-SA 4.0"},"mango":{"title":"Mango","artist":"Ivar Leidus","lic":"CC BY-SA 4.0"},"aloo-gobi":{"title":"Aloo gobhi","artist":"Sapanabehl","lic":"CC BY-SA 4.0"},"baingan-bharta":{"title":"Baingan bharta","artist":"Dheerajk88","lic":"CC BY-SA 4.0"},"tandoori-chicken":{"title":"Tandoori chicken","artist":"kspoddar","lic":"CC BY-SA 2.0"},"biryani":{"title":"Biryani","artist":"Mahi Tatavarty","lic":"CC BY-SA 4.0"},"omelette":{"title":"Omelette","artist":"Guilhem Vellut from Annecy, France","lic":"CC BY 2.0"},"avocado-toast":{"title":"Avocado toast","artist":"Bex Walton from London, England","lic":"CC BY 2.0"},"hummus":{"title":"Hummus","artist":"Beyrouthhh at English Wikipedia","lic":"CC BY 3.0"}};
const MEAL_KEY={breakfast:'b',lunch:'l',snacks:'s',dinner:'d'};
let curatedMeal=null;
function curFood(i){const c=CURATED[i];if(!c)return null;return allFoods().find(f=>f.name===c[0])||null;}
function curDefG(f){const u=COUNTABLE_UNITS[f.id];return u?u.g:(typeof defQty==='function'?defQty(f):100);}
function curatedHTML(){
  const meal=curatedMeal||autoMeal(), k=MEAL_KEY[meal], g=targets(), left=g.has?g.cal-totals(selDate).cal:null;
  const day=new Date().getDate()+new Date().getMonth()*31;
  let list=CURATED.map((c,i)=>({c,i,f:curFood(i)})).filter(x=>x.f&&x.c[2].indexOf(k)>=0);
  list.forEach(x=>{x.kc=Math.round(x.f.cal*curDefG(x.f)/100);x.r=((x.i*37+day*17+meal.length*7)%97);});
  list.sort((a,b)=>{const fa=left!=null&&a.kc<=Math.max(left*0.85,180)?0:1,fb=left!=null&&b.kc<=Math.max(left*0.85,180)?0:1;return fa-fb||a.r-b.r;});
  list=list.slice(0,10);
  const mn=(MEALS.find(m=>m.id===meal)||{}).n||'';
  let h='<div class="cu"><div class="cu-h"><div><h3>🍽️ Curated for you</h3><span>Hand-picked '+esc(mn.toLowerCase())+' ideas'+(left!=null&&left>0?' · '+Math.round(left)+' kcal left today':'')+'</span></div><button class="cu-cr" data-act="curCredits" aria-label="Photo credits">📷</button></div>'+
    '<div class="cu-ch">'+MEALS.map(m=>'<button class="'+(m.id===meal?'on':'')+'" data-act="curMeal" data-m="'+m.id+'">'+m.e+' '+m.n+'</button>').join('')+'</div><div class="cu-row">';
  h+=list.map(x=>{const f=x.f,gm=curDefG(f),r=gm/100,u=COUNTABLE_UNITS[f.id],nm=f.name.replace(/\s*\(.*?\)/g,'');
    return '<div class="cu-card" data-act="curAdd" data-i="'+x.i+'"><div class="cu-img"><img loading="lazy" src="foodimg/'+x.c[1]+'.jpg" alt="'+esc(nm)+'" onerror="this.style.display=\'none\'"><span class="cu-kcal">'+x.kc+' kcal</span><span class="cu-tag">'+esc(x.c[3])+'</span></div>'+
      '<div class="cu-b"><b>'+esc(nm)+'</b><small>'+(u?'1 '+esc(u.label.replace(/\s*\(.*?\)/g,'')):Math.round(gm)+(isLiquid(f)?' ml':' g'))+'</small><div class="cu-m"><i class="p">P '+r1(f.prot*r)+'</i><i class="c">C '+r1(f.carb*r)+'</i><i class="f">F '+r1(f.fat*r)+'</i></div>'+
      '<span class="cu-add">＋ Add</span></div></div>';}).join('');
  return h+'</div></div>';
}
function curatedAdd(i){
  const food=curFood(i);if(!food)return;const meal=curatedMeal||autoMeal();
  openQty(food,(grams)=>{const before=totals(selDate).cal;addFoodToLog(foodItem(food,grams),meal,selDate);closeAllSheets();afterFoodLogged(before,selDate);});
}
function curatedCredits(){
  const rows=Object.keys(CURATED_CREDITS).map(k=>{const c=CURATED_CREDITS[k];return '<div class="foodrow"><div class="fi"><b>'+esc(c.title)+'</b><span>'+esc(c.artist||'Wikimedia Commons')+' · '+esc(c.lic)+'</span></div></div>';}).join('');
  openSheet(sheetHead('📷 Photo credits')+'<div class="sb"><div class="sub">Food photos from Wikimedia Commons, used under their open licences (CC BY / CC BY-SA / public domain).</div>'+rows+'</div>');
}

/* ───────── what's new + update available ───────── */
const WHATS_NEW={name:'5.3',title:'What\'s new in this version',items:[
  ['🍽️','Curated meals with photos','Hand-picked breakfast, lunch, snack and dinner ideas right on your dashboard — tap to add.'],
  ['🥘','300+ new foods','Biscuits, namkeen & chana, sabzi and dal in katori, roti & paratha by number.'],
  ['☕','Tea, drinks & liquor in ml','Chai with or without sugar or gurh, whisky, beer, coffee, juices — all measured in ml.'],
  ['⚡','Zero-sugar & energy drinks','Coke Zero, Diet Coke, Pepsi Zero, Red Bull, Monster, Hell and more.'],
  ['🔔','Update alerts','You will now be told about new versions as soon as they are ready.']]};
function updSheet(title,sub,items,btns){
  closeUpd();
  const ov=openSheet('<div class="sb upd"><div class="upd-top"><div class="upd-ic">✨</div><h2>'+esc(title)+'</h2><p>'+esc(sub)+'</p></div><div class="upd-list">'+items.map(i=>'<div class="upd-it"><i>'+i[0]+'</i><div><b>'+esc(i[1])+'</b><span>'+esc(i[2])+'</span></div></div>').join('')+'</div><div class="upd-btns">'+btns+'</div></div>');
  ov.id='updOv';return ov;
}
function closeUpd(){const o=document.getElementById('updOv');if(o){o.remove();const i=sheets.indexOf(o);if(i>=0)sheets.splice(i,1);}}
function showWhatsNew(){
  updSheet(WHATS_NEW.title,'Version '+((window.AndroidApp&&AndroidApp.appVersion&&AndroidApp.appVersion())||WHATS_NEW.name),WHATS_NEW.items,'<button class="btn" data-act="updClose">Got it — let\'s go</button>');
}
function ctUpdateTick(){
  try{
    if(!window.AndroidApp||!AndroidApp.updateState)return;
    const s=AndroidApp.updateState();
    if(s==='downloaded'){
      if(window._updDlShown)return;window._updDlShown=1;
      updSheet('Update ready to install','Restart the app to finish updating.',[['✅','Downloaded','The new version is ready. It takes a few seconds to restart.']],'<button class="btn" data-act="updRestart">Restart now</button><button class="btn ghost" data-act="updClose">Later</button>');
    }else if(s.indexOf('available:')===0){
      const code=s.split(':')[1];if(lsGet('ct_upd_later')===code&&Date.now()-(+lsGet('ct_upd_laterAt')||0)<864e5)return;
      const show=items=>updSheet('A new update is available','Get the latest features and fixes.',items,'<button class="btn" data-act="updNow">⬇ Update now</button><button class="btn ghost" data-act="updLater" data-c="'+code+'">Later</button>');
      fetch('ct-whatsnew.json?ts='+Math.floor(Date.now()/36e5),{cache:'no-store'}).then(r=>r.json()).then(j=>show((j.items&&j.items.length?j.items:WHATS_NEW.items))).catch(()=>show(WHATS_NEW.items));
    }
  }catch(e){}
}
function ctVersionCheck(){
  try{
    if(!window.AndroidApp||!AndroidApp.appVersion)return;const v=AndroidApp.appVersion(),seen=lsGet('ct_seenver');
    if(seen!==v){lsSet('ct_seenver',v);if(seen)setTimeout(showWhatsNew,2200);}
  }catch(e){}
}
setTimeout(()=>{ctVersionCheck();ctUpdateTick();},3200);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(ctUpdateTick,1500);});
