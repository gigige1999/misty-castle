/* =====================================================================
   第 3 关 · 厨房与酒窖（The Kitchen & Cellar）—— 场景美术
   复用 L2-scene.js 的透视工具：VPX / VPY / wy / lw / rw / ck / cInk
   ===================================================================== */
const hb = 'stroke="#1a1511" stroke-width="1.5" stroke-linejoin="round"';

/* ---------------- 共享美术：四种草药（倒挂成束）、玛莎、提灯 ---------------- */
// 罂粟 poppy / 缬草 valerian / 毛地黄 foxglove / 颠茄 belladonna —— 叶形与图谱一一对应
const HERBS = {
  poppy:     {cn:'罂粟', la:'Papaver',    toxic:false},
  valerian:  {cn:'缬草', la:'Valeriana',  toxic:false},
  foxglove:  {cn:'毛地黄', la:'Digitalis', toxic:true},
  belladonna:{cn:'颠茄', la:'Atropa',     toxic:true}
};
const RACK_ORDER = ['belladonna','valerian','poppy','foxglove'];
function herbArt(k){
  const dxs=[-14,-7,0,7,14];
  const stem = c => dxs.map(dx=>`<path d="M0,14 Q${dx*.5},50 ${dx},90" stroke="${c}" stroke-width="2" fill="none"/>`).join('');
  const tie = `<path d="M0,-4 V12" stroke="#5a4632" stroke-width="2"/><rect x="-6" y="9" width="12" height="7" rx="1" fill="#8a6a3a" ${hb}/>`;
  let a='';
  if(k==='poppy'){
    a = stem('#7a7a54')
      + [[-6,36,-30],[6,44,30],[-10,60,-20],[10,64,24]].map(([x,y,r])=>`<path d="M${x},${y} l${r>0?9:-9},5 l${r>0?-2:2},3 l${r>0?8:-8},3 l${r>0?-3:3},3 l${r>0?6:-6},4 q${r>0?-10:10},-2 ${r>0?-18:18},-14 Z" fill="#8c977a" ${hb}/>`).join('')
      + dxs.map((dx,i)=>`<ellipse cx="${dx}" cy="${95+(i%2)*4}" rx="5.5" ry="7" fill="#a6a36c" ${hb}/><path d="M${dx-5},${103+(i%2)*4} h10 M${dx},${102+(i%2)*4} v4" stroke="#4a4426" stroke-width="2"/>`).join('');
  }else if(k==='valerian'){
    a = stem('#5e6e40');
    dxs.forEach((dx,i)=>{ for(let j=0;j<5;j++){ const t=.25+j*.14, x=dx*t*1.1, y=14+76*t;
      a+=`<ellipse cx="${(x-4).toFixed(1)}" cy="${y.toFixed(1)}" rx="3.6" ry="1.5" transform="rotate(-25 ${(x-4).toFixed(1)} ${y.toFixed(1)})" fill="#6f8a4a"/><ellipse cx="${(x+4).toFixed(1)}" cy="${y.toFixed(1)}" rx="3.6" ry="1.5" transform="rotate(25 ${(x+4).toFixed(1)} ${y.toFixed(1)})" fill="#6f8a4a"/>`; }
      a+=[[0,0],[-3,3],[3,3],[-1,6],[2,7],[-4,-1],[4,-1]].map(([u,v])=>`<circle cx="${dx+u}" cy="${94+v+(i%2)*3}" r="2" fill="#e8dfd0" stroke="#5a5040" stroke-width=".5"/>`).join(''); });
  }else if(k==='foxglove'){
    a = stem('#5d6a3e')
      + [[-8,24,-34],[8,26,34],[-4,34,-12],[4,36,12]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="16" transform="rotate(${r} ${x} ${y})" fill="#6e7d50" ${hb}/>`).join('')
      + dxs.map((dx,i)=>[0,1,2,3].map(j=>{ const y=58+j*11+(i%2)*4, x=dx*(.6+j*.12);
          return `<path d="M${x-4},${y} Q${x-5},${y+9} ${x},${y+11} Q${x+5},${y+9} ${x+4},${y} Z" fill="#8a4a78" ${hb}/><circle cx="${x}" cy="${y+8}" r="1" fill="#e7c9dc"/>`; }).join('')).join('');
  }else{
    a = stem('#4a5634')
      + [[-9,34,-30],[9,40,30],[-11,58,-18],[11,62,20],[0,48,0]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="7.5" ry="12" transform="rotate(${r} ${x} ${y})" fill="#4c5e36" ${hb}/><path d="M${x},${y-10} V${y+10}" transform="rotate(${r} ${x} ${y})" stroke="#33402a" stroke-width="1"/>`).join('')
      + dxs.map((dx,i)=>`<circle cx="${dx}" cy="${93+(i%2)*5}" r="5" fill="#141214" ${hb}/><circle cx="${dx-1.6}" cy="${91.5+(i%2)*5}" r="1.4" fill="#8a8898"/><path d="M${dx-4},${88+(i%2)*5} l4,-3 l4,3" stroke="#3e4a2a" stroke-width="1.4" fill="none"/>`).join('');
  }
  return tie + a;
}

// 玛莎：老厨娘，米白头巾系在下巴下，土黄披肩、深褐粗布裙、围裙；坐在矮凳上打盹，手里还攥着木勺
function marthaHead(awake){
  // 人物库玛莎（头巾 + 皱纹）；打盹时闭眼张嘴
  const hr = CH.hair.martha();
  return `<g transform="scale(1.42)" stroke="none">${hr.back}
    ${CH.face({age:'old', mood: awake ? 'stern' : 'neutral', eyes: awake ? 'open' : 'closed', mouth: awake ? 'line' : 'open', hollow:true})}
    ${hr.front}</g>`;
}
function marthaArt(awake){
  const head = awake ? 'translate(646,425)' : 'translate(640,437) rotate(-14)';
  return `<g ${ck}>
    <!-- 矮凳 -->
    <rect x="614" y="518" width="64" height="8" fill="#3a2e23"/>
    <path d="M620,526 L614,570 M672,526 L678,570" stroke="#3a2e23" stroke-width="5"/>
    <!-- 裙子与围裙 -->
    <path d="M622,488 Q610,522 598,568 L694,568 Q684,522 672,488 Z" fill="#4a3a2e"/>
    <path d="M612,540 Q620,552 616,566 M684,540 Q676,552 680,566 M646,500 V566" stroke="#33281f" stroke-width="1.4" fill="none"/>
    <path d="M628,490 L664,490 Q672,530 677,563 L615,563 Q620,530 628,490 Z" fill="#cfc4a6"/>
    <path d="M617,553 H675" stroke="#a89c80" stroke-width="1.6"/>
    <path d="M634,520 h20 v14 q-10,4 -20,0 Z" fill="#c2b698" stroke-width="1.2"/>
    <ellipse cx="616" cy="570" rx="9" ry="4" fill="#241c15"/><ellipse cx="677" cy="570" rx="9" ry="4" fill="#241c15"/>
    <!-- 上身（随呼吸起伏） -->
    <g class="${awake?'':'k3snore'}">
      <rect x="640" y="446" width="12" height="14" fill="#a39b87" stroke="none"/>
      <path d="M624,460 Q620,476 624,492 L668,492 Q672,476 668,460 Q646,450 624,460 Z" fill="#4a3a2e"/>
      <path d="M622,458 Q646,450 670,458 L666,474 Q646,490 626,474 Z" fill="#8a7b5e"/>
      <path d="M640,478 L646,494 L652,478" fill="#8a7b5e"/>
      <path d="M628,462 Q646,476 664,462" stroke="#6e6248" stroke-width="1.2" fill="none"/>
      <path d="M626,464 Q610,490 622,508 Q634,514 646,510 L644,500 Q632,500 630,490 Z" fill="#46372b"/>
      <path d="M666,464 Q682,490 670,508 Q658,514 646,510 L648,500 Q660,500 662,490 Z" fill="#46372b"/>
      <path d="M636,500 L606,546" stroke="#1a1511" stroke-width="5.4" stroke-linecap="round"/>
      <path d="M636,500 L606,546" stroke="#9a7a4e" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="604" cy="550" rx="6" ry="8" transform="rotate(34 604 550)" fill="#9a7a4e"/>
      <ellipse cx="646" cy="506" rx="11" ry="5.5" fill="#c9c4b0"/>
      <path d="M640,504 q2,3 5,3 M647,503 q2,3 5,3" stroke="#8a8270" stroke-width="1" fill="none"/>
      <g transform="${head}">${marthaHead(awake)}</g>
    </g>
  </g>`;
}
document.head.insertAdjacentHTML('beforeend', `<style>
  .k3snore{animation:k3snore 3.4s ease-in-out infinite}
  @keyframes k3snore{0%,100%{transform:translateY(0)}50%{transform:translateY(1.6px)}}
</style>`);

function lampArt(lit){
  return `<g ${ck}>
    <path d="M-9,-30 Q0,-44 9,-30" fill="none" stroke-width="2.4"/>
    <path d="M-12,-26 L12,-26 L8,-30 L-8,-30 Z" fill="#2a2622"/>
    <rect x="-10" y="-26" width="20" height="30" fill="${lit?'#f2d38a':'#3a3a34'}" opacity="${lit?.9:1}"/>
    <path d="M-10,-26 V4 M10,-26 V4 M0,-26 V4" stroke-width="2"/>
    ${lit?`<path d="M0,-18 Q4,-10 2,-6 Q0,-3 -2,-6 Q-4,-10 0,-18 Z" fill="#ffefb0" stroke="none"/>`:''}
    <path d="M-13,4 L13,4 L10,10 L-10,10 Z" fill="#2a2622"/>
  </g>`;
}

/* ---------------- 厨房 ---------------- */
const K3 = {
  doorO:'M40,600 L40,330 Q44,280 80,262 Q116,282 120,324 L120,542 Z',
  doorI:'M50,594 L50,334 Q54,292 80,278 Q106,294 110,330 L110,549 Z',
  trap:'86,610 248,610 262,670 66,670',
  rackX:[318,362,406,450]
};
function k3Background(){
  let planks=''; for(let x=-600;x<=1428;x+=48) planks+=`<path d="M${(VPX+(x-VPX)*(520-VPY)/(709-VPY)).toFixed(1)},520 L${x},709"/>`;
  [540,566,600,646].forEach(y=> planks+=`<path d="M0,${y} H828" stroke-width=".9" opacity=".6"/>`);
  let lws='', rws=''; for(let hy=40; hy<628; hy+=64){ lws+=`<path d="M${lw(0,hy)} L${lw(150,hy)}"/>`; rws+=`<path d="M${rw(828,hy)} L${rw(678,hy)}"/>`; }
  let bricks=''; for(let r=0;r<6;r++){ const y=352+r*28; bricks+=`<path d="M488,${y} H672"/>`;
    for(let x=488+(r%2?18:36); x<672; x+=36) bricks+=`<path d="M${x},${y} V${y+28}"/>`; }
  const shelfY = wy(828-790,330);
  return `
  <defs>
    <filter id="k3-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="31" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="nb"/><feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="1" seed="7" result="nc"/><feDisplacementMap in="nb" in2="nc" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="k3-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="17"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 0 0.09  1.9 0 0 0 -0.8"/>
    </filter>
    <linearGradient id="k3-bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e685a"/><stop offset=".35" stop-color="#857e6b"/><stop offset="1" stop-color="#7b7462"/></linearGradient>
    <linearGradient id="k3-lw" x1="0" x2="1"><stop offset="0" stop-color="#55503f"/><stop offset="1" stop-color="#726b59"/></linearGradient>
    <linearGradient id="k3-rw" x1="0" x2="1"><stop offset="0" stop-color="#726b59"/><stop offset="1" stop-color="#524c3e"/></linearGradient>
    <linearGradient id="k3-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#40352a"/><stop offset="1" stop-color="#55463a"/></linearGradient>
    <linearGradient id="k3-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d767a"/><stop offset="1" stop-color="#a9afae"/></linearGradient>
    <radialGradient id="k3-warmBig"><stop offset="0" stop-color="#ffb860" stop-opacity=".3"/><stop offset="1" stop-color="#ff9a40" stop-opacity="0"/></radialGradient>
    <radialGradient id="k3-warm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <clipPath id="k3-clipFloor"><polygon points="0,628 150,520 678,520 828,628 828,709 0,709"/></clipPath>
    <clipPath id="k3-clipWalls"><polygon points="0,-38 150,95 150,520 0,628"/><rect x="150" y="95" width="528" height="425"/><polygon points="828,-38 678,95 678,520 828,628"/></clipPath>
    <clipPath id="k3-clipWin"><path d="M224,320 L224,206 Q226,178 245,166 Q264,178 266,206 L266,320 Z"/></clipPath>
    <clipPath id="k3-clipDoor"><path d="${K3.doorI}"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="#16120e"/>
  <g filter="url(#k3-rough)" ${ck}>
    <rect x="-10" y="-10" width="848" height="110" fill="#352c23" stroke="none"/>
    <g fill="#2a2119" stroke="#120e0b" stroke-width="1.5">
      <polygon points="150,-10 178,-10 236,95 224,95"/><polygon points="340,-10 364,-10 370,95 360,95"/>
      <polygon points="540,-10 566,-10 520,95 510,95"/><polygon points="690,-10 720,-10 620,95 606,95"/>
      <polygon points="40,30 788,30 770,44 58,44" fill="#3a2e24"/><polygon points="104,72 724,72 716,82 112,82" fill="#33291f"/>
    </g>
    <rect x="150" y="95" width="528" height="425" fill="url(#k3-bw)"/>
    <polygon points="0,-38 150,95 150,520 0,628" fill="url(#k3-lw)"/>
    <g stroke="#34302a" stroke-width="1" fill="none" opacity=".7">${lws}</g>
    <polygon points="828,-38 678,95 678,520 828,628" fill="url(#k3-rw)"/>
    <g stroke="#34302a" stroke-width="1" fill="none" opacity=".7">${rws}</g>
    <rect x="150" y="95" width="528" height="34" fill="#000" opacity=".25" stroke="none"/>
    <polygon points="0,628 150,520 678,520 828,628 828,709 0,709" fill="url(#k3-floor)"/>
    <g clip-path="url(#k3-clipFloor)" stroke="#1d1712" stroke-width="1.4" fill="none">${planks}</g>
    <line x1="150" y1="520" x2="678" y2="520" stroke="#120e0b" stroke-width="3"/>
  </g>
  <rect width="828" height="709" filter="url(#k3-stain)" clip-path="url(#k3-clipWalls)" opacity=".55"/>

  <g filter="url(#k3-rough)" ${ck}>
    <!-- 左墙：回大厅的门 + 壁灯 -->
    <path d="${K3.doorO}" fill="#6a6555"/>
    <path d="${K3.doorI}" fill="#45382b"/>
    <g clip-path="url(#k3-clipDoor)" stroke="#2c2219" stroke-width="1.5" fill="none">
      <path d="M64,270 V600 M80,270 V600 M96,270 V600"/>
      <path d="M50,360 L110,352 M50,520 L110,500" stroke="#1a1612" stroke-width="5"/>
    </g>
    <circle cx="98" cy="432" r="6" fill="none" stroke="#120f0c" stroke-width="2.6"/>
    <path d="M128,${wy(128,250)} L128,${wy(128,290)}" stroke="#221e1a" stroke-width="4"/>
    <rect x="124" y="${wy(128,190)}" width="8" height="22" fill="#d7ccb0" stroke-width="1.2"/>
    <!-- 窗：雾里的鸦群 -->
    <path d="M214,330 L214,204 Q217,168 245,152 Q273,168 276,204 L276,330 Z" fill="#6e695a"/>
    <path d="M224,320 L224,206 Q226,178 245,166 Q264,178 266,206 L266,320 Z" fill="url(#k3-fog)"/>
    <g clip-path="url(#k3-clipWin)" stroke="none">
      <path d="M224,286 L232,286 L232,258 L236,250 L240,258 L240,276 L248,276 L248,244 L252,236 L256,244 L256,280 L266,280 L266,320 L224,320 Z" fill="#7c8487"/>
      <path d="M224,236 Q244,232 266,224" stroke="#2c2a26" stroke-width="2.4" fill="none"/>
      <path d="M244,232 l6,-10 M232,236 l-2,-8" stroke="#2c2a26" stroke-width="1.6"/>
      <use href="#sym-raven" x="227" y="216" width="14" height="14" style="color:#1d1b18"/>
      <use href="#sym-raven" x="250" y="210" width="13" height="13" style="color:#1d1b18"/>
    </g>
    <path d="M245,166 V320 M224,246 H266" stroke="#2a2620" stroke-width="2.2" fill="none"/>
    <polygon points="208,330 282,330 286,338 204,338" fill="#7a7563"/>
    <!-- 草药架 -->
    <path d="M300,95 V140 M470,95 V140" stroke="#221e1a" stroke-width="2" stroke-dasharray="4 2"/>
    <rect x="288" y="138" width="194" height="8" rx="3" fill="#4a3a2c"/>
    <!-- 餐边柜 -->
    <rect x="156" y="378" width="184" height="10" fill="#4a3a2c"/>
    <rect x="162" y="388" width="172" height="86" fill="#3e3127"/>
    <rect x="170" y="398" width="76" height="66" fill="#47392d" stroke-width="1.4"/><rect x="250" y="398" width="76" height="30" fill="#47392d" stroke-width="1.4"/>
    <circle cx="238" cy="430" r="2.4" fill="#16120e"/><circle cx="288" cy="413" r="2.4" fill="#16120e"/>
    <path d="M168,474 V520 M328,474 V520" stroke="#2c241b" stroke-width="6"/>
    <path d="M206,378 Q206,356 218,352 Q230,356 230,378 Z" fill="#6e5038"/>
    <path d="M252,378 Q246,368 258,364 L282,364 Q294,368 288,378 Z" fill="#5d4a36"/>
    <!-- 大灶 -->
    <polygon points="540,95 642,95 676,268 506,268" fill="#5a5447"/>
    <polygon points="540,95 556,95 528,268 506,268" fill="#4a4539"/>
    <rect x="496" y="266" width="190" height="18" fill="#6a6455"/>
    <rect x="506" y="284" width="170" height="66" fill="#3a352d"/>
    <rect x="482" y="346" width="194" height="12" fill="#77705f"/>
    <rect x="486" y="358" width="186" height="162" fill="#6a6455"/>
    <g stroke="#4a463c" stroke-width="1.2" fill="none">${bricks}</g>
    <path d="M520,476 L520,420 Q520,392 552,390 L588,390 Q620,392 620,420 L620,476 Z" fill="#17120e"/>
    <path d="M636,476 L636,438 Q636,420 650,420 Q664,420 664,438 L664,476 Z" fill="#1c1712"/>
    <path d="M512,520 L512,500 Q512,488 524,488 L612,488 Q624,488 624,500 L624,520 Z" fill="#14100c"/>
    <path d="M524,516 l14,-10 l16,4 l18,-8 l18,6 l20,-4 l8,12 Z" fill="#3a2c20" stroke-width="1.2"/>
    <!-- 灶上小锅、挂勺 -->
    <path d="M610,346 Q608,326 630,324 Q652,326 650,346 Z" fill="#232120"/><ellipse cx="630" cy="324" rx="20" ry="4" fill="#2e2c2a"/>
    <path d="M684,330 V420 M694,330 V408" stroke="#2a2622" stroke-width="2.4"/>
    <ellipse cx="684" cy="426" rx="6" ry="7" fill="#2a2622"/><path d="M692,330 h6" stroke="#2a2622" stroke-width="3"/>
    <!-- 右墙架子 -->
    <polygon points="${rw(810,330)} ${rw(724,330)} ${rw(724,338)} ${rw(810,338)}" fill="#4a3a2c"/>
    <path d="M760,${shelfY-34} q-12,0 -12,18 q0,16 12,16 q12,0 12,-16 q0,-18 -12,-18 Z" fill="#6e5038"/>
    <rect x="782" y="${shelfY-42}" width="12" height="42" fill="#5a5444"/>
    <!-- 地毯、餐桌 -->
    <polygon points="196,560 520,560 560,640 156,640" fill="#4a241e"/>
    <polygon points="206,566 510,566 546,634 168,634" fill="none" stroke="#7a4a35" stroke-width="1.6" stroke-dasharray="5 4"/>
    <path d="M232,486 L232,604 M478,486 L478,604 M244,486 L240,580 M466,486 L470,580" stroke="#2c241b" stroke-width="8"/>
    <polygon points="232,452 480,452 494,470 218,470" fill="#5a4636"/>
    <rect x="218" y="470" width="276" height="16" fill="#47382b"/>
    <path d="M396,452 L420,452 L424,500 L400,504 Z" fill="#cfc4a6" stroke-width="1.2"/><path d="M402,470 l18,-2 M402,480 l20,-2" stroke="#8a4a3a" stroke-width="1.6"/>
    <rect x="300" y="548" width="56" height="8" fill="#3a2e23"/><path d="M306,556 L302,608 M350,556 L354,608" stroke="#3a2e23" stroke-width="5"/>
    <!-- 水缸 + 水桶 -->
    <path d="M714,496 Q708,560 718,622 L800,622 Q810,560 804,496 Z" fill="#5a4636"/>
    <ellipse cx="759" cy="496" rx="46" ry="11" fill="#3a2e23"/>
    <ellipse cx="759" cy="497" rx="38" ry="7" fill="#3c4a50"/>
    <path d="M712,520 Q759,532 806,520 M712,600 Q759,612 806,600" stroke="#2a2119" stroke-width="5" fill="none"/>
  </g>
  <circle cx="568" cy="440" r="150" fill="url(#k3-warmBig)"/>
  <circle cx="128" cy="${wy(128,190)}" r="60" fill="url(#k3-warmBig)"/>
  <circle cx="128" cy="${wy(128,190)-6}" r="16" fill="url(#k3-warm)"/>
  <path class="flame" d="M128,${wy(128,190)-14} q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>`;
}

/* ---------------- 酒窖（参考图：交叉拱顶 / 左侧圆拱楼梯 / 右侧一排横卧的大酒桶 / 长条地漏） ---------------- */
const W3 = {
  stairs:'M126,520 L126,268 Q128,196 186,192 Q244,196 246,268 L246,520 Z',
  hookX:470,
  // 酒桶：由远到近，桶头朝左前方
  barrels:[1399,1403,1405,1408,1411,1415].map((year,i)=>{ const t=i/5, R=32+t*50;
    return {year, R, hx:414+t*300, hy:(468+t*170)-R}; }),
  wallPts:'292,428 382,428 382,520 292,520',
  tunnel:'M300,520 L300,462 Q302,436 337,432 Q372,436 374,462 L374,520 Z'
};
function w3Barrel(b, open){
  const {hx, hy, R} = b, rx = R*.6, L = R*1.7, k = 'stroke="#15110d" stroke-width="2" stroke-linejoin="round"';
  const top = hy-R, bot = hy+R, x2 = hx+L;
  let staves=''; for(let j=1;j<6;j++){ const y=top+j*R/3; staves+=`<path d="M${hx},${y.toFixed(1)} Q${hx+L/2},${(y+(y<hy?-R*.06:R*.06)).toFixed(1)} ${x2},${(hy+(y-hy)*.9).toFixed(1)}"/>`; }
  return `<g>
    <path d="M${hx},${top} Q${hx+L/2},${top-R*.14} ${x2},${hy-R*.9} L${x2},${hy+R*.9} Q${hx+L/2},${bot+R*.14} ${hx},${bot} Z" fill="#5a3f2a" ${k}/>
    <g stroke="#3e2b1c" stroke-width="1.3" fill="none">${staves}</g>
    ${[.18,.82].map(f=>{ const x=hx+L*f; return `<path d="M${x},${(top-R*.1).toFixed(1)} Q${x+R*.22},${hy} ${x},${(bot+R*.1).toFixed(1)}" stroke="#2a2622" stroke-width="${(R*.12).toFixed(1)}" fill="none"/>
      <path d="M${x},${(top-R*.1).toFixed(1)} Q${x+R*.22},${hy} ${x},${(bot+R*.1).toFixed(1)}" stroke="#6b6458" stroke-width="1.2" fill="none"/>`; }).join('')}
    <path d="M${hx},${top} Q${hx+L*.5},${top-R*.14} ${x2},${hy-R*.9}" stroke="#8a6a4a" stroke-width="2" fill="none" opacity=".6"/>
    <ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${R}" fill="#6e5038" ${k}/>
    <ellipse cx="${hx}" cy="${hy}" rx="${rx*.84}" ry="${R*.86}" fill="none" stroke="#2a2622" stroke-width="${(R*.07).toFixed(1)}"/>
    ${open ? `<ellipse cx="${hx}" cy="${hy}" rx="${rx*.74}" ry="${R*.76}" fill="#0c0907" ${k}/>`
      : `<g stroke="#4e3826" stroke-width="1.1">${[-.5,0,.5].map(f=>`<path d="M${(hx-rx*.8).toFixed(1)},${(hy+R*f).toFixed(1)} H${(hx+rx*.8).toFixed(1)}"/>`).join('')}</g>
         <text x="${hx}" y="${(hy+R*.12).toFixed(1)}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="${(R*.36).toFixed(1)}"
           fill="#e8e1cf" opacity=".85" transform="translate(${hx} ${hy}) scale(.62 1) translate(${-hx} ${-hy})">${b.year}</text>`}
    <rect x="${hx-R*.08}" y="${hy+R*.58}" width="${R*.16}" height="${R*.22}" fill="#8a6a44" ${k}/>
  </g>`;
}
function w3Background(){
  let flags=''; [540,566,604,656].forEach(y=> flags+=`<path d="M0,${y} H828"/>`);
  for(let x=-400;x<=1228;x+=96) flags+=`<path d="M${(410+(x-410)*(520-330)/(709-330)).toFixed(1)},520 L${x},709"/>`;
  let steps=''; for(let i=0;i<9;i++){ const y=506-i*28, x0=132+i*2, x1=224-i*9;
    steps+=`<rect x="${x0}" y="${y}" width="${x1-x0}" height="12" fill="${['#77736a','#6c685f'][i%2]}" stroke="#2a2621" stroke-width="1.2"/><rect x="${x0}" y="${y+12}" width="${x1-x0}" height="16" fill="#4a4740" stroke="none"/>`; }
  let vous=''; for(let i=0;i<=8;i++){ const a=Math.PI*(1-i/8), x=186+68*Math.cos(a), y=268-76*Math.sin(a), x2=186+56*Math.cos(a), y2=268-64*Math.sin(a);
    vous+=`<path d="M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}"/>`; }
  return `
  <defs>
    <filter id="w3-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="41" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="nb"/><feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="1" seed="7" result="nc"/><feDisplacementMap in="nb" in2="nc" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="w3-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.014 0.024" numOctaves="4" seed="27"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.15  0 0 0 0 0.12  1.9 0 0 0 -0.8"/>
    </filter>
    <linearGradient id="w3-vault" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a372e"/><stop offset="1" stop-color="#57534a"/></linearGradient>
    <linearGradient id="w3-bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a665a"/><stop offset="1" stop-color="#77736a"/></linearGradient>
    <linearGradient id="w3-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a463d"/><stop offset="1" stop-color="#5e594d"/></linearGradient>
    <linearGradient id="w3-up" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdd2cf" stop-opacity=".75"/><stop offset="1" stop-color="#cdd2cf" stop-opacity="0"/></linearGradient>
    <clipPath id="w3-clipFloor"><polygon points="0,628 110,520 712,520 828,628 828,709 0,709"/></clipPath>
    <clipPath id="w3-clipWalls"><path d="M0,0 H828 V709 H0 Z"/></clipPath>
    <clipPath id="w3-clipStairs"><path d="${W3.stairs}"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="url(#w3-vault)"/>
  <g filter="url(#w3-rough)" stroke="#1a1712" stroke-width="2" stroke-linejoin="round">
    <!-- 后墙（拱形） -->
    <path d="M110,520 L110,250 Q114,128 260,112 L570,112 Q706,128 712,250 L712,520 Z" fill="url(#w3-bw)"/>
    <g stroke="#57534a" stroke-width="1.2" fill="none">
      ${[150,190,230,270,310,350,390,430,470,510].map((y,i)=>`<path d="M${y<250?160:110},${y} H${y<250?660:712}"/>`+[0,1,2,3,4,5,6,7].map(j=>{ const x=130+j*74+(i%2)*37; return x<712?`<path d="M${x},${y} V${y+40}"/>`:''; }).join('')).join('')}
    </g>
    <!-- 拱券肋 -->
    <path d="M110,520 L110,250 Q114,128 260,112 L570,112 Q706,128 712,250 L712,520" fill="none" stroke="#45423a" stroke-width="14"/>
    <path d="M0,300 Q4,40 250,18 M828,300 Q824,40 578,18 M250,18 Q414,6 578,18" fill="none" stroke="#4a463d" stroke-width="18"/>
    <path d="M30,40 Q200,96 260,112 M798,40 Q628,96 570,112 M414,10 L414,112" fill="none" stroke="#2c2a24" stroke-width="3"/>
    <!-- 侧墙 -->
    <polygon points="0,300 110,250 110,520 0,628" fill="#5c5850"/>
    <polygon points="828,300 712,250 712,520 828,628" fill="#5c5850"/>
    <g stroke="#4a463d" stroke-width="1.2" fill="none">
      ${[330,380,430,480,530].map(y=>`<path d="M0,${y+40} L110,${y}"/><path d="M828,${y+40} L712,${y}"/>`).join('')}
    </g>
    <!-- 左前方石柱 -->
    <rect x="0" y="260" width="34" height="449" fill="#6a665a"/><rect x="28" y="250" width="12" height="459" fill="#4a463d"/>
    <path d="M0,320 H34 M0,400 H34 M0,480 H34 M0,560 H34 M0,640 H34" stroke="#4a463d" stroke-width="1.4"/>
    <!-- 地面 -->
    <polygon points="0,628 110,520 712,520 828,628 828,709 0,709" fill="url(#w3-floor)"/>
    <g clip-path="url(#w3-clipFloor)" stroke="#3a372f" stroke-width="1.4" fill="none">${flags}</g>
    <line x1="110" y1="520" x2="712" y2="520" stroke="#1a1712" stroke-width="3"/>
  </g>
  <rect width="828" height="709" filter="url(#w3-stain)" opacity=".5"/>
  <g filter="url(#w3-rough)" stroke="#1a1712" stroke-width="2" stroke-linejoin="round">
    <!-- 圆拱楼梯口（通往厨房） -->
    <path d="M114,520 L114,268 Q116,184 186,180 Q256,184 258,268 L258,520 Z" fill="#8a867a"/>
    <g stroke="#5a564c" stroke-width="1.6">${vous}</g>
    <path d="${W3.stairs}" fill="#2a2823"/>
    <g clip-path="url(#w3-clipStairs)">${steps}<rect x="126" y="190" width="120" height="200" fill="url(#w3-up)" stroke="none"/>
      <path d="M126,330 L246,240" stroke="#2a2621" stroke-width="2"/></g>
    <!-- 木桶 + 木杵 -->
    <path d="M270,520 L266,474 L306,474 L302,520 Z" fill="#6a5038"/>
    <path d="M267,486 H305 M269,506 H303" stroke="#2a2622" stroke-width="4"/>
    <path d="M288,476 L272,404" stroke="#6a5038" stroke-width="5"/>
    <!-- 松动的砖（母亲挖的地道就在后面） -->
    <polygon points="${W3.wallPts}" fill="#6e6a5e"/>
    <g stroke="#4a463d" stroke-width="1.6" fill="none">
      <path d="M292,450 H382 M292,474 H382 M292,498 H382 M318,428 V450 M352,428 V450 M304,450 V474 M340,450 V474 M372,450 V474 M318,474 V498 M356,474 V498 M306,498 V520 M344,498 V520"/></g>
    <path d="M340,452 l6,4 M366,476 l-5,6" stroke="#2a2621" stroke-width="1.4"/>
    <!-- 壁龛 + 陶壶 -->
    <path d="M404,334 L404,268 Q406,236 432,230 Q458,236 460,268 L460,334 Z" fill="#8a867a"/>
    <path d="M412,330 L412,272 Q414,246 432,240 Q450,246 452,272 L452,330 Z" fill="#2c2a24"/>
    <path d="M424,330 Q416,312 422,298 Q426,290 424,284 L440,284 Q438,290 442,298 Q448,312 440,330 Z" fill="#8a5a3a"/>
    <path d="M422,286 h20" stroke-width="2"/>
    <rect x="398" y="330" width="68" height="8" fill="#8a867a"/>
    <!-- 吊灯铁链 -->
    <path d="M${W3.hookX},0 V146" stroke="#1d1b16" stroke-width="2.6" stroke-dasharray="5 2"/>
    <path d="M${W3.hookX},146 q8,0 8,8 q0,6 -6,6" stroke="#1d1b16" stroke-width="2.4" fill="none"/>
    <!-- 右墙酒瓶架 -->
    <path d="M724,206 L822,214 L822,222 L724,214 Z" fill="#5a4636"/>
    <path d="M740,214 l8,22 M806,220 l-8,22" stroke="#4a3a2c" stroke-width="4"/>
    <path d="M742,206 v-30 q0,-6 4,-8 v-12 h6 v12 q4,2 4,8 v30 Z" fill="#26302a"/>
    <path d="M764,208 v-26 q0,-6 4,-8 v-10 h6 v10 q4,2 4,8 v26 Z" fill="#3a2226"/>
    <rect x="786" y="190" width="28" height="20" fill="#6a5038"/>
    <!-- 地漏：一条长铁栅 -->
    <polygon points="402,524 414,524 440,709 410,709" fill="#1e1b16"/>
    ${[540,560,584,612,644,680].map(y=>{ const t=(y-524)/185; return `<path d="M${(404+8*t).toFixed(1)},${y} H${(420+32*t).toFixed(1)}" stroke="#3a372f" stroke-width="2.2"/>`; }).join('')}
    <!-- 木箱 + 酒瓶（左前） -->
    <rect x="44" y="572" width="96" height="66" fill="#5a4636"/>
    <path d="M44,592 H140 M44,616 H140 M76,572 V638 M108,572 V638" stroke="#3a2e22" stroke-width="2"/>
    <path d="M58,572 v-36 q0,-6 4,-8 v-12 h6 v12 q4,2 4,8 v36 Z" fill="#26302a"/>
    <path d="M80,572 v-30 q0,-6 4,-8 v-10 h6 v10 q4,2 4,8 v30 Z" fill="#3a2226"/>
    <!-- 挂钩 + 抹布（左墙） -->
    <path d="M58,${wy(58,360)} h18 M64,${wy(58,360)} v8 M72,${wy(58,360)} v8" stroke="#2a2622" stroke-width="3"/>
    <path d="M62,${wy(58,360)+6} L60,${wy(58,360)+70} L78,${wy(58,360)+64} L76,${wy(58,360)+6} Z" fill="#8a7f68"/>
  </g>
  <!-- 蛛网 -->
  <g stroke="#cfcab8" stroke-width=".7" fill="none" opacity=".4">
    <path d="M110,250 L156,232 M110,250 L136,290 M110,250 L152,266 M120,246 Q126,262 114,270 M132,240 Q140,268 120,282"/>
    <path d="M712,250 L670,232 M712,250 L684,286 M702,246 Q696,262 708,268"/>
  </g>`;
}
// 酒桶单独一层（盖子打开 / 光照都要在上面叠）
function w3Barrels(){
  const B=W3.barrels, rail=(f,dy)=>B.map(b=>`${(b.hx+b.R*1.7*f).toFixed(1)},${(b.hy+b.R*(1+dy)).toFixed(1)}`).join(' L');
  const posts=B.map(b=>[0,.75].map(f=>{ const x=b.hx+b.R*1.7*f, y=b.hy+b.R*(f?.95:1); return `<path d="M${x.toFixed(1)},${y.toFixed(1)} v${(b.R*.34).toFixed(1)}" stroke="#3a2c20" stroke-width="${(b.R*.18).toFixed(1)}"/>`; }).join('')).join('');
  return `<g filter="url(#w3-rough)" stroke="#15110d" stroke-linejoin="round">${posts}<path d="M${rail(.75,-.02)}" stroke="#4a3a2c" stroke-width="9" fill="none"/></g>
  <g filter="url(#w3-rough)"><path d="M${rail(0,.02)}" stroke="#5a4636" stroke-width="10" fill="none"/>${W3.barrels.map(b=>w3Barrel(b, b.year===1408 && S3.lidOpen)).join('')}</g>`; }

/* ---------------- 场景 DOM ---------------- */
document.getElementById('l2').insertAdjacentHTML('afterend', `
<div id="l3" class="lvroot hidden" data-level="L3">
  <svg id="k3Bg" viewBox="0 0 828 709" pointer-events="none">${k3Background()}</svg>
  <svg id="w3Bg" viewBox="0 0 828 709" pointer-events="none" style="display:none">${w3Background()}</svg>
  <svg id="l3Obj" viewBox="0 0 828 709">
    <defs>
      <radialGradient id="l3-lamp"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".42"/><stop offset=".55" stop-color="#ffb35a" stop-opacity=".12"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
      <radialGradient id="l3-fire"><stop offset="0" stop-color="#ffb34a" stop-opacity=".9"/><stop offset="1" stop-color="#ff7a20" stop-opacity="0"/></radialGradient>
      <radialGradient id="l3-vig" cx="50%" cy="48%" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    </defs>
    <g id="l3Dyn" pointer-events="none"></g>
    <g id="k3Hot">
      <path class="hs" data-obj="k_door" d="${K3.doorO}"/>
      <rect class="hs" data-obj="k_window" x="208" y="150" width="76" height="186"/>
      <rect class="hs" data-obj="k_herbs" x="290" y="96" width="194" height="160"/>
      <rect class="hs" data-obj="k_lamp" x="296" y="330" width="40" height="52"/>
      <rect class="hs" data-obj="k_mortar" x="156" y="348" width="138" height="126"/>
      <rect class="hs" data-obj="k_stove" x="486" y="96" width="196" height="424"/>
      <rect class="hs" data-obj="k_martha" x="600" y="390" width="96" height="182"/>
      <rect class="hs" data-obj="k_scale" x="262" y="404" width="232" height="86"/>
      <rect class="hs" data-obj="k_water" x="704" y="480" width="110" height="146"/>
      <polygon class="hs" data-obj="k_trap" points="${K3.trap}"/>
      <rect class="hs" data-obj="k_shelf" x="716" y="${wy(828-790,330)-60}" width="100" height="70"/>
    </g>
    <g id="w3Hot" style="display:none">
      <path class="hs" data-obj="w_stairs" d="M114,520 L114,268 Q116,184 186,180 Q256,184 258,268 L258,520 Z"/>
      <polygon class="hs" data-obj="w_barrels" points="${(()=>{ const B=W3.barrels, a=B[0], z=B[B.length-1];
        const P=B.flatMap(b=>[[b.hx-b.R*.66, b.hy], [b.hx-b.R*.3, b.hy-b.R-4], [b.hx-b.R*.3, b.hy+b.R+6], [Math.min(828,b.hx+b.R*1.7), b.hy-b.R*.9-4], [Math.min(828,b.hx+b.R*1.7), b.hy+b.R*.9+8]])
          .concat([[828, z.hy-z.R*.9-4], [828, z.hy+z.R*.9+8]]).sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
        const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]), lo=[], up=[];
        P.forEach(p=>{ while(lo.length>1 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); });
        [...P].reverse().forEach(p=>{ while(up.length>1 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); });
        return lo.slice(0,-1).concat(up.slice(0,-1)).map(p=>p[0].toFixed(0)+','+p[1].toFixed(0)).join(' '); })()}"/>
      <polygon class="hs" data-obj="w_wall" points="${W3.wallPts}"/>
      <rect class="hs" data-obj="w_niche" x="398" y="228" width="68" height="112"/>
      <rect class="hs" data-obj="w_crate" x="40" y="512" width="104" height="128"/>
      <rect class="hs" data-obj="w_hook" x="446" y="96" width="50" height="104"/>
    </g>
  </svg>
</div>`);
