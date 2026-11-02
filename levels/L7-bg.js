/* =====================================================================
   第 7 关 · 书房与钟楼 —— 背景美术 + 场景 DOM
   ===================================================================== */
function s7StudyBackground(){
  let moons=''; for(let i=0;i<8;i++){ const a=i*Math.PI/4-Math.PI/2, x=(357+46*Math.cos(a)).toFixed(1), y=(232+46*Math.sin(a)).toFixed(1);
    moons+=`<circle cx="${x}" cy="${y}" r="7" fill="${i===4?'#d8c890':'#1e1c1a'}" stroke="#9a8450" stroke-width="1"/>`;
    if(i!==0 && i!==4) moons+=`<path d="M${x},${(y-7)} A7,7 0 0 ${i<4?1:0} ${x},${(+y+7)} Z" fill="#d8c890" stroke="none" transform="translate(0,0)"/>`; }
  return `<defs>${defs7('s7','#55503f','#4a463a',91)}</defs>
  <rect width="828" height="709" fill="#221c16"/>
  <g filter="url(#s7-rough)" ${s7s}>
    ${room7({id:'s7', joint:'#433f35', lw:'#48443a', rw:'#45413a'})}
    <rect x="452" y="118" width="22" height="402" fill="#3a2e22"/>
    ${gothicWin7('s7',1,170,226,196,380)}
    ${gothicWin7('s7',2,646,684,228,372)}
    <path d="M276,154 H438" stroke="#15110d" stroke-width="4"/><circle cx="274" cy="154" r="4" fill="#15110d"/><circle cx="440" cy="154" r="4" fill="#15110d"/>
    <rect x="282" y="158" width="150" height="148" fill="#1e1c1a"/>
    <rect x="290" y="166" width="134" height="132" fill="none" stroke="#9a8450" stroke-width="1.2"/>
    <circle cx="357" cy="232" r="46" fill="none" stroke="#9a8450" stroke-width="1"/>
    <use href="#sym-sun" x="333" y="208" width="48" height="48" style="color:#b39a5a" stroke="none"/>
    ${moons}
    <rect x="364" y="330" width="78" height="96" fill="#6b5532"/><rect x="370" y="336" width="66" height="84" fill="#2a2620"/>
    <polygon points="104,470 404,460 420,484 92,496" fill="#4a3a2a"/>
    <polygon points="92,496 420,484 420,500 92,512" fill="#3a2c20"/>
    <path d="M110,510 L104,640 M400,500 L396,616 M130,506 V600 M384,500 V590" stroke="#2e2218" stroke-width="10"/>
    <rect x="120" y="450" width="56" height="12" fill="#5a2622"/><rect x="124" y="438" width="50" height="12" fill="#3e3a26"/><rect x="118" y="462" width="60" height="10" fill="#4a2a20"/>
    <circle cx="234" cy="470" r="6" fill="#15110d"/><path d="M234,466 L250,420" stroke="#d8d0bc" stroke-width="2"/><path d="M250,420 q8,6 4,18 q-6,-4 -4,-18" fill="#d8d0bc"/>
    <path d="M318,470 L330,456 L342,470 Z" fill="#8a6a34"/><path d="M330,456 V432" stroke="#8a6a34" stroke-width="3"/>
    <circle cx="330" cy="410" r="24" fill="none" stroke="#a88a4e" stroke-width="3"/>
    <ellipse cx="330" cy="410" rx="24" ry="9" fill="none" stroke="#a88a4e" stroke-width="2" transform="rotate(-24 330 410)"/>
    <ellipse cx="330" cy="410" rx="9" ry="24" fill="none" stroke="#a88a4e" stroke-width="2"/><circle cx="330" cy="410" r="5" fill="#d8b860"/>
    <polygon points="70,596 600,592 690,700 -20,706" fill="#4e2622"/>
    <polygon points="86,604 588,600 668,692 4,698" fill="none" stroke="#8a5a40" stroke-width="2" stroke-dasharray="6 4"/>
    <path d="M430,560 L436,420 L486,416 L484,560" fill="none" stroke="#2e2218" stroke-width="9"/>
    <rect x="432" y="420" width="54" height="80" fill="#3a2c20"/><path d="M459,436 v26 M450,446 h18" stroke="#15110d" stroke-width="4"/>
    <polygon points="420,540 500,536 512,560 410,566" fill="#4a3a2a"/><path d="M418,566 L416,650 M506,560 L510,644" stroke="#2e2218" stroke-width="8"/>
    <path d="M492,524 L492,404 Q496,368 530,354 Q564,368 568,404 L568,524 Z" fill="#5e594c"/>
    <path d="${ST7.door}" fill="#3e3024"/>
    <path d="M500,450 H560 M500,490 H560" stroke="#15110d" stroke-width="4"/><circle cx="550" cy="470" r="3.4" fill="#8a7448"/>
    <path d="${ST7.panel}" fill="#423c32"/><path d="M28,420 L66,412 M28,500 L66,496" stroke="#36312a" stroke-width="2"/>
    ${stairs7.art}
    <path d="M86,288 h-12 v-16" stroke="#221e1a" stroke-width="3" fill="none"/><rect x="80" y="258" width="10" height="28" fill="#e3dac0"/>
  </g>
  <rect width="828" height="709" filter="url(#s7-stain)" opacity=".42" pointer-events="none"/>
  <circle cx="85" cy="246" r="90" fill="url(#s7-warm)"/><path class="flame" d="M85,236 q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>
  <circle cx="234" cy="446" r="80" fill="url(#s7-warm)" opacity=".45"/>`;
}

function s7TowerBackground(){
  const {x:px, y:py, r:pr} = TW7.pulley;
  let spiral=''; for(let i=0;i<5;i++){ const a0=Math.PI*(.95+i*.22), a1=a0+.22;
    const P=a=>[146+118*Math.cos(a), 622+46*Math.sin(a)], A=P(a0), B=P(a1);
    spiral+=`<polygon points="146,622 ${A.map(v=>v.toFixed(1)).join(',')} ${B.map(v=>v.toFixed(1)).join(',')}" fill="${i%2?'#3a3024':'#44382a'}" stroke="#1a1511" stroke-width="1.2" transform="translate(0,${i*8})"/>`; }
  let rail=''; for(let i=0;i<7;i++){ const a=Math.PI*(1.02+i*.16), x=146+130*Math.cos(a), y=600+50*Math.sin(a); rail+=`<path d="M${x.toFixed(1)},${(y+60).toFixed(1)} V${(y-20).toFixed(1)}"/>`; }
  return `<defs>${defs7('t7','#57513f','#4b463a',97)}</defs>
  <rect width="828" height="709" fill="#221c16"/>
  <g filter="url(#t7-rough)" ${s7s}>
    ${room7({id:'t7', joint:'#45413a', lw:'#4a463b', rw:'#47433a'})}
    ${gothicWin7('t7',1,170,216,196,372)}
    <path d="M754,446 L754,250 Q758,206 790,194 Q822,208 826,252 L826,470 Z" fill="#5e594c"/>
    <path d="${TW7.win}" fill="url(#t7-sky)"/>
    <g transform="translate(-30,0)"><path d="M252,148 H346" stroke="#15110d" stroke-width="3"/>
    <rect x="256" y="152" width="86" height="118" fill="#4a2a20"/>
    <g fill="none" stroke="#b9a07a" stroke-width="1"><circle cx="282" cy="186" r="16"/><circle cx="306" cy="214" r="12"/><circle cx="324" cy="236" r="9"/>
      <path d="M270,252 Q298,234 330,258"/><path d="M286,166 l-6,-8 M286,166 l6,-8"/></g>
    <circle cx="324" cy="236" r="13" fill="none" stroke="#c8402e" stroke-width="1.6"/>
    <circle cx="326" cy="172" r="7" fill="#e6dcc0" stroke="#b9a07a" stroke-width="1"/></g>
    <rect x="318" y="152" width="108" height="190" rx="4" fill="#4a3a2a"/>
    <rect x="324" y="158" width="96" height="178" rx="3" fill="none" stroke="#6a5440" stroke-width="1.4"/>
    <g fill="#2a2622"><rect x="508" y="96" width="14" height="440"/><rect x="706" y="96" width="14" height="440"/>
      <rect x="500" y="92" width="228" height="16"/><rect x="500" y="392" width="228" height="12"/><rect x="496" y="528" width="236" height="16"/></g>
    <path d="M522,108 L706,392 M706,108 L522,392" stroke="#2a2622" stroke-width="6" opacity=".6"/>
    ${[120,170,220,270,320,370,420,470,520].map(y=>`<circle cx="515" cy="${y}" r="2" fill="#6a665c" stroke="none"/><circle cx="713" cy="${y}" r="2" fill="#6a665c" stroke="none"/>`).join('')}
    <polygon points="480,544 748,544 772,574 456,574" fill="#3a3024"/>
    <path d="M522,${TW7.axleY} H706" stroke="#2a2622" stroke-width="5"/>
    <g transform="translate(${px},${py})"><circle r="${pr}" fill="none" stroke="#3a2e22" stroke-width="8"/>
      ${[0,45,90,135].map(a=>`<rect x="-3" y="${-pr+4}" width="6" height="${pr*2-8}" fill="#3a2e22" transform="rotate(${a})"/>`).join('')}<circle r="7" fill="#2a2622"/></g>
    <path d="M${px+pr},${py} V520" stroke="#7a6a50" stroke-width="2.4"/>
    <path d="M${px+pr-4},${py-24} L508,104" stroke="#2a2622" stroke-width="5"/>
    <path d="M150,514 L160,420 M168,514 L172,420 M156,420 q-6,-10 2,-14 M172,420 q6,-10 -2,-14" stroke="#2a2420" stroke-width="4" fill="none"/>
    <rect x="196" y="470" width="96" height="50" fill="#5a4636"/><polygon points="196,470 292,470 300,458 204,458" fill="#6a5440"/>
    <path d="M196,494 H292 M244,470 V520" stroke="#3a2e22" stroke-width="2"/>
    <polygon points="560,640 708,640 736,690 548,690" fill="#3a3024"/><circle cx="642" cy="676" r="6" fill="none" stroke="#15110d" stroke-width="2"/>
    <path d="${TW7.stairs}" fill="#2a2018"/>
    ${spiral}
    <ellipse cx="146" cy="622" rx="122" ry="50" fill="none" stroke="#5a4a3a" stroke-width="3"/>
    <g stroke="#15110d" stroke-width="3">${rail}</g>
    <path d="M30,580 Q146,520 276,590" stroke="#15110d" stroke-width="4" fill="none"/>
    <path d="M58,276 h-12 v-16" stroke="#221e1a" stroke-width="3" fill="none"/><rect x="52" y="246" width="10" height="28" fill="#e3dac0"/>
  </g>
  <rect width="828" height="709" filter="url(#t7-stain)" opacity=".42" pointer-events="none"/>
  <circle cx="57" cy="236" r="90" fill="url(#t7-warm)"/><path class="flame" d="M57,226 q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>`;
}

/* ---------------- 场景 DOM ---------------- */
const arrow7 = (obj, x, dir)=>`<g class="hs-arrow" data-obj="${obj}"><rect x="${x}" y="640" width="48" height="48" rx="6" fill="#2b251e" opacity=".55"/>
  <path d="${dir>0?`M${x+16},652 L${x+34},664 L${x+16},676`:`M${x+32},652 L${x+14},664 L${x+32},676`}" stroke="#e6dfcc" stroke-width="3" fill="none"/></g>`;
document.getElementById('l6').insertAdjacentHTML('afterend', `
<div id="l7" class="lvroot hidden" data-level="L7">
  <svg id="s7Bg" viewBox="0 0 828 709" pointer-events="none">${s7StudyBackground()}</svg>
  <svg id="t7Bg" viewBox="0 0 828 709" pointer-events="none" style="display:none">${s7TowerBackground()}</svg>
  <svg id="l7Obj" viewBox="0 0 828 709">
    <defs>
      <clipPath id="t7-clipWin"><path d="${TW7.win}"/></clipPath>
      <radialGradient id="l7-vig" cx="50%" cy="46%" r="72%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".58"/></radialGradient>
    </defs>
    <g id="l7Dyn" pointer-events="none"></g>
    <g id="s7Hot">
      <rect class="hs" data-obj="letter" x="180" y="450" width="110" height="44"/>
      <rect class="hs" data-obj="astrolabe" x="300" y="380" width="60" height="92"/>
      <rect class="hs" data-obj="tapestry" x="280" y="154" width="154" height="154"/>
      <rect class="hs" data-obj="aldric" x="362" y="328" width="82" height="100"/>
      <rect class="hs" data-obj="cage" x="548" y="146" width="76" height="136"/>
      <rect class="hs" data-obj="chest" x="598" y="434" width="98" height="104"/>
      <path class="hs" data-obj="sdoor" d="${ST7.door}"/>
      <path class="hs" data-obj="panel" d="${ST7.panel}"/>
      <path class="hs" data-obj="upstairs" d="${ST7.stairs}"/>
      <rect class="hs" data-obj="swin" x="160" y="176" width="76" height="210"/>
      <rect class="hs" data-obj="books" x="112" y="434" width="68" height="42"/>
      ${arrow7('upstairs', 772, 1)}
    </g>
    <g id="t7Hot" style="display:none">
      <rect class="hs" data-obj="clock" x="318" y="152" width="108" height="190"/>
      <rect class="hs" data-obj="mech" x="500" y="400" width="226" height="130"/>
      <rect class="hs" data-obj="bell" x="520" y="110" width="190" height="240"/>
      <rect class="hs" data-obj="weight" id="t7WeightHot" x="434" y="${TW7.wTop+2}" width="72" height="${TW7.wH+16}" rx="8"/>
      <rect class="hs" data-obj="lever" x="374" y="398" width="58" height="126" rx="8"/>
      <rect class="hs" data-obj="plan" x="222" y="148" width="90" height="124"/>
      <path class="hs" data-obj="twin" d="${TW7.win}"/>
      <rect class="hs" data-obj="tools" x="140" y="404" width="44" height="114"/>
      <rect class="hs" data-obj="tbox" x="194" y="456" width="106" height="66"/>
      <polygon class="hs" data-obj="trap" points="560,640 708,640 736,690 548,690"/>
      <path class="hs" data-obj="downstairs" d="${TW7.stairs}"/>
      ${arrow7('downstairs', 8, -1)}
    </g>
  </svg>
</div>`);
document.head.insertAdjacentHTML('beforeend', `<style>
  .t7swing{transform-box:fill-box;transform-origin:50% 0;animation:t7swing .7s ease-in-out infinite alternate}
  @keyframes t7swing{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
  .t7spin{transform-box:fill-box;transform-origin:50% 50%;animation:m4cw 4s linear infinite}
  .t7spinR{transform-box:fill-box;transform-origin:50% 50%;animation:m4cw 4s linear infinite reverse}
  .s7sway{transform-box:fill-box;transform-origin:50% 0;animation:s7sway .35s ease-in-out 4 alternate}
  @keyframes s7sway{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
</style>`);
