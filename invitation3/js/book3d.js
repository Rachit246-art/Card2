/**
 * 3D Living Book — Interactive 4-Chapter Storybook
 */
window.LivingBook = (() => {
  let chapters = [];
  let current = 0;
  let isAnimating = false;
  let dragStartX = null;

  const els = {};

  function renderChapter(idx) {
    const ch = chapters[idx];
    if (!ch) return;

    const imgSrc = window.RoyalArtwork.images[ch.artworkKey] || "";
    els.leftArt.innerHTML = `<img src="${imgSrc}" alt="${ch.title}" loading="lazy" />`;
    els.leftChapter.textContent = ch.chapter;
    els.leftDate.textContent = ch.date;
    els.rightLocation.textContent = ch.location;
    els.rightTitle.textContent = ch.title;
    els.rightStory.textContent = ch.story;
    els.pageNum.textContent = `Page ${idx + 1} of ${chapters.length}`;

    els.prevBtn.disabled = idx === 0;
    els.nextBtn.disabled = idx === chapters.length - 1;

    Array.from(els.dots.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
      dot.setAttribute("aria-selected", String(i === idx));
    });
  }

  function turnTo(nextIdx) {
    if (isAnimating || nextIdx < 0 || nextIdx >= chapters.length || nextIdx === current) return;
    isAnimating = true;
    const direction = nextIdx > current ? "turning-next" : "turning-prev";
    els.turningLeaf.classList.remove("turning-next", "turning-prev");
    void els.turningLeaf.offsetWidth;
    els.turningLeaf.classList.add(direction);

    window.RoyalAudio?.playChime(nextIdx > current ? 523.25 : 440);

    setTimeout(() => {
      current = nextIdx;
      renderChapter(current);
    }, 340);

    setTimeout(() => {
      els.turningLeaf.classList.remove("turning-next", "turning-prev");
      isAnimating = false;
    }, 760);
  }

  function init(storyChapters) {
    chapters = storyChapters || [];
    els.book = document.getElementById("living-book");
    els.leftArt = document.getElementById("book-left-art");
    els.leftChapter = document.getElementById("book-left-chapter");
    els.leftDate = document.getElementById("book-left-date");
    els.rightLocation = document.getElementById("book-right-location");
    els.rightTitle = document.getElementById("book-right-title");
    els.rightStory = document.getElementById("book-right-story");
    els.pageNum = document.getElementById("book-page-num");
    els.turningLeaf = document.getElementById("book-turning-leaf");
    els.prevBtn = document.getElementById("book-prev-btn");
    els.nextBtn = document.getElementById("book-next-btn");
    els.dots = document.getElementById("book-dots");

    if (!els.book || !chapters.length) return;

    els.dots.innerHTML = chapters
      .map(
        (c, i) =>
          `<button type="button" class="book-dot ${i === 0 ? "active" : ""}" aria-label="Go to ${c.title}" data-index="${i}"></button>`
      )
      .join("");

    els.dots.addEventListener("click", (e) => {
      const btn = e.target.closest(".book-dot");
      if (btn) turnTo(Number(btn.dataset.index));
    });

    els.prevBtn.addEventListener("click", () => turnTo(current - 1));
    els.nextBtn.addEventListener("click", () => turnTo(current + 1));

    els.book.addEventListener("click", (e) => {
      if (dragStartX !== null) return;
      const rect = els.book.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      if (relX > rect.width * 0.55) turnTo(current + 1);
      else if (relX < rect.width * 0.45) turnTo(current - 1);
    });

    els.book.addEventListener("pointerdown", (e) => {
      dragStartX = e.clientX;
    });

    els.book.addEventListener("pointerup", (e) => {
      if (dragStartX === null) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 45) {
        turnTo(dx < 0 ? current + 1 : current - 1);
      }
      setTimeout(() => {
        dragStartX = null;
      }, 20);
    });

    renderChapter(0);
  }

  return { init, turnTo };
})();
