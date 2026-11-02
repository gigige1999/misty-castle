/* =====================================================================
   第 5 关 · 肖像长廊（The Portrait Gallery）—— 场景美术
   参考图：一点透视长廊 / 左墙挂满家族画像 / 右墙盔甲持矛 + 拱门 / 红色长地毯 / 尽头月光
   本作调整：尽头墙挂母亲画像，圆窗里嵌着收获月；左墙画像下方有一条可滑动的烛台轨道（侧光光源）
   ===================================================================== */
const g5k = 'stroke="#1a1511" stroke-width="2" stroke-linejoin="round"';
const g5s = 'stroke="#1a1511" stroke-width="1.3" stroke-linejoin="round"';
const g5l = 'stroke="#1d1914" stroke-width=".7" stroke-linejoin="round"';

/* ---------------- 透视：世界坐标 (X 左右, Y 上下, z 纵深) → 屏幕 ---------------- */
const G5 = {vx:414, vy:330, W:414, CEIL:-560, FLOOR:400, END:3.6};
const p5 = (X,Y,z)=>[G5.vx + X/z, G5.vy + Y/z];
const f5 = (X,Y,z)=>p5(X,Y,z).map(v=>v.toFixed(1)).join(',');
const pts5 = q => q.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ');
// 左墙四幅画像（按挂放位置 slot 0 = 入口最近 … slot 3 = 最靠尽头）
const PZ5 = [[1.14,1.42],[1.54,1.82],[1.96,2.26],[2.42,2.8]];
const PY5 = [-250,-20];
const SZ5 = PZ5.map(([a])=>+(a-.05).toFixed(2));     // 烛台停靠点：每幅画靠入口的一侧
const RAIL_Y5 = 22;
function frameQuad5(i, inset=0){
  const [a,b]=PZ5[i], dz=inset/600, Y0=PY5[0]+inset, Y1=PY5[1]-inset;
  return [p5(-414,Y0,a+dz), p5(-414,Y0,b-dz), p5(-414,Y1,b-dz), p5(-414,Y1,a+dz)];
}
// 画布局部坐标 100×140 → 左墙内框（仿射近似，配合裁剪）
function paintMatrix5(i){
  const [A,B,,D] = frameQuad5(i, 12);
  const a=(B[0]-A[0])/100, b=(B[1]-A[1])/100, d=(D[1]-A[1])/140;
  return `matrix(${a.toFixed(4)},${b.toFixed(4)},0,${d.toFixed(4)},${A[0].toFixed(1)},${A[1].toFixed(1)})`;
}
// 尽头墙：母亲画像内框（局部 104×156，缩放 .85）
const M5 = {x:369.8, y:244, k:.85};
// 画架（空白画布）· 盔甲 · 雄鹿门
const E5 = {x:325.5, y:483.8, k:1/2.6};
const A5 = {x:710.3, y:700.4, k:.926};
const D5 = {
  inner:'M650.6,558.6 L650.6,206 Q648,182 626.3,176.2 Q608,186 606.6,226 L606.6,516 Z',
  outer:'M657.5,565.3 L657.5,198 Q654,170 626,163 Q603,175 602.2,218 L602.2,511.8 Z',
  plate:p5(414,110,1.82)
};

/* ---------------- 画像数据（按年代 id 0..3） ---------------- */
// child：被涂掉的孩子所在的 x；item：侧光下孩子手里拿着的东西（第 8 关雕像谜题的答案）
const P5 = [
  {year:1316, born:1309, init:'A——', item:'wheat',  itemCn:'一束麦穗', bg:'#4c463a', floor:'#39332a', oak:0, raven:true,
   figs:[{x:24,kind:'man',cloth:'#3d3a30',beard:true,hair:'#4a3a2a'},{x:48,kind:'woman',cloth:'#5a4e3c',head:'wimple'}], child:73, kid:{body:'boy', cloth:'#5a5040', cape:'#6a5a40', hair:'boy'}},
  {year:1349, born:1342, init:'C——', item:'bell',   itemCn:'一只银铃', bg:'#4a4438', floor:'#37312a', oak:1,
   figs:[{x:23,kind:'woman',cloth:'#4a3f36',head:'veil'},{x:47,kind:'man',cloth:'#33352f',hair:'#2a2420',hat:'#2a2622'}], child:73, kid:{body:'girl', cloth:'#5a4a3c', hair:'braid', hairCol:'#6a4a30'}},
  {year:1382, born:1375, init:'H——', item:'mirror', itemCn:'一面小手镜', bg:'#4e4a3c', floor:'#3a362c', oak:2,
   figs:[{x:22,kind:'man',cloth:'#3a3028',beard:true,hair:'#3a2a1c'},{x:45,kind:'woman',cloth:'#3f4a3e',head:'roll'}], child:70, kid:{body:'boy', cloth:'#3e4436', cape:'#4a5040', hair:'boy'}},
  {year:1415, born:1408, init:'M——', item:'deer',   itemCn:'一只木鹿', bg:'#4a3e34', floor:'#382e26', oak:3,
   figs:[{x:17,kind:'oswald'},{x:37,kind:'isabel'},{x:85,kind:'boy',s:.8,hy:73,lamp:true}], child:61, kid:{who:'margery'}}
];
// 挂乱时每个人物的视线（-1 看左 … 1 看右）
const SCR5 = [[-.9,.5],[.8,-.8],[-.6,.9],[.7,-.9,-.4]];

/* ---------------- 画像组件 ---------------- */
function fig5(f, gz){
  // 画布局部 100×140；头部中心 (x, hy)，人物库单位 → 画布 .55（少年按 f.s 缩小）
  const k = .55*(f.s||1), hy = f.hy||56, face = {gaze:[(gz||0)*1.1, 0], eyes:'open'};
  let p;
  if(f.kind==='oswald') p = CH.preset.oswald({hairOpt:{beard:'short'}, cloth:'#4a1e1a', len:160, face:{...face, age:'adult', mood:'stern'}});
  else if(f.kind==='isabel') p = CH.preset.isabel({len:160, face:{...face, mood:'sad'}});
  else if(f.kind==='boy') p = CH.preset.edmundBoy({hold:'lamp', len:100, face:{...face}});
  else if(f.kind==='woman') p = {hair:'woman', hairOpt:{type:f.head}, body:'gown', cloth:f.cloth, sleeve:f.cloth, trim:'#8a7448', len:160, face:{...face, mood:'neutral'}};
  else p = {hair:'man', hairOpt:{col:f.hair, beard:f.beard, hat:f.hat}, body:'doublet', cloth:f.cloth, hold:'clasp', len:160, face:{...face, male:true, mood:'stern', stubble:!f.beard}};
  return `<g transform="translate(${f.x},${hy}) scale(${k.toFixed(3)})">${CH.person(p)}</g>`;
}
function oakWin5(stage, uid, raven){
  const win='M66,46 L66,18 Q66,8 79,6 Q92,8 92,18 L92,46 Z';
  const t='#4a3e30', leaf=['#56603c','#56603c','#4e5836','#465232'][stage];
  let oak='';
  if(stage===0) oak=`<path d="M83,40 V30" stroke="#6a5a40" stroke-width=".7"/><path d="M79,40.5 Q79.4,36 78.8,33" stroke="${t}" stroke-width=".8" fill="none"/>
      <ellipse cx="77.6" cy="33.4" rx="1.6" ry=".9" fill="${leaf}" transform="rotate(-25 77.6 33.4)"/><ellipse cx="80" cy="32.6" rx="1.6" ry=".9" fill="${leaf}" transform="rotate(25 80 32.6)"/>`;
  if(stage===1) oak=`<path d="M79,40.5 L79,29" stroke="${t}" stroke-width="1.6"/><circle cx="79" cy="26" r="5.6" fill="${leaf}" ${g5l}/>`;
  if(stage===2) oak=`<path d="M79,41 L79,24 M79,30 L74,26 M79,28 L84,24" stroke="${t}" stroke-width="3" fill="none"/>
      <ellipse cx="79" cy="19" rx="11.5" ry="9" fill="${leaf}" ${g5l}/><ellipse cx="74" cy="17" rx="4" ry="3" fill="#5e6a42"/>`;
  if(stage===3) oak=`<ellipse cx="78" cy="14" rx="22" ry="15" fill="${leaf}" ${g5l}/><ellipse cx="70" cy="11" rx="6" ry="4" fill="#536040"/>
      <path d="M80,42 Q77,32 79,22 M79,30 Q73,27 67,28" stroke="${t}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M70,28.6 V36 M74.4,28.2 V36" stroke="#2a2218" stroke-width=".5"/><path d="M69,36 H75.4" stroke="#6a5440" stroke-width="1.2"/>`;
  return `<g transform="translate(77.5,54) scale(1.3,1.2) translate(-79,-46)"><defs><clipPath id="g5w-${uid}"><path d="${win}"/></clipPath></defs>
    <path d="M64,48 L64,17 Q64,5 79,3.6 Q94,5 94,17 L94,48 Z" fill="#5a5446" ${g5l}/>
    <path d="${win}" fill="#9aa29c"/>
    <g clip-path="url(#g5w-${uid})"><path d="M66,40.5 Q79,37.5 92,40.5 V46 H66 Z" fill="#6e7458"/>${oak}</g>
    <path d="M79,6 V46 M66,27 H92" stroke="#2e2820" stroke-width="1"/>
    <path d="${win}" fill="none" ${g5l}/>
    <rect x="63" y="46" width="32" height="3" fill="#5e5648" ${g5l}/>
    ${raven ? `<use href="#sym-raven" x="84" y="39" width="8" height="8" style="color:#15110d"/>` : ''}</g>`;
}
function item5(k, x, y){
  if(k==='wheat') return `<g fill="#e6c25a"><path d="M${x+2},${y+9} L${x+4},${y-9}" stroke="#e6c25a" stroke-width=".8" fill="none"/>
    ${[0,1,2,3].map(i=>`<ellipse cx="${(x+3.7-i*.25).toFixed(2)}" cy="${y-8+i*2.6}" rx=".95" ry="1.7" transform="rotate(${i%2?28:-28} ${(x+3.7-i*.25).toFixed(2)} ${y-8+i*2.6})"/>`).join('')}</g>`;
  if(k==='bell') return `<g fill="#dcdcd0" stroke="#f6f2e4" stroke-width=".45"><path d="M${x-3.2},${y+3} Q${x-3.2},${y-3.2} ${x},${y-3.6} Q${x+3.2},${y-3.2} ${x+3.2},${y+3} Z"/>
    <rect x="${x-.6}" y="${y-6.2}" width="1.2" height="2.8"/><circle cx="${x}" cy="${y+3.9}" r=".9"/></g>`;
  if(k==='mirror') return `<g stroke="#f6f2e4" stroke-width=".6"><path d="M${x+1.6},${y} L${x+.4},${y+6.5}" stroke-width="1.3"/><ellipse cx="${x+2.2}" cy="${y-3.4}" rx="2.8" ry="3.4" fill="#c8d6da"/></g>`;
  if(k==='deer') return `<use href="#deer" x="${x-6.5}" y="${y-9}" width="13" height="13" style="color:#d8b07a"/>`;
  return '';
}
function childPatch5(x){
  return `<path d="M${x-11},80 Q${x-5},70 ${x+5},73 Q${x+13},77 ${x+12},92 L${x+14},118 Q${x+13},136 ${x},139.5 Q${x-14},137 ${x-13},117 L${x-14},93 Q${x-15},82 ${x-11},80 Z" fill="#26211c" stroke="#15110d" stroke-width=".6"/>
    <path d="M${x-9},84 l16,-6 M${x-11},96 l22,-7 M${x-12},108 l24,-8 M${x-12},120 l24,-8 M${x-10},131 l20,-7" stroke="#38312a" stroke-width="1.6" stroke-linecap="round"/>`;
}
// 侧光下浮现的孩子轮廓（face：1415 那幅能看清脸）
// 侧光下浮现的孩子（厚涂下的浮雕）：1415 那幅能看清脸
function childGhost5(id, x, face){
  const kd = P5[id].kid, k = .44, hy = 86;
  const item = P5[id].item, hold = item==='deer' ? 'deer' : item;
  const p = kd.who==='margery'
    ? CH.preset.margery({hold, len:120, face:{eyes:'open', mood:'blank'}})
    : {hair:kd.hair, hairOpt:kd.hairCol ? {col:kd.hairCol, dk:'#3e2a1c'} : {}, body:kd.body, cloth:kd.cloth, cape:kd.cape, len:kd.body==='girl'?120:118,
       hold, heldPos: kd.body==='boy' ? [12.6, 44] : [0, 40], face:{age:'child', male:kd.body==='boy', mood:'blank', eyes:'open'}};
  return `<g transform="translate(${x},${hy}) scale(${k})" ${face ? 'id="z-face-art"' : `filter="url(#chRelief)" opacity=".86"`}>${CH.person(p)}</g>`;
}
function portraitArt5(id, o={}){
  const P=P5[id], gz=o.gaze||[];
  let s=`<rect width="100" height="140" fill="${P.bg}"/>
    <rect y="112" width="100" height="28" fill="${P.floor}"/><path d="M0,112 H100" stroke="#1d1914" stroke-width=".6"/>
    <path d="M4,20 Q20,16 34,22 M8,62 Q24,58 30,64 M40,98 q12,-3 22,1 M6,124 q20,-3 40,1" stroke="#5e5648" stroke-width="1.2" fill="none" opacity=".55"/>`;
  s+=oakWin5(P.oak, o.uid||'x', P.raven);
  P.figs.forEach((f,i)=> s+=fig5(f, gz[i]));
  s+=childPatch5(P.child);
  if(o.revealed) s+=childGhost5(id, P.child, o.face);
  return s;
}

/* ---------------- 母亲画像（局部 104×156） ---------------- */
function motherArt5(o={}){
  // 局部 104×156；头部中心 (52,50)，人物库单位 → 1.2
  const pt = o.pointing;
  return `<rect width="104" height="156" fill="#2f2620"/>
    <rect width="104" height="156" fill="url(#chDown)" opacity=".6"/>
    <use href="#deer" x="6" y="8" width="22" height="22" style="color:#4a3a2c"/>
    <path d="M0,118 Q52,110 104,118" stroke="#3a3028" stroke-width="1" fill="none"/>
    <g transform="translate(52,50) scale(1.2)">${CH.draw('isabel', {hold: pt ? 'point' : 'clasp', len:100,
      face: pt ? {eyes:'open', gaze:[.7,.6], mood:'sad'} : {eyes:'down', mood:'sad'}})}</g>`;
}
/* ---------------- 滑动烛台（局部：原点在墙上的轨道卡扣） ---------------- */
function sconceArt5(lit){
  return `<g ${g5s}>
    <rect x="-7" y="-9" width="12" height="20" fill="#2a2420"/><circle cx="-1" cy="-5" r="2" fill="#4a4038"/><circle cx="-1" cy="7" r="2" fill="#4a4038"/>
    <path d="M4,2 Q30,2 40,-40" stroke="#2a2420" stroke-width="5" fill="none"/>
    <path d="M28,-26 Q18,-60 32,-96 L37,-94 Q25,-60 34,-30 Z" fill="#3a3430"/>
    <ellipse cx="40" cy="-42" rx="9" ry="3.2" fill="#3a3430"/>
    <rect x="36" y="-70" width="8" height="28" fill="#e3dac0"/>
    <path d="M40,-70 V-75" stroke="#15110d" stroke-width="1.4"/>
    ${lit?`<path class="flame" d="M40,-92 Q46,-82 44,-77 Q40,-72 36,-77 Q34,-82 40,-92 Z" fill="#ffd27a" stroke="none"/>`:''}</g>`;
}

/* ---------------- 盔甲（局部：原点在底座正中） ---------------- */
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="a5St" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3c3f3c"/><stop offset=".28" stop-color="#7e827c"/><stop offset=".42" stop-color="#a9ada4"/><stop offset=".6" stop-color="#6c706a"/><stop offset="1" stop-color="#363836"/></linearGradient>
  <linearGradient id="a5Dk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c2e2c"/><stop offset=".4" stop-color="#5c605a"/><stop offset="1" stop-color="#262826"/></linearGradient>
  <linearGradient id="a5Stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a665a"/><stop offset="1" stop-color="#4a463e"/></linearGradient>
</defs></svg>`);
function armorArt5(visorUp){
  const st='url(#a5St)', dk='url(#a5Dk)', hl='stroke="#c4c8be" stroke-width="1.6" fill="none" opacity=".55"', rv=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#2a2c2a" stroke="none"/>`;
  const lame=(y,w,h)=>`<path d="M${-w},${y} Q0,${y+5} ${w},${y} L${w-2},${y+h} Q0,${y+h+5} ${-w+2},${y+h} Z" fill="${st}"/>`;
  const leg=s=>`<g transform="scale(${s},1)">
      <path d="M8,-182 L30,-182 L28,-156 L10,-156 Z" fill="${st}"/>
      <path d="M8,-158 Q19,-166 30,-158 L30,-140 Q19,-132 8,-140 Z" fill="${dk}"/><circle cx="19" cy="-149" r="5" fill="${st}"/>
      <path d="M31,-154 l9,6 l-9,6 Z" fill="${dk}" stroke-width="1.2"/>
      <path d="M10,-140 L28,-140 Q31,-122 26,-104 L12,-104 Q7,-122 10,-140 Z" fill="${st}"/><path d="M14,-136 Q12,-122 15,-108" ${hl}/>
      <path d="M6,-104 L30,-104 L34,-96 L44,-92 L4,-92 Z" fill="${dk}"/><path d="M12,-100 H34" stroke-width="1"/></g>`;
  const arm=s=>`<g transform="scale(${s},1)">
      <path d="M40,-286 L56,-286 L57,-248 L41,-248 Z" fill="${st}"/>
      <ellipse cx="49" cy="-244" rx="10" ry="8" fill="${dk}"/><path d="M57,-250 l8,6 l-8,6 Z" fill="${dk}" stroke-width="1.2"/>
      <path d="M41,-240 L57,-240 L58,-210 L42,-210 Z" fill="${st}"/><path d="M45,-236 V-214" ${hl}/></g>`;
  return `<g ${g5k}>
    <path d="M58,-30 V-560" stroke="#2a2018" stroke-width="8"/><path d="M58,-30 V-560" stroke="#5a4632" stroke-width="4"/>
    <path d="M58,-612 Q50,-586 48,-560 L68,-560 Q66,-586 58,-612 Z" fill="${st}"/><path d="M58,-604 V-566" stroke="#c4c8be" stroke-width="1" opacity=".6"/>
    <path d="M48,-558 H68 M50,-550 H66" stroke-width="4"/>
    <path d="M58,-548 q-14,10 -10,34 q4,-14 10,-18 q6,4 10,18 q4,-24 -10,-34 Z" fill="#6a2420" stroke-width="1.2"/>
    <rect x="-72" y="-94" width="144" height="16" fill="url(#a5Stone)"/><path d="M-72,-90 H72" stroke="#8a8676" stroke-width="1" opacity=".6"/>
    <rect x="-62" y="-78" width="124" height="78" fill="url(#a5Stone)"/><path d="M-62,-40 H62 M-20,-78 V-40 M24,-40 V0" stroke="#3a372f" stroke-width="1.5"/>
    <path d="M-52,-68 h20 M30,-30 h18" stroke="#7a766a" stroke-width="1" opacity=".5"/>
    ${leg(-1)}${leg(1)}
    ${lame(-208,42,10)}${lame(-198,40,10)}${lame(-188,38,9)}
    <path d="M-38,-186 L-30,-160 L-8,-160 L-8,-186 Z M38,-186 L30,-160 L8,-160 L8,-186 Z" fill="${dk}"/>
    ${arm(-1)}${arm(1)}
    <path d="M-60,-212 Q-62,-196 -52,-190 Q-40,-192 -40,-210 Z" fill="${dk}"/><path d="M-58,-204 h14 M-58,-198 h14" stroke-width="1"/>
    <path d="M44,-212 L64,-212 Q68,-200 62,-188 L46,-188 Q40,-200 44,-212 Z" fill="${dk}"/><path d="M48,-206 H64 M48,-198 H64" stroke-width="1"/>
    <path d="M-36,-300 Q-48,-252 -34,-212 L34,-212 Q48,-252 36,-300 Q0,-314 -36,-300 Z" fill="${st}"/>
    <path d="M0,-306 V-214" stroke="#2a2c2a" stroke-width="1.4"/><path d="M-2,-304 V-216" stroke="#c4c8be" stroke-width="1" opacity=".5"/>
    <path d="M-34,-246 Q0,-232 34,-246" stroke-width="1.6" fill="none"/>
    <path d="M-26,-294 Q-34,-262 -24,-224" ${hl}/>
    ${rv(-30,-290)}${rv(30,-290)}${rv(-28,-220)}${rv(28,-220)}
    <path d="M-38,-216 H38 V-208 H-38 Z" fill="#3a2a1e"/><rect x="-6" y="-218" width="12" height="12" fill="none" stroke="#a88a4e" stroke-width="2"/>
    <path d="M-62,-284 Q-64,-310 -36,-312 Q-22,-306 -24,-290 Q-40,-282 -62,-284 Z" fill="${st}"/>
    <path d="M-64,-276 Q-50,-270 -36,-280 M-66,-268 Q-52,-262 -40,-270" stroke-width="1.4" fill="none"/>
    <path d="M62,-284 Q64,-310 36,-312 Q22,-306 24,-290 Q40,-282 62,-284 Z" fill="${st}"/>
    <path d="M64,-276 Q50,-270 36,-280 M66,-268 Q52,-262 40,-270" stroke-width="1.4" fill="none"/>
    <path d="M-24,-302 L24,-302 L22,-312 L-22,-312 Z" fill="${dk}"/><path d="M-22,-307 H22" stroke-width="1"/>
    <path d="M-22,-310 L-23,-350 Q-22,-376 0,-378 Q22,-376 23,-350 L22,-310 Q0,-302 -22,-310 Z" fill="${st}"/>
    <path d="M0,-378 V-354" stroke-width="2"/><path d="M-12,-370 Q-18,-358 -17,-346" ${hl}/>
    ${visorUp
      ? `<path d="M-19,-352 L19,-352 L17,-318 Q0,-312 -17,-318 Z" fill="#0d0b09"/>
         <path d="M-23,-392 Q0,-400 23,-392 L21,-362 Q0,-356 -21,-362 Z" fill="${st}"/><path d="M-20,-376 H20" stroke="#0d0b09" stroke-width="3"/>`
      : `<path d="M-21,-354 Q0,-360 21,-354 L19,-318 Q0,-310 -19,-318 Z" fill="${st}"/>
         <path d="M-18,-341 H18" stroke="#0d0b09" stroke-width="5"/><path d="M-16,-347 Q0,-350 16,-347" stroke="#c4c8be" stroke-width="1" fill="none" opacity=".5"/>
         <path d="M5,-330 h2 M11,-330 h2 M5,-324 h2 M11,-324 h2 M-7,-330 h2 M-13,-330 h2" stroke-width="2"/>`}
    ${rv(-20,-336)}${rv(20,-336)}
    <path d="M2,-380 Q-14,-404 -34,-398 Q-20,-394 -12,-384" fill="#7a2a22" stroke-width="1.3"/></g>`;
}

/* ---------------- 画架 + 空白画布（局部：原点在地面正中） ---------------- */
function easelArt5(){
  return `<g ${g5k}>
    <path d="M0,4 L0,-288" stroke="#3a2e22" stroke-width="8"/>
    <path d="M-58,0 L-10,-306 M58,0 L10,-306" stroke="#5a4632" stroke-width="10" stroke-linecap="round"/>
    <rect x="-80" y="-276" width="160" height="150" fill="#e4ddcb"/>
    <path d="M-80,-276 L80,-276" stroke="#c9c1ac" stroke-width="3"/>
    <rect x="-16" y="-292" width="32" height="18" fill="#5a4632"/>
    <rect x="-74" y="-128" width="148" height="14" fill="#5a4632"/>
    <rect x="-22" y="-112" width="44" height="16" fill="#9a8450"/>
    <text x="0" y="-100" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="#2b251e" stroke="none">1448</text>
    <text x="52" y="-136" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="14" fill="#5a5448" stroke="none">Agnes</text></g>`;
}

/* ---------------- 雄鹿钥匙（局部：原点在钥匙中心） ---------------- */
function skeyArt5(){
  return `<g ${g5k}>
    <rect x="-4" y="-6" width="96" height="12" rx="3" fill="#a07a3e"/>
    <path d="M70,6 V22 H78 V14 H86 V6" fill="#a07a3e"/>
    <circle cx="-30" cy="0" r="28" fill="#a07a3e"/><circle cx="-30" cy="0" r="20" fill="#6a4a22"/>
    <use href="#deer" x="-48" y="-18" width="36" height="36" style="color:#d4b070" stroke="none"/></g>`;
}

/* ---------------- 背景 ---------------- */
function g5Background(){
  const L=(Y,z)=>f5(-414,Y,z), R=(Y,z)=>f5(414,Y,z), C=G5.CEIL, F=G5.FLOOR, E=G5.END;
  let floor=''; for(let X=-345; X<=345; X+=69) floor+=`<path d="M${f5(X,F,1)} L${f5(X,F,E)}"/>`;
  [1.2,1.5,1.9,2.4,3].forEach(z=> floor+=`<path d="M${f5(-414,F,z)} L${f5(414,F,z)}"/>`);
  let beams=''; [1.18,1.6,2.15,2.9].forEach(z=>{ const w=(16/z).toFixed(1);
    beams+=`<path d="M${L(C,z)} L${R(C,z)}" stroke="#2a221b" stroke-width="${w}"/>
      <path d="M${L(C,z)} Q${f5(0,C-120,z)} ${R(C,z)}" stroke="#2a221b" stroke-width="${(w*.6).toFixed(1)}" fill="none"/>`; });
  let lJoints='', rJoints=''; [-460,-360,-260,-160,-60,40,140].forEach(Y=>{ lJoints+=`<path d="M${L(Y,1)} L${L(Y,E)}"/>`; rJoints+=`<path d="M${R(Y,1)} L${R(Y,E)}"/>`; });
  const wainL=`${L(250,1)} ${L(250,E)} ${L(F,E)} ${L(F,1)}`, wainR=`${R(250,1)} ${R(250,E)} ${R(F,E)} ${R(F,1)}`;
  let wPanels=''; [1.3,1.7,2.2,2.9].forEach(z=>{ wPanels+=`<path d="M${L(270,z)} L${L(385,z)} M${R(270,z)} L${R(385,z)}"/>`; });
  // 画框（外框；画面内容在动态层）
  let frames=''; for(let i=0;i<4;i++){ frames+=`<polygon points="${pts5(frameQuad5(i,0))}" fill="#6b5532"/>
      <polygon points="${pts5(frameQuad5(i,5))}" fill="none" stroke="#9a7e46" stroke-width="1.2"/>
      <polygon points="${pts5(frameQuad5(i,12))}" fill="#221c16"/>`;
    const zm=(PZ5[i][0]+PZ5[i][1])/2;
    frames+=`<path d="M${f5(-414,PY5[0],zm)} L${f5(-414,-470,zm)}" stroke="#1a1511" stroke-width="1"/>`; }
  // 长凳（左墙下）
  const bz0=1.12, bz1=1.62;
  const bench=`<polygon points="${f5(-408,150,bz0)} ${f5(-408,150,bz1)} ${f5(-408,270,bz1)} ${f5(-408,270,bz0)}" fill="#3a2c20"/>
    ${[1.2,1.32,1.45,1.56].map(z=>`<path d="M${f5(-408,160,z)} L${f5(-408,268,z)}" stroke="#241b13" stroke-width="2"/>`).join('')}
    <polygon points="${f5(-414,270,bz0)} ${f5(-310,270,bz0)} ${f5(-310,270,bz1)} ${f5(-414,270,bz1)}" fill="#5a4430"/>
    <polygon points="${f5(-310,270,bz0)} ${f5(-310,296,bz0)} ${f5(-310,296,bz1)} ${f5(-310,270,bz1)}" fill="#3e2e20"/>
    <path d="M${f5(-318,296,bz0+.03)} L${f5(-318,F,bz0+.03)} M${f5(-318,296,bz1-.03)} L${f5(-318,F,bz1-.03)}" stroke="#2e2218" stroke-width="7"/>
    <path d="M${f5(-408,150,bz0)} L${f5(-408,140,bz0)}" stroke="#2e2218" stroke-width="8" stroke-linecap="round"/>`;
  // 地毯
  const carpet=`<polygon points="${f5(-124,F,1)} ${f5(124,F,1)} ${f5(124,F,3.5)} ${f5(-124,F,3.5)}" fill="#5a2622"/>
    <polygon points="${f5(-104,F,1)} ${f5(104,F,1)} ${f5(104,F,3.45)} ${f5(-104,F,3.45)}" fill="none" stroke="#8a5a40" stroke-width="2" stroke-dasharray="6 4"/>
    <path d="M${f5(-124,F,1)} L${f5(-124,F,3.5)} M${f5(124,F,1)} L${f5(124,F,3.5)}" stroke="#2a1512" stroke-width="2"/>`;
  // 吊灯（没点）
  const cz=2.1, hang=p5(0,C,cz), ring=p5(0,-330,cz), rx=110/cz;
  const chand=`<path d="M${hang[0]},${hang[1]} V${ring[1]-24}" stroke="#15110d" stroke-width="2"/>
    <path d="M${ring[0]},${ring[1]-24} L${ring[0]-rx},${ring[1]} M${ring[0]},${ring[1]-24} L${ring[0]+rx},${ring[1]} M${ring[0]},${ring[1]-24} L${ring[0]-rx*.4},${ring[1]+5} M${ring[0]},${ring[1]-24} L${ring[0]+rx*.4},${ring[1]+5}" stroke="#15110d" stroke-width="1.2"/>
    <ellipse cx="${ring[0]}" cy="${ring[1]}" rx="${rx}" ry="7" fill="none" stroke="#15110d" stroke-width="4"/>
    ${[-1,-.6,-.2,.2,.6,1].map((t,i)=>{ const x=ring[0]+rx*t*.96, y=ring[1]+(i%2?1:-1)*7*Math.sqrt(Math.max(0,1-t*t));
      return `<rect x="${(x-2.4).toFixed(1)}" y="${(y-14).toFixed(1)}" width="4.8" height="12" fill="#cfc6ae" stroke="#15110d" stroke-width=".8"/>`; }).join('')}`;
  // 尽头墙：圆窗（收获月）
  const ocu=`<circle cx="414" cy="206" r="27" fill="#4a463c" ${g5s}/><circle cx="414" cy="206" r="21" fill="url(#g5-night)"/>
    <circle cx="420" cy="201" r="8.5" fill="#ebe8d8"/><circle cx="420" cy="201" r="16" fill="url(#g5-moonGlow)"/>
    <path d="M414,185 V227 M393,206 H435" stroke="#2a2620" stroke-width="2.4"/><circle cx="414" cy="206" r="21" fill="none" ${g5s}/>`;
  // 尽头墙：母亲画框
  const mf=`<rect x="360" y="234" width="108.2" height="152.6" fill="#7a6236" ${g5s}/>
    <rect x="364.5" y="238.5" width="99.2" height="143.6" fill="none" stroke="#a88a4e" stroke-width="1.2"/>
    <rect x="${M5.x}" y="${M5.y}" width="${(104*M5.k).toFixed(1)}" height="${(156*M5.k).toFixed(1)}" fill="#221c16"/>
    ${[[363,237],[465,237],[363,384],[465,384]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="#a88a4e" stroke="#1a1511" stroke-width=".8"/>`).join('')}`;
  // 右墙：雄鹿门 + 雄鹿旗
  const door=`<path d="${D5.outer}" fill="#5e594c" ${g5s}/>
    <path d="${D5.inner}" fill="#3e3024" ${g5s}/>
    ${[1.85,1.95,2.05].map(z=>`<path d="M${f5(414,-226,z)} L${f5(414,F,z)}" stroke="#2a2018" stroke-width="1.6"/>`).join('')}
    ${[30,260].map(Y=>`<path d="M${f5(414,Y,1.76)} L${f5(414,Y,2.14)}" stroke="#15110d" stroke-width="${(10/1.95).toFixed(1)}"/>`).join('')}
    <ellipse cx="${D5.plate[0].toFixed(1)}" cy="${D5.plate[1].toFixed(1)}" rx="5" ry="9" fill="#8a7448" stroke="#15110d" stroke-width="1"/>
    <path d="M${D5.plate[0].toFixed(1)},${(D5.plate[1]-3).toFixed(1)} v6" stroke="#15110d" stroke-width="2"/>`;
  const bq=[p5(414,-330,2.32), p5(414,-330,2.62), p5(414,-50,2.62), p5(414,-20,2.47), p5(414,-50,2.32)];
  const banner=`<path d="M${f5(414,-350,2.3)} L${f5(414,-350,2.64)}" stroke="#15110d" stroke-width="3"/>
    <polygon points="${pts5(bq)}" fill="#5a2622" ${g5s}/>
    <use href="#deer" x="-50" y="-50" width="100" height="100" style="color:#b39a5a" stroke="none" transform="matrix(${((bq[1][0]-bq[0][0])*.0085).toFixed(4)},${((bq[1][1]-bq[0][1])*.0085).toFixed(4)},0,.19,${((bq[0][0]+bq[1][0])/2).toFixed(1)},${((bq[0][1]+bq[1][1])/2+44).toFixed(1)})"/>`;
  // 左墙：烛台轨道
  const rail=`<path d="M${L(RAIL_Y5,1)} L${L(RAIL_Y5,3)}" stroke="#15110d" stroke-width="3"/>
    <path d="M${L(RAIL_Y5+9,1)} L${L(RAIL_Y5+9,3)}" stroke="#2a2420" stroke-width="1.6"/>
    ${[1.05,1.48,1.9,2.36,2.9].map(z=>`<path d="M${L(RAIL_Y5-4,z)} L${L(RAIL_Y5+12,z)}" stroke="#15110d" stroke-width="2"/>`).join('')}`;
  return `
  <defs>
    <filter id="g5-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="71" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="g5-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="17"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0 0.13  1.9 0 0 0 -0.8"/>
    </filter>
    <filter id="g5-blur"><feGaussianBlur stdDeviation="5"/></filter>
    <linearGradient id="g5-lw" x1="0" x2="1"><stop offset="0" stop-color="#5a5547"/><stop offset="1" stop-color="#4a463b"/></linearGradient>
    <linearGradient id="g5-rw" x1="1" x2="0"><stop offset="0" stop-color="#565144"/><stop offset="1" stop-color="#47443a"/></linearGradient>
    <linearGradient id="g5-floor" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3e352b"/><stop offset="1" stop-color="#2e2822"/></linearGradient>
    <linearGradient id="g5-ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1915"/><stop offset="1" stop-color="#2e2820"/></linearGradient>
    <linearGradient id="g5-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8d4dc" stop-opacity=".2"/><stop offset="1" stop-color="#c8d4dc" stop-opacity="0"/></linearGradient>
    <radialGradient id="g5-night"><stop offset="0" stop-color="#4a5868"/><stop offset="1" stop-color="#1e2630"/></radialGradient>
    <radialGradient id="g5-moonGlow"><stop offset="0" stop-color="#ebe8d8" stop-opacity=".55"/><stop offset="1" stop-color="#ebe8d8" stop-opacity="0"/></radialGradient>
    <radialGradient id="g5-moonOnWall"><stop offset="0" stop-color="#c8d4dc" stop-opacity=".16"/><stop offset="1" stop-color="#c8d4dc" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="828" height="709" fill="#1e1915"/>
  <g filter="url(#g5-rough)" ${g5s}>
    <polygon points="${L(C,1)} ${R(C,1)} ${R(C,E)} ${L(C,E)}" fill="url(#g5-ceil)" stroke="none"/>
    <g fill="none">${beams}</g>
    <polygon points="${L(C,1)} ${L(C,E)} ${L(F,E)} ${L(F,1)}" fill="url(#g5-lw)"/>
    <g stroke="#433f35" stroke-width="1" fill="none">${lJoints}</g>
    <polygon points="${R(C,1)} ${R(C,E)} ${R(F,E)} ${R(F,1)}" fill="url(#g5-rw)"/>
    <g stroke="#403c33" stroke-width="1" fill="none">${rJoints}</g>
    <rect x="${p5(-414,0,E)[0].toFixed(1)}" y="${p5(0,C,E)[1].toFixed(1)}" width="${(828/E).toFixed(1)}" height="${((F-C)/E).toFixed(1)}" fill="#4e4a3e"/>
    <polygon points="${wainL}" fill="#3a2f25"/><polygon points="${wainR}" fill="#382d23"/>
    <rect x="${p5(-414,0,E)[0].toFixed(1)}" y="${p5(0,250,E)[1].toFixed(1)}" width="${(828/E).toFixed(1)}" height="${((F-250)/E).toFixed(1)}" fill="#3a2f25"/>
    <g stroke="#2a221a" stroke-width="1.4" fill="none">${wPanels}</g>
    <path d="M${L(250,1)} L${L(250,E)} H${p5(414,250,E)[0].toFixed(1)} L${R(250,1)}" stroke="#55463a" stroke-width="2" fill="none"/>
    <polygon points="${L(F,1)} ${R(F,1)} ${R(F,E)} ${L(F,E)}" fill="url(#g5-floor)"/>
    <g stroke="#2a241e" stroke-width="1.2" fill="none">${floor}</g>
    ${carpet}
    ${ocu}
    ${mf}
    ${frames}
    ${rail}
    ${bench}
    ${door}
    ${banner}
    ${chand}
  </g>
  <rect width="828" height="709" filter="url(#g5-stain)" opacity=".45" pointer-events="none"/>
  <polygon points="402,226 426,226 520,709 300,709" fill="url(#g5-shaft)"/>
  <ellipse cx="414" cy="300" rx="80" ry="90" fill="url(#g5-moonOnWall)"/>
  <ellipse cx="414" cy="560" rx="120" ry="30" fill="#c8d4dc" opacity=".05" filter="url(#g5-blur)"/>
  <g transform="translate(${E5.x},${E5.y}) scale(${E5.k.toFixed(4)})">${easelArt5()}</g>`;
}

/* ---------------- 场景 DOM ---------------- */
document.getElementById('l4').insertAdjacentHTML('afterend', `
<div id="l5" class="lvroot hidden" data-level="L5">
  <svg id="g5Bg" viewBox="0 0 828 709" pointer-events="none">${g5Background()}</svg>
  <svg id="l5Obj" viewBox="0 0 828 709">
    <defs>
      ${[0,1,2,3].map(i=>`<clipPath id="g5c-${i}"><polygon points="${pts5(frameQuad5(i,12))}"/></clipPath>`).join('')}
      <clipPath id="g5c-m"><rect x="${M5.x}" y="${M5.y}" width="${(104*M5.k).toFixed(1)}" height="${(156*M5.k).toFixed(1)}"/></clipPath>
      <linearGradient id="g5-rake" x1="0" x2="1"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".42"/><stop offset=".55" stop-color="#ffb35a" stop-opacity=".1"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></linearGradient>
      <radialGradient id="g5-warm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <radialGradient id="g5-vig" cx="50%" cy="46%" r="72%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>
    </defs>
    <g id="l5Dyn" pointer-events="none"></g>
    <g id="g5Hot">
      ${[0,1,2,3].map(i=>`<polygon class="hs" data-obj="slot${i}" points="${pts5(frameQuad5(i,0))}"/>`).join('')}
      <rect class="hs" data-obj="mother" x="358" y="232" width="112" height="157"/>
      <rect class="hs" data-obj="easel" x="292" y="368" width="68" height="118"/>
      <path class="hs" data-obj="door" d="${D5.inner}"/>
      <polygon class="hs" data-obj="banner" points="${pts5([p5(414,-340,2.3),p5(414,-340,2.64),p5(414,-30,2.64),p5(414,-30,2.3)])}"/>
      <circle class="hs" data-obj="oculus" cx="414" cy="206" r="28"/>
      <rect class="hs" data-obj="chand" x="356" y="150" width="116" height="40"/>
      <polygon class="hs" data-obj="bench" points="${f5(-410,134,1.1)} ${f5(-410,134,1.64)} ${f5(-306,268,1.64)} ${f5(-314,400,1.6)} ${f5(-314,400,1.14)} ${f5(-412,330,1.1)}"/>
      <rect class="hs" data-obj="armor" x="${(A5.x-62).toFixed(0)}" y="${(A5.y-392*A5.k).toFixed(0)}" width="124" height="${(392*A5.k).toFixed(0)}"/>
      <rect class="hs" data-obj="armor" x="${(A5.x+44).toFixed(0)}" y="${(A5.y-604*A5.k).toFixed(0)}" width="24" height="${(214*A5.k).toFixed(0)}"/>
      <circle class="hs" data-obj="sconce" id="g5SconceHot" cx="0" cy="0" r="30"/>
    </g>
  </svg>
</div>`);
document.head.insertAdjacentHTML('beforeend', `<style>
  .g5roll{animation:g5roll .5s ease-out}
  @keyframes g5roll{from{opacity:.4}to{opacity:1}}
  .g5look circle{transition:cx .8s ease}
</style>`);
