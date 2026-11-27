/**
 * Backend API Client with Graceful LocalStorage Fallback
 */
window.WeddingAPI = {
  async getWishes() {
    try {
      const res = await fetch("/api/wishes");
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      return data.wishes || [];
    } catch {
      const saved = localStorage.getItem("wedding_wishes_fallback");
      return saved ? JSON.parse(saved) : [
        {
          id: "seed-1",
          name: "Maharani Gayatri Devi",
          message: "May Lord Ganesha bless your union with eternal harmony, warmth, and a lifetime of shared joy under the royal stars."
        },
        {
          id: "seed-2",
          name: "Rohan & Meera Kapoor",
          message: "Counting down the days to celebrate your royal union in Udaipur! Wishing Aarav and Ananya infinite love and laughter."
        }
      ];
    }
  },

  async postWish(name, message) {
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit wish");
      return data.wish;
    } catch (err) {
      if (err.message && err.message.includes("Please provide")) throw err;
      const entry = { id: "local-" + Date.now(), name, message, createdAt: new Date().toISOString() };
      const existing = await this.getWishes();
      localStorage.setItem("wedding_wishes_fallback", JSON.stringify([entry, ...existing]));
      return entry;
    }
  },

  async getBlessingCount() {
    try {
      const res = await fetch("/api/blessings");
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      return data.blessingCount || 108;
    } catch {
      return parseInt(localStorage.getItem("wedding_blessing_count") || "108", 10);
    }
  },

  async incrementBlessings() {
    try {
      const res = await fetch("/api/blessings", { method: "POST" });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      return data.blessingCount;
    } catch {
      const next = (await this.getBlessingCount()) + 1;
      localStorage.setItem("wedding_blessing_count", String(next));
      return next;
    }
  },

  async submitRsvp(payload) {
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "RSVP submission failed");
      return data.rsvp;
    } catch (err) {
      if (err.message && err.message.includes("Please")) throw err;
      const list = JSON.parse(localStorage.getItem("wedding_rsvps_fallback") || "[]");
      const entry = { id: "local-rsvp-" + Date.now(), ...payload };
      localStorage.setItem("wedding_rsvps_fallback", JSON.stringify([entry, ...list]));
      return entry;
    }
  }
};
