/**
 * Central Wedding Configuration
 */
window.WEDDING_CONFIG = {
  couple: {
    bride: "Ananya",
    groom: "Aarav",
    brideFull: "Ananya Singhania",
    groomFull: "Aarav Rathore",
    monogram: "A & A",
    tagline: "Two Souls, One Royal Destiny",
    hashtag: "#AaravKiAnanya",
    dateDisplay: "14 February 2027",
    isoDate: "2027-02-14T18:30:00+05:30",
    city: "Udaipur, Rajasthan"
  },

  venue: {
    name: "The Taj Lake Palace & Zenana Mahal",
    subtitle: "Heritage Royal Courtyard",
    address: "Pichola Lakefront, City Palace Complex, Udaipur, Rajasthan 313001",
    mapQuery: "City+Palace+Udaipur+Rajasthan+India",
    lat: 24.5764,
    lng: 73.6835,
    description:
      "Perched beside the tranquil waters of Lake Pichola, this seventeenth-century sandstone sanctuary glows with hand-carved jharokhas, mirrored courtyards, and timeless Mewar hospitality."
  },

  surpriseMessages: [
    "“In every lifetime, amidst a thousand lanterns, my heart would still find yours.” — Aarav to Ananya",
    "Secret Note: Look closely at the palace arches — our initials are woven into the royal moonlight.",
    "Royal Blessing: May your love bloom like Udaipur bougainvillea through every season to come.",
    "Fun Fact: We first met during a sudden monsoon shower under a sandstone colonnade in Jaipur!"
  ],

  storyChapters: [
    {
      chapter: "Chapter I",
      title: "The First Meet",
      date: "18 October 2022",
      location: "Amer Courtyard, Jaipur",
      artworkKey: "story1",
      story:
        "An unexpected October rain drew two strangers beneath the same carved sandstone arch. What began as a shared cup of cardamom chai and a quiet laugh over soaked umbrellas lingered long after the clouds parted."
    },
    {
      chapter: "Chapter II",
      title: "The Bond",
      date: "04 March 2024",
      location: "Lake Pichola, Udaipur",
      artworkKey: "story2",
      story:
        "Through sunlit road trips, late-night playlists, and festive family gatherings, friendship deepened into an unspoken certainty—that home was no longer a place, but the person walking beside us."
    },
    {
      chapter: "Chapter III",
      title: "The Proposal",
      date: "22 November 2025",
      location: "Sajjangarh Terrace",
      artworkKey: "story3",
      story:
        "As brass lanterns flickered along the marble parapet and rose petals drifted in the evening breeze, Aarav knelt beneath the twilight sky and asked the question Ananya’s heart had already answered."
    },
    {
      chapter: "Chapter IV",
      title: "The Big Day",
      date: "14 February 2027",
      location: "Zenana Mahal, Udaipur",
      artworkKey: "story4",
      story:
        "Beneath a four-pillared mandap draped in jasmine and marigolds, surrounded by our dearest family and friends, we take our seven sacred vows to begin forever."
    }
  ],

  experiences: [
    {
      id: "mehendi",
      name: "Mehendi",
      subtitle: "Marigold & Henna Courtyard",
      date: "13 February 2027",
      time: "1:00 PM – 5:00 PM",
      venue: "Champa Bagh Gardens",
      attire: "Vibrant Pastels & Marigold Hues",
      artworkKey: "mehendi",
      description:
        "An afternoon of artisanal henna, floral swings draped in pink bougainvillea, brass urli bowls with floating rose petals, folk musicians, and chilled saffron thandai.",
      calendarStart: "20270213T130000",
      calendarEnd: "20270213T170000"
    },
    {
      id: "sangeet",
      name: "Sangeet",
      subtitle: "Starlit Music & Dance Gala",
      date: "13 February 2027",
      time: "7:30 PM Onwards",
      venue: "Durbar Courtyard",
      attire: "Regal Indo-Western & Shimmer",
      artworkKey: "sangeet",
      description:
        "Underneath hundreds of warm palace lanterns and illuminated jharokha arches, both families take the royal stage for choreographed dances, live Sufi melodies, and midnight feasting.",
      calendarStart: "20270213T193000",
      calendarEnd: "20270213T233000"
    },
    {
      id: "wedding",
      name: "Wedding",
      subtitle: "Sacred Vows & Royal Baraat",
      date: "14 February 2027",
      time: "6:30 PM – 10:30 PM",
      venue: "Zenana Mahal Mandap",
      attire: "Traditional Heritage Silks",
      artworkKey: "wedding",
      description:
        "A grand twilight baraat followed by the jaimala and sacred pheras inside a four-pillared floral mandap adorned with cascading jasmine, roses, and glowing brass diyas.",
      calendarStart: "20270214T183000",
      calendarEnd: "20270214T223000"
    },
    {
      id: "reception",
      name: "Reception",
      subtitle: "Candlelit Royal Banquet",
      date: "15 February 2027",
      time: "8:00 PM Onwards",
      venue: "Sheesh Mahal Ballroom",
      attire: "Royal Velvet & Champagne Gold",
      artworkKey: "reception",
      description:
        "An opulent evening beneath crystal chandeliers with a curated Mewar royal banquet, champagne toasts, and classical instrumental ensembles.",
      calendarStart: "20270215T200000",
      calendarEnd: "20270215T235500"
    }
  ],

  dressCode: [
    {
      id: "bride-side",
      title: "Bride’s Side",
      subtitle: "Team Ananya",
      badge: "Blush Rose & Champagne",
      artworkKey: "women",
      outfits: ["Silk Lehenga", "Banarasi Saree", "Embroidered Anarkali"],
      colors: ["#e88ea8", "#f6efe2", "#d4af37"],
      colorNames: "Rose Quartz, Champagne Ivory & Antique Gold",
      tip: "Pair delicate zari or gota-patti embroidery with heirloom kundan earrings and floral gajras."
    },
    {
      id: "groom-side",
      title: "Groom’s Side",
      subtitle: "Team Aarav",
      badge: "Midnight Navy & Gold",
      artworkKey: "men",
      outfits: ["Ivory Sherwani", "Velvet Bandhgala", "Jodhpuri Achkan"],
      colors: ["#0d1832", "#d4af37", "#f6efe2"],
      colorNames: "Midnight Navy, Antique Gold & Ivory",
      tip: "Elevate classic silhouettes with a handcrafted pocket square, brocade stole, or royal safa."
    },
    {
      id: "womens-attire",
      title: "Women’s Traditional",
      subtitle: "Timeless Grace",
      badge: "Heritage Silhouettes",
      artworkKey: "women",
      outfits: ["Handloom Saree", "Floor-Length Anarkali", "Indo-Western Cape"],
      colors: ["#d96b8a", "#c89b3c", "#f3e6d0"],
      colorNames: "Bougainvillea Pink, Burnished Gold & Parchment",
      tip: "Breathable organza and Chanderi silks are ideal for lakeside evening breezes."
    },
    {
      id: "mens-attire",
      title: "Men’s Traditional",
      subtitle: "Regal Tailoring",
      badge: "Royal Silhouettes",
      artworkKey: "men",
      outfits: ["Silk Kurta & Nehru Jacket", "Bandhgala Suit", "Classic Sherwani"],
      colors: ["#142447", "#e8d5b0", "#b8892d"],
      colorNames: "Royal Indigo, Champagne Silk & Brass Gold",
      tip: "Complete the look with handcrafted mojaris and antique brass buttons."
    }
  ]
};
