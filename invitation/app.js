/* ==========================================================================
   Royal Grace — Interactions, GSAP Animations, Audio, Scratch & i18n
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloaderAndHero();
  initScrollAnimations();
  initAudioPlayer();
  initScratchCard();
  initSaveTheDate();
  initCarousel();
  initCountdown();
  initRsvpForm();
  initLanguageToggle();
});

/* --------------------------------------------------------------------------
   1. Preloader & Hero Entrance (GSAP)
   -------------------------------------------------------------------------- */
function initPreloaderAndHero() {
  const preloader = document.getElementById('preloader');
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.getElementById('hero-content');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const bgMusic = document.getElementById('bg-music');
  const iconMuted = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');

  // Lock page scroll until the user taps the "TAP TO OPEN" video cover
  document.body.classList.add('door-locked');

  const dismissPreloader = () => {
    if (!preloader || preloader.classList.contains('is-done')) return;
    preloader.classList.add('is-done');
  };

  // Hold the royal preloader for 4.5 seconds before fading into the TAP TO OPEN cover
  setTimeout(dismissPreloader, 4500);

  if (heroVideo) {
    let hasStarted = false;

    const handleTapToOpen = async () => {
      if (hasStarted) return;
      hasStarted = true;
      heroVideo.style.cursor = 'default';

      try {
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        await heroVideo.play();
      } catch {
        // Fallback if autoplay/play is blocked
      }

      // Start background music when invitation opens
      if (bgMusic) {
        bgMusic.play().then(() => {
          iconMuted?.classList.add('hidden');
          iconUnmuted?.classList.remove('hidden');
        }).catch(() => {});
      }

      // Match Zareqia's exact 6000ms reveal timing after video starts opening
      window.setTimeout(() => {
        document.body.classList.remove('door-locked');
        heroContent?.classList.remove('is-hidden');
        scrollIndicator?.classList.remove('is-hidden');
        runHeroEntrance();
      }, 6000);
    };

    heroVideo.addEventListener('click', handleTapToOpen);
    heroVideo.addEventListener('ended', () => {
      try {
        heroVideo.pause();
      } catch {}
    });
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

  // Paint sage-olive & pearl-cream speckled glitter foil (matching reference)
  const radGrad = ctx.createRadialGradient(
    canvas.width * 0.42,
    canvas.height * 0.36,
    12,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.62
  );
  radGrad.addColorStop(0, '#eeecdf');
  radGrad.addColorStop(0.45, '#b6bfa6');
  radGrad.addColorStop(0.85, '#7f8e6d');
  radGrad.addColorStop(1, '#687757');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine glitter speckles across the heart foil
  const speckleColors = [
    'rgba(255, 255, 255, 0.85)',
    'rgba(244, 240, 224, 0.75)',
    'rgba(74, 92, 61, 0.55)',
    'rgba(59, 68, 50, 0.45)',
    'rgba(215, 195, 140, 0.6)',
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
    const palette = ['#4a5c3d', '#9ab08e', '#ffffff', '#f5f0e1', '#d7a542'];

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

