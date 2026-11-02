/* =====================================================================
   开始菜单：雾湖 · 鸦塔 · 吊桥
   ·  背景：art/ui/menu-bg.jpg（由 参考图/场景/开始页面.png 转存）
   ·  叠加动效：缓慢推镜、三层湖雾漂移、月晕呼吸、湖面月光碎影、提灯与塔窗烛光、
                渡鸦掠过、枯叶飘落，外加胶片颗粒 / 划痕 / 曝光闪烁（与入场 Loading 同一套质感）
   ·  选项：继续旅程（有存档时，显示章节与存档时间）/ 新的旅程（有存档时二次确认）/ 声音开关
   ·  入场 Loading 结束后由 LOADER 调用 MENU.open(boot)；带 ?start= 进入时整个菜单不出现
   ===================================================================== */
(function(){
const el = document.getElementById('menu');
if(!el) return;
const IMG = 'art/ui/menu-bg.jpg';
const SAVE_KEY = 'ravenhold-save-v1';
const f1 = v => (+v).toFixed(1);
let seed = 11; const rnd = (a,b)=>{ seed = (seed*16807) % 2147483647; return a + (seed/2147483647)*(b-a); };

const MENU = window.MENU = { imgReady:false, open };
const pre = new Image();
pre.onload = pre.onerror = ()=>{ MENU.imgReady = true; };
pre.src = IMG;

/* 参考图（按 1080×720 量的坐标）→ 画面坐标：图片铺在 (-20,-14) 1120×746.7，顺带裁掉原图自带的黑边 */
const K = 1120/1080, P = (x,y)=>[-20 + x*K, -14 + y*K];
const [moonX, moonY] = P(795,133), [lampX, lampY] = P(136.6,351), [twX, twY] = P(719,255), [refX] = P(790,0);

/* ---------------- 动效图层 ---------------- */
// 湖面月光碎影：越靠近岸越宽
let shim = '';
for(let i=0;i<11;i++){ const y = 430 + i*7.2 + rnd(-1.5,1.5), w = 10 + i*3.4 + rnd(-3,5), x = refX - w/2 + rnd(-8,8);
  shim += `<rect class="mn-shim" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="1.7" rx=".8" fill="#efe6cc" style="animation-delay:${f1(-rnd(0,3))}s;animation-duration:${f1(rnd(1.8,3.4))}s"/>`; }

const bird = (y, s, dur, delay) => `<g class="mn-bird" style="animation-duration:${dur}s;animation-delay:${delay}s"><g transform="translate(0,${y}) scale(${s})">
  <path class="ld-wing" d="M-9,0 Q-5,-6 0,0 Q5,-6 9,0" stroke="#15130f" stroke-width="1.9" fill="none" stroke-linecap="round" style="animation-duration:.52s"/>
  <ellipse cx="0" cy=".6" rx="1.9" ry="1.15" fill="#15130f"/></g></g>`;
const birds = bird(168,.95,38,-6) + bird(204,.7,46,-24) + bird(142,.6,57,-41);

const leaf = (x, y, dur, delay, dx, c) => `<g class="mn-leaf" style="--dx:${dx}px;animation-duration:${dur}s;animation-delay:${delay}s">
  <g transform="translate(${x},${y})"><g class="mn-leaf-r" style="animation-duration:${f1(dur/6)}s">
  <path d="M0,-4.5 Q3.4,-1 0,4.5 Q-3.4,-1 0,-4.5 Z M0,-4.5 V5.5" fill="${c}" stroke="#2a1a12" stroke-width=".5"/></g></g></g>`;
const leaves = leaf(126,176,17,-2,190,'#6b2c1f') + leaf(176,146,21,-9,240,'#5a3a22') + leaf(96,214,15,-12,150,'#7a3424') + leaf(212,192,24,-17,280,'#4f3320');

const scene = `<defs>
    <radialGradient id="mnFogG"><stop offset="0" stop-color="#d4d7d3" stop-opacity=".75"/><stop offset=".55" stop-color="#c3c8c6" stop-opacity=".3"/><stop offset="1" stop-color="#b9bebd" stop-opacity="0"/></radialGradient>
    <radialGradient id="mnMoonG"><stop offset=".18" stop-color="#f7efd6" stop-opacity=".55"/><stop offset=".45" stop-color="#e9e2c8" stop-opacity=".18"/><stop offset="1" stop-color="#e9e2c8" stop-opacity="0"/></radialGradient>
    <radialGradient id="mnWarmG"><stop offset="0" stop-color="#ffd890" stop-opacity=".85"/><stop offset=".35" stop-color="#f7b65c" stop-opacity=".32"/><stop offset="1" stop-color="#f0a040" stop-opacity="0"/></radialGradient>
    <linearGradient id="mnTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a09" stop-opacity=".72"/><stop offset="1" stop-color="#0b0a09" stop-opacity="0"/></linearGradient>
    <linearGradient id="mnBot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a09" stop-opacity="0"/><stop offset="1" stop-color="#0b0a09" stop-opacity=".6"/></linearGradient>
  </defs>
  <g class="mn-scene">
    <image href="${IMG}" x="-20" y="-14" width="1120" height="746.7" preserveAspectRatio="xMidYMid slice"/>
    <circle class="mn-halo" cx="${f1(moonX)}" cy="${f1(moonY)}" r="150" fill="url(#mnMoonG)"/>
    <circle class="mn-halo h2" cx="${f1(moonX)}" cy="${f1(moonY)}" r="58" fill="url(#mnMoonG)"/>
    ${birds}
    <g class="mn-fog f1"><ellipse cx="260" cy="336" rx="430" ry="38" fill="url(#mnFogG)" opacity=".55"/><ellipse cx="930" cy="352" rx="400" ry="30" fill="url(#mnFogG)" opacity=".5"/></g>
    <g class="mn-fog f2"><ellipse cx="600" cy="378" rx="380" ry="24" fill="url(#mnFogG)" opacity=".42"/><ellipse cx="80" cy="398" rx="260" ry="20" fill="url(#mnFogG)" opacity=".35"/></g>
    ${shim}
    <rect class="mn-twin" x="${f1(twX-2.2)}" y="${f1(twY-5.5)}" width="4.4" height="11" rx="2.2" fill="#f2c26a"/>
    <circle class="mn-twin" cx="${f1(twX)}" cy="${f1(twY)}" r="16" fill="url(#mnWarmG)"/>
    <circle class="mn-lamp" cx="${f1(lampX)}" cy="${f1(lampY)}" r="62" fill="url(#mnWarmG)"/>
    <ellipse class="mn-lamp l2" cx="${f1(lampX)}" cy="${f1(lampY+1)}" rx="6" ry="10" fill="#ffe2a0"/>
    ${leaves}
    <g class="mn-fog f3"><ellipse cx="380" cy="668" rx="560" ry="70" fill="url(#mnFogG)" opacity=".3"/><ellipse cx="1040" cy="700" rx="420" ry="60" fill="url(#mnFogG)" opacity=".26"/></g>
  </g>
  <rect width="1080" height="250" fill="url(#mnTop)"/>
  <rect y="520" width="1080" height="197" fill="url(#mnBot)"/>`;

const FX = `<div class="fx"><div class="fx-grain"></div><div class="fx-flick"></div>
  <div class="fx-scratch"><i style="left:18%;animation-duration:7.3s"></i><i style="left:57%;animation-duration:5.1s;animation-delay:-2.2s"></i><i style="left:84%;animation-duration:9.4s;animation-delay:-6s"></i></div>
  <div class="fx-dust">${[...Array(9)].map(()=>`<i style="left:${f1(rnd(4,96))}%;top:${f1(rnd(4,96))}%;width:${f1(rnd(1.5,3.5))}px;height:${f1(rnd(1.5,3.5))}px;animation-duration:${f1(rnd(3,8))}s;animation-delay:${f1(-rnd(0,8))}s"></i>`).join('')}</div>
  <div class="fx-vig"></div></div>`;

el.innerHTML = `<svg class="mn-bg" viewBox="0 0 1080 717" preserveAspectRatio="xMidYMid slice">${scene}</svg>
  ${FX}
  <div class="mn-ui">
    <div class="mn-title">
      <small>A TALE IN EIGHT CHAMBERS</small>
      <h1>RAVENHOLD</h1>
      <div class="mn-rule"><span></span><svg viewBox="0 0 60 60"><use href="#sym-moon"/></svg><span></span></div>
      <h2>迷雾城堡</h2>
    </div>
    <nav class="mn-list"></nav>
    <div class="mn-foot l">Anno MCDXV</div>
    <div class="mn-foot r">Vol. I</div>
    <div class="mn-tip">↑ ↓ 选择 · Enter 确认</div>
  </div>`;
const list = el.querySelector('.mn-list');

/* ---------------- 存档信息 ---------------- */
const ROMAN = ['','I','II','III','IV','V','VI','VII','VIII'];
function readSave(){
  let d = null; try{ d = JSON.parse(localStorage.getItem(SAVE_KEY)); }catch(e){}
  if(!d || d.v!==1 || !d.G) return null;
  const lv = d.G.level || 'L1', L = (typeof LEVELS!=='undefined' && LEVELS[lv]) || null;
  const where = lv==='hall' ? '灰烬大厅' : `第 ${ROMAN[+lv.slice(1)] || lv} 章 · ${L ? L.cn : lv}`;
  const done = Object.values(d.G.progress || {}).filter(Boolean).length;
  let when = '';
  if(d.t){ const t = new Date(d.t), z = n => String(n).padStart(2,'0');
    when = `${t.getMonth()+1}月${t.getDate()}日 ${z(t.getHours())}:${z(t.getMinutes())}`; }
  return { where, done, when };
}

/* ---------------- 菜单项 ---------------- */
const soundIsOn = ()=> typeof soundOn==='undefined' ? true : soundOn;
function item(act, label, sub, cls=''){
  return `<button class="mn-item ${cls}" data-act="${act}"><b>${label}</b>${sub?`<small>${sub}</small>`:''}</button>`;
}
function renderMain(again){
  const sv = readSave();
  list.className = 'mn-list' + (again ? ' again' : '');
  list.innerHTML = (sv
      ? item('continue', '继续旅程', [sv.where, `已解开 ${sv.done} / 8`, sv.when].filter(Boolean).join(' · '), 'primary') + item('new', '新的旅程')
      : item('new', '开始旅程', '你在一间陌生的石屋里醒来……', 'primary'))
    + item('sound', `声音 · ${soundIsOn() ? '开' : '关'}`, '', 'minor');
}
function renderConfirm(){
  list.className = 'mn-list confirm';
  list.innerHTML = `<p class="mn-warn">开始新的旅程，会抹去现有的进度。<br><span>渡鸦不会替你记得。</span></p>`
    + item('new-yes', '抹去并重新开始', '', 'danger') + item('back', '返回', '', 'minor');
  setTimeout(()=>{ const b = list.querySelector('[data-act="back"]'); b && b.focus(); }, 30);
}

let bootFn = null, active = false, readyAt = 0;
function open(boot){
  bootFn = boot;
  renderMain();
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('live');
  active = true; readyAt = performance.now() + 1100;   // 防止「进入 Loading 的那一下点击 / 回车」顺带触发菜单
}
function start(mode){
  if(!active) return;
  active = false;
  try{ sfx.chime(); }catch(e){}
  el.classList.add('leave');
  setTimeout(()=>{
    try{ bootFn && bootFn(mode); }catch(e){ console.error(e); }
    el.classList.add('out');
  }, 650);
  setTimeout(()=> el.remove(), 2600);
}
list.addEventListener('click', e=>{
  const b = e.target.closest('.mn-item');
  if(!b || !active || performance.now() < readyAt) return;
  const act = b.dataset.act;
  if(act==='continue') return start('continue');
  if(act==='new'){
    if(readSave()){ try{ sfx.tap(); }catch(e){} return renderConfirm(); }
    return start('new');
  }
  if(act==='new-yes') return start('new');
  if(act==='back'){ try{ sfx.tap(); }catch(e){} renderMain(true); const f = list.querySelector('.mn-item'); f && f.focus(); return; }
  if(act==='sound'){
    const on = !soundIsOn();
    if(typeof setSound==='function') setSound(on);
    b.querySelector('b').textContent = `声音 · ${on ? '开' : '关'}`;
    if(on) try{ sfx.tap(); }catch(e){}
  }
});
addEventListener('keydown', e=>{
  if(!active || performance.now() < readyAt) return;
  const items = [...list.querySelectorAll('.mn-item')];
  if(!items.length) return;
  const i = items.indexOf(document.activeElement);
  if(e.key==='ArrowDown' || e.key==='ArrowUp'){
    e.preventDefault();
    const d = e.key==='ArrowDown' ? 1 : -1;
    items[i<0 ? (d>0 ? 0 : items.length-1) : (i + d + items.length) % items.length].focus();
  } else if(e.key==='Enter' && i<0){
    e.preventDefault(); items[0].click();
  } else if(e.key==='Escape' && list.classList.contains('confirm')){
    renderMain(true);
  }
});
})();
