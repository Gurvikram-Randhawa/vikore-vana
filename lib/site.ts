export const contentCategories = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Small Spaces",
  "Home Decor",
  "Lighting",
  "Indoor Plants",
  "Luxury Decor"
];

export const categoryTiles = [...contentCategories];

export const site = {
  name: "Vikore Vana",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vikore-vana.vercel.app",
  description:
    "Premium home decor, interior design inspiration, furniture finds, small-space ideas, and aesthetic living guides.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/products", label: "Products" },
    { href: "/search", label: "Search" }
  ],
  categories: contentCategories,
  categoryTiles
};

export const categorySlug = (category: string) => category.toLowerCase().replaceAll(" ", "-");
