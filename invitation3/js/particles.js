/**
 * Canvas 2D Fireflies & Floating Rose/Marigold Petals
 */
window.RoyalParticles = (() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initHeroFireflies(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const flies = Array.from({ length: 44 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.2 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.15 - Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2
    }));

    window.addEventListener("resize", () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    });

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const f of flies) {
        f.x += f.vx;
        f.y += f.vy;
        f.phase += 0.04;
        if (f.y < -10) f.y = h + 10;
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;

        const alpha = 0.35 + 0.55 * Math.sin(f.phase);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 216, 135, ${Math.max(0.1, alpha)})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  function spawnPetalShower(canvasId, count = 42, palette = ["#e2789b", "#f4a4be", "#f09d2e", "#f5d887"]) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.offsetWidth || window.innerWidth);
    const h = (canvas.height = canvas.offsetHeight || 420);

    const petals = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * 140,
      rx: 6 + Math.random() * 6,
      ry: 4 + Math.random() * 4,
      vy: 1.6 + Math.random() * 2.1,
      vx: (Math.random() - 0.5) * 1.4,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.08,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.95
    }));

    function tick() {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of petals) {
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.4;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y < h + 30) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (alive) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    tick();
  }

  return { initHeroFireflies, spawnPetalShower };
})();
