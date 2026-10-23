/* =====================================================================
   人物美术库 · 一：脸 / 发型 / 头饰（依据 参考图/角色 C01–C08 定稿）
   统一坐标：头部中心 (0,0)，额顶 y≈-13.4，下巴 y≈+12.8；颈根 y≈18；半身到 y≈60（双手）；长裙到 y≈172
   调用方用 translate + scale 摆放。规范见策划案 10.3：墨线 #2b251e · 灰白偏绿肤色 · 小黑点眼 + 深眼窝 · 不笑
   ===================================================================== */
const CH = {};
const CHC = {ink:'#2b251e', skin:'#cfc8b4', shade:'#a89f8a', sock:'#8b8270', lip:'#8e776a'};
const chL = (w=.7)=>`stroke="${CHC.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="chSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d8d2bf"/><stop offset=".55" stop-color="#cbc4af"/><stop offset="1" stop-color="#a9a08b"/></linearGradient>
  <linearGradient id="chCloth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
  <linearGradient id="chDown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  <filter id="chSil" x="-10%" y="-10%" width="120%" height="120%"><feFlood flood-color="#2b251e"/><feComposite in2="SourceAlpha" operator="in"/></filter>
  <filter id="chGhost" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values=".25 .3 .25 0 .5  .25 .3 .25 0 .5  .25 .3 .25 0 .48  0 0 0 .62 0"/><feGaussianBlur stdDeviation=".35"/></filter>
  <filter id="chRelief" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values=".42 .36 .16 0 .2  .36 .32 .14 0 .16  .26 .24 .12 0 .1  0 0 0 .92 0"/></filter>
</defs></svg>`);

/* ---------------- 脸 ---------------- */
// o: {age:'child'|'adult'|'old', male, gaze:[dx,dy], mood:'sad'|'neutral'|'stern'|'blank', eyes:'open'|'closed'|'down', mouth:'line'|'sing'|'open', stubble, hollow}
CH.face = (o={})=>`<g stroke="none">${CH._face(o)}</g>`;
CH._face = (o={})=>{
  const c = o.age==='child', old = o.age==='old', m = o.male;
  const [gx,gy] = o.gaze || [0,0];
  const out = c ? 'M-9.8,-2 C-10,-10.6 -5.8,-12.8 0,-12.8 C5.8,-12.8 10,-10.6 9.8,-2 C9.6,5.2 7.2,9.4 4,11 C2,11.9 -2,11.9 -4,11 C-7.2,9.4 -9.6,5.2 -9.8,-2 Z'
    : m ? 'M-9.6,-3 C-9.8,-11 -5.8,-13.4 0,-13.4 C5.8,-13.4 9.8,-11 9.6,-3 C9.6,4 8.4,8.6 5.2,11.4 C3,13.1 -3,13.1 -5.2,11.4 C-8.4,8.6 -9.6,4 -9.6,-3 Z'
        : 'M-9.2,-3 C-9.4,-11 -5.6,-13.4 0,-13.4 C5.6,-13.4 9.4,-11 9.2,-3 C9,4 6.8,8.8 3.6,11.6 C2,12.9 -2,12.9 -3.6,11.6 C-6.8,8.8 -9,4 -9.2,-3 Z';
  const shade = c ? 'M3.6,-12.4 C8,-11.4 10,-8.4 9.8,-2 C9.6,5.2 7.2,9.4 4,11 C2.6,11.6 1,11.8 0,11.7 C4.6,8.6 6.8,3.4 6.6,-3 C6.4,-8 5.4,-10.6 3.6,-12.4 Z'
    : 'M3.6,-13 C8,-12 9.6,-9 9.3,-3 C9.1,4 7,8.8 3.8,11.6 C2.4,12.7 1,12.9 0,12.9 C4.4,9.6 6.6,3.6 6.4,-3.6 C6.2,-8.6 5.2,-11.4 3.6,-13 Z';
  const ey = c ? -0.2 : -1.3, ex = c ? 4.1 : 3.7, er = c ? 1.35 : .95, srx = c ? 3.1 : 2.7, sry = c ? 2.6 : 2.05;
  const mood = o.mood || 'sad';
  const brow = s=>{ const x0=s*(ex+2.8), x1=s*(ex-2.2), y=ey-.7;
    if(mood==='stern') return `M${x0},${y-4.6} Q${s*ex},${y-4.9} ${x1},${y-3.7}`;
    if(mood==='neutral') return `M${x0},${y-3.8} Q${s*ex},${y-4.9} ${x1},${y-4.3}`;
    if(mood==='blank') return `M${x0},${y-4.2} Q${s*ex},${y-4.8} ${x1},${y-4.5}`;
    return `M${x0},${y-3.7} Q${s*(ex+.6)},${y-4.7} ${x1},${y-4.7}`; };
  const eye = s=>{ const x=s*ex;
    const sock = `<ellipse cx="${x}" cy="${ey}" rx="${srx}" ry="${sry}" fill="${CHC.sock}" opacity="${c?.62:.72}"/>
      <path d="M${x-srx+.4},${ey+sry*.65} Q${x},${ey+sry*1.35} ${x+srx-.4},${ey+sry*.65}" fill="none" stroke="#6e6656" stroke-width=".45" opacity=".8"/>`;
    if(o.eyes==='closed') return sock + `<path d="M${x-srx+.6},${ey-.2} Q${x},${ey+1.5} ${x+srx-.6},${ey-.2}" fill="none" ${chL(.65)}/>
      <path d="M${x-1.2},${ey+.9} l-.4,.9 M${x},${ey+1.1} v1 M${x+1.2},${ey+.9} l.4,.9" ${chL(.35)}/>`;
    const dy = o.eyes==='down' ? .7 : gy;
    return sock + `<ellipse cx="${x}" cy="${ey+.15}" rx="${srx-1.3}" ry="${sry-1.05}" fill="#d6cfbd"/>
      <circle cx="${(x+gx).toFixed(2)}" cy="${(ey+.2+dy).toFixed(2)}" r="${er}" fill="${o.iris||'#15110d'}"/>
      ${o.iris ? `<circle cx="${(x+gx).toFixed(2)}" cy="${(ey+.2+dy).toFixed(2)}" r="${er*.45}" fill="#15110d"/>` : ''}
      ${c ? `<circle cx="${(x+gx-er*.35).toFixed(2)}" cy="${(ey-.15+dy).toFixed(2)}" r="${er*.24}" fill="#e8e2d2" opacity=".7"/>` : ''}
      ${o.eyes==='down' ? `<path d="M${x-srx+.6},${ey-.5} Q${x},${ey-.1} ${x+srx-.6},${ey-.5} L${x+srx-.6},${ey-1.8} Q${x},${ey-2.4} ${x-srx+.6},${ey-1.8} Z" fill="${CHC.skin}"/>` : ''}
      <path d="M${x-srx+.7},${ey-(o.eyes==='down'?.5:sry*.42)} Q${x},${ey-(o.eyes==='down'?0:sry*.92)} ${x+srx-.7},${ey-(o.eyes==='down'?.5:sry*.42)}" fill="none" ${chL(.65)}/>`; };
  const mouth = o.mouth==='sing' ? `<ellipse cx="0" cy="${c?6.8:7.6}" rx="1.4" ry="1.1" fill="#4a3a32"/>`
    : o.mouth==='open' ? `<path d="M-2.2,${c?6.8:7.4} Q0,${c?6.2:6.8} 2.2,${c?6.8:7.4} Q0,${c?8.8:9.6} -2.2,${c?6.8:7.4} Z" fill="#3a2c26"/>`
    : `<path d="M${c?-2:-2.6},${c?6.9:7.8} Q0,${c?6.3:7.1} ${c?2:2.6},${c?6.9:7.8}" fill="none" stroke="#5e4c42" stroke-width=".6"/>
       <path d="M-1.4,${c?7.8:8.8} Q0,${c?8.4:9.5} 1.4,${c?7.8:8.8}" fill="none" stroke="${CHC.lip}" stroke-width=".45" opacity=".7"/>`;
  return `<path d="${out}" fill="url(#chSkin)"/>
    <path d="${shade}" fill="${CHC.shade}" opacity=".5"/>
    ${o.hollow || old ? `<path d="M-7.6,1.6 Q-6.4,5.6 -4.6,8 M7.6,1.6 Q6.4,5.6 4.6,8" fill="none" stroke="${CHC.shade}" stroke-width=".9" opacity=".9"/>` : ''}
    ${old ? `<path d="M-4.6,-8.2 Q0,-9 4.6,-8.2 M-3.6,-9.8 Q0,-10.4 3.6,-9.8 M-3.4,3.6 Q-4.6,6.4 -3.2,8.8 M3.4,3.6 Q4.6,6.4 3.2,8.8" fill="none" stroke="#8f8672" stroke-width=".4"/>` : ''}
    ${o.stubble ? `<path d="M-7.6,4 Q-6.4,10 -2.6,12.4 Q0,13 2.6,12.4 Q6.4,10 7.6,4 Q4,9 0,9.6 Q-4,9 -7.6,4 Z" fill="#6a5e4e" opacity=".35"/>` : ''}
    ${eye(-1)}${eye(1)}
    <path d="${brow(-1)} ${brow(1)}" fill="none" stroke-linecap="round" stroke-width="${c?.55:.7}" stroke="${m||old?'#3e3226':'#5a4838'}" opacity=".9"/>
    <path d="M.4,${c?-.6:-2.2} C.9,${c?2:1.2} ${c?1.4:1.9},${c?3.2:3.4} ${c?.7:.9},${c?4:4.4} C.1,${c?4.5:5} -.8,${c?4.4:4.9} -1.4,${c?4:4.4}" fill="none" stroke="#6e6252" stroke-width=".55"/>
    <ellipse cx="-.5" cy="${c?4.2:4.7}" rx=".9" ry=".45" fill="${CHC.shade}"/>
    ${mouth}
    <path d="${out}" fill="none" ${chL(.75)}/>`;
};
CH.neck = (w=3.6, c=false)=>`<path d="M${-w},8 L${-w-.2},19 L${w+.2},19 L${w},8 Z" fill="${CHC.skin}" ${chL(.6)}/>
  <path d="M${-w},${c?10:11} Q0,${c?14:15} ${w},${c?10:11} L${w+.1},${c?13:14} Q0,${c?16.4:17.4} ${-w-.1},${c?13:14} Z" fill="${CHC.shade}" opacity=".7"/>`;
CH.ears = ()=>`<path d="M-9.4,-3 Q-12,-3.4 -11.8,.6 Q-11.6,4 -9,4.2 Z M9.4,-3 Q12,-3.4 11.8,.6 Q11.6,4 9,4.2 Z" fill="${CHC.skin}" ${chL(.55)}/>
  <path d="M-10.4,-.6 q-.6,1.6 .4,2.6 M10.4,-.6 q.6,1.6 -.4,2.6" fill="none" stroke="${CHC.shade}" stroke-width=".5"/>`;

/* ---------------- 发型 / 头饰：返回 {back, front} ---------------- */
const strands = (d, col, n=4)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width=".45" opacity=".8"/>`;
CH.hair = {
  // 伊莎贝拉：中分深棕发，从头饰下露出，垂到肩后
  isabel:()=>({ back:`<path d="M-11,-4 C-12.4,10 -12.6,24 -10,34 L10,34 C12.6,24 12.4,10 11,-4 Z" fill="#4a3524"/>`,
    front:`<path d="M0,-12.6 C-5.6,-12.8 -9.8,-9.4 -10,-2 C-10.2,4 -9.6,9 -10.6,14 L-8.2,14 C-8.6,8 -8.6,1 -7.4,-4.4 C-6,-9 -3.2,-10.8 0,-11.2 C3.2,-10.8 6,-9 7.4,-4.4 C8.6,1 8.6,8 8.2,14 L10.6,14 C9.6,9 10.2,4 10,-2 C9.8,-9.4 5.6,-12.8 0,-12.6 Z" fill="#5a4230" ${chL(.55)}/>
      ${strands('M-2,-11 C-5,-9.6 -7.4,-6 -8.2,0 M2,-11 C5,-9.6 7.4,-6 8.2,0 M0,-12.4 V-11', '#3a2a1c')}` }),
  // 英式山墙头巾（伊莎贝拉）：暗红罩布 + 金边珍珠 + 两侧垂片；身后白纱
  gable:(o={})=>({ back:`<path d="M-13.6,-9 C-16,6 -19,26 -20,48 Q0,54 20,48 C19,26 16,6 13.6,-9 Z" fill="#ddd6c4" ${chL(.5)}/>
      <path d="M-10,0 C-12,18 -13,32 -13.6,48 M10,0 C12,18 13,32 13.6,48 M-4,4 V50 M4,4 V50" fill="none" stroke="#b9b09a" stroke-width=".5"/>`,
    front:`<path d="M-13.2,12 L-13.2,-5.6 L0,-21.4 L13.2,-5.6 L13.2,12 L10.6,11 L10.6,-4.8 L0,-17.6 L-10.6,-4.8 L-10.6,11 Z" fill="${o.col||'#5e2622'}" ${chL(.65)}/>
      <path d="M-11.8,11 L-11.8,-5.2 L0,-19.4 L11.8,-5.2 L11.8,11" fill="none" stroke="#c9a24a" stroke-width="1.5"/>
      ${[...Array(11)].map((_,i)=>{ const t=i/10, x = t<.5 ? -11.8+t*2*11.8 : (t-.5)*2*11.8, y = t<.5 ? -5.2-(t*2)*14.2 : -19.4+((t-.5)*2)*14.2;
        return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r=".7" fill="#efe6cc"/>`; }).join('')}
      <circle cx="-11.8" cy="2" r=".7" fill="#efe6cc"/><circle cx="-11.8" cy="7" r=".7" fill="#efe6cc"/><circle cx="11.8" cy="2" r=".7" fill="#efe6cc"/><circle cx="11.8" cy="7" r=".7" fill="#efe6cc"/>
      <path d="M-13.2,12 L-14.6,26 L-10.2,25 L-10.6,11 Z M13.2,12 L14.6,26 L10.2,25 L10.6,11 Z" fill="${o.col||'#5e2622'}" ${chL(.55)}/>
      <path d="M-12.4,13 L-13.4,24.6 M12.4,13 L13.4,24.6" stroke="#c9a24a" stroke-width=".8"/>` }),
  // 女童编发：中分、头顶一圈麻花辫、两侧盘发；玛格丽戴珍珠发带，艾格尼丝系深蓝丝带
  braid:(o={})=>{ const col = o.col || '#b8966a', dk = o.dk || '#8a6a44';
    let braid=''; for(let i=0;i<11;i++){ const a = Math.PI*(1.06 + i*.088), x = 11.6*Math.cos(a), y = -3 + 11.6*Math.sin(a);
      braid += `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="2.2" ry="1.4" transform="rotate(${(a*180/Math.PI+90).toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})" fill="${col}" stroke="${dk}" stroke-width=".45"/>`; }
    const pearls = o.pearls ? [...Array(9)].map((_,i)=>{ const a=Math.PI*(1.12+i*.095); return `<circle cx="${(10.2*Math.cos(a)).toFixed(2)}" cy="${(-2.4+10.2*Math.sin(a)).toFixed(2)}" r=".62" fill="#f0e8d4" stroke="#8a7a60" stroke-width=".2"/>`; }).join('') : '';
    return { back:`<ellipse cx="-9.6" cy="3" rx="3.6" ry="4.4" fill="${col}" ${chL(.5)}/><ellipse cx="9.6" cy="3" rx="3.6" ry="4.4" fill="${col}" ${chL(.5)}/>
        <path d="M-9.6,0 q-2,2 0,5 M9.6,0 q2,2 0,5" fill="none" stroke="${dk}" stroke-width=".45"/>
        ${o.ribbon ? `<path d="M-10.6,6 L-12.4,22 L-10.6,21 L-9.6,6 Z M10.6,6 L12.4,22 L10.6,21 L9.6,6 Z" fill="${o.ribbon}" ${chL(.4)}/>` : ''}`,
      front:`<path d="M-10.2,1 C-10.8,-9.6 -6,-13.4 0,-13.4 C6,-13.4 10.8,-9.6 10.2,1 L8.2,-.4 C7.4,-7 4.4,-10 0,-10.2 C-4.4,-10 -7.4,-7 -8.2,-.4 Z" fill="${col}" ${chL(.55)}/>
        ${strands('M0,-13.2 V-10.2 M-1.6,-10.2 C-4.4,-9.4 -6.8,-6.4 -7.6,-1.4 M1.6,-10.2 C4.4,-9.4 6.8,-6.4 7.6,-1.4', dk)}
        ${braid}${pearls}` }; },
  // 中年埃德蒙：微卷深棕发，盖过耳朵到下颌
  edmund:()=>({ back:`<path d="M-11.4,-4 C-12.6,4 -12.4,10 -10.6,13 L10.6,13 C12.4,10 12.6,4 11.4,-4 Z" fill="#3e2c1e"/>`,
    front:`<path d="M-10.6,6 C-11.8,-4 -10.6,-13 -2,-15 C4,-16.4 10.6,-13 11,-5 C11.4,0 11,4 10.6,8 C9.6,5 9.4,1 8.6,-3 C7.4,-7 5,-8.8 2,-9.4 C0,-7.4 -3,-6.4 -5.6,-6.8 C-7.4,-5 -8.4,-2 -8.6,1.4 C-9,4 -9.6,6 -10.6,6 Z" fill="#4a3524" ${chL(.55)}/>
      ${strands('M-6,-12 C-8,-8 -9,-3 -9.4,3 M3,-13.4 C6,-11 8,-7 9,-2 M-1,-14 C-3,-10 -4.6,-8 -5.6,-6.8', '#2e2016')}` }),
  // 少年埃德蒙：短碗型棕发
  boy:()=>({ back:'', front:`<path d="M-10,-1 C-10.6,-10 -6,-14 0,-14 C6,-14 10.6,-10 10,-1 C9,-4 8.2,-6 7,-7 Q3,-5.6 0,-7.2 Q-3.4,-5.4 -7,-7 C-8.2,-6 -9,-4 -10,-1 Z" fill="#5a4030" ${chL(.55)}/>
      ${strands('M-5,-12.6 Q-6,-9.6 -7,-7 M0,-13.6 V-7.2 M5,-12.6 Q6,-9.6 7,-7', '#3a2a1c')}` }),
  // 白发老领主（奥斯瓦尔德 / 阿尔德里克）：o.crown 金冠；o.beard 'short'|'long'
  old:(o={})=>{ const w = o.col || '#d2cdc2', dk = '#9a958a';
    const beard = o.beard==='long'
      ? `<path d="M-8.8,2 C-9.6,10 -7,20 0,30 C7,20 9.6,10 8.8,2 C7,7 5,9.6 2.4,10.6 Q0,9.6 -2.4,10.6 C-5,9.6 -7,7 -8.8,2 Z" fill="${w}" ${chL(.55)}/>
         ${strands('M-5,8 Q-4,18 -1,26 M5,8 Q4,18 1,26 M0,11 V28', dk)}`
      : o.beard==='short' ? `<path d="M-9,1 C-9.4,8 -6,13.6 0,15 C6,13.6 9.4,8 9,1 C7,6 4.6,8.6 2.4,9.4 Q0,8.6 -2.4,9.4 C-4.6,8.6 -7,6 -9,1 Z" fill="${w}" ${chL(.5)}/>` : '';
    const mous = o.beard ? `<path d="M-.2,6 Q-2.6,5.4 -4.4,7 Q-5.6,8.6 -5.8,11 Q-4.6,9.6 -3.4,9.2 Q-1.6,8.6 0,8.6 Q1.6,8.6 3.4,9.2 Q4.6,9.6 5.8,11 Q5.6,8.6 4.4,7 Q2.6,5.4 .2,6 Z" fill="${w}" ${chL(.45)}/>
      <path d="M-1,6.6 Q-3,7.4 -4.6,9.6 M1,6.6 Q3,7.4 4.6,9.6" fill="none" stroke="${dk}" stroke-width=".4"/>` : '';
    const crown = o.crown ? `<path d="M-10.6,-9.6 L-10.6,-15.6 L-7.4,-12.6 L-3.6,-17.4 L0,-13.2 L3.6,-17.4 L7.4,-12.6 L10.6,-15.6 L10.6,-9.6 Q0,-11.6 -10.6,-9.6 Z" fill="#b8902e" ${chL(.55)}/>
      <circle cx="-3.6" cy="-17.4" r=".9" fill="#e0c060"/><circle cx="3.6" cy="-17.4" r=".9" fill="#e0c060"/><circle cx="0" cy="-11.4" r=".9" fill="#9a2e26"/>` : '';
    return { back:`<path d="M-11,-4 C-12.4,4 -12.2,10 -10,14 L10,14 C12.2,10 12.4,4 11,-4 Z" fill="${w}"/>`,
      front:`<path d="M-10.4,6 C-11.4,-5 -9.6,-13.6 0,-14.4 C9.6,-13.6 11.4,-5 10.4,6 C9.6,2 9.2,-2 8.4,-5 C6.4,-9.4 3,-10.8 0,-10.8 C-3,-10.8 -6.4,-9.4 -8.4,-5 C-9.2,-2 -9.6,2 -10.4,6 Z" fill="${w}" ${chL(.55)}/>
        ${strands('M-6,-12.4 C-8.6,-8 -9.6,-3 -9.8,3 M6,-12.4 C8.6,-8 9.6,-3 9.8,3 M-2,-14 C-5,-12 -7,-9 -8,-6 M2,-14 C5,-12 7,-9 8,-6', dk)}
        ${beard}${mous}${crown}` }; },
  // 普通男子短发（1316 / 1349 / 1382 的父亲们）
  man:(o={})=>({ back:'', front:`<path d="M-10,0 C-10.8,-10 -6,-14.2 0,-14.2 C6,-14.2 10.8,-10 10,0 C9.4,-3.4 8.6,-6 7.4,-8 Q0,-9.6 -7.4,-8 C-8.6,-6 -9.4,-3.4 -10,0 Z" fill="${o.col||'#2e2620'}" ${chL(.55)}/>
      ${o.beard ? `<path d="M-8.8,3 C-9,9 -5.6,13.4 0,14.4 C5.6,13.4 9,9 8.8,3 C6.6,7.4 4.4,9.4 2,10 Q0,9 -2,10 C-4.4,9.4 -6.6,7.4 -8.8,3 Z" fill="${o.col||'#2e2620'}" opacity=".92" ${chL(.45)}/>` : ''}
      ${o.hat ? `<path d="M-12.6,-8.4 Q0,-12 12.6,-8.4 L10.4,-11.4 Q8,-19.6 0,-20 Q-8,-19.6 -10.4,-11.4 Z" fill="${o.hat}" ${chL(.55)}/>` : ''}` }),
  // 普通女子头巾：'wimple' 下颌带（1316）· 'veil' 白头巾（1349）· 'roll' 发髻卷（1382）
  woman:(o={})=>{ const t=o.type||'veil';
    if(t==='wimple') return { back:`<path d="M-12.4,-8 C-14,6 -15,20 -16,32 L16,32 C15,20 14,6 12.4,-8 Z" fill="#d6cebb" ${chL(.5)}/>`,
      front:`<path d="M-11.4,-2 C-12,-11.6 -6.4,-15.6 0,-15.6 C6.4,-15.6 12,-11.6 11.4,-2 L11,9 Q8,15 0,16.4 Q-8,15 -11,9 Z M-8.6,-3 C-8.6,4 -6,9.6 0,10.8 C6,9.6 8.6,4 8.6,-3 C8.4,-9 4.4,-11.4 0,-11.4 C-4.4,-11.4 -8.4,-9 -8.6,-3 Z" fill="#e2dac6" fill-rule="evenodd" ${chL(.55)}/>
        <path d="M-11.6,-6 Q0,-9.6 11.6,-6" fill="none" stroke="#b9b09a" stroke-width=".5"/>` };
    if(t==='roll') return { back:'', front:`<path d="M-10,0 C-10.6,-9.6 -6,-13 0,-13 C6,-13 10.6,-9.6 10,0 L8.2,-2 C7.4,-7 4.4,-9.6 0,-9.8 C-4.4,-9.6 -7.4,-7 -8.2,-2 Z" fill="#3e2e22" ${chL(.5)}/>
        <path d="M-14,-6 Q-14.6,-16 0,-17.6 Q14.6,-16 14,-6 Q12,-10.4 0,-12 Q-12,-10.4 -14,-6 Z" fill="${o.col||'#3f4a3e'}" ${chL(.55)}/>
        <path d="M-12,-10 Q0,-15.6 12,-10" fill="none" stroke="#b39a5a" stroke-width=".7" stroke-dasharray="1 1.2"/>` };
    return { back:`<path d="M-12.8,-6 C-14.6,8 -15.6,22 -17,34 L17,34 C15.6,22 14.6,8 12.8,-6 Z" fill="#ddd5c2" ${chL(.5)}/>`,
      front:`<path d="M-12.4,8 C-13.4,-6 -9,-15.4 0,-15.6 C9,-15.4 13.4,-6 12.4,8 L10.2,7 C10.4,-3 7.6,-11 0,-11.6 C-7.6,-11 -10.4,-3 -10.2,7 Z" fill="#e4dcc8" ${chL(.55)}/>
        <path d="M-7.6,-11 C-6,-12.4 -3,-13 0,-13 C3,-13 6,-12.4 7.6,-11" fill="none" stroke="#b9b09a" stroke-width=".5"/>` }; },
  // 玛莎：米白三角头巾（盖住头顶，结打在脑后），鬓角露出灰白头发
  martha:()=>({ back:`<path d="M6,-10 Q14,-6 16,2 L20,10 L13,8 L17,15 L10,9 Q9,0 6,-10 Z" fill="#d8ceb2" ${chL(.5)}/>`,
    front:`<path d="M-9.6,-1 Q-10.6,-4 -9.4,-7 M9.6,-1 Q10.6,-4 9.4,-7" fill="none" stroke="#a49e92" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-9.6,2 Q-10.2,-1 -9.6,-4 M9.6,2 Q10.2,-1 9.6,-4" fill="none" stroke="#7e786c" stroke-width=".4"/>
      <path d="M-11.4,-4.6 C-12.6,-12.4 -7,-17 0,-17 C7,-17 12.6,-12.4 11.4,-4.6 Q6,-8.4 0,-8.6 Q-6,-8.4 -11.4,-4.6 Z" fill="#d8ceb2" ${chL(.55)}/>
      <path d="M-11.4,-4.6 Q-6,-8.4 0,-8.6 Q6,-8.4 11.4,-4.6" fill="none" stroke="#b9ae92" stroke-width="1.4"/>
      <path d="M-7,-14 Q-2,-10 1,-15.6 M3,-15.8 Q6,-12 9,-11 M-9.6,-9 Q-5,-11 -3,-14" fill="none" stroke="#b0a588" stroke-width=".5"/>
      <circle cx="-4" cy="-13" r=".5" fill="#a89c80"/><circle cx="5" cy="-11" r=".5" fill="#a89c80"/>` })
};
