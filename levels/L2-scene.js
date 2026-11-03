/* =====================================================================
   第 2 关 · 礼拜堂（The Chapel）—— 场景美术
   与大厅同一套房间透视：消失点 (414,330)，后墙 150..678 × 95..520
   ===================================================================== */
const C_WINS = [
  {k:'sun',  cx:205, glass:'#8a6224', pane:'#c99a3c', light:'#f2c14e', cn:'日', en:'Sun'},
  {k:'moon', cx:300, glass:'#25416a', pane:'#46709f', light:'#86ade0', cn:'月', en:'Moon'},
  {k:'deer', cx:528, glass:'#5e221d', pane:'#90372e', light:'#d0574a', cn:'鹿', en:'Stag'},
  {k:'raven',cx:623, glass:'#121214', pane:'#1e1e22', light:null,      cn:'鸦', en:'Raven'}
];
const cWin = k => C_WINS.find(w=>w.k===k);
const VPX=414, VPY=330;
const wy = (x,hy)=> +(VPY+(hy-VPY)*(VPX-x)/VPX).toFixed(1);   // 左墙：x 处、后墙高度 hy 对应的 y
const lw = (x,hy)=>`${x},${wy(x,hy)}`;
const rw = (x,hy)=>`${x},${wy(828-x,hy)}`;
const ck = 'stroke="#15110d" stroke-width="2.4" stroke-linejoin="round"';
const cInk = 'stroke="#1a1511" stroke-width="2" stroke-linejoin="round"';
const winOuter = cx=>`M${cx-30},344 L${cx-30},190 Q${cx-28},150 ${cx},134 Q${cx+28},150 ${cx+30},190 L${cx+30},344 Z`;
const winGlass = cx=>`M${cx-21},334 L${cx-21},194 Q${cx-19},162 ${cx},148 Q${cx+19},162 ${cx+21},194 L${cx+21},334 Z`;
const C2_DOOR_O = 'M750,572 L750,288 Q745,230 718,212 Q691,232 686,294 L686,526 Z';
const C2_DOOR_I = 'M742,566 L742,292 Q738,242 718,226 Q698,244 694,297 L694,531 Z';
const CONF = {x0:14, x1:144, top:244};

function c2Window(w){
  let lat=''; for(let i=-6;i<8;i++) lat+=`<path d="M${w.cx-30+i*12},150 l60,60 M${w.cx+30-i*12},150 l-60,60"/>`;
  let panes=''; for(let r=0;r<9;r++) for(let c=0;c<3;c++){ if((r+c)%2) continue;
    panes+=`<rect x="${w.cx-21+c*14}" y="${150+r*21}" width="14" height="21" fill="${w.pane}" opacity="${(.55+((r*7+c*3)%4)*.1).toFixed(2)}"/>`; }
  const cx=w.cx;
  const motif = w.k==='sun' ? `<circle cx="${cx}" cy="240" r="9" fill="#f3d27a"/><path d="M${cx},224v-6M${cx},256v6M${cx-16},240h-6M${cx+16},240h6" stroke="#f3d27a" stroke-width="2.4"/>`
    : w.k==='moon' ? `<use href="#sym-moon" x="${cx-14}" y="224" width="28" height="28" style="color:#d6e4f2"/>`
    : w.k==='deer' ? `<use href="#deer" x="${cx-18}" y="222" width="36" height="36" style="color:#e2b9a2"/>`
    : `<use href="#sym-raven" x="${cx-16}" y="222" width="32" height="32" style="color:#3a3a42"/>`;
  return `<defs><clipPath id="c2wc-${w.k}"><path d="${winGlass(cx)}"/></clipPath></defs>
    <path d="${winOuter(cx)}" fill="#66665c"/>
    <path d="${winGlass(cx)}" fill="${w.glass}"/>
    <g clip-path="url(#c2wc-${w.k})" stroke="none">${panes}${motif}<g stroke="#14110e" stroke-width="1.4" fill="none">${lat}</g></g>
    <path d="M${cx},148 V334 M${cx-21},250 H${cx+21}" stroke="#14110e" stroke-width="2.2" fill="none"/>
    <polygon points="${cx-36},344 ${cx+36},344 ${cx+40},352 ${cx-40},352" fill="#77776b"/>`;
}

function c2Pew(x0,x1,top,endX,dir){
  const xa=Math.min(x0,x1), w=Math.abs(x1-x0);
  return `<rect x="${xa}" y="${top}" width="${w}" height="34" fill="#33281f" ${ck}/>
    <rect x="${xa}" y="${top}" width="${w}" height="6" fill="#4a3b2e"/>
    <rect x="${xa}" y="${top+34}" width="${w}" height="12" fill="#261e17" ${ck}/>
    <path d="M${endX},709 L${endX},${top-4} Q${endX+dir*12},${top-22} ${endX+dir*24},${top-4} L${endX+dir*24},709 Z" fill="#3a2e23" ${ck}/>
    <path d="M${endX+dir*6},700 L${endX+dir*6},${top+10} M${endX+dir*18},700 L${endX+dir*18},${top+10}" stroke="#2a2119" stroke-width="1.4"/>
    <use href="#sym-cross" x="${endX+dir*12-7}" y="${top+16}" width="14" height="14" style="color:#1d1712"/>`;
}

function c2Confessional(){
  const L=(x,hy)=>lw(x,hy);
  return `
    <polygon points="${L(16,246)} ${L(136,246)} ${L(136,262)} ${L(16,262)}" fill="#2a2119"/>
    <polygon points="${L(22,262)} ${L(130,262)} ${L(130,628)} ${L(22,628)}" fill="#3b2e23"/>
    <polygon points="${L(26,622)} ${L(26,318)} ${L(40,294)} ${L(54,318)} ${L(54,622)}" fill="#4a1f1b"/>
    <polygon points="${L(98,622)} ${L(98,318)} ${L(112,294)} ${L(126,318)} ${L(126,622)}" fill="#4a1f1b"/>
    <path d="M${L(33,320)} L${L(33,618)} M${L(42,316)} L${L(42,620)} M${L(105,320)} L${L(105,618)} M${L(116,316)} L${L(116,620)}" stroke="#2e1411" stroke-width="2" fill="none"/>
    <polygon points="${L(60,622)} ${L(60,312)} ${L(76,290)} ${L(92,312)} ${L(92,622)}" fill="#4a3a2c"/>
    <polygon points="${L(66,372)} ${L(86,372)} ${L(86,440)} ${L(66,440)}" fill="#14100c"/>
    <path d="M${L(71,372)} L${L(71,440)} M${L(76,372)} L${L(76,440)} M${L(81,372)} L${L(81,440)} M${L(66,389)} L${L(86,389)} M${L(66,406)} L${L(86,406)} M${L(66,423)} L${L(86,423)}" stroke="#5a4838" stroke-width="1.4"/>
    <path d="M${L(76,250)} L${L(76,232)} M${L(70,240)} L${L(82,240)}" stroke="#2a2119" stroke-width="4"/>
    <polygon points="130,${wy(130,262)} 142,${wy(130,262)+2} 142,${wy(130,628)+3} 130,${wy(130,628)}" fill="#241b14"/>`;
}

function c2Background(){
  let floor=''; for(let x=-600; x<=1428; x+=56) floor+=`<path d="M${(VPX+(x-VPX)*(520-VPY)/(709-VPY)).toFixed(1)},520 L${x},709"/>`;
  [534,552,576,606,644,690].forEach(y=> floor+=`<path d="M0,${y} H828"/>`);
  let lws='', rws=''; for(let hy=-10; hy<628; hy+=46){ lws+=`<path d="M${lw(0,hy)} L${lw(150,hy)}"/>`; rws+=`<path d="M${rw(828,hy)} L${rw(678,hy)}"/>`; }
  let cabPipes=''; [30,22,16,12,16,22,30].forEach((t,i)=>{ const x=184+i*16;
    cabPipes+=`<rect x="${x}" y="${366+t*.6}" width="9" height="${32-t*.6}" fill="#7e7a6c" stroke="#15110d" stroke-width="1.2"/>`; });
  let orgPipes=''; [362,356,352,350,352,356,362].forEach((t,i)=>{ const x=548+i*19;
    orgPipes+=`<rect x="${x-6}" y="${t}" width="12" height="${410-t}" rx="2" fill="#8a8678" stroke="#15110d" stroke-width="1.3"/>
      <path d="M${x-4},${t+2} V408" stroke="#b5b1a3" stroke-width="1.4"/><path d="M${x-4},396 l4,-5 l4,5 Z" fill="#15110d" stroke="none"/>`; });
  let keys=''; for(let i=0;i<14;i++) keys+=`<rect x="${560+i*7}" y="448" width="6.4" height="8" fill="#d8cfb6" stroke="#15110d" stroke-width=".6"/>`;
  const sconceL = wy(70,178), sconceR = wy(38,150);
  return `
  <defs>
    <filter id="c2-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="11" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="nb"/><feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="1" seed="7" result="nc"/><feDisplacementMap in="nb" in2="nc" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="c2-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="4" seed="21"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.09  1.9 0 0 0 -0.8"/>
    </filter>
    <pattern id="c2-stone" patternUnits="userSpaceOnUse" width="60" height="34">
      <path d="M0,0.5H60M0,17.5H60M0.5,0V17M30.5,17V34" fill="none" stroke="#3a3b35" stroke-width="1.2"/>
    </pattern>
    <linearGradient id="c2-ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141210"/><stop offset="1" stop-color="#26221d"/></linearGradient>
    <linearGradient id="c2-bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43443e"/><stop offset=".4" stop-color="#52534b"/><stop offset="1" stop-color="#4b4c45"/></linearGradient>
    <linearGradient id="c2-lw" x1="0" x2="1"><stop offset="0" stop-color="#33342f"/><stop offset="1" stop-color="#48493f"/></linearGradient>
    <linearGradient id="c2-rw" x1="0" x2="1"><stop offset="0" stop-color="#48493f"/><stop offset="1" stop-color="#31322d"/></linearGradient>
    <linearGradient id="c2-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#28251f"/><stop offset="1" stop-color="#36322a"/></linearGradient>
    <radialGradient id="c2-warm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <radialGradient id="c2-warmBig"><stop offset="0" stop-color="#ffc56e" stop-opacity=".28"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
    <clipPath id="c2-clipFloor"><polygon points="0,628 150,520 678,520 828,628 828,709 0,709"/></clipPath>
    <clipPath id="c2-clipWalls"><polygon points="0,-38 150,95 150,520 0,628"/><rect x="150" y="95" width="528" height="425"/><polygon points="828,-38 678,95 678,520 828,628"/></clipPath>
    <clipPath id="c2-clipDoor"><path d="${C2_DOOR_I}"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="#141210"/>
  <g filter="url(#c2-rough)" ${ck}>
    <rect x="-10" y="-10" width="848" height="110" fill="url(#c2-ceil)" stroke="none"/>
    <g fill="#1b1612" stroke="#0f0c0a" stroke-width="1.5">
      <polygon points="120,-10 150,-10 228,95 216,95"/><polygon points="300,-10 324,-10 340,95 330,95"/>
      <polygon points="504,-10 528,-10 498,95 488,95"/><polygon points="678,-10 708,-10 612,95 600,95"/>
      <polygon points="60,40 768,40 752,52 76,52" fill="#30271f"/><polygon points="112,78 716,78 708,86 120,86" fill="#2c241d"/>
    </g>
    <rect x="150" y="95" width="528" height="425" fill="url(#c2-bw)"/>
    <rect x="150" y="95" width="528" height="425" fill="url(#c2-stone)" stroke="none" opacity=".8"/>
    <polygon points="0,-38 150,95 150,520 0,628" fill="url(#c2-lw)"/>
    <g stroke="#2c2d28" stroke-width="1.2" fill="none">${lws}</g>
    <polygon points="828,-38 678,95 678,520 828,628" fill="url(#c2-rw)"/>
    <g stroke="#2c2d28" stroke-width="1.2" fill="none">${rws}</g>
    <rect x="150" y="95" width="528" height="40" fill="#000" opacity=".25" stroke="none"/>
    <polygon points="0,628 150,520 678,520 828,628 828,709 0,709" fill="url(#c2-floor)"/>
    <g clip-path="url(#c2-clipFloor)" stroke="#1c1915" stroke-width="1.4" fill="none">${floor}</g>
    <line x1="150" y1="520" x2="678" y2="520" stroke="#100d0b" stroke-width="3"/>
  </g>
  <rect width="828" height="709" filter="url(#c2-stain)" clip-path="url(#c2-clipWalls)" opacity=".55"/>

  <g filter="url(#c2-rough)" ${ck}>
    ${C_WINS.map(c2Window).join('')}
    <!-- 圣诗板 -->
    <path d="M378,150 L372,168 M450,150 L456,168" stroke="#15110d" stroke-width="2" stroke-dasharray="3 2"/>
    <rect x="362" y="166" width="104" height="100" fill="#3a2e23"/>
    <rect x="370" y="178" width="88" height="80" fill="#262420"/>
    <rect x="392" y="168" width="44" height="8" fill="#2a2119" stroke-width="1"/>
    <g stroke-width="1.6" fill="none" opacity=".45">
      <path d="M378,196 q10,-6 22,2 t20,-2" stroke="#c9a24a"/><path d="M384,214 q14,8 30,-2 t26,4" stroke="#a84a3e"/>
      <path d="M380,232 q12,-6 28,0 t30,-2" stroke="#6d8fbd"/><path d="M390,246 h40 M396,190 l30,6" stroke="#bdb5a0"/>
    </g>
    <!-- 祭坛十字架 / 祭坛 -->
    <path d="M414,300 V420 M396,328 H432" stroke="#15110d" stroke-width="9" stroke-linecap="round"/>
    <path d="M414,300 V420 M396,328 H432" stroke="#8a7650" stroke-width="3"/>
    <polygon points="344,420 484,420 492,432 336,432" fill="#77756a"/>
    <rect x="340" y="432" width="148" height="88" fill="#605e55"/>
    <path d="M340,460 H488 M340,490 H488 M380,432 V460 M444,460 V490 M396,490 V520" stroke="#4a4842" stroke-width="1.3"/>
    <path d="M372,431 H456 V488 L450,494 L444,488 L438,494 L432,488 L426,494 L420,488 L414,494 L408,488 L402,494 L396,488 L390,494 L384,488 L378,494 L372,488 Z" fill="#cfc6ae"/>
    <path d="M414,446 V476 M404,456 H424" stroke="#a48c56" stroke-width="3"/>
    <g fill="#2a2622"><path d="M352,424 h16 l-3,-4 h-10 Z"/><rect x="358.5" y="398" width="3" height="22"/><path d="M354,398 h12 v-2 h-12 Z"/>
      <path d="M460,424 h16 l-3,-4 h-10 Z"/><rect x="466.5" y="398" width="3" height="22"/><path d="M462,398 h12 v-2 h-12 Z"/></g>
    <rect x="357" y="378" width="6" height="18" fill="#d7ccb0" stroke-width="1.2"/><rect x="465" y="382" width="6" height="14" fill="#d7ccb0" stroke-width="1.2"/>
    <path d="M426,425 L442,420 L458,425 L442,428 Z" fill="#d8cfb4" stroke-width="1.2"/>
    <!-- 圣器柜 -->
    <rect x="166" y="356" width="132" height="10" fill="#2a2119"/>
    <rect x="172" y="366" width="120" height="154" fill="#3a2e23"/>
    ${cabPipes}
    <rect x="178" y="402" width="52" height="112" fill="#44362a"/><rect x="234" y="402" width="52" height="112" fill="#44362a"/>
    <rect x="186" y="412" width="36" height="92" fill="none" stroke="#2a2119" stroke-width="1.4"/><rect x="242" y="412" width="36" height="92" fill="none" stroke="#2a2119" stroke-width="1.4"/>
    <path d="M204,440 V470 M196,450 H212 M260,440 V470 M252,450 H268" stroke="#2a2119" stroke-width="3"/>
    <!-- 管风琴 -->
    <rect x="534" y="404" width="132" height="116" fill="#3a2e23"/>
    ${orgPipes}
    <rect x="530" y="404" width="140" height="10" fill="#2a2119"/>
    <rect x="550" y="420" width="100" height="22" fill="#2b231b" stroke-width="1.2"/>
    <rect x="552" y="444" width="104" height="16" fill="#2a2119" stroke-width="1.2"/>
    ${keys}
    <circle cx="545" cy="430" r="7" fill="#c9bea3" stroke-width="1.4"/><path d="M545,430 l-4,3" stroke-width="1.4"/>
    <path d="M670,470 L680,418" stroke="#2a2119" stroke-width="4"/><circle cx="680" cy="416" r="4.5" fill="#6a5a42" stroke-width="1.4"/>
    <rect x="562" y="496" width="76" height="8" fill="#2e241b"/><path d="M568,504 V520 M632,504 V520" stroke="#2e241b" stroke-width="4"/>
    ${c2Confessional()}
    <!-- 壁灯 -->
    <path d="M70,${sconceL+22} L70,${sconceL+50}" stroke="#221e1a" stroke-width="4"/>
    <rect x="64" y="${sconceL}" width="8" height="22" fill="#d7ccb0" stroke-width="1.2"/>
    <path d="M790,${sconceR+24} L790,${sconceR+52}" stroke="#221e1a" stroke-width="4"/>
    <rect x="786" y="${sconceR}" width="8" height="24" fill="#d7ccb0" stroke-width="1.2"/>
    <!-- 右墙：回大厅的门 -->
    <path d="${C2_DOOR_O}" fill="#5e5e54"/>
    <path d="${C2_DOOR_I}" fill="#3e3125"/>
    <g clip-path="url(#c2-clipDoor)" stroke="#281f17" stroke-width="1.6" fill="none">
      <path d="M702,200 V580 M710,200 V580 M726,200 V580 M734,200 V580"/>
      <path d="M694,312 L742,306 M694,490 L742,500" stroke="#16130f" stroke-width="4"/>
    </g>
    <circle cx="702" cy="420" r="5" fill="none" stroke="#120f0c" stroke-width="2.4"/>
    <!-- 吊灯（蜡烛燃尽） -->
    <path d="M414,0 V58" stroke="#15110d" stroke-width="2.4" stroke-dasharray="4 2"/>
    <path d="M414,58 L364,76 M414,58 L464,76" stroke="#15110d" stroke-width="1.2" fill="none"/>
    <ellipse cx="414" cy="78" rx="52" ry="8" fill="none" stroke="#15110d" stroke-width="4"/>
    <g fill="#bdb196" stroke-width="1"><rect x="370" y="76" width="5" height="6"/><rect x="396" y="80" width="5" height="7"/><rect x="427" y="80" width="5" height="5"/><rect x="453" y="76" width="5" height="7"/></g>
    <!-- 洗礼池 -->
    <ellipse cx="238" cy="530" rx="42" ry="10" fill="#6f6c62"/>
    <ellipse cx="238" cy="530" rx="33" ry="6.5" fill="#24221e" stroke-width="1.4"/>
    <path d="M196,530 L280,530 L270,558 L206,558 Z" fill="#5f5d55"/>
    <use href="#deer" x="224" y="534" width="28" height="22" style="color:#45433c"/>
    <rect x="224" y="558" width="28" height="30" fill="#55534b"/>
    <polygon points="208,588 268,588 276,600 200,600" fill="#5f5d55"/>
    <!-- 地毯 -->
    <polygon points="366,522 462,522 548,709 280,709" fill="#47221d"/>
    <polygon points="374,528 454,528 532,709 296,709" fill="none" stroke="#6e3e2c" stroke-width="1.6" stroke-dasharray="5 4"/>
    <!-- 长椅 -->
    ${c2Pew(-10,318,600,318,-1)}${c2Pew(510,838,600,486,1)}
    ${c2Pew(-10,296,656,296,-1)}${c2Pew(532,838,656,508,1)}
  </g>
  <circle cx="360" cy="370" r="80" fill="url(#c2-warmBig)"/><circle cx="468" cy="374" r="80" fill="url(#c2-warmBig)"/>
  <circle cx="68" cy="${sconceL}" r="70" fill="url(#c2-warmBig)"/><circle cx="790" cy="${sconceR}" r="70" fill="url(#c2-warmBig)"/>
  <circle cx="360" cy="374" r="14" fill="url(#c2-warm)"/><circle cx="468" cy="378" r="14" fill="url(#c2-warm)"/>
  <circle cx="68" cy="${sconceL-4}" r="18" fill="url(#c2-warm)"/><circle cx="790" cy="${sconceR-4}" r="18" fill="url(#c2-warm)"/>
  <path class="flame" d="M360,366 q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>
  <path class="flame" d="M468,370 q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>
  <path class="flame" d="M68,${sconceL-12} q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>
  <path class="flame" d="M790,${sconceR-12} q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>`;
}

/* ---------------- 场景 DOM ---------------- */
document.getElementById('hall').insertAdjacentHTML('afterend', `
<div id="l2" class="lvroot hidden" data-level="L2">
  <svg id="l2Bg" viewBox="0 0 828 709" pointer-events="none">${c2Background()}</svg>
  <svg id="l2Obj" viewBox="0 0 828 709">
    <defs>
      ${C_WINS.filter(w=>w.light).map(w=>`
        <linearGradient id="c2beam-${w.k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w.light}" stop-opacity=".34"/><stop offset="1" stop-color="${w.light}" stop-opacity="0"/></linearGradient>
        <radialGradient id="c2pool-${w.k}"><stop offset="0" stop-color="${w.light}" stop-opacity=".3"/><stop offset="1" stop-color="${w.light}" stop-opacity="0"/></radialGradient>`).join('')}
      <radialGradient id="c2-vig" cx="50%" cy="48%" r="72%"><stop offset=".42" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient>
    </defs>
    <g id="l2Dyn" pointer-events="none"></g>
    <g id="l2Hot">
      ${C_WINS.map(w=>`<path class="hs" data-obj="c_win_${w.k}" d="${winOuter(w.cx)}"/>`).join('')}
      <rect class="hs" data-obj="c_board" x="358" y="148" width="112" height="122"/>
      <rect class="hs" data-obj="c_altar" x="334" y="296" width="160" height="224"/>
      <rect class="hs" data-obj="c_cabinet" x="166" y="352" width="132" height="168"/>
      <rect class="hs" data-obj="c_organ" x="528" y="344" width="158" height="176"/>
      <rect class="hs" data-obj="c_font" x="192" y="514" width="94" height="88"/>
      <polygon class="hs" data-obj="c_confess" points="${lw(CONF.x0,CONF.top)} ${lw(CONF.x1,CONF.top)} ${lw(CONF.x1,628)} ${lw(CONF.x0,628)}"/>
      <rect class="hs" data-obj="c_rope" x="152" y="96" width="22" height="380"/>
      <path class="hs" data-obj="c_door" d="${C2_DOOR_O}"/>
      <rect class="hs" data-obj="c_chand" x="356" y="50" width="116" height="40"/>
      <rect class="hs" data-obj="c_pews" x="0" y="584" width="330" height="125"/>
      <rect class="hs" data-obj="c_pews" x="498" y="584" width="330" height="125"/>
    </g>
  </svg>
</div>`);
