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

  /* ---- noticing prompts (calibration/partnership only) ----
     Passive-first: we only ask when a hypothesis exists, at a natural pause,
     rarely, and every answer maps to a serving change (heart boosts, too-early
     rests). Cadence: ≤1/session, ≤2/week. */
  function weekReset(){
    if(!profile) return;
    const p=profile.prompts, ws=p.weekStart?new Date(p.weekStart+'T00:00:00').getTime():0;
    if(!ws || (Date.now()-ws)/864e5 >= 7){ p.weekStart=todayISO(); p.shownThisWeek=0; }
  }
  function promptBudgetOk(){
    if(!profile) return false;
    if(phase()==='discovery') return false;              // never in discovery
    weekReset();
    const p=profile.prompts;
    if((p.shownThisWeek||0) >= 2) return false;          // ≤ 2 / week
    if(p.lastShownAt && (Date.now()-p.lastShownAt) < SESSION_GAP) return false;  // ≤ 1 / session
    return true;
  }
  function pickHypothesis(list){                          // "the little one keeps coming back to X"
    if(!profile || !Array.isArray(list)) return null;
    const answered=new Set(profile.prompts.answered||[]);
    let best=null, bestScore=0;
    list.forEach(it=>{
      if(!it || !it.id) return;
      const s=profile.signals[it.id]; if(!s) return;
      if((s.hearts||0)>0 || (s.tooEarly||0)>0 || answered.has(it.id)) return;   // already a verdict
      const score=(s.opens||0) + (s.repeats||0)*2 + (s.completes||0) + (s.taps||0)*0.3;
      if((s.opens||0) >= 3 && score>bestScore){ bestScore=score; best=it; }
    });
    return best;
  }
  function recordPromptShown(){
    if(!profile) return; weekReset();
    profile.prompts.lastShownAt=Date.now();
    profile.prompts.shownThisWeek=(profile.prompts.shownThisWeek||0)+1;
    profile.prompts.lastShown=todayISO(); save();
  }
  function answerPrompt(id, kind){                        // kind: heart | early | skip
    if(!profile) return;
    if(kind==='heart') bumpSignal(id,'hearts');
    else if(kind==='early') bumpSignal(id,'tooEarly');
    bumpAdult(kind==='skip' ? 'promptsSkipped' : 'promptsAnswered');
    if(!profile.prompts.answered) profile.prompts.answered=[];
    if(kind!=='skip') profile.prompts.answered.push(id);  // don't re-ask once the grown-up has answered; a skip can resurface later
    save();
  }

  /* ---- autonomy dial + ask-first (Partnership) ----
     auto (default): adaptive ordering applies silently.
     ask-first: ordering stays neutral until the grown-up approves this week's
     suggestion. Discovery always rotates regardless (it's autonomous by design). */
  const DOMAIN_LABEL={ focus:'gentle focus play', perspective:'feelings play',
    communicating:'naming & talking games', connections:'same-and-different play',
    'critical-thinking':'cause-and-effect play', challenges:'just-right challenges',
    'self-directed':'child-led play' };
  function autonomy(){ return profile ? (profile.autonomy||'auto') : 'auto'; }
  function setAutonomy(mode){ if(profile){ profile.autonomy=(mode==='ask-first'?'ask-first':'auto'); save(); } }
  function suggestDomain(){
    if(!profile) return null;
    let best=null, bestE=-1;
    DOMAINS.forEach(d=>{ const e=(profile.domains[d]||{}).engagement||0; if(e>bestE){ bestE=e; best=d; } });
    return (bestE>0)?best:focusDomain();
  }
  function suggestLabel(){ const d=suggestDomain(); return d?(DOMAIN_LABEL[d]||d):null; }
  function weekKey(){ weekReset(); return profile?profile.prompts.weekStart:null; }
  function applyAdaptive(){                             // should renderMenu use rankContent?
    if(!profile) return false;
    if(phase()==='discovery') return true;             // discovery always rotates
    if(autonomy()!=='ask-first') return true;          // auto → always
    const a=profile.approve||{};
    return a.week===weekKey() && a.ok===true;          // ask-first → only if approved this week
  }
  function askFirstPending(){                           // show the ask-first card?
    if(!profile || autonomy()!=='ask-first' || phase()==='discovery') return false;
    const a=profile.approve||{};
    return a.week!==weekKey();                          // this week not decided yet
  }
  function approveThisWeek(ok){ if(profile){ profile.approve={ week:weekKey(), ok:!!ok }; save(); } }

  /* ---- content ranking (the policy layer) ----
     Reorders the menu for THIS dyad. Never hides anything — ordering only.
     - discovery: rotate a leading skill domain per session + nudge fresh
       content up, so all domains get surfaced over ~2 weeks.
     - calibration/partnership: hearts & engagement first, tooEarly rested,
       under-exposed domains surfaced. */
  const BANDS=['6-12m','12-24m','2-3y','3-4y','4-5y'];
  const bandIdx = b => BANDS.indexOf(b);
  function seededJitter(id, seed){                 // deterministic small [0,1)
    let h=2166136261; const s=(id||'')+'|'+seed;
    for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
    return ((h>>>0)%1000)/1000;
  }
  function focusDomain(){ return DOMAINS[(profile? (profile.sessions||0):0) % DOMAINS.length]; }
  function rankContent(items){
    if(!profile || !Array.isArray(items)) return (items||[]).slice();
    const ph=profile.phase, band=ageBand(), focus=focusDomain(), seed=profile.sessions||0;
    const scored = items.map((it,i)=>{
      let s=0; const skills=it.skills||[];
      if(it.age_band && band){                     // age fit
        const bi=bandIdx(band);
        if(it.age_band.some(b=>b===band)) s+=3;
        else if(it.age_band.some(b=>Math.abs(bandIdx(b)-bi)===1)) s+=1;
        else s-=1;
      }
      if(ph==='discovery'){
        if(skills.indexOf(focus)>=0) s+=2.5;       // this session's leading domain
        const opens=(profile.signals[it.id]||{}).opens||0;
        s += Math.max(0, 1.5 - opens*0.4);         // fresh content up
        s += seededJitter(it.id, seed);            // vary across sessions
      } else {
        const sig=profile.signals[it.id]||{};
        s += (sig.hearts||0)*3 - (sig.tooEarly||0)*3;
        s += (sig.completes||0)*0.5 + (sig.taps||0)*0.1;
        let domBoost=0; skills.forEach(sk=>{ const d=profile.domains[sk]; if(d) domBoost += 1/(1+(d.exposure||0)); });
        s += domBoost*0.5 + seededJitter(it.id, seed)*0.5;   // surface under-exposed domains
      }
      return {it, s, i};
    });
    scored.sort((a,b)=> (b.s-a.s) || (a.i-b.i));   // ties keep original order
    return scored.map(x=>x.it);
  }

  /* ---- auto-guided "next": the app leads the child through pending content ----
     Picks the best not-yet-finished story (in adaptive order); if every story is
     done, gently re-visits the least-recently-seen one (repetition is good at
     this age). This is what lets the app create the next step, not a menu. */
  function nextUp(stories){
    if(!profile || !Array.isArray(stories) || !stories.length) return null;
    const ranked=rankContent(stories);
    const pending=ranked.find(s=> ((profile.signals[s.id]||{}).completes||0)===0 );
    if(pending) return { kind:'story', id:pending.id, title:pending.title, fresh:true };
    let lru=ranked[0], lruT=Infinity;                    // all done → least-recently-seen re-visit
    ranked.forEach(s=>{ const ls=(profile.signals[s.id]||{}).lastSeen; const t=ls?new Date(ls).getTime():0; if(t<lruT){ lruT=t; lru=s; } });
    return { kind:'story', id:lru.id, title:lru.title, fresh:false };
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

  // Languages offered as tap-to-toggle pills (plus a free-text "add another" for
  // anything not listed). A broad global + South-Asian spread; edit freely.
  const LANG_OPTIONS = ['English','Hindi','Spanish','Mandarin','Bengali','Tamil',
    'Telugu','Marathi','Punjabi','Urdu','Gujarati','Kannada','Arabic','French'];

  function openSetup(onDone){
    if(document.getElementById('dyadModal')) return;
    const wrap=document.createElement('div'); wrap.id='dyadModal'; wrap.className='dyad-modal';
    wrap.innerHTML=
      '<div class="dyad-card">'+
      '<h2>Make it theirs</h2>'+
      '<p class="dyad-sub">A few gentle details so the stories and games grow with your little one. This stays on <b>your device</b> — never uploaded, and we never ask for a name.</p>'+
      '<label>When was the little one born?</label><input type="month" id="dyadBirth">'+
      '<label>Languages you speak at home <span class="opt">(tap all that apply)</span></label>'+
      '<div class="dyad-pills" id="dyadLangPills">'+
        LANG_OPTIONS.map(function(l){ return '<button type="button" class="dyad-pill" data-lang="'+l+'">'+l+'</button>'; }).join('')+
      '</div>'+
      '<input type="text" id="dyadLangOther" placeholder="Another language? Add it here">'+
      '<label>Traditions or cultures <span class="opt">(optional)</span></label><input type="text" id="dyadCultures" placeholder="optional">'+
      '<div class="dyad-actions"><button class="dyad-skip" id="dyadSkip">Not now</button><button class="dyad-save" id="dyadSave">Save 💛</button></div>'+
      '</div>';
    document.body.appendChild(wrap);
    wrap.querySelectorAll('#dyadLangPills .dyad-pill').forEach(function(b){
      b.onclick=function(){ b.classList.toggle('sel'); b.setAttribute('aria-pressed', b.classList.contains('sel')?'true':'false'); };
    });
    document.getElementById('dyadSkip').onclick=()=>{ setDismissed(); wrap.remove(); onDone&&onDone(false); };
    document.getElementById('dyadSave').onclick=()=>{
      const birth=document.getElementById('dyadBirth').value||null;
      const picked=Array.from(wrap.querySelectorAll('#dyadLangPills .dyad-pill.sel')).map(b=>b.getAttribute('data-lang'));
      const other=(document.getElementById('dyadLangOther').value||'').split(',').map(s=>s.trim()).filter(Boolean);
      const langs=Array.from(new Set(picked.concat(other)));
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
      (p?('<label>How should it adapt?</label><div class="dyad-auto">'+
          '<button class="dyad-autobtn'+(autonomy()==='auto'?' on':'')+'" data-a="auto">Automatically</button>'+
          '<button class="dyad-autobtn'+(autonomy()==='ask-first'?' on':'')+'" data-a="ask-first">Ask me first</button>'+
          '</div>'):'')+
      (window.VOICE && window.VOICE.voices ? ('<label>Storybook voice</label>'+
        '<div class="dyad-pills" id="dyadVoicePills">'+
          '<button type="button" class="dyad-pill" data-v="">Auto <span class="opt">(per story)</span></button>'+
          window.VOICE.voices.map(function(v){ return '<button type="button" class="dyad-pill" data-v="'+v+'">'+v.charAt(0).toUpperCase()+v.slice(1)+'</button>'; }).join('')+
        '</div>') : '')+
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
    (function(){
      const pills=wrap.querySelectorAll('#dyadVoicePills .dyad-pill'); if(!pills.length) return;
      let cur=''; try{ cur=localStorage.getItem('lo.voice')||''; }catch(e){}
      pills.forEach(function(b){ if(b.getAttribute('data-v')===cur) b.classList.add('sel'); });
      pills.forEach(function(b){ b.onclick=function(){
        const v=b.getAttribute('data-v');
        try{ if(v) localStorage.setItem('lo.voice', v); else localStorage.removeItem('lo.voice'); }catch(e){}
        pills.forEach(function(x){ x.classList.toggle('sel', x===b); });
        try{ new Audio((window.VOICE.base||'')+'/'+(v || (window.VOICE.voices&&window.VOICE.voices[0]) || 'ritu')+'/hello-little-one.mp3').play().catch(function(){}); }catch(e){}  // preview the voice
      }; });
    })();
    const close=()=>{ if(window.LO && window.LO.renderMenu) window.LO.renderMenu(); wrap.remove(); };
    const msg=(t)=>{ const m=document.getElementById('dyadMsg'); if(m){ m.textContent=t; m.hidden=false; } };
    document.getElementById('dyadClose').onclick=close;
    wrap.querySelectorAll('.dyad-autobtn').forEach(b=>b.onclick=()=>{
      setAutonomy(b.getAttribute('data-a'));
      wrap.querySelectorAll('.dyad-autobtn').forEach(x=>x.classList.toggle('on', x===b));
    });
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
    recordActivity, ageMonths, ageBand, phase, rankContent, focusDomain, nextUp,
    promptBudgetOk, pickHypothesis, recordPromptShown, answerPrompt,
    autonomy, setAutonomy, suggestLabel, applyAdaptive, askFirstPending, approveThisWeek,
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
