/* ==========================================================
   Sound engine.
   - If INVITE.audio.bgm points to an MP3, it fades in and loops.
   - If there is no MP3 (or it fails to load), a generative loop
     of tanpura drone + temple-style bells + shimmer plays instead,
     so every template has sound from day one.
   - Everything starts from a tap, because phones block autoplay.
   ========================================================== */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;
  var S = { ctx: null, master: null, dry: null, wet: null, playing: false, mode: null, el: null, timer: null, fade: null, volume: 0.5, ready: false, next: { drone: 0, bell: 0 }, step: 0 };

  // C major pentatonic, two octaves (Hz)
  var BELLS = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
  var DRONE = [98.0, 130.81, 130.81, 65.41]; // Pa, Sa, Sa, low Sa
  var SPARK = [2093.0, 2349.3, 2637.0, 3135.96, 3520.0, 4186.0];

  function reverb(ctx, seconds, decay) {
    var rate = ctx.sampleRate, len = Math.floor(rate * seconds), buf = ctx.createBuffer(2, len, rate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    var conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  function ensure() {
    if (!AC) return false;
    if (!S.ctx) {
      S.ctx = new AC();
      S.master = S.ctx.createGain();
      S.master.gain.value = 0;
      var comp = S.ctx.createDynamicsCompressor();
      S.master.connect(comp);
      comp.connect(S.ctx.destination);
      S.dry = S.ctx.createGain();
      S.dry.gain.value = 0.8;
      S.dry.connect(S.master);
      S.wet = reverb(S.ctx, 2.6, 2.4);
      var wg = S.ctx.createGain();
      wg.gain.value = 0.7;
      S.wet.connect(wg);
      wg.connect(S.master);
      S.bus = S.ctx.createGain();
      S.bus.connect(S.dry);
      S.bus.connect(S.wet);
    }
    if (S.ctx.state === 'suspended') S.ctx.resume();
    return true;
  }

  function pan(node) {
    if (!S.ctx.createStereoPanner) return node;
    var p = S.ctx.createStereoPanner();
    p.pan.value = Math.random() * 1.6 - 0.8;
    node.connect(p);
    return p;
  }

  function bell(freq, t, vel, decay) {
    var c = S.ctx, o = c.createOscillator(), m = c.createOscillator(), mg = c.createGain(), g = c.createGain();
    decay = decay || 3.2;
    o.type = 'sine'; o.frequency.value = freq;
    m.type = 'sine'; m.frequency.value = freq * 3.51;
    mg.gain.setValueAtTime(freq * 1.1, t);
    mg.gain.exponentialRampToValueAtTime(freq * 0.02, t + 1.4);
    m.connect(mg); mg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g);
    pan(g).connect(S.bus);
    o.start(t); m.start(t); o.stop(t + decay + 0.1); m.stop(t + decay + 0.1);
  }

  function pluck(freq, t, vel) {
    var c = S.ctx, g = c.createGain(), f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(1400, t);
    f.frequency.exponentialRampToValueAtTime(260, t + 2.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
    [0, 4].forEach(function (cents) {
      var o = c.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = cents;
      o.connect(f); o.start(t); o.stop(t + 3.9);
    });
    f.connect(g); g.connect(S.bus);
  }

  function shimmer(t, count) {
    var c = S.ctx;
    for (var i = 0; i < count; i++) {
      var f = SPARK[Math.floor(Math.random() * SPARK.length)];
      var o = c.createOscillator(), g = c.createGain(), at = t + i * 0.045 + Math.random() * 0.03;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.05, at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.7);
      o.connect(g); pan(g).connect(S.bus);
      o.start(at); o.stop(at + 0.8);
    }
  }

  function noise(dur) {
    var c = S.ctx, len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(); s.buffer = buf; return s;
  }

  // ---------- sound effects ----------
  var sfx = {
    chime: function () {
      if (!ensure()) return;
      var t = S.ctx.currentTime + 0.02;
      [0, 2, 3, 5, 7].forEach(function (n, i) { bell(BELLS[n], t + i * 0.11, 0.16, 3.6); });
      shimmer(t + 0.35, 7);
      rampMaster(Math.max(S.volume, 0.6), 0.2);
    },
    whoosh: function () {
      if (!ensure()) return;
      var c = S.ctx, t = c.currentTime, n = noise(1.2), f = c.createBiquadFilter(), g = c.createGain();
      f.type = 'bandpass'; f.Q.value = 0.8;
      f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(2600, t + 0.9);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      n.connect(f); f.connect(g); g.connect(S.bus); n.start(t); n.stop(t + 1.25);
    },
    shimmer: function () {
      if (!ensure()) return;
      var t = S.ctx.currentTime + 0.01;
      shimmer(t, 14);
      bell(BELLS[5], t, 0.12, 3.5); bell(BELLS[7], t + 0.12, 0.1, 3.5);
    },
    tick: function () {
      if (!S.ctx || S.ctx.state !== 'running') return;
      var c = S.ctx, t = c.currentTime, n = noise(0.07), f = c.createBiquadFilter(), g = c.createGain();
      f.type = 'highpass'; f.frequency.value = 3800;
      g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      n.connect(f); f.connect(g); g.connect(S.dry); n.start(t); n.stop(t + 0.08);
    },
    scratch: function (v) {
      if (!S.ctx || S.ctx.state !== 'running') return;
      var c = S.ctx, t = c.currentTime, n = noise(0.11), f = c.createBiquadFilter(), g = c.createGain();
      f.type = 'bandpass'; f.Q.value = 1.1; f.frequency.value = 1800 + Math.random() * 1900;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07 * Math.min(1, v || 0.6), t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      n.connect(f); f.connect(g); g.connect(S.dry); n.start(t); n.stop(t + 0.12);
    },
    ding: function () {
      if (!S.ctx || S.ctx.state !== 'running') return;
      bell(BELLS[3], S.ctx.currentTime + 0.01, 0.09, 1.6);
    }
  };

  // ---------- generative loop ----------
  function schedule() {
    var c = S.ctx, now = c.currentTime, ahead = now + 0.6;
    while (S.next.drone < ahead) {
      var f = DRONE[S.step % 4];
      pluck(f, Math.max(S.next.drone, now), 0.07);
      S.step++;
      S.next.drone += 1.15;
      if (S.step % 4 === 0) S.next.drone += 0.7;
    }
    while (S.next.bell < ahead) {
      var n = Math.floor(Math.random() * BELLS.length);
      bell(BELLS[n], Math.max(S.next.bell, now), 0.05 + Math.random() * 0.035, 3.4);
      if (Math.random() < 0.18) shimmer(S.next.bell + 0.05, 3);
      S.next.bell += 0.7 + Math.random() * 1.9;
    }
  }
  function startGenerative() {
    if (!ensure()) return;
    S.mode = 'gen';
    var t = S.ctx.currentTime;
    S.next.drone = t + 0.1; S.next.bell = t + 0.9; S.step = 0;
    clearInterval(S.timer);
    S.timer = setInterval(schedule, 250);
    schedule();
    rampMaster(S.volume, 3);
  }
  function stopGenerative() {
    clearInterval(S.timer); S.timer = null;
  }

  function rampMaster(target, secs) {
    if (!S.master) return;
    var g = S.master.gain, t = S.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(target, t + secs);
  }

  // ---------- MP3 mode ----------
  function fadeEl(el, to, ms, done) {
    clearInterval(S.fade);
    var from = el.volume, start = Date.now();
    S.fade = setInterval(function () {
      var k = Math.min(1, (Date.now() - start) / ms);
      try { el.volume = from + (to - from) * k; } catch (e) {}
      if (k >= 1) { clearInterval(S.fade); if (done) done(); }
    }, 60);
  }
  function startFile(src, vol) {
    var el = new window.Audio();
    el.src = src; el.loop = true; el.preload = 'auto'; el.volume = 0;
    S.el = el; S.mode = 'file';
    var failed = false;
    function fallback() { if (failed) return; failed = true; S.el = null; if (S.playing) startGenerative(); }
    el.addEventListener('error', fallback);
    var p = el.play();
    if (p && p.then) p.then(function () { fadeEl(el, vol, 4000); }).catch(fallback);
    else fadeEl(el, vol, 4000);
  }

  // ---------- public API ----------
  var Sound = {
    sfx: sfx,
    unlock: function () { ensure(); },
    isPlaying: function () { return S.playing; },
    start: function (opts) {
      opts = opts || {};
      S.volume = typeof opts.volume === 'number' ? opts.volume : 0.5;
      ensure(); // must run inside the tap
      sfx.chime();
      if (S.playing) return;
      S.playing = true;
      if (opts.bgm) startFile(opts.bgm, S.volume); else startGenerative();
    },
    pause: function () {
      if (!S.playing) return;
      S.playing = false;
      rampMaster(0, 0.5); // also silences effects while muted
      if (S.mode === 'file' && S.el) fadeEl(S.el, 0, 500, function () { S.el && S.el.pause(); });
      else setTimeout(function () { if (!S.playing) stopGenerative(); }, 700);
    },
    resume: function () {
      if (S.playing) return;
      S.playing = true;
      ensure();
      if (S.mode === 'file' && S.el) { var p = S.el.play(); if (p && p.catch) p.catch(function () {}); fadeEl(S.el, S.volume, 800); rampMaster(0.6, 0.4); }
      else startGenerative();
    },
    toggle: function () { if (S.playing) Sound.pause(); else Sound.resume(); return S.playing; }
  };
  window.Sound = Sound;
})();
