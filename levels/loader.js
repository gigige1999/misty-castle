/* =====================================================================
   入场 Loading：拱窗里的渡鸦堡
   ·  月亮、城堡、雾、渡鸦整体缩进一扇「尖拱窗」画框里（像一张铜版插图），四周留黑
   ·  拱窗外框用墨线「画」出来；纸纤维 + 胶片颗粒 + 划痕 + 曝光闪烁，增加做旧质感
   ·  标题带墨迹毛边与压印阴影；八枚月相代表八个房间，随加载依次点亮
   ·  加载完成 → 「点击进入」（停留片刻也会自动进入）→ 开始菜单（levels/menu.js）
   ·  带 ?start= 进入（调试跳关 / 从头再来）时不播放入场与菜单，直接开局
   ===================================================================== */
(function(){
const el = document.getElementById('loader');
if(!el) return;
const svg = el.querySelector('svg');
let jumpQ = null; try{ jumpQ = sessionStorage.getItem('ravenhold-jump'); }catch(e){}
const startQ = new URLSearchParams(location.search).get('start') || jumpQ;
if(startQ){
  el.remove();
  const m = document.getElementById('menu'); if(m) m.remove();
  window.LOADER = { ready(fn){ fn(); } };
  return;
}
const MX = 540, MY = 240, MR = 108;
const f1 = v => (+v).toFixed(1);
let seed = 7; const rnd = (a,b)=>{ seed = (seed*16807) % 2147483647; return a + (seed/2147483647)*(b-a); };

/* ---------------- 拱窗几何（屏幕坐标） ----------------
   内框：左右 380 / 700，起拱线 y=292，拱顶 y=96，窗台 y=432；两段圆弧半径 200，圆心 (580,292)/(500,292) */
const AL = 380, AR = 700, SPR = 292, BOT = 432;
const arch = (r, pad=0) => { const l = AL-(r-200), rr = AR+(r-200), ay = SPR - Math.sqrt(r*r - 1600);   // 圆心永远在 x=580 / 500，离拱顶 40
  return `M${f1(l)},${BOT+pad} V${SPR} A${r},${r} 0 0 1 ${MX},${f1(ay)} A${r},${r} 0 0 1 ${f1(rr)},${SPR} V${BOT+pad}`; };
const inArch = (x, y) => y <= BOT && x >= AL && x <= AR &&
  (y >= SPR || ((x-580)**2 + (y-SPR)**2 <= 200*200 && (x-500)**2 + (y-SPR)**2 <= 200*200));
// 拱券上的砌缝刻线
let voussoir = '';
for(let a=186; a<=254; a+=8.5){ const r = a*Math.PI/180, c = Math.cos(r), s = Math.sin(r);
  const x1 = 580+201*c, y1 = SPR+201*s, x2 = 580+209*c, y2 = SPR+209*s;
  voussoir += `<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)} M${f1(1080-x1)},${f1(y1)} L${f1(1080-x2)},${f1(y2)}"/>`; }
for(let y=SPR+16; y<BOT; y+=24) voussoir += `<path d="M371,${y} H379 M701,${y} H709"/>`;

/* ---------------- 星空：只在拱窗里 ---------------- */
let stars = '', n = 0, guard = 0;
while(n < 46 && guard++ < 2000){
  const x = rnd(AL+6, AR-6), y = rnd(102, 350), d = Math.hypot(x-MX, y-MY);
  if(!inArch(x, y) || d < 80) continue;
  stars += `<circle class="ld-star" cx="${f1(x)}" cy="${f1(y)}" r="${f1(rnd(.3,.95))}" fill="#ece4cc" style="animation-delay:${f1(-rnd(0,4))}s;animation-duration:${f1(rnd(2,5.5))}s"/>`;
  n++;
}
[[430,170],[662,150],[410,300],[676,262]].forEach(([x,y],i)=>{
  stars += `<g class="ld-star" style="animation-delay:-${i*.9}s;animation-duration:4.6s" transform="translate(${x},${y}) scale(.6)">
    <path d="M0,-7 L.9,-.9 L7,0 L.9,.9 L0,7 L-.9,.9 L-7,0 L-.9,-.9 Z" fill="#f4ecd4"/></g>`; });

/* ---------------- 月亮（场景坐标，整体缩放进拱窗） ---------------- */
const craters = [[-34,-28,16,.22],[26,-40,9,.18],[38,12,20,.16],[-18,30,13,.2],[-52,8,7,.18],[8,52,8,.14],[52,-12,6,.16],[-4,-6,5,.12]]
  .map(([x,y,r,o])=>`<circle cx="${MX+x}" cy="${MY+y}" r="${r}" fill="#a99c78" opacity="${o}"/><circle cx="${MX+x+r*.18}" cy="${MY+y+r*.18}" r="${f1(r*.82)}" fill="none" stroke="#fff8e4" stroke-width=".8" opacity="${o*.9}"/>`).join('');
const ticks = [...Array(72)].map((_,i)=>{ const a=i*Math.PI/36, r1=MR+46, r2=r1+(i%6===0?9:4);
  return `<path d="M${f1(MX+r1*Math.cos(a))},${f1(MY+r1*Math.sin(a))} L${f1(MX+r2*Math.cos(a))},${f1(MY+r2*Math.sin(a))}"/>`; }).join('');

/* ---------------- 城堡剪影 ---------------- */
const B = 452;   // 墙基
const crenels = (x0, x1, y, w=7, h=7) => { let s=''; for(let x=x0; x<=x1-w; x+=w*2) s+=`<rect x="${f1(x)}" y="${y-h}" width="${w}" height="${h+1}"/>`; return s; };
const block = (x0, x1, top, cren=true, w=7) => `<rect x="${x0}" y="${top}" width="${x1-x0}" height="${B-top+2}"/>${cren?crenels(x0, x1, top, w):''}`;
const roof = (x0, x1, top, h) => `<path d="M${x0-5},${top} L${x1+5},${top} L${(x0+x1)/2},${top-h} Z"/>`;
const corbel = (x0, x1, y) => `<rect x="${x0-4}" y="${y}" width="${x1-x0+8}" height="7"/>` + [...Array(Math.floor((x1-x0+8)/6))].map((_,i)=>`<path d="M${x0-4+i*6},${y+7} l3,4 l3,-4 Z"/>`).join('');
const castle = `<path d="M300,${B+70} L322,${B+30} L344,${B+26} L360,${B+8} L388,${B+10} L404,${B-2} L440,${B+4} L470,${B-4} L520,${B-2} L566,${B-6} L612,${B-2} L650,${B+2} L684,${B-4} L712,${B+8} L736,${B+6} L756,${B+26} L776,${B+30} L800,${B+70} Z" fill="url(#ldRock)"/>
<g fill="url(#ldCastle)">
  ${block(370,394,340)}${roof(370,394,340,34)}
  ${block(394,432,384)}
  ${block(430,468,232,false)}${corbel(430,468,226)}${crenels(426,472,226,6,6)}
  <path d="M422,220 L476,220 L449,154 Z"/>
  ${block(466,488,336)}
  ${block(486,596,318,true,8)}
  <rect x="478" y="322" width="16" height="28"/><path d="M475,322 L497,322 L486,302 Z"/>
  <rect x="590" y="324" width="16" height="28"/><path d="M587,324 L609,324 L598,304 Z"/>
  ${block(520,560,206,false)}${corbel(520,560,200)}
  <path d="M510,200 L570,200 L540,112 Z"/>
  ${block(596,622,346)}
  ${block(620,652,254,false)}${corbel(620,652,248)}<path d="M612,248 L660,248 L636,196 Z"/>
  ${block(652,690,394)}
  ${block(688,708,356)}${roof(688,708,356,30)}
  <path d="M449,154 V138 M540,112 V96 M636,196 V184" stroke="#0c0c0f" stroke-width="2"/>
</g>
<g stroke="#2a2a33" stroke-width="1.2" opacity=".55" fill="none">
  <path d="M434,232 V450 M524,206 V450 M624,254 V450 M490,318 V450"/>
</g>
<path d="M540,96 v-8 M536,92 h8" stroke="#0c0c0f" stroke-width="1.6"/>
<path class="ld-flag" d="M449.5,139 q8,-3 16,1 q-5,3 -3,6 q-7,-3 -13,0 Z" fill="#0c0c0f"/>
<use href="#sym-raven" x="572" y="300" width="20" height="20" style="color:#0c0c0f"/>`;
const win = (x, y, w, h, o=1, cls='ld-win') => `<path class="${cls}" d="M${x-w/2},${y+h} V${y+w/2} A${w/2},${w/2} 0 0 1 ${x+w/2},${y+w/2} V${y+h} Z" fill="#f2c26a" opacity="${o}"/>`;
const windows = `
  <circle cx="449" cy="268" r="22" fill="url(#ldWarm)" class="ld-win"/>
  <circle class="ld-winbig" cx="449" cy="268" r="60" fill="url(#ldWarm)" opacity="0"/>
  ${win(449,260,7,14)} ${win(449,330,5,9,.35)}
  ${win(540,232,4,14,.65)} ${win(508,352,5,10,.3,'')} ${win(572,352,5,10,.45)}
  ${win(636,296,5,11,.4,'')} ${win(383,372,4,8,.25,'')}
  <path d="M528,${B+2} V${B-20} A12,12 0 0 1 552,${B-20} V${B+2} Z" fill="#050506"/>
  <path d="M530,${B} V${B-19} A10,10 0 0 1 550,${B-19} V${B}" fill="none" stroke="#f2c26a" stroke-width=".8" opacity=".25"/>`;

/* ---------------- 雾 / 渡鸦 ---------------- */
const mist = `<g filter="url(#ldBlur)">
  <ellipse cx="540" cy="${B+14}" rx="300" ry="20" fill="#8e96a2" opacity=".26"/>
  <g class="ld-mist"><ellipse cx="420" cy="${B+18}" rx="330" ry="22" fill="#9aa2ad" opacity=".22"/><ellipse cx="780" cy="${B+40}" rx="300" ry="18" fill="#9aa2ad" opacity=".18"/></g>
  <g class="ld-mist m2"><ellipse cx="620" cy="${B-4}" rx="260" ry="12" fill="#b6bcc4" opacity=".16"/><ellipse cx="260" cy="${B+50}" rx="280" ry="20" fill="#9aa2ad" opacity=".16"/></g>
</g>`;
const bird = (y, s, delay) => `<g class="ld-bird" style="animation-delay:${delay}s"><g transform="translate(0,${y}) scale(${s})">
  <path class="ld-wing" d="M-9,0 Q-5,-6 0,0 Q5,-6 9,0" stroke="#0c0c0f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="0.6" rx="1.8" ry="1.1" fill="#0c0c0f"/></g></g>`;
const birds = bird(196,1.3,-3) + bird(176,1,-7.5) + bird(268,1.1,-13) + bird(150,.8,-16);

/* ---------------- 湖面月光碎影（屏幕坐标） ---------------- */
let shim = '', sy = 401;
for(let i=0;i<7;i++){ sy += rnd(2.6,5.2); const w = 6 + i*3.4 + rnd(-2,4), x = MX - w/2 + rnd(-5,5);
  shim += `<rect class="ld-shim" x="${f1(x)}" y="${f1(sy)}" width="${f1(w)}" height="${f1(rnd(.7,1.2))}" rx=".5" fill="#efe6cc" style="animation-delay:${f1(-rnd(0,3))}s;animation-duration:${f1(rnd(1.4,2.9))}s"/>`; }

/* ---------------- 外框 / 标题 / 进度 ---------------- */
const corner = (x, y, sx, sy) => `<path d="M${x},${y+40*sy} V${y} H${x+40*sx} M${x+8*sx},${y+22*sy} V${y+8*sy} H${x+22*sx}" />
  <path d="M${x+8*sx},${y+8*sy} l${6*sx},${6*sy}" /><circle cx="${x+14*sx}" cy="${y+14*sy}" r="1.6" fill="#8a7f66" stroke="none"/>`;
const frame = `<g stroke="#8a7f66" stroke-width="1" fill="none" opacity=".5">
  <rect x="20" y="20" width="1040" height="677"/><rect x="26" y="26" width="1028" height="665" stroke-width=".5"/>
  ${corner(32,32,1,1)}${corner(1048,32,-1,1)}${corner(32,685,1,-1)}${corner(1048,685,-1,-1)}
</g>`;
const plate = `<g stroke="#8a7f66" fill="none">
  <path class="ld-draw" pathLength="1" d="${arch(210, 4)}" stroke-width="1.2"/>
  <path class="ld-draw" pathLength="1" d="${arch(200)}" stroke-width="1.6" style="animation-delay:.35s"/>
  <path class="ld-draw" pathLength="1" d="${arch(196)}" stroke-width=".5" opacity=".6" style="animation-delay:.5s"/>
  <g class="ld-fade" style="animation-delay:1.2s" stroke-width=".7" opacity=".7">${voussoir}</g>
</g>
<g class="ld-fade" style="animation-delay:1s">
  <path d="M352,${BOT} H728 L720,${BOT+10} H360 Z" fill="#15130f" stroke="#8a7f66" stroke-width="1"/>
  <path d="M366,${BOT+16} H714" stroke="#8a7f66" stroke-width=".5" opacity=".6"/>
  ${[0,1,2,3,4,5].map(i=>`<path d="M${392+i*59},${BOT+10} l4,6 l4,-6" fill="none" stroke="#8a7f66" stroke-width=".7" opacity=".7"/>`).join('')}
  <path d="M${MX},76 L${MX+8},90 L${MX},104 L${MX-8},90 Z" fill="#15130f" stroke="#8a7f66" stroke-width="1"/>
  <circle cx="${MX}" cy="90" r="1.8" fill="#d9cfb0"/>
  <g stroke="#8a7f66" stroke-width=".7" opacity=".55">
    <path d="M300,${SPR+6} H362 M718,${SPR+6} H780"/><circle cx="296" cy="${SPR+6}" r="2" fill="#8a7f66"/><circle cx="784" cy="${SPR+6}" r="2" fill="#8a7f66"/>
  </g>
</g>`;
// 拱窗外：一圈极淡的星盘刻度，慢转
const orbit = `<g class="ld-fade" style="animation-delay:.8s;animation-duration:3s"><g class="ld-orbit" stroke="#d9cfb0" fill="none" opacity=".07">
  <circle cx="${MX}" cy="262" r="262" stroke-width=".6" stroke-dasharray="1 9"/>
  <circle cx="${MX}" cy="262" r="276" stroke-width=".4"/>
  ${[...Array(48)].map((_,i)=>{ const a=i*Math.PI/24, r1=276, r2=r1+(i%4===0?10:5);
    return `<path d="M${f1(MX+r1*Math.cos(a))},${f1(262+r1*Math.sin(a))} L${f1(MX+r2*Math.cos(a))},${f1(262+r2*Math.sin(a))}" stroke-width=".6"/>`; }).join('')}
</g></g>`;
// 月相：0 新月牙 → 7 满月
const phase = (i) => { const r=6.5, p=(i+1)/8, rx=f1(r*Math.abs(Math.cos(p*Math.PI))), sw=p>.5?1:0;
  return `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${sw} 0,${-r} Z`; };
const PH_Y = 598, BAR_Y = 624;
const phases = [...Array(8)].map((_,i)=>{ const x = MX + (i-3.5)*34;
  return `<g transform="translate(${x},${PH_Y})"><circle r="6.5" fill="#1a1a1e" stroke="#6b6455" stroke-width=".7"/>
    <path id="ldP${i}" d="${phase(i)}" fill="#e8dfc4" opacity=".08" style="transition:opacity .6s"/></g>`; }).join('');

const SCENE = `translate(${MX} ${MY}) scale(.56) translate(${-MX} ${-MY})`;
svg.innerHTML = `<defs>
    <radialGradient id="ldMoonG" cx=".42" cy=".38" r=".62"><stop offset="0" stop-color="#fdf7e2"/><stop offset=".6" stop-color="#e9dfc0"/><stop offset="1" stop-color="#c3b690"/></radialGradient>
    <radialGradient id="ldHaloG"><stop offset=".45" stop-color="#e8dfc0" stop-opacity=".3"/><stop offset=".7" stop-color="#cfd2d6" stop-opacity=".08"/><stop offset="1" stop-color="#cfd2d6" stop-opacity="0"/></radialGradient>
    <radialGradient id="ldWarm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
    <radialGradient id="ldSky" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#2c313b"/><stop offset=".55" stop-color="#1a1d24"/><stop offset="1" stop-color="#0d0e12"/></radialGradient>
    <linearGradient id="ldLake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1e25"/><stop offset="1" stop-color="#08090b"/></linearGradient>
    <linearGradient id="ldCastle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1d24"/><stop offset=".7" stop-color="#0e0e12"/><stop offset="1" stop-color="#08080a"/></linearGradient>
    <linearGradient id="ldRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0b0e"/><stop offset=".45" stop-color="#0b0b0e" stop-opacity=".85"/><stop offset="1" stop-color="#0b0b0e" stop-opacity="0"/></linearGradient>
    <linearGradient id="ldTitleG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2e8cc"/><stop offset="1" stop-color="#b3a37c"/></linearGradient>
    <filter id="ldBlur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="ldSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="ldInk" x="-4%" y="-40%" width="108%" height="180%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="ldPaper" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".045 .22" numOctaves="4" seed="5"/>
      <feColorMatrix values="0 0 0 0 .86  0 0 0 0 .8  0 0 0 0 .68  .13 0 0 0 -.045"/>
    </filter>
    <filter id="ldMottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".008" numOctaves="3" seed="9"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .5 0 0 0 -.18"/>
    </filter>
    <clipPath id="ldArchClip"><path d="${arch(200)} Z"/></clipPath>
  </defs>
  <rect width="1080" height="717" filter="url(#ldMottle)"/>
  <rect width="1080" height="717" filter="url(#ldPaper)"/>
  ${orbit}
  <g clip-path="url(#ldArchClip)">
    <g class="ld-fade" style="animation-duration:2.2s">
      <rect x="${AL}" y="80" width="${AR-AL}" height="${BOT-80}" fill="url(#ldSky)"/>
      ${stars}
    </g>
    <g transform="${SCENE}">
      <g class="ld-moon">
        <circle class="ld-halo" cx="${MX}" cy="${MY}" r="${MR*2.3}" fill="url(#ldHaloG)"/>
        <g class="ld-ring" stroke="#d9cfb0" stroke-width=".8" fill="none" opacity=".22">${ticks}</g>
        <circle class="ld-ring r2" cx="${MX}" cy="${MY}" r="${MR+30}" fill="none" stroke="#d9cfb0" stroke-width=".7" stroke-dasharray="2 7" opacity=".3"/>
        <circle cx="${MX}" cy="${MY}" r="${MR+16}" fill="none" stroke="#d9cfb0" stroke-width=".5" opacity=".18"/>
        <circle cx="${MX}" cy="${MY}" r="${MR}" fill="url(#ldMoonG)"/>
        ${craters}
        <circle cx="${MX}" cy="${MY}" r="${MR-1}" fill="none" stroke="#fffaf0" stroke-width="2" opacity=".35"/>
      </g>
      <g class="ld-fade" style="animation-delay:.3s">${birds}</g>
    </g>
    <g class="ld-fade" style="animation-delay:.4s"><rect x="${AL}" y="392" width="${AR-AL}" height="${BOT-392}" fill="url(#ldLake)"/>${shim}</g>
    <g transform="${SCENE}">
      <g class="ld-fade" style="animation-delay:.5s;animation-duration:2s">${castle}${windows}</g>
      <g class="ld-fade" style="animation-delay:.6s">${mist}</g>
    </g>
    <path d="${arch(200)} Z" fill="none" stroke="#000" stroke-width="30" opacity=".6" filter="url(#ldSoft)"/>
  </g>
  ${plate}
  <g class="ld-fade" style="animation-delay:1.2s"><ellipse class="ld-mist" cx="${MX}" cy="${BOT+6}" rx="380" ry="14" fill="#8e96a2" opacity=".12" filter="url(#ldBlur)"/></g>
  <g class="ld-fade" style="animation-delay:.2s">${frame}
    <text x="${MX}" y="56" text-anchor="middle" font-family="Georgia,serif" font-size="10.5" letter-spacing="7" fill="#7d7461">A  TALE  IN  EIGHT  CHAMBERS</text>
    <text x="52" y="676" font-family="Georgia,serif" font-style="italic" font-size="11" letter-spacing="3" fill="#6b6455">Anno MCDXV</text>
    <text x="1028" y="676" text-anchor="end" font-family="Georgia,serif" font-style="italic" font-size="11" letter-spacing="3" fill="#6b6455">Vol. I</text>
  </g>
  <g filter="url(#ldInk)">
    <text class="ld-title" x="${MX+8}" y="518" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="40" fill="#000" opacity=".7" transform="translate(1.5 2.5)">RAVENHOLD</text>
    <text class="ld-title" x="${MX+8}" y="518" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="40" fill="url(#ldTitleG)">RAVENHOLD</text>
  </g>
  <g class="ld-fade" style="animation-delay:1.4s">
    <path d="M${MX-150},536 H${MX-14} M${MX+14},536 H${MX+150}" stroke="#8a7f66" stroke-width=".8"/>
    <circle cx="${MX-154}" cy="536" r="1.6" fill="#8a7f66"/><circle cx="${MX+154}" cy="536" r="1.6" fill="#8a7f66"/>
    <use href="#sym-moon" x="${MX-8}" y="528" width="16" height="16" style="color:#d9cfb0"/>
    <text x="${MX+6}" y="566" text-anchor="middle" font-family="'Songti SC','STSong',Georgia,serif" font-size="17" letter-spacing="12" fill="#a39a82" filter="url(#ldInk)">迷雾城堡</text>
  </g>
  <g class="ld-fade" style="animation-delay:1.8s">
    ${phases}
    <path d="M${MX-140},${BAR_Y} H${MX+140}" stroke="#2e2c28" stroke-width="1.4"/>
    <path id="ldBar" d="M${MX-140},${BAR_Y} H${MX+140}" stroke="#d9cfb0" stroke-width="1.4" stroke-dasharray="280" stroke-dashoffset="280"/>
    <circle id="ldDot" cx="${MX-140}" cy="${BAR_Y}" r="2.4" fill="#fff4d6"/>
    <circle id="ldDotG" cx="${MX-140}" cy="${BAR_Y}" r="8" fill="url(#ldWarm)"/>
    <text id="ldMsg" x="${MX}" y="652" text-anchor="middle" font-family="Georgia,'Songti SC',serif" font-style="italic" font-size="13" letter-spacing="2" fill="#8a826d">正在点燃石屋的蜡烛……</text>
  </g>`;

/* ---------------- 进度 ---------------- */
const MSGS = ['正在点燃石屋的蜡烛……', '渡鸦落在了塔尖上……', '雾，从湖面上升起……', '月亮爬上了西塔……'];
const $ = id => document.getElementById(id);
const bar = $('ldBar'), dot = $('ldDot'), dotG = $('ldDotG'), msg = $('ldMsg');
let p = 0, target = .55, done = false, entered = false, bootFn = null;
const t0 = performance.now(), minT = 3000;
document.addEventListener('DOMContentLoaded', ()=>{ target = Math.max(target, .9); });
addEventListener('load', ()=>{ target = 1; });
setTimeout(()=>{ target = 1; }, 9000);   // 兜底：资源卡住也不会一直转

function frame_(now){
  // 开始菜单的背景图还没到：进度停在最后一格前等它（最多等到 9 秒）
  const waitImg = window.MENU && !MENU.imgReady && now - t0 < 9000;
  const goal = Math.min(waitImg ? .94 : target, (now - t0)/minT);
  p += (goal - p) * .07;
  if(goal >= 1 && p > .995) p = 1;
  bar.setAttribute('stroke-dashoffset', f1(280*(1-p)));
  const x = f1(MX - 140 + 280*p); dot.setAttribute('cx', x); dotG.setAttribute('cx', x);
  for(let i=0;i<8;i++) $('ldP'+i).style.opacity = p >= (i+1)/8 - .001 ? 1 : .08;
  if(!done) msg.textContent = MSGS[Math.min(MSGS.length-1, Math.floor(p*MSGS.length))];
  if(p >= 1 && !done) finish();
  if(!entered) requestAnimationFrame(frame_);
}
requestAnimationFrame(frame_);

function finish(){
  done = true;
  msg.textContent = '— 点击进入 —';
  msg.setAttribute('fill', '#d9cfb0'); msg.classList.add('ld-prompt');
  el.classList.add('ready');
  setTimeout(()=> enter(false), 3200);   // 不点也会自己推开门，进入开始菜单
}
function enter(byUser){
  if(!done || entered) return;
  if(!bootFn){ setTimeout(()=>enter(byUser), 60); return; }   // 主脚本还没就绪：稍等
  entered = true;
  if(window.MENU) MENU.open(bootFn);
  else {
    try{ if(byUser && typeof sfx!=='undefined' && sfx.chime) sfx.chime(); }catch(e){}
    try{ bootFn(); }catch(e){ console.error(e); }
  }
  el.classList.add('out');
  setTimeout(()=> el.remove(), 1900);
}
el.addEventListener('click', ()=>enter(true));
addEventListener('keydown', e=>{ if(!entered && (e.key==='Enter' || e.key===' ')) enter(true); });

window.LOADER = { ready(fn){ bootFn = fn; } };
})();
