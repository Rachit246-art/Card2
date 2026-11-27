/**
 * Royal Indian Artwork Registry & Hero Layered SVG Scenes
 */
window.RoyalArtwork = {
  images: {
    story1: "assets/images/story-1.jpg",
    story2: "assets/images/story-2.jpg",
    story3: "assets/images/story-3.jpg",
    story4: "assets/images/story-4.jpg",
    mehendi: "assets/images/event-mehendi.jpg",
    sangeet: "assets/images/event-sangeet.jpg",
    wedding: "assets/images/event-wedding.jpg",
    reception: "assets/images/event-reception.jpg",
    women: "assets/images/outfit-women.jpg",
    men: "assets/images/outfit-men.jpg",
    venue: "assets/images/venue-palace.jpg"
  },

  renderHeroPalace(container) {
    if (!container) return;
    container.innerHTML = `
      <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" style="width:100%;height:78vh;opacity:0.95;" aria-hidden="true">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f5d887"/>
            <stop offset="50%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#9b6e19"/>
          </linearGradient>
          <linearGradient id="palaceWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1b2b4f"/>
            <stop offset="55%" stop-color="#111d38"/>
            <stop offset="100%" stop-color="#091022"/>
          </linearGradient>
          <radialGradient id="palaceGlow" cx="50%" cy="65%" r="55%">
            <stop offset="0%" stop-color="rgba(245,200,105,0.42)"/>
            <stop offset="65%" stop-color="rgba(212,175,55,0.12)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <ellipse cx="720" cy="360" rx="580" ry="200" fill="url(#palaceGlow)"/>
        <path d="M0 440 Q260 370 540 420 T1060 400 T1440 430 L1440 520 L0 520 Z" fill="#080e1d"/>
        <g stroke="rgba(245,216,135,0.45)" stroke-width="1.2">
          <rect x="210" y="300" width="220" height="170" fill="url(#palaceWall)"/>
          <rect x="1010" y="300" width="220" height="170" fill="url(#palaceWall)"/>
          <path d="M245 300 Q285 245 325 300 Z" fill="#182749"/>
          <path d="M1115 300 Q1155 245 1195 300 Z" fill="#182749"/>
          <line x1="285" y1="245" x2="285" y2="230" stroke="#f5d887" stroke-width="2"/>
          <line x1="1155" y1="245" x2="1155" y2="230" stroke="#f5d887" stroke-width="2"/>
          <rect x="430" y="230" width="580" height="240" fill="url(#palaceWall)"/>
          <path d="M620 230 Q720 105 820 230 Z" fill="#1c2f59"/>
          <line x1="720" y1="118" x2="720" y2="92" stroke="#f5d887" stroke-width="2.5"/>
          <circle cx="720" cy="90" r="4" fill="#f5d887"/>
          <path d="M475 230 Q535 155 595 230 Z" fill="#18284d"/>
          <path d="M845 230 Q905 155 965 230 Z" fill="#18284d"/>
          ${[480, 560, 640, 720, 800, 880, 960].map(x => `
            <path d="M${x - 18} 320 L${x - 18} 275 Q${x} 254 ${x + 18} 275 L${x + 18} 320 Z" fill="rgba(255,204,102,0.58)" stroke="#f5d887"/>
            <path d="M${x - 16} 410 L${x - 16} 355 Q${x} 335 ${x + 16} 355 L${x + 16} 410 Z" fill="rgba(255,190,85,0.45)" stroke="#f5d887"/>
          `).join("")}
        </g>
        <rect x="160" y="468" width="1120" height="14" fill="#111b33"/>
        <rect x="120" y="482" width="1200" height="18" fill="#0b1326"/>
      </svg>
    `;
  },

  renderHeroArches(container) {
    if (!container) return;
    container.innerHTML = `
      <svg viewBox="0 0 1440 800" preserveAspectRatio="none" style="width:100%;height:100%;" aria-hidden="true">
        <defs>
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255,214,112,0.9)"/>
            <stop offset="45%" stop-color="rgba(255,168,52,0.38)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <g opacity="0.92">
          <path d="M0 0 L260 0 Q150 140 80 340 Q40 460 0 560 Z" fill="#0c1a1c"/>
          <path d="M1440 0 L1180 0 Q1290 140 1360 340 Q1400 460 1440 560 Z" fill="#0c1a1c"/>
          ${[
            [58,72,26,"#d64b7c"],[115,48,22,"#ea7aa1"],[170,38,18,"#c93a6b"],
            [42,155,24,"#ea7aa1"],[94,132,20,"#d64b7c"],[36,245,22,"#c93a6b"],
            [1382,72,26,"#d64b7c"],[1325,48,22,"#ea7aa1"],[1270,38,18,"#c93a6b"],
            [1398,155,24,"#ea7aa1"],[1346,132,20,"#d64b7c"],[1404,245,22,"#c93a6b"]
          ].map(([cx,cy,r,c]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="0.88"/>`).join("")}
        </g>
        ${[[145,165],[225,115],[1295,165],[1215,115]].map(([lx,ly]) => `
          <g>
            <line x1="${lx}" y1="0" x2="${lx}" y2="${ly - 18}" stroke="#d4af37" stroke-width="1.5"/>
            <circle cx="${lx}" cy="${ly}" r="52" fill="url(#lanternGlow)">
              <animate attributeName="opacity" values="0.72;1;0.82" dur="2.6s" repeatCount="indefinite"/>
            </circle>
            <polygon points="${lx-10},${ly-14} ${lx+10},${ly-14} ${lx+13},${ly+12} ${lx-13},${ly+12}" fill="#ffcf6e" stroke="#f5d887" stroke-width="1.4"/>
          </g>
        `).join("")}
      </svg>
    `;
  },

  renderHeroCouple(container) {
    if (!container) return;
    container.innerHTML = `
      <svg viewBox="0 0 320 260" style="width:min(280px,56vw);height:auto;opacity:0.9;" aria-hidden="true">
        <defs>
          <linearGradient id="coupleRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f5d887" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#141e38" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <circle cx="122" cy="68" r="17" fill="#10182d" stroke="rgba(245,216,135,0.45)" stroke-width="1"/>
        <path d="M96 96 Q122 86 148 96 L154 240 L90 240 Z" fill="#111a31" stroke="url(#coupleRim)" stroke-width="1.2"/>
        <circle cx="188" cy="78" r="15" fill="#10182d" stroke="rgba(245,216,135,0.45)" stroke-width="1"/>
        <path d="M168 98 Q188 90 208 98 L244 242 L144 242 Z" fill="#1a1830" stroke="rgba(226,120,155,0.55)" stroke-width="1.2"/>
        <path d="M174 88 Q215 110 232 220" fill="none" stroke="rgba(245,216,135,0.4)" stroke-width="2"/>
      </svg>
    `;
  }
};
