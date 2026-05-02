export type Section = {
  slug: string;
  label: string;
  shortLabel: string;
  tagline: string;
  categories: string[];
};

export const SECTIONS: Section[] = [
  {
    slug: "traditional",
    label: "Traditional Art",
    shortLabel: "Traditional",
    tagline: "Heritage motifs, devotional palettes, and stories painted in pigment.",
    categories: ["Pichhwai Paintings", "Shrinathji Art", "Madhubani Art"],
  },
  {
    slug: "artwork",
    label: "Artwork",
    shortLabel: "Artwork",
    tagline: "Drawings, paintings and design — every line a deliberate breath.",
    categories: [
      "Mandala Art",
      "Pencil Sketch & Shading",
      "Creative & Designer Art",
      "Cartoon Drawings",
      "Abstract / Colorful Designs",
      "Fashion & Dress Design",
    ],
  },
  {
    slug: "crafts",
    label: "Crafts",
    shortLabel: "Crafts",
    tagline: "Sculpted from paper, thread and imagination — small worlds, made by hand.",
    categories: [
      "Themed Creations",
      "Christmas Collection ⭐",
      "Mini Worlds & Models",
      "Paper Garden",
      "Eiffel Tower",
      "Castle",
      "Food Art",
      "Food Paintings",
      "Paper Crafts (Cake, Pastry, etc.)",
      "Floral Creations",
      "Paper Flowers",
      "Paper Home Decor",
      "Candle Stands",
      "Decorative Items",
      "Creative Posters",
      "Handmade Posters",
    ],
  },
  {
    slug: "architectural",
    label: "Architectural Sketches",
    shortLabel: "Architecture",
    tagline: "Lines that build rooms, walls and dreams — drafted by hand.",
    categories: ["Interior Designs (Rooms)", "Exterior Designs (House)"],
  },
  {
    slug: "best-out-of-waste",
    label: "Best Out of Waste",
    shortLabel: "Upcycled",
    tagline: "Thrown away. Reborn beautiful.",
    categories: ["Recycled Crafts", "Upcycled Projects"],
  },
  {
    slug: "rangoli",
    label: "Rangoli",
    shortLabel: "Rangoli",
    tagline: "Color poured on the floor — fleeting, festive, sacred.",
    categories: ["Festive Rangoli", "Competition Rangoli", "Theme Rangoli"],
  }
];

export const sectionBySlug = (slug?: string) => SECTIONS.find((s) => s.slug === slug);
