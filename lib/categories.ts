export const CATEGORIES = [
  { slug: "meat", label: "Meat & Fish" },
  { slug: "oil", label: "Cooking Oil & Ghee" },
  { slug: "pulses", label: "Pulses" },
  { slug: "bakery", label: "Bakery" },
  { slug: "snacks", label: "Snacks" },
  { slug: "beverages", label: "Beverages" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
