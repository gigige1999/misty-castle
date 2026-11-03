/* =====================================================================
   第 8 关 · 雾湖鸦塔 —— 几何 / 共享美术 / 背景 / 场景 DOM
   两个子场景：塔底（四童雕像厅）↔ 塔顶（鸦巢 · 祭坛 · 铁笼）
   ===================================================================== */
const b8k = 'stroke="#1a1511" stroke-width="2.4" stroke-linejoin="round"';
const b8s = 'stroke="#1a1511" stroke-width="1.6" stroke-linejoin="round"';
const n8 = v=>(+v).toFixed(1);

/* ---------------- 塔底：四尊石像（按场景从左到右）；era = 年代（0 最早 … 3 最晚） ---------------- */
const ST8 = [
  {x:100, ty:540, sc:1.2, era:2},
  {x:262, ty:506, sc:1.0, era:0},
  {x:566, ty:506, sc:1.0, era:3},
  {x:728, ty:540, sc:1.2, era:1}
];
// 年代 → 孩子（与第 5 关四幅画像一一对应）· 底座橡叶大小 · 该放的物品
const ERA8 = [
  {item:'wheat',   year:1316, leaf:.5,  girl:false, kid:{hair:'boy', body:'boy', cloth:'#5a5040', cape:'#6a5a40'}},
  {item:'bell',    year:1349, leaf:.74, girl:true,  kid:{hair:'braid', hairOpt:{col:'#6a4a30'}, body:'girl', cloth:'#5a4a3c'}},
  {item:'hmirror', year:1382, leaf:.98, girl:false, kid:{hair:'boy', body:'boy', cloth:'#3e4436', cape:'#4a5040'}},
  {item:'deer',    year:1415, leaf:1.24,girl:true,  kid:null}
];
const OFFER8 = ['wheat','bell','hmirror','deer'];
const HELD8 = {wheat:'wheat', bell:'bell', hmirror:'mirror', deer:'deer'};

/* ---------------- 塔顶几何 ---------------- */
const T8 = {
  win:'M42,440 L42,190 Q46,126 120,104 Q194,126 198,190 L198,440 Z',
  raven:{x:430, y:300, k:1.15},
  ledge:{x:298, y:178},
  cage:{x:664, top:150, dome:214, bot:420, r:56},
  chimes:{x0:609, dx:18.5, y:450},
  pages:[[226,604,-16],[304,652,12],[522,642,-8],[606,600,18],[176,664,6],[648,672,-14],[408,628,4]],
  hole:'M8,660 Q20,618 100,614 Q182,618 196,660 Q182,702 100,706 Q20,702 8,660 Z'
};
const NOTES8 = ['A','B','C','D','E','F','G'];
const FREQ8 = [440, 494, 523, 587, 659, 698, 784];
const SONG8 = 'EGEDCDEC';   // 第 6 关音乐盒：母亲的摇篮曲

/* ---------------- 共享小件 ---------------- */
const oakLeaf8 = (x, y, k, fill='#4a463c')=>`<g transform="translate(${n8(x)},${n8(y)}) scale(${n8(k)})">
  <path d="M0,22 L0,16 Q-6,14 -8,8 Q-14,8 -14,2 Q-10,-2 -10,-4 Q-16,-6 -14,-12 Q-8,-12 -7,-16 Q-10,-22 -4,-24 Q-2,-20 0,-27 Q2,-20 4,-24 Q10,-22 7,-16 Q8,-12 14,-12 Q16,-6 10,-4 Q10,-2 14,2 Q14,8 8,8 Q6,14 0,16 Z" fill="${fill}" stroke="#1a1511" stroke-width="${n8(1.4/k)}"/>
  <path d="M0,18 V-22 M0,6 L-8,0 M0,6 L8,0 M0,-6 L-8,-10 M0,-6 L8,-10" stroke="#24201a" stroke-width="${n8(1/k)}" fill="none"/>
  <path d="M-12,-1 Q-14,-6 -12,-10 M-6,-18 Q-3,-23 -1,-22" stroke="#9a9482" stroke-width="${n8(.8/k)}" fill="none" opacity=".6"/></g>`;
function eyeFloor8(cx, cy, rx, ry, op=.5){
  let lash=''; for(let i=0;i<13;i++){ const t=i/12, x=cx-rx*.86+rx*1.72*t, y=cy-ry*(1-Math.pow(2*t-1,2))*.92;
    lash+=`<path d="M${n8(x)},${n8(y)} L${n8(x+(t-.5)*rx*.16)},${n8(y-ry*.34)}"/>`; }
  return `<g opacity="${op}">
    <path d="M${cx-rx},${cy} Q${cx},${cy-ry*2} ${cx+rx},${cy} Q${cx},${cy+ry*2} ${cx-rx},${cy} Z" fill="#3e352a" stroke="#1a1511" stroke-width="2"/>
    <path d="M${cx-rx*.92},${cy} Q${cx},${cy-ry*1.7} ${cx+rx*.92},${cy}" fill="none" stroke="#6a5a44" stroke-width="1.4"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${n8(ry*.95)}" ry="${n8(ry*.86)}" fill="#5a2a22" stroke="#1a1511" stroke-width="1.6"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${n8(ry*.62)}" ry="${n8(ry*.56)}" fill="none" stroke="#7a3a2c" stroke-width="1.2" stroke-dasharray="3 2"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${n8(ry*.36)}" ry="${n8(ry*.32)}" fill="#120e0b"/>
    <ellipse cx="${n8(cx-ry*.14)}" cy="${n8(cy-ry*.14)}" rx="${n8(ry*.1)}" ry="${n8(ry*.08)}" fill="#c8b48a"/>
    <g stroke="#1a1511" stroke-width="1.6" fill="none">${lash}</g></g>`;
}
function bone8(x, t, b, w=4.6, col='#d8cfb4'){
  return `<path d="M${x},${t+3} V${b-3}" stroke="#1a1511" stroke-width="${w+2.2}" stroke-linecap="round"/>
    <path d="M${x},${t+3} V${b-3}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>
    ${[t+2.4, b-2.4].map(y=>`<circle cx="${n8(x-w*.42)}" cy="${n8(y)}" r="${n8(w*.62)}" fill="${col}" stroke="#1a1511" stroke-width=".9"/><circle cx="${n8(x+w*.42)}" cy="${n8(y)}" r="${n8(w*.62)}" fill="${col}" stroke="#1a1511" stroke-width=".9"/>`).join('')}
    <path d="M${n8(x-w*.18)},${t+6} V${b-6}" stroke="#fff8e8" stroke-width="${n8(w*.24)}" opacity=".5"/>`;
}
const wax8 = (x, y, k=1)=>`<g transform="translate(${x},${y}) scale(${k})">
  <path d="M-9,-3 Q-10,-9 -3,-10 Q2,-12 7,-8 Q11,-5 9,1 Q11,6 5,8 Q0,11 -5,8 Q-11,6 -9,-3 Z" fill="#8e1e18" stroke="#1a1511" stroke-width="1"/>
  <path d="M-4,8 q-1,4 0,6 q1.4,-2 1,-6 M6,7 q1,3 0,5" fill="#8e1e18" stroke="#1a1511" stroke-width=".7"/>
  <circle r="5" fill="none" stroke="#5a1210" stroke-width="1.2"/><use href="#sym-raven" x="-4" y="-4" width="8" height="8" style="color:#4a0e0c"/>
  <path d="M-6,-6 q3,-2 6,-1" stroke="#d86a5a" stroke-width="1" fill="none" opacity=".7"/></g>`;

/* ---------------- 巨鸦（局部：脚在原点，喙朝左；高约 200）---------------- */
// st: 'awake' | 'revealed' | 'asleep' | 'sealed'
function raven8(st='awake'){
  const sleep = st==='asleep' || st==='sealed', bald = st!=='awake';
  const body = 'M-50,-176 Q-42,-198 -16,-196 Q10,-192 22,-168 Q34,-150 50,-128 Q76,-92 82,-50 Q88,-14 112,24 L136,58 L116,54 L124,70 L100,58 L102,72 L82,52 Q56,26 26,6 Q4,-4 -22,-10 Q-58,-26 -66,-70 Q-72,-108 -62,-134 Q-58,-146 -62,-156 L-56,-162 Z';
  const wing = 'M-28,-140 Q20,-150 52,-112 Q80,-70 92,-20 Q100,14 120,40 Q86,30 58,8 Q20,-16 -6,-50 Q-30,-90 -28,-140 Z';
  let coverts=''; for(let r=0;r<3;r++) for(let i=0;i<4+r;i++){ const x=-16+i*16+r*6, y=-108+r*20;
    coverts+=`<path d="M${x},${y} q8,7 16,0" />`; }
  const gh = bald ? CH.hair.old({beard:'long'}) : null;
  const ghost = bald ? `<g opacity="${sleep?.3:.5}" filter="url(#chGhost)"><g transform="translate(-30,-166) scale(.95)">${gh.back}${CH.ears()}${CH.face({age:'old', male:true, mood:'stern', eyes: sleep?'closed':'open', hollow:true})}${gh.front}</g></g>` : '';
  const patches = bald ? `<g fill="#4a3e34" opacity=".75"><ellipse cx="-44" cy="-84" rx="10" ry="16"/><ellipse cx="-30" cy="-40" rx="12" ry="9"/><ellipse cx="-56" cy="-120" rx="5" ry="8"/></g>
    <g stroke="#6a5a4a" stroke-width=".8" fill="none" opacity=".8"><path d="M-50,-96 q6,4 4,10 M-36,-74 q5,3 3,9 M-24,-46 q6,2 6,8"/></g>` : '';
  const eye = sleep ? `<path d="M-42,-174 Q-36,-170 -30,-174" stroke="#8a7a6a" stroke-width="1.6" fill="none"/><path d="M-43,-176 Q-36,-180 -29,-176" stroke="#1a1511" stroke-width="1" fill="none"/>`
    : `<circle cx="-36" cy="-175" r="6.4" fill="#2a1a16"/><circle cx="-36" cy="-175" r="5.2" fill="#b23a2e"/><circle cx="-35.4" cy="-175" r="2.2" fill="#1a0806"/>
       <circle cx="-37.6" cy="-177" r="1.2" fill="#fff4e0"/><circle cx="-36" cy="-175" r="9" fill="#ff6a4a" opacity=".16"/>`;
  return `<g transform="rotate(${sleep?7:0})">
    <g stroke="#1a1511" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M-24,-12 L-28,4 M-6,-8 L-8,6" stroke="#2a2420" stroke-width="4.4"/>
      <path d="M-38,7 L-28,4 L-20,9 M-28,4 L-30,10 M-18,8 L-8,6 L0,10 M-8,6 L-9,12" stroke="#2a2420" stroke-width="2.4" fill="none"/>
      <path d="${body}" fill="#141210"/>
      <path d="${body}" fill="url(#t8Sheen)" stroke="none"/>
      ${patches}
      <path d="${wing}" fill="#1c1916"/>
      <path d="${wing}" fill="url(#t8Sheen)" stroke="none" opacity=".7"/>
      <g stroke="#3a3632" stroke-width="1" fill="none">${coverts}</g>
      <path d="M40,-10 Q80,14 116,38 M30,-26 Q74,0 108,26 M18,-44 Q60,-20 96,6 M8,-62 Q46,-40 84,-14" stroke="#34302c" stroke-width="1.2" fill="none"/>
      <path d="M-60,-150 l-7,8 l5,-1 l-5,9 l7,-4 l-3,9 l7,-6 l-1,8" stroke="#2e2a26" stroke-width="1.1" fill="none"/>
      <path d="M-58,-128 q-4,8 -2,16 M-62,-104 q-3,8 -1,16 M-58,-80 q-2,8 1,14" stroke="#2e2a26" stroke-width="1" fill="none"/>
      <path d="M-54,-172 Q-76,-178 -106,-160 Q-80,-161 -58,-156 Z" fill="#2a2622"/>
      <path d="M-58,-156 Q-80,-158 -98,-157 Q-78,-147 -60,-148 Z" fill="#221e1b"/>
      <path d="M-54,-170 Q-64,-173 -72,-169 M-60,-164 Q-80,-166 -100,-160" stroke="#4a4540" stroke-width=".8" fill="none"/>
      <path d="M-14,-190 Q4,-188 16,-172" stroke="#3a3a42" stroke-width="1.4" fill="none" opacity=".8"/>
      ${ghost}
      ${eye}
      ${st==='sealed' ? wax8(-80,-158,1.2) : ''}
    </g></g>`;
}
// 展翅剪影（结局插画用）：中心在原点，翼展约 300
function ravenSpread8(col='#141210'){
  return `<g fill="${col}" stroke="#0a0806" stroke-width="1.6" stroke-linejoin="round">
    <path d="M0,-30 Q-40,-70 -90,-80 Q-130,-86 -160,-60 L-136,-56 L-158,-40 L-128,-40 L-146,-22 L-116,-26 L-126,-8 L-96,-16 L-98,0 L-70,-10 Q-36,-6 -14,10 Z"/>
    <path d="M0,-30 Q40,-70 90,-80 Q130,-86 160,-60 L136,-56 L158,-40 L128,-40 L146,-22 L116,-26 L126,-8 L96,-16 L98,0 L70,-10 Q36,-6 14,10 Z"/>
    <path d="M-16,-34 Q-22,-56 -6,-62 Q8,-64 12,-50 L30,-50 L12,-44 Q18,-20 12,4 L22,40 L6,30 L0,44 L-6,30 L-22,40 L-12,4 Q-20,-14 -16,-34 Z"/>
    <circle cx="2" cy="-54" r="2.6" fill="#b23a2e" stroke="none"/></g>`;
}

/* ---------------- 石像 ---------------- */
function kidOpts8(era, sleepEyes=true){
  const face = {age:'child', mood:'blank', eyes: sleepEyes ? 'closed' : 'open'};
  if(era===3) return CH.preset.margery({len:96, face});
  const k = ERA8[era].kid;
  return {...k, len: k.body==='girl' ? 96 : 100, face:{...face, male:k.body==='boy'}};
}
function statue8(i, item, lit){
  const s = ST8[i], e = ERA8[s.era], f = 1.22*s.sc, hy = s.ty - 104*f, w = 84*s.sc, ph = 62*s.sc;
  const at = e.girl ? [0,41] : [13,50];
  return `<g>
    <ellipse cx="${s.x}" cy="${s.ty+ph+12}" rx="${n8(w*.7)}" ry="${n8(9*s.sc)}" fill="#0c0a08" opacity=".45"/>
    <g ${b8s}>
      <rect x="${n8(s.x-w/2-6)}" y="${n8(s.ty+ph)}" width="${n8(w+12)}" height="${n8(12*s.sc)}" fill="#4a463c"/>
      <rect x="${n8(s.x-w/2)}" y="${n8(s.ty+4)}" width="${n8(w)}" height="${n8(ph-4)}" fill="url(#b8Ped)"/>
      <rect x="${n8(s.x-w/2+6*s.sc)}" y="${n8(s.ty+10*s.sc)}" width="${n8(w-12*s.sc)}" height="${n8(ph-20*s.sc)}" fill="none" stroke="#2e2a24" stroke-width="1"/>
      <rect x="${n8(s.x-w/2-5)}" y="${n8(s.ty-6)}" width="${n8(w+10)}" height="11" fill="#6e6a5c"/>
      <path d="M${n8(s.x-w/2-5)},${n8(s.ty-5)} H${n8(s.x+w/2+5)}" stroke="#a8a290" stroke-width="1" opacity=".6"/>
    </g>
    ${oakLeaf8(s.x, s.ty+ph*.5+2, e.leaf*s.sc*.82)}
    <g filter="url(#b8-stoneF)"><g transform="translate(${s.x},${n8(hy)}) scale(${n8(f)})">${CH.person(kidOpts8(s.era))}</g></g>
    ${item ? `<g transform="translate(${s.x},${n8(hy)}) scale(${n8(f)})">${CH.held[HELD8[item]](...at)}</g>` : ''}
    ${lit ? `<circle cx="${n8(s.x+at[0]*f)}" cy="${n8(hy+at[1]*f)}" r="${n8(24*s.sc)}" fill="url(#b8Glow)"/>` : ''}
  </g>`;
}
// 中央石柱的螺旋踏步：升起前只露出一排暗槽
function stairs8(up){
  let s='';
  for(let k=0;k<10;k++){ const y = 532 - k*48, L = k%2===0;
    if(!up){ s+=`<rect x="${L?368:452}" y="${y}" width="8" height="10" fill="#0c0a08"/>`; continue; }
    s+= L ? `<polygon points="372,${y} 300,${y+8} 300,${y+20} 372,${y+12}" fill="#5a5446" ${b8s}/><path d="M300,${y+8} L372,${y}" stroke="#8a8676" stroke-width="1"/>`
          : `<polygon points="456,${y} 528,${y+8} 528,${y+20} 456,${y+12}" fill="#4a463c" ${b8s}/><path d="M528,${y+8} L456,${y}" stroke="#7a7666" stroke-width="1"/>`;
  }
  return s;
}

/* ---------------- 铁笼 + 艾格尼丝 + 骨铃 ---------------- */
function cage8(o={}){
  const {x:cx, top, dome, bot, r} = T8.cage, door = o.open;
  const xs = [-54,-42,-26,-9,9,26,42,54];
  const bar = bx => `<path d="M${cx+bx},${bot} V${dome} Q${cx+bx*.9},${top+16} ${cx},${top+4}"/>`;
  const agnes = o.agnes===false ? '' : `<g transform="translate(${cx},${top+144}) rotate(${o.asleep?7:0})">${CH.draw('agnes', {len:96, face:{age:'child', mood:'sad', eyes:o.asleep?'closed':'open', gaze:[-.6,.1]}})}</g>`;
  return `<g ${b8s}>
    <path d="M${cx},0 V${top}" stroke="#2a2622" stroke-width="3" stroke-dasharray="6 3"/>
    <circle cx="${cx}" cy="${top}" r="6" fill="none" stroke-width="2.6"/>
    <ellipse cx="${cx}" cy="${bot}" rx="${r+4}" ry="10" fill="#1e1a16"/>
    <g stroke="#2a2420" stroke-width="1.6" fill="none">${[-48,-30,-12,6,24,40].map(b=>`<path d="M${cx+b},${bot-6} V${dome-6}"/>`).join('')}</g>
    ${agnes}
    <g stroke="#15110d" stroke-width="2.6" fill="none">${xs.filter(b=>!door || Math.abs(b)>26).map(bar).join('')}
      <path d="M${cx-r},${dome} Q${cx-r},${top+2} ${cx},${top+2} Q${cx+r},${top+2} ${cx+r},${dome}" stroke-width="3"/>
      <path d="M${cx-r},${dome} Q${cx},${dome+12} ${cx+r},${dome}" stroke-width="3.4"/>
      <path d="M${cx-r},${bot-92} Q${cx},${bot-80} ${cx+r},${bot-92}" stroke-width="2.4"/>
      <path d="M${cx-r-4},${bot} Q${cx},${bot+12} ${cx+r+4},${bot}" stroke-width="3.4"/></g>
    ${door ? `<g stroke="#15110d" stroke-width="2.4" fill="none"><path d="M${cx+26},${bot-6} L${cx+74},${bot-20} L${cx+74},${dome+12} L${cx+26},${dome+16} Z"/><path d="M${cx+42},${bot-11} V${dome+15} M${cx+58},${bot-15} V${dome+13}"/></g>`
      : `<g stroke="#15110d" stroke-width="2.4" fill="none"><path d="M${cx-26},${bot-6} V${dome+16} H${cx+26} V${bot-6}"/></g>
         <rect x="${cx+20}" y="${bot-96}" width="14" height="18" rx="2" fill="#4a463c"/><circle cx="${cx+27}" cy="${bot-87}" r="2.4" fill="#0c0a08" stroke="none"/>`}
    <path d="M${cx-48},${bot+6} L${cx-56},${T8.chimes.y-4} M${cx+48},${bot+6} L${cx+64},${T8.chimes.y-4}" stroke="#2a2622" stroke-width="1.6" stroke-dasharray="3 2"/>
  </g>`;
}
function chimes8(o={}){
  const {x0, dx, y} = T8.chimes;
  return `<g><path d="M${x0-12},${y-4} H${x0+6*dx+12}" stroke="#1a1511" stroke-width="4" stroke-linecap="round"/>
    <path d="M${x0-12},${y-5} H${x0+6*dx+12}" stroke="#5a564c" stroke-width="1.4"/>
    ${NOTES8.map((n,i)=>{ const x = x0+i*dx, len = 64-i*5;
      return `<path d="M${x},${y-4} V${y+4}" stroke="#6a5a40" stroke-width="1"/>${bone8(x, y+4, y+4+len, 4.4, o.hi===i?'#fff2c8':'#d8cfb4')}
        ${o.hi===i?`<circle cx="${x}" cy="${y+4+len/2}" r="16" fill="url(#b8Glow)"/>`:''}`; }).join('')}</g>`;
}

/* ---------------- 散落的书页（缩影：角上小窗里的月亮，位置与原页一致） ---------------- */
function page8(x, y, rot, id){
  const m = MEMORIES[id], t = (m.moon-1)/6, a = Math.PI*(1-t), mx = 27+2.4*Math.cos(a), my = 6.4-3.6*Math.sin(a);
  return `<g transform="translate(${x},${y}) rotate(${rot})">
    <ellipse cx="2" cy="14" rx="22" ry="4" fill="#0c0a08" opacity=".4"/>
    <path d="M-18,-12 L18,-13 Q20,0 19,12 L-17,13 Q-19,0 -18,-12 Z" fill="#d6caa9" stroke="#1a1511" stroke-width="1.2"/>
    <path d="M-13,-4 H8 M-13,1 H12 M-13,6 H4" stroke="#8a7a5c" stroke-width="1"/>
    <path d="M23.6,-2 V-6 Q24,-10 27,-11 Q30,-10 30.4,-6 V-2 Z" fill="#3b4148" stroke="#2b251e" stroke-width=".6" transform="translate(-10,0)"/>
    <circle cx="${n8(mx-10)}" cy="${n8(my-4)}" r=".9" fill="#e8e4d4"/>
    <path d="M18,-13 L13,-8 L18,-7" fill="#bfb393" stroke="#1a1511" stroke-width=".8"/></g>`;
}

/* ---------------- 圣杯（场景内小图） ---------------- */
function cup8(x, y, k, fill){
  return `<g transform="translate(${x},${y}) scale(${k}) translate(-49,-92)">${ART.chalice(fill!=='empty')}
    ${fill==='drug' ? `<ellipse cx="49" cy="23" rx="17" ry="3.1" fill="#7a3a7a" opacity=".75"/><path d="M40,22.6 q5,-1.4 10,0" stroke="#d8a8d8" stroke-width=".9" fill="none"/>` : ''}</g>`;
}

/* ---------------- 背景：塔底 ---------------- */
function wallCourses8(ys, eye=330, k=.6){
  let s=''; ys.forEach((ye,i)=>{ const yc = eye+(ye-eye)*k; s+=`<path d="M0,${ye} Q414,${n8(2*yc-ye)} 828,${ye}"/>`;
    const nxt = ys[i+1]; if(nxt==null) return;
    for(let j=-5;j<=5;j++){ const th=(j+(i%2?.5:0))*.27, x=414+430*Math.sin(th); if(x<4||x>824) continue;
      const y1 = ye + (eye+(ye-eye)*k-ye)*(1-Math.pow((x-414)/414,2)), y2 = nxt + (eye+(nxt-eye)*k-nxt)*(1-Math.pow((x-414)/414,2));
      s+=`<path d="M${n8(x)},${n8(y1)} L${n8(x)},${n8(y2)}"/>`; } });
  return s;
}
function b8Background(){
  return `<defs>${defs7('b8','#55503f','#45412f',113)}
    <linearGradient id="b8Cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e1a15"/><stop offset=".22" stop-color="#3e3a30"/><stop offset=".5" stop-color="#5a5546"/><stop offset=".78" stop-color="#3e3a30"/><stop offset="1" stop-color="#1e1a15"/></linearGradient>
    <linearGradient id="b8Pil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2e2a24"/><stop offset=".35" stop-color="#7a7464"/><stop offset=".6" stop-color="#5e5a4c"/><stop offset="1" stop-color="#26221c"/></linearGradient>
    <linearGradient id="b8Flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e2820"/><stop offset="1" stop-color="#4a4034"/></linearGradient>
    <linearGradient id="b8Fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a9496"/><stop offset="1" stop-color="#c2c8c4"/></linearGradient>
  </defs>
  <rect width="828" height="709" fill="#16120e"/>
  <g filter="url(#b8-rough)" ${b8s}>
    <rect x="0" y="0" width="828" height="600" fill="url(#b8Cyl)" stroke="none"/>
    <g stroke="#2a261e" stroke-width="1.1" fill="none">${wallCourses8([40,96,152,208,264,320,376,432,488,544])}</g>
    <path d="M0,0 H828 V30 Q414,80 0,30 Z" fill="#14100c"/>
    <g stroke="#0c0a08" stroke-width="5">${[...Array(9)].map((_,i)=>`<path d="M${60+i*88},${n8(30+ (1-Math.pow((60+i*88-414)/414,2))*25)} L414,-60"/>`).join('')}</g>
    <path d="M0,600 Q414,452 828,600 L828,709 L0,709 Z" fill="url(#b8Flr)"/>
    <g stroke="#221c16" stroke-width="1.2" fill="none">
      <ellipse cx="414" cy="610" rx="150" ry="38"/><ellipse cx="414" cy="622" rx="290" ry="70"/><ellipse cx="414" cy="640" rx="430" ry="104"/>
      ${[...Array(12)].map((_,i)=>{ const a=i*Math.PI/6; return `<path d="M${n8(414+150*Math.cos(a))},${n8(610+38*Math.sin(a))} L${n8(414+430*Math.cos(a))},${n8(640+104*Math.sin(a))}"/>`; }).join('')}</g>
    ${eyeFloor8(414, 618, 190, 30, .55)}
    <path d="M158,500 L158,360 Q162,312 185,300 Q208,312 212,360 L212,500 Z" fill="#4e4a3e"/>
    <path d="M164,500 L164,362 Q168,320 185,310 Q202,320 206,362 L206,500 Z" fill="url(#b8Fog)"/>
    <path d="M164,440 Q185,430 206,442 V500 H164 Z" fill="#a8b0ae" opacity=".7" stroke="none"/>
    <path d="M185,310 V500" stroke="#3a362e" stroke-width="1" opacity=".6"/>
    ${[0,1].map(i=>`<path d="M${[628,22][i]},${[332,250][i]} L${[628,22][i]},${[236,170][i]} Q${[636,30][i]},${[214,150][i]} ${[644,38][i]},${[236,170][i]} L${[644,38][i]},${[332,250][i]} Z" fill="url(#b8Fog)"/>
      <path d="M${[622,16][i]},${[338,256][i]} H${[650,44][i]}" stroke-width="3"/>`).join('')}
    <rect x="370" y="20" width="88" height="560" fill="url(#b8Pil)"/>
    <g stroke="#2a261e" stroke-width="1" fill="none">${[70,130,190,250,370,430,490].map(y=>`<path d="M370,${y} Q414,${y+8} 458,${y}"/>`).join('')}</g>
    <rect x="364" y="300" width="100" height="40" fill="#5e5a4c"/>
    <path d="M374,314 h22 m6,0 h16 m6,0 h26 M378,326 h30 m6,0 h12 m6,0 h20" stroke="#24201a" stroke-width="1.6" fill="none"/>
    <path d="M364,300 Q414,308 464,300 M364,340 Q414,348 464,340" stroke="#a8a290" stroke-width="1" fill="none" opacity=".5"/>
    <polygon points="354,580 474,580 488,604 340,604" fill="#4a463c"/>
    <ellipse cx="414" cy="12" rx="40" ry="12" fill="#3a1410" stroke="none"/>
    ${[40,788].map(x=>`<path d="M${x},322 l-10,0 l4,-12 h12 l4,12 Z" fill="#2a2420"/><path d="M${x},310 v-8" stroke-width="3"/>`).join('')}
  </g>
  <rect width="828" height="709" filter="url(#b8-stain)" opacity=".4" pointer-events="none"/>
  <ellipse cx="414" cy="10" rx="70" ry="40" fill="#c8402e" opacity=".14"/>
  ${[40,788].map(x=>`<circle cx="${x}" cy="290" r="110" fill="url(#b8-warm)"/><path class="flame" d="M${x},280 q6,9 3,15 q-3,4 -6,0 q-3,-6 3,-15 Z" fill="#ffd27a"/>`).join('')}`;
}

/* ---------------- 背景：塔顶 ---------------- */
function t8Background(){
  const R = T8.raven;
  let twigs=''; for(let i=0;i<26;i++){ const x=356+((i*37)%170), y=290+((i*13)%26), a=((i*29)%60)-30, l=26+((i*11)%22);
    twigs+=`<path d="M${x},${y} l${n8(l*Math.cos(a*Math.PI/180))},${n8(l*Math.sin(a*Math.PI/180))}"/>`; }
  return `<defs>${defs7('t8','#4e4a3c','#3e3a2e',131)}
    <linearGradient id="t8Cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1612"/><stop offset=".25" stop-color="#3a362c"/><stop offset=".55" stop-color="#4e4a3c"/><stop offset=".8" stop-color="#36322a"/><stop offset="1" stop-color="#1a1612"/></linearGradient>
    <linearGradient id="t8Stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a362e"/><stop offset=".4" stop-color="#7a7464"/><stop offset=".7" stop-color="#5e5a4c"/><stop offset="1" stop-color="#2e2a24"/></linearGradient>
    <linearGradient id="t8Flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a241c"/><stop offset="1" stop-color="#443a2e"/></linearGradient>
    <clipPath id="t8-win"><path d="${T8.win}"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="#14100c"/>
  <g filter="url(#t8-rough)" ${b8s}>
    <rect x="0" y="0" width="828" height="600" fill="url(#t8Cyl)" stroke="none"/>
    <g stroke="#26221a" stroke-width="1.1" fill="none">${wallCourses8([60,114,168,222,276,330,384,438,492,546], 300)}</g>
    <path d="M0,0 H828 V48 Q414,96 0,48 Z" fill="#100c09"/>
    <g stroke="#080604" stroke-width="6">${[...Array(10)].map((_,i)=>`<path d="M${20+i*88},${n8(48+(1-Math.pow((20+i*88-414)/414,2))*24)} L414,-90"/>`).join('')}</g>
    <path d="M0,596 Q414,466 828,596 L828,709 L0,709 Z" fill="url(#t8Flr)"/>
    <g stroke="#1e1812" stroke-width="1.2" fill="none"><ellipse cx="414" cy="620" rx="320" ry="76"/><ellipse cx="414" cy="640" rx="440" ry="110"/></g>
    ${eyeFloor8(414, 622, 260, 34, .5)}
    <path d="M28,452 L28,186 Q34,112 120,88 Q206,112 212,186 L212,452 Z" fill="#4a463a"/>
    <path d="M22,440 H218 L222,456 H18 Z" fill="#5e5a4c"/>
    <path d="${T8.hole}" fill="#0a0806"/>
    <g stroke="#2a2218" stroke-width="2.4" fill="none"><path d="M30,650 Q100,630 170,648 M44,672 Q100,656 158,670 M66,690 Q102,680 138,690"/></g>
    <path d="M236,${R.y+14} Q300,${R.y-2} 360,${R.y+2} Q430,${R.y+8} 500,${R.y-2} Q560,${R.y-10} 600,${R.y}" stroke="#15110d" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M236,${R.y+14} Q300,${R.y-2} 360,${R.y+2} Q430,${R.y+8} 500,${R.y-2} Q560,${R.y-10} 600,${R.y}" stroke="#3a2e22" stroke-width="11" fill="none" stroke-linecap="round"/>
    <path d="M250,${R.y+6} Q320,${R.y-6} 380,${R.y-2} M450,${R.y+1} Q520,${R.y-10} 590,${R.y-6}" stroke="#5a4a36" stroke-width="2" fill="none"/>
    <path d="M236,${R.y+14} L206,${R.y-4} M600,${R.y} L630,${R.y-18}" stroke="#2a2622" stroke-width="7"/>
    <g stroke="#2a2018" stroke-width="2.2" fill="none">${twigs}</g>
    <path d="M${T8.ledge.x-40},${T8.ledge.y} H${T8.ledge.x+40} L${T8.ledge.x+34},${T8.ledge.y+14} Q${T8.ledge.x},${T8.ledge.y+26} ${T8.ledge.x-34},${T8.ledge.y+14} Z" fill="url(#t8Stone)"/>
    <path d="M${T8.ledge.x-40},${T8.ledge.y+1} H${T8.ledge.x+40}" stroke="#a8a290" stroke-width="1" opacity=".6"/>
    <path d="M296,452 L532,452 L540,468 L288,468 Z" fill="#7a7464"/>
    <path d="M306,468 L522,468 L512,566 L316,566 Z" fill="url(#t8Stone)"/>
    <path d="M290,566 L538,566 L548,582 L280,582 Z" fill="#4a463c"/>
    ${eyeFloor8(414, 516, 62, 14, .9)}
    <text x="414" y="552" text-anchor="middle" font-family="Georgia,serif" font-size="13" letter-spacing="6" fill="#24201a" stroke="none">SITIO</text>
    ${[318,510].map(x=>`<rect x="${x-6}" y="414" width="12" height="38" fill="#e3dac0"/><path d="M${x-6},420 q-2,8 0,14 M${x+6},424 q2,6 0,10" stroke="#c8bea4" stroke-width="2" fill="none"/><path d="M${x},414 v-5" stroke-width="1.2"/>`).join('')}
    <g stroke="#2a2420" stroke-width="1" fill="#cfc6ae">
      <path d="M200,566 l26,-6 M198,562 l4,8 M224,556 l4,8"/><path d="M640,598 l22,8 M638,602 l6,-7 M660,602 l4,8"/></g>
    ${[[250,560,-30],[600,560,24],[480,600,-8]].map(([x,y,a])=>`<g transform="translate(${x},${y}) rotate(${a})"><path d="M0,0 Q4,-12 10,-22" stroke="#0e0c0a" stroke-width="2" fill="none"/><path d="M2,-6 l-4,-2 M4,-12 l-4,-3 M6,-17 l-3,-3 M3,-7 l4,-1 M5,-13 l4,-2" stroke="#1d1915" stroke-width="1.2"/></g>`).join('')}
  </g>
  <rect width="828" height="709" filter="url(#t8-stain)" opacity=".42" pointer-events="none"/>
  <g clip-path="url(#t8-win)"><g id="t8Sky"></g>
    <g class="zrain" stroke="#b8c8cc" stroke-width="1" opacity=".55">${[...Array(18)].map((_,i)=>`<path d="M${40+i*9.6},${80+((i*53)%300)} l-5,22"/><path d="M${44+i*9.6},${260+((i*71)%200)} l-5,22"/>`).join('')}</g></g>
  <g ${b8s}><path d="M120,104 V440 M42,272 H198 M42,356 H198" stroke-width="3" fill="none"/>
    <path d="M42,190 L198,440 M198,190 L42,440" stroke="#2a2620" stroke-width=".8" opacity=".5"/>
    <path d="${T8.win}" fill="none" stroke-width="2.6"/></g>
  <ellipse cx="120" cy="445" rx="54" ry="4" fill="#55646b" opacity=".8"/>
  ${[318,510].map(x=>`<circle cx="${x}" cy="404" r="70" fill="url(#t8-warm)"/><path class="flame" d="M${x},396 q5,8 3,13 q-3,3 -6,0 q-2,-5 3,-13 Z" fill="#ffd27a"/>`).join('')}`;
}
// 塔窗外的天空：月亮随 S8.moon（0 → 1）从高处沉到窗台以下，天色渐亮
function sky8(t){
  t = Math.max(0, Math.min(1, t));
  const mx = 156-74*t, my = 150+322*Math.pow(t,1.15);
  return `<rect x="40" y="100" width="160" height="350" fill="#1e2632"/>
    <rect x="40" y="100" width="160" height="350" fill="url(#t8Dawn)" opacity="${n8(Math.pow(t,1.6)*.95)}"/>
    ${[[70,140],[170,170],[96,210],[150,250]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="1" fill="#e8e4d4" opacity="${n8((1-t)*(.4+i*.12))}"/>`).join('')}
    <circle cx="${n8(mx)}" cy="${n8(my)}" r="34" fill="#e8e4d4" opacity=".08"/>
    <circle cx="${n8(mx)}" cy="${n8(my)}" r="15" fill="#e8e4d4"/><circle cx="${n8(mx-4)}" cy="${n8(my-3)}" r="3" fill="#cfc9b6"/><circle cx="${n8(mx+5)}" cy="${n8(my+4)}" r="2" fill="#cfc9b6"/>
    <path d="M40,410 Q90,396 120,404 Q160,394 200,402 V450 H40 Z" fill="#2a3036"/>
    <path d="M150,404 V372 h6 v-10 l4,-8 l4,8 v10 h6 V404 Z" fill="#1a1e22"/>`;
}

/* ---------------- 场景 DOM ---------------- */
const arrow8 = (obj, x, dir, id)=>`<g class="hs-arrow" data-obj="${obj}" ${id?`id="${id}"`:''}><rect x="${x}" y="640" width="48" height="48" rx="6" fill="#2b251e" opacity=".55"/>
  <path d="${dir>0?`M${x+16},652 L${x+34},664 L${x+16},676`:`M${x+32},652 L${x+14},664 L${x+32},676`}" stroke="#e6dfcc" stroke-width="3" fill="none"/></g>`;
document.getElementById('l7').insertAdjacentHTML('afterend', `
<div id="l8" class="lvroot hidden" data-level="L8">
  <svg id="b8Bg" viewBox="0 0 828 709" pointer-events="none">${b8Background()}</svg>
  <svg id="t8Bg" viewBox="0 0 828 709" pointer-events="none" style="display:none">${t8Background()}</svg>
  <svg id="l8Obj" viewBox="0 0 828 709">
    <defs>
      <filter id="b8-stoneF" x="-30%" y="-20%" width="160%" height="140%" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0.22 0.46 0.1 0 0.13  0.22 0.46 0.1 0 0.12  0.22 0.46 0.1 0 0.1  0 0 0 1 0" result="g"/>
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" result="t"/>
        <feColorMatrix in="t" type="matrix" values="0 0 0 0 .14  0 0 0 0 .13  0 0 0 0 .11  0 0 0 -1.6 1.05" result="sp"/>
        <feComposite in="sp" in2="SourceAlpha" operator="in" result="sp2"/>
        <feComposite in="sp2" in2="g" operator="over"/></filter>
      <linearGradient id="b8Ped" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a362e"/><stop offset=".4" stop-color="#6e6a5a"/><stop offset="1" stop-color="#2e2a24"/></linearGradient>
      <radialGradient id="b8Glow"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></radialGradient>
      <linearGradient id="t8Sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a5a7a" stop-opacity=".32"/><stop offset=".4" stop-color="#2a2a3a" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
      <linearGradient id="t8Dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5260"/><stop offset=".6" stop-color="#9a8a78"/><stop offset="1" stop-color="#d8b08a"/></linearGradient>
      <radialGradient id="l8-vig" cx="50%" cy="46%" r="72%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
    </defs>
    <g id="l8Dyn" pointer-events="none"></g>
    <g id="b8Hot">
      ${ST8.map((s,i)=>`<rect class="hs" data-obj="st${i}" x="${n8(s.x-46*s.sc)}" y="${n8(s.ty-135*s.sc)}" width="${n8(92*s.sc)}" height="${n8(210*s.sc)}"/>`).join('')}
      <rect class="hs" data-obj="pillar" x="364" y="20" width="100" height="560"/>
      <path class="hs" data-obj="bdoor" d="M158,500 L158,360 Q162,312 185,300 Q208,312 212,360 L212,500 Z"/>
      <rect class="hs" data-obj="bwin" x="620" y="210" width="34" height="130"/>
      <rect class="hs" data-obj="beye" x="240" y="600" width="350" height="50"/>
      ${arrow8('upstairs', 772, 1, 'b8Up')}
      ${arrow8('leave8', 8, -1, 'b8Leave')}
    </g>
    <g id="t8Hot" style="display:none">
      <path class="hs" data-obj="twin" d="${T8.win}"/>
      <rect class="hs" data-obj="raven" x="250" y="60" width="350" height="250"/>
      <rect class="hs" data-obj="altar" x="288" y="410" width="252" height="172"/>
      <rect class="hs" data-obj="cage" x="598" y="140" width="134" height="400"/>
      ${T8.pages.map(([x,y],i)=>`<rect class="hs" data-obj="pg${i}" id="t8pg${i}" x="${x-24}" y="${y-20}" width="48" height="40" style="display:none"/>`).join('')}
      <path class="hs" data-obj="downstairs" d="${T8.hole}"/>
      ${arrow8('downstairs', 8, -1)}
    </g>
  </svg>
</div>`);
document.head.insertAdjacentHTML('beforeend', `<style>
  .t8swoop{transform-box:view-box;transform-origin:430px 300px;animation:t8swoop 2.4s ease-in-out}
  @keyframes t8swoop{0%{transform:none}30%{transform:translate(-40px,260px) scale(1.25) rotate(-12deg)}55%{transform:translate(40px,240px) scale(1.2) rotate(8deg)}100%{transform:none}}
  .t8shiver{transform-box:fill-box;transform-origin:50% 100%;animation:t8shiver .18s linear 8 alternate}
  @keyframes t8shiver{from{transform:translateX(-2px)}to{transform:translateX(2px)}}
  .t8breathe{transform-box:fill-box;transform-origin:50% 100%;animation:t8breathe 3.6s ease-in-out infinite alternate}
  @keyframes t8breathe{from{transform:scale(1,1)}to{transform:scale(1.012,.988)}}
  .t8sway{transform-box:view-box;transform-origin:664px 0;animation:t8sway 4s ease-in-out infinite alternate}
  @keyframes t8sway{from{transform:rotate(-.8deg)}to{transform:rotate(.8deg)}}
  .t8fall{animation:t8fall 3s ease-in forwards}
  @keyframes t8fall{from{transform:translate(0,0) rotate(0);opacity:1}to{transform:translate(-30px,260px) rotate(160deg);opacity:0}}
  .b8rise{animation:b8rise 2.6s ease-out}
  @keyframes b8rise{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
</style>`);
