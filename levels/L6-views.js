/* =====================================================================
   第 6 关 · 夫人寝室 —— 特写视图 + 物品
   ===================================================================== */
const b6ZWall = `<rect width="600" height="400" fill="#4e4a3e"/>
  <path d="M0,70H600M0,140H600M0,210H600M0,280H600M0,350H600M90,0V70M380,0V70M220,70V140M520,70V140M60,140V210M330,140V210M160,210V280M470,210V280M100,280V350M400,280V350" stroke="#45413a" stroke-width="1.4"/>`;
const b6ZWood = `<rect width="600" height="400" fill="#3a2e24"/><path d="M0,60H600M0,130H600M0,200H600M0,270H600M0,340H600" stroke="#2e241c" stroke-width="2"/>`;
const mirrorText6 = (cx, lines, y0, mirrored, size=17)=>`<g ${mirrored?`transform="translate(${2*cx},0) scale(-1,1)"`:''} font-family="'Songti SC','STSong',serif" font-size="${size}" fill="#3b2a1e" text-anchor="middle">
  ${lines.map((t,i)=>t ? `<text x="${cx}" y="${y0+i*30}">${t}</text>` : '').join('')}</g>`;

/* ---------------- 梳妆镜：镜中世界 ---------------- */
VIEWS.l6_mirror = function(){
  S6.mirrorSeen = true;
  const up = S6.songDone;
  return { title:'Looking Glass',
    cap: up ? '镜中的母亲抬着头，望着你。她的嘴唇轻轻动着，像是还在哼那支歌。'
      : '镜子里的房间干净、明亮，点着蜡烛——就是你身后这间落满灰的屋子，只是早了很多年。一个女人的剪影伏在桌前写字。镜中的抽屉开着，音乐盒的滚筒上插满了音钉。',
    svg:`<defs><clipPath id="z6m"><ellipse cx="${MZ6.x}" cy="${MZ6.y}" rx="${MZ6.rx}" ry="${MZ6.ry}"/></clipPath></defs>
      ${b6ZWall}
      <ellipse cx="${MZ6.x}" cy="${MZ6.y}" rx="${MZ6.rx+16}" ry="${MZ6.ry+16}" fill="#4a3424" ${ink}/>
      <ellipse cx="${MZ6.x}" cy="${MZ6.y}" rx="${MZ6.rx+7}" ry="${MZ6.ry+7}" fill="none" stroke="#7a5a3a" stroke-width="2.4"/>
      <g clip-path="url(#z6m)">${mirrorWorld6({uid:'z', pillow:-1, up})}
        <path d="M200,80 Q240,40 300,36" stroke="#fff" stroke-width="7" fill="none" opacity=".14"/>
        <rect width="600" height="400" fill="#fff6e0" opacity=".05"/></g>
      <g id="z-mm-mom" class="zhot"><rect x="322" y="162" width="70" height="128" fill="transparent"/></g>
      <g id="z-mm-pillow" class="zhot"><rect x="178" y="222" width="88" height="46" fill="transparent"/></g>
      <g id="z-mm-drawer" class="zhot"><rect x="236" y="346" width="92" height="34" fill="transparent"/></g>
      <g id="z-mm-box" class="zhot"><rect x="332" y="290" width="74" height="50" fill="transparent"/>
        ${S6.songDone ? '' : `<ellipse cx="368" cy="318" rx="44" ry="30" fill="none" stroke="#efe6c8" stroke-width="1.6" class="pulse"/>`}</g>`,
    bind(){
      on('z-mm-mom', ()=>{ sfx.tap(); setCap(up ? '她在看你。……她认得你。' : '她低着头，一直在写。你敲了敲镜面，她没有听见。'); });
      on('z-mm-pillow', ()=>{ sfx.tap(); setCap('镜中的床上，枕头歪向一边，像是刚刚有人枕过。'); });
      on('z-mm-drawer', ()=>{ sfx.tap(); setCap('镜中的抽屉开着，里面是空的——那面小手镜，大概正在她手边。'); });
      on('z-mm-box', ()=>{ sfx.tap(); openZoom('l6_mboxM'); });
    }
  };
};

/* ---------------- 镜中的音乐盒（左右反过来的图样） ---------------- */
VIEWS.l6_mboxM = function(){
  S6.mboxMirrorSeen = true;
  return { title:'In the Glass',
    cap:'镜中那只音乐盒的滚筒上插满了音钉，每一列一根。……仔细看，梳齿旁刻的字母是反写的，发条也装在了另一边。',
    svg:`<rect width="600" height="400" fill="#6a4a30"/><rect width="600" height="400" fill="#ffd890" opacity=".12"/>
      <g transform="translate(600,0) scale(-1,1)">${musicBoxArt6(TUNE6,{idp:'m'})}</g>
      <rect x="6" y="6" width="588" height="388" rx="30" fill="none" stroke="#b9c4c8" stroke-width="10" opacity=".55"/>
      <path d="M40,60 Q80,24 150,20" stroke="#fff" stroke-width="6" fill="none" opacity=".16"/>
      ${uiBtn('z-back', 18, 352, 130, '← 回到镜子')}`,
    bind(){ on('z-back', ()=>{ sfx.tap(); openZoom('l6_mirror'); }); }
  };
};

/* ---------------- 现实里的音乐盒：插音钉 ---------------- */
VIEWS.l6_mbox = function(){
  const done = S6.songDone, n = S6.pins.filter(v=>v!=null).length;
  return { title:'Music Box',
    cap: done ? '滚筒上插满了音钉。母亲的歌，回来了。'
      : S6.copyTried ? '你照着镜子插的……可放出来的曲子是倒着的。镜子里的东西，是反过来的。'
      : '一只木音乐盒。滚筒上的音钉全被拔掉了，散在盒盖的小格里。每一列只能插一根；点格子插上，再点一下拔掉。插好后转动发条。',
    svg:`${b6ZWood}${musicBoxArt6(S6.pins,{cells:!done})}
      ${uiGoal(done ? '母亲的摇篮曲' : '把音钉插回滚筒，奏出那支歌')}
      <g ${ink}><rect x="78" y="350" width="120" height="40" rx="4" fill="#5a3e28"/></g>
      ${[0,1,2,3,4,5,6,7,8,9].map(i=>`<circle cx="${92+(i*23)%100}" cy="${362+(i%3)*9}" r="3.4" fill="#d8d8cc" stroke="#2b251e" stroke-width=".8"/>`).join('')}
      ${uiTag(260, 372, done ? '8 / 8' : `已插 ${n} / 8`, {w:96})}
      ${uiBtn('z-play', 330, 352, 120, done ? '再听一遍' : '转动发条', n>0 && !S6.playing)}
      ${done ? '' : uiBtn('z-clear', 462, 352, 116, '拔掉全部', n>0 && !S6.playing)}`,
    bind(){
      if(!done) for(let c=0;c<8;c++) for(let r=0;r<5;r++) on(`z-c${c}-${r}`, ()=>{
        if(S6.playing || G.busy) return;
        S6.pins[c] = S6.pins[c]===r ? null : r;
        if(S6.pins[c]!=null) mbNote6(NOTE6[ROWS6[r]], .6); else sfx.clack();
        render();
      });
      on('z-play', ()=>{
        if(S6.playing || G.busy) return;
        if(!S6.pins.some(v=>v!=null)){ sfx.fail(); return setCap('滚筒上一根音钉都没有。'); }
        sfx.clack(); setCap('你拧了几圈发条，滚筒慢慢转了起来……');
        playTune6(done ? TUNE6 : S6.pins, done ? null : judgeTune6);
      });
      on('z-clear', ()=>{ if(S6.playing || G.busy) return; S6.pins = S6.pins.map(()=>null); sfx.clack(); render(); setCap('你把音钉全拔了下来。'); });
    }
  };
};

/* ---------------- 刺绣绷架 ---------------- */
VIEWS.l6_emb = function(){
  const done = S6.embDone, n = S6.emb.reduce((a,b)=>a+b,0), xs=[170,222,274,326,378,430];
  return { title:'Embroidery',
    cap: done ? '六个小烛台，绣亮了四个。金线已经松开了——它牵着的那只抽屉，弹开了。'
      : '一幅没绣完的刺绣。边框上绣着一排六个小烛台，下面一行小字：「As it burned on the last night.」——如同最后一夜那样燃烧。绷架角上系着一根金线，一直牵进梳妆台的抽屉缝里。（点烛台绣亮 / 拆掉火苗）',
    svg:`${b6ZWall}
      <rect x="96" y="22" width="408" height="318" fill="#4a3424" ${ink}/>
      <rect x="116" y="42" width="368" height="278" fill="#d6ccb0" ${ink}/>
      <rect x="128" y="54" width="344" height="254" fill="none" stroke="#b9ae92" stroke-width="1.4" stroke-dasharray="3 3"/>
      ${xs.map((x,i)=>`<g id="z-e${i}" class="zhot"><rect x="${x-24}" y="62" width="48" height="98" fill="transparent"/>
          ${stitchCandle6(x, 132, 2.2, S6.emb[i])}
          <text x="${x}" y="154" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#6a5a44">${['I','II','III','IV','V','VI'][i]}</text></g>`).join('')}
      <g transform="translate(300,226)">
        <path d="M0,-34 q-26,8 -22,32 q4,20 22,16 q18,4 22,-16 q4,-24 -22,-32 Z" fill="none" stroke="#8a3a30" stroke-width="3"/>
        <path d="M0,-20 q-12,4 -10,16 q2,8 10,6 q8,2 10,-6" fill="none" stroke="#8a3a30" stroke-width="2"/>
        <path d="M0,14 V54 M0,30 l-16,-8 M0,40 l16,-8" stroke="#5a6a3a" stroke-width="2.4"/>
        <use href="#deer" x="-108" y="-30" width="64" height="64" style="color:#b39a5a" opacity=".55"/>
        <use href="#deer" x="44" y="-30" width="64" height="64" style="color:#b39a5a" opacity=".3" transform="translate(152,0) scale(-1,1)"/></g>
      <text x="300" y="298" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="15" fill="#5a4a36">As it burned on the last night.</text>
      <path d="M484,46 Q540,60 560,120 Q574,200 600,240" stroke="#c9a040" stroke-width="2" fill="none" ${done?'stroke-dasharray="4 6" opacity=".6"':''}/>
      <circle cx="484" cy="46" r="4" fill="#c9a040"/>
      ${uiTag(300, 370, done ? '抽屉已弹开' : `已绣亮 ${n} 个`, {w:130, fill: done ? '#efe2bf' : '#ddd3b8'})}`,
    bind(){ xs.forEach((_,i)=> on('z-e'+i, ()=>stitch6(i))); }
  };
};

/* ---------------- 梳妆台：抽屉 + 手镜 ---------------- */
VIEWS.l6_table = function(){
  const open = S6.embDone, took = S6.hmTaken;
  return { title:'Dressing Table',
    cap: !open ? '梳妆台的抽屉拉不开。上面没有锁孔，只有一根金线从缝里钻出去，牵向角落里那副刺绣绷架。'
      : took ? '抽屉空了。' : '抽屉弹开了。里面躺着一面小手镜。',
    svg:`${b6ZWall}
      <rect x="40" y="128" width="520" height="26" fill="#4e3828" ${ink}/>
      <rect x="56" y="154" width="488" height="72" fill="#3e2c1e" ${ink}/>
      <path d="M80,226 L74,400 M520,226 L526,400 M110,226 V380 M490,226 V380" stroke="#3a2a1c" stroke-width="14"/>
      <g id="z-diary" class="zhot"><polygon points="74,124 136,108 136,126 74,130" fill="#d8cfb8" ${ink}/><polygon points="136,108 198,124 198,130 136,126" fill="#cfc5ab" ${ink}/>
        <path d="M84,122 h40 M84,116 h36 M148,116 h40 M148,122 h36" stroke="#7a6a58" stroke-width="1.2"/></g>
      <g id="z-box" class="zhot"><rect x="420" y="88" width="96" height="40" fill="#5a3e28" ${ink}/><polygon points="420,88 516,88 526,62 430,62" fill="#6a4a30" ${ink}/>
        <rect x="430" y="94" width="76" height="26" fill="#b39a5a" stroke="#2b251e" stroke-width="1"/></g>
      ${open
        ? `<polygon points="196,168 404,168 432,252 168,252" fill="#1e1610" ${ink}/>
           <rect x="168" y="234" width="264" height="34" fill="#4a3424" ${ink}/><circle cx="300" cy="251" r="6" fill="#a88a4e" ${ink}/>
           ${took ? '' : `<g id="z-hm" class="zhot"><rect x="220" y="172" width="160" height="62" fill="transparent"/>
              <g transform="translate(300,204) rotate(-90) scale(.62)">${hmirrorArt6()}</g>
              <ellipse cx="300" cy="204" rx="88" ry="34" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>`}`
        : `<g id="z-drawer" class="zhot"><rect x="204" y="164" width="192" height="52" fill="#4a3424" ${ink}/>
             <rect x="214" y="172" width="172" height="36" fill="none" stroke="#5e4634" stroke-width="2"/>
             <path d="M396,188 Q450,200 470,260 Q480,300 500,330" stroke="#c9a040" stroke-width="2" fill="none"/></g>`}`,
    bind(){
      on('z-diary', ()=>{ sfx.tap(); openZoom('l6_diary'); });
      on('z-box', ()=>{ sfx.tap(); openZoom('l6_mbox'); });
      on('z-drawer', ()=>{ sfx.thud(); shake(); setCap('抽屉纹丝不动。金线绷得紧紧的——机关在绷架那一头。'); });
      on('z-hm', ()=>{ S6.hmTaken=true; give('hmirror'); sfx.pick();
        act('一面小手镜，镜背镶着一圈珍珠。……和长廊画像里那个叫休的男孩手里举着的，一模一样。'); });
    }
  };
};

/* ---------------- 日记：反写的字 + 手镜 ---------------- */
VIEWS.l6_diary = function(){
  const p = S6.page, lens = S6.lens, lines = DIARY6[p];
  if(lens) S6.diaryRead[p] = true;
  const torn = p===2;
  const sketch = [
    `<circle cx="170" cy="200" r="44" fill="none" stroke="#5a4a36" stroke-width="2.4"/><path d="M170,200 V164 M170,200 L178,170" stroke="#5a4a36" stroke-width="2.4"/><text x="170" y="170" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#5a4a36">XII</text>`,
    `<g transform="translate(170,200) scale(.5)">${gearArt(70,12,'none',{dark:'none',hub:'none'})}</g>`,
    `<use href="#sym-raven" x="128" y="150" width="84" height="84" style="color:#3b2a1e"/><circle cx="185" cy="170" r="3" fill="#b23a2e"/>`
  ][p];
  const scrapPiece = `<path d="M346,190 L392,184 L408,190 L440,186 L512,192 L508,214 L486,224 L440,220 L388,226 L352,222 L340,206 Z" fill="${S6.scrapDone?'#cfc4a6':'#3a2e24'}" ${S6.scrapDone?'stroke="#3a2a1c" stroke-width="2"':''}/>`;
  return { title:'Diary',
    cap: !lens ? '母亲的日记。字迹是反着写的，从右往左，一个字也认不出来。' + (has('hmirror') ? ' ——手里的镜子，也许能把它照正。' : '')
      : `第 ${p+1} 页：「${lines.filter(Boolean).join('')}」` + (torn && !S6.scrapDone ? ' 这一页撕掉了一角。' : torn ? ' 缺口里，是那张烧焦的纸片：「……别相信那只乌鸦。」' : ''),
    svg:`<rect width="600" height="400" fill="#8f8875"/>
      <path d="M40,64 Q170,42 300,74 Q430,42 560,64 L560,350 Q430,328 300,358 Q170,328 40,350 Z" fill="#4a2a22" ${ink}/>
      <path d="M52,70 Q170,50 300,80 L300,346 Q170,318 52,338 Z" fill="#ddd3b8" ${ink}/>
      <path d="M548,70 Q430,50 300,80 L300,346 Q430,318 548,338 Z" fill="#d6ccb0" ${ink}/>
      <g opacity=".75">${sketch}</g>
      <text x="170" y="292" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="13" fill="#7a6a58">— ${['I','II','III'][p]} —</text>
      ${torn ? scrapPiece : ''}
      ${mirrorText6(425, lines, 130, !lens, 16)}
      ${torn && S6.scrapDone ? mirrorText6(425, ['……别相信那只乌鸦。'], 211, !lens, 14) : ''}
      ${lens ? `<ellipse cx="425" cy="196" rx="132" ry="128" fill="none" stroke="#a88a4e" stroke-width="5" opacity=".75"/><path d="M425,324 V372" stroke="#8a7448" stroke-width="12" stroke-linecap="round" opacity=".75"/>` : ''}
      ${p>0 ? `<g id="z-prev" class="zhot"><circle cx="24" cy="206" r="18" fill="#6b6252"/><path d="M30,194 L16,206 L30,218" stroke="#ddd3b8" stroke-width="3" fill="none"/></g>` : ''}
      ${p<2 ? `<g id="z-next" class="zhot"><circle cx="576" cy="206" r="18" fill="#6b6252"/><path d="M570,194 L584,206 L570,218" stroke="#ddd3b8" stroke-width="3" fill="none"/></g>` : ''}
      ${!lens ? uiBtn('z-lens', 220, 362, 160, '用手镜照着读', has('hmirror')) : ''}`,
    bind(){
      on('z-prev', ()=>{ S6.page--; sfx.open(); render(); updateAll(); });
      on('z-next', ()=>{ S6.page++; sfx.open(); render(); updateAll();
        if(S6.lens && S6.page===2) diaryCombine6(); });
      on('z-lens', ()=>{
        if(!has('hmirror')){ sfx.fail(); return setCap('反着写的字……要是有一面镜子就好了。'); }
        S6.lens = true; sfx.open(); render(); updateAll();
        if(S6.page===2) diaryCombine6();
      });
    }
  };
};

/* ---------------- 床：枕头（隐藏鸦羽） ---------------- */
VIEWS.l6_bed = function(){
  const fea = S6.pillow===1 && !G.feathers.L6;
  return { title:'Bed',
    cap: fea ? '枕头歪向这一边时，底下露出了一根乌黑的羽毛。'
      : S6.pillow===0 ? '四柱床上的被褥铺得整整齐齐，枕头摆得端端正正，落了一层灰。（点击枕头可以挪动它）'
      : '枕头歪着。',
    svg:`<rect width="600" height="400" fill="#3a2a20"/>
      <rect x="40" y="20" width="520" height="160" fill="#4a3424" ${ink}/><path d="M60,40 H540 V160 H60 Z" fill="none" stroke="#5e4634" stroke-width="2"/>
      <polygon points="20,180 580,180 600,400 0,400" fill="#6b2f28" ${ink}/>
      <path d="M20,180 H580" stroke="#b39a5a" stroke-width="3"/>
      <path d="M0,330 Q300,300 600,330" stroke="#5a2622" stroke-width="3" fill="none"/>
      ${fea ? `<g id="z-fea" class="zhot"><rect x="400" y="170" width="150" height="90" fill="transparent"/>
          <path d="M410,246 Q460,232 530,180" stroke="#0e0c0a" stroke-width="5" fill="none"/>
          <path d="M432,240 l-8,-8 M446,235 l-8,-9 M460,229 l-7,-9 M474,221 l-6,-10 M488,212 l-6,-10 M502,202 l-5,-10 M438,238 l10,2 M452,233 l10,1 M466,226 l10,0 M480,218 l10,-1 M494,209 l9,-2 M508,198 l9,-2" stroke="#1d1915" stroke-width="2.6"/>
          <circle cx="480" cy="214" r="46" fill="none" stroke="#efe6c8" stroke-width="1.8" class="pulse"/></g>` : ''}
      <g id="z-pillow" class="zhot"><g transform="rotate(${S6.pillow*10} 300 214)">
        <rect x="160" y="182" width="280" height="64" rx="28" fill="#d8cfb8" ${ink}/>
        <path d="M184,214 q116,-16 232,0" stroke="#bdb196" stroke-width="2" fill="none"/></g></g>`,
    bind(){
      on('z-pillow', cyclePillow6);
      on('z-fea', ()=>{ pickFeather('L6'); render(); });
    }
  };
};

/* ---------------- 摇篮：木鹿（可选）/ 暗梯 ---------------- */
VIEWS.l6_cradle = function(){
  const st = S6.stairOpen;
  return { title:'Cradle',
    cap: st ? '摇篮滑到了一边。它原来的位置，地板塌下去一块，露出一道窄窄的暗梯，盘旋着通向楼下。（点击下楼）'
      : S6.rocking ? '摇篮在自己摇着，一下，又一下。'
      : S6.deerPlaced ? '一只空摇篮。木鹿在里面躺过一会儿，留下了一小块没有灰的地方。'
      : '一只空摇篮，铺着发黄的小毯子。地板上有一道道弧形的划痕——它被摇过很多很多次。',
    svg:`${b6ZWall}<rect y="300" width="600" height="100" fill="#3a3028"/><path d="M0,300 H600" stroke="#1a1511" stroke-width="2"/>
      <path d="M150,322 Q300,346 450,322 M170,336 Q300,358 430,336" stroke="#2a221c" stroke-width="2" fill="none"/>
      ${st ? `<g id="z-stair" class="zhot"><polygon points="300,300 460,300 492,372 268,372" fill="#0c0a08" ${ink}/>
          <path d="M298,318 H462 M288,336 H472 M280,354 H480" stroke="#2a221a" stroke-width="4"/>
          <ellipse cx="380" cy="340" rx="104" ry="30" fill="#ffc56e" opacity=".08"/>
          <polygon points="300,300 460,300 492,372 268,372" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/></g>` : ''}
      <g transform="translate(${st?150:300},330) scale(${st?1.6:2})"><g class="${S6.rocking?'b6rock':''}" id="z-crg">${cradleArt6({deer:false})}</g></g>
      ${!st && has('deer') && !S6.deerPlaced && !S6.rocking ? uiBtn('z-deer', 400, 354, 180, '把木鹿放进摇篮') : ''}`,
    bind(){
      on('z-stair', goStudy6);
      on('z-deer', ()=>{
        S6.deerPlaced = true; sfx.tap(); G.busy = true;
        zsvg.querySelector('#z-crg').innerHTML = cradleArt6({deer:true});
        zsvg.querySelector('#z-crg').setAttribute('class','b6rock');
        const b = zsvg.querySelector('#z-deer'); if(b) b.remove();
        setCap('你把木鹿放进摇篮。摇篮轻轻晃了两下……');
        setTimeout(()=>{ G.busy = false; render(); setCap('……你又把它抱了回来。它还要陪你走完剩下的路。'); }, 3000);
      });
    }
  };
};

/* ---------------- 湿裙子 ---------------- */
VIEWS.l6_dress = function(){
  return { title:'Damp Gown',
    cap: S6.dressSeen ? '口袋里那张纸被湖水泡皱了：「春天了。我去湖里找她。」'
      : '一条暗红的长裙，挂在门边的木钉上。下摆是湿的，还在往下滴水，散发着湖水的气味。……可这间屋子，已经三十三年没人进来过了。',
    svg:`${b6ZWall}
      <circle cx="300" cy="24" r="7" fill="#2a2018"/><path d="M300,28 L250,70 M300,28 L350,70" stroke="#2a2018" stroke-width="4"/>
      <path d="M250,70 Q236,110 256,150 Q206,280 216,380 L384,380 Q394,280 344,150 Q364,110 350,70 Z" fill="#5a2c26" ${ink}/>
      <path d="M256,150 Q300,162 344,150" stroke="#b39a5a" stroke-width="3" fill="none"/>
      <path d="M210,320 Q300,336 390,320 L384,380 L216,380 Z" fill="#2e1c1a"/>
      <path d="M232,384 q3,8 0,14 M290,386 q3,8 0,12 M352,384 q3,8 0,14" stroke="#7a8a90" stroke-width="2.4" fill="none"/>
      <g id="z-pocket" class="zhot"><path d="M318,220 Q340,218 344,252 Q332,262 318,256 Z" fill="#4a2420" ${ink}/>
        ${S6.dressSeen ? '' : `<path d="M324,226 l10,-10 l8,6 l-8,10 Z" fill="#cfc4a6" stroke="#2b251e" stroke-width="1"/><circle cx="332" cy="236" r="26" fill="none" stroke="#efe6c8" stroke-width="1.6" class="pulse"/>`}</g>`,
    bind(){ on('z-pocket', ()=>{
      if(S6.dressSeen){ sfx.tap(); return setCap('口袋里只剩一点湖底的细沙。'); }
      S6.dressSeen = true; sfx.open();
      act('口袋里有一张被水泡皱的纸，字迹洇开了：「春天了。我去湖里找她。」');
      setTimeout(()=>{ if(G.level==='L6') say('……母亲没有等到第二个收获月。', 5000); }, 1200);
    }); }
  };
};

/* ---------------- 物品：缩略图 / 特写 ---------------- */
TH.hmirror = ()=>`<rect width="98" height="112" fill="#a39b87"/><g transform="translate(49,50) rotate(-20) scale(.62)">${hmirrorArt6()}</g>`;
VIEWS.hmirror = ()=>({ title:'Hand Mirror', cap:'母亲梳妆台抽屉里的小手镜，镜背镶着一圈珍珠。照着它，反写的字就能读正。',
  svg:`<rect width="600" height="400" fill="#8f8875"/><g transform="translate(300,170) scale(2.4)">${hmirrorArt6()}</g>` });
