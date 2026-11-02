/* =====================================================================
   第 8 关 · 雾湖鸦塔（终局）—— 状态 / 机关 / 限时月落 / 场景动态层 / 点击 / 特写 / 提示
   阶段 1 塔底：四尊石像，按底座橡叶大小（年代）放回孩子们最后握着的东西（麦穗 · 圣铃 · 手镜 · 木鹿）→ 螺旋梯升起
   阶段 2 塔顶：乌鸦撕散《家族之书》，按每页角落月亮的位置（东升 → 西落）把七页装回祭坛上的书壳
   阶段 3 鸦饮：圣杯接雨水 + 安眠药剂 → 放到乌鸦喙下 → 蜡烛滴蜡 → 鸦戒封喙（月落之前）
   阶段 4 骨铃：敲出母亲的摇篮曲 E G E D C D E C → 笼门打开 → 结局（鸦羽 7/7 → 真结局）
   ===================================================================== */
const S8 = {
  entered:false, sub:'base', topSeen:false, swoop:false,
  statues:[null,null,null,null], stTries:0, stairs:false, rising:false,
  scattered:false, floor:[false,false,false,false,false,false,false], tray:[], slots:[null,null,null,null,null,null,null],
  sel:null, sortWrong:0, sorted:false, revealing:false,
  moon:0, moonOn:false, moonCk:0, warned:0,
  cup:'empty', cupAt:'inv', filling:false, potionUsed:false,
  asleep:false, wax:false, sealed:false, shiver:false,
  played:'', hi:null, cageOpen:false, agnesAsleep:false,
  ended:null, endWhy:'', loops:0
};
LEVELS.L8.ready = true;
LEVELS.L8.title = 'The Raven Tower';

Object.assign(ITEMS, { leaves:{name:'Loose Pages', usedIn:[8]} });   // 散落的书页（拾起后暂存）
const PAGE8 = ['m1','m2','m3','m4','m5','m6','m7'];
const ORDER8 = ()=> [...PAGE8].sort((a,b)=>MEMORIES[a].moon - MEMORIES[b].moon);   // ⑥ ① ③ ⑦ ② ④ ⑤
const MOON_SECS8 = 420;   // 阶段 2 + 3：约 7 分钟真实时间

/* ---------------- 物品栏：书页 / 盛着药的圣杯 ---------------- */
TH.leaves = ()=>`<rect width="98" height="112" fill="#a39b87"/>
  ${[[-10,-6],[6,4],[-2,0]].map(([r,dx],i)=>`<g transform="translate(${49+dx},58) rotate(${r})"><rect x="-26" y="-20" width="52" height="38" fill="${['#cfc3a2','#d6caa9','#ddd2b4'][i]}" stroke="#2b251e" stroke-width="2"/>
    <path d="M-18,-8 H10 M-18,0 H16 M-18,8 H6" stroke="#8a7a5c" stroke-width="1.6"/><path d="M13,-17 V-11 Q14,-15 17,-16 Q20,-15 21,-11 V-17" stroke="#3b4148" stroke-width="1.6" fill="none"/></g>`).join('')}
  <text x="49" y="104" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#2b251e">${S8.tray.length} / 7</text>`;
const _thChalice8 = TH.chalice;
TH.chalice = ()=> _thChalice8() + (G.level==='L8' && S8.cup==='drug' ? `<ellipse cx="49" cy="23" rx="17" ry="3.1" fill="#7a3a7a" opacity=".8"/><path d="M40,22.6 q5,-1.4 10,0" stroke="#d8a8d8" stroke-width=".9" fill="none"/>` : '');
ITEM_INFO.leaves = ['散落的书页', ()=>`被乌鸦撕下来的记忆书页，已拾起 ${S8.tray.length} 页。放回祭坛上的书壳里。`];
ITEM_INFO.chalice = ['圣杯', ()=> G.level==='L8' ? ({empty:'一只空的锡圣杯。', water:'盛着雨水的圣杯。', drug:'雨水里化开了暗紫色的安眠药剂。'})[S8.cup] : (S.filled ? '盛着雨水的锡圣杯。' : '一只锡圣杯，杯身镶着三颗石子。')];
const syncCup8 = ()=>{ S.filled = S8.cup!=='empty'; };

/* ---------------- 音色 / 环境音 ---------------- */
const boneNote8 = (f, g=1)=>{ tone(f,1.5,'sine',.05*g); tone(f*2.76,.5,'sine',.014*g); tone(f*5.4,.16,'triangle',.007*g); noise(.03,4200,.02*g,4); };
const thump8 = ()=>{ tone(52,.32,'sine',.16,40); setTimeout(()=>tone(48,.28,'sine',.12,36), 260); };
const amb8 = {
  on:false, wind:null, rain:null,
  loop(freq, q, type){ const a=ac(), len=a.sampleRate*2, b=a.createBuffer(1,len,a.sampleRate), ch=b.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=Math.random()*2-1;
    const s=a.createBufferSource(); s.buffer=b; s.loop=true; const f=a.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q;
    const v=a.createGain(); v.gain.value=0; s.connect(f); f.connect(v); v.connect(master); s.start(); return {s, v, f}; },
  start(){ if(this.on) return this.level(); try{ const a=ac(); this.on=true;
      this.wind = this.loop(420,.7,'lowpass'); this.rain = this.loop(1500,.45,'bandpass');
      const l=a.createOscillator(), lg=a.createGain(); l.frequency.value=.07; lg.gain.value=160; l.connect(lg); lg.connect(this.wind.f.frequency); l.start();
      this.level(); }catch(e){} },
  level(){ if(!this.on) return; const t=AC.currentTime, top=S8.sub==='top' && !S8.ended;
    this.wind.v.gain.setTargetAtTime(S8.ended==='name' ? 0 : .035, t, 1.2);
    this.rain.v.gain.setTargetAtTime(top ? .022 : .006, t, 1.2); },
  stop(){ if(!this.on) return; const t=AC.currentTime; [this.wind,this.rain].forEach(n=>n.v.gain.setTargetAtTime(0,t,.8)); }
};

/* ---------------- 子场景切换 ---------------- */
function switchSub8(sub){
  G.busy = true; fadeEl.querySelector('p').textContent=''; fadeEl.classList.add('show');
  setTimeout(()=>{ S8.sub = sub; hintKey=''; updateAll(); amb8.level();
    setTimeout(()=>{ fadeEl.classList.remove('show'); G.busy=false;
      if(sub==='top' && !S8.topSeen) topArrive8();
      else if(sub==='top') say(S8.sealed ? '乌鸦僵在栖木上，一动不动。' : '塔顶的风很冷。窗外的月亮，又往下沉了一点。', 3600);
      else say('你沿着螺旋梯回到了塔底。四尊石像捧着东西，静静地站着。', 3600);
    }, 400);
  }, 500);
}
function topArrive8(){
  S8.topSeen = true; G.busy = true; updateAll();
  say('螺旋梯的尽头是塔顶。一只大得吓人的乌鸦栖在祭坛上方，红眼睛一眨不眨。右边吊着一只铁笼，一个小女孩扒着栏杆——是艾格尼丝。', 6500);
  setTimeout(()=>{ S8.swoop = true; sfx.caw(); noise(1.6,500,.08,.6); updateAll(); setTimeout(sfx.caw, 900); }, 4200);
  setTimeout(()=>{
    S8.swoop = false; take('fbook'); S8.scattered = true; S8.floor = PAGE8.map(()=>true);
    S8.moonOn = true; G.busy = false; updateAll(); sfx.blow();
    say('它扑下来，一口叼走了你怀里的《家族之书》，在半空里把它撕得粉碎。七页记忆散落在祭坛周围。……窗外的月亮，开始往下沉了。', 8000);
  }, 6800);
}

/* ---------------- 月落计时 ---------------- */
let tick8 = 0;
function drawSky8(){ const el=document.getElementById('t8Sky'); if(el) el.innerHTML = sky8(S8.moon); }
setInterval(()=>{
  if(G.level!=='L8' || !S8.moonOn || S8.sealed || S8.ended || G.busy || document.hidden) return;
  S8.moon = Math.min(1, S8.moon + 1/MOON_SECS8); tick8++;
  drawSky8();
  if(S8.moon>.75 && tick8%3===0) thump8();
  const cue = S8.moon>=.9 ? 3 : S8.moon>=.75 ? 2 : S8.moon>=.5 ? 1 : 0;
  if(cue > S8.warned){ S8.warned = cue;
    say(['','月亮已经沉到塔窗的一半了。','月亮快要碰到湖面了。你听见自己的心跳。','月亮只剩下最后一线——快！'][cue], 4500); }
  if(cur==='l8_window' && tick8%3===0) render();
  if(tick8%5===0) saveGame();
  if(S8.moon>=1) playEnding8('loop');
}, 1000);

/* ---------------- 阶段 1：石像 ---------------- */
const LEAF_CN8 = ['一片刚冒头的嫩橡叶，只有指甲盖那么大', '一片小小的橡叶', '一片舒展开的橡叶，比前两片都大', '一片又宽又老的橡叶，几乎占满了整面底座'];
function placeStatue8(i, k){
  if(S8.stairs || G.busy || !has(k)) return;
  const prev = S8.statues[i]; if(prev) give(prev);
  take(k); S8.statues[i] = k; sfx.pick(); setTimeout(()=>noise(.06,900,.06,2), 120);
  const n = S8.statues.filter(Boolean).length;
  if(n<4){ const m = `你把${ITEM_INFO[k][0]}放进了石像的手里。` + (prev ? `（换下了${ITEM_INFO[prev][0]}）` : '');
    cur ? act(m) : (say(m), updateAll()); return; }
  G.busy = true; cur ? act('四尊石像的手里都有了东西。……塔里静得能听见雾在流动。') : updateAll();
  setTimeout(()=>{
    const ok = S8.statues.every((it,j)=> it===ERA8[ST8[j].era].item);
    if(ok){ S8.stairs = true; S8.rising = true; G.busy = false; closeZoom(); updateAll();
      sfx.thud(); setTimeout(()=>{ noise(2.2,260,.1,.5); tone(65,2,'sine',.12,48); }, 300); setTimeout(sfx.chime, 2400);
      say('四尊石像同时合拢了手指。中央的石柱里传来石头摩擦的轰响——一级一级的踏步，从柱身里旋了出来。', 8000);
      setTimeout(()=>{ S8.rising = false; }, 3000);
      return; }
    S8.statues.forEach(it=> it && give(it)); S8.statues = [null,null,null,null]; S8.stTries++; G.busy = false;
    sfx.fail(); setTimeout(()=>noise(.25,700,.08,1.5), 200);
    const m = '石像的手指颤了一下，又松开了。它们手里的东西「当啷」一声，全掉回了你的脚边。' + (S8.stTries>=2 ? ' ……底座上的橡叶大小不一。橡树，是一年年长大的。' : '');
    if(cur){ shake(); act(m); } else { say(m, 6500); updateAll(); }
  }, 1500);
}

/* ---------------- 阶段 2：书页排序 ---------------- */
function pickPage8(i){
  if(!S8.floor[i]) return;
  S8.floor[i] = false; const id = PAGE8[i]; S8.tray.push(id); give('leaves'); sfx.open();
  const n = 7 - S8.floor.filter(Boolean).length, m = MEMORIES[id];
  say(`你拾起一页：${m.no} ${m.title}。（${n} / 7）` + (n===7 ? ' ——把它们放回祭坛上的书壳里。' : ''), 4200);
  updateAll();
}
function slotClick8(j){
  if(S8.sorted || G.busy) return;
  const occ = S8.slots[j];
  if(S8.sel){ const id = S8.sel; S8.tray = S8.tray.filter(x=>x!==id); if(occ) S8.tray.push(occ);
    S8.slots[j] = id; S8.sel = null; sfx.open();
    if(S8.slots.every(Boolean)) return judgePages8();
    return act(`你把 ${MEMORIES[id].no} 放进了第 ${j+1} 道页槽。`); }
  if(occ){ S8.slots[j] = null; S8.tray.push(occ); S8.sel = occ; sfx.tap(); return act(`你把 ${MEMORIES[occ].no} 从页槽里取了出来。`); }
  sfx.tap(); act(S8.tray.length ? '先点右边的一页书，再点它该去的页槽。' : '页槽是空的。书页还散在地上。');
}
function judgePages8(){
  G.busy = true; render();
  setCap('七页都装进去了。书壳「啪」地一声自己合上——');
  setTimeout(()=>{
    if(S8.slots.join()===ORDER8().join()) return pagesOK8();
    S8.sortWrong++; sfx.fail(); noise(.8,400,.08,.7); shake();
    S8.tray = [...S8.tray, ...S8.slots]; S8.slots = S8.slots.map(()=>null);
    let m = '书页燃起了黑色的火，一页页被弹了出来，落回你手里。纸边焦了，画却还在。';
    if(S8.sortWrong%3===0){ S8.moon = Math.min(.97, S8.moon+.07); drawSky8(); m += ' 窗外的月亮猛地往下一沉。'; }
    else if(S8.sortWrong===1) m += ' ……这不是那一夜发生的顺序。';
    else if(S8.sortWrong===2) m += ' 每一页的角落都画着同一扇窗。窗里的月亮，位置都不一样。';
    G.busy = false; act(m);
  }, 1500);
}
function pagesOK8(){
  S8.sorted = true; S8.revealing = true; S8.moonCk = S8.moon; take('leaves'); sfx.chime(); render();
  setCap('书合上了。封面上那只渡鸦的眼睛里，亮起了一道白光。');
  setTimeout(()=>{ closeZoom(); updateAll(); sfx.caw(); noise(1.2,700,.08,.8);
    say('光从书缝里射出来，刺得乌鸦惨叫一声，退回了栖木。黑羽一片片脱落——羽毛底下，是一个干瘪的老人的轮廓。', 7500);
    setTimeout(()=>{ S8.revealing = false; G.busy = false; tone(110,1.6,'sawtooth',.03,70); updateAll();
      say('它张开喙，嘶哑地吐出一个词：「SITIO……」——我渴。', 7000); }, 7800);
  }, 2600);
}

/* ---------------- 阶段 3：鸦饮 · 封喙 ---------------- */
function sill8(){
  if(G.busy) return;
  if(S8.cupAt==='sill'){
    if(S8.filling) return setCap('雨水正一滴一滴落进圣杯里。');
    if(S8.cup==='water' && held==='potion') return pour8();
    S8.cupAt = 'inv'; give('chalice'); syncCup8(); sfx.pick();
    return act(S8.cup==='empty' ? '你拿回了圣杯。' : S8.cup==='water' ? '你端起了盛满雨水的圣杯。' : '你端起圣杯。暗紫色的水面轻轻晃着。');
  }
  if(!has('chalice')) return act('窗台上积着一洼雨水。得有个能盛水的东西。');
  if(S8.cup!=='empty') return act(S8.cup==='water' ? '圣杯里已经盛满雨水了。' : '圣杯里已经是安眠之水了。');
  take('chalice'); S8.cupAt = 'sill'; S8.filling = true; sfx.tap(); act('你把圣杯放在窗台上，接着从窗缝里滴进来的雨水……');
  setTimeout(()=>{ S8.filling = false; S8.cup = 'water'; syncCup8(); sfx.water();
    act('雨水接满了一杯。「天空的眼泪」——和石屋里那天一样。' + (has('potion') ? ' ……契约背面说的，是「安眠之水」。' : '')); }, 2200);
}
function pour8(){
  if(!has('potion') || S8.cup!=='water') return;
  take('potion'); S8.potionUsed = true; S8.cup = 'drug'; syncCup8(); hold(null); sfx.water(); setTimeout(()=>tone(300,.6,'sine',.03,180), 200);
  act('你拔开 H 瓶的塞子，把暗紫色的药剂全倒进了圣杯。雨水慢慢变成了淡紫色——这是母亲当年下在麦酒里的药。');
}
function ledge8(){
  if(G.busy) return;
  if(!S8.sorted){ sfx.caw(); shake(); return act('乌鸦猛地探下头来啄你的手。你缩了回去——它还守着它的契约。'); }
  if(S8.asleep) return act(S8.sealed ? '乌鸦再也不会醒了。' : '圣杯空了。乌鸦睡得很沉。');
  if(S8.cupAt==='sill') return act('圣杯还放在窗台上。');
  if(!has('chalice')) return act('乌鸦的喙下有一块凸出的石台，像是专门放杯子的。');
  if(S8.cup==='empty'){ sfx.caw(); return act('你举起空圣杯。乌鸦低头看了看，嘶哑地说：「SITIO……」它要的是水。'); }
  take('chalice'); S8.cupAt = 'ledge'; G.busy = true; sfx.tap(); act('你把圣杯放在乌鸦喙下的石台上。它低下头，盯着杯里的水……');
  setTimeout(()=>{ sfx.water(); setTimeout(sfx.water, 500);
    if(S8.cup==='drug'){ S8.cup = 'empty'; S8.asleep = true; syncCup8(); G.busy = false; tone(180,1.8,'sine',.04,90);
      act('它把杯里的水喝得一滴不剩。红眼睛慢慢眯起来，脑袋一点一点垂了下去……乌鸦睡着了。'); return; }
    S8.cup = 'empty'; syncCup8(); setCap('它把雨水喝得一滴不剩。红眼睛反而更亮了——它抖开翅膀，长长地叫了一声。');
    setTimeout(()=>{ G.busy = false; closeZoom(); playEnding8('loop', 'water'); }, 2600);
  }, 1400);
}
function candle8(){
  if(G.busy) return;
  if(!S8.sorted){ sfx.caw(); shake(); return act('你刚伸手去拿蜡烛，乌鸦就扑了一下翅膀，火苗被扇得直晃。'); }
  if(S8.sealed) return act('蜡已经凝固了。');
  if(!S8.asleep){ sfx.flame(); setTimeout(sfx.caw, 500); shake();
    return act('你斜过蜡烛，蜡油滴在乌鸦的喙上——它醒着，猛地甩头，在栖木上来回刮喙，蜡一片片碎掉了。……得先让它睡着。'); }
  if(S8.wax) return act('喙上的蜡还软着。');
  S8.wax = true; sfx.flame(); act('你斜过祭坛上的蜡烛。滚烫的蜡油一滴、两滴，落在乌鸦合拢的喙缝上，慢慢鼓成了一团。');
}
function beak8(){
  if(G.busy) return;
  if(S8.sealed) return act('鸦戒的印子深深地压在蜡上。');
  if(!S8.sorted || !S8.asleep){ sfx.caw(); return act('你够不着它的喙——它醒着，正盯着你。'); }
  if(!has('ring')) return act('得用什么东西把它封住。');
  if(!S8.wax) return act('你把鸦戒按在它的喙上，什么也没留下。……喙上得先有蜡。');
  take('ring'); S8.sealed = true; S8.moonOn = false; S8.shiver = true; G.busy = true; sfx.thud(); setTimeout(()=>tone(70,2.4,'sine',.12,45), 200);
  act('你把鸦戒狠狠按进软蜡里。戒面上的渡鸦，印在了它自己的喙上。');
  setTimeout(()=>{ S8.shiver = false; G.busy = false; closeZoom(); updateAll();
    say('乌鸦浑身一颤，僵住了。窗外的月亮停在了湖面上方，不再下沉。——「若立约之鸦饮下安眠之水，于月落之前，以立约之戒封其喙，则此约毁。」', 9000); }, 2200);
}

/* ---------------- 阶段 4：骨铃 · 摇篮曲 ---------------- */
function bone8click(i){
  if(G.busy) return;
  boneNote8(FREQ8[i]); S8.hi = i; render(); setTimeout(()=>{ if(S8.hi===i){ S8.hi=null; if(cur==='l8_cage') render(); } }, 380);
  if(!S8.sealed){ S8.played = ''; setTimeout(sfx.caw, 300);
    return setCap(S8.sorted ? '骨铃一响，乌鸦的头就猛地转了过来，冲你张开了喙。……它还醒着，你不敢再敲。' : '骨铃一响，乌鸦就扑打着翅膀冲你尖叫。'); }
  if(S8.cageOpen) return;
  S8.played = (S8.played + NOTES8[i]).slice(-8);
  if(S8.played===SONG8) return cageOpen8();
  setCap(`叮——（${S8.played.split('').join(' ')}）`);
}
function cageOpen8(){
  G.busy = true; S8.cageOpen = true;
  setCap('……是那支摇篮曲。');
  [...SONG8].forEach((n,k)=> setTimeout(()=>{ boneNote8(FREQ8[NOTES8.indexOf(n)], .55); }, 900 + k*480));
  setTimeout(()=>{ S8.agnesAsleep = true; sfx.clack(); setTimeout(sfx.creak, 200); render(); updateAll();
    setCap('最后一个音落下，笼门的锁「咔」地弹开了。艾格尼丝靠着栏杆，在歌声里睡着了。'); }, 900 + 8*480 + 300);
  setTimeout(()=>{ closeZoom(); G.busy = false;
    playEnding8(Object.values(G.feathers).every(Boolean) ? 'name' : 'break'); }, 900 + 8*480 + 4200);
}

/* ---------------- 失败后重来（回到阶段 3；书页已排好则不必再排） ---------------- */
function retry8(){
  S8.ended = null; S8.endWhy = ''; Object.assign(S8, {swoop:false, revealing:false, sel:null, hi:null});
  if(S8.cupAt!=='inv' || !has('chalice')){ S8.cupAt = 'inv'; give('chalice'); }
  S8.cup = 'empty'; S8.filling = false; syncCup8();
  if(S8.potionUsed && !has('potion')){ give('potion'); S8.potionUsed = false; }
  Object.assign(S8, {asleep:false, wax:false, sealed:false, shiver:false, played:'', cageOpen:false, agnesAsleep:false, warned:0, sub:'top'});
  if(!has('ring')) give('ring');
  if(!S8.sorted){ S8.tray = [...S8.tray, ...S8.slots.filter(Boolean)]; S8.slots = S8.slots.map(()=>null);
    S8.floor.forEach((f,i)=>{ if(f){ S8.floor[i]=false; S8.tray.push(PAGE8[i]); } }); if(S8.tray.length) give('leaves'); }
  S8.moon = S8.sorted ? Math.min(S8.moonCk, .4) : .12; S8.warned = S8.moon>=.5 ? 1 : 0;
  S8.moonOn = true; drawSky8(); updateAll(); amb8.level();
}

/* ---------------- 场景动态层 ---------------- */
SCENES.L8 = function(){
  const top = S8.sub==='top';
  document.getElementById('b8Bg').style.display = top ? 'none' : '';
  document.getElementById('t8Bg').style.display = top ? '' : 'none';
  document.getElementById('b8Hot').style.display = top ? 'none' : '';
  document.getElementById('t8Hot').style.display = top ? '' : 'none';
  document.getElementById('lvTitle').textContent = top ? 'The Roost' : 'The Raven Tower';
  document.getElementById('b8Up').style.display = S8.stairs ? '' : 'none';
  let s='';
  if(!top){
    s+=`<g class="${S8.rising?'b8rise':''}">${stairs8(S8.stairs)}</g>`;
    if(S8.stairs) s+=`<rect x="364" y="20" width="100" height="560" fill="none" stroke="#f0d9a0" stroke-width="2" class="pulse"/>`;
    ST8.forEach((st,i)=> s+= statue8(i, S8.statues[i], S8.stairs));
  }else{
    drawSky8();
    PAGE8.forEach((id,i)=>{ const el=document.getElementById('t8pg'+i); if(el) el.style.display = S8.floor[i] ? '' : 'none';
      if(S8.floor[i]){ const [x,y,r]=T8.pages[i]; s+=page8(x,y,r,id); } });
    // 祭坛上的书壳
    s+= S8.sorted ? `<g ${b8s}><path d="M378,448 L450,448 L446,438 L382,438 Z" fill="#4a2a22"/><path d="M382,438 L446,438" stroke="#d8cfb4" stroke-width="2"/></g>
          <circle cx="414" cy="440" r="${S8.revealing?60:26}" fill="url(#b8Glow)" class="${S8.revealing?'':'pulse'}"/>`
        : S8.scattered ? `<g ${b8s}><path d="M368,450 Q390,440 414,446 Q438,440 460,450 L460,455 Q438,446 414,452 Q390,446 368,455 Z" fill="#4a2a22"/>
            <path d="M372,449 Q392,442 414,447 Q436,442 456,449" fill="none" stroke="#8a6a50" stroke-width="1" stroke-dasharray="2 2"/></g>` : '';
    // 圣杯：窗台 / 喙下石台
    if(S8.cupAt==='sill') s+= cup8(150, 442, .42, S8.cup);
    if(S8.cupAt==='ledge' && !S8.sealed) s+= cup8(T8.ledge.x, T8.ledge.y, .5, S8.cup);
    // 乌鸦
    const R = T8.raven, st = S8.sealed ? 'sealed' : S8.asleep ? 'asleep' : S8.sorted ? 'revealed' : 'awake';
    s+=`<g class="${S8.swoop?'t8swoop':''}"><g transform="translate(${R.x},${R.y}) scale(${R.k})"><g class="${S8.shiver?'t8shiver':S8.sealed?'':'t8breathe'}">${raven8(st)}</g></g></g>`;
    if(S8.revealing) s+= [[400,220],[470,200],[380,160],[500,250],[440,140]].map(([x,y],i)=>`<g class="t8fall" style="animation-delay:${i*.4}s"><g transform="translate(${x},${y}) rotate(${i*40})"><path d="M0,0 Q4,-12 10,-22" stroke="#0e0c0a" stroke-width="2" fill="none"/><path d="M2,-6 l-4,-2 M4,-12 l-4,-3 M6,-17 l-3,-3" stroke="#1d1915" stroke-width="1.2"/></g></g>`).join('');
    if(S8.sorted && !S8.asleep) s+=`<circle cx="${T8.ledge.x}" cy="${T8.ledge.y-10}" r="26" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
    // 铁笼 + 骨铃
    s+=`<g class="${S8.cageOpen?'':'t8sway'}">${cage8({open:S8.cageOpen, asleep:S8.agnesAsleep})}${chimes8({hi:S8.hi})}</g>`;
    if(S8.sealed && !S8.cageOpen) s+=`<rect x="596" y="446" width="138" height="78" rx="6" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
    if(S8.moonOn && !S8.sealed && S8.moon>.75) s+=`<rect width="828" height="709" fill="#3a0c08" opacity="${n8((S8.moon-.75)*.5)}" class="pulse"/>`;
  }
  s+=`<rect width="828" height="709" fill="url(#l8-vig)"/>`;
  document.getElementById('l8Dyn').innerHTML = s;
};

/* ---------------- 场景点击 ---------------- */
const L8_FLAVOR = {
  bwin:()=>'窄窗外全是雾。湖水拍着塔基，声音闷闷的。',
  beye:()=>'地面嵌着一只睁开的石眼——和石屋地毯上的花纹一模一样。',
  downstairs:()=>null
};
// 回城堡找线索：吊桥一直放着；离开鸦塔期间月亮不会继续下沉（计时只在 L8 里走）
function leave8(){
  if(G.busy) return;
  closeZoom(); amb8.stop();
  goLevel('hall', '你推开塔门，沿着吊桥走回城堡。身后的鸦塔亮着一点红光——吊桥没有收起。', ()=>
    say('你回到了大厅。想找什么线索，就去那几间屋子里看看；从大门走上吊桥，就能回到鸦塔。', 6500));
}
document.getElementById('l8Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L8' || S8.ended) return;
  const o = g.dataset.obj; sfx.tap();
  if(L8_FLAVOR[o]){ const t=L8_FLAVOR[o](); if(t) return say(t, 4800); }
  if(o==='bdoor' || o==='leave8') return leave8();
  if(/^st\d$/.test(o)){ const i=+o[2];
    if(held && OFFER8.includes(held) && !S8.stairs){ const k=held; hold(null); return placeStatue8(i, k); }
    return openZoom('l8_st'+i); }
  if(/^pg\d$/.test(o)) return pickPage8(+o[2]);
  switch(o){
    case 'pillar': if(S8.stairs) return switchSub8('top'); return openZoom('l8_pillar');
    case 'upstairs': if(S8.stairs) return switchSub8('top'); return;
    case 'downstairs': return switchSub8('base');
    case 'twin': return openZoom('l8_window');
    case 'raven': return openZoom('l8_raven');
    case 'altar': return openZoom('l8_altar');
    case 'cage': return openZoom('l8_cage');
  }
});

/* ---------------- 特写 ---------------- */
const thumb8 = (k, x, y, w=70)=>`<svg x="${x}" y="${y}" width="${w}" height="${n8(w*112/98)}" viewBox="0 0 98 112">${(TH[k]||TH._generic)()}</svg>`;
const pageSvg8 = (id, x, y, w)=>`<svg x="${x}" y="${y}" width="${w}" height="${n8(w*2/3)}" viewBox="0 0 600 400">${MEMORIES[id].art()}</svg>`;
for(let i=0;i<4;i++) VIEWS['l8_st'+i] = ()=>{
  const s = ST8[i], e = ERA8[s.era], it = S8.statues[i], at = e.girl ? [0,41] : [13,50];
  const avail = OFFER8.filter(k=>has(k));
  return { title:'Stone Child',
    cap: S8.stairs ? `石像捧着${ITEM_INFO[it][0]}，手指合拢了。`
      : `一尊石雕的孩子，闭着眼睛，${e.girl?'双手拢在胸前':'一只手垂在身侧，手指弯着'}，像是原本握着什么。底座上刻着${LEAF_CN8[s.era]}。` + (it ? `现在它手里是${ITEM_INFO[it][0]}。` : ''),
    svg:`<rect width="600" height="400" fill="#4a463c"/><path d="M0,80 Q300,60 600,80 M0,160 Q300,146 600,160 M0,240 Q300,232 600,240 M0,320 Q300,318 600,320" stroke="#3a362e" stroke-width="2" fill="none"/>
      <rect x="150" y="300" width="250" height="100" fill="url(#b8Ped)" ${b8k}/><rect x="140" y="292" width="270" height="14" fill="#6e6a5c" ${b8k}/>
      ${oakLeaf8(275, 352, e.leaf*1.35)}
      <g filter="url(#b8-stoneF)"><g transform="translate(275,${292-104*2.55}) scale(2.55)">${CH.person(kidOpts8(s.era))}</g></g>
      ${it ? `<g id="z-take" class="${S8.stairs?'':'zhot'}"><g transform="translate(275,${292-104*2.55}) scale(2.55)">${CH.held[HELD8[it]](...at)}</g></g>` : ''}
      ${S8.stairs ? '' : `<rect x="440" y="20" width="146" height="${avail.length ? 40+avail.length*84 : 80}" rx="4" fill="#2b251e" opacity=".55"/>
        <text x="513" y="44" text-anchor="middle" ${UI_FONT} font-size="13" fill="#e6dfcc">${avail.length?'放进它手里':'手里没有能给它的东西'}</text>
        ${avail.map((k,j)=>`<g id="z-o${k}" class="zhot">${thumb8(k, 478, 54+j*84, 70)}</g>`).join('')}`}`,
    bind(){
      avail.forEach(k=> on('z-o'+k, ()=> placeStatue8(i, k)));
      on('z-take', ()=>{ if(S8.stairs || !S8.statues[i]) return; const k=S8.statues[i]; S8.statues[i]=null; give(k); sfx.tap(); act(`你把${ITEM_INFO[k][0]}拿了回来。`); });
    }
  };
};
VIEWS.l8_pillar = ()=>({ title:'The Pillar',
  cap:'石柱上刻着一圈字：「四个孩子在此等候。窗外的橡树一年年长高，他们却永远七岁。把他们最后握着的东西，还给他们。」',
  svg:`<rect width="600" height="400" fill="#3a362e"/><rect x="170" y="0" width="260" height="400" fill="url(#b8Pil)" ${b8k}/>
    <rect x="80" y="144" width="440" height="112" rx="3" fill="#5e5a4c" ${b8k}/>
    <rect x="90" y="152" width="420" height="96" rx="2" fill="none" stroke="#3e3a30" stroke-width="1.4"/>
    <path d="M92,154 H508" stroke="#7a7464" stroke-width="1" opacity=".6"/>
    <text x="300" y="190" text-anchor="middle" font-family="Georgia,serif" font-size="17" letter-spacing="3" fill="#24201a">QVATTVOR · PVERI · HIC · MANENT</text>
    <text x="300" y="226" text-anchor="middle" ${UI_FONT} font-size="15" fill="#24201a">把他们最后握着的东西，还给他们</text>
    ${[0,1,2,3].map(i=>oakLeaf8(206+i*62, 296, [.5,.74,.98,1.24][i]*.9)).join('')}
    <path d="M206,330 H392" stroke="#24201a" stroke-width="1.4" marker-end="url(#none)"/><path d="M384,325 L394,330 L384,335" stroke="#24201a" stroke-width="1.4" fill="none"/>
    ${[0,1,2,3,4,5].map(k=>`<rect x="${k%2?352:236}" y="${28+k*20}" width="12" height="10" fill="#0c0a08"/>`).join('')}` });
VIEWS.l8_altar = ()=>{
  if(S8.sorted) return { title:'The Altar', cap:'《家族之书》合上了，静静躺在祭坛上。封面上的渡鸦，眼睛是白的。',
    svg:`<rect width="600" height="400" fill="#3a362e"/><rect x="60" y="250" width="480" height="150" fill="url(#t8Stone)" ${b8k}/>
      <circle cx="300" cy="200" r="150" fill="url(#b8Glow)"/>
      <g transform="translate(300,200) scale(3.2) translate(-49,-58)">${ART.fbook(7)}</g>` };
  const slotW = 70, slotX = j=> 23+j*80;
  return { title:'The Altar',
    cap: !S8.tray.length && !S8.slots.some(Boolean) ? '祭坛上是一本空书壳，七道页槽。书页还散在地上。'
      : '一本空书壳，七道页槽。要按那一夜真正发生的先后，把书页装回去。先点右边的一页书，再点页槽。',
    svg:`<rect width="600" height="400" fill="#3a362e"/>
      <path d="M8,18 Q150,8 300,24 Q450,8 592,18 L592,128 Q450,118 300,132 Q150,118 8,128 Z" fill="#4a2a22" ${b8k}/>
      <path d="M300,24 V132" stroke="#2a1812" stroke-width="2"/>
      ${S8.slots.map((id,j)=>`<g id="z-s${j}" class="zhot"><rect x="${slotX(j)}" y="40" width="${slotW}" height="47" fill="${id?'#d6caa9':'#2a1812'}" stroke="#d8cfb4" stroke-width="1.4" stroke-dasharray="${id?'':'4 3'}"/>
          ${id ? pageSvg8(id, slotX(j), 40, slotW) : ''}
          <text x="${slotX(j)+35}" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#d8cfb4">${['I','II','III','IV','V','VI','VII'][j]}</text></g>`).join('')}
      <rect x="18" y="148" width="334" height="226" fill="#2b251e" stroke="#1a1511" stroke-width="2"/>
      ${S8.sel ? `${pageSvg8(S8.sel, 22, 152, 326)}<text x="185" y="392" text-anchor="middle" ${UI_FONT} font-size="13" fill="#e6dfcc">${MEMORIES[S8.sel].no} ${MEMORIES[S8.sel].title}</text>`
        : `<text x="185" y="266" text-anchor="middle" ${UI_FONT} font-size="14" font-style="italic" fill="#8a826d">点一页书，在这里看清它</text>`}
      ${S8.tray.map((id,k)=>`<g id="z-t${k}" class="zhot"><rect x="${368+(k%3)*76}" y="${152+Math.floor(k/3)*62}" width="70" height="47" fill="#d6caa9" stroke="${S8.sel===id?'#efc463':'#1a1511'}" stroke-width="${S8.sel===id?3:1.4}"/>${pageSvg8(id, 368+(k%3)*76, 152+Math.floor(k/3)*62, 70)}</g>`).join('')}
      ${S8.tray.length ? '' : `<text x="482" y="200" text-anchor="middle" ${UI_FONT} font-size="13" font-style="italic" fill="#8a826d">${S8.floor.some(Boolean)?'书页还散在地上':''}</text>`}`,
    bind(){
      S8.slots.forEach((_,j)=> on('z-s'+j, ()=> slotClick8(j)));
      S8.tray.forEach((id,k)=> on('z-t'+k, ()=>{ if(G.busy) return; S8.sel = S8.sel===id ? null : id; sfx.open(); render(); }));
    }
  };
};
VIEWS.l8_window = ()=>{
  const t = S8.moon, mx = 300-120*t, my = 80+330*Math.pow(t,1.15);
  return { title:'Tower Window',
    cap: S8.cupAt==='sill' ? (S8.filling ? '雨水正一滴一滴落进圣杯里。' : S8.cup==='water' ? '圣杯里接满了雨水。' + (held==='potion' ? '' : '') : S8.cup==='drug' ? '圣杯里是淡紫色的安眠之水。' : '圣杯放在窗台上。')
      : '塔窗外下着雨，月亮挂在湖上。窗缝里漏进来的雨水，在窗台上积了一小洼。' + (S8.moonOn && !S8.sealed ? (t>.75 ? '——月亮就快落进湖里了。' : t>.5 ? '月亮已经沉过一半了。' : '') : ''),
    svg:`<defs><clipPath id="z8w"><path d="M120,330 L120,110 Q130,30 300,14 Q470,30 480,110 L480,330 Z"/></clipPath></defs>
      <rect width="600" height="400" fill="#3a362e"/>
      <path d="M100,340 L100,104 Q114,10 300,-6 Q486,10 500,104 L500,340 Z" fill="#5e5a4c" ${b8k}/>
      <g clip-path="url(#z8w)"><rect width="600" height="400" fill="#1e2632"/><rect width="600" height="400" fill="url(#t8Dawn)" opacity="${n8(Math.pow(t,1.6)*.95)}"/>
        <circle cx="${n8(mx)}" cy="${n8(my)}" r="60" fill="#e8e4d4" opacity=".08"/><circle cx="${n8(mx)}" cy="${n8(my)}" r="30" fill="#e8e4d4"/>
        <circle cx="${n8(mx-8)}" cy="${n8(my-6)}" r="6" fill="#cfc9b6"/><circle cx="${n8(mx+10)}" cy="${n8(my+8)}" r="4" fill="#cfc9b6"/>
        <path d="M120,290 Q220,270 300,282 Q400,266 480,280 V340 H120 Z" fill="#2a3036"/>
        <g class="zrain" stroke="#b8c8cc" stroke-width="1.2" opacity=".6">${[...Array(30)].map((_,i)=>`<path d="M${120+i*12},${(i*47)%300} l-7,30"/>`).join('')}</g></g>
      <path d="M300,14 V330 M120,170 H480 M120,250 H480" stroke="#1a1511" stroke-width="5"/>
      <path d="M80,330 H520 L530,360 H70 Z" fill="#6e6a5c" ${b8k}/>
      <ellipse cx="300" cy="342" rx="150" ry="8" fill="#55646b"/>
      <path d="M296,330 q2,4 0,8 M320,331 q2,4 0,8" stroke="#8ea8ae" stroke-width="1.6" fill="none" class="pulse"/>
      <g id="z-sill" class="zhot"><rect x="200" y="226" width="200" height="130" fill="transparent" stroke="none"/>
        ${S8.cupAt==='sill' ? `<g transform="translate(300,346) scale(1.5) translate(-49,-92)">${ART.chalice(S8.cup!=='empty')}${S8.cup==='drug'?`<ellipse cx="49" cy="23" rx="17" ry="3.1" fill="#7a3a7a" opacity=".8"/>`:''}</g>
          ${S8.filling ? `<path d="M300,180 V200" stroke="#b8c8cc" stroke-width="2" stroke-dasharray="3 6" class="zrain"/>` : ''}`
          : `<ellipse cx="300" cy="342" rx="40" ry="10" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`}</g>`,
    bind(){ on('z-sill', sill8); }
  };
};
VIEWS.l8_raven = ()=>{
  const st = S8.sealed ? 'sealed' : S8.asleep ? 'asleep' : S8.sorted ? 'revealed' : 'awake';
  return { title:'The Raven',
    cap: S8.sealed ? '鸦戒的印子压在红蜡上。乌鸦一动不动，像一尊黑石头。'
      : S8.asleep ? (S8.wax ? '喙缝上鼓着一团软蜡。' : '乌鸦睡着了，脑袋垂在胸前。祭坛上的蜡烛还燃着。')
      : S8.sorted ? '羽毛脱落的地方，露出一张干瘪的老人的脸。它盯着你，嘶哑地重复：「SITIO……」喙下有一块放杯子的石台。'
      : '一只大得吓人的乌鸦。它的眼睛是暗红色的——和书房里那幅画像一样。',
    svg:`<rect width="600" height="400" fill="#2a261e"/><path d="M0,60 Q300,40 600,60 M0,140 Q300,124 600,140 M0,220 Q300,210 600,220" stroke="#221e18" stroke-width="2" fill="none"/>
      <path d="M0,330 Q200,318 300,322 Q420,326 600,316" stroke="#15110d" stroke-width="30" fill="none"/>
      <path d="M0,330 Q200,318 300,322 Q420,326 600,316" stroke="#3a2e22" stroke-width="22" fill="none"/>
      <g id="z-beak" class="zhot"><g transform="translate(456,324) scale(1.55)"><g class="${S8.sealed?'':'t8breathe'}">${raven8(st)}</g></g></g>
      <g id="z-ledge" class="zhot"><path d="M216,204 H346 L336,226 Q281,242 226,226 Z" fill="url(#t8Stone)" ${b8k}/>
        ${S8.cupAt==='ledge' && !S8.asleep ? `<g transform="translate(281,204) scale(1.1) translate(-49,-92)">${ART.chalice(S8.cup!=='empty')}${S8.cup==='drug'?`<ellipse cx="49" cy="23" rx="17" ry="3.1" fill="#7a3a7a" opacity=".8"/>`:''}</g>`
          : S8.cupAt==='ledge' ? `<g transform="translate(281,204) scale(1.1) translate(-49,-92)">${ART.chalice(false)}</g>`
          : `<ellipse cx="281" cy="204" rx="40" ry="8" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`}</g>
      <g id="z-candle" class="zhot"><rect x="36" y="300" width="18" height="70" fill="#e3dac0" ${b8s}/><path d="M36,310 q-3,14 0,24 M54,316 q3,10 0,18" stroke="#c8bea4" stroke-width="3" fill="none"/>
        <path d="M45,300 v-8" stroke="#1a1511" stroke-width="1.4"/><circle cx="45" cy="282" r="40" fill="url(#t8-warm)"/>
        <path class="flame" d="M45,268 q7,11 4,18 q-4,4 -8,0 q-3,-7 4,-18 Z" fill="#ffd27a"/></g>`,
    bind(){ on('z-ledge', ledge8); on('z-candle', candle8); on('z-beak', beak8); }
  };
};
VIEWS.l8_cage = ()=>{
  const {x0} = {x0:150}, dx = 50;
  const lines = !S8.sealed ? '「它一直在看着我……」艾格尼丝小声说，「爸爸说，今晚我就七岁了。」'
    : '「爸爸以前给我唱过一首歌，」她扒着栏杆说，「他说，是奶奶唱给姑姑听的。」';
  return { title:'The Iron Cage',
    cap: S8.cageOpen ? '笼门开了。艾格尼丝睡着了。'
      : `铁笼的锁上系着一排七根骨头，每根上都刻着一个字母。${S8.sealed ? '骨铃轻轻晃着。' : '乌鸦的眼睛，一直盯着这里。'}`,
    svg:`<rect width="600" height="400" fill="#2a261e"/>
      <g transform="translate(300,-112) scale(.84) translate(-664,0)">${cage8({open:S8.cageOpen, asleep:S8.agnesAsleep})}</g>
      <g id="z-agnes" class="zhot"><rect x="250" y="30" width="100" height="200" fill="transparent" stroke="none"/></g>
      <rect x="100" y="250" width="400" height="140" rx="6" fill="#1e1a16" opacity=".85"/>
      <path d="M120,266 H480" stroke="#1a1511" stroke-width="6" stroke-linecap="round"/><path d="M120,265 H480" stroke="#5a564c" stroke-width="2"/>
      ${NOTES8.map((n,i)=>{ const x = x0+i*dx, len = 96-i*7;
        return `<g id="z-b${i}" class="zhot"><rect x="${x-20}" y="266" width="40" height="${len+30}" fill="transparent" stroke="none"/>
          <path d="M${x},266 V276" stroke="#6a5a40" stroke-width="1.4"/>${bone8(x, 276, 276+len, 8, S8.hi===i?'#fff2c8':'#d8cfb4')}
          ${S8.hi===i?`<circle cx="${x}" cy="${276+len/2}" r="26" fill="url(#b8Glow)"/>`:''}
          <text x="${x}" y="${276+len/2+5}" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="#2b251e" stroke="#f4ecd4" stroke-width="3" paint-order="stroke">${n}</text></g>`; }).join('')}
      ${S8.sealed && !S8.cageOpen && S8.played ? uiTag(300, 384, S8.played.split('').join(' '), {w:180}) : ''}`,
    bind(){ NOTES8.forEach((_,i)=> on('z-b'+i, ()=> bone8click(i))); on('z-agnes', ()=>{ if(!G.busy){ sfx.tap(); setCap(S8.cageOpen ? '她睡得很安稳。' : lines); } }); }
  };
};
// 物品栏放大镜看圣杯：在鸦塔里可以直接倒进安眠药剂
const _vChalice8 = VIEWS.chalice;
VIEWS.chalice = ()=>{
  if(G.level!=='L8') return _vChalice8();
  const canPour = S8.cup==='water' && has('potion');
  return { title:'Chalice', cap: ITEM_INFO.chalice[1]() + (canPour ? ' 安眠药剂还在你身上。' : ''),
    svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,330) scale(3) translate(-49,-92)">${ART.chalice(S8.cup!=='empty')}
        ${S8.cup==='drug'?`<ellipse cx="49" cy="23" rx="17" ry="3.1" fill="#7a3a7a" opacity=".8"/>`:''}</g>
      ${canPour ? uiBtn('z-pour', 410, 340, 170, '倒入安眠药剂') : ''}`,
    bind(){ on('z-pour', pour8); }
  };
};

/* ---------------- 提示（三级） ---------------- */
HINTS.L8 = function(){
  if(S8.ended) return ['……'];
  if(!S8.stairs){
    if(S8.sub==='top') return ['……'];
    return ['四尊石像的手都空着，像是原本握着什么。', '石柱上的字说：把他们最后握着的东西还给他们。底座上的橡叶大小不一——还记得长廊里四幅画像窗外的那棵橡树吗？',
      '橡叶从小到大：1316 麦穗 · 1349 圣铃 · 1382 手镜 · 1415 木鹿。点开石像，从右边选东西放进它手里。'];
  }
  if(S8.sub==='base') return S8.sealed ? ['塔顶还有一件事没做完。','沿着石柱的螺旋梯上去。'] : ['石柱里旋出了一级级踏步。', '点击中央的石柱，或右下角的箭头，上到塔顶。'];
  if(!S8.topSeen) return ['……'];
  if(S8.floor.some(Boolean)) return ['书页散落在祭坛周围。', '地上那几张发白的纸，就是被撕下来的记忆。', '点击地上的书页，把七页都捡起来。'];
  if(!S8.sorted) return ['书壳要的不是你找到它们的顺序，而是那一夜发生的顺序。', '每一页的角落都有一扇小窗，窗里画着月亮。月亮从东边升起，往西边落下。',
    '按月亮从低到高、再落下的顺序：⑥ 母亲的摇篮曲 → ① 被锁的夜 → ③ 母亲的药 → ⑦ 哥哥的告密 → ② 被抹去的名字 → ④ 没有到来的马车 → ⑤ 画布下的孩子。'];
  if(!S8.asleep){
    if(S8.cup==='empty' && S8.cupAt!=='sill') return ['「SITIO」——我渴。和石屋里那只乌鸦一样。', '「天空的眼泪」……窗外在下雨。', '点开左边的塔窗，把圣杯放在窗台上接雨水。'];
    if(S8.cupAt==='sill' && S8.filling) return ['雨水还在往杯里滴。'];
    if(S8.cup==='water') return ['契约背面的解除条款：「若立约之鸦饮下安眠之水……」', '只给它清水，它只会更有力气。母亲的安眠药剂还在你身上。',
      S8.cupAt==='sill' ? '单击物品栏里的安眠药剂拿在手上，再点窗台上的圣杯。' : '点物品栏里圣杯右上角的放大镜，把安眠药剂倒进去。'];
    if(S8.cupAt==='sill') return ['安眠之水准备好了。', '把圣杯从窗台上拿回来，放到乌鸦喙下的石台上。'];
    return ['安眠之水准备好了。', '乌鸦的喙下有一块放杯子的石台。', '点开乌鸦，点它喙下的石台，把圣杯放上去。'];
  }
  if(!S8.sealed){
    if(!S8.wax) return ['「……以立约之戒封其喙。」', '要把喙封住，得先有东西能留下戒印。', '点开乌鸦，点左边祭坛上的蜡烛，把蜡油滴在它的喙上。'];
    return ['蜡还软着。', '「以立约之戒封其喙」——立约之戒就是书房鸟笼里的鸦戒。', '点开乌鸦，点它的喙，按下鸦戒。'];
  }
  if(!S8.cageOpen) return ['乌鸦不会再醒了。艾格尼丝还在笼子里。', '笼锁上系着七根刻了字母的骨头。母亲的音乐盒、镜子里的那支曲子……',
    '点开铁笼，依次敲：E G E D C D E C。'];
  return ['……'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L8 = ()=>{
  amb8.start(); drawSky8();
  if(S8.ended) return showEndCard8(S8.ended);
  if(!S8.entered){ S8.entered = true;
    try{ const cur = localStorage.getItem(SAVE_KEY); if(cur && JSON.parse(cur).G.level==='hall') localStorage.setItem('ravenhold-preL8', cur); }catch(e){}
    updateAll(); sfx.caw();
    say('吊桥尽头是湖心的鸦塔。塔底是一间圆形的石厅，四尊孩子的石像围着中央的石柱站着——它们都闭着眼睛，手里空空的。', 8000);
    return; }
  if(S8.sub==='top' && !S8.scattered && S8.topSeen){ S8.topSeen = false; return topArrive8(); }
  say(S8.sub==='top' ? '塔顶的风很冷。' : '鸦塔的塔底。', 3000);
};
INTRO.L8 = ON_ENTER.L8;

/* ---------------- 调试起点 ---------------- */
START_POINTS.push({id:'L8', label:'第 8 关 · 雾湖鸦塔（终局）', level:'L8', before:['L1','L2','L3','L4','L5','L6','L7'],
  inv:['chalice','fbook','bell','potion','deer','wheat','hmirror','ring','pact']});
COMPLETE.L8 = ()=>{};
