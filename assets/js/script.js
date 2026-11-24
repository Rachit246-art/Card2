/* Clean standalone script for The Digital Yes recreation with interactive scroll story */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 2. Interactive How It Works Scroll Story Controller
  const stepPanes = document.querySelectorAll('.hw-step-pane');
  const tabs = document.querySelectorAll('.hw-tab');
  const slideMedias = document.querySelectorAll('.hw-slide-media');

  function setActiveStep(stepIndex) {
    // Update tabs
    tabs.forEach(tab => {
      if (tab.getAttribute('data-step') === String(stepIndex)) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update visuals
    slideMedias.forEach(media => {
      if (media.id === `hwMedia${stepIndex}`) {
        media.classList.add('active');
      } else {
        media.classList.remove('active');
      }
    });

    // Update step pane text opacity
    stepPanes.forEach(pane => {
      if (pane.getAttribute('data-step') === String(stepIndex)) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  // Click on tabs to switch
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = tab.getAttribute('data-step');
      setActiveStep(step);
      const targetPane = document.getElementById(`hwStep${step}`);
      if (targetPane) {
        targetPane.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Scroll observer to automatically switch slide as you scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = entry.target.getAttribute('data-step');
          if (step) {
            setActiveStep(step);
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.2
    });

    stepPanes.forEach(pane => observer.observe(pane));
  }

  // 3. Interactive Gift Card 3D Tilt Effect
  const giftCard = document.getElementById('giftCard');
  if (giftCard) {
    giftCard.addEventListener('mousemove', (e) => {
      const rect = giftCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 18;
      const rotateY = (x / rect.width) * 18;
      giftCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    giftCard.addEventListener('mouseleave', () => {
      giftCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      giftCard.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    giftCard.addEventListener('mouseenter', () => {
      giftCard.style.transition = 'none';
    });
  }

  // 4. Autoplay all background videos
  document.querySelectorAll('video').forEach(video => {
    video.muted = true;
    video.setAttribute('playsinline', '');
    video.play().catch(() => {});
  });
});


// 5. Save the Dates Tab Switcher
function switchStdTab(btn, mode) {
  document.querySelectorAll('.t5-std-tab').forEach(b => {
    b.classList.remove('active');
    b.style.background = 'transparent';
    b.style.color = '#59262F';
  });
  btn.classList.add('active');
  btn.style.background = '#511317';
  btn.style.color = '#fff';
}

// 6. Show All 16 Save the Dates Toggle
function toggleStdMore() {
  const extraItems = document.querySelectorAll('.t5-std-extra');
  const btn = document.getElementById('stdToggleBtn');
  if (!extraItems.length || !btn) return;

  const isHidden = extraItems[0].style.display === 'none';
  extraItems.forEach(item => {
    item.style.display = isHidden ? 'flex' : 'none';
  });

  if (isHidden) {
    btn.textContent = 'SHOW FEWER SAVE THE DATES';
  } else {
    btn.textContent = 'SHOW ALL 16 SAVE THE DATES · 12 MORE';
  }
}

// 7. Toggle Favorite Heart
function toggleFav(btn) {
  const svg = btn.querySelector('svg');
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    btn.style.color = 'inherit';
    if (svg) svg.setAttribute('fill', 'none');
  } else {
    btn.classList.add('active');
    btn.style.color = '#511317';
    if (svg) svg.setAttribute('fill', '#511317');
  }
}

// 8. Select Gift Card Amount Pill
function selectGiftAmount(btn, val) {
  document.querySelectorAll('.t5-gift-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}


// 9. Interactive 37 Demos Theme Selector
function selectDemoTheme(btn, title, imgSrc) {
  const phoneImg = document.getElementById('demoPhoneImg');
  const demoTitle = document.getElementById('demoTitle');
  const pills = document.querySelectorAll('.t5-demo-pill');

  // Update pills active state
  pills.forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  // Update title
  if (demoTitle) {
    demoTitle.textContent = title;
  }

  // Smooth image transition
  if (phoneImg) {
    phoneImg.classList.add('fade-out');
    setTimeout(() => {
      phoneImg.src = imgSrc;
      phoneImg.onload = () => {
        phoneImg.classList.remove('fade-out');
      };
      // fallback in case onload doesn't fire immediately
      setTimeout(() => phoneImg.classList.remove('fade-out'), 150);
    }, 180);
  }
}

// 10. Horizontal Reel Carousel Scroller & Video Audio Controls
function scrollReels(direction) {
  const row = document.getElementById('reelsRow');
  if (row) {
    const scrollAmount = direction * 280;
    row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function toggleReelAudio(cardEl) {
  const video = cardEl.querySelector('.t5-reel-video');
  const mutedIcon = cardEl.querySelector('.t5-icon-muted');
  const unmutedIcon = cardEl.querySelector('.t5-icon-unmuted');
  if (!video) return;

  if (video.paused) {
    video.play();
  }

  // Toggle audio
  video.muted = !video.muted;
  if (!video.muted) {
    // Mute all other reels
    document.querySelectorAll('.t5-reel-video').forEach(function(v) {
      if (v !== video) {
        v.muted = true;
        const parent = v.closest('.t5-reel-card');
        if (parent) {
          const m = parent.querySelector('.t5-icon-muted');
          const u = parent.querySelector('.t5-icon-unmuted');
          if (m) m.style.display = 'block';
          if (u) u.style.display = 'none';
        }
      }
    });
    if (mutedIcon) mutedIcon.style.display = 'none';
    if (unmutedIcon) unmutedIcon.style.display = 'block';
  } else {
    if (mutedIcon) mutedIcon.style.display = 'block';
    if (unmutedIcon) unmutedIcon.style.display = 'none';
  }
}


// 11. Save the Date Custom Modal Handler (Reference Image 2)
function openStdModal(templateName, price) {
  const overlay = document.getElementById('stdModalOverlay');
  const nameEl = document.getElementById('stdModalTemplateName');
  const priceEl = document.getElementById('stdModalTemplatePrice');

  if (nameEl) nameEl.textContent = templateName || 'Custom';
  if (priceEl) priceEl.textContent = price || '€135';

  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
  }
}

function closeStdModal() {
  const overlay = document.getElementById('stdModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStdModal();
  }
});


// 12. Interactive Invitation Demo Phone Upward Scroll Controller
const invSectionOffsets = [0, -14, -28, -42, -58, -72, -86];
let invScrollResumeTimer = null;

function jumpToDemoSection(index) {
  const steps = document.querySelectorAll('.t5-inv-step');
  const strip = document.getElementById('invStripImg');

  // Update active step highlight
  steps.forEach((s, i) => {
    if (i === index) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  if (strip) {
    // Pause animation and smoothly animate to the target section
    strip.style.animation = 'none';
    strip.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    const offset = invSectionOffsets[index] || 0;
    strip.style.transform = `translateY(${offset}%)`;

    // Resume continuous upward marquee scroll after 5 seconds
    clearTimeout(invScrollResumeTimer);
    invScrollResumeTimer = setTimeout(() => {
      strip.style.transition = 'none';
      strip.style.animation = 't5-scroll-upward 45s linear infinite';
    }, 5000);
  }
}


/* --- LUXURY GIFT CARD SECTION INTERACTION --- */
function selectGiftOption(rowEl, price) {
  var allRows = document.querySelectorAll('.t5-gift-row');
  allRows.forEach(function(r) { r.classList.remove('active'); });
  rowEl.classList.add('active');

  var ctaBtn = document.getElementById('giftCtaBtn');
  if (ctaBtn) {
    if (price === '50+') {
      ctaBtn.innerHTML = '<span style="font-size:13px; margin-right:4px;">🛍️</span> GIVE THIS CARD · €50+';
    } else {
      ctaBtn.innerHTML = '<span style="font-size:13px; margin-right:4px;">🛍️</span> GIVE THIS CARD · €' + price;
    }
  }
}

// 3D Tilt effect for Gift Card on hover
document.addEventListener('DOMContentLoaded', function() {
  var card3d = document.getElementById('giftCard3d');
  if (!card3d) return;

  card3d.addEventListener('mousemove', function(e) {
    var rect = card3d.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var rotateX = ((y - centerY) / centerY) * -12;
    var rotateY = ((x - centerX) / centerX) * 12;

    card3d.style.transform = 'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
  });

  card3d.addEventListener('mouseleave', function() {
    card3d.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});


