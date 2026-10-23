/* =====================================================================
   第 3 关 · 厨房与酒窖 —— 状态 / 场景动态层 / 点击 / 熬药计时 / 提示
   新机制：道具合成、倒水量取、听声计时（策划案第 4 章）
   ===================================================================== */
const S3 = {
  entered:false, sub:'kitchen',
  lampTaken:false, lampHung:false, trapOpen:false,
  knocked:{}, lidOpen:false, took:{recipe:false, vial:false},
  water:{bucket:0, pot:0, chal:0}, sel:null,
  cauldron:{water:0, seeds:false, paste:false},
  bellOnScale:false, pinch:0, leaves:0,
  boiling:false, caws:0, brew:null, flash:false,
  potionDone:false, fireOut:false, marthaAwake:false, tunnel:false
};
LEVELS.L3.ready = true;
LEVELS.L3.title = 'The Kitchen';

Object.assign(ITEMS, {
  lamp:    {name:'Lantern',      usedIn:[3]},     // 厨房 → 照亮酒窖（挂上后不再占格）
  recipe:  {name:'Recipe',       usedIn:[3]},     // 母亲的配方 + 草药图谱
  vial:    {name:'H Vial',       usedIn:[3]},     // 空药瓶（刻 H）
  potion:  {name:'Sleep Draught',usedIn:[8]},     // 安眠药剂 · 第 8 关混入圣杯
  poppy:   {name:'Poppy',        usedIn:[3]},
  valerian:{name:'Valerian',     usedIn:[3]},
  seeds:   {name:'Poppy Seeds',  usedIn:[3]},
  paste:   {name:'Valerian Paste',usedIn:[3]}
});
BADGES.vial = ()=> S3.brew==='good' && !S3.potionDone ? '可装药' : '';
// 草药是一次性材料：罂粟称出籽、缬草捣成泥后就用掉了。熬坏倒掉后，架上会再露出一束备用的。
const herbGone = h => h==='poppy'    ? (has('poppy')    || has('seeds') || S3.cauldron.seeds || S3.potionDone)
                    : h==='valerian' ? (has('valerian') || has('paste') || S3.cauldron.paste || S3.potionDone) : false;

/* ---------------- 音效 ---------------- */
const crowCaw = ()=>{ tone(560,.28,'sawtooth',.05,300); noise(.28,1200,.07,3); };
const knockDull = ()=>{ tone(90,.22,'sine',.16,60); noise(.08,300,.1,1); };
const knockHollow = ()=>{ tone(150,.6,'sine',.12,120); tone(300,.5,'triangle',.04,250); noise(.1,700,.07,1.5); setTimeout(()=>tone(150,.4,'sine',.05,130),180); };
const pour = ()=>{ noise(.5,900,.05,.8); for(let i=0;i<4;i++) setTimeout(()=>tone(500+Math.random()*400,.08,'sine',.03,300),i*90); };
const hiss = ()=>noise(1.1,2600,.07,.5);

/* ---------------- 子场景切换 ---------------- */
function switchSub(sub){
  G.busy = true; fadeEl.querySelector('p').textContent=''; fadeEl.classList.add('show');
  setTimeout(()=>{
    S3.sub = sub; let msg='';
    if(sub==='cellar'){
      if(has('lamp')){ take('lamp'); S3.lampHung=true; msg='你提着灯走下木梯，把它挂在拱顶的铁钩上。昏黄的光照出了一整排酒桶。'; }
      else if(!S3.lampHung) msg='漆黑一片……楼梯上透下来的光只够照见脚下几级台阶。也许该带盏灯来。';
    }else msg = S3.potionDone ? '' : '你爬回了厨房。';
    hintKey=''; updateAll();
    setTimeout(()=>{ fadeEl.classList.remove('show'); G.busy=false; msg && say(msg, 5500); }, 400);
  }, 600);
}

/* ---------------- 玛莎梦话：随进度变化，兼作一级提示 ---------------- */
function marthaLine(){
  if(S3.potionDone) return '玛莎在梦里喃喃：「人人都喝了……除了埃德蒙少爷，他说他不渴。」';
  if(!S3.took.recipe){
    if(!S3.lampHung && !has('lamp')) return '玛莎在梦里喃喃：「夫人说……药要配得一滴不差……地窖里黑……提着灯去……」';
    return '玛莎在梦里喃喃：「那一年……小姐出生那年……夫人亲手封了一桶……」';
  }
  if(S3.cauldron.water!==4) return '玛莎在梦里喃喃：「四勺……一滴不能多……圣杯是三勺的……」';
  if(!S3.cauldron.seeds && !has('seeds')) return '玛莎在梦里喃喃：「罂粟籽……和圣铃一样重……」';
  if(!S3.cauldron.paste && !has('paste')) return '玛莎在梦里喃喃：「缬草……九片叶子……捣碎……画着骷髅的那两束碰不得……」';
  if(S3.boiling) return '玛莎在梦里也在数：「……一声……两声……」';
  if(S3.brew!=='good') return '玛莎在梦里喃喃：「挂到火上……数着乌鸦叫……第七声……」';
  return '玛莎在梦里喃喃：「装进夫人的小瓶子里……」';
}
function marthaWake(msg){
  S3.marthaAwake = true; updateAll(); setTimeout(sfx.fail, 60);
  say(msg || '玛莎猛地惊醒：「不是那束！」……然后又歪着头睡着了。', 4500);
  setTimeout(()=>{ S3.marthaAwake=false; updateAll(); }, 2400);
}

/* ---------------- 熬药：数窗外鸦啼，第 7 声离火 ---------------- */
let boilT = null;
const BREW_COL = n => n<3 ? '#55646b' : n<8 ? '#7f9a5a' : n===99 ? '#7a4a6a' : '#141210';   // 熬时看不出第 7 声；离火后合格的药才显出暗紫（BREW_COL(99)）
function startBoil(){
  S3.boiling = true; S3.caws = 0; S3.brew = null; hiss();
  const next = ()=>{ boilT = setTimeout(()=>{
    if(!S3.boiling) return;
    S3.caws++; crowCaw(); S3.flash = true; updateAll(); if(cur==='k_stove') render();
    setTimeout(()=>{ S3.flash=false; updateAll(); }, 260);
    if(S3.caws >= 10){ takeOff(true); return; }
    next();
  }, 2000 + Math.random()*3000); };
  next();
}
function takeOff(auto){
  clearTimeout(boilT); S3.boiling = false; hiss();
  const n = S3.caws;
  if(n===7){ S3.brew='good'; sfx.chime(); return n; }
  S3.brew = n<7 ? 'weak' : 'poison';
  const msg = n<7 ? '药汤是淡绿色的，闻起来只有一股草味——太早了，药性还没出来。你只好把它倒掉——好在草药架上还挂着备用的草药。'
                  : (auto ? '锅里「咕嘟」一声，药汤熬成了黑色，冒出一股苦臭——熬过头了，成了毒。你只好把它倒掉——好在草药架上还挂着备用的草药。'
                          : '药汤已经变成了黑色，冒出一股苦臭——熬过头了，成了毒。你只好把它倒掉——好在草药架上还挂着备用的草药。');
  S3.cauldron = {water:0, seeds:false, paste:false}; S3.brew = null;   // 材料随药汤倒掉，草药架上会露出备用的一束
  sfx.fail(); if(n>7) setTimeout(()=>marthaWake('玛莎皱着鼻子惊醒：「糊了！糊了！」……又打起了呼噜。'), 600);
  if(cur) setCap(msg); else say(msg, 6000);
  return n;
}
function bottlePotion(){
  take('vial'); take('poppy'); take('valerian'); take('recipe'); give('potion'); S3.potionDone = true; S3.brew = 'bottled';
  S3.cauldron = {water:0, seeds:false, paste:false};
  G.progress.L3 = true; sfx.pick();
  act('你把药汤小心地灌进那只刻着 H 的小瓶，塞紧了瓶塞。');
  setTimeout(()=>{
    closeZoom(); say(marthaLine(), 6000);
    setTimeout(()=>showMemory('m3', ()=>{
      S3.tunnel = true; sfx.thud(); setTimeout(()=>noise(1.2,300,.08,.5), 200); updateAll();
      say('脚下的地窖里传来一阵砖石滑落的闷响……', 5000);
    }), 5200);
  }, 2200);
}

/* ---------------- 场景动态层 ---------------- */
SCENES.L3 = function(){
  const k = S3.sub==='kitchen';
  document.getElementById('k3Bg').style.display = k ? '' : 'none';
  document.getElementById('w3Bg').style.display = k ? 'none' : '';
  document.getElementById('k3Hot').style.display = k ? '' : 'none';
  document.getElementById('w3Hot').style.display = k ? 'none' : '';
  document.getElementById('lvTitle').textContent = k ? 'The Kitchen' : 'The Cellar';
  let s='';
  if(k){
    // 草药架：已取走的那束不再挂着
    RACK_ORDER.forEach((h,i)=>{ if(herbGone(h)) return;
      s+=`<g transform="translate(${K3.rackX[i]},146) scale(.95)">${herbArt(h)}</g>`; });
    if(!S3.lampTaken) s+=`<g transform="translate(316,376)">${lampArt(true)}</g><circle cx="316" cy="362" r="34" fill="url(#l3-lamp)"/>`;
    // 研钵（餐边柜）
    s+=`<path d="M276,362 l16,-22" stroke="#6e5a44" stroke-width="4" stroke-linecap="round"/>${S3.leaves?`<ellipse cx="270" cy="366" rx="12" ry="2.4" fill="#6f8a4a"/>`:''}`;
    // 天平（餐桌）
    const tilt = S3.bellOnScale ? Math.max(-7, Math.min(7, (S3.pinch-5)*2.2 - (S3.pinch<5?4:0))) : 0;
    s+=`<g ${ck}><rect x="324" y="420" width="6" height="32" fill="#4a3a2c"/><rect x="312" y="448" width="30" height="6" fill="#4a3a2c"/>
        <g transform="rotate(${-tilt} 327 420)"><path d="M297,420 H357" stroke-width="3"/>
          <path d="M297,420 L290,436 M297,420 L304,436 M357,420 L350,436 M357,420 L364,436" stroke-width="1"/>
          <path d="M287,436 Q297,442 307,436 Z M347,436 Q357,442 367,436 Z" fill="#8a7a5c"/>
          ${S3.bellOnScale?`<path d="M291,435 Q291,425 297,424 Q303,425 303,435 Z" fill="#b39c6e" stroke-width="1"/>`:''}
          ${S3.pinch?`<ellipse cx="357" cy="435" rx="${3+S3.pinch*.6}" ry="2" fill="#2e2a24" stroke="none"/>`:''}</g></g>`;
    // 活门
    s+= S3.trapOpen
      ? `<polygon points="${K3.trap}" fill="#070605" ${ck}/><path d="M92,600 L120,612 M236,604 L210,612" stroke="#d9c48e" stroke-width="1" opacity=".0"/>
         <polygon points="86,610 248,610 236,520 98,520" fill="#4a3a2c" ${ck}/><path d="M118,520 L114,610 M166,520 L166,610 M214,520 L218,610" stroke="#2c241b" stroke-width="1.6"/>
         ${S3.lampHung?'<polygon points="96,614 238,614 250,664 78,664" fill="#ffc56e" opacity=".1"/>':''}`
      : `<polygon points="${K3.trap}" fill="#4a3a2c" ${ck}/><path d="M126,610 L118,670 M166,610 L164,670 M206,610 L210,670" stroke="#2c241b" stroke-width="1.6"/>
         <circle cx="166" cy="640" r="8" fill="none" stroke="#1a1511" stroke-width="3"/>`;
    // 灶火
    if(!S3.fireOut) s+=`<circle cx="570" cy="456" r="70" fill="url(#l3-fire)" opacity=".55"/>
        <path class="flame" d="M540,474 Q548,440 556,452 Q562,424 572,446 Q582,428 588,452 Q598,440 600,474 Z" fill="#f2a83e"/>
        <path class="flame" d="M552,474 Q560,452 566,462 Q572,448 578,462 Q584,454 588,474 Z" fill="#ffd27a"/>`;
    else s+=`<path d="M560,470 q-6,-14 4,-24 q8,-10 0,-22 M580,470 q6,-12 -2,-22" stroke="#6a6458" stroke-width="2" fill="none" opacity=".6"/>`;
    // 铁锅
    const c=S3.cauldron, filled = c.water>0 || S3.brew==='good';
    s+=`<g ${ck}><path d="M528,320 L528,300 M590,320 L590,300" stroke-width="2"/>
        <path d="M522,322 Q522,352 559,354 Q596,352 596,322 Z" fill="#1d1b19"/><ellipse cx="559" cy="322" rx="37" ry="6" fill="#2a2826"/>
        ${filled?`<ellipse cx="559" cy="323" rx="32" ry="4" fill="${S3.boiling?BREW_COL(S3.caws):S3.brew==='good'?BREW_COL(99):(c.seeds||c.paste)?'#6a7a5a':'#55646b'}" stroke="none"/>`:''}</g>`;
    if(S3.boiling) s+=`<path d="M546,312 q-8,-14 2,-26 q8,-12 -2,-26 M570,312 q8,-14 -2,-26 q-8,-12 2,-26" stroke="#d6d2c4" stroke-width="2.4" fill="none" opacity=".45" class="pulse"/>`;
    // 水桶（缸边）
    s+=`<g ${ck}><path d="M700,624 L706,662 L742,662 L748,624 Z" fill="#5a4636"/><ellipse cx="724" cy="624" rx="24" ry="5" fill="#3a2e23"/>
        ${S3.water.bucket?`<ellipse cx="724" cy="625" rx="20" ry="3.4" fill="#3c4a50" stroke="none"/>`:''}
        <path d="M702,640 H746" stroke="#2a2119" stroke-width="3"/><path d="M702,624 Q724,596 746,624" fill="none" stroke-width="2"/></g>`;
    s+= marthaArt(S3.marthaAwake);
    if(S3.flash) s+=`<path d="M224,320 L224,206 Q226,178 245,166 Q264,178 266,206 L266,320 Z" fill="#e8ecef" opacity=".35"/>
        <use href="#sym-raven" x="232" y="190" width="26" height="26" style="color:#0c0a08"/>`;
    s+=`<rect width="828" height="709" fill="#0a0806" opacity="${S3.fireOut?.2:0}"/>`;
  }else{
    if(S3.tunnel) s+=`<path d="${W3.tunnel}" fill="#050403" ${ck}/>
        <path d="M330,500 q-10,-14 0,-26 q8,-10 -4,-22 M352,504 q8,-12 -2,-24" stroke="#9aa3a4" stroke-width="1.4" fill="none" opacity=".4"/>
        ${[[290,528,28],[322,540,22],[354,532,26],[376,548,24],[306,556,20]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="11" fill="#6e6a5e" ${ck} transform="rotate(${(x%17)-8} ${x} ${y})"/>`).join('')}`;
    s+= w3Barrels();
    if(S3.lidOpen){ const b4=W3.barrels[3]; s+=`<g transform="translate(${b4.hx-86},${b4.hy+b4.R+6}) rotate(-8)"><ellipse rx="${b4.R*.6}" ry="${b4.R*.22}" fill="#6e5038" ${ck}/><path d="M${-b4.R*.5},0 H${b4.R*.5}" stroke="#4e3826" stroke-width="1.4"/></g>`; }
    if(S3.lampHung) s+=`<circle cx="${W3.hookX}" cy="190" r="360" fill="url(#l3-lamp)"/><g transform="translate(${W3.hookX+6},184)">${lampArt(true)}</g>`;
    else s+=`<path fill="#050403" opacity=".93" fill-rule="evenodd" d="M0,0H828V709H0Z ${W3.stairs}"/>
        <polygon points="126,520 246,520 290,600 90,600" fill="#d9c48e" opacity=".06"/>`;
  }
  s+=`<rect width="828" height="709" fill="url(#l3-vig)"/>`;
  document.getElementById('l3Dyn').innerHTML = s;
};

/* ---------------- 场景点击 ---------------- */
const K3_FLAVOR = {
  k_window:'窗外的枯枝上停着几只乌鸦，一动不动地盯着灶火。',
  k_shelf:'架子上是盐罐、干豆和一罐发硬的蜂蜜。',
  w_niche:'壁龛里放着一只落满灰的陶壶，壶里早就干了。',
  w_crate:'木箱里塞着几只空酒瓶，瓶颈上缠着蛛网。',
  w_hook:'拱顶垂下来的铁钩，正好能挂一盏灯。'
};
document.getElementById('l3Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L3') return;
  const o = g.dataset.obj; sfx.tap();
  if(S3.sub==='cellar' && !S3.lampHung && o!=='w_stairs') return say('太暗了，什么都看不见。');
  if(o==='w_hook' && S3.lampHung) return say('提灯在铁钩上轻轻摇晃。');
  if(K3_FLAVOR[o]) return say(K3_FLAVOR[o]);
  switch(o){
    case 'k_door':   return goLevel('hall', '', ()=>say(S3.potionDone ? '你回到了大厅。长餐桌上的盘子里，好像都积着一层麦酒干掉的痕迹。' : '你回到了大厅。', 5000));
    case 'k_martha': return say(marthaLine(), 6000);
    case 'k_lamp':
      if(S3.lampTaken) return say('餐边柜上只剩一圈灯油的印子。');
      S3.lampTaken = true; give('lamp'); sfx.pick(); updateAll(); return say('你提起了餐边柜上的提灯。灯芯还亮着。');
    case 'k_trap':
      if(!S3.trapOpen){ S3.trapOpen = true; sfx.creak(); updateAll(); return say('你拉起铁环，活门「吱呀」一声翻开了。下面是通往地窖的木梯，黑洞洞的。'); }
      return switchSub('cellar');
    case 'w_stairs': return switchSub('kitchen');
    case 'w_wall':
      if(S3.tunnel) return enterLevel('L4');
      return say('这几块砖和别处的不一样，砖缝里透出一丝冷风。墙后面像是空的。');
  }
  openZoom(o);
});

/* ---------------- 记忆页 ③ 母亲的药 ---------------- */
MEMORIES.m3 = {no:'③', title:'母亲的药', moon:3, from:'L3', art:()=>memFrame(`
  <rect x="30" y="364" width="540" height="10" fill="#b9ab8b"/><path d="M30,364 H470" stroke="#2b251e" stroke-width="2"/>
  <path d="M60,364 V150 M60,200 H200 M60,280 H180" stroke="#b3a586" stroke-width="2"/>
  <g fill="#7a6650" stroke="#2b251e" stroke-width="3">
    <ellipse cx="170" cy="300" rx="62" ry="64"/><path d="M108,300 H232 M118,262 Q170,250 222,262 M118,338 Q170,350 222,338" fill="none"/>
    <ellipse cx="170" cy="236" rx="40" ry="10" fill="#5e4e3a"/></g>
  ${CH.sil('isabel', 318, 116, 1.3, {hold:'point', len:192}, true)}
  <g fill="#2b251e"><path d="M258,224 l-10,6 l6,12 l11,-7 Z"/></g>
  <path d="M248,236 q-6,8 -10,14 M244,240 q-4,8 -8,12" stroke="#6a7a5a" stroke-width="3" fill="none"/>
  <path d="M440,364 L440,300 L470,300 L470,256 L500,256 L500,212 L530,212 L530,168 L560,168" fill="none" stroke="#5e4e3a" stroke-width="4"/>
  <g fill="#2b251e"><path d="M500,212 h18 v-6 q-2,-6 -10,-6 l-8,0 Z"/><rect x="503" y="186" width="6" height="18"/><rect x="511" y="186" width="6" height="18"/></g>
  <path d="M496,212 h34" stroke="#2b251e" stroke-width="3"/>`, 3)};

/* ---------------- 提示（三级） ---------------- */
HINTS.L3 = function(){
  if(!S3.lampHung && !has('lamp')) return ['地窖里一定很黑。','餐边柜上有一盏提灯。','点击餐边柜上的提灯拿起来，再拉开地上的活门下到酒窖。'];
  if(!S3.lampHung) return ['地板上有一扇活门。','拉开地上的活门，提着灯下去。'];
  if(!S3.took.recipe){
    if(S3.sub==='kitchen') return ['母亲把东西藏在了地窖里。','从地上的活门下到酒窖去。'];
    if(!S3.lidOpen) return ['母亲把东西藏在了对她最重要的那一年。','铅牌上说「为她出生之年」。受洗册残页上写着她生于哪一年。','玛格丽生于 1408 年。打开酒桶特写，敲一敲每只桶——1408 那只是空的。'];
    return ['酒桶里有一个暗格。','打开酒桶特写，把暗格里的东西都拿走。'];
  }
  if(S3.potionDone) return S3.tunnel ? ['酒窖深处的墙塌开了一个口子。','那是母亲当年挖的逃生地道。','从酒窖右墙的洞口钻进地道。'] : ['……'];
  const c=S3.cauldron;
  if(c.water!==4 && !S3.brew) return ['「四勺月露，不可多一滴。」','水桶八勺，陶罐五勺，圣杯正好能装三勺。','先装满五勺的陶罐，倒进圣杯——剩二勺；倒空圣杯，把二勺倒进圣杯；再装满陶罐，倒满圣杯——陶罐里就剩四勺。把它倒进铁锅。'];
  if(!c.seeds && !has('seeds')){
    if(!has('poppy')) return ['「罂粟籽」……','草药架上挂着四束草，对照配方背面的图谱认一认。','罂粟是结着圆蒴果的那一束（右数第二束）。画着骷髅的毛地黄和颠茄碰不得。'];
    return ['「罂粟籽与圣铃同重。」','餐桌上有一架天平。','在天平左盘放上圣铃，右盘一撮一撮地加罂粟籽，直到两边平衡。'];
  }
  if(!c.paste && !has('paste')){
    if(!has('valerian')) return ['「缬草九叶」……','草药架上，叶子成对排列、开着小白花的那一束是缬草。','从草药架上取下缬草（左数第二束）。'];
    return ['「缬草九叶」。','餐边柜上有一只研钵。','往研钵里放正好九片缬草叶，再用杵捣碎。'];
  }
  if(!c.seeds || !c.paste) return ['材料都准备好了。','打开灶台特写，把罂粟籽和缬草泥放进铁锅。'];
  if(S3.fireOut) return ['灶火灭了。','打开灶台特写，拨一拨灶膛里的余烬。'];
  if(!S3.brew && !S3.boiling) return ['「火上数到第七声鸦啼。」','把铁锅挂到火上，然后仔细听窗外的乌鸦。','开火后数乌鸦的叫声，第七声刚响完就点「离火」。'];
  if(S3.boiling) return ['仔细听窗外的乌鸦叫……','第七声之后马上离火。'];
  if(S3.brew==='good' && !S3.potionDone) return ['药熬好了，要装进什么里呢？','用暗格里那只刻着 H 的空药瓶装药。'];
  if(!S3.tunnel) return ['……'];
  return ['酒窖深处的墙塌开了一个口子。','那是母亲当年挖的逃生地道。'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L3 = ()=>{
  S3.sub = S3.sub || 'kitchen'; updateAll();
  if(!S3.entered){ S3.entered = true;
    say('你挑开门闩，走下几级石阶，来到厨房。灶火还没熄，老厨娘玛莎歪在灶边打着呼噜。', 6500); }
  else say(S3.sub==='kitchen' ? '玛莎还在灶边打呼噜。' : '酒窖里静悄悄的。', 3000);
};

/* ---------------- 通关登记（调试起点用） ---------------- */
COMPLETE.L3 = ()=>{
  G.hall.kitchenOpen = true; take('snuffer');
  Object.assign(S3, {entered:true, lampTaken:true, lampHung:true, trapOpen:true, lidOpen:true, knocked:{1408:'hollow'},
    took:{recipe:true, vial:true}, potionDone:true, brew:'bottled', tunnel:true});
  take('tag'); give('potion');
  G.progress.L3 = true; addMem('m3');
};
