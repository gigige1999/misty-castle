/* =====================================================================
   第 4 关 · 磨坊 —— 特写视图 + 物品
   ===================================================================== */
const m4Fog = `<rect width="600" height="400" fill="#a7aca9"/><rect y="250" width="600" height="150" fill="#7a7560"/>
  <ellipse cx="300" cy="250" rx="420" ry="30" fill="#c6c9c3" opacity=".6"/>`;
const m4Wall = `<rect width="600" height="400" fill="#a39b87"/><path d="M0,80H600M0,160H600M0,240H600M0,320H600M90,0V80M350,0V80M200,80V160M470,80V160M60,160V240M320,160V240M140,240V320M430,240V320M260,320V400M520,320V400" stroke="#8c8471" stroke-width="1.6"/>`;
const crankArt = `<g ${ink}><rect x="-6" y="-6" width="12" height="12" fill="#3a3530"/><path d="M0,0 L0,-60 L46,-74" stroke="#3a2e22" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M0,0 L0,-60 L46,-74" stroke="#6a5440" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="40" y="-96" width="14" height="30" rx="5" fill="#8a6a44"/></g>`;
const deerToyArt = `<g ${ink}><rect x="-40" y="-4" width="74" height="26" rx="10" fill="#9a7a4e"/>
  <path d="M28,-2 L44,-36 L58,-30 L44,4 Z" fill="#9a7a4e"/><ellipse cx="54" cy="-36" rx="14" ry="9" fill="#9a7a4e"/>
  <path d="M50,-44 L44,-66 M44,-58 L34,-62 M58,-44 L66,-66 M64,-58 L74,-62" stroke="#5a4630" stroke-width="3"/>
  <circle cx="58" cy="-38" r="2" fill="#1a1511"/>
  <path d="M-30,22 V44 M-12,22 V44 M10,22 V44 M26,22 V44" stroke="#7a5e3a" stroke-width="7"/>
  <rect x="-48" y="44" width="92" height="8" fill="#6a5034"/><circle cx="-38" cy="56" r="6" fill="#4a3a2a"/><circle cx="34" cy="56" r="6" fill="#4a3a2a"/>
  <path d="M-40,2 q-10,-6 -12,4" stroke="#5a4630" stroke-width="3" fill="none"/></g>`;
const wheatArt = `<g ${ink}><path d="M0,60 Q2,0 0,-60" stroke="#b8902e" stroke-width="3" fill="none"/>
  ${[-50,-36,-22,-8,6].map((y,i)=>`<ellipse cx="-8" cy="${y}" rx="5" ry="10" transform="rotate(-28 -8 ${y})" fill="#e0b84a"/><ellipse cx="8" cy="${y+6}" rx="5" ry="10" transform="rotate(28 8 ${y+6})" fill="#e0b84a"/>`).join('')}
  <ellipse cx="0" cy="-64" rx="5" ry="10" fill="#e0b84a"/>
  <path d="M-2,-74 l-6,-16 M2,-74 l6,-16 M0,-74 v-18" stroke="#c8a040" stroke-width="1.4"/></g>`;

/* ---------------- 稻草人衣兜 ---------------- */
VIEWS.o_scarecrow = function(){
  const has_ = S4.crank==='pocket';
  return { title:'Scarecrow',
    cap: has_ ? '鸦群散了。稻草人的破外衣上有个鼓鼓的衣兜，里面露出一截铁柄。' : '稻草人张着手臂，空荡荡的衣兜在风里晃。',
    svg:`${m4Fog}
      <g transform="translate(-1140,-560) scale(2)">${scarecrowArt(false)}</g>
      <g id="z-pocket" class="zhot"><rect x="300" y="300" width="90" height="80" fill="transparent" stroke="none"/>
        ${has_?`<path d="M346,326 L368,282 L380,284 L360,330 Z" fill="#3a3530" ${ink}/><circle cx="348" cy="332" r="30" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>`:''}</g>`,
    bind(){ on('z-pocket', ()=>{ if(!has_){ sfx.tap(); return setCap('衣兜里只剩几根稻草。'); }
      S4.crank='hand'; give('crank'); sfx.pick(); act('你从衣兜里抽出一把铁摇柄——正好能套在什么方形的轴上。'); }); }
  };
};

/* ---------------- 水闸 ---------------- */
VIEWS.o_sluice = function(){
  const set = S4.crank==='set', open = S4.sluiceOpen;
  return { title:'Sluice Gate',
    cap: open ? '闸板提起来了。水哗哗地冲进水槽，砸在水车的叶片上。'
      : set ? '摇柄套在了方轴上。（点击摇柄转动）'
      : has('crank') ? '水槽尽头的木闸板。闸顶有一根方形的轴——手里的摇柄正好合适。'
      : '水槽尽头的木闸板关得死死的。闸顶有一根方形的轴，摇柄不见了。',
    svg:`${m4Fog}
      <rect x="0" y="160" width="600" height="60" fill="#5a4636" ${ink}/><path d="M0,220 H600" stroke="#2b251e" stroke-width="2"/>
      <rect x="0" y="176" width="${open?600:250}" height="30" fill="#6f8f98"/>
      ${open?`<path d="M20,190 q30,-8 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" stroke="#d6e4e6" stroke-width="2.4" fill="none" stroke-dasharray="12 8" class="m4water"/>`:''}
      <g transform="translate(0,64)"><rect x="230" y="60" width="140" height="190" fill="#4a3a2a" ${ink}/>
      <rect x="250" y="${open?40:96}" width="100" height="${open?110:150}" fill="#7a6248" ${ink}/>
      <path d="M250,${open?76:132} H350 M250,${open?112:170} H350 M250,${open?148:208} H350" stroke="#4a3a2a" stroke-width="3"/>
      <rect x="290" y="${open?22:78}" width="20" height="20" fill="#2a2622" ${ink}/>
      <path d="M300,40 V60" stroke="#2a2622" stroke-width="10"/>
      <g id="z-axle" class="zhot"><rect x="250" y="0" width="170" height="110" fill="transparent" stroke="none"/>
        <rect x="292" y="20" width="16" height="16" fill="#0c0a08"/>
        ${set||open?`<g transform="translate(300,28) rotate(${open?120:0})">${crankArt}</g>`:has('crank')?`<rect x="284" y="12" width="32" height="32" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>`:''}</g></g>
      ${uiGoal(open ? '水冲进水槽，水车转起来了' : '提起闸板，让水流进水槽，带动水车')}
      ${uiTag(130, 250, open ? '水槽：有水' : '水槽：干的', {w:110})}
      ${open ? uiTag(470, 250, '闸板：已提起', {w:120, fill:'#efe2bf'}) : `${uiBtn('z-bSet', 110, 350, 170, '把摇柄装上方轴', has('crank') && !set)}${uiBtn('z-bTurn', 320, 350, 170, '转动摇柄', set)}`}`,
    bind(){
      on('z-axle', ()=>{
        if(open){ sfx.tap(); return setCap('闸开着，水声很响。'); }
        if(set){ S4.sluiceOpen=true; S4.wheelOn=true; take('crank'); sfx.creak(); setTimeout(()=>noise(2.4,600,.08,.4), 400);
          const m=runGears(); act('你摇动摇柄，闸板「吱呀呀」地升了起来。水冲进水槽——外面的水车，慢慢转动了。' + (m?' '+m:'')); return; }
        if(!has('crank')){ sfx.fail(); return setCap('方轴上光秃秃的，手指拧不动。'); }
        S4.crank='set'; sfx.clack(); act('你把摇柄套在了方轴上。');
      });
      const axle = ()=>document.querySelector('#zsvg #z-axle').dispatchEvent(new MouseEvent('click',{bubbles:true}));
      on('z-bSet', ()=>{ if(!has('crank')){ sfx.fail(); return setCap('手里没有摇柄。稻草人的衣兜鼓鼓的……'); } axle(); });
      on('z-bTurn', ()=>{ if(!set){ sfx.fail(); return setCap('方轴上还没有摇柄。'); } axle(); });
    }
  };
};

/* ---------------- 马车：面粉袋与小鞋 → 记忆页 ④ ---------------- */
VIEWS.o_cart = function(){
  return { title:'Cart',
    cap: S4.cartSeen ? '母亲安排的马车。面粉袋的绳子是被割断的，里面只有一只小鞋。' : '马车上躺着一只孩子大小的面粉袋，袋口的绳子被割断了。旁边有一只小鞋。',
    svg:`${m4Fog}
      <path d="M40,200 L560,186 L566,320 L34,334 Z" fill="#5a4636" ${ink}/>
      <path d="M40,250 L562,236 M38,296 L564,282" stroke="#3a2e22" stroke-width="3"/>
      <path d="M140,198 V330 M280,194 V328 M420,190 V324" stroke="#3a2e22" stroke-width="2"/>
      <g id="z-sack" class="zhot"><path d="M150,240 Q124,170 170,138 Q230,104 300,132 Q356,160 332,240 Z" fill="#d4c9aa" ${ink}/>
        <path d="M176,140 Q236,120 296,136" stroke="#8a7a5c" stroke-width="3" fill="none"/>
        <path d="M222,128 l-14,-30 M250,126 l12,-28" stroke="#8a7a5c" stroke-width="4"/><path d="M204,98 l8,-4 M262,96 l-8,-6" stroke="#8a7a5c" stroke-width="3"/>
        <path d="M200,170 Q240,156 280,170 M240,156 V230" stroke="#a89c80" stroke-width="2" fill="none"/></g>
      <g id="z-shoe" class="zhot"><rect x="360" y="190" width="120" height="60" fill="transparent" stroke="none"/>${shoeArt(420,226,3)}</g>`,
    bind(){
      const see = ()=>{
        if(S4.cartSeen){ sfx.tap(); return setCap('那只小鞋很旧了，鞋带还系着蝴蝶结。'); }
        S4.cartSeen = true; sfx.open();
        act('你拿起那只小鞋。鞋底刻着一个歪歪扭扭的 M。');
        setTimeout(()=>{ closeZoom(); showMemory('m4', ()=>say('马车在雾里等到了天亮。没有人来。', 5000)); }, 2400);
      };
      on('z-sack', see); on('z-shoe', see);
    }
  };
};

/* ---------------- 齿轮机构（核心谜题） ---------------- */
// 转向箭头：dir=1 顺时针 / -1 逆时针
const spinArrow = (x, y, dir)=>{ const a = dir>0 ? `M${x-16},${y+4} A18,18 0 0 1 ${x+16},${y+4}` : `M${x+16},${y+4} A18,18 0 0 0 ${x-16},${y+4}`;
  const hx = dir>0 ? x+16 : x-16;
  return `<g pointer-events="none"><path d="${a}" fill="none" stroke="#2b251e" stroke-width="3.4"/><path d="${a}" fill="none" stroke="#efc463" stroke-width="1.6"/>
    <path d="M${hx-6},${y-2} L${hx},${y+8} L${hx+6},${y-2}" fill="none" stroke="#2b251e" stroke-width="3"/></g>`; };
VIEWS.i_gears = function(){
  const e = evalGears(), done = S4.ground, placed = Object.values(S4.pegs).some(Boolean);
  const running = id => S4.wheelOn && e.dir[id]!==undefined && !e.jam;
  const spin = id => running(id) ? (e.dir[id]>0?'m4spin':'m4spinR') : '';
  const nodeR = id => id==='D' ? G_D.r : id==='M' ? G_M.r : GEARS[S4.pegs[id]].r;
  const nodeX = id => id==='D' ? G_D.x : id==='M' ? G_M.x : PEGS[id];
  const arrows = ['D','M','a','b','c'].filter(id=> (id==='D'||id==='M'||S4.pegs[id]) && running(id))
    .map(id=> spinArrow(nodeX(id), Math.max(54, G_Y - nodeR(id) - 26), e.dir[id])).join('');
  const pegs = ['a','b','c'].map((p,i)=>{ const g=S4.pegs[p], x=PEGS[p];
    return `<g id="z-peg-${p}" class="zhot">
      ${g ? `<g transform="translate(${x},${G_Y})"><g class="${spin(p)}">${gearArt(GEARS[g].r, GEARS[g].t, GEARS[g].fill, {crack:GEARS[g].crack})}</g></g>`
          : `<circle cx="${x}" cy="${G_Y}" r="22" fill="transparent" stroke="none"/>`}
      <circle cx="${x}" cy="${G_Y}" r="7" fill="#1a1511"/>
      ${!g ? `<text x="${x}" y="${G_Y+30}" text-anchor="middle" ${UI_FONT} font-size="12" fill="#2b251e">轴 ${i+1}</text>` : ''}
      ${!g && S4.sel ? `<circle cx="${x}" cy="${G_Y}" r="16" fill="none" stroke="#efc463" stroke-width="2.4" class="pulse"/>` : ''}</g>`; }).join('');
  const SIZE_CN = {big:'大', mid:'中', small:'小', cracked:'裂'};
  const tray = has('gears') ? ['big','mid','small','cracked'].filter(g=>!Object.values(S4.pegs).includes(g)).map((g,i)=>{ const x=66+i*76;
    return `<g id="z-t-${g}" class="zhot"><rect x="${x-34}" y="318" width="68" height="78" fill="transparent" stroke="none"/>
      <g transform="translate(${x},350) scale(.24)">${gearArt(GEARS[g].r, GEARS[g].t, GEARS[g].fill, {crack:GEARS[g].crack})}</g>
      <text x="${x}" y="392" text-anchor="middle" ${UI_FONT} font-size="12" fill="#efe6c8">${SIZE_CN[g]}齿轮</text>
      ${S4.sel===g?`<rect x="${x-34}" y="316" width="68" height="82" rx="6" fill="none" stroke="#efc463" stroke-width="2.4" class="pulse"/>`:''}</g>`; }).join('') : '';
  const stoneState = !S4.wheelOn ? '动力轴不转（水车停着）' : e.jam ? '卡死了' : S4.stoneDir>0 ? '磨盘：顺时针 ↻' : S4.stoneDir<0 ? '磨盘：逆时针 ↺' : placed ? '磨盘：没咬上，空转' : '磨盘：静止';
  return { title:'Gear Train',
    cap: done ? '磨盘逆时针转着，年份环停在 1415 · 收获月。出料口落下了东西。'
      : !has('gears') && !placed ? `右边是水车带动的动力轴，左边是磨盘的冠齿，中间有三根空轴（轴 1–3）。得先找到齿轮。`
      : S4.sel ? `拿着${GEARS[S4.sel].cn}——点一根亮起的空轴装上去。（再点托盘里的它，就放回去）`
      : '① 点托盘里的齿轮拿起来 → ② 点一根空轴装上 → ③ 点已装好的齿轮可以取下。齿轮会撞到旁边的就装不上。',
    svg:`${m4Wall}
      <rect x="0" y="${G_Y-34}" width="600" height="68" fill="#5a4636" opacity=".45"/>
      <path d="M${G_D.x},${G_Y} L600,${G_Y-20}" stroke="#3a2e22" stroke-width="14"/>
      <g transform="translate(${G_D.x},${G_Y})"><g class="${spin('D')}">${gearArt(G_D.r, 16, '#7a5a3a')}</g></g>
      <g transform="translate(${G_M.x},${G_Y})"><g class="${spin('M')}">${gearArt(G_M.r, 16, '#6a5a44')}</g></g>
      ${pegs}
      ${arrows}
      ${uiTag(G_D.x, G_Y+104, '动力轴 · 接水车')}
      ${uiTag(G_M.x, G_Y+104, '磨盘冠齿')}
      ${S4.year?uiTag(G_M.x, 58, S4.year+(S4.year==='1448'?' · A':' · 收获月'), {fill:'#efe2bf', size:14}):''}
      ${uiGoal(S4.stoneRead ? '把动力轴的转动传到磨盘上 · 磨盘上刻着：「逆时而磨」' : '把动力轴的转动传到左边的磨盘上')}
      ${has('gears')?`<rect x="24" y="314" width="312" height="84" rx="6" fill="#5a4636" opacity=".85" ${ink}/>`:''}
      ${tray}
      ${uiTag(468, 352, stoneState, {w:220, size:13.5, fill:S4.stoneDir<0?'#efe2bf':'#ddd3b8'})}
      <text x="468" y="384" text-anchor="middle" ${UI_FONT} font-size="12" font-style="italic" fill="#4a4134">相邻咬合的两个齿轮，转向相反</text>`,
    bind(){
      ['big','mid','small','cracked'].forEach(g=> on('z-t-'+g, ()=>{ if(done) return; S4.sel = S4.sel===g ? null : g; sfx.tap(); render(); }));
      ['a','b','c'].forEach(p=> on('z-peg-'+p, ()=>{
        if(done){ sfx.tap(); return setCap('齿轮咬得紧紧的，最好别再动了。'); }
        const cur = S4.pegs[p];
        if(cur){ S4.pegs[p]=null; S4.stoneDir=0; sfx.clack(); render(); updateAll(); return setCap(`你把${GEARS[cur].cn}取了下来。`); }
        if(!S4.sel){ sfx.tap(); return setCap(has('gears') ? '先从托盘里拿一个齿轮。' : '一根空轴。要是有齿轮就好了。'); }
        if(!canPlace(S4.sel, p)){ sfx.fail(); return setCap(`${GEARS[S4.sel].cn}装不上这根轴——会撞到旁边的齿轮。`); }
        S4.pegs[p] = S4.sel; S4.sel = null; sfx.clack();
        const m = runGears(); render(); updateAll(); setCap(m || '齿轮装上了。');
      }));
    }
  };
};

/* ---------------- 磨盘：中心刻字 + 年份环 ---------------- */
VIEWS.i_stone = function(){
  S4.stoneRead = true;
  const ys=['1316','1349','1382','1415','1448','1481','1250','1283'];
  const ring = ys.map((y,i)=>{ const a=-90+i*45 + (S4.year==='1448'?-180:S4.year==='1415'?-135:0), r=150, x=300+r*Math.cos(a*Math.PI/180), yy=200+r*.56*Math.sin(a*Math.PI/180);
    return `<text x="${x.toFixed(0)}" y="${(yy+5).toFixed(0)}" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#3a3630">${y}</text>`; }).join('');
  return { title:'Millstone',
    cap:`磨盘中心刻着一行字：「逆时而磨，方见往昔。」边缘刻着一圈年份，正上方的箭头指着${S4.year || '一道空白'}。`,
    svg:`${m4Wall}
      <ellipse cx="300" cy="230" rx="250" ry="140" fill="#77736a" ${ink}/>
      <ellipse cx="300" cy="200" rx="250" ry="140" fill="#9a968a" ${ink}/>
      <ellipse cx="300" cy="200" rx="190" ry="106" fill="none" stroke="#7a766c" stroke-width="2"/>
      ${ring}
      <ellipse cx="300" cy="200" rx="40" ry="22" fill="#3a3630" ${ink}/>
      <text x="300" y="150" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#2b251e">Grind against time,</text>
      <text x="300" y="262" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#2b251e">and see what was.</text>
      <path d="M300,40 l-10,-18 h20 Z" fill="#2b251e"/>
      ${S4.year==='1448'?`<text x="300" y="${200-140*.56+28}" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#2b251e">A</text>`:''}`};
};

/* ---------------- 出料口 ---------------- */
VIEWS.i_chute = function(){
  const c=S4.chute;
  if(!S4.ground) return { title:'Chute', cap:'出料口落着一层旧面粉，木槽里空空的。', svg:`${m4Wall}<path d="M200,60 L400,60 L380,180 L220,180 Z" fill="#5a4636" ${ink}/><path d="M120,220 L480,220 L450,360 L150,360 Z" fill="#6a5440" ${ink}/><ellipse cx="300" cy="226" rx="170" ry="16" fill="#e6dfcc"/>` };
  return { title:'Chute',
    cap: (c.deer&&c.cgear&&c.wheat) ? '木槽里只剩一层面粉。' : '出料口落下了三样东西：一只木鹿玩具、一个铜齿轮、一束金色的麦穗。',
    svg:`${m4Wall}<path d="M200,60 L400,60 L380,180 L220,180 Z" fill="#5a4636" ${ink}/>
      <path d="M120,220 L480,220 L450,360 L150,360 Z" fill="#6a5440" ${ink}/><ellipse cx="300" cy="226" rx="170" ry="16" fill="#e6dfcc"/>
      ${c.deer?'':`<g id="z-c-deer" class="zhot"><rect x="140" y="150" width="140" height="120" fill="transparent" stroke="none"/><g transform="translate(200,214) scale(1)">${deerToyArt}</g></g>`}
      ${c.cgear?'':`<g id="z-c-cgear" class="zhot"><g transform="translate(340,240)">${gearArt(40,12,'#b0703a',{dark:'#7a4a22',hub:'#4a2a12'})}</g></g>`}
      ${c.wheat?'':`<g id="z-c-wheat" class="zhot"><rect x="400" y="120" width="70" height="150" fill="transparent" stroke="none"/><g transform="translate(436,200) rotate(18) scale(.9)">${wheatArt}</g></g>`}`,
    bind(){
      on('z-c-deer', ()=>{ c.deer=true; give('deer'); sfx.pick(); act('一只木头雕的小鹿，四个轮子还能转。鹿角被摸得发亮——是玛格丽的玩具。'); });
      on('z-c-cgear', ()=>{ c.cgear=true; give('cgear'); sfx.pick(); act('一个铜齿轮，十二个齿。背面刻着鸦戒纹章，还有一行小字：「钟楼 · 第三轴」。'); });
      on('z-c-wheat', ()=>{ c.wheat=true; give('wheat'); sfx.pick(); act('一束金色的麦穗，沉甸甸的。1415 年那一季，灰麦村是大丰收。'); });
    }
  };
};

/* ---------------- 面粉袋 ---------------- */
VIEWS.i_sacks = function(){
  const pos=[[110,250],[240,262],[370,248],[500,258]], GEAR_SACK=3;
  const sacks = pos.map(([x,y],i)=>{ const torn=S4.sacks[i];
    return `<g id="z-s${i}" class="zhot">${torn
      ? `<path d="M${x-56},${y+90} Q${x-62},${y+30} ${x-34},${y+16} Q${x},${y+6} ${x+34},${y+16} Q${x+62},${y+30} ${x+56},${y+90} Z" fill="#d4c9aa" ${ink}/>
         <path d="M${x-30},${y+20} l-6,-16 l10,8 l6,-14 l6,12 l8,-10 l4,14" fill="none" stroke="#8a7a5c" stroke-width="2"/>
         <ellipse cx="${x+40}" cy="${y+94}" rx="50" ry="10" fill="#ece5d2"/>`
      : `<path d="M${x-52},${y+90} Q${x-66},${y-10} ${x-40},${y-50} L${x-26},${y-74} L${x+26},${y-74} L${x+40},${y-50} Q${x+66},${y-10} ${x+52},${y+90} Z" fill="#d4c9aa" ${ink}/>
         <path d="M${x-26},${y-74} Q${x},${y-62} ${x+26},${y-74} M${x-30},${y-62} Q${x},${y-48} ${x+30},${y-62}" stroke="#8a7a5c" stroke-width="2.4" fill="none"/>
         <path d="M${x},${y-20} V${y+40} M${x-14},${y-6} L${x},${y+8} L${x+14},${y-6} M${x-14},${y+14} L${x},${y+28} L${x+14},${y+14}" stroke="#9a8a62" stroke-width="2.4" fill="none"/>`}</g>`; }).join('');
  return { title:'Flour Sacks',
    cap: has('gears') || S4.ground ? '面粉袋都撕开了。' : '四只鼓鼓的面粉袋，缝线早就朽了，一扯就开。（点击撕开）',
    svg:`${m4Wall}<rect y="340" width="600" height="60" fill="#5a4a38"/>${sacks}`,
    bind(){
      pos.forEach((_,i)=> on('z-s'+i, ()=>{
        if(S4.sacks[i]){ sfx.tap(); return setCap('只有面粉。'); }
        S4.sacks[i]=true; noise(.3,1800,.06,.8);
        if(i===GEAR_SACK){ give('gears'); sfx.pick(); return act('袋子里「哗啦」一声——面粉底下埋着一包齿轮：一大、一中、一小，还有一个裂了缝的。'); }
        act('你撕开袋子，面粉扑簌簌地洒了一地。里面只有面粉。');
      }));
    }
  };
};

/* ---------------- 记账木签 ---------------- */
VIEWS.i_tally = function(){
  S4.tallySeen = true;
  const groups=[1316,1349,1382,1415];
  const sticks = groups.map((y,gi)=>[y-1,y,y+1].map((yr,k)=>{ const x=46+gi*140+k*40, n = k===0?2 : k===1?1 : 9;
    let notches=''; for(let j=0;j<n;j++) notches+=`<path d="M${x-7},${92+j*20} l14,-6" stroke="#2b251e" stroke-width="2.4"/>`;
    return `<rect x="${x-10}" y="64" width="20" height="${k===1?236:230}" rx="3" fill="${k===1?'#8a7a5a':'#a8946a'}" ${ink}/>
      <circle cx="${x}" cy="56" r="4" fill="none" stroke="#2b251e" stroke-width="2"/>${notches}
      ${k===1?`<g transform="translate(${x},${276})" stroke="#2b251e" stroke-width="2.4" fill="none"><path d="M0,0 L-6,-14 M0,0 L0,-16 M0,0 L6,-14 M0,0 L0,8"/></g>`:''}
      <text x="${x}" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="#2b251e">${yr}</text>`; }).join('')).join('');
  return { title:'Tally Sticks',
    cap:'墙上挂着一排记账木签，每年一根，刻痕数就是那一年的收成。1316、1349、1382、1415 这几根旁刻着鸦爪印——之前几年收成极差，之后一下子大丰收。每隔 33 年。',
    svg:`${m4Wall}<rect x="20" y="40" width="560" height="12" fill="#4a3a2a" ${ink}/>${sticks}
      ${groups.map((_,gi)=>`<path d="M${170+gi*140},70 V330" stroke="#8c8471" stroke-width="1.4" stroke-dasharray="4 4"/>`).slice(0,3).join('')}`};
};

/* ---------------- 物品：缩略图 / 特写 ---------------- */
Object.assign(TH, {
  crank:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(36,82) scale(.8)">${crankArt}</g>`,
  gears:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(38,50) scale(.2)">${gearArt(120,22,'#8a6a44')}</g>
    <g transform="translate(66,70) scale(.24)">${gearArt(72,14,'#7a6248')}</g><g transform="translate(36,84) scale(.26)">${gearArt(48,10,'#6e5a44')}</g>`,
  elamp:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,70) scale(1.3)">${eLampArt(S4.lampLit)}</g>`,
  cgear:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,56)">${gearArt(28,12,'#b0703a',{dark:'#7a4a22',hub:'#4a2a12'})}</g>`,
  deer: ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(44,64) scale(.55)">${deerToyArt}</g>`,
  wheat:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,58) rotate(15) scale(.7)">${wheatArt}</g>`
});
VIEWS.crank = ()=>({ title:'Sluice Crank', cap:'一把铁摇柄，一头是方孔。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(250,300) scale(3)">${crankArt}</g>` });
VIEWS.gears = ()=>({ title:'Gears', cap:'从面粉袋里翻出来的一包齿轮：大、中、小，还有一个裂了缝的。', svg:`<rect width="600" height="400" fill="#8f8875"/>
  <g transform="translate(170,190)">${gearArt(120,22,'#8a6a44')}</g><g transform="translate(380,150)">${gearArt(72,14,'#7a6248')}</g>
  <g transform="translate(500,280)">${gearArt(48,10,'#6e5a44')}</g><g transform="translate(360,320) scale(.8)">${gearArt(72,14,'#6a5a4a',{crack:true})}</g>` });
VIEWS.elamp = ()=>({ title:'E Lantern', cap:(S4.lampLit?'提灯亮着。':'提灯是灭的。')+'铁皮灯罩上刻着一个字母：E。是谁的提灯，掉在了母亲安排的马车旁边？', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,250) scale(4.6)">${eLampArt(S4.lampLit)}</g>` });
VIEWS.cgear = ()=>({ title:'Copper Gear', cap:'铜齿轮，十二个齿。背面刻着鸦戒纹章，和一行小字：「钟楼 · 第三轴」——是母亲当年从钟楼上拆下来、藏在这里的。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(190,200)">${gearArt(110,12,'#b0703a',{dark:'#7a4a22',hub:'#4a2a12'})}</g>
    <g transform="translate(440,200)"><circle r="100" fill="#a0602e" ${ink}/><circle r="80" fill="none" stroke="#6a3a18" stroke-width="2"/>
      <use href="#sym-raven" x="-36" y="-56" width="72" height="72" style="color:#5a3010"/>
      <text y="42" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="14" fill="#3a1e08">Turris · III</text></g>` });
VIEWS.deer = ()=>({ title:'Wooden Deer', cap:'一只木头雕的小鹿，装着四个小轮子。鹿角被摸得发亮。玛格丽小时候，一定天天拉着它满屋子跑。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(280,220) scale(2.6)">${deerToyArt}</g>` });
VIEWS.wheat = ()=>({ title:'Golden Wheat', cap:'一束金色的麦穗。1415 年那一季，灰麦村是大丰收——那是用一个孩子换来的。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,210) scale(2.2)">${wheatArt}</g>` });
