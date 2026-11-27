/* ==========================================================
   Theme: VELVET CARD
   A maroon velvet invitation folder with antique-gold paisley, marigolds and a brass diya glow.
   Supplies the Ganesh seal, icons, map, decor, entry and copy to the engine.
   ========================================================== */
window.THEME = (function () {
  'use strict';
  var D = window.INVITE || { couple: { monogram: ['A', 'P'] } };
  var INK = '#4a1a22', GOLD = '#a9792c', GOLD_LT = '#f2dc9c', PAPER = '#fbf2de';
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var mono = (D.couple && D.couple.monogram) || [D.couple.groom.first[0], D.couple.bride.first[0]];
  var seed = 83;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var uid = 0;

  /* ---------- a marigold ---------- */
  function marigold(x, y, r) {
    var id = 'mg' + (uid++), s = '<g transform="translate(' + x + ' ' + y + ')"><defs><radialGradient id="' + id + '" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#ffd25a"/><stop offset=".6" stop-color="#f19a28"/><stop offset="1" stop-color="#d4661a"/></radialGradient></defs>', i, a;
    for (i = 0; i < 10; i++) { a = i * 36; s += '<circle cx="' + (Math.sin(a * Math.PI / 180) * r * 0.62).toFixed(1) + '" cy="' + (-Math.cos(a * Math.PI / 180) * r * 0.62).toFixed(1) + '" r="' + (r * 0.42).toFixed(1) + '" fill="url(#' + id + ')" stroke="#b5500f" stroke-opacity=".5" stroke-width=".5"/>'; }
    for (i = 0; i < 6; i++) { a = i * 60 + 30; s += '<circle cx="' + (Math.sin(a * Math.PI / 180) * r * 0.3).toFixed(1) + '" cy="' + (-Math.cos(a * Math.PI / 180) * r * 0.3).toFixed(1) + '" r="' + (r * 0.3).toFixed(1) + '" fill="#f7b73c" stroke="#b5500f" stroke-opacity=".4" stroke-width=".4"/>'; }
    return s + '<circle r="' + (r * 0.2).toFixed(1) + '" fill="#c4560f"/></g>';
  }
  function leaf(x, y, rot, sc) { return '<path transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')" d="M0 0C3-4.5 11-5.5 17-3.5C13 1 6 3 0 0Z" fill="#4f8a3a" stroke="#2f5f22" stroke-width=".4"/>'; }
  function paisley(x, y, rot, sc, stroke) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')" fill="none" stroke="' + stroke + '" stroke-width="1.3" stroke-linecap="round"><path d="M0 0C10-12 26-8 24 8C22 20 8 22 0 12C-4 6 0 2 0 0Z"/><path d="M5 8C10 2 17 3 17 9C17 14 11 15 8 12" stroke-width=".9"/><circle cx="12" cy="9" r="1.2" fill="' + stroke + '"/></g>'; }
  /* a quarter rosette: scalloped rings like a rangoli, radiating from the corner */
  function ring(r, n, cx, cy) {
    var d = '', i, p0, p1, a0, a1, ch;
    for (i = 0; i < n; i++) {
      a0 = (90 * i / n) * Math.PI / 180; a1 = (90 * (i + 1) / n) * Math.PI / 180;
      p0 = [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r]; p1 = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r];
      ch = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2 * 1.04;
      d += (i === 0 ? 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) : '') + 'A' + ch.toFixed(1) + ' ' + ch.toFixed(1) + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
    }
    return d;
  }
  /* one corner: gold rangoli quarter-rosette, two paisleys along the arms and a marigold with mango leaves; CSS mirrors it into all four corners */
  function corner() {
    var id = 'vg' + (uid++);
    var s = '<svg class="corner" viewBox="0 0 150 150" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3dc98"/><stop offset=".5" stop-color="#bb8c38"/><stop offset="1" stop-color="#8a6024"/></linearGradient></defs>';
    s += '<g fill="rgba(210,165,70,.12)" stroke="url(#' + id + ')" stroke-width="1.3" stroke-linecap="round"><path d="' + ring(30, 5, 6, 6) + 'L6 6Z"/><path d="' + ring(48, 8, 6, 6) + '" fill="none"/><path d="' + ring(66, 11, 6, 6) + '" fill="none" stroke-width="1"/></g>';
    s += '<g fill="none" stroke="url(#' + id + ')" stroke-linecap="round"><path d="M6 6H100M6 6V100" stroke-width="1.8"/><path d="M6 80V140M80 6H140" stroke-width="1.4"/></g>';
    s += paisley(86, 14, 8, .62, 'url(#' + id + ')') + paisley(14, 86, 82, .62, 'url(#' + id + ')') + paisley(118, 10, 0, .4, 'url(#' + id + ')') + paisley(10, 118, 90, .4, 'url(#' + id + ')');
    s += leaf(40, 30, 40, 1) + leaf(30, 40, 50, 1) + leaf(46, 22, 10, .8) + leaf(22, 46, 80, .8);
    s += marigold(26, 26, 13) + marigold(58, 12, 6.5) + marigold(12, 58, 6.5);
    return s + '</svg>';
  }
  function twinkles(n) {
    var s = '<div class="tw-field" aria-hidden="true">', i;
    for (i = 0; i < n; i++) s += '<i class="tw" style="left:' + (rnd() * 96).toFixed(1) + '%;top:' + (rnd() * 96).toFixed(1) + '%;--s:' + (6 + rnd() * 9).toFixed(0) + 'px;animation-delay:-' + (rnd() * 5).toFixed(2) + 's;animation-duration:' + (3 + rnd() * 2.4).toFixed(1) + 's"></i>';
    return s + '</div>';
  }
  function bokeh(n) {
    var s = '<div class="bokeh" aria-hidden="true">', i;
    for (i = 0; i < n; i++) s += '<i style="left:' + (rnd() * 98).toFixed(1) + '%;top:' + (rnd() * 96).toFixed(1) + '%;--sz:' + (8 + rnd() * 16).toFixed(0) + 'px;--d:' + (7 + rnd() * 7).toFixed(1) + 's;--dl:-' + (rnd() * 10).toFixed(1) + 's"></i>';
    return s + '</div>';
  }
  function shaft() { return '<div class="shaft" aria-hidden="true"></div>'; }
  /* a small paisley between two lines */
  function rule() {
    return '<svg class="rule" viewBox="0 0 160 28" aria-hidden="true"><path d="M0 14h58M102 14h58" stroke="' + GOLD + '" stroke-width="1"/>' +
      '<g transform="translate(73 5) scale(.5)" fill="none" stroke="' + GOLD + '" stroke-width="2.2" stroke-linecap="round"><path d="M0 0C10-12 26-8 24 8C22 20 8 22 0 12C-4 6 0 2 0 0Z"/><path d="M5 8C10 2 17 3 17 9C17 14 11 15 8 12" stroke-width="1.6"/></g>' +
      '<path d="M92 14l4-4 4 4-4 4z" fill="' + GOLD + '"/><path d="M60 14l4-4 4 4-4 4z" fill="' + GOLD + '"/></svg>';
  }
  function T(cls, s) { return s.replace(/class="(corner)([^"]*)"/, 'class="$1$2 ' + cls + '"'); }

  /* what sits behind each "page": the same four rangoli corners everywhere */
  function pageDecor(key) {
    var B = '<div class="decor" aria-hidden="true">';
    function corners() { return T('c-tl', corner()) + T('c-tr', corner()) + T('c-bl', corner()) + T('c-br', corner()); }
    switch (key) {
      case 'hero':      return B + corners() + twinkles(10) + '</div>';
      case 'date':      return B + shaft() + corners() + twinkles(10) + bokeh(6) + '</div>';
      case 'sangeet':   return B + corners() + twinkles(12) + bokeh(8) + '</div>';
      case 'wedding':   return B + shaft() + corners() + twinkles(14) + bokeh(8) + '</div>';
      case 'reception': return B + corners() + twinkles(22) + bokeh(7) + '</div>';
      case 'more':      return B + corners() + twinkles(8) + bokeh(5) + '</div>';
      case 'story':     return B + corners() + twinkles(8) + bokeh(5) + '</div>';
      case 'location':  return B + corners() + twinkles(8) + bokeh(5) + '</div>';
      case 'rsvp':      return B + corners() + twinkles(8) + '</div>';
      case 'closing':   return B + shaft() + corners() + twinkles(12) + bokeh(8) + '</div>';
    }
    return '';
  }

  /* ---------- Ganesh Ji seal: the marigold medallion ---------- */
  var ganeshSeal = '<div class="seal"><img src="assets/ganesh.webp" alt="Ganesh Ji" width="300" height="300" decoding="async"></div>';

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

  /* ---------- venue map: ivory plan, gold roads, a marigold-and-maroon pin ---------- */
  var map =
    '<svg class="map-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated map showing the venue location">' +
      '<rect width="400" height="300" fill="#f6ebd2"/>' +
      '<path d="M0 232C60 214 92 258 150 248s80 36 150 52H0z" fill="#e3dccb"/><path d="M0 232C60 214 92 258 150 248s80 36 150 52" fill="none" stroke="#d3c8ae" stroke-width="1.5"/>' +
      '<rect x="22" y="22" width="108" height="74" rx="6" fill="#dfe3bf"/><g fill="#c7d19c"><circle cx="50" cy="48" r="10"/><circle cx="80" cy="40" r="8"/><circle cx="98" cy="68" r="10"/><circle cx="58" cy="76" r="7"/></g>' +
      '<g fill="#fbf3df" stroke="#e6d6b2" stroke-width="1"><rect x="152" y="24" width="62" height="52" rx="3"/><rect x="232" y="24" width="40" height="52" rx="3"/><rect x="298" y="24" width="82" height="52" rx="3"/><rect x="22" y="176" width="112" height="40" rx="3"/><rect x="152" y="176" width="70" height="40" rx="3"/><rect x="300" y="176" width="80" height="40" rx="3"/></g>' +
      '<g fill="none" stroke-linecap="round"><path d="M-10 142C90 128 190 170 410 134" stroke="#c4973f" stroke-width="18"/><path d="M-10 142C90 128 190 170 410 134" stroke="#fff8e6" stroke-width="13"/><path d="M138-10C150 80 118 200 170 310" stroke="#c4973f" stroke-width="15"/><path d="M138-10C150 80 118 200 170 310" stroke="#fff8e6" stroke-width="10"/><path d="M290-10L276 310" stroke="#c4973f" stroke-width="15"/><path d="M290-10L276 310" stroke="#fff8e6" stroke-width="10"/></g>' +
      '<circle cx="146" cy="146" r="16" fill="#fff8e6" stroke="#c4973f" stroke-width="1.5"/>' +
      '<g transform="translate(283 140)"><circle class="pulse" cx="0" cy="0" r="12" fill="none" stroke="#7a1f33" stroke-width="2"/><g class="pin-g"><path d="M0 0C-13-19-20-30-20-41a20 20 0 1 1 40 0c0 11-7 22-20 41z" fill="#7a1f33"/><circle cx="0" cy="-41" r="11" fill="#fff8e6"/><circle cx="0" cy="-41" r="5" fill="#f19a28"/></g></g>' +
    '</svg>';

  /* ---------- tap prompt + entry ---------- */
  function tapSticker(label) { return '<div class="tap-sticker" aria-hidden="true"><span class="tap-dot"></span><span class="tap-text">' + esc(label || 'tap to enter') + '</span></div>'; }
  function monoLine() { return '<div class="mono-line" aria-hidden="true"><span>' + esc(mono[0]) + '</span><i>&amp;</i><span>' + esc(mono[1]) + '</span></div>'; }
  function videoOverlay(D2, sticker) { return '<div class="vo-stage" aria-hidden="true"><div class="vo-cover"><div class="vo-plate">' + sticker + '</div></div><div class="vo-mono">' + monoLine() + '</div></div>'; }
  function entry(D2) {   /* fallback entry, used only if the clip cannot load */
    var label = (D2.entry && D2.entry.tapLabel) || 'tap to enter';
    return '<div class="ep-scene"><div class="ep-frame"><div class="ep-inner"><div class="ep-glow"></div></div>' +
      '<div class="ep-leaf ep-left"><i></i></div><div class="ep-leaf ep-right"><i></i></div></div>' +
      '<div class="vo-plaque">' + monoLine() + tapSticker(label) + '</div></div>';
  }

  return {
    id: 'velvet-card',
    ink: INK, paper: PAPER, keepCase: true,
    bodyFont: "'Hind', system-ui, sans-serif", foilFont: "'Yeseva One', Georgia, serif",
    entryMs: 3000,
    ganesh: ganeshSeal,
    icons: icons, map: map,
    entry: entry, tapSticker: tapSticker, videoOverlay: videoOverlay,
    pageDecor: pageDecor, closingDecor: rule, rule: rule,
    bg: {   /* frames from the entry clip, blurred and washed behind every page */
      date: 'assets/bg/card.jpg', sangeet: 'assets/bg/open.jpg', wedding: 'assets/bg/card.jpg', reception: 'assets/bg/cover.jpg',
      more: 'assets/bg/card.jpg', story: 'assets/bg/open.jpg', location: 'assets/bg/card.jpg', rsvp: 'assets/bg/cover.jpg', closing: 'assets/bg/card.jpg'
    },
    foil: { stops: ['#a9792c', '#f1d88e', '#fff3c4', '#cfa04a', '#8a6024', '#ecd08a', '#b98a36'], ink: '#5a1626', label: 'Scratch here', shine: '#fff6d8' },
    fx: { petals: ['#f19a28', '#f7c242', '#e86a1c', '#ffe08a'], confetti: ['#f19a28', '#f7c242', '#b8283f', '#fff0c8', '#bb8c38'], sparkle: ['#fffaf0', '#f8e3a8', '#ffe9c8'] },
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
      rsvpName: 'Your name', rsvpSend: 'Send RSVP on WhatsApp', rsvpNeedName: 'Please add your name so the families know who replied.',
      rsvpReady: 'Your reply is ready.', rsvpOpen: 'Open WhatsApp',
      musicOn: 'Pause music', musicOff: 'Play music',
      closingTitle: 'We look forward to celebrating with you'
    }
  };
})();
