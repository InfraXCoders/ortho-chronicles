/* Food of the Day — healthy foods, per 100 g, with brief benefits */
const FOTD=[
 {e:'🌰',n:'Almonds (Badam)',s:'Handful ≈ 28 g',c:579,p:21.2,cb:21.6,f:49.9,b:'Rich in vitamin E, magnesium and healthy fats — supports heart health, skin glow and steady energy. Soak overnight for easier digestion.'},
 {e:'🥜',n:'Walnuts (Akhrot)',s:'4–5 halves ≈ 28 g',c:654,p:15.2,cb:13.7,f:65.2,b:'Best nut source of plant omega-3 (ALA). Linked with better brain function, lower LDL cholesterol and reduced inflammation.'},
 {e:'🥬',n:'Spinach (Palak)',s:'1 cup cooked ≈ 180 g',c:23,p:2.9,cb:3.6,f:0.4,b:'Loaded with iron, folate, vitamin K and lutein. Great for blood health, bones and eyes — pair with lemon to absorb more iron.'},
 {e:'🥦',n:'Broccoli',s:'1 cup ≈ 90 g',c:34,p:2.8,cb:6.6,f:0.4,b:'Packed with vitamin C, fibre and sulforaphane, a compound studied for cell protection. Lightly steam to keep nutrients.'},
 {e:'🍠',n:'Sweet Potato (Shakarkand)',s:'1 medium ≈ 130 g',c:86,p:1.6,cb:20.1,f:0.1,b:'Slow-release carbs plus beta-carotene (vitamin A). Keeps you full, supports vision and immunity. Great pre-workout food.'},
 {e:'🥣',n:'Rolled Oats',s:'½ cup dry ≈ 40 g',c:389,p:16.9,cb:66.3,f:6.9,b:'High in beta-glucan fibre that helps lower cholesterol and keeps blood sugar steady. A filling, heart-friendly breakfast.'},
 {e:'🍚',n:'Quinoa (cooked)',s:'1 cup ≈ 185 g',c:120,p:4.4,cb:21.3,f:1.9,b:'A complete plant protein with all essential amino acids, plus magnesium and fibre. Gluten-free grain alternative.'},
 {e:'🥛',n:'Curd (Dahi)',s:'1 bowl ≈ 150 g',c:61,p:3.5,cb:4.7,f:3.3,b:'Probiotic-rich for gut health, with calcium and protein. Supports digestion and cools the body — best eaten fresh.'},
 {e:'🧀',n:'Paneer',s:'50 g cube',c:265,p:18,cb:1.2,f:20.8,b:'Great vegetarian protein and calcium source for muscles and bones. Low in carbs — pair with veggies for a balanced meal.'},
 {e:'🥚',n:'Boiled Egg',s:'1 large ≈ 50 g',c:155,p:12.6,cb:1.1,f:10.6,b:'High-quality protein with choline for brain health, vitamin D and B12. One of the most nutrient-dense everyday foods.'},
 {e:'🌱',n:'Moong Sprouts',s:'1 cup ≈ 100 g',c:30,p:3,cb:5.9,f:0.2,b:'Sprouting boosts vitamin C and enzyme availability. Low calorie, high fibre — ideal for weight loss and digestion.'},
 {e:'🫘',n:'Chickpeas (Boiled Chana)',s:'½ cup ≈ 80 g',c:164,p:8.9,cb:27.4,f:2.6,b:'Plant protein plus fibre and folate. Keeps hunger away for hours and supports healthy blood-sugar control.'},
 {e:'🍌',n:'Banana',s:'1 medium ≈ 118 g',c:89,p:1.1,cb:22.8,f:0.3,b:'Potassium-rich for heart and muscle function; quick natural energy. Ideal before or after exercise.'},
 {e:'🍈',n:'Papaya',s:'1 cup cubes ≈ 145 g',c:43,p:0.5,cb:10.8,f:0.3,b:'Contains papain enzyme that aids digestion, plus vitamin C and A. Gentle on the stomach and great for skin.'},
 {e:'🍏',n:'Guava (Amrood)',s:'1 medium ≈ 100 g',c:68,p:2.6,cb:14.3,f:1,b:'Has about 4× the vitamin C of an orange, plus high fibre. Boosts immunity and helps regulate digestion.'},
 {e:'🍊',n:'Orange (Santra)',s:'1 medium ≈ 130 g',c:47,p:0.9,cb:11.8,f:0.1,b:'Vitamin C for immunity and collagen, plus hydrating water and fibre. Eat the whole fruit rather than juice.'},
 {e:'🫒',n:'Amla (Indian Gooseberry)',s:'1–2 fruits ≈ 50 g',c:44,p:0.9,cb:10.2,f:0.6,b:'One of the richest natural sources of vitamin C and antioxidants. Traditionally used for immunity, hair and digestion.'},
 {e:'🍎',n:'Pomegranate (Anar)',s:'½ cup seeds ≈ 87 g',c:83,p:1.7,cb:18.7,f:1.2,b:'Polyphenol antioxidants support heart health and blood flow. Sweet, hydrating and rich in vitamin K and fibre.'},
 {e:'🫐',n:'Blueberries',s:'1 cup ≈ 148 g',c:57,p:0.7,cb:14.5,f:0.3,b:'Anthocyanin antioxidants linked with better memory and brain ageing. Low calorie, high in vitamin C.'},
 {e:'🍏',n:'Apple (Seb)',s:'1 medium ≈ 180 g',c:52,p:0.3,cb:13.8,f:0.2,b:'Pectin fibre feeds good gut bacteria and keeps you full. Eat with the skin for most of the antioxidants.'},
 {e:'🟣',n:'Beetroot',s:'1 medium ≈ 80 g',c:43,p:1.6,cb:9.6,f:0.2,b:'Natural nitrates can help lower blood pressure and improve stamina. Rich in folate and iron.'},
 {e:'🥕',n:'Carrot (Gajar)',s:'1 medium ≈ 60 g',c:41,p:0.9,cb:9.6,f:0.2,b:'Beta-carotene converts to vitamin A for sharp vision and healthy skin. Crunchy, low-calorie snack.'},
 {e:'🍅',n:'Tomato',s:'1 medium ≈ 120 g',c:18,p:0.9,cb:3.9,f:0.2,b:'Lycopene antioxidant (better absorbed when cooked with a little oil) supports heart and skin health.'},
 {e:'🥒',n:'Cucumber (Kheera)',s:'1 cup sliced ≈ 120 g',c:15,p:0.7,cb:3.6,f:0.1,b:'96% water — superb for hydration and very low calorie. Keeps you cool and curbs mindless snacking.'},
 {e:'🥑',n:'Avocado',s:'½ fruit ≈ 100 g',c:160,p:2,cb:8.5,f:14.7,b:'Monounsaturated fats, potassium and fibre. Supports heart health and helps absorb fat-soluble vitamins.'},
 {e:'🌾',n:'Flaxseeds (Alsi)',s:'1 tbsp ≈ 10 g',c:534,p:18.3,cb:28.9,f:42.2,b:'Top plant source of omega-3 plus lignans and fibre. Grind before eating to unlock the benefits.'},
 {e:'⚫',n:'Chia Seeds',s:'1 tbsp ≈ 12 g',c:486,p:16.5,cb:42.1,f:30.7,b:'Packed with fibre, omega-3 and calcium. Absorbs water to form a gel that keeps you full — great in drinks and puddings.'},
 {e:'🥜',n:'Peanuts (Moongphali)',s:'Handful ≈ 30 g',c:567,p:25.8,cb:16.1,f:49.2,b:'An affordable protein and healthy-fat snack with niacin and vitamin E. Keep portions to a handful.'},
 {e:'🍲',n:'Masoor Dal (cooked)',s:'1 katori ≈ 150 g',c:116,p:9,cb:20.1,f:0.4,b:'Easy-to-digest protein with iron and folate. A staple for muscle building and healthy blood.'},
 {e:'🫘',n:'Rajma (boiled)',s:'½ cup ≈ 90 g',c:127,p:8.7,cb:22.8,f:0.5,b:'Fibre and protein with slow carbs that keep blood sugar steady. Rich in iron, potassium and folate.'},
 {e:'🐟',n:'Rohu Fish (cooked)',s:'1 piece ≈ 100 g',c:97,p:16,cb:0,f:3.2,b:'Lean protein with omega-3 and vitamin B12. Supports heart and brain health.'},
 {e:'🍗',n:'Chicken Breast (grilled)',s:'1 piece ≈ 120 g',c:165,p:31,cb:0,f:3.6,b:'The leanest high-protein meat — ideal for muscle repair and fat loss. Grill or bake rather than deep-fry.'},
 {e:'🥥',n:'Coconut Water',s:'1 glass ≈ 250 ml',c:19,p:0.7,cb:3.7,f:0.2,b:'Natural electrolytes (potassium, magnesium) for rehydration after heat or exercise, with far less sugar than soft drinks.'},
 {e:'🌾',n:'Ragi (Finger Millet)',s:'2 rotis flour ≈ 60 g',c:328,p:7.3,cb:72,f:1.3,b:'One of the richest plant sources of calcium and iron. High fibre — great for bones, diabetics and weight control.'},
 {e:'🌾',n:'Jowar (Sorghum)',s:'2 rotis flour ≈ 60 g',c:349,p:10.4,cb:72.6,f:1.9,b:'Gluten-free millet with fibre, iron and antioxidants. Slow digestion keeps you full for longer.'},
 {e:'🌾',n:'Bajra (Pearl Millet)',s:'2 rotis flour ≈ 60 g',c:361,p:11.6,cb:67.5,f:5,b:'Warming winter grain rich in magnesium, iron and fibre. Supports heart health and steady energy.'},
 {e:'⚪',n:'Makhana (Fox Nuts)',s:'1 cup ≈ 30 g',c:347,p:9.7,cb:76.9,f:0.1,b:'Light, crunchy, low-fat snack with magnesium and potassium. A far healthier alternative to chips.'},
 {e:'🟤',n:'Dates (Khajoor)',s:'2–3 dates ≈ 25 g',c:277,p:1.8,cb:75,f:0.2,b:'Natural sugars with fibre, potassium and iron. A quick energy booster before workouts — keep to 2–3 a day.'},
 {e:'🎃',n:'Pumpkin Seeds',s:'1 tbsp ≈ 10 g',c:559,p:30,cb:10.7,f:49,b:'Rich in zinc, magnesium and plant protein. Supports immunity, sleep quality and prostate health.'}
];
function fotdToday(){
  const d=new Date(); const dn=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5);
  let r=(dn*2654435761)>>>0; r=(r^(r>>>15))>>>0;           // deterministic "random" per calendar day
  let i=r%FOTD.length;
  const y=(((dn-1)*2654435761)>>>0); const yi=((y^(y>>>15))>>>0)%FOTD.length;
  if(i===yi) i=(i+1)%FOTD.length;                          // never the same as yesterday
  return FOTD[i];
}
