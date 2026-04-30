export const siteConfig = {
  name: "MH LEGAL",
  tagline: "We Build Systems. We Develop People.",
  description: "A South African professional services firm helping businesses scale through legal-operational systems, in-service training programs, and strategic partnerships.",
  url: "https://mhlegal.co.za", // Placeholder
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
