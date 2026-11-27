/* ==========================================================
   THE ONLY FILE YOU EDIT FOR EACH COUPLE.
   Everything below is dummy data. Replace it, save, upload.
   ========================================================== */
window.INVITE = {
  theme: "velvet-card",

  meta: { title: "Aarav & Priya | Wedding Invitation" },

  // Optional opening line above the names (for example a blessing). Leave empty for none.
  invocation: "",

  couple: {
    groom: { first: "Aarav", full: "Aarav Sharma", father: "Rajesh Sharma", mother: "Sunita Sharma" },
    bride: { first: "Priya", full: "Priya Patel",   father: "Suresh Patel",  mother: "Anita Patel" },
    monogram: ["A", "P"]
  },

  message: "With the blessings of our elders, we invite you to celebrate the wedding of Aarav and Priya.",

  closing: { family: "With love, the Sharma and Patel families" },

  wedding: {
    // Use the venue's local time with its UTC offset. India is +05:30.
    dateISO: "2026-12-12T19:15:00+05:30",
    muhurat: "7:15 PM",
    durationHours: 4,
    venue: "The Grand Palace Banquet Hall",
    address: "Near Hiranandani Estate, Ghodbunder Road, Thane West, Maharashtra, India",
    mapsLink: "https://maps.google.com/?q=The+Grand+Palace+Banquet+Hall+Thane"
  },

  // The three functions listed here each get their own full page. Every other function goes into the card deck.
  // Use the "id" of the functions below. Delete an id (or a function) to remove it.
  pages: ["sangeet", "wedding", "reception"],

  // One entry per function. Delete a block to remove a function.
  // icon options in this theme: kalash, haldi, mehendi, sangeet, baraat, pheras, disco (or reception)
  // Optional per function: address, mapsLink, durationHours (for the calendar button).
  functions: [
    { id: "mata-pujan", name: "Mata Pujan",       date: "2026-12-10", time: "10:00 AM", venue: "Sharma Residence, Thane",                 dress: "Traditional Indian attire", colorName: "Ivory and gold", color: "#f4e8c8", icon: "kalash"  },
    { id: "haldi",      name: "Haldi",            date: "2026-12-11", time: "11:00 AM", venue: "The Grand Palace Banquet Hall, Thane",    dress: "Traditional attire",        colorName: "Marigold yellow",   color: "#f2b630", icon: "haldi"   },
    { id: "mehendi",    name: "Mehendi",          date: "2026-12-11", time: "4:00 PM",  venue: "The Grand Palace Banquet Hall, Thane",    dress: "Ethnic attire",             colorName: "Mehendi green",     color: "#7d9446", icon: "mehendi" },
    { id: "sangeet",    name: "Sangeet",          date: "2026-12-11", time: "7:00 PM",  venue: "The Grand Palace Banquet Hall, Thane",    dress: "Festive attire",            colorName: "Rani pink",     color: "#d8467e", icon: "sangeet" },
    { id: "baraat",     name: "Baraat",           date: "2026-12-12", time: "5:30 PM",  venue: "The Grand Palace Banquet Hall, Thane",    dress: "Traditional attire",        colorName: "Saffron orange",    color: "#f08a28", icon: "baraat"  },
    { id: "wedding",    name: "Wedding & Pheras", date: "2026-12-12", time: "7:15 PM",  venue: "The Grand Palace Banquet Hall, Thane",    dress: "Traditional attire",        colorName: "Ivory and gold", color: "#f4e8c8", swatch: "#bb8c38", icon: "pheras", durationHours: 4 },
    { id: "reception",  name: "Reception",        date: "2026-12-13", time: "7:00 PM",  venue: "The Grand Palace Banquet Hall, Thane",    dress: "Formal Indian attire",      colorName: "Maroon and gold", color: "#5a1424", swatch: "#e0b255", icon: "disco"  }
  ],

  // Replace the photo files in assets/photos/ (jpg or webp, 4:5 portrait, about 900px wide).
  gallery: [
    { src: "assets/photos/photo-1.svg", caption: "it started with a hello" },
    { src: "assets/photos/photo-2.svg", caption: "chai, rain and endless talking" },
    { src: "assets/photos/photo-3.svg", caption: "road trips with a shared playlist" },
    { src: "assets/photos/photo-4.svg", caption: "the day we knew" },
    { src: "assets/photos/photo-5.svg", caption: "meeting each other’s families" },
    { src: "assets/photos/photo-6.svg", caption: "he asked, she laughed, then said yes" },
    { src: "assets/photos/photo-7.svg", caption: "ring on, heart full" },
    { src: "assets/photos/photo-8.svg", caption: "next stop: forever" }
  ],

  // Number with country code, digits only. This is a dummy number: replace it.
  rsvp: { enabled: true, whatsapp: "910000000000" },

  // The opening clip. Leave video empty to use the built-in animated gate.
  // Put your Flow clip and two frames from it in assets/entry/ (entry.mp4, poster.jpg = first frame, end.jpg = last frame).
  entry: { video: "assets/entry/entry.mp4", poster: "assets/entry/poster.jpg", endFrame: "assets/entry/end-clean.jpg", tapLabel: "tap to open", videoSound: true },

  // Leave bgm empty to use the built-in generative bells. Or add a licensed MP3:
  //   bgm: "assets/audio/bgm.mp3"
  audio: { bgm: "", volume: 0.5 }
};
