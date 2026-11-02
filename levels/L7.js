/* =====================================================================
   第 7 关 · 书房与钟楼 —— 状态 / 机关 / 场景动态层 / 点击 / 提示 / 通关登记 / 大厅联动
   新机制：跨关推算（年份锁 1448）+ 镜像阅读（手镜读契约背面）+ 机关联动（钟楼敲钟 → 书房铁匣）
   流程：读信 → 鸟笼年份锁算出 1448 得鸦戒 → 上钟楼装铜齿轮 → 钟面 XII + 月相满月 → 拉下重锤敲十二响
        → 书房铁匣开、吊桥放下 → 读契约正面 → 手镜读背面解除条款 → 读完信 → 记忆页 ⑦ → 书房门回大厅
   ===================================================================== */
const S7 = {
  entered:false, sub:'study', towerSeen:false,
  letterPage:0, letterRead:[false,false],
  digits:[1,4,1,5], cageOpen:false, ringTaken:false, cageSway:false,
  gearSet:false, hour:3, phase:0, planSeen:false,
  wy:TW7.wTop, struck:false, bellSwing:false, spin:false,
  chestOpen:false, pactTaken:false, pactSide:0, lens:false, pactFront:false, pactBack:false,
  doorOpen:false
};
LEVELS.L7.ready = true;
LEVELS.L7.title = 'The Study';

Object.assign(ITEMS, {
  ring:{name:'Raven Ring', usedIn:[8]},    // 鸟笼里的鸦戒 · 第 8 关封喙
  pact:{name:'The Pact',   usedIn:[8]}     // 契约 · 第 8 关的规则依据（解除条款）
});

const CN7 = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
const ROMAN7 = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
const thunk7 = ()=>{ tone(90,.3,'sine',.14,60); noise(.08,900,.08,2); };

/* ---------------- 子场景切换 ---------------- */
function switchSub7(sub){
  G.busy = true; fadeEl.querySelector('p').textContent=''; fadeEl.classList.add('show');
  setTimeout(()=>{ S7.sub = sub; hintKey=''; updateAll();
    setTimeout(()=>{ fadeEl.classList.remove('show'); G.busy=false;
      if(sub==='tower' && !S7.towerSeen){ S7.towerSeen=true;
        say('楼梯通向钟楼的机芯室。大钟吊在铁框架里，一动不动——钟面上的指针停着，旁边还有一块月相盘。', 6500); }
    }, 400);
  }, 500);
}

/* ---------------- 拉下重锤（钟楼核心机关） ---------------- */
function pull7(){
  if(S7.struck) return say('重锤已经落到底了。钟声的余音，还在塔里嗡嗡地响。', 4000);
  G.busy = true; S7.spin = true; S7.wy = TW7.wTop + 40; sfx.creak(); updateAll();
  const reset = (msg, ms=6000)=>{ S7.spin=false; S7.wy=TW7.wTop; G.busy=false; updateAll(); say(msg, ms); };
  if(!S7.gearSet) return setTimeout(()=>{ noise(.4,1400,.05,2);
    reset('重锤往下一沉，前两根轴转了几圈——可第三根轴是空的，力传到那里就断了。钟锤一动不动，重锤又被弹簧拽了回去。'); }, 1600);
  if(S7.phase!==2) return setTimeout(()=>{ thunk7();
    reset(`齿轮咬上了，钟锤抬起来……「嗒」，只碰了一下钟壁就落了回去。月相盘停在「${PHASE7[S7.phase]}」，机芯像是在等着什么。`); }, 1500);
  const n = S7.hour, gap = S7.hour===12 ? 900 : 700;
  for(let i=0;i<n;i++) setTimeout(()=>{ bigBell(); S7.bellSwing=true; updateAll(); say(`当——（${CN7[i]}）`, gap+200); }, 1200 + i*gap);
  setTimeout(()=>{
    S7.bellSwing = false;
    if(n!==12) return reset(`钟敲了 ${CN7[n-1]} 下，停了。楼下没有任何动静。——不是这个钟点。`);
    S7.struck = true; S7.spin = false; S7.wy = TW7.wTop + 110; S7.chestOpen = true; S7.doorOpen = false;
    G.hall.drawbridgeDown = true; G.busy = false; updateAll();
    setTimeout(()=>{ noise(1.4,300,.08,.5); tone(70,1.6,'sine',.12,50); }, 300);
    say('第十二声的余音还没散，楼下传来铁链被拉动的哗啦声。窗外很远的地方，吊桥轰隆隆地放了下来。', 8000);
  }, 1200 + n*gap + 600);
}

/* ---------------- 本关完成：契约背面 + 埃德蒙的信 → 记忆页 ⑦ ---------------- */
function checkDone7(){
  if(G.progress.L7 || !S7.pactBack || !S7.letterRead.every(Boolean)) return false;
  G.progress.L7 = true; G.busy = true;
  setTimeout(()=>{ G.busy = false; closeZoom();
    showMemory('m7', ()=>{ S7.doorOpen = true; sfx.clack(); setTimeout(sfx.creak, 200); updateAll();
      say('十二岁的埃德蒙，提着那盏刻着 E 的灯，敲开了父亲的门。……书房的门闩，在刚才的钟声里震落了。门外就是主楼梯。', 8000); });
  }, 2600);
  return true;
}

/* ---------------- 场景动态层 ---------------- */
SCENES.L7 = function(){
  const st = S7.sub==='study';
  document.getElementById('s7Bg').style.display = st ? '' : 'none';
  document.getElementById('t7Bg').style.display = st ? 'none' : '';
  document.getElementById('s7Hot').style.display = st ? '' : 'none';
  document.getElementById('t7Hot').style.display = st ? 'none' : '';
  document.getElementById('lvTitle').textContent = st ? 'The Study' : 'The Clock Tower';
  let s='';
  if(st){
    s+=`<g transform="translate(370,336) scale(.66,.646)">${portraitAldric7()}</g>`;
    s+=`<g class="${S7.cageSway?'s7sway':''}">${cageArt7({ring:!S7.ringTaken})}</g>`; S7.cageSway=false;
    if(S7.cageOpen) s+=`<path d="M615,262 L632,226 L630,196" stroke="#1a1511" stroke-width="1.6" fill="none"/>`;
    if(!S7.cageOpen) s+=`<circle cx="${ST7.cage.x}" cy="${ST7.cage.bot+10}" r="16" fill="none" stroke="#efe6c8" stroke-width="1.2" class="pulse"/>`;
    s+=chestArt7(S7.chestOpen);
    if(S7.chestOpen && !S7.pactTaken) s+=`<g transform="translate(647,452) scale(.32)">${pactArt7()}</g><circle cx="647" cy="452" r="22" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
    s+=`<g transform="translate(176,466) rotate(-4)">${letterArt7()}</g>`;
    if(!S7.letterRead.every(Boolean)) s+=`<circle cx="204" cy="478" r="24" fill="none" stroke="#efe6c8" stroke-width="1.2" class="pulse" opacity=".7"/>`;
    if(S7.doorOpen) s+=`<path d="${ST7.door}" fill="#0c0a08" stroke="#1a1511" stroke-width="1.3"/>
        <path d="M560,520 L560,410 Q558,390 548,380 L540,392 L540,512 Z" fill="#3e3024" stroke="#1a1511" stroke-width="1.3"/>
        <ellipse cx="524" cy="460" rx="18" ry="60" fill="#ffc56e" opacity=".07"/>
        <path d="${ST7.door}" fill="none" stroke="#f0d9a0" stroke-width="2.2" class="pulse"/>`;
    s+=`<circle cx="${ST7.chest.chainX}" cy="118" r="5" fill="#15110d"/>`;
  }else{
    // 钟面 + 月相盘
    s+=`<g transform="translate(${TW7.dial.x},${TW7.dial.y})">${clockFaceArt7(TW7.dial.r, S7.hour)}</g>`;
    s+=`<g transform="translate(${TW7.moon.x},${TW7.moon.y})">${moonDiscArt7(TW7.moon.r, S7.phase)}</g>`;
    // 机芯三根轴
    const sp = (i)=> S7.spin || S7.bellSwing ? (i%2 ? 't7spinR' : 't7spin') : '';
    TW7.axles.forEach((a,i)=>{
      if(i===2 && !S7.gearSet){ s+=`<circle cx="${a.x}" cy="${TW7.axleY}" r="6" fill="#15110d"/>
          <circle cx="${a.x}" cy="${TW7.axleY}" r="${a.r}" fill="none" stroke="#efe6c8" stroke-width="1.2" stroke-dasharray="4 4" class="pulse"/>`; return; }
      const copper = i===2;
      s+=`<g transform="translate(${a.x},${TW7.axleY})"><g class="${(i<2||S7.gearSet)?sp(i):''}">${gearArt(a.r, a.t, copper?'#b0703a':'#5a5650', copper?{dark:'#7a4a22',hub:'#4a2a12'}:{dark:'#2e2c28'})}</g></g>`;
    });
    // 大钟 + 鸦羽
    s+=`<g class="${S7.bellSwing?'t7swing':''}">${bellArt7({drop:S7.struck, feather:S7.struck && !G.feathers.L7})}</g>`;
    if(S7.struck && !G.feathers.L7) s+=`<circle cx="${TW7.bell.x+56}" cy="${TW7.bell.lip-12}" r="26" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
    // 重锤 + 拉杆
    s+=weightArt7(S7.wy);
    const wh = document.getElementById('t7WeightHot'); if(wh) wh.setAttribute('y', S7.wy+2);
    s+=`<g ${s7k}><path d="M404,520 V478" stroke="#2a2420" stroke-width="7"/>
      <g transform="rotate(${S7.struck?62:-18} 404 478)"><path d="M404,478 V420" stroke="#3a2e22" stroke-width="6"/><circle cx="404" cy="414" r="8" fill="#8a6a44"/></g></g>`;
    if(!S7.struck && S7.gearSet && S7.hour===12 && S7.phase===2) s+=`<circle cx="404" cy="440" r="26" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
    // 窗外：吊桥
    s+=`<g clip-path="url(#t7-clipWin)"><path d="M762,404 Q790,398 816,402 V460 H762 Z" fill="#45525a"/>
      <path d="M800,402 V352 H808 V402 Z M798,352 L804,336 L810,352 Z" fill="#232b30"/><rect x="802.4" y="360" width="3" height="4" fill="#b23a2e"/>
      ${S7.struck ? `<path d="M762,432 L798,404" stroke="#1e1812" stroke-width="3.4"/>` : `<path d="M770,438 L774,400" stroke="#1e1812" stroke-width="3.4"/>`}</g>`;
  }
  s+=`<rect width="828" height="709" fill="url(#l7-vig)"/>`;
  document.getElementById('l7Dyn').innerHTML = s;
};

/* ---------------- 场景点击 ---------------- */
const L7_FLAVOR = {
  tapestry:()=>'一幅星象挂毯，太阳居中，一圈月相绕着它转。只有正下方那一轮，是满月。',
  astrolabe:()=>'一架铜星盘。刻度停在秋分之后的第一个满月——收获月。',
  swin:()=>'窗外是雾湖。湖心那座孤塔的塔顶，红光一闪一闪，像是在等着什么。',
  books:()=>'几本账册，记的全是灰麦村的收成。1415 年那一页，被人用指甲刮出了一道深痕。',
  panel:()=>null,
  twin:()=>S7.struck ? '远处的吊桥放下来了，一直伸向湖心的鸦塔。' : '窗外是雾湖和湖心的鸦塔。通往那边的吊桥，高高地收着。',
  tools:()=>'两根长柄铁钳，是给钟楼匠人拨齿轮用的。',
  tbox:()=>'木箱里只有些锈掉的销钉和一团麻绳。',
  trap:()=>'地板上一块活门，钉死了。'
};
document.getElementById('l7Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L7') return;
  const o = g.dataset.obj; sfx.tap();
  if(L7_FLAVOR[o]){ const t=L7_FLAVOR[o](); if(t) return say(t); }
  switch(o){
    case 'upstairs': return switchSub7('tower');
    case 'downstairs': return switchSub7('study');
    case 'panel': return goLevel('L6', '你推开墙板，钻回那道盘旋的暗梯，回到了母亲的寝室。');
    case 'sdoor':
      if(!S7.doorOpen) return say(S7.struck ? '书房的门从外面闩着。门板在刚才的钟声里震得嗡嗡响，门闩松动了——但还没掉下来。' : '书房的门从外面闩着，推不开。', 5000);
      return leave7();
    case 'lever': case 'weight': return pull7();
    case 'bell':
      if(S7.struck && !G.feathers.L7) return pickFeather('L7');
      return say(S7.struck ? '大钟还在微微颤着。' : '一口青铜大钟。钟锤垂着，一动不动。', 4000);
  }
  openZoom('l7_'+o);
});
function leave7(){
  goLevel('hall', '你推开书房的门，走下主楼梯。午夜的钟声还在整座城堡里回荡……', ()=>{
    sfx.chime();
    say('大厅变了：先祖之席的椅子转了过来，正对着城堡大门。楼梯平台上那幅画的布滑落了。大门的铁闩，断成了两截。', 9000);
  });
}

/* ---------------- 记忆页 ⑦ 哥哥的告密 ---------------- */
MEMORIES.m7 = {no:'⑦', title:'哥哥的告密', moon:4, from:'L7', art:()=>memFrame(`
  <rect x="30" y="340" width="540" height="38" fill="#b9ab8b"/><path d="M30,340 H570" stroke="#2b251e" stroke-width="2"/>
  <path d="M60,340 V120 M140,340 V120 M60,200 H140" stroke="#b3a586" stroke-width="2"/>
  <path d="M300,340 L300,120 Q306,80 360,72 Q414,80 420,120 L420,340 Z" fill="#8a7658" stroke="#2b251e" stroke-width="3"/>
  <path d="M330,90 V340 M360,74 V340 M390,90 V340 M300,170 H420 M300,290 H420" stroke="#6e5c42" stroke-width="2"/>
  <circle cx="404" cy="230" r="5" fill="#2b251e"/>
  <ellipse cx="236" cy="244" rx="70" ry="80" fill="#efd890" opacity=".35"/>
  ${CH.sil('edmundBoy', 236, 172, 1.08, {len:156})}
  <g fill="#2b251e"><path d="M250,196 Q276,200 298,212 L295,220 Q272,212 248,208 Z"/><path d="M222,202 Q210,222 210,246 L216,247 Q218,226 228,212 Z"/></g>
  <path d="M213,248 V262" stroke="#2b251e" stroke-width="2"/>
  <g transform="translate(213,278)"><path d="M0,-18 V-12" stroke="#2b251e" stroke-width="2"/><rect x="-9" y="-12" width="18" height="22" fill="#efd890" stroke="#2b251e" stroke-width="2.4"/>
    <text x="0" y="5" text-anchor="middle" font-family="Georgia,serif" font-size="12" font-weight="bold" fill="#5a3a18">E</text></g>`, 4)};

/* ---------------- 提示（三级） ---------------- */
HINTS.L7 = function(){
  if(!S7.cageOpen) return ['墙上挂着一只空鸟笼，笼底是一把年份锁：「于下一次收获月开启」。','1316、1349、1382、1415……每隔多少年？','间隔是 33 年。点开鸟笼，把转轮拨到 1 4 4 8，再拉开笼门。'];
  if(!S7.ringTaken) return ['笼里的栖木上套着一枚戒指。','点开鸟笼，取下戒指。'];
  if(!S7.struck){
    if(!S7.gearSet) return ['铁匣没有锁孔，一根铁链一直通到楼上的钟楼。','钟楼的机芯，第三根轴上少了一个齿轮。','上钟楼，点开机芯，把磨坊带回来的铜齿轮装上第三根轴。'];
    if(S7.hour!==12) return ['母亲的日记里写着：钟敲十二下的时候……','墙上的图纸也画着同一个钟点。','点开钟面，把时针拨到 XII。'];
    if(S7.phase!==2) return ['今晚是收获月之夜。','月相盘停在了别的月相上。','点开钟面旁边的月相盘，拨到满月。'];
    return ['一切都准备好了。','重锤旁边有一根拉杆。','点击重锤旁的拉杆，放下重锤。'];
  }
  if(S7.sub==='tower' && !S7.pactFront) return ['楼下传来过铁链的声音。','回书房看看那只铁匣。'];
  if(!S7.pactFront) return ['铁匣开了。','点开铁匣，读里面的羊皮纸。'];
  if(!S7.pactBack) return ['契约背面有一片反写的小字。','手镜能把反写的字照正。','点物品栏里契约右上角的放大镜，翻到背面，再用手镜照着读。'];
  if(!S7.letterRead.every(Boolean)) return ['桌上埃德蒙的那封信，还没读完。','点开书桌上的信，翻到第二页。'];
  return ['书房的门开了。','从书房的门出去，回到大厅。'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L7 = ()=>{
  updateAll();
  if(!S7.entered){ S7.entered=true;
    say('暗梯的尽头是领主的书房。桌上的蜡烛还燃着，一封信摊在桌上。墙上，一幅画像里的老人用一双暗红的眼睛看着你。', 8000); }
  else say(S7.doorOpen ? '书房的门开着，门外就是主楼梯。' : '书房里很静。', 3200);
};

/* ---------------- 通关登记（调试起点用） ---------------- */
COMPLETE.L7 = ()=>{
  Object.assign(S7, {entered:true, towerSeen:true, letterRead:[true,true], digits:[1,4,4,8], cageOpen:true, ringTaken:true,
    gearSet:true, hour:12, phase:2, planSeen:true, wy:TW7.wTop+110, struck:true, chestOpen:true, pactTaken:true,
    pactSide:1, lens:true, pactFront:true, pactBack:true, doorOpen:true});
  take('cgear'); give('ring'); give('pact');
  G.hall.drawbridgeDown = true; G.progress.L7 = true; addMem('m7');
};

/* =====================================================================
   大厅联动（第 7 关之后）：先祖之席转向大门 · 雄鹿发簪 · 平台画布滑落 · 大门铁闩断裂
   ===================================================================== */
(()=>{
  const pin = TABLE_ITEMS.find(t=>t.id==='hairpin'), turn = TABLE_ITEMS.find(t=>t.id==='ancestorTurn');
  pin.cap = '雄鹿椅上多了一支湿透的发簪，簪头是一头小小的雄鹿。水顺着椅面滴到地上——像是刚从湖里捞上来的。';
  pin.zart = ()=>`<g transform="rotate(-18 412 288)"><path d="M388,288 H432" stroke="#b39a5a" stroke-width="3"/>
    <use href="#deer" x="428" y="276" width="22" height="22" style="color:#b39a5a"/></g><path d="M404,304 q2,6 0,10 M420,302 q2,6 0,10" stroke="#7a8a90" stroke-width="1.6" fill="none"/>`;
  pin.sceneArt = ()=>`<path d="M534,573 L556,569" stroke="#c9a85a" stroke-width="1.8"/><circle cx="557" cy="568" r="2" fill="#c9a85a"/>`;
  turn.cap = '主位那把乌鸦椅被人转了过来，椅背对着餐桌，正对着城堡大门。地上的灰里，留着两道拖拽的痕迹。';
  turn.zart = ()=>`<path d="M470,150 Q540,138 566,196 M470,252 Q540,262 566,206" stroke="#8d877a" stroke-width="1.6" stroke-dasharray="4 3" fill="none"/>
    <path d="M560,196 l8,4 l-2,-9" stroke="#8d877a" stroke-width="1.6" fill="none"/>`;
})();
const _hallScene7 = HALL_HOOKS.scene;
HALL_HOOKS.scene = ()=>{
  let s = _hallScene7 ? _hallScene7() : '';
  if(!G.progress.L7) return s;
  // 平台上的大画：布滑落，埃德蒙与艾格尼丝的新画像，女孩的脸被涂黑
  s+=`<rect x="236" y="168" width="88" height="112" fill="#6b5532" stroke="#120e0b" stroke-width="1.2"/>
    <svg x="242" y="174" width="76" height="100" viewBox="0 0 120 158">${edmundAgnes7()}</svg>
    <path d="M232,284 Q280,300 330,284 L336,300 Q280,316 226,300 Z" fill="#7a766a" stroke="#120e0b" stroke-width="1.2"/>`;
  // 城堡大门：铁闩断成两截，门缝里涌进雾
  s+=`<path d="M734,200 L742,200 L752,598 L728,590 Z" fill="#b9c4c4" opacity=".22"/>
    <path d="M690,402 L728,396 M752,394 L788,404" stroke="#1a1612" stroke-width="7"/>
    <path d="M728,396 l4,8 M752,394 l-3,9" stroke="#1a1612" stroke-width="3"/>`;
  return s;
};
Object.defineProperty(HALL_FLAVOR, 'cloth', { enumerable:true, configurable:true, get(){
  if(G.progress.L7) return '';   // 第 7 关后：点开画像特写（VIEWS.cloth）
  return G.hall.gateOpen ? '楼梯平台上那幅大画被灰布盖得严严实实，布角用钉子钉死在画框上，掀不开。'
                         : '楼梯平台上挂着一幅大画，被一块灰布严严实实地盖着。它在铁栅门后面，够不着。'; } });
const _hallHints7 = HINTS.hall;
HINTS.hall = function(){
  if(G.progress.L7 && !G.progress.L8){
    const empty = Object.values(G.feathers).filter(f=>!f).length;
    if(empty) return ['城堡大门的铁闩断了，吊桥已经放下。', `壁炉台的木架上还空着 ${empty} 道槽——进鸦塔之前，可以先回各个房间找找。`, '点开壁炉台上的鸦羽架，点一道空槽，就能回到那间屋子。'];
    return ['城堡大门的铁闩断了，吊桥已经放下。', '点开右边的城堡大门，走向湖心的鸦塔。'];
  }
  return _hallHints7();
};

/* ---------------- 平台画像：埃德蒙与艾格尼丝（局部 120×158）；艾格尼丝的脸被涂上未干的黑颜料 ---------------- */
function edmundAgnes7(){
  const drip = [[-4,14],[-1,22],[2,10],[5,18]].map(([x,l])=>`<path d="M${x},10 q.6,${l*.5} 0,${l}" stroke="#0c0a08" stroke-width="1.6" stroke-linecap="round" fill="none"/>`).join('');
  return `<rect width="120" height="158" fill="#2e2620"/><rect width="120" height="158" fill="url(#chDown)" opacity=".6"/>
    <path d="M0,120 Q60,112 120,120 V158 H0 Z" fill="#241e1a"/>
    <path d="M86,10 H112 V54 L99,62 L86,54 Z" fill="#5a2622"/><use href="#deer" x="88" y="18" width="22" height="22" style="color:#b39a5a"/>
    <g transform="translate(46,40) scale(1.08)">${CH.draw('edmund', {hold:'chest', len:120, face:{eyes:'down', mood:'sad', male:true, stubble:true}})}</g>
    <g transform="translate(78,80) scale(1.02)">
      ${CH.draw('agnes', {len:96, face:{age:'child', eyes:'open', mood:'blank'}})}
      <path d="M-8.6,-8 Q-6,-10.6 0,-10 Q6,-10.8 8.8,-7.6 Q10.2,0 8.4,6 Q5.6,12 0,12.8 Q-5.6,12 -8.4,6 Q-10.2,0 -8.6,-8 Z" fill="#0c0a08"/>
      <path d="M-8,-4 l17,3 M-8.6,3 l17,2.4" stroke="#2a2420" stroke-width="1.4"/>${drip}</g>
    <path d="M60,70 Q67,84 66,96 L60,97 Q61,84 55,72 Z" fill="#26221e" stroke="${CHC.ink}" stroke-width=".6"/>
    <g transform="translate(64,99)">${chHand(0,0,1.05)}</g>`;
}
VIEWS.cloth = ()=>({ title:'The New Portrait',
  cap:'盖布滑落了。是一幅新画像：埃德蒙，和他的女儿艾格尼丝。他的手搭在女儿肩上，眼睛却不敢看她。艾格尼丝的脸刚被涂上一层黑颜料——还没干，正顺着画布往下淌。',
  svg:`<rect width="600" height="400" fill="#3a332b"/><path d="M0,80H600M0,160H600M0,240H600M0,320H600M120,0V80M460,0V80M60,80V160M520,80V160M160,160V240M440,160V240" stroke="#332d26" stroke-width="2"/>
    <rect x="184" y="14" width="232" height="300" fill="#6b5532" ${ink}/><rect x="192" y="22" width="216" height="284" fill="none" stroke="#9a7e46" stroke-width="2"/>
    <svg x="198" y="28" width="204" height="272" viewBox="0 0 120 158" preserveAspectRatio="none">${edmundAgnes7()}</svg>
    <path d="M160,318 Q300,350 440,318 L452,350 Q300,392 148,350 Z" fill="#7a766a" ${ink}/>
    <path d="M200,336 Q300,360 400,336 M180,346 Q300,376 420,346" stroke="#5e5a50" stroke-width="2" fill="none"/>
    <path d="M344,300 q2,8 0,14" stroke="#0c0a08" stroke-width="2.4" fill="none"/><ellipse cx="344" cy="318" rx="4" ry="2" fill="#0c0a08"/>` });
