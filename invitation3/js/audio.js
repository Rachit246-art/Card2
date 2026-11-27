/**
 * Royal Indian Instrumental Synthesizer (Web Audio API)
 * Generates gentle Raag Yaman Sitar/Santoor plucks + Tanpura drone + chime SFX.
 */
window.RoyalAudio = (() => {
  let ctx = null;
  let masterGain = null;
  let isPlaying = false;
  let loopTimer = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let volume = 0.45;

  const SCALE = [261.63, 293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 523.25];

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  }

  function pluckNote(freq, duration = 2.4, gainLevel = 0.14) {
    if (!ctx || !masterGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const harm = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    harm.type = "sine";
    harm.frequency.setValueAtTime(freq * 2, now);

    env.gain.setValueAtTime(0.001, now);
    env.gain.exponentialRampToValueAtTime(gainLevel, now + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(env);
    harm.connect(env);
    env.connect(masterGain);

    osc.start(now);
    harm.start(now);
    osc.stop(now + duration + 0.05);
    harm.stop(now + duration + 0.05);
  }

  function startDrone() {
    if (!ctx || droneOsc1) return;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.035;
    droneGain.connect(masterGain);

    droneOsc1 = ctx.createOscillator();
    droneOsc2 = ctx.createOscillator();
    droneOsc1.type = "sine";
    droneOsc2.type = "sine";
    droneOsc1.frequency.value = 130.81;
    droneOsc2.frequency.value = 196.0;
    droneOsc1.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneOsc1.start();
    droneOsc2.start();
  }

  function stopDrone() {
    if (droneOsc1) {
      try { droneOsc1.stop(); droneOsc2.stop(); } catch {}
      droneOsc1 = null;
      droneOsc2 = null;
    }
  }

  function toggle() {
    ensureContext();
    isPlaying = !isPlaying;
    if (isPlaying) {
      startDrone();
      const step = () => {
        if (!isPlaying) return;
        const note = SCALE[Math.floor(Math.random() * SCALE.length)];
        pluckNote(note, 2.6, 0.12);
        loopTimer = setTimeout(step, 950 + Math.random() * 850);
      };
      step();
    } else {
      clearTimeout(loopTimer);
      stopDrone();
    }
    return isPlaying;
  }

  function setVolume(val) {
    volume = Math.max(0, Math.min(1, Number(val)));
    if (masterGain && ctx) {
      masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
    }
  }

  function playChime(freq = 587.33) {
    try {
      ensureContext();
      pluckNote(freq, 1.4, 0.16);
      setTimeout(() => pluckNote(freq * 1.25, 1.4, 0.11), 110);
    } catch {}
  }

  return {
    toggle,
    setVolume,
    playChime,
    get playing() {
      return isPlaying;
    }
  };
})();
