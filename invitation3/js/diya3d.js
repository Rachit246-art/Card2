/**
 * Interactive Sacred Brass Diya
 */
window.SacredDiya = (() => {
  const SESSION_KEY = "royal_diya_lit_session";

  function ignite(sanctuary, statusEl, cardEl, playEffects = true) {
    if (!sanctuary) return;
    sanctuary.classList.add("is-lit");
    statusEl.textContent = "✦ Sacred Diya Lit — Blessings Offered ✦";
    cardEl.hidden = false;

    const miniIcon = document.querySelector(".mini-diya-icon");
    if (miniIcon) miniIcon.classList.add("lit");

    if (playEffects) {
      window.RoyalAudio?.playChime(659.25);
      window.RoyalParticles?.spawnPetalShower("diya-petals-canvas", 36, ["#f09d2e", "#e2789b", "#f5d887"]);
    }
    sessionStorage.setItem(SESSION_KEY, "1");
  }

  function init() {
    const sanctuary = document.querySelector(".diya-sanctuary");
    const btn = document.getElementById("diya-interactive-btn");
    const statusEl = document.getElementById("diya-status-text");
    const cardEl = document.getElementById("diya-blessing-card");
    if (!sanctuary || !btn) return;

    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      ignite(sanctuary, statusEl, cardEl, false);
    }

    btn.addEventListener("click", () => {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        statusEl.textContent = "✦ Your diya is already shining brightly for Aarav & Ananya ✦";
        window.RoyalParticles?.spawnPetalShower("diya-petals-canvas", 18, ["#f09d2e", "#f5d887"]);
        return;
      }
      ignite(sanctuary, statusEl, cardEl, true);
    });
  }

  return { init, igniteFromBar: () => document.getElementById("diya-interactive-btn")?.click() };
})();
