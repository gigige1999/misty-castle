/* =====================================================================
   入场 Loading：月下的渡鸦堡
   ·  满月 + 光晕 + 慢转的细环；城堡剪影压在月亮前，西塔窗里一点烛光
   ·  雾带左右漂移，渡鸦飞过；八枚月相代表八个房间，随加载依次点亮
   ·  加载完成后「点击进入」→ 开局（boot）并淡出；?start=… 调试启动时自动进入
   ===================================================================== */
(function(){
const el = document.getElementById('loader');
if(!el) return;
const svg = el.querySelector('svg');
const quick = new URLSearchParams(location.search).has('start');
const MX = 540, MY = 240, MR = 108;
const f1 = v => (+v).toFixed(1);
let seed = 7; const rnd = (a,b)=>{ seed = (seed*16807) % 2147483647; return a + (seed/2147483647)*(b-a); };

/* ---------------- 星空 ---------------- */
let stars = '', n = 0;
while(n < 110){
  const x = rnd(40,1040), y = rnd(36,500), d = Math.hypot(x-MX, y-MY);
  if(d < MR+70 || (y > 380 && Math.abs(x-MX) < 260)) continue;
  const r = rnd(.35,1.25);
  stars += `<circle class="ld-star" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#ece4cc" style="animation-delay:${f1(-rnd(0,4))}s;animation-duration:${f1(rnd(2,5.5))}s"/>`;
  n++;
}
[[170,110],[880,150],[300,330],[790,390],[955,72]].forEach(([x,y],i)=>{
  stars += `<g class="ld-star" style="animation-delay:-${i*.9}s;animation-duration:4.6s" transform="translate(${x},${y})">
    <path d="M0,-7 L.9,-.9 L7,0 L.9,.9 L0,7 L-.9,.9 L-7,0 L-.9,-.9 Z" fill="#f4ecd4"/></g>`; });

/* ---------------- 月亮 ---------------- */
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
  <ellipse cx="540" cy="${B+14}" rx="300" ry="20" fill="#8e96a2" opacity=".22"/>
  <g class="ld-mist"><ellipse cx="420" cy="${B+18}" rx="330" ry="22" fill="#9aa2ad" opacity=".18"/><ellipse cx="780" cy="${B+40}" rx="300" ry="18" fill="#9aa2ad" opacity=".14"/></g>
  <g class="ld-mist m2"><ellipse cx="620" cy="${B-4}" rx="260" ry="12" fill="#b6bcc4" opacity=".14"/><ellipse cx="260" cy="${B+50}" rx="280" ry="20" fill="#9aa2ad" opacity=".12"/></g>
</g>`;
const bird = (y, s, delay) => `<g class="ld-bird" style="animation-delay:${delay}s"><g transform="translate(0,${y}) scale(${s})">
  <path class="ld-wing" d="M-9,0 Q-5,-6 0,0 Q5,-6 9,0" stroke="#0c0c0f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="0.6" rx="1.8" ry="1.1" fill="#0c0c0f"/></g></g>`;
const birds = bird(196,1.1,-3) + bird(176,.8,-7.5) + bird(268,.9,-13) + bird(150,.6,-16);

/* ---------------- 边框 / 标题 / 进度 ---------------- */
const corner = (x, y, sx, sy) => `<path d="M${x},${y+40*sy} V${y} H${x+40*sx} M${x+8*sx},${y+22*sy} V${y+8*sy} H${x+22*sx}" />
  <path d="M${x+8*sx},${y+8*sy} l${6*sx},${6*sy}" /><circle cx="${x+14*sx}" cy="${y+14*sy}" r="1.6" fill="#8a7f66" stroke="none"/>`;
const frame = `<g stroke="#8a7f66" stroke-width="1" fill="none" opacity=".55">
  <rect x="20" y="20" width="1040" height="677"/><rect x="26" y="26" width="1028" height="665" stroke-width=".5"/>
  ${corner(32,32,1,1)}${corner(1048,32,-1,1)}${corner(32,685,1,-1)}${corner(1048,685,-1,-1)}
</g>`;
// 月相：0 新月牙 → 7 满月
const phase = (i) => { const r=6.5, p=(i+1)/8, rx=f1(r*Math.abs(Math.cos(p*Math.PI))), sw=p>.5?1:0;
  return `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${sw} 0,${-r} Z`; };
const phases = [...Array(8)].map((_,i)=>{ const x = MX + (i-3.5)*34;
  return `<g transform="translate(${x},622)"><circle r="6.5" fill="#1a1a1e" stroke="#6b6455" stroke-width=".7"/>
    <path id="ldP${i}" d="${phase(i)}" fill="#e8dfc4" opacity=".08" style="transition:opacity .6s"/></g>`; }).join('');

svg.innerHTML = `<defs>
    <radialGradient id="ldMoonG" cx=".42" cy=".38" r=".62"><stop offset="0" stop-color="#fdf7e2"/><stop offset=".6" stop-color="#e9dfc0"/><stop offset="1" stop-color="#c3b690"/></radialGradient>
    <radialGradient id="ldHaloG"><stop offset=".45" stop-color="#e8dfc0" stop-opacity=".3"/><stop offset=".7" stop-color="#cfd2d6" stop-opacity=".08"/><stop offset="1" stop-color="#cfd2d6" stop-opacity="0"/></radialGradient>
    <radialGradient id="ldWarm"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
    <linearGradient id="ldCastle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1d24"/><stop offset=".7" stop-color="#0e0e12"/><stop offset="1" stop-color="#08080a"/></linearGradient>
    <linearGradient id="ldRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0b0e"/><stop offset=".45" stop-color="#0b0b0e" stop-opacity=".85"/><stop offset="1" stop-color="#0b0b0e" stop-opacity="0"/></linearGradient>
    <linearGradient id="ldTitleG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2e8cc"/><stop offset="1" stop-color="#b8a984"/></linearGradient>
    <filter id="ldBlur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <g class="ld-fade">${stars}</g>
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
  <g class="ld-fade" style="animation-delay:.5s;animation-duration:2s">${castle}${windows}</g>
  <g class="ld-fade" style="animation-delay:.6s">${mist}</g>
  <g class="ld-fade" style="animation-delay:.2s">${frame}
    <text x="${MX}" y="56" text-anchor="middle" font-family="Georgia,serif" font-size="10.5" letter-spacing="7" fill="#7d7461">A  TALE  IN  EIGHT  CHAMBERS</text>
    <text x="52" y="676" font-family="Georgia,serif" font-style="italic" font-size="11" letter-spacing="3" fill="#6b6455">Anno MCDXV</text>
    <text x="1028" y="676" text-anchor="end" font-family="Georgia,serif" font-style="italic" font-size="11" letter-spacing="3" fill="#6b6455">Vol. I</text>
  </g>
  <text class="ld-title" x="${MX+8}" y="544" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="44" fill="url(#ldTitleG)">RAVENHOLD</text>
  <g class="ld-fade" style="animation-delay:1.4s">
    <path d="M${MX-150},562 H${MX-14} M${MX+14},562 H${MX+150}" stroke="#8a7f66" stroke-width=".8"/>
    <use href="#sym-moon" x="${MX-8}" y="554" width="16" height="16" style="color:#d9cfb0"/>
    <text x="${MX+6}" y="592" text-anchor="middle" font-family="'Songti SC','STSong',Georgia,serif" font-size="17" letter-spacing="12" fill="#a39a82">迷雾城堡</text>
  </g>
  <g class="ld-fade" style="animation-delay:1.8s">
    ${phases}
    <path d="M${MX-140},648 H${MX+140}" stroke="#2e2c28" stroke-width="1.4"/>
    <path id="ldBar" d="M${MX-140},648 H${MX+140}" stroke="#d9cfb0" stroke-width="1.4" stroke-dasharray="280" stroke-dashoffset="280"/>
    <circle id="ldDot" cx="${MX-140}" cy="648" r="2.4" fill="#fff4d6"/>
    <circle id="ldDotG" cx="${MX-140}" cy="648" r="8" fill="url(#ldWarm)"/>
    <text id="ldMsg" x="${MX}" y="676" text-anchor="middle" font-family="Georgia,'Songti SC',serif" font-style="italic" font-size="13" letter-spacing="2" fill="#8a826d">正在点燃石屋的蜡烛……</text>
  </g>`;

/* ---------------- 进度 ---------------- */
const MSGS = ['正在点燃石屋的蜡烛……', '渡鸦落在了塔尖上……', '雾，从护城河上升起……', '月亮爬上了西塔……'];
const $ = id => document.getElementById(id);
const bar = $('ldBar'), dot = $('ldDot'), dotG = $('ldDotG'), msg = $('ldMsg');
let p = 0, target = .55, done = false, entered = false, bootFn = null;
const t0 = performance.now(), minT = quick ? 700 : 2800;
document.addEventListener('DOMContentLoaded', ()=>{ target = Math.max(target, .9); });
addEventListener('load', ()=>{ target = 1; });
setTimeout(()=>{ target = 1; }, 9000);   // 兜底：资源卡住也不会一直转

function frame_(now){
  const goal = Math.min(target, (now - t0)/minT);
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
  if(quick) return setTimeout(enter, 200);
  let saved = false; try{ saved = !!localStorage.getItem('ravenhold-save-v1'); }catch(e){}
  msg.textContent = saved ? '— 点击继续 —' : '— 点击进入 —';
  msg.setAttribute('fill', '#d9cfb0'); msg.classList.add('ld-prompt');
  el.classList.add('ready');
}
function enter(){
  if(!done || entered) return;
  if(!bootFn){ setTimeout(enter, 60); return; }   // 主脚本还没就绪：稍等
  entered = true;
  try{ if(!quick && typeof sfx!=='undefined' && sfx.chime) sfx.chime(); }catch(e){}
  try{ bootFn(); }catch(e){ console.error(e); }
  el.classList.add('out');
  setTimeout(()=> el.remove(), 1900);
}
el.addEventListener('click', enter);
addEventListener('keydown', e=>{ if(!entered && (e.key==='Enter' || e.key===' ')) enter(); });

window.LOADER = { ready(fn){ bootFn = fn; } };
})();
