/* =====================================================================
   自动存档：每次 updateAll() 都把全局状态写进 localStorage；刷新页面后自动续玩
   ·  ?start=<起点> 进入时不读档（并覆盖存档），用于调试 / 新游戏
   ·  读档时修复“刚好在演出中途存下”的状态，保证不会卡关（记忆页、开门等）
   ===================================================================== */
const SAVE_KEY = 'ravenhold-save-v1';
const SAVE_STATES = ()=>({S, S2, S3, S4, S5, S6, S7, S8});

function saveGame(){
  if(G.busy) return;               // 演出中途不存，等演出结束后的下一次 updateAll
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify({v:1, t:Date.now(),
      G:{level:G.level, progress:G.progress, feathers:G.feathers, memories:G.memories, inv:G.inv, hall:G.hall},
      st:SAVE_STATES()}));
  }catch(e){}
}
const _updateAll = updateAll;
updateAll = function(){ _updateAll(); saveGame(); };

function deepAssign(dst, src){
  for(const k in src){
    const v = src[k];
    if(v && typeof v==='object' && !Array.isArray(v) && dst[k] && typeof dst[k]==='object' && !Array.isArray(dst[k])) deepAssign(dst[k], v);
    else dst[k] = v;
  }
}
function hasSave(){ try{ return !!localStorage.getItem(SAVE_KEY); }catch(e){ return false; } }
function clearSave(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} }

function loadGame(){
  let d; try{ d = JSON.parse(localStorage.getItem(SAVE_KEY)); }catch(e){ return false; }
  if(!d || d.v!==1 || !d.G) return false;
  deepAssign(G, d.G);
  const st = SAVE_STATES(); for(const k in d.st) if(st[k]) deepAssign(st[k], d.st[k]);
  repairSave();
  G.busy = false; newItem = null; pruneInv();
  applyLevel(); updateAll();
  say('—— 继续上次的进度 ——', 2400);
  setTimeout(()=>{
    if(G.level==='L1' && !S.bookRead) return INTRO.L1();
    (ON_ENTER[G.level] || (()=>{}))();
  }, 2600);
  return true;
}

// 中断修复：某些关卡是“先改状态 → 演出 → 再收尾”，若恰好存在中间，这里补齐收尾
function repairSave(){
  // 一次性的演出态全部复位
  Object.assign(S3, {boiling:false, flash:false}); if(S3.brew==='boiling') S3.brew=null;
  S4.crowsFly = false;
  Object.assign(S6, {playing:false, rocking:false});
  Object.assign(S7, {spin:false, bellSwing:false}); if(!S7.struck) S7.wy = TW7.wTop;
  // 第 8 关：演出态复位；接雨到一半 → 直接接满；俯冲到一半 → 重新演一遍（ON_ENTER 处理）
  Object.assign(S8, {swoop:false, rising:false, revealing:false, shiver:false, hi:null, sel:null});
  if(S8.filling){ S8.filling = false; S8.cup = 'water'; }
  if(S8.cageOpen && !S8.ended) S8.ended = Object.values(G.feathers).every(Boolean) ? 'name' : 'break';
  if(S8.ended && S8.ended!=='loop') G.progress.L8 = true;
  // 各关收尾
  if(S.escaped){ G.progress.L1 = true; if(!has('fbook') && !G.progress.L8 && !S8.scattered) give('fbook'); }
  if(S2.confessRead){ G.progress.L2 = true; S2.doorOpen = true; }
  if(S3.potionDone){ G.progress.L3 = true; S3.tunnel = true; }
  if(S5.keyTaken) G.progress.L5 = true;
  if(S6.songDone){ S6.stairOpen = true; G.progress.L6 = true; }
  if(S7.pactBack && S7.letterRead.every(Boolean)){ G.progress.L7 = true; S7.doorOpen = true; }
  if(S7.struck){ S7.chestOpen = true; G.hall.drawbridgeDown = true; }
  // 已通关的关卡，记忆页一定在书里
  ['L1','L2','L3','L4','L5','L6','L7'].forEach((lv,i)=>{ const id='m'+(i+1); if(G.progress[lv] && MEMORIES[id]) addMem(id); });
}
