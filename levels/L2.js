/* =====================================================================
   第 2 关 · 礼拜堂（The Chapel）—— 状态 / 谜题 / 特写（策划案第 4 章）
   新机制：光色滤读（彩窗光只照亮同色字迹）+ 音名拼词（F-A-D-E-D）
   ===================================================================== */
const S2 = {
  shutters:{sun:false, moon:false, deer:false, raven:false},
  fadedSeen:false, noteRead:false,
  air:0, paperOut:false, played:[],
  cabOpen:false, took:{bell:false, snuffer:false}, regView:false, pageTorn:false,
  plugOut:false, tagTaken:false,
  rung:false, confessRead:false, doorOpen:false,
  ropePulls:0, ravenFlew:false, swing:false
};
const NOTES = 'ABCDEFG', NOTE_F = [220, 247, 262, 294, 330, 349, 392];
const openColored = () => C_WINS.filter(w=>w.light && S2.shutters[w.k]);
function boardLight(){ const o=openColored(); return o.length===0 ? 'none' : o.length>1 ? 'mixed' : o[0].k; }
let _seed = 7; const rnd = ()=>((_seed = (_seed*16807) % 2147483647) / 2147483647);

LEVELS.L2.ready = true;
document.head.insertAdjacentHTML('beforeend', `<style>
  .c2fly{animation:c2fly 2.2s ease-in forwards}
  @keyframes c2fly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(420px,-200px) scale(.5);opacity:0}}
  .c2feather{animation:c2fall 2.4s ease-in-out forwards}
  @keyframes c2fall{0%{transform:translate(0,-330px) rotate(-30deg)}40%{transform:translate(18px,-180px) rotate(20deg)}70%{transform:translate(-10px,-60px) rotate(-12deg)}100%{transform:translate(0,0) rotate(6deg)}}
  .c2swing{transform-box:view-box;transform-origin:163px 0;animation:c2swing .45s ease-in-out 2 alternate}
  @keyframes c2swing{from{transform:rotate(0)}to{transform:rotate(-1.5deg)}}
</style>`);

/* ---------------- 音效 ---------------- */
const organ = f=>{ tone(f,.9,'square',.018); tone(f*2,.9,'sine',.022); tone(f/2,.9,'triangle',.03); };
const organWeak = f=>{ tone(f,.45,'square',.014,f*.8); tone(f/2,.45,'triangle',.02,f*.4); };
const organSour = f=>{ tone(f*1.06,1.6,'sawtooth',.028,f*.86); tone(f*.97,1.6,'square',.016,f*.8); };
const handBell = ()=>{ [1320,1760,2210].forEach((f,i)=>setTimeout(()=>tone(f,1.1,'sine',.045),i*70)); setTimeout(()=>[1320,1760].forEach(f=>tone(f,.9,'sine',.03)),260); };
const bigBell = ()=>{ tone(110,3,'sine',.14); tone(220,2.4,'sine',.06); tone(277,2.2,'sine',.035); noise(.12,500,.05); };
const whoosh = ()=>noise(.5,320,.08,.6);

/* ---------------- 场景动态层（全部由 S2 派生） ---------------- */
SCENES.L2 = function(){
  let s='';
  C_WINS.forEach(w=>{
    const cx=w.cx;
    if(S2.shutters[w.k]){
      s+=`<path d="M${cx-30},342 L${cx-44},334 L${cx-44},198 L${cx-30},190 Z" fill="#3e3025" ${ck}/>
          <path d="M${cx+30},342 L${cx+44},334 L${cx+44},198 L${cx+30},190 Z" fill="#3e3025" ${ck}/>`;
      if(w.light) s+=`<path d="${winGlass(cx)}" fill="${w.light}" opacity=".22"/>`;
    }else{
      let slats=''; for(let y=168;y<332;y+=12) slats+=`<path d="M${cx-20},${y} H${cx+20}" stroke="#1e1712" stroke-width="2"/>`
        + (w.light?`<path d="M${cx-18},${y+5} H${cx+18}" stroke="${w.light}" stroke-width="1" opacity=".4"/>`:'');
      s+=`<path d="M${cx-22},336 L${cx-22},194 Q${cx-20},160 ${cx},146 L${cx},336 Z" fill="#3e3025" ${ck}/>
          <path d="M${cx+22},336 L${cx+22},194 Q${cx+20},160 ${cx},146 L${cx},336 Z" fill="#3e3025" ${ck}/>
          ${slats}<rect x="${cx-3}" y="246" width="6" height="12" fill="#15110d"/>`;
    }
  });
  if(S2.cabOpen){
    s+=`<rect x="178" y="402" width="108" height="112" fill="#120e0b" ${ck}/>
      <path d="M178,444 H286 M178,482 H286" stroke="#3a2e23" stroke-width="4"/>
      <path d="M178,402 L158,396 L158,520 L178,514 Z M286,402 L306,396 L306,520 L286,514 Z" fill="#44362a" ${ck}/>
      <path d="M190,442 L238,442 L242,432 L194,432 Z" fill="#5a2a24" stroke="#15110d" stroke-width="1.2"/>
      ${S2.took.bell?'':`<path d="M218,480 Q218,464 226,462 Q234,464 234,480 Z" fill="#b39c6e" stroke="#15110d" stroke-width="1.2"/><rect x="224.5" y="454" width="3" height="8" fill="#5a4632"/>`}
      ${S2.took.snuffer?'':`<path d="M262,512 L276,452" stroke="#a48c56" stroke-width="2.4"/><path d="M272,454 l9,-4 l2,9 Z" fill="#a48c56"/>`}`;
  }
  if(S2.plugOut) s+=`<ellipse cx="238" cy="530" rx="10" ry="2.6" fill="#0a0907"/>${S2.tagTaken?'':'<rect x="252" y="526" width="9" height="6" fill="#77777a" stroke="#15110d" stroke-width="1"/>'}`;
  if(!S2.paperOut) s+=`<rect x="622" y="389" width="5" height="9" fill="#e4dcc4" stroke="#15110d" stroke-width=".8"/>`;
  if(S2.rung) s+=`<polygon points="${lw(66,372)} ${lw(86,372)} ${lw(86,440)} ${lw(66,440)}" fill="#050403"/>`;
  if(S2.doorOpen) s+=`<path d="${C2_DOOR_I}" fill="#0b0908" ${ck}/><ellipse cx="718" cy="420" rx="18" ry="80" fill="#c8a868" opacity=".12"/>
      <path d="M742,566 L742,292 Q741,272 736,258 L752,250 L752,574 Z" fill="#3e3125" ${ck}/>`;
  // 钟绳
  s+=`<g class="${S2.swing?'c2swing':''}"><path d="M163,-10 Q165,240 163,470" stroke="#8a7656" stroke-width="4.5" fill="none"/><path d="M163,-10 Q165,240 163,470" stroke="#3a3024" stroke-width="1.2" fill="none" stroke-dasharray="3 5"/>
      <path d="M160,466 h7 l-1,16 h-5 Z" fill="#7a6a4e" ${ck}/></g>`;
  S2.swing=false;
  // 暗度：每打开一扇彩窗，礼拜堂亮一些
  const n = openColored().length;
  s+=`<rect width="828" height="709" fill="#05060a" opacity="${(.46 - n*.09).toFixed(2)}"/>`;
  openColored().forEach(w=>{
    const dx=(414-w.cx)*.55;
    s+=`<polygon points="${w.cx-21},214 ${w.cx+21},214 ${w.cx+dx+64},620 ${w.cx+dx-64},620" fill="url(#c2beam-${w.k})"/>
        <ellipse cx="${w.cx+dx}" cy="606" rx="80" ry="16" fill="url(#c2pool-${w.k})"/>`;
  });
  const bl = boardLight();
  if(bl!=='none') s+=`<rect x="370" y="178" width="88" height="80" fill="${bl==='mixed'?'#a08a62':cWin(bl).light}" opacity="${bl==='mixed'?.18:.4}"/>`;
  if(S2.ravenFlew==='now'){ s+=`<use href="#sym-raven" x="150" y="100" width="36" height="36" style="color:#0c0a08" class="c2fly"/>`; S2.ravenFlew=true; }
  s+=`<rect width="828" height="709" fill="url(#c2-vig)"/>`;
  // 鸦羽（叠在暗角之上，便于看见）
  if(S2.ropePulls>=3 && !G.feathers.L2) s+=`<g class="${S2.featherNew?'c2feather':''}">
      <path d="M150,560 Q160,540 182,530" stroke="#0e0c0a" stroke-width="2.6" fill="none"/>
      <path d="M154,554 l-6,-4 M158,548 l-6,-5 M164,542 l-5,-5 M170,537 l-4,-5 M157,551 l6,-1 M162,545 l6,-2 M168,540 l6,-2 M174,535 l5,-1" stroke="#1d1915" stroke-width="2"/>
      <circle cx="166" cy="545" r="20" fill="none" stroke="#efe6c8" stroke-width="1.2" class="pulse"/></g>`;
  S2.featherNew=false;
  document.getElementById('l2Dyn').innerHTML = s;
  document.getElementById('l2Feather').style.display = (S2.ropePulls>=3 && !G.feathers.L2) ? '' : 'none';
};
document.getElementById('l2Hot').insertAdjacentHTML('beforeend', `<rect id="l2Feather" class="hs" data-obj="c_feather" x="140" y="520" width="52" height="50" style="display:none"/>`);

/* ---------------- 场景点击 ---------------- */
const C2_FLAVOR = {
  c_chand:'吊灯上的蜡烛早就燃尽了，只剩一圈蜡泪。',
  c_pews:'长椅上积着薄灰。最前排有一块地方特别干净，像是有人常常坐在那里。'
};
document.getElementById('l2Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L2') return;
  const o = g.dataset.obj; sfx.tap();
  if(C2_FLAVOR[o]) return say(C2_FLAVOR[o]);
  if(o==='c_feather') return pickFeather('L2');
  if(o==='c_rope') return pullRope();
  openZoom(o);
});
function pullRope(){
  S2.ropePulls++; S2.swing=true; bigBell();
  if(S2.ropePulls===3 && !G.feathers.L2){
    S2.ravenFlew='now'; S2.featherNew=true; setTimeout(sfx.caw, 500);
    updateAll(); return say('第三声钟响，钟楼里的乌鸦被惊飞了——一根黑色的羽毛，晃晃悠悠地飘落下来。', 5500);
  }
  updateAll();
  say(S2.ropePulls<3 ? `你拉动钟绳。头顶的钟楼里传来一声沉闷的钟响。${S2.ropePulls===2?'上面好像有什么东西扑腾了一下。':''}` : '钟声在礼拜堂里久久回荡。');
}

/* ---------------- 特写 ---------------- */
const wallBg = `<rect width="600" height="400" fill="#4a4b45"/><path d="M0,70H600M0,140H600M0,210H600M0,280H600M0,350H600M70,0V70M330,0V70M520,0V70M180,70V140M450,70V140M60,140V210M300,140V210M560,140V210M150,210V280M420,210V280M90,280V350M380,280V350M240,350V400M500,350V400" stroke="#3b3c36" stroke-width="2"/>`;

C_WINS.forEach(w=>{
  VIEWS['c_win_'+w.k] = function(){
    const open = S2.shutters[w.k];
    let panes=''; for(let r=0;r<10;r++) for(let c=0;c<4;c++){ if((r+c)%2) continue;
      panes+=`<rect x="${226+c*37}" y="${40+r*35}" width="37" height="35" fill="${w.pane}" opacity="${(.5+((r*5+c*3)%4)*.12).toFixed(2)}"/>`; }
    let lat=''; for(let i=-8;i<12;i++) lat+=`<path d="M${150+i*30},20 l220,220 M${450-i*30},20 l-220,220"/>`;
    const motif = w.k==='sun' ? `<circle cx="300" cy="200" r="30" fill="#f3d27a" ${cInk}/><path d="M300,150v-18M300,250v18M250,200h-18M350,200h18M265,165l-12,-12M335,235l12,12M335,165l12,-12M265,235l-12,12" stroke="#f3d27a" stroke-width="7"/>`
      : w.k==='moon' ? `<use href="#sym-moon" x="250" y="150" width="100" height="100" style="color:#d6e4f2"/>`
      : w.k==='deer' ? `<use href="#deer" x="235" y="140" width="130" height="130" style="color:#e2b9a2"/>`
      : `<use href="#sym-raven" x="245" y="145" width="110" height="110" style="color:#38383f"/>`;
    let slats=''; for(let y=70;y<384;y+=22) slats+=`<path d="M230,${y} H370" stroke="#1e1712" stroke-width="4"/>`
      + (w.light?`<path d="M236,${y+10} H364" stroke="${w.light}" stroke-width="2" opacity=".5"/>`:'');
    const hue = {sun:'金黄', moon:'冷蓝', deer:'暗红'}[w.k];
    const cap = !open ? `${w.cn}之窗。木百叶关得严严的，${w.light?'缝里漏进一线微光。':'缝里一点光都没有。'}（点击百叶打开）`
      : w.k==='raven' ? '百叶开了，可鸦之窗的玻璃是黑的，一丝光都透不进来。（点击关上百叶）'
      : `${w.cn}之窗。${hue}的光透过彩窗，斜斜地照在祭坛上方的圣诗板上。（点击关上百叶）`;
    return { title:`Window of the ${w.en}`, cap,
      svg:`<defs><clipPath id="zc2w"><path d="M226,384 L226,128 Q232,64 300,40 Q368,64 374,128 L374,384 Z"/></clipPath></defs>
        ${wallBg}
        <path d="M200,392 L200,120 Q206,40 300,14 Q394,40 400,120 L400,392 Z" fill="#66665c" ${cInk}/>
        <path d="M226,384 L226,128 Q232,64 300,40 Q368,64 374,128 L374,384 Z" fill="${w.glass}" ${cInk}/>
        <g clip-path="url(#zc2w)">${panes}${motif}<g stroke="#14110e" stroke-width="3" fill="none">${lat}</g>
          ${open && w.light?`<rect width="600" height="400" fill="${w.light}" opacity=".22"/>`:''}</g>
        <path d="M300,40 V384 M226,210 H374" stroke="#14110e" stroke-width="5" fill="none"/>
        <g id="z-shut" class="zhot">
          ${open ? `<path d="M200,388 L146,370 L146,134 L200,118 Z" fill="#3e3025" ${cInk}/><path d="M400,388 L454,370 L454,134 L400,118 Z" fill="#3e3025" ${cInk}/>
              <path d="M146,180 L200,170 M146,250 L200,248 M146,320 L200,326 M454,180 L400,170 M454,250 L400,248 M454,320 L400,326" stroke="#1e1712" stroke-width="3"/>`
            : `<path d="M226,384 L226,128 Q232,64 300,40 L300,384 Z" fill="#3e3025" ${cInk}/><path d="M374,384 L374,128 Q368,64 300,40 L300,384 Z" fill="#3e3025" ${cInk}/>
              ${slats}<rect x="290" y="200" width="20" height="40" fill="#15110d"/><rect x="306" y="214" width="28" height="12" fill="#15110d"/>`}
        </g>
        <rect x="186" y="384" width="228" height="16" fill="#77776b" ${cInk}/>`,
      bind(){ on('z-shut', ()=>{ S2.shutters[w.k]=!S2.shutters[w.k]; S2.shutters[w.k]?sfx.open():sfx.clack(); act(); }); }
    };
  };
});

VIEWS.c_board = function(){
  const L = boardLight();
  if(L==='moon') S2.fadedSeen = true;
  _seed = 3; let scr='';
  const cols=['#e8c45a','#d0574a','#8fb4e6','#cfc8b4'];
  for(let i=0;i<46;i++){ const x=120+rnd()*330, y=74+rnd()*262, c=cols[i%4];
    scr+=`<path d="M${x.toFixed(0)},${y.toFixed(0)} q${(rnd()*30-15).toFixed(0)},${(rnd()*20-10).toFixed(0)} ${(20+rnd()*40).toFixed(0)},${(rnd()*16-8).toFixed(0)}" stroke="${c}" stroke-width="${(1.5+rnd()*2).toFixed(1)}" opacity="${L==='none'?.06:(.1+rnd()*.12).toFixed(2)}"/>`; }
  const W = [
    {k:'sun',  t:'BEG',   x:200, y:148, r:-8, s:62, c:'#e8c45a'},
    {k:'deer', t:'DEAF',  x:380, y:300, r:5,  s:58, c:'#d0574a'},
    {k:'moon', t:'FADED', x:300, y:226, r:-2, s:74, c:'#8fb4e6'}
  ];
  const words = W.map(o=>{
    const lit = L===o.k, op = L==='none' ? .06 : L==='mixed' ? .3 : (lit ? 1 : .07);
    return `<text x="${o.x}" y="${o.y}" transform="rotate(${o.r} ${o.x} ${o.y})" text-anchor="middle" font-family="Georgia,serif" font-size="${o.s}" letter-spacing="6"
      fill="none" stroke="${o.c}" stroke-width="3.2" stroke-linecap="round" opacity="${op}" filter="url(#zchalk)">${o.t}</text>`;
  }).join('');
  const tint = L==='none' ? '<rect x="110" y="60" width="380" height="290" fill="#000" opacity=".55"/>'
    : L==='mixed' ? '<rect x="110" y="60" width="380" height="290" fill="#8a7650" opacity=".22"/>'
    : `<rect x="110" y="60" width="380" height="290" fill="${cWin(L).light}" opacity=".14"/>`;
  const cap = L==='none' ? (S2.shutters.raven ? '鸦之窗透不进光。圣诗板还是黑乎乎的，木板上层层叠叠全是粉笔划痕。' : '太暗了。木板上层层叠叠全是彩色粉笔的划痕，什么都看不清。')
    : L==='mixed' ? '几种颜色的光混在一起，字迹互相叠着，什么都读不出来。'
    : L==='sun' ? '金黄的光下，只有黄色的粉笔字清晰起来：BEG（乞求）。'
    : L==='deer' ? '暗红的光下，只有红色的粉笔字清晰起来：DEAF（失聪）。'
    : '冷蓝的月光下，只有蓝色的粉笔字清晰起来：FADED（褪去）。';
  return { title:'Hymn Board', cap,
    svg:`<defs><filter id="zchalk"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="5"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs>
      ${wallBg}
      <path d="M150,0 L130,40 M450,0 L470,40" stroke="#15110d" stroke-width="4" stroke-dasharray="8 4"/>
      <rect x="90" y="40" width="420" height="330" fill="#3a2e23" ${cInk}/>
      <rect x="110" y="60" width="380" height="290" fill="#262420" ${cInk}/>
      <rect x="250" y="44" width="100" height="14" fill="#2a2119"/>
      <text x="300" y="55" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#8a7a5c">HYMNI</text>
      <g fill="none" stroke-linecap="round">${scr}</g>
      ${words}${tint}`};
};

VIEWS.c_altar = function(){
  S2.noteRead = true;
  return { title:'Altar',
    cap:'祭坛上摊着神父的手记，最后一页写着：「唯有月光能读出她的名。」',
    svg:`${wallBg}
      <path d="M300,20 V230 M240,74 H360" stroke="#15110d" stroke-width="24" stroke-linecap="round"/>
      <path d="M300,20 V230 M240,74 H360" stroke="#8a7650" stroke-width="10"/>
      <polygon points="40,240 560,240 600,300 0,300" fill="#77756a" ${cInk}/>
      <rect x="0" y="300" width="600" height="100" fill="#605e55" ${cInk}/>
      <path d="M140,300 H460 V370 L440,386 L420,370 L400,386 L380,370 L360,386 L340,370 L320,386 L300,370 L280,386 L260,370 L240,386 L220,370 L200,386 L180,370 L160,386 L140,370 Z" fill="#cfc6ae" ${cInk}/>
      <g fill="#2a2622" ${cInk}><path d="M86,262 h60 l-10,-12 h-40 Z"/><rect x="110" y="140" width="12" height="110"/><path d="M96,140 h40 v-8 h-40 Z"/>
        <path d="M454,262 h60 l-10,-12 h-40 Z"/><rect x="478" y="140" width="12" height="110"/><path d="M464,140 h40 v-8 h-40 Z"/></g>
      <rect x="104" y="78" width="24" height="54" fill="#d7ccb0" ${cInk}/><rect x="472" y="92" width="24" height="40" fill="#d7ccb0" ${cInk}/>
      <path class="flame" d="M116,46 Q128,64 124,72 Q116,82 108,72 Q104,64 116,46 Z" fill="#efc463"/>
      <path class="flame" d="M484,60 Q496,78 492,86 Q484,96 476,86 Q472,78 484,60 Z" fill="#efc463"/>
      <g transform="rotate(-3 300 262)">
        <path d="M168,292 Q234,274 300,290 Q366,274 432,292 L420,236 Q366,220 300,236 Q234,220 180,236 Z" fill="#d8cfb4" ${cInk}/>
        <path d="M300,236 V290" stroke="#1a1511" stroke-width="1.5"/>
        <path d="M196,246 H284 M198,256 H280 M200,266 H276 M202,276 H262" stroke="#7a6f5c" stroke-width="1.5"/>
        <text x="362" y="256" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="12" fill="#3b3026">Only moonlight</text>
        <text x="362" y="272" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="12" fill="#3b3026">may read her name.</text>
      </g>`};
};

VIEWS.c_organ = function(){
  const tops=[40,30,24,20,24,30,40];
  const pipes = tops.map((t,i)=>{ const x=130+i*57;
    return `<g id="z-p${i}" class="zhot"><rect x="${x-17}" y="${t}" width="34" height="${196-t}" rx="4" fill="#8a8678" ${cInk}/>
      <path d="M${x-10},${t+6} V190" stroke="#b5b1a3" stroke-width="3"/>
      <path d="M${x-10},176 L${x},160 L${x+10},176 Z" fill="#15110d"/>
      ${i===4 && !S2.paperOut ? `<rect x="${x-5}" y="156" width="10" height="28" fill="#e4dcc4" ${cInk}/><path d="M${x-5},164 h10 M${x-5},172 h10" stroke="#9a8e74" stroke-width="1"/>
        <circle cx="${x}" cy="170" r="20" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>` : ''}</g>`; }).join('');
  const keys = [...NOTES].map((L,i)=>{ const x=160+i*40;
    return `<rect x="${x}" y="258" width="38" height="18" fill="#2a2119" ${cInk}/><text x="${x+19}" y="272" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#c9b48a">${L}</text>
      <g id="z-k${i}" class="zhot"><rect x="${x}" y="280" width="38" height="74" fill="#ddd3b8" ${cInk}/></g>`; }).join('');
  const segs = [0,1,2].map(i=>`<rect x="100" y="${310-i*24}" width="38" height="20" fill="${i<S2.air?'#c9a24a':'#2a2622'}" ${cInk}/>`).join('');
  return { title:'Organ',
    cap: S2.cabOpen ? '管风琴安静下来了。圣器柜已经打开。'
      : !S2.paperOut ? '一架小管风琴：七根音管，七个琴键 A 到 G。左边是气压表，右边是风箱拉杆。'
      : '七个琴键 A 到 G。拉一次风箱，够弹三个音。',
    svg:`${wallBg}
      <rect x="70" y="20" width="460" height="380" fill="#3a2e23" ${cInk}/>
      <rect x="84" y="196" width="432" height="16" fill="#2a2119" ${cInk}/>
      ${pipes}
      <rect x="200" y="220" width="200" height="32" fill="#17130f" ${cInk}/>
      <text x="300" y="243" text-anchor="middle" font-family="Georgia,serif" font-size="18" letter-spacing="4" fill="#c9b48a">${S2.played.slice(-6).join(' ')}</text>
      ${keys}
      <text x="119" y="252" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="2" fill="#8a7a5c">AER</text>
      ${segs}
      <g id="z-lever" class="zhot"><rect x="456" y="216" width="64" height="160" fill="transparent"/>
        <rect x="481" y="232" width="14" height="128" fill="#17130f" ${cInk}/>
        <path d="M488,344 L500,${S2.air?240:300}" stroke="#6a5a42" stroke-width="8" stroke-linecap="round"/>
        <circle cx="500" cy="${S2.air?236:296}" r="11" fill="#8a7650" ${cInk}/></g>
      <rect x="84" y="360" width="432" height="40" fill="#2a2119" ${cInk}/>`,
    bind(){
      on('z-lever', ()=>{ S2.air=3; whoosh(); render(); setCap('你拉动风箱拉杆，皮囊鼓了起来。气压表满了。'); });
      tops.forEach((_,i)=> on('z-p'+i, ()=>{
        if(i===4 && !S2.paperOut){ S2.paperOut=true; sfx.pick(); act('你从第五根音管（E）里抽出一卷纸：「我把褪去之名的歌，锁进了圣器柜。」'); return; }
        sfx.tap(); setCap(i===4 ? '音管里已经空了。' : '冰凉的锡管，里面空空的。');
      }));
      [...NOTES].forEach((L,i)=> on('z-k'+i, ()=>{
        if(S2.cabOpen){ organ(NOTE_F[i]); return; }
        if(i===4 && !S2.paperOut){ noise(.12,240,.08); return setCap('E 键按下去只有闷闷的「噗」一声——对应的音管里像是塞着什么。'); }
        if(S2.air<=0){ organWeak(NOTE_F[i]); S2.played=[]; render(); return setCap('风箱里没气了，声音一出来就断了。先拉风箱。'); }
        S2.air--; organ(NOTE_F[i]); S2.played.push(L); if(S2.played.length>8) S2.played.shift();
        const t = S2.played.join('');
        if(t.endsWith('FADED')){
          S2.cabOpen=true; setTimeout(()=>{ sfx.clack(); sfx.thud(); }, 700);
          act('最后一个音落下，礼拜堂另一头传来「咔」的一声——圣器柜的门弹开了。'); return;
        }
        render();
        if(t.endsWith('BEG')){ S2.played=[]; render(); return setCap('琴声低低的，像在乞求。圣器柜没有反应。'); }
        if(t.endsWith('DEAF')){ S2.played=[]; render(); return setCap('……一片沉默，像有人捂住了耳朵。圣器柜没有反应。'); }
        if(S2.played.length>=5){ setTimeout(()=>organSour(NOTE_F[i]), 350); S2.played=[]; setTimeout(render, 360); return setCap('管风琴发出一声走调的长音。圣器柜一动不动。'); }
        setCap(`${L}。` + (S2.air===0 ? '气压表见底了，再拉一次风箱。' : ''));
      }));
    }
  };
};

function registerList(x,y){
  const rows=[[1309,'A',1],[1342,'C',1],[1375,'H',1],[1403,'Edmund',0],[1408,'M',1]];
  return rows.map((r,i)=>{ const yy=y+i*34;
    return `<text x="${x}" y="${yy}" font-family="Georgia,serif" font-size="15" fill="#3b3026">${r[0]}</text>
      <text x="${x+52}" y="${yy}" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#3b3026">${r[1]}</text>
      ${r[2]?`<path d="M${x+66},${yy-5} q8,-8 16,0 t16,0 t16,0 t16,0 M${x+64},${yy-1} l70,-6 M${x+66},${yy-9} l66,8" stroke="#2b251e" stroke-width="2.6" fill="none"/>`:''}`; }).join('');
}

VIEWS.c_cabinet = function(){
  if(S2.regView){
    return { title:'Baptismal Register',
      cap: S2.pageTorn ? '受洗册。最后那一页已经被你撕下带走了。（点击左页合上）'
        : '受洗册。雷文霍尔德家每隔几十年，就有一个孩子的名字被刮掉：1309、1342、1375……还有 1408 年的「M——」。相隔都是 33 年。（点击右页撕下带走）',
      svg:`<rect width="600" height="400" fill="#17130f"/>
        <path d="M40,60 Q170,40 300,70 Q430,40 560,60 L560,350 Q430,328 300,358 Q170,328 40,350 Z" fill="#4a2a22" ${ink}/>
        <g id="z-close" class="zhot"><path d="M52,66 Q170,48 300,76 L300,346 Q170,320 52,338 Z" fill="#ddd3b8" ${ink}/>
          <text x="176" y="130" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="20" fill="#3b3026">Liber Baptizatorum</text>
          <text x="176" y="156" text-anchor="middle" font-family="Georgia,serif" font-size="13" letter-spacing="3" fill="#5a4e3e">RAVENHOLD</text>
          <use href="#sym-raven" x="146" y="186" width="60" height="60" style="color:#5a4e3e"/>
          <path d="M100,280 H252 M110,296 H242" stroke="#9a8e74" stroke-width="1.5"/></g>
        ${S2.pageTorn ? `<path d="M300,76 L312,74 L306,110 L316,150 L306,200 L318,250 L308,300 L314,346 L300,346 Z" fill="#d6ccb0" ${ink}/>`
          : `<g id="z-tear" class="zhot"><path d="M548,66 Q430,48 300,76 L300,346 Q430,320 548,338 Z" fill="#d6ccb0" ${ink}/>${registerList(340,128)}
              <path d="M548,66 Q430,48 300,76 L300,346 Q430,320 548,338 Z" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>`}`,
      bind(){
        on('z-close', ()=>{ S2.regView=false; sfx.tap(); act(); });
        on('z-tear', ()=>{ S2.pageTorn=true; give('page'); noise(.25,2400,.07,.8); act('你把这一页沿着装订线撕了下来，收进了物品栏。'); });
      }
    };
  }
  const open = S2.cabOpen;
  let pipes=''; [60,46,36,28,36,46,60].forEach((t,i)=>{ const x=192+i*36;
    pipes+=`<rect x="${x}" y="${40+t}" width="22" height="${92-t}" rx="3" fill="#7e7a6c" ${cInk}/><path d="M${x+5},120 l6,-8 l6,8 Z" fill="#15110d"/>`; });
  const left = [!S2.took.bell&&'一只圣铃', !S2.took.snuffer&&'一根灭烛钩'].filter(Boolean);
  return { title:'Vestry Cabinet',
    cap: !open ? '圣器柜。柜门上没有锁孔，门楣上只有一排小小的音管装饰——像是管风琴的缩小版。'
      : `圣器柜开着。里面有一本受洗册${left.length?'、'+left.join('、'):''}。`,
    svg:`${wallBg}
      <rect x="140" y="20" width="320" height="20" fill="#2a2119" ${cInk}/>
      <rect x="150" y="40" width="300" height="360" fill="#3a2e23" ${cInk}/>
      ${pipes}
      ${open ? `<rect x="166" y="140" width="268" height="252" fill="#120e0b" ${cInk}/>
          <path d="M166,140 L110,126 L110,400 L166,392 Z M434,140 L490,126 L490,400 L434,392 Z" fill="#44362a" ${cInk}/>
          <path d="M166,236 H434 M166,316 H434" stroke="#3a2e23" stroke-width="8"/>
          <g id="z-reg" class="zhot"><path d="M196,232 L318,232 L330,204 L208,204 Z" fill="#5a2a24" ${cInk}/><path d="M196,232 L318,232 L318,238 L196,238 Z" fill="#ddd3b8" ${cInk}/>
            <use href="#sym-raven" x="250" y="206" width="22" height="22" style="color:#b39c6e"/></g>
          ${S2.took.bell?'':`<g id="z-bell" class="zhot"><path d="M220,312 Q220,262 250,256 Q280,262 280,312 Z" fill="#b39c6e" ${cInk}/><rect x="244" y="234" width="12" height="24" fill="#5a4632" ${cInk}/><circle cx="250" cy="316" r="6" fill="#5a4632"/></g>`}
          ${S2.took.snuffer?'':`<g id="z-snuf" class="zhot"><rect x="330" y="150" width="90" height="240" fill="transparent"/><path d="M350,388 L392,176" stroke="#a48c56" stroke-width="7"/>
              <path d="M386,182 l22,-12 l6,26 Z" fill="#a48c56" ${cInk}/><path d="M392,176 q20,-18 6,-34" stroke="#a48c56" stroke-width="5" fill="none"/></g>`}`
        : `<g id="z-doors" class="zhot"><rect x="166" y="140" width="132" height="252" fill="#44362a" ${cInk}/><rect x="302" y="140" width="132" height="252" fill="#44362a" ${cInk}/>
            <rect x="182" y="160" width="100" height="212" fill="none" stroke="#2a2119" stroke-width="3"/><rect x="318" y="160" width="100" height="212" fill="none" stroke="#2a2119" stroke-width="3"/>
            <path d="M232,220 V300 M212,244 H252 M368,220 V300 M348,244 H388" stroke="#2a2119" stroke-width="8"/></g>`}`,
    bind(){
      on('z-doors', ()=>{ sfx.thud(); shake(); setCap('柜门没有锁孔，怎么也拉不开。门楣上那排小音管，和管风琴的音管一模一样。'); });
      on('z-reg', ()=>{ S2.regView=true; sfx.open(); act(); });
      on('z-bell', ()=>{ S2.took.bell=true; give('bell'); handBell(); act('你拿起了圣铃。铃舌一碰，清脆的声音在礼拜堂里荡开。'); });
      on('z-snuf', ()=>{ S2.took.snuffer=true; give('snuffer'); sfx.pick(); act('你取下了灭烛钩：一头是熄烛的铜罩，另一头弯成一个细钩。'); });
    }
  };
};

VIEWS.c_font = function(){
  return { title:'Baptismal Font',
    cap: S2.tagTaken ? '干涸的洗礼池。池底的铅塞已经被拔掉了。'
      : S2.plugOut ? '铅塞下面压着一块铅牌：一头雄鹿，和一行字——「为她出生之年，酒窖里留着一桶。」（点击拿走）'
      : has('snuffer') ? '干涸的洗礼池，侧面刻着一头雄鹿。池底的铅塞卡得死死的——灭烛钩的细钩也许能把它钩出来。'
      : '干涸的洗礼池，侧面刻着一头雄鹿。池底有一个铅塞，卡得死死的。',
    svg:`${wallBg}<rect y="330" width="600" height="70" fill="#2e2a24"/>
      <path d="M90,170 L510,170 L470,300 L130,300 Z" fill="#5f5d55" ${cInk}/>
      <use href="#deer" x="240" y="190" width="120" height="100" style="color:#47453e"/>
      <rect x="240" y="300" width="120" height="50" fill="#55534b" ${cInk}/>
      <ellipse cx="300" cy="170" rx="210" ry="66" fill="#6f6c62" ${cInk}/>
      <ellipse cx="300" cy="170" rx="176" ry="50" fill="#2e2b26" ${cInk}/>
      <path d="M180,160 Q240,146 300,152 M330,190 Q380,186 410,176" stroke="#4a463e" stroke-width="3" fill="none"/>
      ${S2.plugOut ? `<ellipse cx="300" cy="176" rx="22" ry="8" fill="#0a0907" ${cInk}/>
          ${S2.tagTaken?'':`<g id="z-tag" class="zhot" transform="rotate(-8 372 170)"><rect x="340" y="150" width="64" height="40" rx="3" fill="#77777a" ${cInk}/>
            <use href="#deer" x="346" y="154" width="22" height="22" style="color:#4a4a4e"/><path d="M372,162 h26 M372,170 h22 M350,182 h46" stroke="#4a4a4e" stroke-width="2"/></g>`}`
        : `<g id="z-plug" class="zhot"><ellipse cx="300" cy="176" rx="26" ry="10" fill="#77777a" ${cInk}/><circle cx="300" cy="174" r="5" fill="none" stroke="#3a3a3e" stroke-width="2.4"/></g>`}`,
    bind(){
      on('z-plug', ()=>{
        if(!has('snuffer')){ sfx.fail(); return setCap('铅塞卡得死死的，手指抠不出来。要是有个带钩的东西……'); }
        S2.plugOut=true; sfx.clack(); act('你把灭烛钩的细钩探进铅塞的拉环，用力一拔——「啵」。铅塞下面压着一块铅牌。');
      });
      on('z-tag', ()=>{ S2.tagTaken=true; give('tag'); sfx.pick(); act('你收起了铅牌：「为她出生之年，酒窖里留着一桶。」'); });
    }
  };
};

VIEWS.c_confess = function(){
  const scroll = S2.rung && !S2.confessRead;
  return { title:'Confessional',
    cap: S2.confessRead ? '神父那一侧的隔窗开着，里面空无一人。'
      : scroll ? '隔窗后面空无一人，可一卷纸从窗口掉了出来，落在跪凳上。（点击读）'
      : has('bell') ? '告解室。神父那一侧的隔窗紧闭着。手里的圣铃，也许能请来“听告解的人”。'
      : '告解室。神父那一侧的隔窗紧闭着，那边没有人。',
    svg:`${wallBg}<rect y="360" width="600" height="40" fill="#2e2a24"/>
      <rect x="60" y="30" width="480" height="24" fill="#2a2119" ${cInk}/>
      <rect x="70" y="54" width="460" height="326" fill="#3b2e23" ${cInk}/>
      <path d="M90,380 L90,120 L140,80 L190,120 L190,380 Z M410,380 L410,120 L460,80 L510,120 L510,380 Z" fill="#4a1f1b" ${cInk}/>
      <path d="M115,124 V376 M140,100 V376 M165,124 V376 M435,124 V376 M460,100 V376 M485,124 V376" stroke="#2e1411" stroke-width="3"/>
      <path d="M220,380 L220,116 L300,70 L380,116 L380,380 Z" fill="#4a3a2c" ${cInk}/>
      <path d="M300,30 V8 M288,18 H312" stroke="#2a2119" stroke-width="6"/>
      <g id="z-grille" class="zhot">
        <rect x="250" y="150" width="100" height="110" fill="${S2.rung?'#050403':'#14100c'}" ${cInk}/>
        ${S2.rung ? `<path d="M250,150 L234,150 L234,260 L250,260" fill="#4a3a2c" ${cInk}/>`
          : `<path d="M262,150 V260 M275,150 V260 M288,150 V260 M300,150 V260 M312,150 V260 M325,150 V260 M338,150 V260 M250,168 H350 M250,186 H350 M250,204 H350 M250,222 H350 M250,240 H350" stroke="#5a4838" stroke-width="2.4"/>`}
      </g>
      <rect x="230" y="300" width="140" height="18" fill="#2a2119" ${cInk}/>
      ${scroll ? `<g id="z-scroll" class="zhot"><rect x="262" y="284" width="76" height="16" rx="6" fill="#d8cfb4" ${cInk}/><ellipse cx="262" cy="292" rx="5" ry="8" fill="#c4b99d" ${cInk}/>
          <rect x="256" y="278" width="88" height="28" rx="6" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>` : ''}`,
    bind(){
      on('z-grille', ()=>{
        if(S2.rung){ sfx.tap(); return setCap(S2.confessRead ? '隔窗里黑洞洞的。' : '隔窗后面空无一人。'); }
        if(!has('bell')){ sfx.tap(); return setCap('你敲了敲隔窗。没有人回应。'); }
        S2.rung=true; handBell(); setTimeout(sfx.open, 900);
        act('你摇响圣铃——「有人来告解了」。神父那一侧的隔窗慢慢滑开，一卷纸掉了出来。');
      });
      on('z-scroll', ()=>{
        if(G.busy) return;
        S2.confessRead=true; G.progress.L2=true; sfx.open(); G.busy=true;
        act('忏悔纸卷：「收获月之夜，我在湖边为那孩子行了终傅礼。领主大人说，这是为了全村的面包。」');
        setTimeout(()=>{ G.busy=false; closeZoom(); showMemory('m2', ()=>{
          S2.doorOpen=true; sfx.creak(); updateAll();
          say('礼拜堂的门「吱呀」一声，从里面开了。', 5000);
        }); }, 4200);
      });
    }
  };
};

VIEWS.c_door = function(){
  const inner='M196,400 L196,150 Q204,66 300,44 Q396,66 404,150 L404,400 Z';
  return { title:'Chapel Door',
    cap: S2.doorOpen ? '门开着，外面是回大厅的冷廊。（点击回到大厅）' : '你进来时，这扇门就在身后合上了。从这一侧怎么也推不开。',
    svg:`${wallBg}
      <path d="M170,400 L170,140 Q178,40 300,16 Q422,40 430,140 L430,400 Z" fill="#5e5e54" ${cInk}/>
      ${S2.doorOpen ? `<path d="${inner}" fill="#0b0908" ${cInk}/><ellipse cx="300" cy="260" rx="80" ry="120" fill="#ffc56e" opacity=".06"/>
          <path d="M404,400 L404,150 Q400,112 372,84 L360,94 L360,382 Z" fill="#3e3125" ${cInk}/>
          <g id="z-exit" class="zhot"><path d="${inner}" fill="transparent"/><path d="M250,400 L250,200 Q254,150 300,136 Q346,150 350,200 L350,400" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>`
        : `<defs><clipPath id="zc2d"><path d="${inner}"/></clipPath></defs>
          <g id="z-push" class="zhot"><path d="${inner}" fill="#3e3125" ${cInk}/>
          <g clip-path="url(#zc2d)" stroke="#281f17" stroke-width="2.5"><path d="M236,30V400M270,30V400M330,30V400M364,30V400"/><path d="M190,150 L410,144 M190,352 L410,338" stroke="#16130f" stroke-width="12"/></g>
          <circle cx="250" cy="270" r="14" fill="none" stroke="#120f0c" stroke-width="5"/></g>`}`,
    bind(){
      on('z-push', ()=>{ sfx.thud(); shake(); setCap('门纹丝不动，像是从外面被什么抵住了。'); });
      on('z-exit', ()=>{ closeZoom(); const first = !S2.returned; S2.returned = true;
        goLevel('hall', '', ()=>say(first ? '你回到了大厅。神父的座位前，多了一本合上的祈祷书。' : '你回到了大厅。', first ? 5500 : 3000)); });
    }
  };
};

/* ---------------- 物品：缩略图 / 特写 / 角标 ---------------- */
const bellArt = `<path d="M-30,30 Q-30,-26 0,-32 Q30,-26 30,30 Z" fill="#b39c6e" ${ink}/><rect x="-6" y="-56" width="12" height="26" fill="#5a4632" ${ink}/><circle cx="0" cy="36" r="7" fill="#5a4632"/><path d="M-34,30 H34" stroke="#2b251e" stroke-width="3"/>`;
const snufferArt = `<path d="M-60,50 L40,-30" stroke="#a48c56" stroke-width="6"/><path d="M34,-24 l26,-16 l8,30 Z" fill="#a48c56" ${ink}/><path d="M-60,50 q-14,12 -2,24 q10,6 14,-4" stroke="#a48c56" stroke-width="5" fill="none"/>`;
Object.assign(TH, {
  bell:   ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,60) scale(.9)">${bellArt}</g>`,
  snuffer:()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(52,54) scale(.55)">${snufferArt}</g>`,
  page:   ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="rotate(5 49 56)"><path d="M22,18 H76 V94 H28 L22,88 Z" fill="#d6ccb0" ${ink}/>
    <path d="M30,32 H66 M30,44 H70 M30,56 H62 M30,68 H68 M30,80 H58" stroke="#5a4e3e" stroke-width="2"/><path d="M48,30 l14,4 M48,54 l12,4 M48,78 l10,3" stroke="#2b251e" stroke-width="2.4"/></g>`,
  tag:    ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="rotate(-8 49 56)"><rect x="18" y="36" width="62" height="40" rx="3" fill="#77777a" ${ink}/>
    <use href="#deer" x="22" y="40" width="24" height="24" style="color:#4a4a4e"/><path d="M50,48 h24 M50,56 h20 M26,68 h46" stroke="#4a4a4e" stroke-width="2"/></g>`
});
VIEWS.bell = ()=>({ title:'Holy Bell', cap:'礼拜堂的圣铃，黄铜的铃身上刻着一圈拉丁文。摇响它，就是在说「有人来告解了」。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,210) scale(3)">${bellArt}</g>` });
VIEWS.snuffer = ()=>({ title:'Snuffer', cap:'灭烛钩。长柄一头是熄烛的铜罩，另一头弯成一个细钩——伸进窄缝里正好。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,200) scale(2.6)">${snufferArt}</g>` });
VIEWS.page = ()=>({ title:'Baptism Page', cap:'从受洗册上撕下的一页。1309 A—— / 1342 C—— / 1375 H—— / 1403 Edmund / 1408 M——。被刮掉的名字，都相隔 33 年。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="rotate(2 300 200)"><path d="M150,30 H450 V370 H170 L150,350 Z" fill="#d6ccb0" ${ink}/>
    <text x="300" y="80" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="20" fill="#3b3026">Ravenhold</text>${registerList(196,140)}</g>` });
VIEWS.tag = ()=>({ title:'Lead Tag', cap:'洗礼池铅塞下的铅牌。一头雄鹿，和一行字：「为她出生之年，酒窖里留着一桶。」（找到那只酒桶后，它就没用了）',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="rotate(-4 300 200)"><rect x="110" y="110" width="380" height="180" rx="10" fill="#77777a" ${ink}/>
    <rect x="124" y="124" width="352" height="152" rx="6" fill="none" stroke="#5a5a5e" stroke-width="2"/>
    <use href="#deer" x="136" y="140" width="110" height="110" style="color:#4a4a4e"/>
    <text x="370" y="180" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#2e2e32">For the year of her birth,</text>
    <text x="370" y="208" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#2e2e32">a cask is kept</text>
    <text x="370" y="236" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#2e2e32">in the cellar.</text></g>` });

/* ---------------- 提示（三级） ---------------- */
HINTS.L2 = function(){
  if(!S2.paperOut || !S2.fadedSeen && !S2.cabOpen){
    if(!S2.fadedSeen && openColored().length===0) return ['这里太暗了，月光进不来。','四扇彩窗的百叶都关着。打开一扇看看光照到了哪里。','打开窗的百叶，光会照在祭坛上方的圣诗板上——只开一扇。'];
    if(!S2.fadedSeen) return ['圣诗板上的字，要在对的光下才读得清。','每次只让一种颜色的光照在圣诗板上。祭坛上的手记也许有提示。','「唯有月光能读出她的名」：只打开月之窗，看圣诗板。'];
    if(!S2.paperOut) return ['管风琴有一个音弹不出来。','E 键是哑的——对应的音管里像是塞着什么。','打开管风琴特写，点击第五根音管，把里面的纸卷抽出来。'];
  }
  if(!S2.cabOpen) return ['月光照在圣诗板上的字，可以弹出来。','琴键就是字母。弹之前记得拉风箱。','拉风箱 → F、A、D → 再拉风箱 → E、D。'];
  if(!S2.took.bell || !S2.took.snuffer || !S2.pageTorn) return ['圣器柜开了，里面还有东西。'];
  if(!S2.tagTaken) return ['洗礼池底好像压着什么。','洗礼池的铅塞，用手抠不出来。','用灭烛钩的细钩，把洗礼池的铅塞钩出来。'];
  if(!S2.confessRead) return ['告解室的隔窗紧闭着。','神父不在。要怎么让他“来听告解”？','打开告解室特写，用圣铃摇响——点击隔窗。'];
  if(!S2.doorOpen) return ['礼拜堂的门就要开了。'];
  return ['礼拜堂的门开了。回大厅去吧。'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L2 = ()=>{
  if(!S2.entered){ S2.entered=true; setTimeout(sfx.thud, 300);
    say('你走进礼拜堂，身后的门「砰」地合上了。四扇彩窗的百叶都关着，只有祭坛上两支蜡烛还亮着。', 6500); }
  else say('礼拜堂里静悄悄的。', 3000);
};

/* ---------------- 通关登记（调试起点用） ---------------- */
COMPLETE.L2 = ()=>{
  G.hall.inscriptionSeen = true; G.hall.chapelOpen = true;
  Object.assign(S2, {entered:true, shutters:{sun:false,moon:true,deer:false,raven:false}, fadedSeen:true, noteRead:true,
    paperOut:true, cabOpen:true, took:{bell:true, snuffer:true}, pageTorn:true, plugOut:true, tagTaken:true,
    rung:true, confessRead:true, doorOpen:true});
  G.progress.L2 = true; addMem('m2'); give('bell'); give('snuffer'); give('page'); give('tag');
};
