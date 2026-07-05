/* ══════════════════════════════════════════════════════════════
   DYAD MODEL — the parent+child pair, stored LOCAL-FIRST.
   Adaptive Arc v1 (raw/prds/0001-adaptive-arc-v1.md §2).

   HARD RULE: this data NEVER leaves the device. There is no fetch,
   XHR, sendBeacon, or any network call in this file — only
   localStorage, a local FileReader (import), and a Blob download
   (export). No name is ever collected.
   ══════════════════════════════════════════════════════════════ */
(function(){
  const KEY='lo.dyad.v1', DISMISS='lo.dyad.dismissed';
  const DOMAINS=['focus','perspective','communicating','connections','critical-thinking','challenges','self-directed'];
  const SESSION_GAP=30*60*1000;                 // 30 min inactivity = new session
  let profile=null;

  const todayISO = ()=> new Date().toISOString().slice(0,10);

  function blankProfile(setup){
    const domains={}; DOMAINS.forEach(d=>domains[d]={exposure:0,engagement:0});
    return {
      v:1,
      child:{ birthMonth:setup.birthMonth||null, languages:setup.languages||[], cultures:setup.cultures||[] },
      phase:'discovery', startedAt:todayISO(), autonomy:'auto',
      sessions:0, lastActivity:null,
      signals:{}, domains,
      adult:{ companionOpens:0, cueDwells:0, promptsAnswered:0, promptsSkipped:0 },
      prompts:{ lastShown:null, shownThisWeek:0, weekStart:todayISO(), answered:[] }
    };
  }

  function load(){ try{ const raw=localStorage.getItem(KEY); profile=raw?JSON.parse(raw):null; }catch(e){ profile=null; } return profile; }
  function save(){ if(!profile) return; try{ localStorage.setItem(KEY, JSON.stringify(profile)); }catch(e){} }
  function exists(){ return !!profile; }
  function get(){ return profile; }
  function update(fn){ if(!profile) return; try{ fn(profile); }catch(e){} save(); }
  function reset(){ profile=null; try{ localStorage.removeItem(KEY); }catch(e){} }

  /* ---- signals ---- */
  function sig(id){
    if(!profile||!id) return null;
    if(!profile.signals[id]) profile.signals[id]={opens:0,completes:0,taps:0,repeats:0,hearts:0,tooEarly:0,lastSeen:null};
    return profile.signals[id];
  }
  function bumpSignal(id,key,n){ const s=sig(id); if(!s) return; s[key]=(s[key]||0)+(n||1); s.lastSeen=todayISO(); save(); }
  function bumpDomain(d,key,n){ if(!profile||!d) return; if(!profile.domains[d]) profile.domains[d]={exposure:0,engagement:0}; profile.domains[d][key]=(profile.domains[d][key]||0)+(n||1); save(); }
  function bumpAdult(key,n){ if(!profile) return; profile.adult[key]=(profile.adult[key]||0)+(n||1); save(); }

  /* ---- sessions / activity ---- */
  function recordActivity(){
    if(!profile) return;
    const now=Date.now();
    if(!profile.lastActivity || (now-profile.lastActivity)>SESSION_GAP) profile.sessions=(profile.sessions||0)+1;
    profile.lastActivity=now; save();
  }

  /* ---- age ---- */
  function ageMonths(){
    if(!profile||!profile.child.birthMonth) return null;
    const p=profile.child.birthMonth.split('-').map(Number);
    const now=new Date();
    return (now.getFullYear()-p[0])*12 + ((now.getMonth()+1) - p[1]);
  }
  function ageBand(mo){
    const a=(mo==null)?ageMonths():mo; if(a==null) return null;
    if(a<12) return '6-12m'; if(a<24) return '12-24m'; if(a<36) return '2-3y'; if(a<48) return '3-4y'; return '4-5y';
  }

  /* ---- phase (auto-advance discovery → calibration only) ---- */
  function phase(){
    if(!profile) return null;
    if(profile.phase==='discovery'){
      const started=new Date(profile.startedAt+'T00:00:00').getTime();
      const days=(Date.now()-started)/864e5;
      if(days>=14 && (profile.sessions||0)>=6){ profile.phase='calibration'; save(); }
    }
    return profile.phase;
  }

  /* ---- export / import (local only) ---- */
  function exportProfile(){
    if(!profile) return;
    const blob=new Blob([JSON.stringify(profile,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='little-one-profile.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function importProfile(file, cb){
    const r=new FileReader();
    r.onload=()=>{ try{ const p=JSON.parse(r.result); if(p && p.v===1 && p.child){ profile=p; save(); cb&&cb(true); } else cb&&cb(false); }catch(e){ cb&&cb(false); } };
    r.onerror=()=>cb&&cb(false);
    r.readAsText(file);
  }

  /* ---- setup / settings UI (birth month + languages + cultures; NO name) ---- */
  function dismissed(){ try{ return localStorage.getItem(DISMISS)==='1'; }catch(e){ return false; } }
  function setDismissed(){ try{ localStorage.setItem(DISMISS,'1'); }catch(e){} }
  function clearDismissed(){ try{ localStorage.removeItem(DISMISS); }catch(e){} }

  function openSetup(onDone){
    if(document.getElementById('dyadModal')) return;
    const wrap=document.createElement('div'); wrap.id='dyadModal'; wrap.className='dyad-modal';
    wrap.innerHTML=
      '<div class="dyad-card">'+
      '<h2>Make it hers</h2>'+
      '<p class="dyad-sub">A few gentle details so the stories and games grow with her. This stays on <b>your device</b> — never uploaded, and we never ask her name.</p>'+
      '<label>When was she born?</label><input type="month" id="dyadBirth">'+
      '<label>Languages you speak at home</label><input type="text" id="dyadLangs" placeholder="e.g. English, Hindi">'+
      '<label>Traditions or cultures <span class="opt">(optional)</span></label><input type="text" id="dyadCultures" placeholder="optional">'+
      '<div class="dyad-actions"><button class="dyad-skip" id="dyadSkip">Not now</button><button class="dyad-save" id="dyadSave">Save 💛</button></div>'+
      '</div>';
    document.body.appendChild(wrap);
    document.getElementById('dyadSkip').onclick=()=>{ setDismissed(); wrap.remove(); onDone&&onDone(false); };
    document.getElementById('dyadSave').onclick=()=>{
      const birth=document.getElementById('dyadBirth').value||null;
      const langs=(document.getElementById('dyadLangs').value||'').split(',').map(s=>s.trim()).filter(Boolean);
      const cults=(document.getElementById('dyadCultures').value||'').split(',').map(s=>s.trim()).filter(Boolean);
      profile=blankProfile({birthMonth:birth, languages:langs, cultures:cults}); save(); clearDismissed();
      wrap.remove(); onDone&&onDone(true);
    };
  }

  function openSettings(){
    if(document.getElementById('dyadModal')) return;
    const p=profile;
    const wrap=document.createElement('div'); wrap.id='dyadModal'; wrap.className='dyad-modal';
    wrap.innerHTML=
      '<div class="dyad-card">'+
      '<h2>For grown-ups</h2>'+
      '<p class="dyad-sub">'+(p?'Her journey lives only on this device.':'No profile yet on this device.')+' Nothing is ever uploaded.</p>'+
      (p?('<p class="dyad-sub">Age: ~'+(ageMonths()!=null?ageMonths()+' months':'—')+' · Languages: '+((p.child.languages||[]).join(', ')||'—')+' · Phase: '+p.phase+'</p>'):'')+
      '<p class="dyad-msg" id="dyadMsg" hidden></p>'+
      '<div class="dyad-actions" style="flex-wrap:wrap;">'+
        (p?'<button class="dyad-skip" id="dyadExport">Export</button>':'')+
        '<button class="dyad-skip" id="dyadImportBtn">Import</button>'+
        '<input type="file" id="dyadImportFile" accept="application/json" hidden>'+
        (p?'':'<button class="dyad-save" id="dyadSetup2">Set up</button>')+
        (p?'<button class="dyad-skip" id="dyadReset">Start over</button>':'')+
        '<button class="dyad-save" id="dyadClose">Done</button>'+
      '</div></div>';
    document.body.appendChild(wrap);
    const close=()=>wrap.remove();
    const msg=(t)=>{ const m=document.getElementById('dyadMsg'); if(m){ m.textContent=t; m.hidden=false; } };
    document.getElementById('dyadClose').onclick=close;
    const exp=document.getElementById('dyadExport'); if(exp) exp.onclick=exportProfile;
    const s2=document.getElementById('dyadSetup2'); if(s2) s2.onclick=()=>{ close(); openSetup(saved=>{ if(saved) location.reload(); }); };
    const rst=document.getElementById('dyadReset'); if(rst) rst.onclick=()=>{ reset(); clearDismissed(); close(); location.reload(); };
    const impBtn=document.getElementById('dyadImportBtn'), impFile=document.getElementById('dyadImportFile');
    impBtn.onclick=()=>impFile.click();
    impFile.onchange=()=>{ const f=impFile.files[0]; if(f) importProfile(f, ok=>{ if(ok){ clearDismissed(); location.reload(); } else msg('That file couldn’t be read — try another.'); }); };
  }

  load();

  window.LO_DYAD = {
    exists, get, update, reset, save,
    sig, bumpSignal, bumpDomain, bumpAdult,
    recordActivity, ageMonths, ageBand, phase,
    exportProfile, importProfile,
    openSetup, openSettings, dismissed, setDismissed,
    DOMAINS
  };

  /* First-visit setup on a child page (skippable). Child pages only. */
  function maybePromptSetup(){
    if(!document.getElementById('menuScreen')) return;      // not a child page
    if(exists() || dismissed()) return;
    openSetup(saved=>{ if(saved) location.reload(); });
  }
  // #menuScreen is already parsed above this script tag, so run now; DCL is a backup.
  maybePromptSetup();
  document.addEventListener('DOMContentLoaded', maybePromptSetup);
})();
