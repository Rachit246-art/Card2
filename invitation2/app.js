/* ==========================================================================
   Royal Grace — Interactions, GSAP Animations, Audio, Scratch & i18n
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemedSectionBackgrounds();
  initPreloaderAndHero();
  initScrollAnimations();
  initAudioPlayer();
  initScratchCard();
  initSaveTheDate();
  initCarousel();
  initCountdown();
  initRsvpForm();
  initLanguageToggle();
  initExtraInteractions();
});

/* --------------------------------------------------------------------------
   0. Theme Section Backgrounds (Warm Sandstone Linen + Royal Crimson Roses)
   -------------------------------------------------------------------------- */
function initThemedSectionBackgrounds() {
  const targets = [
    { src: './assets/royal-grace-welcome-bg.jpg', cssVar: '--bg-welcome-img' },
    { src: './assets/royal-grace-general-bg.jpg', cssVar: '--bg-general-img' },
    { src: './assets/royal-grace-end-bg.jpg', cssVar: '--bg-end-img' },
  ];

  targets.forEach(({ src, cssVar }) => {
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          // Smoothly shift pinkish rose petals -> deep royal crimson-red
          // while keeping warm sandstone linen & dark-olive leaves clean
          const pinkness = Math.max(0, Math.min(1, ((r - g) - 10) / 28)) * Math.max(0, Math.min(1, (sat - 0.14) / 0.18));
          if (pinkness > 0.01) {
            const crimsonR = Math.round(r * 0.82);
            const crimsonG = Math.round(g * 0.24);
            const crimsonB = Math.round(b * 0.28);
            d[i] = Math.round(r * (1 - pinkness) + crimsonR * pinkness);
            d[i + 1] = Math.round(g * (1 - pinkness) + crimsonG * pinkness);
            d[i + 2] = Math.round(b * (1 - pinkness) + crimsonB * pinkness);
          } else {
            // Subtle warm golden-sandstone balance on linen (zero pink cast)
            d[i] = Math.min(255, Math.round(r * 1.02));
            d[i + 1] = Math.min(255, Math.round(g * 0.99));
            d[i + 2] = Math.round(b * 0.93);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        c.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          document.documentElement.style.setProperty(cssVar, `url("${url}")`);
        }, 'image/jpeg', 0.92);
      } catch {
        // Fallback to CSS default image if canvas read is restricted
      }
    };
    img.src = src;
  });
}

/* --------------------------------------------------------------------------
   1. Preloader & Hero Entrance (GSAP)
   -------------------------------------------------------------------------- */
function initPreloaderAndHero() {
  const preloader = document.getElementById('preloader');
  const heroCanvas = document.getElementById('hero-canvas');
  const heroContent = document.getElementById('hero-content');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const bgMusic = document.getElementById('bg-music');
  const iconMuted = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');

  // Lock page scroll until the user taps the "TAP TO OPEN" doors
  document.body.classList.add('door-locked');

  const dismissPreloader = () => {
    if (!preloader || preloader.classList.contains('is-done')) return;
    preloader.classList.add('is-done');
  };

  // Hold the royal preloader for 4.5 seconds before fading into the TAP TO OPEN cover
  setTimeout(dismissPreloader, 4500);

  if (heroCanvas && typeof window.createHeroOpening === 'function') {
    const opening = window.createHeroOpening(heroCanvas, () => {
      document.body.classList.remove('door-locked');
      heroContent?.classList.remove('is-hidden');
      scrollIndicator?.classList.remove('is-hidden');
      runHeroEntrance();
    });

    const handleTapToOpen = () => {
      if (!opening || !opening.start()) return;

      // Start background music when invitation opens
      if (bgMusic) {
        bgMusic.play().then(() => {
          iconMuted?.classList.add('hidden');
          iconUnmuted?.classList.remove('hidden');
        }).catch(() => {});
      }
    };

    heroCanvas.addEventListener('click', handleTapToOpen);
  }
}

function runHeroEntrance() {
  if (typeof gsap === 'undefined') return;
  gsap.from('.hero-anim', {
    y: 22,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
  });
}

/* --------------------------------------------------------------------------
   2. GSAP ScrollTrigger Section Reveals
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 84%',
        once: true,
      },
      clearProps: 'transform,opacity',
    });
  });
}

/* --------------------------------------------------------------------------
   3. Ambient Wedding Music Toggle (Web Audio Gentle Harp Chords)
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const btn = document.getElementById('audio-toggle');
  const bgMusic = document.getElementById('bg-music');
  const iconMuted = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');
  if (!btn || !bgMusic) return;

  btn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        iconMuted?.classList.add('hidden');
        iconUnmuted?.classList.remove('hidden');
      }).catch(() => {});
    } else {
      bgMusic.pause();
      iconUnmuted?.classList.add('hidden');
      iconMuted?.classList.remove('hidden');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Interactive HTML5 Canvas Scratch-to-Reveal Card
   -------------------------------------------------------------------------- */
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let isDrawing = false;
  let revealed = false;

  // Paint royal crimson & antique-gold speckled glitter foil
  const radGrad = ctx.createRadialGradient(
    canvas.width * 0.42,
    canvas.height * 0.36,
    12,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.62
  );
  radGrad.addColorStop(0, '#f7e9cc');
  radGrad.addColorStop(0.45, '#d4af37');
  radGrad.addColorStop(0.85, '#8a1826');
  radGrad.addColorStop(1, '#5c101b');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine glitter speckles across the heart foil
  const speckleColors = [
    'rgba(255, 248, 232, 0.85)',
    'rgba(243, 215, 120, 0.78)',
    'rgba(107, 16, 28, 0.55)',
    'rgba(61, 9, 17, 0.45)',
    'rgba(215, 165, 66, 0.65)',
  ];
  for (let i = 0; i < 950; i++) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * canvas.height;
    const sr = 0.5 + Math.random() * 1.6;
    ctx.fillStyle = speckleColors[i % speckleColors.length];
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  let lastSparkleTime = 0;

  function spawnTopSparkles(count) {
    const container = document.getElementById('scratch-sparkles');
    if (!container) return;
    const palette = ['#6b101c', '#a82232', '#ffffff', '#f5e4c3', '#d7a542'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'top-confetti';
      const color = palette[i % palette.length];
      const isRibbon = i % 5 === 0;

      if (isRibbon) {
        el.style.width = `${3 + Math.random() * 2}px`;
        el.style.height = `${12 + Math.random() * 10}px`;
        el.style.borderRadius = '2px';
      } else {
        const size = 5 + Math.random() * 6;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
      }

      el.style.backgroundColor = color;
      el.style.boxShadow = color === '#ffffff' || color === '#d7a542'
        ? `0 0 8px ${color}`
        : 'none';
      el.style.left = `${4 + Math.random() * 92}vw`;
      container.appendChild(el);

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(
          el,
          {
            y: -20,
            x: 0,
            opacity: 0.95,
            rotation: Math.random() * 180,
          },
          {
            y: window.innerHeight * (0.4 + Math.random() * 0.6),
            x: (Math.random() - 0.5) * 110,
            opacity: 0,
            rotation: (Math.random() - 0.5) * 360,
            duration: 1.8 + Math.random() * 1.4,
            delay: Math.random() * 0.25,
            ease: 'power1.out',
            onComplete: () => el.remove(),
          }
        );
      } else {
        setTimeout(() => el.remove(), 2200);
      }
    }
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function scratch(e) {
    if (!isDrawing || revealed) return;
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const now = Date.now();
    if (now - lastSparkleTime > 120) {
      lastSparkleTime = now;
      spawnTopSparkles(4);
    }

    checkRevealProgress();
  }

  function checkRevealProgress() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 16) {
      if (data[i] === 0) transparent++;
    }
    // Heart covers ~52% of the canvas rectangle, so ~24% of the rectangle ≈ 46% (half) of the heart
    const ratio = transparent / (data.length / 16);
    if (ratio >= 0.24) {
      revealed = true;
      isDrawing = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.add('is-revealed');
      const heading = document.getElementById('scratch-heading');
      if (heading) {
        heading.textContent =
          document.documentElement.lang === 'hi'
            ? 'हमारा सदा के लिए आरंभ'
            : 'Our forever begins';
      }
      spawnTopSparkles(42);
    }
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
  window.addEventListener('mouseup', () => { isDrawing = false; });
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: true });
  window.addEventListener('touchend', () => { isDrawing = false; });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); }, { passive: false });
}

/* --------------------------------------------------------------------------
   5. Save The Date Dropdown & .ics Download
   -------------------------------------------------------------------------- */
function initSaveTheDate() {
  const btn = document.getElementById('save-date-btn');
  const dropdown = document.getElementById('calendar-dropdown');
  const appleBtn = document.getElementById('download-ics-apple');
  const otherBtn = document.getElementById('download-ics-other');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    dropdown.classList.add('hidden');
  });

  const downloadICS = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zareqia//Royal Grace//EN',
      'BEGIN:VEVENT',
      'DTSTART:20270131T103000Z',
      'DTEND:20270131T150000Z',
      'SUMMARY:Wedding of Zayn & Nora',
      'LOCATION:Grand Palace Hall, City centre, London',
      'DESCRIPTION:We are honored to welcome you to the Wedding ceremony of Zayn & Nora.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zayn-nora-wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (appleBtn) appleBtn.addEventListener('click', downloadICS);
  if (otherBtn) otherBtn.addEventListener('click', downloadICS);
}

/* --------------------------------------------------------------------------
   6. Photo Carousel
   -------------------------------------------------------------------------- */
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!track || dots.length === 0) return;

  let index = 0;
  const total = dots.length;

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index || 0)));
  });

  setInterval(() => goTo(index + 1), 5000);

  // Touch swipe support on mobile
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? index + 1 : index - 1);
  });
}

/* --------------------------------------------------------------------------
   7. Live Countdown to January 31, 2027 10:30 AM
   -------------------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');
  if (!daysEl) return;

  const target = new Date('2027-01-31T10:30:00').getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   8. RSVP Form Submission
   -------------------------------------------------------------------------- */
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const feedback = document.getElementById('rsvp-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value.trim();
    const attending = document.getElementById('rsvp-attending').value;

    if (!name || !attending) {
      feedback.textContent = 'Please fill in your name and attendance selection.';
      feedback.classList.remove('hidden');
      return;
    }

    feedback.textContent = `Thank you, ${name}! Your RSVP has been recorded.`;
    feedback.classList.remove('hidden');
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   9. English / Hindi Language Toggle
   -------------------------------------------------------------------------- */
function initLanguageToggle() {
  const toggleBtn = document.getElementById('lang-toggle');
  const label = document.getElementById('lang-label');
  if (!toggleBtn || !label) return;

  const translations = {
    en: {
      tapToOpen: 'TAP TO OPEN',
      useDesign: 'Use this Design',
      groomName: 'Zayn',
      groomParent: 'Son of Mr. & Mrs. Malik',
      groomDegree: 'B.E., M.S.',
      groomRole: 'Data Scientist',
      brideName: 'Nora',
      brideParent: 'Daughter of Mr. & Mrs. Nasser',
      brideDegree: 'MBBS, M.D',
      brideRole: 'Pediatrician',
      scroll: 'SCROLL',
      welcomeText: 'We are honored to welcome you to the Wedding ceremony of Zayn & Nora. As they begin their journey together in faith and love,<br />we thank you for being part of this blessed occasion ❤',
      scratchHeading: 'Scratch to Reveal',
      youreInvited: "You're Invited!",
      weddingDate: 'January 31, 2027',
      weddingDay: 'Sunday',
      weddingTime: '10:30 AM',
      saveTheDate: 'SAVE THE DATE',
      countdownHeading: 'Counting Down to Forever',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
      timelineHeading: 'Program Timeline',
      timelineDay1: 'SUNDAY, JAN 31, 2027',
      guestArrival: 'Guest Arrival',
      guestArrivalSub: 'We welcome you.. ❤',
      weddingCeremony: 'Wedding Ceremony',
      weddingCeremonySub: 'Your presence means a lot!',
      timelineDay2: 'TUESDAY, FEB 2, 2027',
      reception: 'Reception',
      venueHeading: 'Venue',
      venueName: 'Grand Palace Hall',
      venueAddress: 'City centre, London',
      dressCodeHeading: 'Dress Code',
      women: 'Women',
      womenDress: 'Elegant formal attire in pastel or jewel tones',
      men: 'Men',
      menDress: 'Suit or traditional formal wear',
      preWeddingHeading: 'Pre-Wedding Events',
      mahendi: 'Mahendi',
      bridesHouse: "At Bride's House",
      haldi: 'Haldi',
      groomsHouse: "At Groom's House",
      transportHeading: 'Transportation',
      transportBody: 'Shuttle service will be available from the city center to the venue. Pickup point: Central Station at 3:30 PM.',
      accommodationHeading: 'Accommodation',
      accommodationBody: 'Special rates at The Grand Palace Hotel (5 min from venue). Use code WEDDING2026 when booking.',
      giftsHeading: 'Gifts',
      giftsBody: 'Your love, blessings, and presence are the greatest gifts we could ever ask for.',
      rsvpHeading: 'RSVP',
      yourName: 'Your Name',
      attendingLabel: 'Will you be attending?',
      yourMessage: 'Your Message',
      sendMessage: 'Send Message',
      closingMsg: "We can't wait to celebrate with you!",
      coupleShort: 'Zayn & Nora',
    },
    hi: {
      tapToOpen: 'खोलने के लिए टैप करें',
      useDesign: 'इस डिज़ाइन का उपयोग करें',
      groomName: 'ज़ैन',
      groomParent: 'श्री एवं श्रीमती मलिक के सुपुत्र',
      groomDegree: 'बी.ई., एम.एस.',
      groomRole: 'डेटा साइंटिस्ट',
      brideName: 'नोरा',
      brideParent: 'श्री एवं श्रीमती नासिर की सुपुत्री',
      brideDegree: 'एम.बी.बी.एस., एम.डी.',
      brideRole: 'बाल रोग विशेषज्ञ',
      scroll: 'नीचे स्क्रॉल करें',
      welcomeText: 'ज़ैन और नोरा के शुभ विवाह समारोह में आपका हार्दिक स्वागत करते हुए हमें अत्यंत प्रसन्नता हो रही है। विश्वास और प्रेम के साथ उनके नए जीवन की शुरुआत में,<br />इस पावन अवसर का हिस्सा बनने के लिए हम आपके आभारी हैं ❤',
      scratchHeading: 'तारीख़ देखने के लिए खुरचें',
      youreInvited: 'आप सादर आमंत्रित हैं!',
      weddingDate: '31 जनवरी 2027',
      weddingDay: 'रविवार',
      weddingTime: 'सुबह 10:30 बजे',
      saveTheDate: 'तारीख़ सहेजें',
      countdownHeading: 'सदा के मिलन की उलटी गिनती',
      days: 'दिन',
      hours: 'घंटे',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      timelineHeading: 'कार्यक्रम विवरण',
      timelineDay1: 'रविवार, 31 जनवरी 2027',
      guestArrival: 'अतिथि स्वागत',
      guestArrivalSub: 'आपका हार्दिक अभिनंदन है.. ❤',
      weddingCeremony: 'विवाह समारोह',
      weddingCeremonySub: 'आपकी उपस्थिति हमारे लिए अमूल्य है!',
      timelineDay2: 'मंगलवार, 2 फ़रवरी 2027',
      reception: 'प्रीतिभोज (रिसेप्शन)',
      venueHeading: 'विवाह स्थल',
      venueName: 'ग्रैंड पैलेस हॉल',
      venueAddress: 'सिटी सेंटर, लंदन',
      dressCodeHeading: 'परिधान (ड्रेस कोड)',
      women: 'महिलाएं',
      womenDress: 'पेस्टल या रत्न रंगों में सुरुचिपूर्ण औपचारिक परिधान',
      men: 'पुरुष',
      menDress: 'सूट या पारंपरिक औपचारिक परिधान',
      preWeddingHeading: 'विवाह-पूर्व कार्यक्रम',
      mahendi: 'मेहंदी',
      bridesHouse: 'वधू के निवास पर',
      haldi: 'हल्दी',
      groomsHouse: 'वर के निवास पर',
      transportHeading: 'यातायात व्यवस्था',
      transportBody: 'शहर के केंद्र से विवाह स्थल तक शटल सेवा उपलब्ध रहेगी। पिकअप बिंदु: सेंट्रल स्टेशन, दोपहर 3:30 बजे।',
      accommodationHeading: 'आवास व्यवस्था',
      accommodationBody: 'द ग्रैंड पैलेस होटल (स्थल से 5 मिनट की दूरी) में विशेष दरें उपलब्ध हैं। बुकिंग के समय कोड WEDDING2026 का उपयोग करें।',
      giftsHeading: 'उपहार',
      giftsBody: 'आपका स्नेह, आशीर्वाद और उपस्थिति ही हमारे लिए सबसे बड़ा उपहार है।',
      rsvpHeading: 'उपस्थिति की पुष्टि (RSVP)',
      yourName: 'आपका नाम',
      attendingLabel: 'क्या आप समारोह में शामिल होंगे?',
      yourMessage: 'आपका संदेश',
      sendMessage: 'संदेश भेजें',
      closingMsg: 'हम आपके साथ जश्न मनाने के लिए उत्सुक हैं!',
      coupleShort: 'ज़ैन & नोरा',
    },
  };

  let current = 'en';

  toggleBtn.addEventListener('click', () => {
    current = current === 'en' ? 'hi' : 'en';
    document.documentElement.lang = current;
    document.documentElement.dir = 'ltr';
    label.textContent = current === 'en' ? 'Hindi' : 'English';

    const dict = translations[current];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. Extra Tactile Interactions (Blessings, Flip Cards, Attend Chips, Diyas, Lightbox)
   -------------------------------------------------------------------------- */
function initExtraInteractions() {
  // 1. Shower Blessings & Crimson Petals
  const blessingBtn = document.getElementById('shower-blessings-btn');
  const blessingCountEl = document.getElementById('blessing-count');
  let count = Number(localStorage.getItem('royal_blessing_count') || 108);
  if (blessingCountEl) blessingCountEl.textContent = String(count);

  function spawnSparkleWave(waveCount) {
    const petalColors = ['#8b1624', '#b81d2f', '#d4af37', '#f7df8c', '#fff3c4'];
    for (let i = 0; i < waveCount; i++) {
      const p = document.createElement('span');
      const isSparkle = i % 2 === 0;
      const isRibbon = i % 7 === 0;

      if (isSparkle) {
        p.className = 'burst-sparkle';
        p.textContent = i % 4 === 0 ? '✧' : '✦';
        p.style.fontSize = `${14 + Math.random() * 18}px`;
        p.style.color = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fff1b8' : '#f3d778';
        p.style.textShadow = '0 0 12px rgba(255, 240, 175, 1), 0 0 24px rgba(212, 175, 55, 0.95)';
        p.style.top = '-28px';
      } else if (isRibbon) {
        p.className = 'floating-petal';
        p.style.width = '5px';
        p.style.height = `${16 + Math.random() * 12}px`;
        p.style.borderRadius = '3px';
        p.style.backgroundColor = petalColors[i % petalColors.length];
        p.style.boxShadow = '0 0 12px rgba(243, 215, 120, 0.85)';
      } else {
        p.className = 'floating-petal';
        const size = 11 + Math.random() * 10;
        p.style.width = `${size}px`;
        p.style.height = `${size * 0.7}px`;
        const col = petalColors[i % petalColors.length];
        p.style.backgroundColor = col;
        p.style.boxShadow = col === '#d4af37' || col === '#f7df8c' || col === '#fff3c4'
          ? '0 0 14px rgba(255, 232, 140, 0.95)'
          : '0 2px 8px rgba(92, 16, 28, 0.45)';
      }

      p.style.left = `${1 + Math.random() * 98}vw`;
      document.body.appendChild(p);

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(
          p,
          { y: -30, opacity: 1, scale: 0.7 + Math.random() * 0.6, rotation: Math.random() * 180 },
          {
            y: window.innerHeight + 70,
            x: (Math.random() - 0.5) * 200,
            opacity: 0,
            rotation: (Math.random() - 0.5) * 520,
            duration: 2.2 + Math.random() * 1.6,
            delay: Math.random() * 0.25,
            ease: 'power1.out',
            onComplete: () => p.remove(),
          }
        );
      } else {
        setTimeout(() => p.remove(), 3200);
      }
    }
  }

  function launchPetals(amount, originEl) {
    // 1. Intense radial golden star-sparkle burst right from the clicked button/element
    if (originEl) {
      const rect = originEl.getBoundingClientRect();
      const ox = rect.left + rect.width / 2;
      const oy = rect.top + rect.height / 2;
      const burstCount = 50;

      for (let i = 0; i < burstCount; i++) {
        const sp = document.createElement('span');
        sp.className = 'burst-sparkle';
        const isStar = i % 3 !== 0;
        sp.textContent = isStar ? (i % 2 === 0 ? '✦' : '✧') : '●';
        const fontSize = isStar ? 16 + Math.random() * 16 : 7 + Math.random() * 6;
        sp.style.fontSize = `${fontSize}px`;
        sp.style.color = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fff0b3' : '#f3d778';
        sp.style.textShadow = '0 0 14px rgba(255, 240, 175, 1), 0 0 28px rgba(212, 175, 55, 0.95)';
        sp.style.left = `${ox}px`;
        sp.style.top = `${oy}px`;
        document.body.appendChild(sp);

        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.35;
        const dist = 80 + Math.random() * 210;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 40;

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            sp,
            { x: 0, y: 0, scale: 0.3, opacity: 1, rotation: 0 },
            {
              x: tx,
              y: ty + 55,
              scale: 1.35,
              opacity: 0,
              rotation: (Math.random() - 0.5) * 260,
              duration: 1.3 + Math.random() * 0.7,
              ease: 'power2.out',
              onComplete: () => sp.remove(),
            }
          );
        } else {
          setTimeout(() => sp.remove(), 1600);
        }
      }
    }

    // 2. Continuous 4-second heavy sparkle & petal shower (~350+ sparkles total)
    spawnSparkleWave(Math.max(24, Math.round(amount * 0.5)));
    const startMs = Date.now();
    const showerInterval = setInterval(() => {
      if (Date.now() - startMs >= 4000) {
        clearInterval(showerInterval);
        return;
      }
      spawnSparkleWave(16);
    }, 180);
  }

  blessingBtn?.addEventListener('click', () => {
    count += 1;
    localStorage.setItem('royal_blessing_count', String(count));
    if (blessingCountEl) blessingCountEl.textContent = String(count);
    launchPetals(55, blessingBtn);
  });

  // 2. 3D Flip Cards (Dress Code & Pre-Wedding)
  document.querySelectorAll('.flip-card').forEach((card) => {
    const toggleFlip = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };
    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  // 3. Timeline "Mark Attending" Chips
  document.querySelectorAll('.attend-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const active = chip.classList.toggle('is-attending');
      const labelSpan = chip.querySelector('span');
      if (labelSpan) {
        labelSpan.textContent = active ? 'Excited to Attend!' : 'Mark Attending';
      }
    });
  });

  // 4. Sacred Diya Lighting Ritual
  const diyaBtns = document.querySelectorAll('.diya-btn');
  const diyaStatus = document.getElementById('diya-status');
  diyaBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-lit');
      const litCount = document.querySelectorAll('.diya-btn.is-lit').length;
      if (!diyaStatus) return;
      if (litCount === 0) {
        diyaStatus.textContent = '';
      } else if (litCount < diyaBtns.length) {
        diyaStatus.textContent = `${litCount} of ${diyaBtns.length} sacred diyas lit with your blessings ✨`;
      } else {
        diyaStatus.textContent = 'All 4 sacred diyas are glowing — thank you for your warm blessings! 🪔';
        launchPetals(60, btn);
      }
    });
  });

  // 5. Photo Gallery Lightbox
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const slideImgs = Array.from(document.querySelectorAll('.carousel-slide img'));
  let lbIndex = 0;

  function openLightbox(idx) {
    if (!lightbox || !lightboxImg || slideImgs.length === 0) return;
    lbIndex = (idx + slideImgs.length) % slideImgs.length;
    lightboxImg.src = slideImgs[lbIndex].src;
    lightbox.classList.remove('hidden');
  }

  slideImgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose?.addEventListener('click', () => lightbox?.classList.add('hidden'));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });
  lightboxPrev?.addEventListener('click', () => openLightbox(lbIndex - 1));
  lightboxNext?.addEventListener('click', () => openLightbox(lbIndex + 1));
}

