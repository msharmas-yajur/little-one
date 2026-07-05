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

  const bg = { morning:'#CDEAF2', day:'#DFF1F6', garden:'#E4F3DD', night:'#3B3A63', rain:'#C3D8E0' };
  const inkOn = { rain:'#33404A' };

  /* ---- gentle sound (no files needed) ---- */
  let actx;
  function tone(freq, dur=0.18, type='sine', when=0){
    try{
      if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
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

  /* ---- reinforcing voice (browser speech; no files, no third-party character) ---- */
  function say(text){
    try{
      if(!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 1.25; u.volume = 0.9;   // warm, gentle, a little playful
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  /* ---- confetti: original, dependency-free burst (respects reduced-motion) ---- */
  const CONFETTI = ['#F6C453','#F28C7A','#8FCFE0','#B79BD6','#8DC08A','#5BB0C7'];
  function confetti(){
    if(reduceMotion) return;
    let cvs = document.getElementById('confettiCanvas');
    if(!cvs){
      cvs = document.createElement('canvas'); cvs.id='confettiCanvas';
      cvs.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9999;';
      document.body.appendChild(cvs);
    }
    const ctx = cvs.getContext('2d');
    const W = cvs.width = window.innerWidth, H = cvs.height = window.innerHeight;
    const parts = Array.from({length:100}, ()=>({
      x: W*0.5 + (Math.random()-0.5)*W*0.55, y: H*0.32 + (Math.random()-0.5)*40,
      vx: (Math.random()-0.5)*9, vy: -7 - Math.random()*7, g: 0.28 + Math.random()*0.14,
      size: 6 + Math.random()*8, rot: Math.random()*6.28, vr: (Math.random()-0.5)*0.3,
      color: CONFETTI[Math.random()*CONFETTI.length|0], round: Math.random()<0.5
    }));
    let frames = 0;
    (function step(){
      frames++; ctx.clearRect(0,0,W,H);
      let alive=false; const alpha=Math.max(0,1-frames/115);
      parts.forEach(p=>{
        p.vy+=p.g; p.vx*=0.99; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        if(p.y < H+24) alive=true;
        ctx.save(); ctx.globalAlpha=alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.color;
        if(p.round){ ctx.beginPath(); ctx.arc(0,0,p.size/2,0,6.28); ctx.fill(); }
        else ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
        ctx.restore();
      });
      if(alive && frames<135) requestAnimationFrame(step);
      else if(cvs&&cvs.parentNode) cvs.parentNode.removeChild(cvs);
    })();
  }

  /* ---- celebrate a correct find: chime + confetti + warm spoken cheer ---- */
  const sayLines = ['Yay! You found {L}!','Well done! That\'s {L}!','Hooray! You found {L}!','Good job! {L}!'];
  function celebrate(label){
    happy();
    confetti();
    say(sayLines[Math.random()*sayLines.length|0].replace('{L}', label));
  }

  const $ = id => document.getElementById(id);
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}

  /* ---- HOME within a child page: choose a story or a game ---- */
  function renderMenu(){
    const wrap = $('menu');
    let html = '';
    if(stories.length){
      html += `<h2 class="menu-head">📖 Stories</h2><div class="menu-list">`;
      stories.forEach((s,i)=>{
        html += `<button class="menu-item story" onclick="LO.openStory(${i})">${s.title}<span class="age">${s.age||''}</span></button>`;
      });
      html += `</div>`;
    }
    if(games.length){
      html += `<h2 class="menu-head">🐤 Tap &amp; find</h2><div class="menu-list">`;
      games.forEach((g,i)=>{
        html += `<button class="menu-item game" onclick="LO.openGame(${i})">${g.title}<span class="age">${g.age||''}</span></button>`;
      });
      html += `</div>`;
    }
    wrap.innerHTML = html;
  }

  /* ---- STORY ---- */
  let curStory=null, pageIdx=0;
  function openStory(i){
    curStory = stories[i]; pageIdx = 0;
    show('storyScreen'); renderPage();
  }
  function renderPage(){
    const p = curStory.pages[pageIdx];
    const scene = $('scene');
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

    const line = $('storyLine');
    line.textContent = p.line;
    line.style.color = inkOn[p.sky] || '#4A4038';
    $('storyCue').textContent = p.cue ? '💡 ' + p.cue : '';
    $('storyTitle').textContent = curStory.title;
    $('storyProgress').textContent = `${pageIdx+1} / ${curStory.pages.length}`;
    $('prevBtn').disabled = pageIdx===0;
    $('nextBtn').innerHTML = pageIdx===curStory.pages.length-1 ? 'The end 💛' : 'Turn the page →';

    $('heroArt').addEventListener('click', ()=>{
      happy();
      const h=$('heroArt'); h.classList.remove('wobble'); void h.offsetWidth; h.classList.add('wobble');
    });
  }
  function nextPage(){ if(pageIdx<curStory.pages.length-1){pageIdx++;renderPage();} else backToMenu(); }
  function prevPage(){ if(pageIdx>0){pageIdx--;renderPage();} }

  /* ---- GAME ---- */
  let curGame=null, score=0;
  const cheers=['Yay! 🎉','You found it! 💛','Hooray!','Well done! ⭐','Good job! 🌸'];
  function openGame(i){
    curGame = games[i]; score=0;
    $('gameScore').textContent='⭐ 0';
    $('gameTitle').textContent = curGame.title;
    show('gameScreen'); newRound();
  }
  function newRound(){
    $('cheer').textContent='';
    const pool = shuffle(curGame.items);
    const n = Math.min(4, pool.length);
    const options = shuffle(pool.slice(0,n));
    const target = options[Math.random()*options.length|0];
    $('ask').innerHTML = `Can you find <b>${target.label}</b>?`;
    const grid=$('grid'); grid.innerHTML='';
    grid.style.gridTemplateColumns = n<=2 ? '1fr 1fr' : '1fr 1fr';
    options.forEach(o=>{
      const b=document.createElement('button');
      b.className='choice'; b.innerHTML=svgWrap(ART[o.art]||'');
      b.onclick=()=>{
        if(o.label===target.label){
          b.classList.add('right'); score++;
          $('gameScore').textContent=`⭐ ${score}`;
          $('cheer').textContent=cheers[Math.random()*cheers.length|0];
          celebrate(target.label);
          setTimeout(newRound,1700);
        } else {
          soft(); b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
        }
      };
      grid.appendChild(b);
    });
  }

  /* ---- screen switching ---- */
  function show(id){
    ['menuScreen','storyScreen','gameScreen'].forEach(s=>{
      const el=$(s); if(el) el.classList.toggle('active', s===id);
    });
  }
  function backToMenu(){ show('menuScreen'); }

  window.LO = { openStory, openGame, nextPage, prevPage, backToMenu };
  renderMenu(); show('menuScreen');
})();
