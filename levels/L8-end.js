/* =====================================================================
   第 8 关 · 结局演出（策划案 6）
   结局一「第二夜」  循环：月落前未封印 / 只给乌鸦喝清水 → 石屋里醒来，墙上多一道刻痕 → 可回到月落之前重试
   结局二「破约」    普通：封印 + 救出艾格尼丝，鸦羽不足 7 根 → 湖边天亮，家族树上仍是「M——」
   结局三「她的名字」真结局：鸦羽 7/7 → 羽毛笔 · 受洗册写回名字 · 四个孩子 · 大厅 · 晴天 · 空着的石屋
   画面为 800×520 的插画，逐页点击推进；最后是结局卡（重试 / 回到吊桥前 / 新游戏）
   ===================================================================== */
const e8k = 'stroke="#1a1511" stroke-width="2.4" stroke-linejoin="round"';
const e8s = 'stroke="#1a1511" stroke-width="1.6" stroke-linejoin="round"';
const ROMAN8 = n => ['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n] || String(n);
const SCRIPT8 = `font-family="'Apple Chancery','Snell Roundhand','URW Chancery L','Zapfino',Georgia,serif" font-style="italic"`;
const FEATHER_CN8 = {L1:'石屋', L2:'礼拜堂', L3:'厨房与酒窖', L4:'磨坊', L5:'肖像长廊', L6:'夫人寝室', L7:'书房与钟楼'};

/* ---------------- DOM / 样式 ---------------- */
document.getElementById('app').insertAdjacentHTML('beforeend', `
<div id="end8" class="hidden">
  <svg id="e8svg" viewBox="0 0 800 520"></svg>
  <p id="e8txt"></p>
  <div id="e8hint">— 点击继续 —</div>
  <div id="e8card"></div>
</div>`);
document.head.insertAdjacentHTML('beforeend', `<style>
  #end8{position:absolute;inset:0;z-index:50;background:#0a0806;display:flex;flex-direction:column;align-items:center;
    opacity:0;transition:opacity 1.6s;cursor:pointer}
  #end8.show{opacity:1}
  #end8.hidden{display:none}
  #e8svg{width:760px;height:494px;margin-top:30px;flex-shrink:0;box-shadow:0 0 70px #000;opacity:0;transition:opacity 1.2s;background:#0a0806}
  #e8txt{max-width:740px;margin:18px 0 0;color:#cfc6ae;font-size:16px;line-height:1.85;text-align:center;letter-spacing:.5px;
    opacity:0;transition:opacity 1.2s}
  #e8hint{position:absolute;bottom:12px;font-size:12px;font-style:italic;color:#6b6455;opacity:0;transition:opacity .6s}
  #end8.wait #e8hint{opacity:1;animation:ldPulse 2.2s ease-in-out infinite}
  #e8card{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 50% 42%,#1c1814 0%,#0a0806 70%);text-align:center;opacity:0;transition:opacity 1.8s;cursor:default}
  #e8card.show{display:flex}
  #e8card.on{opacity:1}
  #e8card .no{font-size:12px;letter-spacing:8px;color:#7d7461}
  #e8card h2{margin:14px 0 2px;font-weight:normal;font-size:44px;letter-spacing:14px;color:#e6dcc0;font-family:'Songti SC','STSong',Georgia,serif}
  #e8card .en{font-style:italic;font-size:17px;color:#a39a82;letter-spacing:3px}
  #e8card .rule{width:300px;height:16px;margin:18px 0 14px;position:relative}
  #e8card .rule:before,#e8card .rule:after{content:'';position:absolute;top:8px;width:130px;border-top:1px solid #6b6455}
  #e8card .rule:before{left:0}#e8card .rule:after{right:0}
  #e8card .rule svg{position:absolute;left:142px;top:0;width:16px;height:16px;color:#d9cfb0}
  #e8card .body{max-width:560px;font-size:15.5px;line-height:1.95;color:#c4bba2}
  #e8card .stat{margin-top:16px;font-size:13px;color:#8a826d;letter-spacing:1px;line-height:1.8}
  #e8card .stat b{color:#d9cfb0;font-weight:normal}
  #e8card .fin{margin-top:14px;font-size:13px;letter-spacing:6px;color:#8a7f66}
  #e8card .btns{margin-top:28px;display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
  .e8btn{font:15px Georgia,'Songti SC',serif;background:rgba(217,207,176,.04);border:1px solid #8a7f66;color:#d9cfb0;
    padding:9px 24px;cursor:pointer;letter-spacing:1px;transition:background .2s,color .2s}
  .e8btn:hover{background:#d9cfb0;color:#1a1511}
  .e8btn.sub{border-color:#4e4838;color:#8a826d}
  .e8drift{animation:e8drift 6s linear infinite}
  @keyframes e8drift{from{transform:translate(0,0);opacity:0}15%{opacity:.9}to{transform:translate(-40px,-160px);opacity:0}}
  .e8fall{animation:e8fall 5s ease-in infinite}
  @keyframes e8fall{from{transform:translate(0,-40px) rotate(0);opacity:0}20%{opacity:1}to{transform:translate(-30px,220px) rotate(200deg);opacity:0}}
  .e8in{opacity:0;animation:e8in 2.2s ease-out forwards}
  @keyframes e8in{to{opacity:1}}
  .e8out{animation:e8out 7s ease-in forwards}
  @keyframes e8out{from{opacity:.62}to{opacity:.06}}
  .e8orbit{transform-box:view-box;transform-origin:400px 220px;animation:e8orbit 14s linear infinite}
  @keyframes e8orbit{to{transform:rotate(360deg)}}
  .e8shrink{transform-box:view-box;transform-origin:400px 220px;animation:e8shrink 5s ease-in-out forwards}
  @keyframes e8shrink{from{transform:scale(1.25);opacity:.4}to{transform:scale(.45);opacity:0}}
  .e8write{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0);animation:e8write 2.8s ease-in-out .6s forwards}
  @keyframes e8write{to{transform:scaleX(1)}}
  .e8quill{animation:e8quill 2.8s ease-in-out .6s forwards}
  @keyframes e8quill{from{transform:translate(0,0)}to{transform:translate(168px,0)}}
  .e8glow{animation:e8glow 3s ease-in-out infinite alternate}
  @keyframes e8glow{from{opacity:.55}to{opacity:1}}
  .e8sway{transform-box:fill-box;transform-origin:50% 100%;animation:e8sway 3.4s ease-in-out infinite alternate}
  @keyframes e8sway{from{transform:rotate(-2deg)}to{transform:rotate(2deg)}}
  .e8bob{animation:e8bob 2.6s ease-in-out infinite alternate}
  @keyframes e8bob{to{transform:translateY(-3px)}}
</style>`);
const end8El = document.getElementById('end8'), e8svg = document.getElementById('e8svg'),
      e8txt = document.getElementById('e8txt'), e8card = document.getElementById('e8card');

/* ---------------- 共享美术 ---------------- */
const E8DEFS = `<defs>
  <radialGradient id="e8Vig" cx="50%" cy="48%" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
  <linearGradient id="e8Blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120e16"/><stop offset=".6" stop-color="#3a1418"/><stop offset="1" stop-color="#6a2418"/></linearGradient>
  <linearGradient id="e8Dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6478"/><stop offset=".55" stop-color="#b89a84"/><stop offset="1" stop-color="#ecc69a"/></linearGradient>
  <linearGradient id="e8Day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9cb4"/><stop offset=".7" stop-color="#c4d0d0"/><stop offset="1" stop-color="#e6e2cc"/></linearGradient>
  <linearGradient id="e8Lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7478"/><stop offset="1" stop-color="#2a3236"/></linearGradient>
  <linearGradient id="e8LakeDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa4b0"/><stop offset="1" stop-color="#3e5460"/></linearGradient>
  <radialGradient id="e8Sun"><stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/><stop offset=".3" stop-color="#ffe6a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></radialGradient>
  <radialGradient id="e8Light"><stop offset="0" stop-color="#fff2c8" stop-opacity=".85"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></radialGradient>
  <radialGradient id="e8Red"><stop offset="0" stop-color="#ff4a32" stop-opacity=".6"/><stop offset="1" stop-color="#ff4a32" stop-opacity="0"/></radialGradient>
  <linearGradient id="e8Beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></linearGradient>
  <linearGradient id="e8Wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a241c"/><stop offset=".5" stop-color="#4e463a"/><stop offset="1" stop-color="#2a241c"/></linearGradient>
  <filter id="e8Blur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>`;
const e8wrap = inner => `${E8DEFS}${inner}<rect width="800" height="520" fill="url(#e8Vig)" pointer-events="none"/><rect width="800" height="520" filter="url(#grainF)" opacity=".3" pointer-events="none"/>`;
function e8wall(x0, y0, x1, y1, col='#4a4236', ln='#2a241c', h=40, w=92){
  let s=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="${col}"/><g stroke="${ln}" stroke-width="1.6" fill="none">`;
  for(let y=y0, r=0; y<y1; y+=h, r++){ s+=`<path d="M${x0},${y} H${x1}"/>`;
    for(let x=x0+(r%2?w/2:0); x<x1; x+=w) s+=`<path d="M${n8(x)},${y} V${Math.min(y+h,y1)}"/>`; }
  return s+'</g>';
}
const fog8 = (y, op=.3, col='#9aa2ad')=>`<g filter="url(#e8Blur)" opacity="${op}"><ellipse cx="200" cy="${y}" rx="320" ry="26" fill="${col}"/><ellipse cx="620" cy="${y+18}" rx="300" ry="22" fill="${col}"/></g>`;
const feather8 = (x, y, rot, k=1, col='#141210')=>`<g transform="translate(${n8(x)},${n8(y)}) rotate(${n8(rot)}) scale(${k})">
  <path d="M0,34 Q-9,4 -2,-30 Q2,-38 5,-30 Q12,2 0,34 Z" fill="${col}" stroke="#0a0806" stroke-width="1"/>
  <path d="M0,40 Q2,4 2,-32" stroke="#5a544c" stroke-width="1" fill="none"/>
  <path d="M1,-18 l-6,-4 M1,-8 l-7,-4 M1,2 l-7,-3 M2,-14 l5,-5 M2,-4 l6,-4 M2,6 l6,-3" stroke="#2e2a26" stroke-width=".8"/></g>`;
// 远景城堡 / 鸦塔剪影（底边在原点）
const castle8 = (x, y, k, col, lit=false)=>`<g transform="translate(${x},${y}) scale(${k})" fill="${col}">
  <rect x="-130" y="-56" width="260" height="58"/>${[...Array(13)].map((_,i)=>`<rect x="${-130+i*20}" y="-64" width="10" height="9"/>`).join('')}
  <rect x="-112" y="-120" width="40" height="66"/><path d="M-118,-120 L-92,-162 L-66,-120 Z"/>
  <rect x="-24" y="-152" width="48" height="98"/><path d="M-30,-152 L0,-208 L30,-152 Z"/><path d="M0,-208 V-222" stroke="${col}" stroke-width="2"/>
  <rect x="70" y="-104" width="38" height="52"/><path d="M64,-104 L89,-140 L114,-104 Z"/>
  ${lit ? `<g fill="#ffd27a"><rect x="-6" y="-128" width="5" height="10"/><rect x="5" y="-128" width="5" height="10"/><rect x="-96" y="-100" width="5" height="9"/><rect x="84" y="-86" width="5" height="9"/><rect x="-50" y="-40" width="5" height="9"/><rect x="40" y="-40" width="5" height="9"/></g>` : ''}</g>`;
const tower8 = (x, y, k, col, broken=false)=>`<g transform="translate(${x},${y}) scale(${k})" fill="${col}">
  ${broken ? `<path d="M-22,0 L-20,-150 L-12,-138 L-4,-160 L6,-142 L14,-156 L20,-130 L22,0 Z"/>`
    : `<rect x="-20" y="-190" width="40" height="190"/><rect x="-26" y="-198" width="52" height="10"/>${[0,1,2,3].map(i=>`<rect x="${-26+i*14}" y="-206" width="8" height="9"/>`).join('')}
       <rect x="-3" y="-160" width="6" height="12" fill="#c8402a"/>`}</g>`;
const reeds8 = (x0, x1, y, h=60, col='#1e1a14')=>{ let s=`<g stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round">`;
  for(let x=x0, i=0; x<x1; x+=7+((i*5)%6), i++){ const hh = h*(.55+((i*37)%45)/100), b = ((i*13)%14)-7;
    s+=`<path d="M${x},${y} Q${x+b*.4},${y-hh*.6} ${x+b},${y-hh}"/>`; if(i%4===0) s+=`<ellipse cx="${x+b}" cy="${y-hh-6}" rx="2.6" ry="7" fill="${col}" stroke="none"/>`; }
  return s+'</g>'; };

/* ---------------- 插画：结局一 ---------------- */
function art8RavenTakes(){
  const arch = 'M220,520 L220,170 Q232,50 400,28 Q568,50 580,170 L580,520 Z';
  return `${e8wall(0,0,800,520,'#1a1612','#0c0a08',46,96)}
    <defs><clipPath id="e8clA"><path d="${arch}"/></clipPath></defs>
    <g clip-path="url(#e8clA)"><rect width="800" height="520" fill="url(#e8Blood)"/>
      <circle cx="400" cy="420" r="120" fill="url(#e8Red)"/>
      <circle cx="400" cy="424" r="58" fill="#c89a84"/><circle cx="380" cy="404" r="9" fill="#a8806c"/><circle cx="420" cy="430" r="6" fill="#a8806c"/>
      <rect x="0" y="430" width="800" height="90" fill="#140e0e"/>
      <path d="M340,446 H460 M356,462 H444 M372,478 H428" stroke="#a8644c" stroke-width="2" opacity=".5"/>
      ${fog8(440, .45, '#5a4a4a')}</g>
    <path d="${arch}" fill="none" stroke="#2e2820" stroke-width="22"/><path d="${arch}" fill="none" stroke="#0c0a08" stroke-width="3"/>
    <g transform="translate(400,206) scale(2.35)">${ravenSpread8('#0e0c0a')}</g>
    <circle cx="405" cy="79" r="26" fill="url(#e8Red)" class="e8glow"/>
    <g class="e8sway">${CH.sil('agnes', 400, 326, .8, {len:96, face:{age:'child', eyes:'closed'}})}</g>
    <path d="M384,296 Q392,314 394,326 M416,296 Q408,314 406,326" stroke="#0e0c0a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g opacity=".85">${[0,1,2,3,4,5].map(i=>`<g class="e8fall" style="animation-delay:${-i*.8}s">${feather8(160+i*96, 90+(i*53)%160, i*40, .45)}</g>`).join('')}</g>`;
}
function art8Room(o={}){
  const door = 'M332,420 V214 Q336,140 400,130 Q464,140 468,214 V420 Z';
  const n = o.tally || 0;
  return `${e8wall(0,0,800,420,'#4a4236','#2e281f',42,96)}
    <rect width="800" height="420" fill="url(#e8Wall)" opacity=".55"/>
    <path d="M0,420 H800 V520 H0 Z" fill="#3a3026"/><g stroke="#2a221a" stroke-width="1.4">${[0,1,2,3].map(i=>`<path d="M0,${440+i*22} H800"/>`).join('')}</g>
    <path d="${door}" fill="none" stroke="#2a241c" stroke-width="20"/>
    ${o.open ? `<path d="${door}" fill="#f6e8c4"/><path d="${door}" fill="url(#e8Light)"/>
        <path d="M332,420 L300,436 L300,206 Q306,150 332,214 Z" fill="#4a3426" ${e8s}/>
        <polygon points="332,420 468,420 600,520 200,520" fill="url(#e8Beam)"/>
        ${[...Array(14)].map((_,i)=>`<circle class="e8drift" style="animation-delay:${-i*.45}s" cx="${340+(i*29)%130}" cy="${380+(i*17)%120}" r="1.3" fill="#fff4d8"/>`).join('')}`
      : `<path d="${door}" fill="#5a4030" ${e8k}/><g stroke="#3a2a1e" stroke-width="2">${[364,400,436].map(x=>`<path d="M${x},${x===400?130:142} V420"/>`).join('')}</g>
        <g stroke="#1e1a16" stroke-width="9">${[230,350].map(y=>`<path d="M334,${y} H466"/>`).join('')}</g>
        <circle cx="448" cy="300" r="10" fill="none" stroke="#1e1a16" stroke-width="4"/><rect x="438" y="268" width="18" height="22" fill="#2a241c"/>`}
    <path d="${door}" fill="none" stroke="#14100c" stroke-width="3"/>
    <path d="M610,250 V150 Q614,108 645,102 Q676,108 680,150 V250 Z" fill="${o.open?'#c8d8de':'#24303a'}" stroke="#14100c" stroke-width="3"/>
    <path d="M645,102 V250 M610,180 H680" stroke="#14100c" stroke-width="3"/>
    ${o.open ? '' : `<g class="zrain" stroke="#8ea8ae" stroke-width="1" opacity=".6">${[0,1,2,3,4,5].map(i=>`<path d="M${616+i*11},${120+(i*31)%110} l-4,18"/>`).join('')}</g>`}
    <g ${e8s}><rect x="70" y="340" width="190" height="14" fill="#5a4030"/><path d="M84,354 V420 M246,354 V420" stroke-width="7" stroke="#3a2a1e"/>
      <g transform="translate(150,342) scale(.9) translate(-49,-92)">${ART.fbook(o.open?7:0)}</g>
      <rect x="226" y="300" width="12" height="40" fill="#e3dac0"/></g>
    ${o.open ? `<path d="M232,296 q-6,-12 2,-20 q8,-10 0,-22" stroke="#cfc6ae" stroke-width="1.4" fill="none" opacity=".5"/>`
      : `<circle cx="232" cy="290" r="40" fill="url(#e8Light)" opacity=".5"/><path class="flame" d="M232,282 q5,8 3,13 q-3,3 -6,0 q-2,-5 3,-13 Z" fill="#ffd27a"/>`}
    ${n ? `<g transform="translate(272,210) rotate(-4)"><text x="0" y="0" text-anchor="middle" font-family="Georgia,serif" font-size="64" fill="none" stroke="#d8cfb4" stroke-width="2.4" opacity=".8" letter-spacing="4">${ROMAN8(n)}</text>
        <path d="M-30,10 l8,-4 M10,12 l12,-6 M-16,-50 l6,4" stroke="#d8cfb4" stroke-width="1" opacity=".5"/></g>` : ''}`;
}

/* ---------------- 插画：结局二 / 三 共用 ---------------- */
function art8Ash(){
  return `${e8wall(0,0,800,520,'#3e382e','#24201a',48,100)}<rect width="800" height="520" fill="url(#e8Wall)" opacity=".5"/>
    <path d="M60,420 V170 Q66,96 150,74 Q234,96 240,170 V420 Z" fill="url(#e8Dawn)" stroke="#14100c" stroke-width="4"/>
    <circle cx="160" cy="320" r="70" fill="url(#e8Sun)"/><path d="M150,74 V420 M60,250 H240" stroke="#14100c" stroke-width="4"/>
    <path d="M60,420 L560,560" stroke="none"/>
    <polygon points="60,420 240,420 520,520 0,520" fill="url(#e8Beam)" opacity=".5"/>
    <path d="M280,340 Q400,322 520,334 Q580,338 640,330" stroke="#15110d" stroke-width="20" fill="none" stroke-linecap="round"/>
    <path d="M280,340 Q400,322 520,334 Q580,338 640,330" stroke="#3a2e22" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M418,334 Q424,316 440,312 Q446,298 462,300 Q472,288 488,294 Q502,286 514,298 Q532,296 538,312 Q556,316 564,334 Z" fill="#5a554c" ${e8s}/>
    <path d="M432,328 Q446,312 466,310 M486,302 Q500,300 510,310 M520,316 Q540,320 550,330" stroke="#8a8478" stroke-width="1.2" fill="none"/>
    <g fill="#77716a">${[[446,320],[470,306],[506,306],[532,322],[490,318]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
    ${wax8(494, 300, 1.4)}
    ${feather8(360, 330, 76, .5)}${feather8(600, 326, -70, .45)}${feather8(330, 470, 100, .6)}${feather8(560, 488, 60, .55)}
    ${[...Array(18)].map((_,i)=>`<circle class="e8drift" style="animation-delay:${-i*.34}s" cx="${430+(i*23)%140}" cy="${300-(i*11)%30}" r="${1.2+(i%3)*.6}" fill="#9a948a"/>`).join('')}
    ${[0,1,2].map(i=>`<g class="e8fall" style="animation-delay:${-i*1.6}s">${feather8(380+i*120, 180, i*50, .6)}</g>`).join('')}
    <g transform="translate(40,40)">${cage8({open:true, agnes:false})}</g>`;
}
function art8Lake(){
  return `<rect width="800" height="300" fill="url(#e8Dawn)"/>
    <circle cx="610" cy="300" r="150" fill="url(#e8Sun)"/>
    ${castle8(150, 300, .62, '#4a4a52')}${tower8(610, 300, .8, '#3e3e48', true)}
    <rect y="296" width="800" height="224" fill="url(#e8Lake)"/>
    <path d="M520,316 H700 M550,334 H670 M570,352 H650 M590,372 H630" stroke="#f4dcb4" stroke-width="2.4" opacity=".55"/>
    ${fog8(300, .35, '#d8ccbc')}
    <path d="M0,420 Q120,392 260,400 Q380,408 470,440 Q520,470 540,520 H0 Z" fill="#2a241c"/>
    <g class="e8out" filter="url(#chGhost)"><g transform="translate(560,356) scale(1.05)">${CH.draw('margery', {len:96, face:{age:'child', eyes:'down', mood:'neutral'}})}</g></g>
    ${CH.sil('edmund', 300, 300, 1.15, {face:{male:true, eyes:'closed'}})}
    ${CH.sil('agnes', 324, 330, 1.12, {len:96}, true)}
    <path d="M250,410 Q300,394 360,402 Q420,410 440,440 H230 Z" fill="#2a241c"/>
    ${reeds8(0, 250, 470, 90)}${reeds8(380, 520, 470, 70)}
    ${reeds8(600, 800, 520, 70, '#2a2a2a')}`;
}
function art8Tree(){
  const node = (x, y, name, yrs, side, held, lost, scraped)=>`<g>
    <path d="M400,${y} H${x + (side<0?60:-60)}" stroke="#5a4a36" stroke-width="2.4"/>
    <ellipse cx="${x}" cy="${y}" rx="78" ry="26" fill="#cfc3a2" stroke="#5a4a36" stroke-width="1.6"/>
    ${scraped ? `<text x="${x}" y="${y+2}" text-anchor="middle" ${SCRIPT8} font-size="24" fill="#3a2e22">M——</text>
        <path d="M${x-18},${y-10} l40,18 M${x-14},${y+8} l34,-16 M${x-4},${y-12} l26,22" stroke="#8a7a5c" stroke-width="1" opacity=".8"/>`
      : `<text x="${x}" y="${y+2}" text-anchor="middle" ${SCRIPT8} font-size="22" fill="#2b251e">${name}</text>`}
    <text x="${x}" y="${y+18}" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="1" fill="#6a5a44">${yrs}</text>
    ${held ? `<g transform="translate(${x+side*104},${y-6}) scale(1.7)">${CH.held[held](0,0)}</g>` : ''}
    ${lost ? `<use href="#sym-raven" x="${x-side*96-9}" y="${y-9}" width="18" height="18" style="color:#3a2e22"/>` : `<g transform="translate(${x-side*96},${y})"><path d="M0,8 V-6 M0,0 Q-8,-4 -9,-12 Q-2,-10 0,-2 M0,-4 Q7,-8 9,-14 Q2,-13 0,-6" stroke="#4a6a34" stroke-width="1.8" fill="#6a8a44"/></g>`}
  </g>`;
  return `<rect width="800" height="520" fill="#d6caa9"/>
    <rect x="16" y="16" width="768" height="488" fill="none" stroke="#8a7a5c" stroke-width="2"/><rect x="24" y="24" width="752" height="472" fill="none" stroke="#a8987a" stroke-dasharray="4 4"/>
    <text x="400" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="20" letter-spacing="10" fill="#3a2e22">RAVENHOLD</text>
    <path d="M400,80 V478" stroke="#5a4a36" stroke-width="4"/>
    <path d="M400,478 Q370,488 340,486 M400,478 Q430,488 460,486 M400,470 Q384,480 368,492" stroke="#5a4a36" stroke-width="3" fill="none"/>
    <ellipse cx="400" cy="104" rx="70" ry="22" fill="#b9ab8b" stroke="#5a4a36" stroke-width="1.6"/>
    <text x="400" y="108" text-anchor="middle" ${SCRIPT8} font-size="20" fill="#2b251e">Aldric</text>
    <use href="#sym-raven" x="482" y="92" width="22" height="22" style="color:#2b251e"/>
    ${node(200, 170, 'Aldwin', '1309 — 1316', -1, 'wheat', true)}
    ${node(600, 240, 'Cecily', '1342 — 1349', 1, 'bell', true)}
    ${node(200, 310, 'Hugh', '1375 — 1382', -1, 'mirror', true)}
    ${node(600, 380, '', '1408 — 1415', 1, 'deer', true, true)}
    ${node(200, 446, 'Agnes', '1441 —', -1, null, false)}`;
}

/* ---------------- 插画：结局三 ---------------- */
function art8Quill(){
  return `${art8Ash()}
    <rect width="800" height="520" fill="#fff2c8" opacity=".08"/>
    <circle cx="400" cy="220" r="170" fill="url(#e8Light)" class="e8glow"/>
    <g class="e8shrink"><g class="e8orbit">${[...Array(7)].map((_,i)=>{ const a=i/7*Math.PI*2; return feather8(400+130*Math.cos(a), 220+130*Math.sin(a), a*180/Math.PI+90, 1.1); }).join('')}</g></g>
    <g class="e8in" style="animation-delay:3.4s"><g transform="translate(400,220) rotate(28) scale(2.6)">${feather8(0,0,0,1,'#1a1612')}
      <path d="M0,34 L0,52 L-1.6,48 Z" fill="#c8b48a" stroke="#1a1511" stroke-width=".6"/></g></g>`;
}
function art8Register(){
  const rows = [['1309','Aldwin',3.6],['1342','Cecily',4.4],['1375','Hugh',5.2],['1408','Margery',0]];
  return `<rect width="800" height="520" fill="#1e1814"/>
    <circle cx="400" cy="250" r="380" fill="url(#e8Light)" opacity=".18"/>
    <path d="M40,60 Q220,40 400,64 Q580,40 760,60 L770,480 Q580,462 400,486 Q220,462 30,480 Z" fill="#4a2a22" ${e8k}/>
    <path d="M58,68 Q226,52 400,74 L400,474 Q226,454 50,470 Z" fill="#d8ccac" ${e8s}/>
    <path d="M742,68 Q574,52 400,74 L400,474 Q574,454 750,470 Z" fill="#ddd2b4" ${e8s}/>
    <path d="M400,74 V474" stroke="#8a7a5c" stroke-width="3"/>
    <text x="226" y="118" text-anchor="middle" font-family="Georgia,serif" font-size="17" letter-spacing="5" fill="#5a4a36">LIBER</text>
    <text x="226" y="142" text-anchor="middle" font-family="Georgia,serif" font-size="13" letter-spacing="4" fill="#5a4a36">BAPTIZATORVM</text>
    <path d="M150,160 H302" stroke="#8a7a5c"/><use href="#sym-moon" x="214" y="168" width="24" height="24" style="color:#8a7a5c"/>
    <g stroke="#a8987a" stroke-width="1.2">${[0,1,2,3,4,5,6,7].map(i=>`<path d="M96,${226+i*28} H${i%3===2?250:356}"/>`).join('')}</g>
    <path d="M110,440 Q150,420 190,440 Q230,460 270,440" stroke="#8a7a5c" stroke-width="1.4" fill="none"/>
    ${rows.map(([y,name,d],j)=>{ const yy = 140+j*82;
      return `<text x="440" y="${yy}" font-family="Georgia,serif" font-size="14" fill="#6a5a44">Anno ${y}</text>
        <path d="M530,${yy-6} l14,-8 l10,10 l14,-10 l12,10 l14,-9 l12,9 l16,-10 l12,9 l14,-8 l12,8 l14,-6" stroke="#a8987a" stroke-width="1" fill="none"/>
        <path d="M528,${yy+6} H712" stroke="#8a7a5c" stroke-width="1"/>
        ${d ? `<text class="e8in" style="animation-delay:${d}s" x="540" y="${yy+1}" ${SCRIPT8} font-size="30" fill="#2b251e">${name}</text>`
          : `<defs><clipPath id="e8clW"><rect class="e8write" x="530" y="${yy-34}" width="200" height="46"/></clipPath></defs>
             <text clip-path="url(#e8clW)" x="540" y="${yy+1}" ${SCRIPT8} font-size="32" fill="#1a1208">${name}</text>
             <g class="e8quill"><g transform="translate(548,${yy-4}) rotate(32) scale(1.4)">${feather8(0,-34,0,1,'#1a1612')}<path d="M0,0 L0,16 L-1.4,12 Z" fill="#c8b48a"/></g></g>`}`; }).join('')}`;
}
function art8Children(){
  const kids = [0,1,2,3].map(era=>({era, x:286+era*76}));
  return `<rect width="800" height="520" fill="#2a241c"/>
    ${e8wall(0,0,800,430,'#4a4236','#2e281f',44,100)}
    <path d="M300,430 V190 Q306,96 400,80 Q494,96 500,190 V430 Z" fill="#fff4d8"/>
    <circle cx="400" cy="300" r="260" fill="url(#e8Light)"/>
    <path d="M300,430 V190 Q306,96 400,80 Q494,96 500,190 V430 Z" fill="none" stroke="#2a241c" stroke-width="18"/>
    <path d="M0,430 H800 V520 H0 Z" fill="#3a3026"/><polygon points="300,430 500,430 680,520 120,520" fill="url(#e8Beam)" opacity=".8"/>
    <g fill="#6a645a" ${e8s}><path d="M340,180 V150 h14 v-12 h-12 v-8 h12 v-12 h8 v12 h12 v8 h-12 v12 h14 V180 Z" opacity=".25"/></g>
    ${kids.map(({era,x})=>`<g class="e8bob" style="animation-delay:${-era*.6}s"><g opacity=".92" filter="url(#chGhost)"><g transform="translate(${x},${era===3?306:300}) scale(1.38)">${CH.person({...kidOpts8(era,false), face:{...kidOpts8(era,false).face, mood:'neutral', mouth:'line'}})}</g></g></g>`).join('')}
    ${[0,1,2].map(i=>`<path d="M${286+i*76+34},${378} Q${286+i*76+38},${384} ${286+i*76+42},${378}" stroke="#e8e2d0" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>`).join('')}
    ${[...Array(10)].map((_,i)=>`<circle class="e8drift" style="animation-delay:${-i*.6}s" cx="${300+(i*41)%200}" cy="${420+(i*13)%60}" r="1.4" fill="#fff4d8"/>`).join('')}`;
}
function art8Hall(){
  const X = [146, 222, 298, 374, 450, 526, 602, 690];
  const chair = (x, short=false)=>{ const top = short ? 252 : 178;
    return `<path d="M${x-30},340 V${top+20} Q${x-30},${top} ${x},${top-8} Q${x+30},${top} ${x+30},${top+20} V340 Z" fill="#3a2a1e" ${e8s}/>
      <path d="M${x-22},336 V${top+24} Q${x-22},${top+8} ${x},${top+2} Q${x+22},${top+8} ${x+22},${top+24} V336" fill="none" stroke="#5a4030" stroke-width="2"/>`; };
  const seat = [
    {x:X[1], o:CH.preset.oswald({len:150})},
    {x:X[2], o:CH.preset.isabel({len:150, face:{mood:'neutral', eyes:'open'}})},
    {x:X[3], o:{...kidOpts8(0,false), face:{age:'child', male:true, mood:'neutral'}}, kid:true},
    {x:X[4], o:{...kidOpts8(1,false), face:{age:'child', mood:'neutral'}}, kid:true},
    {x:X[5], o:{...kidOpts8(2,false), face:{age:'child', male:true, mood:'neutral'}}, kid:true},
    {x:X[6], o:kidOpts8(3,false), kid:true}
  ];
  return `<rect width="800" height="520" fill="#3a3026"/>
    ${e8wall(0,0,800,360,'#5a4e3e','#3a3226',40,96)}
    ${[120, 400, 680].map(x=>`<path d="M${x-30},150 V80 Q${x},40 ${x+30},80 V150 Z" fill="#c8d8de" stroke="#2a241c" stroke-width="4"/><path d="M${x},50 V150 M${x-30},100 H${x+30}" stroke="#2a241c" stroke-width="3"/>
      <polygon points="${x-30},150 ${x+30},150 ${x+70},360 ${x-70},360" fill="url(#e8Beam)" opacity=".35"/>`).join('')}
    <g ${e8s}><path d="M400,0 V36" stroke-width="2"/><path d="M330,48 Q400,70 470,48" stroke="#2a241c" stroke-width="5" fill="none"/>
      ${[336,368,400,432,464].map((x,i)=>`<rect x="${x-3}" y="${36+(i===2?12:i%2?8:2)}" width="6" height="12" fill="#e3dac0"/><path class="flame" d="M${x},${30+(i===2?12:i%2?8:2)} q3,5 2,8 q-2,2 -4,0 q-1,-3 2,-8 Z" fill="#ffd27a"/>`).join('')}</g>
    <circle cx="400" cy="60" r="90" fill="url(#e8Light)" opacity=".5"/>
    <path d="M${X[0]-34},344 V${190} Q${X[0]-34},168 ${X[0]},160 Q${X[0]+34},168 ${X[0]+34},190 V344 Z" fill="#6a5e4a" opacity=".55"/>
    <path d="M${X[0]-20},500 l-60,-16 M${X[0]},506 l-70,-18" stroke="#2a221a" stroke-width="2" stroke-dasharray="6 5"/>
    ${X.slice(1,7).map(x=>chair(x)).join('')}${chair(X[7], true)}
    ${seat.map(s=>`<g filter="url(#chGhost)" opacity=".95"><g transform="translate(${s.x},${s.kid?262:226}) scale(${s.kid?1.05:.92})">${CH.person(s.o)}</g></g>`).join('')}
    <g transform="translate(${X[7]},290) scale(1.05)">${CH.draw('agnes', {len:96, face:{age:'child', mood:'neutral', eyes:'open', gaze:[-.5,0]}})}</g>
    <g transform="translate(760,214) scale(.95)">${CH.draw('edmund', {face:{male:true, mood:'sad', eyes:'down', stubble:true, gaze:[-.6,.3]}})}</g>
    <path d="M60,330 H740 L760,352 H40 Z" fill="#d6ccb0" ${e8k}/><path d="M40,352 H760 V420 Q600,412 400,420 Q200,412 40,420 Z" fill="#c8bea2" ${e8k}/>
    <path d="M80,352 Q90,390 84,418 M200,352 Q206,392 200,416 M600,352 Q606,392 600,416 M720,352 Q726,390 720,418" stroke="#a89e84" stroke-width="1.4" fill="none"/>
    <g transform="translate(400,326) scale(.5) translate(-49,-92)">${ART.chalice(true)}</g>
    <g ${e8s}>${[230,560].map(x=>`<rect x="${x-5}" y="300" width="10" height="30" fill="#e3dac0"/><path class="flame" d="M${x},292 q4,7 2,11 q-2,3 -4,0 q-2,-4 2,-11 Z" fill="#ffd27a"/>`).join('')}</g>
    <path d="M0,420 H800 V520 H0 Z" fill="#3a3026"/>
    <g transform="translate(44,476) rotate(-16)"><path d="M-26,0 V-130 Q-26,-150 0,-158 Q26,-150 26,-130 V0 Z" fill="#2a221a" stroke="#8a7a5c" stroke-width="1.6"/>
      <path d="M-18,-6 V-126 Q-18,-142 0,-148 Q18,-142 18,-126 V-6" fill="none" stroke="#5a4a36" stroke-width="1.4"/>
      <use href="#sym-raven" x="-15" y="-134" width="30" height="30" style="color:#a8987a"/><path d="M-30,0 H30" stroke="#8a7a5c" stroke-width="3"/></g>
    <path d="M70,500 Q130,488 170,470" stroke="#5a4a36" stroke-width="1.6" stroke-dasharray="5 6" fill="none"/>`;
}
function art8Sky(){
  return `<rect width="800" height="330" fill="url(#e8Day)"/>
    <circle cx="640" cy="90" r="150" fill="url(#e8Sun)"/><circle cx="640" cy="90" r="30" fill="#fff8e4"/>
    <g fill="#f4f2ea" opacity=".75" filter="url(#e8Blur)"><ellipse cx="200" cy="90" rx="120" ry="18"/><ellipse cx="420" cy="140" rx="90" ry="12"/></g>
    <g stroke="#e8e6dc" stroke-width="2" fill="none" stroke-linecap="round">${[[300,110],[330,96],[520,170],[200,160]].map(([x,y])=>`<path d="M${x-8},${y} q4,-5 8,0 q4,-5 8,0"/>`).join('')}</g>
    <path d="M0,300 Q120,250 260,262 Q360,270 420,300 Z" fill="#6a7a5a"/>
    ${castle8(250, 280, .72, '#5a5650', true)}
    <rect y="296" width="800" height="224" fill="url(#e8LakeDay)"/>
    ${tower8(620, 304, .55, '#5a5a5a', true)}
    <path d="M560,320 H700 M590,340 H670 M600,360 H650" stroke="#fff4d8" stroke-width="2.4" opacity=".6"/>
    <path d="M330,296 L560,300" stroke="#3a3026" stroke-width="3" opacity=".7"/>
    <path d="M0,440 Q200,410 400,428 Q600,446 800,420 V520 H0 Z" fill="#8a7a3a"/>
    <g stroke="#c8a040" stroke-width="2" fill="none">${[...Array(60)].map((_,i)=>{ const x=i*13.6+((i*7)%9), y=470+((i*29)%40), h=34+((i*17)%26);
      return `<path class="e8sway" style="animation-delay:${-i*.13}s" d="M${n8(x)},${y+30} Q${n8(x+2)},${y} ${n8(x+4)},${y-h+30}"/>`; }).join('')}</g>
    <g fill="#e0b84a">${[...Array(30)].map((_,i)=>`<ellipse cx="${n8(i*27.2+8)}" cy="${448+((i*23)%40)}" rx="2.4" ry="6"/>`).join('')}</g>`;
}

/* ---------------- 音效 ---------------- */
const laugh8 = ()=>[0,170,340,520,720].forEach((d,i)=>setTimeout(()=>{ tone(150-i*10,.18,'sawtooth',.035,110-i*8); noise(.12,900,.03,2); }, d));
const crumble8 = ()=>{ noise(2.6,500,.09,.5); setTimeout(()=>noise(1.6,1400,.04,.8), 600); tone(80,2.4,'sine',.08,46); };
const scratch8 = n=>{ for(let i=0;i<n;i++) setTimeout(()=>noise(.07+Math.random()*.06, 3800+Math.random()*1500, .025, 3), i*170+Math.random()*60); };
function lull8(g=.5, beat=560, oct=1){
  [...SONG8].forEach((n,k)=> setTimeout(()=>{ const f = FREQ8[NOTES8.indexOf(n)]*oct;
    tone(f, beat*2.2/1000, 'sine', .045*g); tone(f/2, beat*2.6/1000, 'sine', .02*g); tone(f*2, .3, 'triangle', .006*g); }, k*beat));
}

/* ---------------- 结局脚本 ---------------- */
const END8 = {
  loop:{ no:'ENDING · I', cn:'第二夜', en:'The Second Night',
    panels:(why)=>[
      {art:art8RavenTakes, sfx:()=>{ sfx.caw(); setTimeout(laugh8, 900); setTimeout(sfx.caw, 2400); noise(3,300,.06,.5); },
       text:(why==='water' ? '它喝下的，只是雨水。乌鸦抖开双翼，红眼睛亮得像两块烧红的炭——' : '月亮沉进了雾湖。最后一线月光熄灭的时候，乌鸦抖开了双翼——')
         + '<br>它撞开笼门，攫起艾格尼丝，飞进了雾里。羽毛底下，传出一个老人的笑声。'},
      {art:()=>art8Room({tally:(S8.loops||1)+1}), sfx:()=>{ setTimeout(sfx.thud, 300); setTimeout(()=>scratch8(5), 1400); },
       text:'……你在一间陌生的石屋里醒来。门被锁住了。<br>门边的石墙上，多了一道刻痕。'}
    ],
    body:()=>`月亮落进了雾湖，契约又续上了一夜。<br>艾格尼丝成了第五个回声。而你，会一次又一次在这间石屋里醒来。`,
    stat:(why)=>`这是第 <b>${ROMAN8((S8.loops||1)+1)}</b> 夜<br>` + (why==='water' ? '提示：只给它清水，它只会更有力气。契约背面写着「安眠之水」。'
      : S8.sorted ? '提示：别在窗边耽搁太久。药剂、蜡烛、鸦戒——一气呵成。' : '提示：月亮沉得很快。书页的顺序，就画在每页角落的那扇小窗里。'),
    btns:[['retry','回到月落之前'],['bridge','回到吊桥前', 'sub'],['new','新游戏', 'sub']] },
  break:{ no:'ENDING · II', cn:'破约', en:'The Broken Pact',
    panels:()=>[
      {art:art8Ash, sfx:crumble8,
       text:'摇篮曲的最后一个音落下，戒印「咔」地裂开了。乌鸦一声没叫——<br>它像一捧烧尽的纸灰，从栖木上塌了下去。窗外，天亮了。'},
      {art:art8Lake, sfx:()=>{ sfx.chime(); setTimeout(()=>lull8(.35, 640), 1200); },
       text:'雾散了。埃德蒙在湖边跪下来，紧紧抱住了女儿。<br>芦苇边站着的那个小女孩的影子，在晨光里一点一点地淡了。'},
      {art:art8Tree, sfx:()=>scratch8(3),
       text:'第二年，灰麦村的麦田歉收了。可是从那以后，村子里再也没有少过一个孩子。<br>家族树上，她的名字，仍然只是一个「M——」。'}
    ],
    body:()=>`契约毁了，雷文霍尔德再也不用献出孩子。<br>可受洗册上那四行被刮掉的名字，没有人记得。`,
    stat:()=>{ const miss = Object.keys(FEATHER_CN8).filter(k=>!G.feathers[k]);
      return `鸦羽 <b>${7-miss.length} / 7</b>` + (miss.length ? `<br>还没找到：${miss.map(k=>FEATHER_CN8[k]).join(' · ')}` : '') + '<br>集齐七根鸦羽，再来打破契约，你会看见真正的结局。'; },
    btns:[['bridge','回到吊桥前，去找鸦羽'],['new','新游戏', 'sub']] },
  name:{ no:'ENDING · III', cn:'她的名字', en:'Her Name',
    panels:()=>[
      {art:art8Quill, sfx:()=>{ crumble8(); setTimeout(sfx.chime, 2600); setTimeout(()=>tone(523,2.4,'sine',.04), 3400); },
       text:'乌鸦化成了灰。你身上的七根鸦羽却自己飞了起来，<br>在晨光里绕着圈，拢成了一支羽毛笔。'},
      {art:art8Register, sfx:()=>{ setTimeout(()=>scratch8(12), 700); setTimeout(sfx.chime, 3600); },
       text:'你回到礼拜堂，翻开受洗册。在那一行被刮掉的地方，你一笔一画地写下：<i>Margery</i>。<br>另外三行被刮掉的名字，也一个接一个地浮了出来。', hold:5200},
      {art:art8Children, sfx:()=>lull8(.55, 600),
       text:'奥尔温、塞西莉、休，还有玛格丽。<br>四个孩子手拉着手，走出了礼拜堂。这一次，没有人回头。', hold:4200},
      {art:art8Hall, sfx:()=>{ sfx.chime(); setTimeout(()=>lull8(.4, 600, .5), 800); },
       text:'灰烬大厅里，吊灯亮着。除了先祖之席，七把椅子都坐上了人——<br>艾格尼丝坐在那把锯短的小椅子上，晃着腿。那把空着的乌鸦椅，被抬出了大门。', hold:3600},
      {art:art8Sky, sfx:()=>{ tone(392,3,'sine',.03); tone(523,3,'sine',.025); tone(659,3,'sine',.02); },
       text:'那一年秋天，雾湖上空第一次放晴了。<br>灰麦村的麦子，是金色的。'},
      {art:()=>art8Room({open:true}), sfx:()=>{ sfx.creak(); setTimeout(()=>lull8(.3, 700), 1600); },
       text:'最后，你又看见了那间石屋。<br>门开着。屋里，空无一人。', hold:3600}
    ],
    body:()=>`<span style="font-family:'Apple Chancery','Snell Roundhand',Georgia,serif;font-style:italic;font-size:26px;color:#e6dcc0">Margery</span><br>1408 — 1415<br><br>她的名字，写回了受洗册。`,
    stat:()=>`鸦羽 <b>7 / 7</b> · 记忆书页 <b>7 / 7</b>`,
    fin:'— 完 —<br><span style="font-size:11px;letter-spacing:4px">THE END · 感谢游玩《迷雾城堡》</span>',
    btns:[['new','新游戏'],['bridge','回到吊桥前', 'sub']] }
};

/* ---------------- 播放 ---------------- */
function forceSave8(){ const b = G.busy; G.busy = false; saveGame(); G.busy = b; }
function playEnding8(kind, why){
  if(S8.ended) return;
  S8.ended = kind; S8.endWhy = why || ''; S8.moonOn = false;
  if(kind==='loop') S8.loops = (S8.loops||0) + 1; else G.progress.L8 = true;
  if(cur) closeZoom(); if(held) hold(null);
  G.busy = true; forceSave8(); amb8.level();
  const panels = END8[kind].panels(why);
  setTimeout(()=> runPanels8(panels, ()=> showEndCard8(kind)), kind==='loop' ? 300 : 900);
}
function runPanels8(list, done){
  end8El.classList.remove('hidden', 'wait'); e8card.className = ''; e8card.innerHTML = '';
  e8svg.style.opacity = 0; e8txt.style.opacity = 0;
  requestAnimationFrame(()=> end8El.classList.add('show'));
  let i = -1, ready = true;
  const next = ()=>{
    if(!ready) return; ready = false; end8El.classList.remove('wait'); i++;
    e8svg.style.opacity = 0; e8txt.style.opacity = 0;
    if(i >= list.length){ end8El.onclick = null; return setTimeout(done, 900); }
    const p = list[i];
    setTimeout(()=>{
      e8svg.innerHTML = e8wrap(p.art()); e8txt.innerHTML = p.text;
      e8svg.style.opacity = 1; try{ p.sfx && p.sfx(); }catch(e){}
      setTimeout(()=>{ e8txt.style.opacity = 1; }, 900);
      setTimeout(()=>{ ready = true; end8El.classList.add('wait'); }, p.hold || 2800);
    }, i===0 ? 1400 : 1300);
  };
  end8El.onclick = next; next();
}
function showEndCard8(kind){
  const E = END8[kind]; if(!E) return;
  G.busy = true; S8.moonOn = false; if(cur) closeZoom(); if(held) hold(null); amb8.level();
  end8El.classList.remove('hidden', 'wait'); end8El.onclick = null;
  e8svg.style.opacity = 0; e8txt.style.opacity = 0;
  requestAnimationFrame(()=> end8El.classList.add('show'));
  e8card.innerHTML = `<div class="no">${E.no}</div><h2>${E.cn}</h2><div class="en">${E.en}</div>
    <div class="rule"><svg viewBox="0 0 60 60"><use href="#sym-moon"/></svg></div>
    <div class="body">${E.body()}</div><div class="stat">${E.stat(S8.endWhy)}</div>${E.fin ? `<div class="fin">${E.fin}</div>` : ''}
    <div class="btns">${E.btns.map(([k,label,cls])=>`<button class="e8btn ${cls||''}" data-e8="${k}">${label}</button>`).join('')}</div>`;
  e8card.className = 'show';
  setTimeout(()=> e8card.classList.add('on'), 60);
  if(kind==='name') setTimeout(sfx.chime, 600);
  e8card.querySelectorAll('[data-e8]').forEach(b=> b.onclick = ev=>{ ev.stopPropagation(); sfx.tap(); END8_ACT[b.dataset.e8](); });
}
function hideEnd8(cb){
  end8El.classList.remove('show');
  setTimeout(()=>{ end8El.classList.add('hidden'); e8card.className = ''; e8card.innerHTML = ''; e8svg.innerHTML = ''; cb && cb(); }, 1700);
}
const END8_ACT = {
  retry(){ hideEnd8(()=>{ retry8(); S8.endWhy = ''; G.busy = false; updateAll(); sfx.caw();
    say('……你又站在了塔顶。窗外的月亮，回到了湖面上方很高的地方。乌鸦的红眼睛，正看着你。', 7000); }); },
  bridge(){
    let b = null; try{ b = localStorage.getItem('ravenhold-preL8'); }catch(e){}
    if(b){ try{ localStorage.setItem(SAVE_KEY, b); }catch(e){} location.replace(`${location.pathname}?t=${Date.now()}`); }
    else restartAt('hall7');
  },
  new(){ try{ localStorage.removeItem('ravenhold-preL8'); }catch(e){} clearSave(); restartAt('L1'); }
};
