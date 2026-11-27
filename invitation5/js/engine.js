/* ==========================================================
   Invitation engine v3 (shared by every template).
   Reads window.INVITE (couple data) and window.THEME (look + feel)
   and builds the invitation:
     hero > date reveal (scratch card + countdown) > one full page for each
     main function > card deck for the other functions > story > location >
     RSVP > closing.
   Nothing here is theme-specific.
   ========================================================== */
(function () {
  'use strict';
  var D = window.INVITE, T = window.THEME, Sound = window.Sound;
  if (!D || !T) { console.error('invite.js and theme.js must load before engine.js'); return; }

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var KEEP_CASE = !!T.keepCase;
  function lc(x) { x = String(x); return KEEP_CASE ? x : x.toLowerCase(); }
  function cap(x) { x = String(x); return KEEP_CASE ? x.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }) : x; }
  var COPY = Object.assign({
    timeLabel: 'muhurat at', together: 'together with their families', sonOf: 'son of', daughterOf: 'daughter of',
    heroCue: 'reveal the date',
    scratchTitle: 'save the date', scratchSub: 'scratch the gold leaf', revealBtn: 'reveal without scratching', scratchMe: 'scratch here',
    countTitle: 'counting down', days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds', countDone: 'the celebrations have begun',
    calGoogle: 'google calendar', calApple: 'apple or outlook', calAdd: 'add to calendar', viewMap: 'view on map',
    icsFail: 'could not download. use the google calendar button.',
    moreTitle: 'more celebrations', moreSub: 'swipe through the other occasions',
    storyTitle: 'our story', storySub: 'swipe through',
    locTitle: 'find us here', locChip: 'open in google maps',
    directions: 'get directions', copyAddr: 'copy address', copied: 'address copied', copyFail: 'could not copy. press and hold the address to copy it.',
    rsvpTitle: 'will you come?', rsvpSub: 'reply on whatsapp so the families can plan',
    rsvpName: 'your name', rsvpYes: 'yes, i am in', rsvpNo: 'i cannot make it', rsvpGuests: 'how many of you', rsvpNote: 'a note for the couple (optional)',
    rsvpSend: 'send rsvp on whatsapp', rsvpNeedName: 'add your name so the families know who replied.',
    rsvpReady: 'your reply is ready.', rsvpOpen: 'open whatsapp',
    musicOn: 'pause music', musicOff: 'play music',
    closingTitle: 'we look forward to celebrating with you'
  }, T.copy || {});

  var W = D.wedding, C = D.couple, E = D.entry || {};
  var q = new URLSearchParams(window.location.search);
  var guest = (q.get('guest') || '').trim().slice(0, 60);
  var onlyFns = (q.get('fn') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var fns = (D.functions || []).filter(function (f) { return !onlyFns.length || onlyFns.indexOf(f.id) > -1; });
  var pageIds = (D.pages && D.pages.length) ? D.pages : ['sangeet', 'wedding', 'reception'];
  var pages = pageIds.map(function (id) { return fns.filter(function (f) { return f.id === id; })[0]; }).filter(Boolean);
  var deckFns = fns.filter(function (f) { return pageIds.indexOf(f.id) < 0; });
  var LOOKS = ['sangeet', 'wedding', 'reception'];   // the theme styles pages by position: first, middle, last

  /* ---------------- helpers ---------------- */
  var MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  var DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  function dayInfo(ymd) {
    var p = String(ymd).slice(0, 10).split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    var dow = DAYS[d.getUTCDay()], mon = MONTHS[d.getUTCMonth()];
    return { dow: dow, dowShort: dow.slice(0, 3), day: d.getUTCDate(), mon: mon, monShort: mon.slice(0, 3), year: d.getUTCFullYear() };
  }
  function lum(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var ch = [0, 2, 4].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }
  function onColor(hex) { return lum(hex) > 0.3 ? (T.ink || '#1b1b1b') : (T.paper || '#ffffff'); }
  function parents(f, m) {
    var fl = f.split(' '), ml = m.split(' ');
    return fl.length > 1 && ml.length > 1 && fl[fl.length - 1] === ml[ml.length - 1] ? fl.slice(0, -1).join(' ') + ' & ' + m : f + ' & ' + m;
  }
  function letters(word) { return word.split('').map(function (ch, i) { return '<span class="ch" style="--i:' + i + '">' + esc(ch) + '</span>'; }).join(''); }
  var toastTimer;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2600); }
  function svgIcon(p) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var IC = {
    cal: svgIcon('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'),
    clock: svgIcon('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    pin: svgIcon('<path d="M12 21s7-6.2 7-11.2A7 7 0 0 0 5 9.8C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.6"/>'),
    wear: svgIcon('<path d="M9 4l3 2 3-2 5 3-2 4-2-1v10H8V10l-2 1-2-4z"/>'),
    prev: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ---------------- particles (petals, confetti, sparkle, gold flecks) ---------------- */
  var FX = (function () {
    var cv = $('#fx'), ctx = cv.getContext('2d'), P = [], raf = 0, amb = false, last = 0, spawn = 0, W_ = 0, H_ = 0;
    var COL = (T.fx && T.fx.petals) || ['#ff8a00', '#ffc928', '#e6307a'];
    var CONF = (T.fx && T.fx.confetti) || ['#ff8a00', '#ffc928', '#e6307a', '#8fd18a', '#fff0c9'];
    var FLECK = ['#c99a47', '#e6c276', '#f6e2a0', '#a87c32'];
    function size() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W_ = window.innerWidth; H_ = window.innerHeight;
      cv.width = Math.round(W_ * dpr); cv.height = Math.round(H_ * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size(); window.addEventListener('resize', size);
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function add(p) { P.push(p); if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    function star(x, y, r) {
      ctx.beginPath();
      for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, rr = i % 2 ? r * 0.28 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
      ctx.closePath(); ctx.fill();
    }
    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, W_, H_);
      if (amb && !reduce) {
        spawn -= dt;
        if (spawn <= 0 && P.filter(function (p) { return p.amb; }).length < 9) {
          spawn = rnd(0.6, 1.3);
          add({ k: 'petal', amb: true, x: rnd(-10, W_ + 10), y: -14, vx: rnd(-12, 12), vy: rnd(34, 62), r: rnd(0, 6.3), vr: rnd(-1.6, 1.6), s: rnd(5, 8.5), c: pick(COL), t: 0, life: 40, g: 0, sw: rnd(0, 6.3), a: 0.85 });
        }
      }
      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i];
        p.t += dt; p.vy += (p.g || 0) * dt;
        if (p.k !== 'spark') { p.vx *= (p.amb ? 1 : 0.985); }
        p.x += (p.vx + (p.amb ? Math.sin(p.t * 1.3 + p.sw) * 18 : 0)) * dt; p.y += p.vy * dt; p.r += (p.vr || 0) * dt;
        if (p.t > p.life || p.y > H_ + 24) { P.splice(i, 1); continue; }
        var fade = Math.min(1, (p.life - p.t) / 0.5), alpha = (p.a == null ? 1 : p.a) * fade;
        ctx.globalAlpha = alpha; ctx.fillStyle = p.c;
        if (p.k === 'petal') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.t * 3 + p.sw)));
          ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.2832); ctx.fill(); ctx.restore();
        } else if (p.k === 'conf' || p.k === 'fleck') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.abs(Math.sin(p.t * 5 + p.sw)) + 0.2);
          ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
        } else { star(p.x, p.y, p.s * (0.5 + 0.5 * fade)); }
      }
      ctx.globalAlpha = 1;
      if (P.length || amb) raf = requestAnimationFrame(loop); else { raf = 0; ctx.clearRect(0, 0, W_, H_); }
    }
    return {
      ambient: function (on) { amb = !!on && !reduce; if (amb && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } },
      burst: function (x, y, n) {
        n = reduce ? Math.min(n, 14) : n;
        for (var i = 0; i < n; i++) {
          var a = rnd(-Math.PI * 0.95, -Math.PI * 0.05), sp = rnd(160, 520), conf = i % 3 !== 0;
          add({ k: conf ? 'conf' : 'petal', x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rnd(0, 6.3), vr: rnd(-8, 8), s: rnd(6, 10), c: conf ? pick(CONF) : pick(COL), t: 0, life: rnd(1.8, 3.2), g: 520, sw: rnd(0, 6.3) });
        }
      },
      sparkle: function (x, y, n) {
        if (reduce) return;
        for (var i = 0; i < n; i++) add({ k: 'spark', x: x + rnd(-14, 14), y: y + rnd(-14, 14), vx: rnd(-40, 40), vy: rnd(-60, 10), s: rnd(4, 8), c: pick(T.fx && T.fx.sparkle || ['#fff0c9', '#ffc928']), t: 0, life: rnd(0.5, 0.9), g: 90 });
      },
      fleck: function (x, y, n) {   /* tiny gold specks that fly off the foil as it is scratched */
        if (reduce) return;
        for (var i = 0; i < n; i++) add({ k: 'fleck', x: x + rnd(-8, 8), y: y + rnd(-8, 8), vx: rnd(-90, 90), vy: rnd(-130, -20), r: rnd(0, 6.3), vr: rnd(-12, 12), s: rnd(2.5, 5), c: pick(FLECK), t: 0, life: rnd(0.5, 0.95), g: 620, sw: rnd(0, 6.3) });
      }
    };
  })();

  /* ---------------- build page ---------------- */
  var app = $('#app');
  var wd = dayInfo(W.dateISO);

  /* every block after the hero is a "page": its own background, decor and content */
  function sec(key, id, cls, inner) {
    var bg = T.bg && T.bg[key] ? '<div class="pg-bg" style="background-image:url(\'' + esc(T.bg[key]) + '\')"></div>' : '';
    return '<section class="section pg pg-' + key + ' ' + (cls || '') + '" id="' + esc(id) + '">' + bg + (T.pageDecor ? T.pageDecor(key) : '') + '<div class="pg-inner">' + inner + '</div></section>';
  }

  function heroHTML() {
    var g = C.groom, b = C.bride, hasEnd = !!E.endFrame;
    return '<section class="section hero' + (hasEnd ? ' has-endframe' : '') + '" id="hero">' + (T.pageDecor ? T.pageDecor('hero') : '') +
      '<div class="hero-inner">' +
        '<div class="hero-crest">' + T.ganesh + '</div>' +
        (D.invocation ? '<p class="invocation">' + esc(D.invocation) + '</p>' : '') +
        '<p class="together">' + esc(COPY.together) + '</p>' +
        '<h1 class="names">' +
          '<span class="name name-groom" aria-label="' + esc(g.first) + '"><span aria-hidden="true">' + letters(g.first) + '</span></span>' +
          '<span class="amp" aria-hidden="true">&amp;</span>' +
          '<span class="name name-bride" aria-label="' + esc(b.first) + '"><span aria-hidden="true">' + letters(b.first) + '</span></span>' +
        '</h1>' +
        '<div class="hero-card">' +
        '<div class="parents">' +
          '<p class="parent"><span>' + esc(COPY.sonOf) + '</span><b>' + esc(parents(g.father, g.mother)) + '</b></p>' +
          '<p class="parent"><span>' + esc(COPY.daughterOf) + '</span><b>' + esc(parents(b.father, b.mother)) + '</b></p>' +
        '</div>' +
        '<p class="message">' + esc(D.message) + '</p>' +
        '</div>' +
        (guest ? '<p class="guest-chip"><span>made for</span> <b id="guest-name"></b></p>' : '') +
      '</div>' +
      '<a class="cue" href="#date">' + esc(COPY.heroCue) + '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg></a>' +
    '</section>';
  }

  function dateHTML() {
    return sec('date', 'date', 'date-sec',
      '<h2>' + esc(COPY.scratchTitle) + '</h2>' +
      '<p class="sub">' + esc(COPY.scratchSub) + '</p>' +
      '<div class="scratch" id="scratch-card" tabindex="0" role="button" aria-label="Scratch card. Scratch with your finger, or press Enter to reveal the date.">' +
        '<div class="scratch-prize">' +
          '<p class="sp-dow">' + esc(wd.dow) + '</p>' +
          '<p class="sp-day">' + wd.day + '</p>' +
          '<p class="sp-mon">' + esc(wd.mon + ' ' + wd.year) + '</p>' +
          '<p class="sp-time">' + esc(COPY.timeLabel) + ' ' + esc(lc(W.muhurat)) + '</p>' +
        '</div>' +
        '<canvas aria-hidden="true"></canvas>' +
        '<i class="coin" aria-hidden="true"></i>' +
        '<i class="shine" aria-hidden="true"></i>' +
      '</div>' +
      '<button class="link-btn" id="reveal-btn" type="button">' + esc(COPY.revealBtn) + '</button>' +
      '<div class="after-reveal" id="after" hidden>' +
        '<h3>' + esc(COPY.countTitle) + '</h3>' +
        '<div class="count" id="count" role="timer" aria-live="off">' +
          [['d', COPY.days], ['h', COPY.hours], ['m', COPY.minutes], ['s', COPY.seconds]].map(function (x) {
            return '<div class="tile"><b id="cd-' + x[0] + '">00</b><span>' + esc(x[1]) + '</span></div>';
          }).join('') +
        '</div>' +
        '<p class="count-done" id="count-done" hidden>' + esc(COPY.countDone) + '</p>' +
      '</div>');
  }

  function pageHTML(f, i) {
    var key = LOOKS[i % 3], d = dayInfo(f.date), icon = (T.icons && T.icons[f.icon]) || '';
    var addr = f.address || (W.venue && String(f.venue).indexOf(W.venue) === 0 ? W.address : '');
    var map = f.mapsLink || W.mapsLink;
    return sec(key, f.id, 'fn-page',
      '<div class="pg-icon">' + icon + '</div>' +
      '<h2 class="pg-title">' + esc(f.name) + '</h2>' +
      '<div class="dateplate"><p class="dp-dow">' + esc(d.dow) + '</p><p class="dp-day">' + d.day + '</p><p class="dp-mon">' + esc(d.mon + ' ' + d.year) + '</p></div>' +
      '<ul class="pg-facts">' +
        '<li>' + IC.clock + '<span><b>' + esc(lc(f.time)) + '</b></span></li>' +
        '<li>' + IC.pin + '<span><b>' + esc(f.venue) + '</b>' + (addr ? '<em>' + esc(addr) + '</em>' : '') + '</span></li>' +
        '<li>' + IC.wear + '<span><b>' + esc(f.dress) + '</b><em class="swatch-line"><i style="background:' + esc(f.swatch || f.color) + '"></i>' + esc(f.colorName) + '</em></span></li>' +
      '</ul>' +
      '<div class="pg-actions">' +
        '<a class="btn" target="_blank" rel="noopener" href="' + esc(map) + '">' + esc(COPY.viewMap) + '</a>' +
        '<div class="cal"><span>' + esc(COPY.calAdd) + '</span>' +
          '<a class="chip-btn" data-cal="google" data-fn="' + esc(f.id) + '" target="_blank" rel="noopener" href="#">' + esc(COPY.calGoogle) + '</a>' +
          '<button class="chip-btn" data-cal="ics" data-fn="' + esc(f.id) + '" type="button">' + esc(COPY.calApple) + '</button>' +
        '</div>' +
      '</div>');
  }

  function moreHTML() {
    if (!deckFns.length) return '';
    var n = deckFns.length;
    var cards = deckFns.map(function (f, i) {
      var d = dayInfo(f.date), bg = f.color || '#f3d9dc', fg = onColor(bg);
      var icon = (T.icons && T.icons[f.icon]) || '';
      return '<article class="deck-card" data-o="' + (i > 3 ? 'x' : i) + '" style="--card:' + esc(bg) + ';--on:' + fg + '" aria-label="' + esc(f.name) + ', ' + (i + 1) + ' of ' + n + '">' +
        '<div class="card-art">' + icon + '</div>' +
        '<h3>' + esc(f.name) + '</h3>' +
        '<ul class="facts">' +
          '<li>' + IC.cal + '<span>' + esc(cap(d.dowShort + ', ' + d.day + ' ' + d.monShort)) + '</span></li>' +
          '<li>' + IC.clock + '<span>' + esc(lc(f.time)) + '</span></li>' +
          '<li>' + IC.pin + '<span>' + esc(f.venue) + '</span></li>' +
          '<li>' + IC.wear + '<span>' + esc(f.dress) + '</span></li>' +
        '</ul>' +
        '<p class="theme-chip"><i style="background:' + esc(f.swatch || bg) + '"></i>' + esc(f.colorName) + '</p>' +
      '</article>';
    }).join('');
    return sec('more', 'more', 'more-sec',
      '<h2>' + esc(COPY.moreTitle) + '</h2>' + (n > 1 ? '<p class="sub">' + esc(COPY.moreSub) + '</p>' : '') +
      '<div class="deck" id="deck" tabindex="0" role="group" aria-roledescription="carousel" aria-label="More celebrations. Use left and right arrow keys.">' + cards + '</div>' +
      (n > 1 ? '<div class="deck-ui">' +
        '<button class="round" id="deck-prev" type="button" aria-label="Previous function">' + IC.prev + '</button>' +
        '<div class="dots" id="deck-dots">' + deckFns.map(function (f, i) { return '<button type="button" aria-label="Show ' + esc(f.name) + '" data-i="' + i + '"></button>'; }).join('') + '</div>' +
        '<button class="round" id="deck-next" type="button" aria-label="Next function">' + IC.next + '</button>' +
      '</div>' : '') +
      '<p class="sr-only" id="deck-live" aria-live="polite"></p>');
  }

  function storyHTML() {
    var g = D.gallery || [];
    if (!g.length) return '';
    return sec('story', 'story', 'story-sec',
      '<h2>' + esc(COPY.storyTitle) + '</h2><p class="sub">' + esc(COPY.storySub) + '</p>' +
      '<div class="reel" id="reel" tabindex="0" aria-label="Photo gallery. Swipe or use the arrow keys.">' +
        g.map(function (p, i) {
          return '<figure class="reel-slide"><div class="polaroid" style="--tilt:' + (i % 2 ? 1 : -1) + 'deg"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || p.caption) + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async" width="600" height="750"><figcaption>' + esc(p.caption) + '</figcaption></div></figure>';
        }).join('') +
      '</div>' +
      '<div class="deck-ui">' +
        '<button class="round" id="reel-prev" type="button" aria-label="Previous photo">' + IC.prev + '</button>' +
        '<div class="dots" id="reel-dots">' + g.map(function (p, i) { return '<button type="button" aria-label="Photo ' + (i + 1) + '" data-i="' + i + '"></button>'; }).join('') + '</div>' +
        '<button class="round" id="reel-next" type="button" aria-label="Next photo">' + IC.next + '</button>' +
      '</div>');
  }

  function locationHTML() {
    return sec('location', 'location', 'loc-sec',
      '<h2>' + esc(COPY.locTitle) + '</h2>' +
      '<a class="map" href="' + esc(W.mapsLink) + '" target="_blank" rel="noopener" aria-label="Open ' + esc(W.venue) + ' in Google Maps">' + T.map + '<span class="map-chip">' + esc(COPY.locChip) + '</span></a>' +
      '<div class="addr"><h3>' + esc(W.venue) + '</h3><p id="addr-text">' + esc(W.address) + '</p></div>' +
      '<div class="row">' +
        '<a class="btn" id="dir" target="_blank" rel="noopener" href="' + esc('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(W.venue + ', ' + W.address)) + '">' + esc(COPY.directions) + '</a>' +
        '<button class="btn btn-alt" id="copy" type="button">' + esc(COPY.copyAddr) + '</button>' +
      '</div>');
  }

  function rsvpHTML() {
    if (!D.rsvp || D.rsvp.enabled === false) return '';
    return sec('rsvp', 'rsvp', 'rsvp-sec',
      '<h2>' + esc(COPY.rsvpTitle) + '</h2><p class="sub">' + esc(COPY.rsvpSub) + '</p>' +
      '<form id="rsvp-form" novalidate>' +
        '<label for="rs-name">' + esc(COPY.rsvpName) + '</label>' +
        '<input id="rs-name" name="name" type="text" autocomplete="name" maxlength="60">' +
        '<p class="form-err" id="rs-err" role="alert" hidden>' + esc(COPY.rsvpNeedName) + '</p>' +
        '<button class="btn btn-big" type="submit">' + esc(COPY.rsvpSend) + '</button>' +
        '<p class="form-done" id="rs-done" hidden>' + esc(COPY.rsvpReady) + ' <a id="rs-link" href="#" target="_blank" rel="noopener">' + esc(COPY.rsvpOpen) + '</a></p>' +
      '</form>');
  }

  function closingHTML() {
    return sec('closing', 'closing', 'closing',
      '<div class="closing-crest">' + T.ganesh + '</div>' +
      '<h2>' + esc(COPY.closingTitle) + '</h2>' +
      '<p class="family">' + esc((D.closing && D.closing.family) || '') + '</p>' +
      (T.closingDecor ? T.closingDecor() : ''));
  }

  app.innerHTML = heroHTML() + dateHTML() + pages.map(pageHTML).join('') + moreHTML() + storyHTML() + locationHTML() + rsvpHTML() + closingHTML();
  var tt = document.createElement('div'); tt.id = 'toast'; tt.className = 'toast'; tt.setAttribute('role', 'status'); document.body.appendChild(tt);
  if (guest) { $('#guest-name').textContent = guest; var rn = $('#rs-name'); if (rn) rn.value = guest; }
  if (E.endFrame) $('#hero').style.setProperty('--hero-image', 'url("' + new URL(E.endFrame, document.baseURI).href + '")'); // absolute: a url() inside a CSS variable resolves against the stylesheet, not the page
  if (D.meta && D.meta.title) document.title = D.meta.title;

  /* pause the decor animations on pages that are off screen */
  (function pauseOffscreen() {
    var secs = $$('.pg'); if (!('IntersectionObserver' in window)) { secs.forEach(function (s) { s.classList.add('is-vis'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('is-vis', e.isIntersecting); }); }, { rootMargin: '120px 0px' });
    secs.forEach(function (s) { io.observe(s); });
  })();

  /* ---------------- fit long names ---------------- */
  function fit() {
    $$('.name').forEach(function (n) {
      var box = n.parentElement.clientWidth - 6;
      n.style.fontSize = '';
      var s = parseFloat(window.getComputedStyle(n).fontSize);
      while (n.getBoundingClientRect().width > box && s > 30) { s -= 2; n.style.fontSize = s + 'px'; }
    });
  }
  fit(); window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* ---------------- entry ---------------- */
  var entry, stage, opened = false, video = null;
  var HANDOFF = 1.0;   // seconds before the clip ends when the invitation starts to appear (the end frame is identical, so it is seamless)
  function tapSticker() { return T.tapSticker ? T.tapSticker(E.tapLabel || 'tap to open') : ''; }
  function codedStage() { return T.entry(D) + '<button class="entry-hit" type="button" aria-label="' + esc((E.tapLabel || 'tap to open') + ': open the invitation') + '"></button>'; }
  function videoStage() {
    return '<video class="entry-video" playsinline webkit-playsinline muted preload="auto"' + (E.poster ? ' poster="' + esc(E.poster) + '"' : '') + '>' +
      '<source src="' + esc(E.video) + '" type="video/mp4"></video>' +
      (T.videoOverlay ? T.videoOverlay(D, tapSticker()) : '<div class="tap-pos">' + tapSticker() + '</div>') +
      '<button class="entry-hit" type="button" aria-label="' + esc((E.tapLabel || 'tap to open') + ': open the invitation') + '"></button>';
  }
  function bindEntry() {
    $('.entry-hit', stage).addEventListener('click', openInvitation);
    video = $('.entry-video', stage);
    if (video) {
      var src = $('source', video);
      src.addEventListener('error', useCoded);
      video.addEventListener('error', useCoded);
    }
  }
  function useCoded() {
    if (opened || !stage || stage.classList.contains('is-coded')) return;
    video = null;
    stage.className = 'entry-stage is-coded';
    stage.innerHTML = codedStage();
    bindEntry();
  }
  function buildEntry() {
    entry = document.createElement('div');
    entry.id = 'entry'; entry.setAttribute('role', 'dialog'); entry.setAttribute('aria-label', 'Wedding invitation cover');
    stage = document.createElement('div');
    var useVideo = !!E.video;
    stage.className = 'entry-stage ' + (useVideo ? 'is-video' : 'is-coded');
    stage.innerHTML = useVideo ? videoStage() : codedStage();
    entry.appendChild(stage);
    document.body.appendChild(entry);
    bindEntry();
    if (E.endFrame) { var im = new Image(); im.src = E.endFrame; }   // load the end frame early so the hand-off never flashes
    [T.bg && T.bg.date].forEach(function (u) { if (u) { var i2 = new Image(); i2.src = u; } });
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function openInvitation() {
    if (opened) return;
    opened = true;
    var vs = !!(E.videoSound && video && !video.error);     // the clip carries its own sound
    var startMusic = function () { Sound.start({ bgm: D.audio && D.audio.bgm, volume: D.audio && D.audio.volume }); };
    if (vs) { Sound.unlock(); } else { startMusic(); Sound.sfx.whoosh(); }
    FX.burst(window.innerWidth / 2, window.innerHeight * 0.62, vs ? 24 : 60);
    entry.classList.add('is-opening');

    var shown = false;
    function show() {   // reveal the invitation now; it fades in over the last second of the clip
      if (shown) return; shown = true;
      entry.classList.add('is-gone');
      document.body.classList.remove('is-locked');
      window.scrollTo(0, 0);
      document.body.classList.add('is-live');
      FX.ambient(true);
      setTimeout(function () { FX.burst(window.innerWidth / 2, window.innerHeight * 0.34, 28); }, 250);
      setTimeout(function () { if (entry && entry.parentNode) entry.parentNode.removeChild(entry); }, 1400);
    }
    var musicStarted = false;
    function finish() { show(); if (vs && !musicStarted) { musicStarted = true; startMusic(); } }

    if (video && !video.error) {
      var guard = setTimeout(finish, 15000);
      video.addEventListener('timeupdate', function () {
        var dur = video.duration;
        if (isFinite(dur) && dur > 0 && dur - video.currentTime <= (reduce ? 0.05 : HANDOFF)) show();
      });
      video.addEventListener('ended', function () { clearTimeout(guard); finish(); });
      video.addEventListener('error', function () { clearTimeout(guard); finish(); });
      video.muted = !vs;
      var p = video.play();
      if (p && p.catch) p.catch(function () {
        if (vs) { video.muted = true; var p2 = video.play(); if (p2 && p2.catch) p2.catch(function () { clearTimeout(guard); finish(); }); }
        else { clearTimeout(guard); finish(); }
      });
    } else {
      wait(reduce ? 500 : (T.entryMs || 2700)).then(finish);
    }
  }
  buildEntry();

  (function tapSparkle() {
    var lastT = 0;
    document.addEventListener('pointerdown', function (e) {
      if (!document.body.classList.contains('is-live') || e.target.closest('input,textarea,.scratch,.deck,.reel,button,a')) return;
      var now = Date.now(); if (now - lastT < 120) return; lastT = now;
      FX.sparkle(e.clientX, e.clientY, 6);
    }, { passive: true });
  })();

  /* ---------------- scratch card: gold leaf you scratch off with a finger ---------------- */
  var revealed = false;
  (function scratch() {
    var card = $('#scratch-card'), cv = $('canvas', card), ctx = cv.getContext('2d', { willReadFrequently: true }), coin = $('.coin', card);
    var w = 0, h = 0, dpr = 1, drawing = false, last = null, touched = false, lastCheck = 0, lastSfx = 0, lastFleck = 0, lastVib = 0, acc = 0, demoRaf = 0;
    var foil = Object.assign({ stops: ['#b98a3f', '#ecd596', '#fff3c9', '#d2a559', '#a67a30', '#ead08f', '#c8994c'], ink: '#6e4f1c', label: COPY.scratchMe }, T.foil || {});
    var R = 22;

    function emboss(draw) {   // draw a shape twice, offset, so it looks pressed into the foil
      ctx.save(); ctx.translate(0.9, 0.9); ctx.strokeStyle = 'rgba(255,247,215,.6)'; ctx.fillStyle = 'rgba(255,247,215,.6)'; draw(); ctx.restore();
      ctx.save(); ctx.translate(-0.7, -0.7); ctx.strokeStyle = 'rgba(92,58,12,.38)'; ctx.fillStyle = 'rgba(92,58,12,.38)'; draw(); ctx.restore();
    }
    function paint() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      var r = card.getBoundingClientRect(); w = r.width; h = r.height; R = Math.max(20, w * 0.075);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      var i, k;
      // 1. liquid metal: diagonal bands of light and shade
      var g = ctx.createLinearGradient(0, 0, w, h);
      foil.stops.forEach(function (c, n) { g.addColorStop(n / (foil.stops.length - 1), c); });
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // 2. brushed-metal streaks
      for (i = 0; i < 260; i++) {
        var y0 = Math.random() * h, x0 = Math.random() * w, len = 18 + Math.random() * 90;
        ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,250,225,' + (0.05 + Math.random() * 0.1) + ')' : 'rgba(110,72,18,' + (0.04 + Math.random() * 0.08) + ')';
        ctx.lineWidth = 0.6 + Math.random() * 0.8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + len, y0 + (Math.random() - 0.5) * 1.5); ctx.stroke();
      }
      // 3. a soft pool of light behind the label, so the words stay readable
      var rg = ctx.createRadialGradient(w / 2, h * 0.52, 4, w / 2, h * 0.52, w * 0.5);
      rg.addColorStop(0, 'rgba(255,246,214,.5)'); rg.addColorStop(1, 'rgba(255,246,214,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
      // 4. embossed diamond lattice with a dot at each crossing
      ctx.lineWidth = 1.1;
      emboss(function () {
        var s = 26;
        ctx.beginPath();
        for (k = -h; k < w + h; k += s) { ctx.moveTo(k, 0); ctx.lineTo(k + h, h); ctx.moveTo(k + h, 0); ctx.lineTo(k, h); }
        ctx.stroke();
        for (k = 0; k < w + s; k += s) for (var m = 0; m < h + s; m += s) { ctx.beginPath(); ctx.arc(k, m, 1.5, 0, 6.2832); ctx.fill(); }
      });
      // 5. embossed double frame
      emboss(function () { rr(ctx, 9, 9, w - 18, h - 18, 14); ctx.stroke(); });
      emboss(function () { rr(ctx, 15, 15, w - 30, h - 30, 10); ctx.stroke(); });
      // 6. embossed label and ornament
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var fs = Math.round(w * 0.15); ctx.font = fs + 'px ' + (T.foilFont || 'Georgia, serif');
      emboss(function () { ctx.fillText(foil.label || COPY.scratchMe, w / 2, h * 0.55); });
      ctx.fillStyle = foil.ink; ctx.globalAlpha = 0.82; ctx.fillText(foil.label || COPY.scratchMe, w / 2, h * 0.55); ctx.globalAlpha = 1;
      emboss(function () { ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.33); ctx.lineTo(w * 0.46, h * 0.33); ctx.moveTo(w * 0.54, h * 0.33); ctx.lineTo(w * 0.7, h * 0.33); ctx.stroke(); ctx.beginPath(); ctx.moveTo(w / 2, h * 0.33 - 6); ctx.lineTo(w / 2 + 6, h * 0.33); ctx.lineTo(w / 2, h * 0.33 + 6); ctx.lineTo(w / 2 - 6, h * 0.33); ctx.closePath(); ctx.fill(); });
      // 7. fine grain, like real foil
      var img = ctx.getImageData(0, 0, cv.width, cv.height), d = img.data, n;
      for (i = 0; i < d.length; i += 4) { n = (Math.random() - 0.5) * 24; d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.8; }
      ctx.putImageData(img, 0, 0);
      // 8. a few glints
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (i = 0; i < 26; i++) {
        var gx = Math.random() * w, gy = Math.random() * h, gs = 2 + Math.random() * 4.5;
        ctx.fillStyle = 'rgba(255,255,245,' + (0.5 + Math.random() * 0.45) + ')';
        ctx.beginPath(); ctx.moveTo(gx, gy - gs); ctx.quadraticCurveTo(gx, gy, gx + gs, gy); ctx.quadraticCurveTo(gx, gy, gx, gy + gs); ctx.quadraticCurveTo(gx, gy, gx - gs, gy); ctx.quadraticCurveTo(gx, gy, gx, gy - gs); ctx.fill();
      }
    }
    function rr(c, x, y, ww, hh, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + ww, y, x + ww, y + hh, r); c.arcTo(x + ww, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + ww, y, r); c.closePath(); }
    paint();
    window.addEventListener('resize', function () { if (!touched && !revealed) paint(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!touched && !revealed) paint(); });

    function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function stamp(x, y, rad) {   // a soft, slightly ragged scrape
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.62, 'rgba(0,0,0,.96)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
    }
    function stroke(a, b) {
      ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = 1;
      var dist = Math.hypot(b.x - a.x, b.y - a.y), step = Math.max(3, R * 0.26), n = Math.max(1, Math.ceil(dist / step));
      for (var i = 1; i <= n; i++) { var t = i / n; stamp(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, R * (0.88 + Math.random() * 0.24)); }
      ctx.globalCompositeOperation = 'source-over';
    }
    function cleared() {
      var d = ctx.getImageData(0, 0, cv.width, cv.height).data, n = 0, t = 0;
      for (var i = 3; i < d.length; i += 48) { t++; if (d[i] < 40) n++; }
      return n / t;
    }
    function check(force) {
      if (revealed) return;
      var now = Date.now();
      if (!force && now - lastCheck < 240) return;
      lastCheck = now;
      if (cleared() > 0.55) reveal();
    }
    function touch() { if (!touched) { touched = true; card.classList.add('is-touched'); cancelAnimationFrame(demoRaf); coin.classList.remove('is-on'); } }

    cv.addEventListener('pointerdown', function (e) {
      touch(); drawing = true; try { cv.setPointerCapture(e.pointerId); } catch (_) {}
      last = pos(e); stroke(last, last); acc = 0; e.preventDefault();
      Sound.sfx.scratch(0.5);
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e), dist = Math.hypot(p.x - last.x, p.y - last.y), now = Date.now();
      stroke(last, p); last = p; acc += dist;
      if (acc > 22 && now - lastSfx > 55) { Sound.sfx.scratch(Math.min(1, dist / 18)); lastSfx = now; acc = 0; }
      if (dist > 3 && now - lastFleck > 45) { FX.fleck(e.clientX, e.clientY, 2); lastFleck = now; }
      if (navigator.vibrate && now - lastVib > 150) { try { navigator.vibrate(6); } catch (_) {} lastVib = now; }
      check(false);
    });
    function end() { if (drawing) { drawing = false; check(true); } }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('pointerleave', end);

    function reveal() {
      if (revealed) return;
      revealed = true; touch();
      card.classList.add('is-revealed'); card.removeAttribute('tabindex'); card.removeAttribute('role');
      var r = card.getBoundingClientRect();
      Sound.sfx.shimmer();
      FX.burst(r.left + r.width / 2, r.top + r.height * 0.45, 70);
      FX.sparkle(r.left + r.width * 0.25, r.top + r.height * 0.3, 6); FX.sparkle(r.left + r.width * 0.75, r.top + r.height * 0.6, 6);
      if (navigator.vibrate) { try { navigator.vibrate([20, 40, 30]); } catch (_) {} }
      $('#reveal-btn').hidden = true;
      var after = $('#after'); after.hidden = false; after.classList.add('is-in');
      startCountdown();
    }
    $('#reveal-btn').addEventListener('click', reveal);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });

    // a coin scrapes a short trail once the card scrolls into view, to show what to do
    if (!reduce && 'IntersectionObserver' in window) {
      var seen = false, io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting || seen || touched || revealed || !document.body.classList.contains('is-live')) return;
        seen = true; io.disconnect();
        setTimeout(function () { if (!touched && !revealed) demo(); }, 500);
      }, { threshold: 0.7 });
      io.observe(card);
    }
    function demo() {
      var t0 = performance.now(), dur = 1900, prev = null;
      coin.classList.add('is-on');
      (function step(now) {
        var t = Math.min(1, (now - t0) / dur), x = w * (0.2 + 0.46 * t), y = h * 0.66 + Math.sin(t * 15) * h * 0.1 - t * h * 0.12, p = { x: x, y: y };
        coin.style.transform = 'translate(' + (x - 13) + 'px,' + (y - 13) + 'px) rotate(' + (-18 + t * 20) + 'deg)';
        if (prev) stroke(prev, p); prev = p;
        if (t < 1 && !touched) demoRaf = requestAnimationFrame(step); else coin.classList.remove('is-on');
      })(t0);
    }
  })();

  /* ---------------- countdown ---------------- */
  var cdTimer;
  function startCountdown() {
    var target = new Date(W.dateISO).getTime();
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { $('#count').hidden = true; $('#count-done').hidden = false; clearInterval(cdTimer); return; }
      var s = Math.floor(diff / 1000);
      $('#cd-d').textContent = pad(Math.floor(s / 86400));
      $('#cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
      $('#cd-m').textContent = pad(Math.floor(s % 3600 / 60));
      $('#cd-s').textContent = pad(s % 60);
    }
    tick(); cdTimer = setInterval(tick, 1000);
  }

  /* ---------------- calendar: one set of buttons per function page ---------------- */
  (function calendar() {
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function z(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
    function ie(t) { return String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
    function tz() { var m = /([+-]\d\d:\d\d|Z)$/.exec(W.dateISO); return m ? m[1] : '+05:30'; }
    function clock(t) {
      var m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(t || ''), h = m ? +m[1] : 18, mi = m && m[2] ? +m[2] : 0, ap = m && m[3] ? m[3].toLowerCase() : '';
      if (ap === 'pm' && h < 12) h += 12; if (ap === 'am' && h === 12) h = 0;
      return pad(h) + ':' + pad(mi);
    }
    function startOf(f) { return new Date(f.dateISO || (f.id === 'wedding' && W.dateISO) || (f.date + 'T' + clock(f.time) + ':00' + tz())); }
    function info(f) {
      var s = startOf(f), hrs = f.durationHours || (f.id === 'wedding' && W.durationHours) || 3;
      return {
        s: s, e: new Date(s.getTime() + hrs * 3600000),
        title: C.groom.first + ' & ' + C.bride.first + ' \u2013 ' + f.name,
        where: f.venue + (f.address || (String(f.venue).indexOf(W.venue) === 0 ? ', ' + W.address : '')),
        desc: f.name + ' for the wedding of ' + C.groom.full + ' and ' + C.bride.full + '. Dress: ' + f.dress + '.'
      };
    }
    function byId(id) { return fns.filter(function (f) { return f.id === id; })[0]; }
    $$('[data-cal="google"]').forEach(function (a) {
      var i = info(byId(a.dataset.fn));
      a.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(i.title) + '&dates=' + z(i.s) + '/' + z(i.e) + '&details=' + encodeURIComponent(i.desc) + '&location=' + encodeURIComponent(i.where);
    });
    $$('[data-cal="ics"]').forEach(function (b) {
      b.addEventListener('click', function () {
        try {
          var f = byId(b.dataset.fn), i = info(f);
          var body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:' + z(i.s) + '-' + f.id + '@invitation', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(i.s), 'DTEND:' + z(i.e), 'SUMMARY:' + ie(i.title), 'LOCATION:' + ie(i.where), 'DESCRIPTION:' + ie(i.desc), 'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', 'DESCRIPTION:' + ie(f.name + ' today'), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
          var url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
          var a = document.createElement('a'); a.href = url; a.download = f.id + '.ics';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
        } catch (err) { toast(COPY.icsFail); }
      });
    });
  })();

  /* ---------------- card deck (the other functions) ---------------- */
  (function deck() {
    var el = $('#deck'); if (!el) return;
    var cards = $$('.deck-card', el), n = cards.length, idx = 0, busy = false;
    var dots = $$('#deck-dots button'), live = $('#deck-live');
    function render() {
      cards.forEach(function (c, i) {
        var o = (i - idx + n) % n;
        c.dataset.o = o > 3 ? 'x' : String(o);
        c.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      live.textContent = deckFns[idx].name + ', ' + (idx + 1) + ' of ' + n;
    }
    function go(to) { idx = (to + n) % n; render(); Sound.sfx.ding(); }
    function fling(card, dir, then) {
      busy = true;
      card.style.transition = 'transform .38s cubic-bezier(.4,0,.8,.6), opacity .38s ease';
      card.style.transform = 'translateX(' + (dir * 520) + 'px) rotate(' + (dir * 24) + 'deg)';
      card.style.opacity = '0';
      setTimeout(function () { card.style.transition = 'none'; card.style.transform = ''; card.style.opacity = ''; void card.offsetWidth; card.style.transition = ''; then(); busy = false; }, 340);
    }
    var cur = null, sx = 0, dx = 0, drag = false;
    if (n > 1) {
      el.addEventListener('pointerdown', function (e) {
        var c = e.target.closest('.deck-card');
        if (busy || !c || c.dataset.o !== '0') return;
        cur = c; drag = true; sx = e.clientX; dx = 0; c.style.transition = 'none';
      });
      el.addEventListener('pointermove', function (e) {
        if (!drag) return;
        dx = e.clientX - sx;
        if (Math.abs(dx) > 6) { try { el.setPointerCapture(e.pointerId); } catch (_) {} }
        cur.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 16) + 'deg)';
      });
      var release = function () {
        if (!drag) return; drag = false;
        var c = cur; cur = null;
        if (Math.abs(dx) > 70) { var dir = dx < 0 ? -1 : 1; fling(c, dir, function () { go(idx + (dir < 0 ? 1 : -1)); }); }
        else { c.style.transition = ''; c.style.transform = ''; }
      };
      el.addEventListener('pointerup', release); el.addEventListener('pointercancel', release);
      $('#deck-prev').addEventListener('click', function () { if (!busy) go(idx - 1); });
      $('#deck-next').addEventListener('click', function () { if (!busy) go(idx + 1); });
      dots.forEach(function (d) { d.addEventListener('click', function () { go(Number(d.dataset.i)); }); });
      el.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(idx + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(idx - 1); e.preventDefault(); } });
    }
    render();
  })();

  /* ---------------- photo reel ---------------- */
  (function reel() {
    var r = $('#reel'); if (!r) return;
    var slides = $$('.reel-slide', r), dots = $$('#reel-dots button'), cur = 0, tick = false;
    function centreOf(i) { var s = slides[i]; return s.offsetLeft - (r.clientWidth - s.clientWidth) / 2; }
    function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); r.scrollTo({ left: centreOf(i), behavior: reduce ? 'auto' : 'smooth' }); }
    function mark() {
      var best = 0, bd = 1e9;
      slides.forEach(function (s, i) { var d = Math.abs(centreOf(i) - r.scrollLeft); if (d < bd) { bd = d; best = i; } });
      cur = best;
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === best); d.setAttribute('aria-current', i === best ? 'true' : 'false'); });
    }
    r.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; mark(); }); } }, { passive: true });
    $('#reel-prev').addEventListener('click', function () { go(cur - 1); });
    $('#reel-next').addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d) { d.addEventListener('click', function () { go(Number(d.dataset.i)); }); });
    r.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); } });
    window.addEventListener('resize', function () { go(cur); });
    r.scrollLeft = centreOf(0); mark();
  })();

  /* ---------------- location: copy address ---------------- */
  $('#copy').addEventListener('click', function () {
    var text = W.venue + ', ' + W.address;
    function fallback() {
      try {
        var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-100px;opacity:0';
        document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, 999);
        var ok = document.execCommand('copy'); ta.remove();
        toast(ok ? COPY.copied : COPY.copyFail);
      } catch (_) { toast(COPY.copyFail); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(COPY.copied); }, fallback);
    else fallback();
  });

  /* ---------------- RSVP: a name and one tap to WhatsApp ---------------- */
  (function rsvp() {
    var form = $('#rsvp-form'); if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#rs-name').value.trim();
      if (!name) { $('#rs-err').hidden = false; $('#rs-name').focus(); return; }
      $('#rs-err').hidden = true;
      var text = 'Hi! This is ' + name + '. I will be attending the wedding of ' + C.groom.first + ' & ' + C.bride.first + ' on ' + wd.day + ' ' + cap(wd.mon) + '.';
      var url = 'https://wa.me/' + String(D.rsvp.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
      var link = $('#rs-link'); link.href = url; $('#rs-done').hidden = false;
      try { link.click(); } catch (_) {}   // opens WhatsApp in a new tab; the visible link is the backup
      FX.burst(window.innerWidth / 2, window.innerHeight * 0.6, 40); Sound.sfx.shimmer();
    });
  })();

  /* ---------------- music button ---------------- */
  (function music() {
    var b = document.createElement('button');
    b.className = 'music is-playing'; b.type = 'button'; b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', COPY.musicOn);
    b.innerHTML = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    document.body.appendChild(b);
    var resumeOnShow = false;
    b.addEventListener('click', function () {
      var on = Sound.toggle();
      b.classList.toggle('is-playing', on); b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? COPY.musicOn : COPY.musicOff);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (Sound.isPlaying()) { resumeOnShow = true; Sound.pause(); } }
      else if (resumeOnShow) { resumeOnShow = false; Sound.resume(); }
    });
  })();

  window.__invite = { openInvitation: openInvitation };
})();
