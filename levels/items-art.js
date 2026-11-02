/* =====================================================================
   物品栏缩略图 · 精绘版
   ·  统一的「陈列柜」底：羊皮纸聚光 + 落地软阴影
   ·  金属 / 玻璃 / 木 / 皮 / 纸 各自的渐变材质，细线描边（1.3 / 0.8）
   ·  覆盖所有 TH.*（必须在各关卡模块之后加载）；ART.* 为不带底的纯物品画，可复用到特写
   ===================================================================== */
(function(){
const K  = 'stroke="#2b251e" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"';
const Kt = 'stroke="#2b251e" stroke-width=".8" stroke-linejoin="round" stroke-linecap="round"';
const f1 = v => (+v).toFixed(1);

/* ---------------- 材质 ---------------- */
const stops = a => a.map(([o,c,op])=>`<stop offset="${o}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('');
const lin = (id, a, x2=1, y2=0) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`;
const rad = (id, a, cx=.5, cy=.5, r=.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`;
const PEWTER = [[0,'#4a463c'],[.18,'#8e8a7c'],[.38,'#dcd8ca'],[.55,'#a5a192'],[.85,'#67635a'],[1,'#46423a']];
const BRASS  = [[0,'#5e4418'],[.2,'#a8823a'],[.4,'#f2d98e'],[.58,'#c49a46'],[.85,'#7a5a24'],[1,'#4e3812']];
const GOLD   = [[0,'#6a4a10'],[.25,'#c0952e'],[.45,'#fae38e'],[.62,'#d4a842'],[1,'#5a400e']];
const IRON   = [[0,'#23201c'],[.3,'#57514a'],[.48,'#8e877c'],[.66,'#4e4842'],[1,'#1e1b18']];
const BRONZE = [[0,'#4a3418'],[.3,'#8a6a3e'],[.48,'#c8a66c'],[.66,'#8a6a3a'],[1,'#3e2c14']];
const COPPER = [[0,'#4a240c'],[.25,'#a0582a'],[.45,'#eaa66e'],[.62,'#b8723c'],[1,'#4e260e']];
const WOOD   = [[0,'#5a3c20'],[.35,'#9a7446'],[.55,'#b48c58'],[1,'#5e4024']];
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  ${rad('itBg',[[0,'#c9c0a8'],[.55,'#ada48c'],[1,'#8a826c']],.46,.36,.78)}
  ${rad('itShadow',[[0,'#1a140e',.5],[1,'#1a140e',0]])}
  ${lin('itPewter',PEWTER)} ${lin('itBrass',BRASS)} ${lin('itBrassV',BRASS,0,1)}
  ${lin('itGold',GOLD)} ${lin('itGoldV',GOLD,0,1)}
  ${lin('itIron',IRON)} ${lin('itIronV',IRON,0,1)}
  ${lin('itBronze',BRONZE)} ${lin('itCopper',COPPER)}
  ${lin('itWood',WOOD)} ${lin('itWoodV',WOOD,0,1)}
  ${lin('itLead',[[0,'#55555c'],[.4,'#a2a2a8'],[.62,'#86868c'],[1,'#4a4a50']],1,1)}
  ${lin('itLeather',[[0,'#74392b'],[.5,'#4c2319'],[1,'#2c130d']],1,1)}
  ${lin('itParch',[[0,'#ece3c8'],[.6,'#d8cca9'],[1,'#bcad86']],1,1)}
  ${lin('itLinen',[[0,'#dccfab'],[1,'#a49673']],1,1)}
  ${lin('itStone',[[0,'#5e5a50'],[.38,'#aaa496'],[.6,'#8a857a'],[1,'#4e4a42']])}
  ${lin('itGlass',[[0,'#8fa49c',.55],[.28,'#eef5f0',.45],[.5,'#b8c8c0',.18],[.85,'#8fa49c',.3],[1,'#6f847c',.6]])}
  ${lin('itPotion',[[0,'#9a5488'],[1,'#3a1434']],0,1)}
  ${lin('itMirror',[[0,'#f4f8f6'],[.45,'#b9c8cc'],[1,'#74888e']],1,1)}
  ${lin('itWheat',[[0,'#f6d880'],[.6,'#d8a840'],[1,'#a07420']],0,1)}
  ${rad('itGlow',[[0,'#fff2c0',.9],[.35,'#ffd27a',.45],[1,'#ffb35a',0]])}
  ${rad('itFlame',[[0,'#fffbe6'],[.45,'#ffe08a'],[1,'#ea8a2a']],.5,.72,.6)}
  ${rad('itWax',[[0,'#d04a40'],[.6,'#8e1e18'],[1,'#560c08']],.36,.34,.7)}
  ${rad('itPod',[[0,'#dcd8a2'],[.6,'#aaa46c'],[1,'#6c6842']],.36,.3,.7)}
  ${rad('itPaste',[[0,'#86a656'],[1,'#3a5224']],.4,.3,.8)}
  ${rad('itSeed',[[0,'#5e6474'],[1,'#24262e']],.45,.3,.7)}
</defs></svg>`);

/* ---------------- 小工具 ---------------- */
const bg = ()=>`<rect width="98" height="112" fill="url(#itBg)"/>`;
const shadow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry||rx*.2}" fill="url(#itShadow)"/>`;
// 手写体的“字”：一串小波浪，按单词断开
const scrib = (x, y, words, amp=1.1) => { let d='', cx=x;
  words.forEach(w=>{ d+=`M${f1(cx)},${y}`; let k=0; for(let i=0;i<w;i+=2.4,k++) d+=` q1.2,${k%2?amp:-amp} 2.4,0`; cx+=w+2.8; });
  return d; };
// 齿轮：梯形齿 + 齿根圆弧
function gearPath(r, n, h){
  const w = Math.PI/n; let d='';
  for(let i=0;i<n;i++){
    const a = i*2*Math.PI/n;
    [[r,a-w*.6],[r+h,a-w*.34],[r+h,a+w*.34],[r,a+w*.6]].forEach(([rr,aa],j)=>{
      d += (i===0&&j===0?'M':'L') + f1(rr*Math.cos(aa)) + ',' + f1(rr*Math.sin(aa)) + ' '; });
    const a2 = (i+1)*2*Math.PI/n - w*.6;
    d += `A${r},${r} 0 0 1 ${f1(r*Math.cos(a2))},${f1(r*Math.sin(a2))} `;
  }
  return d + 'Z';
}
function gear(r, n, mat, o={}){
  const h = o.h || Math.max(2.4, r*.2), dark = o.dark || '#3a2a14';
  let holes=''; for(let i=0;i<(o.holes||0);i++){ const a=i*2*Math.PI/o.holes + .3;
    holes += `<circle cx="${f1(r*.53*Math.cos(a))}" cy="${f1(r*.53*Math.sin(a))}" r="${f1(r*.17)}" fill="${dark}" ${Kt}/>`; }
  return `<path d="${gearPath(r,n,h)}" fill="url(#${mat})" ${Kt}/>
    <circle r="${f1(r*.82)}" fill="none" stroke="${dark}" stroke-width=".6" opacity=".8"/>
    <circle r="${f1(r*.78)}" fill="none" stroke="#fff6d8" stroke-width=".4" opacity=".35"/>
    ${holes}
    ${o.hub===false?'':`<circle r="${f1(r*.27)}" fill="url(#${mat})" ${Kt}/><rect x="${f1(-r*.1)}" y="${f1(-r*.1)}" width="${f1(r*.2)}" height="${f1(r*.2)}" fill="#120e0a"/>`}
    <path d="M${f1(-r*.88)},${f1(-r*.3)} A${f1(r*.93)},${f1(r*.93)} 0 0 1 ${f1(-r*.3)},${f1(-r*.88)}" stroke="#fff6d8" stroke-width=".9" fill="none" opacity=".45"/>
    ${o.crack?`<path d="M${f1(r*.15)},${f1(-r*.05)} L${f1(r*.42)},${f1(-r*.38)} L${f1(r*.5)},${f1(-r*.6)} L${f1(r*.78)},${f1(-r*.8)} L${f1(r+h)},${f1(-r-h*.6)}" stroke="#0c0907" stroke-width="1.6" fill="none"/>
      <path d="M${f1(r*.44)},${f1(-r*.4)} l${f1(r*.2)},${f1(r*.02)}" stroke="#0c0907" stroke-width=".8"/>`:''}`;
}
// 一束干草药（上头下茎，中段麻绳系住）
function bundle(heads, headArt, stemCol, leaves){
  const T=[49,73];
  const stems = heads.map(([x,y])=>`M${T[0]+(x-49)*.08},${T[1]} Q${f1((x+T[0])/2)},${f1(y+(T[1]-y)*.55)} ${x},${y+6}`).join(' ');
  return `${shadow(49,99,20,3.4)}
    <path d="M46.5,75 L43,99 M48.5,75 L47.5,100 M50.5,75 L52,100 M52.5,75 L55.5,99" stroke="#2b251e" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M46.5,75 L43,99 M48.5,75 L47.5,100 M50.5,75 L52,100 M52.5,75 L55.5,99" stroke="${stemCol}" stroke-width="1.1" stroke-linecap="round"/>
    <path d="${stems}" stroke="#2b251e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="${stems}" stroke="${stemCol}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    ${leaves||''}
    ${heads.map(h=>headArt(...h)).join('')}
    <path d="M44.4,71.4 Q49,73.6 53.6,71.4 M44.2,74.6 Q49,76.8 53.8,74.6" stroke="#2b251e" stroke-width="2.6" fill="none"/>
    <path d="M44.4,71.4 Q49,73.6 53.6,71.4 M44.2,74.6 Q49,76.8 53.8,74.6" stroke="#a07a46" stroke-width="1.5" fill="none"/>
    <path d="M53.4,73 q7,-6 6.6,1.4 q-.6,3.6 -6.6,-1.4 M53.4,73 q4.6,6.4 -.6,9.4" stroke="#7a5a32" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
}
// 精绘渡鸦侧影（60×60 坐标，喙朝左）：c 身体色，e 眼/羽线色；x,y 左上角，w 宽
const raven = (x, y, w, c, e) => `<g transform="translate(${x},${y}) scale(${f1(w/60)})">
  <path d="M5,20.5 L20.5,15 Q23.6,9.6 30,9.6 Q37.4,9.8 39.4,17 Q41.2,22 40.2,26 Q50.6,34 57,55 L45.6,47.4 Q40,50.4 33,49.6 Q24,47.6 21.8,38.4 Q20.8,31 24,26.4 L20.6,24.2 Z" fill="${c}"/>
  <path d="M26.6,30.6 Q38,29.6 47.4,43.4 Q38.4,40.2 29.6,38.8" fill="none" stroke="${e}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  <path d="M31.4,36 Q38,36.4 43,42" fill="none" stroke="${e}" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>
  <path d="M20.6,18.6 L8.6,20.4" stroke="${e}" stroke-width=".9" opacity=".6"/>
  <circle cx="29.6" cy="16" r="1.9" fill="${e}"/>
  <path d="M31,49.6 L29.6,57 M27,57 H32.4 M36,49.4 L37,57 M34.6,57 H39.6" stroke="${c}" stroke-width="2" stroke-linecap="round"/></g>`;
const pairLeaf = (x, y, a, c='#6f8a4a') => `<ellipse cx="${f1(x-2.6)}" cy="${f1(y)}" rx="3" ry="1.1" transform="rotate(${-30+a} ${f1(x-2.6)} ${f1(y)})" fill="${c}" stroke="#3e4a2a" stroke-width=".35"/>
  <ellipse cx="${f1(x+2.6)}" cy="${f1(y)}" rx="3" ry="1.1" transform="rotate(${30+a} ${f1(x+2.6)} ${f1(y)})" fill="${c}" stroke="#3e4a2a" stroke-width=".35"/>`;

/* ======================= 各物品 ======================= */
const ART = window.ART = {};

ART.chalice = (filled)=>`${shadow(49,92,24)}
  <g ${K}>
    <path d="M33,90 Q34,82 44,79 Q46,77 47,74 H51 Q52,77 54,79 Q64,82 65,90 Z" fill="url(#itPewter)"/>
    <ellipse cx="49" cy="90" rx="16" ry="3.2" fill="#6a665a"/>
    <path d="M37.5,86 Q49,82.6 60.5,86" fill="none" stroke-width=".6" stroke="#3e3a32"/>
    <rect x="46.6" y="56" width="4.8" height="19" fill="url(#itPewter)"/>
    <path d="M43.5,66 Q43.5,61.5 49,61.5 Q54.5,61.5 54.5,66 Q54.5,70.5 49,70.5 Q43.5,70.5 43.5,66 Z" fill="url(#itPewter)"/>
    <circle cx="49" cy="66" r="1.6" fill="#8e2a20" stroke-width=".5"/>
    <path d="M45.4,58.6 H52.6 M45.6,73.2 H52.4" stroke-width=".9"/>
    <path d="M29.5,22 Q29.5,46 40,53.5 Q44,56.6 49,56.6 Q54,56.6 58,53.5 Q68.5,46 68.5,22 Z" fill="url(#itPewter)"/>
    <path d="M30.4,30.4 Q49,35.2 67.6,30.4 M31.2,36.6 Q49,41.4 66.8,36.6" fill="none" stroke-width=".7"/>
    ${[[37,34.6,'#8e2a20'],[49,37.4,'#2a4e6e'],[61,34.6,'#8e2a20']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="1.7" fill="${c}" stroke-width=".5"/>`).join('')}
    ${[42.5,55.5].map(x=>`<path d="M${x},${36.4+(x<49?.4:.4)} l1.2,-1.2 l1.2,1.2 l-1.2,1.2 Z" fill="#cfcbbd" stroke-width=".35"/>`).join('')}
    <ellipse cx="49" cy="22" rx="19.5" ry="4.4" fill="#3e3a32"/>
  </g>
  ${filled?`<ellipse cx="49" cy="23" rx="17" ry="3.1" fill="#4c6168"/><path d="M37,22.8 Q45,20.8 55,22" stroke="#b4c6ca" stroke-width=".9" fill="none"/>
    <path d="M64.6,40 q1.6,2.8 0,4 q-1.6,-1.2 0,-4 Z" fill="#8ea8ae" stroke="#2b251e" stroke-width=".4"/>`:''}
  <path d="M30.6,22.8 Q49,27.4 67.4,22.8" stroke="#d6d2c4" stroke-width=".8" fill="none"/>
  <path d="M34,27 Q34.6,42 41,50" stroke="#fbf8ee" stroke-width="1.8" fill="none" opacity=".6" stroke-linecap="round"/>
  <path d="M47.8,58.4 V73" stroke="#f4f0e4" stroke-width=".8" opacity=".55"/>
  <circle cx="48.4" cy="65.3" r=".5" fill="#fff" opacity=".8"/>`;

ART.key = ()=>`${shadow(50,90,26,4)}
  <g transform="translate(51,56) rotate(-42)">
    <g ${K}>
      ${[180,128,232].map(a=>`<circle cx="${f1(-26+12.6*Math.cos(a*Math.PI/180))}" cy="${f1(12.6*Math.sin(a*Math.PI/180))}" r="5" fill="url(#itIron)"/>`).join('')}
      <path d="M-37,0 a11,11 0 1,0 22,0 a11,11 0 1,0 -22,0 Z M-31.6,0 a5.6,5.6 0 1,0 11.2,0 a5.6,5.6 0 1,0 -11.2,0 Z" fill="url(#itIron)" fill-rule="evenodd"/>
      <rect x="-15.6" y="-4.2" width="5" height="8.4" rx="1.2" fill="url(#itIronV)"/>
      <rect x="-11" y="-2.5" width="45" height="5" rx="1.5" fill="url(#itIronV)"/>
      <rect x="-7.2" y="-3.5" width="2.4" height="7" rx=".8" fill="#4a443c" stroke-width=".7"/>
      <path d="M24,2.5 V15 H27.5 V11.5 H30.5 V15 H34 V2.5 Z" fill="url(#itIronV)"/>
      <circle cx="34.6" cy="0" r="2.2" fill="#3a352e"/>
    </g>
    <circle cx="-26" cy="0" r="8.3" fill="none" stroke="#9e9686" stroke-width=".5"/>
    <path d="M-9,-1.3 H31" stroke="#b8b0a0" stroke-width=".7" opacity=".85"/>
    <path d="M-34.6,-6 A10,10 0 0,1 -22,-10.4" stroke="#b8b0a0" stroke-width=".9" fill="none"/>
    ${[[-20,6.5,1.1],[4,1,.8],[17,-1.2,.7],[29,9,1],[-31,7.5,.9],[-38.6,-9,.8]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8a4e26" opacity=".6"/>`).join('')}
  </g>`;

const SCRAP = 'M15,40 L22,36 L30,38 L41,33 L50,36 L58,32 L67,35 L78,32 L84,40 L82,48 L86,56 L81,64 L84,73 L78,80 L69,78 L60,84 L50,80 L40,85 L31,80 L21,83 L16,74 L19,66 L13,58 L17,49 Z';
ART.scrap = ()=>`${shadow(50,90,30,4)}
  <g transform="rotate(-7 49 58)">
    <path d="${SCRAP}" fill="url(#itParch)"/>
    <path d="${SCRAP}" fill="none" stroke="#8a5426" stroke-width="6" opacity=".35"/>
    <path d="${SCRAP}" fill="none" stroke="#3a2412" stroke-width="2.8" opacity=".9"/>
    <path d="${SCRAP}" fill="none" stroke="#120c08" stroke-width=".8"/>
    <path d="${scrib(25,48,[9,6,12,8])} ${scrib(23,56,[7,13,6,10])} ${scrib(25,64,[11,7,9,7])} ${scrib(24,72,[6,10])}" stroke="#4a3a2a" stroke-width=".75" fill="none" stroke-linecap="round"/>
    <path d="M58,66 l8,-.4" stroke="#4a3a2a" stroke-width=".75"/>
    <ellipse cx="66" cy="50" rx="6" ry="4" fill="#9a8058" opacity=".25"/>
    ${[[78,32],[86,56],[40,85],[16,74]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#ffa040" opacity=".22"/><circle cx="${x}" cy="${y}" r=".9" fill="#f08a34"/>`).join('')}
    ${[[30,79],[74,74],[20,52],[60,36]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".7" fill="#5a4a3a" opacity=".6"/>`).join('')}
  </g>`;

ART.fbook = (n)=>`${shadow(51,95,30,4)}
  <g ${K}>
    <path d="M71,21 L76,24 V95 L71,92 Z" fill="#e6ddc2"/>
    <path d="M72.6,25.6 V92.4 M74.2,26.6 V93.4" stroke="#b9ae90" stroke-width=".45"/>
    <path d="M24,92 H71 L76,95 H29 Z" fill="#d8cdb0"/>
    <rect x="22" y="19" width="50" height="74" rx="2.5" fill="url(#itLeather)"/>
  </g>
  <rect x="22.6" y="19.6" width="6" height="72.8" rx="2" fill="#1e0c08" opacity=".5"/>
  <path d="M22.6,29 H28.6 M22.6,31 H28.6 M22.6,81 H28.6 M22.6,83 H28.6" stroke="#c9a85a" stroke-width=".7"/>
  <rect x="31" y="25" width="36" height="62" fill="none" stroke="#c9a85a" stroke-width=".9"/>
  <rect x="33.4" y="27.4" width="31.2" height="57.2" fill="none" stroke="#c9a85a" stroke-width=".45" stroke-dasharray="1.4 1"/>
  ${[[72,19,-1,1],[72,93,-1,-1],[28.6,19,1,1],[28.6,93,1,-1]].map(([x,y,sx,sy])=>`<path d="M${x},${y} h${8*sx} q${-1*sx},${3*sy} ${-8*sx},${8*sy} Z" fill="url(#itBrass)" ${Kt}/><circle cx="${x+2.4*sx}" cy="${y+2.4*sy}" r=".7" fill="#4e3812"/>`).join('')}
  <circle cx="49" cy="50" r="11.6" fill="#22100a" stroke="#c9a85a" stroke-width="1"/>
  <circle cx="49" cy="50" r="9.6" fill="none" stroke="#c9a85a" stroke-width=".4" stroke-dasharray="1 1.1"/>
  ${raven(40.8,41,16.4,'#dcbc66','#22100a')}
  <path d="M38,66 q5.5,-3.4 11,0 q5.5,3.4 11,0 M38,34 q5.5,3.4 11,0 q5.5,-3.4 11,0" stroke="#c9a85a" stroke-width=".7" fill="none"/>
  <circle cx="49" cy="66" r=".9" fill="#c9a85a"/><circle cx="49" cy="34" r=".9" fill="#c9a85a"/>
  <path d="M69,45.6 H78.4 V57.4 H69" fill="url(#itLeather)" ${Kt}/>
  <rect x="75" y="48.4" width="5.4" height="6.8" rx="1" fill="url(#itBrass)" ${Kt}/>
  <path d="M29.6,21 Q50,19.4 70.4,21" stroke="#9a5a48" stroke-width=".8" fill="none" opacity=".7"/>
  ${n?`<text x="49" y="78.4" text-anchor="middle" font-family="Georgia,serif" font-size="7.4" letter-spacing=".6" fill="#e6cd8e">${n} / 7</text>`:''}`;

ART.snuffer = ()=>`${shadow(50,92,32,4)}
  <g transform="translate(50,56) rotate(-38)">
    <path d="M-36,0 H28 M-36,0 Q-44,0 -44,-6 Q-44,-11 -39.6,-11" stroke="#2b251e" stroke-width="4.2" fill="none" stroke-linecap="round"/>
    <path d="M-36,0 H28 M-36,0 Q-44,0 -44,-6 Q-44,-11 -39.6,-11" stroke="#b08a3e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M-35,-.6 H27 M-42.8,-4 Q-43,-9.6 -39.6,-10.2" stroke="#f4dc94" stroke-width=".7" fill="none" opacity=".9"/>
    ${[-24,-4,14].map(x=>`<ellipse cx="${x}" cy="0" rx="1.8" ry="2.9" fill="url(#itBrassV)" ${Kt}/>`).join('')}
    <circle cx="26.6" cy="0" r="2.4" fill="url(#itBrass)" ${Kt}/>
    <path d="M28,-1.6 L41,-9.4 Q44.6,0 41,9.4 L28,1.6 Z" fill="url(#itBrassV)" ${K}/>
    <path d="M33.4,-5 Q35,0 33.4,5" stroke="#5e4418" stroke-width=".6" fill="none"/>
    <ellipse cx="41.6" cy="0" rx="2.3" ry="9.3" fill="#2a1e0c" ${Kt}/>
    <ellipse cx="42" cy="0" rx="1.2" ry="6.4" fill="#120c06" opacity=".8"/>
    <path d="M30,-2.6 L39.6,-8" stroke="#fff0b8" stroke-width=".8" opacity=".7"/>
  </g>`;

ART.bell = ()=>`${shadow(49,96,25,4)}
  <g ${K}>
    <path d="M46,40 V34.4 Q43.6,32.6 44.4,29.4 Q45.8,27.2 46,24.4 Q43,21.4 44,16 Q45,11 49,11 Q53,11 54,16 Q55,21.4 52,24.4 Q52.2,27.2 53.6,29.4 Q54.4,32.6 52,34.4 V40 Z" fill="url(#itWood)"/>
    <rect x="44" y="38" width="10" height="4.2" rx="1" fill="url(#itBrassV)"/>
    <path d="M31,82 Q32,62 36,53 Q40,43 49,42 Q58,43 62,53 Q66,62 67,82 Z" fill="url(#itBrass)"/>
    <path d="M38.6,48.4 Q49,51.4 59.4,48.4 M34.4,62 Q49,66 63.6,62 M33.4,69.6 Q49,73.6 64.6,69.6" fill="none" stroke-width=".7"/>
    <path d="M27,84 Q27,80.4 31,80.4 Q49,86 67,80.4 Q71,80.4 71,84 Q49,91 27,84 Z" fill="url(#itBrass)"/>
    <path d="M30,84.4 Q49,89.6 68,84.4 Q49,87.4 30,84.4 Z" fill="#2e2008" stroke-width=".6"/>
    <circle cx="51" cy="89.4" r="3.1" fill="url(#itIron)"/>
  </g>
  ${[...Array(10)].map((_,i)=>{ const x=36.6+i*2.75, t=(x-49)/14.6, y=65.8+3.9*(1-t*t)-1.9;
    return i%3===2 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r=".45" fill="#4e3812"/>` : `<path d="M${f1(x)},${f1(y-1.3)} v2.6 ${i%2?'h1':''}" stroke="#4e3812" stroke-width=".55" fill="none"/>`; }).join('')}
  <path d="M39,52 Q35.6,64 35.6,79" stroke="#fff6cc" stroke-width="2.2" fill="none" opacity=".55" stroke-linecap="round"/>
  <path d="M60.6,58 Q63,68 63.4,78" stroke="#fff0b8" stroke-width=".8" fill="none" opacity=".35"/>
  <circle cx="40.6" cy="49" r="1" fill="#fff" opacity=".6"/>
  <path d="M47,14 Q46,19.6 47.4,24" stroke="#dcbc8c" stroke-width=".8" fill="none"/>`;

ART.page = ()=>`${shadow(51,96,28,4)}
  <g transform="rotate(4 49 56)">
    <path d="M24,16 H78 V96 H27 L25,92 L27,87 L24,82 L26,76 L23,70 L26,64 L24,58 L27,52 L24,46 L26,40 L23,34 L26,28 L23,22 Z" fill="url(#itParch)" ${K}/>
    <ellipse cx="64" cy="84" rx="9" ry="6" fill="#b49e70" opacity=".3"/>
    <text x="51" y="26.6" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="7" fill="#3b3026">Ravenhold</text>
    <path d="M33,30 H69" stroke="#7a6a50" stroke-width=".5"/><path d="M49,28.6 l1.4,1.4 l-1.4,1.4 l-1.4,-1.4 Z" fill="#7a6a50"/>
    ${[['1309','A'],['1342','C'],['1375','H'],['1403',''],['1408','M']].map(([yr,L],i)=>{ const y=40+i*11;
      return `<text x="31" y="${y}" font-family="Georgia,serif" font-size="5.6" fill="#4a3a2a">${yr}</text>`
        + (L ? `<text x="47" y="${y}" font-family="Georgia,serif" font-style="italic" font-size="6" fill="#3b3026">${L}</text>
             <path d="M51.4,${y-2} l20,1" stroke="#2b251e" stroke-width="2.2" stroke-linecap="round"/>
             <path d="M51,${y-3.6} l2.4,2.4 l2.4,-2.4 l2.4,2.4 l2.4,-2.4 l2.4,2.4 l2.4,-2.4 l2.4,2.4 l2.4,-2.4" stroke="#2b251e" stroke-width=".55" fill="none"/>`
             : `<text x="47" y="${y}" font-family="Georgia,serif" font-style="italic" font-size="6.4" fill="#3b3026">Edmund</text>`);
    }).join('')}
    <path d="M28.6,82 q-2,1 -1,3" stroke="#8a2a20" stroke-width=".8" fill="none"/>
  </g>`;

ART.tag = ()=>`${shadow(50,88,26,4)}
  <path d="M48,38 C40,28 41,15 49,12 C57,15 58,28 50,38" stroke="#2b251e" stroke-width="2" fill="none"/>
  <path d="M48,38 C40,28 41,15 49,12 C57,15 58,28 50,38" stroke="#a07a46" stroke-width="1.1" fill="none"/>
  <g transform="rotate(-7 49 58)">
    <path d="M20,38 Q20,34 24,34 H74 Q78,34 78,38 V77 Q78,81 74,81 H24 Q20,81 20,77 Z" fill="url(#itLead)" ${K}/>
    <rect x="24.2" y="38.2" width="50.4" height="39.4" rx="2.4" fill="none" stroke="#4a4a50" stroke-width=".6"/>
    <rect x="23.4" y="37.4" width="50.4" height="39.4" rx="2.4" fill="none" stroke="#c4c4ca" stroke-width=".5" opacity=".8"/>
    <circle cx="49" cy="38.6" r="2.2" fill="#2e2e34" stroke="#2b251e" stroke-width=".6"/>
    <use href="#deer" x="24.4" y="44.4" width="25" height="25" style="color:#c4c4ca" opacity=".55"/>
    <use href="#deer" x="25" y="45" width="25" height="25" style="color:#55555c"/>
    <path d="M53,51 h20 M53,57 h17 M53,63 h19 M27,72.4 h44" stroke="#4a4a50" stroke-width=".8"/>
    <path d="M53,51.6 h20 M53,57.6 h17 M53,63.6 h19 M27,73 h44" stroke="#c4c4ca" stroke-width=".45" opacity=".8"/>
    ${[[31,40],[70,76],[62,42],[36,75]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".6" fill="#3e3e44"/>`).join('')}
  </g>`;

// 提灯：e=true 为 E 字马车灯（圆顶 + 字牌），否则为厨房镂花锥顶铁皮灯
ART.lantern = (lit, e)=>{
  const glass = lit ? '#f8dc96' : '#5c5c52';
  const holes = (e?[]:[[44,31],[49,30],[54,31],[42,35],[47,34.4],[51,34.4],[56,35]]).map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".8" fill="${lit?'#ffd27a':'#120e0a'}"/>`).join('');
  return `${lit?`<circle cx="49" cy="60" r="38" fill="url(#itGlow)"/>`:''}${shadow(49,98,22,3.4)}
  <g ${K}>
    <path d="M43,23 Q43,12 49,12 Q55,12 55,23" fill="none" stroke-width="2.8"/>
    <path d="M43,23 Q43,12 49,12 Q55,12 55,23" fill="none" stroke="#7a7266" stroke-width="1.1"/>
    <rect x="46.4" y="21" width="5.2" height="4.6" rx="1" fill="url(#itIronV)"/>
    ${e ? `<path d="M32,40 Q33,26 49,25 Q65,26 66,40 Z" fill="url(#itIron)"/><rect x="43.4" y="30" width="11.2" height="8" rx="1" fill="url(#itBrass)" ${Kt}/>
           <text x="49" y="36.8" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="7" fill="#3a2810" stroke="none">E</text>`
        : `<path d="M35,40 L45.4,25 H52.6 L63,40 Z" fill="url(#itIron)"/>`}
    <rect x="32" y="39.6" width="34" height="4.2" rx="1.2" fill="url(#itIronV)"/>
    <rect x="35" y="43.8" width="28" height="32.4" fill="${glass}"/>
  </g>
  ${holes}
  ${lit?`<ellipse cx="49" cy="58" rx="12" ry="14" fill="#fff6d0" opacity=".55"/>`:''}
  <rect x="46" y="62" width="6" height="13.6" fill="${lit?'#efe4c8':'#a49c88'}" ${Kt}/>
  <path d="M49,62 v-2.4" stroke="#1a1511" stroke-width=".8"/>
  ${lit?`<path class="flame" d="M49,50.6 Q52.6,55.6 51.9,58.8 Q51,61.2 49,61.2 Q47,61.2 46.1,58.8 Q45.4,55.6 49,50.6 Z" fill="url(#itFlame)"/>`:''}
  <g ${K}>
    <path d="M35,43.8 V76.2 M63,43.8 V76.2" stroke-width="2.2"/>
    <path d="M41.6,43.8 V76.2 M56.4,43.8 V76.2" stroke-width="1.2"/>
    <path d="M35,66.4 H45.6 M52.4,66.4 H63" stroke-width="1"/>
    <path d="M32,76.2 H66 L63,82.4 H35 Z" fill="url(#itIronV)"/>
    <path d="M37,82.4 v2.6 h3.4 v-2.6 M58,82.4 v2.6 h3.4 v-2.6" fill="#2a2622"/>
  </g>
  <path d="M37.2,46 V64" stroke="#fffbe8" stroke-width="1.1" opacity="${lit?.75:.3}"/>
  <path d="M60.8,48 V58" stroke="#fffbe8" stroke-width=".6" opacity="${lit?.5:.2}"/>`;
};

ART.recipe = ()=>`${shadow(50,94,30,4)}
  <g transform="rotate(-5 49 56)">
    <path d="M22,21 H80 V93 H22 Z" fill="#c4b892" ${Kt} transform="rotate(5 51 57)"/>
    <path d="M19,18 H77 L80,21.4 V94 H24 L19,89 Z" fill="url(#itParch)" ${K}/>
    <path d="M19,89 H24 V94 Z" fill="#b2a37c" ${Kt}/>
    <path d="M19,56 H80" stroke="#ab9c74" stroke-width=".7"/><path d="M19,56.8 H80" stroke="#f6efda" stroke-width=".5"/>
    <text x="50" y="27.4" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="6.2" fill="#3b3026">Somnus</text>
    <path d="M37,30 H63" stroke="#7a6a50" stroke-width=".45"/>
    <path d="${scrib(26,37,[10,7,12])} ${scrib(28,43,[8,13,9])} ${scrib(26,49,[12,6,10])} ${scrib(26,63,[9,8])} ${scrib(26,69,[13,5])}" stroke="#4a3a2a" stroke-width=".7" fill="none" stroke-linecap="round"/>
    <text x="70" y="38" font-family="Georgia,serif" font-size="5" fill="#6a3a2a">iv</text>
    <text x="68" y="50" font-family="Georgia,serif" font-size="5" fill="#6a3a2a">vii</text>
    <path d="M58,90 Q62,80 69,70" stroke="#4e5e34" stroke-width=".9" fill="none"/>
    ${[[60,85,-30],[62.4,80.6,-34],[65,76.4,-38]].map(([x,y,a])=>pairLeaf(x,y,a,'#7a8e52')).join('')}
    ${[[69,69],[71,70.4],[67.6,67.6],[70.4,67.4],[72.4,68.4],[68.8,66]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.1" fill="#f2ebdc" stroke="#6a6050" stroke-width=".3"/>`).join('')}
    <path d="M30.4,76 q4.4,-.4 6,2.6 q1.6,3.4 -.6,6 q-2.4,2.6 -6,1.6 q-3.4,-1.2 -3.6,-4.6 q0,-4.6 4.2,-5.6 Z" fill="url(#itWax)" ${Kt}/>
    <text x="31.4" y="83.6" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="6" fill="#f0a898" opacity=".85">I</text>
  </g>`;

const VIAL = 'M42,47 V37 H56 V47 Q66,52 66,64 V85 Q66,93 58,93 H40 Q32,93 32,85 V64 Q32,52 42,47 Z';
ART.vial = (full)=>`${full?`<ellipse cx="49" cy="76" rx="26" ry="22" fill="#a05a90" opacity=".14"/>`:''}${shadow(49,96,21,3.4)}
  <path d="${VIAL}" fill="#cad7d0" opacity=".3"/>
  ${full?`<path d="M33.2,66 Q49,63.4 64.8,66 V85 Q64.8,91.8 58,91.8 H40 Q33.2,91.8 33.2,85 Z" fill="url(#itPotion)"/>
    <ellipse cx="49" cy="65.6" rx="15.8" ry="2.2" fill="#b56aa0"/>
    ${[[43,79,1.3],[55,84,1],[52,73,.9],[40.6,86,.8],[58,76,.7]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#f0c4e2" stroke-width=".5" opacity=".9"/>`).join('')}`
  : `<path d="M34,88.6 Q49,91 64,88.6" stroke="#7e908a" stroke-width=".8" fill="none"/>`}
  <path d="${VIAL}" fill="url(#itGlass)" ${K}/>
  <path d="M42,47 Q49,49 56,47" stroke="#2b251e" stroke-width=".6" fill="none" opacity=".6"/>
  <text x="49.6" y="84.6" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="none" stroke="#3e4e48" stroke-width=".6" opacity=".7">H</text>
  <text x="49" y="84" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="none" stroke="#f2f8f4" stroke-width=".7" opacity=".85">H</text>
  <rect x="40" y="35" width="18" height="4" rx="2" fill="#e2ebe6" ${Kt}/>
  <path d="M42.6,35 L41.6,23.4 Q41.6,21 43.6,21 H54.4 Q56.4,21 56.4,23.4 L55.4,35 Z" fill="#a8824e" ${K}/>
  <path d="M42,26 H56" stroke="#7a5a32" stroke-width=".6"/>
  ${[[45,24],[51,29],[47,31.6],[53.4,24.4],[44.4,29.6],[50,33]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".55" fill="#6e4e28"/>`).join('')}
  ${full?`<path d="M41.8,44.4 Q49,47 56.2,44.4" stroke="#2b251e" stroke-width="2.2" fill="none"/><path d="M41.8,44.4 Q49,47 56.2,44.4" stroke="#a07a46" stroke-width="1.2" fill="none"/>
    <path d="M56.2,44.6 L64,50" stroke="#a07a46" stroke-width=".8"/>
    <g transform="rotate(-16 67 55)"><rect x="62.6" y="49.4" width="9" height="11" rx="1" fill="url(#itParch)" ${Kt}/><circle cx="67" cy="51.6" r=".8" fill="#2b251e"/>
      <path d="M64.4,55 h5.4 M64.4,57.4 h4" stroke="#5a2a3a" stroke-width=".5"/></g>`:''}
  <path d="M36.6,61 Q35.4,74 36.8,87.4" stroke="#fff" stroke-width="2.1" fill="none" opacity=".55" stroke-linecap="round"/>
  <path d="M60.4,57.4 Q62.8,61.6 63.2,68" stroke="#fff" stroke-width=".9" fill="none" opacity=".45"/>
  <path d="M44,39.6 V46" stroke="#fff" stroke-width=".7" opacity=".6"/>`;

const podHead = (x, y, r, s=1)=>`<g transform="translate(${x},${y}) rotate(${r}) scale(${s})">
  <path d="M0,6.6 v3" stroke="#2b251e" stroke-width="1.8"/>
  <ellipse rx="5.6" ry="6.6" fill="url(#itPod)" ${Kt}/>
  <path d="M-2.6,-5.2 Q-3.6,0 -2.6,5.2 M2.6,-5.2 Q3.6,0 2.6,5.2 M0,-6 V6" stroke="#6a6440" stroke-width=".45" fill="none"/>
  <ellipse cx="-2.1" cy="-1.6" rx="1.2" ry="2.6" fill="#f0ecbc" opacity=".45"/>
  <ellipse cy="-6.4" rx="4.3" ry="1.5" fill="#8a8450" ${Kt}/>
  <path d="M0,-6.6 l-3.6,-.5 M0,-6.6 l3.6,-.5 M0,-6.6 l-2,-1.4 M0,-6.6 l2,-1.4 M0,-6.6 v-1.6" stroke="#4a4426" stroke-width=".5"/></g>`;
const dryLeaf = (x, y, a, s=1) => `<path transform="translate(${x},${y}) rotate(${a}) scale(${s})" d="M0,0 L3,-2.2 L3.8,-.4 L7,-2.6 L7.6,-.6 L11,-2 Q6,5 0,0 Z" fill="#8e9474" ${Kt}/>`;
ART.poppy = ()=> bundle([[35,30,-16,.95],[50,21,0,1.05],[64,31,16,.95],[43,43,-8,.8],[57,44,10,.8]], podHead, '#76724c',
  dryLeaf(41,60,-130,1.1) + dryLeaf(57,58,-40,1.1) + dryLeaf(46,52,-110,.8));

const umbel = (x, y, s=1)=>{ let f='', r=''; const pts=[];
  for(let i=0;i<15;i++){ const a=Math.PI*(1.08+i*.84/14*1)+(i%2)*.04, rr=6.4*s*(i%3===1?.72:1);
    pts.push([x+rr*Math.cos(a)*1.05, y+rr*Math.sin(a)*.85+1.6*s]); }
  pts.push([x,y-2*s],[x-2.6*s,y],[x+2.6*s,y],[x-1.2*s,y-4.4*s],[x+1.6*s,y-4*s]);
  pts.forEach(([px,py],i)=>{ r+=`M${x},${f1(y+6*s)} L${f1(px)},${f1(py)} `;
    f+=`<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(1.45*s)}" fill="${i%4===1?'#ecd6da':'#f4eee0'}" stroke="#6a6050" stroke-width=".32"/>`; });
  return `<path d="${r}" stroke="#6e7a48" stroke-width=".4" fill="none"/>${f}`; };
ART.valerian = ()=> bundle([[36,30],[51,22],[64,32],[45,42]], (x,y)=>umbel(x,y, y<40?1:.8), '#5e6e40',
  [[40,52,-12],[45,40,-6],[57,40,6],[60,50,12],[52,60,0],[44,62,-6]].map(([x,y,a])=>pairLeaf(x,y,a)).join(''));

ART.seeds = ()=>`${shadow(50,96,27,3.6)}
  <g ${K}>
    <path d="M30,56 Q24,68 27,80 Q30,92 49,93 Q68,92 71,80 Q74,68 68,56 Z" fill="url(#itLinen)"/>
    <path d="M29,53 Q49,44 69,53" fill="#8a7e60"/>
    <path d="M32.4,54.6 Q35,43 49,40 Q63,43 65.6,54.6 Z" fill="url(#itSeed)" stroke-width=".8"/>
  </g>
  ${[...Array(26)].map((_,i)=>{ const a=(i*137.5)%360*Math.PI/180, rr=Math.sqrt(i/26); const x=49+rr*14*Math.cos(a), y=49.6+rr*6*Math.sin(a)-(1-rr)*4;
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r=".75" fill="${i%3?'#7a8090':'#a6acba'}"/>`; }).join('')}
  <path d="M33,84 Q49,88 65,84 M30,74 Q49,79 68,74 M38,62 Q37,76 40,90 M58,62 Q61,76 58,90" stroke="#9a8e6e" stroke-width=".45" fill="none"/>
  <path d="M28,53 Q49,61 70,53 Q72.4,57 68,59.6 Q49,66 30,59.6 Q25.6,57 28,53 Z" fill="#d6caa6" ${K}/>
  <path d="M30,57.6 Q49,63.4 68,57.6" stroke="#a89a76" stroke-width=".5" fill="none"/>
  <path d="M68.6,58.6 q6,3 4.4,11 M68.6,58.6 q2.8,5.6 8.4,8.2" stroke="#2b251e" stroke-width="1.9" fill="none" stroke-linecap="round"/>
  <path d="M68.6,58.6 q6,3 4.4,11 M68.6,58.6 q2.8,5.6 8.4,8.2" stroke="#8a6438" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="73" cy="70" r="1.5" fill="#8a6438" ${Kt}/><circle cx="77" cy="67" r="1.5" fill="#8a6438" ${Kt}/>
  ${[[23,96],[27.4,98],[75,97],[71,99.4],[80,95],[31,100]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx=".9" ry=".7" fill="#3a3e48"/>`).join('')}`;

ART.paste = ()=>`${shadow(49,96,29,4)}
  <g ${K}>
    <path d="M24,56 Q24,79 38,87.6 L36.6,92 H61.4 L60,87.6 Q74,79 74,56 Z" fill="url(#itStone)"/>
    <rect x="34" y="91" width="30" height="4.4" rx="1.6" fill="#6e6a60"/>
    <ellipse cx="49" cy="56" rx="25" ry="6.6" fill="#9a9588"/>
    <ellipse cx="49" cy="56.8" rx="21" ry="4.8" fill="#46423a"/>
    <path d="M29,57.6 Q32.6,54 38,55.4 Q42,52.8 47,54.6 Q52,52.6 56,55 Q61,53.4 65,55.4 Q69,56 69,57.6 Q49,62 29,57.6 Z" fill="url(#itPaste)" stroke-width=".6"/>
  </g>
  ${[[36,56.4],[41,55.2],[46,57.4],[52,55.6],[58,57],[62,55.8],[44,58.6],[55,58.8]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%2?.6:.8}" fill="${i%3?'#a8c272':'#2e421c'}"/>`).join('')}
  <g ${K}><path d="M53,58 L69.4,22.6 Q71.4,18.4 75.2,20 Q79,21.8 77.4,25.8 L60.6,60.6 Q57,62.4 53,58 Z" fill="url(#itWood)"/></g>
  <path d="M71.6,22.6 L56.4,57" stroke="#dcbc8c" stroke-width=".8" opacity=".8"/>
  <path d="M28,64 Q30,74 38,82 M70,64 Q68,74 61,82" stroke="#d2ccbe" stroke-width=".7" fill="none" opacity=".55"/>
  ${[[31,70],[34,78],[66,72],[62,80],[45,84],[54,86]].map(([x,y])=>`<path d="M${x},${y} l1.4,.6" stroke="#4e4a42" stroke-width=".5"/>`).join('')}
  <path d="M27.2,61 Q49,67.4 70.8,61" stroke="#d8d2c4" stroke-width=".6" fill="none" opacity=".7"/>
  <ellipse cx="22" cy="95" rx="4.6" ry="1.6" transform="rotate(-18 22 95)" fill="#6f8a4a" stroke="#3e4a2a" stroke-width=".4"/>`;

ART.crank = ()=>`${shadow(50,96,26,3.6)}
  <path d="M34,86 V41 Q34,34 41,33 L64,27.4" stroke="#1a1714" stroke-width="7.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M34,86 V41 Q34,34 41,33 L64,27.4" stroke="#5a544c" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32.8,84 V41.4 Q33,35.6 40,34.2 L63,28.6" stroke="#a49c8e" stroke-width="1.1" fill="none"/>
  <g ${K}>
    <rect x="30.4" y="74.6" width="7.2" height="4.4" rx="1" fill="url(#itIronV)"/>
    <rect x="27.4" y="79.6" width="13.2" height="13.2" rx="1.6" fill="url(#itIron)"/>
    <rect x="61" y="5.6" width="10.4" height="25" rx="4.8" fill="url(#itWood)"/>
    <rect x="60.4" y="25.6" width="11.6" height="3.6" rx="1" fill="url(#itIronV)"/>
  </g>
  <rect x="31" y="83.2" width="6" height="6" fill="#0c0a08"/>
  <path d="M28.6,80.6 H39.6" stroke="#a49c8e" stroke-width=".6"/>
  <path d="M63.4,8 Q62.4,16 63.4,24 M66.4,7.2 Q67.4,15 66.2,24 M69,8.6 Q68.6,15 69.2,22" stroke="#6a4a2a" stroke-width=".45" fill="none"/>
  <path d="M63,8.4 V23.6" stroke="#e0c08e" stroke-width=".9" opacity=".7"/>
  ${[[34,58,1.1],[36,48,.8],[48,31.4,.9],[33,68,.7],[57,29,.7]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8a4e26" opacity=".65"/>`).join('')}`;

ART.gears = ()=>`${shadow(52,99,32,4)}
  <g transform="translate(34,82) rotate(10)">${gear(11,10,'itBronze',{holes:4,dark:'#2e2210',crack:true})}</g>
  <g transform="translate(66,89) rotate(4)">${gear(8,9,'itIron',{dark:'#1a1714'})}</g>
  <g transform="translate(68,62) rotate(-12)">${gear(12.4,12,'itBronze',{holes:4,dark:'#3a2a14'})}</g>
  <g transform="translate(40,45) rotate(6)">${gear(18,16,'itBrass',{holes:6,dark:'#4e3812'})}</g>`;

ART.cgear = ()=>`${shadow(49,96,30,4)}
  <g transform="translate(49,55)">
    ${gear(25,12,'itCopper',{h:6.4,dark:'#4a240c',hub:false})}
    <circle r="17.6" fill="#a65c2a" stroke="#4a240c" stroke-width=".7"/>
    <circle r="15.6" fill="none" stroke="#5a2a0e" stroke-width=".5" stroke-dasharray="1.2 1.3"/>
    ${raven(-9.4,-13.4,20,'#e8a46c','#e8a46c').replace('<g ','<g opacity=".35" ')}
    ${raven(-10,-14,20,'#5a280c','#c27a44')}
    <text y="11.6" text-anchor="middle" font-family="Georgia,serif" font-size="5.6" letter-spacing=".6" fill="#4a200a">III</text>
    ${[[-20,-14,2.2],[22,6,1.8],[-6,24,2],[14,-21,1.4],[-24,9,1.3]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#5a9a80" opacity=".5"/>`).join('')}
  </g>`;

ART.deer = ()=>`${shadow(48,96,32,3.6)}
  <path d="M75,82 Q84,84 85.4,91 Q86.4,97.6 80.4,99.6" stroke="#8a2a20" stroke-width="1" fill="none"/>
  <circle cx="80.4" cy="99.6" r="2.1" fill="#b0402a" ${Kt}/>
  <g ${K}>
    ${[30.4,38.8,55.2,62].map((x,i)=>`<rect x="${x}" y="57" width="4" height="22" rx="1.2" fill="url(#itWood)" stroke-width=".9" transform="rotate(${[4,-2,2,-4][i]} ${x+2} 68)"/>`).join('')}
    <rect x="20" y="77.6" width="56" height="7" rx="1.6" fill="url(#itWoodV)"/>
    <path d="M26,52 Q26,44 36,44 H58 Q66,44 67,50 Q68,58.6 60,60 H34 Q26,60 26,52 Z" fill="url(#itWoodV)"/>
    <path d="M56,48 C58,40 61,33 65,28 L72,30 C69,36 67,44 66,53 Z" fill="url(#itWood)"/>
    <path d="M63,29 C64,24 69,21.6 74,22.6 L83,27.6 C85,29 84.4,31.8 82,31.8 L73,32.4 C68,32.6 64,32 63,29 Z" fill="url(#itWoodV)"/>
    <path d="M66,25 C62,22.6 59.6,19.6 60.6,17.8 C64.4,18 67,20.6 68,23.6 Z" fill="#8a6438" stroke-width=".9"/>
    <path d="M26.6,48 Q22,43 20.4,45.6 Q21,50.4 26.2,51" fill="#8a6438" stroke-width=".9"/>
    <path d="M38,44.4 Q47,43 55,44.4 L54,56.4 Q46.4,58.4 39,56.4 Z" fill="#8a2f24" stroke-width=".8"/>
  </g>
  ${[[41.6,48],[46.6,47.4],[51.4,48],[44,52.6],[49,52.8]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".8" fill="#e2c068"/>`).join('')}
  <path d="M39.4,55 Q46.6,56.8 53.8,55" stroke="#e2c068" stroke-width=".5" fill="none"/>
  <path d="M68.4,22.8 C66,17 63.6,12.6 59.6,8 M66.2,17.4 L69.4,12 M63.2,12.6 L64.2,6.4 M67.8,20.6 L63.4,19.4 M71.2,22.4 C71.6,16.4 73.4,11.4 71.4,5.6 M71.8,15.4 L76.6,12.6 M72.6,10.4 L77,7" stroke="#2b251e" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M68.4,22.8 C66,17 63.6,12.6 59.6,8 M66.2,17.4 L69.4,12 M63.2,12.6 L64.2,6.4 M67.8,20.6 L63.4,19.4 M71.2,22.4 C71.6,16.4 73.4,11.4 71.4,5.6 M71.8,15.4 L76.6,12.6 M72.6,10.4 L77,7" stroke="#6a4a2a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M65,15 L61.6,10.4 M72.4,13.6 L72.2,8.6" stroke="#f0d8a8" stroke-width=".55" opacity=".9"/>
  <circle cx="72.6" cy="26.6" r="1.15" fill="#1a1511"/><circle cx="72.9" cy="26.2" r=".35" fill="#fff"/>
  <circle cx="83.2" cy="29.2" r=".9" fill="#1a1511"/>
  <path d="M30,46.6 Q45,45 58,46" stroke="#e8cc98" stroke-width=".8" fill="none" opacity=".7"/>
  <path d="M30,55 Q36,53.6 37,57 M59,54 Q63,52 64,55" stroke="#6a4a2a" stroke-width=".45" fill="none"/>
  ${[28,68].map(x=>`<g transform="translate(${x},88)"><circle r="6" fill="#5a3c20" ${K}/><circle r="4.2" fill="none" stroke="#2e1e10" stroke-width=".6"/>
    <path d="M-3,-3 L3,3 M3,-3 L-3,3 M0,-4.2 V4.2 M-4.2,0 H4.2" stroke="#2e1e10" stroke-width=".55"/><circle r="1.3" fill="#c9a85a" stroke="#2b251e" stroke-width=".4"/>
    <path d="M-4.6,-2.6 A5.2,5.2 0 0 1 -1,-5" stroke="#b48c58" stroke-width=".7" fill="none"/></g>`).join('')}`;

const ear = (a, s=1)=>{ let g='';
  for(let j=0;j<7;j++){ const y=-6-j*4.1;
    g += `<path d="M-1.4,${y-3} L-7,${y-17} M1.4,${y-.6} L7,${y-14}" stroke="#c49a40" stroke-width=".42"/>`;
    g += `<ellipse cx="-2.3" cy="${y}" rx="2.4" ry="4.4" transform="rotate(-22 -2.3 ${y})" fill="url(#itWheat)" stroke="#7a5a18" stroke-width=".45"/>`;
    g += `<ellipse cx="2.3" cy="${y+2}" rx="2.4" ry="4.4" transform="rotate(22 2.3 ${y+2})" fill="url(#itWheat)" stroke="#7a5a18" stroke-width=".45"/>`; }
  g += `<path d="M0,-36 V-52" stroke="#c49a40" stroke-width=".42"/><ellipse cx="0" cy="-36" rx="2.1" ry="4.2" fill="url(#itWheat)" stroke="#7a5a18" stroke-width=".45"/>`;
  return `<g transform="translate(49,72) rotate(${a}) scale(${s})"><path d="M0,0 V-34" stroke="#2b251e" stroke-width="2"/><path d="M0,0 V-34" stroke="#c8a040" stroke-width="1"/>${g}</g>`; };
ART.wheat = ()=>`${shadow(49,99,20,3.4)}
  <path d="M47,76 L43.6,99 M49,76 L48.4,100 M51,76 L53.6,99.6 M52.6,76 L56.6,98.6" stroke="#2b251e" stroke-width="2" stroke-linecap="round"/>
  <path d="M47,76 L43.6,99 M49,76 L48.4,100 M51,76 L53.6,99.6 M52.6,76 L56.6,98.6" stroke="#c8a040" stroke-width="1" stroke-linecap="round"/>
  <path d="M49,84 Q36,72 29,56 Q38,66 50.6,80 Z" fill="#c09a3c" ${Kt}/>
  ${ear(-20,.9)}${ear(19,.9)}${ear(0,1)}
  <path d="M44,74.4 Q49,77 54,74.4 V78.4 Q49,81 44,78.4 Z" fill="#8a2a20" ${Kt}/>
  <path d="M53.6,76.4 q6,-4 7.4,2 l-3.2,-.6 l1.4,5.2 q-4,-3 -5.6,-6.6 Z" fill="#7a2018" ${Kt}/>
  <path d="M45,75.6 Q49,77.8 53,75.6" stroke="#c8584a" stroke-width=".5" fill="none"/>`;

ART.skey = ()=>`${shadow(50,90,26,4)}
  <g transform="translate(52,57) rotate(-40)">
    <g ${K}>
      <circle cx="-24" cy="0" r="14" fill="url(#itBrass)"/>
      <circle cx="-24" cy="0" r="10.4" fill="#3e2a12" stroke-width=".8"/>
      <rect x="-10.6" y="-4.6" width="5" height="9.2" rx="1" fill="url(#itBrassV)"/>
      <rect x="-6" y="-2.6" width="42" height="5.2" rx="1.6" fill="url(#itBrassV)"/>
      <path d="M24,2.6 V12.4 H28 V8.4 H31 V14.4 H36 V2.6 Z" fill="url(#itBrassV)"/>
      <circle cx="36.4" cy="0" r="2.4" fill="url(#itBrass)"/>
    </g>
    ${[...Array(12)].map((_,i)=>{ const a=i*Math.PI/6; return `<circle cx="${f1(-24+12.2*Math.cos(a))}" cy="${f1(12.2*Math.sin(a))}" r=".6" fill="#fff0b8" opacity=".8"/>`; }).join('')}
    <g transform="translate(-24,0) rotate(40)"><use href="#deer" x="-9" y="-9.4" width="18" height="18" style="color:#e8c87a"/></g>
    <path d="M-4,-1.4 H34" stroke="#fff2c0" stroke-width=".7" opacity=".85"/>
    <path d="M-34.6,-6.4 A12.6,12.6 0 0 1 -20,-13.4" stroke="#fff2c0" stroke-width=".9" fill="none" opacity=".8"/>
  </g>`;

ART.hmirror = ()=>`${shadow(52,99,24,3.6)}
  <g transform="translate(47,48) rotate(-18)">
    <g ${K}>
      <path d="M-3.6,22 Q-4.6,30 -3,35.6 Q-5,38 -3,40.4 L-3,51.6 Q-5,54.6 -2.6,57 H2.6 Q5,54.6 3,51.6 L3,40.4 Q5,38 3,35.6 Q4.6,30 3.6,22 Z" fill="url(#itGold)"/>
      <circle cx="0" cy="59.6" r="3.2" fill="url(#itGold)"/>
      ${[...Array(18)].map((_,i)=>{ const a=i*Math.PI/9; return `<circle cx="${f1(20.6*Math.cos(a))}" cy="${f1(25.6*Math.sin(a))}" r="1.9" fill="url(#itGold)" stroke-width=".55"/>`; }).join('')}
      <ellipse rx="20" ry="25" fill="url(#itGold)"/>
      <path d="M0,-25 l-3.2,-4.4 l3.2,-3.2 l3.2,3.2 Z" fill="url(#itGold)" stroke-width=".8"/>
    </g>
    <ellipse rx="17.2" ry="22" fill="none" stroke="#6a4a10" stroke-width=".6"/>
    <ellipse rx="15.2" ry="19.8" fill="url(#itMirror)" ${Kt}/>
    <use href="#sym-moon" x="1" y="-14" width="11" height="11" style="color:#ffffff" opacity=".5"/>
    <path d="M-10,-9 Q-7,-15.4 -1.4,-16.4" stroke="#fff" stroke-width="1.7" fill="none" opacity=".85" stroke-linecap="round"/>
    <path d="M-11.6,-2 Q-11.6,-4.4 -10.8,-6" stroke="#fff" stroke-width="1" fill="none" opacity=".7" stroke-linecap="round"/>
    ${[[0,-22.6,'#8e2a20'],[0,22.6,'#2a4e6e'],[-17.6,0,'#2a4e6e'],[17.6,0,'#8e2a20']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="1.4" fill="${c}" stroke="#2b251e" stroke-width=".4"/>`).join('')}
    <path d="M-1.6,24 V50" stroke="#fff4c8" stroke-width=".7" opacity=".8"/>
  </g>`;

ART.ring = ()=>`${shadow(49,92,24,4)}
  <g transform="translate(49,60)">
    <ellipse cy="10" rx="20" ry="14" fill="none" stroke="#2b251e" stroke-width="7.6"/>
    <ellipse cy="10" rx="20" ry="14" fill="none" stroke="url(#itGold)" stroke-width="5.4"/>
    <ellipse cy="10" rx="20" ry="14" fill="none" stroke="#7a5614" stroke-width=".6" opacity=".8"/>
    <path d="M-17,17 Q0,27.6 17,17" stroke="#fff6cc" stroke-width=".9" fill="none" opacity=".7"/>
    <g ${K}>
      <path d="M-15,-14 Q-19,-8 -16,-2 L-8,-2 Z M15,-14 Q19,-8 16,-2 L8,-2 Z" fill="url(#itGoldV)"/>
      <rect x="-14" y="-20" width="28" height="22" rx="5" fill="#7a5614"/>
      <rect x="-14" y="-24" width="28" height="20" rx="5" fill="url(#itGold)"/>
      <rect x="-10" y="-20.6" width="20" height="12.8" rx="3" fill="#15110c" stroke-width=".8"/>
    </g>
    ${raven(-6.4,-20.4,12.6,'#e6c46c','#15110c')}
    <path d="M-8,-19 h6" stroke="#fff" stroke-width=".5" opacity=".5"/>
    ${[[-11.6,-21.6],[11.6,-21.6],[-11.6,-6.6],[11.6,-6.6]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".9" fill="#fff4c8" stroke="#6a4a10" stroke-width=".3"/>`).join('')}
    <path d="M19,2 l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1 Z" fill="#fff" opacity=".85"/>
  </g>`;

ART.pact = ()=>`${shadow(50,98,30,4)}
  <g ${K}>
    <rect x="25" y="24" width="48" height="64" fill="url(#itParch)"/>
    <path d="M22,17.6 H76 Q80.4,17.6 80.4,22 Q80.4,26.4 76,26.4 H22 Q17.6,26.4 17.6,22 Q17.6,17.6 22,17.6 Z" fill="#d8caa4"/>
    <ellipse cx="20" cy="22" rx="2.4" ry="4.4" fill="#b8a77e"/>
    <path d="M22,85.6 H76 Q80.4,85.6 80.4,90 Q80.4,94.4 76,94.4 H22 Q17.6,94.4 17.6,90 Q17.6,85.6 22,85.6 Z" fill="#d0c29a"/>
    <ellipse cx="78" cy="90" rx="2.4" ry="4.4" fill="#b8a77e"/>
  </g>
  <path d="M20,20 q1.2,2 0,4 M78,88 q1.2,2 0,4" stroke="#7a6a4a" stroke-width=".5" fill="none"/>
  <path d="M24,19.6 H74" stroke="#f6efda" stroke-width=".7"/>
  <text x="49" y="34.6" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="6.2" fill="#3b3026">Pactum</text>
  <path d="M36,37.4 H62" stroke="#7a6a50" stroke-width=".45"/>
  <path d="${scrib(30,44,[8,11,9])} ${scrib(29,50,[12,7,10])} ${scrib(30,56,[9,9,9])} ${scrib(29,62,[11,13])}" stroke="#4a3a2a" stroke-width=".7" fill="none" stroke-linecap="round"/>
  <path d="M30,74 q2.6,-6 5.4,-.6 t5,-1 q2.6,-5 4.6,.8 q1.6,2.6 5.4,-1.6" stroke="#7a1a12" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M34,78.6 H50" stroke="#6a5a44" stroke-width=".45"/>
  <path d="M60.4,80 L56.4,97 L59.2,94.2 L61.2,98 Z" fill="#7a1a12" ${Kt}/>
  <path d="M64.2,80 L68.6,97 L65.6,94.2 L63.4,98 Z" fill="#5e120e" ${Kt}/>
  <path d="M62.4,69.4 q4.4,0 6.4,2.6 q2.6,3 1.6,6.4 q-1,4.2 -5.4,5.2 q-4.2,.8 -6.8,-1.6 q-3.2,-3.2 -2,-7.4 q1,-4.8 6.2,-5.2 Z" fill="url(#itWax)" ${Kt}/>
  <circle cx="62.6" cy="76.4" r="4.6" fill="none" stroke="#5a0e0a" stroke-width=".5"/>
  ${raven(58.4,71.4,8.6,'#4a0806','#b8443a')}`;

ART.generic = ()=>`${shadow(49,92,18,3)}<circle cx="49" cy="56" r="20" fill="none" stroke="#6b6252" stroke-width="1" stroke-dasharray="2 2"/>
  <text x="49" y="66" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="28" fill="#6b6252">?</text>`;

/* ---------------- 接入物品栏 ---------------- */
const wrap = fn => ()=> bg() + fn();
Object.assign(TH, {
  chalice: ()=> bg() + ART.chalice(S.filled),
  key:     wrap(ART.key),     scrap:  wrap(ART.scrap),
  fbook:   ()=> bg() + ART.fbook(G.memories.length),
  snuffer: wrap(ART.snuffer), bell:   wrap(ART.bell),   page: wrap(ART.page), tag: wrap(ART.tag),
  lamp:    ()=> bg() + ART.lantern(true, false),
  recipe:  wrap(ART.recipe),
  vial:    ()=> bg() + ART.vial(false),
  potion:  ()=> bg() + ART.vial(true),
  poppy:   wrap(ART.poppy),   valerian: wrap(ART.valerian),
  seeds:   wrap(ART.seeds),   paste:  wrap(ART.paste),
  crank:   wrap(ART.crank),   gears:  wrap(ART.gears),
  elamp:   ()=> bg() + ART.lantern(typeof S4!=='undefined' && !!S4.lampLit, true),
  cgear:   wrap(ART.cgear),   deer:   wrap(ART.deer),   wheat: wrap(ART.wheat),
  skey:    wrap(ART.skey),    hmirror: wrap(ART.hmirror),
  ring:    wrap(ART.ring),    pact:   wrap(ART.pact),
  _generic: wrap(ART.generic)
});
// 罂粟籽 / 缬草泥 的特写直接放大精绘版（原先放大的是缩略图）
const big = (title, cap, art) => ({ title, cap, svg:`<rect width="600" height="400" fill="#8f8875"/>
  <ellipse cx="300" cy="200" rx="260" ry="190" fill="#a39b87" opacity=".5"/>
  <g transform="translate(${300-49*3.4},${200-58*3.4}) scale(3.4)">${art}</g>` });
VIEWS.seeds = ()=> big('Poppy Seeds', '称好的罂粟籽，和圣铃一样重。', ART.seeds());
VIEWS.paste = ()=> big('Valerian Paste', '九片缬草叶捣成的泥。', ART.paste());

/* ---------------- 物品特写：统一「陈列台」+ 精绘版（锈湖式：暗底、单一顶光、物件居中、厚描边） ---------------- */
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  ${rad('itShowBg',[[0,'#b9b098'],[.45,'#8f8772'],[1,'#4e4838']],.5,.42,.75)}
  ${rad('itShowVig',[[.55,'#000',0],[1,'#000',.45]],.5,.5,.72)}
  ${lin('itShowTop',[[0,'#5a4c3a'],[1,'#3a3026']],0,1)}
  <filter id="itShowNoise" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .17  0 0 0 0 .12  0 0 0 -1.4 .62"/></filter>
</defs></svg>`);
const show = (art, s=3.2, dy=0) => `<rect width="600" height="400" fill="url(#itShowBg)"/>
  <path d="M0,318 Q300,300 600,318 V400 H0 Z" fill="url(#itShowTop)" opacity=".55"/>
  <path d="M0,318 Q300,300 600,318" stroke="#2b251e" stroke-width="1.6" fill="none" opacity=".6"/>
  <g transform="translate(${f1(300-49*s)},${f1(206-58*s+dy)}) scale(${s})">${art}</g>
  <rect width="600" height="400" filter="url(#itShowNoise)" opacity=".5" pointer-events="none"/>
  <rect width="600" height="400" fill="url(#itShowVig)" pointer-events="none"/>`;
const reskin = (k, artFn, s, dy) => { const base = VIEWS[k]; if(!base) return;
  VIEWS[k] = function(){ const v = base.apply(this, arguments); return Object.assign({}, v, {svg: show(artFn(), s, dy)}); }; };
reskin('bell',     ART.bell);
reskin('snuffer',  ART.snuffer, 3.3);
reskin('lamp',     ()=>ART.lantern(true, false));
reskin('vial',     ()=>ART.vial(false));
reskin('potion',   ()=>ART.vial(true));
reskin('poppy',    ART.poppy);
reskin('valerian', ART.valerian);
reskin('crank',    ART.crank);
reskin('gears',    ART.gears, 3.1);
reskin('elamp',    ()=>ART.lantern(typeof S4!=='undefined' && !!S4.lampLit, true));
reskin('deer',     ART.deer, 3.1);
reskin('wheat',    ART.wheat);
reskin('skey',     ART.skey);
reskin('hmirror',  ART.hmirror, 3.1);
reskin('ring',     ART.ring);
reskin('key',      ART.key);
// 铜齿轮：正面精绘 + 背面纹章
if(VIEWS.cgear){ const base = VIEWS.cgear;
  VIEWS.cgear = ()=>{ const v = base(); return Object.assign({}, v, { svg: `<rect width="600" height="400" fill="url(#itShowBg)"/>
    <path d="M0,318 Q300,300 600,318 V400 H0 Z" fill="url(#itShowTop)" opacity=".55"/>
    <g transform="translate(${f1(190-49*2.9)},${f1(200-58*2.9)}) scale(2.9)">${ART.cgear()}</g>
    <g transform="translate(440,196)"><ellipse cx="4" cy="112" rx="86" ry="10" fill="url(#itShadow)"/>
      <circle r="100" fill="url(#itCopper)" stroke="#2b251e" stroke-width="3"/><circle r="84" fill="#9a5a2c" stroke="#5a2e10" stroke-width="1.6"/>
      <circle r="78" fill="none" stroke="#c88a54" stroke-width="1" opacity=".6" stroke-dasharray="3 4"/>
      <use href="#sym-raven" x="-38" y="-60" width="76" height="76" style="color:#4a240c"/>
      <text y="44" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="15" fill="#3a1a06">Turris · III</text>
      <path d="M-70,-40 A80,80 0 0 1 -30,-74" stroke="#f0c090" stroke-width="2.4" fill="none" opacity=".45"/></g>
    <rect width="600" height="400" filter="url(#itShowNoise)" opacity=".5" pointer-events="none"/>
    <rect width="600" height="400" fill="url(#itShowVig)" pointer-events="none"/>` }); };
}
// 圣杯（拿在手里时）
if(VIEWS.chalice){ const base = VIEWS.chalice;
  VIEWS.chalice = function(){ const v = base.apply(this, arguments);
    if(typeof S!=='undefined' && S.chalice==='table') return Object.assign({}, v, {svg: `<rect width="600" height="400" fill="url(#itShowBg)"/>
      <rect y="296" width="600" height="104" fill="#6a5643"/><path d="M0,296 H600" stroke="#2b251e" stroke-width="2"/>
      <path d="M0,312 H600 M0,344 H600" stroke="#4e3e30" stroke-width="1.2" opacity=".7"/>
      <g id="z-chal" class="zhot"><rect x="210" y="40" width="180" height="270" fill="transparent"/>
        <g transform="translate(${f1(300-49*3.2)},${f1(300-92*3.2)}) scale(3.2)">${ART.chalice(false)}</g></g>
      <rect width="600" height="400" filter="url(#itShowNoise)" opacity=".5" pointer-events="none"/>
      <rect width="600" height="400" fill="url(#itShowVig)" pointer-events="none"/>`});
    return Object.assign({}, v, {svg: show(ART.chalice(S.filled), 3.2)}); };
}
})();
