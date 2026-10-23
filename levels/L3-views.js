/* =====================================================================
   第 3 关 · 厨房与酒窖 —— 特写视图 + 物品
   ===================================================================== */
const k3Wall = `<rect width="600" height="400" fill="#a39b87"/><path d="M0,80H600M0,160H600M0,240H600M0,320H600M90,0V80M350,0V80M200,80V160M470,80V160M60,160V240M320,160V240M140,240V320M430,240V320M260,320V400M520,320V400" stroke="#8c8471" stroke-width="1.6"/>`;
const k3Table = `<rect y="318" width="600" height="10" fill="#6a5643" stroke="#1a1511" stroke-width="2"/><rect y="328" width="600" height="72" fill="#574634"/><path d="M0,352 H600 M0,378 H600" stroke="#45382a" stroke-width="1.6"/>`;
const CAP = {bucket:8, pot:5, chal:3};
const CN  = {bucket:'水桶', pot:'陶罐', chal:'圣杯', butt:'水缸', cauldron:'铁锅'};

/* ---------------- 草药架 ---------------- */
VIEWS.k_herbs = function(){
  const xs=[120,240,360,480];
  const bunches = RACK_ORDER.map((h,i)=>{
    const gone = herbGone(h);
    return gone ? `<path d="M${xs[i]},52 V66" stroke="#5a4632" stroke-width="3"/>`
      : `<g id="z-h-${h}" class="zhot"><rect x="${xs[i]-50}" y="50" width="100" height="270" fill="transparent" stroke="none"/><g transform="translate(${xs[i]},52) scale(2.4)">${herbArt(h)}</g></g>`;
  }).join('');
  return { title:'Herb Rack',
    cap: has('recipe') ? '四束干草药倒挂在架子上。对照配方背面的图谱认一认——画着骷髅的碰不得。（点击取下一束）'
                       : '四束干草药倒挂在架子上，叶子、花和果子都不一样。你认不出它们是什么。',
    svg:`${k3Wall}
      <path d="M50,0 V40 M550,0 V40" stroke="#221e1a" stroke-width="4" stroke-dasharray="8 4"/>
      <rect x="30" y="38" width="540" height="16" rx="6" fill="#4a3a2c" ${cInk}/>
      ${bunches}
      ${has('recipe') ? uiGoal('对照配方背面的图谱，取下要用的草药 · 画着骷髅的碰不得') : ''}`,
    bind(){
      RACK_ORDER.forEach(h=> on('z-h-'+h, ()=>{
        if(HERBS[h].toxic){ shake(); setCap(`你刚伸手去够那束${has('recipe')?HERBS[h].cn:'草'}——`); closeZoom(); return marthaWake(); }
        give(h); sfx.pick(); act(`你取下了那束${HERBS[h].cn}。`);
      }));
    }
  };
};

/* ---------------- 水具：量取四勺 ----------------
   画法：容器剖面里用 clipPath 灌水，内壁刻着每一勺的刻度；下方钉着羊皮纸标签。
   选中的容器会被提起并在台面投下暖光。 */
const WATER = '#5d7a86', WATER_HI = '#a9bec2';
const V_BASE = 292;                                   // 台面高度
const V_GEO = {                                       // 各容器几何：x 中心、口沿 top、可装水区 [y0,y1]
  bucket:{x:188, top:156},
  pot:   {x:304, top:176},
  chal:  {x:410, top:198}
};
function vShape(id){
  const {x, top} = V_GEO[id], b = V_BASE;
  if(id==='bucket') return { body:`M${x-50},${top} L${x-42},${b} L${x+42},${b} L${x+50},${top} Z`, y0:top+6, y1:b-4, w:100 };
  if(id==='pot')    return { body:`M${x-17},${top} H${x+17} V${top+14} Q${x+46},${top+38} ${x+42},${b-28} Q${x+38},${b} ${x},${b} Q${x-38},${b} ${x-42},${b-28} Q${x-46},${top+38} ${x-17},${top+14} Z`, y0:top+16, y1:b-3, w:92 };
  return               { body:`M${x-34},${top} Q${x-34},${top+58} ${x},${top+64} Q${x+34},${top+58} ${x+34},${top} Z`, y0:top+3, y1:top+62, w:68 };
}
function vDecor(id){
  const {x, top} = V_GEO[id], b = V_BASE;
  if(id==='bucket') return `
    <path d="M${x-26},${top} L${x-22},${b} M${x},${top} V${b} M${x+26},${top} L${x+22},${b}" stroke="#3e3026" stroke-width="1.6"/>
    <path d="M${x-49},${top+26} L${x+49},${top+26} M${x-44},${b-24} L${x+44},${b-24}" stroke="#2a2622" stroke-width="7"/>
    <path d="M${x-49},${top+26} L${x+49},${top+26} M${x-44},${b-24} L${x+44},${b-24}" stroke="#56524a" stroke-width="2"/>
    <path d="M${x-50},${top} Q${x},${top-64} ${x+50},${top}" fill="none" stroke="#2a2622" stroke-width="3.4"/>
    <ellipse cx="${x}" cy="${top}" rx="50" ry="8" fill="none" ${cInk}/>`;
  if(id==='pot') return `
    <path d="M${x+38},${top+30} q26,2 22,36 q-4,22 -22,20" fill="none" stroke="#1a1511" stroke-width="10" stroke-linecap="round"/>
    <path d="M${x+38},${top+30} q26,2 22,36 q-4,22 -22,20" fill="none" stroke="#9a6a44" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="${x}" cy="${top}" rx="19" ry="5" fill="#7a4e32" ${cInk}/>
    <path d="M${x-34},${top+54} Q${x},${top+64} ${x+34},${top+54}" stroke="#6e4a30" stroke-width="2" fill="none"/>
    <path d="M${x-26},${top+40} Q${x-34},${top+70} ${x-24},${b-14}" stroke="#c09070" stroke-width="3" fill="none" opacity=".5"/>`;
  return `
    <ellipse cx="${x}" cy="${top}" rx="34" ry="6" fill="none" ${cInk}/>
    <rect x="${x-4}" y="${top+64}" width="8" height="${b-top-76}" fill="#8e8a7c" ${cInk}/>
    <ellipse cx="${x}" cy="${top+76}" rx="8" ry="4" fill="#8e8a7c" ${cInk}/>
    <path d="M${x-26},${b} Q${x-22},${b-14} ${x-5},${b-14} L${x+5},${b-14} Q${x+22},${b-14} ${x+26},${b} Z" fill="#8e8a7c" ${cInk}/>
    <path d="M${x-24},${top+10} Q${x-22},${top+44} ${x-6},${top+56}" stroke="#c9c5b8" stroke-width="3" fill="none" opacity=".7"/>`;
}
function vTag(x, name, line2, hot){
  return `<g transform="translate(${x},${V_BASE+46}) rotate(${(x%7)-3})">
    <circle cx="0" cy="-12" r="2.4" fill="#2a2622"/><path d="M0,-12 L-30,-2 M0,-12 L30,-2" stroke="#5a4a36" stroke-width="1"/>
    <rect x="-38" y="-2" width="76" height="40" fill="${hot?'#efe2bf':'#ddd3b8'}" ${ink}/>
    <text x="0" y="15" text-anchor="middle" font-family="Georgia,'Songti SC',serif" font-size="14" fill="#2b251e">${name}</text>
    <text x="0" y="31" text-anchor="middle" font-family="Georgia,'Songti SC',serif" font-size="12" fill="#5a4e3e">${line2}</text></g>`;
}
function vessel(id, amt, sel){
  const cap = CAP[id], {x} = V_GEO[id], s = vShape(id);
  const fill = {bucket:'#6e5440', pot:'#a06a44', chal:'#8e8a7c'}[id];
  const level = s.y1 - (s.y1 - s.y0) * amt / cap;
  let ticks=''; for(let k=1;k<cap;k++){ const y = s.y1 - (s.y1 - s.y0) * k / cap;
    ticks += `<path d="M${x+s.w/2-22},${y.toFixed(1)} h10" stroke="#1a1511" stroke-width="1.4" opacity=".45"/>`; }
  const lift = sel ? -18 : 0;
  return `<g id="z-v-${id}" class="zhot">
    <rect x="${x-s.w/2-12}" y="${V_GEO[id].top-60}" width="${s.w+24}" height="${V_BASE-V_GEO[id].top+110}" fill="transparent" stroke="none"/>
    ${sel?`<ellipse cx="${x}" cy="${V_BASE+2}" rx="${s.w/2+8}" ry="7" fill="#ffd27a" opacity=".35"/>`:`<ellipse cx="${x}" cy="${V_BASE+2}" rx="${s.w/2}" ry="5" fill="#000" opacity=".25"/>`}
    <g transform="translate(0,${lift})">
      <defs><clipPath id="vc-${id}"><path d="${s.body}"/></clipPath></defs>
      <path d="${s.body}" fill="${fill}"/>
      <g clip-path="url(#vc-${id})">
        <rect x="${x-60}" y="${s.y0-20}" width="120" height="${s.y1-s.y0+30}" fill="#000" opacity=".28"/>
        ${amt?`<rect x="${x-60}" y="${level.toFixed(1)}" width="120" height="${(s.y1-level+20).toFixed(1)}" fill="${WATER}"/>
               <rect x="${x-60}" y="${level.toFixed(1)}" width="120" height="3" fill="${WATER_HI}" opacity=".8"/>`:''}
        ${ticks}
      </g>
      <path d="${s.body}" fill="none" ${cInk}/>
      ${vDecor(id)}
      ${sel?`<path d="M${x-8},${V_GEO[id].top-34} l8,10 l8,-10" stroke="#efe6c8" stroke-width="3" fill="none" class="pulse"/>`:''}
    </g>
    ${vTag(x, `${CN[id]} · ${cap}`, `${amt} / ${cap} 勺`, sel)}
  </g>`;
}
function doPour(from, to){
  const W = S3.water, c = S3.cauldron;
  if(from==='butt'){ if(to==='cauldron') return '水缸太重了，搬不动。先舀进别的容器里。';
    W[to] = CAP[to]; pour(); return `你从水缸里舀满了${CN[to]}。`; }
  if(to==='butt'){ if(!W[from]) return `${CN[from]}是空的。`; W[from]=0; pour(); return `你把${CN[from]}里的水倒回了水缸。`; }
  if(!W[from]) return `${CN[from]}是空的。`;
  if(to==='cauldron'){
    if(S3.boiling || S3.brew==='good') return '锅里的药还在呢。';
    c.water += W[from]; const n=W[from]; W[from]=0; pour();
    if(c.water > 4){ c.water = 0; setTimeout(sfx.fail, 300); return `锅里的水多了——「四勺月露，不可多一滴」。你只好把锅里的水倒掉。`; }
    return c.water===4 ? `你把${n}勺水倒进铁锅。锅里正好四勺。` : `你把${n}勺水倒进铁锅。锅里现在有${c.water}勺。`;
  }
  const room = CAP[to]-W[to]; if(!room) return `${CN[to]}已经满了。`;
  const m = Math.min(room, W[from]); W[from]-=m; W[to]+=m; pour();
  return `你把${CN[from]}里的水倒进${CN[to]}，倒了${m}勺${W[from]?`，${CN[from]}里还剩${W[from]}勺`:''}。`;
}
VIEWS.k_water = function(){
  const W=S3.water, sel=S3.sel, chal=has('chalice'), c=S3.cauldron;
  let planks=''; for(let x=0;x<600;x+=74) planks+=`<path d="M${x},${V_BASE+8} V400"/>`;
  return { title:'Water',
    cap: sel ? `你提起了${CN[sel]}。再点另一个容器，把水倒过去${sel==='butt'?'':'；点水缸就是倒掉'}。（再点一次放下）`
             : `点一个容器提起来，再点另一个，就能把水倒过去。${chal?'':'（要是有只小一点的杯子就好了）'}配方要的是「四勺月露」。`,
    svg:`<rect width="600" height="400" fill="#a39b87"/>
      <path d="M0,70H600M0,140H600M0,210H600M90,0V70M330,0V70M520,0V70M200,70V140M450,70V140M60,140V210M300,140V210M560,140V210M150,210V${V_BASE}M420,210V${V_BASE}" stroke="#8c8471" stroke-width="1.6"/>
      <rect y="${V_BASE}" width="600" height="10" fill="#6a5643" ${cInk}/>
      <rect y="${V_BASE+10}" width="600" height="${400-V_BASE-10}" fill="#574634"/>
      <g stroke="#45382a" stroke-width="1.5">${planks}</g>
      <!-- 水缸（取之不尽） -->
      <g id="z-v-butt" class="zhot"><rect x="4" y="90" width="124" height="300" fill="transparent" stroke="none"/>
        ${sel==='butt'?`<ellipse cx="66" cy="${V_BASE+2}" rx="60" ry="8" fill="#ffd27a" opacity=".35"/>`:`<ellipse cx="66" cy="${V_BASE+2}" rx="54" ry="6" fill="#000" opacity=".25"/>`}
        <path d="M14,118 Q6,206 18,${V_BASE} L114,${V_BASE} Q126,206 118,118 Z" fill="#6e5440" ${cInk}/>
        <path d="M40,120 Q36,206 42,${V_BASE} M66,120 V${V_BASE} M92,120 Q96,206 90,${V_BASE}" stroke="#3e3026" stroke-width="1.6"/>
        <path d="M11,150 Q66,164 121,150 M14,260 Q66,274 118,260" stroke="#2a2622" stroke-width="8" fill="none"/>
        <path d="M11,150 Q66,164 121,150 M14,260 Q66,274 118,260" stroke="#56524a" stroke-width="2" fill="none"/>
        <ellipse cx="66" cy="118" rx="52" ry="13" fill="#4a3a2c" ${cInk}/>
        <ellipse cx="66" cy="120" rx="44" ry="9" fill="${WATER}"/><path d="M40,118 Q60,114 80,118" stroke="${WATER_HI}" stroke-width="2" fill="none"/>
        ${sel==='butt'?`<path d="M58,84 l8,10 l8,-10" stroke="#efe6c8" stroke-width="3" fill="none" class="pulse"/>`:''}
        ${vTag(66, '水缸', '取之不尽', sel==='butt')}</g>
      ${vessel('bucket', W.bucket, sel==='bucket')}
      ${vessel('pot', W.pot, sel==='pot')}
      ${chal ? vessel('chal', W.chal, sel==='chal')
             : `<path d="M376,198 Q376,256 410,262 Q444,256 444,198 Z" fill="none" stroke="#6b6252" stroke-width="2" stroke-dasharray="5 4"/>${vTag(410,'？','—',false)}`}
      <!-- 铁锅（目标：四勺） -->
      ${S3.potionDone?'':`<g id="z-v-cauldron" class="zhot"><rect x="462" y="150" width="136" height="240" fill="transparent" stroke="none"/>
        <path d="M486,${V_BASE} L496,262 M570,${V_BASE} L560,262 M528,${V_BASE} V270" stroke="#2a2622" stroke-width="5"/>
        <path d="M472,214 Q472,272 528,278 Q584,272 584,214 Z" fill="#1d1b19" ${cInk}/>
        <ellipse cx="528" cy="214" rx="56" ry="11" fill="#33302c" ${cInk}/>
        ${c.water?`<ellipse cx="528" cy="216" rx="48" ry="7.5" fill="${S3.brew==='good'?BREW_COL(99):WATER}"/><path d="M500,214 Q520,210 540,214" stroke="${WATER_HI}" stroke-width="2" fill="none"/>`
                 :`<ellipse cx="528" cy="216" rx="48" ry="7.5" fill="#0e0d0c"/>`}
        <path d="M478,232 Q490,262 516,272" stroke="#4a4744" stroke-width="3" fill="none"/>
        <path d="M474,208 q-10,-8 -6,-18 M582,208 q10,-8 6,-18" stroke="#1a1511" stroke-width="3" fill="none"/>
        ${vTag(528, '铁锅', `${c.water} / 4 勺`, c.water===4)}</g>`}
      ${S3.potionDone ? '' : uiGoal('「四勺月露，不可多一滴」：让铁锅里正好有 4 勺水')}`,
    bind(){
      ['butt','bucket','pot','chal','cauldron'].forEach(id=> on('z-v-'+id, ()=>{
        if(!S3.sel){
          if(id==='cauldron'){ sfx.tap(); return setCap('先提起一个装着水的容器，再点铁锅。'); }
          S3.sel = id; sfx.tap(); return render();
        }
        if(S3.sel===id){ S3.sel=null; sfx.tap(); return render(); }
        const msg = doPour(S3.sel, id); S3.sel=null; render(); updateAll(); setCap(msg);
      }));
    }
  };
};

/* ---------------- 天平：罂粟籽与圣铃同重 ---------------- */
VIEWS.k_scale = function(){
  const done = has('seeds') || S3.cauldron.seeds || S3.potionDone;
  const p = S3.pinch, bal = S3.bellOnScale && p===5;
  const t = !S3.bellOnScale ? (p? 8 : 0) : Math.max(-8, Math.min(8, p>5 ? 8 : -(5-p)*1.8));
  return { title:'Scales',
    cap: done ? '罂粟籽已经称好了。'
      : !S3.bellOnScale ? '一架小铜天平。配方说：「罂粟籽与圣铃同重。」' + (has('bell')?'（点击左盘放上圣铃）':'')
      : bal ? '两只秤盘稳稳地停在了同一高度。（点击右盘把罂粟籽收起来）'
      : p ? '右盘慢慢往下沉……还差一点。' : '圣铃放在左盘上，天平歪向了一边。' + (has('poppy')?'（点击右盘撒入罂粟籽）':''),
    svg:`${k3Wall}${k3Table}
      <g ${cInk}>
        <rect x="292" y="120" width="16" height="190" fill="#8a6a3a"/><rect x="250" y="300" width="100" height="18" fill="#6a5030"/>
        <g transform="rotate(${-t} 300 120)">
          <path d="M150,120 H450" stroke="#8a6a3a" stroke-width="8"/><circle cx="300" cy="120" r="10" fill="#6a5030"/>
          <path d="M150,120 L118,210 M150,120 L182,210 M450,120 L418,210 M450,120 L482,210" stroke-width="1.6" fill="none"/>
          <g id="z-left" class="zhot"><rect x="100" y="150" width="100" height="90" fill="transparent" stroke="none"/>
            <path d="M104,210 Q150,236 196,210 Z" fill="#b39c6e"/>
            ${S3.bellOnScale?`<g transform="translate(150,186) scale(.6)">${bellArt}</g>`:''}</g>
          <g id="z-right" class="zhot"><rect x="400" y="150" width="100" height="90" fill="transparent" stroke="none"/>
            <path d="M404,210 Q450,236 496,210 Z" fill="#b39c6e"/>
            ${p?`<ellipse cx="450" cy="${210-p*1.4}" rx="${10+p*4}" ry="${3+p*1.2}" fill="#2e2a24"/>`:''}
            ${bal?`<rect x="398" y="156" width="104" height="84" rx="8" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>`:''}</g>
        </g>
        <path d="M300,108 V92 l-6,8 h12 Z" fill="#6a5030"/>
      </g>
      ${uiGoal('让两只秤盘一样高 ——「罂粟籽与圣铃同重」')}
      ${done ? uiTag(300, 70, '已称好', {fill:'#efe2bf', size:14}) : `
        ${uiTag(150, 264, S3.bellOnScale ? '左盘：圣铃' : '左盘：空', {w:110})}
        ${uiTag(450, 264, p ? `右盘：罂粟籽 ${p} 撮` : '右盘：空', {w:140})}
        ${bal ? uiTag(300, 70, '平衡了', {fill:'#efe2bf', size:14}) : S3.bellOnScale ? uiTag(300, 70, p ? '还差一点……' : '偏向左边', {size:13}) : ''}
        ${uiBtn('z-bBell', 60, 340, 150, S3.bellOnScale ? '拿回圣铃' : '放上圣铃', has('bell') && !(S3.bellOnScale && p))}
        ${uiBtn('z-bSeed', 225, 340, 150, '撒一撮罂粟籽', S3.bellOnScale && has('poppy') && !bal)}
        ${uiBtn('z-bTake', 390, 340, 150, '收起罂粟籽', bal)}`}`,
    bind(){
      const L = ()=>document.querySelector('#zsvg #z-left'), R = ()=>document.querySelector('#zsvg #z-right');
      on('z-bBell', ()=>L().dispatchEvent(new MouseEvent('click',{bubbles:true})));
      on('z-bSeed', ()=>{ if(bal) return setCap('已经平衡了，再撒就多了。点「收起罂粟籽」。'); R().dispatchEvent(new MouseEvent('click',{bubbles:true})); });
      on('z-bTake', ()=>{ if(!bal) return setCap('两边还没平衡。'); R().dispatchEvent(new MouseEvent('click',{bubbles:true})); });
      on('z-left', ()=>{
        if(done){ sfx.tap(); return setCap('罂粟籽已经称好了。'); }
        if(S3.bellOnScale){ if(p) return setCap('右盘里还有籽呢。'); S3.bellOnScale=false; sfx.tap(); return act('你把圣铃拿了回来。'); }
        if(!has('bell')){ sfx.fail(); return setCap('用什么当砝码呢？配方上写着：「与圣铃同重」。'); }
        S3.bellOnScale=true; handBell(); act('你把圣铃放在左盘上，天平「当」地歪向了左边。');
      });
      on('z-right', ()=>{
        if(done){ sfx.tap(); return setCap('罂粟籽已经称好了。'); }
        if(!S3.bellOnScale){ sfx.tap(); return setCap('先在另一边放个砝码。'); }
        if(bal){ S3.pinch=0; S3.bellOnScale=false; give('seeds'); take('poppy'); sfx.pick(); return act('你把罂粟籽包进一小块布里收好，又把圣铃拿了回来。那束罂粟已经摇空了。'); }
        if(!has('poppy')){ sfx.tap(); return setCap('罂粟籽从哪儿来？草药架上也许有。'); }
        S3.pinch++; noise(.15,3200,.05,1);
        if(S3.pinch>5){ S3.pinch=0; sfx.fail(); render(); updateAll(); return setCap('撒多了——右盘「哐」地沉到了底。你只好把籽倒掉重来。'); }
        render(); updateAll(); setCap(S3.pinch===5 ? '两只秤盘稳稳地停在了同一高度。（点击右盘把罂粟籽收起来）' : '你摇了摇罂粟蒴果，一撮籽撒进右盘。');
      });
    }
  };
};

/* ---------------- 研钵：缬草九叶 ---------------- */
VIEWS.k_mortar = function(){
  const done = has('paste') || S3.cauldron.paste || S3.potionDone, n=S3.leaves;
  let leaves=''; for(let i=0;i<n;i++){ const a=i*40, r=20+(i%3)*14, x=300+r*Math.cos(a*Math.PI/180), y=212+r*.36*Math.sin(a*Math.PI/180);
    leaves+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="13" ry="5" transform="rotate(${a} ${x.toFixed(0)} ${y.toFixed(0)})" fill="#6f8a4a" stroke="#3e4a2a" stroke-width="1.4"/>`; }
  return { title:'Mortar',
    cap: done ? '缬草已经捣成了泥。' : !has('valerian') ? '一只石研钵，里面干干净净的。配方说：「缬草九叶」。'
      : n ? `研钵里放着几片缬草叶。（点击缬草再放一片，点击杵捣碎）` : '一只石研钵。（点击右边的缬草摘一片叶子放进去）',
    svg:`${k3Wall}${k3Table}
      <ellipse cx="300" cy="212" rx="130" ry="34" fill="#6e6a60" ${cInk}/>
      <path d="M170,212 Q178,320 300,324 Q422,320 430,212" fill="#6e6a60" ${cInk}/>
      <ellipse cx="300" cy="212" rx="110" ry="26" fill="#3e3b35" ${cInk}/>
      ${leaves}
      <g id="z-pestle" class="zhot"><rect x="360" y="60" width="90" height="170" fill="transparent" stroke="none"/>
        <path d="M372,206 L432,80" stroke="#8a8478" stroke-width="22" stroke-linecap="round"/><path d="M372,206 L432,80" stroke="#1a1511" stroke-width="2" fill="none"/></g>
      ${has('valerian') && !done ? `<g id="z-val" class="zhot"><rect x="470" y="40" width="110" height="280" fill="transparent" stroke="none"/><g transform="translate(525,50) scale(2)">${herbArt('valerian')}</g></g>` : ''}
      ${uiGoal('「缬草九叶」：往研钵里放正好九片叶子，再捣碎')}
      ${done ? uiTag(300, 70, '已捣成泥', {fill:'#efe2bf', size:14}) : `
        ${uiTag(300, 270, `研钵里：${n} 片叶子`, {w:150, size:13.5, fill:n===9?'#efe2bf':'#ddd3b8'})}
        ${uiBtn('z-bLeaf', 60, 340, 150, '放一片缬草叶', has('valerian'))}
        ${uiBtn('z-bEmpty', 225, 340, 150, '倒空重来', n>0)}
        ${uiBtn('z-bGrind', 390, 340, 150, '用杵捣碎', n===9)}`}`,
    bind(){
      on('z-bLeaf', ()=>{ if(!has('valerian')){ sfx.tap(); return setCap('手里没有缬草。草药架上，叶子成对、开小白花的那一束就是。'); } document.querySelector('#zsvg #z-val').dispatchEvent(new MouseEvent('click',{bubbles:true})); });
      on('z-bEmpty', ()=>{ S3.leaves=0; sfx.tap(); render(); updateAll(); setCap('你把研钵倒空了。'); });
      on('z-bGrind', ()=>document.querySelector('#zsvg #z-pestle').dispatchEvent(new MouseEvent('click',{bubbles:true})));
      on('z-val', ()=>{
        S3.leaves++; noise(.08,2800,.04,1);
        if(S3.leaves>9){ S3.leaves=0; sfx.fail(); render(); updateAll(); return setCap('叶子放多了。「缬草九叶」——你把研钵倒空，重新数。'); }
        render(); updateAll();
      });
      on('z-pestle', ()=>{
        if(done){ sfx.tap(); return setCap('缬草已经捣好了。'); }
        if(!S3.leaves){ sfx.tap(); return setCap('研钵是空的。'); }
        if(S3.leaves<9){ sfx.fail(); return setCap('叶子的数目不对……配方上写的是「缬草九叶」。'); }
        S3.leaves=0; give('paste'); take('valerian'); for(let i=0;i<4;i++) setTimeout(()=>noise(.12,600,.08,1), i*160);
        act('你把九片缬草叶捣成了墨绿色的泥，刮进一只小碗里。');
      });
    }
  };
};

/* ---------------- 大灶：放料、熬药、灭火、烟道 ---------------- */
VIEWS.k_stove = function(){
  const c=S3.cauldron, boil=S3.boiling, good=S3.brew==='good';
  const potY = boil||good ? 214 : 150;
  const liquid = boil ? BREW_COL(S3.caws) : good ? BREW_COL(99) : (c.seeds||c.paste) ? '#6a7a5a' : '#4d6a78';
  const status = S3.potionDone ? '锅已经空了。' : good ? '药汤是暗紫色的，冒着微甜的热气——正好。' + (has('vial')?'（点击铁锅，把药装进 H 瓶）':'')
    : boil ? '药汤在火上咕嘟咕嘟地翻滚着。窗外的乌鸦时不时叫一声……（点击锅链离火）'
    : `铁锅里：${c.water} 勺水${c.seeds?' · 罂粟籽':''}${c.paste?' · 缬草泥':''}。${S3.fireOut?'灶火灭了。':''}`;
  return { title:'Hearth', cap:status,
    svg:`<rect width="600" height="400" fill="#9a927e"/><path d="M0,140H600M0,200H600M80,96V140M520,96V140M40,140V200M560,140V200" stroke="#857d6a" stroke-width="1.6"/>
      <polygon points="200,0 400,0 470,96 130,96" fill="#5a5447" ${cInk}/>
      <g id="z-chim" class="zhot"><rect x="250" y="0" width="100" height="70" fill="#0c0a08" ${cInk}/>
        ${S3.fireOut&&!G.feathers.L3?`<path d="M290,60 Q300,30 318,14" stroke="#0e0c0a" stroke-width="3" fill="none"/><path d="M296,48 l-8,-4 M302,36 l-8,-5 M298,52 l8,-2 M304,40 l8,-3" stroke="#3a3530" stroke-width="2.4"/>`:''}</g>
      <rect x="110" y="96" width="380" height="20" fill="#6a6455" ${cInk}/>
      <path d="M210,116 V${potY-20} M390,116 V${potY-20}" stroke="#1a1511" stroke-width="3" stroke-dasharray="6 3"/>
      <g id="z-hang" class="zhot"><rect x="280" y="116" width="40" height="${potY-130}" fill="transparent" stroke="none"/><path d="M300,116 V${potY-24}" stroke="#2a2622" stroke-width="6" stroke-dasharray="8 4"/>
        <circle cx="300" cy="${potY-24}" r="8" fill="none" stroke="#2a2622" stroke-width="4"/>
        ${!S3.potionDone && !good?`<circle cx="300" cy="${potY-50}" r="16" fill="none" stroke="#efe6c8" stroke-width="1.6" class="pulse"/>`:''}</g>
      <rect x="60" y="260" width="480" height="140" fill="#6a6455" ${cInk}/>
      <path d="M60,290 H540 M60,320 H540 M60,350 H540 M60,380 H540 M120,260 V290 M240,260 V290 M360,260 V290 M480,260 V290 M180,290 V320 M300,290 V320 M420,290 V320" stroke="#4a463c" stroke-width="2"/>
      <g id="z-fire" class="zhot"><path d="M190,400 L190,320 Q190,280 240,278 L360,278 Q410,280 410,320 L410,400 Z" fill="#120e0b" ${cInk}/>
        ${S3.fireOut ? `<path d="M220,398 l30,-12 l40,6 l40,-10 l50,14 Z" fill="#3a332c"/><circle cx="270" cy="392" r="3" fill="#b2502a" opacity=".7"/><circle cx="330" cy="390" r="2.4" fill="#b2502a" opacity=".6"/>`
          : `<circle cx="300" cy="350" r="110" fill="url(#zfire)"/>
             <path class="flame" d="M220,398 Q236,320 256,350 Q270,290 296,340 Q316,296 334,348 Q356,316 380,398 Z" fill="#f2a83e"/>
             <path class="flame" d="M246,398 Q262,350 276,368 Q292,330 306,366 Q324,344 352,398 Z" fill="#ffd27a"/>`}</g>
      <g id="z-pot" class="zhot">
        <path d="M206,${potY} Q206,${potY+100} 300,${potY+108} Q394,${potY+100} 394,${potY} Z" fill="#1d1b19" ${cInk}/>
        <ellipse cx="300" cy="${potY}" rx="94" ry="16" fill="#2a2826" ${cInk}/>
        ${c.water||good?`<ellipse cx="300" cy="${potY+2}" rx="82" ry="11" fill="${liquid}"/>`:''}
        ${c.seeds?`<g fill="#2e2a24">${[0,1,2,3,4,5,6].map(i=>`<circle cx="${270+i*9}" cy="${potY+(i%2)*4}" r="1.6"/>`).join('')}</g>`:''}
        ${c.paste?`<ellipse cx="330" cy="${potY+1}" rx="14" ry="4" fill="#3e5a2a"/>`:''}
        ${boil||good?`<path d="M260,${potY-10} q-14,-24 4,-44 M300,${potY-12} q14,-24 -4,-48 M340,${potY-10} q-12,-22 4,-40" stroke="#d6d2c4" stroke-width="4" fill="none" opacity=".4" class="pulse"/>`:''}
      </g>
      <g transform="translate(30,30)"><path d="M0,70 L0,22 Q2,4 20,0 Q38,4 40,22 L40,70 Z" fill="${S3.flash?'#e8ecef':'#7c8487'}" ${cInk}/>
        <use href="#sym-raven" x="6" y="22" width="28" height="28" style="color:#0c0a08" opacity="${S3.flash?1:.5}"/></g>
      ${S3.flash?`<text x="50" y="118" text-anchor="middle" ${UI_FONT} font-size="15" fill="#2b251e">「呱——」</text>`:''}
      ${S3.took.recipe && !S3.potionDone ? uiGoal('配方：四勺月露 · 罂粟籽 · 缬草九叶 · 火上数到第七声鸦啼') : ''}
      ${S3.took.recipe && !S3.potionDone ? uiChecklist(440, 124, '铁锅里', [['四勺水（'+c.water+' / 4）', c.water===4||good], ['罂粟籽', c.seeds||good], ['缬草泥', c.paste||good], ['火上熬，数鸦啼', boil||good]]) : ''}
      ${S3.potionDone ? '' : good ? uiBtn('z-bBottle', 20, 160, 150, '装进 H 瓶', has('vial'))
        : boil ? uiBtn('z-bOff', 20, 160, 150, '离火！')
        : uiBtn('z-bAdd', 20, 140, 150, '放入材料', has('seeds')||has('paste')) + uiBtn('z-bHang', 20, 186, 150, '挂到火上熬', c.water===4&&c.seeds&&c.paste&&!S3.fireOut)}
      ${S3.fireOut && !boil ? uiBtn('z-bRelight', 20, 232, 150, '拨旺余烬，重新生火') : ''}
      <defs><radialGradient id="zfire"><stop offset="0" stop-color="#ffb34a" stop-opacity=".7"/><stop offset="1" stop-color="#ff7a20" stop-opacity="0"/></radialGradient></defs>`,
    bind(){
      const potClick = ()=>{
        if(S3.potionDone){ sfx.tap(); return setCap('锅已经空了。'); }
        if(good){ if(!has('vial')){ sfx.tap(); return setCap('药熬好了，得找个小瓶子装起来。'); } return bottlePotion(); }
        if(boil){ sfx.tap(); return setCap('药汤正在翻滚。'); }
        const add=[]; if(has('seeds')){ take('seeds'); c.seeds=true; add.push('罂粟籽'); } if(has('paste')){ take('paste'); c.paste=true; add.push('缬草泥'); }
        if(add.length){ pour(); return act(`你把${add.join('和')}倒进了铁锅。`); }
        sfx.tap(); setCap(status + (c.water!==4 ? '配方说：「四勺月露」——水要从缸边舀。' : ''));
      };
      const hangClick = ()=>{
        if(S3.potionDone || good){ sfx.tap(); return setCap(S3.potionDone?'锅已经空了。':'药已经熬好了。'); }
        if(boil){ const n=takeOff(), m=zcap.textContent; render(); updateAll();
          setCap(n===7 ? '你把铁锅从火上提了下来。药汤变成了暗紫色，冒着微甜的热气——正是第七声。' : m); return; }
        if(c.water!==4){ sfx.fail(); return setCap(`锅里的水不对。配方说：「四勺月露，不可多一滴」。现在是 ${c.water} 勺——去缸边的水具那里量。`); }
        if(!c.seeds || !c.paste){ sfx.fail(); return setCap('材料还没放齐：罂粟籽、缬草泥都要放进锅里。'); }
        if(S3.fireOut){ sfx.fail(); return setCap('灶火灭了。先把火重新生起来。'); }
        startBoil(); render(); updateAll(); setCap('你把铁锅挂到火上。药汤开始冒泡——「火上数到第七声鸦啼」。仔细听窗外，第七声一响就点「离火」。');
      };
      const relight = ()=>{ S3.fireOut=false; sfx.flame(); act('你拨开余烬，吹了几口气，火苗又窜了起来。'); };
      on('z-pot', potClick); on('z-bAdd', ()=>{ if(!has('seeds')&&!has('paste')){ sfx.tap(); return setCap('手里没有可以放进锅的材料。罂粟籽要在天平上称，缬草要在研钵里捣。'); } potClick(); });
      on('z-bBottle', ()=>{ if(!has('vial')){ sfx.tap(); return setCap('得找个小瓶子装——酒窖暗格里那只刻着 H 的空药瓶。'); } potClick(); });
      on('z-hang', hangClick); on('z-bHang', hangClick); on('z-bOff', hangClick); on('z-bRelight', relight);
      on('z-fire', ()=>{
        if(S3.fireOut) return relight();
        if(boil){ sfx.tap(); return setCap('火正旺着，别去动它。'); }
        const src = S3.water.bucket>=3 ? 'bucket' : S3.water.pot>=3 ? 'pot' : null;
        if(!src){ sfx.tap(); return setCap('灶火烧得正旺，热气扑面。'); }
        S3.water[src]=0; S3.fireOut=true; hiss(); act(`你把${CN[src]}里的水泼进灶膛——「嗤」的一声，火灭了，烟道里冒出一股白汽。`);
      });
      on('z-chim', ()=>{
        if(!S3.fireOut){ sfx.tap(); return setCap('烟道里烫得伸不进手。'); }
        if(!G.feathers.L3){ pickFeather('L3'); return render(); }
        sfx.tap(); setCap('烟道里只摸到一手黑灰。');
      });
    }
  };
};

/* ---------------- 酒窖：酒桶 ---------------- */
VIEWS.w_barrels = function(){
  const pos=[[150,124],[300,124],[450,124],[150,290],[300,290],[450,290]];
  const heads = W3.barrels.map((b,i)=>{ const [x,y]=pos[i], open = b.year===1408 && S3.lidOpen;
    return `<g id="z-b${i}" class="zhot">
      <defs><clipPath id="zbc${i}"><circle cx="${x}" cy="${y}" r="63"/></clipPath></defs>
      <ellipse cx="${x}" cy="${y-3}" rx="72" ry="71" fill="#3a2a1c" ${cInk}/>
      <circle cx="${x}" cy="${y}" r="64" fill="url(#zbHead)"/>
      <g clip-path="url(#zbc${i})" stroke="#3e2c1e" stroke-width="1.6">${[-48,-32,-16,0,16,32,48].map(d=>`<path d="M${x+d},${y-70} V${y+70}"/>`).join('')}</g>
      <circle cx="${x}" cy="${y}" r="54" fill="none" stroke="#3a2a1c" stroke-width="2"/>
      <circle cx="${x}" cy="${y}" r="64" fill="none" stroke="#2a2622" stroke-width="7"/>
      <path d="M${x-56},${y-30} A64,64 0 0 1 ${x+20},${y-61}" fill="none" stroke="#77716a" stroke-width="1.8"/>
      <circle cx="${x-50}" cy="${y-40}" r="2.2" fill="#1a1511"/><circle cx="${x+50}" cy="${y+40}" r="2.2" fill="#1a1511"/>
      <path d="M${x-5},${y+50} h10 v16 h-10 Z" fill="#7a5a3a" ${cInk}/>
      ${open ? `<circle cx="${x}" cy="${y}" r="52" fill="#0c0907" ${cInk}/>
          ${S3.took.recipe?'':`<g id="z-recipe" class="zhot"><path d="${'M'+(x-34)+','+(y+20)} l40,-8 l26,14 l-40,10 Z" fill="#d8cfb4" ${cInk}/><path d="M${x-26},${y+20} l34,-7" stroke="#7a6f5c" stroke-width="1.5"/></g>`}
          ${S3.took.vial?'':`<g id="z-vial" class="zhot"><rect x="${x+8}" y="${y-30}" width="16" height="30" rx="5" fill="#6f7e78" ${cInk}/><rect x="${x+12}" y="${y-38}" width="8" height="8" fill="#8a6a3a" ${cInk}/>
            <text x="${x+16}" y="${y-10}" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#1a1511">H</text></g>`}`
        : `<text x="${x}" y="${y+9}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="27" letter-spacing="1" fill="#ebe5d4" opacity=".88" filter="url(#zchalk3)" transform="rotate(${(i*7)%9-4} ${x} ${y})">${b.year}</text>
           ${S3.knocked[b.year]==='hollow'?`<circle cx="${x}" cy="${y}" r="64" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>`:''}`}
    </g>`; }).join('');
  const left = [!S3.took.recipe&&'一卷配方', !S3.took.vial&&'一只空药瓶'].filter(Boolean);
  return { title:'Casks',
    cap: S3.lidOpen ? (left.length ? `1408 年那只桶里藏着一个暗格：${left.join('、')}。` : '暗格已经空了。')
      : '六只酒桶，桶盖上用粉笔写着年份。（点击敲一敲）',
    svg:`<defs><radialGradient id="zbHead" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#7a5a3e"/><stop offset="1" stop-color="#4a3424"/></radialGradient>
        <filter id="zchalk3"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="1" seed="9"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter></defs>
      <rect width="600" height="400" fill="#6f6a5c"/><path d="M0,60H600M0,120H600M0,180H600M0,240H600M0,300H600M0,360H600M60,0V60M300,0V60M540,0V60M180,60V120M420,60V120M80,120V180M520,120V180M240,180V240M360,180V240M120,240V300M480,240V300M200,300V360M400,300V360" stroke="#5e5a4e" stroke-width="1.6"/><rect y="370" width="600" height="30" fill="#4a3a2c"/>
      <g ${cInk}><rect x="40" y="188" width="520" height="14" fill="#5a4636"/><rect x="40" y="356" width="520" height="14" fill="#5a4636"/>
        ${[90,210,390,510].map(x=>`<path d="M${x},202 V218 M${x},370 V400" stroke="#3e3127" stroke-width="10"/>`).join('')}</g>
      ${heads}
      <g stroke="#cfcab8" stroke-width=".8" fill="none" opacity=".45"><path d="M0,0 L60,0 M0,0 L0,54 M0,0 L50,40 M14,0 Q14,12 0,14 M30,0 Q28,26 0,30"/></g>
      ${S3.lidOpen ? '' : uiGoal(has('tag') ? '铅牌：「为她出生之年，酒窖里留着一桶」· 点桶盖敲一敲，听声音' : '六只酒桶，桶盖上写着年份 · 点桶盖敲一敲，听声音')}
      ${S3.lidOpen ? '' : `<g pointer-events="none">${W3.barrels.map((b,i)=>{ const k=S3.knocked[b.year]; if(!k) return '';
        const [x,y]=[[150,124],[300,124],[450,124],[150,290],[300,290],[450,290]][i];
        return uiTag(x+52, y-52, k==='hollow'?'空响！':'闷响', {fill:k==='hollow'?'#efe2bf':'#c9bfa5', size:12}); }).join('')}</g>`}`,
    bind(){
      W3.barrels.forEach((b,i)=> on('z-b'+i, ()=>{
        if(b.year===1408){
          if(S3.lidOpen) return;
          if(S3.knocked[1408]==='hollow'){ S3.lidOpen=true; take('tag'); sfx.creak(); return act('桶盖是松的。你用指甲抠住缝隙一撬——盖子掉了下来，里面不是酒，是一个暗格。'); }
          S3.knocked[1408]='hollow'; knockHollow(); render(); return setCap('「咚——」空空的回响。这只桶是空的，桶盖也有点松。');
        }
        S3.knocked[b.year]='dull'; knockDull(); setCap(`${b.year}。闷闷的一声，桶里装得满满的。`);
      }));
      on('z-recipe', ()=>{ S3.took.recipe=true; give('recipe'); sfx.pick(); act('你拿起了那卷纸。是母亲的笔迹——一张配方，背面画着草药图谱。'); });
      on('z-vial', ()=>{ S3.took.vial=true; give('vial'); sfx.pick(); act('一只空药瓶，瓶底刻着一个 H——和石屋书架上那只一模一样。'); });
    }
  };
};

/* ---------------- 物品：缩略图 / 特写 ---------------- */
const vialArt = (fill)=>`<g ${ink}><rect x="-22" y="-50" width="44" height="90" rx="14" fill="${fill||'#6f7e78'}" opacity=".9"/>
  <rect x="-12" y="-72" width="24" height="24" fill="#8a6a3a"/><path d="M-14,-30 Q-16,10 -10,30" stroke="#c9d3cf" stroke-width="3" fill="none" opacity=".6"/>
  <text x="0" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="#1a1511" stroke="none">H</text></g>`;
Object.assign(TH, {
  lamp:    ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,66) scale(1.5)">${lampArt(true)}</g>`,
  recipe:  ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="rotate(-6 49 56)"><path d="M18,22 H80 V92 H24 L18,86 Z" fill="#d8cfb4" ${ink}/>
    <path d="M26,36 H70 M26,46 H66 M26,56 H72 M26,66 H60" stroke="#5a4e3e" stroke-width="2"/><g transform="translate(64,62) scale(.22)">${herbArt('valerian')}</g></g>`,
  vial:    ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,62) scale(.7)">${vialArt()}</g>`,
  potion:  ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,62) scale(.7)">${vialArt('#6a3a5a')}</g>`,
  poppy:   ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,6) scale(.9)">${herbArt('poppy')}</g>`,
  valerian:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,6) scale(.9)">${herbArt('valerian')}</g>`,
  seeds:   ()=>`<rect width="98" height="112" fill="#a39b87"/><path d="M24,70 Q49,40 74,70 Q49,86 24,70 Z" fill="#cfc4a6" ${ink}/><g fill="#2e2a24">${[0,1,2,3,4,5,6,7,8].map(i=>`<circle cx="${38+(i%5)*6}" cy="${62+Math.floor(i/5)*6}" r="2"/>`).join('')}</g>`,
  paste:   ()=>`<rect width="98" height="112" fill="#a39b87"/><path d="M22,56 Q49,92 76,56 Z" fill="#8e8a7c" ${ink}/><ellipse cx="49" cy="56" rx="27" ry="6" fill="#3e5a2a" ${ink}/>`
});
BADGES.lamp = ()=>'亮着';
VIEWS.lamp = ()=>({ title:'Lantern', cap:'一盏铁皮提灯，灯芯还亮着。地窖里一定很黑。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,230) scale(5)">${lampArt(true)}</g>` });
VIEWS.vial = ()=>({ title:'H Vial', cap:'一只空药瓶，瓶底刻着一个 H——哈特维尔（Hartwell），母亲娘家的姓。石屋书架上那只空瓶，也是她留下的。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,220) scale(2.6)">${vialArt()}</g>` });
VIEWS.potion = ()=>({ title:'Sleep Draught', cap:'刻着 H 的小瓶里，装满了暗紫色的安眠药剂。和 1415 年那一夜，母亲倒进麦酒里的一模一样。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,220) scale(2.6)">${vialArt('#6a3a5a')}</g>` });
VIEWS.poppy = ()=>({ title:'Poppy', cap:'一束干罂粟，圆圆的蒴果一摇就沙沙响，里面全是细小的黑籽。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,40) scale(3)">${herbArt('poppy')}</g>` });
VIEWS.valerian = ()=>({ title:'Valerian', cap:'一束干缬草，叶子成对排列，开着细碎的小白花。闻起来有股陈旧的皮革味。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,40) scale(3)">${herbArt('valerian')}</g>` });
VIEWS.seeds = ()=>({ title:'Poppy Seeds', cap:'称好的罂粟籽，和圣铃一样重。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(-100,-60) scale(4)">${TH.seeds()}</g>` });
VIEWS.paste = ()=>({ title:'Valerian Paste', cap:'九片缬草叶捣成的泥。', svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(-100,-60) scale(4)">${TH.paste()}</g>` });
VIEWS.recipe = ()=>({ title:'Recipe',
  cap:'母亲的笔迹：「四勺月露，不可多一滴；罂粟籽与圣铃同重；缬草九叶；火上数到第七声鸦啼。」背面是草药图谱，毛地黄和颠茄旁画着骷髅。',
  svg:`<rect width="600" height="400" fill="#17130f"/>
    <path d="M30,40 Q160,24 300,50 Q440,24 570,40 L570,370 Q440,350 300,376 Q160,350 30,370 Z" fill="#4a2a22" ${ink}/>
    <path d="M42,46 Q160,30 300,56 L300,366 Q160,340 42,358 Z" fill="#ddd3b8" ${ink}/>
    <path d="M558,46 Q440,30 300,56 L300,366 Q440,340 558,358 Z" fill="#d6ccb0" ${ink}/>
    <g font-family="Georgia,serif" font-style="italic" font-size="15" fill="#3b3026">
      <text x="62" y="106">Four spoons of moon-dew,</text><text x="78" y="128">not a drop more;</text>
      <text x="62" y="168">Poppy seed to weigh</text><text x="78" y="190">as the holy bell;</text>
      <text x="62" y="230">Nine leaves of valerian;</text>
      <text x="62" y="270">Upon the fire, count</text><text x="78" y="292">the seventh raven's cry.</text>
      <text x="230" y="336" font-size="22">— I.</text></g>
    ${['poppy','valerian','foxglove','belladonna'].map((h,i)=>{ const x=346+(i%2)*120, y=70+Math.floor(i/2)*150;
      return `<g transform="translate(${x},${y}) scale(.95)">${herbArt(h)}</g>
        <text x="${x}" y="${y+128}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="13" fill="#3b3026">${HERBS[h].la}</text>
        ${HERBS[h].toxic?`<g transform="translate(${x+34},${y+20})" fill="#2b251e"><circle r="9"/><rect x="-5" y="6" width="10" height="6"/><circle cx="-3.5" cy="-1" r="2.4" fill="#d6ccb0"/><circle cx="3.5" cy="-1" r="2.4" fill="#d6ccb0"/></g>`:''}`; }).join('')}`
});
