/* =====================================================================
   第 6 关 · 夫人寝室 —— 状态 / 刺绣 / 音乐盒 / 场景动态层 / 点击 / 提示 / 通关登记
   新机制：镜中世界（梳妆镜里是 1415 年的房间）+ 左右反转（照抄镜子会错）
   流程：看镜子 → 刺绣绣亮 I·III·IV·VI（第 1 关吊灯）→ 金线拉开抽屉得手镜
        → 手镜照读反写日记（补全烧焦纸片：它就是阿尔德里克）
        → 照镜中音乐盒插音钉：照抄 = 倒放的怪调，左右翻转 = 摇篮曲
        → 镜中母亲抬头、摇篮自己摇起 → 记忆页 ⑥ → 摇篮下的暗梯（第 7 关）
   可选：湿裙子口袋里的字条 · 把木鹿放进摇篮 · 按镜中枕头的“反向”摆枕头 → 鸦羽
   ===================================================================== */
const S6 = {
  entered:false, mirrorSeen:false, mboxMirrorSeen:false,
  emb:[0,0,0,0,0,0], embDone:false, hmTaken:false,
  lens:false, page:0, diaryRead:[false,false,false], scrapDone:false,
  pins:[null,null,null,null,null,null,null,null], copyTried:false, playing:false,
  songDone:false, rocking:false, stairOpen:false,
  dressSeen:false, pillow:0, deerPlaced:false
};
LEVELS.L6.ready = true;
LEVELS.L6.title = 'The Bedchamber';

Object.assign(ITEMS, {
  hmirror:{name:'Hand Mirror', usedIn:[6,7,8]}    // 抽屉里的手镜 · 本关读日记 · 第 7 关读契约背面 · 第 8 关雕像
});

/* ---------------- 音效 ---------------- */
const mbNote6 = (f, g=1)=>{ tone(f,1.2,'sine',.05*g); tone(f*2,.5,'sine',.014*g); tone(f*3,.22,'triangle',.008*g); };
const sour6 = ()=>{ tone(180,.6,'sawtooth',.03,150); tone(196,.6,'sawtooth',.02,170); };

/* ---------------- 刺绣：如同最后一夜那样燃烧（第 1 关吊灯 I · III · IV · VI） ---------------- */
function stitch6(i){
  if(S6.embDone || G.busy) return;
  S6.emb[i] ^= 1; sfx.tap(); tone(S6.emb[i] ? 880 : 520, .12, 'triangle', .02);
  const n = S6.emb.reduce((a,b)=>a+b,0);
  render();
  if(n < 4) return setCap(S6.emb[i] ? `你用金线把第 ${['I','II','III','IV','V','VI'][i]} 个小烛台的火苗绣亮了。` : '你拆掉了那一针。');
  if(S6.emb.join()===PATTERN.join()){
    S6.embDone = true; G.busy = true; updateAll();
    setCap('最后一针落下——绷架角上的金线猛地一紧。梳妆台那边「咔」的一声，抽屉弹开了。');
    sfx.clack(); setTimeout(sfx.open, 260);
    setTimeout(()=>{ G.busy=false; closeZoom(); tone(196,2,'sine',.05); setTimeout(()=>tone(247,1.8,'sine',.04),260);
      say('四支亮着，两支熄着——和石屋里那张字条上画的吊灯，一模一样。……原来那张字条，是母亲写的。', 7500); }, 2600);
    return;
  }
  G.busy = true; sfx.fail();
  setCap('绣到第四针时，金线「嘶」地一声，自己从布面上松脱了。');
  setTimeout(()=>{ S6.emb=[0,0,0,0,0,0]; G.busy=false; render(); setCap('线都松开了。边框上那行小字还在：「如同最后一夜那样燃烧。」——最后一夜，烧着的是哪几支？'); }, 1400);
}

/* ---------------- 音乐盒 ---------------- */
function playTune6(pins, then, gain=1){
  S6.playing = true; G.busy = true;
  const col = c => zsvg.querySelector('#z-col'+c);
  pins.forEach((r,c)=> setTimeout(()=>{
    if(c>0 && col(c-1)) col(c-1).setAttribute('opacity','0');
    if(col(c)) col(c).setAttribute('opacity','.4');
    if(r!=null) mbNote6(NOTE6[ROWS6[r]], gain); else noise(.05,3000,.02,3);
  }, c*430));
  setTimeout(()=>{ if(col(7)) col(7).setAttribute('opacity','0'); S6.playing=false; G.busy=false; then && then(); }, 8*430+500);
}
function judgeTune6(){
  const p = S6.pins.join(), ok = TUNE6.join(), rev = [...TUNE6].reverse().join();
  if(p===ok) return songSuccess6();
  if(p===rev){ S6.copyTried = true; sour6(); render();
    return setCap('一段古怪的旋律——每个音都在，可听起来就像是倒着放的。镜子那边，母亲的剪影捂住了耳朵。'); }
  if(S6.pins.some(v=>v==null)){ sfx.fail(); return setCap('曲子断断续续的，滚筒上还空着几格。'); }
  sour6(); setCap('旋律走了调，叮叮当当地散成了一片。' + (S6.mboxMirrorSeen ? '' : ' 原来的音钉是怎么排的？镜子里的那只音乐盒……'));
}
function songSuccess6(){
  S6.songDone = true; G.busy = true; render();
  setCap('……是这支歌。');
  setTimeout(()=>{ closeZoom(); S6.rocking = true; G.busy = true; updateAll();
    say('镜子里，母亲抬起了头，望向这边。……摇篮，自己摇了起来。', 6000);
    setTimeout(()=>playTune6(TUNE6, ()=>{ G.busy = true; }, .55), 600);
  }, 1800);
  setTimeout(()=>{
    showMemory('m6', ()=>{
      S6.rocking = false; S6.stairOpen = true; G.progress.L6 = true; updateAll();
      sfx.thud(); setTimeout(()=>noise(1.1,300,.08,.5), 200);
      say('摇篮停了下来，慢慢滑到一边。它底下的地板松开了——一道窄窄的暗梯，盘旋着通向楼下。', 7500);
    });
  }, 7600);
}

/* ---------------- 日记 ---------------- */
const DIARY6 = [
  ['收获月前夜。', '奥斯瓦尔德说，钟敲十二下的时候，', '乌鸦会来接她。', '我把哄她睡的那支歌，', '钉进了音乐盒里。'],
  ['我拆下了钟楼的齿轮，', '藏在汤姆的磨坊。', '马车会在磨坊边等她。', '……可埃德蒙告诉了他。'],
  ['他们把音乐盒的音钉全拔光了。', '可镜子还记得它原来的样子。', '', '', '它就是阿尔德里克。']
];
function diaryCombine6(){
  if(S6.scrapDone || !has('scrap')) return;
  G.busy = true;
  setTimeout(()=>{
    S6.scrapDone = true; take('scrap'); G.busy = false; sfx.pick(); render(); updateAll();
    setCap('这一页被撕掉了一角。你拿出石屋里那张烧焦的纸片，放进缺口——撕痕严丝合缝。「……别相信那只乌鸦。它就是阿尔德里克。」');
    setTimeout(()=>{ if(G.level==='L6') say('乌鸦……就是先祖阿尔德里克。', 5000); }, 400);
  }, 1200);
}

/* ---------------- 枕头（隐藏鸦羽：镜中歪向左 → 现实要歪向右） ---------------- */
function cyclePillow6(){
  S6.pillow = S6.pillow===0 ? -1 : S6.pillow===-1 ? 1 : 0; sfx.tap(); noise(.15,600,.04,1);
  render(); updateAll();
  if(S6.pillow===-1) return setCap(S6.mirrorSeen ? '你把枕头推歪了一点，和镜子里看到的一样。……真的一样吗？镜子里的左，是这边的哪一边？' : '你把枕头推歪了一点。');
  if(S6.pillow===1) return setCap(G.feathers.L6 ? '枕头歪向这一边。底下空空的。' : '枕头歪向这一边——和镜中那只，正好对上。枕头底下，露出了一根乌黑的羽毛。');
  setCap('你把枕头摆正了。');
}

/* ---------------- 场景动态层 ---------------- */
SCENES.L6 = function(){
  let s='';
  // 镜中世界
  const tx = MR6.x - MZ6.x*MS6.sx, ty = MR6.y - MZ6.y*MS6.sy;
  s+=`<g clip-path="url(#b6-clipMirror)"><g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${MS6.sx.toFixed(4)},${MS6.sy.toFixed(4)})">${mirrorWorld6({uid:'s', pillow:-1, up:S6.songDone})}</g>
    <path d="M${MR6.x-30},${MR6.y-40} Q${MR6.x-14},${MR6.y-58} ${MR6.x+6},${MR6.y-56}" stroke="#fff" stroke-width="3" fill="none" opacity=".18"/></g>
    <ellipse cx="${MR6.x}" cy="${MR6.y}" rx="${MR6.rx+30}" ry="${MR6.ry+30}" fill="url(#b6-mglow)"/>`;
  if(!S6.mirrorSeen) s+=`<ellipse cx="${MR6.x}" cy="${MR6.y}" rx="${MR6.rx+4}" ry="${MR6.ry+4}" fill="none" stroke="#efe6c8" stroke-width="1.4" class="pulse"/>`;
  // 刺绣上的六个小烛台
  for(let i=0;i<6;i++){ const x=45+i*19, y=436-(x-36)*9/110+19; s+=stitchCandle6(x, y, .55, S6.emb[i]); }
  // 抽屉
  if(S6.embDone){
    s+=`<g ${b6s}><polygon points="204,446 276,446 286,472 194,472" fill="#2a1e14"/><rect x="194" y="466" width="92" height="12" fill="#4a3424"/><circle cx="240" cy="472" r="2.4" fill="#a88a4e"/></g>`;
    if(!S6.hmTaken) s+=`<g transform="translate(240,458) rotate(-70) scale(.16)">${hmirrorArt6()}</g><circle cx="240" cy="460" r="14" fill="none" stroke="#efe6c8" stroke-width="1.2" class="pulse"/>`;
  }
  // 枕头 + 鸦羽
  s+=`<g transform="rotate(${S6.pillow*9} 566 446)"><rect x="520" y="436" width="92" height="22" rx="10" fill="#d8cfb8" ${b6s}/><path d="M530,446 q36,-6 72,0" stroke="#bdb196" stroke-width="1.4" fill="none"/></g>`;
  if(S6.pillow===1 && !G.feathers.L6) s+=`<path d="M604,458 Q618,450 634,434" stroke="#0e0c0a" stroke-width="2.6" fill="none"/>
      <path d="M610,454 l-4,-5 M616,450 l-4,-6 M622,445 l-3,-6 M612,454 l6,1 M618,449 l6,0 M624,444 l6,-1" stroke="#1d1915" stroke-width="1.6"/>
      <circle cx="620" cy="446" r="18" fill="none" stroke="#efe6c8" stroke-width="1.2" class="pulse"/>`;
  // 暗梯 + 摇篮
  if(S6.stairOpen){ const hp=`${CR6.x-56},${CR6.y-22} ${CR6.x+56},${CR6.y-22} ${CR6.x+72},${CR6.y+14} ${CR6.x-72},${CR6.y+14}`;
    s+=`<polygon points="${hp}" fill="#0c0a08" ${b6s}/>
      <path d="M${CR6.x-50},${CR6.y-12} H${CR6.x+50} M${CR6.x-58},${CR6.y-1} H${CR6.x+58} M${CR6.x-64},${CR6.y+8} H${CR6.x+64}" stroke="#2a221a" stroke-width="3"/>
      <ellipse cx="${CR6.x}" cy="${CR6.y-4}" rx="70" ry="22" fill="#ffc56e" opacity=".1"/>
      <polygon points="${hp}" fill="none" stroke="#efe6c8" stroke-width="2" class="pulse"/>`; }
  s+=`<g class="b6slide" style="transform:translateX(${S6.stairOpen?-92:0}px)"><g transform="translate(${CR6.x},${CR6.y})"><g class="${S6.rocking?'b6rock':''}">${cradleArt6({deer:false})}</g></g></g>`;
  s+=`<rect width="828" height="709" fill="url(#b6-vig)"/>`;
  document.getElementById('l6Dyn').innerHTML = s;
  document.getElementById('lvTitle').textContent = 'The Bedchamber';
};

/* ---------------- 场景点击 ---------------- */
const B6_FLAVOR = {
  tapestry:()=>'一幅雄鹿挂毯，雄鹿脚下绣着一朵玫瑰。针脚和角落里那副没绣完的刺绣一模一样——是母亲绣的。',
  window:()=>'窗外是雾湖。湖心那座孤塔的塔顶，亮着一点暗红的光——比在大厅里看到的，近多了。',
  chand:()=>'吊灯上的蜡烛一根都没点过，烛芯是白的。',
  rug:()=>'地毯的灰上有一串小小的脚印，从门口一直走到摇篮边。……是一双孩子的脚。'
};
document.getElementById('l6Obj').addEventListener('click', e=>{
  const g = e.target.closest('[data-obj]'); if(!g || G.busy || G.level!=='L6') return;
  const o = g.dataset.obj; sfx.tap();
  // 抽屉弹开后，手镜就在场景里：直接拿起
  if(S6.embDone && !S6.hmTaken && nearPt(svgPt(document.getElementById('l6Obj'), e), 240, 459, 22)){
    S6.hmTaken=true; give('hmirror'); sfx.pick(); updateAll();
    return say('一面小手镜，镜背镶着一圈珍珠。……和长廊画像里那个叫休的男孩手里举着的，一模一样。', 6000); }
  if(B6_FLAVOR[o]) return say(B6_FLAVOR[o]());
  if(o==='door') return goLevel('L5', '你沿着窄楼梯走下去，回到了长廊。');
  openZoom('l6_'+o);
});
function goStudy6(){
  if(LEVELS.L7 && LEVELS.L7.ready){ closeZoom(); return goLevel('L7', '你钻进摇篮下的暗梯。石阶又窄又陡，一圈一圈地往下……尽头是一扇小门，门缝里透出烛光。'); }
  enterLevel('L7');
}

/* ---------------- 记忆页 ⑥ 母亲的摇篮曲 ---------------- */
MEMORIES.m6 = {no:'⑥', title:'母亲的摇篮曲', moon:1, from:'L6', art:()=>memFrame(`
  <rect x="30" y="330" width="540" height="48" fill="#b9ab8b"/><path d="M30,330 H570" stroke="#2b251e" stroke-width="2"/>
  <path d="M70,330 V110 M120,330 V96 M420,330 V96 M470,330 V110 M70,190 H150 M380,190 H470 M70,270 H140 M390,270 H470" stroke="#b3a586" stroke-width="2"/>
  <g fill="#5e4e3a" stroke="#2b251e" stroke-width="3"><rect x="90" y="250" width="230" height="40"/><rect x="84" y="200" width="16" height="130"/><path d="M100,290 V330 M310,290 V330" stroke-width="6"/></g>
  <path d="M104,250 Q130,226 170,236 Q240,232 300,246 L300,252 L104,252 Z" fill="#cfc4a6" stroke="#2b251e" stroke-width="2"/>
  <ellipse cx="128" cy="238" rx="13" ry="10" fill="#2b251e"/>
  ${CH.sil('isabel', 326, 168, 1.12, {hold:'point', len:144}, true)}
  <g stroke="#2b251e" stroke-width="2.4" fill="none"><path d="M362,140 v-24 l14,-4 v22"/><circle cx="358" cy="141" r="4" fill="#2b251e"/><circle cx="372" cy="135" r="4" fill="#2b251e"/>
    <path d="M396,104 v-22"/><circle cx="392" cy="105" r="4" fill="#2b251e"/><path d="M420,120 v-20 l10,-3 v20"/><circle cx="416" cy="121" r="3.4" fill="#2b251e"/><circle cx="426" cy="117" r="3.4" fill="#2b251e"/></g>`, 1)};

/* ---------------- 提示（三级） ---------------- */
HINTS.L6 = function(){
  if(!S6.mirrorSeen) return ['这间屋子落满了灰，可梳妆台上那面镜子是亮的。','镜子里的房间，好像比这里早了很多年。','点开梳妆镜看看。'];
  if(!S6.embDone) return ['梳妆台的抽屉没有锁孔，一根金线从缝里牵向刺绣绷架。',
    '绷架上那些小烛台的样子，你在哪里见过。「如同最后一夜那样燃烧。」',
    '石屋的吊灯：只点 I、III、IV、VI 四支。点开刺绣绷架，照这个样子把烛火绣亮。'];
  if(!S6.hmTaken) return ['抽屉弹开了。','点开梳妆台，拿起抽屉里的东西。'];
  if(!S6.diaryRead.every(Boolean)) return ['梳妆台上摊着一本日记，字是反着写的。','手里的镜子，能把反字照正。','点开日记，点「用手镜照着读」，再翻完三页。'];
  if(!S6.songDone){
    if(!S6.mboxMirrorSeen) return ['日记里说：镜子还记得音乐盒原来的样子。','点开梳妆镜，再点镜中的那只音乐盒。','先记下镜中音钉的排法，再去插现实里的音乐盒。'];
    return ['镜子里的东西，是反过来的。','照抄会错：镜中最左边那一列，其实是曲子的最后一个音；连镜中的音名字母都是反写的。',
      '把镜中的图样左右翻转后再插。从左到右依次是：E、G、E、D、C、D、E、C，然后转动发条。'];
  }
  if(!S6.stairOpen) return ['听，摇篮在摇。'];
  return ['摇篮下面露出了一道暗梯。','点开摇篮，从暗梯下楼。'];
};

/* ---------------- 进入 ---------------- */
ON_ENTER.L6 = ()=>{
  updateAll();
  if(!S6.entered){ S6.entered=true;
    say('窄楼梯的尽头，是母亲的寝室。屋里落满了灰——自 1415 年起，这里再没人进来过。可梳妆台上那面镜子……镜子里，是亮着的。', 8000); }
  else say(S6.stairOpen ? '摇篮挪开了，暗梯还在那里。' : '屋里很静。镜子里的烛光还亮着。', 3200);
};

/* ---------------- 通关登记（调试起点用） ---------------- */
COMPLETE.L6 = ()=>{
  S5.doorOpen = true; take('skey');
  Object.assign(S6, {entered:true, mirrorSeen:true, mboxMirrorSeen:true, emb:[...PATTERN], embDone:true, hmTaken:true,
    lens:true, page:2, diaryRead:[true,true,true], scrapDone:true, pins:[...TUNE6], songDone:true, stairOpen:true});
  give('hmirror'); take('scrap'); G.progress.L6 = true; addMem('m6');
};

/* ---------------- 大厅联动：家族树 ---------------- */
(()=>{ const f = id => FAMILY.find(x=>x.id===id);
  if(f('isabel')) f('isabel').show = ()=>G.progress.L6;
  if(f('oswald')) f('oswald').show = ()=>G.progress.L6;
  if(f('aldric')) f('aldric').show = ()=>G.progress.L6 && S6.scrapDone;
})();
