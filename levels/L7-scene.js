/* =====================================================================
   第 7 关 · 书房与钟楼 —— 几何 / 共享道具美术
   两个子场景：书房（下）/ 钟楼机芯室（上），书房右侧楼梯 ↔ 钟楼左前方螺旋梯
   ===================================================================== */
const s7k = 'stroke="#1a1511" stroke-width="2.4" stroke-linejoin="round"';
const s7s = 'stroke="#1a1511" stroke-width="1.6" stroke-linejoin="round"';

const ST7 = {
  cage:{x:585, top:170, bot:262},
  chest:{x0:604, x1:690, y0:474, y1:534, chainX:647},
  door:'M500,520 L500,410 Q503,380 530,368 Q557,380 560,410 L560,520 Z',
  panel:'M18,594 L18,404 Q30,372 62,366 L76,370 L76,556 Z',
  stairs:''
};
/* 书房右侧楼梯：靠右墙、从画面外近处向里爬升，穿过天花板的楼梯口通往钟楼。
   一点透视：消失点 (414,330)，屏幕 = VP + (X,Y)/z；右墙 X=284，地面 Y=190，天花板 Y=-212 */
const stairs7 = (()=>{
  const VX=414, VY=330, Xi=214, Xw=284, FL=190, CE=-212, N=12, z0=.54, zt=.84;
  const h=(FL-CE)/N, dz=(zt-z0)/N, k=h/dz;
  const P=(X,Y,z)=>`${(VX+X/z).toFixed(1)},${(VY+Y/z).toFixed(1)}`;
  const Yc=z=>FL-k*(z-z0);                       // 内角线（踏步与踢面交线）
  const Yl=z=>Math.min(FL, Yc(z)+30);            // 梯梁下沿
  const zz=i=>z0+i*dz, Yb=i=>FL-h*i, Yt=i=>FL-h*(i+1);
  const zh0=.68, zh1=zt;                         // 天花板楼梯口
  let a='';
  // 楼梯口（天花板开洞）+ 上层透下的微光
  a+=`<polygon points="${P(Xi,CE,zh1)} ${P(Xw,CE,zh1)} ${P(Xw,CE,zh0)} ${P(Xi,CE,zh0)}" fill="#120e0b"/>`;
  a+=`<polygon points="${P(Xi+8,CE,zh1)} ${P(Xw,CE,zh1)} ${P(Xw,CE,zh0+.04)} ${P(Xi+8,CE,zh0+.04)}" fill="#ffc56e" opacity=".07" stroke="none"/>`;
  a+=`<path d="M${P(Xi,CE,zh0)} L${P(Xw,CE,zh0)}" stroke="#4a3a2a" stroke-width="4"/>`;
  // 地面阴影
  a+=`<polygon points="${P(Xi-6,FL,z0)} ${P(Xw,FL,z0)} ${P(Xw,FL,.8)} ${P(Xi+10,FL,.8)}" fill="#120e0b" opacity=".35" stroke="none"/>`;
  // 贴墙梯梁
  let wt=[], wb=[]; for(let z=.6; z<=zt+1e-6; z+=.02){ wt.push(P(Xw,Yc(z)-h-12,z)); wb.unshift(P(Xw,Yc(z)+30,z)); }
  a+=`<polygon points="${wt.concat(wb).join(' ')}" fill="#2e241b"/>`;
  // 支撑立柱
  [.64,.74].forEach(z=>{ a+=`<polygon points="${P(Xi+4,Yl(z),z)} ${P(Xi+18,Yl(z),z)} ${P(Xi+18,FL,z)} ${P(Xi+4,FL,z)}" fill="#2a2018"/>`; });
  // 踏步：由远及近
  for(let i=N-1;i>=0;i--){
    const za=zz(i), zb=zz(i+1);
    if(Yt(i)>0) a+=`<polygon points="${P(Xi,Yt(i),za)} ${P(Xw,Yt(i),za)} ${P(Xw,Yt(i),zb)} ${P(Xi,Yt(i),zb)}" fill="#5e4c38"/>`;
    a+=`<polygon points="${P(Xi,Yb(i),za)} ${P(Xw,Yb(i),za)} ${P(Xw,Yt(i),za)} ${P(Xi,Yt(i),za)}" fill="${i%2?'#3c3024':'#41352a'}"/>`;
    a+=`<path d="M${P(Xi,Yt(i),za)} L${P(Xw,Yt(i),za)}" stroke="#7a6448" stroke-width="1.4" opacity=".8"/>`;
  }
  // 内侧锯齿梯梁（侧面）
  let saw=[P(Xi,FL,z0)]; for(let i=0;i<N;i++){ saw.push(P(Xi,Yt(i),zz(i)), P(Xi,Yt(i),zz(i+1))); }
  let low=[]; for(let z=zt; z>=z0-1e-6; z-=.015) low.push(P(Xi,Yl(z),z));
  a+=`<polygon points="${saw.concat(low).join(' ')}" fill="#4a3c2e"/>`;
  let grain=''; [10,20].forEach(o=>{ grain+=`M${P(Xi,Yc(z0+.05)+o,z0+.05)} L${P(Xi,Yc(zt-.02)+o,zt-.02)} `; });
  a+=`<path d="${grain}" stroke="#3a2e22" stroke-width="1.2" fill="none"/>`;
  // 扶手 + 栏杆（扶手止于楼梯口）
  const Xr=Xi+6, R=z=>Yc(z)-h-96, zr0=z0+.01, zr1=z0+(FL-h-96-CE)/k;
  for(let i=0;i<N;i++){ const z=zz(i)+dz*.5; if(z>zr1) break;
    a+=`<path d="M${P(Xr,Yt(i),z)} L${P(Xr,R(z),z)}" stroke="#2a2018" stroke-width="${i%3?2:4}"/>`; }
  a+=`<path d="M${P(Xr,Yt(0),zr0)} L${P(Xr,R(zr0)-10,zr0)}" stroke="#2a2018" stroke-width="7"/>`;
  a+=`<path d="M${P(Xr,R(zr0),zr0)} L${P(Xr,R(zr1),zr1)}" stroke="#3e3024" stroke-width="6" stroke-linecap="round"/>`;
  a+=`<path d="M${P(Xr,R(zr0)-2,zr0)} L${P(Xr,R(zr1)-2,zr1)}" stroke="#6a5440" stroke-width="1.4"/>`;
  // 热区：梯梁下沿 + 楼梯口 + 右侧画框
  let hot=[]; for(let z=z0; z<=zt+1e-6; z+=.03) hot.push(P(Xi-4,Yl(z),z));
  hot.push(P(Xi-4,CE,zt), P(Xw,CE,zh0), '836,0', '836,709', `${(VX+(Xi-4)/z0).toFixed(1)},709`);
  return {art:a, hot:'M'+hot.join(' L')+' Z'};
})();
ST7.stairs = stairs7.hot;
const TW7 = {
  dial:{x:372, y:214, r:46}, moon:{x:372, y:302, r:24},
  bell:{x:614, top:130, lip:300},
  axleY:452, axles:[{x:548, r:40, t:16}, {x:612, r:24, t:12}, {x:672, r:36, t:14}],
  pulley:{x:470, y:70, r:36}, wX:470, wTop:270, wH:110,
  lever:{x:438, y:470},
  stairs:'M24,566 Q140,524 270,566 Q302,616 252,680 Q150,712 36,684 Q-6,622 24,566 Z',
  win:'M762,438 L762,252 Q766,214 790,204 Q812,218 816,256 L816,458 Z'
};

function gothicWin7(pre, n, x0, x1, y0, y1){
  const cx=(x0+x1)/2, id=`${pre}-w${n}`, d=`M${x0},${y1} L${x0},${y0+30} Q${x0+2},${y0+6} ${cx},${y0-6} Q${x1-2},${y0+6} ${x1},${y0+30} L${x1},${y1} Z`;
  return `<path d="M${x0-8},${y1+6} L${x0-8},${y0+26} Q${x0-6},${y0-4} ${cx},${y0-18} Q${x1+6},${y0-4} ${x1+8},${y0+26} L${x1+8},${y1+6} Z" fill="#5e594c"/>
    <defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="url(#${pre}-sky)"/>
    <g clip-path="url(#${id})" stroke="none">
      <path d="M${x0},${y1-50} L${x0+8},${y1-50} L${x0+8},${y1-80} L${x0+14},${y1-96} L${x0+20},${y1-80} L${x0+20},${y1-62} L${x0+30},${y1-62} L${x0+30},${y1-110} L${x0+36},${y1-130} L${x0+42},${y1-110} L${x1},${y1-70} L${x1},${y1} L${x0},${y1} Z" fill="#6c767c" opacity=".75"/>
      <rect x="${x0}" y="${y1-30}" width="${x1-x0}" height="30" fill="#58646c"/><rect x="${x0}" y="${y1-24}" width="${x1-x0}" height="4" fill="#c2c8c6" opacity=".22"/></g>
    <path d="M${cx},${y0-6} V${y1} M${x0},${(y0+y1)/2} H${x1}" stroke="#1a1511" stroke-width="2.4" fill="none"/>
    <rect x="${x0-10}" y="${y1+4}" width="${x1-x0+20}" height="7" fill="#6a6555"/>`;
}
function room7(o){
  const xTop = x=>414+(x-414)*1.5566, xBot = x=>414+(x-414)*1.9947;
  let ceil=''; for(let x=150;x<=680;x+=40) ceil+=`<path d="M${x},118 L${xTop(x).toFixed(1)},0"/>`;
  const beam = x=>`<polygon points="${x-13},118 ${x+13},118 ${xTop(x+13).toFixed(1)},0 ${xTop(x-13).toFixed(1)},0" fill="#2a2018"/>`;
  let floor=''; for(let x=130;x<=698;x+=44) floor+=`<path d="M${x},520 L${xBot(x).toFixed(1)},709"/>`;
  [538,562,594,634,684].forEach(y=> floor+=`<path d="M0,${y} H828"/>`);
  let back=''; [190,262,334,406,478].forEach((y,i)=>{ back+=`<path d="M130,${y} H698"/>`; for(let x=130+(i%2?60:20); x<698; x+=120) back+=`<path d="M${x},${y} V${y+72}"/>`; });
  let lw='', rw=''; [180,260,340,420].forEach(hy=>{ lw+=`<path d="M${q6([LW6(0,hy),LW6(130,hy)])}"/>`; rw+=`<path d="M${q6([RW6(698,hy),RW6(828,hy)])}"/>`; });
  return `<polygon points="0,0 828,0 828,21 698,118 130,118 0,21" fill="#2a2119"/>
    <g stroke="#1e1812" stroke-width="1.2" fill="none">${ceil}</g>${beam(250)}${beam(578)}
    <rect x="130" y="112" width="568" height="10" fill="#2e241b"/>
    <rect x="130" y="118" width="568" height="402" fill="url(#${o.id}-bw)"/>
    <g stroke="${o.joint}" stroke-width="1" fill="none">${back}</g>
    <polygon points="0,21 130,118 130,520 0,607" fill="${o.lw}"/><g stroke="${o.joint}" stroke-width="1" fill="none">${lw}</g>
    <polygon points="828,21 698,118 698,520 828,607" fill="${o.rw}"/><g stroke="${o.joint}" stroke-width="1" fill="none">${rw}</g>
    <polygon points="0,607 130,520 698,520 828,607 828,709 0,709" fill="url(#${o.id}-floor)"/>
    <g stroke="#241c16" stroke-width="1.2" fill="none">${floor}</g>
    <path d="M130,520 H698" stroke="#1a1511" stroke-width="2.4"/>`;
}
function defs7(id, bw0, bw1, seed){
  return `<filter id="${id}-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="${seed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="nb"/><feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="1" seed="7" result="nc"/><feDisplacementMap in="nb" in2="nc" scale="1" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="${seed+7}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0 0.13  1.9 0 0 0 -0.8"/></filter>
    <linearGradient id="${id}-bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bw0}"/><stop offset="1" stop-color="${bw1}"/></linearGradient>
    <linearGradient id="${id}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#352b22"/><stop offset="1" stop-color="#46392d"/></linearGradient>
    <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3440"/><stop offset=".7" stop-color="#5a666e"/><stop offset="1" stop-color="#7a8488"/></linearGradient>
    <radialGradient id="${id}-warm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>`;
}

/* ---------------- 道具 ---------------- */
function cageArt7(o={}){
  const {x, top, bot} = ST7.cage, w=30;
  let bars=''; for(let i=-3;i<=3;i++) bars+=`<path d="M${x+i*w/3},${bot} V${top+26-(3-Math.abs(i))*4}"/>`;
  return `<g ${s7s}>
    <rect x="514" y="140" width="10" height="34" fill="#2a2420"/><path d="M520,150 H${x+6}" stroke-width="3.4"/><path d="M520,168 Q540,150 560,150" stroke-width="2.4" fill="none"/>
    <path d="M${x},150 V${top}" stroke-width="1.6"/>
    <g stroke-width="1.6" fill="none">${bars}<path d="M${x-w},${top+26} Q${x},${top-12} ${x+w},${top+26}" stroke-width="2.4"/><path d="M${x-w},${top+58} H${x+w}"/></g>
    <ellipse cx="${x}" cy="${bot}" rx="${w+4}" ry="5" fill="#2a2420"/>
    <path d="M${x-20},${bot-30} H${x+20}" stroke="#3a2e22" stroke-width="3"/>
    ${o.ring ? `<circle cx="${x}" cy="${bot-34}" r="4.2" fill="none" stroke="#d8b860" stroke-width="2"/>` : ''}
    <rect x="${x-15}" y="${bot+4}" width="30" height="11" rx="2" fill="#6a5a40"/>
    ${[0,1,2,3].map(i=>`<rect x="${x-13+i*7}" y="${bot+6}" width="5" height="7" fill="#2a2420" stroke="none"/>`).join('')}</g>`;
}
function chestArt7(open){
  const {x0,x1,y0,y1,chainX} = ST7.chest, cx=(x0+x1)/2;
  return `<g ${s7s}>
    <rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="#2e2a26"/>
    ${[x0+12, cx, x1-12].map(x=>`<path d="M${x},${y0} V${y1}" stroke="#15110d" stroke-width="4"/>`).join('')}
    ${open ? `<polygon points="${x0},${y0} ${x1},${y0} ${x1-6},${y0-34} ${x0+6},${y0-34}" fill="#3a3430"/><rect x="${x0+4}" y="${y0-2}" width="${x1-x0-8}" height="6" fill="#0c0a08"/>`
           : `<path d="M${x0},${y0} Q${cx},${y0-24} ${x1},${y0} Z" fill="#3a3430"/>`}
    <circle cx="${chainX}" cy="${open ? y0-38 : y0-14}" r="4" fill="none" stroke-width="2"/>
    <path d="M${chainX},${open ? y0-42 : y0-18} L${chainX},118" stroke-width="2.6" stroke-dasharray="5 2" fill="none"/>
    <path d="M${x0},${y1} H${x1}" stroke="#15110d" stroke-width="4"/></g>`;
}
// 阿尔德里克的人形画像（局部 100×130，红眼 #b23a2e 是乌鸦 / 阿尔德里克的唯一识别色）
function portraitAldric7(){
  // 局部 100×130：暗红底 + 两只纹章乌鸦，阿尔德里克半身像（白发长须、拉夫领、黑毛领斗篷、红眼）
  return `<rect width="100" height="130" fill="#3a1e1a"/><rect width="100" height="130" fill="url(#chDown)" opacity=".7"/>
    <use href="#sym-raven" x="6" y="6" width="18" height="18" style="color:#5a3a2a"/><use href="#sym-raven" x="76" y="6" width="18" height="18" style="color:#5a3a2a" transform="translate(170,0) scale(-1,1)"/>
    <g transform="translate(50,48) scale(1.55)">${CH.draw('aldric', {ruff:true, len:60, hold:'cane', face:{iris:'#b23a2e', gaze:[.3,0], mood:'stern', age:'old', male:true}})}</g>`;
}
function bellArt7(o={}){
  const {x, top, lip} = TW7.bell;
  return `<g ${s7k}>
    <rect x="${x-34}" y="${top-14}" width="68" height="20" fill="#5a4630"/>
    <path d="M${x-12},${top+6} V${top+22} M${x+12},${top+6} V${top+22}" stroke-width="5"/>
    <path d="M${x-30},${top+22} Q${x-34},${top+70} ${x-50},${lip-60} Q${x-70},${lip-24} ${x-86},${lip} L${x+86},${lip} Q${x+70},${lip-24} ${x+50},${lip-60} Q${x+34},${top+70} ${x+30},${top+22} Z" fill="#6e7262"/>
    <path d="M${x-18},${top+40} Q${x-26},${lip-60} ${x-56},${lip-12}" stroke="#9a9e8c" stroke-width="5" fill="none" opacity=".55"/>
    <path d="M${x-76},${lip-14} H${x+76}" stroke="#4e5244" stroke-width="2"/>
    <ellipse cx="${x}" cy="${lip}" rx="86" ry="12" fill="#2e3228"/>
    ${o.feather ? `<path d="M${x+36},${lip+2} Q${x+52},${lip-14} ${x+74},${lip-22}" stroke="#8a8478" stroke-width="6" fill="none" opacity=".6"/>
      <path d="M${x+36},${lip+2} Q${x+52},${lip-14} ${x+74},${lip-22}" stroke="#0e0c0a" stroke-width="3.4" fill="none"/>
      <path d="M${x+46},${lip-6} l-4,-7 M${x+54},${lip-12} l-4,-7 M${x+62},${lip-17} l-3,-7 M${x+48},${lip-6} l7,1 M${x+56},${lip-12} l7,0 M${x+64},${lip-17} l7,-1" stroke="#1d1915" stroke-width="2"/>` : ''}
    <path d="M${x},${lip-10} V${lip+(o.drop?42:22)}" stroke-width="5"/><circle cx="${x}" cy="${lip+(o.drop?54:34)}" r="12" fill="#3a3430"/></g>`;
}
function weightArt7(y){
  const x=TW7.wX;
  return `<g ${s7k}><path d="M${x},${TW7.pulley.y+TW7.pulley.r-2} V${y}" stroke="#7a6a50" stroke-width="3"/>
    <path d="M${x-6},${y} h12 v10 h-12 Z" fill="#2a2420"/>
    <rect x="${x-28}" y="${y+10}" width="56" height="${TW7.wH}" rx="8" fill="#55524a"/>
    ${[0,1,2,3].map(i=>`<path d="M${x-28},${y+30+i*22} H${x+28}" stroke="#3a3832" stroke-width="1.6"/>`).join('')}
    <path d="M${x-10},${y+10} V${y+TW7.wH+10} M${x+10},${y+10} V${y+TW7.wH+10}" stroke="#3a3832" stroke-width="1"/></g>`;
}
// 钟面（原点中心）：hour 1..12
function clockFaceArt7(r, hour){
  return `<g ${s7k}><circle r="${r}" fill="#cfc6ae"/><circle r="${r*.86}" fill="none" stroke="#6a5a40" stroke-width="1.4"/>
    ${[...Array(12)].map((_,i)=>{ const a=i*30*Math.PI/180, R=r*.7;
      return `<text x="${(R*Math.sin(a)).toFixed(1)}" y="${(-R*Math.cos(a)+r*.08).toFixed(1)}" text-anchor="middle" font-family="Georgia,serif" font-size="${(r*.19).toFixed(1)}" fill="#2b251e" stroke="none">${['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'][i]}</text>`; }).join('')}
    <g transform="rotate(${(hour%12)*30})"><path d="M0,${r*.14} L${-r*.07},0 L0,${-r*.52} L${r*.07},0 Z" fill="#1a1511"/></g>
    <circle r="${r*.07}" fill="#1a1511"/></g>`;
}
// 月相盘（原点中心）：0 新月 1 上弦 2 满月 3 下弦
const PHASE7 = ['新月','上弦月','满月','下弦月'];
function moonDiscArt7(r, phase){
  const m=r*.62;
  const face = phase===0 ? `<circle r="${m}" fill="#2a2620" stroke="#8a8270" stroke-width="1"/>`
    : phase===2 ? `<circle r="${m}" fill="#ebe6d2"/><circle cx="${-m*.3}" cy="${-m*.2}" r="${m*.18}" fill="#cfc8b0" stroke="none"/>`
    : `<circle r="${m}" fill="#2a2620"/><path d="M0,${-m} A${m},${m} 0 0 ${phase===1?1:0} 0,${m} Z" fill="#ebe6d2" stroke="none"/>`;
  return `<g ${s7s}><circle r="${r}" fill="#2e3a4a"/><circle r="${r*.86}" fill="none" stroke="#b39a5a" stroke-width="1"/>${face}
    ${[...Array(8)].map((_,i)=>`<circle cx="${(r*.93*Math.cos(i*Math.PI/4)).toFixed(1)}" cy="${(r*.93*Math.sin(i*Math.PI/4)).toFixed(1)}" r="${(r*.045).toFixed(1)}" fill="#d8c080" stroke="none"/>`).join('')}</g>`;
}
function ringArt7(){
  return `<g ${s7k}><ellipse cx="0" cy="18" rx="30" ry="22" fill="none" stroke="#b8902e" stroke-width="9"/>
    <ellipse cx="0" cy="18" rx="30" ry="22" fill="none" stroke="#e0c060" stroke-width="2" opacity=".6"/>
    <rect x="-22" y="-26" width="44" height="34" rx="6" fill="#b8902e"/><rect x="-16" y="-20" width="32" height="22" rx="4" fill="#3a2a10"/>
    <use href="#sym-raven" x="-13" y="-21" width="26" height="24" style="color:#d8b860" stroke="none"/></g>`;
}
function pactArt7(){
  return `<g ${s7k}><path d="M-34,-44 H34 Q42,-44 42,-36 V40 Q42,48 34,48 H-34 Q-42,48 -42,40 V-36 Q-42,-44 -34,-44 Z" fill="#d4c8a4"/>
    <path d="M-28,-30 H28 M-28,-18 H24 M-28,-6 H28 M-28,6 H18" stroke="#6a5a44" stroke-width="2"/>
    <path d="M12,22 l-6,14 M12,22 l0,16 M12,22 l6,14 M12,22 v-6" stroke="#5a1a14" stroke-width="2.4" fill="none"/></g>`;
}
function letterArt7(){
  return `<g ${s7s}><polygon points="0,0 52,-4 56,24 4,28" fill="#d8cfb8"/><path d="M8,6 H44 M8,12 H40 M9,18 H46" stroke="#7a6a58" stroke-width="1"/></g>`;
}
