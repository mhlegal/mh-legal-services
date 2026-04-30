export const siteConfig = {
  name: "MH LEGAL",
  tagline: "We Build Systems. We Develop People.",
  description: "A multi-disciplinary professional services firm in South Africa. We provide systems and people to growing businesses — operational support, business solutions, and trained talent that scale with your enterprise.",
  url: "https://mhlegal.co.za", // Placeholder
  leadership: {
    managingDirector: {
      name: "Philani Mbooi",
      title: "Managing Director"
    }
  },
  contact: {
    email: "info@mhlegal.co.za",
    whatsapp: "+27 73 785 3867",
    whatsappUrl: "https://wa.me/27737853867",
    location: "South Africa"
  },
  nav: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Training", path: "/training" },
    { name: "Partnerships", path: "/partnerships" },
    { name: "Contact", path: "/contact" }
  ]
};

export type SiteConfig = typeof siteConfig;
