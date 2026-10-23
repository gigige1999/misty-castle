/* =====================================================================
   人物美术库 · 二：服装 / 成品角色
   CH.person(o) 组装一个站立人物（头部中心为原点）：
     o.hair   CH.hair 里的 key（或 {back,front}）
     o.face   CH.face 参数
     o.body   'gown'|'girl'|'doublet'|'robe'|'cloak'|'boy'|'peasant'
     o.cloth / o.trim / o.sleeve  服装主色 / 镶边 / 袖色
     o.hold   'clasp'|'deer'|'wheat'|'bell'|'mirror'|'lamp'|null
     o.len    下摆长度（y），默认 172；画像里截到半身时可调小
   ===================================================================== */
const chHand = (x,y,s=1)=>`<ellipse cx="${x}" cy="${y}" rx="${3.2*s}" ry="${2.6*s}" fill="${CHC.skin}" ${chL(.55)}/>
  <path d="M${x-1.6*s},${y+.4*s} v${1.8*s} M${x},${y+.8*s} v${1.8*s} M${x+1.6*s},${y+.4*s} v${1.6*s}" stroke="${CHC.shade}" stroke-width=".4"/>`;
const chFold = (pts, col='#000', op=.22, w=.7)=>`<path d="${pts}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${w}"/>`;
// 交握的双手（一只手覆在另一只上，露出四根手指）
const chClasp = (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-5.6,-1.4 Q-6.4,2.4 -3.4,4.2 Q0,5.4 3.4,4.2 Q6.4,2.4 5.6,-1.4 Q3.6,-3.4 0,-2.2 Q-3.6,-3.4 -5.6,-1.4 Z" fill="${CHC.skin}" ${chL(.55)}/>
  <path d="M-4.6,-.6 Q-1,1.6 4.8,-.2" fill="none" ${chL(.45)}/>
  <path d="M-3,.6 Q-2.6,2.6 -1.4,3.6 M-.6,1.2 Q-.2,3 .8,3.9 M1.8,1 Q2.2,2.6 3,3.4" fill="none" stroke="${CHC.shade}" stroke-width=".45"/>
  <path d="M-5.6,-1.4 Q-3.6,-.4 -2.4,-2.6" fill="none" ${chL(.45)}/></g>`;

/* ---------------- 手持物 ---------------- */
CH.held = {
  deer:(x,y)=>`<g transform="translate(${x},${y})"><use href="#deer" x="-11" y="-17" width="22" height="22" style="color:#9a7a4e"/>
    <path d="M-8,4 H8" stroke="#6a5034" stroke-width="1.6"/><circle cx="-6" cy="5.4" r="1.4" fill="#4a3a2a"/><circle cx="6" cy="5.4" r="1.4" fill="#4a3a2a"/></g>`,
  wheat:(x,y)=>`<g transform="translate(${x},${y}) rotate(-12)"><path d="M0,14 V-18" stroke="#b8902e" stroke-width=".9"/>
    ${[0,1,2,3,4].map(i=>`<ellipse cx="${i%2?1.6:-1.6}" cy="${-16+i*3.4}" rx="1.2" ry="2.4" transform="rotate(${i%2?28:-28} ${i%2?1.6:-1.6} ${-16+i*3.4})" fill="#e0b84a" ${chL(.3)}/>`).join('')}</g>`,
  bell:(x,y)=>`<g transform="translate(${x},${y})"><path d="M0,-12 V-5" stroke="#6a5a40" stroke-width="1.2"/><path d="M-5,4 Q-5,-5 0,-6 Q5,-5 5,4 Z" fill="#c8c8bc" ${chL(.5)}/><circle cy="5.6" r="1.2" fill="#6a6a60"/></g>`,
  mirror:(x,y)=>`<g transform="translate(${x},${y}) rotate(18)"><path d="M0,3 V13" stroke="#8a7448" stroke-width="2"/><ellipse cy="-3" rx="4.6" ry="5.6" fill="#a88a4e" ${chL(.5)}/><ellipse cy="-3" rx="3.4" ry="4.3" fill="#c4d0d4"/></g>`,
  lamp:(x,y)=>`<g transform="translate(${x},${y})"><path d="M0,-10 V-6" stroke="#2b251e" stroke-width=".7"/><rect x="-3.6" y="-6" width="7.2" height="9" fill="#e4c070" ${chL(.5)}/>
    <text y="1.6" text-anchor="middle" font-family="Georgia,serif" font-size="5" font-weight="bold" fill="#5a3a18">E</text><path d="M-4.4,3 H4.4" stroke="#2b251e" stroke-width="1.2"/></g>`
};

/* ---------------- 身体 / 服装 ---------------- */
CH.body = {
  // 贵妇长裙：方领 + 金镶边、腰链、垂地长裙、橄榄绿喇叭袖（伊莎贝拉）
  gown:(o)=>{ const L=o.len||172, c=o.cloth||'#6b3a30', tr=o.trim||'#b8963e', sl=o.sleeve||'#47503c';
    return { under:`<path d="M-20,46 Q-26,74 -32,${L-24} Q-36,${L-6} -40,${L} L40,${L} Q36,${L-6} 32,${L-24} Q26,74 20,46 Z" fill="${c}" ${chL(.7)}/>
        <path d="M-20,46 Q-26,74 -32,${L-24} Q-36,${L-6} -40,${L} L40,${L} Q36,${L-6} 32,${L-24} Q26,74 20,46 Z" fill="url(#chCloth)"/>
        ${chFold(`M-10,58 Q-16,${L*.6} -20,${L-2} M0,60 V${L-1} M10,58 Q16,${L*.6} 22,${L-2} M-22,90 Q-28,${L*.75} -30,${L-2}`)}
        <path d="M-40,${L} Q0,${L+4} 40,${L} L38,${L-6} Q0,${L-2} -38,${L-6} Z" fill="${tr}" opacity=".85"/>`,
      torso:`<path d="M-12.6,19 Q-18,22 -19,30 L-20,48 Q0,52 20,48 L19,30 Q18,22 12.6,19 Z" fill="${c}" ${chL(.7)}/>
        <path d="M-12.6,19 Q-18,22 -19,30 L-20,48 Q0,52 20,48 L19,30 Q18,22 12.6,19 Z" fill="url(#chCloth)"/>
        <path d="M-8.6,19.4 L-9.4,29 L9.4,29 L8.6,19.4" fill="${CHC.skin}" ${chL(.55)}/>
        <path d="M-9.4,29 L9.4,29" stroke="${tr}" stroke-width="1.8"/><path d="M-8.6,19.4 L-9.4,29 M8.6,19.4 L9.4,29" stroke="${tr}" stroke-width="1.4"/>
        <path d="M-6,20.6 Q0,27 6,20.6" fill="none" stroke="#c9a24a" stroke-width=".55"/><circle cx="0" cy="26.2" r="1.3" fill="#9a2e26" ${chL(.35)}/>
        <path d="M-19.6,46 Q0,51 19.6,46" fill="none" stroke="${tr}" stroke-width="2"/>
        <path d="M0,50 V${Math.min(L-10,120)}" stroke="${tr}" stroke-width=".9" stroke-dasharray="2 1.4"/>
        <ellipse cx="0" cy="${Math.min(L-8,122)}" rx="1.6" ry="2.4" fill="${tr}" ${chL(.35)}/>`,
      arms: o.hold==='write' ? `<path d="M-19,26 Q-24,40 -25,54 Q-26,64 -30,74 L-18,76 Q-12,64 -9,56 Z" fill="${sl}" ${chL(.65)}/><path d="M-30,74 L-18,76" stroke="${tr}" stroke-width="1.6"/>
          <path d="M19,26 Q30,36 40,44 L44,52 Q32,48 18,42 Z" fill="${sl}" ${chL(.65)}/>`
        : o.hold==='point' ? `<path d="M-19,26 Q-24,40 -25,54 Q-26,64 -30,74 L-18,76 Q-12,64 -9,56 Z" fill="${sl}" ${chL(.65)}/><path d="M-30,74 L-18,76" stroke="${tr}" stroke-width="1.6"/>
          <path d="M19,26 Q28,44 36,62 Q40,72 42,82 L34,86 Q30,74 24,64 Q18,52 14,40 Z" fill="${sl}" ${chL(.65)}/><path d="M34,86 L42,82" stroke="${tr}" stroke-width="1.6"/>` :
        `<path d="M-19,26 Q-24,40 -25,54 Q-26,64 -30,74 L-18,76 Q-12,64 -9,56 Z" fill="${sl}" ${chL(.65)}/>
         <path d="M19,26 Q24,40 25,54 Q26,64 30,74 L18,76 Q12,64 9,56 Z" fill="${sl}" ${chL(.65)}/>
         <path d="M-30,74 L-18,76 M30,74 L18,76" stroke="${tr}" stroke-width="1.6"/>
         <path d="M-18.6,32 Q-14,46 -6,56 M18.6,32 Q14,46 6,56" fill="none" stroke="${c}" stroke-width="5"/>
         <path d="M-18.6,32 Q-14,46 -6,56 M18.6,32 Q14,46 6,56" fill="none" ${chL(.5)} stroke-opacity=".6"/>`,
      extra: o.hold==='point' ? `<path d="M36,85 Q40,90 43,93 L47,97 L44.6,92.6 Q44,88 41,85 Z" fill="${CHC.skin}" ${chL(.55)}/>`
        : o.hold==='write' ? `<path d="M42,49 L52,36" stroke="#e6dcc4" stroke-width=".8"/><path d="M52,36 q3,1 1,6 q-3,-1 -1,-6" fill="#e6dcc4"/>${chHand(43,50)}` : '',
      hands: o.hold==='write' ? [[-24,77]] : o.hold==='point' ? [[-24,77]] : [[-3,57],[3,58.4]] }; },
  // 女童礼服：方领珍珠边、高腰、前片纹样（玛格丽暗红 · 艾格尼丝灰蓝 + 蕾丝领）
  girl:(o)=>{ const L=o.len||96, c=o.cloth||'#6e3430', tr=o.trim||'#b8963e', lace=o.lace;
    return { under:`<path d="M-13,32 Q-17,52 -21,${L} L21,${L} Q17,52 13,32 Z" fill="${c}" ${chL(.65)}/>
        <path d="M-13,32 Q-17,52 -21,${L} L21,${L} Q17,52 13,32 Z" fill="url(#chCloth)"/>
        <path d="M-5,33 L-7,${L} L7,${L} L5,33 Z" fill="${o.panel||'#000'}" opacity="${o.panel?.9:.14}"/>
        ${o.fleur ? [0,1,2].map(i=>`<path d="M0,${44+i*16} l-1.6,-2.6 l1.6,-2.4 l1.6,2.4 Z M-2.6,${45.4+i*16} q2.6,1.4 5.2,0" fill="${tr}" stroke="${tr}" stroke-width=".35"/>`).join('') : ''}
        ${chFold(`M-9,40 Q-12,60 -15,${L-1} M9,40 Q12,60 15,${L-1}`)}
        ${lace ? `<path d="M-21,${L} Q0,${L+2} 21,${L} L20.4,${L-5} Q0,${L-3} -20.4,${L-5} Z" fill="${lace}"/>
          <path d="M-20.4,${L-5} Q0,${L-3} 20.4,${L-5}" fill="none" stroke="#8a8270" stroke-width=".4" stroke-dasharray=".8 .8"/>` : ''}`,
      torso:`<path d="M-8.6,18 Q-12.6,20 -13,26 L-13,33 Q0,35 13,33 L13,26 Q12.6,20 8.6,18 Z" fill="${c}" ${chL(.65)}/>
        ${lace ? `<path d="M-9,18 Q-12,22 -9,26 Q-4,28 0,24 Q4,28 9,26 Q12,22 9,18 Q0,21 -9,18 Z" fill="${lace}" ${chL(.45)}/>
            <path d="M-1.6,22.6 L0,24.4 L1.6,22.6 M0,24.4 L-2,30 M0,24.4 L2,30" fill="none" stroke="#2e3644" stroke-width=".8"/>`
          : `<path d="M-6,18.6 L-6.4,24.6 L6.4,24.6 L6,18.6" fill="${CHC.skin}" ${chL(.5)}/>
             <path d="M-6.4,24.6 H6.4 M-6,18.6 L-6.4,24.6 M6,18.6 L6.4,24.6" stroke="${tr}" stroke-width="1.1"/>
             ${[-4.8,-2.4,0,2.4,4.8].map(x=>`<circle cx="${x}" cy="24.6" r=".5" fill="#efe6cc"/>`).join('')}`}
        <path d="M-13,32.6 Q0,35 13,32.6" fill="none" stroke="${tr}" stroke-width="1.2"/>`,
      arms:`<path d="M-12.6,22 Q-16,34 -15,44 L-9,46 Q-8,36 -6.6,30 Z" fill="${o.sleeve||c}" ${chL(.6)}/>
        <path d="M12.6,22 Q16,34 15,44 L9,46 Q8,36 6.6,30 Z" fill="${o.sleeve||c}" ${chL(.6)}/>
        ${lace ? `<path d="M-15,44 L-9,46 L-9.6,48.6 L-15.6,46.6 Z M15,44 L9,46 L9.6,48.6 L15.6,46.6 Z" fill="${lace}"/>` : ''}`,
      hands:[[-4.6,42.6,.8],[4.6,43.4,.8]] }; },
  // 男子短上衣（父亲们 / 中年埃德蒙内衬）
  doublet:(o)=>{ const L=o.len||150, c=o.cloth||'#3a3028', tr=o.trim||'#6a5a40';
    return { under:`<path d="M-15,52 L-16,${L} L16,${L} L15,52 Z" fill="${o.hose||'#2e2a24'}" ${chL(.65)}/>
        <path d="M0,60 V${L}" stroke="#1a1612" stroke-width=".8"/>`,
      torso:`<path d="M-11,19 Q-19,21 -20,30 L-20,60 Q0,64 20,60 L20,30 Q19,21 11,19 Z" fill="${c}" ${chL(.7)}/>
        <path d="M-11,19 Q-19,21 -20,30 L-20,60 Q0,64 20,60 L20,30 Q19,21 11,19 Z" fill="url(#chCloth)"/>
        <path d="M-4.6,19 L0,25 L4.6,19" fill="#ddd6c4" ${chL(.5)}/><path d="M0,25 V60" stroke="${tr}" stroke-width="1"/>
        ${[30,37,44,51].map(y=>`<circle cx="0" cy="${y}" r=".8" fill="${tr}"/>`).join('')}
        <path d="M-20,52 Q0,56 20,52" stroke="#1e1a16" stroke-width="2.4" fill="none"/><rect x="-2.4" y="51.4" width="4.8" height="3.6" fill="#a88a4e" ${chL(.4)}/>`,
      arms:`<path d="M-19,24 Q-23,40 -22,56 L-15,57 Q-13,44 -11,34 Z M19,24 Q23,40 22,56 L15,57 Q13,44 11,34 Z" fill="${c}" ${chL(.65)}/>
        <path d="M-19,24 Q-23,40 -22,56 L-15,57 Q-13,44 -11,34 Z M19,24 Q23,40 22,56 L15,57 Q13,44 11,34 Z" fill="url(#chDown)"/>`,
      hands: o.hold==='clasp' ? [[-3,58],[3,59]] : [[-18.6,59],[18.6,59]] }; },
  // 领主斗篷：黑色毛领长斗篷 + 内衬暗红长袍 + 金链（中年埃德蒙 / 奥斯瓦尔德 / 阿尔德里克）
  cloak:(o)=>{ const L=o.len||172, c=o.cloth||'#5a2622', cl=o.cape||'#26221e', fur=o.fur||'#1e1a17';
    let tufts=''; for(let i=0;i<22;i++){ const x=-26+i*2.5, y=26.6+Math.abs(i-10.5)*.38+(i%3)*.7, h=2.4+(i*7%5)*.6, lean=((i*13)%5-2)*.5;
      tufts+=`<path d="M${(x-1.3).toFixed(1)},${(y-1).toFixed(1)} Q${(x+lean).toFixed(1)},${(y+h*.6).toFixed(1)} ${(x+lean*1.4).toFixed(1)},${(y+h).toFixed(1)} Q${(x+.6).toFixed(1)},${(y+h*.4).toFixed(1)} ${(x+1.4).toFixed(1)},${(y-1).toFixed(1)} Z" fill="${fur}"/>`; }
    let hairs=''; for(let i=0;i<16;i++){ const x=-23+i*3; hairs+=`M${x},${21+Math.abs(i-7.5)*.5} q${(i%2?1:-1)*.8},2 ${(i%3)-1},4 `; }
    return { under:`<path d="M-11,40 L-13,${L} L13,${L} L11,40 Z" fill="${c}" ${chL(.6)}/>
        <path d="M-6,46 V${L} M6,46 V${L}" stroke="#b8963e" stroke-width=".7" opacity=".7"/>
        <path d="M-28,24 Q-34,70 -38,${L} L-12,${L} Q-14,80 -12,34 Z M28,24 Q34,70 38,${L} L12,${L} Q14,80 12,34 Z" fill="${cl}" ${chL(.7)}/>
        <path d="M-28,24 Q-34,70 -38,${L} L-12,${L} Q-14,80 -12,34 Z M28,24 Q34,70 38,${L} L12,${L} Q14,80 12,34 Z" fill="url(#chCloth)"/>
        ${chFold(`M-22,40 Q-26,100 -28,${L-2} M22,40 Q26,100 28,${L-2} M-16,60 Q-18,120 -18,${L-2}`, '#fff', .07, .9)}
        <path d="M-38,${L} H-12 M12,${L} H38" stroke="#8a6a34" stroke-width="1.2"/>`,
      torso:`<path d="M-10,19 Q-14,24 -12,40 L12,40 Q14,24 10,19 Z" fill="${c}" ${chL(.6)}/>
        <path d="M-3.6,19 L0,24 L3.6,19" fill="#d8d0bc" ${chL(.45)}/>
        <path d="M-27,24 Q-20,18 -11,17 Q0,22 11,17 Q20,18 27,24 Q25,29 18,29.4 Q8,26.4 0,28 Q-8,26.4 -18,29.4 Q-25,29 -27,24 Z" fill="${fur}" ${chL(.5)}/>${tufts}
        <path d="${hairs}" fill="none" stroke="#3e3830" stroke-width=".45" opacity=".8"/>
        <path d="M-12,28 Q0,40 12,28" fill="none" stroke="#c9a24a" stroke-width="1.1" stroke-dasharray="1.4 .8"/>
        <circle cx="0" cy="36" r="2.4" fill="#c9a24a" ${chL(.4)}/><circle cx="0" cy="36" r="1" fill="#7a2a1e"/>
        ${o.ruff ? `<path d="M-10,17 ${[...Array(10)].map((_,i)=>`Q${-9+i*2},${i%2?22.6:20.6} ${-8+i*2},17.6`).join(' ')} Q9,20 10,17 Q11,13.6 7,13.4 L-7,13.4 Q-11,13.6 -10,17 Z" fill="#e8e2d2" ${chL(.5)}/>
          <path d="M-8,18 v2.6 M-4,18.6 v2.8 M0,18.8 v3 M4,18.6 v2.8 M8,18 v2.6" stroke="#b9b09a" stroke-width=".45"/>` : ''}`,
      arms: o.hold==='cane' ? `<path d="M17,58 L22,${L-2}" stroke="#2a221c" stroke-width="2.2"/><circle cx="17" cy="57" r="2.6" fill="#8a6a34" ${chL(.4)}/>` : '',
      hands: o.hold==='cane' ? [[17,59,.9]] : o.hold==='chest' ? [[-4,34,.95]] : [[-3,56],[3,57]] }; },
  // 少年短斗篷上衣 + 灰紧身裤（12 岁埃德蒙）
  boy:(o)=>{ const L=o.len||110, c=o.cloth||'#4e3a2a';
    return { under:`<path d="M-9,52 L-9.6,${L-6} L-3,${L-6} L-1,60 L1,60 L3,${L-6} L9.6,${L-6} L9,52 Z" fill="#6a6a62" ${chL(.6)}/>
        <path d="M-10.6,${L-6} h8 v5 h-9 Z M2.6,${L-6} h8 v5 h-9 Z" fill="#2a221c" ${chL(.5)}/>`,
      torso:`<path d="M-9,19 Q-14,22 -14,30 L-13,54 Q0,57 13,54 L14,30 Q14,22 9,19 Z" fill="${c}" ${chL(.65)}/>
        <path d="M-3.6,19 L0,23 L3.6,19" fill="#ddd6c4" ${chL(.45)}/>
        <path d="M-17,22 Q-12,18 0,19.4 Q12,18 17,22 L19,36 Q10,40 0,38 Q-10,40 -19,36 Z" fill="${o.cape||'#5a4430'}" ${chL(.6)}/>
        <path d="M-17,22 Q-12,18 0,19.4 Q12,18 17,22 L19,36 Q10,40 0,38 Q-10,40 -19,36 Z" fill="url(#chCloth)"/>
        <path d="M-13,50 Q0,53 13,50" stroke="#2a221c" stroke-width="1.8" fill="none"/>`,
      arms:`<path d="M-15,34 Q-16,44 -15,52 L-10,52 Q-10,44 -10,37 Z M15,34 Q16,44 15,52 L10,52 Q10,44 10,37 Z" fill="${c}" ${chL(.6)}/>`,
      hands: o.hold==='lamp' ? [[-12.6,54,.85],[12.6,46,.85]] : [[-12.6,54,.85],[12.6,54,.85]] }; },
  // 粗布衣 + 围裙（玛莎）
  peasant:(o)=>{ const L=o.len||150, c=o.cloth||'#4a3a2e';
    return { under:`<path d="M-16,44 Q-20,90 -24,${L} L24,${L} Q20,90 16,44 Z" fill="${c}" ${chL(.65)}/>
        <path d="M-13,44 Q-15,90 -17,${L-6} L17,${L-6} Q15,90 13,44 Z" fill="#cfc4a6" ${chL(.55)}/>
        ${chFold(`M-6,52 Q-8,90 -9,${L-8} M6,52 Q8,90 9,${L-8}`, '#6a5e48', .35)}`,
      torso:`<path d="M-11,19 Q-18,22 -19,32 L-17,46 Q0,49 17,46 L19,32 Q18,22 11,19 Z" fill="${c}" ${chL(.65)}/>
        <path d="M-9,26 L-9,46 L9,46 L9,26 Q0,28 -9,26 Z" fill="#cfc4a6" ${chL(.5)}/>
        <path d="M-9,26 L-11,19 M9,26 L11,19" stroke="#cfc4a6" stroke-width="2"/>
        <path d="M-17,44 Q0,48 17,44" stroke="#b8ad90" stroke-width="2" fill="none"/>`,
      arms:`<path d="M-18,26 Q-22,40 -18,52 L-12,52 Q-13,40 -11,32 Z M18,26 Q22,40 18,52 L12,52 Q13,40 11,32 Z" fill="${c}" ${chL(.6)}/>
        <path d="M-18,46 L-12,46 M18,46 L12,46" stroke="#33281f" stroke-width="1.4"/>`,
      hands:[[-3,52],[3,53]] }; }
};

/* ---------------- 组装 ---------------- */
CH.person = (o={})=>{
  const hr = typeof o.hair==='string' ? CH.hair[o.hair](o.hairOpt||{}) : (o.hair || {back:'',front:''});
  const hd = o.headwear ? CH.hair[o.headwear](o.headOpt||{}) : {back:'',front:''};
  const b = CH.body[o.body||'gown'](o);
  const child = o.body==='girl' || o.body==='boy';
  const heldAt = { deer:[0,40], wheat:[2,40], bell:[0,42], mirror:[3,38], lamp:[15,50] };
  const H = o.hold && CH.held[o.hold] ? CH.held[o.hold](...(o.heldPos || heldAt[o.hold] || [0,40])) : '';
  return `<g class="ch" stroke="none">
    ${hd.back}${hr.back}
    ${b.under}
    ${CH.neck(child?3:3.6, child)}
    ${b.torso}${b.arms}
    ${o.hold && o.hold!=='lamp' && o.hold!=='clasp' ? H : ''}
    ${(()=>{ const h=b.hands||[];
      if(h.length===2 && Math.abs(h[0][0]-h[1][0])<10 && Math.abs(h[0][1]-h[1][1])<3)
        return chClasp((h[0][0]+h[1][0])/2, (h[0][1]+h[1][1])/2, h[0][2]||1);
      return h.map(([x,y,s])=>chHand(x,y,s||1)).join(''); })()}${b.extra||''}
    ${o.hold==='lamp' ? H : ''}
    ${o.noEars ? '' : (o.headwear || o.hair==='isabel' || o.hair==='braid' || o.hair==='martha' ? '' : CH.ears())}
    ${CH.face(o.face||{})}
    ${hr.front}${hd.front}
  </g>`;
};
// 预设：故事里的每个人
CH.preset = {
  isabel:(x={})=>({hair:'isabel', headwear:'gable', body:'gown', face:{mood:'sad', eyes:'down', ...x.face}, ...x}),
  margery:(x={})=>({hair:'braid', hairOpt:{pearls:true, ribbon:'#d8cfb8'}, body:'girl', cloth:'#6e3430', panel:'#5a2622', fleur:true, face:{age:'child', mood:'blank', ...x.face}, ...x}),
  agnes:(x={})=>({hair:'braid', hairOpt:{col:'#c4a87a', dk:'#8a6e48', ribbon:'#2e3644'}, body:'girl', cloth:'#5a6470', sleeve:'#5a6470', lace:'#ddd3b8', face:{age:'child', mood:'sad', ...x.face}, ...x}),
  edmund:(x={})=>({hair:'edmund', body:'cloak', cloth:'#5a2622', face:{male:true, mood:'sad', eyes:'down', stubble:true, ...x.face}, ...x}),
  edmundBoy:(x={})=>({hair:'boy', body:'boy', face:{age:'child', male:true, mood:'sad', ...x.face}, ...x}),
  oswald:(x={})=>({hair:'old', hairOpt:{beard:'short', crown:true}, body:'cloak', cloth:'#4a1e1a', face:{age:'old', male:true, mood:'stern', ...x.face}, ...x}),
  aldric:(x={})=>({hair:'old', hairOpt:{beard:'long'}, body:'cloak', cloth:'#2a2420', face:{age:'old', male:true, mood:'stern', ...x.face}, ...x}),
  martha:(x={})=>({hair:'martha', body:'peasant', face:{age:'old', mood:'neutral', ...x.face}, ...x})
};
CH.draw = (who, x={})=>CH.person(CH.preset[who](x));
// 记忆页剪影：把人物整体压成墨色单色（策划案 10.3：剪影 = 纯 #2b251e）；mirror 为 true 时左右翻转
CH.sil = (who, x, y, k, opt={}, mirror=false)=>`<g filter="url(#chSil)"><g transform="translate(${x},${y}) scale(${mirror?-k:k},${k})">${
  typeof who==='string' ? CH.draw(who, opt) : CH.person(who)}</g></g>`;
