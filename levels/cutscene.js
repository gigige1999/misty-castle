/* =====================================================================
   过场动画（电影式）：参考图做底图，叠加镜头推移 / 雾 / 水流 / 麦浪 / 飞鸦 / 灯火，
   上下黑边 + 字幕 + 章节标题卡；可点「跳过」或按 Esc / 空格 / 回车跳过
   ·  L4 磨坊：第一次从地道进入磨坊时播放（参考图：磨坊外）
   ·  L5 长廊：第一次从大厅主楼梯走上二楼时播放（参考图：肖像长廊；黑暗中淡入，不开门）
   ·  L8 鸦塔：第一次走出城堡大门、踏上吊桥时播放（参考图：雾湖外观）
   ·  接入点：goLevel(id) 开头调用 cineTo(id)；返回 true 表示过场接管了切关
   ===================================================================== */
(function(){
const W = 1080, H = 717;

/* ---------------- 样式 ---------------- */
document.head.insertAdjacentHTML('beforeend', `<style>
  #cine{position:absolute;inset:0;z-index:70;background:#000;overflow:hidden;cursor:default;opacity:1;transition:opacity .9s ease;animation:cnIn .7s ease}
  @keyframes cnIn{from{opacity:0}to{opacity:1}}
  #cine.gone{opacity:0;pointer-events:none}
  #cine > svg{position:absolute;inset:0;width:100%;height:100%;display:block}
  #cine .cn-cam{transform-origin:0 0;will-change:transform}
  #cine .cn-fogA{animation:cnDrift 46s linear infinite}
  #cine .cn-fogB{animation:cnDrift 30s linear infinite reverse}
  @keyframes cnDrift{from{transform:translateX(0)}to{transform:translateX(-${W}px)}}
  #cine .cn-flap{transform-box:fill-box;transform-origin:50% 50%;animation:cnFlap .34s ease-in-out infinite alternate}
  @keyframes cnFlap{from{transform:scaleY(1)}to{transform:scaleY(-.55)}}
  #cine .cn-pulse{animation:cnPulse 3.2s ease-in-out infinite alternate}
  @keyframes cnPulse{from{opacity:.55}to{opacity:1}}
  #cine .cn-blink{animation:cnBlink 2.4s ease-in-out infinite}
  @keyframes cnBlink{0%,100%{opacity:.25}45%{opacity:1}60%{opacity:.85}}
  #cine .cn-fall{animation:cnFall .7s linear infinite}
  @keyframes cnFall{from{stroke-dashoffset:0}to{stroke-dashoffset:-60}}
  #cine .cn-spark{animation:cnSpark 1.9s ease-in-out infinite}
  @keyframes cnSpark{0%,100%{opacity:0}50%{opacity:.85}}
  .cn-bar{position:absolute;left:0;right:0;height:58px;background:#050403;z-index:3;transition:transform 1.4s cubic-bezier(.3,.7,.2,1)}
  .cn-bar.t{top:0;transform:translateY(-100%)} .cn-bar.b{bottom:0;transform:translateY(100%)}
  #cine.bars .cn-bar{transform:translateY(0)}
  .cn-door{position:absolute;top:0;bottom:0;width:50.5%;z-index:2;transition:transform 2.6s cubic-bezier(.55,.05,.25,1)}
  .cn-door.l{left:0;transform-origin:0 50%} .cn-door.r{right:0;transform-origin:100% 50%}
  #cine.open .cn-door.l{transform:perspective(900px) rotateY(78deg) translateX(-30%)}
  #cine.open .cn-door.r{transform:perspective(900px) rotateY(-78deg) translateX(30%)}
  .cn-cover{position:absolute;inset:0;z-index:2;background:#000;transition:opacity 3.2s ease}
  #cine.open .cn-cover{opacity:0}
  #cine .cn-candle{animation:cnCandle 2.6s ease-in-out infinite}
  @keyframes cnCandle{0%,100%{opacity:.85}18%{opacity:1}32%{opacity:.7}47%{opacity:.95}63%{opacity:.78}80%{opacity:1}}
  .cn-door::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,0) 40%,rgba(0,0,0,.35));pointer-events:none}
  .cn-door.r::after{transform:scaleX(-1)}
  .cn-sub{position:absolute;left:0;right:0;bottom:0;height:58px;z-index:4;display:flex;align-items:center;justify-content:center;
    color:#ddd3ba;font:italic 16px/1.6 Georgia,"Songti SC",serif;letter-spacing:1.2px;text-align:center;padding:0 80px;
    opacity:0;transition:opacity .7s ease;text-shadow:0 1px 6px #000}
  .cn-sub.show{opacity:1}
  .cn-sub.dark{bottom:auto;top:50%;height:auto;transform:translateY(-50%);font-size:17px;color:#b9ae94}
  .cn-title{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;
    color:#e8dfc6;text-shadow:0 2px 16px rgba(0,0,0,.95),0 0 40px rgba(0,0,0,.8);opacity:0;transition:opacity 1.4s ease}
  .cn-title.show{opacity:1}
  .cn-title small{font:13px Georgia,serif;letter-spacing:8px;color:#b8ab8c;margin-bottom:10px}
  .cn-title h2{margin:0;font:normal 46px/1.1 Georgia,"Palatino Linotype",serif;letter-spacing:4px;transition:letter-spacing 3.4s cubic-bezier(.2,.7,.2,1)}
  .cn-title.show h2{letter-spacing:9px}
  .cn-title i{display:block;width:0;height:1px;margin:14px 0 12px;background:linear-gradient(90deg,transparent,#c9bb98,transparent);transition:width 2s ease .4s}
  .cn-title.show i{width:300px}
  .cn-title p{margin:0;font:15px Georgia,"Songti SC",serif;letter-spacing:6px;color:#cfc3a4}
  .cn-shade{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(0,0,0,.15),rgba(0,0,0,.7));opacity:0;transition:opacity 1.6s}
  .cn-shade.show{opacity:1}
  .cn-black{position:absolute;inset:0;z-index:6;background:#000;opacity:0;pointer-events:none;transition:opacity 1.1s ease}
  .cn-black.show{opacity:1}
  .cn-skip{position:absolute;right:18px;top:16px;z-index:7;background:none;border:1px solid rgba(221,211,186,.35);color:#cfc5aa;
    font:12px Georgia,"Songti SC",serif;letter-spacing:2px;padding:4px 12px;cursor:pointer;opacity:0;transition:opacity .6s,background .2s}
  #cine.ready .cn-skip{opacity:.55} .cn-skip:hover{opacity:1!important;background:rgba(221,211,186,.12)}
  #cine .fx{z-index:5}
</style>`);

/* ---------------- 工具 ---------------- */
const f1 = v=> (+v).toFixed(1);
let seed = 7; const rnd = (a,b)=>{ seed = (seed*16807) % 2147483647; return a + (b-a)*(seed/2147483647); };
// 雾的贴图：画一次到 canvas，横向无缝；场景里两张拼接后平移，避免每帧跑滤镜
function fogTexture(h, n, alpha, tint){
  const c = document.createElement('canvas'); c.width = W; c.height = h; const g = c.getContext('2d');
  for(let i=0;i<n;i++){ const x=rnd(0,W), y=rnd(h*.2,h*.85), r=rnd(70,190), a=rnd(alpha*.4, alpha);
    for(const ox of [-W,0,W]){ const gr = g.createRadialGradient(x+ox,y,0,x+ox,y,r);
      gr.addColorStop(0,`rgba(${tint},${a})`); gr.addColorStop(1,`rgba(${tint},0)`);
      g.fillStyle = gr; g.beginPath(); g.ellipse(x+ox, y, r*1.9, r*.55, 0, 0, Math.PI*2); g.fill(); } }
  return c.toDataURL();
}
const fogLayer = (url, y, h, cls, op)=>`<g class="${cls}" opacity="${op}"><image href="${url}" x="0" y="${y}" width="${W}" height="${h}" preserveAspectRatio="none"/><image href="${url}" x="${W}" y="${y}" width="${W}" height="${h}" preserveAspectRatio="none"/></g>`;
// 飞鸟：沿路径飞，翅膀扇动
const bird = (path, dur, delay, sc=1, col='#1a1612')=>`<g><g transform="scale(${sc})"><g class="cn-flap"><path d="M-9,0 Q-4.5,-5 0,0 Q4.5,-5 9,0 Q4.5,-2 0,1.6 Q-4.5,-2 -9,0 Z" fill="${col}"/></g></g>
  <animateMotion dur="${dur}s" begin="${delay}s" fill="freeze" path="${path}"/></g>`;
// 波动：同一张底图在局部区域里做位移扰动（麦浪 / 水面），扰动噪声来回平移
const waveFilter = (id, bf, scale, dx, dur)=>`<filter id="${id}" x="-120" y="0" width="${W+240}" height="${H}" filterUnits="userSpaceOnUse">
  <feTurbulence type="fractalNoise" baseFrequency="${bf}" numOctaves="2" seed="${id.length*3}" result="n"/>
  <feOffset in="n" dx="0" result="o"><animate attributeName="dx" values="0;${dx};0" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></feOffset>
  <feDisplacementMap in="SourceGraphic" in2="o" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
const glow = (id, col)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity=".85"/><stop offset=".35" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
const FX = `<div class="fx"><div class="fx-grain"></div><div class="fx-flick"></div>
  <div class="fx-scratch"><i style="left:21%;animation-duration:6.8s"></i><i style="left:63%;animation-duration:9.1s;animation-delay:-3s"></i></div>
  <div class="fx-dust"><i style="left:14%;top:30%;width:2px;height:2px;animation-duration:4.4s"></i><i style="left:74%;top:58%;width:3px;height:2px;animation-duration:6.3s;animation-delay:-2s"></i><i style="left:42%;top:77%;width:2px;height:3px;animation-duration:5.1s;animation-delay:-4s"></i><i style="left:86%;top:22%;width:2.5px;height:2.5px;animation-duration:7.2s;animation-delay:-1s"></i></div>
  <div class="fx-vig"></div></div>`;

/* ---------------- 环境声 ---------------- */
function ambLoop(freq, q, type, gain, fadeIn=2.5){
  try{ const a = ac(), len = a.sampleRate*2, b = a.createBuffer(1,len,a.sampleRate), ch = b.getChannelData(0);
    for(let i=0;i<len;i++) ch[i] = Math.random()*2-1;
    const s = a.createBufferSource(); s.buffer = b; s.loop = true;
    const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const v = a.createGain(); v.gain.value = 0; v.gain.setTargetAtTime(gain, a.currentTime, fadeIn/3);
    s.connect(f); f.connect(v); v.connect(master); s.start();
    return ()=>{ try{ v.gain.setTargetAtTime(0, a.currentTime, .5); setTimeout(()=>s.stop(), 2500); }catch(e){} };
  }catch(e){ return ()=>{}; }
}
function drone(f, gain){
  try{ const a = ac(), o = a.createOscillator(), o2 = a.createOscillator(), v = a.createGain();
    o.type='sine'; o.frequency.value=f; o2.type='sine'; o2.frequency.value=f*1.503;
    v.gain.value = 0; v.gain.setTargetAtTime(gain, a.currentTime, 1.4);
    o.connect(v); o2.connect(v); v.connect(master); o.start(); o2.start();
    return ()=>{ try{ v.gain.setTargetAtTime(0, a.currentTime, .6); setTimeout(()=>{ o.stop(); o2.stop(); }, 3000); }catch(e){} };
  }catch(e){ return ()=>{}; }
}
const doorSfx = (wood)=>{ tone(wood?130:90, 1.8, 'sawtooth', .028, wood?70:50); noise(1.2, wood?380:240, .07, .7); setTimeout(()=>{ tone(48,.5,'sine',.14,36); noise(.3,200,.08,1); }, 2000); };

/* ---------------- 磨坊外 ---------------- */
function millSpec(){
  seed = 11;
  const fogA = fogTexture(260, 46, .16, '205,206,202'), fogB = fogTexture(200, 30, .12, '190,192,188');
  // 瀑布的水线
  let falls=''; for(let i=0;i<9;i++){ const x = 812+i*4.4; falls += `<path d="M${f1(x)},292 L${f1(x+1.5)},392" stroke="#e8ecea" stroke-width="${f1(rnd(.8,1.8))}" stroke-dasharray="${f1(rnd(10,22))} ${f1(rnd(14,30))}" opacity="${f1(rnd(.35,.7))}" class="cn-fall" style="animation-duration:${f1(rnd(.45,.8))}s"/>`; }
  let spray=''; for(let i=0;i<6;i++) spray += `<ellipse cx="${f1(818+rnd(-8,30))}" cy="${f1(392+rnd(-4,6))}" rx="${f1(rnd(10,20))}" ry="${f1(rnd(4,8))}" fill="#e6eae6" opacity=".45" class="cn-spark" style="animation-delay:${f1(-rnd(0,2))}s;animation-duration:${f1(rnd(1.2,2.2))}s" filter="url(#cnSoft)"/>`;
  return {
    img:'art/cutscenes/mill-outside.jpg', dur:16200, wood:false, doorColor:'#2a2722', doorAt:2600,
    defs:`${waveFilter('cnWheat','0.006 0.03',7,70,5.5)}${waveFilter('cnStream','0.004 0.05',5,90,3.2)}${glow('cnLamp','#ffcf7a')}
      <filter id="cnSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
      <clipPath id="cnWheatC"><path d="M520,500 L640,462 L780,446 L900,430 L1080,420 L1080,717 L560,717 Z"/></clipPath>
      <clipPath id="cnStreamC"><path d="M470,470 L560,452 L700,440 L760,446 L720,470 L560,500 L480,510 Z"/></clipPath>
      <clipPath id="cnFallC"><rect x="806" y="288" width="46" height="106"/></clipPath>`,
    over:(img)=>`
      <g clip-path="url(#cnWheatC)"><image href="${img}" width="${W}" height="${H}" preserveAspectRatio="none" filter="url(#cnWheat)"/></g>
      <g clip-path="url(#cnStreamC)"><image href="${img}" width="${W}" height="${H}" preserveAspectRatio="none" filter="url(#cnStream)"/></g>
      <g clip-path="url(#cnFallC)">${falls}</g>${spray}
      <circle cx="86" cy="300" r="46" fill="url(#cnLamp)" class="cn-pulse"/>
      ${fogLayer(fogA, 150, 260, 'cn-fogA', .9)}${fogLayer(fogB, 380, 200, 'cn-fogB', .7)}
      ${bird('M1000,260 Q940,230 880,250 T760,215 T600,180 T380,150', 9, 3.4, 1.1)}
      ${bird('M1040,300 Q980,270 920,290 T790,250 T640,210 T420,170', 9.6, 3.9, .9)}
      ${bird('M960,320 Q1000,290 1040,300 T1120,260', 4, 8.6, 1)}
      ${bird('M980,330 Q930,300 900,250 T860,160 T920,60', 5, 11.2, 1.2)}`,
    cam:[[0,330,210,1.62],[.2,340,215,1.55],[.42,690,310,1.3],[.6,720,330,1.24],[.78,190,430,1.32],[.9,520,360,1.05],[1,540,358,1.02]],
    lines:[[.3,'地道的尽头，是一扇小石门。你用肩膀顶开了它——',true],[3.4,'回头望去，渡鸦堡已经沉进了雾里。'],
      [6.9,'雾的另一头，是一座水磨坊。水车停着，麦子没人收。'],[10.2,'路边停着一辆马车——母亲当年安排的那一辆。']],
    title:[12.6,'CHAPTER  IV','The Watermill','灰麦村 · 水磨坊'],
    sound(t){ const s=[ambLoop(380,.6,'lowpass',.05), ambLoop(1100,.5,'bandpass',.03,4)];
      t(()=>sfx.caw(), 4200); t(()=>sfx.caw(), 5000); t(()=>sfx.caw(), 11600);
      return ()=>s.forEach(f=>f()); }
  };
}

/* ---------------- 雾湖外观 ---------------- */
function lakeSpec(){
  seed = 29;
  const fogA = fogTexture(220, 50, .2, '200,202,198'), fogB = fogTexture(180, 34, .14, '186,190,190');
  let sparks=''; for(let i=0;i<16;i++){ const y = rnd(400,560), x = 790+rnd(-22,22)*(1+(y-400)/160);
    sparks += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(rnd(6,18))}" height="1.4" fill="#e8e2c8" class="cn-spark" style="animation-delay:${f1(-rnd(0,2))}s;animation-duration:${f1(rnd(1.4,2.6))}s"/>`; }
  return {
    img:'art/cutscenes/lake-outside.jpg', dur:18200, wood:true, doorColor:'#33271c', doorAt:2700,
    defs:`${waveFilter('cnLake','0.003 0.045',6,110,6)}${glow('cnMoon','#efeedd')}${glow('cnRed','#ff3a22')}${glow('cnLamp','#ffcf7a')}
      <clipPath id="cnLakeC"><path d="M40,350 L640,350 L900,360 L960,420 L880,560 L600,600 L330,560 L300,480 L60,420 Z"/></clipPath>`,
    over:(img)=>`
      <g clip-path="url(#cnLakeC)"><image href="${img}" width="${W}" height="${H}" preserveAspectRatio="none" filter="url(#cnLake)"/></g>
      ${sparks}
      <circle cx="795" cy="133" r="78" fill="url(#cnMoon)" opacity=".5" class="cn-pulse"/>
      <g class="cn-blink"><circle cx="727" cy="246" r="20" fill="url(#cnRed)"/><circle cx="727" cy="246" r="2.4" fill="#ff6a48"/></g>
      <g class="cn-blink" style="animation-delay:-.6s" opacity=".5"><ellipse cx="727" cy="420" rx="4" ry="16" fill="url(#cnRed)"/></g>
      <circle cx="134" cy="352" r="40" fill="url(#cnLamp)" class="cn-pulse"/>
      ${fogLayer(fogA, 250, 220, 'cn-fogA', .95)}${fogLayer(fogB, 160, 180, 'cn-fogB', .55)}
      ${bird('M300,150 Q380,120 460,150 T620,170 T720,200 T740,180', 8.5, 7, 1.1, '#141210')}
      ${bird('M340,170 Q420,140 500,165 T650,185 T735,210', 8.2, 7.5, .9, '#141210')}
      ${bird('M360,120 Q440,100 520,130 T680,160 T760,175 T720,190', 9, 8.2, .8, '#141210')}`,
    cam:[[0,792,160,1.7],[.16,790,190,1.55],[.34,310,190,1.5],[.47,320,205,1.46],[.64,727,270,1.75],[.76,740,280,1.68],[.88,820,520,1.32],[1,560,380,1.03]],
    lines:[[.3,'门闩断成了两截。你推开城堡的大门——',true],[3.6,'雾湖上没有一丝风。月亮低低地挂着。'],
      [6.6,'身后，渡鸦堡立在悬崖上，所有的窗都黑着。'],[10.4,'湖心孤零零地立着一座塔。塔顶，有一点红光。'],[14,'吊桥一直伸进雾里。你踏了上去。']],
    title:[15.4,'FINAL  CHAPTER','The Raven Tower','雾湖 · 鸦塔'],
    sound(t){ const s=[ambLoop(300,.5,'lowpass',.06), drone(55,.035), ambLoop(700,.4,'bandpass',.012,5)];
      t(()=>{ sfx.caw(); setTimeout(sfx.caw, 500); }, 7400); t(()=>sfx.caw(), 11800);
      t(()=>{ tone(150,1.6,'sawtooth',.02,90); noise(.6,500,.04,.8); }, 14400);
      return ()=>s.forEach(f=>f()); }
  };
}

/* ---------------- 肖像长廊 ---------------- */
function gallerySpec(){
  seed = 47;
  const fogA = fogTexture(150, 34, .13, '170,176,186');
  // 月光里浮动的灰尘
  let motes=''; for(let i=0;i<26;i++){ const t=rnd(0,1), y=rnd(250,560), x=520+(y-250)*.62+rnd(-30,70)*(.4+t);
    motes += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rnd(.8,2))}" fill="#dfe4ea"><animate attributeName="cy" values="${f1(y)};${f1(y-rnd(14,40))};${f1(y)}" dur="${f1(rnd(6,11))}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;${f1(rnd(.35,.8))};0" dur="${f1(rnd(3,6))}s" begin="${f1(-rnd(0,5))}s" repeatCount="indefinite"/></circle>`; }
  return {
    img:'art/cutscenes/gallery.jpg', dur:16800, door:false, doorAt:2400,
    defs:`${glow('cnMoon','#dfe6ee')}${glow('cnLamp','#ffcf7a')}
      <linearGradient id="cnBeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfd8e2" stop-opacity=".34"/><stop offset=".6" stop-color="#b8c4d0" stop-opacity=".12"/><stop offset="1" stop-color="#b8c4d0" stop-opacity="0"/></linearGradient>
      <filter id="cnSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>`,
    over:()=>`
      <polygon points="506,262 582,236 790,560 610,606" fill="url(#cnBeam)" filter="url(#cnSoft)" class="cn-pulse" style="mix-blend-mode:screen;animation-duration:5s"/>
      ${motes}
      <circle cx="541" cy="281" r="64" fill="url(#cnMoon)" opacity=".55" class="cn-pulse"/>
      <g class="cn-candle"><circle cx="17" cy="290" r="150" fill="url(#cnLamp)" opacity=".22"/><circle cx="17" cy="284" r="34" fill="url(#cnLamp)"/></g>
      <circle cx="757" cy="232" r="10" fill="url(#cnMoon)" class="cn-spark" style="animation-duration:3.4s;animation-delay:-1s"/>
      ${fogLayer(fogA, 520, 150, 'cn-fogA', .7)}`,
    cam:[[0,541,300,1.75],[.14,541,310,1.62],[.34,190,250,1.5],[.5,330,300,1.4],[.66,790,390,1.62],[.78,860,300,1.55],[1,540,358,1.02]],
    lines:[[.3,'你踩着吱呀作响的主楼梯，走上了二楼——',true],[3.3,'长廊没有点灯。只有尽头那扇窗里，透进一点月光。'],
      [6.4,'左墙上挂满了家族画像。画里的人，都望着长廊的尽头。'],[10,'盔甲立在拱门边，握着长矛。旁边那面暗红的旗上，是一头雄鹿。']],
    title:[13.2,'CHAPTER  V','The Gallery','二楼 · 肖像长廊'],
    sound(t){ const s=[ambLoop(260,.5,'lowpass',.05), drone(49,.025), ambLoop(900,6,'bandpass',.01,5)];
      [200,780,1360,1940].forEach((ms,i)=>t(()=>{ tone(80-i*3,.22,'sine',.12,55); noise(.12,600,.05,2); if(i%2) tone(210,.5,'sawtooth',.012,150); }, ms));
      t(()=>{ tone(110,1.4,'sawtooth',.012,80); }, 11200);
      return ()=>s.forEach(f=>f()); }
  };
}

const SPECS = { L4:{ when:()=>!S4.entered, make:millSpec }, L5:{ when:()=>!S5.entered, make:gallerySpec }, L8:{ when:()=>!S8.entered, make:lakeSpec } };
// 预加载底图
['art/cutscenes/mill-outside.jpg','art/cutscenes/lake-outside.jpg','art/cutscenes/gallery.jpg'].forEach(src=>{ const i = new Image(); i.src = src; });

/* ---------------- 播放 ---------------- */
function play(spec, onBlack, onEnd){
  const app = document.getElementById('app');
  const old = document.getElementById('cine'); if(old) old.remove();
  const el = document.createElement('div'); el.id = 'cine';
  const camT = (x,y,s)=>{ const hw=W/2/s, hh=H/2/s; x=Math.min(W-hw, Math.max(hw, x)); y=Math.min(H-hh, Math.max(hh, y));
    return `translate(${f1(W/2 - x*s)}px,${f1(H/2 - y*s)}px) scale(${s})`; };
  const doorBg = c=> spec.wood
    ? `background:repeating-linear-gradient(90deg,${c} 0 34px,#21180f 34px 36px,${c} 36px 70px),${c}`
    : `background:repeating-linear-gradient(0deg,${c} 0 46px,#191714 46px 48px),${c}`;
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${spec.defs}</defs>
      <g class="cn-cam" style="transform:${camT(spec.cam[0][1],spec.cam[0][2],spec.cam[0][3])}">
        <image href="${spec.img}" width="${W}" height="${H}" preserveAspectRatio="none"/>${spec.over(spec.img)}</g></svg>
    <div class="cn-shade"></div>
    ${spec.door===false ? `<div class="cn-cover"></div>` : `<div class="cn-door l" style="${doorBg(spec.doorColor)}"></div><div class="cn-door r" style="${doorBg(spec.doorColor)}"></div>`}
    <div class="cn-bar t"></div><div class="cn-bar b"></div>
    <div class="cn-sub"></div>
    <div class="cn-title"><small>${spec.title[1]}</small><h2>${spec.title[2]}</h2><i></i><p>${spec.title[3]}</p></div>
    ${FX}<div class="cn-black"></div><button class="cn-skip">跳过 ›</button>`;
  app.appendChild(el);
  const $ = s=> el.querySelector(s), timers = [], t = (fn, ms)=> timers.push(setTimeout(fn, ms));
  const cam = $('.cn-cam'), sub = $('.cn-sub');
  const stopSound = spec.sound(t);
  // 镜头：开门之后才开始推
  const camAnim = cam.animate(spec.cam.map(([o,x,y,s])=>({offset:o, transform:camT(x,y,s), easing:'cubic-bezier(.45,.05,.4,1)'})),
    {duration: spec.dur - spec.doorAt, delay: spec.doorAt, fill:'both'});
  // 开门
  t(()=>{ el.classList.add('open'); if(spec.door!==false) doorSfx(spec.wood); }, spec.doorAt - 400);
  t(()=>el.classList.add('bars'), spec.doorAt + 600);
  // 字幕
  spec.lines.forEach(([s, text, dark], i)=>{
    t(()=>{ sub.classList.remove('show'); t(()=>{ sub.textContent = text; sub.classList.toggle('dark', !!dark); sub.classList.add('show'); }, 380); }, s*1000);
    const next = spec.lines[i+1] ? spec.lines[i+1][0]*1000 : spec.title[0]*1000;
    t(()=> sub.classList.remove('show'), next - 420);
  });
  t(()=>{ $('.cn-shade').classList.add('show'); $('.cn-title').classList.add('show'); tone(196,2.4,'sine',.03); tone(294,2.4,'sine',.018); }, spec.title[0]*1000);
  t(()=> el.classList.add('ready'), 900);
  let ended = false;
  const finish = (fast)=>{
    if(ended) return; ended = true; timers.forEach(clearTimeout);
    $('.cn-black').style.transitionDuration = fast ? '.5s' : '1.1s';
    $('.cn-black').classList.add('show'); stopSound();
    removeEventListener('keydown', onKey, true);
    setTimeout(()=>{
      camAnim.cancel(); onBlack && onBlack();
      el.querySelector('svg').remove();
      requestAnimationFrame(()=>{ el.classList.add('gone'); });
      setTimeout(()=>{ el.remove(); onEnd && onEnd(); }, 950);
    }, fast ? 550 : 1150);
  };
  const onKey = e=>{ if(['Escape',' ','Enter'].includes(e.key) && el.classList.contains('ready')){ e.preventDefault(); e.stopPropagation(); sfx.tap(); finish(true); } };
  addEventListener('keydown', onKey, true);
  $('.cn-skip').addEventListener('click', e=>{ e.stopPropagation(); sfx.tap(); finish(true); });
  t(()=>finish(false), spec.dur);
}

// 切关时由 goLevel 调用：需要过场 → 播放过场，黑屏时完成切关，结束后执行进入回调
window.cineTo = function(id, onEnter){
  const S_ = SPECS[id]; if(!S_ || !S_.when()) return false;
  G.busy = true; if(typeof closeZoom==='function' && cur) closeZoom();
  play(S_.make(), ()=>{ G.level = id; pruneInv(); applyLevel(); updateAll(); },
    ()=>{ G.busy = false; if(window.saveGame) saveGame(); (onEnter || ON_ENTER[id] || (()=>{}))(); });
  return true;
};
// 调试：在控制台 CINE.play('L4') / CINE.play('L8') 单独预览过场（不切关）
window.CINE = { play:id=> SPECS[id] && play(SPECS[id].make()) };
})();
