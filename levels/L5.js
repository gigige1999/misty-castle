/* =====================================================================
   第 5 关 · 肖像长廊 —— 状态 / 排序 / 侧光 / 场景动态层 / 点击 / 提示 / 通关登记
   新机制：观察断代（窗外橡树）+ 排序推理（交换相邻画像）+ 侧光显影（滑动烛台）
   流程：排好画像 → 画中人望向母亲、烛台自己亮起 → 烛台沿轨道逐幅侧照 → 1415 那幅里是「我」
        → 母亲画像抬手指向画框一角 → 画框弹开取雄鹿钥匙 → 记忆页 ⑤ → 右墙雄鹿门（第 6 关）
   ===================================================================== */
const S5 = {
  entered:false, wallSeen:false,
  order:[2,0,3,1],                 // order[slot] = 挂在该位置的画像 id（0=1316 … 3=1415）
  ordered:false, lit:false, stop:0,
  revealed:[false,false,false,false], selfSeen:false,
  pointing:false, frameOpen:false, keyTaken:false,
  canvasSeen:false, visor:false, doorTried:false, doorOpen:false
};
LEVELS.L5.ready = true;

Object.assign(ITEMS, {
  skey:{name:'Stag Key', usedIn:[5,6]}     // 母亲画像后的雄鹿钥匙 · 第 6 关夫人寝室的门
});

const slotOf5 = id => S5.order.indexOf(id);
const isReversed5 = () => S5.order.join()==='3,2,1,0';
const gaze5 = id => P5[id].figs.map((_,i)=> S5.ordered ? 1 : isReversed5() ? -1 : SCR5[id][i]);
const sideLit5 = id => S5.lit && S5.stop===slotOf5(id);
const allRevealed5 = () => S5.revealed.every(Boolean);

/* ---------------- 音效 ---------------- */
const slide5 = ()=>{ noise(.55,900,.05,2.5); tone(180,.5,'triangle',.02,140); setTimeout(()=>tone(320,.08,'square',.015),480); };
const reveal5 = ()=>{ tone(196,1.6,'sine',.05); setTimeout(()=>tone(247,1.4,'sine',.04),220); setTimeout(()=>tone(294,1.6,'sine',.035),440); };
const dread5 = ()=>{ tone(73,3.2,'sine',.12,60); tone(110,2.6,'triangle',.03,98); };

/* ---------------- 换画（整面墙特写里调用） ---------------- */
function swap5(s){
  if(S5.ordered) return;
  [S5.order[s], S5.order[s+1]] = [S5.order[s+1], S5.order[s]];
  sfx.thud(); setTimeout(sfx.clack, 160);
  if(S5.order.join()==='0,1,2,3') return onOrdered5();
  render(); updateAll();
  setCap(isReversed5()
    ? '你把两幅画换了位置。画里所有人的眼睛都转向了左边——望着你身后的楼梯口。好像……整个反了。'
    : '你把两幅画对调了位置。画里的人还是各看各的，眼神乱成一片。');
}
function onOrdered5(){
  S5.ordered = true; G.busy = true;
  render(); updateAll();
  setCap('最后一幅挂好的瞬间——四幅画里所有人的眼睛，同时转向了右边，望向长廊尽头母亲的画像。');
  dread5();
  setTimeout(()=>{
    S5.lit = true; sfx.flame(); G.busy = false;
    if(cur) closeZoom(); updateAll();
    say('长廊里「噗」的一声轻响——左墙轨道上那盏烛台，自己亮了。它正停在第一幅画旁边。', 6500);
  }, 3000);
}

/* ---------------- 侧光显影（单幅特写打开时调用） ---------------- */
const REVEAL5 = [
  '侧光贴着画布斜斜扫过，厚涂的颜料起伏出一道轮廓——一个小男孩，手里攥着一束麦穗。铭牌的刮痕里能辨出年份：1316。',
  '侧光扫过厚涂，浮现出一个小女孩的轮廓，手里提着一只银铃。铭牌：1349。',
  '侧光扫过厚涂，浮现出一个男孩的轮廓，手里举着一面小手镜。铭牌：1382。'
];
function pageNote5(id){
  if(!has('page')) return '';
  const P=P5[id]; return ` 受洗册残页上，${P.born} 年出生的那个孩子：${P.init}。七岁那年，正是 ${P.year}。`;
}
function revealPortrait5(id){
  S5.revealed[id] = true; reveal5(); render(); updateAll();
  if(id===3) return selfReveal5();
  const left = S5.revealed.filter(r=>!r).length;
  setCap(REVEAL5[id] + pageNote5(id) + (left ? ' 烛台还能沿着轨道，往里推。' : ''));
  if(!left) setTimeout(onAllRevealed5, 2600);
}
function selfReveal5(){
  G.busy = true;
  const here = ()=>cur==='l5_p3';
  setCap('侧光扫过最后一块厚涂。轮廓里浮现出一个小女孩，怀里抱着一只木鹿——和你从磨坊带回来的那只一模一样。铭牌：1415。');
  setTimeout(()=>{
    const g = zsvg.querySelector('#z-face');
    if(here() && g){ g.style.transition='transform 2.8s ease-in-out'; g.style.transformOrigin=`${FACE5.x}px ${FACE5.y}px`;
      g.style.transform=`translate(${(300-FACE5.x).toFixed(1)}px, ${(176-FACE5.y).toFixed(1)}px) scale(3.4)`; }
    dread5(); if(here()) setCap('那张脸一点点清晰起来。你认得它——在石屋的窗玻璃上，你见过这张脸。');
  }, 3200);
  setTimeout(()=>{ if(here()) setCap('……是我。'); tone(147,2.4,'sine',.06); }, 6600);
  setTimeout(()=>{
    S5.selfSeen = true; G.busy = false;
    if(allRevealed5()) onAllRevealed5();
    else { if(here()) closeZoom(); updateAll(); say('……那么，前面几幅画的厚涂下面，也是像我一样的孩子吗？', 6000); }
  }, 9400);
}
function onAllRevealed5(){
  if(S5.pointing) return;
  S5.pointing = true; if(cur) closeZoom(); updateAll();
  sfx.creak();
  say('长廊尽头传来一声轻响。画中的母亲，不知什么时候抬起了一只手——指着画框的右下角。', 7000);
}

/* ---------------- 场景动态层 ---------------- */
SCENES.L5 = function(){
  let s='';
  // 左墙四幅画像
  for(let slot=0; slot<4; slot++){ const id=S5.order[slot];
    s+=`<g clip-path="url(#g5c-${slot})"><g transform="${paintMatrix5(slot)}">${portraitArt5(id, {uid:'s'+slot, gaze:gaze5(id), revealed:S5.revealed[id] && sideLit5(id)})}</g>
      <polygon points="${pts5(frameQuad5(slot,12))}" fill="#0c0a08" opacity="${sideLit5(id) ? 0 : .28}"/>
      ${sideLit5(id) ? `<polygon points="${pts5(frameQuad5(slot,12))}" fill="url(#g5-rake)"/>` : ''}</g>`;
    if(sideLit5(id) && !S5.revealed[id]) s+=`<polygon points="${pts5(frameQuad5(slot,2))}" fill="none" stroke="#efe6c8" stroke-width="1.6" class="pulse"/>`;
  }
  // 滑动烛台
  const z=SZ5[S5.stop], [mx,my]=p5(-414,RAIL_Y5,z), k=1.02/z;
  const cx=mx+40*k, cy=my-82*k;
  if(S5.lit) s+=`<circle cx="${cx}" cy="${cy}" r="${90*k}" fill="url(#g5-warm)" opacity=".75"/>`;
  s+=`<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) scale(${k.toFixed(3)})">${sconceArt5(S5.lit)}</g>`;
  if(S5.lit && !allRevealed5()) s+=`<circle cx="${cx}" cy="${cy+20*k}" r="${34*k}" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
  const hot = document.getElementById('g5SconceHot');
  hot.setAttribute('cx', cx.toFixed(1)); hot.setAttribute('cy', (cy+28*k).toFixed(1)); hot.setAttribute('r', (46*k).toFixed(1));
  // 母亲画像
  if(!S5.frameOpen){
    s+=`<g clip-path="url(#g5c-m)"><g transform="translate(${M5.x},${M5.y}) scale(${M5.k})">${motherArt5({pointing:S5.pointing})}</g></g>
      <rect x="${M5.x}" y="${M5.y}" width="88.4" height="132.6" fill="#c8d4dc" opacity=".06"/>`;
    if(S5.pointing) s+=`<circle cx="465" cy="384" r="9" fill="none" stroke="#efe6c8" stroke-width="1.6" class="pulse"/>`;
    if(S5.ordered && !S5.pointing) s+=`<rect x="360" y="234" width="108.2" height="152.6" fill="none" stroke="#efe6c8" stroke-width="1.2" opacity=".5" class="pulse"/>`;
  }else{
    s+=`<rect x="${M5.x}" y="${M5.y}" width="88.4" height="132.6" fill="#0d0b09"/>
      <rect x="${M5.x+6}" y="${M5.y+6}" width="76.4" height="120.6" fill="none" stroke="#2a241e" stroke-width="2"/>
      ${!S5.keyTaken ? `<g transform="translate(414,${M5.y+70}) rotate(90) scale(.28)">${skeyArt5()}</g><circle cx="414" cy="${M5.y+62}" r="20" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>` : ''}
      <polygon points="360,234 384,250 384,372 360,386.6" fill="#5a4630" stroke="#1a1511" stroke-width="1.3"/>
      <path d="M366,246 L380,256 V366 L366,378 Z" fill="#3a2e22"/>`;
  }
  // 盔甲（护面可掀）
  s+=`<g transform="translate(${A5.x},${A5.y}) scale(${A5.k})">${armorArt5(S5.visor)}</g>`;
  // 有钥匙后，雄鹿门在发光；开过之后门一直虚掩着
  if(S5.doorOpen) s+=`<path d="${D5.inner}" fill="#0c0a08" stroke="#1a1511" stroke-width="1.3"/>
      <path d="M650.6,558.6 L650.6,206 Q648,182 626.3,176.2 L632,190 L640,540 Z" fill="#3e3024" stroke="#1a1511" stroke-width="1.3"/>
      <ellipse cx="628" cy="400" rx="18" ry="120" fill="#ffd890" opacity=".06"/>`;
  else if(S5.keyTaken) s+=`<path d="${D5.inner}" fill="none" stroke="#f0d9a0" stroke-width="2.4" class="pulse"/>`;
  s+=`<rect width="828" height="709" fill="url(#g5-vig)"/>`;
  document.getElementById('l5Dyn').innerHTML = s;
  document.getElementById('lvTitle').textContent = 'The Gallery';
};

/* ---------------- 场景点击 ---------------- */
document.getElementById('g5Hot').insertAdjacentHTML('beforeend', `<g class="hs-arrow" data-obj="down"><rect x="8" y="640" width="48" height="48" rx="6" fill="#2b251e" opacity=".55"/>
  <path d="M40,652 L22,664 L40,676" stroke="#e6dfcc" stroke-width="3" fill="none"/></g>`);
const G5_FLAVOR = {
  oculus:()=>'尽头墙上开着一扇圆窗，收获月正好嵌在里面。月光斜斜地落在母亲的画像上。',
  chand:()=>'铁环吊灯上的蜡烛一根都没点。这条长廊里，只有月光。',
  bench:()=>'一条长木凳，正对着左墙那排画像。凳面上落满了灰，没有人坐过的痕迹。',
  banner:()=>'一面暗红的旗，绣着一头雄鹿——母亲娘家哈特维尔的家徽。旗子旁边就是一扇门。'
};
document.getElementById('l5Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L5') return;
  const o = g.dataset.obj; sfx.tap();
  if(G5_FLAVOR[o]) return say(G5_FLAVOR[o]());
  if(o.startsWith('slot')){ const slot=+o.slice(4);
    return openZoom(S5.ordered ? 'l5_p'+S5.order[slot] : 'l5_wall'); }
  if(o==='sconce') return pushSconce5();
  if(o==='easel') return openZoom('l5_canvas');
  if(o==='down') return goLevel('hall', '你沿着主楼梯走下去，回到了大厅。');
  openZoom('l5_'+o);
});
function pushSconce5(){
  if(!S5.lit) return say('左墙上嵌着一条铁轨道，轨道上挂着一盏能滑动的烛台。蜡烛是灭的，烛芯却还是软的——像是刚刚才被人吹熄。', 6000);
  const wrap = S5.stop===3;
  S5.stop = (S5.stop+1)%4; slide5(); updateAll();
  const id = S5.order[S5.stop], n = S5.stop+1;
  const tail = S5.revealed[id] ? '这幅画已经看过了。' : '厚涂的地方，起伏的颜料投下了一道道细细的阴影。点开这幅画看看。';
  say((wrap ? '你把烛台沿着轨道一路推回了起点，停在第一幅画旁边。' : `你把烛台沿着轨道往里推，停在第 ${n} 幅画旁边。烛光贴着墙面，斜斜地扫过画布。`) + tail, 5500);
}

/* ---------------- 记忆页 ⑤ 画布下的孩子 ---------------- */
MEMORIES.m5 = {no:'⑤', title:'画布下的孩子', moon:7, from:'L5', art:()=>memFrame(`
  <path d="M30,340 H570 V378 H30 Z" fill="#b9ab8b"/><path d="M30,340 H570" stroke="#2b251e" stroke-width="2"/>
  <path d="M36,120 L150,340 M36,190 L110,340" stroke="#efe6c8" stroke-width="10" opacity=".35"/>
  <g stroke="#2b251e" stroke-width="3" fill="none"><path d="M300,340 L330,110 L360,340 M330,110 V350"/></g>
  <rect x="240" y="120" width="190" height="150" fill="#cfc4a6" stroke="#2b251e" stroke-width="3"/>
  <g fill="#8a7a5c"><ellipse cx="278" cy="160" rx="10" ry="12"/><path d="M262,176 Q278,168 294,176 L298,262 L258,262 Z"/>
    <ellipse cx="322" cy="158" rx="10" ry="12"/><path d="M304,174 Q322,166 340,174 L348,262 L296,262 Z"/>
    <ellipse cx="398" cy="176" rx="8" ry="10"/><path d="M386,190 Q398,184 410,190 L414,262 L382,262 Z"/></g>
  <path d="M352,178 Q362,168 372,182 Q378,210 374,262 L348,262 Q346,214 352,178 Z" fill="#2b251e"/>
  <path d="M346,190 l26,-8 M346,214 l28,-9 M348,238 l26,-8" stroke="#4a3f33" stroke-width="3"/>
  <g fill="#2b251e">
    <path d="M444,142 Q462,126 484,140 L490,150 L440,152 Z"/><ellipse cx="466" cy="162" rx="12" ry="14"/>
    <path d="M446,178 Q466,170 488,180 L496,300 Q498,330 502,342 L432,342 Q436,330 438,300 Z"/>
    <path d="M450,190 Q420,198 392,206 L390,198 Q420,186 448,180 Z"/>
    <path d="M392,198 L374,206 L378,212 L394,206 Z"/>
  </g>
  <rect x="160" y="300" width="40" height="30" fill="#2b251e"/><path d="M172,300 Q180,290 190,300" stroke="#2b251e" stroke-width="3" fill="none"/>`, 7)};

/* ---------------- 提示（三级） ---------------- */
HINTS.L5 = function(){
  if(!S5.ordered){
    if(isReversed5()) return ['画里的人都望着身后的楼梯口。','好像整个反了过来。','橡树最小的那幅，应该挂在离入口最近的地方；最老的那棵，挂在最靠尽头的地方。'];
    return ['这些画像挂乱了。画里有什么东西，会随着年月变化？','看每幅画窗外的那棵橡树。',
      '点开左墙的画像，用画像之间的 ⇄ 交换相邻两幅：橡树从小到大，从入口往长廊尽头排。'];
  }
  if(!allRevealed5()){
    if(!S5.revealed.some(Boolean)) return ['墙上那盏烛台亮了。','从侧面照，厚涂的地方会有阴影。','烛台就停在第一幅画旁边——点开那幅画细看。看完后点击烛台，能沿轨道往里推。'];
    const id=S5.order[S5.stop];
    if(!S5.revealed[id]) return ['烛台旁边那幅画，还没细看。','点开烛台旁边那幅画。'];
    return ['还有画像的厚涂下面没看清。','烛台可以沿着轨道往里推。','点击左墙上的烛台，把它推到下一幅画旁边，再点开那幅画。'];
  }
  if(!S5.frameOpen) return ['画中的母亲抬起了手。','她指着画框的右下角。','点开长廊尽头母亲的画像，按下画框右下角的那朵玫瑰。'];
  if(!S5.keyTaken) return ['画框后面的墙洞里，挂着什么东西。','点开母亲的画像，取下墙洞里的钥匙。'];
  if(!S5.canvasSeen && !S5.doorOpen) return ['尽头那张空白画布……是留给谁的？','点开画架上的空白画布看看。看完，用雄鹿钥匙打开右边那扇门。'];
  if(S5.doorOpen) return ['雄鹿门开着，楼上是母亲的寝室。','点开右墙那扇门，走上楼去。'];
  return ['母亲的钥匙，能打开哪扇门？','右墙上挂着雄鹿旗的那扇门。','点开右边那扇门，用雄鹿钥匙开锁。'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L5 = ()=>{
  updateAll();
  if(!S5.entered){ S5.entered=true;
    say('主楼梯通向二楼的长廊。这里没有点灯，只有尽头圆窗里的月光。左墙上挂着一排家族画像——每一幅里，都有一块颜色不对劲的厚涂。', 8000); }
  else say(S5.doorOpen ? '你回到了长廊。画里的人都望着尽头，雄鹿门还虚掩着。' : '长廊里很静。画里的人都望着尽头。', 3600);
};

/* ---------------- 通关登记（调试起点用） ---------------- */
COMPLETE.L5 = ()=>{
  G.hall.lanternSeat='shield'; G.hall.gateOpen=true; take('elamp');
  Object.assign(S5, {entered:true, wallSeen:true, order:[0,1,2,3], ordered:true, lit:true, stop:3,
    revealed:[true,true,true,true], selfSeen:true, pointing:true, frameOpen:true, keyTaken:true, canvasSeen:true});
  give('skey'); G.progress.L5 = true; addMem('m5');
};

/* ---------------- 大厅联动：家族树 / 平台画像文案 ---------------- */
(()=>{ const ag = FAMILY.find(f=>f.id==='agnes'); if(ag){ ag.show = ()=>G.progress.L5 && S5.canvasSeen; ag.showYear = ()=>G.progress.L5; } })();
Object.defineProperty(HALL_FLAVOR, 'cloth', { enumerable:true, configurable:true, get(){
  return G.hall.gateOpen ? '楼梯平台上那幅大画被灰布盖得严严实实，布角用钉子钉死在画框上，掀不开。'
                         : '楼梯平台上挂着一幅大画，被一块灰布严严实实地盖着。它在铁栅门后面，够不着。'; } });
