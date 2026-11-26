/* ==========================================================================
   Royal Crimson & Sandstone Opening Canvas Engine (Responsive Laptop + Mobile)
   ========================================================================== */
window.createHeroOpening = function createHeroOpening(canvas, onRevealReady) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const TOTAL_DURATION = 13000;
  const REVEAL_AT_MS = 9200; // Reveal couple names right as curtains finish parting

  const doorsImg = new Image();
  const gardenImg = new Image();
  const curtainSwagImg = new Image();
  const mobileCurtainImg = new Image();
  let imagesLoaded = 0;

  const themedDoorsCanvas = document.createElement('canvas');
  const themedDoorsCtx = themedDoorsCanvas.getContext('2d');
  const themedGardenCanvas = document.createElement('canvas');
  const themedGardenCtx = themedGardenCanvas.getContext('2d');
  const swagCanvas = document.createElement('canvas');
  const swagCtx = swagCanvas.getContext('2d');
  const mobileCurtainCanvas = document.createElement('canvas');
  const mobileCurtainCtx = mobileCurtainCanvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let isPlaying = false;
  let hasStarted = false;
  let didReveal = false;
  let startTime = 0;
  let currentElapsed = 0;
  let rafId = null;

  const motes = Array.from({ length: 30 }, (_, i) => ({
    nx: ((i * 173) % 100) / 100,
    ny: 0.2 + (((i * 251) % 70) / 100),
    r: 2 + (i % 4) * 1.1,
    speed: 0.25 + (i % 5) * 0.12,
    phase: i * 0.7,
  }));

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function buildThemedDoors() {
    const dw = doorsImg.naturalWidth || 1080;
    const dh = doorsImg.naturalHeight || 1920;
    themedDoorsCanvas.width = dw;
    themedDoorsCanvas.height = dh;

    themedDoorsCtx.filter = 'grayscale(0.65) contrast(1.12) brightness(0.96)';
    themedDoorsCtx.drawImage(doorsImg, 0, 0, dw, dh);
    themedDoorsCtx.filter = 'none';

    themedDoorsCtx.globalCompositeOperation = 'multiply';
    themedDoorsCtx.fillStyle = '#8b1624';
    themedDoorsCtx.fillRect(0, 0, dw, dh);

    themedDoorsCtx.globalCompositeOperation = 'soft-light';
    themedDoorsCtx.fillStyle = '#c85a48';
    themedDoorsCtx.fillRect(0, 0, dw, dh);
    themedDoorsCtx.globalCompositeOperation = 'source-over';
  }

  function buildThemedGarden() {
    const gw = gardenImg.naturalWidth || 1080;
    const gh = gardenImg.naturalHeight || 1920;
    themedGardenCanvas.width = gw;
    themedGardenCanvas.height = gh;
    themedGardenCtx.filter = 'saturate(1.12) brightness(0.92) contrast(1.06)';
    themedGardenCtx.drawImage(gardenImg, 0, 0, gw, gh);
    themedGardenCtx.filter = 'none';
  }

  function applyCrimsonVelvetTheme(targetCtx, width, height) {
    const tmp = document.createElement('canvas');
    tmp.width = width;
    tmp.height = height;
    const tctx = tmp.getContext('2d');
    tctx.drawImage(targetCtx.canvas, 0, 0);
    tctx.globalCompositeOperation = 'multiply';
    tctx.fillStyle = '#921928';
    tctx.fillRect(0, 0, width, height);
    tctx.globalCompositeOperation = 'soft-light';
    tctx.fillStyle = '#b84238';
    tctx.fillRect(0, 0, width, height);
    tctx.globalCompositeOperation = 'destination-in';
    tctx.drawImage(targetCtx.canvas, 0, 0);

    targetCtx.clearRect(0, 0, width, height);
    targetCtx.globalCompositeOperation = 'source-over';
    targetCtx.drawImage(tmp, 0, 0);
  }

  function buildFeatheredSwag() {
    const sw = curtainSwagImg.naturalWidth || 1024;
    const sh = curtainSwagImg.naturalHeight || 1024;
    swagCanvas.width = sw;
    swagCanvas.height = sh;
    swagCtx.clearRect(0, 0, sw, sh);

    swagCtx.save();
    swagCtx.beginPath();
    swagCtx.moveTo(0, 0);
    swagCtx.lineTo(sw * 0.76, 0);
    swagCtx.quadraticCurveTo(sw * 0.42, sh * 0.48, 0, sh * 0.84);
    swagCtx.closePath();
    swagCtx.clip();
    swagCtx.drawImage(curtainSwagImg, 0, 0, sw, sh);
    swagCtx.restore();

    swagCtx.globalCompositeOperation = 'destination-in';
    const edgeGrad = swagCtx.createLinearGradient(0, 0, sw * 0.65, sh * 0.65);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,1)');
    edgeGrad.addColorStop(0.78, 'rgba(0,0,0,1)');
    edgeGrad.addColorStop(0.95, 'rgba(0,0,0,0.4)');
    edgeGrad.addColorStop(1, 'rgba(0,0,0,0)');
    swagCtx.fillStyle = edgeGrad;
    swagCtx.fillRect(0, 0, sw, sh);
    swagCtx.globalCompositeOperation = 'source-over';

    applyCrimsonVelvetTheme(swagCtx, sw, sh);
  }

  function buildFeatheredMobileCurtain() {
    const rawW = mobileCurtainImg.naturalWidth || 720;
    const rawH = mobileCurtainImg.naturalHeight || 1280;
    const cropW = Math.round(rawW * 0.78);
    const halfCropW = Math.round(cropW * 0.5);

    mobileCurtainCanvas.width = cropW;
    mobileCurtainCanvas.height = rawH;
    mobileCurtainCtx.clearRect(0, 0, cropW, rawH);

    mobileCurtainCtx.drawImage(
      mobileCurtainImg,
      halfCropW, 0, cropW - halfCropW, rawH,
      halfCropW, 0, cropW - halfCropW, rawH
    );
    mobileCurtainCtx.save();
    mobileCurtainCtx.translate(halfCropW, 0);
    mobileCurtainCtx.scale(-1, 1);
    mobileCurtainCtx.drawImage(
      mobileCurtainImg,
      halfCropW, 0, cropW - halfCropW, rawH,
      0, 0, halfCropW, rawH
    );
    mobileCurtainCtx.restore();

    // Mask strictly to the top 3-arch valance and narrow left/right side drapes
    // so the entire center arch opening is 100% transparent (no red wall behind names)
    mobileCurtainCtx.globalCompositeOperation = 'destination-in';
    mobileCurtainCtx.beginPath();
    mobileCurtainCtx.moveTo(0, 0);
    mobileCurtainCtx.lineTo(cropW, 0);
    mobileCurtainCtx.lineTo(cropW, rawH * 0.48);
    mobileCurtainCtx.quadraticCurveTo(cropW * 0.86, rawH * 0.42, cropW * 0.80, rawH * 0.22);
    mobileCurtainCtx.quadraticCurveTo(cropW * 0.66, rawH * 0.27, cropW * 0.50, rawH * 0.23);
    mobileCurtainCtx.quadraticCurveTo(cropW * 0.34, rawH * 0.27, cropW * 0.20, rawH * 0.22);
    mobileCurtainCtx.quadraticCurveTo(cropW * 0.14, rawH * 0.42, 0, rawH * 0.48);
    mobileCurtainCtx.closePath();
    mobileCurtainCtx.fillStyle = '#000';
    mobileCurtainCtx.fill();

    // Soften only the bottom tail tips while keeping y = 0..0.36 100% opaque
    const tailFade = mobileCurtainCtx.createLinearGradient(0, 0, 0, rawH * 0.50);
    tailFade.addColorStop(0, 'rgba(0,0,0,1)');
    tailFade.addColorStop(0.72, 'rgba(0,0,0,1)');
    tailFade.addColorStop(1, 'rgba(0,0,0,0)');
    mobileCurtainCtx.fillStyle = tailFade;
    mobileCurtainCtx.fillRect(0, 0, cropW, rawH);

    mobileCurtainCtx.globalCompositeOperation = 'source-over';
    applyCrimsonVelvetTheme(mobileCurtainCtx, cropW, rawH);
  }

  function resizeCanvas() {
    const host = canvas.parentElement;
    W = host ? host.clientWidth : window.innerWidth;
    H = host ? host.clientHeight : window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (imagesLoaded === 4 && !isPlaying) {
      renderFrame(currentElapsed);
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function onAssetLoad() {
    imagesLoaded += 1;
    if (this === doorsImg) buildThemedDoors();
    else if (this === gardenImg) buildThemedGarden();
    else if (this === curtainSwagImg) buildFeatheredSwag();
    else if (this === mobileCurtainImg) buildFeatheredMobileCurtain();

    if (imagesLoaded === 4) {
      renderFrame(currentElapsed);
    }
  }

  doorsImg.onload = onAssetLoad;
  gardenImg.onload = onAssetLoad;
  curtainSwagImg.onload = onAssetLoad;
  mobileCurtainImg.onload = onAssetLoad;
  doorsImg.src = './opening-video/assets/royal-doors-botanical.jpg';
  gardenImg.src = './opening-video/assets/royal-courtyard-crimson.jpg';
  curtainSwagImg.src = './opening-video/assets/royal-curtain-swag.jpg';
  mobileCurtainImg.src = './opening-video/assets/royal-curtain-mobile.jpg';

  function drawImageCover(img, dx, dy, dw, dh, zoom = 1, alignY = 0.5) {
    const iw = img.naturalWidth || img.width || 1080;
    const ih = img.naturalHeight || img.height || 1920;
    const scale = Math.max(dw / iw, dh / ih) * zoom;
    const sw = dw / scale;
    const sh = dh / scale;
    const sx = (iw - sw) * 0.5;
    const sy = (ih - sh) * alignY;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  function drawPlaqueHalf3D(side, angle) {
    const cosA = Math.max(0.02, Math.cos(angle));
    const sinA = Math.sin(angle);
    const isLeft = side === 'left';

    const minDim = Math.min(W, H);
    const pw = Math.min(340, Math.max(210, minDim * 0.42));
    const ph = pw * 1.24;
    const seamX = isLeft ? (W / 2) * cosA : W - (W / 2) * cosA;
    const perspAtSeam = 1 - 0.1 * sinA;

    ctx.save();
    ctx.beginPath();
    if (isLeft) {
      ctx.moveTo(0, 0);
      ctx.lineTo(seamX, (H * (1 - perspAtSeam)) / 2);
      ctx.lineTo(seamX, H - (H * (1 - perspAtSeam)) / 2);
      ctx.lineTo(0, H);
    } else {
      ctx.moveTo(W, 0);
      ctx.lineTo(seamX, (H * (1 - perspAtSeam)) / 2);
      ctx.lineTo(seamX, H - (H * (1 - perspAtSeam)) / 2);
      ctx.lineTo(W, H);
    }
    ctx.closePath();
    ctx.clip();

    ctx.translate(seamX, H * 0.48);
    ctx.scale(cosA, perspAtSeam);

    ctx.shadowColor = 'rgba(20, 26, 15, 0.42)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    function traceMedallion(scaleX, scaleY) {
      ctx.beginPath();
      const rx = (pw / 2) * scaleX;
      const ry = (ph / 2) * scaleY;
      ctx.moveTo(0, -ry);
      ctx.bezierCurveTo(rx * 0.45, -ry * 0.96, rx * 0.68, -ry * 0.68, rx * 0.92, -ry * 0.48);
      ctx.bezierCurveTo(rx * 1.05, -ry * 0.22, rx * 1.05, ry * 0.22, rx * 0.92, ry * 0.48);
      ctx.bezierCurveTo(rx * 0.68, ry * 0.68, rx * 0.45, ry * 0.96, 0, ry);
      ctx.bezierCurveTo(-rx * 0.45, ry * 0.96, -rx * 0.68, ry * 0.68, -rx * 0.92, ry * 0.48);
      ctx.bezierCurveTo(-rx * 1.05, ry * 0.22, -rx * 1.05, -ry * 0.22, -rx * 0.92, -ry * 0.48);
      ctx.bezierCurveTo(-rx * 0.68, -ry * 0.68, -rx * 0.45, -ry * 0.96, 0, -ry);
      ctx.closePath();
    }

    traceMedallion(1, 1);
    const creamGrad = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2);
    creamGrad.addColorStop(0, '#faf0e0');
    creamGrad.addColorStop(1, '#e6d2b4');
    ctx.fillStyle = creamGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.lineWidth = Math.max(2.5, pw * 0.012);
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    traceMedallion(0.89, 0.9);
    ctx.lineWidth = Math.max(1.2, pw * 0.006);
    ctx.strokeStyle = 'rgba(184, 134, 40, 0.82)';
    ctx.stroke();

    const s = pw / 420;
    ctx.fillStyle = '#b88628';
    ctx.beginPath();
    ctx.ellipse(0, -86 * s, 6.5 * s, 20 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-14 * s, -74 * s, 4.5 * s, 14 * s, -0.55, 0, Math.PI * 2);
    ctx.ellipse(14 * s, -74 * s, 4.5 * s, 14 * s, 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6b101c';
    ctx.font = `600 ${Math.round(32 * s)}px "Cinzel", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TAP TO OPEN', 0, 6 * s);

    ctx.beginPath();
    ctx.moveTo(-58 * s, 50 * s);
    ctx.lineTo(58 * s, 50 * s);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(107, 16, 28, 0.45)';
    ctx.stroke();

    ctx.restore();
  }

  function drawDoorLeaf3D(side, angle) {
    const isLeft = side === 'left';
    const cosA = Math.max(0.01, Math.cos(angle));
    const sinA = Math.sin(angle);
    const leafW = (W / 2) * cosA;
    const perspAtSeam = 1 - 0.1 * sinA;

    const iw = doorsImg.naturalWidth || 1080;
    const ih = doorsImg.naturalHeight || 1920;
    const coverScale = Math.max(W / iw, H / ih);
    const fullSrcW = W / coverScale;
    const fullSrcH = H / coverScale;
    const srcOffsetX = (iw - fullSrcW) * 0.5;
    const srcOffsetY = (ih - fullSrcH) * 0.5;
    const halfSrcW = fullSrcW / 2;

    const slices = 28;
    for (let i = 0; i < slices; i++) {
      const u0 = i / slices;
      const u1 = (i + 1) / slices;
      const uMid = (u0 + u1) * 0.5;
      const sliceScaleY = 1 - (1 - perspAtSeam) * uMid;
      const dh = H * sliceScaleY;
      const dy = (H - dh) * 0.5;
      const dx = isLeft ? u0 * leafW : W - u1 * leafW;
      const dw = (u1 - u0) * leafW + 0.8;
      const sx = isLeft
        ? srcOffsetX + u0 * halfSrcW
        : srcOffsetX + halfSrcW + (1 - u1) * halfSrcW;
      const sw = (u1 - u0) * halfSrcW;

      ctx.drawImage(themedDoorsCanvas, sx, srcOffsetY, sw, fullSrcH, dx, dy, dw, dh);
    }

    const seamX = isLeft ? leafW : W - leafW;
    const seamH = H * perspAtSeam;
    const seamY = (H - seamH) * 0.5;

    ctx.save();
    ctx.beginPath();
    if (isLeft) {
      ctx.moveTo(0, 0);
      ctx.lineTo(seamX, seamY);
      ctx.lineTo(seamX, seamY + seamH);
      ctx.lineTo(0, H);
    } else {
      ctx.moveTo(W, 0);
      ctx.lineTo(seamX, seamY);
      ctx.lineTo(seamX, seamY + seamH);
      ctx.lineTo(W, H);
    }
    ctx.closePath();

    const shadeGrad = ctx.createLinearGradient(isLeft ? 0 : W, 0, seamX, 0);
    shadeGrad.addColorStop(0, `rgba(18, 24, 14, ${0.12 * sinA})`);
    shadeGrad.addColorStop(1, `rgba(18, 24, 14, ${0.42 * sinA})`);
    ctx.fillStyle = shadeGrad;
    ctx.fill();
    ctx.restore();

    const bevelW = Math.max(6, Math.min(18, W * 0.014) * (0.5 + 0.85 * sinA));
    const bevelGrad = ctx.createLinearGradient(
      seamX - (isLeft ? bevelW : 0),
      0,
      seamX + (isLeft ? 0 : bevelW),
      0
    );
    bevelGrad.addColorStop(0, '#9c7830');
    bevelGrad.addColorStop(0.5, '#f0d78c');
    bevelGrad.addColorStop(1, '#856422');
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(isLeft ? seamX - bevelW : seamX, seamY, bevelW, seamH);
  }

  function drawCurtains(partProgress) {
    const p = easeInOutCubic(partProgress);
    const isWide = W > H;

    if (p < 0.85) {
      const panelAlpha = clamp01(1 - (p - 0.15) / 0.7);
      const slideX = p * (W * 0.52);
      ctx.save();
      ctx.globalAlpha = panelAlpha;

      ['left', 'right'].forEach((side) => {
        const isLeft = side === 'left';
        const px = isLeft ? -slideX : W / 2 + slideX;
        const pw = W / 2 + 10;

        const silkGrad = ctx.createLinearGradient(px, 0, px + pw, 0);
        silkGrad.addColorStop(0, '#460811');
        silkGrad.addColorStop(0.5, '#7c1322');
        silkGrad.addColorStop(1, '#4b0913');
        ctx.fillStyle = silkGrad;
        ctx.fillRect(px, 0, pw, H);

        const folds = isWide ? 14 : 9;
        for (let i = 0; i < folds; i++) {
          const fx = px + (i / folds) * pw;
          const fw = pw / folds;
          const fGrad = ctx.createLinearGradient(fx, 0, fx + fw, 0);
          fGrad.addColorStop(0, 'rgba(20, 2, 5, 0.35)');
          fGrad.addColorStop(0.5, 'rgba(195, 58, 72, 0.25)');
          fGrad.addColorStop(1, 'rgba(18, 2, 4, 0.42)');
          ctx.fillStyle = fGrad;
          ctx.fillRect(fx, 0, fw, H);
        }
      });
      ctx.restore();
    }

    if (isWide && swagCanvas.width > 0 && p > 0.25) {
      const swagP = easeInOutCubic(clamp01((p - 0.25) / 0.75));
      const swagW = Math.min(W * 0.24, H * 0.44);
      const swagH = swagW * (swagCanvas.height / swagCanvas.width);
      const slideIn = (1 - swagP) * (-swagW * 0.35);

      ctx.save();
      ctx.globalAlpha = swagP;
      ctx.drawImage(swagCanvas, slideIn, 0, swagW, swagH);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = swagP;
      ctx.translate(W - slideIn, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(swagCanvas, 0, 0, swagW, swagH);
      ctx.restore();
    } else if (!isWide && mobileCurtainCanvas.width > 0 && p > 0.2) {
      const mobileAlpha = clamp01((p - 0.2) / 0.65);
      const zoom = 1.05 - 0.05 * p;
      const dw = W * zoom;
      const dh = H * zoom;
      ctx.save();
      ctx.globalAlpha = mobileAlpha;
      ctx.drawImage(mobileCurtainCanvas, (W - dw) / 2, 0, dw, dh);
      ctx.restore();
    }
  }

  function renderFrame(elapsed) {
    ctx.clearRect(0, 0, W, H);

    const gardenZoom = 1.05 - 0.05 * easeInOutCubic(clamp01((elapsed - 4200) / 7800));
    drawImageCover(themedGardenCanvas, 0, 0, W, H, gardenZoom, 0.88);

    // Soft radial vignette behind center names once curtains part
    if (elapsed > 5000) {
      const scrimAlpha = clamp01((elapsed - 5000) / 3000) * 0.42;
      const scrim = ctx.createRadialGradient(W / 2, H * 0.46, W * 0.05, W / 2, H * 0.46, Math.max(W, H) * 0.55);
      scrim.addColorStop(0, `rgba(38, 6, 11, ${scrimAlpha})`);
      scrim.addColorStop(1, 'rgba(20, 4, 7, 0)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, W, H);
    }

    if (elapsed > 4600) {
      const moteAlpha = clamp01((elapsed - 4600) / 1800);
      motes.forEach((m) => {
        const y = m.ny * H - ((elapsed * 0.016 * m.speed) % (H * 0.12));
        const x = m.nx * W + Math.sin(elapsed * 0.0012 + m.phase) * 12;
        ctx.fillStyle = `rgba(245, 224, 166, ${0.42 * moteAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const curtainP = clamp01((elapsed - 4400) / 4800);
    drawCurtains(curtainP);

    const doorP = easeInOutCubic(clamp01((elapsed - 1000) / 4200));
    const doorAngle = doorP * (Math.PI * 0.49);

    if (doorP < 0.995) {
      if (doorP > 0.02) {
        const shadowAlpha = Math.sin(doorP * Math.PI) * 0.36;
        const gapW = W * (1 - Math.cos(doorAngle));
        const shadowGrad = ctx.createRadialGradient(W / 2, H / 2, gapW * 0.15, W / 2, H / 2, Math.max(gapW, W * 0.45));
        shadowGrad.addColorStop(0, `rgba(20, 26, 14, ${shadowAlpha})`);
        shadowGrad.addColorStop(1, 'rgba(20, 26, 14, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, 0, W, H);
      }

      drawDoorLeaf3D('left', doorAngle);
      drawDoorLeaf3D('right', doorAngle);
      drawPlaqueHalf3D('left', doorAngle);
      drawPlaqueHalf3D('right', doorAngle);
    }
  }

  function step(ts) {
    if (!isPlaying) return;
    if (!startTime) startTime = ts;
    currentElapsed = ts - startTime;
    renderFrame(currentElapsed);

    if (!didReveal && currentElapsed >= REVEAL_AT_MS) {
      didReveal = true;
      if (typeof onRevealReady === 'function') onRevealReady();
    }

    if (currentElapsed < TOTAL_DURATION) {
      rafId = requestAnimationFrame(step);
    } else {
      isPlaying = false;
      canvas.style.cursor = 'default';
    }
  }

  return {
    start() {
      if (hasStarted) return false;
      hasStarted = true;
      isPlaying = true;
      startTime = 0;
      currentElapsed = 0;
      canvas.style.cursor = 'default';
      rafId = requestAnimationFrame(step);
      return true;
    },
  };
};

