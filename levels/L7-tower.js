/* =====================================================================
   第 7 关 · 钟楼 —— 特写视图（钟面 + 月相盘 / 机芯 / 墙上图纸）
   ===================================================================== */
const t7ZWood = `<rect width="600" height="400" fill="#3a2e24"/><path d="M0,70H600M0,140H600M0,210H600M0,280H600M0,350H600" stroke="#2e241c" stroke-width="2"/>`;

/* ---------------- 钟面 + 月相盘 ---------------- */
VIEWS.l7_clock = function(){
  const lock = S7.struck;
  return { title:'Clock Face',
    cap: lock ? '时针指着 XII，月相盘停在满月。'
      : '机芯室的钟面和月相盘。点钟面拨时针，点月相盘换月相。拨好后，到重锤旁边拉下拉杆。',
    svg:`${t7ZWood}
      <rect x="60" y="30" width="480" height="300" rx="8" fill="#4a3a2a" ${ink}/>
      <rect x="72" y="42" width="456" height="276" rx="6" fill="none" stroke="#6a5440" stroke-width="2"/>
      <g id="z-face" class="zhot"><g transform="translate(210,180)">${clockFaceArt7(110, S7.hour)}</g></g>
      <g id="z-disc" class="zhot"><g transform="translate(430,180)">${moonDiscArt7(74, S7.phase)}</g></g>
      ${uiTag(210, 316, `时针：${ROMAN7[S7.hour%12]}`, {w:110, fill:S7.hour===12?'#efe2bf':'#ddd3b8'})}
      ${uiTag(430, 286, `月相：${PHASE7[S7.phase]}`, {w:120, fill:S7.phase===2?'#efe2bf':'#ddd3b8'})}
      ${lock ? '' : `${uiBtn('z-hdn', 110, 352, 90, '◀ 拨回')}${uiBtn('z-hup', 220, 352, 90, '拨快 ▶')}${uiBtn('z-ph', 370, 352, 130, '转月相盘')}`}`,
    bind(){
      if(lock) return;
      const setH = d=>{ S7.hour = ((S7.hour-1+d+12)%12)+1; sfx.clack(); render(); updateAll(); };
      on('z-face', ()=>setH(1)); on('z-hup', ()=>setH(1)); on('z-hdn', ()=>setH(-1));
      const ph = ()=>{ S7.phase=(S7.phase+1)%4; sfx.clack(); tone(330+S7.phase*60,.2,'triangle',.02); render(); updateAll(); };
      on('z-disc', ph); on('z-ph', ph);
    }
  };
};

/* ---------------- 机芯：第三根轴装铜齿轮 ---------------- */
VIEWS.l7_mech = function(){
  const set = S7.gearSet, Y=210, A=[{x:160,r:80,t:20},{x:286,r:46,t:12},{x:388,r:56,t:12}];
  const g = (a,i)=>{
    if(i===2 && !set) return `<g id="z-ax3" class="zhot"><circle cx="${a.x}" cy="${Y}" r="${a.r+14}" fill="transparent"/>
        <circle cx="${a.x}" cy="${Y}" r="9" fill="#15110d"/><circle cx="${a.x}" cy="${Y}" r="${a.r}" fill="none" stroke="#efe6c8" stroke-width="2" stroke-dasharray="6 5" class="pulse"/>
        <text x="${a.x}" y="${Y+a.r+28}" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#e6d9b0">III</text></g>`;
    return `<g transform="translate(${a.x},${Y})">${gearArt(a.r, a.t, i===2?'#b0703a':'#5a5650', i===2?{dark:'#7a4a22',hub:'#4a2a12'}:{dark:'#2e2c28'})}</g>
      <text x="${a.x}" y="${Y+a.r+28}" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#e6d9b0">${['I','II','III'][i]}</text>`;
  };
  return { title:'Clockwork',
    cap: set ? '三根轴都咬上了。铜齿轮背面的鸦戒纹章，正对着外面。'
      : '大钟的机芯。重锤的力从第一根轴传到第三根轴，再带动钟锤——可第三根轴是空的。' + (has('cgear') ? ' 磨坊里那个铜齿轮，背面刻着「钟楼 · 第三轴」。' : ''),
    svg:`${t7ZWood}
      <rect x="40" y="70" width="520" height="16" fill="#2a2622" ${ink}/><rect x="40" y="320" width="520" height="16" fill="#2a2622" ${ink}/>
      <rect x="40" y="70" width="16" height="266" fill="#2a2622" ${ink}/><rect x="544" y="70" width="16" height="266" fill="#2a2622" ${ink}/>
      ${A.map(g).join('')}
      <path d="M${A[2].x+A[2].r},${Y} L520,140 M520,140 L540,90" stroke="#2a2622" stroke-width="8" fill="none"/>
      <circle cx="520" cy="140" r="8" fill="#3a3430" ${ink}/>
      ${uiGoal(set ? '机芯接通了' : '让重锤的力一直传到钟锤')}
      ${set ? '' : uiBtn('z-set', 220, 352, 160, '装上铜齿轮', has('cgear'))}`,
    bind(){
      const doSet = ()=>{
        if(set) return;
        if(!has('cgear')){ sfx.fail(); return setCap('这根轴上该装一个十二齿的齿轮。手边没有合适的。'); }
        S7.gearSet = true; take('cgear'); sfx.clack(); setTimeout(()=>noise(.2,2200,.06,3), 120);
        act('你把铜齿轮套上第三根轴。十二个齿严丝合缝地咬进了旁边的齿轮——它本来就属于这里。母亲在 1415 年把它拆走，钟楼才没有敲响。');
      };
      on('z-ax3', doSet); on('z-set', doSet);
    }
  };
};

/* ---------------- 墙上图纸（钟点 + 月相的提示） ---------------- */
VIEWS.l7_plan = function(){
  S7.planSeen = true;
  return { title:'Clockmaker\'s Plan',
    cap:'钟楼匠人的图纸。机芯的第三根轴被红笔圈了出来。角落里画着钟面：时针指着 XII，旁边是一轮满月，写着一行小字——「收获月之夜，十二响」。',
    svg:`<rect width="600" height="400" fill="#3a2e24"/>
      <rect x="40" y="20" width="520" height="360" fill="#4a2a20" ${ink}/>
      <g fill="none" stroke="#c9b48a" stroke-width="2">
        <circle cx="150" cy="140" r="70"/><circle cx="246" cy="196" r="40"/><circle cx="312" cy="238" r="30"/>
        <path d="M150,70 V40 M100,320 Q200,270 330,330"/><path d="M110,330 h220 M150,210 V320"/></g>
      <circle cx="312" cy="238" r="40" fill="none" stroke="#c8402e" stroke-width="3"/>
      <text x="312" y="300" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#c8402e">III</text>
      <g transform="translate(430,130)"><circle r="56" fill="none" stroke="#c9b48a" stroke-width="2"/>
        <text y="-36" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#c9b48a">XII</text>
        <path d="M0,0 V-34" stroke="#c9b48a" stroke-width="4"/><circle r="4" fill="#c9b48a"/></g>
      <g transform="translate(430,250)"><circle r="30" fill="#e6dcc0" stroke="#c9b48a" stroke-width="2"/></g>
      <text x="430" y="320" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="14" fill="#c9b48a">Luna messis · XII</text>`
  };
};
