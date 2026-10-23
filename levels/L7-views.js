/* =====================================================================
   第 7 关 · 书房 —— 特写视图（信 / 画像 / 鸟笼年份锁 / 铁匣 / 契约）+ 物品
   ===================================================================== */
const s7ZWall = `<rect width="600" height="400" fill="#4e4a3e"/>
  <path d="M0,70H600M0,140H600M0,210H600M0,280H600M0,350H600M90,0V70M380,0V70M220,70V140M520,70V140M60,140V210M330,140V210M160,210V280M470,210V280M100,280V350M400,280V350" stroke="#45413a" stroke-width="1.4"/>`;
const LETTER7 = [
  ['艾格尼丝：', '今晚之后，你会恨我。', '他们说，收获月升到中天的时候，', '钟楼的钟会敲十二下。', '我把钟楼的门锁上了。', '可我知道，这没有用。'],
  ['那年我十二岁。', '我以为只要告诉父亲，', '下一个就不会是我。', '我提着灯，敲开了他的门。', '父亲对我们的哭声充耳不闻——', '三十三年后，我也成了他。', '……原谅我。  ——E.']
];
const PACT7_FRONT = ['每三十三年，', '雷文霍尔德之血须献出一名七岁之子，', '予雾与鸦，', '以换麦田丰饶、瘟疫绕行。', '', '立约者：阿尔德里克', '愿永远守望。'];
const PACT7_BACK  = ['若立约之鸦饮下安眠之水，', '于月落之前，', '以立约之戒封其喙，', '则此约毁。'];

/* ---------------- 埃德蒙的信 ---------------- */
VIEWS.l7_letter = function(){
  const p = S7.letterPage; S7.letterRead[p] = true;
  return { title:"Edmund's Letter",
    cap: p===0 ? '一封没寄出的信，墨迹很新。收信人是艾格尼丝——埃德蒙的女儿。（右下角翻到第二页）'
               : '信的第二页。落款只有一个字母：E。',
    svg:`<rect width="600" height="400" fill="#3a2e24"/><rect y="300" width="600" height="100" fill="#4a3a2a"/>
      <g transform="rotate(-2 300 200)"><rect x="130" y="20" width="340" height="360" fill="#ddd3b8" ${ink}/>
        <rect x="142" y="32" width="316" height="336" fill="none" stroke="#b9ae92" stroke-width="1"/>
        ${mirrorText6(300, LETTER7[p], 82, false, 17)}
        <text x="440" y="358" text-anchor="end" font-family="Georgia,serif" font-style="italic" font-size="13" fill="#7a6a58">${p+1} / 2</text></g>
      ${p>0 ? `<g id="z-prev" class="zhot"><circle cx="90" cy="200" r="20" fill="#6b6252"/><path d="M96,188 L82,200 L96,212" stroke="#ddd3b8" stroke-width="3" fill="none"/></g>` : ''}
      ${p<1 ? `<g id="z-next" class="zhot"><circle cx="510" cy="200" r="20" fill="#6b6252"/><path d="M504,188 L518,200 L504,212" stroke="#ddd3b8" stroke-width="3" fill="none"/>
          <circle cx="510" cy="200" r="28" fill="none" stroke="#efe6c8" stroke-width="1.6" class="pulse"/></g>` : ''}`,
    bind(){
      on('z-prev', ()=>{ S7.letterPage=0; sfx.open(); render(); });
      on('z-next', ()=>{ S7.letterPage=1; sfx.open(); render(); updateAll();
        if(!checkDone7() && !S7.pactBack) setTimeout(()=>{ if(cur==='l7_letter') setCap('那年我十二岁……他提着灯，敲开了父亲的门。'); }, 2400); });
    }
  };
};

/* ---------------- 阿尔德里克画像 ---------------- */
VIEWS.l7_aldric = ()=>({ title:'Aldric',
  cap:'先祖阿尔德里克的画像，铭牌上刻着 1316。他的眼睛是暗红色的——和石屋壁炉台上那只铁乌鸦喝过雨水之后的眼睛，一模一样。',
  svg:`${s7ZWall}<rect x="186" y="16" width="228" height="300" fill="#6b5532" ${ink}/><rect x="194" y="24" width="212" height="284" fill="none" stroke="#9a7e46" stroke-width="2"/>
    <svg x="202" y="32" width="196" height="268" viewBox="0 0 100 130" preserveAspectRatio="none">${portraitAldric7()}</svg>
    <rect x="256" y="326" width="88" height="22" fill="#8a7448" ${ink}/><text x="300" y="342" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#2b251e">ALDRIC · 1316</text>` });

/* ---------------- 鸟笼年份锁 → 鸦戒 ---------------- */
VIEWS.l7_cage = function(){
  const open = S7.cageOpen, took = S7.ringTaken;
  const wheel = (i)=>{ const x = 216 + i*56;
    return `<g id="z-d${i}" class="zhot"><rect x="${x-22}" y="282" width="44" height="58" rx="5" fill="#2a2420" ${ink}/>
      <rect x="${x-17}" y="288" width="34" height="46" rx="3" fill="#cfc4a6"/>
      <text x="${x}" y="321" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#2b251e">${S7.digits[i]}</text>
      <path d="M${x-17},298 H${x+17} M${x-17},324 H${x+17}" stroke="#a89c80" stroke-width="1"/></g>`; };
  let bars=''; for(let i=-4;i<=4;i++) bars+=`<path d="M${300+i*30},270 V${86+Math.abs(i)*6}"/>`;
  return { title:'Birdcage',
    cap: took ? '笼子空了，笼门开着。'
      : open ? '笼门开了。栖木上套着一枚沉甸甸的戒指。'
      : '一只空鸟笼。笼底是一把四位的年份锁，铭牌上刻着：「于下一次收获月开启」。栖木上套着一枚戒指。（点转轮拨数字）',
    svg:`${s7ZWall}
      <path d="M300,0 V40" stroke="#15110d" stroke-width="3"/>
      <g stroke="#1a1511" stroke-width="3" fill="none">${bars}<path d="M180,110 Q300,10 420,110" stroke-width="4"/><path d="M178,180 H422"/></g>
      <ellipse cx="300" cy="272" rx="134" ry="12" fill="#2a2420" ${ink}/>
      <path d="M240,212 H360" stroke="#3a2e22" stroke-width="7"/>
      ${!took ? `<g ${open?'id="z-ring" class="zhot"':''}><g transform="translate(300,196) scale(.5)">${ringArt7()}</g>
          ${open ? `<circle cx="300" cy="200" r="30" fill="none" stroke="#efe6c8" stroke-width="1.8" class="pulse"/>` : ''}</g>` : ''}
      ${open ? `<path d="M390,270 L440,190 L438,110" stroke="#1a1511" stroke-width="3" fill="none"/>` : ''}
      <rect x="180" y="276" width="240" height="70" rx="6" fill="#4a3a2a" ${ink}/>
      ${[0,1,2,3].map(wheel).join('')}
      <rect x="196" y="352" width="208" height="24" fill="#8a7448" ${ink}/>
      <text x="300" y="369" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="12" fill="#2b251e">Aperietur proxima luna messis</text>
      ${!open ? uiBtn('z-pull', 440, 300, 136, '拉开笼门') : ''}`,
    bind(){
      [0,1,2,3].forEach(i=> on('z-d'+i, ()=>{ if(open) return; S7.digits[i]=(S7.digits[i]+1)%10; sfx.clack(); render(); }));
      on('z-pull', ()=>{
        if(S7.digits.join('')==='1448'){
          S7.cageOpen = true; sfx.clack(); setTimeout(sfx.creak, 200); render(); updateAll();
          setCap('锁「咔哒」一声弹开了。……1316、1349、1382、1415——再过三十三年，就是今年。原来，已经过去 33 年了。今年，是 1448。');
          setTimeout(()=>say('今晚就是 1448 年的收获月。', 5000), 600);
          return;
        }
        S7.cageSway = true; sfx.thud(); shake(); setTimeout(sfx.caw, 300); updateAll();
        setCap(`笼门纹丝不动。笼里的空栖木晃了晃，远处传来一声乌鸦叫。——${S7.digits.join('')} 不对。`);
      });
      on('z-ring', ()=>{ S7.ringTaken = true; give('ring'); sfx.pick();
        act('一枚沉甸甸的印章戒指，戒面上刻着一只乌鸦。是雷文霍尔德家主的鸦戒——立约之戒。'); });
    }
  };
};

/* ---------------- 铁匣 ---------------- */
VIEWS.l7_chest = function(){
  const open = S7.chestOpen;
  return { title:'Iron Casket',
    cap: !open ? '一只铁匣，没有锁孔。盖子正中焊着一根铁链，笔直地穿过天花板，通向楼上的钟楼。'
      : S7.pactTaken ? '铁匣空了。' : '铁链把盖子拉开了。匣底躺着一卷羊皮纸，用黑蜡封着，蜡上压着一个鸦爪印。',
    svg:`<rect width="600" height="400" fill="#3a332b"/><rect y="300" width="600" height="100" fill="#2e2822"/>
      <path d="M300,0 V${open?96:150}" stroke="#15110d" stroke-width="5" stroke-dasharray="10 4"/>
      <rect x="150" y="190" width="300" height="140" fill="#2e2a26" ${ink}/>
      ${[176,300,424].map(x=>`<path d="M${x},190 V330" stroke="#15110d" stroke-width="8"/>`).join('')}
      ${open ? `<polygon points="150,190 450,190 432,96 168,96" fill="#3a3430" ${ink}/><rect x="160" y="186" width="280" height="12" fill="#0c0a08"/>`
             : `<path d="M150,190 Q300,120 450,190 Z" fill="#3a3430" ${ink}/>`}
      <circle cx="300" cy="${open?96:156}" r="9" fill="none" stroke="#15110d" stroke-width="4"/>
      ${open && !S7.pactTaken ? `<g id="z-pact" class="zhot"><rect x="230" y="150" width="140" height="60" fill="transparent"/>
          <rect x="236" y="168" width="128" height="26" rx="12" fill="#d4c8a4" ${ink}/><circle cx="300" cy="181" r="9" fill="#2a1a14"/>
          <rect x="226" y="150" width="148" height="62" rx="10" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>` : ''}`,
    bind(){
      on('z-pact', ()=>{ S7.pactTaken = true; give('pact'); sfx.open(); updateAll(); openZoom('l7_pact'); });
    }
  };
};

/* ---------------- 契约（正面 / 反写的背面） ---------------- */
VIEWS.l7_pact = function(){
  const back = S7.pactSide===1, lens = S7.lens;
  if(!back) S7.pactFront = true;
  if(back && lens) S7.pactBack = true;
  const body = back
    ? `${mirrorText6(300, PACT7_BACK, 140, !lens, 18)}
       ${lens ? `<ellipse cx="300" cy="186" rx="170" ry="110" fill="none" stroke="#a88a4e" stroke-width="5" opacity=".75"/><path d="M300,296 V340" stroke="#8a7448" stroke-width="12" stroke-linecap="round" opacity=".75"/>` : ''}`
    : `${mirrorText6(300, PACT7_FRONT, 76, false, 16)}
       <g transform="translate(400,300)" stroke="#5a1a14" stroke-width="3" fill="none"><path d="M0,0 l-10,22 M0,0 l0,26 M0,0 l10,22 M0,0 v-10"/></g>`;
  return { title:'The Pact',
    cap: !back ? '契约正面：「每三十三年，雷文霍尔德之血须献出一名七岁之子，予雾与鸦，以换麦田丰饶、瘟疫绕行。立约者：阿尔德里克，愿永远守望。」落款是一个鸦爪印。'
      : !lens ? '契约背面是一片密密麻麻的小字，全是反着写的。' + (has('hmirror') ? ' ——手镜能把它照正。' : '')
      : '解除条款：「若立约之鸦饮下安眠之水，于月落之前，以立约之戒封其喙，则此约毁。」——安眠之水、立约之戒、鸦。这三样，你都见过。',
    svg:`<rect width="600" height="400" fill="#2e2822"/>
      <path d="M90,24 H510 Q530,24 530,44 V356 Q530,376 510,376 H90 Q70,376 70,356 V44 Q70,24 90,24 Z" fill="${back?'#cfc2a0':'#d8ccaa'}" ${ink}/>
      <path d="M70,44 Q60,24 90,24 M530,356 Q540,376 510,376" stroke="#2b251e" stroke-width="2" fill="none"/>
      ${body}
      ${uiBtn('z-flip', 90, 352, 140, back ? '翻回正面' : '翻到背面')}
      ${back && !lens ? uiBtn('z-lens', 380, 352, 150, '用手镜照着读', has('hmirror')) : ''}`,
    bind(){
      on('z-flip', ()=>{ S7.pactSide = back ? 0 : 1; sfx.open(); render(); updateAll(); if(S7.pactSide===1 && S7.lens) checkDone7(); });
      on('z-lens', ()=>{
        if(!has('hmirror')){ sfx.fail(); return setCap('反着写的字……要是有一面镜子就好了。'); }
        S7.lens = true; sfx.open(); render(); updateAll();
        if(!checkDone7() && !S7.letterRead.every(Boolean)) setTimeout(()=>{ if(G.level==='L7') say('……桌上埃德蒙那封信，还没读完。', 5000); }, 3000);
      });
    }
  };
};

/* ---------------- 物品 ---------------- */
TH.ring = ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,54) scale(.8)">${ringArt7()}</g>`;
TH.pact = ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,56) scale(.85)">${pactArt7()}</g>`;
VIEWS.ring = ()=>({ title:'Raven Ring', cap:'雷文霍尔德家主的鸦戒，戒面刻着一只乌鸦——契约里说的「立约之戒」。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,190) scale(3)">${ringArt7()}</g>` });
VIEWS.pact = VIEWS.l7_pact;
