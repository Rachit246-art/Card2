/* ==========================================================
   Theme: ROSE GATE
   A wrought-iron garden gate, pink roses, fairy lights, champagne gold.
   Supplies the crest, icons, map, decor, entry and copy to the engine.
   ========================================================== */
window.THEME = (function () {
  'use strict';
  var D = window.INVITE || { couple: { monogram: ['A', 'P'] } };
  var INK = '#4a2a2e', GOLD = '#b08650', GOLD_LT = '#e3c98f', IVORY = '#fbf5ec', PAPER = '#fffaf4', ROSE = '#c97b8b';
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var mono = (D.couple && D.couple.monogram) || [D.couple.groom.first[0], D.couple.bride.first[0]];
  var seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

  /* ---------- a small stylised rose, drawn from above ---------- */
  function rose(x, y, r, c1, c2, uid) {
    var s = '<g transform="translate(' + x + ' ' + y + ')">', i, a;
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; s += '<circle cx="' + (Math.cos(a) * r * 0.74).toFixed(1) + '" cy="' + (Math.sin(a) * r * 0.74).toFixed(1) + '" r="' + (r * 0.46).toFixed(1) + '" fill="' + c1 + '"/>'; }
    s += '<circle r="' + (r * 0.78).toFixed(1) + '" fill="' + c1 + '"/><circle r="' + (r * 0.55).toFixed(1) + '" fill="' + c2 + '"/>';
    s += '<path d="M0 0a' + (r * 0.1).toFixed(1) + ' ' + (r * 0.1).toFixed(1) + ' 0 1 1 ' + (r * 0.2).toFixed(1) + ' 0a' + (r * 0.2).toFixed(1) + ' ' + (r * 0.2).toFixed(1) + ' 0 1 1 ' + (-r * 0.4).toFixed(1) + ' 0a' + (r * 0.3).toFixed(1) + ' ' + (r * 0.3).toFixed(1) + ' 0 1 1 ' + (r * 0.6).toFixed(1) + ' 0a' + (r * 0.4).toFixed(1) + ' ' + (r * 0.4).toFixed(1) + ' 0 1 1 ' + (-r * 0.8).toFixed(1) + ' 0" fill="none" stroke="#9c4a5d" stroke-opacity=".38" stroke-width="' + Math.max(1, r * 0.07).toFixed(1) + '" stroke-linecap="round"/>';
    return s + '</g>';
  }
  function leaf(x, y, rot, sz, dark) {
    return '<path transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sz + ')" d="M0 0C6-12 22-14 32 0 22 14 6 12 0 0z" fill="' + (dark ? '#6f8b64' : '#8fa883') + '"/>';
  }
  /* a rose branch that hangs from a page corner; the CSS flips and places it */
  function branch() {
    var s = '<svg class="branch" viewBox="0 0 230 270" aria-hidden="true"><path d="M-6 14C60 24 96 70 112 140S150 236 214 262" fill="none" stroke="#7b8f6c" stroke-width="3.2" stroke-linecap="round"/><path d="M40 20C70 50 70 86 62 118" fill="none" stroke="#7b8f6c" stroke-width="2.4" stroke-linecap="round"/>';
    s += leaf(60, 34, 50, 1.0) + leaf(88, 62, 20, 0.95, 1) + leaf(106, 104, 70, 1.05) + leaf(120, 168, 40, 1.0, 1) + leaf(150, 214, 62, 0.9) + leaf(70, 76, 120, 0.8, 1) + leaf(52, 104, 100, 0.8);
    s += rose(30, 30, 28, '#ecb3bf', '#f6d3d9') + rose(94, 84, 21, '#fff0ec', '#fbdfe0') + rose(116, 142, 25, '#eeb6c1', '#f8d8dd') + rose(60, 134, 15, '#fff0ec', '#fbdfe0') + rose(176, 232, 19, '#fff0ec', '#fbdfe0');
    s += '<circle cx="196" cy="252" r="5" fill="#f3c9d0"/><circle cx="64" cy="62" r="4.5" fill="#f3c9d0"/>';
    return s + '</svg>';
  }

  /* ---------- fairy-light string: a sagging wire with twinkling bulbs ---------- */
  var lgn = 0;
  function lights(n, tone) {
    var gid = 'lg' + tone + (lgn++);
    var W = 480, H = 64, seg = W / n, d = 'M-6 6', bulbs = '', k, t, x0, x1, cx, cy, bx, by, u, i = 0;
    for (k = 0; k < n; k++) {
      x0 = k * seg; x1 = (k + 1) * seg; cx = (x0 + x1) / 2; cy = 6 + 46 - (k % 2) * 8;
      d += 'Q' + cx.toFixed(1) + ' ' + cy + ' ' + x1.toFixed(1) + ' 6';
      for (t = 0.22; t < 0.9; t += 0.28) {
        u = 1 - t; bx = u * u * x0 + 2 * u * t * cx + t * t * x1; by = u * u * 6 + 2 * u * t * cy + t * t * 6;
        bulbs += '<g class="bulb" style="animation-delay:-' + (rnd() * 4).toFixed(2) + 's"><circle cx="' + bx.toFixed(1) + '" cy="' + (by + 5).toFixed(1) + '" r="10" fill="url(#' + gid + ')"/><circle cx="' + bx.toFixed(1) + '" cy="' + (by + 5).toFixed(1) + '" r="2.9" fill="' + (tone === 'n' ? '#fff6dc' : '#ffe9a6') + '" stroke="' + (tone === 'n' ? 'none' : '#d3a64e') + '" stroke-width=".6"/></g>'; i++;
      }
    }
    return '<svg class="lights" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="' + gid + '"><stop offset="0" stop-color="' + (tone === 'n' ? '#fff1c2' : '#ffc95e') + '" stop-opacity="' + (tone === 'n' ? '.75' : '.85') + '"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs><path d="' + d + '" fill="none" stroke="' + (tone === 'n' ? '#d9bd80' : '#a9987a') + '" stroke-width="1" stroke-opacity=".7"/>' + bulbs + '</svg>';
  }

  /* ---------- drifting petals (pure CSS, stays inside its section) ---------- */
  function petals(n, tone) {
    var s = '<div class="petals' + (tone ? ' is-' + tone : '') + '" aria-hidden="true">', i;
    for (i = 0; i < n; i++) s += '<i style="left:' + (rnd() * 96).toFixed(1) + '%;--d:' + (13 + rnd() * 12).toFixed(1) + 's;--dl:-' + (rnd() * 20).toFixed(1) + 's;--sz:' + (9 + rnd() * 9).toFixed(0) + 'px;--sw:' + (14 + rnd() * 34).toFixed(0) + 'px"></i>';
    return s + '</div>';
  }
  function twinkles(n) {
    var s = '<div class="tw-field" aria-hidden="true">', i;
    for (i = 0; i < n; i++) s += '<i class="tw" style="left:' + (rnd() * 96).toFixed(1) + '%;top:' + (rnd() * 96).toFixed(1) + '%;--s:' + (6 + rnd() * 9).toFixed(0) + 'px;animation-delay:-' + (rnd() * 5).toFixed(2) + 's"></i>';
    return s + '</div>';
  }
  function rule() {
    return '<svg class="rule" viewBox="0 0 160 14" aria-hidden="true"><path d="M0 7h62M98 7h62" stroke="' + GOLD + '" stroke-width="1"/>' + rose(80, 7, 6, '#e9a6b4', '#f6d3d9') + '<circle cx="66" cy="7" r="1.6" fill="' + GOLD + '"/><circle cx="94" cy="7" r="1.6" fill="' + GOLD + '"/></svg>';
  }

  /* ---------- rose corner: double rose-gold frame, a rose cluster and two leafy twigs; CSS mirrors it into all four corners ---------- */
  var cgn = 0;
  function corner() {
    var arm, s = '<svg class="corner" viewBox="0 0 150 150" aria-hidden="true">';
    s += '<g fill="none" stroke="#c4909a" stroke-linecap="square"><path d="M6 114V6H114" stroke-width="1.5"/><path d="M13 105V13H105" stroke-width=".7" stroke-opacity=".8"/></g>';
    arm = '<path d="M52 36C70 28 92 26 116 30" fill="none" stroke="#7b8f6c" stroke-width="1.6" stroke-linecap="round"/>' +
      leaf(62, 32, -30, .5) + leaf(64, 33, 36, .46) + leaf(84, 28, -32, .46) + leaf(86, 30, 34, .42) + leaf(104, 29, -28, .38) +
      rose(78, 30, 9, '#fff0ec', '#fbdfe0') + rose(112, 31, 6, '#eeb6c1', '#f8d8dd') +
      '<circle cx="96" cy="26" r="2.6" fill="#f3c9d0"/><circle cx="124" cy="32" r="2.1" fill="#f3c9d0"/>';
    s += arm + '<g transform="matrix(0 1 1 0 0 0)">' + arm + '</g>';
    s += leaf(46, 50, 62, .6) + leaf(50, 46, 28, .6, 1) + leaf(24, 48, 118, .5) + leaf(48, 24, -28, .5);
    s += rose(33, 33, 18, '#ecb3bf', '#f6d3d9') + '<circle cx="58" cy="58" r="3" fill="#f3c9d0"/><circle cx="64" cy="52" r="2" fill="#f3c9d0"/><circle cx="52" cy="64" r="2" fill="#f3c9d0"/>';
    return s + '</svg>';
  }
  function CT(cls, svg) { return svg.replace('class="corner"', 'class="corner ' + cls + '"'); }
  function corners() { return CT('c-tl', corner()) + CT('c-tr', corner()) + CT('c-bl', corner()) + CT('c-br', corner()); }

  /* what sits behind each "page": the same four rose corners on every page, plus petals and sparkles */
  function pageDecor(key) {
    var B = '<div class="decor" aria-hidden="true">';
    switch (key) {
      case 'hero':      return B + corners() + '</div>';
      case 'date':      return B + corners() + petals(7) + '</div>';
      case 'sangeet':   return B + corners() + petals(9) + '</div>';
      case 'wedding':   return B + corners() + petals(10) + '</div>';
      case 'reception': return B + corners() + petals(9, 'gold') + twinkles(14) + '</div>';
      case 'more':      return B + corners() + petals(6) + '</div>';
      case 'story':     return B + corners() + petals(5) + '</div>';
      case 'location':  return B + corners() + petals(5) + '</div>';
      case 'rsvp':      return B + corners() + petals(4) + '</div>';
      case 'closing':   return B + corners() + petals(8) + '</div>';
    }
    return '';
  }

  /* ---------- crest: initials inside a rose-leaf ring ---------- */
  function crest(cls) {
    var s = '', i, th, x, y, rot, side;
    for (side = -1; side <= 1; side += 2) {
      for (i = 0; i < 6; i++) {
        th = (180 + side * (22 + i * 16)) * Math.PI / 180;
        x = 60 + 42 * Math.sin(th); y = 60 - 42 * Math.cos(th); rot = (th * 180 / Math.PI) + 90 + side * 24;
        s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="2.6" ry="7" transform="rotate(' + rot.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')" fill="#8fa883" fill-opacity=".8"/>';
      }
    }
    return '<svg viewBox="0 0 120 120" role="img" aria-label="' + esc(mono[0] + ' and ' + mono[1]) + ' monogram" class="' + (cls || 'crest-svg') + '">' +
      '<circle cx="60" cy="60" r="57" fill="' + PAPER + '" fill-opacity=".55" stroke="' + GOLD + '" stroke-width="1.1"/><circle cx="60" cy="60" r="53.5" fill="none" stroke="' + GOLD + '" stroke-width=".6"/>' +
      s + rose(60, 9, 8, '#e9a6b4', '#f6d3d9') +
      '<text x="60" y="71" text-anchor="middle" font-family="\'Pinyon Script\',Georgia,serif" font-size="40" fill="' + INK + '">' + esc(mono[0]) +
        '<tspan font-size="20" dx="3" dy="-2" fill="' + GOLD + '">&amp;</tspan><tspan dx="3" dy="2">' + esc(mono[1]) + '</tspan></text></svg>';
  }

  /* ---------- Ganesh Ji seal: gold line art on ivory ---------- */
  var ganeshSeal = '<div class="seal"><img src="assets/images/ganesh.webp" alt="Ganesh Ji" width="380" height="366" decoding="async"></div>';

  /* ---------- function icons: gold line art ---------- */
  var icons = {};
  var L = 'fill="none" stroke="' + GOLD + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var F = 'fill="' + GOLD_LT + '" fill-opacity=".32"';
  icons.kalash = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M60 50C50 46 40 38 38 26c11 0 19 8 22 24z"/><path d="M60 50c10-4 20-12 22-24-11 0-19 8-22 24z"/><path d="M60 48c-5-9-5-19 0-30 5 11 5 21 0 30z"/><path d="M44 60h32"/><path d="M47 60c-9 7-12 19-7 29 4 8 12 12 20 12s16-4 20-12c5-10 2-22-7-29" ' + F + '/><path d="M43 78q17 7 34 0"/><path d="M50 104h20"/></g></svg>';
  icons.haldi = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M24 68h72c-2 20-16 32-36 34S26 88 24 68z" ' + F + '/><path d="M60 64c-9-6-12-15-8-26 6 2 10 8 8 26z"/><path d="M60 64c9-6 12-15 8-26-6 2-10 8-8 26z"/><path d="M60 64c-12-2-20-9-22-20 8-1 17 4 22 20z"/><path d="M60 64c12-2 20-9 22-20-8-1-17 4-22 20z"/><circle cx="60" cy="58" r="3"/><path d="M48 106h24"/></g></svg>';
  icons.mehendi = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M70 18C42 20 28 44 34 68c5 20 22 32 40 28 16-4 24-20 18-34-5-12-18-14-26-6-6 6-4 15 3 17" ' + F + '/><path d="M70 18c10 2 18 8 22 17"/><circle cx="48" cy="58" r="3"/><circle cx="54" cy="76" r="2.4"/><circle cx="40" cy="72" r="2"/><path d="M46 44c6-8 14-12 22-12"/></g></svg>';
  icons.sangeet = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M30 46q30-10 60 0v38q-30 10-60 0z" ' + F + '/><ellipse cx="30" cy="65" rx="6" ry="19"/><ellipse cx="90" cy="65" rx="6" ry="19"/><path d="M36 50l9 30 15-27 15 27 9-30"/><path d="M92 24v-12l12 3v12"/><circle cx="88" cy="25" r="3.4" ' + F + '/><circle cx="100" cy="28" r="3.4" ' + F + '/></g></svg>';
  icons.baraat = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M16 62Q60-2 104 62q-11-8-22 0-11-8-22 0-11-8-22 0-11-8-22 0z" ' + F + '/><path d="M60 62v44q0 8 8 8"/><path d="M60 20V10"/><circle cx="60" cy="8" r="2.6"/><path d="M60 26c-14 8-24 18-30 34M60 26c14 8 24 18 30 34"/><path d="M36 70v8M48 70v8M60 70v8M72 70v8M84 70v8"/></g></svg>';
  icons.pheras = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M60 10C47 32 42 46 49 58c5 8 17 8 22 0 7-12 2-26-11-48z" ' + F + '/><path d="M60 38c-5 8-6 14-3 18 3 4 9 1 9-5 0-4-3-8-6-13z"/><circle cx="48" cy="90" r="14"/><circle cx="72" cy="90" r="14"/><path d="M52 74l8-6 8 6" stroke-width="1.4"/></g></svg>';
  icons.disco = '<svg viewBox="0 0 120 120" aria-hidden="true"><g ' + L + '><path d="M26 30h30l-2 22c-1 9-6 14-13 14s-12-5-13-14z" ' + F + ' transform="rotate(-14 41 48)"/><path d="M64 30h30l-2 22c-1 9-6 14-13 14s-12-5-13-14z" ' + F + ' transform="rotate(14 79 48)"/><path d="M34 66l-8 36M86 66l8 36"/><path d="M18 104h16M86 104h16"/><path d="M60 16v-6M50 20l-3-5M70 20l3-5"/></g></svg>';
  icons.reception = icons.disco;

  /* ---------- venue map: blush plan with a rose pin ---------- */
  var map =
    '<svg class="map-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated map showing the venue location">' +
      '<rect width="400" height="300" fill="#f7ebe4"/>' +
      '<path d="M0 232C60 214 92 258 150 248s80 36 150 52H0z" fill="#dfe6e4"/><path d="M0 232C60 214 92 258 150 248s80 36 150 52" fill="none" stroke="#c3d0cd" stroke-width="1.5"/>' +
      '<rect x="22" y="22" width="108" height="74" rx="6" fill="#dfe8cf"/><g fill="#c4d3ae"><circle cx="50" cy="48" r="10"/><circle cx="80" cy="40" r="8"/><circle cx="98" cy="68" r="10"/><circle cx="58" cy="76" r="7"/></g>' +
      '<g fill="#f0dfd6" stroke="#e2cbbf" stroke-width="1"><rect x="152" y="24" width="62" height="52" rx="3"/><rect x="232" y="24" width="40" height="52" rx="3"/><rect x="298" y="24" width="82" height="52" rx="3"/><rect x="22" y="176" width="112" height="40" rx="3"/><rect x="152" y="176" width="70" height="40" rx="3"/><rect x="300" y="176" width="80" height="40" rx="3"/></g>' +
      '<g fill="none" stroke-linecap="round"><path d="M-10 142C90 128 190 170 410 134" stroke="#e2cbbf" stroke-width="20"/><path d="M-10 142C90 128 190 170 410 134" stroke="#fffaf4" stroke-width="15"/><path d="M138-10C150 80 118 200 170 310" stroke="#e2cbbf" stroke-width="16"/><path d="M138-10C150 80 118 200 170 310" stroke="#fffaf4" stroke-width="11"/><path d="M290-10L276 310" stroke="#e2cbbf" stroke-width="16"/><path d="M290-10L276 310" stroke="#fffaf4" stroke-width="11"/></g>' +
      '<circle cx="146" cy="146" r="16" fill="#fffaf4" stroke="#e2cbbf" stroke-width="1.5"/>' +
      '<g transform="translate(283 140)"><circle class="pulse" cx="0" cy="0" r="12" fill="none" stroke="' + ROSE + '" stroke-width="2"/><g class="pin-g"><path d="M0 0C-13-19-20-30-20-41a20 20 0 1 1 40 0c0 11-7 22-20 41z" fill="' + ROSE + '"/><circle cx="0" cy="-41" r="11" fill="#fffaf4"/><circle cx="0" cy="-41" r="5" fill="#e9a6b4"/></g></g>' +
    '</svg>';

  /* ---------- tap prompt + entry ---------- */
  function tapSticker(label) { return '<div class="tap-sticker" aria-hidden="true"><span class="tap-dot"></span><span class="tap-text">' + esc(label || 'tap to enter') + '</span></div>'; }
  function monoLine() { return '<div class="mono-line" aria-hidden="true"><span>' + esc(mono[0]) + '</span><i>&amp;</i><span>' + esc(mono[1]) + '</span></div>'; }
  function videoOverlay(D2, sticker) { return '<div class="vo-plaque">' + monoLine() + sticker + '</div>'; }
  function entry(D2) {   /* fallback entry, used only if the clip cannot load */
    var label = (D2.entry && D2.entry.tapLabel) || 'tap to enter';
    return '<div class="ep-scene"><div class="ep-frame"><div class="ep-inner"><div class="ep-glow"></div></div>' +
      '<div class="ep-leaf ep-left"><i></i></div><div class="ep-leaf ep-right"><i></i></div></div>' +
      '<div class="vo-plaque">' + monoLine() + tapSticker(label) + '</div></div>';
  }

  return {
    id: 'rose-gate',
    ink: INK, paper: PAPER, keepCase: true,
    bodyFont: 'Jost, system-ui, sans-serif', foilFont: 'Pinyon Script, Georgia, serif',
    entryMs: 3000,
    ganesh: ganeshSeal,
    icons: icons, map: map,
    entry: entry, tapSticker: tapSticker, videoOverlay: videoOverlay,
    pageDecor: pageDecor, closingDecor: rule, rule: rule,
    bg: {   /* frames from the entry clip, blurred and washed by the CSS behind every page */
      date: 'assets/images/bg/gate.jpg', sangeet: 'assets/images/bg/path.jpg', wedding: 'assets/images/bg/gate.jpg', reception: 'assets/images/bg/sky.jpg',
      more: 'assets/images/bg/sky.jpg', story: 'assets/images/bg/path.jpg', location: 'assets/images/bg/gate.jpg', rsvp: 'assets/images/bg/sky.jpg', closing: 'assets/images/bg/path.jpg'
    },
    foil: { stops: ['#b98a3f', '#ecd596', '#fff3c9', '#d2a559', '#a67a30', '#ead08f', '#c8994c'], ink: '#6e4f1c', label: 'Scratch here', shine: '#fff6d8' },
    fx: { petals: ['#f2b8c4', '#f8d3da', '#fff0ec', '#e9a6b4'], confetti: ['#e3c98f', '#f8d3da', '#fff0ec', '#e9a6b4', '#d9bd80'], sparkle: ['#fff6dc', '#f3dca0', '#f8d3da'] },
    copy: {
      timeLabel: 'Ceremony at',
      together: 'Together with their families',
      sonOf: 'Son of', daughterOf: 'Daughter of',
      heroCue: 'Reveal the date',
      scratchTitle: 'Save the date', scratchSub: 'Scratch the gold leaf with your finger.',
      revealBtn: 'Reveal without scratching', scratchMe: 'Scratch here',
      countTitle: 'Counting down', days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', countDone: 'The celebrations have begun',
      calGoogle: 'Google Calendar', calApple: 'Apple or Outlook', calAdd: 'Add to calendar', viewMap: 'View on map',
      icsFail: 'Could not download. Please use the Google Calendar button.',
      moreTitle: 'More celebrations', moreSub: 'Swipe through the other occasions',
      storyTitle: 'Our story', storySub: 'A few moments we treasure',
      locTitle: 'Find us here', locChip: 'Open in Google Maps',
      directions: 'Get directions', copyAddr: 'Copy address', copied: 'Address copied',
      copyFail: 'Could not copy. Press and hold the address to copy it.',
      rsvpTitle: 'Will you join us?', rsvpSub: 'Reply on WhatsApp so the families can plan.',
      rsvpName: 'Your name', rsvpYes: 'Joyfully accept', rsvpNo: 'Regretfully decline', rsvpGuests: 'Number of guests', rsvpNote: 'A note for the couple (optional)',
      rsvpSend: 'Send RSVP on WhatsApp', rsvpNeedName: 'Please add your name so the families know who replied.',
      rsvpReady: 'Your reply is ready.', rsvpOpen: 'Open WhatsApp',
      musicOn: 'Pause music', musicOff: 'Play music',
      closingTitle: 'We look forward to celebrating with you'
    }
  };
})();
