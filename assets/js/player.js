/* ══════════════════════════════════════════════════════════════
   PLAYER ENGINE
   Reads window.CHILD (injected by the Jekyll page) and makes the
   stories and games interactive. You rarely need to touch this —
   the content lives in the _data YAML files instead.
   ══════════════════════════════════════════════════════════════ */
(function(){
  const child = window.CHILD || {};
  const stories = child.stories || [];
  const games   = child.games   || [];

  /* ---- adaptive telemetry (silent; entirely no-ops without a dyad profile) ---- */
  const DY = window.LO_DYAD || null;
  const openedThisSession = new Set();
  function tel(fn){ try{ if(DY && DY.exists && DY.exists()) fn(DY); }catch(e){} }
  function telOpen(c){
    tel(D=>{
      D.recordActivity();
      if(c && c.id){
        if(openedThisSession.has(c.id)) D.bumpSignal(c.id,'repeats');
        else openedThisSession.add(c.id);
        D.bumpSignal(c.id,'opens');
      }
      ((c && c.skills) || []).forEach(s=>D.bumpDomain(s,'exposure'));   // exposure on serve
    });
  }
  function telEngage(c, key){
    tel(D=>{
      if(c && c.id) D.bumpSignal(c.id, key||'taps');
      ((c && c.skills) || []).forEach(s=>D.bumpDomain(s,'engagement')); // engagement on interaction
    });
  }

  const bg = { morning:'#CDEAF2', day:'#DFF1F6', garden:'#E4F3DD', night:'#3B3A63', rain:'#C3D8E0' };
  const inkOn = { rain:'#33404A' };

  /* ---- gentle sound (no files needed) ---- */
  let actx;
  function tone(freq, dur=0.18, type='sine', when=0){
    try{
      if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
      if(actx.state==='suspended') actx.resume();   // mobile: contexts start suspended
      const o=actx.createOscillator(), g=actx.createGain();
      o.type=type; o.frequency.value=freq;
      const t=actx.currentTime+when;
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.22,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t+dur+0.02);
    }catch(e){}
  }
  const blip  = ()=>tone(520,0.14,'sine');
  const happy = ()=>{[523,659,784].forEach((f,i)=>tone(f,0.2,'triangle',i*0.09));};
  const soft  = ()=>tone(380,0.16,'sine');

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ensureAudio(){
    try{ if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); }catch(e){}
    return actx;
  }

  /* ---- warm background music (Web Audio, no files, no licensing) ----
     A little looping band: a soft music-box / marimba melody over a rounded
     bass, a gentle plucked chord and a light shaker for groove — run through a
     small reverb (for space) and a compressor (glue + no clipping). Each story
     has its OWN theme; the menu has a gentle default. Ducks under the voice,
     off by default, toggled by 🎵. Louder than before, still a background bed. */
  const MUS = { master:0.13, duck:0.05, mel:0.16, bass:0.13, chord:0.055, sh:0.03 };  // levels (turn these up/down to taste)
  const SCALES = { penta:[0,2,4,7,9], major:[0,2,4,5,7,9,11] };
  function degToFreq(root, scale, deg){                 // scale degree → Hz (octave-wrapping)
    const n=scale.length, oct=Math.floor(deg/n), idx=((deg%n)+n)%n;
    return root * Math.pow(2, (scale[idx] + oct*12)/12);
  }
  // Upbeat, bouncy children's-song feel (Wheels-on-the-Bus vibe): major key, a
  // singable melody, and an "oom-pah" — bass on the beat, a little triad off-beat.
  // mel = melody scale-degrees per eighth-note (null = rest); chords = triad-root
  // degree per BEAT (cycles). All themes use the major scale for clean triads.
  function triad(root, scale, deg){ return [deg,deg+2,deg+4].map(x=>degToFreq(root,scale,x)); }
  const THEMES = {
    menu:              { root:261.63, bpm:128, wave:'triangle', mel:[4,4,7,7,9,7,4,2, 4,4,7,7,9,9,7,null], chords:[0,0,4,4] },
    'little-ones-day': { root:293.66, bpm:138, wave:'triangle', mel:[0,2,4,4,4,2,0,2, 4,5,4,2,0,2,0,null], chords:[0,3,4,0] }, // sunny bounce
    'splish-splash':   { root:261.63, bpm:132, wave:'triangle', mel:[4,2,0,2,4,4,4,2, 5,4,2,4,0,0,0,null], chords:[0,3,0,4] }, // playful splashy
    'things-that-fall':{ root:329.63, bpm:146, wave:'triangle', mel:[7,7,4,4,2,2,0,0, 4,4,7,7,4,2,0,null], chords:[0,4,0,4] }, // fast & tumbling
    peekaboo:          { root:293.66, bpm:124, wave:'triangle', mel:[0,0,2,2,4,4,2,0, 7,7,4,4,2,2,0,null], chords:[0,0,4,4] }, // cheeky & bouncy
    'try-try-again':   { root:293.66, bpm:130, wave:'triangle', mel:[0,2,4,5,7,5,4,2, 4,5,7,7,9,7,4,null], chords:[0,3,4,0] }, // reaching, climbing
    'chatter-chatter': { root:261.63, bpm:120, wave:'triangle', mel:[4,4,2,4,7,4,2,0, 2,2,4,2,0,null,0,null], chords:[0,4,0,3] } // sing-song, call & answer
  };
  let musicOn=false, musicGain=null, musicComp=null, musReverb=null, musReverbSend=null, musicTimer=null, musTheme=null, musStep=0;
  // a short, soft impulse for a gentle room reverb (built once)
  function buildReverb(){
    const len=Math.floor(actx.sampleRate*1.5), buf=actx.createBuffer(2,len,actx.sampleRate);
    for(let ch=0; ch<2; ch++){ const d=buf.getChannelData(ch);
      for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
    const c=actx.createConvolver(); c.buffer=buf; return c;
  }
  // warm plucked "music-box / marimba" voice: 2 oscillators + a closing lowpass +
  // a quick pluck envelope, sent both dry and into the reverb.
  function voice(freq, dur, wave, gain){
    if(!actx || !musicGain || freq==null) return;
    const t=actx.currentTime;
    const o1=actx.createOscillator(); o1.type=wave; o1.frequency.value=freq;
    const o2=actx.createOscillator(); o2.type='sine'; o2.frequency.value=freq*2;   // shimmer octave
    const o2g=actx.createGain(); o2g.gain.value=0.3;
    const lp=actx.createBiquadFilter(); lp.type='lowpass';
    lp.frequency.setValueAtTime(Math.min(freq*6+1400,9000),t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(freq*2,600),t+dur);         // tone softens as it rings
    const g=actx.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+0.008);                             // quick pluck
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);                             // natural decay
    o1.connect(g); o2.connect(o2g).connect(g); g.connect(lp);
    lp.connect(musicGain);                                                         // dry
    if(musReverbSend) lp.connect(musReverbSend);                                   // → reverb
    o1.start(t); o2.start(t); o1.stop(t+dur+0.05); o2.stop(t+dur+0.05);
  }
  function bass(freq, dur, gain){
    if(!actx || !musicGain || freq==null) return;
    const t=actx.currentTime, o=actx.createOscillator(), g=actx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g).connect(musicGain); o.start(t); o.stop(t+dur+0.03);
  }
  function shaker(gain){                                                           // soft filtered-noise groove
    if(!actx || !musicGain) return;
    const t=actx.currentTime, len=Math.floor(actx.sampleRate*0.05);
    const buf=actx.createBuffer(1,len,actx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len);
    const s=actx.createBufferSource(); s.buffer=buf;
    const hp=actx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=5500;
    const g=actx.createGain(); g.gain.value=gain;
    s.connect(hp).connect(g).connect(musicGain); s.start(t);
  }
  function musicTick(){
    if(!musicOn || !actx || !musicGain || !musTheme) return;
    const T=musTheme, sc=SCALES.major;
    const md=T.mel[musStep % T.mel.length];
    if(md!=null) voice(degToFreq(T.root, sc, md), 0.36, T.wave, MUS.mel);              // melody rings a little
    const beat=musStep>>1, chordRoot=T.chords[beat % T.chords.length];
    if(musStep % 2 === 0){                                                             // ON beat → bass "oom"
      bass(degToFreq(T.root/2, sc, chordRoot), 0.26, MUS.bass);
    } else {                                                                           // OFF beat → chord "pah" + shaker
      triad(T.root, sc, chordRoot).forEach(fr=> voice(fr, 0.2, 'triangle', MUS.chord));
      shaker(MUS.sh);
    }
    musStep++;
    musicTimer=setTimeout(musicTick, 60000/T.bpm/2);                                   // eighth-note step
  }
  function musicSetTheme(name, restart){
    musTheme = THEMES[name] || THEMES.menu;
    if(restart && musicOn){ clearTimeout(musicTimer); musStep=0; musicTick(); }   // switch cleanly at a scene change
  }
  function duckMusic(){
    if(!musicOn || !musicGain || !actx) return;
    const t=actx.currentTime; musicGain.gain.cancelScheduledValues(t);
    musicGain.gain.setTargetAtTime(MUS.duck,t,0.05);                              // dip while the voice talks
    musicGain.gain.setTargetAtTime(MUS.master, t+1.0,0.5);                        // then restore
  }
  function startMusic(){
    if(!ensureAudio()) return;
    if(!musicGain){
      musicGain=actx.createGain(); musicGain.gain.value=0.0001;
      musicComp=actx.createDynamicsCompressor();                                  // glue + clip protection
      musicGain.connect(musicComp).connect(actx.destination);
      try{ musReverb=buildReverb(); musReverbSend=actx.createGain(); musReverbSend.gain.value=0.55;
           musReverbSend.connect(musReverb).connect(musicGain); }catch(e){ musReverb=null; musReverbSend=null; }
    }
    if(!musTheme) musicSetTheme('menu');
    musicOn=true;
    musicGain.gain.cancelScheduledValues(actx.currentTime);
    musicGain.gain.setTargetAtTime(MUS.master, actx.currentTime, 0.6);            // fade in
    clearTimeout(musicTimer); musStep=0; musicTick();
  }
  function stopMusic(){
    musicOn=false; clearTimeout(musicTimer);
    if(musicGain && actx) musicGain.gain.setTargetAtTime(0.0001, actx.currentTime, 0.4);
  }
  function reflectMusicBtn(){
    const b=$('musicBtn'); if(!b) return;
    b.textContent = musicOn ? '🎵' : '🔇';
    b.classList.toggle('off', !musicOn);
    b.setAttribute('aria-label', musicOn ? 'Turn music off' : 'Turn music on');
  }
  function toggleMusic(){
    musicOn ? stopMusic() : startMusic();
    try{ localStorage.setItem('lo.music', musicOn ? '1':'0'); }catch(e){}
    reflectMusicBtn();
  }

  /* ---- reinforcing voice (browser speech; no files, no third-party character) ----
     Prefer a pleasant, soothing FEMALE English voice where the device offers one.
     Available voices vary by device/OS; we choose the best match and soften it. */
  let preferredVoice = null;
  function pickVoice(){
    try{
      const voices = window.speechSynthesis.getVoices() || [];
      if(!voices.length) return null;
      const en = voices.filter(v => /^en([-_]|$)/i.test(v.lang));
      const pool = en.length ? en : voices;
      const wish = ['Samantha','Karen','Moira','Tessa','Serena','Fiona','Victoria',
        'Allison','Ava','Susan','Google UK English Female','Microsoft Zira',
        'Microsoft Aria','Microsoft Jenny','female'];
      for(const w of wish){
        const hit = pool.find(v => (v.name+' '+(v.voiceURI||'')).toLowerCase().includes(w.toLowerCase()));
        if(hit) return hit;
      }
      return pool.find(v => /female|woman/i.test(v.name+' '+(v.voiceURI||''))) || null;
    }catch(e){ return null; }
  }
  function ensureVoice(){ if(!preferredVoice) preferredVoice = pickVoice(); return preferredVoice; }
  if('speechSynthesis' in window){
    ensureVoice();
    window.speechSynthesis.onvoiceschanged = ()=>{ preferredVoice = pickVoice(); };
  }
  /* ---- warm voice: prefer a pre-rendered clip (Sarvam) for the ACTIVE voice,
     else fall back to the device speech voice. Active voice = the family's
     picked voice (settings) › the story/game's own `voice:` › the default.
     Clips are static + offline; partial coverage is fine — anything unrendered
     speaks via the device voice. window.VOICE is embedded by child.html. ---- */
  const DEFAULT_VOICE = (window.VOICE && window.VOICE.voices && window.VOICE.voices[0]) || 'ritu';
  function slugText(t){ return (t||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
  function pickedVoice(){ try{ return localStorage.getItem('lo.voice') || ''; }catch(e){ return ''; } }
  function activeVoice(){
    return pickedVoice() || (curStory && curStory.voice) || (curGame && curGame.voice) || DEFAULT_VOICE;
  }
  let clipAudio=null;
  function say(text){
    try{
      const V = window.VOICE;
      if(V && V.manifest){
        const s = slugText(text), voice = activeVoice();
        let use = (V.manifest[voice] && V.manifest[voice][s]) ? voice
                : (V.manifest[DEFAULT_VOICE] && V.manifest[DEFAULT_VOICE][s]) ? DEFAULT_VOICE : null;
        if(use){
          duckMusic();
          try{ if(clipAudio) clipAudio.pause(); }catch(e){}
          clipAudio = new Audio((V.base||'') + '/' + use + '/' + s + '.mp3');
          clipAudio.volume = 0.95;
          clipAudio.play().catch(()=>sayDevice(text));   // autoplay blocked → device voice
          return;
        }
      }
      sayDevice(text);
    }catch(e){ sayDevice(text); }
  }
  function sayDevice(text){
    try{
      if(!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      const v = ensureVoice(); if(v){ u.voice = v; u.lang = v.lang; }
      u.rate = 0.9; u.pitch = 1.15; u.volume = 0.9;   // soft, warm, soothing
      duckMusic();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  /* ---- confetti: original, dependency-free burst (respects reduced-motion) ---- */
  const CONFETTI = ['#F6C453','#F28C7A','#8FCFE0','#B79BD6','#8DC08A','#5BB0C7'];
  function confetti(opts){
    opts = opts || {};
    if(reduceMotion) return;
    const count = opts.count||100, life = opts.life||115, cap = opts.cap||135;
    const cvs = document.createElement('canvas');   // own layer per burst → waves can overlap
    cvs.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    const remove = ()=>{ if(cvs.parentNode) cvs.parentNode.removeChild(cvs); };
    const safety = setTimeout(remove, (cap/60)*1000 + 800);   // always clean up, even if a bg tab throttles rAF
    const W = cvs.width = window.innerWidth, H = cvs.height = window.innerHeight;
    const parts = Array.from({length:count}, ()=>({
      x: W*0.5 + (Math.random()-0.5)*W*0.55, y: H*0.32 + (Math.random()-0.5)*40,
      vx: (Math.random()-0.5)*9, vy: -7 - Math.random()*7, g: 0.28 + Math.random()*0.14,
      size: 6 + Math.random()*8, rot: Math.random()*6.28, vr: (Math.random()-0.5)*0.3,
      color: CONFETTI[Math.random()*CONFETTI.length|0], round: Math.random()<0.5
    }));
    let frames = 0;
    (function step(){
      frames++; ctx.clearRect(0,0,W,H);
      let alive=false; const alpha=Math.max(0,1-frames/life);
      parts.forEach(p=>{
        p.vy+=p.g; p.vx*=0.99; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        if(p.y < H+24) alive=true;
        ctx.save(); ctx.globalAlpha=alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.color;
        if(p.round){ ctx.beginPath(); ctx.arc(0,0,p.size/2,0,6.28); ctx.fill(); }
        else ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
        ctx.restore();
      });
      if(alive && frames<cap) requestAnimationFrame(step);
      else { clearTimeout(safety); remove(); }
    })();
  }
  /* a fuller, longer party — rolling waves — for finishing a whole book (~3.8s, matches the return) */
  function bigConfetti(){
    confetti({count:160, life:180, cap:200});
    setTimeout(()=>confetti({count:130, life:170, cap:190}), 600);
    setTimeout(()=>confetti({count:110, life:160, cap:180}), 1200);
  }

  /* ---- celebrate a correct find: chime + confetti + warm spoken cheer ---- */
  const sayLines = ['Yay! You found {L}!','Well done! That\'s {L}!','Hooray! You found {L}!','Good job! {L}!'];
  function celebrate(label){
    happy();
    confetti();
    say(sayLines[Math.random()*sayLines.length|0].replace('{L}', label));
  }

  /* ---- reliable tap wobble (Web Animations API: restarts every tap, works on SVG + mobile) ---- */
  function wobble(el){
    if(!el || reduceMotion || typeof el.animate!=='function') return;
    el.animate([
      {transform:'rotate(0deg) scale(1)'},
      {transform:'rotate(-6deg) scale(1.08)', offset:.25},
      {transform:'rotate(6deg) scale(1.08)', offset:.75},
      {transform:'rotate(0deg) scale(1)'}
    ], {duration:520, easing:'ease'});
  }
  const artWord = key => key ? key.charAt(0).toUpperCase()+key.slice(1)+'!' : '';
  /* Name the tapped picture in a SIMPLE SENTENCE (dialogic-reading style), not a
     bare word — "the {word}" is grammatical for all our nouns (the sun, the rain…). */
  const artSentences = ['Look, the {w}!', "It's the {w}!", "There's the {w}!", 'I see the {w}!', 'Can you say {w}?'];
  function sayArt(key){
    const w=(key||'').toLowerCase(); if(!w) return;
    let h=0; for(let i=0;i<w.length;i++) h+=w.charCodeAt(i);   // deterministic per word (matches voice/render.py) → one clip per picture
    say(artSentences[h % artSentences.length].replace('{w}', w));
  }
  const speakable = s => (s||'').replace(/[^\w\s,.!?'-]/g,'').replace(/\s+/g,' ').trim();

  /* ---- peek-a-boo camera mirror — LOCAL ONLY: the stream is shown on-device and
     never recorded, saved, or uploaded. Stopped on leaving the page/screen. ---- */
  let camStream=null;
  function stopCamera(){
    try{ if(camStream){ camStream.getTracks().forEach(t=>t.stop()); camStream=null; } }catch(e){}
    const v=$('mirrorVid'); if(v){ try{ v.srcObject=null; }catch(e){} }
  }
  function startCamera(){
    happy();
    const vid=$('mirrorVid'), fb=$('mirrorFallback');
    const md = navigator.mediaDevices;
    if(!vid || !md || !md.getUserMedia){ if(fb) fb.hidden=false; say("Peek-a-boo! It's you!"); return; }
    md.getUserMedia({video:{facingMode:'user'}, audio:false})
      .then(s=>{ camStream=s; vid.srcObject=s; if(fb) fb.hidden=true; say("Peek-a-boo! It's you!"); })
      .catch(()=>{ if(fb) fb.hidden=false; say("Peek-a-boo! It's you!"); });   // denied/unavailable → gentle fallback
  }
  /* ---- experience TYPES (schema/experience.schema.json) ----
     The engine renders each experience TYPE through this registry. Behaviour is
     identical to the per-type conditionals it replaces, but a new page type is
     now ONE registry entry (+ its schema branch) instead of edits scattered
     through renderPage / toggleFlap / the tap handler. Story pages are three
     types (plain / flap / mirror); the Tap & Find game is itself a single
     declarative type (see newRound). Each entry: hint · build(scene) overlays ·
     invite() a tap/lift · tap(p) · optional onOpen/onClose (the flap mechanic). */
  function pageType(p){ return p.mirror ? 'mirror' : (p.flap ? 'flap' : 'plain'); }
  function addFlap(scene, isMirror){
    const flap=document.createElement('div'); flap.id='flapEl';
    flap.className='flap'+(isMirror?' flap-mirror':'');
    scene.appendChild(flap);
  }
  function addMirror(scene){
    const mc=document.createElement('div'); mc.className='mirror-circle';
    mc.innerHTML='<video id="mirrorVid" playsinline autoplay muted></video>'
               + '<div class="mirror-fallback" id="mirrorFallback" hidden>Peek-a-boo — it\'s you! 💛</div>';
    scene.appendChild(mc);
  }
  function wiggleFlap(){
    const f=$('flapEl');
    if(f && f.animate && !reduceMotion) setTimeout(()=>f.animate(
      [{transform:'rotate(-1.5deg)'},{transform:'rotate(1.5deg)'},{transform:'rotate(0deg)'}],
      {duration:520, easing:'ease'}), 350);
  }
  function inviteHero(){ const h=$('heroArt'); if(h) setTimeout(()=>wobble(h), 350); }
  const PAGE_TYPES = {
    plain: {
      hint: '👆 Tap the picture!',
      build(){},
      invite: inviteHero,
      tap(p){ const h=$('heroArt'); if(!h) return; happy(); sayArt(p.art); wobble(h); }
    },
    flap: {
      hint: '👆 Lift the flap!',
      build(scene){ addFlap(scene, false); },
      invite: wiggleFlap,
      tap(p){ toggleFlap(p); },
      onOpen(p){ happy(); say(speakable(p.reveal) || 'Peek-a-boo!'); confetti(); wobble($('heroArt')); }
    },
    mirror: {
      hint: '👆 Lift the flap!',
      build(scene){ addMirror(scene); addFlap(scene, true); },
      invite: wiggleFlap,
      tap(p){ toggleFlap(p); },
      onOpen(){ startCamera(); },
      onClose(){ stopCamera(); }
    }
  };
  function toggleFlap(p){
    const flap=$('flapEl'); if(!flap) return;
    const T=PAGE_TYPES[pageType(p)];
    const opening = !flap.classList.contains('flap-open');
    flap.classList.toggle('flap-open', opening);
    if(opening){ if(T.onOpen) T.onOpen(p); } else if(T.onClose){ T.onClose(p); }
  }

  const $ = id => document.getElementById(id);
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}

  /* ---- HOME within a child page: choose a story or a game ---- */
  /* Adaptive ordering: reorder for this dyad (never hides anything). Falls back
     to the original data order when there's no profile. openStory/openGame use
     the ORIGINAL array index, so we map each ranked item back via indexOf. */
  function orderedFor(list){
    // applyAdaptive() is false without a profile, and false in ask-first mode
    // until the grown-up approves this week → then the menu stays in neutral order.
    return (DY && DY.applyAdaptive && DY.applyAdaptive() && DY.rankContent) ? DY.rankContent(list) : list.slice();
  }
  function renderMenu(){
    const wrap = $('menu');
    let html = '';
    // Auto-guided "Next": the app leads to the next pending story (a big CTA on top).
    let hasHero = false;
    if(DY && DY.exists && DY.exists() && DY.nextUp){
      const nx = DY.nextUp(stories);
      const s = nx && stories.find(x=>x.id===nx.id);
      if(s){
        const i = stories.indexOf(s);
        const eyebrow = nx.fresh ? ('Next for '+(child.name||'you')) : 'A favourite again';
        html += `<button class="next-hero" onclick="LO.openStory(${i})">`+
                `<span class="nh-eyebrow">${eyebrow}</span>`+
                `<span class="nh-title">${s.title}</span>`+
                `<span class="nh-go">▶</span></button>`;
        hasHero = true;
      }
    }
    if(stories.length){
      html += `<h2 class="menu-head">${hasHero?'📖 Or choose a story':'📖 Stories'}</h2><div class="menu-list">`;
      orderedFor(stories).forEach(s=>{
        const i = stories.indexOf(s);
        html += `<button class="menu-item story" onclick="LO.openStory(${i})">${s.title}<span class="age">${s.age||''}</span></button>`;
      });
      html += `</div>`;
    }
    if(games.length){
      html += `<h2 class="menu-head">🐤 Tap &amp; find</h2><div class="menu-list">`;
      orderedFor(games).forEach(g=>{
        const i = games.indexOf(g);
        html += `<button class="menu-item game" onclick="LO.openGame(${i})">${g.title}<span class="age">${g.age||''}</span></button>`;
      });
      html += `</div>`;
    }
    wrap.innerHTML = html;
    maybeAskFirst();
  }

  /* ---- ask-first (Partnership): let the grown-up approve this week's emphasis
     before the ordering changes. Non-blocking card, at most once per week. ---- */
  function maybeAskFirst(){
    tel(D=>{ if(D.askFirstPending && D.askFirstPending()) showAskCard(D); });
  }
  function showAskCard(D){
    const menu=$('menu'); if(!menu || document.getElementById('askCard')) return;
    const label = (D.suggestLabel && D.suggestLabel()) || 'a little more variety';
    const card=document.createElement('div'); card.id='askCard'; card.className='notice-card';
    card.innerHTML =
      '<p class="notice-q">This week, shall I lean into <b>'+label+'</b> for her?</p>'+
      '<div class="notice-actions">'+
        '<button data-a="yes">Yes please</button>'+
        '<button data-a="no">Not now</button>'+
      '</div>';
    menu.parentNode.insertBefore(card, menu);
    card.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      D.approveThisWeek(b.getAttribute('data-a')==='yes');
      card.remove();
      renderMenu();     // Yes → adaptive ordering applies now; No → stays neutral
    });
  }

  /* ---- STORY ---- */
  let curStory=null, pageIdx=0;
  function openStory(i){
    curStory = stories[i]; pageIdx = 0;
    stopRead();                              // start fresh, never mid-read from a prior story
    telOpen(curStory);
    musicSetTheme(curStory.id, true);        // this story's own tune
    show('storyScreen'); renderPage();
  }
  function renderPage(){
    const p = curStory.pages[pageIdx];
    const scene = $('scene');
    stopCamera();                                  // leaving any prior mirror page
    scene.style.background = bg[p.sky] || '#DFF1F6';
    let deco='';
    if(p.sky==='night'){
      deco = `<g opacity=".85"><circle cx="18" cy="20" r="1.6" fill="#FBF6EE"/><circle cx="80" cy="16" r="2" fill="#FBF6EE"/><circle cx="66" cy="30" r="1.4" fill="#FBF6EE"/><circle cx="12" cy="50" r="1.4" fill="#FBF6EE"/></g>`;
    } else if(p.sky!=='rain'){
      deco = `<g transform="translate(58,14) scale(0.4)" opacity=".9">${ART.cloud}</g>`;
      if(p.sky==='garden') deco += `<rect x="0" y="82" width="100" height="18" fill="#8DC08A" opacity=".5"/>`;
    }
    const hero = `<g class="tappable" id="heroArt" transform="translate(28,26) scale(0.46)">${ART[p.art]||''}</g>`;
    scene.innerHTML = svgWrap(`${deco}${hero}`);

    PAGE_TYPES[pageType(p)].build(scene, p);   // type-specific overlays: flap / camera-mirror

    const line = $('storyLine');
    line.textContent = p.line;
    line.style.color = inkOn[p.sky] || '#4A4038';
    $('storyCue').textContent = p.cue ? '💡 ' + p.cue : '';
    $('storyTitle').textContent = curStory.title;
    $('storyProgress').textContent = `${pageIdx+1} / ${curStory.pages.length}`;
    const last = pageIdx===curStory.pages.length-1;
    $('prevBtn').hidden = pageIdx===0;                      // no "back" on the very first page
    const nb=$('nextBtn'); nb.innerHTML = last ? '♥' : '›'; nb.classList.toggle('end', last);
    const pc=$('pageCurl'); if(pc) pc.hidden = last;        // last page: nothing behind it to peel
    clearInvite();                                          // fresh page: stop any pulsing turn-cue

    const T = PAGE_TYPES[pageType(p)];
    const hint=$('tapHint'); if(hint) hint.textContent = T.hint;
    T.invite(p);                                            // invite a tap (plain) or a lift (flap/mirror)
    if(readMode) narratePage();                             // "Read to me" is on → narrate + auto-turn
  }
  /* ---- board-book page-turn: soft two-phase flip on the scene ---- */
  let turning=false;
  function turnPage(dir, apply){
    const s=$('scene');
    if(reduceMotion || !s || typeof s.animate!=='function'){ apply(); return; }
    if(turning) return;
    turning=true;
    let applied=false;
    const doApply=()=>{ if(!applied){ applied=true; apply(); } };   // swap the page once
    setTimeout(()=>{ doApply(); turning=false; }, 650);             // safety: always advance & clear
    const out=s.animate([
      {transform:'perspective(1200px) rotateY(0deg)',   opacity:1},
      {transform:`perspective(1200px) rotateY(${dir>0?-90:90}deg)`, opacity:.3}
    ],{duration:200, easing:'ease-in'});
    out.onfinish=()=>{
      doApply();                                        // swap while edge-on
      s.animate([
        {transform:`perspective(1200px) rotateY(${dir>0?90:-90}deg)`, opacity:.3},
        {transform:'perspective(1200px) rotateY(0deg)', opacity:1}
      ],{duration:220, easing:'ease-out'}).onfinish=()=>{ turning=false; };
    };
  }
  function nextPage(){
    if(!curStory) return;
    if(pageIdx<curStory.pages.length-1) turnPage(1, ()=>{ pageIdx++; renderPage(); });
    else finishStory();                                        // reached the end = completed
  }
  /* ---- finishing the whole book: a longer party + a warm spoken congratulation ---- */
  const COMPLETE_LINE = 'You finished the whole book! Hooray, little one!';
  let finishing=false;
  function finishStory(){
    if(finishing) return; finishing=true;                      // guard against double-taps on ♥
    stopRead();
    telEngage(curStory,'completes');
    happy();                                                   // celebratory chime
    bigConfetti();                                             // rolling confetti waves
    say(COMPLETE_LINE);                                        // warm voice, in this story's speaker
    setTimeout(()=>{ finishing=false; backToMenu(); }, 3800);  // let the party + voice finish first
  }
  function prevPage(){ if(pageIdx>0) turnPage(-1, ()=>{ pageIdx--; renderPage(); }); }

  /* ---- turn-the-page affordance: pulse the chevron + corner-curl after a tap ---- */
  function clearInvite(){ ['nextBtn','pageCurl'].forEach(id=>{ const e=$(id); if(e) e.classList.remove('invite'); }); }
  function inviteNext(){
    if(!curStory || pageIdx>=curStory.pages.length-1) return;   // nothing to turn to on the last page
    ['nextBtn','pageCurl'].forEach(id=>{ const e=$(id); if(e) e.classList.add('invite'); });
  }

  /* ---- "Read to me": narrate the line in the warm voice, then turn the page ---- */
  let readMode=false, readTimer=null;
  function reflectReadBtn(){ const b=$('readBtn'); if(!b) return;
    b.innerHTML = readMode ? '⏸&nbsp; Reading…' : '▶&nbsp; Read to me'; b.classList.toggle('on', readMode); }
  function stopRead(){ readMode=false; clearTimeout(readTimer); reflectReadBtn(); }
  function toggleRead(){ readMode=!readMode; reflectReadBtn(); readMode ? narratePage() : clearTimeout(readTimer); }
  function narratePage(){
    if(!readMode || !curStory) return;
    const line = curStory.pages[pageIdx].line || '';
    say(line);                                                 // warm clip if rendered, else device voice
    clearTimeout(readTimer);
    const ms = Math.max(2200, line.length*95 + 1700);          // rough read time + a beat to look
    readTimer = setTimeout(()=>{
      if(!readMode) return;
      if(pageIdx<curStory.pages.length-1) nextPage();          // → renderPage → narratePage (chains on)
      else stopRead();                                          // reached the end, stop reading
    }, ms);
  }

  /* ---- GAME ---- */
  let curGame=null, score=0;
  const cheers=['Yay! 🎉','You found it! 💛','Hooray!','Well done! ⭐','Good job! 🌸'];
  function gameMode(g){ return g && g.mode==='odd-one-out' ? 'odd-one-out' : 'find'; }
  function openGame(i){
    curGame = games[i]; score=0;
    telOpen(curGame);
    musicSetTheme('menu', true);             // games use the gentle default theme
    $('gameScore').textContent='⭐ 0';
    $('gameTitle').textContent = curGame.title;
    show('gameScreen'); GAME_TYPES[gameMode(curGame)].newRound();
  }
  /* Shared round renderer: draw the choices, correct → cheer + celebrate + next
     round; wrong → gentle nudge (never a fail). Correctness is by object
     identity, so a game may repeat labels/pictures across rounds safely. */
  function renderChoices(options, correct, promptHTML, sayLabel){
    $('cheer').textContent='';
    $('ask').innerHTML = promptHTML;
    const grid=$('grid'); grid.innerHTML=''; grid.style.gridTemplateColumns='1fr 1fr';
    options.forEach(o=>{
      const b=document.createElement('button');
      b.className='choice'; b.innerHTML=svgWrap(ART[o.art]||'');
      b.onclick=()=>{
        if(o===correct){
          b.classList.add('right'); score++;
          $('gameScore').textContent=`⭐ ${score}`;
          $('cheer').textContent=cheers[Math.random()*cheers.length|0];
          celebrate(sayLabel);
          telEngage(curGame,'taps');
          setTimeout(()=>GAME_TYPES[gameMode(curGame)].newRound(), 1700);
        } else {
          soft(); b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
        }
      };
      grid.appendChild(b);
    });
  }
  /* ---- game TYPES (schema/experience.schema.json) ----
     Like PAGE_TYPES: each entry is a round builder. A new game mechanic is one
     registry entry + its schema branch, not engine surgery. */
  const GAME_TYPES = {
    find: {                                   // "Can you find X?" — name → picture (naming)
      newRound(){
        const pool = shuffle(curGame.items);
        const options = shuffle(pool.slice(0, Math.min(4, pool.length)));
        const target = options[Math.random()*options.length|0];
        const prompt = (curGame.ask || 'Can you find {label}?').replace('{label}', `<b>${target.label}</b>`);
        renderChoices(options, target, prompt, target.label);
      }
    },
    'odd-one-out': {                          // "Which one is different?" — critical thinking
      newRound(){
        const groups = (curGame.groups||[]).map(g=>g.slice()).filter(g=>g.length);
        const majorIdx = groups.map((g,i)=>[g.length,i]).sort((a,b)=>b[0]-a[0])[0][1];
        const major = shuffle(groups[majorIdx]).slice(0, Math.min(3, groups[majorIdx].length));
        const odd = shuffle(groups.filter((g,i)=>i!==majorIdx).flat())[0];
        const options = shuffle(major.concat([odd])).map(art=>({art}));
        const correct = options.find(o=>o.art===odd);
        renderChoices(options, correct, curGame.prompt || 'Which one is <b>different</b>?', 'the different one');
      }
    }
  };

  /* ---- screen switching ---- */
  function show(id){
    stopCamera();                                           // stop the mirror when switching screens
    ['menuScreen','storyScreen','gameScreen'].forEach(s=>{
      const el=$(s); if(el) el.classList.toggle('active', s===id);
    });
  }
  function backToMenu(){ stopRead(); show('menuScreen'); musicSetTheme('menu', true); maybeNotice(); }

  /* ---- noticing prompt: a gentle one-tap card at the session-end pause.
     Never blocks (the menu is fully usable underneath); shows at most rarely,
     only in calibration/partnership, only when a hypothesis exists. ---- */
  function maybeNotice(){
    if(document.getElementById('askCard')) return;      // resolve the ask-first card first
    tel(D=>{
      if(D.askFirstPending && D.askFirstPending()) return;
      if(!D.promptBudgetOk || !D.promptBudgetOk()) return;
      const hyp = D.pickHypothesis((stories||[]).concat(games||[]));
      if(hyp) showNotice(D, hyp);
    });
  }
  function showNotice(D, item){
    const menu=$('menu'); if(!menu || document.getElementById('noticeCard')) return;
    D.recordPromptShown();
    const card=document.createElement('div'); card.id='noticeCard'; card.className='notice-card';
    card.innerHTML =
      '<p class="notice-q">She keeps coming back to <b>'+item.title+'</b> — is she loving it?</p>'+
      '<div class="notice-actions">'+
        '<button data-k="heart">❤️ Loving it</button>'+
        '<button data-k="early">🌱 Too early</button>'+
        '<button data-k="skip" aria-label="skip">🤷</button>'+
      '</div>';
    menu.parentNode.insertBefore(card, menu);          // above the story/game list
    card.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      D.answerPrompt(item.id, b.getAttribute('data-k'));
      card.remove();
      renderMenu();                                    // reflect new ordering immediately
    });
  }

  /* Tap anywhere on the story picture → chime + the word + wobble.
     Listener lives on the persistent .scene div (reliable on mobile; the whole
     picture becomes one big tap target for little fingers). */
  const sceneEl = $('scene');
  if(sceneEl){
    let sx=0, sy=0, st=0, swiped=false;
    sceneEl.addEventListener('pointerdown', e=>{ sx=e.clientX; sy=e.clientY; st=Date.now(); swiped=false; });
    sceneEl.addEventListener('pointerup', e=>{
      const dx=e.clientX-sx, dy=e.clientY-sy;               // a horizontal drag = turn the page, like a real book
      if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.4 && Date.now()-st<700){
        swiped=true;
        if(dx<0) nextPage(); else prevPage();
      }
    });
    sceneEl.addEventListener('click', ()=>{
      if(swiped){ swiped=false; return; }                   // the swipe already turned the page
      if(!curStory) return;
      const p = curStory.pages[pageIdx];
      telEngage(curStory,'taps');
      PAGE_TYPES[pageType(p)].tap(p);                        // plain → say the word; flap/mirror → lift
      inviteNext();                                          // then gently pulse the turn-the-page cue
    });
  }

  /* Adult-engagement signal: grown-up expands the monthly guidance card. */
  const gcard = document.querySelector('.grownup-card');
  if(gcard) gcard.addEventListener('toggle', ()=>{ if(gcard.open) tel(D=>D.bumpAdult('cueDwells')); });

  window.addEventListener('pagehide', stopCamera);          // privacy: never leave the camera on

  /* Unlock audio on the first user gesture (mobile browsers start it suspended). */
  let musicPref = false;
  try{ musicPref = localStorage.getItem('lo.music') === '1'; }catch(e){}
  /* Best-effort fullscreen on the first tap (touch devices only; silently
     no-ops on desktop and on iOS Safari, where "Add to Home Screen" gives
     true fullscreen via the manifest instead). */
  function goFullscreenMaybe(){
    try{
      const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) || window.navigator.standalone;
      const touch = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
      const el = document.documentElement;
      if(!standalone && touch && el.requestFullscreen) el.requestFullscreen().catch(()=>{});
    }catch(e){}
  }
  window.addEventListener('pointerdown', function unlock(){
    ensureAudio();
    if(musicPref && !musicOn) startMusic();     // resume the family's music choice on first tap
    reflectMusicBtn();
    goFullscreenMaybe();
  }, {once:true, passive:true});

  window.LO = { openStory, openGame, nextPage, prevPage, backToMenu, toggleMusic, renderMenu, toggleRead };
  renderMenu(); show('menuScreen'); reflectMusicBtn();
})();
