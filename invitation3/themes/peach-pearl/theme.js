/* ==========================================================
   Theme: PEACH PEARL
   Peach embossed envelope, pearl clasp, rose-gold blossoms. Names + headings: Prata. Italics: Cormorant Garamond. Script: Birthstone. Text: Outfit.
   ========================================================== */
window.THEME = (function () {
  'use strict';
  var D = window.INVITE || { couple: { monogram: ['A', 'P'] } };
  var INK = '#3a1a15', GOLD = '#934e39', GOLD_LT = '#e9b5a5', PAPER = '#f5eae3';
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var mono = (D.couple && D.couple.monogram) || [D.couple.groom.first[0], D.couple.bride.first[0]];
  var seed = 83;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var uid = 0;

  /* ---------- rose-gold blossom corner: double hairline frame, a blossom cluster, pearl-beaded twigs along both arms; CSS mirrors it into all four corners ---------- */
  var ROSE = '#b97f6c', ROSE_DK = '#9a5f4e', IVORY = '#fff8f1', BLUSH = '#f4d3c4';
  function petalPath(r) {
    return 'M0 0C' + (-.62 * r).toFixed(1) + ' ' + (-.3 * r).toFixed(1) + ' ' + (-.56 * r).toFixed(1) + ' ' + (-.96 * r).toFixed(1) + ' 0 ' + (-r).toFixed(1) + 'C' + (.56 * r).toFixed(1) + ' ' + (-.96 * r).toFixed(1) + ' ' + (.62 * r).toFixed(1) + ' ' + (-.3 * r).toFixed(1) + ' 0 0Z';
  }
  function blossom(x, y, r, rot, id) {
    var s = '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">', i, a;
    for (i = 0; i < 5; i++) s += '<path transform="rotate(' + (i * 72) + ')" d="' + petalPath(r) + '" fill="url(#' + id + ')" stroke="' + ROSE + '" stroke-opacity=".75" stroke-width=".7"/>';
    s += '<circle r="' + (r * .3).toFixed(1) + '" fill="' + BLUSH + '" stroke="' + ROSE + '" stroke-opacity=".6" stroke-width=".6"/>';
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; s += '<circle cx="' + (Math.cos(a) * r * .2).toFixed(1) + '" cy="' + (Math.sin(a) * r * .2).toFixed(1) + '" r="' + (r * .05 + .35).toFixed(1) + '" fill="' + ROSE_DK + '" fill-opacity=".75"/>'; }
    return s + '</g>';
  }
  function leaf(x, y, rot, sc) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 0C4-6 14-7 23 0C14 6 4 6 0 0Z" fill="' + IVORY + '" stroke="' + ROSE + '" stroke-opacity=".7" stroke-width=".7"/><path d="M1.5 0H20" stroke="' + ROSE + '" stroke-opacity=".5" stroke-width=".6"/></g>';
  }
  function pearl(x, y, r, id) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + id + 'p)" stroke="' + ROSE + '" stroke-opacity=".55" stroke-width=".5"/>'; }
  function corner() {
    var id = 'pb' + (uid++), s, k;
    s = '<svg class="corner" viewBox="0 0 150 150" aria-hidden="true"><defs><radialGradient id="' + id + '" cx=".5" cy=".85" r=".95"><stop offset="0" stop-color="#f1c5b2"/><stop offset=".55" stop-color="#fdeee4"/><stop offset="1" stop-color="#fffaf5"/></radialGradient><radialGradient id="' + id + 'p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f3e4da"/><stop offset="1" stop-color="#d9b5a6"/></radialGradient></defs>';
    s += '<g fill="none" stroke="' + ROSE + '" stroke-linecap="round"><path d="M6 112V6H112" stroke-width="1.5"/><path d="M14 98V14H98" stroke-width=".7"/><path d="M112 6h6M6 112v6" stroke-width="1.5"/></g>';
    /* the two twigs, one along each arm: written once for the top arm, then mirrored across the diagonal */
    function arm(sw) {
      function P(x, y) { return sw ? y + ' ' + x : x + ' ' + y; }
      function X(x, y) { return sw ? y : x; } function Y(x, y) { return sw ? x : y; }
      function R(r) { return sw ? 90 - r : r; }
      var t = '<path d="M44 36C64 27 90 22 122 26" fill="none" stroke="' + ROSE + '" stroke-width="1.2" stroke-linecap="round" transform="' + (sw ? 'matrix(0 1 1 0 0 0)' : '') + '"/>';
      var L = [[60, 29, -34, .9], [60, 30, 26, .85], [80, 24, -36, .85], [82, 25, 22, .8], [101, 22, -30, .75], [103, 23, 24, .7]], i;
      for (i = 0; i < L.length; i++) t += leaf(X(L[i][0], L[i][1]), Y(L[i][0], L[i][1]), R(L[i][2]), L[i][3]);
      t += blossom(X(72, 18), Y(72, 18), 8.5, 20, id) + blossom(X(112, 20), Y(112, 20), 6, 40, id);
      t += pearl(X(92, 19), Y(92, 19), 2.2, id) + pearl(X(124, 24), Y(124, 24), 2.4, id) + pearl(X(131, 22), Y(131, 22), 1.6, id) + pearl(X(52, 21), Y(52, 21), 1.7, id);
      return t;
    }
    s += arm(false) + arm(true);
    s += leaf(46, 56, 58, 1) + leaf(56, 46, 32, 1) + leaf(24, 52, 112, .85) + leaf(52, 24, -22, .85);
    s += blossom(33, 33, 17, 8, id) + pearl(60, 60, 2.6, id) + pearl(66, 54, 1.7, id) + pearl(54, 66, 1.7, id) + pearl(20, 16, 1.6, id) + pearl(16, 20, 1.6, id);
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
  /* a small rose-gold blossom between two lines */
  function rule() {
    var s = '<svg class="rule" viewBox="0 0 160 28" aria-hidden="true"><path d="M0 14h56M104 14h56" stroke="' + ROSE + '" stroke-width="1"/><g transform="translate(80 14)">', i;
    for (i = 0; i < 5; i++) s += '<ellipse cx="0" cy="-5.4" rx="3.1" ry="5.6" transform="rotate(' + (i * 72) + ')" fill="' + IVORY + '" stroke="' + ROSE + '" stroke-width="1"/>';
    return s + '<circle r="2.1" fill="' + BLUSH + '" stroke="' + ROSE + '" stroke-width=".8"/></g><circle cx="64" cy="14" r="2" fill="' + IVORY + '" stroke="' + ROSE + '" stroke-width=".8"/><circle cx="96" cy="14" r="2" fill="' + IVORY + '" stroke="' + ROSE + '" stroke-width=".8"/></svg>';
  }
  function T(cls, s) { return s.replace(/class="(corner)([^"]*)"/, 'class="$1$2 ' + cls + '"'); }

  /* what sits behind each "page": the same four rangoli corners everywhere */
  function pageDecor(key) {
    var B = '<div class="decor" aria-hidden="true">';
    function corners() { return T('c-tl', corner()) + T('c-tr', corner()) + T('c-bl', corner()) + T('c-br', corner()); }
    switch (key) {
      case 'hero':      return B + twinkles(10) + '</div>';
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

  /* ---------- venue map: ivory plan, gold roads, a bronze pin ---------- */
  var map =
    '<svg class="map-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated map showing the venue location">' +
      '<rect width="400" height="300" fill="#f2e1d6"/>' +
      '<path d="M0 232C60 214 92 258 150 248s80 36 150 52H0z" fill="#e0d5ce"/><path d="M0 232C60 214 92 258 150 248s80 36 150 52" fill="none" stroke="#cfb9b2" stroke-width="1.5"/>' +
      '<rect x="22" y="22" width="108" height="74" rx="6" fill="#decec3"/><g fill="#cbaba2"><circle cx="50" cy="48" r="10"/><circle cx="80" cy="40" r="8"/><circle cx="98" cy="68" r="10"/><circle cx="58" cy="76" r="7"/></g>' +
      '<g fill="#f8ebe3" stroke="#e0c8b9" stroke-width="1"><rect x="152" y="24" width="62" height="52" rx="3"/><rect x="232" y="24" width="40" height="52" rx="3"/><rect x="298" y="24" width="82" height="52" rx="3"/><rect x="22" y="176" width="112" height="40" rx="3"/><rect x="152" y="176" width="70" height="40" rx="3"/><rect x="300" y="176" width="80" height="40" rx="3"/></g>' +
      '<g fill="none" stroke-linecap="round"><path d="M-10 142C90 128 190 170 410 134" stroke="#b5664e" stroke-width="18"/><path d="M-10 142C90 128 190 170 410 134" stroke="#fcf1e9" stroke-width="13"/><path d="M138-10C150 80 118 200 170 310" stroke="#b5664e" stroke-width="15"/><path d="M138-10C150 80 118 200 170 310" stroke="#fcf1e9" stroke-width="10"/><path d="M290-10L276 310" stroke="#b5664e" stroke-width="15"/><path d="M290-10L276 310" stroke="#fcf1e9" stroke-width="10"/></g>' +
      '<circle cx="146" cy="146" r="16" fill="#fcf1e9" stroke="#b5664e" stroke-width="1.5"/>' +
      '<g transform="translate(283 140)"><circle class="pulse" cx="0" cy="0" r="12" fill="none" stroke="#491a13" stroke-width="2"/><g class="pin-g"><path d="M0 0C-13-19-20-30-20-41a20 20 0 1 1 40 0c0 11-7 22-20 41z" fill="#491a13"/><circle cx="0" cy="-41" r="11" fill="#fcf1e9"/><circle cx="0" cy="-41" r="5" fill="#e9b5a5"/></g></g>' +
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
    id: 'peach-pearl',
    ink: INK, paper: PAPER, keepCase: true,
    bodyFont: "'Outfit', system-ui, sans-serif", foilFont: "'Prata', Georgia, serif",
    entryMs: 3000,
    ganesh: ganeshSeal,
    icons: icons, map: map,
    entry: entry, tapSticker: tapSticker, videoOverlay: videoOverlay,
    pageDecor: pageDecor, closingDecor: rule, rule: rule,
    bg: {
      date: 'assets/bg/cover.jpg', sangeet: 'assets/bg/open.jpg', wedding: 'assets/bg/card.jpg', reception: 'assets/bg/cover.jpg',
      more: 'assets/bg/card.jpg', story: 'assets/bg/open.jpg', location: 'assets/bg/card.jpg', rsvp: 'assets/bg/cover.jpg', closing: 'assets/bg/card.jpg'
    },
    foil: { stops: ['#934e39', '#e6ab99', '#f8ddcb', '#c07159', '#7f422f', '#e1a795', '#ab5c44'], ink: '#3a1a15', label: 'Scratch here', shine: '#fbebe0' },
    fx: { petals: ['#ecc6ac', '#d38b75', '#bb6f58', '#f9e4d6'], confetti: ['#ecc6ac', '#d38b75', '#bb6f58', '#f9e4d6', '#824735'], sparkle: ['#fbebe0', '#eab8a9', '#f4cdb3'] },
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
      storyTitle: 'Our story', storySub: 'Scratch each frame to reveal our favorite moments',
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
