/* =====================================================================
   第 6 关 · 夫人寝室（Lady Isabel's Bedchamber）—— 场景美术
   参考图：方正卧室 / 左侧梳妆台 + 椭圆镜 / 中间雄鹿挂毯、尖拱窗、摇篮 / 右侧四柱床 / 前景刺绣绷架
   本作调整：绷架放在左前景，一根金线牵进梳妆台抽屉；右墙是回长廊的小门，门边木钉上挂着那条湿裙子
   镜中世界：梳妆镜里映出的是 1415 年亮着烛光的房间（母亲的剪影伏案写字）
   ===================================================================== */
const b6k = 'stroke="#1a1511" stroke-width="2.4" stroke-linejoin="round"';
const b6s = 'stroke="#1a1511" stroke-width="1.6" stroke-linejoin="round"';
const RW6 = (x,hy)=>[x, 330+(hy-330)*(x-414)/284];      // 右墙：屏幕 x、后墙高度 hy → 点
const LW6 = (x,hy)=>[x, 330+(hy-330)*(414-x)/284];      // 左墙
const q6  = a => a.map(p=>p.map(v=>(+v).toFixed(1)).join(',')).join(' ');

/* ---------------- 几何 ---------------- */
const MR6 = {x:241, y:328, rx:44, ry:62};                // 场景里的梳妆镜（椭圆）
const MZ6 = {x:300, y:200, rx:132, ry:178};              // 镜中世界的局部坐标（= 镜子特写的椭圆）
const MS6 = {sx:MR6.rx/MZ6.rx, sy:MR6.ry/MZ6.ry};
const CR6 = {x:362, y:584};                              // 摇篮（地面中心）
const EMB6 = [[28,428],[154,418],[158,520],[32,530]];    // 刺绣绷架面板四角
const DOOR6 = (()=>{ const a=RW6(708,500), b=RW6(762,500), c=RW6(762,262), d=RW6(708,262);
  return {pts:[a,b,c,d], path:`M${a[0]},${a[1].toFixed(1)} L${b[0]},${b[1].toFixed(1)} L${c[0]},${c[1].toFixed(1)} Q${(c[0]+d[0])/2},${(Math.min(c[1],d[1])-34).toFixed(1)} ${d[0]},${d[1].toFixed(1)} Z`}; })();
const DRESS6 = {x:798, top:RW6(798,214)[1]};

/* ---------------- 音乐盒（5 行音 × 8 列时间） ---------------- */
const ROWS6 = ['G','F','E','D','C'];
const NOTE6 = {C:523, D:587, E:659, F:698, G:784};
const TUNE6 = [2,0,2,3,4,3,2,4];                         // E G E D C D E C —— 母亲的摇篮曲
const MBX6 = c => 175 + c*40, MBY6 = r => 160 + r*32;
function musicBoxArt6(pins, o={}){
  let holes='', cells='', cols='';
  for(let c=0;c<8;c++){
    cols += `<rect id="${o.idp||'z'}-col${c}" x="${MBX6(c)-17}" y="142" width="34" height="164" rx="4" fill="#fff3c0" opacity="0"/>`;
    for(let r=0;r<5;r++){
      holes += `<circle cx="${MBX6(c)}" cy="${MBY6(r)}" r="2" fill="#6a5a34"/>`;
      if(o.cells) cells += `<rect id="z-c${c}-${r}" class="zhot" x="${MBX6(c)-18}" y="${MBY6(r)-15}" width="36" height="30" fill="transparent"/>`;
    }
  }
  const pinArt = pins.map((r,c)=> r==null ? '' : `<g><circle cx="${MBX6(c)}" cy="${MBY6(r)}" r="7" fill="#d8d8cc" ${b6s}/><circle cx="${MBX6(c)-2}" cy="${MBY6(r)-2}" r="2.2" fill="#fff"/></g>`).join('');
  const comb = ROWS6.map((n,r)=>`<rect x="104" y="${MBY6(r)-5}" width="48" height="10" fill="#c9c2a8" ${b6s}/>
    <text x="92" y="${MBY6(r)+5}" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="bold" fill="#e6d9b0">${n}</text>`).join('');
  return `<g>
    <rect x="62" y="104" width="476" height="232" rx="6" fill="#5a3e28" ${b6k}/>
    <rect x="74" y="116" width="452" height="208" rx="4" fill="none" stroke="#7a5a3a" stroke-width="2"/>
    <rect x="152" y="138" width="322" height="172" rx="10" fill="#b39a5a" ${b6k}/>
    <path d="M152,150 H474 M152,298 H474" stroke="#8a7440" stroke-width="2"/>
    ${cols}${holes}
    <rect x="98" y="146" width="10" height="148" fill="#8a8470" ${b6s}/>
    ${comb}
    ${pinArt}
    <path d="M200,318 H420 M420,318 l-10,-6 M420,318 l-10,6" stroke="#c9b48a" stroke-width="2.4" fill="none"/>
    <g ${b6k}><rect x="474" y="212" width="40" height="14" fill="#6a6658"/><circle cx="520" cy="219" r="10" fill="#8a8678"/>
      <path d="M520,219 L548,190" stroke="#6a6658" stroke-width="7" stroke-linecap="round"/><rect x="540" y="168" width="14" height="26" rx="5" fill="#9a7a4e"/></g>
    ${cells}</g>`;
}

/* ---------------- 镜中世界（局部 600×400，可见范围是 MZ6 椭圆） ---------------- */
// o: {uid, pillow:-1|0|1, up:bool}
function mirrorWorld6(o={}){
  const u=o.uid||'m', tilt=(o.pillow==null?-1:o.pillow)*14;
  let pins=''; TUNE6.forEach((r,c)=> pins+=`<circle cx="${(382-c*5.6).toFixed(1)}" cy="${(320+r*3.2).toFixed(1)}" r="1.3" fill="#f2ecd8"/>`);
  // 镜中的母亲：伏案写字（低头）/ 曲终抬头望向镜外
  const mom = `<g transform="translate(${o.up?352:344},${o.up?196:206}) rotate(${o.up?0:6}) scale(1.24)">${CH.draw('isabel', {hold:o.up?'clasp':'write', len:126,
      face: o.up ? {eyes:'open', gaze:[0,.2], mood:'sad'} : {eyes:'down', mood:'neutral'}})}</g>`;
  return `<defs><radialGradient id="mw-${u}"><stop offset="0" stop-color="#ffd890" stop-opacity=".55"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient></defs>
    <rect x="140" y="0" width="320" height="400" fill="#8a6a48"/>
    <path d="M140,60 H460 M140,130 H460 M140,200 H460 M210,0 V60 M330,0 V60 M260,60 V130 M400,60 V130 M190,130 V200 M350,130 V200" stroke="#7a5c3e" stroke-width="1.4"/>
    <rect x="140" y="236" width="320" height="94" fill="#6a4a30"/><path d="M140,236 H460" stroke="#4a3220" stroke-width="2"/>
    <rect x="140" y="330" width="320" height="70" fill="#4e3626"/>
    <circle cx="410" cy="200" r="170" fill="url(#mw-${u})"/>
    <g ${b6s}>
      <path d="M150,40 Q200,60 214,140 L214,330 L150,330 Z" fill="#6b2f28"/>
      <rect x="148" y="250" width="110" height="64" fill="#7a3a30"/><path d="M148,250 H258" stroke="#b39a5a" stroke-width="1.4"/>
      <rect x="204" y="80" width="10" height="250" fill="#4a3424"/>
      <g transform="rotate(${tilt} 222 246)"><rect x="186" y="236" width="72" height="22" rx="10" fill="#e6dcc4"/></g>
      <rect x="386" y="262" width="74" height="8" fill="#4a3424"/><path d="M392,270 V330 M454,270 V330" stroke="#4a3424" stroke-width="5"/>
      <rect x="400" y="252" width="26" height="10" fill="#efe6cc" stroke-width=".8"/>
      <rect x="436" y="222" width="8" height="32" fill="#e3dac0"/>
    </g>
    <path class="flame" d="M440,206 Q445,214 443,219 Q440,223 437,219 Q435,214 440,206 Z" fill="#ffd27a"/>
    ${mom}
    <g ${b6s}>
      <rect x="150" y="336" width="300" height="14" fill="#5a3e2a"/>
      <polygon points="246,350 316,350 324,376 238,376" fill="#3a2a1c"/><polygon points="252,354 310,354 316,372 246,372" fill="#1e1610"/>
      <rect x="338" y="314" width="56" height="22" fill="#6a4a30"/>
      <polygon points="338,314 394,314 400,296 344,296" fill="#7a5a3a"/>
      <rect x="342" y="318" width="44" height="14" fill="#b39a5a" stroke-width=".8"/>
    </g>${pins}`;
}

/* ---------------- 摇篮（局部：原点在地面中心） ---------------- */
function cradleArt6(o={}){
  return `<g ${b6k}>
    <path d="M-66,-6 Q0,12 66,-6" stroke="#3a2a1c" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M-44,-2 L-40,-34 M44,-2 L40,-34" stroke="#4a3424" stroke-width="6"/>
    <rect x="-62" y="-116" width="13" height="84" fill="#4a3424"/>
    <rect x="49" y="-96" width="13" height="64" fill="#4a3424"/>
    <polygon points="-52,-86 52,-86 46,-34 -46,-34" fill="#5a4030"/>
    <path d="M-30,-86 V-34 M-10,-86 V-34 M10,-86 V-34 M30,-86 V-34" stroke="#3e2c1e" stroke-width="1.4"/>
    <path d="M-52,-86 H52" stroke="#6e5240" stroke-width="3"/>
    <path d="M-48,-88 Q0,-98 48,-88" fill="#d8cfb8" stroke-width="1.4"/>
    <path d="M56,-74 l6,-6 l6,6 l-6,6 Z" fill="#b39a5a" stroke-width="1"/>
    <path d="M-56,-116 Q-62,-170 -20,-178" stroke="#4a3424" stroke-width="4" fill="none"/>
    <path d="M-20,-178 Q-70,-150 -70,-60 Q-68,-40 -60,-30 L-56,-110 Q-46,-150 -20,-178 Z" fill="#ddd6c4" opacity=".85" stroke-width="1.2"/>
    <path d="M-20,-178 Q8,-150 14,-96" stroke="#ddd6c4" stroke-width="6" fill="none" opacity=".7"/>
    ${o.deer ? `<use href="#deer" x="-6" y="-114" width="34" height="34" style="color:#9a7a4e" stroke="none"/>` : ''}</g>`;
}

/* ---------------- 手镜（局部：原点在镜面中心） ---------------- */
function hmirrorArt6(){
  return `<g ${b6k}><rect x="-7" y="34" width="14" height="70" rx="5" fill="#8a7448"/><circle cx="0" cy="106" r="7" fill="#8a7448"/>
    <ellipse cx="0" cy="0" rx="32" ry="40" fill="#a88a4e"/><ellipse cx="0" cy="0" rx="25" ry="32" fill="#bcc8cc"/>
    <path d="M-14,-18 Q-6,-26 4,-24" stroke="#eef4f4" stroke-width="3" fill="none"/>
    ${[0,60,120,180,240,300].map(a=>`<circle cx="${(36*Math.cos(a*Math.PI/180)*.88).toFixed(1)}" cy="${(44*Math.sin(a*Math.PI/180)*.9).toFixed(1)}" r="2.6" fill="#d8c080" stroke-width=".8"/>`).join('')}</g>`;
}

/* ---------------- 刺绣上的小烛台（绣线） ---------------- */
function stitchCandle6(x, y, k, lit){
  return `<g>
    <rect x="${x-3*k}" y="${y-12*k}" width="${6*k}" height="${12*k}" fill="none" stroke="#8a7a5c" stroke-width="${1.2*k}" stroke-dasharray="${1.4*k} ${1*k}"/>
    <path d="M${x-6*k},${y} H${x+6*k}" stroke="#8a7a5c" stroke-width="${1.4*k}"/>
    ${lit ? `<path d="M${x},${y-24*k} Q${x+5*k},${y-17*k} ${x+3*k},${y-14*k} Q${x},${y-11*k} ${x-3*k},${y-14*k} Q${x-5*k},${y-17*k} ${x},${y-24*k} Z" fill="#e0b048" stroke="#9a6a1a" stroke-width="${.8*k}"/>`
          : `<path d="M${x},${y-22*k} Q${x+4*k},${y-16*k} ${x},${y-13*k} Q${x-4*k},${y-16*k} ${x},${y-22*k} Z" fill="none" stroke="#b9ae92" stroke-width="${.6*k}" stroke-dasharray="${1*k} ${1*k}"/>`}</g>`;
}

/* ---------------- 背景 ---------------- */
function b6Background(){
  const xTop = x=>414+(x-414)*1.5566, xBot = x=>414+(x-414)*1.9947;
  let ceil=''; for(let x=150;x<=680;x+=38) ceil+=`<path d="M${x},118 L${xTop(x).toFixed(1)},0"/>`;
  const beam = x=>`<polygon points="${x-12},118 ${x+12},118 ${xTop(x+12).toFixed(1)},0 ${xTop(x-12).toFixed(1)},0" fill="#2e241b"/>`;
  let floor=''; for(let x=130;x<=698;x+=44) floor+=`<path d="M${x},520 L${xBot(x).toFixed(1)},709"/>`;
  [538,560,590,628,676].forEach(y=> floor+=`<path d="M0,${y} H828"/>`);
  let back=''; [190,262,334,406,478].forEach((y,i)=>{ back+=`<path d="M130,${y} H698"/>`;
    for(let x=130+(i%2?60:20); x<698; x+=120) back+=`<path d="M${x},${y} V${y+72}"/>`; });
  let lw='', rw=''; [180,260,340,420].forEach(hy=>{ lw+=`<path d="M${q6([LW6(0,hy),LW6(130,hy)])}"/>`; rw+=`<path d="M${q6([RW6(698,hy),RW6(828,hy)])}"/>`; });
  const win = 'M394,392 L394,226 Q396,196 418,184 Q440,196 442,226 L442,392 Z';
  let lat=''; for(let k=-6;k<8;k++) lat+=`<path d="M${394+k*12},180 L${394+k*12+70},400 M${442-k*12},180 L${442-k*12-70},400"/>`;
  const sc = LW6(44,300);
  const bedPost = (x,y0,y1,w)=>`<rect x="${x-w/2}" y="${y0}" width="${w}" height="${y1-y0}" fill="#3e2c1e"/><circle cx="${x}" cy="${y0-6}" r="${w*.7}" fill="#3e2c1e"/>`;
  return `
  <defs>
    <filter id="b6-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="83" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="nb"/><feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="1" seed="7" result="nc"/><feDisplacementMap in="nb" in2="nc" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="b6-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="29"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0 0.13  1.9 0 0 0 -0.8"/>
    </filter>
    <filter id="b6-blur"><feGaussianBlur stdDeviation="4"/></filter>
    <linearGradient id="b6-bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5446"/><stop offset="1" stop-color="#4e4a3e"/></linearGradient>
    <linearGradient id="b6-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3028"/><stop offset="1" stop-color="#4a3e32"/></linearGradient>
    <linearGradient id="b6-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3440"/><stop offset=".7" stop-color="#55616a"/><stop offset="1" stop-color="#7a8488"/></linearGradient>
    <linearGradient id="b6-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8d4dc" stop-opacity=".16"/><stop offset="1" stop-color="#c8d4dc" stop-opacity="0"/></linearGradient>
    <radialGradient id="b6-warm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <clipPath id="b6-clipWin"><path d="${win}"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="#221c16"/>
  <g filter="url(#b6-rough)" ${b6s}>
    <polygon points="0,0 828,0 828,21 698,118 130,118 0,21" fill="#2a221b"/>
    <g stroke="#1e1812" stroke-width="1.2" fill="none">${ceil}</g>
    ${beam(258)}${beam(570)}
    <rect x="130" y="112" width="568" height="10" fill="#2e241b"/>
    <rect x="130" y="118" width="568" height="402" fill="url(#b6-bw)"/>
    <g stroke="#48433a" stroke-width="1" fill="none">${back}</g>
    <polygon points="0,21 130,118 130,520 0,607" fill="#4a463b"/>
    <g stroke="#3e3a32" stroke-width="1" fill="none">${lw}</g>
    <polygon points="828,21 698,118 698,520 828,607" fill="#47433a"/>
    <g stroke="#3c3830" stroke-width="1" fill="none">${rw}</g>
    <polygon points="0,607 130,520 698,520 828,607 828,709 0,709" fill="url(#b6-floor)"/>
    <g stroke="#2a221c" stroke-width="1.2" fill="none">${floor}</g>
    <path d="M130,520 H698" stroke="#1a1511" stroke-width="2.4"/>
    <!-- 地毯 -->
    <polygon points="236,592 594,592 652,690 176,690" fill="#4e2622"/>
    <polygon points="250,600 580,600 630,682 198,682" fill="none" stroke="#8a5a40" stroke-width="2" stroke-dasharray="6 4"/>
    <ellipse cx="414" cy="640" rx="70" ry="16" fill="none" stroke="#8a5a40" stroke-width="2"/>
    <!-- 吊灯（没点） -->
    <path d="M414,0 V56" stroke="#15110d" stroke-width="2"/>
    <path d="M414,56 L352,94 M414,56 L476,94 M414,56 L388,98 M414,56 L440,98" stroke="#15110d" stroke-width="1.4"/>
    <ellipse cx="414" cy="96" rx="64" ry="9" fill="none" stroke="#15110d" stroke-width="5"/>
    ${[-56,-34,-11,11,34,56].map((d,i)=>`<rect x="${414+d-3}" y="${(i%5===0?84:i%2?92:88)}" width="6" height="12" fill="#cfc6ae" stroke="#15110d" stroke-width=".8"/>`).join('')}
    <!-- 左墙烛台 -->
    <path d="M${sc[0]},${sc[1]+16} h-10 v-14" stroke="#221e1a" stroke-width="3" fill="none"/>
    <rect x="${sc[0]-6}" y="${sc[1]-10}" width="9" height="26" fill="#e3dac0"/>
    <!-- 雄鹿挂毯 -->
    <path d="M310,196 H376" stroke="#15110d" stroke-width="4"/>
    <path d="M314,198 H372 V300 L343,312 L314,300 Z" fill="#5a2622"/>
    <rect x="320" y="204" width="46" height="90" fill="none" stroke="#b39a5a" stroke-width="1.2"/>
    <use href="#deer" x="324" y="214" width="38" height="38" style="color:#b39a5a" stroke="none"/>
    <path d="M343,262 q-8,6 0,14 q8,-8 0,-14 M336,276 h14" stroke="#9a6a5a" stroke-width="1.6" fill="none"/>
    <!-- 窗 -->
    <path d="M386,398 L386,224 Q390,186 418,174 Q446,186 450,224 L450,398 Z" fill="#5e594c"/>
    <path d="${win}" fill="url(#b6-sky)"/>
    <g clip-path="url(#b6-clipWin)" stroke="none">
      <circle cx="432" cy="214" r="7" fill="#e6e4d6" opacity=".9"/>
      <path d="M394,352 Q418,344 442,350 V392 H394 Z" fill="#45525a"/>
      <rect x="394" y="360" width="48" height="32" fill="#5e6c74"/>
      <path d="M422,360 V316 H430 V360 Z M420,316 L426,300 L432,316 Z" fill="#232b30"/>
      <rect x="424.6" y="324" width="2.8" height="4" fill="#b23a2e"/>
      <rect x="394" y="368" width="48" height="6" fill="#c2c8c6" opacity=".25"/>
      <g stroke="#1a1f24" stroke-width="1" opacity=".5">${lat}</g>
    </g>
    <path d="M418,184 V392 M394,290 H442" stroke="#1a1511" stroke-width="3" fill="none"/>
    <rect x="382" y="392" width="72" height="8" fill="#6a6555"/>
    <!-- 梳妆台 + 椭圆镜 -->
    <path d="M${MR6.x-36},392 L${MR6.x-30},428 M${MR6.x+36},392 L${MR6.x+30},428" stroke="#3a2a1c" stroke-width="6"/>
    <rect x="${MR6.x-24}" y="394" width="48" height="10" fill="#4a3424"/>
    <ellipse cx="${MR6.x}" cy="${MR6.y}" rx="${MR6.rx+9}" ry="${MR6.ry+9}" fill="#4a3424"/>
    <ellipse cx="${MR6.x}" cy="${MR6.y}" rx="${MR6.rx+4}" ry="${MR6.ry+4}" fill="none" stroke="#7a5a3a" stroke-width="1.6"/>
    <path d="M${MR6.x-22},${MR6.y-MR6.ry-6} Q${MR6.x},${MR6.y-MR6.ry-34} ${MR6.x+22},${MR6.y-MR6.ry-6} Q${MR6.x},${MR6.y-MR6.ry-16} ${MR6.x-22},${MR6.y-MR6.ry-6} Z" fill="#4a3424"/>
    <circle cx="${MR6.x}" cy="${MR6.y-MR6.ry-24}" r="5" fill="#7a5a3a"/>
    <rect x="160" y="426" width="164" height="10" fill="#4e3828"/>
    <rect x="166" y="436" width="152" height="22" fill="#3e2c1e"/>
    <rect x="208" y="439" width="64" height="16" fill="#4a3424"/><circle cx="240" cy="447" r="2.6" fill="#a88a4e"/>
    <path d="M172,458 L170,528 M312,458 L314,528 M180,458 L180,516 M304,458 L304,516" stroke="#3a2a1c" stroke-width="6"/>
    <g><polygon points="168,424 188,418 188,426 168,428" fill="#d8cfb8"/><polygon points="188,418 208,424 208,428 188,426" fill="#cfc5ab"/>
      <path d="M172,423 h12 M192,421 h12" stroke="#7a6a58" stroke-width=".8"/></g>
    <g><rect x="282" y="410" width="34" height="16" fill="#5a3e28"/><polygon points="282,410 316,410 320,400 286,400" fill="#6a4a30"/>
      <rect x="286" y="413" width="26" height="9" fill="#b39a5a" stroke-width=".7"/></g>
    <!-- 梳妆凳 -->
    <rect x="202" y="486" width="72" height="16" rx="5" fill="#5a2a24"/>
    <path d="M208,502 L206,552 M268,502 L270,552 M220,502 V540 M256,502 V540" stroke="#3a2a1c" stroke-width="5"/>
    <!-- 四柱床 -->
    ${bedPost(496,190,466,9)}${bedPost(662,190,466,9)}
    <rect x="490" y="186" width="178" height="16" fill="#4a3424"/>
    <path d="M490,202 q15,12 30,0 q15,12 30,0 q15,12 30,0 q15,12 30,0 q15,12 30,0 q14,12 28,0" fill="#5a2622" stroke-width="1"/>
    <rect x="500" y="226" width="158" height="200" fill="#3a2a20"/>
    <path d="M500,226 H658 M500,300 H658" stroke="#2a1e16" stroke-width="1.4"/>
    <polygon points="472,452 690,452 710,520 452,520" fill="#6b2f28"/>
    <polygon points="452,520 710,520 712,596 450,596" fill="#5a2622"/>
    <path d="M452,520 H710 M456,588 H708" stroke="#b39a5a" stroke-width="1.6"/>
    <path d="M470,452 Q474,520 466,596 L488,596 Q492,520 486,452 Z" fill="#d6ccb4" opacity=".55"/>
    <rect x="452" y="166" width="262" height="22" fill="#4a3424"/>
    <path d="M452,188 q16,14 32,0 q16,14 32,0 q16,14 32,0 q16,14 32,0 q16,14 32,0 q16,14 32,0 q16,14 32,0 q17,14 34,0" fill="#5a2622" stroke-width="1"/>
    ${bedPost(458,170,606,12)}${bedPost(708,170,606,12)}
    <path d="M466,190 Q500,280 476,470 Q470,540 482,600 L500,600 Q488,520 498,440 Q512,300 494,190 Z" fill="#6b2f28"/>
    <path d="M700,190 Q666,280 690,470 Q696,540 684,600 L666,600 Q678,520 668,440 Q654,300 672,190 Z" fill="#6b2f28"/>
    <path d="M472,404 q18,8 30,-4 M694,404 q-18,8 -30,-4" stroke="#b39a5a" stroke-width="3" fill="none"/>
    <!-- 右墙：回长廊的门 + 挂着的湿裙子 -->
    <path d="${DOOR6.path}" fill="#3e3024"/>
    <path d="M${q6([RW6(735,270),RW6(735,500)])}" stroke="#2a2018" stroke-width="1.6"/>
    <path d="M${q6([RW6(708,330),RW6(762,330)])} M${q6([RW6(708,450),RW6(762,450)])}" stroke="#15110d" stroke-width="4"/>
    <circle cx="${RW6(752,390)[0]}" cy="${RW6(752,390)[1].toFixed(1)}" r="3.4" fill="#8a7448"/>
    <circle cx="${DRESS6.x}" cy="${DRESS6.top.toFixed(1)}" r="4" fill="#2a2018"/>
    <path d="M${DRESS6.x},${DRESS6.top+2} L${DRESS6.x-14},${DRESS6.top+30} M${DRESS6.x},${DRESS6.top+2} L${DRESS6.x+14},${DRESS6.top+30}" stroke="#2a2018" stroke-width="2"/>
    <path d="M${DRESS6.x-14},${DRESS6.top+30} Q${DRESS6.x-20},${DRESS6.top+60} ${DRESS6.x-12},${DRESS6.top+96} Q${DRESS6.x-30},${DRESS6.top+200} ${DRESS6.x-24},${DRESS6.top+300}
      L${DRESS6.x+28},${DRESS6.top+306} Q${DRESS6.x+30},${DRESS6.top+200} ${DRESS6.x+14},${DRESS6.top+96} Q${DRESS6.x+20},${DRESS6.top+60} ${DRESS6.x+14},${DRESS6.top+30} Z" fill="#5a2c26"/>
    <path d="M${DRESS6.x-27},${DRESS6.top+250} Q${DRESS6.x},${DRESS6.top+262} ${DRESS6.x+29},${DRESS6.top+252} L${DRESS6.x+28},${DRESS6.top+306} L${DRESS6.x-24},${DRESS6.top+300} Z" fill="#2e1c1a"/>
    <path d="M${DRESS6.x-12},${DRESS6.top+96} Q${DRESS6.x},${DRESS6.top+102} ${DRESS6.x+14},${DRESS6.top+96}" stroke="#b39a5a" stroke-width="2" fill="none"/>
    <!-- 刺绣绷架（左前景） -->
    <path d="M44,532 L30,690 M146,524 L160,690 M30,690 h-18 M160,690 h18 M38,610 L152,606" stroke="#3a2a1c" stroke-width="8" fill="none"/>
    <polygon points="${q6(EMB6)}" fill="#4a3424"/>
    <polygon points="${q6([[36,436],[146,427],[150,512],[40,521]])}" fill="#d6ccb0"/>
    <g transform="translate(94,486) rotate(-4)"><path d="M0,-14 q-10,4 -8,14 q2,8 8,6 q6,2 8,-6 q2,-10 -8,-14 Z" fill="none" stroke="#8a3a30" stroke-width="2"/>
      <path d="M0,6 V26 M0,16 l-8,-4 M0,20 l8,-4" stroke="#5a6a3a" stroke-width="1.6"/></g>
    <text x="94" y="516" transform="rotate(-4 94 516)" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="6.4" fill="#6a5a44">As it burned on the last night.</text>
  </g>
  <rect width="828" height="709" filter="url(#b6-stain)" opacity=".42" pointer-events="none"/>
  <polygon points="394,392 442,392 520,709 330,709" fill="url(#b6-shaft)"/>
  <circle cx="${sc[0]-1}" cy="${sc[1]-18}" r="80" fill="url(#b6-warm)" opacity=".8"/>
  <path class="flame" d="M${sc[0]-1.5},${sc[1]-26} q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>
  <path d="M154,432 Q182,452 206,447" stroke="#c9a040" stroke-width="1.2" fill="none" opacity=".9"/>
  <path d="M${DRESS6.x-20},${DRESS6.top+310} q2,10 0,16 M${DRESS6.x+6},${DRESS6.top+312} q2,14 0,22" stroke="#7a8a90" stroke-width="1.6" fill="none" opacity=".6"/>
  <ellipse cx="${DRESS6.x-4}" cy="${(RW6(798,520)[1]+56).toFixed(1)}" rx="30" ry="6" fill="#55646b" opacity=".45"/>`;
}

/* ---------------- 场景 DOM ---------------- */
document.getElementById('l5').insertAdjacentHTML('afterend', `
<div id="l6" class="lvroot hidden" data-level="L6">
  <svg id="b6Bg" viewBox="0 0 828 709" pointer-events="none">${b6Background()}</svg>
  <svg id="l6Obj" viewBox="0 0 828 709">
    <defs>
      <clipPath id="b6-clipMirror"><ellipse cx="${MR6.x}" cy="${MR6.y}" rx="${MR6.rx}" ry="${MR6.ry}"/></clipPath>
      <radialGradient id="b6-mglow"><stop offset="0" stop-color="#ffd890" stop-opacity=".35"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>
      <radialGradient id="b6-vig" cx="50%" cy="46%" r="72%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
    </defs>
    <g id="l6Dyn" pointer-events="none"></g>
    <g id="b6Hot">
      <polygon class="hs" data-obj="emb" points="${q6(EMB6)}"/>
      <rect class="hs" data-obj="emb" x="24" y="530" width="140" height="160"/>
      <rect class="hs" data-obj="table" x="160" y="426" width="164" height="100"/>
      <polygon class="hs" data-obj="cradle" id="b6HoleHot" style="display:none" points="${CR6.x-60},${CR6.y-26} ${CR6.x+60},${CR6.y-26} ${CR6.x+78},${CR6.y+16} ${CR6.x-78},${CR6.y+16}"/>
      <g id="b6CrHot" transform="translate(${CR6.x},${CR6.y})"><path class="hs" data-obj="cradle" d="M-70,12 V-64 Q-72,-156 -20,-182 Q-2,-168 2,-120 L64,-100 L68,12 Z"/></g>
      <rect class="hs" data-obj="diary" x="164" y="406" width="48" height="24"/>
      <rect class="hs" data-obj="mbox" x="278" y="396" width="44" height="32"/>
      <ellipse class="hs" data-obj="mirror" cx="${MR6.x}" cy="${MR6.y}" rx="${MR6.rx+8}" ry="${MR6.ry+8}"/>
      <rect class="hs" data-obj="tapestry" x="312" y="194" width="64" height="118"/>
      <path class="hs" data-obj="window" d="M386,398 L386,224 Q390,186 418,174 Q446,186 450,224 L450,398 Z"/>
      <rect class="hs" data-obj="bed" x="452" y="166" width="262" height="440"/>
      <path class="hs" data-obj="door" d="${DOOR6.path}"/>
      <rect class="hs" data-obj="dress" x="${DRESS6.x-32}" y="${DRESS6.top-8}" width="62" height="320"/>
      <rect class="hs" data-obj="chand" x="346" y="40" width="136" height="70"/>
      <rect class="hs" data-obj="rug" x="200" y="600" width="420" height="90"/>
    </g>
  </svg>
</div>`);
document.head.insertAdjacentHTML('beforeend', `<style>
  .b6rock{transform-box:fill-box;transform-origin:50% 100%;animation:b6rock 1.5s ease-in-out infinite alternate}
  @keyframes b6rock{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
  .b6slide{transition:transform 1.6s ease-in-out}
</style>`);
