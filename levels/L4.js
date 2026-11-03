/* =====================================================================
   第 4 关 · 磨坊 —— 状态 / 齿轮规则 / 场景动态层 / 点击 / 提示 / 大厅联动
   新机制：场景切换（左右箭头）+ 齿轮奇偶转向（策划案第 4 章）
   ===================================================================== */
const S4 = {
  entered:false, sub:'out',
  crows:true, crowsFly:false, crank:'pocket', sluiceOpen:false, wheelOn:false,
  sacks:[false,false,false,false], tallySeen:false, stoneRead:false,
  pegs:{a:null, b:null, c:null}, sel:null, stoneDir:0, year:null, future:false,
  ground:false, chute:{deer:false, cgear:false, wheat:false},
  cartSeen:false, lampTaken:false, lampLit:false
};
LEVELS.L4.ready = true;

Object.assign(ITEMS, {
  crank: {name:'Sluice Crank', usedIn:[4]},      // 稻草人衣兜 → 装上水闸后消失
  gears: {name:'Gears',        usedIn:[4]},      // 面粉袋里的一包齿轮（大 / 中 / 小 / 裂）→ 磨出往昔后消失
  elamp: {name:'E Lantern',    usedIn:[4,4.5]},  // 马车旁 · 照亮回程地道 · 大厅座次谜题（放上椅子后消失）
  cgear: {name:'Copper Gear',  usedIn:[7]},      // 铜齿轮 · 十二齿 · 第 7 关钟楼第三轴
  deer:  {name:'Wooden Deer',  usedIn:[6,8]},    // 木鹿玩具 · 第 6 关摇篮（可选）· 第 8 关雕像
  wheat: {name:'Golden Wheat', usedIn:[8]}       // 金麦穗 · 第 8 关雕像
});
BADGES.elamp = ()=> S4.lampLit ? '亮着' : '';

/* ---------------- 齿轮规则：相邻咬合转向相反；动力轴顺时针，经过奇数个齿轮 → 磨盘顺时针 ---------------- */
const GEARS = {
  big:    {r:120, t:22, cn:'大齿轮',  fill:'#8a6a44'},
  mid:    {r:72,  t:14, cn:'中齿轮',  fill:'#7a6248'},
  small:  {r:48,  t:10, cn:'小齿轮',  fill:'#6e5a44'},
  cracked:{r:72,  t:14, cn:'裂齿轮',  fill:'#6a5a4a', crack:true}
};
const G_Y = 186, G_D = {x:490, r:70}, G_M = {x:110, r:70};      // 特写坐标：右动力轴，左磨盘冠齿
const PEGS = {a:228, b:300, c:348};
function gearNodes(){
  const n = [{id:'D', x:G_D.x, r:G_D.r}, {id:'M', x:G_M.x, r:G_M.r}];
  Object.entries(S4.pegs).forEach(([p,g])=>{ if(g) n.push({id:p, x:PEGS[p], r:GEARS[g].r, g}); });
  return n;
}
function canPlace(g, p){
  const r = GEARS[g].r, x = PEGS[p];
  return gearNodes().every(o => o.id===p || Math.abs(o.x - x) >= o.r + r - 4);
}
function evalGears(){
  const nodes = gearNodes(), mesh = (a,b)=>Math.abs(Math.abs(a.x-b.x) - (a.r+b.r)) <= 4;
  const dir = {D:1}, prev = {}; const q = ['D'];
  while(q.length){ const id=q.shift(), a=nodes.find(o=>o.id===id);
    nodes.forEach(b=>{ if(dir[b.id]!==undefined || !mesh(a,b)) return; dir[b.id] = -dir[id]; prev[b.id]=id; q.push(b.id); }); }
  const connected = dir.M !== undefined;
  let n=0, jam=false; if(connected){ let c=prev.M; while(c && c!=='D'){ n++; if(S4.pegs[c]==='cracked') jam=c; c=prev[c]; } }
  return {connected, n, dir, jam};
}
function runGears(){
  if(S4.ground) return '';
  const e = evalGears(), placed = Object.values(S4.pegs).some(Boolean);
  S4.stoneDir = 0;
  if(!placed) return '';
  if(!S4.wheelOn) return e.connected ? '齿轮都咬上了，可是动力轴一动不动——外面的水车没在转。' : '';
  if(!e.connected) return '动力轴带着齿轮空转，没有咬合到磨盘上。';
  if(e.jam){ S4.pegs[e.jam]=null; sfx.thud(); setTimeout(()=>noise(.2,2200,.1,2),60);
    return '「咔嚓」——裂齿轮一受力就卡死了，从轴上弹了出来。'; }
  S4.stoneDir = e.n % 2 ? 1 : -1;
  if(S4.stoneDir===1){
    S4.year='1448'; S4.future=true; setTimeout(()=>{ sfx.creak(); }, 900);
    return '磨盘顺时针转了起来——「顺时而磨」。边缘的年份环往前滚，停在 1448，旁边刻着一个 A 和一道鸦爪印。门外的马车吱呀作响：「下一个是她。」';
  }
  S4.year='1415'; S4.ground=true; take('gears'); setTimeout(()=>{ sfx.chime(); tone(140,.8,'sine',.1,90); }, 600);
  return '磨盘逆时针转了起来——「逆时而磨，方见往昔」。年份环往回滚，停在 1415 · 收获月。出料口「哗」地落下几样东西。';
}

/* ---------------- 子场景切换 ---------------- */
function switchSub4(sub){
  G.busy = true; fadeEl.querySelector('p').textContent=''; fadeEl.classList.add('show');
  setTimeout(()=>{ S4.sub = sub; hintKey=''; updateAll();
    setTimeout(()=>{ fadeEl.classList.remove('show'); G.busy=false;
      if(sub==='in' && !S4.inSeen){ S4.inSeen=true; say(S4.wheelOn ? '磨坊里，动力轴吱吱呀呀地转着，可磨盘一动不动。' : '磨坊里落满了面粉。动力轴和磨盘之间空着，像是少了几个齿轮。', 5500); }
    }, 400);
  }, 500);
}

/* ---------------- 场景动态层 ---------------- */
const K4 = (MI4.drive.x-MI4.crown.x)/(G_D.x-G_M.x);   // 特写 → 场景的齿轮缩放
SCENES.L4 = function(){
  const out = S4.sub==='out';
  document.getElementById('m4OutBg').style.display = out ? '' : 'none';
  document.getElementById('m4InBg').style.display = out ? 'none' : '';
  document.getElementById('m4OutHot').style.display = out ? '' : 'none';
  document.getElementById('m4InHot').style.display = out ? 'none' : '';
  document.getElementById('lvTitle').textContent = out ? 'The Watermill' : 'Inside the Mill';
  document.getElementById('m4Wheel').setAttribute('class', S4.wheelOn ? 'm4spinR' : '');
  let s='';
  if(out){
    // 水闸
    if(S4.crank==='set') s+=`<g ${m4s}><path d="M653,250 L653,232 L676,226" stroke="#15110d" stroke-width="6.4" fill="none" stroke-linecap="round"/>
        <path d="M653,250 L653,232 L676,226" stroke="#6a645a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M652,248 L652,234" stroke="#a8a090" stroke-width="1" opacity=".7"/>
        <circle cx="653" cy="250" r="4.4" fill="#3a3632"/><circle cx="653" cy="250" r="1.4" fill="#15110d" stroke="none"/>
        <rect x="671" y="218" width="10" height="14" rx="3.6" fill="#5e4a32" transform="rotate(-14 676 225)"/></g>`;
    if(S4.sluiceOpen) s+=`<g ${m4s}><rect x="642" y="236" width="22" height="20" fill="#5e4a32"/><path d="M642,243 h22 M642,249.5 h22" stroke="#2a1e12" stroke-width=".8"/>
        <path d="M642,238.6 h22 M642,253.6 h22" stroke="#2a2622" stroke-width="2.2"/><circle cx="645" cy="238.6" r=".9" fill="#a8a090" stroke="none"/><circle cx="661" cy="238.6" r=".9" fill="#a8a090" stroke="none"/></g>
        <path d="M604,296 Q594,316 572,${M4.wheel.y-M4.wheel.r+4}" stroke="#9fb6bc" stroke-width="10" fill="none" opacity=".8"/>
        <path d="M604,296 Q594,316 572,${M4.wheel.y-M4.wheel.r+4}" stroke="#e2ecec" stroke-width="2.4" fill="none" stroke-dasharray="6 6" class="m4water"/>
        <path d="M520,420 q14,-6 28,0 t28,0 M600,424 q14,-6 28,0" stroke="#e2ecec" stroke-width="1.6" fill="none" class="pulse"/>`;
    // 马车上的面粉袋与小鞋
    s+=`<g transform="translate(153,358)">${wagonSackArt()}</g>${shoeArt(208,372,1.1)}`;
    if(!S4.lampTaken) s+=`<g transform="translate(258,508) rotate(72)">${eLampArt(false)}</g>`;
    s+= scarecrowArt(S4.crows);
    if(S4.crowsFly){ s+=`<g class="m4fly">${crowArt(668,384,1.2)}${crowArt(774,378,1.2,true)}${crowArt(722,306,1.3)}${crowArt(700,388,1.05,true)}</g>`; S4.crowsFly=false; }
    if(!S4.crows && !G.feathers.L4) s+=`<g ${m4s}><path d="M612,600 Q624,584 650,576" stroke="#0e0c0a" stroke-width="2.6" fill="none"/>
        <path d="M618,594 l-6,-4 M624,588 l-6,-5 M632,583 l-4,-6 M621,592 l6,-1 M628,586 l6,-2 M636,581 l6,-1" stroke="#1d1915" stroke-width="2"/>
        <circle cx="630" cy="588" r="22" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/></g>`;
    if(S4.lampLit && has('elamp')) s+=`<path d="${M4.tunnel}" fill="#ffc56e" opacity=".14"/><circle cx="102" cy="640" r="60" fill="url(#l4-lamp)"/>`;
  }else{
    const sx=s=>MI4.crown.x + (s-G_M.x)*K4, gy=MI4.drive.y;
    const dirs = evalGears().dir, spin = (id)=> S4.wheelOn && dirs[id]!==undefined ? (dirs[id]>0?'m4spin':'m4spinR') : '';
    s+=`<g transform="translate(${MI4.drive.x},${gy})"><g class="${S4.wheelOn?'m4spin':''}">${m4BigWheel(92)}${gearArt(G_D.r*K4, 16, '#7a5a3a')}</g></g>`;
    s+=`<g transform="translate(${MI4.crown.x},${gy})"><g class="${S4.stoneDir? (S4.stoneDir>0?'m4spin':'m4spinR') : ''}">${gearArt(G_M.r*K4, 18, '#6a5a44')}</g></g>`;
    ['a','b','c'].forEach(p=>{ const x = sx(PEGS[p]);
      s+=`<circle cx="${x}" cy="${gy}" r="4" fill="#2a2622"/>`;
      const g=S4.pegs[p]; if(g) s+=`<g transform="translate(${x},${gy})"><g class="${spin(p)}">${gearArt(GEARS[g].r*K4, GEARS[g].t, GEARS[g].fill, {crack:GEARS[g].crack})}</g></g>`; });
    if(S4.stoneDir) s+=`<path d="M${MI4.stone.x-90},${MI4.stone.y-4} q90,${S4.stoneDir*-18} 180,0" stroke="#f0e8d4" stroke-width="2" fill="none" opacity=".6" class="pulse"/>`;
    // 面粉袋（参考图：敞口卷边的粗麻袋，袋口露出面粉，袋身印着麦穗）+ 木箱
    s+= crateArt();
    const SK=[[76,552,1.05],[150,568,1.12],[214,524,.9],[110,616,1]];
    SK.forEach(([x,y,k],i)=>{ s+= S4.sacks[i]
      ? `<g transform="translate(${x},${y+10}) scale(${k})">${sackTornArt()}</g>${flourSpill4(x+34,y+42)}`
      : `<g transform="translate(${x},${y}) scale(${k})">${sackArt()}</g>`; });
    // 出料口：小木鹿、铜齿轮、麦穗（与特写同一套造型）
    const c=S4.chute, X=MI4.stone.x, Y=MI4.stone.y; if(S4.ground && !(c.deer&&c.cgear&&c.wheat)) s+=`<g>
        ${c.wheat?'':`<g transform="translate(${X-16},${Y+92}) rotate(-58) scale(.27)">${wheatArt}</g>`}
        ${c.cgear?'':`<g transform="translate(${X+19},${Y+100}) rotate(12)">${gearArt(8,10,'#b0703a',{dark:'#7a4a22',hub:'#4a2a12'})}</g>`}
        ${c.deer?'':`<g transform="translate(${X-4},${Y+95}) scale(.23)">${deerToyArt}</g>`}
        <circle cx="${X}" cy="${Y+100}" r="36" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/></g>`;
    if(has('elamp') && S4.lampLit) s+=`<circle cx="696" cy="300" r="40" fill="url(#l4-lamp)"/>`;
  }
  if(!out) s+=`<rect width="828" height="709" fill="url(#l4-vig)"/>`;
  document.getElementById('l4Dyn').innerHTML = s;
  document.getElementById('m4FeatherHot').style.display = (!S4.crows && !G.feathers.L4 && out) ? '' : 'none';
  { const c=S4.chute; document.getElementById('m4PickHot').style.display = (S4.ground && !(c.deer&&c.cgear&&c.wheat)) ? '' : 'none'; }
};

/* ---------------- 场景点击 ---------------- */
const M4_FLAVOR = {
  o_wheel:()=> S4.wheelOn ? '水车哗哗地转着，带动磨坊里的动力轴。' : '巨大的水车一动不动，叶片上挂着青苔。上面的水槽是干的——水闸关着。',
  o_mill:()=> '一座石头砌的水磨坊，烟囱里没有烟。磨坊主很多年前就不在了。',
  o_door:()=> null,
  i_stairs:()=> '楼上是堆粮的阁楼，梯子断了两级，上不去。',
  i_window:()=> '窗外的雾里，隐约能看见城堡的尖顶。',
  i_candle:()=> has('elamp') && !S4.lampLit ? null : '立柱上的蜡烛还亮着，像是有人刚点过。'
};
document.getElementById('l4Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L4') return;
  const o = g.dataset.obj; sfx.tap();
  // 出料口落下的三样东西：在场景里直接拾取（点哪样拿哪样）
  if(S4.sub==='in' && S4.ground){ const c=S4.chute, X=MI4.stone.x, Y=MI4.stone.y, p=svgPt(document.getElementById('l4Obj'), e);
    const left = [['wheat',X-20,Y+86],['cgear',X+19,Y+100],['deer',X-2,Y+94]].filter(([k])=>!c[k]);
    if(left.length && nearPt(p, X, Y+96, 44)){
      const [k] = left.sort((a,b)=>Math.hypot(p.x-a[1],p.y-a[2]) - Math.hypot(p.x-b[1],p.y-b[2]))[0];
      c[k]=true; give(k); sfx.pick(); updateAll();
      return say({deer:'一只木头雕的小鹿，四个轮子还能转。鹿角被摸得发亮——是玛格丽的玩具。',
        cgear:'一个铜齿轮，十二个齿。背面刻着鸦戒纹章，还有一行小字：「钟楼 · 第三轴」。',
        wheat:'一束金色的麦穗，沉甸甸的。1415 年那一季，灰麦村是大丰收。'}[k], 5500); } }
  if(M4_FLAVOR[o]){ const t = M4_FLAVOR[o](); if(t) return say(t); }
  switch(o){
    case 'go_in': case 'o_door': return switchSub4('in');
    case 'go_out': case 'i_door': return switchSub4('out');
    case 'o_feather': return pickFeather('L4');
    case 'o_scarecrow':
      if(!S4.crows) return openZoom('o_scarecrow');
      if(!has('bell')){ sfx.caw(); return say('你刚走近，停在稻草人上的鸦群就扑棱着翅膀冲你尖叫。你只好退开。', 4500); }
      S4.crows=false; S4.crowsFly=true; handBell(); setTimeout(sfx.caw, 300); setTimeout(()=>noise(1,1800,.06,.5), 200);
      updateAll(); return say('你摇响了圣铃。鸦群「轰」地一声全飞了起来，消失在雾里。麦垄间飘落下一根羽毛。', 5500);
    case 'o_elamp':
      if(S4.lampTaken) return;
      S4.lampTaken=true; give('elamp'); sfx.pick(); updateAll();
      return say('你从车轮边捡起一盏翻倒的提灯。灯罩上刻着一个字母：E。灯早就灭了。', 5500);
    case 'o_tunnel':
      if(G.progress.L4) return goLevel('hall', '这条地道你已经走过一次了。你摸着潮湿的墙壁，一路走回了大厅。');
      if(!has('elamp') || !S4.lampLit) return say(has('elamp') ? '地道里黑得伸手不见五指。手里的提灯是灭的。' : '你来时的地道。回去的路黑得伸手不见五指。', 4500);
      if(!S4.ground) return say('母亲把马车安排在这里……磨坊里，也许还藏着她留下的东西。', 4500);
      if(!S4.cartSeen) return say('走之前，再看看那辆马车吧。', 4000);
      return leaveMill();
    case 'i_candle':
      S4.lampLit=true; sfx.flame(); updateAll();
      return say('你借立柱上的烛火点亮了提灯。灯光一晃，灯罩上那个 E 投在墙上，大得吓人。', 5500);
  }
  openZoom(o);
});
function leaveMill(){
  G.progress.L4 = true;
  goLevel('hall', '你提着刻着 E 的提灯钻进地道，原路走回了酒窖，又爬上厨房……', ()=>{
    sfx.chime(); say('大厅的长餐桌上，每个座位前都多了一只麦酒杯。主楼梯的铁栅门上，多了一只提灯挂钩。', 7000);
  });
}

/* ---------------- 记忆页 ④ 没有到来的马车 ---------------- */
MEMORIES.m4 = {no:'④', title:'没有到来的马车', moon:6, from:'L4', art:()=>memFrame(`
  <path d="M30,330 Q300,316 570,330 V378 H30 Z" fill="#b9ab8b"/><path d="M30,330 Q300,316 570,330" stroke="#2b251e" stroke-width="2" fill="none"/>
  <path d="M60,300 Q120,240 160,300 M380,300 Q440,230 500,300" stroke="#b3a586" stroke-width="2" fill="none"/>
  <g fill="#5e4e3a" stroke="#2b251e" stroke-width="3">
    <path d="M150,250 L370,244 L374,300 L146,306 Z"/><circle cx="210" cy="320" r="42" fill="none" stroke-width="7"/>
    <path d="M370,280 L470,310" stroke-width="6"/></g>
  <path d="M200,248 Q196,214 222,204 Q250,196 266,214 Q276,236 270,248 Z" fill="#c9bea0" stroke="#2b251e" stroke-width="2.4"/>
  <g fill="#2b251e">
    <path d="M318,152 Q336,132 362,150 L370,158 L310,160 Z"/><ellipse cx="340" cy="170" rx="13" ry="15"/>
    <path d="M318,186 Q340,176 362,186 L366,246 L314,246 Z"/>
    <path d="M318,240 L300,300 L312,302 L330,250 Z M358,240 L366,300 L378,300 L370,244 Z"/>
    <path d="M320,196 Q300,214 302,232 L312,232 Q314,218 328,206 Z"/>
  </g>
  <g transform="translate(420,322)"><path d="M-10,-26 L10,-26 L10,4 L-10,4 Z" fill="#c9bea0" stroke="#2b251e" stroke-width="2.4"/>
    <path d="M-12,-26 L12,-26 L8,-32 L-8,-32 Z M-12,4 L12,4 L10,10 L-10,10 Z" fill="#2b251e"/>
    <path d="M0,-18 q3,5 1,8 q-1,2 -2,0 q-2,-3 1,-8 Z" fill="#8a6a3a"/></g>`, 6)};

/* ---------------- 提示（三级） ---------------- */
HINTS.L4 = function(){
  if(S4.crows) return ['乌鸦死死守着那个稻草人。','乌鸦怕什么声音呢？','你手里有圣铃。点击稻草人，摇响它把鸦群惊走。'];
  if(S4.crank==='pocket') return ['稻草人的衣兜鼓鼓的。','点击稻草人看看它的衣兜。'];
  if(!S4.sluiceOpen) return ['水车一动不动——水槽是干的。','水槽尽头有一道水闸，闸上缺了一个摇柄。','打开水闸特写，把摇柄装上去，再转动它。'];
  if(!S4.ground){
    if(!has('gears') && !S4.sacks.some(Boolean)) return ['磨坊里的动力轴和磨盘之间少了齿轮。','角落里堆着几只面粉袋。','打开面粉袋特写，挨个撕开，其中一只里有齿轮。'];
    if(!has('gears')) return ['还有面粉袋没有撕开。'];
    if(!S4.future) return ['磨盘中心刻着字。','每多咬合一个齿轮，转向就反一次。','用中、小两个齿轮。'];
    return ['「逆时而磨，方见往昔」。磨盘刚才是顺时针转的。','每多咬合一个齿轮，转向就反一次。','把大齿轮取下来，换成中、小两个齿轮。'];
  }
  const c=S4.chute; if(!(c.deer&&c.cgear&&c.wheat)) return ['出料口落下了几样东西。','打开磨盘下方的出料口，把东西都拿走。'];
  if(!S4.cartSeen) return ['那辆马车一直停在门外。','母亲安排的马车上，有一只孩子大小的面粉袋。','到磨坊外，打开马车特写，看看面粉袋和那只小鞋。'];
  if(!S4.lampTaken) return ['车轮边掉着一盏提灯。'];
  if(!S4.lampLit) return ['回去的地道太黑了。','提灯是灭的。磨坊里有火吗？','到磨坊里，点击立柱上的蜡烛，把提灯点亮。'];
  return ['可以回去了。','提着亮着的提灯，从左下角的地道口回去。'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L4 = ()=>{
  updateAll();
  if(!S4.entered){ S4.entered=true;
    say('地道的尽头是一扇小石门。你推开它，眼前是雾中的水磨坊——母亲当年安排的马车，竟然还停在那里。', 7000); }
  else say('雾更浓了。', 3000);
};

/* ---------------- 通关登记（调试起点用） ---------------- */
COMPLETE.L4 = ()=>{
  Object.assign(S4, {entered:true, sub:'out', crows:false, crank:'set', sluiceOpen:true, wheelOn:true, sacks:[true,true,true,false],
    tallySeen:true, stoneRead:true, pegs:{a:'small', b:null, c:'mid'}, stoneDir:-1, year:'1415', ground:true,
    chute:{deer:true, cgear:true, wheat:true}, cartSeen:true, lampTaken:true, lampLit:true});
  give('cgear'); give('deer'); give('wheat'); give('elamp');
  G.progress.L4 = true; addMem('m4');
};

/* =====================================================================
   大厅联动（第 4 关之后）：麦酒杯座次谜题——把 E 提灯还给“唯一清醒的人”
   ===================================================================== */
const SCENE_PLATE = {cross:[300,553], shield:[415,553], tower:[530,553], wheat:[285,577], fawn:[415,577], stag:[545,577], pot:[248,566], raven:[584,566]};
const cupScene = (x,y,full)=>`<g stroke="#120e0b" stroke-width="1.1"><path d="M${x-4},${y-9} L${x+4},${y-9} L${x+3.4},${y} L${x-3.4},${y} Z" fill="#6a5a44"/>
  <ellipse cx="${x}" cy="${y-9}" rx="4" ry="1.4" fill="${full?'#b8862e':'#2a2119'}"/></g>`;
const cupZoom = (x,y,full)=>`<g ${hk}><path d="M${x-8},${y-6} L${x+8},${y-6} L${x+6},${y+10} L${x-6},${y+10} Z" fill="#6a5a44"/>
  <ellipse cx="${x}" cy="${y-6}" rx="8" ry="3" fill="${full?'#c8963a':'#2a2119'}"/>${full?`<ellipse cx="${x-2}" cy="${y-7}" rx="3" ry="1" fill="#f0d08a" stroke="none"/>`:''}</g>`;
const tAle = TABLE_ITEMS.find(t=>t.id==='aleCups'), tSack = TABLE_ITEMS.find(t=>t.id==='flourSack');
tAle.cap = '每个座位前都多了一只麦酒杯。七只都是空的，杯底结着干掉的酒渍——只有盾牌椅前那一杯，是满的。';
tAle.zart = ()=> CHAIRS.map(c=>{ const [x,y]=c.plate, dx = c.id==='cross' ? -26 : 24; return cupZoom(x+dx, y, c.id==='shield'); }).join('');
tAle.sceneArt = ()=> Object.entries(SCENE_PLATE).map(([id,[x,y]])=>cupScene(x+(id==='cross'?-15:15), y+2, id==='shield')).join('');
tSack.cap = '麦穗椅上搭着一只空面粉袋，袋口的绳子是被割断的。';
tSack.zart = ()=>`<g ${hk}><path d="M170,300 Q164,278 178,270 Q192,264 206,270 Q218,278 212,300 Z" fill="#cfc4a6"/><path d="M182,270 l-4,-8 M200,270 l4,-8" stroke="#8a7a5c" stroke-width="2"/></g>`;
tSack.sceneArt = ()=>`<path d="M262,662 Q258,646 272,640 Q286,634 300,640 Q314,646 308,662 Z" fill="#cfc4a6" stroke="#120e0b" stroke-width="1.2"/>`;

HALL_HOOKS.scene = ()=>{
  const P=G.progress, H=G.hall; if(!P.L4) return '';
  let s='';
  if(!H.gateOpen) s+=`<path d="M296,456 h10 v10 q0,5 -5,5" stroke="#120f0c" stroke-width="2.4" fill="none"/>`;
  else {
    for(let i=6;i<12;i++){ const x=222-i*2.4, y=342+i*14.8, w=116+i*4.8;
      s+=`<rect x="${x}" y="${y}" width="${w}" height="15" fill="${['#392e23','#3b3024','#3d3126'][Math.floor((i-6)/2)]}" stroke="#1a1511" stroke-width="1.2"/><rect x="${x}" y="${y}" width="${w}" height="3" fill="#54453a"/>`; }
    s+=`<g stroke="#120f0c" stroke-width="2.4"><path d="M199,446 V520 M203,442 V520 M207,446 V520 M211,442 V520"/><path d="M349,442 V520 M353,446 V520 M357,442 V520 M361,446 V520"/>
        <path d="M197,452 H213 M197,486 H213 M197,515 H213 M347,452 H363 M347,486 H363 M347,515 H363" stroke-width="3"/></g>
        <polygon points="226,446 334,446 344,520 216,520" fill="#ffc56e" opacity=".1"/>
        <g transform="translate(415,540) scale(.55)">${eLampArt(true)}</g><circle cx="415" cy="530" r="40" fill="url(#hWarm)" opacity=".6"/>`;
  }
  return s;
};
HALL_HOOKS.tableOverlay = ()=> G.hall.lanternSeat ? (()=>{ const c=CHAIRS.find(x=>x.id===G.hall.lanternSeat);
  return `<g transform="translate(${c.x},${c.y+4}) scale(.62)">${eLampArt(true)}</g><circle cx="${c.x}" cy="${c.y}" r="44" fill="url(#warm)" opacity=".55"/>`; })() : '';
HALL_HOOKS.chair = (c)=>{
  const P=G.progress, H=G.hall;
  if(!P.L4 || H.gateOpen || !has('elamp')) return false;
  if(!S4.lampLit){ setCap('提灯是灭的。'); return true; }
  H.lanternSeat = c.id; sfx.tap(); render();
  if(c.id==='shield'){
    take('elamp'); H.gateOpen = true;
    setTimeout(()=>{ sfx.clack(); setTimeout(sfx.creak, 250); }, 900);
    setCap('你把刻着 E 的提灯放在盾牌椅上。灯光穿过椅背的镂空，在主楼梯的铁栅门上投出一个钥匙孔形的光斑……「咔哒」——栅门开了。');
    updateAll(); return true;
  }
  setTimeout(()=>{ H.lanternSeat=null; render(); setCap('灯光穿过椅背的镂空，落在墙上——形状不对。你把提灯拿了回来。'); }, 1800);
  setCap(`你把提灯放在${c.owner==='先祖之席'?'先祖之席':'这把椅子'}上。灯光穿过椅背的镂空，投在墙上……`);
  return true;
};
const _hallHints = HINTS.hall;
HINTS.hall = function(){
  const P=G.progress, H=G.hall;
  if(P.L4 && !H.gateOpen) return ['铁栅门上刻着：「那一夜，唯一清醒的人为父亲提着灯。把灯还给他。」',
    '玛莎说过，那一夜人人都喝了麦酒……除了谁？看看长餐桌上那几只酒杯。',
    '唯一满着的那杯在盾牌椅前——那是埃德蒙的座位。点开长餐桌，点击盾牌椅放上提灯。'];
  if(P.L4 && H.gateOpen && !P.L7) return ['铁栅门开了，主楼梯通向二楼。','点开大厅中央的主楼梯铁栅门，走上楼去。'];
  return _hallHints();
};
