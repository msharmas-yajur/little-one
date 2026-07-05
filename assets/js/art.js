/* ══════════════════════════════════════════════════════════════
   ART LIBRARY
   Simple, original SVG shapes. Content files refer to these by key
   (e.g. art: dog). To add a new picture, add a new key here with an
   SVG group drawn on a 100×100 canvas, then use it in a story or game.
   ══════════════════════════════════════════════════════════════ */
window.ART = {
  sun:`<g><circle cx="50" cy="50" r="24" fill="#F6C453"/>
      ${Array.from({length:8}).map((_,i)=>{const a=i*45*Math.PI/180;
      return `<line x1="${50+30*Math.cos(a)}" y1="${50+30*Math.sin(a)}" x2="${50+40*Math.cos(a)}" y2="${50+40*Math.sin(a)}" stroke="#F6C453" stroke-width="6" stroke-linecap="round"/>`}).join('')}
      <circle cx="42" cy="47" r="3" fill="#4A4038"/><circle cx="58" cy="47" r="3" fill="#4A4038"/>
      <path d="M43 56 Q50 62 57 56" stroke="#4A4038" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,

  bird:`<g><ellipse cx="50" cy="55" rx="26" ry="22" fill="#8FCFE0"/>
      <circle cx="50" cy="34" r="16" fill="#8FCFE0"/>
      <circle cx="45" cy="32" r="3" fill="#4A4038"/><circle cx="56" cy="32" r="3" fill="#4A4038"/>
      <path d="M48 40 L58 44 L48 47 Z" fill="#F6C453"/>
      <path d="M30 55 Q22 60 30 66" fill="#5BB0C7"/></g>`,

  dog:`<g><ellipse cx="50" cy="58" rx="24" ry="20" fill="#D9A066"/>
      <circle cx="50" cy="40" r="18" fill="#E8B87A"/>
      <path d="M30 30 Q26 46 36 48 L40 38 Z" fill="#C98B4E"/>
      <path d="M70 30 Q74 46 64 48 L60 38 Z" fill="#C98B4E"/>
      <circle cx="44" cy="39" r="3" fill="#4A4038"/><circle cx="56" cy="39" r="3" fill="#4A4038"/>
      <ellipse cx="50" cy="47" rx="5" ry="3.5" fill="#4A4038"/>
      <path d="M50 50 V54" stroke="#4A4038" stroke-width="2"/></g>`,

  cat:`<g><ellipse cx="50" cy="58" rx="23" ry="20" fill="#B0A8C9"/>
      <circle cx="50" cy="40" r="17" fill="#C4BDD9"/>
      <path d="M36 28 L40 42 L30 40 Z" fill="#C4BDD9"/>
      <path d="M64 28 L60 42 L70 40 Z" fill="#C4BDD9"/>
      <circle cx="44" cy="39" r="3" fill="#4A4038"/><circle cx="56" cy="39" r="3" fill="#4A4038"/>
      <path d="M50 43 l-3 3 h6 z" fill="#F28C7A"/>
      <line x1="30" y1="44" x2="42" y2="45" stroke="#4A4038" stroke-width="1.5"/>
      <line x1="58" y1="45" x2="70" y2="44" stroke="#4A4038" stroke-width="1.5"/></g>`,

  fish:`<g><ellipse cx="46" cy="50" rx="24" ry="16" fill="#F28C7A"/>
      <path d="M66 50 L82 38 L82 62 Z" fill="#EF7561"/>
      <circle cx="38" cy="46" r="3.5" fill="#4A4038"/>
      <path d="M40 56 Q46 60 54 56" stroke="#fff" stroke-width="2" fill="none"/>
      <circle cx="60" cy="44" r="2" fill="#fff" opacity=".7"/></g>`,

  moon:`<g><path d="M62 22 A30 30 0 1 0 62 78 A24 24 0 1 1 62 22 Z" fill="#F6C453"/>
      <circle cx="40" cy="45" r="2.5" fill="#4A4038"/>
      <path d="M36 54 Q42 58 48 54" stroke="#4A4038" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`,

  star:`<path d="M50 18 L59 40 L83 42 L64 57 L71 80 L50 66 L29 80 L36 57 L17 42 L41 40 Z" fill="#F6C453"/>`,

  flower:`<g>${Array.from({length:6}).map((_,i)=>{const a=i*60*Math.PI/180;
      return `<ellipse cx="${50+18*Math.cos(a)}" cy="${50+18*Math.sin(a)}" rx="11" ry="8" fill="#F28C7A" transform="rotate(${i*60} ${50+18*Math.cos(a)} ${50+18*Math.sin(a)})"/>`}).join('')}
      <circle cx="50" cy="50" r="12" fill="#F6C453"/></g>`,

  cloud:`<g fill="#EAF2F6"><circle cx="38" cy="52" r="16"/><circle cx="56" cy="48" r="20"/><circle cx="66" cy="56" r="14"/><rect x="34" y="52" width="38" height="16" rx="8"/></g>`,

  butterfly:`<g><ellipse cx="38" cy="42" rx="14" ry="17" fill="#B79BD6"/>
      <ellipse cx="62" cy="42" rx="14" ry="17" fill="#B79BD6"/>
      <ellipse cx="40" cy="62" rx="11" ry="13" fill="#8FCFE0"/>
      <ellipse cx="60" cy="62" rx="11" ry="13" fill="#8FCFE0"/>
      <rect x="47" y="34" width="6" height="36" rx="3" fill="#4A4038"/>
      <circle cx="50" cy="32" r="4" fill="#4A4038"/></g>`,

  duck:`<g><ellipse cx="52" cy="58" rx="22" ry="18" fill="#F6C453"/>
      <circle cx="40" cy="42" r="14" fill="#F6C453"/>
      <circle cx="36" cy="40" r="2.6" fill="#4A4038"/>
      <path d="M26 44 L38 46 L26 50 Z" fill="#F28C7A"/></g>`,

  apple:`<g><circle cx="50" cy="56" r="26" fill="#F28C7A"/>
      <path d="M50 30 Q50 20 58 18" stroke="#8DC08A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="24" rx="8" ry="5" fill="#8DC08A" transform="rotate(-30 60 24)"/>
      <ellipse cx="42" cy="48" rx="6" ry="9" fill="#fff" opacity=".4"/></g>`,

  ball:`<g><circle cx="50" cy="50" r="28" fill="#8FCFE0"/>
      <path d="M22 50 h56 M50 22 v56 M30 30 Q50 44 70 30 M30 70 Q50 56 70 70" stroke="#5BB0C7" stroke-width="3" fill="none"/></g>`,

  rain:`<g><g fill="#EAF2F6"><circle cx="38" cy="40" r="15"/><circle cx="56" cy="36" r="19"/><circle cx="66" cy="44" r="13"/><rect x="34" y="40" width="38" height="14" rx="7"/></g>
      ${[30,44,58,70].map((x,i)=>`<line x1="${x}" y1="60" x2="${x-4}" y2="74" stroke="#8FCFE0" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`,

  tree:`<g><rect x="45" y="52" width="10" height="30" rx="4" fill="#C98B4E"/>
      <circle cx="50" cy="40" r="22" fill="#8DC08A"/>
      <circle cx="36" cy="46" r="13" fill="#7DB07A"/>
      <circle cx="64" cy="46" r="13" fill="#7DB07A"/></g>`,

  boat:`<g><path d="M24 56 H76 L68 72 H32 Z" fill="#F28C7A"/>
      <rect x="48" y="28" width="4" height="28" fill="#C98B4E"/>
      <path d="M52 30 L70 50 H52 Z" fill="#8FCFE0"/>
      <path d="M20 74 Q30 80 40 74 T60 74 T80 74" stroke="#5BB0C7" stroke-width="3" fill="none"/></g>`,

  car:`<g><rect x="20" y="48" width="60" height="20" rx="8" fill="#8FCFE0"/>
      <path d="M32 48 Q38 34 50 34 H60 Q68 36 70 48 Z" fill="#B79BD6"/>
      <circle cx="34" cy="70" r="9" fill="#4A4038"/><circle cx="66" cy="70" r="9" fill="#4A4038"/>
      <circle cx="34" cy="70" r="3.5" fill="#EAF2F6"/><circle cx="66" cy="70" r="3.5" fill="#EAF2F6"/></g>`
};

window.svgWrap = function(inner){
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
};
