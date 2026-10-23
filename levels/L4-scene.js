/* =====================================================================
   第 4 关 · 磨坊（The Watermill）—— 场景美术
   两个场景：磨坊外（雾中麦田、水车、稻草人、马车）/ 磨坊内（齿轮、磨盘、面粉袋、木签）
   ===================================================================== */
const m4k = 'stroke="#1a1511" stroke-width="2" stroke-linejoin="round"';
const m4s = 'stroke="#1a1511" stroke-width="1.4" stroke-linejoin="round"';

/* ---------------- 共享：齿轮、乌鸦、稻草人、小鞋、提灯 ---------------- */
function gearArt(r, teeth, fill, opt={}){
  const tH = Math.max(6, r*.16), tW = Math.PI*2*r/teeth*.5;
  let t=''; for(let i=0;i<teeth;i++) t+=`<rect x="${(-tW/2).toFixed(1)}" y="${(-r-tH+1).toFixed(1)}" width="${tW.toFixed(1)}" height="${(tH+2).toFixed(1)}" rx="1.5" transform="rotate(${(360/teeth*i).toFixed(2)})"/>`;
  const spokes = r>40 ? [0,60,120].map(a=>`<rect x="-4" y="${-r*.72}" width="8" height="${r*1.44}" rx="3" transform="rotate(${a})" fill="${opt.dark||'#3a2a1c'}"/>`).join('') : '';
  return `<g fill="${fill}" ${m4s}>${t}</g>
    <circle r="${r}" fill="${fill}" ${m4s}/>
    ${r>40?`<circle r="${(r*.78).toFixed(1)}" fill="${opt.dark||'#3a2a1c'}" stroke="none"/>${spokes}`:`<circle r="${(r*.55).toFixed(1)}" fill="none" stroke="${opt.dark||'#3a2a1c'}" stroke-width="2"/>`}
    <circle r="${Math.max(5, r*.16).toFixed(1)}" fill="${opt.hub||'#2a2622'}" ${m4s}/>
    ${opt.crack?`<path d="M${r*.2},${-r*.1} L${r*.55},${-r*.42} L${r*.62},${-r*.62} L${r+4},${-r-4}" stroke="#0c0907" stroke-width="3" fill="none"/>`:''}`;
}
const crowArt = (x,y,s=1,flip=false)=>`<g transform="translate(${x},${y}) scale(${flip?-s:s},${s})">
  <path d="M-10,8 Q-14,-2 -8,-8 Q-4,-14 4,-12 Q8,-11 9,-6 L16,-6 L9,-3 Q12,4 8,10 L14,16 L4,12 L-6,14 Z" fill="#141210"/>
  <circle cx="4" cy="-8" r="1.3" fill="#b8a07a"/><path d="M-2,12 l-1,6 M3,12 l1,6" stroke="#141210" stroke-width="1.4"/></g>`;
function scarecrowArt(withCrows){
  // 参考图：尖顶宽檐破帽、粗麻布袋头（缝线眼和嘴，没有表情）、破烂长外套、袖口和领口支着稻草
  return `<g ${m4k}>
    <path d="M720,330 V612" stroke="#4a3a2a" stroke-width="7"/>
    <path d="M660,404 L782,398" stroke="#4a3a2a" stroke-width="6"/>
    <path d="M692,396 Q684,452 690,520 L700,516 L704,530 L714,518 L722,534 L730,516 L740,528 L746,512 L754,518 Q760,452 750,394 Q722,386 692,396 Z" fill="#4e4232"/>
    <path d="M660,400 L694,394 L696,424 L686,430 L680,424 L672,432 L664,420 Z" fill="#4e4232"/>
    <path d="M782,396 L748,392 L748,422 L758,428 L764,420 L772,430 L780,418 Z" fill="#4e4232"/>
    <path d="M664,420 l-10,6 l8,1 l-8,8 l12,-5 l-2,8 l8,-10 M778,418 l10,6 l-8,1 l8,8 l-12,-5 l2,8 l-8,-10" stroke="#b39a5a" stroke-width="1.8" fill="none"/>
    <path d="M706,400 L716,470 M738,400 L730,470 M698,470 Q722,478 748,468" stroke="#3a3024" stroke-width="1.6" fill="none"/>
    <rect x="726" y="440" width="18" height="14" fill="#5e5038"/><path d="M728,444 h14" stroke="#3a3024" stroke-width="1.2"/>
    <path d="M708,388 l-6,10 M714,390 l-3,10 M732,390 l3,10 M738,388 l6,10" stroke="#c4a860" stroke-width="1.8"/>
    <path d="M700,370 Q698,344 720,340 Q742,344 740,370 Q740,392 720,394 Q700,392 700,370 Z" fill="#a8956a"/>
    <path d="M704,360 Q720,366 736,360 M702,376 Q720,382 738,376" stroke="#8a7a52" stroke-width="1" fill="none"/>
    <path d="M708,364 l7,6 M715,364 l-7,6 M726,364 l7,6 M733,364 l-7,6" stroke="#1a1511" stroke-width="2"/>
    <path d="M708,382 H732 M711,379 v6 M716,379 v6 M721,379 v6 M726,379 v6 M731,379 v6" stroke="#1a1511" stroke-width="1.4"/>
    <path d="M704,388 Q720,396 736,388 L736,394 Q720,400 704,394 Z" fill="#7a6a48"/>
    <path d="M686,348 Q720,336 756,346 Q748,354 720,352 Q694,354 686,348 Z" fill="#2e2620"/>
    <path d="M704,346 L712,312 Q718,298 732,292 L740,286 L734,300 Q730,320 738,346 Z" fill="#2e2620"/>
    <path d="M708,338 Q722,334 736,338" stroke="#5a4a36" stroke-width="3" fill="none"/>
  </g>${withCrows ? crowArt(666,388,1.2)+crowArt(776,382,1.2,true)+crowArt(728,282,1.3)+crowArt(700,396,1.05,true) : ''}`;
}
const shoeArt = (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})" ${m4s}>
  <path d="M-12,4 Q-12,-6 -4,-7 L2,-7 Q4,-1 10,0 Q16,1 16,5 L16,7 L-12,7 Z" fill="#6a4a30"/>
  <path d="M-4,-7 Q-1,-2 2,-7" fill="none"/><path d="M-12,7 H16" stroke-width="2"/></g>`;
function eLampArt(lit){
  return `<g ${m4k}>
    <path d="M-10,-34 Q0,-50 10,-34" fill="none" stroke-width="2.6"/>
    <path d="M-14,-30 L14,-30 L9,-35 L-9,-35 Z" fill="#3a3530"/>
    <rect x="-12" y="-30" width="24" height="34" fill="${lit?'#f2d38a':'#4a4a42'}"/>
    <path d="M-12,-30 V4 M12,-30 V4" stroke-width="2.4"/>
    <text x="0" y="-6" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="bold" fill="${lit?'#5a3a18':'#1a1511'}" stroke="none">E</text>
    ${lit?`<path d="M0,-26 Q4,-20 2,-16 Q0,-14 -2,-16 Q-4,-20 0,-26 Z" fill="#fff3c0" stroke="none" opacity=".8"/>`:''}
    <path d="M-15,4 L15,4 L11,11 L-11,11 Z" fill="#3a3530"/></g>`;
}

/* ---------------- 磨坊外 ---------------- */
const M4 = {
  wheel:{x:588, y:356, r:68},
  tunnel:'M44,676 L44,610 Q46,566 102,556 Q158,566 160,610 L160,676 Z',
  door:'M378,412 L378,362 Q380,342 394,338 Q408,342 410,362 L410,412 Z'
};
function m4Wheel(){
  const {r} = M4.wheel; let s='';
  for(let i=0;i<16;i++) s+=`<rect x="-5" y="${-r-12}" width="10" height="16" fill="#4a3a2a" transform="rotate(${i*22.5})"/>`;
  for(let i=0;i<8;i++) s+=`<rect x="-3" y="${-r+6}" width="6" height="${r*2-12}" fill="#3e3022" transform="rotate(${i*22.5})"/>`;
  return `<g ${m4s}>${s}<circle r="${r}" fill="none" stroke="#3e3022" stroke-width="9"/><circle r="${r}" fill="none" stroke-width="1.2"/>
    <circle r="${r-9}" fill="none" stroke-width="1.2"/><circle r="12" fill="#2a2622"/></g>`;
}
function m4OutBackground(){
  let wheat=''; for(let i=0;i<120;i++){ const x=470+(i*61)%360, y=450+(i*37)%250, h=14+(i%5)*4;
    wheat+=`<path d="M${x},${y} q${(i%3)-1},${-h*.6} ${(i%5)-2},${-h}"/>`; }
  let wheatHeads=''; for(let i=0;i<70;i++){ const x=476+(i*47)%350, y=444+(i*53)%240;
    wheatHeads+=`<ellipse cx="${x}" cy="${y}" rx="2.4" ry="5" transform="rotate(${(i%7)*6-18} ${x} ${y})"/>`; }
  return `
  <defs>
    <filter id="m4-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="51" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="m4-blur"><feGaussianBlur stdDeviation="3"/></filter>
    <linearGradient id="m4-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a8385"/><stop offset=".6" stop-color="#9ea4a3"/><stop offset="1" stop-color="#b3b6b1"/></linearGradient>
    <linearGradient id="m4-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e6b58"/><stop offset="1" stop-color="#4e4a3c"/></linearGradient>
    <linearGradient id="m4-wheat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8935a"/><stop offset="1" stop-color="#7e6a3c"/></linearGradient>
    <linearGradient id="m4-fogband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ccc7" stop-opacity="0"/><stop offset=".5" stop-color="#c9ccc7" stop-opacity=".55"/><stop offset="1" stop-color="#c9ccc7" stop-opacity="0"/></linearGradient>
    <clipPath id="m4-clipTunnel"><path d="${M4.tunnel}"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="url(#m4-sky)"/>
  <!-- 远景：雾里的城堡与树 -->
  <g fill="#8e9595" opacity=".9">
    <path d="M110,330 L110,250 L124,250 L124,232 L132,232 L132,250 L150,250 L150,214 L158,196 L166,214 L166,250 L184,250 L184,170 L190,150 L196,170 L196,250 L214,250 L214,206 L222,192 L230,206 L230,250 L250,250 L250,228 L262,228 L262,250 L290,250 L290,330 Z"/>
  </g>
  <g fill="#838b8c">
    <path d="M250,360 L262,300 L274,360 Z M268,360 L282,286 L296,360 Z M640,330 L652,270 L664,330 Z M660,330 L676,250 L692,330 Z M760,340 L772,290 L784,340 Z"/>
  </g>
  <rect x="0" y="300" width="828" height="90" fill="url(#m4-fogband)"/>
  <!-- 地面 -->
  <path d="M0,412 Q200,400 420,410 Q640,420 828,404 V709 H0 Z" fill="url(#m4-ground)"/>
  <g filter="url(#m4-rough)" ${m4k}>
    <!-- 枯树 -->
    <path d="M24,709 L30,420 Q34,300 22,200 M30,330 Q70,280 120,250 M28,260 Q60,210 112,170 M26,200 Q30,140 8,90 M94,262 Q120,236 148,236 M80,196 Q110,170 150,170 M60,226 Q50,190 70,150" stroke="#3a342c" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M30,330 Q70,280 120,250 M28,260 Q60,210 112,170" stroke="#3a342c" stroke-width="3" fill="none"/>
    <!-- 磨坊 -->
    <path d="M286,412 L286,330 L350,302 L350,412 Z" fill="#7c776a"/>
    <path d="M280,334 L352,298 L356,306 L284,342 Z" fill="#4a4038"/>
    <rect x="340" y="256" width="182" height="156" fill="#857f70"/>
    <path d="M326,264 L430,196 L536,264 Z" fill="#4a4038"/>
    <path d="M336,262 L430,202 L526,262" fill="none" stroke="#3a322a" stroke-width="1.2"/>
    <rect x="470" y="168" width="54" height="244" fill="#8a8474"/>
    <path d="M462,178 L497,138 L532,178 Z" fill="#4a4038"/>
    <g stroke="#6a6558" stroke-width="1.2" fill="none">
      <path d="M340,290 H470 M340,330 H470 M340,370 H470 M470,210 H524 M470,250 H524 M470,290 H524 M470,330 H524 M470,370 H524"/>
      <path d="M380,256 V290 M430,290 V330 M370,330 V370 M440,370 V412 M497,168 V210 M484,250 V290 M510,330 V370"/>
    </g>
    <path d="${M4.door}" fill="#3e3125"/>
    <path d="M394,340 V412 M378,376 H410" stroke="#2a2119" stroke-width="1.6"/>
    <path d="M436,328 L436,302 Q442,292 448,302 L448,328 Z M490,236 L490,214 Q496,206 502,214 L502,236 Z" fill="#2a2a28"/>
    <!-- 水槽与水闸 -->
    <path d="M700,282 V412 M760,282 V412" stroke="#4a3a2a" stroke-width="6"/>
    <path d="M598,280 L828,272 L828,288 L600,296 Z" fill="#5a4636"/>
    <path d="M600,296 L828,288" stroke-width="1.2"/>
    <rect x="636" y="252" width="34" height="46" fill="#4a3a2a"/>
    <rect x="642" y="256" width="22" height="38" fill="#6a5440"/>
    <path d="M642,268 H664 M642,280 H664" stroke="#3a2e22" stroke-width="1.4"/>
    <circle cx="653" cy="250" r="7" fill="#2a2622"/><rect x="649" y="246" width="8" height="8" fill="#0c0a08" stroke="none"/>
    <!-- 水车 -->
    <g transform="translate(${M4.wheel.x},${M4.wheel.y})"><g id="m4Wheel">${m4Wheel()}</g></g>
    <path d="M520,356 H576" stroke="#2a2622" stroke-width="7"/>
    <!-- 水渠 -->
    <path d="M270,412 L680,412 L690,440 L262,440 Z" fill="#6a6658"/>
    <path d="M300,420 Q420,416 560,424 Q620,428 676,424 L684,434 L268,434 Z" fill="#5f7680"/>
    <path d="M330,426 q20,-3 40,0 M450,424 q24,-3 48,0 M580,428 q20,-3 40,0" stroke="#a9bec2" stroke-width="1.4" fill="none"/>
    <!-- 小路 -->
    <path d="M378,412 L410,412 L470,709 L300,709 Z" fill="#7a7258" stroke="none"/>
    <path d="M378,412 L300,709 M410,412 L470,709" stroke="#5a5440" stroke-width="1.4" fill="none"/>
    <!-- 麦田 -->
    <path d="M462,452 Q600,430 828,440 V709 H520 Q500,580 462,452 Z" fill="url(#m4-wheat)"/>
    <g stroke="#6a5830" stroke-width="1.4" fill="none">${wheat}</g>
    <g fill="#c4ac68" stroke="#6a5830" stroke-width=".8">${wheatHeads}</g>
    <!-- 马车 -->
    <path d="M246,560 L246,312 M252,316 L176,316 M246,346 L218,316" stroke="#3a2e22" stroke-width="7" fill="none"/>
    <path d="M186,316 v12 q0,6 -5,8" stroke="#1a1511" stroke-width="2.4" fill="none"/>
    <path d="M62,382 L232,374 L236,440 L58,448 Z" fill="#5a4636"/>
    <path d="M62,404 L234,396 M60,426 L235,418" stroke="#3a2e22" stroke-width="2"/>
    <path d="M100,380 V446 M150,378 V444 M200,376 V442" stroke="#3a2e22" stroke-width="1.6"/>
    <path d="M58,448 L46,382 M236,440 L246,374" stroke="#4a3a2a" stroke-width="5"/>
    <path d="M232,430 L320,466 M232,416 L322,452" stroke="#4a3a2a" stroke-width="5"/>
    <g transform="translate(108,468)">
      <circle r="44" fill="none" stroke="#4a3a2a" stroke-width="8"/>
      ${[0,30,60,90,120,150].map(a=>`<rect x="-2.5" y="-40" width="5" height="80" fill="#4a3a2a" transform="rotate(${a})" stroke="none"/>`).join('')}
      <circle r="44" fill="none" stroke-width="1.2"/><circle r="8" fill="#2a2622"/>
    </g>
    <!-- 地道口 -->
    <path d="M14,709 Q20,600 102,540 Q186,600 196,709 Z" fill="#5a5644"/>
    <path d="M34,684 L34,606 Q38,556 102,544 Q166,556 170,606 L170,684 Z" fill="#7a7666"/>
    <path d="${M4.tunnel}" fill="#0c0a08"/>
    <path d="M44,620 h116 M58,580 l12,-10 M146,580 l-12,-10" stroke="#5a5648" stroke-width="1.4"/>
    <!-- 篱笆 -->
    <path d="M200,560 V640 M260,548 V626 M320,540 V618 M196,580 L330,556 M196,610 L330,586" stroke="#4a3a2a" stroke-width="6"/>
    <path d="M520,640 V709 M600,628 V709 M680,616 V700 M760,606 V692 M520,664 L790,626 M520,690 L790,654" stroke="#4a3a2a" stroke-width="7"/>
  </g>
  <rect x="0" y="380" width="828" height="80" fill="url(#m4-fogband)"/>
  <ellipse cx="420" cy="440" rx="380" ry="20" fill="#d0d3cd" opacity=".25" filter="url(#m4-blur)"/>`;
}

/* ---------------- 磨坊内（参考图：粗木框架 / 右上大齿轮 / 料斗 / 圆形石台上的磨盘 / 右侧楼梯与拱门） ---------------- */
const MI4 = {
  drive:{x:610, y:200}, crown:{x:400, y:200},
  stone:{x:400, y:404},
  door:()=>`${rw(818,286)} ${rw(770,286)} ${rw(770,520)} ${rw(818,520)}`
};
function m4BigWheel(r){
  let cogs=''; for(let i=0;i<28;i++) cogs+=`<rect x="-5" y="${-r-12}" width="10" height="16" rx="1.5" fill="#5a4230" transform="rotate(${(i*360/28).toFixed(1)})"/>`;
  return `<g stroke="#15110d" stroke-width="1.5" stroke-linejoin="round">${cogs}
    <circle r="${r}" fill="none" stroke="#5a4230" stroke-width="16"/><circle r="${r+8}" fill="none"/><circle r="${r-8}" fill="none"/>
    ${[0,45,90,135].map(a=>`<rect x="-6" y="${-r+6}" width="12" height="${r*2-12}" fill="#4a3626" transform="rotate(${a})"/>`).join('')}
    <circle r="${r*.32}" fill="#4a3626"/></g>`;
}
function m4InBackground(){
  let lws='', rws=''; for(let hy=60; hy<628; hy+=60){ lws+=`<path d="M${lw(0,hy)} L${lw(150,hy)}"/>`; rws+=`<path d="M${rw(828,hy)} L${rw(678,hy)}"/>`; }
  let planks=''; for(let x=-600;x<=1428;x+=50) planks+=`<path d="M${(VPX+(x-VPX)*(520-VPY)/(709-VPY)).toFixed(1)},520 L${x},709"/>`;
  let sticks=''; for(let i=0;i<11;i++){ const x=256+i*8; sticks+=`<rect x="${x}" y="${178+(i%3)*3}" width="5" height="${70-(i%4)*6}" rx="1" fill="${i%4===3?'#7a6a4e':'#a8946a'}" stroke="#1a1511" stroke-width="1"/>`; }
  let flour=''; for(let i=0;i<46;i++){ const x=230+(i*37)%380, y=540+(i*23)%150; flour+=`<circle cx="${x}" cy="${y}" r="${1+(i%3)*.6}"/>`; }
  const {x:sx, y:sy} = MI4.stone;
  let dais=''; for(let i=0;i<9;i++){ const a0=Math.PI*(i/9), a1=Math.PI*((i+1)/9), x0=sx-158*Math.cos(a0), x1=sx-158*Math.cos(a1);
    dais+=`<path d="M${x0.toFixed(1)},${(sy+66+32*Math.sin(a0)).toFixed(1)} L${x1.toFixed(1)},${(sy+66+32*Math.sin(a1)).toFixed(1)} L${x1.toFixed(1)},${(sy+110+32*Math.sin(a1)).toFixed(1)} L${x0.toFixed(1)},${(sy+110+32*Math.sin(a0)).toFixed(1)} Z" fill="${i%2?'#7a766a':'#857f72'}"/>`; }
  let steps=''; for(let i=0;i<10;i++) steps+=`<path d="M${704+i*7},${508-i*28} L${748+i*6},${508-i*28}" stroke="#55432f" stroke-width="7"/>`;
  return `
  <defs>
    <filter id="mi4-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="61" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="mi4-stain" filterUnits="userSpaceOnUse" x="0" y="0" width="828" height="709">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="33"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.14  1.9 0 0 0 -0.8"/>
    </filter>
    <linearGradient id="mi4-bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d7764"/><stop offset="1" stop-color="#8f8874"/></linearGradient>
    <linearGradient id="mi4-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4e4234"/><stop offset="1" stop-color="#62533f"/></linearGradient>
    <linearGradient id="mi4-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a9294"/><stop offset="1" stop-color="#b9bdb8"/></linearGradient>
    <radialGradient id="mi4-warm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <radialGradient id="mi4-warmBig"><stop offset="0" stop-color="#ffc56e" stop-opacity=".25"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
    <clipPath id="mi4-clipFloor"><polygon points="0,628 150,520 678,520 828,628 828,709 0,709"/></clipPath>
    <clipPath id="mi4-clipWalls"><polygon points="0,-38 150,95 150,520 0,628"/><rect x="150" y="95" width="528" height="425"/><polygon points="828,-38 678,95 678,520 828,628"/></clipPath>
    <clipPath id="mi4-clipWin"><path d="M190,296 L190,196 Q192,170 210,160 Q228,170 230,196 L230,296 Z"/></clipPath>
  </defs>
  <rect width="828" height="709" fill="#2a241d"/>
  <g filter="url(#mi4-rough)" ${m4k}>
    <rect x="-10" y="-10" width="848" height="110" fill="#3e3428" stroke="none"/>
    <g fill="#4a3a2a" stroke="#1a1511" stroke-width="1.5">
      <polygon points="40,20 788,20 770,36 58,36"/><polygon points="100,66 728,66 718,78 110,78"/>
      <polygon points="120,-10 150,-10 220,95 206,95"/><polygon points="678,-10 708,-10 622,95 608,95"/>
    </g>
    <rect x="150" y="95" width="528" height="425" fill="url(#mi4-bw)"/>
    <polygon points="0,-38 150,95 150,520 0,628" fill="#77705e"/>
    <g stroke="#6a6352" stroke-width="1" fill="none">${lws}</g>
    <polygon points="828,-38 678,95 678,520 828,628" fill="#706957"/>
    <g stroke="#635c4c" stroke-width="1" fill="none">${rws}</g>
    <polygon points="0,628 150,520 678,520 828,628 828,709 0,709" fill="url(#mi4-floor)"/>
    <g clip-path="url(#mi4-clipFloor)" stroke="#3e3428" stroke-width="1.4" fill="none">${planks}</g>
    <line x1="150" y1="520" x2="678" y2="520" stroke="#2a2119" stroke-width="3"/>
  </g>
  <rect width="828" height="709" filter="url(#mi4-stain)" clip-path="url(#mi4-clipWalls)" opacity=".5"/>
  <g filter="url(#mi4-rough)" ${m4k}>
    <!-- 后墙：尖拱窗 + 记账木签 -->
    <path d="M180,306 L180,194 Q183,160 210,146 Q237,160 240,194 L240,306 Z" fill="#6a6555"/>
    <path d="M190,296 L190,196 Q192,170 210,160 Q228,170 230,196 L230,296 Z" fill="url(#mi4-fog)"/>
    <g clip-path="url(#mi4-clipWin)" stroke="none"><path d="M190,296 L190,262 L198,262 L198,240 L204,230 L210,240 L210,256 L218,256 L218,248 L230,248 L230,296 Z" fill="#7c8487"/>
      <path d="M196,296 Q204,270 200,250 M222,296 Q216,276 226,262" stroke="#5a6062" stroke-width="1.6" fill="none"/></g>
    <path d="M210,160 V296 M190,228 H230" stroke="#3a3530" stroke-width="2" fill="none"/>
    <rect x="248" y="166" width="96" height="8" fill="#4a3a2a"/>
    ${sticks}
    <!-- 左墙：架子 + 陶罐 -->
    <polygon points="${lw(16,236)} ${lw(110,236)} ${lw(110,244)} ${lw(16,244)}" fill="#4a3a2a"/>
    <path d="M${lw(30,244)} L${lw(40,262)} M${lw(96,244)} L${lw(86,262)}" stroke="#4a3a2a" stroke-width="5"/>
    <path d="M36,${wy(36,236)} q-12,0 -12,-14 q0,-12 6,-16 v-8 h12 v8 q6,4 6,16 q0,14 -12,14 Z" fill="#7a6a54"/>
    <path d="M70,${wy(70,236)} q-9,0 -9,-11 q0,-10 9,-12 q9,2 9,12 q0,11 -9,11 Z" fill="#cfc4a6"/>
    <rect x="86" y="${wy(92,236)-18}" width="16" height="18" fill="#6a5440"/>
    <!-- 木框架：两根立柱 + 横梁 + 斜撑 -->
    <rect x="336" y="95" width="22" height="425" fill="#55432f"/>
    <rect x="660" y="95" width="22" height="425" fill="#55432f"/>
    <path d="M343,110 V510 M667,110 V510" stroke="#45362a" stroke-width="1.4"/>
    <rect x="320" y="108" width="380" height="26" fill="#4e3d2b"/>
    <path d="M320,121 H700" stroke="#3a2e22" stroke-width="1.4"/>
    <path d="M358,134 L396,170 M660,134 L630,164" stroke="#4e3d2b" stroke-width="12"/>
    <!-- 齿轮槽板（三根空轴在这里） -->
    <rect x="436" y="${MI4.drive.y-30}" width="140" height="60" rx="4" fill="#5a4636"/>
    <path d="M436,${MI4.drive.y-30} H576" stroke="#6e5842" stroke-width="2"/>
    <!-- 动力轴（穿出右墙，通向水车） -->
    <path d="M${MI4.drive.x},${MI4.drive.y} L828,${MI4.drive.y-34}" stroke="#3a2e22" stroke-width="16"/>
    <!-- 磨盘主轴 + 料斗 -->
    <rect x="${MI4.crown.x-6}" y="${MI4.crown.y}" width="12" height="${sy-MI4.crown.y}" fill="#3a2e22"/>
    <path d="M352,262 L448,262 L432,318 L368,318 Z" fill="#6a5440"/>
    <path d="M352,262 H448 M358,282 H442" stroke="#4a3a2a" stroke-width="2"/>
    <path d="M370,318 L384,350 L416,350 L430,318" fill="#5a4636"/>
    <path d="M430,330 L520,346 L520,352 L430,338 Z" fill="#4e3d2b"/>
    <path d="M500,350 V404" stroke="#4e3d2b" stroke-width="6"/>
    <!-- 圆形石台 -->
    <ellipse cx="${sx}" cy="${sy+110}" rx="158" ry="32" fill="#6a6658"/>
    ${dais}
    <ellipse cx="${sx}" cy="${sy+66}" rx="158" ry="32" fill="#8f8a7d"/>
    <ellipse cx="${sx}" cy="${sy+66}" rx="130" ry="24" fill="none" stroke="#74706a" stroke-width="1.4"/>
    <!-- 磨盘（上下两扇） -->
    <ellipse cx="${sx}" cy="${sy+44}" rx="116" ry="25" fill="#6a6658"/>
    <rect x="${sx-116}" y="${sy}" width="232" height="44" fill="#8a867a"/>
    <path d="M${sx-116},${sy+22} H${sx+116}" stroke="#6a665c" stroke-width="1.4"/>
    <ellipse cx="${sx}" cy="${sy}" rx="116" ry="25" fill="#a39f92"/>
    <ellipse cx="${sx}" cy="${sy}" rx="18" ry="5" fill="#3a3630"/>
    <!-- 出料口 + 木槽 -->
    <path d="M${sx-14},${sy+92} L${sx+14},${sy+92} L${sx+18},${sy+112} L${sx-18},${sy+112} Z" fill="#5a4636"/>
    <path d="M${sx-54},${sy+116} L${sx+54},${sy+116} L${sx+46},${sy+152} L${sx-46},${sy+152} Z" fill="#6a5440"/>
    <path d="M${sx-54},${sy+116} L${sx-46},${sy+152} M${sx+54},${sy+116} L${sx+46},${sy+152}" stroke="#3a2e22" stroke-width="4"/>
    <ellipse cx="${sx}" cy="${sy+118}" rx="48" ry="6" fill="#e6dfcc"/>
    <!-- 右侧：楼梯 + 拱门 -->
    <path d="M700,520 L780,236" stroke="#4a3a2a" stroke-width="10"/><path d="M744,520 L812,268" stroke="#4a3a2a" stroke-width="10"/>
    ${steps}
    <polygon points="${rw(824,276)} ${rw(764,276)} ${rw(764,520)} ${rw(824,520)}" fill="#6a6555"/>
    <polygon points="${MI4.door()}" fill="#5a4632"/>
    <path d="M${rw(794,290)} L${rw(794,518)} M${rw(770,380)} L${rw(818,380)} M${rw(770,470)} L${rw(818,470)}" stroke="#3a2e22" stroke-width="2.4"/>
    <circle cx="${828-776}" cy="0" r="0"/>
    <!-- 壁灯（右立柱） -->
    <path d="M682,316 h14 v8" stroke="#221e1a" stroke-width="3" fill="none"/>
    <rect x="692" y="292" width="8" height="24" fill="#d7ccb0" stroke-width="1.2"/>
  </g>
  <g fill="#e6dfcc" opacity=".55">${flour}</g>
  <circle cx="696" cy="290" r="90" fill="url(#mi4-warmBig)"/>
  <circle cx="696" cy="288" r="18" fill="url(#mi4-warm)"/>
  <path class="flame" d="M696,278 q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>`;
}

/* ---------------- 场景 DOM ---------------- */
document.getElementById('l3').insertAdjacentHTML('afterend', `
<div id="l4" class="lvroot hidden" data-level="L4">
  <svg id="m4OutBg" viewBox="0 0 828 709" pointer-events="none">${m4OutBackground()}</svg>
  <svg id="m4InBg" viewBox="0 0 828 709" pointer-events="none" style="display:none">${m4InBackground()}</svg>
  <svg id="l4Obj" viewBox="0 0 828 709">
    <defs>
      <radialGradient id="l4-lamp"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".5"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
      <radialGradient id="l4-vig" cx="50%" cy="48%" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
    </defs>
    <g id="l4Dyn" pointer-events="none"></g>
    <g id="m4OutHot">
      <rect class="hs" data-obj="o_scarecrow" x="650" y="296" width="146" height="316"/>
      <rect class="hs" data-obj="o_sluice" x="628" y="236" width="52" height="66"/>
      <circle class="hs" data-obj="o_wheel" cx="${M4.wheel.x}" cy="${M4.wheel.y}" r="74"/>
      <path class="hs" data-obj="o_door" d="${M4.door}"/>
      <rect class="hs" data-obj="o_cart" x="40" y="336" width="210" height="180"/>
      <rect class="hs" data-obj="o_elamp" x="232" y="476" width="52" height="52"/>
      <path class="hs" data-obj="o_tunnel" d="${M4.tunnel}"/>
      <rect class="hs" data-obj="o_mill" x="286" y="140" width="190" height="196"/>
      <rect class="hs" data-obj="o_feather" x="596" y="560" width="70" height="50" style="display:none" id="m4FeatherHot"/>
      <g class="hs-arrow" data-obj="go_in"><rect x="772" y="640" width="48" height="48" rx="6" fill="#2b251e" opacity=".55"/><path d="M788,652 L806,664 L788,676" stroke="#e6dfcc" stroke-width="3" fill="none"/></g>
    </g>
    <g id="m4InHot" style="display:none">
      <rect class="hs" data-obj="i_gears" x="${MI4.crown.x-50}" y="96" width="${MI4.drive.x-MI4.crown.x+150}" height="166"/>
      <ellipse class="hs" data-obj="i_stone" cx="${MI4.stone.x}" cy="${MI4.stone.y+40}" rx="150" ry="60"/>
      <rect class="hs" data-obj="i_chute" x="${MI4.stone.x-56}" y="${MI4.stone.y+104}" width="112" height="52"/>
      <rect class="hs" data-obj="i_sacks" x="20" y="460" width="230" height="170"/>
      <rect class="hs" data-obj="i_tally" x="246" y="160" width="100" height="100"/>
      <rect class="hs" data-obj="i_candle" x="682" y="270" width="30" height="60"/>
      <polygon class="hs" data-obj="i_door" points="${MI4.door()}"/>
      <rect class="hs" data-obj="i_stairs" x="700" y="236" width="62" height="284"/>
      <rect class="hs" data-obj="i_window" x="180" y="146" width="60" height="160"/>
      <g class="hs-arrow" data-obj="go_out"><rect x="8" y="640" width="48" height="48" rx="6" fill="#2b251e" opacity=".55"/><path d="M40,652 L22,664 L40,676" stroke="#e6dfcc" stroke-width="3" fill="none"/></g>
    </g>
  </svg>
</div>`);
document.head.insertAdjacentHTML('beforeend', `<style>
  .hs-arrow{cursor:pointer}
  .hs-arrow:hover rect{opacity:.85}
  .m4spin{transform-box:fill-box;transform-origin:50% 50%;animation:m4cw 7s linear infinite}
  .m4spinR{transform-box:fill-box;transform-origin:50% 50%;animation:m4cw 7s linear infinite reverse}
  @keyframes m4cw{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  .m4fly{animation:m4fly 2.4s ease-in forwards}
  @keyframes m4fly{0%{transform:translate(0,0);opacity:1}100%{transform:translate(-260px,-360px) scale(.4);opacity:0}}
  .m4water{animation:m4water .5s linear infinite}
  @keyframes m4water{from{stroke-dashoffset:0}to{stroke-dashoffset:-24}}
</style>`);
