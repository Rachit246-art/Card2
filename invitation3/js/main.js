/**
 * Main Application Controller
 */
document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.WEDDING_CONFIG;

  const bindMap = {
    monogram: cfg.couple.monogram,
    groom: cfg.couple.groom,
    bride: cfg.couple.bride,
    tagline: cfg.couple.tagline,
    dateDisplay: cfg.couple.dateDisplay,
    city: cfg.couple.city,
    hashtag: cfg.couple.hashtag
  };
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const key = el.getAttribute("data-bind");
    if (bindMap[key]) el.textContent = bindMap[key];
  });

  window.RoyalArtwork.renderHeroPalace(document.getElementById("hero-palace-layer"));
  window.RoyalArtwork.renderHeroArches(document.getElementById("hero-arch-frame"));
  window.RoyalArtwork.renderHeroCouple(document.getElementById("hero-couple-layer"));
  window.RoyalParticles.initHeroFireflies("hero-particles");

  const parallaxEls = document.querySelectorAll("[data-parallax]");
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      document.getElementById("navbar")?.classList.toggle("scrolled", y > 40);
      if (y < window.innerHeight * 1.2) {
        parallaxEls.forEach((el) => {
          const factor = parseFloat(el.dataset.parallax || "0");
          el.style.transform = `translate3d(0, ${y * factor}px, 0)`;
        });
      }
    },
    { passive: true }
  );

  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  navToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    })
  );

  const musicNavBtn = document.getElementById("music-toggle-nav");
  const musicFab = document.getElementById("music-fab");
  const musicWidget = document.getElementById("music-widget");
  const musicVolume = document.getElementById("music-volume");

  function syncMusicUI(playing) {
    musicNavBtn?.classList.toggle("is-playing", playing);
    musicWidget?.classList.toggle("is-playing", playing);
  }

  function handleMusicToggle() {
    const playing = window.RoyalAudio.toggle();
    syncMusicUI(playing);
  }

  musicNavBtn?.addEventListener("click", handleMusicToggle);
  musicFab?.addEventListener("click", handleMusicToggle);
  musicVolume?.addEventListener("input", (e) => window.RoyalAudio.setVolume(e.target.value));

  function triggerRipple(btn, e) {
    const ripple = document.createElement("span");
    ripple.className = "touch-ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${(e?.clientX ? e.clientX - rect.left : rect.width / 2) - size / 2}px`;
    ripple.style.top = `${(e?.clientY ? e.clientY - rect.top : rect.height / 2) - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  document.getElementById("btn-touch-explore")?.addEventListener("click", function (e) {
    triggerRipple(this, e);
    window.RoyalAudio.playChime(523.25);
    document.getElementById("hero")?.classList.toggle("details-revealed");
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  });

  const surpriseBanner = document.getElementById("surprise-banner");
  const surpriseText = document.getElementById("surprise-text");
  let surpriseIdx = 0;

  function showSurprise(btn, e) {
    if (btn) triggerRipple(btn, e);
    window.RoyalAudio.playChime(587.33);
    surpriseText.textContent = cfg.surpriseMessages[surpriseIdx % cfg.surpriseMessages.length];
    surpriseIdx += 1;
    surpriseBanner.hidden = false;
  }

  document.getElementById("btn-shake-surprise")?.addEventListener("click", function (e) {
    showSurprise(this, e);
  });
  document.getElementById("surprise-close")?.addEventListener("click", () => {
    surpriseBanner.hidden = true;
  });

  let lastShake = 0;
  window.addEventListener("devicemotion", (e) => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const mag = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
    if (mag > 28 && Date.now() - lastShake > 2500) {
      lastShake = Date.now();
      showSurprise();
    }
  });

  document.getElementById("btn-quick-diya")?.addEventListener("click", function (e) {
    triggerRipple(this, e);
    document.querySelector(".mini-diya-icon")?.classList.add("lit");
    window.SacredDiya.igniteFromBar();
    document.getElementById("diya")?.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("btn-send-blessings")?.addEventListener("click", function (e) {
    triggerRipple(this, e);
    document.getElementById("guestbook")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("wish-name")?.focus(), 650);
  });

  window.LivingBook.init(cfg.storyChapters);

  const pavilionsEl = document.getElementById("garden-pavilions");
  let activeExp = cfg.experiences[0];

  function renderExperience(exp) {
    activeExp = exp;
    document.getElementById("exp-visual").innerHTML = `<img src="${window.RoyalArtwork.images[exp.artworkKey]}" alt="${exp.name} celebration" loading="lazy" />`;
    document.getElementById("exp-subtitle").textContent = exp.subtitle;
    document.getElementById("exp-title").textContent = exp.name;
    document.getElementById("exp-date").textContent = exp.date;
    document.getElementById("exp-time").textContent = exp.time;
    document.getElementById("exp-venue").textContent = exp.venue;
    document.getElementById("exp-attire").textContent = exp.attire;
    document.getElementById("exp-desc").textContent = exp.description;

    Array.from(pavilionsEl.children).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.expId === exp.id);
    });
  }

  if (pavilionsEl && cfg.experiences.length) {
    pavilionsEl.innerHTML = cfg.experiences
      .map(
        (exp, i) => `
      <button type="button" class="pavilion-btn ${i === 0 ? "active" : ""}" data-exp-id="${exp.id}" role="tab">
        <span class="pavilion-name">${exp.name}</span>
        <span class="pavilion-meta">${exp.date} • ${exp.venue}</span>
      </button>
    `
      )
      .join("");

    pavilionsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".pavilion-btn");
      if (!btn) return;
      const found = cfg.experiences.find((x) => x.id === btn.dataset.expId);
      if (found) {
        window.RoyalAudio.playChime(493.88);
        renderExperience(found);
      }
    });

    renderExperience(cfg.experiences[0]);
  }

  document.getElementById("add-to-calendar-btn")?.addEventListener("click", () => {
    if (!activeExp) return;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AaravAnanyaWedding//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${cfg.couple.groom} & ${cfg.couple.bride} — ${activeExp.name}`,
      `DTSTART:${activeExp.calendarStart}`,
      `DTEND:${activeExp.calendarEnd}`,
      `LOCATION:${activeExp.venue}, ${cfg.venue.name}, ${cfg.couple.city}`,
      `DESCRIPTION:${activeExp.description}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeExp.id}-wedding-invitation.ics`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const targetMs = new Date(cfg.couple.isoDate).getTime();
  function updateCountdown() {
    const diff = Math.max(0, targetMs - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById("cd-days").textContent = String(d).padStart(3, "0");
    document.getElementById("cd-hours").textContent = String(h).padStart(2, "0");
    document.getElementById("cd-minutes").textContent = String(m).padStart(2, "0");
    document.getElementById("cd-seconds").textContent = String(s).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  window.SacredDiya.init();

  const blessingCountEl = document.getElementById("blessing-count");
  const blessingThanksEl = document.getElementById("blessing-thanks");

  window.WeddingAPI.getBlessingCount().then((c) => {
    if (blessingCountEl) blessingCountEl.textContent = c;
  });

  document.getElementById("shower-blessing-btn")?.addEventListener("click", async () => {
    window.RoyalAudio.playChime(698.46);
    window.RoyalParticles.spawnPetalShower("blessing-petals-canvas", 55);
    const next = await window.WeddingAPI.incrementBlessings();
    if (blessingCountEl) blessingCountEl.textContent = next;
    if (blessingThanksEl) {
      blessingThanksEl.textContent = "Thank you for showering Aarav & Ananya with your heartfelt blessings!";
    }
  });

  const wishesWall = document.getElementById("wishes-wall");
  const wishForm = document.getElementById("guestbook-form");
  const wishFeedback = document.getElementById("wish-feedback");

  function renderWishes(list) {
    if (!wishesWall) return;
    wishesWall.innerHTML = list
      .map(
        (w) => `
      <article class="wish-card">
        <p>“${escapeHtml(w.message)}”</p>
        <span class="wish-author">— ${escapeHtml(w.name)}</span>
      </article>
    `
      )
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.WeddingAPI.getWishes().then(renderWishes);

  wishForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    wishFeedback.classList.remove("error");
    const name = document.getElementById("wish-name").value.trim();
    const message = document.getElementById("wish-message").value.trim();
    const btn = document.getElementById("wish-submit-btn");

    if (!name || !message) {
      wishFeedback.classList.add("error");
      wishFeedback.textContent = "Please enter both your name and a blessing.";
      return;
    }

    btn.disabled = true;
    wishFeedback.textContent = "Sealing your wish on royal parchment...";
    try {
      const saved = await window.WeddingAPI.postWish(name, message);
      const current = await window.WeddingAPI.getWishes();
      renderWishes(current.some((w) => w.id === saved.id) ? current : [saved, ...current]);
      wishForm.reset();
      wishFeedback.textContent = "✦ Thank you! Your wish has been added to our guestbook.";
      window.RoyalAudio.playChime(587.33);
    } catch (err) {
      wishFeedback.classList.add("error");
      wishFeedback.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });

  const dressGrid = document.getElementById("dresscode-grid");
  if (dressGrid) {
    dressGrid.innerHTML = cfg.dressCode
      .map(
        (card) => `
      <div class="flip-card" tabindex="0" role="button" aria-label="Flip ${card.title} outfit card">
        <div class="flip-card-inner">
          <div class="flip-face flip-front">
            <img src="${window.RoyalArtwork.images[card.artworkKey]}" alt="${card.title}" loading="lazy" />
            <div class="flip-front-overlay">
              <span>${card.subtitle}</span>
              <h3>${card.title}</h3>
              <span>${card.badge} • Tap to flip</span>
            </div>
          </div>
          <div class="flip-face flip-back">
            <div>
              <h3>${card.title}</h3>
              <ul class="outfit-list">
                ${card.outfits.map((o) => `<li>${o}</li>`).join("")}
              </ul>
            </div>
            <div>
              <div class="swatch-row">
                ${card.colors.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("")}
              </div>
              <p class="flip-tip">${card.tip}</p>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    dressGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".flip-card");
      if (card) card.classList.toggle("flipped");
    });
  }

  document.getElementById("venue-image-wrap").innerHTML = `<img src="${window.RoyalArtwork.images.venue}" alt="${cfg.venue.name}" loading="lazy" />`;
  document.getElementById("venue-subtitle").textContent = cfg.venue.subtitle;
  document.getElementById("venue-name").textContent = cfg.venue.name;
  document.getElementById("venue-address").textContent = cfg.venue.address;
  document.getElementById("venue-desc").textContent = cfg.venue.description;
  document.getElementById("venue-map-link").href = `https://www.google.com/maps/search/?api=1&query=${cfg.venue.mapQuery}`;
  document.getElementById("venue-directions-link").href = `https://www.google.com/maps/dir/?api=1&destination=${cfg.venue.lat},${cfg.venue.lng}`;

  let attending = true;
  const yesBtn = document.getElementById("rsvp-yes-btn");
  const noBtn = document.getElementById("rsvp-no-btn");
  const guestsGroup = document.getElementById("rsvp-guests-group");
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpConfirmed = document.getElementById("rsvp-confirmed");
  const rsvpFeedback = document.getElementById("rsvp-feedback");

  function setAttending(val) {
    attending = val;
    yesBtn?.classList.toggle("active", val);
    noBtn?.classList.toggle("active", !val);
    if (guestsGroup) guestsGroup.style.display = val ? "block" : "none";
  }

  yesBtn?.addEventListener("click", () => setAttending(true));
  noBtn?.addEventListener("click", () => setAttending(false));

  rsvpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    rsvpFeedback.classList.remove("error");
    const name = document.getElementById("rsvp-name").value.trim();
    const guests = document.getElementById("rsvp-guests").value;
    const contact = document.getElementById("rsvp-contact").value.trim();
    const message = document.getElementById("rsvp-message").value.trim();
    const submitBtn = document.getElementById("rsvp-submit-btn");

    if (!name || !contact) {
      rsvpFeedback.classList.add("error");
      rsvpFeedback.textContent = "Please enter your name and email or phone number.";
      return;
    }

    submitBtn.disabled = true;
    rsvpFeedback.textContent = "Recording your royal RSVP...";
    try {
      await window.WeddingAPI.submitRsvp({ attending, name, guests, contact, message });
      rsvpForm.hidden = true;
      rsvpConfirmed.hidden = false;
      document.getElementById("rsvp-confirmed-title").textContent = attending
        ? `We Can’t Wait to Welcome You, ${name}!`
        : `Thank You for Letting Us Know, ${name}`;
      document.getElementById("rsvp-confirmed-msg").textContent = attending
        ? `Your seats for ${guests} guest(s) at ${cfg.venue.name} are joyfully confirmed.`
        : "You will be dearly missed in Udaipur, and we carry your warm blessings with us.";
      window.RoyalAudio.playChime(659.25);
    } catch (err) {
      rsvpFeedback.classList.add("error");
      rsvpFeedback.textContent = err.message;
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById("rsvp-edit-btn")?.addEventListener("click", () => {
    rsvpConfirmed.hidden = true;
    rsvpForm.hidden = false;
    rsvpFeedback.textContent = "";
  });

  const revealEls = document.querySelectorAll(".reveal-up");
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    revealEls.forEach((el) => {
      window.gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () => el.classList.add("is-visible")
        }
      });
    });
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }
});
