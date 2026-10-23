/* =====================================================================
   第 5 关 · 肖像长廊 —— 特写视图 + 物品
   ===================================================================== */
const g5ZWall = `<rect width="600" height="400" fill="#4e4a3e"/>
  <path d="M0,60H600M0,130H600M0,200H600M90,0V60M380,0V60M220,60V130M520,60V130M60,130V200M330,130V200" stroke="#45413a" stroke-width="1.4"/>
  <rect y="268" width="600" height="132" fill="#3a2f25"/><path d="M0,268 H600" stroke="#55463a" stroke-width="3"/>
  <path d="M0,300 H600 M0,374 H600 M100,300 V374 M250,300 V374 M400,300 V374 M550,300 V374" stroke="#2a221a" stroke-width="1.5"/>`;
const WALL5 = {x:[22,168,314,460], y:40};
const DET5 = {x:182, y:34, w:236, h:330};                  // 单幅特写：画布位置
const FACE5 = {x:DET5.x + P5[3].child*DET5.w/100, y:DET5.y + 86*DET5.h/140};
const DESC5 = [
  '一对夫妇站在窗前，神情僵硬。窗台上停着一只乌鸦。',
  '一对夫妇并肩站着，女人戴着白头巾。',
  '一对夫妇，男人的手交握在身前。',
  '一家人：父亲，戴着暗红尖顶头饰的母亲，还有一个提着灯的少年——灯罩上，有一个小小的 E。'
];

/* ---------------- 整面墙：交换相邻画像 ---------------- */
VIEWS.l5_wall = function(){
  S5.wallSeen = true;
  const done = S5.ordered;
  const frames = [0,1,2,3].map(slot=>{ const id=S5.order[slot], x=WALL5.x[slot], y=WALL5.y;
    return `<g id="z-w${slot}" class="zhot">
      <rect x="${x}" y="${y}" width="118" height="162" fill="#6b5532" ${ink}/>
      <rect x="${x+3}" y="${y+3}" width="112" height="156" fill="none" stroke="#9a7e46" stroke-width="1.2"/>
      <svg x="${x+6}" y="${y+6}" width="106" height="150" viewBox="0 0 100 140" preserveAspectRatio="none">${portraitArt5(id,{uid:'w'+slot, gaze:gaze5(id)})}</svg>
      <rect x="${x+39}" y="${y+168}" width="40" height="11" fill="#8a7448" stroke="#2b251e" stroke-width="1"/>
      <path d="M${x+43},${y+171} l10,5 M${x+50},${y+170} l12,6 M${x+60},${y+171} l14,5" stroke="#4a3e2a" stroke-width="1"/></g>`; }).join('');
  const swaps = done ? '' : [0,1,2].map(s=>uiBtn('z-sw'+s, 154+146*s-27, 228, 54, '⇄')).join('');
  return { title:'Portraits',
    cap: done ? '四幅画像按年代挂好了。画里所有人都望着长廊尽头——望着母亲。'
      : '左墙上的四幅家族画像（左边离入口最近，右边靠长廊尽头）。铭牌都被刮花了，看不出年代；每幅画的窗外，都能看见一棵橡树。点 ⇄ 交换相邻两幅，点画像可以细看。',
    svg:`${g5ZWall}${frames}${swaps}
      ${uiGoal(done ? '画像已按年代挂好' : '把四幅画像按年代顺序重新挂好')}
      ${uiTag(80, 300, '← 入口', {w:90})}${uiTag(520, 300, '长廊尽头 →', {w:110})}
      <text x="300" y="352" text-anchor="middle" ${UI_FONT} font-size="13" font-style="italic" fill="#b9ad92">${done ? '烛台已经亮了' : '画里的人在看哪里？'}</text>`,
    bind(){
      [0,1,2,3].forEach(slot=> on('z-w'+slot, ()=>{ sfx.tap(); openZoom('l5_p'+S5.order[slot]); }));
      [0,1,2].forEach(s=> on('z-sw'+s, ()=>{ if(G.busy) return; swap5(s); }));
    }
  };
};

/* ---------------- 单幅细看（侧光显影） ---------------- */
let g5Pending = false;
function portraitView5(id){
  const P=P5[id], lit=sideLit5(id), rev=S5.revealed[id], key='l5_p'+id;
  const cx = DET5.x + (P.child-15)*DET5.w/100, cy = DET5.y + 70*DET5.h/140;
  let cap;
  if(rev) cap = id===3 ? '厚涂下面，是一个抱着木鹿的小女孩。铭牌：1415 · M——。……那是我。'
                       : `厚涂下面藏着一个孩子，手里拿着${P.itemCn}。铭牌：${P.year} · ${P.init}。` + pageNote5(id);
  else if(lit) cap = '烛光贴着墙面，从侧边斜斜地照过来。厚涂的颜料上，起伏出一道道细细的阴影……';
  else cap = DESC5[id] + ' 画里有一块颜色发暗的厚涂，像是有人用黑颜料盖掉了什么。窗外能看见一棵橡树。铭牌被刮花了。';
  return { title:'Portrait',
    cap,
    svg:`<defs><linearGradient id="z5-rake" x1="0" x2="1"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".5"/><stop offset=".6" stop-color="#ffb35a" stop-opacity=".08"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></linearGradient></defs>
      ${g5ZWall}
      <g id="z-face">
        <rect x="${DET5.x-10}" y="${DET5.y-10}" width="${DET5.w+20}" height="${DET5.h+20}" fill="#6b5532" ${ink}/>
        <rect x="${DET5.x-5}" y="${DET5.y-5}" width="${DET5.w+10}" height="${DET5.h+10}" fill="none" stroke="#9a7e46" stroke-width="1.6"/>
        <svg x="${DET5.x}" y="${DET5.y}" width="${DET5.w}" height="${DET5.h}" viewBox="0 0 100 140" preserveAspectRatio="none">
          ${portraitArt5(id,{uid:'d', gaze:gaze5(id), revealed:rev, face:rev && id===3})}</svg>
        ${lit ? `<rect x="${DET5.x}" y="${DET5.y}" width="${DET5.w}" height="${DET5.h}" fill="url(#z5-rake)"/>`
              : `<rect x="${DET5.x}" y="${DET5.y}" width="${DET5.w}" height="${DET5.h}" fill="#0c0a08" opacity=".22"/>`}
        <rect x="270" y="378" width="60" height="16" fill="#8a7448" stroke="#2b251e" stroke-width="1.2"/>
        ${rev ? `<text x="300" y="390" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#2b251e">${P.year} · ${P.init}</text>`
              : `<path d="M276,382 l14,8 M286,381 l16,9 M300,382 l16,8 M310,381 l14,8" stroke="#4a3e2a" stroke-width="1"/>`}
        ${lit ? `<circle cx="120" cy="250" r="90" fill="url(#warm)" opacity=".7"/><g transform="translate(78,330) scale(1.5)">${sconceArt5(true)}</g>` : ''}
      </g>
      <g id="z-patch" class="zhot"><rect x="${cx}" y="${cy}" width="${30*DET5.w/100}" height="${70*DET5.h/140}" fill="transparent"/></g>
      ${!S5.ordered ? uiBtn('z-back', 18, 352, 120, '← 整面墙') : ''}`,
    bind(){
      on('z-back', ()=>{ sfx.tap(); openZoom('l5_wall'); });
      on('z-patch', ()=>{
        if(G.busy || g5Pending) return;
        if(rev){ sfx.tap(); return setCap(id===3 ? '你伸手碰了碰那张脸。颜料是冷的。' : `轮廓里的孩子，手里拿着${P.itemCn}。`); }
        sfx.fail();
        setCap('颜料太厚了，正面什么都看不出来。' + (S5.lit ? ' 要是烛台的光能从这幅画的侧边照过来……' : ''));
      });
      if(lit && !rev && !g5Pending){ g5Pending = true;
        setTimeout(()=>{ g5Pending = false; if(cur===key && !S5.revealed[id]) revealPortrait5(id); }, 900); }
    }
  };
}
[0,1,2,3].forEach(id=> VIEWS['l5_p'+id] = ()=>portraitView5(id));

/* ---------------- 母亲画像 → 雄鹿钥匙 → 记忆页 ⑤ ---------------- */
VIEWS.l5_mother = function(){
  const open=S5.frameOpen, took=S5.keyTaken;
  const corners = [[183,28],[417,28],[183,372],[417,372]];
  const cap = took ? '墙洞空了。画中的母亲，仍然指着那个角落。'
    : open ? '画像像一扇小门似的弹开了。墙洞里挂着一把钥匙。'
    : S5.pointing ? '画中的母亲抬起了一只手，指尖正对着画框右下角那朵雕花玫瑰。'
    : '母亲伊莎贝拉的单人肖像。她垂着眼睛，双手交叠在身前。画框四个角上各雕着一朵小玫瑰。' + (S5.ordered ? ' 左墙画里的人，都在望着她。' : '');
  return { title:'Lady Isabel',
    cap,
    svg:`<rect width="600" height="400" fill="#4e4a3e"/><path d="M0,90H600M0,180H600M0,270H600M120,0V90M460,0V90M60,90V180M520,90V180M140,180V270M440,180V270" stroke="#45413a" stroke-width="1.4"/>
      <ellipse cx="300" cy="120" rx="200" ry="150" fill="#c8d4dc" opacity=".06"/>
      ${open ? `<rect x="191" y="36" width="218" height="328" fill="#14110e" ${ink}/>
          <path d="M191,36 L409,36 L409,364 L191,364 Z" fill="none" stroke="#2e2822" stroke-width="10"/>
          <circle cx="300" cy="120" r="5" fill="#2b251e"/><path d="M300,125 v14" stroke="#2b251e" stroke-width="3"/>
          ${took ? '' : `<g id="z-key" class="zhot"><rect x="250" y="120" width="100" height="200" fill="transparent"/>
              <g transform="translate(300,197) rotate(90)">${skeyArt5()}</g>
              <circle cx="300" cy="200" r="72" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>`}
          <polygon points="177,22 240,60 240,342 177,378" fill="#7a6236" ${ink}/>
          <polygon points="186,40 232,66 232,334 186,360" fill="#5a4630" stroke="#2b251e" stroke-width="1.4"/>
          <path d="M190,120 L230,130 M190,250 L230,252" stroke="#3e3022" stroke-width="2"/>`
      : `<rect x="177" y="22" width="246" height="356" fill="#7a6236" ${ink}/>
          <rect x="184" y="29" width="232" height="342" fill="none" stroke="#a88a4e" stroke-width="2"/>
          <svg x="191" y="36" width="218.4" height="327.6" viewBox="0 0 104 156">${motherArt5({pointing:S5.pointing})}</svg>
          ${corners.map(([x,y],i)=>`<g ${i===3?'id="z-corner" class="zhot"':''}><circle cx="${x}" cy="${y}" r="${i===3?16:9}" fill="transparent"/>
            <circle cx="${x}" cy="${y}" r="8" fill="#a88a4e" ${ink}/><path d="M${x-4},${y} Q${x},${y-5} ${x+4},${y} Q${x},${y+5} ${x-4},${y} Z" fill="#7a6236"/>
            ${i===3 && S5.pointing ? `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>` : ''}</g>`).join('')}`}`,
    bind(){
      on('z-corner', ()=>{
        if(G.busy) return;
        if(!S5.pointing){ sfx.thud(); shake(); return setCap('你按了按画框右下角的玫瑰。纹丝不动。'); }
        S5.frameOpen = true; sfx.clack(); setTimeout(sfx.creak, 200);
        act('你按下那朵玫瑰——「咔」，整幅画像像一扇小门似的弹开了。后面的墙洞里，挂着一把钥匙。');
      });
      on('z-key', ()=>{
        if(G.busy) return;
        S5.keyTaken = true; give('skey'); G.progress.L5 = true; sfx.pick();
        act('一把铜钥匙，柄上铸着一头雄鹿——哈特维尔家的雄鹿。母亲把它藏在了自己的画像后面。');
        G.busy = true;
        setTimeout(()=>{ G.busy = false; closeZoom();
          showMemory('m5', ()=>{ updateAll();
            say('黎明的光里，有人举着刷子，把画布上的孩子一点点涂掉了。……右墙那面雄鹿旗旁边的门，正好配这把钥匙。', 7500); });
        }, 2600);
      });
    }
  };
};

/* ---------------- 空白画布 ---------------- */
VIEWS.l5_canvas = function(){
  S5.canvasSeen = true;
  const future = typeof S4!=='undefined' && S4.future;
  return { title:'Blank Canvas',
    cap:'一张空白画布，什么都还没画。画架的铭牌上刻着：1448。画布右下角，有人用炭笔写了一个名字：Agnes。画架脚边放着一罐黑颜料，刷子还是湿的。'
      + (S5.selfSeen ? ' ……1415 之后，再过三十三年。下一个被涂掉的，是埃德蒙的女儿。' : ' 1448——离 1415 年，正好三十三年。')
      + (future ? ' 你想起磨盘上滚出来的那个「1448 · A」。' : ''),
    svg:`<rect width="600" height="400" fill="#4e4a3e"/><rect y="330" width="600" height="70" fill="#2e2822"/><path d="M0,330 H600" stroke="#1a1511" stroke-width="2"/>
      <ellipse cx="300" cy="150" rx="220" ry="160" fill="#c8d4dc" opacity=".05"/>
      <g transform="translate(300,392) scale(1.2)">${easelArt5()}</g>
      <g ${ink}><path d="M452,392 L456,350 Q470,344 484,350 L488,392 Z" fill="#3a3530"/><ellipse cx="470" cy="350" rx="14" ry="4" fill="#0c0a08"/>
        <path d="M476,352 L506,300" stroke="#6a5440" stroke-width="5"/><path d="M473,357 L478,349" stroke="#0c0a08" stroke-width="7" stroke-linecap="round"/></g>
      <path d="M470,352 q-4,10 -2,22" stroke="#0c0a08" stroke-width="2.4" fill="none" opacity=".8"/>`
  };
};

/* ---------------- 盔甲 → 隐藏鸦羽 ---------------- */
VIEWS.l5_armor = function(){
  const up=S5.visor, fea = up && !G.feathers.L5;
  return { title:'Armour',
    cap: !up ? '一具立在石座上的盔甲，手里握着一根长矛。头盔的护面放了下来，缝里黑漆漆的。'
      : fea ? '你掀起护面——头盔里塞着一根乌黑的羽毛。' : '头盔里空荡荡的。',
    svg:`<rect width="600" height="400" fill="#47443a"/><path d="M0,80H600M0,160H600M0,240H600M0,320H600M100,0V80M420,0V80M220,80V160M520,80V160M60,160V240M360,160V240M160,240V320M480,240V320" stroke="#3e3b33" stroke-width="1.4"/>
      <g transform="translate(300,640) scale(1.3)">${armorArt5(up)}</g>
      <g id="z-visor" class="zhot"><rect x="262" y="140" width="76" height="108" fill="transparent"/>
        ${!up ? `<rect x="262" y="140" width="76" height="108" fill="none" stroke="#efe6c8" stroke-width="1.4" opacity=".0"/>` : ''}</g>
      ${fea ? `<g id="z-fea" class="zhot"><rect x="266" y="120" width="100" height="100" fill="transparent"/>
          <path d="M290,206 Q314,182 346,128" stroke="#8a8478" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M290,206 Q314,182 346,128" stroke="#0e0c0a" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M300,196 l-10,-5 M308,186 l-10,-6 M316,174 l-9,-7 M324,162 l-8,-7 M332,150 l-7,-7 M304,192 l10,0 M312,181 l10,-1 M320,169 l10,-2 M328,157 l9,-2 M336,145 l8,-2" stroke="#1d1915" stroke-width="3"/>
          <circle cx="320" cy="168" r="44" fill="none" stroke="#efe6c8" stroke-width="1.8" class="pulse"/></g>` : ''}`,
    bind(){
      on('z-visor', ()=>{ if(fea) return; S5.visor = !S5.visor; sfx.clack(); noise(.2,1500,.05,2);
        act(S5.visor ? (G.feathers.L5 ? '你掀起护面。头盔里空荡荡的。' : '你掀起护面——头盔里塞着一根乌黑的羽毛。') : '你把护面放了下来。'); });
      on('z-fea', ()=>{ pickFeather('L5'); render(); });
    }
  };
};

/* ---------------- 雄鹿门（通往第 6 关 · 夫人寝室） ---------------- */
VIEWS.l5_door = function(){
  const inner='M196,400 L196,150 Q204,66 300,44 Q396,66 404,150 L404,400 Z';
  const hk_ = has('skey'), open = S5.doorOpen;
  if(open) return { title:'Stag Door',
    cap:'雄鹿门开着。门后的窄楼梯通往三楼——母亲的寝室。（点击上楼）',
    svg:`<rect width="600" height="400" fill="#47443a"/>
      <path d="M0,70H600M0,140H600M0,210H600M0,280H600M0,350H600M80,0V70M520,0V70M40,70V140M560,70V140M90,140V210M510,140V210M50,210V280M550,210V280M100,280V350M500,280V350" stroke="#3b3830" stroke-width="2"/>
      <path d="M170,400 L170,140 Q178,40 300,16 Q422,40 430,140 L430,400 Z" fill="#6a6555" ${ink}/>
      <path d="${inner}" fill="#0c0a08" ${ink}/>
      <path d="M240,400 L262,330 H338 L360,400 M262,330 L276,270 H324 L338,330 M276,270 L286,220 H314 L324,270" stroke="#2a221a" stroke-width="4" fill="none"/>
      <ellipse cx="300" cy="200" rx="70" ry="110" fill="#ffd890" opacity=".05"/>
      <path d="M196,400 L196,150 Q200,112 228,84 L240,94 L240,382 Z" fill="#3e3024" ${ink}/>
      <path d="M60,40 H140 V250 L100,280 L60,250 Z" fill="#5a2622" ${ink}/><path d="M56,40 H144" stroke="#15110d" stroke-width="5"/>
      <use href="#deer" x="70" y="100" width="60" height="60" style="color:#b39a5a"/>
      <g id="z-enter" class="zhot"><path d="${inner}" fill="transparent"/>
        <path d="M250,400 L250,200 Q254,150 300,136 Q346,150 350,200 L350,400" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>`,
    bind(){ on('z-enter', ()=>{
      if(!LEVELS.L6 || !LEVELS.L6.ready) return setCap('（夫人寝室 · 第 6 关尚在建造中）');
      closeZoom(); goLevel('L6', '你又走上了那段通往寝室的窄楼梯。'); }); }
  };
  return { title:'Stag Door',
    cap: hk_ ? '门边挂着雄鹿旗。锁孔周围铸着一头雄鹿——和你手里那把钥匙柄上的，是同一头。'
             : '一扇厚重的橡木门，锁着。锁孔周围铸着一头雄鹿。门缝里渗出很淡的、湖水的气味。',
    svg:`<defs><clipPath id="z5door"><path d="${inner}"/></clipPath></defs>
      <rect width="600" height="400" fill="#47443a"/>
      <path d="M0,70H600M0,140H600M0,210H600M0,280H600M0,350H600M80,0V70M520,0V70M40,70V140M560,70V140M90,140V210M510,140V210M50,210V280M550,210V280M100,280V350M500,280V350" stroke="#3b3830" stroke-width="2"/>
      <path d="M170,400 L170,140 Q178,40 300,16 Q422,40 430,140 L430,400 Z" fill="#6a6555" ${ink}/>
      <path d="${inner}" fill="#3e3024" ${ink}/>
      <g clip-path="url(#z5door)" stroke="#2a2018" stroke-width="2.5"><path d="M236,30V400M270,30V400M330,30V400M364,30V400"/>
        <path d="M190,160 L410,154 M190,340 L410,330" stroke="#15110d" stroke-width="12"/></g>
      <path d="M60,40 H140 V250 L100,280 L60,250 Z" fill="#5a2622" ${ink}/><path d="M56,40 H144" stroke="#15110d" stroke-width="5"/>
      <use href="#deer" x="70" y="100" width="60" height="60" style="color:#b39a5a"/>
      <g id="z-lock" class="zhot">
        <ellipse cx="350" cy="258" rx="30" ry="44" fill="#8a7448" ${ink}/>
        <use href="#deer" x="326" y="214" width="48" height="48" style="color:#5a4a2c"/>
        <path d="M350,272 m-5,0 a5,5 0 1,1 10,0 l-2,16 h-6 Z" fill="#0c0a08"/>
        ${hk_ ? `<ellipse cx="350" cy="258" rx="38" ry="52" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>` : ''}</g>
      ${uiBtn('z-unlock', 210, 352, 180, '用雄鹿钥匙开门', hk_)}`,
    bind(){
      const tryOpen = ()=>{
        if(!has('skey')){ S5.doorTried = true; sfx.thud(); shake(); return setCap('门锁得死死的。得先找到这把锁的钥匙。'); }
        if(LEVELS.L6 && LEVELS.L6.ready){ S5.doorOpen = true; take('skey'); closeZoom(); updateAll();
          return goLevel('L6', '钥匙「咔」地转动了。门后是一段向上的窄楼梯，通往三楼——母亲的寝室。'); }
        sfx.clack(); setTimeout(sfx.creak, 200);
        setCap('钥匙「咔」地转动了。门后是一段向上的窄楼梯，通往三楼——母亲的寝室。（夫人寝室 · 第 6 关尚在建造中）');
      };
      on('z-lock', tryOpen); on('z-unlock', tryOpen);
    }
  };
};

/* ---------------- 物品：缩略图 / 特写 ---------------- */
TH.skey = ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(56,58) rotate(-40) scale(.42)">${skeyArt5()}</g>`;
VIEWS.skey = ()=>({ title:'Stag Key', cap:'一把铜钥匙，柄上铸着一头雄鹿——母亲娘家哈特维尔的家徽。是从母亲的画像后面找到的。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,200) scale(2.2)">${skeyArt5()}</g>` });
