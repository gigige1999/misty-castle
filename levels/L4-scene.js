/* =====================================================================
   第 4 关 · 磨坊（The Watermill）—— 场景美术
   两个场景：磨坊外（雾中麦田、水车、稻草人、马车）/ 磨坊内（齿轮、磨盘、面粉袋、木签）
   ===================================================================== */
const m4k = 'stroke="#1a1511" stroke-width="2" stroke-linejoin="round"';
const m4s = 'stroke="#1a1511" stroke-width="1.4" stroke-linejoin="round"';
const n4 = v => (+v).toFixed(1);

/* ---------------- 共享材质：木 / 铁 / 黄铜 / 石 / 粗麻 —— 保持墨线风格，只加一层体积感 ---------------- */
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="m4Wd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3e2e1e"/><stop offset=".35" stop-color="#6e5638"/><stop offset=".6" stop-color="#5e4830"/><stop offset="1" stop-color="#3a2a1a"/></linearGradient>
  <linearGradient id="m4WdV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76603e"/><stop offset=".5" stop-color="#5a4630"/><stop offset="1" stop-color="#3e2e1e"/></linearGradient>
  <linearGradient id="m4Ir" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e1b18"/><stop offset=".4" stop-color="#6a645a"/><stop offset=".6" stop-color="#4a4640"/><stop offset="1" stop-color="#1a1714"/></linearGradient>
  <linearGradient id="m4IrV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a645a"/><stop offset="1" stop-color="#1e1b18"/></linearGradient>
  <linearGradient id="m4Br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8cc80"/><stop offset=".5" stop-color="#a8823a"/><stop offset="1" stop-color="#5e4418"/></linearGradient>
  <linearGradient id="m4Stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e6a5c"/><stop offset=".45" stop-color="#8e897a"/><stop offset="1" stop-color="#5e5a4e"/></linearGradient>
  <linearGradient id="m4StoneSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5e5a50"/><stop offset=".35" stop-color="#9a968a"/><stop offset=".55" stop-color="#8e8a7e"/><stop offset="1" stop-color="#55524a"/></linearGradient>
  <radialGradient id="m4Shade" cx=".36" cy=".32" r=".72"><stop offset="0" stop-color="#fff6dc" stop-opacity=".3"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient>
  <radialGradient id="m4LampGlow"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".7"/><stop offset=".45" stop-color="#ffc56e" stop-opacity=".25"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
  <linearGradient id="m4SackSh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2010" stop-opacity=".34"/><stop offset=".38" stop-color="#fff8e0" stop-opacity=".14"/><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a2010" stop-opacity=".4"/></linearGradient>
  <radialGradient id="m4Flour" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbf0"/><stop offset=".7" stop-color="#ece5d2"/><stop offset="1" stop-color="#cfc6ae"/></radialGradient>
  <pattern id="m4Burlap" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M0,1 H4 M1,0 V4" stroke="#6a5a3a" stroke-width=".55" opacity=".35"/><path d="M0,3 H4 M3,0 V4" stroke="#fff6dc" stroke-width=".4" opacity=".25"/></pattern>
  <pattern id="m4Ashlar" patternUnits="userSpaceOnUse" width="36" height="18"><path d="M0,.5 H36 M0,9.5 H36 M10,.5 V9.5 M28,9.5 V18" stroke="#5a564a" stroke-width=".9" opacity=".7" fill="none"/>
    <path d="M1,1.6 H9 M11,10.6 H27" stroke="#b4ae9c" stroke-width=".6" opacity=".5"/><circle cx="20" cy="4" r=".8" fill="#5a564a" opacity=".45"/><circle cx="6" cy="14" r=".6" fill="#5a564a" opacity=".4"/></pattern>
</defs></svg>`);

/* ---------------- 共享：齿轮、乌鸦、稻草人、小鞋、提灯 ---------------- */
function gearArt(r, teeth, fill, opt={}){
  // 梯形齿 + 齿根圆弧，一笔连成；内圈辐板 / 辐条，轮毂方孔，左上高光、右下阴影
  const h = Math.max(6, r*.16), w = Math.PI/teeth; let d='';
  for(let i=0;i<teeth;i++){ const a=i*2*Math.PI/teeth;
    [[r,a-w*.62],[r+h,a-w*.34],[r+h,a+w*.34],[r,a+w*.62]].forEach(([rr,aa],j)=>{ d+=(i||j?'L':'M')+n4(rr*Math.cos(aa))+','+n4(rr*Math.sin(aa))+' '; });
    const a2=(i+1)*2*Math.PI/teeth - w*.62; d+=`A${n4(r)},${n4(r)} 0 0 1 ${n4(r*Math.cos(a2))},${n4(r*Math.sin(a2))} `; }
  const dark = opt.dark||'#2a1e12', sw = Math.max(1, Math.min(1.6, r*.04));
  const nSp = r>40 ? 6 : r>22 ? 4 : 0;
  const spokes = [...Array(nSp)].map((_,i)=>{ const a=i*360/nSp; return `<path d="M${n4(-r*.07)},${n4(-r*.22)} L${n4(-r*.1)},${n4(-r*.74)} L${n4(r*.1)},${n4(-r*.74)} L${n4(r*.07)},${n4(-r*.22)} Z" transform="rotate(${a})"/>`; }).join('');
  const rivets = r>22 ? [...Array(nSp||6)].map((_,i)=>{ const a=(i+.5)*2*Math.PI/(nSp||6); return `<circle cx="${n4(r*.86*Math.cos(a))}" cy="${n4(r*.86*Math.sin(a))}" r="${n4(Math.max(1,r*.035))}" fill="${dark}" stroke="none" opacity=".75"/>`; }).join('') : '';
  return `<g stroke="#15110d" stroke-width="${sw}" stroke-linejoin="round">
    <path d="${d}Z" fill="${fill}"/>
    ${nSp ? `<circle r="${n4(r*.78)}" fill="${dark}"/><g fill="${fill}">${spokes}</g>` : `<circle r="${n4(r*.62)}" fill="none" stroke="${dark}" stroke-width="${n4(sw*1.4)}"/>`}
    <circle r="${n4(Math.max(5,r*.24))}" fill="${fill}"/>
    <rect x="${n4(-Math.max(2,r*.08))}" y="${n4(-Math.max(2,r*.08))}" width="${n4(Math.max(4,r*.16))}" height="${n4(Math.max(4,r*.16))}" fill="${opt.hub||'#120e0a'}" stroke="none"/>
  </g>
  <circle r="${n4(r+h*.5)}" fill="url(#m4Shade)" stroke="none" pointer-events="none"/>
  <path d="M${n4(-r*.92)},${n4(-r*.28)} A${n4(r*.96)},${n4(r*.96)} 0 0 1 ${n4(-r*.28)},${n4(-r*.92)}" stroke="#fff4d0" stroke-width="${n4(sw*.9)}" fill="none" opacity=".45"/>
  ${rivets}
  ${opt.crack?`<path d="M${n4(r*.2)},${n4(-r*.1)} L${n4(r*.48)},${n4(-r*.36)} L${n4(r*.56)},${n4(-r*.6)} L${n4(r*.8)},${n4(-r*.78)} L${n4(r+h)},${n4(-r-h*.7)}" stroke="#0c0907" stroke-width="${n4(sw*2)}" fill="none"/>
    <path d="M${n4(r*.5)},${n4(-r*.4)} l${n4(r*.18)},${n4(r*.04)}" stroke="#0c0907" stroke-width="${n4(sw)}"/>`:''}`;
}
const crowArt = (x,y,s=1,flip=false)=>`<g transform="translate(${x},${y}) scale(${flip?-s:s},${s})">
  <path d="M-11,9 Q-15,-1 -9,-7.6 Q-5,-13.6 3,-12.4 Q8,-11.4 9.4,-6.4 L17,-5.4 L9.6,-3 Q12.6,3.6 8.6,9.6 L15.6,16.6 L10,15 L11.6,18.4 L4,12.8 Q-4,14.6 -11,9 Z" fill="#141210"/>
  <path d="M-8,0 Q-2,-4 6,1 Q2,6 -6,7" fill="none" stroke="#3a3632" stroke-width=".8"/>
  <path d="M9.4,-6.2 L16.6,-5.4" stroke="#3a3632" stroke-width=".5"/>
  <circle cx="4.2" cy="-8" r="1.3" fill="#c8b48a"/><circle cx="4.5" cy="-8.3" r=".4" fill="#fff"/>
  <path d="M-2,12.6 l-1,5.6 M-4.4,18.2 h3 M3,12.6 l1,5.6 M2.6,18.2 h3" stroke="#141210" stroke-width="1.3" stroke-linecap="round"/></g>`;
function scarecrowArt(withCrows){
  // 参考图：尖顶宽檐破帽、粗麻布袋头（缝线眼和嘴，没有表情）、破烂长外套、袖口和领口支着稻草
  const coat = 'M692,396 Q684,452 690,520 L700,516 L704,530 L714,518 L722,534 L730,516 L740,528 L746,512 L754,518 Q760,452 750,394 Q722,386 692,396 Z';
  const slL = 'M660,400 L694,394 L696,424 L686,430 L680,424 L672,432 L664,420 Z', slR = 'M782,396 L748,392 L748,422 L758,428 L764,420 L772,430 L780,418 Z';
  const head = 'M700,370 Q698,344 720,340 Q742,344 740,370 Q740,392 720,394 Q700,392 700,370 Z';
  const hat = 'M704,346 L712,312 Q718,298 732,292 L740,286 L734,300 Q730,320 738,346 Z', brim = 'M686,348 Q720,336 756,346 L752,350 L746,349 L742,353 Q720,352 700,354 L696,351 L690,352 Z';
  return `<g ${m4k}>
    <ellipse cx="720" cy="612" rx="26" ry="5" fill="#2a2418" opacity=".45" stroke="none"/>
    <rect x="716.5" y="330" width="7" height="284" fill="url(#m4Wd)"/>
    <path d="M718,360 v40 M721,440 v60 M719,540 v50" stroke="#2a1e12" stroke-width=".7" opacity=".6"/>
    <path d="M660,401 L782,395 L782,401.6 L660,407.6 Z" fill="url(#m4WdV)"/>
    <path d="M716,398 l8,6 M724,398 l-8,6" stroke="#7a6440" stroke-width="2.2"/>
    ${[slL,slR].map(d=>`<path d="${d}" fill="#4a3e2e"/><path d="${d}" fill="url(#m4Burlap)" stroke="none"/><path d="${d}" fill="url(#m4SackSh)" stroke="none"/>`).join('')}
    <path d="M664,420 l-10,6 l8,1 l-8,8 l12,-5 l-2,8 l8,-10 M778,418 l10,6 l-8,1 l8,8 l-12,-5 l2,8 l-8,-10" stroke="#c4a860" stroke-width="1.6" fill="none"/>
    <path d="M668,424 l-6,10 M672,426 l-2,11 M774,422 l6,10 M770,424 l2,11" stroke="#8a7238" stroke-width="1.1"/>
    <path d="M674,410 l10,-1 M680,404 v18 M676,406 l8,12" stroke="#2a2218" stroke-width=".9" opacity=".8"/>
    <path d="${coat}" fill="#4e4232"/><path d="${coat}" fill="url(#m4Burlap)" stroke="none"/><path d="${coat}" fill="url(#m4SackSh)" stroke="none"/>
    <path d="M700,516 l-3,10 M714,518 l-1,12 M730,516 l2,12 M746,512 l4,10" stroke="#c4a860" stroke-width="1.5"/>
    <path d="M706,400 L716,470 M738,400 L730,470" stroke="#2e261c" stroke-width="1.5" fill="none"/>
    <path d="M697,430 Q694,470 698,505 M752,428 Q756,470 750,500" stroke="#2e261c" stroke-width=".9" fill="none" opacity=".7"/>
    ${[418,436,454].map(y=>`<circle cx="${722+(y-418)*.06}" cy="${y}" r="2.4" fill="#2a2018" stroke-width="1"/><circle cx="${721.4+(y-418)*.06}" cy="${y-.6}" r=".7" fill="#8a7a5a" stroke="none"/>`).join('')}
    <g transform="rotate(-6 735 447)"><rect x="726" y="440" width="18" height="14" fill="#6a5a40"/><rect x="726" y="440" width="18" height="14" fill="url(#m4Burlap)" stroke="none"/>
      <path d="M727,442 l2,2 M727,446 l2,2 M727,450 l2,2 M741,442 l2,2 M741,446 l2,2 M741,450 l2,2 M729,441 l2,-2 M735,441 l2,-2 M731,455 l2,-2 M737,455 l2,-2" stroke="#c8b07a" stroke-width=".8"/></g>
    <path d="M694,470 Q722,480 752,466" stroke="#8a7448" stroke-width="3.4" fill="none"/>
    <path d="M694,470 Q722,480 752,466" stroke="#c4aa70" stroke-width="1" fill="none" stroke-dasharray="2 3"/>
    <path d="M716,474 l-3,4 l5,2 Z" fill="#8a7448" stroke-width="1"/><path d="M714,478 q-4,10 -1,20 M717,479 q2,10 6,16" stroke="#8a7448" stroke-width="2" fill="none"/>
    <path d="M708,388 l-6,10 M714,390 l-3,10 M732,390 l3,10 M738,388 l6,10 M720,392 v10" stroke="#c4a860" stroke-width="1.7"/>
    <path d="${head}" fill="#a8956a"/><path d="${head}" fill="url(#m4Burlap)" stroke="none"/><path d="${head}" fill="url(#m4SackSh)" stroke="none"/>
    <path d="M704,358 Q720,364 736,358 M702,376 Q720,382 738,376" stroke="#8a7a52" stroke-width=".9" fill="none"/>
    <path d="M708,364 l7,6 M715,364 l-7,6 M726,364 l7,6 M733,364 l-7,6" stroke="#1a1511" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M708,382 Q720,385 732,382 M711,379 v6 M716,380 v6 M721,380 v6 M726,380 v6 M731,379 v6" stroke="#1a1511" stroke-width="1.3" fill="none"/>
    <path d="M736,350 l3,8 M703,352 l-2,6" stroke="#6a5a3a" stroke-width=".9"/>
    <path d="M704,388 Q720,396 736,388 L736,394 Q720,400 704,394 Z" fill="#7a6a48"/>
    <path d="M703,389 Q720,398 737,389" stroke="#5a4628" stroke-width="2.6" fill="none"/><path d="M736,390 q6,4 4,12 M737,391 q3,6 8,8" stroke="#5a4628" stroke-width="1.6" fill="none"/>
    <path d="${brim}" fill="#2e2620"/>
    <path d="${hat}" fill="#2e2620"/><path d="${hat}" fill="url(#m4SackSh)" stroke="none"/>
    <path d="M707,336 Q722,331 737,336 L737.6,342 Q722,337 706,342 Z" fill="#5a3a2a" stroke-width="1.2"/>
    <path d="M716,318 l10,-2 l1,9 l-10,2 Z" fill="#4a3e30" stroke-width="1"/><path d="M717,320 l1.4,1.4 M720,318 l1.4,1.4 M723,317 l1.4,1.4" stroke="#a89470" stroke-width=".6"/>
    <path d="M714,330 Q720,316 724,302" stroke="#5a4e40" stroke-width=".8" fill="none" opacity=".8"/>
    <path d="M692,349 Q720,344 750,347" stroke="#5a4e40" stroke-width=".8" fill="none" opacity=".7"/>
  </g>${withCrows ? crowArt(666,388,1.2)+crowArt(776,382,1.2,true)+crowArt(728,282,1.3)+crowArt(700,396,1.05,true) : ''}`;
}
const shoeArt = (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})" ${m4s}>
  <path d="M-12,4 Q-12.6,-6.4 -4.4,-7.4 L2,-7.4 Q4.4,-1.4 10,-.2 Q16.6,1 16.6,5 L16.6,7.4 L-12,7.4 Z" fill="url(#m4WdV)"/>
  <path d="M-12,7.4 H16.6" stroke-width="2.2"/>
  <path d="M-4.4,-7.4 Q-1.2,-2.4 2,-7.4" fill="#2a1e12" stroke-width="1"/>
  <path d="M-2,-3 l3,1.4 M-.6,-5 l3,1.4" stroke="#c9b48a" stroke-width=".6"/>
  <path d="M-10,2 Q-4,0 4,2" stroke="#9a7a52" stroke-width=".6" fill="none"/></g>`;
/* 粗麻面粉袋：卷边袋口露出面粉，袋身印褪色麦穗戳记 */
const burlap4 = (d, fill)=>`<path d="${d}" fill="${fill}"/><path d="${d}" fill="url(#m4Burlap)" stroke="none"/><path d="${d}" fill="url(#m4SackSh)" stroke="none"/>`;
const wheatStamp4 = (cx,cy,s=1,sy=s)=>`<g transform="translate(${cx},${cy}) scale(${s},${sy})" stroke="#6e5e3c" fill="none" opacity=".75">
  <circle r="13" stroke-width="1.1" stroke-dasharray="2.4 1.6"/>
  <path d="M0,10 V-9 M0,-3 l-4.6,-4 M0,-3 l4.6,-4 M0,2 l-4.6,-4 M0,2 l4.6,-4 M0,7 l-4.6,-4 M0,7 l4.6,-4 M0,-9 v-3" stroke-width="1.5" stroke-linecap="round"/></g>`;
function sackArt(){
  const body = 'M-36,36 Q-48,4 -38,-24 Q-34,-36 -24,-40 Q0,-33 24,-40 Q34,-36 38,-24 Q48,4 36,36 Q0,44 -36,36 Z';
  const rim = 'M-35,-22 Q-38,-35 -24,-41 Q0,-34 24,-41 Q38,-35 35,-22 Q0,-13 -35,-22 Z';
  return `<ellipse cx="2" cy="39" rx="40" ry="6" fill="#1e1a14" opacity=".4" stroke="none"/>
  <g ${m4k}>${burlap4(body,'#cbbf9c')}${burlap4(rim,'#b8ab88')}
    <path d="M-26,-29 Q-14,-41 -2,-37 Q12,-42 26,-30 Q0,-22 -26,-29 Z" fill="url(#m4Flour)" stroke-width="1.1"/>
    <path d="M-15,-33 q6,-3 12,-1 M6,-35 q5,-1 9,1" stroke="#fffaf0" stroke-width="1" fill="none"/>
    <path d="M-34,-18 Q0,-8 34,-18" stroke="#8a7c5c" stroke-width="1.2" fill="none"/>
    <path d="M-28,-37 l4,4 M24,-38 l-3,4 M-35,-26 l5,1 M35,-26 l-5,1" stroke="#8a7c5c" stroke-width=".8"/>
    <path d="M-31,-6 Q-27,10 -31,26 M29,-8 Q25,8 30,24 M-16,31 q5,-6 11,-4 M10,30 q6,-3 12,0" stroke="#8f8262" stroke-width=".9" fill="none"/>
    ${wheatStamp4(0,10)}
    <path d="M35,-14 Q41,6 35,32" stroke="#6a5a3a" stroke-width="1" stroke-dasharray="2 2" fill="none"/>
    <path d="M-36,36 Q0,44 36,36" stroke="#e6dfcc" stroke-width="1.6" fill="none" opacity=".7"/>
  </g>`;
}
function sackTornArt(){
  const body = 'M-40,30 Q-46,8 -30,-2 Q-20,-8 -13,-6 L-9,-15 L-3,-6 L3,-13 L8,-4 Q20,-12 30,-2 Q46,8 40,30 Q0,38 -40,30 Z';
  return `<ellipse cx="0" cy="33" rx="44" ry="6" fill="#1e1a14" opacity=".4" stroke="none"/>
  <g ${m4k}>${burlap4(body,'#c4b894')}
    <path d="M-13,-6 L-9,-15 L-3,-6 L3,-13 L8,-4 Q0,3 -13,-6 Z" fill="#3a3024" stroke-width="1.2"/>
    <path d="M-9,-6 Q-1,0 6,-4" stroke="#efe9d8" stroke-width="2" fill="none"/>
    <path d="M-13,-6 l-3,-4 M-9,-15 l-2,-4 M-9,-15 l2,-4 M3,-13 l1,-5 M8,-4 l4,-3" stroke="#8a7a5c" stroke-width=".9"/>
    <path d="M-30,6 Q-20,0 -14,10 M18,4 Q26,0 32,10 M-24,24 Q-6,18 12,26" stroke="#8f8262" stroke-width=".9" fill="none"/>
    ${wheatStamp4(-4,14,.85,.6)}
    <path d="M-40,30 Q0,38 40,30" stroke="#e6dfcc" stroke-width="1.6" fill="none" opacity=".7"/>
  </g>`;
}
const flourSpill4 = (x,y)=>`<g stroke="#a89c80" stroke-width="1">
  <path d="M${x-30},${y+2} Q${x-22},${y-8} ${x-4},${y-7} Q${x+16},${y-10} ${x+28},${y-2} Q${x+34},${y+5} ${x+20},${y+7} Q${x},${y+10} ${x-24},${y+7} Q${x-34},${y+6} ${x-30},${y+2} Z" fill="url(#m4Flour)"/>
  <path d="M${x-14},${y-4} q8,-3 16,-1" stroke="#fffaf0" stroke-width="1.2" fill="none"/>
  ${[[-38,4],[36,2],[30,9],[-34,9],[8,11],[-12,11]].map(([dx,dy],i)=>`<circle cx="${x+dx}" cy="${y+dy}" r="${1+i%2*.6}" fill="#ece5d2" stroke="none"/>`).join('')}</g>`;
function wagonSackArt(){
  const body = 'M-31,22 Q-39,0 -26,-14 Q-16,-22 -8,-24 L8,-24 Q18,-22 26,-14 Q39,0 31,22 Q0,28 -31,22 Z';
  return `<g ${m4k}>${burlap4(body,'#cfc4a6')}
    <path d="M-8,-24 Q-11,-30 -6,-34 L6,-34 Q11,-30 8,-24 Z" fill="#bcb08e"/>
    <path d="M-5,-33 Q-11,-36 -16,-33 Q-14,-40 -6,-38 Z M5,-33 Q12,-38 17,-34 Q14,-42 5,-39 Z M-5,-35 Q-2,-42 2,-41 Q5,-38 5,-35 Z" fill="#c2b590" stroke-width="1.1"/>
    <path d="M-16,-33 l-2,2 M17,-34 l2,2 M-1,-41 l0,-2" stroke="#8a7a5c" stroke-width=".7"/>
    <path d="M-6,-22 Q-15,-10 -19,6 M0,-22 Q1,-8 -1,4 M6,-22 Q15,-10 19,4" stroke="#9a8e70" stroke-width=".9" fill="none"/>
    <path d="M-10,-27 Q0,-23 10,-27 M-10,-30.5 Q0,-26.5 10,-30.5" stroke="#5a4028" stroke-width="2.4" fill="none"/>
    <path d="M9,-29 q9,3 7,13 q-1,5 3,8 M10,-28 q4,6 1,12" stroke="#5a4028" stroke-width="1.6" fill="none"/>
    ${wheatStamp4(0,4,.75)}
    <path d="M-31,22 Q0,28 31,22" stroke="#e6dfcc" stroke-width="1.4" fill="none" opacity=".6"/>
  </g>`;
}
function crateArt(){
  const front = 'M196,604 L198,556 L282,550 L284,598 Z', top = 'M198,556 L282,550 L290,540 L206,546 Z', side = 'M282,550 L290,540 L292,588 L284,598 Z';
  return `<path d="M192,606 L290,600 L300,592 L296,588 Z" fill="#1e1a14" opacity=".4"/>
  <g ${m4k}>
    <path d="${front}" fill="url(#m4WdV)"/><path d="${side}" fill="#3a2c1e"/><path d="${top}" fill="#7a6244"/>
    <path d="M197,572 L283,566 M197,588 L284,582" stroke="#2a1e12" stroke-width="1.4"/>
    <path d="M206,562 q20,-2 40,-1 M214,578 q30,-3 60,-2 M204,594 q24,-2 50,-2" stroke="#3e2e1e" stroke-width=".7" fill="none" opacity=".7"/>
    <path d="M202,548 L286,542 M212,546 L292,540" stroke="#4a3826" stroke-width=".8" opacity=".8"/>
    <path d="M197,557 L207,556 L205,602 L196.4,603 Z M273,551 L282,550 L283.6,598 L275,598.6 Z" fill="#4a3826" stroke-width="1.2"/>
    <path d="M205,600 L275,553" stroke="#4a3826" stroke-width="6"/><path d="M205,600 L275,553" stroke="#2a1e12" stroke-width="1" fill="none"/>
    <path d="M196.6,557 h9 v7 M282.4,550.4 h-9 v7 M196.4,602 h9 v-7 M283.4,598.6 h-9 v-7" stroke="#2a2622" stroke-width="2.4" fill="none"/>
    ${[[201,560],[278,554],[201,598],[279,594],[216,571],[262,567],[216,587],[262,583]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="#2a2622" stroke="none"/>`).join('')}
    <text x="238" y="592" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="1.6" fill="#2a1e12" stroke="none" opacity=".55" transform="rotate(-4 238 590)">1415</text>
  </g>`;
}
function eLampArt(lit){
  return `${lit?`<circle cy="-14" r="34" fill="url(#m4LampGlow)" stroke="none"/>`:''}<g ${m4s}>
    <path d="M-7,-40 Q0,-52 7,-40" fill="none" stroke-width="2.6"/><path d="M-7,-40 Q0,-52 7,-40" fill="none" stroke="#7a7266" stroke-width="1"/>
    <rect x="-3.6" y="-42" width="7.2" height="5" rx="1" fill="url(#m4IrV)"/>
    <path d="M-15,-30 Q-14,-38 0,-39 Q14,-38 15,-30 Z" fill="url(#m4Ir)"/>
    <rect x="-6" y="-37.6" width="12" height="7" rx="1" fill="url(#m4Br)" stroke-width=".8"/>
    <text x="0" y="-32" text-anchor="middle" font-family="Georgia,serif" font-size="6.4" font-weight="bold" fill="#3a2810" stroke="none">E</text>
    <rect x="-16" y="-31" width="32" height="3.6" rx="1" fill="url(#m4IrV)"/>
    <rect x="-12" y="-27.4" width="24" height="30" fill="${lit?'#f6d88e':'#4c4c44'}"/>
    ${lit?`<ellipse cy="-12" rx="9" ry="11" fill="#fff6d0" opacity=".5" stroke="none"/>
      <rect x="-2.4" y="-8" width="4.8" height="10" fill="#efe4c8" stroke-width=".8"/>
      <path class="flame" d="M0,-20 Q3.2,-15.6 2.6,-12.8 Q1.8,-10.6 0,-10.6 Q-1.8,-10.6 -2.6,-12.8 Q-3.2,-15.6 0,-20 Z" fill="#ffe08a" stroke="none"/>`
      :`<path d="M-9,-22 L-3,-26 M-8,-14 L4,-24" stroke="#6e6e66" stroke-width=".7"/>`}
    <path d="M-12,-27.4 V2.6 M12,-27.4 V2.6" stroke-width="2.2"/>
    <path d="M-5,-27.4 V2.6 M5,-27.4 V2.6" stroke-width="1"/>
    <path d="M-12,-8 H-5 M5,-8 H12" stroke-width=".9"/>
    <path d="M-15,2.6 H15 L12,8.6 H-12 Z" fill="url(#m4IrV)"/>
    <path d="M-10.4,-25 V-2" stroke="#fffbe8" stroke-width=".9" opacity="${lit?.7:.25}"/></g>`;
}

/* ---------------- 磨坊外 ---------------- */
const M4 = {
  wheel:{x:588, y:356, r:68},
  tunnel:'M44,676 L44,610 Q46,566 102,556 Q158,566 160,610 L160,676 Z',
  door:'M378,412 L378,362 Q380,342 394,338 Q408,342 410,362 L410,412 Z'
};
function m4Wheel(){
  // 双轮辋 + 16 片桨板（带侧板厚度）+ 8 根辐条成对夹住轮毂；铁箍与铆钉
  const {r} = M4.wheel; let s='', paddles='', rivet='';
  for(let i=0;i<8;i++) s+=`<g transform="rotate(${i*22.5})"><rect x="-3.4" y="${-r+5}" width="6.8" height="${r*2-10}" fill="url(#m4Wd)"/><path d="M0,${-r+8} V${r-8}" stroke="#2a1e12" stroke-width=".6"/></g>`;
  for(let i=0;i<16;i++){ const a=i*22.5;
    paddles+=`<g transform="rotate(${a})"><path d="M-6,${-r-14} L6,${-r-14} L6,${-r+2} L-6,${-r+2} Z" fill="url(#m4WdV)"/><path d="M6,${-r-14} L9,${-r-12} L9,${-r+2} L6,${-r+2}" fill="#2a1e12"/>
      <path d="M-4.6,${-r-12} V${-r}" stroke="#a4885a" stroke-width=".7" opacity=".7"/></g>`;
    rivet+=`<circle cx="${n4((r-4.5)*Math.cos((a+11.25)*Math.PI/180))}" cy="${n4((r-4.5)*Math.sin((a+11.25)*Math.PI/180))}" r="1.1" fill="#1a1511" stroke="none"/>`; }
  return `<g ${m4s}>${paddles}${s}
    <circle r="${r}" fill="none" stroke="#1a1511" stroke-width="11"/><circle r="${r}" fill="none" stroke="#5a4430" stroke-width="8.4"/>
    <circle r="${r}" fill="none" stroke="#8a6c48" stroke-width="1.2" stroke-dasharray="10 6" opacity=".55"/>
    <circle r="${r-9}" fill="none" stroke="#1a1511" stroke-width="4.4"/><circle r="${r-9}" fill="none" stroke="#4a3826" stroke-width="2.4"/>
    ${rivet}
    <circle r="15" fill="url(#m4Wd)"/><circle r="15" fill="none" stroke="#2a2622" stroke-width="3"/>
    <circle r="7" fill="url(#m4Ir)"/><rect x="-3" y="-3" width="6" height="6" fill="#0c0a08" stroke="none"/>
    ${[0,90,180,270].map(a=>`<circle cx="${n4(11*Math.cos(a*Math.PI/180+.78))}" cy="${n4(11*Math.sin(a*Math.PI/180+.78))}" r="1.3" fill="#1a1511" stroke="none"/>`).join('')}</g>
  <path d="M${-r*.8},${-r*.5} A${r*.94},${r*.94} 0 0 1 ${-r*.3},${-r*.88}" stroke="#d8c8a0" stroke-width="1.4" fill="none" opacity=".4"/>
  <path d="M${-r+6},18 q-4,10 -2,22 M${-r+12},34 q-3,8 -1,16 M${r-6},26 q3,10 0,20" stroke="#4e6a50" stroke-width="2.2" fill="none" opacity=".75" stroke-linecap="round"/>`;
}
function m4OutBackground(){
  let sd = 29; const rr = (a,b)=>{ sd = (sd*16807) % 2147483647; return a + (b-a)*(sd/2147483647); };
  /* ---- 远景：雾里的渡鸦堡（剪影）---- */
  const twr = (x,w,top,rh,base=302)=>`<path d="M${x},${base} V${top} H${x-2} L${n4(x+w/2)},${top-rh} L${x+w+2},${top} H${x+w} V${base} Z"/>`;
  let crenel = 'M104,302 V268'; for(let x=104; x<334; x+=8) crenel += ` V263 H${x+4} V268 H${x+8}`; crenel += ' V302 Z';
  const castle = `<path d="${crenel}"/>` + [[110,14,232,20],[136,18,212,30],[166,12,238,16],[186,26,178,66],[220,16,206,34],[248,12,228,18],[270,20,214,30],[300,14,236,22],[322,12,250,14]].map(t=>twr(...t)).join('');
  /* ---- 柏树：火焰形剪影 ---- */
  const cyp = (x,b,h,w)=>`<path d="M${x},${b-h} C${n4(x+w*.55)},${n4(b-h*.72)} ${n4(x+w*.62)},${n4(b-h*.28)} ${n4(x+w*.36)},${b} L${n4(x-w*.36)},${b} C${n4(x-w*.62)},${n4(b-h*.28)} ${n4(x-w*.55)},${n4(b-h*.72)} ${x},${b-h} Z"/>`;
  /* ---- 枯树：递归分枝 ---- */
  const tw = ['', '', '', '', '', ''];
  const branch = (x,y,ang,len,d)=>{ const x2=x+len*Math.cos(ang), y2=y+len*Math.sin(ang);
    const mx=(x+x2)/2+rr(-1,1)*len*.14, my=(y+y2)/2+rr(-1,1)*len*.14;
    tw[d] += `M${n4(x)},${n4(y)} Q${n4(mx)},${n4(my)} ${n4(x2)},${n4(y2)} `;
    if(d<5){ const n = d<2 ? 2 : (rr(0,1)<.5 ? 2 : 3);
      for(let i=0;i<n;i++) branch(x2, y2, ang + rr(-.45,.45) + (i-(n-1)/2)*.42, len*rr(.6,.76), d+1); } };
  branch(30,300,-.72,88,1); branch(28,252,-1.08,78,1); branch(26,226,-1.62,64,1); branch(34,362,-.42,54,1);
  const treeW = [0,7,4.4,2.8,1.7,1.05];
  /* ---- 草丛（左侧草地）---- */
  const pathL = y=> 368 - (y-446)*.32, pathR = y=> 422 + (y-446)*.32, wL = y=> 466 + (y-452)*.195;
  let grassD='', grassL='';
  for(let i=0;i<300;i++){ const x=rr(0,480), y=rr(418,709);
    if(y>440 && x>pathL(y)-6 && x<pathR(y)+6) continue; if(y>446 && x>wL(y)-4) continue;
    const h=4+(y-418)*.05, s=`M${n4(x)},${n4(y)} q-1,${n4(-h*.6)} -3,${n4(-h)} M${n4(x+1)},${n4(y)} q0,${n4(-h*.7)} .4,${n4(-h*1.25)} M${n4(x+2)},${n4(y)} q1,${n4(-h*.6)} 3.4,${n4(-h*.9)} `;
    if(rr(0,1)<.55) grassD+=s; else grassL+=s; }
  /* ---- 麦田：按深度分四层，近大远小 ---- */
  const stem=['','','',''], headA=['','','',''], headB=['','','',''];
  for(let y=446; y<716; ){ const k=(y-446)/263, h=7+k*46, sp=3.8+k*9, b=Math.min(3, Math.floor(k*4));
    for(let x=wL(y)+rr(2,sp); x<836; x+=sp*rr(.7,1.3)){
      const yy=y+rr(-1.5,1.5)*(1+k*3), lean=(rr(-1,1)*.16+.12)*h, tx=x+lean, ty=yy-h, hx=x+lean*.6, hy=yy-h*.62;
      stem[b] += `M${n4(x)},${n4(yy)} Q${n4(x+lean*.2)},${n4(yy-h*.4)} ${n4(hx)},${n4(hy)}`;
      (rr(0,1)<.55 ? headA : headB)[b] += `M${n4(hx)},${n4(hy)} L${n4(tx)},${n4(ty)}`; }
    y += 4 + k*11; }
  const field = [0,1,2,3].map(b=>`<path d="${stem[b]}" stroke="#5a4826" stroke-width="${[.55,.8,1.1,1.4][b]}" fill="none"/>
    <path d="${headB[b]}" stroke="#6e5a30" stroke-width="${[1.8,2.6,3.4,4.4][b]}" stroke-linecap="round" fill="none"/>
    <path d="${headA[b]}" stroke="#a48a4c" stroke-width="${[1.8,2.6,3.4,4.4][b]}" stroke-linecap="round" fill="none"/>`).join('');
  /* ---- 屋顶瓦行 ---- */
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
  let tiles=''; for(let i=1;i<9;i++){ const t=i/9, p=lerp([393,208],[452,278],t), q=lerp([506,224],[568,294],t);
    tiles += `M${n4(p[0])},${n4(p[1])} L${n4(q[0])},${n4(q[1])} `; }
  let tileSeam=''; for(let i=0;i<9;i++){ const t0=i/9, t1=(i+1)/9; for(let j=1;j<12;j++){ const u=j/12+(i%2?.04:0); if(u>=1) continue;
    const a=lerp(lerp([393,208],[506,224],u), lerp([452,278],[568,294],u), t0), c=lerp(lerp([393,208],[506,224],u), lerp([452,278],[568,294],u), t1);
    tileSeam += `M${n4(a[0])},${n4(a[1])} L${n4(c[0])},${n4(c[1])} `; } }
  /* ---- 地道口：拱券石 ---- */
  let vous=''; for(let i=0;i<11;i++){ const a0=Math.PI*(1+i/11), a1=Math.PI*(1+(i+1)/11), cx=102, cy=612, ri=[58,56], ro=[78,74];
    const P=(r,a)=>`${n4(cx+r[0]*Math.cos(a))},${n4(cy+r[1]*Math.sin(a))}`;
    vous += `<path d="M${P(ri,a0)} L${P(ro,a0)} L${P(ro,a1)} L${P(ri,a1)} Z" fill="${i===5?'#9a9584':i%2?'#7e7a6a':'#8a8676'}"/>`; }
  let jamb=''; [[24,44],[160,180]].forEach(([x0,x1],s)=>{ for(let y=612,i=0; y<709; y+=22,i++){ const o=(i+s)%2?4:0;
    jamb += `<rect x="${x0-o}" y="${y}" width="${x1-x0+o}" height="22" fill="${i%2?'#7a7666':'#858170'}"/>`; } });

  return `
  <defs>
    <filter id="m4-rough" filterUnits="userSpaceOnUse" x="-10" y="-10" width="848" height="729">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="51" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="m4-blur"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="m4-cloud" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="m4-mist" x="-30%" y="-150%" width="160%" height="400%"><feGaussianBlur stdDeviation="9"/></filter>
    <linearGradient id="m4-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#555853"/><stop offset=".42" stop-color="#7a7d76"/><stop offset=".78" stop-color="#9c9c90"/><stop offset="1" stop-color="#a9a796"/></linearGradient>
    <linearGradient id="m4-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#666450"/><stop offset=".5" stop-color="#504d3a"/><stop offset="1" stop-color="#36332a"/></linearGradient>
    <linearGradient id="m4-wheat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76683e"/><stop offset=".5" stop-color="#5e4e2a"/><stop offset="1" stop-color="#3a3020"/></linearGradient>
    <linearGradient id="m4-path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a7258"/><stop offset="1" stop-color="#5e5642"/></linearGradient>
    <linearGradient id="m4-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4644"/><stop offset=".5" stop-color="#55666a"/><stop offset="1" stop-color="#2e3836"/></linearGradient>
    <linearGradient id="m4-fogband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3c5bd" stop-opacity="0"/><stop offset=".5" stop-color="#c3c5bd" stop-opacity=".6"/><stop offset="1" stop-color="#c3c5bd" stop-opacity="0"/></linearGradient>
    <linearGradient id="m4-wallF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e8977"/><stop offset=".7" stop-color="#7e7968"/><stop offset="1" stop-color="#5e5a4c"/></linearGradient>
    <linearGradient id="m4-wallS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#625e52"/><stop offset="1" stop-color="#55524a"/></linearGradient>
    <radialGradient id="m4-hole" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#020101"/><stop offset=".7" stop-color="#0c0a08"/><stop offset="1" stop-color="#1e1a14"/></radialGradient>
    <clipPath id="m4-clipTunnel"><path d="${M4.tunnel}"/></clipPath>
  </defs>
  <!-- 天空 + 低云 -->
  <rect width="828" height="709" fill="url(#m4-sky)"/>
  <g filter="url(#m4-cloud)">
    <ellipse cx="140" cy="56" rx="260" ry="34" fill="#45483f" opacity=".45"/><ellipse cx="560" cy="34" rx="330" ry="40" fill="#45483f" opacity=".5"/>
    <ellipse cx="780" cy="120" rx="200" ry="26" fill="#4e5149" opacity=".35"/><ellipse cx="330" cy="150" rx="280" ry="20" fill="#bdbcae" opacity=".35"/>
    <ellipse cx="660" cy="196" rx="240" ry="18" fill="#bdbcae" opacity=".3"/>
  </g>
  <path d="M352,118 q4,-3 8,0 q4,-3 8,0 M380,104 q3,-2.4 6,0 q3,-2.4 6,0 M404,124 q2.4,-2 5,0 q2.4,-2 5,0" stroke="#3a3a34" stroke-width="1.3" fill="none" opacity=".7"/>
  <!-- 远山与城堡 -->
  <path d="M0,320 Q70,294 140,298 Q220,292 300,298 Q380,306 440,330 Q480,344 520,352 L520,420 L0,420 Z" fill="#878a84"/>
  <path d="M480,352 Q600,322 700,332 Q780,338 828,328 V420 H480 Z" fill="#8d9089"/>
  <g fill="#6c706c">${castle}</g>
  <g fill="#c9b07a" opacity=".55"><rect x="196" y="214" width="3" height="5"/><rect x="141" y="236" width="2.4" height="4"/><rect x="276" y="240" width="2.4" height="4"/></g>
  <g fill="#82867f">${cyp(258,382,110,24)}${cyp(284,386,140,30)}${cyp(312,390,92,22)}${cyp(612,374,96,22)}${cyp(640,378,128,28)}</g>
  <rect x="0" y="226" width="828" height="130" fill="url(#m4-fogband)"/>
  <g fill="#6a6f6a">${cyp(702,388,172,32)}${cyp(738,392,122,24)}${cyp(796,394,152,30)}${cyp(232,396,78,18)}</g>
  <g stroke="#5a5f5a" stroke-width="1" fill="none" opacity=".7"><path d="M700,240 q4,30 -2,60 q-4,30 2,70 M796,268 q4,30 -2,60 q-2,30 2,50 M738,300 q3,30 -2,70"/></g>
  <rect x="0" y="326" width="828" height="104" fill="url(#m4-fogband)"/>
  <!-- 地面 -->
  <path d="M0,404 Q180,394 400,402 Q620,410 828,398 V709 H0 Z" fill="url(#m4-ground)"/>
  <g filter="url(#m4-rough)" ${m4k}>
    <!-- 枯树 -->
    <path d="M6,709 C14,620 18,520 22,430 C24,360 20,300 24,232 L34,230 C38,300 40,360 42,430 C44,520 48,620 56,709 Z" fill="#2c2822"/>
    <path d="M28,250 C30,320 34,420 36,520 M22,330 C24,380 26,440 28,500" stroke="#4a443a" stroke-width="1.2" fill="none"/>
    ${[1,2,3,4,5].map(d=>`<path d="${tw[d]}" stroke="#2c2822" stroke-width="${treeW[d]}" fill="none" stroke-linecap="round"/>`).join('')}
    <path d="${tw[1]}" stroke="#4e463a" stroke-width="1.6" fill="none" opacity=".6" transform="translate(-1.6,-1.6)"/>
    <!-- 磨坊 · 侧披屋 -->
    <path d="M288,414 V346 L344,320 V414 Z" fill="#767264"/>
    <path d="M288,414 V346 L344,320 V414 Z" fill="url(#m4Ashlar)" stroke="none" opacity=".8"/>
    <path d="M304,394 V372 H320 V394 Z" fill="#161411"/><path d="M312,372 V394 M304,383 H320" stroke="#4a463c" stroke-width="1.2"/>
    <path d="M280,350 L348,310 L352,319 L284,359 Z" fill="#3c3530"/>
    <path d="M286,352 L348,316 M290,356 L350,320" stroke="#5a5046" stroke-width=".9" fill="none"/>
    <!-- 磨坊 · 正面山墙 -->
    <path d="M340,414 V272 L393,214 L446,272 V414 Z" fill="url(#m4-wallF)"/>
    <path d="M340,414 V272 L393,214 L446,272 V414 Z" fill="url(#m4Ashlar)" stroke="none"/>
    <!-- 磨坊 · 侧墙（背光） -->
    <path d="M446,414 V272 L562,288 V410 Z" fill="url(#m4-wallS)"/>
    <path d="M446,414 V272 L562,288 V410 Z" fill="url(#m4Ashlar)" stroke="none" opacity=".6"/>
    <path d="M446,414 V272 L562,288 V410 Z" fill="#14100c" opacity=".18" stroke="none"/>
    ${[0,1,2,3,4,5,6,7].map(i=>{ const y=280+i*16.5, w=i%2?10:16; return `<path d="M${446-w},${y} H446 V${y+16} H${446-w} Z" fill="#9a9584" stroke-width="1"/>`; }).join('')}
    <path d="M336,404 H446 L562,400 V412 L446,416 H336 Z" fill="#55513f"/>
    <path d="M342,412 q8,-10 18,-4 q10,-7 18,-1 M418,412 q8,-8 16,-3 q6,-5 12,0 M452,412 q10,-9 22,-3 q8,-6 18,0 q10,-7 20,-1" stroke="#3e4630" stroke-width="2.2" fill="none"/>
    <path d="M352,330 q2,30 -2,74 M434,300 q-2,40 2,104 M476,340 q2,30 -1,62" stroke="#4a463a" stroke-width="1.6" fill="none" opacity=".45"/>
    <!-- 塔楼（在屋脊后） -->
    <path d="M470,236 V166 H504 V236 Z" fill="#8a8574"/><path d="M470,236 V166 H504 V236 Z" fill="url(#m4Ashlar)" stroke="none"/>
    <path d="M504,236 V166 L520,170 V236 Z" fill="#5c584e"/>
    <path d="M481,204 V186 Q487,176 493,186 V204 Z" fill="#121010"/><path d="M480,206 H494" stroke-width="2.4"/>
    <path d="M464,168 H510 V174 H464 Z M510,168 L524,172 V178 L510,174 Z" fill="#6a6658"/>
    <path d="M466,168 L489,126 L510,168 Z" fill="#3c3530"/><path d="M489,126 L510,168 L524,172 Z" fill="#2a241f"/>
    <path d="M475,160 L489,134 M500,160 L489,134" stroke="#56493e" stroke-width=".9" fill="none"/>
    <path d="M489,126 V104" stroke="#1a1511" stroke-width="1.6"/><path d="M480,110 L498,110 M480,110 l4,-3 M480,110 l4,3 M498,110 l-5,-4 l0,8 Z" stroke="#1a1511" stroke-width="1.2" fill="#1a1511"/><circle cx="489" cy="104" r="1.6" fill="#1a1511" stroke="none"/>
    <!-- 屋顶（侧坡，瓦行 + 苔斑） -->
    <path d="M393,208 L506,224 L568,294 L452,278 Z" fill="#463d36"/>
    <path d="${tileSeam}" stroke="#2e2822" stroke-width=".7" fill="none" opacity=".75"/>
    <path d="${tiles}" stroke="#2a241f" stroke-width="1.3" fill="none"/>
    <path d="M430,236 l14,2 l4,8 l-14,-2 Z M500,262 l16,2 l5,9 l-16,-2 Z" fill="#2a241f" stroke="none"/>
    <path d="M462,256 q10,-4 18,2 q-6,6 -18,-2 Z M528,276 q8,-3 14,2 q-6,5 -14,-2 Z M420,226 q6,-3 12,1 q-4,4 -12,-1 Z" fill="#5a6240" stroke="none" opacity=".85"/>
    <path d="M393,208 L506,224" stroke="#2a241e" stroke-width="5" stroke-linecap="round"/>
    <path d="M452,278 L568,294" stroke="#2a241e" stroke-width="2.6"/>
    <!-- 山墙封檐板 + 吊货门 -->
    <path d="M330,278 L393,206 L456,278" stroke="#1a1511" stroke-width="9" fill="none" stroke-linejoin="miter"/>
    <path d="M330,278 L393,206 L456,278" stroke="#4e4032" stroke-width="5.6" fill="none" stroke-linejoin="miter"/>
    <path d="M382,264 V238 H404 V264 Z" fill="url(#m4WdV)"/><path d="M389,238 V264 M397,238 V264" stroke="#2a1e12" stroke-width=".8"/>
    <path d="M380,264 H406" stroke-width="2.4"/>
    <rect x="388" y="221" width="10" height="10" fill="url(#m4Wd)"/>
    <path d="M393,231 V276" stroke="#3a3024" stroke-width="1.4"/><path d="M393,276 q-4,0 -4,4 q0,4 4,3" stroke="#1a1511" stroke-width="1.6" fill="none"/>
    <!-- 窗 -->
    <path d="M414,328 V304 Q422,292 430,304 V328 Z" fill="#141210"/><path d="M422,298 V328 M414,314 H430" stroke="#5a564a" stroke-width="1.2"/>
    <path d="M410,330 H434" stroke="#6a6458" stroke-width="3"/>
    <path d="M466,342 V322 L482,324 V344 Z" fill="#121010"/><path d="M474,323 V343" stroke="#4a463c" stroke-width="1.1"/>
    <path d="M464,346 L484,347" stroke="#5a564a" stroke-width="2.6"/>
    <path d="M418,332 q2,16 -1,30 M472,348 q2,14 0,26" stroke="#3a362e" stroke-width="1.4" fill="none" opacity=".5"/>
    <!-- 门 -->
    <path d="M370,414 L370,358 Q372,330 394,326 Q416,330 418,358 L418,414" fill="#7a7666"/>
    ${[...Array(7)].map((_,i)=>{ const a=Math.PI*(1+i/6); return `<path d="M${n4(394+20*Math.cos(a))},${n4(360+30*Math.sin(a))} L${n4(394+25*Math.cos(a))},${n4(360+35*Math.sin(a))}" stroke="#4e4a3e" stroke-width="1.2"/>`; }).join('')}
    <path d="${M4.door}" fill="url(#m4WdV)"/>
    <path d="M386,343 V412 M394,340 V412 M402,343 V412" stroke="#2a1e12" stroke-width=".8"/>
    <path d="M378,366 H410 M378,396 H410" stroke="#1a1511" stroke-width="2.6"/>
    <circle cx="404" cy="384" r="2" fill="#1a1511" stroke="none"/>
    <!-- 水车坑石墙 -->
    <path d="M556,392 L712,388 L712,416 L556,418 Z" fill="#6e6a5c"/>
    <path d="M556,392 L712,388 L712,416 L556,418 Z" fill="url(#m4Ashlar)" stroke="none" opacity=".8"/>
    <path d="M556,392 L712,388" stroke="#9a9584" stroke-width="1.4"/>
    <!-- 水槽支架 -->
    ${[700,760].map(x=>`<path d="M${x-4},${408} V${284-(x-598)*.035}" stroke="#1a1511" stroke-width="9"/><path d="M${x-4},${408} V${284-(x-598)*.035}" stroke="#5a4636" stroke-width="5.6"/>
      <path d="M${x-12},410 h16 v-10 h-16 Z" fill="#7a7666"/>`).join('')}
    <path d="M696,330 L756,302 M696,302 L756,330 M756,330 L828,298 M756,302 L828,330" stroke="#1a1511" stroke-width="5" fill="none"/>
    <path d="M696,330 L756,302 M696,302 L756,330 M756,330 L828,298 M756,302 L828,330" stroke="#4a3a2a" stroke-width="2.6" fill="none"/>
    <path d="M598,280 L828,272 L828,288 L600,296 Z" fill="url(#m4WdV)"/>
    <path d="M600,288 L828,280" stroke="#2a1e12" stroke-width=".8"/>
    ${[640,700,760,810].map(x=>`<path d="M${x},${280-(x-598)*.035} v16" stroke="#2a1e12" stroke-width="1.2"/>`).join('')}
    <path d="M600,296 L828,288" stroke-width="1.2"/>
    <path d="M606,296 q2,8 -1,14 M664,294 q2,6 0,10" stroke="#4e6a50" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
    <!-- 水闸 -->
    <rect x="636" y="252" width="34" height="46" fill="url(#m4Wd)"/>
    <rect x="642" y="256" width="22" height="38" fill="#6a5440"/>
    <path d="M642,268 H664 M642,280 H664" stroke="#3a2e22" stroke-width="1.4"/>
    <path d="M647,256 V294 M659,256 V294" stroke="#4a3a2a" stroke-width=".7"/>
    <path d="M634,260 h38 M634,290 h38" stroke="url(#m4IrV)" stroke-width="3.4"/>
    ${[[636,260],[670,260],[636,290],[670,290]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="#1a1511" stroke="none"/>`).join('')}
    <circle cx="653" cy="250" r="7.6" fill="url(#m4Ir)"/><rect x="649" y="246" width="8" height="8" fill="#0c0a08" stroke="none"/>
    <!-- 水车 -->
    <g transform="translate(${M4.wheel.x},${M4.wheel.y})"><g id="m4Wheel">${m4Wheel()}</g></g>
    <path d="M520,356 H576" stroke="#1a1511" stroke-width="9"/><path d="M520,356 H576" stroke="url(#m4IrV)" stroke-width="6"/>
    <rect x="512" y="346" width="12" height="20" rx="2" fill="url(#m4Wd)"/>
    <!-- 水渠：后岸 / 水面 / 前岸石 -->
    <path d="M232,412 L712,410 L712,418 L232,420 Z" fill="#8a8676"/>
    <path d="M232,418 L712,416 L720,446 L226,448 Z" fill="url(#m4-water)"/>
    <path d="M260,426 q22,-3 44,0 M330,432 q30,-3 60,0 M452,428 q26,-3 52,0 M540,436 q30,-3 60,0 M620,426 q22,-3 44,0 M300,440 q20,-2 40,0" stroke="#9fb2b0" stroke-width="1.3" fill="none" opacity=".75"/>
    <path d="M240,422 L700,420" stroke="#1a1612" stroke-width="2" opacity=".5"/>
    ${[...Array(17)].map((_,i)=>{ const x=228+i*29; return `<path d="M${x},448 q1,-5 6,-6 h16 q6,1 6,6 v6 h-28 Z" fill="${i%2?'#6e6a5a':'#7a7666'}" stroke-width="1.2"/>`; }).join('')}
    <!-- 木桥 -->
    <path d="M362,410 H426 L430,452 H358 Z" fill="url(#m4WdV)"/>
    <path d="M361,420 H427 M360,430 H428 M359,441 H429" stroke="#2a1e12" stroke-width="1"/>
    <path d="M362,410 L358,452 M426,410 L430,452" stroke="#1a1511" stroke-width="3.6"/>
    <!-- 小路：车辙 + 积水 + 碎石 -->
    <path d="M366,450 C350,520 352,580 318,640 Q300,676 276,709 L500,709 Q474,668 470,630 C462,560 428,520 424,450 Z" fill="url(#m4-path)" stroke="none"/>
    <path d="M366,450 C350,520 352,580 318,640 Q300,676 276,709 M424,450 C428,520 462,560 470,630 Q474,668 500,709" stroke="#3e3a2c" stroke-width="1.6" fill="none"/>
    <path d="M384,456 C376,540 372,600 352,650 Q342,680 334,709 M406,456 C412,540 420,600 424,650 Q430,684 440,709" stroke="#4e4836" stroke-width="3.4" fill="none" opacity=".55"/>
    <ellipse cx="404" cy="604" rx="30" ry="6.4" fill="#8a918c" stroke="#4e4836" stroke-width="1.2"/>
    <path d="M388,602 q10,-2 22,0" stroke="#c4cac2" stroke-width="1" fill="none" opacity=".8"/>
    <g fill="#4e4a3a" stroke="none">${[[392,470,3,1.4],[410,512,4,1.8],[370,560,5,2.2],[430,560,4,1.8],[350,650,6,2.6],[460,676,6,2.4],[400,676,4,1.8],[372,520,3,1.2]].map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
  </g>
  <!-- 草丛 -->
  <path d="${grassD}" stroke="#34321f" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="${grassL}" stroke="#7a7656" stroke-width="1" fill="none" stroke-linecap="round" opacity=".85"/>
  <!-- 麦田 -->
  <path d="M466,452 Q600,432 828,440 V709 H516 Q504,580 466,452 Z" fill="url(#m4-wheat)"/>
  <path d="M466,452 Q600,432 828,440" stroke="#5a4826" stroke-width="2" fill="none"/>
  ${field}
  <g filter="url(#m4-rough)" ${m4k}>
    <!-- 提灯柱（钩子上只剩半截链子） -->
    <path d="M246,560 L246,312 M252,316 L176,316 M246,346 L218,316" stroke="#1a1511" stroke-width="9" fill="none"/>
    <path d="M246,560 L246,312 M252,316 L176,316 M246,346 L218,316" stroke="#4a3826" stroke-width="6" fill="none"/>
    <path d="M243.6,318 V556" stroke="#8a6c48" stroke-width="1" opacity=".6"/>
    <path d="M186,316 v12 q0,6 -5,8" stroke="#1a1511" stroke-width="2.4" fill="none"/>
    <path d="M181,336 v5 M181,343 v5 M180,350 l-2,4" stroke="#2a2622" stroke-width="2" stroke-linecap="round"/>
    <path d="M238,560 h16 l2,6 h-20 Z" fill="#6e6a5a"/>
    <!-- 马车 -->
    <ellipse cx="146" cy="512" rx="104" ry="9" fill="#1e1a12" opacity=".4" stroke="none"/>
    <path d="M62,382 L232,374 L236,440 L58,448 Z" fill="url(#m4WdV)"/>
    <path d="M62,404 L234,396 M60,426 L235,418" stroke="#2a1e12" stroke-width="1.6"/>
    <path d="M62,390 Q120,386 232,382 M61,412 Q140,408 234,404 M60,434 Q130,430 235,426" stroke="#8a6c48" stroke-width=".7" fill="none" opacity=".55"/>
    <path d="M100,380 V446 M150,378 V444 M200,376 V442" stroke="#1a1511" stroke-width="3.6"/>
    <path d="M100,380 V446 M150,378 V444 M200,376 V442" stroke="url(#m4IrV)" stroke-width="2.2"/>
    ${[[100,386],[100,440],[150,384],[150,438],[200,382],[200,436]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="#c8bca0" stroke="none"/>`).join('')}
    <path d="M120,440 q4,10 0,20 M180,436 q-3,8 1,14" stroke="#3e4630" stroke-width="2" fill="none"/>
    <path d="M58,448 L46,382 M236,440 L246,374" stroke="#1a1511" stroke-width="7"/>
    <path d="M58,448 L46,382 M236,440 L246,374" stroke="#5a4430" stroke-width="4.4"/>
    <path d="M232,430 L320,466 M232,416 L322,452" stroke="#1a1511" stroke-width="7"/>
    <path d="M232,430 L320,466 M232,416 L322,452" stroke="#5a4430" stroke-width="4.4"/>
    <path d="M58,448 L236,440 L236,446 L58,454 Z" fill="#2a1e12"/>
    <g transform="translate(108,468)">
      <circle r="44" fill="none" stroke="#1a1511" stroke-width="10.6"/>
      <circle r="44" fill="none" stroke="#5a4430" stroke-width="8"/>
      <circle r="47.6" fill="none" stroke="url(#m4Ir)" stroke-width="2.4"/>
      ${[0,30,60,90,120,150].map(a=>`<g transform="rotate(${a})"><path d="M-2.6,-40 L2.6,-40 L3.6,-9 L-3.6,-9 Z M-2.6,40 L2.6,40 L3.6,9 L-3.6,9 Z" fill="url(#m4Wd)" stroke-width="1"/></g>`).join('')}
      <circle r="11" fill="url(#m4Wd)"/><circle r="5" fill="url(#m4Ir)"/>
      ${[...Array(12)].map((_,i)=>`<circle cx="${n4(44*Math.cos(i*Math.PI/6+.26))}" cy="${n4(44*Math.sin(i*Math.PI/6+.26))}" r="1" fill="#1a1511" stroke="none"/>`).join('')}
      <path d="M-36,-26 A44,44 0 0 1 -14,-42" stroke="#a88c62" stroke-width="1.4" fill="none" opacity=".6"/>
    </g>
    <!-- 地道口：土坡 + 拱券 + 侧墙石 -->
    <path d="M0,709 Q6,606 102,522 Q204,600 216,709 Z" fill="#48452f"/>
    <path d="M10,640 q8,-14 6,-26 M40,560 q6,-10 4,-20 M190,630 q-6,-12 -3,-24 M170,566 q-4,-8 -2,-16" stroke="#3a4228" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${jamb}${vous}
    <path d="${M4.tunnel}" fill="url(#m4-hole)"/>
    <g clip-path="url(#m4-clipTunnel)" stroke="#2a2620" stroke-width="1" opacity=".7"><path d="M44,620 h116 M44,646 h116"/><path d="M70,620 v26 M128,620 v26 M100,646 v30 M56,646 v30 M150,646 v30"/></g>
    <path d="M38,676 H166 L172,690 H32 Z" fill="#6e6a5a"/>
    <path d="M58,560 q-2,14 2,26 M66,556 q0,10 3,18 M140,558 q2,12 -1,22 M150,566 q1,8 -2,14" stroke="#4e6236" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- 篱笆：左 -->
    ${[[200,560,640],[260,548,626],[320,540,618]].map(([x,t,b])=>`<path d="M${x-5},${b} L${x-4},${t+4} L${x-1},${t-3} L${x+3},${t+1} L${x+5},${t+5} L${x+5},${b} Z" fill="url(#m4Wd)"/>`).join('')}
    <path d="M196,580 Q262,574 330,556 M196,610 Q262,604 330,586" stroke="#1a1511" stroke-width="6" fill="none"/>
    <path d="M196,580 Q262,574 330,556 M196,610 Q262,604 330,586" stroke="#5a4430" stroke-width="3.6" fill="none"/>
    <path d="M198,578 Q262,572 328,554" stroke="#8a6c48" stroke-width=".8" fill="none" opacity=".6"/>
    <!-- 篱笆：右（下横杆断了一截） -->
    ${[[520,640],[600,628],[680,616],[760,606]].map(([x,t])=>`<path d="M${x-5},709 L${x-5},${t+6} L${x-1},${t-5} L${x+3},${t} L${x+5},${t+6} V709 Z" fill="url(#m4Wd)"/>`).join('')}
    <path d="M520,664 Q656,650 790,626 M520,690 Q600,682 690,668" stroke="#1a1511" stroke-width="7" fill="none"/>
    <path d="M520,664 Q656,650 790,626 M520,690 Q600,682 690,668" stroke="#5a4430" stroke-width="4.4" fill="none"/>
    <path d="M522,662 Q656,648 788,624" stroke="#8a6c48" stroke-width=".9" fill="none" opacity=".6"/>
    <path d="M690,668 l6,-2 l-3,5 Z" fill="#5a4430"/>
    <path d="M764,656 L800,690" stroke="#1a1511" stroke-width="7"/><path d="M764,656 L800,690" stroke="#5a4430" stroke-width="4.4"/>
    ${[[600,651],[680,640],[600,679],[680,668],[760,630]].map(([x,y])=>`<path d="M${x-6},${y-3} l12,6 M${x-6},${y+3} l12,-6" stroke="#8a7a52" stroke-width="1.2"/>`).join('')}
    <path d="M196,640 q4,-12 2,-22 M204,642 q-2,-10 2,-18 M316,620 q4,-10 2,-18 M514,709 q2,-14 -2,-26 M528,709 q-2,-12 2,-22 M596,709 q2,-10 0,-20" stroke="#34321f" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
  <!-- 贴地雾 -->
  <g filter="url(#m4-mist)" fill="#c6c8c0">
    <ellipse cx="180" cy="424" rx="220" ry="13" opacity=".35"/><ellipse cx="560" cy="430" rx="260" ry="11" opacity=".3"/>
    <ellipse cx="800" cy="420" rx="120" ry="10" opacity=".3"/><ellipse cx="660" cy="470" rx="200" ry="8" opacity=".18"/>
  </g>
  <rect width="828" height="709" fill="#5a4a30" opacity=".08" style="mix-blend-mode:multiply"/>`;
}

/* ---------------- 磨坊内（参考图：粗木框架 / 右上大齿轮 / 料斗 / 圆形石台上的磨盘 / 右侧楼梯与拱门） ---------------- */
const MI4 = {
  drive:{x:610, y:200}, crown:{x:400, y:200},
  stone:{x:400, y:404},
  door:()=>`${rw(822,372)} ${rw(780,372)} ${rw(780,628)} ${rw(822,628)}`
};
function m4BigWheel(r){
  // 立式大齿轮（木齿嵌在轮辋上）：双圈轮辋 + 8 根辐条 + 铁箍轮毂
  let cogs=''; for(let i=0;i<28;i++) cogs+=`<g transform="rotate(${n4(i*360/28)})"><path d="M-4.6,${-r-13} L4.6,${-r-13} L5.6,${-r+3} L-5.6,${-r+3} Z" fill="url(#m4WdV)"/><path d="M-3,${-r-11.4} V${-r}" stroke="#a4885a" stroke-width=".6" opacity=".6"/></g>`;
  let spokes=''; for(let i=0;i<8;i++) spokes+=`<g transform="rotate(${i*22.5})"><path d="M-5,${-r+8} L5,${-r+8} L6,${-r*.3} L-6,${-r*.3} Z" fill="url(#m4Wd)"/></g>`;
  let rv=''; for(let i=0;i<16;i++){ const a=i*Math.PI/8+.2; rv+=`<circle cx="${n4((r-1)*Math.cos(a))}" cy="${n4((r-1)*Math.sin(a))}" r="1.3" fill="#120e0a" stroke="none"/>`; }
  return `<g stroke="#15110d" stroke-width="1.5" stroke-linejoin="round">${cogs}
    <circle r="${r}" fill="none" stroke="#15110d" stroke-width="18.4"/><circle r="${r}" fill="none" stroke="#5a4230" stroke-width="15.4"/>
    <circle r="${r+4}" fill="none" stroke="#7a5e40" stroke-width="1.4" opacity=".8"/>
    <circle r="${r-5}" fill="none" stroke="#3a2a1c" stroke-width="1" stroke-dasharray="14 5"/>
    ${spokes}
    <circle r="${r*.34}" fill="url(#m4Wd)"/><circle r="${r*.34}" fill="none" stroke="url(#m4Ir)" stroke-width="4"/>
    ${[...Array(8)].map((_,i)=>`<circle cx="${n4(r*.26*Math.cos(i*Math.PI/4))}" cy="${n4(r*.26*Math.sin(i*Math.PI/4))}" r="1.4" fill="#120e0a" stroke="none"/>`).join('')}
    ${rv}</g>
  <circle r="${r+12}" fill="url(#m4Shade)" pointer-events="none"/>
  <path d="M${n4(-r*.9)},${n4(-r*.36)} A${r},${r} 0 0 1 ${n4(-r*.36)},${n4(-r*.9)}" stroke="#d8c8a0" stroke-width="1.6" fill="none" opacity=".4"/>`;
}
function m4InBackground(){
  let lws='', rws=''; for(let hy=60; hy<628; hy+=60){ lws+=`<path d="M${lw(0,hy)} L${lw(150,hy)}"/>`; rws+=`<path d="M${rw(828,hy)} L${rw(678,hy)}"/>`; }
  let planks=''; for(let x=-600;x<=1428;x+=50) planks+=`<path d="M${(VPX+(x-VPX)*(520-VPY)/(709-VPY)).toFixed(1)},520 L${x},709"/>`;
  // 记账木签：每根有刻痕；1316/1349/1382/1415 那几根带鸦爪印（暗红）
  let sticks=''; for(let i=0;i<11;i++){ const x=256+i*8, y=178+(i%3)*3, h=70-(i%4)*6, claw = i%4===3;
    let notch=''; for(let j=0;j<4+(i*3)%5;j++) notch+=`M${x},${y+10+j*6} l2.4,1.4 `;
    sticks+=`<rect x="${x}" y="${y}" width="5" height="${h}" rx="1" fill="${claw?'#7a6a4e':'#a8946a'}" stroke="#1a1511" stroke-width="1"/>
      <circle cx="${x+2.5}" cy="${y+3}" r="1" fill="#1a1511"/><path d="M${x+2.5},${y-4} V${y+2}" stroke="#3a2e22" stroke-width=".7"/>
      <path d="${notch}" stroke="#4a3a2a" stroke-width=".7" fill="none"/>
      ${claw?`<path d="M${x+2.5},${y+h-8} l-1.6,-3 M${x+2.5},${y+h-8} v-3.4 M${x+2.5},${y+h-8} l1.6,-3" stroke="#7a1e16" stroke-width=".8"/>`:''}
      <path d="M${x+1},${y+2} V${y+h-2}" stroke="#d8c49a" stroke-width=".5" opacity=".6"/>`; }
  let flour=''; for(let i=0;i<46;i++){ const x=230+(i*37)%380, y=540+(i*23)%150; flour+=`<circle cx="${x}" cy="${y}" r="${1+(i%3)*.6}"/>`; }
  const {x:sx, y:sy} = MI4.stone;
  let dais=''; for(let i=0;i<9;i++){ const a0=Math.PI*(i/9), a1=Math.PI*((i+1)/9), x0=sx-158*Math.cos(a0), x1=sx-158*Math.cos(a1);
    dais+=`<path d="M${x0.toFixed(1)},${(sy+66+32*Math.sin(a0)).toFixed(1)} L${x1.toFixed(1)},${(sy+66+32*Math.sin(a1)).toFixed(1)} L${x1.toFixed(1)},${(sy+110+32*Math.sin(a1)).toFixed(1)} L${x0.toFixed(1)},${(sy+110+32*Math.sin(a0)).toFixed(1)} Z" fill="${['#6e6a5e','#7e7a6c','#8a8576','#928d7e','#8e897a','#86817a','#7a766a','#6e6a5e','#625e54'][i]}"/>
      <path d="M${n4((x0+x1)/2-4)},${n4(sy+84+32*Math.sin((a0+a1)/2))} l6,2" stroke="#4e4a40" stroke-width=".8"/>`; }
  // 靠右墙的木梯：两根梯帮贴着右墙的透视（底部略向屋内外撇），横档按透视逐级缩短；中间断了两级
  const LAD = {a:720, b:756, hy0:628, hy1:40, dx:-12, dy:8};
  const ladPt = (x, t)=>{ const [px,py] = rw(x, LAD.hy0+(LAD.hy1-LAD.hy0)*t).split(',').map(Number);
    return [+n4(px+LAD.dx*(1-t)), +n4(py+LAD.dy*(1-t))]; };
  let steps=''; for(let i=1;i<=15;i++){ const t=i/16; const [x0,y0]=ladPt(LAD.a,t), [x1,y1]=ladPt(LAD.b,t);
    if(i===9 || i===10){ steps+= i===9 ? `<path d="M${x0},${y0} l7,3" stroke="#1a1511" stroke-width="5"/><path d="M${x0},${y0} l7,3" stroke="url(#m4Wd)" stroke-width="3"/>` : `<path d="M${x1},${y1} l-6,5" stroke="#1a1511" stroke-width="5"/><path d="M${x1},${y1} l-6,5" stroke="url(#m4Wd)" stroke-width="3"/>`; continue; }
    steps+=`<path d="M${x0},${y0} L${x1},${y1}" stroke="#1a1511" stroke-width="6.4"/><path d="M${x0},${y0} L${x1},${y1}" stroke="url(#m4Wd)" stroke-width="4"/><path d="M${x0},${y0-1.4} L${x1},${y1-1.4}" stroke="#9a7c54" stroke-width=".6"/>`; }
  const [la0x,la0y]=ladPt(LAD.a,0), [la1x,la1y]=ladPt(LAD.a,1), [lb0x,lb0y]=ladPt(LAD.b,0), [lb1x,lb1y]=ladPt(LAD.b,1);
  MI4.ladder = `${la0x-4},${la0y+4} ${lb0x+6},${lb0y+4} ${lb1x+6},${lb1y-6} ${la1x-6},${la1y-6}`;
  const ladRails = `<path d="M${la0x},${la0y} L${la1x},${la1y}" stroke="#1a1511" stroke-width="10"/><path d="M${la0x},${la0y} L${la1x},${la1y}" stroke="url(#m4Wd)" stroke-width="7"/>
    <path d="M${lb0x},${lb0y} L${lb1x},${lb1y}" stroke="#1a1511" stroke-width="10"/><path d="M${lb0x},${lb0y} L${lb1x},${lb1y}" stroke="url(#m4Wd)" stroke-width="7"/>
    <path d="M${la0x+2},${la0y} L${la1x+2},${la1y}" stroke="#a4885a" stroke-width=".8" opacity=".6"/>
    <ellipse cx="${(la0x+lb0x)/2}" cy="${(la0y+lb0y)/2+3}" rx="30" ry="5" fill="#000" opacity=".22" stroke="none"/>`;
  const loft = `${rw(710,-38)} ${rw(766,-38)} ${rw(766,76)} ${rw(710,76)}`;
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
    <path d="M176,308 H244 L240,300 H180 Z" fill="#7a7464"/>
    <path d="M196,250 l4,-6 M222,212 l4,-6" stroke="#e6e8e2" stroke-width=".8" opacity=".6"/>
    <rect x="248" y="166" width="96" height="8" fill="url(#m4WdV)"/>
    ${[252,340].map(x=>`<circle cx="${x}" cy="170" r="1.6" fill="#1a1511" stroke="none"/>`).join('')}
    ${sticks}
    <!-- 左墙：架子 + 陶罐 / 鸡蛋碗 / 木盒 -->
    <polygon points="${lw(16,236)} ${lw(110,236)} ${lw(110,244)} ${lw(16,244)}" fill="url(#m4WdV)"/>
    <path d="M${lw(30,244)} L${lw(40,262)} M${lw(96,244)} L${lw(86,262)}" stroke="#1a1511" stroke-width="6.4"/>
    <path d="M${lw(30,244)} L${lw(40,262)} M${lw(96,244)} L${lw(86,262)}" stroke="#4a3a2a" stroke-width="4"/>
    <path d="M36,${wy(36,236)} q-12,0 -12,-14 q0,-12 6,-16 v-8 h12 v8 q6,4 6,16 q0,14 -12,14 Z" fill="#8a5e3e"/>
    <path d="M28,${wy(36,236)-14} q8,3 16,0" stroke="#5a3a22" stroke-width="1" fill="none"/>
    <path d="M28,${wy(36,236)-26} h16" stroke-width="1.6"/>
    <path d="M28,${wy(36,236)-10} q-1,-8 4,-14" stroke="#c49a72" stroke-width="1.4" fill="none" opacity=".7"/>
    <path d="M70,${wy(70,236)} q-9,0 -9,-11 q0,-10 9,-12 q9,2 9,12 q0,11 -9,11 Z" fill="#d8ceb0"/>
    <path d="M65,${wy(70,236)-15} q-2,5 0,9" stroke="#fff8e4" stroke-width="1.4" fill="none" opacity=".8"/>
    <rect x="86" y="${wy(92,236)-18}" width="16" height="18" fill="url(#m4WdV)"/>
    <path d="M86,${wy(92,236)-12} h16" stroke-width=".9"/><circle cx="94" cy="${wy(92,236)-15}" r="1" fill="#c9a85a" stroke="none"/>
    <!-- 木框架：两根立柱 + 横梁 + 斜撑（带木纹、铁箍与木钉） -->
    <rect x="336" y="95" width="22" height="425" fill="url(#m4Wd)"/>
    <rect x="660" y="95" width="22" height="425" fill="url(#m4Wd)"/>
    <path d="M343,110 Q345,300 342,510 M351,120 Q349,320 352,500 M667,110 Q669,300 666,510 M675,120 Q673,320 676,500" stroke="#2e2216" stroke-width=".8" fill="none"/>
    ${[160,440].map(y=>`<rect x="334" y="${y}" width="26" height="6" fill="url(#m4IrV)" stroke-width="1"/><rect x="658" y="${y}" width="26" height="6" fill="url(#m4IrV)" stroke-width="1"/>`).join('')}
    <rect x="320" y="108" width="380" height="26" fill="url(#m4WdV)"/>
    <path d="M320,116 Q500,113 700,117 M320,126 Q520,129 700,125" stroke="#2e2216" stroke-width=".8" fill="none"/>
    ${[347,671].map(x=>`<circle cx="${x}" cy="115" r="2" fill="#1a1511" stroke="none"/><circle cx="${x}" cy="127" r="2" fill="#1a1511" stroke="none"/>`).join('')}
    <path d="M358,134 L396,170 M660,134 L630,164" stroke="#1a1511" stroke-width="14"/>
    <path d="M358,134 L396,170 M660,134 L630,164" stroke="#5a4430" stroke-width="11"/>
    <path d="M360,138 L392,168 M658,138 L632,162" stroke="#8a6c48" stroke-width="1" opacity=".6"/>
    <!-- 齿轮槽板（三根空轴在这里） -->
    <rect x="436" y="${MI4.drive.y-30}" width="140" height="60" rx="4" fill="url(#m4WdV)"/>
    <rect x="442" y="${MI4.drive.y-24}" width="128" height="48" rx="2" fill="none" stroke="#2e2216" stroke-width="1"/>
    <path d="M436,${MI4.drive.y-30} H576" stroke="#8a6c48" stroke-width="1.6"/>
    ${[[440,MI4.drive.y-26],[572,MI4.drive.y-26],[440,MI4.drive.y+26],[572,MI4.drive.y+26]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#1a1511" stroke="none"/>`).join('')}
    <!-- 动力轴（穿出右墙，通向水车） -->
    <path d="M${MI4.drive.x},${MI4.drive.y} L828,${MI4.drive.y-34}" stroke="#1a1511" stroke-width="18"/>
    <path d="M${MI4.drive.x},${MI4.drive.y} L828,${MI4.drive.y-34}" stroke="url(#m4WdV)" stroke-width="15"/>
    <path d="M${MI4.drive.x},${MI4.drive.y-5} L828,${MI4.drive.y-39}" stroke="#8a6c48" stroke-width="1.2" opacity=".6"/>
    ${[720,780].map(x=>`<path d="M${x},${n4(MI4.drive.y-(x-MI4.drive.x)*34/218-9)} v18" stroke="#3a3530" stroke-width="4"/>`).join('')}
    <!-- 磨盘主轴 + 料斗（木板拼成，铁箍） -->
    <rect x="${MI4.crown.x-6}" y="${MI4.crown.y}" width="12" height="${sy-MI4.crown.y}" fill="url(#m4Wd)"/>
    <rect x="${MI4.crown.x-7}" y="240" width="14" height="5" fill="url(#m4IrV)" stroke-width="1"/>
    <path d="M352,262 L448,262 L432,318 L368,318 Z" fill="url(#m4WdV)"/>
    <path d="M376,262 L382,318 M400,262 V318 M424,262 L418,318" stroke="#2e2216" stroke-width=".9"/>
    <path d="M352,262 H448" stroke-width="2.6"/>
    <path d="M356,276 L444,276 M362,300 L438,300" stroke="#1a1511" stroke-width="3.4"/>
    <path d="M356,276 L444,276 M362,300 L438,300" stroke="#5a564e" stroke-width="2"/>
    <path d="M360,264 Q400,272 440,264" fill="#e6dfcc" stroke="#9a9078" stroke-width=".8"/>
    <path d="M370,318 L384,350 L416,350 L430,318" fill="#5a4636"/>
    <path d="M384,350 L392,358 L408,358 L416,350" fill="#3a2e22"/>
    <path d="M430,330 L520,346 L520,352 L430,338 Z" fill="url(#m4WdV)"/>
    <path d="M500,350 V404" stroke="#1a1511" stroke-width="7.6"/><path d="M500,350 V404" stroke="#5a4430" stroke-width="5"/>
    <!-- 圆形石台 -->
    <ellipse cx="${sx}" cy="${sy+110}" rx="158" ry="32" fill="#5a5648"/>
    ${dais}
    <ellipse cx="${sx}" cy="${sy+66}" rx="158" ry="32" fill="#8f8a7d"/>
    <ellipse cx="${sx}" cy="${sy+66}" rx="130" ry="24" fill="none" stroke="#74706a" stroke-width="1.4"/>
    <ellipse cx="${sx}" cy="${sy+66}" rx="150" ry="29" fill="none" stroke="#e6dfcc" stroke-width="3" opacity=".35" stroke-dasharray="20 9 4 12"/>
    <!-- 磨盘（上下两扇）：侧面石纹 + 顶面磨齿放射纹 -->
    <ellipse cx="${sx}" cy="${sy+44}" rx="116" ry="25" fill="#6a6658"/>
    <rect x="${sx-116}" y="${sy}" width="232" height="44" fill="url(#m4StoneSide)"/>
    <path d="M${sx-116},${sy+22} H${sx+116}" stroke="#4e4a40" stroke-width="1.6"/>
    <path d="M${sx-116},${sy+23.6} H${sx+116}" stroke="#b4ae9e" stroke-width=".7" opacity=".7"/>
    ${[-96,-70,-38,-8,26,58,88].map((dx,i)=>`<path d="M${sx+dx},${sy+(i%2?4:26)} l${i%2?5:-4},${i%2?9:8}" stroke="#5e5a50" stroke-width=".8"/>`).join('')}
    ${[-104,-60,-18,40,82].map(dx=>`<circle cx="${sx+dx}" cy="${sy+34+(dx%3)}" r="1" fill="#55524a" stroke="none"/>`).join('')}
    <ellipse cx="${sx}" cy="${sy}" rx="116" ry="25" fill="#a39f92"/>
    <g stroke="#7e7a6e" stroke-width=".9" fill="none">${[...Array(12)].map((_,i)=>{ const a=i*Math.PI/6, a2=a+.32;
      return `<path d="M${n4(sx+24*Math.cos(a))},${n4(sy+5.2*Math.sin(a))} L${n4(sx+108*Math.cos(a2))},${n4(sy+23.4*Math.sin(a2))}"/>`; }).join('')}</g>
    <ellipse cx="${sx}" cy="${sy}" rx="60" ry="13" fill="none" stroke="#8e8a7e" stroke-width=".8"/>
    <path d="M${sx-100},${sy-8} A116,25 0 0 1 ${sx-20},${sy-24.6}" stroke="#d8d2c2" stroke-width="1.6" fill="none" opacity=".7"/>
    <ellipse cx="${sx}" cy="${sy}" rx="18" ry="5" fill="#3a3630"/>
    <rect x="${sx-9}" y="${sy-3}" width="18" height="4" fill="url(#m4IrV)" stroke-width=".8"/>
    <!-- 出料口 + 木槽 -->
    <path d="M${sx-14},${sy+92} L${sx+14},${sy+92} L${sx+18},${sy+112} L${sx-18},${sy+112} Z" fill="url(#m4WdV)"/>
    <path d="M${sx-54},${sy+116} L${sx+54},${sy+116} L${sx+46},${sy+152} L${sx-46},${sy+152} Z" fill="url(#m4WdV)"/>
    <path d="M${sx-50},${sy+128} H${sx+50} M${sx-48},${sy+140} H${sx+48}" stroke="#2e2216" stroke-width=".8"/>
    <path d="M${sx-54},${sy+116} L${sx-46},${sy+152} M${sx+54},${sy+116} L${sx+46},${sy+152}" stroke="#3a2e22" stroke-width="4"/>
    <ellipse cx="${sx}" cy="${sy+118}" rx="48" ry="6" fill="#e6dfcc"/>
    <path d="M${sx-30},${sy+117} q10,-3 20,0 q12,-4 24,0" stroke="#fff8ea" stroke-width="1.2" fill="none"/>
    <!-- 右墙：通往阁楼的洞口 + 断了两级的木梯；靠前是落地的木门（全部贴合右墙透视，门脚落在地板上） -->
    <polygon points="${loft}" fill="#120e0a"/>
    <path d="M${rw(710,76)} L${rw(766,76)}" stroke="#1a1511" stroke-width="7"/><path d="M${rw(710,76)} L${rw(766,76)}" stroke="url(#m4Wd)" stroke-width="4.6"/>
    <path d="M${rw(712,-30)} L${rw(712,74)} M${rw(764,-30)} L${rw(764,74)}" stroke="#2e2216" stroke-width="3"/>
    ${ladRails}
    ${steps}
    <polygon points="${rw(828,360)} ${rw(774,360)} ${rw(774,628)} ${rw(828,628)}" fill="#6a6555"/>
    <path d="M${rw(774,628)} L${rw(774,360)} L${rw(828,360)}" stroke="#4e4a42" stroke-width="1.2" fill="none"/>
    <polygon points="${MI4.door()}" fill="url(#m4WdV)"/>
    <path d="M${rw(794,380)} L${rw(794,626)} M${rw(808,380)} L${rw(808,626)}" stroke="#2e2216" stroke-width=".9"/>
    <path d="M${rw(780,452)} L${rw(822,452)} M${rw(780,560)} L${rw(822,560)}" stroke="#1a1511" stroke-width="4"/>
    <path d="M${rw(780,452)} L${rw(822,452)} M${rw(780,560)} L${rw(822,560)}" stroke="#4e4a42" stroke-width="2.4"/>
    <circle cx="${rw(786,505).split(',')[0]}" cy="${rw(786,505).split(',')[1]}" r="2.6" fill="url(#m4IrV)" stroke-width=".8"/>
    <path d="M${rw(774,628)} L${rw(828,628)}" stroke="#1a1511" stroke-width="2.2"/>
    <!-- 壁灯（右立柱）：铁托 + 蜡烛 + 蜡泪 -->
    <path d="M682,318 h12 q4,0 4,4 v4" stroke="#1a1511" stroke-width="3.6" fill="none"/>
    <path d="M682,318 h12 q4,0 4,4 v4" stroke="#4a4640" stroke-width="2" fill="none"/>
    <path d="M686,316 h20 l-3,4 h-14 Z" fill="url(#m4IrV)" stroke-width="1"/>
    <rect x="692" y="292" width="8" height="24" fill="#e6dcc0" stroke-width="1.2"/>
    <path d="M693,294 q1,6 0,10 M699,294 q-1.4,4 0,7" stroke="#c4b896" stroke-width="1.2" fill="none"/>
    <path d="M696,292 v-4" stroke="#1a1511" stroke-width="1"/>
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
      <polygon class="hs" data-obj="o_mill" points="280,412 280,350 340,314 340,276 393,204 466,216 466,166 489,124 524,172 524,240 568,294 562,410"/>
      <rect class="hs" data-obj="o_scarecrow" x="650" y="296" width="146" height="316"/>
      <rect class="hs" data-obj="o_sluice" x="628" y="236" width="52" height="66"/>
      <circle class="hs" data-obj="o_wheel" cx="${M4.wheel.x}" cy="${M4.wheel.y}" r="74"/>
      <path class="hs" data-obj="o_door" d="${M4.door}"/>
      <rect class="hs" data-obj="o_cart" x="40" y="336" width="210" height="180"/>
      <rect class="hs" data-obj="o_elamp" x="232" y="476" width="52" height="52"/>
      <path class="hs" data-obj="o_tunnel" d="${M4.tunnel}"/>
      <rect class="hs" data-obj="o_feather" x="596" y="560" width="70" height="50" style="display:none" id="m4FeatherHot"/>
      <g class="hs-arrow" data-obj="go_in"><rect x="772" y="640" width="48" height="48" rx="6" fill="#2b251e" opacity=".55"/><path d="M788,652 L806,664 L788,676" stroke="#e6dfcc" stroke-width="3" fill="none"/></g>
    </g>
    <g id="m4InHot" style="display:none">
      <rect class="hs" data-obj="i_gears" x="${MI4.crown.x-50}" y="96" width="${MI4.drive.x-MI4.crown.x+150}" height="166"/>
      <ellipse class="hs" data-obj="i_stone" cx="${MI4.stone.x}" cy="${MI4.stone.y+40}" rx="150" ry="60"/>
      <rect class="hs" data-obj="i_chute" x="${MI4.stone.x-56}" y="${MI4.stone.y+104}" width="112" height="52"/>
      <ellipse class="hs" data-obj="i_chute" id="m4PickHot" cx="${MI4.stone.x}" cy="${MI4.stone.y+96}" rx="46" ry="24"/>
      <rect class="hs" data-obj="i_sacks" x="20" y="460" width="230" height="170"/>
      <rect class="hs" data-obj="i_tally" x="246" y="160" width="100" height="100"/>
      <rect class="hs" data-obj="i_candle" x="682" y="270" width="30" height="60"/>
      <polygon class="hs" data-obj="i_door" points="${MI4.door()}"/>
      <polygon class="hs" data-obj="i_stairs" points="${MI4.ladder}"/>
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
